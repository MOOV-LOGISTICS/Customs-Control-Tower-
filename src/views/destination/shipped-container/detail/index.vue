<template>
  <div style="padding:15px 58px 15px 58px; width: 90vw;">
    <el-tabs type="border-card" :ref="`tab${containerRowData.id}`" v-model="activeTabName">
      <!-- <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-container:orders:view')" label="Orders" name="orders"> -->
      <el-tab-pane label="Orders" name="orders">
        <ContainerOrders ref="ordersRef" :container-orders="containerOrders" :loading="containerOrdersLoading"></ContainerOrders>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-containers:docs-ready-view')" label="Docs Ready" name="docsReady">
        <docs-ready-tab ref="docsReadyRef" :container-row-data="containerRowData" :userMap="userMap"/>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-container:documents:view')" label="Documents" name="documents">
        <documents ref="documentsRef" :document-data="documentList"></documents>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination:delivery-pre-plan:view')" label="Delivery Pre-Plan" name="deliveryPrePlan">
        <delivery-plan-table :table-data="preDeliveryPlans" :containerRowData="containerRowData" :delivery-plan-type="1" :loading="preDeliveryPlansLoading" @refresh="handleDeliveryPlansAddItem" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-shipments:assign-count:view')" label="Customs Broker Assign" name="customsBrokerAssign">
      <customer-assign ref="customerAssignRef" :log-data="logDataInfo"></customer-assign>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination:delivery-plan:view')" label="Delivery Plan" name="deliveryPlan">
        <delivery-plan-table :table-data="deliveryPlans" :containerRowData="containerRowData" :delivery-plan-type="2" :loading="deliveryPlansLoading" @refresh="handleDeliveryPlansAddItem" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-shipments:invoice-count:view')" label="Invoices to Customs" name="invoicesToCustom">
          <freight-invoiced ref="freightInvoiceRef" :log-data="logDataInfo"></freight-invoiced>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-shipments:finished-count:view')" label="Customs Clearance Finished" name="customsClearanceFinished">
          <customs-clearance ref="customsClearanceRef" :log-data="logDataInfo"></customs-clearance>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination:arrival-at-dc-date:view')" label="Arrival At DC" name="arrivalAtDC">
        <arrival-at-dc-table :table-data="arrivalAtDcList" :containerRowData="containerRowData" :loading="arrivalAtDcLoading" @refresh="handleDeliveryPlansAddItem" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination:container-track:view')" label="Track" name="track">
        <container-track :table-data="trackList" :containerRowData="containerRowData" :loading="trackLoading" @refresh="handleContainerTrack" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination:change-log:view')" label="Change Log" name="actionLog">
        <log ref="logRef" :log-data="logDataInfo"></log>
      </el-tab-pane>
      <el-tab-pane label="Comment" name="comment">
        <comment ref="commentRef" :destinationContainerId="containerRowData.id"></comment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getDestinationContainerDetail, destContainerOrderItemList } from '@/api/destination/destination'
import { allUsers } from '@/api/system/user'
import ArrivalAtDcTable from '@/views/destination/shipped-container/detail/tabs/arrival-at-dc-table.vue'
import comment from '@/views/destination/shipped-container/detail/tabs/comment.vue'
import ContainerTrack from '@/views/destination/shipped-container/detail/tabs/container-track.vue'
import customerAssign from '@/views/destination/shipped-container/detail/tabs/customer-assign.vue'
import customsClearance from '@/views/destination/shipped-container/detail/tabs/customs-clearance.vue'
import DeliveryPlanTable from '@/views/destination/shipped-container/detail/tabs/delivery-plan-table.vue'
import documents from '@/views/destination/shipped-container/detail/tabs/documents.vue'
import freightInvoiced from '@/views/destination/shipped-container/detail/tabs/freight-invoiced.vue'
import DocsReadyTab from '@/views/destination/shipped-container/detail/tabs/docs-ready-tab.vue'
import log from '@/views/destination/shipped-container/detail/tabs/log.vue'
import ContainerOrders from '@/views/destination/shipped-container/detail/tabs/container-orders.vue'
export default {
  name: 'ContainerExpandDetail',
  components: {
    DeliveryPlanTable,
    ArrivalAtDcTable,
    ContainerTrack,
    documents,
    log,
    customerAssign,
    customsClearance,
    freightInvoiced,
    DocsReadyTab,
    comment,
    ContainerOrders,
  },
  props: {
    containerRowData: {
      type: Object,
      required: true
    },
    dcNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTabName: 'docsReady',
      documentList: [],
      // 预抵达计划
      preDeliveryPlans: [],
      // 抵达计划
      deliveryPlans: [],
      //
      traceLogList: [],
      //
      arrivalAtDcList: [],
      // 追踪日志
      trackList: [],
      brokerAssignInfo: {},
      invoiceCustomsInfo: {},
      customsClearanceFinishInfo: {},
      // 文档
      documentLoading: false,
      // 预抵达计划加载中
      preDeliveryPlansLoading: false,
      // 抵达计划加载中
      deliveryPlansLoading: false,
      // arrival at dc加载中
      arrivalAtDcLoading: false,
      // 追踪日志
      trackLoading: false,
      brokerAssignLoading: false,
      invoiceCustomsLoading: false,
      customsClearanceFinishLoading: false,
      // add container orders
      containerOrdersLoading: false,
      containerOrders: [],
      logDataInfo: {},
      userMap: new Map(),
    }
  },
  computed: {
    availableTabs() {
      const tabs = []
      // if(this.$auth.hasPermi('pepco:destination-container:orders:view')){
      //   tabs.push('orders')
      // }
      tabs.push('orders')
      if (this.$auth.hasPermi('pepco:destination-containers:docs-ready-view')) {
        tabs.push('docsReady')
      }
      if(this.$auth.hasPermi('pepco:destination-container:documents:view')){
        tabs.push('documents')
      }
      if (this.$auth.hasPermi('pepco:destination:delivery-pre-plan:view')) {
        tabs.push('deliveryPrePlan')
      }
      if (this.$auth.hasPermi('pepco:destination-shipments:assign-count:view')) {
        tabs.push('customsBrokerAssign')
      }
      if (this.$auth.hasPermi('pepco:destination:delivery-plan:view')) {
        tabs.push('deliveryPlan')
      }
      if (this.$auth.hasPermi('pepco:destination:arrival-at-dc-date:view')) {
        tabs.push('arrivalAtDC')
      }
      return tabs
    },
    defaultActiveTab() {
      return this.availableTabs.length > 0 ? this.availableTabs[0] : 'actionLog' // actionLog 始终显示
    }
  },
  mounted() {
    this.activeTabName = this.defaultActiveTab
    this.getDestinationContainerDetailInfo()

    this.$nextTick(() => {
      if (this.$refs.docsReadyRef) {
        this.$refs.docsReadyRef.loadData()
      }
    })
  },
  created() {
    allUsers().then(response => {
      console.log('用户信息', response.data)
      this.userMap = response.data.reduce((map, user) => {
        map.set(user.id, user.nickname)
        return map
      }, new Map())
    })
  },
  methods: {
    // 获取集装箱详细信息
    getDestinationContainerDetailInfo() {
      // 获取container order item信息
      this.containerOrdersLoading = true
      destContainerOrderItemList(this.containerRowData.id)
        .then(res => {
          this.containerOrders = res.data || []
        })
        .catch(err => {
          console.error('获取集装箱订单信息失败:', err)
          this.$message.error('Error')
        })
        .finally(() => {
          this.containerOrdersLoading = false
        })
      this.documentLoading = true
      this.preDeliveryPlansLoading = true
      this.deliveryPlansLoading = true
      this.ArrivalAtDc = true
      this.brokerAssignLoading = true
      this.invoiceCustomsLoading = true
      this.customsClearanceFinishLoading = true
      getDestinationContainerDetail(this.containerRowData.id)
        .then(res => {
          if (res.data) {
            console.log('获取集装箱详情成功:', res.data)
            this.preDeliveryPlans = res.data.preDeliveryPlans
            this.deliveryPlans = res.data.deliveryPlans
            this.traceLogList = res.data.traceLogList
            this.arrivalAtDcList = this.parseArrivalAtDcList(res.data.arrivalAtDcList)
            this.trackList = res.data.trackList
            if (this.$refs.documentsRef) {
                this.$refs.documentsRef.setDocumentData(res.data.documents || [])
            }
            if (this.$refs.logRef) {
              this.logDataInfo.logList = this.traceLogList || []
              this.$refs.logRef.setLogData(this.logDataInfo)
            }
            if(this.$refs.customerAssignRef){
              this.brokerAssignInfo.logList = res.data.brokerAssignList || []
              this.brokerAssignInfo.type = "Customs Broker Assign"
              this.$refs.customerAssignRef.setCommentsData(this.brokerAssignInfo)
            }
            if(this.$refs.freightInvoiceRef){
              this.invoiceCustomsInfo.logList = res.data.invoiceCustomsList || []
              this.invoiceCustomsInfo.type = "Invoices to Customs"
              this.$refs.freightInvoiceRef.setCommentsData(this.invoiceCustomsInfo)
            }
            if(this.$refs.customsClearanceRef){
              this.customsClearanceFinishInfo.logList = res.data.customsClearanceFinishList || []
              this.customsClearanceFinishInfo.type = "Customs Clearance Finished"
              this.$refs.customsClearanceRef.setCommentsData(this.customsClearanceFinishInfo)
            }
          }
        })
        .catch(err => {
          console.error('获取集装箱详情失败:', err)
          this.$message.error('Error')
        })
        .finally(() => {
          this.documentLoading = false
          this.preDeliveryPlansLoading = false
          this.deliveryPlansLoading = false
          this.ArrivalAtDc = false
          this.brokerAssignLoading = false
          this.invoiceCustomsLoading = false
          this.customsClearanceFinishLoading = false
        })
    },
    parseArrivalAtDcList(list){
      if(list && Array.isArray(list)){
        return list.map(item => {
          const dcInfo = this.dcNameList.find(dc => dc.dcCode === item.dcCode);
          if (dcInfo) {
            item.dc = dcInfo.dcName;
          } else {
            item.dc = '';
          }
          return item;
        });
      }
      return [];
    },
    handleDeliveryPlansAddItem() {
      this.getDestinationContainerDetailInfo()
    },
    handleArrivalAtDcAddItem() {
      this.getDestinationContainerDetailInfo()
    },
    handleContainerTrack() {
      this.getDestinationContainerDetailInfo()
    }
  }
}
</script>

