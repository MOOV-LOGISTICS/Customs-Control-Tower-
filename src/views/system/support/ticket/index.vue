<template>
  <div class="app-container" style="width:90%;margin:0 auto;">
    <el-card style="padding: 20px;">
      <el-form :model="queryParams" style="margin-bottom: 10px;">
        <el-button @click="addTicket">New</el-button>
        <el-button @click="Download" :loading="downloadLoading" :disabled = "tableData.length === 0">Download</el-button>
        <div style='float:right; width: 200px; padding-left: 10px; '>
          <el-input v-model="queryParams.reference" placeholder="Reference"
                    autocomplete="off" @change="queryParams.pageNo = 1 ,getPage()"
                    clearable @clear="clearReference">
          </el-input>
        </div>

<div style='float:right; width: 200px; padding-left: 10px;'>
  <el-select v-model="queryParams.flag" @change="queryParams.pageNo = 1 ,getPage()" placeholder="Flag" clearable>
    <el-option label="True" value="True"></el-option>
    <el-option label="False" value="False"></el-option>
  </el-select>
</div>


        <div style='float:right; width: 200px; padding-left: 10px;'>
          <el-select v-model="queryParams.status"
                     @change="queryParams.pageNo = 1 ,getPage()" placeholder="Status" clearable>
            <el-option v-for="(item, index) in statusList"
                       :key="index + 'Status'"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style='float:right; width: 200px; padding-left: 10px;'>
          <el-select v-model="queryParams.requestType"
                     @change="queryParams.pageNo = 1 ,getPage()" placeholder="Priority" clearable>
            <el-option label="Critical" value="Critical"></el-option>
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </div>
      </el-form>
      <el-table
        :height="height"
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%">

        <!-- v-hasPermi="['ticket:edit:flag']" -->
<el-table-column  prop="flag" label="" min-width="50">
  <template v-slot="scope">
    <svg v-show="!scope.row.flag" @click="handleFlagChange(scope.row)" style="
                            cursor: pointer;
                            width: 20px;
                            height: 20px;
                          " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
        d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" fill="#FFF"
        d="M12 6v16l28-8-28-8Z" />
    </svg>
    <svg v-show="scope.row.flag" @click="handleFlagChange(scope.row)" style="
                            cursor: pointer;
                            width: 20px;
                            height: 20px;
                          " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000"
        d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" fill="#fe5000"
        d="M12 6v16l28-8-28-8Z" />
    </svg>


    <!-- <el-switch v-model="scope.row.flag" :active-value="true" :inactive-value="false" @change="handleFlagChange(scope.row)" /> -->
  </template>
</el-table-column>


        <el-table-column
          prop="status"
          label="Status"
          min-width="100">
          <template v-slot="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestType"
          label="Priority"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="reference"
          label="Reference" show-overflow-tooltip
          min-width="150">
          <template v-slot="scope">
            <span @click="detail(scope.row)" class="reference-link">{{scope.row.reference}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          min-width="150" show-overflow-tooltip
          label="Module">
        </el-table-column>
        <el-table-column
          prop="requester"
          min-width="160" show-overflow-tooltip
          label="Requester">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="160" show-overflow-tooltip
          label="Request Date">
          <template v-slot="scope">
            {{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="summary" show-overflow-tooltip
          min-width="180"
          label="Summary">
        </el-table-column>

      </el-table>
      <pagination :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
    </el-card>

    <el-dialog title="Create New Request" :visible.sync="dialogFormVisible" width="700px">
      <el-form :show-message="false" :model="form" ref="form" label-width="130px">

        <el-form-item label="Module" prop="category" required  class="item-zy-css">
          <el-select v-model="form.category" placeholder="Module" filterable>
            <el-option label="User Management" value="User Management"></el-option>
            <el-option label="Order Management" value="Order Management"></el-option>
            <el-option label="Destination Management" value="Destination Management"></el-option>
            <el-option label="Shipper Booking" value="Shipper Booking"></el-option>
            <el-option label="Carrier Booking" value="Carrier Booking"></el-option>
            <el-option label="BI" value="BI"></el-option>
            <el-option label="Others" value="Others"></el-option>
          </el-select>
        </el-form-item>

        <p class="tip-css">Request for which function</p>

        <el-form-item label="Summary" prop="summary" required  class="item-zy-css">
          <el-input v-model="form.summary" placeholder="Summary" autocomplete="off"></el-input>
        </el-form-item>
        <p class="tip-css">Request key points</p>

        <el-form-item label="Request Detail" prop="requestDetail" required  class="item-zy-css">
          <el-input :rows="10" v-model="form.requestDetail" type="textarea" placeholder="Request Detail"
                    autocomplete="off"></el-input>
        </el-form-item>
        <p class="tip-css">Request in details</p>
        <el-form-item label="Attachment"  class="item-zy-css">

          <el-upload
            style="margin: 0 auto;text-align: center;padding-top: 18px;padding-bottom: 10px;"
            ref="uploadDocument" :headers="headers"
            drag
            :file-list="fileList"
            :auto-upload="false"
            :data="form"
            :action="url + '/admin-api/system/support-ticket/create'"
            :on-success="handleFileSuccess"
            :on-remove="handleRemove"
            multiple
            :on-change="handleFileChange"
            :limit="20">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drag the file here or <em>click</em></div>
          </el-upload>
        </el-form-item>
        <p class="tip-css">Upload related files:excel,screenshot,etc</p>

        <el-form-item label="Priority" prop="requestType" required  class="item-zy-css">
          <el-select v-model="form.requestType" placeholder="Priority">
            <el-option label="Critical" value="Critical"></el-option>
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </el-form-item>
        <p class="tip-css">Request Priority</p>
        <el-form-item label="Email" prop="isEmail" class="item-zy-css" >
          <el-radio-group v-model="form.isEmail">
            <el-radio :label="1">yes</el-radio>
            <el-radio :label="0">no</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="butLoading" @click="submitForm">Submit</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Detail" :visible.sync="detailDialogFormVisible" width="80%">
      <el-row>
        <el-col :span="12" style="padding: 0px 40px 0px 20px;">
          <el-form disabled :model="detailForm" label-width="130px">

            <el-form-item label="Module">
              <el-select v-model="detailForm.category" placeholder="Module"></el-select>
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
<!--            <div v-for="item in ticketFiles" style="    margin: 5px;">
              <el-link type="primary" :href="item.url" icon="el-icon-download">{{item.name}}</el-link>
            </div>-->
            <document-preview :ticket-files="ticketFiles"></document-preview>
          </div>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #ddd;padding: 0px 20px;" v-loading="detailLoading">
          <template>
            <el-timeline style="min-height: 400px; max-height: 500px;overflow: auto;">

              <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                                v-if="item.type != 'PROCESS_CC'"
                                :color="activityColor(item.result, item.type)"
                                size="large"   type="primary"
                                :icon="activityIcon(item.result, item.type)"
                                :timestamp="((item.userName == 'null' )? detailForm.createUserName : item.userName ) + ' - '+item.date  " placement="top">
                <el-card style="padding: 15px;">
                  <span class="timeline-type">  {{activityType(item.type)}} </span>
                  <div v-if=" item.type == 'START_PROCESS_INSTANCE'">
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
          </template>
          <div class="comment-text">
            <el-input type="textarea" :rows="6" v-model="comment"  placeholder="Add Remark"/>
            <br/>
            <p>
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
  .item-zy-css .el-form-item__label{
    background-color: #f5f7fa !important;
    position: absolute !important;
  }
  .tip-css{
    margin-top: -7px;
    margin-bottom: 10px;
    color: #909399;
    font-size: 13px;
  }
.el-timeline-item__content {
    padding-right: 10px;
}

.timeline-type{
    float: right;
    margin-top: -10px;
    color: #909399;
    font-size: 13px;
}
.comment-text{
  padding-right: 20px;
  padding-left: 50px;
  padding-top: 10px;
}

.requestDetail-text textarea.el-textarea__inner{
  font-size: 14px !important;
  color: unset !important;
}
.ticket-attachment-link{
  color: #1890ff; /* 蓝色链接色 */
  text-decoration: none;
}
.ticket-attachment-link:hover {
  color: #1890ff; /* 蓝色链接色 */
  text-decoration: underline;
}
.ticket-attachments-list {
  margin: 10px 0;
}
.ticket-attachments-list ul {
  list-style: none;
  padding: 0;
}
.ticket-attachments-list li {
  margin: 5px 0;
}
.reference-link {
  color: #004F7C;
  font-size: 12px;
  cursor: pointer;
  user-select: text;
}
.reference-link:hover {
  color: #004F7C;
  font-size: 12px;
  text-decoration: underline;
}
</style>
<script>
import { createSupportTicket, getSupportTicket,updateSupportTicket, downloadSupportTicketExcel,
  getSupportTicketPage, addRemarksById, getTicketFilesById, downloadAttachment, changeSupportTicketFlag } from "@/api/system/supportTicket";
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getBaseHeader } from "@/utils/request";
import documentPreview from "@/views/system/support/components/document-preview.vue";
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: "InfraRedis",
    mixins: [fileLoadMixin],
    components: { Editor, Toolbar, documentPreview },
    data () {
      return {
        tableLoading: false,
        downloadLoading: false,
        statusList: [{"label":"Submitted","value":"0"},
                      {"label":"In process","value":"1"},
                      {"label":"Rejected","value":"2"},
                      {"label":"Solved","value":"3"}],
        tableData:[],
        height:'',
        headers: getBaseHeader(),
        form:{
          isEmail: 1
        },
        ticketFiles:[],
        detailForm:{

        },
        detailLoading:false,
        comment:'',
        fileList:[],
        dialogFormVisible:false,
        detailDialogFormVisible:false,
        butLoading:false,
        detailRemarkList:[],
        queryParams:{
          reference:null,
          requestType:null,
          status:null,
          flag: null,
          pageNo:1,
          pageSize:20,
          total:0
        },
        editor: null,
        html: '',
        url: null,
        toolbarConfig: { },
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
        mode: 'default'
      };
    },
    mounted(){
      var tid = this.$route.query.tid;
      if(tid){
        this.queryParams.reference = tid
      }
      this.getPage()
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    },
    created () {
      const clientHeight = document.documentElement.clientHeight;
      this.height = clientHeight - 303 + "px";
      this.url = process.env.VUE_APP_BASE_API;
      this.openLoading();
    },
    methods: {
          // flag修改
      handleFlagChange(row) {
        console.log(row)
        row.flag = !row.flag
        changeSupportTicketFlag(row.id, row.flag);

        // let text = row.flag === true ? "Enable Flag" : "Disable Flag";
        // this.$modal
        //   .confirm('Confirm ' + text + '?')
        //   .then(function () {
        //     return changeSupportTicketFlag(row.id, row.flag);
        //   })
        //   .then(() => {
        //     this.$modal.msgSuccess("Success");
        //   })
        //   .catch(function () {
        //     row.status =
        //       row.status === false
        //         ? true
        //         : false;
        //   });
      },
      async downloadFile(event, fileId, fileName, id) {
        // 阻止 <a> 标签的默认行为（即下载 href="#" 的内容）
        event.preventDefault();
        try {
          // 1. 调用工具函数请求文件流
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
      handleRemove(file,fileList){
        this.fileList = fileList
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
      handleFileSuccess(response, file, fileList) {
        if (response.code !== 0) {
          this.$modal.msgError(response.msg);
          return;
        }
        if(this.$refs.uploadDocument){
          this.$refs.uploadDocument.clearFiles();
        }

      },
      clearReference(){
        console.log('clearReference')
        this.queryParams.reference = null;
        this.$router.push("/support/ticket");
        this.getPage();
      },
      convertRemarkToHtml(val){
        if(val){
          // 正则匹配 [名称](id) 格式，捕获名称部分
          const regex = /\[([^\]]+)\]\([^\)]+\)/g;
          return val.replace(/\n/g, '<br>').replace(regex, ' @$1');
        }
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
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (!valid) {
            return;
          }

          this.butLoading = true
          //this.$refs.uploadDocument.submit();
          let formData = new FormData();
          for (const key in this.form) {
            formData.append(key, this.form[key]);
          }
          this.fileList.map(item => {
            formData.append("file", item.raw);
          });
          formData.append("domainHostname", window.location.hostname);

          createSupportTicket(formData).then(response => {
            this.$modal.msgSuccess("Success");
            this.getPage();
            this.form = {}
            this.butLoading = false
            this.dialogFormVisible=false
          }).catch(error => {
            // 添加异常处理逻辑
            this.butLoading = false;
            this.$modal.msgError(error.message || "Submission failed");
          });

          if(this.$refs.uploadDocument){
            this.$refs.uploadDocument.clearFiles();
          }
          this.fileList = []
        });
      },
      getPage(){
       // 获取当前完整URL
        const currentUrl = window.location.href;
        // 创建URL对象来解析参数
        const urlObj = new URL(currentUrl);
        // 获取查询参数对象
        const params = new URLSearchParams(urlObj.search);
        const referenceNo = params.get('reference');
        if (referenceNo) {
          this.queryParams.reference = referenceNo;
        }
        console.log('URL parameters:',referenceNo)
        this.tableLoading = true
        getSupportTicketPage(this.queryParams).then((res)=>{
          this.tableData=res.data.list
          this.queryParams.total=res.data.total
          this.tableLoading = false
        })
      },
      changeFile(file,fileList){
        this.fileList = fileList
      },
      onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
      detail(row){

        this.detailDialogFormVisible=true
        this.detailForm = row;
        this.detailRemarkList=[]
        this.detailLoading = true
        this.getTicketFiles(row.id)
        getSupportTicket(row.id).then(response => {
          //去除集合里面status= COMPLETED并且remark=自动同意的项
          this.detailRemarkList = response.data.filter(item => {
            // 排除：status是COMPLETED 且 remark是自动同意 的项
            return !(item.status === 'COMPLETED' && item.remark === '自动同意');
          });
          this.detailLoading = false
        });

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
      activityColor(value, type){

        if(type == "START_PROCESS_INSTANCE"){
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
        if(type == "START_PROCESS_INSTANCE"){
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
      addTicket(){
        this.form.isEmail = 1;
        this.dialogFormVisible=true
      },
      //将当前表数据导入到excel中
      Download(){
        this.$notify.info('Downloading... Please Wait');
        this.downloadLoading = true
        const ids = this.tableData.map(item => item.id)
        downloadSupportTicketExcel(ids).then(response => {
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
      getList(){
        this.getPage();
      },
      // 打开加载层
      openLoading () {
        // this.$modal.loading("LOADING...");
      }
    },
  };



</script>
