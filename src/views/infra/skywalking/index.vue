<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>Server Info</span>
            </div>
                <div id="main" style="width: 100%;height: 300px;">
                </div>
                  <div style="text-align: center;padding-bottom: 20px;">
                  <h4 style="font-weight: bold;font-size: 25px;">
                    Server disk
                  </h4>
                  <el-progress type="dashboard" :percentage="parseInt(parseInt(serverInfo.usageDisk)/parseInt(serverInfo.totalDisk)*100)" :color="colors"></el-progress>
                  <el-row>
                    <el-col :span="8">
                      Total Space:{{ serverInfo.totalDisk }}G
                    </el-col>
                    <el-col :span="8">
                      Free Space:{{ serverInfo.availableDisk }}G
                    </el-col>
                    <el-col :span="8">
                      Usage Space:{{ serverInfo.usageDisk }}G
                    </el-col>
                  </el-row>
                </div>
            <div id="main1" style="width:  100%;height: 300px;">
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="box-card" style="width: 100%;">
                <div slot="header" class="clearfix">
                  <span>Last Release</span>
                </div>
                <div style="padding: 15px;">
                  <i style="font-size: 30px;" class="el-icon-date"></i>
                  <p>
                    {{ dbBasic.Content.StartTime }}
                  </p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card" style="width: 100%;">
                <div slot="header" class="clearfix">
                  <span>System uptime</span>
                </div>
                <div style="padding: 15px;">
                  <i style="font-size: 30px;" class="el-icon-time"></i>
                  <p>
                    {{ serverInfo.systemUptime }}H
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-card class="box-card" style="width: 100%;margin-top: 20px;padding-bottom: 2px;">
                <div slot="header" class="clearfix">
                  <span>Smart ticket statistics</span>
                </div>
                <el-col :span="12">
                <p style="font-size: 20px;"><i style="color: blue;font-size: 30px;" class="el-icon-tickets"></i> All ticket</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.ticketCount }}</p>
              </el-col>
              <el-col :span="12">
                <p style="font-size: 20px;"><i style="color: green;font-size: 30px;" class="el-icon-tickets"></i> Resolve ticket</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.resolvedTicketCount }}</p>
              </el-col>
              </el-card>
          <el-card class="box-card" style="width: 100%;margin-top: 20px;">
            <div slot="header" class="clearfix">
              <span>Customer statistics</span>
            </div>
            <el-row :gutter="20" style="padding: 15px;">
              <el-col :span="12">
                <p style="font-size: 20px;"><i style="color: green;font-size: 30px;" class="el-icon-s-custom"></i> Total Customer</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.tenantCount }}</p>
              </el-col>
              <el-col :span="12">
                <p style="font-size: 20px;"><i style="color: red;font-size: 30px;" class="el-icon-s-custom"></i> Expire Customer</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.expireTenantCount }}</p>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" style="width: 100%;margin-top: 20px;">
            <div slot="header" class="clearfix">
              <span>User statistics</span>
            </div>
            <el-row :gutter="20" style="padding: 15px;">
              <el-col :span="8">
                <p style="font-size: 20px;"><i style="color: rgb(0, 79, 124);font-size: 30px;" class="el-icon-user"></i> Total User</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.userCount }}</p>
              </el-col>
              <el-col :span="8">
                <p style="font-size: 20px;"><i style="color: green;font-size: 30px;" class="el-icon-user"></i> Online User</p>
                <p style="font-size: 30px;">{{ onlineUser }}</p>
              </el-col>
              <el-col :span="8">
                <p style="font-size: 20px;"><i style="color: red;font-size: 30px;" class="el-icon-user"></i> Disabled User</p>
                <p style="font-size: 30px;">{{ systemUserAndCustomerInfo.disabledUserCount }}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>Database info</span>
            </div>
            <div style="padding: 20px;">
              <el-descriptions title="Basic" :column="2"  border style="box-shadow: none!important;margin: 0px!important;">
                <el-descriptions-item>
                  <template slot="label">
                    JavaVM Name
                  </template>
                  {{ dbBasic.Content.JavaVMName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-mobile-phone"></i>
                    Java Version
                  </template>
                  {{ dbBasic.Content.JavaVersion }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    Drivers
                  </template>
                  {{ dbBasic.Content.Drivers }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions v-for="item in dbDatasource.Content" :title="item.Name" :column="2"  border style="box-shadow: none!important;margin-top: 20px">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="display: inline-block;width: 50px;">DB Type</span>
                  </template>
                  <span style="display: inline-block;width: 80px;">{{ item.DbType }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    URL
                  </template>
                  {{ item.URL }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="Webapp" :column="1"  border style="box-shadow: none!important;margin-top: 20px;margin-bottom: 14px;">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="display: inline-block;width: 100px;">Request Count</span>
                  </template>
                  <span style="display: inline-block;width: 80px;">{{ dbWebapp.Content[0].RequestCount}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="display: inline-block;width: 100px;">Jdbc Execute TimeMillis</span>
                  </template>
                  <span style="display: inline-block;width: 80px;">{{ dbWebapp.Content[0].JdbcExecuteTimeMillis}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="display: inline-block;width: 100px;">Jdbc Fetch Row Count</span>
                  </template>
                  <span style="display: inline-block;width: 80px;">{{ dbWebapp.Content[0].JdbcFetchRowCount}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="display: inline-block;width: 100px;">Jdbc Execute Count</span>
                  </template>
                  <span style="display: inline-block;width: 80px;">{{ dbWebapp.Content[0].JdbcExecuteCount}}</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { dbInfo,serverInfo,systemUserAndCustomerInfo } from "@/api/infra/monitoring";
import { getAccessTokenPage } from "@/api/system/oauth2/oauth2Token";
export default {
  name: "InfraSkyWalking",
  components: { },
  data() {
    return {
      tableHeight:0,
      colors: [
          {color: '#f56c6c', percentage: 100},
          {color: '#e6a23c', percentage: 80},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 40},
          {color: '#6f7ad3', percentage: 20}
        ],
      option: {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: 'CPU utilization'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          max:100
        },
        series: [
          {
            name: 'CPU%',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            },
            data: []
          }
        ]
      },
      option2: {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: 'RAM utilization'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        series: [
          {
            name: 'Usage memory(MB)',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: '#409eff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#5da6f2'
                },
                {
                  offset: 1,
                  color: '#69adf3'
                }
              ])
            },
            data: []
          }
        ]
      },
      dbBasic:{
        Content:{}
      },
      dbDatasource:{
        Content:[]
      },
      dbWebapp:{
        Content:[{}]
      },
      serverInfo:{},
      myChart:null,
      myChart2:null,
      timer:null,
      systemUserAndCustomerInfo:{},
      onlineUser:0
    };
  },
  beforeDestroy(){
    clearTimeout(this.timer);
  },
  mounted() {
    this.calcTableHeight()
    this.init()

    var _this=this
    this.getServerInfo()
    var timer = setInterval(function() {
      _this.getServerInfo()
    }, 3000);
    this.timer=timer
  },
  methods:{
    init(){
      this.option.xAxis.data=[]
      this.option.series[0].data=[]
      this.option2.xAxis.data=[]
      this.option2.series[0].data=[]
      var chartDom = document.getElementById('main');
      this.myChart = echarts.init(chartDom);
      var chartDom2 = document.getElementById('main1');
      this.myChart2 = echarts.init(chartDom2);
      this.chart1(null,null)
      this.chart2(null,null)
      this.dbInfo()
      this.getSystemUserAndCustomerInfo()
      this.getOnlineUser()
    },
    getOnlineUser(){
      getAccessTokenPage({pageNo: 1,
        pageSize: 10,}).then((res)=>{
          this.onlineUser=res.data.total
        })
    },
    getServerInfo(){
      serverInfo({}).then((res)=>{
        this.serverInfo=res.data
        this.option2.yAxis.max=this.serverInfo.totalMemory
        this.chart1(this.serverInfo.cpuUsage,this.serverInfo.dateTime)
        this.chart2(this.serverInfo.usageMemory,this.serverInfo.dateTime)
        
      })
    },
    getSystemUserAndCustomerInfo(){
      systemUserAndCustomerInfo({}).then((res)=>{
        this.systemUserAndCustomerInfo=res.data
      })
    },
    dbInfo(){
      dbInfo({}).then((res)=>{
        this.dbBasic=JSON.parse(res.data.basic)
        delete this.dbBasic['Content']['JavaClassPath']
        this.dbDatasource=JSON.parse(res.data.datasource)
        this.dbWebapp=JSON.parse(res.data.webapp)
      })
    },
    chart1(data,date){
      if(data!=null){
        if(this.option.xAxis.data.length>=10){
          this.option.xAxis.data.shift();
          this.option.series[0].data.shift();
        }
        this.option.xAxis.data.push(date.split(' ')[1])
        console.log(this.option.xAxis.data)
        this.option.series[0].data.push(data)
      }
     
      this.myChart.setOption(this.option);
    },
    chart2(data,date){
      if(data!=null){
        if(this.option2.xAxis.data.length>=10){
          this.option2.xAxis.data.shift();
          this.option2.series[0].data.shift();
        }
        this.option2.xAxis.data.push(date.split(' ')[1])
        this.option2.series[0].data.push(data)
      }
      this.myChart2.setOption(this.option2);
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 172;
    },
  }
};
</script>
