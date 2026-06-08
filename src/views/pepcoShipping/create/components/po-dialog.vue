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
          <el-table-column prop="cargoReadyDate" label="Cargo Ready Date">
            <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseTime(scope.row.cargoReadyDate) }}</template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="DC Date">
            <template v-slot="scope">{{ parseTime(scope.row.deliveryDate) }}</template>
          </el-table-column>
          <el-table-column prop="dc" label="DC"></el-table-column>
          <el-table-column prop="originPort" label="PO"></el-table-column>
        </el-table>
        <!-- <pagination v-show="queryParams.total > 0" :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getAllBookings" /> -->
      </el-col>

      <el-col :span="12">
        <el-table :data="selectedTable" style="width: 100%">
          <el-table-column width="55">
            <template v-slot="scope">
              <a v-if="showSub(scope.row)" @click="subPo(scope.$index,scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
            </template>
          </el-table-column>
          <!-- <el-table-column type="index" width="40" align="center"></el-table-column> -->
          <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
          <el-table-column prop="cargoReadyDate" label="Cargo Ready Date">
            <template v-slot="scope">{{ scope.row.cargoReadyDate==null?parseTime(scope.row.cargoHandoverDate- (7 * 24 * 60 * 60 * 1000))+'(Nominated)':parseTime(scope.row.cargoReadyDate) }}</template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="DC Date">
            <template v-slot="scope">{{ parseTime(scope.row.deliveryDate) }}</template>
          </el-table-column>
          <el-table-column prop="dc" label="DC"></el-table-column>
          <el-table-column prop="originPort" label="PO"></el-table-column>
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
import { getOrder4ShippingBook } from '@/api/order/header'
import { isMixDcBookingEnabled, isSameDcForSupplierBooking } from '@/utils/shippingOrderConfig'

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
      isAdd: false,
      isAddRemove: false
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
  created() {
    // this.getAllBookings()
  },
  methods: {
    openDialog(rows, isEdit, isAdd, isAddRmove = false) {
      this.selectedTable = rows
      console.log(' selectedTable', this.selectedTable)
      // this.queryParams.poOriginPort = this.selectedTable?.[0]?.originPort ?? ''
      this.isEdit = isEdit
      this.isEdit = isEdit
      this.isAdd = isAdd
      this.isAddRemove = isAddRmove
      this.addRemovePOVisible = true
      this.getAllBookings()
    },
    getAllBookings() {
      this.tableLoading = true
      getOrder4ShippingBook(this.queryParams).then(response => {
        // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
        response.data.forEach(item => {
          this.selectedTable.forEach(selectedItem => {
            if (item.orderNumber == selectedItem.orderNumber) {
              item.checked = true
            }
          })
        })
        this.tableData = response.data
        this.queryParams.total = response.data.length
        this.tableLoading = false
      })
    },
    addPo(row) {
      if (row.status == '2') {
        this.$modal.msgWarning('Order Number:' + row.orderNumber + ' Status: Hold');
        return
      }
      if (row.status == '1') {
        this.$modal.msgWarning('Order Number:' + row.orderNumber + ' Status: Cancelled');
        return
      }
            // 增加判断，如果新加入的po的originPort 和this.selectedTable[0].originPort 不一致，弹出error
      // 第一次不不比较 this.selectedTable.length >1 时比较是否相等
      if (this.selectedTable.length != 0) {
        if (row.originPort !== this.selectedTable[0].originPort) {
          this.$message({
            message: 'Please select the same POL',
            type: 'warning'
          })
          return
        }
      }
      if (!isMixDcBookingEnabled(this.getDictDatas)) {
        const dcList = this.selectedTable.map(item => item.dc).concat(row.dc)
        if (!isSameDcForSupplierBooking(dcList)) {
          this.$message({
            message: 'Please select the same DC',
            type: 'warning'
          })
          return
        }
      }
      this.$set(row, 'checked', true)
      if (this.selectedTable.filter(item => item.orderNumber == row.orderNumber).length > 0) {
        this.$message({
          message: 'PO already selected',
          type: 'warning'
        })
        return
      }
      this.$set(row, 'isNewAdd', true)
      this.selectedTable.push(row)
    },
    showSub(row) {
      if(this.isAddRemove){
        return true
      }
      if (!this.isAdd) {
        return true
      }
      return row.isNewAdd
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
      } else if (this.selectedTable.length > 1) {
        // 获取所有选中订单的 originPort 值并去重
        const originPorts = [...new Set(this.selectedTable.map(row => row.originPort))]
        // const hasDuplicates = originPorts.length < this.selectedTable.length
        const allValid = this.selectedTable.every(row => row.originPort !== null && row.originPort !== undefined)
        // 如果去重后只有一个 originPort，说明所有订单的 originPort 都相同
        if (originPorts.length > 1 && allValid) {
          // 2026-05-26 mark
          // 增加，限制必须pol一致，如果不一致弹出error
          this.$message({
            message: 'The selected PO have different POL,Please select the same POL',
            type: 'error'
          })
          return
          // this.$confirm('The selected PO have different POL. Do you want to continue?', 'Warning', {
          //   confirmButtonText: 'Confirm',
          //   cancelButtonText: 'Cancel',
          //   type: 'warning'
          // }).then(() => {
          //   // 用户点击确认后执行提交操作
          //   this.$emit('submit', this.selectedTable, this.isEdit)
          //   this.selectedTable = []
          //   this.addRemovePOVisible = false
          // }).catch(() => {
          //   // 用户点击取消，不执行任何操作
          //   this.$message({
          //     type: 'info',
          //     message: 'Submission cancelled'
          //   })
          // })
          // return
        } else {
          this.$emit('submit', this.selectedTable, this.isEdit)
          this.selectedTable = []
          this.addRemovePOVisible = false
          return
        }
      }
      this.$emit('submit', this.selectedTable, this.isEdit)
      this.selectedTable = []
      this.addRemovePOVisible = false
    }
  }
}
</script>

<style></style>
