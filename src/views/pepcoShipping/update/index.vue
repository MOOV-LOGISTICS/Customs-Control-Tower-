<template>
  <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
    <el-card class="pd-20">
      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="0px">
        <el-card class="card-css">
          <div class="el-descriptions__title_css">Order Details</div>
          <order-detail ref="orderDetail" @render="handleOrderRender" @validate-differs-result="handleValidateDiffersResult" @sum="handleOrderSum"></order-detail>
        </el-card>

        <el-card class="card-css" v-if="!amendPOQtyRequest">
          <div class="el-descriptions__title_css">General Info</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item label="Customer ref">
              <template slot="label">
                Customer ref
                <el-tooltip effect="light" content="This is the reference for the customer, for example a PO number or unique order reference." placement="right">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <el-form-item label prop="customerRef">
                <el-input v-model="form.customerRef" clearable disabled></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> SO Type
              </template>
              <el-form-item required label prop="shipmentType">
                <el-radio-group v-model="form.shipmentType" size="mini" :disabled="form.freightMethod === 'air'">
                  <el-radio v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>
            <!-- <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.payment_term')}}
              </template>
              <el-form-item required label prop="paymentTerm">
                <el-select filterable v-model="form.paymentTerm">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>-->

            <!--增加incoterm edwin-->
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.incoterm')}}
              </template>
              <el-form-item required label prop="incoterm">
                <el-select filterable v-model="form.incoterm">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SHIPPING_INCOTERM)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                Named Place
              </template>
              <el-form-item required label prop="namedPlace">
                <el-select filterable v-model="form.namedPlace">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label="Shipper ref">
              <template slot="label">
                Shipper ref
                <el-tooltip effect="light" content="This is the reference for own shipper internal use. " placement="right">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <el-form-item label prop="shipperRef">
                <el-input v-model="form.shipperRef" show-word-limit clearable></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span style="color:red;">*</span>BL Types
              </template>
              <el-form-item required prop="blType">
                <el-select size="mini" v-model="form.blType" :placeholder="$t('booking.bl_type')" class="custom-select">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" v-if="dict.value != 'SEAWAY B/L'" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <!--增加transport mode edwin-->
            <el-descriptions-item>
              <template slot="label">
                <span style="color:red;">*</span>
                Transport Mode
              </template>
              <el-form-item required prop="freightMethod">
                <el-select size="mini" v-model="form.freightMethod" :placeholder="$t('booking.transportMode')" @change="handleTransportModeChange" disabled class="custom-select">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- <el-card class="card-css">
          <div class="el-descriptions__title_css">BL Types</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
            <el-descriptions-item>
              <template slot="label">
                <span style="color:red;">*</span>BL Types
              </template>
              <el-form-item required prop="blType">
                <el-select size="mini" v-model="form.blType" :placeholder="$t('booking.bl_type')" class="custom-select">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" v-if="dict.value != 'SEAWAY B/L'" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
          </el-descriptions>
        </el-card>-->

        <el-card class="card-css" v-if="!amendPOQtyRequest">
          <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.truckServices')}}
              </template>
              <el-form-item required label prop="truckServices">
                <el-radio-group v-model="form.truckServices" size="mini">
                  <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{ form.freightMethod === 'air'
                ? $t('booking.originAirport')
                : $t('booking.originPort') }}
              </template>
              <el-form-item required label prop="originPort">
                <el-select filterable v-model="form.originPort">
                  <el-option v-if="form.freightMethod !=='air'" v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  <el-option v-if="form.freightMethod ==='air'" v-for="(item, index) in airPortOptions" :key="index + 'airport-pol'" :label="item.airportName+' ('+item.iata+')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000" v-if="form.truckServices == 'Yes'">*</font>
                {{$t('booking.originLocation')}}
              </template>
              <el-form-item :required="form.truckServices == 'Yes'" label prop="originLocation">
                <el-input type="textarea" :rows="1" v-model="form.originLocation"></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css">
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.needExportCustomServices')}}
              </template>
              <el-form-item required label prop="needExportCustomerService">
                <el-radio-group v-model="form.needExportCustomerService" size="mini">
                  <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css">
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.cargoReadyForPickup')}}
              </template>
              <el-form-item required label prop="cargoReadyForPickup">
                <el-date-picker value-format="timestamp" v-model="form.cargoReadyForPickup" :picker-options="allCRDPickerOptions" type="date" disabled></el-date-picker>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label></el-descriptions-item>
          </el-descriptions>

          <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item>
              <template slot="label">{{$t('booking.deliverServiceFromPodToFnd')}}</template>
              <el-form-item required label prop="deliverServiceToFnd">
                <el-radio-group v-model="form.deliverServiceToFnd" size="mini">
                  <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                {{ form.freightMethod === 'air'
                ? $t('booking.destinationAirport')
                : $t('booking.destinationPort') }}
              </template>
              <el-form-item label prop="destinationPort">
                <el-select filterable v-model="form.destinationPort">
                  <el-option v-if="form.freightMethod !=='air'" v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  <el-option v-if="form.freightMethod ==='air'" v-for="(item, index) in airPortOptions" :key="index + 'airport-pod'" :label="item.airportName+' ('+item.iata+')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.dc')}}
              </template>
              <el-form-item required label prop="dc">
                <el-select filterable v-model="form.dc">
                  <el-option v-for="dict in dcOptions" :key="dict" :label="dict" :value="dict" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000" v-if="form.deliverServiceToFnd == 'Yes'">*</font>
                {{$t('booking.destinationLocation')}}
              </template>
              <el-form-item :required="form.deliverServiceToFnd == 'Yes'" label prop="destinationLocation">
                <el-input type="textarea" :rows="1" v-model="form.destinationLocation"></el-input>
              </el-form-item>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="Latest Deliver Date">
              <el-form-item label prop="deliverDate">
                <el-date-picker value-format="timestamp" v-model="form.deliverDate" type="date"></el-date-picker>
              </el-form-item>
            </el-descriptions-item>-->
            <el-descriptions-item label></el-descriptions-item>
            <el-descriptions-item label></el-descriptions-item>
            <el-descriptions-item label></el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css" v-if="!amendPOQtyRequest">
          <div class="el-descriptions__title_css">Booking Contact Info</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.name')}}
              </template>
              <el-form-item required label-width="0px" prop="contactName">
                <el-input v-model="form.contactName" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.phone')}}
              </template>
              <el-form-item required label-width="0px" prop="contactPhone">
                <el-input v-model="form.contactPhone" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.email')}}
              </template>
              <el-form-item required label-width="0px" prop="contactEmail">
                <el-input v-model="form.contactEmail" />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css" v-if="!amendPOQtyRequest">
          <div class="el-descriptions__title_css">Parties</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Shipper
              </template>
              <el-form-item required label prop="shipperCompany">
                <el-input v-model="form.shipperCompany" />
                <!-- <el-select v-model="form.shipperCompany" clearable filterable allow-create default-first-option @change="shipperChange" placeholder="Shipper Company">
                  <el-option v-for="item in shipperList" :label="item.shipperCompany" :value="item.shipperCompany"></el-option>
                </el-select>-->
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Consignee
              </template>
              <el-form-item required label prop="consigneeCompany">
                <el-input v-model="form.consigneeCompany" />
                <!-- <el-select v-model="form.consigneeCompany" clearable filterable allow-create default-first-option @change="consigneeChange" placeholder="Shipper Company">
                  <el-option v-for="item in consigneeList" :label="item.consigneeCompany" :value="item.consigneeCompany"></el-option>
                </el-select>-->
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Notify
              </template>
              <el-form-item required label prop="notifyCompany">
                <el-input v-model="form.notifyCompany" />
                <!-- <el-select v-model="form.notifyCompany" clearable filterable allow-create default-first-option @change="notifyChange" placeholder="Shipper Company">
                  <el-option v-for="item in notifyPartyList" :label="item.notifyCompany" :value="item.notifyCompany"></el-option>
                </el-select>-->
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label>
              <el-form-item required label prop="shipperAddress">
                <el-input placeholder="Shipper Address" type="textarea" :rows="4" v-model="form.shipperAddress" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label>
              <el-form-item required label prop="consigneeAddress">
                <el-input placeholder="Consignee Address" type="textarea" :rows="4" v-model="form.consigneeAddress" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label>
              <el-form-item required label prop="notifyAddress">
                <el-input placeholder="Notify Address" type="textarea" :rows="4" v-model="form.notifyAddress" />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Products</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
            <!-- <template slot="extra">
              <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">{{ $t("search.delete") }}</el-button>
            </template>-->
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Mark&Numbers
              </template>
              <el-form-item required label>
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="form.product.markNumbers" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.productEnglishName')}}
              </template>
              <el-form-item required label>
                <el-input type="textarea" aria-required :autosize="{ minRows: 4, maxRows: 4 }" v-model="form.product.productEnglishName" placeholder="Must Input English Product Name" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Product Chinese Name">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="form.product.productChineseName" />
            </el-descriptions-item>

            <el-descriptions-item></el-descriptions-item>

            <el-descriptions-item></el-descriptions-item>

            <el-descriptions-item></el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.hsCode')}}
              </template>
              <el-form-item required label>
                <el-input v-model="form.product.hscode" minlength="10" maxlength="10" clearable @blur="validateHsCode($event)" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">
              <template slot="label">
                <font color="#FF0000">*</font> Number Of Packages
              </template>
              <el-form-item required label>
                <el-input-number v-model="form.product.numberOfPackages" :controls="false" :precision="0" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Packages
              </template>
              <el-form-item required label>
                <el-select filterable v-model="form.product.packages" placeholder>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Gross Weight(KG)
              </template>
              <el-form-item required label>
                <el-input-number v-model="form.product.grossWeight" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Volume(CBM)
              </template>
              <el-form-item required label>
                <el-input-number v-model="form.product.volume" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Batteries">
              <el-radio-group @input="changeBatteries(form.product)" v-model="form.product.batteries">
                <el-radio :label="2" border>Has batteries</el-radio>
                <el-radio :label="3" border>No batteries</el-radio>
              </el-radio-group>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
              <el-switch @change="changeDG(form.product)" :active-value="1" :inactive-value="0" v-model="form.product.dg" active-text="Yes" inactive-text="No"></el-switch>
            </el-descriptions-item>

            <el-descriptions-item :label="dict.label" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="form.product.dg == 1">
              <el-input v-model="form.product.hazardousMaterials[dict.value]" />
            </el-descriptions-item>

            <el-descriptions-item v-if="form.product.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="form.product.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="form.product.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="form.product.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="form.product.dg == 0" label></el-descriptions-item>

            <el-descriptions-item label>
              <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
                <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
                <el-col :span="8">Remark</el-col>
                <el-col :span="6">Files</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-input type="textarea" v-model="form.product.remark" />
                </el-col>
                <el-col v-if="!this.addPoRequest && !amendPOQtyRequest" :span="6">
                  <el-upload
                    class="upload-demo"
                    ref="upload0"
                    multiple
                    :action="url + '/admin-api/shipping/product/upload'"
                    :data="form.product.uploadData"
                    :headers="uploadHeaders"
                    :on-success="handleSuccess"
                    :file-list="form.product.fileList"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {form.product.fileList = files}, () => {form.product.fileList = []})"
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

        <el-card class="card-css" v-if="form.shipmentType == 'FCL' && !amendPOQtyRequest">
          <div class="el-descriptions__title_css">Containers</div>

          <el-row>
            <el-button @click="addContainers" size="mini" type="text">
              <i class="el-icon-plus"></i>
              {{ $t("booking.addContainers") }}
            </el-button>
          </el-row>

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
                  <el-form-item required label-width="0px" :prop="'containers.' + i + '.type'">
                    <el-select filterable placeholder v-model="item.type" @change="handleOptionChange">
                      <el-option v-for="opt in containerOptions" :label="opt.type" :value="opt.type" :key="opt.id"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="containers-editor__col containers-editor__col--qty">
                  <el-form-item required label-width="0px" :rules="getContainerQuantityRules()" :prop="'containers.' + i + '.qty'">
                    <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--vent">
                  <el-form-item
                    v-show="item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                    label-width="0px"
                  >
                    <el-input v-model="item.ventClosedOrNot" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--temp">
                  <el-form-item
                    v-show="isReeferContainerType(item.type)"
                    label-width="0px"
                    :rules="getContainerTemperatureRules(item.type)"
                    :prop="'containers.' + i + '.requireTemperature'"
                  >
                    <el-input v-model="item.requireTemperature" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--humidity">
                  <el-form-item
                    v-show="item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                    label-width="0px"
                  >
                    <el-input v-model="item.humidity" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--o2">
                  <el-form-item
                    v-show="item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                    label-width="0px"
                  >
                    <el-input v-model="item.o2" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--co2">
                  <el-form-item
                    v-show="item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                    label-width="0px"
                  >
                    <el-input v-model="item.co2" />
                  </el-form-item>
                </div>
                <div v-show="flag" class="containers-editor__col containers-editor__col--drains">
                  <el-form-item
                    v-show="item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                    label-width="0px"
                  >
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
        </el-card>

        <el-card v-if="!addPoRequest && !amendPOQtyRequest" class="card-css">
          <div>
            <div class="el-descriptions__title_css">Documents(Manifest,ICS2,etc)</div>
          </div>
          <el-divider></el-divider>
          <el-button type="primary" @click="uploadICS">Upload</el-button>

          <el-card class="box-card" style="margin-bottom: 10px;margin-right: 10px;margin-top: 10px;" v-show="fileTableData.length > 0">
            <div v-for="file in fileTableData" class="text-upload inline-item" size="mini" style="width: 400px;padding-right: 10px;">
              <div class="tools-but">
                <ActionButton :url="file.fileUrl" iconType="el-icon-view" type="preview" :fileName="file.fileName" buttonType="text" />
                <ActionButton :url="file.fileUrl" iconType="el-icon-download" type="download" :fileName="file.fileName" buttonType="text" />
                <!-- <el-button type="text" @click="handlePreview(file)" icon="el-icon-download" style="margin-right: 6px"></el-button> -->
                <span @click="deleteDocument(file)">
                  <i class="el-icon-delete" />
                </span>
              </div>
              <el-descriptions :colon="false" :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px">
                <el-descriptions-item :label="$t('document.name')">{{ file.fileName }}</el-descriptions-item>
                <el-descriptions-item label="Order Number">{{ file.poNumber }}</el-descriptions-item>
                <el-descriptions-item label="Document Type">{{ file.typeCode=='11'?'ICS2':file.typeCode=='12'?'Manifest':file.typeCode=='13'?'etc':'' }}</el-descriptions-item>
                <el-descriptions-item label="Document Number">{{ file.documentNumber }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-card>
        <el-card v-if="!amendPOQtyRequest" class="card-css">
          <div class="el-descriptions__title_css">Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="form.remark" />
            </el-col>
          </el-row>
        </el-card>
        <el-card v-if="addPoRequest" class="card-css">
          <div class="el-descriptions__title_css">Add PO Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="addPoForm.remark" />
            </el-col>
          </el-row>
          <!-- <WEditor :value.sync="addPoForm.remark" height="180px" placeholder="add po comments..." /> -->
        </el-card>
        <el-card v-if="amendPOQtyRequest" class="card-css">
          <div class="el-descriptions__title_css">Amend PO Qty Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="amendPOQtyForm.remark" />
            </el-col>
          </el-row>
          <!-- <WEditor :value.sync="addPoForm.remark" height="180px" placeholder="add po comments..." /> -->
        </el-card>

        <el-row style="text-align: center; padding: 20px;">
          <el-button v-if="!addPoRequest&&!amendPOQtyRequest&&form.status==-1" size="mini" @click="submit(-1)" type="primary" :loading="loadingSaveBut">Save Draft</el-button>
          <el-button v-if="!addPoRequest && !amendPOQtyRequest" size="mini" @click="submit(0)" type="primary" :loading="loadingSaveBut">Submit</el-button>
          <el-button v-if="addPoRequest" type="warning" size="mini" @click="handleSubmitAddPoRequest" :loading="loadingSaveBut">Submit Request</el-button>
          <el-button v-if="amendPOQtyRequest" type="warning" size="mini" @click="handleSubmitAmendPOQtyRequest" :loading="loadingSaveBut">Submit Request</el-button>
        </el-row>
      </el-form>
    </el-card>
    <upload-order-file ref="uploadOrderFile" @confirm="submitFile"></upload-order-file>
  </div>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import { getUserProfile } from '@/api/system/user'
import { getContainerList } from '@/api/system/container'
import { getHsCodeListByCode } from '@/api/system/hsCode'
import { updateShippingOrder, getShippingOrderDetail } from '@/api/pepco/shipping-order'

import { createOrder, getOrder, getPartiesList, uploadShippingFile, downloadShippingOrderTemplate } from '@/api/shipping/order'
import { getProductList } from '@/api/system/product'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
// import { createTemplate, deleteTemplate, getTemplateList } from '@/api/shipping/template'
// import XLSX from 'xlsx'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { getAirportList } from '@/api/air/airport'
import OrderDetail from '@/views/pepcoShipping/create/components/order-detail.vue'
import { getPepcoOrderFileByOrder, updatePepcoFileShippingId } from '@/api/order/task'
import { deleteFile } from '@/api/infra/file'
import { deleteOrderFile } from '@/api/pepco/order-file'
import uploadOrderFile from '../create/components/upload-order-file'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import {
  resolveFormContainers,
  validateContainersGrossWeight,
  applyReeferFieldsForContainer,
  sanitizeContainersReeferFields,
  isReeferContainerType as checkReeferContainerType,
  containerTemperatureRules as buildContainerTemperatureRules,
  clearNonReeferTemperatureValidation,
  containerQuantityRules
} from '@/utils/formContainersUtil'
import { createShippingApproval, createShippingQtyApproval } from '@/api/pepco/shipping-approval'
import { validateSupplierBookingDcOnSubmit } from '@/utils/shippingOrderConfig'

const defaultForm = {
  orders: [],
  containers: [],
  products: [],
  phone: '',
  email: '',
  shipmentType: 'FCL',
  truckServices: 'No',
  needExportCustomerService: 'No',
  deliverServiceToFnd: 'No',
  remark: '',
  // 增加货运模式 edwin
  freightMethod: 'sea'
}

export default {
  name: 'UpdateShippingOrder',
  mixins: [fileLoadMixin],
  components: { IconPark, OrderDetail, uploadOrderFile },
  data() {
    return {
      originOptions: [
        {
          value: 'Yes',
          label: 'Yes'
        },
        {
          value: 'No',
          label: 'No'
        }
      ],
      loadingSaveBut: false,
      form: {
        containers: [],
        productData: [],
        phone: '',
        email: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: '',
        // 增加货运模式 edwin
        freightMethod: '',
        product: {
          numberOfPackages: 0,
          grossWeight: 0,
          volume: 0,
          fileList: []
        }
      },
      phoneError: '',
      emailError: '',
      portOptions: [],
      airPortOptions: [],
      soQueryParams: {
        pageNo: 1,
        pageSize: 10
      },
      soLineTotal: 0,
      containerOptions: [],
      shipmentId: null,
      parties: {
        Shipper: [],
        Consignee: [],
        'Notify Party': [],
        'Agreement Party': []
      },
      partiesMap: {},
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
      shippingScheduleLoading: false,
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
      soTableData: [],
      showTips: true,
      showCustomer: true,
      hsCodeList: [],
      options: [],
      shipperList: [],
      consigneeList: [],
      notifyPartyList: [],

      bookingNoteList: [],
      delIds: [],
      titleShow: false,
      templateForm: { title: null },
      clearTemplateFlag: false,
      templateData: null,
      templateLoading: false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader()
      },
      poList: [],
      shippingOrderId: undefined,
      product: {},
      fileTableData: [],
      cargoReadyDateMaxDate: null,
      headerDataList: [],
      dcOptions: ['0006', '0015', '0018', '0021', '0027', '0030'],
      dcCode: '',
      shippingStatus: 0,
      addPoRequest: false,
      amendPOQtyRequest: false,
      addRemoveRequest: false,
      addPoForm: {
        type: 'Add PO',
        originalData: '',
        soId: 0,
        newData: '',
        remark: ''
      },
      amendPOQtyForm: {
        type: 'Amend QTY',
        originalData: '',
        soId: 0,
        newData: '',
        remark: ''
      }
    }
  },
  computed: {
    allCRDPickerOptions() {
      return {
        disabledDate: date => {
          if (!this.cargoReadyDateMaxDate) return true
          return date.getTime() > this.cargoReadyDateMaxDate
        }
      }
    }
  },
  mounted() {
    this.updateCargoReadyDateMaxDate()
  },
  watch: {
    // 监听poList,更新cargo ready date 最大值
    headerDataList: {
      deep: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.updateCargoReadyDateMaxDate()

          // 只有在 cargoReadyDateMaxDate 存在且 cargoReadyForPickup 超过它时才清空
          this.$nextTick(() => {
            // 修改为 直接赋值，但不保证后面要不要动态的，所以先注释掉
            if (this.cargoReadyDateMaxDate !== null) {
              this.form.cargoReadyForPickup = this.cargoReadyDateMaxDate
            }
            // if (
            //   this.cargoReadyDateMaxDate !== null &&
            //   this.form.cargoReadyForPickup &&
            //   this.form.cargoReadyForPickup > this.cargoReadyDateMaxDate
            // ) {
            //   this.form.cargoReadyForPickup = null;
            // }
          })
        } else {
          // 如果没有订单，也可以选择是否清空
          this.form.cargoReadyForPickup = null
        }
      }
    },
    'form.shipmentType': function (newVal) {
      if (newVal === 'FCL') {
        //  初始化 containers
        if (this.form.freightMethod !== 'air' && (!this.form.containers || this.form.containers.length === 0)) {
          this.form.containers = [this.createEmptyContainer()]
        }
      } else if (newVal === 'LCL') {
        //  清空 containers
        this.form.containers = []
      }
    },
    'form.freightMethod': {
      handler(val) {

        if (val === 'air') {
          this.getAirport()
        } else if (val) {
          this.getPortList()
        }
      },
      immediate: true
    }
  },
  created() {
    console.log('进入更新shipping order')
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API

    // this.getPortList()
    this.submitLoading = false
    this.loadingSaveBut = false
    if (this.$route.query.id) {
    } else {
      this.getUserInfo()
    }
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })

    // 先加载箱型配置，再加载订单，避免 flag/下拉绑定异常
    this.shippingOrderId = this.$route.query.id
    this.getContainerList().then(() => {
      if (this.shippingOrderId) {
        this.getShippingOrder(this.shippingOrderId)
      }
    })
    localStorage.removeItem('refreshPoPage')
    if (this.$route.query.source && this.$route.query.source == 'addPO') {
      this.addPoRequest = true
    } else if (this.$route.query.source && this.$route.query.source == 'amendPOQty') {
      this.amendPOQtyRequest = true
    } else {
      this.addRemoveRequest = true
    }
    //
    console.log('freightMode', this.form.freightMethod)
  },
  beforeDestroy() {
    localStorage.removeItem('shipping-selectedPoList')
  },
  methods: {
    validateDcOnSubmit(formDc) {
      const orderList = this.$refs.orderDetail ? this.$refs.orderDetail.getDataList() : []
      const orderDcList = (orderList || []).map(item => item.dc)
      return validateSupplierBookingDcOnSubmit(formDc, orderDcList, this.getDictDatas)
    },
    updatePepcoFileShippingId(id) {
      console.log(this.$refs.orderDetail.getDataList())
      if (this.$refs.orderDetail.getDataList() == null || this.$refs.orderDetail.getDataList().length == 0) return
      if (this.fileTableData == null || this.fileTableData.length == 0) return
      var query = {
        orderIds: this.$refs.orderDetail.getDataList().map(item => Number(item.id)),
        taskCode: 'Shipper_Booking',
        shippingId: id
      }
      updatePepcoFileShippingId(query).then(res => {})
    },
    getPepcoOrderFileByOrder() {
      console.log('333')
      if (this.$refs.orderDetail == null || this.$refs.orderDetail.getDataList() == null || this.$refs.orderDetail.getDataList().length == 0) return
      console.log('444')

      var query = {
        orderIds: this.$refs.orderDetail
          .getDataList()[0]
          .items.map(item => item.orderId)
          .join(','),
        taskCode: 'Shipper_Booking'
      }
      getPepcoOrderFileByOrder(query).then(res => {
        console.log(res)
        this.fileTableData = res.data.filter(item => ['11', '12', '13'].includes(item.typeCode))
        console.log(this.fileTableData)
      })
    },
    submitFile() {
      setTimeout(() => {
        // 这里写要延迟执行的代码
        this.getPepcoOrderFileByOrder()
      }, 2000) // 2000 毫秒 = 2 秒
    },
    uploadICS() {
      console.log(this.$refs.orderDetail.getDataList())
      this.$refs.uploadOrderFile.openDialog({
        orderIds: this.$refs.orderDetail.getDataList()[0].items.map(item => item.orderId),
        taskCode: 'Shipper_Booking'
      })
    },
    getShippingOrder(shippingOrderId) {
      getShippingOrderDetail({ shippingOrderId }).then(res => {
        console.log(res)
        this.submitLoading = false
        this.loadingSaveBut = false
        this.shippingStatus = res.data.shippingOrder.status
        const normalizedContainers = this.normalizeContainers(res.data.containers)
        // 合并而非整表替换，保持 Vue 响应式绑定
        this.form = {
          ...this.form,
          ...res.data.shippingOrder,
          containers: normalizedContainers
        }
        var product = res.data.products[0]
        product.dg = product.hazardousMaterials == '{}' ? 0 : 1
        product.uploadData = {}
        product.hazardousMaterials = JSON.parse(product.hazardousMaterials)
        product.batteries = Number(product.batteries) || 3
        product.volume = Number(product.volume) || 0
        // this.form.productData = [product]
        this.product = product
        this.form.product = product

        this.headerDataList = res.data.orderHeaders
        this.$refs.orderDetail.refresh(res.data.orderHeaders, true, true, res.data.orderHeaders, this.amendPOQtyRequest, this.addRemoveRequest)

        this.getPepcoOrderFileByOrder()

        // 处理Add PO申请默认值
        this.addPoForm.soId = shippingOrderId
        this.amendPOQtyForm.soId = shippingOrderId
        const originalData = Object.assign({}, res.data.shippingOrder)
        originalData.containers = res.data.containers
        originalData.products = res.data.products
        originalData.orders = this.$refs.orderDetail.getDataList()
        this.addPoForm.originalData = JSON.stringify(originalData)
        this.amendPOQtyForm.originalData = JSON.stringify(originalData)
        this.$nextTick(() => {
          this.handleOptionChange()
        })
      })
    },
    normalizeContainers(containers) {
      if (!containers || !containers.length) {
        return []
      }
      return containers.map(c => {
        const normalized = {
          id: c.id,
          soId: c.soId,
          type: c.type != null ? String(c.type) : '',
          qty: c.qty != null ? Number(c.qty) : null,
          ventClosedOrNot: c.ventClosedOrNot != null ? String(c.ventClosedOrNot) : '',
          requireTemperature: c.requireTemperature != null ? String(c.requireTemperature) : '',
          humidity: c.humidity != null ? String(c.humidity) : '',
          o2: c.o2 != null ? String(c.o2) : '',
          co2: c.co2 != null ? String(c.co2) : '',
          drains: c.drains != null ? String(c.drains) : '',
          soc: c.soc === true || c.soc === 1 || c.soc === 'Yes'
        }
        return applyReeferFieldsForContainer(normalized, this.containerOptions, 'type')
      })
    },
    handleOrderDetail() {
      this.$nextTick(() => {
        this.$refs.orderDetail.refresh(this.poList)
      })
    },
    handleOrderRender(result) {
      console.log('handleOrderRender')
      console.log('orderInfo&dc', result)
      this.$set(this, 'dcCode', result.dc)
      this.$set(this.form, 'customerRef', result.orderNumbers.join(','))
      console.log('order form', this.form)
      // this.$set(this.form.product, 'productEnglishName', result.itemNames.join('\n'))
      // this.$set(this.form.productData, 'numberOfPackages', result.orderNumbers.join(','))
    },
    handleOrderSum(result, changePo) {
      console.log('handleOrderSum', result)
      console.log('this.form1', this.form)
      console.log('handleOrderSum------------productData-----------')

      this.$nextTick(() => {
        if (this.form.product) {
          // console.log('handleOrderSum------------productData set-----------')
          //
          // this.$set(this.form.product, 'numberOfPackages', result.bookedOuter && result.bookedOuter != 0 ? result.bookedOuter : 0)
          // this.$set(this.form.product, 'grossWeight', result.grossWeight && result.grossWeight != 0 ? result.grossWeight : 0)
          // this.$set(this.form.product, 'volume', result.volume && result.volume != 0 ? result.volume : 0)
          if (changePo || !this.form.product.numberOfPackages) {
            console.log('update numberOfPackages', result.bookedOuter)
            this.$set(this.form.product, 'numberOfPackages', result.bookedOuter && result.bookedOuter != 0 ? result.bookedOuter : 0)
          }
          if (changePo || !this.form.product.grossWeight) {
            console.log('update grossWeight', result.grossWeight)
            this.$set(this.form.product, 'grossWeight', result.grossWeight && result.grossWeight != 0 ? result.grossWeight : 0)
          }
          if (changePo || !this.form.product.volume) {
            console.log('update volume', result.volume)
            this.$set(this.form.product, 'volume', result.volume && result.volume != 0 ? result.volume : 0)
          }
        }
      })
    },
    handlePoClick() {
      console.log('handlePoClick')
      this.$refs.addRemovePoDialog.openDialog(this.poList)
    },
    handleAddRemoveSubmit(data) {
      this.poList = data
      this.handleOrderDetail()
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    shipperChange(val) {
      var data = this.shipperList.find(item => item.shipperCompany == val)
      if (data && !this.form.shipperAddress) {
        this.form.shipperAddress = data.shipperAddress
      }
    },
    consigneeChange(val) {
      var data = this.consigneeList.find(item => item.consigneeCompany == val)
      if (data && !this.form.consigneeAddress) {
        this.form.consigneeAddress = data.consigneeAddress
      }
    },
    notifyChange(val) {
      var data = this.notifyPartyList.find(item => item.notifyCompany == val)
      if (data && !this.form.notifyAddress) {
        this.form.notifyAddress = data.notifyAddress
      }
    },
    handleBlur(event) {
      const inputValue = event.target.value
      console.log(inputValue)
      if (inputValue && !this.form.shipperCompany) {
        this.form.shipperCompany = inputValue
        // 如果需要，可以将新输入的值添加到 shipperList 中
      }
    },
    getHsCodeListByCode(hscode) {
      getHsCodeListByCode(hscode).then(response => {
        this.hsCodeList = response.data
      })
    },
    remoteGetHsCode(query) {
      if (query !== '' && query.length >= 4) {
        this.loading = true
        this.getHsCodeListByCode(query)
        setTimeout(() => {
          this.options = this.hsCodeList.filter(item => {
            return item.hsCode.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
          this.loading = false
        }, 200)
      } else {
        this.options = []
      }
    },
    getPortList() {
      getOriginDeliveryList().then(response => {
        this.portOptions = response.data
      })
    },
    getAirport() {
      // 获取机场列表的接口调用
      getAirportList().then(response => {
        this.airPortOptions = response.data
      })
    },
    //zane 根据选择的transportMode，动态改变表单内容
    handleTransportModeChange(value) {
      if (value === 'air') {
        this.form.shipmentType = 'LCL'
        this.form.originPort = ''
        this.form.destinationPort = ''
        this.form.containers = []
      } else {
        this.form.originPort = ''
        this.form.destinationPort = ''
      }
    },
    getUserInfo() {
      var vm = this
      getUserProfile().then(response => {
        vm.userProfile = response.data
        this.$set(this.form, 'contactName', response.data.nickname)
        if (response.data.mobilePhone) {
          this.$set(this.form, 'contactPhone', response.data.mobilePhone)
        } else {
          this.$set(this.form, 'contactPhone', response.data.businessPhone)
        }
        this.$set(this.form, 'contactEmail', response.data.email)
      })
    },
    changeDG(item) {
      this.$set(item, 'tempaax', 1)
      this.$delete(item, 'tempaax')
      if (item.dg == 0) {
        this.$set(item, 'hazardousMaterials', {})
      } else {
        // this.$set(item, 'batteries', 3)
      }
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.contactPhone
      // 自定义验证逻辑
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8 || phoneNumber.length > 15) {
        this.phoneError = ''
      } else {
        this.phoneError = ''
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.contactEmail
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = ''
      } else {
        this.emailError = ''
      }
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
        applyReeferFieldsForContainer(this.form.containers[i], this.containerOptions, 'type')
        if (arr.indexOf(this.form.containers[i].type) > -1) {
          flag = true
        }
      }
      this.flag = flag
      this.$nextTick(() => {
        clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'type')
      })
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
    addProduct() {
      this.form.productData.push({
        dg: 0,
        hscode: '',
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
    showWeight(item) {
      if (item.type == '') {
        return 0
      } else {
        var c = this.containerOptions.find(element => element.type == item.type)
        if (c) {
          return (item.qty ? Number(item.qty) : 0) * c.weight
        }
      }
    },
    submit(operation) {
      console.log(this.form)
      console.log('提交信息', this.$refs.orderDetail.getDataList())
      console.log(this.poList)
      const dcCheck = this.validateDcOnSubmit(this.form.dc)
      if (!dcCheck.valid) {
        this.$message({
          message: dcCheck.message,
          type: 'error'
        })
        return
      }
      if (this.form.product.productEnglishName == null || this.form.product.productEnglishName.trim() == '') {
        this.$message({
          message: 'Product Name is required',
          type: 'error'
        })
        return
      }
      console.log(this.form.product.hscode)
      if ((this.form.product.hscode && this.form.product.hscode.length !== 10) || !/^\d{10}$/.test(this.form.product.hscode)) {
        this.$message({
          message: 'HS Code must be exactly 10 digits',
          type: 'error'
        })
        return
      }
      clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'type')
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 检查Containers
          if (this.form.shipmentType === 'FCL') {
            const containersCheck = this.containersCheck()
            if (!containersCheck) {
              return
            }
          }
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))
          data.productData = [data.product]
          data.containers = sanitizeContainersReeferFields(data.containers, this.containerOptions, 'type')
          var containerWeight = 0
          var text = 'Reefer Container:'
          for (var i = 0; i < data.containers.length; i++) {
            if (data.containers[i].soc == 'Yes') {
              flag = true
            }
            var c = this.containerOptions.find(element => element.type == data.containers[i].type)
            if (c != null && c.weight != null) {
              containerWeight += Number(c.weight) * Number(data.containers[i].qty)
            }
            if (data.containers[i].requireTemperature) {
              text +=
                '' +
                data.containers[i].type +
                ' Ventilation(cbm/hour):' +
                (data.containers[i].ventClosedOrNot ? data.containers[i].ventClosedOrNot : 'No') +
                ' Humidity(%):' +
                (data.containers[i].humidity ? data.containers[i].humidity : 'No') +
                ' O2(%):' +
                (data.containers[i].o2 ? data.containers[i].o2 : ' ') +
                ' CO2(%):' +
                (data.containers[i].co2 ? data.containers[i].co2 : ' ') +
                ' Drains:' +
                (data.containers[i].drains ? data.containers[i].drains : ' ')
              console.log(text)
            }
          }
          if (text == 'Reefer Container:') {
            text = ''
          }
          data.remark = data.remark + '\n' + text
          var flag = false
          var grossWeight = 0
          for (var i = 0; i < data.productData.length; i++) {
            data.productData[i].hazardousMaterials = JSON.stringify(data.productData[i].hazardousMaterials)
            if (data.productData[i].dg == 1) {
              flag = true
            }
            grossWeight += Number(data.productData[i].grossWeight)
          }
          this.uploadCount = 0
          this.successCount = 0
          data.products = data.productData
          data.orders = this.$refs.orderDetail.getDataList()
          if (data.orders.length == 0) {
            this.$message({
              message: 'Please select at least one order',
              type: 'error'
            })
            this.loadingSaveBut = false
            this.submitLoading = false
            return
          }
          data.containers = data.shipmentType == 'FCL' ? data.containers : []
          data.operation = operation
          if (data.products[0].dg === 1 || data.products[0].batteries === 2) {
            if (data.products[0].fileList.length < 1) {
              this.$notify.error('Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!')
              this.loadingSaveBut = false
              this.submitLoading = false
              return
            }
          }

          updateShippingOrder(data)
            .then(response => {
              this.shippingId = response.data.id
              this.updatePepcoFileShippingId(this.shippingId)
              if (this.form.product.fileList.length > 0) {
                this.form.product.uploadData.exId = response.data.productIds[0]
                this.$refs.upload0.submit()
              }

              var vm = this
              setTimeout(function () {
                vm.$notify({
                  title: 'success',
                  message: 'success',
                  type: 'success'
                })
                vm.$router.push('/shipment/ppShippingOrder')
                vm.loadingSaveBut = false
                vm.submitLoading = false
                localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
              }, 2000)
            })
            .catch(error => {
              //  this.$message.error('Error')
              //  console.error('Error',error)
              // 保持页面状态，不跳转页面
              this.loadingSaveBut = false
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    handleSubmitAmendPOQtyRequest() {
      console.log('-----handleSubmitAmendPOQtyRequest---')

      this.$refs.orderDetail.triggerValidateDiffers()
      // if (!this.amendPOQtyvalidateForm()) {
      //   return
      // }
      // this.$refs['form'].validate(valid => {
      //   if (valid) {
      //     this.submitLoading = true
      //     this.loadingSaveBut = true
      //     var newData = JSON.parse(JSON.stringify(this.form))
      //     newData.productData = [newData.product]
      //     newData.remark = newData.remark + '\n' + this.getRemark(newData)
      //     newData.products = newData.productData
      //     newData.orders = this.$refs.orderDetail.getDataList()
      //     newData.containers = newData.shipmentType == 'FCL' ? newData.containers : []
      //     delete newData.product
      //     delete newData.productData
      //     this.amendPOQtyForm.newData = JSON.stringify(newData)
      //     createShippingQtyApproval(this.amendPOQtyForm).then(res => {
      //       var vm = this
      //       setTimeout(function () {
      //         vm.$notify({
      //           title: 'success',
      //           message: 'success',
      //           type: 'success'
      //         })
      //         vm.$router.push('/shipment/ppShippingOrder')
      //         vm.loadingSaveBut = false
      //         vm.submitLoading = false
      //         localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
      //       }, 2000)
      //     })
      //   }
      // })
    },
    handleValidateDiffersResult(invalidOrders) {
      console.log('-----handleValidateDiffersResult---')
      if (invalidOrders.length > 0) {
        const msg = invalidOrders
          .map(item => {
            let details = []
            if (Math.abs(item.differs.outerInner) > 1) {
              details.push(`Outer/Inner: ${item.differs.outerInner.toFixed(2)}%`)
            }
            if (Math.abs(item.differs.pieces) > 1) {
              details.push(`Pieces: ${item.differs.pieces.toFixed(2)}%`)
            }
            return `${item.orderNumber} (${details.join(', ')})`
          })
          .join('; ')

        this.$message.error(`The following order(s) exceed the ±1% limit: ${msg}`)
        return
      }

      if (!this.amendPOQtyvalidateForm()) return

      clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'type')
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          const newData = JSON.parse(JSON.stringify(this.form))
          newData.productData = [newData.product]
          newData.remark = newData.remark + '\n' + this.getRemark(newData)
          newData.products = newData.productData
          newData.orders = this.$refs.orderDetail.getDataList()
            newData.containers = newData.shipmentType == 'FCL'
              ? sanitizeContainersReeferFields(newData.containers, this.containerOptions, 'type')
              : []
            delete newData.product
            delete newData.productData
            this.amendPOQtyForm.newData = JSON.stringify(newData)

          createShippingQtyApproval(this.amendPOQtyForm).then(res => {
            setTimeout(() => {
              this.$notify({ title: 'success', message: 'success', type: 'success' })
              this.$router.push('/shipment/ppShippingOrder')
              this.loadingSaveBut = false
              this.submitLoading = false
              localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
            }, 2000)
          })
        }
      })
    },
    createEmptyContainer() {
      return {
        type: '',
        qty: null,
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
        return
      }
      for (let i = 0; i < this.form.containers.length; i++) {
        this.ensureContainerRowReactive(this.form.containers[i])
      }
    },
    ensureContainerRowReactive(container) {
      const template = this.createEmptyContainer()
      Object.keys(template).forEach(key => {
        if (!(key in container)) {
          this.$set(container, key, template[key])
        }
      })
    },
    handleSubmitAddPoRequest() {
      if (!this.validateForm()) {
        return
      }
      let hasNew = false
      const orders = this.$refs.orderDetail.getDataList()
      orders.forEach(row => {
        if (row.items.filter(item => item.isNewAdd).length > 0) {
          hasNew = true
        }
      })
      if (!hasNew) {
        this.$message({
          message: `At least add one more`,
          type: 'error'
        })
        return
      }

      clearNonReeferTemperatureValidation(this.$refs.form, this.form.containers, this.containerOptions, 'type')
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`Are you sure? Booking will back to agent validation after agent accept your request.`, 'Warning', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            this.loadingSaveBut = true
            var newData = JSON.parse(JSON.stringify(this.form))
            newData.productData = [newData.product]
            newData.remark = newData.remark + '\n' + this.getRemark(newData)
            newData.products = newData.productData
            newData.orders = this.$refs.orderDetail.getDataList()
            newData.containers = newData.shipmentType == 'FCL'
              ? sanitizeContainersReeferFields(newData.containers, this.containerOptions, 'type')
              : []
            delete newData.product
            delete newData.productData
            this.addPoForm.newData = JSON.stringify(newData)
            createShippingApproval(this.addPoForm).then(res => {
              var vm = this
              setTimeout(function () {
                vm.$notify({
                  title: 'success',
                  message: 'success',
                  type: 'success'
                })
                vm.$router.push('/shipment/ppShippingOrder')
                vm.loadingSaveBut = false
                vm.submitLoading = false
                localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
              }, 2000)
            })
          })
        }
      })
    },
    getRemark(data) {
      var containerWeight = 0
      var text = 'Reefer Container:'
      for (var i = 0; i < data.containers.length; i++) {
        if (data.containers[i].soc == 'Yes') {
          flag = true
        }
        var c = this.containerOptions.find(element => element.type == data.containers[i].type)
        if (c != null && c.weight != null) {
          containerWeight += Number(c.weight) * Number(data.containers[i].qty)
        }
        if (data.containers[i].requireTemperature) {
          text +=
            '' +
            data.containers[i].type +
            ' Ventilation(cbm/hour):' +
            (data.containers[i].ventClosedOrNot ? data.containers[i].ventClosedOrNot : 'No') +
            ' Humidity(%):' +
            (data.containers[i].humidity ? data.containers[i].humidity : 'No') +
            ' O2(%):' +
            (data.containers[i].o2 ? data.containers[i].o2 : ' ') +
            ' CO2(%):' +
            (data.containers[i].co2 ? data.containers[i].co2 : ' ') +
            ' Drains:' +
            (data.containers[i].drains ? data.containers[i].drains : ' ')
          console.log(text)
        }
      }
      if (text == 'Reefer Container:') {
        text = ''
      }
      return text
    },
    amendPOQtyvalidateForm() {
      if (this.form.product.productEnglishName == null || this.form.product.productEnglishName.trim() == '') {
        this.$message({
          message: 'Product Name is required',
          type: 'error'
        })
        return false
      }
      if ((this.form.product.hscode && this.form.product.hscode.length !== 10) || !/^\d{10}$/.test(this.form.product.hscode)) {
        this.$message({
          message: 'HS Code must be exactly 10 digits',
          type: 'error'
        })
        return false
      }
      // 检查Containers
      if (this.form.shipmentType === 'FCL') {
        const containersCheck = this.containersCheck()
        if (!containersCheck) {
          return false
        }
      }
      return true
    },
    validateForm() {
      const dcCheck = this.validateDcOnSubmit(this.form.dc)
      if (!dcCheck.valid) {
        this.$message({
          message: dcCheck.message,
          type: 'error'
        })
        return false
      }
      if (this.form.product.productEnglishName == null || this.form.product.productEnglishName.trim() == '') {
        this.$message({
          message: 'Product Name is required',
          type: 'error'
        })
        return false
      }
      if (this.form.product.hscode && this.form.product.hscode.length < 10) {
        this.$message({
          message: 'HS Code must be at least 10 characters long',
          type: 'error'
        })
        return false
      }
      // 检查Containers
      if (this.form.shipmentType === 'FCL') {
        const containersCheck = this.containersCheck()
        if (!containersCheck) {
          return false
        }
      }

      return true
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
    },
    handleRemove(file, fileList) {
      this.form.product.fileList = fileList
    },
    getContainerList() {
      return getContainerList().then(response => {
        this.containerOptions = response.data || []
        this.ensureDefaultContainers()
        this.handleOptionChange()
      })
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
      if (!this.form.containers.length) {
        this.form.containers.push(this.createEmptyContainer())
      }
      this.handleOptionChange()
    },
    addContainers() {
      this.form.containers.push(this.createEmptyContainer())
    },
    restTemplate() {
      this.$refs['form'].resetFields()
    },
    handlePreview(file) {
      if (file.id) {
        window.location.href = file.fileUrl
      }
    },
    deleteDocument(row) {
      console.log('Deleting file:', row)
      this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
        type: 'warning'
      }).then(() => {
        deleteOrderFile(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: 'Success',
              type: 'success'
            })
            this.getPepcoOrderFileByOrder()
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    containersCheck() {
      // 计算货箱数量和 gross weight
      const { containersCount, maxGrossWeight } = resolveFormContainers(this.form.containers)
      if (containersCount >= 10) {
        this.$message({
          message: 'The number of containers equipment quantity cannot be greater than or equal to 10',
          type: 'warning'
        })
        return false
      }
      console.log('Max Gross Weight(kg) ', maxGrossWeight)
      const grossWeightError = validateContainersGrossWeight(maxGrossWeight, this.form.product.grossWeight)
      if (grossWeightError) {
        this.$message({
          message: grossWeightError,
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 增加hscode 必须输10位验证，
    // mark 2025-06-09
    validateHsCode(event) {
      console.log('validateHsCode called with event:', this.form.product.hscode)
      const value = event.target.value.trim()
      console.log('value', value)
      this.form.product.hscode = value

      if (value.length < 10) {
        this.$message({
          message: 'HS Code must be 10 characters',
          type: 'warning'
        })
      }
    },
    /**
     * 获取cargo ready date 最大值
     */
    updateCargoReadyDateMaxDate() {
      if (!this.headerDataList || this.headerDataList.length === 0) {
        this.cargoReadyDateMaxDate = null
        return
      }
      let maxTimestamp = -Infinity
      for (const item of this.headerDataList) {
        const timestamp = item.cargoReadyDate
        if (timestamp && !isNaN(timestamp)) {
          maxTimestamp = Math.max(maxTimestamp, timestamp)
        }
      }
      this.cargoReadyDateMaxDate = maxTimestamp !== -Infinity ? maxTimestamp : null
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
.shipping-create .card-css {
  border-radius: 0px !important;
  margin-top: 10px;
  padding: 0px 0px 10px 0px;
}
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
  position: relative;
  z-index: 1;
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
.parties-name {
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
}
.contact-info-css {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 10px 0px 10px;
}
.el-descriptions__title_css {
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: 700;
}
.el-divider.el-divider--horizontal {
  width: 100%;
}
.car-css {
  padding-bottom: 4px;
}
.delete-template-option {
  padding-left: 15px;
  float: right;
  font-size: 12px;
  color: #ff4949;
}
</style>
