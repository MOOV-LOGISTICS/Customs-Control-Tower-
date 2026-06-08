<template>
  <el-dialog title="Amend Request" :visible.sync="dialogVisible" width="80%">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Pending" name="pending">
        <el-table :data="pendingData" border style="width: 100%" :loading="loading">
          <el-table-column prop="type" label="Type" />
          <el-table-column prop="soRef" label="SO Ref" />
          <el-table-column prop="shipmentType" label="Shipment Type" />
          <el-table-column prop="pol" label="POL" />
          <el-table-column prop="shipmentRef" label="Shipment Ref" />
          <el-table-column prop="initiator" label="Initiator" />
          <el-table-column prop="status" label="Status" />
          <el-table-column prop="createTime" label="Create Time" />
          <el-table-column prop="auditor" label="Auditor" />
          <el-table-column prop="auditTime" label="Audit Time" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="History" name="history">
        <el-table :data="historyData" border style="width: 100%" :loading="loading">
          <el-table-column prop="type" label="Type" />
          <el-table-column prop="soRef" label="SO Ref" />
          <el-table-column prop="shipmentType" label="Shipment Type" />
          <el-table-column prop="pol" label="POL" />
          <el-table-column prop="shipmentRef" label="Shipment Ref" />
          <el-table-column prop="initiator" label="Initiator" />
          <el-table-column prop="status" label="Status" />
          <el-table-column prop="createTime" label="Create Time" />
          <el-table-column prop="auditor" label="Auditor" />
          <el-table-column prop="auditTime" label="Audit Time" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { shippingApprovalPage } from '@/api/pepco/shipping-approval'

export default {
  name: 'RequestDialog',
  data() {
    return {
      dialogVisible: false,
      activeTab: 'pending',
      onlyMime: true,
      pendingData: [],
      historyData: [],
      loading: false
    }
  },
  methods: {
    openDialog(onlyMime) {
      this.dialogVisible = true
      this.fetchData(this.activeTab)
    },
    fetchData(tab) {
      this.loading = true
      const query = { status: tab === 'pending' ? 'pending' : 'history' }
      shippingApprovalPage(query)
        .then(response => {
          if (tab === 'pending') {
            this.pendingData = response.data.records
          } else {
            this.historyData = response.data.records
          }
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