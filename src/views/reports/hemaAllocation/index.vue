<template>

  <div>
    <el-card>
      <el-row>
        <el-col>

          <el-form
            :model="queryParams"
            size="small"
            :inline="true"
            label-width="10px"
          >
            <el-row
              style="text-align: center; align-items: center; display: flex; padding-top: 20px;  padding-bottom: 10px;">
              <el-col :span="1"> Year: </el-col>
              <el-col :span="3">
                <el-date-picker
                  v-model="queryParams.etdYear"
                  type="year"
                  :picker-options="pickerYearOptions"
                  placeholder="Year"
                  format="yyyy"
                  value-format="yyyy"
                >
                </el-date-picker>
              </el-col>
              <el-col :span="1"> Voyage:</el-col>
              <el-col :span="4">
                <el-select v-model="queryParams.voyage"
                           clearable filterable
                           placeholder="Voyage">
                  <el-option
                    v-for="item in voyageSelectList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-button type="primary"
                           @click="handleQuery()"><i class="el-icon-search"></i> Search
                </el-button>
              </el-col>
            </el-row>

          </el-form>

          <el-divider></el-divider>

          <el-card class="box-card" shadow="always" :body-style="{ padding: '20px' }">
            <div id="allocationChart" :style="{ height: height+'px' }"></div>
          </el-card>
        </el-col>
      </el-row>
<!--      <el-row>-->
<!--        <el-col>-->
<!--          <el-card class="tshg-card" :body-style="{ padding: '20px' }" shadow="always" style="min-height:220px">-->
<!--            table.....-->
<!--          </el-card>-->
<!--          <el-card class="box-card" :body-style="{ padding: '20px' }" shadow="always">-->

<!--          </el-card>-->
<!--        </el-col>-->
<!--      </el-row>-->

    </el-card>

  </div>


</template>
<script>
  import { getBaseHeader } from "@/utils/request";
  import * as echarts from "echarts";
  require("echarts/theme/macarons"); // echarts theme
  import { getHemaAllocation, getValueDisList} from "@/api/booking/contract";

  export default {
    name: "HEMA_AllocationReport",
    components: {},
    data() {
      return{
          height:'',
          allocationChart:null,
          tableData:[],
          tableNumData:[],
          totalData:[],
          queryParams:{
            etdYear: '',
            vessel: null,
            voyage: null,
            CarrierGroup: 'TSHG',
          },
          voyageSelectList:[],
          dialogAllVisible:false,
          pickerYearOptions: {
            disabledDate(time) {
              // 禁用2022年之前的日期
              return time.getFullYear() < 2022;
            },
          },
      }
    },
    computed: {
    },
    created() {
      const clientHeight = document.documentElement.clientHeight;
      this.height = clientHeight - 270;
      this.queryParams.etdYear = new Date().getFullYear()+''
      this.handleQuery();
    },
    mounted: function() {

    },
    methods: {
      handleQuery() {
        this.getValueDisList()
        this.initAllocationData();
      },
      getValueDisList(){
        getValueDisList(this.queryParams).then((response) => {
          if(response.data){
            this.voyageSelectList = response.data.voyageList
          }
        })
      },
      initAllocationData(val){
        this.dialogAllVisible = true
        getHemaAllocation( this.queryParams).then((response) => {
          if(response && response.data){
            this.tableData = response.data
            this.tableNumData = this.tableData
            setTimeout(() => {
              this.initChart(val)
            }, 300);
          }
        });
      },

      initChart(val) {
        var vm = this
        // 检查是否已经存在ECharts实例并销毁它
        if (this.allocationChart && !this.allocationChart.isDisposed()) {
          this.allocationChart.dispose();
        }

        var doc = document.getElementById('allocationChart')

        if(doc == null){
          this.dialogAllVisible = false
          return
        }
        this.allocationChart = echarts.init(doc , "macarons");
        var data = this.tableData

        for(var i=0; i < data.length; i++){
          // (Booked / Total   allocation on voyage)
          data[i]['bfb'] =  parseFloat((data[i]['bookedTeu'] / data[i]['allocationTeu'])*100).toFixed(2);
        }
        var maxBfb = Math.max(...data.map(item => item.bfb), 100)
        // 3. 如果最大值超过 100，则将其调整为最近的整十倍数
        if (maxBfb > 100) {
          maxBfb = Math.ceil(maxBfb / 10) * 10; // 向上取整到十位
        }
        var name = localStorage.getItem('TENANT_NAME');
        let option = {
            title: [{
                text: name+'\nBooked TEU versus Allocation TEU',
                left: 'center',
                textStyle: {
                    fontSize: 20,
                    color: '#333'
                }
              },
              {
                text: 'Voyage & ATD',
                left: 'center',
                bottom: 25, // 或者调整bottom的值使其位于x轴下方
                textStyle: {
                    fontSize: 18,
                    color: '#333'
                }
              }
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                },
                formatter: params => {
                    let res = `<strong>${params[0].axisValue}</strong><br>`;
                    params.forEach(item => {
                        if(item.seriesName === 'Booked vs Allocation TEU %') {
                            const booked = option.series[0].data[item.dataIndex];
                            const total = option.series[3].data[item.dataIndex];
                            // (Booked / Total   allocation on voyage)
                            const val = parseFloat((booked / total)*100).toFixed(2);
                            res += `${item.marker} ${item.seriesName}: ${val}%<br>`;
                        } else {
                            res += `${item.marker} ${item.seriesName} TEU: ${item.value} <br>`;
                        }
                    });
                    return res;
                }
            },
            legend: {
                data: ['Booked', 'Not booked', 'Booked vs Allocation TEU %'],
                textStyle: {
                  fontSize: 14
                },
                bottom: 0
            },
            grid: {
                top: 70,
                bottom: 130
            },
            xAxis: {
                type: 'category',
                data: data.map(group => group.voyage),
                axisLabel: {
                    formatter: params => {
                      //替换第一个
                      return params.replace('-', "\n")
                    },
                    textStyle: {
                        fontSize: 14,
                        color: '#333333'
                    },
                    interval: 0,
                    rotate: 0,
                    margin: 20,
                    align: 'center',
                    lineHeight: 20
                },
                splitArea: {
                    show: false // 隐藏 x 轴的斑马纹
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Usage of Allocation in TEU',
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: Math.max(...data.map(item => item.allocationTeu)) + 20, // 获取最大Teu值
                    interval: 10,
                    nameTextStyle: {
                      fontSize: 18
                    },
                    axisLabel: {
                        fontSize: 16
                    },
                    splitArea: {
                        show: false // 隐藏 y 轴的斑马纹
                    }
                },
                {
                    type: 'value',
                    show: true,
                    nameLocation: 'middle',
                    nameGap: 35,
                    max: maxBfb , // 获取最大百分比
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}%',
                        fontSize: 16
                    },
                    splitArea: {
                        show: false // 隐藏 y 轴的斑马纹
                    }
                }
            ],
            series: [
                {
                    name: 'Booked',
                    type: 'bar',
                    stack: 'Ad',
                    barGap: 0,
                    data: data.map(group => group.bookedTeu),
                    itemStyle: { color: 'rgb(107, 204, 136)' },
                    barMaxWidth: 120,  // 设置柱子的最大宽度
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}',
                        fontSize: 16
                    }
                },
                {
                    name: 'Not booked',
                    type: 'bar',
                    stack: 'Ad',
                    barGap: 0,
                    data: data.map(group => group.notBookedTeu),
                    itemStyle: { color: 'rgb(238, 173, 14)' },
                    barMaxWidth: 120,  // 设置柱子的最大宽度
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}',
                        fontSize: 16
                    }
                },
                {
                    name: 'Booked vs Allocation TEU %',
                    type: 'line',
                    yAxisIndex: 1,
                    symbolSize: 12,
                    lineStyle: { width: 2 },
                    itemStyle: { color: 'rgb(2, 150, 255)' },
                    smooth: false,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: params => {
                          const booked = option.series[0].data[params.dataIndex];
                          const total = option.series[3].data[params.dataIndex];
                          // (Booked / Total   allocation on voyage)
                          return parseFloat((booked / total)*100).toFixed(1) +'%';
                        },
                        color: 'rgb(2, 150, 255)',
                        fontSize: 16
                    },
                    data: data.map(group => group.bfb),
                },
                { // 新增总数计算系列
                  name: 'Total',
                  type: 'bar',
                  stack: 'Ad',
                  data: data.map(group => group.allocationTeu),
                  label: {
                    show: false,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 16
                  },
                  itemStyle: { color: 'transparent' } // 隐藏柱体
                },
            ]
        };

        // 构造图表配置项

        this.allocationChart.setOption(option)
        // 调整图表大小以适应容器
        this.allocationChart.resize();

        this.dialogAllVisible = false

      },
    },
    destroyed() {
    }
  };
</script>
<style>


</style>
