<template>
  <div class="app-container" style="width:100%; margin: 0 auto;" v-loading="loading">
    <div style="margin-bottom: 20px;">
      <el-card style="background: transparent;box-shadow: none!important;">
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <span @click="handleExport">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ bookingInfo.notBooked }}</p>
            <p>Not Booked</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ bookingInfo.booked }}</p>
            <p>Booked</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            :class="{'avticePort':checkedPort[item.destinationPort]}"
            @click="clickPort(item.destinationPort)"
            v-for="item in bookingInfo.ports"
            style="float: right;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;    cursor: pointer;
          border-radius: 10px;
            margin-left: 10px;"
          >
            <p style="font-size: 20px;">{{ item.count }}</p>
            <p>{{ item.destinationPort }}</p>
          </div>
        </el-card>
      </el-card>
    </div>

    <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select placeholder="Por" filterable v-model="preAssgineForm.por">
            <el-option v-for="(item, index) in portOptions" :key="index + 'por'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select placeholder="Fnd" filterable v-model="preAssgineForm.fnd">
            <el-option v-for="(item, index) in portOptions" :key="index + 'fnd'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-date-picker placeholder="etd from" type="date" value-format="timestamp" v-model="preAssgineForm.etd"></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-date-picker placeholder="etd to" type="date" value-format="timestamp" v-model="preAssgineForm.etd2"></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-select placeholder="carrier" filterable v-model="preAssgineForm.carrier">
            <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-button @click="queryShippingSchedule" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </el-col>
      </el-row>
      <el-table @row-dblclick="choseSchedule" height="600px" :data="shippingScheduleData">
        <el-table-column sortable="custom" width="15px" type="expand">
          <template slot-scope="scope">
            <!-- none tshg -->
            <div v-if="scope.row.carrier != 'TSHG'" style="padding: 0px 40px;">
              <el-empty v-if="scope.row.tshgList.length==0"></el-empty>
              <div style="padding-top: 10px;">
                <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                  <div>
                    <div class="vessel-title">Departure</div>
                    <div class="vessel-title">{{ scope.row.polTerminal }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Arrival</div>
                    <div class="vessel-title">{{ scope.row.podTerminal }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">SI Document</div>
                    <div class="vessel-title">{{ scope.row.siCutoff==null?"-":parseTimeToZ1(scope.row.siCutoff) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">VGM</div>
                    <div class="vessel-title">{{ scope.row.vgmCutoff==null?"-":parseTimeToZ1(scope.row.vgmCutoff) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Inland Cutoff</div>
                    <div class="vessel-title">{{ scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}</div>
                  </div>
                </div>
                <el-row v-for="(item,index) in scope.row.tshgList">
                  <div>
                    <div style="float: left;">
                      <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ scope.row.pol }}</div>
                      <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ scope.row.polTerminal }}</div>
                      <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ scope.row.pod }}</div>
                      <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ scope.row.podTerminal }}</div>

                      <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ item.portCode }}</div>
                      <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                      <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;">{{ item.barge }}</div>
                      <!-- Transport Mode: -->
                    </div>
                    <div style="float: left;">
                      <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                          />
                        </svg>
                      </span>
                      <!-- <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div> -->
                      <div v-show="index!=scope.row.tshgList.length-1" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                    </div>
                    <div style="float: left;">
                      <div v-show="index==0" style="font-size: 14px;line-height: 20px;">Departure</div>
                      <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">Arrival</div>
                      <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>

                      <div v-show="index==0" style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(scope.row.departureDate) }}</div>
                      <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(scope.row.arrivalDate) }}</div>
                      <div v-show="item.barge=='Ocean'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                        <div>
                          <div class="vessel-title">Vessel</div>
                          <div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Voyage/Bound</div>
                          <div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Service</div>
                          <div class="vessel-title">{{ item.routeCode==null?'-':item.routeCode }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>

                <el-row>
                  <div></div>
                </el-row>
              </div>
            </div>
            <!-- tshg -->
            <div v-if="scope.row.carrier == 'TSHG'" style="padding: 0px 40px;">
              <el-empty v-if="scope.row.tshgList.length==0"></el-empty>
              <div style="padding-top: 10px;">
                <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                  <div>
                    <div class="vessel-title">Departure</div>
                    <div class="vessel-title">{{ scope.row.polName }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Arrival</div>
                    <div class="vessel-title">{{ scope.row.podName }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Container Gate-In</div>
                    <div class="vessel-title">{{ scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">SI Document</div>
                    <div class="vessel-title">{{ scope.row.siDoc==null?"-":parseTimeToZ1(scope.row.siDoc) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">VGM</div>
                    <div class="vessel-title">{{ scope.row.vgm==null?"-":parseTimeToZ1(scope.row.vgm) }}</div>
                  </div>
                </div>
                <el-row v-for="(item,index) in scope.row.tshgList">
                  <div>
                    <div style="float: left;">
                      <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ item.portCode }}</div>
                      <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                      <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;">{{ item.barge }}</div>
                      <!-- Transport Mode: -->
                    </div>
                    <div style="float: left;">
                      <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                          />
                        </svg>
                      </span>
                      <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                      <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                    </div>
                    <div style="float: left;">
                      <div style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>
                      <div style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(item.eventTime) }}</div>
                      <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                        <div>
                          <div class="vessel-title">Vessel</div>
                          <div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Service</div>
                          <div class="vessel-title">{{ item.service==null?'-':item.service }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Voyage/Bound</div>
                          <div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>

                <el-row>
                  <div></div>
                </el-row>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('booking.carrier')" prop="carrier" width="250px" :align="'center'">
          <template v-slot="scope">
            <div>
              <svg v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" style="margin: 0px" viewBox="0 0 130 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Hapag-Lloyd Logo</title>
                <defs />
                <g id="Homepage-Initial" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="HAL0200_Homepage-Initial_Smartphone" transform="translate(-95.000000, -17.000000)">
                    <g id="Navigation">
                      <g id="Hapag-Lloyd-Logo" transform="translate(95.000000, 17.000000)">
                        <path
                          d="M7.86133803,0 L16.5576056,0 L11.1397183,9.04323944 L12.5623944,9.04323944 L17.9940141,0 L26.7433803,0 L21.3259507,9.04323944 L27.3924648,9.04323944 L24.9412324,13.0544718 L18.880669,13.0517254 L23.5982042,19.5448592 L14.8602817,19.5448592 L10.1496127,13.0544718 L8.65369718,13.0544718 L13.3671127,19.5448592 L4.73309859,19.5448592 L0,13.0544718 L7.86133803,0"
                          id="Fill-1"
                          fill="#111465"
                        />
                        <path
                          d="M37.8364085,16.4962676 L40.5206338,16.4962676 L40.5206338,11.2303521 L45.462007,11.2303521 L45.462007,16.4962676 L48.1462324,16.4962676 L48.1462324,4.28862676 L45.462007,4.28862676 L45.462007,8.97366197 L40.5206338,8.97366197 L40.5206338,4.28862676 L37.8364085,4.28862676 L37.8364085,16.4962676"
                          id="Fill-2"
                          fill="#000000"
                        />
                        <path
                          d="M54.6627113,13.0769014 C54.6627113,13.6069718 54.594507,15.1115845 52.6966901,15.1115845 C51.9102817,15.1115845 51.2094718,14.8891197 51.2094718,13.9827817 C51.2094718,13.093838 51.8933451,12.8375 52.6454225,12.6836972 C53.3975,12.546831 54.2525704,12.5294366 54.6627113,12.1705634 L54.6627113,13.0769014 L54.6627113,13.0769014 Z M51.4827465,10.3752817 C51.5683451,9.4181338 52.1666197,9.0418662 53.0898944,9.0418662 C53.9449648,9.0418662 54.6627113,9.19566901 54.6627113,10.2388732 C54.6627113,11.2303521 53.2780282,11.1790845 51.7908099,11.4010915 C50.2861972,11.6066197 48.7815845,12.0854225 48.7815845,14.0853169 C48.7815845,15.897993 50.115,16.735669 51.7908099,16.735669 C52.8678873,16.735669 53.9962324,16.445 54.7657042,15.6411972 C54.7826408,15.9318662 54.8508451,16.2225352 54.9364437,16.4962676 L57.398662,16.4962676 C57.1761972,16.1373944 57.0905986,15.3335915 57.0905986,14.5302465 L57.0905986,9.93080986 C57.0905986,7.81098592 54.9707746,7.41778169 53.2098239,7.41778169 C51.2264085,7.41778169 49.1917254,8.10165493 49.0548592,10.3752817 L51.4827465,10.3752817 L51.4827465,10.3752817 Z"
                          id="Fill-3"
                          fill="#000000"
                        />
                        <path
                          d="M57.8797535,19.6080282 L60.3071831,19.6080282 L60.3071831,15.4022535 L60.3415141,15.4022535 C60.9228521,16.2738028 61.9317254,16.735669 62.9914085,16.735669 C65.5730986,16.735669 66.8726408,14.5302465 66.8726408,12.1705634 C66.8726408,9.65753521 65.6248239,7.41778169 62.855,7.41778169 C61.7605282,7.41778169 60.8029225,7.84485915 60.2220423,8.78552817 L60.1877113,8.78552817 L60.1877113,7.6571831 L57.8797535,7.6571831 L57.8797535,19.6080282 L57.8797535,19.6080282 Z M62.3418662,14.9060563 C60.7690493,14.9060563 60.2220423,13.5383099 60.2220423,12.1023592 C60.2220423,10.6659507 60.7347183,9.24693662 62.3249296,9.24693662 C63.8808099,9.24693662 64.4447535,10.7002817 64.4447535,12.1023592 C64.4447535,13.5383099 63.9320775,14.9060563 62.3418662,14.9060563 L62.3418662,14.9060563 Z"
                          id="Fill-4"
                          fill="#000000"
                        />
                        <path
                          d="M73.0801408,13.0769014 C73.0801408,13.6069718 73.0119366,15.1115845 71.1141197,15.1115845 C70.3277113,15.1115845 69.6264437,14.8891197 69.6264437,13.9827817 C69.6264437,13.093838 70.3103169,12.8375 71.0628521,12.6836972 C71.8149296,12.546831 72.67,12.5294366 73.0801408,12.1705634 L73.0801408,13.0769014 L73.0801408,13.0769014 Z M69.9001761,10.3752817 C69.9857746,9.4181338 70.5840493,9.0418662 71.5073239,9.0418662 C72.3623944,9.0418662 73.0801408,9.19566901 73.0801408,10.2388732 C73.0801408,11.2303521 71.6954577,11.1790845 70.2077817,11.4010915 C68.703169,11.6066197 67.1990141,12.0854225 67.1990141,14.0853169 C67.1990141,15.897993 68.5324296,16.735669 70.2077817,16.735669 C71.2848592,16.735669 72.413662,16.445 73.1826761,15.6411972 C73.2000704,15.9318662 73.2682746,16.2225352 73.3538732,16.4962676 L75.8156338,16.4962676 C75.5936268,16.1373944 75.5080282,15.3335915 75.5080282,14.5302465 L75.5080282,9.93080986 C75.5080282,7.81098592 73.3877465,7.41778169 71.6267958,7.41778169 C69.643838,7.41778169 67.6091549,8.10165493 67.4722887,10.3752817 L69.9001761,10.3752817 L69.9001761,10.3752817 Z"
                          id="Fill-5"
                          fill="#000000"
                        />
                        <path
                          d="M85.1358099,7.6571831 L82.8278521,7.6571831 L82.8278521,8.83679577 L82.7935211,8.83679577 C82.2121831,7.81098592 81.3232394,7.41778169 80.1605634,7.41778169 C77.6814085,7.41778169 76.3649296,9.50327465 76.3649296,11.7947535 C76.3649296,14.2221831 77.4932746,16.2399296 80.1436268,16.2399296 C81.2037676,16.2399296 82.2634507,15.7954577 82.7935211,14.8721831 L82.8278521,14.8721831 L82.8278521,16.0344014 C82.8447887,17.2996127 82.2295775,18.2228873 80.8787676,18.2228873 C80.0236972,18.2228873 79.2885563,17.9152817 79.0665493,17.0094014 L76.6555986,17.0094014 C76.7755282,19.0266901 78.8102113,19.8474296 80.5537676,19.8474296 C84.6231338,19.8474296 85.1358099,17.3852113 85.1358099,15.9318662 L85.1358099,7.6571831 L85.1358099,7.6571831 Z M80.758838,14.4103169 C79.2716197,14.4103169 78.7928169,13.0256338 78.7928169,11.7604225 C78.7928169,10.4439437 79.3910915,9.24693662 80.758838,9.24693662 C82.3321127,9.24693662 82.8278521,10.5295423 82.8278521,11.965493 C82.8278521,13.2307042 82.1439789,14.4103169 80.758838,14.4103169 L80.758838,14.4103169 Z"
                          id="Fill-6"
                          fill="#000000"
                        />
                        <path d="M85.8041197,12.8713732 L90.9505634,12.8713732 L90.9505634,10.7854225 L85.8041197,10.7854225 L85.8041197,12.8713732 Z" id="Fill-7" fill="#000000" />
                        <path
                          d="M91.6014789,16.4962676 L100.235493,16.4962676 L100.235493,14.2395775 L94.2857042,14.2395775 L94.2857042,4.28862676 L91.6014789,4.28862676 L91.6014789,16.4962676"
                          id="Fill-8"
                          fill="#000000"
                        />
                        <path d="M100.799894,16.4962676 L103.227782,16.4962676 L103.227782,4.28908451 L100.799894,4.28908451 L100.799894,16.4962676 Z" id="Fill-9" fill="#000000" />
                        <path
                          d="M103.774331,12.0854225 C103.774331,14.8891197 105.569613,16.735669 108.339437,16.735669 C111.126197,16.735669 112.921479,14.8891197 112.921479,12.0854225 C112.921479,9.26433099 111.126197,7.41778169 108.339437,7.41778169 C105.569613,7.41778169 103.774331,9.26433099 103.774331,12.0854225 L103.774331,12.0854225 Z M106.202218,12.0854225 C106.202218,10.6659507 106.697958,9.24693662 108.339437,9.24693662 C109.997852,9.24693662 110.493592,10.6659507 110.493592,12.0854225 C110.493592,13.4870423 109.997852,14.9060563 108.339437,14.9060563 C106.697958,14.9060563 106.202218,13.4870423 106.202218,12.0854225 L106.202218,12.0854225 Z"
                          id="Fill-10"
                          fill="#000000"
                        />
                        <path
                          d="M121.454331,7.6571831 L118.941303,7.6571831 L117.009155,13.709507 L116.974824,13.709507 L114.974472,7.6571831 L112.375845,7.6571831 L115.487606,15.9492606 C115.76088,16.6500704 115.487606,17.5220775 114.64993,17.6076761 C114.171127,17.6246127 113.692324,17.5564085 113.230458,17.5220775 L113.230458,19.5224296 C113.726655,19.5736972 114.222394,19.6080282 114.718134,19.6080282 C116.393486,19.6080282 117.23162,19.0266901 117.761232,17.6076761 L121.454331,7.6571831"
                          id="Fill-11"
                          fill="#000000"
                        />
                        <path
                          d="M127.488803,16.4962676 L129.796761,16.4962676 L129.796761,4.28862676 L127.368873,4.28862676 L127.368873,8.73426056 L127.335,8.73426056 L127.351937,8.73426056 C126.787535,7.86225352 125.761725,7.41778169 124.718979,7.41778169 C122.120352,7.41778169 120.803415,9.62320423 120.803415,11.9998239 C120.803415,14.4446479 122.102958,16.735669 124.770246,16.735669 C125.898592,16.735669 126.890528,16.3255282 127.454472,15.3679225 L127.488803,15.3679225 L127.488803,16.4962676 L127.488803,16.4962676 Z M127.454472,12.0510915 C127.454472,13.5044366 126.975669,14.9060563 125.368521,14.9060563 C123.863908,14.9060563 123.231303,13.4527113 123.231303,12.0680282 C123.231303,10.6146831 123.778768,9.24693662 125.368521,9.24693662 C126.941796,9.24693662 127.454472,10.6146831 127.454472,12.0510915 L127.454472,12.0510915 Z"
                          id="Fill-12"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              <svg
                v-if="scope.row.carrier == 'MAEU'"
                class="ign-logo uni-carrier-logo-image"
                style="width: 140px;height: 40px;display: inline-block;margin: 0px;"
                viewBox="0 0 170 38"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g id="Large---1280px-(Max-Width)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="IGN---Transparent" transform="translate(-104.000000, -21.000000)">
                    <g id="IGN">
                      <g id="Logo" transform="translate(104.000000, 21.000000)">
                        <g id="Text" transform="translate(51.502463, 9.973333)" fill="#FFFFFF">
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-4"
                            points="0.225647399 17.0377015 0.225647399 0.584446483 4.63718082 0.584446483 10.2269671 12.8797823 15.7337777 0.584446483 19.9599991 0.584446483 19.9599991 17.0377015 16.3222127 17.0377015 16.3222127 7.46604648 12.1250328 17.0377015 8.24730872 17.0377015 3.99619469 7.51820061 3.99619469 17.0377015 0.225647399 17.0377015"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M34.599652,10.6673492 L31.5558322,3.69310703 L28.5818502,10.6673492 L34.599652,10.6673492 Z M25.8609436,17.0377015 L21.5828626,17.0377015 L28.9365707,0.584446483 L34.2034438,0.584446483 L41.6097031,17.0377015 L37.386939,17.0377015 L35.9293352,13.7602263 L27.2736024,13.7602263 L25.8609436,17.0377015 L25.8609436,17.0377015 Z"
                            id="Fill-5"
                          />
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-6"
                            points="43.3155421 17.0377015 43.3155421 0.584446483 59.1445112 0.584446483 59.1445112 3.87427401 47.1386406 3.87427401 47.1386406 7.1421419 57.432449 7.1421419 57.432449 10.353052 47.1386406 10.353052 47.1386406 13.7465015 59.1735527 13.7465015 59.1735527 17.0377015 43.3155421 17.0377015"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M66.1296696,8.13924648 L74.4465856,8.13924648 L74.4465856,3.87427401 L66.1296696,3.87427401 L66.1296696,8.13924648 Z M62.252637,17.0377015 L62.252637,0.584446483 L75.4983007,0.584446483 C77.2677543,0.584446483 78.2952682,1.60076575 78.2952682,3.34381162 L78.2952682,8.871463 C78.2952682,10.143063 77.1605776,11.2925125 74.961034,11.2925125 C74.8365707,11.2986887 74.7093415,11.2925125 74.578655,11.2925125 L78.4342523,17.0377015 L74.1789895,17.0377015 L70.523225,11.411918 L66.1296696,11.411918 L66.1296696,17.0377015 L62.252637,17.0377015 L62.252637,17.0377015 Z"
                            id="Fill-7"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M85.2700547,17.0473089 L83.9576581,17.0473089 C82.244213,17.0473089 81.4192977,16.0646153 81.4192977,14.633808 L81.4192977,12.4845089 L85.2700547,12.4845089 L85.2700547,13.7574813 L93.4521354,13.7574813 L93.4521354,10.3894226 C93.4521354,10.3894226 85.5646179,10.3894226 84.0669092,10.3894226 C82.5685091,10.3894226 81.4891354,9.38957309 81.4891354,8.00199878 L81.4891354,3.11735291 C81.4891354,1.63919511 82.6639309,0.594740061 84.0931848,0.594740061 C85.5217472,0.594740061 94.8219234,0.594740061 94.8219234,0.594740061 C96.2719212,0.594740061 97.2752339,1.66870336 97.2752339,3.22166116 C97.2752339,4.77256024 97.2752339,5.1849896 97.2752339,5.1849896 L93.4521354,5.1849896 L93.4521354,3.88456758 L85.2700547,3.88456758 L85.2700547,7.12498593 L94.6283138,7.12498593 C96.0098567,7.12498593 97.2752339,8.03219327 97.2752339,9.77867034 L97.2752339,14.4746006 C97.2752339,16.0742226 96.3811723,17.0473089 94.709215,17.0473089 C93.0372576,17.0473089 85.2700547,17.0473089 85.2700547,17.0473089"
                            id="Fill-8"
                          />
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-9"
                            points="100.970412 17.0473089 100.970412 0.592681346 104.900687 0.592681346 104.900687 7.17370887 112.387156 0.592681346 117.708655 0.592681346 108.77772 8.23600612 118.030185 17.0473089 112.520608 17.0473089 104.900687 9.56319144 104.900687 17.0473089 100.970412 17.0473089"
                          />
                        </g>
                        <g id="Star" fill-rule="nonzero">
                          <path
                            d="M4.28463565,0 L31.3468062,0 C33.7169495,0 35.6383302,1.91076181 35.6383302,4.26780595 L35.6383302,33.132194 C35.6383302,35.4892382 33.7169495,37.4 31.3468062,37.4 L4.28463565,37.4 C1.91830905,37.4 0,35.4923151 0,33.1390665 L0,4.27467843 C-0.00365105909,3.142229 0.446140088,2.05490945 1.25005944,1.25285417 C2.0539788,0.450798892 3.14588678,0 4.28463565,0 Z"
                            id="Shape"
                            fill="#42B0D5"
                          />
                          <polygon
                            id="Shape"
                            fill="#FFFFFF"
                            points="23.4962889 17.6509756 30.5313476 8.91442683 30.5106156 8.88706098 20.3450249 13.7308171 17.8364529 2.84604878 17.7949889 2.84604878 15.2864169 13.7308171 5.12082631 8.88706098 5.10009431 8.91442683 12.135153 17.6509756 1.96956232 22.4947317 1.98338365 22.528939 13.2615916 22.528939 10.7530196 33.4205488 10.7806623 33.4342317 17.8157209 24.6976829 24.8507796 33.4342317 24.8853329 33.4137073 22.3698503 22.528939 33.6549689 22.528939 33.6618796 22.4947317"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../assets/ZIMU.png" />
              <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../assets/TSHG.png" />
              <img v-if="scope.row.carrier == 'MSCU'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />
              <img v-if="scope.row.carrier == 'MSC'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />

              <img v-if="scope.row.carrier == 'OOLU'" class="uni-carrier-logo-image" src="../../../assets/OOLU.svg" />
              <img v-if="scope.row.carrier == 'CMDU'" class="uni-carrier-logo-image" src="../../../assets/CMA.png" />
              <img v-if="scope.row.carrier == 'ONEY'" class="uni-carrier-logo-image" src="../../../assets/ONE.png" />
              <img v-if="scope.row.carrier == 'COSU'" class="uni-carrier-logo-image" src="../../../assets/COSCO.png" />
              <img v-if="scope.row.carrier == 'CMA'" class="uni-carrier-logo-image" src="../../../assets/logo/CMA.png" />
              <img v-if="scope.row.carrier == 'COSCO'" class="uni-carrier-logo-image" src="../../../assets/logo/COSCO.png" />
              <img v-if="scope.row.carrier == 'HPL'" class="uni-carrier-logo-image" src="../../../assets/logo/HPL.png" />

              <img v-if="scope.row.carrier == 'MSK'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />
              <img v-if="scope.row.carrier == 'HMM'" class="uni-carrier-logo-image" src="../../../assets/HMM.jpg" />
              <img v-if="scope.row.carrier == 'ONE'" class="uni-carrier-logo-image" src="../../../assets/logo/ONE.png" />
              <img v-if="scope.row.carrier == 'ZIM'" class="uni-carrier-logo-image" src="../../../assets/logo/ZIM.png" />
              <img v-if="scope.row.carrier == 'EMC'" class="uni-carrier-logo-image" src="../../../assets/logo/EMC.svg" />
              <img v-if="scope.row.carrier == 'OOCL'" class="uni-carrier-logo-image" src="../../../assets/logo/OOCL.svg" />
              <img v-if="scope.row.carrier == 'YML'" class="uni-carrier-logo-image" src="../../../assets/logo/YML.png" />
              <img v-if="scope.row.carrier == 'MCC'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />

              <img v-if="scope.row.carrier == 'EGLV'" class="uni-carrier-logo-image" src="../../../assets/logo/EGLV.png" />
              <img v-if="scope.row.carrier == 'SJHH'" class="uni-carrier-logo-image" src="../../../assets/logo/SJHH.png" />
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" label="Service" prop="service" width="180px"></el-table-column>

        <el-table-column label="Main Carriage" prop="mainCarriage" min-width="300px">
          <template v-slot="scope">
            <div style="width: 800px;">
              <div style="float: left; margin-right: 10px;margin-top: 20px">
                <div style="text-align: center; color:#c3c5c7; ">{{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ") }}</div>
                <div style="text-align: center;">{{ parseTime(scope.row.departureDate) }}</div>
              </div>

              <div style="float: left; width: 100px;">
                <div style="position: relative">
                  <div style="text-align: center;color:#385f78;white-space: nowrap;">{{ scope.row.vesselName }}</div>
                  <div class="image-container" style="position: absolute; left: 35px">
                    <img style="width: 20px; height: 20px" src="../../../assets/icons/ship.png" />
                  </div>
                  <div style="text-align: center;color:#385f78;position: absolute; top: 50px;left: 30px">{{ scope.row.voyage }}</div>
                </div>
              </div>

              <div style="float: left;margin-left: 10px;margin-top: 20px">
                <div style="text-align: center;  color:#c3c5c7; ">{{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ") }}</div>
                <div style="text-align: center;">{{ parseTime(scope.row.arrivalDate) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="TT" prop="transitTime" min-width="100px">
          <template v-slot="scope">{{ scope.row.transitTime+" days" }}</template>
        </el-table-column>

        <el-table-column prop="choseSchedule" width="100px">
          <template v-slot="scope">
            <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Transport Pre-assign" :visible.sync="preAssgineVisable" width="1200px" append-to-body>
      <el-form :show-message="false" label-width="140px" ref="preAssF" :model="preAssgineForm" style="padding: 0px;">
        <div style="text-align: right;padding-bottom: 10px;" v-hasPermi="['shipment:schedule-search']">
          <el-button @click="queryShippingSchedule" type="warning">Select vessel schedule</el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Place of receipt" prop="por">
              <el-select filterable v-model="preAssgineForm.por">
                <el-option v-for="(item, index) in portOptions" :key="index + 'por'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Final Destination" prop="fnd">
              <el-select filterable v-model="preAssgineForm.fnd">
                <el-option v-for="(item, index) in portOptions" :key="index + 'fnd'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Port of Loading" prop="pol">
              <el-select filterable v-model="preAssgineForm.pol">
                <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="port of Discharge">
            <el-select  filterable v-model="preAssgineForm.pod">
              <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pod'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
            </el-select>
      </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vessel">
              <el-select v-model="preAssgineForm.vessel" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
                <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Voyage">
              <el-input v-model="preAssgineForm.voyage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Carrier">
              <el-select filterable v-model="preAssgineForm.carrier">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ETD" prop="etd">
              <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.etd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ETA">
              <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.eta"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: right;">
          <el-button @click="preAssgineVisable=false">Cancel</el-button>
          <el-button type="primary" @click="submitPreAssign">Submit</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-card style="padding: 10px;">
      <div>
        <div class="bottom-shadow">
          <div style="float:left; ">
            <el-form :model="queryParams">
              <div style="float: left;padding: 10px 0px; width: 200px;">
                <el-input placeholder="MOOV Ref" v-model="queryParams.bookingNumber" @keyup.enter.native=" queryParams.pageNo = 1 ,getPage()" />
              </div>
              <div style="float:left;margin-left: 10px;padding: 10px 0px; width: 200px;"">
                <el-input placeholder="Order Number" v-model="queryParams.orderNumber" @keyup.enter.native=" queryParams.pageNo = 1 ,getPage()" />
              </div>

              <div style="float:left;margin-left: 10px;padding: 10px 0px; width: 200px;"">
                <el-select clearable placeholder="POL" filterable v-model="queryParams.originPort">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                </el-select>
              </div>
              <div style="float:left;margin-left: 10px;padding: 10px 0px; width: 200px;"">
                <el-select clearable placeholder="POD" filterable v-model="queryParams.destinationPort">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                </el-select>
              </div>

              <div style="float:left;margin-left: 10px;padding: 10px 0px; width: 150px;"">
                <el-select clearable placeholder="Status" filterable v-model="queryParams.status">
                  <el-option v-for="(item, index) in bookingStatusList" :key="index + 'bookingStatus'" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>

              <div style="float:left;margin-left:15px;padding-top: 10px">
                <el-button @click="queryParams.pageNo = 1 ,getPage()">
                  <i class="el-icon-search"></i> Search
                </el-button>
              </div>
              <div style="float:left;margin-left: 15px;padding: 10px 0px;">
                <el-select @change="queryParams.pageNo = 1 ,getPage()" v-model="queryParams.shipmentBooking" placeholder="Booked/Not Booked">
                  <el-option label="All" :value="null"></el-option>
                  <el-option label="Not booked" :value="false"></el-option>
                  <el-option label="Booked" :value="true"></el-option>
                </el-select>
              </div>
            </el-form>
          </div>
          <div style="float: right;padding-top: 10px;">
            <el-row>
              <div style="float: left">
                <el-button v-hasPermi="['booking:create-notpo']" size="mini" @click="createBooking" type="primary">{{ $t("booking.createBooking") }}</el-button>
              </div>
              <div style="float: left;margin-left: 10px;">
                <el-button v-hasPermi="['shipment:create']" size="mini" @click="createShipment" type="primary">{{ $t("booking.createShipment") }}</el-button>
              </div>
              <div style="float: left;margin-left: 10px;">
                <el-button @click="preAssgineOpen" size="mini" type="primary">Transport Pre-assign</el-button>
              </div>
              <!--      <div style="float: left;margin-left: 10px;">
        <el-button
          @click="exportTxt"
          size="mini"
          type="primary"
        >TXT Export</el-button>
              </div>-->
            </el-row>
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
      <!-- <div
      style="float: left; width: 220px; overflow: auto;background: #fff;margin-top: 10px;"
      :style="{ height: (height)+'px' }"
      class="no-line"
    >
      <p style="padding-right: 20px;padding-left: 20px;">
        <el-input style="outline: none" placeholder="Search" v-model="searchContent" />
      </p>
      <br />
      <el-empty
        v-show="
          searchContent != '' &&
          activities.filter(
            (item) => item.content.toLowerCase().indexOf(searchContent.toLowerCase()) > -1
          ).length == 0
        "
        description="No Data"
      ></el-empty>
      <el-timeline>
        <el-timeline-item
          class="port"
          v-for="(activity, index) in activities.filter(
            (item) => item.content.toLowerCase().indexOf(searchContent.toLowerCase()) > -1
          )"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          <div @click="clickPort(activity)">{{ activity.content }}</div>
        </el-timeline-item>
      </el-timeline>
      </div>-->
      <div style="float: left; width: calc(100%);">
        <div style="overflow:auto" :style="{ height: (height-55)+'px' }">
          <el-empty v-if="tableData.length == 0 && !loading" description="No Data"></el-empty>
          <el-descriptions
            style="padding: 15px 15px 0px 15px!important;background: #fff;box-shadow: none!important;border: 1px solid #ddd;"
            :colon="false"
            direction="vertical"
            v-for="item in tableData"
            :key="item.id"
            class="margin-top"
            :column="4"
            :size="size"
          >
            <template slot="title">
              <span class="desc-title">{{ $t("booking.MOOVRef") }}</span>：
              <el-link type="primary" :href="'/shipment/booking-detail?id=' + item.id" target="_blank">
                {{
                item.bookingNumber ? item.bookingNumber : "-"
                }}
              </el-link>&nbsp; | &nbsp;
              <span class="desc-title">{{ $t("booking.shipperRef") }}</span>：
              <span style="color: #409eff">
                {{
                item.shipperRef ? item.shipperRef : "-"
                }}
              </span>
              &nbsp; | &nbsp;
              <span>Status</span>：
              <span>
                {{
                showStatus(item.status)
                }}
              </span>
              <span>
                <svg
                  v-if="!expanded[item.id]"
                  @click="toggleDetails(item.id)"
                  style="position: absolute;cursor: pointer;
    right: 20px;top:20px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 36L12 24L24 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M36 36L24 24L36 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg
                  v-if="expanded[item.id]"
                  @click="toggleDetails(item.id)"
                  style="position: absolute;cursor: pointer;right: 20px;top:20px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>

              <span class="no-label" v-if="item.shipmentId==null">
                <el-checkbox size="medium" border style="border: 1px solid #409eff;position: absolute;cursor: pointer;right: 85px;top:15px" v-model="preAssgine" :label="item.id" :key="item.id" :value="item.id"></el-checkbox>
              </span>
              <span v-if="item.shipmentId!=null" style="color:#409eff;font-weight: bold;position: absolute;cursor: pointer;right: 135px;top:15px">Transport Plan Assigned</span>
              <span v-if="item.shipmentId==null&&item.preAssign!=null" style="color:#409eff;font-weight: bold;position: absolute;cursor: pointer;right: 135px;top:15px">Pre Assigned</span>
            </template>
            <el-descriptions-item :label="$t('booking.shipper')">
              {{
              partyMap[item.shipper]
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.consignee')">
              {{
              partyMap[item.consignee]
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.pol')">
              {{
              item.originPort
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.deliverBy') + ' '">{{ parseTime(item.deliverDate) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('booking.shipmentName')">
              {{
              item.shipmentName
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.buyer')" v-if="item.buyers">
              <el-tag v-for="buyer in item.buyers" :key="buyer + '-' + item.id">
                {{
                partyMap[buyer]
                }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.teus')">
              <el-tag v-for="container in item.containers" :key="container.id">{{ container.type }} x {{ container.qty }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.pod')">
              {{
              item.destinationPort
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.etd') + '/' + $t('booking.eta')">{{ parseTime(item.etd) }}-{{ parseTime(item.eta) }}</el-descriptions-item>

            <el-descriptions-item label>
              <el-collapse-transition>
                <div v-show="expanded[item.id]" style="width: 100%;">
                  <el-tabs :ref="'tab'+item.id" v-model="item.key">
                    <el-tab-pane label="Transport Pre-assign" :name="'first'+item.id">
                      <el-empty v-if="item.bookingPreAssignDOS.length==0"></el-empty>
                      <el-descriptions style="margin: 10px;padding: 15px!important;" v-for="item1 in item.bookingPreAssignDOS.length>0?[item.bookingPreAssignDOS[item.bookingPreAssignDOS.length-1]]:[]" :column="4">
                        <el-descriptions-item label="Carrier">{{ item1.carrier }}</el-descriptions-item>
                        <el-descriptions-item label="POR">{{ item1.por }}</el-descriptions-item>
                        <el-descriptions-item label="FND">{{ item1.fnd }}</el-descriptions-item>
                        <el-descriptions-item label="POL">{{ item1.pol }}</el-descriptions-item>
                        <el-descriptions-item label="POD">{{ item1.pod }}</el-descriptions-item>
                        <el-descriptions-item label="Vessel">{{ item1.vessel }}</el-descriptions-item>
                        <el-descriptions-item label="Voyage">{{ item1.voyage }}</el-descriptions-item>
                        <el-descriptions-item label="ETD">{{ parseTime(item1.etd) }}</el-descriptions-item>
                        <el-descriptions-item label="ETA">{{ parseTime(item1.eta) }}</el-descriptions-item>
                      </el-descriptions>
                      <br />
                    </el-tab-pane>
                    <el-tab-pane label="Orders" :name="'first1'+item.id">
                      <el-table :data="item.orderItemList" style="width: 100%">
                        <el-table-column prop="orderNumber" label="Order Number" width="180"></el-table-column>
                        <el-table-column prop="bookQty" width="180" label="Book Qty"></el-table-column>
                        <el-table-column prop="bookedUnit" width="180" label="Booked Unit"></el-table-column>
                        <el-table-column prop="productName" label="Product Name"></el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <pagination :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getPage" />
      </div>

      <div style="clear: both"></div>
    </el-card>
  </div>
</template>

<style scoped>
p {
  margin: 0px;
}
.el-checkbox.is-bordered.el-checkbox--medium {
  padding: 7px 12px 7px 12px;
}

.expand-transition {
  transition: all 0.5s;
  height: 0;
  overflow: hidden;
}

.expand-transition-enter,
.expand-transition-leave-to {
  height: 0;
}

.expand-transition-enter-active,
.expand-transition-leave-active {
  height: auto;
}
.rotate-90 {
  transform: rotate(90deg);
}
.demo-table-expand {
  font-size: 0;
}
.border-top {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.el-descriptions-row th {
  color: rgb(0, 79, 124);
  font-weight: 700 !important;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.uni-carrier-logo-image {
  width: 180px;
  height: 60px;
  image-rendering: -webkit-optimize-contrast;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
}
.ptp-results__transport-plan--deadline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  border: 1px solid #dbdbdb;
  padding: 8px;
  margin: 8px 0;
}
.ptp-results__transport-plan--mode {
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}
.ptp-results__transport-plan--vessel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}
.vessel-title {
  text-align: center;
}
</style>

<script>
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { getPage, groupByPort, bookingReport, exportExcel, exportBooking, exportTxtUrl } from '@/api/booking/booking'
import { getDeptList } from '@/api/system/dept'
import { getProductList } from '@/api/system/product'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getVesselList } from '@/api/system/vessel'
import { createPreAssign } from '@/api/booking/preAssign'
import { findShippingScheduleList } from '@/api/shipment/shipment'
export default {
  name: 'Booking',
  components: { IconPark },
  data() {
    return {
      bookingStatusList: [
        { label: 'Pending Validation', value: 0 },
        { label: 'Pass', value: 1 }
      ],
      tableData: [],
      activities: [],
      loading: true,
      expanded: {},
      searchContent: '',
      size: 'small',
      lineTotal: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 10
        // shipmentBooking: null
      },
      preAssgineVisable: false,
      preAssgine: [],
      preAssgineForm: {},
      partyMap: {},
      productMap: {},
      selectBookMap: {},
      height: '',
      totalBookings: 0,
      vesselListLes: [],
      portOptions: [],
      shippingScheduleData: [],
      shippingScheduleVisable: false,
      carrierMap: {
        CMDU: 'CMA',
        COSU: 'COSCO',
        EGLV: 'EMC',
        HLCU: 'HPL',
        MSCU: 'MSC',
        ONEY: 'ONE',
        ZIMU: 'ZIM',
        MAEU: 'MSK',
        TSHG: 'TSHG',
        'MAEU-ALWAYS': 'MSK',
        'SHCO': 'SHIPCO',
        'NVOCC DSV': 'DSV',
        'WECC': 'WEC',
      },
      carrierMap2: {
        CMA: 'CMDU',
        TSHG: 'TSHG',
        COSCO: 'COSU',
        EMC: 'EGLV',
        HPL: 'HLCU',
        MSC: 'MSCU',
        ONE: 'ONEY',
        ZIM: 'ZIMU',
        MSK: 'MAEU',
        'SHIPCO': 'SHCO',
        'DSV': 'NVOCC DSV',
        'WEC': 'WECC',
      },
      bookingInfo: {
        ports: [],
        booked: 0,
        notBooked: 0
      },
      checkedPort: {}
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 320
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 320;
    this.groupByPort()
    this.getOriginDeliveryList()
    this.bookingReport()
  },
  methods: {
    bookingReport() {
      bookingReport(this.queryParams).then(res => {
        this.bookingInfo = res.data
      })
    },
    showStatus(status) {
      if (status == '0') {
        return 'Pending Validation'
      } else if (status == '1') {
        return 'Pass'
      } else {
        return 'Validate Failed'
      }
    },
    choseSchedule(row) {
      this.$set(this.preAssgineForm, 'carrier', this.carrierMap2[row.carrier])
      this.$set(this.preAssgineForm, 'etd', row.departureDate)
      this.$set(this.preAssgineForm, 'eta', row.arrivalDate)
      this.$set(this.preAssgineForm, 'vessel', row.vesselName)
      this.$set(this.preAssgineForm, 'voyage', row.voyage)
      if (this.preAssgineForm.pol == null) {
        this.$set(this.preAssgineForm, 'pol', row.port)
      }
      if (this.preAssgineForm.pod == null) {
        this.$set(this.preAssgineForm, 'pod', row.pod)
      }
      this.shippingScheduleVisable = false
    },
    queryShippingSchedule() {
      this.$refs['preAssF'].validate(valid => {
        if (valid) {
          var data = {
            origin: this.preAssgineForm.por,
            destination: this.preAssgineForm.fnd,
            departureFrom: this.parseTime(this.preAssgineForm.etd),
            departureFrom2: this.parseTime(this.preAssgineForm.etd2),
            carrier: this.carrierMap[this.preAssgineForm.carrier]
          }
          this.findShippingScheduleList(data)
          this.shippingScheduleVisable = true
        } else {
          this.$notify({
            title: 'warning',
            message: 'Required fields is empty',
            type: 'warning'
          })
          return false
        }
      })
    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then(response => {
        this.shippingScheduleData = response.data
      })
    },
    submitPreAssign() {
      var data = JSON.parse(JSON.stringify(this.preAssgineForm))
      data.bookingIds = this.preAssgine
      createPreAssign(data).then(res => {
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        this.preAssgineVisable = false
        this.preAssgine = []
        this.getPage()
      })
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
      } else {
        this.vesselListLes = []
      }
    },

    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.portOptions = res.data
      })
    },
    preAssgineOpen() {
      if (this.preAssgine.length == 0) {
        this.$notify({
          message: 'No selected booking',
          type: 'warning'
        })
      } else {
        this.preAssgineVisable = true
      }
    },
    exportTxt() {
      this.$modal
        .confirm('Export?')
        .then(() => {
          this.exportLoading = true
          return exportTxtUrl('1')
        })
        .then(response => {
          this.$download.excel(response, 'PVH_EDI.txt')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    createBooking() {
      this.$router.push('/shipment/booking-create')
    },
    createShipment() {
      var ids = this.preAssgine
      if (ids.length > 0) {
        this.$router.push('/shipment/create?ids=' + ids.join(','))
      } else {
        this.$notify({
          message: 'Please select booking data first',
          type: 'warning'
        })
      }
    },
    clickPort(item) {
      var flag = false
      for (var i = 0; i < this.activities.length; i++) {
        if (this.activities[i].content == item.content) {
          if (this.activities[i].type == 'primary') {
            flag = true
            this.activities[i].type = ''
          } else {
            this.activities[i].type = 'primary'
          }
        } else {
          this.activities[i].type = ''
        }
        this.$set(this.activities, i, this.activities[i])
      }
      if (flag) {
        this.queryParams.originPort = ''
        this.queryParams.destinationPort = ''
      } else {
        this.queryParams.originPort = item.content.split('-')[0]
        this.queryParams.destinationPort = item.content.split('-')[1]
      }
      this.selectBookMap = {}
      this.getPage()
    },
    groupByPort() {
      groupByPort().then(response => {
        this.totalBookings = 0
        for (var i = 0; i < response.data.length; i++) {
          this.activities.push({
            content: response.data[i].originPort + '-' + response.data[i].destinationPort,
            timestamp: this.$t('booking.bookingItems') + '(' + response.data[i].count + ')',
            type: ''
          })
          this.totalBookings += response.data[i].count
        }
        if (response.data.length > 0) {
          this.getPage()
        } else {
          this.loading = false
        }
      })
    },
    sortByQueryParams(property, asc = true) {
      //默认升序
      asc = asc == true ? -1 : 1
      return function (value1, value2) {
        let a = value1[property]
        let b = value2[property]
        return a < b ? asc : a > b ? asc * -1 : 0
      }
    },
    selectBook(item) {
      this.selectBookMap[item.id] = !this.selectBookMap[item.id]
    },
    getDeptList(ids) {
      var vm = this
      getDeptList({ ids: ids.join(',') }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(vm.partyMap, response.data[i].id, response.data[i].name)
        }
      })
    },
    getPage() {
      this.loading = true
      getPage(this.queryParams).then(response => {
        this.loading = false
        if (response.data.list == null) {
          response.data.list = []
          response.data.total = 0
        }
        this.tableData = response.data.list
        this.lineTotal = response.data.total
        this.expanded = {}
        if (this.tableData.length > 0) {
          var partyIds = []
          var productIds = []
          for (var i = 0; i < this.tableData.length; i++) {
            partyIds.push(this.tableData[i].shipper)
            partyIds.push(this.tableData[i].consignee)
            this.tableData[i].key = 'first' + this.tableData[i].id
            if (this.tableData[i].buyers) {
              for (var j = 0; j < this.tableData[i].buyers.length; j++) {
                partyIds.push(this.tableData[i].buyers[j])
              }
            }
            if (this.tableData[i].productIds) {
              for (var k = 0; k < this.tableData[i].productIds.length; k++) {
                productIds.push(this.tableData[i].productIds[k])
              }
            }
          }
          this.getDeptList(partyIds)
          getProductList({ ids: productIds }).then(response => {
            for (var i = 0; i < response.data.length; i++) {
              this.$set(this.productMap, response.data[i].id, response.data[i].name + '[' + response.data[i].code + ']')
            }
          })
        }
      })
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index])
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = {
            pageNo: 1,
            pageSize: 20,
            prop: '',
            orderBy: '',
            shipment: 1
          }
          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          return exportExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_ShipperBooking' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    },
    clickPort(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item])
      var ports = []
      for (var key in this.checkedPort) {
        if (this.checkedPort[key]) {
          ports.push(key)
        }
      }
      this.queryParams.ports = ports
      this.getPage()
    },
    parseTimeToZ1(timestamp) {
      console.log(timestamp, timestamp)
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`
    }
  }
}
</script>
