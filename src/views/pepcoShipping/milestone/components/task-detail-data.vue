<template>
  <el-dialog :title="title" width="80%" :visible.sync="dialogVisible" append-to-body>
    <el-row type="flex">
      <el-col :span="16">
        <el-input v-model="listQuery.shippingOrderRef" placeholder="Shipping Order Ref" style="width: 200px;padding: 10px;" />
        <el-button type="primary" size="mini" icon="el-icon-search el-icon--right" @click="handleQuery()">Search</el-button>
        <el-button type="primary" size="mini" :loading="downloadMilestoneLoading" icon="el-icon-download" @click="downloadMilestoneData">Download</el-button>
        <el-button
          v-hasPermi="['pepco:edit:Cargo_Inbound']"
          v-if="milestone.taskCode=='Cargo_Inbound' && listQuery.flowStatus < 4"
          v-loading="cargoInboundLoading"
          type="primary"
          icon="el-icon-download"
          @click="cargoInboundDownload"
        >Download Template</el-button>
      </el-col>
      <el-col :span="8" style="text-align: left; margin-top: 10px;;">
        <el-upload
          v-hasPermi="['pepco:edit:Cargo_Inbound']"
          v-if="milestone.taskCode=='Cargo_Inbound' && listQuery.flowStatus < 4"
          v-loading="cargoInboundLoading"
          :action="cargoInboundUploadUrl"
          style="margin-left: 8px"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :auto-upload="true"
          :headers="headers"
        >
          <el-button type="primary" icon="el-icon-upload">Batch Upload Update</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <!-- <div style="display: flex;">
      <el-button
        v-hasPermi="['pepco:edit:Cargo_Inbound']"
        v-if="milestone.taskCode=='Cargo_Inbound' && listQuery.flowStatus < 4"
        v-loading="cargoInboundLoading"
        type="primary"
        icon="el-icon-download"
        @click="cargoInboundDownload"
      >Download Template</el-button>

      <el-upload
        v-hasPermi="['pepco:edit:Cargo_Inbound']"
        v-if="milestone.taskCode=='Cargo_Inbound' && listQuery.flowStatus < 4"
        v-loading="cargoInboundLoading"
        :action="cargoInboundUploadUrl"
        style="margin-left: 8px"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :auto-upload="true"
        :headers="headers"
      >
        <el-button type="primary" icon="el-icon-upload">Batch Upload Update</el-button>
      </el-upload>
    </div>-->

    <el-table :data="tableData" v-loading="tableLoading" height="550px">
      <el-table-column prop="date" label="Task Name" min-width="180" align="center" show-overflow-tooltip>
        <template v-slot="scope">{{ scope.row.taskName }}</template>
      </el-table-column>
      <el-table-column prop="shippingOrderRef" min-width="120" label="Shipping Order Ref"></el-table-column>
      <el-table-column label="Supplier Name" min-width="150" prop="supplierCode" show-overflow-tooltip>
        <template v-slot="scope">
          <bsc-supplier-text :supplierId="scope.row.supplierId" />
        </template>
      </el-table-column>
      <el-table-column prop="urgentDate" label="Urgent Date">
        <template v-slot="scope">{{ parseUTCTime(scope.row.urgentDate) }}</template>
      </el-table-column>
      <el-table-column prop="dueDate" label="Due date">
        <template v-slot="scope">{{ parseUTCTime(scope.row.dueDate) }}</template>
      </el-table-column>
      <el-table-column v-if="title.endsWith('finished')" prop="updateTime" label="Complete date">
        <template v-slot="scope">{{ parseUTCTime(scope.row.updateTime) }}</template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template v-slot="scope">
          <action-index :milestone="scope.row" @refresh="refresh" />
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="listQuery.total" layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :page-sizes="[20, 30, 50]" @pagination="handleQuery" />
  </el-dialog>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import { milestonePage, exportOrderMilestoneData, exportCargoInboundTemplate } from '@/api/pepco/milestone'

import ActionIndex from '../handler/index.vue'

export default {
  name: 'TaskDetailDialog',
  components: { ActionIndex },
  data() {
    return {
      dialogVisible: false,
      title: 'Task Detail Data',
      flowText: ['Possible', 'Urgent', 'Overdue', 'Finished'],
      milestone: {},
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        shippingOrderRef: ''
      },
      tableLoading: false,
      tableData: [],
      downloadMilestoneLoading: false,
      cargoInboundLoading: false,
      cargoInboundUploadUrl: process.env.VUE_APP_BASE_API + '/pepco/milestone/handle/cargo-inbound/submit-batch',
      headers: getBaseHeader()
    }
  },
  created() {},
  methods: {
    openDialog(milestone, flowStatus, queryParams) {
      this.dialogVisible = true

      console.log('当前任务', milestone)
      console.log('当前任务状态', flowStatus)
      console.log('queryParams', queryParams)
      this.milestone = milestone
      this.title = `${milestone.taskName} - ${this.flowText[flowStatus - 1]} Details`
      this.listQuery = Object.assign({}, { pageNo: 1, pageSize: 20, total: 0, shippingOrderRef: '' }, queryParams, { taskCode: milestone.taskCode, flowStatus: flowStatus })

      this.handleQuery()
    },
    refresh() {
      this.handleQuery()
      this.$emit('refresh')
    },
    handleQuery() {
      this.tableLoading = true
      milestonePage(this.listQuery).then(res => {
        this.tableData = [...res.data.list]
        this.listQuery.total = res.data.total || 0
        this.tableLoading = false
      })
    },
    downloadMilestoneData() {
      if (this.tableData.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        })
        return
      }

      this.$confirm('Confirm the download?\n Note that a maximum of 20,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.downloadMilestoneLoading = true
          exportOrderMilestoneData(this.listQuery).then(response => {
            this.$download.excel(response, `${this.milestone.taskCode}-${this.flowText[this.listQuery.flowStatus - 1]}-${new Date().getTime()}.xlsx`)
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            this.downloadMilestoneLoading = false
          })
        })
        .catch(() => {
          this.downloadMilestoneLoading = false
        })
    },
    cargoInboundDownload() {
      if (this.tableData.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        })
        return
      }

      this.$confirm('Confirm the download?\n Note that a maximum of 30,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.cargoInboundLoading = true
          exportCargoInboundTemplate(this.listQuery).then(response => {
            this.$download.excel(response, `${this.milestone.taskCode}-Tempalte-${this.flowText[this.listQuery.flowStatus - 1]}-${new Date().getTime()}.xlsx`)
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            this.cargoInboundLoading = false
          })
        })
        .catch(() => {
          this.cargoInboundLoading = false
        })
    },
    handleUploadSuccess(response, file, fileList) {
      this.$notify({
        title: 'success',
        message: 'Upload Success',
        type: 'success'
      })
      this.cargoInboundLoading = false
      this.refresh()
    },
    handleUploadError(err, file, fileList) {
      console.error('Upload error:', err)
    }
  }
}
</script>
