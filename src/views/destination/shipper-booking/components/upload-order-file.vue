<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div>
      <!-- Upload Button -->
      <el-button v-if="isEdit" type="primary" icon="el-icon-upload2" @click="uploadSet.open = true">Upload</el-button>

      <form v-if="!isEdit" label-width="150px" ref="uploadFormRef11" :show-message="false">
        <el-form-item label="Related PO" v-if="shippingOrderItems.length > 0">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(orderItem,index) in shippingOrderItems" :label="orderItem.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </form>
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
            <!-- <el-button type="primary" icon="el-icon-download" @click="downloadFile(scope.row)"></el-button> -->
            <el-link type="primary" :href="scope.row.fileUrl">
              <el-button type="primary" icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"></el-button>
            </el-link>
            <el-link>
              <el-button v-if="isEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
        <el-form-item :label="$t('document.status')" v-show="showBlType" :required="taskCode=='Release_HBL_and_Invoice_to_Shipper'&&uploadForm.typeCode=='03'" prop="blType">
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
        <el-form-item label="Related PO" v-if="shippingOrderItems.length > 0&&(uploadForm.typeCode == '02'|| uploadForm.typeCode=='03')">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(orderItem,index) in shippingOrderItems" :label="orderItem.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- <el-form-item :label="$t('uploadForm.email')" v-if="uploadSet.formData.type != '3'">
          <el-input type="textarea" placeholder v-model="uploadSet.formData.email" size="mini" :rows="3" maxlength="1000" show-word-limit resize="none" @change="handeDocumentEmailTrim"></el-input>
        </el-form-item>-->
        <!-- 如果选择HBL；填2个日期 -->
        <el-form-item required label="Draft HBL Date" v-if="uploadForm.typeCode == '03'" prop="draftHblDate">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.draftHblDate" type="date" placeholder="Draft HBL Date"></el-date-picker>
        </el-form-item>
        <el-form-item required label="HBL Issue Date" v-if="uploadForm.typeCode == '03'" prop="hblIssueDate">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.hblIssueDate" type="date" placeholder="HBL Issue Date"></el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('document.documentFile')">
          <el-upload
            ref="uploadFileRef"
            :limit="1"
            accept=".doc, .docx, .pdf, .xls, .xlsx"
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
          <el-button size="mini" type="primary" :disabled="uploadSet.isUploading" @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- <div v-if="refuseReason" class="refuse-container">
      <div class="refuse-info">
        <span class="info-text">{{refuseName}}</span>
        <span class="info-text">{{refuseTime}}</span>
      </div>
      <div class="refuse-comment">
        <span class="comment-label">Comments:</span>
        <span class="comment-text">{{refuseReason}}</span>
      </div>
    </div>-->
    <div v-if="task.status==1" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      <el-button type="primary" @click="handleTaskConfirm">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderFileList, uploadOrderFile, deleteOrderFile } from '@/api/pepco/order-file'
import { getPoRelatedSoByOrderId, getPoRelatedOrderFile, getShippingOrderItemList, getOrderShipmentPage, getShippingOrderDetail } from '@/api/pepco/shipping-order'
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
      fileTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
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
      shippingOrderNumber: [],
      refuseReason: '',
      refuseName: '',
      refuseTime: '',
      shipmentInfo: {
        shipmentId: ''
      }
    }
  },
  created() {
    console.log('UploadOrderFile created')
  },
  methods: {
    openDialog(task, activeTask, currentSeq) {
      console.log('openDialog', task)
      this.task = task
      this.title = task.taskName
      this.taskCode = task.taskCode

      if (task.taskCode != 'Upload_Shipping_Documents' && task.taskCode != 'Release_HBL_and_Invoice_to_Shipper') {
        // 将这些值放到fileTypes里面
        const hblTypes = [
          { label: 'Draft HBL', value: '02' },
          { label: 'HBL', value: '03' },
          { label: 'MBL', value: '04' }
        ]
        hblTypes.forEach(type => {
          const exists = this.fileTypes.some(ft => ft.value === type.value)
          if (!exists) {
            this.fileTypes.push(type)
          }
        })
      } else if (this.taskCode === 'Release_HBL_and_Invoice_to_Shipper') {
        console.log('进入了Release_HBL_and_Invoice_to_Shipper')
        this.fileTypes = [
          { label: 'Invoice to Supplier', value: '14' },
          { label: 'HBL', value: '03' },
          { label: 'Customs Declaration', value: '17' }
        ]
      }
      // 1. task是正在进行的status=1
      // 2. activeTask == 'Verify Shipping Documents',当前是Verify Shipping Documents,upload shippment file节点可编辑
      // 3. 当前是Release_HBL_and_Invoice_to_Shipper，并且正在进行的task seq>18, Release_HBL_and_Invoice_to_Shipper节点可以一直编辑
      this.isEdit = task.status == 1 || activeTask == 'Verify Shipping Documents' || (task.taskCode == 'Release_HBL_and_Invoice_to_Shipper' && currentSeq && currentSeq > 18)
      this.getShippingOrder()
      this.dialogVisible = true

      // 解析task中的jsonData
      if (task.jsonData != null && task.jsonData != undefined && task.jsonData != '') {
        const jsonData = JSON.parse(task.jsonData)
        if (jsonData.hasOwnProperty('reason')) {
          // 存在reason属性的处理
          this.refuseReason = jsonData.reason
          this.refuseName = jsonData.createBy
          this.refuseTime = this.formatDateTime(jsonData.createTime)
          // 进一步处理...
        } else {
          this.refuseReason = undefined
        }
      }
    },
    getShippingOrder() {
      getPoRelatedSoByOrderId({ orderId: this.task.orderId }).then(res => {
        this.shippingOrder = res.data.shippingOrder
        this.shippingOrderItems = res.data.shippingOrderItems
        this.shippingOrderItems.forEach(item => {
          this.checkedList.push(item.orderNumber)
        })
        this.shipmentInfo.shipmentId = this.shippingOrder.shipmentId
        this.getOrderFileList()
      })
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shippingOrderId: this.shippingOrder.id, orderHeaderId: this.task.orderId, taskCode: this.task.taskCode }).then(res => {
        this.tableData = res.data
        this.tableLoading = false
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
          this.uploadForm.taskCode = this.task.taskCode
          this.uploadForm.taskName = this.task.taskName
          this.uploadForm.shippingOrderId = this.shippingOrder.id
          this.$refs.uploadFileRef.submit()
        }
      })
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
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
      this.$emit('confirm', this.shipmentInfo)
      this.dialogVisible = false
    },
    handleTypeChange(value) {
      console.log('选择的类型:', value)
      if (value == '03' || value == '04') {
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
