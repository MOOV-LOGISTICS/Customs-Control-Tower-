<template>
  <div class="app-container">

    <div class="searchFormPart"  v-if="checkPermi(['folder:admin','folder:upload'])" >
      <el-button @click="addDialog" type="primary" size="mini"><i class="el-icon-plus"></i>Add Files</el-button>
    </div>

    <div>
      <el-breadcrumb  class="files-breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
          <a v-if="index < breadcrumb.length - 1" @click="navigateTo(item)">{{ item.name }}</a>
          <span v-else>{{ item.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="table-files" style="padding-top: 10px;">

        <el-table
          v-loading="loading"    ref="table"
          size="mini"   max-height="700"
          :data="filteredData">
          <el-table-column prop="name" label="Name" sortable min-width="300px"    >
            <template slot-scope="scope">
              <i class="i-text" v-if="scope.row.isChildren"  @click="openFolder(scope.row)"> <img src="../../../assets/images/folder.svg" alt="icon" />  {{scope.row.folderName}}</i>

              <ActionButton v-else  :url="scope.row.url"   iconType="el-icon-document"
                buttonType="text"   type='preview'   :fileName='scope.row.folderName'
                downloadText="Download file"   :buttonText="scope.row.folderName"   />
              <!-- <el-link v-else   class="el-icon-document i-text"  @click="handleView(scope.row)"
                       :title="scope.row.folderName" >
                <span style="padding-left: 5px;"></span>{{ scope.row.folderName}}
              </el-link> -->

            </template>
          </el-table-column>

          <el-table-column prop="search" label="Search" min-width="10px"  label-class-name="el-header-search-label">
            <template slot="header" slot-scope="scope">
              <div  class="el-header-search">
                <el-input size="mini" placeholder="Name" v-model="search" @keyup.enter.native="search" clearable></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable v-if="checkPermi(['folder:admin'])"
            min-width="160px"
            prop="tenantId"
            label="Customers Name" >
            <template slot-scope="scope">
              {{ tenantList.find(o => o.id === scope.row.tenantId)?.name }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            min-width="200px"
            prop="updater"
            label="Last Modified By" >
          </el-table-column>
          <el-table-column
            sortable
            min-width="150px"
            max-width="150px"
            prop="updateTime"
            label="Last Modified Date">
            <template slot-scope="scope">
              <el-date-picker disabled value-format="timestamp" format="dd-MM-yyyy HH:mm" v-model="scope.row.updateTime" size="mini"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column  label="Action"  v-if="checkPermi(['folder:admin','folder:delete'])"
                            min-width="100px" align="center">
            <template slot-scope="scope">
              <ActionButton v-if="scope.row.url" :url='scope.row.url' iconType="el-icon-download" type='download' :fileName='scope.row.folderName' />
              <!-- <a v-if="scope.row.url" :href="scope.row.url" target="_blank" class="download-link">
                <el-button size="mini" type="primary" icon="el-icon-download" circle></el-button>
              </a> -->
              <el-popconfirm   title="Delete this file?" @confirm="handleDelete(scope.$index, scope.row)">
                <el-button  slot="reference" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :close-on-click-modal="false" width="750px" title="Add Files" :visible.sync="dialogFormVisible" >
      <el-form :model="ruleForm" ref="ruleForm"size="mini" :rules="rules">

        <el-form-item label="Folder Name"  prop="folderName"  label-width="140px"  style="margin-bottom: 13px;">
          <el-select v-model="ruleForm.folderName" allow-create filterable default-first-option
                     placeholder="Folder Name" size="mini" clearable>
            <el-option v-for="item in folderExtData" :key="item.id" :label="item.folderName" :value="item.folderName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Customers Name" prop="tenantId" label-width="140px" v-if="checkPermi(['folder:admin'])" style="margin-bottom: 13px;">
          <el-select v-model="ruleForm.tenantId" filterable placeholder="Customers Name" default-first-option
                     size="mini" :disabled="breadcrumb.length > 1"  clearable>
            <el-option v-for="item in tenantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-from-item>
          <template>
            <el-upload
              ref="upload"
              action="/admin-api/system/folder/create"
              name="files"
              class="file-upload-folder-css"
              style="width: 100%;"
              :drag="true"
              :file-list="filesList"
              :multiple="true"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-change="(file, files) => handleFileChangeThen(file, files, () => { this.filesList = files }, () => { this.filesList = [] })"
              v-loading="uploadLoading"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drag the file here, or click<em>to upload</em></div>
            </el-upload>
          </template>
        </el-from-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">Cancel</el-button>
        <el-button size="mini" type="primary" :loading="buttonLoading" @click="addFiles()">Submit</el-button>
      </div>
    </el-dialog>
    <div>
      <el-dialog :visible.sync="showModal" title="Preview" width="80%" :before-close="handleClose" @opened="adjustIframeHeight" @closed="resetIframeHeight" ref="previewDialog">
      <div ref="dialogBody" class="custom-dialog-body">
        <iframe ref="previewIframe" :src="iframeSrc" frameborder="0" style="width: 100%; height: 100%;"></iframe>
        <div class="download-button-container">
          <el-button type="primary" @click="downloadFile" icon="el-icon-download">Download File</el-button>
        </div>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
  import { createFolder, deleteFolder, getFolder, getFolderPage, getTreeList } from "@/api/folder/folder";
  import { getTenantPage, getTenantIdListOfActive2 } from "@/api/system/tenant";
  import { checkPermi } from "@/utils/permission"; // 权限判断函数
  import { fileLoadMixin } from '@/utils/fileLoadMixin'
  import {  deleteFile } from "@/api/infra/file";
  let Base64 = require('js-base64').Base64;
  export default {
    name: "Folder",
    mixins: [fileLoadMixin],
    components: {
    },
    data() {
      return {
        showModal:false,
        downloadFileUrl :'',
        iframeSrc: '',
        tableHeight:0,
        tableData:[],
        loading: false,
        searchBtn:true,
        searchData: {
          fileName: null,
          userName:null
        },
        buttonLoading: false,
        dialogFormVisible: false,
        ruleForm: {
          folderName: null,
          partyId:null,
          parentFolderId:null
        },
        rules: {
          folderName: [{
            required: true,
            message: 'Folder Name cannot be empty',
            trigger: 'blur'
          }],
          partyId: [{
            required: true,
            message: 'Customers Name cannot be empty',
            trigger: 'blur'
          }],
        },
        filesList:[],
        tenantList:[],
        tempData:[],
        breadcrumb:[{name:'HomePage',id:'0'}],
        tempTenantId:null,
        folderExtData:[],
        search:'',
        metadata:[],
        uploadLoading: false
      }
    },
    computed: {
      filteredData() {
        if (this.search) {
          return this.tableData.filter((item) => {
            return item.folderName.toLowerCase().includes(this.search.toLowerCase());
          });
        } else {
          return this.tableData;
        }
      },
    },
    watch: {
        search() {
          this.$nextTick(() => {
            this.$refs.table.setCurrentRow();
          });
        },
    },
    created() {
      this.calcTableHeight()
      this.findFilesByCustomer()
      this.findFolderExtData()
    },
    mounted() {
      window.onresize = () => {
          this.calcTableHeight()
      }
      this.findList()
      this.getTenantPage()
    },
    methods: {
      checkPermi,
      beforeRemove(file, fileList){
          if (file && file.status === 'success') this.filesList = fileList
      },

      preview(id) {
        window.open('/rest/s1/mediaSource/preview?id=' + id)
      },
      openFolder(row, column, event){
          if(row.children){
              //保存原始数据
              this.tempData = this.tableData
              this.tempTenantId = row.tenantId
              this.tempParentFolderId = row.id

              //子节点数据覆盖原表
              this.tableData = row.children
              this.breadcrumb.push({name:row.folderName,id:row.id, pid: row.parentFolderId})
                this.findFolderExtData()
          }
      },
      navigateTo(item) {
        if (item.name === 'HomePage') {
          // 返回到主目录
          this.tableData = this.tempData;
          this.breadcrumb = [{name:'HomePage',id:'0'}];
          this.ruleForm.folderName = null;
          this.ruleForm.partyId = null;
          this.ruleForm.parentFolderId = null;
          this.tableData = this.metadata
          this.findFolderExtData()
          this.tempTenantId = null
          this.tempParentFolderId = null

          return
        }
         // 点击了子目录，更新面包屑变量
         const index = this.breadcrumb.findIndex(i => i.name === item.name);
         this.breadcrumb.splice(index + 1);
        // 根据最后一个面包屑项的值来更新目录数据
        const lastItem = this.breadcrumb[this.breadcrumb.length - 1];
        this.findFolderExtData(lastItem['id'])
        this.tempParentFolderId = lastItem.id
        this.loadTableData(lastItem);
      },
        loadTableData() {
          // 从文件目录结构数据中获取当前文件夹 ID
          var currentFolderId = this.breadcrumb[this.breadcrumb.length - 1].id;
          // 从文件目录结构数据中找到当前文件夹的信息
          var subFolders = this.findSubFoldersById(currentFolderId, this.metadata);
          // 清空原有的表格数据
          this.tableData = subFolders

        },
        findSubFoldersById(id, folders) {
          for (var folder of folders) {
            if (folder.id === id) {
              return folder.children;
            } else if (folder.children) {
              const result = this.findSubFoldersById(id, folder.children);
              if (result) {
                return result;
              }
            }
          }
          return null;
        },
        getTenantPage(){
          if(checkPermi(['folder:admin'])){
            getTenantIdListOfActive2( ).then(response => {
              this.tenantList=response.data
            });
          }
        },
        findList() {
          var vm = this;
          vm.cancelLoading()
        },
        calcTableHeight() {
          var clientHeight = document.documentElement.clientHeight
          this.tableHeight = clientHeight - 100
        },
        onSearch() {
            this.buttonLoading = true;
            this.findFilesByCustomer()
        },
        findFolderExtData(id){
            var vm = this;
            var result = vm.tableData.find(function(item) {
              return item.isChildren === true;
            });
        },
        findFilesByCustomer(){
          var vm = this;

          getTreeList({folderName:vm.searchData.fileName}).then((req) =>{
             vm.tableData = req.data
             vm.metadata = req.data
             //自动到面包屑最后一个目录
             vm.navigateTo(vm.breadcrumb[vm.breadcrumb.length - 1])
             vm.cancelLoading()
          })
        },
        addDialog(){
            this.dialogFormVisible = true
            if(this.breadcrumb[1] && this.breadcrumb[1] != 'PO Files' ) {
                this.ruleForm.folderName =  this.breadcrumb[this.breadcrumb.length - 1].name
                this.ruleForm.tenantId = this.tempTenantId
                this.ruleForm.parentFolderId = this.tempParentFolderId
            }
        },
        handleView(row) {
          const url = process.env.VUE_APP_ONLINEPREVIEW_API + '/preview/onlinePreview?url=' + encodeURIComponent(Base64.encode(row.url));
          this.downloadFileUrl = row.url; // 设置下载 URL
          this.iframeSrc = url;
          this.showModal = true;

        },
        downloadFile() {
          const link = document.createElement('a');
          link.href = this.downloadFileUrl;
          link.download = 'file'; // 可以根据实际情况设置文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        handleClose(done) {
          this.showModal = false;
          this.clearIframeSrc(); // 清除 iframe src
          this.clearLocalStorage(); // 清除本地存储
          this.resetState(); // 重置 Vuex 状态
          done();
        },
        clearIframeSrc() {
          this.iframeSrc = '';
        },
        clearLocalStorage() {
          localStorage.removeItem('iframeData');
          sessionStorage.removeItem('iframeData');
        },
        adjustIframeHeight() {
          this.$nextTick(() => {
            const iframe = this.$refs.previewIframe;
            const dialog = this.$refs.previewDialog.$el;
            const header = dialog.querySelector('.el-dialog__header');
            const footer = dialog.querySelector('.el-dialog__footer');
            const dialogBody = this.$refs.dialogBody;

            if (dialog && header && dialogBody) {
              const headerHeight = header.offsetHeight;
              const footerHeight = footer ? footer.offsetHeight : 0;

              // 使用 window.getComputedStyle 获取实际计算的高度
              const dialogStyle = window.getComputedStyle(dialog);
              const headerStyle = window.getComputedStyle(header);
              const footerStyle = footer ? window.getComputedStyle(footer) : { getPropertyValue: () => '0px' };

              const dialogHeightComputed = parseFloat(dialogStyle.getPropertyValue('height'));
              const headerHeightComputed = parseFloat(headerStyle.getPropertyValue('height'));
              const footerHeightComputed = parseFloat(footerStyle.getPropertyValue('height'));

              if (!isNaN(dialogHeightComputed) && !isNaN(headerHeightComputed) && !isNaN(footerHeightComputed)) {
                const maxHeight = 800; // 设置最大高度
                const bodyHeight = Math.min(dialogHeightComputed - headerHeightComputed - footerHeightComputed, maxHeight);
                iframe.style.height = `${bodyHeight}px`;

                console.log('Dialog Height:', dialogHeightComputed);
                console.log('Header Height:', headerHeightComputed);
                console.log('Footer Height:', footerHeightComputed);
                console.log('Body Height:', bodyHeight);
              } else {
                console.error('One or more heights are NaN');
              }
            } else {
              console.error('One or more elements not found');
            }
          });
        },

          resetIframeHeight() {
            const iframe = this.$refs.previewIframe;
            if (iframe) {
              iframe.style.height = '100%';
            }
          },
        handleDelete(node, row) {
          var vm = this
          const id = row.id;
          if(row.isChildren){
            deleteFolder(id).then((res) => {
               vm.$notify({
                  type: "success",
                  message: "Success to delete file",
               });
               vm.tableData.splice(node, 1);
               vm.findFolderExtData();
               vm.cancelLoading();
            }).catch(() => {
            });
          }else{
            deleteFile(id).then((res) => {
               vm.$notify({
                  type: "success",
                  message: "Success to delete file",
               });
               vm.tableData.splice(node, 1);
               vm.findFolderExtData();
               vm.cancelLoading();
            }).catch(() => {
            });
          }

        },

        addFiles() {
            var vm=this
            vm.$refs['ruleForm'].validate((valid) =>{
                if (valid) {
                    // 显示遮罩
                    this.uploadLoading = true
                    this.buttonLoading = true
                    // 将每个文件添加到 FormData 对象中
                    var formData=new FormData()

                    for (let i = 0; i < vm.filesList.length; i++) {
                      formData.append('files', vm.filesList[i]);
                    }
                    formData.append('folderName', vm.ruleForm.folderName)
                    formData.append('tenantId', vm.ruleForm.tenantId ? vm.ruleForm.tenantId : '')
                    formData.append('parentFolderId', vm.ruleForm.parentFolderId==null ?'':vm.ruleForm.parentFolderId)
                    createFolder(formData).then(responseObj =>{
                       if (responseObj ) {
                           vm.findFolderExtData();
                           vm.findFilesByCustomer()
                           vm.dialogFormVisible=false
                           vm.cancelLoading();
                           vm.ruleForm = vm.$options.data().ruleForm
                           vm.$notify({
                              type: "success",
                              message: "Success to add file",
                           });

                         } else {
                            vm.cancelLoading();
                             vm.$notify({
                                 type: "error",
                                message: responseObj.msg || "Fail",
                            });
                       }
                      vm.filesList = []
                    })
                } else {
                  vm.cancelLoading();
                  return false;
                }
            });
        },
        cancelLoading() {
            this.loading = false;
            this.buttonLoading = false;
            this.uploadLoading = false;
        },
        beforeUpload(file) {
            this.filesList.push(file)
            return false
        }
    }
  };
</script>
<style>
 .download-link {
  text-decoration: none;
  display: inline-block;
}
  .el-header-search {
    position: absolute;
    top: -14px;
    right: 10px;
    width: 200px;
    z-index: 999;
  }
  .el-header-search-label.is-leaf.el-table__cell {
    overflow: visible;
  }
  .cell.el-header-search-label {
    overflow: initial !important;
  }
  .i-text{
    font-size: 18px !important;
    cursor: pointer;
  }
  .el-breadcrumb.files-breadcrumb {
      font-size: 16px;
      line-height: 2;
  }
  table.el-table__header {
    padding: 5px 0px 10px 10px;
}
.custom-dialog-body {
  padding: 0;
  height: 100%; /* 确保 body 占据所有可用空间 */
  overflow: auto; /* 确保内容超出时可以滚动 */
  position: relative; /* 使下载按钮定位相对 */
}
.custom-dialog-container {
  margin-top: 0 !important; /* 调整模态框的垂直位置 */
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* 限制模态框的最大高度 */
}
.custom-dialog-header {
  padding: 10px 20px;
}
.custom-dialog-footer {
  padding: 10px 20px 20px;
}
.download-button-container {
  position: absolute;
  bottom: 10px;
  right: 10px; /* 靠右对齐 */
}

.file-upload-folder-css, .file-upload-folder-css .el-upload.el-upload--text, .file-upload-folder-css .el-upload-dragger {
    width: 100%;
}

</style>
