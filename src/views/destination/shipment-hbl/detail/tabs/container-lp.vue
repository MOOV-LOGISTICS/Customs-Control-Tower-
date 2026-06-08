<template>
  <div style="margin-top: -25px;">
    <el-table :data="containerLpList" height="250" style="width: 100%;">
      <el-table-column prop="containerNo" label="Container No" align="center" min-width="180">
        <template v-slot="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <template v-if="scope.row.inHbl">
              <el-tooltip content="Container associated with the current HBL" placement="top">
                <i class="el-icon-star-on" style="color: #ffd700; margin-right: 5px; font-size: 16px;"></i>
              </el-tooltip>
            </template>
            <template v-else>
              <i style="display: inline-block; width: 16px; margin-right: 5px;"></i>
            </template>
            <span>{{ scope.row.containerNo }}</span>
          </div>
        </template>
      </el-table-column>

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
      containerLpList: [],
    }
  },
  methods: {
    setContainerLpData(containerLpList) {
      this.$set(this, 'containerLpList', containerLpList || [])
      console.log('Setting containerLpList data:', this.containerLpList)
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
  }
}
</script>
  
  <style scoped>
.el-table {
  margin-top: 20px;
}
</style>