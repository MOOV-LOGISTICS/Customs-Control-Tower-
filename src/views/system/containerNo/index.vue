<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card style="padding: 20px;">
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item label="Container No." prop="containerNo">
        <el-input
          v-model="queryParams.containerNo"
          placeholder="Container No."
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Container Type" prop="containerType">
        <el-input
          v-model="queryParams.containerType"
          placeholder="Container Type"
          clearable
          @keyup.enter.native="handleQuery"
        />

      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"

          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="Start Time"
          end-placeholder="End Time"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Clear</el-button> -->
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
          v-hasPermi="['system:container-no:create']"
          >Add</el-button
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
          v-hasPermi="['system:container-no:export']"
          >Export</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleImport"
          :loading="exportLoading"

          >Upload</el-button
        >
        <!-- v-hasPermi="['system:container-no:import']" -->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table :height="height" v-loading="loading" :data="list">
      <el-table-column label="Container No." align="center" prop="containerNo" width="180" />
      <el-table-column label="Container Type" align="center" prop="containerType" width="180" />
      <el-table-column label="Create Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:container-no:update']"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:container-no:delete']"
            >Delete</el-button
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
        <el-form-item label="箱号" prop="containerNo">
          <el-input v-model="form.containerNo" placeholder="请输入箱号" />
        </el-form-item>

        <el-form-item label="箱型" prop="containerType">
          <el-input v-model="form.containerType" placeholder="请输入箱型" />

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

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
        :action="upload.url"
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
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
      </div>
    </el-dialog>
  </el-card>
  </div>
</template>

<script>
import {
  createContainerNo,
  updateContainerNo,
  deleteContainerNo,
  getContainerNo,
  getContainerNoPage,
  exportContainerNoExcel,
  downloadContainerNoTemplate,
} from "@/api/system/containerNo";
import XLSX from "xlsx";
import { getBaseHeader } from "@/utils/request";
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: "ContainerNo",
  mixins: [fileLoadMixin],
  components: {},
  data() {
    return {
      upload:{
        open:false,
        title:'',
        headers: getBaseHeader(),
        url: process.env.VUE_APP_BASE_API + "/admin-api/system/container-no/import",
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 箱型箱号列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        containerNo: null,
        containerType: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      height:0
    };
  },
  created() {
    this.getList();
    const clientHeight = document.documentElement.clientHeight;
        this.height = clientHeight - 368;
  },
  methods: {
    handleImport(){
      this.upload.open=true
    },
    importTemplate(){
      downloadContainerNoTemplate({}).then((res)=>{
        this.$download.excel(res, "import_template.xlsx");
      })
    },
    handleFileSuccess(){
      this.upload.open=false
      this.getList()
      this.$refs.upload.clearFiles()
    },
    submitFileForm(){
      this.$refs.upload.submit();
    },

    handleFileUploadProgress(){
      console.log(123)
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getContainerNoPage(this.queryParams).then((response) => {
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
        containerNo: undefined,
        containerType: undefined,
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
      this.title = "添加箱型箱号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getContainerNo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改箱型箱号";
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
          updateContainerNo(this.form).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createContainerNo(this.form).then((response) => {
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
        .confirm('是否确认删除箱型箱号编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteContainerNo(id);
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
        .confirm("是否确认导出所有箱型箱号数据项?")
        .then(() => {
          this.exportLoading = true;
          return exportContainerNoExcel(params);
        })
        .then((response) => {
          this.$download.excel(response, "箱型箱号.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
