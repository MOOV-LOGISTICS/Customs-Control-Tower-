<template>
  <!--office文档预览弹窗-->
  <el-dialog ref="previewDialogRef" title="Preview" width="90%" :visible="visible" @close="handleClose">
      <vue-office-docx
        v-if="document.fileType === 'docx' || document.fileType === 'doc'"
        :src="document.filePath"
        style="height: 100%">
      </vue-office-docx>
<!--      PDF文件使用iframe进行预览-->
      <iframe v-else-if="document.fileType === 'pdf'" :src="document.filePath" style="width: 100%; height: 90vh" />
      <vue-office-excel
        v-else-if="document.fileType === 'xlsx' || document.fileType === 'xls'"
        :src="document.filePath"
        style="height: 100%">
      </vue-office-excel>
    </el-dialog>
</template>
<script>
import VueOfficePdf from "@vue-office/pdf";
import VueOfficeDocx from "@vue-office/docx";

export default {
  name: "documentPreview",
  props: ['document', 'visible', 'onClose'],
  components: {VueOfficePdf, VueOfficeDocx},
  methods: {
    handleClose() {
      this.$emit("onClose")
      // 释放资源
      URL.revokeObjectURL(this.document.filePath)
    }
  }
}
</script>
