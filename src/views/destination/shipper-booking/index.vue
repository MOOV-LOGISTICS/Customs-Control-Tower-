i<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;">
    <!-- report start -->
    <!-- <div style="margin-bottom: 20px;">
      <el-card style="background: transparent;box-shadow: none!important;">
        <el-card v-hasPermi="['pepco:destination-shipments:shipment-download']" style="float: left; padding: 5px; width: auto;margin-right: 10px;">
          <span @click="downloadOrderData">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
        <div class="card-scroll-wrapper">
          <el-card class="pd-20 dashboard-card" style="float: left; width: auto; height: 60px; text-align: center;">
            <icon-park style="cursor: default;border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
            <div @click="bookedChange(false)" class="clickable-area" style="border-radius: 10px; float: right; line-height: 20px;">
              <p v-if="!isBroker" class="count-class">{{ orderInfo.totalCount }}</p>
              <p v-if="isBroker" class="count-class">{{ orderInfo.clearanceFinish +orderInfo.clearanceFinished }}</p>
              <p style="color: #000">Total Shipments</p>
            </div>
          </el-card>

          <el-card v-hasPermi="['pepco:destination-shipments:verify-count:view']" class="pd-20 dashboard-card" style="float: left; width: auto; height: 60px; text-align: center;">
            <div style="padding: 15px 5px; display: flex; border-radius: 10px; float: left; align-items: center; text-align: center; ">
              <p style="color: #000; font-size: medium; margin: 0;">Verify Documents</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.verify  === false}" @click="bookedChange(0,'verify')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.verifyCount || 0}}</p>
              <p style="color: #000">Pending</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.verify === true}" @click="bookedChange(1,'verify')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.verifiedCount || 0 }}</p>
              <p style="color: #000">Finished</p>
            </div>
          </el-card>

          <el-card v-hasPermi="['pepco:destination-shipments:assign-count:view']" class="pd-20 dashboard-card" style="float: left; width: auto; height: 60px; text-align: center;">
            <div style="padding: 15px 5px; display: flex; border-radius: 10px; float: left; align-items: center; text-align: center; ">
              <p style="color: #000; font-size: medium; margin: 0;">Broker Assign</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.assign  === false}" @click="bookedChange(0,'assign')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.assignCount || 0}}</p>
              <p style="color: #000">Pending</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.assign === true}" @click="bookedChange(1,'assign')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.assignedCount || 0 }}</p>
              <p style="color: #000">Finished</p>
            </div>
          </el-card>

          <el-card v-hasPermi="['pepco:destination-shipments:invoice-count:view']" class="pd-20 dashboard-card" style="float: left; width: auto;  height: 60px; text-align: center;">
            <div style="padding: 15px 5px; display: flex; border-radius: 10px; float: left; align-items: center; text-align: center; ">
              <p style="color: #000; font-size: medium; margin: 0;">Invoices to Customs</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.invoice  === false}" @click="bookedChange(0,'invoice')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.invoiceCount || 0}}</p>
              <p style="color: #000">Pending</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.invoice === true}" @click="bookedChange(1,'invoice')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.invoicedCount || 0 }}</p>
              <p style="color: #000">Finished</p>
            </div>
          </el-card>
          <el-card v-hasPermi="['pepco:destination-shipments:finished-count:view']" class="pd-20 dashboard-card" style="float: left; width: auto;  height: 60px; text-align: center;">
            <div style="padding: 15px 5px; display: flex; border-radius: 10px; float: left; align-items: center; text-align: center; ">
              <p style="color: #000; font-size: medium; margin: 0;">Customs Clearance Finish</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.finish  === false}" @click="bookedChange(0,'finish')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.clearanceFinish || 0}}</p>
              <p style="color: #000">Pending</p>
            </div>
            <div style="width: 1px; height: 48px; margin-left: 5px; float: left; background-color: #ccc;"></div>
            <div :class="{ 'activePort': queryParams.finish === true}" @click="bookedChange(1,'finish')" class="clickable-area" style="border-radius: 10px; float: left; line-height: 20px">
              <p class="count-class">{{ orderInfo.clearanceFinished || 0 }}</p>
              <p style="color: #000">Finished</p>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>-->
    <div class="card-box-container">
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center;" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:shipment-download']">
        <div @click="downloadOrderData">
          <icon-park type="inbox-download-r" theme="filled" size="60" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; margin-left: 8px; justify-content: center;align-items: center;" :body-style="{ padding: '8px 8px 8px 0' }">
        <div style="display: flex;">
          <icon-park type="order" theme="filled" size="60" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" style="cursor: default;" />
          <div style="width: 1px; height: 70px; background-color: #ccc;"></div>
          <div @click="handReportChange(null)" class="clickable-area" style="border-radius: 3px; margin-left: 5px; line-height: 24px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="color: #303133; font-size: 16px; font-weight: bold; margin-top: 5px;">Total Shipments</p>
            <p class="count-class" style="margin-top: 4px; text-align: center">{{ shippingOverviewStatus.shippingCount }}</p>
          </div>
        </div>
      </el-card>
      <el-card style="flex-shrink: 0; margin-left: 8px;" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:verify-count:view']">
        <div style="background-color: #f5f7fa; padding: 10px 5px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Verify Documents</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 5px; flex-wrap: wrap;">
          <!-- Possible -->
          <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'possible' }" @click="handReportChange(1, 'possible')" class="clickable-area" style="cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.verifyDocumentPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'urgent' }" @click="handReportChange(1, 'urgent')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.verifyDocumentUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'overdue' }" @click="handReportChange(1, 'overdue')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.verifyDocumentOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': queryParams.verify === true }" @click="handReportChange(2, 'finished')" class="clickable-area" style="cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.verifyDocumentDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="flex-shrink: 0; margin-left: 8px;" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:assign-count:view:old']">
        <div style="background-color: #f5f7fa; padding: 10px 5px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Broker Assign</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'possible' }" @click="handReportChange(3, 'possible')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.brokerAssignPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'urgent' }" @click="handReportChange(3, 'urgent')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.brokerAssignUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'overdue' }" @click="handReportChange(3, 'overdue')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.brokerAssignOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': queryParams.assign === true }" @click="handReportChange(4, 'finished')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.brokerAssignDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="flex-shrink: 0; margin-left: 8px;" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:invoice-count:view:old']" class="pd-body">
        <div style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Invoice to Customs</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'possible' }" @click="handReportChange(5,'possible')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'urgent' }" @click="handReportChange(5, 'urgent')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'overdue' }" @click="handReportChange(5, 'overdue')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': queryParams.invoice === true }" @click="handReportChange(6, 'finished')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
      <el-card style="flex-shrink: 0; margin-left: 8px;" :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-shipments:finished-count:view:old']" class="pd-body">
        <div style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Customs Clearance Finish</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'possible' }" @click="handReportChange(7,'possible')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'urgent' }" @click="handReportChange(7, 'urgent')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'overdue' }" @click="handReportChange(7, 'overdue')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': queryParams.finish === true }" @click="handReportChange(8, 'finished')" class="clickable-area" style=" cursor: pointer;">
            <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
    </div>
    <!--    <div style="margin-bottom: 20px;">-->
    <!--      <el-card style="background: transparent; box-shadow: none !important">-->
    <!--        <el-card v-hasPermi="['pepco:destination-shipments:shipment-download']" class="pd-body" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center; position: relative;">-->
    <!--          <div style="float: left; margin-top: 10px; height: 100%; display: flex; align-items: center; ">-->
    <!--            <span @click="downloadOrderData">-->
    <!--              <icon-park type="inbox-download-r" theme="filled" size="70" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />-->
    <!--            </span>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--        <el-card class="pd-20" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center; position: relative;">-->
    <!--          &lt;!&ndash; 左侧图标 &ndash;&gt;-->
    <!--          <div style="float: left; margin-top: 10px; height: 100%; display: flex; align-items: center; border-right: 1px solid #ddd; padding-right: 2px;">-->
    <!--            <icon-park type="order" theme="filled" size="70" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" style="cursor: default;" />-->
    <!--          </div>-->
    <!--          &lt;!&ndash; 右侧文字 &ndash;&gt;-->
    <!--          <div-->
    <!--            @click="handReportChange(null)"-->
    <!--            class="clickable-area"-->
    <!--            style="border-radius: 3px; float: left; margin-left: 5px; line-height: 24px; height: 100%; display: flex; flex-direction: column; justify-content: center;"-->
    <!--          >-->
    <!--            <p style="color: #303133; font-size: 16px; font-weight: bold; margin-top: 5px;">Total Shipments</p>-->
    <!--            <p class="count-class" style="margin: 4px 0 0; margin-top: 20px;">{{ shippingOverviewStatus.shippingCount }}</p>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--        <el-card v-hasPermi="['pepco:destination-shipments:verify-count:view']" class="pd-body" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center;">-->
    <!--          <div style="background-color: #f5f7fa; padding: 10px 5px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">-->
    <!--            <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Verify Documents</p>-->
    <!--          </div>-->
    <!--          <div style="display: flex; justify-content: center; align-items: center; gap: 5px; flex-wrap: wrap;">-->
    <!--            &lt;!&ndash; Possible &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'possible' }" @click="handReportChange(1, 'possible')" class="clickable-area" style="cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.verifyDocumentPossibleCount }}</p>-->
    <!--              <p style="color: #000">Possible</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Urgent &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'urgent' }" @click="handReportChange(1, 'urgent')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.verifyDocumentUrgentCount }}</p>-->
    <!--              <p style="color: #000">Urgent</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Overdue &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.verify === false && queryParams.taskType === 'overdue' }" @click="handReportChange(1, 'overdue')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.verifyDocumentOverdueCount }}</p>-->
    <!--              <p style="color: #000">Overdue</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Finished &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.verify === true }" @click="handReportChange(2, 'finished')" class="clickable-area" style="cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.verifyDocumentDoneCount }}</p>-->
    <!--              <p style="color: #000">Finished</p>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--        <el-card v-hasPermi="['pepco:destination-shipments:assign-count:view']" class="pd-body" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center;">-->
    <!--          <div style="background-color: #f5f7fa; padding: 10px 5px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">-->
    <!--            <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Broker Assign</p>-->
    <!--          </div>-->
    <!--          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">-->
    <!--            &lt;!&ndash; Possible &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'possible' }" @click="handReportChange(3, 'possible')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.brokerAssignPossibleCount }}</p>-->
    <!--              <p style="color: #000">Possible</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Urgent &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'urgent' }" @click="handReportChange(3, 'urgent')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.brokerAssignUrgentCount }}</p>-->
    <!--              <p style="color: #000">Urgent</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Overdue &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.assign === false && queryParams.taskType === 'overdue' }" @click="handReportChange(3, 'overdue')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.brokerAssignOverdueCount }}</p>-->
    <!--              <p style="color: #000">Overdue</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Finished &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.assign === true }" @click="handReportChange(4, 'finished')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.brokerAssignDoneCount }}</p>-->
    <!--              <p style="color: #000">Finished</p>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--        <el-card v-hasPermi="['pepco:destination-shipments:invoice-count:view']" class="pd-body" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center;">-->
    <!--          <div style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">-->
    <!--            <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Invoice to Customs</p>-->
    <!--          </div>-->
    <!--          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">-->
    <!--            &lt;!&ndash; Possible &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'possible' }" @click="handReportChange(5,'possible')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsPossibleCount }}</p>-->
    <!--              <p style="color: #000">Possible</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Urgent &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'urgent' }" @click="handReportChange(5, 'urgent')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsUrgentCount }}</p>-->
    <!--              <p style="color: #000">Urgent</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Overdue &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.invoice === false && queryParams.taskType === 'overdue' }" @click="handReportChange(5, 'overdue')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsOverdueCount }}</p>-->
    <!--              <p style="color: #000">Overdue</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Finished &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.invoice === true }" @click="handReportChange(6, 'finished')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.invoiceCustomsDoneCount }}</p>-->
    <!--              <p style="color: #000">Finished</p>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--        <el-card v-hasPermi="['pepco:destination-shipments:finished-count:view']" class="pd-body" style="float: left; width: auto; margin-right: 5px; height: 110px; text-align: center;">-->
    <!--          <div style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">-->
    <!--            <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Customs Clearance Finish</p>-->
    <!--          </div>-->
    <!--          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">-->
    <!--            &lt;!&ndash; Possible &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'possible' }" @click="handReportChange(7,'possible')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishPossibleCount }}</p>-->
    <!--              <p style="color: #000">Possible</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Urgent &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'urgent' }" @click="handReportChange(7, 'urgent')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishUrgentCount }}</p>-->
    <!--              <p style="color: #000">Urgent</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Overdue &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.finish === false && queryParams.taskType === 'overdue' }" @click="handReportChange(7, 'overdue')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishOverdueCount }}</p>-->
    <!--              <p style="color: #000">Overdue</p>-->
    <!--            </div>-->
    <!--            <div style="width: 1px; height: 40px; background-color: #ccc;"></div>-->
    <!--            &lt;!&ndash; Finished &ndash;&gt;-->
    <!--            <div :class="{ 'activePort': queryParams.finish === true }" @click="handReportChange(8, 'finished')" class="clickable-area" style=" cursor: pointer;">-->
    <!--              <p class="count-class">{{ shippingOverviewStatus.customsClearanceFinishDoneCount }}</p>-->
    <!--              <p style="color: #000">Finished</p>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--      </el-card>-->
    <!--    </div>-->

    <el-card class="pd-20">
      <div style="float: right;line-height: 48px;">
        <!-- <div style="float: right;position: relative;z-index: 999;">
          <el-button type="primary" @click="openOverview">{{ !drawer2 ? 'Overview' : 'Order List' }}</el-button>
        </div>-->
        <div style="float: right;" v-if="!drawer2">
          <el-tag
            style="margin-right: 10px;margin-top: 5px;"
            :disable-transitions="false"
            closable
            @close="handleClose(key)"
            v-show="value.length > 0"
            v-for="(value, key) in preBookMap"
            :key="key"
          >{{ orderNumberMap[key] }} ({{ value.length }})</el-tag>
        </div>
      </div>

      <transition name="el-zoom-in-center">
        <div v-show="!drawer2">
          <div v-if="!drawer2" style="display: flex; overflow-x: auto" class="box-scroller">
            <div style="flex-shrink: 0">
              <el-form :model="queryParams" style="display: flex;">
                <div style="padding: 10px 0px;">
                  <el-input
                    placeholder="Shipper Booking No"
                    min-width="350px"
                    v-model="queryParams.shipperBookingNumber"
                    @input.native="queryParams.shipperBookingNumber = $event.target.value.trim()"
                    @keyup.enter.native="triggerFilter"
                    clearable
                    @clear="triggerFilter"
                  ></el-input>
                </div>

                <!-- // 暂未实现 -->
                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-input
                    placeholder="Container Number"
                    v-model="queryParams.containerNo"
                    @input.native="queryParams.containerNo = $event.target.value.trim()"
                    @keyup.enter.native="triggerFilter"
                    clearable
                    @clear="triggerFilter"
                  ></el-input>
                </div>

                <!-- // 暂未实现 -->
                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-input placeholder="PO" v-model="queryParams.orderNumber" @input.native="queryParams.orderNumber = $event.target.value.trim()" @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter"></el-input>
                </div>
                <!-- // 暂未实现 -->
                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-input :placeholder="$constants.MBL_NUMBER" v-model="queryParams.mblNumber" @input.native="queryParams.mblNumber = $event.target.value.trim()" @keyup.enter.native=" queryParams.pageNo = 1, getList()" clearable></el-input>
                </div>

                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-input placeholder="HBL Number" v-model="queryParams.hblNumber" @input.native="queryParams.hblNumber = $event.target.value.trim()" @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter"></el-input>
                </div>

                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-select clearable @clear="getList()" v-model="queryParams.pendingTaskValue" @change="pendingTaskChange" placeholder="Pending Task" filterable>
                    <el-option v-for="item in pendingTasksOptions" :key="item.key" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <div style="margin-left: 8px;padding: 10px 0;">
                  <el-popover v-model="filterPopover"  placement="bottom" popper-class="popover-filter"  title=" "  width="400" trigger="click">
                    <el-form>
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.pol" filterable placeholder="POL">
                            <el-option v-for="item in portOptions" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select v-model="queryParams.pod" multiple clearable filterable placeholder="POD">
                            <el-option v-for="item in podOptions" :key="item" :label="item" :value="item" />
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                            <el-option v-for="item in supplierOptions" :key="item.id" :label="item.name" :value="item.supplierCode"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select clearable multiple v-model="queryParams.dcList" placeholder="DC" filterable>
                            <el-option v-for="item in dcList" :key="item.id" :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select v-model="queryParams.vessel" placeholder="Departing Vessel" multiple filterable reserve-keyword clearable>
                            <el-option v-for="item in vesselList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select v-model="queryParams.voyage" placeholder="Departing Voyage" filterable reserve-keyword clearable>
                            <el-option v-for="item in voyageList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select v-model="queryParams.podVessel" placeholder="Arrival Vessel" multiple filterable reserve-keyword clearable>
                            <el-option v-for="item in podVesselList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select v-model="queryParams.podVoyage" placeholder="Arrival Voyage" filterable reserve-keyword clearable>
                            <el-option v-for="item in podVoyageList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-input v-model="queryParams.lpNumber" clearable placeholder="LP" />
                        </el-col>
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.country" placeholder="Country of Origin" filterable>
                            <el-option v-for="item in countryList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                        <!-- <el-col :span="12">
                          <el-select clearable v-model="queryParams.brokerDeptName" placeholder="Broker" filterable>
                            <el-option v-for="item in brokerFilterList" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>-->
                      </el-row>

                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.sanitaryRisk" placeholder="Sanitary Risk" filterable>
                            <el-option label="Yes" value="true"></el-option>
                            <el-option label="No" value="false"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.sanitary" placeholder="Sanitary Required" filterable>
                            <el-option label="Yes" value="true"></el-option>
                            <el-option label="No" value="false"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>

                      <!-- <el-row :gutter="10" style="margin-bottom: 15px;">

                      </el-row>-->
                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.mblType" placeholder="MBL Type" filterable @clear="onMBLClear">
                            <el-option v-for="item in mblTypeList" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.blType" placeholder="HBL Type" filterable @clear="onHBLClear">
                            <el-option v-for="item in hblTypeList" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <!--                        <el-col :span="12">-->
                        <!--                          <el-input v-model="queryParams.mpNumber" clearable placeholder="LP" />-->
                        <!--                        </el-col>-->
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.carrier" placeholder="Carrier" filterable>
                            <el-option v-for="item in carrierList" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-col>

                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.verified" placeholder="Doc Verify" filterable>
                            <el-option v-for="item in verifiedDict" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10" style="margin-bottom: 15px;">
                        <el-col :span="12">
                          <el-select clearable v-model="queryParams.brokerDeptName" placeholder="Broker" filterable>
                            <el-option v-for="item in allBrokerFilterList" :key="item" :label="item" :value="item" />
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-date-picker
                        v-model="queryParams.etaDateRange"
                        clearable
                        type="daterange"
                        range-separator="-"
                        start-placeholder="ETA from"
                        end-placeholder="ETA to"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="margin-bottom: 15px;"
                      ></el-date-picker>
                      <!-- <el-row :gutter="20" style="margin-bottom: 15px;">
                        <el-col style="text-align: right">
                          <el-button @click="triggerFilter" icon="el-icon-search" style="background-color: #004F7C;color: white;" plain>Search</el-button>
                        </el-col>
                      </el-row> -->
                    </el-form>
                    <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'#004F7C':''}">Filter</el-button>
                  </el-popover>
                  <el-button style="margin-left: 5px" @click="clearFilters" plain>Clear Filters</el-button>
                </div>

                <div style="margin-left: 8px; padding: 10px 0">
                  <el-button @click="handleQuery" type="primary">
                    <i class="el-icon-search el-icon--right"></i>
                    Search
                  </el-button>
                </div>
              </el-form>
            </div>

            <div class="card-wrapper">
              <div style="float:left;margin-left: 5px;padding: 10px 0px;">
                <el-button v-hasPermi="['pepco:destination-shipments:document-verify']" type="primary" @click="verifyShipping('Document Verification Complete')" icon="el-icon-s-order" plain>Verify Documents</el-button>
              </div>
              <!-- <div style="float:left;margin-left: 5px;padding: 10px 0px;">
                <el-button v-hasPermi="['pepco:destination-shipments:broker-assign']" type="primary" @click="assignBroker('Customs_Broker_Assigned')" icon="el-icon-s-order" plain>Broker Assign</el-button>
              </div>
              <div style="float:left;margin-left: 5px;padding: 10px 0px;">
                <el-button v-hasPermi="['pepco:destination-shipments:invoice-customers']" type="primary" @click="clickInvoice('Freight_and_Local_Charges_Invoiced')" icon="el-icon-s-order" plain>Invoice to Customs</el-button>
              </div>
              <div style="float:left;margin-left: 5px;padding: 10px 0px;">
                <el-button v-hasPermi="['pepco:destination-shipments:clearance-finished']" type="primary" @click="clickFinish('Customs_Clearance_Finished')" icon="el-icon-s-order" plain>Customs Clearance Finish</el-button>
              </div>-->
            </div>
          </div>

          <el-table
            ref="multipleTable"
            :row-class-name="tableRowClassName"
            border
            @sort-change="handleSortChange"
            :header-cell-class-name="headerCellStyle"
            @select="handleSelection"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :height="tableHeight"
            :data="tableData"
            style="width: 100%"
            @expand-change="handleExpandChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <div style="padding:15px 58px 15px 58px; width: calc(100% - 150px);">
                  <el-tabs type="border-card" :ref="'tab' + props.row.id" v-model="props.row.key" @tab-click="handleClick($event, props)">
                    <el-tab-pane v-if="showDocumentsTab" label="Documents" :name="'first' + props.row.id">
                      <documents ref="documentsRef" :document-data="documentList"></documents>
                    </el-tab-pane>

                    <el-tab-pane v-if="showVerifyTab" label="Documents Verified" :name="'eight' + props.row.id">
                      <documents-verified ref="documentsVerifiedRef" :log-data="logDataInfo"></documents-verified>
                    </el-tab-pane>

                    <el-tab-pane v-if="showBrokerAssignTab" label="Customs Broker Assign" :name="'five' + props.row.id">
                      <customer-assign ref="customerAssignRef" :log-data="logDataInfo"></customer-assign>
                    </el-tab-pane>

                    <el-tab-pane v-if="showInvoiceTab" label="Invoices to Customs" :name="'six' + props.row.id">
                      <freight-invoiced ref="freightInvoiceRef" :log-data="logDataInfo"></freight-invoiced>
                    </el-tab-pane>
                    <el-tab-pane v-if="showFinishTab" label="Customs Clearance Finished" :name="'seven' + props.row.id">
                      <customs-clearance ref="customsClearanceRef" :log-data="logDataInfo"></customs-clearance>
                    </el-tab-pane>
                    <el-tab-pane v-if="showOrdersInContainersTab" label="General Information" :name="'second' + props.row.id">
                      <div class="fixed-general-info">
                        <orders-in-containers ref="ordersInContainersRef" :container-data="containerList"></orders-in-containers>
                      </div>
                    </el-tab-pane>

                    <el-tab-pane v-if="showCarrierBookingTab" label="Carrier Booking" :name="'third' + props.row.id">
                      <carrier-booking ref="carrierBookingRef" :shipmentRes-data="shipmentResList"></carrier-booking>
                    </el-tab-pane>

                    <el-tab-pane v-if="showLogTab" label="Change Log" :name="'forth' + props.row.id">
                      <log ref="logRef" :log-data="logDataInfo"></log>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Shipper Booking Number" sortable="custom" align="center" min-width="180" prop="shipperBookingNumber">
              <template v-slot="scope">
                <span style="color:#000;font-weight: 900; text-align: center;">{{ scope.row.shipperBookingNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="LP" sortable="custom" min-width="120" align="center" prop="lpNumber">
              <template v-slot="scope">
                <span>{{ scope.row.lpNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Set Number" sortable="custom" align="center" min-width="120" prop="newSetNumber">
              <template v-slot="scope">
                <span>{{ scope.row.newSetNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Supplier Name" sortable="custom" align="center" min-width="120" prop="supplierCode" show-overflow-tooltip>
              <template v-slot="scope">
                <bsc-supplier-text :supplierId="scope.row.supplierId" />
              </template>
            </el-table-column>

            <el-table-column label="Carrier" sortable="custom" align="center" min-width="80" prop="carrier">
              <template v-slot="scope">
                <span>{{ scope.row.shipment?.carrier }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$constants.MBL_NUMBER" sortable="custom" align="center" min-width="120" prop="mblNumber">
              <template v-slot="scope">
                <span>{{ scope.row.mblNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="HBL Number" sortable="custom" align="center" min-width="150" prop="hblNumber">
              <template v-slot="scope">
                <span>{{ scope.row.hblNumber }}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="Container Numbers" align="center" width="140" prop="containerNo">
                <template v-slot="scope">
                  <span>{{ scope.row.containerNo }}</span>
                </template>
            </el-table-column>-->
            <el-table-column prop="containerNo" label="Container Numbers" align="center" width="140" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ formatContainerNumbers(scope.row.containerNo) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Broker" sortable="custom" align="center" min-width="180" prop="brokerDeptName">
              <template v-slot="scope">
                <span>{{ scope.row.brokerDeptName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Incoterms" sortable="custom" align="center" min-width="180" prop="incoterm">
              <template v-slot="scope">
                <span>{{ scope.row.incoterm?.toUpperCase() }}</span>
              </template>
            </el-table-column>

            <el-table-column label="MBL Type" sortable="custom" align="center" min-width="120" prop="mblType">
              <template v-slot="scope">
                <span>{{ scope.row.mblType ? scope.row.mblType.toUpperCase() : '' }}</span>
                <!-- <span>{{ scope.row.mblType.toUpperCase() }}</span> -->
              </template>
            </el-table-column>

            <el-table-column label="HBL Type" sortable="custom" align="center" min-width="150" prop="blType">
              <template v-slot="scope">
                <span>{{ scope.row.blType }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Departing Vessel" sortable="custom" align="center" min-width="180" prop="vessel">
              <template v-slot="scope">
                <span>{{ scope.row.vessel }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Arrival Vessel" sortable="custom" align="center" min-width="180" prop="podVessel">
              <template v-slot="scope">
                <span>{{ scope.row.podVessel }}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="Voyage" sortable="custom" align="center" min-width="90" prop="voyage">
                <template v-slot="scope">
                  <span>{{ scope.row.voyage }}</span>
                </template>
            </el-table-column>-->

            <el-table-column label="POL" sortable="custom" align="center" min-width="70" prop="pol">
              <template v-slot="scope">
                <span>{{ scope.row.shipment?.originPort }}</span>
              </template>
            </el-table-column>

            <el-table-column label="POD" sortable="custom" align="center" min-width="70" prop="pod">
              <template v-slot="scope">
                <span>{{ scope.row.shipment?.destinationPort }}</span>
              </template>
            </el-table-column>

            <el-table-column label="DC" sortable="custom" align="center" min-width="160" prop="dc">
              <template v-slot="scope">
                <span>{{ getDcName(scope.row.dc) }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="ETD" sortable="custom" min-width="100" prop="etd">
              <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.etd) }}</template>
            </el-table-column>
            <el-table-column align="center" label="ETA" sortable="custom" min-width="100" prop="eta">
              <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.eta ) }}</template>
            </el-table-column>
            <el-table-column align="center" label="ATD" sortable="custom" min-width="100" prop="atd">
              <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.atd ) }}</template>
            </el-table-column>
            <el-table-column align="center" label="ATA" sortable="custom" min-width="100" prop="ata">
              <template v-slot="scope">{{ parseUTCTime(scope.row.shipment?.ata ) }}</template>
            </el-table-column>

            <el-table-column label="Doc Verify" sortable="custom" align="center" min-width="120" prop="verified">
              <template v-slot="scope">
                <span :style="{ color: scope.row.verified === 1 ? '#67C23A' : '' }">
                  {{
                  scope.row.verified === 1 ? 'C' :
                  scope.row.verified === 2 ? 'I' :
                  'N'
                  }}
                </span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="Broker Assign" sortable="custom" align="center" min-width="120" prop="assigned">
              <template v-slot="scope">
                <span v-if="scope.row.assigned" style="color: #67C23A;">{{ 'Y' }}</span>
                <span v-else style="color: #909399;">{{ 'N' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Invoice to Customs" sortable="custom" align="center" min-width="150" prop="invoiced">
              <template v-slot="scope">
                <span v-if="scope.row.invoiced" style="color: #67C23A;">{{ 'Y' }}</span>
                <span v-else style="color: #909399;">{{ 'N' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Clearance" sortable="custom" align="center" min-width="120" prop="finished">
              <template v-slot="scope">
                <span v-if="scope.row.finished" style="color: #67C23A;">{{ 'Y' }}</span>
                <span v-else style="color: #909399;">{{ 'N' }}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="Sanitary Risk" sortable="custom" align="center" min-width="150" prop="sanitaryRisk">
              <template v-slot="scope">
                <span v-if="scope.row.sanitaryRisk" style="color: #67C23A;">{{ 'Y' }}</span>
                <span v-else style="color: #909399;">{{ 'N' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sanitary Required" sortable="custom" align="center" min-width="150" prop="sanitary">
              <template v-slot="scope">
                <span v-if="scope.row.sanitary" style="color: #67C23A;">{{ 'Yes' }}</span>
                <span v-else style="color: #909399;">{{ 'No' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="DG" sortable="custom" align="center" min-width="150" prop="dg">
              <template v-slot="scope">
                <span v-if="scope.row.dg" style="color: #67C23A;">{{ 'Y' }}</span>
                <span v-else style="color: #909399;">{{ 'N' }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination :total="total" layout="total, sizes, prev, pager, next, jumper" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[20, 40, 100,500,1000]" @pagination="changePage" />
        </div>
      </transition>
    </el-card>
    <el-dialog :title="title" width="600px" :visible.sync="formDialogVisible">
      <el-form :model="form" size="mini">
        <el-form-item required v-if="type ==='Customs_Broker_Assigned'" label="Customer Brokers" label-width="180px">
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
        <el-button style="float: left" v-if="type ==='Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="revokeBroker">Revoke</el-button>
        <el-button @click="formDialogVisible = false">Cancel</el-button>
        <el-button v-if="type ==='Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="submitBroker2(10)">Submit</el-button>
        <el-button v-if="type !=='Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut" @click="submitBroker2(20)">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading="loadingSaveFinish" :title="reasonTitle" width="600px" :visible.sync="finshDialog">
      <div class="dialog-content">
        <div class="vertical-radios">
          <el-radio class="complete-radio" v-model="radio" label="1" border @input="finishRadio(true)" size="medium">Complete</el-radio>
          <el-radio class="incomplete-radio" v-model="radio" label="2" border @input="finishRadio(false)" size="medium">Not Complete</el-radio>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Incomplete">Cancel</el-button>
        <el-button type="primary" :loading="loadingSaveFinish" @click="finishComplete">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading="loadingSaveVerify" :title="title" width="600px" :visible.sync="verifyDialog">
      <div class="dialog-content">
        <div class="vertical-radios">
          <el-radio class="complete-radio" v-model="radio" label="1" border @input="selectRadio" size="medium">Complete</el-radio>
          <div @click="selectRadio('2')" class="vertical-radios">
            <el-radio class="incomplete-radio" v-model="radio" label="2" border @input="selectRadio" size="medium">Not Complete</el-radio>
          </div>
          <el-switch style="display: block" @change="changeSwitch" v-model="sanitaryValue" active-color="blue" active-text="Sanitary Certificate is required"></el-switch>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="showVerifyRevokeBtn" style="float: left" type="primary" :loading="loadingSaveVerify" @click="revokeVerifyDocument">Revoke</el-button>
        <el-button @click="Incomplete">Cancel</el-button>
        <el-button type="primary" :loading="loadingSaveVerify" @click="Complete">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="reasonTitle" width="600px" :visible.sync="reasonDialog">
      <el-form :model="form" size="mini" ref="reasonDialogForm">
        <el-form-item prop="reason" v-if="!finishRadioValue" :label="reasonTitle" align="center" label-width="200px">
          <el-input placeholder="Reason" type="textarea" show-word-limit maxlength="200" v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item v-show="type === 'Customs_Clearance_Finished'" :required="type === 'Customs_Clearance_Finished'" prop="submitDate" v-if="finishRadioValue" label="Submit Date" label-width="180px">
          <el-date-picker aria-required v-model="form.submitDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-show="type === 'Customs_Clearance_Finished'" :required="type === 'Customs_Clearance_Finished'" prop="finishDate" v-if="finishRadioValue" label="Finish Date" label-width="180px">
          <el-date-picker v-model="form.finishDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-show="type === 'Freight_and_Local_Charges_Invoiced'" prop="invoiceDate" v-if="finishRadioValue" label="Invoices to customs date" label-width="180px">
          <el-date-picker v-model="form.invoiceDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>

        <el-form-item v-show="type === 'Freight_and_Local_Charges_Invoiced' && finishRadioValue  " prop="invoiceNumber" label="Invoice Number" label-width="180px">
          <el-input v-model="form.invoiceNumber" />
        </el-form-item>

        <el-form-item v-show="type === 'Freight_and_Local_Charges_Invoiced'" prop="comments" v-if="finishRadioValue" label="Comments" label-width="180px">
          <el-input type="textarea" v-model="form.comments" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reasonDialog = false">Cancel</el-button>
        <el-button v-if="type ==='Customs_Clearance_Finished'" type="primary" :loading="loadingSaveBut" @click="submitFinishReason">Submit</el-button>
        <el-button v-if="type ==='Document_Verification_Complete'" type="primary" :loading="loadingSaveBut" @click="submitDouumentReason">Submit</el-button>
        <el-button v-if="type ==='Freight_and_Local_Charges_Invoiced'" type="primary" :loading="loadingSaveBut" @click="submitInvoiceReason">Submit</el-button>
      </div>
    </el-dialog>

    <!-- 下载模板操作 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        accept=".xlsx, .xls, .xml"
        :headers="upload.headers"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        :action="upload.url"
        drag
        multiple
        :timeout="3000000"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downloadingTheTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="upload.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="uploadInvoice.title" :visible.sync="uploadInvoice.open" width="400px" append-to-body>
      <el-radio-group v-model="uploadInvoice.completeStatus" style="margin-bottom: 10px;">
        <el-radio label="Complete">Complete</el-radio>
        <el-radio label="Not Complete">Not Complete</el-radio>
      </el-radio-group>

      <el-upload
        ref="uploadInvoice"
        accept=".xlsx, .xls, .xml"
        :headers="uploadInvoice.headers"
        :disabled="uploadInvoice.isUploading"
        v-loading="uploadInvoice.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
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
        <el-button size="mini" type="primary" :disabled="uploadInvoice.isUploading" @click="submitInvoiceFileForm">{{ $t("purchaseOrder.confirm") }}</el-button>
        <el-button size="mini" @click="uploadInvoice.open = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
import { groupByCountryAndSuppliercode } from '@/api/order/header'
import { findShippingSchedulePortList } from '@/api/shipment/shipment'
import { getContainerList } from '@/api/system/container'
import { getUserProfile, listSimpleUsers } from '@/api/system/user'
import { checkPermi, checkRole } from '@/utils/permission'; // 权限判断函数
import orderComment from '@/views/purchaseOrder/pepco/components/order-comment.vue'
import { IconPark } from '@icon-park/vue/es/all'
import '@icon-park/vue/styles/index.css'
import SelectedListBox from './components/selected-list-box.vue'
// 添加修改订单信息 edwin
import {
  downloadShippingOrderData,
  exportShippingBrokerTemplate,
  getAllBrokerList,
  getBrokerDataList,
  getCarriers,
  getDestinationDcList,
  getDestinationShippingCount,
  getDestinationShippingDetail,
  getDestinationShippingPage,
  getDestinationShippingQueryFilter,
  getDestinationTraceLog,
  getHblTypeListByField,
  getMblTypeListByField,
  getMilestonesEnumListByTypeAndRole,
  getShippingOverviewStatistics,
  revokeBroker,
  revokeVerify,
  submitBroker,
  submitDate,
  verifyDestinationShipping,
  verifyDestinationShippingFinish
} from '@/api/destination/destination.js'
import { listDept } from '@/api/system/dept'
import { getTaskSettingPage } from '@/api/system/taskSetting'
import { getBaseHeader } from '@/utils/request'
import MilestoneFormDialog from '@/views/destination/shipped-container/component/form/milestone-form-dialog.vue'
import { mapState } from 'vuex'
import uploadOrderFile from './components/upload-order-file.vue'
import carrierBooking from './detail/tabs/carrier-booking.vue'
import comments from './detail/tabs/comments.vue'
import customerAssign from './detail/tabs/customer-assign.vue'
import customsClearance from './detail/tabs/customs-clearance.vue'
import documentsVerified from './detail/tabs/documents-verified.vue'
import documents from './detail/tabs/documents.vue'
import freightInvoiced from './detail/tabs/freight-invoiced.vue'
import log from './detail/tabs/log.vue'
import ordersInContainers from './detail/tabs/orders-in-containers.vue'
export default {
  name: 'Container',
  components: {
    IconPark,
    SelectedListBox,
    uploadOrderFile,
    orderComment,
    documents,
    ordersInContainers,
    carrierBooking,
    log,
    comments,
    MilestoneFormDialog,
    customerAssign,
    customsClearance,
    freightInvoiced,
    documentsVerified
  },
  props: {
    showTaskPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      downloadOrderLoading: false,

      drawer2: false,
      direction: 'rtl',
      drawer: false,
      tableData: [],
      user: {},
      activities: [],
      tableHeight: 0,
      loading: true,
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        prop: '',
        orderBy: '',
        verify: null,
        assign: null,
        invoice: null,
        finish: null,
        orderDirection: null,
        taskType: null,
        taskCode: null,
        shipperBookingNumber: null,
        containerNo: null,
        orderNumber: null,
        mblNumber: null,
        hblNumber: null,
        pendingTaskValue: null,
        pol: null,
        pod: null,
        supplierCode: null,
        lpNumber: null,
        dc: null,
        // dc list edwin 2025/10/27
        dcList: [],
        vessel: [],
        verified: null,
        voyage: null,
        podVessel: [],
        podVoyage: null,
        country: null,
        brokerDeptName: null,
        sanitaryRisk: null,
        sanitary: null,
        mpNumber: null,
        etaDateRange: [],
        carrier: null,
        mblType: null,
        blType: null
      },
      verifiedDict: [
        { label: 'C', value: 1 },
        { label: 'I', value: 2 },
        { label: 'N', value: 0 }
      ],
      downloadInvoiceParams: {
        status: ''
      },
      filterPopover: false,
      preBookMap: {},
      orderNumberMap: {},
      dialogFormVisible: false,

      view: true,
      task: {},
      data: {},
      expanded: {},
      loadingMap: {},
      containerMap: {},
      portMap: {},
      orderInfo: {
        totalCount: 0,
        verifiedCount: 0,
        verifyCount: 0,
        assignCount: 0,
        assignedCount: 0,
        invoiceCount: 0,
        invoicedCount: 0,
        clearanceFinish: 0,
        clearanceFinished: 0
      },
      allTaskNames: [],
      // 禁用今天之后的日期
      pickerDisableFutureOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },

      userMap: [],
      supplierCode: [],
      dc: [],
      originPort: [],
      logList: [],
      commentsList: [],
      documentList: [],
      containerList: [],
      shipmentResList: {},
      logDataInfo: {},
      isShow: false,
      vesselList: [],
      voyageList: [],
      podVesselList: [],
      podVoyageList: [],
      portOptions: [],
      podOptions: [],
      statusOptions: [
        { value: 0, label: 'Pending' },
        { value: 10, label: 'Done' }
      ],
      country: [],
      selectIds: [],
      // brokers: [],
      brokerList: [],
      formDialogVisible: false,
      milestoneFormMode: 'select', // 'edit' or 'view'
      destinationMilestoneCommand: {
        id: null,
        formData: '',
        taskCode: ''
      },
      form: {
        brokerDeptId: null
      },
      title: '',
      type: '',
      taskCode: '',
      formData: '',
      selectedRows: [],
      verifyDisable: false,
      traceList: [],
      pendingTasksOptions: [],
      pendingTaskList: [],
      filterData: {},
      countryList: [],
      supplierIds: [],
      supplierOptions: [],
      isBroker: null,
      verifyDialog: false,
      radio: '1',
      loadingSaveBut: false,
      selectRows: [],
      loadingSaveVerify: false,
      dcList: [],
      lpList: [],
      loadingSaveFinish: false,
      finshDialog: false,
      reasonTitle: '',
      reasonDialog: false,
      finishRadioValue: true,
      sanitaryValue: false,
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
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/import-shipping-broker'
      },
      uploadInvoice: {
        open: false,
        title: 'Import Invoice',
        headers: {},
        isUploading: false,
        url: '', // 设置上传地址
        completeStatus: 'Complete' // 默认值
      },
      showVerifyTab: false,
      showBrokerAssignTab: false,
      showInvoiceTab: false,
      showFinishTab: false,
      showDocumentsTab: false,
      showCarrierBookingTab: false,
      showOrdersInContainersTab: false,
      showLogTab: false,
      tabList: [],
      showVerifyRevokeBtn: false,
      brokerFilterList: [],
      allBrokerFilterList: [],
      shippingOverviewStatus: {
        shippingCount: 0,
        verifyDocumentDoneCount: 0,
        verifyDocumentPossibleCount: 0,
        verifyDocumentUrgentCount: 0,
        verifyDocumentOverdueCount: 0,
        brokerAssignDoneCount: 0,
        brokerAssignPossibleCount: 0,
        brokerAssignUrgentCount: 0,
        brokerAssignOverdueCount: 0,
        invoiceCustomsDoneCount: 0,
        invoiceCustomsPossibleCount: 0,
        invoiceCustomsUrgentCount: 0,
        invoiceCustomsOverdueCount: 0,
        customsClearanceFinishDoneCount: 0,
        customsClearanceFinishPossibleCount: 0,
        customsClearanceFinishUrgentCount: 0,
        customsClearanceFinishOverdueCount: 0
      },
      resultSubmitLoading: false,
      carrierList: [],
      mblTypeList: [],
      hblTypeList: []
    }
  },
  computed: {
    hasFilter() {
      return this.queryParams.pol || this.queryParams.status || this.queryParams.supplierCode || this.queryParams.dc || this.queryParams.etaDateRange
    },
    ...mapState({
      supplierList: state => state.dept.supplierList
    })
  },
  mounted() {
    this.calcTableHeight()
    window.addEventListener('storage', this.handleStorageChange)

    window.addEventListener('resize', this.initTableHeight)
    if (this.$auth.hasPermi('pepco:destination-shipments:documents:view')) {
      this.showDocumentsTab = true
      this.tabList.push({ name: 'first', ref: 'documentsRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:verify-count:view')) {
      this.showVerifyTab = true
      // this.tabList.push('eight')
      this.tabList.push({ name: 'eight', ref: 'documentsVerifiedRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:assign-count:view:old')) {
      this.showBrokerAssignTab = true
      // this.tabList.push('five')
      this.tabList.push({ name: 'five', ref: 'customerAssignRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:invoice-count:view:old')) {
      this.showInvoiceTab = true
      // this.tabList.push('six')
      this.tabList.push({ name: 'six', ref: 'freightInvoiceRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:finished-count:view:old')) {
      this.showFinishTab = true
      // this.tabList.push('seven')
      this.tabList.push({ name: 'seven', ref: 'customsClearanceRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:general:view')) {
      this.showOrdersInContainersTab = true
      // this.tabList.push('second')
      this.tabList.push({ name: 'second', ref: 'ordersInContainersRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:carrier-booking:view')) {
      this.showCarrierBookingTab = true
      // this.tabList.push('third')
      this.tabList.push({ name: 'third', ref: 'carrierBookingRef' })
    }
    if (this.$auth.hasPermi('pepco:destination-shipments:change-log:view')) {
      this.showLogTab = true
      // this.tabList.push('forth')
      this.tabList.push({ name: 'forth', ref: 'logRef' })
    }
    this.getCarriers()
    this.getMblTypeListByField()
    this.getHblTypeListByField()
  },
  async created() {
    if (this.$route.query.orderNumber) {
      this.$set(this.queryParams, 'orderNumber', this.$route.query.orderNumber)
    }

    if (this.$route.query.taskRow && this.$route.query.taskType) {
      const row = JSON.parse(this.$route.query.taskRow)
      // console.log('row', row)
      this.queryParams.taskType = this.$route.query.taskType
      this.queryParams.taskCode = row.taskCode
      if (row.taskCode === 'Document_Verification_Complete') {
        this.queryParams.verify = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Customs_Broker_Assigned') {
        this.queryParams.assign = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Freight_and_Local_Charges_Invoiced') {
        this.queryParams.invoice = this.$route.query.taskType === 'finished'
      } else if (row.taskCode === 'Customs_Clearance_Finished') {
        this.queryParams.finish = this.$route.query.taskType === 'finished'
      }
    } else {
      this.queryParams.verify = null
      this.queryParams.assign = null
      this.queryParams.invoice = null
      this.queryParams.finish = null
      this.queryParams.taskType = null
      this.queryParams.taskCode = null
    }
    this.handReport()
    this.getList()
    // this.getOrderCount()

    getUserProfile().then(response => {
      this.user = response.data
    })

    this.getPortList()
    listSimpleUsers().then(response => {
      this.userMap = response.data.reduce((map, user) => {
        map.set(user.id, user.nickname)
        return map
      }, new Map())
    })
    this.getSupplierList()

    this.groupByCountryAndSuppliercode()
    this.getBrokerList()
    // 获取页面常用数据
    this.getCommonData()
    this.calcTableHeight()
    console.log('this.supplierList', this.supplierList)

    this.getFilterQueryData()
  },
  methods: {
    triggerFilter(){
      // 自定义筛选
      this.queryParams.pageNo = 1
      // refresh list
      this.getList()
    },
    checkPermi,
    checkRole,

    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 420
    },
    async getSupplierList() {
      if (!this.supplierList || this.supplierList.length === 0) {
        await this.$store.dispatch('dept/fetchSupplierList')
      }
    },
    getCommonData() {
      getMilestonesEnumListByTypeAndRole(1).then(res => {
        console.log('getMilestonesEnumListByTypeAndRole res:', res.data)
        this.pendingTasksOptions = Object.entries(res.data).map(([value, label]) => ({
          key: value,
          value: parseInt(value),
          label: label
        }))
        console.log('pendingTasksOptions:', this.pendingTasksOptions)
      })
    },
    getDcName(dcCodes) {
      if (!dcCodes) return ''
      return dcCodes
        .split(',')
        .map(code => {
          const match = this.dcList.find(item => item.dcCode === code.trim())
          return match ? match.dcName : code
        })
        .join(', ')
    },

    remoteMethod(query) {
      // if (query !== '' && query.length >= 3) {
      //   getVesselList({ vesselName: query }).then(response => {
      //     this.vesselList = response.data
      //   })
      // } else {
      //   this.vesselList = []
      // }
    },

    groupByCountryAndSuppliercode() {
      groupByCountryAndSuppliercode().then(res => {
        // this.country = res.data.country
      })
    },

    async getOrderCount() {
      await getDestinationShippingCount(this.queryParams).then(response => {
        const { data } = response
        console.log('response data:', data)
        this.$set(this.orderInfo, 'totalCount', data.totalCount)
        this.$set(this.orderInfo, 'verifiedCount', data.verifiedCount)
        this.$set(this.orderInfo, 'verifyCount', data.verifyCount)
        this.$set(this.orderInfo, 'assignCount', data.assignCount)
        this.$set(this.orderInfo, 'assignedCount', data.assignedCount)
        this.$set(this.orderInfo, 'invoiceCount', data.invoiceCount)
        this.$set(this.orderInfo, 'invoicedCount', data.invoicedCount)
        this.$set(this.orderInfo, 'clearanceFinish', data.clearanceFinish)
        this.$set(this.orderInfo, 'clearanceFinished', data.clearanceFinished)
        console.log('data:', data.broker)
        // 修正属性名并设置默认值
        const isBroker = data.broker !== undefined ? data.broker : false
        this.$set(this, 'isBroker', isBroker)

        console.log('isBroker value:', this.isBroker)
      })
    },

    initTableHeight() {
      // 计算表格高度 = 视窗高度 - 头部高度 - 表格上方区域高度 - 底部边距
      // this.tableHeight = window.innerHeight - 180
      // 强制表格重新布局
      if (this.$refs.mainTable) {
        this.$refs.mainTable.doLayout()
      }
    },
    bookedChange(value, label) {
      console.log('选择的数据', value, label)

      // 重置其他状态，只保留当前 label 对应的项
      const keys = ['verify', 'assign', 'invoice', 'finish']
      keys.forEach(key => {
        console.log('当前状态', key, this.queryParams[key])
        console.log('当前状态2', label, this.queryParams[key])
        // 如果是当前点击的状态且已经是true,则设为null(取消选中)
        if (key === label && this.queryParams[key] !== null) {
          this.queryParams[key] = null
        } else {
          // 否则根据value设置布尔值
          this.queryParams[key] = key === label ? (value === 0 ? false : true) : null
        }
      })
      this.getList()
    },

    handleSortChange({ column, prop, order }) {
      // 根据当前排序条件发送请求到后台获取排序结果
      if (order != null) {
        order = order === 'ascending' ? 'ASC' : 'DESC'
        this.queryParams.orderBy = column.property.replace(/([A-Z])/g, '_$1').toLowerCase()
        this.queryParams.orderDirection = order
      } else {
        this.queryParams.orderBy = ''
        this.queryParams.orderDirection = ''
      }
      this.getList()
    },
    getContainerList() {
      getContainerList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.containerMap[response.data[i].type] = response.data[i].tue
        }
        this.getCustomFieldList()
      })
    },

    togglePreAssgine(index) {
      this.$set(this.preAssgine, index, !this.preAssgine[index])
    },
    async toggleLoading(index) {
      this.$set(this.loadingMap, index, !this.loadingMap[index])
    },

    getPortList() {
      findShippingSchedulePortList().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.$set(this.portMap, res.data[i].value, res.data[i].label)
        }
        this.getContainerList()
      })
    },

    handleDelete(data, index) {
      data.splice(index, 1)
    },

    clearAll() {
      this.preBookMap = {}
    },
    handleClose(key) {
      delete this.preBookMap[key]
      this.preBookMap = JSON.parse(JSON.stringify(this.preBookMap))
    },

    async getHeaderPage() {
      console.log('this')
      const params = { ...this.queryParams }
      if (params.mblType === 'Empty Value') {
        params.mblType = ''
      }
      if (params.blType === 'Empty Value') {
        params.blType = ''
      }
      await getDestinationShippingPage(params).then(response => {
        this.tableData = response.data.list
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].key = 'first' + this.tableData[i].id
          this.tableData[i].show = 0 // 默认不显示
        }

        getDestinationDcList().then(response => {
          console.log('获取DC列表:', response.data)
          this.$set(this, 'dcList', response.data || [])
        })
        this.total = response.data.total
        this.loading = false
      })
      await this.handReport()
    },
    downloadOrderData() {
      if (this.tableData.length === 0) {
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
      })
        .then(() => {
          this.downloadOrderLoading = true
          downloadShippingOrderData(this.queryParams).then(response => {
            this.$download.excel(response, 'PEPCO Shipper Booking' + this.parseTimeToZ2(new Date()) + '.xlsx')
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            this.downloadOrderLoading = false
          })
        })
        .catch(() => {
          this.downloadOrderLoading = false
        })
    },
    changePage() {
      this.loading = true
      this.getHeaderPage()
    },
    getList() {
      this.loading = true
      // this.filterPopover = false
      this.getHeaderPage()
      // this.queryParams.pendingTaskValue = null
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },

    async handleClick(el, order) {
      console.log('handleClick2', order)
      const key = order.row.key
      let refName = null
      let action = ''

      if (key.startsWith('five')) {
        action = 'Customs Broker Assign'
        refName = 'customerAssignRef'
      } else if (key.startsWith('six')) {
        action = 'Invoices to Customs'
        refName = 'freightInvoiceRef'
      } else if (key.startsWith('seven')) {
        action = 'Customs Clearance Finished'
        refName = 'customsClearanceRef'
      } else if (key.startsWith('eight')) {
        action = 'Shipping Documents Verify by Pepco'
        refName = 'documentsVerifiedRef'
      }

      console.log('refName:', refName, 'action:', action)
      if (refName && action) {
        await this.getTraceLogData(order.row.shippingOrderId, action)
        this.logDataInfo.logList = this.traceList || []
        this.logDataInfo.userMap = this.userMap || new Map()
        this.logDataInfo.type = action

        this.$refs[refName].setCommentsData(this.logDataInfo)
      }

      this.loading = false
      this.toggleLoading(order.id)

      //select shipments
    },
    // 点击切换框时，拉取trace log数据，然后根据框筛选
    async getTraceLogData(orderId, action) {
      this.loading = true
      const data = {
        shippingOrderId: orderId,
        action: action
      }
      await getDestinationTraceLog(data).then(response => {
        console.log('获取日志数据:', response.data)
        if (response.code === 0) {
          this.$set(this, 'traceList', response.data)
          console.log('this:traceList', this.traceList)
        }
      })
    },
    // calcTableHeight() {
    //   const clientHeight = document.documentElement.clientHeight
    //   this.tableHeight = clientHeight - 302
    // },
    headerCellStyle({ column, columnIndex }) {
      // if (columnIndex === 0) {
      //   return 'hiddenCheck'
      // }
    },

    handleSelection(selection, row) {
      console.log('handleSelection', selection)
      // 判断选中行的status, 如果等于10 则禁用选中
      this.verifyDisable = selection.some(item => item.status === 10)
      this.selectIds = selection.map(item => item.id)
      this.selectRows = selection
      console.log('handleSelection selectRows:', this.selectRows)
    },
    // 取消选中
    handleRemoveRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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

    // 输入去空格 edwin
    handleInputChange(event, row, field) {
      const trimmedValue = event.trim()
      if (trimmedValue !== '') {
        row[field] = trimmedValue
      }
    },

    handleUpdateList(verifyResult) {
      // 强制刷新页面
      this.getHeaderPage()
    },

    getUserName(creator) {
      return this.userMap.get(creator)
    },
    handleStorageChange(event) {
      if (event.key === 'refreshPoPage') {
        this.getList()
        console.log('Storage changed:', event.newValue)
        console.log('刷新order list:', event)
      }
    },

    openOverview() {},
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row'
      } else {
        return 'dan-row'
      }
    },
    async handleExpandChange(row, expanded, props) {
      console.log('111', row, expanded, props)
      if (expanded.length > 0) {
        console.log('展开1:', expanded[0])
        // 获取详情数据
        getDestinationShippingDetail({ destinationShippingId: row.id }).then(response => {
          console.log('获取详情数据2:', response.data)
          if (response.code === 0) {
            console.log('=======')

            // 延迟触发重绘
            try {
              setTimeout(() => {
                this.$nextTick(() => {
                  window.dispatchEvent(new Event('resize'))
                  // 强制更新表格高度
                  this.$refs.mainTable.doLayout()
                })
              }, 500)
            } catch (error) {
              console.log('=======:' + error)
            }
            // this.$refs.documentsRef.setDocumentData(response.data.orderFileVOList || [])
            if (this.tabList && this.tabList.length > 0) {
              this.$set(row, 'key', this.tabList[0].name + row.id)
              console.log(`111111111====================${this.tabList[0].name}${row.id}`)
              this.$refs[`tab${row.id}`].setCurrentName(`${this.tabList[0].name}${row.id}`)
            }

            this.$nextTick(() => {
              if (this.$refs.documentsRef) {
                this.$refs.documentsRef.setDocumentData(response.data.orderFileVOList || [])
              }
              if (this.$refs.ordersInContainersRef) {
                this.$refs.ordersInContainersRef.setContainerData(response.data.orderInContainers)
              }
              if (this.$refs.carrierBookingRef) {
                this.$refs.carrierBookingRef.setShipmentResData(response.data.shipmentRes)
              }
              if (this.$refs.customerAssignRef) {
                console.log('========customerAssignRef========')
                console.log('=====brokerAssignList======', response.data.brokerAssignList)
                this.logDataInfo.logList = response.data.brokerAssignList || []
                this.logDataInfo.userMap = this.userMap || new Map()
                this.logDataInfo.type = 'Customs Broker Assign'
                this.$refs.customerAssignRef.setCommentsData(this.logDataInfo)
              }
              if (this.$refs.freightInvoiceRef) {
                this.logDataInfo.logList = response.data.invoiceCustomsList || []
                this.logDataInfo.userMap = this.userMap || new Map()
                this.logDataInfo.type = 'Invoices to Customs'
                this.$refs.freightInvoiceRef.setCommentsData(this.logDataInfo)
              }
              if (this.$refs.customsClearanceRef) {
                this.logDataInfo.logList = response.data.finishedList || []
                this.logDataInfo.userMap = this.userMap || new Map()
                this.logDataInfo.type = 'Customs Clearance Finished'
                this.$refs.customsClearanceRef.setCommentsData(this.logDataInfo)
              }
              if (this.$refs.documentsVerifiedRef) {
                this.logDataInfo.logList = response.data.documentVerifiedList || []
                this.logDataInfo.userMap = this.userMap || new Map()
                this.logDataInfo.type = 'Shipping Documents Verify by Pepco'
                this.$refs.documentsVerifiedRef.setCommentsData(this.logDataInfo)
              }
              if (this.$refs.logRef) {
                console.log('日志组件存在，设置日志数据', this.userMap)
                // 将userMap一起传递给日志组件
                this.logDataInfo.logList = response.data.traceLogs || []
                this.logDataInfo.userMap = this.userMap || new Map()
                this.$refs.logRef.setLogData(this.logDataInfo)
              }
              this.logDataInfo.logList = response.data.finishedList || []
              this.logDataInfo.userMap = this.userMap || new Map()
              this.logDataInfo.type = 'Customs Clearance Finished'
              this.$refs.customsClearanceRef.setCommentsData(this.logDataInfo)
              this.isShow = true
            })
          }
        })
        // 点击tab
      } else {
        console.log('关闭行:', row)
      }
    },
    checkVerifiedStatus() {
      const verifiedRecord = this.selectRows.find(item => item.status === 10)

      if (verifiedRecord) {
        this.$message({
          type: 'warning',
          message: `The record with Shipper Booking Number ${verifiedRecord.shipperBookingNumber} has already been verified. Please select another record.`
        })
        return true
      }
      return false
    },
    async verifyShipping(value) {
      this.showVerifyRevokeBtn = false
      // 判断verify的id个数
      if (this.selectIds.length == 0) {
        this.$message({
          type: 'warning',
          // 提示语：只能选择一条数据
          message: 'Please select at least one record.'
        })
        return
      }
      // if (this.checkVerifiedStatus()) {
      //   return
      // }
      console.log('选择的数据', this.selectRows)
      if (this.selectRows[0].status === 10) {
        this.$set(this, 'showVerifyRevokeBtn', true)
      }
      console.log('选择的记录:', this.showVerifyRevokeBtn)
      console.log('选择的id:', this.selectIds)
      this.loadingSaveVerify = false
      this.sanitaryValue = this.selectRows[0].sanitary === null ? false : this.selectRows[0].sanitary
      this.verifyDialog = true
      this.title = value
      this.radio = '1'
      await getTaskSettingPage({
        pageNo: 1,
        pageSize: 10,
        taskCode: 'Document_Verification_Complete'
      })
        .then(response => {
          if (response.data.list.length > 0) {
            console.log('获取任务设置成功1:', response.data.list)
            this.$set(this, 'formData', response.data.list[0].formTemplate)
            this.$set(this, 'taskCode', response.data.list[0].taskCode)
            this.$set(this, 'type', response.data.list[0].taskCode)
          }
        })
        .catch(error => {
          console.error('获取任务设置失败:', error)
        })
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
    handleSelectAll(selection) {
      this.selectIds = selection.map(item => item.id)
    },

    handleSelectionChange(val) {
      console.log('handleSelectionChange:', val)
      this.selectRows = val
      this.selectIds = val.map(item => item.id)
    },

    async assignBroker(taskCode) {
      this.form = {}
      if (this.selectIds.length == 0) {
        this.upload.open = true
        this.upload.title = 'Import'
        this.formDialogVisible = false
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
        const selectedBroker = this.selectRows.find(item => item.brokerDeptId)
        console.log('selectedBroker:', selectedBroker)
        if (selectedBroker) {
          this.form.brokerDeptId = selectedBroker.brokerDeptId || ''
        }
        console.log('taskCode1111:', this.taskCode)
        this.formDialogVisible = true
      }
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
        shippingIds: this.selectIds,
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
        submitBroker(data)
          .then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: 'Broker assigned successfully!'
              })
              this.formDialogVisible = false
              this.loadingSaveBut = false
              this.getList()
              this.getOrderCount()
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
              this.formDialogVisible = false
              this.loadingSaveBut = false
              this.getList()
              this.getOrderCount()
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
      this.queryParams.pendingTaskValue = null
    },
    pendingTaskChange(value) {
      if (value === 'Document_Verification_Complete') {
        this.queryParams.pendingTaskValue = 0
      }
      console.log('pendingTaskChange1:', value)
      console.log('pendingTaskChange:', this.queryParams.pendingTaskValue)
      // refresh list
      this.getList()
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
          this.submitDouumentReason()
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
      formData[0].value = '1'
      formData[0].status = 'Complete'
      data.formData = JSON.stringify(formData)
      verifyDestinationShipping(data).then(response => {
        if (response.code != null || response.code == 0) {
          this.$message({
            type: 'success',
            message: 'Verify Success'
          })
          // this.queryParams.pendingTaskValue = null
          this.getList()
          this.getOrderCount()
        }
        this.loadingSaveVerify = false
      })
      this.verifyDialog = false
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
      //获取system_task_setting中的form_template
      this.title = this.taskCode
      console.log('taskCode1111:', this.taskCode)
      this.finishRadioValue = value
      this.reasonDialog = true
      // 如果是false 弹出输入框
    },
    finishComplete(value) {
      console.log('this.type:', this.type)
      this.title = 'Customs clearance finished'
      console.log('taskcode', this.taskCode)
      this.reasonDialog = true
      console.log('finishComplete value:', value)
    },
    submitFinishReason() {
      console.log('提交选择的id:', this.selectIds)
      console.log('提交选择的taskCode:', this.taskCode)
      console.log('提交选择的finishRadioValue:', this.finishRadioValue)
      //提交
      if (this.taskCode === 'Customs_Clearance_Finished' && this.finishRadioValue) {
        if (this.form.submitDate === undefined || this.form.finishDate === undefined) {
          this.$message({
            type: 'warning',
            message: 'Please select a Date'
          })
          this.loadingSaveBut = false
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
      formData[0].submitDate = this.form.submitDate
      formData[0].finishDate = this.form.finishDate
      formData[0].status = this.finishRadioValue ? 'Complete' : 'Incomplete'
      data.formData = JSON.stringify(formData)
      this.$refs['reasonDialogForm'].validate(valid => {
        if (valid) {
          verifyDestinationShippingFinish(data).then(response => {
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
              this.getOrderCount()
            }
          })
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.selectRadio('2')
        }
      })
      this.loadingSaveBut = false
    },
    submitDouumentReason() {
      if (this.form.reason === '' || this.form.reason === null) {
        this.$message({
          type: 'warning',
          message: 'Please fill in the reason'
        })
        return
      }
      const formData = JSON.parse(this.formData)
      const data = {
        taskCode: 'Document_Verification_Complete',
        ids: this.selectIds,
        completeValue: this.form.reason,
        sanitaryValue: this.sanitaryValue
      }
      formData[0].value = this.form.reason
      formData[0].status = 'Incomplete'
      data.formData = JSON.stringify(formData)
      console.log('verifyData', data)
      this.$refs['reasonDialogForm'].validate(valid => {
        if (valid) {
          verifyDestinationShipping(data).then(response => {
            if (response.code != null || response.code == 0) {
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              // this.queryParams.pendingTaskValue = null
              this.getList()
              this.getOrderCount()
            }
          })
          this.finshDialog = false
          this.verifyDialog = false
          this.reasonDialog = false
          this.form = {}
          this.radio = '1'
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.selectRadio('2')
        }
      })
    },
    changeSwitch(value) {
      console.log('changeSwitch value:', value)
      this.$set(this, 'sanitaryValue', value)
    },
    // invoice
    async clickInvoice(value) {
      if (this.selectIds.length < 1) {
        // this.$message({
        //   type: 'warning',
        //   message: 'Please select at least one record'
        // })
        // return
        //zane  上传模板
        this.uploadInvoice.open = true
        this.uploadInvoice.title = 'Import Invoice'
        this.formDialogVisible = false
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
    downloadingInvoiceTemplate() {
      const status = this.uploadInvoice.completeStatus

      // 设置传参值（例如 status 为 1 表示 Complete，0 表示 Not Complete）
      this.downloadInvoiceParams = {
        completeStatus: status === 'Complete' ? '1' : '0'
      }

      exportShippingInvoiceTemplate(this.downloadInvoiceParams)
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
          verifyDestinationShippingFinish(data).then(response => {
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
              this.getOrderCount()
            }
          })
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.reasonDialog = true
        }
      })
      this.loadingSaveBut = false
    },
    /** 下载模板操作 */
    downloadingTheTemplate() {
      exportShippingBrokerTemplate().then(response => {
        this.$download.excel(response, 'Pepco Shipping Broker.xlsx')
      })
    },
    submitFileForm() {
      this.$refs.upload.submit()
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
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
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
      this.data = response.data
      // this.data = this.data.concat(this.importData)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.getList()
      this.getOrderCount()
    },
    getFilterQueryData() {
      getDestinationShippingQueryFilter().then(response => {
        console.log('获取筛选条件:', response.data)
        this.portOptions = response.data.polList
        this.podOptions = response.data.podList
        this.countryList = response.data.countryList
        this.supplierIds = response.data.supplierList
        this.dc = response.data.dcList
        this.vesselList = response.data.vesselList
        this.voyageList = response.data.voyageList
        this.podVesselList = response.data.podVesselList
        this.podVoyageList = response.data.podVoyageList
        this.brokerFilterList = response.data.brokerList
        this.lpList = response.data.lpList
        // 筛选并转换数据
        // 获取供应商
        const data = {
          ids: this.supplierIds
        }
        listDept(data).then(response => {
          console.log('获取供应商列表:', response.data)
          this.$set(this, 'supplierOptions', response.data || [])
        })
      })
      getAllBrokerList()
        .then(response => {
          this.allBrokerFilterList = response.data
        })
        .catch(error => {
          console.error('获取筛选条件失败:', error)
        })
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
          revokeBroker(this.selectIds)
            .then(response => {
              if (response.code === 0) {
                console.log('Revoke broker response:', response)
                this.$message({
                  type: 'success',
                  message: 'Broker assignment revoked successfully!'
                })
                this.formDialogVisible = false
                this.loadingSaveBut = false
                this.getList()
                this.getOrderCount()
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
          this.formDialogVisible = false
        })
    },
    revokeVerifyDocument() {
      this.loadingSaveVerify = true
      // 给出确认按钮，是否进行操作

      this.$confirm('Are you sure you want to revoke the verify document?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          // 确认操作
          const data = {
            ids: this.selectIds,
            sanitaryValue: this.sanitaryValue
          }
          revokeVerify(data)
            .then(response => {
              if (response.code === 0) {
                console.log('Revoke Verify Document response:', response)
                this.$message({
                  type: 'success',
                  message: 'Verify Document revoked successfully!'
                })
                this.verifyDialog = false
                this.loadingSaveVerify = false
                this.getList()
                this.getOrderCount()
              } else {
                this.$message({
                  type: 'error',
                  message: 'Failed to revoke verify document.'
                })
              }
            })
            .catch(error => {
              this.loadingSaveBut = false
              console.error('revoke error:', error)
              this.$message({
                type: 'error',
                message: 'Failed to revoke verify document.'
              })
            })
        })
        .catch(() => {
          // 取消操作
          this.loadingSaveVerify = false
          this.verifyDialog = false
        })
    },
    clearFilters() {
      this.queryParams.pol = null
      this.queryParams.pod = []
      this.queryParams.supplierCode = null
      this.queryParams.dc = null
      this.queryParams.vessel = null
      this.queryParams.voyage = null
      this.queryParams.podVessel = null
      this.queryParams.podVoyage = null
      this.queryParams.country = null
      this.queryParams.brokerDeptName = null
      this.queryParams.etaDateRange = []

      this.queryParams.shipperBookingNumber = null
      this.queryParams.containerNo = null
      this.queryParams.orderNumber = null
      this.queryParams.mblNumber = null
      this.queryParams.hblNumber = null
      this.queryParams.pendingTaskValue = null
      this.queryParams.sanitary = null
      this.queryParams.mpNumber = null
      this.queryParams.sanitaryRisk = null
      this.queryParams.carrier = null
      this.queryParams.mblType = null
      this.queryParams.blType = null
      this.queryParams.verified = null
      this.queryParams.lpNumber = null
      this.handleQuery()
      this.handReport()
    },
    handReportChange(status, taskType) {
      if (null == status) {
        this.queryParams.verify = null
        this.queryParams.assign = null
        this.queryParams.invoice = null
        this.queryParams.finish = null
        this.queryParams.taskCode = null
      } else if (status == 1) {
        this.queryParams.verify = false
        this.queryParams.taskCode = 'Document_Verification_Complete'
        this.queryParams.assign = null
        this.queryParams.invoice = null
        this.queryParams.finish = null
      } else if (status == 2) {
        this.queryParams.verify = true
        this.queryParams.taskCode = 'Document_Verification_Complete'
        this.queryParams.assign = null
        this.queryParams.invoice = null
        this.queryParams.finish = null
      } else if (status == 3) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Customs_Broker_Assigned'
        this.queryParams.assign = false
        this.queryParams.invoice = null
        this.queryParams.finish = null
      } else if (status == 4) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Customs_Broker_Assigned'
        this.queryParams.assign = true
        this.queryParams.invoice = null
        this.queryParams.finish = null
      } else if (status == 5) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Freight_and_Local_Charges_Invoiced'
        this.queryParams.assign = null
        this.queryParams.invoice = false
        this.queryParams.finish = null
      } else if (status == 6) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Freight_and_Local_Charges_Invoiced'
        this.queryParams.assign = null
        this.queryParams.invoice = true
        this.queryParams.finish = null
      } else if (status == 7) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Customs_Clearance_Finished'
        this.queryParams.assign = null
        this.queryParams.invoice = null
        this.queryParams.finish = false
      } else if (status == 8) {
        this.queryParams.verify = null
        this.queryParams.taskCode = 'Customs_Clearance_Finished'
        this.queryParams.assign = null
        this.queryParams.invoice = null
        this.queryParams.finish = true
      }
      this.queryParams.taskType = taskType
      this.getList()
    },
    handReport() {
      const params = { ...this.queryParams }
      if (params.mblType === 'Empty Value') {
        params.mblType = ''
      }
      if (params.blType === 'Empty Value') {
        params.blType = ''
      }
      getShippingOverviewStatistics(params).then(response => {
        const overview = response.data
        this.shippingOverviewStatus = {
          shippingCount: overview.shippingCount,
          verifyDocumentDoneCount: overview.verifyDocumentDoneCount,
          verifyDocumentPossibleCount: overview.verifyDocumentPossibleCount,
          verifyDocumentUrgentCount: overview.verifyDocumentUrgentCount,
          verifyDocumentOverdueCount: overview.verifyDocumentOverdueCount,
          brokerAssignDoneCount: overview.brokerAssignDoneCount,
          brokerAssignPossibleCount: overview.brokerAssignPossibleCount,
          brokerAssignUrgentCount: overview.brokerAssignUrgentCount,
          brokerAssignOverdueCount: overview.brokerAssignOverdueCount,
          invoiceCustomsDoneCount: overview.invoiceCustomsDoneCount,
          invoiceCustomsPossibleCount: overview.invoiceCustomsPossibleCount,
          invoiceCustomsUrgentCount: overview.invoiceCustomsUrgentCount,
          invoiceCustomsOverdueCount: overview.invoiceCustomsOverdueCount,
          customsClearanceFinishDoneCount: overview.customsClearanceFinishDoneCount,
          customsClearanceFinishPossibleCount: overview.customsClearanceFinishPossibleCount,
          customsClearanceFinishUrgentCount: overview.customsClearanceFinishUrgentCount,
          customsClearanceFinishOverdueCount: overview.customsClearanceFinishOverdueCount
        }
      })
    },
    getCarriers() {
      getCarriers().then(res => {
        this.carrierList = res.data
      })
    },
    getMblTypeListByField() {
      getMblTypeListByField().then(res => {
        if (res) {
          const data = []
          res.data.forEach(item => {
            if (item === '') {
              data.push('Empty Value')
            } else {
              data.push(item)
            }
          })
          this.mblTypeList = data
        }
      })
    },
    getHblTypeListByField() {
      getHblTypeListByField().then(res => {
        if (res) {
          const data = []
          res.data.forEach(item => {
            if (item === '') {
              data.push('Empty Value')
            } else {
              data.push(item)
            }
          })
          this.hblTypeList = data
        }
      })
    },
    onMBLClear() {
      this.queryParams.mblType = null
    },
    onHBLClear() {
      this.queryParams.blType = null
    },
    formatContainerNumbers(containerNo) {
      if (!containerNo) {
        return '' // 如果值为空或 null，返回空字符串
      }
      // 使用 split(',') 拆分字符串，然后使用 map 去除每个部分前后的空格，
      // 最后使用 join(', ') 用逗号和空格重新连接起来
      return containerNo
        .split(',')
        .map(num => num.trim())
        .join(', ')
    },
    filterVerified(value, row, column) {}
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
  gap: 20px; /* 上下间距 */
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
  min-width: 1400px; /* 或你子表格所需的最小宽度 */
}
.fixed-general-info .el-table {
  min-width: 1200px; /* 取决于你子表格总列宽 */
  width: auto;
}

.activePort {
  background-color: #3a71a8;
  color: white !important; /* 强制覆盖内联 */
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
  padding-bottom: 5px; /* 防止底部裁剪 */
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
.box-scroller {
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}
.card-box-container {
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
</style>
