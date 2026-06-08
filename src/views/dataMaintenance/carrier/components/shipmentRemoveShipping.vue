<template>
  <el-dialog title="Remove Shipper Booking" width="60%" :visible="visible" @close="onHandleClose">
    <el-table row-key="id" v-loading="loading" :data="dataSource" border stripe>
      <el-table-column label="SO Ref" prop="soRef" width="250px"></el-table-column>
      <el-table-column label="SO Type" prop="shipmentType"></el-table-column>
      <el-table-column label="POL" prop="originPort"></el-table-column>
      <el-table-column label="POD" prop="destinationPort"></el-table-column>
      <el-table-column label="DC" prop="dc"></el-table-column>
      <el-table-column label="Action" width="80px">
        <div class="icon-wrapper" slot-scope="scope">
          <el-button type="danger" circle icon="el-icon-check" @click="onCheck(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import {getShippingOrderListByShipmentId, removeShipperBooking} from "@/api/dataMaintenance/dataMaintenance";

export default {
  name: "shipmentRemoveShipping",
  props: ['visible', 'rowInfo', 'onClose'],
  data() {
    return {
      loading: false,
      dataSource: []
    }
  },
  watch: {
    async visible() {
      if (this.visible && this.rowInfo) {
        this.loading = true
        await this.getList()
        this.loading = false
      }
    }
  },
  methods: {
    async getList() {
      // 根据shipmentId获取shipping order
      const res = await getShippingOrderListByShipmentId({ shipmentId: this.rowInfo.id })
      if (res.data) {
        this.dataSource = res.data
      }
    },
    onHandleClose() {
      // 关闭弹窗
      this.$emit("onClose")
    },
    onCheck(row) {
      this.$confirm('Are you sure?', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'OK',
        type: 'warning'
      }).then(() => {
        this.loading = true
        // remove shipper booking
        removeShipperBooking({
          bookingNumber: this.rowInfo.bookingNumber,
          soRef: row.soRef
        }).then(async res => {
          if (res.data) {
            this.$message.success("Success")
            // 删除后刷新列表
            await this.getList()
            this.$emit('successCallback')
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  justify-content: center;
}
</style>
