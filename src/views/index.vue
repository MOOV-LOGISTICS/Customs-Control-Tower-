<template>
  <div v-if="flag" class="app-container app-container-home" style="
      width: calc(100%);
      padding: 0px 0px;
      margin: 0 auto;
      box-shadow: none;
    ">

    <div style="padding: 20px;" v-if="$auth.hasPermi('system:tenant:query')">

      <el-card style="padding: 20px;text-align: center;" :style="{height:height+'px'}">
        <h2 style="
    font-size: 48px;
    font-weight: 500;">Customers</h2>
        <div @click="changeTenant(tenant)" v-for="tenant in tenantList" :class="{'selected':tenantId==tenant.id}" style=" cursor: pointer;;width: 220px;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);margin: 15px;border-radius: 15px;display: inline-block;">

          <p style="font-size: 20px;background-color: #004F7C;color: #fff;padding:30px 0px;border-radius: 14px 14px 0px 0px;">{{ tenant.name }}</p>
          <p style="padding: 8px 0px;">Create Time:{{ parseTime(tenant.createTime) }}</p>
          <p style="padding: 8px 0px;">Expire Time:{{parseTime(tenant.expireTime) }}</p>
          <p style="padding: 8px 0px;">Package:{{ tenant.packageId }}</p>
        </div>
        <div style="clear: both;"></div>
      </el-card>
    </div>
    <div v-if="SearchViewShow">
        <el-row>
          <el-col>
            <h1 style="font-size: 30px;font-weight: 900;margin-left: 50px;">smartMOOV</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-card  v-if="$auth.hasPermi('track:others')" class="box-card index-tracking"   >
            <div class="home-title">
              <p style="margin: 15px 0px;">Tracking</p>
            </div>
            <div class="card-body">
              <el-form v-model="trackingForm">
                <div style="text-align: left; margin-left: 26.5px; ">
                  <el-radio-group v-model="trackingForm.type">
                    <el-radio v-hasPermi="['order:header:query']" label="order">Purchase Order</el-radio>
                    <el-radio v-hasPermi="['order:so-header:query']" label="salesOrder">Sales Order</el-radio>
                    <el-radio label="bookingNumber">Booking Number</el-radio>
                    <el-radio label="blNumber">BL Number</el-radio>
                    <el-radio label="containerNo">Container Number</el-radio>
                  </el-radio-group>
                </div>
                <div class="card-bottom" style="margin-left: 31px;margin-top: 20px;position: relative; ">
                  <el-input v-model="trackingForm.searchKey" style="width: calc(100% - 180px);"  placeholder="  Search here">
                  </el-input>
                  <el-button @click="track()" type="primary" style="margin-left: 10px;margin-right: 10px;">Track<i
                      class="el-icon-search el-icon--right"></i></el-button>
                </div>
              </el-form>
            </div>
          </el-card>



          <el-card class="box-card index-schedule"  >
            <el-form :model="scheduleForm" ref="scheduleForm" :show-message="false">

              <el-row class="sch-card"  >
                <el-col :span="13" :xs=9>
                  <div class="home-title">
                    <p style="margin: 15px 0px;">Schedule</p>
                  </div>
                </el-col>
                <el-col :span="5" :xs="5" class="select-data">
                  <el-form-item required prop="etd" style="margin-top: 18px;margin-right: 10px;">
                    <el-date-picker v-model="scheduleForm.etd" type="date" placeholder="ETD" :clearable="false"
                      :editable="false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5" :xs="6" class="select-carrier">
                  <el-form-item prop="carrier" >
                    <el-select filterable placeholder="Carrier" v-model="scheduleForm.carrier">
                      <i slot="prefix" class="el-icon-location-information"></i>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
              </el-row>


              <div class="card-body">
                <div style="text-align: center;font-size: 18px!important; margin-left: 31px;margin-right: 31px; ">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item required prop="pol">
                        <el-select remote :remote-method="remoteMethod" filterable placeholder=" POL"
                          v-model="scheduleForm.pol">
                          <i slot="prefix" class="el-input__icon el-icon-ship"></i>
                          <el-option v-for="dict in options1" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <i @click="swapPolPod" style="margin-top: 10px;font-size: 21px;color: #c2bfbfbc;"
                        class="el-icon-sort"></i>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item required prop="pod">
                        <el-select remote :remote-method="remoteMethod2" filterable placeholder=" POD"
                          v-model="scheduleForm.pod">
                          <i slot="prefix" class="el-input__icon el-icon-location-information"></i>
                          <el-option v-for="dict in options2" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div style="margin-bottom: 25px;margin-top: 10px;position: relative;margin-left: 31px;margin-right: 31px; ">
                  <el-row :gutter="24">
                    <el-col :span="24">
                      <div style="text-align: right;">
                        <el-button @click="submitForm" type="primary">Search<i
                            class="el-icon-search el-icon--right"></i></el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form>
          </el-card>

        </el-row>


        <!-- <el-card style="position: absolute;right: 100px;top: 100px;width: 330px;">
        <ul style="padding: 0px;">
          <li @click="toOther('/order/POManagement')" style="cursor: pointer ;padding-left: 30px;">
            <img style="width:42px;height: 42px;" src="../assets/images/moov-order.png" />
            <span style="position: relative;top:-12px;padding-left: 20px;font-size: 18px">Order Management</span>
          </li>
        </ul>
      </el-card>

        <el-card style="position: absolute;right: 100px;top: 185px;width: 330px;">
          <ul style="padding: 0px;">
            <li style="cursor: pointer;padding-left: 30px;" @click="toAllocation">
              <img style="width:45px;height: 45px;" src="../assets/images/WechatIMG16.jpg" />
              <span style="position: relative;top:-12px;padding-left: 20px;font-size: 18px;">Allocation Management</span>
            </li>
          </ul>
        </el-card> -->
          <el-row>
          <el-card class="moov-map" >
              <div class="home-title" style="position: absolute; background-color: white;width: 200px;border-radius: 10px; margin-top: 15px;">
                <p>Moov map</p>
              </div>
            <img src="../assets/images/home/Moo map.png" />
          </el-card>
      <!--
          <el-main
            style="width: calc(50% - 62px);float: left;height: 471px;margin-left: 24px;margin-top: 28px; padding: 0px;">

            <el-card @click.native="toOther('/order/POManagement')"
              style="background: #fff;width: calc(50% - 14px);float: left;height: 221.5px;">
              <el-col :span="17" style=" width: 100%;">
                <div class="home-title">
                  <p>Order Management</p>
                </div>
              </el-col>
              <div style="float: left;width: 100%;height: 48px; margin-top: 80px; ">
                <el-row>
                  <el-col :span="5">
                      <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #004F7C;">{{order.number1}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #EA5117;">{{order.number2}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #02CE67;">{{order.number3}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #B4B1B1;">{{order.number4}}</div>
                      </el-row>
                  </el-col>
                </el-row>
              </div>

            </el-card>

            <el-card @click.native="toOther('/shipment/booking')"
              style="background: #fff;width: calc(50% - 14px);float: left;height: 221.5px;margin-left: 28px;">
              <el-col :span="17">
                <div class="home-title">
                  <p>Shipper Booking</p>
                </div>
              </el-col>
              <div style="float: left;width: 100%;height: 48px; margin-top: 80px; ">
                <el-row>
                  <el-col :span="5">
                      <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #004F7C;">{{booking.number1}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #EA5117;">{{booking.number2}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #02CE67;">{{booking.number3}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #B4B1B1;">{{booking.number4}}</div>
                      </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>

            <el-card @click.native="toOther('/shipment/list')"
              style="background: #fff;width: calc(50% - 14px);float: left;height: 221.5px;margin-top: 28px;">
              <el-col :span="17">
                <div class="home-title">
                  <p>Carrier Booking</p>
                </div>
              </el-col>
              <div style="float: left;width: 100%;height: 48px; margin-top: 80px; ">
                <el-row>
                  <el-col :span="5">
                      <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #004F7C;">{{shipment.number1}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #EA5117;">{{shipment.number2}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #02CE67;">{{shipment.number3}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #B4B1B1;">{{shipment.number4}}</div>
                      </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>

            <el-card @click.native="toOther('/shipment/contract')"
              style="background: #fff;width: calc(50% - 14px);float: left;height: 221.5px;margin-left: 28px;margin-top: 28px;">
              <el-col :span="17">
                <div class="home-title">
                  <p>Contract Management</p>
                </div>
              </el-col>
              <div style="float: left;width: 100%;height: 48px; margin-top: 80px; ">
                <el-row>
                  <el-col :span="5">
                      <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #004F7C;">{{contract.number1}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #EA5117;">{{contract.number2}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #02CE67;">{{contract.number3}}</div>
                      </el-row>
                  </el-col>
                  <el-col :span="5">
                    <el-row>
                        <div class="tab-title">DOING</div>
                      </el-row>
                      <el-row>
                        <div class="tab-num" style="color: #B4B1B1;">{{contract.number4}}</div>
                      </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>

          </el-main>
        -->
        </el-row>
    </div>

    <CustomerStandard v-if="CustomerStandardShow"></CustomerStandard>
    <ShippersHomePage v-if="ShippersHomePageShow"></ShippersHomePage>
    <POManagement :showTaskPage="true" v-if="POManagementPageShow"></POManagement>
    <DestinationOverview v-if="DestinationOverviewShow"></DestinationOverview>
  </div>
</template>

<script>

import { findShippingSchedulePortList } from "@/api/shipment/shipment";
import PanelGroup from "./dashboard/PanelGroup";
import auth from "@/plugins/auth";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import {getTenantIdListOfActive} from "@/api/system/tenant"
import {setTenantId,setTenantName,getTenantId} from "@/utils/auth"
import CustomerStandard from './reports/customerStandard/index.vue';
import ShippersHomePage from './reports/shippersHomePage/index.vue';
// import POManagement from './purchaseOrder/pepco/index.vue';
import POManagement from './purchaseOrder/pepcoNew/index.vue';
import DestinationOverview from './destination/overview/index.vue'

export default {
  name: "Index",
  components: {
    DestinationOverview,
    PanelGroup,
    CustomerStandard,
    ShippersHomePage,
    POManagement,
  },
  data() {
    return {
      trackingForm: {
        type:"order",
      },
      scheduleForm: {
        // etd: new Date(),
        etd: '',
        pol: '',
        pod: ''
      },
      options1: [],
      options2: [],
      portData: [],
      flag: false,
      carriers: [],
      order: {
        number1: '88',
        number2: '88',
        number3: '88',
        number4: '88',
      },
      booking: {
        number1: '88',
        number2: '88',
        number3: '88',
        number4: '88',
      },
      shipment: {
        number1: '88',
        number2: '88',
        number3: '88',
        number4: '88',
      },
      contract: {
        number1: '88',
        number2: '88',
        number3: '88',
        number4: '88',
      },
      tenantList:[],
      height:0,
      tenantId:null,
      CustomerStandardShow:false,
      ShippersHomePageShow:false,
      SearchViewShow:false,
      POManagementPageShow:false,
      DestinationOverviewShow: false
    };
  },
  created() {
    if (auth.hasPermi("homepage") || auth.hasRole("super_admin")) {
      this.flag = true;
      this.findShippingSchedulePortList()
    }

    if (auth.hasPermi("system:tenant:query")){
      this.getTenantIdListOfActive()
    }
    if (!auth.hasPermi("system:tenant:query") && auth.hasPermi("home:search:show")) {
      this.SearchViewShow = true
    }
    if (!auth.hasPermi("system:tenant:query") && !auth.hasPermi("home:search:show")) {
      if (auth.hasPermi("home:poManagement")) {
        this.POManagementPageShow = true
      }else if ( auth.hasPermi("home:shippers")) {
        this.ShippersHomePageShow = true
      }else if ( auth.hasPermi("home:destinationOverview")) {
        this.DestinationOverviewShow = true
      }else{
        this.CustomerStandardShow = true
      }
    }
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 175;
    this.tenantId=getTenantId()
  },
  methods: {
    changeTenant(tenant){
      setTenantId(tenant.id)
      setTenantName(tenant.name)
      window.location.href=window.location.href
    },
    getTenantIdListOfActive(){
      getTenantIdListOfActive().then((res)=>{
        this.tenantList=res.data
      })
    },
    swapPolPod() {
      var pol = this.scheduleForm.pol
      var pod = this.scheduleForm.pod

      this.scheduleForm.pol = pod

      this.scheduleForm.pod = pol


      var options1 = this.options1
      var options2 = this.options2

      this.options1 = options2

      this.options2 = options1
    },

    remoteMethod(query) {
      if (query !== '' && query.length >= 1) {
        this.loading = true;
        this.loading = false;
        this.options1 = this.portData.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options1 = [];
      }
    },
    remoteMethod2(query) {
      if (query !== '' && query.length >= 1) {
        this.loading = true;
        this.loading = false;
        this.options2 = this.portData.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options2 = [];
      }
    },
    track() {
      this.$router.push('/shipment/ShipmentTracking?type=' + this.trackingForm.type + '&searchKey=' + this.trackingForm.searchKey)
    },
    toOther(path) {
      this.$router.push(path)
    },
    submitForm() {
      this.$refs['scheduleForm'].validate((valid) => {
        if (valid) {
          this.$router.push('/shipment/ShipmentSchedule?etd=' + this.parseTime(this.scheduleForm.etd) + "&carrier=" + this.scheduleForm.carrier + "&pol="
            + this.scheduleForm.pol + "&pod=" + this.scheduleForm.pod)
        } else {
          return false;
        }
      });
    },
    toAllocation() {
      this.$router.push('/bi/allocation')
    },
    findShippingSchedulePortList() {
      findShippingSchedulePortList(this.searchData).then((response) => {
        this.portData = response.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

p{
  margin: 0px;
}
.app-container-home .tab-title {
  height: 15px; width: 100%;text-align: center;font-size: 10px; color: #B4B1B1;
}
.app-container-home .tab-num {
  width: 100%; text-align: center; font-size: 15px; font-weight: 800;
}
.app-container-home .home-title {
  font-size: 18px;
  font-weight: 800;
  text-align: left;
  margin-left: 30px;
  height: 70px;

  display: inline-block;
  vertical-align: middle;
  text-align: left;
}

.dashboard-editor-container {
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.el-radio__label {
  color: #B4B1B1;
  font-size: 14px;
}

/* .app-container-home .el-input__inner {
  font-size: 14px;
  height: 42px !important;
} */

/* // .el-input {
//   height: 60px;
//   line-height: 60px;
// } */
/* .app-container-home .el-button {
  font-size: 17px;
  height: 42px;
  width: 110px;
} */

/* .app-container-home .el-input__inner {
  border-color: #27252579 !important;
  font-weight: 500;
}

.app-container-home .el-input__icon {
  font-size: 18px;
} */

.app-container-home .sch-card .el-form-item {
  border-style: solid;
}

.app-container-home .sch-card .el-input__inner {
  font-size: 12px;
  height: 10px !important;
  padding-left: 20px;
  width: 120px;
}

.app-container-home .el-icon-date {
  font-size: 12px !important;
}

.app-container-home .el-icon-arrow-up {
  position: absolute !important;
  left: -45px;
}

.app-container-home .select-data {
  margin-top: 0px;
}

.app-container-home .select-carrier {
  margin-top: 18px;
}

.app-container-home .select-data .el-input__prefix {
  top: 0px;
  left: -5px;
}

.app-container-home .select-carrier .el-input__prefix {
  top: 0px;
  left: 2px;
}

.index-tracking{
  background: #fff;
  width: calc(50% - 62px);
  float: left;
  height: 207px;
  margin-left: 50px;
}
.index-schedule{
  background: #fff;
  width: calc(50% - 62px);
  float: left;
  height: 207px;
  margin-left: 50px;
}





.moov-map{
  background: #fff;
  width: calc(50% - 62px);
  float: left;
  height: 471px;
  margin-left: 50px;
  margin-top: 28px;
  overflow: auto;
  height:  500px;
  margin-bottom: 22px;
}

// - - - - - �ƶ�������
@media screen and (max-width: 599px) {
  .index-tracking{
    background: #fff;
      width: 100%;
      float: left;
      height: 100%;
      margin-left: 0px;
      margin-bottom: 20px;
      padding-bottom: 15px;
  }
  .index-schedule{
      background: #fff;
      width: 100%;
      float: left;
      margin: 0px;
  }
  .moov-map{
    background: #fff;
    min-width: 100%;
    overflow: auto;
    float: left;
    height: 100%;
    margin-left: 0px;
    margin-top: 28px;
    margin-bottom: 22px;
  }


}
.app-container-home .selected{
  border: 3px solid orange;
}
</style>
