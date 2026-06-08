<template>
  <div>
    <el-button v-if="!addRemoveButtonDisabled" style="float: right;" type="primary" @click="handlePoClick">Add / Remove PO</el-button>
    <!-- Order Lines -->
    <el-table :data="lines" show-summary sum-text="Total" :summary-method="getSummaries" size="mini">
      <el-table-column prop="orderNumber" label="Order Number" min-width="160" align="left">
        <template v-slot="scope">
          <!-- <span v-if="scope.row.isNewAdd" style="color:red">*</span> -->
          {{ scope.row.orderNumber }}
          <el-tag v-if="scope.row.isNewAdd" type="danger" size="mini">New</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="itemNumber" label="Item Number" min-width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="itemName" label="Item Name" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="tcId" label="TCId" min-width="80" align="center"></el-table-column>
      <el-table-column prop="orderedOuter" label="Ordered Outer(Cartons)" min-width="140" align="center"></el-table-column>
      <el-table-column prop="bookedOuter" label="Booked Outer(Cartons)" min-width="130" align="center">
        <template v-slot="scope">
          <el-input-number v-model="scope.row.bookedOuter" :min="0" @change="handleBookedOuter(scope.row)"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="orderedInner" label="Ordered Inner(Cartons)" min-width="140" align="center">
        <template v-slot="scope">
          <!-- <span v-if="scope.row.bookedProInnerPerOuter != 0">{{ scope.row.orderedInner }}</span>
          <span v-else>-</span>-->
          <span>{{ scope.row.orderedInner }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bookedInner" label="Booked Inner(Cartons)" min-width="130" align="center">
        <template v-slot="scope">
          <el-input-number v-if="scope.row.bookedProInnerPerOuter != 0" v-model="scope.row.bookedInner" :min="0" @change="handleBookedInner(scope.row)"></el-input-number>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="differs" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{row}">
          <span v-if="row.bookedProInnerPerOuter==0" :style="{color: row.orderedOuter == row.bookedOuter? '' : '#F56C6C'}">{{ ((row.bookedOuter - row.orderedOuter) / row.orderedOuter * 100).toFixed(2) }}</span>
          <span v-else :style="{color: row.orderedInner == row.bookedInner? '' : '#F56C6C'}">{{ ((row.bookedInner - row.orderedInner) / row.orderedInner * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="Volume(cbm)" min-width="100" align="center"></el-table-column>
      <el-table-column prop="grossWeight" label="Gross Weight(kg)" width="120" align="center"></el-table-column>
      <el-table-column prop="orderedPieces" label="Ordered Pieces" width="120" align="center"></el-table-column>
      <el-table-column prop="bookedPieces" label="Booked Pieces" width="120" align="center">
        <template v-slot="scope">
          <el-input-number v-model="scope.row.bookedPieces" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="differs" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{row}">
          <span :style="{color: row.orderedPieces == row.bookedPieces? '' : '#F56C6C'}">{{ ((row.bookedPieces - row.orderedPieces) / row.orderedPieces * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sanitaryRisk" label="Sanitary Risk" min-width="90" align="center">
        <template v-slot="{row}">
          <el-tag v-if="[1, '1', true, 'true'].includes(row.sanitaryRisk)" type="danger" size="mini">Y</el-tag>
          <el-tag v-else type="success">N</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <po-dialog ref="poDialog" @submit="handleRefresh" />
  </div>
</template>


<script>
import PoDialog from './po-dialog.vue'

/**
 * OrderItemTable
 * @author Ethan
 * @description This component displays the order item table with order header and order lines.
 */
export default {
  name: 'OrderItemTable',
  components: { PoDialog },
  data() {
    return {
      dataList: [],
      lines: [],
      rows: [],
      openData: [],
      haveOpenedChoose: false,
      isAdd: false,
      isAddRemovePo: false,
      addRemoveButtonDisabled: false,
      oldOrders: []
    }
  },
  created() {
    console.log('OrderDetail created')
  },
  methods: {
    /**
     * 刷新订单详情
     * @param rows
     * @param isEdit
     * @param isAddPo 是否为新增PO功能
     * @param oldOrders 旧的订单列表，用于判断是否为新增订单
     * @param addRemoveButtonDisabled 是否禁用Add / Remove PO按钮
     * @param isAddRemovePo
     */
    refresh(rows, isEdit, isAddPo, oldOrders, addRemoveButtonDisabled = false, isAddRemovePo = false) {
      console.log('OrderDetail refresh',rows,isEdit)
      this.isAdd = isAddPo
      this.isAddRemovePo = isAddRemovePo
      this.oldOrders = oldOrders ? [...oldOrders] : []
      this.addRemoveButtonDisabled = addRemoveButtonDisabled
      this.handleRefresh(rows, isEdit)
    },
    handleRefresh(rows, isEdit) {
      console.log('OrderDetail handleRefresh',rows)
      this.dataList = []
      this.lines = []
      this.rows = rows
      rows.forEach(row => {
        let items = []

        const header = {
          id: row.id,
          orderNumber: row.orderNumber,
          dc: row.dc
        }
        let isNewAdd = false
        if (this.isAdd) {
          const tmp = this.oldOrders.find(oldOrder => oldOrder.id == row.id)
          console.log('tmp', tmp)
          console.log(!tmp)
          if (!this.oldOrders.find(oldOrder => oldOrder.id == row.id)) {
            isNewAdd = true
          }
        }

        // 生成行数据
        row.items.forEach(item => {
          console.log('row.items.forEach',item)
          const tmp = {
            id: item.id,
            isNewAdd: isNewAdd,
            orderId: item.orderId,
            orderNumber: row.orderNumber,
            itemNumber: item.productCode,
            itemName: item.productName,
            tcId: item.tcId,
            orderedPieces: item.requested,
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
            sanitaryRisk: row.sanitaryRisk || (row.items && row.items.some(item => [1, '1', true, 'true'].includes(item.sanitaryRisk))) || false
          }
          tmp.orderedOuter = item.outerQty
          tmp.orderedInner = item.tcQty
          tmp.bookedOuter = isEdit ? item.booked : tmp.orderedOuter
          tmp.bookedInner = isEdit ? item.bookedInner : tmp.bookedOuter * tmp.bookedProInnerPerOuter
          tmp.bookedPieces = isEdit ? item.bookedPieces : tmp.bookedOuter * tmp.bookedProOuterSize
          tmp.grossWeight = (tmp.bookedOuter * tmp.outerWeight).toFixed(3)
          tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(3) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000

          items = [...items, tmp]
        })
        this.lines = [...this.lines, ...items]
        header.items = items
        this.dataList = [...this.dataList, header]
      })
      // dataList 抽取orderNumber，使用逗号连接
      // const orderNumbers = this.dataList.map(item => item.orderNumber).join(',')
      const orderNumbers = this.dataList.map(item => item.orderNumber)
      const itemNames = this.lines.map(item => item.itemName)
      const result = {
        orderNumbers: Array.from(new Set(orderNumbers)),
        itemNames: Array.from(new Set(itemNames)),
        dc: rows.length > 0 ? rows[0].dc || '' : ''
      }
      this.$emit('render', result)
    },
    handleBookedOuter(row) {
      console.log('handleBookedOuter', row)
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
      let sumsRow = {
        bookedOuter: Number(sums[4]) || 0,
        grossWeight: (Number(sums[9]) || 0).toFixed(3),
        volume: Number(sums[8]) || 0
      }

      let changedFlag = false
      if (this.haveOpenedChoose) {
        // 判断是否修改
        if (this.openData.length !== this.rows.length) {
          // 已修改
          changedFlag = true
        } else {
          // 判断是否修改
          for (let openDatum of this.openData) {
            // 订单号相同
            if (this.rows.filter(item => item.orderNumber === openDatum.orderNumber).length === 0) {
              changedFlag = true
              break
            }
          }
          for (let selected of this.rows) {
            if (this.openData.filter(item => item.orderNumber === selected.orderNumber).length === 0) {
              changedFlag = true
              break
            }
          }
        }
      }
      this.$emit('sum', sumsRow, changedFlag)
      return sums
    },
    validateDiffers() {
      const invalidOrders = []
      console.log('this.lines', this.lines)

      this.lines.forEach(row => {
        let differsOuterInner = 0
        let differsPieces = 0

        // ===== Differs(Outer/Inner) =====
        if (row.bookedProInnerPerOuter === 0) {
          // 按 Outer 算
          differsOuterInner = ((row.bookedOuter - row.orderedOuter) / row.orderedOuter) * 100
        } else {
          // 按 Inner 算
          differsOuterInner = ((row.bookedInner - row.orderedInner) / row.orderedInner) * 100
        }

        // ===== Differs(Pieces) =====
        differsPieces = ((row.bookedPieces - row.orderedPieces) / row.orderedPieces) * 100

        // ===== 校验逻辑：任意一个超过 ±1% 就算不合法 =====
        if (Math.abs(differsOuterInner) > 1 || Math.abs(differsPieces) > 1) {
          invalidOrders.push({
            orderNumber: row.orderNumber,
            differs: {
              outerInner: differsOuterInner,
              pieces: differsPieces
            }
          })
        }
      })

      // 返回包含详细信息的不合法订单数组
      return invalidOrders
    },

    handlePoClick() {
      this.openData = [...this.rows]
      this.haveOpenedChoose = true
      this.$refs.poDialog.openDialog(this.rows, this.isEdit, this.isAdd, this.isAddRemovePo)
    },
    getDataList() {
      return this.dataList
    },
    triggerValidateDiffers() {
      const invalidOrders = this.validateDiffers()
      this.$emit('validate-differs-result', invalidOrders)
    }
  }
}
</script>

  <style scoped>
.order-item-table {
  padding: 5px;
  background-color: #fff;
}
</style>
