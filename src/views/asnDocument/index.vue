<template>
  <el-card class="card-wrapper">
    <el-table v-loading="loading" :data="documents" border stripe>
      <el-table-column label="File Name" prop="fileName" width="250px"></el-table-column>
      <el-table-column label="Description" prop="description"></el-table-column>
      <el-table-column label="Actions" width="150px">
        <div class="icon-wrapper" slot-scope="scope">
          <el-button :loading="scope.row.downloading" class="icon-btn" icon="el-icon-download" @click="download(scope.row)"></el-button>
          <el-button :loading="scope.row.previewLoading" class="icon-btn" icon="el-icon-view" @click="onPreview(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>

    <document-preview :document="document" :visible="visible" @onClose="handleClose" />
  </el-card>
</template>
<script>
import {getAsnDocumentByUserId} from "@/api/asnDocument/asnDocument";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficePdf from "@vue-office/pdf"
import "@vue-office/docx/lib/index.css";
import '@vue-office/excel/lib/index.css'
import axios from "axios";
import {getBaseHeader} from "@/utils/request";
import DocumentPreview from "@/views/asnDocument/documentPreview/documentPreview.vue";

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

export default {
  name: "index",
  components: {DocumentPreview, VueOfficePdf, VueOfficeDocx},
  data() {
    return {
      loading: false,
      documents: [],
      visible: false,
      document: {
        fileType: null,
        filePath: null
      }
    }
  },
  async mounted() {
    this.loading = true
    await this.getAsnDocument()
    this.loading = false
  },
  methods: {
    async getAsnDocument() {
      // 获取用户关联的ASN Document
      const res = await getAsnDocumentByUserId({ userId: this.$store.getters.userId })
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].downloading = false
          res.data[i].previewLoading = false
        }
        this.documents = res.data
      }
    },
    async download(row) {
      // 获取文件
      row.downloading = true
      const res = await axios({
        url: row.filePath,
        method: 'get',
        responseType: 'blob',
        headers: getBaseHeader()
      })
      if (res.data) {
        // 生成下载链接
        const url = URL.createObjectURL(res.data)
        const a = document.createElement("a")
        a.download = row.fileName
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      row.downloading = false
    },
    async onPreview(row) {
      // 截取文件类型
      const fileType = row.filePath.split('.').at(-1)
      this.document.fileType = fileType
      // 获取预览文件
      row.previewLoading = true
      try {
        const res = await axios({
          url: row.filePath,
          method: 'get',
          responseType: 'blob',
          headers: getBaseHeader()
        })
        if (res.data) {
          // 生成链接
          const blob = new Blob([res.data], { type: MIME_TYPES[fileType] || 'application/octet-stream' })
          this.document.filePath = URL.createObjectURL(blob)
          this.visible = true
        }
        row.previewLoading = false
      } catch (error) {
        // 链接获取失败取消loading状态
        row.previewLoading = false
      }
    },
    handleClose() {
      // 关闭弹窗，清除状态
      this.visible = false
      this.document = {
        fileType: null,
        filePath: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  padding: 20px;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
    .icon-btn {
      border: none;
      background-color: transparent;
      padding: 0;
    }
  }
}
</style>
