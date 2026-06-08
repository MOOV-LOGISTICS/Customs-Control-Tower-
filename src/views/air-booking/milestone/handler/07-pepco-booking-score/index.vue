<template>
  <div>
    <booking-score-view ref="bookingScoreView"></booking-score-view>
  </div>
</template>

<script>
import { openNewWindow } from "@/api/utils/openWindow";
import bookingScoreView from "./components/booking-score-view.vue";
export default {
  components: {
    bookingScoreView
  },
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
      if (mode == 'edit') {
        openNewWindow("/shipment/ppBookingScore", this.$router, () => {
          this.isProcessing = false;
        });
      } else if (mode == 'view') {
        this.isProcessing = false;
        this.$refs.bookingScoreView.openDialog(milestone)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>