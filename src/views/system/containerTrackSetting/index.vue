<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="" prop="carrier">
        <el-select filterable placeholder="Carrier" v-model="queryParams.carrier" clearable>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'"
                    :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"  ></i></el-button>
      </el-form-item>
      <el-form-item style="background-color: transparent">
        <el-button @click="handleAdd"  type="primary" plain>Create<i class="el-icon-plus el-icon--right"  v-hasPermi="['system:container-track-setting:create']"></i></el-button>
      </el-form-item>
    </el-form>


    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <!-- <el-table-column label="Carrier Code" align="center" prop="carrier" /> -->
      <el-table-column label="Carrier" align="center" prop="carrier" />
      <!-- <el-table-column label="POD Code" align="center" prop="pod" /> -->
      <el-table-column label="Contract Number" align="center" prop="contract" />
      <el-table-column label="POD" align="center" prop="pod" />
      <el-table-column label="Free demurrage(Days)" align="center" prop="freeDemurrage" />
      <el-table-column label="Free detention(Days)" align="center" prop="freeDetention" />
      <el-table-column label="Free storage(Days)" align="center" prop="freeStorage" />
      <el-table-column label="Combined free(Days)" align="center" prop="combinedFree" />
      <el-table-column label="Create time" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:container-track-setting:update']">{{ $t('search.modify') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:container-track-setting:delete']">{{ $t('search.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form :show-message="false" ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item required label="Carrier" prop="carrier">
        <el-select filterable placeholder="Carrier" v-model="form.carrier" clearable>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'"
                    :value="dict.value" />
        </el-select>
      </el-form-item>
              <el-form-item required label="Contract Number" prop="contract">
                <el-input v-model="form.contract" placeholder="Contract" />
              </el-form-item>
        <el-form-item required label="POD" prop="pod">
            <el-select  filterable placeholder="POD" v-model="form.pod" clearable>
               <el-option v-for="dict in podList" :key="dict.code" :label="dict.name+' ('+dict.code+')'"  :value="dict.code" />
             </el-select>
        </el-form-item>

        <el-form-item required label="Free Demurrage" prop="freeDemurrage">
          <el-input type="number" v-model="form.freeDemurrage" placeholder="Free Demurrage(Days)" />
        </el-form-item>
        <el-form-item required label="Free Detention" prop="freeDetention">
          <el-input type="number" v-model="form.freeDetention" placeholder="Free Detention(Days)" />
        </el-form-item>
                        <el-form-item label="Combined free" prop="combinedFree">
                          <el-input type="number" v-model="form.combinedFree" placeholder="Combined free(Days)" />
                        </el-form-item>
        <el-form-item required label="Free Storage" prop="freeStorage">
          <el-input type="number" v-model="form.freeStorage" placeholder="Free Storage(Days)" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini"  type="primary" @click="submitForm">Submit</el-button>
        <el-button size="mini"  @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createContainerTrackSetting, updateContainerTrackSetting, deleteContainerTrackSetting, getContainerTrackSetting, getContainerTrackSettingPage, exportContainerTrackSettingExcel } from "@/api/system/containerTrackSetting";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getOriginDeliveryList } from "@/api/system/originDelivery";

export default {
  name: "ContainerTrackSetting",
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
      // system_traking_setting列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        carrier: null,
        pod: null,
        freeDemurrage: null,
        freeDetention: null,
        freeStorage: null,
        combinedFree: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      carriers:[],
      podList:[],
    };
  },
  created() {
    this.remoteMethodCarriers();
    this.getPortList()
  },
  methods: {
  getPortList() {
      getOriginDeliveryList().then((response) => {
        this.podList = response.data;
        console.log(this.podList)
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getContainerTrackSettingPage(this.queryParams).then(response => {
        for (var temp of response.data.list) {
            var carriers = this.carriers.filter(item => {
              return item.value===temp.carrier;
            });
            if(carriers.length>0) {
              temp.carrierStr = carriers[0].label;
            }
            var pods = this.podList.filter(item => {
              console.log(item)
              return item.code===temp.pod;
            });
            if(pods.length>0) {
              temp.podStr = pods[0].name;
            }
        }
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
        carrier: undefined,
        pod: undefined,
        freeDemurrage: undefined,
        freeDetention: undefined,
        freeStorage: undefined,
        combinedFree: undefined,
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
      getContainerTrackSetting(id).then(response => {
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
        // 修改的提交
        if (this.form.id != null) {
          updateContainerTrackSetting(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createContainerTrackSetting(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('Delete id:"' + id + '"?').then(function() {
          return deleteContainerTrackSetting(id);
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
      this.$modal.confirm('Confirm the export of all data items?').then(() => {
          this.exportLoading = true;
          return exportContainerTrackSettingExcel(params);
        }).then(response => {
          this.$download.excel(response, 'Destination_Configuration.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    },
    remoteMethodCarriers() {
        this.carriers = [];
        this.carriers = getDictDatas(DICT_TYPE.CARRIER);
        this.getOriginDeliveryList();
    },
    getOriginDeliveryList(){
        this.getList();
    },


  }
};
</script>
