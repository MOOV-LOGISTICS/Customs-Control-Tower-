<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <el-dialog :visible.sync="localVisible" title="Pre Alert" width="70%">
      <div style="marign-bottom: 20px; text-align: left;">
        <el-button v-if="isEdit" style="padding-bottom 10px" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>
      </div>

      <el-form label-width="180px" ref="uploadFormRef" style="padding-top:10px">
        <el-form-item label="Related PO">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(task,index) in taskList" :label="task.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Carrier Booking Ref">
          <el-tag style="padding-left:10px;margin-left:10px">{{shipmentInfo.bookingNumber}}</el-tag>
        </el-form-item>

        <el-form-item label="Carrier Booking Number">
          <el-tag style="padding-left:10px;margin-left:10px">{{shipmentInfo.shipmentBookingNumber}}</el-tag>
        </el-form-item>

        <el-form-item label="Shipping Booking Number">
          <div v-for="(shipper, index) in shippingNumbers" :key="index" disabled border>
            <el-tag style="padding-left:10px;margin-left:10px">{{shipper}}</el-tag>
          </div>
        </el-form-item>
      </el-form>

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
            <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
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
            <el-link v-if="scope.row.typeCode === '04'">
              <el-button style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-card style="margin-top: 20px;">
        <el-form :model="form" size="mini">
          <el-form-item v-if="isAdd" required label="Pre Alert" label-width="180px">
            <el-date-picker :disabled="isDisable" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.preAlertDate" type="date" placeholder="Pre Alert"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" @click="localVisible = false">Cancel</el-button>
        <el-button v-if="isAdd" type="primary" :disabled="isLoading" :loading="isLoading" @click="submitPreAlertTask">Submit</el-button>
      </div>
    </el-dialog>

    <!-- Upload Dialog -->
    <el-dialog :title="uploadSet.title" :visible.sync="showDialog" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false" :rules="rules">
        <el-form-item :label="$t('document.documentNumber')" prop="documentNumber">
          <el-input v-model="uploadForm.documentNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('document.type')" prop="typeCode">
          <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
            <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('document.status')" v-show="showBlType" prop="blType">
          <el-select v-model="uploadForm.blType">
            <el-option label="SEAWAY BILL" value="SEAWAY BILL"></el-option>
            <el-option label="TELEX RELEASE" value="TELEX RELEASE"></el-option>
            <el-option label="ORIGINAL" value="ORIGINAL"></el-option>
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
            <!-- <div class="el-upload__tip text-center" slot="tip">
              <span>{{ $t("purchaseOrder.onlyWordPdfFormatFilesAreAllowed") }}</span>
            </div>-->
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
// @Discard Ethan 2025-08-28

import { getPoRelatedOrderFile, getSameOrderTask, getShipmentOrderItemForOrderNumber, getPoRelatedSoByOrderId } from '@/api/pepco/shipping-order'
import { updateTask, updatePreAlertTask, reSaveFile } from '@/api/order/task'
import {
  orderFileList,
  uploadOrderFile,
  deleteOrderFile,
  resaveOrderFile,
  deleteOrderFileByOrderFileId
} from '@/api/pepco/order-file'
import { getBaseHeader } from '@/utils/request'
export default {
  name: 'VerifyDocuments',
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
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Others', value: '06' }
      ],
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        { label: 'MBL', value: '04' },
        { label: 'Container Loading Picture', value: '16' }
      ],
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      taskId: '',
      task: {},
      checked: false, // 控制复选框的状态
      taskList: [], // 存储任务列表
      orderNumbers: [], // 存储订单号列表
      preDataform: [],
      shippingNumbers: [],
      bookingNumber: null,
      form: {
        preAlertDate: null
      },
      view: true,
      isEdit: false,
      tableLoading: false,
      shipmentInfo: {
        shipmentId: ''
      },
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
        // url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/upload'
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
      },
      title: 'Task Document',
      showBlType: false,
      checkedList: [],
      isDisable: false,
      isAdd: false,
      isLoading: false,
      rules: {
        documentNumber: [{ required: true, message: 'Document Number is required', trigger: 'blur' }],
        typeCode: [{ required: true, message: 'Document Type is required', trigger: 'change' }],
        blType: [
          {
            required: () => this.uploadForm.typeCode === '04', // 仅在 typeCode=04（MBL）时必填
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
    async openDialog(rows, activeTask, currentSeq, isAdd) {
      this.isLoading = false
      console.log('activeTask', activeTask)
      console.log('Received rows:', rows)
      console.log('this.task.:', this.task)
      this.task = rows
      this.$emit('update:isVisible', true)
      this.getData(rows.orderNumber)
      // this.isEdit = this.task.status == 2 || activeTask == 'Pre Alert' || (this.task.taskCode == 'Pre_Alert' && currentSeq && currentSeq > 20)
      this.isEdit = true

      // 修改 只要pre alert做完后，都可以编辑
      // this.isEdit = this.task.status == 2

      console.log('isEdit编辑:', this.isEdit)
      this.form.preAlertDate = this.task.jsonData ? JSON.parse(this.task.jsonData).preAlertDate : null
      // this.isDisable = true
      if (!this.isEdit) {
        // this.form.preAlertDate = this.task.jsonData ? JSON.parse(this.task.jsonData).preAlertDate : null
        this.isDisable = true
      }
      this.localVisible = true
      this.isAdd = isAdd
      console.log('1111', this.isAdd)
    },
    getData(orderNumber) {
      getShipmentOrderItemForOrderNumber({ orderNumber: orderNumber }).then(res => {
        // console.log('查询数据',res.data)
        if (res.data.length > 0) {
          // 将数组中的soRef抽取出来，去重后赋值到shippingNumbers中
          const shippingNumbers = [...new Set(res.data.map(item => item.soRef))]
          this.$set(this, 'shippingNumbers', shippingNumbers)
          this.$set(this, 'preDataform', res.data)
          this.$set(this, 'bookingNumber', res.data[0].bookingNumber)
          this.$set(this.shipmentInfo, 'shipmentId', res.data[0].shipmentId)
          this.$set(this.shipmentInfo, 'shipmentBookingNumber', res.data[0].shipmentBookingNumber)
          this.$set(this.shipmentInfo, 'bookingNumber', res.data[0].bookingNumber)
          this.$set(this, 'taskList', res.data)
          this.getOrderFileList()
          res.data.forEach(item => {
            this.checkedList.push(item.orderNumber)
          })
        }
      })
    },
    submitPreAlertTask() {
      this.isLoading = true
      if (this.form.preAlertDate == null) {
        this.isLoading = false
        this.$message.error('Please select a pre-alert date')
        return
      }
      this.form.shipmentId = this.shipmentInfo.shipmentId
      this.task.jsonData = JSON.stringify(this.form)
      updatePreAlertTask(this.task)
        .then(res => {
          if (res.code == 0) {
            console.log('提交成功')
            this.$emit('refresh', this.selectedTable)
            this.localVisible = false
          }
        })
        .catch(err => {
          console.error('fail:', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shipmentId: this.shipmentInfo.shipmentId, orderHeaderId: this.task.orderId, taskCode: this.task.taskCode }).then(res => {
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
        shipmentId: undefined,
        taskName: undefined,
        id: null
      }
    }, // 提交上传文件
    submitUploadForm() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      console.log('原上传')
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
          this.uploadSet.isUploading = true
          this.uploadForm.taskCode = this.task.taskCode
          this.uploadForm.taskName = this.task.taskName
          this.uploadForm.shipmentId = this.shipmentInfo.shipmentId
          this.$refs.uploadFileRef.submit()
        }
      })
    },
    handleFileChange(file, fileList) {
      console.log('11111')
      const type = file.name.split('.').pop().toLowerCase()
      const acceptType = ['csv', 'doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png']
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
      if (value == '04') {
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
        deleteOrderFileByOrderFileId(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: 'Delete Success',
              type: 'success'
            })
            this.getOrderFileList()
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
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

    handleConfirm() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          var data = {
            approveResult: 'Pass'
          }
          console.log('this.task', this.task)
          this.task.jsonData = JSON.stringify(data)
          this.taskList.forEach(item => {
            item.jsonData = JSON.stringify(data)
            console.log('item', item)
            updateTask(item).then(res => {
              console.log('res', res)
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
            })
          })

          this.localVisible = false
        })
        .catch(() => {})
      this.$emit('update-list', 'success')
    },
    handleClose() {
      this.RefuseDialog = false
      this.refuseContent = ''
    },
    handleCancel() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('Please provide a reason.', 'Tips', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          })
            .then(({ value }) => {
              var data = {
                approveResult: 'Failed',
                reason: value
              }
              console.log(this.task)
              this.task.jsonData = JSON.stringify(data)
              console.log(this.task)
              this.taskList.forEach(item => {
                item.jsonData = JSON.stringify(data)
                updateTask(item).then(res => {
                  this.$notify({
                    title: 'Success',
                    message: 'Success',
                    type: 'success'
                  })
                  this.localVisible = false
                  this.$emit('update-list', 'refuse success')
                })
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    getSameTaskList() {
      getSameOrderTask({ shippingOrderId: this.task.shippingId, taskCode: this.task.taskCode }).then(res => {
        console.log('res', res)
        this.taskList = res.data
        console.log('this.taskList', this.taskList)
      })
    },
    showUploadDialog() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
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

      this.uploadForm = {
        taskCode: this.task.taskCode,
        taskName: this.task.taskName,
        documentNumber: row.documentNumber || '',
        typeCode: row.typeCode || '',
        id: row.id || null,
        blType: this.showBlType ? row.blType || '' : '',
        shippingOrderId: row.shippingOrderId || undefined
      }

      //  3. 设置文件列表
      this.originalFileList = [{ name: row.fileName }]
      this.fileList = [{ name: row.fileName }]

      this.formKey = Date.now()
      this.showDialog = true
      this.uploadSet.isUploading = false
      this.showBlType = true
      console.log('this.uploadForm11111:', this.uploadForm)
    },
    reSubmitForm() {
      console.log('resubmit')
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/re-save'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const uploadFiles = this.$refs.uploadFileRef.uploadFiles
      console.log('uploadFiles', uploadFiles)
      console.log('this.fielList', this.fileList)
      this.uploadSet.isUploading = true
      this.uploadForm.taskCode = this.task.taskCode
      this.uploadForm.taskName = this.task.taskName
      this.uploadForm.shipmentId = this.shipmentInfo.shipmentId
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
            this.getOrderFileList()
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
.el-col {
  padding-top: 10px;
}
</style>
