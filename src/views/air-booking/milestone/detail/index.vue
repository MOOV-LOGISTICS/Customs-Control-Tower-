<template>
  <el-dialog append-to-body title="Milestone Details" :visible.sync="dilaogVisibe" width="85%" top="3vh">
    <div class="dialog-container">
      <el-card v-loading="loading" class="detail-card">
        <!-- Milestone 信息 -->
        <el-descriptions title="Milestone Information" :column="3" border>
          <el-descriptions-item label="Task Name">{{ milestoneData.milestone?.taskName || '-' }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Task Code">{{ milestoneData.milestone?.taskCode || '-' }}</el-descriptions-item> -->
          <el-descriptions-item label="Level">
            <el-tag v-if="milestoneData.milestone?.level === 1" type="success">PO</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.level === 2" type="warning">Shipping Order</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.level === 3" type="primary">Carrier Booking</el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="Transport Mode">{{ milestoneData.milestone?.transportMode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag v-if="milestoneData.milestone?.status === 0" type="info">Pending</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.status === 1" type="warning">Active</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.status === 2" type="success">Done</el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="Flow Status">
            <el-tag v-if="milestoneData.milestone?.flowStatus === 0" type="info">Pending</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.flowStatus === 1">Possible</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.flowStatus === 2" type="warning">Urgent</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.flowStatus === 3" type="danger">Overdue</el-tag>
            <el-tag v-else-if="milestoneData.milestone?.flowStatus === 4" type="success">Finished</el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="POL">{{ milestoneData.milestone?.pol || '-' }}</el-descriptions-item>
          <el-descriptions-item label="POD">{{ milestoneData.milestone?.pod || '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="milestoneData.milestone.por" label="POR">{{ milestoneData.milestone?.por || '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="milestoneData.milestone.fnd" label="FND">{{ milestoneData.milestone?.fnd || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Booked ETD">{{ parseUTCWithTime(milestoneData.milestone.bookedEtd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Booked ETA">{{ parseUTCWithTime(milestoneData.milestone.bookedEta,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ETD">{{ parseUTCWithTime(milestoneData.milestone.etd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ETA">{{ parseUTCWithTime(milestoneData.milestone.eta,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ATD">{{ parseUTCWithTime(milestoneData.milestone.atd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ATA">{{ parseUTCWithTime(milestoneData.milestone.ata,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Due Date">{{ parseUTCTime(milestoneData.milestone.dueDate) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Urgent Date">{{ parseUTCTime(milestoneData.milestone.urgentDate) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Finished Time">{{ parseUTCWithTime(milestoneData.milestone.finishedTime) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Operator">{{ milestoneData.milestone?.operator || '-' }}</el-descriptions-item>
        </el-descriptions>

        <!-- Order Header 信息 -->
        <el-descriptions title="Order Header Information" :column="3" border v-if="milestoneData.orderHeader">
          <el-descriptions-item label="Order Number">{{ milestoneData.orderHeader.orderNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Transport Mode">{{ milestoneData.orderHeader.freightMethod || '-' }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Cargo Ready Date">{{ parseUTCTime(milestoneData.orderHeader.cargoReadyDate, '{y}-{m}-{d}') || '-' }}</el-descriptions-item> -->
          <el-descriptions-item label="Must Arrive By">{{ parseUTCTime(milestoneData.orderHeader.mustArriveBy, '{y}-{m}-{d}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Incoterms">{{ milestoneData.orderHeader.incoterms || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Origin Port">{{ milestoneData.orderHeader.originPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Destination Port">{{ milestoneData.orderHeader.destinationPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Task Status">{{ milestoneData.orderHeader.taskStatus || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Create Time">{{ parseUTCTime(milestoneData.orderHeader.createTime) || '-' }}</el-descriptions-item>
        </el-descriptions>

        <!-- Shipping Order 信息 -->
        <el-descriptions title="Shipping Order Information" :column="3" border v-if="milestoneData.shippingOrder">
          <el-descriptions-item label="SO Ref">{{ milestoneData.shippingOrder.soRef || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Shipper Ref">{{ milestoneData.shippingOrder.shipperRef || '-' }}</el-descriptions-item>
          <el-descriptions-item label="HBL Number">{{ milestoneData.shippingOrder.hblNumber || '-' }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Set Number">{{ milestoneData.shippingOrder.setNumber || '-' }}</el-descriptions-item> -->
          <el-descriptions-item label="Shipment Type">{{ milestoneData.shippingOrder.shipmentType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Payment Term">{{ milestoneData.shippingOrder.paymentTerm || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Origin Port">{{ milestoneData.shippingOrder.originPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Destination Port">{{ milestoneData.shippingOrder.destinationPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Cargo Ready Date">{{ parseUTCTime(milestoneData.shippingOrder.cargoReadyForPickup) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Deliver Date">{{ parseUTCTime(milestoneData.shippingOrder.deliverDate) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Contact Name">{{ milestoneData.shippingOrder.contactName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Contact Phone">{{ milestoneData.shippingOrder.contactPhone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Contact Email">{{ milestoneData.shippingOrder.contactEmail || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Remark">{{ milestoneData.shippingOrder.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <!-- Carrier Booking 信息 -->
        <el-descriptions title="Carrier Booking Information" :column="3" border v-if="milestoneData.shipment">
          <el-descriptions-item label="MOOV Ref">{{ milestoneData.shipment.moovRef || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Booking Ref">{{ milestoneData.shipment.bookingRef || '-' }}</el-descriptions-item>
          <el-descriptions-item label="AWB Number">{{ milestoneData.shipment.awbNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Airline">{{ milestoneData.shipment.airline || '-' }}</el-descriptions-item>
          <el-descriptions-item label="POR">{{ milestoneData.shipment.por || '-' }}</el-descriptions-item>
          <el-descriptions-item label="POL">{{ milestoneData.shipment.pol || '-' }}</el-descriptions-item>
          <el-descriptions-item label="POD">{{ milestoneData.shipment.pod || '-' }}</el-descriptions-item>
          <el-descriptions-item label="FND">{{ milestoneData.shipment.fnd || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Booked ETD">{{ parseUTCWithTime(milestoneData.shipment.bookedEtd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Booked ETA">{{ parseUTCWithTime(milestoneData.shipment.bookedEta,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ETD">{{ parseUTCWithTime(milestoneData.shipment.etd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ETA">{{ parseUTCWithTime(milestoneData.shipment.eta,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ATD">{{ parseUTCWithTime(milestoneData.shipment.atd,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="ATA">{{ parseUTCWithTime(milestoneData.shipment.ata,'{y}-{m}-{d} {h}:{i}') || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Payment Term">{{ milestoneData.shipment.paymentTerm || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Freight Type">{{ milestoneData.shipment.freightType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="BL Type">{{ milestoneData.shipment.blType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="BL Number">{{ milestoneData.shipment.blNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag v-if="milestoneData.shipment.status === 0" type="info">Draft</el-tag>
            <el-tag v-else-if="milestoneData.shipment.status === 1">Submitted</el-tag>
            <el-tag v-else-if="milestoneData.shipment.status === 2" type="success">Confirmed</el-tag>
            <el-tag v-else-if="milestoneData.shipment.status === 9" type="danger">Canceled</el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="Remark">{{ milestoneData.shipment.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <!-- Related Lists -->
        <el-descriptions title="Related Shipping Orders" :column="1" v-if="milestoneData.shippingOrders && milestoneData.shippingOrders.length > 0">
          <el-descriptions-item labelClassName="no-colon">
            <el-table :data="milestoneData.shippingOrders" border>
              <el-table-column prop="soRef" label="SO Ref" min-width="120" />
              <el-table-column prop="shipperRef" label="Shipper Ref" min-width="120" />
              <el-table-column prop="hblNumber" label="HBL Number" min-width="150" />
              <el-table-column prop="shipmentType" label="Shipment Type" min-width="100" />
              <el-table-column prop="originPort" label="Origin Port" min-width="120" />
              <el-table-column prop="destinationPort" label="Destination Port" min-width="120" />
              <el-table-column prop="paymentTerm" label="Payment Term" min-width="120" />
              <!-- <el-table-column prop="status" label="Status" min-width="100">
                <template v-slot="{ row }">
                  <el-tag v-if="row.status === 0" type="info">Requested</el-tag>
                  <el-tag v-else-if="row.status === 1" type="success">Accepted</el-tag>
                  <el-tag v-else-if="row.status === 2" type="danger">Rejected</el-tag>
                </template>
              </el-table-column>-->
              <el-table-column prop="createTime" label="Create Time" min-width="180">
                <template v-slot="{ row }">{{ parseUTCTime(row.createTime) }}</template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="Related Orders" :column="1" v-if="milestoneData.orderHeaders && milestoneData.orderHeaders.length > 0">
          <el-descriptions-item labelClassName="no-colon">
            <el-table :data="milestoneData.orderHeaders" border>
              <el-table-column prop="orderNumber" label="Order Number" min-width="130" align="center" />
              <el-table-column prop="soRef" label="SO Ref" min-width="130" align="center" />
              <el-table-column prop="taskStatus" label="Pending Status" min-width="150" align="center" />
              <el-table-column label="Supplier Name" min-width="180" prop="seller" show-overflow-tooltip>
                <template v-slot="scope">
                  <bsc-supplier-text :supplierId="scope.row.seller" />
                </template>
              </el-table-column>
              <el-table-column label="HOD" min-width="110" prop="cargoHandoverDate">
                <template v-slot="scope">{{ parseUTCTime(scope.row.cargoHandoverDate) }}</template>
              </el-table-column>
              <el-table-column label="Planned CRD" min-width="110" prop="cargoHandoverDate">
                <template v-slot="scope">{{ parseUTCTime(scope.row.cargoHandoverDate - (7 * 24 * 60 * 60 * 1000)) }}</template>
              </el-table-column>
              <el-table-column label="In-DC Date" min-width="110" prop="deliveryDate">
                <template v-slot="scope">{{ parseUTCTime(scope.row.deliveryDate) }}</template>
              </el-table-column>
              <el-table-column label="Sanitary Risk" min-width="110" prop="sanitaryRisk" align="center">
                <template v-slot="scope">
                  <span :style="{ color: scope.row.sanitaryRisk ? 'red' : 'green' }">{{ scope.row.sanitaryRisk ? 'Y' : 'N' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Booking Date" min-width="110" prop="lastBookingTime">
                <template v-slot="scope">{{ parseUTCTime(scope.row.lastBookingTime) }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="Create Time" width="180">
                <template v-slot="{ row }">{{ parseUTCWithTime(row.createTime) }}</template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>

        <!-- Order Files -->
        <!-- <el-descriptions title="Order Files" :column="1" v-if="milestoneData.orderFiles && milestoneData.orderFiles.length > 0">
          <el-descriptions-item labelClassName="no-colon">
            <el-table v-if="milestoneData.orderFiles && milestoneData.orderFiles.length > 0" :data="milestoneData.orderFiles" border>
              <el-table-column prop="typeCode" label="Type Code" min-width="120" />
              <el-table-column prop="taskName" label="Task Name" min-width="150" />
              <el-table-column prop="documentNumber" label="Document Number" min-width="150" />
              <el-table-column prop="fileName" label="File Name" min-width="200" />
              <el-table-column prop="poNumber" label="PO Number" min-width="150" />
              <el-table-column prop="shippingOrderNumber" label="SO Number" min-width="150"  />
              <el-table-column prop="carrierBookingNumber" label="Booking Number" min-width="150"  />
              <el-table-column label="File URL" width="120">
                <template v-slot="{ row }">
                  <el-button type="text" @click="handlePreview(row)" icon="el-icon-download">Download</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="Create Time" width="180">
                <template v-slot="{ row }">{{ parseUTCTime(row.createTime) }}</template>
              </el-table-column>
            </el-table>
            <el-empty v-else description="No order files"></el-empty>
          </el-descriptions-item>
        </el-descriptions>-->

        <!-- MAWB File -->
        <!-- <el-descriptions title="MAWB File" :column="1" v-if="milestoneData.mawb">
          <el-descriptions-item labelClassName="no-colon">
            <el-card style="max-width: 600px;">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="Type Code">{{ milestoneData.mawb.typeCode || '-' }}</el-descriptions-item>
                <el-descriptions-item label="File Name">{{ milestoneData.mawb.fileName || '-' }}</el-descriptions-item>
                <el-descriptions-item label="Document Number">{{ milestoneData.mawb.documentNumber || '-' }}</el-descriptions-item>
                <el-descriptions-item label="Operation">
                  <el-button type="primary" @click="handlePreview(milestoneData.mawb)" icon="el-icon-download">Download MAWB</el-button>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-descriptions-item>
        </el-descriptions>-->
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
import { milestoneDetail } from '@/api/air/booking'

export default {
  name: 'AirMilestoneDetail',
  data() {
    return {
      dilaogVisibe: false,
      loading: false,
      milestoneId: null,
      milestoneData: {
        level: null,
        milestone: {},
        orderHeader: {},
        shippingOrder: {},
        shipment: {},
        orderHeaders: [],
        shippingOrders: [],
        orderFiles: [],
        mawb: null
      }
    }
  },
  created() {},
  methods: {
    openDialog(milestone) {
      this.milestoneId = milestone.id
      this.milestoneData.milestone = milestone
      this.dilaogVisibe = true
      this.getMilestoneDetail()
    },
    getMilestoneDetail() {
      this.loading = true
      milestoneDetail(this.milestoneId)
        .then(response => {
          this.milestoneData = response.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handlePreview(file) {
      if (file.fileUrl) {
        window.open(file.fileUrl, '_blank')
      } else if (file.id) {
        window.location.href = file.url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  max-height: 80vh;
  overflow-y: auto;
  padding: 5px 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background-color: #a8a8a8;
    }
  }
}

.detail-card {
  margin-bottom: 180px;
}

:deep(.el-descriptions) {
  &:not(:first-child) {
    margin-top: 25px;
  }

  .el-descriptions__title {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    padding-bottom: 12px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ebeef5;

    &::before {
      content: '';
      display: inline-block;
      margin-right: 10px;
      width: 4px;
      height: 18px;
      background-color: #409eff;
      border-radius: 2px;
    }
  }

  .el-descriptions-item__label {
    font-weight: 500;
    color: #606266;
  }

  .no-colon {
    &::after {
      content: '' !important;
    }
  }
}

:deep(.el-table) {
  margin-top: 10px;

  th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 600;
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
  max-height: calc(80vh - 110px);
  overflow: hidden;
}
</style>
