<template>
  <div>
    <common-form-handler ref="commonFormHandler" @success="refresh"></common-form-handler>
  </div>
</template>

<script>
import CommonFormHandler from '@/views/air-booking/milestone/handler/00-common/index.vue'
export default {
  components: {
    CommonFormHandler
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
        await this.$refs.commonFormHandler.openDialog(milestone, mode);
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