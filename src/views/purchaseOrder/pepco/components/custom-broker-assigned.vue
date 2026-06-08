<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <el-dialog :visible.sync="localVisible" title="Custom Broker Assigned" width="80%" @close="handleDialogClose">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="padding-bottom: 20px;">
          <el-button style="float: right;" type="primary" @click="handleShipmentClick">Add/Remove Shipping Order</el-button>
        </div>
        <div>
          <div v-for="(shipment, index) in data" :key="index" class="shipment-section">
            <el-card class="box-card">
              <h4 style="color: blue;padding-left: 10px; padding-top: 10px;padding-bottom: 10px;">Shipment Number: {{ shipment.shippingNumber }}</h4>
              <el-table :data="shipment.poList" :row-class-name="tableRowClassName" :header-cell-class-name="headerCellStyle" border style="width: 100%">
                <el-table-column prop="orderNumber" label="Order Number" width="180" align="center"></el-table-column>
                <el-table-column prop="pol" label="Port Name" width="180" align="center"></el-table-column>
                <el-table-column prop="deliveryDate" label="DC Date" width="180" align="center">
                  <template #default="scope">{{ scope.row.deliveryDate }}</template>
                </el-table-column>
                <el-table-column prop="planCrdDate" label="PLAN CRD" width="180" align="center">
                  <template #default="scope">{{ scope.row.planCrdDate }}</template>
                </el-table-column>
                <el-table-column prop="cargoHandoverDate" label="HOD" width="180" align="center">
                  <template #default="scope">{{ scope.row.cargoHandoverDate }}</template>
                </el-table-column>
                <el-table-column prop="orderCbm" label="Order Cube" width="180" align="center"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="24">
          <el-col align="right" :span="12">
            <!--            <span> broker </span>-->
            <el-select v-model="broker" placeholder="select broker">
              <el-option v-for="item in brokers" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col align="right" :span="12">
            <el-button type="warning" @click="handleCancel">Cancel</el-button>
            <el-button type="primary" :loading="submitLoading" @click="handleConfirm">Submit</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <shipment-dialog ref="shipmentDialog" @submit="refresh" />
  </div>
</template>

<script>
import { getBookingScoreData, getCustomsBrokerAssignedData, getCustomsBrokerData, saveCustomsBrokerAssigned } from '@/api/pepco/shipping-order'
import shipmentDialog from './shipment-broker-dialog.vue'
export default {
  name: 'CustomBrokerAssigned',
  components: { shipmentDialog },
  props: {
    receivedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      submitLoading: false,
      orderNumberList: [],
      broker: '',
      localVisible: false, // 控制弹窗显示的状态
      documentList: [], // 存储文件列表
      disabled: false, // 控制复选框的状态
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      data: [],
      queryData: {
        orderHeaderId: '',
        shipmentId: []
      },
      shipmentInfo: {},
      brokers: []
    }
  },

  methods: {
    openDialog(rows) {
      this.data = []
      //this.queryData = rows
      this.queryData.orderHeaderId = rows.orderId
      this.localVisible = true
      this.getCustomsBrokerAssignedData()
    },

    getCustomsBrokerAssignedData() {
      getCustomsBrokerAssignedData(this.queryData).then(response => {
        this.data = response.data
        this.shipmentInfo = response.data[0]
        this.brokers = response.data[0].brokers
      })
    },
    handleConfirm() {
      if (this.broker === null || this.broker === '') {
        this.$notify({
          message: 'please select a broker',
          type: 'warning'
        })
        return
      }
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          this.submitLoading = true
          saveCustomsBrokerAssigned(this.data, this.broker).then(response => {
            this.$message({
              type: 'success',
              message: 'Submit Success'
            })
          })
          this.data = []
          this.broker = ''
          this.submitLoading = false
          this.localVisible = false
          this.$emit('refresh')
        })
        .catch(() => {
          this.broker = ''
          this.submitLoading = false
        })
    },
    handleClose() {
      this.RefuseDialog = false
      this.refuseContent = ''
    },
    handleCancel() {
      this.data = []
      this.broker = ''
      this.localVisible = false
    },
    handleShipmentClick() {
      console.log('handleShipmentClick', this.shipmentInfo)
      this.$refs.shipmentDialog.openDialog(this.shipmentInfo)
    },
    async refresh(rows) {
      this.queryData.orderHeaderId = ''
      this.queryData.shipmentId = rows.map(item => item.id)
      this.data = []
      await getBookingScoreData(this.queryData).then(response => {
        this.data = this.data.concat(response.data)
        //重新加载broker
        let orderNumbers = []
        this.data.forEach(function (element1) {
          // 遍历数组，对每个元素进行操作
          element1.poList.forEach(function (element2) {
            orderNumbers.push(element2.orderNumber)
          })
        })
        this.orderNumberList = this.orderNumberList.concat(orderNumbers)
        this.orderNumberList = Array.from(new Set(this.orderNumberList))
        console.log('去重后的this.orderNumberList')
        console.log(this.orderNumberList)
        //获取所有的order_number所对应的broker
        getCustomsBrokerData(this.orderNumberList).then(response => {
          this.brokers = response.data.brokers
        })
      })
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row'
      } else {
        return 'dan-row'
      }
    },
    headerCellStyle({ column, columnIndex }) {
      if (columnIndex === 0) {
        return 'hiddenCheck'
      }
    },
    handleDialogClose() {
      this.data = []
      this.shipmentInfo = {}
      this.localVisible = false
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
.shipment-section {
  margin-bottom: 20px;
}
</style>
