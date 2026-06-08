<template>
  <div class="app-container forecast">
    <el-card class="box-card" style="    margin-bottom: 10px;">
      <!-- 搜索工作栏 -->
      <el-row :gutter="20" style=" padding-left: 15px;  padding-bottom: 10px;   padding-top: 15px;">
        <el-col :span="4">
          <el-select clearable @clear="handleQuery" @change="handleQuery" placeholder="Vessel/Voyage" filterable v-model="queryParams.vesselVoyage">
            <el-option v-for="value in vesselVoyageList" :key="value" :label="value" :value="value" />
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div>
      <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
      <el-card class="box-card" :style="{ 'min-height': (height)+'px' }">
        <el-table v-if="list.length >0" :data="list" v-loading="loading" :max-height="height" stripe style="width: 100% ;    padding-left: 15px;">
          <el-table-column prop="vessel" label="Vessel" min-width="120" max-width="160"></el-table-column>
          <el-table-column prop="voyage" label="Voyage" max-width="100"></el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Ningbo</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.ningBoEtd ? parseTime( scope.row.ningBoEtd) : '-'}}</div>
              {{scope.row.ningBoTEU ? scope.row.ningBoTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Qingdao</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.qingDaoEtd ? parseTime( scope.row.qingDaoEtd) : '-'}}</div>
              {{scope.row.qingDaoTEU ? scope.row.qingDaoTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Shanghai</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.shangHaiEtd ? parseTime( scope.row.shangHaiEtd) : '-'}}</div>
              {{scope.row.shangHaiTEU ? scope.row.shangHaiTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Tianjin</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.tianJinEtd ? parseTime( scope.row.tianJinEtd) : '-'}}</div>
              {{scope.row.tianJinTEU ? scope.row.tianJinTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Xiamen</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.xiaMenEtd ? parseTime( scope.row.xiaMenEtd) : '-'}}</div>
              {{scope.row.xiaMenTEU ? scope.row.xiaMenTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Yantian</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.yanTianEtd ? parseTime( scope.row.yanTianEtd) : '-'}}</div>
              {{scope.row.yanTianTEU ? scope.row.yanTianTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Taicang</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.taiCangEtd ? parseTime( scope.row.taiCangEtd) : '-'}}</div>
              {{scope.row.taiCangTEU ? scope.row.taiCangTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="170">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Chattogram</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.bdcgpEtd ? parseTime( scope.row.bdcgpEtd) : '-'}}</div>
              {{scope.row.bdcgpTEU ? scope.row.bdcgpTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label min-width="160">
            <template slot="header" slot-scope="scope">
              <div class="table-pad lab">ETD Colombo</div>
              <div class="table-pad">-</div>TEU
            </template>
            <template v-slot="scope">
              <div class="table-pad val">{{ scope.row.lkcmbEtd ? parseTime( scope.row.lkcmbEtd) : '-'}}</div>
              {{scope.row.lkcmbTEU ? scope.row.lkcmbTEU : '-'}}
            </template>
          </el-table-column>
          <el-table-column label min-width="100px" align="center" fixed="right">
            <template v-slot="scope">
              <el-button @click="handleUpdate(scope.row)" type="text">
                <i class="el-icon-edit"></i> Update
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
        <el-form-item label="Ningbo (TEU)" prop="ningBoTEU">
          <el-input-number v-model="form.ningBoTEU" :disabled="form.ningBoEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Qingdao (TEU)" prop="qingDaoTEU">
          <el-input-number v-model="form.qingDaoTEU" :disabled="form.qingDaoEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Shanghai (TEU)" prop="shangHaiTEU">
          <el-input-number v-model="form.shangHaiTEU" :disabled="form.shangHaiEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Tianjin (TEU)" prop="tianJinTEU">
          <el-input-number v-model="form.tianJinTEU" :disabled="form.tianJinEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Xiamen (TEU)" prop="xiaMenTEU">
          <el-input-number v-model="form.xiaMenTEU" :disabled="form.xiaMenEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Yantian (TEU)" prop="yanTianTEU">
          <el-input-number v-model="form.yanTianTEU" :disabled="form.yanTianEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Taicang (TEU)" prop="taiCangTEU">
          <el-input-number v-model="form.taiCangTEU" :disabled="form.taiCangEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Chattogram (TEU)" prop="bdcgpTEU">
          <el-input-number v-model="form.bdcgpTEU" :disabled="form.bdcgpEtd == null" :precision="1" :step="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="Colombo (TEU)" prop="lkcmbTEU">
          <el-input-number v-model="form.lkcmbTEU" :disabled="form.lkcmbEtd == null" :precision="1" :step="1" controls-position="right" />
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
import {
  createBookingForecast,
  updateBookingForecast,
  deleteBookingForecast,
  getBookingForecast,
  getBookingForecastPage,
  exportBookingForecastExcel,
  downloadForecastTemplate,
  getVesselVoyageList
} from '@/api/system/bookingForecast'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'BookingForecast',
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
        etd: null,
        pol: null,
        vessel: null,
        voyage: null,
        forecastTeu: null,
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/booking-forecast/import'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      height: ''
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      const clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 300
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 300
    this.getList()

    getVesselVoyageList().then(res => {
      this.vesselVoyageList = res.data
    })
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getBookingForecastPage(this.queryParams).then(response => {
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
      row.id = 1
      this.form = row
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
          updateBookingForecast(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
          })
          this.submitLoading = false
          return
        }
        // 添加的提交
        createBookingForecast(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          this.getList()
          this.submitLoading = false
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Delete "' + id + '"?')
        .then(function () {
          return deleteBookingForecast(id)
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
        .confirm('是否确认导出所有booking_forecast数据项?')
        .then(() => {
          this.exportLoading = true
          return exportBookingForecastExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'booking_forecast.xls')
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
      downloadForecastTemplate().then(response => {
        this.$download.excel(response, 'forecast_template.xlsx')
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
