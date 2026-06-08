<template>
  <div style="margin-top: -25px;">
    <el-table :data="containerHblList" height="250" style="width: 100%;" @select="handleSelection" @selection-change="handleSelectionChange"> 
      <el-table-column prop="containerNo" label="Container No" align="center" min-width="180"></el-table-column>
      <el-table-column prop="sanitaryRisk" label="Sanitary Risk" align="center" min-width="120">
        <template v-slot="scope">
          <span v-if="scope.row.sanitaryRisk == 1" style="color: red">{{ 'Y' }}</span>
          <span v-else style="color: green">{{ 'N' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brokerDeptName" label="Broker" align="center" min-width="150"></el-table-column>
      <el-table-column label="Invoice to Customs" sortable="custom" align="center" min-width="150" prop="invoiceCustoms">
        <template v-slot="scope">
          <span v-if="scope.row.invoiceCustoms" style="color: #67C23A;">{{ 'Y' }}</span>
          <span v-else style="color: #909399;">{{ 'N' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customsClearanceFinish" label="Customs Clearance" align="center" min-width="150">
        <template v-slot="scope">
          <span v-if="scope.row.customsClearanceFinish" style="color: #67C23A;">{{ 'Y' }}</span>
          <span v-else style="color: #909399;">{{ 'N' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.$auth.hasPermi('pepco:destination-hbl:broker-assign:edit')" type="selection" width="55"></el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
export default {
  name: 'container-hbl',
  components: {},
  props: {
  },
  data() {
    return {
      containerHblList: [],
      selectedRows: [],
    }
  },
  methods: {
    setContainerHblData(containerHblList) {
      this.$set(this, 'containerHblList', containerHblList || [])
      console.log('Setting containerHblList data:', this.containerHblList)
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleSelection(selection, row) {
      console.log('handleSelection', selection)
      this.selectedRows = selection
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange:', val)
      this.selectedRows = val
    },
    getSelectedRows() {
      console.log('获取选中的行数据tab:', this.selectedRows)
      return this.selectedRows || []
    }
  }
}
</script>
  
<style scoped>
.el-table {
  margin-top: 20px;
}
</style>