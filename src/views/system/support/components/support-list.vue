<template>
  <div class="app-container" style="width:95%;margin:0 auto;">
    <el-card style="padding: 20px;">
      <el-form :model="queryParams" style="margin-bottom: 10px;">
        <div style='float:left; width: 190px; padding-right: 10px; '>
          <el-input v-model="queryParams.reference" placeholder="Reference"
                    autocomplete="off" @change="queryParams.pageNo = 1 ,getPage()"
                    clearable >
          </el-input>
        </div>
        <div style='float:left; width: 140px; padding-right: 10px;'>
          <el-select v-model="queryParams.status" clearable placeholder="Status"
                     @change="queryParams.pageNo = 1 ,getPage()">
            <el-option v-for="(item, index) in statusList"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style='float:left; width: 130px; padding-right: 10px;'>
          <el-select v-model="queryParams.requestType" clearable placeholder="Priority"
                     @change="queryParams.pageNo = 1 ,getPage()">
            <el-option label="Critical" value="Critical"></el-option>
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </div>
        <div style='float:left; width: 200px; padding-right: 10px;'>
          <el-select v-model="queryParams.category" clearable placeholder="Module" @change="queryParams.pageNo = 1 ,getPage()">
            <el-option label="User Management" value="User Management"></el-option>
            <el-option label="Order Management" value="Order Management"></el-option>
            <el-option label="Destination Management" value="Destination Management"></el-option>
            <el-option label="Shipper Booking" value="Shipper Booking"></el-option>
            <el-option label="Carrier Booking" value="Carrier Booking"></el-option>
            <el-option label="BI" value="BI"></el-option>
            <el-option label="Others" value="Others"></el-option>
          </el-select>
        </div>
        <div style='float:left; width: 180px; padding-right: 10px; '>
          <el-input v-model="queryParams.summary" placeholder="Summary"
                    autocomplete="off" @change="queryParams.pageNo = 1 ,getPage()"
                    clearable >
          </el-input>
        </div>
<!--        <div style='float:left; width: 150px; padding-right: 10px; '>-->
<!--          <el-input v-model="queryParams.requestDetail" placeholder="RequestDetail"-->
<!--                    autocomplete="off" @change="queryParams.pageNo = 1 ,getPage()"-->
<!--                    clearable >-->
<!--          </el-input>-->
<!--        </div>-->
        <div style='float:left; width: 160px; padding-right: 10px; '>
          <el-input v-model="queryParams.requester" placeholder="Requester"
                    autocomplete="off" @change="queryParams.pageNo = 1 ,getPage()"
                    clearable >
          </el-input>
        </div>
        <el-button @click="queryParams.pageNo = 1 ,getPage()" >Search</el-button>
        <el-button @click="getList" >Clear All</el-button>
        <el-button @click="Download" :loading="downloadLoading" :disabled = "tableData.length === 0" >Download</el-button>

      </el-form>
      <el-table v-loading="tableLoading" :data="tableData" height="550px" style="width: 100%">
        <el-table-column
          label="Status"
          min-width="100"
          prop="status">
          <template v-slot="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Priority"
          min-width="100"
          prop="requestType">
        </el-table-column>
        <el-table-column label="Reference" min-width="150" prop="reference" show-overflow-tooltip>
          <template v-slot="scope">
            <span @click="detail(scope.row)" class="reference-link">{{scope.row.reference}}</span>
            <el-button @click="queryParams.reference = scope.row.reference" size="mini" type="text">Copy</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="Module"
          min-width="150" prop="category"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="Requester"
          min-width="160" prop="requester"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="Request Date"
          min-width="160" prop="createTime"
          show-overflow-tooltip>
          <template v-slot="scope">
            {{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
          </template>
        </el-table-column>
        <el-table-column
          label="Summary" min-width="180"
          prop="summary"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="allowedUserId.includes(userId)"
          label="Action" min-width="140">
          <template v-slot="{ row }">
            <el-button size="small" :loading="solveOrRejectButLoading" @click="solveOrReject(row, 'solve')" type="success" :disabled="!(row.status === '1' || row.status === '0')">Solve</el-button>
            <el-button size="small" :loading="solveOrRejectButLoading"  @click="solveOrReject(row, 'reject')" type="danger" :disabled="!(row.status === '1' || row.status === '0')">Reject</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNo" :total="queryParams.total"
                  @pagination="getPage"/>
    </el-card>
    <el-dialog title="Detail" :visible.sync="detailDialogFormVisible" width="80%">
      <el-row>
        <el-col :span="12" style="padding: 0px 40px 0px 20px;">
          <el-form disabled :model="detailForm" label-width="130px">

            <el-form-item label="Module">
              <el-select v-model="detailForm.category" placeholder="Module">
              </el-select>
            </el-form-item>

            <el-form-item label="Summary">
              <el-input v-model="detailForm.summary" placeholder="Summary" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Request Detail">
              <el-input class="requestDetail-text"
                        :rows="10" v-model="detailForm.requestDetail" type="textarea" placeholder="Request Detail"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Request Type">
              <el-select v-model="detailForm.requestType" placeholder="Request Type">
                <el-option label="General" value="General"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="max-height: 200px; overflow: auto;">
            <document-preview :ticket-files="ticketFiles"></document-preview>
          </div>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #ddd;padding: 0px 20px;" v-loading="detailLoading">
          <template>
            <el-timeline style="min-height: 400px; max-height: 500px;overflow: auto;">
              <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                                v-if="item.type !== 'PROCESS_CC'"
                                :color="activityColor(item.result, item.type)"
                                size="large"   type="primary"
                                :icon="activityIcon(item.result, item.type)"
                                :timestamp="((item.userName == 'null' )? detailForm.createUserName :  item.userName ) + ' - '+item.date  " placement="top">
                <el-card style="padding: 15px;">
                  <span class="timeline-type">  {{activityType(item.type)}} </span>
                  <div v-if=" item.type === 'START_PROCESS_INSTANCE'">
                    <p>{{detailForm.summary}}</p>
                    <br>
                    <p>{{detailForm.requestDetail}}</p>
                  </div>
                  <!-- 钉钉最后有一个自动同意的流程， 这里转换成 Finish -->
                  <div v-else-if=" item.userName == 'bpms_system'">
                    <p>Finish</p>
                  </div>
                  <p v-else v-html="convertRemarkToHtml(item.remark)"> </p>
                  <el-image v-for="(img, index) in item.images" :key="index" :src="img"
                    alt="Request Detail Image"  :preview-src-list="[img]"
                    style="width: auto; height: 100px" />
                    <!-- 附件下载列表 -->
                    <div class="ticket-attachments-list" v-if="item.attachments && item.attachments.length">
                      <ul>
                        <li v-for="(attach, index) in item.attachments" :key="index">
                          <a @click="downloadFile($event, attach.fileId, attach.fileName, detailForm.id)"
                            href="#"
                            :download="attach.fileName"
                            class="ticket-attachment-link"
                          >
                            <!-- 显示文件名和大小（可选） -->
                            {{ attach.fileName }} ({{ formatFileSize(attach.fileSize) }})
                          </a>
                        </li>
                      </ul>
                    </div>

                </el-card>
              </el-timeline-item>
            </el-timeline>
          </template><!-- 只有自己提单子时才会显示 -->
          <div v-if="showAddBtu" class="comment-text">
            <el-input type="textarea" :rows="6" v-model="comment" style="padding: 10px 0px;" placeholder="Add Remark"/>
            <br/>
            <p style="padding-top: 10px;">
              <el-button type="primary" :loading="butLoading" @click="updateForm" >Submit</el-button>
            </p>

            <!-- <div style="border: 1px solid #ccc;">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 260px; overflow-y: hidden;"
                    v-model="html"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                />
            </div> -->
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.item-zy-css .el-form-item__label {
  background-color: #f5f7fa !important;
  position: absolute !important;
}

.tip-css {
  margin-top: -7px;
  margin-bottom: 10px;
  color: #909399;
  font-size: 13px;
}

.el-timeline-item__content {
  padding-right: 10px;
}

.timeline-type {
  float: right;
  margin-top: -10px;
  color: #909399;
  font-size: 13px;
}

.comment-text {
  padding-right: 20px;
  padding-left: 50px;
  padding-top: 10px;
}

.requestDetail-text textarea.el-textarea__inner {
  font-size: 14px !important;
  color: unset !important;
}
.reference-link {
  color: #004F7C;
  font-size: 12px;
  cursor: pointer;
  user-select: text;
  padding-right: 8px;
}
.reference-link:hover {
  color: #004F7C;
  font-size: 12px;
  text-decoration: underline;
}
</style>
<script>
import {
  downloadAllSupportTicketExcel,
  getAllSupportTicketPage, getOneSupportTicketList,
  getSupportTicket, getTicketFilesById, handelSolveOrReject, downloadAttachment,addRemarksById
} from "@/api/system/supportTicket";
import documentPreview from "@/views/system/support/components/document-preview.vue";

export default {
  name: "support-list",
  components: {documentPreview},
  data() {
    return {
      allowedUserId: [],//按钮允许操作的用户id
      solveOrRejectButLoading: false,
      ticketFiles:[],
      //保存钉钉处理流程
      detailRemarkList:[],
      detailDialogFormVisible: false,
      detailLoading: false,
      detailForm: {},
      downloadLoading: false,
      statusList: [
        {"label": "Submitted", "value": "0"},
        {"label": "In process", "value": "1"},
        {"label": "Rejected", "value": "2"},
        {"label": "Solved", "value": "3"}
      ],
      tableLoading: false,
      tableData: [],
      queryParams: {
        summary: null,
        requester: null,
        requestDetail: null,
        reference: null,
        status: null,
        requestType: null,
        category: null,
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      userId: null,//能够操作和显示solve和reject按钮的用户id
      comment: '',
      showAddBtu:false
    };
  },
  created() {
    //benny生产环境的userId = 227
    this.userId = this.$store.getters.userId;
    this.allowedUserId.push(227);
    console.log('允许操作的用户Id', this.allowedUserId)
    console.log('当前用户Id',this.userId)
  },
  mounted() {
    this.getList();
  },
  methods: {
    async downloadFile(event, fileId, fileName, id) {
        // 阻止 <a> 标签的默认行为（即下载 href="#" 的内容）
        event.preventDefault();
      try {
        // 1.  调用工具函数请求文件流
        const blob = await downloadAttachment(fileId, fileName, id);

        // 2. 触发文件下载（核心：将blob转为可下载文件）
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // 强制指定文件名
        document.body.appendChild(a);
        a.click();

        // 3. 清理资源
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // 4. 显示成功提示
        this.$modal.msgSuccess("Downloaded successfully");
      } catch (error) {
        // 5. 错误处理
        console.error('下载失败:', error);
        this.$modal.msgError("Download failed. Please try again.");
      }
    },
      // 格式化文件大小（字节 -> KB/MB）
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    getStatusLabel(value) {
      const statusItem = this.statusList.find(item => item.value == value);
      return statusItem ? statusItem.label : 'Error';
    },
    getStatusType(value) {
      switch (value) {
        case '0':
          return '';
        case '1':
          return 'warning';
        case '2':
          return 'danger';
        case '3':
          return 'success';
        default:
          return 'danger';
      }
    },
    getPage() {
      this.tableLoading = true
      getAllSupportTicketPage(this.queryParams).then((res) => {
        this.tableData = res.data.list
        this.queryParams.total = res.data.total
        this.tableLoading = false
      })
    },
    getList() {
      this.queryParams.summary = null;
      this.queryParams.requestDetail = null;
      this.queryParams.requester = null;
      this.queryParams.reference = null;
      this.queryParams.status = null;
      this.queryParams.requestType = null;
      this.queryParams.category = null;
      this.queryParams.pageNo = 1;
      this.queryParams.pageSize = 20;
      this.queryParams.total = 0;
      this.getPage()
    },
    //将当前表数据导入到excel中
    Download(){
      this.$notify.info('Downloading... Please Wait');
      this.downloadLoading = true
      const ids = this.tableData.map(item => item.id)
      downloadAllSupportTicketExcel(ids).then(response => {
        this.$download.excel(response, 'SmartTicket' + this.parseTimeToZ2(new Date()) + '.xlsx')
        this.downloadLoading = false;
        this.$notify.success('Download Success');
      }).catch(() => {
        this.downloadLoading = false
      });
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}${month}${day}${hours}${minutes}`
    },
    detail(row) {
      console.log('detail', row)
      console.log('detail1', this.userId)
      // creator 是字符串 需要转换成数字
      this.showAddBtu =Number(row.creator) === this.userId
      // this.showAddBtu = row.requester === this.userId
      this.detailDialogFormVisible = true
      this.detailForm = row;
      this.detailRemarkList=[]
      this.detailLoading = true
      this.getTicketFiles(row.id)
      getOneSupportTicketList(row.id).then(response => {
        //去除集合里面status= COMPLETED并且remark=自动同意的项
        this.detailRemarkList = response.data.filter(item => {
          // 排除：status是COMPLETED 且 remark是自动同意 的项
          return !(item.status === 'COMPLETED' && item.remark === '自动同意');
        });
        this.detailLoading = false
      });
    },
    activityColor(value, type){
      if(type === "START_PROCESS_INSTANCE"){
        return '#0bbd87';
      }
      switch (value) {
        case 'NONE':
          return '#E6A23C';
        case 'REFUSE':
          return '#F56C6C';
        case 'AGREE':
          return '#0bbd87';
        default:
          return '#E6A23C';
      }
    },
    activityIcon(value, type){
      if(type === "START_PROCESS_INSTANCE"){
        return 'el-icon-check';
      }
      switch (value) {
        case 'NONE':
          return 'el-icon-more';
        case 'REFUSE':
          return 'el-icon-close';
        case 'AGREE':
          return 'el-icon-check';
        default:
          return '';
      }
    },
    convertRemarkToHtml(val){
      if(val){
          // 正则匹配 [名称](id) 格式，捕获名称部分
          const regex = /\[([^\]]+)\]\([^\)]+\)/g;
          return val.replace(/\n/g, '<br>').replace(regex, ' @$1');
      }
    },
    //根据id查询附件
    getTicketFiles(id){
      if(id != null){
        getTicketFilesById(id).then((res) => {
          if(res.data){
            this.ticketFiles = res.data
          }
        });
      }
    },
    activityType(value){
      switch (value) {
        case 'IN_TASK_NORMAL':
          return 'In progress';
        case 'EXECUTE_TASK_NORMAL':
          return 'Done';
        case 'ADD_REMARK':
          return 'Add remark';
        case 'START_PROCESS_INSTANCE':
          return 'Begin';
        case 'REDIRECT_TASK':
          return 'Transfer task';
        default:
          return '';
      }
    },
    solveOrReject(row, type){
      if(!this.allowedUserId.includes(this.userId)){
        return;
      }
      if(!(row.status === '1' || row.status === '0')){
        return;
      }
      this.solveOrRejectButLoading = true
      handelSolveOrReject(row.id, type).then(()=>{
        this.solveOrRejectButLoading = false;
        this.getList();
      }).catch(
        () => {
          this.solveOrRejectButLoading = false;
        }
      )
    },
    updateForm(){
        if(!this.comment){
            this.$modal.msgWarning("Remarks cannot be empty");
        }
        var data = {
          requestDetail: this.comment,
          id: this.detailForm.id,
          instanceId: this.detailForm.instanceId,
        }
        this.detailLoading = true
        this.butLoading = true
        addRemarksById(data).then(res=>{
          if(res.data){
            this.$modal.msgSuccess("Success");
            this.comment = null
          }
            this.butLoading = false
            this.detail(this.detailForm)

        })
      },

  },
};
</script>
