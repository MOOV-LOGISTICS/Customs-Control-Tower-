<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card style="padding: 20px;">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
        <el-form-item label="SKU Id" prop="productId">
          <el-select v-model="queryParams.productId" clearable filterable>
            <el-option v-for="product in productList" :key="product.id" :label="product.code + '[' + product.name + ']'" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="From Unit" prop="fromUnit">
          <el-input v-model="queryParams.fromUnit" placeholder="Please input from unit" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="To Unit" prop="toUnit">
          <el-input v-model="queryParams.toUnit" placeholder="Please input to unit" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="Conversion Factor" prop="conversionFactor">
          <el-input v-model="queryParams.conversionFactor" placeholder="Please input conversion factor" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="Create Time" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('notify.startDate')"
            :end-placeholder="$t('notify.endDate')"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:unit-conversion:create']">{{ $t("search.addNew") }}</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:unit-conversion:export']">{{ $t("search.export") }}</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px"></right-toolbar>
      </el-row>

      <!-- 列表 -->
      <el-table v-loading="loading" :height="height" :data="list">
        <el-table-column label="Product Name" align="left" prop="productId" width="150">
          <template v-slot="scope">{{ productMap[scope.row.productId].name }}</template>
        </el-table-column>
        <el-table-column label="Product Code" align="left" prop="productId" width="150">
          <template v-slot="scope">{{ productMap[scope.row.productId].code }}</template>
        </el-table-column>
        <el-table-column label="From Unit" align="center" prop="fromUnit" />
        <el-table-column label="To Unit" align="center" prop="toUnit" />
        <el-table-column label="Conversion Factor" align="center" prop="conversionFactor" width="180" />
        <el-table-column label="Create Time" align="center" prop="createTime" width="180">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('notify.operation')" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:unit-conversion:update']">{{ $t("search.modify") }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:unit-conversion:delete']">{{ $t("search.delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
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
        :on-change="handleFileChange"
        :file-list="fileList"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
          </div>
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="upload.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="SKU Id" prop="productId">
          <el-select v-model="form.productId" clearable filterable>
            <el-option v-for="product in productList" :key="product.id" :label="product.code + '[' + product.name + ']'" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="from unit" prop="fromUnit">
          <el-select v-model="form.fromUnit" filterable>
            <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="to unit" prop="toUnit">
          <el-select v-model="form.toUnit" filterable>
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="conversion factor" prop="conversionFactor">
          <el-input v-model="form.conversionFactor" placeholder="please input conversion factor" />
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
import { createUnitConversion, updateUnitConversion, deleteUnitConversion, getUnitConversion, getUnitConversionPage, exportUnitConversionExcel, importTemplate } from '@/api/system/unitConversion'
import { getProductList } from '@/api/system/product'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'UnitConversion',
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
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        productId: null,
        fromUnit: null,
        toUnit: null,
        conversionFactor: null,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productId: [{ required: true, message: 'productId cannot be empty', trigger: 'blur' }],
        fromUnit: [{ required: true, message: 'fromUnit cannot be empty', trigger: 'blur' }],
        toUnit: [{ required: true, message: 'toUnit cannot be empty', trigger: 'blur' }],
        conversionFactor: [
          {
            required: true,
            message: 'conversion factor cannot be empty',
            trigger: 'blur'
          },
          {
            pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,9})?$/,
            message: 'conversion factor must be number',
            trigger: 'blur'
          }
        ]
      },
      // 用户导入参数
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/unit-conversion/import'
      },
      productList: [],
      productMap: {},
      height: 0
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.height = document.documentElement.clientHeight - 420
    })
  },
  created() {
    this.getProductList()
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 420
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getUnitConversionPage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    getUrlParam: function getURLParameter(name, urlsearch) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(urlsearch || location.search) || [, ''])[1].replace(/\+/g, '%20')) || null
    },
    getProductList() {
      this.loading = true
      var vm = this
      // 执行查询
      getProductList({ ids: [] }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          vm.productMap[response.data[i].id] = {
            name: response.data[i].name,
            code: response.data[i].code
          }
        }
        vm.productList = response.data
        this.$nextTick(() => {
          if (vm.getUrlParam('productId', window.location.href)) {
            vm.$set(vm.queryParams, 'productId', parseInt(vm.getUrlParam('productId', window.location.href)))
          }
          vm.getList()
        })
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
        id: undefined,
        productId: undefined,
        fromUnit: undefined,
        toUnit: undefined,
        conversionFactor: undefined
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
      this.title = 'Add'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getUnitConversion(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Edit'
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
          updateUnitConversion(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createUnitConversion(this.form).then(response => {
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
        .confirm('Delete id "' + id + '" ?')
        .then(function () {
          return deleteUnitConversion(id)
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
        .confirm('Confirm whether to export all unit conversion data?')
        .then(() => {
          this.exportLoading = true
          return exportUnitConversionExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'UnitConversion.xlsx')
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
        this.$download.excel(response, 'UnitConversion_temp.xlsx')
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
      let data = response.data.failureUnitConversionNumber
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
