<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 搜索工作栏 -->
    <el-form :show-message="false"	 	 size='mini' :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="Full Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="Full Name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
<!--      <el-form-item label="联系人" prop="contactName">-->
<!--        <el-input v-model="queryParams.contactName" placeholder="请输入联系人" clearable @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="联系手机" prop="contactMobile">-->
<!--        <el-input v-model="queryParams.contactMobile" placeholder="请输入联系手机" clearable @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Status" clearable>
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                       :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="创建时间" prop="createTime">-->
<!--        <el-date-picker v-model="queryParams.createTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"-->
<!--                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
        <!-- <el-button size="mini"  icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleAdd"
                   v-hasPermi="['system:tenant:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini"  type="warning" plain icon="el-icon-download"  @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:tenant:export']">{{$t('search.export')}}</el-button>
      </el-col>
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px;"></right-toolbar>-->
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Customer Id" align="center" prop="id" />
      <el-table-column label="Full Name" align="center" prop="name" />
      <el-table-column label="Customer Plan" align="center" prop="packageId">
        <template v-slot="scope">
          <el-tag v-if="scope.row.packageId === 0" type="danger">System tenant</el-tag>
          <el-tag v-else> {{getPackageName(scope.row.packageId)}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Account limit" align="center" prop="accountCount">
        <template v-slot="scope">
          <el-tag> {{scope.row.accountCount}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Expiration date" align="center" prop="expireTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="Task status" align="center" prop="taskStatus">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.taskStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini"   type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:tenant:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:tenant:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form :show-message="false"	 	 size='mini'  ref="form" :model="form" :rules="rules" label-width="150px">
        <el-divider content-position="left">Customer Plan</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
          <el-form-item label="Full Name" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="Customer Plan" prop="packageId">
            <el-select v-model="form.packageId" clearable >
              <el-option v-for="item in packageList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="Account limit" prop="accountCount">
            <el-input-number v-model="form.accountCount"  controls-position="right" :min="0" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="Expiration time" prop="expireTime">
            <el-date-picker clearable  v-model="form.expireTime" type="date"
                            value-format="timestamp"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                        :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="taskStatus" prop="taskStatus">
            <el-radio-group v-model="form.taskStatus">
              <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                        :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">Customer Information</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="User Name" prop="username">
              <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
          </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.id === undefined" label="Password" prop="password">
            <el-input v-model="form.password" autocomplete="off" type="password" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="Login Email" prop="email">
              <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
          </el-col>

        <el-col :span="12">
            <el-form-item  label="Local Name" prop="localName">
              <el-input v-model="form.localName" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item  label="Country" prop="country">
            <el-select v-model="form.country" clearable >
              <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_COUNTRY)" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item  label="Tax" prop="tax">
              <el-input v-model="form.tax" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nation VAT number" prop="nationNumber">
              <el-input v-model="form.nationNumber" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="Addhoc" prop="addhoc">
              <el-input v-model="form.addhoc" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="Registration No" prop="registrationNo">
              <el-input v-model="form.registrationNo" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="ZIP" prop="zip">
              <el-input v-model="form.zip" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="Address" prop="address">
              <el-input v-model="form.address" autocomplete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="Company PIC" prop="companyPic">
              <el-input v-model="form.companyPic" autocomplete="off"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="butLoading"  type="primary" @click="submitForm">{{$t('el.popconfirm.confirmButtonText')}}</el-button>
        <el-button size="mini"  @click="cancel">{{$t('el.popconfirm.cancelButtonText')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTenant, updateTenant, deleteTenant, getTenant, getTenantPage, exportTenantExcel } from "@/api/system/tenant";
import { CommonStatusEnum } from '@/utils/constants'
import {getTenantPackageList} from "@/api/system/tenantPackage";

export default {
  name: "SystemTenant",
  components: {
  },
  data() {
    return {
      butLoading:false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 租户列表
      list: [],
      // Customer Plan列表
      packageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        contactName: null,
        contactMobile: null,
        status: undefined,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "Full Name不能为空", trigger: "blur" }],
        packageId: [{ required: true, message: "Customer Plan不能为空", trigger: "blur" }],
        status: [{ required: true, message: "租户状态不能为空", trigger: "blur" }],
        accountCount: [{ required: true, message: "账号额度不能为空", trigger: "blur" }],
        expireTime: [{ required: true, message: "过期时间不能为空", trigger: "blur" }],
        fullName: [{ required: true, message: "Full Name不能为空", trigger: "blur" }],
        username: [{ required: true, message: "User Name不能为空", trigger: "blur" }],
        email: [{ required: true, message: "Login Email不能为空", trigger: "blur" }],
        password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
    // 获得Customer Plan列表
    getTenantPackageList().then(response => {
      this.packageList = response.data;
    })
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getTenantPage(this.queryParams).then(response => {
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
        packageId: undefined,
        contactName: undefined,
        contactMobile: undefined,
        accountCount: undefined,
        expireTime: undefined,
        domain: undefined,
        status: CommonStatusEnum.ENABLE,
        taskStatus: CommonStatusEnum.ENABLE,
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
      getTenant(id).then(response => {
        this.form = response.data;
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
        this.butLoading = true
        // 修改的提交
        if (this.form.id != null) {
          updateTenant(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
            this.butLoading = false
          });
          return;
        }
        // 添加的提交
        createTenant(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
          this.butLoading = false
        });
        this.butLoading = false
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除Customer Id为"' + id + '"的数据项?').then(function() {
          return deleteTenant(id);
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
      this.$modal.confirm('是否确认导出所有租户数据项?').then(() => {
          this.exportLoading = true;
          return exportTenantExcel(params);
        }).then(response => {
          this.$download.excel(response, '租户.xlsx');
          this.exportLoading = false;
      }).catch(() => {});
    },
    /** 套餐名格式化 */
    getPackageName(packageId) {
      for (const item of this.packageList) {
        if (item.id === packageId) {
          return item.name;
        }
      }
      return '未知套餐';
    }
  }
};
</script>
