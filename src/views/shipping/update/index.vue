<template>
  <div class="app-container shipping-update" style="width:100%; margin: 0 auto">

    <el-card class="pd-20">

      <el-dialog
        :title="upload.title"
        :visible.sync="upload.open"
        width="400px"
        append-to-body
      >
        <el-upload  :disabled="si"  class="upload-demo" ref="uploadBookingNote" multiple action="#" :auto-upload="false"
                    :limit="1" accept=".xlsx,.xls" :on-exceed="handleExceed"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {bookingNoteListShow = files; handleChange(file, files)}, () => {bookingNoteListShow = []})"
                    :file-list="bookingNoteListShow" :on-preview="handlePreview1" :before-remove="beforeRemove"
                    :on-remove="handleRemove" drag>

          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("purchaseOrder.DragTheFileHereOr")
            }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
          </div>
          <div class="el-upload__tip text-center" slot="tip">
            <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
          </div>
        </el-upload>
      </el-dialog>

      <el-form v-loading="submitLoading" :disabled="si&&shipment.siDate!=null" :model="form" ref="form" :show-message="false" label-width="0px">


              <!-- <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo" ref="upload"
                action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="containersUpload" :show-file-list="false" :limit="1"> -->


                        <el-card class="card-css">
                          <div class="el-descriptions__title_css">Booking Files</div>
                          <div style="width: 20%;" >

                          <span  @click="downloadBookingTemplate()" >
                            <icon-park type="inbox-download-r"theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
                          </span>
                          <span  @click="handleImport()" >
                            <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"strokeLinecap="square"/>
                          </span>

                          </div>
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
              <el-form-item label="" prop="customerRef">
                <el-input  v-model="form.customerRef" :disabled="si" clearable></el-input>
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
                <el-radio-group v-model="form.shipmentType" size="mini" @input="changeSOType" :disabled="si">
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
                <el-select filterable v-model="form.paymentTerm" :disabled="si">
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
                  :disabled="si"
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
                <el-select size="mini" v-model="form.blType"
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
                <el-radio-group v-model="form.truckServices" size="mini" :disabled="si">
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
                <el-select filterable v-model="form.originPort" :disabled="si">
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
                <el-input type="textarea" :rows="1" v-model="form.originLocation" :disabled="si"></el-input>
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
                <el-radio-group v-model="form.needExportCustomerService" size="mini" :disabled="si">
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
                  type="date" :disabled="si"
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
                <el-radio-group v-model="form.deliverServiceToFnd" size="mini" :disabled="si">
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
                <el-select filterable v-model="form.destinationPort" :disabled="si">
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
                <el-input type="textarea" :rows="1" v-model="form.destinationLocation" :disabled="si"></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Latest Deliver Date">

              <el-form-item label="" prop="deliverDate">
                <el-date-picker
                  value-format="timestamp"
                  v-model="form.deliverDate"
                  type="date" :disabled="si"
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
                <el-input v-model="form.contactName" :disabled="si"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.phone')}}
              </template>
              <el-form-item required label-width="0px" prop="contactPhone">
                <el-input v-model="form.contactPhone" :disabled="si"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> {{$t('booking.email')}}
              </template>
              <el-form-item required label-width="0px" prop="contactEmail">
                <el-input v-model="form.contactEmail" :disabled="si"/>
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
              ><el-select
                v-model="form.shipperCompany"
                clearable
                filterable
                allow-create
                default-first-option
                @change="shipperChange"
                placeholder="Shipper Company">
                <el-option
                  v-for="item in shipperList"
                  :label="item.shipperCompany"
                  :value="item.shipperCompany">
                </el-option>
              </el-select>
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
                <el-select
                  v-model="form.consigneeCompany"
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  @change="consigneeChange"
                  placeholder="Shipper Company">
                  <el-option
                    v-for="item in consigneeList"
                    :label="item.consigneeCompany"
                    :value="item.consigneeCompany">
                  </el-option>
                </el-select>
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
                <el-select
                  v-model="form.notifyCompany"
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  @change="notifyChange"
                  placeholder="Shipper Company">
                  <el-option
                    v-for="item in notifyPartyList"
                    :label="item.notifyCompany"
                    :value="item.notifyCompany">
                  </el-option>
                </el-select>
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

          <el-row>
            <el-button @click="addProduct" size="mini" type="text">
              <i class="el-icon-plus"></i>
              {{
              $t("booking.addProduct")
              }}
            </el-button>
          </el-row>
          <el-descriptions
            style="box-shadow: none;"
            :colon="false"
            direction="vertical"
            v-for="(item, i) in form.productData"
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
                <el-input v-model="item.hscode" clearable @blur="item.hscode = $event.target.value.trim()"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="">
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
                    :action="url + '/admin-api/shipping/product/upload'"
                    :data="item.uploadData"
                    :on-preview="handlePreview"
                    :headers="uploadHeaders"
                    :on-success="handleSuccess"
                    :file-list="item.fileList"
                    :auto-upload="false"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.fileList = files}, () => {item.fileList = []})"
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


          <el-row>
            <el-button @click="addContainers" size="mini" type="text" v-show="!si">
              <i class="el-icon-plus"></i>
              {{
              $t("booking.addContainers")
              }}
            </el-button>
          </el-row>

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


          <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i"
               class="shipmentRouters-css">
            <el-row :gutter="20">
              <el-col :span="2">
                <el-form-item required label-width="0px" :prop="'containers.' + i + '.type'" >
                  <el-select
                    filterable
                    placeholder=""
                    v-model="item.type"
                    @change="handleOptionChange(item.type)" :disabled="si"
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
                  <el-input-number :controls="false" :precision="0" v-model="item.qty" :disabled="si" />
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
                    v-model="item.ventClosedOrNot" :disabled="si"
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
                    v-model="item.requireTemperature" :disabled="si"
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
                    v-model="item.humidity" :disabled="si"
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
                    v-model="item.o2" :disabled="si"
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
                    v-model="item.co2" :disabled="si"
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
                  <el-select v-model="item.drains" :disabled="si">
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
                <el-switch v-model="item.soc" active-text="Yes" inactive-text="No" :disabled="si">
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


        <el-card class="card-css" v-if="$route.query.source == 'amend'">
          <div class="el-descriptions__title_css">Amend Remark</div>
          <el-row>
            <el-col :span="24">
              <Editor
                style="height: 200px; overflow-y: hidden;border: 1px solid #ccc; "
                v-model="amendRemark"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
            </el-col>
          </el-row>
        </el-card>



                <el-card v-if="form.shipmentType=='FCL'&&si" class="card-css">
                   <el-form v-show="!showTSHGSi" :disabled="si&&shipment.siDate!=null" :model="siForm" ref="siForm" :show-message="false"
                          label-width="0px">
                                      <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
                                        <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo" ref="upload"
                                          action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="containersUpload" :show-file-list="false"
                                          :limit="1">
                                          <el-button size="mini" type="text"><i class="el-icon-plus"></i>Upload</el-button>
                                        </el-upload>
                                        <el-button @click="downloadTemplate" size="mini" type="text"><i class="el-icon-plus"></i>Download
                                          Template</el-button>
                                      </div>

            <el-scrollbar>
              <el-table border :data="siForm.containers" style="width: 100%;">
                <el-table-column label="Container No." width="150">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerNo'">
                      <el-input v-model="scope.row.containerNo" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="Container Seal Number" width="150">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerSealNumber'">
                      <el-input v-model="scope.row.containerSealNumber" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="Container Type" prop="containerType" width="100">
                </el-table-column>

    <el-table-column  prop="numbersOfPackage" label="Number of packages" width="120">
      <template v-slot="scope">
                            <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                              :prop="'containers.' + scope.$index + '.numbersOfPackage'">
        <el-input-number v-model="scope.row.numbersOfPackage" :precision="0" :controls="false" />
                            </el-form-item>
      </template>
    </el-table-column>
        <el-table-column prop="packageType" label="Package Type" width="120">
          <template v-slot="scope">
                                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                          :prop="'containers.' + scope.$index + '.packageType'">
            <el-select filterable v-model="scope.row.packageType" placeholder="">
              <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
                                        </el-form-item>
          </template>
        </el-table-column>
    <el-table-column prop="grossWeight" label="Gross Weight" width="150">
      <template v-slot="scope">
                                                <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                                  :prop="'containers.' + scope.$index + '.grossWeight'">
        <el-input-number v-model="scope.row.grossWeight" :precision="3" :controls="false" />
                                                </el-form-item>
      </template>
    </el-table-column>
    <el-table-column prop="volume"  label="Volume" width="150">
      <template v-slot="scope">
                                                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                                          :prop="'containers.' + scope.$index + '.volume'">
        <el-input-number v-model="scope.row.volume" :precision="3" :controls="false" />
                                                        </el-form-item>
      </template>
    </el-table-column>


                <el-table-column v-if="vgmShow" label="Tare Weight(KG)"  width="150">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.tareWeight'">
                      <el-input-number v-model="scope.row.tareWeight" :precision="3" :controls="false" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="SOC" width="80">
                  <template v-slot="scope">
                    <el-checkbox v-model="scope.row.soc"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="Remark">
                  <template v-slot="scope">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" placeholder="Remark"
                      v-model="scope.row.remark" />
                  </template>
                </el-table-column>
              </el-table>

            </el-scrollbar>
                          <div style="text-align: right;margin-top: 8px;">
                                                      <span style="margin-right:20px">
                                                        Leftover Numbers Of Package：{{ leftoverNumbersOfPackage.toFixed(4) }}
                                                      </span>
                            <span style="margin-right:20px">
                              Leftover Gross Weight：{{ leftoverGrossWeight.toFixed(4) }}
                            </span>
                            <span style="margin-right:20px">
                              Leftover Volume：{{ leftoverVolume.toFixed(4) }}
                            </span>
                          </div>
                  </el-form>

            <el-form v-show="showTSHGSi" :disabled="si&&shipment.siDate!=null" :model="siForm" ref="siForm" :show-message="false"
                          label-width="0px">

            <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
              <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo" ref="upload"
                action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="containersUpload" :show-file-list="false"
                :limit="1">
                <el-button size="mini" type="text"><i class="el-icon-plus"></i>Upload</el-button>
              </el-upload>
              <el-button @click="downloadTemplate" size="mini" type="text"><i class="el-icon-plus"></i>Download
                Template</el-button>
              <!-- <el-button @click="applyNewHsCode" size="mini" type="text"><i class="el-icon-plus"></i>Request new HS
                code</el-button> -->
            </div>

            <el-scrollbar>
              <!-- default-expand-all -->
              <el-table border :data="siForm.containers" style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div style="margin-left:50px">
                      <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important" :colon="false"
                        direction="vertical" v-for="(item, index) in scope.row.productData" :key="'product' + index"
                        class="margin-top" title="" :column="7">
                        <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" v-model="item.productEnglishName"
                              maxlength="500" show-word-limit
                              @input="item.productEnglishName = filterChinese(item.productEnglishName)" />
                          </el-form-item>
                        </el-descriptions-item>
                                    <el-descriptions-item v-if="shipment.carrier=='TSHG'" :label="index == 0 ? $t('booking.hsCode') : ''">
                                      <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                        :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                                        <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode"
                                          placeholder="Input to select" @change="selectBlur(item)">
                                          <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode" :value="dict.hsCode" />
                                        </el-select>
                                      </el-form-item>
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="shipment.carrier!='TSHG'" :label="index == 0 ? $t('booking.hsCode') : ''">
                                      <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                                        :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                                        <el-input v-model="item.hscode" />
                                      </el-form-item>
                                    </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">
                            <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.packages'">
                            <el-select filterable v-model="item.packages" placeholder="">
                              <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.grossWeight'">
                            <el-input-number v-model="item.grossWeight" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.volume'">
                            <el-input-number v-model="item.volume" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <el-button v-if="index == 0" type="text" @click="addProduct2(scope.row.productData)"><i
                                class="el-icon-plus"></i>Add
                              Product</el-button>
                          </template>
                          <el-button size="mini" v-if="index != 0" type="text" icon="el-icon-delete"
                            @click="handleDeleteProduct(scope.row.productData, index)">{{ $t("search.delete") }}</el-button>
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
                    <el-select v-model="scope.row.subContainerType" clearable filterable
                    :prop="'containers.' + scope.$index + '.subContainerType'"
                      @change="(value) => subContainerTypeChange(i, value)">
                      <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"
                        :key="item.type"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="Container No.">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerNo'"
                      >
                      <el-input v-model="scope.row.containerNo" />
                    </el-form-item>
                  </template>

                </el-table-column>
                <el-table-column label="Container Seal Number">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerSealNumber'">
                      <el-input v-model="scope.row.containerSealNumber" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column v-if="vgmShow" label="Tare Weight(KG)">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.tareWeight'">
                      <el-input-number v-model="scope.row.tareWeight" :precision="3" :controls="false" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="Marks&Numbers">
                  <template v-slot="scope">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" placeholder="Marks&Numbers"
                      v-model="scope.row.remark" />
                  </template>
                </el-table-column>
              </el-table>
              <div style="width:100%;margin: 20px;">
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
                  </el-form>
                </el-card>


        <el-row style="text-align: center; padding: 20px;">
          <el-button size="mini" @click="submit()" type="primary" v-loading="loadingSaveBut"> Submit
          </el-button>
        </el-row>

      </el-form>
    </el-card>

      <el-dialog title="Import Container No Failed" :visible.sync="errorDialog" append-to-body>
        <el-table :data="gridData">
          <el-table-column property="index" label="Line" width="150"></el-table-column>
          <el-table-column property="containerType" label="Type" width="200">
            <template slot-scope="scope">
              {{ scope.row.subContainerType? scope.row.subContainerType:scope.row.containerType}}
            </template>
          </el-table-column>
          <el-table-column property="containerNo" label="Container No"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="Import HS code Failed" :visible.sync="checkHsCodeDialog" append-to-body>
        <el-table :data="hsCodeData">
          <el-table-column property="hsCode" label="HS code" width="200">
            <template slot-scope="scope">
              {{ hsCodeData[scope.$index] }}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="Request new HS code" width="500px" :visible.sync="applyHsCodeVisable" append-to-body>
        <el-form ref="hsCodeForm" :model="hsCode">
          <el-form-item required label="HS code" label-width="120px">
            <el-input v-model="hsCode.hsCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item required label="Description" label-width="120px">
            <el-input v-model="hsCode.productEnglishName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="applyHsCodeVisable = false">Cancel</el-button>
          <el-button type="primary" @click="submitHsCode">Submit</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<style scoped>
  .shipping-update .card-css{
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
  import { getOrder, updateOrder, getPartiesList , uploadShippingFile, downloadShippingOrderTemplate  } from "@/api/shipping/order";
  import { createApprovalInfo } from "@/api/shipping/approvalInfo";
  import { getBaseHeader } from "@/utils/request";
  import { getProductList } from "@/api/system/product";
  import { getContainerList } from "@/api/system/container";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
  import { getList } from "@/api/shipment/shipment";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { i18nChangeLanguage } from '@wangeditor/editor';
  import { draftSI, downloadContainersTemplate , downloadShipperSinotransContainersTemplate } from "@/api/shipment/shipment";
  import { getContainerTypeCodeList } from "@/api/system/containerTypeCode";
  import { getHsCodeListByCode, getDataByHsCodes, applyNewHsCode } from "@/api/system/hsCode";
  import { getContainerNoByNoAndType, checkDataByNoAndType } from "@/api/system/containerNo";
  import XLSX from "xlsx";
  import '@icon-park/vue/styles/index.css';
  import {IconPark} from '@icon-park/vue/es/all';
  import { fileLoadMixin } from '@/utils/fileLoadMixin'


  export default {
    name: "UpdateShipping",
    mixins: [fileLoadMixin],
    components: {  Editor, Toolbar, IconPark},
    data() {
      return {
        editor: null,
        editorConfig: { placeholder: 'Remark...',
          MENU_CONF:{
            uploadImage:{
              base64LimitSize: 20 * 1024 * 1024
            },
            uploadVideo:{
              customUpload(file, insertFn) {  // TS 语法
                console.log(file)
                file.arrayBuffer().then((buffer) => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer);

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString);
                  console.log("Base64 Content:", base64String);
                  insertFn('data:video/mp4;base64,'+base64String, '')
                }).catch((error) => {
                  console.error("Error reading file:", error);
                });
                //
              }
            }
          }
        },
        mode: 'default',
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
          remark:'',
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
        shippingId: null,
        si: false,
        shipment: {},

        siForm: {
          containers: []
        },
        hsCodeList: [],
        containerTypeList: [],
        changeContainer: {},
        containerOptions: [],
        containersHeaders: [
          "Sub Container Type",
          "Container Type",
          "Container No",
          "Container Seal Number",
          "Marks&Numbers",
          "Tare Weight",
          "Product Name",
          "HS code",
          "Number Of Packages",
          "Packages",
          "Gross Weight(KG)",
          "Volume(CBM)"
        ],
        checkLoading: false,
        errorDialog: false,
        gridData: [],
        checkHsCodeDialog: false,
        hsCodeData: [],
        hsCode: {},
        applyHsCodeVisable: false,
        vgmShow: false,
        amendRemark: null,
        amendShippingForm: {},
        shipperList:[],
        consigneeList:[],
        notifyPartyList:[],

        bookingNoteList: [],
        delIds: [],
        bookingNoteListShow: [],

        showTSHGSi: false,

        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: getBaseHeader(),
        },
      };
    },
    mounted() {
    },
        computed: {
              leftoverGrossWeight() {
                return this.form.productData.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue.grossWeight);
                }, 0) - this.siForm.containers.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(typeof currentValue.grossWeight=='undefined'?0:currentValue.grossWeight);
                }, 0).toFixed(4)
              },
              leftoverNumbersOfPackage() {
                var num = this.form.productData.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.numberOfPackages;
                }, 0) - this.siForm.containers.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(typeof currentValue.numbersOfPackage == 'undefined' ? 0 : currentValue.numbersOfPackage);
                }, 0).toFixed(4)
                return num == 'NaN' ? 0 : num
              },
              leftoverVolume() {
                var num = this.form.productData.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue.volume);
                }, 0) - this.siForm.containers.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(typeof currentValue.volume == 'undefined' ? 0 : currentValue.volume);
                }, 0).toFixed(4)
                return num == 'NaN' ? 0 : num
              },
            },
    created() {
      if (this.$route.query.source == 'shipping-order') {
        this.si = true;
      }
      getPartiesList().then((res) =>{
        this.shipperList = res.data.shipper
        this.consigneeList = res.data.consignee
        this.notifyPartyList = res.data.notifyParty
      })
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
      this.shippingId = this.$route.query.id
      getOrder(this.shippingId  ).then(response=>{
        // if(response.data.status==1){
        //   this.$notify({
        //     message: response.data.soRef +' has been ordered. If you need to make modifications, please submit an application',
        //     type: 'warning'
        //   });
        //   this.$router.push('/shipment/shippingOrder');
        // }
        this.form = response.data

        this.amendShippingForm.soId =  this.form.id;
        this.amendShippingForm.originalData = JSON.stringify(response.data);

        if (this.form.shipmentType == 'FCL') {
          this.vgmShow = true
        }
        var productData = []
        for (var i = 0; i < response.data.productDOList.length; i++) {
            var d = response.data.productDOList[i];
            if (d.hazardousMaterials == "{}") {
              d.dg = 0;
            } else {
              d.dg = 1;
            }
            d.batteries = Number(d.batteries);
            if(!d.batteries) d.batteries = 3
            d.hazardousMaterials = JSON.parse(d.hazardousMaterials);
            d.fileList = d.files;
            d.uploadData = {};
            productData.push(d);
        }
        this.$set(this.form, "productData", productData)
        this.$set(this.form, "containers", response.data.containerDOList)
        this.handleOptionChange()

        this.bookingNoteListShow = response.data.files;

        if (this.$route.query.source == 'shipping-order') {
          getList({ ids: this.form.shipmentId }).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              this.shipment = response.data[i]
            }
            if(this.shipment.carrier=='TSHG'|| (this.shipment.originPort == 'CNNGB' && this.shipment.sinotrans)) {
              this.showTSHGSi = true
            }
            console.log(this.shipment.originPort)
            console.log(this.shipment.sinotrans)
            console.log(this.showTSHGSi)
            this.siForm.id = this.shipment.id
            this.getContainerTypeCodeList()
            for (var i = 0; i < this.shipment.containerDOList.length; i++) {
              if (this.shipment.containerDOList[i].type == 0) {
                for (var j = 0; j < this.shipment.containerDOList[i].numbers; j++) {
                  this.siForm.containers.push({
                    containerType: this.shipment.containerDOList[i].containerType,
                    productData: [{}]
                  })
                }
              }
            }
            this.setData(4)
            this.setData(1)
          });
        }
      })
      var data = getBaseHeader();
      this.uploadHeaders = data;
      this.url = process.env.VUE_APP_BASE_API;
      this.getPortList();
    },
    methods: {
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "Import";
        this.upload.open = true;
      },
      onCreated(editor) {
        i18nChangeLanguage('en')
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      shipperChange(val){
        var data = this.shipperList.find(item => item.shipperCompany == val)
        if(data){
          this.form.shipperAddress = data.shipperAddress
        }else{
          this.form.shipperAddress = null
        }
      },
      consigneeChange(val){
        var data = this.consigneeList.find(item => item.consigneeCompany == val)
        if(data){
          this.form.consigneeAddress = data.consigneeAddress
        }else{
          this.form.consigneeAddress = null
        }
      },
      notifyChange(val){
        var data = this.notifyPartyList.find(item => item.notifyCompany == val)
        if(data){
          this.form.notifyAddress = data.notifyAddress
        }else{
          this.form.notifyAddress = null
        }
      },
      getHsCodeListByCode(hscode) {
        getHsCodeListByCode(hscode).then((response) => {
          this.hsCodeList = response.data;
        });
      },
      remoteGetHsCode(query) {
        if (query !== "" && query.length >= 4) {
          this.loading = true;
          this.getHsCodeListByCode(query);
          setTimeout(() => {
            this.options = this.hsCodeList.filter((item) => {
              return item.hsCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
            this.loading = false;
          }, 200);
        } else {
          this.options = [];
        }
      },
      getPortList() {
        getOriginDeliveryList().then((response) => {
          this.portOptions = response.data;

        });
      },
      changeSOType(val){
        if(val == 'FCL'){
          this.form.containers = [{ 'containers': "" }]
        }else{
          this.form.containers = []
        }
      },
      changeDG(item) {
        this.$set(item,'tempaax',1)
        this.$delete(item, 'tempaax');
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
      submit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.submitLoading=true
            this.loadingSaveBut = true
            var data = JSON.parse(JSON.stringify(this.form));

            var containerWeight = 0;
            var text='Reefer Container:'
            for (var i = 0; i < data.containers.length; i++) {
              if (data.containers[i].soc == "Yes") {
                flag = true;
              }
              var c = this.containerOptions.find(
                (element) => element.type == data.containers[i].type
              );
              if (c != null && c.weight != null ) {
                containerWeight += Number(c.weight) * Number(data.containers[i].qty);
              }
              if(data.containers[i].requireTemperature){
                text+=''+data.containers[i].type
                +' Ventilation(cbm/hour):'+(data.containers[i].ventClosedOrNot?data.containers[i].ventClosedOrNot:'No')
                +' Humidity(%):'+ (data.containers[i].humidity?data.containers[i].humidity:'No')
                +' O2(%):'+(data.containers[i].o2?data.containers[i].o2:' ')
                +' CO2(%):'+(data.containers[i].co2?data.containers[i].co2:' ')
                +' Drains:'+(data.containers[i].drains?data.containers[i].drains:' ')
              }

            }
            if(text=='Reefer Container:'){
              text=''
            }
            data.remark=data.remark+'\n'+text
            data.containers = JSON.stringify(data.containers);
            var flag = false;
            var grossWeight = 0;
            for (var i = 0; i < data.productData.length; i++) {
              data.productData[i].hazardousMaterials = JSON.stringify(
                data.productData[i].hazardousMaterials
              );
              if (data.productData[i].dg == 1) {
                flag = true;
              }
              grossWeight += Number(data.productData[i].grossWeight);
            }
            this.uploadCount=0
            this.successCount=0
            data.productData = JSON.stringify(data.productData);
            if (this.si == true) {
              data.source = 'shipping-order'
            }
            if(this.si == true && this.form.shipmentType == 'FCL') {
              this.$refs['siForm'].validate((valid) => {
                if (valid) {
                  var containerNo = ''
                  for (var j = 0; j < this.siForm.containers.length; j++) {
                    if (this.siForm.containers[j].containerNo == null || !this.isValidContainerNumber(this.siForm.containers[j].containerNo.replace(/(^\s*)|(\s*$)/g, '').toUpperCase())) {
                      containerNo = this.siForm.containers[j].containerNo
                      this.$notify.error('Invalid Container No: ' + containerNo + ' , please check');
                      this.loadingSaveBut = false
                      this.submitLoading = false
                      throw new Error("siForm validate.");
                    } else {
                      this.siForm.containers[j].containerNo = this.siForm.containers[j].containerNo.replace(/(^\s*)|(\s*$)/g, '');
                    }

                    if (this.siForm.containers[j].containerSealNumber != null) {
                      this.siForm.containers[j].containerSealNumber = this.siForm.containers[j].containerSealNumber.replace(/(^\s*)|(\s*$)/g, '').toUpperCase();
                    }
                  }
                  if(this.showTSHGSi) {
                    for (var i = 0; i < this.siForm.containers.length; i++) {
                      var grossWeight = 0;
                      var volume = 0;
                      var numbersOfPackage = 0;
                      for (var j = 0; j < this.siForm.containers[i].productData.length; j++) {
                        grossWeight += Number(this.siForm.containers[i].productData[j].grossWeight);
                        volume += Number(this.siForm.containers[i].productData[j].volume);
                        numbersOfPackage += Number(this.siForm.containers[i].productData[j].numbersOfPackage);
                      }
                      this.siForm.containers[i].grossWeight = grossWeight
                      this.siForm.containers[i].numbers = this.siForm.containers[i].productData.length
                      this.siForm.containers[i].volume = volume
                      this.siForm.containers[i].numbersOfPackage = numbersOfPackage
                    }
                  }
                  this.siForm.source = 'shipping-order';
                } else {
                              this.loadingSaveBut = false
                  this.submitLoading = false
                  throw new Error("siForm validate.");
                }
              });
              data.status = 1
            }
            //如果是amend
            if(this.$route.query.source == 'amend'){

              this.amendShippingForm.newData = JSON.stringify(this.form);
              this.amendShippingForm.remark = this.amendRemark

              createApprovalInfo(this.amendShippingForm).then(res =>{
                this.loadingSaveBut = false
                this.submitLoading = false
                this.$router.push('/shipment/shippingOrder');
              })
              return
            }
            updateOrder(data).then((response) => {
              for (var i = 0; i < response.data.productIds.length; i++) {
                this.form.productData[i].uploadData.exId = response.data.productIds[i];
              }
              var count=0;
              for (var i = 0; i < response.data.productIds.length; i++) {
                if(this.$refs["upload" + i]&&this.$refs["upload" + i][0]){
                  this.$refs["upload" + i][0].submit();
                }
              }
              let formData = new FormData();
              formData.append("shppingId", this.form.id);
              formData.append("delIds", this.delIds);
              var fileList = []
              this.bookingNoteList.map(item => {
                if (item.id == null) {
                  formData.append("file", item.raw)
                  fileList.push("1")
                }
              });
              if (fileList.length > 0 || this.delIds.length > 0) {
                uploadShippingFile(formData).then((response) => {
                });
              }
              var vm = this
              setTimeout(function () {
                if (vm.si == true && vm.form.shipmentType == 'FCL') {
                  console.log(vm.siForm)
                  draftSI(vm.siForm).then((res) => {
                    vm.$notify({
                      title: 'success',
                      message: 'success',
                      type: 'success'
                    });
                    vm.loadingSaveBut = false
                    vm.submitLoading = false
                    const url = vm.$router.resolve({
                      path: "/shipment/shippingBookingDetail"
                    }).href;
                    window.location.href = url + '?id=' + vm.shippingId + '&source=shipping-order';
                  })
                } else {
                  vm.$notify({
                    title: 'success',
                    message: 'success',
                    type: 'success'
                  });
                  vm.loadingSaveBut = false
                  vm.submitLoading = false
                  const url = vm.$router.resolve({
                    path: "/shipment/shippingBookingDetail"
                  }).href;
                  window.location.href = url + '?id=' + vm.shippingId + '&source=shipping-order';
                }
              }, 2000);
            });
          } else {
            this.loadingSaveBut = false
            this.submitLoading = false
            throw new Error("form validate.");
          }
        });
      },
      handleSuccess(response, file, fileList) {
        this.successCount=this.successCount+1
      },
      handleDelete(index) {
        this.form.productData.splice(index, 1);
      },
      handleDeleteContainer(index) {
        this.form.containers.splice(index, 1);
      },
      addContainers() {
        this.form.containers.push({ type: "" });
      },

      parseTimeToZ1(timestamp) {
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
      setData(type) {
        var draftContainers = this.shipment.containerDOList.filter(
          (item) => item.type == type
        );
        if (draftContainers.length > 0) {
          var res = []
          for (var i = 0; i < draftContainers.length; i++) {

            var obj = JSON.parse(JSON.stringify(draftContainers[i]))
            var products = JSON.parse(JSON.stringify(this.shipment.productDOList.filter(item => item.shipmentId == this.shipment.id && item.containerId == obj.id)))

            obj.productData = products
            if (obj.productData.length == 0) {
              this.addProduct2(obj.productData)
            }
            obj.id = null;
            obj.type = null;
            res.push(obj)
          }
          this.siForm.containers = res
        }
      },
      addProduct2(data) {
        data.push({});
      },
      handleDeleteProduct(data, index) {
        data.splice(index, 1);
      },
      getContainerTypeCodeList() {
        getContainerTypeCodeList().then((response) => {
          this.containerTypeList = response.data;
        });
      },

      totalVolum() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.numberOfPackages) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalCBM() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.volume) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalWeight() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.grossWeight) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },

      containersUpload(file) {
        var vm = this
        this.file2Xce(file).then(tabJson => {
          if(this.showTSHGSi) {
            this.parseTailwindExcel(tabJson)
          } else {
            this.parseNoTailwindExcel(tabJson)
          }
        })

      },
      parseTailwindExcel(tabJson) {
        var vm = this
        if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
          var errorList = []
          var listTable = []
          vm.checkLoading = true;
          const keyList = Object.keys(tabJson[0].sheet[0]);

          //check key
          for (var i = 0; i < this.containersHeaders.length; i++) {
            if (this.containersHeaders[i] !== 'Sub Container Type' && !keyList.includes(this.containersHeaders[i])) {
              errorList.push(this.containersHeaders[i])
              break
            }
          }

          if (errorList.length > 0) {
            vm.$notify({
              title: 'Warning',
              message: errorList + " does not exist, Please use the import template to import",
              type: 'warning'
            });
            vm.checkLoading = false;
            return
          }
          //get data
          tabJson[0].sheet.forEach((item, index, key) => {
            listTable.push(item);
          }
          )

          //copy value
          const groupedData = {};
          listTable.forEach((item, index) => {
            const groupKey = `${item["Container Type"]}-${item["Container No"]}`;
            if (!groupedData[groupKey]) {
              groupedData[groupKey] = {
                "containerType": item["Container Type"],
                "containerNo": item["Container No"],
                "subContainerType": item["Sub Container Type"],
                "containerSealNumber": item["Container Seal Number"] + '',
                "remark": item["Marks&Numbers"],
                "tareWeight": item["Tare Weight"],
                "productData": []
              };
            }
            const productDataItem = {};
            // Copy the necessary properties to productDataItem
            productDataItem["productEnglishName"] = item["Product Name"];
            productDataItem["hscode"] = item["HS code"];
            productDataItem["numberOfPackages"] = item["Number Of Packages"];
            productDataItem["packages"] = item["Packages"];
            var packagesList = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
            var unitsFlag = false
            for (var i = 0; i < packagesList.length; i++) {
              unitsFlag = false
              if (packagesList[i].label == productDataItem["packages"]) {
                productDataItem["packages"] = packagesList[i].value
                unitsFlag = true
                break
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

          const groupedArray = Object.values(groupedData);

          if (vm.shipment.carrier == 'TSHG') {
            //Check containerNo,hsCode
            vm.checkTSHGData(groupedArray)
          } else {
            vm.pushData(groupedArray);
          }

        }
      },
      parseNoTailwindExcel(tabJson) {
        var vm = this
        if (tabJson && tabJson.length > 0) {
          var xlsxJson = tabJson
          console.log(tabJson)
          vm.siForm.containers = []
          var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
          for (var i = 0; i < xlsxJson[0].sheet.length; i++) {
            var index = i
            var item = xlsxJson[0].sheet[i]
            console.log(item)
            var errData = {}
            errData['index'] = index

            var container = {}
            container.containerType = item['Container Type']
            container.containerNo = item['Container No.']
            container.containerSealNumber = item['Container Seal No.']
            container.numbersOfPackage = item['Number Of Packages']
            container.grossWeight = item['Gross Weight(KG)']
            container.tareWeight = item['Tare Weight']
            container.volume = item['Volume(CBM)']
            var excelUnit = item['Package Type']
            if (excelUnit != null) {
              for (var unit of units) {
                if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
                  container.packageType = unit.value
                }
              }
            }
            var soc = item['SOC(TRUE/FALSE)']
            if (soc != null) {
              if (soc.toLowerCase == 'true' || soc == '1') {
                soc = true
              } else {
                soc = false
              }
            }
            container.soc = soc
            container.remark = item['Remark']
            vm.siForm.containers.push(container)
          }
          console.log(vm.siForm.containers)
        }
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

      checkTSHGData(groupedArray) {
        var vm = this

        // check  hsCode
        const queryList = []
        for (var i = 0; i < groupedArray.length; i++) {
          const productData = groupedArray[i]['productData']
          for (var j = 0; j < productData.length; j++) {
            queryList.push(productData[j].hscode)
          }
        }

        getDataByHsCodes(queryList).then((response2) => {
          var hsCodeErrorList = []
          if (response2.data.length > 0) {
            //筛选出不存在数据库中的数据
            hsCodeErrorList = queryList.filter(itemA =>
              !response2.data.some(itemB =>
                itemA == itemB.hsCode
              )
            );
          } else {
            hsCodeErrorList = queryList
          }

          if (hsCodeErrorList.length > 0) {
            vm.hsCodeData = hsCodeErrorList
            vm.checkHsCodeDialog = true;
            vm.checkLoading = false;
            return
          }
          vm.pushData(groupedArray);
        });

      },
      pushData(groupedArray) {
        var vm = this
        //push data
        for (var i = 0; i < vm.siForm.containers.length; i++) {
          for (var j = 0; j < groupedArray.length; j++) {

            if (vm.siForm.containers[i].containerType == groupedArray[j].containerType &&
              (!vm.siForm.containers[i].containerNo || vm.siForm.containers[i].containerNo != groupedArray[j].containerNo)) {
              vm.$set(vm.siForm.containers[i], 'containerNo', groupedArray[j].containerNo)
              vm.$set(vm.siForm.containers[i], 'subContainerType', groupedArray[j].subContainerType)
              vm.$set(vm.siForm.containers[i], 'containerSealNumber', groupedArray[j].containerSealNumber)
              vm.$set(vm.siForm.containers[i], 'remark', groupedArray[j].remark)
              vm.$set(vm.siForm.containers[i], 'soc', groupedArray[j].soc)
              vm.$set(vm.siForm.containers[i], 'tareWeight', groupedArray[j].tareWeight)
              vm.siForm.containers[i].productData = []

              vm.$set(vm.siForm.containers[i], 'productData', groupedArray[j].productData)

              groupedArray.splice(j, 1);
              break
            }
          }
        }
        vm.checkLoading = false;
      },

      downloadTemplate() {
        if(this.showTSHGSi) {
          downloadContainersTemplate({ 'shipmentId': this.shipment.id }).then((res) => {
            this.$download.excel(res, "import_template_containers.xlsx");
          })
        } else {
          downloadShipperSinotransContainersTemplate({ 'shipmentId': this.shipment.id }).then((res) => {
            this.$download.excel(res, "import_template_containers.xlsx");
          })
        }

      },
      subContainerTypeChange(index, subContainerType) {
        if (this.siForm.containers[index].containerType !== subContainerType) {
          this.siForm.containers[index].containerNo = null
        }
      },
      handleContainerChange(item) {
        this.changeContainer = item
      },
      applyNewHsCode() {
        this.applyHsCodeVisable = true
      },
      submitHsCode() {
        this.$refs['hsCodeForm'].validate((valid) => {
          if (valid) {
            applyNewHsCode(this.hsCode).then((res) => {
              this.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              });
              this.applyHsCodeVisable = false
              this.hsCode = {}
            })
          } else {
            return false;
          }
        });
      },
          //去除中文
      filterChinese(name) {
        return name.replace(/[\u4e00-\u9fa5]/g, '');
      },
      selectBlur(item) { },


      beforeRemove(file, fileList) {
        return this.$confirm(`Delete ${file.name}？`);
      },
      handleRemove(file, fileList) {
        this.bookingNoteList = fileList
        if(file.id!=null) {
          this.delIds.push(file.id)
        }
      },
      handlePreview1(file) {
        window.open(file.url, '_blank');
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`The current limit is 1 file, this time ${files.length} files are selected.`);
      },
      handleChange(file, fileList) {
        this.bookingNoteList = fileList
        var vm = this
        this.file2Xce1(file).then(tabJson => {
        })
      },
      file2Xce1(file) {
        var vm = this
        return new Promise(function (resolve, reject) {
          const reader = new FileReader()
          reader.onload = function (e) {
            const data = e.target.result
            this.wb = XLSX.read(data, {
              type: 'binary'
            })
            const result = []
            this.wb.SheetNames.forEach((sheetName) => {
              if ('Booking' == sheetName) {
                var json = this.wb.Sheets[sheetName]
                console.log(json)
                vm.form.customerRef = json['F5'] ? json['F5'].v : ''
                vm.form.shipmentType = json['F6'] ? json['F6'].v : ''
                vm.form.paymentTerm = json['F7'] ? json['F7'].v : ''
                vm.form.shipperRef = json['F8'] ? json['F8'].v : ''
                vm.form.blType = json['F9'] ? json['F9'].v : ''
                vm.form.originPort = json['B18'] ? json['B18'].v : ''
                vm.form.originLocation = json['D3'] ? json['D3'].v : ''
                var cargoReadyForPickup = json['G17'] ? json['G17'].w : ''
                var cargoReadyForPickupDate = new Date(cargoReadyForPickup);
                vm.form.cargoReadyForPickup = cargoReadyForPickupDate.getTime()
                vm.form.destinationPort = json['D18'] ? json['D18'].v : ''
                vm.form.destinationLocation = json['B3'] ? json['B3'].v : ''
                var deliver = json['G18'] ? json['G18'].w : ''
                var deliverDate = new Date(deliver);
                vm.form.deliverDate = deliverDate.getTime()
                vm.form.contactName = json['C23'] ? json['C23'].v : ''
                vm.form.contactPhone = json['C21'] ? json['C21'].v : ''
                vm.form.contactEmail = json['C22'] ? json['C22'].v : ''
                vm.form.shipperCompany = json['B6'] ? json['B6'].v : ''
                vm.form.shipperAddress = json['B7'] ? json['B7'].v : ''
                vm.form.consigneeCompany = json['B10'] ? json['B10'].v : ''
                vm.form.consigneeAddress = json['B11'] ? json['B11'].v : ''
                vm.form.notifyCompany = json['B14'] ? json['B14'].v : ''
                vm.form.notifyAddress = json['B15'] ? json['B15'].v : ''
                var hscode = json['F21'] ? json['F21'].v : ''
                var productDatas = []
                var productData = {}
                // form.productData
                productData.hscode = hscode
                productData.markNumbers = json['A20'] ? json['A20'].v : ''
                productData.productEnglishName = json['E20'] ? json['E20'].v : ''
                productData.numberOfPackages = json['C20'] ? json['C20'].v : ''
                productData.packages = json['D20'] ? json['D20'].v : ''
                productData.grossWeight = json['G20'] ? json['G20'].v : ''
                productData.volume = json['H20'] ? json['H20'].v : ''
                productData.uploadData = {}
                productDatas.push(productData)
                vm.form.productData = productDatas

                var containers = []
                if (json['E12'] != null && json['E12'] != '') {
                  var container = {}
                  container.type = json['E12'] ? json['E12'].v : ''
                  container.qty = json['F12'] ? json['F12'].v : ''
                  containers.push(container)
                }
                if (json['E13'] != null && json['E13'] != '') {
                  var container = {}
                  container.type = json['E13'] ? json['E13'].v : ''
                  container.qty = json['F13'] ? json['F13'].v : ''
                  containers.push(container)
                }
                if (json['E14'] != null && json['E14'] != '') {
                  var container = {}
                  container.type = json['E14'] ? json['E14'].v : ''
                  container.qty = json['F14'] ? json['F14'].v : ''
                  containers.push(container)
                }
                if (json['E15'] != null && json['E15'] != '') {
                  var container = {}
                  container.type = json['E15'] ? json['E15'].v : ''
                  container.qty = json['F15'] ? json['F15'].v : ''
                  containers.push(container)
                }
                if (json['E16'] != null && json['E16'] != '') {
                  var container = {}
                  container.type = json['E16'] ? json['E16'].v : ''
                  container.qty = json['F16'] ? json['F16'].v : ''
                  containers.push(container)
                }
                vm.form.containers = containers
                vm.form = JSON.parse(JSON.stringify(vm.form));

              }
            })
            resolve(result)
          }
          reader.readAsBinaryString(file.raw)
        })
      },

      downloadBookingTemplate() {
        downloadShippingOrderTemplate().then((res) => {
          this.$download.excel(res, "import_template_shipping_order.xlsx");
        })
          // window.open('https://www.smartmoovhub.com/admin-api/infra/file/5/get/b3d908540ef24384b878b552619be9be.xls', "_blank");
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
