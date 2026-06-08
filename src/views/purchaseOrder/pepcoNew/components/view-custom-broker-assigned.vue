<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body width="800px">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column align="center" label="Order Number" prop="orderNumber" />
      <el-table-column align="center" label="Shipment Number" prop="shipmentNumber" />
      <el-table-column align="center" label="DC Code" prop="dcCode" />
      <el-table-column align="center" label="DC Name" prop="dcName" />
      <el-table-column align="center" label="DC Date" prop="deliveryDate" />
      <el-table-column align="center" label="Broker" prop="broker" />
      <el-table-column align="center" label="Port Name" prop="pol" />
      <el-table-column align="center" label="PLAN CRD" prop="planCrdDate" />
      <el-table-column align="center" label="Order Cube" prop="orderCbm" />
    </el-table>
  </el-dialog>
</template>

<script>
import { getBrokerLogByOrderNumber } from '@/api/pepco/shipping-order'

export default {
  data() {
    return {
      task: {},
      dialogVisible: false,
      tableLoading: false,
      title: '',
      tableData: []
    }
  },
  created() {},
  methods: {
    openDialog(task) {
      this.task = task
      this.title = task.taskName
      this.taskCode = task.taskCode
      this.getBrokerLog()
      this.dialogVisible = true
      this.tableLoading = true
    },
    getBrokerLog() {
      getBrokerLogByOrderNumber(this.task.orderNumber).then(res => {
        this.tableData = res.data
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
}
</style>
