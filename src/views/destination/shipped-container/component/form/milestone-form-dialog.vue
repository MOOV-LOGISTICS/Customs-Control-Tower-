<template>
  <el-dialog :visible.sync="dialogVisible" title="Edit Form" width="50%" @close="handleClose" :modal="false">
    <el-form :model="formModel" label-width="200px">
      <el-form-item v-for="(item, index) in localFormData" :key="index" :label="item.label">
        <el-date-picker v-if="item.type == 'date'" v-model="formModel[`field_${index}`]" type="date" :disabled="mode === 'view'" value-format="yyyy-MM-dd" />
        <el-input v-else-if="item.type == 'text' && item.label != 'Arrive Hour'" v-model="formModel[`field_${index}`]" :disabled="mode === 'view'" />
        <el-time-picker
          v-else-if="item.type == 'text' && item.label == 'Arrive Hour'"
          type="time"
          format="HH:mm"
          v-model="formModel[`field_${index}`]"
          placeholder="Select Time"
          :disabled="mode === 'view'"
          value-format="HH:mm"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MilestoneFormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    destinationMilestoneCommand: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit', // 默认是编辑
      validator: value => ['edit', 'view'].includes(value)
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      localFormData: [],
      formModel: {}
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    },
    'destinationMilestoneCommand.formData': {
      immediate: true,
      handler(val) {
        try {
          let parsedData = typeof val === 'string' ? JSON.parse(val) : val
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData)
          }
          this.localFormData = parsedData
          // 构造 formModel 对象
          const model = {}
          parsedData.forEach((item, index) => {
            model[`field_${index}`] = item?.value ?? ''
          })

          this.formModel = model
        } catch (e) {
          console.log('cdccvc', this.localFormData)
          this.localFormData = []
          this.formModel = {}
        }
      }
    }
  },
  created() {
    console.log('this.deman', this.destinationMilestoneCommand)
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      // 把 formModel 的值更新回 localFormData
      const updatedFormData = this.localFormData.map((item, index) => {
        return {
          ...item,
          value: this.formModel[`field_${index}`]
        }
      })

      const updatedCommand = {
        ...this.destinationMilestoneCommand,
        formData: JSON.stringify(updatedFormData)
      }

      this.$emit('submit', updatedCommand)
      this.dialogVisible = false
    }
  }
}
</script>