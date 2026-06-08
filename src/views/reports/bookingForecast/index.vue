<template xmlns="">
  <div class="app-container forecast">
    <div>
      <el-card shadow="always" :style="{height:height+'px'}">
        <el-row :gutter="20" style=" padding-bottom: 10px;  margin-left: 10px;  padding-top: 25px;">
          <el-col :span="4">
            <el-select clearable @clear="handleQuery" @change="handleQuery" placeholder="Vessel/Voyage" filterable v-model="queryParams.vesselVoyage">
              <el-option v-for="value in vesselVoyageList" :key="value" :label="value" :value="value" />
            </el-select>
          </el-col>

          <el-col :span="3">
            <el-button @click="handleExport2" type="primary" icon="el-icon-download" :loading="exportLoading">Export</el-button>
          </el-col>
        </el-row>
        <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
        <el-table v-if="list.length >0" :data="list" v-loading="loading" :max-height="height-45+'px'" stripe style="width: 100% ;    padding-left: 15px;">
          <el-table-column prop="vessel" label="Vessel" min-width="100"></el-table-column>
          <el-table-column prop="voyage" label="Voyage" min-width="80"></el-table-column>
          <el-table-column prop="port" label="POL" min-width="100"></el-table-column>
          <el-table-column prop="etd" label="ETD" min-width="120">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.etd) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="etd" label="ETD Week" min-width="120">
            <template v-slot="scope">
              <span>{{ getISOYearWeek(scope.row.etd) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="forecastTEU" label="Forecast TEU" min-width="100"></el-table-column>
          <el-table-column prop="bookingOrderTEU" label="Booking order TEU" min-width="100">
            <template v-slot="scope">{{scope.row.bookingOrderTEU ? scope.row.bookingOrderTEU : 0}}</template>
          </el-table-column>
          <el-table-column prop="carrierBookedTEU" label="Carrier booked TEU" min-width="100"></el-table-column>
        </el-table>
      </el-card>
    </div>
    <pagination v-if="list.length" :total="queryParams.lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50]" @pagination="getList" />
  </div>
</template>
<script>
import { getBookingForecastReport, getVesselVoyageList, downloadForecastData } from '@/api/system/bookingForecast'
import moment from 'moment'

export default {
  name: 'bookingForecast',
  data() {
    return {
      // 查询参数
      queryParams: {
        pageSize: 15,
        pageNo: 1
      },
      loading: false,
      list: [],
      height: '',
      vesselVoyageList: [],
      exportLoading: false
    }
  },
  computed: {},
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 300
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 300
    getVesselVoyageList().then(res => {
      this.vesselVoyageList = res.data
    })
    this.getList()
  },
  methods: {
    getISOYearWeek(timestamp) {
      if (timestamp) {
        return moment(timestamp).format('YYYY-W')
      }
      return ''
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getBookingForecastReport(this.queryParams).then(response => {
        this.list = response.data.list
        this.queryParams.lineTotal = response.data.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 导出按钮操作 */
    handleExport2() {
      this.exportLoading = true
      downloadForecastData().then(response => {
        this.$download.excel(response, 'smartMOOV_BookingForecast' + this.parseTimeToZ2(new Date()) + '.xlsx')
        this.exportLoading = false
      })
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    }
  },
  destroyed() {}
}
</script>

<style>
.forecast table.el-table__header {
  padding: 5px 0px 5px 0px !important;
}
.forecast .el-table th.el-table__cell > .cell,
.forecast .el-table .cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
  font-size: 14px !important;
  font-weight: revert;
}
</style>
