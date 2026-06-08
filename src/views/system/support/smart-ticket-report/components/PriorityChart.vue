<template>
  <div class="chart-item">
    <div class="chart-header">
      <div class="total-tickets">Total Tickets: {{ totalCount }}</div>
    </div>
    <div ref="chart" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { formatData, getBarOption, showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'PriorityChart',
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      handler(newData) {
        if (newData && newData.priorityPercentages) {
          this.updateChart()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.chart.on('click', this.handleClick)
      showLoading(this.chart)
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
      }
      
      const priorityData = formatData(this.chartData.priorityPercentages)
      
      if (priorityData.length === 0) {
        showNoData(this.chart)
      } else {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
        this.chart.setOption(getBarOption('Priority', priorityData, colors))
      }
    },
    
    handleClick(params) {
      this.$emit('drill-down', params.name)
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