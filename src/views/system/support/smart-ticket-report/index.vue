<template>
  <div class="app-container" style="width:95%;margin:0 auto;">
    <el-card style="padding: 20px;">
      <div class="dashboard-container">
        <div class="chart-grid">
          <!-- 状态图表 -->
          <status-chart :chart-data="chartData" :total-count="statusTotalCount" />
          
          <!-- 优先级图表 -->
          <priority-chart 
            :chart-data="chartData" 
            :total-count="statusTotalCount"
            @drill-down="handlePriorityDrillDown" 
          />
          
          <!-- 处理中优先级图表 -->
          <priority-inprocess-chart 
            :total-count="priorityInProcessTotalCount"
            ref="priorityInProcessChart"
          />
          
          <!-- 月度趋势图表 -->
          <monthly-trend-chart 
            :month-count="monthCount"
            ref="monthlyTrendChart"
          />
          
          <!-- 模块图表 -->
          <module-chart 
            :chart-data="chartData" 
            :total-count="statusTotalCount"
            class="full-width"
          />
          
          <!-- 角色区域图表 -->
          <role-region-chart 
            ref="roleRegionChart"
            class="full-width"
          />
          
          <!-- 解决时间图表 -->
          <resolution-time-chart 
            ref="resolutionTimeChart"
            class="full-width"
          />
        </div>
      </div>
    </el-card>

    <!-- 优先级详情弹窗 -->
    <priority-drill-down-dialog 
      :visible.sync="showDrillDownChart"
      :priority="currentDrillDownPriority"
    />
  </div>
</template>

<script>
import StatusChart from './components/StatusChart'
import PriorityChart from './components/PriorityChart'
import PriorityInprocessChart from './components/PriorityInprocessChart'
import MonthlyTrendChart from './components/MonthlyTrendChart'
import ModuleChart from './components/ModuleChart'
import RoleRegionChart from './components/Role-Region-Chart.vue'
import ResolutionTimeChart from './components/ResolutionTimeChart'
import PriorityDrillDownDialog from './components/PriorityDrillDownDialog'
import { getAllSupportTicketStatusPercent } from '@/api/system/supportTicket'

export default {
  name: 'smart-ticket-report',
  components: {
    StatusChart,
    PriorityChart,
    PriorityInprocessChart,
    MonthlyTrendChart,
    ModuleChart,
    RoleRegionChart,
    ResolutionTimeChart,
    PriorityDrillDownDialog
  },
  data() {
    return {
      chartData: {},
      statusTotalCount: 0,
      priorityInProcessTotalCount: 0,
      monthCount: 12,
      showDrillDownChart: false,
      currentDrillDownPriority: null
    }
  },
  mounted() {
    this.loadAllData()
  },
  methods: {
    async loadAllData() {
      await this.getStatusDatas()
      this.$refs.priorityInProcessChart.loadData()
      this.$refs.monthlyTrendChart.loadData()
      this.$refs.roleRegionChart.loadData()
      this.$refs.resolutionTimeChart.loadData()
    },
    
    async getStatusDatas() {
      try {
        const response = await getAllSupportTicketStatusPercent()
        this.chartData = response.data
        this.statusTotalCount = response.data.totalCount || 0
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },

    handlePriorityDrillDown(priority) {
      this.currentDrillDownPriority = priority
      this.showDrillDownChart = true
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: auto;
  }
}
</style>