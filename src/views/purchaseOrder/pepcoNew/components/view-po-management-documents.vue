<template>
  <div>
    <el-empty v-show="documentList.length === 0" description="No Document" class="custom-empty"></el-empty>
    <div>
      <div v-if="documentList.length > 0">
        <el-table :data="documentList" v-loading="tableLoading">
          <el-table-column prop="documentNumber" label="Document Number" align="center" />
          <!--          <el-table-column prop="poNumber" label="PO Number" align="center" />-->
          <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
          <el-table-column prop="typeCode" label="Document Type" align="center">
            <template #default="scope">
              <span>{{ uploadTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="blType" label="BL Type" align="center">
            <template slot-scope="scope">
              <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />

          <el-table-column v-if="checkPermi(['po:document:factory:show'])" prop="factory" label="Factory" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.factory==1 ? 'True' : 'False' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Action" align="center">
            <template #default="scope">
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
              <!-- <el-link type="primary" :href="scope.row.fileUrl">
              <el-button type="primary" icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"></el-button>
            </el-link>
              <el-button type="primary" @click="viewDocument(scope.row)" icon="el-icon-view" style="margin-right: 6px"></el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <office-preview ref="officePreview"></office-preview>
  </div>
</template>

<script>
import { getFileByShipmentId, getPoRelatedOrderFile, getPoRelatedOrderFileById } from '@/api/pepco/shipping-order'
import { orderFileList } from '@/api/pepco/order-file'
import officePreview from './office-preview.vue'
import { getUserProfile } from '@/api/system/user'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数

export default {
  components: { officePreview },

  data() {
    return {
      tableLoading: false,
      localVisible: false, // 控制弹窗显示的状态
      documentList: [], // 存储文件列表
      uploadTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Inspection Status', value: '07' },
        { label: 'CLP', value: '08' },
        { label: 'ICS2', value: '11' },
        { label: 'Manifest', value: '12' },
        { label: 'Shipper Booking Others', value: '13' },
        { label: 'Invoice to Supplier', value: '14' }
      ],
      user: {},

      orderNumbers: [] // 存储订单号列表
    }
  },

  methods: {
    checkPermi,
    viewDocument(file) {
      this.$refs.officePreview.previewDocument(file)
    },
    getOrderFile(orderId) {
      getUserProfile().then(response => {
        this.user = response.data
        this.tableLoading = true
        orderFileList({ orderHeaderId: orderId }).then(response => {
          if (this.user.isFactory) {
            this.documentList = []
            for (var file of response.data) {
              console.log(file.creator)
              console.log(this.user.id)
              if (file.creator == this.user.id + '') {
                this.documentList.push(file)
              }
            }
          } else {
            this.documentList = response.data
          }
          //按typeCode进行排序
          this.documentList.sort(this.compare('typeCode'))
          this.tableLoading = false
        })
      })
    },
    //由shipmentId查询表数据
    getFiles(shippingOrderId) {
      getUserProfile().then(response => {
        this.user = response.data

        this.tableLoading = true
        //获取所有的文件类型
        //const arr = ['01', '02', '03', '04', '05', '06', '07']
        getFileByShipmentId({ shippingOrderId: shippingOrderId }).then(response => {
          // console.log('response')
          // console.log(response)
          if (this.user.isFactory) {
            this.documentList = []
            for (var file of response.data) {
              console.log(file.creator)
              console.log(this.user.id)
              if (file.creator == this.user.id + '') {
                this.documentList.push(file)
              }
            }
          } else {
            this.documentList = response.data
          }
          // 将response.data 中间的orderNumber 提取出来组成数组，并去重
          this.orderNumbers = Array.from(new Set(response.data.map(doc => doc.orderHeaderId))).map(orderHeaderId => {
            return this.documentList.find(doc => doc.orderHeaderId === orderHeaderId)
          })
          // 将文件按照fileId去重
          this.documentList = Array.from(new Set(response.data.map(doc => doc.fileId))).map(fileId => {
            return this.documentList.find(doc => doc.fileId === fileId)
          })
          function compare(property) {
            return function (obj1, obj2) {
              let value1 = parseInt(obj1[property])
              let value2 = parseInt(obj2[property])
              return value1 - value2
            }
          }
          //按typeCode进行排序
          this.documentList.sort(compare('typeCode'))
          this.tableLoading = false
        })
      })
    },
    compare(property) {
      return function (obj1, obj2) {
        let value1 = parseInt(obj1[property])
        let value2 = parseInt(obj2[property])
        return value1 - value2
      }
    },
    getFileByShippingOrderId(shippingOrderId) {
      this.tableLoading = true
      orderFileList({ shippingOrderId: shippingOrderId }).then(response => {
        this.documentList = response.data
        //按typeCode进行排序
        this.documentList.sort(this.compare('typeCode'))
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
.icon-large {
  font-size: 30px; /* 方案1: 直接设置字体大小 */
  /* transform: scale(1.5);  方案2: 使用缩放 */
  cursor: pointer;
}

.tools-but {
  text-align: right;
}

.card-item {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-layout {
  display: flex;
  align-items: center;
}

.checkbox-left {
  margin-right: 10px;
}

.po-number-left {
  padding-left: 5px;
  white-space: nowrap;
}

/* 覆盖 el-descriptions 默认样式 */
::v-deep(.el-descriptions-item__content) {
  display: flex;
  align-items: center;
}

.custom-empty {
  transform: scale(0.6);
  height: 100px;
  transform-origin: top center;
}
</style>
