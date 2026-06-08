<template>
  <div class="chart-item">
    <div class="chart-header">
      <div class="total-tickets">Inprocess Total Tickets: {{ totalCount }}</div>
    </div>
    <div ref="chart" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { getSupportTicketPriorityPercentInProcessStatus } from '@/api/system/supportTicket'
import { formatData, getBarOption, showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'PriorityInprocessChart',
  data() {
    return {
      chart: null,
      totalCount: 0,
      priorityInProcessData: {}
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
        const res = await getSupportTicketPriorityPercentInProcessStatus()
        this.priorityInProcessData = res.data.priorityPercentages
        this.totalCount = res.data.totalCount

        if (Object.keys(res.data.priorityPercentages).length === 0) {
          showNoData(this.chart)
        } else {
          this.updateChart()
        }
      } catch (error) {
        console.error('获取处理中优先级数据失败:', error)
        showNoData(this.chart)
      }
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
      }
      
      const formattedData = formatData(this.priorityInProcessData)
      const colors = ['#FFB347', '#FFCC33', '#FFDD59']
      const option = getBarOption('InProcess Status Priority', formattedData, colors)

      // 添加平均线
      option.series[0].markLine = {
        silent: true,
        data: [
          {
            type: 'average',
            name: 'Average'
          }
        ],
        label: {
          formatter: 'Avg: {c}%'
        }
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