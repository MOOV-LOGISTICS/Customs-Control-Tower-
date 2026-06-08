<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 搜索工作栏 -->
    <el-form :show-message="false"	 	 size='mini' :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch">
      <el-form-item label="Resource Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="Resource Name" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="State" prop="status">
        <el-select v-model="queryParams.status" placeholder="State" clearable>
          <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        <!-- <el-button size="mini"  icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleAdd"
                   v-hasPermi="['system:menu:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini"  type="info" plain icon="el-icon-sort"  @click="toggleExpandAll">{{$t('search.expandCollapse')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="Resource Name" :show-overflow-tooltip="true" width="250"></el-table-column>
      <el-table-column prop="icon" label="icon" align="center" width="100">
        <template v-slot="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="componentName" label="组件名称" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="状态" width="80">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini"   type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:menu:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
                     v-hasPermi="['system:menu:create']">{{ $t('search.addNew') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:menu:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form :show-message="false"	 	 size='mini' ref="form" :model="form" :rules="rules" label-width="170px">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="Parent Resource">
              <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                          placeholder="选择上级菜单"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Resource Type" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio v-for="dict in menuTypeDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                  {{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.type !== 3" label="icon">
              <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="icon" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon"
                            style="height: 32px;width: 16px;"/>
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Resource Name" prop="name">
              <el-input v-model="form.name" placeholder="Resource Name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sort" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== 3" label="Router Path" prop="path">
              <span slot="label">
                <el-tooltip content="Access address" placement="top">
                <i class="el-icon-question" />
                </el-tooltip>
                Router Path
              </span>
              <el-input v-model="form.path" placeholder="Router Path" />
            </el-form-item>
          </el-col>
					<el-col :span="12">
						<el-form-item v-if="form.type !== 1" label="Premission code">
              <span slot="label">
                <el-tooltip content="@PreAuthorize(`@ss.hasPermission('system:user:list')`)" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                Premission code
              </span>
							<el-input v-model="form.permission" placeholder="Premission code" maxlength="50" />
						</el-form-item>
					</el-col>
          <el-col :span="12" v-if="form.type === 2">
            <el-form-item label="Component" prop="component">
              <el-input v-model="form.component" placeholder="for example: system/user/index" />
            </el-form-item>
          </el-col>
					<el-col :span="12" v-if="form.type === 2">
						<el-form-item label="Component Name" prop="componentName">
							<el-input v-model="form.componentName" placeholder="for example: SystemUser" />
						</el-form-item>
					</el-col>
          <el-col :span="12">
            <el-form-item label="State" prop="status">
              <span slot="label">
                <el-tooltip content="When disabled is selected, the route will not appear in the sidebar and will not be accessible" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                Menu Status
              </span>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                          :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== 3" label="Display State">
              <span slot="label">
                <el-tooltip content="When hidden is selected, the route will not appear in the sidebar, but will still be accessible" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                Menu Show
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio :key="true" :label="true">Show</el-radio>
                <el-radio :key="false" :label="false">Hide</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== 3" label="Aways Display">
              <span slot="label">
                <el-tooltip content="When not is selected, when the menu has only one submenu, the submenu is displayed instead of showing itself" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                 Always display
              </span>
              <el-radio-group v-model="form.alwaysShow">
                <el-radio :key="true" :label="true">Yes</el-radio>
                <el-radio :key="false" :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
					<el-col :span="12">
						<el-form-item v-if="form.type === 2" label="Cache">
              <span slot="label">

                Cache or not
              </span>
							<el-radio-group v-model="form.keepAlive">
								<el-radio :key="true" :label="true">Yes</el-radio>
								<el-radio :key="false" :label="false">No</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini"  type="primary" @click="submitForm">{{$t('el.popconfirm.confirmButtonText')}}</el-button>
        <el-button size="mini"  @click="cancel">{{$t('el.popconfirm.cancelButtonText')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

import { SystemMenuTypeEnum, CommonStatusEnum } from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'
import {isExternal} from "@/utils/validate";

export default {
  name: "SystemMenu",
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      },

      // 枚举
      MenuTypeEnum: SystemMenuTypeEnum,
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      menuTypeDictDatas: getDictDatas(DICT_TYPE.SYSTEM_MENU_TYPE),
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS)
    };
  },
  created() {
    this.getList();
    console.log(11,getDictDatas(DICT_TYPE.SYSTEM_MENU_TYPE))
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "id");
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { id: 0, name: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: undefined,
        icon: undefined,
        type: SystemMenuTypeEnum.DIR,
        sort: undefined,
        status: CommonStatusEnum.ENABLE,
        visible: true,
        keepAlive: true,
        alwaysShow: true,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "Add Menu";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Update Menu";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 若权限类型为目录或者菜单时，进行 path 的校验，避免后续拼接出来的路由无法跳转
          if (this.form.type === SystemMenuTypeEnum.DIR
            || this.form.type === SystemMenuTypeEnum.MENU) {
            // 如果是外链，则不进行校验
            const path = this.form.path
            if (!isExternal(path)) {
              // 父权限为根节点，path 必须以 / 开头
              if (this.form.parentId === 0 && path.charAt(0) !== '/') {
                this.$modal.msgSuccess('前端必须以 / 开头')
                return
              } else if (this.form.parentId !== 0 && path.charAt(0) === '/') {
                this.$modal.msgSuccess('前端不能以 / 开头')
                return
              }
            }
          }

          // 提交
          if (this.form.id !== undefined) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.$modal.msgSuccess("Success");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
          return delMenu(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
      }).catch(() => {});
    }
  }
};
</script>
