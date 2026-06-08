<template>
  <div class="app-container">
    <el-card style="padding:20px;background-color: #fff;">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="" prop="carrier">
          <el-select filterable clearable v-model="queryParams.carrier" placeholder="Carrier">
            <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value"
              :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="contractNo">
          <el-input v-model="queryParams.contractNo" placeholder="Contract No" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="valid_from" prop="validFrom">
        <el-input v-model="queryParams.validFrom" placeholder="请输入valid_from" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="valid_to" prop="validTo">
        <el-input v-model="queryParams.validTo" placeholder="请输入valid_to" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
        <el-form-item label="" prop="status">
          <el-select v-model="queryParams.status" placeholder="Status" clearable size="small">
            <el-option label="Active" value="0" />
            <el-option label="Expired" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="podRegion">
          <el-select v-model="queryParams.podRegion" placeholder="POD Region" clearable size="mini">
            <el-option label="EU" value="EU"></el-option>
            <el-option label="US" value="US"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
          <el-button @click="handleAdd" type="primary" plain>Create<i
              class="el-icon-plus el-icon--right"></i></el-button>

          <el-button @click="handleImport" type="primary" plain>Upload<i
              class="el-icon-plus el-icon--right"></i></el-button>

          <el-button @click="handleExport" type="primary" plain><i class="el-icon-download"></i>Download</el-button>

        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table v-loading="loading" :data="list" :height="tableHeight - 70">
        <el-table-column label="Carrier" align="center" prop="carrier" />
        <el-table-column label="Contract No" align="center" prop="contractNo" />
        <el-table-column label="POD Region" align="center" prop="podRegion" />
        <el-table-column label="Valid from" align="center" prop="validFrom" width="180">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.validFrom) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Valid to" align="center" prop="validTo" width="180">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.validTo) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" prop="status">
          <template v-slot="scope">
            <el-switch @change="changeStatus(scope.row)" :active-value="0" :inactive-value="1"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <!-- zane Contract type -->
        <el-table-column label="Contract type" align="center" prop="contractType">
          <template v-slot="scope">
            <dict-tag :type="DICT_TYPE.PEPCO_CONTRACT_TYPE" :value="scope.row.contractType" />
          </template>
        </el-table-column>
        <el-table-column label="Remark" align="center" prop="remark" />

        <el-table-column label="" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">Edit</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
        @pagination="getList" />

      <!-- 对话框(添加 / 修改) -->
      <el-dialog :title="title" :visible.sync="open" width="900px" v-dialogDrag append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" :show-message="false">
          <el-form-item label="Carrier" prop="carrier" required>
            <el-select filterable v-model="form.carrier" size="mini" clearable>
              <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value"
                :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Contract No" prop="contractNo" required>
            <el-input v-model="form.contractNo" placeholder="Contract No" />
          </el-form-item>
          <el-form-item label="Contract type" prop="contractType" required>
            <el-select v-model="form.contractType" clearable size="mini">
              <el-option v-for="dict in getDictDatas(DICT_TYPE.PEPCO_CONTRACT_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="POD Region" prop="podRegion" required>
            <el-select v-model="form.podRegion" clearable size="mini">
              <el-option label="EU" value="EU"></el-option>
              <el-option label="US" value="US"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Valid from" prop="validFrom" required>
            <el-date-picker value-format="timestamp" v-model="form.validFrom" size="mini" />
          </el-form-item>
          <el-form-item label="Valid to" prop="validTo" required>
            <el-date-picker value-format="timestamp" v-model="form.validTo" size="mini" />
          </el-form-item>
          <el-form-item label="Remark" prop="remark">
            <el-input v-model="form.remark" placeholder="Remark" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="cancel">Cancel</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
          :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("purchaseOrder.DragTheFileHereOr")
            }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
          </div>
          <div class="el-upload__tip text-center" slot="tip">
            <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
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
import { createContractNo, updateContractNo, deleteContractNo, getContractNo, getContractNoPage, exportContractNoExcel, importTemplate } from "@/api/shipment/contractNo";
import XLSX from "xlsx";
import { getBaseHeader } from "@/utils/request";

export default {
  name: "ContractNo",
  components: {
  },
  data() {
    return {
      upload: {
        open: false,
        title: '',
        headers: getBaseHeader(),
        url: process.env.VUE_APP_BASE_API + "/admin-api/shipment/contract-no/import",
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // booking_contract_no列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        carrier: null,
        contractNo: null,
        podRegion: null,
        validFrom: null,
        validTo: null,
        status: null,
        remark: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [{ required: true, message: "status not empty", trigger: "blur" }],
      },
      tableHeight: 0,

    };
  },
  created() {
    const clientHeight = document.documentElement.clientHeight;
    this.tableHeight = clientHeight - 302;
    this.getList();
  },
  methods: {
    changeStatus(item) {
      updateContractNo(item).then(response => {
        if (response.data == 0) {
          this.$modal.msgError('Data already exists');
        } else {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        }
      });

    },
    handleImport() {
      this.upload.open = true
    },
    importTemplate() {
      importTemplate({}).then((res) => {
        this.$download.excel(res, "import_template.xlsx");
      })
    },
    handleFileSuccess(res) {
      this.upload.open = false
      this.getList()
      this.$refs.upload.clearFiles()
      if (res.data !== null && res.data !== undefined && res.data !== '') {
        this.$notify.error("Failed:" + res.data);
      }
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleFileUploadProgress() {
      console.log(123)
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getContractNoPage(this.queryParams).then(response => {
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
        carrier: undefined,
        contractNo: undefined,
        contractType: undefined,
        validFrom: undefined,
        validTo: undefined,
        status: undefined,
        remark: undefined,
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
      getContractNo(id).then(response => {
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
          updateContractNo(this.form).then(response => {
            if (response.data == 0) {
              this.$modal.msgError('Data already exists');
            } else {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            }
          });
          return;
        }
        // 添加的提交
        createContractNo(this.form).then(response => {
          if (response.data == 0) {
            // this.form.allocationWeek = this.form.allocationWeek ? this.form.allocationWeek.split(',') : []
            this.$modal.msgError('Data already exists');
          } else {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          }
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Delete id"' + id + '"?').then(function () {
        return deleteContractNo(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Success");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('Export All?').then(() => {
        this.exportLoading = true;
        return exportContractNoExcel(params);
      }).then(response => {
        this.$download.excel(response, 'contract_no.xlsx');
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
