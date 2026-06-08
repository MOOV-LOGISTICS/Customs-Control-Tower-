<script>
import {defineComponent} from 'vue'
import {shipmentDetails, updateShipmentCancelSubCode} from "@/api/shipment/shipment";

export default defineComponent({
  name: "modifyDialog",
  props: ['modifyVisible', 'selCancelCategory', 'selCancelReason', 'bookingNumber', 'onModifyClose'],
  data() {
    return {
      loading: false,
      form: {
        cancelCode: null,
        cancelSubCode: null,
        cancelRemark: null
      },
      rules: {
        cancelCode: [{ required: true, message: 'Please select Cancel Category' }],
        cancelSubCode: [{ required: true, message: 'Please select Cancel Reason' }]
      },
      cancelReason: []
    }
  },
  watch: {
    modifyVisible() {
      if (this.modifyVisible) {
        this.getShipmentDetails()
      }
    }
  },
  methods: {
    getShipmentDetails() {
      if (this.$route.query.id) {
        this.loading = true
        shipmentDetails(Number(this.$route.query.id)).then(res => {
          this.form.cancelCode = res.data.cancelCode
          this.form.cancelSubCode = res.data.cancelSubCode
          this.form.cancelRemark = res.data.cancelRemark
          this.cancelReason = this.selCancelReason.filter(item => item.parentEnumId === res.data.cancelCode);
        }).finally(() => {
          this.loading = false
        })
      }
    },
    handleClose() {
      this.$emit('onModifyClose')
      this.form.cancelCode = null
      this.form.cancelSubCode = null
      this.form.cancelRemark = null
    },
    onCancelSubCodeChange(value) {
      this.cancelReason = this.selCancelReason.filter(item => item.parentEnumId === value);
      this.form.cancelSubCode = null;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            this.loading = true
            updateShipmentCancelSubCode({
              id: this.$route.query.id,
              cancelCode: this.form.cancelCode,
              cancelSubCode: this.form.cancelSubCode,
              cancelRemark: this.form.cancelRemark
            }).then(res => {
              if (res) {
                this.handleClose()
                this.$message.success("Success")
              }
            }).finally(() => {
              this.loading = false
            })
          }
        }
      })
    }
  }
})
</script>

<template>
<div>
  <el-dialog
    v-loading="loading"
    title=""
    :visible="modifyVisible"
    width="40%"
    :before-close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="Cancel Category" prop="cancelCode">
        <el-select
          clearable
          v-model="form.cancelCode"
          size="mini"
          @change="onCancelSubCodeChange"
          placeholder="Please select Cancel Category"
          no-data-text="Please select Cancel Category first">
          <el-option v-for="item in selCancelCategory" :key="item.enumId" :label="item.description"
                     :value="item.enumId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cancel Reason" prop="cancelSubCode">
        <el-select clearable v-model="form.cancelSubCode" size="mini" placeholder="Please select Cancel Reason" no-data-text="Please select Cancel Category first">
          <el-option v-for="item in cancelReason" :key="item.enumId" :label="item.description"
                     :value="item.enumId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cancel Remark" prop="cancelRemark">
        <el-input
          clearable
          type="textarea"
          v-model="form.cancelRemark"
          placeholder="Please select Cancel Remark"
          size="mini"
          :rows="3"
          maxlength="1000"
          show-word-limit
          resize="none"/>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button @click="onSubmit" type="primary">Submit</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
