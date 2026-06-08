<template>
  <el-dialog title="Update Cargo Ready Date" width="600px" :visible="visible" @close="onHandleClose">
    <el-form ref="cargoReadyDateUpdateFormRef" :model="form" size="small" :rules="crdRules">
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
    <div slot="footer">
      <el-button @click="onHandleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
import {parseUTCTime} from "@/utils/ruoyi";
import {getCargoReadyDateLogByOrderId} from "@/api/order/task";
import {updateCRD} from "@/api/order/header";
import {DICT_TYPE} from "@/utils/dict";

export default {
  name: "cargoReadyDateUpdate",
  props: ['visible', 'crdInfo', 'formData','onHandleCRDClose', 'onUpdateCRDSuccess'],
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
        outsideCRDRemark: null,
        taskStatusName:null,
        taskStatusSeq: null
      },
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        if (this.crdInfo) {
          if (this.crdInfo.cargoHandoverDate) {
            this.cargoHandoverDate = moment(this.parseUTCTime(this.crdInfo.cargoHandoverDate)).toDate()
            this.planCargoHandoverDate = moment(this.parseUTCTime(this.crdInfo.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000)).toDate()
            if (this.crdInfo.cargoReadyDate) {
              // element ui resetFields问题
              this.$nextTick(() => {
                this.form.cargoReadyDate = moment(this.parseUTCTime(this.crdInfo.cargoReadyDate)).toDate()
                // 填充reason、remark
                if (Math.abs(moment(parseUTCTime(this.crdInfo.cargoReadyDate)).valueOf() - moment(this.planCargoHandoverDate).valueOf()) > 3 * 24 * 60 * 60 * 1000) {
                  this.isOutsideCRD = true
                  getCargoReadyDateLogByOrderId({ orderId: this.crdInfo.orderId }).then(res => {
                    if (res.data) {
                      this.form.outsideCRDReason = res.data.reason
                      this.form.outsideCRDRemark = res.data.remark
                    }
                  })
                }
              })
            }
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
      this.loading = true
      console.log('formData',this.formData)
      this.$refs.cargoReadyDateUpdateFormRef.validate(async valid => {
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
              await updateCRD({
                ...this.form,
                id: this.crdInfo.id,
                orderNumber: this.crdInfo.orderNumber,
                taskStatusName: this.formData.taskStatusName,
                cargoReadyDate: moment(this.form.cargoReadyDate).valueOf()
              })
              this.loading = false
              this.$emit('onUpdateCRDSuccess')
            }).catch(() => {
              this.loading = false
            })
          } else {
            await updateCRD({
              ...this.form,
              id: this.crdInfo.id,
              orderNumber: this.crdInfo.orderNumber,
              taskStatusName: this.formData.taskStatusName,
              cargoReadyDate: moment(this.form.cargoReadyDate).valueOf()
            })
            this.loading = false
            this.$emit('onUpdateCRDSuccess')
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
      this.$refs.cargoReadyDateUpdateFormRef.resetFields();
      this.$emit('onHandleUpdateCRDClose');
    },
    onCRDChange(value) {
      if (value) {
        // CRD与Planned CRD相差超过三天需要填Reason和Remark
        const crd = Math.abs(moment(value).valueOf() - moment(this.planCargoHandoverDate).valueOf())
        this.isOutsideCRD = crd > 3 * 24 * 60 * 60 * 1000;
      }
    }
  }
}
</script>
