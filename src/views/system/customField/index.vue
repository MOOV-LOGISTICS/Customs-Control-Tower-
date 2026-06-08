<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="field" prop="field">
        <el-input
          v-model="queryParams.field"
          placeholder="请输入field"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="display_text" prop="displayText">
        <el-input
          v-model="queryParams.displayText"
          placeholder="请输入display_text"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="type" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择type"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="create_time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"

          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button  @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:custom-field:create']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:custom-field:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="field" align="center" prop="field" />
      <el-table-column label="display_text" align="center" prop="displayText" />
      <el-table-column label="type" align="center" prop="type" />
      <el-table-column label="create_time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:custom-field:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:custom-field:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      v-dialogDrag
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="type" prop="type">
          <el-select v-model="form.type" placeholder="请选择type">
            <el-option
              v-for="dict in getDictDatas(DICT_TYPE.FIELD_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="field" prop="field">
          <el-select v-model="form.field">
            <el-option
              v-for="i in 20"
              :label="'backupStr' + i"
              :value="'backupStr' + i"
              :key="'str' + i"
            ></el-option>
            <el-option
              v-for="i in 10"
              :value="'backupDate' + i"
              :label="'backupDate' + i"
              :key="'date' + i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="display_text" prop="displayText">
          <el-input v-model="form.displayText" placeholder="请输入display_text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createCustomField,
  updateCustomField,
  deleteCustomField,
  getCustomField,
  getCustomFieldPage,
  exportCustomFieldExcel,
} from "@/api/system/customField";

export default {
  name: "CustomField",
  components: {},
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
      // 自定义字段列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        field: null,
        displayText: null,
        type: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
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
      getCustomFieldPage(this.queryParams).then((response) => {
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
        field: undefined,
        displayText: undefined,
        type: undefined,
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
      this.title = "添加自定义字段";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCustomField(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改自定义字段";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateCustomField(this.form).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCustomField(this.form).then((response) => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除自定义字段编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCustomField(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm("是否确认导出所有自定义字段数据项?")
        .then(() => {
          this.exportLoading = true;
          return exportCustomFieldExcel(params);
        })
        .then((response) => {
          this.$download.excel(response, "自定义字段.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
