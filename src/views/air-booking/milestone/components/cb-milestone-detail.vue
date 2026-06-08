<template>
  <div v-loading="dialogLoading" class="milestone-detail" :style="{ maxHeight: maxHeight }">
    <el-descriptions title="Air Booking Info" :colon="false" style="border: none;padding: 15px!important;background: #fff;" :column="4">
      <el-descriptions-item label="MOOV Reference">{{ airBooking.moovRef }}</el-descriptions-item>
      <el-descriptions-item label="Airline">{{ airBooking.airline }}</el-descriptions-item>
      <el-descriptions-item label="POL">{{ airBooking.pol }}</el-descriptions-item>
      <el-descriptions-item label="POD">{{ airBooking.pod }}</el-descriptions-item>
      <el-descriptions-item label="ETD">{{ parseUTCTime(airBooking.etd) }}</el-descriptions-item>
      <el-descriptions-item label="ETA">{{ parseUTCTime(airBooking.eta) }}</el-descriptions-item>
      <el-descriptions-item label="MAWB">
        <span v-if="mblFile?.documentNumber">{{ mblFile?.documentNumber }}</span>
        <el-tag v-else type="danger">Undone</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="BL Type">{{ mblFile?.blType }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>
  
  <script>
import {shippingMilestoneAggregate} from '@/api/air/booking'
export default {
  name: 'CbMilestoneDetail',
  props: {
    milestoneId: { type: Number, default: 0 },
    maxHeight: { type: String, default: '100%' }
  },
  components: { },
  data() {
    return {
      dialogLoading: false,
      milestone: {},
      airBooking: {},
      airBookingAggregate: {},
      mblFile: {},
      shippingOrders: [],
      task: {},
      bookingNumber: null,
    }
  },
  created() {
    // this.refresh(this.milestoneId)
  },
  methods: {
    refresh(milestoneId) {
      console.log('milestone detail refresh', milestoneId)
      this.fetchDetail(milestoneId)
    },
    fetchDetail(milestoneId) {
      this.dialogLoading = true
      shippingMilestoneAggregate(milestoneId).then(res => {
        console.log('milestoneDetail', res.data)
        const { airBookingAggregate, mawb } = res.data
        this.airBooking = Object.assign({}, airBookingAggregate.airBooking)
        console.log('airBooking', this.airBooking)
        this.mblFile = Object.assign({}, mawb)
        const { shippingOrders, airBookingLines} = res.data.airBookingAggregate
        this.dialogLoading = false
      }).catch(err => {
        console.error('Error fetching milestone detail:', err)
        this.dialogLoading = false
      })
    },
  }
}
</script>
  
<style scoped>
/* Add your styles here */
.icon-large {
  font-size: 30px; /* 方案1: 直接设置字体大小 */
  /* transform: scale(1.5);  方案2: 使用缩放 */
  cursor: pointer;
}
.tools-but {
  text-align: right;
}
.card-item {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.custom-layout {
  display: flex;
  align-items: center;
}

.checkbox-left {
  margin-right: 10px;
}

.po-number-left {
  padding-left: 5px;
  white-space: nowrap;
}

/* 覆盖 el-descriptions 默认样式 */
::v-deep(.el-descriptions-item__content) {
  display: flex;
  align-items: center;
}
.el-col {
  padding-top: 10px;
}
</style>
  