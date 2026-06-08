<template>
  <div>
    <!-- <common-form-handler ref="commonFormHandler" @success="refresh"></common-form-handler> -->
    <air-departure-handler ref="airDepartureHandler"></air-departure-handler>
  </div>
</template>

<script>
import { openNewWindow } from "@/api/utils/openWindow";
import CommonFormHandler from '@/views/air-booking/milestone/handler/00-common/index.vue'
import AirDepartureHandler from '@/views/air-booking/milestone/handler/15-air-departure/components/air-departure.vue'

export default {
  components: {
    CommonFormHandler,
    AirDepartureHandler
  },

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
        // if (this.$auth.hasPermi('shipment:query')) {
        if (true) {
          this.isProcessing = false;
          openNewWindow('/shipment/air-booking-detail?bookingId=' + milestone.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply')
          this.isProcessing = false;
        }
      } else if (mode == 'view') {
        try {
          await this.$refs.airDepartureHandler.openDialog(milestone, 'view');
        } catch (error) {
          console.error('Open dialog failed:', error);
        } finally {
          this.isProcessing = false;
        }
      }
    },
    refresh() {
      this.$emit('refresh');
    },
  }
}
</script>

<style lang="scss" scoped></style>