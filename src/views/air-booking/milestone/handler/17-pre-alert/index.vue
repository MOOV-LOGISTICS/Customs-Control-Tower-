<template>
  <div>
<pre-alert-handler ref="preAlertHandler" @success="refresh"></pre-alert-handler>  
</div>
</template>

<script>

import PreAlertHandler from './pre-alert-handler/index.vue'
export default {
  components: {
    PreAlertHandler
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
        await this.$refs.preAlertHandler.openDialog(milestone, mode === 'edit' ? true : false)
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