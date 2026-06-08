<template>
  <el-dialog title="Confirm Remove PO" :visible.sync="dialogVisible" width="80%">
    <!-- el-descriptions 展示shipping order 信息 -->
    <el-descriptions :column="3" size="mini" border>
      <!-- <el-descriptions-item label="Request Type">{{ approvalInfo.type }}</el-descriptions-item> -->
      <el-descriptions-item label="Shipping Order Number">{{ approvalInfo.soRef }}</el-descriptions-item>
      <el-descriptions-item label="Shipment Type">{{ approvalInfo.shipmentType }}</el-descriptions-item>
      <el-descriptions-item label="POL">{{ approvalInfo.pol }}</el-descriptions-item>
      <el-descriptions-item label="Shipment Ref">{{ approvalInfo.shipmentRef }}</el-descriptions-item>
      <el-descriptions-item label="Request User">{{ approvalInfo.initiator }}</el-descriptions-item>
      <el-descriptions-item label="Request Time">{{ parseTime(approvalInfo.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="Remark">
        <div v-html="approvalInfo.records?.[0]?.remark"></div>
      </el-descriptions-item>
    </el-descriptions>
    <!-- <el-descriptions :column="1" size="mini" border>
      <el-descriptions-item label="Remark">
        <div v-html="approvalInfo.records[0]?.remark"></div>
      </el-descriptions-item>
    </el-descriptions>-->

    <el-divider></el-divider>

    <el-form :model="form">
      <el-table :data="filteredOrders" style="margin-top: 20px" :row-key="row => row.id" ref="orderTable">
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
        <el-table-column label="Remove" min-width="60" align="center">
          <template v-slot="{row}">
            <el-tag v-if="row.selected" type="danger">Yes</el-tag>
            <el-tag v-else type="success">No</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;margin-bottom: 10px;">
        <h3 style="font-weight: bold;">Order Numbers(Request to reomove):</h3>
        <div v-if="selectedOrders.length">
          <el-tag v-for="order in selectedOrders" :key="order.id" style="margin-right: 5px">{{ order.orderNumber }}</el-tag>
        </div>
        <div v-else>No orders selected</div>
      </div>
      <WEditor :value.sync="form.remark" height="180px" placeholder="comments..." />
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button v-hasPermi="['pepco:shipping-order:remove-po:approval']" v-loading="submitLoading" type="danger" size="mini" @click="submit(3)">Reject</el-button>
      <el-button v-hasPermi="['pepco:shipping-order:remove-po:approval']" v-loading="submitLoading" type="primary" size="mini" @click="submit(2)">Accept</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { shippingApprovalDetail, processRemovePoApproval } from '@/api/pepco/shipping-approval'
import WEditor from '@/components/wang-editor'

export default {
  name: 'RemovePoProcessDialog',
  components: { WEditor },
  data() {
    return {
      dialogVisible: false,
      submitLoading: false,
      approvalInfo: {},
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
    openDialog(approvalInfoId) {
      this.dialogVisible = true
      shippingApprovalDetail(approvalInfoId).then(res => {
        this.approvalInfo = res.data
        this.orders = JSON.parse(this.approvalInfo.originalData)
        console.log('orders', this.orders)
        this.selectedOrders = JSON.parse(this.approvalInfo.newData)
        this.orders.forEach(order => {
          order.selected = false
          if (this.selectedOrders.find(selected => selected.id === order.id)) {
            order.selected = true
          }
        })
        this.filteredOrders = this.orders
        console.log('filteredOrders', this.filteredOrders)
      })
    },
    submit(status) {
      console.log('remark', this.form.remark)
      // confim确认框
      this.$modal
        .confirm('Confirm to submit?')
        .then(() => {
          console.log('Selected Orders:', this.selectedOrders)
          console.log('Remark:', this.form.remark)
          this.submitLoading = true
          const command = {
            approvalId: this.approvalInfo.id,
            remark: this.form.remark,
            status: status,
            orderHeaders: this.selectedOrders
          }
          processRemovePoApproval(command)
            .then(res => {
              console.log(res)
              this.$message.success('Shipping approval Audit successfully')
              this.$emit('success', res.data)
              this.submitLoading = false
              this.dialogVisible = false
            })
            .catch(err => {
              console.error(err)
              this.submitLoading = false
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
