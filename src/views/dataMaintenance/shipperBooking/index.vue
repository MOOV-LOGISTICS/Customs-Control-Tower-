<template>
  <el-card class="card-wrapper">
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
      <el-table-column label="Order Numbers" prop="customerRef"></el-table-column>
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

    <shipping-add-p-o :visible="addVisible" :rowInfo="rowInfo" @onClose="onClose" @successCallback="successCallback" />
    <shipping-remove-p-o :visible="removeVisible" :rowInfo="rowInfo" @onClose="onClose" @successCallback="successCallback" />
  </el-card>
</template>
<script>

import {getShippingOrderPage} from "@/api/dataMaintenance/dataMaintenance";
import ShippingRemovePO from "@/views/dataMaintenance/shipperBooking/components/shippingRemovePO.vue";
import ShippingAddPO from "@/views/dataMaintenance/shipperBooking/components/shippingAddPO.vue";

export default {
  name: "index",
  components: {ShippingAddPO, ShippingRemovePO},
  data() {
    return {
      loading: false,
      dataSource: [],
      queryParams: {
        soRef: null
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
      const res = await getShippingOrderPage({
        pageNo: this.paginationParams.pageNo,
        pageSize: this.paginationParams.pageSize,
        soRef: this.queryParams.soRef
      })
      if (res.data) {
        // 填充数据
        this.dataSource = res.data.list
        this.paginationParams.total = res.data.total
      }
    },
    // 添加po
    add(row) {
      // 行信息
      this.rowInfo = row
      this.addVisible = true
    },
    // 删除po
    remove(row) {
      // 行信息
      this.rowInfo = row
      this.removeVisible = true
    },
    // 改变页码
    async handleCurrentChange(currentPage) {
      this.loading = true
      this.paginationParams.pageNo = currentPage
      await this.getPage()
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
    // 搜索
    async onSearch() {
      this.loading = true
      this.paginationParams.pageNo = 1
      await this.getPage()
      this.loading = false
    },
    // 关闭弹窗
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
