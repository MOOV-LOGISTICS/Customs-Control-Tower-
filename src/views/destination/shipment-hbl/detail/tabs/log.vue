<template>
  <div style="margin-top: -25px;">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="logList" height="250" style="width: 100%;">
      <el-table-column prop="hblNumber" label="HBL Number" align="center" min-width="180"></el-table-column>
      <el-table-column prop="action" label="Action" align="center" min-width="120"></el-table-column>
      <el-table-column prop="updater" label="User" align="center" min-width="150">
        <template #default="scope">{{ getUserName(scope.row.updater) }}</template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Create Time" align="center" min-width="150">
        <template #default="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
export default {
  name: 'Log',
  components: {},
  props: {
    // logData: {
    //   type: Object,
    //   default: () => []
    // }
    // 接收userMap
  },
  data() {
    return {
      logList: [], // 添加logList定义
      userMap: {}
    }
  },
  // mounted() {
  //   // 组件挂载时直接初始化数据
  //   this.logList = this.logData
  // },
  methods: {
    setLogData({ logList, userMap }) {
      this.$set(this, 'logList', logList || [])
      this.$set(this, 'userMap', new Map(userMap) || {})
      console.log('Setting userMap data:', this.userMap)
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    },
    getUserName(userId) {
      console.log('Getting user name for ID:', userId)
      console.log('Getting user name for Name:', this.userMap.get(id))
      const id = Number(userId)
      if (this.userMap instanceof Map) {
        return this.userMap.get(id) || 'UnKnown User'
      } else {
        // 如果不是Map对象，尝试作为普通对象访问
        return this.userMap[id] || 'UnKnown User'
      }
    }
  }
}
</script>
  
  <style scoped>
.el-table {
  margin-top: 20px;
}
</style>