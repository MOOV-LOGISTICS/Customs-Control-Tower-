<template>
  <div style="margin-top: -25px;"  min-width="1200px" class="table-container">
    <div class="fixed-table-wrapper">
      <el-table ref="table" :data="containerList" style="min-width: 1200px; max-width: none; width: 100%;" height="250" show-summary :summary-method="getSummaries">
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
  watch: {
    containerData: {
      immediate: true,
      handler(newVal) {
        this.containerList = newVal || []
        // 数据变化后，强制表格重新布局以触发合计行
        this.$nextTick(() => {
          this.refreshTableLayout()
        })
      }
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    this.containerList = []
    this.containerList = this.containerData
  },
  methods: {
    refreshTableLayout() {
      if (this.$refs.table) {
        this.$refs.table.doLayout()
      }
    },
    setContainerData(data) {
      console.log('Setting document data:', data)
      this.containerList = data
      this.$nextTick(() => {
        this.refreshTableLayout()
      })
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    },
    getSummaries({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total'
          return
        }
        const prop = column.prop || column.property
        if (['qty', 'innerQty', 'pieces'].includes(prop)) {
          const values = data.map(item => Math.round(Number(item[prop]) || 0))
          const total = values.reduce((sum, val) => sum + val, 0)
          sums[index] = total
        } else if (prop === 'weight') {
          const values = data.map(item => Math.round((Number(item[prop]) || 0) * 100))
          const total = values.reduce((sum, val) => sum + val, 0)
          sums[index] = total / 100
        } else if (prop === 'cbm') {
          const values = data.map(item => Math.round((Number(item[prop]) || 0) * 1000))
          const total = values.reduce((sum, val) => sum + val, 0)
          sums[index] = total / 1000
        } else {
          sums[index] = ''
        }
      })
      return sums
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
