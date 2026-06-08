<template>
  <div></div>
</template>

<script>
import { openNewWindow } from "@/api/utils/openWindow";
export default {
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    handle(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      // 设置处理状态
      this.isProcessing = true;
      openNewWindow("/shipment/ppShippingOrderList?soRef=" + milestone.shippingOrderRef, this.$router, () => {
        this.isProcessing = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped></style>