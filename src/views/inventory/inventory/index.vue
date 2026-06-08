<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-card style="background: transparent; box-shadow: none !important">
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <span @click="handleExport">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <img :src="notOnhandIcon" alt="Example Image" class="icon-image" style="border-right: 1px solid #ddd" />
          <div
            @click="handChange(false)"
            style="
              cursor: pointer;
              padding: 0px 5px;
              border-radius: 10px;
              float: right;
              line-height: 24px;
              margin-left: 10px;
            "
          >
            <p style="font-size: 20px">{{ onHandDataInfo.notOnHand }}</p>
            <p>Not on hand</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <img :src="onhandIcon" alt="Example Image" class="icon-image" style="border-right: 1px solid #ddd" />
          <div
            @click="handChange(true)"
            style="
              cursor: pointer;
              padding: 0px 15px;
              border-radius: 10px;
              float: right;
              line-height: 24px;
              margin-left: 10px;
            "
          >
            <p style="font-size: 20px">{{ onHandDataInfo.onHand }}</p>
            <p>On hand</p>
          </div>
        </el-card>
      </el-card>
    </div>
    <el-card class="inventory-list pd-20" style="padding-top: 20px">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <div style="float: left; padding-top: 8px">
          <div style="float: left; padding: 10px 0px">
            <el-select v-model="queryParams.productCode" placeholder="SkuId" clearable filterable @keyup.enter.native="handleQuery">
              <!-- <el-option
                v-for="item in productList"
                :label="item.code + '-' + item.name"
                :value="item.code"
              ></el-option>-->
            </el-select>
          </div>
          <!-- <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-select
              v-model="queryParams.onHand"
              placeholder="Goods status"
              clearable
              filterable
              @keyup.enter.native="handleQuery"
            >
              <el-option label="On hand" value="true" />
              <el-option label="Not on hand" value="false" />
            </el-select>
          </div>-->
          <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-select v-model="queryParams.warehouseName" placeholder="Warehouse Id" clearable filterable @keyup.enter.native="handleQuery">
              <!-- <el-option
                v-for="item in warehouseList"
                :label="item.warehouseName"
                :value="item.warehouseName"
              ></el-option>-->
            </el-select>
          </div>
          <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-date-picker
              v-model="queryParams.inventoryTime"
              style="width: 240px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="-"
              start-placeholder="Inbound data"
              end-placeholder="Inbound data"
              :default-time="['00:00:00', '23:59:59']"
            />
          </div>
          <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-button @click="handleQuery" type="primary">
              Search
              <i class="el-icon-search el-icon--right"></i>
            </el-button>
          </div>
        </div>
      </el-form>

      <!-- 列表 -->
      <el-table :height="tableHeight" v-loading="loading" :data="list">
        <el-table-column label="Warehouse Name" align="center" prop="warehouseName" />
        <el-table-column label="Sku Id" align="center" prop="productCode" />
        <el-table-column label="Sku Name" align="center" prop="productName" />
        <el-table-column label="On hand Qty" align="center" prop="qty">
          <template v-slot="scope">
            {{
            scope.row.inbound - scope.row.outbound > 0
            ? scope.row.inbound - scope.row.outbound
            : 0
            }}
          </template>
        </el-table-column>
        <el-table-column label="Inbound Qty" align="center" prop="inbound" />
        <el-table-column label="Outbound Qty" align="center" prop="outbound">
          <template v-slot="scope">{{ scope.row.outbound ? scope.row.outbound : 0 }}</template>
        </el-table-column>

        <el-table-column label="Unit" align="center" prop="unit" />
        <!-- <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    >Delete</el-button>
        </template>
        </el-table-column>-->
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          v-loading="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          drag
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
            <div>{{$t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <el-button size="mini" @click="upload.open = false">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog :title="uploadError.title" :visible.sync="uploadError.dialogVisible" width="50%">
        <el-table :data="uploadError.data" style="width: 100%" max-height="500px">
          <el-table-column property="data" label="Data Error">
            <template slot-scope="scope">
              <span>{{ scope.row }}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<style scoped>
.icon-image {
  width: 50px; /* 设置图片宽度 */
  height: 50px; /* 设置图片高度 */
}
</style>

<script>
import { createInventory, updateInventory, deleteInventory, getInventory, getInventoryPage, exportInventoryExcel, downloadInventoryTemplate, handReport } from '@/api/order/inventory'
import { getWarehousePage } from '@/api/system/warehouse'
import { getProductPage } from '@/api/system/product'
import { getBaseHeader } from '@/utils/request'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import onhandIcon from '@/assets/blue-warehouse.png'
import notOnhandIcon from '@/assets/red-warehouse.png'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'Inventory',
  mixins: [fileLoadMixin],
  components: {
    IconPark
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      tableHeight: 0,
      // 总条数
      total: 0,
      // order_inventory列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        source: null,
        customer: null,
        orderId: null,
        orderItemId: null,
        orderNumber: null,
        productCode: null,
        productName: null,
        warehouseName: null,
        remark: null,
        innerBoxes: null,
        unit: null,
        batch: null,
        lwh: null,
        registerTime: [],
        startTime: [],
        endTime: [],
        createTime: [],
        customerStorageId: null,
        productId: null,
        inventoryTime: [],
        count: null,
        units: null,
        qty: null,
        weight: null,
        volume: null,
        onHand: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        innerBoxes: [{ required: true, message: 'inner boxes不能为空', trigger: 'blur' }],
        count: [{ required: true, message: 'count不能为空', trigger: 'blur' }],
        units: [{ required: true, message: 'units不能为空', trigger: 'blur' }],
        qty: [{ required: true, message: 'qty不能为空', trigger: 'blur' }]
      },
      warehouseList: [],
      productList: [],
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/inventory/import'
      },
      uploadError: {
        title: 'Errors',
        dialogVisible: false,
        data: ''
      },
      notOnhandIcon,
      onhandIcon,
      onHandDataInfo: {
        notOnHand: 0,
        onHand: 0
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight)
  },
  created() {
    this.getList()
    this.getWarehousePage()
    this.getProductPage()
    this.calcTableHeight()
    this.handReport()
  },
  methods: {
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 380
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getInventoryPage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        source: undefined,
        customer: undefined,
        orderId: undefined,
        orderItemId: undefined,
        orderNumber: undefined,
        productCode: undefined,
        productName: undefined,
        warehouseName: undefined,
        remark: undefined,
        innerBoxes: undefined,
        unit: undefined,
        batch: undefined,
        lwh: undefined,
        registerTime: undefined,
        startTime: undefined,
        endTime: undefined,
        customerStorageId: undefined,
        productId: undefined,
        inventoryTime: undefined,
        count: undefined,
        units: undefined,
        qty: undefined,
        weight: undefined,
        volume: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = 'Add'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getInventory(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Edit'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 修改的提交
        if (this.form.id != null) {
          updateInventory(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createInventory(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Delete id "' + id + '"?')
        .then(function () {
          return deleteInventory(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
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
          return exportInventoryExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_Inventory' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    getWarehousePage() {
      getWarehousePage({ pageNo: 1, pageSize: 100, status: 0 }).then(response => {
        this.warehouseList = response.data.list
      })
    },
    getProductPage() {
      getProductPage({ pageNo: 1, pageSize: 10000, status: 0 }).then(response => {
        this.productList = response.data.list
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      console.log(111)
      this.upload.title = 'Import'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      downloadInventoryTemplate().then(response => {
        this.$download.excel(response, 'Inventory.xlsx')
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
        this.$refs.upload.clearFiles()
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // 拼接提示语
      let data = response.data.failureNumber
      if (data.length > 0) {
        this.uploadError.data = data
        this.uploadError.dialogVisible = true
      }
      this.getList()
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log(err)
      this.$refs.upload.clearFiles()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`
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
    handChange(flag) {
      this.queryParams.onHand = flag
      this.getList()
      this.queryParams.onHand = null
    },
    handReport() {
      handReport().then(response => {
        this.onHandDataInfo = response.data
      })
    }
  }
}
</script>
