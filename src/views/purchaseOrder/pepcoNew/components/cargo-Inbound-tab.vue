<template>
  <el-table :data="dataSource" row-key="id">
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
        {{ parseUTCTime(scope.row.updateTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="operatorAccount" label="User"></el-table-column>
  </el-table>
</template>
<script>
import {DICT_TYPE} from "@/utils/dict";
import {getAHodLogListByOrderId} from "@/api/order/header";

export default {
  name: "cargoInboundTab",
  props: ['orderId'],
  data() {
    return {
      dataSource: []
    }
  },
  computed: {
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]
    }
  },
  mounted() {
    console.log(this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]['C01'])
    getAHodLogListByOrderId({ orderId: this.orderId }).then(res => {
      if (res.data) {
        this.dataSource = res.data
      }
    })
  },
  methods: {
    getAHodReasons(code) {
      const option = this.reasonCodes.find(item => item.value === code)
      if (option) {
        return `${code}-${option.label}`
      }
    }
  }
}
</script>
