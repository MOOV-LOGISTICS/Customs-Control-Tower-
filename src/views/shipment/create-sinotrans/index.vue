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

    <el-card style class="pd-20">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Basic Info" name="first"></el-tab-pane>
        <el-tab-pane label="Containers and Products" name="second"></el-tab-pane>
      </el-tabs>

      <el-form v-loading="submitLoading" :model="form" ref="form" label-width="150px" :show-message="false">
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

              <!--               <el-descriptions-item v-if="showRealCarrier">
                <template slot="label">
                  <span style="color:red;">*</span>Real Carrier
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="realCarrier">
                  <el-select @change="realChangeCarrier" filterable v-model="form.realCarrier">
                    <el-option v-for="dict in realCarrierList" v-if="dict.value!='TSHG'" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>-->
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Carriage Term
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="contractType">
                  <el-select filterable v-model="form.contractType">
                    <el-option v-for="dict in carriageOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item>
                <template slot="label">
                  <span v-if="showRequierdContractNumber" style="color:red;">*</span>Contract Number
                </template>
                <el-form-item :required="showRequierdContractNumber" :rules="showRequierdContractNumber ? [{ required: true, message: '' }] : []" prop="contractNumber">
                  <el-select v-model="form.contractNumber" filterable allow-create default-first-option placeholder="Please select Carrier first Or Input" @change="handleContractChange" >
                    <el-option v-for="contract in contractOptions" :key="contract.id" :label="contract.contractNo" :value="contract.contractNo" />
                  </el-select>
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

            <el-descriptions-item v-if="isSelectedContractPremium" label="Reason of Premium">
                <template slot="label">
                  <span v-if="isSelectedContractPremium" style="color:red;">*</span>Reason of Premium
                </template>
                <el-form-item :rules="[{ required: true, message: 'Reason of Premium is required' }]"
                  prop="reasonOfPremium">
                  <el-select filterable v-model="form.reasonOfPremium">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.Reason_Of_Premium)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
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

              <el-descriptions-item>
                <template slot="label">Place of Delivery(BL)</template>
                <el-input v-model="form.placeOfDelivery" />
              </el-descriptions-item>

              <el-descriptions-item v-if="!this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">Allocation Week</template>
                <el-form-item prop="allocationWeek">
                  <el-select clearable v-model="form.allocationWeek" filterable>
                    <el-option v-for="(item,index_a) in allocationWeekList" :key="index_a" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">Allocation Year</template>
                <el-form-item prop="allocationYear">
                  <el-select v-model="form.allocationYear" placeholder="Select Year" @change="onYearChange" clearable>
                    <el-option v-for="year in availableYears" :key="year" :label="year" :value="year" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">Allocation Week</template>
                <el-form-item prop="allocationWeek">
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
                <template slot="label">Carrier Freight Type</template>
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

                <el-form-item :rules="[ { required: true, message: '  '}  ]" :required="$auth.hasPermi('shipment:create-notpb')" prop="customer">
                  <el-select style="width:100%!important" filterable clearable v-model="form.customer">
                    <el-option v-for="item in parties['Customer']" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
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
                <template slot="label">Order Numbers</template>

                <el-form-item prop="poNumbers">
                  <el-input :type="$auth.hasPermi('shipment:create-notpb')?'textarea':''" v-model="form.poNumbers" rows="3" />
                </el-form-item>
              </el-descriptions-item>

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
                      {{ getLabel(form.originPort, "pol") }}
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
                      {{ getLabel(form.destinationPort, "pod") }}
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
            <!-- air -->
             <template v-if="this.form.freightMethod === 'sea_air'">
              <el-card style="border-radius:0px;padding-top:10px;margin-top:15px;margin-bottom:15px">
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

              <el-timeline
               
              >
                <el-timeline-item
                :timestamp="
          (item.etd!=null||item.eta!=null)? (
            (parseTime(item.etd) ? parseTime(item.etd) : '-') +
            ' - ' +
            (parseTime(item.eta) ? parseTime(item.eta) : '-')
            ):''
      "
                  placement="top"
                  v-for="(item, i) in form.airRouters"
                  :key="i + 'router'"
                  class="airRouters-css"
                >
                  <el-card shadow="never">
                    <div >
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
                        <el-button v-if="i != 0" type="danger" @click="form.airRouters.splice(i, 1)" icon="el-icon-delete" circle></el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>

             </template>
             
          </el-col>

          <el-col v-show="activeName=='second'" :span="15">
            <el-card v-if="soIds.length>0" style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Orders</div>
              <el-table style="margin-bottom:10px" v-if="itemTableData.length > 0" :data="itemTableData">
                <el-table-column prop="orderId" label="Order Number">
                  <template v-slot="scope">
                    <span>{{ orderMap[scope.row.orderId] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="productId" label="Product Code">
                  <template v-slot="scope">
                    <span>
                      {{
                      productMapForBook[scope.row.productId]
                      ? productMapForBook[scope.row.productId].code
                      : ""
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="productId" label="Product Name">
                  <template v-slot="scope">
                    <span>
                      {{
                      productMapForBook[scope.row.productId]
                      ? productMapForBook[scope.row.productId].name
                      : ""
                      }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="requested" :label="$t('booking.requested')">
                  <template v-slot="scope">{{ scope.row.requested }}{{ scope.row.requestUnit }}</template>
                </el-table-column>
                <el-table-column prop="bookedQty" :label="$t('booking.booked')">
                  <template v-slot="scope">{{ scope.row.bookedQty }}{{ scope.row.bookedUnit }}</template>
                </el-table-column>
              </el-table>

              <SOMainTable :tableData="soTableData" :containerMap="{}" ref="table" v-if="soTableData.length>0" :tableHeight="null"></SOMainTable>
              <pagination :total="soLineTotal" :page.sync="soQueryParams.pageNo" :limit.sync="soQueryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="initSO" />
            </el-card>

            <el-card v-show="spoItems&&spoItems.length>0" style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Orders</div>
              <!--增加 货物信息-->
              <div>
                <shipment-cargo-info ref="shipmentCargoInfo" @so-product-list="handleSoProductList" />
              </div>
              <!-- <el-table style="margin-bottom:10px" border v-if="spoItems&&spoItems.length > 0" :data="spoItems">
                <el-table-column prop="soRef" label="SO Number">
                  <template v-slot="scope">
                    <span>{{ scope.row.soRef }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="orderId" label="Order Number">
                  <template v-slot="scope">
                    <span>{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="productId" label="Item Number">
                  <template v-slot="scope">
                    <span>
                      {{
                      scope.row.productCode
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="productId" label="Product Name">
                  <template v-slot="scope">
                    <span>
                      {{
                      scope.row.productName
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="requested" :label="'Ordered (Cartons)'">
                  <template v-slot="scope">{{ scope.row.outerQty }}</template>
                </el-table-column>
                <el-table-column prop="bookedQty" :label="'Booked (Cartons)'">
                  <template v-slot="scope">{{ scope.row.booked }}</template>
                </el-table-column>

                <el-table-column prop="totalWeight" :label="'Total Weight (KG)'">
                  <template v-slot="scope">{{ scope.row.bookedWeight }}</template>
                </el-table-column>
                <el-table-column prop="totalVolume" :label="'Total Volume (CBM)'">
                  <template v-slot="scope">{{ scope.row.bookedVolume }}</template>
                </el-table-column>
              </el-table>-->
              <!--  加汇总和带入按钮 -->

              <!-- <div style="text-align: right;margin-top: 8px; float: right;">
                <span style="margin-right:20px">Total Booked Cartons：{{ totalAllBooked() }}</span>
                <span style="margin-right:20px">Total Gross Weight：{{ totalAllGrossWeight().toFixed(3) }}</span>
                <span style="margin-right:20px">Total Volume：{{ totalAllVolume().toFixed(3) }}</span>
              </div>-->
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
                <div v-show="receiveSOProductList && receiveSOProductList.length>0" style="float: right">
                  <el-button @click="getFromSOProductData" size="mini" type="primary">Get From Shipper Booking</el-button>
                </div>
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
                        :headers="uploadHeaders"
                        :on-success="handleSuccess"
                        :before-remove="(file, fileList) => handleRemove(file, fileList, i)"
                        :file-list="item.fileList"
                        :auto-upload="false"
                        :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.fileList = files}, () => {item.fileList = [];item.uploadData = {}})"
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
              <div class="containers-editor-scroll">
                <div class="containers-editor" :class="{ 'containers-editor--reefer': flag }">
                  <div class="containers-editor__header containers-editor__row">
                    <div class="containers-editor__col containers-editor__col--type">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.containerType") }}
                    </div>
                    <div class="containers-editor__col containers-editor__col--qty">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.numberOfContainers") }}
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--vent">Ventilation(cbm/hour)</div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--temp">
                      <font color="#FF0000">*</font>
                      Temperature(°C)
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--humidity">Humidity(%)</div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--o2">O2(%)</div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--co2">CO2(%)</div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--drains">Drains</div>
                    <div class="containers-editor__col containers-editor__col--soc">
                      <font color="#FF0000">*</font>SOC
                    </div>
                    <div class="containers-editor__col containers-editor__col--action"></div>
                  </div>

                  <div
                    v-for="(item, i) in form.containers"
                    :key="item.id || 'container-' + i"
                    class="containers-editor__row shipmentRouters-css"
                  >
                    <div class="containers-editor__col containers-editor__col--type">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containers.' + i + '.containerType'">
                        <el-select filterable v-model="item.containerType" @change="handleOptionChange">
                          <el-option
                            v-for="opt in craFlag ? containerOptions.filter((c) => { return cra_contaier_type.indexOf(c.type) > -1; }) : filterContainerOptions(form)"
                            :label="opt.type"
                            :value="opt.type"
                            :key="opt.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="containers-editor__col containers-editor__col--qty">
                      <el-form-item required :rules="getContainerQuantityRules()" :prop="'containers.' + i + '.numbers'">
                        <el-input-number @change="containerChange" :controls="false" :precision="0" v-model="item.numbers" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--vent">
                      <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                        <el-input v-model="item.ventClosedOrNot" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--temp">
                      <el-form-item
                        v-show="isReeferContainerType(item.containerType)"
                        :rules="getContainerTemperatureRules(item.containerType)"
                        :prop="'containers.' + i + '.requireTemperature'"
                      >
                        <el-input v-model="item.requireTemperature" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--humidity">
                      <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                        <el-input v-model="item.humidity" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--o2">
                      <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                        <el-input v-model="item.o2" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--co2">
                      <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                        <el-input v-model="item.co2" />
                      </el-form-item>
                    </div>
                    <div v-show="flag" class="containers-editor__col containers-editor__col--drains">
                      <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                        <el-select v-model="item.drains" placeholder="Select">
                          <el-option label="Open" value="Open"></el-option>
                          <el-option label="Close" value="Close"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="containers-editor__col containers-editor__col--soc">
                      <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
                    </div>
                    <div class="containers-editor__col containers-editor__col--action">
                      <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDeleteContainer(i)">{{ $t("search.delete") }}</el-button>
                    </div>
                  </div>
                </div>
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
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="shipper" style="border:none;border-bottom:1px solid #ddd;width:100%!important">
                  <el-select style="width:100%!important" filterable clearable v-model="form.shipper">
                    <el-option v-for="item in parties['Shipper']" :key="item.id" :value="item.id" :label="item.name">
                      <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-create-sinotrans">
                        <div slot="content">
                          <p>Address: {{ item.address }}</p>
                          <p>Phone: {{ item.phone }}</p>
                          <p>Fax: {{ item.fax }}</p>
                          <p>Email: {{ item.email }}</p>
                          <p>Enterprise: {{ item.companyUsci }}</p>
                        </div>
                        <span class="company-option-with-tooltip">{{ item.name }}</span>
                      </el-tooltip>
                    </el-option>
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
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="consignee" style="border:none;border-bottom:1px solid #ddd;width:100%!important">
                  <el-select clearable v-model="form.consignee" filterable>
                    <el-option v-for="item in parties['Consignee']" :key="item.id" :value="item.id" :label="item.name">
                      <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-create-sinotrans">
                        <div slot="content">
                          <p>Address: {{ item.address }}</p>
                          <p>Phone: {{ item.phone }}</p>
                          <p>Fax: {{ item.fax }}</p>
                          <p>Email: {{ item.email }}</p>
                          <p>Enterprise: {{ item.companyUsci }}</p>
                        </div>
                        <span class="company-option-with-tooltip">{{ item.name }}</span>
                      </el-tooltip>
                    </el-option>
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
                  <span style="color:red;">*</span>Name
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="notifyParty" style="border:none;border-bottom:1px solid #ddd;width:100%!important">
                  <el-select clearable v-model="form.notifyParty" filterable>
                    <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name">
                      <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-create-sinotrans">
                        <div slot="content">
                          <p>Address: {{ item.address }}</p>
                          <p>Phone: {{ item.phone }}</p>
                          <p>Fax: {{ item.fax }}</p>
                          <p>Email: {{ item.email }}</p>
                          <p>Enterprise: {{ item.companyUsci }}</p>
                        </div>
                        <span class="company-option-with-tooltip">{{ item.name }}</span>
                      </el-tooltip>
                    </el-option>
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
                <el-form-item style="border:none;border-bottom:1px solid #ddd;width:100%!important" prop="agreementParty">
                  <el-select clearable v-model="form.agreementParty" filterable>
                    <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name">
                      <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-create-sinotrans">
                        <div slot="content">
                          <p>Address: {{ item.address }}</p>
                          <p>Phone: {{ item.phone }}</p>
                          <p>Fax: {{ item.fax }}</p>
                          <p>Email: {{ item.email }}</p>
                          <p>Enterprise: {{ item.companyUsci }}</p>
                        </div>
                        <span class="company-option-with-tooltip">{{ item.name }}</span>
                      </el-tooltip>
                    </el-option>
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
                <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{getAgreementParty().companyUsci}}</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

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
              <el-button @click="queryShippingSchedule" type="primary">
                Search
                <i class="el-icon-search el-icon--right"></i>
              </el-button>
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
                          <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">
                            {{
                            item.portCode }}
                          </div>
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
                          <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null)" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                          <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null)" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
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
        <el-row style="text-align: center;margin-top: 0px;">
          <!--        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.reserved">Reserve space</el-checkbox></span>-->
          <!-- <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.sinotrans"
          v-hasPermi="['sinotrans-booking']">E-Sinotrans EDI</el-checkbox></span>-->
          <span style="margin-right: 10px;display:inline-block">
            <el-checkbox v-model="form.sinotrans" v-hasPermi="['sinotrans-booking']">Book through smartMOOV</el-checkbox>
          </span>
          <span style="margin-right: 10px;display:inline-block">
            <el-form-item v-hasPermi="['sinotrans-booking']" v-if="form.sinotrans&&form.originPort == 'CNSHA'" prop="ediSource" label-width="0px">
              <el-select v-model="form.ediSource" filterable clearable placeholder="Select Agent">
                <el-option key="CNSHA_DFGJ" label="Dongfang International" value="CNSHA_DFGJ" />
                <el-option key="CNSHA_ZWY" label="Sinotrans" value="CNSHA_ZWY" />
              </el-select>
            </el-form-item>
          </span>

          <el-button size="mini" @click="submit(2)" type="primary" :loading="loadingSaveBut">Save Draft</el-button>
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

.containers-editor-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 6px;
}

.containers-editor {
  min-width: 520px;
}

.containers-editor--reefer {
  min-width: 1180px;
}

.containers-editor__row {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.containers-editor__header {
  font-size: 13px;
  line-height: 1.4;
  color: #606266;
  margin-bottom: 10px;
  padding-bottom: 4px;
}

.containers-editor__col {
  flex: 0 0 auto;
}

.containers-editor__col--type {
  width: 120px;
}

.containers-editor__col--qty {
  width: 100px;
}

.containers-editor__col--vent {
  width: 130px;
}

.containers-editor__col--temp {
  width: 110px;
}

.containers-editor__col--humidity,
.containers-editor__col--o2,
.containers-editor__col--co2 {
  width: 88px;
}

.containers-editor__col--drains {
  width: 110px;
}

.containers-editor__col--soc {
  width: 130px;
}

.containers-editor__col--action {
  width: 72px;
  padding-top: 4px;
}

.containers-editor .el-select,
.containers-editor .el-input,
.containers-editor .el-input-number {
  width: 100%;
}

.containers-editor .el-form-item {
  margin-bottom: 0;
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
import SOMainTable from '@/views/salesOrder/components/table.vue'
import {getSOHeaderPage} from '@/api/order/sOHeader'
import {getUserProfile} from '@/api/system/user'
// import { listDept } from '@/api/system/dept'
import { getBookingList } from '@/api/booking/booking'
import { create, si, vgm, findShippingScheduleList, listDept } from '@/api/shipment/shipment'
import { getContainerList } from '@/api/system/container'
import { createDeptApply } from '@/api/system/deptApply'
import { getVesselList } from '@/api/system/vessel'
import { getHsCodeListByCode, applyNewHsCode } from '@/api/system/hsCode'
import { getCraNumList } from '@/api/shipment/shipment'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getBaseHeader } from '@/utils/request'
import { getItemList } from '@/api/order/item'
import { getProductList } from '@/api/system/product'
import { getHeaderList } from '@/api/order/header'
import { getAllocationWeekData, getContractPage } from '@/api/booking/contract'
import { getContractListTenantIgnore } from '@/api/booking/contract'
import { getPortPage } from '@/api/system/port'
import { getShippingOrderListByIds } from '@/api/shipping/order'
import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'
import ShipmentCargoInfo from '@/views/shipment/components/shipment-cargo-info.vue'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import shipmentCarrier from '@/utils/shipmentCarrier'
import { getContractNoPage } from '@/api/shipment/contractNo'
import { getAirportList } from '@/api/air/airport'
import { getAirlineList as getAirCarrierList } from '@/api/air/airline'
import {getJoinDate} from '@/utils'
import {
  applyReeferFieldsForContainer,
  sanitizeContainersReeferFields,
  isReeferContainerType as checkReeferContainerType,
  containerTemperatureRules as buildContainerTemperatureRules,
  clearNonReeferTemperatureValidation,
  mapShippingOrderContainerToShipmentForm,
  containerQuantityRules
} from '@/utils/formContainersUtil'


export default {
  name: 'Shipment',
  mixins: [fileLoadMixin],
  components: { SOMainTable, ShipmentCargoInfo },
  data() {
    return {
      contractOptions: [],
      allocationWeekList: [],
      loadingSaveBut: false,
      searchSchedule: {
        from: new Date(),
        to: new Date().setMonth(new Date().getMonth() + 2)
      },
      //air
      searchAirSchedule: {
        from: new Date(),
        to: new Date().setMonth(new Date().getMonth() + 2)
      },
      soTableData: [],
      soQueryParams: {
        pageNo: 1,
        pageSize: 10
      },
      soLineTotal: 0,
      shippingScheduleLoading: false,
      shippingScheduleVisable: false,
      shippingScheduleData: [],
      form: {
        preContainers: [],
        reserved: false,
        blType: 'SeaWayB/L',
        blCopies: '1',
        specialAllocation: 'Standard',
        reasonOfPremium: '',
        type: 'Merchant',
        containers: [],
        shipmentRouters: [{ etd: null, eta: null, transportMeanName: null, identification: null, imo: null, voyage: null, service: null, pol: null }],
        //air 
        airRouters: [],
        productData: [],
        contractType: 'CY/CY',
        phone: '',
        email: '',
        remark: '',
        allocationYear: null,
        allocationWeek: null,
        freightType: 'FCL'
      },
      availableYears: [],
      availableWeeks: [],
      chosePaymentLocationVisable: false,
      phoneError: '',
      emailError: '',
      portOptions: [],
      soIds: [],
      containerOptions: [],
      hide: false,
      hide2: false,
      shipmentId: null,
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
      craNumList: [],
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
      applyHsCodeVisable: false,
      hsCode: {},
      uploadCount: 0,
      successCount: 0,
      submitLoading: false,
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
        SHCO: 'SHIPCO',
        'NVOCC DSV': 'DSV',
        WECC: 'WEC'
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
        SHIPCO: 'SHCO',
        DSV: 'NVOCC DSV',
        WEC: 'WECC'
      },
      craList: [],
      queryParams: {
        pageNo: 1,
        total: 0,
        pageSize: 10
      },
      paymentLocationList: [],
      activeName: 'first',
      userProfile: {},
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
      airPolOptions:[],
      airPodOptions:[],
      spoIds: [],
      spoList: [],
      showCNNGBSI: false,
      isPepco: false,
      spoItems: [],
      // 接收shipment-cargo-info组件的数据
      receiveSOProductList: [],
      showContractType: true,
      carrierList: [],
      realCarrierList: [],
      showRealCarrier: false,
      showRequierdContractNumber: true,
      carrierPodCvFndList: [],
      fndOptions: [],
      carriageOptions: [],
      roleMatch: false
    }
  },
  //zane 不在这里调用，移到created里
  // mounted() {
  //   console.log('mounted',this.form)
  //   this.getContractListByCarrier(this.form.carrier)
  // },
  async created() {
    const {freightMethod} = this.$route.query;
    if(freightMethod){
      this.form.freightMethod = freightMethod;
    }
    console.log('初始化的routers', this.form)
    this.generateAvailableYears()
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    await this.getContainerList()
    await this.getPortList()
    this.ensureDefaultContainers()
    this.handleOptionChange()
    this.getCarrierList()

    //air
    this.getAirCarrierList()
    this.getAirportList()
    this.getParties({ partyRole: 'Shipper' }, '')
    this.getParties({ partyRole: 'Consignee' }, '')
    this.getParties({ partyRole: 'Notify Party' }, '')
    this.getParties({ partyRole: 'Agreement Party' }, '')
    this.getParties({ partyRole: 'Customer' }, '')
    this.getVesselList()

    // 初始化时填充Carriage Term下拉框
    this.carriageOptions = this.getDictDatas(this.DICT_TYPE.CARRIAGE_CONTRACT)

    // this.getHsCodeList();
    this.getContractListTenantIgnore()
    if (this.$route.query.carrier) {
      this.$set(this.form, 'carrier', this.$route.query.carrier)
      console.log("this.form++++++", this.form.carrier)
      const carrier = shipmentCarrier.find(item => item.carrier === this.$route.query.carrier)
      if (carrier) {
        const options = this.carriageOptions.filter(item => carrier.options.includes(item.value))
        if (options) {
          this.carriageOptions = options
          this.form.contractType = null
        }
      }
    }
    this.getContractListByCarrier(this.form.carrier)
    this.isPepco = this.$route.query.isPepco
    console.log('this.form_info', this.isPepco)
    this.getUserInfo()
    if (this.form.ams == null) {
      this.form.ams = 'NO'
    }
    if (this.form.aci == null) {
      this.form.aci = 'NO'
    }
    this.carrierPodCvFndList = this.getDictDatas(this.DICT_TYPE.CARRIER_POD_CV_FND)
    this.getUserRole();

    // 2026-2-26(TYIN-9689) 当carrier booking里面DC CODE 出现不一样时，carriage term 这里固定死，把它设置成CY/CY
    // dc Set集合
    const dcSet = new Set()
    this.spoList.forEach(item => {
      dcSet.add(item.dc)
    })
    // 如果有多个不同的dc code设置成固定的CY/CY
    if (dcSet.size > 1) {
      this.carriageOptions = this.getDictDatas(this.DICT_TYPE.CARRIAGE_CONTRACT).filter(item => item.value === 'CY/CY')
      this.form.contractType = 'CY/CY'
    }

    localStorage.removeItem('refreshPoPage')
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
    clearFieldError(prop) {
      const field = this.$refs.form.fields.find(field => field.prop === prop)
      if (field) {
        field.validateMessage = ''
        field.validateState = ''
      }
    },
    getShipper() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
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
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
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
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
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
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.agreementParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find(item => item.id == this.form.agreementParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },

    containerChange() {
      // if (this.form.preContainers.length > 0) {
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
            this.form.preContainers.push({
              containerType: containerType,
              soc: this.form.containers[i].soc ? true : false
            })
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
    getUserInfo() {
      var vm = this
      getUserProfile().then(response => {
        vm.userProfile = response.data
        console.log(response.data)
        this.$set(this.form, 'name', response.data.nickname)
        this.$set(this.form, 'phone', response.data.mobilePhone)
        this.$set(this.form, 'email', response.data.email)
        this.$set(this.form, 'fax', response.data.fax)
        this.$set(this.form, 'fixedPhone', response.data.businessPhone)
      })
    },
    getUserRole() {
      console.log('create-shipment 用户角色',this.$auth.hasRole("tenant_admin"))
      const hasRole = this.$auth.hasRole("tenant_admin")
      this.roleMatch = hasRole
    },
    changeBl(value) {
      console.log(value)
      if (value == 'ORIGINAL') {
        this.form.blCopies = 3
      } else {
        this.form.blCopies = 1
      }
    },
    chosePaymentLocation() {
      getPortPage(this.queryParams).then(res => {
        this.paymentLocationList = res.data.list
        this.queryParams.total = res.data.total
      })
      this.chosePaymentLocationVisable = true
    },
    getContractListTenantIgnore() {
      var queryParams = {}
      getContractListTenantIgnore(queryParams).then(response => {
        this.craList = []
        for (var t of response.data) {
          t.contractNo = t.contractNo.trim()
          this.craList.push(t)
        }
      })
    },
    applyNewHsCode() {
      this.applyHsCodeVisable = true
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
      getVesselList().then(response => {
        this.vesselList = response.data
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
              eta: null
            })
            continue
          }
          if (i != schdules.length - 1 && sch.event == 'Departure') {
            // 有船 并且是 departure ；或者barge
            var sch1 = schdules[i + 1]
            var schItem = {
              transportMode: sch.barge,
              etd: sch.eventTime,
              eta: sch1.eventTime,
              transportMeanName: sch.barge == 'Barge' ? 'TBA' : sch.vessel,
              service: sch.barge == 'Barge' ? 'Unknown' : sch.service,
              voyage: sch.barge == 'Barge' ? 'Unknown' : sch.voyage,
              pol: i == 0 ? schdule.pol : sch.portCode
            }
            if (sch.barge == 'Barge') {
              schItem.transportMode = 'BRG'
            }
            if (sch.barge == 'Ocean') {
              schItem.transportMode = 'SEA'
            }
            var obj = this.vesselList.find(element => element.vesselName == schItem.transportMeanName)

            if (obj) {
              schItem.identification = obj.vesselCode
              schItem.imo = obj.imo
            } else {
              schItem.identification = 'Unknown'
              schItem.imo = 'Unknown'
            }
            if (i == 0) {
              this.form.shipmentRouters[0] = schItem
            } else {
              this.form.shipmentRouters.push(schItem)
            }
          }
          this.form = JSON.parse(JSON.stringify(this.form))
        }
        console.log(this.form.shipmentRouters)
      })
    },
    //air
    queryAirSchedule() {
      if (this.isCanSearchAirSchedule) {
        const data = {
          origin: this.form.originPort,
          destination: this.form.destinationPort,
          departureFrom: this.parseTime(this.searchAirSchedule.from),
          departureFrom2: this.parseTime(this.searchAirSchedule.to),
          carrier: this.carrierMap[this.form.carrier],
          service: this.searchAirSchedule.service
        }
        console.log(data)
        // todo
        return
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
      handleContractChange() {
    this.form.reasonOfPremium = ''
  },
    queryShippingSchedule2() {
      if (
        this.form.pol != null &&
        this.form.pol != '' &&
        this.form.pod != null &&
        this.form.pod != '' &&
        this.searchSchedule.from != null &&
        this.searchSchedule.from != '' &&
        this.searchSchedule.to != null &&
        this.searchSchedule.to != ''
      ) {
        var data = {
          origin: this.form.pol,
          destination: this.form.pod,
          departureFrom: this.parseTime(this.searchSchedule.from),
          departureFrom2: this.parseTime(this.searchSchedule.to),
          carrier: this.carrierMap[this.form.carrier]
        }
        findShippingScheduleList(data).then(response => {
          this.shippingScheduleData = response.data
          console.log(this.form.shipmentRouters[0])
          var arr = this.shippingScheduleData.filter(item => {
            return item.vesselName == this.form.shipmentRouters[0].transportMeanName && item.voyage == this.form.shipmentRouters[0].voyage && this.form.carrier == this.carrierMap2[item.carrier]
          })

          if (arr.length > 0) {
            this.$set(this.form.shipmentRouters[0], 'service', arr[0].service)
          }
        })
      } else {
      }
    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then(response => {
        this.shippingScheduleData = response.data
        this.shippingScheduleLoading = false
      })
    },
    changeDG(item) {
      this.$set(item, 'tempaax', 1)
      this.$delete(item, 'tempaax')
      if (item.dg == 0) {
        this.$set(item, 'hazardousMaterials', {})
      } else {
        this.$set(item, 'batteries', 3)
      }
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.phone
      // 自定义验证逻辑
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8 || phoneNumber.length > 15) {
        this.phoneError = ''
      } else {
        this.phoneError = ''
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.email
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = ''
      } else {
        this.emailError = ''
      }
    },
    // MSC set logic for contianer type 根据吴总的需求 麻烦增加一个设置 carrier 选择MSC时。 只要POD 选择GDANSK或者GDYNIA contianer type 里面 没有40GP这个选项。 谢谢
    filterContainerOptions(form) {
      console.log('-----filterContainerOptions----')
      console.log(form)
      console.log(form.destinationPort)
      console.log(this.form)
      console.log(this.form.destinationPort)
      //TB-10295 需求变更，注释调这段业务代码
      //carrier是MSC  OHA - 不能选择40DC, 4PL - 可以选择40DC
      // if (form.carrier == 'MSCU' && (form.destinationPort == 'PLGDY' || form.destinationPort == 'PLGDN')) {
        //   console.log('----11----')
        //   return this.containerOptions.filter(item => item.type != '40DC')
        // }
      return this.containerOptions
    },
    createEmptyContainer() {
      return {
        containerType: '',
        numbers: null,
        ventClosedOrNot: '',
        requireTemperature: '',
        humidity: '',
        o2: '',
        co2: '',
        drains: '',
        soc: false
      }
    },
    ensureDefaultContainers() {
      if (!this.form.containers || this.form.containers.length === 0) {
        this.$set(this.form, 'containers', [this.createEmptyContainer()])
      }
    },
    ensureContainerRowReactive(container) {
      const template = this.createEmptyContainer()
      Object.keys(template).forEach(key => {
        if (!(key in container)) {
          this.$set(container, key, template[key])
        }
      })
      return container
    },
    isReeferContainerType(containerType) {
      return checkReeferContainerType(containerType, this.containerOptions)
    },
    getContainerTemperatureRules(containerType) {
      return buildContainerTemperatureRules(containerType, this.containerOptions)
    },
    getContainerQuantityRules() {
      return containerQuantityRules()
    },
    handleOptionChange() {
      var arr = []
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == 'Yes') {
          arr.push(this.containerOptions[i].type)
        }
      }
      var flag = false
      for (var i = 0; i < this.form.containers.length; i++) {
        this.ensureContainerRowReactive(this.form.containers[i])
        applyReeferFieldsForContainer(this.form.containers[i], this.containerOptions, 'containerType')
        if (arr.indexOf(this.form.containers[i].containerType) > -1) {
          flag = true
        }
      }
      this.flag = flag
      this.form.preContainers = []
      this.$nextTick(() => {
        clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'containerType')
      })
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
    remoteMethod22(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
          this.changeVesselName(this.form.shipmentRouters[0])
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
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
    setCra() {
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
          data.push(this.createEmptyContainer())
        }
        this.$set(this.form, 'containers', data)
        this.handleOptionChange()
      }
    },
    changeCarrier(value) {
      // 限制Carriage Term选项
      let carriageOptions = this.getDictDatas(this.DICT_TYPE.CARRIAGE_CONTRACT)
      // value存在时才限制
      if (value) {
        // 2026-2-26(TYIN-9689) 当carrier booking里面DC CODE 出现不一样时，carriage term 这里固定死，把它设置成CY/CY
        // dc Set集合
        const dcSet = new Set()
        this.spoList.forEach(item => {
          dcSet.add(item.dc)
        })
        // 如果有多个不同的dc code设置成固定的CY/CY
        if (dcSet.size > 1) {
          carriageOptions = this.carriageOptions.filter(item => item.value === 'CY/CY')
          this.form.contractType = 'CY/CY'
        } else {
          // 查找当前value是否需要限制
          const carrier = shipmentCarrier.find(item => item.carrier === value)
          if (carrier) {
            const options = this.getDictDatas(this.DICT_TYPE.CARRIAGE_CONTRACT).filter(item => carrier.options.includes(item.value))
            if (options) {
              carriageOptions = options
              this.form.contractType = null
            }
          }
        }
      }
      this.carriageOptions = carriageOptions

      // 承运人变更时触发FND过滤
      this.handleDestinationPortChange(this.form.destinationPort)

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
        } else if (value === 'NVOCC MOOV') {
          console.log('选择的NVOCC MOOV', value)
          this.showRequierdContractNumber = false
          this.showContractType = false
        } else {
          this.form.realCarrier = value
          this.showRealCarrier = false
          this.showRequierdContractNumber = true
          this.showContractType = true
        }

        this.craFlag = false
      }
      this.changePort(this.form.originPort)
      this.remoteGetCraNum()
      // 获取合同列表
      this.getContractListByCarrier(value)
      this.$nextTick(() => {
        this.ensureDefaultContainers()
        this.handleOptionChange()
      })
    },
    // 获取合同列表
    getContractListByCarrier(carrier) {
      if (!carrier) {
        this.contractOptions = []
        return
      }

      const params = {
        pageNo: 1,
        pageSize: 100,
        carrier: carrier,
        status: 0
      }

      getContractNoPage(params)
        .then(response => {
          this.contractOptions = response.data.list || []
          // 如果当前选择的合同不在新列表中，则清空合同选择
          if (this.form.contractNumber && !this.contractOptions.some(c => c.contractNo === this.form.contractNumber)) {
            this.form.contractNumber = ''
          }
        })
        .catch(error => {
          console.error('获取合同列表失败:', error)
          this.contractOptions = []
          this.form.contractNumber = ''
        })
    },

    realChangeCarrier(value) {
      if (value == 'TSHG') {
        this.setCra()
        this.craFlag = true
      } else {
        this.form.realCarrier = value
        this.craFlag = false
      }
      this.changePort(this.form.originPort)
      this.remoteGetCraNum()
    },

    setShipmentRouter() {
      if (!this.$route.query.schdule) {
        return
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule))
      console.log('this.form.shipmentRouters1', schdule)
      this.$set(this.form, 'carrier', schdule.carrier)
      if (schdule.carrier == 'TSHG') {
        this.craFlag = true
      }
      this.form.shipmentRouters[0].etd = schdule.etd
      this.form.shipmentRouters[0].eta = schdule.eta
      this.form.shipmentRouters[0].transportMode = 'SEA'
      this.form.shipmentRouters[0].transportMeanName = schdule.vessel
      this.form.shipmentRouters[0].identification = schdule.vc
      this.form.shipmentRouters[0].imo = schdule.imo
      // this.form.shipmentRouters[0].vessel = schdule.vessel
      this.form.shipmentRouters[0].voyage = schdule.voyage
      this.form.shipmentRouters[0].service = schdule.service

      // this.remoteMethod2(schdule.vn)

      // this.form.shipmentRouters[0].voyage = schdule.vo
      this.$set(this.form, 'pol', schdule.pol)
      this.$set(this.form, 'pod', schdule.pod)
      this.changePol(schdule.pol)
      this.changePod(schdule.pod)

      var bookSchdule = {}
      if (schdule.backup != null) {
        bookSchdule = JSON.parse(schdule.backup)
        this.setSchdulesTSHG(bookSchdule)
      }
    },
    //air
    setAirRouter(){
      if (!this.$route.query.schdule) {
        return
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule))
      
      const {airData} = schdule
      this.form.airRouters = airData.map(item=>({
        id:item.id,
        transportMode:'air',
        etd:item.etd,
        etdT:item.etd,
        carrier:item.carrier,
        eta: item.eta,
        etaT: item.eta,
        pod: item.pod,
        pol:item.pol,
        flight:item.flight
      }))
      console.log(">>>>>>",this.form.airRouters,)
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
    changeVesselIMO(item) {
      var obj = this.vesselListLes.find(element => element.imo == item.imo)
      if (obj) {
        item.identification = obj.vesselCode
        item.transportMeanName = obj.vesselName
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    getVesselList() {},
    submitHsCode() {
      this.$refs['hsCodeForm'].validate(valid => {
        if (valid) {
          applyNewHsCode(this.hsCode).then(res => {
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.applyHsCodeVisable = false
            this.hsCode = {}
          })
        } else {
          return false
        }
      })
    },
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
    showWeight(item) {
      if (item.containerType == '') {
        return 0
      } else {
        var c = this.containerOptions.find(element => element.type == item.containerType)
        if (c) {
          return (item.numbers ? Number(item.numbers) : 0) * c.weight
        }
      }
    },
    getParties(obj, setAp) {
      var vm = this
      listDept(obj).then(response => {
        this.$set(this.parties, obj.partyRole, response.data)
      })
    },
    changePort(value) {
      if (this.form.carrier == 'TSHG' && value == 'CNNGB' && this.form.pol == 'CNTAG') {
        console.log('xxxx')
        this.form.shipmentRouters[0].pol = 'CNNGB'
      } else {
        this.form.shipmentRouters[0].pol = this.form.pol
      }
      this.getAmsShow()
    },
    changeSinotrans() {
      this.getAmsShow()
    },
    getAmsShow() {
      if ((this.form.originPort == 'CNNGB' || this.form.originPort == 'CNTAO' || this.form.originPort == 'CNTXG') && this.form.sinotrans) {
        this.showCNNGBSI = true
      } else {
        this.showCNNGBSI = false
      }
    },
    changePol(value) {
      console.log('初始化时设置pol', value)
      // this.$set(this.form, "originPort", "");
      this.form.shipmentRouters[0].pol = value
      console.log('初始化时设置pol结果', this.form.shipmentRouters[0].pol)
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      // this.$set(this.form, "destinationPort", "");
      this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      //提交参数校验
      const containerTypeMatch = this.form.containers.some(x => x.containerType === '40DC');
      if (!this.roleMatch && this.form.carrier == 'MSCU' && containerTypeMatch){
        this.$modal.notifyError('40DC container type is not available when the carrier is MSC')
        return;
      }
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

      if (this.form.preContainers.length > 0) {
        for (var i = 0; i < this.form.containers.length; i++) {
          console.log(this.form.containers[i].numbers)
          console.log()
          var arr = this.form.preContainers.filter(item => item.containerType == this.form.containers[i].containerType)
          if (arr.length != this.form.containers[i].numbers) {
            this.$notify({
              message: 'Booked containers quantities equals Pre-assembled containers quantities',
              type: 'warning'
            })
            return
          }
        }
      }

      if (this.form.carrier == '' || this.form.carrier == null) {
        this.$notify({
          message: 'Carrier is  required',
          type: 'warning'
        })
        return
      }

      // MSC set logic for contianer type 根据吴总的需求 麻烦增加一个设置 carrier 选择MSC时。 只要POD 选择GDANSK或者GDYNIA contianer type 里面 没有40GP这个选项。
      if (this.form.carrier == 'MSCU' && (this.form.destinationPort == 'PLGDY' || this.form.destinationPort == 'PLGDN')) {
        if (this.form.containers.some(item => item.containerType == '40DC')) {
          this.$notify({
            message: 'MSC does not support 40GP',
            type: 'warning'
          })
          return
        }
      }

      clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'containerType')
      this.$refs['form'].validate((valid, obj) => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))
          for (var i = 0; i < data.shipmentRouters.length; i++) {
            if (i != data.shipmentRouters.length - 1) {
              data.shipmentRouters[i].pod = data.shipmentRouters[i + 1].pol
            }
          }

          // if ((data.shipmentRouters.length = 1)) {
          //   // 最后一个航次的 pod 设为 form 的 pod
          //   data.shipmentRouters[0].pol = this.form.pol
          //   data.shipmentRouters[0].pod = this.form.pod
          // }
          // if (data.shipmentRouters.length > 1) {
          //   // 最后一个航次的 pod 设为 form 的 pod
          //   let lastIndex = data.shipmentRouters.length - 1
          //   data.shipmentRouters[lastIndex].pod = this.form.pod
          // }
          // data.shipmentRouters.pop()
          data.routers = JSON.stringify(data.shipmentRouters)
          //air

           if(this.form.freightMethod !== 'sea_air'){
            data.airLegs = []
          }else{
            data.airLegs = data.airRouters.map(item=>({
              ...item,
              eta:getJoinDate(item.eta, item.etaT), // 2026-03-26 08:00:00
              etd: getJoinDate(item.etd, item.etdT)
            }))
          }
          data.containers = sanitizeContainersReeferFields(data.containers, this.containerOptions, 'containerType')
          data.containers = JSON.stringify(data.containers)
          data.preContainers = JSON.stringify(data.preContainers)
          console.log('提交的表单数据', this.$route.query)
          data.soIds = this.soQueryParams.ids
          var flag = false
          var grossWeight = 0
          for (var i = 0; i < data.productData.length; i++) {
            data.productData[i].hazardousMaterials = JSON.stringify(data.productData[i].hazardousMaterials)
            if (data.productData[i].dg == 1) {
              flag = true
            }

            grossWeight += Number(data.productData[i].grossWeight)

            if (data.productData[i].dg === 1 || data.productData[i].batteries === 2) {
              if (data.productData[i].fileList.length < 1) {
                this.$notify.error('Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!')
                this.submitLoading = false
                this.loadingSaveBut = false
                return
              }
            }
          }

          this.uploadCount = 0
          this.successCount = 0

          data.productData = JSON.stringify(data.productData)
          data.bookingIds = this.$route.query.spoIds
          data.status = status
          data.spoIds = this.spoIds
          data.isPepco = this.isPepco
          if (this.form.carrier != 'NVOCC DSV') {
            data.realCarrier = this.form.carrier
          }
          data.realCarrier = this.form.realCarrier ? this.form.realCarrier : this.form.carrier
          if (this.$route.query.source == 'booking-order') {
            data.source = 'booking-order'
          }
          console.log('上传masc的数据', data)
          console.log('上传masc的form数据', this.form)
          create(data).then(response => {
            console.log('创建返回的参数', response)
            if (response.data && response.data.errorCode) {
              if (response.data.errorCode === '1003000026') {
                console.log('创建失败', response.data.message)
                this.$message({
                  message: response.data.message || '创建失败',
                  type: 'error',
                  duration: 3000
                })
                this.submitLoading = false
                this.loadingSaveBut = false
                return
              }
            }
            this.shipmentId = response.data.shipmentId
            for (var i = 0; i < response.data.productIds.length; i++) {
              this.form.productData[i].uploadData.exId = response.data.productIds[i]
            }
            var count = 0
            for (var i = 0; i < response.data.productIds.length; i++) {
              if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
                this.$refs['upload' + i][0].submit()
              }
            }
            this.$router.push('/shipment/detail?id=' + this.shipmentId)
            this.loadingSaveBut = false
            localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
          })
        } else {
          const keys = Object.keys(obj)
          // 判断是否有以"containers"开头的key
          const hasOnlyConKeys = keys.length > 0 && keys.every(key => key.startsWith('containers') || key.startsWith('productData'))
          if (hasOnlyConKeys) {
            this.activeName = 'second'
          } else {
            this.activeName = 'first'
          }
          setTimeout(() => {
            // 验证失败，滚动到第一个错误框
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
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
      if (this.successCount == this.uploadCount) {
        this.$router.push('/shipment/detail?id=' + this.shipmentId)
      }
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
      return getContainerList().then(response => {
        this.containerOptions = response.data || []
      })
    },
    getBookingList(ids) {
      getBookingList({ ids: ids }).then(response => {
        if (response.data.length > 0) {
          var orderItems = []
          var preAssigns = []
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].bookingPreAssignDOS != null) {
              if (response.data[i].bookingPreAssignDOS.length > 0) {
                preAssigns.push(response.data[i].bookingPreAssignDOS[response.data[i].bookingPreAssignDOS.length - 1])
              }
              //bookingPreAssignDOS
            }
            for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
              orderItems.push(response.data[i].bookingItemDOS[j].orderItemId)
              this.orderItemMap[response.data[i].bookingItemDOS[j].orderItemId] = response.data[i].bookingItemDOS[j].qty
            }
          }
          var bookSchdule = {}
          var preAssignMap = {}
          for (var i = 0; i < preAssigns.length; i++) {
            if (preAssigns[i].eta != null && preAssigns[i].etd != null && preAssigns[i].vessel != null && preAssigns[i].voyage != null && preAssigns[i].carrier != null) {
              preAssignMap[preAssigns[i].vessel + '/' + preAssigns[i].voyage + '/' + preAssigns[i].carrier] = preAssigns[i]
            }
            if (preAssigns[i].backup != null) {
              bookSchdule = JSON.parse(preAssigns[i].backup)
            }
          }

          if (orderItems.length > 0) {
            getItemList({ ids: orderItems.join(',') }).then(res => {
              var productIds = []
              var orderIds = []
              for (var i = 0; i < res.data.length; i++) {
                res.data[i].bookedQty = this.orderItemMap[res.data[i].id]
                productIds.push(res.data[i].productId)
                orderIds.push(res.data[i].orderId)
              }
              this.itemTableData = res.data
              getHeaderList({ ids: orderIds.join(',') }).then(orderRes => {
                var pos = []
                for (var i = 0; i < orderRes.data.length; i++) {
                  pos.push(orderRes.data[i].orderNumber)
                  this.$set(this.orderMap, [orderRes.data[i].id], orderRes.data[i].orderNumber)
                }
                this.$set(this.form, 'poNumbers', pos.join(','))
              })
              getProductList({ ids: productIds }).then(productRes => {
                for (var i = 0; i < productRes.data.length; i++) {
                  this.$set(this.productMapForBook, [productRes.data[i].id], {
                    name: productRes.data[i].name,
                    code: productRes.data[i].code
                  })
                }
              })
            })
          }

          for (var i = 0; i < response.data[0].bookingProductDOS.length; i++) {
            var d = response.data[0].bookingProductDOS[i]
            if (d.hazardousMaterials == '{}') {
              d.dg = 0
            } else {
              d.dg = 1
            }
            d.batteries = Number(d.batteries)
            if (!d.batteries) d.batteries = 3
            d.hazardousMaterials = JSON.parse(d.hazardousMaterials)
            d.fileList = []
            d.uploadData = {}
            this.form.productData.push(d)
          }

          var schdule = {
            pol: response.data[0].originPort,
            pod: response.data[0].destinationPort
          }
          const keys = Object.keys(preAssignMap)
          this.form.shipmentRouters[0].pol = keys.length == 1 ? preAssignMap[keys[0]].por : schdule.pol

          this.form.shipmentRouters.push({
            pol: keys.length == 1 ? preAssignMap[keys[0]].fnd : schdule.pod,
            etd: null,
            eta: null
          })
          this.$set(this.form, 'pol', schdule.pol)
          this.$set(this.form, 'pod', schdule.pod)

          if (schdule.pol) this.changePol(schdule.pol)
          if (schdule.pod) this.changePod(schdule.pod)

          if (keys.length == 1) {
            this.form.shipmentRouters[0].transportMeanName = preAssignMap[keys[0]].vessel
            this.form.shipmentRouters[0].etd = preAssignMap[keys[0]].etd
            this.form.shipmentRouters[0].eta = preAssignMap[keys[0]].eta
            this.form.shipmentRouters[0].voyage = preAssignMap[keys[0]].voyage
            this.$set(this.form, 'pol', preAssignMap[keys[0]].por)
            this.$set(this.form, 'pod', preAssignMap[keys[0]].fnd)
            this.changePol(preAssignMap[keys[0]].por)
            this.changePod(preAssignMap[keys[0]].fnd)
            if (preAssignMap[keys[0]].carrier != 'TSHG') {
              this.$set(this.form, 'carrier', preAssignMap[keys[0]].carrier)
              this.changeCarrier(preAssignMap[keys[0]].carrier)
              this.realChangeCarrier(preAssignMap[keys[0]].carrier)
            }

            this.remoteMethod22(this.form.shipmentRouters[0].transportMeanName)

            this.searchSchedule.from = preAssignMap[keys[0]].etd - 60 * 60 * 24
            this.searchSchedule.to = preAssignMap[keys[0]].eta
            //this.queryShippingSchedule2()
            //
          }
          this.form = JSON.parse(JSON.stringify(this.form))

          this.setSchdulesTSHG(bookSchdule)

          //changeVesselName(router)
          //this.form.shipmentRouters[0].imo = schdule.imo;
          //this.remoteMethod2(schdule.vn)
        }
      })
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
      this.ensureDefaultContainers()
      this.handleOptionChange()
    },
    addContainers() {
      this.form.containers.push(this.createEmptyContainer())
    },
    initSO() {
      this.soQueryParams.ids = this.soIds.split(',')
      getSOHeaderPage(this.soQueryParams).then(res => {
        var orderNumbers = []
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].key = 'first' + res.data.list[i].id
          orderNumbers.push(res.data.list[i].salesOrderNumber)
        }
        this.$set(this.form, 'poNumbers', orderNumbers.join(','))
        this.soTableData = res.data.list
        this.soLineTotal = res.data.total
      })
    },
    async getPortList() {
      console.log('进去portList了')
      const response = await getOriginDeliveryList()
      console.log('获取到的港口列表', response.data)
      this.portOptions = response.data
      //booking
      var ids = this.$route.query.ids
      //salesOrder
      var soIds = this.$route.query.soIds
      //shippingOrder
      var spoIds = this.$route.query.spoIds
      var freightMethod = this.$route.query.freightMethod
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
        const shippingList = await getShippingOrderListByIds(this.spoIds)
        this.spoList = shippingList.data
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
            const loaded = []
            for (var j = 0; j < this.spoList[i].containerDOList.length; j++) {
              var con = this.spoList[i].containerDOList[j]
              loaded.push(mapShippingOrderContainerToShipmentForm(con))
            }
            this.$set(this.form, 'containers', loaded)
            this.ensureDefaultContainers()
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
      if (freightMethod === 'sea_air') {
        //air
        this.form.airRouters.push({
          pol: '',
          pod: '',
          airMode: 'air',
          etd: null,
          eta: null
        })
        this.setAirRouter()
      }
      this.setShipmentRouter()
      this.hide2 = true
      this.hide = true
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
    getAllocationWeekList() {
      if (this.form.contractNumber && this.form.carrier) {
        getAllocationWeekData(this.form.carrier, this.form.contractNumber).then(response => {
          this.allocationWeekList = response.data
        })
      }
    },
    remoteChangeCraNum() {
      let inputCra = this.$refs.nameCra.selectedLabel.trim()
      console.log(inputCra)
      console.log(this.form.contractNumber)
      console.log('remoteChangeCraNum')
    },
    remoteGetCraNum() {
      //query Allocation  etd week
      this.getAllocationWeekList()

      var query = this.form.contractNumber
      if (this.form.carrier == 'MAEU') {
      }
      if (this.form.carrier != 'TSHG') {
        return
      }
      var remark = this.form.remark.replace(/CRA:.*/g, '')
      if (remark == '') {
        this.$set(this.form, 'remark', remark + '\nCRA:' + query)
      } else {
        this.$set(this.form, 'remark', remark + 'CRA:' + query)
      }
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
      } else {
        this.cra_contaier_type = []
        this.cra_pol = []
        this.cra_pod = []
        this.cra_origin = []
        this.cra_disch = []
      }
    },
    getHsCodeListByCode(hscode) {
      getHsCodeListByCode(hscode).then(response => {
        this.hsCodeList = response.data
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
    },

    totalAllBooked() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked)
      }, 0)
    },

    totalAllGrossWeight() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight)
      }, 0)
    },
    totalAllVolume() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume)
      }, 0)
    },
    shippingProductTotalAllBooked() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.numberOfPackages == 'undefined' ? 0 : currentValue.numberOfPackages)
      }, 0)
    },
    shippingProductTotalAllGrossWeight() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.grossWeight == 'undefined' ? 0 : currentValue.grossWeight)
      }, 0)
    },
    shippingProductTotalAllVolume() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.volume == 'undefined' ? 0 : currentValue.volume)
      }, 0)
    },
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.shipmentCargoInfo.active(spoList, spoIds)
      })
    },
    getFromOrder() {
      this.form.productFromOrder = 1
      var weight = this.totalAllGrossWeight().toFixed(3)
      var volume = this.totalAllVolume().toFixed(3)
      var product = this.form.productData[0]
      var booked = this.totalAllBooked()
      product.numberOfPackages = booked
      product.grossWeight = weight
      product.volume = volume
      var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
      var excelUnit = this.spoItems[0].bookedUnit
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
      var productName = this.spoItems[0].productName
      product.productEnglishName = productName

      var hscode = this.spoItems[0].hscode
      product.hscode = hscode
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
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

    // 获取so product list
    handleSoProductList(soProductList) {
      this.receiveSOProductList = soProductList
      console.log('handleSoProductList', soProductList)

      if (this._resolveSoProductList) {
        // 通知 promise 完成
        this._resolveSoProductList()
        this._resolveSoProductList = null
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

    onYearChange(year) {
      this.generateWeeksForYear(year)
    },

    generateWeeksForYear(year) {
      const weeks = this.getWeeksInYear(year)

      const today = new Date()
      const currentYear = today.getFullYear()
      const currentWeek = this.getWeekNumber(today)

      // this.availableWeeks = weeks.filter(week => {
      //   if (year === currentYear) {
      //     return week >= currentWeek // 当前年，过滤掉之前的周
      //   }
      //   return true
      // })
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
    waitForSoProductList() {
      return new Promise(resolve => {
        this._resolveSoProductList = resolve
      })
    },
    getCarrierList() {
      this.carrierList = this.getDictDatas(this.DICT_TYPE.CARRIER)
      this.realCarrierList = this.getDictDatas(this.DICT_TYPE.CARRIER)
      console.log('获取到的船公司列表', this.carrierList)
    },
    handleRemove(file, fileList, i) {
      this.form.productData[i].fileList = fileList
    },
    handleDestinationPortChange(value) {
      this.filterFndByConditions(value)
    },
    //  FND过滤核心逻辑
    filterFndByConditions(value) {
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
        // 2025-12-02,当POD选择为Koper的时候，FND多一个选项，为Gyal------HUGYL
        if (value === 'SIKOP' && !this.fndOptions.includes('HUGYL')) {
          fndOptions.push('HUGYL')
        }
        this.fndOptions = fndOptions
        // 检查当前选择是否在新列表中
        if (!this.fndOptions.includes(this.form.pod)) {
          this.form.pod = '' // 清空现有选择
        }
      } else {
        // 未找到匹配项，使用默认字典
        this.fndOptions = []
      }
    }
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
    },
    // zane 计算是否展示
    isSelectedContractPremium() {
      if (!this.form.contractNumber) return false;
      const selected = this.contractOptions.find(
        c => c.contractNo === this.form.contractNumber
      );
      return selected?.contractType === 'Premium';
    }
  },
  watch: {
    'form.contractNumber'(newVal) {
      console.log(newVal,"number change")
      if (!this.isSelectedContractPremium) {
        this.form.reasonOfPremium = undefined;
      }
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
<style scoped>
.company-option-with-tooltip {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}
</style>
<style>
.company-full-width-tooltip-create-sinotrans {
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}
</style>
