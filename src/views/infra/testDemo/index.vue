<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 搜索工作栏 -->
    <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="Please enter name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Please select status" clearable>
          <el-option label="Please select dictionary generation" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select v-model="queryParams.type" placeholder="Please select type" clearable>
          <el-option label="Please select dictionary generation" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-input v-model="queryParams.category" placeholder="Please enter category" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Remark" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="Please enter remark" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Creation Time" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="Start Date" end-placeholder="End Date" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('search.search') }}</el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd"
                   v-hasPermi="['infra:test-demo:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="warning" plain icon="el-icon-download" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['infra:test-demo:export']">{{ $t('search.export') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Status" align="center" prop="status" />
      <el-table-column label="Type" align="center" prop="type" />
      <el-table-column label="Category" align="center" prop="category" />
      <el-table-column label="Remark" align="center" prop="remark" />
      <el-table-column label="Creation Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['infra:test-demo:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['infra:test-demo:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :show-message="false" size='mini' ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Please enter name" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">Please select dictionary generation</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="form.type" placeholder="Please select type">
            <el-option label="Please select dictionary generation" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-input v-model="form.category" placeholder="Please enter category" />
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="form.remark" placeholder="Please enter remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">{{ $t('el.popconfirm.confirmButtonText') }}</el-button>
        <el-button size="mini" @click="cancel">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTestDemo, updateTestDemo, deleteTestDemo, getTestDemo, getTestDemoPage, exportTestDemoExcel } from "@/api/infra/testDemo";

export default {
  name: "TestDemo",
  components: {
  },
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
      // 字典类型列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        status: null,
        type: null,
        category: null,
        remark: null,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "Name cannot be empty", trigger: "blur" }],
        status: [{ required: true, message: "Status cannot be empty", trigger: "blur" }],
        type: [{ required: true, message: "Type cannot be empty", trigger: "change" }],
        category: [{ required: true, message: "Category cannot be empty", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getTestDemoPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        status: undefined,
        type: undefined,
        category: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add Dictionary Type";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getTestDemo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Dictionary Type";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateTestDemo(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createTestDemo(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Are you sure you want to delete the dictionary type with ID "' + id + '"?').then(() => {
          return deleteTestDemo(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      // 执行导出
      this.$modal.confirm('Are you sure you want to export all dictionary type items?').then(() => {
          this.exportLoading = true;
          return exportTestDemoExcel(params);
        }).then(response => {
          this.$download.excel(response, 'Dictionary Type.xlsx');
          this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
