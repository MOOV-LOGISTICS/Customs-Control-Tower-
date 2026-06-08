<template>
  <div class="app-container">
    <el-card style="padding: 10px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="Under Checking" name="underChecking" v-if="this.$auth.hasPermi('generate-destination:check:show')">
          <under-checking ref="underCheckingRef" />
        </el-tab-pane>

        <el-tab-pane label="Under Generating" name="underGenerating" v-if="this.$auth.hasPermi('generate-destination:generate:show')">
          <under-generating ref="underGeneratingRef" />
        </el-tab-pane>

        <el-tab-pane label="Generation Completed" name="generationCompleted">
          <GenerationCompleted ref="generationCompletedRef" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import GenerationCompleted from './tabs/generation-completed.vue'
import UnderGenerating from './tabs/under-generating.vue'
import UnderChecking from './tabs/under-checking.vue'

export default {
  name: 'GenerateDataToDestinationIndex',
  components: { GenerationCompleted, UnderGenerating, UnderChecking },
  data() {
    return {
      activeName: 'underChecking'
    }
  },
  methods: {
    handleClick(tab) {
      console.log('切换到：', tab.paneName)
      if (tab.paneName === 'underGenerating') {
        this.$refs.underGeneratingRef.handleQuery()
      } else if (tab.paneName === 'generationCompleted') {
        this.$refs.generationCompletedRef.handleQuery()
      } else if (tab.paneName === 'underChecking') {
        this.$refs.underCheckingRef.handleQuery()
      }
    }
  }
}
</script>
