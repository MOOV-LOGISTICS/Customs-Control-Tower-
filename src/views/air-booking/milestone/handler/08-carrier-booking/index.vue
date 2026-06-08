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
        if (this.$auth.hasPermi("shipment:create")) {
          openNewWindow("/shipment/ppShippingOrderList?soRef=" + milestone.shippingOrderRef, this.$router, () => {
            this.isProcessing = false;
          });
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
          this.isProcessing = false;
        }
      } else if (mode == 'view') {
        // const response = await getHeaderInfoForPepco({
        //   orderNumber: milestone.orderNumber
        // });
        if (!milestone.shipmentId) {
          this.isProcessing = false;
          this.$message.warning('No booking data found for this milestone.')
          return
        }
        // this.rowInfo = {
        //   ...response.data,
        //   shipmentId: response.data.shipmentIds?.[0] || null
        // };
        this.isProcessing = false;
        openNewWindow("/shipment/air-booking-detail?bookingId=" + milestone.shipmentId)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>