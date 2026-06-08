<template>
  <div class="app-container" style="width: 100%; margin: 0 auto" v-loading="loading">
    <el-dialog title="Airline" :visible.sync="dialogVisibleAirline" width="640px">
      <ChooseAir @change-value="changeParentValue"></ChooseAir>
    </el-dialog>
    <div class="flex-card" style="margin-bottom: 20px">
      <el-card style="background: transparent; box-shadow: none !important">
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <span>
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
        <!-- <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <span>
            <img style=" width: 42px;  height: 42px;  margin-left: 10px; margin-right: 10px;  margin-top: 3px;  margin-bottom: 2px; cursor: pointer; " src="../../../assets/icons/container.png" />
          </span>
        </el-card> -->

        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
        <!-- <icon-park style="border-right: 1px solid #ddd" type="plane" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>       -->
        <icon-park style="border-right: 1px solid #ddd" type="airplane" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
        <div :class="{ avticePort: queryParams.statusList.includes('vesselDeparture') }" style="float: right; line-height: 24px; margin-left: 10px; border-radius: 10px; padding: 0px 15px; cursor: pointer;">
            <p style="font-size: 20px">{{  bookingReportData.atdCount  }}</p>
            <p style="white-space: nowrap">Departure</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <icon-park style="border-right: 1px solid #ddd" type="airplane" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div :class="{ avticePort: queryParams.statusList.includes('vesselArrived') }" style="  float: right; line-height: 24px;margin-left: 10px;border-radius: 10px;padding: 0px 15px;cursor: pointer; ">
            <p style="font-size: 20px">{{  bookingReportData.ataCount }}</p>
            <p style="white-space: nowrap">Arrived</p>
          </div>
        </el-card>

        <el-card class="pd-20 pod-count-css" :body-style="{ display: 'flex' }">
          <!-- <icon-park style="border-right: 1px solid #ddd" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" /> -->
          <icon-park style="border-right: 1px solid #ddd" type="airplane" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{ avticePort: checkedPort[item.destinationPort] }" :key="item.destinationPort" @click="clickPort(item.destinationPort)" v-for="item in bookingReportData.ports" style="  float: right; line-height: 24px;  padding: 0px 15px; border-right: 1px solid #ddd; cursor: pointer; border-radius: 10px; margin-left: 10px;">
            <p style="font-size: 20px">{{ item.count }}</p>
            <p>{{ item.destinationPort }}</p>
          </div>
        </el-card>
      </el-card>
    </div>

    <el-card style="padding: 10px">
      <div>
        <div class="bottom-shadow">
          <div style="padding: 10px 0px">
            <div style="float: left" class="form-container">
              <el-form :model="queryParams">
                <div style="float: left">
                  <el-input
                    placeholder="Moov Ref"
                    v-model="queryParams.moovRef"
                    @blur=" queryParams.moovRef = $event.target.value.trim()"
                    @keyup.enter.native="(queryParams.pageNo = 1), getPage()"
                    clearable
                    @clear="(queryParams.pageNo = 1), getPage()"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="Booking Number"
                    v-model="queryParams.bookingRef"
                    @blur="queryParams.bookingRef = $event.target.value.trim()"
                    clearable
                    @clear="(queryParams.pageNo = 1), getPage()"
                    @keyup.enter.native="(queryParams.pageNo = 1), getPage()"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="PO"
                    v-model="queryParams.poNumbers"
                    @blur="queryParams.poNumbers = $event.target.value.trim()"
                    clearable
                    @clear="(queryParams.pageNo = 1), getPage()"
                    @keyup.enter.native="(queryParams.pageNo = 1), getPage()"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="Shipping Booking Number"
                    style="min-width: 200px;"
                    v-model="queryParams.shippingOrderRef"
                    @blur=" queryParams.shippingOrderRef = $event.target.value.trim()"
                    @keyup.enter.native="(queryParams.pageNo = 1), getPage()"
                    clearable
                    @clear="(queryParams.pageNo = 1), getPage()"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-button @click="getPage()">
                    <i class="el-icon-search"></i> Search
                  </el-button>
                </div>
                        <div style="float: left; margin-left: 5px">
                  <el-popover v-model="advancedQueryFormPopover" placement="bottom" width="400" trigger="click">
                    <el-form ref="advancedForm" :model="queryParams">
                      <el-row>
                        <el-col>
                          <el-date-picker
                            clearable
                            @clear="(queryParams.pageNo = 1), getPage()"
                            v-model="queryParams.etaDateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="ETA from"
                            end-placeholder="ETA to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          ></el-date-picker>
                        </el-col>
                      </el-row>
                      <el-row class="form-spacing">
                        <el-col>
                          <el-date-picker
                            clearable
                            @clear="(queryParams.pageNo = 1), getPage()"
                            v-model="queryParams.etdDateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="ETD from"
                            end-placeholder="ETD to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          ></el-date-picker>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1), getPage()" placeholder="POL" filterable v-model="queryParams.polList">
                            <el-option v-for="(dict, index) in polDataList"  :key="'pol-' + index" :label="dict" :value="dict" />
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1), getPage()" placeholder="POD" filterable v-model="queryParams.podList">
                            <el-option v-for="(dict, index) in podDataList"  :key="'pod-' + index" :label="dict" :value="dict" />
                          </el-select>
                        </el-col>
                
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select multiple v-model="queryParams.statusList" clearable placeholder="Booking status">
                            <el-option label="All" value="-1"></el-option>
                            <el-option label="Draft" value="0"></el-option>
                            <el-option label="Booking Submitted" value="1"></el-option>
                            <el-option label="Booking Confirmed" value="2"></el-option>
                            <!-- <el-option label="Shipping SI" value="shippingSI"></el-option> -->
                            <!-- <el-option label="Shipping Instruction" value="shippingInstructions"></el-option> -->
                            <!-- <el-option label="Vessel Departure" value="vesselDeparture"></el-option> -->
                            <el-option label="Departure" value="3"></el-option>
                            <el-option label="Cancel" value="9"></el-option>
                            <!-- <el-option label="Deactivate" value="deactivate"></el-option> -->
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1); getPage()" placeholder="Airline" filterable v-model="queryParams.airlineList">
                            <el-option v-for="(dict, index) in airLineDataList" :key="'airline-' + index" :label="dict" :value="dict" />
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col style="text-align: right">
                          <el-button @click="getPage()">
                            <i class="el-icon-search"></i> Search
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-form>

                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:'red'}">Filter</el-button>

                  </el-popover>
                  <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>

                </div>
              </el-form>
            </div>
            <div style="float: right">
              <el-button type="primary" @click="createShipment">Create Shipment</el-button>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </div>

      <div :style="{ height: height + 'px' }" style=" float: left; width: calc(100%); position: relative;padding-top: 10px; ">
        <div style="overflow: auto" :style="{ height: height - 55 + 'px' }">
          <el-empty v-if="tableData.length == 0 && !loading" description="No Data"></el-empty>
          <el-row :gutter="0" style="  background: #fff; box-shadow: none !important;   border: 1px solid #ddd; " class="margin-top" v-for="(item, index) in tableData" :key="item.id">
            <el-col :span="24" style="padding-top: 10px; padding-bottom: 10px">
              <div class="shipment-row">
                <!-- 左侧 Airline -->
                <div class="shipment-airline">
                  <!-- <AirLogo :airline="item.airline" /> -->
                  <span>{{ item.airline }}</span>
                </div>

                <!-- 中间 + 右侧 -->
                <div class="shipment-main">
                  <div class="middle-cols">
                    <div class="col">
                      <div class="kv-line">
                        <span class="k">Moov Reference</span>
                        <span class="v" style="cursor: pointer; color: #004F7C;" @click="bookingDetail(item)">{{ item.moovRef || '-' }}</span>
                      </div>

                      <div class="kv-line">
                        <span class="k">POL</span>
                        <span class="v">{{ item.pol || '-' }}</span>
                      </div>

                      <div class="kv-line">
                        <span class="k">Booked ETD/ETA</span>
                        <span class="v">{{ parseUTCTime(item.bookedEtd) }} / {{ parseUTCTime(item.bookedEta) }}</span>
                      </div>
                    </div>

                    <div class="col">
                      <div class="kv-line">
                        <span class="k">Booking Reference</span>
                        <span class="v">{{ item.bookingRef || '-' }}</span>
                      </div>

                      <div class="kv-line">
                        <span class="k">POD</span>
                        <span class="v">{{ item.pod || '-' }}</span>
                      </div>

                      <div class="kv-line">
                        <span class="k">ETD/ETA</span>
                        <span class="v">{{ parseUTCTime(item.etd) }} / {{ parseUTCTime(item.eta) }}</span>
                      </div>
                    </div>

                    <div class="col">
                      <div class="kv-line">
                        <span class="k">MAWB Number</span>
                        <span class="v">{{ item.awbNumber || '-' }}</span>
                      </div>
                      <div class="kv-line">
                        <span class="k"></span>
                        <span class="v"></span>
                      </div>
                      <div class="kv-line">
                        <span class="k"></span>
                        <span class="v"></span>
                      </div>

                      <div class="kv-line">
                        <span class="k">ATD/ATA</span>
                        <span class="v">{{ parseUTCTime(item.atd) }} / {{ parseUTCTime(item.ata) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="shipment-right">
                    <el-tag size="mini" :type="statusEnum[item.status]?.type || 'info'">{{ statusEnum[item.status]?.label || 'Unknown' }}</el-tag>

                    <div class="btns">
                      <!-- <el-button v-if="item.status == 0 ||item.status == 1 " @click="updateBooking(item)" type="text">Update</el-button> -->
                      <!-- <el-button type="text">Copy</el-button> -->
                      <!-- <el-button @click="bookingDetail(item)" type="text">Details</el-button> -->

                     <el-dropdown size="mini" >
                      <el-button type="primary">
                        More
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="item.status == 0 ||item.status == 1 
                          ">
                          <el-link @click="updateBooking(item)">Update</el-link>
                        </el-dropdown-item>
                   
               
                      </el-dropdown-menu>
                    </el-dropdown>


                    </div>

                    <div class="expand" :class="{ open: expanded[item.id] }" @click="toggleDetails(item.id)">
                      <svg width="30" height="30" viewBox="0 0 48 48">
                        <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" />
                        <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="24" style="padding: 0px">
              <el-collapse-transition>
                <div v-show="expanded[item.id]" style="width: 100%">
                  <el-tabs :ref="'tab' + item.id" v-model="item.key">
                    <el-tab-pane :name="'Orders' + item.id" label="Orders">
                      <el-table v-loading="linesLoading" :data="linesDic[item.id]" show-summary sum-text="Total" size="mini" :summary-method="getSummaries">
                        <el-table-column prop="orderNumber" label="Order Number" min-width="120" align="center"></el-table-column>
                        <el-table-column prop="itemNumber" label="Item Number" min-width="100" align="center"></el-table-column>
                        <el-table-column prop="itemName" label="Item Name" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="tcId" label="TCId" width="80" align="center"></el-table-column>
                        <el-table-column prop="bookedOuter" label="Booked Outer(Cartons)" min-width="130" align="center"></el-table-column>
                        <el-table-column prop="volume" label="Volume(cbm)" min-width="100" align="center"></el-table-column>
                        <el-table-column prop="grossWeight" label="Gross Weight(kg)" min-width="120" align="center"></el-table-column>
                        <!-- <el-table-column prop="targetETA" label="Target ETA" min-width="120" align="center"></el-table-column> -->
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </el-col>
          </el-row>
        </div>

        <pagination v-show="lineTotal > 0" :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getPage" />
      </div>

      <div style="clear: both"></div>
    </el-card>
  </div>
</template>


<script>
import { getUserProfile } from '@/api/system/user'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import AirLogo from '@/views/air-booking/booking/components/air-logo.vue'
import ChooseAir from '@/views/air-booking/booking/components/choose-air.vue'
import { getDetail, airBookingPage,filterData,reportData,bookingOrderData } from '@/api/air/booking'
import { createSubscribe, deleteSubscribe } from '@/api/order/subscribe'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import { getOrderHeaderListByShipmentId } from '@/api/pepco/shipping-order.js'
import { parseTime as parseDateTime } from '@/utils/ruoyi'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'

export default {
  name: 'Booking',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    }
  },
  components: { IconPark, AirLogo, ChooseAir },
  data() {
    return {
      expanded: {},
      tableData: [],
      loading: true,
      expanded: {},
      size: 'small',
      lineTotal: 0,
      height: '',
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        isSubscribed: false,
        statusList: [],
        moovRef: null,
        poNumbers: null,
        bookingRef: null,
        etaDateRange: [],
        etdDateRange: [],
        vesselList: [],
        voyageList: [],
        polList: [],
        shippingOrderRef: null,
        airlineList: [],
        podList: []
      },
      productMap: {},
      activities: [],
      totalShipment: 0,

      portData: [],
      bookingReportData: {
        ports: [],
        atd: 0,
        ata: 0,
        subscribeds: 0
      },
      checkedPort: {},
      airline: '',
      air: '',

      title: '',
      form: {},
      user: {},

      activeIndex: null,
      currentSort: null,
      sortForm: {
        names: '',
        type: ''
      },
      sortFormPopover: false,
      approvalInfoNum: 0,
      OrderItems: [],
      dataList: [],
      lines: [],
      linesDic: {},
      linesLoading: true,
      dialogVisibleAirline: false,
      statusEnum: {
        0: { label: 'Draft', type: 'info' },
        1: { label: 'Submitted', type: 'success' },
        2: { label: 'Confirmed', type: 'success' },
        3: { label: 'Departure', type: 'success' },
        4: { label: 'Arrived', type: 'success' },
        9: { label: 'Canceled', type: 'danger' }
      },
      hasContent: false,
      advancedQueryFormPopover: false,
      polDataList: [],
      podDataList: [],
      airLineDataList: []
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowHeight = document.documentElement.clientHeight
      this.height = this.windowHeight - 310
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 310
    getUserProfile().then(response => {
      this.user = response.data
    })
    if (this.$route.query.bookingNumber) {
      this.queryParams.moovRef = this.$route.query.bookingNumber
    }

    if (this.$route.query.orderNumber) {
      this.queryParams.poNumbers = this.$route.query.orderNumber
    }
    this.getFilterData()
    this.getReportData()
    this.getPage()
  },
  methods: {
    getDictDatas,

    customerRequest() {
      const url = this.$router.resolve({
        path: '/support/customerRequest'
      }).href
      window.open(url, '_blank')
    },

    // shipmentReport() {
    //   shipmentReport(this.queryParams).then(res => {
    //     this.bookingReportData = res.data
    //   })
    // },
    checkPermi,
    checkRole,
    // toggleDetails(index) {
    //   console.log('点击',index)
    //   this.$set(this.expanded, index, !this.expanded[index])
    // },

    detail(path) {
      //this.$router.push(path);
      window.open(path)
    },

    updateShipment(item) {
      if (item.airline == 'TSHG') {
        this.$router.push('/shipment/update?id=' + item.id)
      } else {
        this.$router.push('/shipment/update-shipment?id=' + item.id)
      }
    },
    copyShipment(item) {
      if (item.airline == 'TSHG') {
        this.$router.push('/shipment/copy?id=' + item.id)
      } else {
        this.$router.push('/shipment/copy-shipment?id=' + item.id)
      }
    },

    sortByQueryParams(property, asc = true) {
      //默认升序
      asc = asc == true ? -1 : 1
      return function (value1, value2) {
        let a = value1[property]
        let b = value2[property]
        return a < b ? asc : a > b ? asc * -1 : 0
      }
    },
    clickPort(item) {
      this.loading = true
      var flag = false
      for (var i = 0; i < this.activities.length; i++) {
        if (this.activities[i].content == item.content) {
          if (this.activities[i].type == 'primary') {
            flag = true
            this.activities[i].type = ''
          } else {
            this.activities[i].type = 'primary'
          }
        } else {
          this.activities[i].type = ''
        }
        this.$set(this.activities, i, this.activities[i])
      }
      if (flag) {
        this.queryParams.pol = ''
        this.queryParams.pod = ''
      } else {
        this.queryParams.pol = item.content.split('-')[0]
        this.queryParams.pod = item.content.split('-')[1]
      }
      this.queryParams.pageNo = 1
      this.getPage()
    },
    createShipment() {
      this.dialogVisibleAirline = true
    },
    resetSortForm(name) {
      this.sortForm = {
        names: '',
        type: ''
      }
      this.activeIndex = null
      this.sortFormPopover = false
      this.queryParams.prop = null
      this.queryParams.orderBy = null
      this.getPage()
    },
    sortPage() {
      if (this.sortForm.type == '') {
        this.currentSort = null
        this.activeIndex = null
      } else {
        this.activeIndex = this.sortForm.type === 'Earliest date first' ? 0 : 1 // 切换索引
        if (this.activeIndex === null) {
          // 如果之前没有激活的索引，则默认激活第一个
          this.activeIndex = 0
        }
      }
      this.sortFormPopover = false
      this.queryParams.prop = this.sortForm.names
      this.queryParams.orderBy = this.sortForm.type
      if (this.sortForm.type == 'Latest date first') {
        this.queryParams.orderBy = 'DESC'
      }
      if (this.sortForm.type == 'Earliest date first') {
        this.queryParams.orderBy = 'ASC'
      }
      this.getPage()
    },
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getPage()
    },
    getPage() {
      this.loading = true
      if (this.queryParams.statusList.includes('all')) {
        this.queryParams.statusList = []
      }
      this.updateHasContent()
      this.getReportData()
      airBookingPage(this.queryParams).then(response => {
        if (response.data.list !=null && response.data.list.length > 0) {
          for (var i = 0; i < response.data.list.length; i++) {
            var tempItem = response.data.list[i]
            tempItem.key = 'Orders' + tempItem.id
          }
          this.tableData = response.data.list
          this.lineTotal = response.data.total
          this.expanded = {}
          }
        
        this.loading = false
      })
    },

    toggleDetails(index) {
      console.log('toggleDetails122', index)
      this.$set(this.expanded, index, !this.expanded[index])
      // 处理订单行
      this.linesLoading = true
      bookingOrderData({ bookingId: index }).then(res => {
        console.log('结果返回值', res.data)
        this.dataList = []
        this.lines = []
        res.data.forEach(row => {
          let items = []

          const header = {
            id: row.orderHeader.id,
            orderNumber: row.orderHeader.orderNumber
          }
          console.log('header', header)
          // 生成行数据
          row.orderItems.forEach(item => {
            console.log(item)
            const tmp = {
              id: item.id,
              orderId: item.orderId,
              orderNumber: row.orderNumber,
              itemNumber: item.productCode,
              itemName: item.productName,
              tcId: item.tcId,
              orderedPieces: item.requested,
              outerQty: item.outerQty,
              outerSize: item.outerSize,
              tcSize: item.tcSize,
              tcQty: item.tcQty,
              bookedProOuterSize: item.bookedProOuterSize,
              bookedProInnerPerOuter: item.bookedProInnerPerOuter,
              outerWeight: item.outerWeight || 0,
              length: item.length,
              width: item.width,
              height: item.height,
              // 计划的crd
              plannedCrd: row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000,
              // supplier 实际传的crd
              supplierCrd: row.cargoReadyDate,
              //deliveryDate: row.deliveryDate,
              // targetETA: parseDateTime(row.deliveryDate - 42 * 24 * 60 * 60 * 1000) + ` to ` + parseDateTime(row.deliveryDate - 14 * 24 * 60 * 60 * 1000)
            }
            tmp.orderedOuter = item.outerQty
            tmp.orderedInner = item.tcQty
            tmp.bookedOuter = item.booked
            tmp.bookedInner = item.bookedInner
            tmp.bookedPieces = item.bookedPieces
            tmp.grossWeight = (tmp.bookedOuter * tmp.outerWeight).toFixed(3)
            tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(3) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000
            tmp.orderNumber = row.orderHeader.orderNumber
            items = [...items, tmp]
          })
          this.lines = [...this.lines, ...items]
          header.items = items
          this.dataList = [...this.dataList, header]
        })
        this.linesDic[index] = [...this.lines]
        console.log(index)
        console.log(this.linesDic)
        this.linesDic = JSON.parse(JSON.stringify(this.linesDic))
             console.log('this.linesDic ',this.linesDic)
        // dataList 抽取orderNumber，使用逗号连接
        // const orderNumbers = this.dataList.map(item => item.orderNumber).join(',')
        // const orderNumbers = this.dataList.map(item => item.orderNumber)
        // const itemNames = this.lines.map(item => item.itemName)
        // const result = {
        //   orderNumbers: Array.from(new Set(orderNumbers)),
        //   itemNames: Array.from(new Set(itemNames))
        // }
        this.linesLoading = false
        console.log(result)
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
    },
    clickPort(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item])
      var ports = []
      for (var key in this.checkedPort) {
        if (this.checkedPort[key]) {
          ports.push(key)
        }
      }
      this.queryParams.ports = ports
      this.getPage()
    },
    changeParentValue(value) {
      console.log('选择的的船公司和类型', value)
      const carrier = value.carrier
      const transport = value.transport
      if (carrier == null || carrier == '') {
        return
      }
      if (transport == 'sea') {
        if (carrier == 'TSHG') {
          this.$router.push('/shipment/create?carrier=' + carrier)
        } else {
          this.$router.push('/shipment/create-shipment?carrier=' + carrier)
        }
      } else if (transport == 'air') {
        console.log('选择的的船公司和类型跳转', carrier)
        this.$router.push('/shipment/create-air-booking?carrier=' + carrier)
      } else {
        return
      }
    },
    updateBooking(item) {
      this.$router.push('/shipment/update-air-booking?bookingId=' + item.id)
    },
    bookingDetail(item) {
      this.$router.push('/shipment/air-booking-detail?bookingId=' + item.id)
    },
    updateHasContent() {
      this.advancedQueryFormPopover = false
      this.hasContent =
        (this.queryParams.etaDateRange && this.queryParams.etaDateRange.length > 0) ||
        (this.queryParams.etdDateRange && this.queryParams.etdDateRange.length > 0) ||
        this.queryParams.polList.length ||
        this.queryParams.podList.length ||
        this.queryParams.statusList.length
    },
    getFilterData() {
      filterData().then(res => {
        console.log('filterData', res)
        this.$set(this, 'polDataList', res.data != null ? res.data.polList : [])
        this.$set(this, 'podDataList', res.data != null ? res.data.podList : [])
        this.$set(this, 'airLineDataList', res.data != null ? res.data.airLineList : [])
        console.log('airLineDataList', this.airLineDataList)
      })
    },
    clearFilters() {
      this.queryParams = {
        statusList: [],
        moovRef: null,
        poNumbers: null,
        bookingRef: null,
        etaDateRange: [],
        etdDateRange: [],
        vesselList: [],
        voyageList: [],
        polList: [],
        shippingOrderRef: null,
        airlineList: [],
        podList: []
      }
      this.getPage()
    },

    getReportData() {
      reportData(this.queryParams).then(res => {
        if (res.data != null) { 
        this.bookingReportData = res.data
        }
        console.log('this.bookingReportData', this.bookingReportData)
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total'
          return
        }
        const prop = column.prop
        if (prop === 'bookedOuter') {
          const values = data.map(item => Number(item[prop]) || 0)
          sums[index] = values.reduce((prev, curr) => prev + curr, 0)
        } else if (prop === 'volume') {
          const values = data.map(item => Number(item[prop]) || 0)
          sums[index] = values.reduce((prev, curr) => prev + curr, 0).toFixed(3)
        } else if (prop === 'grossWeight') {
          const values = data.map(item => Number(item[prop]) || 0)
          sums[index] = values.reduce((prev, curr) => prev + curr, 0).toFixed(3)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
      parseUTCTime(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}`  // 日期 + 时分
    },

  }
}
</script>
<style scoped>
p {
  margin: 0px;
}
/* .expand-transition {
  transition: all 0.5s;
  height: 0;
  overflow: hidden;
}

.expand-transition-enter,
.expand-transition-leave-to {
  height: 0;
}

.expand-transition-enter-active,
.expand-transition-leave-active {
  height: auto;
} */
/* .rotate-90 {
  transform: rotate(90deg);
} */
.demo-table-expand {
  font-size: 0;
}
.border-top {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.el-descriptions {
  padding: 15px;
  margin-bottom: 15px;
}
.el-descriptions-row th {
  color: rgb(0, 79, 124);
  font-weight: 700 !important;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.shipment-logo .partyLogo {
  position: relative !important;
  top: 23px !important;
  margin-left: 20px !important;
}
span.el-descriptions-item__label.shipment-status-class {
  margin: 0 !important;
}

.not-check-css {
  border-color: red;
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

/deep/.el-table__footer-wrapper tbody td.el-table__cell {
  color: #004f7c;
}
/deep/.el-table .el-table__footer-wrapper .cell {
  color: #004f7c;
}
.custom-sort-popover .custom-sort-form {
  padding: 10px;
}
.red-text {
  color: red;
}
.el-row {
  margin-bottom: 20px;
}
.pod-count-css {
  float: left;
  margin-right: 20px;
  margin-top: 10px;
  max-width: 50%;
  overflow: auto;
}
@media only screen and (min-width: 1000px) {
  .pod-count-css {
    max-width: 22%;
  }
}
@media only screen and (min-width: 1200px) {
  .pod-count-css {
    max-width: 35%;
  }
}
@media only screen and (min-width: 1500px) {
  .pod-count-css {
    max-width: 43%;
  }
}
@media only screen and (min-width: 1700px) {
  .pod-count-css {
    max-width: 50%;
  }
}
@media only screen and (min-width: 1900px) {
  .pod-count-css {
    max-width: 60%;
  }
}
</style>

<style lang="scss">
.car-css {
  padding-bottom: 4px;
}
span.el-descriptions-item__label.shipment-status-class {
  margin-right: 0px !important;
}
.sort-page {
  margin-top: -3px;
  font-size: 13px;
  display: inline-flex;
}
.sort-page .active {
  color: red; /* 或者你想要的任何颜色 */
}
.customer-request sup.el-badge__content.is-fixed {
  font-size: 14px;
  right: 15px;
}

.flex-card {
  .el-card__body {
    display: flex;
    align-items: flex-start;
  }

  :deep(.el-card__body) {
    display: flex;
  }
}
.action-btn {
  padding: 0;
  color: #004F7C;
  font-weight: 600; /* 600/700 都可以 */
}

.divider {
  margin: 0 6px;
  color: #004F7C;
  font-weight: 600; /* 600/700 都可以 */
}

.shipment-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  column-gap: 24px;
  width: 100%;
}

/* ======================
   左侧logo
   ====================== */

.shipment-airline {
  padding-left: 16px;
  margin-top: 45px;
  font-size: 18px;
  font-weight: 600px;
  color: #004F7C;
}

/* ======================
   主体区域
   ====================== */

.shipment-main {
  display: grid;
  grid-template-columns: 1fr 190px;
  column-gap: 24px;
  padding-top: 20px;
  /* ❗关键：防止被压缩 */
  min-width: 900px;
}

/* ======================
   中间三列 —— 强制稳定
   ====================== */

.middle-cols {
  display: grid;

  /* ❗固定三列最小宽度 */
  grid-template-columns: repeat(3, minmax(260px, 1fr));

  column-gap: 28px;
}

/* 每列纵向 */
.middle-cols .col {
  display: flex;
  flex-direction: column;
}

/* ======================
   KV 行 —— 永不折行版
   ====================== */

.kv-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  /* ❗禁止内部换行 */
  white-space: nowrap;
}

/* label 固定宽度 */
.kv-line .k {
  width: 120px;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  flex-shrink: 0;
}

/* value 自动截断 */
.kv-line .v {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ======================
   右侧操作区
   ====================== */

.shipment-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  padding-right: 20px;
}

.btns {
  display: flex;
  gap: 12px;
}

.expand {
  cursor: pointer;
}

/* =========================
   右侧操作区
   ========================= */

.shipment-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  padding-right: 24px;
}

.btns {
  display: flex;
  gap: 14px;
}

.expand {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.expand.open {
  transform: rotate(180deg);
}

.shipment-right .el-tag {
  margin-bottom: 4px;
}

/* 右侧对齐最右 */
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.actions {
  transform: translateX(-20px);
}
</style>
<style scoped lang="scss">
:deep(.expand) {
  background: transparent !important;
}

:deep(.expand svg) {
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;
  transform: rotate(-90deg); /* ▶ 默认朝右 */
  fill: none !important;
  background: transparent !important;
}

:deep(.expand.open svg) {
  transform: rotate(0deg); /* ▼ 展开朝下 */
}

:deep(.expand svg path) {
  fill: none !important;
  stroke: #004f7c;
}
</style>
