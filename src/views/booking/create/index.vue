<template>
  <div class="app-container" style="width:100%; margin: 0 auto" v-loading="loading">
    <el-form
      ref="form"
      :show-message="false"
      v-show="!visibleReview && !loading"
      :model="form"
      label-width="250px"
    >
    <el-card style="padding:15px">
      <div v-for="item in reviewBookData" :key="item.orderNumber">
        <p>{{ item.poNumber }}</p>
        <el-table :data="item.tableData">
          <el-table-column prop="productId" label="Product Name">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="Product Code">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].code }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="requested" :label="$t('booking.requested')">
          </el-table-column>
          <el-table-column prop="bookedQty" :label="$t('booking.booked')">
            <template v-slot="scope">
              <el-input size="mini"  @input="changeBookedQty(scope.row)" v-model="scope.row.bookedQty" />
            </template>
          </el-table-column>

          <el-table-column
            min-width="90"
            prop="totalWeight"
            :label="$t('booking.totalWeight')" >
            <template v-slot="scope">
              <el-input-number :precision="3"   :controls="false" size="mini" v-model="scope.row.totalWeight" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="90"
            prop="totalVolume"
            :label="$t('booking.totalVolume')">
            <template v-slot="scope">
              <el-input-number :precision="3"  :controls="false" size="mini" v-model="scope.row.totalVolume" />

            </template>
          </el-table-column>
          <el-table-column
            :label="$t('booking.action')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(item.tableData, scope.row)"
                >{{ $t("search.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
      <el-card style="padding:15px;margin-top: 15px;">
      <el-row>
        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-col>
                <el-divider content-position="left">Booking Ref</el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('booking.shipmentName')" prop="shipmentName">
                  <el-input
                    v-model="form.shipmentName"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('booking.shipperRef')" prop="shipperRef">
                  <el-input
                    v-model="form.shipperRef"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="false">
                <el-form-item :label="$t('booking.bookingNumber')" prop="bookingNumber">
                  <el-input
                    v-model="form.bookingNumber"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item> </el-col
            ></el-col>
            <el-col :span="12">
              <el-col>
                <el-divider content-position="left">{{
                  $t("booking.involvedParties")
                }}</el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.yourRoleInThisTrade')"
                  prop="involvedParties"
                >
                  <el-radio-group
                    @change="changeInvolvedParties"
                    v-model="form.involvedParties"
                    size="mini"
                  >
                    <el-radio
                      v-for="item in involvedPartiesOptions"
                      :key="item.val"
                      :label="item.label"
                      :value="item.value"
                      border
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item required :label="$t('booking.shipper')" prop="shipper">
                  <el-select @change="changeShipper" v-model="form.shipper" filterable>
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

              <el-col :span="24">
                <el-form-item required :label="$t('booking.consignee')" prop="consignee">
                  <el-select @change="changeConsignee" v-model="form.consignee" filterable>
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

              <el-col :span="24">
                <el-form-item
                  :label="$t('booking.notifyParty')"
                  prop="notifyParty"
                >
                  <el-select v-model="form.notifyParty" filterable>
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
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="padding:15px;margin-top: 15px;">
      <el-row>
        <el-col>
          <el-divider content-position="left">{{
            $t("booking.transportation")
          }}</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.freightMethod')"
                  prop="freightMethod"
                >
                  <el-radio-group v-model="form.freightMethod" size="mini">
                    <el-radio
                      v-for="item in this.getDictDatas(DICT_TYPE.MODES_OF_TRANSPORT)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      border
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.shipmentType')"
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
              </el-col>
              <el-col :span="24">
                <el-form-item required :label="$t('booking.incoterms')" prop="incoterms">
                  <el-select v-model="form.incoterms">
                    <el-option
                      v-for="item in this.getDictDatas(DICT_TYPE.INCOTERMS)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <!-- <el-col :span="8" v-for="item in containers" :key="item.id">
                <el-form-item label-width="120px" :label="item.type" prop="">
                  <el-input-number v-model="form.containers[item.type]" />
                </el-form-item>
              </el-col> -->
              <el-button type="text" @click="form.containers.push({})"
                ><i class="el-icon-plus"></i>Add Containers</el-button
              >
              <el-row
                :gutter="20"
                style="color: #004F7C; font-weight: 700 !important; margin-bottom: 10px"
              >
                <el-col :span="12">Equipment Type</el-col>
                <el-col :span="12">Equipment Quantity</el-col>
              </el-row>
              <el-row
                style="margin-bottom: 10px"
                :gutter="20"
                v-for="(item, i) in form.containers"
                :key="'dd' + i"
              >
                <el-col :span="12">
                  <el-form-item class="container_type" label-width="0px"  :required="form.shipmentType=='FCL'"  :prop="'containers.' + i + '.type'">
                  <el-select clearable v-model="item.type">
                    <el-option
                      v-for="dict in containers"
                      :key="dict.type"
                      :label="dict.type"
                      :value="dict.type"
                    />
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="container_type" label-width="0px" :required="form.shipmentType=='FCL'"  :prop="'containers.' + i + '.qty'">
                  <el-input required v-model="item.qty" />
                </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="padding:15px;margin-top: 15px;">
      <el-row>
        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-col>
                <el-divider content-position="left">{{
                  $t("booking.origin")
                }}</el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.truckServices')"
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
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.originPort')"
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
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.originLocation')"
                  prop="originLocation"
                >
                  <el-input type="textarea" v-model="form.originLocation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.needExportCustomServices')"
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
              </el-col>

              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.cargoReadyForPickup')"
                  prop="cargoReadyForPickup"
                >
                  <el-date-picker
                    value-format="timestamp"
                    v-model="form.cargoReadyForPickup"
                    type="date"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-col>
                <el-divider content-position="left">{{
                  $t("booking.destination")
                }}</el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.deliverServiceFromPodToFnd')"
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
              </el-col>
              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.destinationPort')"
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
              </el-col>

              <el-col :span="24">
                <el-form-item
                  required
                  :label="$t('booking.destinationLocation')"
                  prop="destinationLocation"
                >
                  <el-input type="textarea" v-model="form.destinationLocation"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item :label="$t('booking.deliverDate')" prop="deliverDate">
                  <el-date-picker
                    value-format="timestamp"
                    v-model="form.deliverDate"
                    type="date"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="padding:15px;margin-top: 15px;">
      <el-row :gutter="20">

        <el-col>
          <el-divider content-position="left">{{ $t("booking.cargo") }}</el-divider>
        </el-col>
        <el-col :span="24">
          <el-form-item required :label="$t('booking.cargoUnits')" prop="cargoUnits">
            <el-radio-group v-model="form.cargoUnits" size="mini">
              <el-radio
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                border
              ></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            required
            label-width="150px"
            :label="$t('booking.totalWeight')"
            prop="totalWeight"
          >
            <el-input-number :precision="3" :controls="false" v-model="form.totalWeight" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            required
            label-width="160px"
            :label="$t('booking.totalVolume')"
            prop="totalVolume"
          >
            <el-input-number :precision="3" :controls="false" v-model="form.totalVolume" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            required
            label-width="120px"
            :label="$t('booking.type')"
            prop="cargoPackageType"
          >
            <el-select
              filterable
              v-model="form.cargoPackageType"
              placeholder=""
              clearable
            >
              <el-option
                v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_UNITS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            required
            label-width="150px"
            :label="
              $t('booking.total') + form.cargoPackageType + ' ' + $t('booking.slac')
            "
            prop="slac"
          >
            <el-input v-model="form.slac" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
      <el-row v-if="false">
        <el-col :span="24">
          <el-form-item :label="$t('booking.marksAndNumbers')" prop="slac">
            <el-input type="textarea" v-model="form.marks" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-card style="padding:15px;margin-top: 15px;">
      <el-row>
        <el-button @click="addProduct" size="mini" type="primary">{{
          $t("booking.addProduct")
        }}</el-button>
      </el-row>

      <el-descriptions
        :colon="false"
        direction="vertical"
        v-for="(item, i) in form.productData"
        :key="'product' + i"
        style="padding: 0px 20px!important;"
        class="margin-top"
        title=""
        :column="2"
        :size="size"
      >
        <template slot="extra">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(i)"
            >{{ $t("search.delete") }}</el-button
          >
        </template>
        <el-descriptions-item :label="$t('booking.productEnglishName')"
          ><el-input v-model="item.productEnglishName"
        /></el-descriptions-item>
        <el-descriptions-item :label="$t('booking.hsCode')">
          <el-select
            filterable
            clearable
            remote
            v-model="item.hscode"
            :remote-method="getHsCodeListByCode"
          >
            <el-option
              v-for="dict in hsCodeList"
              :key="dict.hsCode"
              :label="dict.hsCode"
              :value="dict.hsCode"
            />
          </el-select>
        </el-descriptions-item>
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
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input type="textarea" v-model="item.mark" />
            </el-col>
          </el-row>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

      <el-card style="padding:15px;margin: 15px 0px;">
      <el-row>
        <el-upload
          class="upload-demo"
          ref="upload"
          multiple
          :action="url + '/admin-api/booking/book/files'"
          :data="uploadData"
          :headers="uploadHeaders"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="handleFileChange"
        >
          <el-button slot="trigger" type="primary">{{ $t("booking.browse") }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t("booking.fileList") }}:</div>
        </el-upload>
      </el-row>

    </el-card>
    <el-row style="text-align: right">
        <el-button @click="reviewBooking()" type="primary">{{
          $t("booking.reviewBooking")
        }}</el-button>
      </el-row>
    </el-form>

    <div v-show="visibleReview">
      <h1>{{ $t("booking.reviewAndBook") }}</h1>
      <div>
        <div style="float: left">
          {{ form.shipmentName }}
          <br />
          {{ form.shipperRef }}
          <br />
          {{ form.bookingNumber }}
        </div>
        <div style="float: right">
          <el-button size="mini" @click="visibleReview = false">{{
            $t("booking.editDetail")
          }}</el-button>
          <el-button size="mini">{{ $t("booking.saveDraft") }}</el-button>
          <el-button size="mini" @click="submitBooking">{{
            $t("booking.confirmBook")
          }}</el-button>
        </div>
        <div style="clear: both"></div>
      </div>
      <el-card style="margin-top:15px;padding: 15px;">
        <div style="float: left">
          <img
            style="width: 100px; border-radius: 50px; height: 100px"
            src="../../../assets/container.png"
          />
        </div>
        <div style="float: left; padding-left: 20px">
          <p>
            {{ $t("booking.container") }}:
            <el-tag
              v-show="value > 0"
              style="margin-right: 10px"
              v-for="(value, key) in form.containers"
              :key="key"
            >
              {{ key }} x {{ value }}
            </el-tag>
          </p>
          <p>{{ $t("booking.cargoReadyDate") }}</p>
          <p>{{ parseTime(form.cargoReadyForPickup) }}</p>
        </div>
        <div style="clear: both"></div>
      </el-card>
      <el-card style="margin-top:15px;padding: 15px;">
      <div>
        <p>
          <b>{{ $t("booking.incoterms") }}</b>
        </p>
        <p>{{ form.incoterms }}</p>
      </div>
      <el-divider></el-divider>
      <div>
        <p>
          <b>{{ $t("booking.exportCustomService") }}</b>
        </p>
        <p>{{ form.needExportCustomerService }}</p>
      </div>
      <el-divider></el-divider>
    </el-card>
    <el-card style="margin-top:15px;padding: 15px;">
      <div>
        <p>
          <b>{{ $t("booking.pickupFrom") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i
            style="
              background: rgb(0, 79, 124);
              padding: 5px;
              border-radius: 5px;
              font-size: 30px;
              color: #fff;
            "
            class="el-icon-truck"
          ></i>
          &nbsp;&nbsp;<span style="position: relative; top: -5px">{{
            form.originLocation
          }}</span>
        </p>
      </div>
      <el-divider></el-divider>
      <div>
        <p>
          <b>{{ $t("booking.selectedPorts") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i
            style="
              background: rgb(0, 79, 124);
              padding: 5px;
              border-radius: 5px;
              font-size: 30px;
              color: #fff;
            "
            class="el-icon-ship"
          ></i>
          &nbsp;&nbsp;<span style="position: relative; top: -5px"
            >{{ form.originPort }}<i class="el-icon-right"></i
            >{{ form.destinationPort }}</span
          >
        </p>
      </div>
      <el-divider></el-divider>
      <div>
        <p>
          <b>{{ $t("booking.deliverTo") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i
            style="
              background: rgb(0, 79, 124);
              padding: 5px;
              border-radius: 5px;
              font-size: 30px;
              color: #fff;
            "
            class="el-icon-truck"
          ></i>
          &nbsp;&nbsp;<span style="position: relative; top: -5px">{{
            form.destinationLocation
          }}</span>
        </p>
      </div>
    </el-card>

      <el-card style="padding: 15px; margin-top: 15px;">

        <p>
          <b>{{ $t("booking.cargoDetails") }}</b>
        </p>
        <el-descriptions
          style="margin-bottom: 10px"
          :colon="false"
          direction="vertical"
          v-for="(item, i) in form.productData"
          :key="'product' + i"
          class="margin-top"
          title=""
          :column="3"
        >
          <template slot="extra">
            <br />
          </template>

          <el-descriptions-item :label="$t('booking.productEnglishName')">{{
            item.productEnglishName
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('booking.hsCode')">{{
            item.hscode
          }}</el-descriptions-item>

          <el-descriptions-item label="Marks&Numbers">{{
            item.mark
          }}</el-descriptions-item>

          <el-descriptions-item>
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
              <el-col v-show="item.hazardousMaterials == {}" :span="3">Batteries</el-col>
              <el-col
                v-show="item.hazardousMaterials != {}"
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
                <span v-if="false">{{
                  (item.dg = item.hazardousMaterials == {} ? 0 : 1)
                }}</span>
              </el-col>
              <el-col
                v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
                :key="'d' + dict.value"
                :span="4"
                v-show="item.hazardousMaterials != {}"
              >
                {{ item.hazardousMaterials[dict.value] }}
              </el-col>

              <el-col :span="20" v-show="item.hazardousMaterials == {}">
                <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                  <el-radio :label="2" border>Has batteries</el-radio>
                  <el-radio :label="3" border>No batteries</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <el-row :gutter="20">
        <el-col :span="6">
          {{ $t("booking.totalWeight") }}
        </el-col>
        <el-col :span="6">
          {{ $t("booking.totalVolume") }}
        </el-col>
        <el-col :span="6">
          {{ $t("booking.unit") }}
        </el-col>
        <el-col :span="6">
          {{ $t("booking.qty") }}
        </el-col>
        <el-col :span="6">
          {{ form.totalWeight }}
        </el-col>
        <el-col :span="6">
          {{ form.totalVolume }}
        </el-col>
        <el-col :span="6">
          {{ form.cargoPackageType }}
        </el-col>
        <el-col :span="6">
          {{ form.slac }}
        </el-col>
      </el-row>
      </el-card>



      <el-card style="margin-top: 15px; padding: 15px;">
        <b>{{ $t("booking.involvedParties") }}</b>
        <el-row :gutter="20">
          <el-col :span="8">
            <p>
              <b>{{ $t("booking.shipper") }}</b>
            </p>
            <p>{{ partiesMap[form.shipper] }}</p>
          </el-col>
          <el-col :span="8">
            <p>
              <b>{{ $t("booking.consignee") }}</b>
            </p>
            <p>{{ partiesMap[form.consignee] }}</p>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="padding:15px;margin-top: 15px;" v-for="item in reviewBookData" :key="item.orderNumber">
        <p>{{ item.poNumber }}</p>
        <el-table :data="item.tableData">
          <el-table-column prop="productId" label="Product Name">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="Product Code">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].code }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cargoReadyBy"
            :label="$t('booking.cargoReadyBy')"
            width="180"
          >
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
          </el-table-column>
          <el-table-column prop="bookedQty" :label="$t('booking.booked')">
          </el-table-column>
          <el-table-column prop="totalWeight" label="Weight">
          </el-table-column>
          <el-table-column prop="totalVolume" label="Volume">
          </el-table-column>
          <el-table-column prop="totalWeight"
                           width="160"  :label="$t('booking.totalWeight')">
          </el-table-column>
          <el-table-column prop="totalVolume"
                           width="160" :label="$t('booking.totalVolume')">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style>
.container .el-form-item__content {
  margin-left: 0px !important;
}
</style>

<script>
import { getProductList } from "@/api/system/product";
import { getBaseHeader } from "@/utils/request";
import { getHeader } from "@/api/order/header";
import { listDept } from "@/api/system/dept";
import { getHsCodeListByCode } from "@/api/system/hsCode";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getUserProfile } from "@/api/system/user";
import { getContainerList } from "@/api/system/container";
import { create } from "@/api/booking/booking";
import { getCustomFieldList } from "@/api/system/customField";
import { fileLoadMixin } from '@/utils/fileLoadMixin'

export default {
  name: "Container",
  mixins: [fileLoadMixin],
  components: {},
  data() {
    return {
      fileList: [],
      visibleReview: false,
      reviewBookData: null,
      productMapForBook: {},
      uploadHeaders: {},
      form: {
        involvedParties: "Consignee",
        freightMethod: "Ocean/Sea",
        shipmentType: "LCL",
        truckServices: "No",
        needExportCustomerService: "No",
        deliverServiceToFnd: "No",
        cargoUnits: "kg/cbm",
        cargoPackageType: "Carton",
        origin: "No",
        productData: [{ dg: 0, batteries: 3, hazardousMaterials: {} }],
        containers: [{}],
      },
      rules: {
        deliverDate: [
          { required: true, message: "请填写未双眼视功能检查原因！", trigger: "blur" },
        ],
      },
      involvedPartiesOptions: [
        { value: "Shipper", label: "Shipper" },
        { value: "Consignee", label: "Consignee" },
      ],
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
      parties: {},
      order: {},
      portOptions: [],
      unitOptions: [
        {
          label: "kg/cbm",
        },
        {
          label: "lb/cft",
        },
      ],
      userProfile: {},
      partiesMap: {},
      containers: [],
      loading: true,
      uploadData: {},
      url: "",
      customFieldMap: {},
      hsCodeList: [],
    };
  },
  created() {
    this.getCustomFiled();
    var data = getBaseHeader();
    this.url = process.env.VUE_APP_BASE_API;
    this.uploadHeaders = data;
    this.getParties("Shipper");
    this.getParties("Consignee");
    this.getParties("Notify Party");
    this.getPortList();
    this.getContainerList();
  },
  methods: {

    changeBookedQty(row){
      this.calculateWeight(row)
      this.calculateVolume(row)
    },
    calculateWeight(row){
      if(row.weight && row.bookedQty){
        const weightKg = (row.weight * row.bookedQty).toFixed(3)
        row.totalWeight = weightKg
        return weightKg;
      }
      return row.totalWeight;
    },
    calculateVolume(row ) {
      if(row.length && row.width && row.height && row.bookedQty){
        // 计算体积（单位：立方厘米）
        const volumeCm3 = row.length * row.width * row.height;
        // 转换为立方米
        const volumeCbm = ((volumeCm3 / 1000000) * row.bookedQty).toFixed(3);
        row.totalVolume = volumeCbm;
        return volumeCbm;
      }
      return row.totalVolume;
    },
    getHsCodeListByCode(hscode) {
      if (hscode.length >= 5) {
        getHsCodeListByCode(hscode).then((response) => {
          this.hsCodeList = response.data;
        });
      }
    },
    changeDG(item) {
      if (item.dg == 0) {
        //item.hazardousMaterials = "";
        this.$set(item, "hazardousMaterials", {});
      } else {
        this.$set(item, "batteries", 3);
      }
    },
    getCustomFiled() {
      getCustomFieldList().then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          this.customFieldMap[res.data[i].displayText] = res.data[i].field;
        }
        this.getUserInfo();
      });
    },
    setNoToAll(item) {},
    changeBatteries(item) {
      if (item.batteries == 3) {
        item.batteriesLevelTow = [];
      } else {
        this.$set(item, "notToAll", false);
      }
    },
    changeNotToAll(item) {
      if (item.notToAll) {
        item.batteries = 3;
        item.hazardousMaterials = "";
        item.others = "";
        item.batteriesLevelTow = [];
      }
    },
    submitBooking() {
      var vm = this;
      var data = JSON.parse(JSON.stringify(this.form));
      for (var i = 0; i < data.productData.length; i++) {
        console.log(data.productData[i]);
        data.productData[i].hazardousMaterials = JSON.stringify(
          data.productData[i].hazardousMaterials
        );
      }
      data.productData = JSON.stringify(data.productData);
      var bookedData = [];
      for (var i = 0; i < this.reviewBookData.length; i++) {
        for (var j = 0; j < this.reviewBookData[i].tableData.length; j++) {
          bookedData.push(this.reviewBookData[i].tableData[j]);
        }
      }
      var containers = data.containers;
      data.containers = JSON.stringify(containers);
      data.bookedData = JSON.stringify(bookedData);
      create(data).then((response) => {
        vm.uploadData.exId = response.data;
        vm.$refs.upload.submit();
        sessionStorage.removeItem("bookData");
        this.$router.push("/shipment/booking-detail?id=" + response.data);
      });
    },
    reviewBooking() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.visibleReview = true;
          const element = document.querySelector(".app-main");
          element.scrollTop = 0;
        } else {
          return false;
        }
      });
    },
    getContainerList() {
      var vm = this;
      getContainerList({ ids: [].join(",") }).then((response) => {
        vm.containers = response.data;
      });
    },
    submitUpload() {},
    getUserInfo() {
      var vm = this;
      getUserProfile().then((response) => {
        vm.userProfile = response.data;
        this.init();
      });
    },
    changeShipper() {},
    changeConsignee() {},
    handleDelete(index) {
      this.form.productData.splice(index, 1);
    },
    addProduct() {
      this.form.productData.push({
        batteriesLevelTow: [],
        batteries: 3,
        hazardousMaterials: {},
      });
    },
    getPortList() {
      getOriginDeliveryList().then((response) => {
        this.portOptions = response.data;
      });
    },
    changeInvolvedParties() {
      if (this.form.involvedParties == "Consignee") {
        this.$set(this.form, "shipper", this.order.seller);
        this.$set(this.form, "consignee", this.order.buyer);
      } else {
        this.$set(this.form, "shipper", this.order.buyer);
        this.$set(this.form, "consignee", this.order.seller);
      }
      this.changeConsignee();
      this.changeShipper();
    },
    getParties(partyRole) {
      var vm = this;
      listDept({ partyRole: partyRole }).then((response) => {
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
        vm.$set(vm.parties, partyRole, response.data);
      });
    },
    getOrders(orderIds) {
      var vm = this;
      getHeader(orderIds[0]).then((response) => {
        vm.$set(vm.order, "seller", response.data.seller);
        vm.$set(vm.order, "buyer", response.data.buyer);
        console.log(response.data)
        this.$set(
          this.form,
          "destinationPort",
          response.data.destinationPort
        );
        this.$set(
          this.form,
          "destinationLocation",
          response.data.destinationLocation
        );
        this.$set(
          this.form,
          "originLocation",
          response.data.originLocation
        );

        this.$set(
          this.form,
          "originPort",
          response.data.originPort
        );
        this.$set(this.form, "cargoReadyForPickup", response.data.cargoReadyDate);
        this.$set(
          this.form,
          "incoterms",
          response.data.incoterms
        );
        vm.changeInvolvedParties();
      });
    },
    init() {
      var vm = this;

      var strData = sessionStorage.getItem("bookData");
      if (strData == null) {
        this.reviewBookData = [];
        strData = "[]";
      }
      this.loading = false;
      var data = JSON.parse(strData);
      var productIds = [];
      var orderNumbers = [];
      var orderIds = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].tableData.length; j++) {
          productIds.push(data[i].tableData[j].productId);
        }
        orderNumbers.push(data[i].poNumber);
        orderIds.push(data[i].orderId);
      }
      if (orderIds.length > 0) {
        this.getOrders(orderIds);
        this.$set(this.form, "shipmentName", orderNumbers.join(","));
        getProductList({ ids: productIds }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.productMapForBook[response.data[i].id] = {
              name: response.data[i].name,
              code: response.data[i].code,
            };
            //response.data[i].name + "[" + response.data[i].code + "]";
          }
          vm.reviewBookData = data;
          var slac = 0;
          var totalWeight = 0;
          var totalVolume = 0;
          var productNames = [];
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].tableData.length; j++) {
              slac += Number(data[i].tableData[j].bookedQty);
              totalWeight += Number(
                data[i].tableData[j].totalWeight
              );
              totalVolume += Number(
                data[i].tableData[j].totalVolume
              );
                productNames.push({
                  name: this.productMapForBook[data[i].tableData[j].productId].name,
                  itemNumber:data[i].tableData[j].id,
                 });
            }
          }
          var productData = [];
          var obj = {}
          productNames = productNames.reduce(function (data, item) {
          obj[item.itemNumber] ? '' : obj[item.itemNumber] = true && data.push(item)
          return data;
          }, [])
          for (var j = 0; j < productNames.length; j++) {
            productData.push({
              batteries: 3,
              productEnglishName: productNames[j].name,
              dg: 0,
              hazardousMaterials: {},
              itemNumber:productNames[j].itemNumber
            });
          }
          this.$set(this.form, "productData", productData);
          this.$set(this.form, "slac", slac);
          this.$set(this.form, "totalWeight", totalWeight);
          this.$set(this.form, "totalVolume", totalVolume);
        });
      } else {
        this.changeInvolvedParties();
      }
    },
  },
};
</script>
