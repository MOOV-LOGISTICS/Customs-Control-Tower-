<template>
  <div class="app-container" style="width:100%; margin: 0 auto" v-loading="loading">
    <el-card style="padding: 15px;">
      <el-divider content-position="left">{{ $t("booking.schedule") }}</el-divider>
      <el-form :model="searchData" ref="form" :show-message="false" label-width="0px">
        <el-row :gutter="20">
          <el-col :span="4">
            POL:
            <span style="color:red">*</span>
            <el-form-item required prop="origin">
              <el-select placeholder="POL" filterable v-model="searchData.origin">
                <el-option v-for="dict in this.portData" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            POD:
            <span style="color:red">*</span>
            <el-form-item required prop="destination">
              <el-select placeholder="POD" filterable v-model="searchData.destination">
                <el-option v-for="dict in this.portData" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            Carrier:
            <el-form-item prop="carrier">
              <el-select placeholder="Carrier" filterable clearable v-model="searchData.carrier">
                <el-option v-for="dict in this.carriers" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            ETD From:
            <span style="color:red">*</span>
            <el-form-item required prop="departureFrom">
              <el-date-picker placeholder="ETD From" value-format="yyyy-MM-dd" v-model="searchData.departureFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            ETD To:
            <el-form-item prop="departureFrom2">
              <el-date-picker placeholder="ETD To" value-format="yyyy-MM-dd" v-model="searchData.departureFrom2" :picker-options="pickerOptions" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
          Week:
          <el-form-item prop="weeks">
            <el-select v-model="searchData.weeks" clearable placeholder="Week+/-">
              <el-option
                v-for="week in weeksOut"
                :key="week"
                :label="week"
                :value="week"
              />
            </el-select>
          </el-form-item>
          </el-col>-->
          <el-col :span="1.5">
            Type:
            <br />
            <el-checkbox style="height: 20px;margin-top: 7px !important;" v-model="searchData.through">Direct</el-checkbox>
            <el-checkbox style="height: 20px;" v-model="searchData.transfer">Indirect</el-checkbox>
          </el-col>
          <el-col class="right-aligned" :span="1.5">
            <el-button @click="findShippingScheduleList(searchData.carrier)" type="primary" align="right">
              Search
              <i class="el-icon-search el-icon--right"></i>
            </el-button>
          </el-col>
        </el-row>
        <div></div>
      </el-form>

      <el-table :data="tableData" :height="height" @expand-change="expandTable" @sort-change="handleSortChange">
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
      <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{
        item.portCode }}</div>
      <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
      <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;"> {{ item.barge }}
      </div>
      <!-- Transport Mode: -->

    </div>
    <div style="float: left;">
      <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg
          part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z">
          </path>
        </svg></span>
      <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg
          part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24"
          height="24" viewBox="0 0 24 24">
          <path
            d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z">
          </path>
        </svg></span>
      <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24"
        style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision"
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z">
          </path>
        </svg></span>
      <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null)"
        style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
      <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null)"
        style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
    </div>
    <div style="float: left;">
      <div style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>
      <div style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(item.eventTime) }}</div>
      <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style=""
        class="ptp-results__transport-plan--vessel mds-text--small-normal">
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

        <el-table-column prop="carrier" sortable="custom" :label="$t('booking.carrier')" width="250px" :align="'center'">
          <template slot-scope="scope">
            <div>
              <img v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" src="../../../../assets/HLCU.png" />
              <img v-if="scope.row.carrier == 'MAEU'" class="uni-carrier-logo-image" src="../../../../assets/MAEU.png" />
              <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../../assets/ZIMU.png" />
              <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../../assets/tailwind.png" />
              <img v-if="scope.row.carrier == 'MSCU'" class="uni-carrier-logo-image" src="../../../../assets/MSCU-new.png" />
              <img v-if="scope.row.carrier == 'MSC'" class="uni-carrier-logo-image" src="../../../../assets/MSCU-new.png" />

              <img v-if="scope.row.carrier == 'OOLU'" class="uni-carrier-logo-image" src="../../../../assets/OOLU.svg" />
              <img v-if="scope.row.carrier == 'CMDU'" class="uni-carrier-logo-image" src="../../../../assets/CMA.png" />
              <img v-if="scope.row.carrier == 'ONEY'" class="uni-carrier-logo-image" src="../../../../assets/ONE.png" />
              <img v-if="scope.row.carrier == 'COSU'" class="uni-carrier-logo-image" src="../../../../assets/COSCO.png" />
              <img v-if="scope.row.carrier == 'CMA'" class="uni-carrier-logo-image" src="../../../../assets/logo/CMA.png" />
              <img v-if="scope.row.carrier == 'COSCO'" class="uni-carrier-logo-image" src="../../../../assets/logo/COSCO.png" />
              <img v-if="scope.row.carrier == 'HPL'" class="uni-carrier-logo-image" src="../../../../assets/logo/HPL.png" />

              <img v-if="scope.row.carrier == 'MSK'" class="uni-carrier-logo-image" src="../../../../assets/logo/MSK.png" />
              <img v-if="scope.row.carrier == 'HMM'" class="uni-carrier-logo-image" src="../../../../assets/HMM.jpg" />
              <img v-if="scope.row.carrier == 'ONE'" class="uni-carrier-logo-image" src="../../../../assets/logo/ONE.png" />
              <img v-if="scope.row.carrier == 'ZIM'" class="uni-carrier-logo-image" src="../../../../assets/logo/ZIM.png" />
              <img v-if="scope.row.carrier == 'EMC'" class="uni-carrier-logo-image" src="../../../../assets/logo/EMC.svg" />
              <img v-if="scope.row.carrier == 'OOCL'" class="uni-carrier-logo-image" src="../../../../assets/logo/OOCL.svg" />
              <img v-if="scope.row.carrier == 'YML'" class="uni-carrier-logo-image" src="../../../../assets/logo/YML.png" />
              <img v-if="scope.row.carrier == 'MCC'" class="uni-carrier-logo-image" src="../../../../assets/logo/MSK.png" />
              <img v-if="scope.row.carrier == 'EGLV'" class="uni-carrier-logo-image" src="../../../../assets/logo/EGLV.png" />
              <img v-if="scope.row.carrier == 'SJHH'" class="uni-carrier-logo-image" src="../../../../assets/logo/SJHH.png" />
              <img v-if="scope.row.carrier == 'SMLU'" class="uni-carrier-logo-image" src="../../../../assets/logo/SMLU.png" />
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
                    <img style="width: 20px; height: 20px" src="../../../../assets/icons/ship.png" />
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

        <!-- <el-table-column sortable="custom"  :label="$t('booking.voyage')" prop="voyage" min-width="100px">
            <template slot-scope="scope">
              {{ scope.row.voyage }}
            </template>
          </el-table-column>
          <el-table-column sortable="custom"
            :label="$t('booking.vesselCode')"
            prop="vesselCode"
            min-width="100px"
          >
            <template slot-scope="scope">
              <el-link :underline="true" class="buttonText" :href="'/track/ship?vesselName='+ scope.row.vesselCode " target="_blank">
              {{ scope.row.vesselCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column sortable="custom"
            :label="$t('booking.vesselName')"
            prop="vesselName"
            min-width="100px"
          >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title=""
              width="200"
              trigger="hover"
              content="Click to track vessel">
              <el-link slot="reference" :underline="true" class="buttonText" :href="'/tracking?vesselName='+ scope.row.vesselName " target="_blank">
              {{ scope.row.vesselName }}
              </el-link>
            </el-popover>

            </template>
          </el-table-column>
          <el-table-column  :label="$t('booking.pol')" prop="port" min-width="100px">
          </el-table-column>
          <el-table-column :label="$t('booking.pod')" prop="pod" min-width="100px">
          </el-table-column>
          <el-table-column sortable="custom"
            :label="$t('booking.etd')"
            prop="departureDate"
            min-width="100px"
          >
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.departureDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom"
            :label="$t('booking.eta')"
            prop="arrivalDate"
            min-width="100px"
          >
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.arrivalDate) }}</span>
            </template>
        </el-table-column>-->
        <el-table-column sortable="custom" prop="book" width="100px">
          <template v-slot="scope">
            <el-button size="mini" v-hasPermi="['schedule:book:but']" type="primary" @click="book(scope.row)">Book</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style>
.fl {
  float: left;
}

.fr {
  float: right;
}

.right-aligned {
  text-align: right;
  margin-top: 10px;
}

.uni-carrier-logo-image {
  width: 180px;
  height: 60px;
  image-rendering: -webkit-optimize-contrast;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
}

.icon-arrow {
  vertical-align: middle;
}

.icon-arrow + .icon-arrow {
  margin-left: 6px;
}

.el-timeline {
  padding-left: 50px;
}

.el-timeline-item:last-child {
  margin-bottom: 0;
}

.el-timeline-item:first-child {
  margin-bottom: 10;
}

.no-border-table th,
.no-border-table td {
  border-bottom: none !important;
}
.no-border-table::before {
  height: 0px;
}

.companydel {
  color: #020a1a;
  position: absolute;
  left: -140px;
  top: 1px;
  font-size: 14px;
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
import { findShippingSchedulePortList, scheduleDetails } from '@/api/shipment/shipment'
import { findShippingScheduleList } from '@/api/shipment/shipment'
import moment from 'moment'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import { listUserSchedulesDo } from '@/api/system/schedule'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
export default {
  name: 'shippingSchedule',
  components: {},
  data() {
    return {
      loading: false,
      activeName: '',
      // weeksOut: [1, 2, 3, 4, 5, 6, 7, 8],
      searchData: {
        through: false,
        transfer: false,
        weeks: 5,
        departureFrom: new Date(),
        departureFrom2: '',
        origin: null,
        destination: null,
        carrier: null
      },
      lineTotal: 0,
      tableData: [],
      options1: [],
      options2: [],
      portData: [],
      tableData2: [],
      height: '',
      carrierMap: {
        TSHG: 'TSHG',
        'MAEU-ALWAYS': 'MSK',
        HMM: 'HMM',
        ACIC: 'MSK',
        ANNU: 'ANL',
        APLU: 'CMA',
        ATLC: 'ATL',
        CCNR: 'MSK',
        CKLC: 'CKL',
        CMDU: 'CMA',
        CNCL: 'CNC',
        COSU: 'COSCO',
        CULU: 'CUL',
        DELC: 'CMA',
        EGLV: 'EMC',
        EPIR: 'ESL',
        GOSU: 'GSL',
        HALC: 'HAL',
        HASU: 'HASCO',
        SUDU: 'MSK',
        HDMU: 'HMM',
        HLCU: 'HPL',
        IALU: 'IAL',
        JINX: 'JINJIANG',
        KMBU: 'KKC',
        KMTC: 'KMTC',
        KWEU: 'KWE',
        MATS: 'MATS',
        MCPU: 'MCC',
        MSCU: 'MSC',
        MAEU: 'MSK',
        NGPL: 'NGPL',
        NOSC: 'NOSCO',
        NSSC: 'NSS',
        ONEY: 'ONE',
        OOLU: 'OOCL',
        PCLC: 'PCL',
        PABV: 'PIL',
        RCLC: 'RCL',
        SJHH: 'SEALEAD',
        SNTU: 'SINO',
        SKMC: 'SINOKOR',
        SITC: 'SITC',
        SMLM: 'SML',
        POBU: 'STX',
        GETU: 'TARROS',
        TCLC: 'TCLC',
        TRAW: 'TRAWIND',
        TSQD: 'TSL',
        USLC: 'CMA',
        WHLC: 'WHL',
        YMJA: 'YML',
        ZIMU: 'ZIM',
        ZSHC: 'ZSH',
        FESO: 'FESCO',
        MELL: 'MARIANA',
        HEDE: 'HEDE',
        DYSL: 'DYS',
        DJSL: 'DJS',
        SIMP: 'SIF',
        MSKM: 'MINSHENG',
        'SHCO': 'SHIPCO',
        'NVOCC DSV': 'DSV',
        'WECC': 'WEC',
      },
      carriers: [],
      tableDataCopy: [],
      pickerOptions: this.handelDate()
    }
  },
  mounted() {
    window.addEventListener('resize', this.calcHeight)
  },
  created() {
    this.findShippingSchedulePortList()
    this.searchData.departureFrom = this.$route.query.etd
    this.getDepartureFrom2(this.$route.query.etd)
    this.remoteMethodCarriers()
    this.searchData.origin = this.$route.query.pol
    this.searchData.destination = this.$route.query.pod
    this.searchData.carrier = this.$route.query.carrier
    if (this.searchData.origin && this.searchData.destination) {
      this.findShippingScheduleList(this.searchData.carrier)
    }

    if (!this.searchData.departureFrom) {
      this.searchData.departureFrom = this.getTodayDate()
    }
    this.calcHeight()
  },
  methods: {
    checkPermi,
    handleSortChange({ column, prop, order }) {
      this.tableData.sort((a, b) => {
        if (order === 'ascending') {
          return a[prop] > b[prop] ? 1 : -1
        } else if (order === 'descending') {
          return a[prop] < b[prop] ? 1 : -1
        } else {
          return 0
        }
      })
    },
    handelDate() {
      let that = this
      return {
        disabledDate(date) {
          let now = new Date(that.searchData.departureFrom).getTime() - 8.64e7
          let limitDays = 7 * 5 * 24 * 60 * 60 * 1000 // 35天的毫秒数
          let ts = date.getTime()
          if (ts >= now && ts <= now + limitDays) return false
          return true
        }
      }
    },

    remoteMethodCarriers() {
      this.carriers = []
      listUserSchedulesDo().then(response => {
        // 设置选中
        // this.form.scheduleIds = response.data;
        this.carriers = response.data
      })
      /*      var carr = getDictDatas(DICT_TYPE.CARRIER);
      for(var dic of carr) {
        if(this.carrierList.indexOf(dic.value)>-1) {
          this.carriers.push(dic)
        }
      }*/
    },

    getDepartureFrom2(query) {
      if (query != null && query != '') {
        var dateTemp = query.split('-')
        var nDate = new Date(dateTemp[0] + '-' + dateTemp[1] + '-' + dateTemp[2])
        var millSeconds = Math.abs(nDate) + 7 * 5 * 24 * 60 * 60 * 1000
        var rDate = new Date(millSeconds)
        var year = rDate.getFullYear()
        var month = rDate.getMonth() + 1
        if (month < 10) month = '0' + month
        var date = rDate.getDate()
        if (date < 10) date = '0' + date
        this.searchData.departureFrom2 = year + '-' + month + '-' + date
        return year + '-' + month + '-' + date
      }
    },
    getTodayDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = (now.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1，并且保证两位数
      const day = now.getDate().toString().padStart(2, '0') // 日期需要保证两位数
      return `${year}-${month}-${day}`
    },
    expandTable(row, expanded) {
      if (row.list == null) {
        scheduleDetails({ carrier: row.carrier, vesselName: row.vesselName, voyage: row.voyage }).then(res => {
          if (res.data.data == null) {
            row.list = []
            return
          }
          var transports = res.data.data[0].transports
          var transportEvents = res.data.data[0].transportEvents
          var data = []
          var flag = false
          for (var i = 0; i < transports.length; i++) {
            if (flag) {
              break
            }
            var dataARRIs = transportEvents.filter(item => item.transportCall.location.locationSequence == transports[i].location.locationSequence && item.transportEventCategory == 'ARRI')

            var dataDEPAs = transportEvents.filter(item => item.transportCall.location.locationSequence == transports[i].location.locationSequence && item.transportEventCategory == 'DEPA')
            if (transports[i].location.locationCode == row.pod) {
              flag = true
            }
            console.log(dataARRIs)
            console.log(dataDEPAs)
            var obj = {
              portName: transports[i].location.locationName,
              port: transports[i].location.locationCode,
              bound: 'W',
              arrivalDate: dataARRIs.length > 0 ? new Date(dataARRIs[dataARRIs.length - 1].eventTime).getTime() : '',
              departureDate: dataARRIs.length > 0 ? new Date(dataDEPAs[dataDEPAs.length - 1].eventTime).getTime() : ''
            }

            data.push(obj)
          }
          console.log(data)
          row.list = data
          console.log(row.list)
        })
      }
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    book(row) {
      var carrier = row.carrier
      console.log(row.carrier)
      if (row.carrier == 'HPL') {
        carrier = 'HLCU'
      } else if (row.carrier == 'MSK') {
        carrier = 'MAEU'
      }
      var data = {
        etd: row.departureDate,
        eta: row.arrivalDate,
        pol: row.port,
        pod: row.pod,
        vn: row.vesselName,
        vc: row.vesselCode,
        imo: row.imo,
        vo: row.voyage,
        service: row.service,
        carrier: carrier,
        tshgList: row.tshgList
      }
      // 船期传过去
      console.log(btoa(JSON.stringify(data)))
      if (row.carrier == 'TSHG') {
        this.$router.push('/shipment/create?schdule=' + btoa(JSON.stringify(data)))
      } else {
        this.$router.push('/shipment/create-shipment?schdule=' + btoa(JSON.stringify(data)))
      }
    },
    findIndexesBetweenPorts(data, port1, port2) {
      const indexes = []
      for (let i = 0; i < data.length; i++) {
        const port = data[i].port

        if (port === port1 || port === port2) {
          indexes.push(i)
        }

        if (indexes.length === 2) {
          break
        }
      }
      return indexes
    },
    calcHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 305 + 'px'
    },
    onSearch() {
      console.log(123)
    },
    handleClick(tab, event) {
      this.findShippingScheduleList()
    },
    handleDelete(index) {
      this.searchData.containers.splice(index, 1)
    },
    findShippingSchedulePortList() {
      findShippingSchedulePortList(this.searchData).then(response => {
        this.portData = response.data
      })
    },
    validateSearchData() {
      return true
    },
    findShippingScheduleList(carrier) {
      console.log(carrier)

      var reqData = JSON.parse(JSON.stringify(this.searchData))

      if (!this.searchData.origin) {
        this.$notify({
          message: 'POL field is mandatory',
          type: 'warning'
        })
        return
      }
      if (!this.searchData.destination) {
        this.$notify({
          message: 'POD field is mandatory',
          type: 'warning'
        })
        return
      }
      if (!this.searchData.departureFrom) {
        this.$notify({
          message: 'ETD field is mandatory',
          type: 'warning'
        })
        return
      }
      this.loading = true
      reqData.carrier = this.carrierMap[carrier]
      if (reqData.carrier == null) {
        var carriers = getDictDatas(DICT_TYPE.CARRIER)
        for (let tempCarrier of carriers) {
          if (carrier == tempCarrier.value) {
            reqData.carrier = tempCarrier.cssClass
          }
        }
      }
      console.log(reqData.carrier)
      let that = this
      findShippingScheduleList(reqData).then(response => {
        this.tableData = response.data.filter(item => {
          if (that.searchData.departureFrom2 != null && that.searchData.departureFrom2 != '') {
            var form2 = new Date(that.searchData.departureFrom2).getTime()
            return item.departureDate <= form2
          } else {
            return true
          }
        })
        this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
        this.expanded = {}
        if (Array.isArray(this.tableData) && this.tableData.length === 0) {
        }
        this.loading = false
      })
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
