<template>
  <el-dialog append-to-body title="Over Reason" width="80%" :visible="visible" @close="handleClose">
    <el-form
      ref="cargoInboundCommonFormRef"
      :model="cargoInboundCommonForm"
      size="small"
      label-width="180px">
      <el-form-item prop="defaultReason" label="Default Reason">
        <el-select
          v-model="cargoInboundCommonForm.defaultReason"
          placeholder="Default Reason"
          @change="onDefaultReasonChange"
          clearable>
          <el-option v-for="item in reasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="defaultRemark" label="Default Remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1 }"
          v-model="cargoInboundCommonForm.defaultRemark"
          placeholder="Default Remark"
          @blur="onDefaultRemarkBlur"
          clearable>
        </el-input>
      </el-form-item>
    </el-form>

    <el-form ref="cargoInboundFormRef" :model="cargoInboundForm">
      <el-table v-loading="loading" :data="cargoInboundForm.waitCargoInboundList" row-key="orderNumber">
        <el-table-column prop="orderNumber" label="Order Number" width="110"></el-table-column>
        <el-table-column prop="cargoHandoverDate" label="HOD" width="90">
          <template slot-scope="scope">
            {{ parseUTCTime(scope.row.cargoHandoverDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="actualCargoHandoverDate" label="Cargo Receive Date" width="130">
          <template slot-scope="scope">
            {{ parseUTCTime(scope.row.actualCargoHandoverDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="Reason" min-width="180">
          <template slot-scope="scope">
            <el-form-item :prop="'waitCargoInboundList.' + scope.$index + '.reason'" :rules="[{ required: true, message: 'Reason Is Required' }]">
              <el-select
                @change="onReasonChange(scope.row)"
                v-model="scope.row.reason"
                placeholder="Reason"
                clearable>
                <el-option v-for="item in reasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="Remark" min-width="180">
          <template slot-scope="scope">
            <el-input
              clearable
              v-model="scope.row.remark"
              type="textarea"
              :autosize="{ minRows: 2 }"
              @blur="onRemarkChange(scope.row)"
              placeholder="Remark">
            </el-input>
          </template>
        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        :hide-on-single-page="false"-->
<!--        :page-size="10"-->
<!--        :current-page.sync="queryParams.currentPage"-->
<!--        :total="queryParams.total"-->
<!--        @current-change="onPageChange">-->
<!--      </el-pagination>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="batchSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {DICT_TYPE} from "@/utils/dict";
import {batchUpdateCargoInbound} from "@/api/order/header";
import moment from "moment";

export default {
  name: "cargoInboundBatchReasonDialog",
  props: ['visible', 'waitCargoInboundList', 'waitUpdateData', 'onClose', 'onSuccess'],
  data() {
    return {
      loading: false,
      cargoInboundCommonForm: {
        defaultReason: null,
        defaultRemark: null,
      },
      cargoInboundForm: {
        waitCargoInboundList: []
      },
      queryParams: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.cargoInboundForm.waitCargoInboundList = this.waitCargoInboundList
        // this.queryParams.total = this.waitCargoInboundList.length
      }
    }
  },
  computed: {
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]
    }
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
      this.$refs.cargoInboundFormRef.resetFields()
      this.$refs.cargoInboundCommonFormRef.resetFields()
    },
    batchSubmit() {
      this.loading = true
      this.$refs.cargoInboundFormRef.validate(valid => {
        if (valid) {
          const params = []
          this.cargoInboundForm.waitCargoInboundList.forEach(item => {
            params.push({
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
              reason: item.reason,
              remark: item.remark
            })
          })
          this.waitUpdateData.forEach(item => {
            params.push({
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
              reason: item.reason,
              remark: item.remark
            })
          })
          batchUpdateCargoInbound({ cargoInboundList: params }).then(res => {
            if (res.data) {
              this.$emit('onSuccess')
              this.$refs.cargoInboundCommonFormRef.resetFields()
              this.$refs.cargoInboundFormRef.resetFields()
              this.loading = false
            }
          }).catch(err => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    onReasonChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    },
    onRemarkChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    },
    onPageChange(value) {

    },
    onDefaultReasonChange(value) {
      const waitCargoInboundList = [...this.cargoInboundForm.waitCargoInboundList]
      for (let i = 0; i < waitCargoInboundList.length; i++) {
        if (waitCargoInboundList[i].useDefault) {
          waitCargoInboundList[i].reason = value
        }
      }
      this.cargoInboundCommonForm.waitCargoInboundList = waitCargoInboundList
    },
    onDefaultRemarkBlur(event) {
      const waitCargoInboundList = [...this.cargoInboundForm.waitCargoInboundList]
      for (let i = 0; i < waitCargoInboundList.length; i++) {
        if (waitCargoInboundList[i].useDefault) {
          waitCargoInboundList[i].remark = event.target.value
        }
      }
      this.cargoInboundCommonForm.waitCargoInboundList = waitCargoInboundList
    }
  }
}
</script>
