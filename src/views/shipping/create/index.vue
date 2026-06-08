<template>
  <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
    <el-card class="pd-20">
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

      <el-dialog
        :title="upload.title"
        :visible.sync="upload.open"
        width="400px"
        append-to-body
      >
        <el-upload class="upload-demo" ref="uploadBookingNote" multiple action="#" :auto-upload="false"
                   :limit="1" accept=".xlsx,.xls"  :on-exceed="handleExceed"
                   :file-list="bookingNoteList" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleRemove"
                   :on-change="(file, files) => handleFileChangeThen(file, files, () => {handleChange(file, files)}, () => {bookingNoteList = []})"
                   v-loading="upload.isUploading" :disabled="upload.isUploading" drag>

          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("purchaseOrder.DragTheFileHereOr")
            }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
          </div>
          <div class="el-upload__tip text-center" slot="tip">

            <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
<!--            <el-link-->
<!--              type="primary"-->
<!--              :underline="false"-->
<!--              style="font-size: 12px; vertical-align: baseline"-->
<!--              @click="importTemplate"-->
<!--            >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>-->
          </div>
        </el-upload>
      </el-dialog>

      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="0px">

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Booking Files</div>
          <el-row :gutter="20"  >
            <el-col :span="6" >
              <div style=" display: flex;flex-direction: row;">
                <span  @click="downloadTemplate()" >
                  <icon-park type="inbox-download-r"theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
                </span>
                <span  @click="handleImport()" >
                  <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"strokeLinecap="square"/>
                </span>

              </div>
            </el-col>
            <el-col :offset="10" :span="8">
              <el-button @click="showTitle()" type="primary" style="display:flex; float:right; margin-right: 10px;">Save Template</el-button>
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
                        :title="'Delete '+item.title"
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
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title :column="3">
            <el-descriptions-item label="Customer ref">
              <template slot="label">
                Customer ref
                <el-tooltip effect="light" content="This is the reference for the customer, for example a PO number or unique order reference." placement="right">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <el-form-item label prop="customerRef">
                <el-input v-model="form.customerRef" clearable></el-input>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> SO Type
              </template>
              <el-form-item required label prop="shipmentType">
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
              <el-form-item required label prop="paymentTerm">
                <el-select filterable v-model="form.paymentTerm">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value" :value="dict.value" />
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
            <el-descriptions-item></el-descriptions-item>
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
              <el-form-item required prop="blType">
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
              <el-form-item required label prop="truckServices">
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
              <el-form-item required label prop="originPort">
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
              <el-form-item required label prop="deliverServiceToFnd">
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
              <el-form-item required label prop="destinationPort">
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
              <el-form-item :required="form.deliverServiceToFnd == 'Yes'" label prop="destinationLocation">
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
                <el-select v-model="form.shipperCompany" clearable filterable allow-create default-first-option @change="shipperChange" placeholder="Shipper Company">
                  <el-option v-for="item in shipperList" :label="item.shipperCompany" :value="item.shipperCompany"></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Consignee
              </template>
              <el-form-item required label prop="consigneeCompany">
                <el-select v-model="form.consigneeCompany" clearable filterable allow-create default-first-option @change="consigneeChange" placeholder="Shipper Company">
                  <el-option v-for="item in consigneeList" :label="item.consigneeCompany" :value="item.consigneeCompany"></el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font color="#FF0000">*</font> Notify
              </template>
              <el-form-item required label prop="notifyCompany">
                <el-select v-model="form.notifyCompany" clearable filterable allow-create default-first-option @change="notifyChange" placeholder="Shipper Company">
                  <el-option v-for="item in notifyPartyList" :label="item.notifyCompany" :value="item.notifyCompany"></el-option>
                </el-select>
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

          <el-row>
            <el-button @click="addProduct" size="mini" type="text">
              <i class="el-icon-plus"></i>
              {{
              $t("booking.addProduct")
              }}
            </el-button>
          </el-row>
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
              <el-form-item required label :prop="'productData.' + i + '.hscode'">
                <el-input v-model="item.hscode" clearable @blur="item.hscode = $event.target.value.trim()" />
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

          <el-row>
            <el-button @click="addContainers" size="mini" type="text">
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
                  <el-select filterable placeholder v-model="item.type" @change="handleOptionChange(item.type)">
                    <el-option v-for="item  in containerOptions" :label="item.type" :value="item.type" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item required label-width="0px" :prop="'containers.' + i + '.qty'">
                  <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
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
                  :required="
              item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'"
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
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
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)
                  .isReeferContainer == 'Yes'
              ">
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
              <el-col :span="2">
                <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDeleteContainer(i)">{{ $t("search.delete") }}</el-button>
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

        <el-row style="text-align: center; padding: 20px;">
          <el-button size="mini" @click="submit()" type="primary" :loading="loadingSaveBut">Submit</el-button>
        </el-row>
      </el-form>
    </el-card>
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
.delete-template-option {
  padding-left: 15px;
  float: right;
  font-size: 12px;
  color: #ff4949;
}
</style>

<script>
import { getUserProfile } from '@/api/system/user'
import { createOrder, getOrder, getPartiesList, uploadShippingFile, downloadShippingOrderTemplate } from '@/api/shipping/order'
import { getBaseHeader } from '@/utils/request'
import { getProductList } from '@/api/system/product'
import { getContainerList } from '@/api/system/container'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getHsCodeListByCode } from '@/api/system/hsCode'
import { createTemplate, deleteTemplate, getTemplateList } from '@/api/shipping/template'
import XLSX from 'xlsx'
import '@icon-park/vue/styles/index.css';
import {IconPark} from '@icon-park/vue/es/all';
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: 'Shipment',
  mixins: [fileLoadMixin],
  components: { IconPark },
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
        containers: [{ containers: '' }],
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
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
      },
    }
  },
  mounted() {},
  created() {
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
    this.getPortList()
    this.getContainerList()
    if (this.$route.query.id) {
      getOrder(this.$route.query.id).then(response => {
        this.form = response.data
        var data = this.form.productDOList
        this.$set(this.form, 'productData', [])
        for (var j = 0; j < data.length; j++) {
          var item = data[j]
          item.mark = item.remark
          item.uploadData = {}
          item.fileList = []
          if (item.hazardousMaterials == '{}') {
            item.dg = 0
          } else {
            item.dg = 1
          }
          item.batteries = Number(item.batteries)
          if (!item.batteries) item.batteries = 3
          item.hazardousMaterials = JSON.parse(item.hazardousMaterials)
          this.form.productData.push(item)
        }
        this.$set(this.form, 'containers', [])
        this.$set(this.form, 'remark', '')
        this.$set(this.form, 'shipmentId', null)
        this.$set(this.form, 'siCreateDate', null)
        this.$set(this.form, 'siStatus', 0)
        this.$set(this.form, 'rejectedText', null)
        this.$set(this.form, 'status', 0)
        this.$set(this.form, 'customerId', 0)

        this.addContainers()
        //this.addProduct()
      })
    } else {
      this.getUserInfo()
    }
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })
    this.getTemplateData()
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "Import";
      this.upload.open = true;
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
      this.flag = flag
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
            let formData = new FormData()
            formData.append('shppingId', response.data.shippingId)
            formData.append('delIds', this.delIds)
            this.bookingNoteList.map(item => {
              formData.append('file', item.raw)
            })
            if (this.bookingNoteList.length > 0 || this.delIds.length > 0) {
              uploadShippingFile(formData).then(response => {})
            }
            var vm = this
            setTimeout(function () {
              vm.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              })
              vm.$router.push('/shipment/shippingOrder')
              vm.loadingSaveBut = false
              vm.submitLoading = false
            }, 2000)
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
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`Delete ${file.name}？`)
    },
    handleRemove(file, fileList) {
      console.log(file)
      this.bookingNoteList = fileList
      this.delIds.push(file.id)
    },
    handlePreview(file) {
      console.log(file)
      window.open(file.url, '_blank')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The current limit is 1 file, this time ${files.length} files are selected.`)
    },
    handleChange(file, fileList) {
      this.bookingNoteList = fileList
      var vm = this
      this.file2Xce1(file).then(tabJson => {})
      this.upload.open = false
      this.$refs.uploadBookingNote.clearFiles();
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

    downloadTemplate() {
      downloadShippingOrderTemplate().then(res => {
        this.$download.excel(res, 'import_template_shipping_order.xlsx')
      })
      // window.open('https://www.smartmoovhub.com/admin-api/infra/file/5/get/b3d908540ef24384b878b552619be9be.xls', "_blank");
    },
    showTitle() {
      this.titleShow = true
    },
    saveTemplate() {
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          this.templateLoading = true
          var data = {
            title: this.templateForm.title,
            templateData: JSON.stringify(this.form)
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
      this.form = JSON.parse(val.templateData)
    },
    getTemplateData() {
      getTemplateList().then(res => {
        this.templateList = res.data
      })
    },
    restTemplate() {
      this.$refs['templateForm'].resetFields()
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
