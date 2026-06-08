<template>
  <el-dialog title="Add Shipper Booking" width="60%" :visible="visible" @close="onHandleClose">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-input v-model="queryParams.soRef" placeholder="SO Ref" />
      </el-col>
      <el-col :span="6">
        <el-button @click="onClear">Clear</el-button>
        <el-button type="primary" @click="onSearch">Search</el-button>
      </el-col>
    </el-row>

    <el-table row-key="id" v-loading="loading" :data="dataSource" border stripe>
      <el-table-column label="SO Ref" prop="soRef" width="250px"></el-table-column>
      <el-table-column label="SO Type" prop="shipmentType"></el-table-column>
      <el-table-column label="POL" prop="originPort"></el-table-column>
      <el-table-column label="POD" prop="destinationPort"></el-table-column>
      <el-table-column label="DC" prop="dc"></el-table-column>
      <el-table-column label="Action" width="80px">
        <div class="icon-wrapper" slot-scope="scope">
          <el-button type="danger" circle icon="el-icon-check" @click="onCheck(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page.sync="paginationParams.pageNo"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="paginationParams.total"
      @current-change="handleCurrentChange" />
  </el-dialog>
</template>
<script>
import {addShipperBooking, getShippingOrderPage} from "@/api/dataMaintenance/dataMaintenance";

export default {
  name: "shipmentAddShipping",
  props: ['visible', 'rowInfo', 'onClose', 'successCallback'],
  data() {
    return {
      loading: false,
      dataSource: [],
      queryParams: {
        soRef: null
      },
      paginationParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    }
  },
  watch: {
    async visible() {
      if (this.visible && this.rowInfo) {
        this.loading = true
        await this.getPage()
        this.loading = false
      }
    }
  },
  methods: {
    async getPage() {
      // 获取shipping order列表
      const res = await getShippingOrderPage({
        pageNo: this.paginationParams.pageNo,
        pageSize: this.paginationParams.pageSize,
        soRef: this.queryParams.soRef,
        shipmentId: this.rowInfo.id
      })
      if (res.data) {
        this.dataSource = res.data.list
        this.paginationParams.total = res.data.total
      }
    },
    onHandleClose() {
      this.queryParams.soRef = null
      this.$emit("onClose")
    },
    onCheck(row) {
      this.$confirm('Are you sure?', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'OK',
        type: 'warning'
      }).then(() => {
        // add po
        this.loading = true
        addShipperBooking({
          bookingNumber: this.rowInfo.bookingNumber,
          soRef: row.soRef
        }).then(async res => {
          if (res.data) {
            this.$message.success("Success")
            this.$emit('successCallback')
            await this.getPage()
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
        })
      }).catch(() => {
      })
    },
    async handleCurrentChange(currentPage) {
      this.loading = true
      this.paginationParams.pageNo = currentPage
      this.$emit('successCallback')
      this.loading = false
    },
    async onClear() {
      // 重置搜索条件
      this.loading = true
      this.queryParams.soRef = null
      this.paginationParams.pageNo = 1
      await this.getPage()
      this.loading = false
    },
    async onSearch() {
      this.loading = true
      this.paginationParams.pageNo = 1
      await this.getPage()
      this.loading = false
    },
  }
}
</script>
<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  justify-content: center;
}
</style>
