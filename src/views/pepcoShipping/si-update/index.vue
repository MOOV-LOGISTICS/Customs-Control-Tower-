<template>
  <div class="app-container shipping-update" style="width:100%; margin: 0 auto">
    <el-card class="pd-20">
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload
          :disabled="si"
          class="upload-demo"
          ref="uploadBookingNote"
          multiple
          action="#"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx, .xls"
          :on-exceed="handleExceed"
          :file-list="bookingNoteListShow"
          :on-preview="handlePreview1"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :on-change="handleChange"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("purchaseOrder.DragTheFileHereOr")
            }}
            <em>{{ $t("purchaseOrder.clickUpload") }}</em>
          </div>
          <div class="el-upload__tip text-center" slot="tip">
            <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
          </div>
        </el-upload>
      </el-dialog>

      <el-form v-loading="submitLoading" :disabled="si&&shipment.siDate!=null" :model="form" ref="form" :show-message="false" label-width="0px">
        <!-- <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo" ref="upload"
        action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="containersUpload" :show-file-list="false" :limit="1">-->

        <!-- <el-card class="card-css">
                          <div class="el-descriptions__title_css">Booking Files</div>
                          <div style="width: 20%;" >

                          <span  @click="downloadBookingTemplate()" >
                            <icon-park type="inbox-download-r"theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
                          </span>
                          <span  @click="handleImport()" >
                            <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"strokeLinecap="square"/>
                          </span>

                          </div>
        </el-card>-->
        <el-card class="card-css">
          <div class="el-descriptions__title_css">Order Details</div>
          <order-detail ref="orderDetail"></order-detail>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">General Info</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item label="Customer ref">
              <el-form-item label prop="customerRef">
                <el-input v-model="form.customerRef" clearable disabled></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> SO Type
              </template>
              <el-form-item label prop="shipmentType">
                <el-radio-group v-model="form.shipmentType" size="mini" @input="changeSOType" :disabled="si||form.freightMethod === 'air'">
                  <el-radio v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <!--增加incoterm edwin-->
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.incoterm')}}
              </template>
              <el-form-item label prop="incoterm">
                <el-select filterable v-model="form.incoterm" :disabled="si">
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
                <el-select filterable v-model="form.namedPlace" :disabled="si">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label="Shipper ref">
              <el-form-item label prop="shipperRef">
                <el-input v-model="form.shipperRef" show-word-limit clearable :disabled="si"></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span style="color:red;">*</span>BL Types
              </template>
              <el-form-item prop="blType">
                <el-select size="mini" v-model="form.blType" :placeholder="$t('booking.bl_type')" class="custom-select" :disabled="si">
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
              <el-form-item prop="freightMethod">
                <el-select size="mini" v-model="form.freightMethod" :placeholder="$t('booking.transportMode')" disabled class="custom-select">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="card-css">
          <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.truckServices')}}
              </template>
              <el-form-item label prop="truckServices">
                <el-radio-group v-model="form.truckServices" size="mini" :disabled="si">
                  <el-radio v-for="item in originOptions" :key="item.value" :label="item.label" :value="item.value" border></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                {{ form.freightMethod === 'air'
                ? $t('booking.originAirport')
                : $t('booking.originPort') }}
              </template>
              <el-form-item label prop="originPort">
                <el-select filterable v-model="form.originPort" :disabled="si">
                  <el-option v-if="form.freightMethod !=='air'" v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  <el-option v-if="form.freightMethod ==='air'" v-for="(item, index) in airPortOptions" :key="index + 'airport-pol'" :label="item.airportName+' ('+item.iata+')'" :value="item.iata"></el-option>                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000" v-if="form.truckServices == 'Yes'">*</font>
                {{$t('booking.originLocation')}}
              </template>
              <el-form-item label prop="originLocation">
                <el-input type="textarea" :rows="1" v-model="form.originLocation" :disabled="si"></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css">
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.needExportCustomServices')}}
              </template>
              <el-form-item label prop="needExportCustomerService">
                <el-radio-group v-model="form.needExportCustomerService" size="mini" :disabled="si">
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
                <el-date-picker value-format="timestamp" v-model="form.cargoReadyForPickup" :picker-options="allCRDPickerOptions" type="date" disabled></el-date-picker>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label></el-descriptions-item>
          </el-descriptions>

          <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item>
              <template slot="label">{{$t('booking.deliverServiceFromPodToFnd')}}</template>
              <el-form-item label prop="deliverServiceToFnd">
                <el-radio-group v-model="form.deliverServiceToFnd" size="mini" :disabled="si">
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
                <el-select filterable v-model="form.destinationPort" :disabled="si">
                  <el-option v-if="form.freightMethod !=='air'" v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                  <el-option v-if="form.freightMethod ==='air'" v-for="(item, index) in airPortOptions" :key="index + 'airport-pod'" :label="item.airportName+' ('+item.iata+')'" :value="item.iata"></el-option>                </el-select>
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
              <el-form-item label prop="destinationLocation">
                <el-input type="textarea" :rows="1" v-model="form.destinationLocation" :disabled="si"></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Latest Deliver Date">
              <el-form-item label prop="deliverDate">
                <el-date-picker value-format="timestamp" v-model="form.deliverDate" type="date" :disabled="si"></el-date-picker>
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
                <el-input v-model="form.contactName" :disabled="si" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.phone')}}
              </template>
              <el-form-item label-width="0px" prop="contactPhone">
                <el-input v-model="form.contactPhone" :disabled="si" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.email')}}
              </template>
              <el-form-item label-width="0px" prop="contactEmail">
                <el-input v-model="form.contactEmail" :disabled="si" />
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
              <el-form-item required label prop="shipperCompany">
                <el-input placeholder="Shipper" v-model="form.shipperCompany" />
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
                <el-input placeholder="Consignee" v-model="form.consigneeCompany" />
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
                <el-input placeholder="Notify" v-model="form.notifyCompany" />
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

          <!-- <el-row>
            <el-button @click="addProduct" size="mini" type="text">
              <i class="el-icon-plus"></i>
              {{
              $t("booking.addProduct")
              }}
            </el-button>
          </el-row>-->
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form.productData" :key="i" class="margin-top" title :column="3">
            <template slot="extra">
              <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">{{ $t("search.delete") }}</el-button>
            </template>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Mark&Numbers
              </template>
              <el-form-item required label :prop="'productData.' + i + '.markNumbers'">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.markNumbers" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              <template slot="label">
                <font color="#FF0000">*</font>
                {{$t('booking.productEnglishName')}}
              </template>
              <el-form-item required label :prop="'productData.' + i + '.productEnglishName'">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" placeholder="Must Input English Product Name" />
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
              <el-form-item required label :prop="'productData.' + i + '.hscode'">
                <el-input v-model="item.hscode" clearable minlength="10" maxlength="10" @blur="validateHsCode($event, item)" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label>
              <template slot="label">
                <font color="#FF0000">*</font> Number Of Packages
              </template>
              <el-form-item required label :prop="'productData.' + i + '.numberOfPackages'">
                <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Packages
              </template>
              <el-form-item required label :prop="'productData.' + i + '.packages'">
                <el-select filterable v-model="item.packages" placeholder>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Gross Weight(KG)
              </template>
              <el-form-item required label :prop="'productData.' + i + '.grossWeight'">
                <el-input-number v-model="item.grossWeight" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Volume(CBM)
              </template>
              <el-form-item required label :prop="'productData.' + i + '.volume'">
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
                    :on-preview="handlePreview"
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
              <el-col :span="2">
                <el-form-item required label-width="0px" :prop="'containers.' + i + '.type'">
                  <el-select filterable placeholder v-model="item.type" @change="handleOptionChange(item.type)" :disabled="si">
                    <el-option v-for="item  in containerOptions" :label="item.type" :value="item.type" :key="item.id"></el-option>
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
              ">
                  <el-input v-model="item.ventClosedOrNot" :disabled="si" />
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
                  :required="
              item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'"
                  :prop="'containers.' + i + '.requireTemperature'"
                >
                  <el-input v-model="item.requireTemperature" :disabled="si" />
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.humidity" :disabled="si" />
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.o2" :disabled="si" />
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.co2" :disabled="si" />
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
                  <el-select v-model="item.drains" :disabled="si">
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
                <el-switch v-model="item.soc" active-text="Yes" inactive-text="No" :disabled="si"></el-switch>
              </el-col>
              <el-col :span="2"></el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="card-css">
          <div>
            <div class="el-descriptions__title_css">Documents(Manifest,ICS2,etcs)</div>
          </div>
          <el-divider></el-divider>
          <el-button type="primary" @click="uploadICS">Upload</el-button>

          <el-card class="box-card" style="margin-bottom: 10px;margin-right: 10px;margin-top: 10px;" v-show="fileTableData.length > 0">
            <div v-for="file in fileTableData" class="text-upload inline-item" size="mini" style="width: 400px;padding-right: 10px;">
              <div class="tools-but">
                <ActionButton :url="file.fileUrl" iconType="el-icon-view" type="preview" :fileName="file.fileName" buttonType="text" />
                <ActionButton :url="file.fileUrl" iconType="el-icon-download" type="download" :fileName="file.fileName" buttonType="text" />
                <!-- <el-button type="text" @click="handlePreviewShippingOrder(file)" icon="el-icon-download" style="margin-right: 6px"></el-button> -->
                <span @click="deleteDocument(file)">
                  <i class="el-icon-delete" />
                </span>
              </div>
              <el-descriptions :colon="false" :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px">
                <el-descriptions-item :label="$t('document.name')">{{ file.fileName }}</el-descriptions-item>
                <el-descriptions-item label="Order Number">{{ file.poNumber }}</el-descriptions-item>
                <el-descriptions-item label="Document Type">
                  {{
                  file.typeCode=='11'?'ICS2':file.typeCode=='12'?'Manifest':file.typeCode=='13'?'etc':''
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Document Number">{{ file.documentNumber }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-card>
        <el-card class="card-css">
          <div class="el-descriptions__title_css">Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="form.remark" />
            </el-col>
          </el-row>
        </el-card>

        <el-card class="card-css" v-if="$route.query.source == 'amend'">
          <div class="el-descriptions__title_css">Amend Remark</div>
          <el-row>
            <el-col :span="24">
              <Editor style="height: 200px; overflow-y: hidden;border: 1px solid #ccc; " v-model="amendRemark" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
            </el-col>
          </el-row>
        </el-card>

        <el-card v-show="form.shipmentType=='FCL'&&si" class="card-css">
          <el-form :disabled="si&&shipment.siDate!=null" :model="siForm" ref="siForm" :show-message="false" label-width="0px">
            <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
              <el-upload
                style="display:inline-block;padding-right: 10px;padding-left: 10px;"
                class="upload-demo"
                ref="upload"
                action="#"
                accept=".xlsx, .xls"
                :auto-upload="false"
                :on-change="containersUpload"
                :show-file-list="false"
                :limit="1"
              >
                <el-button size="mini" type="text">
                  <i class="el-icon-plus"></i>Upload
                </el-button>
              </el-upload>
              <el-button @click="downloadTemplate" size="mini" type="text">
                <i class="el-icon-plus"></i>Download
                Template
              </el-button>
              <!-- <el-button @click="applyNewHsCode" size="mini" type="text"><i class="el-icon-plus"></i>Request new HS
              code</el-button>-->
            </div>

            <el-scrollbar>
              <!-- default-expand-all -->
              <el-table border :data="siForm.containers" style="width: 100%;" default-expand-all>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div style="margin-left:50px">
                      <el-descriptions
                        style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                        :colon="false"
                        direction="vertical"
                        v-for="(item, index) in scope.row.productData"
                        :key="'product' + index"
                        class="margin-top"
                        title
                        :column="7"
                      >
                        <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                            <el-input
                              type="textarea"
                              :autosize="{ minRows: 1, maxRows: 2 }"
                              v-model="item.productEnglishName"
                              maxlength="500"
                              show-word-limit
                              @input="item.productEnglishName = filterChinese(item.productEnglishName)"
                            />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item v-if="shipment.carrier=='TSHG'" :label="index == 0 ? $t('booking.hsCode') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                            <el-input v-model="item.hscode" @input.native="item.hscode = $event.target.value.trim()" maxlength="10" clearable/>

                            <!-- <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode" allow-create	placeholder="Input to select" @change="selectBlur(item)">
                              <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode" :value="dict.hsCode" />
                            </el-select>-->
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item v-if="shipment.carrier!='TSHG'" :label="index == 0 ? $t('booking.hsCode') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                            <el-input v-model="item.hscode" @input.native="item.hscode = $event.target.value.trim()" maxlength="10" clearable/>
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">
                            <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.packages'">
                            <el-select filterable v-model="item.packages" placeholder>
                              <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.grossWeight'">
                            <el-input-number v-model="item.grossWeight" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.productData.' + index + '.volume'">
                            <el-input-number v-model="item.volume" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <el-button v-if="index == 0" type="text" @click="addProduct2(scope.row.productData)">
                              <i class="el-icon-plus"></i>Add
                              Product
                            </el-button>
                          </template>
                          <el-button size="mini" v-if="index != 0" type="text" icon="el-icon-delete" @click="handleDeleteProduct(scope.row.productData, index)">{{ $t("search.delete") }}</el-button>
                        </el-descriptions-item>
                      </el-descriptions>
                      <div style="width:100%;margin:10px ">
                        <el-row>
                          <el-col :span="6">
                            <b>Total Gross Weight:</b>
                            {{ (scope.row?.productData || []).reduce((sum, item) => {
                            return sum + (Number(item?.grossWeight) || 0);
                            }, 0).toFixed(3) }}
                          </el-col>
                          <el-col :span="6">
                            <b>Total CBM:</b>
                            {{ (scope.row?.productData || []).reduce((sum, item) => {
                            return sum + (Number(item?.volume) || 0);
                            }, 0).toFixed(3)
                            }}
                          </el-col>
                          <el-col :span="6">
                            <b>Total Number of Packages:</b>
                            {{ (scope.row?.productData || []).reduce((sum, item) => {
                            return sum + (Number(item?.numberOfPackages) || 0);
                            }, 0).toFixed(3)
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
                <el-table-column  label="Container Type">
                  <template v-slot="scope">
                    <el-select v-model="scope.row.containerType" filterable :prop="'containers.' + scope.$index + '.containerType'" >
                      <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type" :key="item.type"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
<!--                <el-table-column label="Sub Container Type">-->
<!--                  <template v-slot="scope">-->
<!--                    <el-select v-model="scope.row.subContainerType" clearable-->
<!--                      :prop="'containers.' + scope.$index + '.subContainerType'"  placeholder="Yes/No">-->
<!--                        <el-option label="Yes" value="Yes"></el-option>-->
<!--                        <el-option label="No" value="No"></el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-table-column>-->


                <el-table-column label="Container No.">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.containerNo'">
                      <el-input v-model="scope.row.containerNo" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="Container Seal Number">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.containerSealNumber'">
                      <el-input v-model="scope.row.containerSealNumber" />
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
                      <div>{{ sumVGM(scope.row).toFixed(3) }}</div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column v-if="shipment.carrier != 'TSHG'" prop="packageMethod" label="FCL/LCL" min-width="80">
                  <template v-slot="scope">
                    <el-select placeholder="" v-model="scope.row.packageMethod">
                      <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :label="item.label"
                        :value="item.value" :key="item.value" />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column label="Marks&Numbers">
                  <template v-slot="scope">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" placeholder="Marks&Numbers" v-model="scope.row.remark" />
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
          <el-button size="mini" @click="draftOrder" type="primary">Save Draft</el-button>
          <el-button size="mini" @click="submit" type="primary">Submit</el-button>
        </el-row>
      </el-form>
    </el-card>

    <el-dialog title="Import Container No Failed" :visible.sync="errorDialog" append-to-body>
      <el-table :data="gridData">
        <el-table-column property="index" label="Line" width="150"></el-table-column>
        <el-table-column property="containerType" label="Type" width="200">
          <template slot-scope="scope">{{ scope.row.subContainerType? scope.row.subContainerType:scope.row.containerType}}</template>
        </el-table-column>
        <el-table-column property="containerNo" label="Container No"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Import HS code Failed" :visible.sync="checkHsCodeDialog" append-to-body>
      <el-table :data="hsCodeData">
        <el-table-column property="hsCode" label="HS code" width="200">
          <template slot-scope="scope">{{ hsCodeData[scope.$index] }}</template>
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
    <upload-order-file ref="uploadOrderFile" @confirm="submitFile"></upload-order-file>
    <different-reminder
      :reminderVisible="reminderVisible"
      :reminderData="reminderData"
      :updateData="updateData"
      :reminderType="reminderType"
      @handleClose="handleClose"
      @updateSI="updateSI"
      @draftUpdateSI="draftUpdateSI" />
    <goods-info-reminder
      :goodsReminderVisible="goodsReminderVisible"
      :goodsReminderData="goodsReminderData"
      :originalShipperData="originalShipperData"
      :updateData="updateData"
      :reminderType="reminderType"
      @handleClose="onGoodsCompareClose"
      @onGoodsConfirm="onGoodsConfirm"
      @onGoodsDraft="onGoodsDraft" />
  </div>
</template>

<style scoped>
.shipping-update .card-css {
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
</style>

<script>
import { getUserProfile } from '@/api/system/user'
import {
  getOrder,
  updateOrder,
  getPartiesList,
  uploadShippingFile,
  downloadShippingOrderTemplate,
  draftOrder
} from '@/api/shipping/order'
import { createApprovalInfo } from '@/api/shipping/approvalInfo'
import { getBaseHeader } from '@/utils/request'
import { getProductList } from '@/api/system/product'
import { getContainerList } from '@/api/system/container'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import {downloadSupplierContainersTemplate, getList, siVGMDraft} from '@/api/shipment/shipment'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { draftSI, downloadContainersTemplate, downloadShipperSinotransContainersTemplate } from '@/api/shipment/shipment'
import { getContainerTypeCodeList } from '@/api/system/containerTypeCode'
import { getHsCodeListByCode, getDataByHsCodes, applyNewHsCode } from '@/api/system/hsCode'
import { getContainerNoByNoAndType, checkDataByNoAndType } from '@/api/system/containerNo'
import XLSX from 'xlsx'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import OrderDetail from '@/views/pepcoShipping/commponents/order-detail.vue'
import { getPepcoOrderFileByOrder, updatePepcoFileShippingId } from '@/api/order/task'
import { deleteFile } from '@/api/infra/file'
import { getAirportList } from '@/api/air/airport'
import { deleteOrderFile } from '@/api/pepco/order-file'
import uploadOrderFile from '../create/components/upload-order-file'
import { updateShippingOrder, getShippingOrderDetail } from '@/api/pepco/shipping-order'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { validateSupplierBookingDcOnSubmit } from '@/utils/shippingOrderConfig'
import { resolveFormContainers, validateContainersGrossWeight } from '@/utils/formContainersUtil'
import { createShippingApproval } from '@/api/pepco/shipping-approval'
import {DICT_TYPE, getDictDatas} from "@/utils/dict";
import DifferentReminder from "@/views/pepcoShipping/si-update/differentReminder.vue";
import GoodsInfoReminder from "@/views/pepcoShipping/si-update/goodsInfoReminder.vue";
import {mapGetters} from "vuex";

export default {
  name: 'UpdateShipping',
  mixins: [fileLoadMixin],
  components: {GoodsInfoReminder, DifferentReminder, Editor, Toolbar, IconPark, OrderDetail, uploadOrderFile },
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
        product: [],
        containers: [{ containers: '' }],
        productData: [],
        phone: '',
        email: '',
        remark: ''
      },
      airPortOptions: [],
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
      shippingId: null,
      si: false,
      shipment: {},

      siForm: {
        containers: []
      },
      containerTypeList: [],
      changeContainer: {},
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
      checkLoading: false,
      errorDialog: false,
      gridData: [],
      checkHsCodeDialog: false,
      hsCodeData: [],
      amendRemark: null,
      amendShippingForm: {},
      shipperList: [],
      consigneeList: [],
      notifyPartyList: [],

      bookingNoteList: [],
      delIds: [],
      bookingNoteListShow: [],

      isExpandAll: true,
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
      product: [],
      fileTableData: [],
      dcOptions: ['0006', '0015', '0018', '0021', '0027', '0030'],
      dcCode: '',
      cargoReadyDateMaxDate: null,
      headerDataList: [],
      reminderData: [],
      reminderVisible: false,
      updateData: null,
      reminderType: null,
      goodsReminderVisible: false,
      goodsReminderData: [],
      originalShipperData: null,
    }
  },
  mounted() {
    this.updateCargoReadyDateMaxDate()
  },
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    },
    allCRDPickerOptions() {
      return {
        disabledDate: date => {
          if (!this.cargoReadyDateMaxDate) return true
          return date.getTime() > this.cargoReadyDateMaxDate
        }
      }
    },
    leftoverGrossWeight() {
      // 安全计算产品数据总重量
      const getProductTotal = () => {
        try {
          return (this.form?.productData || []).reduce((sum, item) => {
            return sum + (Number(item?.grossWeight) || 0)
          }, 0)
        } catch (e) {
          console.error('计算产品总重量出错:', e)
          return 0
        }
      }

      // 安全计算容器总重量
      const getContainerTotal = () => {
        try {
          return (this.siForm?.containers || []).reduce((sum, container) => {
            const weight = Number(container?.grossWeight)
            return sum + (isNaN(weight) ? 0 : weight)
          }, 0)
        } catch (e) {
          console.error('计算容器总重量出错:', e)
          return 0
        }
      }

      // 最终计算结果（保留4位小数）
      return (getProductTotal() - getContainerTotal()).toFixed(4)
    },
    leftoverNumbersOfPackage() {
      // 安全计算产品数据总重量
      const getProductTotal = () => {
        try {
          return (this.form?.productData || []).reduce((sum, item) => {
            return sum + (Number(item?.numberOfPackages) || 0)
          }, 0)
        } catch (e) {
          console.error('计算产品总重量出错:', e)
          return 0
        }
      }

      // 安全计算容器总重量
      const getContainerTotal = () => {
        try {
          return (this.siForm?.containers || []).reduce((sum, container) => {
            const weight = Number(container?.numberOfPackages)
            return sum + (isNaN(weight) ? 0 : weight)
          }, 0)
        } catch (e) {
          console.error('计算容器总重量出错:', e)
          return 0
        }
      }

      // 最终计算结果（保留4位小数）
      return (getProductTotal() - getContainerTotal()).toFixed(4)
    },
    leftoverVolume() {
      // 安全计算产品数据总重量
      const getProductTotal = () => {
        try {
          return (this.form?.productData || []).reduce((sum, item) => {
            return sum + (Number(item?.volume) || 0)
          }, 0)
        } catch (e) {
          console.error('计算产品总重量出错:', e)
          return 0
        }
      }

      // 安全计算容器总重量
      const getContainerTotal = () => {
        try {
          return (this.siForm?.containers || []).reduce((sum, container) => {
            const weight = Number(container?.volume)
            return sum + (isNaN(weight) ? 0 : weight)
          }, 0)
        } catch (e) {
          console.error('计算容器总重量出错:', e)
          return 0
        }
      }

      // 最终计算结果（保留4位小数）
      return (getProductTotal() - getContainerTotal()).toFixed(4)
    },
    ...mapGetters(['nickname'])
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
    // 'form.freightMethod': {
    //   handler(val) {
    //     this.form.originPort = ''
    //     this.form.destinationPort = ''
    //     if (val === 'air') {
    //       this.getAirport()
    //     } else if (val) {
    //       this.getPortList()
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {
    if (this.$route.query.source == 'shipping-order') {
      this.si = true
    }
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })
    getContainerList().then(response => {
      this.containerOptions = response.data
    })
    this.shippingId = this.$route.query.id

    getOrder(this.shippingId).then(response => {
      console.log('getOrderInfo', response.data)
      // if(response.data.status==1){
      //   this.$notify({
      //     message: response.data.soRef +' has been ordered. If you need to make modifications, please submit an application',
      //     type: 'warning'
      //   });
      //   this.$router.push('/shipment/shippingOrder');
      // }
      this.form = response.data

      this.amendShippingForm.soId = this.form.id
      // 去除之前的approvalInfoList
      var originalData = JSON.parse(JSON.stringify(response.data))
      originalData.approvalInfoList = []
      this.amendShippingForm.originalData = JSON.stringify(originalData)

      const productData = []
      for (let i = 0; i < response.data.productDOList.length; i++) {
        const d = response.data.productDOList[i]
        d.dg = d.dg ? 1 : 0
        d.batteries = Number(d.batteries)
        if (!d.batteries) d.batteries = 3
        d.hazardousMaterials = JSON.parse(d.hazardousMaterials)
        d.fileList = d.files
        d.uploadData = {}
        productData.push(d)
      }
      this.$set(this.form, 'productData', productData)
      this.$set(this.form, 'containers', response.data.containerDOList)
      console.log('this.form', this.form)
      this.handleOptionChange()

      this.bookingNoteListShow = response.data.files

      if (this.$route.query.source == 'shipping-order') {
        getList({ ids: this.form.shipmentId }).then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.shipment = response.data[i]
          }

          console.log(this.shipment.originPort)
          console.log(this.shipment.sinotrans)
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
        })
      }
    })
    var data = getBaseHeader()
    this.getShippingOrder(this.shippingId)
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.getPortList()
    this.$nextTick(() => {
      this.$refs.orderDetail.active(this.shippingId)
    })
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
    getDictDatas,
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
      console.log('查询文件')
      getPepcoOrderFileByOrder(query).then(res => {
        console.log('上传文件的返回值', res)
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
        this.$set(this, 'dcCode', res.data.orderHeaders[0].dc)
        console.log('dcCode', this.dcCode)
        // this.form = res.data.shippingOrder
        // this.form.containers = res.data.containers
        // var product = res.data.products[0]
        // product.dg = product.hazardousMaterials == '{}' ? 0 : 1
        // product.uploadData = {}
        // product.hazardousMaterials = JSON.parse(product.hazardousMaterials)
        // product.batteries = Number(product.batteries) || 3
        // product.volume = Number(product.volume) || 0
        // this.form.productData = [product]
        // this.product = product
        // this.form.product = product
        this.headerDataList = res.data.orderHeaders
        console.log('1111')
        this.getPepcoOrderFileByOrder()
        console.log('222')
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = 'Import'
      this.upload.open = true
    },
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    shipperChange(val) {
      var data = this.shipperList.find(item => item.shipperCompany == val)
      if (data) {
        this.form.shipperAddress = data.shipperAddress
      } else {
        this.form.shipperAddress = null
      }
    },
    consigneeChange(val) {
      var data = this.consigneeList.find(item => item.consigneeCompany == val)
      if (data) {
        this.form.consigneeAddress = data.consigneeAddress
      } else {
        this.form.consigneeAddress = null
      }
    },
    notifyChange(val) {
      var data = this.notifyPartyList.find(item => item.notifyCompany == val)
      if (data) {
        this.form.notifyAddress = data.notifyAddress
      } else {
        this.form.notifyAddress = null
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
    changeSOType(val) {
      if (val == 'FCL') {
        this.form.containers = [{ containers: '' }]
      } else {
        this.form.containers = []
      }
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
      this.flag = flag
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
      console.log('submitinfo', this.form)
      console.log('submitinfo1', this.dcCode)
      console.log('upload file', this.fileTableData)

      // 2025/07/02 暂时取消
      // // 判断上传文件中必须有ICS2
      // const fileICS2 = this.fileTableData.find(file => file.typeCode === '11')
      // if (!fileICS2) {
      //   this.$message({
      //     message: 'Please upload ICS2 file',
      //     type: 'error'
      //   })
      //   return
      // }

      const orderDcList = (this.headerDataList || []).map(item => item.dc)
      const dcCheck = validateSupplierBookingDcOnSubmit(this.form.dc, orderDcList, this.getDictDatas)
      if (!dcCheck.valid) {
        this.$message({
          message: dcCheck.message,
          type: 'error'
        })
        return
      }
      console.log('1111')
      this.$refs['form'].validate(async valid => {
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
          console.log('222')

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
            }
          }
          if (text == 'Reefer Container:') {
            text = ''
          }
          data.remark = data.remark + '\n' + text
          data.containers = JSON.stringify(data.containers)
          var flag = false
          var grossWeight = 0
          var hsCodeFlag = false
          if (data?.productData?.length) {
            // 确保 productData 存在且有元素
            for (let i = 0; i < data.productData.length; i++) {
              if (data.productData[i].hscode && data.productData[i].hscode.length < 10) {
                hsCodeFlag = true
              }
              data.productData[i].hazardousMaterials = JSON.stringify(
                data.productData[i].hazardousMaterials || {} // 处理可能的 undefined
              )

              if (data.productData[i].dg == 1) {
                flag = true
              }

              grossWeight += Number(data.productData[i]?.grossWeight) || 0 // 安全数值转换
            }
            if (hsCodeFlag) {
              this.$message({
                message: 'HS Code must be exactly 10 digits',
                type: 'error'
              })
              this.loadingSaveBut = false
              this.submitLoading = false
              return
            }
          }
          this.uploadCount = 0
          this.successCount = 0
          data.productData = JSON.stringify(data.productData)
          if (this.si == true) {
            data.source = 'shipping-order'
          }
          if (this.si == true && this.form.shipmentType == 'FCL') {
            this.$refs['siForm'].validate(valid => {
              if (valid) {
                //判断重复的箱号
                const uniqueContainerNos = new Set()
                const duplicates = []
                this.siForm.containers.forEach(container => {
                  if (uniqueContainerNos.has(container.containerNo)) {
                    duplicates.push(container)
                  } else {
                    uniqueContainerNos.add(container.containerNo)
                  }
                })
                if (duplicates.length > 0) {
                  this.$notify.error('Duplicate Container No: ' + duplicates[0].containerNo + ' , please check')
                  this.loadingSaveBut = false
                  this.submitLoading = false
                  throw new Error('Duplicate Container No.')
                }
                for (let i = 0; i < this.siForm.containers.length; i++) {
                  if (this.siForm.containers[i].containerNo != null) {
                    this.siForm.containers[i].containerNo = this.siForm.containers[i].containerNo.replace(/(^\s*)|(\s*$)/g,
                      '').toUpperCase()
                  }
                  if (this.siForm.containers[i].containerSealNumber != null) {
                    this.siForm.containers[i].containerSealNumber = (this.siForm.containers[i].containerSealNumber + '').replace(/(^\s*)|(\s*$)/g, '')
                  }
                  const state = this.validateContainerNO(this.siForm.containers[i].containerNo)
                  if (!state) {
                    this.loadingSaveBut = false
                    this.submitLoading = false
                    return false
                  }
                }

                console.log(this.siForm.containers)
                for (var i = 0; i < this.siForm.containers.length; i++) {
                  var grossWeight = 0
                  var volume = 0
                  var numbersOfPackage = 0
                  var packageType = '';
                  for (var j = 0; j < this.siForm.containers[i].productData.length; j++) {
                    grossWeight += Number(this.siForm.containers[i].productData[j].grossWeight)
                    volume += Number(this.siForm.containers[i].productData[j].volume)
                    numbersOfPackage += Number(this.siForm.containers[i].productData[j].numberOfPackages)
                    packageType = this.siForm.containers[i].productData[j].packages
                  }
                  for (var product of this.siForm.containers[i].productData) {
                    if (product && product.hscode && !/^\d{10}$/.test(product.hscode)) {
                      this.$message.warning('HS Code:'+product.hscode+' must be exactly 10 digits');
                      this.loadingSaveBut = false
                      this.submitLoading = false
                      throw new Error('Hscode validate.')
                    }
                  }
                  this.siForm.containers[i].grossWeight = grossWeight
                  this.siForm.containers[i].numbers = this.siForm.containers[i].productData.length
                  this.siForm.containers[i].volume = volume
                  this.siForm.containers[i].numbersOfPackage = numbersOfPackage
                  this.siForm.containers[i].packageType = packageType
                }
                this.siForm.source = 'shipping-order'
              } else {
                this.loadingSaveBut = false
                this.submitLoading = false
                throw new Error('siForm validate.')
              }
            })
            data.status = 1
          }
          //如果是amend
          if (this.$route.query.source == 'amend') {
            var newData = JSON.parse(JSON.stringify(this.form))
            newData.approvalInfoList = []
            this.amendShippingForm.newData = JSON.stringify(newData)
            this.amendShippingForm.remark = this.amendRemark
            this.amendShippingForm.type = 'Amend'
            createShippingApproval(this.amendShippingForm).then(res => {
              this.loadingSaveBut = false
              this.submitLoading = false
              this.$router.push('/shipment/ppShippingOrder')
            })

            return
          }

          const res = await getOrder(this.$route.query.id)
          if (data.shipmentType === 'FCL') {
            let goodsCompare
            goodsCompare = this.goodsCompareData(data.productDOList[0])

            if (goodsCompare) {
              this.originalShipperData = res.data.productDOList
              this.updateData = data
              this.reminderType = 'submit'
              this.goodsReminderVisible = true
              this.loadingSaveBut = false
              this.submitLoading = false
              return
            }
          }
          this.compareData(res.data.productDOList, data.productDOList)
          if (this.reminderData.length > 0) {
            this.loadingSaveBut = false
            this.submitLoading = false
            this.updateData = data
            this.reminderType = 'submit'
            this.reminderVisible = true
          } else {
            this.updateSI(data)
          }
        } else {
          this.loadingSaveBut = false
          this.submitLoading = false
          throw new Error('form validate.')
        }
      })
    },
    draftOrder() {
      const orderDcListDraft = (this.headerDataList || []).map(item => item.dc)
      const dcCheckDraft = validateSupplierBookingDcOnSubmit(this.form.dc, orderDcListDraft, this.getDictDatas)
      if (!dcCheckDraft.valid) {
        this.$message({
          message: dcCheckDraft.message,
          type: 'error'
        })
        return
      }
      this.$refs['form'].validate(async valid => {
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
          const data = JSON.parse(JSON.stringify(this.form))

          let containerWeight = 0
          let text = 'Reefer Container:'
          for (let i = 0; i < data.containers.length; i++) {
            if (data.containers[i].soc === 'Yes') {
              flag = true
            }
            const c = this.containerOptions.find(element => element.type == data.containers[i].type)
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
            }
          }
          if (text === 'Reefer Container:') {
            text = ''
          }
          data.remark = data.remark + '\n' + text
          data.containers = JSON.stringify(data.containers)
          var flag = false
          let grossWeight = 0
          let hsCodeFlag = false
          if (data?.productData?.length) {
            // 确保 productData 存在且有元素
            for (let i = 0; i < data.productData.length; i++) {
              if (data.productData[i].hscode && data.productData[i].hscode.length < 10) {
                hsCodeFlag = true
              }
              data.productData[i].hazardousMaterials = JSON.stringify(
                data.productData[i].hazardousMaterials || {} // 处理可能的 undefined
              )

              if (data.productData[i].dg == 1) {
                flag = true
              }

              grossWeight += Number(data.productData[i]?.grossWeight) || 0 // 安全数值转换
            }
            if (hsCodeFlag) {
              this.$message({
                message: 'HS Code must be at least 10 characters long',
                type: 'error'
              })
              this.loadingSaveBut = false
              this.submitLoading = false
              return
            }
          }
          this.uploadCount = 0
          this.successCount = 0
          data.productData = JSON.stringify(data.productData)
          if (this.si) {
            data.source = 'shipping-order'
          }
          if (this.si&& this.form.shipmentType === 'FCL') {
            this.$refs['siForm'].validate(valid => {
              if (valid) {
                let containerNo = ''
                for (let j = 0; j < this.siForm.containers.length; j++) {
                  if (this.siForm.containers[j].containerNo == null || !this.isValidContainerNumber(this.siForm.containers[j].containerNo.replace(/(^\s*)|(\s*$)/g, '').toUpperCase())) {
                    containerNo = this.siForm.containers[j].containerNo
                    this.$notify.error('Invalid Container No: ' + containerNo + ' , please check')
                    this.loadingSaveBut = false
                    this.submitLoading = false
                    throw new Error('siForm validate.')
                  } else {
                    this.siForm.containers[j].containerNo = this.siForm.containers[j].containerNo.replace(/(^\s*)|(\s*$)/g, '')
                  }

                  if (this.siForm.containers[j].containerSealNumber != null) {
                    this.siForm.containers[j].containerSealNumber = this.siForm.containers[j].containerSealNumber.replace(/(^\s*)|(\s*$)/g, '').toUpperCase()
                  }
                }
                for (let i = 0; i < this.siForm.containers.length; i++) {
                  let grossWeight = 0
                  let volume = 0
                  let numbersOfPackage = 0
                  for (let j = 0; j < this.siForm.containers[i].productData.length; j++) {
                    grossWeight += Number(this.siForm.containers[i].productData[j].grossWeight)
                    volume += Number(this.siForm.containers[i].productData[j].volume)
                    numbersOfPackage += Number(this.siForm.containers[i].productData[j].numbersOfPackage)
                  }
                  this.siForm.containers[i].grossWeight = grossWeight
                  this.siForm.containers[i].numbers = this.siForm.containers[i].productData.length
                  this.siForm.containers[i].volume = volume
                  this.siForm.containers[i].numbersOfPackage = numbersOfPackage
                }
                this.siForm.source = 'shipping-order'
              } else {
                this.loadingSaveBut = false
                this.submitLoading = false
                throw new Error('siForm validate.')
              }
            })
            // FCL暂存，不改变Booking Status
            data.status = 4
          }

          // SI/VGM Submit暂存
          data.draft = true
          const res = await getOrder(this.$route.query.id)
          if (data.shipmentType === 'FCL') {
            let goodsCompare
            goodsCompare = this.goodsCompareData(data.productDOList[0])

            if (goodsCompare) {
              this.originalShipperData = res.data.productDOList
              this.updateData = data
              this.reminderType = 'draft'
              this.goodsReminderVisible = true
              this.loadingSaveBut = false
              this.submitLoading = false
              return
            }
          }
          this.compareData(res.data.productDOList, data.productDOList)
          if (this.reminderData.length > 0) {
            this.loadingSaveBut = false
            this.submitLoading = false
            this.updateData = data
            this.reminderType = 'draft'
            this.reminderVisible = true
          } else {
            this.draftUpdateSI(data)
          }
        } else {
          this.loadingSaveBut = false
          this.submitLoading = false
          throw new Error('form validate.')
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
    },
    addContainers() {
      this.form.containers.push({ type: '' })
      this.form = JSON.parse(JSON.stringify(this.form))
    },

    parseTimeToZ1(timestamp) {
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
    handlePreview(file) {
      window.open(file.url, '_blank')
    },
    setData(type) {
      var draftContainers = this.shipment.containerDOList.filter(item => item.type == type)
      if (draftContainers.length > 0) {
        var res = []
        for (var i = 0; i < draftContainers.length; i++) {
          var obj = JSON.parse(JSON.stringify(draftContainers[i]))
          var products = JSON.parse(JSON.stringify(this.shipment.productDOList.filter(item => item.shipmentId == this.shipment.id && item.containerId == obj.id)))

          obj.productData = products
          if (obj.productData.length == 0) {
            this.addProduct2(obj.productData)
          }
          obj.id = null
          obj.type = null
          res.push(obj)
        }
        this.siForm.containers = res
      }
    },
    addProduct2(data) {
      data.push({})
    },
    handleDeleteProduct(data, index) {
      data.splice(index, 1)
    },
    getContainerTypeCodeList() {
      getContainerTypeCodeList().then(response => {
        this.containerTypeList = response.data
      })
    },

    totalVolum() {
      try {
        const containers = this.siForm?.containers || []
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : []
          return (
            sum +
            productData.reduce((containerSum, item) => {
              return containerSum + (Number(item?.numberOfPackages) || 0)
            }, 0)
          )
        }, 0)
      } catch (error) {
        console.error('计算总重量出错:', error)
        return 0 // 确保即使出错也有返回值
      }
    },
    totalCBM() {
      try {
        const containers = this.siForm?.containers || []
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : []
          return (
            sum +
            productData.reduce((containerSum, item) => {
              return containerSum + (Number(item?.volume) || 0)
            }, 0)
          )
        }, 0)
      } catch (error) {
        console.error('计算总重量出错:', error)
        return 0 // 确保即使出错也有返回值
      }
    },
    totalWeight() {
      try {
        const containers = this.siForm?.containers || []
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : []
          return (
            sum +
            productData.reduce((containerSum, item) => {
              return containerSum + (Number(item?.grossWeight) || 0)
            }, 0)
          )
        }, 0)
      } catch (error) {
        console.error('计算总重量出错:', error)
        return 0 // 确保即使出错也有返回值
      }
    },

    containersUpload(file) {
      this.file2Xce(file).then(tabJson => {
        this.parseTailwindExcel(tabJson)
      })
    },
    parseTailwindExcel(tabJson) {
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
            message: errorList + ' does not exist, Please use the import template to import',
            type: 'warning'
          })
          this.checkLoading = false
          this.$refs.upload.clearFiles();
          return
        }
        //get data
        tabJson[0].sheet.forEach((item, index, key) => {
          listTable.push(item)
        })

        const containerTypes = this.containerOptions.map((obj) => obj.type)
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
        const groupedData = {}
        listTable.forEach((item, index) => {
          const groupKey = `${item['Container Type']}-${item['Container No']}`
          if (!groupedData[groupKey]) {
                let soc = item['SOC(TRUE/FALSE)']
                if (soc != null) {
                  if (soc.toLowerCase == 'true' || soc == '1' || soc.toLowerCase == 'yes') {
                    soc = true
                  } else {
                    soc = false
                  }
                }
            groupedData[groupKey] = {
                  "containerType": String(item["Container Type"]|| "").trim(),
                  "containerNo": String(item["Container No"]|| "").trim(),
                  "subContainerType": String(item["Sub Container Type"]|| "").trim(),
                  "containerSealNumber": String(item["Container Seal Number"]|| ""),
                  "remark": String(item["Marks&Numbers"]|| ""),
                  "tareWeight": item["Tare Weight"],
                  "packageMethod": String(item["FCL/LCL"]|| ""),
                  "soc": soc,
                  "productData": []
            }
          }
          const productDataItem = {}
          // Copy the necessary properties to productDataItem
              productDataItem["productEnglishName"] = String(item["Product Name"]|| "");
              productDataItem["hscode"] = String(item["HS code"]|| "");
              productDataItem["numberOfPackages"] = item["Number Of Packages"];
              productDataItem["packages"] = String(item["Packages"]|| "");
          const units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
          const excelUnit = String(item['Packages'])
          let unitsFlag = false
          if (excelUnit !=null) {
              for (const unit of units) {
                  if (unit.label==excelUnit.toUpperCase() || unit.value==excelUnit.toUpperCase()) {
                      productDataItem["packages"]=unit.value;
                      unitsFlag = true
                  }
              }
          }
          if (!unitsFlag) {
            productDataItem["packages"] = null
          }
          productDataItem['grossWeight'] = item['Gross Weight(KG)']
          productDataItem['volume'] = item['Volume(CBM)']
          //数组默认是0,表头行也不算,所以 +2
          groupedData[groupKey]['index'] = index + 2

          groupedData[groupKey]['productData'].push(productDataItem)
        })

        const groupedArray = Object.values(groupedData)

        this.pushData(groupedArray)
        this.$refs.upload.clearFiles();
      }
    },
    parseNoTailwindExcel(tabJson) {
      var vm = this
      if (tabJson && tabJson.length > 0) {
        var xlsxJson = tabJson
        console.log(tabJson)
        vm.siForm.containers = []
        var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
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
          this.wb.SheetNames.forEach(sheetName => {
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

    pushData(groupedArray) {
      console.log(this.siForm.containers)

      //push data
      for (let i = 0; i < this.siForm.containers.length; i++) {
        for (let j = 0; j < groupedArray.length; j++) {
          if (this.siForm.containers[i].containerType == groupedArray[j].containerType && (!this.siForm.containers[i].containerNo || this.siForm.containers[i].containerNo != groupedArray[j].containerNo)) {
            this.$set(this.siForm.containers[i], 'containerNo', groupedArray[j].containerNo)
            // SI/VGM Submit去除subContainerType
            // this.$set(this.siForm.containers[i], 'subContainerType', groupedArray[j].subContainerType)
            this.$set(this.siForm.containers[i], 'containerSealNumber', groupedArray[j].containerSealNumber)
            this.$set(this.siForm.containers[i], 'remark', groupedArray[j].remark)
            this.$set(this.siForm.containers[i], 'soc', groupedArray[j].soc)
            this.$set(this.siForm.containers[i], 'packageMethod', groupedArray[j].packageMethod)
            this.$set(this.siForm.containers[i], 'tareWeight', groupedArray[j].tareWeight)
            this.siForm.containers[i].productData = []

            this.$set(this.siForm.containers[i], 'productData', groupedArray[j].productData)

            groupedArray.splice(j, 1)
            break
          }
        }
      }
      console.log(this.siForm.containers)
      this.checkLoading = false
    },

    downloadTemplate() {
      downloadSupplierContainersTemplate({ shipmentId: this.shipment.id }).then(res => {
        this.$download.excel(res, 'import_template_containers.xlsx')
      })
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
    //去除中文
    filterChinese(name) {
      return name.replace(/[\u4e00-\u9fa5]/g, '')
    },
    selectBlur(item) {},

    beforeRemove(file, fileList) {
      return this.$confirm(`Delete ${file.name}？`)
    },
    handleRemove(file, fileList) {
      this.bookingNoteList = fileList
      if (file.id != null) {
        this.delIds.push(file.id)
      }
    },
    handleSIRemove(file, fileList, i) {
      this.form.productData[i].files = fileList
      if (file.id) {
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
    handlePreview1(file) {
      window.open(file.url, '_blank')
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The current limit is 1 file, this time ${files.length} files are selected.`)
    },
    handleChange(file, fileList) {
      this.bookingNoteList = fileList
      var vm = this
      this.file2Xce1(file).then(tabJson => {})
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
          this.wb.SheetNames.forEach(sheetName => {
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
              var cargoReadyForPickupDate = new Date(cargoReadyForPickup)
              vm.form.cargoReadyForPickup = cargoReadyForPickupDate.getTime()
              vm.form.destinationPort = json['D18'] ? json['D18'].v : ''
              vm.form.destinationLocation = json['B3'] ? json['B3'].v : ''
              var deliver = json['G18'] ? json['G18'].w : ''
              var deliverDate = new Date(deliver)
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
              vm.form = JSON.parse(JSON.stringify(vm.form))
            }
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },

    downloadBookingTemplate() {
      downloadShippingOrderTemplate().then(res => {
        this.$download.excel(res, 'import_template_shipping_order.xlsx')
      })
      // window.open('https://www.smartmoovhub.com/admin-api/infra/file/5/get/b3d908540ef24384b878b552619be9be.xls', "_blank");
    },
    handlePreviewShippingOrder(file) {
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
      let grossWeightCount = 0
      for (let productDatum of this.form.productData) {
        // console.log('productDatum', productDatum)
        grossWeightCount += productDatum.grossWeight
      }
      console.log('Max Gross Weight(kg) ', maxGrossWeight)
      const grossWeightError = validateContainersGrossWeight(maxGrossWeight, grossWeightCount)
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
    validateHsCode(event, item) {
      const value = event.target.value.trim()
      item.hscode = value

      if (value.length !== 10 || !/^\d{10}$/.test(value)) {
        this.$message({
          message: 'HS Code must be exactly 10 digits',
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
    },
    compareData(original, current) {
      const originalData = { ...original[0] }
      const currentData = { ...current[0] }
      if (currentData.markNumbers !== originalData.markNumbers) {
        this.reminderData.push({
          name: 'Mark&Numbers',
          current: currentData.markNumbers,
          original: originalData.markNumbers
        })
      }
      if (currentData.productEnglishName !== originalData.productEnglishName) {
        this.reminderData.push({
          name: 'Product English Name',
          current: currentData.productEnglishName,
          original: originalData.productEnglishName
        })
      }
      if (currentData.productChineseName !== originalData.productChineseName) {
        this.reminderData.push({
          name: 'Product Chinese Name',
          current: currentData.productChineseName,
          original: originalData.productChineseName
        })
      }
      if (currentData.hscode !== originalData.hscode) {
        this.reminderData.push({
          name: 'HS Code',
          current: currentData.hscode,
          original: originalData.hscode
        })
      }
      if (currentData.numberOfPackages !== originalData.numberOfPackages) {
        this.reminderData.push({
          name: 'Number Of Packages',
          current: currentData.numberOfPackages,
          original: originalData.numberOfPackages
        })
      }
      if (currentData.packages !== originalData.packages) {
        const packages = getDictDatas(DICT_TYPE.SYSTEM_UNITS)
        const currentPackages = packages.find(item => item.value === currentData.packages)
        const originalPackages = packages.find(item => item.value === originalData.packages)
        this.reminderData.push({
          name: 'Packages',
          current: currentPackages?.label,
          original: originalPackages?.label
        })
      }
      if (currentData.grossWeight !== originalData.grossWeight) {
        this.reminderData.push({
          name: 'Gross Weight(KG)',
          current: currentData.grossWeight.toFixed(3),
          original: originalData.grossWeight.toFixed(3)
        })
      }
      if (currentData.volume !== originalData.volume) {
        this.reminderData.push({
          name: 'Volume(CBM)',
          current: currentData.volume.toFixed(3),
          original: originalData.volume.toFixed(3)
        })
      }
      const originalHazardousMaterials = originalData.hazardousMaterials ? JSON.parse(originalData.hazardousMaterials) : {}
      if (JSON.stringify(currentData.hazardousMaterials) !== originalData.hazardousMaterials) {
        const originalKeys = Object.keys(originalHazardousMaterials)
        const currentKeys = Object.keys(currentData.hazardousMaterials)
        const keys = currentKeys.length >= originalKeys ? currentKeys : originalKeys
        const current = []
        const original = []
        keys.forEach((key) => {
          current.push(`${key}: ${currentData.hazardousMaterials[key] || ''}`)
        })
        keys.forEach((key) => {
          original.push(`${key}: ${originalHazardousMaterials[key] || ''}`)
        })
        this.reminderData.push({
          name: 'DG',
          current: current.join(", "),
          original: original.join(", ")
        })
      }
      if (currentData.batteries !== originalData.batteries) {
        this.reminderData.push({
          name: 'Batteries',
          current: currentData.batteries === 2 ? 'Has batteries' : 'No batteries',
          original: originalData.batteries === 2 ? 'Has batteries' : 'No batteries'
        })
      }
    },
    handleClose() {
      this.reminderVisible = false
      this.reminderData = []
      this.updateData = null
      this.reminderType = null
    },
    updateSI(data) {
      if (!data) {
        this.$message({
          message: 'Fail to submit!',
          type: 'error'
        })
        return
      }
      this.reminderVisible = false
      this.loadingSaveBut = true
      this.submitLoading = true
      updateOrder(data).then(response => {
        for (let i = 0; i < response.data.productIds.length; i++) {
          this.form.productData[i].uploadData.exId = response.data.productIds[i]
        }
        for (let i = 0; i < response.data.productIds.length; i++) {
          if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
            this.$refs['upload' + i][0].submit()
          }
        }
        const formData = new FormData()
        formData.append('shppingId', this.form.id)
        formData.append('delIds', this.delIds)
        const fileList = []
        this.bookingNoteList.map(item => {
          if (item.id == null) {
            formData.append('file', item.raw)
            fileList.push('1')
          }
        })
        if (fileList.length > 0 || this.delIds.length > 0) {
          uploadShippingFile(formData).then(response => {})
        }
        setTimeout(() => {
          if (this.si && this.form.shipmentType === 'FCL') {
            draftSI(this.siForm).then(res => {
              this.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              })
              this.loadingSaveBut = false
              this.submitLoading = false
              const url = this.$router.resolve({
                path: '/shipment/ppshippingOrderDetail'
              }).href
              window.location.href = url + '?id=' + this.shippingId + '&source=shipping-order'
            })
          } else {
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.loadingSaveBut = false
            this.submitLoading = false
            const url = this.$router.resolve({
              path: '/shipment/ppshippingOrderDetail'
            }).href
            window.location.href = url + '?id=' + this.shippingId + '&source=shipping-order'
          }
        }, 2000)
      }).catch(error => {
        this.loadingSaveBut = false
        this.submitLoading = false
      })
    },
    draftUpdateSI(data) {
      if (!data) {
        this.$message({
          message: 'Fail to submit!',
          type: 'error'
        })
        return
      }
      this.reminderVisible = false
      this.loadingSaveBut = true
      this.submitLoading = true
      draftOrder(data).then(response => {
        for (let i = 0; i < response.data.productIds.length; i++) {
          this.form.productData[i].uploadData.exId = response.data.productIds[i]
        }
        for (var i = 0; i < response.data.productIds.length; i++) {
          if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
            this.$refs['upload' + i][0].submit()
          }
        }
        let formData = new FormData()
        formData.append('shppingId', this.form.id)
        formData.append('delIds', this.delIds)
        let fileList = []
        this.bookingNoteList.map(item => {
          if (item.id == null) {
            formData.append('file', item.raw)
            fileList.push('1')
          }
        })
        if (fileList.length > 0 || this.delIds.length > 0) {
          uploadShippingFile(formData).then(response => {})
        }
        setTimeout(() => {
          if (this.si && this.form.shipmentType === 'FCL') {
            this.siForm.siVGMDraft = true
            siVGMDraft(this.siForm).then(res => {
              this.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              })
              this.loadingSaveBut = false
              this.submitLoading = false
              const url = this.$router.resolve({
                path: '/shipment/ppshippingOrderDetail'
              }).href
              window.location.href = url + '?id=' + this.shippingId + '&source=shipping-order'
            })
          } else {
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.loadingSaveBut = false
            this.submitLoading = false
            const url = this.$router.resolve({
              path: '/shipment/ppshippingOrderDetail'
            }).href
            window.location.href = url + '?id=' + this.shippingId + '&source=shipping-order'
          }
        }, 2000)
      })
    },
    goodsCompareData(productDOList) {
      const volume = this.totalVolum()
      const CBM = this.totalCBM()
      const weight = this.totalWeight()
      const different = []
      if (volume.toFixed(3) !== productDOList.numberOfPackages.toFixed(3)) {
        different.push({
          productName: 'Number Of Packages',
          containerName: 'Total Number of Packages',
          product: productDOList.numberOfPackages,
          container: volume
        })
      }
      if (weight.toFixed(3) !== productDOList.grossWeight.toFixed(3)) {
        different.push({
          productName: 'Gross Weight(KG)',
          containerName: 'Total Gross Weight',
          product: productDOList.grossWeight,
          container: weight
        })
      }
      if (CBM.toFixed(3) !== productDOList.volume.toFixed(3)) {
        different.push({
          productName: 'Volume(CBM)',
          containerName: 'Total CBM',
          product: productDOList.volume,
          container: CBM
        })
      }
      if (different.length > 0) {
        this.goodsReminderData = different
        this.goodsReminderVisible = true
        return true
      } else {
        return false
      }
    },
    goodsTSHGCompareData(productDOList) {
      let numberOfPackages = 0
      let CBM = 0
      let weight = 0
      for (let i = 0, len = this.siForm.containers.length; i < len; i++) {
        if (this.siForm.containers[i].numbersOfPackage) {
          numberOfPackages += this.siForm.containers[i].numbersOfPackage
        }
        if (this.siForm.containers[i].grossWeight) {
          weight += this.siForm.containers[i].grossWeight
        }
        if (this.siForm.containers[i].volume) {
          CBM += this.siForm.containers[i].volume
        }
      }
      const different = []
      if (numberOfPackages.toFixed(3) !== productDOList.numberOfPackages.toFixed(3)) {
        different.push({
          productName: 'Number Of Packages',
          containerName: 'Total Numbers Of Package',
          product: productDOList.numberOfPackages,
          container: numberOfPackages
        })
      }
      if (weight.toFixed(3) !== productDOList.grossWeight.toFixed(3)) {
        different.push({
          productName: 'Gross Weight(KG)',
          containerName: 'Total Gross Weight',
          product: productDOList.grossWeight,
          container: weight
        })
      }
      if (CBM.toFixed(3) !== productDOList.volume.toFixed(3)) {
        different.push({
          productName: 'Volume(CBM)',
          containerName: 'Total Volume',
          product: productDOList.volume,
          container: CBM
        })
      }
      if (different.length > 0) {
        this.goodsReminderData = different
        this.goodsReminderVisible = true
        return true
      } else {
        return false
      }
    },
    onGoodsCompareClose() {
      this.goodsReminderVisible = false
      this.goodsReminderData = []
      this.originalShipperData = null
    },
    onGoodsConfirm(originalShipperData, currentData) {
      this.goodsReminderVisible = false
      this.compareData(originalShipperData, currentData.productDOList)
      if (this.reminderData.length > 0) {
        this.updateData = currentData
        this.reminderType = 'submit'
        this.reminderVisible = true
      } else {
        this.updateSI(currentData)
      }
    },
    sumVGM(row){
      try {
      var sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)
      var sumTare = (Number(row?.tareWeight) || 0).toFixed(3)
      return Number(sum) + Number(sumTare)
      } catch (error) {
        console.error('计算总重量出错:', error);
        return 0; // 确保即使出错也有返回值
      }
    },
    onGoodsDraft(originalShipperData, currentData) {
      this.goodsReminderVisible = false
      this.compareData(originalShipperData, currentData.productDOList)
      if (this.reminderData.length > 0) {
        this.updateData = currentData
        this.reminderType = 'draft'
        this.reminderVisible = true
      } else {
        this.draftUpdateSI(currentData)
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
