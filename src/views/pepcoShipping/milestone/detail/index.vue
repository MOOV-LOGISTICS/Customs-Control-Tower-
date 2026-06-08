<template>
  <el-dialog :visible.sync="dialogVisible" title="Milestone Detail" width="80%" append-to-body :before-close="handleClose">
    <milestone-detail ref="milestoneDetail" :milestoneId="milestoneId"></milestone-detail>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary">Submit</el-button>
    </div>-->
  </el-dialog>
</template>
    
<script>
import MilestoneDetail from '../components/milestone-detail.vue'

export default {
  name: 'MilestoneDetailDialog',
  components: { MilestoneDetail },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      dialogLoading: false,
      milestoneId: undefined
    }
  },
  methods: {
    openDialog(milestoneId) {
      this.milestoneId = milestoneId
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.milestoneDetail.refresh(milestoneId)
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs.milestoneDetail.clear()
      })
    }
  }
}
</script>
    
<style scoped>
</style>
    