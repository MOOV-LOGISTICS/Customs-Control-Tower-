<template>
  <div>
    <!-- Order Lines -->
    <el-table v-loading="loading" :data="lines" show-summary sum-text="Total" :summary-method="getSummaries"
      size="mini">
      <el-table-column prop="orderNumber" label="Order Number" min-width="120" align="center"></el-table-column>
      <el-table-column prop="itemNumber" label="Item Number" min-width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="itemName" label="Item Name" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="tcId" label="TCId" width="80" align="center"></el-table-column>
      <!-- <el-table-column prop="promoCode" label="Promote Code" min-width="90" align="center"></el-table-column> -->
      <el-table-column prop="promoCode" label="Promote Code" min-width="90" align="center">
        <template #default="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.promoCode" placement="top">
            <span class="ellipsis-text">{{ scope.row.promoCode }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="orderedOuter" label="Ordered Outer(Cartons)" min-width="140"
        align="center"></el-table-column>
      <el-table-column prop="bookedOuter" label="Booked Outer(Cartons)" min-width="130"
        align="center"></el-table-column>
      <el-table-column prop="orderedInner" label="Ordered Inner(Cartons)" min-width="140" align="center">
        <template v-slot="scope">
          <!-- <span v-if="scope.row.bookedProInnerPerOuter != 0">{{ scope.row.orderedInner }}</span>
          <span v-else>-</span>-->
          <span>{{ scope.row.orderedInner }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bookedInner" label="Booked Inner(Cartons)" width="130" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.bookedProInnerPerOuter != 0">{{ scope.row.bookedInner }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="differs01" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{ row }">
          <span v-if="row.bookedProInnerPerOuter == 0"
            :style="{ color: row.orderedOuter == row.bookedOuter ? '' : '#F56C6C' }">{{ ((row.bookedOuter -
              row.orderedOuter) / row.orderedOuter * 100).toFixed(2) }}</span>
          <span v-else :style="{ color: row.orderedInner == row.bookedInner ? '' : '#F56C6C' }">{{ ((row.bookedInner -
            row.orderedInner) / row.orderedInner * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="Volume(cbm)" min-width="100" align="center"></el-table-column>
      <el-table-column prop="grossWeight" label="Gross Weight(kg)" min-width="120" align="center"></el-table-column>
      <el-table-column prop="orderedPieces" label="Ordered Pieces" min-width="120" align="center"></el-table-column>
      <el-table-column prop="bookedPieces" label="Booked Pieces" min-width="120" align="center"></el-table-column>

      <el-table-column prop="differs02" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{ row }">
          <span :style="{ color: row.orderedPieces == row.bookedPieces ? '' : '#F56C6C' }">{{ ((row.bookedPieces -
            row.orderedPieces) / row.orderedPieces * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <!--添加是否符合审批标准的判断 edwin-->
      <el-table-column prop="dc" label="DC" min-width="80" align="center"></el-table-column>
      <el-table-column label="IN-DC Date" with="80" align="center">
        <template v-slot="{ row }">{{ parseUTCTime(row.dcDate) }}</template>
      </el-table-column>
      <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Planned/Supplier(CRD)"
        width="160" align="center">
        <template v-slot="{ row }">{{ parseUTCTime(row.plannedCrd) }} / {{ parseUTCTime(row.supplierCrd) }}</template>
      </el-table-column>
      <!-- 添加 Requested Handover Date -->
      <el-table-column label="Handover Date" width="150" min-with="80" align="center">
        <template v-slot="{ row }">{{ parseUTCTime(row.cargoHandoverDate) }}</template>
      </el-table-column>
      <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Approval Criteria(CRD)"
        width="140" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="approvalCriteria.crdMap[row.orderId] == 0" type="success">Match</el-tag>
          <el-tag v-else type="danger">Not Match</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Approval Criteria(TC QTY)"
        width="150" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="approvalCriteria.tcQuantitiesMap[row.id] == 0" type="success">Match</el-tag>
          <el-tag v-else type="danger">Not Match</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Art Structure" width="130"
        align="center">
        <template v-slot="{ row }">{{ row.artStructure }}</template>
      </el-table-column>
      <!-- 更换为 po tag -->
      <!-- <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Children Toy" width="130"
        align="center">
        <template v-slot="{ row }">
          <el-tag v-if="approvalCriteria.artStructureMap[row.id] == 0" type="success">No</el-tag>
          <el-tag v-else type="danger">Yes</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="approvalCriteria && !this.approvalCriteria.isDraft" label="Sanitary Risk" width="130"
        align="center">
        <template v-slot="{ row }">
          <el-tag v-if="!row.sanitaryRisk" type="success">N</el-tag>
          <el-tag v-else type="danger">Y</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="OTB" prop="otb" width="80" align="center">
        <template v-slot="{ row }">
          <template v-if="row.otb === '1'">
            YES
          </template>
          <template v-else-if="row.otb === '0'">
            NO
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column label="NOS" width="130" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="!row.nos" type="success">No</el-tag>
          <el-tag v-else type="danger">Yes</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="PO Tag" min-width="150" align="center">
        <template #default="{ row }">
          <template v-if="getPoTags(row, { approvalCriteria }).length">
            <el-tag
              v-for="tag in getPoTags(row, { approvalCriteria })"
              :key="tag.code"
              :type="tag.type"
              size="small"
              :class="tag.className"
            >
              {{ tag.label }}
            </el-tag>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
     <!-- order approval-->
     <el-table-column v-if="showPoApprovalBtn()" label="Action" min-width="150" align="center" fixed="right">
       <template #default="{ row, $index }">
          <div v-if="isFirstOrderRow(row, $index) && !orderApprovalStatus[row.orderId]">
            <el-button type="success" circle icon="el-icon-check" :disabled="orderApprovalStatus[row.orderId]"
              @click="pepcoOrderApproval(row)" />
            <el-button type="warning" circle icon="el-icon-more" :disabled="shippingOrder?.status == 6 || orderApprovalStatus[row.orderId]"
              @click="PepcoPendingStatus(shippingOrder.id, 6, null, shippingOrder.soRef)" />
            <el-button type="danger" circle icon="el-icon-close" :disabled="orderApprovalStatus[row.orderId]"
              @click="pepcoOrderReject(row)" />
          </div>
          <div v-else-if="orderApprovalStatus[row.orderId]">
            <el-tag type="success">SAApproved</el-tag>
          </div>
        </template>
      </el-table-column>


      <!-- order details 中物品明细 sanitary risk 列     -->
      <!--      <el-table-column v-if="!approvalCriteria" label="Sanitary Risk" min-width="90" align="center">-->
      <!--        <template v-slot="{row}">-->
      <!--          <el-tag v-if="row.sanitaryRisk==0" type="success">N</el-tag>-->
      <!--          <el-tag v-else type="danger">Y</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pepco-reject-dialog ref="rejectDialog" @submit="handlePepcoOrderReject"/>
  </div>
</template>


<script>
import { getOrderHeaderList } from '@/api/pepco/shipping-order.js'
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'
import { updateOrderBookingApproval} from '@/api/order/task.js'
import {
  shippingApprovalStatus,
  updateBookingApprovalAfterPerPo,
  updateShippingOrderStatus,
  pepcoRejectPoFromShipping,
} from '@/api/pepco/shipping-order.js'
import pepcoRejectDialog from './pepco-reject-dialog.vue'


/**
 * OrderItemTable
 * @author Ethan
 * @description This component displays the order item table with order header and order lines.
 */
export default {
  name: 'OrderItemTable',
  components: {
    pepcoRejectDialog
  },
  props: {
    approvalCriteria: {
      type: Object,
      required: false
    },
    shippingOrder:{
      type: Object,
      required: false,
      default: () => ({})
    },
    hasPepcoPermssion: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      dataList: [],
      lines: [],
      rows: [],
      loading: false,
      iEdit: true,
      sumData: {},
      orderApprovalStatus:{},
      showPoApproval: false,
      updateSoStatusLoading: false,
      showPepcoCloseRemark: false,
      showPepcoCloseBut: false,
    }
  },
  created() {
    console.log('OrderDetail created')
  },
  methods: {
    async active(shippingOrderId, showPoApproval = false) {
      this.showPoApproval = showPoApproval
      this.loading = true
      // 获取审批状态
      await shippingApprovalStatus({ shippingId: shippingOrderId }).then(statusRes => {
        console.log('approval status', statusRes.data)
        statusRes.data.forEach(item => {
          // status === 2 表示审批通过
          this.$set(this.orderApprovalStatus, item.orderId, item.status === 2)
        })
        console.log('orderApprovalStatus', this.orderApprovalStatus)
      }).catch(err => {
        console.log('获取审批状态失败', err)
      })
      getOrderHeaderList({ shippingOrderId: shippingOrderId })
        .then(res => {
          console.log('返回值，', res.data)
          this.refresh(res.data)
          this.$emit('complete', res.data) // 触发父组件的 active 事件
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    getPoTags(row, context = {}) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
        row.nos = false
      }
      return PO_TAG_RULES
        .filter(rule => rule.match?.(row, context))
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
    },
    refresh(rows) {
      this.dataList = []
      this.lines = []
      console.log('order-detail==>', rows)
      this.rows = rows
      rows.forEach(row => {
        let items = []

        const header = {
          id: row.id,
          orderNumber: row.orderNumber
        }

        // 生成行数据
        row.items.forEach(item => {
          console.log(item)
          const tmp = {
            id: item.id,
            orderId: item.orderId,
            orderNumber: row.orderNumber,
            itemNumber: item.productCode,
            itemName: item.productName,
            tcId: item.tcId,
            promoCode: item.promoCode,
            orderedPieces: item.tcQty * item.tcSize,
            outerQty: item.outerQty,
            outerSize: item.outerSize,
            tcSize: item.tcSize,
            tcQty: item.tcQty,
            bookedProOuterSize: item.bookedProOuterSize,
            bookedProInnerPerOuter: item.bookedProInnerPerOuter,
            outerWeight: item.outerWeight || 0,
            length: item.length,
            width: item.width,
            height: item.height,
            // 计划的crd
            plannedCrd: row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000,
            // supplier 实际传的crd
            supplierCrd: row.cargoReadyDate,
            // dc date
            dcDate: row.deliveryDate,
            // art structure
            artStructure: item.artStructure,
            sanitaryRisk: item.sanitaryRisk,
            dc: row.dc,
            otb: row.otb,
            nos: item.nos,
            supplyModel: row.supplyModel,
            isCeramicProducts: item.isCeramicProducts,
          }
          tmp.cargoHandoverDate = row.cargoHandoverDate
          tmp.orderedOuter = item.outerQty
          tmp.orderedInner = item.tcQty
          tmp.bookedOuter = item.booked
          tmp.bookedInner = item.bookedInner
          tmp.bookedPieces = item.bookedPieces
          tmp.grossWeight = (tmp.bookedOuter * tmp.outerWeight).toFixed(3)
          tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(3) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000

          items = [...items, tmp]
        })
        this.lines = [...this.lines, ...items]
        console.log('this.lines===>', this.lines)
        header.items = items
        this.dataList = [...this.dataList, header]
      })
      // dataList 抽取orderNumber，使用逗号连接
      // const orderNumbers = this.dataList.map(item => item.orderNumber).join(',')
      const orderNumbers = this.dataList.map(item => item.orderNumber)
      const itemNames = this.lines.map(item => item.itemName)
      console.log('lines===>', this.lines)
      const result = {
        orderNumbers: Array.from(new Set(orderNumbers)),
        itemNames: Array.from(new Set(itemNames))
      }
      console.log(result)
      this.$emit('render', result)
    },
    handleBookedOuter(row) {
      if (row.bookedProInnerPerOuter != 0) {
        this.$set(row, 'bookedInner', row.bookedOuter * row.bookedProInnerPerOuter)
      }

      this.$set(row, 'bookedPieces', row.bookedOuter * row.bookedProOuterSize)
      this.$set(row, 'grossWeight', row.bookedOuter * row.outerWeight)
      this.$set(row, 'volume', ((row.bookedOuter * row.length * row.width * row.height) / 1000000).toFixed(3)) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000
    },
    handleBookedInner(row) {
      // 每内箱pcs数
      const innerSize = row.bookedProOuterSize / row.bookedProInnerPerOuter

      this.$set(row, 'bookedPieces', row.bookedInner * innerSize)
      this.$set(row, 'grossWeight', row.bookedOuter * row.outerWeight)
      this.$set(row, 'volume', ((row.bookedOuter * row.length * row.width * row.height) / 1000000).toFixed(3)) // 体积单位是立方米，长宽高
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []

      if (!columns) {
        return (sums = [])
      }
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = 'Total' //可更改合计行的名称
          return
        }
        let arr = ['grossWeight', 'volume', 'orderedOuter', 'bookedOuter', 'orderedInner', 'bookedInner', 'bookedPieces', 'orderedPieces']
        if (arr.includes(column.property)) {
          let total = 0
          let flag = false
          data.forEach(item => {
            total += Number(item[column.property])
            if (item.bookedProInnerPerOuter == 0) {
              flag = true
            }
          })
          if (column.property == 'volume' || column.property == 'grossWeight') {
            total = total == 0 ? 0 : total.toFixed(3)
          }
          if ((column.property == 'orderedInner' || column.property == 'bookedInner') && flag) {
            // 如果 bookedProInnerPerOuter 为 0（无内箱），则 orderedInner 和 bookedInner 显示
            total = ' '
          }

          sums[index] = total
        }
      })
      console.log('sums', sums)
      this.sumData = sums
      let sumsRow = {
        bookedOuter: Number(sums[4]) || 0,
        grossWeight: (Number(sums[9]) || 0).toFixed(3),
        volume: Number(sums[8]) || 0
      }
      console.log('sumsRow', sumsRow)
      this.$emit('sum', sumsRow)
      return sums
    },
    handlePoClick() {
      this.$refs.poDialog.openDialog(this.rows)
    },
    getDataList() {
      return this.dataList
    },
    isFirstOrderRow(row, index) {
      return index === this.lines.findIndex(item => item.orderId === row.orderId)
    },
    showPoApprovalBtn(){
      // const hasPermission = this.hasPepcoPermssion
      // && (this.shippingOrder.shipmentId == null || this.shippingOrder.shipmentId == 0)
      // && (this.shippingOrder.status == 5 || this.shippingOrder.status == 6)
      // && (this.shippingOrder.freightMethod == 'sea' ||  this.shippingOrder.freightMethod == 'sea_air')
      // console.log('showPoApprovalBtn', hasPermission)
      // 按要求先注释掉，等功能优化 edwin 2026.03.27
      const hasPermission = false
      return hasPermission
    },
    pepcoOrderApproval(row) {
      this.$confirm('Pepco Approval:[' + row.orderNumber + ']?', '', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$emit('orderDetailLoading', true)
        // 更新单个po
        updateOrderBookingApproval(row.orderId).then(res => {
          // 更新完单个po看看整个so是否可以自动处理
          updateBookingApprovalAfterPerPo(this.shippingOrder.id).then(res => {
          }).finally(() => {
            this.refreshPage()
          });
        });
      }).catch(() => {
      });
    },
    pepcoOrderReject(row) {
      this.$refs.rejectDialog.openOrderRejectDialog(row, this.shippingOrder)
    },
    handlePepcoOrderReject(formData) {
      console.log('handlePepcoOrderReject', formData)
      const closeRemark = formData.closeRemark
      const orderId = formData.orderId
      const orderNumber = formData.orderNumber
      if (this.shippingOrder.shipmentType === 'FCL') {
        this.$confirm('This Shipping Order is FCL, Are you sure you want to return this Shipping Order ?', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$refs.rejectDialog.closeDialog()
          this.$emit('orderDetailLoading', true)
          this.updateStatus(this.shippingOrder.id, 7, closeRemark)
        }).catch(() => {
          this.$refs.rejectDialog.closeLoading()
        });
      } else if (this.shippingOrder.shipmentType === 'LCL') {
        this.$confirm('Are you sure you want to return this order [' + orderNumber + ']?', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$emit('orderDetailLoading', true)
          pepcoRejectPoFromShipping({
            shippingOrderId: this.shippingOrder.id,
            orderHeaderId: orderId,
            closeRemark: closeRemark
          }).then(() => {
            this.$refs.rejectDialog.closeDialog()
            // 更新完单个po看看整个so是否可以自动处理
            updateBookingApprovalAfterPerPo(this.shippingOrder.id).then(res => {
            }).finally(() => {
              this.refreshPage()
            });
          })
        }).catch(() => {
          this.$refs.rejectDialog.closeLoading()
        });
      }
    },
    PepcoPendingStatus(id, status, rejectedText, soRef) {
      this.$confirm('Pepco Pending ' + soRef + '?', '', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$emit('orderDetailLoading', true)
        this.updateStatus(id, status, rejectedText).then(() => {
          this.refreshPage()
        })
      }).catch(() => {
      });
    },
    updateStatus(id, status, rejectedText) {
      console.log('updateStatus', id, status, rejectedText)
      if (this.updateSoStatusLoading) return
      this.updateSoStatusLoading = true
      updateShippingOrderStatus({ id: id, status: status, rejectedText: rejectedText }).then(res => {
        this.updateSoStatusLoading = false
        this.$notify({
          title: 'Success',
          message: 'Success',
          type: 'success'
        });
        this.$router.push("/shipment/ppShippingOrderList")
      }).catch(() => {
        this.updateSoStatusLoading = false
      });
    },
    refreshPage() {
      this.$emit('refreshPage')
    }
  },
}
</script>

<style scoped>
.order-item-table {
  padding: 5px;
  background-color: #fff;
}
.mr-4 {
  margin-right: 4px;
}
/* Ceramic Products 的紫色标签样式 */
::v-deep .tag-purple.el-tag--info {
  background-color: #9b59b6;
  border-color: #8e44ad;
  color: #fff;
}

.ellipsis-text {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
