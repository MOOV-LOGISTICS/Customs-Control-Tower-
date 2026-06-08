<template>
  <el-form
    class="forgotPassword"
    :show-message="true"
    v-loading="loading"
    size="mini"
    ref="form"
    :model="user"
    :rules="rules"
    label-width="180px"
  >
  <!-- 2025.4.20 刘一林 -->
    <el-form-item
      :label="$t('login.email')"
      prop="email"
      inline-message
      class="code-css password-form-item"
    >
      <el-input
        v-model="user.email"
        @input="changeCodeBut"
      >
        <el-button
          style="background-color: rgb(0, 79, 124)"
          slot="append"
          :disabled="disableButton"
          @click="getCode"
        >
          <span v-if="remainingTime > 0">{{ remainingTime }}s</span>
          <el-tooltip
            v-else
            content="The Verification Code will be sent to the Account you entered"
            placement="bottom"
            effect="light"
          >
            <span style="color: #ffffff">Get Code</span>
          </el-tooltip>
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item
      :label="$t('forgotPassword.verificationCode')"
      prop="verificationCode"
      inline-message
      class="password-form-item"
    >
    <!-- 2025.4.20 刘一林 -->
      <el-input
        v-model="user.verificationCode"
      />
    </el-form-item>
    <el-form-item
      :label="$t('userInfo.newPassword')"
      prop="newPassword"
      inline-message
      class="password-form-item"
    >
      <el-input
        v-model="user.newPassword"
        type="password"
        show-password
      />
    </el-form-item>
    <!-- 当抛出长文本异常后使用 <br> 标签 加一个空行保证低分辨率用户也能完全看见报错 -->
    <br v-if="shouldAddEmptyLine" />
    <el-form-item
      :label="$t('userInfo.confirmPassword')"
      prop="confirmPassword"
      inline-message
      class="password-form-item"
    >
      <el-input
        v-model="user.confirmPassword"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label-width="0px">
      <el-button type="primary" @click="submit">{{
        $t("userInfo.submit")
      }}</el-button>
    </el-form-item>
  </el-form>
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
            trigger: "blur" },
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
                      "Passwords must contains uppercase letters, lowercase letters, and numbers"
                    )
                );
                } else {
                  callback(
                    new Error(
                      "Passwords must contains uppercase letters, lowercase letters, and numbers"
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
      loading: false,
    };
  },
  props: {
    loginData: {
      type: Object,
      default: null,
    },
    loginDataEmail:{
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
    this.user.email = this.loginData.email;
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
    getCode() {
      this.$refs["form"].validateField("email", (isValid) => {
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
    submit() {
      this.$refs["form"].validate((valid) => {
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
                  oldPassword: encrypt.encrypt(this.user.newPassword),
                  newPassword: encrypt.encrypt(this.user.newPassword),
                  code: encrypt.encrypt(this.user.verificationCode),
                };
                resetPassword(data).then((response) => {
                  if (response.data) {
                    this.$modal.msgSuccess("Success");
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
  },
};
</script>
