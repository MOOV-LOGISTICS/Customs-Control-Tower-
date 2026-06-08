<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card" style="padding: 20px;" :style="{'height':height}">
          <div slot="header" class="clearfix">
            <span>{{ $t('userInfo.generalInformation') }}</span>
          </div>
          <div>
            <div style="text-align: center;padding-top: 15px;">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />{{ $t('userInfo.userName') }}
                <div class="pull-right">{{ user.nickname }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />{{ $t('userInfo.userEmail') }}
                <div class="pull-right" style="overflow:auto; width:60%; text-align: right; scrollbar-width: none">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />Party
                <div class="pull-right" v-if="user.dept">{{ user.dept.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />{{ $t('userInfo.role') }}
                <div class="pull-right" v-if="user.roles">{{ user.roles.map(role => role.name).join(',') }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />{{ $t('userInfo.creationDate') }}
                <div class="pull-right">{{ parseTime(user.createTime) }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card style="padding: 20px;" :style="{'height':height}">
          <div slot="header" class="clearfix">
            <span>{{ $t('userInfo.password') }}</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('userInfo.ChangeYourPassword')" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
            <el-tab-pane :label="$t('userInfo.generalInformation')" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import userSocial from "./userSocial";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd, userSocial },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      height:'',
      activeTab: "resetPwd"
    };
  },
  created() {
    this.getUser();
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 165 + "px";
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
    },
    setActiveTab(activeTab) {
      this.activeTab = activeTab
    }
  }
};
</script>
