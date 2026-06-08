<template>
  <div class="app-container">
    <el-card shadow="always" style="padding: 20px;">
      <!-- Action Buttons -->
    <div class="upload-top">
      <el-upload
        v-hasPermi="['warehouse:inbound:upload-data']"
        class="upload-btn"
        action="#"
        :http-request="handleImport"
        :show-file-list="false"
        accept=".xlsx,.xls"
      >
        <el-button type="primary" icon="el-icon-upload2">Import Data</el-button>
      </el-upload>

      <el-button
        v-hasPermi="['warehouse:inbound:upload-data']"
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
                        <el-tab-pane label="Data Comparison">
                            <h4 style="margin-bottom: 10px; font-weight: bold;">ASN vs Actual Data Comparison</h4>
                            <el-table :data="[
                                {
                                    type: 'ASN Data',
                                    cartonQty: scope.row.asnCartonQty,
                                    moqMibQty: scope.row.asnMoqMibQty,
                                    smallestBagQty: scope.row.asnSmallestBagQty,
                                    totalCbmQty: scope.row.asnTotalCbmQty,
                                    length: scope.row.asnLength,
                                    width: scope.row.asnWidth,
                                    height: scope.row.asnHeight,
                                    hsCode: scope.row.asnHsCode
                                },
                                {
                                    type: 'Actual Data',
                                    cartonQty: scope.row.actualCartonQty,
                                    moqMibQty: scope.row.actualMoqMibQty,
                                    smallestBagQty: scope.row.actualSmallestBagQty,
                                    totalCbmQty: scope.row.actualTotalCbmQty,
                                    length: scope.row.actualLength,
                                    width: scope.row.actualWidth,
                                    height: scope.row.actualHeight,
                                    hsCode: scope.row.actualHsCode
                                }
                            ]" size="mini" style="width: 100%;">
                                <el-table-column prop="type" label="Data Type" min-width="150px"></el-table-column>
                                <el-table-column prop="cartonQty" label="Carton QTY" min-width="150px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.cartonQty, innerScope.row.type === 'ASN Data' ? scope.row.actualCartonQty : scope.row.asnCartonQty)">{{ innerScope.row.cartonQty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="moqMibQty" label="MOQ/MIB QTY_Bag/Box" min-width="170px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.moqMibQty, innerScope.row.type === 'ASN Data' ? scope.row.actualMoqMibQty : scope.row.asnMoqMibQty)">{{ innerScope.row.moqMibQty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="smallestBagQty" label="VE QTY_Smallest Bag/box" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.smallestBagQty, innerScope.row.type === 'ASN Data' ? scope.row.actualSmallestBagQty : scope.row.asnSmallestBagQty)">{{ innerScope.row.smallestBagQty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalCbmQty" label="CBM" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.totalCbmQty, innerScope.row.type === 'ASN Data' ? scope.row.actualTotalCbmQty : scope.row.asnTotalCbmQty)">{{ innerScope.row.totalCbmQty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="length" label="Carton Length (mm)" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.length, innerScope.row.type === 'ASN Data' ? scope.row.actualLength : scope.row.asnLength)">{{ innerScope.row.length }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="width" label="Carton Width (mm)" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.width, innerScope.row.type === 'ASN Data' ? scope.row.actualWidth : scope.row.asnWidth)">{{ innerScope.row.width }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="height" label="Carton Height (mm)" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span :style="getComparisonCellStyle(innerScope.row.height, innerScope.row.type === 'ASN Data' ? scope.row.actualHeight : scope.row.asnHeight)">{{ innerScope.row.height }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="hsCode" label="HS / Tariff code" min-width="200px">
                                    <template slot-scope="innerScope">
                                        <span>{{ innerScope.row.hsCode || '-' }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
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
                            <el-table-column prop="countryOfOrigin" label="Country of Origin" min-width="150px">
                                <template slot-scope="innerScope">
                                    <span>{{ innerScope.row.countryOfOrigin || '-' }}</span>
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
        <el-table-column prop="inboundDate" label="Inbound Date" :formatter="formatDate" min-width="150px"></el-table-column>
        <el-table-column prop="productCode" label="Product Code" min-width="150px"></el-table-column>
        <el-table-column prop="name" label="Product Name" min-width="220px"></el-table-column>

        <el-table-column prop="netWeight" label="Actual Total Net Weight / Master carton_KG" min-width="240px"></el-table-column>
        <el-table-column prop="grossWeight" label="Actual Total Gross Weight / master carton_KG" min-width="250px"></el-table-column>

        <el-table-column prop="masterCartonEan" label="EAN Master Carton" min-width="150px"></el-table-column>
        <el-table-column prop="countryOfOrigin" label="Country of Origin" min-width="150px"></el-table-column>

        <el-table-column prop="asnPiecesQty" label="ASN Total QTY (Pieces)" min-width="200px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :style="getPiecesQtyCellStyle(scope.row)">{{ scope.row.asnPiecesQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualPiecesQty" label="Actual Total Qty(Pieces)" min-width="200px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :style="getPiecesQtyCellStyle(scope.row)">{{ scope.row.actualPiecesQty }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="status"
            label="Status"
            :formatter="formatStatus"
        ></el-table-column>
        <el-table-column prop="remark" label="Remark" min-width="250px" show-overflow-tooltip></el-table-column>
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
import { getInboundPage, downloadTemplate, importInbound, downloadData  } from "@/api/system/wms/inbound";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "WmsInbound",
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    // Get inbound list data
    getList() {
      this.loading = true;

      getInboundPage(this.queryParams)
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
      downloadTemplate()
        .then((response) => {
          this.$download.excel(response, "inbound_template.xlsx");
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    // Export data
    handleExportData() {
      this.exportLoading = true;
      downloadData()
        .then((response) => {
          this.$download.excel(response, "inbound_data.xlsx");
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },

    // Import data
    handleImport(fileObj) {
      const file = fileObj.file;
      const formData = new FormData();
      formData.append("file", file);

      this.loading = true;
      importInbound(formData).then((res) => {
          this.loading = false;
          this.errorList = res?.data || []; // 接收后端返回的错误列表
          if (this.errorList.length > 0) {
            this.errorDialogVisible = true; // 有错误时打开弹框
          } else {
            this.$message.success("Import successful");
            this.getList(); // 导入成功后刷新数据列表
          }
        })
        .catch(() => {
          this.loading = false;
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
      if (status === 0) return "Normal";
      return "Abnormal";
    },

    // Get cell style for pieces quantity columns
    getPiecesQtyCellStyle(row) {
      const asnQty = Number(row.asnPiecesQty) || 0;
      const actualQty = Number(row.actualPiecesQty) || 0;

      // Both quantities are zero, no difference
      if (asnQty === 0 && actualQty === 0) {
        return { color: '#67C23A' }; // Green
      }

      // No difference
      if (asnQty === actualQty) {
        return { color: '#67C23A' }; // Green
      }

      // 100% difference (one is zero, the other is not)
      if ((asnQty === 0 && actualQty > 0) || (asnQty > 0 && actualQty === 0)) {
        return { color: '#ff4949' }; // Black
      }

      // Partial difference
      return { color: '#E6A23C' }; // Yellow
    },

    // Get cell style for comparison data
    getComparisonCellStyle(value, compareValue) {
      const val = Number(value) || 0;
      const compVal = Number(compareValue) || 0;

      // Both values are zero, no difference
      if (val === 0 && compVal === 0) {
        return { color: '#67C23A' }; // Green
      }

      // No difference
      if (val === compVal) {
        return { color: '#67C23A' }; // Green
      }

      // 100% difference (one is zero, the other is not)
      if ((val === 0 && compVal > 0) || (val > 0 && compVal === 0)) {
        return { color: '#ff4949' }; // Black
      }

      // Partial difference
      return { color: '#E6A23C' }; // Yellow
    }
  }
};
</script>
