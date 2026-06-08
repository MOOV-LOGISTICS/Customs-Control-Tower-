<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card style="padding: 20px;">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
        <el-form-item label="Product Name" prop="name">
          <el-input v-model="queryParams.name" placeholder="Please input name" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="Product Code" prop="code">
          <el-input v-model="queryParams.code" placeholder="Please input code" clearable @keyup.enter.native="handleQuery" />
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:product:create']">{{ $t("search.addNew") }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:product:export']">{{ $t("search.export") }}</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px"></right-toolbar>
      </el-row>

      <!-- 列表 -->
      <el-table :height="height" v-loading="loading" :data="list">
        <el-table-column label="Product Name" align="center" prop="name" />
        <el-table-column label="Product Chinese name" align="center" prop="chineseName" />
        <el-table-column label="Category" align="center" prop="category" />
        <el-table-column label="Product Code" align="center" prop="code" />
        <el-table-column label="Unit" align="center" prop="unit" width="100" />
        <!-- <el-table-column label="Unit price" align="center" prop="price" /> -->
        <el-table-column label="Width (CM)" align="center" prop="width" width="100" />
        <el-table-column label="Height (CM)" align="center" prop="height" width="100" />
        <el-table-column label="Length (CM)" align="center" prop="length" width="100" />
        <el-table-column label="Weight (KG)" align="center" prop="weight" width="100" />
        <!-- <el-table-column label="Unit of weight" align="center" prop="unitOfWeight" />
        <el-table-column label="Unit of Dimensions" align="center" prop="unitOfWhl" />-->
        <el-table-column label="Operate" align="center" width="280">
          <template v-slot="scope">
            <router-link :to="'/system/unit-conversion?productId=' + scope.row.id" class="link-type">
              <el-button size="mini" type="text" icon="el-icon-edit">Unit Conversation</el-button>
            </router-link>

            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:product:update']">{{ $t("search.modify") }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:product:delete']">{{ $t("search.delete") }}</el-button>
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
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
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
    <el-dialog :title="title" :visible.sync="open" width="700px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Product Name" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Chinese name" prop="name">
              <el-input v-model="form.chineseName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Code" prop="code">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Category" prop="category">
              <el-input v-model="form.category" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Unit" prop="unit">
              <el-select filterable v-model="form.unit">
                <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Unit price" prop="price">
              <el-input v-model="form.price"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="Weight (KG)" prop="weight">
              <el-input v-model="form.weight" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Unit of Weight" prop="unitOfWeight">
              <el-select v-model="form.unitOfWeight">
                <el-option v-for="dict in this.getDictDatas(DICT_TYPE.UNIT_OF_WEIGHT)"
                                :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="Width (CM)" prop="width">
              <el-input v-model="form.width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Height (CM)" prop="height">
              <el-input v-model="form.height" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Length (CM)" prop="length">
              <el-input v-model="form.length" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
        <el-form-item label="Unit of Dimensions" prop="unitOfWhl">
          <el-select v-model="form.unitOfWhl">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.UNIT_OF_VOLUME)"
                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
          </el-col>-->
        </el-row>
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
import { createProduct, updateProduct, deleteProduct, getProduct, getProductPage, exportProductExcel, importTemplate } from '@/api/system/product'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'Product',
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
      // 商品列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        code: null,
        price: null,
        width: null,
        height: null,
        length: null,
        weight: null,
        unitOfWeight: null,
        unitOfWhl: null,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/product/import'
      },
      height: ''
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.height = document.documentElement.clientHeight - 370 + 'px'
    })
  },
  created() {
    this.getList()
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 370 + 'px'
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getProductPage(this.queryParams).then(response => {
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
        id: undefined,
        name: undefined,
        code: undefined,
        price: undefined,
        width: undefined,
        height: undefined,
        length: undefined,
        weight: undefined,
        unitOfWeight: undefined,
        unitOfWhl: undefined
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
      this.title = 'Add Product'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getProduct(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Edit Product'
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
          updateProduct(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createProduct(this.form).then(response => {
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
        .confirm('Are you sure to delete the data item with product number: ' + id + '?')
        .then(function () {
          return deleteProduct(id)
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
        .confirm('Confirm whether to export all product data items?')
        .then(() => {
          this.exportLoading = true
          return exportProductExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'Products.xlsx')
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
        this.$download.excel(response, 'prodct_temp.xlsx')
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
      let data = response.data.failureProductNumber
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
    //遇到空格换行
    // :render-header="renderHeader"
    // renderHeader(h, {column}) {
    // let header = column.label.split(' ');
    // return [h('p', [
    //   h('p', {}, header[0]),
    //   h('span', {}, header[1])
    // ])];
    //   }
  }
}
</script>
