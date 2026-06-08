<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 搜索工作栏 -->
    <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="To Email" prop="toMail">
        <el-input v-model="queryParams.toMail" placeholder="Please enter the recipient email" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Account ID" prop="accountId">
        <el-select v-model="queryParams.accountId" placeholder="Please enter the account ID" clearable>
          <el-option v-for="account in accountOptions" :key="account.id" :value="account.id" :label="account.mail" />
        </el-select>
      </el-form-item>
      <el-form-item label="Template ID" prop="templateId">
        <el-input v-model="queryParams.templateId" placeholder="Please enter the template ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="Send Status" prop="sendStatus">
        <el-select v-model="queryParams.sendStatus" placeholder="Please select the send status" clearable>
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_MAIL_SEND_STATUS)"
                     :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Send Time" prop="sendTime">
        <el-date-picker v-model="queryParams.sendTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="Start Date" end-placeholder="End Date" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="User ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="Please enter the user ID" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="User Type" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="Please select the user type" clearable>
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.USER_TYPE)"
                     :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
        <!-- <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Send Time" align="center" prop="sendTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.sendTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="To Email" align="center" prop="toMail" width="200">
        <template v-slot="scope">
          <div>{{ scope.row.toMail }}</div>
          <div v-if="scope.row.userType && scope.row.userId">
            <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType"/> ({{ scope.row.userId }})
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Email Subject" align="center" prop="templateTitle" />
      <el-table-column label="Send Status" align="center" prop="sendStatus">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_MAIL_SEND_STATUS" :value="scope.row.sendStatus" />
        </template>
      </el-table-column>
      <el-table-column label="From Email" align="center" prop="fromMail" />
      <el-table-column label="Template ID" align="center" prop="templateId" />
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
                     v-hasPermi="['system:mail-log:query']">Details</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 邮件日志详细-->
    <el-dialog :title="title" :visible.sync="open" width="700px" v-dialogDrag append-to-body>
      <el-form :show-message="false" size='mini' ref="form" :model="form" label-width="160px">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="Log ID:"> {{ form.id }} </el-form-item>
            <el-form-item label="User ID:"> {{ form.userId }} </el-form-item>
            <el-form-item label="User Type:">
              <dict-tag :type="DICT_TYPE.USER_TYPE" :value="form.userType"/>
            </el-form-item>
            <el-form-item label="To Email:"> {{ form.toMail }} </el-form-item>
            <el-form-item label="Account ID:"> {{ form.accountId }} </el-form-item>
            <el-form-item label="From Email:"> {{ form.fromMail }} </el-form-item>
            <el-form-item label="Template ID:"> {{ form.templateId }} </el-form-item>
            <el-form-item label="Template Code:"> {{ form.templateCode }} </el-form-item>
            <el-form-item label="Template Nickname:"> {{ form.templateNickname }} </el-form-item>
            <el-form-item label="Email Subject:"> {{ form.templateTitle }} </el-form-item>
            <el-form-item label="Email Content:">
              <editor v-model="form.templateContent" :min-height="192" read-only />
            </el-form-item>
            <el-form-item label="Template Params:"> {{ form.templateParams }} </el-form-item>
            <el-form-item label="Send Status:">
              <dict-tag :type="DICT_TYPE.SYSTEM_MAIL_SEND_STATUS" :value="form.sendStatus" />
            </el-form-item>
            <el-form-item label="Send Time:"> {{ parseTime(form.sendTime) }} </el-form-item>
            <el-form-item label="Send Message ID:"> {{ form.sendMessageId }} </el-form-item>
            <el-form-item label="Send Exception:"> {{ form.sendException }} </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="open = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMailLog, getMailLogPage } from "@/api/system/mail/log";
import Editor from '@/components/Editor';
import { getSimpleMailAccountList } from "@/api/system/mail/account";

export default {
  name: "SystemMailLog",
  components: {
    Editor,
  },
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
      // 邮件日志列表
      list: [],
      // 弹出层标题
      title: "Mail Send Log Details",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        userId: null,
        userType: null,
        toMail: null,
        accountId: null,
        templateId: null,
        sendStatus: null,
        sendTime: [],
      },
      // 表单参数
      form: {},
      // 邮箱账号
      accountOptions: []
    };
  },
  created() {
    this.getList();
    // 获得邮箱账号列表
    getSimpleMailAccountList().then(response => {
      this.accountOptions = response.data
    })
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getMailLogPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
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
        id: undefined,
        userId: undefined,
        userType: undefined,
        toMail: undefined,
        accountId: undefined,
        fromMail: undefined,
        templateId: undefined,
        templateCode: undefined,
        templateNickname: undefined,
        templateTitle: undefined,
        templateContent: undefined,
        templateParams: undefined,
        sendStatus: undefined,
        sendTime: undefined,
        sendMessageId: undefined,
        sendException: undefined,
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
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    }
  }
};
</script>
