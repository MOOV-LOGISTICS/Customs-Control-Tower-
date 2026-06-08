
<template xmlns="">

<div class="app-container" style="width:90%;margin:0 auto;background:#fff;padding:0px 20px">
    <el-tabs v-model="activeName"  @tab-click="handleTabClick" >
    <el-tab-pane label="Raw Data" name="first"></el-tab-pane>
    <el-tab-pane label="IP Data" name="second"></el-tab-pane>
    <el-tab-pane label="Monthly Ticket Summary" name="three"></el-tab-pane>
  </el-tabs>
  <div>
    <el-dialog title="Ip Address" :visible.sync="dialogFormVisible">
      <el-form :model="IpForm">
        <el-form-item label="IP" label-width="120px">
          <el-input v-model="ipEditIp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Login Address" label-width="120px">
          <el-input v-model="IpForm.ipEditAddress" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClickDialogFormVisible">Submit</el-button>
      </div>
    </el-dialog>

  <div style="clear: both"></div>
  </div>


    <transition name="el-zoom-in-center">

      <div style="height: 100%" v-show="activeName=='first'">
        <div   >
          <el-row   :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="3">
              <el-select  filterable @change="handleChange1" clearable v-model="account" placeholder="Customer">
                <el-option v-for="value in poSet"  :label="value" :value="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select  filterable @change="handleChange2" clearable v-model="unreleasedReleased" placeholder="Date"
                          :loading="getDisLoading" loading-text="Loading...">
                <el-option v-for="value in ReleasedSet" :label="value.name" :value="value.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary"  @click="handleChange"><i class="el-icon-search"></i> Search</el-button>
            </el-col>
            <!--      <el-col :span="3" :offset="2">-->
            <!--        <el-button @click="handleExport" v-loading="exportLoading">Export Data</el-button>-->
            <!--      </el-col>-->
          </el-row>
        </div>
            <el-divider></el-divider>
      <el-empty v-if="tableData3.length ===0 && !tableLoading" description="No Data"/>
        <el-table v-loading="tableLoading"
                  height="600px"
                  v-if="tableData3.length"
                  :data="tableData3"  >
            <el-table-column prop="account"label="Account" >
              <template v-slot="scope">
                 <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ scope.row.account }}</div>
              </template>
            </el-table-column>
<!--            <el-table-column prop="tenantName"label="Tenant Name" >
              <template v-slot="scope">
                {{ scope.row.tenantName}}
              </template>
            </el-table-column>-->
            <el-table-column prop="customerName"label="Customer" >
              <template v-slot="scope">
                {{ scope.row.customerName }}
              </template>
            </el-table-column>
            <el-table-column prop="userIp"label="IP" ></el-table-column>
            <el-table-column prop="addressName"label="Login Address" ></el-table-column>
            <el-table-column prop="createTime"label="Login Time(China Time)" ></el-table-column>
        </el-table>
<!--      <el-empty v-if="tableData3.length ===0" description="System under maintenance"/>-->
      <pagination
        v-if="tableData3.length"
        :total="pageForm.lineTotal"
        :page.sync="pageForm.pageNo"
        :limit.sync="pageForm.pageSize"
        :page-sizes="[10, 20, 50]"
        @pagination="report5"
      />
        <div id="main3" v-loading="loading1" v-show="showCharts" style="width:100%;height: 300px;"></div>
    </div>
    </transition>

  <transition name="el-zoom-in-center">

    <div style="height: 100%" v-show="activeName=='second'">
      <div   >
<!--        <el-row>
          <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        </el-row>-->
        <el-row   :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="4">
            <el-select  filterable @change="handleChange2" clearable v-model="ipSelect" placeholder="IP"
                        :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in IpSelectSet" :label="value.userIp" :value="value.userIp"></el-option>
            </el-select>

          </el-col>
          <el-col :span="4">
            <el-select  filterable @change="handleChange2" clearable v-model="ipNullSelect" placeholder="Address is null"
                        :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in IpNullSet" :label="value.name" :value="value.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"  @click="handleChangeIp"><i class="el-icon-search"></i> Search</el-button>
          </el-col>
        </el-row>
      </div>
      <el-empty v-if="tableData1.length ===0 && !tableLoading" description="No Data"/>
      <el-table v-loading="tableLoading"
                height="500px"
                v-if="tableData1.length"
                :data="tableData1"  >
        <el-table-column prop="userIp"label="User Ip" >
          <template v-slot="scope">
            <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ scope.row.userIp }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="loginAddress"label="Login Address" >
          <template v-slot="scope">
            {{ scope.row.loginAddress }}
          </template>
        </el-table-column>
        <el-table-column label="Operations" >
          <template slot-scope="scope">
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">Edit</el-button>
          </template>
        </el-table-column>

        </el-table>
      <pagination
        v-if="tableData1.length"
        :total="pageForm.lineTotal"
        :page.sync="pageForm.pageNo"
        :limit.sync="pageForm.pageSize"
        :page-sizes="[10, 20, 50]"
        @pagination="report5"
      />
    </div>
  </transition>


  <transition name="el-zoom-in-center">
    <div style="height: 100%" v-show="activeName=='three'" v-loading="ticketLoading">
      <el-row :gutter="20" style=" padding-bottom: 30px; padding-top: 5px;">
        <el-col :span="4">
          <el-date-picker
            :clearable="false"
            @change="getTicketData"
            type="month"
            v-model="ticketMonth"
            value-format="yyyy-MM"
            placeholder="">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-select v-model="category" @change="getTicketData" clearable placeholder="Module" filterable>
            <el-option label="Order management" value="Order management"></el-option>
            <el-option label="E Booking" value="E Booking"></el-option>
            <el-option label="smartBoard" value="smartBoard"></el-option>
            <el-option label="Tracking" value="Tracking"></el-option>
            <el-option label="BI" value="BI"></el-option>
            <el-option label="Contract Management" value="Contract Management"></el-option>
            <el-option label="Support" value="Support"></el-option>
          </el-select>

        </el-col>
      </el-row>
      <el-row :gutter="20" style="height: 100px;">
        <el-col :span="6">
          <el-statistic class="status-a"
            group-separator=","
            :precision="0"
            :value="formattedTicketStatus0"
            title="Submitted" ></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic class="status-b"
            group-separator=","
            :precision="0"
            :value="formattedTicketStatus1"
            title="In process" ></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic class="status-c"
            group-separator=","
            :precision="0"
            :value="formattedTicketStatus2"
            title="Rejected" ></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic class="status-d"
            group-separator=","
            :precision="0"
            :value="formattedTicketStatus3"
            title="Solved" ></el-statistic>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col  >
          <div id="tId" style="height:300px"> </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col  >
          <div >
            <el-table
              max-height="250"
              :data="ticketData"
              style="width: 100%">
              <el-table-column
                prop="status"
                label="Status"
                min-width="100">
                <template v-slot="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ getStatusLabel(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="reference"
                label="Reference" show-overflow-tooltip
                min-width="140">
                <template v-slot="scope">
                  {{scope.row.reference}}
<!--                  <el-button @click="detail(scope.row)" type="text">{{scope.row.reference}}</el-button>-->
                </template>
              </el-table-column>
              <el-table-column
                prop="category"
                min-width="120" show-overflow-tooltip
                label="Module">
              </el-table-column>
              <el-table-column
                prop="requester"
                min-width="130" show-overflow-tooltip
                label="Requester">
              </el-table-column>
              <el-table-column
                prop="createTime"
                min-width="130" show-overflow-tooltip
                label="Request Date">
                <template v-slot="scope">
                  {{ parseTime(scope.row.createTime,'{y}-{m}-{d} {h}:{i}:{s}') }}
                </template>
              </el-table-column>

              <el-table-column
                prop="summary" show-overflow-tooltip
                min-width="300"
                label="Summary">
              </el-table-column>

            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </transition>

</div>

</template>
<script>
import {
  poList, lotList, skuList, selectPage, selectPageIp,selectChatsIp,exportExcel, sumData
} from "@/api/bi/loginReport";
import * as echarts from 'echarts';
import { getTenantPage } from "@/api/system/tenant";
import { checkPermi, checkRole } from "@/utils/permission";
import {editIpAddress, IpPoList} from "../../../api/bi/loginReport";
defineCustomElements()
// import {selectChatsIp} from "../../../api/bi/loginReport";
// import {selectPageIp} from "../../../api/bi/loginReport"; // 权限判断函数
import { getTicketReportData } from "@/api/system/supportTicket";

export default {
    name: "loginReport",
  components: {
  },
  data() {
        return{
          category: '',
          ticketMonth: null,
          ticketStatus:{},
          ticketData:[],
          ticketLoading:false,
          statusList: [{"label":"Submitted","value":"0"},
                      {"label":"In process","value":"1"},
                      {"label":"Rejected","value":"2"},
                      {"label":"Solved","value":"3"}],
          conversationList:["user1"],
          dialogVisible: false,
          ipEditAddress:'',
          ipEditIp:'',
          dialogFormVisible:false,
          showCharts:true,
          poSet:[],
          lotSet:[],
          skuSet:[],
          sumAvailableInventoryBox:'' ,
          sumPickedInventoryBox :'' ,
          sumPickedInventoryCarton :'' ,
          sumAllocatedInventoryBox :'' ,
          sumAllocatedInventoryCarton :'' ,
          sumGw2KG :'' ,
          sumAvailableInventoryCarton:'' ,
          EXPSet:[
            {name:"<500 days",value:"1"},
            {name:">700 days",value:"2"},
            {name:"500-600 days",value:"3"},
            {name:"600-700 days",value:"4"}],
          ReleasedSet:[{name:"Within a week",value:"1"},{name:"Within two weeks",value:"2"},{name:"Within a month",value:"3"}],
          sum: 0.0,
          getDisLoading: false,
          bookingStatusList :[],
          supplierList :[],
          unreleasedReleased:'1',
          ipSelect:'',
          IpSelectSet:[],
          IpNullSet:[{name:"null",value:"1"},{name:"not null",value:"0"}],
          ipNullSelect:'1',
          po:'',
          sku:'',
          exp:'',
          lot:'',
          lotNumber: '',
          supplier: '',
          bookingStatus: '',
          vmtAgentName:'',
            activeName:'first',
            tableData1:[{}],
            tableData2:[],
            tableData3:[],
            tableLoading:true,
            pageForm:{
                pageSize:20,
                pageNo:1,
            },
            IpForm:{},
            account:'',
            height:null,
            loading1:false,
            loading2:false,
            loading3:false,
            loading4:false,
            loading5:false,
            tenantMap:{},
            tenantList:[],
            myChart3:null,
            exportLoading:false,
            option3 : {
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              x:'center',
              y:'top',
              data:['Within a week','Within two weeks','Within a month']
            },
            toolbox: {
              show : false,
              orient: 'vertical',
              x: 'right',
              y: 'center',
              feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore : {show: true},
                saveAsImage : {show: true}
              }
            },
            calculable : true,
            xAxis : [
              {
                type : 'category',
                data : [],
                triggerEvent: true,
                interval: 0,
                axisLabel: {
                  interval: 'auto',
                  formatter: function (params) {
                    return params.substring(0,6) + '...'
                  },
                  rotate: 0 // 旋转45度
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'Within a week',
                type:'bar',
                data:[],
                label:{
                  show: true,
                  position: 'top'
                }
              }
              /*          {
                          name:'直接访问',
                          type:'bar',
                          data:[320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                          name:'邮件营销',
                          type:'bar',
                          stack: '广告',
                          data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                          name:'联盟广告',
                          type:'bar',
                          stack: '广告',
                          data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                          name:'视频广告',
                          type:'bar',
                          stack: '广告',
                          data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                          name:'搜索引擎',
                          type:'bar',
                          data:[862, 1018, 964, 1026, 1679, 1600, 1570],
                          // markLine : {
                          //   itemStyle:{
                          //     normal:{
                          //       lineStyle:{
                          //         type: 'dashed'
                          //       }
                          //     }
                          //   },
                          //   data : [
                          //     [{type : 'min'}, {type : 'max'}]
                          //   ]
                          // }
                        },
                        {
                          name:'百度',
                          type:'bar',
                          barWidth : 5,
                          stack: '搜索引擎',
                          data:[620, 732, 701, 734, 1090, 1130, 1120]
                        },
                        {
                          name:'谷歌',
                          type:'bar',
                          stack: '搜索引擎',
                          data:[120, 132, 101, 134, 290, 230, 220]
                        },
                        {
                          name:'必应',
                          type:'bar',
                          stack: '搜索引擎',
                          data:[60, 72, 71, 74, 190, 130, 110]
                        },
                        {
                          name:'其他',
                          type:'bar',
                          stack: '搜索引擎',
                          data:[62, 82, 91, 84, 109, 110, 120]
                        }*/
            ]
          },
        }
	},
	mounted() {
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 298;
    this.report5()
    this.handleChangeIp()
    this.getChatsIp()
    var chartDom3 = document.getElementById('main3');
    this.myChart3 = echarts.init(chartDom3);
    this.myChart3.setOption(this.option3)
    console.log(this.tableData3.length,"this.tableData3.length");
    this.getDisLoading = true
        poList( ).then(response => {
          if(response && response.data){
            console.log(response);
            this.poSet =  response.data.customers
          }
          this.getDisLoading = false
        });
    IpPoList( ).then(response => {
      if(response && response.data){
        console.log(response);
        this.IpSelectSet =  response.data
      }
      this.getDisLoading = false
    });

    this.ticketMonth = (new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2))
	},
	methods: {
    checkPermi,

    getStatusLabel(value) {
      const statusItem = this.statusList.find(item => item.value == value);
      return statusItem ? statusItem.label : 'Error';
    },
    getStatusType(value) {
      switch (value) {
        case '0':
          return '';
        case '1':
          return 'warning';
        case '2':
          return 'danger';
        case '3':
          return 'success';
        default:
          return 'danger';
      }
    },
    getTicketData(val){
      this.ticketLoading = true
      var year = this.ticketMonth.split('-')[0];
      var month = this.ticketMonth.split('-')[1];
      getTicketReportData(year,month,this.category).then(res =>{
        this.ticketData = res.data.list
        this.ticketStatus = res.data.statusCounts
        this.initTiChar()
        this.ticketLoading = false
      })
    },
    handleTabClick(tab, event){
      if(this.activeName=='three'){
        this.getTicketData()
      }

    },
    initTiChar(){
      var myChart = echarts.init(document.getElementById('tId'));

      var data = this.ticketData

      // 处理数据，计算每个category的已解决和未解决数量
      var categories = {};
      data.forEach(item => {
          var isSolved = (item.status === '2' || item.status === '3');
          var category = item.category;
          if (!categories[category]) {
              categories[category] = {
                  solved: 0,
                  unsolved: 0
              };
          }
          if (isSolved) {
              categories[category].solved++;
          } else {
              categories[category].unsolved++;
          }
      });


      // 转换为echarts可以理解的格式
      var chartData = [];
      for (var key in categories) {
          chartData.push({
              name: key,
              value: [categories[key].solved, categories[key].unsolved]
          });
      }

      var barWidth = '60%'
      if(chartData.length ==  1){
        barWidth = '15%'
      }else if(chartData.length ==  2){
        barWidth = '30%'
      }else if(chartData.length ==  3){
        barWidth = '40%'
      }

      // 指定图表的配置项和数据
      var option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          legend: {
              data: ['Solved', 'Unresolved']
          },
          xAxis: {
              type: 'category',
              data: chartData.map(item => item.name),
              splitLine: {
                show: false // 去除网格线
              },
              axisLine: {
                show: false // 这里设置为 false 来去除 x 轴线
              },
              axisLabel: {
                interval: 0, // 设置为 0 以显示所有标签
                show: true, // 显示标签
                   rich: {
                    bold: {
                        fontSize: 16, // 文字大小
                        fontWeight: 'bold',
                        color: '#666666'
                    }
                },
                // 如果需要旋转文字，可以使用 rotate 属性
                rotate: 0, // 旋转的角度
                // 如果需要格式化标签文本，可以使用 formatter 属性
                formatter: function (value, index) {
                    return `{bold|${value}}`;
                }
              }
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: 'Unresolved',
                  type: 'bar',
                  barWidth: barWidth ,
                  stack: 'Total',
                  label: {
                      show: true,
                      formatter: function (params) {
                          // 如果值为0，则不显示标签
                          if (params.value === 0) {
                              return '';
                          }
                          return params.value;
                      }
                  },
                  data: chartData.map(item => item.value[1])
              },
              {
                  name: 'Solved',
                  type: 'bar',
                  barWidth: barWidth ,
                  stack: 'Total',
                  label: {
                      show: true,
                      formatter: function (params) {
                          // 如果值为0，则不显示标签
                          if (params.value === 0) {
                              return '';
                          }
                          return params.value;
                      }
                  },
                  data: chartData.map(item => item.value[0])
              }
          ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      // 调整图表大小以适应容器
      myChart.resize();
    },
    handleExport() {
      this.$modal
        .confirm("Export?")
        .then(() => {
          this.exportLoading = true;


          return exportExcel({
            po:this.po,
            sku: this.sku,
            exp: this.exp,
            lot: this.lot,
            unreleasedReleased: this.unreleasedReleased});
        })
        .then((response) => {
          this.$download.excel(response, "Covalon Inventory Report.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    getTenantPage(){
      if(this.checkPermi(['super:user'])){
        getTenantPage({pageNo:1,pageSize:100,status2:0}).then(response => {
          for(var i=0;i<response.data.list.length;i++){
            this.tenantMap[response.data.list[i].id]=response.data.list[i].name
          }
          this.tenantList=response.data.list
        });
      }
    },
    handleChange1(){
      this.pageForm.account=this.account
    },
    handleClickDialogFormVisible(){
      editIpAddress({loginAddress:this.IpForm.ipEditAddress,userIp:this.ipEditIp}).then(response => {
        this.$modal.msgSuccess("Success");
        this.handleChangeIp();
        this.dialogFormVisible = false
      });
    },

    handleChange2(){
      this.pageForm.dateStr=this.unreleasedReleased
      poList({DateStr:this.unreleasedReleased}).then(response => {
        if(response && response.data){
          console.log(response);
          console.log("response===========================");
          this.poSet =  response.data.customers
        }
        this.getDisLoading = false
      });
    },
    handleChange(){
        this.report5()
      this.getChatsIp()
    },
       report5(){
        this.loading5=true
        this.tableLoading=true
        this.pageForm.account=this.account
        this.pageForm.dateStr=this.unreleasedReleased
        selectPage(this.pageForm).then((res)=>{
            this.tableLoading = false;
            this.tableData3=res.data.list
            this.loading5=false
            this.pageForm.lineTotal=res.data.total
        })
         // this.sumDataList()
       },

    handleChangeIp(){
      this.loading2=true
      this.tableLoading=true
      this.pageForm.dateStr=this.unreleasedReleased
      this.pageForm.ipSelect=this.ipSelect
      this.pageForm.ipNullSelect=this.ipNullSelect
      selectPageIp(this.pageForm).then((res)=>{
        this.tableLoading = false;
        this.tableData1=res.data.list
        this.loading2=false
        this.pageForm.lineTotal=res.data.total
      })
    },

    getChatsIp(){
      this.loading2=true
      this.tableLoading=true
      this.pageForm.dateStr=this.unreleasedReleased
      selectChatsIp(this.pageForm).then((res)=>{
        console.log(res,"res---chats")
        console.log(this.pageForm.dateStr,"res---this.pageForm.dateStr")
        this.option3.xAxis[0].data = res.data.customerName
        // if (this.)
        this.option3.series[0]= res.data.customerData
        this.myChart3.clear()
        this.myChart3.setOption(this.option3)
        this.loading1 = false
      })
    },
    handleClickEdit(row){
      this.dialogFormVisible = true
      this.ipEditIp = row.userIp

    },
    sumDataList(){
      this.loading5=true
      this.pageForm.po=this.po
      this.pageForm.lot=this.lot
      this.pageForm.sku=this.sku
      this.pageForm.exp=this.exp
      this.pageForm.unreleasedReleased=this.unreleasedReleased
      sumData(this.pageForm).then((response)=>{
        this.sumAvailableInventoryBox = response.data.sumAvailableInventoryBox
        this.sumGw2KG = response.data.sumGw2KG
        this.sumAvailableInventoryCarton = response.data.sumAvailableInventoryCarton
        this.sumPickedInventoryBox = response.data.sumPickedInventoryBox
        this.sumPickedInventoryCarton = response.data.sumPickedInventoryCarton
        this.sumAllocatedInventoryBox = response.data.sumAllocatedInventoryBox
        this.sumAllocatedInventoryCarton = response.data.sumAllocatedInventoryCarton

      })
    },
    getSummaries(param) {
      console.log(param)
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        console.log(column.property)
        if (index == 0) {
          console.log("sum================")
          sums[index] = 'Sum';//可更改合计行的名称
          return;
        }
        if (column.property =='availableInventoryBox') {

          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          console.log("!!!!!!!!!!!!!!!!!!!================")
          console.log(values)
          console.log(sum)
          console.log("!!!!!!!!!!!!!!!!!!!================")
          sums[index] = parseFloat(this.sumAvailableInventoryBox).toFixed(0)+'';
          return;
        } else if (column.property =='pickedInventoryBox') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          sums[index] = parseFloat(this.sumPickedInventoryBox).toFixed(2)+'';
          return;
        } else if (column.property =='pickedInventoryCarton') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          console.log("!!!!!!!!!!!!!!!!!!!================")
          console.log(values)
          console.log(sum)
          console.log("!!!!!!!!!!!!!!!!!!!================")
          sums[index] = parseFloat(this.sumPickedInventoryCarton).toFixed(2)+'';
          return;
        } else if (column.property =='availableInventoryCarton') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          sums[index] = parseFloat(this.sumAvailableInventoryCarton).toFixed(2)+'';
          return;
        }
        else if (column.property =='allocatedInventoryBox') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          sums[index] = parseFloat(this.sumAllocatedInventoryBox).toFixed(0)+'';
          return;
        }
        else if (column.property =='allocatedInventoryCarton') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          sums[index] = parseFloat(this.sumAllocatedInventoryCarton).toFixed(2)+'';
          return;
        }
        else if (column.property =='gw2KG') {
          const values = data.map((item) => Number(item[column.property]))
          let sum=values.reduce((total,curr)=>{
            return total+curr
          },0)
          sums[index] = parseFloat(this.sumGw2KG).toFixed(2)+'';
          return;
        }else {
          sums[index] = ' ';
          return;
        }
      });
      return sums;
    },
  },
  computed: {
    // 使用计算属性来确保值总是有效的
    formattedTicketStatus0() {
      const value = this.ticketStatus['0'];
      if (value === undefined || value === null || value === '' || isNaN(value)) {
        return 0;
      }
      return value;
    },
    formattedTicketStatus1() {
      const value = this.ticketStatus['1'];
      if (value === undefined || value === null || value === '' || isNaN(value)) {
        return 0;
      }
      return value;
    },
    formattedTicketStatus2() {
      const value = this.ticketStatus['2'];
      if (value === undefined || value === null || value === '' || isNaN(value)) {
        return 0;
      }
      return value;
    },
    formattedTicketStatus3() {
      const value = this.ticketStatus['3'];
      if (value === undefined || value === null || value === '' || isNaN(value)) {
        return 0;
      }
      return value;
    },
  },
};
</script>


<style>
  .el-statistic.status-a .head {
      color: #004F7C !important;
  }
  .el-statistic.status-b .head {
      color: #ffba00 !important;
  }
  .el-statistic.status-c .head {
      color: red !important;
  }
  .el-statistic.status-d .head {
      color: #13ce66 !important;
  }
  .chat-conversation {
    float: left;
    width: 30vw;
    height: 100%;}
</style>
