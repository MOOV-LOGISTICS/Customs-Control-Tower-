<template>
  <div class="app-container" style="width:100%;margin:0 auto;">
  
    
    <!-- 搜索工作栏 -->
    <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
     >
      <div style="display: flex; align-items: center; gap: 10px; background-color: white; padding: 20px;">
        <el-input v-model="queryParams.name" :placeholder="$t('infra.name')" clearable @keyup.enter.native="handleQuery" />
        <el-input v-model="queryParams.key" :placeholder="$t('infra.key')" clearable @keyup.enter.native="handleQuery" />
        <el-date-picker v-model="queryParams.createTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
          range-separator="-" 
          :start-placeholder="$t('notify.startDate')"
          :end-placeholder="$t('notify.endDate')"
          :default-time="['00:00:00', '23:59:59']" />
        <div style="display: flex;">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('search.search')
            }}</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button>
             <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd"
          v-hasPermi="['infra:config:create']">{{ $t('search.addNew') }}</el-button>
          <el-button size="mini" type="warning" icon="el-icon-download" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['infra:config:export']">{{ $t('search.export') }}</el-button>
        </div>
      </div>
    </el-form>

 
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd"
          v-hasPermi="['infra:config:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="warning" icon="el-icon-download" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['infra:config:export']">{{ $t('search.export') }}</el-button>
      </el-col>
    </el-row> -->
    <div style="overflow: auto;width:calc(100%);float: left; background-color: white; padding: 20px;">
    <el-table v-loading="loading" :data="configList" border >
      <el-table-column :label="$t('infra.id')" align="center" prop="id" />
      <el-table-column :label="$t('infra.category')" align="center" prop="category" />
      <el-table-column :label="$t('infra.name')" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('infra.key')" align="center" prop="key" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('infra.value')" align="center" prop="value" />
      <el-table-column :label="$t('infra.visible')" align="center" prop="visible">
        <template v-slot="scope">
          <span>{{ scope.row.visible ? 'YES' : 'NO' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('infra.remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="Create Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column 
      :label="$t('infra.action')" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['infra:config:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['infra:config:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
   </div>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :show-message="false" size='mini' ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('infra.category')" prop="category">
          <el-input v-model="form.category" placeholder="Please enter the category" />
        </el-form-item>
        <el-form-item :label="$t('infra.name')" prop="name">
          <el-input v-model="form.name" placeholder="Please enter the name" />
        </el-form-item>
        <el-form-item :label="$t('infra.key')" prop="key">
          <el-input v-model="form.key" placeholder="Please enter the key" />
        </el-form-item>
        <el-form-item :label="$t('infra.value')" prop="value">
          <el-input v-model="form.value" placeholder="Please enter the value" />
        </el-form-item>
        <el-form-item :label="$t('infra.visible')" prop="type">
          <el-radio-group v-model="form.visible">
            <el-radio :key="true" :label="true">YES</el-radio>
            <el-radio :key="false" :label="false">NO</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('infra.remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="Please enter content" />
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
import { listConfig, getConfig, delConfig, addConfig, updateConfig, exportConfig } from "@/api/infra/config";

export default {
  name: "InfraConfig",
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
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        key: undefined,
        type: undefined,
        createTime: []
      },
      // 表单参数
      form: {}, 
      // 表单校验
      rules: {
        category: [
          { required: true, message: "category cannot be empty", trigger: "blur" }
        ],
        name: [
          { required: true, message: "Name cannot be empty", trigger: "blur" }
        ],
        key: [
          { required: true, message: "Key cannot be empty", trigger: "blur" }
        ],
        value: [
          { required: true, message: "Value cannot be empty", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }
      );
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
        key: undefined,
        value: undefined,
        remark: undefined
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
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
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
      this.$modal.confirm(' Are you sure you want to delete the ' + ids + '"?').then(function () {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Success");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('Are you sure you want to export all data?').then(() => {
        // 处理查询参数
        let params = { ...this.queryParams };
        params.pageNo = undefined;
        params.pageSize = undefined;
        this.exportLoading = true;
        return exportConfig(params);
      }).then(response => {
        this.$download.excel(response, 'ParameterConfig.xlsx');
        this.exportLoading = false;
      }).catch(() => { });
    },
  }
};
</script>
