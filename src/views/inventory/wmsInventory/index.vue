<template>
  <div class="app-container">
    <el-card class="inventory-list pd-20" style="padding-top: 20px;">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="Product Name">
          <el-input v-model="queryParams.skuNameEn" clearable @change="handleQuery" />
        </el-form-item>
        <el-form-item label="Product Id">
          <el-input v-model="queryParams.skuId" clearable @change="handleQuery" />
        </el-form-item>

        <el-form-item style=" background-color: transparent;">
          <el-button @click="handleQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
          <el-button :loading="syncLoading" @click="handleSync" type="primary">
            Sync Inventory
            <i class="el-icon-refresh el-icon--right"></i>
          </el-button>
          <el-button @click="handleExport" type="primary">
            Export
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table v-loading="loading" :data="list" :height="height">
        <el-table-column label="Product Id" align="center" prop="skuId" />
        <el-table-column label="Product Name" align="center" prop="skuNameEn" />
        <el-table-column label="On hand Qty" align="center" prop="qty" />
        <el-table-column label="Value EUR" align="center" prop="totalPrice" />
        <el-table-column label="Unit" align="center" prop="skuUnit" />
        <el-table-column label="Spec" align="center" prop="skuSpec" />
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { inventoryPage, syncInventory, exportinventory } from '@/api/wms/wms-cc'
import { getBaseHeader } from '@/utils/request'
import { IconPark } from '@icon-park/vue/es/all'

export default {
  name: 'Inventory',
  components: { IconPark },
  data() {
    return {
      // 遮罩层
      loading: true,
      syncLoading: false,
      // 显示搜索条件
      showSearch: true,
      tableHeight: 0,
      // 总条数
      total: 0,
      // order_inventory列表
      list: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        skuId: undefined,
        skuNameEn: undefined
      },
      height: ''
    }
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 340
    this.getList()
  },
  methods: {
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 308
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      inventoryPage(this.queryParams).then(response => {
        this.list = response.data.list
        console.log(this.list)
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleExport() {
      console.log('export')
      this.$confirm('Do you want to export the data?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        exportinventory().then(response => {
          this.$download.excel(response, 'inventory.xlsx')
        })
      })
    },
    handleSync() {
      this.$confirm('Are you sure to sync inventory?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.syncLoading = true
          syncInventory()
            .then(response => {
              this.syncLoading = false
              this.$message({
                type: 'success',
                message: 'Sync success'
              })
              this.getList()
            })
            .catch(() => {
              this.syncLoading = false
              // this.$message({
              //   type: 'error',
              //   message: 'Sync failed'
              // })
            })
        })
        .catch(() => {
          this.syncLoading = false
          this.$message({
            type: 'info',
            message: 'Cancel Sync'
          })
        })
    }
  }
}
</script>
