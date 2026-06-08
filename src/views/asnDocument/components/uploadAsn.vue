<template>
  <el-dialog title="Upload Asn Document" width="600px" :visible="visible" @close="onClose">
    <div class="upload-container">
      <el-form ref="uploadForm" :model="uploadForm" :rules="rules" label-width="120px">
        <el-form-item label="File Type" prop="type">
          <el-select v-model="uploadForm.type" placeholder="Please select the file type">
            <el-option label="Customer view" value="Customer view"></el-option>
            <el-option label="Internal view" value="Internal view"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" prop="fileList">
          <el-upload
            ref="fileUpload"
            drag
            action="#"
            :multiple="false"
            :limit="1"
            :file-list="uploadForm.fileList"
            :before-upload="beforeUpload"
            :on-change="onChange"
            :on-remove="onRemove"
            :http-request="customRequest">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr") }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="text" autosize v-model="uploadForm.description" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="onClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from "axios";
import {getAccessToken, getTenantId} from "@/utils/auth";
import {getAsnDocumentDetailById, uploadAsnDocument} from "@/api/asnDocument/asnDocument";

export default {
  name: "uploadAsn",
  props: ['visible', 'rowInfo', 'handleClose', 'onSuccessCallback'],
  data() {
    return {
      loading: false,
      uploadForm: {
        type: null,
        description: null,
        fileList: []
      },
      rules: {
        type: [{ required: true, message: 'Please select the file type' }],
        fileList: [{ required: true, message: 'Please select file' }]
      },
      fileInfo: null
    }
  },
  watch: {
    async visible(newVal, oldVal) {
      if (newVal && this.rowInfo) {
        this.loading = true
        await this.getAsnDocumentInfo()
        this.loading = false
      }
    }
  },
  methods: {
    async getAsnDocumentInfo() {
      // 获取ASN文件信息
      const res = await getAsnDocumentDetailById({ id: this.rowInfo.id })
      if (res.data) {
        this.uploadForm = {
          type: res.data.type,
          description: res.data.description,
          fileList: [{
            name: res.data.fileName,
            url: res.data.filePath
          }]
        }
        // ASN文件信息
        this.fileInfo = {
          id: res.data.fileId,
          fileName: res.data.fileName,
          filePath: res.data.filePath
        }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          // 提交ASN
          uploadAsnDocument({
            id: this.rowInfo?.id,
            type: this.uploadForm.type,
            description: this.uploadForm.description,
            fileId: this.fileInfo.id,
          }).then(res => {
            if (res.data) {
              this.$message.success("Success")
              this.onClose()
              this.loading = false
              this.$emit('onSuccessCallback')
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    onClose() {
      this.$emit("handleClose")
      this.fileInfo = null
      this.$refs.uploadForm.resetFields()
    },
    onChange(file, fileList) {
      this.uploadForm.fileList = fileList
      // 校验是否有文件
      this.$refs.uploadForm.validateField('fileList')
    },
    onRemove(file, fileList) {
      this.uploadForm.fileList = fileList
      // 校验是否有文件
      this.$refs.uploadForm.validateField('fileList')
    },
    // 自定义上传
    async customRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.uploadForm.type)
      if (this.uploadForm.description) {
        formData.append('description', this.uploadForm.description)
      }
      // 有id则更新，否则插入一条新的数据
      if (this.rowInfo) {
        formData.append('id', this.rowInfo.id)
      }
      // 上传/更新ASN文件
      try {
        this.loading = true
        const res = await axios({
          url: '/admin-api/asnDocument/uploadAsnDocumentFile',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + getAccessToken(),
            'tenant-id': getTenantId(),
          }
        })
        if (res.data.data) {
          this.fileInfo = res.data.data
          onSuccess(res.data.data)
        } else {
          onError()
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        onError(error)
      }
    },
    // 限制上传的文件类型
    beforeUpload(file) {
      const accept = ['pdf', 'docx', 'doc', 'xlsx', 'xls']
      // 截取文件类型
      const fileType = file.name.split('.').at(-1)
      const isAccept = accept.includes(fileType)
      if (!isAccept) {
        this.$message.error('Only PDF, Word and Excel files can be uploaded!');
      }
      return isAccept
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
}
</style>
