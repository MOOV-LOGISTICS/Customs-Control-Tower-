<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Data" name="first">
        <BomList ref="bomList"></BomList>
      </el-tab-pane>
      <el-tab-pane label="Upload Log" name="files">
        <upload-log ref="uploadLog"></upload-log>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BomList from './components/bom-list'
import UploadLog from './components/upload-log.vue'

export default {
  name: 'InventoryBom',
  components: { BomList, UploadLog },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      if (tab.name === 'first') {
        this.$refs.bomList.activeTab()
      }
      if (tab.name === 'files') {
        this.$refs.uploadLog.activeTab()
      }
    }
  }
}
</script>