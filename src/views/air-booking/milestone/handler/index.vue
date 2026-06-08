<template>
  <div style="margin-bottom: 5px; cursor: pointer;">
    <!-- 添加发送人和发送时间 -->
    <el-popover placement="top-start" title trigger="hover" style="cursor: pointer; margin-right: 10px; font-size: 16px; ">
      <p v-show="milestone.remindTime != null">{{ 'Last Remind Time:' + parseUTCTime(milestone.remindTime) }}</p>
      <p v-show="milestone.remindTime == null">Send reminder</p>
      <i v-if="(milestone.flowStatus == 2 || milestone.flowStatus == 3) && milestone.partyRole == 'Supplier'" class="el-icon-message" @click="sendEmail(milestone)" slot="reference"></i>
    </el-popover>
    <i v-if="showEdit()" class="el-icon-edit" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="handleTask()"></i>
    <i v-if="milestone.status === 2" class="el-icon-view" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="viewTask()"></i>
    <i class="el-icon-document" style="cursor: pointer; margin-right: 10px; font-size: 16px; " @click="handleDetail()"></i>

    <!-- milestone handler -->
    <Cargo-Ready-Date-Handler ref="cargoReadyDateHandler" @success="refresh" />
    <DimensionsHandler ref="dimensionsHandler" @success="refresh" />
    <ShipperBookingHandler ref="ShipperBookingHandler" />
    <ShipperBookingValidationHandler ref="ShipperBookingValidationHandler" />
    <AssignTransportPlanHandler ref="assignTransportPlanHandler" />
    <PepcoBookingApprovalHandler ref="pepcoBookingApprovalHandler" />
    <PepcoBookingScoreHandler ref="pepcoBookingScoreHandler" />
    <CarrierBookingHandler ref="carrierBookingHandler" />
    <BookingConfirmationHandler ref="bookingConfirmationHandler" />
    <SoReleaseToSupplierHandler ref="soReleaseToSupplierHandler" @success="refresh" />
    <SubmitDocToAirlineHandler ref="submitDocToAirlineHandler" @success="refresh" />
    <CargoInboundHandler ref="cargoInboundHandler" @success="refresh" />
    <UploadShippingDocsHandler ref="uploadShippingDocsHandler" @success="refresh" />
    <VerifyShippingDocsHandler ref="verifyShippingDocsHandler" @success="refresh" />
    <AirDepartureHandler ref="airDepartureHandler" />
    <ReleaseHblAndInvoiceToShipperHandler ref="releaseHblAndInvoiceToShipperHandler" @success="refresh" />
    <PreAlertHandler ref="preAlertHandler" @success="refresh" />

    <milestone-detail-dialog ref="milestoneDetail"></milestone-detail-dialog>
  </div>
</template>

<!-- milestone 操作按钮 -->
<script>
import { mapState } from 'vuex'
import { checkPermi } from '@/utils/permission'
import { airMilestoneMailRemind } from '@/api/air/booking'
import CargoReadyDateHandler from './01-cargo-ready-date/index.vue'
import DimensionsHandler from './02-dimensions/index.vue'
import ShipperBookingHandler from './03-shipper-booking/index.vue'
import ShipperBookingValidationHandler from './04-shipper-booking-validation/index.vue'
import AssignTransportPlanHandler from './05-assign-transport-plan/index.vue'
import PepcoBookingApprovalHandler from './06-pepco-booking-approval/index.vue'
import PepcoBookingScoreHandler from './07-pepco-booking-score/index.vue'
import CarrierBookingHandler from './08-carrier-booking/index.vue'
import BookingConfirmationHandler from './09-booking-confirmation/index.vue'
import SoReleaseToSupplierHandler from './10-so-release-to-supplier/index.vue'
import SubmitDocToAirlineHandler from './11-submit-doc-to-airline/index.vue'
import CargoInboundHandler from './12-cargo-inbound/index.vue'
import UploadShippingDocsHandler from './13-upload-shipping-docs/index.vue'
import VerifyShippingDocsHandler from './14-verify-shipping-docs/index.vue'
import AirDepartureHandler from './15-air-departure/index.vue'
import ReleaseHblAndInvoiceToShipperHandler from './16-release-hbl-and-invoice-to-shipper/index.vue'
import PreAlertHandler from './17-pre-alert/index.vue'

import MilestoneDetailDialog from '@/views/air-booking/milestone/detail/index.vue'
import { getUserProfile } from '@/api/system/user'

export default {
  name: 'MilestoneHandler',
  components: {
    MilestoneDetailDialog,
    CargoReadyDateHandler,
    DimensionsHandler,
    ShipperBookingHandler,
    ShipperBookingValidationHandler,
    AssignTransportPlanHandler,
    PepcoBookingApprovalHandler,
    PepcoBookingScoreHandler,
    CarrierBookingHandler,
    BookingConfirmationHandler,
    SoReleaseToSupplierHandler,
    SubmitDocToAirlineHandler,
    CargoInboundHandler,
    UploadShippingDocsHandler,
    VerifyShippingDocsHandler,
    AirDepartureHandler,
    ReleaseHblAndInvoiceToShipperHandler,
    PreAlertHandler
  },
  props: {
    milestone: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      user: {},
      cargoReadyDateFormVisible: false,
      cardDialogInfo: {
        title: ''
      },
      title: '',
      onlyView: false
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
      return this.milestone.editable && checkPermi([`pepco:air:edit:${this.milestone.taskCode}`])
    },
    refresh() {
      this.$emit('refresh')
    },
    handleTask() {
      console.log('handleTask', this.milestone)
      switch (this.milestone.taskCode) {
        case 'cargo_ready_date':
          this.$refs.cargoReadyDateHandler.handle(this.milestone, 'edit')
          break
        case 'dimensions':
          this.$refs.dimensionsHandler.handle(this.milestone, 'edit')
          break
        case 'shipper_booking':
          this.$refs.ShipperBookingHandler.handle(this.milestone, 'edit')
          break
        case 'shipper_booking_validation':
          this.$refs.ShipperBookingValidationHandler.handle(this.milestone, 'edit')
          break
        case 'assign_transport_plan':
          this.$refs.assignTransportPlanHandler.handle(this.milestone, 'edit')
          break
        case 'pepco_booking_approval':
          this.$refs.pepcoBookingApprovalHandler.handle(this.milestone, 'edit')
          break
        case 'pepco_booking_score':
          this.$refs.pepcoBookingScoreHandler.handle(this.milestone, 'edit')
          break
        case 'carrier_booking':
          this.$refs.carrierBookingHandler.handle(this.milestone, 'edit')
          break
        case 'booking_confirmation':
          this.$refs.bookingConfirmationHandler.handle(this.milestone, 'edit')
          break
        case 'so_release_to_supplier':
          this.$refs.soReleaseToSupplierHandler.handle(this.milestone, 'edit')
          break
        case 'submit_documents_to_airline':
          this.$refs.submitDocToAirlineHandler.handle(this.milestone, 'edit')
          break
        case 'cargo_inbound':
          this.$refs.cargoInboundHandler.handle(this.milestone, 'edit')
          break
        case 'upload_shipping_documents':
          this.$refs.uploadShippingDocsHandler.handle(this.milestone, 'edit')
          break
        case 'verify_shipping_documents':
          this.$refs.verifyShippingDocsHandler.handle(this.milestone, 'edit')
          break
        case 'air_departure':
          this.$refs.airDepartureHandler.handle(this.milestone, 'edit')
          break
        case 'release_hbl_and_invoice_to_shipper':
          this.$refs.releaseHblAndInvoiceToShipperHandler.handle(this.milestone, 'edit')
          break
        case 'pre_alert':
          this.$refs.preAlertHandler.handle(this.milestone, 'edit')
          break
        default:
          // this.$refs.commonFormHandler.openDialog(this.milestone, 'edit')
          console.warn('未知任务名称:', this.milestone.taskName)
          break
      }
    },
    viewTask() {
      const task = this.milestone
      console.log('viewTask', task)
      switch (task.taskCode) {
        case 'cargo_ready_date':
          this.$refs.cargoReadyDateHandler.handle(task, 'view')
          break
        case 'dimensions':
          this.$refs.dimensionsHandler.handle(task, 'view')
          break
        case 'shipper_booking':
          this.$refs.ShipperBookingHandler.handle(task, 'view')
          break
        case 'shipper_booking_validation':
          this.$refs.ShipperBookingValidationHandler.handle(task, 'view')
          break
        case 'assign_transport_plan':
          this.$refs.assignTransportPlanHandler.handle(task, 'view')
          break
        case 'pepco_booking_approval':
          this.$refs.pepcoBookingApprovalHandler.handle(task, 'view')
          break
        case 'pepco_booking_score':
          this.$refs.pepcoBookingScoreHandler.handle(task, 'view')
          break
        case 'carrier_booking':
          this.$refs.carrierBookingHandler.handle(task, 'view')
          break
        case 'booking_confirmation':
          this.$refs.bookingConfirmationHandler.handle(task, 'view')
          break
        case 'so_release_to_supplier':
          this.$refs.soReleaseToSupplierHandler.handle(task, 'view')
          break
        case 'submit_documents_to_airline':
          this.$refs.submitDocToAirlineHandler.handle(task, 'view')
          break
        case 'cargo_inbound':
          this.$refs.cargoInboundHandler.handle(task, 'view')
          break
        case 'upload_shipping_documents':
          this.$refs.uploadShippingDocsHandler.handle(task, 'view')
          break
        case 'verify_shipping_documents':
          this.$refs.verifyShippingDocsHandler.handle(task, 'view')
          break
        case 'air_departure':
          this.$refs.airDepartureHandler.handle(task, 'view')
          break
        case 'release_hbl_and_invoice_to_shipper':
          this.$refs.releaseHblAndInvoiceToShipperHandler.handle(task, 'view')
          break
        case 'pre_alert':
          this.$refs.preAlertHandler.handle(task, 'view')
          break
        default:
          // 未匹配到任何任务名时的处理（可选）
          console.warn('未知任务名称:', task.taskName)
          break
      }
    },
    handleDetail() {
      this.$refs.milestoneDetail.openDialog(this.milestone)
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
      airMilestoneMailRemind({
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
