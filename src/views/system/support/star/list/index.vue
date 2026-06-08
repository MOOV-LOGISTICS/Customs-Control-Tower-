<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="" prop="Email">
        <el-input v-model="queryParams.email" placeholder="Email" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="" prop="Star">
        <el-input v-model="queryParams.star" placeholder="Rating" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="" prop="title">
        <el-input v-model="queryParams.title" placeholder="Title" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="" prop="description">
        <el-input v-model="queryParams.description" placeholder="Description" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Create time" prop="createTime" label-width="100px">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="Start" end-placeholder="End" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Create time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center" prop="email" />
      <el-table-column label="Rating" align="center" prop="star" />
      <el-table-column label="Title" align="center" prop="title" />
      <el-table-column label="Description" align="center" prop="description" />

      <el-table-column label="File" align="center" prop="file" width="180">
        <template v-slot="scope">
          <el-link :href="scope.row.fileUrls" :title="scope.row.fileNames" target ="_blank">
            <svg v-show="scope.row.fileUrls" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round"/><path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C"/><path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:star:delete']">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

  </div>
</template>

<script>
import { createStar, updateStar, deleteStar, getStar, getStarPage, exportStarExcel } from "@/api/system/star";

export default {
  name: "Star",
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
      // system_star列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        fileIds: null,
        fileNames: null,
        fileUrls: null,
        star: null,
        title: null,
        desc: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
      getStarPage(this.queryParams).then(response => {
        this.list = [];
        for(var item of response.data.list) {
          item.description = item.description==null||item.description=='null'?'':item.description
          item.title = item.title==null||item.title=='null'?'':item.title
          this.list.push(item)
        }
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
        fileIds: undefined,
        fileNames: undefined,
        fileUrls: undefined,
        star: undefined,
        title: undefined,
        desc: undefined,
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
      this.title = "Add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getStar(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit";
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
          updateStar(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createStar(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Delete id:"' + id + '"?').then(function() {
          return deleteStar(id);
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
      this.$modal.confirm('是否确认导出所有system_star数据项?').then(() => {
          this.exportLoading = true;
          return exportStarExcel(params);
        }).then(response => {
          this.$download.excel(response, 'system_star.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
