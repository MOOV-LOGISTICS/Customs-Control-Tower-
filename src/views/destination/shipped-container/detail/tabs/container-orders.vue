<template>
  <div style="margin-top: -25px;  " v-loading="loading">
    <!-- <h3>container orders 表单</h3> -->
    <el-table :data="containerOrders" height="250" style="width: 100%">
      <el-table-column label="Order Number" align="center" min-width="120px">
        <template #default="scope">{{ scope.row.orderNumber || '-' }}</template>
      </el-table-column>
      <el-table-column label="Item Number" align="center" min-width="120px">
        <template #default="scope">{{ scope.row.productCode || '-' }}</template>
      </el-table-column>
      <el-table-column label="Item Name" align="center" min-width="200px">
        <template #default="scope">{{ scope.row.productName || '-' }}</template>
      </el-table-column>
      <el-table-column label="Supplier Name" align="center" min-width="200">
        <template #default="scope">
          <SupplierText :supplierId="scope.row.seller" />
        </template>
      </el-table-column>
      <el-table-column label="HBL Number" align="center" min-width="120px">
        <template #default="scope">{{ scope.row.hblNumber || '-' }}</template>
      </el-table-column>
      <el-table-column label="Set Number" align="center" min-width="120px">
        <template #default="scope">{{ scope.row.setNumber || '-' }}</template>
      </el-table-column>
      <el-table-column label="Tag" align="center" min-width="100px">
        <template #default="scope">
          <div v-if="getPoTags(scope.row).length">
            <el-tag
              v-for="tag in getPoTags(scope.row)"
              :key="tag.code"
              :type="tag.type"
              size="small"
              :class="[tag.className, 'mr-4']"
            >
              {{ tag.label }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Merch Code" align="center" min-width="80px">
        <template #default="scope">{{ scope.row.merchCode || '-' }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'
import SupplierText from '@/views/components/supplier-text/index.vue'
export default {
  name: 'ContainerOrders',
  components: {
    SupplierText
  },
  props: {
    containerOrders: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    getPoTags(row) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
        row.nos = false
      }
      return PO_TAG_RULES
        .filter(rule => rule.match ? rule.match(row) : true)
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
    },
  }
}
</script>
  
  <style scoped>
.el-table {
  margin-top: 20px;
}
</style>