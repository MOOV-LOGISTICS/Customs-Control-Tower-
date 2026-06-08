<template xmlns="">
  <div class="container">
    <img
      style="    height: 50px; margin-left: 2%; margin-top: 2%;"
      src="../assets/MoovLogoSmall.png"
    />
    <div class="outerLogin">
<!--      <div class="blur-overlay"></div>-->
      <div>
        <el-row>
          <el-col :span="24" class="log-img-div">
            <img
              style="height: 50px; "
              src="../assets/Moov_Log.png"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h1>smartMOOV</h1>
          </el-col>
        </el-row>
      </div>

      <div class="loginDiv" >
        <el-form :show-message="false" size="mini" ref="loginForm" :model="loginForm" :rules="LoginRules">
          <!-- 账号密码登录 -->
          <div v-if="loginForm.loginType === 'uname'">
            <!-- <el-form-item prop="username">
                  <input class="loginInput" v-model="loginForm.username" type="text" auto-complete="off" :placeholder="$t('login.account')"/>
                </el-form-item> -->

            <el-form-item prop="email">
              <el-input class="loginInput" v-model="loginForm.email" :placeholder="$t('login.account')"
                @blur="(e)=>{accoutBlurChange(e)}"  />
            </el-form-item>

            <br />
            <el-form-item prop="password">
              <el-input class="loginInput" v-model="loginForm.password" type="password"
                @blur="loginForm.password = $event.target.value.trim()" :placeholder="$t('login.password')"
                @keyup.enter.native="getCode" :disabled="passwordDisabled" />
            </el-form-item>


            <div v-if="MFAVisible" class="mfa-content">
              <el-input class="loginInput" v-model="emailAuthCode" style="width: 40%;" type="emailAuthCode"
                placeholder="Email OTP" @change="updateEmailAuthCode" />
              <el-button size="medium" :loading="mfaLoading" type="primary" style="width: 55%; height: 36px; margin-top: 2px;  font-weight: bolder;"
                @click="getEmailAuthCode">
                <span>{{ emailCodeCountdown <= 0 ? 'Send Code' : `Resend in ${emailCodeCountdown}s` }}</span>
              </el-button>
            </div>

          </div>


          <!-- ref="verify" -->

          <div v-if="verifyShow">
              <Verify ref="verify" :captcha-type="'blockPuzzle'" :img-size="{ width: '300px', height: '160px' }"
            :rep-data="logoCaptchaData" @success="captchaDatahandleLogin"  @closeVerity="closeVerityChange" />

          </div>
        
          <br />
          <!-- 下方的登录按钮 -->
          <el-form-item style="width: 100%">
            <el-button size="medium" :loading="loading" type="primary" style="width: 100%;   font-weight: bolder;"
              @click.native.prevent="getCode">
              <span v-if="!loading">{{ $t("login.login") }}</span>
              <span v-else>{{ $t("login.loggingIn") }}</span>
            </el-button>
          </el-form-item>


<!--          <br />-->
<!--          <div>-->

<!--            <el-checkbox v-model="checkedYc"/>-->
<!--            I agree to the terms and conditions set forth in the MOOV-->
<!--            <el-link @click="termsShow = true" type="primary">Policy</el-link> and-->
<!--            <el-link @click="policyShow = true" type="primary">Terms</el-link>-->
<!--          </div>-->

          <!--  社交登录 -->
        </el-form>
        <div class="forgot-password" >
          Need help with your <el-link style=" margin-bottom: 2px;" type="primary" @click="showForgotPassword = true" target="_blank"> password </el-link>?
        </div>

        <el-dialog
          :title="$t('forgotPassword.forgotPassword')" append-to-body
          :visible.sync="showForgotPassword"
          :close-on-press-escape="false"
          width="50%" >

          <!-- <forgotPassword  :loginData="forgotUser" :loginDataEmail="loginForm.email"  @forgotSucc="forgotSucc"/> -->
            <forgotPasswordUnlock  :loginData="forgotUser" :loginDataEmail="loginForm.email"  @forgotSucc="forgotSucc"/>

        </el-dialog>

          <!-- :before-close="resetClose" -->
        <el-dialog
          title="Reset Password" append-to-body
          :visible.sync="showResetPassword"
         :close-on-press-escape="false"
          width="50%" >

          <forgotPassword  :loginData="forgotUser" :loginDataEmail="loginForm.email"  @forgotSucc="resetSucc1"/>

        </el-dialog>


        <div class="login-bou-tip">
          <p>New to MOOV's services?<br>
            <el-link style=" margin-bottom: 1px;" type="primary" @click="toGetStarted()" target="_blank">Get started</el-link> with simplifying your supply chain.</p>
        </div>
      </div>
    </div>
    <!-- 图形验证码 -->
<!--    <Verify ref="verify" :captcha-type="'blockPuzzle'" :img-size="{ width: '400px', height: '200px' }"-->
<!--      @success="handleLogin" />-->

<!--    <div  class="cookieDiv" v-if="cookieDivOr">-->
<!--      <span>We use cookies to offer you a better experience-->
<!--      By continuina to use this website, you consent to the use of-->
<!--      cookies in accordance with our cookie notice-->
<!--      </span>-->
<!--      <div class="aDiv">-->
<!--        <a href="##" style="margin-left:2.16em;" @click="closeDiv">Accept</a>-->
<!--      </div>-->
<!--      <div class="bDiv">-->
<!--        <a href="##"  @click="cookieDivOr = false">Decline</a>-->
<!--      </div>-->
<!--    </div>-->
    <!-- footer -->
    <el-dialog
      title="Terms & Conditions" append-to-body custom-class="privacy-dialog"
      :visible.sync="privacyPolicyVisible"
      width="100%" >
      <div v-html="privacyPolicyHtml"></div>
    
      <!-- <div>
        <div class="privacy-container">

          <div class="left-text">
            <h1>smartMOOV Terms & Conditions</h1>

            <br>

            MOOV LOGISTICS SHANGHAI LIMITED (荷瑞国际物流（上海）有限公司) (hereinafter “MOOV”) is the rightful owner of the software
            “smartMOOV”.
            By clicking accept or choosing the accept option below, the User agrees to be bound by the terms and conditions
            hereinunder.
            <br>


            <h2>1. SOFTWARE AND LICENSE</h2>
            1.1 “smartMOOV” (hereinafter the "Software") is a 4PL supply chain management system developed and maintained by MOOV.
            Depending on the User's needs, it provides services including order management, freight management, and inventory
            management. Based on the rules set by the User, information entered by the User and information obtained from third
            parties, the Software enables the User to manage goods and shipments in a visualized manner.
            <br><br>
            1.2 MOOV will activate the corresponding service package after receiving full payment from the User. If the User
            renews
            the service during the validity period, MOOV shall adjust the validity period of the package accordingly. Upon
            activation of any package, the User obtains the right to use of the Software within the scope of the package.
            <br><br>
            1.3 Different packages may have respective validity periods. Upon expiration of a package, the User's right to use the
            Software under that package will be terminated; however, packages that have not expired will remain unaffected. Upon
            expiration of a package, the User's right to use of the package will cease.
            <br><br>
            1.4 The fees for each package are independent and cannot be transferred to other packages. Any unused portion of a
            package will not be carried over to the next period upon expiration.
            <br><br>

            <h2>2. USER'S RIGHTS AND OBLIGATIONS</h2>


            2.1 The User has the right to use the Software in accordance with the Agreement during the validity period of the
            package.
            <br><br>
            2.2 The User is responsible for providing and maintaining the necessary hardware, software, and network environment
            required to access the Software.
            <br><br>
            2.3 The User shall register an account on Software, complete enterprise certification (if so required by MOOV), and
            activate the service before using the services provided by MOOV.
            <br><br>
            2.4 The User shall properly safeguard all usernames, passwords, etc., and shall not disclose or share them with any
            third party. If the User becomes aware that a username, password, etc., has been disclosed or may have been disclosed,
            the User shall immediately notify MOOV and relevant parties in writing and immediately cease using the disclosed
            username, password, etc. The User shall not, without MOOV's permission, rent, lend, transfer, gift, or otherwise
            provide
            any username or password to any party. If MOOV discovers such actions, MOOV may immediately terminate all services and
            terminate this Agreement, and the User shall bear all consequences and liabilities arising therefrom. The User is
            responsible for approving and adding employee accounts (including agent accounts) and shall properly manage the login,
            use, and password protection of all accounts registered under the User's enterprise on Software. If an employee leaves
            or is no longer authorized to operate an account, the User shall promptly deactivate the account and modify the
            username, password, etc. If assistance is needed, the User may consult MOOV to remove the account. (MOOV will not be
            able to access the data in the account.) All login and operation activities under the User's accounts are deemed to be
            authorized by the User, and all actions taken under the accounts are deemed to be actions of the User's enterprise,
            for
            which the User shall bear full responsibility.
            <br><br>
            2.5 If the User uses an agent, the User shall create an account for the agent and, based on the User's subscribed
            package and requirements, set account permissions and order categories, etc. Operations under the agent's account are
            deemed to be operations of the User. If the User sets up an account for a supplier, the provisions regarding agents
            shall apply.
            <br><br>
            2.6 The User warrants that the search keywords provided when querying logistics data are legally obtained for the
            User's
            business operations or as entrusted by the User's customers, or obtained based on other legitimate reasons, and will
            not
            infringe upon the legitimate rights and interests of any third party.
            <br><br>
            2.7 The User warrants that the data queried, viewed, and transmitted through Software is limited to lawful business
            use
            by the User. Without MOOV's prior written consent, the User shall not provide, disclose, or leak such data in any form
            to any third-party platform, including the owners, developers, and maintainers of third-party platforms.
            <br><br>
            2.8 The User shall cooperate with MOOV in the joint debugging and testing of the Software and its interfaces, and
            shall
            be responsible for providing and maintaining the necessary hardware facilities and network environment required to
            receive the services.
            <br><br>
            2.9 If the User uses the API data interface to transmit data, the User shall comply with the specifications set forth
            in
            the standard technical documentation provided by MOOV (or as otherwise agreed by both Parties). MOOV shall not be
            liable
            for any consequences arising from the User's failure to output data in accordance with the documentation provided by
            MOOV (or as otherwise agreed), and the User shall bear full responsibility for such consequences.
            <br><br>
            2.10 The User shall comply with the operational guidelines issued by MOOV for the Software. The User shall not use
            Software illegally or engage in any activities that may harm the interests of MOOV or any third party. The User shall
            not send information unrelated to cargo declaration, such as illegal files, Trojan programs, virus programs, or
            information prohibited by the laws and regulations of the jurisdictions where MOOV and the User are located.
            <br><br>
            2.11 The User is responsible for preventing Software from being illegally accessed, illegally transmitted, or
            otherwise
            interfered with in a manner that may affect normal operations, and for protecting business records and data
            information
            from illegal intrusion, tampering, or destruction. The User shall not exploit vulnerabilities or faults in Software to
            engage in any improper operations or harm the interests of MOOV or any third party. Rather User shall inform MOOV on
            timely basis so that highlighted vulnerability or fault can be addressed by MOOV on time for smooth experience of
            User.
            The User shall ensure that all data requests are based on normal requests and not on malicious requests, data
            scraping,
            etc. MOOV reserves the right to judge such behaviors and temporarily disconnect the connection.
            <br><br>
            2.12 The User shall not reverse engineer Software, illegally copy or imitate Software, or independently, entrust, or
            instruct any third party to operate a business similar to Software. Otherwise, the User shall bear all direct or
            indirect losses caused to MOOV (including investigation fees, attorney fees, etc.).
            <br><br>
            2.13 The User shall not provide services identical or similar to Software, nor shall the User provide the technology,
            documentation, or data of the Software to any third party or allow any third party to use them. Otherwise, MOOV has
            the
            right to terminate the services without assuming any legal liability, and MOOV reserves the right to claim
            infringement
            against the User.
            <br><br>
            2.14 The User shall not claim intellectual property rights over any data generated through the use of the Software.
            <br><br>

            <h2>3. MOOV’S RIGHTS AND OBLIGATIONS</h2>

            3.1 MOOV shall provide the User with the right to use the Software in accordance with this Agreement.
            <br><br>
            3.2 MOOV is responsible for developing and maintaining the Software, integrating and generating reports, and enabling
            order management, cargo management, and inventory management based on rules set by the User, information input by the
            User, and information obtained from third parties.
            <br><br>
            3.3 MOOV is responsible for providing the User with continuously improved and optimized services. MOOV shall make all
            commercially reasonable efforts to ensure the stability of the Software.
            <br><br>
            3.4 MOOV shall provide the User with the necessary technical and operational support for the integration and use of
            the
            Software, including but not limited to telephone, remote, and email consultation services, to ensure the testing,
            going
            live, and stable operation of the Software.
            <br><br>
            3.5 MOOV shall ensure that the User's use of the Software does not infringe upon any third party's intellectual
            property
            rights. If a third party to this Agreement sues the User on the grounds that the User's lawful and reasonable use of
            the
            Software infringes upon their intellectual property rights, MOOV shall provide necessary assistance to the User in
            defending against such claims. If a court ruling determines that the infringement was directly caused by MOOV's
            actions,
            MOOV shall bear the corresponding liability for damages.
            <br><br>
            3.6 MOOV is committed to providing the User with higher quality and more stable services. During this period, MOOV may
            make some optimizations and upgrades to the services, which will be announced on important pages or notified to the
            User
            by other means (including but not limited to email, SMS, or in-software notifications). If the User fails to notice
            such
            notifications and suffers losses as a result, MOOV shall not be liable for such losses.
            <br><br>
            3.7 MOOV shall ensure the security and privacy of the User's data and shall not disclose the User's business-related
            information to any third party. However, this does not apply to disclosures required by government authorities,
            judicial
            authorities, or regulatory bodies in accordance with legal procedures.
            <br><br>
            3.8 If MOOV discovers that the User has violated the terms of this Agreement, engaged in actions that compromise
            business or information security, illegally used the Software, or illegally transmitted data, or if MOOV has reason to
            believe that any of the User's data or information (or third-party information) violates any applicable laws or
            regulations or infringes upon the rights of any third party, or if MOOV believes that the User's continued use of
            Software will cause serious harm to MOOV, other users, or third parties or violate legal provisions, MOOV has the
            right
            to require the User to delete such data or information (or third-party information), correct the violation, and cease
            the infringing actions. Upon receiving MOOV's notice, the User shall immediately comply with such requests. If the
            User
            fails to comply, MOOV has the right to terminate this Agreement and the User's right to use Software, and MOOV shall
            not
            be liable for any losses suffered by the User as a result. The User shall compensate MOOV or any third party for all
            losses caused thereby (including but not limited to penalties imposed by government authorities, compensation to third
            parties, loss of reputation, attorney fees, investigation fees, litigation/arbitration fees, preservation fees, etc.).
            <br><br>
            3.9 For the purpose of network system security, MOOV has the right to require the User to verify their electronic
            signature when necessary.
            <br><br>
            3.10 During the validity period of this Agreement, MOOV is obligated to retain the User's data in the Software. After
            the retention period expires, MOOV is no longer obligated to retain the User's data. The agreement between the User
            and
            MOOV on the retention period of the data shall prevail.
            <br><br>
            3.11 The User authorizes MOOV to use the User's company name and logo for the purpose of promoting MOOV and the
            Software.
            <br><br>


            <h2>4. PAYMENT</h2>

            4.1 The usability of this Software depends on the intime payment of the User. In case the User fails to pay in full
            and
            in time, all accounts under the account may be suspended.
            <br><br>

            <h2>5. LIABILITY FOR BREACH</h2>
            5.1 If any Party breaches the terms of this Agreement but has not caused serious consequences, the other Party may
            suspend the performance of this Agreement until the breaching Party provides corresponding guarantees and rectifies
            the
            breach, after which the other Party may resume performance or provide the corresponding services.
            <br><br>
            5.2 The User shall bear all losses caused by improper use of Software (including but not limited to fines imposed by
            government authorities, breach of agreement or infringement compensation to third parties, loss of business
            reputation,
            attorney fees, investigation fees, litigation/arbitration fees, preservation fees, etc., incurred by MOOV in
            protecting
            its legal rights).
            <br><br>


            <h2>6. CONFIDENTIALITY</h2>
            6.1 Both Parties shall keep confidential the trade secrets and other confidential information obtained during the
            cooperation, including technical, documentation, and data information. Without the other Party's written consent,
            neither Party may disclose confidential information to any third party.
            <br><br>

            <h2>7. FORCE MAJEURE</h2>
            7.1 If either Party is unable to perform its obligations under this Agreement due to any event of Force Majeure, it
            shall immediately notify the other Party and make every effort to take remedial measures. During this period, neither
            Party shall be liable for any delays, omissions, or errors in data or the risks and liabilities arising therefrom.
            <br><br>

            <h2>8. DISCLAIMER</h2>
            8.1 Due to the particularity of computers and the internet, MOOV shall not be liable for any inability of the Software
            to function properly or for the User's inability to use the Software caused by circumstances beyond MOOV's control,
            such
            as hacker attacks, network viruses, technical adjustments or maintenance by telecommunications departments, line
            failures, government-imposed temporary shutdowns, power system failures, or restricted power supply. However, for
            malfunctioning on MOOV's side, MOOV shall promptly address the issue to restore normal services as soon as possible.
            <br><br>
            8.2 MOOV does not have the capacity or obligation to verify the authenticity, accuracy, completeness, or legality of
            the
            information entered by the User or the User's agents, including transportation plans, shipment information, shipping
            instructions, and verified gross mass (VGM) of containers, nor does MOOV have the ability or obligation to verify the
            timeliness of adjustments or changes made by the User or the User's agents (including suppliers). Therefore, MOOV
            shall
            not be liable for any direct or indirect pecuniary losses or related liabilities incurred by the User or its agents
            due
            to such issues. However, MOOV will assist the User in resolving disputes arising from such issues.
            <br><br>
            8.3 MOOV does not have the capacity or obligation to verify the timeliness and accuracy of information obtained from
            third parties regarding vessels, bills of lading, container numbers, or container statuses. Therefore, MOOV shall not
            be
            liable for any direct or indirect pecuniary losses or related liabilities incurred by the User or their agents due to
            such issues.
            <br><br>
            8.4 MOOV shall not be liable for any losses incurred by the User due to the User's failure to download their data
            within
            the data retention period after the expiration of the Agreement.
            <br><br>
            8.5 The User expressly agrees that they will make independent judgments and decisions based on the information
            obtained
            through Software and shall bear the risks arising therefrom. MOOV shall not be liable for any direct or indirect
            losses
            resulting from the User's judgments or decisions based on the information obtained through the Software.
            <br><br>

            <h2>9. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
            9.1 The conclusion, execution, and interpretation of this Agreement shall be governed by the laws of the People's
            Republic of China.
            <br><br>
            9.2 Any disputes arising from or related to this Agreement shall first be resolved through friendly negotiations
            between
            the Parties. If no resolution is reached within 30 days from the date the dispute arises, either Party may file a
            lawsuit with the competent people's court in the location of MOOV's domicile. The losing Party shall bear the
            litigation
            fees, preservation fees, preservation insurance fees, notarization fees, appraisal fees, reasonable attorney fees, and
            reasonable travel expenses incurred by both Parties.
            <br><br>
            <h2>10. PERSONAL INFORMATION PROTECTION</h2>
            10.1 Both Parties expressly acknowledge and agree that: 1) all logistics information that does not include personally
            identifiable information does not constitute personal information; 2) both Parties shall, to the extent possible,
            exclude personally identifiable information from logistics information to limit the disclosure of personal
            information;
            3) for unavoidable and reasonable disclosures of personal information, such as contact names, phone numbers, and email
            addresses, MOOV obtains such information on the basis of the purpose of fulfilling this Agreement; 4) the User and the
            personal information owner may request MOOV to delete such personal information, but the User shall provide an
            alternative solution to ensure that MOOV can continue to provide services without the necessary information, thereby
            avoiding losses to the User; 5) the personal privacy policy published on MOOVs official website applies to the
            protection of personal information.
            <br><br>
            <h2>11. MISCELLANEOUS</h2>
            11.1 This Agreement shall become effective upon being signed or sealed by both Parties and shall remain in effect
            until
            the expiration of all packages subscribed to by the User. Upon expiration, the provisions of this Agreement regarding
            data storage, intellectual property ownership of the Software and data, confidentiality, personal information
            protection, liability for breach, governing law and dispute resolution shall continue to be valid.
            <br><br>
            11.2 After the effectiveness of this Agreement, MOOV has the right to modify or supplement the relevant terms. If the
            User continues to use Software, it shall be deemed that the User agrees to such modifications or supplements. If the
            User does not agree to such modifications or supplements, the User shall immediately notify MOOV in writing to
            terminate
            this Agreement and cease using Software. This Agreement shall be terminated on the date MOOV receives the User's
            termination notice, and neither Party shall be liable to the other for the termination of this Agreement.
            <br><br>
            11.3 If any provision of this Agreement is deemed invalid by a people's court due to a violation of mandatory legal
            provisions, the validity of the remaining provisions shall not be affected.
            <br><br>
            11.4 MOOV is entitled to update the version of this Agreement from time to time with notice to the User.
            <br><br>
            11.5 Any agreement on logistics, IT and software executed between the User and MOOV shall prevail the contemplations
            herein and shall not be affected by the modifications, supplementary and updates of this Agreement.
            <br><br>

          </div>
        </div>

      </div> -->
      <div class="privacy-check"  >
        <el-checkbox v-model="checked" size="medium" style="color: #fff; border: 0;" border @change="checkedChange">
          I agree to all the above regulations
        </el-checkbox>
      </div>

  <!-- </span> -->
    </el-dialog>

    <el-dialog
      :title=" useType === 'new'?  'Set user information and new password' :'Change Password'"
      :visible.sync="resetPwdVisible"
      width="50%" >
      <loginResetPwd :loginData="resetUser" :useType="useType" :currentPassword="loginForm.password" @resetSucc="resetSucc"/>

    </el-dialog>

    <div v-if="showCookies"  style=" background-color: rgb(242, 242, 242,0.85); position: fixed;
    bottom: 5%; border-radius: 10px; left: 1%; width: 98%; ">
      <div  >
        <div  ><div>
          <div   style="text-align: center;" >

            <p style="margin-right: 10px; font-size: 14px;">

              We use cookies to offer you a better experience on our website. If you decline,a single cookie will be used in your browser to remember your preference.
            <div style="margin-right: 3%;     margin-top: 5px;">
              <el-link class="accept-cookies"  @click="acceptCookies">Accept</el-link>
              <el-link @click="declineCookies">Decline</el-link>
            </div>

            </p>
          </div>


        </div></div>
      </div>
    </div>

    <div class="login-footer">
      <div class="terms-conditions"  >
        <span @click="toPP">Terms & Conditions</span>
      </div>
      <div  class="copyright"  >
        <a href="https://www.moovlogistics.com/" target="_blank">Copyright © 2019-{{new Date().getFullYear()}} MOOV | </a>
        <a href="https://beian.miit.gov.cn/" target="_blank"> 沪ICP备20009454号-1</a>
      </div>
    </div>


  </div>
</template>

<script>
import { sendSmsCode, socialAuthRedirect, getMFAVerificationCode, getPrivacyAgreement } from "@/api/login";
import { getTenantIdByName } from "@/api/system/tenant";
import { getPublicKey } from "@/api/utils/utils";
import { SystemUserSocialTypeEnum } from "@/utils/constants";
import { getCaptchaEnable, getTenantEnable } from "@/utils/ruoyi";
import {
  getPassword,
  getRememberMe,
  getTenantName,
  getUsername,
  getEmail,
  removeTenantId,
  removePassword,
  removeRememberMe,
  removeTenantName,
  removeUsername,
  removeEmail,
  setPassword,
  setRememberMe,
  setTenantId,
  setTenantName,
  setUsername,
  setEmail,
} from "@/utils/auth";

import Verify from "@/components/Verifition/Verify";
import { resetUserPwd } from "@/api/system/user";
import JSEncrypt from 'jsencrypt';

import loginResetPwd from "./loginResetPwd";
import forgotPassword from "./forgot-password";
import forgotPasswordUnlock from "./forgot-password-unlock";

import { Notification } from 'element-ui'
import moment from "moment";


export default {
  name: "Login",
  components: {
    Verify,loginResetPwd,forgotPassword, forgotPasswordUnlock
  },
  data() {
    return {
      showForgotPassword: false,
      checked:0,
      privacyPolicyVisible:false,
      cookieDivOr: true,
      termsShow:false,
      policyShow:false,
      checkedYc:false,
      loginLanguage: this.$t("login.accountLogin"),
      codeUrl: "",
      captchaEnable: true,
      tenantEnable: true,
      mobileCodeTimer: 0,
      resetPwdVisible:false,
      resetUser:{
        email: null,
        encrypt: null,
      },
      forgotUser:{},
      loginForm: {
        loginType: "uname",
        username: "",
        privacyPolicy: 0,
        email: "",
        password: "",
        captchaVerification: "",
        mobile: "",
        mobileCode: "",
        rememberMe: false,
      },
      scene: 21,
      showCookies:false,
      LoginRules: {
        // username: [
        //   {required: true, trigger: "blur", message: "用户名不能为空"}
        // ],
        email: [
          { required: true, type: "email", trigger: "blur", message: "邮箱不能为空" },
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
        mobile: [
          { required: true, trigger: "blur", message: "手机号不能为空" },
          {
            validator: function (rule, value, callback) {
              if (
                /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/.test(
                  value
                ) === false
              ) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      loading: false,
      redirect: undefined,
      // 枚举
      SysUserSocialTypeEnum: SystemUserSocialTypeEnum,
      showResetPassword: false,
      logoCaptchaData: '',
      emailAuthCode: '',
      emailCodeCountdown: 0,
      MFAVisible: false,
      emailCodeTimer: null,
      needPassword: false,
      mfaLoading: false,
      privacyPolicyHtml:'',
      passwordDisabled: false,
      useType: null,
      verifyShow: false
    };
  },
  created() {
    // this.loginForm.privacyPolicy = localStorage.getItem('privacy');
    //localStorage.removeItem('privacy');
    if (this.getCookie2("acceptCookie") == null) {
      this.showCookies = true
    }
    this.checkCookie()

    // 租户开关
    this.tenantEnable = getTenantEnable();
    // 验证码开关
    this.captchaEnable = getCaptchaEnable();
    // 重定向地址
    this.redirect = this.$route.query.redirect
      ? decodeURIComponent(this.$route.query.redirect)
      : undefined;
    this.getCookie();
  },
  beforeDestroy() {
    // 清除验证码倒计时定时器
    this.clearEmailCodeCountdown()
    this.logoCaptchaData = ''
    this.MFAVisible = false
  },
  methods: {
    closeVerityChange(){
        // this.loading = false
        // if(this.$refs.verify){
        // this.$refs.verify.closeBox('1111')
        // }
        // this.verifyShow = false
      
    },
    openForgotPassword() {
      this.showForgotPassword = true;
    },
    forgotSucc() {
      this.showForgotPassword = false
    },
    resetSucc1() {
      this.forgotUser = {}
      this.showResetPassword = false
    },
    // resetClose() {
    //   this.forgotUser = {}
    //   this.showResetPassword = false
    //   this.$router.push({ path: this.redirect || "/" }).catch(() => { });
    // },
    acceptCookies(){
       this.setCookie("acceptCookie", "true", 300);
       this.showCookies = false
    },
    declineCookies(){
       this.setCookie("acceptCookie", "false", 7);
       this.showCookies = false
    },
    resetSucc(newPwd){
       this.$message({
           message: 'Modification successful. Please log in again.',
           type: 'warning'
         });
      this.resetPwdVisible = false
      this.loginForm.password = ''
      
      // this.handleLogin({},newPwd)
    },
    checkedChange(val){
      if(val){
        this.loginForm.privacyPolicy = 1
        this.privacyPolicyVisible = false
        this.handleLogin({},null)
      }
    },
   toGetStarted(){
      window.open("/get-started", "_blank");

   },
   toPP(){
      window.open("/privacy-statement", "_blank");
   },
   getCookieData (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1);
          if (c.indexOf(name) != -1){
            return c.substring(name.length, c.length);
          }
        }
        return "";
  },
  setCookie (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
  clearCookie  (name) {
      this.setCookie(name, "", -1000);//设置天数
  },
  checkCookie() {
      var user = this.getCookieData("loginCookie");
      if (user != "") {
        this.cookieDivOr=false
      } else {
          this.cookieDivOr=true
      }
  },
  closeDiv(){
      this.setCookie('loginCookie','1',1000)//设置天数
      this.cookieDivOr = false
  },
  getCode() {
    // 情况一，未开启：则直接登录
    if (!this.captchaEnable) {
      this.handleLogin({});
      return;
    }

    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    //this.$refs.verify.show();
  },
  // 获取cookie
    getCookie2(name) {
      let nameEQ = name + "=";
      let cookies = document.cookie.split(';');
      for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
        }
      }
      return null;
    },
    updateEmailAuthCode(val) {
      console.log("🚀 ~ updateEmailAuthCode ~ val:", val)
      this.emailAuthCode = val
    },

    clearEmailCodeCountdown() {
      if (this.emailCodeTimer) {
        clearInterval(this.emailCodeTimer)
        this.emailCodeTimer = null
      }
      this.emailCodeCountdown = 0
    },
    getEmailAuthCode() {
      this.mfaLoading = true
      if (!this.loginForm.email) {
        this.$message.warning('Please fill in your email.')
        this.mfaLoading = false
        return
      }
      // 检查倒计时是否进行中
      if (this.emailCodeCountdown > 0) {
        this.mfaLoading = false
        return
      }
      getMFAVerificationCode(this.loginForm.email).then((res) => {
        if (res.data) {
          this.$modal.msgSuccess(
            "The verification code has been sent to " + this.loginForm.email
          );
          this.startEmailCodeCountdown()
        }
      }).catch((err) => {
        console.log(err,'ERERERER')
        this.mfaLoading = false
      });

    },

    passwordExpireChange(){
      this.$alert(
        `Your password has expired and must be changed. Please change your password`,'Password Expired',
        {
          confirmButtonText: 'Change Password',
          type: 'warning'
        }
      ).then(() => {
       this.resetPwdVisible = true
       this.useType = 'old'
      }).catch(() => {
      
      });
 
    },

    startEmailCodeCountdown() {
      this.emailCodeCountdown = 60;
      this.emailCodeTimer = setInterval(() => {
        this.emailCodeCountdown--;
        if (this.emailCodeCountdown <= 0) {
          this.mfaLoading = false;
          this.clearEmailCodeCountdown()
        }
      }, 1000);
    },

    getCookie() {
      const username = getUsername();
      const password = getPassword();
      const email = getEmail();

      const rememberMe = getRememberMe();
      const tenantName = getTenantName();
      this.loginForm = {
        ...this.loginForm,
        username: username ? username : this.loginForm.username,
        password: password ? password : this.loginForm.password,

        email: email ? email : this.loginForm.email,
        privacyPolicy: this.loginForm.privacyPolicy,

        rememberMe: rememberMe ? getRememberMe() : false,
        tenantName: tenantName ? tenantName : this.loginForm.tenantName,
      };
    },

    captchaDatahandleLogin(data) {
      this.logoCaptchaData = data?.captchaVerification
      if (this.needPassword) {
        return
      } else {
        this.handleLogin(data?.captchaVerification)
      }
      if(this.$refs.verify){
        this.$refs.verify.closeBox()
        }
        this.verifyShow = false
    },
    getPrivacyPolicy(){
      getPrivacyAgreement().then((res) => {
        console.log("🚀 ~ res:",res, res.data instanceof Blob)
        if (res) {
          this.privacyPolicyHtml = res
          this.privacyPolicyVisible = true;
        }
      }).catch((err) => {
        console.error("Failed to fetch privacy policy:", err);
      });
    },
    accoutBlurChange(e) {
      this.loginForm.email = e.target.value.trim()
      if(this.MFAVisible){
        this.passwordDisabled = false
        this.MFAVisible = false
      }
    },
    handleLogin(captchaParams, resetPwd) {
      if(this.verifyShow){
        if(this.$refs.verify){
        this.$refs.verify.closeBox()
        }
        this.verifyShow = false
      }
      var vm = this
      this.needPassword = false
      if(this.MFAVisible && !this.emailAuthCode){
           this.$message({
                 message: 'Please enter the email verification code',
                type: 'warning'
          });
        return false
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          removeTenantId()
          removeTenantName()
          getTenantIdByName(this.loginForm.email).then((res) => {
            if (res.data && res.data.id >= 0) {
              const tenantId = res.data.id;
              const tenantName= res.data.name;
              // 设置租户
              setTenantId(tenantId);
              setTenantName(tenantName);
              this.loading = true;
              // 设置 Cookie
              if (this.loginForm.rememberMe) {
                setUsername(this.loginForm.username);
                setPassword(this.loginForm.password);
                setRememberMe(this.loginForm.rememberMe);
                setEmail(this.loginForm.email);
              } else {
                removeUsername();
                removePassword();
                removeRememberMe();
                removeEmail();
              }
              // this.loginForm.captchaVerification = captchaParams.captchaVerification;

              if (this.logoCaptchaData) {
                this.loginForm.captchaToken = this.logoCaptchaData
              }
              // 发起登陆
              getPublicKey().then((res)=>{
                this.logoCaptchaData = ''
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(res.data);
                var data=JSON.parse(JSON.stringify(this.loginForm))
                data.email=encrypt.encrypt(data.email)
                data.password=encrypt.encrypt(data.password)
                if(resetPwd){
                  data.password= resetPwd
                }
                data.privacyPolicy= vm.loginForm.privacyPolicy

                this.resetUser.email = data.email
                this.resetUser.encrypt = res.data

                 if (this.emailAuthCode) {
                  data.emailAuthCode = this.emailAuthCode
                }

                this.$store
                .dispatch(
                  data.loginType === "sms" ? "SmsLogin" : "Login",
                  data
                )
                .then((res) => {
                  if(res.passwordExpireDay?.length > 0 && res.passwordExpireDay[0] && res.passwordExpireDay[1] && res.passwordExpireDay[2]){
                    const [year,month, day] = res.passwordExpireDay;
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const _passwordExpireDay = `${day} ${monthNames[parseInt(month) - 1]}, ${year}`;
                    const passwordExpireDayLeft = res.remainingDays
                     const notify = Notification.warning({
                        title: 'Password Expiry',
                        dangerouslyUseHTMLString: true,
                        customClass: `${passwordExpireDayLeft == 0 ? `today-password-expire-notify password-expire-notify`:'password-expire-notify' }`,
                        showClose: false,
                         message:
                         this.$createElement('div', [
                          this.$createElement('h4',{
                            style: { fontSize: '18px', color: '#004F7C', marginBottom: '5px' }
                          }, 'Password Expiry.'),
                          this.$createElement('p', `Your password will expire on ${passwordExpireDayLeft == 0 ? 'today' : _passwordExpireDay}.`),
                          this.$createElement('p', `Days remaining: ${passwordExpireDayLeft}.`),
                          this.$createElement('p', 'Please change your password before expiry, to avoid interruption in access.'),
                          this.$createElement(
                            'div',
                            { style: { display: 'flex', justifyContent: `${passwordExpireDayLeft == 0 ? 'right' : 'space-between'}`, marginTop: '10px' } },
                            [
                              this.$createElement(
                                'div',
                                {
                                  style: { 
                                    border: '1px solid #ccc', 
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    borderRadius: '4px',
                                    backgroundColor: '#004F7C',
                                    color: '#fff'
                                  },
                                  on: { click: () => {  this.$router.replace('/user/profile'); notify.close(); } }
                                  
                                },
                                'Change Password'
                              ),
                              this.$createElement(
                                'div',
                                {
                                  style: { 
                                    border: '1px solid #ccc', 
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    display: `${passwordExpireDayLeft == 0 ? 'none' : 'block' }`
                                  },
                                  on: { click: () => { notify.close(); } }
                                },
                                'Remind me later'
                              )
                            ]
                          )
                         ]),
                        duration: 0,
                        position: 'bottom-right'
                      });
                      // return
                  }
                   this.$router.push({ path: this.redirect || "/" }).catch(() => { });

                  if(res.unusualInfo ===true){
                    this.$message({
                      message: 'Detected login from an unknown device or login from a different location',
                      type: 'warning'
                    });
                    // // 异地登录或陌生设备
                    // this.$confirm("Detected login from an unknown device or login from a different location", "Tips", {
                    //   confirmButtonText: "Yes",
                    //   cancelButtonText: "No",
                    //   type: 'warning'
                    // })
                    // .then(() => {
                    //   this.forgotUser.email = this.loginForm.email
                    //     this.showResetPassword = true
                    // })
                    // .catch(() => {
                    //     // console.info("操作取消")
                    //     this.$router.push({ path: this.redirect || "/" }).catch(() => { });
                    // });
                  }
                })
                .catch((err) => {
                  //没有同意隐私政策
                  if(err == '1002000017'){  
                    this.getPrivacyPolicy()
                    // this.privacyPolicyVisible = true
                  }else if(err == '1002000018'){
                    this.resetPwdVisible = true
                    this.useType = 'new'
                  }else if(err == '1002000028'){
                    this.resetPwdVisible = true
                    this.useType = 'old'
                  }else if(err == '1002000029'){
                    this.passwordExpireChange()
                  }else if(err == '1002000022'){
                    this.showForgotPassword = true
                  } else if (err == '1002000000') {
                      this.logoCaptchaData = ''
                      this.loginForm.captchaToken= ''
                  }else if (err == '1002000023' || err=='1002000024') {
                      this.verifyShow = true
                      //  this.$refs.verify.show();
                      // this.needPassword = true
                      // removePassword();
                      // this.loginForm.password = ''
                      this.MFAVisible = false
                      this.$nextTick(() => {
                        if (this.$refs.verify) {
                          this.$refs.verify.show();
                        }
                      });
                      this.loading = false
                      return
                  } else if (err == '1002000025' || err== '1002000027') {
                     this.$message({
                      message: 'After clicking "Send Code", check your email to get the one-time verification code. Enter the code to continue logging in.',
                      type: 'warning'
                    });
                      //需要MFA验证
                      this.MFAVisible = true
                      this.mfaLoading = false
                      this.emailAuthCode = ''
                      this.passwordDisabled = true
                      this.clearEmailCodeCountdown()
                  }else if(err == '1002000019'){
                     this.$alert("Your password not aligned to MOOV password policy. Kindly Reset.", "Tips", {
                      confirmButtonText: "Yes",
                      type: 'warning'
                    })
                    .then(() => {
                      this.forgotUser.email = this.loginForm.email
                        this.showResetPassword = true
                    })
                  }
                  this.loading = false;
                });
              })

            } else {
              this.$notify.error("Incorrect Credentials");
              console.log("账号不存在");
              this.loading = false;
            }
          });
        }
      });
    },
    async doSocialLogin(socialTypeEnum) {
      // 设置登录中
      this.loading = true;
      let tenant = false;
      if (this.tenantEnable) {
        await this.$prompt("请输入Full Name称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(async ({ value }) => {
            await getTenantIdByName(value).then((res) => {
              const tenantId = res.data;
              tenant = true;
              if (tenantId && tenantId >= 0) {
                setTenantId(tenantId);
              }
            });
          })
          .catch(() => {
            // 取消登录按钮 loading状态
            this.loading = false;

            return false;
          });
      } else {
        tenant = true;
      }
      if (tenant) {
        // 计算 redirectUri
        const redirectUri =
          location.origin +
          "/social-login?" +
          encodeURIComponent(
            "type=" + socialTypeEnum.type + "&redirect=" + (this.redirect || "/")
          ); // 重定向不能丢
        // const redirectUri = 'http://127.0.0.1:48080/api/gitee/callback';
        // const redirectUri = 'http://127.0.0.1:48080/api/dingtalk/callback';
        // 进行跳转
        socialAuthRedirect(socialTypeEnum.type, encodeURIComponent(redirectUri)).then(
          (res) => {
            // console.log(res.url);
            window.location.href = res.data;
          }
        );
      }
    },
    /** ========== 以下为升级短信登录 ========== */
    getSmsCode() {
      if (this.mobileCodeTimer > 0) return;
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;
        sendSmsCode(
          this.loginForm.mobile,
          this.scene,
          this.loginForm.uuid,
          this.loginForm.code
        ).then((res) => {
          this.$modal.msgSuccess("获取验证码成功");
          this.mobileCodeTimer = 60;
          let msgTimer = setInterval(() => {
            this.mobileCodeTimer = this.mobileCodeTimer - 1;
            if (this.mobileCodeTimer <= 0) {
              clearInterval(msgTimer);
            }
          }, 1000);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/login.scss";

.container {
  min-width: 500px ;
  overflow: auto;
}

.outerLogin {
  min-width: 500px;
}

.privacy-dialog{
  margin-top: 10vh !important;
  padding:0
}
.privacy-check{
    position: fixed;
    bottom: 0px;
    width: 100%;
    background-color: #004f7c;
    padding: 10px;
    justify-content: center;
    align-items: center;
    text-align: center;
    right: 5px;
}
.privacy-container {
    // font-size: 16px;
    // display: flex;
    // justify-content: space-between;
    // max-width: 100%;
    // padding: 3.125rem 4.0625rem;
    // transition: all .3s;
}

 .privacy-container h1,h2,h3 {
    color: #004F7C;
}

  .left-text {
    white-space: break-spaces;
    padding: 20px;
    box-sizing: border-box;
  }
.oauth-login {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.oauth-login-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.oauth-login-item img {
  height: 25px;
  width: 25px;
}

.oauth-login-item span:hover {
  text-decoration: underline red;
  color: red;
}

.sms-login-mobile-code-prefix {
  :deep(.el-input__prefix) {
    top: 22%;
  }
}
.cookieDiv {
  width: 100%;
  background: #0000004d;
  height: 60px;
  position: fixed;
  bottom:0px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin:0 auto;
}
.cookieDiv span {
  color: #f0f3fb;
  font-size: 16px;
  margin-left:20px;
}
.cookieDiv a {
  color: red;
}
.cookieDiv .aDiv a {
  height: 60px;
  width:100px;
  background: #1173ba;
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.cookieDiv .bDiv a {
  height: 60px;
  width:100px;
  background: rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.accept-cookies{
  margin-right: 10px; color: #004f7c;
}
a.accept-cookies.el-link.el-link--default.is-underline::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  bottom: 0;
  border-bottom: 1px solid #1890ff;
}
.mfa-content{
  display: flex; 
  justify-content: space-between;
  margin-top: 10px;
  height: 40px;
  el-input{
    width: 50%;
  }
     :deep(.el-input__inner) {
          // 元素
          width: 100%;
          // height: 40px;
          background: #f5f5f5;
          border: 0;
          border-radius: 28px;
          // 文字
          text-align: left;
          line-height: 19px;
          color: #262626;
        }
}
html, body, #app {
  min-width: 500px;
  overflow-x: auto;
}
</style>

<style lang="scss">
.el-notification.password-expire-notify {
  top: inherit !important;
  right: 0px !important;
  height: auto !important;
  width: 400px !important;
  padding: 25px 11px !important;
}

.el-notification.today-password-expire-notify .el-icon-warning {
  color: rgb(245, 108, 108) !important;
}
</style>
