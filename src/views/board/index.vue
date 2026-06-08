<template>
  <div
    class="app-container"
    style="
      width: calc(100%);
      padding:20px;
      margin: 0 auto;
      box-shadow: none;
    "
  >
  <el-card class="box-card" style="background: #fff;width: calc(50% - 10px);float: left;" :style="{'height':height+'px'}">
  <div slot="header" class="clearfix">
    <span style="font-size: 18px;">In progress</span>

    <span style="margin-left: 20px;cursor: pointer;" @click="query('Possible')" :class="page1.statuskey=='Possible'?'border2':''" class="status1 color2">Possible</span>
    <span style="margin-left: 20px;cursor: pointer;" @click="query('Urgent')" :class="page1.statuskey=='Urgent'?'border3':''" class="status1 color3">Urgent</span>
    <span style="margin-left: 20px;cursor: pointer;" @click="query('Overdue')" :class="page1.statuskey=='Overdue'?'border4':''" class="status1 color4">Overdue</span>
  </div>
<div style="padding: 20px;" v-loading="page1.loading">
  <el-empty v-show="inProcessList.length==0"></el-empty>
  <div v-show="inProcessList.length>0" :style="{'height':(height-240)+'px'}" style="overflow: auto;" >
  <div v-for="o in inProcessList" :key="o" class="cardx">

    <div class="status1Div">
      <span v-if="showTaskStatus(o)!=''"
      class="status1" :class="[showTaskStatus(o)=='Possible' ? 'color2' : ''
      , showTaskStatus(o)=='Urgent' ? 'color3' : ''
      , showTaskStatus(o)=='Overdue' ? 'color4' : '']">
        {{showTaskStatus(o)}}
      </span>
    </div>
    <div class="order" style="margin-bottom: 5px;">Order：{{ o.orderNumber }}</div>
    <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ o.taskName }}</div>
    <div class="date" style="margin-bottom: 5px;" v-if="o.status==1">Urgent Date：{{ parseTime(o.urgentDate) }}</div>
    <div class="date" style="margin-bottom: 5px;" v-if="o.status==1">Due Date：{{ parseTime(o.dueDate) }}</div>
    <div style="margin-bottom: 5px; float: right;">
      <span v-if="o.jsonData!=null&&o.taskName=='Inspection Date'" style="color: red;padding-right: 15px;">
        QC Approve:Failed <span @click="viewQcResult(o)" style="cursor: pointer;">(Details)</span>
      </span>


      <span v-if="o.jsonData!=null&&o.taskName=='Booking Order'" style="color: red;padding-right: 15px;">
        QC Approve:Failed Reason:{{JSON.parse(o.jsonData).reason}}
      </span>


      <i @click="handleTask(o)" style="cursor: pointer;" class="el-icon-edit"></i>
    </div>
    <div style="clear: both;"></div>
  </div>
  </div>
  <pagination
  background
  v-show="page1.total > 0"
        :total="page1.total"
        :page.sync="page1.pageNo"
        :limit.sync="page1.pageSize"
        @pagination="queryTask1"
        :page-sizes="[10, 20, 50]"/>
</div>
</el-card>
<el-card class="box-card" style="background: #fff;width: calc(50% - 10px);float: left;margin-left: 20px;" :style="{'height':height+'px'}">
  <div slot="header" class="clearfix">
    <span style="font-size: 18px;">Finished</span>
  </div>
  <div style="padding: 20px;" v-loading="page2.loading">
    <el-empty v-show="finishedList.length==0"></el-empty>

    <div v-show="finishedList.length>0" :style="{'height':(height-240)+'px'}" style="overflow: auto;" >
  <div v-for="o in finishedList" :key="o.id" class="cardx">

    <div style="margin-bottom: 5px; float: left;cursor: pointer;">
      <i v-if="!expanded[o.id]" @click="toggleDetails(o.id,o)" class="el-icon-arrow-right"></i>
      <i v-if="expanded[o.id]" @click="toggleDetails(o.id,o)" class="el-icon-arrow-down"></i>
    </div>
    <div class="status1Div">
      <span class="status2">Finished</span>
    </div>
    <div class="order" style="margin-bottom: 5px;">Order：{{ o.orderNumber }}</div>
    <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ o.taskName }}</div>
    <div class="date" style="margin-bottom: 5px;">Complete Date：{{ parseTime(o.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</div>
    <div style="margin-bottom: 5px; float: right;cursor: pointer;">
      <i v-if="o.taskName=='QC Approve'" @click="viewQcResult(o)" class="el-icon-view"></i>
      <i v-if="o.taskName!='QC Approve'&&o.jsonData!=null" @click="viewTask(o)" class="el-icon-view"></i>
    </div>
    <div style="clear: both;"></div>


    <el-collapse-transition>
        <div v-show="expanded[o.id]" style="padding: 10px 20px 10px 30px;">
          <div style="margin-bottom: 10px;">Task History</div>

          <div v-for="h in o.history?o.history.filter(item=>item.id!=o.id):[]">

            <div class="cardx">

              <div class="status1Div">
                <span class="status2">Finished</span>
              </div>
              <div class="order" style="margin-bottom: 5px;">Order:{{ h.orderNumber }}</div>
              <div class="taskName" style="margin-bottom: 5px;">Task Name:{{ h.taskName }}</div>
              <div class="date" style="margin-bottom: 5px;">Complete Date:{{ parseTime(h.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</div>
              <div style="margin-bottom: 5px; float: right;cursor: pointer;">

                <i v-if="h.taskName=='QC Approve'" @click="viewQcResult(h)" class="el-icon-view"></i>
                <i v-if="h.taskName!='QC Approve'&&h.jsonData!=null" @click="viewTask(h)" class="el-icon-view"></i>

              </div>
              <div style="clear: both;"></div>
            </div>

          </div>
        </div>
      </el-collapse-transition>

  </div>
</div>
  <pagination
  background
  v-show="page2.total > 0"
        :total="page2.total"
        :page.sync="page2.pageNo"
        :limit.sync="page2.pageSize"
        @pagination="queryTask2"
        :page-sizes="[10, 20, 50]"/>
</div>
</el-card>


<el-dialog :title="title" width="600px" :visible.sync="crdFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Cargo handover date" label-width="180px">
      <el-date-picker
      v-model="form.crd"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      placeholder="Cargo handover date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="crdFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="inspectionFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Inspection Date" label-width="180px">
      <el-date-picker format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      v-model="form.inspectionDate"
      type="date"
      placeholder="Inspection Date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="inspectionFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="inspectionFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Inspection Date" label-width="180px">
      <el-date-picker
      v-model="form.inspectionDate"
      type="date"
      placeholder="Inspection Date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="inspectionFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="600px" :visible.sync="qcFormVisible">
  <el-form :disabled="view" :model="form" size="mini">

    <el-form-item label="Quality Approval Results" label-width="180px">
      <el-select v-model="form.approveResult">
        <el-option label="Pass" value="Pass"></el-option>
        <el-option label="Failed" value="Failed"></el-option>
        <el-option label="Exemption from inspection" value="Exemption from inspection"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Approve method" label-width="180px">
      <el-select v-model="form.approveMethod">
        <el-option label="Inspection Report" value="Inspection Report"></el-option>
        <el-option label="Email" value="Email"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if='view' label="Approve File" label-width="180px">
      <a :href="downloadLink" style="text-decoration: underline; padding-left: 15px;">file</a>
    </el-form-item>

    <el-form-item v-if='!view' label="Approve File" label-width="180px">

      <el-upload
        action=""
        :auto-upload="false"
        :on-change="beforeUpload"
      >
        <el-button size="small" type="primary">File</el-button>
      </el-upload>
  </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="qcFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="800px" :visible.sync="bookingFormVisible">
  <el-table
      :data="itemList"
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="Product Name"
        >
      </el-table-column>
      <el-table-column
        prop="productCode"
        label="Product Code"
        >
      </el-table-column>
      <el-table-column
        prop="totalVolume"
        label="Total Volume(CBM)"
        >
        <template v-slot="scope">
          <el-input v-model="scope.row.totalVolume" />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalWeight"
        label="Total Weight(KG)"
        width="120">
        <template v-slot="scope">
          <el-input v-model="scope.row.totalWeight" />
        </template>
      </el-table-column>
      <el-table-column
        prop="requested"
        :label="itemList.length > 0 && itemList[0].requestUnit ? 'Requested (' + itemList[0].requestUnit +')' : 'Requested'"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bookedQty"
        :label="itemList.length > 0 && itemList[0].requestUnit ? 'Booked Qty (' + itemList[0].requestUnit +')' : 'Booked Qty'"
        width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.bookedQty" @input="changeBookedQty(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="bookingFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="600px" :visible.sync="pickupFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Empty Pick up" label-width="180px">
      <el-date-picker
      v-model="form.emptyPickupDate"
      type="date"
      placeholder="Empty Pick up">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="pickupFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="containerStuffingFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Container stuffing date" label-width="180px">
      <el-date-picker
      v-model="form.containerStuffingDate"
      type="date"
      placeholder="Container stuffing date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="containerStuffingFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="customClearanceFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Origin Customs Clearance date" label-width="220px">
      <el-date-picker
      v-model="form.customClearanceDate"
      type="date"
      placeholder="Origin Customs Clearance date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="customClearanceFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="departureConfirmFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Vessel departure confirm" label-width="180px">
      <el-date-picker
      v-model="form.eventTime"
      type="date"
      placeholder="Vessel departure confirm">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="departureConfirmFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>
<el-dialog :title="title" width="600px" :visible.sync="arrivalConfirmFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Vessel arrival confirm" label-width="180px">
      <el-date-picker
      v-model="form.eventTime"
      type="date"
      placeholder="Vessel arrival confirm">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="arrivalConfirmFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<InboundPopup :orderId="task.orderId" :view="view" @close-inbound-popup="closeInboundPopup" v-if="showInboundPopup"></InboundPopup>
<BookPopup :orderId="task.orderId" :view="view" :type="showBookPopupType" @close-book-popup="closeBookPopup" v-if="showBookPopup"></BookPopup>
<OrderPopup :orderId="task.orderId" :view="view"   @close-order-popup="closeOrderPopup" v-if="showOrderPopup"></OrderPopup>

  </div>
</template>

<script>
import { getUserProfile } from "@/api/system/user";
import { getListByCondition } from "@/api/order/item"
import { getTaskPage,updateTask,getTaskList } from "@/api/order/task";
import InboundPopup from "../board/inbound/index.vue";
import BookPopup from "../board/book/index.vue";
import OrderPopup from "../board/order/index.vue";

export default {
  name: "Board",
  components: {
    InboundPopup,BookPopup,OrderPopup
  },
  data() {
    return {
      showOrderPopup: false,
      showInboundPopup: false,
      showBookPopupType: 1,
      showBookPopup: false,
      inProcessList:[],
      form:{},
      dialogFormVisible:false,
      pickupFormVisible:false,
      bookingFormVisible:false,
      crdFormVisible:false,
      inspectionFormVisible:false,
      customClearanceFormVisible:false,
      qcFormVisible:false,
      containerStuffingFormVisible:false,
      departureConfirmFormVisible:false,
      arrivalConfirmFormVisible:false,
      title:'',
      finishedList:[],
      height:0,
      expanded:{},
      view:true,
      task:{},
      user:{},
      page1:{
        pageNo: 1,
        total:0,
        loading:false,
        pageSize: 10,
        status:1,
        statuskey:'',
        type:'1'
      },
      page2:{
        pageNo: 1,
        loading:false,
        total:0,
        pageSize: 10,
        status:2,
        lastFinished:true,
        type:'1'
      },
      base64String:'',
      downloadLink:'',
      itemList:[]
    };
  },
  created() {
    getUserProfile().then(response => {
        this.user = response.data;
    });
    this.queryTask1()
    this.queryTask2()
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 165;
  },
  methods: {
    closeOrderPopup(){
      if(this.view) {
        this.showOrderPopup = false
      } else {
        this.showOrderPopup = false
        this.getList();
        this.getTaskNames()
        this.drawer = false
      }
    },
    closeBookPopup(){
      if(this.view) {
        this.showBookPopup = false
      } else {
        this.showBookPopup = false
        this.queryTask1()
        this.queryTask2()
      }
    },
    closeInboundPopup(){
      if(this.view) {
        this.showInboundPopup = false
      } else {
        this.showInboundPopup = false
        this.queryTask1()
        this.queryTask2()
      }
    },
    changeBookedQty(row){
      console.log(row)
      this.calculateWeight(row)
      this.calculateVolume(row)
    },
    calculateWeight(row){
      if(row.weight && row.bookedQty){
        const weightKg = (row.weight * row.bookedQty).toFixed(3)
        row.totalWeight = weightKg
        return weightKg;
      }
      return row.totalWeight;
    },
    calculateVolume(row ) {
      if(row.length && row.width && row.height && row.bookedQty){
        // 计算体积（单位：立方厘米）
        const volumeCm3 = row.length * row.width * row.height;
        // 转换为立方米
        const volumeCbm = ((volumeCm3 / 1000000) * row.bookedQty).toFixed(3);
        row.totalVolume = volumeCbm;
        return volumeCbm;
      }
      return row.totalVolume;
    },
    query(statuskey){
      if(this.page1.statuskey==statuskey){
        this.page1.statuskey=''
      }else{
        this.page1.statuskey=statuskey
      }
      this.queryTask1()
    },
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.form.file = reader.result;
          resolve(); // 上传之前的处理完成后调用 resolve()
        };

        reader.readAsDataURL(file.raw);
      });
    },
    queryTask1(){
      this.page1.loading=true
      getTaskPage(this.page1).then((res)=>{
        this.inProcessList=res.data.list==null?[]:res.data.list
        this.page1.total=res.data.total
        this.page1.loading=false
      })
    },
    queryTask2(){
      this.page2.loading=true
      getTaskPage(this.page2).then((res)=>{
        this.finishedList=res.data.list==null?[]:res.data.list
        this.page2.total=res.data.total
        this.page2.loading=false
      })
    },
    toggleDetails(index,o){
      console.log(index)
      console.log(o)
      console.log(this.expanded)
      console.log(this.expanded[index])

      if(this.expanded[index]==undefined){
        console.log(this.user)
        console.log(o)

        getTaskList({orderNumber:o.orderNumber,status:2,partyId:this.user.deptId}).then((res)=>{

          this.$set(o, 'history', res.data);
        })
      }
      this.$set(this.expanded, index, !this.expanded[index]);

    },
    showTaskStatus(h){
      if(h.status==0){
        return ''
      }else if(h.status==1){

        if(Date.now()>h.dueDate&&h.dueDate!=null){
          return 'Overdue'
        }else if(Date.now()>h.urgentDate&&h.urgentDate!=null){
          return 'Urgent'
        }
        return 'Possible'
      }else if(h.status==2){
        return 'Finished'
      }
    },
    handleTask(task){
      this.view=false
      this.task=task
      this.form={}
      this.title=task.orderNumber+'['+task.taskName+']'
      if(task.taskName=='Update Cargo handover date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='QC Approve'){
        this.qcFormVisible=true
      }else if(task.taskName=='Booking Order'){
        if(this.$auth.hasPermi("booking:create")){
          this.bookingFormVisible=true
          getListByCondition({orderId:task.orderId}).then((res)=>{
            this.itemList=res.data
          })
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Validate shipper booking'){
        if(this.$auth.hasPermi("booking:query")){
          this.$router.push("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
        console.log("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId)
      }else if(task.taskName=='Carrier Booking'){
        if(this.$auth.hasPermi("shipment:create")){
          this.$router.push("/shipment/create?ids="+JSON.parse(task.jsonData).bookingId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Booking Confirmation'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        if(this.$auth.hasPermi("shipment:clp:create")){
          this.$router.push("/shipment/clp/add?shipmentId="+JSON.parse(task.jsonData).shipmentId+'&bookingNumber='+JSON.parse(task.jsonData).bookingNumber);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Vessel Departure'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='HBL Release'){
        if(this.$auth.hasPermi("shipment:hbl:create")){
          this.$router.push("/shipment/Hbl?shipmentId="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Vessel Arrival'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Empty Return'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
        this.showInboundPopup = true;
      }else if(task.taskName=='Booking order accept'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Booking confirmation'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Vessel departure confirm'){
        this.departureConfirmFormVisible=true
      }else if(task.taskName=='Vessel arrival confirm'){
        this.arrivalConfirmFormVisible=true
      }else if(task.taskName=='SI draft by shipper'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }else if(task.taskName=='VGM draft by shipper'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }else if(task.taskName=='SI submit to carrier'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='VGM submit to carrier'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }






      //
    },
    viewQcResult(task){
      this.qcFormVisible=true
      this.view=true
      this.title=task.orderNumber+'['+task.taskName+']'
      this.form=JSON.parse(task.jsonData)
      console.log(this.form.file)
      const base64String = this.form.file.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Create Blob using the provided MIME type from the base64 prefix
      const mimeType = this.form.file.split(',')[0].split(':')[1].split(';')[0];
      const blob = new Blob([byteArray], { type: mimeType });

      // Create download link
      this.downloadLink = URL.createObjectURL(blob);
      console.log(this.downloadLink);
    },
    viewTask(task){
      this.view=true
      this.task=task
      this.title=task.orderNumber+'['+task.taskName+']'
      if(task.jsonData!=null&&task.jsonData!='') {
        this.form=JSON.parse(task.jsonData)
      }
      if(task.taskName=='Update Cargo handover date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='Booking Order'){
        this.$router.push("/shipment/booking-detail?id="+this.form.bookingId);
      }else if(task.taskName=='Validate shipper booking'){
        this.$alert('Pass', 'Result', {
          confirmButtonText: 'Ok',
          callback: action => {

          }
        });
      }else if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$alert('Date:'+JSON.parse(task.jsonData).date+'<br/>'+'Booking Number:'+JSON.parse(task.jsonData).bookingNumber, 'Booking Confirmation', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        console.log(JSON.parse(task.jsonData))
        this.$router.push("/shipment/clp/detail?id="+JSON.parse(task.jsonData).clpId);
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime+'<br/>'+'Vessel:'+JSON.parse(task.jsonData).vessel
        +'<br/>'+'Voyage:'+JSON.parse(task.jsonData).voyage, 'Gate in', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Vessel Departure'){
        this.$alert('ATD:'+JSON.parse(task.jsonData).atd, 'Vessel Departure', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/Hbl?hblNumber="+JSON.parse(task.jsonData).hblNumber);
      }else if(task.taskName=='Vessel Arrival'){
        this.$alert('ATA:'+JSON.parse(task.jsonData).atd, 'Vessel Arrival', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Return'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Empty Return', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
        this.showInboundPopup = true;
      }else if(task.taskName=='Booking order accept'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Booking confirmation'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Vessel departure confirm'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Vessel departure confirm', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Vessel arrival confirm'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Vessel arrival confirm', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='SI draft by shipper'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }else if(task.taskName=='VGM draft by shipper'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }else if(task.taskName=='SI submit to carrier'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }else if(task.taskName=='VGM submit to carrier'){
        this.$router.push("/shipment/booking-order?moovref="+task.orderNumber);
      }



    },
    submitTask(){
      if(this.task.taskName=='Booking Order'){
        for (var i = 0; i < this.itemList.length; i++) {
            if(this.itemList[i].bookedQty > this.itemList[i].requested){
              this.$notify({
                message: "Book qty exceed requested qty",
                type: "warning",
              });
            }
        }
        var bookData=[{
          orderId:this.task.orderId,
          poNumber:this.task.orderNumber,
          tableData:this.itemList
        }]
        sessionStorage.setItem("bookData", JSON.stringify(bookData));
        this.$router.push("/shipment/booking-create");
      }else{
        if(this.task.taskName=='Vessel departure confirm'||this.task.taskName=='Vessel arrival confirm'){
          console.log('1111')
          this.form.shipmentId = this.task.orderId
          console.log('22222')
        }
        this.task.jsonData=JSON.stringify(this.form)
        updateTask(this.task).then((res)=>{
          this.crdFormVisible=false
          this.inspectionFormVisible=false
          this.qcFormVisible=false
          this.pickupFormVisible=false
          this.containerStuffingFormVisible=false
          this.customClearanceFormVisible=false
          this.departureConfirmFormVisible=false
          this.arrivalConfirmFormVisible=false
          this.queryTask1()
          this.queryTask2()
        })
      }

    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.status1div{
  width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.status1Div,.order,.taskName,.date{
  float: left;
  margin-left: 15px;
}
.cardx{
  background-color: #fff;

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
//#13854e color
//#d6ede2 bg-color
.status1{
    border-radius: 100px;
    padding: 2px 13px;
    font-size: 12px;
    border: 3px solid #fff;
}
.status2{
  color: #13854e;
    background-color:#d6ede2;
    border-radius: 100px;
    padding: 2px 13px;
    font-size: 12px;
}
.border2{
  border-color: #b3d8ff;
}
.border3{
  border-color: #f5dab1;
}
.border4{
  border-color: #fbc4c4;
}
.cardx{
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border:1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}
// @media (max-width: 1024px) {
//   .chart-wrapper {
//     padding: 8px;
//   }
// }
</style>
