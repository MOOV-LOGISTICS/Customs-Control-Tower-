<template>
  <div>
    <el-dialog title="Repair Data" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <!-- 表单 1: 修复单个数据 -->
        <el-divider content-position="left">1. 修复单个Shipment数据用这个</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Shipment Ref">
              <el-input v-model="form.bookingNumber" placeholder="Shipment Ref"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button v-loading="loading" type="primary" @click="repairSingleData">Repair One</el-button>
          </el-col>
        </el-row>

        <!-- 表单 2: 批量修复数据 -->
        <el-divider content-position="left">2. 批量修复用这个(所有Empty_Container_Returned节点未完成的都会刷新)</el-divider>
        <el-button v-loading="loading" type="primary" @click="repairBatchData">Repair Batch</el-button>

        <!-- 表单 3: 重新生成 -->
        <el-divider content-position="left">3. 目的港数据没有生成(pre alert后, 因各种原因没有生成目的港数据)，重新生成用这个</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Shipment Ref">
              <el-input v-model="form.reBookingNumber" placeholder="Shipment Ref"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button v-loading="loading" type="primary" @click="handleGenerate">Generate</el-button>
          </el-col>
        </el-row>

        <!-- 表单 4: 批量同步箱子信息 -->
        <el-divider content-position="left">4. 批量同步箱子信息</el-divider>
        <el-button v-loading="loading" type="primary" @click="syncContainerBatch">Sync Container Batch</el-button>
        <!-- <el-divider content-position="left">4. 目的港数据已经生成，但缺少箱子(CLR在pre alert之后做的情况)用这个（废弃）</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Shipment Ref">
              <el-input v-model="form.completeBookingNumber" placeholder="Shipment Ref"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button v-loading="loading" type="primary" @click="completeContainerInfo">Repair Container</el-button>
          </el-col>
        </el-row>-->

        <!-- 表单 5: 修复TEU -->
        <el-divider content-position="left">5. 修复TEU</el-divider>
        <el-row :gutter="24">
          <!-- <el-col :span="12">
            <el-form-item label="Shipment Ref">
              <el-input v-model="form.completeBookingNumber" placeholder="Shipment Ref"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-button v-loading="loading" type="primary" @click="handleTeu">Repair Teu</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { repairData, syncBatch, repairContainer, generateData, fixTeu, syncContainerBatch } from '@/api/destination/destination'

export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        bookingNumber: '',
        reBookingNumber: '',
        days: '0',
        completeBookingNumber: ''
      }
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    repairSingleData() {
      if (!this.form.bookingNumber) {
        this.$message.error('Booking Number Required')
        return
      }
      // 调用修复单个数据的接口
      this.loading = true
      repairData({ bookingNumber: this.form.bookingNumber })
        .then(response => {
          this.$message.success('repaire data success')
          this.loading = false
        })
        .catch(error => {
          this.$message.error('repaire data fail: ' + error.message)
          this.loading = false
        })
    },
    repairBatchData() {
      // 调用批量修复数据的接口
      this.loading = true
      syncBatch({ days: this.form.days })
        .then(response => {
          this.$message.success('The task is being executed in the background.')
          this.loading = false
        })
        .catch(error => {
          this.$message.error('repair data fail: ' + error.message)
          this.loading = false
        })
    },
    handleGenerate() {
      if (!this.form.reBookingNumber) {
        this.$message.error('Booking Number Required')
        return
      }
      // 调用生成目的港数据的接口
      this.loading = true
      generateData({ shipmentRef: this.form.reBookingNumber })
        .then(response => {
          this.$message.success('generate data success')
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    syncContainerBatch() {
      this.loading = true
      syncContainerBatch()
        .then(response => {
          this.$message.success('success')
          this.loading = false
        })
        .catch(error => {
          this.$message.error('sync container batch fail: ' + error.message)
          this.loading = false
        })
    },
    completeContainerInfo() {
      if (!this.form.completeBookingNumber) {
        this.$message.error('Booking Number Required')
        return
      }
      // 调用补全箱子信息的接口
      this.loading = true
      repairContainer({ bookingNumber: this.form.completeBookingNumber })
        .then(response => {
          this.$message.success('repaire container success')
          this.loading = false
        })
        .catch(error => {
          this.$message.error('repaire container fail: ' + error.message)
          this.loading = false
        })
    },
    handleTeu() {
      fixTeu()
        .then(response => {
          this.$message.success('repaire TEU success')
          this.loading = false
        })
        .catch(error => {
          this.$message.error('repaire TEU fail: ' + error.message)
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
</style>