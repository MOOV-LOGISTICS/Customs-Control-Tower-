<template>

  <div class="app-container" style="width:100%; margin: 0 auto">
    <span style="position: absolute;
    top: 32px;
    left: 50px;
    font-size: 30px;">Let's MOOV together</span>
    <el-card class="reports" style="padding: 20px;" :style="{ height: height+'px' }">
      <el-tabs v-model="activeName" :class="{'tabs-header-hidden': !isTabsVisible}"
               class="custom-tabs" >
        <el-tab-pane :lazy="true"  v-for="(reports, categoryName) in categories" :label="categoryName" :name="categoryName" :key="categoryName">
          <span style="float: left;" @click="toggleTabs"><i style="font-size: 25px; cursor: pointer;" :class="isTabsVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i></span>

          <el-tabs class="text-left" tab-position="left" :style="{ height: (height-50)+'px' }">
            <el-tab-pane :lazy="true" v-for="(report,index) in reports" :key="report.id" :label="report.reportName">
              <PowerBI :style="{ height: (height-80)+'px' }"  :id="report.id"></PowerBI>
            </el-tab-pane>
          </el-tabs>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>
<script>
  import  PowerBI from "../index.vue"
  import { getUserReportsByPost } from "@/api/bi/report";
  export default {
    name: "Reports",
    components: {
      PowerBI
       },
    data() {
      return{
          height:'',
          list:[],
          activeName:'',
          isTabsVisible: true,
          categories: {}
      }
    },

    computed: {
    },
    created() {
          const clientHeight = document.documentElement.clientHeight;
          this.height = clientHeight - 165;
             //根据岗位获取用户能访问的报表
          getUserReportsByPost().then(res =>{
             res.data && Object.keys(res.data).forEach(key => {
              this.categories[key] = res.data[key];
             });
             this.activeName = Object.keys(this.categories)[0]
          })

    },
    methods: {
      toggleTabs(){
        this.isTabsVisible = !this.isTabsVisible
      },
    },
    mounted: function() {

    },
    destroyed() {

    }
  };
</script>

<style>
  .reports .el-tabs__nav-scroll .el-tabs__nav.is-top{
  margin-left: 380px;
  }
  .tabs-header-hidden .el-tabs__header.is-left {
      display: none;
  }

  .el-tabs__header.is-left {
      overflow: auto;
  }
  .text-left .el-tabs__nav-scroll {
      overflow: auto;
  }
  .text-left span.el-tabs__nav-next, .text-left span.el-tabs__nav-prev.is-disabled {
      display: none;
  }
  .text-left .el-tabs__nav-wrap.is-scrollable.is-left {
      padding: 0px 0px 30px 0px !important;
  }
  .reports .el-tabs__item.is-left{
      max-width: 355px;
      text-align: left;
      border-bottom: 1px solid #DDD;
      margin: 0;
      margin-right: 10px;
      word-wrap: break-word;
  white-space: normal;
  word-break: normal;
  }
  .reports .el-tabs__item{
      height: auto;
      line-height: 40px;
  }
</style>
