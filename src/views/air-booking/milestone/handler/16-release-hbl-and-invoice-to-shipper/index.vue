<template>
  <div>
    <release-hbl-handler ref="releaseHblHandler" @success="refresh"></release-hbl-handler>
  </div>
</template>

<script>
import ReleaseHblHandler from './release-hbl-handler/index.vue'
export default {
  components: {
    ReleaseHblHandler
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
        await this.$refs.releaseHblHandler.openDialog(milestone)
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