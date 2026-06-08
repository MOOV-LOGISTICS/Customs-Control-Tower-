<template>
  <div style="margin-top: -25px;width: 600px;  ">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="logList" style="width: 100%">
      <el-table-column label="Status" align="center">
        <template #default="scope">{{ scope.row.paramsDTO.status ==='Revoke' ? scope.row.paramsDTO.status :'Assigned'}}</template>
      </el-table-column>
      <el-table-column label="Assigned To" align="center">
        <template #default="scope">{{ scope.row.paramsDTO.brokerDeptName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="updater" label="Update User" align="center">
        <template #default="scope">{{ getUserName(scope.row.updater) }}</template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Update Time" align="center">
        <template #default="scope">{{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
export default {
  name: 'Customer-Broker-Assign',
  components: {},
  props: {
    logData: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      logList: [],
      userMap: {},
      type: ''
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    // this.logList = this.logData
    // console.log('Mounted logData:', this.logData)
    // this.logList = this.logData.filter(item => item.paramsDTO && item.paramsDTO.brokerDeptName)
    // console.log('Mounted logList:', this.logList)
    // this.type = this.logData.type || ''
  },
  methods: {
    setCommentsData({ logList: incomingList, userMap, type }) {
      // this.logList = this.logData
      // 筛选 logList 中paramsDTO ！= null的数据
      const filteredList = Array.isArray(incomingList)
        ? incomingList
            .filter(item => item.paramsDTO && item.paramsDTO.brokerDeptName)
            .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
            .slice(0, 1)
        : []
      console.log('assign Setting document data:', filteredList)
      this.$set(this, 'logList', filteredList || [])
      this.$set(this, 'userMap', new Map(userMap) || {})
      this.$set(this, 'type', type || '')
      console.log('Setting userMap data:', this.type)
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    },

    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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