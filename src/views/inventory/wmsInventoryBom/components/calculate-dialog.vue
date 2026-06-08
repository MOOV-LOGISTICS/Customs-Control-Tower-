<template>
  <!-- 弹出框 -->
  <el-dialog title="Generate Product Details" :visible.sync="dialogVisible" @close="handleClose" width="80%">
    <!-- Ethan: hasChildren对应的字段有值时，无法渲染展开行 -->
    <el-table v-loading="loading" :data="treeTableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all :tree-props="{children: 'subList', hasChildren: 'hasSub'}">
      <el-table-column label="Category" prop="category" />
      <el-table-column label="Product Name" prop="productSkuName" />
      <el-table-column label="Product SKU" prop="productSkuId" />
      <el-table-column label="Qty Per Product" prop="itemQty" />
      <!-- <el-table-column label="inventory" prop="inventoryQty" />
      <el-table-column label="remain" prop="remainQty" />-->
      <el-table-column prop="qtyReq" label="Requested Quantity">
        <template slot-scope="{ row }">
          <div>{{ row.level==1 ? row.qtyReq : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Required Qty Components" width="150">
        <template slot-scope="{ row }">
          <div>{{ row.level==2||row.level==3 ? row.qtyReq : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="inventoryQty" label="Inventory on hand">
        <template slot-scope="{ row }">
          <div :style="invQtyStyle(row)">{{ row.level !==1 ? row.inventoryQty : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="remainQty" width="180" label="Potential Remaining Inventory">
        <template slot-scope="{ row }">
          <div :style="remainQtyStyle(row)">{{ row.level !==1 ? row.remainQty : '-' }}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { itemBomTreeWithInventory } from '@/api/wms/wms-cc'
import { Loading } from 'element-ui'

export default {
  name: 'CalculateDialog',
  data() {
    return {
      dialogVisible: false,
      loading: false,
      treeTableData: [],
      selectedRows: []
    }
  },
  created() {},
  methods: {
    openDialog(selectedRows) {
      // 打开对话框时执行的逻辑
      this.dialogVisible = true
      this.selectedRows = selectedRows
      this.getList()
    },
    getList() {
      let params = []
      this.selectedRows.forEach(row => {
        params = [...params, { bomId: row.id, qtyReq: row.qtyReq }]
      })
      this.loading = true
      // 执行查询
      itemBomTreeWithInventory(params).then(response => {
        console.log(response.data)
        this.treeTableData = response.data
        this.loading = false
      })
    },
    handleClose() {
      // 关闭对话框时执行的逻辑
      this.dialogVisible = false
      // 清除任何可能的副作用或重置状态
      this.treeTableData = []
    },
    invQtyStyle(row) {
      if (row.level !== 1 && row.inventoryQty <= 0) {
        return { color: 'red', fontWeight: 'bold' }
      }
      return {}
    },
    remainQtyStyle(row) {
      if (row.level !== 1 && row.remainQty <= 0) {
        return { color: 'red', fontWeight: 'bold' }
      }
      return {}
    }
  }
}
</script>