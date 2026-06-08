<template>
  <div class="chart-item">
    <div class="chart-header">
      <div class="total-tickets" style="margin-bottom: 10px;">
        Monthly Ticket Trends
      </div>
    </div>
    <div ref="chart" style="width: 100%; height: 350px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { getMonthlyTicketCount } from '@/api/system/supportTicket'
import { showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'MonthlyTrendChart',
  props: {
    monthCount: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      chart: null,
      monthlyTrendData: new Map()
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
        const response = await getMonthlyTicketCount(this.monthCount)
        this.monthlyTrendData = new Map(Object.entries(response.data))

        if (this.monthlyTrendData.size === 0) {
          showNoData(this.chart)
        } else {
          this.updateChart()
        }
      } catch (error) {
        console.error('获取月度趋势数据失败:', error)
        showNoData(this.chart)
      }
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
      }

      const entries = Array.from(this.monthlyTrendData.entries())
      entries.sort((a, b) => a[0].localeCompare(b[0]))

      const months = entries.map(entry => entry[0])
      const counts = entries.map(entry => entry[1])

      const option = {
        title: {
          text: 'Monthly Ticket Trends',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const param = params[0]
            return `
              <div style="font-weight:bold">${param.name}</div>
              <div>Tickets: ${param.value}</div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: months.length > 6 ? 30 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: 'Ticket Count'
        },
        series: [
          {
            name: 'Tickets',
            type: 'line',
            data: counts,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#5470C6'
            },
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
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