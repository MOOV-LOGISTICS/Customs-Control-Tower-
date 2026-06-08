<template>
  <div style="margin-top: -25px;" min-width="1200px" class="table-container">
    <div class="fixed-table-wrapper">
      <el-table :data="containerList" style="min-width: 1200px; max-width: none; width: 100%;" height="150px">
        <el-table-column prop="containerNo" label="Container Number" align="center" width="150"></el-table-column>
        <el-table-column prop="containerType" label="Container Type" align="center" width="100"></el-table-column>
        <el-table-column prop="orderNumber" label="Order Number" align="center" width="150"></el-table-column>
        <el-table-column prop="itemNumber" label="Item Number" align="center" width="100"></el-table-column>
        <el-table-column prop="itemName" label="Item Name" align="center" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hierarchy" align="center" label="Hierarchy Index" width="120"></el-table-column>
        <el-table-column prop="compareResult" align="center" label="Sanitary Risk" width="100"></el-table-column>
        <el-table-column prop="tcId" label="TC ID" align="center" width="100"></el-table-column>
        <el-table-column prop="qty" label="Loaded Outer Cartons" align="center" width="130"></el-table-column>
        <el-table-column prop="innerQty" label="Loaded Inner Cartons" align="center" width="130"></el-table-column>
        <el-table-column prop="pieces" label="Loaded Pieces" align="center" width="120"></el-table-column>
        <el-table-column prop="weight" label="Gross Weight(KG)" align="center" width="120"></el-table-column>
        <el-table-column prop="cbm" label="Volume(CBM)" align="center" width="120"></el-table-column>
      </el-table>
      <office-preview ref="officePreview"></office-preview>
    </div>
  </div>
</template>

  <script>
import officePreview from './office-preview.vue'
export default {
  name: 'OrdersInContainers',
  components: { officePreview },
  props: {
    containerData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      containerList: []
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    this.containerList = []
    this.containerList = this.containerData
  },
  methods: {
    setContainerData(data) {
      console.log('Setting document data:', data)
      this.containerList = data
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    }
  }
}
</script>

  <style scoped>
.el-table {
  margin-top: 20px;
}
.table-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.fixed-table-wrapper {
  overflow-x: auto;
  padding-bottom: 10px;
}
</style>
