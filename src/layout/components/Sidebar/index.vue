<template>
  <div
    :style="{ background: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <div class="menus">

      <div style="float: left;">
        <a @click="toHome">
          <img src="../../../assets/MoovLogoSmall.png" style="height:56px;"/>
        </a>
      </div>

      <div class="menu-class1">
        <el-menu
          :default-active="activeMenu"
          :background="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
          :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
          :unique-opened="true"
          :active-text-color="settings.theme"
          mode="horizontal"
        >
          <!-- 根据 sidebarRouters 路由，生成菜单 -->
          <energy-tabs
            :privateDevicesList="sidebarRouters"
          />
          <!--            <sidebar-item
                        v-for="(route, index) in sidebarRouters"
                        :key="route.path  + index"
                        :item="route"
                        :base-path="route.path"
                      />-->
        </el-menu>
<!--        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">

        </el-scrollbar>-->
      </div>

      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <div class="user-nickname">
              <p><span v-if="nickname">{{ nickname }}</span></p>

              <p>{{ email }}</p>
            </div>
            <img :src="avatar" class="user-avatar">
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user/profile">
              <el-dropdown-item> {{ $t('homePage.personalCenter') }}</el-dropdown-item>
            </router-link>
<!--            <el-dropdown-item @click.native="setting = true">-->
<!--              <span>{{ $t('homePage.layoutSettings') }}</span>-->
<!--            </el-dropdown-item>-->
            <el-dropdown-item divided @click.native="logout">
              <span>{{ $t('homePage.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div style="float: right;width: 30px;height: 30px;line-height: 30px;margin-top: 15.5px;color:#fff; ">
<!--        <div style="float: left;margin-left: -18px;">-->
<!--          <notify-message style="float: left;line-height: 30px;"/>-->
<!--        </div>-->
<!--        <div style="float: left;margin-left: -18px;">-->
<!--          <Subscribe style="float: left;line-height: 30px; "/>-->
<!--        </div>-->
        <div style="float: left;margin-left: -18px;">
          <chat-line style="float: left;line-height: 30px;"/>
        </div>

<!--        <div style="float: left;margin-left: -18px;">
          <el-button style="font-size: 20px;border: 0px;background-color:transparent;"  class="el-icon-phone-outline" type="primary" @click="dialogVisible = true"></el-button>
        </div>-->
        <el-drawer :visible.sync="dialogVisible" custom-class="chat-drawer"  size='40%' title="I am the title" :with-header="false">
        </el-drawer>
<!--        <div style="float: left;margin-left: -10px;">-->
<!--          <chat-function style="float: left;line-height: 30px;"/>-->
<!--        </div>-->

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import Logo from "./Logo"
import SidebarItem from "./SidebarItem"
import variables from "@/assets/styles/variables.scss"
import { getUserProfile } from "@/api/system/user";

import language from '@/components/ChangeLanguage'
import Search from '@/components/HeaderSearch'
import NotifyMessage from '@/layout/components/Message'
import ChatLine from '@/layout/components/ChatLine'
import Subscribe from '@/layout/components/Subscribe'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import {getPath} from "@/utils/ruoyi"
import MenuItem from "@/layout/components/Sidebar/Item.vue";
import EnergyTabs from "@/layout/components/Sidebar/EnergyTabs.vue";

export default {
  components: {
    EnergyTabs,
    MenuItem, SidebarItem, Logo ,
    language,
    Search,
    ChatLine,
    NotifyMessage,
    Subscribe,
    Screenfull,
    SizeSelect,
  },
  data(){
    return{
      dialogVisible:false,
      email:'',
      editPrivateDevicesList: [
        {
          privateDeviceName: '测试-切换栏'
        },
        {
          privateDeviceName: '测试-切换栏'
        },
        {
          privateDeviceName: '测试-切换栏'
        },
        {
          privateDeviceName: '测试-切换栏'
        },
        {
          privateDeviceName: '测试-切换栏'
        },
        {
          privateDeviceName: '测试-切换栏'
        }
      ],
      currIndex: 0
    }
  },
  created() {
    getUserProfile({}).then((res)=>{
      this.email=res.data.email
    })
  },

  mounted() {
    let newArr =this.sidebarRouters.filter(item => item.hidden === false)
    this.editPrivateDevicesList = newArr
  },

  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    ...mapGetters([
      'sidebar',
      'avatar',
      'nickname',
      'device'
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  methods: {
    toHome(){
      this.$router.push('/index')
    },
    async logout() {
      this.$modal.confirm(this.$t('systm.logOut'), '提示').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = getPath('/login');
        })
      }).catch(() => {});
    }

  }



};

</script>

<style lang="scss" scoped>
::v-deep .chat-drawer {
  height: 60%;
}
.menus{
  margin: 0 auto;
}
.menu-scroll{
  float: left;
  max-width: calc(100% - 495px);
  margin-right: 10px;
}

.menu-class1{
  float: left;
  max-width: calc(100% - 495px);
  margin-right: 10px;
}

  .right-menu {
    float: right;
    height: 100%;
    //line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #eee;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(240, 244, 242, 0.025)
        }
      }
    }

    .lanuage-component{

      display: inline-block;
      padding: 0 8px;
      height: 100%;
      color: #eee;

    }

    .avatar-container {
      // margin-right: 30px;



      .avatar-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;

        }
        .user-nickname{
           margin-right: 10px;
           text-align: right;
           width: 190px;
           line-height: 12px;
           font-size: 12px;
           white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 隐藏溢出部分 */
        text-overflow: ellipsis; /* 显示省略号 */
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
// - - - - - 移动端设置
@media screen and (max-width: 599px) {

  .menu-scroll{
    float: left;
    width: 30%;
  }
}

</style>
