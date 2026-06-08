<template>
  <div style="margin: 10px;">
    <el-row :gutter="10">
      <el-col :span="12">
        <pepco-xml-check-list @afterSelect="afterClickItem"></pepco-xml-check-list>
      </el-col>
      <el-col :span="12">
        <pepco-xml-check-detail ref="checkDetail"></pepco-xml-check-detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PepcoXmlCheckList from './components/pepco-xml-check-list.vue'
import PepcoXmlCheckDetail from './components/pepco-xml-check-detail.vue'

export default {
  components: {PepcoXmlCheckList, PepcoXmlCheckDetail},
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    afterClickItem(row){
      // console.log('row', row)
      this.$refs.checkDetail.initList(row)
    }
  }
}
</script>

<style scoped>
</style>
