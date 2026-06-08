<template>
  <el-dialog title="Qty Amend Request" :visible.sync="dialogVisible" width="100%" @close="handleClose">
    <div class="app-container shipping-create" style="width:100%; margin: 0 auto">
      <el-row>
        <el-col>
          <el-card class="pd-20">
            <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="0px">
              <el-card class="card-css">
                <div class="el-descriptions__title_css">Original Data</div>
              </el-card>
              <el-card class="card-css">
                <div class="el-descriptions__title_css">Order Details</div>
                <order-detail ref="orderDetail" @render="handleOrderRender" @sum="handleOrderSum"></order-detail>
              </el-card>
              <el-card class="card-css">
                <div class="el-descriptions__title_css">Products</div>
                <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title
                  :column="3">
                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font> Mark&Numbers
                    </template>
                    <el-form-item required label>
                      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="form.product.markNumbers" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('booking.productEnglishName')">
                    <template slot="label">
                      <font color="#FF0000">*</font>
                      {{ $t('booking.productEnglishName') }}
                    </template>
                    <el-form-item required label>
                      <el-input type="textarea" aria-required :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="form.product.productEnglishName" placeholder="Must Input English Product Name" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item label="Product Chinese Name">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                      v-model="form.product.productChineseName" />
                  </el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font>
                      {{ $t('booking.hsCode') }}
                    </template>
                    <el-form-item required label>
                      <el-input v-model="form.product.hscode" minlength="10" maxlength="10" clearable
                        @blur="validateHsCode($event)" />
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
                        <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                          :label="dict.label" :value="dict.value" />
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
                    <el-switch @change="changeDG(form.product)" :active-value="1" :inactive-value="0"
                      v-model="form.product.dg" active-text="Yes" inactive-text="No"></el-switch>
                  </el-descriptions-item>

                  <el-descriptions-item :label="dict.label"
                    v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value"
                    v-if="form.product.dg == 1">
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
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-input type="textarea" v-model="form.product.remark" />
                      </el-col>
                    </el-row>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>

              <!-- <el-card class="card-css" v-if="form.shipmentType == 'FCL'">
                <div class="el-descriptions__title_css">Containers</div>
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

                <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i"
                  class="shipmentRouters-css">
                  <el-row :gutter="20">
                    <el-col :span="2">
                      <el-form-item required label-width="0px" :prop="'containers.' + i + '.type'">
                        <el-select filterable placeholder v-model="item.type" @change="handleOptionChange(item.type)">
                          <el-option v-for="item in containerOptions" :label="item.type" :value="item.type"
                            :key="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item required label-width="0px" :prop="'containers.' + i + '.qty'">
                        <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'">
                        <el-input v-model="item.ventClosedOrNot" />
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'"
                        :required="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'"
                        :prop="'containers.' + i + '.requireTemperature'">
                        <el-input v-model="item.requireTemperature" />
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'">
                        <el-input v-model="item.humidity" />
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>

                    <el-col :span="2">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'">
                        <el-input v-model="item.o2" />
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>

                    <el-col :span="2">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'">
                        <el-input v-model="item.co2" />
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>

                    <el-col :span="2">
                      <el-form-item label-width="0px"
                        v-show="item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer == 'Yes'">
                        <el-select v-model="item.drains">
                          <el-option label="Open" value="Open"></el-option>
                          <el-option label="Close" value="Close"></el-option>
                        </el-select>
                      </el-form-item>
                      <span
                        v-show="(item.type && containerOptions.find((obj) => obj.type == item.type).isReeferContainer != 'Yes' && flag) || (!item.type && flag)">&nbsp;</span>
                    </el-col>

                    <el-col :span="2">
                      <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
                    </el-col>
                    <el-col :span="2">
                      <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete"
                        @click="handleDeleteContainer(i)">{{
                          $t("search.delete") }}</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card> -->
              <!-- <el-card class="card-css">
                <div class="el-descriptions__title_css">Remark</div>
                <el-row>
                  <el-col :span="24">
                    <el-input type="textarea" :rows="4" v-model="form.remark" />
                  </el-col>
                </el-row>
              </el-card> -->
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col>
          <el-card class="pd-20">
            <el-form v-loading="submitLoading" :model="form2" ref="form2" :rules="dynamicFormRules()" :show-message="false"
              label-width="0px">
              <el-card class="card-css">
                <div class="el-descriptions__title_css">New Data</div>
              </el-card>
              <el-card class="card-css">
                <div class="el-descriptions__title_css">Order Details</div>
                <order-detail ref="orderDetail2" @render="handleOrderRender2" @sum="handleOrderSum2"></order-detail>
              </el-card>
              <el-card class="card-css">
                <div class="el-descriptions__title_css">Products</div>
                <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title
                  :column="3">
                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font> Mark&Numbers
                    </template>
                    <el-form-item required label>
                      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="form2.product.markNumbers" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('booking.productEnglishName')">
                    <template slot="label">
                      <font color="#FF0000">*</font>
                      {{ $t('booking.productEnglishName') }}
                    </template>
                    <el-form-item required label>
                      <el-input type="textarea" aria-required :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="form2.product.productEnglishName" placeholder="Must Input English Product Name" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item label="Product Chinese Name">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                      v-model="form2.product.productChineseName" />
                  </el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item></el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font>
                      {{ $t('booking.hsCode') }}
                    </template>
                    <el-form-item required label>
                      <el-input v-model="form2.product.hscode" minlength="10" maxlength="10" clearable
                        @blur="validateHsCode2($event)" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item label="Number Of Packages">
                    <template slot="label">
                      <font color="#FF0000">*</font> Number Of Packages
                    </template>
                    <el-form-item required label>
                      <el-input-number v-model="form2.product.numberOfPackages" :controls="false" :precision="0" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font> Packages
                    </template>
                    <el-form-item required label>
                      <el-select filterable v-model="form2.product.packages" placeholder>
                        <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                          :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font> Gross Weight(KG)
                    </template>
                    <el-form-item required label>
                      <el-input-number v-model="form2.product.grossWeight" :controls="false" :precision="3" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font color="#FF0000">*</font> Volume(CBM)
                    </template>
                    <el-form-item required label>
                      <el-input-number v-model="form2.product.volume" :controls="false" :precision="3" />
                    </el-form-item>
                  </el-descriptions-item>
                  <el-descriptions-item label="Batteries">
                    <el-radio-group @input="changeBatteries(form2.product)" v-model="form2.product.batteries">
                      <el-radio :label="2" border>Has batteries</el-radio>
                      <el-radio :label="3" border>No batteries</el-radio>
                    </el-radio-group>
                  </el-descriptions-item>

                  <el-descriptions-item label="DG">
                    <el-switch @change="changeDG(form2.product)" :active-value="1" :inactive-value="0"
                      v-model="form2.product.dg" active-text="Yes" inactive-text="No"></el-switch>
                  </el-descriptions-item>

                  <el-descriptions-item :label="dict.label"
                    v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value"
                    v-if="form2.product.dg == 1">
                    <el-input v-model="form2.product.hazardousMaterials[dict.value]" />
                  </el-descriptions-item>

                  <el-descriptions-item v-if="form2.product.dg == 0" label></el-descriptions-item>
                  <el-descriptions-item v-if="form2.product.dg == 0" label></el-descriptions-item>
                  <el-descriptions-item v-if="form2.product.dg == 0" label></el-descriptions-item>
                  <el-descriptions-item v-if="form2.product.dg == 0" label></el-descriptions-item>
                  <el-descriptions-item v-if="form2.product.dg == 0" label></el-descriptions-item>

                  <el-descriptions-item label>
                    <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
                      <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
                      <el-col :span="8">Remark</el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-input type="textarea" v-model="form2.product.remark" />
                      </el-col>
                    </el-row>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col>
          <el-card class="pd-20" v-if="customerAdminReqFlag && approvalInfo?.status < 2">
            <div class="el-descriptions__title_css">Amend Remark</div>
            <el-row>
              <el-col>
                <Editor style="height: 200px; overflow-y: hidden;border: 1px solid #ccc; " v-model="amendRemark"
                  :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
              </el-col>
            </el-row>
            <div style="text-align: center;padding-top: 15px; padding-bottom: 10px;">
              <el-button size="mini" type="success" round :loading="loadingSaveBut"
                @click="handleSubmitAmendPOQtyRequest(2)">Approve</el-button>
              <el-button size="mini" type="warning" round :loading="loadingSaveBut"
                @click="handleSubmitAmendPOQtyRequest(3)">Reject</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
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
import OrderDetail from '@/views/pepcoShipping/create/components/order-detail.vue'
import { getPepcoOrderFileByOrder, updatePepcoFileShippingId } from '@/api/order/task'
import { deleteFile } from '@/api/infra/file'
import { deleteOrderFile } from '@/api/pepco/order-file'
import uploadOrderFile from '../create/components/upload-order-file'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { resolveFormContainers, validateContainersGrossWeight } from '@/utils/formContainersUtil'
import { createShippingApproval,createShippingQtyApproval,shippingApprovalDetail,processPoQtyApproval } from '@/api/pepco/shipping-approval'
import { validateSupplierBookingDcOnSubmit } from '@/utils/shippingOrderConfig'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
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
  components: { IconPark, OrderDetail, uploadOrderFile,Editor, Toolbar},
  data() {
    return {
      editor: null,
      editorConfig: {
        placeholder: 'Remark...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
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
        containers: [{ containers: '' }],
        productData: [],
        phone: '',
        email: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: '',
        // 增加货运模式 edwin
        freightMethod: 'sea',
        product: {
          numberOfPackages: 0,
          grossWeight: 0,
          volume: 0,
          fileList: [],
          hazardousMaterials:{}
        }
      },
      form2: {
        containers: [{ containers: '' }],
        productData: [],
        phone: '',
        email: '',
        shipmentType: 'FCL',
        truckServices: 'No',
        needExportCustomerService: 'No',
        deliverServiceToFnd: 'No',
        remark: '',
        // 增加货运模式 edwin
        freightMethod: 'sea',
        product: {
          numberOfPackages: 0,
          grossWeight: 0,
          volume: 0,
          fileList: [],
          hazardousMaterials:{}
        }
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
      flag2: false,
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
      amendPOQtyForm: {
        approvalId: undefined,
        remark: '',
        status: undefined,
        shippingOrder: undefined
      },
      submitLoading: false,
      mvLoading: false,
      dialogVisible: false,
      customerAdminReqFlag: false,
      amendRemark: '',
      butLoading: false,
      approvalInfo: null,
    }
  },
  created() {
    console.log('进入更新shipping order')
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API

    this.getPortList()
    this.getContainerList()
    if (this.$route.query.id) {
    } else {
      this.getUserInfo()
    }
    getPartiesList().then(res => {
      this.shipperList = res.data.shipper
      this.consigneeList = res.data.consignee
      this.notifyPartyList = res.data.notifyParty
    })
    localStorage.removeItem('refreshPoPage')
    if (this.$route.query.source && this.$route.query.source == 'addPO') {
      this.addPoRequest = true
    }else if (this.$route.query.source && this.$route.query.source == 'amendPOQty') {
      this.amendPOQtyRequest = true
    }
  },
  mounted() {
    if (this.$auth.hasPermi('shipment:customerRequest')) {
      this.customerAdminReqFlag = true
    }
  },
  beforeDestroy() {
    localStorage.removeItem('shipping-selectedPoList')
  },
  methods: {
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    resetInfo() {
      this.amendRemark = ''
      this.approvalInfo = null
    },
    openDialog(approvalInfoId) {
      this.resetInfo();
      this.dialogVisible = true
      this.amendPOQtyForm.approvalId = approvalInfoId

      shippingApprovalDetail(approvalInfoId).then(res => {
        this.approvalInfo = res.data

        const originalData = JSON.parse(this.approvalInfo.originalData)
        this.form = originalData
        this.form.containers = originalData.containers
        var product = originalData.products[0]
        product.batteries = Number(product.batteries) || 3
        product.volume = Number(product.volume) || 0
        this.form.product = product
        originalData.orders.forEach(v => {
          v.items.forEach(item => {
            item.productCode = item.itemNumber
            item.booked = item.bookedOuter
            item.requested = item.orderedPieces
          })
        })
        this.$refs.orderDetail.refresh(originalData.orders, true, false, originalData.orders, true)

        const newData = JSON.parse(this.approvalInfo.newData)
        this.form2 = newData
        this.form2.containers = newData.containers
        var product2 = newData.products[0]
        product2.batteries = Number(product2.batteries) || 3
        product2.volume = Number(product2.volume) || 0
        this.form2.product = product2
        newData.orders.forEach(v => {
          v.items.forEach(item => {
            item.productCode = item.itemNumber
            item.booked = item.bookedOuter
            item.requested = item.orderedPieces
          })
        })
        this.$refs.orderDetail2.refresh(newData.orders, true, false, newData.orders, true)
      })
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
    handleOrderRender2(result) {
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
    handleOrderSum2(result, changePo) {
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
    handleClose(){
      this.dialogVisible = false
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
    handleOptionChange2(value) {
      var arr = []
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == 'Yes') {
          arr.push(this.containerOptions[i].type)
        }
      }
      var flag = false
      for (var i = 0; i < this.form2.containers.length; i++) {
        if (arr.indexOf(this.form2.containers[i].type) > -1) {
          flag = true
          break
        }
      }
      this.flag2 = flag
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

    },
    // 根据form生成form2的动态验证规则
    dynamicFormRules() {
      const rules = {}
      // 遍历form的所有字段，并生成相应的验证规则
      for (let key in this.form) {
        if (this.form.hasOwnProperty(key)) {
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
    handleSubmitAmendPOQtyRequest(status) {
      this.submitLoading = true
      this.loadingSaveBut = true
      var newData = JSON.parse(this.approvalInfo.newData)
      if (newData && newData.products && newData.products.length > 0 && newData.products[0].hazardousMaterials) {
        newData.products[0].hazardousMaterials = JSON.stringify(newData.products[0].hazardousMaterials)
      }
      newData.containers = newData.shipmentType == 'FCL' ? newData.containers : []
      this.amendPOQtyForm.shippingOrder = newData
      this.amendPOQtyForm.status = status
      this.amendPOQtyForm.remark = this.amendRemark
      processPoQtyApproval(this.amendPOQtyForm).then(res => {
        var vm = this
        vm.loadingSaveBut = false
        vm.submitLoading = false
        this.dialogVisible = false
        setTimeout(function () {
          vm.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          })
          localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
        }, 2000)
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
      if (this.form2.product.productEnglishName == null || this.form2.product.productEnglishName.trim() == '') {
        this.$message({
          message: 'Product Name is required',
          type: 'error'
        })
        return false
      }
      if (this.form2.product.hscode && this.form2.product.hscode.length < 10) {
        this.$message({
          message: 'HS Code must be exactly 10 digits',
          type: 'error'
        })
        return false
      }
      // 检查Containers
      if (this.form2.shipmentType === 'FCL') {
        const containersCheck = this.containersCheck()
        if (!containersCheck) {
          return false
        }
      }
      return true
    },
    validateForm() {
      const orderList = this.$refs.orderDetail ? this.$refs.orderDetail.getDataList() : []
      const dcCheck = validateSupplierBookingDcOnSubmit(
        this.form.dc,
        (orderList || []).map(item => item.dc),
        this.getDictDatas
      )
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
      this.form = JSON.parse(JSON.stringify(this.form))
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
      const { containersCount, maxGrossWeight } = resolveFormContainers(this.form2.containers)
      if (containersCount >= 10) {
        this.$message({
          message: 'The number of containers equipment quantity cannot be greater than or equal to 10',
          type: 'warning'
        })
        return false
      }
      console.log('Max Gross Weight(kg) ', maxGrossWeight)
      const grossWeightError = validateContainersGrossWeight(maxGrossWeight, this.form2.product.grossWeight)
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
    validateHsCode2(event) {
      console.log('validateHsCode called with event:', this.form2.product.hscode)
      const value = event.target.value.trim()
      console.log('value', value)
      this.form2.product.hscode = value

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
