<template>
  <div v-if="visible">
    <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" :status="status" style="width: 150px;"></el-progress>
    <span>{{message2}}</span>
  </div>
</template>
  
  <script>
import { getProgress } from '@/api/system/common'

export default {
  name: 'Progress',
  data() {
    return {
      visible: false,
      percentage: 0,
      status: 'success',
      message: '',
      message2: 'processing...',
      fail: false,
      intervalId: null
    }
  },
  methods: {
    async showProgress(progressId) {
      console.log('progressId', progressId)
      this.visible = true
      this.message2 = 'processing...'
      this.status = 'success'
      this.fail = false
      this.percentage = 0

      // Clear any existing interval
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }

      // Start polling the progress
      this.intervalId = setInterval(async () => {
        try {
          const response = await getProgress(progressId)
          const { progress, total, complete, fail, message } = response.data || {}
          this.percentage = Math.round((progress / total) * 100)
          this.message = message || ''
          this.fail = fail || false
          if (fail) {
            this.status = 'exception'
          }
          // Stop polling when progress reaches 100%
          if (this.percentage >= 100 || fail) {
            this.message2 = this.fail ? 'Failed' : 'Completed'
            clearInterval(this.intervalId)
            this.intervalId = null
            this.hideProgress()
          }
        } catch (error) {
          console.error('Error fetching progress:', error)
          clearInterval(this.intervalId)
          this.intervalId = null
          this.hideProgress()
        }
      }, 1000) // Poll every second
    },
    hideProgress() {
      this.visible = false
      this.progress = 0
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      this.$emit('complete', this.message, this.fail) // Emit an event when progress is complete
    }
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
</script>
  
<style scoped>
</style>