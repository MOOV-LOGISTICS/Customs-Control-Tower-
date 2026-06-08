<template>
  <div class="chart-item">
    <div class="chart-header">
      <div class="total-tickets">Total Tickets: {{ totalCount }}</div>
    </div>
    <el-form>
      <el-row :gutter="24" style="margin-bottom: 10px;">
        <el-col :span="18"></el-col>
        <el-col :span="6">
          <el-select 
            v-model="selectedCountry" 
            clearable 
            size="mini" 
            placeholder="Filter by Region"
            style="width: 200px" 
            @change="loadData"
          >
            <el-option 
              v-for="c in countryOptions" 
              :key="c" 
              :label="c" 
              :value="c" 
            />
          </el-select>
        </el-col>
      </el-row>
    </el-form>
    <div ref="chart" style="width:100%;height:350px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { getRoleRegionStats } from '@/api/system/supportTicket'
import { showLoading, showNoData } from './ChartUtils.js'

export default {
  name: 'RoleRegionChart',
  data() {
    return {
      chart: null,
      selectedCountry: null,
      countryOptions: [],
      totalCount: 0
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
        const res = await getRoleRegionStats(this.selectedCountry)
        const data = res.data.roleRegionStatVOList || []
        this.totalCount = res.data.totalTickets || 0
        
        if (!data.length) {
          showNoData(this.chart)
          return
        }

        // 初始化地区选项
        if (!this.countryOptions.length) {
          this.countryOptions = [...new Set(data.map(i => i.country).filter(Boolean))]
        }

        const roleMap = {}
        data.forEach(i => {
          roleMap[i.roleName] = (roleMap[i.roleName] || 0) + i.ticketCount
        })

        const roles = Object.keys(roleMap)
        const counts = roles.map(r => roleMap[r])

        const colors = [
          '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
          '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F',
          '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC'
        ]

        this.chart.setOption({
          title: {
            text: 'Tickets by Role & Region',
            left: 'center',
            top: 70,
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          color: colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: params => {
              const param = params[0]
              return `
                <div style="font-weight:bold">${param.name}</div>
                <div>Ticket Count: ${param.value}</div>
              `
            }
          },
          grid: {
            top: 40,
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: roles,
            axisLabel: {
              rotate: 30,
              interval: 0
            }
          },
          yAxis: {
            type: 'value',
            name: 'Ticket Count'
          },
          series: [
            {
              type: 'bar',
              data: counts.map((count, index) => ({
                value: count,
                itemStyle: {
                  color: colors[index % colors.length],
                  borderRadius: [4, 4, 0, 0]
                }
              })),
              label: {
                show: true,
                position: 'top',
                formatter: '{c}'
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
      } catch (error) {
        console.error('获取角色区域数据失败:', error)
        showNoData(this.chart)
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

.el-row {
  display: flex;
}
</style>