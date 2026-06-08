<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="" prop="bookingNumber">
        <el-input v-model="queryParams.bookingNumber" placeholder="Booking Number" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="" prop="mblNumber">
        <el-input v-model="queryParams.mblNumber" :placeholder="$constants.MBL_NUMBER" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-button  @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
      </el-form-item>

      <!-- 操作工具栏 -->
      <div style="float: right;padding-top: 10px;">
        <div style="float: right">
          <svg @click="handleUploadInvoice" style="cursor: pointer;"  width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha"><path d="M48 0H0V48H48V0Z" fill="#004F7C"/></mask><g mask="url(#icon-21f8f28d7f10b972)"><path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
        </div>
        <div style="float: left">
        </div>
      </div>
    </el-form>

    <!-- 列表 -->
    <el-table ref="table" @selection-change="handleSelectionChange" v-loading="loading" :data="list" @sort-change="handleSortChange"  :height="tableHeight" >
      <el-table-column label="Carrier" align="center" prop="carrier" sortable="custom" />
      <el-table-column label="Booking Number" align="center" prop="bookingNumber" sortable="custom" />
      <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" sortable="custom" />
      <el-table-column label="Containers" align="center" prop="containerNumber" width="200">
        <template v-slot="scope">
          <span class="text-containertype" v-for="name in scope.row.containerList">
            {{ name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Invoice No." align="center" prop="invoiceNumber" sortable="custom" />
      <el-table-column label="File" align="center" prop="file" width="180">
        <template v-slot="scope">
          <el-link :href="scope.row.fileUrls" :title="scope.row.fileNames" target ="_blank">
            <svg v-show="scope.row.fileUrls" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round"/><path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C"/><path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column type="selection" prop="id" align="rignt" width="70" class-name="small-padding fixed-width"
                       v-hasPermi="['shipment:invoice:update']">
      </el-table-column>

    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="400px" append-to-body>
      <el-form
        ref="uploadForm"
        :show-message="false"
        size="mini"
      >
        <el-row style="padding: 10px;">
          <el-col :span="8" style="margin-top: 5px;">Invoice Number:</el-col>
          <el-col :span="16">
            <el-form-item  prop="invoiceNumber">
              <el-input  v-model="invoiceNumber" placeholder="Invoice Number" />
            </el-form-item>
          </el-col>
        </el-row>


        <!-- <el-row>
            <el-col :span="24">
              <el-upload ref="uploadDocument" :limit="1" :headers="uploadDocument.headers" multiple
              :action="uploadDocument.url + '?ids=' + selectIds+ '&invoiceNumber='+ invoiceNumber" :disabled="uploadDocument.isUploading"
                         :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t("purchaseOrder.DragTheFileHereOr")
                  }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                </div>
              </el-upload>
            </el-col>
          </el-row> -->







        <el-upload
          ref="uploadDocument"
          drag
          :multiple="true"
          action=""
          :limit="1"
          :auto-upload="true"
          :http-request="uploadFile"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :headers="uploadDocument.headers"
          :disabled="uploadDocument.isUploading"
          :before-upload="handleBeforeUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("purchaseOrder.DragTheFileHereOr")
            }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
          </div>
        </el-upload>






      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFile">{{
            $t("purchaseOrder.confirm")
          }}</el-button>
        <el-button size="mini" @click="uploadDocument.open = false">{{
            $t("purchaseOrder.cancel")
          }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}
.text-containertype {
  background-color: #e6edf2;
  color: #004F7C;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
}
</style>

<script>
import { createInvoice, updateInvoice, deleteInvoice, getInvoice, getInvoicePage, exportInvoiceExcel, uploadFile,uploadFiles } from "@/api/shipment/invoice";
import { getBaseHeader } from "@/utils/request";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: "Invoice",
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
      // shipment_invoice列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        shipmentId: null,
        orderId: null,
        orderItemId: null,
        fileIds: null,
        fileNames: null,
        fileUrls: null,
        orderNumber: null,
        bookingNumber: null,
        mblNumber: null,
        invoiceNumber: null,
        containerNumber: null,
        containerType: null,
        updateInvoiceTime: [],
        createTime: [],
        carrier: null,
        status: null,
        prop: '',
        orderBy: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      uploadDocument:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "Upload Invoice",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/shipment/invoice/uploadFile",
      },
      invoiceNumber:'',
      multipleSelection: [],
      selectIds: [],
      fileList: [],
      carriers:[],
      tableHeight: 0,
    };
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.tableHeight = clientHeight - 290
    this.getList();
  },
  methods: {
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck';
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectIds = val.map(function (obj) {
        return obj.id;
      });
      console.log(this.selectIds)
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.carriers = getDictDatas(DICT_TYPE.CARRIER);
      // 执行查询
      getInvoicePage(this.queryParams).then(response => {
        for (var temp of response.data.list) {
          var obj = eval("(" + temp.containerNumber + ")");
          var containerList = [];
          for (let key in obj) {
            console.log(key + ': ' + obj[key]);
            containerList.push(key+' x '+obj[key]);
          }
          temp.containerList = containerList;
          var carriers = this.carriers.filter(item => {
            return item.value===temp.carrier;
          });
          if(carriers.length>0) {
            temp.carrierStr = carriers[0].label;
          }
        }
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
        shipmentId: undefined,
        orderId: undefined,
        orderItemId: undefined,
        fileIds: undefined,
        fileNames: undefined,
        fileUrls: undefined,
        orderNumber: undefined,
        bookingNumber: undefined,
        mblNumber: undefined,
        invoiceNumber: undefined,
        containerNumber: undefined,
        containerType: undefined,
        updateInvoiceTime: undefined,
        carrier: undefined,
        status: undefined,
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
      getInvoice(id).then(response => {
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
          updateInvoice(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createInvoice(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除shipment_invoice编号为"' + id + '"的数据项?').then(function() {
        return deleteInvoice(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有shipment_invoice数据项?').then(() => {
        this.exportLoading = true;
        return exportInvoiceExcel(params);
      }).then(response => {
        this.$download.excel(response, 'shipment_invoice.xls');
        this.exportLoading = false;
      }).catch(() => {});
    },
    handleUploadInvoice() {
      console.log(this.multipleSelection)
      if(this.multipleSelection.length==0){
        this.$modal.msgError("Please select.");
        return;
      }
      this.uploadDocument.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadDocument.isUploading = true;
      console.log("222222222")
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.uploadDocument.open = false;
      this.uploadDocument.isUploading = false;
      this.$refs.uploadDocument.clearFiles();
      this.getList();
      this.$refs.table.clearSelection();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.uploadDocument.submit();
    },
    uploadFile() {
      uploadFile(data).then(response => {
      });
    },
    uploadFile(raw) {
      console.log(raw)
      console.log(this.fileList)
      this.fileList.push(raw.file)
    },
    submitFile() {
      console.log(this.fileList)
      const formData = new FormData();
      formData.append("bizType", this.invoiceNumber);
      formData.append("ids", this.selectIds);
      formData.append("invoiceNumber", this.invoiceNumber);
      this.fileList.map(file => {
        formData.append("file", file, file.name)
      });
      console.log(formData)
      uploadFiles(formData).then(response => {
        this.handleFileSuccess(response,null,null);
      });
    },
    handleSortChange({ column, prop, order }) {
      if (order != null) {
        order = order === 'ascending' ? 'ASC' : 'DESC'
        this.queryParams.prop = column.property.replace(/([A-Z])/g, '_$1').toLowerCase()
        this.queryParams.orderBy = order
      } else {
        this.queryParams.prop = ''
        this.queryParams.orderBy = ''
      }
      this.getList()
    }
  }
};
</script>
