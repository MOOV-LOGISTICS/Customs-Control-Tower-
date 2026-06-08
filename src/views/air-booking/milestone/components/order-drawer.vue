<template>
  <div>
  <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl" >
      <div  v-loading="isDrawerLoading">
         <div class="cardx" v-for="h in taskList">
        <div class="status1Div">
          <span v-if="showTaskStatus(h) != ''" class="status2" :class="[showTaskStatus(h) == 'Possible' ? 'color2' : ''
            , showTaskStatus(h) == 'Finished' ? 'color1' : ''
            , showTaskStatus(h) == 'Urgent' ? 'color3' : ''
            , showTaskStatus(h) == 'Overdue' ? 'color4' : '']">
            {{ showTaskStatus(h) }}
            </span>
        </div>
        <div class="order" v-if="h.level === 1" style="margin-bottom: 5px;">Order: {{ h.orderNumber }}</div>
        <div class="order" v-else-if="h.level === 2" style="margin-bottom: 5px;">So Ref: {{ h.shippingOrderRef }}</div>
        <div class="order" v-else-if="h.level === 3" style="margin-bottom: 5px;">Air Ref: {{ h.shipmentRef }}</div>
        <div style="clear: both;"></div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name： {{ h.taskName }}</div>
        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;">Party Role：{{ h.taskName ==='Upload PO'?'SFTP':h.partyRole }}</div>
        <div style="clear: both;"></div>

        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 2">Complete Date：{{
          parseUTCTime2(h.dataFinishedTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Urgent Date：{{ parseUrgentTime(h) }}
        </div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Due Date：{{ parseDueTime(h) }}</div>
        <div v-if="h.status == 2">
          <div style="clear: both;"></div>
          <div class="date" style="margin-bottom: 5px;" @click="sendEmailTo(h)">Complete User：{{ h.taskName ==='Upload PO'?'SFTP':h.autoResolved?'Auto Resolved':h.operator?h.operator:h.updaterName }}
          </div>
        </div>

        <div style="margin-bottom: 5px; float: right;cursor: pointer;">
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" style="cursor: pointer; margin-right: 10px;"
              v-if="!(userCompanyTypeOnlyViewPerm())&&(showTaskStatus(h) == 'Overdue' || showTaskStatus(h) == 'Urgent') && user.deptId != h.partyId"
              class="el-icon-message"></i>
          </el-popover>
          <!--编辑权限的判定增加逻辑 edwin-->
          <i v-show="!(userCompanyTypeOnlyViewPerm())&&editTaskPerm(h)" @click="handleTask(h)" style="cursor: pointer; margin-right: 10px;" class="el-icon-edit"></i>       
          <i v-if="h.status == 2 && h.taskName !=='Upload PO'" @click="viewTask(h)" class="el-icon-view" style="cursor: pointer; margin-right: 10px;"></i>
        </div>
        <div style="clear: both;"></div>
      </div>
      </div>
    </el-drawer>
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
    <SubmitDocToAirlineHandler ref="submitDocToAirlineHandler" @success="refresh"/>
    <CargoInboundHandler ref="cargoInboundHandler" @success="refresh"/>
    <UploadShippingDocsHandler ref="uploadShippingDocsHandler" @success="refresh"/>
    <VerifyShippingDocsHandler ref="verifyShippingDocsHandler" @success="refresh"/>
    <AirDepartureHandler ref="airDepartureHandler" />
    <ReleaseHblAndInvoiceToShipperHandler ref="releaseHblAndInvoiceToShipperHandler" @success="refresh"/>
    <PreAlertHandler ref="preAlertHandler" @success="refresh"/>

    <milestone-detail-dialog ref="milestoneDetail"></milestone-detail-dialog>
    </div>
</template>

<script>
import { milestoneListByPo } from '@/api/air/booking'
import { reminder } from "@/api/order/task";
import { checkPermi } from '@/utils/permission'
import { getUserProfile, getUserCompanyTypeList } from "@/api/system/user";
import CargoReadyDateHandler from '../handler/01-cargo-ready-date/index.vue'
import DimensionsHandler from '../handler/02-dimensions/index.vue'
import ShipperBookingHandler from '../handler/03-shipper-booking/index.vue'
import ShipperBookingValidationHandler from '../handler/04-shipper-booking-validation/index.vue'
import AssignTransportPlanHandler from '../handler/05-assign-transport-plan/index.vue'
import PepcoBookingApprovalHandler from '../handler/06-pepco-booking-approval/index.vue'
import PepcoBookingScoreHandler from '../handler/07-pepco-booking-score/index.vue'
import CarrierBookingHandler from '../handler/08-carrier-booking/index.vue'
import BookingConfirmationHandler from '../handler/09-booking-confirmation/index.vue'
import SoReleaseToSupplierHandler from '../handler/10-so-release-to-supplier/index.vue'
import SubmitDocToAirlineHandler from '../handler/11-submit-doc-to-airline/index.vue'
import CargoInboundHandler from '../handler/12-cargo-inbound/index.vue'
import UploadShippingDocsHandler from '../handler/13-upload-shipping-docs/index.vue'
import VerifyShippingDocsHandler from '../handler/14-verify-shipping-docs/index.vue'
import AirDepartureHandler from '../handler/15-air-departure/index.vue'
import ReleaseHblAndInvoiceToShipperHandler from '../handler/16-release-hbl-and-invoice-to-shipper/index.vue'
import PreAlertHandler from '../handler/17-pre-alert/index.vue'

import MilestoneDetailDialog from '@/views/pepcoShipping/milestone/detail/index.vue'
export default {
  name: 'OrderDrawer',
  props: {
  },
  components: {
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
    PreAlertHandler,

    MilestoneDetailDialog
  },
  data() {
    return {
      drawer: false,
      title: 'Milestone Task Detail',
      taskList: [],
      isDrawerLoading: false,
      // 用户所在的公司类型列表
      userCompanyTypeList: [],
      orderHeader: {},
      user: {},
    }
  },
  methods: {

    async openDrawer(orderHeader) {
      this.drawer = true
      this.isDrawerLoading = true
      this.orderHeader = orderHeader

      try {
        const [companyRes, milestoneRes] = await Promise.all([
          getUserCompanyTypeList(),
          milestoneListByPo(orderHeader.id)
        ])
        this.userCompanyTypeList = companyRes.data
        // 过滤里程碑任务列表，保留用户有权限查看的任务
        const list = []
        milestoneRes.data.forEach(overview => {
          // 处理可见菜单权限
          if (checkPermi([`pepco:air:view:${overview.taskCode}`])) {
            if(overview.taskCode === 'dimensions' && this.orderHeader.dimensionEditable){
              overview.editable = true
            }
            list.push(overview)
          }
        }) 
        this.taskList = list || []

        getUserProfile().then(response => {
          this.user = response.data;
        });
      } finally {
        this.isDrawerLoading = false
      }
    },

    editTaskPerm(h) {
      return h.editable && checkPermi([`pepco:air:edit:${h.taskCode}`])
    },
    handleTask(task) {
      console.log('handleTask', task)
      switch (task.taskCode) {
        case 'cargo_ready_date':
          this.$refs.cargoReadyDateHandler.handle(task, 'edit');
          break
        case 'dimensions':
          this.$refs.dimensionsHandler.handle(task, 'edit');
          break
        case 'shipper_booking':
          this.$refs.ShipperBookingHandler.handle(task, 'edit');
          break
        case 'shipper_booking_validation':
          this.$refs.ShipperBookingValidationHandler.handle(task, 'edit');
          break
        case 'assign_transport_plan':
          this.$refs.assignTransportPlanHandler.handle(task, 'edit');
          break
        case 'pepco_booking_approval':
          this.$refs.pepcoBookingApprovalHandler.handle(task, 'edit');
          break
        case 'pepco_booking_score':
          this.$refs.pepcoBookingScoreHandler.handle(task, 'edit');
          break
        case 'carrier_booking':
          this.$refs.carrierBookingHandler.handle(task, 'edit');
          break
        case 'booking_confirmation':
          this.$refs.bookingConfirmationHandler.handle(task, 'edit');
          break
        case 'so_release_to_supplier':
          this.$refs.soReleaseToSupplierHandler.handle(task, 'edit');
          break
        case 'submit_documents_to_airline':
          this.$refs.submitDocToAirlineHandler.handle(task, 'edit');
          break
        case 'cargo_inbound':
          this.$refs.cargoInboundHandler.handle(task, 'edit');
          break
        case 'upload_shipping_documents':
          this.$refs.uploadShippingDocsHandler.handle(task, 'edit');
          break
        case 'verify_shipping_documents':
          this.$refs.verifyShippingDocsHandler.handle(task, 'edit');
          break
        case 'air_departure':
          this.$refs.airDepartureHandler.handle(task, 'edit');
          break
        case 'release_hbl_and_invoice_to_shipper':
          this.$refs.releaseHblAndInvoiceToShipperHandler.handle(task, 'edit');
          break
        case 'pre_alert':
          this.$refs.preAlertHandler.handle(task, 'edit');
          break
        default:
          // this.$refs.commonFormHandler.openDialog(this.milestone, 'edit')
          console.warn('未知任务名称:', task.taskName)
          break
      }
    },
    viewTask(task) {
      console.log('viewTask', task)
      switch (task.taskCode) {
        case 'cargo_ready_date':
          this.$refs.cargoReadyDateHandler.handle(task, 'view');
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
          this.$refs.assignTransportPlanHandler.handle(task, 'view');
          break
        case 'pepco_booking_approval':
          this.$refs.pepcoBookingApprovalHandler.handle(task, 'view');
          break
        case 'pepco_booking_score':
          this.$refs.pepcoBookingScoreHandler.handle(task, 'view');
          break
        case 'carrier_booking':
          this.$refs.carrierBookingHandler.handle(task, 'view');
          break
        case 'booking_confirmation':
          this.$refs.bookingConfirmationHandler.handle(task, 'view');
          break
        case 'so_release_to_supplier':
          this.$refs.soReleaseToSupplierHandler.handle(task, 'view');
          break
        case 'submit_documents_to_airline':
          this.$refs.submitDocToAirlineHandler.handle(task, 'view');
          break
        case 'cargo_inbound':
          this.$refs.cargoInboundHandler.handle(task, 'view');
          break
        case 'upload_shipping_documents':
          this.$refs.uploadShippingDocsHandler.handle(task, 'view');
          break
        case 'verify_shipping_documents':
          this.$refs.verifyShippingDocsHandler.handle(task, 'view');
          break
        case 'air_departure':
          this.$refs.airDepartureHandler.handle(task, 'view');
          break
        case 'release_hbl_and_invoice_to_shipper':
          this.$refs.releaseHblAndInvoiceToShipperHandler.handle(task, 'view');
          break
        case 'pre_alert':
          this.$refs.preAlertHandler.handle(task, 'view');
          break
        default:
          // 未匹配到任何任务名时的处理（可选）
          console.warn('未知任务名称:', task.taskName)
          break
      }
    },
    showTaskStatus(h) {
      if (h.status == 0) {
        return ''
      } else if (h.status == 1) {
        if (h.flowStatus == 3) {
          return 'Overdue'
        } else if (h.flowStatus == 2) {
          return 'Urgent'
        } else if (h.flowStatus == 1) {
          return 'Possible'
        } else {
          return ''
        }
      } else if (h.status == 2) {
        return 'Finished'
      }
    },
    sendEmailTo(task) {
      window.location.href = `mailto:${task.updaterName}`;
    },
    userCompanyTypeOnlyViewPerm(){
      const stringFlag = ['OHA Management', 'PEPCO Management', 'PEPCO SCM']
      return stringFlag.some(item =>this.userCompanyTypeList.includes(item))
    },
    sendEmail(task) {
      reminder({
        status: this.showTaskStatus(task),
        orderNumber: this.orderHeader.orderNumber,
        taskName: task.taskName,
        partyId: task.partyId
      }).then((res) => {
        this.$notify({
          title: 'success',
          message: 'Reminder mail sent',
          type: 'success'
        });
      })
    },
    refresh(){
      this.openDrawer(this.orderHeader)
      this.$emit('refresh', true)
    },
    parseUrgentTime(h) {
      if (h.taskCode === 'air_departure'
        || h.taskCode === 'pre_alert'
      ) {
        return this.parseUTCTime2(h.urgentDate, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      return this.parseTime(h.urgentDate)
    },
    parseDueTime(h) {
      if (h.taskCode === 'air_departure'
        || h.taskCode === 'pre_alert'
      ) {
        return this.parseUTCTime2(h.dueDate, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      return this.parseTime(h.dueDate)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
}

.not-check-css {
  border-color: red;
}


.title {
  font-weight: bold;
  padding-right: 10px;
}


.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}

.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}

.title {
  border: 5px;
}

.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
}

.status2 {

  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}

.color1 {
  color: #13854e;
  background-color: #d6ede2;
}

.color2 {
  color: #2d86ba;
  background-color: #ceecfd;
}

.numberOftask {
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.color3 {
  color: #e6a23c;
  background: #fdf6ec;
}

.color4 {
  color: #f56c6c;
  background: #fef0f0;
}

::v-deep .hiddenCheck>.cell .el-checkbox__inner {
  display: none;
}

.center-input ::v-deep input {
  text-align: center;
}

</style>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: #fff;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266 !important;
  background-color: #fff;
}

// el-checkbox禁用样式修改
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input + span.el-checkbox__label {
  color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #606266;
}

.centered-descriptions :deep(.el-descriptions-item__content) {
  justify-content: center;
  text-align: center;
}

.centered-item :deep(.el-descriptions-item__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.header-box {
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  .header-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #ffffff;
  }
}
.warning {
  font-weight: bold;
  color: red;
}

.overview-tabs {
  display: flex;
  gap: 16px;
}

.tab-item {
  position: relative;
  min-width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: 0.25s;
}

.tab-item:hover {
  color: #2e75bb;
  transform: translateY(-2px);
}

.tab-item.active {
  color: #2e75bb;
  border-bottom: 3px solid #2e75bb;
}

.tab-item span {
  pointer-events: none;
}

.tab-item .tab-icon {
  position: absolute;
  left: 15px; 
  fill: currentColor;
}

.tab-item .overview-right-success-icon{
  position: absolute;
  right: 20px; 
  transform: scale(1.5);
  color: #13854e;
}

.tab-item .overview-right-warning-icon{
  position: absolute;
  right: 20px; 
  transform: scale(1.5);
  color: #e6a23c;
}

.tabs-bottom-line {
  margin-top:8px; height:1px; width:100%;
  background:rgba(110, 106, 106, 0.3); 
  border-radius:1px;
}
</style>