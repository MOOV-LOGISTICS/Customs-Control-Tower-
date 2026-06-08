<template>
  <el-dialog title="Remove PO" width="60%" :visible="visible" @close="onHandleClose">
    <el-table row-key="id" v-loading="loading" :data="dataSource" border stripe>
      <el-table-column label="Order Number" prop="orderNumber" width="130px"></el-table-column>
      <el-table-column label="Shipping POL" prop="shippingPol" width="100px"></el-table-column>
      <el-table-column label="Shipping POD" prop="shippingPod" width="100px"></el-table-column>
      <el-table-column label="DC" prop="dc" width="100px"></el-table-column>
      <el-table-column label="Task Status" prop="taskStatus"></el-table-column>
      <el-table-column label="SO Ref" prop="soRef"></el-table-column>
      <el-table-column label="Action" width="80px">
        <div class="icon-wrapper" slot-scope="scope">
          <el-button type="danger" circle icon="el-icon-check" @click="onCheck(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import {getPOsByShippingId, removePO} from "@/api/dataMaintenance/dataMaintenance";

export default {
  name: "shippingRemovePO",
  props: ['visible', 'rowInfo', 'onClose', 'successCallback'],
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
      // 根据shippingId获取po
      const res = await getPOsByShippingId({ shippingId: this.rowInfo.id })
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
        // remove po
        removePO({
          orderNumber: row.orderNumber,
          soRef: this.rowInfo.soRef
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
