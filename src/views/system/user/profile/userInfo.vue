<template>
  <el-form class="userInfoForm" :show-message="false"	 	 size='mini' ref="form" :model="user" :rules="rules" label-width="120px">
    <el-form-item label="User Name" prop="nickName">
      <el-input v-model="user.nickname" />
    </el-form-item>
    <el-form-item :label="$t('userInfo.firstName')" prop="firstName">
      <el-input v-model="user.firstName" />
    </el-form-item>
    <el-form-item :label="$t('userInfo.familyName')" prop="familyName">
      <el-input v-model="user.familyName" />
    </el-form-item>
    <!-- <el-form-item :label="$t('userInfo.mobilePhone')" prop="mobilePhone">
      <el-input v-model="user.mobilePhone" />
    </el-form-item> -->
    <el-form-item :label="$t('userInfo.businessPhone')" prop="businessPhone">
      <el-input v-model="user.businessPhone" />
    </el-form-item>
    <!-- <el-form-item :label="$t('userInfo.fax')" prop="fax">
      <el-input v-model="user.fax" />
    </el-form-item> -->
    <!-- 2025.4.20 刘一林 -->
    <el-form-item :label="$t('userInfo.email')" prop="email">
      <el-input v-model="user.email" maxlength="50" disabled/>
    </el-form-item>
    <el-form-item label-width="0px">
      <el-button size="mini"  type="primary"  @click="submit">{{ $t('userInfo.submit') }}</el-button>
<!--      <el-button size="mini"  type="danger"  @click="close">{{ $t('userInfo.close') }}</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { updateUserProfile } from "@/api/system/user";

  export default {
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        // 表单校验
        rules: {
          nickname: [
            { required: true, message: "用户昵称不能为空", trigger: "blur" }
          ],
          email: [
            { required: true, message: "邮箱地址不能为空", trigger: "blur" },
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          mobile: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            {
              pattern: /^1[3|456789][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateUserProfile(this.user).then(response => {
              this.$modal.msgSuccess("Success");
            });
          }
        });
      },
      close() {
        this.$tab.closePage();
      }
    }
  };
</script>
<style>
.userInfoForm .el-form-item {
  margin-bottom: 20px !important;; 
}
</style>