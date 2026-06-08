<template>
  <el-dialog title="Asn Document" width="800px" :visible="visible" @close="onClose">
    <el-table
      ref="tableRef"
      row-key="id"
      v-loading="loading"
      :data="dataSource"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        reserve-selection
        width="55">
      </el-table-column>
      <el-table-column label="Role" prop="name"></el-table-column>
      <el-table-column label="Code" prop="code"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="onClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getRoles} from "@/api/system/role";
import {getAsnDocumentRolesByAsnId, linkAsnDocument} from "@/api/asnDocument/asnDocument";

export default {
  name: "linkAsnDocument",
  props: ['visible', 'rowInfo', 'handleClose'],
  data() {
    return {
      loading: false,
      dataSource: [],
      queryParams: {

      },
      multipleSelection: []
    }
  },
  watch: {
    async visible(newVal, oldVal) {
      if (newVal) {
        this.loading = true
        await this.getRolePage()
        if (this.rowInfo) {
          await this.getAsnDocumentRoles()
        }
        this.loading = false
      }
    }
  },
  methods: {
    onClose() {
      this.$emit("handleClose")
      this.multipleSelection = []
      // 用于多选表格，清空用户的选择
      this.$refs.tableRef.clearSelection()
    },
    async getAsnDocumentRoles() {
      // 获取已关联的ASN文件
      const res = await getAsnDocumentRolesByAsnId({ asnId: this.rowInfo.id })
      if (res.data) {
        this.multipleSelection = res.data
        this.dataSource.forEach(row => {
          if (res.data.includes(row.id)) {
            // 填充选中状态
            this.$refs.tableRef.toggleRowSelection(row, true)
          }
        })
      }
    },
    async getRolePage() {
      // 获取role数据
      const res = await getRoles()
      if (res.data) {
        this.dataSource = res.data
      }
    },
    onSubmit() {
      // 关联ASN和role
      linkAsnDocument({
        asnId: this.rowInfo.id,
        roleIds: this.multipleSelection
      }).then(res => {
        if (res.data) {
          this.$message.success('Success')
          this.onClose()
        }
      })
    },
    handleSelectionChange(row) {
      // 选中的行
      this.multipleSelection = row.map(item => item.id)
    }
  }
}
</script>
