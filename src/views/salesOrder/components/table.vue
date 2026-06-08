<template>
  <div>
    <el-table
      border
      :row-class-name="tableRowClassName"
      :height="tableHeight==null?'':tableHeight"
      :data="tableData"
      @sort-change="sortChange"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        :selectable="checkSelectable"
        width="55">
      </el-table-column>
      <el-table-column
        v-if="showPlusIcon"
        prop="id" label="" width="50">
        <template v-slot="scope">
          <i class="el-icon-plus" style="cursor: pointer;" @click="addSO(scope.row)">Add</i>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="padding:15px 58px 15px 58px;">
            <el-tabs type="border-card" :ref="'tab'+props.row.id" v-model="props.row.key">
              <el-tab-pane label="Order Items" :name="'first'+props.row.id">
                <ItemTable @updateSOItem="updateSOItem" :showCheckbox="showCheckbox" :itemTableData="props.row.soItemRespVOS" :showFactory="showFactory"></ItemTable>
              </el-tab-pane>
              <el-tab-pane label="Location" :name="'first2'+props.row.id"  v-if="showOtherTabs && !showFactory">
                <el-descriptions style="width: 400px;box-shadow: none;" title="" direction="vertical" :column="2" border>
                  <el-descriptions-item label="POL">{{ props.row.soItemRespVOS.length>0?props.row.soItemRespVOS[0].pol:'' }}</el-descriptions-item>
                  <el-descriptions-item label="POD">{{ props.row.soItemRespVOS.length>0?props.row.soItemRespVOS[0].pod:'' }}</el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane v-if="props.row.shipmentRes&&props.row.shipmentRes.length>0&&showCheckbox && showOtherTabs && !showFactory"
                           label="Shipment" :name="'sencond'+props.row.id">
                <el-descriptions title="" direction="vertical" :column="8" border style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                                 v-for="row in props.row.shipmentRes.length>0?[props.row.shipmentRes[props.row.shipmentRes.length-1]]:[]"
                                 :key="'item' + row.id">
                  <el-descriptions-item label="Shipment Ref">
                    <el-link type="primary" :href="'/shipment/detail?id='+row.id" target="_blank">
                      {{ row.bookingNumber }}
                    </el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="Booking Number">
                    <el-link type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=bookingNumber&searchKey='+row.shipmentBookingNumber">{{ row.shipmentBookingNumber }}</el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="BL Number">
                    {{ row.blNumber}}
                  </el-descriptions-item>

                  <el-descriptions-item label="Shipped together with">
                    <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;" v-for="lot in row.orderNumbers.filter((item)=>props.row.salesOrderNumber!=item)">
                      <span > {{ lot }}</span>
                    </el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="Carrier">
                    {{ row.carrier}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Vessel/Voyage">
                    <el-link type="primary" @click="toTack(row.routerDOList[0].imo)">
                      {{ row.routerDOList[0].transportMeanName }}/{{ row.routerDOList[0].voyage }}
                    </el-link>
                  </el-descriptions-item>

                  <el-descriptions-item label="Contract Number">
                    {{row.contractNumber}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipped TEU">
                    {{ getshippedTue(row.containerDOList.filter((item) => item.type == 0)) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Week">
                    <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                             @click="toAllocation(order,2)" >
                      {{ row.etdAllocation }}
                    </el-link>
                    <p v-else> {{ row.etdAllocation }} </p>
                  </el-descriptions-item>

                  <el-descriptions-item label="Booked ETD">
                    {{ parseTime(row.bookedEtd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Booked ETA">
                    {{ parseTime(row.bookedEta) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATD">
                    {{ parseTime(row.atd) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATA">
                    {{ parseTime(row.ata) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Containers">
                                        <span  style="float: left;" v-for="container in row.containerDOList.filter((item) => item.type == 0)">
                                            <span style="margin-right: 5px;">{{ container.containerType }} *{{ container.numbers }}</span>
                                        </span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Shipped Containers">
                                        <span   v-for="container in row.containerDOList.filter((item) => item.type == 1)">
                                            <el-link style="margin-right: 10px;" type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=containerNo&searchKey='+container.containerNo">
                                            <span style="margin-right: 5px;"> {{ container.containerNo }}: {{ container.containerType }} </span>
                                            </el-link>
                                        </span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Tranport Status">
                    <el-tag type="primary" style="float: left;">
                      {{showStatus(row)}}
                    </el-tag>
                  </el-descriptions-item>

                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane v-if="showCheckbox && showOtherTabs && !showFactory" label="Milestones" :name="'third'+props.row.id" >
                <div style="padding-bottom: 20px;padding:10px 0px 20px 0px;overflow-x: hidden;">
                  <div v-for=" task in props.row.orderTaskRespVOS" :Key="'task'+task.id" class="self-step1"
                       style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 100px;">
                    <p>
                                            <span class="self-step"  :class="[task.status==1 ? 'self-step-process' : ''
                                , task.status==2 ? 'self-step-finished' : ''
                                , task.status==0 ? 'self-step-pedding' : '']">{{ task.seq }}</span>
                      <p style="display: inline-block;
                                                width: 150px;
                                                padding-top: 8px;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                text-overflow: ellipsis;">
                        <span class="title">{{ task.taskName }} </span>
                      </p>
                      <p>
                        {{ task.status==2?parseTime(task.updateTime):'' }}
                      </p>
                    </p>
                  </div>
                  <div style="clear:both"></div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="Documents" :name="'documents'+props.row.id" v-if="showOtherTabs && !showFactory">
                <Document  :orderId="props.row.id"></Document>
              </el-tab-pane>
              <el-tab-pane label="Change Log" :name="'second4'+props.row.id" v-if="showOtherTabs && !showFactory" >
                <el-empty v-if="props.row.logStatusResList.length==0"></el-empty>
                <el-timeline >
                  <el-timeline-item v-for="(o, index) in props.row.logStatusResList" :key="index" :timestamp=parseTimeToZ1(o.createTime)>
                    {{ o.logInfo }}
                  </el-timeline-item>
                </el-timeline>
                <br/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="salesOrderNumber"
        min-width="150"
        label="Sales Order Number"
        sortable="custom"

      >
        <template v-slot="scope">
                <span style="font-weight: 900;color#000">
                {{ scope.row.salesOrderNumber }}
                </span>
        </template>
      </el-table-column>



      <el-table-column  v-if="showFactory" prop="warehouse" min-width="140" label="Warehouse">
      </el-table-column>

      <el-table-column
        v-if="showFactory"
        label="Status"
        width="160"
        prop="id">
        <template v-slot="scope">
          <el-tag :type="getStatusType(scope.row)" size="small">
            {{ getStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column  v-if="showFactory" prop="consigneeName" min-width="140" label="Consignee Name">
      </el-table-column>

      <el-table-column  v-if="showFactory" prop="consigneeEmail" min-width="140" label="Consignee Email">
      </el-table-column>

      <el-table-column  v-if="showFactory" prop="consigneePhone" min-width="140" label="Consignee Phone">
      </el-table-column>

      <el-table-column  v-if="showFactory" prop="consigneeAddress" min-width="170" label="Consignee Address">
      </el-table-column>
      <el-table-column
        v-if="showFactory"
        label="Expected Quantity"
        width="160"
        prop="id">
        <template v-slot="scope">
          {{ sumExpectedQuantity(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showFactory"
        label="Actual quantity"
        width="160"
        prop="id">
        <template v-slot="scope">
          <!-- 同样比较两值，不等则显示红色 -->
          <span :style="{
            color: (
                  sumExpectedQuantity(scope.row) !== sumActualQuantity(scope.row) &&  // 两值不一致
                  sumActualQuantity(scope.row) > 0 ) ? 'red' : ''   // 实际值大于0
            }">
            {{ sumActualQuantity(scope.row) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showFactory"
        label="Total Estimated CBM"
        width="160"
        prop="id">
        <template v-slot="scope">
          {{ sumExpectedCbm(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showFactory"
        label="Total Actual CBM"
        width="160"
        prop="id">
        <template v-slot="scope">
          <!-- 同样比较两值，不等则显示红色 -->
          <span :style="{
            color: (
                  sumExpectedCbm(scope.row) !== sumActualCbm(scope.row) &&  // 两值不一致
                  sumActualCbm(scope.row) > 0 ) ? 'red' : ''   // 实际值大于0
            }">
            {{ sumActualCbm(scope.row) }}
          </span>
        </template>
      </el-table-column>



      <el-table-column
        v-if="showFactory"
        label="Create Date"
        min-width="120" show-overflow-tooltip
        prop="createTime">
        <template v-slot="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="showCheckbox && !showFactory"
        sortable="custom"
        label="Status"
        width="160"
        prop="status">
        <template v-slot="scope">
                <span @click="showTask(scope.row.orderTaskRespVOS,scope.$index)" style="text-decoration: underline;cursor: pointer;">
                {{ scope.row.status }}
                </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCheckbox && !showFactory"
        label="Process"
        width="150"
        prop="bookedLines">
        <template v-slot="scope">
          <el-progress v-if="scope.row.orderTaskRespVOS.length>0" :stroke-width="13" :percentage="
                parseInt(scope.row.orderTaskRespVOS.filter(item=>item.status==2).length/scope.row.orderTaskRespVOS.length*100)
                ">
          </el-progress>
          <span style="position: absolute;
                  top: 3px;
                  left: 35px;
                  color: white;">
              {{ scope.row.orderTaskRespVOS.filter(item=>item.status==2).length}}/{{
              scope.row.orderTaskRespVOS.length}}
              </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!showFactory"
        sortable="custom"
        width="150"
        prop="category"
        label="Category"
      >
        <template v-slot="scope">
          <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.category }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!showFactory"
        prop="soldToName"
        label="Sold To Name"
        min-width="140"
      >
        <template v-slot="scope">
          <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.soldToName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!showFactory"
        prop="soldToNumber"
        min-width="140"
        label="Sold To Number">
      </el-table-column>

      <el-table-column
        v-if="!showFactory"
        prop="shipToName"
        min-width="140"
        label="Ship To Name">
        <template v-slot="scope">
          <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.shipToName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!showFactory"
        prop="shipToNumber"
        min-width="140"
        label="Ship To Number">
      </el-table-column>

      <el-table-column
        v-if="!showFactory"
        sortable="custom"
        prop="customerPoNumber"
        min-width="160"
        label="Customer PO Number">
      </el-table-column>
      <el-table-column
        v-if="!showFactory"
        sortable="custom"
        prop="destinationDeliveryDate"
        label="Destination Delivery Date"
        min-width="170">
        <template v-slot="scope">
          {{ scope.row.destinationDeliveryDate?scope.row.destinationDeliveryDate[0]+'-'+scope.row.destinationDeliveryDate[1]+'-'+scope.row.destinationDeliveryDate[2]:'' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="etd"
        width="100"
        v-if="showCheckbox && !showFactory"
        label="ETD"
      >
        <template v-slot="scope">
          {{ scope.row.shipmentRes&&scope.row.shipmentRes.length>0?parseTime(scope.row.shipmentRes[0].etd):'' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="eta"
        label="ETA"
        v-if="showCheckbox && !showFactory"
        width="100"
      >
        <template v-slot="scope">
          {{ scope.row.shipmentRes&&scope.row.shipmentRes.length>0?parseTime(scope.row.shipmentRes[0].eta):'' }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        prop="atd"
        label="ATD"
        v-if="showCheckbox && !showFactory"
        width="100"
      >
        <template v-slot="scope">
          {{ scope.row.shipmentRes&&scope.row.shipmentRes.length>0?parseTime(scope.row.shipmentRes[0].atd):'' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="ata"
        width="100"
        v-if="showCheckbox && !showFactory"
        label="ATA"
      >
        <template v-slot="scope">
          {{ scope.row.shipmentRes&&scope.row.shipmentRes.length>0?parseTime(scope.row.shipmentRes[0].ata):'' }}
        </template>
      </el-table-column>
      <el-table-column
        width="60"
        label=""
        v-if="deleteShow && !showFactory"
      >
        <template v-slot="scope">
          <el-button type="danger"  @click="deleteSO(scope.row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>



    </el-table>



    <el-drawer
      :modal="false"
      :title="title"
      :visible.sync="drawer"
      direction="rtl">

      <div class="cardx" v-for="h in taskList">

        <div class="status1Div">
            <span v-if="showTaskStatus(h)!=''"
                  class="status2" :class="[showTaskStatus(h)=='Possible' ? 'color2' : ''
            , showTaskStatus(h)=='Finished' ? 'color1' : ''
            , showTaskStatus(h)=='Urgent' ? 'color3' : ''
            , showTaskStatus(h)=='Overdue' ? 'color4' : '']">
                {{showTaskStatus(h)}}
            </span>
        </div>
        <div class="order" style="margin-bottom: 5px;">Order:{{ h.orderNumber }}</div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>
        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==2">Complete Date：{{ parseTime(h.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Urgent Date：{{ parseTime(h.urgentDate) }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Due Date：{{ parseTime(h.dueDate) }}</div>
        <div style="margin-bottom: 5px; float: right;cursor: pointer;">

          <el-popover
            placement="top-start"
            title=""
            width="200"
            trigger="hover"
            content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" v-if="(showTaskStatus(h)=='Overdue'||showTaskStatus(h)=='Urgent')" class="el-icon-message"></i>
          </el-popover>
          &nbsp;
          <i v-show="h.status==1" @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i>
          <i v-show="h.status==2" @click="viewTask(h)" style="cursor: pointer;" class="el-icon-view"></i>
        </div>
        <div style="clear: both;"></div>
      </div>

    </el-drawer>
  </div>
</template>
<script>

import ItemTable  from "./items-table.vue";
import Document  from "./document.vue";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getTenantId} from "@/utils/auth"

export default {
  name: "Table",
  props:{
    tableHeight:{
      type: Number,
    },
    showCheckbox:{
      type: Boolean,
    },
    tableData:{
      type:Array
    },
    containerMap:{
      type:Object
    },
    showPlusIcon:{
      type:Boolean
    },
    deleteShow:{
      type:Boolean
    },
    showOtherTabs:{
      type:Boolean,
      default:true
    },
    showFactory:{
      type:Boolean,
      default:false
    }
  },
  components: {
    ItemTable,Document
  },
  data() {
    return {
      listQuery:{
        sortField:'',
        sortRules:'',
      },
      multipleSelection:[],
      order:{},
      containerStatus:{
        "BDAR": "Arrived",
        "DLPT": "Departure",
        "STCS": "Gate Out",
        "GTOT": "Import to Consignee",
        "RCVE": "Return Empty",
        "STSP": "Empty Pick up",
        "GITM": "Gate In",
        "DSCH": "Discharge",
        "LOBD": "Load Board"
      },
      otherMilestones: {
        "-1":"Update",
        "0":"CancelShipment",
        "1":"Draft",
        "2":"Submit Booking",
        "3":"Booking Accept",
        "4":"Booking Confirmation",
        "5":"GATE OUT EMPTY",
        "6":"GateIn",
        "7":"Shipping Instructions",
        "8":"Shipped",
        "9":"BLIssued",
        "10":"Arrived",
        "11":"DeparturePOD",
        "12":"Delivered",
        "13":"ArrivalInlandTerminal",
        "14":"Completed",
        "18":"Departure POL",
        "19":"Arrival POD",
        "20":"Custom clearance",
        "21":"Delivery",
        "22":"Empty Return",
      },
      orderIndex:0,
      drawer:false,
      taskList:[],
      title:'',
      form:{},
      view:false,
      showFactory:false,
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        for(var i=0;i<this.tableData.length;i++){
          this.$set(this.tableData[i], 'key', 'first'+this.tableData[i].id);
        }
      },
    },
  },
  mounted(){

    var tenantId = getTenantId()
    var tenantDatas = this.getDictDatas(DICT_TYPE.PUSH_TO_NINGBO_WMS_TENANT)
    //指定租户查看列  多显示工厂信息 ,隐藏不必要的列
    if(tenantDatas && tenantId != null){
        for (var tenants of tenantDatas) {
            if (tenants.label == 'tenantIds' && tenants.value?.split(',').map(item => item.trim()).includes(tenantId)) {
                this.showFactory = true
            }
        }
    }
    for(var i=0;i<this.tableData.length;i++){
      this.$set(this.tableData[i], 'key', 'first'+this.tableData[i].id);
    }
  },
  methods:{
    sortChange(e) {
      console.log(e,"sort1111111111111")
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa")
      console.log(e)

      switch (e.order) {
        case 'ascending':
          this.listQuery.sortRules = 'ASC'
          break
        case 'descending':
          this.listQuery.sortRules = 'DESC'
          break
        default:
          this.listQuery.sortRules = 'NONE'
          break
      }
      this.listQuery.sortField = e.prop
      this.$emit('sortRulesParam', this.listQuery.sortRules, this.listQuery.sortField);
      /*            switch (e.prop) {
                    case 'balance':
                      this.listQuery.sortField = 'balance'
                      break
                    case 'consumptionSum':
                      this.listQuery.sortField = 'consumption_sum'
                      break
                    default:
                      this.listQuery.sortField = null
                      break
                  }*/

      // this.getList()
    },

    updateSOItem(data){
      var index=-1;
      for(var i=0;i<this.tableData.length;i++){
        if(data.data.soId==this.tableData[i].id){
          index=i
          break;
        }
      }

      for(var key in data.data){
        this.tableData[index].soItemRespVOS[data.index][key]=data.data[key]
      }
//                arr[0]=JSON.parse(JSON.stringify(data.data))
      //arr[0].qty=1

    },
    parseTimeToZ1(timestamp) {
      console.log(timestamp,timestamp)
      if(!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
    },
    showTaskStatus(h){
      if(h.status==0){
        return ''
      }else if(h.status==1){
        if(Date.now()>h.dueDate){
          return 'Overdue'
        }else if(Date.now()>h.urgentDate){
          return 'Urgent'
        }
        return 'Possible'
      }else if(h.status==2){
        return 'Finished'
      }
    },
    showTask(list,index){
      this.orderIndex=index
      this.drawer=true
      this.taskList=list
      if(list.length>0){
        this.title=list[0].orderNumber
      }
    },
    checkSelectable(row, index) {
      // 当showFactory为true时，允许选择所有行
      if (this.showFactory) {
        return true;
      }
      // 否则只允许选择没有shipmentRes的行
      return row.shipmentRes.length==0;
    },
    toOrder(po){
      window.open('/order/sales-order?orderNumber='+po)
    },
    getshippedTue(data){
      var count=0
      for(var i=0;i<data.length;i++){
        count+=this.containerMap[data[i].containerType]*data[i].numbers
      }
      return count
    },
    tableRowClassName({row, rowIndex}) {
      if(this.showCheckbox){
        if (rowIndex%2==0) {
          return 'shuang-row';
        } else {
          return 'dan-row';
        }
      }

      return '';
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addSO(row){
      this.$emit('addSO',row)
    },
    deleteSO(row){
      console.log(row)
      this.$emit('deleteSO',row)
    },
    showStatus(data) {
      if(data.status==1){
        return 'Cancel'
      }
      console.log(data)
      if(data.shipmentContainerStatusRes.length==0){
        function compare(){
          return function(a,b){
            var value1 = a["status"];
            var value2 = b["status"];
            return parseInt(value1) - parseInt(value2);
          }
        }
        console.log(data)
        var arr=JSON.parse(JSON.stringify(data.shipmentStatusList))
        arr.sort(compare())
        return this.otherMilestones[arr[arr.length-1].status]
      }
      if(data.shipmentContainerStatusRes.length>0){
        var move=data.shipmentContainerStatusRes[data.shipmentContainerStatusRes.length-1]
        if(data.carrier=='TSHG'){
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
        }else{
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
        }
      }
    },
    handleTask(task){
      if(task.taskName=='Carrier Booking'){
        this.multipleSelection=[this.tableData[this.orderIndex]]
        console.log('chooseCarrier')
        this.$emit('chooseCarrier', task.orderId);
        //this.$router.push("/shipment/create?soIds="+JSON.parse(task.jsonData).orderId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Container stuffing'){
        this.$router.push("/shipment/clp-so");
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }if(task.taskName=='Vessel Departure'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Arrival'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }
    },
    viewTask(task){
      if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$alert('Booking Number:'+JSON.parse(task.jsonData).bookingNumber, 'Booking Confirmation', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Container stuffing'){
        this.$router.push("/shipment/clp-so");
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }if(task.taskName=='Vessel Departure'){
        this.$alert('ATD:'+JSON.parse(task.jsonData).atd, 'Vessel Departure', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Arrival'){
        this.$alert('ATA:'+JSON.parse(task.jsonData).atd, 'Vessel Arrival', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }
    },
    sumExpectedQuantity(row){
      return row.soItemRespVOS.reduce((total, item) => {
        // 若item.qty不存在，默认加0
        const qty = parseInt(item.qty || 0, 10); // 第二个参数10表示十进制，避免意外解析
        return total + qty;
      }, 0); // 初始值为0
    },
    sumActualQuantity(row){

      return row.soItemRespVOS.reduce((total, item) => {
        // 若item.qty不存在，默认加0
        return total + (item.outboundQty || 0);
      }, 0); // 初始值为0
    },

    sumExpectedCbm(row){
      return row.soItemRespVOS.reduce((total, item) => {
        // 计算每个商品的预计CBM：长×宽×高×订购数量
        const masterCartonQty = item.masterCartonQty || 0;
        const masterCartonCbm = item.masterCartonCbm || 0;
        const qty = parseInt(item.qty || 0, 10); // 第二个参数10表示十进制，避免意外解析

        // 避免除以0的情况
        let volumeCbm = 0;
        if (masterCartonQty > 0) {
          volumeCbm = (masterCartonCbm / masterCartonQty) * qty;
        }

        // 保持数值类型进行计算
        return total + volumeCbm;
      }, 0).toFixed(3); // 初始值为0，最后统一保留3位小数
    },
    sumActualCbm(row){
      var cbm = row.soItemRespVOS.reduce((total, item) => {
        // 求和所有商品的实际CBM值
        return total + (item.outboundCbm || 0);
      }, 0); // 初始值为0
      if(cbm){
        return cbm.toFixed(3);
      }
      return 0;
    },
    getStatus(row){
      // Check if any item has outboundQty (Outbound status)
      const anyOutbound = row.soItemRespVOS.some(item => item.outboundQty > 0);

      // Check if packingStatus is not 1 or 0 (Waiting for Packing)
      const hasInvalidPackingStatus = row.soItemRespVOS.some(item => item.packingStatus !== 1 && item.packingStatus !== 0);

      // Check if all items have packingStatus = 1 (completed)
      const allCompleted = row.soItemRespVOS.every(item => item.packingStatus === 1);

      // Check if any item has packingStatus = 1 (completed)
      const anyCompleted = row.soItemRespVOS.some(item => item.packingStatus === 1);

      if (anyOutbound) {
        return 'Already Outbound'; //已出库
      } else if (hasInvalidPackingStatus) {
        return 'Waiting for Packing'; //待定捡货
      } else if (allCompleted) {
        return 'Picking Completed'; //捡货已完成
      } else if (anyCompleted) {
        return 'Partially Picked'; //部分捡货完成
      } else {
        return 'Picking in Progress'; //捡货中
      }
    },
    getStatusType(row){
      // Check if any item has outboundQty (Outbound status)
      const anyOutbound = row.soItemRespVOS.some(item => item.outboundQty > 0);

      // Check if packingStatus is not 1 or 0 (Waiting for Packing) 待定捡货
      const hasInvalidPackingStatus = row.soItemRespVOS.some(item => item.packingStatus !== 1 && item.packingStatus !== 0);

      // Check if all items have packingStatus = 1 (completed)
      const allCompleted = row.soItemRespVOS.every(item => item.packingStatus === 1);

      // Check if any item has packingStatus = 1 (completed)
      const anyCompleted = row.soItemRespVOS.some(item => item.packingStatus === 1);

      if (anyOutbound) {
        return 'success'; // Green color for outbound
      } else if (hasInvalidPackingStatus) {
        return 'info'; // Blue color for waiting
      } else if (allCompleted) {
        return 'success'; // Green color for completed
      } else if (anyCompleted) {
        return 'warning'; // Orange color for Partially Picked
      } else {
        return 'info'; // Blue color for in progress
      }
    },
  }
}
</script>
<style scoped>

.cardx{
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border:1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}
.status1Div,.order,.taskName,.date{
  float: left;
  margin-left: 15px;
}
.title{
  border: 5px;
}
p{
  margin: 0px;
}
.self-step1:not(:first-child):before{
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
}
.status2{

  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}
.color1{
  color: #13854e;
  background-color:#d6ede2;
}
.color2{
  color: #2d86ba;
  background-color:#ceecfd;
}
.color3{
  color: #e6a23c;
  background: #fdf6ec;
}
.color4{
  color: #f56c6c;
  background: #fef0f0;
}
</style>
