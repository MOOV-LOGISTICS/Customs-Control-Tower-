<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 搜索工作栏 -->
    <el-form :show-message="false"	 	 size="mini" :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item label="Warehouse Name" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="please input Warehouse Name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Country" prop="country">
        <el-input v-model="queryParams.country" placeholder="Please input Country" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="State" prop="state">
        <el-input v-model="queryParams.state" placeholder="Please input State" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="City" prop="city">
        <el-input v-model="queryParams.city" placeholder="Please input City" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <!-- <el-form-item label="ZIP" prop="zip">
        <el-input v-model="queryParams.zip" placeholder="Please input ZIP" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <!-- <el-form-item label="Contact" prop="contact">
        <el-input v-model="queryParams.contact" placeholder="please input Contact" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <!-- <el-form-item label="status" prop="status">
        <el-select v-model="queryParams.status" placeholder="please chose status" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item> -->

      <el-form-item label="Warehouse Category" prop="warehouseCategory">
        <el-input v-model="queryParams.warehouseCategory" placeholder="Please input Warehouse Category" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Address" prop="warehouseDetailAddress">
        <el-input v-model="queryParams.warehouseDetailAddress" placeholder="Please input Address" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <!-- <el-form-item label="Email" prop="telephoneEmail">
        <el-input v-model="queryParams.telephoneEmail" placeholder="Please input Email" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <el-form-item label="Warehouse Type" prop="warehouseType">
        <el-input v-model="queryParams.warehouseType" placeholder="Please input Warehouse Type" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>



      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['system:warehouse:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:warehouse:export']">{{$t('search.export')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px;"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" :header-cell-style="{fontSize: '1px'}" style="width: 100%">

    <!-- :header-cell-style="{color: 'red', fontSize: '14px', backgroundColor: '#qua'}"> -->

      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column fixed label="Warehouse Name" align="left" prop="warehouseName"

      width="200" />
      <el-table-column label="City" align="left" prop="city" :show-overflow-tooltip='true' width="200"/>
      <el-table-column label="State" align="left" prop="state" :show-overflow-tooltip='true' width="200"/>
      <el-table-column label="Country" align="left" prop="country" :show-overflow-tooltip='true' width="200"/>
      <el-table-column label="ZIP" align="left" prop="zip" :show-overflow-tooltip='true' width="200"/>

      <el-table-column label="Contact" align="left" prop="contact" :show-overflow-tooltip='true' width="200"/>

      <el-table-column label="Status" align="left" prop="status" width="70"/>
      <!-- <el-table-column label="CreateTime" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Warehouse Category" align="left" prop="warehouseCategory"
      :show-overflow-tooltip='true' width="200"/>

      <el-table-column label="Address" align="left" prop="warehouseDetailAddress" :show-overflow-tooltip='true' width="200"/>
      <el-table-column label="Email" align="left" prop="telephoneEmail" :show-overflow-tooltip='true' width="200"/>
      <el-table-column label="Warehouse Type" align="left" prop="warehouseType" width="200"/>

      <el-table-column label="Operate" align="left" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:warehouse:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:warehouse:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form :show-message="true"	 	 ref="form" size="mini" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Warehouse Name" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="please input Warehouse Name" />
        </el-form-item>


        <el-form-item label="Country" prop="country">
            <el-select v-model="form.country" filterable placeholder="please choose Country" @change="getProvince">
            <el-option
              v-for="item in countries"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Province/State" prop="state">
          <el-select v-model="form.state" filterable placeholder="please choose State" @change="getCity">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="City" prop="city">
          <el-select v-model="form.city" filterable placeholder="please choose City">
            <el-option
              v-for="item in cities"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ZIP" prop="zip">
          <el-input v-model="form.zip" placeholder="please input ZIP" />
        </el-form-item>
        <el-form-item label="Contact" prop="contact">
          <el-input v-model="form.contact" placeholder="please input Contact" />
        </el-form-item>
        <el-form-item label="Warehouse Category" prop="warehouseCategory">
          <el-select v-model="form.warehouseCategory" clearable >
              <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAREHOUSE_CATEGORY)" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
              <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                        :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Address" prop="warehouseDetailAddress">
          <el-input  type="textarea" :autosize="{ minRows: 4}" v-model="form.warehouseDetailAddress" placeholder="please input Address" />
        </el-form-item>
        <el-form-item label="Email" prop="telephoneEmail">
          <el-input v-model="form.telephoneEmail" placeholder="Email" />
        </el-form-item>
        <el-form-item label="Warehouse Type" prop="warehouseType">
          <el-select v-model="form.warehouseType" clearable >
              <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAREHOUSE_TYPE)"
              :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('el.popconfirm.confirmButtonText')}}</el-button>
        <el-button @click="cancel">{{$t('el.popconfirm.cancelButtonText')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>

/* .el-table__header tr,.el-table__header th {
            padding: 0;
            height: 30px!important;
            line-height: 30px!important;
        } */

</style>

<script>
import { createWarehouse, updateWarehouse, deleteWarehouse, getWarehouse, getWarehousePage, exportWarehouseExcel,getCountries } from "@/api/system/warehouse";

export default {
  name: "Warehouse",
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
      // system_warehouse列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        warehouseName: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        contact: null,
        status: null,
        createTime: [],
        warehouseCategory: null,
        warehouseDetailAddress: null,
        telephoneEmail: null,
        warehouseType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseName: [{ required: true, message: "Warehouse Name can not be empty", trigger: "blur" }],
        city: [{ required: true, message: "City can not be empty", trigger: "blur" }],
        state: [{ required: true, message: "State can not be empty", trigger: "blur" }],
        country: [{ required: true, message: "Country can not be empty", trigger: "blur" }],
        status: [{ required: true, message: "Status can not be empty", trigger: "blur" }],

        warehouseDetailAddress: [{ required: true, message: "Address can not be empty", trigger: "blur" }],

        telephoneEmail: [{ required: true, message: "telephoneEmail can not be empty", trigger: "blur" },
        { type: 'email', message: 'Please enter a correct email address', trigger: "blur" }],

        warehouseType: [{ required: true, message: "warehouseType can not be empty", trigger: "blur" }],

      },
      countries: [],
      provinces:[],
      cities:[],
      country: '',
      state: '',
      city:''

    };
  },
  created() {
    this.getList();
    this.getCounty(0);
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getWarehousePage(this.queryParams).then(response => {
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
        warehouseName: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        zip: undefined,
        contact: undefined,
        status: 0,
        warehouseCategory: undefined,
        warehouseDetailAddress: undefined,
        telephoneEmail: undefined,
        warehouseType: undefined

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
      this.title = "Add system Warehouse";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getWarehouse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Modify System Warehouse";
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
          updateWarehouse(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createWarehouse(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除system_warehouse编号为"' + id + '"的数据项?').then(function() {
          return deleteWarehouse(id);
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
      this.$modal.confirm('是否确认导出所有system_warehouse数据项?').then(() => {
          this.exportLoading = true;
          return exportWarehouseExcel(params);
        }).then(response => {
          this.$download.excel(response, 'system_warehouse.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    },
    getCounty(id){
        getCountries(id).then( response =>
          {

          this.countries=[];
           this.countries=response.data;
        }
        );
      return;
    },
    getProvince(id){
      getCountries(id).then( response =>
          {
          this.state='';
          this.city='';
          this.provinces=response.data;
        }
        );
      return;
    },
    getCity(id){
      getCountries(id).then( response =>
          {
          this.city='';
          this.cities=response.data;
        }
        );
      return;
    },
  // renderHeader(h, {column}) {
  // let header = column.label.split(' ');
  // return [h('p', [
  //   h('p', {}, header[0]),
  //   h('span', {}, header[1])
  // ])];
  //   }
  }
};
</script>
