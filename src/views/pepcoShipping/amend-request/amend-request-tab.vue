<template>
  <div>
    <el-table :data="listData" size="mini" height="300px" style="width: 100%" v-loading="loading">
      <el-table-column prop="type" label="Type" />
      <!-- <el-table-column prop="soRef" label="SO Ref" /> -->
      <!-- <el-table-column prop="shipmentType" label="Shipment Type" /> -->
      <!-- <el-table-column prop="pol" label="POL" /> -->
      <!-- <el-table-column prop="shipmentRef" label="Shipment Ref" /> -->
      <el-table-column prop="initiator" label="Initiator" min-width="140" />
      <el-table-column prop="createTime" label="Create Time">
        <template slot-scope="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
      <el-table-column prop="auditor" label="Auditor" min-width="140" />
      <el-table-column prop="auditTime" label="Audit Time" >
        <template slot-scope="scope">{{ formatUserLocalTime(scope.row.auditTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="Status">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 0">Begin</el-tag>
          <el-tag type="warning" v-if="scope.row.status === 1">In process</el-tag>
          <el-tag type="success" v-if="scope.row.status === 2">Done</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 3">Rejected</el-tag>
          <el-tag type="primary" v-if="scope.row.status === 4">Read</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { shippingApprovalPage } from '@/api/pepco/shipping-approval'

export default {
  name: 'RequestTable',
  data() {
    return {
      listQuery: {
        pageNo: 1,
        soId: undefined,
        pageSize: 100,
        total: 0,
        status: undefined,
        orderBy: 'id'
      },
      shippingOrderId: undefined,
      loading: false,
      listData: []
    }
  },
  methods: {
    activeTab(shippingOrderId) {
      // if (this.shippingOrderId != shippingOrderId || this.listData.length == 0) {

      // }
      this.listData = []
      this.shippingOrderId = shippingOrderId
      this.fetchData(shippingOrderId)
    },
    fetchData(shippingOrderId) {
      this.loading = true
      this.listQuery.soId = shippingOrderId
      shippingApprovalPage(this.listQuery)
        .then(res => {
          this.listData = res.data.list
          this.listQuery.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
