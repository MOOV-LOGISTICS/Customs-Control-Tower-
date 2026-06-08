<template>
  <div :loading="fullLoading">
    <!-- 搜索工作栏 -->
    <el-form :model="listQuery" size="mini" :inline="true" label-width="68px">
      <div style="float: left; padding-top: 8px">
        <div style="float: left; padding: 10px 0px">
          <el-input v-model="listQuery.mblNumber" :placeholder="$constants.MBL_NUMBER" clearable filterable
            @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.orderNumber" placeholder="PO" clearable filterable
            @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>

        <div style="float: left;margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.bookingNumber" placeholder="Shipment Ref"
            @blur="listQuery.bookingNumber = $event.target.value.trim()" @keyup.enter.native="handleQuery()" clearable
            @clear=" handleQuery()" />
        </div>
        <!-- <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-select placeholder="Type" v-model="listQuery.type" clearable filterable @change="handleQuery">
            <el-option label="All" value></el-option>
            <el-option label="New" value="New"></el-option>
            <el-option label="Update" value="Update"></el-option>
          </el-select>
        </div>-->

        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.soRef" placeholder="Shipper Booking Number" clearable
            @keyup.enter.native="handleQuery()" @clear="handleQuery()" />
        </div>

        <div style="float: left;margin-left: 5px; padding: 10px 0px">
          <el-popover v-model="filterPopover" placement="bottom" title="Filter" width="800" trigger="click"
            @show="loadFilterOptions">

            <!-- 第一行 -->
            <el-row :gutter="10" style="margin-bottom: 15px;">
              <el-col :span="8">
                <el-select v-model="listQuery.polList" multiple clearable filterable placeholder="POL">
                  <el-option v-for="item in polList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="listQuery.shipmentType" clearable filterable placeholder="Shipping Type">
                  <el-option label="FCL" value="FCL" />
                  <el-option label="LCL" value="LCL" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="listQuery.country" multiple clearable filterable placeholder="Origin Country">
                  <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="margin-bottom: 15px;">
              <el-col :span="16">
                <el-date-picker v-model="listQuery.etaRange" type="daterange" range-separator="To"
                  start-placeholder="ETA From" end-placeholder="ETA To" value-format="yyyy-MM-dd HH:mm:ss" clearable
                  style="width: 100%" />

              </el-col>
            </el-row>


            <el-row>
              <el-col :span="24">
                <div style="float: right;">
                  <el-button @click="resetFilter" icon="el-icon-delete" plain>Clean</el-button>
                  <el-button @click="handleQuery" icon="el-icon-search" plain>Search</el-button>
                </div>
              </el-col>
            </el-row>

            <el-button slot="reference" icon="el-icon-plus" plain>Filter
            </el-button>
          </el-popover>
        </div>

        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button @click="handleQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button @click="handleExport" :loading="fullLoading" type="success">
            Export
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
        </div>
      </div>
    </el-form>

    <!-- 列表 -->
    <el-table :height="tableHeight" v-loading="loading" :data="list" style="width: 100%">
      <el-table-column :label="$constants.MBL_NUMBER" align="center" :min-width="120" prop="mblNumber" show-overflow-tooltip />
      <el-table-column label="Shipment Ref" align="center" :min-width="120" prop="bookingNumber"
        show-overflow-tooltip />
      <el-table-column label="POL" align="center" :min-width="120" prop="pol" show-overflow-tooltip />
      <el-table-column label="POD" align="center" :min-width="120" prop="destinationPort" show-overflow-tooltip />
      <el-table-column label="Checking By" align="center" :min-width="120" prop="checkingBy" show-overflow-tooltip />
      <el-table-column label="Generating By" align="center" :min-width="120" prop="generatingBy"
        show-overflow-tooltip />
      <!-- <el-table-column label="SO Ref" align="center" :min-width="150" prop="soRefs" show-overflow-tooltip />
      <el-table-column label="Order Number" align="center" :min-width="120" prop="poNumbers" show-overflow-tooltip />-->
      <el-table-column label="Status" align="center" :min-width="120" prop="generateDestinationFlag">
        <template #default="scope">
          <el-tag v-if="statusMap[scope.row.generateDestinationFlag]"
            :type="statusMap[scope.row.generateDestinationFlag].type">{{
              statusMap[scope.row.generateDestinationFlag].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ETA" align="center" prop="eta" min-width="100px">
        <template v-slot="scope">{{ parseUTCTime(scope.row?.eta) }}</template>
      </el-table-column>


      <!-- 操作列 -->
      <el-table-column label="Operation" align="center" :min-width="120">
        <template #default="scope">
          <!-- <el-tooltip content="View Details" placement="top"> -->
            <el-button class="el-icon-view" type="text" size="small" @click="handleView(scope.row)"></el-button>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>


    </el-table>

    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 详情抽屉 -->
    <!-- 详情弹窗 -->
    <el-dialog title="Details" :visible.sync="dialogVisible" width="80%" top="5vh" :close-on-click-modal="false">
      <div class="dialog-scroll-container">
        <detail-view :record="currentRecord" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGenerateReadyDataPage, exportGenerateReadyData, getFilterListForGenerate } from '@/api/shipment/shipment'
import DetailView from '../components/detail-view.vue'
import { getAllCountry } from "@/api/destination/destination";

export default {
  components: { DetailView },
  data() {
    return {
      loading: false,
      fullLoading: false,
      filterPopover: false,
      tableHeight: 0,
      total: 0,
      list: [],
      listQuery: {
        bookingNumber: '',
        orderNumber: '',
        generateDestinationFlag: [2],
        mblNumber: '',
        soRef: '',
        etaRange: [],
        etaStart: null,
        etaEnd: null,
        shipmentType: null,
        country: [],
        pageSize: 20,
        pageNo: 1
      },
      statusMap: {
        1: { label: 'In Process', type: 'warning' },
        2: { label: 'Done', type: 'success' },
        3: { label: 'Pending', type: 'info' }
      },
      dialogVisible: false,
      currentRecord: null,
      polList: [],
      countryList: []
    }
  },
  created() {
    this.handleQuery()
    this.calcTableHeight()
    this.getAllCountry()
  },
  methods: {
    handleQuery() {
      this.listQuery.pageNo = 1
      const range = this.listQuery.etaRange

      if (range && range.length === 2) {
        this.listQuery.etaStart = range[0] || null
        this.listQuery.etaEnd = range[1] || null
      } else {
        this.listQuery.etaStart = null
        this.listQuery.etaEnd = null
      }
      this.getList()
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 380
    },
    getList() {
      this.loading = true
      this.list = []
      getGenerateReadyDataPage(this.listQuery)
        .then(res => {
          this.list = res.data.list || []
          this.total = res.data.total || 0
          this.list = (res.data.list || []).map(item => {
            if (item.shippingOrderRes && item.shippingOrderRes.length > 0) {
              const uniqueSoRefs = [...new Set(item.shippingOrderRes.map(s => s.soRef))]
              item.soRefs = uniqueSoRefs.join(',')
            } else {
              item.soRefs = ''
            }
            return item
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleView(row) {
      this.currentRecord = row
      this.dialogVisible = true
    },
    async handleExport() {
      this.fullLoading = true
      try {
        const blob = await exportGenerateReadyData(this.listQuery)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // 文件名
        const fileName = `Generate_Ready_Shipments_${new Date().toISOString().slice(0, 10)}.xlsx`
        link.download = fileName

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        this.$message.success('export success')
      } catch (err) {
        console.error(err)
        this.$message.error('export failed')
      } finally {
        this.fullLoading = false
      }
    },
    resetFilter() {
      this.listQuery.bookingNumber = null
      this.listQuery.orderNumber = null
      this.listQuery.soRef = null
      this.listQuery.mblNumber = null
      this.listQuery.polList = []
      this.listQuery.shipmentType = null
      this.listQuery.country = []
      this.listQuery.etaRange = []
      this.listQuery.etaStart = null
      this.listQuery.etaEnd = null
      this.handleQuery()
    },
    loadFilterOptions() {
      getFilterListForGenerate({}).then(res => {
        this.polList = res.data.polList || []
      })
    },
    getAllCountry() {
      // 获取shipment origin_port数据
      getAllCountry().then(res => {
        if (res) {
          this.countryList = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table__body-wrapper {
  overflow-x: auto !important;
}

.dialog-scroll-container {
  max-height: 75vh;
  overflow: auto;
  padding-right: 10px;
}
</style>
