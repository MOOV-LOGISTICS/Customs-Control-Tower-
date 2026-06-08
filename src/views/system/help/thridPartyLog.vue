<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <!--  -->
    <el-dialog title="Data View" :visible.sync="dialogVisible" width="500px">
      <json-viewer :value="viewData" :expand-depth="5"></json-viewer>
    </el-dialog>
    <el-tabs v-model="activeName" tab-position="left" style="background-color: #fff;padding: 10px;" :style="{'height':tableHeight+'px'}">
      <el-tab-pane label="Pepco ASN" name="pepcoASN" style="padding: 15px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <el-input style="width: 220px;" v-model="pageForm6.orderNumber" placeholder="Order Number" clearable></el-input>
          <el-input style="width: 220px;" v-model="pageForm6.contianerNos" placeholder="Container Number" clearable></el-input>

          <el-select style="width: 220px !important;" v-model="pageForm6.statusCode" clearable>
            <el-option label="UNBOOKED---UNBOOKED-NEW" value="UNBOOKED-NEW" />
            <el-option label="BOOKED---SUPPLIER BOOKING APPROVED" value="BOOKED" />
            <el-option label="CARRIER-BOOKING---SCHEDULED" value="CARRIER-BOOKING" />
            <el-option label="BOOKING-CONFIRMATION---SCHEDULED" value="BOOKING-CONFIRMATION" />
            <el-option label="SO-RELEASE-NEW---SCHEDULED" value="SO-RELEASE-NEW" />
            <el-option label="SIVGM-CARRIER---PENDING DEPARTURE" value="SIVGM-CARRIER" />
            <el-option label="GATED-IN-NEW---PENDING DEPARTURE" value="GATED-IN-NEW" />
            <el-option label="ATD---SHIPPED OUT CONFIRMED" value="ATD" />
            <el-option label="PRE-ALERT---SHIPPED OUT CONFIRMED" value="PRE-ALERT" />
            <el-option label="ATA---ARRIVAL AT PORT" value="ATA" />

            <el-option label="DELIVERY-PLAN---PLANNED FOR DELIVERY" value="DELIVERY-PLAN" />
            <el-option label="DELIVERED-DC---DELIVERED AT DC" value="DELIVERED-DC" />
            <el-option label="UNPLANNED-DELIVERY---UNPLANNED FOR DELIVERY" value="UNPLANNED-DELIVERY" />
          </el-select>

          <el-button @click="searchPepcoAsnLogPage" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </div>

        <el-table v-loading="pageForm6.loading" :data="tableData6" :height="tableHeight-120" style="width: 100%">
          <el-table-column prop="createTime" label="Date" width="140">
            <template v-slot="scope">{{ parseTime(scope.row.createTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</template>
          </el-table-column>
          <el-table-column prop="result" label="Order Number" width="140">
            <template v-slot="scope">{{ scope.row.orderNumber }}</template>
          </el-table-column>
          <el-table-column prop="result" label="Container Number" width="140">
            <template v-slot="scope">{{ scope.row.contianerNos }}</template>
          </el-table-column>
          <el-table-column prop="result" label="Status Code" width="110">
            <template v-slot="scope">{{ scope.row.statusCode }}</template>
          </el-table-column>
          <el-table-column prop="result" label="Deleted" width="80">
            <template v-slot="scope">{{ scope.row.deleted }}</template>
          </el-table-column>

          <el-table-column prop="result" label="Push Status" width="80">
            <template v-slot="scope">{{ scope.row.pushStatus }}</template>
          </el-table-column>

          <el-table-column prop="result" label="File Name" width="150">
            <template v-slot="scope">{{ scope.row.fileName }}</template>
          </el-table-column>

          <el-table-column prop="data" label="Xml req">
            <template v-slot="scope">
              <div>{{ scope.row.jsonData }}</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="pageForm6.total > 0" :total="pageForm6.total" :page.sync="pageForm6.pageNo" :limit.sync="pageForm6.pageSize" :page-sizes="[15, 20, 30, 50, 100]" @pagination="getPepcoAsnLogPage" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
.el-table .warning-row {
  background: oldlace;
}
</style>
<script>
import auth from '@/plugins/auth'
import { getPepcoAsnLogPage } from '@/api/shipment/pepcoAsnLog.js'

export default {
  name: 'SystemLoginLog',
  data() {
    return {
      tableData6: [],
      dialogVisible: false,
      viewData: {},

      pageForm6: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        orderNumber: '',
        loading: false
      },
      activeName: 'pepcoASN'
    }
  },
  created() {
    this.calcTableHeight()

    this.getPepcoAsnLogPage()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.cargoo_status != '200' || row.cargoo_retrun_status != 'Success') {
        return 'warning-row'
      }
      return ''
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 165
    },
    getJsonType(data) {
      try {
        return JSON.parse(data)['event'] == null ? JSON.parse(data)['dataStatus'] : JSON.parse(data)['event']
      } catch (error) {
        return ''
      }
    },
    handleViewData(data) {
      try {
        this.viewData = JSON.parse(data)
      } catch (error) {
        this.viewData = data
      }
      this.dialogVisible = true
    },

    searchPepcoAsnLogPage() {
      this.pageForm6.pageNo = 1
      this.getPepcoAsnLogPage()
    },

    getPepcoAsnLogPage() {
      this.pageForm6.loading = true
      getPepcoAsnLogPage(this.pageForm6).then(res => {
        this.tableData6 = res.data.list
        this.pageForm6.total = res.data.total
        this.pageForm6.loading = false
      })
    }
  }
}
</script>
