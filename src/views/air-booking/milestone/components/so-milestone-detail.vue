<template>
  <div v-loading="dialogLoading" class="milestone-detail" :style="{ maxHeight: maxHeight }">
    <!-- basic info -->
    <el-descriptions :colon="false" style="border: none;padding: 15px!important;background: #fff;" :column="4">
      <el-descriptions-item label="SO Ref">{{ shippingOrder.soRef }}</el-descriptions-item>
      <el-descriptions-item label="Booking Type">{{ shippingOrder.shipmentType }}</el-descriptions-item>
      <el-descriptions-item label="Payment Term">{{ shippingOrder.paymentTerm }}</el-descriptions-item>
      <el-descriptions-item label="Incoterm">{{ shippingOrder.incoterm ? shippingOrder.incoterm.toUpperCase() : '' }}</el-descriptions-item>
      <el-descriptions-item label="Freight Method">{{ shippingOrder.freightMethod? shippingOrder.freightMethod.toUpperCase() : '' }}</el-descriptions-item>
      <el-descriptions-item label="Origin Airport">{{ airBookingAggregate?.airBooking?.originPort !=null? airBookingAggregate.airBooking.originPort: shippingOrder.originPort }}</el-descriptions-item>
      <el-descriptions-item label="Destination Airport">{{ airBookingAggregate?.airBooking?.destinationPort !=null? airBookingAggregate.airBooking.destinationPort: shippingOrder.destinationPort }}</el-descriptions-item>
      <el-descriptions-item label="DC">{{ shippingOrder.dc }}</el-descriptions-item>
      <el-descriptions-item label="BL Type">{{ shippingOrder.blType }}</el-descriptions-item>
      <el-descriptions-item label="HAWB Number">{{ shippingOrder.hblNumber }}</el-descriptions-item>
      <el-descriptions-item label="Latest CRD">{{ parseUTCTime(shippingOrder.latestCrd) }}</el-descriptions-item>
      <el-descriptions-item label="Latest HOD">{{ parseUTCTime(shippingOrder.latestHod) }}</el-descriptions-item>
      <el-descriptions-item label="ETD">{{ parseUTCTime(milestone.etd) }}</el-descriptions-item>
      <el-descriptions-item label="ETA">{{ parseUTCTime(milestone.eta) }}</el-descriptions-item>
    </el-descriptions>

    <!-- order list -->
    <el-card style="margin-top: 10px;">
      <el-table :data="orderHeaders">
        <el-table-column prop="orderNumber" label="Order Number" min-width="130" align="center" />
        <el-table-column prop="taskStatus" label="Pending Status" min-width="150" align="center" />
        <el-table-column label="Supplier Name" min-width="180" prop="seller" show-overflow-tooltip>
          <template v-slot="scope">
            <bsc-supplier-text :supplierId="scope.row.seller" />
          </template>
        </el-table-column>
        <el-table-column label="HOD" min-width="110" prop="cargoHandoverDate">
          <template v-slot="scope">{{ parseUTCTime(scope.row.cargoHandoverDate) }}</template>
        </el-table-column>
        <el-table-column label="Planned CRD" min-width="110" prop="cargoHandoverDate">
          <template v-slot="scope">{{ parseUTCTime(scope.row.cargoHandoverDate - (7 * 24 * 60 * 60 * 1000)) }}</template>
        </el-table-column>
        <el-table-column label="In-DC Date" min-width="110" prop="deliveryDate">
          <template v-slot="scope">{{ parseUTCTime(scope.row.deliveryDate) }}</template>
        </el-table-column>
        <!-- <el-table-column label="Sanitary Risk" min-width="110" prop="sanitaryRisk" align="center">
          <template v-slot="scope">
            <span :style="{ color: scope.row.sanitaryRisk ? 'red' : 'green' }">{{ scope.row.sanitaryRisk ? 'Y' : 'N' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Booking Date" min-width="110" prop="lastBookingTime">
          <template v-slot="scope">{{ parseUTCTime(scope.row.lastBookingTime) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import {shippingMilestoneAggregate} from '@/api/air/booking'

export default {
  name: 'SoMilestoneDetail',
  props: {
    milestoneId: { type: Number, default: 0 },
    maxHeight: { type: String, default: '100%' }
  },
  data() {
    return {
      activeNames: ['1'],
      dialogLoading: false,
      shippingOrder: {},
      orderHeaders: [],
      milestone: {},
      airBookingAggregate: {
        airBooking: {},
        shippingOrders: []
      },
    }
  },
  created() {
    this.refresh(this.milestoneId)
  },
  methods: {
    refresh(milestoneId) {
      console.log('milestone detail refresh', milestoneId)
      this.dialogLoading = true
      shippingMilestoneAggregate(milestoneId)
      .then(res => {
        console.log('milestones detail data', res.data)
        this.shippingOrder = res.data.shippingOrder.shippingOrder
        this.orderHeaders = res.data.shippingOrder.orderHeaders
        this.milestone = res.data.milestone
        this.airBookingAggregate = res.data.airBookingAggregate
        this.dialogLoading = false
      })
    },
    clear() {
      this.shippingOrder = {}
      this.orderHeaders = []
      this.milestone = {}
      this.airBookingAggregate = {
        airBooking: {},
        shippingOrders: []
      }
    },
    handleChange(val) {
      console.log('Collapse changed:', val)
    }
  }
}
</script>

<style scoped>
.milestone-detail {
  padding: 5px 20px;
  overflow-y: auto;
}
</style>