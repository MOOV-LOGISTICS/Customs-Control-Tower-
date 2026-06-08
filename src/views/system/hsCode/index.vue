<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item prop="productEnglishName">
        <el-input v-model="queryParams.productEnglishName" style="width: 300px" placeholder="Please input the Product English Name" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="hsCode">
        <el-input v-model="queryParams.hsCode" style="width: 250px" placeholder="Please input the HS code" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="Create Time" prop="createTime">
        <el-date-picker v-model="queryParams.createTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          Search
          <i class="el-icon-search el-icon--right"></i>
        </el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">{{
          $t("search.reset")
        }}</el-button>-->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:hs-code:create']">{{ $t("search.addNew") }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:hs-code:export']">{{ $t("search.export") }}</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t('search.import') }}</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Product English Name" align="center" prop="productEnglishName" width="400" />
      <el-table-column label="HS code" align="center" prop="hsCode" />
      <el-table-column label="Create Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Create Time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <el-tag :type="scope.row.status==0?'success':'info' ">{{ scope.row.status==0?'Open':'Apply' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operate" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button v-if="scope.row.status==1" size="mini" type="text" icon="el-icon-edit" @click="handleApprove(scope.row)" v-hasPermi="['system:hs-code:update']">Approve</el-button>

          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:hs-code:update']">{{ $t("search.modify") }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:hs-code:delete']">{{ $t("search.delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(上传/下载模板) -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
          {{ $t('purchaseOrder.DragTheFileHereOr') }}
          <em>{{ $t('purchaseOrder.clickUpload') }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t('purchaseOrder.whetherToUpdateExistingData') }}
          </div>
          <div>{{ $t('purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed') }}</div>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">{{ $t('purchaseOrder.downloadingTheTemplate') }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">{{ $t('el.popconfirm.confirmButtonText') }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
      </div>
    </el-dialog>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Product English Name" prop="productEnglishName">
          <el-input v-model="form.productEnglishName" placeholder="please input the Product English Name" />
        </el-form-item>
        <el-form-item label="HS code" prop="hsCode">
          <el-input v-model="form.hsCode" placeholder="please input the HS code" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button @click="cancel">{{ $t("purchaseOrder.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createHsCode, updateHsCode, deleteHsCode, getHsCode, getHsCodePage, exportHsCodeExcel, approveHscode, importTemplate } from '@/api/system/hsCode'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'HsCode',
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
      // hs_code列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        productEnglishName: null,
        hsCode: null,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productEnglishName: [{ required: true, message: 'product_english_name can not be empty', trigger: 'blur' }],

        hsCode: [
          { required: true, message: 'HS code cannot be empty', trigger: 'blur' },
          { pattern: /^\d{10}$/, message: 'HS code must be 10 digits', trigger: 'blur' }
        ]
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/hs-code/import'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    handleApprove(item) {
      this.$confirm('Approve?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          approveHscode({ id: item.id }).then(res => {
            this.$notify({
              type: 'success',
              message: 'success!'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    getList() {
      this.loading = true
      // 执行查询
      getHsCodePage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        productEnglishName: undefined,
        hsCode: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加hs_code'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getHsCode(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改hs_code'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 修改的提交
        if (this.form.id != null) {
          updateHsCode(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createHsCode(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('是否确认删除hs_code编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteHsCode(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm('是否确认导出所有hs_code数据项?')
        .then(() => {
          this.exportLoading = true
          return exportHsCodeExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'hs_code.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.$download.excel(response, 'hs_code_temp.xlsx')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // 拼接提示语
      let data = response.data.failureHsCode
      let text = 'Errors:' + data.length
      for (const t of data) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + t
      }
      if (data.length > 0) {
        this.$alert(text, 'Errors', { dangerouslyUseHTMLString: true })
      }
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>
