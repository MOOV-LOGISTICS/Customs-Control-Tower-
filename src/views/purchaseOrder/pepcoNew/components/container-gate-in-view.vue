<template>
  <el-dialog :title="title" width="800px" :visible="visible" @close="onClose">
    <el-form v-loading="loading" ref="containerGateInRef" :model="containerGateInForm" size="mini">
      <el-form-item label="Order Number" label-width="210px" prop="orderNumber">
        <el-input disabled v-model="containerGateInForm.orderNumber" size="small" />
      </el-form-item>
      <el-form-item label="HOD" label-width="210px" prop="cargoHandoverDate">
        <el-date-picker
          disabled
          v-model="containerGateInForm.cargoHandoverDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="Latest Hod">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Container Gate In" label-width="210px" prop="actualCargoHandoverDate">
        <el-date-picker
          disabled
          v-model="containerGateInForm.actualCargoHandoverDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="Cargo Receive Date">
        </el-date-picker>
      </el-form-item>
      <template v-if="showReason">
        <el-form-item
          label="Reason"
          label-width="210px"
          prop="reason"
          :rules="[{ required : true, message: 'Reason Is Required' }]">
          <el-select disabled v-model="containerGateInForm.reason" placeholder="Reason" clearable>
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
            disabled
            clearable
            v-model="containerGateInForm.remark"
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="Remark">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="onClose">Cancel</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
import {DICT_TYPE} from "@/utils/dict";
import {getCargoInboundAHodInfo} from "@/api/order/header";
import {getOrderInfoById} from "@/api/order/task";

export default {
  name: "containerGateInView",
  props: ['title', 'visible', 'containerGateInInfo'],
  emits: ['onContainerGateInViewClose'],
  data() {
    return {
      loading: false,
      containerGateInForm: {
        orderNumber: null,
        cargoHandoverDate: null,
        actualCargoHandoverDate: null,
        reason: null,
        remark: null
      },
      showReason: false
    }
  },
  watch: {
    async visible (value) {
      if (value) {
        this.loading = true
        // 填充表单orderNumber
        this.containerGateInForm.orderNumber = this.containerGateInInfo.orderNumber
        await this.getInfo()
        this.loading = false
      }
    }
  },
  computed: {
    // 获取reason code
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CONTAINER_GATE_IN_REASON]
    }
  },
  methods: {
    onClose() {
      // 关闭弹窗
      this.$emit('onContainerGateInViewClose')
      this.$refs.containerGateInRef.resetFields()
      this.showReason = false
    },
    // 获取表单信息
    async getInfo() {
      // 获取po的actualCargoHandoverDate
      const header = await getOrderInfoById({ id: this.containerGateInInfo.orderId })
      if (header.data) {
        // 填充cargoHandoverDate、actualCargoHandoverDate
        this.containerGateInForm.cargoHandoverDate = this.parseUTCTime(header.data.cargoHandoverDate)
        this.containerGateInForm.actualCargoHandoverDate = this.parseUTCTime(header.data.actualCargoHandoverDate)
      }
      // 相差超过7天需要填写reason、remark
      this.showReason = moment(header.data.actualCargoHandoverDate).isAfter(header.data.cargoHandoverDate + 1000 * 60 * 60 * 24 * 7)
      if (this.showReason) {
        // 获取po的reason、remark
        const res = await getCargoInboundAHodInfo({ orderId: this.containerGateInInfo.orderId })
        if (res.data) {
          this.containerGateInForm.reason = res.data.reason
          this.containerGateInForm.remark = res.data.remark
        }
      }
    }
  }
}
</script>
