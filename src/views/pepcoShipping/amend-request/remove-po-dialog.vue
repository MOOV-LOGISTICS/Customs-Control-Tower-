<template>
  <el-dialog title="Remove PO Request" :visible.sync="dialogVisible" width="80%">
    <el-form :model="form">
      <el-row>
        <el-col :span="6">
          <el-input v-model="orderNumber" placeholder="Order Number" clearable @input="filterOrders" />
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="filteredOrders" style="margin-top: 20px" height="250" @select="handleSelectionChange" :row-key="row => row.id" ref="orderTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderNumber" label="Order Number" min-width="100" align="center"></el-table-column>
        <el-table-column prop="dc" label="DC Code" min-width="60" align="center"></el-table-column>
        <el-table-column label="IN-DC Date" min-with="80" align="center">
          <template v-slot="{row}">{{ parseTime(row.deliveryDate) }}</template>
        </el-table-column>
        <el-table-column label="Planned/Supplier(CRD)" min-width="160" align="center">
          <template v-slot="{row}">{{ parseTime(row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000)}} / {{ parseTime(row.cargoReadyDate)}}</template>
        </el-table-column>
        <el-table-column label="Target ETA" min-width="160" align="center">
          <template v-slot="{row}">{{ parseTime(row.deliveryDate - (21 * 24 * 60 * 60 * 1000)) + ` to ` + parseTime(row.deliveryDate - (14 * 24 * 60 * 60 * 1000))}}</template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;margin-bottom: 10px;">
        <h3 style="font-weight: bold;">Selected Order Numbers:</h3>
        <div v-if="selectedOrders.length">
          <el-tag v-for="order in selectedOrders" :key="order.id" style="margin-right: 5px">{{ order.orderNumber }}</el-tag>
        </div>
        <div v-else>No orders selected</div>
      </div>
      <WEditor :value.sync="form.remark" height="180px" placeholder="comments..." />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button v-if="showSubmit" type="primary" @click="submit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>
import WEditor from '@/components/wang-editor'
import { shippingApprovalPage, createShippingApproval, orderListByShipping } from '@/api/pepco/shipping-approval'
// import { parseTime as parseDateTime } from '@/utils/ruoyi'

export default {
  name: 'RemovePoDialog',
  components: { WEditor },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      showSubmit: true,
      shippingOrder: {},
      orderNumber: '',
      orders: [],
      filteredOrders: [],
      selectedOrders: [],
      form: {
        remark: ''
      }
    }
  },
  created() {
    this.filteredOrders = this.orders
  },
  methods: {
    openDialog(shppingOrder) {
      this.orders = []
      this.filteredOrders = []
      this.selectedOrders = []
      this.form.remark = ''
      this.shippingOrder = shppingOrder
      this.dialogVisible = true
      this.showSubmit = true
      this.loading = true
      const params = {
        soId: shppingOrder.id,
        status: 0
      }
      shippingApprovalPage(params).then(res => {
        if (res.data && res.data.list.length > 0) {
          this.$message.warning('There is already a pending approval for this shipping order.')
          this.showSubmit = false
        }
        this.getOrderList()
      })
    },
    getOrderList() {
      orderListByShipping(this.shippingOrder.id).then(res => {
        this.orders = res.data
        if (this.orders.length <= 1) {
          this.$message.warning('There is only one order and it cannot be removed.')
          this.showSubmit = false
        }
        this.filteredOrders = this.orders
        this.loading = false
      })
    },
    filterOrders() {
      this.filteredOrders = this.orders.filter(order => order.orderNumber.toLowerCase().includes(this.orderNumber.trim().toLowerCase()))
    },
    handleSelectionChange(selections, row) {
      console.log('Selected Orders:', selections, row, selections.includes(row))
      if (selections.includes(row)) {
        if (!this.selectedOrders.some(item => item.id === row.id)) {
          this.selectedOrders.push(row)
        }
      } else {
        this.selectedOrders = this.selectedOrders.filter(item => item.id !== row.id)
      }
    },
    submit() {
      console.log('Selected Orders:', this.selectedOrders)
      console.log('Remark:', this.form.remark)
      if (!this.selectedOrders.length) {
        this.$message.warning('Please select at least one order')
        return
      }
      this.$modal
        .confirm('Confirm to submit?')
        .then(() => {
          const command = {
            type: 'Remove PO',
            soId: this.shippingOrder.id,
            originalData: JSON.stringify(this.orders),
            newData: JSON.stringify(this.selectedOrders),
            remark: this.form.remark
          }
          createShippingApproval(command).then(res => {
            console.log(res)
            this.$message.success('Successfully submitted the application.')
            this.dialogVisible = false
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>