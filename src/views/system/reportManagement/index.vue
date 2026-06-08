<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="130px">
      <el-form-item label="Report Name" prop="reportName">
        <el-input v-model="queryParams.reportName" placeholder="Name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Status" clearable>
          <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Category" prop="categoryName">
        <el-select
          v-model="queryParams.categoryName"
          @change="handleQuery"
          multiple-limit="1"
          clearable
          filterable
          allow-create
          default-first-option>
          <el-option v-for="item in categoryNameList" :key="item.categoryName" :label="item.categoryName" :value="item.categoryName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Report Id" prop="reportId">
        <el-input v-model="queryParams.reportId" placeholder="Report Id" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" v-if="reportAdmin">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleAdd" >{{ $t('search.addNew') }}</el-button>
      </el-col>
    </el-row>


    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="report Name" align="center" prop="reportName" min-width="300px" show-overflow-tooltip />
      <el-table-column v-if="reportAdmin" label="report id" align="center" prop="reportId" min-width="100px" show-overflow-tooltip />
      <el-table-column v-if="reportAdmin" label="page name" align="center" prop="pageName" min-width="100px" show-overflow-tooltip/>
      <el-table-column label="Status" align="center" prop="status" min-width="100px"  >
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="Category" align="center" prop="categoryName" min-width="100px"  show-overflow-tooltip/>
      <el-table-column v-if="reportAdmin" label="Remark" align="center" min-width="200px"  prop="remark" show-overflow-tooltip/>
      <el-table-column label="create time" align="center" prop="createTime" min-width="160">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="200px" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                      >Update</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-if="reportAdmin">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="70%"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Report Name" prop="reportName">
          <el-input :disabled="!reportAdmin"  v-model="form.reportName" placeholder="" />
        </el-form-item>
        <el-form-item v-if="reportAdmin" label="Report Id" prop="reportId">
          <el-input v-model="form.reportId" placeholder="" />
        </el-form-item>
        <el-form-item v-if="reportAdmin" label="Page Name" prop="pageName">
          <el-input v-model="form.pageName" placeholder="" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
              {{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="Category" prop="categoryName">
          <el-select :disabled="!reportAdmin"
            v-model="form.categoryName"
            multiple-limit="1"
            clearable
            filterable
            allow-create
            default-first-option>
            <el-option v-for="item in categoryNameList" :key="item.categoryName"  :label="item.categoryName" :value="item.categoryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Users">
          <el-select v-model="form.userIds"  filterable clearable multiple placeholder="Select">
            <el-option
              v-for="item in users"
              :key="parseInt(item.id)"
              :label="item.nickname"
              :value="parseInt(item.id)"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="Post">-->
<!--          <el-select v-model="form.postIds" multiple placeholder="Select">-->
<!--            <el-option-->
<!--              v-for="item in postOptions"-->
<!--              :key="parseInt(item.id)"-->
<!--              :label="item.name"-->
<!--              :disabled="item.disabled"-->
<!--              :value="parseInt(item.id)"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item v-if="reportAdmin" label="Remark" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createReport, updateReport, deleteReport, getReport, getReportPage, exportReportExcel,findCategoryNameList } from "@/api/bi/report";
import { listSimplePosts } from "@/api/system/post";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

import { allUsers } from "@/api/system/user";

export default {
  name: "Report",
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
      // bi report列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      categoryNameList:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        reportId: null,
        pageName: null,
        customPage: null,
        createTime: [],
        status: null,
        categoryName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reportId: [{ required: true, message: "report id不能为空", trigger: "blur" }],
      },
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      // 岗位选项
      postOptions: [],
      postSet:[],
      reportAdmin :false,
      users:[],
    };
  },
  created() {
    this.getList();
    this.reportAdmin = this.checkPermi(['powerBi:admin'])
    findCategoryNameList().then(res =>{
      this.categoryNameList = res.data
    });

    // 获得用户列表
    allUsers().then(response => {
      this.users = response.data;
    })
  },
  methods: {
    checkPermi,
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getReportPage(this.queryParams).then(response => {
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
        reportId: undefined,
        pageName: undefined,
        customPage: undefined,
        status: undefined,
        categoryName: undefined,
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
      getReport(id).then(response => {
        this.form = response.data;
        this.form.postIds = response.data.postIds?response.data.postIds.split(',').map(parseFloat):[]
        this.open = true;
        this.title = "Update";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        this.form.postIdList = this.form.postIds
        this.form.postIds = ''
        // 修改的提交
        if (this.form.id != null) {
          updateReport(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createReport(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除bi report编号为"' + id + '"的数据项?').then(function() {
          return deleteReport(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有bi report数据项?').then(() => {
          this.exportLoading = true;
          return exportReportExcel(params);
        }).then(response => {
          this.$download.excel(response, 'bi report.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
