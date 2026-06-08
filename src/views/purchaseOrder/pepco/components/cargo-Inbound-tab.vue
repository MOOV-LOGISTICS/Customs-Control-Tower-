<template>
  <el-table :loading="loading" :data="dataSource" row-key="id">
    <el-table-column prop="actualCargoHandoverDate" label="AHOD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.actualCargoHandoverDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="cargoHandoverDate" label="HOD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.cargoHandoverDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="reason" label="Reason">
      <template slot-scope="scope">
        {{ getAHodReasons(scope.row.reason) }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="Remark"></el-table-column>
    <el-table-column prop="updateTime" label="Update Time" width="150px">
      <template slot-scope="scope">
        {{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
      </template>
    </el-table-column>
    <el-table-column prop="operatorAccount" label="User"></el-table-column>
  </el-table>
</template>
<script>
import {DICT_TYPE} from "@/utils/dict";
import {getAHodLogListByOrderId} from "@/api/order/header";
import {getShippingOrderInfoById} from "@/api/pepco/shipping-order";

export default {
  name: "cargoInboundTab",
  props: ['orderId', 'shippingId'],
  data() {
    return {
      loading: false,
      dataSource: [],
      soType: null
    }
  },
  computed: {
    // Cargo Inbound reason code
    cargoInboundReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]
    },
    // Container Gate In reason code
    containerGateInReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CONTAINER_GATE_IN_REASON]
    }
  },
  async mounted() {
    this.loading = true
    // 如果shippingId不存在，说明还没做到这一步
    if (this.shippingId) {
      // 获取AHOD log记录和po对应的shipping信息，判断po属于FCL还是LCL
      const [aHodData, shippingData] = await Promise.all([getAHodLogListByOrderId({ orderId: this.orderId }), getShippingOrderInfoById({ id: this.shippingId })])
      if (aHodData.data) {
        this.dataSource = aHodData.data
      }
      if (shippingData.data) {
        this.soType = shippingData.data.shipmentType
      }
    }
    this.loading = false
  },
  methods: {
    // 根据soType获取reason信息
    getAHodReasons(code) {
      if (this.soType === 'FCL') {
        const option = this.containerGateInReasonCodes.find(item => item.value === code)
        if (option) {
          return `${code}-${option.label}`
        }
      } else if (this.soType === 'LCL') {
        const option = this.cargoInboundReasonCodes.find(item => item.value === code)
        if (option) {
          return `${code}-${option.label}`
        }
      }
    }
  }
}
</script>
