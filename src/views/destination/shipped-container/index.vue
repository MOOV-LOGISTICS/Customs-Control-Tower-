<template>
  <div class="app-container">
    <div class="card-box-container-dest-01">
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center;"
        v-hasPermi="['pepco:destination-containers:container-download']">
        <div @click="downloadContainerData">
          <icon-park type="inbox-download-r" theme="filled" size="60" fill="#004F7C" strokeLinejoin="miter"
            strokeLinecap="square" />
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px 8px 8px 0' }">
        <!-- 左侧图标 -->
        <div
          style="float: left; margin-top: 10px; height: 100%; display: flex; align-items: center; border-right: 1px solid #ddd; padding-right: 20px;">
          <icon-park type="order" theme="filled" size="70" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"
            style="cursor: default;" />
        </div>
        <!-- 右侧文字 -->
        <div @click="handReportChange(null)" class="clickable-area"
          style="border-radius: 10px; float: left; margin-left: 20px; line-height: 24px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin-top: 10px;">Total Container</p>
          <p class="count-class" style="margin: 4px 0 0; margin-top: 20px; text-align: center">{{
            containerOverviewStatus.containerCount }}</p>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:delivery-pre-plan:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Delivery Pre-Plan</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPrePlan === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(1, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPrePlanPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPrePlan === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(1, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPrePlanPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPrePlan === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(1, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPrePlanPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.deliveryPrePlan === true }"
            @click="handReportChange(2, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPrePlanDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:assign-count:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Broker Assign</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.brokerAssign === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(7, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.brokerAssignPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.brokerAssign === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(7, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.brokerAssignPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.brokerAssign === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(7, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.brokerAssignPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.brokerAssign === true }"
            @click="handReportChange(8, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.brokerAssignDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:delivery-plan:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Delivery Plan</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPlan === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(3, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPlanPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPlan === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(3, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPlanPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.deliveryPlan === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(3, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPlanPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.deliveryPlan === true }"
            @click="handReportChange(4, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.deliveryPlanDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:invoice-count:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Invoice to Customs</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div :class="{
            'activePort': JSON.stringify(containerQueryParams.invoiceCustomsList) === JSON.stringify([0, 2])
              && containerQueryParams.taskType === 'possible'
          }" @click="handReportChange(9, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.invoiceCustomsPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div :class="{
            'activePort': JSON.stringify(containerQueryParams.invoiceCustomsList) === JSON.stringify([0, 2])
              && containerQueryParams.taskType === 'urgent'
          }" @click="handReportChange(9, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.invoiceCustomsPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div :class="{
            'activePort': JSON.stringify(containerQueryParams.invoiceCustomsList) === JSON.stringify([0, 2])
              && containerQueryParams.taskType === 'overdue'
          }" @click="handReportChange(9, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.invoiceCustomsPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{
            'activePort': JSON.stringify(containerQueryParams.invoiceCustomsList) === JSON.stringify([1])
          }" @click="handReportChange(10, 'finished')" class="clickable-area"
            style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.invoiceCustomsDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:finished-count:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Customs Clearance Finish</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.customsClearanceFinish === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(11, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.customsClearanceFinishPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.customsClearanceFinish === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(11, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.customsClearanceFinishPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.customsClearanceFinish === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(11, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.customsClearanceFinishPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.customsClearanceFinish === true }"
            @click="handReportChange(12, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.customsClearanceFinishDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:arrival-at-dc-date:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Arrival at DC</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.arrivalDc === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(5, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.arrivalAtDcPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.arrivalDc === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(5, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.arrivalAtDcPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.arrivalDc === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(5, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.arrivalAtDcPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.arrivalDc === true }"
            @click="handReportChange(6, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.arrivalAtDcDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:vessel-arrival:view']">
        <div style="background-color: #f7f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Vessel Arrival</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.vesselArrival === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(107,'possible')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.vesselArrivalPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.vesselArrival === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(107, 'urgent')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.vesselArrivalPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.vesselArrival === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(107, 'overdue')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.vesselArrivalPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.vesselArrival === true }" @click="handReportChange(110, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.vesselArrivalDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:container-discharged:view']">
        <div style="background-color: #f7f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Container Discharged</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.containerDischarged === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(108,'possible')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.containerDischargedPendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.containerDischarged === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(108, 'urgent')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.containerDischargedPendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.containerDischarged === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(108, 'overdue')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.containerDischargedPendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.containerDischarged === true }" @click="handReportChange(111, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.containerDischargedDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination:empty-container-re:view']">
        <div style="background-color: #f7f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Empty Container Returned</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': containerQueryParams.emptyContainerRe === false && containerQueryParams.taskType === 'possible' }"
            @click="handReportChange(109,'possible')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.emptyContainerRePendingPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': containerQueryParams.emptyContainerRe === false && containerQueryParams.taskType === 'urgent' }"
            @click="handReportChange(109, 'urgent')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.emptyContainerRePendingUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': containerQueryParams.emptyContainerRe === false && containerQueryParams.taskType === 'overdue' }"
            @click="handReportChange(109, 'overdue')"
            class="clickable-area"
            style="padding: 0 10px; cursor: pointer;"
          >
            <p class="count-class">{{ containerOverviewStatus.emptyContainerRePendingOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': containerQueryParams.emptyContainerRe === true }" @click="handReportChange(112, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ containerOverviewStatus.emptyContainerReDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="pd-20">
      <!-- 搜索工作栏 -->
      <div style="display: flex; width: 100%; overflow-x: auto" class="box-scroller">
        <el-form :model="containerQueryParams" ref="queryForm" size="small" :inline="true" v-show="showContainerSearch"
          label-width="68px" style="display: flex">
          <div style="display: flex; flex-shrink: 0">
            <el-input style="min-width: 146px" v-model="containerQueryParams.containerNo" placeholder="Container Number"
              clearable @keyup.enter.native="handleQuery"
              @clear="handleQuery"
              @input="(value) => containerQueryParams.containerNo = value.trim()" />

            <div style="margin-left: 8px; margin-bottom: 6px">
              <el-input
                style="width: 166px"
                v-model="containerQueryParams.orderRef"
                placeholder="Order Number"
                clearable
                @keyup.enter.native="handleQuery"
                @clear="handleQuery"
                @input="(value) => containerQueryParams.orderRef = value.trim()"
              />
            </div>

            <div style="margin-left: 8px; margin-bottom: 6px">
              <el-input
                style="width: 166px"
                v-model="containerQueryParams.lpNumber"
                placeholder="LP Number"
                clearable
                @keyup.enter.native="handleQuery"
                @input="(value) => containerQueryParams.lpNumber = value.trim()"
                @clear="handleQuery"
              />
            </div>
            <div style="margin-left: 8px; margin-bottom: 6px" v-if="this.$auth.hasPermi('pepco:destination-containers:columns-show')">
              <el-input
                style="min-width: 146px"
                v-model="containerQueryParams.hblNumber"
                placeholder="HBL Number"
                clearable
                @keyup.enter.native="handleQuery"
                @clear="handleQuery"
                @input="(value) => containerQueryParams.hblNumber = value.trim()"
              />
            </div>
            <div style="margin-left: 8px">
              <el-input style="min-width: 146px" v-model="containerQueryParams.mblNumber" :placeholder="$constants.MBL_NUMBER"
                clearable @keyup.enter.native="handleQuery"
                @clear="handleQuery"
                @input="(value) => containerQueryParams.mblNumber = value.trim()" />
            </div>
            <div style="margin-left: 8px">
              <el-select style="min-width: 146px" @change="handleQuery" clearable v-model="containerQueryParams.pendingTaskCode"
                placeholder="Pending Task" filterable>
                <el-option v-for="item in pendingTaskList" :key="item.taskCode" :label="item.taskName"
                  :value="item.taskCode"></el-option>
              </el-select>
            </div>
            <div style="display: flex; margin-left: 8px; margin-bottom: 6px">
              <el-popover v-model="filterPopover" placement="bottom" title=" " popper-class="popover-filter"  width="1000" trigger="click">
                <el-form>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.polList" multiple placeholder="POL" filterable>
                        <el-option v-for="item in containerQueryFilerList.polList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.pod" multiple placeholder="POD" filterable>
                        <el-option v-for="item in containerQueryFilerList.podList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.vessel" multiple placeholder="Departing Vessel"
                        filterable>
                        <el-option v-for="item in containerQueryFilerList.vesselList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.voyageList" multiple
                        placeholder="Departing Voyage" filterable>
                        <el-option v-for="item in containerQueryFilerList.voyageList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.podVessel" multiple
                        placeholder="Arrival Vessel" filterable>
                        <el-option v-for="item in containerQueryFilerList.podVesselList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.podVoyageList" multiple
                        placeholder="Arrival Voyage" filterable>
                        <el-option v-for="item in containerQueryFilerList.podVoyageList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12">
                      <el-date-picker v-model="containerQueryParams.etaDateRange" clearable type="daterange"
                        range-separator="-" start-placeholder="ETA From" end-placeholder="ETA To"
                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable multiple v-model="containerQueryParams.carrierList" placeholder="Carrier"
                        filterable>
                        <el-option v-for="item in carrierList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable multiple v-model="containerQueryParams.contractTypeList"
                        placeholder="Contract Type" filterable>
                        <el-option v-for="item in contractTypeList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable multiple v-model="containerQueryParams.dcList" placeholder="DC" filterable>
                        <el-option v-for="item in containerQueryFilerList.dcList" :key="item.dcCode"
                          :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.mixDc" placeholder="Mix DC" filterable>
                        <el-option label="Yes" value="true" />
                        <el-option label="No" value="false" />
                      </el-select>
                    </el-col>
                  </el-row>

                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <!-- Pre-Planned Date -->
                    <el-col :span="8">
                      <el-date-picker popper-class="pre-planned-picker-popper"
                        v-model="containerQueryParams.prePlannedDate" type="daterange" value-format="yyyy-MM-dd"
                        start-placeholder="Pre-Planned Date From" end-placeholder="Pre-Planned Date To"
                        :disabled="containerQueryParams.prePlannedDateMode === 'blank'"
                        :picker-options="prePlannedPickerOptions" />
                    </el-col>
                    <el-col :span="4">
                      <el-select v-model="containerQueryParams.prePlannedDateMode" placeholder="Select Blank Dates"
                        clearable style="width: 180px;" @change="onPrePlannedDateModeChange">
                        <el-option label="Blank Dates" value="blank" />
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-date-picker popper-class="pre-planned-picker-popper"
                        v-model="containerQueryParams.plannedDate" type="daterange" value-format="yyyy-MM-dd"
                        start-placeholder="Planned Date From" end-placeholder="Planned Date To"
                        :disabled="containerQueryParams.plannedDateMode === 'blank'"
                        :picker-options="plannedPickerOptions" />
                    </el-col>
                    <!-- Planned Date -->
                    <el-col :span="4">
                      <el-select v-model="containerQueryParams.plannedDateMode" placeholder="Select Blank Dates"
                        clearable style="width: 180px;" @change="onPlannedDateModeChange">
                        <el-option label="Blank Dates" value="blank" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <!-- In DC Date -->
                    <el-col :span="8">
                      <el-date-picker popper-class="pre-planned-picker-popper" v-model="containerQueryParams.inDcDate"
                        type="daterange" value-format="yyyy-MM-dd" start-placeholder="In DC Date From"
                        end-placeholder="In DC Date To" :disabled="containerQueryParams.inDcDateMode === 'blank'"
                        :picker-options="inDcPickerOptions" />
                    </el-col>
                    <el-col :span="4">
                      <el-select v-model="containerQueryParams.inDcDateMode" placeholder="Select Blank Dates" clearable
                        style="width: 180px;" @change="onInDcDateModeChange">
                        <el-option label="Blank Dates" value="blank" />
                      </el-select>
                    </el-col>
                    <el-col col :span="6">
                      <el-select clearable multiple v-model="containerQueryParams.brokerDeptNameList"
                        placeholder="Broker" filterable>
                        <el-option v-for="item in containerQueryFilerList.brokerList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable multiple v-model="containerQueryParams.originCountry"
                        placeholder="Origin Country" filterable>
                        <el-option v-for="item in containerQueryFilerList.originCountryList" :key="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="containerQueryParams.sanitaryRisk"
                        placeholder="Sanitary Risk" clearable>
                        <el-option label="Yes" value="1"></el-option>
                        <el-option label="No" value="0"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="containerQueryParams.sanitary"
                        placeholder="Sanitary Required" clearable>
                        <el-option label="Yes" value="Yes"></el-option>
                        <el-option label="No" value="No"></el-option>
                        <el-option label="Mixed" value="Mixed"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="containerQueryParams.prePlanStatus" multiple
                        placeholder="Delivery Pre-Plan status" clearable>
                        <el-option label="Not Planned" value=0></el-option>
                        <el-option label="Planned" value=1></el-option>
                        <el-option label="Unplanned" value=2></el-option>
                        <el-option label="Replanned" value=3></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="containerQueryParams.planStatus" multiple placeholder="Delivery Plan status" clearable>
                        <el-option label="Not Planned" value="0"></el-option>
                        <el-option label="Planned" value="1"></el-option>
                        <el-option label="Unplanned" value="2"></el-option>
                        <el-option label="Replanned" value="3"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <!-- 增加过滤条件 doc verify -->
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="containerQueryParams.documentsVerified" placeholder="Documents Verified" clearable>
                        <el-option label="Yes" value="2"></el-option>
                        <el-option label="Partially Yes" value="1"></el-option>
                        <el-option label="No" value="0"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.invoiceCustoms" placeholder="Invoice to Customs" filterable>
                        <el-option label="C" value="1"></el-option>
                        <el-option label="I" value="2"></el-option>
                        <el-option label="N" value="0"></el-option>
                      </el-select>
                    </el-col>
                   <el-col :span="6">
                      <el-select clearable v-model="containerQueryParams.docReadyStatus"
                        placeholder="Docs Ready" filterable>
                        <el-option label="Complete" value="1"></el-option>
                        <el-option label="Incomplete" value="2"></el-option>
                        <el-option label="Not Done" value="0"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <div style="display: flex; justify-content: flex-end;">
              <!-- <el-button @click="handleQuery" type="primary">
                <i class="el-icon-search el-icon--right"></i>
                Search
              </el-button> -->
            </div>
                </el-form>
                <el-button slot="reference" icon="el-icon-plus" plain
                  :style="{ color: hasFilter ? '#004F7C': '' }">Filter</el-button>
              </el-popover>
              <el-button style="margin-left: 5px" @click="clearFilters" plain>Clear Filters</el-button>
            </div>
            <div style="margin-left: 8px;">
              <el-button @click="handleQuery" type="primary">
                <i class="el-icon-search el-icon--right"></i>
                Search
              </el-button>
            </div>
          </div>
          <div style="margin-left: 8px; flex-shrink: 0">
            <el-button v-hasPermi="['pepco:destination-containers:delivery-pre-plan']"
              :disabled="verifyDeliveryPlanDisable" type="primary" @click="handleContainerPreDeliveryPlanImport()"
              icon="el-icon-s-order" plain>Delivery Pre-Plan</el-button>

            <el-button v-hasPermi="['pepco:destination-shipments:broker-assign']" type="primary"
              @click="assignBroker('Customs_Broker_Assigned')" icon="el-icon-s-order" plain>Broker Assign</el-button>

            <el-button v-hasPermi="['pepco:destination-containers:delivery-plan']" :disabled="verifyDeliveryPlanDisable"
              type="primary" @click="handleContainerDeliveryPlanImport()" icon="el-icon-s-order" plain>Delivery
              Plan</el-button>

            <el-button v-hasPermi="['pepco:destination-containers:update-plan-status']" :disabled="verifyDisable"
              type="primary" @click="handleContainerPlanStatus()" icon="el-icon-s-order" plain>Unplan Containers</el-button>

            <el-button v-hasPermi="['pepco:destination-shipments:invoice-customers']" type="primary"
              @click="clickInvoice('Freight_and_Local_Charges_Invoiced')" icon="el-icon-s-order" plain>Invoice to
              Customs</el-button>

            <el-button v-hasPermi="['pepco:destination-containers:docs-ready-edit']" type="primary"
                @click="handleDocsReady()" icon="el-icon-s-order" plain>Docs Ready
            </el-button>

            <el-button v-hasPermi="['pepco:destination-shipments:clearance-finished']" type="primary" @click="clickFinish('Customs_Clearance_Finished')" icon="el-icon-s-order" plain>Customs Clearance
              Finish
            </el-button>

            <el-button v-hasPermi="['pepco:destination-containers:arrival-at-dc-date']" :disabled="verifyDeliveryPlanDisable" type="primary" @click="handleArrivalDCImport()" icon="el-icon-s-order" plain>Arrival at DC</el-button>

            <el-button v-hasPermi="['pepco:destination-containers:repair']" type="primary" @click="handleRepairData()" icon="el-icon-s-order" plain>Repair</el-button>
          </div>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table
        border
        :row-class-name="tableRowClassName"
        :height="tableHeight"
        v-loading="loading"
        :data="containerList"
        @select="handleSelection"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template #default="props">
            <container-expand-detail :containerRowData="props.row" :dcNameList="destinationDcNameList"></container-expand-detail>
          </template>
        </el-table-column>
        <el-table-column label="Container Number" align="center" prop="containerNo" min-width="260px" sortable="custom">
          <template slot-scope="scope">
            <div v-if="scope.row._editing">
              <el-input
                v-model="scope.row._newContainerNo"
                size="mini"
                style="width: 180px;"
                :disabled="scope.row._submitting"
                @keyup.enter.native="submitContainerNo(scope.row)"
                @keyup.esc.native="cancelEditContainerNo(scope.row)"
              />
              <i v-if="scope.row._submitting" class="el-icon-loading" style="margin-left:10px;"></i>
              <template v-else>
                <i class="el-icon-check" style="cursor:pointer;color:#67C23A;margin-left:10px;" @click="submitContainerNo(scope.row)"></i>
                <i class="el-icon-close" style="cursor:pointer;color:#F56C6C;margin-left:10px;" @click="cancelEditContainerNo(scope.row)"></i>
              </template>
            </div>
            <div v-else>
              <span style="color:#000;font-weight:900;">{{ scope.row.containerNo }}</span>
              <!-- 权限判断 -->
              <i v-if="$auth.hasPermi('pepco:dest-container:update-container-no:edit')" class="el-icon-edit" style="cursor:pointer;margin-left:10px;" @click="startEditContainerNo(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="LP Number" align="center" prop="lpNumber" min-width="150px" v-if="!this.$auth.hasPermi('pepco:dest-container:column:lp:hide')" />
        <el-table-column label="Container Size" align="center" prop="containerType" min-width="150px" sortable="custom" />
        <el-table-column label="Seal NO" align="center" prop="containerSealNo" min-width="100px" v-if="!this.$auth.hasPermi('pepco:dest-container:column:seal:hide')" />
        <el-table-column label="Carrier" align="center" prop="carrier" min-width="80px" sortable="custom">
          <template slot-scope="scope">{{ scope.row.shipment?.carrier }}</template>
        </el-table-column>
        <el-table-column label="Contract Type" align="center" prop="contractType" min-width="120px" />
        <!-- <el-table-column label="Carrier Booking Number" align="center" prop="carrierBookingNumber" min-width="120px" /> -->
        <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" min-width="120px" sortable="custom" />
        <el-table-column
          label="HBL Number"
          align="center"
          prop="hblNumber"
          min-width="120px"
          sortable="custom"
          v-if="this.$auth.hasPermi('pepco:destination-containers:columns-show') && !this.$auth.hasPermi('pepco:dest-container:column:hbl:hide')"
        >
          <template slot-scope="scope">
            <div style="white-space: pre-line; text-align: center;">{{ scope.row.hblNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Broker" sortable="custom" align="center" min-width="180" prop="brokerDeptName">
          <template v-slot="scope">
            <span>{{ scope.row.brokerDeptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Departing Vessel" align="center" prop="vessel" min-width="200px" sortable="custom" v-if="!this.$auth.hasPermi('pepco:dest-container:column:dep-vessel:hide')">
          <template slot-scope="scope">{{ scope.row.vessel }}</template>
        </el-table-column>
        <el-table-column label="Voyage" align="center" prop="voyage" min-width="100px" sortable="custom" v-if="!this.$auth.hasPermi('pepco:dest-container:column:dep-voyage:hide')">
          <template slot-scope="scope">{{ scope.row.voyage }}</template>
        </el-table-column>
        <el-table-column label="Arrival Vessel" align="center" prop="podVessel" min-width="200px" sortable="custom" v-if="!this.$auth.hasPermi('pepco:dest-container:column:arrival-vessel:hide')">
          <template slot-scope="scope">
            {{ scope.row.containerPodVessel }}
            <i
              v-hasPermi="['pepco:dest-container:c-pod-vessel:edit']"
              @click="openUpdateContainerInfoDialog(scope.row, 'containerPodVessel')"
              style="cursor: pointer;"
              class="el-icon-edit"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="Voyage" align="center" prop="podVoyage" min-width="100px" sortable="custom" v-if="!this.$auth.hasPermi('pepco:dest-container:column:arrival-voyage:hide')">
          <template slot-scope="scope">
            {{ scope.row.containerPodVoyage }}
            <i
              v-hasPermi="['pepco:dest-container:c-pod-voyage:edit']"
              @click="openUpdateContainerInfoDialog(scope.row, 'containerPodVoyage')"
              style="cursor: pointer;"
              class="el-icon-edit"
            ></i>
          </template>
        </el-table-column>
        <!-- <el-table-column label="POR" align="center" prop="por" /> -->
        <el-table-column label="POL" align="center" prop="pol" sortable="custom">
          <template slot-scope="scope">{{ scope.row.shipment?.originPort }}</template>
        </el-table-column>
        <el-table-column label="POD" align="center" prop="pod" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.containerPod }}
            <i v-hasPermi="['pepco:dest-container:c-pod:edit']" @click="openUpdateContainerInfoDialog(scope.row, 'containerPod')" style="cursor: pointer;" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <!-- <el-table-column label="FND" align="center" prop="fnd" /> -->

        <el-table-column label="DC Code" sortable="custom" align="center" min-width="100" prop="dc">
          <template v-slot="scope">{{ scope.row.dc }}</template>
        </el-table-column>
        <el-table-column label="Container DC" align="center" min-width="120" prop="containerDc">
          <template v-slot="scope">{{ getDcName(scope.row.dc) }}</template>
        </el-table-column>
        <!-- <el-table-column label="DC Name" align="center" min-width="120" prop="dc">
          <template v-slot="scope">
            <bsc-destination-dc mode="text" :value="scope.row.dc" />
          </template>
        </el-table-column> -->
        <el-table-column label="Mix DC" align="center" min-width="100">
          <template v-slot="scope">
            <span>{{ scope.row.dc && scope.row.dc.includes(',') ? 'Yes' : 'No' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Docs Ready" align="center" prop="docReadyAction" min-width="140px">
          <template v-slot="scope">
            <span>{{ scope.row.docReadyStatus === 1 ? 'Yes' : scope.row.docReadyStatus === 2 ? 'No' : '' }}</span>
            <i v-hasPermi="['pepco:destination-containers:docs-ready-edit']" class="el-icon-edit"
              style="cursor: pointer; margin-left: 4px;" @click="handleDocsReadyEdit(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="Docs Ready Status" align="center" prop="docReadyStatus" min-width="120px">
          <template v-slot="scope">
            <span :style="{ color: scope.row.docReadyStatus === 1 ? '#67C23A' : scope.row.docReadyStatus === 2 ? '#E6A23C' : '#909399' }">
              {{ scope.row.docReadyStatus === 1 ? 'C' : scope.row.docReadyStatus === 2 ? 'I' : 'N' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Mode of Transport" align="center" min-width="160" prop="transportMode"></el-table-column>
        <el-table-column label="ETD" align="center" prop="etd" sortable="custom">
          <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.etd) }}</template>
        </el-table-column>
        <el-table-column label="ETA" align="center" prop="effectiveEta" sortable="custom" min-width="100px">
          <template v-slot="scope">
            {{ parseUTCTime(getEffectiveEta(scope.row)) }}
            <i
              v-hasPermi="['pepco:dest-container:c-eta:edit']"
              @click="openUpdateContainerInfoDialog(scope.row, 'containerEta')"
              style="cursor: pointer;"
              class="el-icon-edit"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="ATD" align="center" prop="atd" sortable="custom" min-width="100px">
          <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.atd) }}</template>
        </el-table-column>
        <el-table-column label="ATA" align="center" prop="ata" sortable="custom" min-width="100px">
          <template v-slot="scope">
            {{ parseUTCTime(scope.row.containerAta) }}
            <i v-hasPermi="['pepco:dest-container:c-ata:edit']" @click="openUpdateContainerInfoDialog(scope.row, 'containerAta')" style="cursor: pointer;" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="Discharge Date" align="center" prop="dischargeDate" sortable="custom" min-width="120px">
          <template v-slot="scope">{{ parseUTCTime(scope.row.dischargeDate) }}</template>
        </el-table-column>
        <el-table-column label="Planned/Unplanned Status" align="center" prop="planStatus" sortable="custom" min-width="180px">
          <template v-slot="scope">{{ parsePlanStatus(scope.row.planStatus) }}</template>
        </el-table-column>
        <el-table-column label="Unplanned Reason" align="center" prop="unplannedCode" sortable="custom" min-width="200px">
          <template v-slot="scope">{{ parseUnplannedReason(scope.row.unplannedCode) }}</template>
        </el-table-column>
        <el-table-column label="Broker Assign" sortable="custom" align="center" min-width="120" prop="brokerAssign">
          <template v-slot="scope">
            <span v-if="scope.row.brokerAssign" style="color: #67C23A;">{{ 'Y' }}</span>
            <span v-else style="color: #909399;">{{ 'N' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Invoice to Customs" sortable="custom" align="center" min-width="150" prop="invoiceCustoms">
          <template v-slot="scope">
            <span v-if="scope.row.invoiceCustoms === 1" style="color: #67C23A;">C</span>
            <span v-else-if="scope.row.invoiceCustoms === 2" style="color: #E6A23C;">I</span>
            <span v-else style="color: #909399;">N</span>
          </template>
        </el-table-column>

        <el-table-column label="Clearance" sortable="custom" align="center" min-width="120" prop="customsClearanceFinish">
          <template v-slot="scope">
            <span v-if="scope.row.customsClearanceFinish" style="color: #67C23A;">{{ 'Y' }}</span>
            <span v-else style="color: #909399;">{{ 'N' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sanitary Risk" align="center" min-width="120" prop="sanitaryRisk">
          <template v-slot="scope">
            <span v-if="scope.row.sanitaryRisk == 1" style="color: red">{{ 'Y' }}</span>
            <span v-else style="color: green">{{ 'N' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sanitary Required" align="center" min-width="120" prop="sanitary">
          <template v-slot="scope">
            <span v-if="scope.row.sanitary === 'Yes'" style="color: red; cursor: default">{{ 'Yes' }}</span>
            <span v-else-if="scope.row.sanitary === 'Mixed'"
                  style="color: #004F7C; cursor: pointer; text-decoration: underline;"
                  @click="showSanitaryDetail(scope.row.containerNo)">Mixed</span>
            <span v-else style="color: green">{{ 'No' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Doc Verify" align="center" min-width="120">
          <template #default="scope">
            <span>
              {{
              scope.row.documentsVerified === 2 ? 'Yes' :
              scope.row.documentsVerified === 1 ? 'Partially Yes' :
              'No'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" prop="containerStatus" sortable="custom" min-width="160px">
          <template v-slot="scope">{{ parseContainerStatus(scope.row.containerStatus) }}</template>
        </el-table-column>
        <el-table-column label="Action" align="center" prop="latestMovement" fixed="right">
          <template v-slot="scope">
            <span @click="showDestinationMilstones(scope.row)" style="text-decoration: underline;cursor: pointer;">
              View
              Tasks
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="containerQueryParams.pageNo" :limit.sync="containerQueryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-drawer :modal="false" :destroy-on-close="true" :title="destinationMilestonesDrawerTitle" :visible.sync="milestoneDrawerVisible" direction="rtl">
      <destination-milestones-drawer ref="milestoneDrawer" :container-data="containerSelectedRow" :dcNameList="destinationDcNameList" @refresh="milestoneRefresh" />
    </el-drawer>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        accept=".xlsx, .xls, .xml"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :data="{ type: upload.type }"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
        multiple
        :timeout="3000000"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr") }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downloadTemplateData(upload.type)">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <span v-if="permiReady">
          <el-button v-hasPermi="currentPerms" size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
        </span>
        <el-button size="mini" @click="upload.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <milestone-form-dialog
      :destroy-on-close="true"
      v-if="formDialogVisible"
      :visible.sync="formDialogVisible"
      :mode="milestoneFormMode"
      :destinationMilestoneCommand="destinationMilestoneCommand"
      @submit="handleSaveFormData"
    />
    <container-plan-status :destroy-on-close="true" v-if="planStatusFormVisible" :visible.sync="planStatusFormVisible" :containers="selectedRows" :unplannedReasonMap="unplannedReasonMap" @submit="afterSubmitPlanStatus"></container-plan-status>
    <repair-data ref="repairData" @refresh="getList" />

    <el-dialog :title="title" width="600px" :visible.sync="assignBrokerformDialogVisible">
      <el-form :model="form" size="mini">
        <el-form-item required v-if="type === 'Customs_Broker_Assigned'" label="Customer Brokers" label-width="180px">
          <el-select v-model="form.brokerDeptId" @change="handleBrokerChange">
            <el-option v-for="option in brokerList" :key="option.id" :label="option.name" :value="option.id" />
          </el-select>
        </el-form-item>

        <el-form-item required v-if="type === 'Freight_and_Local_Charges_Invoiced'" label="Invoices to customs date" label-width="180px">
          <el-date-picker aria-required v-model="form.invoiceDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item required v-if="type === 'Customs_Clearance_Finished'" label="Submit Date" label-width="180px">
          <el-date-picker aria-required v-model="form.submitDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item required v-if="type === 'Customs_Clearance_Finished'" label="Finish Date" label-width="180px">
          <el-date-picker v-model="form.finishDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="float: left" v-if="type === 'Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="revokeBroker">Revoke</el-button>
        <el-button @click="assignBrokerformDialogVisible = false">Cancel</el-button>
        <el-button v-if="type === 'Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="submitBroker2(10)">Submit</el-button>
        <el-button v-if="type !== 'Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="submitBroker2(20)">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading="loadingSaveFinish" :title="reasonTitle" width="600px" :visible.sync="finshDialog">
      <div class="dialog-content">
        <div class="vertical-radios">
          <el-radio class="complete-radio" v-model="radio" label="1" border @input="finishRadio(true)" size="medium">Complete</el-radio>
          <el-radio class="incomplete-radio" v-model="radio" label="2" border @input="finishRadio(false)" size="medium">
            Not
            Complete
          </el-radio>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Incomplete">Cancel</el-button>
        <el-button type="primary" :loading="loadingSaveFinish" @click="finishComplete">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="reasonTitle" width="600px" :visible.sync="reasonDialog" @close="onReasonDialogClose">
      <el-form :model="form" size="mini" ref="reasonDialogForm">
        <!-- Reason field -->
        <el-form-item prop="reason" v-if="!finishRadioValue" :label="type === 'Freight_and_Local_Charges_Invoiced' ? 'Incomplete Reason' : reasonTitle" align="center" label-width="200px">
          <!--  仅在 Freight_and_Local_Charges_Invoiced 时显示下拉框 -->
          <el-select v-if="type === 'Freight_and_Local_Charges_Invoiced'" v-model="form.reason" placeholder="Select Reason Code" clearable style="width: 100%;">
            <el-option v-for="item in reasonCodeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- ★ 当类型为 'Customs_Clearance_Finished' 时使用 select -->
          <el-select v-else-if="type === 'Customs_Clearance_Finished'" v-model="form.reason" placeholder="Please select reason" style="width: 100%" clearable>
            <el-option v-for="(value, key) in finishReasonMap" :key="key" :label="`${key} - ${value}`" :value="key" />
          </el-select>
          <!-- ★ 其他类型保持原来的 textarea -->
          <el-input v-else placeholder="Reason" type="textarea" show-word-limit maxlength="200" v-model="form.reason" />
        </el-form-item>
        <el-form-item prop="remark" v-if="!finishRadioValue && type === 'Customs_Clearance_Finished'" label="Remark" align="center" label-width="200px">
          <el-input placeholder="Remark" type="textarea" show-word-limit maxlength="200" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item v-if="type === 'Customs_Clearance_Finished' && finishRadioValue" :required="type === 'Customs_Clearance_Finished' && finishRadioValue" prop="submitDate" label="Submit Date" label-width="180px">
          <el-date-picker aria-required v-model="form.submitDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-if="type === 'Customs_Clearance_Finished' && finishRadioValue" :required="type === 'Customs_Clearance_Finished' && finishRadioValue" prop="finishDate" label="Finish Date" label-width="180px">
          <el-date-picker v-model="form.finishDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-if="type === 'Freight_and_Local_Charges_Invoiced' && finishRadioValue" prop="invoiceDate" label="Invoices to customs date" label-width="180px">
          <el-date-picker v-model="form.invoiceDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-if="type === 'Freight_and_Local_Charges_Invoiced' && finishRadioValue" prop="invoiceNumber" label="Invoice Number" label-width="180px">
          <el-input v-model="form.invoiceNumber" />
        </el-form-item>

        <el-form-item v-if="type === 'Freight_and_Local_Charges_Invoiced' && finishRadioValue" prop="comments" label="Comments" label-width="180px">
          <el-input type="textarea" v-model="form.comments" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onReasonDialogClose">Cancel</el-button>
        <el-button v-if="type === 'Customs_Clearance_Finished'" type="primary" :loading="loadingSaveBut" @click="submitFinishReason">Submit</el-button>
        <el-button v-if="type === 'Freight_and_Local_Charges_Invoiced'" type="primary" :loading="loadingSaveBut" @click="submitInvoiceReason">Submit</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="uploadInvoice.title" :visible.sync="uploadInvoice.open" width="400px" append-to-body>
      <!-- <el-radio-group v-model="uploadInvoice.completeStatus" style="margin-bottom: 10px;">
        <el-radio label="Complete">Complete</el-radio>
        <el-radio label="Not Complete">Not Complete</el-radio>
      </el-radio-group>-->

      <el-upload
        ref="uploadInvoice"
        accept=".xlsx, .xls, .xml"
        :headers="uploadInvoice.headers"
        :disabled="uploadInvoice.isUploading"
        v-loading="uploadInvoice.isUploading"
        :on-progress="handleFileInvoiceUploadProgress"
        :on-success="handleInvoiceFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        :action="uploadInvoice.url"
        drag
        multiple
        :timeout="3000000"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr") }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downloadingInvoiceTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="uploadInvoice.isUploading" @click="submitInvoiceFileForm">
          {{
          $t("purchaseOrder.confirm") }}
        </el-button>
        <el-button size="mini" @click="uploadInvoice.open = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      </div>
    </el-dialog>

    <doc-ready-dialog  v-model="docReadyDialogVisible" :row-data="docReadyCurrentRow" :selected-ids="selectIds"
      @submit="handleDocReadySubmit" />

    <update-container-info ref="updateContainerInfoDialogRef" @after-submit="afterSubmitUpdateContainerInfo" />

    <!-- Sanitary Required Mixed 详情弹窗 -->
    <el-dialog title="Sanitary Required" :visible.sync="sanitaryDetailDialogVisible" width="500px" append-to-body>
      <div >
        <span>Container Number </span>
        <p style="margin: 12px 0; color: black; font-weight: bold;">{{ currentContainerNo }}</p>
      </div>
      <div style="margin-bottom: 12px;">
        <span >
          Detail
        </span>
      </div>
      <el-table :data="sanitaryDetailList" border>
        <el-table-column prop="hblNumber" label="HBL Number" align="center" min-width="180"></el-table-column>
        <el-table-column prop="sanitaryRequired" label="Sanitary Required" align="center" width="140">
          <template v-slot="scope">
            <span v-if="scope.row.sanitaryRequired === 'Yes'" style="color: red">{{ 'Yes' }}</span>
            <span v-else style="color: green">{{ 'No' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sanitaryDetailDialogVisible = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
/* 高亮日期半透明 */
.pre-planned-picker-popper .el-date-table td.highlight-date span {
  background-color: #409eff !important;
  color: #fff !important;
  opacity: 0.5;
  /* 半透明 */
  border-radius: 50%;
}

/* 选中日期覆盖高亮 */
.pre-planned-picker-popper .el-date-table td.current span,
.pre-planned-picker-popper .el-date-table td.active span {
  background-color: #409eff !important;
  /* 选中颜色 */
  color: #fff !important;
  opacity: 1;
  /* 不透明 */
}
</style>
<style scoped>
.icon-image {
  width: 50px;
  /* 设置图片宽度 */
  height: 50px;
  /* 设置图片高度 */
}
</style>

<script>
import {
  containerRevokeBroker,
  containerSubmitBroker,
  exportArrivalAtDC,
  exportContainerBroker,
  exportContainerDeliveryPlan,
  exportContainerDeliveryPrePlan,
  exportContainerInvoiceTemplate,
  exportDestinationContainer,
  getBrokerDataList,
  getCarrierList,
  getContractTypeList,
  getDestinationContainerOverviewStatistics,
  getDestinationContainerPage,
  getDestinationContainerQueryDateFilter,
  getDestinationContainerQueryFilter,
  getDestinationUnplannedReasonList,
  getDictData,
  getListArrivalDcByContainerIds,
  getMilestonesEnumListByType,
  handleMilestone,
  submitDate,
  verifyDestinationContainerFinish,
  verifyDestinationShipping,
  destinationSystemPodList,
  updateContainerNo,
  destinationSystemVesselList,
  getDestinationDcList,
  updateContainerDocsReady,
  getHblSanitaryDetail
} from '@/api/destination/destination'
import { getTaskSettingPage } from '@/api/system/taskSetting'
import { getBaseHeader } from '@/utils/request'
import ContainerPlanStatus from '@/views/destination/shipped-container/component/dialog/container-plan-status.vue'
import updateContainerInfo from '@/views/destination/shipped-container/component/dialog/update-container-info.vue'
import MilestoneFormDialog from '@/views/destination/shipped-container/component/form/milestone-form-dialog.vue'
import DocReadyDialog from '@/views/destination/shipped-container/component/dialog/doc-ready-dialog.vue'
import RepairData from '@/views/destination/shipped-container/component/repair/index.vue'
import { IconPark } from '@icon-park/vue/es/all'
import '@icon-park/vue/styles/index.css'
import DestinationMilestonesDrawer from './component/drawer/destination-milestones-drawer.vue'
import ContainerExpandDetail from './detail/index.vue'
import BscDestinationDc from '@/views/destination/component/bsc-destination-dc/index.vue'
export default {
  name: 'pepco-shipped-container',
  components: {
    IconPark,
    ContainerExpandDetail,
    DestinationMilestonesDrawer,
    MilestoneFormDialog,
    ContainerPlanStatus,
    updateContainerInfo,
    DocReadyDialog,
    RepairData,
    BscDestinationDc
  },
  mounted() {
    // 添加鼠标滚轮横向滚动功能
    const container = document.querySelector('.card-box-container-dest-01')
    if (container) {
      container.addEventListener('wheel', this.handleWheelScroll)
    }
  },

  beforeDestroy() {
    // 移除事件监听器
    const container = document.querySelector('.card-box-container-dest-01')
    if (container) {
      container.removeEventListener('wheel', this.handleWheelScroll)
    }
  },
  data() {
    return {
      downloadOrderLoading: false,
      pickerOptions: {
        defaultTime: ['00:00:00', '23:59:59']
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showContainerSearch: true,
      tableHeight: 0,
      // 总条数
      total: 0,
      // container list
      containerList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      // form: {},
      // 表单校验
      rules: {},
      deliveryPlanExportLoading: false,

      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        //上传弹窗
        uploadOpen: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 类型：1- pre plan 2- plan 3- arrival at dc
        type: 1,
        // 上传的地址
        url: null
      },
      // 查询参数
      containerQueryParams: {
        pageNo: 1,
        pageSize: 20,
        orderBy: null,
        orderDirection: null,
        source: null,
        customer: null,
        skuId: null,
        skuName: null,
        warehouse: null,
        categoryCode: null,
        deliveryPrePlan: null,
        brokerAssign: null,
        invoiceCustoms: null,
        invoiceCustomsList: [],
        customsClearanceFinish: null,
        deliveryPlan: null,
        arrivalDc: null,
        vesselArrival: null,
        containerDischarged: null,
        emptyContainerRe: null,
        taskType: null,
        taskCode: null,
        containerNo: null,
        hblNumber: null,
        mblNumber: null,
        pendingTaskCode: null,
        pol: null,
        polList: [],
        pod: [],
        vessel: [],
        podVessel: [],
        voyage: null,
        voyageList: [],
        etaDateRange: [],
        dc: null,
        dcList: [],
        podVoyage: null,
        podVoyageList: [],
        deliveryPlanType: [],
        prePlannedDate: [],
        plannedDate: [],
        inDcDate: [],
        prePlannedDateMode: null,
        plannedDateMode: null,
        inDcDateMode: null,
        prePlannedDateStart: null,
        prePlannedDateEnd: null,
        plannedDateStart: null,
        plannedDateEnd: null,
        inDcDateStart: null,
        inDcDateEnd: null,
        carrier: null,
        carrierList: [],
        contractType: null,
        contractTypeList: [],
        lpNumber: null,
        orderRef: null,
        brokerDeptName: null,
        sanitaryRisk: null,
        sanitary: null,
        brokerDeptNameList: [],
        mixDc: null,
        originCountry: [],
        documentsVerified: null,
        prePlanCanceled: null,
        planCanceled: null,
        planStatus: [],
        prePlanStatus: [],
        docReadyStatus: null,
      },
      uploadInvoice: {
        open: false,
        title: '',
        headers: getBaseHeader(),
        isUploading: false,
        type: null,
        updateSupport: 0,
        url: null // 设置上传地址
        // completeStatus: 'Complete' // 默认值
      },
      // container overview statistics
      containerOverviewStatus: {
        containerCount: 0,
        deliveryPrePlanPendingPossibleCount: 0,
        deliveryPrePlanPendingUrgentCount: 0,
        deliveryPrePlanPendingOverdueCount: 0,
        deliveryPrePlanDoneCount: 0,

        brokerAssignPendingPossibleCount: 0,
        brokerAssignPendingUrgentCount: 0,
        brokerAssignPendingOverdueCount: 0,
        brokerAssignDoneCount: 0,

        deliveryPlanPendingPossibleCount: 0,
        deliveryPlanPendingUrgentCount: 0,
        deliveryPlanPendingOverdueCount: 0,
        deliveryPlanDoneCount: 0,

        invoiceCustomsPendingPossibleCount: 0,
        invoiceCustomsPendingUrgentCount: 0,
        invoiceCustomsPendingOverdueCount: 0,
        invoiceCustomsDoneCount: 0,

        customsClearanceFinishPendingPossibleCount: 0,
        customsClearanceFinishPendingUrgentCount: 0,
        customsClearanceFinishPendingOverdueCount: 0,
        customsClearanceFinishDoneCount: 0,

        arrivalAtDcPendingPossibleCount: 0,
        arrivalAtDcPendingUrgentCount: 0,
        arrivalAtDcPendingOverdueCount: 0,
        arrivalAtDcDoneCount: 0,
        emptyContainerRePendingPossibleCount: 0,
        emptyContainerRePendingUrgentCount: 0,
        emptyContainerRePendingOverdueCount: 0,
        emptyContainerReDoneCount: 0,
        containerDischargedPendingPossibleCount: 0,
        containerDischargedPendingUrgentCount: 0,
        containerDischargedPendingOverdueCount: 0,
        containerDischargedDoneCount: 0,
        vesselArrivalPendingPossibleCount: 0,
        vesselArrivalPendingUrgentCount: 0,
        vesselArrivalPendingOverdueCount: 0,
        vesselArrivalDoneCount: 0
      },
      milestoneDrawerVisible: false,
      destinationMilestonesDrawerTitle: '',
      containerSelectedRow: null,
      docReadyDialogVisible: false, //doc ready dialog
      docReadyCurrentRow: null ,  // null = 批量，Object = 单行
      // Sanitary Required Mixed 弹窗相关
      sanitaryDetailDialogVisible: false,
      currentContainerNo: '',
      sanitaryDetailList: [],
      filterPopover: false,
      dc: ['0006', '0015', '0018', '0021', '0027'],
      deliveryPlanStatus: [
        {
          label: 'Delivery Pre Plan',
          value: '1'
        },
        {
          label: 'Delivery Pre Planned',
          value: '2'
        },
        {
          label: 'Delivery Plan',
          value: '3'
        },
        {
          label: 'Delivery Planned',
          value: '4'
        }
      ],
      pendingTaskList: [],
      verifyDeliveryPlanDisable: false,
      verifyDisable: false,
      selectIds: [],
      selectedRows: [],
      formDialogVisible: false,
      assignBrokerformDialogVisible: false,
      formData: null,
      taskCode: null,
      type: null,
      milestoneFormMode: 'edit',
      destinationMilestoneCommand: {
        id: null,
        formData: '[]'
      },
      containerQueryFilerList: {
        dcList: [],
        podList: [],
        vesselList: [],
        voyageList: [],
        polList: [],
        brokerList: [],
        originCountryList: []
      },
      containerUpdateSelectList: {
        podList: [],
        podVesselList: []
      },
      containerQueryDateFilerList: {
        prePlannedDateList: [],
        plannedDateList: [],
        indcDateList: []
      },
      carrierList: [],
      contractTypeList: [],
      currentPerms: [],
      permiReady: false,
      unplannedReasonMap: {},
      planStatusFormVisible: false,
      form: {
        brokerDeptId: null
      },
      // brokers: [],
      brokerList: [],
      loadingSaveBut: false,
      finishRadioValue: true,
      finshDialog: false,
      reasonTitle: '',
      reasonDialog: false,
      loadingSaveFinish: false,
      radio: '1',
      loadingSaveVerify: false,
      verifyDialog: false,
      brokerFilterList: [],
      reasonCodeList: [],
      finishReasonMap: {},
      destinationDcNameList: []
    }
  },
  watch: {
    'upload.type': {
      immediate: true,
      handler(newType) {
        //getImportPermi 返回权限数组
        this.permiReady = false
        this.currentPerms = this.getImportPermi(newType)
        this.$nextTick(() => {
          this.permiReady = true // 再重新渲染，触发指令重新绑定
        })
        console.log('upload.type', this.currentPerms)
      }
    }
  },
  computed: {
    hasFilter() {
      return this.containerQueryParams.dc
    },
    // Pre-Planned Date 选择器配置
    prePlannedPickerOptions() {
      return {
        cellClassName: date => {
          const dateStr = this.formatDate(date)
          return this.containerQueryDateFilerList.prePlannedDateList.includes(dateStr) ? 'highlight-date' : ''
        }
      }
    },
    // Planned Date 选择器配置
    plannedPickerOptions() {
      return {
        cellClassName: date => {
          const dateStr = this.formatDate(date)
          return this.containerQueryDateFilerList.plannedDateList.includes(dateStr) ? 'highlight-date' : ''
        }
      }
    },
    // In DC Date 选择器配置
    inDcPickerOptions() {
      return {
        cellClassName: date => {
          const dateStr = this.formatDate(date)
          return this.containerQueryDateFilerList.indcDateList.includes(dateStr) ? 'highlight-date' : ''
        }
      }
    }
  },
  async created() {
    if (this.$route.query.taskRow && this.$route.query.taskType) {
      const row = JSON.parse(this.$route.query.taskRow)
      console.log('row------------', row)
      this.containerQueryParams.taskType = this.$route.query.taskType
      this.containerQueryParams.taskCode = row.taskCode
      console.log('this.$route.query.queryParams', this.$route.query.queryParams)
      if (this.$route.query.queryParams) {
        const overviewqueryParams = JSON.parse(this.$route.query.queryParams)
        console.log('overviewqueryParams', overviewqueryParams)
        this.containerQueryParams.containerNo = overviewqueryParams.containerNo
        this.containerQueryParams.carrierBookingNumber = overviewqueryParams.carrierBookingNumber
        this.containerQueryParams.dcList = overviewqueryParams.dcList
      }
      if (row.taskCode === 'Delivery_Pre_Plan_to_MOOV') {
        this.containerQueryParams.deliveryPrePlan = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Delivery_Plan') {
        this.containerQueryParams.deliveryPlan = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Arrival_at_DC_in_DC_date') {
        this.containerQueryParams.arrivalDc = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Customs_Broker_Assigned') {
        this.containerQueryParams.brokerAssign = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Freight_and_Local_Charges_Invoiced') {
        this.containerQueryParams.invoiceCustomsList = this.$route.query.taskType === 'finished' ? [1] : [0, 2]
      } else if (row.taskCode === 'Customs_Clearance_Finished') {
        this.containerQueryParams.customsClearanceFinish = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Container_Discharged') {
        this.containerQueryParams.containerDischarged = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Vessel_Arrival') {
        this.containerQueryParams.vesselArrival = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Empty_Container_Returned') {
        this.containerQueryParams.emptyContainerRe = this.$route.query.taskType === 'finished'
      }
    } else {
      this.containerQueryParams.brokerAssign = null
      this.containerQueryParams.invoiceCustomsList = []
      this.containerQueryParams.customsClearanceFinish = null
      this.containerQueryParams.deliveryPrePlan = null
      this.containerQueryParams.deliveryPlan = null
      this.containerQueryParams.arrivalDc = null
      this.containerQueryParams.containerDischarged = null
      this.containerQueryParams.vesselArrival = null
      this.containerQueryParams.emptyContainerRe = null
      this.containerQueryParams.taskType = null
      this.containerQueryParams.taskCode = null
      this.containerQueryParams.containerNo = null
      this.containerQueryParams.carrierBookingNumber = null
      this.containerQueryParams.dcList = []
    }
    // 计算表格高度
    this.calcTableHeight()
    // 获取页面常用数据
    await this.getCommonData()
    // 获取筛选条件下拉数据
    await this.getDestinationContainerQueryFilterList()

    await this.getDestinationContainerDateQueryFilterList()

    await this.getContainerUpdateSelectList()
    // 获取列表
    await this.getList()
    //
    await this.getBrokerList()
  },
  methods: {
    finishComplete(value) {
      console.log('this.type:', this.type)
      this.title = 'Customs clearance finished'
      console.log('taskcode', this.taskCode)
      this.reasonDialog = true
      console.log('finishComplete value:', value)
    },
    Incomplete() {
      console.log('cancel')
      this.verifyDialog = false
      this.finshDialog = false
    },
    Complete() {
      if (this.radio === '1') {
        this.submitComplete()
      } else {
        if (this.type === 'Customs_Clearance_Finished') {
          this.submitFinishReason()
        } else if (this.type === 'Document_Verification_Complete') {
        } else {
          console.error(`unknow the type: ${this.type}`)
        }
      }
    },
    submitComplete() {
      this.loadingSaveVerify = true
      console.log('同意:', this.selectIds)
      const formData = JSON.parse(this.formData)
      const data = {
        taskCode: 'Document_Verification_Complete',
        ids: this.selectIds,
        completeValue: '1',
        sanitaryValue: this.sanitaryValue
      }
      ;(formData[0].value = '1'), (formData[0].status = 'Complete')
      data.formData = JSON.stringify(formData)
      verifyDestinationShipping(data).then(response => {
        if (response.code != null || response.code == 0) {
          this.$message({
            type: 'success',
            message: 'Verify Success'
          })
          // this.queryParams.pendingTaskValue = null
          this.getList()
        }
        this.loadingSaveVerify = false
      })
      this.verifyDialog = false
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async finishRadio(value) {
      console.log('finishRadio value:', value)
      // 如果是true  跳出日期选择框
      this.form = {}
      if (this.selectIds.length < 1) {
        this.$message({
          type: 'warning',
          message: 'Please select at least one record.'
        })
        return
      }
      if (this.$refs.reasonDialogForm) {
        this.$refs.reasonDialogForm.resetFields()
      }
      //获取system_task_setting中的form_template
      this.title = this.taskCode
      console.log('taskCode1111:', this.taskCode)
      this.finishRadioValue = value
      this.reasonDialog = true
      // 如果是false 弹出输入框
    },
    // 提交invoice
    submitInvoiceReason() {
      console.log('提交选择的id:', this.selectIds)
      console.log('提交选择的taskCode:', this.taskCode)
      console.log('提交选择的finishRadioValue:', this.finishRadioValue)
      //提交
      console.log('this.form:', this.form)
      if (this.taskCode === 'Freight_and_Local_Charges_Invoiced' && this.finishRadioValue) {
        if (this.form.invoiceDate === undefined || this.form.invoiceDate === null || this.form.invoiceDate === '') {
          console.log('this.form.invoiceDate:', this.form.invoiceDate)
          this.$message({
            type: 'warning',
            message: 'Please select a Date'
          })
          this.loadingSaveBut = false
          return
        }
      }
      if (!this.finishRadioValue && (!this.form.reason || this.form.reason.trim() === '')) {
        this.$message({
          type: 'warning',
          message: 'Please fill in the reason'
        })
        return
      }
      console.log('选择的id:', this.selectIds)
      console.log('选择的reason:', this.form)
      console.log('选择的reason1:', this.formData)
      this.loadingSaveBut = true

      const formData = JSON.parse(this.formData)
      const data = {
        ids: this.selectIds,
        taskCode: this.taskCode,
        invoiced: this.finishRadioValue
      }
      formData[0].value = this.form.reason
      formData[0].invoiceDate = this.form.invoiceDate
      formData[0].status = this.finishRadioValue ? 'Complete' : 'Incomplete'
      formData[0].invoiceNumber = this.form.invoiceNumber
      formData[0].comments = this.form.comments
      data.formData = JSON.stringify(formData)
      console.log('verifyData', data)
      this.$refs['reasonDialogForm'].validate(valid => {
        if (valid) {
          verifyDestinationContainerFinish(data).then(response => {
            if (response.code != null || response.code == 0) {
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              this.reasonDialog = false
              this.finshDialog = false
              this.finishRadioValue = true
              this.loadingSaveBut = false
              this.form = {}
              this.getList()
            }
          })
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.reasonDialog = true
        }
      })
      this.loadingSaveBut = false
    },
    submitFinishReason() {
      console.log('提交选择的id:', this.selectIds)
      console.log('提交选择的taskCode:', this.taskCode)
      console.log('提交选择的finishRadioValue:', this.finishRadioValue)
      console.log('this.form:', this.form)
      //提交
      if (this.taskCode === 'Customs_Clearance_Finished' && this.finishRadioValue) {
        if (!this.form.submitDate || !this.form.finishDate) {
          this.$message({
            type: 'warning',
            message: 'Please select a Date'
          })
          this.loadingSaveBut = false
          return
        }
      }
      if (this.taskCode === 'Customs_Clearance_Finished' && !this.finishRadioValue) {
        if (!this.form.reason || this.form.reason === '' || this.form.reason === null) {
          this.$message({
            type: 'warning',
            message: 'Please fill in the reason'
          })
          return
        }
      }
      this.loadingSaveBut = true
      console.log('选择的id:', this.selectIds)
      console.log('选择的reason:', this.form)
      console.log('选择的reason1:', this.formData)
      const formData = JSON.parse(this.formData)
      const data = {
        ids: this.selectIds,
        taskCode: this.taskCode,
        finished: this.finishRadioValue
      }
      formData[0].value = this.form.reason
      formData[0].remark = this.form.remark
      formData[0].submitDate = this.form.submitDate
      formData[0].finishDate = this.form.finishDate
      formData[0].status = this.finishRadioValue ? 'Complete' : 'Incomplete'
      data.formData = JSON.stringify(formData)
      this.$refs['reasonDialogForm'].validate(valid => {
        if (valid) {
          verifyDestinationContainerFinish(data).then(response => {
            if (response.code != null || response.code == 0) {
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              this.reasonDialog = false
              this.finshDialog = false
              this.finishRadioValue = true
              this.loadingSaveBut = false
              this.form = {}
              this.getList()
            }
          })
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.selectRadio('2')
        }
      })
      this.loadingSaveBut = false
    },
    onReasonDialogClose() {
      if (this.$refs.reasonDialogForm) {
        this.$refs.reasonDialogForm.resetFields()
        this.$nextTick(() => {
          this.$refs.reasonDialogForm.clearValidate()
        })
      }
      this.reasonDialog = false
    },
    async selectRadio(value) {
      console.log('Selected radio value:', value)
      if (value == '2') {
        console.log('获取任务设置成功:', this.formData)
        this.reasonDialog = true
        this.finishRadioValue = false
        this.reasonTitle = 'Verify Documents'
        console.log('this.formData11:', this.selectIds)
      } else {
        console.log('同意:', this.selectIds)
      }
    },
    onPrePlannedDateModeChange(value) {
      if (value === 'blank') {
        this.containerQueryParams.prePlannedDate = []
        this.containerQueryParams.prePlannedDateStart = null
        this.containerQueryParams.prePlannedDateEnd = null
      }
    },
    onPlannedDateModeChange(value) {
      if (value === 'blank') {
        this.containerQueryParams.plannedDate = []
        this.containerQueryParams.plannedDateStart = null
        this.containerQueryParams.plannedDateEnd = null
      }
    },
    onInDcDateModeChange(value) {
      // console.log('onInDcDateModeChange:', value)
      if (value === 'blank') {
        this.containerQueryParams.inDcDate = []
        this.containerQueryParams.inDcDateStart = null
        this.containerQueryParams.inDcDateEnd = null
      }
    },
    async assignBroker(taskCode) {
      this.form = {}
      if (this.selectIds.length == 0) {
        this.handleBrokerImport()
        this.assignBrokerformDialogVisible = false
      } else {
        console.log('assignBroker taskCode:', taskCode)

        //获取system_task_setting中的form_template
        await getTaskSettingPage({
          pageNo: 1,
          pageSize: 10,
          taskCode: taskCode
        })
          .then(response => {
            if (response.data.list.length > 0) {
              console.log('获取任务设置成功:', response.data.list)
              this.$set(this, 'formData', response.data.list[0].formTemplate)
              this.$set(this, 'taskCode', response.data.list[0].taskCode)
              this.$set(this, 'type', response.data.list[0].taskCode)
            }
          })
          .catch(error => {
            console.error('获取任务设置失败:', error)
          })
        this.title = 'Customs broker assign'
        const selectedBroker = this.selectedRows.find(item => item.brokerDeptId)
        console.log('selectedBroker:', selectedBroker)
        if (selectedBroker) {
          this.form.brokerDeptId = selectedBroker.brokerDeptId || ''
        }
        console.log('taskCode1111:', this.taskCode)
        this.assignBrokerformDialogVisible = true
      }
    },
    handleBrokerChange(val) {
      console.log('handleBrokerChange:', val)
      // this.form.brokerDeptId = val
      // 直接赋值即可
      this.form.brokerDeptId = val
      // 触发表单验证
      console.log('form.brokerDeptId:', this.form.brokerDeptId)
      const broker = this.brokerList.find(broker => broker.id === val)
      console.log('selected broker:', broker)
      this.$nextTick(() => {
        this.$forceUpdate() // 强制组件刷新
      })
    },
    revokeBroker() {
      this.loadingSaveBut = true
      // 给出确认按钮，是否进行操作

      this.$confirm('Are you sure you want to revoke the broker assignment?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          // 确认操作
          const data = {
            shippingIds: this.selectIds
          }
          containerRevokeBroker(this.selectIds)
            .then(response => {
              if (response.code === 0) {
                console.log('Revoke broker response:', response)
                this.$message({
                  type: 'success',
                  message: 'Broker assignment revoked successfully!'
                })
                this.assignBrokerformDialogVisible = false
                this.loadingSaveBut = false
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: 'Failed to revoke broker assignment.'
                })
              }
            })
            .catch(error => {
              this.loadingSaveBut = false
              console.error('revoke error:', error)
              this.$message({
                type: 'error',
                message: 'Failed to revoke broker assignment.'
              })
            })
        })
        .catch(() => {
          // 取消操作
          this.loadingSaveBut = false
          this.assignBrokerformDialogVisible = false
        })
    },
    submitBroker2(number) {
      this.loadingSaveBut = true
      console.log('selectIds:', this.selectIds)
      if (this.selectIds.length < 1) {
        this.$message({
          type: 'warning',
          message: 'Please select at least one record'
        })
        return
      }
      if (this.taskCode === 'Customs_Broker_Assigned' && (this.form.brokerDeptId == null || this.form.brokerDeptId === '')) {
        this.$message({
          type: 'warning',
          message: 'Please select a broker'
        })
        return
      }
      if (this.taskCode === 'Freight_and_Local_Charges_Invoiced' && (this.form.invoiceDate == null || this.form.invoiceDate === '')) {
        this.$message({
          type: 'warning',
          message: 'Please select a Date'
        })
        return
      }
      if (this.taskCode === 'Customs_Clearance_Finished' && (this.form.submitDate == null || this.form.finishDate === null)) {
        this.$message({
          type: 'warning',
          message: 'Please select a Date'
        })
        return
      }
      console.log('taskCode:', this.taskCode)
      console.log('formData:', this.formData)
      const formData = JSON.parse(this.formData)
      const data = {
        destinationContainerIds: this.selectIds,
        taskCode: this.taskCode
      }
      if (this.taskCode === 'Customs_Broker_Assigned') {
        const broker = this.brokerList.find(v => v.id === this.form.brokerDeptId)
        console.log('broker:', broker)
        // 将formData转换成JSON字符串
        // 将formData 解析，把value值改成broker.brokerCode
        formData[0].value = broker.id
        formData[0].status = 'Assigned'
        console.log('解析后formData:', formData)
        data.brokerCode = broker.name
        data.brokerDeptId = this.form.brokerDeptId
        data.formData = JSON.stringify(formData)
      } else if (this.taskCode === 'Freight_and_Local_Charges_Invoiced') {
        console.log('解析后formData:', formData)
        console.log('选择的日期:', this.form.invoiceDate)
        formData[0].value = this.form.invoiceDate
        formData[0].invoiceDate = this.form.invoiceDate
        console.log('赋值后的fromData:', formData)
        data.formData = JSON.stringify(formData)
        console.log('invoiceDate:', data)
      } else {
        console.log('解析后formData:', formData)
        formData[0].value = this.form.submitDate
        formData[0].submitDate = this.form.submitDate
        formData[0].finishDate = this.form.finishDate
        data.formData = JSON.stringify(formData)
        console.log('dateSubmitData:', data)
        console.log('number111:', number)
      }
      // 提交broker
      if (number === 10) {
        containerSubmitBroker(data)
          .then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: 'Broker assigned successfully!'
              })
              this.assignBrokerformDialogVisible = false
              this.loadingSaveBut = false
              this.getList()
              this.form.brokerDeptId = null
            } else {
              this.$message({
                type: 'error',
                message: 'Failed to assign broker.'
              })
            }
          })
          .catch(error => {
            console.error('submit error:', error)
            this.$message({
              type: 'error',
              message: 'Failed to assign broker.'
            })
          })
      } else {
        console.log('dateSubmitData:', data)
        submitDate(data)
          .then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: ' submitted successfully!'
              })
              this.assignBrokerformDialogVisible = false
              this.loadingSaveBut = false
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: 'Failed to submit date.'
              })
            }
          })
          .catch(error => {
            console.error('submit error:', error)
            this.$message({
              type: 'error',
              message: 'Failed to submit date.'
            })
          })
      }
    },
    getBrokerList() {
      getBrokerDataList()
        .then(response => {
          console.log('获取11brokerList:', response.data)
          // this.$set(this, 'brokerList', response.data)
          this.brokerList = response.data.map(item => ({
            ...item,
            id: String(item.id)
          }))
          console.log('获取11brokerList12:', this.brokerList)
        })
        .catch(error => {
          console.error('get brokers:', error)
        })
    },
    // invoice
    async clickInvoice(value) {
      if (this.selectIds.length < 1) {
        //   this.$message({
        //     type: 'warning',
        //     message: 'Please select at least one record'
        //   })
        //   return
        // }
        //zane  上传模板
        this.uploadInvoice.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/import-Container-invoice'
        this.uploadInvoice.type = 22
        this.uploadInvoice.open = true
        this.uploadInvoice.title = 'Import Invoice To Customs'
      } else {
        this.finishRadioValue = true
        this.radio = '1'
        await getTaskSettingPage({
          pageNo: 1,
          pageSize: 10,
          taskCode: 'Freight_and_Local_Charges_Invoiced'
        })
          .then(response => {
            if (response.data.list.length > 0) {
              console.log('获取任务设置成功:', response.data.list)
              this.$set(this, 'formData', response.data.list[0].formTemplate)
              this.$set(this, 'taskCode', response.data.list[0].taskCode)
              this.$set(this, 'type', response.data.list[0].taskCode)
            }
          })
          .catch(error => {
            console.error('获取任务设置失败:', error)
          })
        this.reasonTitle = 'Invoice to Customs'
        this.finshDialog = true
      }
    },
    async clickFinish(value) {
      if (this.selectIds.length < 1) {
        this.$message({
          type: 'warning',
          message: 'Please select at least one record'
        })
        return
      }
      this.finishRadioValue = true
      this.radio = '1'
      await getTaskSettingPage({
        pageNo: 1,
        pageSize: 10,
        taskCode: 'Customs_Clearance_Finished'
      })
        .then(response => {
          if (response.data.list.length > 0) {
            console.log('获取任务设置成功:', response.data.list)
            this.$set(this, 'formData', response.data.list[0].formTemplate)
            this.$set(this, 'taskCode', response.data.list[0].taskCode)
            this.$set(this, 'type', response.data.list[0].taskCode)
          }
        })
        .catch(error => {
          console.error('获取任务设置失败:', error)
        })
      this.reasonTitle = 'Customs Clearance Finish '
      this.finshDialog = true
    },
    // 处理鼠标滚轮横向滚动
    handleWheelScroll(e) {
      e.preventDefault()
      const container = document.querySelector('.card-box-container-dest-01')
      container.scrollLeft += e.deltaY
    },
    milestoneRefresh(val) {
      this.getList()
    },
    handleSortChange({ column, prop, order }) {
      // 根据当前排序条件发送请求到后台获取排序结果
      if (order != null) {
        order = order === 'ascending' ? 'ASC' : 'DESC'
        this.containerQueryParams.orderBy = column.property.replace(/([A-Z])/g, '_$1').toLowerCase()
        this.containerQueryParams.orderDirection = order
      } else {
        this.containerQueryParams.orderBy = ''
        this.containerQueryParams.orderDirection = ''
      }
      this.getList()
    },
    getImportPermi(type) {
      if (type == 1) {
        return ['pepco:destination:delivery-pre-plan:edit']
      } else if (type == 2) {
        return ['pepco:destination:delivery-plan:edit']
      } else if (type == 3) {
        return ['pepco:destination:arrival-at-dc-date:edit']
      }
    },
    handReportChange(status, taskType) {
      if (null == status) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 0) {
        this.containerQueryParams.taskCode = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
      } else if (status == 1) {
        this.containerQueryParams.deliveryPrePlan = false
        this.containerQueryParams.taskCode = 'Delivery_Pre_Plan_to_MOOV'
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 2) {
        this.containerQueryParams.deliveryPrePlan = true
        this.containerQueryParams.taskCode = 'Delivery_Pre_Plan_to_MOOV'
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 3) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = false
        this.containerQueryParams.taskCode = 'Delivery_Plan'
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 4) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = true
        this.containerQueryParams.taskCode = 'Delivery_Plan'
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 5) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = false
        this.containerQueryParams.taskCode = 'Arrival_at_DC_in_DC_date'
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        // this.containerQueryParams.pendingTaskCode = 'Arrival_at_DC_in_DC_date'
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 6) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = true
        this.containerQueryParams.taskCode = 'Arrival_at_DC_in_DC_date'
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
        this.containerQueryParams.customsClearanceFinish = null
      } else if (status == 7) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = false
        this.containerQueryParams.taskCode = 'Customs_Broker_Assigned'
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 8) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = true
        this.containerQueryParams.taskCode = 'Customs_Broker_Assigned'
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 9) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = [0, 2]
        this.containerQueryParams.taskCode = 'Freight_and_Local_Charges_Invoiced'
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 10) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = [1]
        this.containerQueryParams.taskCode = 'Freight_and_Local_Charges_Invoiced'
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 11) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = false
        this.containerQueryParams.taskCode = 'Customs_Clearance_Finished'
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 12) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = true
        this.containerQueryParams.taskCode = 'Customs_Clearance_Finished'
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.emptyContainerRe = null
      } else if (status == 107) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = false
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.emptyContainerRe = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Vessel_Arrival'
      } else if (status == 108) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.containerDischarged = false
        this.containerQueryParams.emptyContainerRe = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Container_Discharged'
      } else if (status == 109) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.emptyContainerRe = false
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Empty_Container_Returned'
      } else if (status == 110) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = true
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.emptyContainerRe = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Vessel_Arrival'
      } else if (status == 111) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.containerDischarged = true
        this.containerQueryParams.emptyContainerRe = null
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Container_Discharged'
      } else if (status == 112) {
        this.containerQueryParams.deliveryPrePlan = null
        this.containerQueryParams.deliveryPlan = null
        this.containerQueryParams.arrivalDc = null
        this.containerQueryParams.vesselArrival = null
        this.containerQueryParams.containerDischarged = null
        this.containerQueryParams.emptyContainerRe = true
        this.containerQueryParams.brokerAssign = null
        this.containerQueryParams.invoiceCustomsList = []
        this.containerQueryParams.customsClearanceFinish = null
        this.containerQueryParams.taskCode = 'Empty_Container_Returned'
      }

      this.containerQueryParams.taskType = taskType
      this.getList()
    },
    getDestinationContainerQueryFilterList() {
      getCarrierList()
        .then(response => {
          this.carrierList = response.data
        })
        .catch(error => {
          console.error(error)
        })
      getContractTypeList()
        .then(response => {
          this.contractTypeList = response.data
        })
        .catch(error => {
          console.error(error)
        })
      return getDestinationContainerQueryFilter()
        .then(response => {
          if (response.data.podVesselList) {
            const podVesselList = []
            const podVoyageList = []
            response.data.podVesselList.forEach(pod => {
              if (pod) {
                podVesselList.push(pod)
              } else {
                podVesselList.push('Empty Value')
              }
            })
            response.data.podVoyageList.forEach(pod => {
              if (pod) {
                podVoyageList.push(pod)
              } else {
                podVoyageList.push('Empty Value')
              }
            })
            response.data.podVesselList = podVesselList
            response.data.podVoyageList = podVoyageList
          }
          this.containerQueryFilerList = response.data
        })
        .catch(error => {
          console.error(error)
        })
    },
    getContainerUpdateSelectList() {
      destinationSystemPodList()
        .then(response => {
          this.containerUpdateSelectList.podList = response.data || []
        })
        .catch(error => {
          console.error(error)
        })
      destinationSystemVesselList()
        .then(response => {
          this.containerUpdateSelectList.podVesselList = response.data || []
        })
        .catch(error => {
          console.error(error)
        })
    },
    getDestinationContainerDateQueryFilterList() {
      getDestinationContainerQueryDateFilter()
        .then(response => {
          if (response) {
            this.containerQueryDateFilerList.prePlannedDateList = response.data.prePlannedDateList || []
            this.containerQueryDateFilerList.plannedDateList = response.data.plannedDateList || []
            this.containerQueryDateFilerList.indcDateList = response.data.indcDateList || []
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async handleSaveFormData(command) {
      if (this.selectIds.length === 0) {
        this.$message({
          type: 'warning',
          message: 'Please select only one record to assign a broker.'
        })
        return
      }
      try {
        const res = await getListArrivalDcByContainerIds(this.selectIds)
        if (!res || res.data.length === 0) {
          this.$message.warning('No arrival DC data found for the selected records.')
          return
        }

        const arrivalDcList = res.data || []

        for (const item of arrivalDcList) {
          try {
            command.id = item.id
            await handleMilestone(command)
          } catch (err) {
            console.error(`Error processing ID: ${item.id}`, err)
            this.$message.error(`Failed to process ID: ${item.id}`)
          }
        }
        this.$message.success('All records processed successfully')
        this.getList()
      } catch (error) {
        console.error('Error fetching arrival DC data:', error)
        this.$message.error('An error occurred while fetching data.')
      }
    },
    handleBlankChange(field) {
      if (this.containerQueryParams[`${field}Blank`]) {
        this.containerQueryParams[field] = null // 清空日期选择器
      }
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange:', val)
      this.selectedRows = val
      this.selectIds = val.map(item => item.id)
    },
    handleSelection(selection, row) {
      console.log('handleSelection', selection)
      // 只要选中，就不能操作
      this.verifyDeliveryPlanDisable = selection.length > 0 ? true : false
      // 空的不能操作
      this.verifyDisable = selection.length === 0
      this.selectIds = selection.map(item => item.id)
    },
    getCommonData() {
      getMilestonesEnumListByType(2).then(res => {
        console.log('getMilestonesEnumListByType')
        console.log(res)
        if (res.data) {
          res.data.forEach(item => {
            console.log('item', item.taskName)
            if (item.taskName == 'Arrival DC') {
              item.taskName = 'Arrival at DC'
            }
          })
        }
        this.pendingTaskList = res.data
      }),
        getDestinationUnplannedReasonList().then(res => {
          console.log('getDestinationUnplannedReasonList', res)
          if (res.data) {
            res.data.forEach(item => {
              this.unplannedReasonMap[item.value] = item.label
            })
            console.log('this.unplannedReasonMap', this.unplannedReasonMap)
          }
        })
      getDictData('pepco_dest_cus_clearance_select_op')
        .then(res => {
          console.log('pepco_dest_cus_clearance_select_op', res)
          if (res.data) {
            res.data.forEach(item => {
              this.finishReasonMap[item.value] = item.label
            })
            console.log('this.finishReasonMap', this.finishReasonMap)
          }
        })
        .catch(error => {
          console.log('获取finish reason失败:', error)
        })
      getDictData('pepco_dest_invoice_to_customs_reason_select_op')
        .then(res => {
          console.log('pepco_dest_invoice_to_customs_reason_select_op', res)
          if (res.data) {
            // 直接给 select 用
            this.reasonCodeList = res.data.map(item => ({
              value: item.value,
              label: `${item.value} - ${item.label}`
            }))
          }
        })
        .catch(error => {
          console.log('获取 reasonCodeList 失败:', error)
        })
      // 获取DC列表（与 Excel 一致：使用 shipping 全量 DC 主数据；筛选器 dcList 可能因权限不含全部编码）
      return getDestinationDcList()
        .then(response => {
          this.destinationDcNameList = response.data || []
        })
        .catch(error => {
          console.error('获取DC列表失败:', error)
        })
    },
    /** 合并 query-filter 与全量 DC 列表，权限筛选后的 dcList 可能不包含订单中出现的编码 */
    buildDcCodeToNameMap() {
      const map = {}
      const merge = (list) => {
        if (!Array.isArray(list)) return
        list.forEach((item) => {
          if (!item || item.dcCode === undefined || item.dcCode === null) return
          const code = String(item.dcCode).trim()
          if (!code) return
          const name = item.dcName
          if (name !== undefined && name !== null && name !== '') {
            map[code] = name
          }
        })
      }
      merge(this.containerQueryFilerList && this.containerQueryFilerList.dcList)
      merge(this.destinationDcNameList)
      return map
    },
    /** Container DC 列：仅展示名称（DC Code 列已展示编码）；支持 0018/18 数字别名与主数据「编码 - 名称」脏数据去重 */
    getDcName(dcCodes) {
      if (!dcCodes) return ''
      const dcMap = this.buildDcCodeToNameMap()
      const stripDupPrefix = (codeKey, displayName) => {
        if (!displayName || !codeKey) return displayName
        const prefix = `${codeKey} - `
        return displayName.startsWith(prefix) ? displayName.slice(prefix.length) : displayName
      }
      const resolveName = (raw) => {
        const key = String(raw).trim()
        if (!key) return ''
        const pick = (ck, rawName) => {
          if (rawName === undefined || rawName === null || rawName === '') return null
          return stripDupPrefix(ck, rawName)
        }
        if (Object.prototype.hasOwnProperty.call(dcMap, key)) {
          const name = pick(key, dcMap[key])
          return name || key
        }
        if (/^\d+$/.test(key)) {
          const n = String(parseInt(key, 10))
          const padded = n.padStart(4, '0')
          if (Object.prototype.hasOwnProperty.call(dcMap, n)) {
            const name = pick(n, dcMap[n])
            return name || key
          }
          if (Object.prototype.hasOwnProperty.call(dcMap, padded)) {
            const name = pick(padded, dcMap[padded])
            return name || key
          }
        }
        return key
      }
      return dcCodes
        .split(',')
        .map(resolveName)
        .filter((part) => part !== '')
        .join(', ')
    },
    handleMilestoneDrawerRefresh() {
      this.$refs.milestoneDrawer.refresh()
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 382
    },

    downloadContainerData() {
      if (this.containerList.length === 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        })
        return
      }

      this.$confirm('Confirm the download?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {

        this.downloadOrderLoading = true

        const params = this.buildQueryParams()

        exportDestinationContainer(params)
          .then(response => {
            this.$download.excel(response, 'PEPCO Destination Container' + this.parseTimeToZ2(new Date()) + '.xlsx')
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
          })
          .finally(() => {
            this.downloadOrderLoading = false
          })
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      this.filterPopover = false
      this.handleSelection([], null)

      const params = this.buildQueryParams()

      getDestinationContainerPage(params)
        .then(response => {
          this.containerList = response.data.list
          this.total = response.data.total
        })
        .finally(() => {
          this.loading = false
        })

      this.handReport()
    },

    buildQueryParams() {
      const params = { ...this.containerQueryParams }
      const podVessel = []

      this.containerQueryParams.podVessel.forEach(pod => {
        if (pod !== 'Empty Value') {
          podVessel.push(pod)
        } else {
          podVessel.push('')
        }
      })

      params.podVessel = podVessel

      if (this.containerQueryParams.podVoyage === 'Empty Value') {
        params.podVoyage = ''
      }
      if (!this.containerQueryParams.podVoyage) {
        params.podVoyage = null
      }

      params.deliveryPlanType = []

      // Pre-Planned Date
      if (this.containerQueryParams.prePlannedDateMode === 'blank') {
        params.prePlannedDateStart = null
        params.prePlannedDateEnd = null
        params.deliveryPlanType.push(1)
      } else if (this.containerQueryParams.prePlannedDate?.length === 2) {
        params.prePlannedDateStart = this.containerQueryParams.prePlannedDate[0]
        params.prePlannedDateEnd = this.containerQueryParams.prePlannedDate[1]
        params.deliveryPlanType.push(1)
      } else {
        params.prePlannedDateStart = null
        params.prePlannedDateEnd = null
      }

      // Planned Date
      if (this.containerQueryParams.plannedDateMode === 'blank') {
        params.plannedDateStart = null
        params.plannedDateEnd = null
        params.deliveryPlanType.push(2)
      } else if (this.containerQueryParams.plannedDate?.length === 2) {
        params.plannedDateStart = this.containerQueryParams.plannedDate[0]
        params.plannedDateEnd = this.containerQueryParams.plannedDate[1]
        params.deliveryPlanType.push(2)
      } else {
        params.plannedDateStart = null
        params.plannedDateEnd = null
      }

      // In DC Date
      if (this.containerQueryParams.inDcDateMode === 'blank') {
        params.inDcDateStart = null
        params.inDcDateEnd = null
      } else if (this.containerQueryParams.inDcDate?.length === 2) {
        params.inDcDateStart = this.containerQueryParams.inDcDate[0]
        params.inDcDateEnd = this.containerQueryParams.inDcDate[1]
      } else {
        params.inDcDateStart = null
        params.inDcDateEnd = null
      }

      return params
    },
    showDestinationMilstones(row) {
      this.milestoneDrawerVisible = true
      this.containerSelectedRow = row
      this.destinationMilestonesDrawerTitle = row.containerNo
      this.$nextTick(() => {
        this.handleMilestoneDrawerRefresh()
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.containerQueryParams.pageNo = 1
      this.getList()
    },
    /** 下载模板操作 */
    downloadTemplateData(type) {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          // let params = { ...this.containerQueryParams }
          // params.pageNo = undefined
          // params.pageSize = undefined
          // params.podVessel = params.podVessel.map(item => (item === 'Empty Value' ? '' : item))
          // params.podVoyage = params.podVoyage === 'Empty Value' ? '' : params.podVoyage
          const params = { ...this.containerQueryParams }
          params.pageNo = undefined
          params.pageSize = undefined
          const podVessel = []
          this.containerQueryParams.podVessel.forEach(pod => {
            if (pod !== 'Empty Value') {
              podVessel.push(pod)
            } else {
              podVessel.push('')
            }
          })
          params.podVessel = podVessel
          if (this.containerQueryParams.podVoyage === 'Empty Value') {
            params.podVoyage = ''
          }
          if (!this.containerQueryParams.podVoyage) {
            params.podVoyage = null
          }
          params.deliveryPlanType = []
          // Pre-Planned Date
          if (this.containerQueryParams.prePlannedDateMode === 'blank') {
            params.prePlannedDateStart = null
            params.prePlannedDateEnd = null
            params.deliveryPlanType.push(1)
          } else if (this.containerQueryParams.prePlannedDate && this.containerQueryParams.prePlannedDate.length === 2) {
            params.prePlannedDateStart = this.containerQueryParams.prePlannedDate[0]
            params.prePlannedDateEnd = this.containerQueryParams.prePlannedDate[1]
            params.deliveryPlanType.push(1)
          } else {
            params.prePlannedDateStart = null
            params.prePlannedDateEnd = null
          }

          // Planned Date
          if (this.containerQueryParams.plannedDateMode === 'blank') {
            params.plannedDateStart = null
            params.plannedDateEnd = null
            params.deliveryPlanType.push(2)
          } else if (this.containerQueryParams.plannedDate && this.containerQueryParams.plannedDate.length === 2) {
            params.plannedDateStart = this.containerQueryParams.plannedDate[0]
            params.plannedDateEnd = this.containerQueryParams.plannedDate[1]
            params.deliveryPlanType.push(2)
          } else {
            params.plannedDateStart = null
            params.plannedDateEnd = null
          }

          // In DC Date
          if (this.containerQueryParams.inDcDateMode === 'blank') {
            params.inDcDateStart = null
            params.inDcDateEnd = null
          } else if (this.containerQueryParams.inDcDate && this.containerQueryParams.inDcDate.length === 2) {
            params.inDcDateStart = this.containerQueryParams.inDcDate[0]
            params.inDcDateEnd = this.containerQueryParams.inDcDate[1]
          } else {
            params.inDcDateStart = null
            params.inDcDateEnd = null
          }
          this.deliveryPlanExportLoading = true
          if (type === 1) {
            return exportContainerDeliveryPrePlan(params)
          } else if (type === 2) {
            return exportContainerDeliveryPlan(params)
          } else if (type === 3) {
            return exportArrivalAtDC(params)
          } else if (type === 4) {
            return exportContainerBroker(params)
          }
        })
        .then(response => {
          if (type === 1) {
            this.$download.excel(response, 'Delivery Pre-Plan.xlsx')
          } else if (type === 2) {
            this.$download.excel(response, 'Delivery Plan.xlsx')
          } else if (type === 3) {
            this.$download.excel(response, 'Arrival at DC Date.xlsx')
          } else if (type === 4) {
            this.$download.excel(response, 'Pepco Shipping Broker.xlsx.xlsx')
          }
          this.deliveryPlanExportLoading = false
        })
        .catch(() => {})
    },
    handleContainerPreDeliveryPlanImport() {
      this.upload.title = 'Import Pre-Delivery Plan'
      this.upload.type = 1
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/import-delivery-plan'
      this.upload.open = true
    },
    handleContainerDeliveryPlanImport() {
      this.upload.title = 'Import Delivery Plan'
      this.upload.type = 2
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/import-delivery-plan'
      this.upload.open = true
    },
    handleArrivalDCImport() {
      this.upload.title = 'Import Arrival at DC Date'
      this.upload.type = 3
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/import-arrival-at-dc'
      this.upload.open = true
    },
    handleBrokerImport() {
      this.upload.title = 'Import Broker'
      this.upload.type = 4
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/container/import-container-broker'
      this.upload.open = true
    },
    handleArrivalDCAdd() {
      this.destinationMilestoneCommand.formData = '[{"type":"date","label":"Arrival DC Date","value":""}]'
      this.formDialogVisible = true
    },
    handleContainerPlanStatus() {
      this.planStatusFormVisible = true
    },
    handleRepairData() {
      this.$refs.repairData.openDialog()
    },
    submitFileForm() {
      // 加一层确认框 edwin 20251110
      this.$modal
        .confirm('Please confirm: [' + this.upload.title + ']')
        .then(() => {
          this.$refs.upload.submit()
        })
        .catch(() => {})
      // this.$refs.upload.submit()
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log('文件上传失败')
      console.log('文件上传失败')
      console.log(err)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },
    handleFileError(err, file, fileList) {
      console.log('文件上传失败')
      console.log('文件上传失败')
      console.log(err)
      this.uploadInvoice.open = false
      this.uploadInvoice.isUploading = false
      this.$refs.uploadInvoice.clearFiles()
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },

    handleFileInvoiceUploadProgress(event, file, fileList) {
      this.uploadInvoice.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log('文件上传成功')
      console.log('上传的返回值', response.data)
      if (response.code == null || response.code !== 0) {
        console.log('上传的返回值', response.data)
        this.$modal.msgError(response.msg)
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        return
      }
      console.log('上传的返回值111', this.data)
      // 将结果添加到this.data中
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.getList()
    },

    handleInvoiceFileSuccess(response, file, fileList) {
      console.log('文件上传成功')
      console.log('上传的返回值', response.data)
      if (response.code == null || response.code !== 0) {
        console.log('上传的返回值', response.data)
        this.$modal.msgError(response.msg)
        this.uploadInvoice.open = false
        this.uploadInvoice.isUploading = false
        this.$refs.uploadInvoice.clearFiles()
        return
      }
      console.log('上传的返回值111', this.data)
      // 将结果添加到this.data中
      this.uploadInvoice.open = false
      this.uploadInvoice.isUploading = false
      this.$refs.uploadInvoice.clearFiles()
      this.getList()
    },
    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    },
    handChange(flag) {},
    handReport() {
      const params = { ...this.containerQueryParams }
      params.podVessel = params.podVessel.map(item => (item === 'Empty Value' ? '' : item))
      params.podVoyage = params.podVoyage === 'Empty Value' ? '' : params.podVoyage
      params.deliveryPlanType = []
      // Pre-Planned Date
      if (this.containerQueryParams.prePlannedDateMode === 'blank') {
        params.prePlannedDateStart = null
        params.prePlannedDateEnd = null
        params.deliveryPlanType.push(1)
      } else if (this.containerQueryParams.prePlannedDate && this.containerQueryParams.prePlannedDate.length === 2) {
        params.prePlannedDateStart = this.containerQueryParams.prePlannedDate[0]
        params.prePlannedDateEnd = this.containerQueryParams.prePlannedDate[1]
        params.deliveryPlanType.push(1)
      } else {
        params.prePlannedDateStart = null
        params.prePlannedDateEnd = null
      }

      // Planned Date
      if (this.containerQueryParams.plannedDateMode === 'blank') {
        params.plannedDateStart = null
        params.plannedDateEnd = null
        params.deliveryPlanType.push(2)
      } else if (this.containerQueryParams.plannedDate && this.containerQueryParams.plannedDate.length === 2) {
        params.plannedDateStart = this.containerQueryParams.plannedDate[0]
        params.plannedDateEnd = this.containerQueryParams.plannedDate[1]
        params.deliveryPlanType.push(2)
      } else {
        params.plannedDateStart = null
        params.plannedDateEnd = null
      }

      // In DC Date
      if (this.containerQueryParams.inDcDateMode === 'blank') {
        params.inDcDateStart = null
        params.inDcDateEnd = null
      } else if (this.containerQueryParams.inDcDate && this.containerQueryParams.inDcDate.length === 2) {
        params.inDcDateStart = this.containerQueryParams.inDcDate[0]
        params.inDcDateEnd = this.containerQueryParams.inDcDate[1]
      } else {
        params.inDcDateStart = null
        params.inDcDateEnd = null
      }
      getDestinationContainerOverviewStatistics(params).then(response => {
        const overview = response.data
        this.containerOverviewStatus = {
          containerCount: overview.containerCount,

          deliveryPrePlanPendingPossibleCount: overview.deliveryPrePlanPendingPossibleCount,
          deliveryPrePlanPendingUrgentCount: overview.deliveryPrePlanPendingUrgentCount,
          deliveryPrePlanPendingOverdueCount: overview.deliveryPrePlanPendingOverdueCount,
          deliveryPrePlanDoneCount: overview.deliveryPrePlanDoneCount,

          brokerAssignPendingPossibleCount: overview.brokerAssignPendingPossibleCount,
          brokerAssignPendingUrgentCount: overview.brokerAssignPendingUrgentCount,
          brokerAssignPendingOverdueCount: overview.brokerAssignPendingOverdueCount,
          brokerAssignDoneCount: overview.brokerAssignDoneCount,

          deliveryPlanPendingPossibleCount: overview.deliveryPlanPendingPossibleCount,
          deliveryPlanPendingUrgentCount: overview.deliveryPlanPendingUrgentCount,
          deliveryPlanPendingOverdueCount: overview.deliveryPlanPendingOverdueCount,
          deliveryPlanDoneCount: overview.deliveryPlanDoneCount,

          invoiceCustomsPendingPossibleCount: overview.invoiceCustomsPendingPossibleCount,
          invoiceCustomsPendingUrgentCount: overview.invoiceCustomsPendingUrgentCount,
          invoiceCustomsPendingOverdueCount: overview.invoiceCustomsPendingOverdueCount,
          invoiceCustomsDoneCount: overview.invoiceCustomsDoneCount,

          customsClearanceFinishPendingPossibleCount: overview.customsClearanceFinishPendingPossibleCount,
          customsClearanceFinishPendingUrgentCount: overview.customsClearanceFinishPendingUrgentCount,
          customsClearanceFinishPendingOverdueCount: overview.customsClearanceFinishPendingOverdueCount,
          customsClearanceFinishDoneCount: overview.customsClearanceFinishDoneCount,

          arrivalAtDcPendingPossibleCount: overview.arrivalAtDcPendingPossibleCount,
          arrivalAtDcPendingUrgentCount: overview.arrivalAtDcPendingUrgentCount,
          arrivalAtDcPendingOverdueCount: overview.arrivalAtDcPendingOverdueCount,
          arrivalAtDcDoneCount: overview.arrivalAtDcDoneCount,
          vesselArrivalPendingPossibleCount: overview.vesselArrivalPendingPossibleCount,
          vesselArrivalPendingUrgentCount: overview.vesselArrivalPendingUrgentCount,
          vesselArrivalPendingOverdueCount: overview.vesselArrivalPendingOverdueCount,
          vesselArrivalDoneCount: overview.vesselArrivalDoneCount,
          containerDischargedPendingPossibleCount: overview.containerDischargedPendingPossibleCount,
          containerDischargedPendingUrgentCount: overview.containerDischargedPendingUrgentCount,
          containerDischargedPendingOverdueCount: overview.containerDischargedPendingOverdueCount,
          containerDischargedDoneCount: overview.containerDischargedDoneCount,
          emptyContainerRePendingPossibleCount: overview.emptyContainerRePendingPossibleCount,
          emptyContainerRePendingUrgentCount: overview.emptyContainerRePendingUrgentCount,
          emptyContainerRePendingOverdueCount: overview.emptyContainerRePendingOverdueCount,
          emptyContainerReDoneCount: overview.emptyContainerReDoneCount
        }
      })
    },
    afterSubmitPlanStatus() {
      this.handleSelection([], null)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row'
      } else {
        return 'dan-row'
      }
    },
    parseContainerStatus(num) {
      if (null == num || num == 0) {
        return 'Pending'
      } else if (num == 1) {
        return 'Vessel Arrived'
      } else if (num == 2) {
        return 'Container Discharged'
      } else if (num == 3) {
        return 'Arrived at Inland Terminal'
      } else if (num == 4) {
        return 'Arrived at DC'
      } else if (num == 5) {
        return 'Empty Container Returned'
      }
    },
    parsePlanStatus(num) {
      if (null == num || num == 0) {
        return ''
      } else if (num == 1) {
        return 'Planned'
      } else if (num == 2) {
        return 'Unplanned'
      } else if (num == 3) {
        return 'Replanned'
      }
    },
    parseUnplannedReason(code) {
      if (null == code || code == '') {
        return ''
      }
      const label = this.unplannedReasonMap[code]
      if (!label) {
        return {}
      }
      return code + ' - ' + label
    },

    downloadingInvoiceTemplate() {
      // const status = this.uploadInvoice.completeStatus

      // 设置传参值（例如 status 为 1 表示 Complete，0 表示 Not Complete）
      this.downloadInvoiceParams = {
        ...this.containerQueryParams
        // completeStatus: status === 'Complete' ? '1' : '0'
      }
      exportContainerInvoiceTemplate(this.downloadInvoiceParams)
        .then(response => {
          this.$download.excel(response, 'Pepco Invoice to Customs.xlsx')
        })
        .catch(error => {
          this.$message.error('Failed to download template')
          console.error('Download error:', error)
        })
    },

    async submitInvoiceFileForm() {
      this.$refs.uploadInvoice.submit()
    },
    /** zane doc ready批量按钮点击 */
    handleDocsReady() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('Please select at least one record.')
        return
      }
      this.docReadyCurrentRow = null          // 批量模式
      this.docReadyDialogVisible = true
    },

    /** 列内编辑图标点击 */
    handleDocsReadyEdit(row) {
      this.docReadyCurrentRow = row           // 单行模式
      this.docReadyDialogVisible = true
    },
    clearFilters() {
      this.containerQueryParams.pol = null
      this.containerQueryParams.polList = []
      this.containerQueryParams.pod = []
      this.containerQueryParams.vessel = []
      this.containerQueryParams.podVessel = []
      this.containerQueryParams.voyage = null
      this.containerQueryParams.voyageList = []
      this.containerQueryParams.podVoyage = null
      this.containerQueryParams.etaDateRange = []
      this.containerQueryParams.podVoyageList = []
      this.containerQueryParams.dc = null
      this.containerQueryParams.mixDc = null
      this.containerQueryParams.dcList = []
      this.containerQueryParams.carrier = null
      this.containerQueryParams.carrierList = []
      this.containerQueryParams.contractType = null
      this.containerQueryParams.contractTypeList = []

      this.containerQueryParams.containerNo = null
      this.containerQueryParams.hblNumber = null
      this.containerQueryParams.lpNumber = null
      this.containerQueryParams.mblNumber = null
      this.containerQueryParams.pendingTaskCode = null
      this.containerQueryParams.orderRef = null

      this.containerQueryParams.prePlannedDate = []
      this.containerQueryParams.plannedDate = []
      this.containerQueryParams.inDcDate = []
      this.containerQueryParams.prePlannedDateStart = null
      this.containerQueryParams.prePlannedDateEnd = null
      this.containerQueryParams.plannedDateStart = null
      this.containerQueryParams.plannedDateEnd = null
      this.containerQueryParams.inDcDateStart = null
      this.containerQueryParams.inDcDateEnd = null
      this.containerQueryParams.deliveryPlanType = []
      this.containerQueryParams.prePlannedDateMode = null
      this.containerQueryParams.plannedDateMode = null
      this.containerQueryParams.inDcDateMode = null

      this.containerQueryParams.brokerDeptName = null
      this.containerQueryParams.brokerDeptNameList = []
      this.containerQueryParams.originCountry = []
      this.containerQueryParams.sanitary = null,
      this.containerQueryParams.documentsVerified = null,
      this.containerQueryParams.prePlanCanceled = null,
      this.containerQueryParams.planCanceled = null,
      this.containerQueryParams.planStatus = [],
      this.containerQueryParams.prePlanStatus = [];
      this.containerQueryParams.docReadyStatus = null;
      ;(this.containerQueryParams.sanitary = null),
        (this.containerQueryParams.documentsVerified = null),
        (this.containerQueryParams.prePlanCanceled = null),
        (this.containerQueryParams.planCanceled = null),
        (this.containerQueryParams.planStatus = []),
        (this.containerQueryParams.prePlanStatus = [])
      this.handleQuery()
    },
    openUpdateContainerInfoDialog(row, updateColumn) {
      this.$refs.updateContainerInfoDialogRef.openDialog(row, updateColumn, this.containerUpdateSelectList)
    },
    // zane eta展示的优先级
    getEffectiveEta(row) {
      // 与数据库 COALESCE 优先级保持一致
      return row.containerEta || row.ferightowerEta || row.eta || null
    },
    afterSubmitUpdateContainerInfo() {
      this.getList()
    },
    handleDocReadySubmit(payload, onSuccess, onError) {
      updateContainerDocsReady(payload)
        .then(() => {
          this.$message.success('Saved successfully')
          this.getList()
          onSuccess()
        })
        .catch(() => {
          onError()
        })
    },
    startEditContainerNo(row) {
      this.$set(row, '_editing', true)
      this.$set(row, '_newContainerNo', row.containerNo)
    },

    cancelEditContainerNo(row) {
      this.$set(row, '_editing', false)
      this.$set(row, '_newContainerNo', '')
    },

    submitContainerNo(row) {
      if (!row._newContainerNo) {
        this.cancelEditContainerNo(row)
        return
      }
      this.$set(row, '_submitting', true)
      updateContainerNo({
        containerId: row.id,
        newContainerNo: row._newContainerNo
      })
        .then(() => {
          this.$message.success('Updated successfully')
          row.containerNo = row._newContainerNo
          this.$set(row, '_editing', false)
        })
        .catch(() => {
          this.$set(row, '_editing', false)
        })
        .finally(() => {
          this.$set(row, '_submitting', false)
        })
    },
    // 显示 Sanitary Required Mix 详情
    showSanitaryDetail(containerNo) {
      this.currentContainerNo = containerNo
      this.sanitaryDetailDialogVisible = true
      this.sanitaryDetailList = []

      getHblSanitaryDetail(containerNo).then(res => {
        this.sanitaryDetailList = res.data || []
      }).catch(err => {
        this.$message.error('Failed to load sanitary detail')
        console.error(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.clickable-area {
  cursor: pointer;
  color: #fff;
}

.count-class {
  font-size: 20px;
  text-align: center;
  color: #000;
}

.with-divider {
  position: relative;
  padding: 0px 15px;
  border-radius: 10px;
  float: right;
  line-height: 24px;
}

.with-divider::after {
  content: '';
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #ddd;
}

.activePort {
  background-color: #3a71a8;
  color: white !important;
  /* 强制覆盖内联 */
  border-radius: 4px;
  transition: background-color 0.3s;
}

.card-box-container-dest-01 {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}

.box-scroller {
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}

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
  content: '';
  background: #004f7c;
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

/* ::v-deep .hiddenCheck > .cell .el-checkbox__inner {
  display: inline-block;
} */

:deep(.hiddenCheck .cell .el-checkbox__inner) {
  display: inline-block;
}

.center-input ::v-deep input {
  text-align: center;
}

.self-step2 {
  width: 20px;
  display: inline-block;
  height: 20px;
  border-radius: 20px !important;
  color: #fff;
  line-height: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  z-index: 999;
}

/* .self-step3:not(:first-child):before {
    width: 160px;
    height: 6px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C !important;
    top: 7px;
    text-align: left;
  } */
.self-step3:not(:first-child):before {
  width: 150px;
  height: 6px;
  position: absolute;
  left: -80px;
  content: '';
  background: #004f7c !important;
  top: 7px;
  text-align: left;
}

/* 关键修改：自动换行后的每行第一个不显示横线 */

.self-step3:nth-child(10n + 1):before {
  display: none !important;
}

.self-step3:first-child:after {
  display: none !important;
}

.self-step-process1:not(:first-child):before {
  background: #63acd5 !important;
}

.self-step-finished1:not(:first-child):before {
  background: #004f7c !important;
}

.self-step-pedding1:not(:first-child):before {
  background: #ddd !important;
}

.self-step-error1:not(:first-child):before {
  background: #f56c6c !important;
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

:deep(.el-table__header-wrapper) {
  .el-table-column--selection {
    .cell {
      .el-checkbox {
        display: inline-block !important;

        .el-checkbox__inner {
          display: inline-block !important;
          visibility: visible !important;
        }
      }
    }
  }
}

.clickable-area {
  cursor: pointer;
  // color: #fff;
  padding: 0px 5px;
  border-radius: 10px;
  float: right;
  line-height: 24px;
  margin-left: 5px;
}

.count-class {
  font-size: 20px;
  text-align: center;
  // color: #000;
}

.dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 绿色样式 */
.complete-radio.is-checked .el-radio__inner {
  background: #67c23a;
  border-color: #67c23a;
}

.complete-radio.is-checked .el-radio__label {
  color: #67c23a;
}

/* 红色样式 */
.incomplete-radio.is-checked .el-radio__inner {
  background: #f56c6c;
  border-color: #f56c6c;
}

.incomplete-radio.is-checked .el-radio__label {
  color: #f56c6c;
}

/* 垂直排列样式 */
.vertical-radios {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* 上下间距 */
}

.vertical-radios .el-radio {
  margin-bottom: 15px;
}

/* 带边框样式的特殊处理 */
.dialog-content >>> .complete-radio.is-checked.is-bordered {
  border-color: #67c23a;
}

.dialog-content >>> .incomplete-radio.is-checked.is-bordered {
  border-color: #f56c6c;
}

.line-class {
  border-left: 1px solid #ddd;
  height: 40px;
  margin: 0 3px;
}

.fixed-general-info {
  position: relative;
  background: #fff;
  overflow: auto;
  padding: 10px;
  /* 以下确保它脱离 el-table-body-wrapper 的 overflow 控制 */
  min-width: 1400px;
  /* 或你子表格所需的最小宽度 */
}

.fixed-general-info .el-table {
  min-width: 1200px;
  /* 取决于你子表格总列宽 */
  width: auto;
}

.activePort {
  background-color: #3a71a8;
  color: white !important;
  /* 强制覆盖内联 */
  border-radius: 4px;
  transition: background-color 0.3s;
}

.el-tooltip__popper.my-tooltip {
  max-width: none !important;
}

.el-tooltip__popper.my-tooltip .el-tooltip__content {
  white-space: nowrap !important;
}

.scroll-container {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 5px;
  /* 防止底部裁剪 */
}

.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.card-wrapper {
  display: inline-flex;
  white-space: nowrap;
}

.card-scroll-wrapper {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  gap: 10px;
}

.card-scroll-wrapper::-webkit-scrollbar {
  height: 6px;
}

.card-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.dashboard-card {
  flex-shrink: 0;
  min-width: 260px;
  height: 60px;
  text-align: center;
}

.pd-body {
  :deep(.el-card__body) {
    padding: 5px 10px !important;
  }
}
</style>
