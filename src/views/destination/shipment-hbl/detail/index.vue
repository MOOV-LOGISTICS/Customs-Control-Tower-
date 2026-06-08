<template>
  <div style="padding:15px 58px 15px 58px; width: 90vw;">
    <el-tabs type="border-card" :ref="`tab${hblRowData.id}`" v-model="activeTabName">
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:documents:view')" label="Documents" name="documents">
        <documents ref="documentsRef" :hblRowData="hblRowData"></documents>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:documents-verified:view')" label="Documents Verified" name="documentsVerified">
        <documents-verified ref="documentsVerifiedRef"></documents-verified>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:container-hbl:view')" label="Containers/HBL" name="containersHbl">
        <container-hbl ref="containerHblRef"></container-hbl>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:pos-hbl:view')" label="POs/HBL" name="posHbl">
        <div class="fixed-general-info">
          <orders-in-containers ref="ordersInContainersRef" :container-data="containerList"></orders-in-containers>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:container-lp:view')" label="Containers/LP" name="containersLp">
        <container-lp ref="containerLpRef"></container-lp>
      </el-tab-pane>
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:carrier-booking:view')" label="Carrier Booking" name="carrierBooking">
        <carrier-booking ref="carrierBookingRef" :shipmentRes-data="shipmentResList" :hblRowData="hblRowData"></carrier-booking>
      </el-tab-pane>        
      <el-tab-pane v-if="this.$auth.hasPermi('pepco:destination-hbl:log:view')" label="Change Log" name="actionLog">
        <log ref="logRef"></log>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  destinationHbCarrierbookingTab,
  destinationHblContainerHblTab,
  destinationHblContainerLpTab,
  destinationHblDocumentsTab,
  destinationHblDocumentsVerifiedTab,
  destinationHblLogTab,
  destinationHblPosInHblTab,
} from '@/api/destination/destination';
import { allUsers } from '@/api/system/user';
import carrierBooking from '@/views/destination/shipment-hbl/detail/tabs/carrier-booking.vue';
import containerHbl from '@/views/destination/shipment-hbl/detail/tabs/container-hbl.vue';
import containerLp from '@/views/destination/shipment-hbl/detail/tabs/container-lp.vue';
import documentsVerified from '@/views/destination/shipment-hbl/detail/tabs/documents-verified.vue';
import documents from '@/views/destination/shipment-hbl/detail/tabs/documents.vue';
import log from '@/views/destination/shipment-hbl/detail/tabs/log.vue';
import ordersInContainers from '@/views/destination/shipment-hbl/detail/tabs/orders-in-containers.vue';

export default {
  name: 'HblExpandDetail',
  components: {
    documents,
    documentsVerified,
    carrierBooking,
    log,
    ordersInContainers,
    containerHbl,
    containerLp,
  },
  props: {
    hblRowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTabName: 'documents',
      documentList: [],
      // 文档
      documentLoading: false,
      logDataInfo: {},
      userMap: [],
      documentsKey: 0,
      documentsVerifiedInfo:{},
      shipmentResList: {},
      containerList: [],
      containerHblList: [],
      containerLpList: [],
    }
  },
  computed: {
    availableTabs() {
      const tabs = []
      if(this.$auth.hasPermi('pepco:destination-hbl:documents:view')){
        tabs.push('documents')
      }
      return tabs
    },
    defaultActiveTab() {
      return this.availableTabs.length > 0 ? this.availableTabs[0] : 'actionLog' // actionLog 始终显示
    }
  },
  mounted() {
    this.activeTabName = this.defaultActiveTab  
    this.getDestinationHblDetailInfo()
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
    async getDestinationHblDetailInfo() {
    try {
      // 使用 Promise.all 等待所有接口调用完成
      const [
        documentsResponse,
        documentsVerifiedResponse,
        carrierBookingResponse,
        posInHblResponse,
        logResponse,
        containerHblResponse,
        containerLpResponse
      ] = await Promise.all([
        destinationHblDocumentsTab(this.hblRowData.id),
        destinationHblDocumentsVerifiedTab(this.hblRowData.id),
        destinationHbCarrierbookingTab(this.hblRowData.id),
        destinationHblPosInHblTab(this.hblRowData.id),
        destinationHblLogTab(this.hblRowData.id),
        destinationHblContainerHblTab(this.hblRowData.id),
        destinationHblContainerLpTab(this.hblRowData.id)
      ]);

      // 处理文档数据
      if (this.$refs.documentsRef) {
        this.$refs.documentsRef.setDocumentData(documentsResponse.data || []);
      }

      // 处理已验证文档数据
      if (this.$refs.documentsVerifiedRef) {
        const documentsVerifiedInfo = {};
        documentsVerifiedInfo.logList = documentsVerifiedResponse.data || [];
        documentsVerifiedInfo.userMap = this.userMap || new Map();
        documentsVerifiedInfo.type = "Shipping Documents Verify by Pepco";
        this.$refs.documentsVerifiedRef.setCommentsData(documentsVerifiedInfo);
      }

      // container hbl 
      if (this.$refs.containerHblRef) {
        this.containerHblList = containerHblResponse.data || [];
        this.$refs.containerHblRef.setContainerHblData(this.containerHblList);
      }

      // container lp
      if (this.$refs.containerLpRef) {
        this.containerLpList = containerLpResponse.data || [];
        this.$refs.containerLpRef.setContainerLpData(this.containerLpList);
      }

      // 处理承运人预订数据
      this.shipmentResList = carrierBookingResponse.data || [];
      if (this.$refs.carrierBookingRef) {
        this.$refs.carrierBookingRef.setShipmentResData(this.shipmentResList);
      }

      // 处理容器列表数据
      this.containerList = posInHblResponse.data || [];
      if (this.$refs.ordersInContainersRef) {
        this.$refs.ordersInContainersRef.setContainerData(this.containerList);
      }

      // 处理日志数据
      if (this.$refs.logRef) {
        const logDataInfo = {};
        logDataInfo.logList = logResponse.data || [];
        logDataInfo.userMap = this.userMap || new Map();
        this.$refs.logRef.setLogData(logDataInfo);
      }

      console.log('所有数据加载完成');
      // 在这里可以执行所有数据加载完成后的操作
    } catch (error) {
      console.error('数据加载失败:', error);
      this.$message.error('数据加载失败');
    }
  },
  getContainerHblSelectedRows() {
    console.log('获取选中的行数据:', 'dd');
      if (this.$refs.containerHblRef) {
        console.log('获取选中的行数据:', this.$refs.containerHblRef.getSelectedRows());
        return this.$refs.containerHblRef.getSelectedRows();
      }
      return [];
    }
  }
}
</script>
<style scoped>
.fixed-general-info {
  position: relative;
  background: #fff;
  overflow: auto;
  padding: 10px;
  /* 以下确保它脱离 el-table-body-wrapper 的 overflow 控制 */
  min-width: 1400px; /* 或你子表格所需的最小宽度 */
}
.fixed-general-info .el-table {
  min-width: 1200px; /* 取决于你子表格总列宽 */
  width: auto;
}
</style>