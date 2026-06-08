<template>
  <div class="page-forgot-password-container">
    <header>
      <!-- logo -->
      <img src="@/assets/Moov_Log.png" alt="logo" />
    </header>
    <main>
      <div class="main-left">
        <div class="main-left-title">
          <!-- title -->
          <!-- 返回上一级 -->
          <el-button
            class="back"
            type="text"
            icon="el-icon-arrow-left"
            @click="goBack"
          ></el-button>
          <div class="text">Forgot Password</div>
        </div>
        <div class="main-left-tips">
          <i class="el-icon-warning"></i>
          <span class="tips">
            Forgot your password? Use this option to reset your account
            password.
          </span>
        </div>
        <!-- 表单主体 -->

        <el-form :model="user" ref="form" label-position="top" :rules="rules">
          <!-- Email -->
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input clearable v-model="user.email" placeholder="Enter Email">
              <template slot="append">
                <span v-if="remainingTime > 0" class="time"
                  >{{ remainingTime }}s</span
                >
                <el-tooltip
                  v-else
                  effect="dark"
                  content="The verification code will be sent to the account you entered"
                  placement="bottom"
                >
                  <el-button
                    @click="getCode('forgotPassword')"
                    class="code"
                    :disabled="disableButton"
                    >Get Code</el-button
                  >
                </el-tooltip>
              </template></el-input
            >
          </el-form-item>
          <!--  code -->
          <el-form-item
            :label="$t('forgotPassword.verificationCode')"
            prop="verificationCode"
          >
            <el-input
              clearable
              :disabled="getCodeTime === 0"
              v-model="user.verificationCode"
              placeholder="Enter Code"
            />
          </el-form-item>
          <!-- new password -->
          <el-form-item
            class="form-text-button-item"
            prop="newPassword"
          >
            <template slot="label">
              {{ $t('userInfo.newPassword') }} 
              <!-- 密码格式提示 -->
                <el-tooltip class="item" effect="dark" placement="right" popper-class="password-tips-popover">
                  <!-- content -->
                  <div slot="content">
                    <div class="password-tips">
                      <div>Passwords must be8–15 characters long and contain:</div>
                      <div>• At least one uppercase letter (A–Z)</div>
                      <div>• At least one lowercase letter (a–z)</div>
                      <div>• At least one number (0–9)</div>
                      <div>• At least one special character (e.g. @, #, !)</div>
                    </div>
                  </div>
                  <i class="el-icon-info" style="cursor:pointer;color:#ccc"></i>
                </el-tooltip>
            </template>
            <el-input
              clearable
              :type="passwordVisible ? 'text' : 'password'"
              class="password"
              v-model="user.newPassword"
              placeholder="Enter password"
            >
            <!-- 使用 slot 插入自定义图标/图片 -->
              <template slot="suffix">
                <img
                  :src="passwordVisible ? '/static/images/login/eye-open.png':'/static/images/login/eye-close.png'"
                  class="toggle-password"
                  @click="passwordVisible = !passwordVisible"
                />
              </template>
          </el-input>
          </el-form-item>
          <!-- confirm password -->
          <el-form-item
            class="form-button-item"
            prop="confirmPassword"
            :label="$t('userInfo.confirmPassword')"
          >
            <el-input
              clearable
              class="password"
              :type="confirmPasswordVisible ? 'text' : 'password'"
              v-model="user.confirmPassword"
              placeholder="Confirm Password"
            >
          <!-- 使用 slot 插入自定义图标/图片 -->
              <template slot="suffix">
                <img
                  :src="confirmPasswordVisible ? '/static/images/login/eye-open.png':'/static/images/login/eye-close.png'"
                  class="toggle-password"
                  @click="confirmPasswordVisible = !confirmPasswordVisible"
                />
              </template>
          </el-input>
          </el-form-item>
        </el-form>
        <el-button
          :loading="isSubmiting"
          class="form-button"
          @click="submit('forgotPassword')"
          >{{ $t("userInfo.submit") }}</el-button
        >
        <!-- tips -->
      </div>
      <!-- TODO 可以抽离出去 -->
      <div class="main-right">
        <!-- 轮播图 -->
        <Swiper />
      </div>
    </main>
    <MoovFooter/>
  </div>
</template>

<script>
import { resetPassword, getVerificationCode } from "@/api/login";
import JSEncrypt from "jsencrypt";
import { getPublicKey } from "@/api/utils/utils";
import Swiper from "@/ui-refactor/components/Swiper";
import {
  removeTenantId,
  removeTenantName,
  setTenantId,
  setTenantName,
  removeToken,
} from "@/utils/auth";
import { getTenantIdByName } from "@/api/system/tenant";
import MoovFooter from '@/ui-refactor/components/MoovFooter'

export default {
  name: "page-forgot-password",
  components: {
    Swiper,
    MoovFooter
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("Please enter same password"));
      } else {
        callback();
      }
    };
    return {
      isSubmiting: false,
      loginDataEmail: "",
      getCodeTime: 0,
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
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~`()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/,
            message:
              "Please enter a valid password",
            trigger: "blur",
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
      unlockRules: {
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
          },
        ],
        verificationCode: [
          {
            required: true,
            message: "Verification Code cannot be empty",
            trigger: "blur",
          },
        ],
      },
      bannerList: [
        {
          id: 1,
          url: `/static/images/login/banner1.png`,
          text: "Our ocean freight services serve as the backbone of global trade, offering reliable, cost-effective ",
        },
        {
          id: 2,
          url: `/static/images/login/banner1.png`,
          text: "Our ocean freight services serve as the backbone of global trade, offering reliable, cost-effective ",
        },
      ],
      passwordVisible: false,
      confirmPasswordVisible: false,
    };
  },
  watch: {
    'user.email': function (newValue) { if(newValue) {
      this.disableButton = false;
    }else { this.disableButton = true; };
    }
  },
  mounted() {
    // 回显用户邮箱
    this.loginDataEmail = this.$route.query.email;
    this.user.email = this.loginDataEmail;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
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
      this.getCodeTime += 1;
      if (!this.user.email) {
        this.$toast.warning("Please fill in your email.");
        return false;
      }
      this.$refs[type == "Unlock" ? "unLockForm" : "form"].validateField(
        "email",
        (isValid) => {
          if (!isValid) {
            // 发送验证码请求成功后，启动计时器
            // this.startTimer();
            // 2025.4.20 刘一林
            // 定义场景
            const scenario = "RESET_PASSWORD";
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
                    this.$toast.success(
                      "The verification code has been sent to " +
                        this.user.email
                    );
                  }
                });
              } else {
                this.$toast.info(
                  "Your email has not been registered, please contact Smartmoovsupport@moovlogistics.com "
                );
              }
            });
          }
        }
      );
    },
    submit(type) {
      // console.log("submit type:", type);
      if (this.getCodeTime == 0) {
        this.$toast.warning("Please get the verification code first.");
        return;
      }
      this.$refs[type == "Unlock" ? "unLockForm" : "form"].validate((valid) => {
        if (valid) {
          this.isSubmiting = true;
          removeTenantId();
          removeTenantName();
          removeToken();
          const scenario = "RESET_PASSWORD";
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
                  oldPassword:
                    type === "forgotPassword"
                      ? encrypt.encrypt(this.user.newPassword)
                      : "",
                  newPassword:
                    type === "forgotPassword"
                      ? encrypt.encrypt(this.user.newPassword)
                      : "",
                  code: encrypt.encrypt(this.user.verificationCode),
                };
                resetPassword(data)
                  .then((response) => {
                    if (response.data) {
                      const msg =
                        type == "Unlock"
                          ? "Account unlocked successfully."
                          : "Password changed successfully.";
                      this.$toast.success(msg);
                      this.toLogin(null);
                    }
                  })
                  .catch((error) => {
                    this.remainingTime = 0;
                    this.disableButton = false;
                    this.user.verificationCode = "";
                  });
                // this.toLogin(null);
                this.isSubmiting = false;
              });
            }
          });
        }
      });
    },

    toLogin(e) {
      this.$refs.form.resetFields();
      this.$router.push({ path: "/login",query: { reset:true } });
    },
    close() {
      this.$tab.closePage();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-forgot-password-container {
  padding: 2rem 3.6rem 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  header {
    width: 100%;
    img {
      width: 14rem;
    }
  }
  main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .main-left {
      width: 36rem;
      .main-left-title {
        font-size: 2.4rem;
        color: var(--moov-text-color);
        margin-bottom: 1.2rem;
        text-align: center;
        display: flex;
        align-items: center;
        .back {
          width: 1.6rem;
          font-size: 1.6rem;
          .el-icon-arrow-left:before {
            font-weight: 900;
          }
        }
        .text {
          margin-left: 6.8rem;
          font-weight: 900;
        }
      }
      .main-left-tips {
        background-color: #e3f5ff;
        padding: 1.6rem;
        display: flex;
        border-radius: 0.8rem;
        align-items: center;
        justify-content: center;
        height: 4.8rem;
        i {
          font-size: 1.6rem;
          color: #589be2;
        }
        .tips {
          margin-left: 1.2rem;
          color: #4e5969;
          font-size: 1.2rem;
        }
      }
      .form-button {
        width: 100%;
        height: 6rem;
        background-color: var(--moov-button-background-color);
        color: #fff;
        border-radius: var(--moov-border-radius);
        border: none;
        font-size: 1.6rem;
        margin-top: 2.4rem;
      }
    }
    .main-right {
      margin-left: 11.5rem;
      width: 50rem;
      height: 68.5rem;
      .content {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-radius: 3.2rem;
        padding: 0 4rem;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        .text {
          color: #fff;
          font-size: 1.8rem;
          margin-bottom: 7rem;
        }
      }
    }
  }
}

// reset element-ui style
::v-deep .el-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  .el-form-item {
    margin-bottom: 0 !important;
    &.is-error {
      border: 0 !important;
      .el-input {
        border: 1px solid var(--moov-text-color-red) !important;
      }
    }

    .el-form-item__label {
      padding-bottom: 0.5rem;
      position: relative;
      color: #4e5969;
      font-weight: 900;
      font-size: 1.6rem !important;
      &::before {
        display: none;
      }
    }
    .el-form-item__content {
      .el-input {
        height: 6rem;
        background: var(--moov-input-background-color);
        border-radius: var(--moov-border-radius);
        .el-input-group__append {
          border: 0;
          background: transparent;
          padding:0 2rem;
          .code {
            color: var(--moov-text-color-blue);
            font-size: 1.6rem;
            font-weight: bold;
            border: 0;
            &:hover {
              background: transparent;
              border: 0;
            }
          }
          .time {
            color: var(--moov-text-color-blue);
          }
        }
        .el-input__inner {
          font-size: 1.6rem;
          height: 100%;
          // 去掉边框
          border-width: 0;
          // border: 0;
          border-radius: 0.8rem !important;
        }
        &.password {
          .el-icon-view {
            &:hover {
              color: var(--moov-text-color-blue);
            }
          }
        }
      }
      .el-form-item__error {
        font-size: 1.4rem;
        color: var(--moov-text-color-red);
        margin-top: 0.5rem;
        position: absolute;
      }
    }
  }
  .el-form-item:not(:has(.el-button)) {
    /* 这里添加 .el-form-item 不存在 .el-button 时的样式属性 */
    border: 0;
  }
  .el-form-item__label {
    background: #fff !important;
    border-right: 0 !important;
  }
}
/* 或者使用图片作为背景 */
::v-deep .el-icon-circle-close {
  background: url('/static/images/login/cancel.png') no-repeat center;
  background-size: 16px;
  /* 隐藏原文字 */
  font-size: 0;
  /* 调整宽高 */
  width: 20px;
  height: 20px;
}
::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .el-input__suffix-inner{
  display: flex;
  align-items: center;
  gap: 16px;
  img{
    width: 18px;
    height: 18px;
    cursor: pointer;
    order: 1;
  }

}
}

</style>
<style>
.password-tips-popover {
  max-width: 40rem !important;
  white-space: nowrap;
}
</style>
