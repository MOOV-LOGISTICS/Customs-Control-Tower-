<template>
  <div :loading="fullLoading">
    <!-- 搜索工作栏 -->
    <el-form :model="listQuery" size="mini" :inline="true" label-width="68px">
      <div style="float: left; padding-top: 8px">
        <div style="float: left; padding: 10px 0px">
          <el-input v-model="listQuery.orderNumber" placeholder="PO" clearable filterable @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.soRef" placeholder="Booking Number" clearable filterable @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-input v-model="listQuery.pol" placeholder="Origin Port" clearable filterable @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-select placeholder="Type" v-model="listQuery.type" clearable filterable @change="handleQuery">
            <el-option label="All" value></el-option>
            <el-option label="New" value="New"></el-option>
            <el-option label="Update" value="Update"></el-option>
          </el-select>
        </div>

        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button @click="handleQuery" type="primary">
            <i class="el-icon-search el-icon--right"></i>
            Search
          </el-button>
        </div>
        <!-- v-hasPermi="['pepco:booking-score:under-scoring:download']" -->
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleDownload">Download Template</el-button>
        </div>
        <!-- v-hasPermi="['pepco:booking-score:under-scoring:submit']"  -->
        <div v-if="submitLoading" style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button type="primary" icon="el-icon-upload2" @click="handleSubmit">Submit Booking Score</el-button>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <bsc-progress ref="bscProgress" @complete="handleSubmitComplete" />
        </div>
        <!-- <el-button type="primary" icon="el-icon-upload2" @click="handleUploadSuccess({data:listQuery.orderNumber})">open</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-upload2" @click="handleGetProgress">GetProgress</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-upload2" @click="handleUpdateProgress">updateProgress</el-button> -->
      </div>
    </el-form>

    <!-- 列表 -->
    <el-table :height="tableHeight" v-loading="loading" :data="list">
      <el-table-column label="Type" align="center" min-width="120px" prop="type">
        <template #default="scope">
          <el-tag v-if="scope.row.type == 'Update'">Update</el-tag>
          <el-tag v-else-if="scope.row.type == 'New'" type="danger">New</el-tag>
          <el-tag v-else type="info">Unknown</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Order Number" align="center" min-width="120px" prop="orderNumber" />
      <el-table-column label="Shipper Booking Number" align="center" min-width="140px" prop="soRef" />
      <el-table-column label="Origin Port(PO)" align="center" min-width="100" prop="pol" />
      <el-table-column label="DC Date(PO)" align="center" prop="deliveryDate">
        <template #default="scope">{{ parseDate(scope.row.deliveryDate) }}</template>
      </el-table-column>
      <el-table-column label="Plan CRD(PO)" align="center" min-width="120px" prop="planCrdDate">
        <template #default="scope">{{ parseDate(scope.row.planCrdDate) }}</template>
      </el-table-column>
      <el-table-column label="Supplier CRD" align="center" prop="crdDate">
        <template #default="scope">{{ parseDate(scope.row.crdDate) }}</template>
      </el-table-column>
      <el-table-column label="HOD(PO)" align="center" prop="cargoHandoverDate">
        <template #default="scope">{{ parseDate(scope.row.cargoHandoverDate) }}</template>
      </el-table-column>
      <el-table-column label="ETD(Pre Assign)" min-width="100px" align="center" prop="etd">
        <template #default="scope">{{ parseDate(scope.row.etd) }}</template>
      </el-table-column>
      <el-table-column label="ETA(Pre Assign)" min-width="100px" align="center" prop="eta">
        <template #default="scope">{{ parseDate(scope.row.eta) }}</template>
      </el-table-column>
      <el-table-column label="Order Cube" align="center" prop="orderCbm" />
      <el-table-column prop="productCode" label="PLU" min-width="120" align="center"></el-table-column>
      <el-table-column prop="merchCode" label="Merch Code" min-width="100" align="center"></el-table-column>
      <el-table-column prop="promoCode" label="Promo Code" min-width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="Pending Booking Status" align="center" min-width="140px" prop="status">
        <template #default="scope">{{ shippingStatus.find(v=>v.value==scope.row.status)?.label }}</template>
      </el-table-column>
      <el-table-column prop="incoterm" label="Incoterm" min-width="100" align="center"></el-table-column>
      <el-table-column prop="namedPlace" label="Named Place" min-width="150" align="center"></el-table-column>
      <el-table-column prop="transportMode" label="Transport Mode" min-width="100" align="center"></el-table-column>
      <el-table-column label="Order Score" align="center" prop="orderScore" />
      <el-table-column label="Shipper Booking Score" min-width="130px" align="center" prop="shippingScore" />
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <submit-booking-score ref="submitBookingScore" @success="handleUploadSuccess" />
  </div>
</template>

<script>
import { underScoringPage, underScoringDownload } from '@/api/pepco/booking-score'
import { getProgress, updateProgress } from '@/api/system/common'
import SubmitBookingScore from '../components/submit-booking-score.vue'
import { t } from '@wangeditor/editor'

export default {
  components: { SubmitBookingScore },
  data() {
    return {
      loading: false,
      fullLoading: false,
      downloadLoading: false,
      submitLoading: true,
      tableHeight: 0,
      total: 0,
      list: [],
      listQuery: {
        orderNumber: '',
        soRef: '',
        pol: '',
        type: '',
        pageSize: 20,
        pageNo: 1
      },
      shippingStatus: [
        { label: 'MOOV-OHA Pending', value: '0' },
        { label: 'MOOV-OHA Accepted', value: '1' },
        { label: 'MOOV-OHA Rejected', value: '2' },
        { label: 'SAApproved', value: '4' },
        { label: 'Awaiting Approval', value: '5' },
        { label: 'Pepco Pending', value: '6' },
        { label: 'Pepco Rejected', value: '7' }
      ]
    }
  },
  created() {
    this.handleQuery()
    this.calcTableHeight()
  },
  methods: {
    handleQuery() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 380
    },
    getList() {
      this.loading = true
      this.list = []
      underScoringPage(this.listQuery)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    handleDownload() {
      console.log('handleDownload...')
      if (this.list.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to download',
          type: 'warning'
        })
        return
      }

      this.$confirm('Confirm the download?\n Note that all the data under scoring will be downloaded.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.downloadLoading = true
          underScoringDownload(this.listQuery).then(res => {
            this.$download.excel(res, `Under scoring template-${new Date().getTime()}.xlsx`)
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            this.downloadLoading = false
          })
        })
        .catch(() => {
          this.downloadLoading = false
        })
    },
    handleSubmit() {
      console.log('handleSubmit...')
      this.$refs.submitBookingScore.openUploadDialog()
    },
    handleUploadSuccess(res) {
      this.$notify({
        title: 'Success',
        message: 'The system is processing it. Please refresh the list later.',
        type: 'success'
      })
      this.submitLoading = false
      this.$nextTick(() => {
        this.$refs.bscProgress.showProgress(res.data)
      })
    },
    handleSubmitComplete(message, fail) {
      this.submitLoading = true
      localStorage.removeItem('booking-score-submit-id')
      this.handleQuery()
      this.$notify({
        title: fail ? 'Fail' : 'Success',
        message: message,
        type: fail ? 'error' : 'success'
      })
    },
    handleGetProgress() {
      getProgress(this.listQuery.orderNumber).then(res => {
        console.log(res)
      })
    },
    handleUpdateProgress() {
      updateProgress(this.listQuery.orderNumber).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Progress updated successfully',
          type: 'success'
        })
      })
    },
    parseDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
</style>
