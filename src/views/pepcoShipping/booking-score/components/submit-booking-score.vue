<template>
  <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
    <el-upload
      ref="upload"
      accept=".xlsx, .xls, .xml"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      v-loading="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :auto-upload="false"
      drag
      multiple
      :timeout="3000000"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("purchaseOrder.DragTheFileHereOr") }}
        <em>{{ $t("purchaseOrder.clickUpload") }}</em>
      </div>
      <div class="el-upload__tip text-center" slot="tip">
        <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
        <!-- <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downloadData">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link> -->
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">{{ $t("purchaseOrder.confirm") }}</el-button>
      <el-button size="mini" @click="upload.open = false">{{ $t("purchaseOrder.cancel") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getBaseHeader } from '@/utils/request'

export default {
  data() {
    return {
      upload: {
        open: false,
        title: '',
        isUploading: false,
        headers: getBaseHeader(),
        url: process.env.VUE_APP_BASE_API + '/admin-api/pepco/booking-score/under-scoring/submit'
      }
    }
  },
  methods: {
    openUploadDialog() {
      this.upload.title = 'Submit Booking Score'
      this.upload.open = true
    },
    handleFileError(err, file, fileList) {
      console.log('File upload failed:', err)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileSuccess(response, file, fileList) {
      console.log('File uploaded successfully:', response)
      if (response.code == null || response.code !== 0) {
        this.$modal.msgError(response.msg)
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      localStorage.setItem('booking-score-submit-id', response.data)
      this.$emit('success', response) // Emit an event to refresh the list
    },
    submitFileForm() {
      // It will take some time to submit the score. Please be patient.
      this.upload.headers = getBaseHeader()
      this.$refs.upload.submit()
    }
  }
}
</script>