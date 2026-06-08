<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <el-dialog :visible.sync="localVisible" title="Pepco Booking Score" width="80%">
      <el-card class="box-card">
        <!-- <el-row :gutter="24">
          <el-col :span="6" style="font-size: 24px; font-weight: bold;">Dimensions(Per Outer Packing)</el-col>
        </el-row>-->
        <el-divider></el-divider>
        <el-row>
          <el-col :spn="24">
            <span style="font-size: 16px; font-weight: bold;">Order Number:</span>
            <span style=" font-weight: bold; padding: 0 5px">{{ task.orderNumber }}</span>
          </el-col>
        </el-row>
        <el-table :data="bookingScore" fit>
          <el-table-column label="Order Number" align="center" prop="orderNumber" min-width="120"></el-table-column>
          <el-table-column label="Shipper Booking Number" align="center" min-width="140px" prop="soRef" />
          <el-table-column label="Pending Booking Status" align="center" min-width="140px" prop="status">
            <template #default="scope">{{ getStatusLabel(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column label="Origin Port(PO)" align="center" min-width="120" prop="pol" />
          <el-table-column label="DC Date(PO)" align="center" prop="deliveryDate" min-width="80"></el-table-column>
          <el-table-column label="Plan CRD(PO)" align="center" min-width="120" prop="planCrdDate"></el-table-column>
          <el-table-column label="HOD(PO)" align="center" prop="cargoHandoverDate" min-width="80">
            <template #default="scope">{{ scope.row.cargoHandoverDate }}</template>
          </el-table-column>
          <el-table-column label="ETD(Pre Assign)" align="center" min-width="100px" prop="etd"></el-table-column>
          <el-table-column label="ETA(Pre Assign)" align="center" min-width="100px" prop="eta"></el-table-column>
          <el-table-column label="Order Cube" align="center" prop="orderCbm" min-width="80"></el-table-column>
          <el-table-column prop="itemNumber" label="PLU" min-width="120" align="center"></el-table-column>
          <el-table-column prop="merchCode" label="Merch Code" min-width="100" align="center"></el-table-column>
          <el-table-column prop="promoCode" label="Promo Code" min-width="100" align="center">
            <template #default="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.promoCode" placement="top">
                <span class="text-overflow">{{ scope.row.promoCode }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="incoterm" label="Incoterm" min-width="100" align="center"></el-table-column>
          <el-table-column prop="namedPlace" label="Named Place" min-width="150" align="center"></el-table-column>
          <el-table-column prop="mode" label="Transport Mode" min-width="100" align="center"></el-table-column>
          <!-- <el-table-column label="Status" min-width="100" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{ scope.row.status === '0' ? 'Open' : 'Close' }}</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column label="Order Score" align="center" prop="orderScore" min-width="80"></el-table-column>
          <el-table-column label="Shipment Score" align="center" prop="shipmentScore" min-width="120"></el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { updateTask } from '@/api/order/task'
import { getBookingScorePage } from '@/api/pepco/shipping-order'
export default {
  name: 'BookingScoreView',
  data() {
    return {
      localVisible: false, // 控制弹窗显示的状态
      documentList: [], // 存储文件列表
      disabled: false, // 控制复选框的状态
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      taskId: '',
      task: {},
      bookingScore: [],
      shippingStatus: [
        { label: 'MOOV-OHA Pending', value: '0' },
        { label: 'MOOV-OHA Accepted', value: '1' },
        { label: 'MOOV-OHA Rejected', value: '2' },
        { label: 'SAApproved', value: '4' },
        { label: 'Awaiting Approval', value: '5' },
        { label: 'Pepco Pending', value: '6' },
        { label: 'Pepco Rejected', value: '7' }
      ]
    }
  },

  methods: {
    async openDialog(rows) {
      console.log('Received rows1111:', rows)
      console.log('Received rows:', rows.orderId)
      this.getBookingScore(rows.orderId)
      this.task = rows

      this.localVisible = true
    },
    getBookingScore(orderId) {
      getBookingScorePage({ orderHeaderId: orderId }).then(response => {
        if (response.code !== 0) {
          this.$message.error('Failed to fetch booking score data')
          return
        }
        this.bookingScore = response.data.list
        console.log('this.bookingScore', this.bookingScore)
      })
    },
    handleConfirm() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          var data = {
            approveResult: 'Pass'
          }
          console.log('this.task', this.task)
          this.task.jsonData = JSON.stringify(data)
          updateTask(this.task).then(res => {
            console.log('res', res)
            this.$notify({
              title: 'Success',
              message: 'Success',
              type: 'success'
            })
          })
          this.localVisible = false
        })
        .catch(() => {})
      this.$emit('update-list', 'success')
    },
    handleClose() {
      this.RefuseDialog = false
      this.refuseContent = ''
    },
    handleCancel() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('Please provide a reason.', 'Tips', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          })
            .then(({ value }) => {
              var data = {
                approveResult: 'Failed',
                reason: value
              }
              console.log(this.task)
              this.task.jsonData = JSON.stringify(data)
              console.log(this.task)
              updateTask(this.task).then(res => {
                this.$notify({
                  title: 'Success',
                  message: 'Success',
                  type: 'success'
                })
                this.localVisible = false
                this.$emit('update-list', 'refuse success')
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    getStatusLabel(status) {
      const statusObj = this.shippingStatus.find(item => item.value === status)
      return statusObj ? statusObj.label : ''
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
.icon-large {
  font-size: 30px; /* 方案1: 直接设置字体大小 */
  /* transform: scale(1.5);  方案2: 使用缩放 */
  cursor: pointer;
}
.tools-but {
  text-align: right;
}
.card-item {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.custom-layout {
  display: flex;
  align-items: center;
}

.checkbox-left {
  margin-right: 10px;
}

.po-number-left {
  padding-left: 5px;
  white-space: nowrap;
}

/* 覆盖 el-descriptions 默认样式 */
::v-deep(.el-descriptions-item__content) {
  display: flex;
  align-items: center;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
}
</style>