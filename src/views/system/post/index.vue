<template>
  <div class="app-container" style="width:90%;margin:0 auto;">
    <!--    <el-form :show-message="false"	 	 size='mini' :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="120px">-->
    <!--      <el-form-item label="Code" prop="code">-->
    <!--        <el-input v-model="queryParams.code" placeholder="" clearable @keyup.enter.native="handleQuery"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="Name" prop="name">-->
    <!--        <el-input v-model="queryParams.name" placeholder="" clearable @keyup.enter.native="handleQuery"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="Status" prop="status">-->
    <!--        <el-select v-model="queryParams.status" placeholder="" clearable>-->
    <!--          <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon&#45;&#45;right"></i></el-button>-->
    <!--        &lt;!&ndash; <el-button size="mini"  icon="el-icon-refresh" @click="resetQuery">{{ $t('search.reset') }}</el-button> &ndash;&gt;-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleAdd"
                   v-hasPermi="['system:post:create']">{{ $t('search.addNew') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini"  type="warning" icon="el-icon-download"  @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:post:export']">{{$t('search.export')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList"  row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="" align="center" prop="" />
      <el-table-column label="Code" align="center" prop="code" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Sort" align="center" prop="sort" />
      <el-table-column label="Status" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="Create Date" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini"   type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:post:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
                     v-hasPermi="['system:post:create']">{{ $t('search.addNew') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:post:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :show-message="false"	 	 size='mini' ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Parent Name"  prop="parentId">
          <treeselect v-model="form.parentId" :options="postOptions" :normalizer="normalizer" :show-count="true"
                      placeholder="选择上级菜单"/>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
              {{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini"  type="primary" @click="submitForm">{{$t('el.popconfirm.confirmButtonText')}}</el-button>
        <el-button size="mini"  @click="cancel">{{$t('el.popconfirm.cancelButtonText')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listPosts, getPost, delPost, addPost, updatePost, exportPost } from "@/api/system/post";

  import {CommonStatusEnum} from '@/utils/constants'
  import { getDictDatas, DICT_TYPE } from '@/utils/dict'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "SystemPost",
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 菜单树选项
        menuOptions: [],
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 岗位表格数据
        postList: [],
        postOptions:[],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          code: undefined,
          name: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: "岗位名称不能为空", trigger: "blur" }
          ],
          code: [
            { required: true, message: "岗位编码不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "岗位顺序不能为空", trigger: "blur" }
          ]
        },

        // 枚举
        CommonStatusEnum: CommonStatusEnum,
        // 数据字典
        statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS)
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询岗位列表 */
      getList() {
        this.loading = true;
        listPosts(this.queryParams).then(response => {
          this.menuOptions = [];
          const post = { id: 0, name: 'MOOV', children: [] };
          this.postList = this.handleTree(response.data, "id");
          post.children =  this.postList
          this.postOptions = [];
          this.postOptions.push(post);
          this.loading = false;
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
          code: undefined,
          name: undefined,
          sort: 0,
          status: CommonStatusEnum.ENABLE,
          remark: undefined,
          remark: undefined,
          parentId: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        if (row != null && row.id) {
          this.form.parentId = row.id;
        } else {
          this.form.parentId = 0;
        }
        this.open = true;
        this.title = "Add Post";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        getPost(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "Update Post";
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
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updatePost(this.form).then(response => {
                this.$modal.msgSuccess("Success");
                this.open = false;
                this.getList();
              });
            } else {
              addPost(this.form).then(response => {
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
        const ids = row.id;
        this.$modal.confirm('Delete"' + row.name + '"?').then(function() {
            return delPost(ids);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("Success");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$modal.confirm('是否确认导出所有岗位数据项?').then(() => {
            this.exportLoading = true;
            return exportPost(queryParams);
          }).then(response => {
            this.$download.excel(response, '岗位数据.xlsx');
            this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
