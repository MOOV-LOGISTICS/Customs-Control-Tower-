<template>
  <!-- Upload Dialog -->
  <el-dialog :title="uploadSet.title" :visible.sync="uploadSet.open" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
    <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false">
      <el-form-item :label="$t('document.documentNumber')" required prop="documentNumber">
        <el-input v-model="uploadForm.documentNumber"></el-input>
      </el-form-item>
      <el-form-item :label="$t('document.type')" required prop="typeCode">
        <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
          <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('document.status')" v-show="showBlType" prop="blType">
        <el-select v-model="uploadForm.blType">
          <el-option label="Seaway Bill" value="Seaway Bill"></el-option>
          <el-option label="Telex Released" value="Telex Released"></el-option>
          <el-option label="Original" value="Issued"></el-option>
        </el-select>
      </el-form-item>
      <!-- 如果是选择HBL 并且是shipping Order 的情况下，需要指定哪一个 shipping Order -->
      <el-form-item label="SO Ref" v-if="uploadForm.typeCode == '02'|| uploadForm.typeCode=='03'">
        <el-input v-model="shippingOrder.soRef" disabled></el-input>
      </el-form-item>
      <!-- <el-form-item label="Related PO" v-if="shippingOrderItems.length > 0&&(uploadForm.typeCode == '02'|| uploadForm.typeCode=='03')">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(orderItem,index) in shippingOrderItems" :label="orderItem.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
      </el-form-item>-->

      <!-- <el-form-item :label="$t('uploadForm.email')" v-if="uploadSet.formData.type != '3'">
          <el-input type="textarea" placeholder v-model="uploadSet.formData.email" size="mini" :rows="3" maxlength="1000" show-word-limit resize="none" @change="handeDocumentEmailTrim"></el-input>
      </el-form-item>-->
              <!-- 如果选择HBL；填2个日期 -->
              <!-- <el-form-item required label="Draft HBL Date" v-if="uploadForm.typeCode == '02'">
                <el-input v-model="uploadForm.draftHblDate" disabled></el-input>
              </el-form-item>
              <el-form-item required label="HBL Issue Date" v-if="uploadForm.typeCode == '02'">
                <el-input v-model="uploadForm.hblIssueDate" disabled></el-input>
              </el-form-item> -->

      <el-form-item :label="$t('document.documentFile')">
        <el-upload
          ref="uploadFileRef"
          :limit="1"
          accept=".doc, .docx, .pdf, .xls, .xlsx"
          :headers="uploadSet.headers"
          :data="uploadForm"
          :action="uploadSet.url"
          :disabled="uploadSet.isUploading"
          v-loading="uploadSet.isUploading"
          :on-change="handleFileChange"
          :on-progress="handleFileUploadProgress"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :auto-upload="false"
          :file-list="fileList"
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
        <el-button size="mini" type="primary" :disabled="uploadSet.isUploading" @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
        <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { orderFileList, uploadOrderFile, deleteOrderFile } from '@/api/pepco/order-file'
import { getPoRelatedSoByOrderId } from '@/api/pepco/shipping-order'
import { getBaseHeader } from '@/utils/request'

export default {
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      tableLoading: false,
      title: 'Task Document',
      tableData: [],
      fileList: [],
      fileTypes: [],
      uploadSet: {
        fileList: [],
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/upload-by-order'
      },
      uploadForm: {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: '',
        orderIds: [],
        taskCode: ''
      },
      shippingOrder: {
        soRef: ''
      },
      shippingOrderItems: [],
      checkedList: [],
      taskCode: '',
      showBlType: false
    }
  },
  created() {
    console.log('UploadOrderFile created')
  },
  methods: {
    openDialog(orderFile) {
      console.log('openDialog', orderFile)
      this.uploadForm.taskCode = orderFile.taskCode
      this.uploadForm.orderIds = orderFile.orderIds
      // 将这些值放到fileTypes里面
      const hblTypes = [
        { label: 'ICS2', value: '11' },
        { label: 'Manifest', value: '12' },
        { label: 'Others', value: '13' }
      ]
      hblTypes.forEach(type => {
        const exists = this.fileTypes.some(ft => ft.value === type.value)
        if (!exists) {
          this.fileTypes.push(type)
        }
      })
      this.uploadSet.open = true
    },
    // getShippingOrder() {
    //   getPoRelatedSoByOrderId({ orderId: this.task.orderId }).then(res => {
    //     this.shippingOrder = res.data.shippingOrder
    //     this.shippingOrderItems = res.data.shippingOrderItems
    //     this.shippingOrderItems.forEach(item => {
    //       this.checkedList.push(item.orderNumber)
    //     })
    //     this.getOrderFileList()
    //   })
    // },
    // getOrderFileList() {
    //   this.tableLoading = true
    //   orderFileList({ shippingOrderId: this.shippingOrder.id, taskName: this.task.taskName, taskCode: this.task.taskCode }).then(res => {
    //     this.tableData = res.data
    //     this.tableLoading = false
    //   })
    // },
    downloadFile(row) {
      console.log('Downloading file:', row)
      // Implement file download logic here
      console.log(file)

      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = row.fileUrl
      document.body.appendChild(link)
      link.click()
    },

    // handleDelete(row) {
    //   console.log('Deleting file:', row)
    //   this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
    //     type: 'warning'
    //   }).then(() => {
    //     deleteOrderFile(row.id).then(res => {
    //       if (res.code === 0) {
    //         this.$notify({
    //           message: 'Delete Success',
    //           type: 'success'
    //         })
    //         this.getOrderFileList()
    //       } else {
    //         this.$notify({
    //           message: res.msg,
    //           type: 'error'
    //         })
    //       }
    //     })
    //   })
    // },
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
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()
      this.fileList = []
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: undefined,
        shippingOrderId: undefined,
        taskName: undefined
      }
    }, // 提交上传文件
    submitUploadForm() {
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
          this.$refs.uploadFileRef.submit()
          this.$emit('confirm')
        }
        console.log('111111111111111111')
      })
    },
    handleFileChange(file, fileList) {
      console.log("222")
      const type = file.name.split('.').pop().toLowerCase()
      const acceptType = ['csv', 'doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png']
      if (acceptType.includes(type)) {
        this.fileList = fileList
      } else {
        this.$message.error('The file format does not meet the upload requirements.');
        this.fileList = []
        return
      }
      // this.fileList = fileList
    },
    // handleTaskConfirm() {
    //   console.log('handleTaskConfirm')
    //   console.log('this.task', this.tableData)
    //   if (this.tableData.length == 0) {
    //     this.$notify({
    //       message: 'Please upload the document',
    //       type: 'warning'
    //     })
    //     return
    //   }
    //   this.$emit('confirm', this.task)
    //   this.dialogVisible = false
    // },
    handleTypeChange(value) {
      console.log('选择的类型:', value)
      if (value == '03' || value == '04') {
        this.showBlType = true
      } else {
        this.showBlType = false
      }
    }
  }
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
}
</style>
