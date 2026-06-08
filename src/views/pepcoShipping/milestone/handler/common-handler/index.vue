<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div style="padding: 0 20px;">
      <el-form :model="formData" ref="formRef" label-width="200px" :disabled="mode !== 'edit'">
        <el-form-item v-for="(item, index) in formTemplates" :key="index" :label="item.label" :prop="item.label" :required="item.required">
          <!-- 文本输入框 -->
          <el-input v-if="item.type === 'text'" v-model="formData[item.label]" :placeholder="item.label" clearable></el-input>

          <!-- 日期选择 -->
          <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.label]" type="date" value-format="yyyy-MM-dd" placeholder="please select date" clearable></el-date-picker>

          <!-- 下拉选择 -->
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.label]" placeholder="please select">
            <el-option v-for="(opt, i) in item.options || []" :key="i" :label="opt" :value="opt"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <milestone-detail ref="milestoneDetail" max-height="500px"></milestone-detail>

    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { completeMilestone } from '@/api/pepco/milestone'
import MilestoneDetail from '@/views/pepcoShipping/milestone/components/milestone-detail.vue'

export default {
  name: 'CommonMilestoneHnadler',
  components: { MilestoneDetail },
  data() {
    return {
      title: 'Task Form',
      dialogVisible: false,
      dialogLoading: false,
      // 动态表单配置
      formTemplates: [],
      milestone: {},
      // 表单数据容器
      formData: {},
      mode: 'view'
    }
  },
  computed: {
    ...mapGetters(['milestoneSetList'])
  },
  async created() {
    console.log('milstone common handler  created')
    if (this.milestoneSetList.length === 0) {
      await this.$store.dispatch('system/fetchTaskSetList')
    }
  },
  methods: {
    openDialog(milestone, mode) {
      this.dialogVisible = true
      this.dialogLoading = true
      this.title = milestone.taskName + ' [ ' + milestone.shippingOrderRef + ' ]'
      this.milestone = milestone
      this.mode = mode

      const setting = this.milestoneSetList.find(v => v.taskCode === milestone.taskCode)
      this.formTemplates = JSON.parse(setting.formTemplate)
      this.formTemplates.forEach(item => {
        this.$set(this.formData, item.label, '')
      })
      if (mode === 'view') {
        const list = JSON.parse(milestone.formData)
        if (list && list.length > 0) {
          list.forEach(item => {
            this.formData[item.label] = item.value
          })
        }
      }
      this.$nextTick(() => {
        this.$refs.milestoneDetail.refresh(this.milestone.id)
      })
      this.dialogLoading = false
    },
    handleSubmit() {
      console.log('handleSubmit1', this.formData)
      console.log('handleSubmit', this.formTemplates)
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.formTemplates.forEach(item => {
            item.value = this.formData[item.label]
          })
          const command = {
            milestoneId: this.milestone.id,
            formData: this.formTemplates
          }
          this.dialogLoading = true
          completeMilestone(command).then(res => {
            this.$emit('success', command)
            this.$message.success('Submit successfully')
            this.dialogLoading = false
            this.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}
</style>
