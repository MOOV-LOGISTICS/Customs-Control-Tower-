<template>
  <el-dialog :title="title" width="80%" :visible.sync="dialogVisible" append-to-body>
    <el-row type="flex">
      <el-col :span="16">
        <el-input v-model="listQuery.orderNumber" placeholder="Order Number" style="width: 200px;padding: 10px;" />
        <el-input v-if="row.level === 2" v-model="listQuery.shippingOrderRef" placeholder="Shipping Order Ref"
          style="width: 200px;padding: 10px;" />
        <el-input v-if="row.level === 3" v-model="listQuery.shipmentRef" placeholder="Shipment Ref"
          style="width: 200px;padding: 10px;" />
        <el-button type="primary" size="mini" icon="el-icon-search el-icon--right" @click="handleQuery()">
          Search
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" v-loading="tableLoading" height="550px">
      <el-table-column prop="date" label="Task Name" min-width="180" align="center" show-overflow-tooltip>
        <template v-slot="scope">{{ scope.row.taskName }}</template>
      </el-table-column>
      <el-table-column v-if="row.level === 1" prop="orderNumber" min-width="120" label="Order Number"></el-table-column>
      <el-table-column v-if="row.level === 2" prop="shippingOrderRef" min-width="120" label="Shipping Order Ref"></el-table-column>
      <el-table-column v-if="row.level === 3" prop="shipmentRef" min-width="120" label="Booking Number"></el-table-column>
      <el-table-column v-if="row.level === 1" label="Supplier Name" min-width="150" prop="supplierCode" show-overflow-tooltip>
        <template v-slot="scope">
          <bsc-supplier-text :supplierId="scope.row.supplierId" />
        </template>
      </el-table-column>
      <el-table-column v-if="(row.level === 2 || row.level === 3)" label="Related POs" min-width="200">
        <template v-slot="scope">
          <el-popover width="500" placement="top" trigger="hover">
            <div v-if="scope.row.relatedPos && scope.row.relatedPos.length > 0">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr style="background-color: #f5f7fa;">
                  <th style="padding: 8px; border: 1px solid #e4e7ed; text-align: left;">Order Number</th>
                  <th style="padding: 8px; border: 1px solid #e4e7ed; text-align: left;">Supplier Name</th>
                </tr>
                <tr v-for="(item, index) in scope.row.relatedPos" :key="index">
                  <td style="padding: 8px; border: 1px solid #e4e7ed;">{{ item.orderNumber || '-' }}</td>
                  <td style="padding: 8px; border: 1px solid #e4e7ed;"><bsc-supplier-text :supplierId="item.seller" /></td>
                </tr>
              </table>
            </div>
            <div v-else style="padding: 10px;">No related POs</div>
            <template v-slot:reference>
              <span>{{ scope.row.orderNumbers }}</span>
            </template>
          </el-popover>
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
    <pagination :total="listQuery.total" layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize" :page-sizes="[20, 30, 50]" @pagination="handleQuery" />
  </el-dialog>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import { bookingMilestonePage } from '@/api/air/booking'

import ActionIndex from '../handler/index.vue'

export default {
  name: 'TaskDetailDialog',
  components: { ActionIndex },
  data() {
    return {
      dialogVisible: false,
      title: 'Task Detail Data',
      flowText: ['Possible', 'Urgent', 'Overduemail-remind-order', 'Finished'],
      row: {},
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        orderNumber: ''
      },
      tableLoading: false,
      tableData: [],
      headers: getBaseHeader()
    }
  },
  created() { },
  methods: {
    openDialog(row, flowStatus, queryParams) {
      this.dialogVisible = true

      console.log('当前任务', row)
      console.log('当前任务状态', flowStatus)
      console.log('queryParams', queryParams)
      this.row = row
      this.title = `${row.taskName} - ${this.flowText[flowStatus - 1]} Details`
      if (row.level === 1) {
        this.listQuery = Object.assign({}, { pageNo: 1, pageSize: 20, total: 0, orderNumber: '' }, queryParams, { taskCode: row.taskCode, flowStatus: flowStatus })
      } else if (row.level === 2) {
        this.listQuery = Object.assign({}, { pageNo: 1, pageSize: 20, total: 0, shippingOrderRef: '' }, queryParams, { level: 2, shippingOrderRef: row.shippingOrderRef, taskCode: row.taskCode, flowStatus: flowStatus,  })
      } else if (row.level === 3) {
        this.listQuery = Object.assign({}, { pageNo: 1, pageSize: 20, total: 0, shipmentRef: '' }, queryParams, { level: 3, shipmentRef: row.shipmentRef, taskCode: row.taskCode, flowStatus: flowStatus,  })
      }
      this.handleQuery()
    },
    refresh() {
      this.handleQuery()
      this.$emit('refresh')
    },
    handleQuery() {
      this.tableLoading = true
      bookingMilestonePage(this.listQuery).then(res => {
          this.tableData = [...res.data.list].map(item => this.processOrderNumbers(item))
          this.listQuery.total = res.data.total || 0
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
    },
    processOrderNumbers(item) {
      if ((item.level === 2 || item.level === 3) && item.relatedPos && item.relatedPos.length > 0) {
        const orderNumbers = item.relatedPos
          .map(pos => pos.orderNumber)
          .filter(num => num) // 过滤掉 null, undefined 或空字符串
        if (orderNumbers.length > 0) {
          if (orderNumbers.length > 2) {
            item.orderNumbers = orderNumbers.slice(0, 2).join(', ') + '...'
          } else {
            item.orderNumbers = orderNumbers.join(', ')
          }
        } else {
          // 如果没有有效的订单号，显式设置为 '-' 或保持原样，避免显示空字符串
          item.orderNumbers = '-'
        }
      }
      return item
    }
  }
}
</script>
