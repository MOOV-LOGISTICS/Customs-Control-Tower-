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
import { formatStatusData, getBarOption, showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'StatusChart',
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
      chart: null,
      statusList: [
        { label: 'Submitted', value: '0' },
        { label: 'In process', value: '1' },
        { label: 'Rejected', value: '2' },
        { label: 'Solved', value: '3' }
      ]
    }
  },
  watch: {
    chartData: {
      handler(newData) {
        if (newData && newData.statusPercentages) {
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
      
      const statusData = formatStatusData(
        this.chartData.statusPercentages, 
        this.statusList
      )
      
      if (statusData.length === 0) {
        showNoData(this.chart)
      } else {
        this.chart.setOption(getBarOption('Status', statusData))
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