<template>
  <el-dialog width="50%" title="Cannot proceed untill all previous tasks done" append-to-body :visible.sync="dialogVisible">
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
      <el-table-column prop="orderNumber" label="PO"></el-table-column>
      <el-table-column prop="soRef" label="SO Ref"></el-table-column>
      <el-table-column prop="taskStatus" label="Task Status">
        <template #default="scope">
          <span :style="{ color: scope.row.taskStatus !== status ? '#F56C6C' : '' }">{{ scope.row.taskStatus }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
  
<script>
export default {
  name: 'AddRemovePoDialog',
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      status: ''
    }
  },
  created() {},
  methods: {
    openDialog(data, status) {
      this.status = status
      console.log('传来的参数', data)
      this.dialogVisible = true
      this.tableData = data
    }
  }
}
</script>
  
<style>
</style>
