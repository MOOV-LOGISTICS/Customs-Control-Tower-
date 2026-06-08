<template>
  <el-dialog :title="'Docs Ready'" :visible.sync="visible" width="500px" append-to-body :close-on-click-modal="false"
    @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="180px" label-position="right">
      <el-form-item label="Document Ready Action" prop="docReadyAction">
        <el-select v-model="form.docReadyAction" placeholder="Please select" style="width: 100%"
          @change="handleStatusChange">
          <el-option label="Yes" value="Yes" />
          <el-option label="No" value="No" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.docReadyAction === 'Yes'" label="Document Ready Date" prop="docReadyDate">
        <el-date-picker v-model="form.docReadyDate" type="date" placeholder="Select date"
          style="width: 100%" value-format="yyyy-MM-dd" disabled/>
      </el-form-item>

      <el-form-item label="Remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="Optional remark" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DocReadyDialog',

  props: {
    // 控制对话框显示
    value: {
      type: Boolean,
      default: false
    },
    // 当前行数据，单行编辑时传入；批量时传 null
    rowData: {
      type: Object,
      default: null
    },
    // 批量选中的 id 列表，批量操作时传入
    selectedIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      submitting: false,
      form: {
        docReadyAction: null,
        docReadyDate: null,
        remark: ''
      },
      rules: {
        docReadyAction: [
          { required: true, message: 'Document Ready Action is required', trigger: 'change' }
        ],
        docReadyDate: [
          {
            required: true,
            message: 'Document Ready Date is required',
            trigger: 'change',
            // action 为 Yes 时才需要校验
            validator: (rule, value, callback) => {
              if (this.form.docReadyAction === 'Yes' && !value) {
                callback(new Error('Document Ready Date is required'))
              } else {
                callback()
              }
            }
          }
        ]
      },
    }
  },

  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    // 提交时的 id 列表：单行取 rowData.id，否则取 selectedIds
    ids() {
      if (this.rowData) {
        return [this.rowData.id]
      }
      return this.selectedIds
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.initForm()
      }
    }
  },

  methods: {
    initForm() {
      // 单行编辑时回填现有数据
      if (this.rowData) {
        this.form.docReadyAction = this.rowData.docReadyStatus === 1 ? 'Yes' : this.rowData.docReadyStatus === 2 ? 'No' : null
        this.form.docReadyDate = this.rowData.docReadyDate
          ? this.rowData.docReadyDate.slice(0, 10)
          : this.getTodayDate()
        this.form.remark = this.rowData.docReadyRemark || ''
      } else {
        // 批量操作清空
        this.form.docReadyAction = null
        this.form.docReadyDate = this.getTodayDate()
        this.form.remark = ''
      }
    },

    getTodayDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        this.submitting = true

        // 日期拼接 00:00:00 给后端 LocalDateTime
        const dateTime = this.form.docReadyAction === 'Yes' && this.form.docReadyDate
          ? `${this.form.docReadyDate} 00:00:00`
          : null

        // 转换 docReadyAction 为 docReadyStatus
        const docReadyStatus = this.form.docReadyAction === 'Yes' ? 1 : this.form.docReadyAction === 'No' ? 2 : null

        const payload = {
          containerIds: this.ids,
          docReadyStatus: docReadyStatus,
          docReadyDate: dateTime,
          remark: this.form.remark || null
        }

        this.$emit('submit', payload, () => {
          this.submitting = false
          this.visible = false
        }, () => {
          this.submitting = false
        })
      })
    },

    handleClose() {
      this.$refs.formRef && this.$refs.formRef.resetFields()
      this.visible = false
    },
    handleStatusChange(val) {
      if (val === 'No') {
        this.form.docReadyDate = null
        // 清除日期字段的校验状态
        this.$nextTick(() => {
          this.$refs.formRef.clearValidate('docReadyDate')
        })
      } else if (val === 'Yes') {
        // 当选择 Yes 时，确保日期是当天
        if (!this.form.docReadyDate) {
          this.form.docReadyDate = this.getTodayDate()
        }
      }
    },
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>