<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div>
      <!-- Upload Button -->
      <!-- <el-button type="primary" icon="el-icon-upload2" @click="uploadSet.open = true">Upload</el-button> -->

      <!-- Table -->
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="documentNumber" label="Document Number" align="center" />
        <el-table-column prop="poNumber" label="PO Number" align="center" />
        <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
        <el-table-column prop="typeCode" label="Document Type" align="center">
          <template #default="scope">
            <span>{{ fileTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
        <el-table-column label="Action" align="center">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.fileUrl">
              <el-button type="primary" icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"></el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showAction" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      <el-button type="primary" @click="handleTaskConfirm">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderFileList, uploadOrderFile, deleteOrderFile } from '@/api/pepco/order-file'
import { getPoRelatedSoByOrderId, getPoRelatedOrderFile, getShippingOrderItemList, getOrderShipmentPage, getShippingOrderDetail } from '@/api/pepco/shipping-order'
import { getBaseHeader } from '@/utils/request'
import { getUserProfile } from '@/api/system/user'

export default {
  data() {
    return {
      dialogVisible: false,
      showAction: false,
      tableLoading: false,
      title: 'Task Document',
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' }
      ],
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/upload'
      },
      uploadForm: {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: ''
      },
      task: {},
      shippingOrder: {
        soRef: ''
      },
      shippingOrderItems: [],
      checkedList: [],
      taskCode: '',
      showBlType: false,
      shippingOrderList: [], // 存储文件列表
      user: {},
      shippingOrderNumber: []
    }
  },
  created() {
    console.log('UploadOrderFile created')
  },
  methods: {
    /**
     * 文件展示
     * @param task 当前task
     * @param taskCode 要显示文件列表的taskCode
     * @param showAction 显示操作
     */
    openDialog(task, taskCode) {
      console.log('openDialog', task)
      this.task = task
      this.title = task.taskName
      this.taskCode = taskCode

      this.getShippingOrder()
      this.dialogVisible = true
    },
    getShippingOrder() {
      getPoRelatedSoByOrderId({ orderId: this.task.orderId }).then(res => {
        this.shippingOrder = res.data.shippingOrder
        this.shippingOrderItems = res.data.shippingOrderItems
        this.shippingOrderItems.forEach(item => {
          this.checkedList.push(item.orderNumber)
        })
        this.getOrderFileList()
      })
    },
    getOrderFileList() {
      getUserProfile().then(response => {
        this.user = response.data
        this.tableLoading = true
        orderFileList({ shippingOrderId: this.shippingOrder.id, orderHeaderId: this.task.orderId, taskCode: this.taskCode || this.task.taskCode }).then(res => {
          if (this.user.isFactory) {
            this.tableData = []
            for (var file of res.data) {
              console.log(file.creator)
              console.log(this.user.id)
              if (file.creator == this.user.id + '') {
                this.tableData.push(file)
              }
            }
          } else {
            this.tableData = res.data
          }

          this.tableLoading = false
        })
      })
    },
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
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()
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
          if (this.$refs.uploadFileRef.uploadFiles == null || this.$refs.uploadFileRef.uploadFileslength == 0) {
            this.$notify({
              message: 'Please add files before uploading',
              type: 'warning'
            })
            return
          }
          this.uploadForm.taskCode = this.task.taskCode
          this.uploadForm.taskName = this.task.taskName
          this.uploadForm.shippingOrderId = this.shippingOrder.id
          this.uploadSet.isUploading = true
          this.$refs.uploadFileRef.submit()
        }
      })
    },
    handleTaskConfirm() {
      console.log('handleTaskConfirm')
      console.log('this.task', this.tableData)
      if (this.tableData.length == 0) {
        this.$notify({
          message: 'Please upload the document',
          type: 'warning'
        })
        return
      }
      this.$emit('confirm', this.task)
      this.dialogVisible = false
    },
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
