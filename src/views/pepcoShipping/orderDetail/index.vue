<template>
  <div class="app-container shipping-detail" style="width:100%; margin: 0 auto" v-loading="orderDetailLoading">
    <div style="text-align: right">
      <el-button icon="el-icon-download" type="primary" @click="downloadDetail" :loading="downloadDetailLoading">Download Detail</el-button>
    </div>
    <div>
      <span class="no-label" v-if="form.status==2">
        <el-tag type="warning" style="position: absolute; right: 5%; top: 6%; font-size: 18px;"> Rejected </el-tag>
      </span>

      <el-card style="padding: 15px;margin-bottom: 10px;margin-top: 10px;">
        <el-row>
          <el-col :span="showCheckBtn && (form.shipmentId == null || form.shipmentId == 0) && form.status == 0 ?  20 : 18">
            <div class="el-descriptions__title_css">
              <span style="margin-right: 10px;">{{form.soRef}}</span>
              <!-- <el-tag v-if="form.shipmentType == 'FCL'" v-for="(item, i) in form.containerDOList" :key="i + 'container'" style="margin-right: 10px"> {{
                item.type }} x {{ item.qty }} </el-tag> -->
            </div>
          </el-col>

          <!-- pepco Approval Criteria -->
          <el-col v-if="hasPepcoPermssion && (form.shipmentId == null || form.shipmentId == 0) && (form.status == 5 || form.status == 6)" :span="6">
            <el-button class="el-icon-check" type="success" @click="SAApprovedStatus(form.id, 4, null, form.soRef)"
              style="cursor: pointer; font-size: larger;"> SAApproved </el-button>
            <el-button :disabled="form.status == 6" class="el-icon-more" type="warning"
              @click="PepcoPendingStatus(form.id, 6, null, form.soRef)" style="cursor: pointer; font-size: larger;"> Pending </el-button>
            <el-button class="el-icon-close" style="cursor: pointer; font-size: larger;" type="danger"
              @click="pepcoCloseShipping()"> Reject </el-button>
          </el-col>

          <el-col v-if="showCheckBtn && (form.shipmentId == null || form.shipmentId == 0) && form.status == 0" :span="4">
            <el-button class="el-icon-check" type="success" @click="confirmAndAcceptedStatus(form.id, 1, null, form.soRef)"
              style="cursor: pointer; font-size: larger;"> Accept </el-button>
            <el-button class="el-icon-close" style="cursor: pointer; font-size: larger;" type="warning"
              @click="closeShipping()"> Reject </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="showCheckBtn && (form.shipmentId == null || form.shipmentId == 0) && form.status == 0 ?  20 : 18">
            <el-tag v-if="form.shipmentType == 'FCL'" v-for="(item, i) in form.containerDOList" :key="i + 'container'"
              style="margin-right: 10px"> {{ item.type }} x {{ item.qty }}
            </el-tag>
          </el-col>
        </el-row>
      </el-card>

      <!-- Approval Criteria edwin-->
      <el-card class="card-css" v-if="!this.approvalCriteria.isDraft">
        <div class="el-descriptions__title_css">Approval Criteria</div>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-row>
              <span style="margin-right: 10px;color:#004F7C;font-weight: bold;">Transport Mode</span>
              <el-tag v-if="this.approvalCriteria.transportMode == 0" type="success">Match</el-tag>
              <el-tag v-else type="danger">Not Match</el-tag>
            </el-row>
            <el-row>
              <span style="margin-right: 10px;">
                {{ freightMethodLabel }}
              </span>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row type="flex">
              <el-col :span="10">
                <span style="margin-right: 20px; color: #004F7C; font-weight: bold;">
                  PO POL / Booked POL
                </span>
                <el-tag v-if="approvalCriteria.pol == 0" type="success">Match</el-tag>
                <el-tag v-else-if="approvalCriteria.pol == 1" type="danger">Not Match</el-tag>
                <el-tag v-else-if="approvalCriteria.pol == 2 && acSelected" :type="acTagType">
                  {{ acTagLabel }}
                </el-tag>
              </el-col>
              <template v-if="approvalCriteria.pol == 2 && hasACPermssion">
                <el-col :span="6" >
                <el-select v-model="acSelected" placeholder="Select" style="width: 80px;" @change="handlePolChange">
                  <el-option label="Match" value="match" />
                  <el-option label="Not Match" value="notmatch" />
                </el-select>
              </el-col>
              </template>
            </el-row>
            <span style="margin-right: 20px;font-weight: blod;">{{this.poOriginPOL}} / {{form.originPort}}</span>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="card-css">
        <div class="el-descriptions__title_css">Order Details</div>
        <span style="margin-right: 10px;color:#004F7C;font-weight: blod;">{{ $t('booking.cargoReadyDate')
          }}:</span><span>{{ parseTime(form.cargoReadyForPickup) }}</span>
        <order-detail ref="orderDetail"
        :approvalCriteria="approvalCriteria"
        :shippingOrder="form"
        :hasPepcoPermssion="hasPepcoPermssion"
        @complete="handleComplete"
        @refreshPage="handleOrderRefresh"
        @orderDetailLoading="handleOrderDetailLoading"
        ></order-detail>
      </el-card>

      <!--增加预排船信息-->
      <el-card class="card-css">
        <div class="el-descriptions__title_css">Transport Plan</div>
          <el-tabs v-model="activeName"  @tab-click="handleClick(form)" :lazy="false">
            <el-tab-pane label="Transport Pre-assign" style="width: 100%" :name= "'first'">
              <!-- <pre-Assign ref="preAssignDetail" @complete="handlePreAssignComplete"></pre-Assign> -->
               <!-- 空运 -->
              <AirTransportPreAssign v-if="this.form.freightMethod == 'air'" :ref="'airPreAssign' + this.shippingOrderId"
                  :shippingOrderId="this.shippingOrderId" />


              <!-- sea-air -->
              <SeaAirTransportPreAssign v-if="this.form.freightMethod == 'sea_air'" :ref="'seaAirPreAssign' + this.shippingOrderId"
                  :shippingOrderId="this.shippingOrderId?this.shippingOrderId:0" 
                  source="detail"
                  />


              <!-- 海运 -->
              <pre-Assign v-else ref="preAssignDetail" @complete="handlePreAssignComplete"></pre-Assign>
            </el-tab-pane>
            <el-tab-pane label="Documents" :name= "'Documents' + form.id">
              <view-po-management-documents ref="viewPoManagementDocuments" ></view-po-management-documents>
            </el-tab-pane>
            <el-tab-pane label="Operation Log" :name="'Logs' + form.id">
              <el-timeline
                style="margin-top: 20px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
                <el-timeline-item
                  :timestamp="logs.userName + '   ' +formatUserLocalTime(logs.createTime, logs.timeZone, logs.timeZoneOffset)"
                  placement="top" v-for="(logs, x) in form.statusLogDOS" :key="x">
                  <h4>{{ covStatus(logs.status) }}</h4>
                  <div v-if="logs.status == 6">
                    <el-link type="primary"
                      :href="'/shipment/amendShipping?id=' + form.id + '&apId=' + logs.apId"
                      target="_blank">{{ form.soRef }}</el-link>
                  </div>
                  <div style="max-height: 200px;" v-html="logs.remark"></div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
      </el-card>



      <el-form v-loading="submitLoading" :model="form" :show-message="false" :disabled="isViewOnly" label-width="250px">

        <el-card class="card-css">
          <div class="el-descriptions__title_css">General Info</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title=""
            :column="5">
            <el-descriptions-item label="PO">
              {{form.customerRef}}
            </el-descriptions-item>
            <el-descriptions-item label="SO Type">
              {{form.shipmentType}}
            </el-descriptions-item>
            <!-- <el-descriptions-item :label="$t('booking.payment_term')">
              {{form.paymentTerm}}
            </el-descriptions-item> -->

            <!--add incoterm edwin-->
            <el-descriptions-item label="Incoterm">
              {{ incotermLabel }}
            </el-descriptions-item>

            <el-descriptions-item label="Named Place">
              {{ namedPlaceLabel }}
            </el-descriptions-item>

            <el-descriptions-item label="Shipper ref">
              {{form.shipperRef}}
            </el-descriptions-item>
            <el-descriptions-item label="BL Requested Type">
              {{form.blType}}
            </el-descriptions-item>

            <!--add transport mode edwin-->
            <el-descriptions-item label="Transport Mode">
              {{ freightMethodLabel }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <!-- <el-card class="card-css">
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
        </el-card> -->
        <el-card class="card-css">
          <div class="el-descriptions__title_css">{{ $t("booking.origin") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title=""
            :column="5">
            <el-descriptions-item :label="$t('booking.truckServices')">
              {{form.truckServices}}
            </el-descriptions-item>

            <el-descriptions-item :label="form.freightMethod === 'air'
              ? $t('booking.originAirport')
              : $t('booking.originPort')">
              {{ showPortLabel(form.originPort, form.freightMethod) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.originLocation')">
              {{form.originLocation}}
            </el-descriptions-item>

            <el-descriptions-item label-class-name="car-css" :label="$t('booking.needExportCustomServices')">
              {{form.needExportCustomerService}}
            </el-descriptions-item>

            <el-descriptions-item label="">
            </el-descriptions-item>

          </el-descriptions>

          <div class="el-descriptions__title_css">{{ $t("booking.destination") }}</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title=""
            :column="5">
            <el-descriptions-item :label="$t('booking.deliverServiceFromPodToFnd')">
              {{form.deliverServiceToFnd}}
            </el-descriptions-item>
            <!-- <el-descriptions-item :label="$t('booking.destinationPort')">
              {{showPortLabel(form.destinationPort)}}
            </el-descriptions-item> -->
            <el-descriptions-item :label="form.freightMethod === 'air'
              ? $t('booking.destinationAirport')
              : $t('booking.destinationPort')">
              {{ showPortLabel(form.destinationPort, form.freightMethod) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.dc')">
              {{form.dc}}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.destinationLocation')">
              {{form.destinationLocation}}
            </el-descriptions-item>
            <el-descriptions-item label="">
            </el-descriptions-item>
            <!-- <el-descriptions-item label="">
            </el-descriptions-item> -->
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Booking Contact Info</div>
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title=""
            :column="3">
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
          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical" class="margin-top" title=""
            :column="3">
            <el-descriptions-item label="Shipper">
              {{ decodeHtmlEntities(form.shipperCompany) }}
            </el-descriptions-item>
            <el-descriptions-item label="Consignee">
              {{ decodeHtmlEntities(form.consigneeCompany) }}
            </el-descriptions-item>
            <el-descriptions-item label="Notify">
              {{ decodeHtmlEntities(form.notifyCompany) }}
            </el-descriptions-item>
            <el-descriptions-item label="">
              <div v-html="form.shipperAddress" style="white-space:pre-wrap" />
            </el-descriptions-item>
            <el-descriptions-item label="">
              <div v-html="form.consigneeAddress" style="white-space:pre-wrap" />
            </el-descriptions-item>
            <el-descriptions-item label="">
              <div v-html="form.notifyAddress" style="white-space:pre-wrap" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="card-css">
          <div class="el-descriptions__title_css">Products</div>

          <el-descriptions style="box-shadow: none;" :colon="false" direction="vertical"
            v-for="(item, i) in form.productDOList" :key="i" class="margin-top" title="" :column="3">
            <el-descriptions-item label="Mark&Numbers">
              <el-input
                type="textarea"
                :rows="3"
                :value="item.markNumbers"
                readonly
                resize="none"
                style="border: none; background: transparent"
              />
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              <el-input
                type="textarea"
                :rows="3"
                :value="item.productEnglishName"
                readonly
                resize="none"
                style="border: none; background: transparent"
              />
            </el-descriptions-item>
            <el-descriptions-item label="Product Chinese Name">
              <el-input
                type="textarea"
                :rows="3"
                :value="item.productChineseName"
                readonly
                resize="none"
                style="border: none; background: transparent"
              />
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>

            <el-descriptions-item :label="$t('booking.hsCode')">{{item.hscode}}</el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">{{item.numberOfPackages}}</el-descriptions-item>
            <el-descriptions-item label="Packages">{{showPackages(item.packages)}}</el-descriptions-item>
            <el-descriptions-item label="Gross Weight(KG)">{{item.grossWeight}}</el-descriptions-item>
            <el-descriptions-item label="Volume(CBM)">{{item.volume}}</el-descriptions-item>
            <el-descriptions-item label="Batteries">
              <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                <el-radio :label="2" border>Has batteries</el-radio>
                <el-radio :label="3" border>No batteries</el-radio>
              </el-radio-group>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
              <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg"
                active-text="Yes" inactive-text="No">
              </el-switch>
            </el-descriptions-item>

            <el-descriptions-item :label="dict.label"
              v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value"
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
            <el-descriptions-item v-if="item.dg == 0" label="">
            </el-descriptions-item>

            <el-descriptions-item label="">
              <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
                <el-col :span="8"> Remark</el-col>
                <el-col :span="6">Files</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" style="min-height: 32px;">
                  {{item.remark}}
                </el-col>
                <el-col :span="6">
                  <el-upload style="margin-top: -30px;" class="upload-demo" :ref="'upload' + i" multiple
                    :action="url + '/admin-api/shipment/product/upload'" :data="item.uploadData"
                    :on-preview="handlePreview" :headers="uploadHeaders" :on-success="handleSuccess"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.files = files}, () => {item.files = [];item.uploadData = {}})"
                    :file-list="item.files" :auto-upload="false">
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
              <font color="#FF0000" v-show="flag">*</font>{{ flag ? "Temperature(°C)" : "" }}
            </el-col>
            <el-col :span="3">
              <font color="#FF0000" v-show="flag"></font>{{ flag ? "Humidity(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>{{ flag ? "O2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>{{ flag ? "CO2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>{{ flag ? "Drains" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000">*</font>SOC
            </el-col>
          </el-row>


          <div style="margin-bottom: 5px" v-for="(item, i) in form.containerDOList" :key="item.id || 'container-' + i"
            class="shipmentRouters-css">
            <el-row :gutter="20">
              <el-col :span="2">
                <el-form-item required label-width="0px" :prop="'containerDOList.' + i + '.type'">
                  <el-select filterable placeholder="" v-model="item.type" @change="handleOptionChange">
                    <el-option v-for="opt in containerOptions" :label="opt.type" :value="opt.type"
                      :key="opt.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item required label-width="0px" :prop="'containerDOList.' + i + '.qty'">
                  <el-input-number :controls="false" :precision="0" v-model="item.qty" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px"
                  v-show="item.type &&containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'">
                  <el-input v-model="item.ventClosedOrNot" />
                </el-form-item>
                <span
                  v-show="(item.type && containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&flag) ||(!item.type && flag)">&nbsp;</span>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px"
                  v-show="item.type &&containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                  :required="item.type &&
                containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'"
                  :prop="'containerDOList.' + i + '.requireTemperature'">
                  <el-input v-model="item.requireTemperature" />
                </el-form-item>
                <span v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              ">&nbsp;</span>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.humidity" />
                </el-form-item>
                <span v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              ">&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.o2" />
                </el-form-item>
                <span v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              ">&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'
              ">
                  <el-input v-model="item.co2" />
                </el-form-item>
                <span v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              ">&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item label-width="0px" v-show="
                item.type &&
                containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer == 'Yes'
              ">
                  <el-select v-model="item.drains">
                    <el-option label="Open" value="Open">
                    </el-option>
                    <el-option label="Close" value="Close">
                    </el-option>
                  </el-select>

                </el-form-item>
                <span v-show="
                (item.type &&
                  containerOptions.find((obj) => obj.type == item.type)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.type && flag)
              ">&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-switch v-model="item.soc" active-text="Yes" inactive-text="No">
                </el-switch>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card v-show="form.shipmentId != null && form.shipmentType=='FCL'&& siList"
          class="card-css">
          <el-scrollbar>
            <!-- default-expand-all -->
            <el-table border :data="siForm.containers" style="width: 100%;" default-expand-all>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div style="margin-left:50px">
                    <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                      :colon="false" direction="vertical" v-for="(item, index) in scope.row.productData"
                      :key="'product' + index" class="margin-top" title="" :column="7">
                      <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                          :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"
                            v-model="item.productEnglishName" maxlength="500" show-word-limit
                            placeholder="Must Input English Product Name"
                            @input="item.productEnglishName = filterChinese(item.productEnglishName)" />
                        </el-form-item>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''">
                        <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                          :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                          <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode"
                            placeholder="Input to select" @change="selectBlur(item)">
                            <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode"
                              :value="dict.hsCode" />
                          </el-select>
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
                            <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                              :label="dict.label" :value="dict.value" />
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
              <el-table-column label="Tare Weight(KG)">
                <template v-slot="scope">
                  {{scope.row.tareWeight}}
                </template>
              </el-table-column>
               <el-table-column label="VGM(KG)">
                <template v-slot="scope">
                 <div>{{ sumVGM(scope.row).toFixed(3) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="FCL/LCL">
                <template v-slot="scope">
                  {{scope.row.packageMethod}}
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
        <el-card v-show="fileTableData.length > 0" class="card-css">
          <div>
            <div class="el-descriptions__title_css">Documents(Manifest,ICS2,etc)</div>
          </div>
          <el-divider></el-divider>
          <el-card class="box-card" style="margin-bottom: 10px;margin-right: 10px;margin-top: 10px;"
            v-show="fileTableData.length > 0">
            <div v-for="file in fileTableData" class="text-upload inline-item" size="mini"
              style="width: 400px;padding-right: 10px;">
              <div class="tools-but">
                <ActionButton :url='file.fileUrl' iconType="el-icon-view" type='preview' :fileName='file.fileName' buttonType="text" />
                <ActionButton :url='file.fileUrl' iconType="el-icon-download" type='download' :fileName='file.fileName' buttonType="text" />
                <!-- <el-button type="text" :disabled="false" @click="handlePreviewByOrder(file)" icon="el-icon-download"
                  style="margin-right: 6px"></el-button> -->
              </div>
              <el-descriptions :colon="false" :column="1" label-class-name="file-item-label"
                style="box-shadow:none;margin-bottom:10px">
                <el-descriptions-item :label="$t('document.name')">{{ file.fileName }}</el-descriptions-item>
                <el-descriptions-item label="Order Number">{{ file.poNumber }}</el-descriptions-item>
                <el-descriptions-item label="Document Type">{{ file.typeCode=='11'?'ICS2':file.typeCode=='12'?'Manifest':file.typeCode=='13'?'etc':'' }}</el-descriptions-item>
                <el-descriptions-item label="Document Number">{{ file.documentNumber }}</el-descriptions-item>

              </el-descriptions>
            </div>
          </el-card>

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
          <div v-for="(file,index) in bookingNoteListShow" :key="index"
            style="cursor: pointer;width: 30%;margin-right: 10px;">
            <div @click="handlePreview(file)">{{ file.name }}</div>
          </div>
        </el-card>
      </el-form>
      <order-comment ref="orderComment" :order-id="shippingOrderId" order-type="2" style="margin-bottom: 20px;margin-top: 20px;" />

      <!-- <el-row style="text-align: center; padding: 20px;"  v-if="showCheckBtn&&form.shipmentId == null && form.status == 0">
        <el-col>
          <el-button class="el-icon-check" type="success" @click="acceptedStatus(form.id, 1, null, form.soRef)" style="cursor: pointer; font-size: larger;"> Accept </el-button>
          <el-button class="el-icon-close" style="cursor: pointer; font-size: larger;" type="warning" @click="closeShipping()"> Reject </el-button>
        </el-col>
      </el-row> -->

      <el-dialog title="Rejected" :visible.sync="showCloseRemark" width="70%" append-to-body>
        <el-form label-width="0px" ref="closeShippingForm" :model="closeShippingForm" :show-message="false">
          <el-form-item label="" required prop="closeRemark">
            <el-input type="textarea" :rows="5"  maxlength="400" show-word-limit placeholder="Remark..." v-model="closeShippingForm.closeRemark">
            </el-input>
          </el-form-item>
          <el-button size="mini" type="primary" style="float:right;" :loading="closeShippingLoading"
            @click="submitCloseShipping">
            {{ $t("purchaseOrder.confirm") }}
          </el-button>
          <el-button size="mini" style="float:right; margin-right: 10px;" :loading="closeShippingLoading"
            @click="showCloseRemark = false">
            {{ $t("purchaseOrder.cancel") }}
          </el-button>
        </el-form>
      </el-dialog>

      <!--Pepco Rejected form edwin -->
      <el-dialog title="Pepco Rejected" :visible.sync="showPepcoCloseRemark" width="70%" append-to-body>
        <el-form  ref="closeShippingForm" :model="closeShippingForm" :rules="rules"
                  :show-message="false" :inline="false">
          <el-form-item label="Reason description" :label-width="'150px'" required prop="selectedReason">
            <el-select v-model="closeShippingForm.selectedReason" placeholder="Select Reason"
                       @change="handleReasonChange">
              <el-option v-for="reason in sOApprovalRejectingReasons" :label="reason.value + ' - ' + reason.label" :value="reason.value" :key="reason.value" />
            </el-select>
          </el-form-item>
          <div style="margin: 20px 0;"></div>
          <el-form-item label="Remark" :label-width="'150px'"  prop="closeRemark">
            <el-input type="textarea" :rows="5"   maxlength="400" show-word-limit  placeholder="Remark..."
                      v-model="closeShippingForm.closeRemark"></el-input>
          </el-form-item>
          <el-button size="mini" type="primary" style="float:right;" :loading="closeShippingLoading"
            @click="submitPepcoCloseShipping">
            {{ $t("purchaseOrder.confirm") }}
          </el-button>
          <el-button size="mini" style="float:right; margin-right: 10px;" :loading="closeShippingLoading"
            @click="showPepcoCloseRemark = false">
            {{ $t("purchaseOrder.cancel") }}
          </el-button>
        </el-form>
      </el-dialog>

      <!-- </el-card> -->
    </div>
  </div>
</template>

<script>
  import { DICT_TYPE, getDictDatas } from "@/utils/dict";
  import { getUserProfile,getUserCompanyTypeList } from "@/api/system/user";
  import { getApprovalRejectingReasons } from "@/api/system/enums/pepco/enums";
  import { exportOrderDetail, getOrder } from '@/api/shipping/order'
  import {
    updateShippingOrderStatus,
    getShippingCriteria,
    updateSoCriteriaPol,
    updateShippingOrderStatusToSaApproved,
    isNeedManualAdjust,
    exportOrderListExcel
  } from '@/api/pepco/shipping-order'
  import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'
  import request, { getBaseHeader } from "@/utils/request";
  import { getProductList } from "@/api/system/product";
  import { getContainerList } from "@/api/system/container";
  import { getOriginDeliveryList } from "@/api/system/originDelivery";
  import viewPoManagementDocuments from "@/views/purchaseOrder/pepco/components/view-po-management-documents.vue";
  import { getList } from "@/api/shipment/shipment";
  import { getHeaderPageForPepco } from "@/api/order/header";
  import { getDeptList } from "@/api/system/dept";
  import OrderDetail from '@/views/pepcoShipping/commponents/order-detail.vue'
  import PreAssign from '@/views/pepcoShipping/orderDetail/components/pre-assign.vue'
  import  AirTransportPreAssign  from './components/AirTransportPreAssign.vue'
  import { getPepcoOrderFileByOrder } from '@/api/order/task'
  import {getAccessToken} from "@/utils/auth";
  import { fileLoadMixin } from '@/utils/fileLoadMixin'
  import { parseTime, parseUTCTime } from '@/utils/ruoyi'
  import { getAirportList } from '@/api/air/airport'
import OrderComment from '@/views/components/order-comment/index.vue'
  import SeaAirTransportPreAssign from '@/views/pepcoShipping/orderList/components/SeaAirTransportPreAssign.vue'

  // 预定义的MIME类型映射
  const MIME_TYPES = {
    // Documents
    pdf: 'application/pdf',
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',

    // Microsoft Office
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    webp: 'image/webp',

    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // Audio/Video
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',

    // Programming
    json: 'application/json',
    xml: 'application/xml',
    js: 'application/javascript',
    css: 'text/css'
  };
  export default {
    name: "Pepco Shipping Order Detail",
    mixins: [fileLoadMixin],
    components: { OrderDetail, PreAssign , viewPoManagementDocuments, OrderComment , AirTransportPreAssign , SeaAirTransportPreAssign},
    data() {
      return {
        shippingOrderId: this.$route.query.id,
        siList:[],
        originOptions: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          }
        ],
        loadingSaveBut:false,
        form: {
          containers: [{ containers: "" }],
          productData: [],
          productDOList: [],
          phone: "",
          email: "",
          remark:'',
          freightMethod:''
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
        orderIndex:0,
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
        airportList: [],
        downloadDetailLoading: false,
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
        showPepcoCloseRemark: false,
        closeShippingLoading:false,
        closeShippingForm:{
          closeRemark : '',
          selectedReason: ''
        },
        showCloseBut:true,
        showPepcoCloseBut: true,
        showCheckBtn:false,
        shippedContainer:{},
        siForm:{
          containers: []
        },
        containerTypeList:[],
        bookingNoteListShow: [],
        shipment: {},
        tableData:[],
        orderQueryParams: {
          pageNo: 1,
          pageSize: 20,
          prop: '',
          orderBy: '',
          orderNumber:''
        },
        tableHeight: 0,
        loading: true,
        orderNumberMap: {},
        itemQueryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        bookingNameMap: {},
        productMap: {},
        loadingMap: {},
        taskList: [],
        hiddenTask: false,
        preBookMap: {},
        user:{},
        // approval criteria
        acSelected: '',
        // po 中 的pol
        poOriginPOL: '',
        approvalCriteria: {
          // 判断是不是草稿
          isDraft : false,
          shippingOrderId: 0,
          transportMode: 0,
          pol: 0,
          crdMap: {},
          tcQuantitiesMap: {}
        },
        // 用于更新approvalCriteriaData
        approvalCriteriaData: {
          soId: 0,
          value: 0
        },
        userCompanyTypeList: [],
        // SOApprovalRejectingReasons
        // sOApprovalRejectingReasons: [],
        rules: {
          selectedReason: [
            { required: true, message: 'Please select a reason', trigger: 'change' }
          ],
          closeRemark: [
            { max: 400, message: 'Remark cannot exceed 400 characters', trigger: 'blur' }
          ]
        },
        // 是否具有approval criteria筛选框的权限
        hasACPermssion: false,
        // 是否具有approval criteria的approval pending rejected的权限
        hasPepcoPermssion: false,
        shipmentContainerList: [],
        fileTableData: [],
         // 添加saApproved按钮的加载状态
        saApprovedButtonLoading: false,
        // 添加sostatus按钮的加载状态
        updateSoStatusLoading: false,
        // 是否展示预排船计划
        isShowPreAssignTable : false,
        activeName: "first",
        orderDetailLoading: false,
      };
    },
    computed: {
      // approval criteria tag type
      acTagType() {
        if (this.acSelected === 'match') return 'success'
        if (this.acSelected === 'notmatch') return 'danger'
        return ''
      },
      acTagLabel() {
        if (this.acSelected === 'match') return 'Match'
        if (this.acSelected === 'notmatch') return 'Not Match'
        return ''
      },
      // transport mode label edwin
      freightMethodLabel() {
        const dict = this.getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO).find(
          item => item.value === this.form.freightMethod
        );
        return dict ? dict.label : 'SEA';
      },
      // Incoterm label edwin
      incotermLabel() {
        const dict = this.getDictDatas(DICT_TYPE.SHIPPING_INCOTERM).find(
          item => item.value === this.form.incoterm
        );
        return dict ? dict.label : '';
      },
      // Named Place label
      namedPlaceLabel() {
        const dict = this.getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE).find(
          item => item.value === this.form.namedPlace
        );
        return dict ? dict.label : '';
      },
      fileExtension() {
        return this.fileName?.split('.').pop().toLowerCase() || '';
      },
      sOApprovalRejectingReasons() {
        console.log('获取字典pepco_reject',DICT_TYPE.PEPCO_REJECTED_REASON_CODE);
        console.log('获取字典pepco_reject',this.$store.getters.dict_datas);
        return this.$store.getters.dict_datas[DICT_TYPE.PEPCO_REJECTED_REASON_CODE]
      },
      isDraftOrder() {
        return this.form.status == -1 || this.form.status == '-1'
      },
      isViewOnly() {
        return !this.isDraftOrder
      }
    },
    mounted() {
      if(this.activeName.startsWith('Documents')) {
        this.$nextTick(() => {
          this.$refs.viewPoManagementDocuments.getFileByShippingOrderId(this.$route.query.id)
        })
      }
    },
    created() {
      this.uploadHeaders = {
        Authorization: "Bearer " + getAccessToken()
      }
      // if (this.$route.query.source != 'shipping-order') {
      //   this.showCheckBtn = true;
      // }
      // getUserProfile().then((response) => {
      //   this.user = response.data
      //   console.log('user:',this.user)
      //   this.user.roles.forEach(element => {
      //     console.log('element11:',element)
      //     if(element.name.includes('OHA')){
      //       this.showCheckBtn = true
      //     }
      //   });
      // });
      getUserCompanyTypeList().then(response => {
      console.log('获取用户所在的公司类型列表')
      console.log(response.data)
      this.userCompanyTypeList = response.data
      if (this.userCompanyTypeList.includes('OHA')) {
        console.log('OHA公司类型')
        this.showCheckBtn = true
        // 判断是否可以去选择approval criteria中的pol
        this.hasACPermssion = true
      }
      if (this.userCompanyTypeList.includes('PEPCO')) {
        // 是否具有approval criteria的approval pending rejected的权限
        this.hasPepcoPermssion = true
      }

    })
      getContainerList().then((response) => {
        this.containerOptions = response.data;
        this.handleOptionChange();
      });
      getOrder( this.$route.query.id ).then(response=>{
        this.form = { ...this.form, ...response.data }
        if (this.form.productDOList && this.form.productDOList.length) {
          this.form.productDOList.forEach(item => {
            item.dg = item.dg ? 1 : 0
            if (typeof item.hazardousMaterials === 'string') {
              try {
                item.hazardousMaterials = JSON.parse(item.hazardousMaterials || '{}')
              } catch (e) {
                item.hazardousMaterials = {}
              }
            } else if (!item.hazardousMaterials) {
              item.hazardousMaterials = {}
            }
          })
        }
        console.log('order info detail',this.form)
        console.log('传来的orderRef:', this.form.customerRef)
            // 根据shipperOrder customerRef 的对应单号，查询po数据
          this.orderQueryParams.orderNumber = this.form.customerRef
          console.log('查询order的参数:',  this.orderQueryParams)
          // this.getHeaderPage();
          this.handleOrderDetail()
          this.handlePreAssign()

        // -1 DRAFT 说明当前是草稿 edwin
        if(this.form.status == '-1' || this.form.status == -1){
          this.approvalCriteria.isDraft = true
          const source = this.$route.query.source ? `&source=${this.$route.query.source}` : ''
          this.$router.replace(`/shipment/updatePpShippingOrder?id=${this.form.id}${source}`)
          return
        }
        if (response.data.containerDOList && response.data.containerDOList.length) {
          this.$set(
            this.form,
            'containerDOList',
            this.normalizeContainerDOList(response.data.containerDOList.filter((item) => item.type != 0))
          )
        }
        this.$nextTick(() => {
          this.handleOptionChange()
        })
        this.bookingNoteListShow = response.data.files;

        if(response.data.shipmentContainerDOList != null && response.data.shipmentContainerDOList.length>0){
          var shipmentContainerList = response.data.shipmentContainerDOList;

          this.form.containerDOList = this.normalizeContainerDOList(
            (response.data.containerDOList || []).filter((item) => item.type != 0)
          )


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
        }

        console.log('this.from:',this.form)
        if(this.form.shipmentId!=null && this.form.freightMethod ==='sea') {
          getList({ ids: this.form.shipmentId }).then((response1) => {
            for (var i = 0; i < response1.data.length; i++) {
              this.shipment = response1.data[i]
            }

            console.log(this.shipment.originPort)
            console.log(this.shipment.sinotrans)
            if (response.data && response.data.shipmentProductDOList) {
              var res = []
              var products = response.data.shipmentProductDOList
              if (products.filter((item) => item.type == 1).length > 0) {
                this.siList = products.filter((item) => item.type == 1&& item.containerId);
              } else if (products.filter((item) => item.type == 4).length > 0) {
                this.siList = products.filter((item) => item.type == 4 && item.containerId);
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
              this.siForm.containers = res
            }


            console.log(this.siForm.containers, "--------------");
          });
        }



      }).then((response) => {
        // 如果是草稿，则不需要approvalCriteria
        if (!this.approvalCriteria.isDraft) {
          // 获取shipping order approval criteria edwin
          getShippingCriteria({ orderHeaderId: this.form.id }).then((res) => {
            console.log('approvalCriteria:', res.data)
            this.approvalCriteria = {
              shippingOrderId: res.data.shippingOrderId,
              transportMode: res.data.transportMode,
              pol: res.data.pol,
              crdMap: Array.isArray(res.data.crdList) ? res.data.crdList.reduce((acc, cur) => {
                acc[cur.refId] = cur.value;
                return acc;
              }, {}) : {},
              tcQuantitiesMap: Array.isArray(res.data.tcQuantities) ? res.data.tcQuantities.reduce((acc, cur) => {
                acc[cur.refId] = cur.value;
                return acc;
              }, {}) : {},
              artStructureMap: Array.isArray(res.data.artStructureList) ? res.data.artStructureList.reduce((acc, cur) => {
                acc[cur.refId] = cur.value;
                return acc;
              }, {}) : {},
            }
          })
        }
      })
      console.log('this.approvalCriteria', this.approvalCriteria)


      getOriginDeliveryList().then((res)=>{
        this.portList=res.data
      })

      this.calcTableHeight();

    // getApprovalRejectingReasons().then((respone) => {
    //   this.sOApprovalRejectingReasons = respone.data
    // })


  },
  methods: {
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
    getPepcoOrderFileByOrder(ids) {
      if(ids.length==0) return;
      var query = {
        orderIds: ids,
        taskCode: 'Shipper_Booking',
      }
      getPepcoOrderFileByOrder(query).then((res) => {
        console.log(res)
        this.fileTableData = res.data.filter(item => ['11', '12', '13'].includes(item.typeCode));
        console.log(this.fileTableData)
      })
    },
    covStatus(status) {
      if (status == -1) {
        return 'Draft'
      } else if (status == 0) {
        return 'Requested'
      } else if (status == 1) {
        return 'MOOV-OHA accepted booking'
      } else if (status == 2) {
        return 'MOOV-OHA Rejected'
      } else if (status == 3) {
        return 'Cancel'
      } else if (status == 4) {
        return 'SAApproved'
      } else if (status == 5) {
        return 'Awaiting Pepco booking approval'
      } else if (status == 6) {
        return 'Pepco Pending'
      } else if (status == 7) {
        return 'Pepco Rejected'
      }
    },
    handleClick(item) {
      if(this.activeName.startsWith('Documents') ){
        console.log('item.shippingOrderId', item.id)
        this.$refs.viewPoManagementDocuments.getFileByShippingOrderId(item.id)
      }
            // 添加 Transport Pre-assign 的处理 - zane
      if (this.activeName.startsWith('first') && this.form.freightMethod === 'air') {
        this.$nextTick(() => {
          const ref = this.$refs['airPreAssign' + this.shippingOrderId];
          if (ref && ref.length > 0) {
            // 重置 hasLoaded 并重新加载
            ref[0].refresh();
          } else if (ref && ref.refresh) {
            ref.refresh();
          }
        });
      }
    },
    decodeHtmlEntities(text) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
    },

    downloadDetail(){
      this.downloadDetailLoading = true
      const orderDetailList = [...this.$refs.orderDetail.lines]
      for (let row of orderDetailList) {
        row.differs01 = ((row.bookedInner - row.orderedInner) / row.orderedInner * 100).toFixed(2)
        row.differs02 = ((row.bookedPieces - row.orderedPieces) / row.orderedPieces * 100).toFixed(2)
        row.dcDate = parseUTCTime(row.dcDate)
        row.plannedCrd = parseUTCTime(row.plannedCrd)
        row.supplierCrd = parseUTCTime(row.supplierCrd)
        row.cargoHandoverDate = parseUTCTime(row.cargoHandoverDate)
        row.approvalCriteriaCRD = this.approvalCriteria.crdMap[row.orderId] === 0 ? 'Match' : 'Not Match'
        row.approvalCriteriaTCQTY = this.approvalCriteria.tcQuantitiesMap[row.id] === 0 ? 'Match' : 'Not Match'
        row.childrenToy = this.approvalCriteria.artStructureMap[row.id] === 0 ? 'No' : 'Yes'
        if(row.bookedProInnerPerOuter === 0){
          row.bookedInner = '-'
        }
      }
      const prdList = this.form.productDOList
      for (let prd of prdList) {
        prd.batteriesFlag = prd.batteries == 2 ? 'Has batteries' : prd.batteries == 3 ? 'No batteries' : ''
        prd.dg = prd.dg == 1 ? 'Yes' : 'No'
      }
      const containerList = this.form.containerDOList
      for(let container of containerList){
        container.soc = container.soc == 1 ? 'Yes' : 'No'
      }
      let statusLabel = ''
      const status = this.form.status
      if(status === 0){
        statusLabel = 'MOOV-OHA Pending'
      }else if(status === 1){
        statusLabel = 'MOOV-OHA Accepted'
      }else if(status === 2){
        statusLabel = 'MOOV-OHA Rejected'
      }else if(status === 4){
        statusLabel = 'SAApproved'
      }else if(status === 5){
        statusLabel = 'Awaiting Approval'
      }else if(status === 6){
        statusLabel = 'Pepco Pending'
      }else if(status === 7){
        statusLabel = 'Pepco Rejected'
      }
      const detailSumData = this.$refs.orderDetail.sumData
      // 导出数据
      exportOrderDetail({
        mainData: {
          ...this.form,
          orderedOuterSum: detailSumData[4],
          bookedOuterSum: detailSumData[5],
          orderedInnerSum: detailSumData[6],
          bookedInnerSum: detailSumData[7],
          volumeSum: detailSumData[9],
          grossWeightSum: detailSumData[10],
          orderedPiecesSum: detailSumData[11],
          bookedPiecesSum: detailSumData[12],
          incotermLabel: this.incotermLabel,
          namedPlaceLabel: this.namedPlaceLabel,
          poOriginPOL: this.poOriginPOL,
          statusLabel: statusLabel,
          transportModeMatch: this.approvalCriteria.transportMode === 0 ? 'Match' : 'Not Match',
          freightMethodLabel: this.freightMethodLabel,
          originPortLabel: this.showPortLabel(this.form.originPort,this.form.freightMethod),
          destinationPortLabel: this.showPortLabel(this.form.destinationPort,this.form.freightMethod),
          poPolBookedPolMatch: this.approvalCriteria.pol === 0 ? 'Match' : this.approvalCriteria.pol === 1 ? 'Not Match' : (this.approvalCriteria.pol === 2 && this.acSelected) ? this.acTagLabel : '',
          cargoReadyForPickup : parseTime(this.form.cargoReadyForPickup)
        },
        containerList: containerList,
        productList: this.form.productDOList,
        orderDetails: orderDetailList
      }).then(response => {
        this.downloadDetailLoading = false
        this.$download.excel(response, `PepcoShipperBookingDetail-${this.form.soRef}-${new Date().getTime()}.xlsx`)
      })
    },
    // showPortLabel(val) {
    //   for (var c = 0; c < this.portList.length; c++) {
    //     if (this.portList[c].code == val) {
    //       return this.portList[c].name
    //     }
    //   }
    // },
        // 增加机场列表
    getAirportListData() {
      getAirportList().then(response => {
        this.airportList = response.data
      })
    },
    showPortLabel(val, freightMethod) {
      const list = freightMethod === 'air'
        ? this.airportList
        : this.portList

      const target = list.find(item => item.code === val)
      return target ? target.name : val
    },
    totalVolum() {
      try {
        const containers = this.siForm?.containers || [];
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : [];
          return sum + productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.numberOfPackages) || 0);
          }, 0);
        }, 0);
      } catch (error) {
        console.error('计算总重量出错:', error);
        return 0; // 确保即使出错也有返回值
      }
    },
    totalCBM() {
      try {
        const containers = this.siForm?.containers || [];
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : [];
          return sum + productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.volume) || 0);
          }, 0);
        }, 0);
      } catch (error) {
        console.error('计算总重量出错:', error);
        return 0; // 确保即使出错也有返回值
      }
    },
    totalWeight() {
      try {
        const containers = this.siForm?.containers || [];
        return containers.reduce((sum, container) => {
          const productData = Array.isArray(container?.productData) ? container.productData : [];
          return sum + productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.grossWeight) || 0);
          }, 0);
        }, 0);
      } catch (error) {
        console.error('计算总重量出错:', error);
        return 0; // 确保即使出错也有返回值
      }
    },
    showPackages(value) {
      var item = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
      for (var c = 0; c < item.length; c++) {
        if (item[c].value == value) {
          return item[c].label
        }
      }
    },
    async closeShipping() {
      console.log('closeShipping', this.form.id)
      // 判断是不是hold
      // hold
      const resOrder = await getOrderHeadersList({ shippingOrderIds: [this.form.id].join(',') })
      console.log('返回值', resOrder.data)
      for (var item of resOrder.data) {
        if (item.status == '2') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold');
          return
        }
        if (item.status == '1') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled');
          return
        }
      }
      this.showCloseRemark = true
      this.showCloseBut = true
    },

    pepcoCloseShipping() {
      this.showPepcoCloseRemark = true
      this.showPepcoCloseBut = true
    },
    submitPepcoCloseShipping() {
      this.$refs["closeShippingForm"].validate((valid) => {
        if (valid) {
          this.closeShippingLoading = true
          this.updateStatus(this.form.id, 7, this.closeShippingForm.closeRemark)
        }
      })
    },
    submitCloseShipping() {
      this.$refs["closeShippingForm"].validate((valid) => {
        if (valid) {
          this.closeShippingLoading = true
          this.updateStatus(this.form.id, 2, this.closeShippingForm.closeRemark)
        }
      })
    },
    // 处理 pepco 拒绝理由
    handleReasonChange(reason) {
      if (reason) {
        console.log('选择rejected_code',reason);
        const selectedReasonObj = this.sOApprovalRejectingReasons.find(x => x.value === reason);
        console.log('selectedReasonObj:',selectedReasonObj);
        if (selectedReasonObj) {
          this.closeShippingForm.selectedReason = selectedReasonObj.label;
          this.closeShippingForm.closeRemark = `${selectedReasonObj.value}- ${selectedReasonObj.label}`;
        }
        // this.closeShippingForm.selectedReason = reason.label;
        // this.closeShippingForm.closeRemark = `${reason.code}- ${reason.reason}- ${reason.description}`;
      } else {
        this.closeShippingForm.closeRemark = '';
      }
    },
    SAApprovedStatus(id, status, rejectedText, soRef) {
      var vm = this
      this.$confirm('SAApproved ' + soRef + '?', '', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        vm.updatePepcoStatus(id, status, rejectedText)
      }).catch(() => {
      });
    },
    updatePepcoStatus(id, status, rejectedText) {
      if(this.saApprovedButtonLoading) return
      this.saApprovedButtonLoading = true
      updateShippingOrderStatusToSaApproved({ id: id, status: status, rejectedText: rejectedText }).then(res => {
        this.closeShippingLoading = false
        this.saApprovedButtonLoading = false
        this.$notify({
          title: 'Success',
          message: 'Success',
          type: 'success'
        });
        this.$router.push("/shipment/ppShippingOrderList")
      }).catch(() => {
        this.saApprovedButtonLoading = false
      });
    },

    PepcoPendingStatus(id, status, rejectedText, soRef) {
      var vm = this
      this.$confirm('Pepco Pending ' + soRef + '?', '', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        vm.updateStatus(id, status, rejectedText)
      }).catch(() => {
      });
    },

    // 更新状态前先确认是否可以进行更新
    async confirmAndAcceptedStatus(id, status, rejectedText, soRef){
      this.beforeConfirmUpdateStatus(id).then(res => {
        console.log("res", res.data)
        if (res.data) {
          this.$message.error('Please select match or not for POL from PO and shipper`s booking!');
          return;
        }else{
          // 判断是不是hold
          // hold
          getOrderHeadersList({ shippingOrderIds: [this.form.id].join(',') }).then(resOrder => {
            console.log('返回值', resOrder.data)
            for (var item of resOrder.data) {
              if (item.status == '2') {
                this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold');
                return
              }
              if (item.status == '1') {
                this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled');
                return
              }
            }
            this.acceptedStatus(id, status, rejectedText, soRef)
          })
        }
      })
    },
    // 在update status 前增加限制操作 edwin
    beforeConfirmUpdateStatus(id){
      return this.needManualAdjust(id);
    },
    // 是否需要人工调整
    needManualAdjust(id) {
      return isNeedManualAdjust({ orderHeaderId: id })
    },

    acceptedStatus(id, status, rejectedText, soRef) {
      var vm = this
      this.$confirm('Accepted ' + soRef + '?', '', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        vm.updateStatus(id, status, rejectedText)
      }).catch(() => {
      });
    },

    updateStatus(id, status, rejectedText) {
      if(this.updateSoStatusLoading) return
      this.updateSoStatusLoading = true
      updateShippingOrderStatus({ id: id, status: status, rejectedText: rejectedText }).then(res => {
        this.closeShippingLoading = false
        this.updateSoStatusLoading = false
        this.$notify({
          title: 'Success',
          message: 'Success',
          type: 'success'
        });
        this.$router.push("/shipment/ppShippingOrderList")
      }).catch(() => {
        this.updateSoStatusLoading = false
      });
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
      const containerList = this.form.containerDOList || this.form.containers || [];
      for (var i = 0; i < containerList.length; i++) {
        if (arr.indexOf(containerList[i].type) > -1) {
          flag = true;
          break;
        }
      }
      this.flag = flag;
    },
    normalizeContainerDOList(containers) {
      if (!containers || !containers.length) {
        return []
      }
      return containers.map(c => ({
        id: c.id,
        soId: c.soId,
        type: c.type != null ? String(c.type) : '',
        qty: c.qty != null ? Number(c.qty) : null,
        ventClosedOrNot: c.ventClosedOrNot != null ? String(c.ventClosedOrNot) : '',
        requireTemperature: c.requireTemperature != null ? String(c.requireTemperature) : '',
        humidity: c.humidity != null ? String(c.humidity) : '',
        o2: c.o2 != null ? String(c.o2) : '',
        co2: c.co2 != null ? String(c.co2) : '',
        drains: c.drains != null ? String(c.drains) : '',
        soc: c.soc === true || c.soc === 1 || c.soc === 'Yes'
      }))
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
        this.form.containerDOList.splice(index, 1);
      },
      addContainers() {
        if (!this.form.containerDOList) {
          this.$set(this.form, 'containerDOList', [])
        }
        this.form.containerDOList.push({
          type: '',
          qty: null,
          ventClosedOrNot: '',
          requireTemperature: '',
          humidity: '',
          o2: '',
          co2: '',
          drains: '',
          soc: false
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
      async handlePreview(file) {
        //window.open(file.url,'_blank');
        try {
          const res = await request({
            url: file.url,
            method: 'get',
            responseType: 'blob',
            headers: {
              Authorization: "Bearer " + getAccessToken()
            }
          });
          if (!(res instanceof Blob)) {
            throw new Error('Invalid response type');
          }

          const blobType = this.getBlobType(res);
          const blob = new Blob([res], { type: blobType });

          let downloadUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          //延迟释放URL对象
          setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
          }, 100);
        } catch (error) {
          console.error('Failed to load document:', error);
          this.$message.error('Failed to load document');
        }
      },
    getBlobType(blob) {
      // 如果已有类型且不是默认类型，直接使用
      if (blob.type && blob.type !== 'application/octet-stream') {
        return blob.type;
      }

      // 根据文件扩展名获取MIME类型
      return MIME_TYPES[this.fileExtension] || 'application/octet-stream';
    },

      handleSortChange({ column, prop, order }) {
        // 根据当前排序条件发送请求到后台获取排序结果
        if (order != null) {
          order = order === 'ascending' ? 'ASC' : 'DESC';
          this.queryParams.prop = column.property.replace(/([A-Z])/g, "_$1").toLowerCase()
          this.queryParams.orderBy = order
        } else {
          this.queryParams.prop = ''
          this.queryParams.orderBy = ''
        }
        this.getList()
      },
      handleComplete(shippingOrder){
        console.log(shippingOrder)
        this.poOriginPOL = shippingOrder[0].originPort
        this.getPepcoOrderFileByOrder(shippingOrder[0].items.map(item => item.orderId).join(","))
      },
    handleOrderDetail() {
      this.$nextTick(() => {
          this.$refs.orderDetail.active(this.$route.query.id, true)
      })
    },
    // 增加预排船信息
    handlePreAssign() {
      this.$nextTick(() => {
        this.$refs.preAssignDetail.active(this.$route.query.id)
      })
    },
    handlePreAssignComplete(preAssignData){
      console.log(preAssignData)
      if(preAssignData && preAssignData.length > 0){
        this.isShowPreAssignTable = true
      }else{
        this.isShowPreAssignTable = false
      }
      console.log('isShowPreAssignTable', this.isShowPreAssignTable)
    },
      getHeaderPage() {
        getHeaderPageForPepco(this.orderQueryParams).then((response) => {
          this.tableData = response.data.list;
          this.vesselMap = {}
          if (this.tableData.length > 0) {
            var productIds = [];
            this.shipmentStatusMap = {}
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].show = 0
              this.tableData[i].key = 'first' + this.tableData[i].id
              this.orderNumberMap[this.tableData[i].id] = this.tableData[i].orderNumber
              for (var j = 0; j < this.tableData[i].items.length; j++) {
                productIds.push(this.tableData[i].items[j].productId);
              }
              for (var k = 0; k < this.tableData[i].shipmentResList.length; k++) {
                var tempCarrier = this.tableData[i].shipmentResList[k].carrier
                if ((tempCarrier && tempCarrier != 'TSHG') && this.tableData[i].shipmentResList[k].shipmentBookingNumber) {
                  if (this.$auth.hasPermi("shipment:query")) {

                    // trackByBookingNumber({
                    //   carrier: tempCarrier,
                    //   type: "bill",
                    //   bookingNumber: this.tableData[i].shipmentResList[k].shipmentBookingNumber
                    // }).then((res) => {

                    //   if (res.data != null && res.data.statusCode == 20000) {
                    //     var vessles = res.data.data.result.vessel

                    //     var vesselMap = {}
                    //     for (var j = 0; j < vessles.length; j++) {
                    //       vesselMap[vessles[j].vessel] = vessles[j].imo
                    //     }
                    //     var statusList = res.data.data.result.places

                    //     var portStatusMap = {}
                    //     for (var k = 0; k < statusList.length; k++) {
                    //       if (!portStatusMap[statusList[k].code]) {
                    //         portStatusMap[statusList[k].code] = {}
                    //       }

                    //       portStatusMap[statusList[k].code]['etd'] = new Date(statusList[k].etd ? statusList[k].etd : statusList[k].atd)
                    //       portStatusMap[statusList[k].code]['eta'] = new Date(statusList[k].eta ? statusList[k].eta : statusList[k].ata)
                    //       if (statusList[k].atd) {
                    //         portStatusMap[statusList[k].code]['atd'] = new Date(statusList[k].atd)
                    //       }
                    //       if (statusList[k].ata) {
                    //         portStatusMap[statusList[k].code]['ata'] = new Date(statusList[k].ata)
                    //       }
                    //     }
                    //     if (res.data.data.result.containers.length > 0) {
                    //       var c_status = res.data.data.result.containers[0].status[res.data.data.result.containers[0].status.length - 1]
                    //       console.log(portStatusMap)
                    //       this.$set(this.shipmentStatusMap, res.data.data.result.billNo, {
                    //         status: c_status.descriptionEn + ":" + c_status.portCode,
                    //         movement: res.data.data.result.containers,
                    //         vesselMap: vesselMap,
                    //         portStatusMap: portStatusMap
                    //       })
                    //     }

                    //   }
                    // })
                  }
                } else {
                  var containers = this.tableData[i].shipmentResList[k].containerDOList.filter((item) => item.type == 1)
                  var pol = this.tableData[i].shipmentResList[k].originPort
                  var pod = this.tableData[i].shipmentResList[k].destinationPort
                  if (containers.length > 0) {
                    if (containers[0].actions != null) {
                      var statusList = JSON.parse(containers[0].actions)

                      var atdEvent = statusList.filter((item) => item.location.trim() == this.portMap[pol] && item.event == 'LOAD FULL')
                      if (atdEvent.length > 0) {
                        this.tableData[i].shipmentResList[k].atd = new Date(atdEvent[0].date_track)
                      }

                      var ataEvent = statusList.filter((item) => item.location.trim() == this.portMap[pod] && item.event == 'DISCHARGE FULL')
                      if (ataEvent.length > 0) {
                        this.tableData[i].shipmentResList[k].ata = new Date(ataEvent[0].date_track)
                      }
                    }

                  }
                }
              }
            }
            this.getItems(productIds);
            this.itemQueryParams.orderId = this.tableData[0].id;
            var partyIds = [];
            for (var i = 0; i < this.tableData.length; i++) {
              partyIds.push(this.tableData[i].buyer);
              partyIds.push(this.tableData[i].seller);
              partyIds.push(this.tableData[i].oha);
              var bookingNumbers = []
              for (var j = 0; j < this.tableData[i].bookings.length; j++) {
                bookingNumbers.push(this.tableData[i].bookings[j].bookingNumber);
              }
              this.bookingNameMap[this.tableData[i].id] = bookingNumbers;
            }
            this.getDeptList(partyIds);
          }
          this.total = response.data.total;
          this.loading = false;
        });
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex % 2 == 0) {
          return 'shuang-row';
        } else {
          return 'dan-row';
        }
      },

      calcTableHeight() {
        const clientHeight = document.documentElement.clientHeight;
        this.tableHeight = clientHeight - 302;
      },
      getDeptList(ids) {
        var vm = this;
        getDeptList({ ids: ids.join(",") }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.$set(vm.partyMap, response.data[i].id, response.data[i].name);
            vm.$set(vm.partyMap, response.data[i].id+'id', response.data[i].customerCode);
          }

        });
      },

      getItems(productIds) {
        getProductList({ ids: productIds }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
          console.log('获取的产品列表:', response.data[i])

            this.productMap[response.data[i].id] = {
              name: response.data[i].name,
              code: response.data[i].code,
              chineseName: response.data[i].chineseName,
              // category: response.data[i].category,
            };

          }
          console.log('产品', this.productMap)
        });
        this.getData();
      },
      showTask(list, index) {
        this.orderIndex = index
        this.drawer = true
        this.taskList = list
        if (list.length > 0) {
          this.title = list[0].orderNumber
        }
      },

      //   calculateWeight(row) {
      //     row.bookedQty = 2;
      //   if (row.weight && row.bookedQty) {
      //     const weightKg = (row.weight * row.bookedQty).toFixed(3)
      //     row.totalWeight = weightKg
      //     return weightKg;
      //   }
      //   return row.totalWeight;
      // },
      async toggleLoading(index) {
        this.$set(this.loadingMap, index, !this.loadingMap[index]);
      },

      async getData() {
        var vm = this;
        vm.reviewBookData = [];
          this.bookVisible = true;
          var productIds = [];
          var data = [];
          for (var key in this.preBookMap) {

            var itemIds = [];
            for (var i = 0; i < this.preBookMap[key].length; i++) {
              itemIds.push(this.preBookMap[key][i].itemId);
            }
            var res = await getItemList({ ids: itemIds.join(",") });
            for (var i = 0; i < res.data.length; i++) {
              var line = this.preBookMap[key].find((item) => item.itemId == res.data[i].id);
              res.data[i].bookedQty = line.qty;
              productIds.push(res.data[i].productId);
            }
            data.push({
              poNumber: vm.orderNumberMap[key],
              orderId: key,
              tableData: res.data,
            });
          }
          getProductList({ ids: productIds }).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              vm.productMapForBook[response.data[i].id] =
                response.data[i].name + "[" + response.data[i].code + "]";
            }
            vm.reviewBookData = data;
          });
      },
      // 更新审批标准中的pol
      handlePolChange() {
        this.approvalCriteriaData.soId = this.approvalCriteria.shippingOrderId;
        if (this.acSelected === 'match') {
          this.approvalCriteriaData.value = 0;
        } else if (this.acSelected === 'notmatch') {
          // 假设1表示不匹配
          this.approvalCriteriaData.value = 1;
        }
        this.updateApprovalCriteriaPol();
      },
      updateApprovalCriteriaPol() {
        updateSoCriteriaPol(this.approvalCriteriaData)
      },
      handlePreviewByOrder(file) {
      if (file.id) {
        window.location.href = file.fileUrl
      }
    },
    reloadPage() {
      this.$router.go(0)
    },
    handleOrderRefresh(){
      this.reloadPage()
    },
    handleOrderDetailLoading(status){
      this.orderDetailLoading = status
    }

    },
  };
  // 自定义函数用于验证电子邮件地址
  function isValidEmailAddress(email) {
    // 自定义验证逻辑
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
</script>

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
  .el-table__footer-wrapper {
  font-weight: bold;
}
</style>
