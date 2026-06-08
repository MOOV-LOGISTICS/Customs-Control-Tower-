<template>

<div>
  <el-card class="box-card" v-if="userCustomerList.length > 0">
    <el-row style="margin: 20px;">
      <el-col :span="5">

        <el-select v-model="customerId" filterable placeholder="Customer" @change="changeCustomer">
          <el-option
            v-for="item in userCustomerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </el-card>

  <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card"
           v-loading="dialogAllVisible">
    <el-dialog :title="detailLotTitle" :visible.sync="detailLotShow" destroy-on-close append-to-body
               width="80%" class="lotCss" v-loading="exportLoading">
      <div>
        <span><b>Carrier: </b>  <el-tag>{{detailLotQuery.carrierYuShi}}</el-tag></span>
        <!--        <span style="padding-left: 20px;" v-if="detailLotQuery.query != 3" ><b>Vessel: </b>-->
        <!--           <el-tag v-if="detailLotQuery.query == 2">{{detailLotQuery.vessel}}</el-tag>-->
        <!--         </span>-->
        <!--        <span style="padding-left: 20px;" v-if="detailLotQuery.query != 3"><b>Voyage: </b>-->
        <!--           <el-tag v-if="detailLotQuery.query == 2">{{detailLotQuery.voyage}}</el-tag>-->
        <!--         </span>-->
        <span style="float: right; cursor: pointer;">
           <svg @click="handleExport" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 23L24 32L15 23" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 6V32" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
      </div>
      <el-divider></el-divider>
      <el-table :data="detailLotData" v-loading="detailLotLoading">
        <el-table-column prop="refNumber" label="Shipment Ref"   show-overflow-tooltip>
          <template v-slot="scope">
            <el-link  type="primary" target="_blank"
                      :href="'/shipment/list?uuid='+scope.row.refNumber">
              {{scope.row.refNumber}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="bookingNumber" v-if="detailLotQuery.type != 5 && detailLotQuery.type != 3"
                         label="Booking Ref"   min-width="160px"    show-overflow-tooltip>
          <template v-slot="scope">
            <el-link  type="primary" target="_blank"
                      :href="'/shipment/list?bookingNumber='+scope.row.bookingNumber">
              {{scope.row.bookingNumber}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="por" label="POR"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="pol" label="POL"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="pod" label="POD"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="etdDate" label="ETD"  show-overflow-tooltip>
          <template slot-scope="scope">

            {{ formatDate(scope.row.etdDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="etaDate" label="ETA"  show-overflow-tooltip>
          <template slot-scope="scope">

            {{ formatDate(scope.row.etaDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="Total TEU"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="cancelCode"  v-if="detailLotQuery.type == 5" label="Cancel Category"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="cancelSubCode" v-if="detailLotQuery.type == 5"  label="Cancel Reason"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="cancelRemark" v-if="detailLotQuery.type == 5"  label="Cancel Remark"  show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <pagination
          v-show="detailLotTotal > 0"
          :total="detailLotTotal"
          :page.sync="detailLotQuery.pageNo"
          :limit.sync="detailLotQuery.pageSize"
          @pagination="getDetailLotList"
        />
      </div>

    </el-dialog>


    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="index"
      :label="item.title"
      :name="item.name"
    >


      <!--Week-->
      <div v-if="item.rule == 1 || item.rule == 4"  v-loading="dialogMAEUVisible"  >
        <el-row>
          <el-col  >


            <el-form
              :model="queryParams"
              size="small"
              :inline="true"
              label-width="10px"
            >
              <el-row style="text-align: center; align-items: center; display: flex; padding-top: 10px;  padding-bottom: 10px;">
                <el-col :span="1"> Year: </el-col>
                <el-col :span="3">
                  <el-date-picker
                    v-model="queryParams.etdYear"
                    type="year"
                    :picker-options="pickerYearOptions"
                    placeholder="ETD Year"
                    format="yyyy"
                    value-format="yyyy" @change="yearChange"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="1"> Week: </el-col>
                <el-col :span="4">
                  <el-select
                    v-model="queryParams.etdWeek"
                    style="width: 120px"
                    multiple
                    @change="handleEtdWeekChange"
                    @clear="handleEtdWeekChange"
                    filterable
                    placeholder="ETD Week">
                    <el-option
                      v-for="item in etdWeekOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2"> Original region: </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.region"
                             clearable filterable
                             placeholder="Original region">
                    <el-option
                      v-for="item in regionList"
                      :key="item"
                      :label="getRegionVal(item)"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2"> Destination region: </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.pod"
                             clearable filterable
                             placeholder="Destination region">
                    <el-option
                      v-for="item in podList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" v-if="queryParams.lotNo"> Order Number: </el-col>
                <el-col :span="3" v-if="queryParams.lotNo">
                  <el-tag type="success" closable  size="medium"
                          :disable-transitions="false"
                          @close="handleTagClose(tag,3)">{{queryParams.lotNo}}</el-tag>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary"
                             @click="handleQuery(item.rule)"><i class="el-icon-search"></i> Search</el-button>
                </el-col>
              </el-row>


            </el-form>

            <span ><b>Available SC NO: </b> <el-tag class="sc-no" v-for="(contractNo) in item.contractNos"  >{{contractNo}}</el-tag> </span>
            <el-divider></el-divider>
            <el-card class="box-card"  shadow="always"  :body-style="{ padding: '20px' }">
              <div :id="'allocationWeekChart'+item.name" style="height:555px"> </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row  >
          <el-col>
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" style="min-height:220px">
              <el-row :gutter="20">
                <el-col :span="calculateSpan(totalData)" class="car-title" :offset="index == 0 ? 4 : 0"
                        v-for="(key, index) in Object.keys(totalData)">
                  <el-tooltip :enterable="true" class="item" effect="dark" :content="key"  placement="top">
                    <span>{{key}}</span>
                  </el-tooltip>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="4">Contractual Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].contractualTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Confirmed Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].allocationTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Space Not Used</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span  >{{totalData[key].availableSpaceTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked, Not Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,3)">{{totalData[key].bookedNotReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked And Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span class="click-num-span" @click="showLots(key,4)">{{totalData[key].bookedReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Cancelled</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,5)">{{totalData[key].cancelledTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Shipped</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,6)">{{totalData[key].shippedTeuTotal}}</span>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" >

              <div v-if="tableNumData.length!=0" style="display: flex; justify-content: flex-end;">
                <el-button type="primary" icon="el-icon-download" circle @click="exportToExcel(item.rule)"></el-button>
              </div>
              <el-empty v-if="tableNumData.length==0"></el-empty>
              <el-table v-else
                        :data="tableNumData"
                        max-height="330px"
                        style="width: 100% ; ">
                <el-table-column show-overflow-tooltip
                                 prop="carrierGroup"
                                 label="Carrier" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="region"
                                 label="Original region" >
                  <template v-slot="scope">
                    {{getRegionVal(scope.row.region)}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="pod"
                                 label="Destination region" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="contractNo"
                                 label="Contract No" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="contractType"
                                 label="Contract Type" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="availableSpace"
                                 label="Not used allocation (TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="allocationTeu"
                                 label="Confirmed Allocation(TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="contractualTeu"
                                 label="Contractual Allocation (TEU)" >
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>

      </div>

      <!-- Vessel-->
      <div v-if="item.rule == 2" v-loading="dialogVesselVisible"  >
        <el-row>
          <el-col  >
            <el-form
              :model="queryVesselParams"
              size="small"
              :inline="true"
              label-width="150px"
            >
              <el-descriptions size="mini" border class="desc-ou-css" :column="3">
                <el-descriptions-item label="Year"  >
                  <el-date-picker
                    v-model="queryVesselParams.etdYear"
                    type="year"
                    @change="handleVesselQuery"
                    style="width: 150px"
                    placeholder="ETD Year"
                    :picker-options="pickerYearOptions"
                    format="yyyy"
                    value-format="yyyy"
                  >
                  </el-date-picker>
                </el-descriptions-item>

                <el-descriptions-item label="Month" >
                  <el-date-picker
                    popper-class="hlcu-month"
                    v-model="queryVesselParams.etdMonth"
                    type="month"
                    style="width: 150px"
                    placeholder="ETD Month"
                    format="MMM"
                    @change="handleVesselQuery"
                    @clear="handleVesselQuery"
                    value-format="MM"
                    :picker-options="pickerOptions"
                  />
                </el-descriptions-item>

                <el-descriptions-item label="Service" >
                  <el-select v-model="queryVesselParams.service"
                             @change="handleVesselQuery"
                             clearable filterable
                             placeholder="Service">
                    <el-option
                      v-for="item in serverSelectList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                </el-descriptions-item>
                <el-descriptions-item label="Vessel" >
                  <el-select v-model="queryVesselParams.vessel"
                             @change="handleVesselQuery"
                             clearable filterable
                             placeholder="Vessel">
                    <el-option
                      v-for="item in vesselSelectList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                </el-descriptions-item>

                <el-descriptions-item label="Voyage" >
                  <el-select v-model="queryVesselParams.voyage"
                             @change="handleVesselQuery"
                             clearable filterable
                             placeholder="Voyage">
                    <el-option
                      v-for="item in voyageSelectList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="Order Number"   v-if="queryVesselParams.lotNo">
                  <el-tag type="success" closable  size="medium"
                          :disable-transitions="false"
                          @close="handleTagClose(tag,2)">{{queryVesselParams.lotNo}}</el-tag>
                </el-descriptions-item>
              </el-descriptions>

              </el-descriptions>

              </el-descriptions>
            </el-form>
            <span><b>Available SC NO: </b>  <el-tag class="sc-no"   v-for="(contractNo) in item.contractNos"  >{{contractNo}}</el-tag>  </span>
            <el-divider></el-divider>

            <el-card class="box-card"  shadow="always"  :body-style="{ padding: '20px' }">
              <div :id="'allocationVesselChart'+item.name"  style="height:555px"> </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row  >
          <el-col  >
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" style="min-height:270px">
              <el-row :gutter="20">
                <el-col :span="calculateSpan(totalHLCData)" class="car-title" :offset="index == 0 ? 4 : 0"
                        v-for="(key, index) in Object.keys(totalHLCData)">
                  <el-tooltip :enterable="true" class="item" effect="dark" :content="key"  placement="top">
                    <span>{{ key}}</span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Contractual Allocation</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)"  >
                  <span>{{totalHLCData[key].contractualTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Confirmed Allocation</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)"  >
                  <span>{{totalHLCData[key].allocationTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Space Not Used</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)" >
                  <span  >{{totalHLCData[key].availableSpaceTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked, Not Released</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)" >
                  <span class="click-num-span" @click="showLots(key,3)">{{totalHLCData[key].bookedNotReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked And Released</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)"  >
                  <span class="click-num-span" @click="showLots(key,4)">{{totalHLCData[key].bookedReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Cancelled</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)" >
                  <span class="click-num-span" @click="showLots(key,5)">{{totalHLCData[key].cancelledTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Shipped</el-col>
                <el-col  :span="calculateSpan(totalHLCData)" v-for="(key, index) in Object.keys(totalHLCData)" >
                  <span class="click-num-span" @click="showLots(key,6)">{{totalHLCData[key].shippedTeuTotal}}</span>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" >

              <div v-if="tableNumData.length!=0" style="display: flex; justify-content: flex-end;">
                <el-button type="primary" icon="el-icon-download" circle @click="exportToExcel(item.rule)"></el-button>
              </div>
              <el-empty v-if="tableHLCUData.length==0"></el-empty>
              <el-table v-else
                        :data="tableHLCUData"
                        max-height="330px"
                        style="width: 100% ; ">
                <el-table-column
                  prop="carrierService"
                  label="Service"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="vessel"
                  label="Vessel"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="voyage"
                  label="Voyage" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="allocationTeu+extraCa"
                  label="Confirmed Allocation(TEU)" >
                  <template slot-scope="scope">
                    {{  scope.row.allocationTeu + scope.row.extraCa}}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>

          </el-col>
        </el-row>

      </div>

      <!--TSHG-Week-->
      <div v-if="item.rule == 3 || item.rule == 7"  v-loading="dialogTSHGVisible"  >
        <el-row>
          <el-col  >


            <el-form
              :model="queryTSHGParams"
              size="small"
              :inline="true"
              label-width="10px"
            >
              <el-row style="text-align: center; align-items: center; display: flex; padding-top: 10px;  padding-bottom: 10px;">
                <el-col :span="1"> Year: </el-col>
                <el-col :span="3">
                  <el-date-picker
                    v-model="queryTSHGParams.etdYear"
                    type="year"
                    :picker-options="pickerYearOptions"
                    placeholder="ETD Year"
                    format="yyyy"
                    value-format="yyyy" @change="yearChange"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="1"> Week: </el-col>
                <el-col :span="5">
                  <el-select
                    v-model="queryTSHGParams.etdWeek"
                    @change="handleEtdWeekChange"
                    @clear="handleEtdWeekChange"
                    multiple
                    filterable
                    placeholder="ETD Week">
                    <el-option
                      v-for="item in etdWeekOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1"> Vessel: </el-col>
                <el-col :span="4">
                  <el-select v-model="queryTSHGParams.vessel"
                             clearable filterable
                             placeholder="Vessel">
                    <el-option
                      v-for="item in vesselSelectList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1"> Voyage:</el-col>
                <el-col :span="4">
                  <el-select v-model="queryTSHGParams.voyage"
                             clearable filterable
                             placeholder="Voyage">
                    <el-option
                      v-for="item in voyageSelectList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary"
                             @click="handleQuery(item.rule)"><i class="el-icon-search"></i> Search</el-button>
                </el-col>
              </el-row>

            </el-form>

            <span ><b>Available SC NO: </b> <el-tag class="sc-no" v-for="(contractNo) in item.contractNos"  >{{contractNo}}</el-tag> </span>
            <el-divider></el-divider>
            <el-card class="box-card"  shadow="always"  :body-style="{ padding: '20px' }">
              <div :id="'allocationWeekChart'+item.name" style="height:555px"> </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row  >
          <el-col>
            <el-card class="tshg-card" :body-style="{ padding: '20px' }"  shadow="always" style="min-height:220px">
              <el-row :gutter="20">
                <el-col :span="calculateSpan(totalData)" class="car-title" :offset="index == 0 ? 4 : 0"
                        v-for="(key, index) in Object.keys(totalData)">
                  <el-tooltip popper-class="tshg-tooltip" :enterable="true" class="item" effect="dark" :content="getRegionVal(key)" placement="top">
                    <span style="white-space: pre-line;">{{getRegionVal(key)}}</span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Contractual Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].contractualTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Confirmed Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].allocationTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Space Not Used</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span  >{{totalData[key].availableSpaceTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked, Not Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,3)">{{totalData[key].bookedNotReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked And Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span class="click-num-span" @click="showLots(key,4)">{{totalData[key].bookedReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Cancelled</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,5)">{{totalData[key].cancelledTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Shipped</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,6)">{{totalData[key].shippedTeuTotal}}</span>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" >

              <div v-if="tableNumData.length!=0" style="display: flex; justify-content: flex-end;">
                <el-button type="primary" icon="el-icon-download" circle @click="exportToExcel(item.rule)"></el-button>
              </div>
              <el-empty v-if="tableNumData.length==0"></el-empty>
              <el-table v-else
                        :data="tableNumData"
                        max-height="330px"
                        style="width: 100% ; ">
                <el-table-column show-overflow-tooltip
                                 prop="carrierGroup"
                                 label="Carrier" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="region"
                                 label="Original region" >
                  <template v-slot="scope">
                    {{getRegionVal(scope.row.region)}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip v-if="queryTSHGParams.etdWeek.length > 0"
                                 prop="vessel"
                                 label="Vessel" >
                </el-table-column>
                <el-table-column show-overflow-tooltip v-if="queryTSHGParams.etdWeek.length > 0"
                                 prop="voyage"
                                 label="Voyage" >
                </el-table-column>
                <el-table-column show-overflow-tooltip v-if="queryTSHGParams.etdWeek.length > 0 && item.rule == 7"
                                 prop="vessel2"
                                 label="Vessel2" >
                </el-table-column>
                <el-table-column show-overflow-tooltip v-if="queryTSHGParams.etdWeek.length > 0 && item.rule == 7"
                                 prop="voyage2"
                                 label="Voyage2" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="availableSpace"
                                 label="Not used allocation (TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="allocationTeu"
                                 label="Confirmed Allocation(TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="contractualTeu"
                                 label="Contractual Allocation (TEU)" >
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>

      </div>

      <!--Week-->
      <div v-if="item.rule == 5 || item.rule == 6"  v-loading="dialogHLCUVisible"  >
        <el-row>
          <el-col  >


            <el-form
              :model="queryParams"
              size="small"
              :inline="true"
              label-width="10px"
            >
              <el-row style="text-align: center; align-items: center; display: flex; padding-top: 10px;  padding-bottom: 10px;">
                <el-col :span="1"> Year: </el-col>
                <el-col :span="3">
                  <el-date-picker
                    v-model="queryParams.etdYear"
                    type="year"
                    :picker-options="pickerYearOptions"
                    placeholder="ETD Year"
                    format="yyyy"
                    value-format="yyyy" @change="yearChange"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="1"> Week: </el-col>
                <el-col :span="5">
                  <el-select
                    v-model="queryParams.etdWeek"
                    style="width: 120px"
                    multiple
                    @change="handleEtdWeekChange"
                    @clear="handleEtdWeekChange"
                    filterable
                    placeholder="ETD Week">
                    <el-option
                      v-for="item in etdWeekOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2"> Original region: </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.region"
                             clearable filterable
                             placeholder="Original region">
                    <el-option
                      v-for="item in regionList"
                      :key="item"
                      :label="getRegionVal(item)"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" v-if="queryParams.lotNo"> Order Number: </el-col>
                <el-col :span="4" v-if="queryParams.lotNo">
                  <el-tag type="success" closable  size="medium"
                          :disable-transitions="false"
                          @close="handleTagClose(tag,3)">{{queryParams.lotNo}}</el-tag>
                </el-col>

                <el-col :span="3">
                  <el-button type="primary"
                             @click="handleQuery(item.rule)"><i class="el-icon-search"></i> Search</el-button>
                </el-col>
              </el-row>

            </el-form>

            <span ><b>Available SC NO: </b> <el-tag class="sc-no" v-for="(contractNo) in item.contractNos"  >{{contractNo}}</el-tag> </span>
            <el-divider></el-divider>
            <el-card class="box-card"  shadow="always"  :body-style="{ padding: '20px' }">
              <div :id="'allocationWeekChart'+item.name" style="height:555px"> </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row  >
          <el-col>
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" style="min-height:220px">
              <el-row :gutter="20">
                <el-col :span="calculateSpan(totalData)" class="car-title" :offset="index == 0 ? 4 : 0"
                        v-for="(key, index) in Object.keys(totalData)">
                  <el-tooltip :enterable="true" class="item" effect="dark" :content="key"  placement="top">
                    <span>{{key}}</span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Contractual Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].contractualTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Confirmed Allocation</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span>{{totalData[key].allocationTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Space Not Used</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span  >{{totalData[key].availableSpaceTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked, Not Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,3)">{{totalData[key].bookedNotReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Booked And Released</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)"  >
                  <span class="click-num-span" @click="showLots(key,4)">{{totalData[key].bookedReleasedTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Cancelled</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,5)">{{totalData[key].cancelledTeuTotal}}</span></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">Shipped</el-col>
                <el-col  :span="calculateSpan(totalData)" v-for="(key, index) in Object.keys(totalData)" >
                  <span class="click-num-span" @click="showLots(key,6)">{{totalData[key].shippedTeuTotal}}</span>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" :body-style="{ padding: '20px' }"  shadow="always" >

              <div v-if="tableNumData.length!=0" style="display: flex; justify-content: flex-end;">
                <el-button type="primary" icon="el-icon-download" circle @click="exportToExcel(item.rule)"></el-button>
              </div>
              <el-empty v-if="tableNumData.length==0"></el-empty>
              <el-table v-else
                        :data="tableNumData"
                        max-height="330px"
                        style="width: 100% ; ">
                <el-table-column show-overflow-tooltip
                                 prop="carrierGroup"
                                 label="Carrier" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="region"
                                 label="Original region" >
                  <template v-slot="scope">
                    {{getRegionVal(scope.row.region)}}
                  </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip
                                 prop="availableSpace"
                                 label="Not used allocation (TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="allocationTeu"
                                 label="Confirmed Allocation(TEU)" >
                </el-table-column>
                <el-table-column show-overflow-tooltip
                                 prop="contractualTeu"
                                 label="Contractual Allocation (TEU)" >
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>

      </div>

    </el-tab-pane>

    <el-empty style="height:555px" v-loading="emptyLoading" v-if="tableNumData.length == 0 && editableTabs.length == 0"></el-empty>
  </el-tabs>
</div>




</template>
<script>
  import { getBaseHeader } from "@/utils/request";
  import * as echarts from "echarts";
  require("echarts/theme/macarons"); // echarts theme
  import { getTSHGSchedule } from "@/api/shipment/shipment";
  import {getValidCarrier, getCarrierAllocation, getDetailLots, getValueDisList, exportLot, getUserCustomerList} from "@/api/booking/contract";
  import { checkPermi } from "@/utils/permission";
  import XLSX from "xlsx";

  export default {
    name: "AllocationReport",
    components: {},
    data() {
      return{
          dialogHLCUVisible:false,
          serviceOptions:['PANDA','TIGER'],
          detailLotTotal:0,
          detailLotQuery:{
            pageSize:10,
            pageNo:1,
            type: null,
            typeName: null,
            carrier: null,
            etdYear: null,
            etdWeek: [],
            lotNo: null,
            vessel: null,
            voyage: null,
            query: null,
            customerId:0,
          },
          etdWeekOptions:[],
          activeName: null,
          dialogTSHGVisible:false,
          dialogVesselVisible:false,
          dialogMAEUVisible:false,
          dialogAllVisible:false,
          tableData:[],
          tableNumData:[],
          allocationChart:null,
          totalData:{},
          // 查询参数
          queryParams: {
            query:3,
            etdYear: '',
            etdWeek: [],
            region: null,
            lotNo:null
          },
          allocationHLCUChart:null,
          tableHLCUData:[],
          totalHLCData:[],
          queryVesselParams:{
            query:2,
            etdYear: '',
            etdMonth: '',
            vessel: null,
            voyage: null,
            service:null,
            carrierGroup:null,
            lotNo:null
          },
          allocationTSHGChart:null,
          allocationChart3:null,
          allocationChart2:null,
          tableTSHGData:[],
          tableTHSGNumData:[],
          totalTSHGData:[],
          queryTSHGParams:{
            query: 1,
            etdYear: '',
            etdMonth: '',
            vessel: null,
            voyage: null,
            service:null,
            lotNo:null
          },
          pickerYearOptions: {
            disabledDate(time) {
              // 禁用2022年之前的日期
              return time.getFullYear() < 2022;
            },
          },
          pickerOptions: {
            disabledDate(time) {
              // 禁用年份选择
              return time.getFullYear() !== new Date().getFullYear();
            },
          },
          detailLotShow:false,
          detailLotData:[],
          detailLotLoading:false,
          detailLotTitle: '',
          vesselList:[],
          voyageList:[],
          regionList:[],
          podList:[],
          vesselSelectList:[],
          voyageSelectList:[],
          serverSelectList:[],
          exportLoading:false,
          nowTime:  Date.now(),
          clickStr:1,

          upload: {
            // 是否显示弹出层（）
            open: false,
            // 弹出层标题（）
            title: "",
            // 是否禁用上传
            isUploading: false,
            // 是否更新已经存在的用户数据
            updateSupport: 0,
            // 设置上传的请求头部
            headers: getBaseHeader(),
            // 上传的地址
            url: process.env.VUE_APP_BASE_API + "/admin-api/power/bi-report/importHLCU",
          },
          editableTabs:[],
          regionMap:{},
          oneFlag:false,
          userCustomerList: {},
          customerId: 0,
          emptyLoading:false,
      }
    },
    computed: {
    },
    created() {

      var date = new Date()
      var nowYear = ''+date.getFullYear()+''
      var crrLotNo = this.$route.query.lotNo
      if(crrLotNo=='undefined'){
        crrLotNo=null
      }
      this.queryVesselParams.etdYear =  nowYear
      this.queryVesselParams.etdMonth =  ''+this.computeEtdMonth(date)
      this.queryTSHGParams.etdYear =  nowYear
      this.queryParams.etdYear =  nowYear

      //设置前后两周
      var wk = this.computeEtdWeek( new Date())
      if(wk>2){
        this.queryParams.etdWeek.push(wk-2 )
      }
      if(wk>1){
        this.queryParams.etdWeek.push(wk-1)
      }
      this.queryParams.etdWeek.push(wk)
      if(wk < 53){
        this.queryParams.etdWeek.push( wk+1)
      }
      if(wk < 52){
        this.queryParams.etdWeek.push( wk+2)
      }
      this.queryTSHGParams.etdWeek = this.queryParams.etdWeek

      if( this.$route.query.type =='MAEU'){
        this.activeName = 'MAEU'
        if(this.$route.query.week && this.$route.query.week != 'undefined'){
          var arrWeek = this.$route.query.week.split('/')
          if(arrWeek.length==2){
            this.queryParams.etdYear = arrWeek[1]
            this.queryParams.etdWeek = [arrWeek[0]]
          }
        }else if(crrLotNo){
          this.queryParams.etdYear =  null
          this.queryParams.etdWeek =  null
          this.queryParams.lotNo = crrLotNo
        }
      }else if( this.$route.query.type =='TSHG'){
        this.activeName = 'TSHG'
        if(crrLotNo){
          this.queryTSHGParams.lotNo = crrLotNo
          this.queryTSHGParams.etdYear =  null
          this.queryTSHGParams.etdMonth =  null
        }
      }else if(this.$route.query.type == 'HLCU'){
        this.activeName = 'HLCU China & SE Asia'
        if(crrLotNo){
          this.queryVesselParams.lotNo  = crrLotNo
          this.queryVesselParams.etdYear =  null
          this.queryVesselParams.etdMonth =  null
        }

      }
      this.changeWeek()

    // 初始化时保存副本
    this.initialParams = JSON.parse(JSON.stringify(this.queryParams))
    // 初始化时保存副本
    this.initialTHSGParams = JSON.parse(JSON.stringify(this.queryTSHGParams))

    },
    mounted: function() {
      this.getUserCustomer()
    },
    methods: {
      checkPermi,

      getUserCustomer() {
        getUserCustomerList().then(response => {
          this.userCustomerList = response.data;
          if(this.userCustomerList.length > 0){
            this.customerId = this.userCustomerList[0].id
          }
            this.getValidCarrier()
        });
      },
      changeCustomer(val){
        this.emptyLoading = true
        this.editableTabs =[]
        this.activeName = null
        this.tableNumData = []
        this.tableData = []
        this.oneFlag = false
        this.queryParams = Object.assign({}, this.initialParams)
        this.queryTSHGParams = Object.assign({}, this.initialTHSGParams)
        this.getValidCarrier()
      },
      yearChange(val){
        //修改年份重新查询
        this.queryTSHGParams.etdYear = val
        this.queryParams.etdYear = val
        this.getValidCarrier()
      },
      getRegionVal(id){
        return this.regionMap[id] ? this.regionMap[id] : id;
      },
      exportToExcel(rule) {
        var data = []
        if( rule != 3 &&  rule != 7) {
          data = [["Carrier", "Original region", "Destination region", "Contract No", "Contract Type", "Not used allocation (TEU)", "Confirmed Allocation(TEU)", "Contractual Allocation (TEU)"]];
          for(var i=0; i < this.tableNumData.length; i++){
            var item = this.tableNumData[i]
            data.push([item.carrierGroup, this.getRegionVal(item.region), item.pod, item.contractNo, item.contractType, item.availableSpace, item.allocationTeu, item.contractualTeu])
          }
        }else {
          if(this.queryTSHGParams.etdWeek && this.queryTSHGParams.etdWeek.length > 0){
            if( rule == 3){
              data = [["Carrier", "Original region", "Vessel", "Voyage", "Not used allocation (TEU)", "Confirmed Allocation(TEU)", "Contractual Allocation (TEU)"]];
              for(var i=0; i < this.tableNumData.length; i++){
                var item = this.tableNumData[i]
                data.push([item.carrierGroup, this.getRegionVal(item.region),  item.vessel, item.voyage, item.availableSpace, item.allocationTeu, item.contractualTeu])
              }
            }else if( rule == 7){
              data = [["Carrier", "Original region", "Vessel", "Voyage",  "Vessel2", "Voyage2", "Not used allocation (TEU)", "Confirmed Allocation(TEU)", "Contractual Allocation (TEU)"]];
              for(var i=0; i < this.tableNumData.length; i++){
                var item = this.tableNumData[i]
                data.push([item.carrierGroup, this.getRegionVal(item.region),  item.vessel, item.voyage,  item.vessel2, item.voyage2, item.availableSpace, item.allocationTeu, item.contractualTeu])
              }
            }
          }else{
            //按年
            data = [["Carrier", "Original region",  "Not used allocation (TEU)", "Confirmed Allocation(TEU)", "Contractual Allocation (TEU)"]];
            for(var i=0; i < this.tableNumData.length; i++){
              var item = this.tableNumData[i]
              data.push([item.carrierGroup, this.getRegionVal(item.region),   item.availableSpace, item.allocationTeu, item.contractualTeu])
            }
          }
        }
        // 创建一个工作簿对象
        const wb = XLSX.utils.book_new();
         // 将数据转换为工作表
        const ws = XLSX.utils.aoa_to_sheet(data);

        // 调整列宽度（根据内容自动调整，或者设置固定宽度）
        // 这里使用自动调整列宽的简单方法，但可能不是最精确的
        function auto_adjust_column_width(ws) {
          const range = XLSX.utils.decode_range(ws['!ref']);
          for (let C = range.s.c; C <= range.e.c; ++C) {
            let max_len = 0;
            for (let R = range.s.r; R <= range.e.r; ++R) {
              const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = ws[cell_address];
              if (cell && cell.t === 's') { // 检查是否为字符串类型的单元格
                max_len = Math.max(max_len, cell.v.length);
              }
            }
            // 根据最大长度设置列宽（这里使用了一个估计的字符宽度，可能需要根据实际情况调整）
            const col_width = Math.max(max_len * 1, 20); // 假设每个字符宽10个单位，最小宽度20
            if (!ws['!cols']) ws['!cols'] = []; // 如果 !cols 不存在，则初始化它
            ws['!cols'][C] = { wch: col_width }; // 设置列宽（以字符宽度为单位）
          }
        }
        auto_adjust_column_width(ws);

        // 将工作表添加到工作簿中
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // 生成Excel文件并触发下载
        XLSX.writeFile(wb, "allocation_overview_summary.xlsx");
      },
      handleEtdWeekChange(){

        this.$set(this.queryTSHGParams,'tempaax',1)
        this.$delete(this.queryTSHGParams, 'tempaax');
        this.queryParams.etdWeek = this.queryParams.etdWeek .sort((a, b) => a - b);
        this.queryTSHGParams.etdWeek = this.queryTSHGParams.etdWeek .sort((a, b) => a - b);
      },
      getValueDisList(data){
        getValueDisList(data).then((response) => {
          if(response.data){
            this.podList = response.data.podList
            this.regionList = response.data.regionList
            this.regionMap = response.data.regionMap
            this.vesselSelectList = response.data.vesselList
            this.voyageSelectList = response.data.voyageList
            this.serverSelectList = response.data.serverList
          }
        })
      },
      getValidCarrier(){
        getValidCarrier(this.queryParams.etdYear, this.customerId).then((res)=>{
          if(res.data){
            for(var i=0; i<res.data.length; i++){
               var index = this.editableTabs.findIndex(item => item.title === res.data[i].carrierLabel)
               var item = {
                  title: res.data[i].carrierLabel ,
                  name: res.data[i].carrierLabel ,
                  rule: res.data[i].rule,
                  carrier: res.data[i].carrierGroup ,
                  contractNos: res.data[i].contractNos,
                  podRegion: res.data[i].podRegion ? res.data[i].podRegion : null ,
                }
              if(index != -1){
                this.$set(this.editableTabs, [index], item)
              }else{
                this.editableTabs.push(item)
              }
            }
            if (this.editableTabs.length > 0) {
              if(!this.oneFlag){
                this.$nextTick(() => {
                  this.activeName = this.editableTabs[0]['name']
                  this.handleClick(this.editableTabs[0], null)
                });
                this.oneFlag = true
              }else{
                this.$nextTick(() => {
                  this.handleClick({name: this.activeName}, null)
                });
              }
            }
          }
          this.emptyLoading = false
        })
      },
      book(row){
        var listData = row.list
        if(listData.length==0){return ''}
        var p1=null , p2 =null
         var data = {
          etd: null,
          eta: null,
          pol: null,
          pod: null,
          imo: listData[0].imo,
          vn: listData[0].vesselName,
          vc: listData[0].vesselCode,
          vo: listData[0].voyage + listData[0].bound,
          carrier: listData[0].carrier,
        };
        for(var i=0; i<listData.length; i++){
          if(listData[i].polBool==true){
            data.pol = listData[i].port
            data.eta = listData[i].arrivalDate
          }else if(listData[i].podBool==true){
            data.pod = listData[i].port
            data.etd = listData[i].departureDate
          }
        }
       return "/shipment/create?schdule=" + btoa(JSON.stringify(data));
      },
      checkStep(row){
        var listData = row.list
        var p1=null , p2 =null
        for(var i=0; i<listData.length; i++){
          if(listData[i].polBool==true){
            p1 = i
          }else if(listData[i].podBool==true){
            p2 = i
          }
        }
        if(p1!=null && p2!=null){
          return false
        }else{
          return true
        }
      },
      updateIcon(rowIndex, index,flag){
        if(!flag){
          return
        }
        var listData = this.tableTHSGNumData[rowIndex].list
        var p1=null , p2 =null
        for(var i=0; i<listData.length; i++){
          if(listData[i].polBool==true){
            p1 = i
          }else if(listData[i].podBool==true){
            p2 = i
          }
        }

        if(p1 != null && p2 != null && index != p1){
          this.$set(this.tableTHSGNumData[rowIndex].list[p2],'podBool',false)
          this.$set(this.tableTHSGNumData[rowIndex].list[index],'podBool',true)
        }else if(p1 != null && p1 != index){
          this.$set(this.tableTHSGNumData[rowIndex].list[index],'podBool',true)
        }else if(p1 != null && p1 == index){
          this.$set(this.tableTHSGNumData[rowIndex].list[index],'polBool',false)
          if(p2)this.$set(this.tableTHSGNumData[rowIndex].list[p2],'podBool',false)
        }else if(p1 == null){
          this.$set(this.tableTHSGNumData[rowIndex].list[index],'polBool',true)
        }else if(p2 != null && p2 == index){
          this.$set(this.tableTHSGNumData[rowIndex].list[p2],'podBool',false)
        }
      },
      handleTagClose(tag,query){

        if(this.tableHLCUData.length > 0){
          this.queryVesselParams.etdYear =  ''+this.tableHLCUData[0].etdAllocationYear
          this.queryVesselParams.etdMonth =  ''+this.tableHLCUData[0].etdAllocationMonth
        }else{
          this.queryVesselParams.etdYear =  year
          this.queryVesselParams.etdMonth =  month
        }
        this.handleVesselQuery()

        if(this.tableData.length > 0){
          this.queryParams.etdYear = ''+this.tableData[0].etdAllocationYear
          this.queryParams.etdWeek =  [this.tableData[0].etdAllocationWeek]
        }else{
          this.queryParams.etdYear = year
          this.queryParams.etdWeek =  [this.computeEtdWeek( new Date())]
        }
        this.handleQuery(1);
        this.handleQuery(3);
        this.changeWeek();

        //清空po信息，做新筛选
        this.$router.replace({ });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        if (response.code !== 0) {
          this.$modal.msgError(response.msg)
          return;
        }
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();

        if(data.length>0){
          this.$alert(text, "Errors", { dangerouslyUseHTMLString: true });
        }
        this.handleVesselQuery();
      },
      //导出lot
      handleExport(){
          this.$modal
          .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
          .then(() => {
            // 处理查询参数
            let params = { ...this.detailLotQuery };
            params.pageNo = undefined;
            params.pageSize = undefined;
            params.typeName = this.detailLotTitle
            this.exportLoading = true;
            return exportLot(params);
          })
          .then((response) => {
            this.$download.excel(response, this.detailLotTitle+".xlsx");
            this.exportLoading = false;
          })
          .catch(() => {});
      },
      getDetailLotList(){
        this.detailLotLoading = true
        this.detailLotQuery.customerId =  this.customerId
        getDetailLots(this.detailLotQuery).then((response) => {
          if(response.data){
            this.detailLotData = response.data.list
            this.detailLotTotal = response.data.total
          }
          this.detailLotLoading = false

        })
      },
      formatDate(timestamp) {
        if(!timestamp)return ''
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      },
      showLots(group,type){
        //判断是week还是vessel
        if(type == 1){
          this.detailLotTitle = 'Confirmed Allocation List'
        }else if(type == 2){
          this.detailLotTitle = 'Space Not Used List'
        }else if(type == 3){
          this.detailLotTitle = 'Booked, Not Released List'
        }else if(type == 4){
          this.detailLotTitle = 'Booked And Released List'
        }else if(type == 5){
          this.detailLotTitle = 'Cancelled List'
        }else if(type == 6){
          this.detailLotTitle = 'Shipped List'
        }
         for(var i=0; i< this.editableTabs.length; i++){
            if(this.editableTabs[i].name == this.activeName){
                this.detailLotQuery.carrier =  this.editableTabs[i].carrier
                this.detailLotQuery.carrierYuShi = this.editableTabs[i].name
                this.detailLotQuery.podRegion = this.editableTabs[i].podRegion
                this.detailLotQuery.contractType =null
                this.detailLotQuery.contractNo =null
                this.detailLotQuery.pod = null
              if(this.editableTabs[i].rule == 2){
                this.detailLotQuery.vessel =  this.queryVesselParams.vessel
                this.detailLotQuery.voyage = this.queryVesselParams.voyage
                this.detailLotQuery.etdYear =  this.queryVesselParams.etdYear
                this.detailLotQuery.etdMonth = this.queryVesselParams.etdMonth
              }else if([1,  5, 6].includes(this.editableTabs[i].rule) ){
                this.detailLotQuery.vessel =  null
                this.detailLotQuery.voyage = null
                this.detailLotQuery.contractNo =  group
                this.detailLotQuery.region =  this.queryParams.region
                this.detailLotQuery.etdYear =  this.queryParams.etdYear
                this.detailLotQuery.etdWeek = this.queryParams.etdWeek
              }else if(this.editableTabs[i].rule == 4){
                var strList = group.split('-')
                this.detailLotQuery.contractNo =  strList[0].trim()
                this.detailLotQuery.contractType = strList[1].trim()
                this.detailLotQuery.vessel =  null
                this.detailLotQuery.voyage = null
                this.detailLotQuery.region =  this.queryParams.region
                this.detailLotQuery.pod = this.queryParams.pod
                this.detailLotQuery.etdYear =  this.queryParams.etdYear
                this.detailLotQuery.etdWeek = this.queryParams.etdWeek
              }else if(this.editableTabs[i].rule == 3){
                var strList = group.split('-')
                if(this.queryTSHGParams.etdWeek.length == 0){
                  this.detailLotQuery.region =  group.trim()
                  this.detailLotQuery.vessel =  null
                  this.detailLotQuery.voyage = null
                }else{
                  this.detailLotQuery.region =  null
                  this.detailLotQuery.vessel =  strList[0].trim()
                  this.detailLotQuery.voyage = strList[1].trim()
                }
                this.detailLotQuery.pod = this.queryTSHGParams.pod
                this.detailLotQuery.etdYear =  this.queryTSHGParams.etdYear
                this.detailLotQuery.etdWeek = this.queryTSHGParams.etdWeek
              }else if(  this.editableTabs[i].rule == 7){
                var strList = group.split('\n')
                if(this.queryTSHGParams.etdWeek.length == 0){
                  this.detailLotQuery.region =  group.trim()
                  this.detailLotQuery.vessel =  this.queryTSHGParams.vessel
                  this.detailLotQuery.voyage = this.queryTSHGParams.voyage
                }else{
                  this.detailLotQuery.region =  null
                  var strList2 = strList[0].split('-')
                  this.detailLotQuery.vessel =  strList2[0].trim()
                  this.detailLotQuery.voyage = strList2[1].trim()
                  strList2 = strList[1].split('-')
                  this.detailLotQuery.vessel2 =  strList2[0].trim()
                  this.detailLotQuery.voyage2 = strList2[1].trim()
                }
                this.detailLotQuery.etdYear =  this.queryTSHGParams.etdYear
                this.detailLotQuery.etdWeek = this.queryTSHGParams.etdWeek
              }
              break;
            }
         }
        this.detailLotQuery.type = type
        this.detailLotQuery.query = this.clickStr
        this.detailLotLoading = true
        this.detailLotQuery.pageNo = 1
        this.detailLotQuery.customerId =  this.customerId
        getDetailLots(this.detailLotQuery).then((response) => {
          if(response.data){
            this.detailLotData = response.data.list
            this.detailLotTotal = response.data.total
          }
          this.detailLotLoading = false
        })
        this.detailLotShow = true


      },
      changeWeek(){
        if(this.queryParams.etdYear){
          this.etdWeekOptions = Array.from({ length: 53 }, (_, index) => index + 1);
        }
      },
      calculateSpan(data) {
        const keys = Object.keys(data);
        const totalKeys = keys.length;
        const remainingSpan = 20; // 剩余的 span 值
        const equalSpan = Math.floor(remainingSpan / totalKeys); // 平均分配的 span 值
        return equalSpan==0?1:equalSpan;
      },
      handleClick(tab, event){
        this.dialogAllVisible = true
        setTimeout(() => {
          var data = {}
          for(var i=0; i< this.editableTabs.length; i++){
            if(this.editableTabs[i].name == tab.name){
              this.clickStr = this.editableTabs[i].rule
              if(this.editableTabs[i].rule == 2){
                //Vessel
                this.queryVesselParams.carrierGroup = this.editableTabs[i].carrier
                this.queryVesselParams.query = this.editableTabs[i].rule
                this.handleVesselQuery()
                break;
              }else if([1, 4, 5, 6].includes(this.editableTabs[i].rule)){
                //week
                this.queryParams.carrierGroup = this.editableTabs[i].carrier
                this.queryParams.podRegion = this.editableTabs[i].podRegion
                this.queryParams.query = this.editableTabs[i].rule
                this.handleQuery(this.queryParams.query )
                break;
              }else if(this.editableTabs[i].rule == 3 ||this.editableTabs[i].rule == 7){
                //tshg-week
                this.queryTSHGParams.carrierGroup = this.editableTabs[i].carrier
                this.queryTSHGParams.podRegion = this.editableTabs[i].podRegion
                this.queryTSHGParams.query = this.editableTabs[i].rule
                this.handleQuery(this.editableTabs[i].rule)
                break;
              }
            }
          }
        }, 500);
      },
      computeEtdMonth(date) {
        if (date) {
            var checkDate = new Date(date);
            var month = checkDate.getMonth() + 1; // Adding 1 because months are 0-based (0 is January)
            return month;
        } else {
            return 0;
        }
      },

      //computeEtdWeek ISO8601 Standard time
      computeEtdWeek(date) {
          if (date) {
              var time, checkDate = new Date(new Date(date));
              checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
              time = checkDate.getTime();
              checkDate.setMonth(0);
              checkDate.setDate(1);
              return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
          } else {
              return 0
          }
      },
      handleQuery(val) {
        this.initAllocationData(val);
      },

      handleVesselQuery() {

      },
      initAllocationData(val){
        var data
        this.dialogAllVisible = true
        if(val == 3 || val == 7){
          data = this.queryTSHGParams
        }else{
          data = this.queryParams
        }
        data.customerId = this.customerId
        this.getValueDisList(data)
        getCarrierAllocation(data).then((response) => {
          if(response && response.data){
            this.tableData = response.data
            this.tableData = this.tableData.filter(item => (item.allocationTeu !== 0 ));
            this.tableNumData = this.tableData
            const mergedData = this.tableNumData.reduce((accumulator, current) => {
              var key = null;
              if( val == 3 && this.queryTSHGParams.etdWeek.length == 0){
                key = `${current.region}`;
              }else if(val == 3){
                key = `${current.region}-${current.vessel}-${current.voyage}`;
              }else if(val == 7){
                key = `${current.region}-${current.vessel}-${current.voyage}-${current.vessel2}-${current.voyage2}`;
              }else if(val == 4){
                key = `${current.pod}-${current.region}-${current.contractType}-${current.contractNo}`;
              }else{
                key = `${current.contractNo}`;
              }

              // 如果累加器中已经有这个key的对象，则更新availableSpace
              if (accumulator[key]) {
                accumulator[key].availableSpace += current.availableSpace;
                accumulator[key].allocationTeu += current.allocationTeu;
                accumulator[key].contractualTeu += current.contractualTeu;
              } else {
                // 否则，添加新的对象到累加器
                accumulator[key] = { ...current };
              }
              accumulator[key].availableSpace = parseFloat(accumulator[key].availableSpace.toFixed(1))
              accumulator[key].allocationTeu = parseFloat(accumulator[key].allocationTeu.toFixed(1))

              return accumulator;
            }, {});
            // 转换回数组格式
            this.tableNumData = Object.values(mergedData);

            setTimeout(() => {
              this.initChart3(val)
            }, 500);

            if(this.$route.query.lotNo && this.tableData.length > 0 && !this.queryParams.etdYear && this.queryParams.etdWeek.length == 0){
              this.queryParams.etdYear = ''+this.tableData[0].etdAllocationYear
              this.queryParams.etdWeek = [this.tableData[0].etdAllocationWeek]
              this.queryParams.region = this.tableData[0].region
            }
          }
        });
      },

      initChart3(val) {
        var vm = this
        // 检查是否已经存在ECharts实例并销毁它
        if (this.allocationChart && !this.allocationChart.isDisposed()) {
          this.allocationChart.dispose();
        }

        var doc = document.getElementById('allocationWeekChart'+this.activeName)

        if(doc == null){
          this.dialogAllVisible = false
          return
        }
        this.allocationChart = echarts.init(doc , "macarons");
        var data = this.tableData
        // 提取不同的载体组
        let weeksGroups
        let carrierGroups
        var flagThsg = false
        if((val == 3 || val == 7) && (this.queryTSHGParams.etdWeek == null || this.queryTSHGParams.etdWeek.length == 0)){ //TSHG
          carrierGroups = [...new Set(data.map(item => (item.region)))];
          flagThsg = true
        }else if(val == 3){ //TSHG
          carrierGroups = [...new Set(data.map(item => (item.vessel + ' - ' + item.voyage)))];
        }else if(val == 7){ //TSHG 2
          carrierGroups = [...new Set(data.map(item => (item.vessel + ' - ' + item.voyage + '\n' + item.vessel2 + ' - ' + item.voyage2)))];
        }else{ //MAEU
          carrierGroups = [...new Set(data.map(item => (item.contractNo + (item.contractType? ' - ' + item.contractType : ''))))];
        }
          weeksGroups = [...new Set(data.map(item => ("WK "+ item.etdAllocationWeek)))];
          // 初始化数据统计
          const summaryData = {};
          var showChatList = []

          // 遍历数据计算总数和比率
          for (const group of carrierGroups) {
            summaryData[group] = {
              allocationTeuTotal: 0,
              availableSpaceTotal: 0,
              bookedReleasedTeuTotal: 0,
              bookedNotReleasedTeuTotal: 0,
              availableSpaceRatio: 0,
              bookedReleasedTeuRatio: 0,
              bookedNotReleasedTeuRatio: 0,
              shippedTeuTotal:0,
              cancelledTeuTotal:0,
              exceedingQuantityRatio: 0,
              exceedingQuantityTotal: 0,
              contractualTeuTotal: 0,
            };

            data.forEach(item => {
              if(!item.allocationTeu){
                item.allocationTeu = 0
              }
              if(!item.contractualTeu){
                item.contractualTeu = 0
              }
              if(!item.availableSpace){
                item.availableSpace = 0
              }
              if(!item.bookedReleasedTeu){
                item.bookedReleasedTeu = 0
              }
              if(!item.bookedNotReleasedTeu){
                item.bookedNotReleasedTeu = 0
              }
              if(!item.cancelledTeu){
                item.cancelledTeu = 0
              }
              if(!item.shippedTeu){
                item.shippedTeu = 0
              }
              if ((item.contractNo + (item.contractType? ' - ' + item.contractType : '')) === group
              || ((flagThsg == true && item.region === group) || (flagThsg == false && (item.vessel + ' - ' + item.voyage) === group)
              || (flagThsg == false && (item.vessel + ' - ' + item.voyage +'\n' + item.vessel2 + ' - ' + item.voyage2) === group))) {
                summaryData[group].allocationTeuTotal += item.allocationTeu;
                summaryData[group].contractualTeuTotal += item.contractualTeu;
                summaryData[group].availableSpaceTotal += item.availableSpace;
                summaryData[group].bookedReleasedTeuTotal += item.bookedReleasedTeu;
                summaryData[group].bookedNotReleasedTeuTotal += item.bookedNotReleasedTeu;
                summaryData[group].cancelledTeuTotal += item.cancelledTeu;
                summaryData[group].shippedTeuTotal += item.shippedTeu;

              }
            });
            summaryData[group].allocationTeuTotal = parseFloat(summaryData[group].allocationTeuTotal.toFixed(1)) ;
            summaryData[group].availableSpaceTotal = parseFloat(summaryData[group].availableSpaceTotal.toFixed(1)) ;
            const total = summaryData[group].allocationTeuTotal;
            summaryData[group].availableSpaceRatio = ((summaryData[group].availableSpaceTotal / total) * 100).toFixed(2);
            if(summaryData[group].availableSpaceRatio < 0 ){
              //超出的
              summaryData[group].exceedingQuantityRatio = Math.abs(summaryData[group].availableSpaceRatio)
              summaryData[group].exceedingQuantityTotal = Math.abs(summaryData[group].availableSpaceTotal)

              summaryData[group].availableSpaceRatio = 0
            }
            summaryData[group].bookedReleasedTeuRatio = ((summaryData[group].bookedReleasedTeuTotal / total) * 100).toFixed(2);
            if (summaryData[group].bookedReleasedTeuRatio == 'Infinity'){
              summaryData[group].bookedReleasedTeuRatio = 0
            }else{
              summaryData[group].bookedReleasedTeuRatio = Math.min(summaryData[group].bookedReleasedTeuRatio, 100).toFixed(2)
            }
            var ratio = (summaryData[group].bookedNotReleasedTeuTotal / total) * 100;

            if(ratio == 'Infinity'){
              summaryData[group].bookedNotReleasedTeuRatio =0;
            }else{
              // 使用 Math.min 来确保 ratio 不超过 100
              summaryData[group].bookedNotReleasedTeuRatio = Math.min(ratio, 100).toFixed(2);
            }
            //超出
            if(summaryData[group].exceedingQuantityRatio == 'Infinity'){
              summaryData[group].exceedingQuantityRatio = 0
              if(summaryData[group].exceedingQuantityTotal){
                summaryData[group].exceedingQuantityRatio = Math.min(summaryData[group].exceedingQuantityTotal, 100).toFixed(2);

              }
            }
            if(summaryData[group].bookedReleasedTeuRatio == 'Infinity'){
              summaryData[group].bookedReleasedTeuRatio = 0
            }
            if(summaryData[group].bookedNotReleasedTeuRatio == 'NaN'){
              summaryData[group].bookedNotReleasedTeuRatio = 0
            }
            //Released + notReleased 超出100%

            var releasedTeu = parseFloat(summaryData[group].bookedReleasedTeuRatio);
            var notReleasedTeu = parseFloat(summaryData[group].bookedNotReleasedTeuRatio);
            if((releasedTeu + notReleasedTeu) > 100){
                let excess = (releasedTeu+ notReleasedTeu)  - 100;

                // 减少 released 或 notReleased，这里我们优先减少 notReleased
                if (notReleasedTeu > excess) {
                  summaryData[group].bookedNotReleasedTeuRatio -=  parseFloat(excess).toFixed(2);
                } else {
                  summaryData[group].bookedReleasedTeuRatio -=  parseFloat(excess - notReleasedTeu).toFixed(2);
                  summaryData[group].bookedNotReleasedTeuRatio = 0
                }
            }
            summaryData[group].bookedNotReleasedTeuRatio = parseFloat(summaryData[group].bookedNotReleasedTeuRatio).toFixed(2)
            summaryData[group].bookedReleasedTeuRatio = parseFloat(summaryData[group].bookedReleasedTeuRatio).toFixed(2)
            if( summaryData[group].allocationTeuTotal != 0){
              showChatList.push(group)
            }
          }
          this.totalData = summaryData
          //图表不显示Confirmed Allocation是0的
          carrierGroups = showChatList;

          // 构造图表配置项
          var  option = {
           tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              // 自定义 tooltip 内容
              formatter: function(params) {
                let tooltip  = params[0].name ;
                if(flagThsg){
                  tooltip = vm.getRegionVal(params[0].name);
                }
                tooltip += '<br>'
                params.forEach(function(item) {
                  if (item.seriesName !== 'Allocation TEU' && item.seriesName !== 'OverbookedTopNum') { // 排除 Allocation TEU
                    tooltip += item.marker + item.seriesName + ': ';
                    tooltip += '<div style="float: right; font-weight: bold;">' + item.value + '%</div>';
                    tooltip += '<br>';
                  }
                });
                return tooltip;
              }
            },
            legend: {
              data: [ 'Space Not Used', 'Booked, Not Released', 'Booked And Released', 'Overbooking'],

            },
            xAxis: [{
              type: 'category',
              data: carrierGroups,
              axisLabel: {
                interval: 0, // 显示所有X轴标签
                rotate: carrierGroups.length > 7 ? 15 : 0,  // 标签旋转角度
                formatter: function (value, index) {
                  if(flagThsg){
                    return vm.getRegionVal(value);
                  }
                  return value
                }
              },
            },{
              type: 'category',
              data: weeksGroups ? weeksGroups: [],
              show: !flagThsg,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false
              },
              position: 'bottom',
              offset: val == 7 ? 30:20
            }],
            yAxis: {
                name: '%',
                nameTextStyle: {
                  color: "black",
                  align: "right",
                  lineHeight: 20,
                  fontWeight: "bold"
                }
            },
            series: [
              {
                name: 'Booked And Released',
                type: 'bar',
                barMaxWidth: 100,
                data: carrierGroups.map(group => parseFloat(summaryData[group].bookedReleasedTeuRatio)),
                stack: 'x' ,
                itemStyle: {
                  color: 'rgb(107, 204, 136)'
                },
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(params) {
                  if(!params.value || params.value==0){ return "";}
                   return params.value+"%";
                  }
                },
              }, {
                name: 'Booked, Not Released',
                type: 'bar',
                data: carrierGroups.map(group => parseFloat(summaryData[group].bookedNotReleasedTeuRatio)),
                stack: 'x' ,
                itemStyle: {
                  color: 'rgb(2, 150, 255)'
                },
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(params) {
                  if(!params.value || params.value==0){ return "";}
                   return params.value+"%";
                  }
                },
              },{
                name: 'Space Not Used',
                type: 'bar',
                barWidth: 120,
                data: carrierGroups.map(group => parseFloat(summaryData[group].availableSpaceRatio)),
                stack: 'x' ,
                itemStyle: {
                  color: 'rgb(238, 173, 14)'
                },
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(params) {
                  if(!params.value || params.value==0){ return "";}
                   return params.value+"%";
                  }
                },
              },
              {
                name: 'Overbooking',
                type: 'bar',
                barWidth: 120,
                data: carrierGroups.map(group => parseFloat(summaryData[group].exceedingQuantityRatio)),
                stack: 'x' ,
                itemStyle: {
                  color: 'rgb(255, 48, 48)'
                },
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(params) {
                    if(!params.value || params.value==0){ return "";}

                    var exceedingQuantity = summaryData[carrierGroups[params.dataIndex]].exceedingQuantityTotal;
                    var labelText = params.value + '%';
                    if (exceedingQuantity != 0) {
                      // 当超出数量不为0时，添加括号和超出数量
                      labelText += ' (' + exceedingQuantity + ')';
                    }
                    // 使用富文本标记来指定颜色
                    return `{black|${labelText}}`;
                  },
                  rich: {
                      black: { color: '#000000' },
                      white: { color: '#FFFFFF' }
                  },
                },
              },
              {
                name: 'Allocation TEU',
                type: 'bar',
                data: carrierGroups.map(group => 0),
                stack: 'x' ,
                label: {
                  show: true,
                  position: 'top',
                  fontWeight : 'bold',
                  formatter: function(params) {
                   return summaryData[params.name].allocationTeuTotal;
                  }
                },
              },
            ]
          };

        this.allocationChart.setOption(option)
        // 调整图表大小以适应容器
        this.allocationChart.resize();



        this.dialogAllVisible = false
        // 处理点击事件并且跳转到相应的页面
        this.allocationChart.on('click', function(params) {
          //this.$router.push("/shipment/ShipmentSchedule?id=" + item.id);
        });

      },
    },
    destroyed() {
    }
  };
</script>
<style>

  .car-title{
    color: rgb(2,150,255);
  }
  .car-title.el-col {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .click-num-span{
    color: rgb(2,150,255);
    cursor: pointer;

  },
  .tshg-month .el-date-picker__header.el-date-picker__header--bordered  {
    display: none;
  }
  .hlcu-month .el-date-picker__header.el-date-picker__header--bordered {
      display: none;
  }
  .desc-ou-css{
      box-shadow: none;
      padding: 0 !important;
  }
 .sc-no {
      margin: 10px 10px 0px 5px;
      padding: 0 10px;
 }
 .tabs-main{
      margin: 5px 0px 0px 0px;

 }

.lotCss .el-dialog {
    max-height: 75%;
}

.el-loading-mask {
  z-index: 9999 !important;
}
.tshg-tooltip {
    white-space: pre-line;
}
</style>
