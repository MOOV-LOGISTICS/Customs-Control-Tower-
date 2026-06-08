<template>
  <div>
    <el-row>
      <el-col>
        <!-- 对话框(上传/下载模板) -->
        <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="600px" append-to-body
                   v-loading="uploadDocument.loading">
          <el-form label-width="150px" ref="uploadDocumentForm" :model="uploadDocument.formData" :show-message="false">
            <el-form-item label="Description" required prop="documentNumber">
              <el-input v-model="uploadDocument.formData.documentNumber"></el-input>
            </el-form-item>
            <el-form-item label="Type" required prop="type">
              <el-select v-model="uploadDocument.formData.type">
                <el-option v-for="(type, index) in uploadTypes" :key="index" :label="type.label"
                           :value="type.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="File">

              <el-upload ref="uploadOrderDocument" :limit="1" :headers="uploadDocument.headers"
                         :action="uploadDocument.url" :on-preview="handlePreview"
                         :data="uploadDocument.formData" :on-progress="handleFileUploadProgress"
                         :on-success="handleFileSuccess"
                         :on-change="handleFileChange"
                         :file-list="fileList"
                         :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t("purchaseOrder.DragTheFileHereOr")
                  }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                </div>
              </el-upload>
            </el-form-item>

            <el-button size="mini" type="primary" style="float:right;" @click="submitFileForm">{{
              $t("purchaseOrder.confirm")
              }}
            </el-button>
            <el-button size="mini" style="float:right; margin-right: 10px;" @click="uploadDocument.open = false">{{
              $t("purchaseOrder.cancel")
              }}
            </el-button>
          </el-form>


        </el-dialog>
        <div style="padding:0px 15px 15px 15px">
          <el-skeleton :rows="6" animated :loading="fileListLoading" style=" max-height: 400px;">
            <div class="file-list">
              <el-row>
                <el-col>
                  <el-button type="primary" size="mini" @click="clickUploadFile">Upload File</el-button>

                </el-col>
              </el-row>
              <div style="margin-top:20px">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>Packing List</span>
                      </div>
                      <el-empty v-show="packingList.length == 0" description="No Document"></el-empty>
                      <div v-for="file in packingList" class="text-upload" size="mini">
                        <div class="tools-but">
                        <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span>
                          <span @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                        </div>
                        <el-descriptions :column="1" label-class-name="file-item-label">
                          <el-descriptions-item label="Document Number">{{ file.name }}</el-descriptions-item>
                          <el-descriptions-item label="Uploaded By">{{ file.updater }}</el-descriptions-item>
                          <el-descriptions-item
                            label="Uploaded On">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}
                          </el-descriptions-item>
                          <el-descriptions-item
                            label="Description">{{ file.documentNumber }}
                          </el-descriptions-item>
                        </el-descriptions>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>Invoices</span>
                      </div>
                      <el-empty v-show="invoicesList.length == 0" description="No Document"></el-empty>
                      <div v-for="file in invoicesList" class="text-upload" size="mini">
                        <div class="tools-but">
                        <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span>
                          <span @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                        </div>
                        <el-descriptions :column="1" label-class-name="file-item-label">
                          <el-descriptions-item label="Document Name">{{ file.name }}</el-descriptions-item>
                          <el-descriptions-item label="Uploaded By">{{ file.updater }}</el-descriptions-item>
                          <el-descriptions-item
                            label="Uploaded On">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}
                          </el-descriptions-item>
                          <el-descriptions-item
                            label="Description">{{ file.documentNumber }}
                          </el-descriptions-item>
                        </el-descriptions>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>Others</span>
                      </div>
                      <el-empty v-show="othersList.length == 0" description="No Document"></el-empty>
                      <div v-for="file in othersList" class="text-upload" size="mini">
                        <div class="tools-but">
                        <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span>
                          <span @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                        </div>
                        <el-descriptions :column="1" label-class-name="file-item-label">
                          <el-descriptions-item label="Document Name">{{ file.name }}</el-descriptions-item>
                          <el-descriptions-item label="Uploaded By">{{ file.updater }}</el-descriptions-item>
                          <el-descriptions-item
                            label="Uploaded On">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}
                          </el-descriptions-item>
                          <el-descriptions-item
                            label="Description">{{ file.documentNumber }}
                          </el-descriptions-item>
                        </el-descriptions>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>


              </div>


            </div>
          </el-skeleton>
        </div>

      </el-col>
    </el-row>

  </div>
</template>
<script>

  import { getBaseHeader } from "@/utils/request";
  import { getFileList, deleteFile } from "@/api/infra/file";
  import { getOrderDocument  } from "@/api/order/sOHeader";
  import { fileLoadMixin } from '@/utils/fileLoadMixin'
  export default {
      name: "Document",
      mixins: [fileLoadMixin],
      props:{
          orderId:{
              type: Number,
          }
      },
      components: {
      },
      data() {
          return {
            packingList: [],
            invoicesList: [],
            othersList: [],
            uploadTypes: [
              { label: 'Packing List', value: '1' },
              { label: 'Invoices', value: '2' },
              { label: 'Others', value: '3' },
            ],
            fileListLoading: false,
            uploadDocument: {
              // 是否显示弹出层
              open: false,
              // 弹出层标题
              title: "",
              // 是否禁用上传
              isUploading: false,
              loading: false,
              // 设置上传的请求头部
              headers: getBaseHeader(),
              // 上传的地址
              url: process.env.VUE_APP_BASE_API + "/admin-api/order/so-header/uploadOrderDocument",
              formData: {},
            },
          }
      },
      mounted(){
        if(this.orderId){
          this.getDocument()
        }
      },
      methods:{

        /** 删除文档按钮操作 */
        deleteDocument(row) {
          const id = row.id;
          this.$modal.confirm('Delete "' + row.name + '"?').then(function () {
            return deleteFile(id);
          }).then(() => {
            this.getDocument();
            this.$modal.msgSuccess("Success");
          }).catch(() => {
          });
        },
        //查询文档
        getDocument() {
          getOrderDocument(this.orderId).then((res) => {
            if (res.data) {
              this.packingList = res.data.packingList
              this.invoicesList = res.data.invoices
              this.othersList = res.data.others
            }
          });
        },
        clickUploadFile() {
          this.uploadDocument.title = "Add";
          this.uploadDocument.formData = {}
          this.uploadDocument.open = true;
          if (this.$refs.uploadOrderDocument) {
            this.$refs.uploadOrderDocument.clearFiles();
          }
        },
        handlePreview(file) {
          if (file.id) {
            window.location.href = file.url
          }
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
          this.uploadDocument.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
          if (response.code !== 0) {
            this.$modal.msgError(response.msg);
            return;
          }
          this.uploadDocument.open = false;
          this.uploadDocument.isUploading = false;
          this.$refs.uploadOrderDocument.clearFiles();

          this.uploadDocument.formData = {}
          this.uploadDocument.loading = false
          this.getDocument();
        },
        // 提交上传文件
        submitFileForm() {
          this.$refs["uploadDocumentForm"].validate((valid) => {
            if (valid) {
              if(this.$refs.uploadOrderDocument.uploadFiles == null || this.$refs.uploadOrderDocument.uploadFiles.length == 0){
                this.$notify({
                  message: 'Please add files before uploading',
                  type: 'warning'
                });
                return
              }
              this.uploadDocument.loading = true
              this.uploadDocument.formData.exId = this.orderId;
              this.$refs.uploadOrderDocument.submit();

            }
          })
        },


      }
  }
</script>
<style scoped>
.text-upload {
  padding-top: 5px;
  margin: 10px;
  border: 1px solid #ddd;
  display: flex;
  /* 启用 Flexbox 布局 */
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row-reverse;
}

.text-upload .tools-but {
  background: #ffffff;
}

.text-upload .tools-but span {
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.text-upload .el-descriptions {
  margin: 0;
  padding: 0px 10px 10px 10px !important;
  border: 0 !important;
  box-shadow: none;
}
</style>
