<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="updateTimeAuto">
        <el-input v-model="queryParams.name" placeholder="Name" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">Add</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:sub-dept:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="create_time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">Edit</el-button>
          <el-dropdown @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">More</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDelete" type="text" icon="el-icon-delete">Delete</el-dropdown-item>

              <el-dropdown-item command="handlePoClick" type="text" icon="el-icon-circle-check">User Po</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Please enter Name" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
    <add-remove-sub-dept-po-dialog ref="addRemoveSubDeptPoDialog"></add-remove-sub-dept-po-dialog>
  </div>
</template>

<script>
import { createSubDept, updateSubDept, deleteSubDept, getSubDept, getSubDeptPage, exportSubDeptExcel } from '@/api/system/subDept'
import AddRemoveSubDeptPoDialog from './components/AddRemoveSubDeptPoDialog.vue'

export default {
  name: 'SubDept',
  components: { AddRemoveSubDeptPoDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // party table列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        deptId: null,
        name: null,
        status: null,
        createTime: [],
        updateTimeAuto: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: 'Department Name不能为空', trigger: 'blur' }],
        status: [{ required: true, message: 'Department status (0 normal 1 disabled)不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCommand(command, row) {
      switch (command) {
        case 'handleDelete':
          this.handleDelete(row)
          break
        case 'handlePoClick':
          this.handlePoClick(row)
          break
        default:
          break
      }
    },
    handlePoClick(row) {
      console.log('handlePoClick')
      console.log(row)

      console.log(row.id)

      this.$refs.addRemoveSubDeptPoDialog.openDialog(row.id)
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getSubDeptPage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        name: undefined,
        status: undefined,
        updateTimeAuto: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = 'Add'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getSubDept(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Edit'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 修改的提交
        if (this.form.id != null) {
          updateSubDept(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createSubDept(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Delete"' + id + '" ?')
        .then(function () {
          return deleteSubDept(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm('Export all data?')
        .then(() => {
          this.exportLoading = true
          return exportSubDeptExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'sub party table.xls')
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
