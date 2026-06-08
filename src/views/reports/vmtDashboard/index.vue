<template xmlns="">

  <div class="app-container" style="width:95%;margin:0 auto;background:#fff;padding:20px">

    <el-row :gutter="20">
      <el-col :span="5">
        <el-date-picker
          type="months"
          v-model="queryParams.yearMonths"
          value-format="yyyy-MM"
          @change="handleMonthChange"
          placeholder="Month">
        </el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-select v-model="queryParams.tenantIds"  filterable clearable @clear="queryData" multiple
                   placeholder="Customers Name" size="mini"  :loading="getDisLoading"  loading-text="Loading...">
          <el-option v-for="item in tenantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="dataLoading"  @click="queryData"><i class="el-icon-search"></i> Search</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="top-card a" v-loading="shipmentLoading">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="totalShipmentNum"
            title="Total active shipments"
          ></el-statistic>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="top-card b" v-loading="shipmentLoading">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="totalConNum"
            title="Total Containers"
          ></el-statistic>

        </el-card>
      </el-col>
      <el-col :span="4"  v-loading="shipmentLoading">
        <el-card class="top-card c">
          <el-statistic
            group-separator=","
            :precision="dynamicPrecision"
            :value="totalTeuNum"
            title="Total TEU"
          ></el-statistic>

        </el-card>
      </el-col>
      <el-col :span="5"  v-loading="shipmentLoading" >
        <el-card class="top-card d">
          <div @click="showCustomersList">
            <el-statistic
              group-separator=","
              :precision="0"
              :value="totalCustomers"
              title="Total Active Customers"
            ></el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5"  v-loading="shipmentLoading">
        <el-card class="top-card e">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="totalShippers"
            title="Total Active Shippers"
          ></el-statistic>
        </el-card>
      </el-col>

    </el-row>
    <el-row v-if="customersDiv && customersList.length>0" style="padding: 20px 20px 0px 20px;">
      <el-col>
        <div>
          <el-table :data="customersList" stripe
                    max-height="300"
                    style="width: 100%; font-weight: 600;">
            <el-table-column property="customer_name" label="Customer Name" min-width="250" show-overflow-tooltip></el-table-column>
            <el-table-column property="shipment_num" label="Total active shipments" min-width="200"></el-table-column>
            <el-table-column property="con_num" label="Total Containers" min-width="200"></el-table-column>
            <el-table-column property="teu_num" label="Total TEU" min-width="200"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="md-card a" v-loading="shipmentLoading">
          <div class="out-div" id="a-chat"  >

          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="md-card b" v-loading="shipmentLoading">
          <div class="out-div" id="b-chat" >

          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="md-card c" v-loading="shipmentLoading">
          <div class="out-div"  id="c-chat" >

          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>


</template>
<script>
  import * as echarts from 'echarts';
  import { getVMTCustomerReports , getDeptReportData} from "@/api/bi/bi";
  import { listDept } from "@/api/system/dept";
  import {  getTenantIdListOfActive2 } from "@/api/system/tenant";


  export default {
    name: "MfcReport",
    data() {
      return{
        dataLoading:false,
        customerList: [],
        shipmentLoading: false,
        total: 0,
        getDisLoading:false,
        queryParams: {
          year: null,
          month: null,
          yearMonths: [],
          customer: [],
        },
        totalShipmentNum: 0,
        totalConNum: 0,
        totalTeuNum: 0,
        totalCustomers: 0,
        totalShippers: 0,
        reportData: [],
        tenantList:[],
        customersDiv: false,
        customersList:[],
      }
    },
    computed: {
      // 计算属性，根据 value2 是否有小数来决定 precision
      dynamicPrecision() {
        // 转换为字符串，然后检查是否包含小数点后的数字
        // 注意：这个方法可能不适用于非常大或非常小的数，因为 JavaScript 的浮点数表示可能不准确
        const valueStr = this.totalTeuNum.toString();
        const dotIndex = valueStr.indexOf('.');

        // 如果没有小数点或小数点后没有数字，则返回 0 或不传 precision 属性
        // Element UI 默认不传 precision 属性时不会显示小数部分
        if (dotIndex === -1 || (dotIndex !== -1 && dotIndex === valueStr.length - 1)) {
          return 0; // 或者你可以不返回任何值，让 Element UI 默认处理
        }
        // 否则，返回你希望显示的小数位数
        return 1;
      },
    },
    created() {
      let now = new Date();
      let year = now.getFullYear();
      this.queryParams.year = year
      // 获取当前月份，getMonth()是从0开始的，所以需要+1
      let month = now.getMonth() + 1;
      let formattedMonth = month.toString().padStart(2, '0');
      this.queryParams.yearMonths[0] = year+"-"+formattedMonth

      this.queryData()
      this.getParties()
      this.getTenantPage()
    },
    mounted: function() {

    },
    methods: {
      groupReportDataByCustomer(){
        //分组统计
        var groupedData = this.reportData.reduce((acc, curr) => {
          const customerName = curr.customer_name ? curr.customer_name: '';
          // 检查acc中是否已存在该customerName的条目
          if (!acc[customerName]) {
            // 如果不存在，则初始化该条目
            acc[customerName] = {
              teu_num: 0,
              con_num: 0,
              shipment_num: 0,
              customer_name: customerName,
            };
          }
          // 累加需要的字段
          acc[customerName].teu_num += curr.teu_num;
          acc[customerName].con_num += curr.con_num;
          acc[customerName].shipment_num += curr.shipment_num;
          return acc;
        }, {});

        // 转换groupedData为数组
        this.customersList =  Object.entries(groupedData)
          .sort((a, b) => b[1].shipment_num - a[1].shipment_num)
          .map(([customerName, data]) => ({
          ...data, // 展开累加后的数据
          customer_name: customerName, // 将customer_name添加回对象中
        }));
        this.totalCustomers = this.customersList.length
      },
      showCustomersList(){
        this.customersDiv = !this.customersDiv
      },
      getTenantPage(){
        getTenantIdListOfActive2( ).then(response => {
          this.tenantList=response.data
        });
      },
      handleMonthChange(value) {

      },
      getParties(){
        listDept({partyRole: 'customer' }).then((response) => {
          this.customerList = response.data
        })
      },
      queryData(){
        this.dataLoading = true
        var data = this.queryParams

        this.shipmentLoading = true
        getVMTCustomerReports(data).then(res =>{
          if(res.data){
             this.totalTeuNum = res.data.reduce((acc, obj) => acc + obj.teu_num, 0) ;
             this.totalConNum = res.data.reduce((acc, obj) => acc + obj.con_num, 0);
             this.totalShipmentNum = res.data.reduce((acc, obj) => acc + obj.shipment_num, 0);
             this.reportData = res.data
             this.initChart1()
             this.initChart2()
             this.initChart3()
             this.groupReportDataByCustomer()
          }
          this.shipmentLoading = false
          this.dataLoading = false
        })

        getDeptReportData(data).then(res =>{
           if(res.data){
               this.totalShippers = res.data.totalShippers;
               // this.totalCustomers = res.data.totalCustomers;
           }
        })

      },
      initChart3(){
        var chartDom = document.getElementById('c-chat');
        var myChart = echarts.init(chartDom);

        // 处理数据，将具有相同op_user的teu_num进行累加
        var processedData = this.reportData.reduce((acc, curr) => {
            acc[curr.op_user] = (acc[curr.op_user] || 0) + curr.teu_num;
            return acc;
        }, {});

        // 将处理后的数据转换为适合ECharts的格式
        var dataForChart = Object.keys(processedData).map(op_user => ({
            op_user: op_user,
            teu_num: processedData[op_user]
        }));

        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
              text: 'Total Teu weekly trend'
            },
            legend: {
                data: ['Container Number']
            },
            xAxis: {
              type: 'category',
              data: dataForChart.map(item => item.op_user  != 'undefined' ? item.op_user : ''),
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
                        fontSize: 14, // 文字大小
                        fontWeight: 'bold',
                        color: '#666666'
                    }
                },
                // 如果需要旋转文字，可以使用 rotate 属性
                rotate: 10, // 旋转的角度
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
                data: dataForChart.map(item => item.teu_num),
                type: 'bar',
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
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

      initChart2(){
        var chartDom = document.getElementById('b-chat');
        var myChart = echarts.init(chartDom);

        // 处理数据，将具有相同carrier的con_num进行累加
        var processedData = this.reportData.reduce((acc, curr) => {
            acc[curr.carrier] = (acc[curr.carrier] || 0) + curr.con_num;
            return acc;
        }, {});
        // 将处理后的数据转换为适合ECharts的格式
        var dataForChart = Object.keys(processedData).map(carrier => ({
            carrier: carrier,
            con_num: processedData[carrier]
        }));

        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
              text: 'Total containers booked carrier trend'
            },
            legend: {
                data: ['Container Number'] // 这里只有一个图例项，因为我们在一个系列中展示了所有carrier
            },
            xAxis: {
              type: 'category',
              data: dataForChart.map(item => item.carrier),
              axisTick: {
                alignWithLabel: true
              },
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                interval: 0,
                show: true,
                   rich: {
                    bold: {
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#666666'
                    }
                },
                rotate: 0, // 旋转的角度
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
                data: dataForChart.map(item => item.con_num), // 提取每个carrier的累计con_num作为数据点
                type: 'bar', // 指定图表类型为柱状图
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },
                label: {
                    show: true, // 显示标签
                    position: 'top', // 标签的位置
                    valueAnimation: true, // 是否显示动画效果
                    formatter: '{c}' // 标签的格式化，{c}表示数据值
                },
            }]
        };
        option && myChart.setOption(option);
        // 调整图表大小以适应容器
        myChart.resize();
      },

      initChart1(){
        var chartDom = document.getElementById('a-chat');
        var myChart = echarts.init(chartDom);

        // 处理数据，将具有相同customer_name的teu_num进行累加
        var processedData = this.reportData.reduce((acc, curr) => {
            acc[curr.customer_name] = (acc[curr.customer_name] || 0) + curr.teu_num;
            return acc;
        }, {});

        // 将处理后的数据转换为适合ECharts的格式
        var dataForChart = Object.keys(processedData).map(customer_name => ({
            customer_name: customer_name,
            teu_num: processedData[customer_name]
        }));

        let option = {
          title: {
            text: 'Total bookings weekly trend'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: dataForChart.map(item => item.customer_name != 'undefined' ? item.customer_name : ''),
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
                      fontSize: 14, // 文字大小
                      fontWeight: 'bold',
                      color: '#666666'
                  }
              },
              // 如果需要旋转文字，可以使用 rotate 属性
              rotate: 10, // 旋转的角度
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
            data: dataForChart.map(item => item.teu_num),
            type: 'bar',
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
    cursor: pointer;
    background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
  }
  .top-card.e{
    background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  }
  .md-card {
    margin-top: 15px;
  }
  .md-card .out-div{
    min-height: 400px;
    width:100%;
    padding: 20px 20px 0px 20px;
  }
</style>
