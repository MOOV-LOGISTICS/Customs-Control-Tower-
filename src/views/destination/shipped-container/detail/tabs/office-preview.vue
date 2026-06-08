<template>
  <el-dialog
    :visible.sync="visible"
    title="Preview Document"
    width="90%"
    append-to-body
    @close="handleClose"
  >
    <vue-office-docx v-if="fileInfo.fileType === 'docx'"
                     :src="docx" style="height: 100%"
                     @error="handleError" @rendered="rendered">
    </vue-office-docx>

    <vue-office-pdf v-if="fileInfo.fileType === 'pdf'"
                    :src="pdf" style="height: 100%"
                    @error="handleError" @rendered="rendered">
    </vue-office-pdf>

    <vue-office-excel v-if="fileInfo.fileType === 'xlsx'"
                      :src="xlsx" style="height: 78vh"
                      @error="handleError" @rendered="rendered">
    </vue-office-excel>
  </el-dialog>
</template>
<script>
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import VueOfficePdf from "@vue-office/pdf";
//引入相关样式
import "@vue-office/docx/lib/index.css";
import '@vue-office/excel/lib/index.css'
//import {viewDocumentById} from "@/api/order/task";

export default {
  components: {VueOfficeDocx, VueOfficeExcel, VueOfficePdf},
  data() {
    return {
      fileInfo: {
        fileType: '',
        fileId: '',
        fileName: ''
      },
      docx: '',
      pdf: '', //设置文档地址
      xlsx: '',
      loading: false,
      visible: false,
    }
  },

  methods: {
    previewDocument(file) {

      this.fileInfo.fileId = file.id;
      this.fileInfo.fileName = file.fileName;
      const allowExtension = ['pdf', 'xlsx', 'docx']
      const fileExtension = this.fileInfo.fileName.split('.').pop().toLowerCase();
      if (!allowExtension.includes(fileExtension)) {
        this.$notify.error(`this document is ` + fileExtension + ` ,but only supports previewing pdf, xlsx, and docx documents`);
        return;
      }
      this.visible = true;

      this.fileInfo.fileType = fileExtension;

      if (this.fileInfo.fileType === 'pdf') {
        this.pdf = file.fileUrl
      } else if (this.fileInfo.fileType === 'xlsx') {
        this.xlsx = file.fileUrl
      } else if (this.fileInfo.fileType === 'docx') {
        this.docx = file.fileUrl
      }
    },
    handleClose(){
      this.xlsx = '';
      this.pdf = '';
      this.docx = '';
      this.fileInfo.fileType = '';
      this.fileInfo.fileId = '';
      this.fileInfo.fileName = '';
    },
    rendered() {
      //loading.value = false;
      console.log('rendered');
    },
    handleError(errorInfo) {
      console.log('errorInfo');
      console.log(errorInfo);
      // alert("该文件暂不支持在线预览");
      //loading.value = false;
    }
  },
};


</script>
