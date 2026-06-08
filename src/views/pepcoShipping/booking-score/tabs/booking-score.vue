<template>
  <div>
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
          <el-input v-model="listQuery.productCode" placeholder="PLU" clearable filterable @keyup.enter.native="handleQuery" @clear="handleQuery"></el-input>
        </div>

        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button @click="handleQuery" type="primary">
            <i class="el-icon-search el-icon--right"></i>
            Search
          </el-button>
        </div>
      </div>
    </el-form>

    <!-- 列表 -->
    <el-table :height="tableHeight" v-loading="loading" :data="list">
      <el-table-column label="Order Number" align="center" min-width="120px" prop="orderNumber" />
      <el-table-column label="Shipper Booking Number" align="center" min-width="140px" prop="soRef" />
      <el-table-column label="Origin Port(PO)" align="center" min-width="130px" prop="pol" />
      <el-table-column label="DC Date(PO)" align="center" prop="deliveryDate">
        <template #default="scope">{{ parseDate(scope.row.deliveryDate) }}</template>
      </el-table-column>
      <el-table-column label="Plan CRD(PO)" align="center" min-width="120px" prop="planCrdDate">
        <template #default="scope">{{ parseDate(scope.row.planCrdDate) }}</template>
      </el-table-column>
      <el-table-column label="Supplier CRD" align="center" min-width="120px" prop="crdDate">
        <template #default="scope">{{ parseDate(scope.row.crdDate) }}</template>
      </el-table-column>
      <!-- <el-table-column label="CRD(PO)" align="center" prop="crdDate">
        <template #default="scope">{{ parseDate(scope.row.crdDate) }}</template>
      </el-table-column> -->
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
      <el-table-column prop="promoCode" label="Promo Code" min-width="100" align="center" show-overflow-tooltip>
        <!-- <template #default="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.promoCode" placement="top">
            <span class="text-overflow">{{ scope.row.promoCode }}</span>
          </el-tooltip>
        </template>-->
      </el-table-column>
      <el-table-column label="Pending Booking Status" align="center" min-width="140px" prop="status">
        <template #default="scope">{{ shippingStatus.find(v=>v.value==scope.row.status)?.label }}</template>
      </el-table-column>
      <el-table-column prop="incoterm" label="Incoterm" min-width="100" align="center"></el-table-column>
      <el-table-column prop="namedPlace" label="Named Place" min-width="150" align="center"></el-table-column>
      <el-table-column prop="transportMode" label="Transport Mode" min-width="100" align="center"></el-table-column>
      <el-table-column label="Order Score" align="center" prop="orderScore" fixed="right" />
      <el-table-column label="Shipper Booking Score" min-width="130px" align="center" prop="shippingScore" fixed="right" />
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { bookingScorePage } from '@/api/pepco/booking-score'

export default {
  data() {
    return {
      loading: true,
      tableHeight: 0,
      total: 0,
      list: [],
      listQuery: {
        orderNumber: '',
        soRef: '',
        pol: '',
        productCode: '',
        pageSize: 20,
        pageNo: 1,
        orderBy: 'id'
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
      bookingScorePage(this.listQuery)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
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
