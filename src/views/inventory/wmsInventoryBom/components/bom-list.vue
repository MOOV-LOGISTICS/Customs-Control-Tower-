<template>
  <el-card class="inventory-list pd-20" style="padding-top: 20px;">
    <!-- 搜索工作栏 -->
    <el-form :model="listQuery" ref="queryForm" size="small" :inline="true">
      <el-form-item label="Product Name">
        <el-input v-model="listQuery.productSkuName" clearable @change="handleQuery" />
      </el-form-item>
      <el-form-item label="Product SKU">
        <el-input v-model="listQuery.productSkuId" clearable @change="handleQuery" />
      </el-form-item>

      <el-form-item style=" background-color: transparent;">
        <el-button @click="handleQuery" type="primary">
          Search
          <i class="el-icon-search el-icon--right"></i>
        </el-button>
        <el-button @click="handleCalculate" type="primary">
          Calculate requested qty BOM
          <i class="el-icon-view el-icon--right"></i>
        </el-button>
        <el-button type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        <!-- <el-button type="primary" icon="el-icon-upload2" @click="importSelect">ImportSearch</el-button> -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      ref="table"
      :data="list"
      @selection-change="handleSelection"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      lazy
      :load="loadSubList"
      :tree-props="{children: 'subList', hasChildren: 'hasChildren'}"
      border
    >
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column label="Category" align="center" prop="category" />
      <el-table-column label="Product Name" width="120" align="center" prop="productSkuName" />
      <el-table-column label="Product Sku" width="120" align="center" prop="productSkuId" />
      <el-table-column label="Qty Requested" width="120" align="center">
        <template slot-scope="{ row }">
          <div v-if="row.level === 1" style="white-space: normal; word-break: keep-all; overflow-wrap: break-word;">
            <el-input v-model="row.qtyReq" @change="handleQtyChange(row)"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Qty Per Product" width="120" align="center" prop="itemQty">
        <template slot-scope="{ row }">
          <div v-if="row.level === 1"></div>
          <span v-else>{{ row.itemQty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Total Value EUR" width="120" align="center" prop="totalPrice" />
      <el-table-column label="Picking" align="center" prop="picking" />
      <el-table-column label="Assembling Kit" width="120" align="center" prop="assemblingKit" />
      <el-table-column label="Pick Pack Kit" align="center" prop="pickPackKit" />
      <el-table-column label="Reception Packing Size (cm)" width="160" align="center" prop="packingSize" />
      <el-table-column label="Number Per Box" width="120" align="center" prop="qtyPerBox" />
      <el-table-column label="Origin" align="center" prop="origin" />
      <el-table-column label="Supplier" align="center" prop="supplier" />
      <el-table-column label="BOM Level" align="center" prop="level" />
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 弹出框 -->
    <import-dialog ref="importDialog" @successs="handleQuery"></import-dialog>
    <calculate-dialog ref="calculateDialog"></calculate-dialog>
  </el-card>
</template>

<script>
import ImportDialog from './import-dialog.vue'
import CalculateDialog from './calculate-dialog.vue'
import { itemBomPage, itemBomSubList } from '@/api/wms/wms-cc'

export default {
  name: 'BomList',
  components: { ImportDialog, CalculateDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        parentId: 0,
        productSkuId: undefined,
        productSkuName: undefined
      },
      selectedRows: [],
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    activeTab() {
      if (this.list.length <= 0) {
        this.getList()
      }
    },
    // 获取列表
    getList() {
      this.loading = true
      itemBomPage(this.listQuery).then(response => {
        response.data.list.forEach(v => {
          v.qtyReq = 0
        })
        this.list = [...response.data.list]
        this.total = response.data.total
        this.loading = false
      })
    },
    // 搜索事件
    handleQuery() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    // 计算事件
    handleCalculate() {
      if (this.selectedRows.length === 0) {
        this.$message({
          message: 'Please select the data to calculate',
          type: 'warning'
        })
        return
      }
      this.$refs.calculateDialog.openDialog(this.selectedRows)
    },
    // 导入事件
    handleImport() {
      this.$refs.importDialog.openDialog(1)
    },
    loadSubList(tree, treeNode, resolve) {
      itemBomSubList({ productSkuId: tree.productSkuId })
        .then(response => {
          const list = response.data
          console.log('Received list:', list)
          list.forEach(v => {
            v.productSkuId = v.itemSkuId
            v.productSkuName = v.itemSkuName
          })
          // 处理返回的数据
          resolve(list)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    selectable(row) {
      return row.level === 1
    },
    handleSelection(selection) {
      this.selectedRows = selection
    },
    handleQtyChange(row) {
      if (row.qtyReq > 0) {
        this.$refs.table.toggleRowSelection(row, true)
      } else {
        this.$refs.table.toggleRowSelection(row, false)
      }
    }
  }
}
</script>