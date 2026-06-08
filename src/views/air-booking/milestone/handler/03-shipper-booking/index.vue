<template>
  <div></div>
</template>

<script>
import {
  getHeaderInfoForPepco,
} from "@/api/order/header";
import { openNewWindow } from "@/api/utils/openWindow";
export default {
  data() {
    return {
      rowInfo: {},
      isProcessing: false,
    }
  },
  methods: {

    async handle(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      // 设置处理状态
      this.isProcessing = true;
      console.log('ShippingBookingHandler handle', milestone, mode)
      const response = await getHeaderInfoForPepco({
        orderNumber: milestone.orderNumber
      });
      if (!response.data) {
        this.isProcessing = false;
        this.$message.warning('No shipping booking data found for this milestone.')
        return
      }
      response.data.orderItemProductInfo.forEach(item => {
        if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
          item.bookedProOuterSize = item.outerSize;
        }
        if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
          item.bookedProInnerPerOuter = this.calculateDivisionMethod(item.outerSize, item.tcSize);
        }
      });
      this.rowInfo = {
        ...response.data,
        items: response?.data?.orderItemProductInfo,
        shipmentId: response.data.shipmentIds?.[0] || null
      };
      const shippingId = this.rowInfo.shippingId
      const shippingOrderStatus = this.rowInfo.shippingOrderStatus
      if (mode === 'view') {
        openNewWindow("/shipment/ppShippingOrderDetail?id=" + shippingId, this.$router, () => {
          this.isProcessing = false;
        });
      } else if (mode === 'edit') {
        // Edit mode logic 
        if (shippingId !== null && shippingId !== 0 && shippingOrderStatus != null) {
          openNewWindow('/shipment/updatePpShippingOrder?id=' + shippingId, this.$router, () => {
            this.isProcessing = false;
          });
        } else {
          localStorage.setItem('shipping-selectedPoList', JSON.stringify([this.rowInfo]))
          openNewWindow('/shipment/ppCreateShippingOrder', this.$router, () => {
            this.isProcessing = false;
          });
        }
      }
    },
    calculateDivisionMethod(A, B) {
      if (A === B) {
        return 1
      }
      return (A / B);
    },
  }
}
</script>

<style lang="scss" scoped></style>