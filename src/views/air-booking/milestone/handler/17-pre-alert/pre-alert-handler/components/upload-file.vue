<template>
  <div>
    <!-- MBL File -->
    <div style="text-align: left;margin-top: 20px;">
      <el-button v-if="isEdit" style="padding-bottom: 10px" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="documentNumber" label="Document Number" width="130px" align="center" />
      <el-table-column prop="poNumber" label="PO Number" align="center" />
      <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
      <el-table-column prop="typeCode" label="Document Type" align="center">
        <template #default="scope">
          <span>{{ fileTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="blType" label="BL Type" align="center">
        <template slot-scope="scope">
          <span>{{ ['19', '20'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
      <el-table-column label="Action" width="220px" align="center">
        <template #default="scope">
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
          <el-link>
            <el-button v-if="isEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </el-link>
          <el-link v-if="scope.row.typeCode === '20'">
            <el-button style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- Upload Dialog -->
    <el-dialog :title="uploadSet.title" :visible.sync="showDialog" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false" :rules="rules">
        <el-form-item :label="$t('document.type')" prop="typeCode">
          <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
            <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="uploadForm.typeCode=='20'?'MAWB Number':$t('document.documentNumber')" prop="documentNumber">
          <el-input v-model="uploadForm.documentNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('document.status')" v-show="showBlType" prop="blType">
          <el-select v-model="uploadForm.blType">
            <el-option label="AIRWAY BILL" value="AIRWAY BILL"></el-option>
            <el-option label="TELEX RELEASE" value="TELEX RELEASE"></el-option>
            <!-- <el-option label="ORIGINAL" value="ORIGINAL"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('document.documentFile')">
          <el-upload
            ref="uploadFileRef"
            :limit="1"
            :accept="uploadForm.typeCode === '16' || uploadForm.typeCode === '17' ? 'image/*, .jpeg, .jpg, .png, .gif, .doc, .docx, .pdf, .xls, .xlsx' : '.doc, .docx, .pdf, .xls, .xlsx'"
            :headers="uploadSet.headers"
            :data="uploadForm"
            :action="uploadSet.url"
            :disabled="uploadSet.isUploading"
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
          <el-button size="mini" v-if="isEdit && showUpload" type="primary" :disabled="uploadSet.isUploading" @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <el-button size="mini" v-if="!showUpload" type="primary" @click="reSubmitForm">{{ $t("purchaseOrder.confirm") }}</el-button>

          <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import { reSaveFile } from "@/api/air/booking";
import { orderFileList, deleteOrderFile } from '@/api/pepco/order-file'

export default {
  name: 'PreAlertHandlerUploadFile',
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      task: {},
      shipmentId: null,
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        // { label: 'MBL', value: '04' },
        { label: 'MAWB', value: '20' },
        // { label: 'Container Loading Picture', value: '16' }
      ],
      isEdit: false,
      tableLoading: false,
      uploadForm: {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: '',
        id: null
      },
      uploadSet: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Upload Document',
        // 是否禁用上传
        isUploading: false,
        loading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/shipment-upload'
      },
      title: 'Task Document',
      showBlType: false,
      rules: {
        documentNumber: [{ required: true, message: 'Document Number is required', trigger: 'blur' }],
        typeCode: [{ required: true, message: 'Document Type is required', trigger: 'change' }],
        blType: [
          {
            required: () => this.uploadForm.typeCode === '20', // 仅在 typeCode=20（MAWB）时必填
            message: 'BL Type is required',
            trigger: 'change'
          }
        ]
      },
      showDialog: false,
      showUpload: true,
      originalFileList: [],
      formKey: 0
    }
  },

  methods: {
    initComponent(task, shipmentId, isEdit) {
      console.log('task', task)
      console.log('shipmentId', shipmentId)
      this.task = task
      this.shipmentId = shipmentId
      this.isEdit = isEdit
      this.getOrderFileList()
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shipmentId: this.shipmentId, orderHeaderId: this.task.orderId, taskCode: this.task.taskCode }).then(res => {
        console.log('fileData', res.data)
        this.tableData = res.data
        this.tableLoading = false
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
      this.$emit('reload')
      // this.getOrderFileList()
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
        shipmentId: undefined,
        taskName: undefined,
        id: null
      }
    }, // 提交上传文件
    submitUploadForm() {
      if (this.uploadForm.typeCode === '20') {
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return;
        }
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/shipment-upload'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const originalRules = this.rules.blType

      // 如果typeCode是16，移除blType的校验规则
      if (this.uploadForm.typeCode === '16') {
        this.rules.blType = []
      } else {
        // 否则恢复原始规则
        this.rules.blType = originalRules
      }
      this.$refs.uploadFormRef.validate(valid => {
        //去除bltype的校验
        if (valid) {
          if (this.fileList.length == 0) {
            this.$notify({
              message: 'Please add files before uploading',
              type: 'warning'
            })
            return
          }
          if (this.uploadForm.typeCode === '20' && this.tableData.find(item => item.typeCode === '20')) {
            this.$notify({
              message: 'Only one MAWB can be uploaded at a time',
              type: 'warning'
            })
            return
          }

          this.uploadSet.isUploading = true
          this.uploadForm.taskCode = this.task.taskCode
          this.uploadForm.taskName = this.task.taskName
          this.uploadForm.shipmentId = this.shipmentId
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
      console.log('File changed:', file, fileList)
      this.fileList = fileList
    },
    handleTypeChange(value) {
      console.log('选择的类型:', value)
      if (value == '20') {
        this.showBlType = true
      } else {
        this.showBlType = false
      }
    },
    handleDelete(row) {
      console.log('Deleting file:', row)
      this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
        type: 'warning'
      }).then(() => {
        deleteOrderFile(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: 'Delete Success',
              type: 'success'
            })
            this.$emit('reload')
            // this.getOrderFileList()
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    showUploadDialog() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/shipment-upload'
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        taskName: this.task.taskName,
        id: null
      }
      this.showDialog = true
      this.showUpload = true
      this.uploadSet.open = true
    },
    handleEdit(row) {
      console.log('Editing row:', row)
      this.showUpload = false
      this.showBlType = true

      this.uploadForm = {
        taskCode: this.task.taskCode,
        taskName: this.task.taskName,
        documentNumber: row.documentNumber || '',
        typeCode: row.typeCode || '',
        id: row.id || null,
        blType: row.blType || '',
        shippingOrderId: row.shippingOrderId || undefined
      }

      //  3. 设置文件列表
      this.originalFileList = [{ name: row.fileName }]
      this.fileList = [{ name: row.fileName }]

      this.formKey = Date.now()
      this.showDialog = true
      this.uploadSet.isUploading = false
      console.log('this.uploadForm11111:', this.uploadForm)
    },
    reSubmitForm() {
      console.log('resubmit')
      if (this.uploadForm.typeCode === '20') {
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return;
        }
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/air/base-data/order-file/re-save'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const uploadFiles = this.$refs.uploadFileRef.uploadFiles
      console.log('uploadFiles', uploadFiles)
      console.log('this.fielList', this.fileList)
      this.uploadSet.isUploading = true
      this.uploadForm.taskCode = this.task.taskCode
      this.uploadForm.taskName = this.task.taskName
      this.uploadForm.shipmentId = this.shipmentId
      console.log('提交的参数', this.uploadForm)
      console.log('提交的参数', this.uploadSet)
      if (this.uploadForm.blType == '' || this.uploadForm.blType == null) {
        // 提示必须选择
        this.$message.error('Please select BL Type')
        this.uploadSet.isUploading = false
        return
      }
      // 判断只更新 其它信息
      if (this.originalFileList[0].name == this.fileList[0].name) {
        // 说明文件没变化
        this.fileList = []
        console.log('没有文件上传，只更新其它信息')
        console.log('新接口的入参', this.uploadForm)
        reSaveFile(this.uploadForm).then(res => {
          console.log('返回结果', res)
          if (res.code == 0) {
            this.$message.success('File resaved successfully')
            this.$emit('reload')
            // this.getOrderFileList()
          } else {
            this.$message.error(res.msg)
          }
          this.uploadSet.isUploading = false
          this.showDialog = false
        })
      }

      this.$nextTick(() => {
        this.$refs.uploadFileRef.submit()
      })
    }
  }
}
</script>
