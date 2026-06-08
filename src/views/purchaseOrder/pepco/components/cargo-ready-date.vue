<template>
  <el-dialog :title="title" width="600px" :visible="cargoReadyDateFormVisible" @close="onHandleClose">
    <el-form ref="cargoReadyDateFormRef" :disabled="onlyView" :model="form" size="small" :rules="crdRules">
      <el-form-item label="HOD" label-width="180px">
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="cargoHandoverDate"
          type="date"
          placeholder="HOD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Planned CRD" label-width="180px">
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="planCargoHandoverDate"
          type="date"
          placeholder="Planned CRD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
        <el-date-picker
          @change="onCRDChange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="form.cargoReadyDate"
          type="date"
          placeholder="Cargo Ready Date">
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
        <el-form-item label="Remark" label-width="180px" prop="outsideCRDRemark">
          <el-input
            clearable
            v-model="form.outsideCRDRemark"
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="Remark">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" v-if="!onlyView">
      <el-button @click="onHandleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
import {getCargoReadyDateLogByOrderId} from "@/api/order/task";
import {submitCRD} from "@/api/order/task";
import {DICT_TYPE} from "@/utils/dict";

export default {
  name: "cargoReadyDate",
  props: ['title', 'cargoReadyDateFormVisible', 'onlyView', 'crdInfo', 'onHandleCRDClose', 'onSubmitCRDSuccess'],
  data() {
    return {
      loading: false,
      cargoHandoverDate: null,
      planCargoHandoverDate: null,
      crdRules: {
        cargoReadyDate:[
          { required : true, message: 'Cargo Ready Date Is Required' }
        ]
      },
      isOutsideCRD: false,
      form: {
        cargoReadyDate: null,
        outsideCRDReason: null,
        outsideCRDRemark: null
      },
    }
  },
  watch: {
    cargoReadyDateFormVisible(newVal, oldVal) {
      if (newVal) {
        if (this.crdInfo) {
          if (this.crdInfo.cargoHandoverDate) {
            // 填充HOD、PCRD
            this.cargoHandoverDate = moment(this.parseUTCTime(this.crdInfo.cargoHandoverDate)).toDate()
            this.planCargoHandoverDate = moment(this.parseUTCTime(this.crdInfo.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000)).toDate()
          }
        }
      }
    },
    onlyView(newVal, oldVal) {
      if (newVal) {
        if (this.crdInfo.jsonData) {
          const jsonData = JSON.parse(this.crdInfo.jsonData)
          if (jsonData?.cargoReadyDate) {
            this.form.cargoReadyDate = new Date(this.parseUTCTime(jsonData.cargoReadyDate))
            getCargoReadyDateLogByOrderId({ orderId: this.crdInfo.orderId }).then(res => {
              if (res.data) {
                this.form.outsideCRDReason = res.data.reason
                this.form.outsideCRDRemark = res.data.remark
                if (res.data.reason) {
                  // planCargoHandoverDate = cargoHandoverDate - 7天
                  // CRD与Planned CRD相差超过三天显示Reason和Remark
                  if (this.crdInfo.cargoHandoverDate) {
                    const planCargoHandoverDate = moment(this.crdInfo.cargoHandoverDate).valueOf() - 7 * 24 * 60 * 60 * 1000
                    const crd = Math.abs(moment(jsonData.cargoReadyDate).valueOf() - planCargoHandoverDate)
                    this.isOutsideCRD = crd > 3 * 24 * 60 * 60 * 1000
                  }
                }
              }
            })
          }
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
    onSubmit() {
      this.loading = true;
      this.$refs.cargoReadyDateFormRef.validate(async valid => {
        if (valid) {
          // 校验CRD时间（不跨年）
          const currentYear = new Date().getFullYear()
          const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
          if (Math.abs(cargoReadyYear - currentYear) > 0) {
            this.$confirm(<div>The year you submit is <span class="warning">{ cargoReadyYear }</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
              confirmButtonText: 'Submit',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(async () => {
              await this.onSubmitCRD(this.form)
              this.loading = false
              this.$emit('onSubmitCRDSuccess')
              this.$refs.cargoReadyDateFormRef.resetFields()
            }).catch(() => {
              this.loading = false
            })
          } else {
            await this.onSubmitCRD(this.form)
            this.loading = false
            this.$emit('onSubmitCRDSuccess')
          }
        } else {
          this.loading = false
        }
      })
    },
    onHandleClose() {
      // 退出清空数据
      this.isOutsideCRD = false
      this.cargoHandoverDate = null
      this.planCargoHandoverDate = null
      this.form = {
        cargoReadyDate: null,
        outsideCRDReason: null,
        outsideCRDRemark: null
      }
      this.$emit('onHandleCRDClose')
    },
    onCRDChange(value) {
      if (value) {
        // CRD与Planned CRD相差超过三天需要填Reason和Remark
        const crd = Math.abs(moment(value).valueOf() - moment(this.planCargoHandoverDate).valueOf())
        this.isOutsideCRD = crd > 3 * 24 * 60 * 60 * 1000;
      }
    },
    async onSubmitCRD(crdData) {
      // 提交CRD
      await submitCRD({
        id: this.crdInfo.orderTaskId,
        cargoReadyDate: moment(crdData.cargoReadyDate).valueOf(),
        reason: this.isOutsideCRD ? crdData.outsideCRDReason : null,
        remark: this.isOutsideCRD ? crdData.outsideCRDRemark : null
      })
    },
  }
}
</script>
