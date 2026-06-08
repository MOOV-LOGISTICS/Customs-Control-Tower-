<template>
  <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView,sidebarHide:sidebar.hide}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}" style="box-shadow: 0 1px 15px 1px rgba(81,77,92,.5);
    z-index: 999;
    background: #fff;
    position: relative;">
        <navbar  :tenantName="tenantName"  />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
      <div style="text-align:center ;height: 35px;line-height:35px;color: #337ab7;border-top:1px solid #337ab7;background:#fff; ">
        <div>
        <rating-popup @close-popup="showPopup = false" v-if="showPopup"></rating-popup>
        <!-- <button @click="showPopup = true">任意界面弹出五星好评</button> -->
      </div>
        <a href="https://www.moovlogistics.com/" target="_blank">Copyright © 2019-{{new Date().getFullYear()}} MOOV || </a>
        <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备20009454号-1</a>
      </div>

    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar,
  // TagsView
} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import RatingPopup from '../views/system/support/star/index.vue';
import {getStar} from "@/utils/auth";

import {createStayLog} from "@/api/system/stayLog";
import {getAccessToken, getTenantId, getTenantName} from '@/utils/auth'
import axios from 'axios'
  import { getUserProfile } from "@/api/system/user";
  import auth from "@/plugins/auth";

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    RatingPopup,
    // TagsView
  },
  data() {
    return {
      showPopup: false,
      tenantName:''
    };
  },
  created() {
        if (auth.hasPermi("system:tenant:query")) {
              this.tenantName = getTenantName()
        }
  },
  mounted() {
    var day = 7;
    var minite = 2;
    var status = this.getDictDatas(this.DICT_TYPE.SYSTEM_STAR);
    for (let dic of status) {
      var label = dic.label;
      var value = dic.value;
      if(label==="loop_day"&&value!=null){
        day = value;
      }
      if(label==="loop_minite"&&value!=null){
        minite = value;
      }
    }
    console.log(day)
    console.log(minite)
      var intervalId = setInterval(()=>{
        const strTime = getStar();
        let star=new Date(strTime);
        var endData = this.addDays(star,day);
        if(strTime==null||endData<new Date()) {
          this.showPopup = true
          clearInterval(intervalId);
        } else {
          clearInterval(intervalId);
        }
      },1000*60*minite); // 1000*60 1分钟
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        hideSidebar: false,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    addDays(date, days) {
      date.setDate(date.getDate() + days);
      return date;
    },
  },
  watch: {
              // 监听路由对象$route的变化
              '$route': {
                handler: function (to, from) {
                  // 路由发生变化时执行的代码
                  console.log('Route changed from', from.path, 'to', to.path);

                  let t = (new Date().getTime() - window.timeStr)
                    let result = {
                        curTime: new Date(),
                        fromUrl: window.from,
                        fromFull: window.fromFull,
                        toUrl: window.location.pathname,
                        toFull: window.location.href,
                        stayTime: t
                    };
                    //重置数据
                    resetData()

                    //发送监控数据-----------------------
                    sendTimeData(result)
                },
                // 设置为深度监听
                deep: true
              }
            }
}

let intervalId;
function addListenerPage() {
            try {
              startTimer();
                document.addEventListener("visibilitychange", () => {
                  if (document.visibilityState == "hidden") {
                    // console.log("离开");// 结算并取消定时
                    clearInterval(intervalId);
                    let t = (new Date().getTime() - window.timeStr)  // 计算时间差
                    let result = {
                        curTime: new Date(),
                        fromUrl: window.from,
                        fromFull: window.fromFull,
                        toUrl: window.location.pathname,
                        toFull: window.location.href,
                        stayTime: t
                    };
                    //重置数据
                    resetData()
                    //发送监控数据-----------------------
                    sendTimeData(result)
                  } else {
                    // console.log("回来");// 重置并开始定时
                    //重置数据
                    resetData()
                  }
                });
                window.addEventListener("load", () => {
                  resetData()
                    // console.log("开始监控")
                });

            } catch (error) {
                console.log("信息上报异常", error);
            }
        }
        function startTimer() {
          try {
                // 定时检查用户是否有操作
                intervalId = setInterval(() => {
                let t = (new Date().getTime() - window.timeStr)  // 计算时间差
                // console.log("stayTime:"+t);
                if (t > 60*1000) { // 如果超过一分钟，调用回调函数
                  // 上报时间；并重置时间
                  let result = {
                        curTime: new Date(),
                        fromUrl: window.from,
                        fromFull: window.fromFull,
                        toUrl: window.location.pathname,
                        toFull: window.location.href,
                        stayTime: t
                    };
                    //重置数据
                    resetData()

                    // console.log(`用户停留时间超过一分钟，时间差：${t}`);

                    //发送监控数据-----------------------
                    sendTimeData(result)

                }
              }, 3*1000); // 每30秒检查一次
            } catch (error) {
                console.log("信息上报异常", error);
            }
        }
        function resetData() {
          window.timeStr = new Date().getTime()
          window.fromFull = window.location.href
          window.from = window.location.pathname
        }
        function sendTimeData(result) {
          try {
            const tenantId = getTenantId();
            const token = getAccessToken();
            const name = getTenantName();
            if(tenantId==null||token==null||name==null) {
            } else {
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token,
                'tenant-id' : tenantId
              };
              // 发送POST请求
              // axios.post(process.env.VUE_APP_BASE_API + "/admin-api/system/stay-log/create", result, { headers: headers })
              //   .then(response => {
              //     //console.log('Success:', response.data);
              //   })
              //   .catch(error => {
              //     console.error('Error:', error);
              //   });
            }
          // console.table(result)
            } catch (error) {
                console.log("信息上报异常", error);
            }
        }
        addListenerPage()


</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: calc(100%);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
