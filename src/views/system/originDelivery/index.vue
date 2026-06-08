<template>
  <div class="app-container">
    <el-dialog title="Ports" :visible.sync="visablePorts" width="700px" v-dialogDrag append-to-body>
      <div>
        <el-button @click="addPort" type="primary">Add</el-button>
      </div>
      <br />
      <el-table v-loading="loading" :data="portList">
        <el-table-column label="Code" align="center" prop="code" />
        <el-table-column label="Name" align="center" prop="name" />
        <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row)" v-hasPermi="['system:origin-delivery:update']">{{ $t('search.modify') }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete2(scope.row)" v-hasPermi="['system:origin-delivery:delete']">{{ $t('search.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNo" :limit.sync="queryParams2.pageSize" @pagination="getPolPodPage" />

      <el-dialog :title="title" :visible.sync="innerVisible" width="700px" v-dialogDrag append-to-body>
        <el-form ref="form2" :model="form2" label-width="80px">
          <el-form-item required label="code" prop="code">
            <el-input v-model="form2.code" placeholder="please input the code" />
          </el-form-item>
          <el-form-item required label="name" prop="name">
            <el-input v-model="form2.name" placeholder="please input the name" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm2">{{ $t('el.popconfirm.confirmButtonText') }}</el-button>
          <el-button @click="cancel">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-card style="padding: 20px;">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item prop="code">
          <el-input v-model="queryParams.code" placeholder="please input the code" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="queryParams.name" placeholder="please input the name" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="country">
          <el-input v-model="queryParams.country" placeholder="please input the country" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
          <!-- <el-button icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button> -->
        </el-form-item>
      </el-form>

      <!-- 操作工具栏 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:origin-delivery:create']">{{ $t('search.addNew') }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:origin-delivery:export']">{{ $t('search.export') }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button plain icon="el-icon-upload" size="mini" @click="handleImport" :loading="exportLoading">Upload</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 列表 -->
      <el-table v-loading="loading" :height="height" :data="list">
        <el-table-column label="Code" align="center" prop="code" />
        <el-table-column label="Name" align="center" prop="name" />
        <el-table-column label="Country" align="center" prop="country" />
        <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="openPortList(scope.row)"
            v-hasPermi="['system:origin-delivery:update']">Ports</el-button>-->
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:origin-delivery:update']">{{ $t('search.modify') }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:origin-delivery:delete']">{{ $t('search.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" placeholder="please input the code" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="please input the name" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="form.country" placeholder="please input the country" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('el.popconfirm.confirmButtonText') }}</el-button>
        <el-button @click="cancel">{{ $t('el.popconfirm.cancelButtonText') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url" :file-list="fileList"
                 :on-change="handleFileChange" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
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
  </div>
</template>

<script>
import { createOriginDelivery, updateOriginDelivery, deleteOriginDelivery, getOriginDelivery, getOriginDeliveryPage, exportOriginDeliveryExcel, downloadOriginDeliveryTemplate } from '@/api/system/originDelivery'
import { getPolPodPage, updatePolPod, createPolPod, getPolPod, deletePolPod } from '@/api/system/polPod'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'OriginDelivery',
  mixins: [fileLoadMixin],
  components: {},
  data() {
    return {
      upload: {
        open: false,
        title: '',
        headers: getBaseHeader(),
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/origin-delivery/import'
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      total2: 0,
      // 出发地、目的地列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        code: null,
        name: null,
        createTime: []
      },
      queryParams2: {
        pageNo: 1,
        pageSize: 10,
        pid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      visablePorts: false,
      pid: null,
      portList: [],
      innerVisible: false,
      form2: {},
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
    handleImport() {
      this.upload.open = true
    },
    importTemplate() {
      downloadOriginDeliveryTemplate({}).then(res => {
        this.$download.excel(res, 'import_template.xlsx')
      })
    },
    handleFileSuccess() {
      this.upload.open = false
      this.getList()
      this.$refs.upload.clearFiles()
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },

    handleFileUploadProgress() {
      console.log(123)
    },
    /** 查询列表 */
    addPort() {
      this.innerVisible = true
      this.form2.pid = this.pid
      this.title = 'Add Port'
    },
    handleUpdate2(row) {
      const id = row.id
      getPolPod(id).then(response => {
        this.form2 = response.data
        this.innerVisible = true
        this.title = 'Update Port'
      })
    },
    submitForm2() {
      this.$refs['form2'].validate(valid => {
        if (!valid) {
          return
        }
        // 修改的提交
        if (this.form2.id != null) {
          updatePolPod(this.form2).then(response => {
            this.$modal.msgSuccess('The modification was successful')
            this.innerVisible = false
            this.getPolPodPage()
          })
          return
        }
        // 添加的提交
        createPolPod(this.form2).then(response => {
          this.$modal.msgSuccess('Added success')
          this.innerVisible = false
          this.getPolPodPage()
        })
      })
    },
    openPortList(row) {
      this.pid = row.id
      this.visablePorts = true
      this.getPolPodPage()
    },
    getPolPodPage() {
      this.queryParams2.pid = this.pid
      getPolPodPage(this.queryParams2).then(response => {
        this.portList = response.data.list
        this.total2 = response.data.total
      })
    },
    getList() {
      this.loading = true
      // 执行查询
      getOriginDeliveryPage(this.queryParams).then(response => {
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
        code: undefined,
        name: undefined
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
      this.title = 'Add origin and destination'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getOriginDelivery(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Change the origin and destination'
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
          updateOriginDelivery(this.form).then(response => {
            this.$modal.msgSuccess('The modification was successful')
            this.open = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createOriginDelivery(this.form).then(response => {
          this.$modal.msgSuccess('Added success')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Do you want to confirm the deletion of the data items of the origin and destination?')
        .then(function () {
          return deleteOriginDelivery(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('The deletion was successful')
        })
        .catch(() => {})
    },
    handleDelete2(row) {
      const id = row.id
      this.$modal
        .confirm('Do you want to confirm the deletion of the data items of the origin and destination?')
        .then(function () {
          return deletePolPod(id)
        })
        .then(() => {
          this.getPolPodPage()
          this.$modal.msgSuccess('The deletion was successful')
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
        .confirm('Do you want to confirm the export of all origin and destination data items?')
        .then(() => {
          this.exportLoading = true
          return exportOriginDeliveryExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'Origin and destination.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
