<template>
  <div class="app-container">

    <el-card class="box-card"  style="  margin-bottom: 10px;">
      <!-- 搜索工作栏 -->
      <el-row :gutter="20" style=" padding-left: 15px;  padding-bottom: 10px;   padding-top: 15px;">
        <el-col :span="4"  v-if="!currentUser" >
          <el-input clearable @clear="customerRequest()" placeholder="Shipment Ref"
                    @blur="queryApproval.bookingNumber = $event.target.value.trim()"
                    v-model="queryApproval.bookingNumber">

          </el-input>
        </el-col>
        <el-col :span="4"   >
          <el-input clearable @clear="customerRequest()" placeholder="SO Ref"
                    @blur="queryApproval.soRef = $event.target.value.trim()"
                    v-model="queryApproval.soRef">

          </el-input>
        </el-col>
        <el-col :span="4"   >
          <el-select v-model="queryApproval.status" clearable  placeholder="Status">
            <el-option label="Request" value="0"></el-option>
            <el-option label="In process" value="1"></el-option>
            <el-option label="Completed" value="2"></el-option>
            <el-option label="Rejected" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button style=" margin-left: 20px;" type="primary" icon="el-icon-search" @click="customerRequest">Search
          </el-button>
        </el-col>

      </el-row>
    </el-card>



      <div >

      <el-card class="box-card" :style="{ 'min-height': (tableHeight)+'px' }">
      <el-empty v-if="approvalData.length == 0 && !showApprovalLoading" description="No Data"></el-empty>
      <el-table
        :data="approvalData"
        v-if="approvalData.length > 0"
        v-loading="showApprovalLoading"
        :max-height="tableHeight"
        style="width: 100%; padding: 10px;">
        <el-table-column  v-if="!currentUser"
                          prop="bookingNumber"
          label="Shipment Ref"  width="170px">
          <template v-slot="scope">
            <el-link type="primary" style="margin-top: -1px;" target="_blank" :href="'/shipment/detail?id='+scope.row.shipmentId">
              {{ scope.row.bookingNumber }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="soRef"
          label="SO Ref"  width="170px">
          <template v-slot="scope">
<el-link v-show="scope.row.fromShipperBooking" type="primary" style="margin-top: -1px;" target="_blank"
  :href="'/shipment/ppshippingOrderDetail?id='+scope.row.soId">
  {{ scope.row.soRef }}
</el-link>
            <el-link v-show="!scope.row.fromShipperBooking"  type="primary" style="margin-top: -1px;" target="_blank" :href="'/shipment/shippingBookingDetail?id='+scope.row.soId">
              {{ scope.row.soRef }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status"  width="100px">
          <template v-slot="scope">
            <el-tag :type="scope.row.status ==2 ?'success': scope.row.status == 3 ? 'danger' :'warning'">
              {{ approvalStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="Create Date"  width="100px">
          <template v-slot="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id" show-overflow-tooltip
          label="Messages"  min-width="200px">
          <template v-slot="scope">
            <div @click="handleViewData(scope.row)" style="max-height:30px;"
                 v-html="filteredHtml(scope.row.approvalRecordDOList[scope.row.approvalRecordDOList.length-1].remark)">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Operation"
          align="center"
          width="250"
          v-if="!currentUser"
          class-name="small-padding fixed-width"
        >
          <template v-slot="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-play"
              :disabled="scope.row.status >= 2"
              @click="handleGo(scope.row.shipmentId, scope.row.id)"
            >Start Task</el-button>

            <el-button
              size="mini"
              type="text"
              icon="el-icon-check"
              :disabled="scope.row.status > 1"
              @click="showRemark(scope.row, 2)"
            >Completed</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              :disabled="scope.row.status > 1"
              @click="showRemark(scope.row, 3)"
            >Reject</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
      </div>
      <pagination
        v-show="approvalTotal > 0"
        :total="approvalTotal"
        :page.sync="queryApproval.pageNo"
        :limit.sync="queryApproval.pageSize"
        :page-sizes="[10, 20, 50]"
        @pagination="customerRequest"
      />

    <!-- 对话框(amend) -->
    <el-dialog :title="titleAmend" :visible.sync="amendShippingShow" width="75%" append-to-body>
      <template>
        <el-timeline style="min-height: 330px; max-height: 400px;overflow: auto;" v-if="detailRemarkList.length > 0">

          <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                            :color="activityColor(item.status )"
                            size="large"   type="primary"
                            :icon="activityIcon(item.status )"
                            :timestamp="item.creator + ' - '+ parseTime(item.createTime) " placement="top">
            <el-card style="padding: 15px;">
              <span class="timeline-type">  {{activityType(item.status)}} </span>
              <p v-html="convertRemarkToHtml(item.remark)"> </p>
            </el-card>
          </el-timeline-item>

        </el-timeline>
      </template>
      <el-divider></el-divider>
      <div style="border: 1px solid #ccc;    padding-top: 10px;" v-if="showSubmit" >
<!--        <Toolbar-->
<!--          style="border-bottom: 1px solid #ccc"-->
<!--          :editor="editor"-->
<!--          :defaultConfig="toolbarConfig"-->
<!--          :mode="mode"-->
<!--        />-->
        <Editor
          style="height: 180px; overflow-y: hidden;"
          v-model="amendShippingText"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
      <div v-if="showSubmit" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRemark()">{{
          $t("purchaseOrder.confirm")
          }}</el-button>
      </div>
    </el-dialog>

  </div>
  </template>


<style src="@wangeditor/editor/dist/css/style.css"></style>

<script>

  import { getApprovalInfoPage, getApprovalInfoNum, updateStatus ,getCurrentUserApprovalInfoPage } from "@/api/shipping/approvalInfo";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { i18nChangeLanguage } from '@wangeditor/editor';
    export default {
      name: "customerRequest",
      components: {  Editor, Toolbar},
      props: [],
      data () {
        return {

          editor: null,
          toolbarConfig: {
            excludeKeys:[
              'lineHeight',
              'fontFamily',
              'fontSize',
              'headerSelect',
              'codeBlock'
            ]
          },
          editorConfig: { placeholder: 'Remark...',
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
          showApprovalVisible: false,
          showApprovalLoading: false,
          approvalTotal: 0,
          approvalData : [],
          queryApproval:{
            id: '',
            pageSize:10,
            pageNo:1,
            showAll: null,
            bookingNumber:'',
            soRef:'',
            status: null,
          },
          amendShippingText:'',
          amendShippingShow:false,
          tableHeight:'',
          tempId: null,
          tempStatus: null,
          showSubmit: false,
          titleAmend: 'Messages',
          currentUser:false,
          detailRemarkList:[],
        };
      },
      created () {
        this.calcTableHeight()
        var status = this.$route.query.status;
        if(status != ''){
          this.queryApproval.status  = status
        }
        var id = this.$route.query.id;
        if(id != ''){
          this.queryApproval.id  = id
        }
        if(this.$auth.hasPermi("shipment:customerRequest-currentUser")){
          this.currentUser = true
        }
        if(this.$auth.hasPermi("shipment:customerRequest")){
          this.currentUser = false
        }
        this.customerRequest()
      },
      methods: {
        filteredHtml(val){
            var text = val.replace(/<\/?img[^>]*>/gi, '').replace(/<\/?video[^>]*>/gi, '')
            return text
        },
        convertRemarkToHtml(val){
          if(val){
            return val.replace(/\n/g, '<br>');
          }
        },
        activityType(value){
          switch (value) {
            case 1:
              return 'In progress';
            case 2:
              return 'Done';
            case 3:
              return 'Rejected';
            case 0:
              return 'Begin';
            case 'REDIRECT_TASK':
              return 'Transfer task';
            default:
              return '';
          }
        },
        activityIcon(value){
          switch (value) {
            case 1:
              return 'el-icon-more';
            case 3:
              return 'el-icon-close';
            case 2:
              return 'el-icon-check';
            default:
              return '';
          }
        },
        activityColor(value ){
          switch (value) {
            case 0:
              return '#E6A23C';
            case 3:
              return '#F56C6C';
            case 2:
              return '#0bbd87';
            default:
              return '#E6A23C';
          }
        },
        changeStatus(id, statusVal, showMsg){
          this.showApprovalLoading = true
          var req = {
            id: id,
            status: statusVal,
            remark: this.amendShippingText
          }
          updateStatus(req).then(res =>{
            if(showMsg){
              this.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              });
            }
            this.customerRequest()
            this.showApprovalLoading = false
          })
        },
        submitRemark(){
          this.changeStatus(this.tempId, this.tempStatus, true)
          this.showSubmit = false
          this.amendShippingShow = false
        },
        showRemark(row, status){
          this.titleAmend = 'Request Detail'
          this.handleViewData(row)
          this.tempId = row.id
          this.tempStatus = status
          this.showSubmit = true
          this.amendShippingText = ''
        },
        handleGo(sid, id){
           this.amendShippingText = ''
           this.changeStatus(id, 1 ,false)
           const url = this.$router.resolve({
            path: "/shipment/detail"
          }).href;
          window.open(url+'?id='+sid , '_blank');
        },
        calcTableHeight() {
          const clientHeight = document.documentElement.clientHeight;
          this.tableHeight = clientHeight - 330;
        },
        onCreated(editor) {
          i18nChangeLanguage('en')
          this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        handleViewData(row){
          this.amendShippingShow = true
          this.showSubmit = false
          if(row){
            this.amendShippingText = row.approvalRecordDOList[0].remark
            this.detailRemarkList = row.approvalRecordDOList
          }
        },
        approvalStatus(status){
          if(status == 0){
            return 'Request';
          }else if(status == 1){
            return 'In process';
          }else if(status == 2){
            return 'Completed';
          }else if(status == 3){
            return 'Rejected';
          }
        },
        customerRequest(){
          this.showApprovalLoading = true
          if(this.currentUser){
            getCurrentUserApprovalInfoPage(this.queryApproval).then(res =>{
              this.approvalTotal = res.data.total
              this.approvalData = res.data.list
              this.showApprovalLoading = false
            })
          }else{
            getApprovalInfoPage(this.queryApproval).then(res =>{
              this.approvalTotal = res.data.total
              this.approvalData = res.data.list
              this.showApprovalLoading = false
            })
          }
          this.queryApproval.id = null
        },

      },
    };
  </script>
