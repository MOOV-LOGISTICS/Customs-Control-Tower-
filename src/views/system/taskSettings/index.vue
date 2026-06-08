<template>
  <div class="app-container">

    <el-card style="padding: 20px;">
    <!-- 列表 -->
    <el-table v-loading="loading" :height="height" :data="list">
      <el-table-column label="Seq" align="center" prop="seq" />
      <el-table-column label="Task name" align="center" prop="taskName" />
      <el-table-column label="Handle Party" align="center" prop="partyRole">
        <template v-slot="scope">
          {{ partyMap[scope.row.partyRole]?partyMap[scope.row.partyRole]:scope.row.partyRole }}
          </template>
      </el-table-column>
      <el-table-column label="View Party" align="center" prop="viewPartyRole">
        <template v-slot="scope">
            {{ partyMap[scope.row.viewPartyRole]?partyMap[scope.row.viewPartyRole]:scope.row.viewPartyRole }}
          </template>
      </el-table-column>

      <el-table-column label="Urgent rule" align="center" prop="urgentKey">
          <template v-slot="scope">
            <span v-if="scope.row.urgentKey!=null">{{ scope.row.urgentKey+(scope.row.urgentDays>0?'+':'') }}{{ scope.row.urgentDays }}</span>
          </template>
      </el-table-column>
      <el-table-column label="Overdue rule" align="center" prop="overdueKey">
        <template v-slot="scope">
            <span v-if="scope.row.overdueKey!=null">{{ scope.row.overdueKey+(scope.row.overdueDays>0?'+':'')}}<span v-if="scope.row.overdueDays!=0">{{ scope.row.overdueDays}}</span>
            </span>
          </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:task-setting:update']">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    </el-card>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="Handle Party" prop="partyRole">
          <el-select v-model="form.partyRole">
            <el-option v-for="o in options" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="View Party" prop="viewPartyRole">
          <el-select v-model="form.viewPartyRole">
            <el-option v-for="o in options" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Overdue days" prop="overdueDays">
          <el-input v-model="form.overdueDays" placeholder="">
            <template slot="prepend">{{ form.overdueKey }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Urgent days" prop="urgentDays">
          <el-input :disabled="form.urgentKey==null" v-model="form.urgentDays" placeholder="">
            <template slot="prepend">{{ form.urgentKey }}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTaskSetting, updateTaskSetting, deleteTaskSetting, getTaskSetting, getTaskSettingPage, exportTaskSettingExcel } from "@/api/system/taskSetting";
import {
  listDept,
} from "@/api/system/dept";
export default {
  name: "TaskSetting",
  components: {
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
      // system task settings列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      options:[
        {label:'OHA',value:'OHA'},
        {label:'Buyer',value:'Buyer'},
        {label:'Seller',value:'Seller'},
      ],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        partyRole: null,
        taskName: null,
        createTime: [],
        seq: null,
        viewPartyRole: null,
        overdueDays: null,
        overdueKey: null,
        urgentDays: null,
        urgentKey: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      height:'',
      partyMap:{}
    };
  },
  created() {
    this.getList();
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 265 + "px";
  },
  methods: {
    listDept(ids){
      listDept({ids:ids}).then((res)=>{

        for(var i=0;i<res.data.length;i++){
          this.$set(this.partyMap,res.data[i].id+'',res.data[i].name)
        }
        console.log(this.partyMap)
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getTaskSettingPage(this.queryParams).then(response => {
        this.list = response.data.list;
        var ids=[]
        for(var i=0;i<this.list.length;i++){
          if(this.list.type=="2"){
            ids.push(this.list[i].partyRole)
            ids.push(this.list[i].viewPartyRole)
          }
        }
        this.listDept(ids)
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
        partyRole: undefined,
        taskName: undefined,
        seq: undefined,
        viewPartyRole: undefined,
        overdueDays: undefined,
        overdueKey: undefined,
        urgentDays: undefined,
        urgentKey: undefined,
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
      this.title = "system task settings";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getTaskSetting(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "Update system task settings";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateTaskSetting(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createTaskSetting(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除system task settings编号为"' + id + '"的数据项?').then(function() {
          return deleteTaskSetting(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有system task settings数据项?').then(() => {
          this.exportLoading = true;
          return exportTaskSettingExcel(params);
        }).then(response => {
          this.$download.excel(response, 'system task settings.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
