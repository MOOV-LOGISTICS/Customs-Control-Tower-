<template>
  <div class="app-container">
    <el-card shadow="always" style="padding: 20px;">
      <!-- Action Buttons -->
    <div class="upload-top">
      <el-upload
        v-hasPermi="['warehouse:asn:upload-data']"
        class="upload-btn"
        action="#"
        :http-request="handleImport"
        :show-file-list="false"
        accept=".xlsx,.xls"
      >
        <el-button type="primary" icon="el-icon-upload2">Import Data</el-button>
      </el-upload>

      <el-button
        v-hasPermi="['warehouse:asn:upload-data']"
        style= "margin-left: 15px;"
        type="primary"
        icon="el-icon-download"
        @click="handleExportTemplate"
        :loading="exportLoading"
      >
        Export Template
      </el-button>

      <el-button
        style= "margin-left: 15px;"
        type="primary"
        icon="el-icon-download"
        @click="handleExportData"
        :loading="exportLoading"
      >
        Export Data
      </el-button>
    </div>

    <!-- Search Area -->
    <div >
        <el-form :show-message="false" size="mini" :model="queryParams" ref="queryForm"  :inline="true" label-width="130px">

            <el-form-item label="Inbound DN#" prop="inboundNo">
                <el-input v-model="queryParams.inboundNo" placeholder="Inbound DN#"
                 @blur="queryParams.inboundNo = $event.target.value.trim()" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="Customer Name" prop="customerName">
                <el-input v-model="queryParams.customerName" placeholder="Customer Name"
                 @blur="queryParams.customerName = $event.target.value.trim()" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="Warehouse Site" prop="warehouse">
                <el-input v-model="queryParams.warehouse" placeholder="Warehouse"
                 @blur="queryParams.warehouse = $event.target.value.trim()" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="PO#" prop="orderNumber">
                <el-input v-model="queryParams.orderNo" placeholder="PO#"
                 @blur="queryParams.orderNo = $event.target.value.trim()"  clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="Product Code" prop="productCode">
                <el-input v-model="queryParams.productCode" placeholder="Product Code"
                 @blur="queryParams.productCode = $event.target.value.trim()"  clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- Table -->
    <el-table
        :data="list"
        size="mini"
        border="false"
        class="inbound-table"
        style="width: 100%; margin-bottom: 10px;"
        :height="clientHeight"
        :header-cell-style="{fontSize: '12px', textAlign: 'center' }"
        :cell-style="{'text-align':'center'}"
        v-loading="loading"
         align="center"
    >
        <!-- 展开行指示器 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <div style="max-width: 90%;" v-if="scope.row">
                    <el-tabs type="border-card">
                        <el-tab-pane label="Master Info">
                          <el-table :data="[scope.row]" size="mini" style="width: 100%;">
                            <el-table-column prop="creditorCode" label="Creditor code" min-width="150px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.creditorCode || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="creditorName" label="Creditor name" min-width="150px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.creditorName || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mainArticleGroup" label="Main article group" min-width="200px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.mainArticleGroup || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mainArticleGroupDescription" label="Main article group description" min-width="220px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.mainArticleGroupDescription || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="subArticleGroup" label="Sub article group" min-width="200px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.subArticleGroup || '-' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="subArticleGroupDescription" label="Sub article group description" min-width="220px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.subArticleGroupDescription || '-' }}</span>
                                </template>
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="inboundNo" label="Inbound DN#" min-width="150px"></el-table-column>
        <el-table-column prop="customerName" label="Customer Name" min-width="150px"></el-table-column>
        <el-table-column prop="warehouse" label="Warehouse Site" min-width="150px"></el-table-column>
        <el-table-column prop="orderNo" label="PO#" min-width="150px"></el-table-column>
        <el-table-column prop="estimatedInboundDate" label="Estimated Inbound Date" :formatter="formatDate" min-width="220px"></el-table-column>
        <el-table-column prop="productCode" label="Product Code" min-width="130px"></el-table-column>
        <el-table-column prop="name" label="Product Name" min-width="150px"></el-table-column>

        <el-table-column  label="ASN" align="center">
            <el-table-column prop="asnCartonQty" label="Master Carton QTY" min-width="150px"></el-table-column>
            <el-table-column prop="asnMoqMibQty" label="MOQ/MIB QTY_Bag/Box" min-width="150px"></el-table-column>
            <el-table-column prop="asnSmallestBagQty" label="VE QTY_Smallest Bag/box" min-width="200px"></el-table-column>
            <el-table-column prop="asnTotalCbmQty" label="Total CBM _Master Data" min-width="200px"></el-table-column>
            <el-table-column prop="asnPiecesQty" label="Total QTY_Pieces" min-width="200px"></el-table-column>
            <el-table-column prop="asnLength" label="Master Carton Length (mm)" min-width="200px"></el-table-column>
            <el-table-column prop="asnWidth" label="Mater Carton Width (mm)" min-width="200px"></el-table-column>
            <el-table-column prop="asnHeight" label="Master Carton Heighth (mm)" min-width="200px"></el-table-column>
            <el-table-column prop="asnHsCode" label="HS / Tariff code_Master Data" min-width="200px"></el-table-column>
            <el-table-column prop="masterCartonEan" label="EAN Master Carton" min-width="150px"></el-table-column>
        </el-table-column>
        <el-table-column
            prop="status"
            label="Status"
            :formatter="formatStatus"
        ></el-table-column>
        <el-table-column prop="remark" label="Remark" min-width="250px" show-overflow-tooltip></el-table-column>
        <el-table-column  label=" "  fixed="right" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.inboundNo)"
            >{{ $t('search.delete') }}</el-button>
          </template>
        </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      background
      :current-page="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      :page-sizes="[15, 30, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>


    <!-- 错误列表弹框 -->
    <el-dialog
      title="Import Errors"
      :visible.sync="errorDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <template >
        <!-- 错误总数提示 -->
        <div style="font-weight: 600; margin-bottom: 12px;">
          Import failed with {{ errorList.length }} error(s):
        </div>
        <!-- 错误列表 -->
        <ul style="list-style: none; padding: 0;">
          <li
            v-for="(error, index) in errorList"
            :key="index"
            style="display: flex; align-items: center; margin-bottom: 8px;"
          >
            <i class="el-icon-error" style="color: #f56c6c; margin-right: 6px;"></i>
            <span>{{ error }}</span>
          </li>
        </ul>
      </template>
      <!-- 弹框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorDialogVisible = false">Close</el-button>
      </span>
    </el-dialog>

<!-- 错误确认弹框英文 -->
    <el-dialog
      title="Import Data Validation Results"
      :visible.sync="confirmDialogVisible"
      width="70%"
      :close-on-click-modal="false"
      center
    >
      <!-- 校验结果统计 -->
      <div style="margin-bottom: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; color: #606266;">
            Total {{ validationErrors.length }} errors detected
          </span>
          <div style="display: flex; gap: 15px;">
            <span><i class="el-icon-warning" style="color: #e6a23c;"></i> Missing items: {{ errorCount.missingItem }}</span>
            <span><i class="el-icon-warning" style="color: #f56c6c;"></i> Extra items: {{ errorCount.extraItem }}</span>
            <span><i class="el-icon-error" style="color: #f56c6c;"></i> Quantity mismatch: {{ errorCount.quantityMismatch }}</span>
            <span><i class="el-icon-error" style="color: #f56c6c;"></i> Invalid order: {{ errorCount.invalidOrder }}</span>
          </div>
        </div>
      </div>

      <!-- 错误列表表格 -->
      <el-table
        :data="validationErrors"
        border
        size="small"
        max-height="500"
        :cell-style="cellStyleHandler"
      >
        <el-table-column
          label="Row Number"
          prop="rowNum"
          width="80"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.rowNum">{{ scope.row.rowNum }}</span>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column label="Order Number" prop="orderNumber" width="120" />
        <el-table-column label="Product Code" prop="productCode" width="120" />
        <el-table-column label="Product Name" prop="productName" min-width="120" show-overflow-tooltip />
        <el-table-column
          label="Uploaded Quantity"
          prop="uploadQty"
          width="110"
          align="center"
        />
        <el-table-column
          label="Actual Quantity"
          prop="actualQty"
          width="110"
          align="center"
        />
        <el-table-column label="Error Type" width="130">
          <template #default="scope">
            <el-tag
              :type="getErrorTagType(scope.row.errorType)"
              size="small"
            >
              {{ getErrorTypeName(scope.row.errorType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Error Message" min-width="250" show-overflow-tooltip>
          <template #default="scope">
            <span :style="{ color: scope.row.errorType === 'QUANTITY_MISMATCH' ? '#f56c6c' : 'inherit' }">
              {{ scope.row.errorMessage }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹框底部按钮 -->
      <template #footer>
        <el-button @click="confirmDialogVisible = false">Cancel Import</el-button>
        <el-button
          type="primary"
          @click="confirmImport"
          :loading="importLoading"
        >
          Continue Import
        </el-button>
      </template>
    </el-dialog>

    </el-card>
    </div>
</template>

<style>
    .upload-top {
        margin-bottom: 16px;
        display: flex;
    }
    .inbound-table .el-table th.is-leaf,
    .inbound-table .el-table td.is-leaf {
        border: none;
    }
    .inbound-table table.el-table__header {
        padding: 0px !important;
    }
</style>

<script>
import { getAsnPage, downloadAsnTemplate, importAsn, downloadAsnData, deleteAsn , validateAsnData } from "@/api/system/wms/inbound";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "WmsAsn",
  data() {
    return {
        // Loading state
        loading: true,
        // Export loading state
        exportLoading: false,
        // Total number of records
        total: 0,
        // Table data list
        list: [],
        // Query parameters
        queryParams: {
            pageNum: 1,
            pageSize: 15,
            warehouse: null,
            inboundNo: null,
            orderNo: null,
            customerName: null,
            productCode: null
        },
        clientHeight:null,
        errorDialogVisible: false, // 弹框显隐控制
        errorList: [], // 错误信息列表
        fileList: [], // 上传文件列表
        confirmDialogVisible: false, // 确认弹窗显隐
        validationErrors: [], // 验证错误列表
        importFormData: null, // 暂存导入文件数据
        importLoading: false, // 导入加载状态
        errorCount: { // 错误类型统计
          missingItem: 0,
          extraItem: 0,
          quantityMismatch: 0,
          invalidOrder: 0
        },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    var clientHeight = document.documentElement.clientHeight;
    this.clientHeight=clientHeight-350

  },
  methods: {
    //删除asn 数据
    handleDelete(inboundNo) {
      //确认删除 提示相同的 inboundNo 数据也会被删除
      this.$confirm('Are you sure you want to delete this ASN? This action will also delete related ASN data with the same inboundNo.', 'Delete Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        deleteAsn(inboundNo).then((res) => {
          this.$message({
            message: "Delete success",
            type: "success",
          });
          this.handleQuery();
        });
      }).catch(() => {

      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    // Get inbound list data
    getList() {
      this.loading = true;

      getAsnPage(this.queryParams)
        .then((response) => {
          this.loading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // Handle search
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // Handle page size change
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // Handle current page change
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },

    // Export template
    handleExportTemplate() {
      this.exportLoading = true;
      downloadAsnTemplate()
        .then((response) => {
          this.$download.excel(response, "asn_template.xlsx");
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },

    // Export Data
    handleExportData() {
      this.exportLoading = true;
      downloadAsnData()
        .then((response) => {
          this.$download.excel(response, "asn_data.xlsx");
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    // Import data
      // 处理文件上传（触发校验）
    handleImport(fileObj) {
      const file = fileObj.file;
      if (!file) return;

      // 限制文件类型
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (!["xls", "xlsx"].includes(fileType)) {
        //英文提示
        this.$message.error("Only xls/xlsx files are allowed!");
        this.fileList = [];
        return;
      }

      // 暂存导入数据
      this.importFormData = new FormData();
      this.importFormData.append("file", file);

      // 执行数据校验
      this.validateImportData(file);
    },

    // 校验导入数据（调用后端校验接口）
    validateImportData(file) {
      const formData = new FormData();
      formData.append("file", file);
      this.loading = true;

      validateAsnData(formData).then(res => {
          this.validationErrors = res.data || [];
          // 统计各类错误数量
          this.countErrorTypes();

          if (this.validationErrors.length > 0) {
            // 显示确认弹窗
            this.confirmDialogVisible = true;
          } else {
            // 无错误直接导入英文提示
            this.$message.success("Data validation passed, importing...");
            this.doImport();
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          // 英文提示
          this.$message.error(err);
          this.fileList = [];
        });
    },

    // 统计错误类型数量
    countErrorTypes() {
      this.errorCount = {
        missingItem: this.validationErrors.filter(item => item.errorType === "MISSING_ITEM").length,
        extraItem: this.validationErrors.filter(item => item.errorType === "EXTRA_ITEM").length,
        quantityMismatch: this.validationErrors.filter(item => item.errorType === "QUANTITY_MISMATCH").length,
        invalidOrder: this.validationErrors.filter(item => item.errorType === "INVALID_ORDER").length
      };
    },

    // 获取错误类型标签样式
    getErrorTagType(errorType) {
      switch (errorType) {
        case "QUANTITY_MISMATCH":
          return "danger";
        case "EXTRA_ITEM":
          return "warning";
        case "MISSING_ITEM":
          return "warning";
        case "INVALID_ORDER":
          return "danger";
        default:
          return "danger";
      }
    },

    // 获取错误类型英文名称
    getErrorTypeName(errorType) {
      switch (errorType) {
        case "QUANTITY_MISMATCH":
          return "Quantity Mismatch";
        case "EXTRA_ITEM":
          return "Extra Item";
        case "MISSING_ITEM":
          return "Missing Item";
        case "INVALID_ORDER":
          return "Invalid Order";
        default:
          return "Other Error";
      }
    },

    // 表格单元格样式处理（数量不匹配标红）
    cellStyleHandler({ row, column }) {
      if (row.errorType === "QUANTITY_MISMATCH" &&
          (column.prop === "uploadQty" || column.prop === "actualQty")) {
        return { color: "#f56c6c", fontWeight: 600 };
      }
      return {};
    },

    // 确认继续导入
    confirmImport() {
      this.doImport();
    },

    // 执行实际导入操作
    doImport() {
      this.importLoading = true;
      importAsn(this.importFormData)
        .then(res => {
          this.importLoading = false;
          this.errorList = res?.data || []; // 接收后端返回的错误列表
          if (this.errorList.length > 0) {
            this.errorDialogVisible = true; // 有错误时打开弹框
          } else {
            this.$message.success("Import successful");
          }
          this.getList();
          this.confirmDialogVisible = false;
        })
        .catch(err => {
          this.confirmDialogVisible = false;
          this.importLoading = false;
          this.$message.error("Import failed");
        });
    },

    // Format date
    formatDate(row, column) {
      const date = row[column.property];
      if (date) {
        return new Date(date).toLocaleString();
      }
      return "";
    },

    // Format status
    formatStatus(row) {
      const status = row.status;
      if (status === 0) return "Not Sent";
      return "Sent";
    }
  }
};
</script>
