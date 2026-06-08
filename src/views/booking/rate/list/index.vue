<template>
    <div class="app-container">
  <div class="rate-list">
    <!-- <el-card style="padding:20px;background-color: #fff;"> -->
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="" prop="carrier">
        <el-select filterable clearable v-model="queryParams.carrier" placeholder="Carrier">
          <el-option
            v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
            :key="dict.value"
            :label="dict.label+' ('+dict.value+')'"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="contractNumber">
        <el-input v-model="queryParams.contractNumber" placeholder="Contract Number" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item style=" background-color: transparent;">
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"  ></i></el-button>
        <el-button @click="handleAdd"  type="primary" plain>Create<i class="el-icon-plus el-icon--right"  v-hasPermi="['booking:contract:create']"></i></el-button>
      </el-form-item>

    </el-form>

    <!-- 列表 -->
    <el-table  v-loading="loading" :data="list">
      <el-table-column label="Carrier" align="center" prop="carrier" />
      <el-table-column label="Contract Number" align="center" prop="contractNumber">
        <template v-slot="scope">
          <span >
            <el-link type="primary" @click="handleUpdate(scope.row)">{{ scope.row.contractNumber }}</el-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Rate Type" align="center" prop="rateType" />
      <el-table-column label="Effective Date" align="center" prop="validFrom" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.validFrom) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Expiry Date" align="center" prop="validTo" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.validTo) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Current Status" align="center" prop="status" />
      <el-table-column label="create_time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['booking:rate:delete']">delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
     <!-- </el-card> -->
  </div>
</div>
</template>

<script>
import { createRate, updateRate, deleteRate, getRate, getRatePage, exportRateExcel } from "@/api/booking/rate";

export default {
  name: "Rate",
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
      // shipment_contract_rate列表
      list: [],
      // 弹出层标题
      title: "",
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
        carrier: null,
        contractNumber: null,
        rateType: null,
        validFrom: null,
        validTo: null,
        status: null,
        calc: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      height:'',
    };
  },
  created() {
    this.getList();
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 400;
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getRatePage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        carrier: undefined,
        contractNumber: undefined,
        rateType: undefined,
        validFrom: undefined,
        validTo: undefined,
        status: undefined,
        calc: undefined,
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

      this.$router.push("/contract/addRate");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {

      const id = row.id;
      this.$router.push("/contract/addRate?id=" + id);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateRate(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.getList();
          });
          return;
        }
        // 添加的提交
        createRate(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Delete id "' + id + '"?').then(function() {
          return deleteRate(id);
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
      this.$modal.confirm('是否确认导出所有shipment_contract_rate数据项?').then(() => {
          this.exportLoading = true;
          return exportRateExcel(params);
        }).then(response => {
          this.$download.excel(response, 'shipment_contract_rate.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
