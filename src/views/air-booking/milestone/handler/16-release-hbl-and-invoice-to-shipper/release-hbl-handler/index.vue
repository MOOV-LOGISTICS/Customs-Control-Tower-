<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="dialogVisible" width="80%" append-to-body>
    <milestone-detail ref="milestoneDetail" max-height="400px"></milestone-detail>

    <div style="padding: 10px 20px;">
      <!-- Upload Button -->
      <el-button v-if="showEdit" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>
      <!-- Table -->
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="documentNumber" label="Document Number" align="center" />
        <!-- <el-table-column prop="poNumber" label="PO Number" align="center" /> -->
        <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
        <el-table-column prop="typeCode" label="Document Type" align="center">
          <template #default="scope">
            <span>{{ typeCodes.find(type => type.value === scope.row.typeCode)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="blType" label="BL Type" align="center">
          <template slot-scope="scope">
            <span>{{ ['03', '04', '19'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
        <el-table-column label="Action" width="250px" align="center">
          <template #default="scope">
            <template v-if="scope.row.typeCode !== '15'">
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
            </template>
            <el-link>
              <el-button v-if="showEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-link>
            <el-link v-if="showEdit&&scope.row.typeCode === '19'">
              <el-button style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Upload Dialog -->
    <el-dialog :title="uploadSet.title" :visible.sync="showDialog" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false" :key="formKey">
        <el-form-item :label="$t('document.type')" required prop="typeCode">
          <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
            <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="uploadForm.typeCode !== '18'" :label="$t('document.documentNumber')" :required="uploadForm.typeCode !== '18'" prop="documentNumber">
          <el-input :disabled="uploadForm.typeCode === '15'" v-model="uploadForm.documentNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('document.status')" v-show="showBlType" :required="uploadForm.typeCode=='19'" prop="blType">
          <el-select v-model="uploadForm.blType">
            <el-option label="AIRWAY BILL" value="AIRWAY BILL"></el-option>
            <el-option label="TELEX RELEASE" value="TELEX RELEASE"></el-option>
            <!-- <el-option label="ORIGINAL" value="ORIGINAL"></el-option>
            <el-option label="Original, pending TELEX" value="Original, pending TELEX"></el-option> -->
          </el-select>
        </el-form-item>

        <!-- 如果选择HBL；填2个日期 -->
        <el-form-item v-if="uploadForm.typeCode == '19'" label="Draft HAWB Date" prop="draftHblDate" :required="!dHDDisabled">
          <el-date-picker :disabled="dHDDisabled" :key="datePickerKey" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.draftHblDate" type="date" placeholder="Draft HBL Date"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="uploadForm.typeCode == '19'" label="HAWB Issue Date" prop="hblIssueDate" required>
          <el-date-picker :key="datePickerKey" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.hblIssueDate" type="date" placeholder="HBL Issue Date"></el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('document.documentFile')" v-show="this.uploadForm.typeCode !== '18'">
          <el-upload
            ref="uploadFileRef"
            :limit="1"
            :accept="uploadForm.typeCode === '16' || uploadForm.typeCode === '17' ? 'image/*, .jpeg, .jpg, .png, .gif, .doc, .docx, .pdf, .xls, .xlsx' : '.doc, .docx, .pdf, .xls, .xlsx'"
            :headers="uploadSet.headers"
            :data="uploadForm"
            :action="uploadSet.url"
            :disabled="uploadSet.isDisabled"
            :file-list="fileList"
            v-loading="uploadSet.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :auto-upload="false"
            :on-change="handleFileChange"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr") }}
              <em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
          </el-upload>
        </el-form-item>

        <div style="float:right">
          <el-button size="mini" v-if="showEdit && showUpload" type="primary" :disabled="uploadSet.isUploading" @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <el-button size="mini" v-if="!showUpload" type="primary" @click="reSubmitForm">{{ $t("purchaseOrder.confirm") }}</el-button>

          <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <div v-if="milestone.status==1" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      <el-button type="primary" @click="handleTaskConfirm">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { getBaseHeader } from '@/utils/request'
import { checkPermi } from '@/utils/permission'
import { completeMilestone, reSaveFile } from "@/api/air/booking";
import { orderFileList, deleteOrderFile } from '@/api/pepco/order-file'
import { getShippingDraftHblDate } from '@/api/shipping/order'
import MilestoneDetail from '@/views/air-booking/milestone/components/so-milestone-detail.vue'

export default {
  name: 'ReleaseHblHandler',
  components: { MilestoneDetail },
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      tableLoading: false,
      title: 'Task Document',
      milestone: {},
      tableData: [],
      fileList: [],
      showUpload: false, // 是否显示编辑按钮
      fileTypes: [
        // 上传类型选项
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'HAWB', value: '19' }
      ],
      typeCodes: [
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
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'Shipping Documents By Email', value: '15' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'No Need Upload Document', value: '18' },
        { label: 'HAWB', value: '19' },
        { label: 'MAWB', value: '20' }
      ],
      uploadSet: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Upload Document',

        isUploading: false,
        // 是否禁用上传
        isDisabled: false,
        loading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/upload'
      },
      uploadForm: {
        id: undefined,
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: '',
        draftHblDate: '', //
        hblIssueDate: ''
      },
      showBlType: false,
      showDialog: false,
      originalFileList: [],
      datePickerKey: 0,
      formKey: 0,
      dHDDisabled: false
    }
  },
  created() {
    console.log('release hbl created')
  },
  methods: {
    openDialog(milestone) {
      console.log('openDialog', milestone)
      this.milestone = milestone
      this.title = milestone.taskName
      this.dialogVisible = true
      this.showUpload = true

      this.uploadForm.shippingOrderId = milestone.shippingOrderId
      this.uploadForm.shipmentId = milestone.shipmentId
      this.uploadForm.taskName = milestone.taskName

      this.getOrderFileList()
      this.$nextTick(() => {
        this.$refs.milestoneDetail.refresh(this.milestone.id)
      })
    },
    showEdit() {
      return this.milestone.editable && checkPermi([`pepco:edit:${this.milestone.taskCode}`])
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shippingOrderId: this.milestone.shippingOrderId, taskCode: this.milestone.taskCode }).then(res => {
        this.tableData = res.data
        this.tableLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
        type: 'warning'
      }).then(() => {
        deleteOrderFile(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({ message: 'Delete Success', type: 'success' })
            this.getOrderFileList()
          } else {
            this.$notify({ message: res.msg, type: 'error' })
          }
        })
      })
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()

      this.uploadForm = {}
      this.uploadSet.loading = false
      this.showUpload = false
      this.showDialog = false
      this.getOrderFileList()
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadSet.isUploading = true
    },
    handleUploadError(err, file, fileList) {
      console.error('Upload error:', err)
    },
    uploadClose() {
      this.showDialog = false
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()
      this.fileList = []
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: undefined,
        shippingOrderId: undefined,
        taskName: undefined,
        id: null
      }
    }, // 提交上传文件
    submitUploadForm() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/upload'
      if (this.uploadForm.typeCode === '19') {
        // Check if dates are provided and valid
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return
        }

        if (new Date(this.uploadForm.draftHblDate) > new Date(this.uploadForm.hblIssueDate)) {
          this.$notify({
            message: 'Draft HBL Date cannot be later than HBL Issue Date',
            type: 'warning'
          })
          return
        }
        if (moment(this.uploadForm.hblIssueDate).isAfter(moment().format('YYYY-MM-DD'))) {
          this.$notify({
            message: 'For HBL Issue dates, only today and dates before today can be selected',
            type: 'warning'
          })
          return
        }
      }
      this.uploadForm.shipmentId = this.milestone.shipmentId

      this.$refs.uploadFormRef.validate(valid => {
        if (valid) {
          if (this.fileList.length == 0) {
            this.$notify({
              message: 'Please add files before uploading',
              type: 'warning'
            })
            return
          }
          this.uploadSet.isUploading = true
          this.uploadForm.taskCode = this.milestone.taskCode
          this.uploadForm.taskName = this.milestone.taskName
          this.uploadForm.shippingOrderId = this.milestone.shippingOrderId
          this.uploadForm.level = 2
          this.$refs.uploadFileRef.submit()
        }
      })
    },
    handleFileChange(file, fileList) {
      console.log('11111')
      const type = file.name.split('.').pop().toLowerCase()
      const acceptType = ['doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png']
      if (acceptType.includes(type)) {
        this.fileList = fileList
      } else {
        this.$message.error('The file format does not meet the upload requirements.')
        this.fileList = []
        return
      }
    },
    handleTaskConfirm() {
      console.log('this.task', this.tableData)
      const hasHBL = this.tableData.some(item => item.typeCode === '19')

      if (hasHBL) {
        // Find the HBL record
        const hblRecord = this.tableData.find(item => item.typeCode === '19')
        // Check if Draft HBL Date is after HBL Issue Date
        if (hblRecord.draftHblDate && hblRecord.hblIssueDate && new Date(hblRecord.draftHblDate) > new Date(hblRecord.hblIssueDate)) {
          this.$notify({
            message: 'Draft HAWB Date cannot be later than HBL Issue Date',
            type: 'warning'
          })
          return
        }
      }
      if (this.tableData.length == 0) {
        this.$notify({
          message: 'Please upload the document',
          type: 'warning'
        })
        return
      }

      const command = {
        milestoneId: this.milestone.id,
        taskCode: this.milestone.taskCode
      }
      this.dialogLoading = true
      completeMilestone(command).then(res => {
        this.$emit('success', command)
        this.$message.success('Submit successfully')
        this.dialogLoading = false
        this.dialogVisible = false
      })
    },
    handleTypeChange(value) {
      if (value == '19' || value == '20') {
        if (value === '19') {
          getShippingDraftHblDate({ soRef: this.milestone.shippingOrderRef }).then(res => {
            if (res.data && res.data.draftHblDate) {
              this.uploadForm.draftHblDate = this.formatDateTime(res.data.draftHblDate)
              this.dHDDisabled = true
            }
          })
          this.dHDDisabled = false
        }
        this.showBlType = true
      } else {
        this.showBlType = false
      }
    },
    formatDateTime(timestamp) {
      const date = new Date(Number(timestamp))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    handleEdit(row) {
      this.showUpload = false
      this.showDialog = true
      this.uploadSet.isUploading = false
      //  1. 初始化 showBlType
      this.showBlType = row.typeCode === '19' || row.typeCode === '20'
      this.uploadForm = {
        taskCode: this.milestone.taskCode,
        taskName: this.milestone.taskName,
        documentNumber: row.documentNumber || '',
        typeCode: row.typeCode || '',
        id: row.id || null,
        blType: this.showBlType ? row.blType || '' : '',
        draftHblDate: this.showBlType ? this.parseUTCTime(row.draftHblDate) : '',
        hblIssueDate: this.showBlType ? this.parseUTCTime(row.hblIssueDate) : '',
        shippingOrderId: row.shippingOrderId || undefined,
        email: row.email || '',
        shipmentId: this.milestone.shipmentId
      }

      //  3. 设置文件列表
      this.originalFileList = [{ name: row.fileName }]
      this.fileList = [{ name: row.fileName }]

      //  4. 强制触发重渲染（可选）
      this.datePickerKey = Date.now()
      this.formKey = Date.now()
    },
    showUploadDialog() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/upload'
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: this.milestone.shippingOrderId,
        taskName: this.milestone.taskName,
        taskCode: this.milestone.taskCode,
        id: null
      }
      this.showDialog = true
      this.showUpload = true
      this.uploadSet.open = true
    },
    reSubmitForm() {
      console.log('resubmit')
      const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
      if (specialCharRegex.test(this.uploadForm.documentNumber)) {
        this.$notify({
          message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
          type: 'warning'
        })
        return
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/re-save'
      const uploadFiles = this.$refs.uploadFileRef.uploadFiles
      this.uploadSet.isUploading = true
      this.uploadForm.taskCode = this.milestone.taskCode
      this.uploadForm.taskName = this.milestone.taskName
      this.uploadForm.shipmentId = this.milestone.shipmentId

      // 判断只更新 其它信息
      if (this.originalFileList[0].name == this.fileList[0].name) {
        // 说明文件没变化
        this.fileList = []
        reSaveFile(this.uploadForm).then(res => {
          console.log('返回结果', res)
          if (res.code == 0) {
            this.$message.success('File resaved successfully')
            this.getOrderFileList()
          } else {
            this.$message.error(res.msg)
          }
          this.uploadSet.isUploading = false
          this.showDialog = false
          this.showUpload = true
        })
      }

      this.$nextTick(() => {
        this.$refs.uploadFileRef.submit()
      })
    }
  }
}
</script>

  <style scoped>
.upload-demo {
  width: 100%;
}
.reason-class {
  padding-left: 20px;
}
.refuse-container {
  padding-top: 10px;
}
.info-text {
  padding-left: 20px;
  color: #666;
  font-size: small;
}
.refuse-comment {
  padding-top: 10px;
}
.comment-label {
  padding-left: 20px;
  font-weight: bold;
}
.comment-text {
  padding-left: 20px;
  color: red;
}
</style>
</style>
</style>
</style>
  </style>
  