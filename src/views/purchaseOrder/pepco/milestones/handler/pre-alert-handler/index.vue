<template>
  <el-dialog v-loading="dialogLoading" :visible.sync="dialogVisible" title="Pre Alert" width="85%">
    <el-descriptions title="Shipment Info" :colon="false" style="border: none;padding: 15px!important;background: #fff;" :column="4">
      <el-descriptions-item label="Carrier Booking Ref">{{ shipment.bookingNumber }}</el-descriptions-item>
      <el-descriptions-item label="Carrier Booking Number">{{ shipment.shipmentBookingNumber }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.carrier')">{{ shipment.carrier }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.contractNumber')">{{ shipment.contractNumber }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.placeOfReceipt')">{{ shipment.pol }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.portOfLoading')">{{ shipment.originPort }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.portOfDischarge')">{{ shipment.destinationPort }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.finalDestination')">{{ shipment.pod }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.carriageContract')">{{ shipment.contractType }}</el-descriptions-item>
      <el-descriptions-item :label="$t('booking.payment_term')">{{ shipment.paymentTerm }}</el-descriptions-item>
      <el-descriptions-item label="ETD">{{ parseTime(shipment.etd) }}</el-descriptions-item>
      <el-descriptions-item label="ETA">{{ parseTime(shipment.eta) }}</el-descriptions-item>
      <el-descriptions-item :label="$constants.MBL_NUMBER">
        <span v-if="mblFile?.documentNumber">{{ mblFile?.documentNumber }}</span>
        <el-tag v-else type="danger">Undone</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="BL Type">{{ mblFile?.blType }}</el-descriptions-item>
    </el-descriptions>

    <el-card style="margin-top: 20px;">
      <el-table :data="shippingOrders">
        <el-table-column prop="soRef" label="Shipper Booking Number" min-width="140px" align="center" />
        <el-table-column prop="shipmentType" label="Shipment Type" min-width="120px" align="center" />
        <el-table-column prop="hblNumber" label="HBL Number" min-width="140px" align="center">
          <template #default="scope">
            <span v-if="scope.row.hblNumber">{{ scope.row.hblNumber }}</span>
            <el-tag v-else type="danger">Undone</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blType" label="BL Type" min-width="100px" align="center" />
        <el-table-column prop="totalCbm" label="CBM" min-width="100px" align="center" />
        <el-table-column prop="totalQty" label="Packages" min-width="100px" align="center" />
        <el-table-column prop="totalWeight" label="Gross Weight" min-width="100px" align="center" />
        <el-table-column label="CLR Status" min-width="100px" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.clrStatus == 'Undone'" type="danger">Undone</el-tag>
            <el-tag v-else-if="scope.row.clrStatus == 'Padding'" type="danger">Padding</el-tag>
            <el-tag v-else-if="scope.row.clrStatus == 'Done'" type="success">Done</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="clpTasks">
        <el-table-column prop="orderNumber" label="Order Number" min-width="130px" align="center" />
        <el-table-column prop="taskName" label="Task Name" min-width="130px" align="center" />
        <el-table-column prop="supplierCode" label="Supplier Code" min-width="130px" align="center" />
        <el-table-column prop="soRef" label="Shipper Booking Number" min-width="140px" align="center" />
        <el-table-column prop="containerNo" label="Container No" min-width="130px" align="center" />
        <el-table-column prop="containerType" label="Container Type" min-width="130px" align="center" />
        <el-table-column prop="finishedTime" label="Finished Time" align="center">
          <template #default="scope">
            <span>{{ formatUserLocalTime(scope.row.finishedTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Task Status" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="info">Pending</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="warning">In Progress</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">Completed</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="clrStatus" label="CLR Status" width="130px" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.clrStatus == ''" type="info">Pending</el-tag>
            <el-tag v-else-if="scope.row.clrStatus =='Undone'" type="danger">Undone</el-tag>
            <el-tag v-else-if="scope.row.clrStatus == 'Done'" type="success">Done</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <upload-file ref="uploadFileRef" @reload="fetchDetail" />

    <el-card style="margin-top: 20px;">
      <el-form :model="submitForm" size="mini">
        <el-form-item v-if="isAdd" required label="Pre Alert" label-width="180px">
          <el-date-picker :disabled="isDisable" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="submitForm.preAlertDate" type="date" placeholder="Pre Alert"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="isAdd" @click="dialogVisible = false">Cancel</el-button>
      <el-button v-if="isAdd" type="primary" :disabled="isLoading" :loading="isLoading" @click="submitPreAlertTask">Submit</el-button>
    </div>
  </el-dialog>
</template>
  
  <script>
import { updatePreAlertTask } from '@/api/order/task'
import { preAlertDetail } from '@/api/pepco/milestone'
import UploadFile from './components/upload-file.vue'

export default {
  name: 'PreAlertHandler',
  components: { UploadFile },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      dialogLoading: false,
      shipment: {},
      mblFile: {},
      shippingOrders: [],
      shipmentItems: [],
      clpTasks: [],
      shipmentClpList: [],
      shipmentClpDetailList: [],
      task: {},
      taskList: [], // 存储任务列表
      orderNumbers: [], // 存储订单号列表
      shippingNumbers: [],
      bookingNumber: null,
      submitForm: {
        preAlertDate: null
      },
      isEdit: false,
      checkedList: [],
      isDisable: false,
      isAdd: false,
      isLoading: false
    }
  },

  methods: {
    async openDialog(task, activeTask, currentSeq, isAdd) {
      this.isLoading = false
      this.task = task
      this.isAdd = isAdd
      this.dialogVisible = true
      this.fetchDetail()
      this.isEdit = true

      // 修改 只要pre alert做完后，都可以编辑
      // this.isEdit = this.task.status == 2
      this.submitForm.preAlertDate = this.task.jsonData ? JSON.parse(this.task.jsonData).preAlertDate : null
      if (!this.isEdit) {
        // this.submitForm.preAlertDate = this.task.jsonData ? JSON.parse(this.task.jsonData).preAlertDate : null
        this.isDisable = true
      }
    },
    fetchDetail() {
      this.dialogLoading = true
      preAlertDetail(this.task.orderNumber).then(res => {
        console.log('preAlertDetail', res)
        const { shipment, mbl, shippingOrders, shipmentItems, clpTasks, shipmentClpList, shipmentClpDetailList } = res.data
        this.shipment = Object.assign({}, shipment)
        this.mblFile = Object.assign({}, mbl)
        shippingOrders.forEach(shipping => {
          if (shipmentClpList && shipmentClpList.length > 0) {
            const tmpClp = shipmentClpList.find(cpl => cpl.soNumbers.includes(shipping.soRef))
            shipping.clrStatus = tmpClp ? tmpClp.status : 'Undone'
            shipping.totalCbm = tmpClp ? tmpClp.totalCbm : '/'
            shipping.totalQty = tmpClp ? tmpClp.totalQty : '/'
            shipping.totalWeight = tmpClp ? tmpClp.totalWeight : '/'
          }
        })
        this.shippingOrders = [...shippingOrders]

        clpTasks.forEach(ele => {
          const tmpDetails = shipmentClpDetailList?.filter(clpDetail => clpDetail.orderNumber == ele.orderNumber)
          if (tmpDetails && tmpDetails.length > 0) {
            ele.containerNo = tmpDetails.map(detail => detail.containerNo).join(', ')
            ele.containerType = tmpDetails[0].containerType
          }
          ele.clrStatus = ele.containerNo ? 'Done' : 'Undone'
          ele.containerNo = ele.containerNo || '/'
          ele.containerType = ele.containerType || '/'
        })
        this.clpTasks = [...clpTasks]

        this.shipmentItems = shipmentItems || []
        this.shipmentClpList = shipmentClpList || []
        this.shipmentClpDetailList = shipmentClpDetailList || []

        this.$nextTick(() => {
          this.$refs.uploadFileRef.initComponent(this.task, this.shipment.id, this.isEdit, this.shipmentClpDetailList)
        })
        this.dialogLoading = false
      })
    },
    submitPreAlertTask() {
      if (this.submitForm.preAlertDate == null) {
        this.$message.error('Please select a pre-alert date')
        return
      }

      if (this.mblFile?.documentNumber == null || this.mblFile?.documentNumber == '') {
        this.$message.error('Please Upload MBL File')
        return
      }
      let undone = false
      let clrUnone = false
      this.shippingOrders.forEach(so => {
        if (so.hblNumber == null || so.hblNumber == '') {
          undone = true
        }
        if (so.clrStatus == 'Undone' || so.clrStatus == 'Padding') {
          clrUnone = true
        }
      })
      if (undone) {
        this.$message.error('Please ensure all HBL are uploaded')
        return
      }
      if (clrUnone) {
        this.$message.error('Please ensure all CLR are done')
        return
      }
      this.clpTasks.forEach(clp => {
        if (clp.clrStatus == 'Undone' || clp.clrStatus == 'Padding') {
          clrUnone = true
        }
      })
      if (clrUnone) {
        this.$message.error('Please ensure all Order CLR are done')
        return
      }

      this.submitForm.shipmentId = this.shipment.id
      this.submitForm.soId = this.task.shippingId
      this.task.jsonData = JSON.stringify(this.submitForm)
      console.log('this.task', this.task)
      this.isLoading = true
      updatePreAlertTask(this.task)
        .then(res => {
          if (res.code == 0) {
            this.$emit('refresh')
            this.dialogVisible = false
          }
        })
        .catch(err => {
          console.error('fail:', err)
        })
        .finally(() => {
          this.isLoading = false
        })
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
.el-col {
  padding-top: 10px;
}
</style>
  