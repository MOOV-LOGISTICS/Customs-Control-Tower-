<template>
  <div class="chart-item">
    <div class="chart-header">
      <div class="total-tickets">Average Ticket Resolution Time</div>
    </div>
    <div ref="chart" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { getModuleAvgResolutionTime } from '@/api/system/supportTicket'
import { showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'ResolutionTimeChart',
  data() {
    return {
      chart: null,
      resolutionTimeData: {}
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      showLoading(this.chart)
    },
    
    async loadData() {
      try {
        showLoading(this.chart)
        const response = await getModuleAvgResolutionTime()
        this.resolutionTimeData = response.data || {}

        if (Object.keys(this.resolutionTimeData).length === 0) {
          showNoData(this.chart)
        } else {
          this.updateChart()
        }
      } catch (error) {
        console.error('获取解决时间数据失败:', error)
        showNoData(this.chart)
      }
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
      }

      const data = Object.entries(this.resolutionTimeData).map(([name, value]) => ({
        name,
        value: parseFloat(value).toFixed(2)
      }))

      if (data.length === 0) {
        showNoData(this.chart)
        return
      }

      const option = {
        title: {
          text: 'Average Resolution Time by Module',
          top: 70,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const param = params[0]
            return `
              <div style="font-weight:bold">${param.name}</div>
              <div>Average Resolution Time: <strong>${param.value} Days</strong></div>
            `
          }
        },
        grid: {
          top: 60,
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Days',
          nameTextStyle: {
            fontSize: 14
          },
          axisLabel: {
            formatter: '{value}',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'line',
          data: data.map(item => parseFloat(item.value)),
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#5470C6'
          },
          itemStyle: {
            color: '#5470C6',
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(84, 112, 198, 0.3)'
              }, {
                offset: 1,
                color: 'rgba(84, 112, 198, 0.05)'
              }]
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 11
          }
        }]
      }

      this.chart.setOption(option)
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style scoped>
.chart-item {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.chart-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.total-tickets {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 8px 16px;
  background-color: #f5f7fa;
  border-radius: 20px;
  text-align: center;
}
</style>