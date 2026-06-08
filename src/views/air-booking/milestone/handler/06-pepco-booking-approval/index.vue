<template>
  <div></div>
</template>

<script>
import { openNewWindow } from "@/api/utils/openWindow";
import {
  getHeaderInfoForPepco,
} from "@/api/order/header";
export default {
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    async handle(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      // 设置处理状态
      this.isProcessing = true;
      if (mode == 'edit') {
        openNewWindow("/shipment/ppShippingOrderList?soRef=" + milestone.shippingOrderRef, this.$router, () => {
          this.isProcessing = false;
        });
      } else if (mode == 'view') {
        // const response = await getHeaderInfoForPepco({
        //   orderNumber: milestone.orderNumber
        // });
        if (!milestone.shippingOrderId) {
          this.isProcessing = false;
          this.$message.warning('No shipping booking data found for this milestone.')
          return
        }
        // this.rowInfo = {
        //   ...response.data,
        // };
        openNewWindow("/shipment/ppShippingOrderDetail?id=" + milestone.shippingOrderId, this.$router, () => {
          this.isProcessing = false;
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>