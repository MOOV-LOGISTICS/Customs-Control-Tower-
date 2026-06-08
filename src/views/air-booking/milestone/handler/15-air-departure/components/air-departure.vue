<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div style="padding: 0 20px;">
      <el-form :model="formData" ref="formRef" label-width="250px" :disabled="mode !== 'edit'">
        <el-form-item v-for="(item, index) in formTemplates" :key="index" :label="item.label" :prop="item.label"
          :required="item.required">
          <!-- 文本输入框 -->
          <el-input v-if="item.type === 'text'" v-model="formData[item.label]" :placeholder="item.label"
            clearable></el-input>

          <!-- 日期选择 -->
          <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.label]" type="date"
            value-format="yyyy-MM-dd" placeholder="please select date" clearable></el-date-picker>

          <!-- 下拉选择 -->
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.label]" placeholder="please select">
            <el-option v-for="(opt, i) in item.options || []" :key="i" :label="opt" :value="opt"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <so-milestone-detail ref="soMilestoneDetail" v-if="milestone.level === 2" max-height="500px"></so-milestone-detail>
    <cb-milestone-detail ref="cbMilestoneDetail" v-if="milestone.level === 3" max-height="500px"></cb-milestone-detail>

    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { completeMilestone } from "@/api/air/booking";
import SoMilestoneDetail from '@/views/air-booking/milestone/components/so-milestone-detail.vue'
import CbMilestoneDetail from '@/views/air-booking/milestone/components/cb-milestone-detail.vue'

export default {
  name: 'CommonMilestoneHnadler',
  components: { SoMilestoneDetail, CbMilestoneDetail },
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
    ...mapGetters(['airMilestoneSetList'])
  },
  async created() {
    console.log('milstone common handler  created')
    if (this.airMilestoneSetList.length === 0) {
      await this.$store.dispatch('system/fetchAirTaskSetList')
    }
  },
  methods: {
    openDialog(milestone, mode) {
      console.log('openDialog', milestone, mode)
      this.dialogVisible = true
      this.dialogLoading = true
      let milestoneKey = ''
      if (milestone.level === 1) {
        milestoneKey = milestone.orderNumber;
      } else if (milestone.level === 2) {
        milestoneKey = milestone.shippingOrderRef;
      } else if (milestone.level === 3) {
        milestoneKey = milestone.shipmentRef;
      }
      this.title = milestone.taskName + ' [ ' + milestoneKey + ' ]'
      this.milestone = milestone
      this.mode = mode

      const setting = this.airMilestoneSetList.find(v =>
        v.taskCode.toLowerCase() === milestone.taskCode.toLowerCase()
      )
      console.log('milestone', this.airMilestoneSetList)
      console.log('setting', setting)
      // 设置默认值为空数组
      this.formTemplates = setting ? JSON.parse(setting.formTemplate) : [];
      this.formTemplates.forEach(item => {
        this.$set(this.formData, item.label, '')
      })
      console.log('formData', this.formData)
      if (mode === 'view') {
        this.$set(this.formData, 'ATD', moment(this.milestone.atd).format('yyyy-MM-DD'))
      }
      this.$nextTick(() => {
        if (this.$refs.soMilestoneDetail) {
          if (this.milestone.level === 2) {
            this.$refs.soMilestoneDetail.refresh(this.milestone.id)
          }
        }
        if (this.$refs.cbMilestoneDetail) {
          if (this.milestone.level === 3) {
            this.$refs.cbMilestoneDetail.refresh(this.milestone.id)
          }
        }
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
            taskCode: this.milestone.taskCode,
            formData: this.formTemplates
          }
          this.dialogLoading = true
          completeMilestone(command).then(res => {
            this.$emit('success', command)
            this.$message.success('Submit successfully')
            this.dialogLoading = false
            this.dialogVisible = false
            // 清除表单校验状态
            this.$refs.formRef.clearValidate()
          }).catch(error => {
            this.$message.error(error.message)
            this.dialogLoading = false
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
