<template>
  <el-dialog :visible.sync="dialogVisible" title="Pre Alert" append-to-body width="85%">
    <el-descriptions title="Air Booking Info" :colon="false" style="border: none;padding: 15px!important;background: #fff;" :column="4">
      <el-descriptions-item label="MOOV Reference">{{ airBooking?.moovRef }}</el-descriptions-item>
      <el-descriptions-item label="Airline">{{ airBooking?.airline }}</el-descriptions-item>
      <el-descriptions-item label="POL">{{ airBooking?.pol }}</el-descriptions-item>
      <el-descriptions-item label="POD">{{ airBooking?.pod }}</el-descriptions-item>
      <el-descriptions-item label="ETD">{{ parseUTCTime(airBooking?.etd) }}</el-descriptions-item>
      <el-descriptions-item label="ETA">{{ parseUTCTime(airBooking?.eta) }}</el-descriptions-item>
      <el-descriptions-item label="MAWB">
        <span v-if="mblFile?.documentNumber">{{ mblFile?.documentNumber }}</span>
        <el-tag v-else type="danger">Undone</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="BL Type">{{ mblFile?.blType }}</el-descriptions-item>
    </el-descriptions>

    <el-card style="margin-top: 20px;">
      <el-table :data="shippingOrders">
        <el-table-column prop="soRef" label="Shipper Booking Number" min-width="140px" align="center" />
        <el-table-column prop="shipmentType" label="Booking Type" min-width="120px" align="center" />
        <el-table-column prop="hblNumber" label="HAWB Number" min-width="140px" align="center">
          <template #default="scope">
            <span v-if="scope.row.hblNumber">{{ scope.row.hblNumber }}</span>
            <el-tag v-else type="danger">Undone</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blType" label="BL Type" min-width="100px" align="center" />
        <!-- <el-table-column prop="totalCbm" label="CBM" min-width="100px" align="center" />
        <el-table-column prop="totalQty" label="Packages" min-width="100px" align="center" />
        <el-table-column prop="totalWeight" label="Gross Weight" min-width="100px" align="center" /> -->
      </el-table>
    </el-card>

    <upload-file ref="uploadFileRef" @reload="fetchDetail" />

    <el-card style="margin-top: 20px;">
      <el-form :model="submitForm" size="mini">
        <el-form-item required label="Pre Alert" label-width="180px">
          <el-date-picker :disabled="milestone.status==2" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="submitForm.preAlertDate" type="date" placeholder="Pre Alert"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="milestone.status==1" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" :disabled="isLoading" :loading="isLoading" @click="submitPreAlertTask">Submit</el-button>
    </div>
  </el-dialog>
</template>
  
  <script>
import moment from "moment";
import UploadFile from './components/upload-file.vue'
import {shippingMilestoneAggregate} from '@/api/air/booking'
import { completeMilestone } from "@/api/air/booking";

export default {
  name: 'PreAlertHandler',
  components: { UploadFile },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      dialogLoading: false,
      milestone: {},
      airBooking: {},
      mblFile: {},
      shippingOrders: [],
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
    async openDialog(milestone, isAdd) {
      console.log('openDialog', milestone)
      this.isLoading = false
      this.milestone = milestone
      this.isAdd = isAdd
      this.dialogVisible = true
      this.fetchDetail()
      this.isEdit = true
      const formData = JSON.parse(milestone.formData)
      if (formData && formData.length > 0) {
        this.submitForm.preAlertDate = formData[0].value
      }
    },
    fetchDetail() {
      this.dialogLoading = false
      shippingMilestoneAggregate(this.milestone.id).then(res => {
        console.log('preAlertDetail', res.data)
        const { airBookingAggregate, mawb } = res.data
        this.airBooking = Object.assign({}, airBookingAggregate.airBooking)
        console.log('shipment111', airBookingAggregate.airBooking)
        this.mblFile = Object.assign({}, mawb)
        const { shippingOrders, airBookingLines } = res.data.airBookingAggregate
        this.shippingOrders = [...shippingOrders]

        this.$nextTick(() => {
          // 修改 只要pre alert做完后，uploadFile都可以编辑
          this.$refs.uploadFileRef.initComponent(this.milestone, this.milestone.shipmentId, true)
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
        this.$message.error('Please Upload MAWB File')
        return
      }
      let undone = false
      this.shippingOrders.forEach(so => {
        if (so.hblNumber == null || so.hblNumber == '') {
          undone = true
        }
      })
      if (undone) {
        this.$message.error('Please ensure all HAWB are uploaded')
        return
      }
      this.submitForm.shipmentId = this.airBooking.id
      console.log('this.milestone', this.milestone)
      this.isLoading = true
      const command = {
        milestoneId: this.milestone.id,
        taskCode: this.milestone.taskCode,
        params:{
          ...this.submitForm
        },
        formData:[{"type":"date","key":"preAlertDate","label":"Pre Alert Date","value":moment(this.submitForm.preAlertDate).format('yyyy-MM-DD')}],
      }
      completeMilestone(command)
        .then(res => {
          if (res.code == 0) {
            this.dialogVisible = false
          }
        })
        .catch(err => {
          console.error('fail:', err)
        })
        .finally(() => {
          this.$emit('success')
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
  