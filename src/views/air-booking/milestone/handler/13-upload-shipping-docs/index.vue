<template>
  <div>
    <shipping-document-handler ref="shippingDocumentHandler" @success="refresh"></shipping-document-handler>
  </div>
</template>

<script>
import ShippingDocumentHandler from './shipping-document-handler/index.vue'
export default {
  components: {
    ShippingDocumentHandler
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
        await this.$refs.shippingDocumentHandler.openDialog(milestone)
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