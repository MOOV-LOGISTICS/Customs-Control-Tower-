<template>
  <div>
    <verify-document-handler ref="verifyDocumentHandler" @success="refresh"></verify-document-handler>
  </div>
</template>

<script>
import VerifyDocumentHandler from './verify-document-handler/index.vue'
export default {
  components: {
    VerifyDocumentHandler
  },
  data() {
    return {
      isProcessing: false,
    }
  },
  methods: {
    handle(milestone, mode) {
      this.openDialog(milestone, mode);
    },
    async openDialog(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      this.isProcessing = true;
      try {
        await this.$refs.verifyDocumentHandler.openDialog(milestone)
      } catch (error) {
        console.error('Open dialog failed:', error);
      } finally {
        this.isProcessing = false;
      }
    },
    refresh() {
      this.$emit('success');
    },
  }
}
</script>

<style lang="scss" scoped></style>