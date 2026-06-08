
         <template slot-scope="props">
          <div style="padding:15px 58px 15px 58px;">
            <el-tabs type="border-card" :ref="'tab' + id"
              v-model="activeTabName"
              @tab-click="handleClick($event)" >
              <el-tab-pane label="Order Items" :name="'first' + id">
                <BaseTable :data="dataSource.orderItemProductInfo" :key="id+'KEY'"
                            :columns="tableList" :showSummary=true
                             :summaryMethod="getSummaries" :rowKey="orderItemRowKey" />
                <br />
              </el-tab-pane>
             <el-tab-pane label="General Information" :name="'first1-1' + id">
                <el-descriptions v-for="(item, index) in dataSource.orderItemProductInfo || []" :key="'General Information' + index" direction="vertical" class="margin-top"
                  title="" style="box-shadow: none;width:1000px" :column="4" size="mini" border>
                  <el-descriptions-item label="ItemNo.">{{ item?.productCode }}</el-descriptions-item>
                  <el-descriptions-item label="Item Name">{{ item?.productName }}</el-descriptions-item>
                  <el-descriptions-item label="Merch code">{{ item?.merchCode }}</el-descriptions-item>
                  <el-descriptions-item label="Art Structure">{{ item?.artStructure }}</el-descriptions-item>
                  <!-- <el-descriptions-item label="OTB">{{ dataSource.otb=='1'?"Yes":dataSource.otb=='0'?"No":'-'}}</el-descriptions-item>
                  <el-descriptions-item label="NOS">{{ dataSource.nos=='1'?"Yes":dataSource.nos=='0'?"No":'-' }}</el-descriptions-item> -->
                 <el-descriptions-item label="PO Tag">
                    <template v-if="getPoTags(item, { dataSource }).length">
                      <el-tag v-for="tag in getPoTags(item, { dataSource })" :key="tag.code" :class="tag.className" :type="tag.type"
                        size="small" class="mr-4">
                        {{ tag.label }}
                      </el-tag>
                    </template>
                    <span v-else>-</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="Promo Code">{{ item?.promoCode || '-' }}</el-descriptions-item>
                </el-descriptions>
                <br />
              </el-tab-pane>
               <el-tab-pane label="Location" :name="'first3' + id">
                <el-descriptions direction="vertical" class="margin-top" title="" style="box-shadow: none;width:1250px"
                  :column="8" size="mini" border>
                  <el-descriptions-item label="Origin Country (PO)" style="white-space: nowrap;">{{dataSource.originCountry}}</el-descriptions-item>
                  <el-descriptions-item label="Origin Port (PO)">{{ dataSource.originPort }}</el-descriptions-item>
                  <el-descriptions-item label="Destination Port (PO)">{{ dataSource.destinationPort}}</el-descriptions-item>
                  <el-descriptions-item label="Requested Booking Date">{{ parseUTCTime(dataSource?.latestBookingDate)}}</el-descriptions-item>
                  <el-descriptions-item label="Handover Date">{{ parseUTCTime(dataSource?.cargoHandoverDate)}}</el-descriptions-item>
                  <el-descriptions-item label="AHOD">{{parseUTCTime(dataSource?.actualCargoHandoverDate)}}</el-descriptions-item>
                  <el-descriptions-item label="Incoterm">{{ getLabelName(dataSource.incoterm, 'SHIPPING_INCOTERM') }}</el-descriptions-item>
                  <el-descriptions-item label="Named Place">{{ getLabelName(dataSource.namedPlace, 'SHIPPING_NAMED_PLACE') }}</el-descriptions-item>
                  <el-descriptions-item label="Transport Mode">{{ getLabelName(dataSource.freightMethod, 'MODE_OF_TRANSPORT_PEPCO') }}</el-descriptions-item>
                  <el-descriptions-item label="Origin Location (Booked)"> {{dataSource.originLocationBooked}}</el-descriptions-item>
                  <el-descriptions-item label="Origin Port (Booked)">{{ dataSource.originPortBooked }}</el-descriptions-item>
                  <el-descriptions-item label="Destination Port (Booked)">{{ dataSource.destinationPortBooked }}</el-descriptions-item>
                  <el-descriptions-item label="Destination Location (Booked)">{{ dataSource.destinationLocationBooked }}</el-descriptions-item>
                  <el-descriptions-item label="Destination DC">{{ dataSource.dc }}</el-descriptions-item>
                </el-descriptions>
                <br />
              </el-tab-pane>
              <el-tab-pane label="Parties" :name="'first2' + id">
                  <BaseTable :data="[dataSource]"
                            :columns="partiesList"  />
              </el-tab-pane>
              <el-tab-pane v-if="checkPermi(['order:tab:show']) && (isSea||isSeaAir)" label="Carrier Booking"
                :name="'second' + dataSource.id">
                <el-empty v-if="dataSource.carrierInfoVO.length == 0"></el-empty>
                <el-descriptions title="" direction="vertical" :column="8" border
                  style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                  v-for="(row,index) in dataSource.carrierInfoVO || []"
                  :key="'item' + index">
                  <el-descriptions-item label="Shipment Ref">
                    {{ row?.bookingNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Booking Number">
                    {{ row?.shipmentBookingNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="BL Number">
                    {{ row?.blNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipped together with" >
                    <span>
                      {{ row?.shippedTogetherWithOrderNumbers?.join(', ') }}
                    </span>
                  </el-descriptions-item>
                  <el-descriptions-item label="Carrier">
                    {{ row?.carrier }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Vessel/Voyage">
                    {{ row?.vessel}}
                  </el-descriptions-item>

                  <el-descriptions-item label="Contract Number">
                    {{ row?.contractNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipped TEU">
                    {{row?.shippedTEU}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Week">
                    <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                      @click="toAllocation(row, 2)">
                      {{ row?.etdAllocation }}
                    </el-link>
                    <p v-else> {{ row?.etdAllocation }} </p>
                  </el-descriptions-item>

                  <el-descriptions-item label="Booked ETD">
                    {{ parseUTCTime(row?.bookedEtd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Booked ETA">
                    {{ parseUTCTime(row?.seaAirBookedEta) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATD">
                    {{ parseUTCTime(row?.atd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATA">
                    {{ parseUTCTime(row?.seaAirAta) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Containers">
                    <span>{{row?.containers?.join(', ')}}</span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Shipped Containers">
                      <span> {{ row?.shippedContainers?.join(', ') }} </span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Transport Status">
                    <el-tag type="primary" style="float: left;">
                        {{row?.transportStatus}}
                    </el-tag>
                  </el-descriptions-item>

                </el-descriptions>

              </el-tab-pane>
              <el-tab-pane v-if="checkPermi(['order:tab:show']) && isAir" label="Air Booking"
                :name="'airBooking' + dataSource.id">
                <el-empty v-if="!dataSource.airBookingInfo"></el-empty>
               <el-descriptions
               v-if="dataSource.airBookingInfo"
               title=""
               direction="vertical"
               :column="8"
               border
               style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);">
                  <el-descriptions-item label="MOOV Reference">
                    {{ dataSource.airBookingInfo?.moovRef }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Booking Reference">
                    {{ dataSource.airBookingInfo?.bookingRef }}
                  </el-descriptions-item>
                  <el-descriptions-item label="MAWB Number">
                    {{ dataSource.airBookingInfo?.awbNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Air Line">
                    {{ getFullAirLineName(dataSource.airBookingInfo?.airline) }}
                  </el-descriptions-item>
                 <el-descriptions-item label="Forwarder">
                   {{ dataSource.airBookingInfo?.bookingAgent }}
                 </el-descriptions-item>
                  <el-descriptions-item label="Booked ETD">
                    {{ parseUTCTime(dataSource.airBookingInfo?.bookedEtd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Booked ETA">
                    {{ parseUTCTime(dataSource.airBookingInfo?.bookedEta) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATD">
                    {{ parseUTCTime(dataSource.airBookingInfo?.atd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATA">
                    {{ parseUTCTime(dataSource.airBookingInfo?.ata) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Order Together With" >
                    <span>
                      {{ dataSource.airBookingInfo?.bookingTogetherWithOrderNumbers?.join(', ') }}
                    </span>
                  </el-descriptions-item>
                </el-descriptions>

              </el-tab-pane>
              <el-tab-pane v-if="!hiddenTask && (isSea||isSeaAir)" label="Milestones" :name="'third' + id">
                <div>
                  <div style="padding-top: 20px;min-width: 640px;max-width: 1000px;  margin: 0 auto;text-align: center;box-shadow: none;">
                    <div v-for="(task, idx) in dataSource.milestones || []" :key="'milestone-' + id + '-' + idx" class="self-step3"
                      style="margin-right: 20px;position: relative;float: left;height: 80px; " :class="[task.status == 1 ? 'self-step-process1' : ''
                        , task.status == 2 ? 'self-step-finished1' : ''
                        , task.status == 0 ? 'self-step-pedding1' : '']">
                      <p>
                        <span class="self-step2" :class="[task.status == 1 ? 'self-step-process' : ''
                          , task.status == 2 ? 'self-step-finished' : ''
                          , task.status == 0 ? 'self-step-pedding' : '']"></span>
                      <p style="
                      display: inline-block;
                                    width: 130px;
                                    padding-top: 8px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;">
                        <el-popover placement="top-start" trigger="hover">
                          <p>
                            {{ task.taskName === 'Container Loading Plan' ? 'Container Loading Result' : task.taskName
                            }}
                          </p>
                          <span slot="reference" class="title" style="font-size: 12px; "> {{task.taskName ===
                            'Container Loading Plan' ? 'Container Loading Result' : task.taskName }}
                          </span>
                        </el-popover>
                      </p>
                      <p>
                        {{ task.status == 2 ? formatUserLocalTime(task.finishedTime != null ? task.finishedTime : task.updateTime, task.timeZone, task.timeZoneOffset) : ''
                        }}
                      </p>
                      </p>
                    </div>
                    <div style="clear:both"></div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if = "!hiddenTask && isAir" label="Air Milestones" :name="'airMilestones' + id">
                <div>
                  <div
                    style="padding-top: 20px;min-width: 640px;max-width: 1000px;  margin: 0 auto;text-align: center;box-shadow: none;">
                    <div v-for="(task, idx) in dataSource.airMilestones || []" :key="'milestone-' + id + '-' + idx"
                      class="self-step3" style="margin-right: 20px;position: relative;float: left;height: 80px; "
                      :class="[task.status == 1 ? 'self-step-process1' : ''
                        , task.status == 2 ? 'self-step-finished1' : ''
                        , task.status == 0 ? 'self-step-pedding1' : '']">
                      <p>
                        <span class="self-step2" :class="[task.status == 1 ? 'self-step-process' : ''
                          , task.status == 2 ? 'self-step-finished' : ''
                          , task.status == 0 ? 'self-step-pedding' : '']"></span>
                      <p style="
                      display: inline-block;
                                    width: 130px;
                                    padding-top: 8px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;">
                        <el-popover placement="top-start" trigger="hover">
                          <p>
                            {{ task.taskName }}
                          </p>
                          <span slot="reference" class="title" style="font-size: 12px; "> {{ task.taskName }}
                          </span>
                        </el-popover>
                      </p>
                      <p>
                        {{ task.status == 2 ? parseTime(task.finishedTime != null ? task.finishedTime : task.updateTime)
                          : ''
                        }}
                      </p>
                      </p>
                    </div>
                    <div style="clear:both"></div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Documents" :name="'fourth' + id">
                <view-po-management-documents ref="viewPoManagementDocuments"></view-po-management-documents>
              </el-tab-pane>
              <el-tab-pane v-if="checkPermi(['order:tab:show']) && isSea" label="Transport Plan History"
                :name="'second3' + id" style="width: 95%">
                <el-empty v-if="dataSource.bookingPreAssignInfo.length == 0"></el-empty>
                  <BaseTable v-else :data="dataSource.bookingPreAssignInfo"
                  :columns="this.transportPlanHistotyList" />
              </el-tab-pane>
              <el-tab-pane v-if="checkPermi(['order:tab:show']) && isAir" label="Transport Plan History"
                :name="'second3' + id" style="width: 95%">
                <el-empty v-if="dataSource.airBookingPreAssignInfo.length == 0"></el-empty>
                  <BaseTable v-else :data="dataSource.airBookingPreAssignInfo"
                  :columns="this.airTransportPlanHistotyList" />
              </el-tab-pane>
              <el-tab-pane v-if="checkPermi(['order:tab:show']) && isSeaAir" label="Transport Plan History" :name="'second3' + id"
                style="width: 95%">

              <!-- sea-air -->
              <SeaAirTransportPreAssign :ref="'seaAirPreAssign' + dataSource.shippingId"
                :shippingOrderId="dataSource.shippingId?dataSource.shippingId:0" source="detail"/>

              </el-tab-pane>
              <el-tab-pane label="Change Log" :name="'second4' + id">
                <el-empty v-if="dataSource.changeLog.length == 0"></el-empty>
                <div style="max-height: 150px; overflow-y: auto;">
                  <el-timeline>
                    <el-timeline-item v-for="(o, index) in dataSource.changeLog || []" :key="index"
                      :timestamp=formatUserLocalTime(o?.createTime,o?.timeZone,o?.timeZoneOffset)>
                        {{ o?.logInfo ? o.logInfo.replace(/by PEPCO4PLAdmin@moovlogistics.com|by SFTP/g, 'by PEPCO ASN') : '' }}
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <br />
              </el-tab-pane>
              <el-tab-pane label="Comments" :name="'Comments' + id">
                <order-comment :order-id="id" :order-number="orderNumber"></order-comment>
              </el-tab-pane>
               <el-tab-pane label="Cargo Ready Date" :name="'cargoReadyDate' + id">
                  <cargo-ready-date-tab :orderId="id" />
              </el-tab-pane>
              <el-tab-pane label="Actual Handover Date" :name="'aHod' + id">
                  <cargo-inbound-tab :orderId="id" :shippingId="shippingId" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
<script>
import BaseTable from '../UIcomponts/baseTable.vue'
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import moment from "moment";
import {parseUTCTime} from "@/utils/ruoyi";
import orderComment from "@/views/purchaseOrder/pepco/components/order-comment.vue";
import viewPoManagementDocuments from "@/views/purchaseOrder/pepco/components/view-po-management-documents.vue";
import CargoReadyDateTab from "@/views/purchaseOrder/pepco/components/cargo-ready-date-tab.vue";
import CargoInboundTab from "@/views/purchaseOrder/pepco/components/cargo-Inbound-tab.vue";
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'
import {mapState} from "vuex";
import SeaAirTransportPreAssign from '@/views/pepcoShipping/orderList/components/SeaAirTransportPreAssign.vue'


export default {
  name: 'PoExpandContent',
  components: { BaseTable, orderComment, viewPoManagementDocuments, CargoReadyDateTab, CargoInboundTab , SeaAirTransportPreAssign },
  props: {
    dataSource: {
      type: Object,
      required: true
    },
    id: Number,
    orderNumber: String,
    hiddenTask: {
      type: Boolean
    },
    shippingId: Number
  },
  data() {
    return {
      activeTabName: '',
      carrierBookingPreAssignStatusEnum: {
        'history': 'Revoked',
        'transport assigned': 'Booked',
        'cancel': 'Canceled',
        'REMOVE': 'REMOVE'
      },
      otherPreAssignStatusEnum: {
        'history': 'Pre-assigned',
        'open': 'Pre-assigned',
        'transport assigned': 'Booked',
        'REMOVE': 'REMOVE'
      },
      airPreAssignStatusEnum:{
        0: 'Pre-assigned',
        1: 'Booked',
        2: 'Revoked'
      },
      tableList: [
        {label: "Item Number", prop: "productCode", minWidth: "150"},
        { label: "TCId", prop: "tcId", minWidth: "140" },
        { label: "Ordered Outer/(Cartons)", prop: "outerQty", minWidth: "140", renderHeader: this.renderHeader },
        { label: "Ordered Inner/(Cartons)", prop: "tcQty", minWidth: "140", renderHeader: this.renderHeader },
        { label: "Ordered Pieces", prop: "requested", minWidth: "140"},
        { label: "Ordered Volume/(cbm)", prop: "cbm", minWidth: "120", renderHeader: this.renderHeader },
        {
          label: "Booked Outer/(Cartons)", prop: "booked", minWidth: "120", renderHeader: this.renderHeader,
          formatter: (row) => {
            return row.booked != 0 ? row.booked : ''
          }
        },
        {label: "Booked Inner/(Cartons)", prop: "bookedInner", minWidth: "130", renderHeader: this.renderHeader, formatter: (row) => {
          return  <span>{  row.booked != 0 ?  row.bookedProInnerPerOuter == 0 ? '-' : row.bookedInner :''}</span>
        }},
        {
          label: "Booked Pieces", prop: "bookedPieces", minWidth: "120", renderHeader: this.renderHeader,
          formatter: (row) => {
            return row.booked != 0 ? row.bookedPieces : ''
          }
        },
        {
          label: "Outer Size L*W*H/(CM)", prop: "outerSizeVolume", minWidth: "120", renderHeader: this.renderHeader },
        {
          label: "Booked Volume/(cbm)", prop: "bookedVolume", minWidth: "120", renderHeader: this.renderHeader,
          formatter: (row) => {
            return row.booked != 0 ? row.bookedVolume.toFixed(1) : ''
          }
        },
        {
          label: "Gross Weight/(kg)", prop: "grossWeight", minWidth: "120", renderHeader: this.renderHeader,
          formatter: (row) => {
            return row.booked != 0 ? row.grossWeight.toFixed(1) : ''
          }
        },
      ],
      partiesList: [
        {label: "Origin Handling Agent (OHA)", prop: "originHandlingAgentName", width: 150},
        { label: "Supplier Name", prop: "supplierName", width: 150},
        {label: "Supplier ID", prop: "supplierCode", width: 150},
        {label: "Supplier Type", prop: "supplierType", width: 150},
      ],
      transportPlanHistotyList: [
        {
          label: 'Create Time', prop: 'time', width: 150, formatter: (row) => {
            return  this.formatUserLocalTime(row.createTime, row.timeZone, row.timeZoneOffset)
          }
        },
        {
          label: 'Event', prop: 'event', width: 100, formatter: (row) => {
            return !row.type ? (row.status == 'transportassigned' ? 'Carrier Booking' : 'Pre - assign') : row.type
          }
        },
        {
          label: 'Status', prop: 'status', width: 80, formatter: (row) => {
            return row.type === 'Carrier Booking' ? this.carrierBookingPreAssignStatusEnum[row.status] : this.otherPreAssignStatusEnum[row.status]
          }
        },
        { label: 'Carrier', prop: 'carrier', width: 80 },
        { label: 'POR', prop: 'por', width: 55 },
        { label: 'POL', prop: 'pol', width: 55 },
        { label: 'POD', prop: 'pod', width: 55 },
        { label: 'FND', prop: 'fnd', width: 55 },
        { label: 'Vessel', prop: 'vessel', minWidth: 100 },
        { label: 'Voyage', prop: 'voyage', width: 55 },
        { 
          label: 'ETD/ETA', prop: 'eta', minWidth: 150, formatter: (row) => {
            return (this.parseUTCTime(row.etd) || '-') + ' / ' + (this.parseUTCTime(row.eta) || ' - ')
          }
        },
        {
          label: 'Booked ETD/ETA', prop: 'etd', minWidth: 150, formatter: (row) => {
            return (this.parseUTCTime(row.bookedEtd) || '-') + ' / ' + (this.parseUTCTime(row.bookedEta) || ' - ')
          }
        },
        { label: 'Shipping Numbe', prop: 'pbNumber', width: 150 }
      ],
      airTransportPlanHistotyList: [
        {
          label: 'Create Time', prop: 'time', width: 150, formatter: (row) => {
            return  this.parseTimeToZ1(row.createTime)
          }
        },
        {
          label: 'Event', prop: 'event', width: 100, formatter: (row) => {
          const isAirTransport = row.transportMode && row.transportMode.toLowerCase() === 'air'

            if (isAirTransport) {
              return row.source === 'transport-assign' ? 'Pre - assign' : 'Carrier Booking'
            }

            return !row.type ? (row.status === 'transportassigned' ? 'Carrier Booking' : 'Pre - assign') : row.type
          }
        },
        {
          label: 'Status', prop: 'status', width: 80, formatter: (row) => {
            return this.airPreAssignStatusEnum[row.status]
          }
        },
        { label: 'Carrier', prop: 'carrier', width: 55 },
        { label: 'POL', prop: 'pol', width: 55 },
        { label: 'POD', prop: 'pod', width: 55 },
        { label: 'Flight', prop: 'flight', width: 55 },
        {
          label: 'ETD/ETA', prop: 'eta', width: 150, formatter: (row) => {
            return (this.parseUTCTime(row.etd) || '-') + ' / ' + (this.parseUTCTime(row.eta) || ' - ')
          }
        },
        {
          label: 'Booked ETD/ETA', prop: 'etd', width: 250, formatter: (row) => {
            return (this.parseUTCTime2(row.bookedEtd, '{y}-{m}-{d} {h}:{i}:{s}') || '-') + ' / ' + (this.parseUTCTime2(row.bookedEta, '{y}-{m}-{d} {h}:{i}:{s}') || ' - ')
          }
        }
      ]
    }
  },
  computed: {
    // 获取 freigtMethod 并统一处理
    freightMethodNormalized() {
      return this.dataSource?.freightMethod?.toLowerCase()?.trim() || '';
    },
    isSea() {
      return this.freightMethodNormalized === 'sea' || this.freightMethodNormalized === '';
    },
    isAir() {
      return this.freightMethodNormalized === 'air';
    },
    isSeaAir() {
      console.log('this.freightMethodNormalized', this.freightMethodNormalized)
      return this.freightMethodNormalized === 'sea_air';
    },
    ...mapState('bdData', {
      airlineList: state => state.airlineList
    })
  },
  methods: {
    checkPermi,
    orderItemRowKey(row){
      // 组合多个字段生成稳定唯一 key，避免纯数字重复（如 '632425'）
      return [this.id, row.productCode, row.tcId, row.id].filter(Boolean).join('-')
    },
    change(value) {
      this.$emit('handleFormSelect', {
        type: this.type,
        value
      })
    },
    getPoTags(row, context = {}) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
          row.nos = false
      }
      return PO_TAG_RULES
        .filter(rule => rule.match ? rule.match(row, context) : true)
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
    },
    renderHeader(h, { column }) {
      return <span>
        <span>{column.label.split('/')?.[0]}</span>
        <br />
        <span>{column.label.split('/')?.[1]}</span>
      </span>
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      if (!columns) {
        return sums;
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total';//可更改合计行的名称
          return;
        }
        if (column.property === 'productCode' || column.property === 'tcId' || column.property === 'outerSize') {
          sums[index] = ' ';
          return;
        }

        if (data == null || data.length === 0) {
          sums[index] = ' ';
        } else {
          let total = 0;
          data.forEach(row => {
            // 确保值是数字类型
            let value = Number(row[column.property]);
            if (isNaN(value)) {
              value = 0;
            }

            // 特殊字段计算
            if (column.property === 'outerWeight') {
              total += value * (row.booked || 0);
            } else if (column.property === 'orderedPieces') {
              total += (row.outerQty || 0) * (row.outerSize || 0);
            } else if (column.property === 'bookedVolume') {
              total += (row.length || 0) * (row.width || 0) * (row.height || 0) * (row.booked || 0) / 1000000;
            } else {
              total += value;
            }
          });

          // 格式化特定字段
          if (column.property === 'bookedVolume') {
            total = total === 0 ? ' ' : total.toFixed(1);
          } else if (column.property === 'outerWeight') {
            total = total === 0 ? ' ' : total.toFixed(1);
          } else {
            total = total === 0 ? ' ' : total;
          }

          sums[index] = total;
        }
      });
      return sums;
    },
    getLabelName(v, type) {
      const dict = this.getDictDatas(DICT_TYPE[type]).find(
        item => item.value === v || item.label === v
      );
      return dict ? dict.label : '';
    },

    toAllocation(order, flag) {
      var week, lotNo
      // if (order.shipmentResList.length > 0) {
      //   if (flag == 2) {
      //     week = order.etdAllocation
      //   }
      //   // carrier = order.carrier
      // }
      if (flag == 2) {
          week = order.etdAllocation
        }
      if (flag == 1) { lotNo = order.orderNumber }

      window.open('/bi/allocation?lotNo=' + lotNo + '&type=' + order.carrier + '&week=' + week)
    },

    handleClick(tab) {
      console.log('Tab clicked:', tab.name)
      // 可以在这里添加 tab 切换后的逻辑
    },
       parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getFullAirLineName(iata) {
      const airline = this.airlineList.find(item => item.iata === iata)
      return airline ? `${airline.airlineName} (${airline.iata})` : iata
    },

  },
  mounted() {
    // 设置默认激活第一个 tab
    this.activeTabName = 'first' + this.id

    this.$refs.viewPoManagementDocuments.getOrderFile(this.id)
  },
  async created() {
    if (!this.airlineList || this.airlineList.length === 0) {
      await this.$store.dispatch('bdData/fetchAirlineList')
    }
    console.log("=============="+this.airlineList)
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0px;
}

.po-expand-content {
  padding: 20px;
}

.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
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

.self-step3:not(:first-child):before {
  width: 150px;
  height: 6px;
  position: absolute;
  left: -80px;
  content: "";
  background: #004F7C !important;
  top: 7px;
  text-align: left;
}
/* 关键修改：自动换行后的每行第一个不显示横线 */

.self-step3:nth-child(6n+1):before {
  display: none !important;
}

.self-step3:first-child:after  {
  display: none !important;
}

.self-step-process1:not(:first-child):before {
  background: #63acd5 !important;
}

.self-step-finished1:not(:first-child):before {
  background: #004F7C !important;
}

.self-step-pedding1:not(:first-child):before {
  background: #ddd !important;
}

.self-step-error1:not(:first-child):before {
  background: #F56C6C !important;
}

::v-deep .el-tabs {
  max-width: 1600px !important;
  height: 400px !important;
  overflow: auto !important;
}
</style>
