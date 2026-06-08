<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >

    <el-card>
    <el-container>
    <el-header style="height: 120px;">
            <div style="text-align: center; font-size: 50px;font-weight: bold;font-family:kalam !important; margin-top: 8px;">
            Origin Handling Agent Performance
            </div>
                <el-scrollbar class="horizontal-scrollbar" horizontal style="margin-left: 20%;margin-right: 20%;height: 68px;margin-top: 10px;">
                <div class="content">
                <el-button :class="{'avticeTenant':checkedTenant[item.id]}" @click="setTenant(item.id)" v-for="item in tenantList" :label="item.name" :value="item.id" style="font-size: 16px;margin-right: 20px;border-radius: 15px;background-color: #4472c4;color: #FFF; width: 180px;height: 60px;">
                  {{ item.name }}</el-button>
                </div>
                </el-scrollbar>
    </el-header>
      <el-container>
      <el-aside width="25%" style="padding: 0px;">
        <el-row>
          <div style="text-align: center; line-height: 40px; font-size: 20px;font-weight: bold;text-decoration: underline;color:black;">
              General Overview
            </div>
          </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-card style="background-color: #ed7d31; border-radius: 50px;color: white;font-size: 20px;">
              {{ count2 }}
            </el-card>
          </el-col>
        </el-row>
        <el-row>
            <div style="text-align: center; line-height: 40px; font-size: 20px;font-weight: bold;color:black;">
              YTD Total TEU Shipped
            </div>
          </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-card style="background-color: #ed7d31; border-radius: 50px;color: white;font-size: 20px;">
            {{ count1 }}
            </el-card>
          </el-col>
        </el-row>
        <el-row>
            <div style="text-align: center; line-height: 40px; font-size: 20px;font-weight: bold;color:black;">
              YTD Total Carrier Bookings
            </div>
          </el-row>
      </el-aside>

      <el-main style="padding: 0px;">
            <div style="text-align: center; line-height: 40px; font-size: 20px;font-weight: bold;text-decoration: underline;">
              KPI’s
            </div>
        <el-card style="background-color: #ed7d31;padding: 10px; border-radius: 50px;">
          <el-row>
            <div style="text-align: center; line-height: 30px; font-size: 18px;font-weight: bold;color:black;width: 180px;margin-left: 20px;border-radius: 15px;">
              <el-select v-model="selectWeek" clearable @change="selectWeeks()" placeholder="Select ATD weeks" style="background-color: #FFF;">
              <el-option label="All" value="All"></el-option>
              <el-option v-for="item in weekData" :key="item.week" :label="item.week" :value="item.week" />
              </el-select>
            </div>
          </el-row>

              <div style="height: 260px; margin: 20px;margin-top: 0px;">
                <div id="main" style="height: 260px; background-color:#FFF;">
                </div>
              </div>

              <div style="height: 260px; margin: 20px;">
                <div id="main1" style="height: 260px; background-color:#FFF;">
                </div>
              </div>
        </el-card>
      </el-main>

      <el-aside width="25%" style="padding: 0px;">
        <el-row>
          <div style="text-align: center; line-height: 40px; font-size: 20px;font-weight: bold;text-decoration: underline;color:black;">
              Current Outstanding Tasks
            </div>
          </el-row>
          <el-col :span="20" :offset="2">
            <el-card style="height: 600px;background-color: #ed7d31;padding: 10px; border-radius: 50px;">
              <div style=" background-color: #FFF; margin: 20px;">

                <el-table v-loading="loading" :data="list"
                :header-cell-style="tableHeaderCellStyle"
                :cell-style="tableCellStyle"
                :row-class-name="tableRowClassName" style="width: 100%;border:1px solid white; border-color:white"
                border
                >
                  <el-table-column label="Task" align="left" prop="taskName" min-width="100px" show-overflow-tooltip >
                    <template v-slot="scope">
                    <div v-html="scope.row.taskNameStr">
                    </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Status" align="left" prop="Status">
                    <template>
                    <div>
                      Overdue
                    </div>
                    <div>
                      Urgent
                    </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Quantity" align="left" prop="Quantity">
                    <template v-slot="scope">
                    <div>
                      {{ scope.row.overDueCount==null?'0':scope.row.overDueCount }}
                    </div>
                    <div>
                      {{ scope.row.urgentCount==null?'0':scope.row.urgentCount }}
                    </div>
                    </template>
                  </el-table-column>

                  Quantity
                </el-table>

              </div>
            </el-card>
          </el-col>
      </el-aside>
      </el-container>
    </el-container>
  </el-card>
  </div>
</template>

<style scoped>
.horizontal-scrollbar {
  height: 100px; /* 设置一个固定的高度 */
  overflow: hidden;
  white-space: nowrap; /* 防止内部内容换行 */
}

.horizontal-scrollbar .el-scrollbar__bar {
  bottom: 0; /* 将滚动条放置在底部 */
}

.content {
  display: inline-block; /* 让内容横向显示 */
  white-space: nowrap;
}

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple {
    /* background: #d3dce6; */
  }
  .el-header, .el-footer {
    /* background-color: #B3C0D1; */
    /* color: #333; */
    text-align: center;
  }
  .el-aside {
    background-color: #FFF;
    /* color: #333; */
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    /* background-color: #E9EEF3; */
    /* color: #333; */
    text-align: center;
    line-height: 160px;
  }
  .el-table /deep/ .one-row{
    background: #f8d7cd!important;
  }
  .el-table /deep/ .two-row{
    background: #fcece8!important;
  }
  .el-table /deep/  .cell {
    font-size: 16px !important;
  }
  .el-table /deep/ th .cell{
    font-size: 17px !important;
    font-weight: 700
  }
  .avticeTenant{
    background-color: #ed7d31 !important;
    color: #fff !important;
  }
</style>

<script>
import * as echarts from 'echarts';
import { groupByTaskName } from "@/api/order/task";
import { getTenantPage } from "@/api/system/tenant";
import { countTenantIgnore,countTEUTenantIgnore,ohaReport } from "@/api/shipment/shipment";


export default {
  name: "Report",
  components: { },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
        },
        title: [
    {
      left: 'center',
      text: 'Average days between receiving shipper booking and booking to carrier date',
                textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontFamily: 'figtree,Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
    },
    {
      bottom: '0px',
      left: 'center',
      text: 'ATD Week',
                textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontFamily: 'figtree,Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
    }
  ],
        toolbox: {
          show: true, //显示工具栏组件
          feature: {
            dataZoom: {
              show: false,
              yAxisIndex: 'none'
            },
            restore: {show: false},
            saveAsImage: {title:'Save as Image'}
          },
          restore: { //配置项还原
          show: false, //是否显示该工具
          },
          saveAsImage: { //保存为图片
          show: true, //是否显示该工具
          title:'Save'
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
        },
        yAxis: {
          type: 'value',
          name: 'Days',
          // boundaryGap: [0, 15],
          min:0,
          // max:15,
        },
        visualMap: {
        show: false,
        type: 'piecewise',
        dimension: 1,
        pieces: [{
            gt: 2,
            color: 'red'
        }, {
              gt: 0,
              lte: 2,
              color: '#92d050'
          }]
        },
        series: [
          {
           smooth: true,
            animation: true,
            name: 'Days',
            type: 'line',
            symbol: 'none',
            // symbolSize: 10,
            // symbol
            // sampling: 'lttb',
            lineStyle: {
              width: 3 // 设置线宽
            },
          }
        ]
      },
      option1: {
        tooltip: {
          trigger: 'axis',
        },
        title: [
    {
      left: 'center',
      text: 'Average days between cargo handover and ETD',
                textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontFamily: 'figtree,Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
    },
    {
      bottom: '0px',
      left: 'center',
      text: 'ATD Week',
                textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontFamily: 'figtree,Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
    }
  ],
        toolbox: {
          show: true, //显示工具栏组件
          feature: {
            dataZoom: {
              show: false,
              yAxisIndex: 'none'
            },
            restore: {show: false},
            saveAsImage: {title:'Save as Image'}
          },
          restore: { //配置项还原
          show: false, //是否显示该工具
          },
          saveAsImage: { //保存为图片
          show: true, //是否显示该工具
          title:'Save'
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          name: 'Days',
          // boundaryGap: [0, 35],
          min:0,
          // max:35,
        },
        visualMap: {
        show: false,
        type: 'piecewise',
        dimension: 1,
        pieces: [{
            gt: 20,
            color: 'red'
        }, {
              gt: 0,
              lte: 20,
              color: '#92d050'
          }]
        },
        series: [
          {
           smooth: true,
            animation: true,
            name: 'Days',
            type: 'line',
            symbol: 'none',
            // sampling: 'lttb',
            lineStyle: {
              width: 3 // 设置线宽为3
            },
          }
        ]
      },
      myChart:null,
      myChart1:null,
      timer:null,
      loading: true,
      list: [],
      tenantMap:{},
      tenantList: [],
      count1:0,
      count2:0,
      checkedTenant:{},
      weekData:{},
      selectWeek:null,

    };
  },
  beforeDestroy(){
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      {
        var chartDom = document.getElementById('main');
        this.myChart = echarts.init(chartDom);
      }
      {
        var chartDom = document.getElementById('main1');
        this.myChart1 = echarts.init(chartDom);
      }
      this.getTenantPage();
      this.groupByTaskName(null);
      this.countTenantIgnore(null);
      this.countTEUTenantIgnore(null);
      this.ohaReport(null);
    },

    chart(){
      this.myChart.clear();
      this.myChart.setOption(this.option,true);
    },
    chart1(){
      this.myChart1.clear();
      this.myChart1.setOption(this.option1,true);
    },
    groupByTaskName(tenantIds) {
      console.log(tenantIds)
      var req = {"status":1,"tenantIds":tenantIds};
      console.log(req)
      groupByTaskName(req).then((res)=>{
        this.loading = false;
        for (var temp of res.data) {
          temp.taskNameStr = temp.taskName.replace(' ','\<br\>')
          console.log(temp.taskNameStr)
        }
        this.list = res.data;
      })
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex%2==0) {
          return 'one-row';
        } else {
          return 'two-row';
        }
    },
    tableCellStyle() {
      return 'border-color: white; '
    },
    tableHeaderCellStyle() {
      return 'border-color: white; color: #ffffff; background:#ed7d31!important;padding: 0px 0px,textAlign: left;line-height:30px!important'
    },

    getTenantPage(){
      getTenantPage({pageNo:1,pageSize:100}).then(response => {
        for (var temp of response.data.list) {
          console.log(temp)
          if(temp.status==0&&temp.expireTime > new Date()&&temp.packageId!=0&&temp.id!=1) {
            this.tenantList.push(temp)
          }
        }
        });
    },
    setTenant(key) {
      this.selectWeek = null;
      if(this.checkedTenant[key]==true) {
        this.checkedTenant = {}
        this.$set(this.checkedTenant, key,false );
      } else {
        this.checkedTenant = {}
        this.$set(this.checkedTenant, key, true);
      }
      var ports=[]
      for(var key in this.checkedTenant){
        if(this.checkedTenant[key]){
          ports.push(key)
        }
      }
      var str = null;
      if(ports.length!=0) {
        str = ports.join(',');
      }
      this.groupByTaskName(str)
      this.countTenantIgnore(str);
      this.countTEUTenantIgnore(str);
      this.ohaReport(str);
    },
    countTenantIgnore(tenantIds) {
      var req = {"tenantIds":tenantIds};
      countTenantIgnore(req).then((res)=>{
        this.count1 = res.data;
      })
    },
    countTEUTenantIgnore(tenantIds) {
      var req = {"tenantIds":tenantIds};
      countTEUTenantIgnore(req).then((res)=>{
        this.count2 = res.data;
      })
    },
    ohaReport(tenantIds){
      var req = {"tenantIds":tenantIds};
      ohaReport(req).then((res)=>{
        this.weekData = res.data;
        console.log(res)
        this.option.series[0].data = []
        this.option1.series[0].data = []
        this.option.xAxis.data = []
        this.option1.xAxis.data = []

        // this.option.visualMap.pieces = []
        // var index = 0;
        // var oldTemp = null;

        for (var temp of res.data) {
          this.option.series[0].data.push(temp.day)
          this.option1.series[0].data.push(temp.day1)

          this.option.xAxis.data.push(temp.week)
          this.option1.xAxis.data.push(temp.week)

          // index++;
          // var green = {
          //   gt: index-1,
          //   lt: index,
          //   color: "green",
          // };
          // var red = {
          //   gt: index-1,
          //   lt: index,
          //   color: "red",
          // };
          // var red1 = {
          //   gt: index-2,
          //   lt: index-1,
          //   color: "red",
          // };
          // if(temp.day>2) {
          //   this.option.visualMap.pieces.push(red);
          //   if(oldTemp!=null&&oldTemp<=2){
          //     this.option.visualMap.pieces.push(red1);
          //   }
          // } else {
          //   this.option.visualMap.pieces.push(green);
          // }
          // oldTemp = temp

        }

        this.chart()
        this.chart1()
      })
    },
    selectWeeks() {
      if(this.selectWeek=='All') {
        this.ohaReport(null);

        this.option.title[1].text = 'ATD Week'
        this.option1.title[1].text = 'ATD Week'
      } else {
        this.option.title[1].text = 'ATD Day'
        this.option1.title[1].text = 'ATD Day'
        var data = null
        var weeks = this.weekData.filter(item => {
          return item.week===this.selectWeek;
        });
        if(weeks.length>0) {
          data = weeks[0];
        }
        console.log(data.weekData)
        this.option.series[0].data = []
          this.option1.series[0].data = []
          this.option.xAxis.data = []
          this.option1.xAxis.data = []
        for (var temp of data.weekData) {
          this.option.series[0].data.push(temp.days)
          this.option1.series[0].data.push(temp.days1)
          this.option.xAxis.data.push(this.parseTimeToZ1(temp.atdDate))
          this.option1.xAxis.data.push(this.parseTimeToZ1(temp.atdDate))
        }
        this.chart()
        this.chart1()
      }
    },

    parseTimeToZ1(timestamp) {
      if(!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
  }
};
</script>
