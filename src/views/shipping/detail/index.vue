<template>
  <div class="app-container shipping-detail" style="width:100%; margin: 0 auto">

    <el-card class="pd-20">

      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" :disabled="true"
               label-width="250px">


        <el-card class="card-css">
          <div class="el-descriptions__title_css">General Info</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item label="Customer ref">
              <el-form-item label="" prop="customerRef">
                <el-input  v-model="form.customerRef"  clearable></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> SO Type
              </template>
              <el-form-item
                required
                label=""
                prop="shipmentType"
              >
                <el-radio-group v-model="form.shipmentType" size="mini">
                  <el-radio
                    v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    border
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.payment_term')}}
              </template>
              <el-form-item required label="" prop="paymentTerm">
                <el-select filterable v-model="form.paymentTerm">
                  <el-option
                    v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)"
                    :key="dict.value"
                    :label="dict.value"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Shipper ref">
              <el-form-item label="" prop="shipperRef">
                <el-input
                  v-model="form.shipperRef"
                  show-word-limit
                  clearable
                ></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="card-css">
          <div class="el-descriptions__title_css">BL Types</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item>
              <template slot="label">
                <span style="color:red;">*</span>BL Types
              </template>
              <el-form-item required prop="blType">
                <el-select  size="mini" v-model="form.blType"
                           :placeholder="$t('booking.bl_type')" class="custom-select">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE)" v-if="dict.value != 'SEAWAY B/L'"
                             :key="dict.value" :label="dict.label"
                             :value="dict.value"/>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="card-css">
          <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.truckServices')}}
              </template>
              <el-form-item
                required
                label=""
                prop="truckServices"
              >
                <el-radio-group v-model="form.truckServices" size="mini">
                  <el-radio
                    v-for="item in originOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    border
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>

              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.originPort')}}
              </template>
              <el-form-item
                required
                label=""
                prop="originPort"
              >
                <el-select filterable v-model="form.originPort">
                  <el-option
                    v-for="(item, index) in portOptions"
                    :key="index + 'pol'"
                     :label="item.name+' ('+item.code+')'"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000" v-if="form.truckServices == 'Yes'">*</font> {{$t('booking.originLocation')}}
              </template>
              <el-form-item
                :required="form.truckServices == 'Yes'"
                label=""
                prop="originLocation"
              >
                <el-input type="textarea" :rows="1" v-model="form.originLocation"></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css">

              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.needExportCustomServices')}}
              </template>
              <el-form-item
                required
                label=""
                prop="needExportCustomerService"
              >
                <el-radio-group v-model="form.needExportCustomerService" size="mini">
                  <el-radio
                    v-for="item in originOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    border
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css">
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.cargoReadyForPickup')}}
              </template>
              <el-form-item
                required
                label=""
                prop="cargoReadyForPickup"
              >
                <el-date-picker
                  value-format="timestamp"
                  v-model="form.cargoReadyForPickup"
                  type="date"
                >
                </el-date-picker>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
            </el-descriptions-item>

          </el-descriptions>

          <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.deliverServiceFromPodToFnd')}}
              </template>
              <el-form-item
                required
                label=""
                prop="deliverServiceToFnd"
              >
                <el-radio-group v-model="form.deliverServiceToFnd" size="mini">
                  <el-radio
                    v-for="item in originOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    border
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.destinationPort')}}
              </template>
              <el-form-item
                required
                label=""
                prop="destinationPort"
              >
                <el-select filterable v-model="form.destinationPort">
                  <el-option
                    v-for="(item, index) in portOptions"
                    :key="index + 'pod'"
                     :label="item.name+' ('+item.code+')'"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000" v-if="form.deliverServiceToFnd == 'Yes'">*</font>
                {{$t('booking.destinationLocation')}}
              </template>
              <el-form-item
                :required="form.deliverServiceToFnd == 'Yes'"
                label=""
                prop="destinationLocation"
              >
                <el-input type="textarea" :rows="1" v-model="form.destinationLocation"></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Latest Deliver Date">

              <el-form-item label="" prop="deliverDate">
                <el-date-picker
                  value-format="timestamp"
                  v-model="form.deliverDate"
                  type="date"
                >
                </el-date-picker>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
            </el-descriptions-item>
            <el-descriptions-item label="">
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Booking Contact Info</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.name')}}
              </template>
              <el-form-item required label-width="0px" prop="contactName">
                <el-input v-model="form.contactName"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.phone')}}
              </template>
              <el-form-item required label-width="0px" prop="contactPhone">
                <el-input v-model="form.contactPhone"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.email')}}
              </template>
              <el-form-item required label-width="0px" prop="contactEmail">
                <el-input v-model="form.contactEmail"/>
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Parties</div>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            class="margin-top"
            title=""
            :column="3"
          >
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Shipper
              </template>
              <el-form-item
                required
                label=""
                prop="shipperCompany"
              >
                <el-input placeholder="Shipper Company" v-model="form.shipperCompany"/>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Consignee
              </template>
              <el-form-item
                required
                label=""
                prop="consigneeCompany"
              >
                <el-input placeholder="Consignee Company" v-model="form.consigneeCompany"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Notify
              </template>
              <el-form-item
                required
                label=""
                prop="notifyCompany"
              >
                <el-input placeholder="Notify Company" v-model="form.notifyCompany"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
              <el-form-item
                required
                label=""
                prop="shipperAddress"
              >
                <el-input placeholder="Shipper Address" type="textarea" :rows="4" v-model="form.shipperAddress"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
              <el-form-item
                required
                label=""
                prop="consigneeAddress"
              >
                <el-input placeholder="Consignee Address" type="textarea" :rows="4" v-model="form.consigneeAddress"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
              <el-form-item
                required
                label=""
                prop="notifyAddress"
              >
                <el-input placeholder="Notify Address" type="textarea" :rows="4" v-model="form.notifyAddress"/>
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Products
          </div>

          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            v-for="(item, i) in form.productDOList"
            :key="i"
            class="margin-top"
            title=""
            :column="3"
          >
            <template slot="extra">
              <el-button
                v-if="i != 0"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(i)"
              >{{ $t("search.delete") }}
              </el-button
              >
            </template>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Mark&Numbers
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.markNumbers'"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  v-model="item.markNumbers"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">

              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.productEnglishName')}}
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.productEnglishName'"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  v-model="item.productEnglishName"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Product Chinese Name">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4 }"
                v-model="item.productChineseName"
              />
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.hsCode')}}
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.hscode'"
              >
                <el-select
                  filterable
                  clearable
                  remote
                  v-model="item.hscode"
                >
                  <el-option
                    v-for="dict in hsCodeList"
                    :key="dict.id"
                    :label="dict.hsCode"
                    :value="dict.hsCode"
                  />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">
              <template slot="label">
                <font color="#FF0000">*</font> Number Of Packages
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.numberOfPackages'"
              >
                <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Packages
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.packages'"
              >
                <el-select filterable v-model="item.packages" placeholder="">
                  <el-option
                    v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Gross Weight(KG)
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.grossWeight'"
              >
                <el-input-number v-model="item.grossWeight" :controls="false" :precision="3"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Volume(CBM)
              </template>
              <el-form-item
                required
                label=""
                :prop="'productData.' + i + '.volume'"
              >
                <el-input-number v-model="item.volume" :controls="false" :precision="3"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
              <el-switch
                @change="changeDG(item)"
                :active-value="1"
                :inactive-value="0"
                v-model="item.dg"
                active-text="Yes"
                inactive-text="No"
              >
              </el-switch>
            </el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label="Batteries">
              <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                <el-radio :label="2" border>Has batteries</el-radio>
                <el-radio :label="3" border>No batteries</el-radio>
              </el-radio-group>
            </el-descriptions-item>

            <el-descriptions-item :label="dict.label"
                                  v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
                                  :key="'d' + dict.value"
                                  v-if="item.dg == 1"
            >
              <el-input
                v-model="item.hazardousMaterials[dict.value]"
              />
            </el-descriptions-item>

            <el-descriptions-item v-if="item.dg == 0" label="">
            </el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label="">
            </el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label="">
            </el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label="">
            </el-descriptions-item>

            <el-descriptions-item label="">

              <el-row
                :gutter="20"
                style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px"
              >
                <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
                <el-col :span="8"> Remark</el-col>
                <el-col :span="6">Files</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-input type="textarea" v-model="item.remark"/>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    class="upload-demo"
                    :ref="'upload' + i"
                    multiple
                    :action="url + '/admin-api/shipment/product/upload'"
                    :data="item.uploadData"
                    :on-preview="handlePreview"
                    :headers="uploadHeaders"
                    :on-success="handleSuccess"
                    :file-list="item.files"
                    :auto-upload="false"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.files = files}, () => {item.files = [];item.uploadData = {}})"
                  >
                    <el-button slot="trigger" type="primary">{{
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

        <el-card class="card-css"  v-if="form.shipmentType == 'FCL'">
          <div class="el-descriptions__title_css">Containers</div>


          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="2">
              <font color="#FF0000">*</font>{{ $t("booking.containerType") }}
            </el-col>
            <el-col :span="3">
              <font color="#FF0000">*</font>{{ $t("booking.numberOfContainers") }}
            </el-col>
            <el-col :span="3">
              {{ flag ? "Ventilation(cbm/hour)" : "" }}
            </el-col>
            <el-col :span="3">
              <font color="#FF0000" v-show="flag">*</font
              >{{ flag ? "Temperature(°C)" : "" }}
            </el-col>
            <el-col :span="3">
              <font color="#FF0000" v-show="flag"></font
              >{{ flag ? "Humidity(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font
              >{{ flag ? "O2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font
              >{{ flag ? "CO2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font
              >{{ flag ? "Drains" : "" }}
            </el-col>
            <el-col :span="2"><font color="#FF0000">*</font>SOC</el-col>
          </el-row>


          <div style="margin-bottom: 5px" v-for="(item, i) in form.containerDOList" :key="i"
               class="shipmentRouters-css">
            <el-row :gutter="20">
              <el-col :span="2">
                <el-form-item required label-width="0px" :prop="'containers.' + i + '.type'">
                  <el-select
                    filterable
                    placeholder=""
                    v-model="item.type"
                    @change="handleOptionChange(item.type)"
                  >
                    <el-option
                      v-for="item  in containerOptions"
                      :label="item.type"
                      :value="item.type"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item required label-width="0px" :prop="'containers.' + i + '.qty'">
                  <el-input-number :controls="false" :precision="0" v-model="item.qty"/>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                >

                  <el-input
                    v-model="item.ventClosedOrNot"
                  />
                </el-form-item>
                <span
                  v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                >&nbsp;</span
                >
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              "
                              :required="
              item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'" :prop="'containers.' + i + '.requireTemperature'">
                  <el-input
                    v-model="item.requireTemperature"
                  />
                </el-form-item>
                <span
                  v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                >&nbsp;</span
                >
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input
                    v-model="item.humidity"
                  />
                </el-form-item>
                <span
                  v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                >&nbsp;</span
                >
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input
                    v-model="item.o2"
                  />
                </el-form-item>
                <span
                  v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                >&nbsp;</span
                >
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input
                    v-model="item.co2"
                  />
                </el-form-item>
                <span
                  v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)
                    .isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              "
                >&nbsp;</span
                >
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-select v-model="item.drains">
                    <el-option
                      label="Open"
                      value="Open">
                    </el-option>
                    <el-option
                      label="Close"
                      value="Close">
                    </el-option>
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
                >&nbsp;</span
                >
              </el-col>

              <el-col :span="2">
                <el-switch v-model="item.soc" active-text="Yes" inactive-text="No">
                </el-switch>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="i != 0"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteContainer(i)"
                >{{ $t("search.delete") }}
                </el-button
                >
              </el-col
              >
            </el-row>
          </div>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="form.remark"/>
            </el-col>
          </el-row>
        </el-card>

      </el-form>
      <el-row style="text-align: center; padding: 20px;" v-if="form.shipmentId == null && (form.status == 0 || form.status == 3)">
        <el-button size="mini" @click="toUpdate()" type="primary" v-loading="loadingSaveBut"> Update
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
  .shipping-detail .card-css{
    border-radius: 0px!important;
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
  .parties-name{
  font-size:14px; font-weight: 700; padding: 10px;
  }
  .contact-info-css{
    font-size:14px;
    font-weight: 700;
    padding: 10px 10px 0px 10px;
  }
  .el-descriptions__title_css{
    font-size:20px;
    margin-bottom:10px;
    margin-top:10px;
    font-weight: 700;
  }
  .el-divider.el-divider--horizontal{
    width: 100%;
  }
</style>

<script>
  import { getUserProfile } from "@/api/system/user";
  import { getOrder  } from "@/api/shipping/order";
  import { getBaseHeader } from "@/utils/request";
  import { getProductList } from "@/api/system/product";
  import { getContainerList } from "@/api/system/container";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
  import { fileLoadMixin } from '@/utils/fileLoadMixin'
  export default {
    name: "Shipment",
    mixins: [fileLoadMixin],
    components: { },
    data() {
      return {
        originOptions: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        loadingSaveBut:false,
        form: {
          containers: [{ containers: "" }],
          productData: [],
          phone: "",
          email: "",
          remark:''
        },
        phoneError: "",
        emailError: "",
        portOptions: [],
        soQueryParams:{
          pageNo: 1,
          pageSize: 10,
        },
        soLineTotal:0,
        containerOptions: [],
        shipmentId:null,
        parties: {
          Shipper: [],
          Consignee: [],
          "Notify Party": [],
          "Agreement Party": [],
        },
        partiesMap: {},
        open: false,
        partyForm: {
          partyRole: [],
        },
        vesslMap: {},
        reverseVesslMap: {},
        vesselList: [],
        vesselListLes: [],
        hsCodeList: [],
        craNumList: [],
        shippingScheduleLoading:false,
        url: "",
        uploadHeaders: {},
        flag: false,
        cra_pol: [],
        cra_pod: [],
        cra_origin: [],
        cra_disch: [],
        cra_contaier_type: [],
        craFlag: false,
        itemTableData:[],
        productMapForBook:{},
        orderMap: {},
        orderItemMap: {},
        applyHsCodeVisable:false,
        hsCode:{},
        uploadCount:0,
        successCount:0,
        submitLoading:false,
        soTableData:[],
        showTips:true,
        showCustomer:true,
      };
    },
    mounted() {
    },
    created() {
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
      getOrder( this.$route.query.id ).then(response=>{
        this.form = response.data
      })
      getOriginDeliveryList().then((res)=>{
        this.portOptions=res.data
      })
    },
    methods: {
      toUpdate(){
        const url = this.$router.resolve({
            path: "/shipment/updateShippingOrder"
        }).href;
        window.location.href = url+'?id='+this.$route.query.id ;
      },
      changeDG(item) {
        if (item.dg == 0) {
          this.$set(item, "hazardousMaterials", {});
        } else {
          this.$set(item, "batteries", 3);
        }
      },
      validatePhoneNumber() {
        const phoneNumber = this.form.phone;
        // 自定义验证逻辑
        if (
          !/^\d+$/.test(phoneNumber) ||
          phoneNumber.length < 8 ||
          phoneNumber.length > 15
        ) {
          this.phoneError = "";
        } else {
          this.phoneError = "";
        }
      },
      validateEmailAddress() {
        const emailAddress = this.form.email;
        // 自定义验证逻辑
        // 例如，验证是否是有效的电子邮件地址
        if (!isValidEmailAddress(emailAddress)) {
          this.emailError = "";
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
          if (arr.indexOf(this.form.containers[i].type) > -1) {
            flag = true;
            break;
          }
        }
        this.flag = flag;
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
      showWeight(item) {
        if (item.type == "") {
          return 0;
        } else {
          var c = this.containerOptions.find(
            (element) => element.type == item.type
          );
          if (c) {
            return (item.qty ? Number(item.qty) : 0) * c.weight;
          }
        }
      },

      handleSuccess(response, file, fileList) {
        this.successCount=this.successCount+1
        console.log('upload succ')
      },
      handleDelete(index) {
        this.form.productData.splice(index, 1);
      },
      handleDeleteContainer(index) {
        this.form.containers.splice(index, 1);
      },
      addContainers() {
        this.form.containers.push({ type: "" });
        console.log(this.form.containers);
      },

      parseTimeToZ1(timestamp) {
        console.log(timestamp,timestamp)
        if(!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      },
      handlePreview(file) {
        window.open(file.url,'_blank');
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
