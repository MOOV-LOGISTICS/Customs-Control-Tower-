<template>
  <div class="app-container shipment-create" style="width:95%; margin: 0 auto">
    <el-dialog title="Payment Location" width="830px" :visible.sync="chosePaymentLocationVisable">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input placeholder="Port Code" v-model="queryParams.portCode" />
        </el-col>
        <el-col :span="6">
          <el-input placeholder="Port Name" v-model="queryParams.portName" />
        </el-col>

        <el-col :span="3">
          <el-button @click="queryParams.pageNo = 1 , chosePaymentLocation()">Search</el-button>
        </el-col>
      </el-row>

      <el-table border @cell-dblclick="chosePaymentLocationHandle" :data="paymentLocationList" style="width: 100%">
        <el-table-column prop="portCode" label="Port Code" width="100"></el-table-column>
        <el-table-column prop="portName" label="Port Name" width="300"></el-table-column>

        <el-table-column prop="countryChineseName" label="Country Chinese Name"></el-table-column>
        <el-table-column prop="countryEnglishName" label="Country English Name" width="210"></el-table-column>
      </el-table>
      <pagination :total="queryParams.total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="chosePaymentLocation" />
    </el-dialog>

    <el-card class="pd-20">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Basic Info" name="first"></el-tab-pane>
        <el-tab-pane label="Containers and Products" name="second"></el-tab-pane>
      </el-tabs>

      <el-form :model="form" ref="form" label-width="140px">
        <el-row :gutter="20">
          <el-col v-show="activeName=='first'" :span="15">
            <div>
              <el-row>
                <el-col :span="20" style="display: flex;">
                  <el-tag size="small" style="margin-right: 5px;  font-size: 14px; " v-for="spo in spoList" :key="spo.id">
                    <el-link v-show="isPepco" type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+spo.id">
                      {{
                      spo.soRef }}
                    </el-link>
                    <el-link v-show="!isPepco" type="primary" target="_blank" :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top" title="Basic Info" direction="vertical" :column="4" size="mini">
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Carrier
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="carrier">
                  <el-select @change="changeCarrier" filterable v-model="form.carrier">
                    <el-option v-for="dict in carrierList" v-if="dict.value!='TSHG'" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
 <!--              <el-descriptions-item v-if="showRealCarrier">
                <template slot="label">
                  <span style="color:red;">*</span>Real Carrier
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="realCarrier">
                  <el-select @change="realChangeCarrier" filterable v-model="form.realCarrier">
                    <el-option v-for="dict in realCarrierList" v-if="dict.value!='TSHG'" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item> -->
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Carriage Term
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="contractType">
                  <el-select filterable v-model="form.contractType">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIAGE_CONTRACT)" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span v-if="showRequierdContractNumber" style="color:red;">*</span>Contract Number
                </template>
                <el-form-item :required="showRequierdContractNumber" :rules="showRequierdContractNumber ? [{ required: true, message: '' }] : []" prop="contractNumber">
                  <el-input v-model="form.contractNumber" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="showContractType" :label="form.carrier=='MAEU'?'Contract Type':''">
                <el-form-item v-if="form.carrier=='MAEU'" :rules="[ { required: true, message: '  '}  ]" :required="form.carrier=='MAEU'" prop="specialAllocation">
                  <el-select placeholder="Type" v-model="form.specialAllocation">
                    <el-option label="Standard" value="Standard"></el-option>
                    <el-option label="Floating" value="Floating"></el-option>
                    <el-option label="Alwaysspace" value="Alwaysspace"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Place of Receipt
                </template>
                <el-form-item required prop="pol">
                  <el-select @change="changePol" filterable v-model="form.pol">
                    <el-option
                      v-for="(item, index) in craFlag
                    ? portOptions.filter((item) => {
                        return cra_pol.indexOf(item.code) > -1;
                      })
                    : portOptions"
                      :key="index + 'pol1'"
                      :label="item.name+' ('+item.code+')'"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Port of Loading
                </template>
                <el-form-item required prop="originPort">
                  <el-select @change="changePort" v-model="form.originPort" filterable>
                    <el-option
                      v-for="(item, index) in craFlag
                                  ? portOptions.filter((item) => {
                                      return cra_origin.indexOf(item.code) > -1;
                                    })
                                  : portOptions"
                      :key="index + 'pol3'"
                      :label="item.name+' ('+item.code+')'"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Port of discharge
                </template>
                <el-form-item required prop="destinationPort">
                  <el-select v-model="form.destinationPort" filterable @change="handleDestinationPortChange">
                    <el-option
                      v-for="(item, index) in craFlag
          ? portOptions.filter((item) => {
              return cra_disch.indexOf(item.code) > -1;
            })
          : portOptions"
                      :key="index + 'pol4'"
                      :label="item.name+' ('+item.code+')'"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Final Destination
                </template>
                <el-form-item required prop="pod">
                  <el-select @change="changePod" filterable v-model="form.pod">
                    <el-option v-for="(item, index) in filteredPorts(cra_pod)" :key="index + 'pol2'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item v-if="!this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">Allocation Week</template>
                <el-form-item prop="allocationWeek">
                  <el-select clearable v-model="form.allocationWeek" filterable>
                    <el-option v-for="(item,index_a) in allocationWeekList" :key="index_a" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">Place of Delivery(BL)</template>
                <el-input v-model="form.placeOfDelivery" />
              </el-descriptions-item>
              <el-descriptions-item v-if="$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">
                  <span style="color:red;">*</span>Allocation Year
                </template>
                <el-form-item required prop="allocationYear" :rules="[
        { required: true, message: 'Please select allocation year', trigger: 'change' }
      ]">
                  <el-select v-model="form.allocationYear" placeholder="Select Year" @change="onYearChange" clearable>
                    <el-option v-for="year in availableYears" :key="year" :label="year" :value="year" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item v-if="$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">
                  <span style="color:red;">*</span>Allocation Week
                </template>
                <el-form-item required prop="allocationWeek" :rules="[
{ required: true, message: 'Please select allocation week', trigger: 'change' }
]">
                  <el-select v-model="form.allocationWeek" placeholder="Select Week" clearable>
                    <el-option v-for="week in availableWeeks" :key="week" :label="week" :value="week" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>BL Types
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="blType">
                  <el-select title="BLTYPE" @change="changeBl" size="mini" v-model="form.blType" :placeholder="$t('booking.bl_type')" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>BL Copies
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="blCopies">
                  <el-input v-model="form.blCopies" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Payment Method
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="paymentMethod">
                  <el-select size="mini" v-model="form.paymentMethod" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_METHOD)" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">Payment Location</template>
                <el-form-item prop="paymentLocation">
                  <el-input @focus="chosePaymentLocation" readonly v-model="form.paymentLocation" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">SCAC CODE</template>
                <el-form-item prop="scacCode">
                  <el-input v-model="form.scacCode" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  Carrier Freight Type
                </template>
                <el-form-item prop="freightType">
                  <el-select filterable v-model="form.freightType">
                    <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="$auth.hasPermi('shipment:create-notpb')">
                <template slot="label">
                  <span style="color:red;">*</span>Customer
                </template>

                <el-form-item :required="$auth.hasPermi('shipment:create-notpb')" :rules="[ { required: true, message: '  '}  ]" prop="customer">
                  <el-select style="width:100%!important" filterable clearable v-model="form.customer">
                    <el-option v-for="item in parties['Customer']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">PO Numbers</template>

                <el-form-item prop="poNumbers">
                  <el-input :type="$auth.hasPermi('shipment:create-notpb')?'textarea':''" v-model="form.poNumbers" rows="3" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="showCNNGBSI">
                <template slot="label">AMS</template>
                <el-form-item prop="ams">
                  <el-select size="mini" v-model="form.ams" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.SINOTRANS_AMS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="showCNNGBSI">
                <template slot="label">ACI</template>
                <el-form-item prop="aci">
                  <el-select size="mini" v-model="form.aci" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.SINOTRANS_AMS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item v-if="showCNNGBSI"></el-descriptions-item>
              <el-descriptions-item v-if="showCNNGBSI"></el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">Remark</template>

                <el-form-item prop="remark">
                  <el-input v-model="form.remark" type="textarea" rows="3" />
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>

            <el-card style="border-radius:0px;padding-top:10px;margin-top:15px;margin-bottom:15px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px">Shipping Schedule</div>

              <el-row :gutter="20" v-hasPermi="['shipment:schedule-search']">
                <el-col :span="10">
                  <el-date-picker placeholder="ETD From" v-model="searchSchedule.from" />
                </el-col>
                <el-col :span="10">
                  <el-date-picker placeholder="ETD To" v-model="searchSchedule.to" />
                </el-col>
                <el-col :span="4">
                  <el-button @click="queryShippingSchedule" type="primary">
                    Search
                    <i class="el-icon-search el-icon--right"></i>
                  </el-button>
                </el-col>
              </el-row>

              <el-timeline>
                <el-timeline-item
                  :timestamp="
          (item.etd!=null||item.eta!=null)? (
            (parseTime(item.etd) ? parseTime(item.etd) : '-') +
            ' - ' +
            (parseTime(item.eta) ? parseTime(item.eta) : '-')
            ):''
      "
                  placement="top"
                  v-for="(item, i) in form.shipmentRouters"
                  :key="i + 'router'"
                  class="shipmentRouters-css"
                >
                  <el-card shadow="never">
                    <h4 v-if="i == 0">
                      <i class="el-icon-ship"></i>
                      {{ $t("booking.form") }}:
                      {{ getLabel(item.pol, "pol") }}
                    </h4>
                    <div v-if="i != form.shipmentRouters.length - 1 && i > 0">
                      <h4>
                        <i class="el-icon-ship"></i>
                        {{ $t("booking.formTo") }}:
                      </h4>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <font color="#FF0000">*</font>
                          {{ $t("booking.pol") }}
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.pol'">
                            <el-select filterable v-model="item.pol">
                              <el-option v-for="(item, index) in portOptions" :key="index + 'pol4'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="i != form.shipmentRouters.length - 1">
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <font color="#FF0000">*</font>Transport Mode
                        </el-col>
                        <el-col :span="8">
                          <font color="#FF0000">*</font>
                          {{ $t("booking.etd") }}
                        </el-col>
                        <el-col :span="8">
                          <font color="#FF0000">*</font>
                          {{ $t("booking.eta") }}
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="margin-bottom: 5px">
                        <el-col :span="8">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.transportMode'">
                            <el-select v-model="item.transportMode" clearable filterable>
                              <el-option v-for="dict in transportMode" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.etd'">
                            <el-date-picker value-format="timestamp" v-model="item.etd" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.eta'">
                            <el-date-picker value-format="timestamp" v-model="item.eta" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <font color="#FF0000">*</font>
                          {{ $t("booking.transportMeanName") }}
                        </el-col>
                        <el-col :span="8">
                          <font color="#FF0000">*</font>
                          {{ $t("booking.voyage") }}
                        </el-col>
                        <el-col :span="8">
                          <font color="#FF0000">*</font>Service
                        </el-col>
                      </el-row>

                      <el-row :gutter="20" style="margin-bottom: 5px">
                        <!-- <el-col :span="12"><el-input v-model="item.identification" /></el-col> -->
                        <el-col :span="8">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.transportMeanName'">
                            <el-select
                              allow-create
                              v-model="item.transportMeanName"
                              placeholder
                              filterable
                              remote
                              reserve-keyword
                              clearable
                              :remote-method="remoteMethod2"
                              @change="changeVesselName(item)"
                              @clear="item.transportMeanName = null"
                            >
                              <el-option v-for="dict in vesselListLes" :key="dict.id" :label="dict.vesselName" :value="dict.vesselName" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.voyage'">
                            <el-input v-model="item.voyage" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.service'">
                            <el-input v-model="item.service" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <h4 v-if="i == form.shipmentRouters.length - 1">
                      <i class="el-icon-ship"></i>
                      {{ $t("booking.to") }}:
                      {{ getLabel(item.pol, "pod") }}
                    </h4>
                    <el-row v-if="i != form.shipmentRouters.length - 1" style="margin-top: 10px; text-align: center">
                      <el-col :span="24">
                        <el-button type="primary" @click="form.shipmentRouters.splice(i + 1, 0, {})" icon="el-icon-plus" circle></el-button>

                        <el-button v-if="i != form.shipmentRouters.length - 1 && i != 0" type="danger" @click="form.shipmentRouters.splice(i, 1)" icon="el-icon-delete" circle></el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>
            <!-- //air -->
             <template v-if="form.airRouters.length"> 
                <el-card  style="border-radius:0px;padding-top:10px;margin-top:15px;margin-bottom:15px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px">Air Schedule</div>
              <el-row :gutter="20" v-hasPermi="['shipment:schedule-search']">
                <el-col :span="10">
                  <el-date-picker placeholder="ETD From" v-model="searchAirSchedule.from" />
                </el-col>
                <el-col :span="10">
                  <el-date-picker placeholder="ETD To" v-model="searchAirSchedule.to" />
                </el-col>
                <el-col :span="4">
                  <el-button @click="queryAirSchedule" type="primary">
                    Search
                    <i class="el-icon-search el-icon--right"></i>
                  </el-button>
                </el-col>
              </el-row>
 <el-timeline>
                <el-timeline-item
                  placement="top"
                  v-for="(item, i) in form.airRouters"
                  :key="i + 'router'"
                  class="airRouters-css"
                >
                  <el-card shadow="never">
                    <div>
                      <el-row :gutter="20">
                        <el-col :span="6">
                          <font color="#FF0000">*</font>
                            carrier
                        </el-col>
                        <el-col :span="6">
                          <font color="#FF0000">*</font>
                          Flight
                        </el-col>
                          <el-col :span="6">
                          <font color="#FF0000">*</font>
                          POL
                        </el-col>
                        <el-col :span="6">
                          <font color="#FF0000">*</font>
                          POD
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="margin-bottom: 5px">
                         <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.carrier'">
                             <el-select v-model="item.carrier" clearable filterable>
                              <el-option v-for="dict in airCarrier" :key="dict.id" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.flight'">
                            <el-input v-model="item.flight" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.pol'">
                             <el-select v-model="item.pol" clearable filterable>
                              <el-option v-for="dict in airPolOptions" :key="dict.id" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.pod'">
                            <el-select v-model="item.pod" clearable filterable>
                              <el-option v-for="dict in airPodOptions" :key="dict.id" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="6">
                          <font color="#FF0000">*</font>
                          ETD
                        </el-col>
                         <el-col :span="6">
                          <font color="#FF0000">*</font>ETD Time
                        </el-col>
                        <el-col :span="6">
                          <font color="#FF0000">*</font>ETA
                        </el-col>
                        <el-col :span="6">
                          <font color="#FF0000">*</font>ETA Time
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="margin-bottom: 5px">
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.etd'">
                            <el-date-picker value-format="timestamp" v-model="item.etd" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.etdT'">
                            <el-time-picker value-format="timestamp" format="HH:mm" v-model="item.etdT" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.eta'">
                            <el-date-picker value-format="timestamp" v-model="item.eta" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'airRouters.' + i + '.etaT'">
                            <el-time-picker value-format="timestamp" format="HH:mm" v-model="item.etaT" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <el-row  style="margin-top: 10px; text-align: center">
                      <el-col :span="24">
                        <el-button type="primary" @click='form.airRouters.splice(i + 1, 0, {"transportMode": "air"})' icon="el-icon-plus" circle></el-button>

                        <el-button v-if=" i != 0" type="danger" @click="form.airRouters.splice(i, 1)" icon="el-icon-delete" circle></el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
              
            </el-card>
              </template>
           
          </el-col>

          <el-col v-show="activeName=='second'" :span="15">
            <el-dialog width="80%" title="Add/Remove PO" :visible.sync="addRemovePOVisible">
              <div style="margin-bottom:10px">
                <el-input style="width:200px;margin-right:20px" v-model="pbPage.orderNumber" />
                <el-button @click="getAllBookings" type="primary">
                  Search
                  <i class="el-icon-search el-icon--right"></i>
                </el-button>
              </div>
              <el-row :gutter="30">
                <el-col :span="24">
                  <el-table :data="pbTable" style="width: 100%">
                    <el-table-column prop="id" label width="50">
                      <template v-slot="scope">
                        <i class="el-icon-plus" style="cursor: pointer;" @click="itemTableData.push(scope.row)">Add</i>
                      </template>
                    </el-table-column>
                    <el-table-column prop="bookingNumber" label="PB MOOV Ref" width="180"></el-table-column>
                    <el-table-column prop="shipmentName" label="Shipment Name" width="180"></el-table-column>
                    <el-table-column prop="name" label="PO Items">
                      <template v-slot="scope">
                        <p v-for="item in scope.row.orderItemList" :key="item.id">
                          <el-row :gutter="20">
                            <el-col :span="4">{{ item.orderNumber }}</el-col>
                            <el-col :span="4" :title="item.productName" style="  white-space: nowrap;
                        overflow: hidden;
                      text-overflow: ellipsis;">{{ item.productName }}</el-col>
                            <el-col :span="4">Quantity：{{ item.bookQty }}</el-col>
                            <el-col :span="4">Volume：{{ item.totalVolume }}</el-col>
                            <el-col :span="4">Weight：{{ item.totalWeight }}</el-col>
                          </el-row>
                        </p>
                      </template>
                    </el-table-column>
                  </el-table>
                  <pagination v-show="pbPage.total > 0" :total="pbPage.total" :page.sync="pbPage.pageNo" :limit.sync="pbPage.pageSize" :page-sizes="[10, 20, 50]" @pagination="getAllBookings" />
                </el-col>
              </el-row>
            </el-dialog>

            <el-dialog width="80%" title="Add/Remove SO" :visible.sync="addRemoveSOVisible">
              <div style="margin-bottom:10px">
                <el-input style="width:200px;margin-right:20px" v-model="soQueryParams.salesOrderNumber" />
                <el-button @click="soQueryParams.pageNo=1;getSO()" type="primary">
                  Search
                  <i class="el-icon-search el-icon--right"></i>
                </el-button>
              </div>
              <el-row :gutter="30">
                <el-col :span="24">
                  <!-- soQueryParams:{
        pageNo: 1,
        pageSize: 10,
                  },-->
                  <MainTable @addSO="addSO" :showPlusIcon="true" :tableData="soTableData" ref="table" :tableHeight="600"></MainTable>
                  <pagination :total="soQueryParams.total" :page.sync="soQueryParams.pageNo" :limit.sync="soQueryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getSO" />
                </el-col>
              </el-row>
            </el-dialog>

            <el-card v-if="!$auth.hasPermi('shipment:create-notpb')" style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Orders</div>
              <div style="margin-bottom: 10px">
                <el-button v-if="!form.fromSalesOrder" @click="addRemovePOVisible=true;getAllBookings()">
                  Add
                  PO
                </el-button>
                <el-button v-if="form.fromSalesOrder" @click="addRemoveSOVisible=true;getSO()">Add SO</el-button>
              </div>
              <el-table border v-if="form.fromSalesOrder" :data="soDatas" style="width: 100%">
                <el-table-column prop="id" label width="60">
                  <template v-slot="scope">
                    <span style="color:red">
                      <i class="el-icon-delete" style="cursor: pointer;" @click="soDatas.splice(scope.$index, 1);">&nbsp;Delete</i>
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="salesOrderNumber" label="Sales order number"></el-table-column>
                <el-table-column prop="soldToName" label="Sold to Name"></el-table-column>
                <el-table-column prop="soldToNumber" label="Sold to Number"></el-table-column>
                <el-table-column prop="destinationDeliveryDate" label="Destination Delivery Date" width="180">
                  <template v-slot="scope">
                    {{
                    scope.row.destinationDeliveryDate[0]+'-'+scope.row.destinationDeliveryDate[1]+'-'+scope.row.destinationDeliveryDate[2]
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="shipToNumber" label="Ship to Number"></el-table-column>
                <el-table-column prop="shipToName" label="Ship to Name"></el-table-column>
                <el-table-column prop="customerPoNumber" label="Customer PO Number"></el-table-column>
              </el-table>

              <el-table v-if="!form.fromSalesOrder" style="margin-bottom:10px" :data="itemTableData">
                <el-table-column prop="id" label width="70">
                  <template v-slot="scope">
                    <span style="color:red">
                      <i class="el-icon-delete" style="cursor: pointer;" @click="itemTableData.splice(scope.$index, 1);">&nbsp;Delete</i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="bookingNumber" label="PB MOOV Ref" width="160"></el-table-column>
                <el-table-column prop="name" label="PO Items">
                  <template v-slot="scope">
                    <p v-for="item in scope.row.orderItemList" :key="item.id">
                      <el-row :gutter="20">
                        <el-col :span="4">{{ item.orderNumber }}</el-col>
                        <el-col :span="4" :title="item.productName" style="  white-space: nowrap;
                        overflow: hidden;
                      text-overflow: ellipsis;">{{ item.productName }}</el-col>
                        <el-col :span="4">Quantity：{{ item.bookQty }}</el-col>
                        <el-col :span="4">Volume：{{ item.totalVolume }}</el-col>
                        <el-col :span="4">Weight：{{ item.totalWeight }}</el-col>
                      </el-row>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>

            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Products</div>

              <el-row>
                <el-button @click="addProduct" size="mini" type="text">
                  <i class="el-icon-plus"></i>
                  {{
                  $t("booking.addProduct")
                  }}
                </el-button>
              </el-row>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form.productData" :key="'product' + i" class="margin-top" title :column="3">
                <template slot="extra">
                  <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">
                    {{
                    $t("search.delete") }}
                  </el-button>
                </template>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Mark&Numbers
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.markNumbers'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.markNumbers" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>
                    {{ $t('booking.productEnglishName') }}
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.productEnglishName'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Product Chinese Name">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productChineseName" />
                </el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item :label="$t('booking.hsCode')">
                  <el-input v-model="item.hscode" />
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Number Of Packages
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.numberOfPackages'">
                    <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Packages
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.packages'">
                    <el-select filterable v-model="item.packages">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Gross Weight(KG)
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.grossWeight'">
                    <el-input-number v-model="item.grossWeight" :controls="false" :precision="3" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Volume(CBM)
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]" :prop="'productData.' + i + '.volume'">
                    <el-input-number v-model="item.volume" :controls="false" :precision="3" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item label="DG">
                  <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" inactive-text="No"></el-switch>
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="Batteries">
                  <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                    <el-radio :label="2" border>Has batteries</el-radio>
                    <el-radio :label="3" border>No batteries</el-radio>
                  </el-radio-group>
                </el-descriptions-item>

                <el-descriptions-item :label="dict.label" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="item.dg == 1">
                  <el-input v-model="item.hazardousMaterials[dict.value]" />
                </el-descriptions-item>

                <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>

                <el-descriptions-item label>
                  <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
                    <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
                    <el-col :span="8">Remark</el-col>
                    <el-col :span="6">Files</el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-input type="textarea" v-model="item.mark" />
                    </el-col>
                    <el-col :span="6">
                      <el-upload
                        class="upload-demo"
                        :ref="'upload' + i"
                        multiple
                        :action="url + '/admin-api/shipment/product/upload'"
                        :data="item.uploadData"
                        :before-remove="handleRemove"
                        :headers="uploadHeaders"
                        :show-file-list="true"
                        :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.files = files}, () => {item.files = [];item.uploadData = {}})"
                        :on-preview="handlePictureCardPreview"
                        v-bind:file-list="item.files"
                        :auto-upload="false"
                      >
                        <el-button slot="trigger" type="primary">
                          {{
                          $t("booking.browse")
                          }}
                        </el-button>
                        <div slot="tip" class="el-upload__tip"></div>
                      </el-upload>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
            <el-card style="border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
                Containers
                <el-button @click="addContainers" size="mini" type="text">
                  <i class="el-icon-plus"></i>
                  {{
                  $t("booking.addContainers") }}
                </el-button>
              </div>
              <el-row :gutter="20" style="margin-bottom: 10px">
                <el-col :span="4">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.containerType") }}
                </el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.numberOfContainers") }}
                </el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>SOC
                </el-col>
              </el-row>

              <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i" class="shipmentRouters-css">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containers.' + i + '.containerType'">
                      <el-select filterable v-model="item.containerType" @change="handleOptionChange(item.containerType)">
                        <el-option
                          v-for="item in craFlag
                    ? containerOptions.filter((item) => {
                        return cra_contaier_type.indexOf(item.type) > -1;
                      })
                    : containerOptions"
                          :label="item.type"
                          :value="item.type"
                          :key="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containers.' + i + '.numbers'">
                      <el-input-number @change="containerChange" :controls="false" :precision="0" v-model="item.numbers" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="4">
                    <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
                  </el-col>
                  <el-col :span="4">
                    <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDeleteContainer(i)">{{ $t("search.delete") }}</el-button>
                  </el-col>
                </el-row>
              </div>

              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
                Planned
                Container Loading Data
                <el-button @click="GenPreContainers" size="mini" type="text">
                  <i class="el-icon-plus"></i>Add Details
                </el-button>
              </div>

              <el-table border style="margin-top: 15px;margin-bottom: 10px;" :data="form.preContainers">
                <el-table-column width="100" prop="containerType" label="Container Type">
                  <template v-slot="scope">{{ scope.row.containerType }}</template>
                </el-table-column>
                <el-table-column width="130" prop="numbersOfPackage" label="Number of packages">
                  <template v-slot="scope">
                    <el-input v-model="scope.row.numbersOfPackage" />
                  </template>
                </el-table-column>

                <el-table-column prop="grossWeight" label="Gross Weight">
                  <template v-slot="scope">
                    <el-input v-model="scope.row.grossWeight" />
                  </template>
                </el-table-column>
                <el-table-column prop="volume" width="80" label="Volume">
                  <template v-slot="scope">
                    <el-input v-model="scope.row.volume" />
                  </template>
                </el-table-column>
                <el-table-column prop="packageType" label="Package Type">
                  <template v-slot="scope">
                    <el-select filterable v-model="scope.row.packageType" placeholder>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="packageMethod" label="FCL/LCL">
                  <template v-slot="scope">
                    <el-select placeholder v-model="scope.row.packageMethod">
                      <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column width="60" prop="soc" label="SOC">
                  <template v-slot="scope">{{scope.row.soc?'Yes':'No'}}</template>
                </el-table-column>
                <el-table-column prop="remark" label="Remark">
                  <template v-slot="scope">
                    <el-input v-model="scope.row.remark" />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>

          <el-col :span="9">
            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top" title="Contact Info" direction="vertical" :column="2" size="mini">
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>
                  {{ $t('booking.name') }}
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">Mobile Phone</template>
                <el-form-item prop="phone">
                  <el-input v-model="form.phone" @blur="validatePhoneNumber" />
                </el-form-item>
              </el-descriptions-item>

              <!-- <el-descriptions-item>
                <template slot="label">

                  <span style="color:red;">*</span>{{ $t('booking.email') }}
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="email" type="email">
                  <el-input v-model="form.email" @blur="validateEmailAddress" />
                </el-form-item>
              </el-descriptions-item>-->

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Fax
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="fax" type="fax">
                  <el-input v-model="form.fax" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Business Phone
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="fixedPhone" type="fixedPhone">
                  <el-input v-model="form.fixedPhone" />
                </el-form-item>
              </el-descriptions-item>

              <!-- <el-descriptions-item></el-descriptions-item> -->
              <el-descriptions-item label="Full Name" span="2">
                <template slot="label">
                  <span style="color:red;">*</span>
                  {{ $t('booking.email') }} (Booking)
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="email" type="email">
                  <el-input v-model="form.email" @blur="validateEmailAddress" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Full Name" span="2">
                <template slot="label">{{ $t('booking.email') }} (Si)</template>
                <el-form-item prop="siEmail" type="email">
                  <el-input v-model="form.siEmail" @blur="validateEmailAddress" />
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc" title="Shipper" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">
                  <span style="color:red;">*</span>Name
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="shipper" style="border:none;border-bottom:1px solid #ddd;width:100%">
                  <el-select filterable clearable remote :remote-method="remoteMethodParty1" v-model="form.shipper">
                    <el-option v-for="item in parties['Shipper']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <div></div>
              </el-descriptions-item>

              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getShipper().address}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getShipper().phone}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getShipper().fax}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getShipper().email}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getShipper().companyUsci}}</div>
              </el-descriptions-item>
            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc" title="Consignee" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">
                  <span style="color:red;">*</span>Name
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="consignee" style="border:none;border-bottom:1px solid #ddd;width:100%">
                  <el-select remote clearable :remote-method="remoteMethodParty2" v-model="form.consignee" filterable>
                    <el-option v-for="item in parties['Consignee']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getConsignee().address}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getConsignee().phone}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getConsignee().fax}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getConsignee().email}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getConsignee().companyUsci}}</div>
              </el-descriptions-item>
            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc" title="Notify Party" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">
                  <span style="color:red;">*</span> Name
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="notifyParty" style="border:none;border-bottom:1px solid #ddd;width:100%">
                  <el-select remote clearable :remote-method="remoteMethodParty3" v-model="form.notifyParty" filterable>
                    <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getNotifyParty().address}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getNotifyParty().phone}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getNotifyParty().fax}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getNotifyParty().email}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getNotifyParty().companyUsci}}</div>
              </el-descriptions-item>
            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc" title="Second Notify" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">Name</template>
                <el-form-item style="border:none;border-bottom:1px solid #ddd;width:100%" prop="agreementParty">
                  <el-select remote clearable :remote-method="remoteMethodParty3" v-model="form.agreementParty" filterable>
                    <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{getAgreementParty().address}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{getAgreementParty().phone}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{getAgreementParty().fax}}</div>
              </el-descriptions-item>
              <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getAgreementParty().email}}</div>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">{{getAgreementParty().companyUsci}}</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <div v-if="noteView && form.status==0">
          <el-descriptions style="padding: 15px!important;background: #fff;margin-bottom: 15px;">
            <el-descriptions-item label="Update Category">
              <el-select clearable v-model="shipmentNote.cancelCode" size="mini" placeholder @change="getCancelReason($event)" @clear="clearSelCancelCategory">
                <el-option v-for="item in selCancelCategory" :key="item.enumId" :label="item.description" :value="item.enumId"></el-option>
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="Update Reason">
              <el-select clearable v-model="shipmentNote.cancelSubCode" size="mini" placeholder @change="changeSelCancelReason($event)" no-data-text="Please select Cancel Category first">
                <el-option v-for="item in selectCancelReason" :key="item.enumId" :label="item.description" :value="item.enumId"></el-option>
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="Update Remark">
              <el-input type="textarea" placeholder @blur="shipmentNote.cancelRemark = $event.target.value.trim()" v-model="shipmentNote.cancelRemark" size="mini" :rows="3" maxlength="1000" show-word-limit resize="none"></el-input>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-date-picker placeholder="ETD From" v-model="searchSchedule.from" />
            </el-col>
            <el-col :span="6">
              <el-date-picker placeholder="ETD To" v-model="searchSchedule.to" />
            </el-col>
            <el-col :span="6">
              <el-input placeholder="Service" v-model="searchSchedule.service"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="queryShippingSchedule" type="primary">Search<i
                  class="el-icon-search el-icon--right"></i></el-button>
            </el-col>
          </el-row>
          <el-table v-loading="shippingScheduleLoading" height="600px" :data="shippingScheduleData">
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
                        <div class="vessel-title">
                          {{
                          scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}
                        </div>
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
                        <div class="vessel-title">
                          {{
                          scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}
                        </div>
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
                  <img v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" src="../../../assets/HLCU.png" />
                  <img v-if="scope.row.carrier == 'MAEU'" class="uni-carrier-logo-image" src="../../../assets/MAEU.png" />
                  <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../assets/ZIMU.png" />
                  <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../assets/tailwind.png" />
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
                  <img v-if="scope.row.carrier == 'SMLU'" class="uni-carrier-logo-image" src="../../../assets/logo/SMLU.png" />
                </div>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" label="Service" prop="service" width="180px"></el-table-column>

            <el-table-column label="Main Carriage" prop="mainCarriage" min-width="300px">
              <template v-slot="scope">
                <div style="width: 800px;">
                  <div style="float: left; margin-right: 10px;margin-top: 20px">
                    <div style="text-align: center; color:#c3c5c7; ">
                      {{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ")
                      }}
                    </div>
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
                    <div style="text-align: center;  color:#c3c5c7; ">
                      {{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ")
                      }}
                    </div>
                    <div style="text-align: center;">{{ parseTime(scope.row.arrivalDate) }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="TT" prop="transitTime" min-width="100px">
              <template v-slot="scope">{{ scope.row.transitTime+" days" }}</template>
            </el-table-column>

            <!-- <el-table-column :label="$t('booking.carrier')" prop="carrier" width="180px" :align="'center'">
</el-table-column>
<el-table-column label="Service" prop="service" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.voyage')" prop="voyage" min-width="100px">
  <template slot-scope="scope">
    {{ scope.row.voyage }}
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselCode')"
  prop="vesselCode"
  min-width="100px"
>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselName')"
  prop="vesselName"
  min-width="100px"
>
</el-table-column>
<el-table-column :label="$t('booking.pol')" prop="port" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.pod')" prop="pod" min-width="100px">
</el-table-column>
<el-table-column
  :label="$t('booking.etd')"
  prop="departureDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.departureDate) }}</span>
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.eta')"
  prop="arrivalDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.arrivalDate) }}</span>
  </template>
            </el-table-column>-->

            <el-table-column prop="choseSchedule" width="100px">
              <template v-slot="scope">
                <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog :visible.sync="airScheduleVisable" title="Air Schedule" width="80%">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-date-picker placeholder="ETD From" v-model="searchSchedule.from" />
            </el-col>
            <el-col :span="6">
              <el-date-picker placeholder="ETD To" v-model="searchSchedule.to" />
            </el-col>
            <el-col :span="6">
              <el-input placeholder="Service" v-model="searchSchedule.service"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="queryShippingSchedule" type="primary">Search<i
                  class="el-icon-search el-icon--right"></i></el-button>
            </el-col>
          </el-row>
          <el-table v-loading="shippingScheduleLoading" height="600px" :data="airScheduleData">
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
                        <div class="vessel-title">
                          {{
                          scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}
                        </div>
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
                        <div class="vessel-title">
                          {{
                          scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}
                        </div>
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
                  <img v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" src="../../../assets/HLCU.png" />
                  <img v-if="scope.row.carrier == 'MAEU'" class="uni-carrier-logo-image" src="../../../assets/MAEU.png" />
                  <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../assets/ZIMU.png" />
                  <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../assets/tailwind.png" />
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
                  <img v-if="scope.row.carrier == 'SMLU'" class="uni-carrier-logo-image" src="../../../assets/logo/SMLU.png" />
                </div>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" label="Service" prop="service" width="180px"></el-table-column>

            <el-table-column label="Main Carriage" prop="mainCarriage" min-width="300px">
              <template v-slot="scope">
                <div style="width: 800px;">
                  <div style="float: left; margin-right: 10px;margin-top: 20px">
                    <div style="text-align: center; color:#c3c5c7; ">
                      {{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ")
                      }}
                    </div>
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
                    <div style="text-align: center;  color:#c3c5c7; ">
                      {{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ")
                      }}
                    </div>
                    <div style="text-align: center;">{{ parseTime(scope.row.arrivalDate) }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="TT" prop="transitTime" min-width="100px">
              <template v-slot="scope">{{ scope.row.transitTime+" days" }}</template>
            </el-table-column>

            <!-- <el-table-column :label="$t('booking.carrier')" prop="carrier" width="180px" :align="'center'">
</el-table-column>
<el-table-column label="Service" prop="service" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.voyage')" prop="voyage" min-width="100px">
  <template slot-scope="scope">
    {{ scope.row.voyage }}
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselCode')"
  prop="vesselCode"
  min-width="100px"
>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselName')"
  prop="vesselName"
  min-width="100px"
>
</el-table-column>
<el-table-column :label="$t('booking.pol')" prop="port" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.pod')" prop="pod" min-width="100px">
</el-table-column>
<el-table-column
  :label="$t('booking.etd')"
  prop="departureDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.departureDate) }}</span>
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.eta')"
  prop="arrivalDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.arrivalDate) }}</span>
  </template>
            </el-table-column>-->

            <el-table-column prop="choseSchedule" width="100px">
              <template v-slot="scope">
                <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <el-row style="text-align: center">
          <!--        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.reserved">Reserve space</el-checkbox></span>-->
          <!-- <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.sinotrans"
          v-hasPermi="['sinotrans-booking']">E-Sinotrans EDI</el-checkbox></span>-->

          <span style="margin-right: 10px;display:inline-block">
            <el-checkbox @change="changeSinotrans" v-model="form.sinotrans" v-hasPermi="['sinotrans-booking']">Book through smartMOOV</el-checkbox>
          </span>
          <span style="margin-right: 10px;display:inline-block">
            <el-form-item v-hasPermi="['sinotrans-booking']" v-if="form.sinotrans&&form.originPort == 'CNSHA'" prop="ediSource" label-width="0px">
              <el-select v-model="form.ediSource" filterable clearable placeholder="Select Agent">
                <el-option key="CNSHA_DFGJ" label="Dongfang International" value="CNSHA_DFGJ" />
                <el-option key="CNSHA_ZWY" label="Sinotrans" value="CNSHA_ZWY" />
              </el-select>
            </el-form-item>
          </span>

          <el-button size="mini" @click="submit(2)" type="primary" :loading="loadingSaveBut">Save</el-button>
          <el-button size="mini" @click="submit(0)" type="primary" :loading="loadingSaveBut">
            {{
            $t("booking.submit")
            }}
          </el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style>
.shipmentRouters-css .el-form-item__content {
  margin: 0 !important;
}

.shipmentRouters-css label.el-form-item__label {
  display: none;
}
.airRouters-css .el-form-item__content {
  margin: 0 !important;
}

.airRouters-css label.el-form-item__label {
  display: none;
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
import { listDept } from '@/api/system/dept'
import { create, si, vgm, findDropDownListFromCt, shipmentDetails, updateShipment } from '@/api/shipment/shipment'
import MainTable from '@/views/salesOrder/components/table.vue'
import { getPage, getListByShipmentId } from '@/api/booking/booking'
import { getContainerList } from '@/api/system/container'
import { createDeptApply } from '@/api/system/deptApply'
import { getVesselList } from '@/api/system/vessel'
import { getFileList, deleteFile } from '@/api/infra/file'
import { getCraNumList, findShippingScheduleList } from '@/api/shipment/shipment'
import { getHsCodeListByCode } from '@/api/system/hsCode'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getBaseHeader } from '@/utils/request'
import { getSOHeaderPage } from '@/api/order/sOHeader'
import { createNote } from '@/api/shipment/note'
import { getAllocationWeekData } from '@/api/booking/contract'
import { getContractListTenantIgnore } from '@/api/booking/contract'
import { getPortPage } from '@/api/system/port'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { seaAirBookingRouterByBookingId } from "@/api/seaair/seaair"
import { getAirportList } from '@/api/air/airport'
import { getAirlineList as getAirCarrierList } from '@/api/air/airline'
import {getJoinDate} from '@/utils'
export default {
  name: 'Shipment',
  mixins: [fileLoadMixin],
  components: { MainTable },
  data() {
    return {
      allocationWeekList: [],
      loadingSaveBut: false,
      form: {
        type: 'Merchant',
        containers: [],
        preContainers: [],
        shipmentRouters: [],
        //air
        airRouters:[],
        allocationYear: null,
        allocationWeek: null,
        realCarrier: null,
        productData: [],
        contractType: 'CY/CY',
        phone: '',
        email: '',
        freightType: null,
      },
      activeName: 'first',
      phoneError: '',
      emailError: '',
      addRemoveSOVisible: false,
      soQueryParams: {
        booked: false
      },
      portOptions: [],
      airPolOptions:[],
      airPodOptions:[],
      containerOptions: [],
      parties: {
        Shipper: [],
        Consignee: [],
        'Notify Party': [],
        'Agreement Party': []
      },
      partiesMap: {},
      tipsMail: 'Tailwind.CS@kblinersh.com',
      open: false,
      partyForm: {
        partyRole: []
      },
      vesslMap: {},
      reverseVesslMap: {},
      vesselList: [],
      vesselListLes: [],
      hsCodeList: [],
      url: '',
      uploadHeaders: {},
      flag: false,
      cra_pol: [],
      cra_pod: [],
      cra_origin: [],
      cra_disch: [],
      cra_contaier_type: [],
      craFlag: false,
      itemTableData: [],
      productMapForBook: {},
      orderMap: {},
      orderItemMap: {},
      selCancelReason: [],
      selCancelCategory: [],
      selectCancelReason: [],
      cancelReasonFlag: false,
      shippingScheduleLoading: false,
      shippingScheduleVisable: false,
      //air
      airScheduleLoading: false,
      airScheduleVisable: false,
      shippingScheduleData: [],
      //air
      airScheduleData: [],
      searchSchedule: {
        from: new Date(),
        to: new Date().setMonth(new Date().getMonth() + 2)
      },
      //air
      searchAirSchedule: {
        from: new Date(),
        to: new Date().setMonth(new Date().getMonth() + 2)
      },
      shipmentNote: {
        cancelCode: null,
        cancelSubCode: null,
        cancelRemark: null
      },
      noteView: false,
      craList: [],
      chosePaymentLocationVisable: false,
      paymentLocationList: [],
      queryParams: {
        pageNo: 1,
        total: 0,
        pageSize: 10
      },
      pbTable: [],
      addRemovePOVisible: false,
      pbPage: {
        total: 0,
        poBooking: true,
        pageNo: 1,
        pageSize: 10,
        shipmentBooking: false
      },
      showRealCarrier: false,
      realCarrierList: [],
      showRequierdContractNumber: true,
      showContractType: true,
      carrierPodCvFndList: [],
      fndOptions: [],
      soTableData: [],
      soDatas: [],
      availableYears: [],
      availableWeeks: [],
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
      transportMode: [
        {
          label: 'Barge',
          value: 'BRG'
        },
        {
          label: 'Ocean',
          value: 'SEA'
        },
        {
          label: 'Truck',
          value: 'TRK'
        },
        {
          label: 'Railway',
          value: 'RAI'
        }
      ],
      airMode: [
        {
          label: 'Air',
          value: 'air'
        },
       
      ],
      airCarrier:[],
      showCNNGBSI: false,
      spoIds: [],
      spoList: []
    }
  },
  created() {
    console.log('form First', this.form)
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.getPortList()
    this.getContainerList()
    this.getVesselList()
    this.getContractListTenantIgnore()
    this.generateAvailableYears()
    this.getCarrierList()

    //air
    this.getAirCarrierList()
    this.getAirportList()
    this.carrierPodCvFndList = this.getDictDatas(this.DICT_TYPE.CARRIER_POD_CV_FND)
    this.getParties({ partyRole: 'Shipper' })
    this.getParties({ partyRole: 'Consignee' })
    this.getParties({ partyRole: 'Notify Party' })
    this.getParties({ partyRole: 'Agreement Party' })
    this.getParties({ partyRole: 'Customer' })
    this.getBookings()
    this.getDropDownValues()
    var shipmentNoteView = this.getDictDatas(this.DICT_TYPE.SHIPMENT_NOTE_VIEW)
    if (shipmentNoteView && shipmentNoteView.length > 0) {
      for (var c = 0; c < shipmentNoteView.length; c++) {
        if (shipmentNoteView[c].value == localStorage.getItem('TENANT_ID')) {
          this.noteView = true
          break
        }
      }
    }
    var ids = this.$route.query.id

    if (ids) {
      this.getShipmentDetails(ids)
      //air
      this.getAirDetails(ids)
    } else {
      this.form.productData.push({
        batteries: 3,
        fileList: [],
        uploadData: {},
        dg: 0,
        hazardousMaterials: {}
      })
    }
    console.log('form created done', this.form)
  },

  computed: {
    isCanSearchAirSchedule() {
      return this.form.originPort != null && this.form.originPort != '' && this.form.destinationPort != null &&
        this.form.destinationPort != '' &&
        this.searchAirSchedule.from != null &&
        this.searchAirSchedule.from != '' &&
        this.searchAirSchedule.to != null &&
        this.searchAirSchedule.to != ''
    },
    // fnd 筛选方法：根据craFlag、cra数组、fndOptions筛选港口选项
    filteredPorts() {
      // 返回一个函数，接收对应的cra数组
      return craArray => {
        return this.portOptions.filter(item => {
          // 1. craFlag筛选：如果craFlag为true，必须在对应的cra数组中
          const craPass = this.craFlag ? craArray.includes(item.code) : true
          // 2. fndOptions筛选：有值时筛选（匹配code），无值时不过滤
          const fndPass = !this.fndOptions.length > 0 ? true : this.fndOptions.includes(item.code)
          // 同时满足两个条件
          return craPass && fndPass
        })
      }
    }
  },
  watch: {
    'form.allocationYear'(newVal) {
      console.log('form.allocationYear', newVal)
      if (newVal) {
        this.onYearChange(newVal)
      }
    }
  },
  methods: {
    validatePolPod(rule, value, callback) {
      const { pol, pod } = this.form
      if (pol && pod && pol === pod) {
        // 设置当前字段的错误消息
        callback(new Error(' '))
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'pol' ? 'pod' : 'pol', ' ')
      } else {
        callback()
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'pol' ? 'pod' : 'pol')
      }
    },
    validateOriginAndDestination(rule, value, callback) {
      const { originPort, destinationPort } = this.form
      if (originPort && destinationPort && originPort === destinationPort) {
        // 设置当前字段的错误消息
        callback(new Error(' '))
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort', ' ')
      } else {
        callback()
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort')
      }
    },
    filteredPortOptions(field) {
      if (!this.craFlag) {
        return this.portOptions
      }
      switch (field) {
        case 'pol':
          return this.portOptions.filter(item => this.cra_pol.includes(item.code))
        case 'pod':
          return this.portOptions.filter(item => this.cra_pod.includes(item.code))
        case 'originPort':
          return this.portOptions.filter(item => this.cra_origin.includes(item.code))
        case 'destinationPort':
          return this.portOptions.filter(item => this.cra_disch.includes(item.code))
        default:
          return this.portOptions
      }
    },
    setFieldError(prop, message) {
      const field = this.$refs.form.fields.find(field => field.prop === prop)
      if (field) {
        field.validateMessage = message
        field.validateState = 'error'
      }
    },
    getCarrierList() {
      this.carrierList = this.getDictDatas(this.DICT_TYPE.CARRIER)
      this.realCarrierList = this.getDictDatas(this.DICT_TYPE.CARRIER)
      console.log('获取到的船公司列表', this.carrierList)
    },
    clearFieldError(prop) {
      const field = this.$refs.form.fields.find(field => field.prop === prop)
      if (field) {
        field.validateMessage = ''
        field.validateState = ''
      }
    },
    getShipper() {
      var party = { address: '-', email: '-', phone: '-' }
      if (this.form.shipper && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
        var obj = this.parties['Shipper'].find(item => item.id == this.form.shipper)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getNotifyParty() {
      var party = { address: '-', email: '-', phone: '-' }
      if (this.form.notifyParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find(item => item.id == this.form.notifyParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getConsignee() {
      var party = { address: '-', email: '-', phone: '-' }
      if (this.form.consignee && this.parties['Consignee'] && this.parties['Consignee'].length > 0) {
        var obj = this.parties['Consignee'].find(item => item.id == this.form.consignee)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getAgreementParty() {
      var party = { address: '-', email: '-', phone: '-' }
      if (this.form.agreementParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find(item => item.id == this.form.agreementParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },

    addSO(row) {
      this.soDatas.push(row)
    },
    getSO() {
      getSOHeaderPage(this.soQueryParams).then(res => {
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].key = 'first' + res.data.list[i].id
        }
        this.soTableData = res.data.list
        this.soQueryParams.total = res.data.total
      })
    },
    getAllBookings() {
      getPage(this.pbPage).then(res => {
        this.pbTable = res.data.list
        this.pbPage.total = res.data.total
      })
    },

    containerChange() {
      // if(this.form.preContainers.length>0) {
      //   this.GenPreContainers()
      // }
      this.form.preContainers = []
    },

    GenPreContainers() {
      var count = 0
      this.form.preContainers = []
      for (var i = 0; i < this.form.containers.length; i++) {
        if (this.form.containers[i].numbers) {
          count += this.form.containers[i].numbers
          var containerType = this.form.containers[i].containerType
          for (var j = 0; j < this.form.containers[i].numbers; j++) {
            this.form.preContainers.push({ containerType: containerType, soc: this.form.containers[i].soc ? true : false })
          }
        }
      }
      if (count == 0) {
        this.$notify({
          title: 'warning',
          message: 'Please fill in the container quantity first',
          type: 'warning'
        })
      }
    },
    chosePaymentLocation() {
      getPortPage(this.queryParams).then(res => {
        this.paymentLocationList = res.data.list
        this.queryParams.total = res.data.total
      })
      this.chosePaymentLocationVisable = true
    },
    chosePaymentLocationHandle(row, column, cell, event) {
      this.$set(this.form, 'paymentLocation', row.portCode)
      this.chosePaymentLocationVisable = false
    },

    choseSchedule(row) {
      this.form.shipmentRouters[0]
      this.$set(this.form.shipmentRouters[0], 'pol', row.port)
      this.$set(this.form.shipmentRouters[0], 'etd', row.departureDate)
      this.$set(this.form.shipmentRouters[0], 'eta', row.arrivalDate)
      this.$set(this.form.shipmentRouters[0], 'transportMeanName', row.vesselName)
      this.$set(this.form.shipmentRouters[0], 'identification', row.vesselCode)
      this.$set(this.form.shipmentRouters[0], 'voyage', row.voyage)
      this.$set(this.form.shipmentRouters[0], 'imo', row.imo)
      this.$set(this.form.shipmentRouters[0], 'service', row.service)
      this.$set(this.form.shipmentRouters[0], 'transportMode', 'SEA')

      this.$set(this.form, 'carrier', this.carrierMap2[row.carrier])
      this.shippingScheduleVisable = false
      this.setSchdulesTSHG(row)
    },
    setSchdulesTSHG(schdule) {
      console.log(schdule)
      getVesselList().then((response) => {
        this.vesselList = response.data;
        var schdules = schdule.tshgList
        if (schdules.length > 0) {
          this.form.shipmentRouters = []
        }

        for (var i = 0; i < schdules.length; i++) {
          var sch = schdules[i]
          if (i == schdules.length - 1) {
            this.form.shipmentRouters.push({
              // pol: keys.length==1?preAssignMap[keys[0]].fnd:schdule.pod,
              pol: schdule.pod,
              transportMode: 'SEA',
              etd: null,
              eta: null,
            });
            continue
          }
          if (i != schdules.length - 1 && sch.event == 'Departure') {
            // 有船 并且是 departure ；或者barge
            var sch1 = schdules[i + 1]
            var schItem = {
              transportMode: sch.barge,
              etd: sch.eventTime,
              eta: sch1.eventTime,
              transportMeanName: sch.barge == 'Barge' ? "TBA" : sch.vessel,
              service: sch.barge == 'Barge' ? "Unknown" : sch.service,
              voyage: sch.barge == 'Barge' ? "Unknown" : sch.voyage,
              pol: i == 0 ? schdule.pol : sch.portCode,
            }
            if (sch.barge == 'Barge') {
              schItem.transportMode = 'BRG'
            }
            if (sch.barge == 'Ocean') {
              schItem.transportMode = 'SEA'
            }
            var obj = this.vesselList.find(
              (element) => element.vesselName == schItem.transportMeanName
            )

            if (obj) {
              schItem.identification = obj.vesselCode;
              schItem.imo = obj.imo;
            } else {
              schItem.identification = "Unknown"
              schItem.imo = "Unknown"
            }
            if (i == 0) {
              this.form.shipmentRouters[0] = schItem;
            } else {
              this.form.shipmentRouters.push(schItem);
            }
          }
          this.form = JSON.parse(JSON.stringify(this.form));

        }
        console.log(this.form.shipmentRouters)
      });

    },
    //air
    queryAirSchedule() {
      if (this.isCanSearchAirSchedule) {
        const data = {
          origin: this.form.originPort,
          destination: this.form.destinationPort,
          departureFrom: this.parseTime(this.searchSchedule.from),
          departureFrom2: this.parseTime(this.searchSchedule.to),
          carrier: this.carrierMap[this.form.carrier],
          service: this.searchSchedule.service
        }
        return
        // todo
        this.airScheduleLoading = true
        this.findAirScheduleList(data)
        this.airScheduleVisable = true
      } else {
        this.$notify({
          title: 'warning',
          message: ' required fields is empty',
          type: 'warning'
        })
      }
    },
    queryShippingSchedule() {
      console.log('1111')
      if (
        this.form.originPort != null &&
        this.form.originPort != '' &&
        this.form.destinationPort != null &&
        this.form.destinationPort != '' &&
        this.searchSchedule.from != null &&
        this.searchSchedule.from != '' &&
        this.searchSchedule.to != null &&
        this.searchSchedule.to != ''
      ) {
        var data = {
          origin: this.form.originPort,
          destination: this.form.destinationPort,
          departureFrom: this.parseTime(this.searchSchedule.from),
          departureFrom2: this.parseTime(this.searchSchedule.to),
          carrier: this.carrierMap[this.form.carrier],
          service: this.searchSchedule.service
        }
        console.log(data)
        this.shippingScheduleLoading = true
        console.log(123)
        this.findShippingScheduleList(data)
        this.shippingScheduleVisable = true
        console.log(data)
      } else {
        this.$notify({
          title: 'warning',
          message: ' required fields is empty',
          type: 'warning'
        })
      }
    },
    //air
    findAirScheduleList(reqData) {
      findAirScheduleList(reqData).then(response => {
        this.airScheduleData = response.data
      }).finally(()=>{
        this.airScheduleLoading = false
      })
    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then(response => {
        this.shippingScheduleData = response.data
        this.shippingScheduleLoading = false
      })
    },
    changeBl(value) {
      console.log(value)
      if (value == 'ORIGINAL') {
        this.form.blCopies = 3
      } else {
        this.form.blCopies = 1
      }
    },
    getContractListTenantIgnore() {
      var queryParams = {}
      getContractListTenantIgnore(queryParams).then(response => {
        this.craList = []
        for (var t of response.data) {
          t.contractNo = t.contractNo.trim()
          this.craList.push(t)
        }
        console.log(this.craList)
      })
    },
    getAllocationWeekList() {
      console.log(this.form.contractNumber)

      if (this.form.contractNumber && this.form.carrier) {
        getAllocationWeekData(this.form.carrier, this.form.contractNumber).then(response => {
          console.log(response)
          this.allocationWeekList = response.data
        })
      }
    },
    changeSelCancelReason(e) {
      let vm = this
      this.cancelReasonFlag = false
      for (var val of vm.selCancelReason) {
        if (e == val.enumId && val.optionIndicator == 't') {
          vm.cancelReasonFlag = true
          return
        }
      }
    },
    getDropDownValues() {
      findDropDownListFromCt().then(response => {
        if (response && response.data) {
          if (response.data.cancelReasonList) this.selCancelReason = response.data.cancelReasonList
          if (response.data.cancelCategoryList) this.selCancelCategory = response.data.cancelCategoryList
        }
      })
    },
    clearSelCancelCategory() {
      console.log(this.form)
      this.selectCancelReason = []
      this.shipmentNote.cancelCode = null
      this.shipmentNote.cancelSubCode = null
    },
    getCancelReason(prov) {
      let tempCancelReason = []
      for (var val of this.selCancelReason) {
        if (prov == val.parentEnumId) {
          tempCancelReason.push({ description: val.description, enumId: val.enumId })
        }
      }
      this.selectCancelReason = tempCancelReason

      this.shipmentNote.cancelSubCode = null
    },
    // 删除图片
    changeCarrier(value) {
      console.log('选择的船公司', value)
      // 承运人变更时触发FND过滤
      this.handleDestinationPortChange()

      if (value == 'TSHG') {
        this.setCra()
        this.craFlag = true
      } else {
        if (value === 'NVOCC DSV') {
          console.log('选择的NVOCC DSV', value)
          this.showRealCarrier = true
          this.showRequierdContractNumber = false
          this.showContractType = false
          //realCarrierList 去掉NVOCC
          const filteredData = this.realCarrierList.filter(item => item.value !== 'NVOCC DSV')
          this.$set(this, 'realCarrierList', filteredData)
          console.log('转换后的船公司列表', this.realCarrierList)
        }else if (value === 'NVOCC MOOV') {
          console.log('选择的NVOCC MOOV', value)
          this.showRequierdContractNumber = false
          this.showContractType = false
        } else {
          console.log('选择的船公司不是NVOCC DSV', value)
          this.form.realCarrier = value
          this.showRealCarrier = false
          this.showRequierdContractNumber = true
          this.showContractType = true
        }

        this.craFlag = false
      }
      this.changePort(this.form.originPort)
      this.remoteGetCraNum()
    },

    remoteMethodParty1(query) {
      if (query !== '' && query.length >= 3) {
        this.getParties({ partyRole: 'Shipper', name: query })
      } else {
        this.$set(this.parties, 'Shipper', [])
      }
    },
    remoteMethodParty2(query) {
      if (query !== '' && query.length >= 3) {
        this.getParties({ partyRole: 'Consignee', name: query })
      } else {
        this.$set(this.parties, 'Consignee', [])
      }
    },
    remoteMethodParty3(query) {
      if (query !== '' && query.length >= 3) {
        this.getParties({ partyRole: 'Notify Party', name: query })
      } else {
        this.$set(this.parties, 'Notify Party', [])
      }
    },
    remoteMethodParty4(query) {
      if (query !== '' && query.length >= 3) {
        this.getParties({ partyRole: 'Agreement Party', name: query })
      } else {
        this.$set(this.parties, 'Agreement Party', [])
      }
    },

    generateAvailableYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let y = currentYear; y <= currentYear + 3; y++) {
        years.push(y)
      }
      this.availableYears = years
    },

    generateWeeksForYear(year) {
      const weeks = this.getWeeksInYear(year)
      console.log('weeks!!!!!!!!!!!!!!!!!!', weeks)
      this.availableWeeks = weeks
    },

    getWeeksInYear(year) {
      const weeks = []
      let date = new Date(year, 0, 1) // 从1月1日开始

      // 移动到第一个周一（ISO周从周一开始）
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1)
      }

      while (date.getFullYear() === year || (date.getMonth() === 0 && date.getDate() < 7)) {
        const week = this.getWeekNumber(date)
        if (!weeks.includes(week)) {
          weeks.push(week)
        }
        date.setDate(date.getDate() + 7)
      }

      return weeks.sort((a, b) => a - b)
    },
    getWeekNumber(date) {
      // ISO Week Number
      const target = new Date(date.valueOf())
      const dayNr = (date.getDay() + 6) % 7
      target.setDate(target.getDate() - dayNr + 3)
      const firstThursday = target.valueOf()
      target.setMonth(0, 1)
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000)
    },
    handleDestinationPortChange() {
      this.filterFndByConditions()
    },
    filterFndByConditions() {
      const { carrier, destinationPort } = this.form
      if (!carrier || !destinationPort || this.spoList.length == 0) return

      //循环获取里面的dc
      let dcList = []
      for (let item of this.spoList) {
        dcList.push(item.dc)
      }
      // 在字典中查找匹配的条目（label格式为"carrier-dcCode-destinationPort"）,会有多条数据
      let matchedItems = this.carrierPodCvFndList.filter(item => {
        const [itemCarrier, itemDcCode, itemPort] = item.label.split('-')
        return itemCarrier == carrier && dcList.includes(itemDcCode) && itemPort == destinationPort
      })
      // 按逗号分割value 生成fnd code list
      let fndOptions = []
      for (let item of matchedItems) {
        fndOptions = fndOptions.concat(item.value.split(','))
      }
      if (fndOptions.length > 0) {
        // 按逗号分割value 生成fnd code list
        this.fndOptions = fndOptions
        // 检查当前选择是否在新列表中
        if (!this.fndOptions.includes(this.form.pod)) {
          this.form.pod = '' // 清空现有选择
        }
      } else {
        // 未找到匹配项，使用默认字典
        this.fndOptions = []
      }
    },
    remoteGetCraNum() {
      //query Allocation  etd week
      this.getAllocationWeekList()

      var query = this.form.contractNumber
      if (this.form.carrier != 'TSHG') {
        return
      }
      this.cra_contaier_type = []
      this.cra_pol = []
      this.cra_pod = []
      this.cra_origin = []
      this.cra_disch = []
      if (query !== '' && query.length >= 4) {
        getCraNumList(query).then(response => {
          this.craNumList = response.data
          if (this.craNumList.length > 0) {
            if (this.craNumList[0] && this.craNumList[0].ap) {
              var req = {
                partyRole: 'Agreement Party',
                customerCode: this.craNumList[0].ap
              }
              this.getParties(req, true)
            }
          }
          for (var i = 0; i < this.craNumList.length; i++) {
            if (this.cra_pol.indexOf(this.craNumList[i].origin) == -1) {
              this.cra_pol.push(this.craNumList[i].origin)
            }
            if (this.cra_pod.indexOf(this.craNumList[i].delivery) == -1) {
              this.cra_pod.push(this.craNumList[i].delivery)
            }
            if (this.cra_origin.indexOf(this.craNumList[i].loadPort) == -1) {
              this.cra_origin.push(this.craNumList[i].loadPort)
            }
            if (this.cra_disch.indexOf(this.craNumList[i].dischPort) == -1) {
              this.cra_disch.push(this.craNumList[i].dischPort)
            }
            if (this.cra_contaier_type.indexOf(this.craNumList[i].eqpType) == -1) {
              this.cra_contaier_type.push(this.craNumList[i].eqpType)
            }
          }
          this.setCra()
        })
      }
    },
    setCra() {
      console.log(1)
      if (this.cra_pol.indexOf(this.form.pol) == -1) {
        this.$set(this.form, 'pol', '')
        this.$set(this.form, 'originPort', '')
      }
      if (this.cra_pod.indexOf(this.form.pod) == -1) {
        this.$set(this.form, 'pod', '')
        this.$set(this.form, 'destinationPort', '')
      }
      if (this.cra_contaier_type.length > 0) {
        var data = this.form.containers.filter(item => {
          return this.cra_contaier_type.indexOf(item.containerType) > -1 || item.containerType == ''
        })
        if (data.length == 0) {
          data.push({ containerType: '' })
        }
        this.$set(this.form, 'containers', data)
      }
    },
    handleRemove(file, fileList) {
      if (file.id) {
        var vm = this
        this.$modal
          .confirm('Are you sure to delete the data item with the file "' + file.name + '"?')
          .then(function () {
            deleteFile(file.id).then(response => {
              const findex = fileList.map(f => f.name).indexOf(file.name)
              if (findex > -1) {
                fileList.splice(findex, 1)
              }
            })
          })
          .then(() => {
            this.$modal.msgSuccess('Successfully deleted')
          })
          .catch(() => {})
        return false
      } else {
        return true
      }
    },
    // 预览 / 下载
    handlePictureCardPreview(file) {
      const link = document.createElement('a')
      link.href = file.url
      link.setAttribute('download', file.name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getBookings() {
      this.bookings = []
    },
    getShipmentDetails(id) {
      shipmentDetails(id).then(response => {
        if (response.data) {
          this.form.contractNumber = response.data.contractNumber

          // Clear order numbers for copy
          response.data.poNumbers = ''

          this.form = Object.assign({}, this.form, response.data)

          if (response.data.allocationYear) {
            this.form.allocationYear = response.data.allocationYear
          }

          this.form.shipmentRouters = response.data.routerDOList

          // Handle containers
          for (var i = 0; i < response.data.containerDOList.length; i++) {
            var d = response.data.containerDOList[i]
            if (d && d.type == 0) {
              this.form.containers.push(d)
            } else if (d && d.type == 2) {
              this.form.preContainers.push(d)
            }
          }

          // Handle products
          for (var i = 0; i < response.data.productDOList.length; i++) {
            var d = response.data.productDOList[i]
            if (d && d.type == 0) {
              if (d.hazardousMaterials == '{}' || null == d.hazardousMaterials) {
                d.dg = 0
              } else {
                d.dg = 1
              }
              d.batteries = Number(d.batteries)
              d.hazardousMaterials = JSON.parse(d.hazardousMaterials)
              d.fileList = []
              d.uploadData = {}
              this.form.productData.push(d)
            }
          }

          this.form.shipmentRouters.push({
            pol: response.data.pod,
            etd: null,
            eta: null
          })

          this.changePol(response.data.pol)
          this.changePod(response.data.pod)

          // Clear fields that should not be copied
          this.$set(this.form, 'amendedOn', null)
          this.$set(this.form, 'blNumber', null)
          this.$set(this.form, 'bookingNumber', null)
          this.$set(this.form, 'shipmentBookingNumber', null)
          this.$set(this.form, 'atd', null)
          this.$set(this.form, 'ata', null)
          this.$set(this.form, 'etd', null)
          this.$set(this.form, 'eta', null)
          this.$set(this.form, 'cancelCode', null)
          this.$set(this.form, 'cancelSubCode', null)
          this.$set(this.form, 'cancelRemark', null)
          this.$set(this.form, 'siRemark', null)
          this.$set(this.form, 'blSamples', null)
          this.$set(this.form, 'bookedEtd', null)
          this.$set(this.form, 'bookedEta', null)
          this.$set(this.form, 'siDate', null)
          this.$set(this.form, 'vgmDate', null)
          this.$set(this.form, 'poNumbers', null)
          this.$set(this.form, 'etdAllocation', null)
          this.$set(this.form, 'noBookingEdi', 0)
          this.$set(this.form, 'noSiEdi', 0)
          this.$set(this.form, 'noVgmEdi', 0)
          this.$set(this.form, 'source', null)

          // Preserve port selections
          this.$set(this.form, 'pol', response.data.pol)
          this.$set(this.form, 'pod', response.data.pod)
          this.$set(this.form, 'originPort', response.data.originPort)
          this.$set(this.form, 'destinationPort', response.data.destinationPort)

          this.changePort(this.form.originPort)

          // Handle AMS/ACI defaults
          if (this.form.ams == null) {
            this.form.ams = 'NO'
          }
          if (this.form.aci == null) {
            this.form.aci = 'NO'
          }

          // Clear additional fields for copy
          this.$set(this.form, 'siEmail', null)
          this.$set(this.form, 'pushBookingFlag', null)
          this.$set(this.form, 'pushBooking', null)
          this.$set(this.form, 'pushSi', null)
          this.$set(this.form, 'pushVgm', null)
          this.$set(this.form, 'ningboBlNumber', null)
          this.$set(this.form, 'ningboBigBlNumber', null)
          this.$set(this.form, 'sinotrans', null)

          // Handle real carrier logic
          if (this.form.carrier === 'NVOCC DSV') {
            this.showRealCarrier = true
            this.showRequierdContractNumber = false
            this.showContractType = false
          } else {
            this.form.realCarrier = this.form.carrier
            this.showRealCarrier = false
            this.showRequierdContractNumber = true
            this.showContractType = true
          }
        }
      })
    },
    //air
    getAirDetails(id) {
      seaAirBookingRouterByBookingId(id).then(response => {
        if (response.data) {
          this.form.airRouters = response.data.map(item => ({
            id: item.id,
            transportMode:'air',
            etd: item.etd,
            etdT:item.etd,
            carrier: item.carrier,
            eta: item.eta,
            etaT: item.eta,
            pod: item.pod,
            pol: item.pol,
            flight: item.flight
          }))
        }
      })
    },

    onYearChange(year) {
      this.generateWeeksForYear(Number(year))
    },
    changeDG(item) {
      if (item.dg == 0) {
        this.$set(item, 'hazardousMaterials', {})
      } else {
        this.$set(item, 'batteries', 3)
      }
      this.$nextTick(() => {
        // 在DOM更新后执行其他操作 不然switch val 不会改变
        var tempa = this.form.name
        this.form.name = tempa + ' '
        this.form.name = tempa
      })
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.phone
      // 自定义验证逻辑
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8 || phoneNumber.length > 15) {
        this.phoneError = 'Please enter a valid phone or landline number'
      } else {
        this.phoneError = ''
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.email
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = 'Please enter a valid email address'
      } else {
        this.emailError = ''
      }
    },
    handleOptionChange(value) {
      var arr = []
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == 'Yes') {
          arr.push(this.containerOptions[i].type)
        }
      }
      var flag = false
      for (var i = 0; i < this.form.containers.length; i++) {
        if (arr.indexOf(this.form.containers[i].containerType) > -1) {
          flag = true
          break
        }
      }
      this.flag = flag
      // if (this.form.preContainers.length > 0) {
      //   this.GenPreContainers()
      // }
      this.form.preContainers = []
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselCode: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    remoteMethod2(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    setShipmentRouter() {
      if (!this.$route.query.schdule) {
        return
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule))
      this.$set(this.form, 'carrier', schdule.carrier)
      this.form.shipmentRouters[0].etd = schdule.etd
      this.form.shipmentRouters[0].eta = schdule.eta

      this.form.shipmentRouters[0].transportMeanName = schdule.vn
      this.form.shipmentRouters[0].identification = schdule.vc
      this.form.shipmentRouters[0].voyage = schdule.vo

      this.form.shipmentRouters[0].pol = schdule.pol
      this.form.shipmentRouters[1].pod = schdule.pod
    },
    changeVesselCode(item) {
      var obj = this.vesselListLes.find(element => element.vesselCode == item.identification)
      if (obj) {
        item.transportMeanName = obj.vesselName
        item.imo = obj.imo
      } else {
        item.imo = null
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    changeVesselName(item) {
      var obj = this.vesselListLes.find(element => element.vesselName == item.transportMeanName)
      if (obj) {
        item.identification = obj.vesselCode
        item.imo = obj.imo
      } else {
        item.identification = null
        item.imo = null
      }
      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    getVesselList() {},
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.partyForm))
          data.partyRole = ',' + data.partyRole.join(',') + ','
          data.status = 0
          createDeptApply(data).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
          })
        }
      })
    },
    applyNewParty() {
      this.open = true
    },
    addProduct() {
      this.form.productData.push({
        batteries: 3,
        fileList: [],
        uploadData: {},
        hazardousMaterials: {}
      })
    },
    changeBatteries(item) {
      if (item.batteries == 3) {
        item.batteriesLevelTow = []
      } else {
        this.$set(item, 'notToAll', false)
      }
    },
    changeNotToAll(item) {
      if (item.notToAll) {
      }
    },
    getParties(obj, setAp) {
      var vm = this
      listDept(obj).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(
            vm.partiesMap,
            response.data[i].id,
            response.data[i].name + '\n' + (response.data[i].country == null ? '' : response.data[i].country) + ' ' + (response.data[i].address == null ? '' : response.data[i].address)
          )
        }

        if (setAp) {
          this.$set(this.form, 'agreementParty', response.data[0].id)
        }
        this.$set(this.parties, obj.partyRole, response.data)
      })
    },
    changePort(value) {
      this.getAmsShow()
    },
    changeSinotrans() {
      this.getAmsShow()
    },
    getAmsShow() {
      if (this.form.originPort == 'CNNGB' && this.form.sinotrans) {
        this.showCNNGBSI = true
      } else {
        this.showCNNGBSI = false
      }
    },
    changePol(value) {
      // this.$set(this.form, "originPort", "");
      this.form.shipmentRouters[0].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      // this.$set(this.form, "destinationPort", "");
      this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      this.$refs['form'].validate((valid, obj) => {
        if (valid) {
          this.loadingSaveBut = true
          // 判断是否可以提交
          if (this.form.sinotrans) {
            if (!this.form.ediSource && this.form.originPort == 'CNSHA') {
              this.$modal.msgError('Please Select Agent')
              this.loadingSaveBut = false
              return
            }
          } else {
            this.form.ediSource = ''
          }

          var data = JSON.parse(JSON.stringify(this.form))

          // Handle shipment routers
          for (var i = 0; i < data.shipmentRouters.length; i++) {
            if (i != data.shipmentRouters.length - 1) {
              data.shipmentRouters[i].pod = data.shipmentRouters[i + 1].pol
            }
          }
          data.shipmentRouters.pop()
          data.routers = JSON.stringify(data.shipmentRouters)
          if(this.form.freightMethod !== 'sea_air'){
            data.airLegs = []
          }else{
            data.airLegs = data.airRouters.map(item=>({
              ...item,
              eta:getJoinDate(item.eta, item.etaT), // 2026-03-26 08:00:00
              etd: getJoinDate(item.etd, item.etdT)
            }))
          }
          data.bookingNumber = null
          data.containers = JSON.stringify(data.containers)
          data.preContainers = JSON.stringify(data.preContainers)

          // Handle product data
          var flag = false
          for (var i = 0; i < data.productData.length; i++) {
            data.productData[i].hazardousMaterials = JSON.stringify(data.productData[i].hazardousMaterials)
            if (data.productData[i].dg == 1) {
              flag = true
            }
          }
          data.productData = JSON.stringify(data.productData)

          // Handle real carrier logic
          if (this.form.carrier != 'NVOCC DSV') {
            data.realCarrier = this.form.carrier
          }
          data.realCarrier = this.form.realCarrier ? this.form.realCarrier : this.form.carrier

          data.status = status

          // Clear booking/order related data for copy
          data.bookingIds = ''
          data.soIds = []
          data.spoIds = []

          if (this.$route.query.source == 'booking-order') {
            data.source = 'booking-order'
          }

          create(data).then(response => {
            for (var i = 0; i < response.data.productIds.length; i++) {
              this.form.productData[i].uploadData.exId = response.data.productIds[i]
              if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
                this.$refs['upload' + i][0].submit()
              }
            }
            this.loadingSaveBut = false
            this.$router.push('/shipment/detail?id=' + response.data.shipmentId)
          })
        } else {
          const keys = Object.keys(obj)
          const hasOnlyConKeys = keys.length > 0 && keys.every(key => key.startsWith('containers'))
          if (hasOnlyConKeys) {
            this.activeName = 'second'
          } else {
            this.activeName = 'first'
          }
          setTimeout(() => {
            const errorFormItems = this.$refs['form'].$el.querySelectorAll('.el-form-item__error')
            if (errorFormItems.length > 0) {
              const firstErrorItem = errorFormItems[0]
              firstErrorItem.scrollIntoView({ block: 'end' })
            }
          }, 200)
          return false
        }
      })
    },
    getLabel(code, type) {
      var item = this.portOptions.find(item => item.code == code)
      if (item) {
        return item.name
      } else {
        return code
      }
    },
    getContainerList() {
      getContainerList().then(response => {
        this.containerOptions = response.data
      })
    },
    remoteMethod3(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ imo: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    changeVesselIMO(item) {
      var obj = this.vesselListLes.find(element => element.imo == item.imo)
      if (obj) {
        item.identification = obj.vesselCode
        item.transportMeanName = obj.vesselName
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
    },
    addContainers() {
      this.form.containers.push({})
    },
    getPortList() {
      console.log('进去portList了')
      getOriginDeliveryList().then(response => {
        console.log('获取到的港口列表', response.data)
        this.portOptions = response.data
        //booking
        var ids = this.$route.query.ids
        //salesOrder
        var soIds = this.$route.query.soIds
        //shippingOrder
        var spoIds = this.$route.query.spoIds
        console.log('soIds', soIds)
        console.log('spoIds', spoIds)
        if (ids) {
          this.getBookingList(ids)
          return
        } else if (soIds) {
          this.soIds = soIds
          this.initSO()
        }

        if (spoIds) {
          this.spoIds = spoIds.split(',')
          getShippingOrderListByIds(this.spoIds).then(async response => {
            this.spoList = response.data
            console.log('this.spolIust', this.spoList)
            // 处理cargoInfo
            this.handleCargoInfo(this.spoList, spoIds)
            await this.waitForSoProductList()
            getOrderHeadersList({ shippingOrderIds: spoIds })
              .then(res => {
                console.log(res)
                this.spoItems = []
                for (var order of res.data) {
                  var shipping = this.spoList.filter(item => item.id == order.shippingId)
                  if (shipping.length > 0) {
                    // 如果 order.soRef 没有值的时候再塞 edwin
                    if (!order.soRef) {
                      order.soRef = shipping[0].soRef
                    }
                    // order.soRef = shipping[0].soRef
                    var products = shipping[0].productDOList
                    if (products && products.length > 0) order.hscode = products[0].hscode
                  }
                  for (var item of order.items) {
                    item.soRef = order.soRef
                    item.orderNumber = order.orderNumber
                    item.hscode = order.hscode
                    item.bookedWeight = item.booked * item.outerWeight
                    item.bookedVolume = item.booked && item.length && item.width && item.height ? Number((item.booked * item.length * item.width * item.height) / 1000000) : 0
                    this.spoItems.push(item)
                  }
                }
                console.log(this.spoItems)
                this.getFromSOProductData()
              })
              .catch(err => {
                console.log(err)
              })
            const productData = {
              fileList: [],
              uploadData: {},
              hazardousMaterials: {},
              batteries: 3,
              dg: 0
            }
            for (var i = 0; i < this.spoList.length; i++) {
              this.form.originPort = this.spoList[i].bookingPreAssignDOS[0].pol
              this.form.destinationPort = this.spoList[i].bookingPreAssignDOS[0].pod
              this.form.pol = this.spoList[i].bookingPreAssignDOS[0].por
              this.form.pod = this.spoList[i].bookingPreAssignDOS[0].fnd
              this.changePol(this.form.pol)
              this.changePod(this.form.pod)
              if (this.spoList[i].shipmentType == 'FCL') {
                this.form.containers = []
                for (var j = 0; j < this.spoList[i].containerDOList.length; j++) {
                  var con = this.spoList[i].containerDOList[j]
                  con['containerType'] = con['type']
                  con['numbers'] = con['qty']
                  con['type'] = 0
                  this.form.containers.push(con)
                }
              }
              for (let j = 0; j < this.spoList[i].productDOList.length; j++) {
                if (this.spoList[i].productDOList[j].hazardousMaterials && this.spoList[i].productDOList[j].hazardousMaterials !== '{}') {
                  productData.dg = 1
                }
                if (this.spoList[i].productDOList[j].batteries === 2) {
                  productData.batteries = 2
                }
              }
            }
            this.form.productData.push(productData)
          })
        } else {
          this.form.productData.push({
            batteries: 3,
            fileList: [],
            uploadData: {},
            dg: 0,
            hazardousMaterials: {}
          })
        }

        this.form.shipmentRouters.push({
          pol: '',
          pod: '',
          transportMode: 'SEA',
          etd: null,
          eta: null
        })
        this.setShipmentRouter()
        this.hide2 = true
        this.hide = true
      })
    },
    getAirportList() {
      getAirportList().then(response => {
        this.airPolOptions = this.airPodOptions  = response.data.map(item=>({
           id:item.id,
          label:`${item.airportName}-(${item.iata})`,
          value:item.iata
        }))
        // this.setShipmentRouter()
      })
    },
    getAirCarrierList() {
      getAirCarrierList().then(response => {
        this.airCarrier = response.data.map(item=>({
           id:item.id,
          label:`${item.airlineName}-(${item.iata})`,
          value:item.iata
        }))
        // this.setShipmentRouter()
      })
    },
    getFromSOProductData() {
      this.form.productFromOrder = 1
      if (this.receiveSOProductList && this.receiveSOProductList.length > 0) {
        var weight = this.shippingProductTotalAllGrossWeight().toFixed(3)
        var volume = this.shippingProductTotalAllVolume().toFixed(3)
        var product = this.form.productData[0]
        var booked = this.shippingProductTotalAllBooked()
        product.numberOfPackages = booked
        product.grossWeight = weight
        product.volume = volume
        var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
        var excelUnit = this.receiveSOProductList[0].bookedUnit
        if (excelUnit == 'CT') {
          excelUnit = 'CTNS'
        }
        if (excelUnit == null) {
          excelUnit = 'CTNS'
        }
        console.log(excelUnit)
        if (excelUnit != null) {
          for (var unit of units) {
            if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
              product.packages = unit.value
            }
          }
        }
        // 填充hs code
        var hscode = this.receiveSOProductList[0].hscode
        product.hscode = hscode

        const productNames = this.receiveSOProductList.map(item => item.productEnglishName).join('\n')
        product.productEnglishName = productNames
        console.log('productNames', productNames)

        if (this.receiveSOProductList.length === 1) {
          product.markNumbers = this.receiveSOProductList[0].markNumbers
        }
      }
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
    },

    selectBlur(item) {
      for (var i = 0; i < this.hsCodeList.length; i++) {
        if (item.hscode == this.hsCodeList[i].hsCode) {
          item.productEnglishName = this.hsCodeList[i].productEnglishName
        }
      }
    },
    selectClear() {},

    remoteGetHsCode(query) {
      if (query !== '' && query.length >= 2) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getHsCodeListByCode(query)
          this.options = this.hsCodeList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },

    getHsCodeListByCode(hscode) {
      getHsCodeListByCode(hscode).then(response => {
        this.hsCodeList = response.data
      })
    },
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.shipmentCargoInfo.active(spoList, spoIds)
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
// 自定义函数用于验证电子邮件地址
function isValidEmailAddress(email) {
  // 自定义验证逻辑
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
</script>
