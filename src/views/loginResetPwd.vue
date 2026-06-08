<template>
  <el-form :show-message="true"	 class="passwordform"	 size='mini' ref="form" :model="user" :rules="rules" label-width="180px">
    <el-form-item v-if="useType === 'new'" :label="$t('userInfo.firstName')" prop="firstName">
      <el-input v-model="user.firstName" />
    </el-form-item>
    <el-form-item  v-if="useType === 'new'" :label="$t('userInfo.familyName')" prop="familyName">
      <el-input v-model="user.familyName" />
    </el-form-item>
    <el-form-item v-if="useType === 'new'" :label="$t('userInfo.businessPhone')" prop="businessPhone">
      <el-input v-model="user.businessPhone" />
    </el-form-item>
    <el-form-item :label="$t('userInfo.oldPassword')" prop="oldPassword">
      <el-input v-model="currentPassword"   type="password" show-password  disabled />
    </el-form-item>
    <el-form-item :label="$t('userInfo.newPassword')"  prop="newPassword">
      <el-input v-model="user.newPassword"  type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('userInfo.confirmPassword')"  prop="confirmPassword">
      <el-input v-model="user.confirmPassword"  type="password" show-password />
    </el-form-item>
    <el-form-item label-width="0px" size="small" style="text-align: right;">
      <el-button  type="primary"  @click="submit">{{ $t('userInfo.submit') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<style>

</style>

<script>
import {
  initPassword,
} from "@/api/login";
import JSEncrypt from 'jsencrypt';

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("Please enter same password"));
      } else {
        callback();
      }
    };
    return {
      user: {
        // oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        // oldPassword: [
        //   { required: true, message: "Old password cannot be empty", trigger: "blur" }
        // ],
        newPassword: [
          { required: true, message: "The new password cannot be empty", trigger: "blur" },
          {
            required: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~`()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/,
            message: "Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). ",
            trigger: "blur" },
          {
           trigger: 'blur',
           validator: (rule, value, callback) => {
             var passwordreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
             console.log(passwordreg.test(value))
             if (!passwordreg.test(value)) {
               callback(new Error('Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). '))
             }
             else{
               callback()
             }
           }
         },
        ],
        confirmPassword: [
          { required: true, message: "Confirm password cannot be empty", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        firstName: [
          { required: this.useType === 'new', message: "First Name cannot be empty", trigger: "blur" }
        ],
        familyName: [
          { required: this.useType === 'new', message: "Family Name cannot be empty", trigger: "blur" }
        ],
        businessPhone: [
          { required: this.useType === 'new', message: "Business Phone cannot be empty", trigger: "blur" },
          {
           trigger: 'blur',
           validator: (rule, value, callback) => {
             var passwordreg = /^[\d-]{1,20}$/;
             console.log(passwordreg.test(value))
             if (!passwordreg.test(value)) {
               callback(new Error('Business Phone must contain only digits and hyphens'))
             }
             else{
               callback()
             }
           }
         },
        ],
      }
    };
  },
  props: {
    loginData: {
        type: Object,
        default: null,
    },
    useType: {
      type: String,
      default: null
    },
    currentPassword: {
      type: String,
      default: null
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var encrypt = new JSEncrypt();
          encrypt.setPublicKey(this.loginData.encrypt);
          var data = {
            email: this.loginData.email,
            oldPassword: encrypt.encrypt(this.currentPassword),
            newPassword: encrypt.encrypt(this.user.newPassword),
            firstName: this.user.firstName,
            familyName: this.user.familyName,
            businessPhone: this.user.businessPhone,
          }
          initPassword(data).then(
            response => {
                //window.location.href = "/index";
                this.toLogin(data.newPassword)
            }
          );
        }
      });
    },

    toLogin(e) {
        this.$emit('resetSucc',e)
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
