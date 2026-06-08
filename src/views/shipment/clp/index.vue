<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card v-if="isOHA" style="padding: 15px;">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="Pending" name="Padding">
          <!-- Padding -->
          <el-row :gutter="10" class="mb8">
            <el-col :span="3">
              <el-input v-model="queryParams.shipmentRef" :placeholder="$t('clp.shipmentRef')" @input.native="queryParams.shipmentRef = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.bookingNumber" :placeholder="$t('clp.bookingNumber')" @input.native="queryParams.bookingNumber = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.orderNumber" placeholder="Order Number" @input.native="queryParams.orderNumber = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.soRef" placeholder="Shipper Booking Number" @input.native="queryParams.soRef = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.containerNo" placeholder="Container No" @input.native="queryParams.containerNo = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-select v-model="queryParams.pol" placeholder="POL" clearable>
                <el-option v-for="item in polList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-col>

            <el-col :span="1.5">
              <el-button plain icon="el-icon-search" size="mini" style="background-color: #004F7C; color: white;" @click="queryParams.pageNo = 1; getPage()">
                {{ $t("search.search")
                }}
              </el-button>
            </el-col>
            <div style="float: right">
              <el-button type="primary" v-hasPermi="['shipment:clp:create']" @click="addClp">Add CLP</el-button>
            </div>
            <!-- <el-col :span="1.5">
                    <el-button plain icon="el-icon-download" size="mini" @click="handleExport">{{ $t("search.export")
                      }}</el-button>
            </el-col>-->
          </el-row>

          <el-table :height="height" :data="tableData" style="width: 100%" v-loading="tableLoading">
            <el-table-column prop="bookingNumber" min-width="190" :label="$t('clp.shipmentRef')"></el-table-column>
            <el-table-column prop="shipmentBookingNumber" min-width="180" :label="$t('clp.bookingNumber')"></el-table-column>
            <el-table-column prop="soNumbers" min-width="180" label="Shipper Booking Number"></el-table-column>

            <el-table-column prop="address" :label="$t('clp.orderNumber')" min-width="350">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in uniqueByKey(scope.row.shipmentClpDetailDOS,'orderNumber')" :key="index">
                  {{
                  item.orderNumber
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalWeight" :label="$t('clp.totalWeight')" min-width="120"></el-table-column>
            <el-table-column prop="totalCbm" :label="$t('clp.totalCbm')" min-width="120"></el-table-column>
            <el-table-column prop="siDate" label="Carrier SI Status" min-width="120">
              <template v-slot="scope">
                {{
                scope.row.siDate ? "Done" : "Pending"
                }}
              </template>
            </el-table-column>
			<el-table-column prop="pol" min-width="120" :label="$t('clp.pol')"></el-table-column>
            <el-table-column prop="createTime" :label="$t('clp.createDate')" max-width="150">
              <template v-slot="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('clp.updateDate')" max-width="150">
              <template v-slot="scope">{{ scope.row.updateTime ? formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset)  : "" }}</template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('clp.opa')" fixed="right" min-width="120">
              <template v-slot="scope">
                <el-button v-hasPermi="['shipment:clp:update']" type="text" @click="update(scope.row)">Update</el-button>
                <el-button type="text" @click="detail(scope.row)">Detail</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 15, 30, 50]" @pagination="getPage" />
        </el-tab-pane>
        <el-tab-pane label="Done" name="Done">
          <!-- Done -->
          <el-row :gutter="10" class="mb8">
            <el-col :span="3">
              <el-input v-model="queryParams.shipmentRef" :placeholder="$t('clp.shipmentRef')" @input.native="queryParams.shipmentRef = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.bookingNumber" :placeholder="$t('clp.bookingNumber')" @input.native="queryParams.bookingNumber = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.orderNumber" placeholder="Order Number" @input.native="queryParams.orderNumber = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.soRef" placeholder="Shipper Booking Number" @input.native="queryParams.soRef = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-input v-model="queryParams.containerNo" placeholder="Container No" @input.native="queryParams.containerNo = $event.target.value.trim()" />
            </el-col>
            <el-col :span="3">
              <el-select v-model="queryParams.pol" placeholder="POL" clearable>
                <el-option v-for="item in polList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-col>

            <el-col :span="1.5">
              <el-button plain icon="el-icon-search" style="background-color: #004F7C; color: white;" size="mini" @click="queryParams.pageNo = 1; getPage()">
                {{ $t("search.search")
                }}
              </el-button>
            </el-col>
            <div style="float: right">
              <el-button type="primary" v-hasPermi="['shipment:clp:create']" @click="addClp">Add CLP</el-button>
            </div>
            <!-- <el-col :span="1.5">
                    <el-button plain icon="el-icon-download" size="mini" @click="handleExport">{{ $t("search.export")
                      }}</el-button>
            </el-col>-->
          </el-row>

          <el-table :height="height" :data="tableData" style="width: 100%" v-loading="tableLoading">
            <el-table-column prop="bookingNumber" min-width="190" :label="$t('clp.shipmentRef')"></el-table-column>
            <el-table-column prop="shipmentBookingNumber" min-width="180" :label="$t('clp.bookingNumber')"></el-table-column>
            <el-table-column prop="soNumbers" min-width="180" label="Shipper Booking Number"></el-table-column>

            <el-table-column prop="address" :label="$t('clp.orderNumber')" min-width="350">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in uniqueByKey(scope.row.shipmentClpDetailDOS,'orderNumber')" :key="index">
                  {{
                  item.orderNumber
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalWeight" :label="$t('clp.totalWeight')" min-width="120"></el-table-column>
            <el-table-column prop="totalCbm" :label="$t('clp.totalCbm')" min-width="120"></el-table-column>
            <el-table-column prop="siDate" label="Carrier SI Status" min-width="120">
              <template v-slot="scope">
                {{
                scope.row.siDate ? "Done" : "Pending"
                }}
              </template>
            </el-table-column>
			<el-table-column prop="pol" min-width="120" :label="$t('clp.pol')"></el-table-column>
            <el-table-column prop="createTime" :label="$t('clp.createDate')" max-width="150">
              <template v-slot="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('clp.updateDate')" max-width="150">
              <template v-slot="scope">{{ scope.row.updateTime ? formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset)  : "" }}</template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('clp.opa')" fixed="right" min-width="120">
              <template v-slot="scope">
                <el-button v-hasPermi="['shipment:clp:update']" type="text" @click="update(scope.row)">Update</el-button>
                <el-button type="text" @click="detail(scope.row)">Detail</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 15, 30, 50]" @pagination="getPage" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card v-if="!isOHA" style="padding: 15px;">
      <el-row :gutter="10" class="mb8">
        <el-col :span="3">
          <el-input v-model="queryParams.shipmentRef" :placeholder="$t('clp.shipmentRef')" @input.native="queryParams.shipmentRef = $event.target.value.trim()" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="queryParams.bookingNumber" :placeholder="$t('clp.bookingNumber')" @input.native="queryParams.bookingNumber = $event.target.value.trim()" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="queryParams.orderNumber" placeholder="Order Number" @input.native="queryParams.orderNumber = $event.target.value.trim()" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="queryParams.soRef" placeholder="Shipper Booking Number" @input.native="queryParams.soRef = $event.target.value.trim()" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="queryParams.containerNo" placeholder="Container No" @input.native="queryParams.containerNo = $event.target.value.trim()" />
        </el-col>
		<el-col :span="3">
          <el-select v-model="queryParams.pol" placeholder="POL" clearable>
            <el-option v-for="item in polList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button plain icon="el-icon-search" style="background-color: #004F7C; color: white;" size="mini" @click="queryParams.pageNo = 1; getPage()">
            {{ $t("search.search")
            }}
          </el-button>
        </el-col>
        <div style="float: right">
          <el-button type="primary" v-hasPermi="['shipment:clp:create']" @click="addClp">Add CLP</el-button>
        </div>
        <!-- <el-col :span="1.5">
          <el-button plain icon="el-icon-download" size="mini" @click="handleExport">{{ $t("search.export")
            }}</el-button>
        </el-col>-->
      </el-row>

      <el-table :height="height" :data="tableData" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="bookingNumber" min-width="190" :label="$t('clp.shipmentRef')"></el-table-column>
        <el-table-column prop="shipmentBookingNumber" min-width="180" :label="$t('clp.bookingNumber')"></el-table-column>
        <el-table-column prop="soNumbers" min-width="180" label="Shipper Booking Number"></el-table-column>
        <el-table-column prop="contaienrNo" label="Container No" min-width="200">
          <template v-slot="scope">
            <el-tag v-for="(containerNo, index) in scope.row.containerNos" :key="index">
              {{
              containerNo
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="address" :label="$t('clp.orderNumber')" min-width="350">
          <template v-slot="scope">
            <el-tag v-for="(item, index) in uniqueByKey(scope.row.shipmentClpDetailDOS,'orderNumber')" :key="index">
              {{
              item.orderNumber
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pol" min-width="120" :label="$t('clp.pol')"></el-table-column>
        <el-table-column prop="totalWeight" :label="$t('clp.totalWeight')" min-width="120"></el-table-column>
        <el-table-column prop="totalCbm" :label="$t('clp.totalCbm')" min-width="120"></el-table-column>
        <el-table-column prop="createTime" :label="$t('clp.createDate')" max-width="150">
          <template v-slot="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('clp.updateDate')" max-width="150">
          <template v-slot="scope">{{ scope.row.updateTime ? formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset)  : "" }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('clp.opa')" fixed="right" min-width="120">
          <template v-slot="scope">
            <el-button v-hasPermi="['shipment:clp:update']" type="text" @click="update(scope.row)">Update</el-button>
            <el-button type="text" @click="detail(scope.row)">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 15, 30, 50]" @pagination="getPage" />
    </el-card>

    <!-- 对话框(上传/下载模板) -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t('purchaseOrder.DragTheFileHereOr') }}
          <em>
            {{ $t('purchaseOrder.clickUpload')
            }}
          </em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <!--          <div class="el-upload__tip" slot="tip">-->
          <!--            <el-checkbox v-model="upload.updateSupport" /> {{ $t('purchaseOrder.whetherToUpdateExistingData') }}-->
          <!--          </div>-->
          <div>{{ $t('purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed') }}</div>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">{{ $t('purchaseOrder.downloadingTheTemplate') }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">
          {{ $t('el.popconfirm.confirmButtonText')
          }}
        </el-button>
        <el-button size="mini" @click="upload.open = false">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportClpExcel, importTemplate } from '@/api/shipment/clp'
import { exportClpDetailExcel, getImportTemplate } from '@/api/shipment/clpDetail'
import { getItemList } from '@/api/order/item'
import { getBaseHeader } from '@/utils/request'
import { uniqueByKey} from '@/utils'
import { pepcoGetClpPage, getClpFilterList } from '@/api/shipment/pepcoclp'
import { getUserCompanyTypeList } from '@/api/system/user'

export default {
  name: 'CLP',
  components: {},
  data() {
    return {
      activeName: 'Padding',
      tableData: [],
      lineTotal: 0,
      height: '',
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        shipmentNumber: null,
        bookingNumber: null,
        pol: null,
        status: null
      },
      tableLoading: false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/shipment/clp-detail/import'
      },
      // 用户所在的公司类型列表
      userCompanyTypeList: [],
      polList: [],
      isOHA: false
    }
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    this.calcHeight()
    console.log('mounted')
    getClpFilterList().then(res => {
      this.polList = res.data || []
    })

    getUserCompanyTypeList().then(response => {
      console.log('获取用户所在的公司类型列表')
      console.log(response.data)
      this.userCompanyTypeList = response.data
      if (this.userCompanyTypeList) {
        console.log(this.userCompanyTypeList)
        if (this.userCompanyTypeList.includes('OHA')) {
          this.isOHA = true
          this.queryParams.status = 'Padding'
        }
      }
      this.getPage()
    })
  },
  methods: {
    uniqueByKey,
    handleClick(e) {
      console.log(e)
      this.queryParams.pageNo = 1
      if (e.index == '1') {
        this.queryParams.status = 'Done'
      } else {
        this.queryParams.status = 'Padding'
      }
      this.getPage()
    },
    calcHeight() {
      var clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 300 + 'px'
    },
    update(row) {
      this.$router.push('/shipment/clp/add?id=' + row.id)
    },
    detail(row) {
      this.$router.push('/shipment/clp/detail?id=' + row.id)
    },
    getPage() {
      this.tableLoading = true
      pepcoGetClpPage(this.queryParams).then(response => this.clpPageCallBack(response))
    },
    async clpPageCallBack(response) {
      this.loading = false
      this.tableLoading = false
      this.tableData = response.data.list
      this.lineTotal = response.data.total

      for (var i = 0; i < this.tableData.length; i++) {
        var row = this.tableData[i]
        var containerNos = new Set()
        for (var detail of row.shipmentClpDetailDOS) {
          console.log(detail)
          if (detail.containerNo != null && detail.containerNo != '') {
            containerNos.add(detail.containerNo)
          }
        }
        row.containerNos = containerNos
      }

      // var orderItemIds = [];
      // for (var i = 0; i < this.tableData.length; i++) {
      //   for (var j = 0; j < this.tableData[i].shipmentClpDetailDOS.length; j++) {
      //     orderItemIds.push(this.tableData[i].shipmentClpDetailDOS[j].orderItemId);
      //   }
      // }

      // var res = await getItemList({ ids: orderItemIds.join(",") });
      // for (var i = 0; i < this.tableData.length; i++) {
      //   for (var j = 0; j < this.tableData[i].shipmentClpDetailDOS.length; j++) {
      //     var item = res.data.find(
      //       (obj) => obj.id === this.tableData[i].shipmentClpDetailDOS[j].orderItemId
      //     );
      //     if (item) {
      //       this.$set(
      //         this.tableData[i].shipmentClpDetailDOS[j],
      //         "productName",
      //         item.productName
      //       );
      //       this.$set(
      //         this.tableData[i].shipmentClpDetailDOS[j],
      //         "productCode",
      //         item.productCode
      //       );
      //       this.$set(
      //         this.tableData[i].shipmentClpDetailDOS[j],
      //         "orderNumber",
      //         item.orderNumber
      //       );
      //     }

      //   }
      //   var jsonArray = this.tableData[i].shipmentClpDetailDOS;
      //   const uniqueArray = jsonArray.reduce((acc, current) => {
      //     const existingItem = acc.find(
      //       (item) => item.orderNumber === current.orderNumber
      //     );
      //     if (!existingItem) {
      //       acc.push(current);
      //     }
      //     return acc;
      //   }, []);
      //   this.tableData[i].shipmentClpDetailDOS = uniqueArray;
      // }
    },
    addClp() {
      this.$router.push('/shipment/clp/add')
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          this.exportLoading = true
          return exportClpDetailExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_ContainerLoadingPlan' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      getImportTemplate().then(response => {
        this.$download.excel(response, 'clp_import_template.xlsx')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // 拼接提示语
      let data = response.data.failureClp
      let text = 'Errors:' + data.length
      for (const t of data) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + t
      }
      if (data.length > 0) {
        this.$alert(text, 'Errors', { dangerouslyUseHTMLString: true })
      }
      this.getPage()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style>
.el-table__body-wrapper.is-scrolling-none {
  overflow-y: auto;
}
</style>
