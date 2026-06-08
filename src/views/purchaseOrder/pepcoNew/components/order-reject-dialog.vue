<template>
  <el-dialog title="Reject PO" width="500px" :visible="visible" @close="onHandleClose">
    <el-form ref="rejectFormRef" :model="form" :rules="rules" size="mini">
      <el-form-item label="Order Number" label-width="120px">
        <el-input v-model="orderInfo.orderNumber" disabled />
      </el-form-item>
      <el-form-item label="Reason" label-width="120px" prop="reason">
        <bsc-dictionary
          mode="select"
          v-model="form.reason"
          dict-type="order_header_reject_reason"
          placeholder="Please select reason"
          filterable
        />
      </el-form-item>
      <el-form-item label="Remark" label-width="120px" prop="remark">
        <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="Please enter remark" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onHandleClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="submitReject">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { rejectOrderHeader } from '@/api/order/header'

export default {
  name: 'OrderRejectDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      form: {
        reason: '',
        remark: ''
      },
      rules: {
        reason: [{ required: true, message: 'Reason is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  },
  methods: {
    submitReject() {
      this.$refs.rejectFormRef.validate(valid => {
        if (!valid) return
        this.loading = true
        rejectOrderHeader({
          orderHeaderId: this.orderInfo.id,
          reason: this.form.reason,
          remark: this.form.remark
        })
          .then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: 'Reject successful' })
              this.$emit('onRejectSuccess')
              this.onHandleClose()
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    onHandleClose() {
      this.$emit('onClose')
    },
    resetForm() {
      this.form = { reason: '', remark: '' }
      this.$nextTick(() => {
        this.$refs.rejectFormRef && this.$refs.rejectFormRef.resetFields()
      })
    }
  }
}
</script>
