<template>
  <el-dialog title="Amend PO CRD Request" :visible.sync="dialogVisible" width="100%" @close="handleClose">
    <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="pd-20">
            <el-form v-loading="mvLoading" :model="form" ref="form" :show-message="false" label-width="0px">
              <el-card class="card-css">
                <div class="el-descriptions__title_css">{{ this.poCrdApprovalCommand.orderNumber }}</div>
              </el-card>
              <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
                <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="form.cargoReadyDate" type="date"
                  placeholder="Cargo Ready Date" disabled>
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="pd-20">
            <el-form v-loading="mvLoading" :model="form2" ref="form2" :rules="dynamicFormRules()" :show-message="false"
              label-width="0px">
              <el-card class="card-css">
                <div class="el-descriptions__title_css">{{ this.poCrdApprovalCommand.orderNumber }}</div>
              </el-card>
              <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
                <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="form2.cargoReadyDate" type="date"
                  placeholder="Cargo Ready Date" disabled>
                </el-date-picker>
              </el-form-item>
              <template v-if="form2.outsideCRDReason">
                <el-form-item label="Reason" label-width="180px" prop="outsideCRDReason">
                  <el-select v-model="form2.outsideCRDReason" disabled>
                    <el-option v-for="item in crdReasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Remark" label-width="180px" prop="remark">
                  <el-input type="textarea" :rows="2" v-model="form2.remark" disabled />
                </el-form-item>
              </template>
              <el-card class="card-css" v-if="customerAdminReqFlag && approvalInfo?.status < 2">
                <div class="el-descriptions__title_css">Amend Remark</div>
                <el-row>
                  <el-col :span="24">
                    <Editor style="height: 200px; overflow-y: hidden;border: 1px solid #ccc; " v-model="amendRemark" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
                  </el-col>
                </el-row>
                <div style="text-align: center;padding-top: 15px; padding-bottom: 10px;">
                  <el-button size="mini" type="success" round :loading="butLoading"
                    @click="submitRemark(2)">Approve</el-button>
                  <el-button size="mini" type="warning" round :loading="butLoading"
                    @click="submitRemark(3)">Reject</el-button>
                </div>
              </el-card>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { getBaseHeader } from '@/utils/request'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { poApprovalDetail, processPoCrdApproval } from '@/api/pepco/po-approval'
import {DICT_TYPE} from "@/utils/dict";
import moment from "moment";

export default {
  name: 'AmendPoCrdProcessDialog',
  mixins: [fileLoadMixin],
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      editorConfig: {
        placeholder: 'Remark...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
        }
      },
      mode: 'default',
      loadingSaveBut: false,
      form: {
        cargoReadyDate: undefined,
      },
      form2: {
        cargoReadyDate: undefined,
        outsideCRDReason: null,
        remark: null
      },
      poCrdApprovalCommand: {
        approvalId: undefined,
        remark: '',
        status: 0,
        orderId: undefined,
        orderNumber: '',
        oldCargoReadyDate: undefined,
        newCargoReadyDate: undefined
      },
      flag: false,
      submitLoading: false,
      mvLoading: false,
      customerAdminReqFlag: false,
      amendRemark: null,
      butLoading: false,
      approvalInfo: null,
      dialogVisible: false,
    }
  },
  computed: {
    crdReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_READY_DATE_REASON_CODE]
    }
  },
  mounted() {
    if (this.$auth.hasPermi('shipment:customerRequest')) {
      this.customerAdminReqFlag = true
    }
  },
  created() {
    console.log('----------------amendPoCrdProcessDialog----------------')
    const data = getBaseHeader()
    this.uploadHeaders = data
  },
  methods: {
    openDialog(approvalInfoId) {
      this.poCrdApprovalCommand.approvalId = approvalInfoId
      poApprovalDetail(approvalInfoId).then(res => {
        this.approvalInfo = res.data
        const originalData = JSON.parse(this.approvalInfo.originalData)
        const newData = JSON.parse(this.approvalInfo.newData)

        this.poCrdApprovalCommand.approvalId = approvalInfoId
        this.poCrdApprovalCommand.status = this.approvalInfo.status
        this.poCrdApprovalCommand.orderId = originalData.orderId
        this.poCrdApprovalCommand.orderNumber = originalData.orderNumber
        this.poCrdApprovalCommand.oldCargoReadyDate = originalData.cargoReadyDate
        this.poCrdApprovalCommand.newCargoReadyDate = newData.cargoReadyDate
        console.log(this.poCrdApprovalCommand.oldCargoReadyDate)
        console.log(this.poCrdApprovalCommand.newCargoReadyDate)

        // 展示时需要处理时区
        this.form.cargoReadyDate = moment(this.parseUTCTime(originalData.cargoReadyDate)).toDate()
        this.form2 = {
          cargoReadyDate: moment(this.parseUTCTime(newData.cargoReadyDate)).toDate(),
          outsideCRDReason: newData.outsideCRDReason,
          remark: newData.remark
        }

        this.dialogVisible = true
      })
    },
    handleClose(){
      this.dialogVisible = false
      this.amendRemark = null
    },
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    submitRemark(status) {
      var text = this.amendRemark
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br>]+>/g, '') // 将所有 换行符 replace ''
        .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
      if (status == 3 && !text) {
        this.$notify({ message: 'Please fill in the remarks', type: 'warning' })
        return
      }
      this.poCrdApprovalCommand.remark = this.amendRemark
      this.poCrdApprovalCommand.status = status
      this.poCrdApprovalCommand.outsideReason = this.form2.outsideCRDReason
      this.poCrdApprovalCommand.outsideRemark = this.form2.remark
      this.butLoading = true
      console.log("this.poCrdApprovalCommand",this.poCrdApprovalCommand)
      processPoCrdApproval(this.poCrdApprovalCommand).then(res => {
        this.butLoading = false
        this.dialogVisible = false
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        this.amendRemark = null
      })
    },
    // 根据form生成form2的动态验证规则
    dynamicFormRules() {
      const rules = {}
      // 遍历form的所有字段，并生成相应的验证规则
      for (let key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          // 对于字符串类型的字段，生成一个验证规则来检查是否与form2中的相应字段不同
          rules[key] = [{ validator: this.validateFieldDifference, trigger: 'blur' }]
        }
      }
      return rules
    },
    // 自定义验证规则，用于比较两个表单中的字段值是否不同
    validateFieldDifference(rule, value, callback) {
      const fieldName = rule.field
      const fieldPathParts = fieldName.split('.')
      let comparedValue = this.form2
      for (let i = 0; i < fieldPathParts.length; i++) {
        if (comparedValue && comparedValue.hasOwnProperty(fieldPathParts[i])) {
          comparedValue = comparedValue[fieldPathParts[i]]
        } else {
          // 如果字段路径不正确，则默认验证通过
          callback()
          return
        }
      }
      // 由于我们之前已经确保了字段是字符串类型，这里可以直接比较值
      console.log(fieldName, comparedValue, this.form[fieldName], comparedValue !== this.form[fieldName])
      if (comparedValue !== this.form[fieldName]) {
        callback(new Error(`${fieldName.replace(/\[.*\]/g, '')}的值必须与表单1中的值不同`))
      } else {
        callback()
      }
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))
        }
      })
    },
  }
}
</script>
<style scoped>
.shipping-create .card-css {
  border-radius: 0px !important;
  margin-top: 15px;
  padding: 0px 0px 15px 0px;
}

.shipmentRouters-css .el-form-item__content {
  margin: 0 !important;
}

.shipmentRouters-css label.el-form-item__label {
  display: none;
}

.uni-carrier-logo-image {
  width: 180px;
  height: 60px;
  image-rendering: -webkit-optimize-contrast;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
}

.ptp-results__transport-plan--deadline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  border: 1px solid #dbdbdb;
  padding: 8px;
  margin: 8px 0;
}

.ptp-results__transport-plan--mode {
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}

.ptp-results__transport-plan--vessel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}

.vessel-title {
  text-align: center;
}

.parties-name {
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
}

.contact-info-css {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 10px 0px 10px;
}

.el-descriptions__title_css {
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: 700;
}

.el-divider.el-divider--horizontal {
  width: 100%;
}

.car-css {
  padding-bottom: 4px;
}
</style>
