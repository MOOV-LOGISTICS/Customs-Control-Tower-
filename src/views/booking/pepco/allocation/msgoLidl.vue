<template>

  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Data"  name="first">
        <!-- 搜索工作栏 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">

          <el-form-item label="" prop="bookingNumber">
            <el-input placeholder="Booking Number" v-model="queryParams.bookingNumber"
                      @blur="queryParams.bookingNumber = $event.target.value.trim()" clearable
                      @clear="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleQuery">Search<i
              class="el-icon-search el-icon--right"></i></el-button>
            <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import")
              }}
            </el-button>
          </el-form-item>
        </el-form>

        <el-card class="box-card">
          <!-- 列表 -->
          <el-table v-loading="loading" :data="list" :height="tableHeight"
                    style="padding: 10px 10px 0px 20px; margin-bottom: 10px;">
            <el-table-column show-overflow-tooltip min-width="150" label="BookingNumber" prop="bookingNumber"/>
            <el-table-column show-overflow-tooltip min-width="150" label="ServiceContract" prop="serviceContract"/>
            <el-table-column show-overflow-tooltip min-width="150" label="Origin" prop="origin"/>
            <el-table-column show-overflow-tooltip min-width="150" label="Destination" prop="destination"/>
            <el-table-column show-overflow-tooltip min-width="150" label="RouteCode" prop="routeCode"/>
            <el-table-column show-overflow-tooltip min-width="150" label="WeekNumber" prop="weekNumber"/>
            <el-table-column show-overflow-tooltip min-width="150" label="FFE" prop="efl"/>
            <el-table-column show-overflow-tooltip min-width="150" label="NotConsumedFFE" prop="notConsumedFfe"/>
            <el-table-column show-overflow-tooltip min-width="150" label="OOGFfe" prop="oogFfe"/>
            <el-table-column show-overflow-tooltip min-width="150" label="WeeklyAllocationFFE" prop="weeklyAllocationFfe"/>
            <el-table-column show-overflow-tooltip min-width="150" label="IsActive" prop="isActive"/>

          </el-table>
        </el-card>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                    :page-sizes="[20, 50, 100]"
                    @pagination="getList"/>
      </el-tab-pane>
      <el-tab-pane label="Upload Log"  name="files">

        <!-- 列表 -->
        <el-table v-loading="fileLoading" :data="fileList">
          <el-table-column label="Name" :show-overflow-tooltip="true" align="center" min-width="200px" prop="name">
            <template v-slot="scope">
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       target="_blank"
                       :href="scope.row.url">{{scope.row.name}}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="File Size" align="center" prop="size" min-width="120px" :formatter="sizeFormat"/>
          <el-table-column label="File Type" :show-overflow-tooltip="true" align="center" prop="type" width="180px"/>
          <el-table-column label="Upload Date" align="center" prop="createTime" min-width="170px">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="fileTotal > 0" :total="fileTotal" :page.sync="fileQueryParams.pageNo"
                    :limit.sync="fileQueryParams.pageSize" :page-sizes="[20, 50, 100]"
                    @pagination="getFileList"/>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px"
               append-to-body
               @close="cancelClick" >
      <el-upload v-loading="butLoading" ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                 :action="upload.url" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")}}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm" :disabled="butLoading">{{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="cancelClick">{{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getBaseHeader } from "@/utils/request";
  import {getMsgoLidlPage} from "@/api/bi/report";
  import { getMsgoLidlFilePage } from "@/api/infra/file";

export default {
  name: "allocationLidlFoods",
  components: {},
  data() {
    return{
      fileList:[],
      loading:false,
      list:[],
      activeName: 'first',
      upload: {
        // 是否显示弹出层（）
        open: false,
        // 弹出层标题（）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/system/msgolild-allocation/importLidlFoods",
      },
      butLoading:false,
      errorList:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        poNumbers: null,
      },
      total:0,
      tableHeight: document.documentElement.scrollHeight - 245 + "px",
      fileQueryParams: {
        pageNo: 1,
        pageSize: 20,
      },
      fileLoading:false,
      fileList:[],
      fileTotal:0,

    }
  },
  computed: {
  },
  created() {
    this.getList()
    const clientHeight = document.documentElement.clientHeight;
    this.tableHeight = clientHeight - 350;
  },
	mounted: function() {

	},
	methods: {
    sizeFormat(row, column) {
      const unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const srcSize = parseFloat(row.size);
      const index = Math.floor(Math.log(srcSize) / Math.log(1024));
      let size = srcSize / Math.pow(1024, index);
      size = size.toFixed(2);//保留的小数位数
      return size + ' ' + unitArr[index];
    },
    /** 查询列表 */
    getFileList() {
      this.fileLoading = true;
      // 执行查询
      getMsgoLidlFilePage(this.fileQueryParams).then(response => {
        this.fileList = response.data.list;
        this.fileTotal = response.data.total;
        this.fileLoading = false;
      });
    },
    handleClick(event) {
      if (event.name === "first") {
        this.handleQuery();
      } else if(event.name === 'files'){
        this.fileQueryParams.pageNo = 1;
        this.getFileList();
      }
    },
    computeEtdWeek(data) {
        if (data) {
          var list = data.split('/')
          return list ? list[0] : ''
        }
        return 'error'
    },
	  getList(){
      this.loading = true;
	    getMsgoLidlPage(this.queryParams).then(res=>{
	      this.list = res.data.list
        this.total = res.data.total;
        this.loading = false;
	    })
	  },
    cancelClick(){
      this.upload.open = false
      this.butLoading = false
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      this.butLoading = true
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      this.butLoading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.cancelClick()
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.$modal.msgSuccess("Success");
      this.getList();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "Import";
      this.upload.open = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
	},
  destroyed() {

  }
}
</script>
