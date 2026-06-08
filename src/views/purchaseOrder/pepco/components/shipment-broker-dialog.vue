<template>
  <el-dialog width="80%" title="Add/Remove Shipping Order" :visible.sync="addRemovePOVisible">
    <div>
      <el-input style="width:200px;margin-right:20px" v-model="queryParams.soRef" />
      <el-button @click="getAllShipment" type="primary">
        Search
        <i class="el-icon-search el-icon--right"></i>
      </el-button>
    </div>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
          <el-table-column width="80">
            <template v-slot="scope">
              <a style="float:left" v-if="!scope.row.checked" @click="addPo(scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                  <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
              <svg style="float:left" v-if="scope.row.checked" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
              </svg>
            </template>
          </el-table-column>
          <el-table-column prop="soRef" min-width="140px" label="Shipper Booking Number" align="center"></el-table-column>
          <el-table-column prop="originPort" label="POL" align="center"></el-table-column>
          <el-table-column prop="destinationPort" label="POD" align="center"></el-table-column>
          <el-table-column prop="customerRef" label="PO" min-width="100px" align="center">
            <template v-slot="scope">
              <span style="white-space: pre-line;">{{ (scope.row.customerRef || '').replace(/,/g, '\n') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="queryParams.total > 0" :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getAllShipment" />
      </el-col>

      <el-col :span="12">
        <el-table :data="selectedTable" style="width: 100%">
          <el-table-column width="55">
            <template v-slot="scope">
              <a @click="subPo(scope.$index,scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
            </template>
          </el-table-column>
          <!-- <el-table-column type="index" width="40" align="center"></el-table-column> -->
          <el-table-column prop="soRef" min-width="140px" label="Shipper Booking Number" align="center"></el-table-column>
          <el-table-column prop="originPort" label="POL" width="60px" align="center"></el-table-column>
          <el-table-column prop="destinationPort" label="POD" width="60px" align="center"></el-table-column>
          <el-table-column prop="customerRef" label="PO" min-width="100px" align="center">
            <template v-slot="scope">
              <span style="white-space: pre-line;">{{ (scope.row.customerRef || '').replace(/,/g, '\n') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col style="margin-top:10px;text-align:center">
        <el-button @click="cancelSelect">Cancel</el-button>
        <el-button type="primary" @click="submit">Submit</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPage } from '@/api/shipment/shipment'
import {getBrokerShippingOrderPage} from '@/api/pepco/shipping-order'
export default {
  name: 'AddRemovePoDialog',
  data() {
    return {
      addRemovePOVisible: false,
      tableLoading: false,
      tableData: [],
      selectedTable: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        soRef: undefined,
        taskName: 'Customs Broker Assign',
        shippingOrderId: undefined
      },
      shipmentInfo: {
        po: ''
      },
      queryParams1: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        shippingOrderId: undefined,
      }
    }
  },
  created() {
    // this.getAllBookings()
  },
  methods: {
    closeDialog() {
      this.addRemovePOVisible = false
      this.selectedTable = []
    },
    async openDialog(rows) {
      console.log('openDialog', rows)
      this.addRemovePOVisible = true
      this.tableData = []
      this.selectedTable = []
      // 根据传参查询数据放到selectedTable中
      await this.getShippingOrder(rows.shippingId)
      this.queryParams.shippingOrderId = ''
      this.getAllShipment()
    },
    async getShippingOrder(shippingId) {
      this.queryParams1.shippingOrderId = shippingId
      console.log("this.queryParams1")
      console.log(this.queryParams1)
      await getBrokerShippingOrderPage(this.queryParams1).then(response => {
        this.shipmentInfo = response.data.list[0]
        this.selectedTable.push(this.shipmentInfo)
        this.queryParams.shippingOrderId = ''
      })
    },

    getAllShipment() {
      this.tableLoading = true
      this.queryParams.soRef = this.queryParams.soRef ? this.queryParams.soRef.trim() : this.queryParams.soRef
      getBrokerShippingOrderPage(this.queryParams).then(response => {
        //console.log('thsi.selectTa', this.selectedTable)
        this.tableData = []
        if (response.data == null) {
          this.tableData = []
          this.tableLoading = false
        } else {
          // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
          response.data.list.forEach(item => {
            this.selectedTable.forEach(selectedItem => {
              if (item.soRef == selectedItem.soRef) {
                item.checked = true
              }
            })
          })
          this.tableData = response.data.list
          // this.tableData.forEach((item, index) => {
          //   // 添加index参数
          //   getShippingOrderItemList({ shippingId: item.id }).then(response => {
          //     this.$set(this.tableData[index], 'po', response.data.map(item => item.customerRef).join(','))
          //   })
          // })
          this.queryParams.total = response.data.total
          this.tableLoading = false
        }
      })
    },
    addPo(row) {
      if (this.selectedTable.filter(item => item.soRef == row.soRef).length > 0) {
        this.$message({
          message: 'SO already selected',
          type: 'warning'
        })
        return
      }
      this.$set(row, 'checked', true)
      this.selectedTable.push(row)
    },
    subPo(index, row) {
      this.selectedTable.splice(index, 1)
      this.tableData.forEach(item => {
        if (item.soRef == row.soRef) {
          this.$set(item, 'checked', false)
        }
      })
    },
    submit() {
      if (this.selectedTable.length === 0) {
        this.$message({
          message: 'Please select at least one Shipment',
          type: 'warning'
        })
        return
      }
      this.$emit('submit', this.selectedTable)
      this.selectedTable = []
      this.addRemovePOVisible = false
    },
    cancelSelect() {
      this.selectedTable = []
      this.tableData = []
      this.queryParams.pageNo = 1
      this.queryParams.soRef = undefined
      this.addRemovePOVisible = false
    }
  }
}
</script>

<style>
</style>
