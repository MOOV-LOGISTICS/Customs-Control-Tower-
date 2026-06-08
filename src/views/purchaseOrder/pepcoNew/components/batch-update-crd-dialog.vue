<template>
  <div>
    <el-dialog v-loading="loading" :visible.sync="cargoReadyDateFormVisible" title="Batch Update Cargo Ready Date" width="70%"
      @close="close">
      <div>
        <el-form
          ref="cargoReadyDateFormRef"
          :disabled="view"
          :model="batchCargoReadyDateForm"
          size="small"
          label-width="180px"
          :rules="crdRules">
          <el-form-item>
            <el-button style="float: right;" type="primary" @click="handleUpdateCrdPoClick">Add / Remove PO</el-button>
          </el-form-item>
          <el-form-item label="Cargo Ready Date" prop="cargoReadyDate">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="batchCargoReadyDateForm.cargoReadyDate"
              type="date"
              @change="onCRDChange"
              placeholder="Cargo Ready Date">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="defaultReason" label="Default Reason" v-if="showDefault">
            <el-select
              v-model="batchCargoReadyDateForm.defaultReason"
              placeholder="Outside Cargo Ready Date Default Reason"
              @change="onDefaultReasonChange"
              clearable>
              <el-option v-for="item in crdReasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="defaultRemark" label="Default Remark" v-if="showDefault">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1 }"
              v-model="batchCargoReadyDateForm.defaultRemark"
              placeholder="Outside Cargo Ready Date Default Remark"
              @blur="onDefaultRemarkBlur"
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form ref="crdDataFormRef" :model="crdDataForm">
          <el-table v-loading="crdLoading" :data="crdDataForm.crdList" row-key="id">
            <el-table-column prop="orderNumber" label="Order Number" width="110"></el-table-column>
            <el-table-column prop="hod" label="HOD" width="90">
              <template slot-scope="scope">
                {{ parseUTCTime(scope.row.hod) }}
              </template>
            </el-table-column>
            <el-table-column prop="pCrd" label="Planned CRD" width="90">
              <template slot-scope="scope">
                {{ parseUTCTime(scope.row.pCrd) }}
              </template>
            </el-table-column>
            <el-table-column prop="outsideCRDReason" label="Outside Cargo Ready Date Reason" min-width="180">
              <template
                slot-scope="scope"
                v-if="Math.abs(moment(scope.row.pCrd).valueOf() - moment(batchCargoReadyDateForm.cargoReadyDate).valueOf()) / (24 * 60 * 60 * 1000) > 3">
                <el-form-item :prop="'crdList.' + scope.$index + '.outsideCRDReason'" :rules="[{ required: true, message: 'Outside Cargo Ready Date Reason Is Required' }]">
                  <el-select
                    @change="onCRDReasonChange(scope.row)"
                    v-model="scope.row.outsideCRDReason"
                    placeholder="Reason"
                    clearable>
                    <el-option v-for="item in crdReasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="outsideCRDRemark" label="Outside Cargo Ready Date Remark" min-width="180">
              <template
                slot-scope="scope"
                v-if="Math.abs(moment(scope.row.pCrd).valueOf() - moment(batchCargoReadyDateForm.cargoReadyDate).valueOf()) / (24 * 60 * 60 * 1000) > 3">
                <el-input
                  clearable
                  v-model="scope.row.outsideCRDRemark"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  @blur="onCRDRemarkChange(scope.row)"
                  placeholder="Remark">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="Action" align="center" width="80">
              <template slot-scope="scope">
                <i class="el-icon-delete icon-delete" @click="onDelete(scope.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" v-if="!view" class="dialog-footer">
          <el-button @click="close">Cancel</el-button>
          <el-button :loading="loading" type="primary" @click="batchUpdateCRDMethod">Submit</el-button>
        </div>
      </div>
    </el-dialog>


    <batch-update-crd-po-dialog ref="poDialog" @submit="refresh" :userInfo="userInfo" />
  </div>

</template>

<script>
import {batchUpdateCRD, getHeaderTasksByOrderNumbers} from "@/api/order/header";
import BatchUpdateCrdPoDialog from './batch-update-crd-po-dialog.vue';
import moment from "moment";
import {parseUTCTime} from "@/utils/ruoyi";
import {DICT_TYPE} from "@/utils/dict";

export default {
  name: 'batchUpdateCRD',
  props: {
    userInfo: {
      type: Object,
      required: false
    },
  },
  components: {BatchUpdateCrdPoDialog },
  data() {
    return {
      cargoReadyDateFormVisible: false,
      orderNumbersArray: [],
      needUpdatePOList: [],
      batchCargoReadyDateForm: {
        orderNumbers: [],
        orderNumbersString: '',
        cargoReadyDate: null,
        defaultReason: null,
        defaultRemark: null
      },
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        taskName: '',
        status: 0,
        statuskey: '',
        orderNumber: '',
      },
      view: false,
      crdRules: {
        cargoReadyDate: [
          { required: true, message: 'Cargo Ready Date Is Required', trigger: 'change' }
        ]
      },
      loading: false,
      crdLoading: false,
      crdDataForm: {
        crdList: []
      },
      showDefault: false,
    }
  },
  computed: {
    crdReasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CARGO_READY_DATE_REASON_CODE]
    }
  },
  methods: {
    moment,
    parseUTCTime,
    async openDialog(queryParams) {
      this.fillQueryParams(queryParams)
      this.resetForm()
      this.cargoReadyDateFormVisible = true
    },
    resetForm() {
      this.orderNumbersArray = []
      this.needUpdatePOList = []
      this.batchCargoReadyDateForm = {
        orderNumbers: [],
        orderNumbersString: '',
        cargoReadyDate: null,
      }
      if (this.$refs.cargoReadyDateFormRef) {
        this.$refs.cargoReadyDateFormRef.clearValidate()
      }
    },
    fillQueryParams(queryParams) {
      this.queryParams.taskName = queryParams.taskName
      this.queryParams.status = queryParams.status
      this.queryParams.statuskey = queryParams.statuskey
      this.queryParams.orderNumber = queryParams.orderNumber
    },
    batchUpdateCRDMethod() {
      // 增加 cargo ready date 校验
      this.$refs.cargoReadyDateFormRef.validate(async valid => {
        if (!valid) {
          console.log('验证失败，终止提交');
          // 拦截，不往下走
          return;
        }
        if (this.crdDataForm.crdList.length < 1) {
          this.$message.warning('There is no data that needs to be updated!');
          return
        }
        // 校验table中的outsideCRDReason、outsideCRDRemark
        this.$refs.crdDataFormRef.validate(async isValid => {
          if (isValid) {
            this.loading = true
            const params = []
            // 上传参数params，再次检查crd、pCrd，去除无用的useDefault
            this.crdDataForm.crdList.forEach(item => {
              if (Math.abs(moment(this.batchCargoReadyDateForm.cargoReadyDate).valueOf() - moment(item.pCrd).valueOf()) > 3 * 24 * 60 * 60 * 1000) {
                params.push({
                  orderNumber: item.orderNumber,
                  cargoReadyDate: moment(this.batchCargoReadyDateForm.cargoReadyDate).valueOf(),
                  cargoHandoverDate: item.hod,
                  outsideCRDReason: item.outsideCRDReason,
                  outsideCRDRemark: item.outsideCRDRemark,
                })
              } else {
                params.push({
                  orderNumber: item.orderNumber,
                  cargoReadyDate: moment(this.batchCargoReadyDateForm.cargoReadyDate).valueOf(),
                  cargoHandoverDate: item.hod,
                  outsideCRDReason: null,
                  outsideCRDRemark: null,
                })
              }
            })

            batchUpdateCRD(params).then(res => {
              this.$notify({ type: 'success', message: 'Success' })
              this.$emit('refresh', true)
              this.cargoReadyDateFormVisible = false
              this.loading = false
            }).catch((err) => {
              console.error('Error updating task11:', err);
              if (err !== 1002000031) {
                console.error('Error updating task12:', err);
                this.$message.error('Failed to update task');
              }
              this.$emit('refresh', false)
              this.cargoReadyDateFormVisible = false
              this.loading = false
            });
          }
        })
      })
    },
    handleUpdateCrdPoClick() {
      console.log('handleUpdateCrdPoClick')
      console.log(this.queryParams)
      this.$refs.poDialog.openDialog(this.queryParams, this.needUpdatePOList)
    },
    async refresh(selectedTable) {
      this.crdLoading = true
      if (selectedTable && selectedTable.length > 0) {
        this.needUpdatePOList = selectedTable
        this.orderNumbersArray = selectedTable.map(item => item.orderNumber)
        this.batchCargoReadyDateForm.orderNumbers = this.orderNumbersArray
        this.batchCargoReadyDateForm.orderNumbersString = this.orderNumbersArray.join(',')
        await this.checkCRDs()
      } else {
        this.orderNumbersArray = []
        this.batchCargoReadyDateForm.orderNumbers = []
        this.batchCargoReadyDateForm.orderNumbersString = ''
        this.needUpdatePOList = []
      }
      this.crdLoading = false
    },
    close() {
      this.orderNumbersArray = []
      this.needUpdatePOList = []
      this.batchCargoReadyDateForm = {
        orderNumbers: [],
        orderNumbersString: '',
        cargoReadyDate: null,
      }
      // 重置表单验证状态
      if (this.$refs.cargoReadyDateFormRef) {
        this.$refs.cargoReadyDateFormRef.clearValidate()
      }
      this.crdDataForm.crdList = []
      this.showDefault = false
      this.cargoReadyDateFormVisible = false
    },
    async checkCRDs() {
      // 获取hod
      const orders = await getHeaderTasksByOrderNumbers({ orderNumbers: this.batchCargoReadyDateForm.orderNumbersString })
      const crdList = []
      // planCargoHandoverDate = cargoHandoverDate - 7天
      // CRD与Planned CRD相差超过三天显示Reason,Remark,Default Reason
      let showDefault = false
      orders.data.forEach(order => {
        const pCrd = order.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000
        let outside = false
        // CRD与Planned CRD相差超过三天显示Default Reason
        if (Math.abs(moment(this.batchCargoReadyDateForm.cargoReadyDate).valueOf() - moment(pCrd).valueOf()) > 3 * 24 * 60 * 60 * 1000) {
          showDefault = true
          outside = true
        }
        crdList.push({
          id: order.id,
          orderNumber: order.orderNumber,
          cargoReadyDate: this.batchCargoReadyDateForm.cargoReadyDate,
          hod: order.cargoHandoverDate,
          pCrd: pCrd,
          outsideCRDReason: null,
          outsideCRDRemark: null,
          // 超出pCrd时，是否使用设置的默认reason
          useDefault: true,
          outside: outside
        })
      })
      this.showDefault = showDefault

      // 填充已经填写的数据
      this.crdDataForm.crdList.forEach(item => {
        const obj = crdList.find(elem => item.id === elem.id)
        if (obj && obj.outside) {
          obj.outsideCRDReason = item.outsideCRDReason
          obj.outsideCRDRemark = item.outsideCRDRemark
          obj.useDefault = item.useDefault
        }
      })

      this.crdDataForm.crdList = crdList
    },
    onDelete(index) {
      const row = this.crdDataForm.crdList.splice(index, 1)
      // 删除po dialog中的相应数据
      this.needUpdatePOList = this.needUpdatePOList.filter(item => item.orderId !== row[0].id)
    },
    onCRDChange(value) {
      if (value) {
        // 是否显示Default Reason
        for (let i = 0; i < this.crdDataForm.crdList.length; i++) {
          if (Math.abs(moment(value).valueOf() - moment(this.crdDataForm.crdList[i].pCrd).valueOf()) > 3 * 24 * 60 * 60 * 1000) {
            this.showDefault = true
            return
          }
        }
      }
      this.showDefault = false
    },
    onDefaultReasonChange(value) {
      // 对于需要默认填充的，填充reason
      for (let i = 0; i < this.crdDataForm.crdList.length; i++) {
        if (this.crdDataForm.crdList[i].useDefault) {
          this.crdDataForm.crdList[i].outsideCRDReason = value
        }
      }
    },
    onCRDReasonChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    },
    onDefaultRemarkBlur(event) {
      // 对于需要默认填充的，填充remark
      for (let i = 0; i < this.crdDataForm.crdList.length; i++) {
        if (this.crdDataForm.crdList[i].useDefault) {
          this.crdDataForm.crdList[i].outsideCRDRemark = event.target.value
        }
      }
    },
    onCRDRemarkChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
.icon-delete {
  color: red;
  font-size: 16px;
  cursor: pointer;
}
</style>
