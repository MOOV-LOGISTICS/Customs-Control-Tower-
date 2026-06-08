<template>
  <el-dialog :title="title" width="800px" :visible="cargoInboundUpdateVisible" @close="onClose">
    <el-form ref="cargoInboundFormRef" :model="cargoInboundForm" size="mini" :rules="rules">
      <el-form-item label="Order Number" label-width="210px" prop="orderNumber">
        <el-input disabled v-model="cargoInboundForm.orderNumber" size="small" />
      </el-form-item>
      <el-form-item label="HOD" label-width="210px" prop="hod">
        <el-date-picker disabled v-model="cargoInboundForm.hod" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          type="date" placeholder="Cargo Receive Date">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="milestone?.taskName" label-width="210px" prop="cargoHandoverDate">
        <el-date-picker :disabled="isCargoInboundOnlyView" v-model="cargoInboundForm.cargoHandoverDate"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="Cargo Inbound Date" @change="onChange"
          :picker-options="pickerDisableFutureOptions">
        </el-date-picker>
      </el-form-item>
      <template v-if="showReason">
        <el-form-item label="Reason" label-width="210px" prop="reason"
          :rules="[{ required: true, message: 'Reason Is Required' }]">
          <el-select :disabled="isCargoInboundOnlyView" v-model="cargoInboundForm.reason" placeholder="Reason"
            clearable>
            <el-option v-for="item in reasonCodes" :label="item.value + ' - ' + item.label" :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" label-width="210px" prop="remark">
          <el-input :disabled="isCargoInboundOnlyView" clearable v-model="cargoInboundForm.remark" type="textarea"
            :autosize="{ minRows: 2 }" placeholder="Remark">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">Cancel</el-button>
      <el-button :disabled="isCargoInboundOnlyView" :loading="loading" type="primary"
        @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>

import moment from "moment";
import { DICT_TYPE } from "@/utils/dict";
import { getCargoInboundAHodInfo } from "@/api/order/header";
import { completeMilestone } from "@/api/air/booking";

export default {
  components: {

  },
  computed: {
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_INBOUND_REASON_CODE]
    }
  },
  data() {
    return {
      isProcessing: false,
      loading: false,
      cargoInboundUpdateVisible: false,
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
      showReason: false,
      isCargoInboundOnlyView: false,
      title: '',
      milestone: null,
    }
  },
  methods: {
    handle(milestone, mode) {
      this.openDialog(milestone, mode);
    },
    async openDialog(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      this.isProcessing = true;
      this.milestone = milestone;
      if (mode === 'view') {
        this.isCargoInboundOnlyView = true;
      } else {
        this.isCargoInboundOnlyView = false;
      }
      this.title = 'Cargo Inbound - ' + milestone.orderNumber;
      this.loading = true
      this.cargoInboundForm.orderNumber = milestone.orderNumber
      await this.getInfo()
      this.loading = false
      this.cargoInboundUpdateVisible = true;
      this.isProcessing = false;
    },
    refresh() {
      this.$emit('success');
    },
    async onSubmit() {
      this.$refs.cargoInboundFormRef.validate(async valid => {
        if (valid) {
          this.loading = true
          const command = {
            milestoneId: this.milestone.id,
            taskCode: this.milestone.taskCode,
            formData: [{ "type": "date", "key": "cargoInboundDate", "label": "Cargo Inbound Date", "value": moment(this.cargoInboundForm.cargoHandoverDate).valueOf(), "shipmentId": this.milestone.shipmentId }],
            params: {
              orderId: this.milestone.orderHeaderId,
              actualCargoHandoverDate: moment(this.cargoInboundForm.cargoHandoverDate).valueOf(),
              reason: this.showReason ? this.cargoInboundForm.reason : null,
              remark: this.showReason ? this.cargoInboundForm.remark : null,
            }
          }
          try {
            await completeMilestone(command)
            this.onClose()
          } catch (error) {
            this.onClose()
            this.loading = false
          }
        }
      })
    },
    onClose() {
      if (this.$refs.cargoInboundFormRef) {
        this.$refs.cargoInboundFormRef.resetFields();
      }
      this.showReason = false;
      this.cargoInboundUpdateVisible = false;
      this.refresh();
    },
    onChange(value) {
      if (value) {
        // 相差超过7天需要填写reason、remark
        this.showReason = moment(value).valueOf() - moment(this.cargoInboundForm.hod).valueOf() > 7 * 24 * 60 * 60 * 1000
      }
    },
    async getInfo() {
      // 填充详细信息
      try {
        const res = await getCargoInboundAHodInfo({ orderId: this.milestone.orderHeaderId })
        if (res.data) {
          console.log("getCargoInboundAHodInfo", res.data)
          // 相差超过7天需要填写reason、remark
          this.showReason = moment(res.data.actualCargoHandoverDate).valueOf() - moment(res.data.cargoHandoverDate).valueOf() > 7 * 24 * 60 * 60 * 1000
          this.cargoInboundForm = {
            orderNumber: res.data.orderNumber,
            hod: res.data.cargoHandoverDate
              ? moment(this.parseUTCTime(res.data.cargoHandoverDate)).toDate()
              : null,
            cargoHandoverDate: res.data.actualCargoHandoverDate
              ? moment(this.parseUTCTime(res.data.actualCargoHandoverDate)).toDate()
              : null,
            reason: res.data.reason,
            remark: res.data.remark
          }
        }
      } catch (error) {
        console.error("Failed to fetch cargo inbound info:", error);
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>