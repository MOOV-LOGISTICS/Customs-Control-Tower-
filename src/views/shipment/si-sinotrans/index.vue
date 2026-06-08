<template>
  <div class="app-container shipment-create" style="width:100%; margin: 0 auto">


    <el-card class="pd-20">
        <el-tag v-if="spoList.length>0" size="small" style="margin-right: 5px;  font-size: 14px; " v-for="spo in spoList" :key="spo.id">
   <el-link v-show="form.fromShipperBooking" type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}</el-link>
   <el-link v-show="!form.fromShipperBooking" type="primary" target="_blank" :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
                </el-tag>
      <div style="float: right; display: flex; align-items: center;">
        <el-tag class="tab-title">
          Booking Number : {{ shipmentBookingNumber }}
        </el-tag>
        <el-button type="primary" :loading="downloadLoading" @click="handleExportShipmentDetails">Download SI</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Basic Info" name="first"></el-tab-pane>
        <el-tab-pane label="Containers and Products" name="second"></el-tab-pane>
      </el-tabs>
      <el-form :model="form" ref="form" :show-message="false" label-width="140px">

        <el-row :gutter="20">
          <el-col v-if="activeName=='first'" :span="24">
            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top" title="Basic Info"
              direction="vertical" :column="4" size="mini">
              <el-descriptions-item>
                <template slot="label">
                  Carrier
                </template>
                <el-form-item required prop="carrier">
                  <el-select disabled @change="changeCarrier" filterable v-model="form.carrier">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'"
                      :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">

                  Carriage Term
                </template>
                <el-form-item required prop="contractType">
                  <el-select disabled filterable v-model="form.contractType">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIAGE_CONTRACT)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  Contract Number
                </template>

                <el-form-item required prop="contractNumber">
                  <el-input v-model="form.contractNumber" />



                </el-form-item>

              </el-descriptions-item>

              <el-descriptions-item :label="form.carrier=='MAEU'?'Contract Type':''">
                <el-form-item v-if="form.carrier=='MAEU'" :required="form.carrier=='MAEU'" prop="specialAllocation">
                  <el-select disabled placeholder="Type" v-model="form.specialAllocation">
                    <el-option label="Standard" value="Standard"></el-option>
                    <el-option label="Floating" value="Floating"></el-option>
                    <el-option label="Alwaysspace" value="Alwaysspace"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">

                  Place of Receipt
                </template>
                <el-form-item required prop="pol">
                  <el-select disabled @change="changePol" filterable v-model="form.pol">
                    <el-option v-for="(item, index) in craFlag
                    ? portOptions.filter((item) => {
                        return cra_pol.indexOf(item.code) > -1;
                      })
                    : portOptions" :key="index + 'pol1'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

                          <el-descriptions-item>
                            <template slot="label">

                              Port of Loading
                            </template>
                            <el-form-item required prop="originPort">
                              <el-select disabled v-model="form.originPort" filterable>
                                <el-option v-for="(item, index) in craFlag
                                              ? portOptions.filter((item) => {
                                                  return cra_origin.indexOf(item.code) > -1;
                                                })
                                              : portOptions" :key="index + 'pol3'" :label="item.name+' ('+item.code+')'"
                                  :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-descriptions-item>

                          <el-descriptions-item>
                            <template slot="label">

                              Port of discharge
                            </template>
                            <el-form-item required prop="originPort">
                              <el-select disabled v-model="form.destinationPort" filterable>
                                <el-option v-for="(item, index) in craFlag
                                              ? portOptions.filter((item) => {
                                                  return cra_disch.indexOf(item.code) > -1;
                                                })
                                              : portOptions" :key="index + 'pol4'" :label="item.name+' ('+item.code+')'"
                                  :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">

                  Final Destination
                </template>
                <el-form-item required prop="pod">
                  <el-select disabled @change="changePod" filterable v-model="form.pod">
                    <el-option v-for="(item, index) in craFlag
                    ? portOptions.filter((item) => {
                        return cra_pod.indexOf(item.code) > -1;
                      })
                    : portOptions" :key="index + 'pol2'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>



              <el-descriptions-item>
                <template slot="label">

                  Place of Delivery(BL)
                </template>
                <el-form-item  prop="placeOfDelivery">
                  <el-input v-model="form.placeOfDelivery" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">

                  Allocation Week
                </template>
                <el-form-item prop="allocationWeek">
                  <el-select clearable v-model="form.allocationWeek" filterable>
                    <el-option v-for="(item,index_a) in allocationWeekList" :key="index_a" :value="item" :label="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item>
                <template slot="label">
                  BL Types
                </template>
                <el-form-item required prop="blType">
                  <el-select disabled title="BLTYPE" @change="changeBl" size="mini" v-model="form.blType"
                    :placeholder="$t('booking.bl_type')" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" :key="dict.value" :label="dict.label"
                      :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>



              <el-descriptions-item>
                <template slot="label">
                  BL Copies
                </template>
                <el-form-item required prop="blCopies">
                  <el-input disabled v-model="form.blCopies" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  Payment Method
                </template>
                <el-form-item required prop="paymentMethod">
                  <el-select disabled size="mini" v-model="form.paymentMethod" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_METHOD)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  Payment Location
                </template>
                <el-form-item prop="paymentLocation">
                  <el-input disabled @focus="chosePaymentLocation" readonly v-model="form.paymentLocation" />
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item>
                <template slot="label">

                  PO Numbers
                </template>

                <el-form-item prop="poNumbers">
                  <el-input disabled v-model="form.poNumbers" />
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item>
                <template slot="label">
                  SCAC CODE
                </template>
                <el-form-item prop="scacCode">
                  <el-input  v-model="form.scacCode" />
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item  v-if="showCNNGBSI">
                <template slot="label">
                  AMS
                </template>
                <el-form-item required prop="ams">
                  <el-select size="mini" v-model="form.ams" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.SINOTRANS_AMS)" :key="dict.value" :label="dict.label"
                               :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item  v-if="showCNNGBSI">
                <template slot="label">
                  ACI
                </template>
                <el-form-item required prop="aci">
                  <el-select size="mini" v-model="form.aci" class="custom-select">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.SINOTRANS_AMS)" :key="dict.value" :label="dict.label"
                               :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item  v-if="showCNNGBSI">
                <template slot="label">
                  <div v-show="form.ams == 'CARRIER' || form.aci == 'CARRIER'" >HBL Number</div>
                </template>
                <el-form ref="hblForm" :model="form"  :show-message="false">
                  <el-form-item required   v-show="form.ams!='NO'||form.aci!='NO'" prop="hblNumber">
                    <el-input v-model="form.hblNumber" />
                  </el-form-item>
                </el-form>
              </el-descriptions-item>
              <el-descriptions-item  v-if="showCNNGBSI">
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  Carrier Freight Type
                </template>
                <el-form-item prop="freightType">
                  <el-select disabled filterable v-model="form.freightType">
                    <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">

                  Remark
                </template>

                <el-form-item prop="remark">
                  <el-input v-model="form.remark" type="textarea" rows="3" />
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>

            <el-card style="border-radius:0px;padding-top:10px;margin-top:15px;margin-bottom:15px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px">Shipping Schedule</div>
              <el-timeline>
                <el-timeline-item :timestamp="
          (item.etd!=null||item.eta!=null)? (
            (parseTime(item.etd) ? parseTime(item.etd) : '-') +
            ' - ' +
            (parseTime(item.eta) ? parseTime(item.eta) : '-')
            ):''
      " placement="top" v-for="(item, i) in form.shipmentRouters" :key="i + 'router'" class="shipmentRouters-css">
                  <el-card shadow="never">
                    <h4 v-if="i == 0">
                      <i class="el-icon-ship"></i>{{ $t("booking.form") }}:
                      {{ getLabel(item.pol, "pol") }}
                    </h4>
                    <div v-if="i != form.shipmentRouters.length - 1 && i > 0">
                      <h4><i class="el-icon-ship"></i>{{ $t("booking.formTo") }}:</h4>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <font color="#FF0000">*</font>{{ $t("booking.pol") }}
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.pol'">
                            <el-select disabled filterable v-model="item.pol">

                              <el-option v-for="(item, index) in portOptions" :key="index + 'pol4'"  :label="item.name+' ('+item.code+')'"
                                :value="item.code"></el-option>

                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="i != form.shipmentRouters.length - 1">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <font color="#FF0000">*</font>{{ $t("booking.etd") }}
                        </el-col>
                        <el-col :span="12">
                          <font color="#FF0000">*</font>{{ $t("booking.eta") }}
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="margin-bottom: 5px">
                        <el-col :span="12">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.etd'">
                            <el-date-picker disabled value-format="timestamp" v-model="item.etd" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.eta'">
                            <el-date-picker disabled value-format="timestamp" v-model="item.eta" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <font color="#FF0000">*</font>{{ $t("booking.transportMeanName") }}
                        </el-col>
                                      <el-col :span="8">
                                        <font color="#FF0000">*</font>{{ $t("booking.voyage") }}
                                      </el-col>
                                      <el-col :span="8">
                                        <font color="#FF0000">*</font>Service
                                      </el-col>
                      </el-row>

                      <el-row :gutter="20" style="margin-bottom: 5px">
                        <!-- <el-col :span="12"><el-input v-model="item.identification" /></el-col> -->
                        <el-col :span="8">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.transportMeanName'">
                            <el-select disabled allow-create v-model="item.transportMeanName" placeholder="" filterable remote
                              reserve-keyword clearable :remote-method="remoteMethod2" @change="changeVesselName(item)"
                              @clear="item.transportMeanName = null">
                              <el-option v-for="dict in vesselListLes" :key="dict.id" :label="dict.vesselName"
                                :value="dict.vesselName" />
                            </el-select>
                          </el-form-item>

                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.voyage'">
                            <el-input disabled v-model="item.voyage" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item required :prop="'shipmentRouters.' + i + '.service'">
                            <el-input disabled v-model="item.service" />
                          </el-form-item>
                        </el-col>
                      </el-row>

                    </div>
                    <h4 v-if="i == form.shipmentRouters.length - 1">
                      <i class="el-icon-ship"></i>{{ $t("booking.to") }}:
                      {{ getLabel(item.pol, "pod") }}
                    </h4>
                    <el-row v-if="i != form.shipmentRouters.length - 1" style="margin-top: 10px; text-align: center">
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>




          <el-col v-show="activeName=='second'" :span="24">

            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Products
              </div>

                                  <div v-show="spoItems&&spoItems.length>0">
                                    <div style="text-indent: 0px;margin-bottom:8px">
                                      <b style="font-size: 15px">Cargo Info</b>
                                    </div>
                                    <el-table style="margin-bottom:10px" border v-if="spoItems&&spoItems.length > 0" :data="spoItems">
                                      <el-table-column prop="soRef" label="SO Number">
                                        <template v-slot="scope">
                                          <el-link type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+scope.row.id">
                                            <span>{{ scope.row.soRef }}</span>
                                          </el-link>
                                        </template>
                                      </el-table-column>
                                      <!-- <el-table-column prop="orderId" label="Order Number">
                                        <template v-slot="scope">
                                          <span>{{ scope.row.orderNumber }}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="productId" label="Item Number">
                                        <template v-slot="scope">
                                          <span>{{
                                            scope.row.productCode
                                            }}</span>
                                        </template>
                                      </el-table-column> -->
                                      <el-table-column prop="productId" label="Product Name">
                                        <template v-slot="scope">
                                          <span>{{ scope.row.productName }}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="hsCode" label="HS Code" min-width="110">
                                        <template v-slot="scope">
                                          <span>{{ scope.row.hscode }}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="markNumbers" label="Marks & Numbers">
                                        <template v-slot="scope">
                                          <span>{{ scope.row.markNumbers }}</span>
                                        </template>
                                      </el-table-column>
                                      <!-- <el-table-column prop="requested" :label="'Ordered (Cartons)'">
                                        <template v-slot="scope">
                                          {{ scope.row.outerQty }}
                                        </template>
                                      </el-table-column> -->
                                      <el-table-column prop="bookedQty" :label="'Booked (Cartons)'">
                                        <template v-slot="scope">
                                          {{ scope.row.booked }}
                                        </template>
                                      </el-table-column>

                                      <el-table-column prop="totalWeight" :label="'Total Weight (KG)'">
                                        <template v-slot="scope">
                                          {{ scope.row.bookedWeight }}
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="totalVolume" :label="'Total Volume (CBM)'">
                                        <template v-slot="scope">
                                          {{ scope.row.bookedVolume }}
                                        </template>
                                      </el-table-column>

                                    </el-table>
                                    <!--  加汇总和带入按钮 -->

                                    <div style="text-align: right;margin-top: 8px; ">
                                      <span style="margin-right:20px">
                                        Total Booked Cartons：{{ totalAllBooked() }}
                                      </span>
                                      <span style="margin-right:20px">
                                        Total Gross Weight：{{ totalAllGrossWeight().toFixed(3) }}
                                      </span>
                                      <span style="margin-right:20px">
                                        Total Volume：{{ totalAllVolume().toFixed(3) }}
                                      </span>
                                    </div>
                                  </div>

<div v-if="SOProductList.length>0" style="margin-bottom: 10px;">

  <div style="text-indent: 0px;margin-bottom:8px">
    <b style="font-size: 15px">Cargo Info</b>
  </div>
  <el-table class="SOProduct" :data="SOProductList" style="width: 100%;" border show-summary
    :summary-method="getSummaries">
    <el-table-column prop="soRef" label="SO Ref" width="130px">
      <template v-slot="{ row, $index }">
<el-link v-show="form.fromShipperBooking" type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+row.id">{{ row.soRef }}</el-link>
<el-link v-show="!form.fromShipperBooking"  type="primary" target="_blank" :href="'/shipment/shippingBookingDetail?id='+row.soId">{{ row.soRef }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="productEnglishName" label="Product English Name">
    </el-table-column>
    <el-table-column prop="hscode" label="Hs code" width="90px">
    </el-table-column>
    <el-table-column prop="numberOfPackages" label="Number Of Packages" width="130px">
    </el-table-column>
    <el-table-column prop="packages" label="Packages" width="90px">
    </el-table-column>
    <el-table-column prop="grossWeight" label="GrossWeight(KG)" width="110px">
    </el-table-column>
    <el-table-column prop="volume" label="volume(CBM)" width="110px">
    </el-table-column>

    <el-table-column v-if="spoList.length>0&& SOType=='LCL'" prop="numberOfPackagesAll" label="Number Of Packages Can Allocate">
      <template v-slot="{ row, $index }">
        <div :class="getInputStrClassNumberOfPackages(row)"> {{ row.numberOfPackagesAll }} </div>
      </template>
    </el-table-column>
    <el-table-column v-if="spoList.length>0&& SOType=='LCL'"  prop="grossWeightAll" label="Gross Weight Can Allocate(KG)">
      <template v-slot="{ row, $index }">
        <div :class="getInputStrClassGrossWeight(row)"> {{ row.grossWeightAll }} </div>
      </template>
    </el-table-column>
    <el-table-column v-if="spoList.length>0&& SOType=='LCL'"  prop="volumeAll" label="Volume Can Allocate(CBM)">
      <template v-slot="{ row, $index }">
        <div :class="getInputStrClassVolume(row)"> {{ row.volumeAll }} </div>
      </template>
    </el-table-column>
  </el-table>

</div>

              <el-table v-if="spoList.length==0" style="margin-top: 15px;margin-bottom: 10px;" :data="form.productDataBook">

                <el-table-column prop="markNumbers" label="Mark&Numbers">
                  <template v-slot="scope">
                    <div style="overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;">{{scope.row.markNumbers}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="productEnglishName" label="Product Name">
                  <template v-slot="scope">
                    <div style="overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;">{{scope.row.productEnglishName}}</div>
                  </template>
                </el-table-column>
                <el-table-column width="130" prop="productChineseName" label="Product Chinese Name">
                  <template v-slot="scope">
                    <div style="overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;">{{scope.row.productChineseName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="hsCode" label="HS Code" min-width="110">
                  <template v-slot="scope">
                    <div>{{scope.row.hsCode}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="numberOfPackages" label="Number Of Packages">
                  <template v-slot="scope">
                    <div>{{scope.row.numberOfPackages}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="packages" width="70" label="Packages">
                  <template v-slot="scope">
                    <div>{{scope.row.packages}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeight" width="90" label="Gross Weight">
                  <template v-slot="scope">
                    <div>{{scope.row.grossWeight}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="volume" width="70" label="Volume">
                  <template v-slot="scope">
                    <div>{{scope.row.volume}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="batteries" label="Batteries">
                  <template v-slot="scope">
                    <div>{{scope.row.batteries==3?'No Batteries':'Has Batteries'}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="dg" width="60" label="DG">
                  <template v-slot="scope">
                    <div>{{scope.row.dg==0?'No':'Yes'}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <div>
              <el-row>
                <el-button @click="addProduct" :disabled="false" size="mini" type="primary">{{ $t("booking.addProduct") }}</el-button>
                <el-button v-show="spoItems&&spoItems.length>0" @click="getFromOrder" size="mini" type="primary">Get From Shipper Booking</el-button>
              </el-row>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical"
                v-for="(item, i) in form.productData.filter(item => item.containerId==null )" :key="'product' + i" class="margin-top" title="" :column="3">
                <template slot="extra">
                  <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">{{
                    $t("search.delete") }}</el-button>
                    <div  v-if="SOProductList.length>0 && SOType=='LCL'" style="width: 200px;margin-left: 10px;" >
                        <el-select @change="choseProduct(item)" filterable clearable v-model="item.soProductId" placeholder="Select Product">
                          <el-option v-for="item in SOProductList" :key="item.id" :label="item.soRef+'-'+item.productEnglishName"
                            :value="item.id" />
                        </el-select>
                    </div>
                </template>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>Mark&Numbers
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                :prop="'productData.' + i + '.markNumbers'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.markNumbers" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>{{ $t('booking.productEnglishName') }}
                  </template>
                  <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                :prop="'productData.' + i + '.productEnglishName'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="Product Chinese Name">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productChineseName" />
                </el-descriptions-item>
                <el-descriptions-item>
                </el-descriptions-item>

                <el-descriptions-item>
                </el-descriptions-item>

                <el-descriptions-item>
                </el-descriptions-item>

                <el-descriptions-item :label="$t('booking.hsCode')">
                  <el-input v-model="item.hscode" maxlength="10" />

                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                      <span style="color:red;">*</span>Number Of Packages
                    </template>
                    <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                  :prop="'productData.' + i + '.numberOfPackages'">
                      <el-input-number v-model="item.numberOfPackages" @change="numberOfPackagesChange(item)"
                                      :controls="false" :precision="0" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="color:red;">*</span>Packages
                    </template>
                    <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                  :prop="'productData.' + i + '.packages'">
                      <el-select filterable v-model="item.packages"  >
                        <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                                  :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="color:red;">*</span>Gross Weight(KG)
                    </template>
                    <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                  :prop="'productData.' + i + '.grossWeight'">
                      <el-input-number v-model="item.grossWeight" @change="grossWeightChange(item)"
                                      :controls="false" :precision="3" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="color:red;">*</span>Volume(CBM)
                    </template>
                    <el-form-item required :rules="[ { required: true, message: ' ' } ]"
                                  :prop="'productData.' + i + '.volume'">
                      <el-input-number v-model="item.volume" @change="volumeChange(item)"
                                      :controls="false" :precision="3" />
                    </el-form-item>
                  </el-descriptions-item>
                <el-descriptions-item>
                </el-descriptions-item>

                <el-descriptions-item label="DG">
                  <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg"
                    active-text="Yes" inactive-text="No">
                  </el-switch>
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="Batteries">
                  <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                    <el-radio :label="2" border>Has batteries</el-radio>
                    <el-radio :label="3" border>No batteries</el-radio>
                  </el-radio-group>
                </el-descriptions-item>

                <el-descriptions-item :label="dict.label"
                  v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value"
                  v-if="item.dg == 1">
                  <el-input v-model="item.hazardousMaterials[dict.value]" />
                </el-descriptions-item>

                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>

                <el-descriptions-item label="Remark">
                  <el-input type="textarea" v-model="item.mark" />
                </el-descriptions-item>
              </el-descriptions>
              </div>
            </el-card>

            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <el-row :gutter="20" type="flex" align="stretch" style="flex-wrap: wrap;height: 600px;">
                  <el-col :span="8" >
<el-descriptions style="padding:15px!important;height: 280px;" :colon="false" class="margin-top" title="Shipper" :column="1"
  size="mini">
  <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
    <template slot="label">
      Name
    </template>
    <el-form-item required prop="shipper" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
      <el-select filterable clearable remote :remote-method="remoteMethodParty1" v-model="form.shipper">
        <el-option v-for="item in parties['Shipper']" :key="item.id" :value="item.id" :label="item.name">
          <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-si-update">
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
    <div>

    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getShipper().address}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getShipper().phone}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getShipper().fax}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getShipper().email}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getShipper().companyUsci }}
    </div>
  </el-descriptions-item>
</el-descriptions>
                  </el-col>
                  <el-col :span="8">
<el-descriptions style="padding:15px!important;height: 280px;" :colon="false" class="margin-top parties-desc" title="Consignee"
  :column="1" size="mini">
  <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
    <template slot="label">
      Name
    </template>
    <el-form-item required prop="consignee" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
      <el-select remote clearable :remote-method="remoteMethodParty2" v-model="form.consignee" filterable>
        <el-option v-for="item in parties['Consignee']" :key="item.id" :value="item.id" :label="item.name">
          <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-si-update">
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
    <div style="padding:6.5px 0px">
      {{getConsignee().address}}
    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getConsignee().phone}}
    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getConsignee().fax}}
    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getConsignee().email}}
    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getConsignee().companyUsci }}
    </div>
  </el-descriptions-item>
</el-descriptions>

                  </el-col>
                  <el-col :span="8">
<el-descriptions style="padding:15px!important;height: 280px;" :colon="false" class="margin-top parties-desc" title="Notify Party"
  :column="1" size="mini">
  <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
    <template slot="label">

      Name
    </template>
    <el-form-item required prop="notifyParty" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
      <el-select remote clearable :remote-method="remoteMethodParty3" v-model="form.notifyParty" filterable>
        <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name">
          <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-si-update">
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
    <div style="padding:6.5px 0px">
      {{getNotifyParty().address}}
    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getNotifyParty().phone}}
    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getNotifyParty().fax}}
    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getNotifyParty().email}}
    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getNotifyParty().companyUsci }}
    </div>
  </el-descriptions-item>
</el-descriptions>
                  </el-col>
                  <el-col :span="8">
<el-descriptions style="padding:15px!important;height: 280px;" :colon="false" class="margin-top parties-desc" title="Second Notify"
  :column="1" size="mini">
  <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
    <template slot="label">
      Name
    </template>
    <el-form-item style="border:none;border-bottom:1px solid #ddd;width: 100%;" prop="agreementParty">
      <el-select remote clearable :remote-method="remoteMethodParty3" v-model="form.agreementParty" filterable>
        <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id" :label="item.name">
          <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-si-update">
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
    <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{getAgreementParty().address}}

    </div>
  </el-descriptions-item>

  <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{getAgreementParty().phone}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Fax" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{getAgreementParty().fax}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Email" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getAgreementParty().email}}

    </div>
  </el-descriptions-item>
  <el-descriptions-item label="Enterprise" labelStyle="width: 105px" contentStyle="width: 105px">
    <div style="padding:6.5px 0px">
      {{getAgreementParty().companyUsci }}
    </div>
  </el-descriptions-item>


</el-descriptions>
                  </el-col>
                                  <el-col :span="8" >
                                    <el-descriptions style="padding:15px!important;height: 280px;" :colon="false" class="margin-top" title="Contact Info"
                                      direction="vertical" :column="2" size="mini">
                                      <el-descriptions-item>
                                        <template slot="label">

                                          {{ $t('booking.name') }}
                                        </template>
                                        <el-form-item required prop="name">
                                          <el-input v-model="form.name" />
                                        </el-form-item>
                                      </el-descriptions-item>
                                      <el-descriptions-item>
                                        <template slot="label">

                                          Mobile Phone
                                        </template>
                                        <el-form-item prop="phone">
                                          <el-input v-model="form.phone" @blur="validatePhoneNumber" />
                                        </el-form-item>
                                      </el-descriptions-item>

                                      <!-- <el-descriptions-item>
                                                                                                                                    <template slot="label">

                                                                                                                                      {{ $t('booking.email') }}
                                                                                                                                    </template>
                                                                                                                                    <el-form-item required prop="email" type="email">
                                                                                                                                      <el-input v-model="form.email" @blur="validateEmailAddress" />
                                                                                                                                    </el-form-item>
                                                                                                                                  </el-descriptions-item> -->


                                      <el-descriptions-item>
                                        <template slot="label">
                                          Fax
                                        </template>
                                        <el-form-item prop="fax" type="fax">
                                          <el-input v-model="form.fax" />
                                        </el-form-item>
                                      </el-descriptions-item>



                                      <el-descriptions-item>
                                        <template slot="label">
                                          Business Phone
                                        </template>
                                        <el-form-item prop="fixedPhone" type="fixedPhone">
                                          <el-input v-model="form.fixedPhone" />
                                        </el-form-item>
                                      </el-descriptions-item>

                                      <!-- <el-descriptions-item></el-descriptions-item>
                                                                                                                                  <el-descriptions-item></el-descriptions-item>
                                                                                                                                  <el-descriptions-item></el-descriptions-item> -->

                                      <!-- <el-descriptions-item></el-descriptions-item> -->
                                      <el-descriptions-item label="Full Name" span="2">
                                        <template slot="label">
                                          <span style="color:red;">*</span>{{ $t('booking.email') }} (Booking)
                                        </template>
                                        <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="email" type="email">
                                          <el-input v-model="form.email" @blur="validateEmailAddress" />
                                        </el-form-item>
                                      </el-descriptions-item>
                                      <el-descriptions-item label="Full Name" span="2">
                                        <template slot="label">
                                          <span style="color:red;">*</span>{{ $t('booking.email') }} (Si)
                                        </template>
                                        <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="siEmail" type="email">
                                          <el-input v-model="form.siEmail" @blur="validateEmailAddress" />
                                        </el-form-item>
                                      </el-descriptions-item>

                                    </el-descriptions>
                                  </el-col>
              </el-row>



            </el-card>

            <!-- CNNGB港口的contianer -->
            <el-card style="border-radius: 0px!important;margin: 15px 0px;margin-bottom: 30px;">
              <el-form ref="siForm" :model="form" label-width="210px" label-position="right" :show-message="false">
                <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">Containers
                  <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo" ref="upload"
                             action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="beforeUploadContainers1" :show-file-list="false"
                             >
                    <el-button size="mini" type="text"><i class="el-icon-plus"></i>Upload</el-button>
                  </el-upload>
                  <el-button @click="downloadImportTemplate1()" size="mini" type="text"><i class="el-icon-plus"></i>Download
                    Template</el-button>
                  <el-button @click="addContainers" size="mini" type="text">
                    <i class="el-icon-plus"></i>
                    {{ $t("booking.addContainers") }}
                  </el-button>
                </div>
                <el-table :data="form.containers"  border style="margin-top: 15px;margin-bottom: 10px;"
                          class="shipmentContainers-css" default-expand-all>

                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div style="margin-left:50px">
                        <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important" :colon="false"
                                         direction="vertical" v-for="(item, index) in scope.row.productData" :key="index"
                                         class="margin-top" title="" :column="8">
                          <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''"  :span="2">
                            <el-form-item required label="" :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                              <el-input type="textarea" v-model="item.productEnglishName"
                                        maxlength="1500" show-word-limit
                                        @input="item.productEnglishName = filterChinese1(item.productEnglishName)" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''" labelStyle="width: 150px;">
                            <el-form-item required  label=""  :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                              <el-input style="width: 150px;" v-model="item.hscode" maxlength="10"/>
                            </el-form-item>

                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                            <el-form-item required label="" :prop="'containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">

                              <el-input-number
                                v-model="item.numberOfPackages" :controls="false" :precision="0" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                            <el-form-item required label="" :prop="'containers.' + scope.$index + '.productData.' + index + '.packages'">

                              <el-select filterable v-model="item.packages" placeholder="">
                                <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label"
                                           :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                            <el-form-item required label="" :prop="'containers.' + scope.$index + '.productData.' + index + '.grossWeight'">

                              <el-input-number
                                v-model="item.grossWeight" :precision="3" :controls="false" />
                            </el-form-item>

                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                            <el-form-item required label="" :prop="'containers.' + scope.$index + '.productData.' + index + '.volume'">
                              <el-input-number v-model="item.volume"
                                               :precision="3" :controls="false" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">
                              <el-button v-if="index == 0" type="text" @click="addProduct1(scope.row.productData)"><i
                                class="el-icon-plus"></i>Add
                                Product</el-button>
                            </template>
                            <el-button size="mini" type="text" icon="el-icon-delete"
                                       @click="handleDelete1(scope.row.productData, index)">{{ $t("search.delete") }}</el-button>
                          </el-descriptions-item>
                        </el-descriptions>
                        <div style="width:100%;margin-top: 10px;margin-left: 10px; ">
                          <el-row>
                            <el-col :span="6">
                              <b>Total Gross Weight:</b>
                              {{  scope.row.productData==undefined?0:  scope.row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0),
                              0).toFixed(3) }}
                            </el-col>
                            <el-col :span="6">
                              <b>Total CBM:</b>
                              {{  scope.row.productData==undefined?0:  scope.row.productData.reduce((sum, item) => sum + (Number(item?.volume) || 0), 0).toFixed(3)
                              }}
                            </el-col>
                            <el-col :span="6">
                              <b>Total Number of Packages:</b>
                              {{  scope.row.productData==undefined?0:  scope.row.productData.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0), 0)
                              }}
                            </el-col>
                            <el-col :span="6">
                              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteContainer(scope.$index)">{{ $t("search.delete") }}</el-button>
                            </el-col>
                          </el-row>
                        </div>
                      </div>



                    </template>
                  </el-table-column>

                  <el-table-column prop="date" label="SOC" width="50">
                    <template v-slot="scope">
                      <el-checkbox v-model="scope.row.soc"></el-checkbox>
                    </template>
                  </el-table-column>
                 <!-- <el-table-column label="Container Type" prop="containerType" width="100">
                   <template v-slot="scope">
                     {{ scope.row.containerType }}
                   </template>
                 </el-table-column> -->

                <!-- <el-table-column label="Sub Container" width="100">
                                    <template v-slot="scope">
                                      <el-select v-model="scope.row.subContainerType" clearable filterable
                                                 @change="(value) => subContainerTypeChange1(i, value)">
                                        <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"
                                                   :key="item.type"></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column> -->

                <el-table-column prop="containerType" label="Container Type"  min-width="100">
                  <template v-slot="scope">
                    <el-select v-model="scope.row.containerType" filterable clearable>
                      <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type" :key="item.type"></el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column label="Sub Container">
                  <template v-slot="scope">
                    <el-select v-model="scope.row.subContainerType" clearable filterable
                      :prop="'containers.' + scope.$index + '.subContainerType'" >
                      <el-option label="Yes" value="Yes"></el-option>
<!--                      <el-option label="No" value="No"></el-option>-->
                    </el-select>
                  </template>
                </el-table-column>

                  <el-table-column label="Container No" width="150" >
                    <template v-slot="scope">
                      <el-form-item required :prop="'containers[' +  scope.$index + '].containerNo'" label-width="0px" style="margin-bottom: 0px!important;">
                        <el-input v-model="scope.row.containerNo" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Container Seal Number" width="150">
                    <template v-slot="scope">

                                                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                                            :prop="'containers.' + scope.$index + '.containerSealNumber'">
                                                            <el-input v-model="scope.row.containerSealNumber"
                                                              @blur="scope.row.containerSealNumber = $event.target.value.trim()" />
                                                          </el-form-item>
                    </template>
                  </el-table-column>

                <el-table-column label="Tare Weight(KG)">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.tareWeight'">
                      <el-input-number v-model="scope.row.tareWeight" :precision="3" :controls="false" />
                    </el-form-item>
                  </template>
                </el-table-column>



                <el-table-column label="VGM(KG)">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;border-width: 0;" :prop="'containers.' + scope.$index + '.vgm'">
                      <div>{{ sumVGM(scope.row) }}</div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="packageMethod" label="FCL/LCL" min-width="80">
                  <template v-slot="scope">
                    <el-select placeholder="" v-model="scope.row.packageMethod">
                      <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :label="item.label"
                        :value="item.value" :key="item.value" />
                    </el-select>
                  </template>
                </el-table-column>


                  <el-table-column label="Marks&Numbers">
                    <template v-slot="scope">
                      <el-input type="textarea" placeholder="Marks&Numbers" v-model="scope.row.remark" />
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width:100%;margin-top: 10px;margin-left:10px">
                  <el-row>
                    <el-col :span="6">
                      <b>Total Gross Weight:</b>
                      {{ totalWeight1().toFixed(3) }}
                    </el-col>
                    <el-col :span="6">
                      <b>Total CBM:</b>
                      {{ totalCBM1().toFixed(3) }}
                    </el-col>
                    <el-col :span="6">
                      <b>Total Number of Packages:</b>
                      {{ totalVolum1() }}
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-card>
            <!-- end -->

          </el-col>

        </el-row>


        <el-row style="text-align: center">
<!--          <el-button type="primary" v-if="showSIDraft" @click="submit(4)" :loading="loadingSaveBut">Save Draft-->
<!--          </el-button>-->

          <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.pushSi"
            v-hasPermi="['sinotrans-booking']">Book through smartMOOV</el-checkbox></span>
          <el-button size="mini" @click="submit(2)" v-if="form.status==2" type="primary" :loading="loadingSaveBut">Save
            Update</el-button>
          <el-button size="mini" @click="submit(0)" type="primary" :loading="loadingSaveBut">{{
            $t("booking.submit")
            }}</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
  .shipmentRouters-css .el-form-item__content {
    margin: 0 !important;
  }

  .shipmentRouters-css label.el-form-item__label {
    display: none;
  }
  .Red {
  color: #EA0000 !important;
}
</style>

<script>
  import { listDept } from "@/api/system/dept";
import {
    create,
    si,
    vgm,
  findDropDownListFromCt,
  shipmentDetails,
    updateShipment,
    submitSISinotrans,
    downloadContainersTemplate, exportShipmentDetails
} from '@/api/shipment/shipment'
  import { getUserProfile } from "@/api/system/user";
  import { getClpSoList } from "@/api/shipment/clpSo";
  import { getContainerList } from "@/api/system/container";
  import { createDeptApply } from "@/api/system/deptApply";
  import { getVesselList } from "@/api/system/vessel";
  import { getFileList, deleteFile } from "@/api/infra/file";
  import { getCraNumList, downloadSinotransContainersTemplate } from "@/api/shipment/shipment";
  import { getHsCodeListByCode } from "@/api/system/hsCode";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
  import { getBaseHeader } from "@/utils/request";
  import { getBookingList } from "@/api/booking/booking";
  import { getItemList } from "@/api/order/item";
  import { getProductList } from "@/api/system/product";
  import { getHeaderList } from "@/api/order/header";
  import { getListByShipmentId } from "@/api/booking/booking";
  import { createNote } from "@/api/shipment/note";
  import { getAllocationWeekData } from "@/api/booking/contract";
  import { getContractListTenantIgnore } from "@/api/booking/contract";
  import { getPortPage } from "@/api/system/port";
  import { getShippingOrderByShipment, getNotShipmentOrderPage, updateShippingRelationship, getShippingOrderListByIds } from "@/api/shipping/order";
  import { getContainerTypeCodeList } from "@/api/system/containerTypeCode";
    import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'

import XLSX from "xlsx";
  import { DICT_TYPE } from '@/utils/dict'

export default {
    name: "Shipment",
    components: {},
    data() {
      return {
        showSIDraft: false,
        allocationWeekList: [],
        loadingSaveBut: false,
        form: {
          type: "Merchant",
          containers: [],

          shipmentRouters: [],
          productData: [],
          productDataBook: [],
          contractType: "CY/CY",
          phone: "",
          email: "",
          fromShipperBooking: false,
        },
        phoneError: "",
        emailError: "",
        portOptions: [],
        containerOptions: [],
        parties: {
          'Notify Party': [],
          'Consignee': [],
          'Shipper': [],
        },
        partiesMap: {},
        tipsMail: "Tailwind.CS@kblinersh.com",
        open: false,
        partyForm: {
          partyRole: [],
        },
        vesslMap: {},
        reverseVesslMap: {},
        vesselList: [],
        vesselListLes: [],
        hsCodeList: [],
        url: "",
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
        activeName: 'second',
        cancelReasonFlag: false,
        downloadLoading: false,
        shipmentNote: {
          cancelCode: null,
          cancelSubCode: null,
          cancelRemark: null,
        },
        noteView: false,
        craList: [],
        chosePaymentLocationVisable: false,
        paymentLocationList: [],
        queryParams: {
          pageNo: 1,
          total: 0,
          pageSize: 10,
        },

        spoList: [],
        SOList: [],
        SOProductList: [],
        SOType: '',
        containerTypeList: [],
        showCNNGBSI:false,
        containersHeaders: [
          'Container Type',
          'Container No',
          'Container Seal Number',
          'Marks&Numbers',
          'Tare Weight',
          'FCL/LCL',
          'SOC(TRUE/FALSE)',
          'Product Name',
          'HS code',
          'Number Of Packages',
          'Packages',
          'Gross Weight(KG)',
          'Volume(CBM)',
        ],
        isPepco: false,
        spoItems: [],
        shipmentBookingNumber: null

      };
    },
    computed: {
      leftoverGrossWeight() {
        return this.form.productData.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue.grossWeight);
        }, 0) - this.form.containers.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue.grossWeight);
        }, 0).toFixed(4)
      },
      leftoverNumbersOfPackage() {
        return this.form.productData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.numberOfPackages;
        }, 0) - this.form.containers.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue.numbersOfPackage);
        }, 0).toFixed(4)
      },
      leftoverVolume() {
        return this.form.productData.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue.volume);
        }, 0) - this.form.containers.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue.volume);
        }, 0).toFixed(4)
      },
    },
    created() {
      var data = getBaseHeader();
      this.uploadHeaders = data;
      this.url = process.env.VUE_APP_BASE_API;
      this.getPortList();
      this.getContainerList();
      this.getVesselList();
      this.getContractListTenantIgnore();
      this.getParties({ partyRole: "Shipper" });
      this.getParties({ partyRole: "Consignee" });
      this.getParties({ partyRole: "Notify Party" });
      this.getParties({ partyRole: "Agreement Party" });
      this.getDropDownValues();
      var shipmentNoteView = this.getDictDatas(this.DICT_TYPE.SHIPMENT_NOTE_VIEW)
      if (shipmentNoteView && shipmentNoteView.length > 0) {
        for (var c = 0; c < shipmentNoteView.length; c++) {
          if (shipmentNoteView[c].value == localStorage.getItem('TENANT_ID')) {
            this.noteView = true
            break;
          }
        }
      }
      var ids = this.$route.query.id;

      if (ids) {
        this.getShipmentDetails(ids);
      } else {
        this.form.productData.push({
          batteries: 3,
          fileList: [],
          uploadData: {},
          dg: 0,
          hazardousMaterials: {},
        });
      }
      this.getContainerTypeCodeList1();
      this.getUserInfo();
    },
    methods: {
      validateContainerNO(value) {
        const regex = /^[A-Za-z]{4}\d{7}$/
        if (!regex.test(value)) {
          this.$notify.error("The first four digits of \"containerNo\" must be capital letters, and the last seven digits must be numbers!")
          return false;
        }
        return true
      },
      getUserInfo() {
        var vm = this;
        getUserProfile().then((response) => {
          vm.userProfile = response.data;
        });
      },

      getShipper() {
        var party = { "address": "-", "email": "-", "phone": "-", "fax": "-", "companyUsci": "-" };
        if (this.form.shipper && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
          var obj = this.parties['Shipper'].find((item => item.id == this.form.shipper))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          return obj
        }
        return party
      },
      getNotifyParty() {
        var party = { "address": "-", "email": "-", "phone": "-", "fax": "-", "companyUsci": "-" };
        if (this.form.notifyParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
          var obj = this.parties['Notify Party'].find((item => item.id == this.form.notifyParty))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          return obj
        }
        return party
      },
      getConsignee() {
        var party = { "address": "-", "email": "-", "phone": "-", "fax": "-", "companyUsci": "-" };
        if (this.form.consignee && this.parties['Consignee'] && this.parties['Consignee'].length > 0) {
          var obj = this.parties['Consignee'].find((item => item.id == this.form.consignee))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          return obj
        }
        return party
      },
      getAgreementParty() {
        var party = { "address": "-", "email": "-", "phone": "-", "fax": "-", "companyUsci": "-" };
        if (this.form.agreementParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
          var obj = this.parties['Notify Party'].find((item => item.id == this.form.agreementParty))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          return obj
        }
        return party
      },



      chosePaymentLocation() {
        getPortPage(this.queryParams).then((res) => {
          this.paymentLocationList = res.data.list
          this.queryParams.total = res.data.total
        })
        this.chosePaymentLocationVisable = true
      },
      chosePaymentLocationHandle(row, column, cell, event) {
        this.$set(this.form, 'paymentLocation', row.portCode)
        this.chosePaymentLocationVisable = false;
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
        var queryParams = {};
        getContractListTenantIgnore(queryParams).then(response => {
          this.craList = []
          for (var t of response.data) {
            t.contractNo = t.contractNo.trim();
            this.craList.push(t)
          }
        });
      },
      getAllocationWeekList() {
        console.log(this.form.contractNumber)

        if (this.form.contractNumber && this.form.carrier) {
          getAllocationWeekData(this.form.carrier, this.form.contractNumber).then((response) => {
            console.log(response)
            this.allocationWeekList = response.data

          })
        }
      },
      changeSelCancelReason(e) {
        let vm = this;
        this.cancelReasonFlag = false;
        for (var val of vm.selCancelReason) {
          if (e == val.enumId && val.optionIndicator == "t") {
            vm.cancelReasonFlag = true;
            return;
          }
        }
      },
      getDropDownValues() {
        findDropDownListFromCt().then((response) => {
          if (response && response.data) {
            if (response.data.cancelReasonList)
              this.selCancelReason = response.data.cancelReasonList;
            if (response.data.cancelCategoryList)
              this.selCancelCategory = response.data.cancelCategoryList;
          }
        });
      },
      clearSelCancelCategory() {
        console.log(this.form)
        this.selectCancelReason = [];
        this.shipmentNote.cancelCode = null;
        this.shipmentNote.cancelSubCode = null;
      },
      getCancelReason(prov) {
        let tempCancelReason = [];
        for (var val of this.selCancelReason) {
          if (prov == val.parentEnumId) {
            tempCancelReason.push({ description: val.description, enumId: val.enumId });
          }
        }
        this.selectCancelReason = tempCancelReason;

        this.shipmentNote.cancelSubCode = null;
      },
      // 删除图片
      changeCarrier(value) {
        this.$set(this.form, "contractNumber", "");

        if (value == "TSHG") {
          this.setCra();
          this.craFlag = true;
        } else {
          this.craFlag = false;
        }
        this.remoteGetCraNum()
      },
      remoteMethodParty1(query) {
        if (query !== "" && query.length >= 3) {
          this.getParties({ partyRole: "Shipper", name: query });
        } else {
          this.$set(this.parties, "Shipper", []);
        }
      },
      remoteMethodParty2(query) {
        if (query !== "" && query.length >= 3) {
          this.getParties({ partyRole: "Consignee", name: query });
        } else {
          this.$set(this.parties, "Consignee", []);
        }
      },
      remoteMethodParty3(query) {
        if (query !== "" && query.length >= 3) {
          this.getParties({ partyRole: "Notify Party", name: query });
        } else {
          this.$set(this.parties, "Notify Party", []);
        }
      },
      remoteMethodParty4(query) {
        if (query !== "" && query.length >= 3) {
          this.getParties({ partyRole: "Agreement Party", name: query });
        } else {
          this.$set(this.parties, "Agreement Party", []);
        }
      },
      remoteGetCraNum() {
        //query Allocation  etd week
        this.getAllocationWeekList()

        var query = this.form.contractNumber;
        if (this.form.carrier != 'TSHG') {

          return
        }
        if (query !== "" && query.length >= 4) {
          getCraNumList(query).then((response) => {
            this.craNumList = response.data;
            if (this.craNumList.length > 0) {
              if (this.craNumList[0] && this.craNumList[0].ap) {
                var req = {
                  partyRole: "Agreement Party",
                  customerCode: this.craNumList[0].ap,
                };
                this.getParties(req, true);
              }
            }
            for (var i = 0; i < this.craNumList.length; i++) {
              if (this.cra_pol.indexOf(this.craNumList[i].origin) == -1) {
                this.cra_pol.push(this.craNumList[i].origin);
              }
              if (this.cra_pod.indexOf(this.craNumList[i].delivery) == -1) {
                this.cra_pod.push(this.craNumList[i].delivery);
              }
              if (this.cra_origin.indexOf(this.craNumList[i].loadPort) == -1) {
                this.cra_origin.push(this.craNumList[i].loadPort);
              }
              if (this.cra_disch.indexOf(this.craNumList[i].dischPort) == -1) {
                this.cra_disch.push(this.craNumList[i].dischPort);
              }
              if (this.cra_contaier_type.indexOf(this.craNumList[i].eqpType) == -1) {
                this.cra_contaier_type.push(this.craNumList[i].eqpType);
              }
            }
            this.setCra();
          });
        } else {
          this.cra_contaier_type = [];
          this.cra_pol = [];
          this.cra_pod = [];
          this.cra_origin = [];
          this.cra_disch = [];
        }
      },
      setCra() {

      },
      handleRemove(file, fileList) {
        if (file.id) {
          var vm = this;
          this.$modal
            .confirm(
              'Are you sure to delete the data item with the file "' + file.name + '"?'
            )
            .then(function () {
              deleteFile(file.id).then((response) => {
                const findex = fileList.map((f) => f.name).indexOf(file.name);
                if (findex > -1) {
                  fileList.splice(findex, 1);
                }
              });
            })
            .then(() => {
              this.$modal.msgSuccess("Successfully deleted");
            })
            .catch(() => { });
          return false;
        } else {
          return true;
        }
      },
      // 预览 / 下载
      handlePictureCardPreview(file) {
        const link = document.createElement("a");
        link.href = file.url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      isNullOrEmpty(value) {
        return value === null || value.trim() === '';
      },

      getShipmentDetails(id) {
        shipmentDetails(id).then((response) => {
          if (response.data) {
            this.shipmentBookingNumber = response.data.shipmentBookingNumber
            this.form = Object.assign({}, this.form, response.data);
            if (this.isNullOrEmpty(response.data.siEmail)) {
              getUserProfile().then((response) => {
              this.$set(this.form, 'siEmail', response.data.email)
             });
            }

            this.isPepco = this.form.fromShipperBooking
            if ((this.form.originPort == 'CNNGB' && this.form.sinotrans || this.form.pushBookingFlag) && this.form.originPort != 'CNTAO'&&this.form.originPort != 'CNTXG') {
              this.showCNNGBSI = true
            }

            //shipping Order 列表
            if (this.form.fromShippingOrder) {
              this.getShippingOrderList(this.form.id)
            }

            if (this.form.status == 4) {
              this.showSIDraft = true
            }
            this.form.shipmentRouters = response.data.routerDOList;

            var preContainers = response.data.containerDOList.filter(item => item.type == 2)

            var siList = response.data.containerDOList.filter(item => item.type == 1)
            if (siList.length > 0) {
              this.showSIDraft = false
            }

            for (var i = 0; i < response.data.containerDOList.length; i++) {
              var d = response.data.containerDOList[i];
              if (d.type == 1 && this.form.siDate != null || d.type == 4) {
                if(d.type == 4 && this.form.fromShippingOrder) {
                  // var packageType = ''
                  // var numbersOfPackage = 0
                  // for (var product of response.data.productDOList) {
                  //   if(product.containerId== d.id && product.type == 4) {
                  //     numbersOfPackage += product.numberOfPackages
                  //     packageType = product.packages
                  //   }
                  // }
                  // d.numbersOfPackage = numbersOfPackage
                  // d.packageType = packageType
                  if(this.form.shippingList.length>0) {
                    var shipping = this.form.shippingList[0]
                    d.packageMethod = shipping.shipmentType
                  }

                }
                this.form.containers.push(JSON.parse(JSON.stringify(d)))
              } else if (d && d.type == 0 && this.form.siDate == null && preContainers.length == 0
                && response.data.containerDOList.filter(item => (item.type == 1 || item.type == 4)).length == 0) {
                for (var j = 0; j < d.numbers; j++) {
                  this.form.containers.push({
                    containerType: d.containerType,
                    soc: d.soc,
                    containerNo: '',
                    containerSealNumber: '',
                    remark: '',
                    numbersOfPackage: 0,
                    grossWeight: 0,
                    volume: 0,
                    packageType: '',
                    packageMethod: 'FCL'

                  });
                }
              }
            }

            var restSIList = response.data.containerDOList.filter(item => item.type == 0)
            if (this.form.containers.length == 0) {
              for (var i = 0; i < restSIList.length; i++) {
                var d = response.data.containerDOList[i];
                for (var j = 0; j < d.numbers; j++) {
                  this.form.containers.push({
                    containerType: d.containerType,
                    soc: d.soc,
                    containerNo: '',
                    containerSealNumber: '',
                    remark: '',
                    numbersOfPackage: 0,
                    grossWeight: 0,
                    volume: 0,
                    packageType: '',
                    packageMethod: 'FCL'
                  });
                }
              }
            }

            if (preContainers.length > 0 && this.form.siDate == null) {
              for (var i = 0; i < preContainers.length; i++) {
                preContainers[i].id = null;
              }
              this.form.containers = JSON.parse(JSON.stringify(preContainers))
            }
            if (this.form.siDate == null && this.$auth.hasPermi("shipment:clp-so:query")) {
              getClpSoList({ shipmentBookingNumber: response.data.shipmentBookingNumber }).then((res2) => {
                var containers = {}
                for (var j = 0; j < res2.data.length; j++) {
                  if (!containers[res2.data[j].containerNo]) {
                    containers[res2.data[j].containerNo] = {
                      containerNo: res2.data[j].containerNo,
                      containerSealNumber: res2.data[j].sealNo,
                      containerType: res2.data[j].containerType,
                      numbersOfPackage: Number(res2.data[j].qty),
                      grossWeight: Number(res2.data[j].grossWeight),
                      volume: Number(res2.data[j].cbm)
                    }
                  } else {
                    containers[res2.data[j].containerNo].numbersOfPackage += Number(res2.data[j].qty)
                    containers[res2.data[j].containerNo].grossWeight = Number(res2.data[j].grossWeight)
                    containers[res2.data[j].containerNo].volume = Number(res2.data[j].cbm)
                  }
                }
                var newArr = []
                for (var key in containers) {
                  newArr.push(containers[key])
                }
                if (newArr.length != 0) {
                  this.form.containers = JSON.parse(JSON.stringify(newArr))
                }
              })
            }
            console.log("response.data.productDOList", response.data.productDOList)
            for (var i = 0; i < response.data.productDOList.length; i++) {
              var d = response.data.productDOList[i];
              if (d && d.type == 0 && this.form.siDate == null) {
                if (d.hazardousMaterials == "{}" || null == d.hazardousMaterials) {
                  d.dg = 0;
                } else {
                  d.dg = 1;
                }
                d.batteries = Number(d.batteries);
                d.hazardousMaterials = JSON.parse(d.hazardousMaterials);
                d.fileList = [];
                d.uploadData = {};
                this.form.productData.push(JSON.parse(JSON.stringify(d)));
                this.form.productDataBook.push(JSON.parse(JSON.stringify(d)));
              }
            }
            if (this.form.siDate != null || this.form.status == 4) {
              this.form.productData = response.data.productDOList.filter(item => item.type == 1 || item.type == 4);
              this.form.productDataBook = response.data.productDOList.filter(item => item.type == 0);

            }
              for (var container of this.form.containers) {
                container.productData = []
                for (var i = 0; i < response.data.productDOList.length; i++) {
                  var d = response.data.productDOList[i];
                  if(d.containerId!=null && d.containerId== container.id) {
                    container.productData.push(d)
                  }
                }
                if(container.productData ==undefined || container.productData==null||  container.productData.length==0) {
                  container.productData = [{}]
                }
              }
            if(this.showCNNGBSI) {
              if(this.form.ams==null) {
                this.form.ams = 'NO'
              }
              if (this.form.aci == null) {
                this.form.aci = 'NO'
              }
            }
            this.form.containers = JSON.parse(JSON.stringify(this.form.containers))

            console.log(this.form.containers)

            //this.flag

            for (var i = 0; i < this.form.containerDOList.length; i++) {
              if (this.form.containerDOList[i].requireTemperature) {
                this.flag = true
              }
            }
            this.form.shipmentRouters.push({
              pol: response.data.pod,
              etd: null,
              eta: null,
            });
            this.changePol(response.data.pol)
            this.changePod(response.data.pod)

            this.$set(this.form, "pol", response.data.pol);
            this.$set(this.form, "pod", response.data.pod);
            this.$set(this.form, "originPort", response.data.originPort);
            this.$set(this.form, "destinationPort", response.data.destinationPort);
          }
        });
      },
      changeDG(item) {
        this.$set(item,'tempaax',1)
        this.$delete(item, 'tempaax');
        if (item.dg == 0) {
          this.$set(item, "hazardousMaterials", {});
        } else {
          this.$set(item, "batteries", 3);
        }
        this.$nextTick(() => {
          // 在DOM更新后执行其他操作 不然switch val 不会改变
          var tempa = this.form.name;
          this.form.name = tempa + " ";
          this.form.name = tempa;
        });
      },
      validatePhoneNumber() {
        const phoneNumber = this.form.phone;
        // 自定义验证逻辑
        if (
          !/^\d+$/.test(phoneNumber) ||
          phoneNumber.length < 8 ||
          phoneNumber.length > 15
        ) {
          this.phoneError = "Please enter a valid phone or landline number";
        } else {
          this.phoneError = "";
        }
      },
      validateEmailAddress() {

        const siEmailAddress = this.form.siEmail;
        // 自定义验证逻辑
        // 例如，验证是否是有效的电子邮件地址
        if (!isValidEmailAddress(siEmailAddress)) {
          this.emailError = "Please enter a valid siEmail address";
        } else {
          this.emailError = "";
        }


        const emailAddress = this.form.email;
        // 自定义验证逻辑
        // 例如，验证是否是有效的电子邮件地址
        if (!isValidEmailAddress(emailAddress)) {
          this.emailError = "Please enter a valid email address";
        } else {
          this.emailError = "";
        }
      },
      handleOptionChange(value) {
        var arr = [];
        for (var i = 0; i < this.containerOptions.length; i++) {
          if (this.containerOptions[i].isReeferContainer == "Yes") {
            arr.push(this.containerOptions[i].type);
          }
        }
        var flag = false;
        for (var i = 0; i < this.form.containers.length; i++) {
          if (arr.indexOf(this.form.containers[i].containerType) > -1) {
            flag = true;
            break;
          }
        }
        this.flag = flag;
      },
      remoteMethod(query) {
        if (query !== "" && query.length >= 3) {
          getVesselList({ vesselCode: query }).then((response) => {
            this.vesselListLes = response.data;
          });
          this.loading = true;
        } else {
          this.vesselListLes = [];
        }
      },
      remoteMethod2(query) {
        if (query !== "" && query.length >= 3) {
          getVesselList({ vesselName: query }).then((response) => {
            this.vesselListLes = response.data;
          });
          this.loading = true;
        } else {
          this.vesselListLes = [];
        }
      },
      setShipmentRouter() {
        if (!this.$route.query.schdule) {
          return;
        }
        var schdule = JSON.parse(atob(this.$route.query.schdule));
        this.$set(this.form, "carrier", schdule.carrier);
        this.form.shipmentRouters[0].etd = schdule.etd;
        this.form.shipmentRouters[0].eta = schdule.eta;

        this.form.shipmentRouters[0].transportMeanName = schdule.vn;
        this.form.shipmentRouters[0].identification = schdule.vc;
        this.form.shipmentRouters[0].voyage = schdule.vo;

        this.form.shipmentRouters[0].pol = schdule.pol;
        this.form.shipmentRouters[1].pod = schdule.pod;
      },
      changeVesselCode(item) {
        var obj = this.vesselListLes.find(
          (element) => element.vesselCode == item.identification
        )
        if (obj) {
          item.transportMeanName = obj.vesselName
          item.imo = obj.imo
        } else {
          item.imo = null
        }

        this.$set(this.form, 'tempaax', 1)
        this.$delete(this.form, 'tempaax');
      },
      changeVesselName(item) {
        var obj = this.vesselListLes.find(
          (element) => element.vesselName == item.transportMeanName
        )
        if (obj) {
          item.identification = obj.vesselCode;
          item.imo = obj.imo;
        } else {
          item.identification = null
          item.imo = null
        }
        this.$set(this.form, 'tempaax', 1)
        this.$delete(this.form, 'tempaax');

      },
      getVesselList() { },
      submitForm() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            var data = JSON.parse(JSON.stringify(this.partyForm));
            data.partyRole = "," + data.partyRole.join(",") + ",";
            data.status = 0;
            createDeptApply(data).then((response) => {
              this.$modal.msgSuccess("Success");
              this.open = false;
            });
          }
        });
      },
      applyNewParty() {
        this.open = true;
      },
      addProduct() {
        this.form.productData.push({
          batteries: 3,
          fileList: [],
          uploadData: {},
          hazardousMaterials: {},
        });
      },
      changeBatteries(item) {
        if (item.batteries == 3) {
          item.batteriesLevelTow = [];
        } else {
          this.$set(item, "notToAll", false);
        }
      },
      changeNotToAll(item) {
        if (item.notToAll) {
        }
      },
      getParties(obj, setAp) {
        var vm = this;
        listDept(obj).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.$set(
              vm.partiesMap,
              response.data[i].id,
              response.data[i].name +
              "\n" +
              (response.data[i].country == null ? "" : response.data[i].country) +
              " " +
              (response.data[i].address == null ? "" : response.data[i].address)
            );
          }

          if (setAp) {
            this.$set(this.form, "agreementParty", response.data[0].id);
          }
          this.$set(this.parties, obj.partyRole, response.data);
        });
      },
      changePol(value) {
        // this.$set(this.form, "originPort", "");
        this.form.shipmentRouters[0].pol = value;
        this.form = JSON.parse(JSON.stringify(this.form))
      },
      changePod(value) {
        // this.$set(this.form, "destinationPort", "");
        this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value;
        this.form = JSON.parse(JSON.stringify(this.form))
      },
      submit(status) {
        // 统一关掉 loading 的辅助函数
        const stopLoading = () => { this.loadingSaveBut = false };
        // 如果已经有接口在跑，直接返回，避免重复提交
        if (this.loadingSaveBut) return;
        console.log('this.form.productData', JSON.stringify(this.form.productData));
        console.log('this.form.containers', JSON.stringify(this.form.containers));
        // 添加 hscode 校验 统一校验所有产品数据
        const allProducts = [
          ...this.form.productData.filter(item => item.containerId === null),
          ...this.form.containers.flatMap(c => c.productData || [])
        ];
        console.log('allProducts', allProducts);
        for (const product of allProducts) {
          if (!product.hscode || (product.hscode && !this.validateHsCodeFormat(product.hscode))) {
            this.$message.warning(`HS Code: ${product.hscode} must be exactly 10 digits`);
            stopLoading();
            return;
          }
        }
      console.log(status)
          this.$refs["siForm"].validate((valid) => {
            if (valid) {
              console.log(valid)
               this.submitsi(status)
            }else {
              return false;
            }
          });
      },
      getLabel(code, type) {
        var item = this.portOptions.find((item) => item.code == code);
        if (item) {
          return item.name;
        } else {
          return code;
        }
      },
      getContainerList() {
        getContainerList().then((response) => {
          this.containerOptions = response.data;
        });
      },
      remoteMethod3(query) {
        if (query !== "" && query.length >= 3) {
          getVesselList({ imo: query }).then((response) => {
            this.vesselListLes = response.data;
          });
          this.loading = true;
        } else {
          this.vesselListLes = [];
        }
      },
      changeVesselIMO(item) {
        var obj = this.vesselListLes.find(
          (element) => element.imo == item.imo
        )
        if (obj) {
          item.identification = obj.vesselCode
          item.transportMeanName = obj.vesselName
        }

        this.$set(this.form, 'tempaax', 1)
        this.$delete(this.form, 'tempaax');
      },
      handleDelete(index) {
        this.form.productData.splice(index, 1);
      },
      handleDeleteContainer(index) {
        // 只要要包含一条Container数据
        if (this.form.containers.length < 2) {
          this.$message.warning('Carrier SI must retain at least one Container record.')
          return
        }
        // 删除确认
        this.$confirm('Are you sure you want to delete this Container and its corresponding Product information?', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.form.containers.splice(index, 1);
        }).catch(() => {})
      },
      addContainers() {
        this.form.containers.push({
          containerType: null,
          soc: null,
          containerNo: '',
          containerSealNumber: '',
          remark: '',
          numbersOfPackage: 0,
          grossWeight: 0,
          volume: 0,
          packageType: '',
          packageMethod: 'FCL',
          productData: [{
            grossWeight: undefined,
            numberOfPackages: undefined,
            volume: undefined
          }]
        });
      },
      getPortList() {
        getOriginDeliveryList().then((response) => {
          this.portOptions = response.data;
          this.setShipmentRouter();
        });
      },

      selectBlur(item) {
        for (var i = 0; i < this.hsCodeList.length; i++) {
          if (item.hscode == this.hsCodeList[i].hsCode) {
            item.productEnglishName = this.hsCodeList[i].productEnglishName;
          }
        }
      },
      selectClear() { },

      remoteGetHsCode(query) {
        if (query !== "" && query.length >= 2) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.getHsCodeListByCode(query);
            this.options = this.hsCodeList.filter((item) => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },

      getHsCodeListByCode(hscode) {
        getHsCodeListByCode(hscode).then((response) => {
          this.hsCodeList = response.data;
        });
      },
      containersUpload(file) {
        var vm = this;
        this.file2Xce(file).then(tabJson => {
          if (tabJson && tabJson.length > 0) {
            this.xlsxJson = tabJson
            console.log(tabJson)
            vm.form.containers = []
            var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
            for (var i = 0; i < this.xlsxJson[0].sheet.length; i++) {
              var index = i
              var item = this.xlsxJson[0].sheet[i]
              console.log(item)
              var errData = {}
              errData['index'] = index

              var container = {}
              container.containerType = (item['Container Type'] + '')?.trim()
              container.containerNo = (item['Container No.'] + '')?.trim()
              container.containerSealNumber = item['Container Seal No.']
              container.numbersOfPackage = item['Number Of Packages']
              container.grossWeight = item['Gross Weight(KG)']
              container.tareWeight = item['Tare Weight(KG)']
              container.volume = item['Volume(CBM)']
              var excelUnit = item['Package Type']
              if (excelUnit != null) {
                for (var unit of units) {
                  if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
                    container.packageType = unit.value
                  }
                }
              }

              container.packageMethod = item['FCL/LCL']
              var soc = item['SOC(TRUE/FALSE)']
              if (soc != null) {
                if (soc.toLowerCase == 'true' || soc == '1' || soc.toLowerCase == 'yes') {
                  soc = true
                } else {
                  soc = false
                }
              }
              container.soc = soc
              container.remark = item['Remark']
              vm.form.containers.push(container)
            }
            console.log(vm.form.containers)
          }
        })
        this.$refs.upload.clearFiles();
      },
      file2Xce(file) {
        return new Promise(function (resolve, reject) {
          const reader = new FileReader()
          reader.onload = function (e) {
            const data = e.target.result
            this.wb = XLSX.read(data, {
              type: 'binary'
            })
            const result = []
            this.wb.SheetNames.forEach((sheetName) => {
              result.push({
                sheetName: sheetName,
                sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
              })
            })
            resolve(result)
          }
          reader.readAsBinaryString(file.raw)
        })
      },
      downloadTemplate() {
        downloadSinotransContainersTemplate({ 'shipmentId': this.form.id }).then((res) => {
          this.$download.excel(res, "import_template_containers.xlsx");
        })
      },
      getShippingOrderList(shipmentId) {
        getShippingOrderByShipment(shipmentId).then(res => {
          this.spoList = res.data
          this.getShippingOrderListByIds()
        })
      },
      getShippingOrderListByIds() {
        var poIds = this.spoList.map(item => item.id);
        if (this.isPepco) {
          getShippingOrderListByIds(poIds).then(response => {
              var spoListTemp = response.data
            var spoListTemp = response.data
            if(spoListTemp&& spoListTemp.length>0) {
              this.form.shipmentType = spoListTemp[0].shipmentType
            }
            this.spoItems = []
            spoListTemp.forEach(so => {
              var products = so.productDOList
              var product = {id:so.id,soRef:so.soRef}

              if (products && products[0]) {
                product.hscode = products[0].hscode
                product.markNumbers = products[0].markNumbers
                product.productName = products[0].productEnglishName
                product.booked = products[0].numberOfPackages
                product.bookedWeight=products[0].grossWeight
                product.bookedVolume=products[0].volume
              }
              this.spoItems.push(product)
            })
          })
          // getOrderHeadersList({ shippingOrderIds: poIds.join(",") }).then(res => {
          //   console.log(res)
          //   this.spoItems = []
          //   for (var order of res.data) {
          //     var shipping = spoListTemp.filter(item => item.id = order.shippingId)
          //     if (shipping.length > 0) {
          //       // 如果 order.soRef 没有值的时候再塞 edwin
          //       if(!order.soRef){
          //         order.soRef = shipping[0].soRef
          //       }
          //       // order.soRef = shipping[0].soRef
          //       var products = shipping[0].productDOList
          //       console.log(products)
          //       if (products && products.length > 0)
          //         order.hscode = products[0].hscode
          //     }
          //     for (var item of order.items) {
          //       item.soRef = order.soRef
          //       item.orderNumber = order.orderNumber
          //       item.hscode = order.hscode
          //       item.bookedWeight = item.booked * item.outerWeight
          //       item.bookedVolume = item.booked && item.length && item.width && item.height ? Number((item.booked * item.length * item.width * item.height / 1000000)) : 0
          //       this.spoItems.push(item)
          //     }
          //     this.productChange()
          //   }
          // })
          //   .catch(err => {
          //     console.log(err)
          //   })
          // })
        } else {
        this.SOProductList = []
        getShippingOrderListByIds(poIds).then((response) => {
          console.log(response.data)
          this.SOList = response.data
          for (var i = 0; i < this.SOList.length; i++) {
            var so = this.SOList[i]
            console.log(so)
            var data = this.SOList[i].productDOList
                        console.log(so.shipmentType)

            this.SOType = so.shipmentType
            for (var j = 0; j < data.length; j++) {
              var item = data[j]
              item.mark = item.remark
              item.uploadData = {}
              item.fileList = []
              if (item.hazardousMaterials == "{}") {
                item.dg = 0;
              } else {
                item.dg = 1;
              }
              item.batteries = Number(item.batteries);
              if (!item.batteries) item.batteries = 3
              item.soRef = so.soRef
              item.soId = so.id
              item.numberOfPackagesAll = item.numberOfPackages + 0
              item.grossWeightAll = item.grossWeight + 0
              item.volumeAll = item.volume + 0
              item.hazardousMaterials = JSON.parse(item.hazardousMaterials);
              this.SOProductList.push(item)
            }
          }
          this.productChange()
        })
        console.log(this.SOProductList)
      }
      },
      choseProduct(item) {

        var selectSO = this.SOProductList.filter(p => p.id == item.soProductId).shift();
        item.productEnglishName = selectSO.productEnglishName
        item.productChineseName = selectSO.productChineseName
        item.hscode = selectSO.hscode
        item.numberOfPackages = selectSO.numberOfPackagesAll
        item.packages = selectSO.packages
        item.grossWeight = selectSO.grossWeightAll
        item.volume = selectSO.volumeAll
        item.batteries = selectSO.batteries
        item.markNumbers = selectSO.markNumbers
        item.remark = selectSO.remark
        if (selectSO.hazardousMaterials == "{}" || null == selectSO.hazardousMaterials) {
          item.dg = 0;
        } else {
          item.dg = 1;
        }
        item.batteries = Number(selectSO.batteries);
        item.hazardousMaterials = selectSO.hazardousMaterials;

        this.productChange()
      },
      productChange() {

        // 全局的去减；不是单个的去减SOProductList循环
        for (var product of this.SOProductList) {
          product.numberOfPackagesAll = product.numberOfPackages
          product.grossWeightAll = product.grossWeight
          product.volumeAll = product.volume
        }
        console.log('validate productData:', this.form.productData);
        for (let index = 0; index < this.form.productData.length; index++) {
            const product = this.form.productData[index];
            console.log(product)
            var selectSO = this.SOProductList.filter(p => p.id == product.soProductId).shift();
            if(selectSO!=undefined){
              selectSO.numberOfPackagesAll -= product.numberOfPackages
              selectSO.grossWeightAll -= product.grossWeight
              selectSO.volumeAll -= product.volume
            }
        }
        this.SOProductList = JSON.parse(JSON.stringify(this.SOProductList));
      },
      numberOfPackagesChange(item) {
        console.log('numberOfPackagesChange')
        // console.log(item)
        this.productChange()
      },
      grossWeightChange(item) {
        this.productChange()
      },
      volumeChange(item) {
        this.productChange()
      },
      getInputStrClassNumberOfPackages(row) {
        if (row.numberOfPackagesAll != 0) {
          return 'Red'
        }
      },
      getInputStrClassGrossWeight(row) {
        if (row.grossWeightAll != 0) {
          return 'Red'
        }
      },
      getInputStrClassVolume(row) {
        if (row.volumeAll != 0) {
          return 'Red'
        }
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'Total';
            return;
          }
          if (column.property == 'productEnglishName' || column.property == 'hscode' || column.property == 'hscode'
            || column.property == 'packages'
          ) {
            sums[index] = ' ';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      beforeUploadContainers1(file) {
        this.file2Xce(file).then(tabJson => {
          console.log(tabJson)
          if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
            const errorList = []
            const listTable = []
            this.checkLoading = true
            const keyList = Object.keys(tabJson[0].sheet[0])
            //check key
            for (let i = 0; i < this.containersHeaders.length; i++) {
              if (!keyList.includes(this.containersHeaders[i])) {
                errorList.push(this.containersHeaders[i])
                break
              }
            }
            if (errorList.length > 0) {
              this.$notify({
                title: 'Warning',
                message: errorList + " does not exist, Please use the import template to import",
                type: 'warning'
              });
              this.checkLoading = false;
              this.$refs.upload.clearFiles();
              return
            }
            //get data
            tabJson[0].sheet.forEach((item, index, key) => listTable.push(item))


            const containerTypes = this.containerOptions.map(obj => obj.type)
            //check key
            listTable.forEach((item, index) => {
              if (!containerTypes.includes(item["Container Type"])) {
                errorList.push(item["Container Type"])
              }
            })
            if (errorList.length > 0) {
              this.$notify({
                title: 'Warning',
                message: 'Container Type ' + errorList + ' does not exist',
                type: 'warning'
              })
              this.checkLoading = false
              this.$refs.upload.clearFiles();
              return
            }


            //copy value
            const groupedData = {};
            listTable.forEach((item, index) => {
              const groupKey = `${item["Container Type"]}-${item["Container No"]}`;
              if (!groupedData[groupKey]) {
                let soc = item['SOC(TRUE/FALSE)']
                if (soc != null) {
                  if (soc.toLowerCase === 'true' || soc === '1' || soc.toLowerCase === 'yes') {
                    soc = true
                  } else {
                    soc = false
                  }
                }
                let subContainerType = null
                if (String(item["Sub Container"]|| "").toUpperCase().trim() === 'YES') {
                  subContainerType = 'YES'
                }
                groupedData[groupKey] = {
                  "containerType": String(item["Container Type"]|| "").trim(),
                  "containerNo": String(item["Container No"]|| "").trim(),
                  "subContainerType": subContainerType,
                  "containerSealNumber": String(item["Container Seal Number"]|| ""),
                  "remark": String(item["Marks&Numbers"]|| ""),
                  "tareWeight": item["Tare Weight"],
                  "packageMethod": String(item["FCL/LCL"]|| ""),
                  "soc": soc,
                  "productData": []
                };
              }
              const productDataItem = {};
              // Copy the necessary properties to productDataItem
              productDataItem["productEnglishName"] = String(item["Product Name"]|| "");
              productDataItem["hscode"] = String(item["HS code"]|| "");
              productDataItem["numberOfPackages"] = item["Number Of Packages"];
              productDataItem["packages"] = String(item["Packages"]|| "");
              const units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
              const excelUnit = String(item['Packages'] || "")
              console.log(excelUnit)
              let unitsFlag = false
              if (excelUnit !=null) {
                for (const unit of units) {
                  if (unit.label === excelUnit.toUpperCase() || unit.value === excelUnit.toUpperCase()) {
                    productDataItem["packages"] = unit.value
                    unitsFlag = true
                  }
                }
              }
              if (!unitsFlag) {
                productDataItem["packages"] = null
              }
              productDataItem["grossWeight"] = item["Gross Weight(KG)"];
              productDataItem["volume"] = item["Volume(CBM)"];
              //数组默认是0,表头行也不算,所以 +2
              groupedData[groupKey]["index"] = index + 2;

              groupedData[groupKey]["productData"].push(productDataItem);
            });
            console.log(groupedData)

            const groupedArray = Object.values(groupedData);
            this.pushData(groupedArray);
            this.$refs.upload.clearFiles();
          }
        })
      },
      pushData(groupedArray) {
        //push data
        for (let i = 0; i < this.form.containers.length; i++) {
          for (let j = 0; j < groupedArray.length; j++) {
            if (this.form.containers[i].containerType === groupedArray[j].containerType &&
              (!this.form.containers[i].containerNo || this.form.containers[i].containerNo !== groupedArray[j].containerNo)) {
              this.$set(this.form.containers[i], 'containerNo', groupedArray[j].containerNo)
              this.$set(this.form.containers[i], 'subContainerType', groupedArray[j].subContainerType)
              this.$set(this.form.containers[i], 'containerSealNumber', groupedArray[j].containerSealNumber)
              this.$set(this.form.containers[i], 'remark', groupedArray[j].remark)
              this.$set(this.form.containers[i], 'soc', groupedArray[j].soc)
              this.$set(this.form.containers[i], 'packageMethod', groupedArray[j].packageMethod)
              this.$set(this.form.containers[i], 'tareWeight', groupedArray[j].tareWeight)
              this.form.containers[i].productData = []
              this.$set(this.form.containers[i], 'productData', groupedArray[j].productData)
              groupedArray.splice(j, 1);
              break
            }
          }
        }
        this.checkLoading = false
      },
      downloadImportTemplate1() {
        downloadContainersTemplate({ shipmentId: this.$route.query.id }).then((res) => {
          this.$download.excel(res, "import_template_containers.xlsx");
        })
      },
      //去除中文
      filterChinese1(name) {
        return name.replace(/[\u4e00-\u9fa5]/g, '');
      },
      addProduct1(data) {
        console.log('11111111111111111')
        console.log(data)
        data.push({});
      },
      handleDelete1(data, index) {
        // 至少要有一条product
        if (data.length < 2) {
          this.$message.warning('Each Container must retain at least one Product record.')
          return
        }
        this.$confirm('Are you sure you want to delete this Product information?', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          data.splice(index, 1)
        }).catch(() => {})
      },
      subContainerTypeChange1(index, subContainerType) {
        if (this.form.containers[index].containerType !== subContainerType) {
          this.form.containers[index].containerNo = null
        }
      },
     totalVolum1() {
        var sum = 0
        if (this.form.containers ==undefined) {
          return 0
        }
        for (var contianer of this.form.containers) {
          var products = contianer.productData
          if (products == undefined) {
            return 0
          }
          for (var product of products) {
            sum+=  product.numberOfPackages == undefined ? 0 : product.numberOfPackages
          }
        }
        return sum
      },
      totalCBM1() {
        var sum = 0
        if (this.form.containers == undefined) {
          return sum
        }
        for (var contianer of this.form.containers) {
          var products = contianer.productData
          if (products == undefined) {
            return sum
          }
          for (var product of products) {
            sum +=  product.volume == undefined ? 0 : product.volume
          }
        }
        return sum
      },
      totalWeight1() {
        var sum = 0
        if (this.form.containers == undefined) {
          return sum
        }
        for (var contianer of this.form.containers) {
          var products = contianer.productData
          if (products == undefined) {
            return sum
          }
          for (var product of products) {
            sum += product.grossWeight == undefined ? 0 : product.grossWeight
          }
        }
        return sum
      },
     sumVGM(row){
       // try {
       // var sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)
       // var sumTare = (Number(row?.tareWeight) || 0).toFixed(3)
       // return Number(sum) + Number(sumTare)
       // } catch (error) {
       //   console.error('计算总重量出错:', error);
       //   return 0; // 确保即使出错也有返回值
       // }
       try {
         // 计算货物毛重总和
         const totalGrossWeight = row.productData.reduce((sum, item) => {
           const weight = Number(item?.grossWeight) || 0;
           return sum + weight;
         }, 0);

         // 获取集装箱皮重
         const tareWeight = Number(row?.tareWeight) || 0;

         // 计算总重并格式化
         const vgm = totalGrossWeight + tareWeight;
         return parseFloat(vgm.toFixed(3)); // 确保三位小数精度
       } catch (error) {
         console.error('计算总重量出错:', error);
         return 0;
       }
     },
     getContainerTypeCodeList1() {
        getContainerTypeCodeList().then((response) => {
          this.containerTypeList = response.data;
        });
      },
      submitsi(type) {
        this.loadingSaveBut = true
        if (type == 4) {
          this.form.siDraft = true
        } else {
          this.form.siDraft = false
        }
        for (let i = 0; i < this.form.containers.length; i++) {
          if (this.form.containers[i].containerNo != null) {
            this.form.containers[i].containerNo = this.form.containers[i].containerNo.replace(/(^\s*)|(\s*$)/g,
              '').toUpperCase()
          }
          if (this.form.containers[i].containerSealNumber != null) {
            this.form.containers[i].containerSealNumber = (this.form.containers[i].containerSealNumber + '').replace(/(^\s*)|(\s*$)/g, '')
          }
          const state = this.validateContainerNO(this.form.containers[i].containerNo)
          if (!state) {
            this.loadingSaveBut = false
            return false
          }
        }

        const hasContainerDuplicates = this.hasDuplicates(this.form.containers.filter(item =>item.type==1));
        if(hasContainerDuplicates) {
          this.$notify.error('Container No Duplicates , please check');
          this.loadingSaveBut = false
          return false
        }
        if((this.form.ams=='CARRIER'|| this.form.aci == 'CARRIER')&&(this.form.hblNumber == null || this.form.hblNumber == ' ')) {
          this.$refs['hblForm'].validate((valid) => {
            if (valid) {
            }
          })
          this.$notify.error('Invalid HBL Number: ' + this.form.hblNumber + ' , please check');
          this.loadingSaveBut = false
          return false
        }
        this.realSubmitSI(false);
      },
      hasDuplicates(array) {
          const seen = new Set();
          for (const item of array) {
            const containerNo = item.containerNo;
            if (seen.has(containerNo)) return true;
            seen.add(containerNo);
          }
          return false;
      },
      realSubmitSI(flag) {
        this.loadingSaveBut = true

        var containers = [];
        var products = [];
        for (var i = 0; i < this.form.containers.length; i++) {
          var grossWeight = 0;
          var volume = 0;
          var numberOfPackages = 0;
          var packageType = '';
          for (var j = 0; j < this.form.containers[i].productData.length; j++) {
            this.form.containers[i].productData[j].containerNo = this.form.containers[i].containerNo;
            this.form.containers[i].productData[j].containerSealNumber = this.form.containers[i].containerSealNumber;
            products.push(this.form.containers[i].productData[j]);
            if (this.form.containers[i].productData[j].grossWeight) {
              grossWeight += this.form.containers[i].productData[j].grossWeight;
            }
            if (this.form.containers[i].productData[j].volume) {
              volume += this.form.containers[i].productData[j].volume;
            }
            if (this.form.containers[i].productData[j].numberOfPackages) {
              numberOfPackages += Number(this.form.containers[i].productData[j].numberOfPackages);
            }
            packageType = this.form.containers[i].productData[j].packages
          }
          console.log(this.form.containers[i].soc)
          var soc = this.form.containers[i].soc
          if (soc != null) {
            if (soc.toLowerCase == 'true' || soc == '1' || soc.toLowerCase == 'yes') {
              soc = true
            } else {
              soc = false
            }
          } else {
            soc = false
          }
          containers.push({
            containerNo: this.form.containers[i].containerNo,
            soc: soc,
            packageType: packageType,
            packageMethod: this.form.containers[i].packageMethod,
            containerType: this.form.containers[i].containerType,
            subContainerType: this.form.containers[i].subContainerType,
            containerSealNumber: this.form.containers[i].containerSealNumber,
            remark: this.form.containers[i].remark,
            grossWeight: grossWeight.toFixed(3),
            volume: volume.toFixed(3),
            numbersOfPackage: numberOfPackages,
            tareWeight: this.form.containers[i].tareWeight,
          });
        }
        var data = JSON.parse(JSON.stringify(this.form));
        data.containers = JSON.stringify(containers);
        data.cargoData = JSON.stringify(this.form.productData.filter(item => item.containerId == null));
        data.productData = JSON.stringify(products);
        console.log(data)
        submitSISinotrans(data).then((response) => {
          this.$router.push("/shipment/detail?id=" + this.form.id);
        });
      },

      totalAllBooked() {
        return this.spoItems.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked);
        }, 0)
      },

      totalAllGrossWeight() {
        return this.spoItems.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight);
        }, 0)
      },
      totalAllVolume() {
        return this.spoItems.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume);
        }, 0)
      },
      handleExportShipmentDetails(){
        const id = this.$route.query.id
        if(!id){
          this.$message.warning("id is null, cannot export! ")
          return false
        }
        this.downloadLoading = true
        const party = this.parties['Shipper']
        let shipperName = '-'
        let consigneeName = '-'
        let notifyPartyName = '-'
        let secondNotifyName = '-'
        if(party){
          const obj = this.parties['Shipper'].find((item => item.id === this.form.shipper))
          if(obj){
            shipperName = obj.name
          }
          const obj1 = this.parties['Consignee'].find((item => item.id === this.form.consignee))
          if(obj1){
            consigneeName = obj1.name
          }
          const obj2 = this.parties['Notify Party'].find((item => item.id === this.form.notifyParty))
          if(obj2){
            notifyPartyName = obj2.name
          }
          const obj3 = this.parties['Notify Party'].find((item => item.id === this.form.agreementParty))
          if(obj3){
            secondNotifyName = obj3.name
          }
        }
        const products = JSON.parse(
          JSON.stringify(
            this.form.productData.filter(item => item.containerId == null)
          )
        );
        for (let product of products) {
          const dic = this.getDictDatas(DICT_TYPE.SYSTEM_UNITS).find((item => item.value === product.packages));
          if(dic){
            product.packages = dic.label
          }
          product.dg = product.dg === 1 ? 'Yes' : 'No'
          product.batteries = product.batteries === 3 ? 'No Batteries' : 'Has Batteries'
        }
        const containers = JSON.parse(JSON.stringify(this.form.containers));
        for (let container of containers) {
          const dic = this.getDictDatas(DICT_TYPE.SYSTEM_UNITS).find((item => item.value === container.packageType));
          if(dic){
            container.packageType = dic.label
          }
          container.soc = container.soc ? 'Yes' : 'No'
          container.vgm = container.grossWeight + container.tareWeight
        }

        exportShipmentDetails({
          mainData: {
            shipperName: shipperName,
            shipperAddress: this.getShipper().address,
            shipperPhone: this.getShipper().phone,
            shipperFax: this.getShipper().fax,
            shipperEmail: this.getShipper().email,
            shipperEnterprise: this.getShipper().companyUsci,
            consigneeName: consigneeName,
            consigneeAddress: this.getConsignee().address,
            consigneePhone: this.getConsignee().phone,
            consigneeFax: this.getConsignee().fax,
            consigneeEmail: this.getConsignee().email,
            consigneeEnterprise: this.getConsignee().companyUsci,
            notifyPartyName: notifyPartyName,
            notifyPartyAddress: this.getNotifyParty().address,
            notifyPartyPhone: this.getNotifyParty().phone,
            notifyPartyFax: this.getNotifyParty().fax,
            notifyPartyEmail: this.getNotifyParty().email,
            notifyPartyEnterprise: this.getNotifyParty().companyUsci,
            secondNotifyName: secondNotifyName,
            secondNotifyAddress: this.getAgreementParty().address,
            secondNotifyPhone: this.getAgreementParty().phone,
            secondNotifyFax: this.getAgreementParty().fax,
            secondNotifyEmail: this.getAgreementParty().email,
            secondNotifyEnterprise: this.getAgreementParty().companyUsci
          },
          cargoInfos: products,
          containers: containers
        }).then((response) => {
          this.downloadLoading = false
          const date = new Date()
          this.$download.excel(response, `Shipping-Instructions-${date.getTime()}.xlsx`)
        })
      },
      getFromOrder() {
        this.form.productFromOrder = 1
        var weight = this.totalAllGrossWeight().toFixed(3);
        var volume = this.totalAllVolume().toFixed(3);
        if(!this.form.productData.filter(item => item.containerId==null ) || this.form.productData.filter(item => item.containerId==null ).length == 0){
          return
        }
        var product = this.form.productData.filter(item => item.containerId==null )[0]
        var booked = this.totalAllBooked()
        product.numberOfPackages = booked
        product.grossWeight = weight
        product.volume = volume
        var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
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

        const productNames = this.spoItems.map(item => item.productName) .join('\n');
        product.productEnglishName = productNames
        console.log("productNames", productNames);

        console.log(this.spoItems)

        var hscode = this.spoItems[0].hscode
        console.log(hscode)
        product.hsCode = hscode
        product.hscode = hscode
        console.log('product', product)

        if (this.spoItems.length === 1) {
          product.markNumbers = this.spoItems[0].markNumbers
        }else {
          product.markNumbers = null
        }

        console.log('product', product)

        this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
        console.log('this.form.productData', this.form.productData)

      },
      // 新增方法用于校验 hscode 格式
      validateHsCodeFormat(hscode) {
        const regex = /^\d{10}$/;
        return regex.test(hscode);
      },
    },
  };
  // 自定义函数用于验证电子邮件地址
  function isValidEmailAddress(email) {
    // 自定义验证逻辑
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
</script>
<style lang="scss" scoped>
.company-option-with-tooltip {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}
.company-full-width-tooltip-shipment-si-update{
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}
.tab-title {
  margin: 0 16px;
  font-size: 12px;
  font-weight: bold;
}
</style>
