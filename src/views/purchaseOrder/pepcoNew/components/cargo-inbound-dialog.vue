<template>
  <el-dialog :title="title" width="800px" :visible="cargoInboundVisible" @close="onClose">
      <el-form ref="cargoInboundFormRef" :model="cargoInboundForm" size="mini" :rules="rules">
        <el-form-item label="Order Number" label-width="210px" prop="orderNumber">
            <el-input disabled v-model="cargoInboundForm.orderNumber" />
        </el-form-item>
        <el-form-item label="HOD" label-width="210px" prop="hod">
          <el-date-picker
            disabled
            v-model="cargoInboundForm.hod"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="Cargo Receive Date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="cargoInboundInfo?.taskName" label-width="210px" prop="cargoHandoverDate">
          <el-date-picker
            v-model="cargoInboundForm.cargoHandoverDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="Cargo Receive Date"
            @change="onChange"
            :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
        <template v-if="showReason">
          <el-form-item
            label="Reason"
            label-width="210px"
            prop="reason"
            :rules="[{ required : true, message: 'Reason Is Required' }]">
            <el-select v-model="cargoInboundForm.reason" placeholder="Reason" clearable>
              <el-option
                v-for="item in reasonCodes"
                :label="item.value + ' - ' + item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Remark" label-width="210px" prop="remark">
            <el-input
              clearable
              v-model="cargoInboundForm.remark"
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="Remark">
            </el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">Cancel</el-button>
        <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
      </div>
    </el-dialog>
</template>
<script>
import {updateCargoHandoverDateTask} from "@/api/order/task";
import moment from "moment";
import {DICT_TYPE} from "@/utils/dict";

export default {
  name: "cargoInboundDialog",
  props: ['title', 'cargoInboundVisible', 'cargoInboundInfo', 'onCargoInboundDialogClose', 'onCargoInboundSuccess'],
  data() {
    return {
      loading: false,
      cargoInboundForm: {
        orderNumber: null,
        orderList: [],
        hod: null,
        cargoHandoverDate: null,
        reason: null,
        remark: null
      },
      soRelatedPoList: [],
      // 禁用今天之后的日期
      pickerDisableFutureOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        orderList: [{ type: 'array', required: true, message: 'Please Select PO' }],
        cargoHandoverDate: [{ required: true, message: 'Please Select Cargo Receive Date' }],
      },
      showReason: false
    }
  },
  watch: {
    async cargoInboundVisible (value) {
      if (value) {
        this.cargoInboundForm.hod = this.parseUTCTime(this.cargoInboundInfo.cargoHandoverDate)
        // 默认填充当前po
        this.cargoInboundForm.orderNumber = this.cargoInboundInfo.orderNumber
        this.cargoInboundForm.orderList = [this.cargoInboundInfo.orderId]
        if (this.cargoInboundInfo.jsonData) {
          const data = JSON.parse(this.cargoInboundInfo.jsonData)
          if (data?.cargoHandoverDate) {
            this.cargoInboundForm.cargoHandoverDate = this.parseUTCTime(data.cargoHandoverDate)
            // 相差超过7天需要填写reason、remark
            this.showReason = moment(data.cargoHandoverDate).valueOf() - moment(this.cargoInboundInfo.cargoHandoverDate).valueOf() > 7 * 24 * 60 * 60 * 1000
          }
        }
      }
    }
  },
  computed: {
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]
    }
  },
  methods: {
    onClose() {
      this.$emit('onCargoInboundDialogClose')
      this.$refs.cargoInboundFormRef.resetFields()
      this.showReason = false
    },
    onSubmit() {
      this.$refs.cargoInboundFormRef.validate(valid => {
        if (valid) {
          if (!this.cargoInboundForm.orderList[0]) {
            this.$notify({ type: 'error', message: '' })
            return
          }
          this.loading = true
          const params = {
            id: this.cargoInboundInfo.id,
            jsonData: JSON.stringify({
              ...this.cargoInboundForm,
              reason: this.showReason ? this.cargoInboundForm.reason : null,
              remark: this.showReason ? this.cargoInboundForm.remark : null,
              shipmentId: this.cargoInboundInfo.shipmentId,
              taskName: this.cargoInboundInfo.taskName,
            })
          }
          updateCargoHandoverDateTask(params).then(res => {
            this.loading = false
            this.$emit('onCargoInboundSuccess')
            this.onClose()
          }).catch(err => {
            this.loading = false
            this.$message.error('Failed to update task');
          })
        }
      })
    },
    onChange(value) {
      if (value) {
        // 相差超过7天需要填写reason、remark
        this.showReason = moment(value).valueOf() - moment(this.cargoInboundForm.hod).valueOf() > 7 * 24 * 60 * 60 * 1000
      }
    },
  }
}
</script>
