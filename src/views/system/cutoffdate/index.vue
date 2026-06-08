<template xmlns="" xmlns="">
  <div class="app-container" style="width:100%;margin:0 auto;">
    <el-card style="padding: 20px;">
      <el-dialog title="SI/VGM" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules" :show-message="false" label-width="170px">
          <el-form-item label="Carrier" prop="carrier" style="margin-bottom: 10px" required>
            <el-select filterable v-model="form.carrier">
              <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="POL" prop="pol" style="margin-bottom: 10px" required>
            <el-select placeholder="POL" filterable v-model="form.pol">
              <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Vessel" prop="vessel" style="margin-bottom: 10px" required>
            <el-select filterable v-model="form.vessel" placeholder="Vessel" remote :remote-method="remoteVessel" allow-create>
              <el-option v-for="value in vesselOptions.slice().sort()" :key="value" :label="value" :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Voyage" prop="voyage" style="margin-bottom: 10px" required>
            <el-select filterable v-model="form.voyage" placeholder="Voyage" remote :remote-method="remoteVoyage" allow-create>
              <el-option v-for="value in voyageOptions.slice().sort()" :key="value" :label="value" :value="value" />
            </el-select>
          </el-form-item>
          <!--                  合并成一个-->
          <el-form-item label="SI/VGM Cutoff" style="margin-bottom: 10px">
            <el-date-picker v-model="form.siCutOffDate" type="datetime" value-format="timestamp" placeholder="SI/VGM Cutoff" @change="formattedTimeAfterSubtracting12Hours"></el-date-picker>
          </el-form-item>
          <!--                    <el-form-item label="VGM Cut Off Date" label-width="150px" style="margin-bottom: 10px">-->
          <!--                        <el-date-picker v-model="form.vgmCutOffDate" type="datetime" value-format="timestamp"-->
          <!--                            placeholder="VGM Cut Off Date">-->
          <!--                        </el-date-picker>-->
          <!--                    </el-form-item>-->
          <el-form-item label="Shipping SI/VGM Cutoff" style="margin-bottom: 10px">
            <el-date-picker v-model="form.blDraftCutoff" type="datetime" value-format="timestamp" placeholder="Shipping SI/VGM Cutoff"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClickDialogFormVisible">Submit</el-button>
        </div>
      </el-dialog>
      <div>
        <div>
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="3" style="margin-top: 10px">
              <el-select filterable @change="handleChange" clearable v-model="queryParams.pol" placeholder="POL">
                <el-option v-for="value in polSet.slice().sort()" :label="value" :value="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" style="margin-top: 10px">
              <el-select filterable @change="handleChange" clearable v-model="queryParams.vessel" placeholder="Vessel">
                <el-option v-for="value in vesselSet.slice().sort()" :label="value" :value="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4" style="margin-top: 10px">
              <el-select filterable @change="handleChange" clearable v-model="queryParams.voyage" placeholder="Voyage">
                <el-option v-for="value in voyageSet.slice().sort()" :label="value" :value="value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="14" style="margin-top: 10px">
              <el-button type="primary" @click="handleQuery">
                <i class="el-icon-search"></i> Search
              </el-button>
              <el-button @click="handleAdd" type="primary" plain>
                Create
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
              <el-button @click="handleImport" type="primary" plain>
                Upload
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <div style="clear: both"></div>
      </div>
      <transition name="el-zoom-in-center">
        <div style="height: 100%">
          <el-table :height="height" :data="tableData" @sort-change="handleSortChange" v-loading="loading">
            <el-table-column prop="carrier" label="Carrier" align="center">
              <template v-slot="scope">
                <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ scope.row.carrier }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="pol" label="POL" align="center">
              <template v-slot="scope">
                <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ scope.row.pol }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="vessel" label="Vessel" align="center"></el-table-column>
            <el-table-column prop="voyage" label="Voyage" align="center" sortable="custom"></el-table-column>
            <el-table-column prop="siCutOffDate" label="SI/VGM Cutoff" sortable="custom">
              <template v-slot="scope">{{ parseTime(scope.row.siCutOffDate,"{y}-{m}-{d} {h}:{i}") }}</template>
            </el-table-column>
            <!--                        <el-table-column prop="vgmCutOffDate" label="VGM Cut Off Date" align="center" sortable="custom">-->
            <!--                            <template v-slot="scope">-->
            <!--                                {{ parseTime(scope.row.vgmCutOffDate,"{y}-{m}-{d} {h}:{i}") }}-->
            <!--                            </template>-->
            <!--                        </el-table-column>-->
            <el-table-column prop="blDraftCutoff" label="Shipping SI/VGM Cutoff" align="center" sortable="custom">
              <template v-slot="scope">{{ parseTime(scope.row.blDraftCutoff,"{y}-{m}-{d} {h}:{i}") }}</template>
            </el-table-column>
            <el-table-column label="Actions" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClickEdit(scope.row)" type="text" size="small">Edit</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-if="tableData.length" :total="queryParams.lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getList" />
        </div>
      </transition>

      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url" :file-list="fileList" :on-change="handleFileChange" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
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
      <el-dialog :title="uploadError.title" :visible.sync="uploadError.dialogVisible" width="50%">
        <el-table :data="uploadError.data" style="width: 100%" max-height="500px">
          <el-table-column property="data" label="Data Error">
            <template slot-scope="scope">
              <span>{{scope.row}}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { poList, selectPage, edit, poListTenantIgnore, importTemplate } from '@/api/system/cutoff'
import { createCutOffDate, updateCutOffDate, deleteCutOffDate, getCutOffDate, getCutOffDatePage, exportCutOffDateExcel } from '@/api/system/cutOffDate'

import moment from 'moment'
import { checkPermi, checkRole } from '@/utils/permission'
import { getBaseHeader } from '@/utils/request'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'cutoffDate',
  mixins: [fileLoadMixin],
  components: {},
  data() {
    return {
      upload: {
        open: false,
        title: '',
        headers: getBaseHeader(),
        url: process.env.VUE_APP_BASE_API + '/admin-api/cut/off/import'
      },
      form: {},
      rules: {},
      polSet: [],
      vesselSet: [],
      voyageSet: [],

      portOptions: [],
      vesselOptions: [],
      voyageOptions: [],
      vesselListAll: [],
      voyageListAll: [],

      uploadError: {
        title: 'Errors',
        dialogVisible: false,
        data: ''
      },

      dialogFormVisible: false,

      queryParams: {
        pageSize: 20,
        pageNo: 1
      },
      height: 0,
      loading: false,
      tableData: []
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.height = document.documentElement.clientHeight - 298
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 298
    this.getList()
    poList().then(response => {
      if (response && response.data) {
        this.polSet = response.data.polSet
        this.vesselSet = response.data.vesselSet.filter(item => item != 'Unknown')
        this.voyageSet = response.data.voyageSet.filter(item => item != 'Unknown')
      }
    })
    poListTenantIgnore().then(response => {
      this.portOptions = response.data.portList
      this.vesselListAll = response.data.vesselSet.filter(item => item != 'Unknown')
      this.voyageListAll = response.data.voyageSet.filter(item => item != 'Unknown')
    })
    // 获取全部port vessel voyage
  },

  methods: {
    formattedTimeAfterSubtracting12Hours(val) {
      console.log(this.form.siCutOffDate)
      if (!this.form.siCutOffDate) {
        return
      }
      // 使用 Moment.js 将时间戳转换为 Moment 对象
      const momentDate = moment(this.form.siCutOffDate)
      // 减12小时
      const adjustedDate = momentDate.subtract(12, 'hours')

      this.$set(this.form, 'blDraftCutoff', new Date(adjustedDate).getTime())
      //return adjustedDate.format('YYYY-MM-DD HH:mm');
    },
    remoteVessel(query) {
      console.log(query)
      if (query !== '' && query.length >= 2) {
        this.vesselOptions = this.vesselListAll.filter(ex => ex.toLowerCase().indexOf(query.toLowerCase()) != -1)
      } else {
        this.vesselOptions = []
      }
    },
    remoteVoyage(query) {
      console.log(query)
      if (query !== '' && query.length >= 2) {
        this.voyageOptions = this.voyageListAll.filter(ex => ex.toLowerCase().indexOf(query.toLowerCase()) != -1)
      } else {
        this.voyageOptions = []
      }
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
    },
    checkPermi,
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    handleChange() {
      this.getList()
    },
    getList() {
      this.loading = true
      selectPage(this.queryParams).then(res => {
        this.tableData = res.data.list
        this.loading = false
        this.queryParams.lineTotal = res.data.total
      })
    },
    handleAdd() {
      this.form = {}
      this.dialogFormVisible = true
    },
    handleClickEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    handleClickDialogFormVisible() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.form.vessel = this.form.vessel.trim()
        this.form.voyage = this.form.voyage.trim()

        // 修改的提交
        if (this.form.id != null) {
          updateCutOffDate(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.dialogFormVisible = false
            this.getList()
          })
          return
        }
        // 添加的提交
        createCutOffDate(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.dialogFormVisible = false
          this.getList()
        })
      })
    },
    handleImport() {
      this.upload.open = true
    },
    importTemplate() {
      importTemplate({}).then(res => {
        this.$download.excel(res, 'import_template.xlsx')
      })
    },
    handleFileSuccess(res) {
      console.log(res)

      this.upload.open = false
      this.$refs.upload.clearFiles()
      if (res.data !== null && res.data !== undefined && res.data !== '') {
        // 拼接提示语
        let data = res.data.failureNumber
        if (data.length > 0) {
          this.uploadError.data = data
          this.uploadError.dialogVisible = true
        }
      } else {
        this.getList()
      }
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },
    handleFileUploadProgress() {
      console.log(123)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Delete id"' + id + '"?')
        .then(function () {
          return deleteCutOffDate(id)
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
        .confirm('Export All?')
        .then(() => {
          this.exportLoading = true
          return exportContractNoExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'contract_no.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
