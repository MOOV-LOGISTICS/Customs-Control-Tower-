<template>
  <el-dialog append-to-body title="Over Reason" width="80%" :visible="visible" @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      size="small"
      label-width="180px">
      <el-form-item prop="defaultReason" label="Default Reason">
        <el-select
          v-model="form.defaultReason"
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
          v-model="form.defaultRemark"
          placeholder="Default Remark"
          @blur="onDefaultRemarkBlur"
          clearable>
        </el-input>
      </el-form-item>
    </el-form>

    <el-form ref="gateInFormRef" :model="gateInForm">
      <el-table v-loading="loading" :data="gateInForm.waitGateInList" row-key="orderNumber">
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
            <el-form-item :prop="'waitGateInList.' + scope.$index + '.reason'" :rules="[{ required: true, message: 'Reason Is Required' }]">
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
            <el-form-item :prop="'waitGateInList.' + scope.$index + '.remark'">
              <el-input
                clearable
                v-model="scope.row.remark"
                type="textarea"
                :autosize="{ minRows: 2 }"
                @blur="onRemarkChange(scope.row)"
                placeholder="Remark">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="batchSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {DICT_TYPE} from "@/utils/dict";
import {batchUpdateGateIn} from "@/api/order/header";
import moment from "moment";

export default {
  name: "containerGateInBatchReasonDialog",
  props: ['visible', 'waitGateInList', 'waitUpdateData', 'onClose', 'onSuccess'],
  data() {
    return {
      loading: false,
      form: {
        defaultReason: null,
        defaultRemark: null,
      },
      gateInForm: {
        waitGateInList: []
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
        this.gateInForm.waitGateInList = this.waitGateInList
      }
    }
  },
  computed: {
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CONTAINER_GATE_IN_REASON]
    }
  },
  methods: {
    handleClose() {
      // 关闭弹窗并清除状态
      this.$emit('onClose')
      this.$refs.gateInFormRef.resetFields()
      this.$refs.formRef.resetFields()
    },
    // 提交
    batchSubmit() {
      this.loading = true
      this.$refs.gateInFormRef.validate(valid => {
        if (valid) {
          // 生成参数
          const params = []
          this.gateInForm.waitGateInList.forEach(item => {
            params.push({
              id: item.id,
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
              reason: item.reason,
              remark: item.remark
            })
          })
          this.waitUpdateData.forEach(item => {
            params.push({
              id: item.id,
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
              reason: item.reason,
              remark: item.remark
            })
          })
          batchUpdateGateIn({ containerGateInList: params }).then(res => {
            if (res.data) {
              this.$emit('onSuccess')
              this.$refs.formRef.resetFields()
              this.$refs.gateInFormRef.resetFields()
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
    onDefaultReasonChange(value) {
      // 遍历填充默认的reason
      const waitGateInList = [...this.gateInForm.waitGateInList]
      for (let i = 0; i < waitGateInList.length; i++) {
        if (waitGateInList[i].useDefault) {
          waitGateInList[i].reason = value
        }
      }
      this.form.waitGateInList = waitGateInList
    },
    onDefaultRemarkBlur(event) {
      // 遍历填充默认的remark
      const waitGateInList = [...this.gateInForm.waitGateInList]
      for (let i = 0; i < waitGateInList.length; i++) {
        if (waitGateInList[i].useDefault) {
          waitGateInList[i].remark = event.target.value
        }
      }
      this.form.waitGateInList = waitGateInList
    }
  }
}
</script>
