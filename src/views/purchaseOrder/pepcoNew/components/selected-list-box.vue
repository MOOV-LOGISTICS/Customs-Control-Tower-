<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <!-- <div style="float: right;position: relative;"> -->
    <el-badge v-hasPermi="['pepcoShipping:order:create']" :hidden="rows.length===0" :value="rows.length">
      <el-button type="primary" @click="handleClick">Create Shipper Booking</el-button>
    </el-badge>
    <!-- </div> -->

    <el-dialog title="Order List" :visible.sync="dialogVisible" width="50%">
      <el-table :data="rows" style="width: 100%;line-height: 0px;">
        <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
        <el-table-column prop="cargoReadyDate" label="Cargo Ready Date">
          <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseTime(scope.row.cargoReadyDate) }}</template>
        </el-table-column>
        <el-table-column prop="mustArriveBy" label="DC Date">
          <template v-slot="scope">{{ parseTime(scope.row.deliveryDate) }}</template>
        </el-table-column>
        <el-table-column prop="dc" label="DC Code">
          <template v-slot="scope">{{ scope.row.dc }}</template>
        </el-table-column>
        <el-table-column label="Action" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="removeRow(scope.$index)">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCreate">Submit</el-button>
        <el-button @click="dialogVisible = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isMixDcBookingEnabled, isSameDcForSupplierBooking } from '@/utils/shippingOrderConfig'

export default {
  name: 'SelectedListBox',
  data() {
    return {
      dialogVisible: false,
      rows: []
    }
  },
  methods: {
    refresh(selection, row) {
      selection.includes(row) ? this.rows.push(row) : (this.rows = this.rows.filter(item => item.id !== row.id))
    },
    removeRow(index) {
      const row = this.rows[index]
      this.rows.splice(index, 1)
      this.$emit('remove-row', row)
    },
    handleClick() {
      for (var rowOne of this.rows) {
        if (rowOne.status == '2') {
          this.$modal.msgWarning('Order Number:' + rowOne.orderNumber + ' Status: Hold');
          return
        }
        if (rowOne.status == '1') {
          this.$modal.msgWarning('Order Number:' + rowOne.orderNumber + ' Status: Cancelled');
          return
        }
      }

      if (this.rows.length === 0) {
        this.$message({
          message: 'Please select at least one order',
          type: 'warning'
        })
        return
      } else if (this.rows.length > 1) {
        // 获取所有选中订单的 originPort 值并去重
        const originPorts = [...new Set(this.rows.map(row => row.originPort))]
        // const hasDuplicates = originPorts.length < this.rows.length
        const allValid = this.rows.every(row => row.originPort !== null && row.originPort !== undefined)
        // 如果去重后只有一个 originPort，说明所有订单的 originPort 都相同
        if (originPorts.length > 1 && allValid) {
                    // 2026-05-26 mark
          // 增加，限制必须pol一致，如果不一致弹出error
          this.$message({
            message: 'The selected PO have different POL,Please select the same POL',
            type: 'error'
          })
          return
          // this.$confirm('The selected PO have different POL. Do you want to continue?', 'Warning', {
          //   confirmButtonText: 'Confirm',
          //   cancelButtonText: 'Cancel',
          //   type: 'warning'
          // }).then(() => {
          //   // 用户点击确认后显示对话框
          //   this.dialogVisible = true
          // }).catch(() => {
          //   // 用户点击取消，不执行任何操作
          //   this.$message({
          //     type: 'info',
          //     message: 'Submission cancelled'
          //   })
          // })
          // return
        }
      }
      this.dialogVisible = true
    },
    handleCreate() {
      if (this.rows.length === 0) {
        this.$message({
          message: 'Please select at least one order',
          type: 'warning'
        })
        return
      }
      if (!isMixDcBookingEnabled(this.getDictDatas)) {
        const dcList = this.rows.map(row => row.dc)
        if (!isSameDcForSupplierBooking(dcList)) {
          this.$message({
            message: 'Please select orders with the same DC',
            type: 'warning'
          })
          return
        }
      }
      // this.rows.forEach(row => {
      //   if (!row.cargoReadyDate) {
      //     this.$message({
      //       message: `Order ${row.orderNumber} does not have a cargo ready date`,
      //       type: 'warning'
      //     })
      //     return
      //   }
      // })
      // Ethan: 暂存在Localstorage中
      localStorage.setItem('shipping-selectedPoList', JSON.stringify(this.rows))
      this.$router.push({ path: '/shipment/ppCreateShippingOrder', query: {} })
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  ::deep th {
    height: 10px;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
