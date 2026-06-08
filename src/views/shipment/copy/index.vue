<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <h3 style="text-align: right" v-show="showTips">
      <p>
        {{ $t("booking.pleaseContact") }}
        <a
          style="border-bottom: 1px solid #00f; color: #090"
          v-bind:href="'mailto:' + 'tipsMail'"
        >
          {{ tipsMail }}</a
        >
      </p>
    </h3>
    <el-dialog title="Request new HS code" width="500px" :visible.sync="applyHsCodeVisable">
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

    <el-form :model="form" ref="form" :show-message="false" label-width="150px">

      <el-card style="padding: 15px;margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item required :label="$t('booking.carrier')">
            <el-select @change="changeCarrier" filterable v-model="form.carrier">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
                :key="dict.value"
                :label="dict.label+' ('+dict.value+')'"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item required :label="$t('booking.contractType')" prop="contractType">
            <el-select filterable v-model="form.contractType">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.CARRIAGE_CONTRACT)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3" v-if="form.carrier=='MAEU'">
            <el-form-item label-width="120px"
              required
              :label="$t('booking.contractNumber')"
              prop="contractNumber"
            >
            <el-select filterable allow-create v-model="form.contractNumber"  @change="remoteGetCraNum" placeholder="Input to select or Select">
                <el-option
                v-for="dict in craList"
                  :key="dict.contractNo"
                  :label="dict.contractNo"
                  :value="dict.contractNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="form.carrier=='MAEU'">
            <el-form-item label-width="100px"
              label="Type"
              :required="form.carrier=='MAEU'"
              prop="specialAllocation"
            >
              <el-select v-model="form.specialAllocation">
                <el-option label="Standard" value="Standard"></el-option>
                <el-option label="Floating" value="Floating"></el-option>
                <el-option label="Alwaysspace" value="Alwaysspace"></el-option>
                <el-option label="Addtional" value="Addtional"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-if="form.carrier!='MAEU'">
            <el-form-item
              required
              :label="$t('booking.contractNumber')"
              prop="contractNumber"
            >
            <el-select filterable allow-create v-model="form.contractNumber"  @change="remoteGetCraNum" placeholder="Input to select or Select">
                <el-option
                  v-for="dict in craList.filter((item) => {
                            return item.carrier!=null&&item.carrier.indexOf(form.carrier) > -1;
                        })"
                  :key="dict.contractNo"
                  :label="dict.contractNo"
                  :value="dict.contractNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="6">
          <el-form-item required :label="$t('booking.payment_term')" prop="paymentTerm">
            <el-select filterable v-model="form.paymentTerm">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)"
                :key="dict.value"
                :label="dict.value"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item required :label="$t('booking.placeOfReceipt')" prop="pol">
            <el-select @change="changePol" filterable v-model="form.pol">
              <el-option
                v-for="(item, index) in craFlag
                  ? portOptions.filter((item) => {
                      return cra_pol.indexOf(item.code) > -1;
                    })
                  : portOptions"
                :key="index + 'pol1'"
                :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item required :label="$t('booking.portOfLoading')" prop="originPort">
            <el-select v-model="form.originPort" filterable>
              <el-option v-for="(item, index) in craFlag
                          ? portOptions.filter((item) => {
                              return cra_origin.indexOf(item.code) > -1;
                            })
                          : portOptions" :key="index + 'pol3'" :label="item.name+' ('+item.code+')'"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item required :label="$t('booking.portOfDischarge')" prop="destinationPort">
            <el-select v-model="form.destinationPort" filterable>
              <el-option v-for="(item, index) in craFlag
                          ? portOptions.filter((item) => {
                              return cra_disch.indexOf(item.code) > -1;
                            })
                          : portOptions" :key="index + 'pol4'" :label="item.name+' ('+item.code+')'"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item required :label="$t('booking.finalDestination')" prop="pod">
            <el-select @change="changePod" filterable v-model="form.pod">
              <el-option
                v-for="(item, index) in craFlag
                  ? portOptions.filter((item) => {
                      return cra_pod.indexOf(item.code) > -1;
                    })
                  : portOptions"
                :key="index + 'pol2'"
                :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item required :label="$t('booking.shipper')" prop="shipper">
            <el-select
              filterable
              clearable
              v-model="form.shipper"
            >
              <el-option
                v-for="item in parties['Shipper']"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item required :label="$t('booking.consignee')" prop="consignee">
            <el-select
              clearable
              v-model="form.consignee"
              filterable
            >
              <el-option
                v-for="item in parties['Consignee']"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item required :label="$t('booking.notifyParty')" prop="notifyParty">
            <el-select
              clearable
              v-model="form.notifyParty"
              filterable
            >
              <el-option
                v-for="item in parties['Notify Party']"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item required label="Agreement Party" prop="agreementParty">
            <el-select
              clearable
              v-model="form.agreementParty"
              filterable
            >
              <el-option
                v-for="item in parties['Agreement Party']"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="6" v-if="$auth.hasPermi('shipment:create-notpb')&&showCustomer">

          <el-form-item :required="$auth.hasPermi('shipment:create-notpb')" label="Customer" prop="customer">
            <el-select
              clearable
              v-model="form.customer"
              filterable
            >
              <el-option
                v-for="item in parties['Customer']"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!this.$auth.hasPermi('system:allocation:year-week:show')">
          <el-form-item :label="$t('booking.allocationWeek')" prop="allocationWeek">
            <el-select
              clearable
              v-model="form.allocationWeek"
              filterable
            >
              <el-option
                v-for="(item,index_a) in allocationWeekList"
                :key="index_a"
                :value="item"
                :label="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
                      <el-form-item label="Allocation Year" required prop="allocationYear" :rules="[
                      { required: $auth.hasPermi('system:allocation:year-week:show'), message: 'Please select allocation year', trigger: 'change' }
                    ]">
              <el-select v-model="form.allocationYear" placeholder="Select Year" @change="onYearChange" clearable>
                <el-option v-for="year in availableYears" :key="year" :label="year" :value="year" />
              </el-select>
            </el-form-item>
        </el-col>

        <el-col :span="6" v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
          <el-form-item required label="Allocation Week" prop="allocationWeek" :rules="[
            { required: this.$auth.hasPermi('system:allocation:year-week:show'), message: 'Please select allocation week', trigger: 'change' }
            ]">
              <el-select v-model="form.allocationWeek" placeholder="Select Week" clearable>
                <el-option v-for="week in availableWeeks" :key="week" :label="week" :value="week" />
              </el-select>
          </el-form-item>
          </el-col>
        <el-col :span="6">
          <el-form-item label="PO Numbers" prop="poNumbers">
            <el-input v-model="form.poNumbers" type="textarea" rows="3" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('booking.remark')" prop="remark">
            <el-input v-model="form.remark" type="textarea" rows="3" />
          </el-form-item>
        </el-col>


      </el-row>
      </el-card>

      <el-card style="padding: 15px;margin-top: 15px;">
      <el-divider content-position="left">{{ $t("booking.booking_contact") }}</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item required :label="$t('booking.name')" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required :label="$t('booking.phone')" prop="phone">
            <el-input v-model="form.phone" @blur="validatePhoneNumber" />
            <div v-if="phoneError" class="error-message">
              {{ phoneError }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required :label="$t('booking.email')" prop="email" type="email">
            <el-input v-model="form.email" @blur="validateEmailAddress" />
            <div v-if="emailError" class="error-message">
              {{ emailError }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      </el-card>

      <el-dialog width="80%" title="Add/Remove SO" :visible.sync="addRemoveSOVisible">
      <div style="margin-bottom:10px">
        <el-input style="width:200px;margin-right:20px" v-model="soQueryParams.salesOrderNumber" />
        <el-button @click="soQueryParams.pageNo=1;getSO()" type="primary">Search<i
            class="el-icon-search el-icon--right"></i></el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="24">
          <!-- soQueryParams:{
        pageNo: 1,
        pageSize: 10,
      }, -->
      <MainTable @addSO="addSO" :showPlusIcon="true"  :tableData="soTableData" ref="table" :tableHeight="600"></MainTable>
          <pagination :total="soQueryParams.total" :page.sync="soQueryParams.pageNo"
            :limit.sync="soQueryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getSO" />
        </el-col>

      </el-row>
    </el-dialog>

      <el-card style="padding: 15px;margin-top: 15px;">
      <div>

        <div style="margin-bottom: 10px">
          <el-button v-if="form.fromSalesOrder" @click="addRemoveSOVisible=true;getSO()">Add SO</el-button>
        </div>
        <el-table
        border
        v-if="form.fromSalesOrder"
        :data="soDatas"
        style="width: 100%">
            <el-table-column
            prop="id" label="" width="60">
                <template v-slot="scope">
                  <span style="color:red"><i class="el-icon-delete" style="cursor: pointer;" @click="soDatas.splice(scope.$index, 1);">&nbsp;Delete</i></span>
                </template>
            </el-table-column>

            <el-table-column
                prop="salesOrderNumber"
                label="Sales order number"
                >
            </el-table-column>
            <el-table-column
                prop="soldToName"
                label="Sold to Name"
                >
            </el-table-column>
            <el-table-column
                prop="soldToNumber"
                label="Sold to Number">
            </el-table-column>
            <el-table-column
                prop="destinationDeliveryDate"
                label="Destination Delivery Date"
                width="180">
                <template v-slot="scope">
                    {{ scope.row.destinationDeliveryDate==null?'':scope.row.destinationDeliveryDate[0]+'-'+scope.row.destinationDeliveryDate[1]+'-'+scope.row.destinationDeliveryDate[2] }}
                </template>
            </el-table-column>
            <el-table-column
                prop="shipToNumber"
                label="Ship to Number">
            </el-table-column>
            <el-table-column
                prop="shipToName"
                label="Ship to Name">
            </el-table-column>
            <el-table-column
                prop="customerPoNumber"
                label="Customer PO Number">
            </el-table-column>
        </el-table>

        <el-divider v-if="itemTableData.length > 0" content-position="left">Purchase Orders</el-divider>
        <el-table v-if="itemTableData.length > 0" :data="itemTableData">
          <el-table-column prop="orderId" label="Order Number">
            <template v-slot="scope">
              <span>{{ orderMap[scope.row.orderId] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" :label="$t('booking.product')">
            <template v-slot="scope">
                <span>{{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].code
                  : ""
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" :label="$t('booking.product')">
            <template v-slot="scope">
                <span>{{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].name
                  : ""
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cargoReadyBy" :label="$t('booking.cargoReadyBy')" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.cargoReadyBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" :label="$t('booking.mustArriveBy')">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.mustArriveBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requested" :label="$t('booking.requested')">
            <template v-slot="scope">
              {{ scope.row.requested }}{{ scope.row.requestUnit }}
            </template>
          </el-table-column>
          <el-table-column prop="bookedQty" :label="$t('booking.booked')">
            <template v-slot="scope">
              {{ scope.row.bookedQty }}{{ scope.row.bookedUnit }}
            </template>
          </el-table-column>
        </el-table>

        <el-divider></el-divider>
        <el-row>
          <el-button @click="addProduct" size="mini" type="primary">{{
            $t("booking.addProduct")
          }}</el-button>
          <el-button @click="applyNewHsCode" size="mini" type="primary">Request new HS code</el-button>
        </el-row>
        <br />

        <el-descriptions
          :colon="false"
          style="margin-bottom: 10px;padding: 15px!important;"
          direction="vertical"
          v-for="(item, i) in form.productData"
          :key="'product' + i"
          class="margin-top"
          title=""
          :column="6"
        >
          <template slot="extra">
            <el-button
              v-if="i != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(i)"
              >{{ $t("search.delete") }}</el-button
            >
          </template>
          <el-descriptions-item :label="$t('booking.productEnglishName')"
            ><el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2 }"
              v-model="item.productEnglishName"
            />
          </el-descriptions-item>
          <el-descriptions-item :label="$t('booking.hsCode')">
            <!-- <el-input v-model="item.hscode" /> -->
            <el-select
              filterable
              clearable
              remote
              v-model="item.hscode"
              :remote-method="remoteGetHsCode"
              @clear="selectClear"
            >
              <el-option
                v-for="dict in hsCodeList"
                :key="dict.id"
                :label="dict.hsCode"
                :value="dict.hsCode"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Number Of Packages"
          ><el-input-number v-model="item.numberOfPackages"  :controls="false" :precision="0"
          /></el-descriptions-item>
          <el-descriptions-item label="Packages">
            <el-select filterable v-model="item.packages" placeholder="">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Gross Weight(KG)"
          ><el-input-number v-model="item.grossWeight"  :controls="false" :precision="3"
          /></el-descriptions-item>
          <el-descriptions-item label="Volume(CBM)"
          ><el-input-number v-model="item.volume"  :controls="false" :precision="3"
          /></el-descriptions-item>

          <el-descriptions-item label="">
            <el-row
              :gutter="20"
              style="
                margin-top: 5px;
                color: #004F7C;
                font-weight: 700 !important;
                margin-bottom: 5px;
              "
            >
              <el-col :span="4">DG</el-col>
              <el-col v-show="item.dg == 0" :span="3">Batteries</el-col>
              <el-col
                v-show="item.dg == 1"
                v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
                :key="dict.value"
                :span="4"
                >{{ dict.label }}</el-col
              >
            </el-row>
            <el-row style="margin-top: 10px" :gutter="20">
              <el-col :span="4"
                ><el-switch
                  @change="changeDG(item)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="item.dg"
                  active-text="Yes"
                  inactive-text="No"
                >
                </el-switch>
              </el-col>
              <el-col
                v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
                :key="'d' + dict.value"
                :span="4"
                v-show="item.dg == 1"
              >
                <el-input
                  v-model="item.hazardousMaterials[dict.value]"
                  style="margin-bottom: 15px; margin-top: -15px"
                />
              </el-col>
              <el-col :span="20" v-show="item.dg == 0">
                <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                  <el-radio :label="2" border>Has batteries</el-radio>
                  <el-radio :label="3" border>No batteries</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row
              :gutter="20"
              style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px"
            >
              <el-col :span="8">RefNo&Numbers</el-col>
              <el-col :span="6">Files</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input type="textarea" v-model="item.mark" />
              </el-col>
              <el-col :span="6">
                <el-upload
                  class="upload-demo"
                  :ref="'upload' + i"
                  multiple
                  :action="url + '/admin-api/shipment/product/upload'"
                  :data="item.uploadData"
                  :before-remove="handleRemove"
                  :headers="uploadHeaders"
                  :show-file-list="true"
                  :on-preview="handlePictureCardPreview"
                  v-bind:file-list="item.files"
                  :auto-upload="false"
                  :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.files = files}, () => {item.files = [];item.uploadData = {}})"
                >
                  <el-button slot="trigger" type="primary">{{
                    $t("booking.browse")
                  }}</el-button>
                  <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-card style="padding: 15px;margin-top: 15px;">
      <el-row
        ><el-button @click="addContainers" size="mini" type="primary"
          ><i class="el-icon-plus"></i>{{ $t("booking.addContainers") }}</el-button
        ></el-row
      >
      <br />
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="2">
          <font color="#FF0000">*</font>{{ $t("booking.containerType") }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000">*</font>{{ $t("booking.numberOfContainers") }}
        </el-col>
        <el-col :span="2">
          {{ flag ? "Ventilation(cbm/hour)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag">*</font
          >{{ flag ? "Temperature(°C)" : "" }}
        </el-col>
        <el-col :span="2">
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
        <el-col :span="2"> <font color="#FF0000">*</font>SOC </el-col>
      </el-row>


      <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i"
           class="shipmentRouters-css">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-form-item label-width="0px" required :prop="'containers.' + i + '.containerType'">
              <el-select
                filterable
                v-model="item.containerType"
                @change="handleOptionChange(item.containerType)"
              >
                <el-option
                  v-for="item in craFlag
                    ? containerOptions.filter((item) => {
                        return cra_contaier_type.indexOf(item.type) > -1;
                      })
                    : containerOptions"
                  :label="item.type"
                  :value="item.type"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0px" required :prop="'containers.' + i + '.numbers'">
              <el-input-number :controls="false" :precision="0" v-model="item.numbers" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              "
              >

            <el-input
              v-model="item.ventClosedOrNot"
            />
          </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>
          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              "
              :required="
              item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'" :prop="'containers.' + i + '.requireTemperature'">
            <el-input
              v-model="item.requireTemperature"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>
          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.humidity"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.o2"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.co2"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
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
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
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
              >{{ $t("search.delete") }}</el-button
            ></el-col
          >
        </el-row>
      </div>

    </el-card>

    <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%" >
<el-row :gutter="20">
  <el-col :span="6">
    <el-date-picker placeholder="ETD From" v-model="searchSchedule.from"/>
  </el-col>
  <el-col :span="6">
    <el-date-picker placeholder="ETD To" v-model="searchSchedule.to"/>
  </el-col>
          <el-col :span="6">
          <el-input placeholder="Service" v-model="searchSchedule.service"></el-input>
        </el-col>
  <el-col :span="4" >
    <el-button @click="queryShippingSchedule" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
  </el-col>
</el-row>
<el-table v-loading="shippingScheduleLoading" height="600px" :data="shippingScheduleData" >


  <el-table-column sortable="custom"  width="15px" type="expand" >
            <template slot-scope="scope">
              <!-- none tshg -->
              <div  v-if="scope.row.carrier != 'TSHG'" style="padding: 0px 40px;">
                <el-empty v-if="scope.row.tshgList.length==0">
                </el-empty>
                <div style="padding-top: 10px;">
                  <div style="" class="ptp-results__transport-plan--deadline mds-text--small-normal">
                            <div ><div class="vessel-title">Departure</div><div class="vessel-title">{{ scope.row.polTerminal }}</div></div>
                            <div ><div class="vessel-title">Arrival</div><div class="vessel-title">{{ scope.row.podTerminal }}</div></div>
                            <div ><div class="vessel-title">SI Document</div><div class="vessel-title">{{ scope.row.siCutoff==null?"-":parseTimeToZ1(scope.row.siCutoff) }}</div></div>
                            <div ><div class="vessel-title">VGM</div><div class="vessel-title">{{ scope.row.vgmCutoff==null?"-":parseTimeToZ1(scope.row.vgmCutoff) }}</div></div>
                            <div ><div class="vessel-title">Inland Cutoff</div><div class="vessel-title">{{ scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}</div></div>
                        </div>
                  <el-row v-for="(item,index) in scope.row.tshgList" >
                    <div>
                      <div style="float: left;">

                        <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ scope.row.pol }}</div>
                        <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ scope.row.polTerminal }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ scope.row.pod }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ scope.row.podTerminal }}</div>

                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ item.portCode }}</div>
                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ item.port }}</div>
                        <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;" > {{ item.barge }}</div>
                        <!-- Transport Mode: -->

                      </div>
                      <div style="float: left;">
                        <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                        <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                        <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                        <!-- <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div> -->
                        <div v-show="index!=scope.row.tshgList.length-1" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                      </div>
                      <div style="float: left;">
                        <div v-show="index==0" style="font-size: 14px;line-height: 20px;" >Departure</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >Arrival</div>
                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >{{ item.event }}</div>

                        <div v-show="index==0" style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(scope.row.departureDate) }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(scope.row.arrivalDate) }}</div>
                        <div v-show="item.barge=='Ocean'" style="" class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div ><div class="vessel-title">Vessel</div><div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div></div>
                            <div ><div class="vessel-title">Voyage/Bound</div><div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div></div>
                            <div ><div class="vessel-title">Service</div><div class="vessel-title">{{ item.routeCode==null?'-':item.routeCode }}</div></div>

                        </div>
                      </div>
                    </div>
                  </el-row>

                  <el-row>
                    <div>


                  </div>
                  </el-row>

                </div>

            </div>
            <!-- tshg -->
            <div  v-if="scope.row.carrier == 'TSHG'" style="padding: 0px 40px;">
                <el-empty v-if="scope.row.tshgList.length==0">
                </el-empty>
                <div style="padding-top: 10px;">
                  <div style="" class="ptp-results__transport-plan--deadline mds-text--small-normal">
                            <div ><div class="vessel-title">Departure</div><div class="vessel-title">{{ scope.row.polName }}</div></div>
                            <div ><div class="vessel-title">Arrival</div><div class="vessel-title">{{ scope.row.podName }}</div></div>
                            <div ><div class="vessel-title">Container Gate-In</div><div class="vessel-title">{{ scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}</div></div>
                            <div ><div class="vessel-title">SI Document</div><div class="vessel-title">{{ scope.row.siDoc==null?"-":parseTimeToZ1(scope.row.siDoc) }}</div></div>
                            <div ><div class="vessel-title">VGM</div><div class="vessel-title">{{ scope.row.vgm==null?"-":parseTimeToZ1(scope.row.vgm) }}</div></div>
                        </div>
                  <el-row v-for="(item,index) in scope.row.tshgList" >
                    <div>
                      <div style="float: left;">
                        <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ item.portCode }}</div>
                        <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ item.port }}</div>
                        <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;" > {{ item.barge }}</div>
                        <!-- Transport Mode: -->

                      </div>
                      <div style="float: left;">
                        <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                        <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                        <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                        <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                        <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                      </div>
                      <div style="float: left;">
                        <div style="font-size: 14px;line-height: 20px;" >{{ item.event }}</div>
                        <div style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(item.eventTime) }}</div>
                        <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style="" class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div ><div class="vessel-title">Vessel</div><div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div></div>
                            <div ><div class="vessel-title">Service</div><div class="vessel-title">{{ item.service==null?'-':item.service }}</div></div>
                            <div ><div class="vessel-title">Voyage/Bound</div><div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div></div>
                        </div>
                      </div>
                    </div>
                  </el-row>

                  <el-row>
                    <div>


                  </div>
                  </el-row>

                </div>

            </div>

            </template>
          </el-table-column>

  <el-table-column :label="$t('booking.carrier')" prop="carrier" width="250px" :align="'center'">
            <template v-slot="scope">
              <div>
                <img
            v-if="scope.row.carrier == 'HLCU'"
            class="uni-carrier-logo-image"
            src="../../../assets/HLCU.png"
          />
          <img
            v-if="scope.row.carrier == 'MAEU'"
            class="uni-carrier-logo-image"
            src="../../../assets/MAEU.png"
          />
          <img
            v-if="scope.row.carrier == 'ZIMU'"
            class="uni-carrier-logo-image"
            src="../../../assets/ZIMU.png"
          />
          <img
                  v-if="scope.row.carrier == 'TSHG'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/tailwind.png"
                />
                <img
            v-if="scope.row.carrier == 'MSCU'"
            class="uni-carrier-logo-image"
            src="../../../assets/MSCU-new.png"
          />
          <img
                  v-if="scope.row.carrier == 'MSC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/MSCU-new.png"
                />

                <img
            v-if="scope.row.carrier == 'OOLU'"
            class="uni-carrier-logo-image"
            src="../../../assets/OOLU.svg"
          />
          <img
            v-if="scope.row.carrier == 'CMDU'"
            class="uni-carrier-logo-image"
            src="../../../assets/CMA.png"
          />
          <img
            v-if="scope.row.carrier == 'ONEY'"
            class="uni-carrier-logo-image"
            src="../../../assets/ONE.png"
          />
          <img
            v-if="scope.row.carrier == 'COSU'"
            class="uni-carrier-logo-image"
            src="../../../assets/COSCO.png"
          />
                <img
                  v-if="scope.row.carrier == 'CMA'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/CMA.png"
                />
                <img
                  v-if="scope.row.carrier == 'COSCO'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/COSCO.png"
                />
                <img
                  v-if="scope.row.carrier == 'HPL'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/HPL.png"
                />

                <img
                  v-if="scope.row.carrier == 'MSK'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/MSK.png"
                />
                <img
                  v-if="scope.row.carrier == 'HMM'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/HMM.jpg"
                />
                <img
                  v-if="scope.row.carrier == 'ONE'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/ONE.png"
                />
                <img
                  v-if="scope.row.carrier == 'ZIM'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/ZIM.png"
                />
                <img
                  v-if="scope.row.carrier == 'EMC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/EMC.svg"
                />
                <img
                  v-if="scope.row.carrier == 'OOCL'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/OOCL.svg"
                />
                <img
                  v-if="scope.row.carrier == 'YML'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/YML.png"
                />
                <img
                  v-if="scope.row.carrier == 'MCC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/MSK.png"
                />
                <img
                  v-if="scope.row.carrier == 'EGLV'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/EGLV.png"
                />
                <img
                  v-if="scope.row.carrier == 'SJHH'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/SJHH.png"
                />
                <img
                  v-if="scope.row.carrier == 'SMLU'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/SMLU.png"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable="custom"  label="Service" prop="service" width="180px">
          </el-table-column>


          <el-table-column
            label="Main Carriage"
            prop="mainCarriage"
            min-width="300px"
          >
          <template v-slot="scope">
            <div style="width: 800px;">
              <div style="float: left; margin-right: 10px;margin-top: 20px">
                <div style="text-align: center; color:#c3c5c7; ">
      {{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ") }}
    </div>
    <div style="text-align: center;">
      {{ parseTime(scope.row.departureDate) }}
    </div>
              </div>

              <div style="float: left; width: 100px;">
                <div style="position: relative">
                  <div style="text-align: center;color:#385f78;white-space: nowrap;">
                  {{ scope.row.vesselName }}
                </div>
                <div class="image-container" style="position: absolute; left: 35px">
                  <img style="width: 20px; height: 20px"
                  src="../../../assets/icons/ship.png"
                  />
                </div>
                <div style="text-align: center;color:#385f78;position: absolute; top: 50px;left: 30px">
                  {{ scope.row.voyage }}
                </div>
                </div>
              </div>

              <div style="float: left;margin-left: 10px;margin-top: 20px">
                <div style="text-align: center;  color:#c3c5c7; ">
                  {{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ") }}
                  </div>
                  <div style="text-align: center;">
                    {{ parseTime(scope.row.arrivalDate) }}
                  </div>
              </div>
            </div>

            </template>
          </el-table-column>

          <el-table-column
            label="TT"
            prop="transitTime"
            min-width="100px"
          >
          <template v-slot="scope">
            {{ scope.row.transitTime+" days" }}
            </template>
          </el-table-column>
<!-- <el-table-column :label="$t('booking.carrier')" prop="carrier" width="180px" :align="'center'">
</el-table-column>
<el-table-column label="Service" prop="service" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.voyage')" prop="voyage" min-width="100px">
  <template slot-scope="scope">
    {{ scope.row.voyage }}
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselCode')"
  prop="vesselCode"
  min-width="100px"
>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselName')"
  prop="vesselName"
  min-width="100px"
>
</el-table-column>
<el-table-column :label="$t('booking.pol')" prop="port" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.pod')" prop="pod" min-width="100px">
</el-table-column>
<el-table-column
  :label="$t('booking.etd')"
  prop="departureDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.departureDate) }}</span>
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.eta')"
  prop="arrivalDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.arrivalDate) }}</span>
  </template>
</el-table-column> -->

<el-table-column
  prop="choseSchedule"
  width="100px"
>
  <template v-slot="scope">
    <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
  </template>
</el-table-column>
</el-table>
</el-dialog>

<el-card  style="margin-bottom: 10px;padding-left: 15px;margin-top: 10px">
<el-descriptions title="Input ETD Range" style="box-shadow: none;" :column="3" border>
  <span class="el-descriptions__title" slot="title">Select vessel schedule </span><span style="color: #bbb1c2" slot="title">(Input ETD Range)</span>
</el-descriptions>
<el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker placeholder="ETD From" v-model="searchSchedule.from"/>
        </el-col>
        <el-col :span="6">
          <el-date-picker placeholder="ETD To" v-model="searchSchedule.to"/>
        </el-col>
        <el-col :span="6" >
          <el-button @click="queryShippingSchedule" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        </el-col>
      </el-row>
</el-card>

    <el-card style="padding: 15px;margin: 15px 0px;">
      <el-timeline>
        <el-timeline-item
          :timestamp="
          (item.etd!=null||item.eta!=null)? (
            (parseTime(item.etd) ? parseTime(item.etd) : '-') +
            ' - ' +
            (parseTime(item.eta) ? parseTime(item.eta) : '-')
            ):''
          "
          placement="top"
          v-for="(item, i) in form.shipmentRouters"
          :key="i + 'router'"
          class="shipmentRouters-css"
        >
          <el-card shadow="never">
            <h4 v-if="i == 0">
              <i class="el-icon-ship"></i>{{ $t("booking.form") }}:
              {{ getLabel(item.pol, "pol") }}
            </h4>
            <div v-if="i != form.shipmentRouters.length - 1 && i > 0">
              <h4><i class="el-icon-ship"></i>{{ $t("booking.formTo") }}:</h4>
              <el-row :gutter="20">
                <el-col :span="6"
                  ><font color="#FF0000">*</font>{{ $t("booking.pol") }}</el-col
                >
              </el-row>

              <el-row :gutter="20">
                <el-col :span="6">
                  <el-select filterable v-model="item.pol">
                    <el-option
                      v-for="(item, index) in portOptions"
                      :key="index + 'pol3'"
                       :label="item.name+' ('+item.code+')'"
                      :value="item.code"
                    ></el-option>

                  </el-select>
                </el-col>
              </el-row>
            </div>
            <br />
            <div v-if="i != form.shipmentRouters.length - 1">
              <el-row :gutter="20">
                <el-col :span="4"><font color="#FF0000">*</font>Transport Mode</el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>{{ $t("booking.etd") }}
                </el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>{{ $t("booking.eta") }}
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-bottom: 5px">
                <el-col :span="4" >
                  <el-form-item required :prop="'shipmentRouters.' + i + '.transportMode'">
                    <el-select v-model="item.transportMode" clearable filterable>
                      <el-option
                        v-for="dict in transportMode"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" >
                  <el-form-item    required :rules="[ { required: true, message: '  '}  ]"   :prop="'shipmentRouters.' + i + '.etd'">
                    <el-date-picker  value-format="timestamp" v-model="item.etd" />
                  </el-form-item>
                </el-col>
                <el-col :span="4" >
                  <el-form-item  required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.eta'">
                    <el-date-picker value-format="timestamp" v-model="item.eta" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">
                  <font color="#FF0000">*</font>{{ $t("booking.transportMeanName") }}
                </el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>{{ $t("booking.voyage") }}
                </el-col>
                <el-col :span="4"></el-col>
                  <font color="#FF0000">*</font>Service
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin-bottom: 5px">
                <!-- <el-col :span="12"><el-input v-model="item.identification" /></el-col> -->
                <el-col :span="4">
                  <el-form-item  required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.transportMeanName'">
                    <el-select
                    allow-create
                      v-model="item.transportMeanName"
                      placeholder=""
                      filterable
                      remote
                      reserve-keyword
                      clearable
                      :remote-method="remoteMethod2"
                      @change="changeVesselName(item)"
                      @clear="item.transportMeanName = null"
                    >
                      <el-option
                        v-for="dict in vesselListLes"
                        :key="dict.id"
                        :label="dict.vesselName"
                        :value="dict.vesselName"
                      />
                    </el-select>
                  </el-form-item>

                </el-col>
                              <el-col :span="4">
                                <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.voyage'">
                                  <el-input v-model="item.voyage" />
                                </el-form-item>
                              </el-col>
                              <el-col :span="4">
                                <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'shipmentRouters.' + i + '.service'">
                                  <el-input v-model="item.service" />
                                </el-form-item>
                              </el-col>
              </el-row>



            </div>
            <h4 v-if="i == form.shipmentRouters.length - 1">
              <i class="el-icon-ship"></i>{{ $t("booking.to") }}:
              {{ getLabel(item.pol, "pod") }}
            </h4>
            <el-row
              v-if="i != form.shipmentRouters.length - 1"
              style="margin-top: 10px; text-align: center"
            >
              <el-col :span="12">
                <el-button
                  type="primary"
                  @click="form.shipmentRouters.splice(i + 1, 0, {})"
                  icon="el-icon-plus"
                  circle
                ></el-button>

                <el-button
                  v-if="i != form.shipmentRouters.length - 1 && i != 0"
                  type="danger"
                  @click="form.shipmentRouters.splice(i, 1)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
      <el-row style="text-align: center">
        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.noBookingEdi" >No EDI</el-checkbox></span>

        <el-button size="mini" @click="submit(2)"  type="primary" :loading="loadingSaveBut">
          {{$auth.hasPermi('submit:carrier:booking')?'Save Draft':'Submit'}}
        </el-button>
        <el-button size="mini" @click="submit(0)" v-hasPermi="['submit:carrier:booking']" type="primary" :loading="loadingSaveBut">{{
          $t("booking.submit")
          }}</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<style>
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
</style>

<script>
import { getUserProfile } from "@/api/system/user";
import { listDept } from "@/api/system/dept";
import { getItemList } from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getHeaderList } from "@/api/order/header";
import { getListByShipmentId } from "@/api/booking/booking";
import {
  create,
  si,
  vgm,
  shipmentDetails,
  updateShipment,
  findShippingScheduleList
} from "@/api/shipment/shipment";
import { getSOHeaderPage } from "@/api/order/sOHeader";
import { getCraNumList } from "@/api/shipment/shipment";
import { getContainerList } from "@/api/system/container";
import { createDeptApply } from "@/api/system/deptApply";
import { getVesselList } from "@/api/system/vessel";
import { getFileList, deleteFile } from "@/api/infra/file";
import { getHsCodeListByCode ,applyNewHsCode} from "@/api/system/hsCode";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getBaseHeader } from "@/utils/request";
import { getAllocationWeekData } from "@/api/booking/contract";
import { getContractListTenantIgnore } from "@/api/booking/contract";
import MainTable from '@/views/salesOrder/components/table.vue';
import { fileLoadMixin } from '@/utils/fileLoadMixin'
export default {
  name: "Shipment",
  mixins: [fileLoadMixin],
  components: {MainTable},
  data() {
    return {
      loadingSaveBut:false,
      searchSchedule:{
        from:new Date(),
        to:new Date().setMonth(new Date().getMonth() + 2)
      },
      shippingScheduleVisable:false,
      shippingScheduleData:[],
      shippingScheduleLoading:false,
      form: {
        type: "Merchant",
        containers: [{ containers: "" }],
        shipmentRouters: [],
        productData: [],
        contractType: "CY/CY",
        phone: "",
        email: "",
        remark:'',
        allocationYear: null,
        allocationWeek: null
      },
      allocationWeekList:[],
      availableYears: [],
      availableWeeks: [],
      phoneError: "",
      emailError: "",
      portOptions: [],
      containerOptions: [],
      parties: {},
      partiesMap: {},
      tipsMail: "Tailwind.CS@kblinersh.com",
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
      craList:[],
      soDatas:[],
      soTableData:[],
      addRemoveSOVisible:false,
      soQueryParams:{
        booked:false
      },
      carrierMap:{
    "CMDU": "CMA",
    "COSU": "COSCO",
    "EGLV": "EMC",
    "HLCU": "HPL",
    "MSCU": "MSC",
    "ONEY": "ONE",
    "ZIMU": "ZIM",
    "MAEU": "MSK",
    "TSHG": "TSHG",
    "MAEU-ALWAYS": "MSK",
        'SHCO': 'SHIPCO',
        'NVOCC DSV': 'DSV',
        'WECC': 'WEC',
},      carrierMap2:{
    "CMA": "CMDU",
    "TSHG": "TSHG",
    "COSCO": "COSU",
    "EMC": "EGLV",
    "HPL": "HLCU",
    "MSC": "MSCU",
    "ONE": "ONEY",
    "ZIM": "ZIMU",
    "MSK": "MAEU",
        'SHIPCO': 'SHCO',
        'DSV': 'NVOCC DSV',
        'WEC': 'WECC',
},
showTips:true,
showCustomer:true,
transportMode:[
        {
          "label":"Barge",
          "value":"BRG"
        },
        {"label":"Ocean",
        "value":"SEA"
      },
        {"label":"Truck",
        "value":"TRK"
      },
        {"label":"Railway",
        "value":"RAI"
      }
      ],
    };
  },
  mounted() {
    var data = getBaseHeader();
    this.uploadHeaders = data;
    this.url = process.env.VUE_APP_BASE_API;
    this.getPortList();
    this.getContainerList();
    this.getParty();
    this.getVesselList();
    // this.getHsCodeList();
    this.getContractListTenantIgnore();

    var ids = this.$route.query.id;

    if (ids) {
      this.getShipmentDetails(ids);
    } else {
      this.form.productData.push({
        batteries: 3,
        fileList: [],
        uploadData: {},
        dg: 0,
        hazardousMaterials: {},
      });
    }
    if (this.$auth.hasPermi("booking:query")) {

      this.getBookings();
    }
    if(this.$route.query.source == 'booking-order'){
      this.showTips = false;
      this.showCustomer = false;
      getUserProfile().then((response) => {
        this.form.customer = response.data.customers
      });
    }

  },

    created() {
    // var data = getBaseHeader()
    this.generateAvailableYears()
    // this.uploadHeaders = data
    // this.url = process.env.VUE_APP_BASE_API
    // this.getPortList()
    // this.getContainerList()
    // this.getParty()
    // this.getParties("Shipper");
    // this.getParties("Consignee");
    // this.getParties("Notify Party");
    // this.getParties("Agreement Party");
    // this.getVesselList()
    // this.getHsCodeList();
    // this.getContractListTenantIgnore()
    // if (this.$route.query.carrier) {
    //   this.$set(this.form, 'carrier', this.$route.query.carrier)
    // }
    // this.getUserInfo()
    // this.source = this.$route.query.source
    // this.isPepco = this.$route.query.isPepco
    // console.log('this.form_info', this.isPepco)
    // if (this.source == 'booking-order') {
    //   //是从booking-order创建的shipment
    //   this.showTips = false
    //   this.showCustomer = false
    //   getUserProfile().then(response => {
    //     this.form.customer = response.data.customers
    //   })
    //   this.$set(this.form, 'shipperCreate', true)
    // } else if (this.source == 'spoBooking') {
    //   //是从shipping Order list创建的shipment
    // }
    // localStorage.removeItem('refreshPoPage')
  },

    watch: {
    'form.allocationYear'(newVal) {
      console.log('form.allocationYear', newVal)
      if (newVal) {
        this.onYearChange(newVal)
      }
    }
  },
  methods: {
    getContractListTenantIgnore() {
      var queryParams = {};
      getContractListTenantIgnore(queryParams).then(response => {
        this.craList = []
        for (var t of response.data) {
          t.contractNo = t.contractNo.trim();
          this.craList.push(t)
        }
      });
    },
    applyNewHsCode(){
      this.applyHsCodeVisable=true

    },
    addSO(row){
      this.soDatas.push(row)
    },
    getSO(){
      getSOHeaderPage(this.soQueryParams).then((res)=>{
                    for(var i=0;i<res.data.list.length;i++){
                        res.data.list[i].key='first'+res.data.list[i].id
                    }
                    this.soTableData=res.data.list
                    this.soQueryParams.total=res.data.total
                })
    },
    changeCarrier(value) {
      this.$set(this.form, "contractNumber", "");

      if (value == "TSHG") {
        this.setCra();
        this.craFlag = true;
      } else {
        this.craFlag = false;
      }
      this.remoteGetCraNum()
    },
    choseSchedule(row){
      this.form.shipmentRouters[0]
      this.$set(this.form.shipmentRouters[0],'pol',row.port)
      this.$set(this.form.shipmentRouters[0],'etd',row.departureDate)
      this.$set(this.form.shipmentRouters[0],'eta',row.arrivalDate)
      this.$set(this.form.shipmentRouters[0],'transportMeanName',row.vesselName)
      this.$set(this.form.shipmentRouters[0],'identification',row.vesselCode)
      this.$set(this.form.shipmentRouters[0],'voyage',row.voyage)
      this.$set(this.form.shipmentRouters[0],'imo',row.imo)
      this.$set(this.form.shipmentRouters[0],'service',row.service)
      this.$set(this.form.shipmentRouters[0],'transportMode',"SEA")

      this.$set(this.form,'carrier',this.carrierMap2[row.carrier])
      this.shippingScheduleVisable=false
      if (row.carrier == "TSHG") {
        this.setSchdulesTSHG(row)
      }
    },
    queryShippingSchedule(){
      console.log('1111')
      if(this.form.pol!=null&&this.form.pol!=''
      &&this.form.pod !=null&&this.form.pod !=''
      &&this.searchSchedule.from!=null&&this.searchSchedule.from!=''
      &&this.searchSchedule.to!=null&&this.searchSchedule.to!=''){
        var data={
              origin:this.form.pol,
              destination:this.form.pod,
              departureFrom:this.parseTime(this.searchSchedule.from),
              departureFrom2:this.parseTime(this.searchSchedule.to),
              carrier:this.carrierMap[this.form.carrier],
              service: this.searchSchedule.service
            }
            console.log(data)
            this.shippingScheduleLoading=true
            console.log(123)
            this.findShippingScheduleList(data)
            this.shippingScheduleVisable=true
            console.log(data)
      }else{
        this.$notify({
              title: 'warning',
              message: 'Required fields is empty',
              type: 'warning'
            });
      }

    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then((response) => {
        this.shippingScheduleData = response.data;
        this.shippingScheduleLoading=false
      });
    },
    getAllocationWeekList(){
      if(this.form.contractNumber && this.form.carrier){
        getAllocationWeekData(this.form.carrier, this.form.contractNumber).then((response) => {
          this.allocationWeekList = response.data

        })
      }
    },
    remoteGetCraNum() {
     //query Allocation  etd week
     this.getAllocationWeekList()
      var query = this.form.contractNumber;
      if(this.form.carrier!='TSHG'){
        return
      }
      this.craFlag=true
      this.cra_contaier_type = [];
      this.cra_pol = [];
      this.cra_pod = [];
      this.cra_origin = [];
      this.cra_disch = [];
      if (query !== "" && query.length >= 4) {
        getCraNumList(query).then((response) => {
          this.craNumList = response.data;
          if (this.craNumList.length > 0) {
            if (this.craNumList[0] && this.craNumList[0].ap) {
              var req = {
                partyRole: "Agreement Party",
                customerCode: this.craNumList[0].ap,
              };
              this.getParties(req, true);
            }
          }
          for (var i = 0; i < this.craNumList.length; i++) {
            if (this.cra_pol.indexOf(this.craNumList[i].origin) == -1) {
              this.cra_pol.push(this.craNumList[i].origin);
            }
            if (this.cra_pod.indexOf(this.craNumList[i].delivery) == -1) {
              this.cra_pod.push(this.craNumList[i].delivery);
            }
            if (this.cra_origin.indexOf(this.craNumList[i].loadPort) == -1) {
              this.cra_origin.push(this.craNumList[i].loadPort);
            }
            if (this.cra_disch.indexOf(this.craNumList[i].dischPort) == -1) {
              this.cra_disch.push(this.craNumList[i].dischPort);
            }
            if (this.cra_contaier_type.indexOf(this.craNumList[i].eqpType) == -1) {
              this.cra_contaier_type.push(this.craNumList[i].eqpType);
            }
          }
          this.setCra();
        });
      }
    },
    setCra() {
      if (this.cra_pol.indexOf(this.form.pol) == -1) {
        this.$set(this.form, "pol", "");
        this.$set(this.form, "originPort", "");
      }
      if (this.cra_pod.indexOf(this.form.pod) == -1) {
        this.$set(this.form, "pod", "");
        this.$set(this.form, "destinationPort", "");
      }
      if (this.cra_contaier_type.length > 0) {
        var data = this.form.containers.filter((item) => {
          return (
            this.cra_contaier_type.indexOf(item.containerType) > -1 ||
            item.containerType == ""
          );
        });
        if (data.length == 0) {
          data.push({ containerType: "" });
        }
        this.$set(this.form, "containers", data);
      }
    },
    getParty() {
        this.getParties({ partyRole: "Shipper"});
        this.getParties({ partyRole: "Consignee"});
        this.getParties({ partyRole: "Notify Party"});
        this.getParties({ partyRole: "Agreement Party"});
        this.getParties({ partyRole: "Customer"});
    },
    handleRemove(file, fileList) {
      if (file.id) {
        var vm = this;
        this.$modal
          .confirm(
            'Are you sure to delete the data item with the file "' + file.name + '"?'
          )
          .then(function () {
            deleteFile(file.id).then((response) => {
              const findex = fileList.map((f) => f.name).indexOf(file.name);
              if (findex > -1) {
                fileList.splice(findex, 1);
              }
            });
          })
          .then(() => {
            this.$modal.msgSuccess("Successfully deleted");
          })
          .catch(() => {});
        return false;
      } else {
        return true;
      }
    },
    // 预览 / 下载
    handlePictureCardPreview(file) {
      const link = document.createElement("a");
      link.href = file.url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    getShipmentDetails(id) {
      shipmentDetails(id).then((response) => {
        if (response.data) {
          this.form.contractNumber = response.data.contractNumber;

          if (response.data.carrier == "TSHG") {
            this.craFlag = true;
          } else {
            this.craFlag = false;
          }
          this.form = Object.assign({}, this.form, response.data);
          this.remoteGetCraNum();


          //初始化val
          this.$set(this.form, "amendedOn", null);
          this.$set(this.form, "blNumber", null);
          this.$set(this.form, "bookingNumber", null);
          this.$set(this.form, "shipmentBookingNumber", null);
          this.$set(this.form, "atd", null);
          this.$set(this.form, "ata", null);
          this.$set(this.form, "etd", null);
          this.$set(this.form, "eta", null);
          this.$set(this.form, "cancelCode", null);
          this.$set(this.form, "cancelSubCode", null);
          this.$set(this.form, "cancelRemark", null);
          this.$set(this.form, "siRemark", null);
          this.$set(this.form, "blType", null);
          this.$set(this.form, "blSamples", null);
          this.$set(this.form, "bookedEtd", null);
          this.$set(this.form, "bookedEta", null);
          this.$set(this.form, "siDate", null);
          this.$set(this.form, "vgmDate", null);

          this.$set(this.form, "poNumbers", null);
          this.$set(this.form, "etdAllocation", null);
          this.$set(this.form, "noBookingEdi", 0);
          this.$set(this.form, "noSiEdi", 0);
          this.$set(this.form, "noVgmEdi", 0);

          this.form.containers = []
          for (var i = 0; i < response.data.containerDOList.length; i++) {
            var d = response.data.containerDOList[i];
            if (d && d.type == 0) {
              this.form.containers.push(d);
            }
          }
          if(this.form.containers.length==0) {
            this.form.containers.push({ containerType: "" });
          }
          for (var i = 0; i < response.data.productDOList.length; i++) {
            var d = response.data.productDOList[i];
            if (d.type == 0) {
              if (d.hazardousMaterials == "{}" || null == d.hazardousMaterials) {
                d.dg = 0;
              } else {
                d.dg = 1;
              }
              d.batteries = Number(d.batteries);
              d.hazardousMaterials = JSON.parse(d.hazardousMaterials);
              d.fileList = [];
              d.files = [];
              d.uploadData = {};
              this.form.productData.push(d);
            }
          }
          this.form.shipmentRouters = response.data.routerDOList
          this.form.shipmentRouters.push({
            pod: response.data.pod,
            etd: null,
            eta: null,
          });

          this.changePol(response.data.pol);
          this.changePod(response.data.pod);
          this.$set(this.form, "pol", response.data.pol);
          this.$set(this.form, "pod", response.data.pod);
          this.$set(this.form, "originPort", response.data.originPort);
          this.$set(this.form, "destinationPort", response.data.destinationPort);

        }
      });
    },
    changeDG(item) {
      if (item.dg == 0) {
        this.$set(item, "hazardousMaterials", {});
      } else {
        this.$set(item, "batteries", 3);
      }
      this.$nextTick(() => {
        // 在DOM更新后执行其他操作 不然switch val 不会改变
        var tempa = this.form.name;
        this.form.name = tempa + " ";
        this.form.name = tempa;
      });
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.phone;
      // 自定义验证逻辑
      if (
        !/^\d+$/.test(phoneNumber) ||
        phoneNumber.length < 8 ||
        phoneNumber.length > 15
      ) {
        this.phoneError = "Please enter a valid phone or landline number";
      } else {
        this.phoneError = "";
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.email;
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = "Please enter a valid email address";
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
        if (arr.indexOf(this.form.containers[i].containerType) > -1) {
          flag = true;
          break;
        }
      }
      this.flag = flag;
    },
    remoteMethod(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselCode: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    remoteMethod2(query) {
      console.log(query);
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselName: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    setShipmentRouter() {
      if (!this.$route.query.schdule) {
        return;
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule));
      this.$set(this.form, "carrier", schdule.carrier);
      this.form.shipmentRouters[0].etd = schdule.etd;
      this.form.shipmentRouters[0].eta = schdule.eta;

      this.form.shipmentRouters[0].transportMeanName = schdule.vn;
      this.form.shipmentRouters[0].identification = schdule.vc;
      this.form.shipmentRouters[0].voyage = schdule.vo;

      this.form.shipmentRouters[0].pol = schdule.pol;
      this.form.shipmentRouters[1].pod = schdule.pod;

      if (schdule.carrier == "TSHG") {
        this.setSchdulesTSHG(schdule)
      }
    },
    setSchdulesTSHG(schdule) {
      console.log(schdule)
      getVesselList().then((response) => {
          this.vesselList = response.data;
          var schdules = schdule.tshgList
        if(schdules.length>0) {
          this.form.shipmentRouters = []
        }

        for(var i=0;i<schdules.length;i++){
          var sch = schdules[i]
          if(i==schdules.length-1){
              this.form.shipmentRouters.push({
              // pol: keys.length==1?preAssignMap[keys[0]].fnd:schdule.pod,
              pol: schdule.pod,
              transportMode:'SEA',
              etd: null,
              eta: null,
            });
          continue
          }
          if(i!=schdules.length-1&&sch.event=='Departure') {
             // 有船 并且是 departure ；或者barge
            var sch1 = schdules[i+1]
            var schItem  = {
              transportMode:sch.barge,
              etd: sch.eventTime,
              eta: sch1.eventTime,
              transportMeanName:sch.barge=='Barge'?"TBA":sch.vessel,
              service:sch.barge=='Barge'?"Unknown":sch.service,
              voyage:sch.barge=='Barge'?"Unknown":sch.voyage,
              pol:i==0?schdule.pol:sch.portCode,
            }
            if(sch.barge=='Barge') {
              schItem.transportMode = 'BRG'
            }
            if(sch.barge=='Ocean') {
              schItem.transportMode = 'SEA'
            }
            var obj=this.vesselList.find(
                (element) => element.vesselName == schItem.transportMeanName
              )

              if(obj){
                schItem.identification = obj.vesselCode;
                schItem.imo = obj.imo;
              }else{
                schItem.identification =  "Unknown"
                schItem.imo =  "Unknown"
            }
            if(i==0) {
              this.form.shipmentRouters[0] = schItem;
            } else {
              this.form.shipmentRouters.push(schItem);
            }

          }
          this.form = JSON.parse(JSON.stringify(this.form));

        }
        console.log(this.form.shipmentRouters)
      });

    },
    changeVesselCode(item) {
      item.transportMeanName = this.vesselListLes.find(
        (element) => element.vesselCode == item.identification
      ).vesselName;
    },
    changeVesselName(item) {
      var obj=this.vesselListLes.find(
        (element) => element.vesselName == item.transportMeanName
      )
      item.identification = obj.vesselCode;
      item.imo = obj.imo;
    },
    remoteMethod3(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ imo: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    changeVesselIMO(item){
      var obj=this.vesselListLes.find(
        (element) => element.imo == item.imo
      )
      item.identification = obj.vesselCode;
      item.transportMeanName = obj.vesselName;


    },
    getVesselList() {},
    submitHsCode(){
      this.$refs['hsCodeForm'].validate((valid) => {
          if (valid) {
           applyNewHsCode(this.hsCode).then((res)=>{
             this.$notify({
               title: 'success',
               message: 'success',
               type: 'success'
             });
             this.applyHsCodeVisable=false
             this.hsCode={}
           })
          } else {
            return false;
          }
        });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.partyForm));
          data.partyRole = "," + data.partyRole.join(",") + ",";
          data.status = 0;
          createDeptApply(data).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getParty();
          });
        }
      });
    },
    applyNewParty() {
      this.open = true;
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
    changeNotToAll(item) {
      if (item.notToAll) {
      }
    },
    generateAvailableYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let y = currentYear; y <= currentYear + 3; y++) {
        years.push(y)
      }
      this.availableYears = years
    },
    onYearChange(year) {
      this.generateWeeksForYear(Number(year))
    },

    generateWeeksForYear(year) {
      const weeks = this.getWeeksInYear(year)

      const today = new Date()
      const currentYear = today.getFullYear()
      const currentWeek = this.getWeekNumber(today)

      // this.availableWeeks = weeks.filter(week => {
      //   if (year === currentYear) {
      //     return week >= currentWeek // 当前年，过滤掉之前的周
      //   }
      //   return true
      // })
      this.availableWeeks = weeks
    },

    getWeeksInYear(year) {
      const weeks = []
      let date = new Date(year, 0, 1) // 从1月1日开始

      // 移动到第一个周一（ISO周从周一开始）
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1)
      }

      while (date.getFullYear() === year || (date.getMonth() === 0 && date.getDate() < 7)) {
        const week = this.getWeekNumber(date)
        if (!weeks.includes(week)) {
          weeks.push(week)
        }
        date.setDate(date.getDate() + 7)
      }

      return weeks.sort((a, b) => a - b)
    },
    getWeekNumber(date) {
      // ISO Week Number
      const target = new Date(date.valueOf())
      const dayNr = (date.getDay() + 6) % 7
      target.setDate(target.getDate() - dayNr + 3)
      const firstThursday = target.valueOf()
      target.setMonth(0, 1)
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000)
    },
    getParties(obj, setAp) {
      var vm = this;
      listDept(obj).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(
            vm.partiesMap,
            response.data[i].id,
            response.data[i].name +
              "\n" +
              (response.data[i].country == null ? "" : response.data[i].country) +
              " " +
              (response.data[i].address == null ? "" : response.data[i].address)
          );
        }

        if (setAp) {
          this.$set(this.form, "agreementParty", response.data[0].id);
        }
        this.$set(this.parties, obj.partyRole, response.data);
      });
    },
    changePol(value) {
      this.$set(this.form, "pol", value);
      // this.$set(this.form, "originPort", "");
      this.form.shipmentRouters[0].pol = value;
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      this.$set(this.form, "pod", value);
      // this.$set(this.form, "destinationPort", "");
      this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value;
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form));
          if (this.form.carrier == 'TSHG' && this.form.por == 'CNNGB' && this.form.pol == 'CNTAG' && this.form.shipmentRouters.length == 1) {
            data.shipmentRouters[0].pol = 'CNNGB';
          }
          for (var i = 0; i < data.shipmentRouters.length; i++) {
            if (i != data.shipmentRouters.length - 1) {
              data.shipmentRouters[i].pod = data.shipmentRouters[i + 1].pol;
            }
          }
          data.shipmentRouters.pop();
          data.routers = JSON.stringify(data.shipmentRouters);
          var containerWeight = 0;
          var text='Reefer Container:'
          for (var i = 0; i < data.containers.length; i++) {
            if (data.containers[i].soc == "Yes") {
              flag = true;
            }
            var c = this.containerOptions.find(
              (element) => element.type == data.containers[i].containerType
            );

            console.log(c);
            if (c) {
              containerWeight += Number(c.weight) * Number(data.containers[i].numbers);
            }
            if(data.containers[i].requireTemperature){
              text+=''+data.containers[i].containerType
              +' Ventilation(cbm/hour):'+(data.containers[i].ventClosedOrNot?data.containers[i].ventClosedOrNot:'No')
              +' Humidity(%):'+ (data.containers[i].humidity?data.containers[i].humidity:'No')
              +' O2(%):'+(data.containers[i].o2?data.containers[i].o2:' ')
              +' CO2(%):'+(data.containers[i].co2?data.containers[i].co2:' ')
              +' Drains:'+(data.containers[i].drains?data.containers[i].drains:' ')
              console.log(text)
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
          var soIds=[]
            for(var i=0;i<this.soDatas.length;i++){
              soIds.push(this.soDatas[i].id)
            }
            if(data.fromSalesOrder&&soIds.length==0){
              this.$notify({
                title: 'warning',
                message: 'Please select SO',
                type: 'warning'
              });
              this.loadingSaveBut = false
              return
            }
            data.soIds=soIds

          if (flag  && this.form.carrier == "TSHG") {
            this.$alert("SOC、DG Please Contact Tailwind.CS@kblinersh.com", "Tips", {
              confirmButtonText: "OK",
              callback: (action) => {
                if (action == "confirm") {
                  data.productData = JSON.stringify(data.productData);
                  data.bookingIds = this.$route.query.ids;
                  data.status = status;
                  if(this.$route.query.source == 'booking-order'){
                    data.source = 'booking-order';
                  }
                  create(data).then((response) => {
                    console.log(response.data.productIds);
                    for (var i = 0; i < response.data.productIds.length; i++) {
                      this.form.productData[i].uploadData.exId =
                        response.data.productIds[i];
                      this.$refs["upload" + i][0].submit();
                    }
                    console.log(this.$route.query.source)
                    if(this.$route.query.source == 'booking-order'){
                      this.$router.push("/shipment/booking-order");
                    } else {
                      this.$router.push("/shipment/detail?id=" + response.data.shipmentId);
                    }
                  });
                }
              },
            });
          } else {
            data.productData = JSON.stringify(data.productData);
            data.bookingIds = this.$route.query.ids;
            data.status = status;
            if(this.$route.query.source == 'booking-order'){
              data.source = 'booking-order';
            }
            create(data).then((response) => {
              console.log(response.data.productIds);
              for (var i = 0; i < response.data.productIds.length; i++) {
                this.form.productData[i].uploadData.exId = response.data.productIds[i];
                this.$refs["upload" + i][0].submit();
              }
              console.log(this.$route.query.source)
              if(this.$route.query.source == 'booking-order'){
                      this.$router.push("/shipment/booking-order");
                    } else {
                      this.$router.push("/shipment/detail?id=" + response.data.shipmentId);
                    }
            });
          }
        } else {
          return false;
        }
      });
    },
    getLabel(code, type) {
      var item = this.portOptions.find((item) => item.code == code);
      if (item) {
        return item.name;
      } else {
        return code;
      }
    },
    getContainerList() {
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
    },

    getBookings() {
      this.bookings = [];
      getListByShipmentId({ shipmentId: this.$route.query.id }).then((response) => {
        var orderItems = [];
        this.isBooking = response.data.length > 0?false:true
        for (var i = 0; i < response.data.length; i++) {
          for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
            orderItems.push(response.data[i].bookingItemDOS[j].orderItemId);
            this.orderItemMap[response.data[i].bookingItemDOS[j].orderItemId] =
              response.data[i].bookingItemDOS[j].qty;
          }
        }
        if (orderItems.length > 0) {
          //this.showItems=true;
          getItemList({ ids: orderItems.join(",") }).then((response) => {
            var productIds = [];
            var orderIds = [];
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].bookedQty = this.orderItemMap[response.data[i].id];
              productIds.push(response.data[i].productId);
              orderIds.push(response.data[i].orderId);
            }
            this.itemTableData = response.data;
            getHeaderList({ ids: orderIds.join(",") }).then((response) => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(
                  this.orderMap,
                  [response.data[i].id],
                  response.data[i].orderNumber
                );
              }
            });
            getProductList({ ids: productIds.join(",") }).then((response) => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(this.productMapForBook, [response.data[i].id], {
                  name: response.data[i].name,
                  code: response.data[i].code,
                });
              }
            });
          });
        }
      });
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1);
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1);
    },
    addContainers() {
      this.form.containers.push({ containerType: "" });
      console.log(this.form.containers);
    },
    getPortList() {
      getOriginDeliveryList().then((response) => {
        this.portOptions = response.data;
        this.setShipmentRouter();
      });
    },

    selectBlur(item) {
      for (var i = 0; i < this.hsCodeList.length; i++) {
        if (item.hscode == this.hsCodeList[i].hsCode) {
          item.productEnglishName = this.hsCodeList[i].productEnglishName;
        }
      }
    },
    selectClear() {},

    remoteGetHsCode(query) {
      if (query !== "" && query.length >= 5) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getHsCodeListByCode(query);
          this.options = this.hsCodeList.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },

    getHsCodeListByCode(hscode) {
      getHsCodeListByCode(hscode).then((response) => {
        this.hsCodeList = response.data;
      });
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



  },
};
// 自定义函数用于验证电子邮件地址
function isValidEmailAddress(email) {
  // 自定义验证逻辑
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
</script>
