<template>
  <div class="app-container" style="width:90%;margin:0 auto;">
    <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="Dictionary Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="Please enter dictionary name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Dictionary Type" prop="type">
        <el-input v-model="queryParams.type" placeholder="Please enter dictionary type" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Dictionary Status" clearable>
          <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Creation Time" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="Start Date" end-placeholder="End Date" :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
        <!-- <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd"
                   v-hasPermi="['system:dict:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="warning" icon="el-icon-download" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:dict:export']">{{ $t('search.export') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px;"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList">
      <el-table-column label="Dictionary Name" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="Dictionary Type" align="center" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <router-link :to="'/dict/type/data/' + scope.row.id" class="link-type">
            <span>{{ scope.row.type }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="Remark" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:dict:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    v-hasPermi="['system:dict:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :show-message="false" size='mini' ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Dictionary Name" prop="name">
          <el-input v-model="form.name" placeholder="Please enter dictionary name" />
        </el-form-item>
        <el-form-item label="Dictionary Type" prop="type">
          <el-input :disabled="typeof form.id !== 'undefined'" v-model="form.type" placeholder="Please enter dictionary type" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Range" prop="tenantVisible">
          <el-radio-group v-model="form.tenantVisible">
            <el-radio v-for="dict in dictRangeData" :key="dict.value=='true'?true:false" :label="dict.value=='true'?true:false">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="Please enter content"></el-input>
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
import { listType, getType, delType, addType, updateType, exportType } from "@/api/system/dict/type";

import { CommonStatusEnum } from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'

export default {
  name: "SystemDictType",
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        status: undefined,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "Dictionary name cannot be empty", trigger: "blur" }
        ],
        type: [
          { required: true, message: "Dictionary type cannot be empty", trigger: "blur" }
        ]
      },

      // 枚举
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      dictRangeData: getDictDatas(DICT_TYPE.SYSTEM_DICT_RANGE)
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      // 执行查询
      listType(this.queryParams).then(response => {
        this.typeList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        type: undefined,
        status: CommonStatusEnum.ENABLE,
        remark: undefined,
        tenantVisible: undefined
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
      getType(id).then(response => {
        this.form = response.data;
        console.log(this.form)
        this.open = true;
        this.title = "Edit Dictionary Type";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('Are you sure you want to delete the dictionary with ID "' + ids + '"?').then(() => {
          return delType(ids);
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
      this.$modal.confirm('Are you sure you want to export all dictionary types?').then(() => {
        this.exportLoading = true;
        return exportType(params);
      }).then(response => {
        this.$download.excel(response, 'Dictionary Types.xlsx');
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
