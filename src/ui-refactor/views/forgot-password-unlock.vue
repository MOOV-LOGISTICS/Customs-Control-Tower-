<!--
 * @Author: Carrie c.yuting@moovlogistics.com
 * @Date: 2025-11-06 16:50:20
 * @LastEditors: Carrie c.yuting@moovlogistics.com
 * @LastEditTime: 2025-12-18 15:37:08
 * @FilePath: \controltowerspring\yudao-ui-admin\src\views\forgot-password-unlock.vue
 * @Description: 给忘记密码和解锁页面添加tab切换功能
 * 
-->
<template>
  <el-tabs type="border-card" @tab-click="tabClick">
   
    <el-tab-pane label="Forgot Password">
        <p style="margin-top: 0px;">
         <i class="el-icon-warning icon-large" style="color: orange; margin-right: 5px; " />Forgot your password? Use this option to reset your account password.
      </p>
  
      <el-form class="forgotPassword" :show-message="true" v-loading="loading" size="mini" ref="form" :model="user"
        :rules="rules" label-width="180px">
        <el-form-item :label="$t('login.email')" prop="email" inline-message class="code-css password-form-item">
          <el-input v-model="user.email" @input="changeCodeBut">
            <el-button style="background-color: rgb(0, 79, 124)" slot="append" :disabled="disableButton"
              @click="getCode('forgotPassword')">
              <span v-if="remainingTime > 0">{{ remainingTime }}s</span>
              <el-tooltip v-else content="The Verification Code will be sent to the Account you entered"
                placement="bottom" effect="light">
                <span style="color: #ffffff">Get Code</span>
              </el-tooltip>
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('forgotPassword.verificationCode')" prop="verificationCode" inline-message
          class="password-form-item">
          <el-input v-model="user.verificationCode" :disabled=" getCodeTime === 0" placeholder="Please get the verification code first."  />
        </el-form-item>
        <el-form-item :label="$t('userInfo.newPassword')" prop="newPassword" inline-message class="password-form-item">
          <el-input v-model="user.newPassword" type="password" show-password  autocomplete="new-password" />
        </el-form-item>
        <br v-if="shouldAddEmptyLine" />
        <el-form-item :label="$t('userInfo.confirmPassword')" prop="confirmPassword" inline-message
          class="password-form-item">
          <el-input v-model="user.confirmPassword" type="password" show-password  autocomplete="new-password"/>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-button type="primary" @click="submit('forgotPassword')">{{
            $t("userInfo.submit")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <!-- <el-tab-pane label="Unlock">
      <p style="margin-top: 0px;">
         <i class="el-icon-warning icon-large" style="color: orange; margin-right: 5px;" />Use this option to unlock your account to restore access, if you still remember correct password.
      </p>
      <el-form class="forgotPassword" :show-message="true" v-loading="loading" size="mini" ref="unLockForm" :model="user"
        :rules="unlockRules" label-width="180px">
        <el-form-item :label="$t('login.email')" prop="email" inline-message class="code-css password-form-item">
          <el-input v-model="user.email" @input="changeCodeBut">
            <el-button style="background-color: rgb(0, 79, 124)" slot="append" :disabled="disableButton"
              @click="getCode('Unlock')">
              <span v-if="remainingTime > 0">{{ remainingTime }}s</span>
              <el-tooltip v-else content="The Verification Code will be sent to the Account you entered"
                placement="bottom" effect="light">
                <span style="color: #ffffff">Get Code</span>
              </el-tooltip>
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('forgotPassword.verificationCode')" prop="verificationCode" inline-message
          class="password-form-item">
          <el-input v-model="user.verificationCode"   :disabled="getCodeTime === 0" placeholder="Please get the verification code first." />
        </el-form-item>
        <el-form-item label-width="0px">
          <el-button type="primary" @click="submit('Unlock')">Unlock</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane> -->
  
  </el-tabs>

</template>
<style lang="scss" scoped>
.el-form-item.code-css.is-required.el-form-item--mini {
  border: 1px solid #dae7e7;
}

.el-input-group__append {
  border: 1px solid #dcdfe6;
}

.password-form-item {
  margin-bottom: 20px !important;
}
</style>

<script>
import { resetPassword, getVerificationCode } from "@/api/login";
import JSEncrypt from "jsencrypt";
import { getPublicKey } from "@/api/utils/utils";
import {
  removeTenantId,
  removeTenantName,
  setTenantId,
  setTenantName,
  removeToken,
} from "@/utils/auth";
import { getTenantIdByName } from "@/api/system/tenant";

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
      getCodeTime:0,
      remainingTime: 0,
      disableButton: true,
      timer: null,
      //是否空行
      shouldAddEmptyLine: false,
      user: {
        email: null,
        verificationCode: null,
        newPassword: null,
        confirmPassword: null,
      },

      // 表单校验
      rules: {
        email: [
          {
            required: true,
            message: "Account cannot be empty",
            trigger: "blur",
          },
          //2025.4.20 刘一林
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address",
            trigger: "blur",
          },
        ],
        verificationCode: [
          {
            required: true,
            message: "Verification Code cannot be empty",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "The new password cannot be empty",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~`()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/,
            message: "Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). ",
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              var passwordreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
              console.log(passwordreg.test(value));
              if (!passwordreg.test(value)) {
                //判断当前浏览器窗口尺寸是否小于1440 低于就给报错信息加一个空行 2025.4.20 刘一林
                if (window.innerWidth < 1440) {
                  this.shouldAddEmptyLine = true
                  callback(
                    new Error(
                      "Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). "
                    )
                  );
                } else {
                  callback(
                    new Error(
                      "Password must be 8–15 characters and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @,#,!). "
                    )
                  );
                }

              } else {
                callback();
              }
            },
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Confirm password cannot be empty",
            trigger: "blur",
          },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
      unlockRules:{
        email: [
          {
            required: true,
            message: "Account cannot be empty",
            trigger: "blur",
          },
          //2025.4.20 刘一林
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address",
          }
        ],
          verificationCode: [
          {
            required: true,
            message: "Verification Code cannot be empty",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  props: {
    loginData: {
      type: Object,
      default: null,
    },
    loginDataEmail: {
      type: String,
      default: null,
    }
  },
  watch: {
    loginDataEmail: {
      handler(newVal) {
        if (newVal) {
          this.user.email = this.loginDataEmail;
          this.user.newPassword = ''
          this.disableButton = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.user.email = this.loginDataEmail;
  },
  methods: {
    changeCodeBut(val) {
      if (val != null) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    },
    startTimer() {
      this.disableButton = true;
      this.remainingTime = 60;
      this.timer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime === 0) {
          clearInterval(this.timer);
          this.disableButton = false;
        }
      }, 1000);
    },
    getCode(type) {
      this.getCodeTime += 1
       if(!this.user.email){
          this.$message({
           message: 'Please fill in your email.',
           type: 'warning'
         });
         return false
      }
      this.$refs[type == 'Unlock' ? 'unLockForm' : 'form'].validateField("email", (isValid) => {
        if (!isValid) {
          // 发送验证码请求成功后，启动计时器
          // this.startTimer();
          // 2025.4.20 刘一林
          // 定义场景
          const scenario = 'RESET_PASSWORD';
          getTenantIdByName(this.user.email, scenario).then((res) => {
            if (res.data && res.data.id >= 0) {
              const tenantId = res.data.id;
              const tenantName = res.data.name;
              // 发送验证码请求成功后，启动计时器
              this.startTimer();
              console.log("1");
              // 设置租户
              setTenantId(tenantId);
              console.log("2");
              setTenantName(tenantName);
              console.log("3");
              getVerificationCode(this.user.email).then((res) => {
                if (res.data) {
                  this.$modal.msgSuccess(
                    "The verification code has been sent to " + this.user.email
                  );
                }
              });
            } else {
              this.$message('Your email has not been registered, please contact Smartmoovsupport@moovlogistics.com ');
            }
          });
        }
      });
    },
    submit(type) {
      // console.log("submit type:", type);
      if(this.getCodeTime == 0){
        this.$message({
            message: 'Please get the verification code first.',
             type: 'warning'
         });
        return 
      }
      this.$refs[type == 'Unlock' ? 'unLockForm' : 'form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          removeTenantId();
          removeTenantName();
          removeToken();
          const scenario = 'RESET_PASSWORD';
          getTenantIdByName(this.user.email, scenario).then((res) => {
            if (res.data && res.data.id >= 0) {
              const tenantId = res.data.id;
              const tenantName = res.data.name;
              // 设置租户
              setTenantId(tenantId);
              setTenantName(tenantName);
              var encrypt = new JSEncrypt();
              getPublicKey().then((res) => {
                encrypt.setPublicKey(res.data);
                var data = {
                  email: encrypt.encrypt(this.user.email),
                  oldPassword: type === 'forgotPassword' ?  encrypt.encrypt(this.user.newPassword) :'',
                  newPassword:  type === 'forgotPassword'? encrypt.encrypt(this.user.newPassword) : '',
                  code: encrypt.encrypt(this.user.verificationCode),
                };
                resetPassword(data).then((response) => {
                  if (response.data) {
                    const msg = type == 'Unlock' ? 'Account unlocked successfully.' : 'Password changed successfully.'
                    this.$modal.msgSuccess(msg);
                    this.toLogin(null);
                  }
                }).catch(error=>{
                    this.remainingTime = 0
                    this.disableButton = false;
                    this.user.verificationCode = ''
                });
                // this.toLogin(null);
                this.loading = false;
              });
            }
          });
        }
      });
    },

    toLogin(e) {
      this.$refs.form.resetFields();
      this.$emit("forgotSucc", e);
    },
    close() {
      this.$tab.closePage();
    },
    tabClick(){
      this.user={
        email: this.loginDataEmail,
        newPassword: '',
        verificationCode: '',
        confirmPassword:''
      },
      this.remainingTime = 0
      this.getCodeTime = 0;
      this.disableButton = false;
    }
  },
};
</script>
