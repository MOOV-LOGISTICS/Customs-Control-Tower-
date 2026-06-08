<template>
  <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
    <el-card class="pd-20">
      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="0px">
        <el-card class="card-css">
          <div class="el-descriptions__title_css">Order Details</div>
          <order-detail ref="orderDetail" @render="handleOrderRender" @sum="handleOrderSum"></order-detail>
        </el-card>

        <!--保存模板功能-->
        <el-card class="card-css">
          <!--模板功能弹窗-->
          <el-dialog title="Template" :visible.sync="titleShow" v-loading="templateLoading">
            <el-form :model="templateForm" :show-message="false" ref="templateForm" label-width="160px">
              <el-form-item label="Template Name" required prop="title">
                <el-input v-model="templateForm.title" @blur="templateForm.title = $event.target.value.trim()"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="titleShow = false">Cancel</el-button>
              <el-button type="primary" @click="saveTemplate()">Submit</el-button>
            </div>
          </el-dialog>
          <el-row :gutter="20">
            <el-col :offset="16" :span="8">
              <el-button @click="showTitle()" type="primary" style="display:flex; float:right; margin-right: 10px;">
                Save
                Template
              </el-button>
              <div style="display:flex; padding-right: 20px;">
                <el-select filterable v-model="templateData" clearable value-key="id" placeholder="Template" @change="changeTemplate">
                  <el-option v-for="item in templateList" :key="item.id" :label="item.title" :value="item">
                    <!-- 将 label 改为插槽形式 -->
                    {{ item.title }}
                    <template>
                      <el-popconfirm
                        confirmButtonText="Submit"
                        cancelButtonText="Cancel"
                        icon="el-icon-info"
                        iconColor="red"
                        :title="'Delete ' + item.title"
                        @confirm="clearTemplate(item)"
                        @cancel="cancelTemplate(item)"
                        placement="top-end"
                      >
                        <span class="delete-template-option" slot="reference">Delete</span>
                      </el-popconfirm>
                    </template>
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="card-css">
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
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value"
                    :value="dict.value" />
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
                <el-select size="mini" v-model="form.freightMethod" :placeholder="$t('booking.transportMode')" @change="handleTransportModeChange" class="custom-select">
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

        <el-card class="card-css">
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
                <el-date-picker @change="handleCargoReadyChange" value-format="timestamp" v-model="form.cargoReadyForPickup" :picker-options="allCRDPickerOptions" type="date" disabled></el-date-picker>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label></el-descriptions-item>
          </el-descriptions>

          <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="4">
            <el-descriptions-item>
              <template slot="label">
                <!-- <font color="#FF0000">*</font> -->
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

        <el-card class="card-css">
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

        <el-card class="card-css">
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
                <el-input aria-required type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="item.productEnglishName" />
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
            <el-descriptions-item label="Number Of Packages">
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
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Batteries
              </template>
              <el-form-item required label :prop="'productData.' + i + '.batteries'">
                <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                  <el-radio :label="2" border>Has batteries</el-radio>
                  <el-radio :label="3" border>No batteries</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
              <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" inactive-text="No"></el-switch>
            </el-descriptions-item>

            <el-descriptions-item :label="dict.label" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="item.dg == 1">
              <el-input v-model="item.hazardousMaterials[dict.value]" />
            </el-descriptions-item>

            <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
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
                    :on-remove="handleRemove"
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

        <el-card class="card-css" v-if="form.shipmentType == 'FCL' && form.freightMethod !== 'air'">
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
                :key="'container-' + i"
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

        <el-card class="card-css">
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

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Remark</div>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="4" v-model="form.remark" />
            </el-col>
          </el-row>
        </el-card>

        <el-row style="text-align: center; padding: 20px;">
          <el-button size="mini" @click="submit(-1)" type="primary" :loading="loadingSaveBut">Save Draft</el-button>
          <el-button size="mini" @click="submit(0)" type="primary" :loading="loadingSaveBut">Submit</el-button>
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
import { createShippingOrder, getShippingOrderDetail } from '@/api/pepco/shipping-order'

import { createOrder, getOrder, getPartiesList, uploadShippingFile, downloadShippingOrderTemplate } from '@/api/shipping/order'
import { getProductList } from '@/api/system/product'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getAirportList } from '@/api/air/airport'
import { createTemplate, deleteTemplate, getTemplateList } from '@/api/shipping/template'
import XLSX from 'xlsx'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import OrderDetail from './components/order-detail.vue'
import uploadOrderFile from './components/upload-order-file.vue'
import { getPepcoOrderFileByOrder, updatePepcoFileShippingId } from '@/api/order/task'
import { deleteFile } from '@/api/infra/file'
import { deleteOrderFile } from '@/api/pepco/order-file'
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
  freightMethod: ''
}

export default {
  name: 'Shipment',
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
        originPort: '',
        destinationPort: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: '',
        // 增加货运模式 edwin
        freightMethod: 'sea'
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
      templateList: [],
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

      fileTableData: [],
      cargoReadyDateMaxDate: null,
      shippingOrderId: null,
      dcOptions: ['0006', '0015', '0018', '0021', '0027', '0030'],
      dcCode: ''
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
  created() {
    const { shippingOrderId, source } = this.$route.query
    console.log('create copy=========', shippingOrderId, source)

    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.form.productData.push({
      batteries: null,
      productEnglishName: '',
      packages: 'CTNS',
      hscode: '',
      fileList: [],
      uploadData: {},
      dg: 0,
      hazardousMaterials: {}
    })
    this.getPortList()
    this.getContainerList()
    this.ensureDefaultContainers()
    this.getUserInfo()
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })

    console.log('create copy=========', source == 'copy')
    if (source == 'copy') {
      console.log('copy')
      this.getShippingOrder(shippingOrderId)
    } else {
      this.handleOrderDetail()

      // this.getPortList()
      // this.getContainerList()
      // this.getUserInfo()
      // getPartiesList().then(res => {
      //   this.shipperList = res.data.shipper
      //   this.consigneeList = res.data.consignee
      //   this.notifyPartyList = res.data.notifyParty
      // })
      // this.getTemplateData()
      this.getPepcoOrderFileByOrder()
    }
    this.getTemplateData()
    localStorage.removeItem('refreshPoPage')
  },
  beforeDestroy() {
    localStorage.removeItem('shipping-selectedPoList')
  },
  watch: {
    'form.shipmentType': function (newVal) {
      if (newVal === 'FCL') {
        this.form.needExportCustomerService = 'No'

        //  初始化 containers
        if (this.form.freightMethod !== 'air') {
          this.ensureDefaultContainers()
        }
      } else if (newVal === 'LCL') {
        this.form.needExportCustomerService = 'Yes'

        // 可选：切回 LCL 清空 containers
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
    },
    // 监听headerDataList,更新cargo ready date 最大值
    'poList': {
      deep: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.updateCargoReadyDateMaxDate()

          // 只有在 cargoReadyDateMaxDate 存在且 cargoReadyForPickup 超过它时才清空
          this.$nextTick(() => {
            // 修改为 直接赋值，但不保证后面要不要动态的，所以先注释掉
            console.log('this.cargoReadyDateMaxDate', this.cargoReadyDateMaxDate)
            if (this.cargoReadyDateMaxDate !== null) {
              this.form.cargoReadyForPickup = this.cargoReadyDateMaxDate
                       // 清除表单验证错误状态
              this.$refs.form && this.$refs.form.clearValidate('cargoReadyForPickup')
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
    }
  },
  methods: {
    /**
     * copy模式下获取订单
     * @param shippingOrderId
     */
    getShippingOrder(shippingOrderId) {
      getShippingOrderDetail({ shippingOrderId }).then(res => {
        console.log('------getShippingOrder-------', res)
        this.form = { ...this.form, ...res.data.shippingOrder, customerRef: '', shipperRef: '' }
        // this.form.containers = [...res.data.containers]

        this.poList = []
        this.$nextTick(() => {
          this.$refs.orderDetail.refresh(this.poList)
        })
        console.log('1111')
        this.getPepcoOrderFileByOrder()
        console.log('222')
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
      const malformed = this.form.containers.some(row => !row || !Object.prototype.hasOwnProperty.call(row, 'type'))
      if (malformed) {
        const preserved = this.form.containers.map(row => this.normalizeContainerRow(row || {}))
        this.$set(this.form, 'containers', preserved.length ? preserved : [this.createEmptyContainer()])
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
    normalizeContainerRow(container) {
      const normalized = {
        id: container.id,
        soId: container.soId,
        type: container.type != null ? String(container.type) : '',
        qty: container.qty != null ? Number(container.qty) : null,
        ventClosedOrNot: container.ventClosedOrNot != null ? String(container.ventClosedOrNot) : '',
        requireTemperature: container.requireTemperature != null ? String(container.requireTemperature) : '',
        humidity: container.humidity != null ? String(container.humidity) : '',
        o2: container.o2 != null ? String(container.o2) : '',
        co2: container.co2 != null ? String(container.co2) : '',
        drains: container.drains != null ? String(container.drains) : '',
        soc: container.soc === true || container.soc === 1 || container.soc === 'Yes'
      }
      return applyReeferFieldsForContainer(normalized, this.containerOptions, 'type')
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
      var query = {
        orderIds: this.poList.map(item => item.id).join(','),
        taskCode: 'Shipper_Booking'
      }
      if (this.poList.length == 0) {
        this.fileTableData = []
        return
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
      this.$refs.uploadOrderFile.openDialog({
        orderIds: this.poList.map(item => item.id),
        taskCode: 'Shipper_Booking'
      })
    },
    handleOrderDetail() {
      setTimeout(() => {
        const rows = JSON.parse(localStorage.getItem('shipping-selectedPoList'))
        console.log('查询的handleOrderDetail', rows)
        if (rows && rows.length > 0 && rows[0].dc) {
          this.$set(this, 'dcCode', rows[0].dc)
        }
        this.poList = rows || []
        console.log('handleOrderDetail', this.poList)
        this.$nextTick(() => {
          console.log('this.$refs.orderDetail', this.$refs.orderDetail)
          this.$refs.orderDetail.refresh(this.poList)
        })
      }, 500)
    },
    handleOrderRender(result) {
      console.log('handleOrderRender')
      console.log(result)
      this.$set(this.form, 'customerRef', result.orderNumbers.join(','))
      console.log('订单的form渲染', this.form)
      // this.$set(this.form.productData[0], 'productEnglishName', result.itemNames.join('\n'))
      // this.$set(this.form.productData, 'numberOfPackages', result.orderNumbers.join(','))
    },
    handleOrderSum(result, changePo) {
      console.log('handleOrderSum', result)
      console.log('this.form1', this.form)
      if (changePo || (this.form.productData[0] && !this.form.productData[0].numberOfPackages)) {
        console.log('update numberOfPackages', result.bookedOuter)
        this.$set(this.form.productData[0], 'numberOfPackages', result.bookedOuter == 0 ? 0 : result.bookedOuter)
      }
      if (changePo || (this.form.productData[0] && !this.form.productData[0].grossWeight)) {
        console.log('update grossWeight', result.grossWeight)
        this.$set(this.form.productData[0], 'grossWeight', result.grossWeight == 0 ? 0 : result.grossWeight)
      }
      if (changePo || (this.form.productData[0] && !this.form.productData[0].volume)) {
        console.log('update volume', result.volume)
        this.$set(this.form.productData[0], 'volume', result.volume == 0 ? 0 : result.volume)
      }
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
    // getHsCodeListByCode(hscode) {
    //   getHsCodeListByCode(hscode).then(response => {
    //     this.hsCodeList = response.data
    //   })
    // },
    // remoteGetHsCode(query) {
    //   if (query !== '' && query.length >= 4) {
    //     this.loading = true
    //     this.getHsCodeListByCode(query)
    //     setTimeout(() => {
    //       this.options = this.hsCodeList.filter(item => {
    //         return item.hsCode.toLowerCase().indexOf(query.toLowerCase()) > -1
    //       })
    //       this.loading = false
    //     }, 200)
    //   } else {
    //     this.options = []
    //   }
    // },
    getPortList() {
      getOriginDeliveryList().then(response => {
        this.portOptions = response.data
      })
    },
    //zane  添加获取机场列表方法
    getAirport() {
      // 获取机场列表的接口调用
      getAirportList().then(response => {
        this.airPortOptions = response.data
      })
    },
    //zane 根据选择的transportMode，动态改变表单内容
    handleTransportModeChange(value) {
      if (value === 'air') {
        // 1. SO Type 固定为 LCL
        this.form.shipmentType = 'LCL'
        this.form.originPort = ''
        this.form.destinationPort = ''

        // 2. 清空 containers 相关信息
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
        batteries: null,
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
    submit(operation) {
      console.log('form', this.form)
      console.log('dataList', this.$refs.orderDetail.getDataList())
      console.log('polist', this.poList)
      const orderList = this.$refs.orderDetail.getDataList()
      if (!orderList || orderList.length === 0) {
        this.$message({
          message: 'Please select at least one order',
          type: 'error'
        })
        return
      }
      const dcCheck = validateSupplierBookingDcOnSubmit(this.form.dc, orderList.map(item => item.dc), this.getDictDatas)
      if (!dcCheck.valid) {
        this.$message({
          message: dcCheck.message,
          type: 'error'
        })
        return
      }
      if (this.form.customerRef == null || this.form.customerRef === '' || this.form.customerRef === undefined) {
        this.$message({
          message: 'Please resubmit orders. The shipping order info need refresh',
          type: 'error'
        })
        return
      }
      // 判断this.form.productData 中的hscode字段 长度是否小于10

      for (var i = 0; i < this.form.productData.length; i++) {
        if ((this.form.productData[i].hscode && this.form.productData[i].hscode.length !== 10) || !/^\d{10}$/.test(this.form.productData[i].hscode)) {
          this.$message({
            message: 'HS Code must be exactly 10 digits',
            type: 'error'
          })
          return
        }
      }
      //提示选择的Transport Mode
      this.$confirm(
        'Transport Mode cannot be changed after submission. Please confirm the selected Transport Mode is correct.',
        'Confirmation',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {

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
              return
            }
            data.containers = data.containers
            data.operation = operation
            if (data.products[0].dg === 1 || data.products[0].batteries === 2) {
              if (data.products[0].fileList.length < 1) {
                this.$notify.error('Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!')
                this.loadingSaveBut = false
                this.submitLoading = false
                return
              }
            }
            createShippingOrder(data)
              .then(response => {
                this.shippingId = response.data.shippingId
                console.log(this.poList)

                this.updatePepcoFileShippingId(this.shippingId)
                for (var i = 0; i < response.data.productIds.length; i++) {
                  this.form.productData[i].uploadData.exId = response.data.productIds[i]
                }
                var count = 0
                for (var i = 0; i < response.data.productIds.length; i++) {
                  if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
                    this.$refs['upload' + i][0].submit()
                  }
                }
                let formData = new FormData()
                formData.append('shppingId', response.data.shippingId)
                formData.append('delIds', this.delIds)
                this.bookingNoteList.map(item => {
                  formData.append('file', item.raw)
                })
                if (this.bookingNoteList.length > 0 || this.delIds.length > 0) {
                  uploadShippingFile(formData).then(response => { })
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
                  // 提交完成后，在新页面中设置数据
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
          }
        })
      }).catch(() => {
        return
      })
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
    },
    handleRemove(file, fileList) {
      this.form.productData[0].fileList = fileList
    },
    getContainerList() {
      getContainerList().then(response => {
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
      this.handleOptionChange()
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

    // 保存模板
    showTitle() {
      this.titleShow = true
    },
    saveTemplate() {
      console.log('Saving template...')
      console.log(this.form)
      var newForm = JSON.parse(JSON.stringify(this.form))
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          this.templateLoading = true
          var data = {
            title: this.templateForm.title,
            templateData: JSON.stringify(newForm)
          }
          createTemplate(data).then(res => {
            this.getTemplateData()
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.$refs['templateForm'].resetFields()
            this.titleShow = false
            this.templateLoading = false
          })
        } else {
          return false
        }
      })
    },
    cancelTemplate() {
      this.clearTemplateFlag = false
    },
    clearTemplate(val) {
      this.clearTemplateFlag = true
      deleteTemplate(val.id).then(res => {
        this.getTemplateData()
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        if (this.templateData['id'] == val.id) {
          this.restTemplate()
          this.templateData = null
        }
      })
      return false
    },
    changeTemplate(val) {
      if (this.clearTemplateFlag || !val) {
        this.clearTemplateFlag = false
        return
      }
      var temp = JSON.parse(val.templateData)

      // 保留当前不应被模板覆盖的字段
      temp.productData = this.form.productData ? this.form.productData : []
      temp.containers = this.form.containers ? this.form.containers : []
      temp.remark = this.form.remark ? this.form.remark : ''
      temp.customerRef = this.form.customerRef ? this.form.customerRef : ''
      temp.cargoReadyForPickup = this.cargoReadyDateMaxDate ? this.cargoReadyDateMaxDate : null

      this.form = temp
    },
    getTemplateData() {
      getTemplateList().then(res => {
        this.templateList = res.data
      })
    },
    restTemplate() {
      this.$refs['templateForm'].resetFields()
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

      if (value.length < 10) {
        this.$message({
          message: 'HS Code must be 10 characters',
          type: 'warning'
        })
      }
    },
    handleCargoReadyChange(value) {
      console.log('cargoReadyForPickup changed to:', value)
    },
    /**
     * 获取cargo ready date 最大值
     */
    updateCargoReadyDateMaxDate() {
      if (!this.poList || this.poList.length === 0) {
        console.log('no poList', this.poList)
        this.cargoReadyDateMaxDate = null
        return
      }
      console.log('has poList', this.poList)
      let maxTimestamp = -Infinity
      for (const item of this.poList) {
        const timestamp = item.cargoReadyDate
        if (timestamp && !isNaN(timestamp)) {
          maxTimestamp = Math.max(maxTimestamp, timestamp)
        }
      }
      console.log('maxTimestamp', maxTimestamp)
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
