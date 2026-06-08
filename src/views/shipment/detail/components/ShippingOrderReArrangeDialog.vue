<template>
  <el-dialog width="90%" title="Re-arrange Shipping Order" :visible.sync="dialogVisible">
    <el-row>

    <div style="float: right;">
      <el-input style="width:200px;margin-right:20px" v-model="queryParams.bookingNumber" placeholder="Booking Number" />
      <el-button @click="getShippingOrderList" type="primary">
        Search
        <i class="el-icon-search el-icon--right"></i>
      </el-button>
    </div>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-table  :data="fromTable" style="width: 100%">
          <el-table-column width="80">
            <template v-slot="scope">
              <a style="float:left" v-if="!scope.row.checked" @click="addPo(scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                    stroke-linejoin="bevel" />
                  <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
              <svg style="float:left" v-if="scope.row.checked" width="20" height="20" viewBox="0 0 48 48" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square"
                  stroke-linejoin="bevel" />
              </svg>
            </template>
          </el-table-column>

          <el-table-column prop="moovRef" label="MOOV Ref" width="170">
              <template v-slot="scope">
                {{ shipment.bookingNumber }}
              </template>
          </el-table-column>
          <el-table-column prop="bookingNumber" label="Booking Number" width="170">
              <template v-slot="scope">
                {{ shipment.shipmentBookingNumber }}
              </template>
          </el-table-column>
          <el-table-column prop="id" label="id" width="50"></el-table-column>
          <el-table-column prop="soRef" label="SO Ref" width="170"></el-table-column>
          <el-table-column prop="shipmentType" label="SO Type" width="80"></el-table-column>
          <el-table-column prop="originPort" label="POL" width="80"></el-table-column>
          <el-table-column prop="destinationPort" label="POD" width="80"></el-table-column>
        </el-table>
      </el-col>



      <el-col :span="12">
        <el-table v-loading="tableLoading" :data="toArrangeTable" style="width: 100%">
          <el-table-column width="55">
            <template v-slot="scope">
              <a v-show="!toTable.some(item => item.id === scope.row.id)" @click="subPo(scope.$index,scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                    stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="moovRef" label="MOOV Ref" width="170">
            <template v-slot="scope">
              {{ toShipment.bookingNumber }}
            </template>
          </el-table-column>
          <el-table-column prop="bookingNumber" label="Booking Number" width="170">
            <template v-slot="scope">
              {{ toShipment.shipmentBookingNumber }}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="id" width="50"></el-table-column>

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
import { getOrderHeaderListByShipmentId, getShippingOrderListByBookingNumber, updateShippingRelationshipToNewShipment } from '@/api/pepco/shipping-order.js'
import { shipmentDetails } from "@/api/shipment/shipment";
import CheckOrderStatusDialog from './CheckOrderStatusDialog';
import {  getPoTaskStatusByShipmentId } from "@/api/shipment/shipment";

export default {
  name: 'AddRemovePoDialog',
  components: {  CheckOrderStatusDialog },
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      fromTable: [],
      fTable: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        soRef: ''
      },
      shipment: {},
      rightShipmentType: '',
      toTable: [],

      toArrangeTable: [],
      toShipment: {},
    }
  },
  created() {},
  methods: {
    openDialog(rows, shipment) {
      console.log('handlePoClick')
      this.fromTable = [...rows]
      this.fTable = [...rows]
      this.shipment = shipment
      this.dialogVisible = true
    },

    getShippingOrderList() {
      this.tableLoading = true
      getShippingOrderListByBookingNumber(this.queryParams.bookingNumber).then(res => {
        this.toTable = JSON.parse(JSON.stringify(res.data || []));
        this.toTable.forEach(item => {
          this.rightShipmentType = item.shipmentType
        })
        this.fromTable = [...this.fTable]
        this.fromTable.forEach(item => {
            this.$set(item, 'checked', false)
        })
        if(res.data&& res.data.length>0) {
          var shipmentId = res.data[0].shipmentId
          console.log(shipmentId)
          if(shipmentId) {
            if(shipmentId==this.shipment.id) {
              this.tableLoading = false
              this.$message({
                message: 'Can not add self',
                type: 'warning'
              })
              return
            }
            this.getShipmentDetails(shipmentId)
          } else {
            this.tableLoading = false
          }
        }

        // shipmentId
        // shipmentType


        console.log(res)
      }).catch(error => {
        console.error('接口请求错误:', error);
        this.tableLoading = false;
      })
    },
    getShipmentDetails(id) {
      shipmentDetails(id).then((response) => {
        if (response.data) {
          this.toShipment = Object.assign({}, this.toShipment, response.data);
        }
        this.tableLoading = false
        getPoTaskStatusByShipmentId(id).then(response => {
          const loadingPlans = response.data.filter(item => item.taskStatus === 'SI/VGM Submit to Carrier');
          if (response.data.length != 0 && loadingPlans.length == response.data.length) {
            this.toArrangeTable = JSON.parse(JSON.stringify(this.toTable || []));
          } else {
            this.$refs.checkOrderStatusDialog.openDialog(response.data, 'SI/VGM Submit to Carrier')
          }
        })
      }).catch(error => {
        console.error('接口请求错误:', error);
        this.tableLoading = false;
      })
    },

    addPo(row) {
      console.log('addPo')
      console.log('selected row', row)
      console.log('rightShipmentType', this.rightShipmentType)
      if(this.toArrangeTable.length==0) {
        this.$message({
          message: 'Please search Booking Number First',
          type: 'warning'
        })
        return
      }
      if (this.toArrangeTable.length == this.toTable.length+1) {
        this.$message({
          message: 'Only can select One SO',
          type: 'warning'
        })
        return
      }
      const condition1 = this.toArrangeTable.length > 0 && row.shipmentType != this.rightShipmentType
      const condition2 = this.toArrangeTable.length > 0 && this.rightShipmentType == 'FCL'
      if (condition1 || condition2) {
        this.$message({
          message: 'FCL is not allowed to make consol',
          type: 'warning'
        })
        return
      }
      this.$set(row, 'checked', true)
      this.toArrangeTable.push(row)
      console.log(row)
      console.log(this.toTable)
    },
    subPo(index, row) {
      this.toArrangeTable.splice(index, 1)
      this.fromTable = [...this.fTable]
      this.fromTable.forEach(item => {
        if (item.soRef == row.soRef) {
          this.$set(item, 'checked', false)
        }
      })
      this.rightShipmentType = this.toArrangeTable.length > 0 ? this.toArrangeTable[0].shipmentType : ''
    },
    submit() {
      if (this.toArrangeTable.length === 0|| this.toArrangeTable.length== this.toTable.length) {
        this.$message({
          message: 'Please select at least one SO',
          type: 'warning'
        })
        return
      }
      // 获取toArrangeTable中的ID集合
      var arrangeTableIds = this.toArrangeTable.map(item => item.id);
      var toIds = new Set(this.toTable.map(item => item.id)); // 转换为Set
      var leftOnlyIds = arrangeTableIds.filter(id => !toIds.has(id));

 
      console.log('toTable中独有的ID:', leftOnlyIds);

      var data = {
        fromShipmentId: this.shipment.id,
        toShipmentId: this.toShipment.id,
        spoIds: leftOnlyIds,
      }

      console.log(data)
      updateShippingRelationshipToNewShipment(data).then(res => {
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        this.$emit('submit', this.fromTable)
        this.fromTable = []
        this.fTable = []
        this.dialogVisible = false
      })
    }
  }
}
</script>
  
<style>
</style>
