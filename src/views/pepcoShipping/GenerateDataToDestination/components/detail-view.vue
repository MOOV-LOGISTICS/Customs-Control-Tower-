<template>
  <div class="detail-view">
    <el-descriptions title="Shipment Info" :colon="false" style="border: none;padding: 15px!important;background: #fff;"
      :column="4">
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

    <!-- 差异提示 -->
    <el-alert v-if="containerDifference.hasError" :title="containerDifferenceTitle" type="warning" :closable="false"
      style="margin-top: 20px;">
      <div v-if="containerDifference.onlyInContainerList.length > 0" style="margin-bottom: 8px;">
        <strong style="color: #E6A23C;">Only exists in SI/VGM Submitted To The Carrier:</strong>
        <span style="margin-left: 10px;">{{ containerDifference.onlyInContainerList.join(', ') }}</span>
      </div>
      <div v-if="containerDifference.onlyInClpDetailList.length > 0">
        <strong style="color: #F56C6C;">Only exists in CLR:</strong>
        <span style="margin-left: 10px;">{{ containerDifference.onlyInClpDetailList.join(', ') }}</span>
      </div>
    </el-alert>

    <!-- Containers Info -->
    <el-card shadow="hover" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span style="font-weight: 600; font-size: 14px;">SI/VGM Submitted To The Carrier</span>
      </div>
      <el-table :data="containerList" border style="width: 100%; margin-top: 10px;" v-loading="loading"
        class="detail-table" :row-class-name="containerRowClass">
        <el-table-column label="Container No" min-width="150" prop="containerNo" />
        <el-table-column label="Container Seal No" min-width="150" prop="containerSealNumber" />
        <el-table-column label="Container Type" min-width="120" prop="containerType" />
        <el-table-column label="SOC" min-width="150" prop="soc" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.soc ? 'Yes' : 'No' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Volume" min-width="120" prop="volume" />
      </el-table>
    </el-card>

    <el-card shadow="hover" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span style="font-weight: 600; font-size: 14px;">CLR</span>
      </div>
      <el-table :data="processedShipmentClpDetailList" border style="width: 100%; margin-top: 10px;" v-loading="loading"
        class="detail-table" :row-class-name="clpDetailRowClass">
        <el-table-column label="Container No" min-width="150" prop="containerNo" />
        <el-table-column label="Container Seal No" min-width="150" prop="containerSealNumber" />
        <el-table-column label="Container Type" min-width="120" prop="containerType" />
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="shippingOrders" v-loading="loading">
        <el-table-column prop="soRef" label="Shipper Booking Number" min-width="140px" align="center" />
        <el-table-column prop="shipmentType" label="Shipment Type" min-width="100px" align="center" />
        <el-table-column prop="hblNumber" label="HBL Number" min-width="140px" align="center">
          <template #default="scope">
            <span v-if="scope.row.hblNumber">{{ scope.row.hblNumber }}</span>
            <el-tag v-else type="danger">Undone</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="typeCode" label="Document Type" align="center" min-width="100px">
          <template #default="scope">
            <span>{{fileTypes.find(type => type.value === scope.row.typeCode)?.label}}</span>
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
        <el-table-column label="Action" width="200px" align="center">
          <template #default="scope">
            <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download"
              :fileName="scope.row.fileName" />
            <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview"
              :fileName="scope.row.fileName" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="clpTasks" v-loading="loading">
        <el-table-column prop="orderNumber" label="Order Number" min-width="130px" align="center" />
        <el-table-column prop="taskName" label="Task Name" min-width="130px" align="center" />
        <el-table-column label="Supplier Name" min-width="200" prop="supplierCode" show-overflow-tooltip>
          <template v-slot="scope">
            <bsc-supplier-text :supplierId="scope.row.supplierId" />
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" label="Supplier Code" min-width="130px" align="center" />
        <el-table-column prop="dc" label="DC" min-width="130px" align="center" />
        <el-table-column prop="soRef" label="Shipper Booking Number" min-width="140px" align="center" />
        <el-table-column prop="containerNo" label="Container No" min-width="130px" align="center" />
        <el-table-column prop="containerType" label="Container Type" min-width="130px" align="center" />
        <el-table-column prop="finishedTime" label="Finished Time" align="center">
          <template #default="scope">
            <span>{{ parseTime(scope.row.finishedTime) }}</span>
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
            <el-tag v-else-if="scope.row.clrStatus == 'Undone'" type="danger">Undone</el-tag>
            <el-tag v-else-if="scope.row.clrStatus == 'Done'" type="success">Done</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <upload-file ref="uploadFileRef" />
  </div>
</template>

<script>
import { getDetails } from '@/api/pepco/shipping-order'
import { parseUTCTime } from '@/utils/ruoyi'
import UploadFile from './upload-file.vue'

export default {
  name: 'DetailView',
  components: { UploadFile },
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      queryParams: {
        shipmentId: null,
        orderNumber: null
      },
      fileTypes: [
        { label: 'MBL', value: '04' },
        { label: 'HBL', value: '03' }
      ],
      shipment: {},
      mblFile: {},
      containerList: [],
      shipmentClpDetailList: [],
      shippingOrders: [],
      clpTasks: [],
      loading: false,
      containerDifference: {
        hasError: false,
        onlyInContainerList: [],
        onlyInClpDetailList: []
      }
    }
  },
  computed: {
    // 处理后的shipmentClpDetailList：根据containerNo去重，将空值替换为"/"
    processedShipmentClpDetailList() {
      // 根据containerNo去重
      const uniqueList = [
        ...new Map(
          this.shipmentClpDetailList.map(item => [item.containerNo, item])
        ).values()
      ]

      // 将空值替换为"/"
      return uniqueList.map(item => ({
        ...item,
        containerSealNumber: item.containerSealNumber || '/',
        containerType: item.containerType || '/'
      }))
    },

    // 差异提示标题
    containerDifferenceTitle() {
      return 'Container Number Differences Detected'
    }
  },
  watch: {
    'record.id': {
      immediate: true,
      handler(val, oldVal) {
        console.log('record.id changed:', oldVal, '→', val)
        if (val) {
          this.queryParams.shipmentId = val
          this.fetchDetail()
        }
      }
    }
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      try {
        const params = { ...this.queryParams }
        const res = await getDetails(params)

        const { shipment, mbl, shippingOrders, clpTasks, containerList, shipmentClpList, shipmentClpDetailList } = res.data || {}
        this.shipment = shipment || {}
        this.mblFile = mbl || {}
        this.containerList = containerList || []
        // this.containerList.push(
        //   { containerNo: 'zanetestClp2' },
        //   { containerNo: 'zanetestClp2' },
        //   { containerNo: 'zanetestClp3' }
        // )

        this.shipmentClpDetailList = shipmentClpDetailList || []
        // this.shipmentClpDetailList.push(
        //   { containerNo: 'zanetestClp1' },
        //   { containerNo: 'zanetestClp1' },
        //   { containerNo: 'zanetestClp3' }
        // )

        // 检测两个表的containerNo差异
        this.checkContainerDifference()

        // ✅ 处理 shippingOrders
        if (shippingOrders && shippingOrders.length > 0) {
          shippingOrders.forEach(shipping => {
            if (shipmentClpList && shipmentClpList.length > 0) {
              const tmpClp = shipmentClpList.find(cpl => cpl.soNumbers.includes(shipping.soRef))
              shipping.clrStatus = tmpClp ? tmpClp.status : 'Undone'
              shipping.totalCbm = tmpClp ? tmpClp.totalCbm : '/'
              shipping.totalQty = tmpClp ? tmpClp.totalQty : '/'
              shipping.totalWeight = tmpClp ? tmpClp.totalWeight : '/'
            }
          })
        }
        this.shippingOrders = [...(shippingOrders || [])]

        // ✅ 处理 clpTasks
        if (clpTasks && clpTasks.length > 0) {
          clpTasks.forEach(ele => {
            const tmpDetails = shipmentClpDetailList.filter(
              clpDetail => clpDetail.orderNumber === ele.orderNumber
            )
            if (tmpDetails && tmpDetails.length > 0) {
              ele.containerNo = tmpDetails.map(detail => detail.containerNo).join(', ')
              ele.containerType = tmpDetails[0].containerType
            }
            ele.clrStatus = ele.containerNo ? 'Done' : 'Undone'
            ele.containerNo = ele.containerNo || '/'
            ele.containerType = ele.containerType || '/'
          })
        }
        this.clpTasks = [...(clpTasks || [])]

        this.$nextTick(() => {
          this.$refs.uploadFileRef.initComponent(this.shipment.id, this.isEdit)
        })
      } catch (e) {
        console.log(e)
        this.$message.error('Failed to load shipment detail')
      } finally {
        this.loading = false
      }
    },

    // 检测containerNo差异（用于差异提示，去重）
    checkContainerDifference() {
      // 获取两个表的containerNo集合（去重）
      const containerListNos = new Set(
        this.containerList.map(item => item.containerNo).filter(Boolean)
      )
      const clpDetailListNos = new Set(
        this.shipmentClpDetailList.map(item => item.containerNo).filter(Boolean)
      )

      // 找出只在containerList中存在的（去重后的结果）
      const onlyInContainerList = [...containerListNos].filter(
        containerNo => !clpDetailListNos.has(containerNo)
      )

      // 找出只在shipmentClpDetailList中存在的（去重后的结果）
      const onlyInClpDetailList = [...clpDetailListNos].filter(
        containerNo => !containerListNos.has(containerNo)
      )

      // 更新差异状态
      this.containerDifference = {
        hasError: onlyInContainerList.length > 0 || onlyInClpDetailList.length > 0,
        onlyInContainerList,
        onlyInClpDetailList
      }
    },

    // containerList表格行样式（用于表格高亮，需要匹配所有重复行）
    containerRowClass({ row }) {
      if (this.containerDifference.onlyInContainerList.includes(row.containerNo)) {
        return 'container-difference-row'
      }
      return ''
    },

    // shipmentClpDetailList表格行样式（用于表格高亮，需要匹配所有重复行）
    clpDetailRowClass({ row }) {
      if (this.containerDifference.onlyInClpDetailList.includes(row.containerNo)) {
        return 'clp-detail-difference-row'
      }
      return ''
    }
  }
}
</script>

<style scoped>
.detail-view {
  padding: 16px;
}

/* containerList差异行样式 - 橙色 */
.detail-view>>>.container-difference-row {
  background-color: #fff3e0 !important;
}

.detail-view>>>.container-difference-row:hover>td {
  background-color: #ffe0b2 !important;
}

/* shipmentClpDetailList差异行样式 - 红色 */
.detail-view>>>.clp-detail-difference-row {
  background-color: #ffebee !important;
}

.detail-view>>>.clp-detail-difference-row:hover>td {
  background-color: #ffcdd2 !important;
}
</style>