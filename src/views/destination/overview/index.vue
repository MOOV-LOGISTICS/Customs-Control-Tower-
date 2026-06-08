<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;">
    <el-card class="pd-20">
      <div class="transition-box">
        <div style="float: left;padding-top: 8px;"></div>
        <div style="float:left;padding: 10px 0;">
          <el-input
            placeholder="Shipper Booking No"
            v-model="queryParams.shipperBookingNumber"
            @clear="initList"
            @input.native="queryParams.shipperBookingNumber = $event.target.value.trim()"
            @keyup.enter.native="initList"
            clearable
          >
            <!--            <el-button slot="append" @click="initList" type="primary">Search<i class="el-icon-search el-icon&#45;&#45;right"></i></el-button>-->
          </el-input>
        </div>
        <div style="float:left;margin-left: 5px;padding: 10px 0px;">
          <el-input
            placeholder="Carrier Booking No"
            v-model="queryParams.carrierBookingNumber"
            @clear="initList"
            @input.native="queryParams.carrierBookingNumber = $event.target.value.trim()"
            @keyup.enter.native="initList"
            clearable
          ></el-input>
        </div>
        <div style="float:left;margin-left: 5px;padding: 10px 0px;">
          <el-input placeholder="Container No" v-model="queryParams.containerNo" @clear="initList" @input.native="queryParams.containerNo = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
        </div>
        <div style="float:left;margin-left: 5px;padding: 10px 0px;">
          <el-select v-model="queryParams.dcList" placeholder="DC" clearable @clear="initList" @change="initList" filterable multiple>
            <el-option v-for="item in dcList" :key="item.dcCode" :label="`${item.dcCode} - ${item.dcName}`" :value="item.dcCode" />
          </el-select>
        </div>
        <div style="float:left;margin-left: 5px;padding: 10px 0px;">
          <el-button @click="initList" icon="el-icon-search" style="background-color: #004F7C; color: white;" plain>Search</el-button>
        </div>
        <div style="float:left;margin-left: 5px;padding: 10px 0px;">
          <el-popover v-model="filterPopover" placement="bottom" title="Filter" width="400" trigger="click">
            <el-form>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <!--  @change=" initList"  -->
                  <el-input placeholder="Supplier Id" v-model="queryParams.supplierId" @clear="initList" @input.native="queryParams.supplierId = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input placeholder="MP NUMBER" v-model="queryParams.mpNumber" @clear="initList" @input.native="queryParams.mpNumber = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-input placeholder="SET Number" v-model="queryParams.setNumber" @clear="initList" @input.native="queryParams.setNumber = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input :placeholder="$constants.MBL_NUMBER" v-model="queryParams.mblNumber" @clear="initList" @input.native="queryParams.mblNumber = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-input placeholder="HBL Number" v-model="queryParams.hblNumber" @clear="initList" @input.native="queryParams.hblNumber = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="queryParams.dc" placeholder="DC" clearable @clear="initList" @change="initList" filterable>
                    <el-option v-for="item in dcList" :key="item.dcCode" :label="`${item.dcCode} - ${item.dcName}`" :value="item.dcCode" />
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-select filterable @change="initList" clearable v-model="queryParams.pol" placeholder="POL">
                    <el-option v-for="value in polSet.slice().sort()" :label="value" :value="value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="queryParams.pod" clearable filterable @change="initList" placeholder="POD">
                    <el-option v-for="item in portOptions" :label="item.country" :value="item.country"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-input placeholder="Vessel" v-model="queryParams.vessel" @clear="initList" @input.native="queryParams.vessel = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input placeholder="Voyage" v-model="queryParams.voyage" @clear="initList" @input.native="queryParams.voyage = $event.target.value.trim()" @keyup.enter.native="initList" clearable></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-bottom: 15px;">
                <el-col style="text-align: right">
                  <el-button @click="initList" icon="el-icon-search" style="background-color: #004F7C; color: white;" plain>Search</el-button>
                </el-col>
              </el-row>
            </el-form>
            <!--            <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'red':''}">Filter</el-button>-->
          </el-popover>
        </div>
        <div style="clear: both;"></div>
        <div slot="header" class="clearfix" style="margin-top: 10px;">
          <span>Destination</span>
        </div>
        <hr style="border-color: rgb(230, 235, 245); border-style: solid; border-bottom: 1px;" />
        <div style="height: 10px"></div>
        <el-card style="margin-bottom:20px;box-shadow:none !important;" class="box-card">
          <div style="padding: 0px 0px 20px 0;margin-left:-20px;">
            <el-table border :data="dataList" style="width: 100%">
              <el-table-column prop="taskName" label="Task Name" min-width="230">
                <template slot-scope="scope">
                  {{ scope.row.taskName === 'Container Loading Plan' ? 'Container Loading Result' : scope.row.taskName }}
                  <overview-tip-popover :task-name="scope.row.taskName" :taskTipInfoMap="taskTipInfoMap"/>
                </template>
              </el-table-column>
              <el-table-column prop="partyRole" label="Party Role" min-width="200">
                <template slot-scope="scope">{{ getPartyRole(scope.row.partyRole) }}</template>
              </el-table-column>
              <el-table-column label="Based On" min-width="200">
                <template slot-scope="scope">{{ getTaskType(scope.row) }}</template>
              </el-table-column>
              <el-table-column prop="possibleCount" align="center" label="Possible" min-width="100">
                <template slot="header" slot-scope="scope">
                  <span class="title" style="color: #2d86ba; background-color:#ceecfd;">Possible</span>
                </template>
                <template slot-scope="scope">
                  <span style="color: #2d86ba; font-size: 16px;" v-if="scope.row.type !== 1 && scope.row.type !== 2 && scope.row.type!==3 && scope.row.type !== 4">{{ scope.row.possibleCount || 0 }}</span>
                  <span style="color: #2d86ba; font-size: 16px;" class="numberOftask" v-else
                        @click="taskDetails(scope.row, 'possible')">{{ scope.row.possibleCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="urgentCount" align="center" label="Urgent" min-width="100">
                <template slot="header" slot-scope="scope">
                  <span class="title" style="color: #e6a23c; background: #fdf6ec;">Urgent</span>
                </template>
                <template slot-scope="scope">
                  <span style="color: #e6a23c; font-size: 16px;" v-if="scope.row.type !== 1 && scope.row.type !== 2 && scope.row.type!==3 && scope.row.type !== 4">{{ scope.row.urgentCount || 0 }}</span>
                  <span style="color: #e6a23c; font-size: 16px;" class="numberOftask" v-else
                        @click="taskDetails(scope.row, 'urgent')">{{ scope.row.urgentCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="overdueCount" align="center" label="Overdue" min-width="100">
                <template slot="header" slot-scope="scope">
                  <span class="title" style="color: #f56c6c; background: #fef0f0;">Overdue</span>
                </template>
                <template slot-scope="scope">
                  <span style="color: #f56c6c; font-size: 16px;" v-if="scope.row.type !== 1 && scope.row.type !== 2 && scope.row.type!==3 && scope.row.type !== 4">{{ scope.row.overdueCount || 0 }}</span>
                  <span style="color: #f56c6c; font-size: 16px;" class="numberOftask" v-else
                        @click="taskDetails(scope.row, 'overdue')">{{ scope.row.overdueCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="finishedCount" align="center" label="Finished" min-width="100">
                <template slot="header" slot-scope="scope">
                  <span class="title" style="color: #13854e; background-color:#d6ede2;">Finished</span>
                </template>
                <template slot-scope="scope">
<!--                  <span style="color: #13854e; font-size: 16px;" v-if="scope.row.type !== 1 && scope.row.type !== 2 && scope.row.type !== 3">{{ scope.row.finishedCount || 0 }}</span>-->
                  <span style="color: #13854e; font-size: 16px;" class="numberOftask"  @click="taskDetails(scope.row, 'finished')">{{ scope.row.finishedCount || 0 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDestinationDcList, getDestinationOverview } from '@/api/destination/destination';
import { poList } from '@/api/system/cutoff';
import { getOriginDeliveryList } from '@/api/system/originDelivery';
import '@icon-park/vue/styles/index.css';
import OverviewTipPopover from '@/views/components/overview/overview-tip-popover.vue';

export default {
  name: 'DestinationOverview',
  components: {
    OverviewTipPopover,
  },
  data() {
    return {
      dataList: [],
      filterPopover: false,
      hasFilter: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        shipperBookingNumber: null,
        carrierBookingNumber: null,
        containerNo: null,
        supplierId: null,
        mpNumber: null,
        setNumber: null,
        dcList: null,
        mblNumber: null,
        hblNumber: null,
        dc: null,
        pol: null,
        pod: null,
        vessel: null,
        voyage: null
      },
      allTaskNames: [],
      originPort: [],
      taskInfo: [],
      polSet: [],
      vesselSet: [],
      voyageSet: [],
      podList: [],
      portOptions: [],
      dcList: [],
      taskTipInfoMap: new Map(),
    }
  },
  mounted() {
    this.loadDcList()
    this.initList()
    poList().then(response => {
      if (response && response.data) {
        this.polSet = response.data.polSet
        this.vesselSet = response.data.vesselSet.filter(item => item != 'Unknown')
        this.voyageSet = response.data.voyageSet.filter(item => item != 'Unknown')
      }
    })
    getOriginDeliveryList().then(response => {
      if (response.data) {
        const map = new Map()
        response.data.forEach(item => {
          if (!map.has(item.country) && item.country) {
            map.set(item.country, item)
          }
        })
        // 将Map的值（即去重后的数组）转换回数组
        this.portOptions = Array.from(map.values())
        this.portOptions.sort((a, b) => {
          // 按照 Country 的字母顺序排序
          return a.country.localeCompare(b.country)
        })
      }
    })
  },
  created() {
    this.overviewTipPopoverMethods()
  },
  methods: {
    loadDcList() {
      getDestinationDcList({}).then(res => {
        this.dcList = res.data || []
      })
    },
    initList() {
      getDestinationOverview(this.queryParams).then(response => {
        this.dataList = response.data
      })
    },
    getPartyRole(partyRole) {
      if (partyRole === 'Cargo Inbound') {
        // return 'CFS'
        return 'OHA'
      } else if (partyRole === 'Container Gate In') {
        return 'OHA'
      }
      // return this.taskInfo[taskName]?.['partyRole'] || '-'
      return partyRole
    },
    taskDetails(row, type){
      if(row.type === 1){// destination_shipping
        this.$router.push("/Destination-Management/Pepco-Shipping-Booking?taskRow="+JSON.stringify(row)+"&taskType="+type);
      }else if(row.type === 2|| row.type === 3){// destination_container
        this.$router.push("/Destination-Management/Pepco-Shipped-Container?taskRow="+JSON.stringify(row)+"&taskType="+type+"&queryParams="+JSON.stringify(this.queryParams));
      }else if(row.type === 4){
        this.$router.push("/Destination-Management/Pepco-Hbls?taskRow="+JSON.stringify(row)+"&taskType="+type+"&queryParams="+JSON.stringify(this.queryParams));
      }

    },
    getTaskType(row) {
      if (row.type === 1) {
        return 'Shipper Booking Level'
      } else if (row.type === 2) {
        return 'Container Level'
      }else if(row.type === 4){
        return 'HBL Level'
      }else if(row.taskCode === 'Vessel_Arrival' || row.taskCode === 'Container_Discharged' || row.taskCode === 'Empty_Container_Returned'){
        return 'Container Level'
      } else {
        return ''
      }
    },
    overviewTipPopoverMethods() {
      // 获取字典数据并转换为 Map
      const dictList = this.getDictDatas('overview_tip_popover_destination');
      // 创建主 Map
      this.taskTipInfoMap = new Map();
      // 遍历字典列表，将每项转换为 Map 并存入主 Map
      dictList.forEach(item => {
        try {
          // item.label 作为主 Map 的 key
          const taskName = item.label;
          // 解析 item.value 中的 JSON 字符串
          const valueMap = new Map();
          const jsonObj = JSON.parse(item.value);
          // 将 JSON 对象的每个属性转换为 Map 的键值对
          Object.keys(jsonObj).forEach(key => {
            valueMap.set(key, jsonObj[key]);
          });
          // 将解析后的 Map 存入主 Map
          this.taskTipInfoMap.set(taskName, valueMap);
        } catch (error) {
          console.error('Error parsing dict value:', item.value, error);
        }
      });
      console.log('overviewTipPopoverMap:', this.taskTipInfoMap);
    },
  }
}
</script>

<style scoped>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
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
</style>

