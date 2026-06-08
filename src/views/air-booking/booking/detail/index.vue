<template>
  <div class="app-container" style="width:100%; margin: 0 auto;">
    <div style="float:left;max-width:60%">
      <template v-for="spo in spoList">
        <div style="float: left; margin-right: 15px;" :key="spo.id">
          <el-tag size="small"  style="font-size: 14px; ">
            <el-link type="primary" target="_blank"
                     :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}
            </el-link>
          </el-tag>
          <el-tag size="small" type="danger"  style="margin-left:2px; font-size: 14px; " >DC: {{ spo.dc }}</el-tag>
        </div>
      </template>
    </div>
    <div style="float:right;">
      <div style="display: inline; margin: 0 10px">
        <el-button  v-if="shipment.status !==9"  @click="handleUpdateShipment(shipment)" type="primary">
          Update
        </el-button>
      </div>
      <el-button  @click="cancelBooking"  v-if="shipment.status !== 9" type="danger">
        Cancel
      </el-button>


    </div>
    <div style="clear:both"></div>
    <div style="height: 20px;"></div>
    <el-descriptions
      style="padding: 25px 20px 15px !important;background: #fff; border: 1px solid #ddd;"
      :colon="false"
      class="el-des-margin-top"
      :column="6"
      size="small"
    >
      <el-descriptions-item label="">
        <span style="font-size:18px;font-weight: 600;">{{ shipment.moovRef }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="Booking Number">
      <el-popover
        placement="bottom-start"
        width="300"
        popper-class="status-popover-css"
        trigger="hover">
        <el-table :data="bookingNumberlogList">
          <el-table-column prop="msg" min-width="110" label="Booking Number">
          </el-table-column>
          <el-table-column
            prop="endDate" max-width="120"
            label="Date">
            <template v-slot="scope">
              {{ parseUTCTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" max-width="80"
            label="User">
          </el-table-column>
        </el-table>
        <template #reference>
          <span>{{ shipment.bookingRef }}</span>
        </template>
      </el-popover>
    </el-descriptions-item>

    <el-descriptions-item label="BL Number">
      <el-popover
        placement="bottom-start"
        width="300"
        popper-class="status-popover-css"
        trigger="hover">
        <el-table :data="blNumberlogList">
          <el-table-column prop="msg" max-width="120" label="BL Number">
          </el-table-column>
          <el-table-column
            prop="endDate" max-width="120"
            label="Date">
            <template v-slot="scope">
              {{ parseUTCTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" max-width="80"
            label="User">
          </el-table-column>
        </el-table>
        <template #reference>
          <span v-if="shipment.atd != null" > {{ shipment.blNumber }}</span>
        </template>
      </el-popover>
    </el-descriptions-item>

       <el-descriptions-item label="Payment Term">
        {{ shipment.paymentTerm }}
      </el-descriptions-item>
      <el-descriptions-item label="Order Numbers">
        {{shipment.poNumbers}}
      </el-descriptions-item>
      <el-descriptions-item label="">
        <el-tag :type=" shipment.status==9?'danger':'' ">
            <el-popover
               v-if="shipment.status==9"
              placement="bottom-start"
              width="600"
              popper-class="status-popover-css"
              trigger="hover">
              <el-table :data="cancelRemarklogList">
                <el-table-column prop="msg" max-width="550" label="Cancel Remark">
                </el-table-column>
                <el-table-column
                  prop="endDate" width="100"
                  label="Date">
                  <template v-slot="scope">
                    {{ parseUTCTime(scope.row.createTime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickname" width="100"
                  label="User">
                </el-table-column>
              </el-table>
              <template #reference>
                <span> {{shipment.statusValue}}</span>
              </template>
            </el-popover>
            <span v-else class="title">
              {{shipment.statusValue}}
          </span>
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="">

      </el-descriptions-item>

    </el-descriptions>

    <br/>

    <el-tabs v-model="activeName">
      <el-tab-pane label="Booking Info" name="first">
          <BookingInfoTab
             :origin-event="originEvent"
             :destination-event="destinationEvent"
             :router-list="routerList"
             :shipment = "shipment"
             :event-data="eventData"
              @refreshPage="successUpdateEventTime"
           />

      </el-tab-pane>

      <el-tab-pane label="Cargo Info" name="first1">
          <CargooGoodsInfoTab
            :spo-list="spoList"
            :booking-product-data="bookingProductData"
            :shipment="shipment"
            @refreshPage="successUpdateEventTime"
          />
        <br/>
      </el-tab-pane>

      <el-tab-pane label="Documents" name="fileList">
          <DocumentTab
          v-if="shipment && shipment.id"
            :shipment="shipment"
            @refreshPage="successUpdateEventTime"
          />
      </el-tab-pane>

     <el-tab-pane label="Change Log" name="six">
        <ChangeLogTab
          :shipment="shipment"
          :ship-log-list="bookingChangeLog"
          @refreshPage="successUpdateEventTime"
        />
      </el-tab-pane>

      <el-tab-pane label="Comments" name="comments">
          <CommentsTab
                v-if="shipment && shipment.id"
            :shipment="shipment"
            :ship-log-list="bookingCommentList"
            @refreshPage="successUpdateEventTime"
          />
      </el-tab-pane>

    </el-tabs>

    <cancel-booking-dialog
      :shipment="shipment"
      ref="cancelBookingDialog"
      @refreshPage="successUpdateEventTime"
      />


  </div>
</template>


<script>
import{detail,updateEventTime} from '@/api/air/booking'

import { getDeptList, listDept } from "@/api/system/dept";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getPolPodList } from "@/api/system/polPod";
import { getUserProfile } from "@/api/system/user";
import auth from "@/plugins/auth";
import { getBaseHeader } from "@/utils/request";
import SOMainTable from '@/views/salesOrder/components/table.vue';
import { i18nChangeLanguage } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { v4 as uuidv4 } from 'uuid';
import vueshowpdf from 'vueshowpdf';

import { fileLoadMixin } from '@/utils/fileLoadMixin';
import ModifyDialog from "@/views/shipment/detail/components/modifyDialog.vue";
import BookingInfoTab from "./tabs/booking-info-tab.vue";
import CargooGoodsInfoTab from "./tabs/cargoo-goods-info-tab.vue";
import DocumentTab from "./tabs/document-tab.vue";
import ChangeLogTab from "./tabs/change-log-tab.vue";
import CommentsTab from "./tabs/comments-tab.vue";
import cancelBookingDialog from "./components/cancel-booking-dialog.vue";

  export default {
    name: "Shipment",
    mixins: [fileLoadMixin],
    components: {ModifyDialog, vueshowpdf, Editor, Toolbar,SOMainTable,BookingInfoTab,CargooGoodsInfoTab,DocumentTab,ChangeLogTab,CommentsTab,cancelBookingDialog },
    data() {
      return {
        activeTab: 'first', // 确保默认激活的是 "first"
        editor: null,
        carrierBillList: [],
        houseBillList: [],
        othersList: [],
        cargooResData: [],
        portCall: {},
        visablePortCall: false,
        fileListLoading: false,
        expanded: {},
        bookingChangeLog: [],
        // visableShipLog: false,
        loadingSelect: false,
        blflag: false,
        sampleUrl: '',
        isshowpdf: false,

        currentStepIndex: 0,
        shipmentMilestones: [],
        centerDialogVisible: false,
        exportLoading:false,
        shipment: {
          bookingProductDOS: [],
          containerDOList: [],
          soHeaderVOs:[],
          routerDOList: [{}],
          status: "0",
          moovRef: '',
          bookingRef: '',
          productData:[],
          airRouters:[],
          spoIds:[]

        },
        parties: {
          "Shipper": [],
          "Consignee": [],
          "Notify Party": [],
        },
        containerMovement: {},
        visableDestinationRouter: false,
        destinationRouter: {},
        destinationRouterList: [],
        containerMovementList: [],
        containerNoList: [],
        hsCodeList: [],
        activeName: "first",
        portOptions: [],
        bookings: [],
        productMapForBook: {},
        orderMap: {},
        orderItemMap: {},
        productMapForBook: {},
        itemTableData: [],
        partiesMap: {},
        visableSI: false,
        siForm: { containers: [], shipper: {}, consignee: {}, notifyParty: {} },
        visableVGM: false,
        originDeliveryMap: {},
        polPodMap: {},
        containerTypeList: [],
        siList: [],
        shippedContainer: {},
        visableSIContainer: false,
        containerForm: {},
        active: 0,
        selCancelReason: [],
        selCancelCategory: [],
        selectCancelReason: [],
        cancelReasonFlag: false,
        centerDialogFrom: false,
        dialogFormEvents: false,
        dialogFormAccept: false,
        dialogBLType: false,
        acceptRequired: false,
        isBooking: false,
        shipmentScheduleMap: {},
        form: {
          bookingRef: "",
          dateValue: "",
        },
        formLabelWidth: "180px",
        statusKeys: "",
        pickerOptions: {
          disabledDate: (time) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 设置为今天的凌晨
            return time.getTime() > today.getTime();
          },
        },
        places: [
        ],
        hsCode: {},
        applyHsCodeVisable: false,
        statusForm: {},
        visableStatus: false,
        acceptRequired: false,

        vesselMap: {},

        hsCodeData: [],
        checkHsCodeDialog: false,
        addRemovePOVisible: false,
        pbTable: [],
        selectedTable: [],
        vesselListLes: [],
        selectIds: [],
        shipmentNoteList: [],
        noteView: false,
        tempJsonVisible: false,
        isIndeterminate: false,
        checkAll: false,
        editableTabs: [],
        tempData: null,
        tempJsonBut: false,
        apiVisible: false,
        apiErrorList: [],
        apiLod: false,
        vmtRevoke: false,
        vmtRevokeSwitch: false,
        showFileDelButton: null,
        tempPlaces: [],
        tempPlacesShow: [],
        tempVessel: [],
        cancelType: 0,
        user: {},
        showSendEmail: false,
        currentRow: null,
        itemOptions: [],

        clpData:[],
        addRemoveSoLoading:false,
        soTableData:[],
        addRemoveSOVisible:false,
        soQueryParams:{
          booked:false
        },


        routerList:[],
        tempPlaces2:[],
        drawer:false,

        containersDialog:false,
        tipContainers: [],

        addRemoveContainerVisible:false,
        containerPage: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
        },
        selectedContainer: [],
        noSelectedContainer: [],
        addContainers: [],

        followerDialogVisible:false,
        selectedFollower:[],
        noSelectedFollower:[],
        showDelete: {},
        followerPage: {},
        agentData: [],
        agentMap: [],

      agentDialogVisible:false,
      agentDetail:{
        currency:"EUR",
      },
      currency:[
        "USD","EUR","RMB","HKD",
      ],
      addRemoveSPOVisible:false,
      spoTable: [],
      selectedSpoTable: [],
      selectSpoIds: [],
      spoList:[],

      SOList:[],
      SOProductList: [],
      SOType: '',
      draftDateList: [],
      submitDateList: [],
      bookingReceiptDateList: [],
      bookingConfirmationDateList: [],
      siDateList: [],
      atdDateList: [],
      ataDateList: [],
      customClearanceDateList: [],
      deliveryDateList: [],
      emptyReturnDateList: [],

      timeLogList: [],
      spoItems:[],
      showAddShipperBooking: false,
      canReArrangeSO: false,
      orderList:[],
      orderInfo:{},
      movements: [],
      showVesselChangeCard: false, // 换船信息弹窗控制
      changeVesselGroups: null, // 换船信息数据
      changeVesselLoading: false, // 查询加载状态
      selectedSoNumbers: [], // tmff存储已选中的soNumber，确保唯一
      airBooking:{},
      airbookingEvent:[],
      originEvent:[],
      destinationEvent:[],
      routerReceives:[],
      eventData:[],
      showAddEventDialog:false,
        bookingProductData: [],
      bookingCommentList: [],
      spoIds:[]

    };
  },

    mounted() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
      this.getPortList();
      this.init();
      this.getParty();
    },

  computed: {

     bookingNumberlogList() {
      return this.airbookingEvent.filter(log => log.eventCode === 'BOOKING_CONFIRMATION');
    },
    blNumberlogList() {
      return this.airbookingEvent.filter(log => log.eventCode === 'BL_NUMBER');
    },

    uploadAction() {
      if (this.showSendEmail) {
        return process.env.VUE_APP_BASE_API + "/admin-api/shipment/api/uploadShipmentFile"
      } else {
        return process.env.VUE_APP_BASE_API + "/admin-api/shipment/api/updateDocumentFile2";
      }
    },

    },
    created() {
      if(this.$auth.hasRole("super_admin")){
        this.onlyPreview =false
      }else{
        this.onlyPreview = this.$auth.hasPermi("shipment-detail:onlyPreview")
      }
      localStorage.removeItem('refreshPoPage')
    },

  methods: {
    isLong(transportMeanName, voyage) {
      return (transportMeanName.length + voyage.length) > 21;
    },

      // status: 0-draft，1-submitted,2-confirmed,9-canceled
      showStatus(data) {
         if(data.status==0){
          return 'Draft'
        }
         if(data.status==1){
          return 'Submit Booking'
        }
        if(data.status==2){
          return 'Booking Confirmation'
        }
        if(data.status==3){
          return 'Departure Pol'
        }
        if (data.status == 9) {
          return 'Cancel'
        }
        return 'Created'
      },

      parseTimeToZ(timestamp) {
        if (!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `"${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z"`;
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

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      },

      disabledDate(date) {
        // 在这个示例中，我们将禁用周六和周日的日期
        const day = date.getDay();
        return day === 0 || day === 6;
      },
      edit(key) {

      },
      eventsForm(key) {
        var obj = this.shipmentMilestones.find((element) => element.key == key)
        if (obj && obj.endDate) {
          this.$set(this.form, 'dateValue', this.parseUTCTime(obj.endDate) + " 00:00:00")
        }
        this.statusKeys = key;
        this.dialogFormEvents = true;
      },

    // 先确认框确认后更新按钮的方法
    handleUpdateShipment(booking) {
       this.$router.push('/shipment/update-air-booking?bookingId=' + booking.id)
    },

    // 过滤下拉选项：只显示未被选中的，或当前行自己已选中的
    getFilteredOptions(currentRow) {
      // 若源数据不存在，返回空数组
      if (!this.shipment?.shippingOrderProductResList) return [];
      return this.shipment.shippingOrderProductResList.filter(opt => {
        // 排除已选中且非当前行的值
        return !this.selectedSoNumbers.includes(opt.soNumber)
          || opt.soNumber === currentRow.soNumber;
      });
    },

      getParty() {
          this.getParties({ partyRole: "Shipper"});
          this.getParties({ partyRole: "Consignee"});
          this.getParties({ partyRole: "Notify Party"});
          this.getParties({ partyRole: "Agreement Party"});
          this.getParties({ partyRole: "Customer"});
          listDept({ partyRole: "Destination Agent"}).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              this.$set(this.agentMap, response.data[i].id, response.data[i]);
            }
            this.agentData = response.data
          });
      },
      getParties(obj) {
        var vm = this;
        listDept(obj).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.$set(vm.partiesMap, response.data[i].id, response.data[i]);
          }
          vm.$set(vm.parties, obj.partyRole, response.data == null ? [] : response.data);
        });
      },



      addProduct2(data) {
        data.push({});
      },
      handleDelete(data, index) {
        data.splice(index, 1);
      },

      remoteGetHsCode(query) {
        if (query !== "" && query.length >= 5) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.getHsCodeListByCode(query);
            this.options = this.hsCodeList.filter((item) => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },

      addProduct() {
        this.visableSIContainer = true;
        this.containerForm = {};
        //this.siForm.productData.push({ batteries: false });
      },

      getDeptList(ids) {
        getDeptList({ ids: ids.join(",") }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.partiesMap, response.data[i].id, response.data[i]);
          }
        });
      },
    init() {
      detail({ airBookingId: this.$route.query.bookingId }).then((res) => {
        console.log('detail res', res.data.airBookingRouterAggregates)
        this.$set(this, 'shipment', res.data.airBookingDTO)
        //          productData:[],  airRouters:[],   spoIds:[]
         
        
        this.shipment.productData = res.data.productData
        this.shipment.airRouters = res.data.airRouters
        this.bookingProductData = res.data.productData
        console.log('this.shipment', this.shipment)
        this.bookingChangeLog = res.data.airBookingChangeLogDTOS
        this.bookingCommentList = res.data.airBookingCommentDTOS
        this.$set(this, 'spoList', res.data.shippingResList)
        if (this.spoList != null && this.spoList.length > 0) {
          var spoListTemp = res.data.shippingResList
            //  this.$set(this,'airbookingEvent',res.data.airBookingEventDTOS)
          if (spoListTemp && spoListTemp.length > 0) {
            this.form.shipmentType = spoListTemp[0].shipmentType
          }
          var poIds = this.spoList.map(item => item.id);

          this.spoIds = poIds
          this.shipment.spoIds = poIds
          // 处理cargoInfo
          this.handleCargoInfo(spoListTemp, poIds)
          this.spoItems = []
          spoListTemp.forEach(so => {
            var products = so.productDOList
            var product = { id: so.id, soRef: so.soRef }

            if (products && products[0]) {
              product.hscode = products[0].hscode
              product.markNumbers = products[0].markNumbers
              product.productName = products[0].productEnglishName
              product.booked = products[0].numberOfPackages
              product.bookedWeight = products[0].grossWeight
              product.bookedVolume = products[0].volume

            }
            this.spoItems.push(product)
          })
        }
            // 获取originEvent 数据
        const originEventList = res.data.originEventDTOS.sort((a, b) => a.taskSeq - b.taskSeq);
        this.$set(this, 'originEvent', originEventList);
        console.log('originEvent', originEventList)
        const destinationEventList = res.data.destinationEventDTOS.sort((a, b) => a.taskSeq - b.taskSeq);
        this.$set(this, 'destinationEvent', destinationEventList);
        this.$set(this, 'routerList', res.data.airBookingRouterAggregates);
        console.log('routerList', this.routerList)
        // 处理booking product 和booking item信息
        console.log('result routerList', this.routerList)
        var orderMap = {}
        if (res.data.orderHeaderResList != null && res.data.orderHeaderResList != undefined) {
          for (var i = 0; i < res.data.orderHeaderResList.length; i++) {
            orderMap[res.data.orderHeaderResList[i].orderId] = res.data.orderHeaderResList[i].orderNumber
          }
        }
        this.orderMap = orderMap
        this.form.bookingRef = this.shipment.bookingRef;
        var ids = [
          this.shipment.shipperPartyId,
          this.shipment.consigneePartyId,
          this.shipment.notifyPartyId,
          this.shipment.agentPartyId,
          // this.shipment.customer,
        ];

        this.getDeptList(ids);
        // product
        var products = res.data.productData
        if (products && products.filter((item) => item.type == 0 || item.type == 4).length > 0) {
          var data = products.filter((item) => item.type == 0 || item.type == 4);
          var totalVolume = 0;
          var totalWeight = 0;
          var cargoPackageType = "";
          var slac = 0;
          for (var i = 0; i < data.length; i++) {
            totalVolume += data[i].volume;
            slac += data[i].numberOfPackages;
            totalWeight += data[i].grossWeight;
            cargoPackageType = data[i].packages;
          }
          this.bookings.push({
            bookingProductDOS: data,
            totalVolume: totalVolume,
            slac: slac,
            totalWeight: totalWeight,
            cargoPackageType: cargoPackageType,
          });
        }
      })
    },


      toTack(vesselName){
        console.log(vesselName,"vesselName")

        window.open('/track/ship?vesselName='+vesselName)
      },
      getPortList() {
        getOriginDeliveryList().then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name);
          }
        });
        getPolPodList().then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.polPodMap, response.data[i].code, response.data[i].name);
          }
        });
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
      addSpo(row) {
        var res = this.selectedSpoTable.filter((item) => item.id == row.id)
        if (res.length == 0) {
          this.selectedSpoTable.push(row)
          for (var i = 0; i < this.selectedSpoTable.length; i++) {
            this.selectSpoIds.push(this.selectedSpoTable[i].id)
          }
        }
      },
      subSpo(index) {
        this.selectedSpoTable.splice(index, 1);
        this.selectSpoIds = []
        for (var i = 0; i < this.selectedSpoTable.length; i++) {
          this.selectSpoIds.push(this.selectedSpoTable[i].id)
        }
      },

      handleOrderSubmit(rows) {
        this.init();
      },
    totalAllBooked() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked);
      }, 0)
    },

    totalAllGrossWeight() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight);
      }, 0)
    },
    totalAllVolume() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume);
      }, 0)
    },
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.shipmentCargoInfo.active(spoList, spoIds)
      })
    },


    successUpdateEventTime(){
      this.init()
    },
    cancelBooking() {
        this.$nextTick(() => {
          this.$refs.cancelBookingDialog.openDialog()
        })
      }
    },

  };
</script>
<style lang="scss" scoped>
.transport-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}

.el-loading-spinner {
  background-size: 100px 100px;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: relative;
}
 td.el-descriptions-item.el-descriptions-item__cell {
    text-align: center !important;
    vertical-align: middle !important;
}
.Red {
  color: #EA0000 !important;
}
.highlight {
  background-color: red;
  color: white;
}

/* 在全局或组件样式中添加 */
.status-popover-css {
  .el-table {
    border: none;

    &::before {
      height: 0;
    }

    td, th {
      border: none;
    }

    .el-table__row {
      &:after {
        display: none;
      }
    }
  }
}

.modern-card {
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #f0f2f5;
}

/* 记录容器 */
.change-record {
  position: relative;
  padding: 0px 0 15px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.change-record:last-child {
  border-bottom: none;
}

/* 时间戳样式 */
.change-timestamp {
  position: absolute;
  left: 0;
  top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-text {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  white-space: nowrap;
}

.record-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容区域布局 */
.change-content-wrapper {
  margin-left: 50px;
  display: flex;
  align-items: stretch;
  gap: 24px;
}

/* 船期信息卡片 */
.vessel-info {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.original-info {
  border-left: 4px solid #94a3b8;
}

.new-info {
  border-left: 4px solid #10b981;
}

.info-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.info-title::before {
  content: '';
  width: 4px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
}

.original-info .info-title::before {
  background-color: #94a3b8;
}

.new-info .info-title::before {
  background-color: #10b981;
}

/* 信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  font-size: 13px;
}

.info-label {
  display: block;
  color: #64748b;
  margin-bottom: 4px;
  font-size: 12px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

/* 中间换船类型与原因区域 */
.change-middle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px;
}

.change-type-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.vessel-type {
  background-color: #dbeafe;
  color: #2563eb;
}

.route-type {
  background-color: #fef3c7;
  color: #d97706;
}

.change-reason-card {
  max-width: 280px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reason-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.reason-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.change-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}


/* 多船期列表容器 */
.multi-vessel-list {
  gap: 12px; /* 船期间距 */
  margin-top: 8px;
}

/* 单船期项样式 */
.vessel-item {
  padding: 10px;
  border-radius: 6px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
}

/* 紧凑信息网格（5列布局） */
.compact-grid {
  grid-template-columns: repeat(5, 1fr); /* 5列更紧凑 */
  gap: 8px; /* 减小内间距 */
}

/* 紧凑中间区域 */
.compact-middle {
  gap: 10px; /* 减小元素间距 */
  padding: 8px;
}

/* 紧凑化原因卡片 */
.compact-reason {
  padding: 10px; /* 减小内边距 */
  width: 200px; /* 限制宽度 */
  word-wrap: break-word;
  word-break: break-all;
}

.reason-title {
  font-size: 12px; /* 缩小标题 */
  margin-bottom: 4px;
}

.reason-content {
  font-size: 12px; /* 缩小内容 */
  line-height: 1.4;
}

/* 减小信息项尺寸 */
.info-item {
  font-size: 12px;
}

.info-label {
  font-size: 11px; /* 缩小标签 */
  margin-bottom: 2px;
}

/* 减小整体内边距 */
.change-records {
  padding: 12px; /* 原20px */
}

.vessel-info {
  padding: 12px; /* 原16px */
}

.info-title {
  font-size: 13px; /* 缩小标题 */
  margin-bottom: 8px;
}

/* 多船期容器样式 */
.multi-vessel-list {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 减小船期间距 */
  max-height: 200px; /* 限制最大高度 */
  overflow-y: auto; /* 超出滚动 */
  padding-right: 5px;
}

/* 单船期项紧凑样式 */
.vessel-item {
  padding: 8px; /* 减小内边距 */
  border-radius: 4px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

/* 超紧凑信息网格 */
.compact-grid {
  grid-template-columns: repeat(5, 1fr);
  gap: 5px; /* 极小网格间距 */
}

/* 极小化信息项 */
.info-item {
  font-size: 11px;
}

.info-label {
  font-size: 10px; /* 缩小标签文字 */
  color: #888;
  margin-bottom: 1px;
}

.info-value {
  font-weight: 500;
  line-height: 1.3;
}


/* 减小内容区边距 */
.change-content-wrapper {
  gap: 15px; /* 减小中间区域间距 */
  margin-left: 45px; /* 缩短左侧时间戳距离 */
}

/* 船期卡片进一步压缩 */
.vessel-info {
  padding: 10px; /* 最小内边距 */
  flex: 1;
}

.info-title {
  font-size: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

/* 滚动条美化（紧凑模式） */
.multi-vessel-list::-webkit-scrollbar {
  width: 4px;
}

.multi-vessel-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}
.no-data {
    height: 100px;
}
.parties-item-css {
    white-space: pre-line !important;
    vertical-align: top !important;
}
.tab-title {
  margin: 0 16px 0 0;
  font-size: 12px;
  font-weight: bold;
}
</style>

<style scoped>
  @charset "utf-8";

  body,
  html {
    font-size: 100%;
    padding: 0;
    margin: 0;
  }
  .negative-value {
    color: red;
  }
  .el-badge__content.is-fixed {
    right: 70px !important;
  }

  /* Reset */
  *,
  *:after,
  *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Clearfix hack by Nicolas Gallagher: http://nicolasgallagher.com/micro-clearfix-hack/ */
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }

  .tmff-css .el-collapse-item-title {
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0px !important;
      margin: 0px !important;
  }
  .el-descriptions__body{
      color: #004F7C;
    }
  .custom-select .el-input__inner {
    width: 200px;
  }

  .clearfix:after {
    clear: both;
  }

  body {
    font-weight: 500;
    font-size: 1.05em;
    font-family: figtree, "Microsoft YaHei", "Segoe UI", "Lucida Grande", Helvetica, Arial,
      sans-serif;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #909399 !important;
  }

  .demo {
    padding: 25px 0;
  }

  .upload-shipment-file {
    padding-bottom: 10px;
  }
  .self-step2{
    width: 20px;
    display: inline-block;
    height: 20px;
    border-radius: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-weight: 700;
    position: relative;
    z-index: 999;
  }
  .self-step3:not(:first-child):before {
    width: 160px;
    height: 6px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 7px;
    text-align: left;
  }
  .self-step-process1:not(:first-child):before{
    background:#63acd5;
  }
  .self-step-finished1:not(:first-child):before{
    background:#004F7C;
  }
  .self-step-pedding1:not(:first-child):before{
    background:#ddd;
  }
  .self-step-error1:not(:first-child):before{
    background:#F56C6C;
  }
  .self-step5:not(:first-child):before {
    width: 90px;
    height: 2px;
    position: absolute;
    left: 0px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px dotted #dbdbdb;
  }
  .self-step5:not(:first-child):after {
    height: 100px;
    width: 2px;
    position: absolute;
    left: 0px;
    content: "";
    top: -90px;
    text-align: left;
    border-left: 4px dotted #dbdbdb;
  }

  .self-step5:first-child:before {
    width: 180px;
    height: 2px;
    position: absolute;
    left: -90px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px dotted #dbdbdb;
  }
  .self-step4:not(:last-child):before {
    width: 220px;
    height: 2px;
    position: absolute;
    left: 150px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px solid #dbdbdb;
  }

  .self-step-solid4:not(:last-child):before {
    border-top: 4px solid #dbdbdb;
  }
  .self-step-dotted4:not(:last-child):before {
    border-top: 4px dotted #dbdbdb;
  }

  .self-step1:not(:first-child):before {
    width: 150px;
    height: 2px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 20px;
    text-align: left;
  }
  p{
    margin: 0px;
  }
  .scrollable-content {

    height: 460px;
    overflow-y: auto;
  }


  .main-timeline {
    width: 800px;
    margin: 0 auto;
    font-family: figtree, "Roboto", sans-serif;
  }

  .main-timeline:after {
    content: "";
    display: block;
    clear: both;
  }

  .main-timeline:before {
    content: "";
    height: 100%;
    width: 2px;
    border: 2px dashed #000;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
    top: 30px;
  }

  .file-css {
    width: 150px;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .main-timeline .timeline {
    width: 50%;
    padding: 100px 70px 0 25px;
    margin: 0 50px 0 0;
    float: left;
    position: relative;
  }

  .htmldiv video {
    width: 400px !important;
    height: 303px !important;
  }

  .main-timeline .timeline-content {
    padding: 5px 15px 5px 40px;
    border: 2px solid #004F7C;
    border-radius: 15px 0 15px 15px;
    display: block;
    position: relative;
  }

  .main-timeline .timeline-content:hover {
    text-decoration: none;
  }

  .main-timeline .timeline-content:after {
    content: "";
    background-color: #004F7C;
    height: 18px;
    width: 15px;
    position: absolute;
    right: -15px;
    top: -2px;
    clip-path: polygon(100% 0, 0 0, 0 100%);
  }

  .main-timeline .timeline-year {
    color: #fff;
    background-color: #004F7C;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    right: -90px;
    top: -85px;
  }

  .main-timeline .timeline-year:after {
    content: "";
    height: 70px;
    width: 70px;
    border: 8px solid #004F7C;
    border-left-color: transparent;
    border-radius: 50%;
    transform: translateX(-50%) translateY(-50%) rotate(-20deg);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .main-timeline .timeline-icon {
    color: #fff;
    background-color: #00a79b;
    font-size: 35px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -25px;
    transition: all 0.3s;
  }

  .main-timeline .title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    margin: 0 0 7px 0;
  }

  .main-timeline .description {
    color: #222;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: justify;
    margin: 0 0 5px;
  }

  .main-timeline .timeline:nth-child(even) {
    padding: 100px 25px 0 70px;
    margin: 0 0 0 50px;
    float: right;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content {
    padding: 5px 40px 5px 15px;
    border-radius: 0 15px 15px 15px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content:after {
    transform: rotateY(180deg);
    right: auto;
    left: -15px;
  }

  .w-e-textarea-video-container {
    background-image: none !important;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year {
    right: auto;
    left: -100px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year:after {
    transform: translateX(-50%) translateY(-50%) rotate(200deg);
  }

  .main-timeline .timeline:nth-child(even) .timeline-icon {
    left: auto;
    right: -25px;
  }

  .button-row {
    display: inline-flex;
    align-items: center;
  }

  @media screen and (max-width: 767px) {
    .main-timeline:before {
      display: none;
    }

    .main-timeline .timeline {
      width: 100%;
      padding-top: 80px;
      padding-right: 12px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline:nth-child(even) {
      padding-left: 10px;
      padding-top: 80px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline-content,
    .main-timeline .main-timeline .timeline:nth-child(even) .timeline-content {
      background-color: #fff;
      padding-top: 25px;
    }

    .main-timeline .timeline-content:after {
      display: none;
    }

    .main-timeline .timeline-year {
      font-size: 24px;
      line-height: 70px;
      height: 70px;
      width: 70px;
      right: 0;
      top: -65px;
    }


    .main-timeline .timeline-year:after {
      display: none;
    }

    .main-timeline .timeline:nth-child(even) .timeline-year {
      left: 3px;
    }

  }

  iframe * {
    font-family: figtree, 微软雅黑;
  }

  @media screen and (max-width: 567px) {
    .main-timeline .title {
      font-size: 18px;
    }
  }

  .text-upload {
    padding-top: 5px;
    margin: 10px;
    border: 1px solid #ddd;
    display: flex;
    /* 启用 Flexbox 布局 */
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row-reverse;
  }

  .text-upload .tools-but {
    background: #ffffff;
  }

  .text-upload .tools-but span {
    font-size: 14px;
    margin-right: 10px;
    cursor: pointer;
  }

  .text-upload .el-descriptions {
    margin: 0;
    padding: 0px 10px 10px 10px !important;
    border: 0 !important;
    box-shadow: none;
  }
  .el-des-margin-top img.imgLogo {
    margin: 0;
    padding: 0;
    image-rendering: -webkit-optimize-contrast;
    width: 140px;
    height: 40px;
    top: 10px;
  }

  /* .avatar-container:hover .delete-button {
    display: block;
  } */
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
