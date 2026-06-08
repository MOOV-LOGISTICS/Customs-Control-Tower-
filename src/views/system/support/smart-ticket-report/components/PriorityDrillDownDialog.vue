<template>
  <el-dialog 
    :title="`Priority Details: ${priority || ''}`" 
    :visible.sync="dialogVisible"
    width="80%" 
    top="5vh"
    @close="handleClose"
  >
    <div ref="chart" style="width: 100%; height: 500px;"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { getPriorityStatusBreakdown } from '@/api/system/supportTicket'
import { formatStatusData, showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'PriorityDrillDownDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      default: null
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
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.priority) {
        this.$nextTick(() => {
          this.initChart()
          this.loadData()
        })
      }
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) return
      
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart, 'macarons')
      } else {
        this.chart.clear()
      }
      showLoading(this.chart)
    },
    
    async loadData() {
      if (!this.priority) return
      
      try {
        const res = await getPriorityStatusBreakdown({ priority: this.priority })
        const statusData = formatStatusData(res.data.statusPercentages, this.statusList)

        if (statusData.length === 0) {
          showNoData(this.chart)
          return
        }

        this.updateChart(statusData)
      } catch (error) {
        console.error('加载优先级详情失败:', error)
        showNoData(this.chart)
      }
    },
    
    updateChart(statusData) {
      const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F']

      this.chart.setOption({
        title: {
          text: `Status Breakdown for ${this.priority}`,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            const param = params[0]
            return `
              <div style="font-weight:bold">${param.name}</div>
              <div>Percentage: ${param.value}%</div>
              <div>Count: ${param.data.count}</div>
            `
          }
        },
        xAxis: {
          type: 'category',
          data: statusData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: statusData.length > 5 ? 30 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: 'Percentage (%)',
          max: 100
        },
        series: [
          {
            name: 'Status',
            type: 'bar',
            data: statusData.map((item, index) => ({
              value: item.value,
              count: item.count,
              name: item.name,
              itemStyle: {
                color: colors[index % colors.length]
              }
            })),
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return `${params.value}% (${params.data.count})`
              }
            },
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    
    handleClose() {
      this.dialogVisible = false
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
.dialog-footer {
  text-align: center;
}
</style>