<template>
  <div class="app-container forecast">
    <el-card class="box-card" style="    margin-bottom: 10px;">
      <!-- 搜索工作栏 -->
      <el-row :gutter="20" style=" padding-left: 15px;  padding-bottom: 10px;   padding-top: 15px;">
        <el-col :span="4">
          <el-input v-model="queryParams.port" placeholder="Port" clearable @clear="handleQuery" @keyup.enter.native="queryParams.pageNo = 1 ,handleQuery()"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="queryParams.vessel" placeholder="Vessel" clearable @clear="handleQuery" @keyup.enter.native="queryParams.pageNo = 1 ,handleQuery()"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="queryParams.voyage" placeholder="Voyage" clearable @clear="handleQuery" @keyup.enter.native="queryParams.pageNo = 1 ,handleQuery()"></el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        </el-col>

        <el-col :span="3">
          <el-button @click="handleQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <div>
      <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
      <el-card class="box-card" :style="{ 'min-height': (height)+'px' }">
        <el-table v-if="list.length >0" :data="list" v-loading="loading" :max-height="height" stripe style="width: 100% ;    padding-left: 15px;">
          <el-table-column prop="port" label="Port" max-width="160"></el-table-column>
          <el-table-column prop="toLkcmb" label="TO - LKCMB" max-width="100"></el-table-column>
          <el-table-column prop="toEsbcn" label="TO - ESBCN" max-width="100"></el-table-column>
          <el-table-column prop="toSikop" label="TO - SIKOP" max-width="100"></el-table-column>
          <el-table-column prop="toNlmoe" label="TO - NLMOE" max-width="100"></el-table-column>
          <el-table-column prop="vessel" label="Vessel" max-width="100"></el-table-column>
          <el-table-column prop="voyage" label="Voyage" max-width="100"></el-table-column>
          <el-table-column label min-width="100px" align="center" fixed="right">
            <template v-slot="scope">
              <el-button @click="handleUpdate(scope.row)" type="text">
                <i class="el-icon-edit"></i> Update
              </el-button>

              <el-button @click="handleDelete(scope.row)" type="text">
                <i class="el-icon-delete"></i> Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" :page-sizes="[15, 50, 100]" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="Port" prop="port">
          <el-select filterable v-model="form.port">
            <el-option v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="TO - LKCMB" prop="toLkcmb">
          <el-input-number v-model="form.toLkcmb" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="TO - ESBCN" prop="toEsbcn">
          <el-input-number v-model="form.toEsbcn" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="TO - SIKOP" prop="toSikop">
          <el-input-number v-model="form.toSikop" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="TO - NLMOE" prop="toNlmoe">
          <el-input-number v-model="form.toNlmoe" :precision="1" :step="1" controls-position="right" />
        </el-form-item>

        <el-form-item label="Vessel" prop="vessel">
          <el-select v-model="form.vessel" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
            <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
          </el-select>
        </el-form-item>
        <el-form-item label="Voyage" prop="voyage">
          <el-input v-model="form.voyage" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>

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
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm" :loading="uploadLoading">
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
import { updateBookingTwConfiguration, deleteBookingTwConfiguration, getBookingTwConfigurationPage, downloadTwConfigurationTemplate, importTemplate } from '@/api/system/bookingTwTwConfiguration'
import { getBaseHeader } from '@/utils/request'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getVesselList } from '@/api/system/vessel'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'BookingTWTtConfiguration',
  mixins: [fileLoadMixin],
  components: {},
  data() {
    return {
      vesselVoyageList: [],
      // 遮罩层
      loading: true,
      submitLoading: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // booking_forecast列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 15,

        port: null,
        vessel: null,
        voyage: null,
        createTime: []
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/booking-forecast/import-tw-configuration'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      height: '',
      uploadLoading: false,
      portOptions: [],
      vesselListLes: []
    }
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 300
    this.getList()
    this.getOriginDeliveryList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getBookingTwConfigurationPage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.portOptions = res.data
      })
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
      } else {
        this.vesselListLes = []
      }
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
        etd: undefined,
        pol: undefined,
        vessel: undefined,
        voyage: undefined,
        forecastTeu: undefined
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
      this.title = 'ADD'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = row
      console.log('编辑', row)
      this.open = true
      this.title = row.vessel + ' ' + row.voyage
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.submitLoading = true
        // 修改的提交
        if (this.form.id != null) {
          updateBookingTwConfiguration(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          this.submitLoading = false
          return
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Delete "' + row.port + '' + ' data' + '"?')
        .then(function () {
          return deleteBookingTwConfiguration(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
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
      downloadTwConfigurationTemplate().then(response => {
        this.$download.excel(response, 'TWTTConfiguration_template.xlsx')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.getList()
      this.$modal.msgSuccess('Success')
    },
    // 提交上传文件
    submitFileForm() {
      this.uploadLoading = true
      this.$refs.upload.submit()
    }
  }
}
</script>
<style>
.table-pad {
  width: 10px;
  display: inline-grid;
}
.table-pad.lab {
  width: 105px;
  text-align: center;
}
.table-pad.val {
  text-align: center;
  width: 105px;
  margin-right: 13px;
}
.forecast table.el-table__header {
  padding: 5px 0px 5px 0px !important;
}
.forecast .el-table th.el-table__cell > .cell,
.forecast .el-table .cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
  font-size: 14px !important;
  font-weight: revert;
}
</style>
