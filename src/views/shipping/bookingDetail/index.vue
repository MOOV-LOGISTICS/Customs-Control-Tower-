<template>
  <div class="app-container shipping-detail" style="width:100%; margin: 0 auto">

    <div>
   <span class="no-label" v-if="form.status==2">
      <el-tag type="warning"
              style="position: absolute; right: 5%; top: 6%; font-size: 18px;">
        Rejected
      </el-tag>
    </span>

      <el-form v-loading="submitLoading" :model="form" :show-message="false" :disabled="true"
               label-width="250px">


        <el-card style="padding: 15px;margin-bottom: 10px;margin-top: 10px;">
          <div class="el-descriptions__title_css">{{form.soRef}}</div>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="3">
              <div style="float: left">
                <img
                  style="width: 100px; border-radius: 50px; height: 100px"
                  src="../../../assets/container.png"
                />
              </div>
            </el-col>
            <el-col :span="18">

              <el-descriptions
                style="box-shadow: none;"
                :colon="false"
                direction="vertical"
                class="margin-top"
                title=""
                :column="1"
              >
                <el-descriptions-item :label="$t('booking.container')">
                  <el-tag
                    style="margin-right: 10px"
                    v-for="(item, i) in form.containerDOList"
                    :key="i + 'container'"
                  >
                    {{ item.type }} x {{ item.qty }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('booking.cargoReadyDate')">
                  <p>{{ parseTime(form.cargoReadyForPickup) }}</p>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>

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
              {{form.customerRef}}
            </el-descriptions-item>
            <el-descriptions-item label="SO Type">
              {{form.shipmentType}}

            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.payment_term')">
              {{form.paymentTerm}}
            </el-descriptions-item>
            <el-descriptions-item label="Shipper ref">
              {{form.shipperRef}}
            </el-descriptions-item>
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
            <el-descriptions-item label="BL Types">
              {{form.blType}}
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
            <el-descriptions-item :label="$t('booking.truckServices')">
              {{form.truckServices}}
            </el-descriptions-item>

            <el-descriptions-item :label="$t('booking.originPort')">
              {{showPortLabel(form.originPort)}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.originLocation')">
              {{form.originLocation}}
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css" :label="$t('booking.needExportCustomServices')">
              {{form.needExportCustomerService}}
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css" :label="$t('booking.cargoReadyForPickup')">
              {{parseTime(form.cargoReadyForPickup)}}
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
            <el-descriptions-item :label="$t('booking.deliverServiceFromPodToFnd')">
              {{form.deliverServiceToFnd}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.destinationPort')">
              {{showPortLabel(form.destinationPort)}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.destinationLocation')">
              {{form.destinationLocation}}
            </el-descriptions-item>
            <el-descriptions-item label="Latest Deliver Date">
              {{parseTime(form.deliverDate)}}
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
            <el-descriptions-item :label="$t('booking.name')">
              {{form.contactName}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.phone')">
              {{form.contactPhone}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.email')">
              {{form.contactEmail}}
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
            <el-descriptions-item label="Shipper">
              {{form.shipperCompany}}
            </el-descriptions-item>

            <el-descriptions-item label="Consignee">
              {{form.consigneeCompany}}
            </el-descriptions-item>
            <el-descriptions-item label="Notify">
              {{form.notifyCompany}}
            </el-descriptions-item>
            <el-descriptions-item label="" >
              <div v-html="form.shipperAddress" style="white-space:pre-wrap"/>
            </el-descriptions-item>
            <el-descriptions-item label="">
              <div v-html="form.consigneeAddress" style="white-space:pre-wrap"/>
            </el-descriptions-item>
            <el-descriptions-item label="">
              <div v-html="form.notifyAddress" style="white-space:pre-wrap"/>
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
            <el-descriptions-item label="Mark&Numbers">
              {{item.markNumbers}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              {{item.productEnglishName}}
            </el-descriptions-item>
            <el-descriptions-item label="Product Chinese Name">
              {{item.productChineseName}}
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item>
            </el-descriptions-item>

            <el-descriptions-item :label="$t('booking.hsCode')">
              {{item.hscode}}
            </el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">
              {{item.numberOfPackages}}
            </el-descriptions-item>
            <el-descriptions-item label="Packages">
              {{showPackages(item.packages)}}

            </el-descriptions-item>
            <el-descriptions-item label="Gross Weight(KG)">
              {{item.grossWeight}}
            </el-descriptions-item>
            <el-descriptions-item label="Volume(CBM)">
              {{item.volume}}
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
                                  v-if="item.dg == 1">
              {{item.hazardousMaterials[dict.value]}}
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
                  {{item.remark}}
                </el-col>
                <el-col :span="6">
                  <el-upload style="margin-top: -30px;"
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
                  </el-upload>
                </el-col>
              </el-row>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css" v-if="form.shipmentType == 'FCL'">
          <div class="el-descriptions__title_css">Containers</div>


          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="2"> {{ $t("booking.containerType") }}
            </el-col>
            <el-col :span="3"> {{ $t("booking.numberOfContainers") }}
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
              </el-col
                >
            </el-row>
          </div>
        </el-card>
        <el-card v-show="!showTSHGSi&&!showCheckBtn &&form.shipmentId != null && form.shipmentType=='FCL'"
          class="card-css">
          <el-scrollbar>
            <!-- default-expand-all -->
            <el-table border :data="siForm.containers" style="width: 100%;" default-expand-all>



              <el-table-column label="Container No." width="130">
                <template v-slot="scope">
                  {{scope.row.containerNo}}
                </template>
              </el-table-column>
              <el-table-column label="Container Seal Number" width="130">
                <template v-slot="scope">
                  {{scope.row.containerSealNumber}}
                </template>
              </el-table-column>

                            <el-table-column label="Container Type" prop="containerType" width="120">
                            </el-table-column>
                            <el-table-column label="Number of packages" prop="numbersOfPackage" width="120">
                            </el-table-column>
                                          <el-table-column prop="packageType" label="Package Type" width="120">
                                            <template v-slot="scope">
                                              <el-select filterable v-model="scope.row.packageType" placeholder="">
                                                <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label"
                                                  :value="dict.value" />
                                              </el-select>
                                            </template>
                                          </el-table-column>
                            <el-table-column label="Gross Weight" prop="grossWeight" width="120">
                            </el-table-column>
                            <el-table-column label="Volume" prop="volume" width="120">
                            </el-table-column>

              <el-table-column v-if="vgmShow" label="Tare Weight(KG)" width="120">
                <template v-slot="scope">
                  {{scope.row.tareWeight}}
                </template>
              </el-table-column>


                            <el-table-column prop="date" label="SOC" width="90">
                              <template v-slot="scope">
                                <el-checkbox v-model="scope.row.soc"></el-checkbox>
                              </template>
                            </el-table-column>
              <el-table-column label="Remark">
                <template v-slot="scope">
                  {{scope.row.remark}}
                </template>
              </el-table-column>
            </el-table>

          </el-scrollbar>
        </el-card>
        <el-card v-show="showTSHGSi&&!showCheckBtn &&form.shipmentId != null && form.shipmentType=='FCL'&& siList" class="card-css">
          <el-scrollbar>
            <!-- default-expand-all -->
            <el-table border :data="siForm.containers" style="width: 100%;" default-expand-all>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div style="margin-left:50px">
                    <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                                     :colon="false"
                                     direction="vertical" v-for="(item, index) in scope.row.productData"
                                     :key="'product' + index"
                                     class="margin-top" title="" :column="7">
                      <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"
                                    v-model="item.productEnglishName"
                                    maxlength="500" show-word-limit
                                    @input="item.productEnglishName = filterChinese(item.productEnglishName)"/>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                          <el-select filterable clearable remote v-model="item.hscode"
                                     :remote-method="remoteGetHsCode" placeholder="Input to select"
                                     @change="selectBlur(item)">
                            <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode"
                                       :value="dict.hsCode"/>
                          </el-select>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">
                          <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0"/>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.packages'">
                          <el-select filterable v-model="item.packages" placeholder="">
                            <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                                       :label="dict.label"
                                       :value="dict.value"/>
                          </el-select>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.grossWeight'">
                          <el-input-number v-model="item.grossWeight" :precision="3" :controls="false"/>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                      :prop="'containers.' + scope.$index + '.productData.' + index + '.volume'">
                          <el-input-number v-model="item.volume" :precision="3" :controls="false"/>
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item>

                      </el-descriptions-item>

                    </el-descriptions>
                    <div style="width:100%;margin:10px ">
                      <el-row>
                        <el-col :span="6">
                          <b>Total Gross Weight:</b>
                          {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0),
                          0).toFixed(3) }}
                        </el-col>
                        <el-col :span="6">
                          <b>Total CBM:</b>
                          {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.volume) || 0),
                          0).toFixed(3)
                          }}
                        </el-col>
                        <el-col :span="6">
                          <b>Total Number of Packages:</b>
                          {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0),
                          0)
                          }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="date" label="SOC" width="180">
                <template v-slot="scope">
                  <el-checkbox v-model="scope.row.soc"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="Container Type" prop="containerType" width="180">
              </el-table-column>
              <el-table-column label="Sub Container Type">
                <template v-slot="scope">
                  {{scope.row.subContainerType}}
                </template>
              </el-table-column>
              <el-table-column label="Container No.">
                <template v-slot="scope">
                    {{scope.row.containerNo}}
                </template>

              </el-table-column>
              <el-table-column label="Container Seal Number">
                <template v-slot="scope">
                    {{scope.row.containerSealNumber}}
                </template>
              </el-table-column>
              <el-table-column v-if="vgmShow" label="Tare Weight(KG)">
                <template v-slot="scope">
                  {{scope.row.tareWeight}}
                </template>
              </el-table-column>
              <el-table-column label="Marks&Numbers">
                <template v-slot="scope">
                  {{scope.row.remark}}
                </template>
              </el-table-column>
            </el-table>
            <div style="width:100%;padding: 20px;">
              <el-row>
                <el-col :span="6">
                  <b>Total Gross Weight:</b>
                  {{ totalWeight().toFixed(3) }}
                </el-col>
                <el-col :span="6">
                  <b>Total CBM:</b>
                  {{ totalCBM().toFixed(3) }}
                </el-col>
                <el-col :span="6">
                  <b>Total Number of Packages:</b>
                  {{ totalVolum() }}
                </el-col>
              </el-row>
            </div>

          </el-scrollbar>
        </el-card>

        <el-card class="card-css" style="margin-bottom: 10px;">
          <div class="el-descriptions__title_css">Remark</div>
          <el-row>
            <el-col :span="24">
              {{form.remark}}
            </el-col>
          </el-row>
        </el-card>

                        <el-card class="card-css">
                          <div class="el-descriptions__title_css">Booking Files</div>
                                              <!-- <el-empty v-show="bookingNoteListShow.length == 0" description="No Document"></el-empty> -->
                                              <div style="cursor: pointer;width: 30%;margin-right: 10px;" v-for="file in bookingNoteListShow" >
                                                <div @click="handlePreview(file)">
                                                  {{ file.name }}
                                                </div>
                                              </div>
                        </el-card>

      </el-form>

      <el-row style="text-align: center; padding: 20px;"
              v-if="showCheckBtn&&form.shipmentId == null && form.status == 0">
        <el-col>
          <el-button class="el-icon-check" type="success" @click="acceptedStatus(form.id, 1, null, form.soRef)"
                     style="cursor: pointer;  "></el-button>
          <el-button class="el-icon-close"
                     style="cursor: pointer; "
                     type="warning" @click="closeShipping()"></el-button>
        </el-col>
      </el-row>

      <el-dialog title="Rejected" :visible.sync="showCloseRemark" width="70%" append-to-body>
        <el-form label-width="0px" ref="closeShippingForm" :model="closeShippingForm" :show-message="false">
          <el-form-item label="" required prop="closeRemark">
            <el-input type="textarea" :rows="5" placeholder="Remark..."
                      v-model="closeShippingForm.closeRemark"></el-input>
          </el-form-item>
          <el-button size="mini" type="primary" style="float:right;" :loading="closeShippingLoading"
                     @click="submitCloseShipping">{{
            $t("purchaseOrder.confirm") }}
          </el-button>
          <el-button size="mini" style="float:right; margin-right: 10px;" :loading="closeShippingLoading"
                     @click="showCloseRemark = false">{{
            $t("purchaseOrder.cancel") }}
          </el-button>
        </el-form>
      </el-dialog>

      </el-card>
    </div>
  </div>
</template>

<style scoped>
  .shipping-detail .card-css{
    border-radius: 10px !important;
    margin-top: 15px;
    padding: 15px !important;
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
  import { getOrder, updateShippingOrderStatus  } from "@/api/shipping/order";
  import { getBaseHeader } from "@/utils/request";
  import { getProductList } from "@/api/system/product";
  import { getContainerList } from "@/api/system/container";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
    import { getList } from "@/api/shipment/shipment";
  import { fileLoadMixin } from '@/utils/fileLoadMixin'

  export default {
    name: "shippingDetail",
    mixins: [fileLoadMixin],
    components: { },
    data() {
      return {
        siList:[],
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
        portList: [],
        shippingScheduleLoading:false,
        podList: [],
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
        showCloseRemark: false,
        closeShippingLoading:false,
        closeShippingForm:{
          closeRemark : '',
        },
        showCloseBut:true,
        showCheckBtn:false,
        shippedContainer:{},
        siForm:{},
        containerTypeList:[],
        vgmShow: false,
        bookingNoteListShow: [],
        showTSHGSi: false,
        shipment: {},


      };
    },
    mounted() {
    },
    created() {
      if (this.$route.query.source != 'shipping-order') {
        this.showCheckBtn = true;
      }
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
      getOrder( this.$route.query.id ).then(response=>{
        this.form = response.data
        if (this.form.shipmentType == 'FCL') {
          this.vgmShow = true
        }
        var shipmentContainerList = response.data.shipmentContainerDOList;
        this.bookingNoteListShow = response.data.files;

        for (var j = 0; j < shipmentContainerList.length; j++) {
            if (shipmentContainerList[j].type == 0) {
              continue
            }
            this.shippedContainer[shipmentContainerList[j].id] = {
              poNumber: shipmentContainerList[j].poNumber,
              containerNo: shipmentContainerList[j].containerNo,
              containerType: shipmentContainerList[j].containerType,
              departurePod: shipmentContainerList[j].departurePod,
              arrivalInlandTerminal: shipmentContainerList[j].arrivalInlandTerminal,
              emptyContainerReturn: shipmentContainerList[j].emptyContainerReturn,
              containerGateIn: shipmentContainerList[j].containerGateIn,
              subContainerType: shipmentContainerList[j].subContainerType,
              containerSealNumber: shipmentContainerList[j].containerSealNumber,
              remark: shipmentContainerList[j].remark,
              soc: shipmentContainerList[j].soc,
              tareWeight: shipmentContainerList[j].tareWeight,
            };
          }

        if(this.form.shipmentId!=null) {
          getList({ ids: this.form.shipmentId }).then((response1) => {
            for (var i = 0; i < response1.data.length; i++) {
              this.shipment = response1.data[i]
            }
            if (this.shipment.carrier == 'TSHG' || (this.shipment.originPort == 'CNNGB' && this.shipment.sinotrans)) {
              this.showTSHGSi = true
            }
            console.log(this.shipment.originPort)
            console.log(this.shipment.sinotrans)
            console.log(this.showTSHGSi)
            if (response.data && response.data.shipmentProductDOList && this.showTSHGSi) {
              var res = []
              var products = response.data.shipmentProductDOList
              if (products.filter((item) => item.type == 1).length > 0) {
                this.siList = products.filter((item) => item.type == 1);
              } else if (products.filter((item) => item.type == 4).length > 0) {
                this.siList = products.filter((item) => item.type == 4);
              }

              var data = JSON.parse(JSON.stringify(this.siList));
              for (var i = 0; i < data.length; i++) {
                var obj = res.find(
                  (element) =>
                    element.containerNo ==
                    this.shippedContainer[data[i].containerId].containerNo &&
                    element.containerSealNumber ==
                    this.shippedContainer[data[i].containerId].containerSealNumber
                );
                if (obj == null) {
                  res.push({
                    containerNo: this.shippedContainer[data[i].containerId].containerNo,
                    soc: this.shippedContainer[data[i].containerId].soc,
                    containerType: this.shippedContainer[data[i].containerId].containerType,
                    subContainerType: this.shippedContainer[data[i].containerId].subContainerType,
                    remark: this.shippedContainer[data[i].containerId].remark,
                    containerSealNumber: this.shippedContainer[data[i].containerId].containerSealNumber,
                    tareWeight: this.shippedContainer[data[i].containerId].tareWeight,
                    productData: [data[i]],
                  });
                } else {
                  obj.productData.push(data[i]);
                }
              }
              this.siForm.containers = res;
            }
            if (response.data && response.data.shipmentProductDOList && !this.showTSHGSi) {
              this.siForm.containers = shipmentContainerList.filter((item) => item.type != 0);
            }


          });
        }

      })
      getOriginDeliveryList().then((res)=>{
        this.portList=res.data
      })
    },
    methods: {
      showPortLabel(val){
        for (var c = 0; c < this.portList.length; c++) {
          if(this.portList[c].code == val){
            return this.portList[c].name
          }
        }
      },
      totalVolum() {
        if(!this.siForm || !this.siForm.containers){
          return 0
        }
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.numberOfPackages) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalCBM() {
        if(!this.siForm || !this.siForm.containers){
          return 0
        }
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.volume) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalWeight() {
        if(!this.siForm || !this.siForm.containers){
          return 0
        }
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.grossWeight) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      showPackages(value){
        var item = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
        for (var c = 0; c < item.length; c++) {
          if(item[c].value == value){
            return item[c].label
          }
        }
      },
      closeShipping(){
        this.showCloseRemark = true
        this.showCloseBut = true
      },
      submitCloseShipping(){
       this.$refs["closeShippingForm"].validate((valid) => {
          if (valid) {
            this.closeShippingLoading = true
            this.updateStatus(this.form.id, 2, this.closeShippingForm.closeRemark)
          }
        })
      },
      acceptedStatus(id, status, rejectedText, soRef){
        var vm = this
        this.$confirm('Accepted '+soRef+'?', '', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          vm.updateStatus(id,status,rejectedText)
        }).catch(() => {
        });
      },
      updateStatus(id, status, rejectedText){
        updateShippingOrderStatus({id: id, status: status, rejectedText: rejectedText}).then(res => {
          this.closeShippingLoading = false
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          });
          this.$router.push("/shipment/shippingBooking")
        })
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
