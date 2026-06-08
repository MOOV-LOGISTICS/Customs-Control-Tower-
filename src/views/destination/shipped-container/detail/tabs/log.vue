<template>
  <div style="margin-top: -25px;">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="logList" height="250" style="width: 100%;">
      <el-table-column prop="containerNo" label="ContainerNo" min-width="180" />
      <el-table-column prop="action" label="Action" min-width="120" />

      <!-- <el-table-column label="Change Details" min-width="460">
        <template #default="scope">
          <div class="change-details">
            <template v-if="extractChanges(scope.row).length">
              <div v-for="(item, idx) in extractChanges(scope.row)" :key="idx" class="change-line">
                <span class="label">{{ item.label }}:</span>
                <span class="before">{{ item.before }}</span>
                <span class="arrow">-></span>
                <span class="after">{{ item.after }}</span>
              </div>
            </template>
            <template v-else>
              <div v-for="(line, idx) in splitLogoInfo(scope.row.logoInfo)" :key="idx" class="change-line">{{ line }}</div>
            </template>
          </div>
        </template>
      </el-table-column>-->

      <el-table-column prop="changeDetails" label="Change Details" min-width="220" class-name="change-details-wrap-col">
        <template #default="scope">
          <div class="change-details-wrap">{{ scope.row.changeDetails || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="updater" label="User" min-width="100">
        <template #default="scope">
          <span v-if="String(scope.row.updater) === '0'">System</span>
          <bsc-user-text v-else-if="isNumeric(scope.row.updater)" :userId="Number(scope.row.updater)" />
          <span v-else>{{ scope.row.updater || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="Date" min-width="100">
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
    logData: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      logList: []
    }
  },
  methods: {
    setLogData({ logList }) {
      this.$set(this, 'logList', logList || [])
    },
    isNumeric(val) {
      return /^\d+$/.test(String(val))
    },
    splitLogoInfo(logoInfo) {
      if (!logoInfo) return ['-']
      return String(logoInfo)
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    },
    extractChanges(row) {
      if (!row || !row.params) return []
      try {
        const params = typeof row.params === 'string' ? JSON.parse(row.params) : row.params
        const changes = Array.isArray(params?.changes) ? params.changes : []
        return changes.map(c => ({
          label: c.label || c.field || 'Field',
          before: this.toText(c.before),
          after: this.toText(c.after)
        }))
      } catch (e) {
        return []
      }
    },
    toText(v) {
      if (v === null || v === undefined || v === '') return 'N/A'
      return String(v)
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

.change-details {
  line-height: 1.5;
}

.change-line {
  margin-bottom: 2px;
  word-break: break-word;
}

.label {
  color: #606266;
  margin-right: 4px;
}

.before {
  color: #f56c6c;
  text-decoration: line-through;
}

.after {
  color: #67c23a;
}

.arrow {
  color: #909399;
}

/* 覆盖 el-table 单元格默认 nowrap，长文案自动换行 */
::v-deep .change-details-wrap-col .cell {
  white-space: pre-line !important;
  word-break: break-word;
  line-height: 1.5;
}

.change-details-wrap {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.5;
}
</style>
