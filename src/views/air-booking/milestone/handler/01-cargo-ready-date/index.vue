<template>
  <el-dialog :title="title" width="600px" :visible="cargoReadyDateFormVisible" @close="onHandleClose">
    <el-form ref="cargoReadyDateFormRef" :model="form" size="small" :rules="crdRules">
      <el-form-item label="HOD" label-width="180px">
        <el-date-picker disabled format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="cargoHandoverDate" type="date"
          placeholder="HOD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Planned CRD" label-width="180px">
        <el-date-picker disabled format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="planCargoHandoverDate"
          type="date" placeholder="Planned CRD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
        <el-date-picker @change="onCRDChange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          v-model="form.cargoReadyDate" type="date" placeholder="Cargo Ready Date">
        </el-date-picker>
      </el-form-item>
      <template v-if="isOutsideCRD">
        <el-form-item label="Reason" label-width="180px" prop="outsideCRDReason"
          :rules="[{ required: true, message: 'Reason Is Required' }]">
          <el-select v-model="form.outsideCRDReason" placeholder="Reason" clearable>
            <el-option v-for="item in crdReasonCodes" :label="item.value + ' - ' + item.label" :value="item.value"
              :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" label-width="180px" prop="outsideCRDRemark">
          <el-input clearable v-model="form.outsideCRDRemark" type="textarea" :autosize="{ minRows: 2 }"
            placeholder="Remark">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" v-if="!view">
      <el-button @click="onHandleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { getCargoReadyDateLogByOrderId } from "@/api/order/task";
import { completeMilestone } from "@/api/air/booking";
import { DICT_TYPE } from "@/utils/dict";
import {
  getHeaderInfoForPepco,
} from "@/api/order/header";
export default {
  name: "CargoReadyDate",
  props: [],
  data() {
    return {
      title: '',
      loading: false,
      view: false,
      cargoReadyDateFormVisible: false,
      cargoHandoverDate: null,
      planCargoHandoverDate: null,
      crdRules: {
        cargoReadyDate: [
          { required: true, message: 'Cargo Ready Date Is Required' }
        ]
      },
      isOutsideCRD: false,
      form: {
        cargoReadyDate: null,
        outsideCRDReason: null,
        outsideCRDRemark: null
      },
      isProcessing: false,
      milestone: null,
      orderHeader: null,
    }
  },
  computed: {
    crdReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_READY_DATE_REASON_CODE]
    }
  },
  methods: {

    handle(milestone, mode) {
      this.milestone = milestone;
      this.openDialog(milestone, mode);
    },
    async openDialog(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      // 设置处理状态
      this.isProcessing = true;
      if (mode === 'view') {
        this.view = true;
      } else {
        this.view = false;
      }
      this.title = 'Cargo Ready Date - ' + milestone.orderNumber;
      await this.getOrderHeader(milestone.orderNumber)
      this.cargoReadyDateFormVisible = true;
      this.isProcessing = false;
    },
    async getOrderHeader(orderNumber) {
      try {
        const res = await getHeaderInfoForPepco({
          orderNumber: orderNumber
        });

        if (res.data) {
          const orderHeader = res.data;
          if (orderHeader.cargoHandoverDate) {
            // 填充HOD、PCRD
            this.cargoHandoverDate = moment(this.parseUTCTime(orderHeader.cargoHandoverDate)).toDate();
            this.planCargoHandoverDate = moment(this.parseUTCTime(orderHeader.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000)).toDate();
          }
          if (orderHeader.cargoReadyDate) {
            this.form.cargoReadyDate = new Date(this.parseUTCTime(orderHeader.cargoReadyDate))
            getCargoReadyDateLogByOrderId({ orderId: orderHeader.id }).then(res => {
              if (res.data) {
                this.form.outsideCRDReason = res.data.reason
                this.form.outsideCRDRemark = res.data.remark
                if (res.data.reason) {
                  // planCargoHandoverDate = cargoHandoverDate - 7天
                  // CRD与Planned CRD相差超过三天显示Reason和Remark
                  if (orderHeader.cargoHandoverDate) {
                    const crd = Math.abs(moment(this.form.cargoReadyDate).valueOf() - moment(this.planCargoHandoverDate).valueOf())
                    this.isOutsideCRD = crd > 3 * 24 * 60 * 60 * 1000
                  }
                }
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSubmit() {
      this.loading = true;
      this.$refs.cargoReadyDateFormRef.validate(async valid => {
        if (valid) {
          // 校验CRD时间（不跨年）
          const currentYear = new Date().getFullYear()
          const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
          if (Math.abs(cargoReadyYear - currentYear) > 0) {
            this.$confirm(<div>The year you submit is <span class="warning">{cargoReadyYear}</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
              confirmButtonText: 'Submit',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(async () => {
              await this.onSubmitCRD(this.form)
              this.loading = false
              this.$emit('success')
            }).catch(() => {
              this.loading = false
            })
          } else {
            await this.onSubmitCRD(this.form)
            this.loading = false
            this.$emit('success')
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
      if (this.$refs.cargoReadyDateFormRef) {
        this.$refs.cargoReadyDateFormRef.clearValidate()
      }
      this.cargoReadyDateFormVisible = false
      this.$emit('success')
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
      const command = {
        milestoneId: this.milestone.id,
        taskCode: this.milestone.taskCode,
        formData:[{"type":"date","key":"cargoReadyDate","label":"Cargo Ready Date","value":moment(crdData.cargoReadyDate).valueOf()}],
        params: {
          orderId: this.milestone.orderHeaderId,
          cargoReadyDate: moment(crdData.cargoReadyDate).valueOf(),
          reason: crdData.outsideCRDReason,
          remark: crdData.outsideCRDRemark
        }
      }
      await completeMilestone(command)
      this.onHandleClose()
    },
  }
}
</script>
