<template>
  <div class="app-container">
    <el-card class="wait-task-user-box-card" style="padding-left: 10px;">
      <el-tabs class="maps" v-model="activeName">
        <el-tab-pane label="SOP" name="SOP">
          <!-- 搜索工作栏 -->
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <div style="float: left;padding-top: 10px;">
              <el-row>
                <div style="float: left">
                  <svg @click="handleUpload" style="cursor: pointer;" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                      <path d="M48 0H0V48H48V0Z" fill="#004F7C" />
                    </mask>
                    <g mask="url(#icon-21f8f28d7f10b972)">
                      <path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                </div>
                <div style="float: left"></div>
              </el-row>
            </div>
          </el-form>
          <!-- 列表 -->
          <!-- <el-empty v-if="list.length==0" style="height: tableHeight;" ></el-empty> -->
          <el-table v-loading="loading" :data="list" :height="tableHeight">
            <el-table-column label="SOP Name" align="center" prop="name" />
            <el-table-column label="File" align="center" prop="file" width="180">
              <template v-slot="scope">
                <el-link :href="scope.row.fileUrl" :title="scope.row.fileName" target="_blank">
                  <svg v-show="scope.row.fileUrl" width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M33 41C37.9706 41 42 35 42 35C42 35 37.9706 29 33 29C28.0294 29 24 35 24 35C24 35 28.0294 41 33 41Z" fill="#2F88FF" stroke="#004F7C" stroke-width="4" stroke-linejoin="round" />
                    <path d="M33 37C34.1046 37 35 36.1046 35 35C35 33.8954 34.1046 33 33 33C31.8954 33 31 33.8954 31 35C31 36.1046 31.8954 37 33 37Z" fill="#004F7C" />
                    <path d="M30 4V14H40" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="Update Date" align="center" prop="uploadTime" width="180">
              <template v-slot="scope">
                <span>{{ parseTime(scope.row.uploadTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Hidden" align="center" class-name="small-padding fixed-width">
              <template v-slot="scope">
                <el-switch v-model="scope.row.dohidden" @change="switchChange($event,scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
              <template v-slot="scope">
                <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">Edit</el-button> -->
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">Delete</el-button>
                <!-- v-hasPermi="['syetem:support-file:delete']">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="400px" append-to-body>
      <el-form ref="uploadForm" :show-message="false" size="mini">
        <el-row style="padding: 10px;">
          <el-col :span="7" style="margin-top: 3px;">SOP Name:</el-col>
          <el-col :span="17">
            <el-input v-model="uploadDocument.name" placeholder="SOP Name" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-upload
              ref="uploadDocument"
              :limit="1"
              :headers="uploadDocument.headers"
              multiple
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="false"
              :file-list="uploadDocument.fileList"
              :action="uploadDocument.url + '?type=support_sop&name=' + uploadDocument.name +'&id='+uploadDocument.id+'&file_id='+uploadDocument.fileId  "
              :disabled="uploadDocument.isUploading"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                {{ $t("purchaseOrder.DragTheFileHereOr")
                }}
                <em>{{ $t("purchaseOrder.clickUpload") }}</em>
              </div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
      <!-- :http-request="excelRequest" -->
      <!-- :action="uploadDocument.url + '?type=support_sop&name=' + uploadDocument.name +'&id='+uploadDocument.id+'&file_id='+uploadDocument.fileId  " :disabled="uploadDocument.isUploading" -->

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="uploadDocument.open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.title {
  font-weight: bold;
  padding-right: 10px;
}
.auto-alarm-switch {
  z-index: 9999;
}
</style>

<script>
import { uploadFile, createSupportFile, updateSupportFile, deleteSupportFile, getSupportFile, getSupportFilePage, exportSupportFileExcel } from '@/api/system/supportFile'
import Editor from '@/components/Editor'
import { getBaseHeader } from '@/utils/request'

export default {
  name: 'SOP',
  components: {},
  props: [],
  data() {
    return {
      activeName: 'SOP',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // shipment_hbl列表
      list: [],
      // 是否显示弹出层
      open: false,
      uploadDocument: {
        fileList: [],
        id: '',
        fileId: '',
        name: '',
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Create SOP',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/syetem/support-file/uploadFile'
      },
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        type: null,
        fileId: null,
        fileName: null,
        fileUrl: null,
        sort: null,
        uploadTime: [],
        createTime: [],
        playCount: null,
        playTime: [],
        category: null,
        doshow: null,
        content1: null,
        content2: null,
        content3: null,
        content4: null,
        content5: null
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight)
  },
  created() {
    this.calcTableHeight()
    this.getList()
  },
  methods: {
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 330
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      this.queryParams.type = '3'
      getSupportFilePage(this.queryParams).then(response => {
        this.list = response.data.list
        this.list.forEach(item => {
          item.dohidden = item.doshow == 1
        })
        this.total = response.data.total
        this.loading = false
      })
    },

    switchChange(value, row) {
      console.log(row.id)
      console.log(value)
      var data = {
        id: row.id,
        doshow: value === true ? '1' : '0'
      }
      updateSupportFile(data).then(response => {
        this.$modal.msgSuccess('Success')
        this.open = false
        this.getList()
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      const name = row.name
      this.$modal
        .confirm('Delete file "' + name + '"?')
        .then(function () {
          return deleteSupportFile(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },

    handleUpload() {
      this.uploadDocument.id = ''
      this.uploadDocument.name = ''
      this.uploadDocument.fileId = ''
      this.uploadDocument.open = true
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadDocument.isUploading = true
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log('5555555555555')
      console.log(fileList)
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.uploadDocument.open = false
      this.uploadDocument.isUploading = false
      this.$refs.uploadDocument.clearFiles()
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      // console.log("11")
      // this.$refs["uploadForm"].validate((valid) => {
      //   console.log("22")
      //   if (!valid) {
      //     return;
      //   }
      //   console.log("33")
      // });
      console.log('222')
      console.log('333')
      console.log(this.$refs.uploadDocument)

      this.$refs.uploadDocument.submit()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.uploadDocument.isUploading = false
      // this.$refs.uploadDocument.clearFiles();
      const id = row.id
      let that = this

      getSupportFile(id).then(response => {
        that.uploadDocument.id = response.data.id
        that.uploadDocument.name = response.data.name
        that.uploadDocument.fileId = response.data.fileId
        var data = {
          name: response.data.fileName,
          url: response.data.fileUrl,
          status: 'success',
          content: '11',
          id: response.data.fileId,
          raw: '111',
          uid: '222'
        }
        var list = []
        list.push(data)
        that.uploadDocument.fileList = list
        that.uploadDocument.title = 'Update'
        that.uploadDocument.open = true
      })
    },
    excelRequest(file) {
      console.log('file')

      console.log(file)
    }
  }
}
</script>
