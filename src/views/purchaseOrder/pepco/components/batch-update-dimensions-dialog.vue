<template>
  <!-- 对话框(上传/下载模板) -->
  <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :on-change="handleFileChange"
      :action="upload.url"
      :disabled="upload.isUploading"
      :file-list="fileList"
      :on-remove="handleFileRemove"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t('purchaseOrder.DragTheFileHereOr') }}
        <em>{{ $t('purchaseOrder.clickUpload') }}</em>
      </div>
      <div class="el-upload__tip text-center" slot="tip">
        <div>{{ $t('purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed') }}</div>
        <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">{{ $t('purchaseOrder.downloadingTheTemplate') }}</el-link>
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" :loading="submitLoading" @click="submitFileForm">{{ $t('el.popconfirm.confirmButtonText') }}</el-button>
      <el-button size="mini" @click="upload.open = false">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDimensionsImportTemplate } from '@/api/order/task'
import { getBaseHeader } from '@/utils/request'

export default {
  name: 'batchUpdateDimensions',

  data() {
    return {
      fileList: [],
      submitLoading: false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/dimensionImport',
        statuskey: '' //"Possible" "Urgent" "Overdue"
      }
    }
  },

  methods: {
    handleFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
    },
    openDialog(queryParams) {
      console.log('openDialog')
      console.log('queryParams')
      console.log(queryParams)
      this.statuskey = queryParams.statuskey
      this.upload.open = true
      this.submitLoading = false
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      if (response.data&&response.data.message) {
        this.$modal.msgError(response.data.message)
        this.upload.open = false
        this.submitLoading = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        return
      }
      this.upload.open = false
      this.submitLoading = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$emit('refresh')
      this.$notify.success('Batch Update Dimension Success!')
      // // 拼接提示语
      // let data = response.data.failureClp;
      // let text = 'Errors:' + data.length;
      // for (const t of data) {
      //   text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + t;
      // }
      // if(data.length>0){
      //   this.$alert(text, "Errors", { dangerouslyUseHTMLString: true });
      // }
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      this.$notify.info('Document export in progress, please wait')
      getDimensionsImportTemplate({ statusKey: this.statuskey })
        .then(response => {
          this.$download.excel(response, 'dimensions_import_template.xlsx')
          this.$notify.success('Document export Success')
        })
        .catch(error => {
          this.$notify.error('Document export Failed,' + error)
        })
    },
    // 提交上传文件
    submitFileForm() {
      if (this.fileList.length === 0) {
        this.$notify.info('Please upload the document first')
        return
      }
      this.submitLoading = true
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
