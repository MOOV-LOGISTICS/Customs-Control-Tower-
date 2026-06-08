<template>
    <el-card class="rating-popup">
        <i style="font-size: 16px;" class="close el-icon-close" @click="close"></i>

        <div style="font-size: 16px;">
        Enjoying your smartMOOV experience ?
      </div>
      <div class="stars">
        <el-rate v-model="rating" @change="rateChange" />
      </div>
      <div v-if="rating" class="feedback">
        Thank you for your kind comments.
        </div>
      <div v-if="showSubmit">
        <el-divider ></el-divider>
        <div style="font-size: 14px;">
        Help us to improve your experience
      </div>
      <div style="font-size: 14px;text-align: left;margin-left: 20px;">
        Title
      </div>
        <el-input v-model="title" style="padding:0px 20px;"></el-input>
        <div style="font-size: 14px;text-align: left;margin-left: 20px;">
        Description
      </div>
      <el-input v-model="desc" type="textarea" style="padding:0px 20px;"></el-input>
      <div style="font-size: 14px;text-align: left;margin-left: 20px;">
        Attach
      </div>
      <el-upload ref="uploadDocument"
                    drag
                    :multiple="true"
                    action=""
                    :limit="1"
                    :auto-upload="true"
                    :http-request="uploadFile"
                    :on-change="handleFileChange"
                    :file-list="fileList"
                    :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
                    :disabled="uploadDocument.isUploading"
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t("purchaseOrder.DragTheFileHereOr")
                  }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                </div>
        </el-upload>
        <div class="footer">
            <el-button size="mini" type="primary" @click="submitFile">Submit</el-button>
        </div>
      </div>
    </el-card>
  </template>

  <script>
import { uploadFiles } from "@/api/system/star";
import {setStar} from "@/utils/auth";
import { fileLoadMixin } from '@/utils/fileLoadMixin'


  export default {
    mixins: [fileLoadMixin],
    data() {
      return {
        rating: null,
        title:null,
        desc:null,
        id:null,
        uploadDocument:{
            // 是否禁用上传
            isUploading: false,
        },
        fileList: [],
        showSubmit: false,
        height: '50px',
      };
    },
    methods: {
      rateChange() {
        console.log(this.rating)
        if(this.rating<=3) {
          this.showSubmit = true;
          this.height = '620px';
        } else {
          var that = this;
          setTimeout(function() {
            that.submitFile();
          }, 1000);
        }
      },
      close() {
        if(this.rating!=null&&this.rating!=0) {
          this.submitFile();
        }
        setStar(new Date().toISOString().slice(0, 10));
        this.$emit('close-popup');
      },
          // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadDocument.isUploading = true;
      console.log("222222222")
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.uploadDocument.isUploading = false;
      this.$refs.uploadDocument.clearFiles();
    },
    uploadFile(raw) {
        console.log(raw)
        console.log(this.fileList)
        this.fileList.push(raw.file)
    },
    submitFile() {
      if(this.rating==null||this.rating==0) {
        this.$notify.error("Please rate");
        console.log("Please rate");
        return;
      }
        console.log(this.fileList)
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("description", this.desc);
        formData.append("id", this.id);
        formData.append("rating", this.rating);
        this.fileList.map(file => {
            formData.append("file", file, file.name)
         });
        console.log(formData)
        console.log('formData')
        uploadFiles(formData).then(response => {
            setStar(new Date().toISOString().slice(0, 10));
            this.fileList = [];
            this.$emit('close-popup');
        });
    },


    },
  };
  </script>

  <style scoped>
  .rating-popup {
    position: fixed;
    /* bottom: 10%; */
    /* right: 40%; */
    bottom: 37px;
    right: 30px;
    z-index: 1000;
    background-color: #fff;
    width: 400px;
    /* height: 620px; */
    height: height;
  }
  .stars {
    cursor: pointer;
  }
  .stars i {
    margin-right: 5px;
    font-size: 24px;
    color: #fcd000;
  }
  .feedback {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
  }
  .close {
    color: #333;
    font-size: 15px;
    height: 35px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 0;
    width: 35px; /* 宽度 */
    height: 35px; /* 高度 */
    }
    .footer {
      width: 100px;
      margin-left: 300px;
    }
  </style>
