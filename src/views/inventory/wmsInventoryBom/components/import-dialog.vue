<template>
  <el-dialog :title="upload.title" :visible.sync="dialogOpen" width="400px" append-to-body @close="cancelClick">
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-change="handleFileChange"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("purchaseOrder.DragTheFileHereOr") }}
        <em>{{ $t("purchaseOrder.clickUpload") }}</em>
      </div>
      <div class="el-upload__tip text-center" slot="tip">
        <div>
          {{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}
        </div>
        <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="exportTemplate">{{$t("purchaseOrder.downloadingTheTemplate")}}</el-link>
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submitFileForm" :disabled="btnLoading">{{ $t("purchaseOrder.confirm") }}</el-button>
      <el-button size="mini" @click="cancelClick">{{ $t("purchaseOrder.cancel") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportBomTemplate, exportBomSearchTemplate } from '@/api/wms/wms-cc'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'Upload',
  mixins: [fileLoadMixin],
  data() {
    return {
      dialogOpen: false,
      fileList: [],
      btnLoading: false,
      errorList: [],
      upload: {
        open: false,
        title: 'Import',
        url: '',
        isUploading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        templateType: 1
      }
    }
  },
  created() {},
  methods: {
    openDialog(type) {
      this.dialogOpen = true
      this.upload.templateType = type
      if (type === 1) {
        this.upload.title = 'Bom Import'
        this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/warehouse/cc/item-bom/import/bom'
      }
      if (type === 2) {
        this.upload.title = 'Search Bom Import'
        this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/warehouse/cc/item-bom/import/bom-search'
      }
    },
    /** 下载模板操作 */
    exportTemplate(type) {
      if (this.upload.templateType === 1) {
        exportBomTemplate().then(response => {
          this.$download.excel(response, 'Bom-Template.xlsx')
        })
      } else if (this.upload.templateType === 2) {
        exportBomSearchTemplate().then(response => {
          this.$download.excel(response, 'Bom-Search-Template.xlsx')
        })
      }
    },
    // 提交上传文件
    submitFileForm() {
      console.log('---submitFileForm---')
      this.btnLoading = true
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      console.log('beforeUpload')
      const isLt2M = file.size / 1024 / 1024 < 16
      if (!isLt2M) {
        this.$message.error('File size cannot exceed 16MB!')
      }
      if (!isLt2M) {
        this.upload.isUploading = false
        this.btnLoading = false
      }
      return isLt2M
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      console.log('handleFileUploadProgress')
      this.upload.isUploading = true
      this.btnLoading = true
    },
    cancelClick() {
      this.dialogOpen = false
      this.btnLoading = false
      this.$refs.upload.clearFiles()
      this.errorList = []
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.cancelClick()
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        this.$refs.upload.clearFiles()
        return
      }
      this.dialogOpen = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()

      this.$emit('success', this.upload.templateType)
    }
  }
}
</script>
