<template>
  <div class="app-container" style="width:100%;margin:0 auto;">


    <!-- 搜索工作栏 -->
    <el-form :show-message="false"	 	 size='mini' :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" >
      <el-form-item label="Status" prop="readStatus"  label-width="60px">
        <el-select v-model="queryParams.readStatus" :placeholder="$t('notify.pleaseSelectStatus')" clearable>
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)"
                     :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Notification date" prop="createTime" label-width="130px">
        <el-date-picker v-model="queryParams.createTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" :start-placeholder="$t('notify.startDate')" :end-placeholder="$t('notify.endDate')" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        <!-- <el-button size="mini"  icon="el-icon-refresh" @click="resetQuery">{{ $t('notify.reset') }}</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleUpdateList">{{ $t('notify.markRead') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini"  type="primary" plain icon="el-icon-plus"  @click="handleUpdateAll">{{ $t('notify.allRead') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" ref="tables" :data="list">
      <el-table-column type="selection" width="55" />
      <el-table-column :label="$t('notify.SendingTime')" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('notify.type')" align="center" prop="templateType" width="80">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE" :value="scope.row.templateType" />
        </template>
      </el-table-column> -->

      <el-table-column label="Title" align="center" prop="templateNickname" width="120" />
      <el-table-column label="Content" align="left" prop="templateContent" max-heignt="200">
          <template v-slot="scope">
          <div v-html="scope.row.templateContent" style='height: 20px;'  @click="handleUpdateSingle(scope.row)"></div>
        </template>
      </el-table-column>

      <el-table-column label="Status" align="center" prop="readStatus" width="90">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.readStatus"/>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" width="150">
        <template v-slot="scope">
          <el-button size="mini"  v-show="!scope.row.readStatus"  type="text" icon="el-icon-check" @click="handleUpdateSingle(scope.row)">{{ $t('notify.readAlready') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
      
    <el-dialog v-model="clickItem" title="Notification" :visible.sync="messageShow" width="1200px" append-to-body>
      <H2 style="padding: 0; margin: 0;font-weight: 700;">{{ clickItem.templateNickname }}</H2>
      <p style="color: #868e95;font-size: 12px;">{{ parseTime(clickItem.createTime) }}</p>
      <p v-html="clickItem.templateContent"></p>
    </el-dialog>

  </div>
</template>

<script>
import {getMyNotifyMessagePageBySubscribe, updateAllSubscribeNotifyMessageRead, updateNotifyMessageRead} from "@/api/system/notify/message";

export default {
  name: "SystemMySubscribe",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 我的站内信列表
      list: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        readStatus: null,
        createTime: [],
        userType: 2
      },
      messageShow: false,
      clickItem: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getMyNotifyMessagePageBySubscribe(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
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
    handleUpdateList() {
      let list = this.$refs["tables"].selection;
      if (list.length === 0) {
        return;
      }
      this.handleUpdate(list.map(v => v.id))
    },
    handleUpdateSingle(row) {
      this.handleUpdate([row.id])
    },
    handleUpdate(ids) {
      updateNotifyMessageRead(ids).then(response => {
        this.$modal.msgSuccess("Success");
        this.getList();
      });
    },
    handleUpdateAll(){
      updateAllSubscribeNotifyMessageRead().then(response => {
        this.$modal.msgSuccess("Success");
        this.getList();
      });
    },
    handleUpdateSingle(item) {
      this.clickItem = item;
      this.messageShow = true;
    },
  }
}
</script>
