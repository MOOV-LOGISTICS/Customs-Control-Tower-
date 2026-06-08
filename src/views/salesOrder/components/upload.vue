<template>
    <div>
        <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
            Only xls, xlsx format files are allowed.<el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >{{$t("purchaseOrder.downloadingTheTemplate")}}</el-link
          >
        </div>
      </el-upload>

      <div style="padding: 25px 5px 5px 20px;
    padding-top: 25px;
    padding-bottom: 5px;
    text-align: right;" slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submit">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
      </div>

    </div>
</template>
<script>
    import {IconPark} from '@icon-park/vue/es/all';
    import { getBaseHeader } from "@/utils/request";
    import { fileLoadMixin } from '@/utils/fileLoadMixin'
    export default {
        name: "SalesOrder-Upload",
        mixins: [fileLoadMixin],
        props:{
            uploadUrl:{
                type: String,
            },
        },
        components: {
            IconPark
        },
        data() {
            return {
                upload: {
                    open: false,
                    title: "",
                    isUploading: false,
                    headers: getBaseHeader(),
                    url: process.env.VUE_APP_BASE_API + this.uploadUrl,
                },
            }
        },
        mounted(){

        },
        methods:{
            submit(){
                this.upload.isUploading=true
                this.$refs.upload.submit()
            },
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true;
            },
            handleFileSuccess(response, file, fileList) {
                this.upload.isUploading = false;
                this.$refs.upload.clearFiles();
                this.$emit('reloadTable',response.data)
            },
            handleFileError(err, file, fileList){
                this.upload.isUploading = false;
                this.$refs.upload.clearFiles();
            },
            importTemplate(){
                this.$emit('importTemplate')
            }
        }
    }
</script>
<style></style>
