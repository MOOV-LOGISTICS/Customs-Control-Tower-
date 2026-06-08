<template xmlns="">

  <div class="app-container"  style="width:95%;margin:0 auto;background:#fff;padding:20px">

    <el-row style="text-align: center;
    align-items: center;
    display: flex;" :gutter="20">
      <el-col :span="4">
        <el-date-picker
          type="months"
          v-model="queryParams.yearMonths"
          value-format="yyyy-MM"
          placeholder="ATD Month">
        </el-date-picker>
      </el-col>

      <el-col :span="5" v-if="showCustomer">
        <el-select  filterable clearable @clear="queryData" multiple v-model="queryParams.customer"  collapse-tags
                    placeholder="Customer Name" :loading="getDisLoading"  loading-text="Loading...">
          <el-option v-for="item in customerList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="dataLoading"  @click="queryData"><i class="el-icon-search"></i> Search</el-button>
      </el-col>
      <el-col :offset="showCustomer?0:4" :span="9">
        <p style="font-size: 20px; font-weight: bolder; padding: 0; margin: 0; text-align: left;">{{customerName}}</p>
      </el-col>
      <el-col  :offset="showCustomer?0:1" :span="4">
        <img
          style="    height: 50px; margin-left: 2%; margin-top: 2%;"
          src="../../../assets/Moov_Log.png"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" style="padding-top: 20px;">
      <el-col :span="5">
        <div @click="showCustomersList(1)">
          <el-card class="top-card a" v-loading="shipmentLoading" >
            <el-statistic
              group-separator=","
              :precision="0"
              :value="num1"
              title="Total shipments"
            ></el-statistic>
          </el-card>
        </div>
      </el-col>
      <el-col :span="5">
        <div @click="showCustomersList(2)">
          <el-card class="top-card b" v-loading="shipmentLoading"  >
            <el-statistic
              group-separator=","
              :precision="0"
              :value="num2"
              title="Total TEU at destination"
            ></el-statistic>
          </el-card>
      </div>
      </el-col>
      <el-col :span="4"  v-loading="shipmentLoading">
        <div @click="showCustomersList(3)">
          <el-card class="top-card c">
            <el-statistic
              group-separator=","
              :precision="0"
              :value="num3"
              title="Total TEU in transit"
            ></el-statistic>
          </el-card>
        </div>
      </el-col>
      <el-col :span="5"  v-loading="shipmentLoading">
        <div @click="showCustomersList(4)">
          <el-card class="top-card d" >
            <el-statistic
              group-separator=","
              :precision="0"
              :value="num4"
              title="Total TEU booked,Not departed"
            ></el-statistic>
          </el-card>
        </div>
      </el-col>
      <el-col :span="5"  v-loading="shipmentLoading">
        <div @click="showCustomersList(5)">
          <el-card class="top-card e"  >
            <el-statistic
              group-separator=","
              :precision="0"
              :value="num5"
              title="Total Shipments booked,Not departed"
            ></el-statistic>
          </el-card>
        </div>
      </el-col>

    </el-row>
    <el-row v-if="customersDiv && customersList.length>0" style="padding: 30px 0px 0px 0px;">
      <el-col :span="10">
        <span class="out-title"> {{customerReportName}}</span>
      </el-col>
      <el-col :span="1" :offset="13"><i @click="customersDiv = false" class="el-icon-close hover-change-color"></i></el-col>
    </el-row>
    <el-row v-if="customersDiv && customersList.length>0" style="padding: 20px 20px 0px 20px;">
      <el-col>
        <div>
          <el-table :data="customersList" stripe max-height="300" v-lodaing="tableLoading"
                    style="width: 100%; font-weight: 600;">
            <el-table-column property="booking_number" label="MOOV Ref" min-width="150" show-overflow-tooltip>
              <template v-slot="scope">
                <el-link v-if="tenantId == scope.row.tenant_id" type="primary" style="margin-top: -1px;"
                         :href="'/shipment/detail?id='+scope.row.id">{{ scope.row.booking_number }}
                </el-link>
                <span v-else>{{scope.row.booking_number}}</span>
              </template>
            </el-table-column>
            <el-table-column property="origin_port" label="POL" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column property="destination_port" label="POD" min-width="100"></el-table-column>
            <el-table-column  prop="etd" label="ETD" show-overflow-tooltip min-width="120">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.etd) }}
              </template>
            </el-table-column>
            <el-table-column  prop="eta" label="ETA" show-overflow-tooltip min-width="120">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.eta) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="md-card a" v-loading="shipmentLoading">
          <div class="out-title">Shipments arriving within 7 days</div>
          <div class="out-div" id="a-chat" sytle="padding-bottom:20px" >

            <el-table
              v-el-table-infinite-scroll="dLoadMore"
              :infinite-scroll-disabled="dIsFinished"
              v-loading="dIsLoading"
              :data="arrivingList"
              border
              height="400"
              style="width: 100%">
              <el-table-column
                prop="shipmentBookingNumber"
                label="Booking Number"
                show-overflow-tooltip
                width="160">
                <template v-slot="scope">
                  <el-link v-if="tenantId == scope.row.tenantId" type="primary" style="margin-top: -1px;"
                           :href="'/shipment/detail?id='+scope.row.id">{{ scope.row.shipmentBookingNumber }}
                  </el-link>
                  <span v-else>{{scope.row.shipmentBookingNumber}}</span>
                </template>
              </el-table-column>
<!--              <el-table-column-->
<!--                prop="poNumbers"-->
<!--                label="Lot#s"-->
<!--                show-overflow-tooltip-->
<!--                width="140">-->
<!--              </el-table-column>-->
              <el-table-column
                prop="pod"
                label="POD"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                prop="eta"
                label="ETA"
                show-overflow-tooltip
                width="120">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.eta) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Containers">
                <template v-slot="scope">
                <el-tag
                  style="margin-right: 5px"
                  v-for="container in scope.row.containerDOList.filter((item) => item.type == 0)"
                  :key="container.id" >{{ container.containerType }} x {{ container.numbers }}</el-tag >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="md-card b" v-loading="shipmentLoading">
          <div class="out-title">Shipments departing within 7 days</div>
          <div class="out-div" id="b-chat" sytle="padding-bottom:20px">

            <el-table
              v-el-table-infinite-scroll="loadMore"
              :infinite-scroll-disabled="isFinished"
              v-loading="isLoading"
              :data="departingList"
              border
              height="400"
              style="width: 100%">
              <el-table-column
                prop="shipmentBookingNumber"
                label="Booking Number"
                show-overflow-tooltip
                width="160">
                <template v-slot="scope">
                  <el-link v-if="tenantId == scope.row.tenantId" type="primary" style="margin-top: -1px;"
                           :href="'/shipment/detail?id='+scope.row.id">{{ scope.row.shipmentBookingNumber }}
                  </el-link>
                  <span v-else>{{scope.row.shipmentBookingNumber}}</span>
                </template>
              </el-table-column>
<!--                <el-table-column-->
<!--                  prop="poNumbers"-->
<!--                  label="Lot#s"-->
<!--                  show-overflow-tooltip-->
<!--                  width="140">-->
<!--                </el-table-column>-->
              <el-table-column
                prop="pol"
                label="POL"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                prop="pod"
                label="POD"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                prop="etd"
                label="ETD"
                show-overflow-tooltip
                width="120">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.etd) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Containers">
                <template v-slot="scope">
                  <el-tag
                    style="margin-right: 5px"
                    v-for="container in scope.row.containerDOList.filter((item) => item.type == 0)"
                    :key="container.id" >{{ container.containerType }} x {{ container.numbers }}</el-tag >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">

      <el-col :span="24">
        <el-card class="md-card c" v-loading="shipmentLoading">

          <el-row style="padding: 15px 0px 0px 20px;" :gutter="20">
            <el-col :span="5">
              <el-select  filterable clearable @clear="getReportChatData" multiple v-model="queryParams.pol"  collapse-tags
                          placeholder="Origin Country"  loading-text="Loading...">
                <el-option v-for="item in portOptions"
                           :label="item.country"
                           :value="item.country"></el-option>
              </el-select>

            </el-col>

            <el-col :span="5"  >
              <el-select  filterable clearable @clear="getReportChatData" multiple v-model="queryParams.pod"  collapse-tags
                          placeholder="Destination Country"   loading-text="Loading...">
                <el-option v-for="item in portOptions"
                           :label="item.country"
                           :value="item.country"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" :loading="butLoading"  @click="getReportChatData"><i class="el-icon-search"></i> Search</el-button>
            </el-col>
          </el-row>
          <div class="out-div"  id="c-chat" >

          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>


</template>
<script>
  import * as echarts from 'echarts';
  import { getCustomerReports ,departingWithin7Days, arrivingWithin7Days,
    getVMTReportData, getUserCustomerName} from "@/api/bi/bi";
  import { listDept } from "@/api/system/dept";
  import auth from "@/plugins/auth";
  import ElTableInfiniteScroll from "el-table-infinite-scroll";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
  import { getTenantId} from '@/utils/auth'


  export default {
    name: "MfcReport",
    directives: {
      "el-table-infinite-scroll": ElTableInfiniteScroll,
    },
    data() {
      return{
        currentPage: 1,
        pageSize: 20,
        isLoading: false,
        isFinished: false,
        dCurrentPage: 1,
        dPageSize: 20,
        dIsLoading: false,
        dIsFinished: false,
        dataLoading:false,
        shipmentLoading: false,
        arrivingTotal: 0,
        departingTotal: 0,
        getDisLoading:false,
        queryParams: {
          yearMonths: [],
          customer: [],
          pageNo: 1,
          pageSize: 10,
          pol: [],
          pod: [],
        },
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
        arrivingList:[],
        departingList:[],
        reportData: [],
        customerName: '',
        showCustomer: false,
        customerList: [],
        portOptions:[],
        portDisLoading:false,
        butLoading:false,
        customersDiv: false,
        customersList:[],
        tableLoading:false,
        customerReportData:[],
        customerReportNum:null,
        customerReportName:null,
        tenantId: null,
      }
    },
    computed: {

    },
    created() {
      this.tenantId = this.getTenantId()
      this.queryData()
      this.getReportChatData()
    },
    mounted: function() {
      getUserCustomerName().then(res=>{
        if(res.data.isMultiple){
          this.customerList = res.data.isMultiple
          this.showCustomer = true
          return
        }
        this.customerName = res.data.customerName

        if(!this.customerName && localStorage.getItem('TENANT_ID') == 1 && this.customerList.length > 0){
          this.showCustomer = true
        }

        this.getParties()
      })
      this.portDisLoading = true
      getOriginDeliveryList().then((response) => {
        if(response.data){
          const map = new Map();
          response.data.forEach(item => {
            if (!map.has(item.country) && item.country) {
              map.set(item.country, item);
            }
          });
          // 将Map的值（即去重后的数组）转换回数组
          this.portOptions = Array.from(map.values());
          this.portOptions.sort((a, b) => {
            // 按照 Country 的字母顺序排序
            return a.country.localeCompare(b.country);
          });
        }
        this.portDisLoading = false
      });

    },
    methods: {

      getTenantId,
      showCustomersList(num){
        console.log(num)
        if(this.customerReportNum == num){
          this.customersDiv = !this.customersDiv
        }else{
          this.customersDiv = true
        }
        this.customerReportNum = num
        this.tableLoading = true
        if(num == 1){
          this.customersList = this.customerReportData
          this.customerReportName = "Total shipments"
        }else if(num == 2){
          this.customersList = this.customerReportData.filter(item => item.transit_teu_ata_null > 0);
          this.customerReportName = "Total TEU at destination"
        }else if(num == 3){
          this.customersList = this.customerReportData.filter(item => item.transit_teu_ata_not_null > 0);
          this.customerReportName = "Total TEU in transit"
        }else if(num == 4){
          this.customersList = this.customerReportData.filter(item => item.not_departed_teu_num > 0);
          this.customerReportName = "Total TEU booked,Not departed"
        }else if(num == 5){
          this.customersList = this.customerReportData.filter(item => item.not_departed_num > 0);
          this.customerReportName = "Total Shipments booked,Not departed"
        }
        this.tableLoading = false
      },
      getParties(){
        this.getDisLoading = true
        listDept({partyRole: 'customer' }).then((response) => {
          this.customerList = response.data
          if(this.customerList.length == 1){
            this.showCustomer = false
          }else{
            this.showCustomer = true
          }
          this.getDisLoading = false
        })
      },
      loadMore() {
        if (this.isLoading || this.isFinished) return;
        this.isLoading = true;
        this.queryParams.pageNo = this.currentPage
        this.queryParams.pageSize = this.pageSize
        departingWithin7Days(this.queryParams).then(res =>{
          this.departingList = this.departingList.concat(res.data.departingList)
          this.departingTotal = res.data.departingTotal

          this.currentPage++;
          if (this.departingList.length >= this.departingTotal) {
            this.isFinished = true;
          }
          this.isLoading = false;
        })

      },
      dLoadMore() {

        if (this.dIsLoading || this.dIsFinished) return;
        this.dIsLoading = true;
        this.queryParams.pageNo = this.dCurrentPage
        this.queryParams.pageSize = this.dPageSize
        arrivingWithin7Days(this.queryParams).then(res =>{
          this.arrivingList = this.arrivingList.concat(res.data.arrivingList)

          this.arrivingTotal = res.data.arrivingTotal

          this.dCurrentPage++;
          if (this.arrivingList.length >= this.arrivingTotal) {
            this.dIsFinished = true;
          }
          this.dIsLoading = false;
        })
      },
      queryData(){
        this.dataLoading = true
        var data = this.queryParams
        data.pol = []
        data.pod = []
        this.shipmentLoading = true
        getCustomerReports(data).then(res =>{
          if(res.data){
             this.customerReportData = res.data
             this.num1 = res.data.reduce((acc, obj) => acc + obj.shipment_num, 0);
             this.num2 = res.data.reduce((acc, obj) => acc + obj.transit_teu_ata_null, 0) ;
             this.num3 = res.data.reduce((acc, obj) => acc + obj.transit_teu_ata_not_null, 0);
             this.num4 = res.data.reduce((acc, obj) => acc + obj.not_departed_teu_num, 0);
             this.num5 = res.data.reduce((acc, obj) => acc + obj.not_departed_num, 0);
          }
          this.shipmentLoading = false
          this.dataLoading = false
        })
        this.getReportChatData()

        this.arrivingList = []
        this.arrivingTotal = 0
        this.dIsFinished = false
        this.dCurrentPage = 1
        this.dLoadMore()

        this.departingList = []
        this.departingTotal = 0
        this.isFinished = false
        this.currentPage = 1
        this.loadMore()

      },
      getReportChatData(){
        var year
        if (!this.queryParams.yearMonths || this.queryParams.yearMonths.length == 0) {
          // 如果a为空，获取当前年份
          const now = new Date();
          year =  now.getFullYear().toString();
        } else {
          // 如果a不为空，分割字符串并获取年份部分
          year = this.queryParams.yearMonths[0].split('-')[0];
        }

        const data2 = JSON.parse(JSON.stringify(this.queryParams));
        data2.year = year
        data2.yearMonths = []
        this.butLoading = true
        getCustomerReports(data2).then(res =>{
          this.butLoading = false
          if(res.data){
             this.reportData = res.data
             this.initChart3()
          }
        })
      },
      initChart3(){
        var chartDom = document.getElementById('c-chat');
        var myChart = echarts.init(chartDom);

        // 处理数据，将具有相同carrier的teu_num进行累加
        var processedData = this.reportData.reduce((acc, curr) => {
            acc[curr.etd_year_month] = (acc[curr.etd_year_month] || 0) + curr.atd_teu_num;
            return acc;
        }, {});

        // 将处理后的数据转换为适合ECharts的格式
        var dataForChart = Object.keys(processedData).map(etd_year_month => ({
            etd_year_month: etd_year_month,
            atd_teu_num: processedData[etd_year_month]
        }));

        var yearMonthList = dataForChart.map(item => item.etd_year_month);

        var barWidth = '60%'
        if(yearMonthList.length ==  1){
          barWidth = '15%'
        }else if(yearMonthList.length ==  2){
          barWidth = '30%'
        }else if(yearMonthList.length ==  3){
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
            title: {
              text: 'Total TEU Departed per Month'
            },
            legend: {
                data: ['Container Number']
            },
            xAxis: {
              type: 'category',
              data: yearMonthList,
              axisTick: {
                alignWithLabel: true
              },
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
              type: 'value',
              name: 'TEU',
              position: 'left',
              nameLocation: "middle",
              alignTicks: true,
              nameTextStyle: {
                color: "black",
                align: "right",
                lineHeight: 50,
                fontSize: 16,
              }

            },
            series: [{
                data: dataForChart.map(item => item.atd_teu_num),
                type: 'bar',
                barWidth: barWidth ,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },
                itemStyle: {
                  color: '#FF9777'
                },
                label: {
                    show: true,
                    position: 'top',
                    valueAnimation: true,
                    formatter: '{c}'
                },
            }]
        };
        option && myChart.setOption(option);
        // 调整图表大小以适应容器
        myChart.resize();
      },

    },
    destroyed() {
    }
  };
</script>

<style>
  .top-card {
    min-height: 180px;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
  .top-card .el-statistic .title {
    color: #004770;
    font-weight: bold;
    font-size: 20px;
  }
  .top-card .el-statistic .con {
    color: #004770;
    font-weight: bold;
  }
  .card-value {
    padding-top: 10px;
  }
  .top-card.a{
    background-image: linear-gradient(to top, #96fbc4 0%, #f9f586 100%);
  }
  .top-card.b{
    background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%);
  }
  .top-card.c{
    background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);
  }
  .top-card.d{
    background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
  }
  .top-card.e{
    background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  }
  .md-card {
    margin-top: 15px;
  }
  .md-card .out-div{
    min-height: 420px;
    max-height: 450px;
    width:100%;
    padding: 20px;
  }
  .out-title{
    font-size: 18px;
    font-weight: bolder;
    padding-top: 16px;
    padding-left: 25px;
  }
  .hover-change-color{
    font-size: 20px;
    cursor: pointer;
    float: right;
    margin-right: 20px;
  }
  .hover-change-color:hover{
    color: #5cb6ff;
  }
  table.el-table__header {
      padding: 5px 0px 10px 0px !important;
  }
</style>
