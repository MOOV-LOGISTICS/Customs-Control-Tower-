<template>
  <div class="app-container">
    <div class="inventory-in-list">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="" prop="productCode">
        <el-select v-model="queryParams.productCode"  placeholder="Sku" clearable filterable @keyup.enter.native="handleQuery">
          <el-option v-for="item in productList" :label="item.code+'-'+item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="warehouseName">
        <el-select v-model="queryParams.warehouseName"  placeholder="Warehouse Id" clearable filterable @keyup.enter.native="handleQuery">
          <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.warehouseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="inboundTime">
        <el-date-picker v-model="queryParams.inboundTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="Inbound data" end-placeholder="Inbound data" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>

      <el-form-item style=" background-color: transparent;">
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"  ></i></el-button>
        <!-- <el-button @click="handleAdd"  type="primary" plain>Create<i class="el-icon-plus el-icon--right"  v-hasPermi="['booking:contract:create']"></i></el-button> -->
      </el-form-item>

    <!-- 操作工具栏 -->
      <div style="float: right;padding-top: 10px;">
        <el-row>
          <div style="float: right">
            <svg @click="handleImport" style="cursor: pointer;"  width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha"><path d="M48 0H0V48H48V0Z" fill="#004F7C"/></mask><g mask="url(#icon-21f8f28d7f10b972)"><path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
            <svg @click="handleExport" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 23L24 32L15 23" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 6V32" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div style="float: left">
          </div>
        </el-row>
      </div>

    </el-form>



    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Warehouse Name" align="center" prop="warehouseName" />
      <el-table-column label="Sku Id" align="center" prop="productCode" />
      <el-table-column label="Sku Name" align="center" prop="productName" />
      <el-table-column label="Inbound Qty" align="center" prop="qty" />
      <el-table-column label="Unit" align="center" prop="unit" />
      <!-- <el-table-column label="remark" align="center" prop="remark" /> -->

      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>


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
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
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
            @click="importTemplate"
            >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="uploadError.title"
      :visible.sync="uploadError.dialogVisible"
      width="50%" >
      <el-table :data="uploadError.data"
                style="width: 100%"
                max-height="500px">
        <el-table-column property="data" label="Data Error" >
          <template slot-scope="scope">
            <span >{{scope.row}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>

  </div>
  </div>
</template>

<script>
import { createInventoryIn, updateInventoryIn, deleteInventoryIn, getInventoryIn, getInventoryInPage, exportInventoryInExcel
,downloadInventoryInTemplate } from "@/api/order/inventoryIn";
import { getWarehousePage } from "@/api/system/warehouse";
import { getProductPage } from "@/api/system/product";
import { getBaseHeader } from "@/utils/request";
import { fileLoadMixin } from '@/utils/fileLoadMixin'


export default {
  name: "Inventory",
  mixins: [fileLoadMixin],
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
      // order_inventory列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        source: null,
        customer: null,
        orderId: null,
        orderItemId: null,
        orderNumber: null,
        productCode: null,
        productName: null,
        warehouseName: null,
        remark: null,
        innerBoxes: null,
        unit: null,
        batch: null,
        lwh: null,
        registerTime: [],
        startTime: [],
        endTime: [],
        createTime: [],
        customerStorageId: null,
        productId: null,
        inventoryTime: [],
        count: null,
        units: null,
        qty: null,
        weight: null,
        volume: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        innerBoxes: [{ required: true, message: "inner boxes不能为空", trigger: "blur" }],
        count: [{ required: true, message: "count不能为空", trigger: "blur" }],
        units: [{ required: true, message: "units不能为空", trigger: "blur" }],
        qty: [{ required: true, message: "qty不能为空", trigger: "blur" }],
      },
      warehouseList:[],
      productList:[],
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
        url: process.env.VUE_APP_BASE_API + "/admin-api/order/inventory-in/import",
      },
      uploadError:{
        title: "Errors",
        dialogVisible: false,
        data: ""
      },

    };
  },
  created() {
    this.getList();
    this.getWarehousePage();
    this.getProductPage();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getInventoryInPage(this.queryParams).then(response => {
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
        source: undefined,
        customer: undefined,
        orderId: undefined,
        orderItemId: undefined,
        orderNumber: undefined,
        productCode: undefined,
        productName: undefined,
        warehouseName: undefined,
        remark: undefined,
        innerBoxes: undefined,
        unit: undefined,
        batch: undefined,
        lwh: undefined,
        registerTime: undefined,
        startTime: undefined,
        endTime: undefined,
        customerStorageId: undefined,
        productId: undefined,
        inventoryTime: undefined,
        count: undefined,
        units: undefined,
        qty: undefined,
        weight: undefined,
        volume: undefined,
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
      getInventory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit";
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
          updateInventoryIn(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createInventoryIn(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Delete id "' + id + '"?').then(function() {
          return deleteInventoryIn(id);
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
      this.$modal.confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported")).then(() => {
          this.exportLoading = true;
          return exportInventoryInExcel(params);
        }).then(response => {
          this.$download.excel(response, "smartMOOV_Inbound"+this.parseTimeToZ2(new Date())+".xlsx");
          this.exportLoading = false;
        }).catch(() => {});
    },
    getWarehousePage(){
      getWarehousePage({pageNo:1,pageSize:100,status:0}).then(response => {
          this.warehouseList=response.data.list
        });
    },
    getProductPage(){
      getProductPage({pageNo:1,pageSize:10000,status:0}).then(response => {
          this.productList=response.data.list
        });
    },
    /** 导入按钮操作 */
    handleImport() {
      console.log(111)
      this.upload.title = "Import";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      downloadInventoryInTemplate().then((response) => {
        this.$download.excel(response, "Inbound.xlsx");
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
        if (response.code !== 0) {
          this.$modal.msgError(response.msg);
          this.$refs.upload.clearFiles();
          return;
        }
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        // 拼接提示语
        let data = response.data.failureNumber;
        if (data.length > 0) {
          this.uploadError.data = data
          this.uploadError.dialogVisible = true

        }
        this.getList();
      },
      // 文件上传失败处理
      handleFileError(err, file, fileList){
        console.log(err)
        this.$refs.upload.clearFiles();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      parseTimeToZ1(timestamp) {
        if(!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      },
      parseTimeToZ2(timestamp) {
        if(!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}`;
      },


  }
};
</script>
