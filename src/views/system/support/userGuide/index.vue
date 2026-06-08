<template>
  <div class="app-container">
    <el-card>
      <div style="margin-left: 15px;">
        <el-row style="margin-top: 10px;">
          <el-col :span="6"><div class="title" style=" line-height: 35px;height: 35px;">Manual/SOP</div></el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row style="padding-right: 200px; ">

          <el-col :span="4" v-for="item in fileList" :key="item.id" :value="item.id" style=" margin-right: 20px;margin-bottom: 20px; padding: 0px;">
            <el-card  style=" min-width: 220px;" @click.native="handleLink(item)">
              <el-button style="background-color: white;border-color: white;width: 100%; height: 60px; " type="primary" size="mini" class="bun"
                ><i style="font-size: 35px;color: #004F7C;" class="el-icon-download"></i><span style=" font-size: 25px;color: #004F7C;padding: 0px;">{{ item.name }}</span>
              </el-button>
            </el-card>
            <el-link :href="item.fileUrl" :title="item.fileName" target ="_blank" style="display: none;">
            </el-link>
          </el-col>

          <!-- <el-col :span="3" style=" margin-right: 20px;margin-bottom: 20px; padding: 0px;">
            <el-card>
              <el-button style="background-color: white;border-color: white;width: 100%; height: 60px; " type="primary" size="mini" class="bun"
                ><i style="font-size: 35px;color: #004F7C;" class="el-icon-download"></i><span style=" font-size: 25px;color: #004F7C;padding: 0px;">SOP</span>
              </el-button>
            </el-card>
          </el-col> -->

        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8"><div class="title" style="line-height: 35px;height: 35px;">SMART Videos</div></el-col>
        </el-row>
        <el-divider></el-divider>

        <el-row>

          <el-tabs v-model="activeName">
            <el-tab-pane label="All" name="All" key="All">
              <el-col :span="6" v-for="item in videoList" :key="item.id" :value="item.id">
                  <div style="width: 90%;margin-right: 10%;text-align: center;margin-bottom: 20px;">
                    <video  style=" height: 250px;border-radius: 8px;"
                    muted
                    @play="beginPlaying(item)"
                    @mouseover="playVideo"
                    @mouseout="stopVideo"
                      controls="true" data-type="embed-video" raw-controls="true" controlslist="nodownload noremoteplayback noplaybackrate"
                      webkit-playsinline="true" playsinline="" preload="metadata"
                      disablePictureInPicture
                      poster="../../../../assets/images/video_bg.png"
                      >
                      <source :src="item.fileUrl" type="video/mp4">
                      </video>
                      <div style="font-weight: 700;">{{ item.name }}</div>
                      <span class="inline-metadata-item style-scope ytd-video-meta-block">{{ item.playCount==null?'0':item.playCount }} Views • {{ item.playTimeStr }}</span>
                  </div>
                </el-col>
            </el-tab-pane>

              <el-tab-pane v-for="category in videoGroupKeys" :label="category" :name="category" :key="category">
                <el-col :span="6" v-for="item in videoGroupList[category]" :key="item.id" :value="item.id">
                  <div style="width: 90%;margin-right: 10%;text-align: center;margin-bottom: 20px;">
                      <video style=" height: 250px;border-radius: 8px;"
                      muted
                      @play="beginPlaying(item)"
                      @mouseover="playVideo"
                    @mouseout="stopVideo"
                      controls="true" data-type="embed-video" raw-controls="true" controlslist="nodownload noremoteplayback noplaybackrate"
                      webkit-playsinline="true" playsinline="" preload="metadata"
                      disablePictureInPicture
                      poster="../../../../assets/images/video_bg.png"
                      >
                        <source :src="item.fileUrl" type="video/mp4">
                      </video>
                      <div style="font-weight: 700;">{{ item.name }}</div>
                      <span class="inline-metadata-item style-scope ytd-video-meta-block">{{ item.playCount==null?'0':item.playCount }} Views • {{ item.playTimeStr }}</span>
                  </div>
                </el-col>
              </el-tab-pane>
          </el-tabs>
          <!-- poster removed -->

          <!-- poster="https://dt.moovlogistics.com/admin-api/infra/file/5/get/574d5b3d1ce55b5d5acf7bbad19aa3e63f90a816911a4c9cb07b51ec0ed6a58d.png" -->

          <!-- poster="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/v1GXn4LED0AQnDQ4/img/5ce1da1f-3b58-4efe-882d-28519634183c" -->

          <!-- <el-col :span="6" style="">
            <div style="width: 90%;margin-right: 10%;text-align: center;margin-bottom: 20px;">
                <video style=" height: 250px;border-radius: 8px;"
                controls="" data-type="embed-video" raw-controls="true" controlslist="nodownload noremoteplayback"
                webkit-playsinline="true" playsinline="" preload="metadata">
          <source src="https://alidocs.dingtalk.com/core/api/resources/8a7bd3e7-a20b-4538-96c6-a1a40cbc68f8/detail?dentryKey=&amp;docKey=JZWGl0ByXyLBq34Y" type="video/mp4">
        </video>
                <div style="font-weight: 700;">smartMOOV Introduction</div>
                <span class="inline-metadata-item style-scope ytd-video-meta-block">3000 Views • 1 Month ago</span>
            </div>
          </el-col> -->

          <!-- <el-col :span="6" style="">
            <div style="width: 90%;margin-right: 10%;text-align: center;margin-bottom: 20px;">
                <video style=" height: 250px;border-radius: 8px;"
                controls="" data-type="embed-video" raw-controls="true" controlslist="nodownload noremoteplayback"
                webkit-playsinline="true" playsinline="" preload="metadata">
                  <source src="https://pepco.smartmoovhub.com/admin-api/infra/file/5/get/b55ed94c8be246f39e9cbe0d258474c2.mp4" type="video/mp4">
                </video>
                <div style="font-weight: 700;">smartMOOV Introduction</div>
                <span class="inline-metadata-item style-scope ytd-video-meta-block">3000 Views • 1 Month ago</span>
            </div>
          </el-col> -->
          <!-- <el-col :span="2"><div class="title" style="line-height: 25px;height: 25px;margin-top: 10px; color: #27a5ff; font-size: 14px;">Demo Video</div></el-col> -->

        </el-row>
      </div>

    </el-card>


    </div>
  </template>

<style>
.title{
  font-weight: bold;
  padding-right: 10px;
}
.center {
    position: absolute;
    top: 50%;
    transform: translateX(-50%);
    background: green;
    padding: 10px;
  }


</style>

  <script>

import {  getSupportFilePage,updateSupportFile,getSupportFilePageIgnoreTenant,updateSupportFileIgnoreTenant } from "@/api/system/supportFile";
import {  getTenantId} from '@/utils/auth'


  export default {
    name: "userGuide",
    components: {},
    props: [],
    data () {
      return {

        currentTime: 0,

        height:'',
        list:[],
        fileList:[],
        videoList:[],
        videoGroupList:[],
        videoGroupKeys:[],

        activeName:'All',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 100,
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
        content5: null,
      },


      };
    },
    created () {
      this.getList();
    },
    methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getSupportFilePageIgnoreTenant(this.queryParams).then(response => {
        this.list = response.data.list;
        const listBycategory = {};
        this.list.forEach(item =>{
          if(item.doshow!=1) {
            if(item.type==1) {
              this.fileList.push(item);
            }if(item.type==3) {
              if(item.tenantId==getTenantId()) {
                this.fileList.push(item);
              }
            } else if(item.type==2) {
              item.playTimeStr = this.diaplayTime(item.playTime);
              this.videoList.push(item);
              this.videoList.sort(function (a, b) {
                  return a.sort - b.sort;
              });
              const category = item.category;
              if (!listBycategory[category]) {
                listBycategory[category] = [];
              }
              listBycategory[category].push(item);
            }
          }
        });
        console.log(listBycategory);
        this.videoGroupList = listBycategory;
        for (const key in listBycategory) {
          this.videoGroupKeys.push(key);
          var list = listBycategory[key];
          list.sort(function (a, b) {
              return a.sort - b.sort;
          });
          listBycategory[key] = list;
        }
        this.loading = false;
      });
    },
    handleLink(item) {
      window.open(item.fileUrl);
    },
    beginPlaying(item) {
      var data = {
        id: item.id,
        playCount: item.playCount+1,
        playTime: Date.now(),
      };
      updateSupportFileIgnoreTenant(data).then(response => {
      });
    },
    playVideo(e) {
      console.log('1111111');
      console.log(e);
      var video = e.target;
      console.log(video);
      video.play();
    },
    stopVideo(e) {
      console.log('2222222');
      console.log(e);
      var video = e.target;
      console.log(video);
      video.pause();
    },


    diaplayTime(data) {
      var str = data;
      //将字符串转换成时间格式
      var timePublish = new Date(str);
      var timeNow = new Date();
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var month = day * 30;
      var diffValue = timeNow - timePublish;
      var diffMonth = diffValue / month;
      var diffWeek = diffValue / (7 * day);
      var diffDay = diffValue / day;
      var diffHour = diffValue / hour;
      var diffMinute = diffValue / minute;
      var result = '';
      if (diffValue < 0) {
          // alert("error time");
      }
      else if (diffMonth > 30) {
      }
      else if (diffMonth > 3) {
          result = timePublish.getFullYear()+"-";
          result += timePublish.getMonth() + "-";
          result += timePublish.getDate();
          // alert(result);
      }
      else if (diffMonth > 1) {
          result = parseInt(diffMonth) + " month ago";
      }
      else if (diffWeek > 1) {
          result = parseInt(diffWeek) + " weeks ago";
      }
      else if (diffDay > 1) {
          result = parseInt(diffDay) + " day ago";
      }
      else if (diffHour > 1) {
          result = parseInt(diffHour) + " hours ago";
      }
      else if (diffMinute > 1) {
          result = parseInt(diffMinute) + " minute ago";
      }
      else {
          result = "1 minute ago"; // 刚刚
      }
      return result;
      }


    },
  };


  </script>
