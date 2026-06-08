<template>
  <div class="page-container" ref="pageContainer">
    <el-card class="pd-20">
      <!-- 搜索区域 -->
      <el-row :gutter="10" style="margin-bottom: 10px;">
        <el-col :span="6">
          <el-input v-model="queryParams.orderNumber" placeholder="Order Number" size="small" clearable @clear="searchList" />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="searchList">Search</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table ref="singleTable" v-loading="loading" :data="tableData" :height="tableHeight" highlight-current-row row-key="id" style="width: 100%;" border>
        <el-table-column label="Order Number" prop="orderNumber" min-width="80" show-overflow-tooltip />
        <el-table-column label="Cargo Ready Date" min-width="100">
          <template #default="{row}">
            <div style="display: flex; align-items: center;">
              <span>{{ formatTimestamp(row.cargoReadyDate) }}</span>
              <el-button v-if="row.cargoReadyDate" type="text" icon="el-icon-edit" @click="handleEditDate(row)" style="margin-left: 8px;"></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Pending Status" prop="taskStatus" min-width="100" show-overflow-tooltip />
        <el-table-column label="Origin Country" prop="originCountry" min-width="100" show-overflow-tooltip />
      </el-table>

      <!-- 分页 -->
      <div style="margin-top: 10px; text-align: right;">
        <pagination :total="total" :page.sync="queryParams.pageNo" small :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50, 100]" @pagination="handlePageChange" />
      </div>

      <el-dialog title="Edit Cargo Ready Date" :visible.sync="dialogVisible" width="30%">
        <!-- 弹窗里改成只能选日期 -->
        <el-date-picker v-model="editForm.crdChangeDate" type="date" placeholder="Select date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitDateChange">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getOrderPageForChange, changePoByOrderNumber } from '@/api/order/header.js'

export default defineComponent({
  data() {
    return {
      loading: false,
      tableHeight: 500, // 设置默认高度
      tableData: [],
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        orderNumber: '',
        currentStatus: ''
      },
      dialogVisible: false,
      editForm: {
        orderNumber: '',
        crdChangeDate: ''
      }
    }
  },
  mounted() {
    this.updateTableHeight()
    window.addEventListener('resize', this.updateTableHeight)
    this.initList()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTableHeight)
  },
  methods: {
    updateTableHeight() {
      if (this.$refs.pageContainer) {
        const rect = this.$refs.pageContainer.getBoundingClientRect()
        this.tableHeight = window.innerHeight - rect.top - 180
      }
    },
    handleEditDate(row) {
      if (row.cargoReadyDate) {
        const date = new Date(Number(row.cargoReadyDate))
        // 直接取本地日期，避免时区差异
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        this.editForm = {
          orderNumber: row.orderNumber,
          crdChangeDate: formattedDate
        }
        this.dialogVisible = true
      }
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return ''
      const date = new Date(Number(timestamp))
      return date.toLocaleString() // or use a specific format
    },
    async initList(callback) {
      try {
        this.loading = true
        const res = await getOrderPageForChange(this.queryParams)

        // 打印响应数据，方便调试
        console.log('API响应数据:', res)

        // 更健壮的数据处理方式
        this.tableData = res?.data?.list || res?.list || []
        this.total = res?.data?.total || res?.total || 0

        if (callback) callback()
      } catch (err) {
        console.error('获取数据失败:', err)
        this.$message.error('加载列表失败: ' + (err.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    async submitDateChange() {
      try {
        this.loading = true

        const formatDate = date => {
          if (!date) return null
          const d = new Date(date)
          // 只保留日期部分，固定 00:00:00
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 00:00:00`
        }

        const payload = {
          orderNumber: this.editForm.orderNumber,
          crdChangeDate: formatDate(this.editForm.crdChangeDate)
        }

        console.log('Submitting payload:', payload)

        await changePoByOrderNumber(payload)
        this.$message.success('Date updated successfully')
        this.dialogVisible = false
        this.initList()
      } catch (err) {
        console.error('Failed to update date:', err)
        this.$message.error('Failed to update date: ' + (err.message || 'Unknown error'))
      } finally {
        this.loading = false
      }
    },

    searchList() {
      this.queryParams.pageNo = 1
      this.initList()
    },
    cleanSearch() {
      const pageSize = this.queryParams.pageSize
      this.queryParams = {
        pageNo: 1,
        pageSize: pageSize,
        orderNumber: '',
        currentStatus: ''
      }
      this.searchList()
    },
    handlePageChange() {
      this.initList()
    }
  }
})
</script>

<style scoped>
.page-container {
  position: relative;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
}

.pd-20 {
  padding: 20px;
}

/* 更可靠的表格样式 */
.el-table {
  margin-top: 10px;
}

/* 鼠标悬停样式 */
:deep(.el-table tbody tr:hover > td) {
  background-color: #eff3f4 !important;
}
</style>