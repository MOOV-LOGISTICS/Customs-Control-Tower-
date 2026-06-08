<template>

  <div id="div1" class="flex-container" >
    <div class="get-started">
      <el-row>
        <el-col :span="24" class="get-started-img">
          <img
            style="height: 50px; "
            src="../assets/Moov_Log.png"
          />
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="12" class="get-started-text">
          <span style="font-weight: 500;">SCHEDULE A CONSULTATION</span>
          <div class="head-divider">
            <el-divider></el-divider>
          </div>
          <div>
            <h1>Get Started with</h1>
          </div>

          <div class="started-h2">
            <h2>MOOV</h2>
          </div>
          <div>
            Schedule a consultation and you'll learn more about:
          </div>
          <div class="started-p">
            <p><i class="el-icon-check"/>How smartMOOV enhances supply chain visibility by centralizing all your data </p>
            <p><i class="el-icon-check"/>The agility that comes with real-time collaboration across your supply chain network </p>
            <p><i class="el-icon-check"/>Leveraging data to unlock potential efficiencies within your supply chain </p>
            <p><i class="el-icon-check"/>The full suite of logistics solutions by MOOV that integrate seamlessly with smartMOOV</p>
          </div>
        </el-col>
        <el-col :span="12" class="get-started-form">
          <el-card shadow="always" style="overflow: auto">
            <el-form :show-message="false"	v-loading="loading" size='mini' ref="form"
                     :model="user" :rules="rules"  label-position="top">
              <el-row>
                <el-col :span="11" >
                  <el-form-item :label="$t('userInfo.firstName')" prop="firstName"  class="started-item" >
                    <el-input v-model="user.firstName"   />
                  </el-form-item>
                </el-col>
                <el-col :span="11"  :offset="1"  >
                  <el-form-item :label="$t('userInfo.familyName')" prop="familyName" class="started-item">
                    <el-input v-model="user.familyName"  ref="firstName"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11"   >
                  <el-form-item :label="$t('userInfo.businessEmail')" prop="email"  class="started-item" :error="$refs.form?.$refs.firstName?.$error">
                    <el-input v-model="user.email" />
                  </el-form-item>
                </el-col>
                <el-col :span="11"  :offset="1"  >
                  <el-form-item :label="$t('userInfo.contactPhone')" prop="contactPhone" class="started-item">
                    <el-input v-model="user.contactPhone" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="23" >
                  <el-form-item :label="$t('userInfo.companyName')" prop="companyName" class="started-item">
                    <el-input v-model="user.companyName"  />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col  :span="23">
                  <el-form-item :label="$t('userInfo.country')" prop="country" class="started-item">
                    <el-select  filterable v-model="user.country">
                      <el-option
                        v-for="dict in countryData"
                        :key="dict.label"
                        :label="dict.label"
                        :value="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col  :span="23"  >
                  <el-form-item :label="$t('userInfo.message')" prop="message" class="started-item">
                    <el-input v-model="user.message" type="textarea" :rows="5" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col>
                  <div class="checked-d">
                    <el-checkbox v-model="checked">I agree to share above information for a consultation</el-checkbox>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-tooltip content="Confirm to share the above information before schedule consultation."
                              placement="bottom" effect="light">
                    <div style="width:100px">
                      <el-button v-if="!checked" :disabled="!checked" type="primary">{{ $t('userInfo.submit') }}</el-button>
                    </div>
                  </el-tooltip>
                  <el-button  type="primary"  v-if="checked"  :disabled="!checked"  @click="submit">{{ $t('userInfo.submit') }}</el-button>
                </el-col>
              </el-row>

            </el-form>
          </el-card>

        </el-col>
      </el-row>


    </div>

  </div>


</template>
<script>

import {DICT_TYPE,   getDictDatas } from "@/utils/dict";

import {
  userRegistration,getDictDataCountryList
} from "@/api/login";

export default {
  name: "getStarted",
  data() {
    return {
      height:null,
      user: {
        email: null,
        firstName: null,
        familyName: null,
        contactPhone: null,
        companyName: null,
        // companyIndustry: null,
        message: null,
        country: null
      },
      checked: false,
      // 表单校验
      rules: {
        email: [
          { required: true, message: "Account cannot be empty", trigger: "blur" },
          //2025.4.20 刘一林
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email",
            trigger: "blur"
          },
        ],
        firstName:[
          { required: true, message: "First Name cannot be empty", trigger: "blur" }
        ],
        familyName:[
          { required: true, message: "Family Name cannot be empty", trigger: "blur" }
        ],
        contactPhone:[
          { required: true, message: "Contact Phone cannot be empty", trigger: "blur" },
          // 修改手机号验证正则(适配多个国家) edwin
          //  +91 9876543210
          //  (022) 1234-5678
          //  123-456-7890
          {
            pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
            message: "Please enter a valid phone number",
            trigger: "blur"
          }
        ],
        companyName:[
          { required: true, message: "Company Name cannot be empty", trigger: "blur" }
        ],
        // companyIndustry:[
        //   { required: true, message: "Company Industry cannot be empty", trigger: "blur" }
        // ],
        message:[
          { required: true, message: "Message cannot be empty", trigger: "blur" }
        ],
        country:[
          { required: true, message: "Country cannot be empty", trigger: "change" }
        ],
      },
      countryData:[],
      loading:false,
    };
  },
  created() {
    getDictDataCountryList(DICT_TYPE.SYSTEM_COUNTRY).then(res=>{
     this.countryData = res.data
    })
  },
  mounted() {
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 298;
    document.getElementById('div1').style.height = clientHeight +"px";
  },
   methods: {
    goBack() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(!this.checked){
            this.$notify({
              message: 'Please agree to share the above information before submitting registration.',
              type: 'warning'
            });
            return
          }
          const submitData = { ...this.user }
          if (submitData.message) {
            submitData.message = submitData.message.replace(/\n/g, '<br>')
          }
          this.loading = true
          userRegistration(submitData).then(
            response => {
              this.loading = false
              this.$refs.form.resetFields();
              this.$notify({
                showClose: true,
                message: 'Thanks for your support! <br>Your requirement will be replied within 3 working days!',
                dangerouslyUseHTMLString: true,
                type: 'success'
              });
              this.checked = false;
            }
          );
        }
      });
    },

   },

};



</script>
<style  >

.get-started {
    padding: 5%;
}

.get-started-img{
  text-align: center;
  padding-bottom: 6%;
}
.el-form-item .el-form-item__label{
    position: relative !important;;
}
.el-form-item.started-item.el-form-item--mini {
    border: 0;
}
.started-item label.el-form-item__label {
    border: 0 !important;
    background-color: #fff !important;
}
.started-item input.el-input__inner {
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6 !important;
}
.started-item .el-textarea__inner {
  border: 1px solid #DCDFE6 !important;
}
form.el-form.el-form--label-top{
    margin: 5%;
}
.flex-container .el-divider.el-divider--horizontal {
    width: 45%;
}
.get-started-text {
    text-align: center;
    font-size: 16px;
}
.head-divider{
  display: flex;
  align-items: center;
  justify-content: center;
}
h2{
  color: #004f7c;
}
.started-p .el-icon-check:before {
    font-size: 20px;
    padding-right: 10px;
    font-weight: bold;
    color: #409EFF;
}
.started-p p {
    padding-top: 2%;
    padding-bottom: 2%;
}
.checked-d {
    padding-top: 10px;
    padding-bottom: 20px;
}
.checked-d label.el-checkbox{
    margin-left: 0 !important;
}
.started-h2{
    margin-bottom: 3%;
}
.flex-container {
  overflow: auto; /* 添加滚动条 */
  display: flex;
  flex-direction: column;
  //height: 1000px; /* 设定一个高度 */

}
</style>
