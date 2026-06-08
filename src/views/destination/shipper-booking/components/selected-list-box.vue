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
          <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseUTCTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseUTCTime(scope.row.cargoReadyDate) }}</template>
        </el-table-column>
        <el-table-column prop="mustArriveBy" label="DC Date">
          <template v-slot="scope">{{ parseUTCTime(scope.row.deliveryDate) }}</template>
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
      if (this.rows.length === 0) {
        this.$message({
          message: 'Please select at least one order',
          type: 'warning'
        })
        return
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