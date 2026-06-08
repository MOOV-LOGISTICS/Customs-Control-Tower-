<template>
  <div style="margin-top: -25px;">
    <el-empty v-if="!hasData" description="No Data"></el-empty>
    <el-table v-else class="freight-invoice-table" :data="tableData" height="250" style="width: 100%" ref="freightTable">
      <el-table-column prop="status" label="Status" align="center">
        <template #default="scope"><span :style="{ color: getStatusColor(scope.row.paramsDTO.status) }">{{ scope.row.paramsDTO.status || '-'}}</span></template>
      </el-table-column>
      <el-table-column v-if="displayStatus === 'Complete'" prop="invoiceDate" align="center" label="Invoice to Customs Date">
        <template #default="scope">{{parseUTCTime( scope.row.paramsDTO.invoiceDate) || '-'}}</template>
      </el-table-column>
      <el-table-column v-if="displayStatus === 'Complete'" prop="invoiceNumber" label="Invoice Number" align="center">
        <template #default="scope">{{scope.row.paramsDTO.invoiceNumber || '-'}}</template>
      </el-table-column>
      <el-table-column v-if="displayStatus === 'Complete'" prop="comments" align="center" label="Comments">
        <template #default="scope">{{scope.row.paramsDTO.comments || '-'}}</template>
      </el-table-column>
      <el-table-column v-if="displayStatus === 'Incomplete'" prop="value" label="Incomplete Reason" align="center">
        <template #default="scope">{{parseReason(scope.row.paramsDTO.value) || '-'}}</template>
      </el-table-column>
      <el-table-column prop="updater" align="center" label="Update User">
        <template #default="scope">
          <span v-if="String(scope.row.updater) === '0'">System</span>
          <bsc-user-text v-else :userId="scope.row.updater" />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" label="Update Time">
        <template #default="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

  <script>
import { getDictData } from '@/api/destination/destination'
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
      reasonCodeMap: {}
    }
  },
  computed: {
    latestRecord() {
      return this.logList && this.logList.length > 0 ? this.logList[0] : null
    },
    displayStatus() {
      return this.latestRecord && this.latestRecord.paramsDTO ? this.latestRecord.paramsDTO.status : null
    },
    hasData() {
      return this.displayStatus === 'Complete' || this.displayStatus === 'Incomplete'
    },
    tableData() {
      return this.hasData ? [this.latestRecord] : []
    }
  },
  created() {
    getDictData('pepco_dest_invoice_to_customs_reason_select_op').then(res => {
      if (res.data) {
        res.data.forEach(item => {
          this.reasonCodeMap[item.value] = item.label
        })
      }
    }).catch(error => {
      console.log('获取 reasonCodeMap 失败:', error)
    })
  },
  mounted() {
    // 组件挂载时直接初始化数据
    // this.logList = this.logData
  },
  methods: {
    setCommentsData({ logList, type }) {
      console.log('Freight Invoiced Date data:', logList)
      this.$set(this, 'logList', logList || [])
      this.$nextTick(() => {
        this.refreshTable()
      })
    },
    refreshTable() {
      if (this.$refs.freightTable) {
        this.$refs.freightTable.doLayout()
      }
    },
    getStatusColor(status) {
      if (status === 'Complete') return '#67C23A'
      if (status === 'Incomplete') return '#E6A23C'
      return '#909399'
    },
    parseReason(value) {
      if (null == value || value == '') {
        return ''
      }
      const label = this.reasonCodeMap[value]
      if (!label) {
        return value
      }
      return value + ' - ' + label
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

  }
}
</script>

  <style scoped>
.el-table {
  margin-top: 20px;
}
.freight-invoice-table >>> table {
  table-layout: fixed;
  width: 100%;
}
.freight-invoice-table >>> .el-table__header th .cell,
.freight-invoice-table >>> .el-table__body td .cell {
  word-break: break-word;
}
</style>
