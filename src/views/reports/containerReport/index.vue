
<template xmlns="" xmlns="">

  <div class="app-container" style="width:100%;margin:0 auto;">
    <el-card   style="padding: 20px;" :style="{height:height+'px'}" >
      <div>
        <div>
          <el-row>
            <el-col>
              <span style="font-size: 18px;font-weight: bold;">Container Utilization</span>
            </el-col>
          </el-row>
          <el-row   :gutter="20" style="margin-bottom: 10px;">

            <el-col :span="3" style="margin-top: 10px">
              <el-select  filterable @change="handleChange" clearable v-model="pol" placeholder="POL"
                          :loading="getDisLoading"  loading-text="Loading...">
                <el-option v-for="value in polSet" :label="value" :value="value"  :key="value"></el-option>
              </el-select>
              <!--        <el-input  v-model="lot" placeholder="Lot NO"  @blur="lotNumber = $event.target.value.trim()"-->
              <!--                   clearable @keyup.enter.native="handleChange" />-->
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-select  filterable @change="handleChange" clearable v-model="pod" placeholder="POD"
                          :loading="getDisLoading"  loading-text="Loading...">
                <el-option v-for="value in podSet" :label="value" :value="value" :key="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-select  filterable @change="handleChange" clearable v-model="shipper" placeholder="Shipper Name"
                          :loading="getDisLoading" loading-text="Loading...">
                <el-option v-for="value in shipperSet" :label="value.name" :value="value.id" :key="value.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-select  filterable @change="handleChange" clearable v-model="customer" placeholder="Customer Name"
                          :loading="getDisLoading" loading-text="Loading...">
                <el-option v-for="value in customerSet" :label="value.name" :value="value.id" :key="value.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-date-picker
                v-model="monthRange"
                type="monthrange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM"
                range-separator="-"
                start-placeholder="ATD start"
                end-placeholder="ATD end">
              </el-date-picker>
<!--              <el-select  filterable @change="handleChange" clearable v-model="atd" placeholder="ATD Month"-->
<!--                          :loading="getDisLoading"  loading-text="Loading...">-->
<!--                -->
<!--              </el-select>-->
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-select  filterable @change="handleChange" clearable v-model="type" placeholder="Container Type"
                          :loading="getDisLoading"  loading-text="Loading...">
                <el-option v-for="value in containerTypeSet" :label="value" :value="value"  :key="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" style="margin-top: 10px">
              <el-button type="primary"  @click="handleChange"><i class="el-icon-search"></i> Search</el-button>
            </el-col>
          </el-row>

        </div>

        <div style="clear: both"></div>
      </div>
      <transition name="el-zoom-in-center" >
        <div style="height: 100%" v-show="activeName=='first'" v-loading="loading5">
          <el-empty v-if="tableData3.length ===0" description="No Data"/>
          <el-row :gutter="10">
           <el-col :span="10">
             <div id="main1" v-loading="loading1" v-show="true" style="width:100%;height: 600px;"></div>
           </el-col>
           <el-col :span="14">
             <el-row>
               <el-col :span="24">
                 <div id="main2" v-loading="loading2" v-show="true" style="width:100%;height: 300px;"></div>
               </el-col>
             </el-row>
             <el-row>

               <el-col :span="24">
                  <div style="display: flex; align-items: center;">
                    <div style="margin-left: auto;">
                      <el-button @click="handleExport" v-loading="exportLoading">Export Data</el-button>
                    </div>
                  </div>
                 <el-table height="260px"  v-if="tableData3.length" :data="tableData3"  >
                   <el-table-column prop="shipmentRef" label="Shipment Reference" width="180" align="center">
                     <template v-slot="scope">
                       <el-link type="primary" :href="'/shipment/detail?id='+scope.row.shipmentId" target="_blank">
                         {{ scope.row.shipmentRef }}
                       </el-link>
                     </template>
                   </el-table-column>
                   <el-table-column prop="containerNo" label="Container Number" width="180" align="center">
                     <template v-slot="scope">
                       <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.containerNo) }}</div>
                     </template>
                   </el-table-column>
                   <el-table-column prop="cbm" label="CBM" min-width="100" align="center"></el-table-column>
                   <el-table-column prop="shipper" label="Shipper" show-overflow-tooltip min-width="200" align="center"></el-table-column>
                   <el-table-column prop="containerType" label="Container Type" width="140" align="center"></el-table-column>
                   <el-table-column prop="atd" label="ATD" >
                     <template v-slot="scope">
                       {{ parseTime(scope.row.atd,"{y}-{m}-{d}") }}
                     </template>
                   </el-table-column>
                   <el-table-column prop="carrier" label="Carrier/Vessel/Voyage"  show-overflow-tooltip min-width="200" align="center">
                     <template v-slot="scope">
                       <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.carrier) + " / "+ scope.row.vessel+ " / "+ scope.row.voyage}}</div>
                     </template>
                   </el-table-column>

<!--                   <el-table-column label="Operations" align="center">
                     <template slot-scope="scope">
                       <el-button v-if="!scope.row.atd" @click="handleClickEdit(scope.row)" type="text" size="small">Edit</el-button>
                     </template>
                   </el-table-column>-->
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
               </el-col>
             </el-row>
           </el-col>
          </el-row>

        </div>
      </transition>
    </el-card>

    <el-dialog :title="lowTitle" :visible.sync="showLow" width="75%">
      <el-table :data="showLowList" height="600px">
        <el-table-column prop="shipmentRef" label="Shipment Reference" width="180" align="center">
          <template v-slot="scope">
            <el-link type="primary" :href="'/shipment/detail?id='+scope.row.shipmentId" target="_blank">
              {{ scope.row.shipmentRef }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="containerNo" label="Container Number" width="180" align="center">
          <template v-slot="scope">
            <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.containerNo) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cbm" label="CBM" min-width="100" align="center" sortable></el-table-column>
        <el-table-column prop="shipper" label="Shipper" show-overflow-tooltip min-width="200" align="center"></el-table-column>
        <el-table-column prop="containerType" label="Container Type" width="140" align="center"></el-table-column>
        <el-table-column prop="atd" label="ATD" sortable >
          <template v-slot="scope">
            {{ parseTime(scope.row.atd,"{y}-{m}-{d}") }}
          </template>
        </el-table-column>
        <el-table-column prop="carrier" label="Carrier/Vessel/Voyage"  show-overflow-tooltip min-width="200" align="center">
          <template v-slot="scope">
            <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.carrier) + " / "+ scope.row.vessel+ " / "+ scope.row.voyage}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="vgm" label="VGM(KG)" min-width="100" align="center" sortable></el-table-column>
      </el-table>
    </el-dialog>

  </div>


</template>
<script>
import {
  selectEChats,exportExcel
} from "@/api/containerreports/containerReport";
import moment from 'moment';
import { getTenantPage } from "@/api/system/tenant";
import { checkPermi, checkRole } from "@/utils/permission";
import * as echarts from "echarts";
export default {
  name: "combineBookingReport",
  components: {},
  data() {
    return{
      polSet:[],
      podSet:[],
      shipperSet:[],
      customerSet:[],
      containerTypeSet:[],
      pol:"",
      pod:"",
      shipper:"",
      customer:null,
      atd:"",
      monthRange:undefined,
      type:"",
      vessel:"",
      voyage:"",
      cutOffId:"",
      siCutOffDate:undefined,
      vgmCutOffDate:undefined,

      vesselSet:[],
      voyageSet:[],
      dateForm:{},
      dialogFormVisible:false,
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
      ReleasedSet:[{name:"Released",value:"1"},{name:"Unreleased",value:"0"}],
      sum: 0.0,
      getDisLoading: false,
      bookingStatusList :[],
      supplierList :[],
      unreleasedReleased:'',
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
      tableData2:[{}],
      tableData3:[],
      pageForm:{
        pageSize:20,
        pageNo:1
      },
      height:null,
      loading1:false,
      loading2:false,
      loading3:false,
      tenantMap:{},
      tenantList:[],
      exportLoading:false,
      myChart1:undefined,
      myChart2:undefined,
      option1 : {
        // title: {
        //   text: 'Numbers of Containers',
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name:'Numbers of Containers',
          type: 'value',
          nameLocation: 'center',
          nameTextStyle: {
            padding: [10, 0, 50, 0] ,// 上右下左的距离，将名称移动到下方
            fontWeight: 'bold',
            fontSize:"16px"
          },
          splitLine: {
            show: true
          },
          axisLabel: {
            show: true // 这里设置不显示X轴值
          }
        },
        yAxis: {
          name:'Utilization',
          nameRotate: '90',
          nameLocation: 'center',
          nameGap: 30,  // 表现为上下位置
          nameTextStyle: {
            padding: [0,20,55,35],
            fontWeight: 'bold',
            fontSize:"16px"
          },
          type: 'category',
          data: ['<=60%', '>60% - 70%', '>70% - 80%', '>80% - 90%' , '>90% - 100%'],
          // inverse: true
        },
        series: [
          {
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      },
      option2 : {
        title: {
          text: 'Average Utilization per Container Type',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          // 核心修改：添加 formatter 函数，为值追加 %
          formatter: function (params) {
            let res = params[0].name + '<br>';
            params.forEach(item => {
              res += `${item.marker} ${item.seriesName}: ${item.value}%<br>`;
            });
            return res;
          }
        },
        legend: {
          data: [],
          top: 'bottom' // X轴显示在底部
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: false
          }
        },
        xAxis: {
          name:'ATD year month',
          nameLocation: 'center',
          nameTextStyle: {
            padding: [10, 0, 50, 0] ,// 上右下左的距离，将名称移动到下方
            fontWeight: 'bold',
            fontSize:"16px"
          },
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name:'Average Utilization %',
          nameRotate: '90',
          nameLocation: 'center',
          nameGap: 30,  // 表现为上下位置
          nameTextStyle: {
            padding: [0,20,15,35],
            fontWeight: 'bold',
            fontSize:"16px"
          },
          type: 'value'
        },
        series: [
          {
            name: '55DD',
            type: 'line',
            stack: 'Total',
            data: ["0"]
          },
/*          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }*/
        ]
      },
      loading5: false,
      showLow: false,
      lowTitle: '',
      lowList: [],
      showLowList: [],
    }
  },
  mounted() {
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 162;
    var chartDom1 = document.getElementById('main1');
    this.myChart1 = echarts.init(chartDom1);
    this.myChart1.setOption(this.option1)
    var vm = this
    this.myChart1.on('click', function (params) {
        if(params.dataIndex < 5 && params.data > 0){
          vm.lowTitle = params.name
          vm.showLow = true
          //柱子的下标可以对应到数据
          vm.showLowList = vm.lowList[params.dataIndex]
        }
    });
    var chartDom2 = document.getElementById('main2');
    this.myChart2 = echarts.init(chartDom2);
    this.myChart2.setOption(this.option2)
    this.report5()
    this.getDisLoading = true

  },
  methods: {
    handleExport() {
      this.$modal
        .confirm("Export?")
        .then(() => {
          this.exportLoading = true;


          return exportExcel({
            pol:this.pol,
            pod: this.pod,
            shipmentName: this.shipmentName,
            shipper: this.shipper,
            customer: this.customer,
            atd: this.atd,
            monthRange: this.monthRange,
            atdStart: this.atdStart,
            atdEnd: this.atdEnd,
            type: this.type });
        })
        .then((response) => {
          this.$download.excel(response, "container EChats Report.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    handleChange(){
      this.report5()
    },
    report5(){
      this.loading5=true
      this.pageForm.pol=this.pol
      this.pageForm.pod=this.pod
      this.pageForm.shipper=this.shipper
      this.pageForm.customer= this.customer
      this.pageForm.atd=this.atd
      this.pageForm.monthRange=this.monthRange
      this.pageForm.type=this.type
      selectEChats(this.pageForm).then((res)=>{
        this.lowList = res.lowList
        this.tableData3=res.tableData.list
        this.option1.series[0].data = res.chatsList
        this.myChart1.clear()
        this.myChart1.setOption(this.option1)
        // 调整图表大小以适应容器
        this.myChart1.resize();
        this.option2.series = res.series

        this.option2.legend.data = res.containerTypeSet
        this.option2.xAxis.data = res.atdMonthSet
        this.myChart2.clear()
        this.myChart2.setOption(this.option2)

        this.myChart2.resize();
        if(res.polSet && this.polSet.length == 0) this.polSet = res.polSet
        if(res.podSet && this.podSet.length == 0) this.podSet = res.podSet
        if(res.shipper && this.shipperSet.length == 0) this.shipperSet = res.shipper
        if(res.customer && this.customerSet.length == 0) this.customerSet = res.customer
        if(res.containerTypeSet && this.containerTypeSet.length == 0) this.containerTypeSet = res.containerTypeSet

        this.pageForm.lineTotal=res.tableData.total
        this.getDisLoading = false
        this.loading5=false
      })
    },

  }
};
</script>

<style>


.rotate-text {
  transform: rotate(90deg);
  display: block; /* 或者 inline-block，根据需求 */
}

</style>
