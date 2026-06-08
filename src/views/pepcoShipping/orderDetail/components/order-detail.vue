<template>
  <div>
    <!-- Order Lines -->
    <el-table :data="lines" show-summary sum-text="Total" :summary-method="getSummaries" size="mini">
      <el-table-column prop="orderNumber" label="Order Number" min-width="120" align="center"></el-table-column>
      <el-table-column prop="itemNumber" label="Item Number" min-width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="itemName" label="Item Name" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="tcId" label="TCId" min-width="80" align="center"></el-table-column>
      <el-table-column prop="orderedOuter" label="Ordered Outer(Cartons)" min-width="140" align="center"></el-table-column>
      <el-table-column prop="bookedOuter" label="Booked Outer(Cartons)" min-width="130" align="center"></el-table-column>
      <el-table-column prop="orderedInner" label="Ordered Inner(Cartons)" min-width="140" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.bookedProInnerPerOuter != 0">{{ scope.row.orderedInner }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="bookedInner" label="Booked Inner(Cartons)" min-width="130" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.bookedProInnerPerOuter != 0">{{scope.row.bookedInner}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="differs01" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{row}">
          <span v-if="row.bookedProInnerPerOuter==0" :style="{color: row.orderedOuter == row.bookedOuter? '' : '#F56C6C'}">{{ ((row.bookedOuter - row.orderedOuter) / row.orderedOuter * 100).toFixed(2) }}</span>
          <span v-else :style="{color: row.orderedInner == row.bookedInner? '' : '#F56C6C'}">{{ ((row.bookedInner - row.orderedInner) / row.orderedInner * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="Volume(cbm)" min-width="100" align="center"></el-table-column>
      <el-table-column prop="grossWeight" label="Gross Weight(kg)" min-width="120" align="center"></el-table-column>
      <el-table-column prop="orderedPieces" label="Ordered Pieces" min-width="120" align="center"></el-table-column>
      <el-table-column prop="bookedPieces" label="Booked Pieces" min-width="120" align="center"></el-table-column>
      <el-table-column prop="differs02" label="Differs (%)" min-width="120" align="center">
        <template v-slot="{row}">
          <span :style="{color: row.orderedPieces == row.bookedPieces? '' : '#F56C6C'}">
            {{ ((row.bookedPieces -
            row.orderedPieces) / row.orderedPieces * 100).toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <!--添加是否符合审批标准的判断 edwin-->
      <el-table-column label="Approval Criteria(CRD)" min-width="140" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="approvalCriteria.crdMap[row.orderId] == 0" type="success">Match</el-tag>
          <el-tag v-else type="danger">Not Match</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Approval Criteria(TC QTY)" min-width="150" align="center">
        <template v-slot="{row}">
          <el-tag v-if="approvalCriteria.tcQuantitiesMap[row.id] == 0" type="success">Match</el-tag>
          <el-tag v-else type="danger">Not Match</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
/**
 * OrderItemTable
 * @author Ethan
 * @description This component displays the order item table with order header and order lines.
 */
export default {
  name: 'OrderItemTable',
  props: {
    approvalCriteria: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataList: [],
      lines: [],
      rows: []
      //
    }
  },
  created() {
    console.log('OrderDetail created')
  },
  methods: {
    refresh(rows) {
      this.dataList = []
      this.lines = []
      console.log(rows)
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
            height: item.height
          }
          tmp.orderedOuter = item.outerQty
          tmp.orderedInner = tmp.tcQty
          tmp.bookedOuter = tmp.orderedOuter
          tmp.bookedInner = tmp.orderedOuter * tmp.bookedProInnerPerOuter
          tmp.bookedPieces = tmp.orderedOuter * tmp.bookedProOuterSize
          tmp.grossWeight = (tmp.orderedOuter * tmp.outerWeight).toFixed(3)
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
          if (column.property == 'volume') {
            total = total == 0 ? 0 : total.toFixed(3)
          }
          if ((column.property == 'orderedInner' || column.property == 'bookedInner') && flag) {
            // 如果 bookedProInnerPerOuter 为 0（无内箱），则 orderedInner 和 bookedInner 显示
            total = ' '
          }

          sums[index] = total
        }
      })
      console.log(sums)
      let sumsRow = {
        bookedOuter: Number(sums[4]) || 0,
        grossWeight: (Number(sums[9]) || 0).toFixed(3),
        volume: Number(sums[8]) || 0
      }
      console.log(sumsRow)
      this.$emit('sum', sumsRow)
      return sums
    },
    handlePoClick() {
      this.$refs.poDialog.openDialog(this.rows)
    },
    getDataList() {
      return this.dataList
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
