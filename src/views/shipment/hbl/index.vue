<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="status">
        <el-select v-model="queryParams.status" placeholder="Status" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="orderNumber">
        <el-input v-model="queryParams.orderNumber" placeholder="PO Number" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item prop="bookingNumber">
        <el-input v-model="queryParams.bookingNumber" placeholder="Booking Number" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item prop="mblNumber">
        <el-input v-model="queryParams.mblNumber" :placeholder="$constants.MBL_NUMBER" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item prop="hblNumber">
        <el-input v-model="queryParams.hblNumber" placeholder="HBL Number" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          Search
          <i class="el-icon-search el-icon--right"></i>
        </el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
      </el-form-item>

      <div style="float: right;padding-top: 10px;">
        <el-row>
          <div style="float: right">
            <svg @click="handleUploadHBL" style="cursor: pointer;" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                <path d="M48 0H0V48H48V0Z" fill="#004F7C" />
              </mask>
              <g mask="url(#icon-21f8f28d7f10b972)">
                <path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
            <svg @click="handleSendEmail" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M36 15H44V28V41H4V28V15H12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M24 19V5" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M30 11L24 5L18 11" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4 15L24 30L44 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg @click="handleExport" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M33 23L24 32L15 23" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M23.9917 6V32" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div style="float: left"></div>
        </el-row>
      </div>
    </el-form>

    <!-- 操作工具栏 -->
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['shipment:hbl:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['shipment:hbl:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <!-- 列表 -->
    <el-table ref="table" @selection-change="handleSelectionChange" :height="height" v-loading="loading" :data="list">
      <el-table-column label="Status" align="center" prop="status">
        <template v-slot="scope">
          <span>{{ statusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PO Number" align="center" prop="orderNumber" />
      <el-table-column label="Booking Number" align="center" prop="bookingNumber" />
      <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" />
      <el-table-column label="HBL Number " align="center" prop="hblNumber" />
      <el-table-column label="Update Date" align="center" prop="updateHblTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.updateHblTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="File" align="center" prop="file" width="180">
        <template v-slot="scope">
          <el-link :href="scope.row.fileUrl" :title="scope.row.fileName" target="_blank">
            <svg v-show="scope.row.fileUrl" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round" />
              <path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C" />
              <path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </el-link>
          <!-- <el-link target="_blank" :href="scope.row.fileUrl" :title="scope.row.fileName"><p class="file-css">
            <svg v-show="scope.row.fileUrl" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round"/><path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C"/><path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </p></el-link>-->
        </template>
      </el-table-column>

      <!-- <el-table-column align="rignt" width="70" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-checkbox size="medium" v-model="selectIds" :key="scope.row.id" :prop="scope.row.id" :label="scope.row.id"
          ></el-checkbox>
        </template>
      </el-table-column>-->

      <el-table-column type="selection" prop="id" align="rignt" width="70" class-name="small-padding fixed-width"></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="400px" append-to-body>
      <el-form ref="uploadForm" :show-message="false" size="mini">
        <el-row style="padding: 10px;">
          <el-col :span="7" style="font-bo">HBL Number:</el-col>
          <el-col :span="17">
            <el-form-item prop="hblNumber">
              <el-input v-model="hblNumber" placeholder="HBL Number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-upload
              ref="uploadDocument"
              :limit="1"
              :headers="uploadDocument.headers"
              multiple
              :action="uploadDocument.url + '?ids=' + selectIds+ '&hblNumber='+ hblNumber"
              :disabled="uploadDocument.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
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
            </el-upload>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="uploadDocument.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="sendMail.title" :visible.sync="sendMail.open" width="1200px" append-to-body>
      <el-form ref="sendMailForm" :show-message="false" size="mini" label-width="160px">
        <!-- <el-row>
  <el-col :span="4"><div class="grid-content"></div></el-col>
  <el-col :span="15">
    <el-form-item label="TO" prop="name">
              <el-input v-model="sendMail.toMail" />
            </el-form-item>
  </el-col>
  <el-col :span="4"><div class="grid-content"></div></el-col>
</el-row>
<el-row>
  <el-col :span="4"><div class="grid-content"></div></el-col>
  <el-col :span="15">
    <el-form-item label="Subject" prop="name">
              <el-input v-model="sendMail.templateTitle" />
            </el-form-item>
  </el-col>
  <el-col :span="4"><div class="grid-content"></div></el-col>
</el-row>
<el-row>
  <el-col :span="24">
              <el-input type="textarea" :rows="15" :span="24" v-model="sendMail.templateContent" style="white-space: pre-wrap;word-wrap: break-word;"/>
          </el-col>
        </el-row>-->

        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="TO" prop="toMail">
              <el-input v-model="sendMail.toMail" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Subject" prop="templateTitle">
              <el-input v-model="sendMail.templateTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-input prop="templateContent" type="textarea" :rows="15" :span="24" v-model="sendMail.templateContent" style="white-space: pre-wrap;word-wrap: break-word;" />
          </el-col>

          <el-col :span="24">
            <el-link style="margin-top: 5px;" :href="sendMail.fileUrl" :title="sendMail.fileName" target="_blank">
              <svg v-show="sendMail.fileUrl" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round" />
                <path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C" />
                <path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </el-link>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitMailForm">Send</el-button>
        <el-button size="mini" @click="sendMail.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}
.el-row {
  margin-bottom: 1px;
}
/* .el-col {
    border-radius: 4px;
  } */
.grid-content {
  /* border-radius: 4px; */
  min-height: 36px;
}
/* .row-bg {
    padding: 10px 0;
  } */
</style>

<script>
import { createHbl, updateHbl, deleteHbl, getHbl, getHblPage, exportHblExcel, uploadFile, sendMail, shipments } from '@/api/shipment/hbl'
import Editor from '@/components/Editor'
import { getBaseHeader } from '@/utils/request'
import { get } from '@/api/shipment/shipment'
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'Hbl',
  mixins: [fileLoadMixin],
  components: {
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // shipment_hbl列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        toMail: null,
        ccMail: null,
        templateTitle: null,
        templateContent: null,
        templateParams: null,
        fileUrl: null,
        orderNumber: null,
        bookingNumber: null,
        mblNumber: null,
        hblNumber: null,
        updateHblTime: [],
        sendMailTime: [],
        atd: null,
        status: null,
        sendMailStatus: null,
        createTime: [],
        fileName: null,
        shipmentId: null,
        orderId: null,
        orderItemId: null,
        mailId: null,
        fileId: null
      },
      height: '',
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      uploadDocument: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Upload HBL',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/shipment/hbl/uploadFile'
      },
      sendMail: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Mail',
        toMail: '',
        ccMail: '',
        templateTitle: '',
        templateContent: '',
        ids: '',
        fileUrl: '',
        fileName: ''
      },
      hblNumber: '',
      multipleSelection: [],
      selectIds: [],
      statusMap: {
        0: 'Pending',
        1: 'Uploaded',
        2: 'Released'
      },
      statusOptions: [
        { label: 'Pending', value: '0' },
        { label: 'Uploaded', value: '1' },
        { label: 'Released', value: '2' }
      ],
      shipments: []
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 210 + 'px'
    })
  },
  created() {
    var clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 210 + 'px'
    if (this.$route.query.hblNumber) {
      this.queryParams.hblNumber = this.$route.query.hblNumber
    }
    if (this.$route.query.shipmentId) {
      let that = this
      get(this.$route.query.shipmentId).then(response => {
        console.log(response)
        that.queryParams.mblNumber = response.data.blNumber
        that.getList()
      })
    } else {
      this.getList()
    }
  },
  methods: {
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck'
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectIds = val.map(function (obj) {
        return obj.id
      })
      console.log(this.selectIds)
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getHblPage(this.queryParams).then(response => {
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
        toMail: undefined,
        ccMail: undefined,
        templateTitle: undefined,
        templateContent: undefined,
        templateParams: undefined,
        fileUrl: undefined,
        orderNumber: undefined,
        bookingNumber: undefined,
        mblNumber: undefined,
        hblNumber: undefined,
        updateHblTime: undefined,
        sendMailTime: undefined,
        atd: undefined,
        status: undefined,
        sendMailStatus: undefined,
        fileName: undefined,
        id: undefined,
        shipmentId: undefined,
        orderId: undefined,
        orderItemId: undefined,
        mailId: undefined,
        fileId: undefined
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
      this.title = '添加shipment_hbl'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getHbl(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改shipment_hbl'
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
          updateHbl(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createHbl(this.form).then(response => {
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
        .confirm('是否确认删除shipment_hbl编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteHbl(id)
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
        .confirm('是否确认导出所有shipment_hbl数据项?')
        .then(() => {
          this.exportLoading = true
          return exportHblExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'shipment_hbl.xls')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    handleUploadHBL() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length == 0) {
        this.$modal.msgError("Please select PO's.")
        return
      }
      this.uploadDocument.open = true
    },
    handleSendEmail() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length == 0) {
        this.$modal.msgError("Please select PO's.")
        return
      }
      var hblnumbers = this.multipleSelection.map(function (obj) {
        return obj.hblNumber
      })
      const uniqueArr = Array.from(new Set(hblnumbers))
      if (uniqueArr.length == 1 && uniqueArr[0] == null) {
        this.$modal.msgError('No HBL Number')
        return
      }
      if (uniqueArr.length > 1) {
        // this.$modal.msgError("Select More than 1 HBL Number");
        this.$modal.msgError('Select same MBL documents')
        return
      }
      this.sendMail.open = true
      var title =
        'PO：' +
        this.multipleSelection.map(function (obj) {
          return obj.orderNumber
        }) +
        ' HBL:' +
        this.multipleSelection[0].hblNumber
      this.sendMail.templateTitle = title
      var shipmentIds = this.multipleSelection.map(function (obj) {
        return obj.shipmentId
      })
      shipments({ ids: shipmentIds }).then(res => {
        this.shipments = res.data
        var shipment = this.shipments[0]
        var content =
          'Dear All：' +
          '\n\n' +
          'Please find attached document from MOOV Logistics. The same file can be found online in ct.smartmoovhub.com in the shipment details page in the Documentation tab' +
          '\n\n' +
          'Kindly find your attached HBL of your PO form POL ' +
          shipment.polStr +
          ' to POD ' +
          shipment.podStr +
          ' on ' +
          shipment.vessel +
          ' Vessel' +
          '\n\n\n\n' +
          'Kind regards' +
          '\n\n' +
          'Moov logistics'
        this.sendMail.templateContent = content
        this.sendMail.fileName = this.multipleSelection[0].fileName
        this.sendMail.fileUrl = this.multipleSelection[0].fileUrl
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadDocument.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.uploadDocument.open = false
      this.uploadDocument.isUploading = false
      this.$refs.uploadDocument.clearFiles()
      this.getList()
      this.$refs.table.clearSelection()
    },
    // 提交上传文件
    submitFileForm() {
      // console.log("11")
      // this.$refs["uploadForm"].validate((valid) => {
      //   console.log("22")
      //   if (!valid) {
      //     return;
      //   }
      //   console.log("33")
      // });

      this.$refs.uploadDocument.submit()
    },
    uploadFile() {
      uploadFile(data).then(response => {})
    },
    submitMailForm() {
      // console.log("11")
      // this.$refs["sendMailForm"].validate((valid) => {
      //   console.log("22")
      //   if (!valid) {
      //     return;
      //   }
      //   console.log("33")
      // });

      this.sendMail.ids = this.selectIds
      console.log(this.sendMail)
      sendMail(this.sendMail).then(response => {
        this.sendMail.open = false
        this.sendMail.toMail = ''
        this.getList()
        this.$refs.table.clearSelection()
      })
    },
    handleExport() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams }
          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          return exportHblExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_HBL' + this.parseTimeToZ2(new Date()) + '.xlsx')
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
    }
  }
}
</script>
