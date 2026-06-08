<template xmlns="">

  <div class="app-container" style=" background:#fff; " :style="{height:height+'px'}">
    <el-row style="text-align: center;
    align-items: center;
    display: flex;" :gutter="20">
      <el-col :span="10">
        <p style="font-size: 20px; font-weight: bolder; padding: 0; margin: 0; text-align: left;">{{customerName}}</p>
      </el-col>
      <el-col :offset="9" :span="5">
        <img
          style="    height: 50px; margin-left: 2%; margin-top: 2%;"
          src="../../../assets/Moov_Log.png"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" style="padding-top: 20px;">
      <el-col :span="8">
        <div>
          <el-card class="top-card" v-loading="shipmentLoading"
                   style="    background-image: linear-gradient(to top, #d9afd200 0%, #97aae19e 100%);">
            <el-row :gutter="20" style="padding-top: 15px;">
              <el-col :span="24" class="top-head">
                <div @click="toShippingPage()">
                  <el-statistic
                    group-separator=","
                    :precision="0"
                    :value="orderNum"
                    title="Shipping Order">
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6">
                <div @click="toShippingPage(0)">
                  <el-statistic
                    class="sub-head a"
                    group-separator=","
                    :precision="0"
                    :value="requestNum"
                    title="Requested">
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6">
                <div @click="toShippingPage(1)">
                  <el-statistic
                    class="sub-head b"
                    group-separator=","
                    :precision="0"
                    :value="acceptedNum"
                    title="Accepted">
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6">
                <div @click="toShippingPage(2)">
                  <el-statistic
                    class="sub-head c"
                    group-separator=","
                    :precision="0"
                    :value="rejectedNum"
                    title="Rejected">
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6">
                <div @click="toShippingPage(3)">
                  <el-statistic
                    class="sub-head d"
                    group-separator=","
                    :precision="0"
                    :value="cancelNum"
                    title="Cancelled">
                  </el-statistic>
                </div>
              </el-col>
            </el-row>

          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-card class="top-card" v-loading="shipmentLoading"
                   style="    background-image: linear-gradient(to top, #d9afd200 0%, #97aae19e 100%);">

            <el-row :gutter="20" style="padding-top: 15px;">
              <el-col :span="24" class="top-head">
                <div @click="toShippingPage(10)">
                  <el-statistic
                    group-separator=","
                    :precision="0"
                    :value="blDraftSubmitNum + blDraftPendingNum"
                    title="SI/VGM"></el-statistic>
                </div>
              </el-col>
              <el-col :span="12">
                <div @click="toShippingPage(11)">
                <el-statistic
                  class="sub-head b"
                  group-separator=","
                  :precision="0"
                  :value="blDraftSubmitNum"
                  title="Submitted">
                </el-statistic>
                </div>
              </el-col>
              <el-col :span="12">
                <div @click="toShippingPage(12)">
                <el-statistic
                  class="sub-head d"
                  group-separator=","
                  :precision="0"
                  :value="blDraftPendingNum"
                  title="Pending">
                </el-statistic>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <!--          有BL Draft date 并且有bookingNumber,没有添加BL的-->
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-card class="top-card" v-loading="shipmentLoading"
                   style="    background-image: linear-gradient(to top, #d9afd200 0%, #97aae19e 100%);">
            <el-row :gutter="20" style="padding-top: 15px;">
              <el-col :span="24" class="top-head">
                <div @click="toShippingPage(20)">
                <el-statistic
                  group-separator=","
                  :precision="0"
                  :value="amendAllNum"
                  title="Amendment Request"></el-statistic>
                </div>
              </el-col>
              <el-col :span="8">
                <div @click="toShippingPage(21)">
                <el-statistic
                  class="sub-head d"
                  group-separator=","
                  :precision="0"
                  :value="amendPendingNum"
                  title="Pending">
                </el-statistic>
                </div>
              </el-col>
              <el-col :span="8">
                <div @click="toShippingPage(22)">
                <el-statistic
                  class="sub-head b"
                  group-separator=","
                  :precision="0"
                  :value="amendApprovedNum"
                  title="Approved">
                </el-statistic>
                </div>
              </el-col>
              <el-col :span="8">
                <div @click="toShippingPage(23)">
                <el-statistic
                  class="sub-head c"
                  group-separator=","
                  :precision="0"
                  :value="amendRejectedNum"
                  title="Rejected">
                </el-statistic>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>

    </el-row>
    <!--    table-->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="md-card a" v-loading="shipmentLoading">
          <div class="out-title">Shipping arriving within 7 days</div>
          <div class="out-div" id="a-chat" sytle="padding-bottom:20px">

            <el-table
              :data="arrivingList"
              height="400"
              style="width: 100%">
              <el-table-column
                prop="so_ref"
                label="SO Ref"
                show-overflow-tooltip
                min-width="150">
                <template v-slot="scope">
                  <el-link type="primary" style="margin-top: -1px;"
                           :href="'/shipment/shippingOrder?ref='+scope.row.so_ref">{{ scope.row.so_ref }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="shipper_ref"
                label="Shipper Ref"
                show-overflow-tooltip
                min-width="150">
                <template v-slot="scope">
                  <el-link type="primary" style="margin-top: -1px;"
                           :href="'/shipment/shippingOrder?shipperRef='+scope.row.shipper_ref">{{ scope.row.shipper_ref
                    }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="booking_number"
                label="Booking Number"
                show-overflow-tooltip
                min-width="150">
              </el-table-column>
              <el-table-column
                prop="origin_port"
                label="POD"
                show-overflow-tooltip
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="eta"
                label="ETA"
                show-overflow-tooltip
                min-width="120">
                <template v-slot="scope">
                  {{ parseTime(scope.row.eta) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="md-card b" v-loading="shipmentLoading">
          <div class="out-title">Shipping departing within 7 days</div>
          <div class="out-div" id="b-chat" sytle="padding-bottom:20px">

            <el-table
              :data="departingList"
              height="400"
              style="width: 100%">
              <el-table-column
                prop="so_ref"
                label="SO Ref"
                show-overflow-tooltip
                min-width="160">
                <template v-slot="scope">
                  <el-link type="primary" style="margin-top: -1px;"
                           :href="'/shipment/shippingOrder?ref='+scope.row.so_ref">{{ scope.row.so_ref }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="shipper_ref"
                label="Shipper Ref"
                show-overflow-tooltip
                min-width="160">
                <template v-slot="scope">
                  <el-link type="primary" style="margin-top: -1px;"
                           :href="'/shipment/shippingOrder?shipperRef='+scope.row.shipper_ref">{{ scope.row.shipper_ref
                    }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="origin_port"
                label="POL"
                show-overflow-tooltip
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="destination_port"
                label="POD"
                show-overflow-tooltip
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="etd"
                label="ETD"
                show-overflow-tooltip
                min-width="120">
                <template v-slot="scope">
                  {{ parseTime(scope.row.etd) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>


</template>
<script>
  import * as echarts from 'echarts';
  import auth from "@/plugins/auth";
  import { getOrderReportData } from "@/api/shipping/order";
  import { getUserCustomerName} from "@/api/bi/bi";

  export default {
    name: "ShippersReport",
    directives: {
    },
    data() {
      return{
        currentPage: 1,
        pageSize: 20,
        shipmentLoading: false,
        height: null,
        orderNum: 0,
        requestNum:0,
        acceptedNum: 0,
        rejectedNum: 0,
        cancelNum: 0,
        blDraftSubmitNum: 0,
        blDraftPendingNum: 0,
        amendAllNum: 0,
        amendPendingNum: 0,
        amendApprovedNum: 0,
        amendRejectedNum: 0,
        arrivingList:[],
        departingList:[],
        customerName:'',
      }
    },
    computed: {
    },
    created() {
      const clientHeight = document.documentElement.clientHeight;
      this.height = clientHeight - 125;
      getOrderReportData().then(res=>{
        if(res.data){
          this.orderNum = res.data.orderNum
          this.requestNum = res.data.requestNum
          this.acceptedNum = res.data.acceptedNum;
          this.rejectedNum = res.data.rejectedNum;
          this.cancelNum = res.data.cancelNum;

          this.blDraftSubmitNum = res.data.blDraftSubmitNum;
          this.blDraftPendingNum = res.data.blDraftPendingNum;

          this.amendAllNum = res.data.amendAllNum
          this.amendPendingNum = res.data.amendPendingNum;
          this.amendApprovedNum = res.data.amendApprovedNum;
          this.amendRejectedNum = res.data.amendRejectedNum;
          this.arrivingList = res.data.arrivingData
          this.departingList = res.data.departingData
        }
      })
    },
    mounted: function() {
      getUserCustomerName().then(res=>{
        this.customerName = res.data.customerName
      })

    },
    methods: {
      toShippingPage(key){
        var val=''
        if(key != undefined){
          val = '?status='+key
        }
        if(key == 10){
          val = '?blStatus=0'
        }else if(key == 11){
          val = '?blStatus=1'
        }else if(key == 12){
          val = '?blStatus=2'
        }
        else if(key == 20){
          val = '?amendStatus=0'
        }else if(key == 21){
          val = '?amendStatus=1'
        }else if(key == 22){
          val = '?amendStatus=2'
        }else if(key == 23){
          val = '?amendStatus=3'
        }

        this.$router.push('/shipment/shippingOrder'+val);
      }
    },
    destroyed() {
    }
  };
</script>

<style>

  .top-card {
    min-height: 190px;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
  .top-card .el-statistic .title {
    color: #004770;
    font-weight: bold;
    font-size: 20px;
  }
  .top-card .el-statistic .con {
    color: #004770;
    font-weight: bold;
  }
  .el-statistic.sub-head .title {
    font-weight: bold;
    font-size: 16px;
  }
  .el-statistic.sub-head .con {
    font-weight: unset;
    font-size: 16px !important;
  }
  .el-statistic.sub-head.a .title {
    color: #409EFF;
  }
  .el-statistic.sub-head.b .title {
    color: #67C23A;
  }
  .el-statistic.sub-head.c .title {
    color: #F56C6C;
  }
  .el-statistic.sub-head.d .title {
    color: #E6A23C;
  }
  .top-head {
    padding-bottom: 15px;
  }
  .md-card .out-div{
    min-height: 410px;
    max-height: 430px;
    width: 100%;
    padding: 20px;
  }
  .out-title{
    font-size: 18px;
    font-weight: bolder;
    padding-top: 16px;
    padding-left: 25px;
  }
</style>
