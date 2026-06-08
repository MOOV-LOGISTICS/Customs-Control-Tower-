
<template xmlns="">
  <div :class="{'full-screen': isFullScreen}">
    <div style="display: flex ; justify-content: flex-end;">
      <el-button  @click="refreshReport" :loading="userRefresh" class="el-icon-refresh report-full-css" circle ></el-button>
      <el-button  @click="toggleFullScreen" class="el-icon-full-screen report-full-css" circle ></el-button>
    </div>

    <div v-if="powerbiDiv" ref="fullScreenElement"
         style="width: 100%; height: 96%;     padding: 5px 10px 5px 10px;"
         v-loading="dialogVisible"  class="power-bi-css" >

    </div>


  </div>
</template>
<script>
import bi from "./powerbi/powerbi";
import { getBIReportUrl } from "@/api/bi/bi";


export default {
  bi: [bi],
  name: "IndexReport",
  components: {},
  props:{
    id:String
  },
  data() {
    return{
        // Set the refresh interval time to 30 seconds
        INTERVAL_TIME: 60000,
        // Get the token expiration from the access token
        accessToken:'',
        report:null,
        powerbiDiv:true,
        dialogVisible:true,
        isFullScreen: false,
        fullScreenElement: null, // 用于存储全屏元素的引用
        userRefresh: false,
    }
	},

  computed: {

  },
	created() {

	},
  beforeDestroy() {
    this.removeFullScreenChangeListener();
  },
  methods: {
    refreshReport(){
        this.userRefresh = true
        this.refreshPowerBIToken()
    },
    toggleFullScreen() {
      if (!this.isFullScreen) {
        // 进入全屏
        this.enterFullScreen();
      } else {
        // 退出全屏
        this.exitFullScreen();
      }
    },
    enterFullScreen() {
      if (this.fullScreenElement.requestFullscreen) {
        this.fullScreenElement.requestFullscreen();
      } else if (this.fullScreenElement.mozRequestFullScreen) { /* Firefox */
        this.fullScreenElement.mozRequestFullScreen();
      } else if (this.fullScreenElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        this.fullScreenElement.webkitRequestFullscreen();
      } else if (this.fullScreenElement.msRequestFullscreen) { /* IE/Edge */
        this.fullScreenElement.msRequestFullscreen();
      }
      this.isFullScreen = true;
    },
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.isFullScreen = false; // 通常情况下，这里不需要手动设置，因为监听器会更新状态
    },
    addFullScreenChangeListener() {
      const onFullScreenChange = () => {
        if (document.fullscreenElement === null || document.fullscreenElement !== this.fullScreenElement) {
          this.isFullScreen = false;
        } else {
          this.isFullScreen = true;
        }
      };

      document.addEventListener('fullscreenchange', onFullScreenChange);
      document.addEventListener('mozfullscreenchange', onFullScreenChange);
      document.addEventListener('webkitfullscreenchange', onFullScreenChange);
      document.addEventListener('msfullscreenchange', onFullScreenChange);

      // 保存监听器引用以便稍后移除
      this.onFullScreenChange = onFullScreenChange;
    },
    removeFullScreenChangeListener() {
      document.removeEventListener('fullscreenchange', this.onFullScreenChange);
      document.removeEventListener('mozfullscreenchange', this.onFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange);
      document.removeEventListener('msfullscreenchange', this.onFullScreenChange);
    },
    //刷新缓存令牌
    refreshPowerBIToken(){
        var vm=this
        var embedUrl ,reportId
        const id = this.id;

      getBIReportUrl({id: id}).then((responseObj) => {

        if(responseObj.data!=null){

            vm.powerbiDiv = true
            //返回的数据放入本地数据
            this.embedUrl = responseObj.data.embedUrl
            this.reportId = responseObj.data.reportId
            this.pageName = responseObj.data.pageName
            //判断是否第一次
            if(vm.accessToken == '' || this.userRefresh){
                this.userRefresh = false
                vm.accessToken = responseObj.data.accessToken
                // get the access token. Do not add "Bearer"
                var models = window['powerbi-client'].models;
                var permissions = models.Permissions.All;
                // Embed configuration used to describe the what and how to embed.
                // This object is used when calling powerbi.embed.
                // https://learn.microsoft.com/zh-cn/javascript/api/overview/powerbi/configure-report-settings
                var config = {
                    //显示类型
                    type: 'report',
                    //令牌模式
                    tokenType: models.TokenType.Bearer,
                    //设置返回的参数，令牌，嵌入地址，报表id，报表页
                    accessToken: vm.accessToken,
                    embedUrl: this.embedUrl,
                    id: this.reportId,
                    pageName: this.pageName,
                    //操作权限
                    permissions: permissions,
                    settings: {
                        //显示右侧菜单
                        navContentPaneEnabled: true,
                        //国际化
                        localeSettings: {
                            language: "en-us",
                        },
                        panes: {
                            //搜索框设置默认不打开
                            filters: {
                                expanded: false,
                                visible: true
                            }
                        },
                        bars: {
                            //下方缩放条
                            statusBar: {
                                visible: true
                            },
                        }
                    }
                };
                // Grab the reference to the div HTML element that will host the report.
                var container = this.fullScreenElement;
                // Embed the report and display it within the div container.
                vm.report = powerbi.embed(container, config);
            }else{
                //刷新缓存中的令牌
                vm.accessToken = responseObj.data.accessToken
                vm.report.setAccessToken(vm.accessToken)
            }
        }else{
            //遮罩
            vm.powerbiDiv = false
        }
      });
    },
	},
	mounted: function() {
    // 在组件挂载后，引用public/static/powerbi/powerbi.js的内容
    const script = document.createElement('script');
    script.src = '/static/powerbi/powerbi.js';
    script.async = true;
    document.body.appendChild(script);

    this.fullScreenElement = this.$refs['fullScreenElement'];
    this.addFullScreenChangeListener();
    //页面加载完成，刷新缓存令牌
    this.refreshPowerBIToken()

    //设置定时刷新
    if(this.powerbiDiv){
        this.timer = window.setInterval(() => {
            this.refreshPowerBIToken()
        },this.INTERVAL_TIME)
    }
	},
  destroyed() {
      //销毁定时器
      window.clearInterval(this.timer)
  }
};
</script>

<style>
iframe {
  border: 0; /* 设置边框宽度为0，隐藏边框 */
  border-style: none; /* 设置边框样式为无 */
  outline: none; /* 隐藏聚焦时的轮廓线 */
}
.power-bi-css{
  z-index: 100;
}
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 10px;
  z-index: 9999;
  background-color: white; /* 可以根据需要调整背景色 */
  overflow: auto; /* 允许内容滚动 */
  box-sizing: border-box; /* 包括 padding 在内计算宽度和高度 */
}
  .report-full-css{
    font-size: 18px !important;
    height: 100% !important;
    width: 40px !important;
  }

</style>
