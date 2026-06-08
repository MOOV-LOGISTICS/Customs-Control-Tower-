<template>
  <el-dialog title="Overdue Booked ETD Reason" :visible="visible" width="700px" @close="onClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="Category" prop="category">
        <el-select v-model="form.category" @change="onCategoryChange">
          <el-option v-for="item in categoryOptions" :label="item.remark" :value="item.remark" :key="item.remark"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Reason description" prop="reason">
        <el-select v-model="form.reason">
          <el-option v-for="item in reasonOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" autosize />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {submitOverdueBookedETD} from "@/api/shipping/order";

export default {
  name: "OverdueBookedETDDialog",
  props: ['visible', 'categoryOptions', 'rowInfo', 'handleClose', 'successCallback'],
  data() {
    return {
      loading: false,
      form: {
        category: null,
        reason: null,
        remark: null
      },
      rules: {
        category: [{ required: true }],
        reason: [{ required: true }]
      },
      reasonOptions: [],
    }
  },
  methods: {
    onCategoryChange(value) {
      // category改变时清除reason description并更新reason选择项
      this.form.reason = null
      if (value) {
        this.reasonOptions = this.getDictDatas(this.DICT_TYPE.Overdue_Booked_ETD_Log).filter(item => item.remark === value)
      } else {
        this.reasonOptions = []
      }
    },
    onClose() {
      // 关闭弹窗时清空数据
      this.$emit('handleClose')
      this.$refs.formRef.resetFields()
    },
    onSubmit() {
      this.loading = true
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // 提交记录
          submitOverdueBookedETD({
            shippingId: this.rowInfo.id,
            ...this.form
          }).then(res => {
            if (res.data) {
              this.$emit('successCallback')
              this.loading = false
              this.$refs.formRef.resetFields()
            }
          }).catch(err => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
