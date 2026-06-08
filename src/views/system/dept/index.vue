<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card style="padding: 20px;">
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <div v-loading="loading">
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
        </div>
      </el-dialog>

      <el-form :show-message="false" size="mini" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item prop="name">
          <el-input placeholder="Company Name" v-model="queryParams.name" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="Status" clearable>
            <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
          <!-- <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">{{
            $t("search.reset")
          }}</el-button>-->
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd" v-hasPermi="['system:dept:create']">{{ $t("search.addNew") }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import") }}</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-if="refreshTable" :height="height" v-loading="loading" :data="deptList" row-key="id">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-descriptions title style="margin: 15px 60px;padding:15px!important;">
                <el-descriptions-item label="Adress">
                  {{
                  props.row.address
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Country">
                  {{
                  props.row.country
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="City">
                  {{
                  props.row.city
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Zip">{{ props.row.zip }}</el-descriptions-item>
                <el-descriptions-item label="Enterprise Code(USCI,EURI,VAT)">
                  {{
                  props.row.companyUsci
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Fax">
                  {{
                  props.row.fax
                  }}
                </el-descriptions-item>
              </el-descriptions>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Company Full name"></el-table-column>
        <el-table-column prop="partyRole" label="Company Type" width="260">
          <template v-slot="scope">
            <div v-if="scope.row.partyRole != null">
              <el-tag v-for="item in scope.row.partyRole
                .substring(1, scope.row.partyRole.length - 1)
                .split(',')" :key="item">{{ item }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Phone" width="160"></el-table-column>
        <el-table-column prop="email" label="E-mail" width="160"></el-table-column>
        <el-table-column prop="customerCode" label="Company Code" width="160"></el-table-column>
        <el-table-column prop="supplierCode" label="Supplier Code" width="160"></el-table-column>
        <el-table-column prop="supplierType" label="Supplier Type" width="160"></el-table-column>
        <el-table-column prop="supplierGroup" label="Supplier Group" width="100"></el-table-column>
        <el-table-column prop="mscCode" label="MSC Code" width="100"></el-table-column>

        <el-table-column :label="$t('notify.operation')" align="center" class-name="small-padding fixed-width" width="160">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:update']">{{ $t("search.modify") }}</el-button>
            <el-button size="mini" v-if="scope.row.parentId !== 0" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:delete']">{{ $t("search.delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
        <el-form :show-message="true" size="mini" ref="form" :model="form" :rules="rules" label-width="220px">
          <el-row :gutter="30">
            <el-col :span="24" v-if="false">
              <el-form-item label="Owner Organization" prop="parentId">
                <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Company Type" prop="partyRole">
                <el-checkbox-group v-model="form.partyRole" size="mini">
                  <el-checkbox v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_PARTY_ROLE)" :key="dict.value" :label="dict.label" :value="dict.value" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Company name" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Company Address" prop="address">
                <el-input v-model="form.address" @blur="form.address = $event.target.value.trim()" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Country" prop="country">
                <el-select v-model="form.country" clearable filterable>
                  <el-option
                    v-for="dict in countryList.slice().reverse()"
                    :key="dict.countryCode+'-'+dict.countryCodeType"
                    :label="dict.countryEnglishName+' ('+dict.countryCode+':'+dict.countryCodeType+')'"
                    :value="dict.countryCode+'-'+dict.countryCodeType"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Street Number" prop="streetNumber">
                <el-input v-model="form.streetNumber" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="City" prop="city">
                <el-input v-model="form.city" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="ZIP Code" prop="zip">
                <el-input v-model="form.zip" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Contact Name" prop="contactName">
                <el-input v-model="form.contactName" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="E-mail" prop="email">
                <el-input v-model="form.email" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Fax" prop="fax">
                <el-input v-model="form.fax" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Enterprise Code(USCI,EURI,VAT)" prop="companyUsci">
                <el-input v-model="form.companyUsci" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="AEO Code" prop="aeoCode">
                <el-input v-model="form.aeoCode" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Company Code" prop="customerCode">
                <el-input v-model="form.customerCode" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Supplier Code" prop="supplierCode">
                <el-input v-model="form.supplierCode" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Supplier Type" prop="supplierType">
                <el-select v-model="form.supplierType" placeholder="Please select">
                  <el-option v-for="item in supplierTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Supplier Group" prop="supplierGroup">
                <el-input v-model="form.supplierGroup" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="MSC Code" prop="mscCode">
                <el-input v-model="form.mscCode" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="EDI SI Fields" prop="ediSiFields">
                <el-select v-model="form.ediSiFields" clearable filterable multiple collapse-tags>
                  <el-option label="Company name" value="name" />
                  <el-option label="Company Address" value="address" />
                  <el-option label="Country" value="country" />
                  <el-option label="City" value="city" />
                  <el-option label="Street Number" value="streetNumber" />
                  <el-option label="ZIP Code" value="zip" />
                  <el-option label="Contact Name" value="contactName" />
                  <el-option label="Phone" value="phone" />
                  <el-option label="E-mail" value="email" />
                  <el-option label="Fax" value="fax" />
                  <el-option label="Enterprise Code(USCI,EURI,VAT)" value="companyUsci" />
                  <el-option label="AEO Code" value="aeoCode" />
                  <el-option label="Company Code(Tailwind)" value="customerCode" />
                  <el-option label="MSC Code" value="condition" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Status" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitForm">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button size="mini" @click="cancel">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { pageDept, getDept, delDept, addDept, updateDept, importTemplate } from '@/api/system/dept'
import { getCountryList } from '@/api/system/country'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { CommonStatusEnum } from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'
import { listSimpleUsers } from '@/api/system/user'
import { getBaseHeader } from '@/utils/request'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'SystemDept',
  mixins: [fileLoadMixin],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/dept/import'
      },
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 用户下拉列表
      users: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 是否展开
      expand: false,
      total: 0,
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined,
        pageNo: 1,
        pageSize: 10
      },
      height: '',
      // 表单参数
      form: {
        partyRole: []
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        sort: [{ required: true, message: ' ', trigger: 'blur' }],
        partyRole: [{ required: true, message: ' ', trigger: 'blur' }]
      },

      // 枚举
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      countryList: [],
      supplierTypeOptions: [
        { label: 'DIRECT', value: 'DIRECT' },
        { label: 'PGS', value: 'PGS' }
      ]
    }
  },
  created() {
    this.getList()
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 355 + 'px'
    // 获得用户列表
    listSimpleUsers().then(response => {
      this.users = response.data
    })

    getCountryList().then(response => {
      this.countryList = response.data
    })
  },
  methods: {
    /** 查询部门列表 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.$download.excel(response, 'party.xlsx')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.loading = false
      this.getList()

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
    },
    // 提交上传文件
    submitFileForm() {
      this.loading = true
      this.$refs.upload.submit()
    },
    getList() {
      this.loading = true
      pageDept(this.queryParams).then(response => {
        this.deptList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 用户昵称展示
    userNicknameFormat(row, column) {
      if (!row.leaderUserId) {
        return '未设置'
      }
      for (const user of this.users) {
        if (row.leaderUserId === user.id) {
          return user.nickname
        }
      }
      return '未知【' + row.leaderUserId + '】'
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        sort: undefined,
        leaderUserId: undefined,
        phone: undefined,
        email: undefined,
        status: CommonStatusEnum.ENABLE,
        partyRole: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row !== undefined) {
        this.form.parentId = row.id
      }
      this.open = true
      this.title = 'Add Organization'
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, 'id')
      })
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getDept(row.id).then(response => {

        response.data.ediSiFields = response.data.ediSiFields ? response.data.ediSiFields.split(',') : []

        if (response.data.partyRole != null) {
          var newStr = response.data.partyRole.substring(1, response.data.partyRole.length - 1)
          response.data.partyRole = newStr.split(',')
          console.log('--')
        } else {
          response.data.partyRole = []
          console.log('--2')
        }
        this.form = response.data
        console.log(this.form)
        if (this.form.parentId === 0) {
          // 无父部门时，标记为 undefined，避免展示为 Unknown
          this.form.parentId = undefined
        }
        this.open = true
        this.title = 'Update Organization'
      })
      listDept(row.id).then(response => {
        this.deptOptions = this.handleTree(response.data, 'id')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.sort = 1
          var data = JSON.parse(JSON.stringify(this.form))
          if (data.ediSiFields) {
            data.ediSiFields = data.ediSiFields.join(',')
          }
          data.partyRole = ',' + data.partyRole.join(',') + ','
          if (this.form.id !== undefined) {
            updateDept(data).then(response => {
              this.$modal.msgSuccess('Success')
              this.open = false
              this.getList()
            })
          } else {
            addDept(data).then(response => {
              this.$modal.msgSuccess('Success')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
        .then(function () {
          return delDept(row.id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    }
  }
}
</script>
