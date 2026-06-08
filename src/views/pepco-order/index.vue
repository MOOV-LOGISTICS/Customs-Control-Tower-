<template>
  <div style="margin: 10px;">
    <el-card class="pd-20">
      <div style="overflow: auto; width: calc(100%);">
        <el-row style="margin-top: 5px; float: none;">
          <div style="float: left; margin-left: 5px; margin-right: 5px;">
            <el-input
              v-model="queryParams.orderNumber"
              placeholder="Order Number"
              clearable
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch"
              @clear="handleSearch"
            />
          </div>
          <div style="float: left; margin-left: 5px; margin-right: 5px;">
            <el-button
              @click="handleSearch"
              icon="el-icon-search"
              style="background-color: #004F7C; color: white;"
              plain
            >Search</el-button>
            <el-button @click="handleClear" icon="el-icon-refresh" plain>Clear</el-button>
          </div>
        </el-row>
        <el-table
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="Order Number" prop="orderNumber" min-width="160" show-overflow-tooltip />
          <el-table-column label="Lines" prop="lines" width="100" align="center" />
          <el-table-column label="Article ID" prop="articleId" min-width="120" show-overflow-tooltip />
          <el-table-column label="TC ID" prop="tcId" min-width="120" show-overflow-tooltip />
          <el-table-column label="Order Type" prop="orderType" min-width="120" show-overflow-tooltip />
          <el-table-column label="Filename" prop="filename" min-width="180" show-overflow-tooltip />
          <el-table-column label="File Date" prop="fileTimestamp" min-width="130" show-overflow-tooltip />
        </el-table>
      </div>
      <div style="clear: both;"></div>
      <div>
        <pagination
          :total="total"
          :page.sync="queryParams.pageNo"
          small
          :limit.sync="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @pagination="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPepcoOrderPage } from '@/api/xmlcheck/xmlCheck'

export default {
  name: 'PepcoOrder',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      tableHeight: window.innerHeight - 299,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        orderNumber: ''
      }
    }
  },
  mounted() {
    this.fetchList()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    fetchList() {
      this.loading = true
      getPepcoOrderPage(this.queryParams)
        .then(response => {
          this.tableData = response.data.list
          this.total = response.data.total
        })
        .catch(error => {
          console.error('Failed to fetch pepco order data:', error)
          this.$message.error('Failed to load data')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearch() {
      this.queryParams.pageNo = 1
      this.fetchList()
    },
    handleClear() {
      this.queryParams = {
        pageNo: 1,
        pageSize: this.queryParams.pageSize,
        orderNumber: ''
      }
      this.fetchList()
    },
    handleResize() {
      this.tableHeight = window.innerHeight - 299
    }
  }
}
</script>

<style scoped>
/deep/ .el-table tbody tr:hover > td {
  background-color: #eff3f4 !important;
}
</style>
