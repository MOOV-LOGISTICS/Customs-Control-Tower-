<template>
  <el-dialog width="80%" title="Add/Remove PO" :visible.sync="addRemovePOVisible">
    <div>
      <el-input style="width:200px;margin-right:20px" v-model="orderNumber" placeholder="Order Number" />
      <el-button @click="getAllBookings" type="primary">
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
          <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
          <!-- <el-table-column prop="cargoReadyDate" label="Cargo Ready Date">
            <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseTime(scope.row.cargoReadyDate) }}</template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="DC Date">
            <template v-slot="scope">{{ parseTime(scope.row.deliveryDate) }}</template>
          </el-table-column>
          <el-table-column prop="originPort" label="PO"></el-table-column>-->
        </el-table>
        <pagination v-show="queryParams.total > 0" :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getAllBookings" />
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
          <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
          <!-- <el-table-column prop="cargoReadyDate" label="Cargo Ready Date">
            <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseTime(scope.row.cargoReadyDate) }}</template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="DC Date">
            <template v-slot="scope">{{ parseTime(scope.row.deliveryDate) }}</template>
          </el-table-column>
          <el-table-column prop="originPort" label="PO"></el-table-column>-->
        </el-table>
      </el-col>
      <el-col style="margin-top:10px;text-align:center">
        <el-button @click="addRemovePOVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit">Submit</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getOrder4Factory, getOrder4SubDeptSelected } from '@/api/order/header'
import { createSubDeptOrder } from '@/api/system/subDeptOrder'
export default {
  name: 'AddRemovePoDialog',
  data() {
    return {
      addRemovePOVisible: false,
      tableLoading: false,
      tableData: [],
      selectedTable: [],
      selectIds: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderNumber: '',
        booked: false
      },
      isEdit: false,
      subDeptId: ''
    }
  },
  computed: {
    // 监听orderNumber的变化，去除输入两端的空格 edwin
    orderNumber: {
      get() {
        return this.queryParams.orderNumber
      },
      set(value) {
        // 去除输入两端的空格
        this.queryParams.orderNumber = value.trim()
      }
    }
  },
  methods: {
    async openDialog(subDeptId) {
      this.selectedTable = []
      this.subDeptId = subDeptId
      this.addRemovePOVisible = true
      await this.getSelectedBookings()

      this.getAllBookings()
    },

    async getSelectedBookings() {
      await getOrder4SubDeptSelected({ subDeptId: this.subDeptId }).then(response => {
        console.log(response.data)
        this.selectedTable = response.data
      })
    },
    getAllBookings() {
      this.tableLoading = true
      getOrder4Factory(this.queryParams).then(response => {
        console.log(response.data)
        // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
        response.data.list.forEach(item => {
          this.selectedTable.forEach(selectedItem => {
            if (item.orderNumber == selectedItem.orderNumber) {
              item.checked = true
            }
          })
        })
        this.tableData = response.data.list
        this.queryParams.total = response.data.total
        this.tableLoading = false
      })
    },
    addPo(row) {
      this.$set(row, 'checked', true)

      this.selectedTable.push(row)
    },

    subPo(index, row) {
      this.selectedTable.splice(index, 1)
      this.tableData.forEach(item => {
        if (item.orderNumber == row.orderNumber) {
          this.$set(item, 'checked', false)
        }
      })
    },
    submit() {
      if (this.selectedTable.length === 0) {
        this.$message({
          message: 'Please select at least one PO',
          type: 'warning'
        })
        return
      } else {
        // 提交
        var data = {
          subDeptId: this.subDeptId,
          orderIds: this.selectedTable.map(item => item.id)
        }
        createSubDeptOrder(data).then(response => {
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.selectedTable = []
          this.addRemovePOVisible = false
        })
      }
    }
  }
}
</script>

<style>
</style>
