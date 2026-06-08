<template>
  <el-dialog :title="title" width="800px" :visible="cargoInboundUpdateVisible" @close="onClose">
      <el-form ref="cargoInboundFormRef" :model="cargoInboundForm" size="mini" :rules="rules">
        <el-form-item label="Order Number" label-width="210px" prop="orderNumber">
          <el-input disabled v-model="cargoInboundForm.orderNumber" size="small" />
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
            :disabled="isCargoInboundOnlyView"
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
            <el-select :disabled="isCargoInboundOnlyView" v-model="cargoInboundForm.reason" placeholder="Reason" clearable>
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
              :disabled="isCargoInboundOnlyView"
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
        <el-button :disabled="isCargoInboundOnlyView" :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
      </div>
    </el-dialog>
</template>
<script>

import moment from "moment";
import {DICT_TYPE} from "@/utils/dict";
import {getCargoInboundAHodInfo, updateCargoInboundAHod} from "@/api/order/header";

export default {
  name: "cargoInboundUpdateDialog",
  props: ['title', 'cargoInboundUpdateVisible', 'cargoInboundInfo', 'isCargoInboundOnlyView', 'onCargoInboundDialogClose', 'onCargoInboundSuccess'],
  data() {
    return {
      loading: false,
      cargoInboundForm: {
        orderNumber: null,
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
    async cargoInboundUpdateVisible (value) {
      if (value) {
        this.loading = true
        this.cargoInboundForm.orderNumber = this.cargoInboundInfo.orderNumber
        await this.getInfo()
        this.loading = false
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
          this.loading = true
          updateCargoInboundAHod({
            orderId: this.cargoInboundInfo.orderId,
            actualCargoHandoverDate: moment(this.cargoInboundForm.cargoHandoverDate).valueOf(),
            reason: this.showReason ? this.cargoInboundForm.reason : null,
            remark: this.showReason ? this.cargoInboundForm.remark : null,
          }).then(res => {
            if (res.data) {
              this.$emit('onCargoInboundSuccess')
              this.loading = false
            }
          }).catch(err => {
            this.loading = false
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
    async getInfo() {
      // 填充详细信息
      const res = await getCargoInboundAHodInfo({ orderId: this.cargoInboundInfo.orderId })
      if (res.data) {
        // 相差超过7天需要填写reason、remark
        this.showReason = moment(res.data.actualCargoHandoverDate).valueOf() - moment(res.data.cargoHandoverDate).valueOf() > 7 * 24 * 60 * 60 * 1000
        this.cargoInboundForm = {
          orderNumber: res.data.orderNumber,
          hod: moment(this.parseUTCTime(res.data.cargoHandoverDate)).toDate(),
          cargoHandoverDate: moment(this.parseUTCTime(res.data.actualCargoHandoverDate)).toDate(),
          reason: res.data.reason,
          remark: res.data.remark
        }
      }
    }
  }
}
</script>
