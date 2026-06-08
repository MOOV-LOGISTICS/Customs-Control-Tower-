<template>
  <div style="margin-top: -25px; ">
    <!-- <h3>Document 表单</h3> -->
    <el-table height="250" :data="logList" style="width: 100%">
      <el-table-column prop="status" label="Status" align="center" min-width="200px">
        <template #default="scope">{{ scope.row.paramsDTO.status || '-' }}</template>
      </el-table-column>
      <el-table-column prop="submitDate" label="Submit Date" align="center" min-width="200px">
        <template #default="scope">{{ parseUTCTime(scope.row.paramsDTO.submitDate) || '-' }}</template>
      </el-table-column>
      <el-table-column prop="finishDate" label="Finish Date" align="center" min-width="200px">
        <template #default="scope">{{ parseUTCTime(scope.row.paramsDTO.finishDate) || '-' }}</template>
      </el-table-column>

      <el-table-column prop="updater" label="Update User" align="center" min-width="200px">
        <template #default="scope">
          <span v-if="String(scope.row.updater) === '0'">System</span>
          <bsc-user-text v-else :userId="scope.row.updater" />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Update Time" align="center" min-width="200px">
        <template #default="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
      <el-table-column prop="value" label="Incomplete Reason" align="center" min-width="200px">
        <template #default="scope">
          <span v-if="scope.row.paramsDTO.status  === 'Incomplete'">{{parseReason(scope.row.paramsDTO.value) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="Incomplete Remark" align="center" min-width="200px">
        <template #default="scope">
          <span v-if="scope.row.paramsDTO.status  === 'Incomplete'">{{scope.row.paramsDTO.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getDictData,
} from '@/api/destination/destination';
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
      finishReasonMap:{}
    }
  },
  created() {
    getDictData('pepco_dest_cus_clearance_select_op').then(res => {
      console.log('pepco_dest_cus_clearance_select_op', res)
      if (res.data) {
        res.data.forEach(item => {
          this.finishReasonMap[item.value] = item.label
        })
        console.log('this.finishReasonMap', this.finishReasonMap)
      }
    }).catch(error => {
      console.log('获取finish reason失败:', error)
    })
  },
  mounted() {
    // 组件挂载时直接初始化数据
    // this.logList = this.logData
  },
  methods: {
    setCommentsData({ logList, type }) {
      console.log('submitDate document data:', logList)
      this.$set(this, 'logList', logList || [])
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
    parseReason(value) {
      if (null == value || value == '') {
        return ''
      }
      const label = this.finishReasonMap[value]
      if (!label) {
        return value
      }
      return value + ' - ' + label
    },
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
