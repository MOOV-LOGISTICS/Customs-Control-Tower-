<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <div style="position: relative">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.4004 11.551L36.3332 5H11.6666L6.58398 11.551" stroke="#444" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
        <path d="M6 13C6 11.8954 6.89543 11 8 11H40C41.1046 11 42 11.8954 42 13V40C42 41.6569 40.6569 43 39 43H9C7.34315 43 6 41.6569 6 40V13Z" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
        <path d="M32 27L24 35L16 27" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
        <path d="M23.9917 19V35" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
      </svg>
      <span style="position: absolute; top: 12px; font-size: 20px">Container Loading Result{{ soType!=null&&soType!=''?('('+soType+')'):''}}</span>
    </div>
    <el-divider content-position="left"></el-divider>
    <el-empty description="No Carrier Booking" v-if="showNotData"></el-empty>
    <el-form ref="form" :model="form" v-loading="showLoadingData" v-show="!showNotData">
      <el-row v-show="showSearchBookingNumber">
        <el-col :span="6">
          <!--          <el-form-item prop="shipmentId">-->
          <!--            <el-select remote @change="changeBl" :remote-method="remoteMethod" v-model="form.shipmentId" filterable-->
          <!--              placeholder="Booking Number">-->
          <!--              <el-option v-for="item in shipments" :key="item.value" :label="item.shipmentBookingNumber"-->
          <!--                :value="item.id">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row v-show="showDetail">
        <el-col>
          <el-card shadow="always" class="clp-container" style=" margin-top: 10px;">
            <div style="font-size: 20px; padding-top: 15px; padding-left: 15px; font-weight: 600;">DECLARATION OF FUMIGATION</div>
            <el-upload
              class="upload-declar"
              ref="uploadDeclar"
              multiple
              style="width: 400px;margin-left: 15px;margin-top: 10px;"
              :action="uploadDeclar.url + '/admin-api/pepco/shipment/clp/upload'"
              :data="uploadDeclar.uploadData"
              :on-change="(file, files) => handleFileChangeThen(file, files, () => {this.uploadDeclar.fileList = files}, () => {this.uploadDeclar.fileList = []})"
              :headers="uploadDeclar.headers"
              :on-success="handleSuccess"
              :file-list="uploadDeclar.fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" type="primary">
                {{
                $t("booking.browse")
                }}
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
            <div style="margin-left: 20px;margin-bottom: 20px;">
              <el-card class="box-card" style="margin-bottom: 10px;margin-right: 10px;" v-show="clp.files.length > 0">
                <div v-for="file in clp.files" class="text-upload inline-item" size="mini" style="width: 400px;padding-right: 10px;">
                  <div class="tools-but">
                    <el-button type="text" @click="handlePreview(file)" icon="el-icon-download" style="margin-right: 6px"></el-button>
                    <span @click="deleteDocument(file)">
                      <i class="el-icon-delete" />
                    </span>
                  </div>
                  <el-descriptions :colon="false" :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px">
                    <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('document.uploadedOn')">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row v-show="showDetail">
        <el-col style="border: 0px solid #ddd; padding-bottom: 10px;padding-top: 17px;padding-left: 10px;font-size: 18px;" v-show="carrierData">
          <span v-if="soType=='FCL'">Shipment Ref: {{ carrierData.bookingNumber}}</span>

          <span v-if="soType=='FCL'" style="padding-left:20px;">Booking Number: {{ carrierData.shipmentBookingNumber }}</span>
          <span v-if="soType=='LCL'">Shipper Booking Ref: {{ soRef }}</span>

          <div v-show="showDetail" style="float: right">
            <div style="float: right;margin-left: 5px;">
              <el-button size="small" type="primary" @click="downloadImportTemplate" icon="el-icon-download">Download Template</el-button>
            </div>
            <div style="float: right;margin-left: 5px;">
              <el-upload ref="uploadRef" class="upload-demo" action="#" :on-change="handleFileChange" :show-file-list="false" accept=".xlsx">
                <el-button size="small" type="primary">Upload</el-button>
              </el-upload>
            </div>
          </div>
        </el-col>
        <el-col>
          <el-card v-if="soType=='FCL'" shadow="always" class="clp-container">
            <div v-for="(container, containerIndex) in form.containerList" :key="containerIndex" class="container-card">
              <el-row class="card-header-clp" :gutter="20">
                <el-col :span="3">Container Type</el-col>
                <el-col :span="3">Container Number</el-col>
                <el-col :span="3">Seal Number</el-col>
              </el-row>
              <el-row>
                <el-col :span="3" :gutter="20">{{ container.containerType || '-' }}</el-col>
                <el-col :span="3">{{ container.containerNo || '-' }}</el-col>
                <el-col :span="3">{{ container.containerSealNumber || '-' }}</el-col>
              </el-row>
              <div class="item-list">
                <el-row class="card-header-clp" :gutter="20">


                  <el-col style="width:150px">Order Number</el-col>
                  <el-col style="width:110px">Item Number</el-col>
                  <el-col :span="4">Item Name</el-col>
                  <el-col style="width:120px">TC Id</el-col>
                  <el-col :span="2">Loaded Outer Cartons</el-col>
                  <el-col :span="2">Loaded Inner Cartons</el-col>
                  <el-col :span="2">Loaded Pieces</el-col>
                  <el-col :span="2">Gross Weight (KG)</el-col>
                  <el-col :span="2">Volume (CBM)</el-col>
                  <el-col :span="1">
                    <el-button type="primary" icon="el-icon-plus" circle style="font-size: 10px;" @click="addItem(container)"></el-button>
                  </el-col>
                </el-row>
                <div v-for="(item, itemIndex) in container.itemData" :key="itemIndex" class="item-card">
                  <el-row :gutter="20">

                    <el-col style="width:150px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                        :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.orderNumber'">
                        <el-input placeholder="" v-model="item.orderNumber" clearable
                          @input.native="item.orderNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col style="width:110px">
                    <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                                            :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.itemNumber'">
                      <el-input placeholder="" v-model="item.itemNumber" clearable autocomplete="off"
                        @input.native="item.itemNumber = $event.target.value.trim()" />
                                              </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-input placeholder="" :title="item.itemName" v-model="item.itemName" clearable autocomplete="off"
                        @input.native="item.itemName = $event.target.value.trim()" />
                    </el-col>
                    <el-col style="width:120px">
                                          <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                                            :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.tcId'">
                      <el-input placeholder="" v-model="item.tcId" clearable autocomplete="off"
                        @input.native="item.tcId = $event.target.value.trim()" />
                                                                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.qty'">
                        <el-input placeholder v-number-only v-model="item.qty" clearable autocomplete="off" @change="totalRemaining" :controls="false" @input.native="item.qty = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                                                                                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                                                                                        :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.innerQty'">
                      <el-input placeholder="" v-number-only v-model="item.innerQty" clearable autocomplete="off"
                        @input.native="item.innerQty = $event.target.value.trim()" />
                                                                                                                      </el-form-item>

                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.pieces'">
                        <el-input placeholder v-number-only v-model="item.pieces" clearable autocomplete="off" @input.native="item.pieces = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.weight'">
                        <el-input placeholder v-number-only v-model="item.weight" clearable autocomplete="off" @change="totalRemaining" @input.native="item.weight = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.cbm'">
                        <el-input placeholder v-number-only v-model="item.cbm" clearable autocomplete="off" @change="totalRemaining" @input.native="item.cbm = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <el-button type="danger" icon="el-icon-delete" circle style="font-size: 10px;" v-if="container.itemData.length > 1" @click="deleteItem(containerIndex, itemIndex)"></el-button>
                    </el-col>
                  </el-row>
                </div>
                <!-- total row -->
                <el-row :gutter="20">
                  <el-col style="width:150px">Total</el-col>
                  <el-col style="width:110px">&nbsp;</el-col>
                  <el-col :span="4">&nbsp;</el-col>
                  <el-col style="width:120px">&nbsp;</el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.qty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.innerQty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.pieces),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.weight),0)?.toFixed(2) }}</span>
                  </el-col>
                  <el-col :span="1">
                    <span style="margin-left: 15px;">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.cbm),0)?.toFixed(3) }}</span>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
              </div>
            </div>

            <div class="clp-summary">
              <el-row class="card-header-clp" :gutter="20">
                <el-col :span="4">Total Loaded Outer Cartons</el-col>
                <el-col :span="4">Total Loaded Inner Cartons</el-col>
                <el-col :span="4">Total Loaded Pieces</el-col>
                <el-col :span="4">Total Gross Weight [kg]</el-col>
                <el-col :span="4">Total Volume [cbm]</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">
                  <span>{{cartonsProducedOuter}}</span>
                </el-col>
                <el-col :span="4">
                  <span>{{cartonsProducedInner}}</span>
                </el-col>
                <el-col :span="4">
                  <span>{{cartonsProducedPieces}}</span>
                </el-col>
                <el-col :span="4">
                  <span>{{totalGrossWeight}}</span>
                </el-col>
                <el-col :span="4">
                  <span>{{totalMeasurement}}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <el-card v-if="soType=='LCL'" shadow="always" class="clp-container">
            <div class="container-card">
              <div class="item-list">
                <el-row class="card-header-clp" :gutter="20">
                  <el-col v-if="isOHA" :span="2">Container Number</el-col>

                  <el-col style="width:170px">Order Number</el-col>
                  <el-col style="width:110px">Item Number</el-col>
                  <el-col :span="4">Item Name</el-col>
                  <el-col style="width:120px">TC Id</el-col>
                  <el-col :span="rowSpan">Loaded Outer Cartons</el-col>
                  <el-col :span="2">Loaded Inner Cartons</el-col>
                  <el-col :span="2">Loaded Pieces</el-col>
                  <el-col :span="2">Gross Weight (KG)</el-col>
                  <el-col :span="2">Volume (CBM)</el-col>
                  <el-col :span="1">
                    <el-button type="primary" icon="el-icon-plus" circle style="font-size: 10px;" @click="addLCLItem(form.poList)"></el-button>
                  </el-col>
                </el-row>
                <div v-for="(item, itemIndex) in form.poList" :key="itemIndex" class="item-card">
                  <el-row :gutter="20">
                    <el-col v-if="isOHA" :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.containerNo'">
                        <el-select v-model="item.containerNo" filterable allow-create clearable default-first-option placeholder>
                          <el-option v-for="item in siContainerNoList" :key="item.id" :label="item.containerNo" :value="item.containerNo"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col style="width:170px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                        :prop="'poList.' + itemIndex+'.orderNumber'">
                        <el-input placeholder="" v-model="item.orderNumber" clearable
                          @input.native="item.orderNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col  style="width:110px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                        :prop="'poList.' + itemIndex+'.itemNumber'">
                        <el-input placeholder="" v-model="item.itemNumber" clearable autocomplete="off"
                          @input.native="item.itemNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-input placeholder="" :title="item.itemName" v-model="item.itemName" clearable autocomplete="off"
                        @input.native="item.itemName = $event.target.value.trim()" />
                    </el-col>
                    <el-col style="width:120px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                        :prop="'poList.' + itemIndex+'.tcId'">
                        <el-input placeholder="" v-model="item.tcId" clearable autocomplete="off"
                          @input.native="item.tcId = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="rowSpan">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                        :prop="'poList.' + itemIndex+'.qty'">
                        <el-input placeholder="" v-number-only v-model="item.qty" clearable autocomplete="off"
                          @change="totalRemaining" :controls="false" @input.native="item.qty = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.innerQty'">
                        <el-input placeholder v-number-only v-model="item.innerQty" clearable autocomplete="off" @input.native="item.innerQty = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.pieces'">
                        <el-input placeholder v-number-only v-model="item.pieces" clearable autocomplete="off" @input.native="item.pieces = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.weight'">
                        <el-input placeholder v-number-only v-model="item.weight" clearable autocomplete="off" @change="totalRemaining" @input.native="item.weight = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.cbm'">
                        <el-input placeholder v-number-only v-model="item.cbm" clearable autocomplete="off" @change="totalRemaining" @input.native="item.cbm = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <el-button type="danger" icon="el-icon-delete" circle style="font-size: 10px;" v-if="form.poList.length > 1" @click="deleteLCLItem(itemIndex)"></el-button>
                    </el-col>
                  </el-row>              
                </div>
                 <!-- total row -->
                <el-row :gutter="20">
                  <!-- <el-col v-if="isOHA" :span="2">Total</el-col> -->
                  <el-col v-if="isOHA" :span="2">Total</el-col>
                  <el-col style="width:170px">{{ isOHA ? '&nbsp;' : 'Total' }}</el-col>
                  <el-col style="width:110px">&nbsp;</el-col>
                  <el-col :span="4">&nbsp;</el-col>
                  <el-col style="width:120px">&nbsp;</el-col>
                  <el-col :span="rowSpan">
                    <span style="margin-left: 15px;">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.qty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.innerQty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.pieces),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.weight),0)?.toFixed(2) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span style="margin-left: 15px;">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.cbm),0)?.toFixed(3) }}</span>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
              </div>
            </div>

            <div class="clp-summary">
              <el-row class="card-header-clp" :gutter="20">
                <el-col :span="3">Total Loaded Outer Cartons</el-col>
                <el-col :span="3">Total Loaded Inner Cartons</el-col>
                <el-col :span="3">Total Loaded Pieces</el-col>
                <el-col :span="3">Total Gross Weight [kg]</el-col>
                <el-col :span="3">Total Volume [cbm]</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3">
                  <span>{{cartonsProducedOuter}}</span>
                </el-col>
                <el-col :span="3">
                  <span>{{cartonsProducedInner}}</span>
                </el-col>
                <el-col :span="3">
                  <span>{{cartonsProducedPieces}}</span>
                </el-col>
                <el-col :span="3">
                  <span>{{totalGrossWeight}}</span>
                </el-col>
                <el-col :span="3">
                  <span>{{totalMeasurement}}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col style="margin-top: 10px; text-align: center">
          <el-button :disabled="isLoading" type="primary" @click="submit">Submit</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 差异确认对话框 (使用Vue变量控制) -->
    <el-dialog :visible.sync="differenceDialogVisible" width="65%" title="Confirmation" :before-close="handleDialogClose" center custom-class="custom-confirm-dialog" :show-close="false">
      <div class="difference-dialog">
        <div class="dialog-content">
          <p class="dialog-description">The following data differences from the original booking information have been detected:</p>
          <div class="difference-list">
            <div class="difference-item difference-${diff.level}" v-for="(diff, index) in differences" :key="index">
              <div class="difference-icon">
                <i class="el-icon-${diff.level === 'error' ? 'circle-cross' : 'exclamation'}"></i>
              </div>
              <div class="difference-content">
                <span class="difference-message">{{ diff.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="differenceDialogVisible = false">Return to Modify</el-button>
        <el-button type="primary" @click="confirmSubmit">Confirm Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findBookingNumberList, findShipmentOrderById } from '@/api/shipment/shipment'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getPolPodList } from '@/api/system/polPod'
import { getListByShipmentId } from '@/api/booking/booking'
import { getItemList } from '@/api/order/item'
import { getContainerList } from '@/api/system/container'
import { pepcoCreateClp, pepcoUpdateClp, pepcoDownloadShipmentCLPTemplateByShipmentId, pepcoGetList } from '@/api/shipment/pepcoclp'
import XLSX from 'xlsx'
import OrderDetail from '@/views/pepcoShipping/commponents/order-detail.vue'
import { getBaseHeader } from '@/utils/request'
import { deleteFile } from '@/api/infra/file'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { getUserCompanyTypeList } from '@/api/system/user'
import { getOrderHeaderListByQuery } from '@/api/pepco/shipping-order.js'
import { t } from '@wangeditor/editor'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import { findTmffContainerNo } from '@/api/shipment/hbl'

export default {
  name: 'CLP',
  mixins: [fileLoadMixin],
  components: { OrderDetail },
  data() {
    return {
      cartonsProducedOuter: 0,
      cartonsProducedInner: 0,
      cartonsProducedPieces: 0,

      totalCartonsProduced: 0,
      totalGrossWeight: 0,
      totalMeasurement: 0,
      form: {
        poList: [
          {
            containerNo: '',
            orderNumber: '',
            itemNumber: '',
            itemName: '',
            tcId: ''
          }
        ],
        containerList: [
          {
            containerType: '-',
            containerNo: '-',
            containerSealNumber: '-',
            itemData: [
              {
                orderNumber: '',
                itemNumber: '',
                itemName: '',
                tcId: ''
              }
            ]
          }
        ]
      },
      shipment: {},
      polPodMap: {},
      originDeliveryMap: {},
      shipments: [],
      tableData: [],
      containerOptions: [],
      activeNames: [],
      bookings: [],
      itemOptions: [],
      currentRow: null,
      itemList: [],
      orderList: [],

      carrierData: {},
      groupedOrders: [],
      showDetail: false,
      showSearchBookingNumber: true,
      clp: {
        id: '',
        files: []
      },
      uploadDeclar: {
        url: process.env.VUE_APP_BASE_API,
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        uploadData: { exId: '' }
      },
      successCount: 0,
      soType: '',
      isLoading: false,
      rowSpan: 3,
      soRef: '',
      // 用户所在的公司类型列表
      userCompanyTypeList: [],
      isOHA: false,
      originalBookingData: null, // 存储原始booking数据
      differenceDialogVisible: false,
      dialogWidth: '65%', // 弹框宽度变量
      differences: [],
      originalFCLData: [],
      orderId: '',
      showNotData: false,
      showLoadingData: false,
      siContainerNoList: []
    }
  },
  mounted() {
    getUserCompanyTypeList().then(response => {
      console.log('获取用户所在的公司类型列表')
      console.log(response.data)
      this.userCompanyTypeList = response.data
      if (this.userCompanyTypeList) {
        console.log(this.userCompanyTypeList)
        if (this.userCompanyTypeList.includes('OHA')) {
          this.isOHA = true
        }
      }

      this.getPortList()
      this.getContainerList()
      this.showLoadingData = true
      if (this.$route.query.id) {
        this.showSearchBookingNumber = false
        this.clp.id = this.$route.query.id
        this.getClp()
      } else if (this.$route.query.orderId || this.$route.query.shipmentId) {
        //根据orderId反查询SO 如果是LCL就返回数据
        this.showSearchBookingNumber = false
        //this.$route.query.orderId == 'null' 也算空
        if (this.$route.query.orderId == 'null') {
          this.orderId = ''
        } else {
          this.orderId = this.$route.query.orderId || ''
        }
        //this.$route.query.shipmentId == 'null' 也算空
        if (this.$route.query.shipmentId == 'null') {
          this.form.shipmentId = ''
        } else {
          this.form.shipmentId = this.$route.query.shipmentId || ''
        }
        this.changeBl(this.form.shipmentId, this.orderId)
      } else {
        this.showLoadingData = false
      }

      if (this.$route.query.soRef) {
        this.soRef = this.$route.query.soRef
      }
    })
  },
  methods: {
    checkPermi,
    //获取tmff对应的containerNo
    getTmffContainerNo() {
      findTmffContainerNo({ shipmentId: this.form.shipmentId, soRef: this.soRef }).then(res => {
        this.siContainerNoList = res.data
      })
    },
    validateContainerNO(value) {
      const regex = /^[A-Za-z]{4}\d{7}$/
      if (!regex.test(value)) {
        this.$notify.error('The first four digits of "containerNo" must be capital letters, and the last seven digits must be numbers!')
        return false
      }
      return true
    },
    getClp() {
      pepcoGetList({ ids: [this.clp.id].join(',') }).then(res => {
        console.log(res.data)
        if (res.data.length == 0) {
          this.showNotData = true
          this.showLoadingData = false
          return
        }
        this.clp = res.data[0]

        this.soRef = this.clp.soNumbers
        console.log(this.clp)
        console.log(this.clp.shipmentClpDetailDOS)
        this.form.poList = JSON.parse(JSON.stringify(this.clp.shipmentClpDetailDOS))

        this.form.shipmentId = this.clp.shipmentId
        this.changeBl(this.form.shipmentId, this.orderId)
      })
    },
    totalProduced() {
      if (this.itemList == null) {
        return
      }
      for (var item of this.itemList) {
        this.totalCartonsProduced += item.booked == null ? 0 : item.booked
        this.totalGrossWeight += item.outerWeight && item.booked ? Number(item.outerWeight * item.booked) : 0
        this.totalMeasurement += item.booked && item.length1 && item.width1 && item.height1 ? Number((item.booked * item.length1 * item.width1 * item.height1) / 1000000) : 0
      }
    },
    totalRemaining() {
      try {
        console.log('Starting totalRemaining calculation')

        if (this.soType !== 'FCL' && this.soType !== 'LCL') {
          throw new Error('Invalid soType: ' + this.soType)
        }

        // Initialize all counters
        const counters = {
          produced: 0,
          producedInner: 0,
          producedPieces: 0,
          grossWeight: 0,
          measurement: 0
        }

        if (this.soType === 'FCL') {
          if (!this.form?.containerList) {
            console.warn('containerList is undefined')
            return
          }

          for (const container of this.form.containerList) {
            if (!container?.itemData) continue

            for (const item of container.itemData) {
              if (!item) continue

              try {
                counters.produced += Number(item.qty) || 0
                counters.producedInner += Number(item.innerQty) || 0
                counters.producedPieces += Number(item.pieces) || 0
                counters.grossWeight += Number(item.weight) || 0
                counters.measurement += Number(item.cbm) || 0
              } catch (e) {
                console.error('Error processing item:', item, e)
              }
            }
          }
        } else {
          // LCL
          if (!this.form?.poList) {
            console.warn('poList is undefined')
            return
          }
          for (const po of this.form.poList) {
            if (!po) continue

            try {
              counters.produced += Number(po.qty) || 0
              counters.producedInner += Number(po.innerQty) || 0
              counters.producedPieces += Number(po.pieces) || 0
              counters.grossWeight += Number(po.weight) || 0
              counters.measurement += Number(po.cbm) || 0
            } catch (e) {
              console.error('Error processing PO:', po, e)
            }
          }
        }
        // Debug logs
        console.log('Calculated values:', counters)

        // Assign results
        this.cartonsProducedOuter = counters.produced
        this.cartonsProducedInner = counters.producedInner
        this.cartonsProducedPieces = counters.producedPieces
        this.totalGrossWeight = counters.grossWeight.toFixed(3)
        this.totalMeasurement = counters.measurement.toFixed(3)
      } catch (error) {
        console.error('Error in totalRemaining:', error)
        // Optionally set default values or show error message
        this.cartonsProducedOuter = 0
        this.cartonsProducedInner = 0
        this.cartonsProducedPieces = 0
        this.totalGrossWeight = 0
        this.totalMeasurement = 0
      }
    },
    cgItem(val, data) {
      console.log(val, data)
    },
    deleteItem(containerIndex, index) {
      const newContainerList = [...this.form.containerList]
      newContainerList[containerIndex].itemData.splice(index, 1)
      this.form.containerList = newContainerList
    },
    deleteLCLItem(index) {
      const nePoList = [...this.form.poList]
      nePoList.splice(index, 1)
      this.form.poList = nePoList
    },
    addItem(container) {
      const newItem = {
        orderNumber: '',
        itemNumber: '',
        itemName: '',
        tcId: ''
      }
      const newContainer = { ...container, itemData: [...container.itemData, newItem] }
      const newContainerList = [...this.form.containerList]
      const containerIndex = newContainerList.indexOf(container)
      newContainerList[containerIndex] = newContainer
      this.form.containerList = newContainerList
    },
    addLCLItem(poList) {
      const newItem = {
        containerNo: '',
        orderNumber: '',
        itemNumber: '',
        itemName: '',
        tcId: ''
      }
      poList.push(newItem)
      const newPoList = [...poList]
      this.form.poList = newPoList
    },
    downloadImportTemplate() {
      pepcoDownloadShipmentCLPTemplateByShipmentId({ shipmentId: this.form.shipmentId, soRef: this.soRef }).then(res => {
        this.$download.excel(res, 'Container Loading Result.xlsx')
      })
    },

    handleFileChange(file) {
      this.file2Xce(file).then(tabJson => {
        this.$refs.uploadRef.clearFiles() // 清除文件列表
        var data = tabJson[0].sheet
        console.log(data)
        var newItems = []
        var noContainer = false
        if (!this.isOHA && this.soType === 'LCL') {
          noContainer = true
        }
        for (var i = 0; i < data.length; i++) {
          var order = data[i]
          const newItem = {
            containerNo: noContainer ? '' : order['Container Number'] || '',
            orderNumber: order['Order Number'] || '',
            itemNumber: order['Item Number'] || '',
            itemName: order['Item Name'] || '',
            tcId: order['TC Id'] || '',
            qty: order['Loaded Outer Cartons'] || 0,
            weight: order['Gross Weight (KG)'] || 0,
            cbm: order['Volume (CBM)'] || 0,
            innerQty: order['Loaded Inner Cartons'] || 0,
            pieces: order['Loaded Pieces'] || 0
          }
          newItems.push(newItem)
        }
        console.log(newItems)

        if (this.soType == 'FCL') {
          let hasMatchingData = false // 添加标志位跟踪是否有匹配数据

          for (var container of this.form.containerList) {
            const matchedItems = newItems.filter(item => item.containerNo === container.containerNo)
            if (matchedItems.length > 0) {
              hasMatchingData = true // 标记有匹配数据
            }
            container.itemData = []
            for (var newItem of newItems) {
              if (newItem.containerNo == container.containerNo) {
                container.itemData.push(newItem)
                continue
              }
            }
            if (container.itemData.length == 0) {
              container.itemData.push({
                orderNumber: '',
                itemNumber: '',
                itemName: '',
                tcId: ''
              })
            }
          }
          // 只有在完全没有匹配时才显示错误
          if (!hasMatchingData) {
            this.$modal.msgError('No data Mapping')
          }

          const timeoutId = setTimeout(() => {
            this.totalRemaining()
          }, 2000)
        } else {
          //LCL
          if (newItems.length > 0) {
            this.form.poList = JSON.parse(JSON.stringify(newItems))
          } else {
            this.$modal.msgError('No data Mapping')
          }
          const timeoutId = setTimeout(() => {
            this.totalRemaining()
          }, 2000)
        }
      })
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
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    },
    submit3() {
      this.isLoading = true

      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.isLoading = false
          return
        }
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].orderItemId = this.tableData[i].itemId
        }
        var itemList = []
        for (var i = 0; i < this.form.containerList.length; i++) {
          var container = this.form.containerList[i]
          for (var item of container.itemData) {
            item.containerType = container.containerType
            item.containerNo = container.containerNo
            item.containerId = container.id
            item.shipmentId = this.form.shipmentId
            itemList.push(item)
          }
        }
        var data = {}
        if (this.soType == 'FCL') {
          data = {
            shipmentId: this.form.shipmentId,
            details: JSON.stringify(itemList),
            id: this.clp ? this.clp.id : null,
            soType: this.soType
          }
        } else {
          // LCL
          data = {
            shipmentId: this.form.shipmentId,
            details: JSON.stringify(this.form.poList),
            id: this.clp ? this.clp.id : null,
            soType: this.soType,
            soRef: this.soRef
          }
        }
        console.log(data)
        // add 判断是否所有po都在
        console.log(this.itemList)
        if (this.soType == 'FCL') {
          console.log(itemList)
          for (var tempItem of this.itemList) {
            const matchedItems = itemList.filter(item => item.orderNumber === tempItem.orderNumber)
            if (matchedItems.length == 0) {
              console.log(matchedItems)
              this.$modal.msgError('Order Number ' + tempItem.orderNumber + ' is required')
              this.isLoading = false
              return
            }
          }
        } else {
          // LCL
          console.log(this.form.poList)
          var tempItemList = this.itemList.filter(item => item.soRef === this.soRef)

          console.log(tempItemList)
          for (var tempItem of tempItemList) {
            const matchedItems = this.form.poList.filter(item => item.orderNumber === tempItem.orderNumber)
            if (matchedItems.length == 0) {
              console.log(matchedItems)
              this.$modal.msgError('Order Number ' + tempItem.orderNumber + ' is required')
              this.isLoading = false
              return
            }
          }
          if (this.isOHA) {
            for (let i = 0; i < this.form.poList.length; i++) {
              const state = this.validateContainerNO(this.form.poList[i].containerNo)
              if (!state) {
                this.isLoading = false
                return
              }
            }
          }
        }

        console.log(data)
        if (this.$route.query.id) {
          pepcoUpdateClp(data)
            .then(res => {
              this.isLoading = false

              this.uploadDeclar.url = this.uploadDeclar.uploadData.exId = res.data
              console.log(this.uploadDeclar)
              this.$refs.uploadDeclar.submit()
              this.$router.push('/shipment/clp')
            })
            .catch(error => {
              this.isLoading = false
            })
            .finally(() => {
              this.isLoading = false
            })
        } else {
          pepcoCreateClp(data)
            .then(res => {
              this.isLoading = false

              this.uploadDeclar.url = this.uploadDeclar.uploadData.exId = res.data
              console.log(this.uploadDeclar)
              this.$refs.uploadDeclar.submit()
              this.$router.push('/shipment/clp')
            })
            .catch(error => {
              this.isLoading = false
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      })
    },
    getContainerList() {
      getContainerList().then(response => {
        this.containerOptions = response.data
      })
    },
    clearSelect(index) {
      this.$set(this.tableData[index], 'orderNumber', null)
      this.$set(this.tableData[index], 'productCode', null)
      this.$set(this.tableData[index], 'productName', null)
      this.$set(this.tableData[index], 'itemId', null)
      this.$set(this.tableData[index], 'orderId', null)
    },
    radioChange(index, id) {
      var value = this.itemOptions.find(item => item.id === id)
      this.$set(this.tableData[index], 'orderNumber', value ? value.orderNumber : null)
      this.$set(this.tableData[index], 'productCode', value ? value.productCode : null)
      this.$set(this.tableData[index], 'productName', value ? value.productName : null)
      this.$set(this.tableData[index], 'itemId', value ? value.id : null)
      this.$set(this.tableData[index], 'orderId', value ? value.orderId : null)
    },
    addClpDetail() {
      this.tableData.push({})
    },
    changeBl(shipmentId, orderId) {
      //this.getBookings(this.form.shipmentId);
      findShipmentOrderById(shipmentId, orderId).then(res => {
        this.showLoadingData = false
        this.form.shipmentId = shipmentId

        // 获取原始 booking 数据
        this.getOriginalBookingData()
        this.soType = res.data.soType
        if (this.soType == 'LCL') {
          this.rowSpan = 2
          //查询箱号下拉框用
          this.getTmffContainerNo()
        }
        this.carrierData = res.data.shipments

        if (this.soType == 'FCL') {
          this.itemList = res.data.itemList
          if (this.itemList == null || this.itemList == undefined) {
            this.itemList = []
          }

          this.totalProduced()
          this.form.containerList = res.data.containerList
          if (this.form.containerList.length > 0) {
            this.showDetail = true
            this.totalRemaining()
          }
          let tempItems = []
          // 生成行数据
          this.itemList.forEach(item => {
            console.log(item)
            const tmp = {
              id: item.id,
              orderId: item.orderId,
              orderNumber: item.orderNumber,
              itemNumber: item.productCode,
              itemName: item.productName,
              tcId: item.tcId,
              orderedPieces: item.requested,
              outerQty: item.outerQty,
              outerSize: item.outerSize,
              tcSize: item.tcSize,
              tcQty: item.tcQty,
              bookedProOuterSize: item.bookedProOuterSize,
              bookedProInnerPerOuter: item.bookedProInnerPerOuter,
              outerWeight: item.outerWeight || 0,
              length: item.length1,
              width: item.width1,
              height: item.height1
            }
            tmp.orderedOuter = item.outerQty
            tmp.orderedInner = tmp.tcQty
            tmp.bookedOuter = tmp.orderedOuter
            tmp.bookedInner = tmp.orderedOuter * tmp.bookedProInnerPerOuter
            tmp.bookedPieces = tmp.orderedOuter * tmp.bookedProOuterSize
            tmp.grossWeight = (tmp.orderedOuter * tmp.outerWeight).toFixed(3)
            tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(3) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000
            tmp.qty = item.booked
            tmp.innerQty = item.bookedInner
            tmp.pieces = item.bookedPieces
            tmp.weight = (item.outerWeight * item.booked).toFixed(1) == 0 ? '' : (item.outerWeight * item.booked).toFixed(3)
            tmp.cbm = ((tmp.length * tmp.width * tmp.height * item.booked) / 1000000).toFixed(1) == 0 ? '' : ((tmp.length * tmp.width * tmp.height * item.booked) / 1000000).toFixed(3)
            tempItems.push(tmp)
          })

          this.groupedOrders = tempItems
            .reduce((acc, item) => {
              const groupKey = item.orderNumber
              if (!acc[groupKey]) {
                acc[groupKey] = {
                  orderNumber: groupKey,
                  items: []
                }
              }
              acc[groupKey].items.push(item)
              return acc
            }, {})
            .valueOf()
          console.log(this.groupedOrders)
          for (var i = 0; i < this.form.containerList.length; i++) {
            if (!this.form.containerList[i].itemData) {
              this.form.containerList[i]['itemData'] = []
              this.addItem(this.form.containerList[i])
            }
          }

          if (this.form.containerList.length == 1) {
            this.$set(this.form.containerList[0], 'itemData', [])
            this.itemList.forEach(item => {
              this.form.containerList[0].itemData.push({
                containerId: this.form.containerList[0].containerId,
                containerNo: this.form.containerList[0].containerNo,
                orderNumber: item.orderNumber,
                itemNumber: item.productCode,
                itemName: item.productName,
                tcId: item.tcId,
                qty: item.booked,
                innerQty: item.bookedInner,
                pieces: item.bookedPieces,
                weight: (item.outerWeight * item.booked).toFixed(1) == 0 ? '' : (item.outerWeight * item.booked).toFixed(3),
                cbm: ((item.length1 * item.width1 * item.height1 * item.booked) / 1000000).toFixed(1) == 0 ? '' : ((item.length1 * item.width1 * item.height1 * item.booked) / 1000000).toFixed(3)
              })
            })

            console.log('最终结果:', JSON.parse(JSON.stringify(this.form.containerList)))
          }

          if (this.clp.id) {
            console.log(this.clp)
            for (var container of this.form.containerList) {
              container.itemData = []
              console.log(this.clp)
              if (this.clp.shipmentClpDetailDOS != null) {
                for (var newItem of this.clp.shipmentClpDetailDOS) {
                  if (newItem.containerNo == container.containerNo) {
                    container.itemData.push(newItem)
                    continue
                  }
                }
              }
              if (container.itemData.length == 0) {
                container.itemData.push({
                  orderNumber: '',
                  itemNumber: '',
                  itemName: '',
                  tcId: ''
                })
              }
            }
          }
          this.totalRemaining()
          //copy containerList
          this.originalFCLData = JSON.parse(JSON.stringify(this.form.containerList))
        } else {
          //LCL
          this.showDetail = true
          this.itemList = res.data.itemList
          if (this.itemList == null || this.itemList == undefined) {
            this.itemList = []
          }
          if (this.$route.query.shipmentId) {
            let tempItems = []
            // 生成行数据
            this.itemList.forEach(item => {
              console.log(item)
              const tmp = {
                id: item.id,
                orderId: item.orderId,
                orderNumber: item.orderNumber,
                itemNumber: item.productCode,
                itemName: item.productName,
                tcId: item.tcId,
                orderedPieces: item.requested,
                outerQty: item.outerQty,
                outerSize: item.outerSize,
                tcSize: item.tcSize,
                tcQty: item.tcQty,
                bookedProOuterSize: item.bookedProOuterSize,
                bookedProInnerPerOuter: item.bookedProInnerPerOuter,
                outerWeight: item.outerWeight || 0,
                length: item.length1,
                width: item.width1,
                height: item.height1
              }

              tmp.orderedOuter = item.outerQty
              tmp.orderedInner = tmp.tcQty
              tmp.bookedOuter = tmp.orderedOuter
              tmp.bookedInner = tmp.orderedOuter * tmp.bookedProInnerPerOuter
              tmp.bookedPieces = tmp.orderedOuter * tmp.bookedProOuterSize
              tmp.grossWeight = (tmp.orderedOuter * tmp.outerWeight).toFixed(3)
              tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(1) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000
              tmp.qty = item.booked
              tmp.innerQty = item.bookedInner
              tmp.pieces = item.bookedPieces
              tmp.weight = (item.outerWeight * item.booked).toFixed(1) == 0 ? '' : (item.outerWeight * item.booked).toFixed(3)
              tmp.cbm = ((tmp.length * tmp.width * tmp.height * item.booked) / 1000000).toFixed(1) == 0 ? '' : ((tmp.length * tmp.width * tmp.height * item.booked) / 1000000).toFixed(3)
              if (item.soRef == this.soRef) {
                tempItems.push(tmp)
              }
            })
            this.form.poList = JSON.parse(JSON.stringify(tempItems))
          }
          const timeoutId = setTimeout(() => {
            this.totalRemaining()
          }, 2000)
        }
      })
    },
    getBookings(shipmentId) {
      getListByShipmentId({ shipmentId: shipmentId }).then(response => this.getItems(response))
    },
    async getItems(response) {
      var bookings = []
      for (var i = 0; i < response.data.length; i++) {
        var itemIds = []
        var bookedMap = {}
        for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
          itemIds.push(response.data[i].bookingItemDOS[j].orderItemId)
          bookedMap[response.data[i].bookingItemDOS[j].orderItemId] = response.data[i].bookingItemDOS[j].qty
        }
        var res = await getItemList({ ids: itemIds.join(',') })
        for (var k = 0; k < res.data.length; k++) {
          res.data[k].pb_qty = bookedMap[res.data[k].id]
        }
        var data = {
          data: response.data[i],
          items: res.data
        }
        for (var l = 0; l < res.data.length; l++) {
          res.data[l].bookingId = response.data[i].id
          this.itemOptions.push(res.data[l])
        }

        this.activeNames.push(response.data[i].id)
        bookings.push(data)
      }
      this.bookings = bookings
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 1) {
        findBookingNumberList(query).then(res => {
          this.shipments = res.data
        })
      }
    },
    getPortList() {
      getOriginDeliveryList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name)
        }
      })
      getPolPodList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.polPodMap, response.data[i].code, response.data[i].name)
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
    },
    handlePreview(file) {
      if (file.id) {
        window.location.href = file.url
      }
    },
    /** 删除文档按钮操作 */
    deleteDocument(row) {
      const id = row.id
      this.$modal
        .confirm('Delete "' + row.name + '"?')
        .then(function () {
          return deleteFile(id)
        })
        .then(() => {
          this.getClp()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },

    // 获取原始 booking 数据
    getOriginalBookingData() {
      getOrderHeaderListByQuery({ soRef: this.soRef, orderNumber: '' })
        .then(res => {
          this.originalBookingData = res.data
        })
        .catch(err => {
          console.error('获取原始 booking 数据失败', err)
        })
    },

    // 提交前数据校验
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 检查是否已加载原始 booking 数据
          if (!this.originalBookingData) {
            this.$message.warning('Please select a valid Booking Number first')
            return
          }

          // 执行 submit3() 中的校验逻辑
          if (!this.validateSubmitData()) {
            return
          }

          // 比对数据差异
          this.differences = this.compareData()

          if (this.differences.length > 0) {
            // 显示差异确认对话框
            this.showDifferenceDialog()
          } else {
            // 无差异，直接提交
            this.confirmSubmit()
          }
        }
      })
    },

    // 提取 submit3() 中的校验逻辑
    validateSubmitData() {
      // 检查所有PO是否存在
      if (this.soType == 'FCL') {
        for (var tempItem of this.itemList) {
          const matchedItems = this.form.containerList.flatMap(container => container.itemData.filter(item => item.orderNumber === tempItem.orderNumber))
          if (matchedItems.length === 0) {
            this.$modal.msgError(`Order Number ${tempItem.orderNumber} is required`)
            return false
          }
        }
      } else {
        // LCL
        const tempItemList = this.itemList.filter(item => item.soRef === this.soRef)
        for (var tempItem of tempItemList) {
          const matchedItems = this.form.poList.filter(item => item.orderNumber === tempItem.orderNumber)
          if (matchedItems.length === 0) {
            this.$modal.msgError(`Order Number ${tempItem.orderNumber} is required`)
            return false
          }
        }
      }

      // OHA公司验证容器编号格式
      if (this.isOHA && this.soType === 'LCL') {
        for (let i = 0; i < this.form.poList.length; i++) {
          if (!this.validateContainerNO(this.form.poList[i].containerNo)) {
            return false
          }
        }
      }

      return true
    },

    // 比对当前数据与原始 booking 数据
    compareData() {
      const differences = []

      // 根据 shipment 类型进行不同的比对逻辑
      if (this.soType === 'FCL') {
        // FCL 类型比对容器和商品数据
        this.compareFCLData(differences)
      } else if (this.soType === 'LCL') {
        // LCL 类型比对商品数据
        this.compareLCLData(differences)
      }

      return differences
    },

    // 比对 FCL 类型数据
    compareFCLData(differences) {
      // 将groupedOrders转换为数组以便遍历
      const orderGroups = Object.values(this.groupedOrders)
      // 比对容器数据
      this.form.containerList.forEach((container, containerIndex) => {
        // 从originalFCLData获取对应容器原始数据
        const originalContainer = this.originalFCLData[containerIndex]
        if (originalContainer) {
          // 容器类型比对
          if (container.containerType !== originalContainer.containerType) {
            differences.push({
              type: 'container',
              level: 'warning',
              message: `Container Type changed from "${originalContainer.containerType}" to "${container.containerType}"`
            })
          }

          // 容器编号比对
          if (container.containerNo && container.containerNo !== originalContainer.containerNo) {
            differences.push({
              type: 'container',
              level: 'warning',
              message: `Container Number changed from "${originalContainer.containerNo || 'N/A'}" to "${container.containerNo}"`
            })
          }

          // 容器铅封号比对
          if (container.containerSealNumber && container.containerSealNumber !== originalContainer.containerSealNumber) {
            differences.push({
              type: 'container',
              level: 'warning',
              message: `Container Seal Number changed from "${originalContainer.containerSealNumber || 'N/A'}" to "${container.containerSealNumber}"`
            })
          }
        }

        // 比对商品数据 (使用原始容器内的itemData进行比对)
        container.itemData.forEach((item, itemIndex) => {
          this.compareFCLItemData(differences, item, itemIndex, containerIndex, orderGroups)
        })
      })
    },

    // FCL类型专用商品明细比对方法 (适配groupedOrders数据结构)
    compareFCLItemData(differences, item, itemIndex, containerIndex, orderGroups = []) {
      // 从订单组中查找对应商品
      const originalItem = orderGroups.flatMap(group => group.items).find(oriItem => oriItem.orderNumber == item.orderNumber && oriItem.itemNumber == item.itemNumber && oriItem.tcId == item.tcId)

      if (!originalItem) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `No item data found for ${item.orderNumber} - ${item.itemNumber} - ${item.tcId}`
        })
        return
      }

      const prefix = `(${item.orderNumber} - ${item.itemNumber} - ${item.tcId})`

      // 外箱数量比对 (groupedOrders中字段为bookedOuter)
      if (Number(item.qty) !== Number(originalItem.bookedOuter)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Outer carton quantity changed from "${originalItem.bookedOuter}" to "${item.qty}"`
        })
      }

      // 内箱数量比对 (groupedOrders中字段为bookedInner)
      if (Number(item.innerQty) !== Number(originalItem.bookedInner)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Inner carton quantity changed from "${originalItem.bookedInner}" to "${item.innerQty}"`
        })
      }

      // 件数比对 (groupedOrders中字段为bookedPieces)
      if (Number(item.pieces) !== Number(originalItem.bookedPieces)) {
        differences.push({
          type: 'item',
          level: 'warning',
          message: `${prefix}: Pieces changed from "${originalItem.bookedPieces}" to "${item.pieces}"`
        })
      }

      // 重量比对 (groupedOrders中字段为grossWeight)
      const originalWeight = Number(originalItem.grossWeight || 0).toFixed(3)
      const currentWeight = Number(item.weight || 0).toFixed(3)
      if (currentWeight !== originalWeight) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Weight difference - Original: ${originalWeight}kg, Current: ${currentWeight}kg`
        })
      }

      // 体积比对 (groupedOrders中字段为volume)
      const originalVolume = Number(originalItem.volume || 0).toFixed(3)
      const currentVolume = Number(item.cbm || 0).toFixed(3)
      if (currentVolume !== originalVolume) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Volume difference - Original: ${originalVolume}cbm, Current: ${currentVolume}cbm`
        })
      }
    },

    // 比对 LCL 类型数据
    compareLCLData(differences) {
      this.form.poList.forEach((item, itemIndex) => {
        this.compareItemData(differences, item, itemIndex)
      })
    },

    // 比对商品明细数据
    compareItemData(differences, item, itemIndex, containerIndex = null) {
      // 查找原始商品数据
      const originalItem = this.findOriginalItem(item.orderNumber, item.itemNumber, item.tcId)
      if (!originalItem) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `No item data found for ${item.orderNumber} - ${item.itemNumber} - ${item.tcId}`
        })
        return
      }

      const prefix = `${item.orderNumber} - ${item.itemNumber} - ${item.tcId}`

      // 外箱数量比对
      if (Number(item.qty) !== Number(originalItem.booked)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Outer carton quantity changed from "${originalItem.booked}" to "${item.qty}"`
        })
      }

      // 内箱数量比对
      if (Number(item.innerQty) !== Number(originalItem.bookedInner)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Inner carton quantity changed from "${originalItem.bookedInner}" to "${item.innerQty}"`
        })
      }

      // 件数比对
      if (Number(item.pieces) !== Number(originalItem.bookedPieces)) {
        differences.push({
          type: 'item',
          level: 'warning',
          message: `${prefix}: Pieces changed from "${originalItem.bookedPieces}" to "${item.pieces}"`
        })
      }

      // 计算原始重量和体积
      const originalWeight = Number(originalItem.booked) * Number(originalItem.outerWeight || 0)
      const originalVolume = (Number(originalItem.booked) * Number(originalItem.length || 0) * Number(originalItem.width || 0) * Number(originalItem.height || 0)) / 1000000

      // 当前输入的重量和体积
      const currentWeight = Number(item.weight)?.toFixed(3) || 0
      const currentVolume = Number(item.cbm)?.toFixed(3) || 0

      // 重量差异比对
      if (currentWeight !== originalWeight?.toFixed(3)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Weight difference - Original: ${originalWeight?.toFixed(3)}kg, Current: ${currentWeight}kg`
        })
      }

      // 体积差异比对
      if (currentVolume !== originalVolume?.toFixed(3)) {
        differences.push({
          type: 'item',
          level: 'error',
          message: `${prefix}: Volume difference - Original: ${originalVolume?.toFixed(3)}cbm, Current: ${currentVolume}cbm`
        })
      }
    },

    // 查找原始商品数据
    findOriginalItem(orderNumber, itemNumber, itemTcId) {
      for (const header of this.originalBookingData) {
        if (header.orderNumber == orderNumber) {
          return header.items.find(item => item.productCode == itemNumber && item.tcId == itemTcId)
        }
      }
      return null
    },

    // 显示差异确认对话框
    showDifferenceDialog() {
      this.differenceDialogVisible = true // 通过变量控制显示
    },

    // 处理对话框关闭
    handleDialogClose() {
      this.isLoading = false
    },
    // 确认提交
    confirmSubmit() {
      this.isLoading = true
      this.differenceDialogVisible = false // 提交时关闭对话框

      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].orderItemId = this.tableData[i].itemId
      }
      var itemList = []
      for (var i = 0; i < this.form.containerList.length; i++) {
        var container = this.form.containerList[i]
        for (var item of container.itemData) {
          item.containerType = container.containerType
          item.containerNo = container.containerNo
          item.containerId = container.id
          item.shipmentId = this.form.shipmentId
          itemList.push(item)
        }
      }
      var data = {}
      if (this.soType == 'FCL') {
        data = {
          shipmentId: this.form.shipmentId,
          details: JSON.stringify(itemList),
          id: this.clp ? this.clp.id : null,
          soType: this.soType
        }
      } else {
        // LCL
        data = {
          shipmentId: this.form.shipmentId,
          details: JSON.stringify(this.form.poList),
          id: this.clp ? this.clp.id : null,
          soType: this.soType,
          soRef: this.soRef
        }
      }
      if (this.clp.id) {
        pepcoUpdateClp(data)
          .then(response => {
            this.$notify({
              title: 'Success',
              message: 'Success',
              type: 'success'
            })
            this.$router.push('/shipment/clp')
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
        pepcoCreateClp(data)
          .then(response => {
            this.$notify({
              title: 'Success',
              message: 'Success',
              type: 'success'
            })
            this.$router.push('/shipment/clp')
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style>
.el-select-dropdown.el-popper.t-select-table {
  min-width: 680px !important;
}

.t-table-select__table {
  width: 100% !important;
}

.clp-container .container-card {
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 10px;
}

.clp-container .card-header-clp {
  margin-top: 20px;
  color: #004f7c;
  font-size: 14px;
}

.clp-container .clp-summary {
  color: #004f7c;
  padding-left: 20px;
}
.inline-item {
  display: inline-block;
  width: 30%; /* 设置宽度 */
  vertical-align: top; /* 顶部对齐 */
  box-sizing: border-box; /* 包含padding和border */
  padding: 10px;
}

/* 优化弹框样式 */
::v-deep .custom-confirm-dialog {
  width: 65% !important;
  max-width: 1200px; /* 增加最大宽度限制 */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* 对话框头部样式 */
::v-deep .custom-confirm-dialog .el-dialog__header {
  background: linear-gradient(135deg, #ff7d00 0%, #ff9a3c 100%);
  color: white;
  padding: 18px 25px;
  border-bottom: none;
}

::v-deep .custom-confirm-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
}

/* 对话框内容区域 */
::v-deep .custom-confirm-dialog .el-dialog__body {
  padding: 25px;
  background-color: #f9f9f9;
}

.dialog-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px 20px 5px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dialog-description {
  color: #4e5969;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 14px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

/* 差异列表样式优化 */
.difference-list {
  background-color: #fffbf5;
  border: 1px solid #ffe8cc;
  border-radius: 8px;
  padding: 20px;
  max-height: 300px; /* 增加最大高度 */
  overflow-y: auto;
  margin-bottom: 15px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.difference-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 15px;
  margin-bottom: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: white;
  border-left: 4px solid transparent;
}

.difference-item:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.difference-error {
  border-left-color: #f5222d;
  background-color: #fff1f0;
}

.difference-warning {
  border-left-color: #faad14;
  background-color: #fffbe6;
}

.difference-icon {
  margin-right: 12px;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 3px;
}

.difference-error .difference-icon {
  color: #f5222d;
}

.difference-warning .difference-icon {
  color: #faad14;
}

.difference-content {
  flex: 1;
}

.difference-message {
  color: #333;
  line-height: 1.6;
  font-size: 14px;
}

/* 底部按钮区域 */
::v-deep .custom-confirm-dialog .el-dialog__footer {
  padding: 15px 25px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

::v-deep .custom-confirm-dialog .el-button {
  padding: 10px 30px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

::v-deep .custom-confirm-dialog .el-button--primary {
  background-color: #ff7d00;
  border-color: #ff7d00;
  box-shadow: 0 2px 5px rgba(255, 125, 0, 0.3);
}

::v-deep .custom-confirm-dialog .el-button--primary:hover {
  background-color: #ff9a3c;
  border-color: #ff9a3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 125, 0, 0.4);
}

::v-deep .custom-confirm-dialog .el-button--default {
  background-color: #f5f5f5;
  border-color: #e9e9e9;
}

::v-deep .custom-confirm-dialog .el-button--default:hover {
  background-color: #e9e9e9;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 滚动条样式优化 */
.difference-list::-webkit-scrollbar {
  width: 8px;
}

.difference-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.difference-list::-webkit-scrollbar-thumb {
  background: #ffd080;
  border-radius: 4px;
}

  .difference-list::-webkit-scrollbar-thumb:hover {
    background: #ffb44f;
  }
</style>

<style lang="scss" scoped>
  // 覆盖element-ui样式
  ::v-deep(.el-input__inner){
    padding: 0 10px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
