<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <el-dialog :visible.sync="localVisible" title="Pepco Booking Score" @close="handleDialogClose" width="80%">
      <el-card class="box-card" style="max-height: 600px;overflow: auto; ">
        <!-- v-hasPermi="['order:header:import']"
          增加权限控制
        -->
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <span @click="handleImport">
            <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
        <el-card class="pd-20">
          <div slot="header" class="clearfix" style="padding-bottom: 10px; ">
            <el-button style="float: right;" type="primary" @click="handleShipmentClick">Add / Remove</el-button>
          </div>
        </el-card>

        <div>
          <div v-for="(shipping, index) in data" :key="index" class="shipment-section">
            <el-card class="box-card">
              <h4 style="color: blue;padding-left: 10px; padding-top: 10px;padding-bottom: 10px;">Shipper Booking Number: {{ shipping.shippingNumber }}</h4>
              <el-table :data="shipping.poList" :row-class-name="tableRowClassName" :header-cell-class-name="headerCellStyle" border style="width: 100%">
                <el-table-column prop="orderNumber" label="Order Number" min-width="130px" align="center"></el-table-column>
                <el-table-column label="Shipper Booking Number" align="center" min-width="140px" prop="soRef" />
                <el-table-column label="Pending Booking Status" align="center" min-width="140px" prop="status">
                  <template #default="scope">{{ getStatusLabel(scope.row.status) }}</template>
                </el-table-column>
                <el-table-column label="Origin Port(PO)" align="center" min-width="120" prop="pol" />
                <el-table-column prop="deliveryDate" label="DC Date(PO)" min-width="100" align="center">
                  <template #default="scope">{{ scope.row.deliveryDate }}</template>
                </el-table-column>
                <el-table-column prop="planCrdDate" label="Plan CRD(PO)" min-width="100" align="center">
                  <template #default="scope">{{ scope.row.planCrdDate }}</template>
                </el-table-column>
                <el-table-column prop="cargoHandoverDate" label="HOD(PO)" min-width="100" align="center">
                  <template #default="scope">{{ scope.row.cargoHandoverDate }}</template>
                </el-table-column>
                <el-table-column label="ETD(Pre Assign)" align="center" min-width="100" prop="etd"></el-table-column>
                <el-table-column label="ETA(Pre Assign)" align="center" min-width="100" prop="eta"></el-table-column>
                <el-table-column prop="orderCbm" label="Order Cube" min-width="100" align="center"></el-table-column>
                <el-table-column prop="itemNumber" label="PLU" min-width="120" align="center"></el-table-column>
                <el-table-column prop="merchCode" label="Merch Code" min-width="100" align="center"></el-table-column>
                <el-table-column prop="promoCode" label="Promo Code" min-width="100" align="center">
                  <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.promoCode" placement="top">
                      <span class="text-overflow">{{ scope.row.promoCode }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="incoterm" label="Incoterm" min-width="100" align="center"></el-table-column>
                <el-table-column prop="mode" label="Transport Mode" min-width="100" align="center"></el-table-column>
                <!-- <el-table-column label="Status" min-width="100" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{ scope.row.status === '0' ? 'Open' : 'Close' }}</el-tag>
                  </template>
                </el-table-column>-->
                <el-table-column label="Order Score" min-width="160" align="center">
                  <template #default="scope">
                    <el-input
                      v-model.number="scope.row.orderScore"
                      placeholder="For Example [1,2,3,4]"
                      @input="validateOrderScore($event, scope.row, shipping)"
                      :rules="[{ required: true, message: 'Order Score is required', trigger: 'blur' }]"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Shipment Score" min-width="160" align="center">
                  <template #default="scope">
                    <el-input v-model.number="scope.row.shipmentScore" @input="validateShipmentOrderScore($event, scope.row, shipping)" placeholder="For Example [1,2,3,4]"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Submit</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        accept=".xlsx, .xls, .xml"
        :headers="upload.headers"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        :action="upload.url"
        drag
        multiple
        :timeout="3000000"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
          </div>-->
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="upload.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <shipment-dialog ref="shipmentDialog" @submit="refresh" />
  </div>
</template>

<script>
import { getPoRelatedOrderFile, getBookingScoreData, saveBookingScore, getShipmentOrderItemList, exportBookingScoreTemplate } from '@/api/pepco/shipping-order'
import { updateTask } from '@/api/order/task'
import shipmentDialog from './shipment-dialog.vue'
import { getBaseHeader } from '@/utils/request'
import { IconPark } from '@icon-park/vue/es/all'
export default {
  name: 'PepcoBookingScore',
  components: { shipmentDialog, IconPark },
  props: {
    receivedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localVisible: false, // 控制弹窗显示的状态
      documentList: [], // 存储文件列表
      disabled: false, // 控制复选框的状态
      uploadTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' }
      ],
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      taskId: '',
      task: {},
      data: [],
      queryData: {
        orderHeaderId: '',
        shipmentId: []
      },
      shippingInfo: {},
      score: 1,
      minScore: 1,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        //上传弹窗
        uploadOpen: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/pepco/shipping/order/import-booking-score'
      },
      productMap: {},
      activeTabName: 'first',
      importData: [],
      shippingStatus: [
        { label: 'MOOV-OHA Pending', value: '0' },
        { label: 'MOOV-OHA Accepted', value: '1' },
        { label: 'MOOV-OHA Rejected', value: '2' },
        { label: 'SAApproved', value: '4' },
        { label: 'Awaiting Approval', value: '5' },
        { label: 'Pepco Pending', value: '6' },
        { label: 'Pepco Rejected', value: '7' }
      ],
      uploading: false
    }
  },

  methods: {
    openDialog(rows) {
      console.log('this.rows', rows)
      console.log('this.queryData', this.queryData)
      this.task = rows
      this.queryData = {}
      this.queryData.orderHeaderId = rows.orderId
      console.log('this.queryData1', this.queryData)
      this.localVisible = true
      this.getBookingScoreData()
      this.activeTabName = 'first'
    },

    getBookingScoreData() {
      console.log('this.queryData', this.queryData)
      getBookingScoreData(this.queryData).then(response => {
        this.data = response.data
        this.shippingInfo = response.data[0]
        console.log('this.shippingInfo ', this.shippingInfo)
      })
    },
    handleConfirm() {
      if (this.data.filter(item => item.poList.some(po => po.orderScore === null || po.shipmentScore === null)).length > 0) {
        this.$message({
          type: 'error',
          message: 'Please fill in all scores before submitting.'
        })
        return
      }
      if (this.data.filter(item => item.poList.some(po => po.shipmentScore === null)).length > 0) {
        this.$message({
          type: 'error',
          message: 'Please fill in all scores before submitting.'
        })
        return
      }
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          console.log('this.this.data', this.data)
          saveBookingScore(this.data).then(response => {
            if (response.code != null || response.code == 0) {
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              this.localVisible = false
              this.data = []
              this.$emit('refresh', this.selectedTable)
            }
          })
        })
        .catch(() => {})
    },
    covTypeCode(code) {
      const item = this.uploadTypes.find(type => type.value === code)
      return item ? item.label : ''
    },
    handleClose() {
      this.RefuseDialog = false
      this.refuseContent = ''
      this.data = []
    },
    handleCancel() {
      this.data = []
      this.localVisible = false
    },
    handleShipmentClick() {
      console.log('handleShipmentClick', this.shippingInfo)
      this.$refs.shipmentDialog.openDialog(this.shippingInfo)
    },
    refresh(rows) {
      console.log('refresh', rows)
      this.queryData.orderHeaderId = ''
      this.queryData.shipmentId = rows.map(item => item.id)
      this.data = []
      getBookingScoreData(this.queryData).then(response => {
        this.data = this.data.concat(response.data)
        console.log('this.data111', this.data)
      })
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row'
      } else {
        return 'dan-row'
      }
    },
    headerCellStyle({ column, columnIndex }) {
      if (columnIndex === 0) {
        return 'hiddenCheck'
      }
    },
    validateOrderScore(value, row, shipping) {
      const score = parseInt(value)
      if (![1, 2, 3, 4].includes(score)) {
        row.orderScore = ''
        this.$message.error('Please enter a number for [1,2,3,4]')
        return
      }
      row.orderScore = score
      this.$set(row, 'orderScore', score)
      this.updateShipmentScores(shipping)
    },
    validateShipmentOrderScore(value, row, shipping) {
      const score = parseInt(value)
      if (![1, 2, 3, 4].includes(score)) {
        row.shipmentScore = ''
        this.$message.error('Please enter a number for [1,2,3,4]')
        return
      }
      if (score > this.minScore) {
        this.$message.error('Shipment score cannot be less than the minimum order score')
        return
      }
      shipping.poList.forEach(order => {
        this.$set(order, 'shipmentScore', score)
      })
    },
    updateShipmentScores(shipping) {
      console.log('updateShipmentScores', shipping)
      // 获取所有orderScore
      const orderScores = shipping.poList.map(order => order.orderScore).filter(score => score !== null && score !== undefined)

      // 如果有有效分数，设置最小值
      if (orderScores.length > 0) {
        this.minScore = Math.min(...orderScores)
        shipping.poList.forEach(order => {
          this.$set(order, 'shipmentScore', this.minScore)
        })
      }
    },
    handleDialogClose() {
      this.shippingInfo = {}
      this.localVisible = false
    },
    handleImport() {
      console.log(111)
      this.upload.title = 'Import'
      this.upload.open = true
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/shipping/order/import-booking-score'
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log('文件上传失败')
      console.log('文件上传失败')
      console.log(err)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log('文件上传成功')
      console.log('上传的返回值', response.data)
      if (response.code == null || response.code !== 0) {
        console.log('上传的返回值', response.data)
        this.$modal.msgError(response.msg)
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        return
      }
      console.log('上传的返回值111', this.data)
      // 将结果添加到this.data中
      this.data = response.data
      // this.data = this.data.concat(this.importData)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },
    // 文件上传失败处理

    /** 下载模板操作 */
    importTemplate() {
      exportBookingScoreTemplate().then(response => {
        this.$download.excel(response, 'Booking Score.xlsx')
      })
    },
    renderHeader(h, { column }) {
      return h('span', {}, [h('span', {}, column.label.split('/')[0]), h('br'), h('span', {}, column.label.split('/')[1])])
    },
    handleClick(el, order) {
      console.log('点击了tab', el, order)
      console.log('handleClick', el, order)
      this.toggleLoading(order.id)
    },
    async toggleLoading(index) {
      this.$set(this.loadingMap, index, !this.loadingMap[index])
    },
    getStatusLabel(status) {
      const statusObj = this.shippingStatus.find(item => item.value === status)
      return statusObj ? statusObj.label : ''
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
.shipment-section {
  margin-bottom: 20px;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
}
</style>
