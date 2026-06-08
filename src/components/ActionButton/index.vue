<template>
  <div class="action-button">
    <el-button :disabled="false" :type="buttonType || 'primary'" @click="viewDocument" :icon="iconType" style="margin-right: 6px">{{ buttonText || '' }}</el-button>

    <el-dialog :visible.sync="visible" title="Preview Document" width="90vw" class="knowledge-dialog" :close-on-click-modal="false" @close="onClose" append-to-body>
      <VueOfficeDocx v-if="isDocFile" :src="iframeUrl" style="height: 100%" @error="handleError" @rendered="rendered" />
      <VueOfficeExcel v-else-if="isExcelFile" :src="iframeUrl" style="height: 78vh" @error="handleError" @rendered="rendered" />
      <iframe v-else :src="iframeUrl" frameborder="0" style="width: 100%; height: 90vh" />

      <el-button v-if="downloadText" style="float: right;" type="primary" @click="handleConfirm">{{ downloadText }}</el-button>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { getAccessToken } from '@/utils/auth'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import { Base64 } from 'js-base64'

// 预定义的MIME类型映射
const MIME_TYPES = {
  // Documents
  pdf: 'application/pdf',
  txt: 'text/plain',
  csv: 'text/csv',
  html: 'text/html',

  // Microsoft Office
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  webp: 'image/webp',

  // Archives
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',

  // Audio/Video
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',

  // Programming
  json: 'application/json',
  xml: 'application/xml',
  js: 'application/javascript',
  css: 'text/css'
}

// 需要在线预览的压缩文件类型
const ARCHIVE_FORMATS = ['7z', 'tar', 'zip', 'rar']

export default {
  name: 'ActionButton',
  components: { VueOfficeDocx, VueOfficeExcel },
  props: {
    url: String,
    type: String,
    iconType: String,
    fileName: String,
    downloadText: String,
    buttonType: String,
    buttonText: String
  },
  data() {
    return {
      visible: false,
      iframeUrl: '',
      downloadUrl: ''
    }
  },
  computed: {
    fileExtension() {
      return this.fileName?.split('.').pop().toLowerCase() || ''
    },
    isDocFile() {
      return ['doc', 'docx'].includes(this.fileExtension)
    },
    isExcelFile() {
      return ['csv', 'xls', 'xlsx'].includes(this.fileExtension)
    },
    isArchiveFile() {
      return ARCHIVE_FORMATS.includes(this.fileExtension)
    }
  },
  methods: {
    onClose() {
      this.visible = false
      // 释放URL对象
      if (this.iframeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.iframeUrl)
      }
      if (this.downloadUrl) {
        URL.revokeObjectURL(this.downloadUrl)
      }
    },

    rendered() {
      // 可以添加渲染完成后的回调逻辑
    },

    handleError(error) {
      console.error('Document render error:', error)
      this.$message.error('Failed to render document')
    },

    async viewDocument() {
      try {
        const res = await request({
          url: this.url,
          method: 'get',
          responseType: 'blob',
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })

        if (!(res instanceof Blob)) {
          throw new Error('Invalid response type')
        }

        const blobType = this.getBlobType(res)
        const blob = new Blob([res], { type: blobType })

        this.downloadUrl = URL.createObjectURL(blob)

        if (this.type === 'preview') {
          this.handlePreview(blob, blobType)
        } else {
          this.handleConfirm()
        }
      } catch (error) {
        console.error('Failed to load document:', error)
        this.$message.error('Failed to load document')
      }
    },

    getBlobType(blob) {
      // 如果已有类型且不是默认类型，直接使用
      if (blob.type && blob.type !== 'application/octet-stream') {
        return blob.type
      }

      // 根据文件扩展名获取MIME类型
      return MIME_TYPES[this.fileExtension] || 'application/octet-stream'
    },

    handlePreview(blob, blobType) {
      if (this.isArchiveFile) {
        // 压缩文件使用在线预览服务
        this.iframeUrl = `${process.env.VUE_APP_ONLINEPREVIEW_API}/preview/onlinePreview?url=${encodeURIComponent(Base64.encode(this.url))}`
      } else {
        // 其他文件直接预览
        this.iframeUrl = URL.createObjectURL(blob)
      }
      this.visible = true
    },

    handleConfirm() {
      if (!this.downloadUrl) return

      const link = document.createElement('a')
      link.href = this.downloadUrl
      link.download = this.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 延迟释放URL对象
      setTimeout(() => {
        URL.revokeObjectURL(this.downloadUrl)
        this.downloadUrl = ''
      }, 100)
    }
  }
}
</script>

<style scoped lang="scss">
.action-button {
  display: inline-block;
}

::v-deep {
  .el-dialog__footer {
    text-align: center;
  }

  .el-dialog {
    height: 100vh;

    .el-dialog__body {
      max-height: 90%;
    }
  }

  #xlsx_incoming tr td {
    border: 1px solid #ccc;
    text-align: center;
  }
}
</style>
