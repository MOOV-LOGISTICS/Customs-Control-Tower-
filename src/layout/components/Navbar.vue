<template>
  <div class="navbar">

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" :tenantName="tenantName" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div style="float: right;" v-show="showTestEnvBanner" >
      <div class="marquee-container" >
        <div class="marquee-text">smartMOOV !!! TEST !!!</div>
        </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
// import {getPath} from "@/utils/ruoyi"

// import NotifyMessage from '@/layout/components/Message'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
// import language from '@/components/ChangeLanguage';

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    RuoYiGit,
    RuoYiDoc,


    // Screenfull,
    // SizeSelect,
    // Search,
    // NotifyMessage,
    // language
  },
            props: {
                  tenantName: {
                    type: String
                  },
                },
      data() {
            return {
              user: {},
              showTestEnvBanner:false,
            };
          },
          mounted() {
            // 获取当前域名
            const currentHost = window.location.hostname;

            // 检查域名前缀
            if (currentHost.startsWith('ctstage.') ||
              currentHost.startsWith('stage.') ||
              currentHost.startsWith('cttest.') ||
              currentHost=='localhost'
            ) {
              this.showTestEnvBanner = true;
            }
          },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'nickname',
      'device'
    ]),
    // setting: {
    //   get() {
    //     return this.$store.state.settings.showSettings
    //   },
    //   set(val) {
    //     this.$store.dispatch('settings/changeSetting', {
    //       key: 'showSettings',
    //       value: val
    //     })
    //   }
    // },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
      //不需要展开侧边栏 后期去掉面包屑
    }
    // ,
    // async logout() {
    //   this.$modal.confirm('确定注销并退出系统吗？', '提示').then(() => {
    //     this.$store.dispatch('LogOut').then(() => {
    //       location.href = getPath('/index');
    //     })
    //   }).catch(() => {});
    // }
  }
}
</script>

<style lang="scss" scoped>
.marquee-container {
  width: 100%;
  background: #00ff00;
  padding: 10px 10px;
  overflow: hidden;
  z-index: 9999;
}

.marquee-text {
  display: inline-block;
  white-space: nowrap;
  color: black;
  font-size: 16px;
}

/* @keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
} */


.navbar {
  height: 35px;
  overflow: hidden;
  position: relative;
  background: #fff;
  padding-left: 20px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px!important;
  margin: 0 auto;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  // .right-menu {
  //   float: right;
  //   height: 100%;
  //   line-height: 50px;

  //   &:focus {
  //     outline: none;
  //   }

  //   .right-menu-item {
  //     display: inline-block;
  //     padding: 0 8px;
  //     height: 100%;
  //     font-size: 18px;
  //     color: #5a5e66;
  //     vertical-align: text-bottom;

  //     &.hover-effect {
  //       cursor: pointer;
  //       transition: background .3s;

  //       &:hover {
  //         background: rgba(0, 0, 0, .025)
  //       }
  //     }
  //   }

  //   .lanuage-component{

  //     display: inline-block;
  //     padding: 0 8px;
  //     height: 100%;
  //     font-size: 18px;
  //     color: #5a5e66;
  //     vertical-align: text-bottom;
  //   }

  //   .avatar-container {
  //     margin-right: 30px;

  //     .avatar-wrapper {
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       position: relative;

  //       .user-avatar {
  //         cursor: pointer;
  //         width: 35px;
  //         height: 35px;
  //         border-radius: 50%;
  //       }
  //       .user-nickname{
  //         margin-left: 5px;
  //         font-size: 14px;
  //       }

  //       .el-icon-caret-bottom {
  //         cursor: pointer;
  //         position: absolute;
  //         right: -20px;
  //         top: 25px;
  //         font-size: 12px;
  //       }
  //     }
  //   }
  // }
}
</style>
