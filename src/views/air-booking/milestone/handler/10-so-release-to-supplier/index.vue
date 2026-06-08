<template>
  <div>
    <so-release-to-supplier ref="soReleaseToSupplier" @success="refresh"></so-release-to-supplier>
  </div>
</template>

<script>
import SoReleaseToSupplier from './components/so-release-to-supplier.vue'
export default {
  components: {
    SoReleaseToSupplier
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
        await this.$refs.soReleaseToSupplier.openDialog(milestone, mode);
      } catch (error) {
        console.error('Open dialog failed:', error);
      } finally {
        this.refresh();
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