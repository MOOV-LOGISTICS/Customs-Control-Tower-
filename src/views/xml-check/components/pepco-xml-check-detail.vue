<template>
  <div class="page-container" ref="pageContainer">
    <el-card class="pd-20">
      <div style="overflow: auto;width:calc(100%);float: left;">
        <el-table v-loading="loading" :data="tableData" :height="tableHeight" style="width: 100%">
          <el-table-column label="Change Data" prop="changeType"></el-table-column>
          <el-table-column label="Before The Change" prop="beforeChangeValue"></el-table-column>
          <el-table-column label="After The Change" prop="afterChangeValue"></el-table-column>
          <el-table-column label="Operate" width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.changedFlag === '1'">
                <el-button type="text" @click="viewDetail(scope.row)">Details</el-button>
              </template>
              <template v-else>
                <el-tooltip class="item" effect="dark" content="Accept" placement="top">
                  <el-button class="el-icon-check" type="success" size="mini" circle @click="acceptChange(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Reject" placement="top">
                  <el-button class="el-icon-close" type="danger" size="mini" circle @click="rejectChange(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="View Details" :visible.sync="dialogFormVisible">
      <div :style="'height: '+dialogHeight+'px; overflow: auto;'">
        <el-descriptions v-for="log in detailsLogList" direction="vertical" :column="4" border>
          <el-descriptions-item label="Order Number">{{log.orderNumber}}</el-descriptions-item>
          <el-descriptions-item label="Item Id">{{log.tcid}}</el-descriptions-item>
          <el-descriptions-item label="Article Id">{{log.articleid}}</el-descriptions-item>
          <el-descriptions-item label="Current Status">{{log.currentStatus}}</el-descriptions-item>
          <el-descriptions-item label="Change Data">{{log.changeType}}</el-descriptions-item>
          <el-descriptions-item label="Before Change Value">{{log.beforeChangeValue}}</el-descriptions-item>
          <el-descriptions-item label="Real Value Before Update">{{log.realBeforeChangeValue}}</el-descriptions-item>
          <el-descriptions-item label="After Change Value">{{log.afterChangeValue}}</el-descriptions-item>
          <el-descriptions-item :span="2" label="Update User">{{log.userEmail}}</el-descriptions-item>
          <el-descriptions-item :span="2" label="Update Time">{{log.executeTime}}</el-descriptions-item>
          <el-descriptions-item :span="4" label="Execute Log">{{log.executeLog}}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :loading="loading">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { acceptChange, acceptChangeCheck, getCheckDetails, getXmlChangeLogList, rejectChange } from '@/api/xmlcheck/xmlCheck'
import {getByOrderNumber} from "@/api/order/header";
import moment from "moment";

export default defineComponent({
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      dialogHeight: window.innerHeight * 0.6,
      tableHeight: window.innerHeight - 156,
      tableData: [],
      detailsLogList: [],
      selectRow: {}
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    initList(queryParams) {
      console.log('selected row', queryParams)
      this.selectRow = queryParams
      if (queryParams) {
        this.loading = true
        getCheckDetails(queryParams)
          .then(response => {
            this.loading = false
            this.tableData = response.data
          })
          .catch(error => {
            this.loading = false
            console.error('Error fetching detail data:', error)
            this.$message.error('Failed to load details')
          })
      } else {
        this.tableData = []
      }
    },
    async acceptChange(row) {
        console.log('row', row)
        console.log('this.selectRow', this.selectRow)

        // hold
        const resOrder = await getByOrderNumber(this.selectRow.orderNumber)
        console.log('返回值', resOrder.data)
        if (resOrder.data.status == '2') {
            this.$modal.msgWarning('Order Number:' + resOrder.data.orderNumber + ' Status: Hold');
            return
        }
      if (resOrder.data.status == '1') {
        this.$modal.msgWarning('Order Number:' + resOrder.data.orderNumber + ' Status: Cancelled');
        return
      }

      // PO的HOD更改后已经晚于目前此PO的CRD，需要提示
      if (row.changeType === 'Cargo Handover Date') {
        getByOrderNumber(this.selectRow.orderNumber).then(res => {
          if (res.data && res.data.cargoReadyDate && moment(res.data.cargoReadyDate).isAfter(moment(row.afterChangeValue))) {
            this.$confirm(
              `<p>The revised HOD for ${this.selectRow.orderNumber} is earlier than the CRD, Confirm the modification?</p>`,
              'Please Confirm',
              {
                confirmButtonText: 'Sure',
                cancelButtonText: 'Cancel',
                dangerouslyUseHTMLString: true,
                type: 'warning'
              }
            ).then(() => {
              this.onConfirm(row)
            }).catch(() => {})
          } else {
            this.onConfirm(row)
          }
        })
      } else {
        this.onConfirm(row)
      }
    },
    onConfirm(row) {
      this.$confirm(
        `<p>Are You Sure Update [<span style="font-weight: bold; color: red">${row.changeType}</span>]?</p><p>(<span style="font-weight: bold">${row.beforeChangeValue}</span> -> <span style="font-weight: bold; color: red">${row.afterChangeValue}</span>)</p>`,
        'Please Confirm',
        {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          acceptChangeCheck({
            ...row,
            ...this.selectRow
          })
            .then(response => {
              this.loading = false
              console.log('response', response)
              const { checkResult, message, realBeforeChangeValue } = response.data
              if (checkResult === 'error') {
                this.$message.error(message)
              } else if (checkResult === 'warning') {
                this.$confirm(message, 'Please Confirm Update', {
                  confirmButtonText: 'Sure',
                  cancelButtonText: 'Cancel',
                  dangerouslyUseHTMLString: true,
                  type: 'warning'
                })
                  .then(() => {
                    this.doAcceptChange(row, realBeforeChangeValue)
                  })
                  .catch(() => {})
              } else {
                this.doAcceptChange(row, realBeforeChangeValue)
              }
            })
            .catch(error => {
              this.loading = false
              console.error('Error fetching detail data:', error)
              this.$message.error(error)
            })
        })
        .catch(() => {})
    },
    doAcceptChange(row, realBeforeChangeValue) {
      this.loading = true
      acceptChange({
        ...row,
        ...this.selectRow,
        realBeforeChangeValue: realBeforeChangeValue
      })
        .then(response => {
          this.loading = false
          console.log('response', response)
          const { checkResult, message } = response.data
          if (checkResult === 'error') {
            this.$message.error(message)
          } else {
            this.$message({
              type: 'success',
              message: 'Update Success!'
            })
            this.initList(this.selectRow)
          }
        })
        .catch(error => {
          this.loading = false
          console.error('Error fetching detail data:', error)
          this.$message.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    async rejectChange(row) {
      // hold
      const resOrder = await getByOrderNumber(this.selectRow.orderNumber)
      console.log('返回值', resOrder.data)
      if (resOrder.data.status == '2') {
        this.$modal.msgWarning('Order Number:' + resOrder.data.orderNumber + ' Status: Hold');
        return
      }
      if (resOrder.data.status == '1') {
        this.$modal.msgWarning('Order Number:' + resOrder.data.orderNumber + ' Status: Canceled');
        return
      }
      this.$confirm(
        `<p>Are You Sure Reject [<span style="font-weight: bold; color: red">${row.changeType}</span>]?</p><p>(<span style="font-weight: bold">${row.beforeChangeValue}</span> -> <span style="font-weight: bold; color: red">${row.afterChangeValue}</span>)</p>`,
        'Please Confirm',
        {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          rejectChange({
            ...row,
            ...this.selectRow
          })
            .then(response => {
              this.loading = false
              const { checkResult, message } = response.data
              if (checkResult === 'error') {
                this.$message.error(message)
              } else {
                this.$message({
                  type: 'success',
                  message: 'Reject Success!'
                })
                this.initList(this.selectRow)
              }
            })
            .catch(error => {
              this.loading = false
              console.error('Error rejecting change:', error)
              this.$message.error('Reject Failed!')
            })
        })
        .catch(() => {})
    },

    viewDetail(row) {
      this.loading = true
      getXmlChangeLogList({
        ...row,
        ...this.selectRow
      })
        .then(response => {
          this.loading = false
          this.detailsLogList = response.data
          this.dialogFormVisible = true
        })
        .catch(e => {
          console.error('Error fetching detail data:', e)
          this.loading = false
          this.$message.error('Query Details Failed!')
        })
    }
  }
})
</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
