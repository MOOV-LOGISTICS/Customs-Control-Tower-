<template>
  <div class="app-container" style="width:100%;margin:0 auto;">

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleAdd"
                   v-hasPermi="['system:notice:create']">Add Template</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

<el-tabs class="maps"  v-model="activeName" >
<el-tab-pane  label="Template"  name="Template"  >
      <!-- 列表 -->
      <el-table v-loading="loading" :data="list">
      <el-table-column label="Template Name" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="Content" align="left" prop="content">
          <template v-slot="scope">
            <div v-html="scope.row.content" style='height: 20px;'  @click="handleUpdateSingle(scope.row)"></div>
        </template>
        </el-table-column>
      <el-table-column label="Create Time" align="center" prop="createTime" width="100">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini"   type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:notice:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini"   type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:notice:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
</el-tab-pane>
<el-tab-pane  label="Notification log"  name="Notification log"  >
      <!-- 列表 -->
      <el-table v-loading="loading" :data="list1">
        <el-table-column label="Customer" align="center" prop="content">
          <template v-slot="scope">
            <span>
              {{ tenantMap[scope.row.tenantId] }}
              {{ scope.row.remark?"- "+scope.row.customerStr:"" }}
            </span>
        </template>
        </el-table-column>
      <el-table-column label="Template Name" align="center" prop="name" :show-overflow-tooltip="true"/>
        <el-table-column label="Content" align="left" prop="content">
          <template v-slot="scope">
            <div v-html="scope.row.content" style='height: 20px;'  @click="handleUpdateSingle(scope.row)"></div>
        </template>
        </el-table-column>
      <el-table-column label="Create Time" align="center" prop="createTime" width="100">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total1 > 0" :total="total1" :page.sync="queryParams1.pageNo" :limit.sync="queryParams1.pageSize"
                @pagination="getList1"/>
</el-tab-pane>
</el-tabs>

    <el-dialog :title="title" :visible.sync="open" width="80%"  append-to-body>
      <el-form :show-message="false"	 	 size='mini' ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="Title" prop="title">
              <el-input v-model="form.name" placeholder="Title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Customer" prop="tenantId">
              <el-cascader v-model="form.tenantIds"
              style="width: calc(100%);"
              size="medium"
              :options="tenantList"
              :props="{ multiple: true,checkStrictly: true, expandTrigger: 'hover' }"
              @change="handleChange"
              collapse-tags
              clearable filterable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Content">
              <div style="border: 1px solid #ccc;">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 460px; overflow-y: hidden;"
                    v-model="form.content"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                />
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="2" >
            <span style="">
              <el-checkbox v-model="form.sendEmail">Send Email</el-checkbox>
            </span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini"  type="primary" @click="submitForm">Save</el-button>
        <el-button size="mini"  type="primary" @click="sendForm">Send</el-button>
        <el-button size="mini"  @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="clickItem" title="Notification" :visible.sync="messageShow" width="1200px" append-to-body>
      <H2 style="padding: 0; margin: 0;font-weight: 700;">{{ clickItem.name }}</H2>
      <p style="color: #868e95;font-size: 12px;">{{ parseTime(clickItem.createTime) }}</p>
      <p v-html="clickItem.content"></p>
    </el-dialog>

  </div>
</template>
<style scoped>
.htmldiv video{
  width: 400px!important;
  height: 303px!important;
}
.w-e-textarea-video-container{
  background-image: none!important;
}

</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { getTenantPage,getTenantAndCustomers } from "@/api/system/tenant";

import { createNotifyTemplate, updateNotifyTemplate, deleteNotifyTemplate, getNotifyTemplate, getNotifyTemplatePage,
  sendNotifys } from "@/api/system/notify/template";
import {listSimpleUsers} from "@/api/system/user";
import {CommonStatusEnum} from "@/utils/constants";

export default {
  name: "SystemNotifyTemplate",
  components: {
    Editor, Toolbar
  },
  data() {
    return {
      editor: null,
      commentsDialogVisible:false,
        toolbarConfig: {
          excludeKeys:[
            'lineHeight',
            'fontFamily',
            'fontSize',
            'headerSelect',
            'codeBlock'
          ]
        },
        editorConfig: { placeholder: '...',
          MENU_CONF:{
            uploadImage:{
              base64LimitSize: 20 * 1024 * 1024
            },
            uploadVideo:{
              customUpload(file, insertFn) {  // TS 语法
                console.log(file)
                file.arrayBuffer().then((buffer) => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer);

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString);
                  console.log("Base64 Content:", base64String);
                  insertFn('data:video/mp4;base64,'+base64String, '')
                }).catch((error) => {
                  console.error("Error reading file:", error);
                });
                //
              }
            }
          }
        },
        mode: 'default',

        messageShow: false,
      clickItem: {},
      loading: true,
      showSearch: true,
      total: 0,
      list: [],
      total1: 0,
      list1: [],
      tenantList:[],
      // customerList:[],
      tenantMap:[],
      title: "",
      open: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        title: null,
        type: 1
      },
      queryParams1: {
        pageNo: 1,
        pageSize: 10,
        title: null,
        type: 2
      },
      // 表单参数
      form: {
        sendEmail: false
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "", trigger: "blur" }],
        content: [{ required: true, message: "", trigger: "blur" }],
      },
      // 用户列表
      users: [],
      activeName: 'Template',
    };
  },
  created() {
    this.getList();
    this.getList1();
    this.getTenantList();
    // 获得用户列表
    listSimpleUsers().then(response => {
      this.users = response.data;
    })
  },
  methods: {
    handleChange(value) {
        console.log(value);
    },
    getCustomers() {

    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getNotifyTemplatePage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getList1() {
      this.loading = true;
      // 执行查询
      getNotifyTemplatePage(this.queryParams1).then(response => {
        this.list1 = response.data.list;
        this.total1 = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        type: 1,
        sendEmail: false,
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getNotifyTemplate(id).then(response => {
        if(response.data.tenantIds){
          var tenantIdArr = response.data.tenantIds?response.data.tenantIds.split(','):[]
          var tenantTemp = []
          for(var tenant of tenantIdArr) {
            var tenantT = tenant?tenant.split('-').map(parseFloat):[]
            tenantTemp.push(tenantT)
          }
          response.data.tenantIds=tenantTemp?tenantTemp:[]
        }
        response.data.sendEmail = false
        this.form = response.data;
        this.open = true;
        this.title = "Edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        if(this.form.tenantIds){
          var tenantTemp = []
          for(var tenant of this.form.tenantIds) {
            var tenantT = tenant.join('-')
            tenantTemp.push(tenantT)
          }
          this.form.tenantIds=tenantTemp.join(',')
        }
        // 修改的提交
        if (this.form.id != null) {
          updateNotifyTemplate(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createNotifyTemplate(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Do you confirm delete Template:"' + row.name + '"?').then(function() {
        return deleteNotifyTemplate(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Success");
      }).catch(() => {});
    },
    sendForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        if(this.form.tenantIds){
          var tenantTemp = []
          for(var tenant of this.form.tenantIds) {
            var tenantT = tenant.join('-')
            tenantTemp.push(tenantT)
          }
          this.form.tenantIds=tenantTemp.join(',')
        }
        if(this.form.sendEmail==null) {
          this.form.sendEmail = false
        }
        console.log(this.form)
        // 添加的提交
        sendNotifys(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList1();
          this.form.sendEmail = false
        });
      });
    },
    getTenantList() {
      // 执行查询
      var query = {
        pageNo: 1,
        pageSize: 100,
      };
      getTenantPage(query).then(response => {
        this.tenantMap = []
        for(var dic of response.data.list) {
          this.tenantMap[dic.id] = dic.name
        }
      });
      getTenantAndCustomers(query).then(response => {
        this.tenantList = response.data;
        console.log(this.tenantList)
      });
    },
    onCreated(editor) {
        i18nChangeLanguage('en')
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    handleUpdateSingle(item) {
      this.clickItem = item;
      this.messageShow = true;
    },
  }
};
</script>
