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
      <el-form-item label="AP" prop="ap">
        <el-input
          v-model="queryParams.ap"
          placeholder="Please input from AP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Rate No" prop="rateNo"> <el-input
        v-model="queryParams.rateNo"
        placeholder="Rate No"
        clearable
        @keyup.enter.native="handleQuery"
      />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>


        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">{{
          $t("search.reset")
        }}</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-upload2"
          @click="handleImport"
          >{{ $t("search.import") }}</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        style="right: 200px"
      ></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="AP" align="center" prop="ap" width="150" fixed />
      <el-table-column label="Rate NO." align="center" prop="rateNo" width="150" />
      <el-table-column label="Item NO." align="center" prop="itemNo" width="100" />
      <el-table-column label="Rate Type" align="center" prop="rateType" width="150" />
      <el-table-column label="Status" align="center" prop="status" width="150" />
      <el-table-column
        label="Customer Name"
        align="center"
        prop="customerName"
        width="180"
      />
      <el-table-column
        label="Customer Code"
        align="center"
        prop="customerCode"
        width="180"
      />
      <!-- <el-table-column label="Affiliate / Named Cust." align="center" prop="fromUnit" /> -->
      <el-table-column label="Eqp Type" align="center" prop="eqpType" width="120" />
      <!-- <el-table-column label="Org. Intransit" align="center" prop="fromUnit" /> -->
      <el-table-column label="Origin" align="center" prop="origin" width="120" />
      <el-table-column label="LoadPort" align="center" prop="loadPort" width="120" />
      <el-table-column label="DischPort" align="center" prop="dischPort" width="120" />
      <el-table-column label="Delivery" align="center" prop="delivery" width="120" />
      <!-- <el-table-column label="Del. Intransit" align="center" prop="delIntransit" /> -->
      <el-table-column label="Amount" align="center" prop="amount" width="120" />
      <el-table-column label="Currency" align="center" prop="currency" width="120" />
      <el-table-column
        label="Valid From"
        align="center"
        prop="validFrom"
        width="180"
        :formatter="formatTime"
      />
      <el-table-column
        label="Valid To"
        align="center"
        prop="validTo"
        width="180"
        :formatter="formatTimeTo"
      />
      <el-table-column
        label="Carriage Contract"
        align="center"
        prop="carriageContract"
        width="150"
      />
      <el-table-column label="TOS" align="center" prop="tos" width="100" />
      <el-table-column label="Rule" align="center" prop="rule" width="100" />
      <el-table-column label="SOC" align="center" prop="soc" width="100" />
      <el-table-column label="DG" align="center" prop="dg" width="100" />
      <el-table-column label="OOG" align="center" prop="oog" width="100" />
      <el-table-column
        fixed="right"
        :label="$t('notify.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:unit-conversion:delete']"
            >{{ $t("search.delete") }}</el-button
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

    <!-- 对话框(上传/下载模板) -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
          </div> -->
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
            <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="downloadImportTemplate"
            > {{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm" :loading="uploadLoading">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createUnitConversion,
  updateUnitConversion,
  deleteCra,
  getUnitConversion,
  getCraPage,
  importCraTemplate,
  exportCraTemplate,
} from "@/api/shipment/shipment";
import { getProductList } from "@/api/system/product";
import { getBaseHeader } from "@/utils/request";
import moment from "moment";
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: "UnitConversion",
  mixins: [fileLoadMixin],
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
      // 单位转换列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        ap: null,
      },
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/shipment/cra/import",
      },
      productList: [],
      productMap: {},
      uploadLoading:false,
    };
  },
  created() {
    this.getProductList();
  },
  methods: {

    downloadImportTemplate() {
      exportCraTemplate().then((res) => {
        this.$download.excel(res, "import_cra_template.xlsx");
      })
    },
    formatTime(row, column) {
      // 使用 Moment.js 或其他时间处理库对时间进行格式化
      var  dateArray = row.validFrom
      if(dateArray.length != 3){
        return ''
      }
      return moment([dateArray[0], dateArray[1] - 1, dateArray[2]]).format("YYYY-MM-DD");
    },
    formatTimeTo(row, column) {
      // 使用 Moment.js 或其他时间处理库对时间进行格式化
      var  dateArray = row.validTo
      if(dateArray.length != 3){
        return ''
      }
      return moment([dateArray[0], dateArray[1] - 1, dateArray[2]]).format("YYYY-MM-DD");
    },
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
    getUrlParam: function getURLParameter(name, urlsearch) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            urlsearch || location.search
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    getProductList() {
      this.loading = true;
      var vm = this;
      // 执行查询
      getProductList({ ids: [] }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.productMap[response.data[i].id] = {
            name: response.data[i].name,
            code: response.data[i].code,
          };
        }
        vm.productList = response.data;
        this.$nextTick(() => {
          if (vm.getUrlParam("productId", window.location.href)) {
            vm.$set(
              vm.queryParams,
              "productId",
              parseInt(vm.getUrlParam("productId", window.location.href))
            );
          }
          vm.getList();
        });
      });
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        ap: undefined,
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
      this.title = "添加单位转换";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getUnitConversion(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单位转换";
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
          updateUnitConversion(this.form).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createUnitConversion(this.form).then((response) => {
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
        .confirm("Whether to confirm the deletion of this data?")
        .then(function () {
          return deleteCra(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Deleted successfully");
        })
        .catch(() => {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "Import";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importCraTemplate().then((response) => {
        this.$download.excel(response, "CRA_temp.xlsx");
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.uploadLoading = true
      this.$refs.upload.submit();
    },
  },
};
</script>
