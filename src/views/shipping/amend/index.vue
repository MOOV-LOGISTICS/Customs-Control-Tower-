<template>
  <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="pd-20">
          <el-form v-loading="mvLoading" :model="form" ref="form" :show-message="false" label-width="0px">
            <el-card class="card-css">
              <div class="el-descriptions__title_css">General Info</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item label="Customer ref">
                  <el-form-item label prop="customerRef">
                    <el-input v-model="form.customerRef" clearable></el-input>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> SO Type
                  </template>
                  <el-form-item label prop="shipmentType">
                    <el-radio-group v-model="form.shipmentType" size="mini">
                      <el-radio v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.payment_term')}}
                  </template>
                  <el-form-item label prop="paymentTerm">
                    <el-select filterable v-model="form.paymentTerm">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Shipper ref">
                  <el-form-item label prop="shipperRef">
                    <el-input v-model="form.shipperRef" show-word-limit clearable></el-input>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>
                    Transport Mode
                  </template>
                  <el-form-item required prop="freightMethod">
                    <el-select size="mini" v-model="form.freightMethod" :placeholder="$t('booking.transportMode')" class="custom-select">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">BL Types</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>BL Types
                  </template>
                  <el-form-item prop="blType">
                    <el-select size="mini" v-model="form.blType" :placeholder="$t('booking.bl_type')" class="custom-select">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" v-if="dict.value != 'SEAWAY B/L'" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.truckServices')}}
                  </template>
                  <el-form-item label prop="truckServices">
                    <el-radio-group v-model="form.truckServices" size="mini">
                      <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.originPort')}}
                  </template>
                  <el-form-item label prop="originPort">
                    <el-select filterable v-model="form.originPort">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000" v-if="form.truckServices == 'Yes'">*</font>
                    {{$t('booking.originLocation')}}
                  </template>
                  <el-form-item label prop="originLocation">
                    <el-input type="textarea" :rows="1" v-model="form.originLocation"></el-input>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label-class-name="car-css">
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.needExportCustomServices')}}
                  </template>
                  <el-form-item label prop="needExportCustomerService">
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
                  <el-form-item label prop="cargoReadyForPickup">
                    <el-date-picker value-format="timestamp" v-model="form.cargoReadyForPickup" type="date"></el-date-picker>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
              </el-descriptions>

              <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.deliverServiceFromPodToFnd')}}
                  </template>
                  <el-form-item label prop="deliverServiceToFnd">
                    <el-radio-group v-model="form.deliverServiceToFnd" size="mini">
                      <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.destinationPort')}}
                  </template>
                  <el-form-item label prop="destinationPort">
                    <el-select filterable v-model="form.destinationPort">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000" v-if="form.deliverServiceToFnd == 'Yes'">*</font>
                    {{$t('booking.destinationLocation')}}
                  </template>
                  <el-form-item label prop="destinationLocation">
                    <el-input type="textarea" :rows="1" v-model="form.destinationLocation"></el-input>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Latest Deliver Date">
                  <el-form-item label prop="deliverDate">
                    <el-date-picker value-format="timestamp" v-model="form.deliverDate" type="date"></el-date-picker>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Booking Contact Info</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.name')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactName">
                    <el-input v-model="form.contactName" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.phone')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactPhone">
                    <el-input v-model="form.contactPhone" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.email')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactEmail">
                    <el-input v-model="form.contactEmail" />
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Parties</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Shipper
                  </template>
                  <el-form-item label prop="shipperCompany">
                    <el-input placeholder="Shipper Company" v-model="form.shipperCompany" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Consignee
                  </template>
                  <el-form-item label prop="consigneeCompany">
                    <el-input placeholder="Consignee Company" v-model="form.consigneeCompany" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Notify
                  </template>
                  <el-form-item label prop="notifyCompany">
                    <el-input placeholder="Notify Company" v-model="form.notifyCompany" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="shipperAddress">
                    <el-input placeholder="Shipper Address" type="textarea" :rows="4" v-model="form.shipperAddress" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="consigneeAddress">
                    <el-input placeholder="Consignee Address" type="textarea" :rows="4" v-model="form.consigneeAddress" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="notifyAddress">
                    <el-input placeholder="Notify Address" type="textarea" :rows="4" v-model="form.notifyAddress" />
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Products</div>

              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form.productData" :key="i" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Mark&Numbers
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.markNumbers'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.markNumbers" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('booking.productEnglishName')">
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.productEnglishName')}}
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.productEnglishName'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Product Chinese Name">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productChineseName" />
                </el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.hsCode')}}
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.hscode'">
                    <el-input v-model="item.hscode" clearable @blur="item.hscode = $event.target.value.trim()" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Number Of Packages">
                  <template slot="label">
                    <font color="#FF0000">*</font> Number Of Packages
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.numberOfPackages'">
                    <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Packages
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.packages'">
                    <el-select filterable v-model="item.packages" placeholder>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Gross Weight(KG)
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.grossWeight'">
                    <el-input-number v-model="item.grossWeight" :controls="false" :precision="3" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Volume(CBM)
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.volume'">
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
                      <el-input type="textarea" v-model="item.remark" />
                    </el-col>
                    <el-col :span="6">
                      <el-upload
                        class="upload-demo"
                        :ref="'upload' + i"
                        multiple
                        :action="url + '/admin-api/shipping/product/upload'"
                        :data="item.uploadData"
                        :headers="uploadHeaders"
                        :on-success="handleSuccess"
                        :file-list="item.fileList"
                        :auto-upload="false"
                        :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.fileList = files}, () => {item.fileList = []})"
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

            <el-card class="card-css" v-if="form.shipmentType == 'FCL'">
              <div class="el-descriptions__title_css">Containers</div>

              <el-row :gutter="20" style="margin-bottom: 10px">
                <el-col :span="3">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.containerType") }}
                </el-col>
                <el-col :span="3">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.numberOfContainers") }}
                </el-col>
                <el-col :span="3">{{ flag ? "Ventilation(cbm/hour)" : "" }}</el-col>
                <el-col :span="3">
                  <font color="#FF0000" v-show="flag">*</font>
                  {{ flag ? "Temperature(°C)" : "" }}
                </el-col>
                <el-col :span="3">
                  <font color="#FF0000" v-show="flag"></font>
                  {{ flag ? "Humidity(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="flag"></font>
                  {{ flag ? "O2(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="flag"></font>
                  {{ flag ? "CO2(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="flag"></font>
                  {{ flag ? "Drains" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000">*</font>SOC
                </el-col>
              </el-row>

              <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i" class="shipmentRouters-css">
                <el-row :gutter="20">
                  <el-col :span="3">
                    <el-form-item label-width="0px" :prop="'containers.' + i + '.type'">
                      <el-input v-model="item.type" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label-width="0px" :prop="'containers.' + i + '.qty'">
                      <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.ventClosedOrNot" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                      :prop="'containers.' + i + '.requireTemperature'"
                    >
                      <el-input v-model="item.requireTemperature" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.humidity" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.o2" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.co2" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-select v-model="item.drains">
                        <el-option label="Open" value="Open"></el-option>
                        <el-option label="Close" value="Close"></el-option>
                      </el-select>
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
                  </el-col>
                </el-row>
              </div>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Remark</div>
              <el-row>
                <el-col :span="24">
                  <el-input type="textarea" :rows="4" v-model="form.remark" />
                </el-col>
              </el-row>
            </el-card>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="pd-20">
          <el-form v-loading="mvLoading" :model="form2" ref="form2" :rules="dynamicFormRules()" :show-message="false" label-width="0px">
            <el-card class="card-css">
              <div class="el-descriptions__title_css">General Info</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item label="Customer ref">
                  <el-form-item label prop="customerRef">
                    <el-input v-model="form2.customerRef" clearable></el-input>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> SO Type
                  </template>
                  <el-form-item label prop="shipmentType">
                    <el-radio-group v-model="form2.shipmentType" size="mini">
                      <el-radio v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.payment_term')}}
                  </template>
                  <el-form-item label prop="paymentTerm">
                    <el-select filterable v-model="form2.paymentTerm">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Shipper ref">
                  <el-form-item label prop="shipperRef">
                    <el-input v-model="form2.shipperRef" show-word-limit clearable></el-input>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>
                    Transport Mode
                  </template>
                  <el-form-item required prop="freightMethod">
                    <el-select size="mini" v-model="form2.freightMethod" :placeholder="$t('booking.transportMode')" class="custom-select">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">BL Types</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="color:red;">*</span>BL Types
                  </template>
                  <el-form-item prop="blType">
                    <el-select size="mini" v-model="form2.blType" :placeholder="$t('booking.bl_type')" class="custom-select">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" v-if="dict.value != 'SEAWAY B/L'" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.truckServices')}}
                  </template>
                  <el-form-item label prop="truckServices">
                    <el-radio-group v-model="form2.truckServices" size="mini">
                      <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.originPort')}}
                  </template>
                  <el-form-item label prop="originPort">
                    <el-select filterable v-model="form2.originPort">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000" v-if="form2.truckServices == 'Yes'">*</font>
                    {{$t('booking.originLocation')}}
                  </template>
                  <el-form-item label prop="originLocation">
                    <el-input type="textarea" :rows="1" v-model="form2.originLocation"></el-input>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label-class-name="car-css">
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.needExportCustomServices')}}
                  </template>
                  <el-form-item label prop="needExportCustomerService">
                    <el-radio-group v-model="form2.needExportCustomerService" size="mini">
                      <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label-class-name="car-css">
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.cargoReadyForPickup')}}
                  </template>
                  <el-form-item label prop="cargoReadyForPickup">
                    <el-date-picker value-format="timestamp" v-model="form2.cargoReadyForPickup" type="date"></el-date-picker>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
              </el-descriptions>

              <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.deliverServiceFromPodToFnd')}}
                  </template>
                  <el-form-item label prop="deliverServiceToFnd">
                    <el-radio-group v-model="form2.deliverServiceToFnd" size="mini">
                      <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.destinationPort')}}
                  </template>
                  <el-form-item label prop="destinationPort">
                    <el-select filterable v-model="form2.destinationPort">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000" v-if="form2.deliverServiceToFnd == 'Yes'">*</font>
                    {{$t('booking.destinationLocation')}}
                  </template>
                  <el-form-item label prop="destinationLocation">
                    <el-input type="textarea" :rows="1" v-model="form2.destinationLocation"></el-input>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Latest Deliver Date">
                  <el-form-item label prop="deliverDate">
                    <el-date-picker value-format="timestamp" v-model="form2.deliverDate" type="date"></el-date-picker>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Booking Contact Info</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.name')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactName">
                    <el-input v-model="form2.contactName" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.phone')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactPhone">
                    <el-input v-model="form2.contactPhone" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.email')}}
                  </template>
                  <el-form-item label-width="0px" prop="contactEmail">
                    <el-input v-model="form2.contactEmail" />
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Parties</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Shipper
                  </template>
                  <el-form-item label prop="shipperCompany">
                    <el-select v-model="form2.shipperCompany" clearable filterable allow-create default-first-option @change="shipperChange" placeholder="Shipper Company">
                      <el-option v-for="item in shipperList" :label="item.shipperCompany" :value="item.shipperCompany"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Consignee
                  </template>
                  <el-form-item label prop="consigneeCompany">
                    <el-select v-model="form2.consigneeCompany" clearable filterable allow-create default-first-option @change="consigneeChange" placeholder="Shipper Company">
                      <el-option v-for="item in consigneeList" :label="item.consigneeCompany" :value="item.consigneeCompany"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Notify
                  </template>
                  <el-form-item label prop="notifyCompany">
                    <el-select v-model="form2.notifyCompany" clearable filterable allow-create default-first-option @change="notifyChange" placeholder="Shipper Company">
                      <el-option v-for="item in notifyPartyList" :label="item.notifyCompany" :value="item.notifyCompany"></el-option>
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="shipperAddress">
                    <el-input placeholder="Shipper Address" type="textarea" :rows="4" v-model="form2.shipperAddress" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="consigneeAddress">
                    <el-input placeholder="Consignee Address" type="textarea" :rows="4" v-model="form2.consigneeAddress" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label>
                  <el-form-item label prop="notifyAddress">
                    <el-input placeholder="Notify Address" type="textarea" :rows="4" v-model="form2.notifyAddress" />
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Products</div>
              <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form2.productData" :key="i" class="margin-top" title :column="3">
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Mark&Numbers
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.markNumbers'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.markNumbers" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('booking.productEnglishName')">
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.productEnglishName')}}
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.productEnglishName'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Product Chinese Name">
                  <el-form-item label :prop="'productData.' + i + '.productChineseName'">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productChineseName" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font>
                    {{$t('booking.hsCode')}}
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.hscode'">
                    <el-input v-model="item.hscode" clearable @blur="item.hscode = $event.target.value.trim()" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="Number Of Packages">
                  <template slot="label">
                    <font color="#FF0000">*</font> Number Of Packages
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.numberOfPackages'">
                    <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Packages
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.packages'">
                    <el-select filterable v-model="item.packages" placeholder>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Gross Weight(KG)
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.grossWeight'">
                    <el-input-number v-model="item.grossWeight" :controls="false" :precision="3" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <font color="#FF0000">*</font> Volume(CBM)
                  </template>
                  <el-form-item label :prop="'productData.' + i + '.volume'">
                    <el-input-number v-model="item.volume" :controls="false" :precision="3" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>

                <el-descriptions-item label="DG">
                  <el-form-item label :prop="'productData.' + i + '.dg'">
                    <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" inactive-text="No"></el-switch>
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="Batteries">
                  <el-form-item label :prop="'productData.' + i + '.batteries'">
                    <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                      <el-radio :label="2" border>Has batteries</el-radio>
                      <el-radio :label="3" border>No batteries</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item :label="dict.label" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="item.dg == 1">
                  <el-form-item label :prop="'productData.' + i + '.hazardousMaterials[dict.value]'">
                    <el-input v-model="item.hazardousMaterials[dict.value]" />
                  </el-form-item>
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
                      <el-form-item label :prop="'productData.' + i + '.remark'">
                        <el-input type="textarea" v-model="item.remark" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-upload
                        class="upload-demo"
                        :ref="'upload' + i"
                        multiple
                        :action="url + '/admin-api/shipping/product/upload'"
                        :data="item.uploadData"
                        :headers="uploadHeaders"
                        :on-success="handleSuccess"
                        :file-list="item.fileList"
                        :auto-upload="false"
                        :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.fileList = files}, () => {item.fileList = []})"
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

            <el-card class="card-css" v-if="form2.shipmentType == 'FCL'">
              <div class="el-descriptions__title_css">Containers</div>

              <el-row :gutter="20" style="margin-bottom: 10px">
                <el-col :span="3">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.containerType") }}
                </el-col>
                <el-col :span="3">
                  <font color="#FF0000">*</font>
                  {{ $t("booking.numberOfContainers") }}
                </el-col>
                <el-col :span="3">{{ conFlag2 ? "Ventilation(cbm/hour)" : "" }}</el-col>
                <el-col :span="3">
                  <font color="#FF0000" v-show="conFlag2">*</font>
                  {{ conFlag2 ? "Temperature(°C)" : "" }}
                </el-col>
                <el-col :span="3">
                  <font color="#FF0000" v-show="conFlag2"></font>
                  {{ conFlag2 ? "Humidity(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="conFlag2"></font>
                  {{ conFlag2 ? "O2(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="conFlag2"></font>
                  {{ conFlag2 ? "CO2(%)" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000" v-show="conFlag2"></font>
                  {{ conFlag2 ? "Drains" : "" }}
                </el-col>
                <el-col :span="2">
                  <font color="#FF0000">*</font>SOC
                </el-col>
              </el-row>

              <div style="margin-bottom: 5px" v-for="(item, index) in form2.containers" :key="index" class="shipmentRouters-css">
                <el-row :gutter="20">
                  <el-col :span="3">
                    <el-form-item label-width="0px" :prop="'containers.' + index + '.type'">
                      <el-input v-model="item.type" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label-width="0px" :prop="'containers.' + index + '.qty'">
                      <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.ventClosedOrNot'"
                      v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.ventClosedOrNot" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.requireTemperature'"
                      v-show="item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.requireTemperature" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.humidity'"
                      v-show="item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.humidity" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.o2'"
                      v-show="item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.o2" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.co2'"
                      v-show="item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-input v-model="item.co2" />
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item
                      label-width="0px"
                      :prop="'containers.' + index + '.drains'"
                      v-show="item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                    >
                      <el-select v-model="item.drains">
                        <el-option label="Open" value="Open"></el-option>
                        <el-option label="Close" value="Close"></el-option>
                      </el-select>
                    </el-form-item>
                    <span
                      v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  conFlag2) ||
                (!item.type && conFlag2)
              "
                    >&nbsp;</span>
                  </el-col>

                  <el-col :span="2">
                    <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
                  </el-col>
                </el-row>
              </div>
            </el-card>

            <el-card class="card-css">
              <div class="el-descriptions__title_css">Remark</div>
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="0px" prop="remark">
                    <el-input type="textarea" :rows="4" v-model="form2.remark" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="card-css" v-if="customerAdminReqFlag && apData.status < 2">
              <div class="el-descriptions__title_css">Amend Remark</div>
              <el-row>
                <el-col :span="24">
                  <Editor style="height: 200px; overflow-y: hidden;border: 1px solid #ccc; " v-model="amendRemark" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
                </el-col>
              </el-row>
              <div style="text-align: center;padding-top: 15px; padding-bottom: 10px;">
                <el-button size="mini" type="success" round :loading="butLoading" @click="submitRemark( 2)">Approve</el-button>
                <el-button size="mini" type="warning" round :loading="butLoading" @click="submitRemark( 3)">Reject</el-button>
              </div>
            </el-card>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.shipping-create .card-css {
  border-radius: 0px !important;
  margin-top: 15px;
  padding: 0px 0px 15px 0px;
}
.shipmentRouters-css .el-form-item__content {
  margin: 0 !important;
}
.shipmentRouters-css label.el-form-item__label {
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
</style>

<script>
import { getUserProfile } from '@/api/system/user'
import { createOrder, getOrder, getPartiesList } from '@/api/shipping/order'
import { getBaseHeader } from '@/utils/request'
import { getProductList } from '@/api/system/product'
import { updateStatus } from '@/api/shipping/approvalInfo'
import { getContainerList } from '@/api/system/container'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getHsCodeListByCode } from '@/api/system/hsCode'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: 'Shipment',
  mixins: [fileLoadMixin],
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      editorConfig: {
        placeholder: 'Remark...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
          uploadVideo: {
            customUpload(file, insertFn) {
              // TS 语法
              console.log(file)
              file
                .arrayBuffer()
                .then(buffer => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer)

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '')

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString)
                  console.log('Base64 Content:', base64String)
                  insertFn('data:video/mp4;base64,' + base64String, '')
                })
                .catch(error => {
                  console.error('Error reading file:', error)
                })
              //
            }
          }
        }
      },
      mode: 'default',
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
        containers: [{ type: null, qty: null }],
        productData: [],
        phone: '',
        email: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: ''
      },
      form2: {
        containers: [
          { type: null, qty: null },
          { type: null, qty: null },
          { type: null, qty: null },
          { type: null, qty: null }
        ],
        productData: [],
        phone: '',
        email: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: ''
      },
      phoneError: '',
      emailError: '',
      portOptions: [],
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
      polList: [],
      shippingScheduleLoading: false,
      podList: [],
      url: '',
      uploadHeaders: {},
      flag: false,
      conFlag2: false,
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
      mvLoading: false,
      shipperList: [],
      consigneeList: [],
      notifyPartyList: [],
      apData: {},
      amendRemark: null,
      customerAdminReqFlag: false,
      butLoading: false
    }
  },
  mounted() {
    if (this.$auth.hasPermi('shipment:customerRequest')) {
      this.customerAdminReqFlag = true
    }
  },
  created() {
    console.log('----------------amendShipping----------------')
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.form.productData.push({
      batteries: 3,
      hscode: '',
      fileList: [],
      uploadData: {},
      dg: 0,
      hazardousMaterials: {}
    })
    this.form2.productData.push({
      batteries: 3,
      hscode: '',
      fileList: [],
      uploadData: {},
      dg: 0,
      hazardousMaterials: {}
    })
    this.getPortList()
    this.getContainerList()
    if (this.$route.query.id) {
      this.mvLoading = true
      getOrder(this.$route.query.id).then(response => {
        if (this.$route.query.apId) {
          this.apData = response.data.approvalInfoList.find(element => element.id == this.$route.query.apId)
          this.form = JSON.parse(this.apData.originalData)
          this.form2 = JSON.parse(this.apData.newData)
        }
        var data = this.form.productDOList
        this.$set(this.form, 'productData', [])
        for (var j = 0; j < data.length; j++) {
          var item = data[j]
          item.uploadData = {}
          item.fileList = []
          if (item.hazardousMaterials == '{}') {
            item.dg = 0
            item.hazardousMaterials = JSON.parse(item.hazardousMaterials)
          } else {
            item.dg = 1
          }
          item.batteries = Number(item.batteries)
          if (!item.batteries) item.batteries = 3
          this.form.productData.push(item)
        }

        data = this.form2.productData
        if (!data) {
          // Ethan 20250513, pepco的单子无法显示：如果没有productData，使用product
          data = [this.form2.product]
        }
        this.$set(this.form2, 'productData', [])
        for (var j = 0; j < data.length; j++) {
          var item = data[j]
          item.uploadData = {}
          item.fileList = []
          if (item.hazardousMaterials == '{}') {
            item.hazardousMaterials = JSON.parse(item.hazardousMaterials)
          }
          item.batteries = Number(item.batteries)
          if (!item.batteries) item.batteries = 3
          this.form2.productData.push(item)
        }
        this.$set(this.form, 'containers', this.form.containerDOList)
        this.$set(this.form2, 'containers', this.form2.containers)
        this.$set(this.form2, 'tempaax', 1)
        this.$delete(this.form2, 'tempaax')
        setTimeout(() => {
          this.$refs.form2.validate(valid => {
            if (valid) {
            } else {
              return false
            }
          })
        }, 1000)
        this.mvLoading = false
      })
    } else {
      this.getUserInfo()
    }
  },
  methods: {
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    submitRemark(status) {
      var text = this.amendRemark
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br>]+>/g, '') // 将所有 换行符 replace ''
        .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
      if (status == 3 && !text) {
        this.$notify({ message: 'Please fill in the remarks', type: 'warning' })
        return
      }
      this.butLoading = true
      var req = {
        id: this.apData.id,
        status: status,
        remark: this.amendRemark
      }
      updateStatus(req).then(res => {
        this.butLoading = false
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        window.location.reload()
      })
    },
    shipperChange(val) {
      var data = this.shipperList.find(item => item.shipperCompany == val)
      if (data) {
        this.form2.shipperAddress = data.shipperAddress
      } else {
        this.form2.shipperAddress = null
      }
    },
    consigneeChange(val) {
      var data = this.consigneeList.find(item => item.consigneeCompany == val)
      if (data) {
        this.form2.consigneeAddress = data.consigneeAddress
      } else {
        this.form2.consigneeAddress = null
      }
    },
    notifyChange(val) {
      var data = this.notifyPartyList.find(item => item.notifyCompany == val)
      if (data) {
        this.form2.notifyAddress = data.notifyAddress
      } else {
        this.form2.notifyAddress = null
      }
    },
    // 根据form生成form2的动态验证规则
    dynamicFormRules() {
      const rules = {}
      // 遍历form的所有字段，并生成相应的验证规则
      for (let key in this.form) {
        if (Array.isArray(this.form[key])) {
          if (key == 'containers' || key == 'productData') {
            // 对于containers这样的嵌套数组，我们需要遍历每个对象并生成规则
            for (let i = 0; i < this.form2[key].length; i++) {
              for (let coKey in this.form2[key][i]) {
                rules[`${key}.${i}.${coKey}`] = [{ validator: this.validateSubListDifference, trigger: ['blur', 'change'] }]
              }
            }
          }
        } else if (this.form.hasOwnProperty(key)) {
          // 对于字符串类型的字段，生成一个验证规则来检查是否与form2中的相应字段不同
          rules[key] = [{ validator: this.validateFieldDifference, trigger: 'blur' }]
        }
      }
      return rules
    },
    // 自定义验证规则，用于比较两个表单中的字段值是否不同
    validateFieldDifference(rule, value, callback) {
      const fieldName = rule.field
      const fieldPathParts = fieldName.split('.')
      let comparedValue = this.form2
      for (let i = 0; i < fieldPathParts.length; i++) {
        if (comparedValue && comparedValue.hasOwnProperty(fieldPathParts[i])) {
          comparedValue = comparedValue[fieldPathParts[i]]
        } else {
          // 如果字段路径不正确，则默认验证通过
          callback()
          return
        }
      }
      // 由于我们之前已经确保了字段是字符串类型，这里可以直接比较值
      console.log(fieldName, comparedValue, this.form[fieldName], comparedValue !== this.form[fieldName])
      if (comparedValue !== this.form[fieldName]) {
        callback(new Error(`${fieldName.replace(/\[.*\]/g, '')}的值必须与表单1中的值不同`))
      } else {
        callback()
      }
    },
    validateSubListDifference(rule, value, callback) {
      // 这个方法与validateFieldDifference类似，但是专门用于处理subList字段的验证
      var fieldName = rule.field
      const fieldPathParts = fieldName.split('.')
      //数组长度不一致
      if (this.form[fieldPathParts[0]] && this.form[fieldPathParts[0]].length <= fieldPathParts[1]) {
        callback(new Error('Container的值必须与表单1中的值不同'))
        return
      }
      const form1ContainerValue = this.form[fieldPathParts[0]][fieldPathParts[1]][fieldPathParts[2]]
      if (value != form1ContainerValue) {
        callback(new Error('Container的值必须与表单1中的值不同'))
      } else {
        callback()
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
        this.$set(item, 'batteries', 3)
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
    handleOptionChange(value) {
      var arr = []
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == 'Yes') {
          arr.push(this.containerOptions[i].type)
        }
      }
      var flag = false
      for (var i = 0; i < this.form.containers.length; i++) {
        if (arr.indexOf(this.form.containers[i].type) > -1) {
          flag = true
          break
        }
      }
      var conFlag2 = false
      for (var i = 0; i < this.form2.containers.length; i++) {
        if (arr.indexOf(this.form2.containers[i].type) > -1) {
          flag = true
          break
        }
      }
      this.flag = flag
      this.conFlag2 = conFlag2
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
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))

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
          data.containers = JSON.stringify(data.containers)
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
          data.productData = JSON.stringify(data.productData)
          createOrder(data).then(response => {
            this.shippingId = response.data.shippingId
            for (var i = 0; i < response.data.productIds.length; i++) {
              this.form.productData[i].uploadData.exId = response.data.productIds[i]
            }
            var count = 0
            for (var i = 0; i < response.data.productIds.length; i++) {
              if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
                this.$refs['upload' + i][0].submit()
              }
            }
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.$router.push('/shipment/shippingOrder')
            this.loadingSaveBut = false
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
    },
    getContainerList() {
      getContainerList().then(response => {
        this.containerOptions = response.data
      })
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
    },
    addContainers() {
      this.form.containers.push({ type: '' })
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
