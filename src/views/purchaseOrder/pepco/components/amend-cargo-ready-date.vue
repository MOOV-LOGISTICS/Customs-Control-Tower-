<template>
  <el-dialog title="Amend Cargo Ready Date" width="600px" :visible="visible" @close="onHandleClose">
    <el-form ref="cargoReadyDateAmendRef" :model="form" :rules="crdRules" size="mini">
      <el-form-item label="HOD" label-width="180px">
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="form.cargoHandoverDate"
          type="date"
          placeholder="HOD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Planned CRD" label-width="180px">
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="form.planCargoHandoverDate"
          type="date"
          placeholder="Planned CRD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
        <el-date-picker
          format="yyyy-MM-dd"
          v-model="form.cargoReadyDate"
          type="date"
          value-format="timestamp"
          placeholder="Cargo Ready Date"
          :picker-options="{ disabledDate(time) {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return time.getTime() < today.getTime()
            }}"
          @change="onCRDChange">
        </el-date-picker>
      </el-form-item>
      <template v-if="isOutsideCRD">
        <el-form-item
          label="Reason"
          label-width="180px"
          prop="outsideCRDReason"
          :rules="[{ required : true, message: 'Reason Is Required' }]">
          <el-select v-model="form.outsideCRDReason" placeholder="Reason" clearable>
            <el-option v-for="item in crdReasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" label-width="180px" prop="remark">
          <el-input type="textarea" :rows="4" v-model="form.remark" />
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onHandleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="submitAmendCRD">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
import {DICT_TYPE} from "@/utils/dict";
import {createPoApproval, searchPoApprovalByOrderNumber} from "@/api/pepco/po-approval";

export default {
  name: "amendCargoReadyDate",
  props: ['visible', 'crdAmendInfo', 'onClose', 'onCRDAmendSuccess'],
  data() {
    return {
      loading: false,
      form: {
        cargoHandoverDate: null,
        planCargoHandoverDate: null,
        cargoReadyDate: null,
        outsideCRDReason: null,
        remark: null
      },
      crdRules: {
        cargoReadyDate:[
          { required : true, message: 'Cargo Ready Date Is Required' }
        ]
      },
      cargoReadyDateReasonList: [],
      isOutsideCRD: false,
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        const planCargoHandoverDate = moment(this.parseUTCTime(this.crdAmendInfo.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000))
        // 填充cargoHandoverDate、planCargoHandoverDate、cargoReadyDate
        this.form = {
          cargoHandoverDate: moment(this.parseUTCTime(this.crdAmendInfo.cargoHandoverDate)).toDate(),
          planCargoHandoverDate: planCargoHandoverDate.toDate(),
          cargoReadyDate: moment(this.parseUTCTime(this.crdAmendInfo.cargoReadyDate)).toDate()
        }
        // 填充reason、remark
        if (Math.abs(moment(this.parseUTCTime(this.crdAmendInfo.cargoReadyDate)).valueOf() - planCargoHandoverDate.valueOf()) > 3 * 24 * 60 * 60 * 1000) {
          this.isOutsideCRD = true
        }
      }
    }
  },
  computed: {
    crdReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_READY_DATE_REASON_CODE]
    }
  },
  methods: {
    submitAmendCRD() {
      this.loading = true;
      searchPoApprovalByOrderNumber(this.crdAmendInfo.orderNumber).then(res => {
        if (res.data) {
          this.loading = false
          // 或者使用 info 类型提示：
          this.$message({
            message: 'Already exist aprroval info, please wait for approval!',
            type: 'warning',
            duration: 3000
          });
          return
        }

        // 校验表单
        this.$refs.cargoReadyDateAmendRef.validate(async valid => {
          if (valid) {
            const currentYear = new Date().getFullYear()
            const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
            if (Math.abs(cargoReadyYear - currentYear) > 0) {
              this.loading = false
              this.$confirm(<div>The year you submit is <span class="warning">{ cargoReadyYear }</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                type: 'warning'
              }).then(async () => {
                await this.searchPoApprovalByOrderNumber(this.crdAmendInfo)
                this.loading = false
                this.onHandleClose()
              })
            } else {
              await this.searchPoApprovalByOrderNumber(this.crdAmendInfo)
              this.loading = false
              this.onHandleClose()
            }
          } else {
            this.loading = false
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    onHandleClose() {
      // 退出清空数据
      this.$emit('onClose')
      this.isOutsideCRD = false
      this.$refs.cargoReadyDateAmendRef.resetFields()
    },
    onCRDChange(value) {
      if (value) {
        // CRD与Planned CRD相差超过三天需要填Reason和Remark
        const crd = Math.abs(value - moment(this.form.planCargoHandoverDate).valueOf())
        this.isOutsideCRD = crd > 3 * 24 * 60 * 60 * 1000;
      }
    },
    async searchPoApprovalByOrderNumber(form) {
      this.crdAmendInfo.newData = JSON.stringify({
        // 转换成时间戳
        "cargoReadyDate": moment(this.form.cargoReadyDate).valueOf(),
        "orderId": this.crdAmendInfo.orderId,
        "orderNumber": this.crdAmendInfo.orderNumber,
        "outsideCRDReason": this.isOutsideCRD ? this.form.outsideCRDReason : null,
        "remark": this.isOutsideCRD ? this.form.remark : null
      })
      const res = await createPoApproval(form)
      if (res.data) {
        this.$notify({ type: 'success', message: 'Success' })
        this.$emit('onCRDAmendSuccess')
        this.$refs.cargoReadyDateAmendRef.resetFields()
      }
    }
  }
}
</script>
