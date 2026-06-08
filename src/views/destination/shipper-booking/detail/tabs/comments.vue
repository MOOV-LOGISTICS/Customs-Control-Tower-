<template>
  <div style="margin-top: -25px;">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="logList" style="width: 60%">
      <el-table-column prop="shipperBookingRef" label="Shipper Booking Number" width="200"></el-table-column>
      <el-table-column prop="action" label="Action" width="150"></el-table-column>
      <el-table-column prop="creator" label="User" width="150"></el-table-column>
      <el-table-column prop="createTime" label="Create Time" width="150">
        <template v-slot="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
export default {
  name: 'Comments',
  components: {},
  props: {
    logData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      logList: []
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    this.logList = this.logData
  },
  methods: {
    setCommentsData(data) {
      console.log('Setting document data:', data)
      this.logList = data
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
</style>