<template>
  <el-dialog v-loading="dialogLoading" :visible.sync="dialogVisible" title="Verify Documents" width="90%">
    <!-- 动态高度，超出显示滚动条 -->
    <el-scrollbar style="height: calc(100vh - 250px);">
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

      <el-divider content-position="left">Shipping Orders</el-divider>
      <el-card style="margin-top: 20px;">
        <!-- <div slot="header" class="clearfix">
          <span style="font-size: 16px;font-weight: bold;">Shipping Orders</span>
        </div>-->
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

      <el-divider content-position="left">CLR</el-divider>
      <el-card style="margin-bottom: 20px;">
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

      <el-divider content-position="left">Order Details</el-divider>
      <order-detail ref="orderDetail" style="margin-bottom: 20px;"></order-detail>

      <el-divider content-position="left" style="font-weight: bold;">Documents</el-divider>
      <el-card style="margin-top: 20px;">
        <!-- Table -->
        <el-table :data="orderFiles" v-loading="tableLoading">
          <el-table-column prop="documentNumber" label="Document Number" min-width="200px" align="center">
            <template #default="scope">
              <div v-if="!scope.row.editable">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">{{ scope.row.documentNumber }}</span>
                <el-button v-if="isEdit" icon="el-icon-edit" type="text" size="mini" @click="scope.row.editable=true" style="margin-left: 5px; flex-shrink: 0;"></el-button>
              </div>
              <div v-else style="display: flex; align-items: center; justify-content: center;">
                <el-input v-model="scope.row.documentNumber" size="mini" style="width: 120px; margin-right: 5px;"></el-input>
                <el-button type="primary" size="mini" @click="handleEditSubmit(scope.row)">Confirm</el-button>
                <!-- 添加取消按钮 -->
                <el-button size="mini" @click="scope.row.editable=false" style="margin-left: 5px;">Cancel</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
          <el-table-column prop="typeCode" label="Document Type" align="center">
            <template #default="scope">
              <span>{{ typeCodes.find(type => type.value === scope.row.typeCode)?.label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
          <el-table-column label="Action" width="150px" align="center">
            <template #default="scope">
              <template v-if="scope.row.typeCode !== '15'">
                <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
                <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>

    <div v-if="isEdit" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="confirmDialogVisible=true">Comfirm</el-button>
    </div>

    <!-- 确认对话框 -->
    <el-dialog v-loading="dialogLoading" title="Verify Comfirm" :visible.sync="confirmDialogVisible" width="40%" append-to-body>
      <el-form ref="confirmForm" :model="confirmForm" label-width="120px">
        <el-form-item label="Approval Result">
          <el-radio-group v-model="confirmForm.approveResult">
            <el-radio label="Pass">Pass</el-radio>
            <el-radio label="Failed">Reject</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input v-model="confirmForm.reason" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { preAlertDetail } from '@/api/pepco/milestone'
import { updateTask } from '@/api/order/task'
import { getSameOrderTask } from '@/api/pepco/shipping-order'
import { orderFileList, updateDocumentNumberById } from '@/api/pepco/order-file'
import OrderDetail from '@/views/pepcoShipping/commponents/order-detail.vue'

export default {
  name: 'VerifyDocumentPreAlerHandler',
  components: { OrderDetail },
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
      isEdit: false,
      isLoading: false,
      orderHeadersWithItems: [],
      typeCodes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Inspection Status', value: '07' },
        { label: 'CLP', value: '08' },
        { label: 'ICS2', value: '11' },
        { label: 'Manifest', value: '12' },
        { label: 'Shipper Booking Others', value: '13' },
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'Shipping Documents By Email', value: '15' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'No Need Upload Document', value: '18' }
      ],
      taskList: [],
      orderFiles: [],
      tableLoading: false,
      confirmDialogVisible: false,
      confirmForm: {
        approveResult: 'Pass',
        reason: ''
      }
    }
  },

  methods: {
    async openDialog(task, isEdit) {
      this.dialogVisible = true
      this.isEdit = isEdit
      this.isLoading = false
      this.task = task
      this.confirmForm = {
        approveResult: 'Pass',
        reason: ''
      }
      this.fetchDetail()
      this.getSameTaskList()
    },
    fetchDetail() {
      this.dialogLoading = true
      preAlertDetail(this.task.orderNumber).then(res => {
        console.log('preAlertDetail', res)
        const { shipment, mbl, shippingOrders, shipmentItems, clpTasks, shipmentClpList, shipmentClpDetailList, orderHeadersWithItems } = res.data
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
        this.orderHeadersWithItems = orderHeadersWithItems || []

        this.getOrderFileList()

        this.$nextTick(() => {
          this.$refs.orderDetail.refresh(this.orderHeadersWithItems)
        })
        this.dialogLoading = false
      })
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shippingOrderId: this.task.shippingId, taskCode: 'Upload_Shipping_Documents' }).then(res => {
        res.data.forEach(file => {
          file.editable = false
        })
        //2026-03-18 收并单影响（每个SO下面的po文件都会有一份相同的），
        // 这里要过滤重复的文件根据documentNumber，fileName，fileSize，typeCode，相同就只保留一份
        const uniqueFiles = res.data.filter((file, index, self) => {
          return self.findIndex(f => f.documentNumber === file.documentNumber && f.fileName === file.fileName && f.fileSize === file.fileSize && f.typeCode === file.typeCode) === index
        })
        this.orderFiles = uniqueFiles
        this.tableLoading = false
      })
    },
    getSameTaskList() {
      getSameOrderTask({ shippingOrderId: this.task.shippingId, taskCode: this.task.taskCode }).then(res => {
        this.taskList = res.data
      })
    },
    handleEditSubmit(row) {
      updateDocumentNumberById({ id: row.id, documentNumber: row.documentNumber }).then(res => {
        if (res.code === 0) {
          this.$message.success('Edit successfully')
          this.$set(row, 'editable', false)
        } else {
          this.$message.error('Edit failed')
        }
      })
    },
    submitTask() {
      // let undone = false
      // let clrUnone = false
      // this.shippingOrders.forEach(so => {
      //   if (so.clrStatus == 'Undone' || so.clrStatus == 'Padding') {
      //     clrUnone = true
      //   }
      // })
      // if (clrUnone) {
      //   this.$message.error('Please ensure all CLR are done')
      //   return
      // }
      // this.clpTasks.forEach(clp => {
      //   if (clp.clrStatus == 'Undone' || clp.clrStatus == 'Padding') {
      //     clrUnone = true
      //   }
      // })
      // if (clrUnone) {
      //   this.$message.error('Please ensure all Order CLR are done')
      //   return
      // }

      if (this.confirmForm.approveResult == 'Failed' && this.confirmForm.reason == '') {
        this.$message.error('Please input comment')
        return
      }

      this.confirmForm.shipmentId = this.shipment.id
      this.confirmForm.createBy = this.$store.getters.nickname
      this.confirmForm.createId = this.$store.getters.userId
      this.confirmForm.createTime = new Date().getTime()
      this.task.jsonData = JSON.stringify(this.confirmForm)
      console.log('this.task', this.task)
      this.isLoading = true

      let count = 0
      let index = 0
      this.taskList.forEach(item => {
        item.jsonData = JSON.stringify(this.confirmForm)
        //2026-03-03 haikang 记录最后一个数据，需要考虑并单下回退的情况2
        index++
        if (index == this.taskList.length) {
          item.isLast = true
        }
        updateTask(item).then(res => {
          count++
          if (count == this.taskList.length) {
            this.isLoading = false
            this.dialogVisible = false
            this.confirmDialogVisible = false
            this.$emit('refresh')
            this.$notify({ title: 'Success', message: 'Success', type: 'success' })
          }
        })
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
