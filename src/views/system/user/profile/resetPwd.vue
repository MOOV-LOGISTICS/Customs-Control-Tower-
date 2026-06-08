<template>
  <el-form class="restPwdForm" :show-message="true"	 	 size='mini' ref="form" :model="user" :rules="rules" label-width="180px">
    <el-form-item :label="$t('userInfo.oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="$t('userInfo.pleaseEnterTheOldPassword')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('userInfo.newPassword')"  prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="$t('userInfo.pleaseEnterANewPassword')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('userInfo.confirmPassword')"  prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="$t('userInfo.pleaseConfirmThePassword')" type="password" show-password />
    </el-form-item>
    <el-form-item label-width="0px">
      <el-button size="mini"  type="primary"  @click="submit">{{ $t('userInfo.submit') }}</el-button>
<!--      <el-button size="mini"  type="danger"  @click="close">{{ $t('userInfo.close') }}</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import {getPath} from "@/utils/ruoyi"


export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("Please enter same password"));
      } else {
        callback();
      }
    };
    const validPassword = ['password', '123456', '123456789', 'qwerty', 'abc123', 'letmein', 'welcome', '111111', 'asdfgh' ]

    return {
      test: "1test",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "The current password cannot be empty", trigger: "blur" }
        ],
        newPassword:  [
          {
            required: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~`()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/,
            message: "Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). ",
            trigger: "blur"
          },
        ],
        confirmPassword: [
          { required: true, message: "Confirm password cannot be empty", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
            response => {
              this.$modal.msgSuccess("Success");
              this.$confirm('Password changed successfully, please log in again.', {
                  dangerouslyUseHTMLString: true,
                      confirmButtonText: "Confirm",
                      showCancelButton: false,
                      type: 'warning'
              }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                  location.href = getPath('/login');
                });
              }).catch(() => {});
            }
          );
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
.restPwdForm .el-form-item {
  margin-bottom: 20px !important;;
}
</style>

