<template>
  <el-dialog width="80%" title="Add/Remove Shipping Order" :visible.sync="dialogVisible">
    <div>
      <el-input style="width:200px;margin-right:20px" clearable v-model="queryParams.soRef" placeholder="Shipper Booking Number" />
      <el-button @click="getNotBookedShipperBooking" type="primary">
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
          <el-table-column prop="soRef" label="SO Ref" width="170"></el-table-column>
          <el-table-column prop="shipmentType" label="SO Type" width="80"></el-table-column>
          <el-table-column prop="originPort" label="POL" width="80"></el-table-column>
          <el-table-column prop="destinationPort" label="POD" width="80"></el-table-column>
        </el-table>
        <pagination v-show="queryParams.total > 0" :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getNotBookedShipperBooking" />
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
          <el-table-column prop="soRef" label="SO Ref" width="170"></el-table-column>
          <el-table-column prop="shipmentType" label="SO Type" width="80"></el-table-column>
          <el-table-column prop="originPort" label="POL" width="80"></el-table-column>
          <el-table-column prop="destinationPort" label="POD" width="80"></el-table-column>
        </el-table>
      </el-col>
      <el-col style="margin-top:10px;text-align:center">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit">Submit</el-button>
      </el-col>
    </el-row>
    <check-order-status-dialog ref="checkOrderStatusDialog"></check-order-status-dialog>
  </el-dialog>
</template>

<script>
import { getNotShipmentOrderPage, updatePepcoShippingRelationship } from '@/api/shipping/order'
import { getPoStatusByShippingId } from '@/api/pepco/shipping-order'
import CheckOrderStatusDialog from './CheckOrderStatusDialog.vue';



export default {
  name: 'AddRemovePoDialog',
  components: { CheckOrderStatusDialog },
  props: ['spoList'],
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      selectedTable: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        soRef: ''
      },
      shipment: {},
      rightShipmentType: ''
    }
  },
  created() {},
  methods: {
    openDialog(rows, shipment) {
      console.log('handlePoClick')
      this.selectedTable = [...rows]
      this.shipment = shipment
      rows.forEach(item => {
        this.rightShipmentType = item.shipmentType
      })
      this.dialogVisible = true
      this.getNotBookedShipperBooking()
    },
    getNotBookedShipperBooking() {
      this.tableLoading = true
      getNotShipmentOrderPage(this.queryParams).then(response => {
        // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
        response.data.list.forEach(item => {
          this.selectedTable.forEach(selectedItem => {
            if (item.soRef == selectedItem.soRef) {
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
      console.log(this.rightShipmentType)
      console.log('addPo')
      console.log('selected row', row)
      console.log('rightShipmentType', this.rightShipmentType)
      getPoStatusByShippingId(row.id).then(response => {
        console.log(response.data)
        // Carrier Booking 状态必须全部是
        const allStatusSame = response.data.length > 0 &&
          response.data.every(item =>
            item.taskStatus === response.data[0].taskStatus
          );
        if (response.data.length > 0 &&
          (allStatusSame && (response.data[0].taskStatus == 'Carrier Booking'))
        ) {
          const condition1 = this.selectedTable.length > 0 && row.shipmentType != this.rightShipmentType && this.rightShipmentType!=''
          const condition2 = this.selectedTable.length > 0 && this.rightShipmentType == 'FCL' && row.shipmentType == 'FCL'
          // const condition3 = row.shipmentType == 'FCL'
          if (condition1 || condition2 ) {
            this.$message({
              message: 'FCL SO is not allowed to make consol',
              type: 'warning'
            })
            return
          }
          // dc code, 只有0030，0006和0015能组合，dc不存在会为空字符串随意组合
          if (response.data[0].dc) {
            if (this.selectedTable.length >= 0) {
              const shipment = this.selectedTable.find(item => item.dc === '0006' || item.dc === '0015' || item.dc === '0030')
              if (shipment) {
                if (response.data[0].dc !== '0006' && response.data[0].dc !== '0015' && response.data[0].dc !== '0030') {
                  const dcNumber = this.selectedTable.map(item => item.dc).join(',') + ',' + response.data[0].dc
                  this.$message({
                    message: `The DC included in this booking : ${dcNumber}, Only 0030 and 0006 and 0015 can be booked together!`,
                    type: 'error'
                  })
                  return
                }
              } else {
                // 原箱子中dc是否存在
                const obj = this.selectedTable.find(item => item.dc)
                if (obj) {
                  if (!this.selectedTable.find(item => item.dc === response.data[0].dc)) {
                    const dcNumber = this.selectedTable.map(item => item.dc).join(',') + ',' + response.data[0].dc
                    this.$message({
                      message: `The DC included in this booking : ${dcNumber}, Only 0030 and 0006 and 0015 can be booked together!`,
                      type: 'error'
                    })
                    return
                  }
                }
              }
            }
          }
          if (!row.dc) {
            row.dc = response.data[0].dc
          }
          this.$set(row, 'checked', true)
          this.selectedTable.push(row)
          this.rightShipmentType = this.selectedTable.length > 0 ? this.selectedTable[0].shipmentType : ''
          console.log(this.rightShipmentType)
        } else {
          // this.$nextTick(() => {
          this.$refs.checkOrderStatusDialog.openDialog(response.data, 'Order Status')
          // });
          return
        }
      })

    },
    subPo(index, row) {
        getPoStatusByShippingId(row.id).then(response => {
          const allowedStatuses = [
            'Carrier Booking',
            'Booking Confirmation',
            'SO Release to Supplier',
            'SI/VGM Submit',
            'SI/VGM Submit to Carrier'
          ];
          const allStatusOk = response.data.length > 0 &&
          response.data.every(item =>
              allowedStatuses.includes(item.taskStatus)
            );
          if (response.data.length > 0 && allStatusOk) {
            this.selectedTable.splice(index, 1)
            this.tableData.forEach(item => {
              if (item.soRef == row.soRef) {
                this.$set(item, 'checked', false)
              }
            })
            this.rightShipmentType = this.selectedTable.length > 0 ? this.selectedTable[0].shipmentType : ''
          } else {
            this.$refs.checkOrderStatusDialog.openDialog(response.data, 'Order Status')
          }
        })
    },
    submit() {
      // 业务要求FCL可以拿出去
      // if (this.selectedTable.length === 0) {
      //   this.$message({
      //     message: 'Please select at least one SO',
      //     type: 'warning'
      //   })
      //   return
      // }
      var data = {
        shipmentId: this.shipment.id,
        spoIds: this.selectedTable.map(item => item.id)
      }
      updatePepcoShippingRelationship(data).then(res => {
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        this.$emit('submit', this.selectedTable)
        this.selectedTable = []
        this.dialogVisible = false
      })
    },
    handleOrderSubmit(rows) {


    },
  }
}
</script>

<style>
</style>
