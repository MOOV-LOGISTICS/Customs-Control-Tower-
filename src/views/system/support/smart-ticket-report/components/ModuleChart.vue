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
import { formatData, getModuleChartOption, showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'ModuleChart',
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
        if (newData && newData.modulePercentages) {
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
      showLoading(this.chart)
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
      }
      
      const moduleData = formatData(this.chartData.modulePercentages)
      
      if (moduleData.length === 0) {
        showNoData(this.chart)
      } else {
        this.chart.setOption(getModuleChartOption('Module', moduleData))
      }
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