<template>
  <div style="margin-bottom: 5px; cursor: pointer;">
    <!-- 添加发送人和发送时间 -->
    <el-popover placement="top-start" title trigger="hover" style="cursor: pointer; margin-right: 10px; font-size: 16px; ">
      <p v-show="milestone.remindTime!=null">{{ 'Last Remind Time:'+parseUTCTime(milestone.remindTime) }}</p>
      <p v-show="milestone.remindTime==null">Send reminder</p>
      <i @click="sendEmail(milestone)" slot="reference" v-if="(milestone.flowStatus== 2 || milestone.flowStatus== 3 ) && milestone.partyRole =='Supplier'" class="el-icon-message"></i>
    </el-popover>
    <i v-if="showEdit()" class="el-icon-edit" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="handleTask()"></i>
    <i v-if=" showSeniorEdit(milestone)" class="el-icon-edit" style="cursor: pointer; margin-right: 10px; font-size: 16px; color: #FE5000; " @click="handleMilestoneTask(milestone,'edit')"></i>
    <i v-if="milestone.status === 2 " class="el-icon-view" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="viewTask()"></i>
    <i class="el-icon-document" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="viewDetail()"></i>

    <common-form-handler ref="commonFormHandler" @success="refresh"></common-form-handler>
    <shipping-document-handler ref="shippingDocumentHandler" @success="refresh"></shipping-document-handler>
    <verify-document-handler ref="verifyDocumentHandler" @success="refresh"></verify-document-handler>
    <release-hbl-handler ref="releaseHblHandler" @success="refresh"></release-hbl-handler>
    <pre-alert-handler ref="preAlertHandler" @success="refresh"></pre-alert-handler>
    <milestone-detail-dialog ref="milestoneDetail"></milestone-detail-dialog>
  </div>
</template>

<!-- milestone 操作按钮 -->
<script>
import { mapState } from 'vuex'
import { checkPermi } from '@/utils/permission'
import CommonFormHandler from '@/views/pepcoShipping/milestone/handler/common-handler/index.vue'
import ShippingDocumentHandler from '@/views/pepcoShipping/milestone/handler/shipping-document-handler/index.vue'
import VerifyDocumentHandler from '@/views/pepcoShipping/milestone/handler/verify-document-handler/index.vue'
import ReleaseHblHandler from '@/views/pepcoShipping/milestone/handler/release-hbl-handler/index.vue'
import PreAlertHandler from '@/views/pepcoShipping/milestone/handler/pre-alert-handler/index.vue'

import MilestoneDetailDialog from '@/views/pepcoShipping/milestone/detail/index.vue'
import { getUserProfile } from '@/api/system/user'
import { milestoneMailRemind } from '@/api/pepco/milestone'
export default {
  name: 'MilestoneHandler',
  components: { CommonFormHandler, ShippingDocumentHandler, VerifyDocumentHandler, ReleaseHblHandler, PreAlertHandler, MilestoneDetailDialog },
  props: {
    milestone: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      userCompanyTypes: state => state.user.userCompanyTypes
    })
  },
  created() {
    console.log('this.milestone', this.milestone)
    console.log('this.userCompanyTypes', this.userCompanyTypes)
    this.user = getUserProfile()
  },
  methods: {
    showEdit() {
      return this.milestone.editable && checkPermi([`pepco:edit:${this.milestone.taskCode}`])
    },
    showSeniorEdit() {
      // 如果编辑按钮可见，则seniorEdit不可见
      if (this.showEdit()) {
        return false
      }
      return this.milestone.seniorEditable && checkPermi([`pepco:senior-edit:${this.milestone.taskCode}`])
    },
    refresh() {
      this.$emit('refresh')
    },
    viewDetail() {
      this.$refs.milestoneDetail.openDialog(this.milestone.id)
    },
    handleTask() {
      console.log('handleTask', this.milestone)
      switch (this.milestone.taskCode) {
        // case 'Shipper_Booking':
        //   this.openNewWindow('/shipment/ppShippingOrderDetail?id=' + task.shippingOrderId)
        //   break
        case 'Shipper_Booking_Validation':
          this.openNewWindow('/shipment/ppShippingOrderList?soRef=' + this.milestone.shippingOrderRef)
          break
        case 'Assign_Transport_Plan':
          this.openNewWindow('/shipment/ppShippingOrderList?soRef=' + this.milestone.shippingOrderRef)
          break
        case 'Pepco_Booking_Approval':
          this.openNewWindow('/shipment/ppShippingOrderList?soRef=' + this.milestone.shippingOrderRef)
          break
        case 'Pepco_Booking_Score':
          this.openNewWindow('/shipment/ppBookingScore')
          break
        case 'Carrier_Booking':
          if (this.$auth.hasPermi('shipment:create')) {
            this.openNewWindow('/shipment/ppShippingOrderList?soRef=' + this.milestone.shippingOrderRef)
          } else {
            this.$modal.msgError('No permission, please find the administrator to apply')
          }
          break
        case 'Booking_Confirmation':
          if (this.$auth.hasPermi('shipment:query')) {
            this.openNewWindow('/shipment/detail?id=' + this.milestone.shipmentId)
          } else {
            this.$modal.msgError('No permission, please find the administrator to apply')
          }
          break
        case 'SO_Release_to_Supplier':
          this.$refs.commonFormHandler.openDialog(this.milestone, 'edit')
          break
        case 'SI_VGM_Submit':
          this.openNewWindow('/shipment/ppShippingOrder?ref=' + this.milestone.shippingOrderRef)
          break
        case 'SI_VGM_Submit_to_Carrier':
          this.openNewWindow('/shipment/detail?id=' + this.milestone.shipmentId)
          break
        case 'Cargo_Receive_Date':
          this.$refs.commonFormHandler.openDialog(this.milestone, 'edit')
          break
        case 'Container_Loading_Plan':
          this.openNewWindow(
            '/shipment/clp/add?shipmentId=' + this.milestone.shipmentId + '&orderNumber=' + this.milestone.orderNumber + '&orderId=' + this.milestone.orderId + '&soRef=' + this.milestone.shippingOrderRef
          )
          break
        case 'Upload_Shipping_Documents':
          this.$refs.shippingDocumentHandler.openDialog(this.milestone)
          break
        case 'Verify_Shipping_Documents':
          this.$refs.verifyDocumentHandler.openDialog(this.milestone)
          break
        case 'Vessel_Departure':
          if (this.$auth.hasPermi('shipment:query')) {
            this.openNewWindow('/shipment/detail?id=' + this.milestone.shipmentId)
          } else {
            this.$modal.msgError('No permission, please find the administrator to apply')
          }
          break
        case 'Release_HBL_and_Invoice_to_Shipper':
          this.$refs.releaseHblHandler.openDialog(this.milestone)
          break
        case 'Pre_Alert':
          this.$refs.preAlertHandler.openDialog(this.milestone, true)
          break

        default:
          this.$refs.commonFormHandler.openDialog(this.milestone, 'edit')
          break
      }
    },
    viewTask() {
      const task = this.milestone
      console.log('viewTask', task)

      switch (task.taskCode) {
        case 'Shipper_Booking':
          this.openNewWindow('/shipment/ppShippingOrderDetail?id=' + task.shippingOrderId)
          break

        case 'Shipper_Booking_Validation':
        case 'Assign_Transport_Plan':
          this.openNewWindow('/shipment/ppShippingOrderList?soRef=' + task.shippingOrderRef)
          break

        case 'Pepco_Booking_Approval':
          this.openNewWindow('/shipment/ppShippingOrderDetail?id=' + task.shippingOrderId)
          break

        case 'Pepco_Booking_Score':
          this.openNewWindow('/shipment/ppBookingScore')
          break

        case 'Carrier_Booking':
          this.openNewWindow('/shipment/detail?id=' + task.shipmentId)
          break

        case 'Booking_Confirmation':
          console.log('Booking Confirmation', task)
          this.$alert('Date:' + JSON.parse(task.jsonData).bookingConfirmationDate + '<br/>' + 'Booking Number:' + JSON.parse(task.jsonData).shipmentBookingNumber, 'Booking Confirmation', {
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true,
            callback: action => {}
          })
          break

        case 'SO_Release_to_Supplier':
          this.$refs.commonFormHandler.openDialog(this.milestone, 'view')
          break

        case 'SI_VGM_Submit':
          console.log('SI/VGM Submit', this.userCompanyTypes)
          if (this.userCompanyTypes && this.userCompanyTypes.includes('Supplier')) {
            this.openNewWindow('/shipment/ppShippingOrder?ref=' + task.shippingOrderRef)
          } else {
            this.openNewWindow('/shipment/ppShippingOrderDetail?id=' + task.shippingOrderId + '&source=shipping-order')
          }
          break

        case 'SI_VGM_Submit_to_Carrier':
          this.openNewWindow('/shipment/detail?id=' + task.shipmentId)
          break

        case 'Cargo_Receive_Date':
          this.$refs.commonFormHandler.openDialog(this.milestone, 'view')
          break

        case 'Container_Loading_Plan':
          this.openNewWindow(
            '/shipment/clp/add?shipmentId=' + this.milestone.shipmentId + '&orderNumber=' + this.milestone.orderNumber + '&orderId=' + this.milestone.orderId + '&soRef=' + this.milestone.shippingOrderRef
          )
          break

        case 'Upload_Shipping_Documents':
          this.$refs.shippingDocumentHandler.openDialog(this.milestone)
          break

        case 'Verify_Shipping_Documents':
          this.$refs.verifyDocumentHandler.openDialog(this.milestone)
          break

        case 'Vessel_Departure':
          this.$refs.commonFormHandler.openDialog(this.milestone, 'view')
          break

        case 'Release_HBL_and_Invoice_to_Shipper':
          this.$refs.releaseHblHandler.openDialog(this.milestone)
          break

        case 'Pre_Alert':
          this.$refs.preAlertHandler.openDialog(this.milestone, false)
          break

        default:
          // 未匹配到任何任务名时的处理（可选）
          console.warn('未知任务名称:', task.taskName)
          break
      }
    },
    handleSubmit(formData) {
      this.milestoneListLoading = true
      completeMilstone(updatedCommand)
        .then(response => {
          this.refresh()
          this.$message({ message: 'Submit Success', type: 'success' })
        })
        .catch(err => {
          this.refresh()
          this.$message({ message: 'Submit Fail:' + err, type: 'error' })
        })
    },
    openNewWindow(ref) {
      let newWindow = window.open(ref, '_blank')
      if (newWindow) {
      } else {
        this.$router.push(ref)
      }
    },
    sendEmail(milestone) {
      milestoneMailRemind({
        milestoneId: milestone.id
      }).then(res => {
        this.$notify({
          title: 'success',
          message: 'Reminder mail sent',
          type: 'success'
        })
      })
    }
  }
}
</script>
