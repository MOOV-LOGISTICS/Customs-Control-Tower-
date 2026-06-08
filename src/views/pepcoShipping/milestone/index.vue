<template>
  <div class="app-container" style="width: 100%; padding-top: 20px">
    <!-- report start -->
    <div class="header-box">
      <div class="header-card" v-loading="downloadOrderLoading" style="flex-shrink: 0; margin-left: 8px;">
        <span @click="downloadOrderData">
          <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        </span>
      </div>

      <div class="header-card" style="flex-shrink: 0; margin-left: 8px">
        <icon-park style="cursor: default; border-right: 1px solid #ddd" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
        <div @click="bookedChange(false)" style="margin-left: 14px">
          <p style="font-size: 20px">{{ overviewCount.notBookedCount }}</p>
          <p style="margin-top: 8px">Not Booked(Carrier)</p>
        </div>
      </div>

      <div class="header-card" style="flex-shrink: 0; margin-left: 8px">
        <icon-park style="cursor: default; border-right: 1px solid #ddd" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        <div @click="bookedChange(true)" style="margin-left: 14px">
          <p style="font-size: 20px">{{ overviewCount.bookedCount }}</p>
          <p style="margin-top: 8px">Booked(Carrier)</p>
        </div>
      </div>

      <div class="header-card" id="portsDiv" style="flex-shrink: 0; margin-left: 8px;">
        <svg
          style="float:left;border-right: 1px solid #ddd;width: 65px;height: 65px;margin-top: -5px;padding-right: 10px;padding-bottom: 10px;"
          t="1717126148869"
          class="icon"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9997"
          width="200"
          height="200"
        >
          <path
            d="M433.048 157.845c22.74-23.043 53.113-33.978 83.097-32.752 27.355 0.612 54.457 11.772 74.685 33.277l6.274 6.672 329.473 342.037c18.106 18.797 5.1 50-20.74 50.622l-0.788 0.01-65.135-0.001v296.917c0 60.348-48.43 109.384-108.542 110.358l-1.825 0.015H298.028c-60.954 0-110.368-49.416-110.368-110.373V557.71h-77.709c-26.27 0-39.645-31.365-21.825-50.318l0.55-0.571z m17.17 480.2H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m243.73 0H576.682c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39h117.266c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m-243.73-246.039H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z"
            fill="#004F7C"
            p-id="9998"
          />
        </svg>
        <div v-for="(item, index) in overviewCount.dcCounts" :key="index" class="port-item">
          <p style="font-size: 20px;text-align: center;">{{ item.total }}</p>
          <p style="text-align: center; margin-top: 8px;">{{ dcList.find(v=>v.code==item.dc)?.name || 'Unkown' }}</p>
        </div>
      </div>
      <!-- <div v-hasPermi="['pepco:order:right:header']" class="header-card" style="flex-shrink: 0; margin-left: 8px" v-if="countryData.length > 0">
        <div style="display: flex">
          <div v-for="item in countryData" :key="item.originCountry">
            <div style="width: 100px; line-height: 24px; padding: 0 15px; border-right: 1px solid #ddd; border-radius: 10px">
              <p style="text-align: center; font-size: 20px">{{ item.count }}</p>
              <p style="text-align: center; margin-top: 8px">{{ item.originCountry }}</p>
            </div>
          </div>
        </div>
      </div>-->
    </div>
    <!-- report end -->

    <el-card class="pd-20">
      <!-- <transition name="el-zoom-in-center"> -->
      <el-form :model="queryParams">
        <div>
          <div style="float: left; padding-top: 8px"></div>

          <div style="float: left; padding: 10px 0px">
            <el-input
              placeholder="Shipping Order Ref"
              v-model="queryParams.shippingOrderRef"
              @input.native="queryParams.shippingOrderRef = $event.target.value.trim()"
              @keyup.enter.native="
                  queryParams.pageNo = 1
                  getList()
                "
              clearable
            >
              <!-- <el-button slot="append" @click=" queryParams.pageNo = 1, getList()" type="primary">Search<i
              class="el-icon-search el-icon--right"></i></el-button>-->
            </el-input>
          </div>

          <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-button slot="append" @click="getList" type="primary" style="background-color: white; color: black; border-color: #dcdfe6">
              Search
              <i class="el-icon-search el-icon--right"></i>
            </el-button>
          </div>

          <!-- <div style="float:left;margin-left: 5px;padding: 10px 0px;">
              <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.taskStatus" filterable placeholder="Status">
                <el-option v-for="item in allTaskNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </div>-->
          <!-- <div style="float:left;margin-left: 5px;padding: 10px 0px;">
              <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.booked" placeholder="Booked/Not Booked" clearable filterable>
                <el-option label="All" :value="null"></el-option>
                <el-option label="Not booked" :value="false"></el-option>
                <el-option label="Booked" :value="true"></el-option>
              </el-select>
          </div>-->

          <div style="float: left; margin-left: 5px; padding: 10px 0px">
            <el-popover v-model="filterPopover" placement="bottom" title="Filter" width="400" trigger="click">
              <el-form>
                <el-row :gutter="10" style="margin-bottom: 15px">
                  <el-col :span="12">
                    <el-select clearable v-model="queryParams.polList" filterable multiple placeholder="Origin Port" collapse-tags>
                      <el-option v-for="item in polList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select multiple clearable v-model="queryParams.countryList" placeholder="Origin Country" filterable>
                      <el-option v-for="item in country" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px">
                  <el-col :span="12">
                    <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                      <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select multiple clearable v-model="queryParams.dcList" placeholder="DC" filterable>
                      <!--                          <el-option v-for="item in dc" :key="item" :label="item" :value="item">-->
                      <!--                          </el-option>-->
                      <el-option v-for="item in dcList" :key="item.code" :label="item.code + ' - ' + item.name" :value="item.code"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px">
                  <el-col :span="12">
                    <el-select filterable clearable v-model="queryParams.shipmentType" placeholder="SO Type">
                      <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <!-- <el-col :span="12">
                      <el-select clearable v-model="queryParams.transportMode" :placeholder="$t('booking.transportMode')" filterable>
                        <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                      </el-select>
                  </el-col>-->
                </el-row>

                <el-row :gutter="10" style="margin-bottom: 15px">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="queryParams.etdDateRange"
                      clearable
                      type="daterange"
                      range-separator="-"
                      start-placeholder="ETD from"
                      end-placeholder="ETD to"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="margin-bottom: 15px"
                    ></el-date-picker>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col style="text-align: right">
                    <el-button @click=";(queryParams.pageNo = 1), getList()" icon="el-icon-search" plain>Search</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-button slot="reference" icon="el-icon-plus" plain :style="{ color: hasFilter ? 'red' : '' }">Filter</el-button>
            </el-popover>
            <el-button style="margin-left: 5px" @click="clearFilters" plain>Clear Filters</el-button>
          </div>
          <div style="clear: both"></div>
        </div>
      </el-form>

      <div v-loading="taskLoading" :style="{ height: tableHeight + 'px' }">
        <el-row :gutter="20" style="padding-top: 0px">
          <el-col :span="12" v-if="dataList.length > 0">
            <el-card style="margin-bottom: 20px; box-shadow: none !important; width: 800px" class="box-card" v-if="dataList.length > 0">
              <div style="padding: 20px 0px 20px 0; margin-left: -20px">
                <el-table border :data="dataList" style="width: 100%">
                  <el-table-column prop="taskName" label="Task Name" width="200">
                    <template slot-scope="scope">{{ scope.row.taskName === 'Container Loading Plan' ? 'Container Loading Result' : scope.row.taskName }}</template>
                  </el-table-column>
                  <el-table-column prop="partyRole" label="Party Role" min-width="80">
                    <template slot-scope="scope">{{ scope.row.partyRole }}</template>
                  </el-table-column>
                  <el-table-column prop="possible" align="center" label="Possible" min-width="100">
                    <template slot="header" slot-scope="scope">
                      <span class="title" style="color: #2d86ba; background-color: #ceecfd">Possible</span>
                    </template>
                    <template slot-scope="scope">
                      <span style="color: #2d86ba" class="numberOftask" @click="taskDetails(scope.row, 1)">{{ scope.row.possibleCount || 0 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="urgent" align="center" label="Urgent" min-width="100">
                    <template slot="header" slot-scope="scope">
                      <span class="title" style="color: #e6a23c; background: #fdf6ec">Urgent</span>
                    </template>
                    <template slot-scope="scope">
                      <span style="color: #e6a23c" class="numberOftask" @click="taskDetails(scope.row, 2)">{{ scope.row.urgentCount || 0 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="overdue" align="center" label="Overdue" min-width="100">
                    <template slot="header" slot-scope="scope">
                      <span class="title" style="color: #f56c6c; background: #fef0f0">Overdue</span>
                    </template>
                    <template slot-scope="scope">
                      <span style="color: #f56c6c" class="numberOftask" @click="taskDetails(scope.row, 3)">{{ scope.row.overdueCount || 0 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finished" align="center" label="Finished" min-width="100">
                    <template slot="header" slot-scope="scope">
                      <span class="title" style="color: #13854e; background-color: #d6ede2">Finished</span>
                    </template>
                    <template slot-scope="scope">
                      <span style="color: #13854e" class="numberOftask" @click="taskDetails(scope.row, 4)">{{ scope.row.finishedCount || 0 }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- </transition> -->
    </el-card>

    <task-detail-data ref="taskDetailData" @refresh="getList()"></task-detail-data>
  </div>
</template>

<script>
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { findShippingSchedulePortList } from '@/api/shipment/shipment'
import { getCustomFieldList } from '@/api/system/customField'
import { getVesselList } from '@/api/system/vessel'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { getOrderMilestoneOverview, milestoneQueryFilterData, milestoneOrderCountData, downloadShippingOrderData } from '@/api/pepco/milestone'
import TaskDetailData from './components/task-detail-data.vue'

export default {
  name: 'Container',
  mixins: [fileLoadMixin],
  components: { IconPark, TaskDetailData },
  data() {
    return {
      tableHeight: 0,
      loading: true,
      dataList: [], //overview list
      queryParams: {
        shippingOrderRef: undefined,
        supplierCode: undefined,
        shipmentType: undefined,
        transportMode: undefined,
        polList: [],
        countryList: [],
        dcList: [],
        hodDateRange: [],
        etdDateRange: []
      },
      filterPopover: false,
      partyMap: {},

      data: {},
      portMap: {},
      vesselListLes: [],
      overviewCount: {
        portCounts: [],
        bookedCount: 0,
        notBookedCount: 0
      },
      polList: [],
      dcList: [
        { code: '0006', name: 'Rawa' },
        { code: '0015', name: 'Sosnowiec' },
        { code: '0018', name: 'Gyal' },
        { code: '0021', name: 'Bucharest' },
        { code: '0027', name: 'Guadalajara' }
      ],
      taskInfo: {},
      portOptions: [],
      shipperList: [],
      ohaList: [],
      deptList: [],
      taskData: [],
      dialogVisible: false,
      allTaskNames: [],
      shippingPol: [],
      shippingPod: [],

      country: [],
      supplierCode: [],
      supplierList: [],
      countryData: [],
      taskLoading: false,
      downloadOrderLoading: false
    }
  },
  computed: {
    hasFilter() {
      this.queryParams.polList ||
        this.queryParams.country ||
        this.queryParams.countryList ||
        this.queryParams.supplierCode ||
        this.queryParams.dc ||
        this.queryParams.dcList ||
        this.queryParams.hodDateRange ||
        this.queryParams.etdDateRange
    }
  },
  mounted() {
    this.tableHeight = document.body.clientHeight - 302
    // 窗口重置时候，重新获取高度
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 302
        console.log(this.tableHeight)
      })()
    }
  },
  created() {
    this.getList()
    this.getFilterData()
    this.getOverviewCount()
    if (this.$store.getters.userCompanyTypes.length == 0) {
      this.$store.dispatch('GetUserCompanyTypes')
    }
  },
  methods: {
    checkPermi,
    checkRole,
    closeDialog() {
      this.errorDialog.visible = false
    },
    getFilterData() {
      console.log('start search filter data')
      milestoneQueryFilterData().then(res => {
        console.log('filter data', res)
        this.country = res.data.countryList
        this.supplierList = res.data.supplierList
        this.polList = res.data.polList
        // this.dcList = res.data.dcList
      })
    },
    getOverviewCount() {
      milestoneOrderCountData().then(res => {
        this.overviewCount = res.data
      })
    },
    taskDetails(row, flowStatus) {
      this.$refs.taskDetailData.openDialog(row, flowStatus, this.queryParams)
    },
    getOverviewData() {
      this.taskLoading = true
      getOrderMilestoneOverview(this.queryParams).then(res => {
        const list = []
        res.data.forEach(overview => {
          // 处理可见菜单权限
          if (checkPermi([`pepco:view:${overview.taskCode}`])) {
            if (overview.taskCode !== 'Shipper_Booking') {
              list.push(overview)
            }
          }
        })
        this.dataList = list || []
        this.taskLoading = false
      })
    },

    getCustomFieldList() {
      getCustomFieldList({}).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].type == 'order_header') {
            this.customFieldHeader.push(response.data[i])
          } else {
            this.customFieldLine.push(response.data[i])
          }
        }
        this.getList()
      })
    },
    getList() {
      console.log('查询getList')
      this.loading = true
      this.filterPopover = false
      this.getOverviewData()
    },

    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 302
    },

    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    //po页面的清除 筛选条件
    clearFilters() {
      //清除Filter
      this.queryParams.polList = null
      this.queryParams.countryList = []
      this.queryParams.supplierCode = null
      this.queryParams.dcList = []
      this.queryParams.hodDateRange = []
      this.queryParams.etdDateRange = []
      this.queryParams.shipmentType = null
      this.queryParams.transportMode = null
      this.queryParams.supplierType = null
      //清除搜索条件
      this.queryParams.shippingOrderRef = null
      this.queryParams.taskStatus = null
      this.queryParams.pageNo = 1
      this.getList()
    },
    downloadOrderData() {
      if (this.dataList.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        })
        return
      }
      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.downloadOrderLoading = true
          downloadShippingOrderData(this.queryParams).then(response => {
            this.$download.excel(response, 'shipping_order_data' + this.parseTimeToZ2(new Date()) + '.xlsx')
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            this.downloadOrderLoading = false
          })
        })
        .catch(() => {
          this.downloadOrderLoading = false
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
  }
}
</script>

<style lang="scss" scoped>
.port-item {
  position: relative;
  top: 0px;
  display: inline-block;
  line-height: 24px;
  padding: 0px 15px;
  border-right: 1px solid #ddd;
  border-radius: 10px;
  margin-left: 10px;
}

.el-table__header-wrapper .el-checkbox {
  display: none !important;
}

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
}

.title {
  font-weight: bold;
  padding-right: 10px;
}

.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}

.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}

.title {
  border: 5px;
}

.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: '';
  background: #004f7c;
  top: 20px;
  text-align: left;
}

.status2 {
  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}

.color1 {
  color: #13854e;
  background-color: #d6ede2;
}

.color2 {
  color: #2d86ba;
  background-color: #ceecfd;
}

.numberOftask {
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.color3 {
  color: #e6a23c;
  background: #fdf6ec;
}

.color4 {
  color: #f56c6c;
  background: #fef0f0;
}

::v-deep .hiddenCheck > .cell .el-checkbox__inner {
  display: none;
}

.center-input ::v-deep input {
  text-align: center;
}

.self-step2 {
  width: 20px;
  display: inline-block;
  height: 20px;
  border-radius: 20px !important;
  color: #fff;
  line-height: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  z-index: 999;
}

/* .self-step3:not(:first-child):before {
  width: 160px;
  height: 6px;
  position: absolute;
  left: -100px;
  content: "";
  background: #004F7C !important;
  top: 7px;
  text-align: left;
} */
.self-step3:not(:first-child):before {
  width: 150px;
  height: 6px;
  position: absolute;
  left: -80px;
  content: '';
  background: #004f7c !important;
  top: 7px;
  text-align: left;
}
/* 关键修改：自动换行后的每行第一个不显示横线 */

.self-step3:nth-child(6n + 1):before {
  display: none !important;
}

.self-step3:first-child:after {
  display: none !important;
}

.self-step-process1:not(:first-child):before {
  background: #63acd5 !important;
}

.self-step-finished1:not(:first-child):before {
  background: #004f7c !important;
}

.self-step-pedding1:not(:first-child):before {
  background: #ddd !important;
}

.self-step-error1:not(:first-child):before {
  background: #f56c6c !important;
}
</style>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: #fff;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266 !important;
  background-color: #fff;
}

// el-checkbox禁用样式修改
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input + span.el-checkbox__label {
  color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #606266;
}

.centered-descriptions :deep(.el-descriptions-item__content) {
  justify-content: center;
  text-align: center;
}

.centered-item :deep(.el-descriptions-item__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.header-box {
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  .header-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #ffffff;
  }
}
.warning {
  font-weight: bold;
  color: red;
}
</style>
