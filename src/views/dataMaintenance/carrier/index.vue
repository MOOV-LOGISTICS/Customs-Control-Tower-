<template>
  <el-card class="card-wrapper">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-input v-model="queryParams.bookingNumber" placeholder="Shipment Ref" />
      </el-col>
      <el-col :span="6">
        <el-button @click="onClear">Clear</el-button>
        <el-button type="primary" @click="onSearch">Search</el-button>
      </el-col>
    </el-row>
    <el-table row-key="id" v-loading="loading" :data="dataSource" border stripe>
      <el-table-column label="Shipment Ref" prop="bookingNumber" width="250px"></el-table-column>
      <el-table-column label="Booking Number" prop="shipmentBookingNumber"></el-table-column>
      <el-table-column label="POL" prop="pol"></el-table-column>
      <el-table-column label="POD" prop="pod"></el-table-column>
      <el-table-column label="SO Refs" prop="soRefs">
        <template slot-scope="scope">
          {{ scope.row.soRefs?.join(",") }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150px">
        <div class="icon-wrapper" slot-scope="scope">
          <el-button type="primary" class="icon-btn" icon="el-icon-plus" @click="add(scope.row)"></el-button>
          <el-button type="danger" class="icon-btn" icon="el-icon-minus" @click="remove(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page.sync="paginationParams.pageNo"
      :page-size="20"
      layout="total, prev, pager, next, jumper"
      :total="paginationParams.total"
      @current-change="handleCurrentChange" />

    <shipment-add-shipping :visible="addVisible" :rowInfo="rowInfo" @onClose="onClose" @successCallback="successCallback" />
    <shipment-remove-shipping :visible="removeVisible" :rowInfo="rowInfo" @onClose="onClose" @successCallback="successCallback" />
  </el-card>
</template>
<script>

import {getShipmentPage} from "@/api/dataMaintenance/dataMaintenance";
import ShipmentAddShipping from "@/views/dataMaintenance/carrier/components/shipmentAddShipping.vue";
import ShipmentRemoveShipping from "@/views/dataMaintenance/carrier/components/shipmentRemoveShipping.vue";

export default {
  name: "index",
  components: {ShipmentRemoveShipping, ShipmentAddShipping},
  data() {
    return {
      loading: false,
      dataSource: [],
      queryParams: {
        bookingNumber: null
      },
      paginationParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      addVisible: false,
      removeVisible: false,
      rowInfo: null,
    }
  },
  async mounted() {
    this.loading = true
    await this.getPage();
    this.loading = false
  },
  methods: {
    async getPage() {
      // 获取shipping order列表
      const res = await getShipmentPage({
        pageNo: this.paginationParams.pageNo,
        pageSize: this.paginationParams.pageSize,
        bookingNumber: this.queryParams.bookingNumber
      })
      if (res.data) {
        this.dataSource = res.data.list
        this.paginationParams.total = res.data.total
      }
    },
    add(row) {
      this.rowInfo = row
      this.addVisible = true
    },
    remove(row) {
      this.rowInfo = row
      this.removeVisible = true
    },
    async handleCurrentChange(currentPage) {
      this.loading = true
      this.paginationParams.pageNo = currentPage
      await this.getPage()
      this.loading = false
    },
    async onClear() {
      // 重置搜索条件
      this.loading = true
      this.queryParams.bookingNumber = null
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
    onClose() {
      this.addVisible = false
      this.removeVisible = false
    },
    // 成功回调，刷新列表
    successCallback() {
      this.getPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  padding: 20px;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
    .icon-btn {
      padding: 4px 8px;
    }
  }
}
</style>
