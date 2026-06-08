<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card style="padding-top: 20px;">
      <!-- 搜索工作栏 -->

      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="6" :xs="24">
          <div class="head-container">
            <el-input v-model="deptName" :placeholder="$t('role.pleaseEnterTheDepartmentName')" clearable prefix-icon="el-icon-search" style="margin-bottom: 20px;margin-left: 10px;" />
          </div>
          <div class="head-container">
            <el-tree
              :style="{ height: height }"
              style="overflow: auto"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">{{ node.label }}</span>
            </el-tree>
          </div>
        </el-col>
        <!-- 从这里分为左右两部分 -->
        <!--用户数据-->
        <el-col :span="18" :xs="24">
          <el-form :show-message="false" size="mini" :model="queryParams" ref="queryForm" v-show="showSearch" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item prop="nickname">
                  <el-input placeholder="Nick Name" v-model="queryParams.nickname" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="email">
                  <el-input placeholder="Email Address" v-model="queryParams.email" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="status">
                  <el-select placeholder="Status" v-model="queryParams.status" clearable>
                    <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button @click="handleQuery" type="primary">
                    <i class="el-icon-search el-icon--right"></i>
                    Search
                  </el-button>
                  <!-- <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">{{
                    $t("search.reset")
                  }}</el-button>-->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-row :gutter="10" class="mb8" style="margin-right: 20px;">
            <el-col :span="1.5">
              <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd" v-hasPermi="['system:user:create']">{{ $t("search.addNew") }}</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="mini" type="info" icon="el-icon-upload2" @click="handleImport" v-hasPermi="['system:user:import']">{{ $t("search.import") }}</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="mini" type="warning" icon="el-icon-download" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:user:export']">{{ $t("search.export") }}</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="userList">
            <el-table-column label="Nick Name" align="center" key="nickname" prop="nickname" v-if="columns[2].visible" width="150" />
            <el-table-column label="Email" align="center" key="email" prop="email" v-if="columns[3].visible" width="150" />
            <el-table-column label="Party" align="center" key="deptName" prop="dept.name" v-if="columns[4].visible" width="150" />

            <el-table-column label="Status" key="status" v-if="columns[6].visible" align="center">
              <template v-slot="scope">
                <el-switch :disabled="!userUpdate" v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>

            <el-table-column label="Role" key="role" align="left" min-width="200px">
              <template v-slot="scope">
                <el-tag style="margin-right: 10px;margin-bottom: 4px;margin-top: 4px;" v-for="roleId in scope.row.roleIds" :key="roleId">{{ roleSet[roleId] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Create Time" align="center" prop="createTime" v-if="columns[7].visible" width="160">
              <template v-slot="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
              <template v-slot="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:update']">Edit</el-button>
                <el-dropdown
                  @command="(command) => handleCommand(command, scope.$index, scope.row)"
                  v-hasPermi="[
                  'system:user:delete',
                  'system:user:update-password',
                  'system:permission:assign-user-role',
                  'assign:user:reports',
                ]"
                >
                  <el-button size="mini" type="text" icon="el-icon-d-arrow-right">More</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="handleDelete" v-if="scope.row.id !== 1" type="text" icon="el-icon-delete" v-hasPermi="['system:user:delete']">Delete</el-dropdown-item>
                    <el-dropdown-item command="handleResetPwd" type="text" icon="el-icon-key" v-hasPermi="['system:user:update-password']">Reset Password</el-dropdown-item>
                    <el-dropdown-item command="handleRole" type="text" icon="el-icon-circle-check">User Role</el-dropdown-item>
                    <el-dropdown-item command="handleSubDept" type="text" icon="el-icon-circle-check">User SubParty</el-dropdown-item>

                    <!-- <el-dropdown-item v-if="scope.row.isFactory" command="handlePoClick" type="text" icon="el-icon-circle-check">User Po</el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-col>
      </el-row>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="75%" append-to-body>
        <el-form :show-message="false" size="mini" ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="Nick Name" prop="nickname">
                <el-input v-model="form.nickname" :placeholder="$t('role.pleaseEnterUserNickname')" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.id == null">
              <el-form-item label="Password" prop="password">
                <el-input type="password" v-model="form.password" show-password placeholder />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="Party" prop="deptId">
                <el-select v-model="form.deptId" filterable clearable disabled>
                  <el-option v-for="dept in deptOptions" :value="dept.id" :key="dept.id" :label="dept.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <!-- 公司类型-->
            <!-- <el-col>
              <el-form-item label="Company Type">
                <el-checkbox-group v-model="form.companyTypeIds" size="mini" style="display: flex; flex-wrap: wrap;">
                  <el-row :gutter="10">
                    <el-col v-show="item.value=='Factory'||item.value=='Supplier'" :span="10" v-for="item in systemPartyRole" :key="item.id" style="margin-bottom: 10px;">
                      <el-checkbox :label="item.id" :value="item.id" border>{{ item.value }}</el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </el-form-item>
            </el-col>-->

            <!--subAdmin创建用户时隐藏pol和pod-->
            <!-- <el-col :span="12">
              <el-form-item label="Pol Permissions">
                <el-select collapse-tags filterable v-model="form.pols" multiple placeholder="Select">
                  <el-option v-for="dept in portOptions" :value="dept.code" :key="dept.code"
                    :label="dept.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Pod Permissions">
                <el-select collapse-tags filterable v-model="form.pods" multiple placeholder="Select">
                  <el-option v-for="dept in portOptions" :value="dept.code" :key="dept.code"
                    :label="dept.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->

            <!-- <el-col>
              <el-form-item label="Transport Mode">
                <el-checkbox-group v-model="form.freightMethod" size="mini">
                  <el-checkbox v-for="item in this.getDictDatas(DICT_TYPE.MODES_OF_TRANSPORT)" :key="item.value"
                    :label="item.label" :value="item.value" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>-->
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

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="500px" append-to-body>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-change="handleFileChange"
          :file-list="fileList"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
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

      <!-- 分配角色 -->
      <el-dialog title="Assign roles" :visible.sync="openRole" width="600px" append-to-body>
        <el-form :show-message="false" size="mini" :model="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="form.username" :disabled="true" />
          </el-form-item>
          <el-form-item label="Nickname">
            <el-input v-model="form.nickname" :disabled="true" />
          </el-form-item>
          <el-form-item label="Role">
            <el-select v-model="form.roleIds" multiple filterable placeholder="Select">
              <el-option v-for="item in roleOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitRole">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button size="mini" @click="cancelRole">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog title="Assign Sub Party" :visible.sync="openSubDept" width="600px" append-to-body>
        <el-form :show-message="false" size="mini" :model="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="form.username" :disabled="true" />
          </el-form-item>
          <el-form-item label="Nickname">
            <el-input v-model="form.nickname" :disabled="true" />
          </el-form-item>
          <el-form-item label="Sub Party">
            <el-select v-model="form.subDeptIds" multiple filterable placeholder="Select">
              <el-option v-for="item in subDeptOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitSubDept">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button size="mini" @click="cancelSubDept">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 分配查看schedule选项 -->
      <el-dialog title="Assign schedules" :visible.sync="openSchedule" width="500px" append-to-body>
        <el-form :show-message="false" size="mini" :model="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="form.username" :disabled="true" />
          </el-form-item>
          <el-form-item label="Nickname">
            <el-input v-model="form.nickname" :disabled="true" />
          </el-form-item>
          <el-form-item label="Carrier">
            <el-select v-model="form.scheduleIds" multiple placeholder="Select">
              <el-option v-for="item in scheduleOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitSchedule">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button size="mini" @click="cancelSchedule">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 分配报表 -->
      <el-dialog title="Assign Reports" :visible.sync="openReport" width="70%" append-to-body>
        <el-form :show-message="false" size="mini" :model="form" label-width="120px">
          <el-form-item label="Nick Name">
            <el-input v-model="form.nickname" :disabled="true" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="form.email" :disabled="true" />
          </el-form-item>
          <el-form-item label="Report">
            <el-cascader
              style="width: calc(100%);"
              filterable
              v-model="form.reportIds"
              size="medium"
              :options="userReportData"
              :props="props"
              show-all-levels="false"
              popper-class="report-css"
              :filter-method="filterMethod"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitReport">
            {{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button size="mini" @click="cancelReport">
            {{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>

      <!-- <add-remove-po-dialog ref="addRemovePoDialog"></add-remove-po-dialog> -->
    </el-card>
  </div>
</template>

<script>
import {
  addUser,
  changeUserStatus,
  // 修改用户子管理员状态
  changeUserSubAdminStatus,
  delUser,
  exportUser,
  getUser,
  getUserInfo,
  importTemplate,
  listUser,
  resetUserPwd,
  updateUser
} from '@/api/system/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { listSimpleDepts } from '@/api/system/dept'
import { listSimplePosts } from '@/api/system/post'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { CommonStatusEnum, SubAdminEnum } from '@/utils/constants'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import { assignUserRole, listUserRoles } from '@/api/system/permission'
import { listSimpleRoles } from '@/api/system/role'
import { getBaseHeader } from '@/utils/request'
import { assignUserSchedule, listSchedule, listUserSchedules } from '@/api/system/schedule'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import { getUserReportsById, updateUserReports, getUserReports } from '@/api/bi/report'
import { TriangleRuler } from '@icon-park/vue'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { createUserSubDept } from '@/api/system/userSubDept'
import { listSubDeptByUserId } from '@/api/system/subDept'

export default {
  name: 'SystemUser',
  mixins: [fileLoadMixin],
  components: { Treeselect },
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      customerOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],

      roleSet: [],

      // 承运人船期选项
      scheduleOptions: [],
      // 表单参数
      form: {
        dataParties: [],
        freightMethod: [],
        customers: [],
        // 子管理员默认不是
        subAdmin: false,
        // 公司类型
        companyTypeIds: []
      },
      partyDialogVisable: false,
      partyForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
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
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/user/import'
      },
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        username: undefined,
        mobile: undefined,
        status: undefined,
        deptId: undefined,
        createTime: []
      },
      height: '',
      // 列信息
      columns: [
        { key: 0, label: `No`, visible: true },
        { key: 1, label: `Name`, visible: true },
        { key: 2, label: `NickName`, visible: true },
        { key: 3, label: `Email`, visible: true },
        { key: 4, label: `Party`, visible: true },
        { key: 5, label: `Phone`, visible: true },
        { key: 6, label: `Status`, visible: true },
        { key: 7, label: `Create Time`, visible: true }
      ],
      // 表单校验
      rules: {
        nickname: [{ required: true, message: 'The nickname cannot be empty', trigger: 'blur' }],
        password: [
          {
            required: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~`()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/,
            message: 'Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). ',
            trigger: 'blur'
          }
        ],
        deptId: [{ required: true, message: '', trigger: 'blur' }],
        email: [
          {
            required: true,
            type: 'email',
            message: "'Please enter the correct email address",
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
            message: 'Please enter the correct mobile number',
            trigger: 'blur'
          }
        ]
      },
      // 是否显示弹出层（角色权限）
      openRole: false,
      // 是否显示弹出层（承运人）
      openSchedule: false,
      portOptions: [],
      // 枚举
      SysCommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      sexDictDatas: getDictDatas(DICT_TYPE.SYSTEM_USER_SEX),
      userReport: false,
      userReportData: [],
      openReport: false,
      props: { multiple: true, label: 'label', value: 'value', children: 'children', emitPath: false },
      userUpdate: false,
      // 是否是子管理员，谁可以修改，目前应该是pepco租户下才能修改
      SubAdminUserUpdate: false,
      openSubDept: false,
      subDeptOptions: [],

      // 获取company type
      systemPartyRole: []
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }

    // // 当 subAdmin 变为 false 时，清空 companyTypeIds
    // 'form.subAdmin': function (newValue) {
    //   if (!newValue) {
    //     this.form.companyTypeIds = []
    //   }
    // }
  },
  created() {
    this.userUpdate = this.checkPermi(['system:user:update'])
    // 是否可以修改子管理员选项,这个页面直接false,给子管理员用的
    this.SubAdminUserUpdate = false
    this.systemPartyRole = getDictDatas(DICT_TYPE.SYSTEM_PARTY_ROLE)
    console.log('==============================================')
    console.log(this.systemPartyRole)
    // 获得角色列表
    listSimpleRoles().then(response => {
      // 处理 roleOptions 参数
      this.roleSet = []
      for (var data of response.data) {
        this.roleSet[data.id] = data.name
      }
      this.getList()
    })
    this.getTreeselect()
    // this.remoteMethodCarriers();
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 245 + 'px'
    this.getOriginDeliveryList()
    // this.getConfigKey("sys.user.init-password").then(response => {
    //   this.initPassword = response.msg;
    // });

    this.userReportData = []
    if (this.checkPermi(['assign:user:reports'])) {
      getUserReports().then(response => {
        this.userReportData = this.transformDataToTree(response.data)
      })
    }
  },
  methods: {
    // handlePoClick(row) {
    //   console.log('handlePoClick')
    //   console.log(row.id)

    //   this.$refs.addRemovePoDialog.openDialog(row.id)
    // },
    generateRandomPassword(length) {
      // 修改初始密码的生成方式 edwin
      // 确保生成的密码至少包含三种字符类型（大写字母、小写字母和数字）
      if (length < 3) {
        throw new Error('Password length must be at least 3 to include all character types.')
      }

      const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
      const numberChars = '0123456789'
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

      const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars

      let password = ''
      password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]
      password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]
      password += numberChars[Math.floor(Math.random() * numberChars.length)]
      password += specialChars[Math.floor(Math.random() * specialChars.length)]

      for (let i = 3; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length)
        password += allChars[randomIndex]
      }

      // Shuffle the password to ensure randomness
      password = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')

      return password
    },
    checkPermi,
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.portOptions = res.data
      })
    },
    // 更多操作
    handleCommand(command, index, row) {
      switch (command) {
        case 'handleUpdate':
          this.handleUpdate(row) //修改客户信息
          break
        case 'handleDelete':
          this.handleDelete(row) //红号变更
          break
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleRole':
          this.handleRole(row)
          break
        case 'handlePoClick':
          this.handlePoClick(row)
        case 'handleSubDept':
          this.handleSubDept(row)
          break
        default:
          break
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(response => {
        this.userList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 查询部门下拉树结构 + 岗位下拉 */
    getTreeselect() {
      listSimpleDepts().then(response => {
        // 处理 deptOptions 参数
        this.deptOptions = response.data
        //this.deptOptions.push(response.data);

        this.customerOptions = response.data.filter(item => {
          return item.partyRole.includes('Customer')
        })
      })
      listSimplePosts().then(response => {
        // 处理 postOptions 参数
        this.postOptions = []
        this.postOptions.push(...response.data)
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().includes(value.toLowerCase()) // 不区分大小写过滤
      //return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === CommonStatusEnum.ENABLE ? 'Enable' : 'Disable'
      this.$modal
        .confirm('Confirm"' + text + '""' + row.username + '"User?')
        .then(function () {
          return changeUserStatus(row.id, row.status)
        })
        .then(() => {
          this.$modal.msgSuccess(text + 'Success')
        })
        .catch(function () {
          row.status = row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
        })
    },

    // 处理用户是否是子管理员
    handleSubAdminChange(row) {
      let text = row.subAdmin ? 'Enable' : 'Disable'
      this.$modal
        .confirm('Confirm"' + text + '""' + row.nickname + '"As Sub Admin?')
        .then(function () {
          return changeUserSubAdminStatus(row.id, row.subAdmin)
        })
        .then(() => {
          this.$modal.msgSuccess(text + 'Success')
        })
        .catch(function () {
          row.subAdmin = !row.subAdmin
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（角色权限）
    cancelRole() {
      this.openRole = false
      this.reset()
    },
    // 取消按钮（角色权限）
    cancelSubDept() {
      this.openSubDept = false
      this.reset()
    },

    // 取消按钮（carrier）
    cancelSchedule() {
      this.openSchedule = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        mobile: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        roleIds: [],
        scheduleIds: [],
        freightMethod: [],
        reportIds: [],
        subDeptIds: [],
        // 是否是子管理员
        subAdmin: false,
        isFactory: false,
        subDeptIds: [],
        // 公司类型
        companyTypeIds: []
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
      // 获得下拉数据
      this.getTreeselect()
      // 打开表单，并设置初始化
      this.open = true
      this.title = 'Add User'
      if (this.form.id == null) {
        this.form.password = this.generateRandomPassword(12)
      }
      // 设置默认的 deptId
      if (this.deptOptions && this.deptOptions.length > 0) {
        this.form.deptId = this.deptOptions[0].id
      }
      console.log(this.form.password)
      // this.form.password = this.initPassword;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      const id = row.id
      getUserInfo(id).then(response => {
        response.data.pols = response.data.pols ? response.data.pols.split(',') : []
        response.data.pods = response.data.pods ? response.data.pods.split(',') : []
        response.data.freightMethod = response.data.freightMethod ? response.data.freightMethod.split(',') : []
        response.data.dataParties = response.data.dataParties ? response.data.dataParties.split(',') : []
        response.data.customers = response.data.customers ? response.data.customers.split(',').map(parseFloat) : []

        console.log('sssssssssssssssssssssssssssssssssssssssssssssssss')
        console.log(row.companyTypeIds)
        console.log(response.data.companyTypeIds)

        this.form = response.data
        this.open = true
        this.title = 'Edit User'
        this.form.password = ''
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('Please input"' + row.nickname + '"new password', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then(response => {
            this.$modal.msgSuccess('Success，new password：' + value)
          })
        })
        .catch(() => {})
    },
    /** 提交按钮（报表权限） */
    submitReport: function () {
      if (this.form.id !== undefined) {
        updateUserReports({
          userId: this.form.id,
          reportIds: this.form.reportIds
        }).then(response => {
          this.$modal.msgSuccess('Success')
          this.openReport = false
          this.getList()
        })
      }
    },

    submitSubDept: function () {
      if (this.form.id !== undefined) {
        createUserSubDept({
          userId: this.form.id,
          subDeptIds: this.form.subDeptIds
        }).then(response => {
          this.$modal.msgSuccess('Success')
          this.openSubDept = false
          this.getList()
        })
      }
    },
    filterMethod(option, value) {
      const labelLower = option.label.toLowerCase()
      const searchLower = value.toLowerCase()
      console.log(labelLower, searchLower)
      if (labelLower.indexOf(searchLower) > -1) {
        return true
      } else {
        return false
      }
    },
    cancelReport() {
      this.openReport = false
      this.reset()
    },
    // 转换函数
    transformDataToTree(data) {
      const result = []
      const categoriesMap = {}

      // 遍历数据，根据categoryName组织数据
      data.forEach(item => {
        if (!categoriesMap[item.categoryName]) {
          categoriesMap[item.categoryName] = {
            value: item.categoryName,
            label: item.categoryName,
            children: []
          }
          result.push(categoriesMap[item.categoryName])
        }
        categoriesMap[item.categoryName].children.push({
          value: item.id,
          label: item.reportName,
          disabled: item.status == 1 ? true : false
        })
      })

      return result
    },
    handleSubDept(row) {
      this.reset()
      const id = row.id
      // 处理了 form 的用户 username 和 nickname 的展示
      this.form.id = id
      this.form.username = row.username
      this.form.nickname = row.nickname
      this.form.subDeptIds = row.subDeptIds

      this.openSubDept = true
      // get sub dept options
      // subDeptOptions
      // 获得 sub dept
      listSubDeptByUserId().then(response => {
        // 处理 roleOptions 参数
        this.subDeptOptions = []
        this.subDeptOptions.push(...response.data)
      })
    },
    /** 分配用户角色操作 */
    handleRole(row) {
      this.reset()
      const id = row.id
      // 处理了 form 的用户 username 和 nickname 的展示
      this.form.id = id
      this.form.username = row.username
      this.form.nickname = row.nickname
      // 打开弹窗
      this.openRole = true
      // 获得角色列表
      listSimpleRoles().then(response => {
        // 处理 roleOptions 参数
        this.roleOptions = []
        this.roleOptions.push(...response.data)
      })
      // 获得角色拥有的菜单集合
      listUserRoles(id).then(response => {
        // 设置选中
        this.form.roleIds = response.data
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.form))
          if (data.pols) {
            data.pols = data.pols.join(',')
          }
          if (data.pods) {
            data.pods = data.pods.join(',')
          }
          if (data.freightMethod) {
            data.freightMethod = data.freightMethod.join(',')
          }
          if (data.dataParties) {
            data.dataParties = data.dataParties.join(',')
          }
          if (data.customers) {
            data.customers = data.customers.join(',')
          }
          if (this.form.id !== undefined) {
            updateUser(data).then(response => {
              this.$modal.msgSuccess('Success')
              this.open = false
              this.getList()
            })
          } else {
            addUser(data).then(response => {
              this.$modal.msgSuccess('Success')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 提交按钮（角色权限） */
    submitRole: function () {
      if (this.form.id !== undefined) {
        assignUserRole({
          userId: this.form.id,
          roleIds: this.form.roleIds
        }).then(response => {
          this.$modal.msgSuccess('Success')
          this.openRole = false
          this.getList()
        })
      }
    },

    /** 提交按钮（schedule） */
    submitSchedule: function () {
      if (this.form.id !== undefined) {
        assignUserSchedule({
          userId: this.form.id,
          scheduleIds: this.form.scheduleIds
        }).then(response => {
          this.$modal.msgSuccess('Success')
          this.openSchedule = false
          this.getList()
        })
      }
    },

    remoteMethodCarriers() {
      this.carriers = []
      var carr = getDictDatas(DICT_TYPE.CARRIER)
      for (var dic of carr) {
        if (this.carrierList.indexOf(dic.value) > -1) {
          this.carriers.push(dic)
          this.scheduleOptions.push(dic)
        }
      }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('Do you want to delete the user ID"' + ids + '"Data item?')
        .then(function () {
          return delUser(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal
        .confirm('Confirm whether to export all user data items?')
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams }
          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          return exportUser(params)
        })
        .then(response => {
          this.$download.excel(response, 'users.xlsx')
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
        this.$download.excel(response, 'import_template.xlsx')
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
      let data = response.data
      let text = 'successful：' + data.createUsernames.length
      for (const username of data.createUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />updates：' + data.updateUsernames.length
      for (const username of data.updateUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />failures：' + Object.keys(data.failureUsernames).length
      for (const username in data.failureUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username + '：' + data.failureUsernames[username]
      }
      this.$alert(text, 'Import result', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>

<style>
.report-css .el-cascader-menu__wrap {
  max-height: 400px;
  min-height: 300px;
}
</style>
