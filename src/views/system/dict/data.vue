<template>
  <div class="app-container" style="width:90%;margin:0 auto;background-color: #fff;">
    <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="Dictionary Type" prop="dictType">
        <el-select v-model="queryParams.dictType">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.type"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Dictionary Label" prop="label">
        <el-input v-model="queryParams.label" placeholder="Please enter dictionary label" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Data Status" clearable>
          <el-option v-for="dict in statusDictDatas" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="Dictionary Code" align="center" prop="id" />
      <el-table-column label="Dictionary Label" align="center" prop="label" />
      <el-table-column label="Dictionary Value" align="center" prop="value" />
      <el-table-column label="Dictionary Sort" align="center" prop="sort" />
      <el-table-column label="Status" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="Color Type" align="center" prop="colorType" />
      <el-table-column label="CSS Class" align="center" prop="cssClass" />
      <el-table-column label="Remark" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="Creation Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
        <el-form-item label="Dictionary Type">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="Data Label" prop="label">
          <el-input v-model="form.label" placeholder="Please enter data label" />
        </el-form-item>
        <el-form-item label="Data Value" prop="value">
          <el-input v-model="form.value" type="textarea" placeholder="Please enter data value" />
        </el-form-item>
        <el-form-item label="Display Sort" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Color Type" prop="colorType">
          <el-select v-model="form.colorType">
            <el-option v-for="item in colorTypeOptions" :key="item.value" :label="item.label + '(' + item.value + ')'" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="CSS Class" prop="cssClass">
          <el-input v-model="form.cssClass" placeholder="Please enter CSS Class" />
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
import { listData, getData, delData, addData, updateData, exportData } from "@/api/system/dict/data";
import { listAllSimple, getType } from "@/api/system/dict/type";

import { CommonStatusEnum } from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'

export default {
  name: "SystemDictData",
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
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
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
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        label: [
          { required: true, message: "Data label cannot be empty", trigger: "blur" }
        ],
        value: [
          { required: true, message: "Data value cannot be empty", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "Display sort cannot be empty", trigger: "blur" }
        ]
      },
      // 数据标签回显样式
      colorTypeOptions: [{
          value: "default",
          label: "Default"
        }, {
          value: "primary",
          label: "Primary"
        }, {
          value: "success",
          label: "Success"
        }, {
          value: "info",
          label: "Info"
        }, {
          value: "warning",
          label: "Warning"
        }, {
          value: "danger",
          label: "Danger"
        }
      ],

      // 枚举
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS)
    };
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId;
    this.getType(dictId);
    this.getTypeList();
  },
  methods: {
    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.dictType = response.data.type;
        this.defaultDictType = response.data.type;
        this.getList();
      });
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listAllSimple().then(response => {
        this.typeOptions = response.data;
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.data.list;
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
        label: undefined,
        value: undefined,
        sort: 0,
        status: CommonStatusEnum.ENABLE,
        colorType: 'default',
        cssClass: undefined,
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
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add Dictionary Data";
      this.form.dictType = this.queryParams.dictType;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getData(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Dictionary Data";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateData(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then(response => {
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
      const ids = row.id;
      this.$modal.confirm('Are you sure you want to delete the dictionary item with code "' + ids + '"?').then(() => {
          return delData(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('Are you sure you want to export all items?').then(() => {
          this.exportLoading = true;
          return exportData(queryParams);
        }).then(response => {
          this.$download.excel(response, 'Dictionary Data.xlsx');
          this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
