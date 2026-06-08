<!-- DeliveryPlanTable.vue -->
<template>
  <div>
    <div>
      <el-table v-loading="loading" border height="250" style="width: 100%;" :data="tableData">
        <el-table-column label="Update Time" align="center" prop="updateTime" min-width="100px">
          <template slot-scope="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
        </el-table-column>
        <el-table-column label="Update User" align="center" prop="updater" min-width="100px">
          <template slot-scope="scope">
            <span v-if="String(scope.row.updater) === '0'">System</span>
            <bsc-user-text v-else :userId="scope.row.updater" />
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" prop="planStatus" min-with="100px">
          <template slot-scope="scope">
            {{ getPlanStatusText(scope.row.planStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="Mode of Transport" align="center" prop="transportMode" min-width="150px" />
        <el-table-column label="Delivery Schedule Date" align="center" prop="dcDate" min-width="180px">
          <template slot-scope="scope">{{ parseUTCTime(scope.row.dcDate) }}</template>
        </el-table-column>
        <el-table-column label="Delivery Schedule Hour" align="center" prop="bookingHour" min-width="180px" />
        <el-table-column label="Haulier" align="center" prop="freightContractor" min-width="200px" />
        <el-table-column label="Score" align="center" prop="score" min-width="100px" />
        <!-- zane 隐藏 -->
        <!-- <el-table-column label="Priority Type" align="center" prop="priorityType" min-width="100px" /> -->
        <el-table-column label="Send To WH" align="center" prop="dc" min-width="100px" />
        <el-table-column label="DC Code" align="center" prop="planDcCode" min-width="100px" />
        <el-table-column label="Approved for External WH" align="center" prop="approvedForExternalWh" min-width="150px" />
        <el-table-column label="Reason Code" align="center" prop="unPlannedReason" min-width="200px">
          <template slot-scope="scope">{{ parseUnplannedReason(scope.row.unPlannedReason) }}</template>
        </el-table-column>
        <el-table-column label="Container Number" align="center" prop="containerNo" min-width="150px" />
        <el-table-column label="Container Size" align="center" prop="containerType" min-width="110px" />
        <el-table-column label="Carrier" align="center" prop="carrier" min-width="100px" />
        <el-table-column label="Vessel" align="center" prop="vessel" min-width="200px" />
        <el-table-column label="Voyage" align="center" prop="voyage" min-width="120px" />
        <el-table-column label="Docs Number" align="center" prop="mpNumber" min-width="120px" />
        <el-table-column label="hbl Number" align="center" prop="hblNumber" min-width="150px" />
        <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" min-width="150px" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { createDestinationDeliveryPlan, getDestinationUnplannedReasonList, } from '@/api/destination/destination';
export default {
  name: 'DeliveryPlanTable',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    containerRowData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 1 是 pre delivery plan
    // 2 是 delivery plan
    deliveryPlanType: {
      type: Number,
      default: 1,
      required: true
    }
  },
  data() {
    return {
      newItem: {
        type: 1,
        shipmentId: null,
        destinationContainerId: null,
        containerNo: '',
        transportMode: '',
        dcDate: '',
        priorityType: '',
        bookingHour: '',
        freightContractor: '',
        dc: ''
      },
      submitLoading: false,
      dialogVisible: false,
      unplannedReasonMap: {},
    }
  },
  created() {
    getDestinationUnplannedReasonList().then(res => {
      console.log('getDestinationUnplannedReasonList', res)
      if (res.data) {
        res.data.forEach(item => {
          this.unplannedReasonMap[item.value] = item.label
        })
        console.log('this.unplannedReasonMap', this.unplannedReasonMap)
      }
    })
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true
      this.newItem = {
        type: this.deliveryPlanType,
        shipmentId: this.containerRowData.shipmentId,
        destinationContainerId: this.containerRowData.id,
        containerNo: this.containerRowData.containerNo,
        transportMode: '',
        dcDate: '',
        priorityType: '',
        bookingHour: '',
        freightContractor: '',
        dc: ''
      }
    },
    submitNewItem() {
      if (this.submitLoading) return
      this.submitLoading = true
      createDestinationDeliveryPlan(this.newItem)
        .then(res => {
          this.$message.success('Success')
          this.submitLoading = false
          this.dialogVisible = false
          this.$emit('refresh', true)
        })
        .catch(err => {
          console.error('请求失败:', err)
          this.$message.error('Error')
        })
        .finally(() => {
          this.submitLoading = false
          this.dialogVisible = false
        })
    },
    getPlanStatusText(status) {
      const s = Number(status)
      if (s === 1) return 'Planned'
      if (s === 2) return 'Unplanned'
      if (s === 3) return 'Replanned'
      if (s === 4) return 'Canceled'
      return 'Unknown'
    },
    parseUnplannedReason(code) {
      if (null == code || code == '') {
        return ''
      }
      const label = this.unplannedReasonMap[code]
      if (!label) {
        return {}
      }
      return code + ' - ' + label
    }
  }
}
</script>
