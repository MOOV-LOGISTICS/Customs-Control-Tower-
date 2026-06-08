<template>
  <div style="margin-top: -25px; ">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="logList" height="250">
      <el-table-column prop="status" label="Status" align="center" min-width="200px">
        <template #default="scope">{{ scope.row.paramsDTO.status || '-'}}</template>
      </el-table-column>

      <el-table-column prop="updater" label="Update User" align="center" min-width="200px">
        <template #default="scope">{{ getUserName(scope.row.updater) }}</template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Update Time" align="center" min-width="200px">
        <template #default="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
      <el-table-column prop="value" label="Incomplete Reason" align="center" min-width="200px">
        <template #default="scope">
          <span v-if="scope.row.paramsDTO.status  === 'Incomplete'">{{parseReason(scope.row.paramsDTO.value) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Incomplete Remark" align="center" min-width="200px">
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
  name: 'DocumnetsVerified',
  components: {},
  props: {
    hblRowData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      logList: [],
      userMap: {},
      docReasonMap:{},
    }
  },
  created() {
    getDictData('pepco_dest_doc_verify_select_op').then(res => {
        console.log('pepco_dest_doc_verify_select_op', res)
        if (res.data) {
          res.data.forEach(item => {
            this.docReasonMap[item.value] = item.label
          })
          console.log('this.docReasonMap', this.docReasonMap)
        }
      }).catch(error => {
        console.log('获取doc verify reason失败:', error)
      })
  },
  mounted() {},
  methods: {
    setCommentsData({ logList, userMap, type }) {
      console.log('submitDate document data:', logList)
      this.$set(this, 'logList', logList || [])
      this.$set(this, 'userMap', new Map(userMap) || {})
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
    },
    parseReason(value) {
      if (null == value || value == '') {
        return ''
      }
      const label = this.docReasonMap[value]
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