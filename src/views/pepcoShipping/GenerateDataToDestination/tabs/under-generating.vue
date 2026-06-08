<template>
  <div :loading="fullLoading">
    <!-- 搜索工作栏 -->
    <el-form :model="listQuery" size="mini" :inline="true" label-width="68px">
      <div style="float: left; padding-top: 8px">
        <div style="float: left; padding: 10px 0px">
          <el-input v-model="listQuery.mblNumber" :placeholder="$constants.MBL_NUMBER" clearable filterable
            @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left;margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.orderNumber" placeholder="PO" clearable filterable
            @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.bookingNumber" placeholder="Shipment Ref"
            @blur="listQuery.bookingNumber = $event.target.value.trim()" @keyup.enter.native="handleQuery()" clearable
            @clear="handleQuery()" />
        </div>

        <!-- 新增查询条件：soRef -->
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
                <el-select v-model="listQuery.oha" clearable filterable placeholder="OHA"
                  :filter-method="filterOhaMethod">
                  <el-option v-for="item in filteredOhaList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>

              </el-col>
              <el-col :span="8">
                <el-select v-model="listQuery.dcList" placeholder="DC" clearable filterable multiple>
                  <el-option v-for="item in dcList" :key="item.dcCode" :label="`${item.dcCode} - ${item.dcName}`"
                    :value="item.dcCode" />
                </el-select>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="10" style="margin-bottom: 15px;">
              <!-- <el-col :span="8">
                <el-input v-model="listQuery.shipperBookingNumber" clearable placeholder="Shipper Booking Number" />
              </el-col> -->
              <el-col :span="8">
                <el-input v-model="listQuery.hblNumber" clearable placeholder="HBL Number" />
              </el-col>
              <el-col :span="8">
                <el-select v-model="listQuery.carrier" clearable filterable placeholder="Carrier">
                  <el-option v-for="item in carrierList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="listQuery.shipmentType" clearable filterable placeholder="Shipping Type">
                  <el-option label="FCL" value="FCL" />
                  <el-option label="LCL" value="LCL" />
                </el-select>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="margin-bottom: 15px;">
              <el-col :span="8">
                <el-select v-model="listQuery.country" multiple clearable filterable placeholder="Origin Country">
                  <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>

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
    <el-table :height="tableHeight" v-loading="loading" :data="list" style="width: 100%" @expand-change="handleExpand">
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs v-model="scope.row.activeName">
            <el-tab-pane label="Comments" :name="'Comments' + scope.row.id">
              <order-comment :order-id="scope.row.id" order-type="5" :no-title="true" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column :label="$constants.MBL_NUMBER" align="center" :min-width="120" prop="mblNumber" show-overflow-tooltip />
      <el-table-column label="Shipment Ref" align="center" :min-width="120" prop="bookingNumber"
        show-overflow-tooltip />
      <el-table-column label="POL" align="center" :min-width="120" prop="pol" show-overflow-tooltip />
      <el-table-column label="POD" align="center" :min-width="120" prop="destinationPort" show-overflow-tooltip />
      <!-- <el-table-column label="SO Ref" align="center" :min-width="150" prop="soRefs" show-overflow-tooltip /> -->
      <!-- <el-table-column label="Order Number" align="center" :min-width="120" prop="poNumbers" show-overflow-tooltip /> -->
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

      <!-- 新增列：SO Ref -->

      <!-- 操作列 -->
      <el-table-column label="Operation" align="center" :min-width="120">
        <template #default="scope">
          <!-- 查看按钮 -->
          <!-- <el-tooltip content="View Details" placement="top"> -->
            <el-button class="el-icon-view" type="text" size="small" @click="handleView(scope.row)"></el-button>
          <!-- </el-tooltip> -->

          <!-- 编辑按钮 -->
          <!-- <el-tooltip content="Edit Status" placement="top">
            <el-button class="el-icon-edit" type="text" size="small" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>-->

          <!-- 生成按钮，仅当状态为In Process（1）时可点击 -->
          <!-- <el-tooltip :content="scope.row.generateDestinationFlag === 4 ? 'Generate Destination' : 'Cannot Generate'"
            placement="top"> -->
            <el-button class="el-icon-check" type="text" size="small"
              :disabled="scope.row.generateDestinationFlag !== 4" @click="handleGenerate(scope.row)"></el-button>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 详情抽屉 -->
    <el-dialog title="Details" :visible.sync="dialogVisible" width="80%" top="5vh" :close-on-click-modal="false">
      <div class="dialog-scroll-container">
        <detail-view :record="currentRecord" />
      </div>
    </el-dialog>

    <el-dialog title="Edit Status" :visible.sync="statusDialogVisible" width="400px"
      :before-close="() => { statusDialogVisible = false }">
      <el-form label-width="120px">
        <el-form-item label="Select Status">
          <el-select v-model="newStatus" placeholder="Select status">
            <el-option v-for="option in statusOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmStatusChange">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getGenerateReadyDataPage, exportGenerateReadyData, updateShipmentStatus, getFilterListForGenerate } from '@/api/shipment/shipment'
import { generateDataByShipmentId, getAllCountry } from '@/api/destination/destination'
import DetailView from '../components/detail-view.vue'
import OrderComment from '@/views/components/order-comment/index.vue'
import { getDestinationDcList } from '@/api/destination/destination';


export default {
  components: { DetailView, OrderComment },
  data() {
    return {
      loading: false,
      fullLoading: false,
      filterPopover: false,
      tableHeight: 0,
      total: 0,
      list: [],
      activeName: 'Comments',
      listQuery: {
        bookingNumber: '',
        orderNumber: '',
        soRef: '',
        generateDestinationFlag: [4],
        mblNumber: '',
        pol: '',
        oha: '',
        dcList: [],
        // shipperBookingNumber: '',
        hblNumber: '',
        carrier: '',
        etaRange: [],
        etaStart: null,
        etaEnd: null,
        shipmentType: null,
        country: [],
        pageSize: 20,
        pageNo: 1
      },
      dcList: [],
      ohaList: [],
      filteredOhaList: [],
      polList: [],
      carrierList: [],
      statusMap: {
        1: { label: 'Checking', type: 'warning' },
        2: { label: 'Done', type: 'success' },
        3: { label: 'Pending', type: 'info' },
        4: { label: 'In Process', type: 'warning' }
      },
      statusDialogVisible: false, // 控制Dialog显示
      currentRowForStatus: null, // 当前选中行
      newStatus: null, // 选择的新状态
      statusOptions: [
        { value: 1, label: 'Checking' },
        { value: 2, label: 'Done' },
        { value: 3, label: 'Pending' },
        { value: 4, label: 'In Process' }
      ],
      dialogVisible: false,
      currentRecord: null,
      countryList: []
    }
  },
  created() {
    this.handleQuery()
    this.loadDcList();
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
    handleExpand(row, expandedRows) {
      row.activeName = 'Comments' + row.id
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
          // 处理 soRef 去重拼接
          this.list = (res.data.list || []).map(item => {
            if (item.shippingOrderRes && item.shippingOrderRes.length > 0) {
              const uniqueSoRefs = [...new Set(item.shippingOrderRes.map(s => s.soRef))]
              item.soRefs = uniqueSoRefs.join(',')
            } else {
              item.soRefs = ''
            }
            return item
          })
          this.total = res.data.total || 0
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleEdit(row) {
      this.currentRowForStatus = row
      this.newStatus = row.generateDestinationFlag // 默认选中当前状态
      this.statusDialogVisible = true
    },

    async confirmStatusChange() {
      if (!this.currentRowForStatus) return

      try {
        await updateShipmentStatus({
          shipmentId: this.currentRowForStatus.id,
          status: this.newStatus
        })
        this.$message.success('Status updated successfully.')
        this.statusDialogVisible = false
        this.getList() // 刷新列表
      } catch (err) {
        console.error(err)
        this.$message.error('Failed to update status.')
      }
    },

    async handleExport() {
      this.fullLoading = true
      try {
        const blob = await exportGenerateReadyData(this.listQuery)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // 文件名写死
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

    handleView(row) {
      this.currentRecord = row
      this.dialogVisible = true
    },
    handleClick(el, item, index) {
      if (this.activeName.startsWith('Comments')) {
        console.log('tab click', this.activeName)
        this.$refs.orderComments[index].loadComments()
      }
    },
    loadFilterOptions() {
      getFilterListForGenerate({}).then(res => {
        this.ohaList = res.data.ohaList || []
        this.filteredOhaList = [...this.ohaList]
        this.carrierList = res.data.carrierList || []
        this.polList = res.data.polList || []
      })
    },
    filterOhaMethod(query) {
      if (!query) {
        this.filteredOhaList = this.ohaList
      } else {
        const q = query.toLowerCase()
        this.filteredOhaList = this.ohaList.filter(item =>
          item.name && item.name.toLowerCase().includes(q)
        )
      }
    },


    resetFilter() {
      this.listQuery.bookingNumber = ''
      this.listQuery.orderNumber = ''
      this.listQuery.soRef = ''
      this.listQuery.generateStatus = null
      this.listQuery.mblNumber = ''
      this.listQuery.pol = ''
      this.listQuery.oha = ''
      this.listQuery.dcList = []
      // this.listQuery.shipperBookingNumber = ''
      this.listQuery.hblNumber = ''
      this.listQuery.carrier = ''
      this.listQuery.polList = []
      this.listQuery.shipmentType = null
      this.listQuery.country = []
      this.listQuery.etaRange = []
      this.listQuery.etaStart = null
      this.listQuery.etaEnd = null
      this.handleQuery()
    },

    loadDcList() {
      getDestinationDcList({}).then(res => {
        this.dcList = res.data || []
      })
    },
    async handleGenerate(row) {
      if (row.generateDestinationFlag !== 4) {
        this.$message.warning('Only In Process shipments can generate destination data.')
        return
      }

      try {
        await this.$confirm('Are you sure you want to generate destination data? Please confirm that the data is correct.', 'Confirmation', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        await generateDataByShipmentId({ shipmentId: row.id })
        this.$message.success('Generation request submitted.')
        this.getList()
      } catch (err) {
        this.$message.info('Operation cancelled.')
      }
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
