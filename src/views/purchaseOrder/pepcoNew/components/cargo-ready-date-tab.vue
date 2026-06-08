<template>
  <el-table :data="crdInfoList" row-key="id">
    <el-table-column prop="cargoReadyDate" label="CRD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.cargoReadyDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="oldCargoReadyDate" label="Previous CRD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.oldCargoReadyDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="hod" label="HOD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.cargoHandoverDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="pCrd" label="Planned CRD" width="120px">
      <template slot-scope="scope">
        {{ parseUTCTime(scope.row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000) }}
      </template>
    </el-table-column>
    <el-table-column prop="outsideCRDReason" label="Reason">
      <template slot-scope="scope">
        {{ getCargoReadyDateReasons(scope.row.reason) }}
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
import {parseUTCTime} from "@/utils/ruoyi";
import {getCargoReadyDateLogsByOrderId} from "@/api/order/task";
import {DICT_TYPE} from "@/utils/dict";

export default {
  name: "cargoReadyDateTab",
  props: ['orderId'],
  data() {
    return {
      crdInfoList: []
    }
  },
  computed: {
    crdReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_READY_DATE_REASON_CODE]
    }
  },
  mounted() {
    // Cargo Ready Date Tab信息
    getCargoReadyDateLogsByOrderId({ orderId: this.orderId }).then(res => {
      if (res.data) {
        this.crdInfoList = res.data;
      }
    })
  },
  methods: {
    parseUTCTime,
    getCargoReadyDateReasons(code) {
      const reason = this.crdReasonCodes.find(item => item.value === code)
      if (reason) {
        return `${reason.value} - ${reason.label}`
      }
    }
  }
}
</script>
