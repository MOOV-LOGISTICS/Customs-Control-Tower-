<template>
  <div style="margin-top: -25px;">
    <el-table :data="logList" style="width: 100%" ref="freightTable">
      <el-table-column prop="status" label="Status" align="center" width="200px">
        <template #default="scope">{{ scope.row.paramsDTO.status || '-'}}</template>
      </el-table-column>

      <el-table-column prop="invoiceNumber" label="Invoice Number" align="center" width="200px">
        <template #default="scope">
          <span v-if="scope.row.paramsDTO.status  === 'Complete'">{{scope.row.paramsDTO.invoiceNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="comments" align="center" label="Comments" width="200px">
        <template #default="scope">{{scope.row.paramsDTO.comments}}</template>
      </el-table-column>
      <el-table-column prop="invoiceDate" align="center" label="Invoice Date" width="200px">
        <template #default="scope">{{formatUserLocalTime( scope.row.paramsDTO.invoiceDate, scope.row.timeZone, scope.row.timeZoneOffset) || '-'}}</template>
      </el-table-column>
      <el-table-column prop="updater" align="center" label="Update User" width="200px">
        <template #default="scope">{{ getUserName(scope.row.updater) }}</template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" label="Update Time" width="200px">
        <template #default="scope">{{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>

      <el-table-column prop="value" label="Incomplete Reason" align="center" width="200px">
        <template #default="scope">
          <span v-if="scope.row.paramsDTO.status  === 'Incomplete'">{{scope.row.paramsDTO.value }}</span>
        </template>
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
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      logList: [],
      userMap: {}
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    // this.logList = this.logData
  },
  methods: {
    setCommentsData({ logList, userMap, type }) {
      console.log('Freight Invoiced Date data:', logList)
      this.$set(this, 'logList', logList || [])
      this.$set(this, 'userMap', new Map(userMap) || {})
    },
    refreshTable() {
      if (this.$refs.freightTable) {
        this.$refs.freightTable.doLayout()
      }
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