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
      <el-form-item label="Item number associated with the record" prop="itemNo">
        <el-input
          v-model="queryParams.itemNo"
          placeholder="请输入Item number associated with the record"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Type of rate" prop="rateType">
        <el-select
          v-model="queryParams.rateType"
          placeholder="请选择Type of rate"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Status of the record" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择Status of the record"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Name of the customer" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入Name of the customer"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Code representing the customer" prop="customerCode">
        <el-input
          v-model="queryParams.customerCode"
          placeholder="请输入Code representing the customer"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Affiliate named customer" prop="affiliateNamedCust">
        <el-input
          v-model="queryParams.affiliateNamedCust"
          placeholder="请输入Affiliate named customer"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Type of equipment" prop="eqpType">
        <el-select
          v-model="queryParams.eqpType"
          placeholder="请选择Type of equipment"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Origin intransit" prop="orgIintransit">
        <el-input
          v-model="queryParams.orgIintransit"
          placeholder="请输入Origin intransit"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Place of receipt" prop="placeOfReceipt">
        <el-input
          v-model="queryParams.placeOfReceipt"
          placeholder="请输入Place of receipt"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Port of loading" prop="portOfLoading">
        <el-input
          v-model="queryParams.portOfLoading"
          placeholder="请输入Port of loading"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Port of discharge" prop="portOfDischarge">
        <el-input
          v-model="queryParams.portOfDischarge"
          placeholder="请输入Port of discharge"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Final destination" prop="finalDestination">
        <el-input
          v-model="queryParams.finalDestination"
          placeholder="请输入Final destination"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Delivery intransit" prop="delIntransit">
        <el-input
          v-model="queryParams.delIntransit"
          placeholder="请输入Delivery intransit"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Amount associated with the record" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入Amount associated with the record"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Currency used for the amount" prop="currency">
        <el-input
          v-model="queryParams.currency"
          placeholder="请输入Currency used for the amount"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Validity start date" prop="validFrom">
        <el-input
          v-model="queryParams.validFrom"
          placeholder="请输入Validity start date"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Validity end date" prop="validTo">
        <el-input
          v-model="queryParams.validTo"
          placeholder="请输入Validity end date"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Carriage contract" prop="carriageContract">
        <el-input
          v-model="queryParams.carriageContract"
          placeholder="请输入Carriage contract"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Terms of service" prop="tos">
        <el-input
          v-model="queryParams.tos"
          placeholder="请输入Terms of service"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Rule associated with the record" prop="rule">
        <el-input
          v-model="queryParams.rule"
          placeholder="请输入Rule associated with the record"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Special equipment or container" prop="soc">
        <el-input
          v-model="queryParams.soc"
          placeholder="请输入Special equipment or container"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Dangerous goods" prop="dg">
        <el-input
          v-model="queryParams.dg"
          placeholder="请输入Dangerous goods"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Out of gauge" prop="oog">
        <el-input
          v-model="queryParams.oog"
          placeholder="请输入Out of gauge"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Commodity description" prop="commodity">
        <el-input
          v-model="queryParams.commodity"
          placeholder="请输入Commodity description"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Timestamp of record creation" prop="createTime">
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
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
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
          v-hasPermi="['system:cra:create']"
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
          v-hasPermi="['system:cra:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column
        label="Unique identifier for each record"
        align="center"
        prop="id"
      />
      <el-table-column
        label="Item number associated with the record"
        align="center"
        prop="itemNo"
      />
      <el-table-column label="Type of rate" align="center" prop="rateType" />
      <el-table-column label="Status of the record" align="center" prop="status" />
      <el-table-column label="Name of the customer" align="center" prop="customerName" />
      <el-table-column
        label="Code representing the customer"
        align="center"
        prop="customerCode"
      />
      <el-table-column
        label="Affiliate named customer"
        align="center"
        prop="affiliateNamedCust"
      />
      <el-table-column label="Type of equipment" align="center" prop="eqpType" />
      <el-table-column label="Origin intransit" align="center" prop="orgIintransit" />
      <el-table-column label="Place of receipt" align="center" prop="placeOfReceipt" />
      <el-table-column label="Port of loading" align="center" prop="portOfLoading" />
      <el-table-column label="Port of discharge" align="center" prop="portOfDischarge" />
      <el-table-column label="Final destination" align="center" prop="finalDestination" />
      <el-table-column label="Delivery intransit" align="center" prop="delIntransit" />
      <el-table-column
        label="Amount associated with the record"
        align="center"
        prop="amount"
      />
      <el-table-column
        label="Currency used for the amount"
        align="center"
        prop="currency"
      />
      <el-table-column label="Validity start date" align="center" prop="validFrom" />
      <el-table-column label="Validity end date" align="center" prop="validTo" />
      <el-table-column label="Carriage contract" align="center" prop="carriageContract" />
      <el-table-column label="Terms of service" align="center" prop="tos" />
      <el-table-column
        label="Rule associated with the record"
        align="center"
        prop="rule"
      />
      <el-table-column label="Special equipment or container" align="center" prop="soc" />
      <el-table-column label="Dangerous goods" align="center" prop="dg" />
      <el-table-column label="Out of gauge" align="center" prop="oog" />
      <el-table-column label="Commodity description" align="center" prop="commodity" />
      <el-table-column
        label="Timestamp of record creation"
        align="center"
        prop="createTime"
        width="180"
      >
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
            v-hasPermi="['system:cra:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:cra:delete']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Item number associated with the record" prop="itemNo">
          <el-input
            v-model="form.itemNo"
            placeholder="请输入Item number associated with the record"
          />
        </el-form-item>
        <el-form-item label="Type of rate" prop="rateType">
          <el-select v-model="form.rateType" placeholder="请选择Type of rate">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status of the record" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Name of the customer" prop="customerName">
          <el-input
            v-model="form.customerName"
            placeholder="请输入Name of the customer"
          />
        </el-form-item>
        <el-form-item label="Code representing the customer" prop="customerCode">
          <el-input
            v-model="form.customerCode"
            placeholder="请输入Code representing the customer"
          />
        </el-form-item>
        <el-form-item label="Affiliate named customer" prop="affiliateNamedCust">
          <el-input
            v-model="form.affiliateNamedCust"
            placeholder="请输入Affiliate named customer"
          />
        </el-form-item>
        <el-form-item label="Type of equipment" prop="eqpType">
          <el-select v-model="form.eqpType" placeholder="请选择Type of equipment">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="Origin intransit" prop="orgIintransit">
          <el-input v-model="form.orgIintransit" placeholder="请输入Origin intransit" />
        </el-form-item>
        <el-form-item label="Place of receipt" prop="placeOfReceipt">
          <el-input v-model="form.placeOfReceipt" placeholder="请输入Place of receipt" />
        </el-form-item>
        <el-form-item label="Port of loading" prop="portOfLoading">
          <el-input v-model="form.portOfLoading" placeholder="请输入Port of loading" />
        </el-form-item>
        <el-form-item label="Port of discharge" prop="portOfDischarge">
          <el-input
            v-model="form.portOfDischarge"
            placeholder="请输入Port of discharge"
          />
        </el-form-item>
        <el-form-item label="Final destination" prop="finalDestination">
          <el-input
            v-model="form.finalDestination"
            placeholder="请输入Final destination"
          />
        </el-form-item>
        <el-form-item label="Delivery intransit" prop="delIntransit">
          <el-input v-model="form.delIntransit" placeholder="请输入Delivery intransit" />
        </el-form-item>
        <el-form-item label="Amount associated with the record" prop="amount">
          <el-input
            v-model="form.amount"
            placeholder="请输入Amount associated with the record"
          />
        </el-form-item>
        <el-form-item label="Currency used for the amount" prop="currency">
          <el-input
            v-model="form.currency"
            placeholder="请输入Currency used for the amount"
          />
        </el-form-item>
        <el-form-item label="Validity start date" prop="validFrom">
          <el-input v-model="form.validFrom" placeholder="请输入Validity start date" />
        </el-form-item>
        <el-form-item label="Validity end date" prop="validTo">
          <el-input v-model="form.validTo" placeholder="请输入Validity end date" />
        </el-form-item>
        <el-form-item label="Carriage contract" prop="carriageContract">
          <el-input
            v-model="form.carriageContract"
            placeholder="请输入Carriage contract"
          />
        </el-form-item>
        <el-form-item label="Terms of service" prop="tos">
          <el-input v-model="form.tos" placeholder="请输入Terms of service" />
        </el-form-item>
        <el-form-item label="Rule associated with the record" prop="rule">
          <el-input
            v-model="form.rule"
            placeholder="请输入Rule associated with the record"
          />
        </el-form-item>
        <el-form-item label="Special equipment or container" prop="soc">
          <el-input
            v-model="form.soc"
            placeholder="请输入Special equipment or container"
          />
        </el-form-item>
        <el-form-item label="Dangerous goods" prop="dg">
          <el-input v-model="form.dg" placeholder="请输入Dangerous goods" />
        </el-form-item>
        <el-form-item label="Out of gauge" prop="oog">
          <el-input v-model="form.oog" placeholder="请输入Out of gauge" />
        </el-form-item>
        <el-form-item label="Commodity description" prop="commodity">
          <el-input v-model="form.commodity" placeholder="请输入Commodity description" />
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
  createCra,
  updateCra,
  deleteCra,
  getCra,
  getCraPage,
  exportCraExcel,
} from "@/api/system/cra";

export default {
  name: "Cra",
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
      // CRA列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        itemNo: null,
        rateType: null,
        status: null,
        customerName: null,
        customerCode: null,
        affiliateNamedCust: null,
        eqpType: null,
        orgIintransit: null,
        placeOfReceipt: null,
        portOfLoading: null,
        portOfDischarge: null,
        finalDestination: null,
        delIntransit: null,
        amount: null,
        currency: null,
        validFrom: null,
        validTo: null,
        carriageContract: null,
        tos: null,
        rule: null,
        soc: null,
        dg: null,
        oog: null,
        commodity: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemNo: [
          {
            required: true,
            message: "Item number associated with the record不能为空",
            trigger: "blur",
          },
        ],
        rateType: [
          { required: true, message: "Type of rate不能为空", trigger: "change" },
        ],
        status: [
          { required: true, message: "Status of the record不能为空", trigger: "blur" },
        ],
        customerName: [
          { required: true, message: "Name of the customer不能为空", trigger: "blur" },
        ],
        customerCode: [
          {
            required: true,
            message: "Code representing the customer不能为空",
            trigger: "blur",
          },
        ],
        amount: [
          {
            required: true,
            message: "Amount associated with the record不能为空",
            trigger: "blur",
          },
        ],
        currency: [
          {
            required: true,
            message: "Currency used for the amount不能为空",
            trigger: "blur",
          },
        ],
      },
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
      getCraPage(this.queryParams).then((response) => {
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
        itemNo: undefined,
        rateType: undefined,
        status: undefined,
        customerName: undefined,
        customerCode: undefined,
        affiliateNamedCust: undefined,
        eqpType: undefined,
        orgIintransit: undefined,
        placeOfReceipt: undefined,
        portOfLoading: undefined,
        portOfDischarge: undefined,
        finalDestination: undefined,
        delIntransit: undefined,
        amount: undefined,
        currency: undefined,
        validFrom: undefined,
        validTo: undefined,
        carriageContract: undefined,
        tos: undefined,
        rule: undefined,
        soc: undefined,
        dg: undefined,
        oog: undefined,
        commodity: undefined,
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
      this.title = "添加CRA";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCra(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改CRA";
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
          updateCra(this.form).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCra(this.form).then((response) => {
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
        .confirm('是否确认删除CRA编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCra(id);
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
        .confirm("是否确认导出所有CRA数据项?")
        .then(() => {
          this.exportLoading = true;
          return exportCraExcel(params);
        })
        .then((response) => {
          this.$download.excel(response, "CRA.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
