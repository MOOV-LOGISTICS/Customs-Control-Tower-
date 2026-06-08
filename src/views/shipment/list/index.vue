<template>
  <div class="app-container" style="width: 100%; margin: 0 auto" v-loading="loading">
    <el-dialog title="Carrier" :visible.sync="dialogVisibleCarrier" width="640px">
      <ChooseCarrier @change-value="changeParentValue"></ChooseCarrier>
    </el-dialog>
    <div class="flex-card" style="margin-bottom: 20px">
      <el-card style="background: transparent; box-shadow: none !important">
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <span @click="handleExportSO" v-if="showSO">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>

          <span v-hasPermi="['shipment:exportAboutFiles']" @click="handleExportAll">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>

          <span @click="handleExport2" v-if="!showSO">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
        <el-card v-if="!showSO" class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <span @click="handleExportContainer">
            <img style=" width: 42px;  height: 42px;  margin-left: 10px; margin-right: 10px;  margin-top: 3px;  margin-bottom: 2px; cursor: pointer; " src="../../../assets/icons/container.png" />
          </span>
        </el-card>
        <!-- downLoad Shipping Instructions(目前是pepco专属) -->
        <el-card v-if="showInstruction" class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <el-tooltip content="SHIPPING INSTRUCTIONS" placement="bottom">
            <span @click="handleExportShippingInstruction">
              <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
            </span>
          </el-tooltip>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <icon-park style="border-right: 1px solid #ddd" type="cruise" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            @click="onDeparture"
            :class="{ avticePort: queryParams.statusList.includes('vesselDeparture') }"
            style="float: right; line-height: 24px; margin-left: 10px; border-radius: 10px; padding: 0px 15px; cursor: pointer;"
          >
            <p style="font-size: 20px">{{ shipmentInfo.atd ? shipmentInfo.atd : 0 }}</p>
            <p style="white-space: nowrap">Vessel Departure</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
          <icon-park style="border-right: 1px solid #ddd" type="cruise" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            @click="onArrived"
            :class="{ avticePort: queryParams.statusList.includes('vesselArrived') }"
            style="  float: right; line-height: 24px;margin-left: 10px;border-radius: 10px;padding: 0px 15px;cursor: pointer; "
          >
            <p style="font-size: 20px">{{ shipmentInfo.ata ? shipmentInfo.ata : 0 }}</p>
            <p style="white-space: nowrap">Vessel Arrived</p>
          </div>
        </el-card>

        <el-card class="pd-20 pod-count-css" :body-style="{ display: 'flex' }">
          <icon-park style="border-right: 1px solid #ddd" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            :class="{ avticePort: checkedPort[item.destinationPort] }"
            @click="clickPort(item.destinationPort)"
            v-for="item in shipmentInfo.ports"
            style="  float: right; line-height: 24px;  padding: 0px 15px; border-right: 1px solid #ddd; cursor: pointer; border-radius: 10px; margin-left: 10px;"
          >
            <p style="font-size: 20px">{{ item.count }}</p>
            <p>{{ item.destinationPort }}</p>
          </div>
        </el-card>

        <!-- <el-card class="pd-20" v-if="showCustomerRequest" style="float: left; margin-right: 20px;margin-top: 10px; max-width: 50%; overflow: auto;" :body-style="{ display: 'flex' }">
        <el-badge class="customer-request" :value="approvalInfoNum"  :max="99" style="font-size: 14px;" >
          <el-button style="font-size: 16px; padding: 16px;" @click="customerRequest">Amend Request</el-button>
          </el-badge>
        </el-card>-->

        <el-card class="pd-20" style=" float: left; margin-right: 20px; margin-top: 10px; max-width: 50%; overflow: auto;" :body-style="{ display: 'flex' }">
          <el-badge :class="{ avticePort: queryParams.isSubscribed == true }" :value="shipmentInfo.subscribeds || 0" style="font-size: 14px">
            <svg
              @click="(queryParams.isSubscribed = queryParams.isSubscribed == false ? true : false),getPage() "
              style=" cursor: pointer; right: 20px; top: 70px;width: 20px;height: 45px; "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
            >
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" fill="#fe5000" d="M12 6v16l28-8-28-8Z" />
            </svg>
          </el-badge>
        </el-card>
      </el-card>
    </div>

    <el-card style="padding: 10px">
      <div>
        <div class="bottom-shadow">
          <div style="padding: 10px 0px">
            <div style="display: flex;" class="form-container">
              <el-form :model="queryParams">
                <!--  -->

                <div style="float: left">
                  <el-input
                    placeholder="Shipment Ref"
                    v-model="queryParams.bookingNumber"
                    @blur=" queryParams.bookingNumber = $event.target.value.trim()"
                    @keyup.enter.native="triggerFilter"
                    clearable
                    @clear="triggerFilter"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="Booking Number"
                    v-model="queryParams.shipmentBookingNumber"
                    @blur="queryParams.shipmentBookingNumber = $event.target.value.trim()"
                    clearable
                    @clear="triggerFilter"
                    @keyup.enter.native="triggerFilter"
                  />
                </div>

                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="Container No"
                    v-model="queryParams.containerNo"
                    @blur="queryParams.containerNo = $event.target.value.trim()"
                    clearable
                    @keyup.enter.native="triggerFilter"
                    @clear="triggerFilter"
                  />
                </div>
                <div v-hasPermi="['shipping:order:list']" style="float: left; margin-left: 5px">
                  <el-input
                    v-model="queryParams.customerRef"
                    placeholder="Customer ref"
                    @blur="queryParams.customerRef = $event.target.value.trim()"
                    @keyup.enter.native="triggerFilter"
                    clearable
                    @clear="triggerFilter"
                  />
                </div>

                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="PO"
                    v-model="queryParams.poNumbers"
                    @blur="queryParams.poNumbers = $event.target.value.trim()"
                    clearable
                    @clear="triggerFilter"
                    @keyup.enter.native="triggerFilter"
                  />
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-input
                    placeholder="Shipping Booking Number"
                    style="min-width: 200px;"
                    v-model="queryParams.soRef"
                    @blur=" queryParams.soRef = $event.target.value.trim()"
                    @keyup.enter.native="triggerFilter"
                    clearable
                    @clear="triggerFilter"
                  />
                </div>

                <div style="float: left; margin-left: 5px">
                  <el-button @click="getPage()" style="background-color: #004F7C; color: white;">
                    <i class="el-icon-search"></i> Search
                  </el-button>
                </div>
                <div style="float: left; margin-left: 5px">
                  <el-popover v-model="advancedQueryFormPopover" title=" " popper-class="popover-filter" placement="bottom" width="400" trigger="click">
                    <el-form ref="advancedForm" :model="queryParams">
                      <el-row>
                        <el-col>
                          <el-date-picker
                            clearable
                            @clear="(queryParams.pageNo = 1), getPage()"
                            v-model="queryParams.etaDateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="ETA from"
                            end-placeholder="ETA to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          ></el-date-picker>
                        </el-col>
                      </el-row>
                      <el-row class="form-spacing">
                        <el-col>
                          <el-date-picker
                            clearable
                            @clear="(queryParams.pageNo = 1), getPage()"
                            v-model="queryParams.etdDateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="ETD from"
                            end-placeholder="ETD to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          ></el-date-picker>
                        </el-col>
                      </el-row>
                     <el-row class="form-spacing">
                        <el-col>
                          <el-date-picker clearable @clear="(queryParams.pageNo = 1), getPage()"
                            @change="handleAtdDateChange" v-model="queryParams.atdDateRange" type="daterange"
                            range-separator="-" start-placeholder="ATD from" end-placeholder="ATD to"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select multiple clearable @change="changeVessel" v-model="queryParams.vesselList" placeholder="Vessel" filterable>
                            <el-option v-for="item in vesselList" :label="item" :value="item" />
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable v-model="queryParams.voyageList" placeholder="Voyage" filterable>
                            <el-option v-for="item in yoyageList" :key="item" :label="item" :value="item" />
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1), getPage()" placeholder="POR" filterable v-model="queryParams.polList">
                            <el-option v-for="dict in porDataList" :key="dict.value" :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1), getPage()" placeholder="POL" filterable v-model="queryParams.originPortList">
                            <el-option v-for="dict in polDataList" :key="dict.value" :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select multiple v-model="queryParams.statusList" clearable placeholder="Shipment Status">
                            <el-option label="All" value="all"></el-option>
                            <el-option label="Draft" value="draft"></el-option>
                            <el-option label="Booking Submitted" value="submitBooking"></el-option>
                            <el-option label="Booking Confirmed" value="bookingConfirmation"></el-option>
                            <el-option label="Shipping SI" value="shippingSI"></el-option>
                            <!--                  <el-option label="Draft Shipping Instruction" value="draftSI"></el-option>-->
                            <el-option label="Shipping Instruction" value="shippingInstructions"></el-option>
                            <el-option label="Vessel Departure" value="vesselDeparture"></el-option>
                            <el-option label="Vessel Arrived" value="vesselArrived"></el-option>
                            <el-option label="Cancel" value="cancel"></el-option>
                            <el-option label="Deactivate" value="deactivate"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable @clear="(queryParams.pageNo = 1); getPage()" placeholder="Carrier" filterable v-model="queryParams.carrierList">
                            <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.id" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
                          </el-select>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <div v-hasPermi="['shipment:customer']">
                            <el-select clearable @clear="(queryParams.pageNo = 1); getPage()" placeholder="Customer" filterable v-model="queryParams.customer">
                              <el-option v-for="dict in this.customerData" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <el-select multiple clearable v-model="queryParams.countryList" placeholder="Origin Country" filterable>
                            <el-option v-for="item in country" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-col>
                        <!-- <el-col :span="12">
                          <el-select
                            v-model="queryParams.poTags"
                            placeholder="PO Tag"
                            multiple
                            filterable
                            clearable
                            collapse-tags
                            style="width: 100%"
                          >
                            <el-option
                              v-for="tag in poTagOptions"
                              :key="tag.code"
                              :label="tag.label"
                              :value="tag.code"
                            >
                            <el-tag :type="tag.type" :class="tag.className" size="small" style="margin-right: 8px;">
                                {{ tag.label }}
                              </el-tag>
                            </el-option>
                          </el-select>
                        </el-col> -->
                      </el-row>
                     <el-row :gutter="20">
                        <el-col :span="12">
                          <el-select filterable clearable v-model="queryParams.shipmentType" placeholder="SO Type">
                            <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value"
                              :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-row>

                      <!-- <el-row :gutter="20">
                        <el-col style="text-align: right">
                          <el-button @click="getPage()" style="background-color: #004F7C; color: white;">
                            <i class="el-icon-search"></i> Search
                          </el-button>
                        </el-col>
                      </el-row> -->
                    </el-form>

                    <el-button slot="reference">
                      <div :class="{ 'red-text': hasContent }">
                        <span style="color:#004F7C">
                          <i class="el-icon-plus"></i> Filter
                        </span>
                      </div>
                    </el-button>
                    <el-button slot="reference" @click="clearFilters">
                      Clear Filters
                    </el-button>
                  </el-popover>
                </div>
                <!-- 需求变更，原有ui注释掉 -->
                <!-- <div style="float: left; margin-left: 5px">
                  <el-popover v-model="sortFormPopover" placement="bottom" width="400" trigger="click">
                    <el-form :model="sortForm" ref="sortForm">
                      <el-row :gutter="20">
                        <el-col :span="6">Sort By</el-col>
                      </el-row>
                      <el-row :gutter="20" style="padding-top: 10px">
                        <el-col :span="24">
                          <el-radio-group v-model="sortForm.names">
                            <el-radio label="ETD"></el-radio>
                            <el-radio label="ETA"></el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="padding-top: 20px">
                        <el-col :span="6">Sort Type</el-col>
                      </el-row>
                      <el-row :gutter="20" style="padding-top: 10px">
                        <el-col :span="24">
                          <el-radio-group v-model="sortForm.type">
                            <el-radio label="Latest date first"></el-radio>
                            <el-radio label="Earliest date first"></el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" style="
                          display: flex;
                          justify-content: flex-end;
                          padding-top: 20px;
                        ">
                        <el-col :span="6">
                          <el-button type="primary" @click="sortPage" :disabled="
                              sortForm.names == '' || sortForm.type == ''
                            ">Submit</el-button>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-button slot="reference">
                      Sort
                      <div class="sort-page">
                        <i class="el-icon-caret-top" :class="{ active: activeIndex === 0 }"></i>
                        <i class="el-icon-caret-bottom" :class="{ active: activeIndex === 1 }"></i>
                      </div>
                    </el-button>
                  </el-popover>

                </div> -->

              </el-form>
              <el-cascader v-model="sortValue" clearable style="width: 200px; margin-left:5px" :options="sortOptions"  @change="handleSortChange" placeholder="Sort by"></el-cascader>

            </div>
            <div style="float: right">
              <el-button type="primary" v-hasPermi="['shipment:create-notpb']" @click="createShipment">Create Shipment</el-button>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </div>

      <div :style="{ height: height + 'px' }" style=" float: left; width: calc(100%); position: relative;padding-top: 10px; ">
        <div style="overflow: auto" :style="{ height: height - 55 + 'px' }">
          <el-dialog title="API Error List" :visible.sync="apiVisible" width="60%">
            <el-table :data="apiErrorList">
              <el-table-column property="tab" label="API Name" width="200"></el-table-column>
              <el-table-column property="message" label="Message" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-dialog>

          <el-empty v-if="tableData.length == 0 && !loading" description="No Data"></el-empty>
          <el-row :gutter="0" style="  background: #fff; box-shadow: none !important;   border: 1px solid #ddd; " class="margin-top" v-for="(item, index) in tableData" :key="item.id">
            <el-col :span="3">
              <el-row>
                <el-col :span="24" class="shipment-logo">
                  <img v-if="item.carrier == 'HLCU'" class="partyLogo" src="../../../assets/HLCU.png" />
                  <img v-if="item.carrier == 'MAEU'" class="partyLogo" src="../../../assets/MAEU.png" />
                  <img v-if="item.carrier == 'ZIMU'" class="partyLogo" src="../../../assets/ZIMU.png" />
                  <img v-if="item.carrier == 'TSHG'" class="partyLogo" src="../../../assets/tailwind.png" />
                  <img v-if="item.carrier == 'MSCU'" class="partyLogo" src="../../../assets/MSCU-new.png" />
                  <img v-if="item.carrier == 'MSC'" class="partyLogo" src="../../../assets/MSCU-new.png" />
                  <img v-if="item.carrier == 'OOLU'" class="partyLogo" src="../../../assets/OOLU.svg" />
                  <img v-if="item.carrier == 'CMDU'" class="partyLogo" src="../../../assets/CMA.png" />
                  <img v-if="item.carrier == 'HMM'" class="partyLogo" src="../../../assets/HMM.jpg" />
                  <img v-if="item.carrier == 'ONEY'" class="partyLogo" src="../../../assets/ONE.png" />
                  <img v-if="item.carrier == 'COSU'" class="partyLogo" src="../../../assets/COSCO.png" />
                  <img v-if="item.carrier == 'CMA'" class="partyLogo" src="../../../assets/logo/CMA.png" />
                  <img v-if="item.carrier == 'COSCO'" class="partyLogo" src="../../../assets/logo/COSCO.png" />
                  <img v-if="item.carrier == 'HPL'" class="partyLogo" src="../../../assets/logo/HPL.png" />

                  <img v-if="item.carrier == 'MSK'" class="partyLogo" src="../../../assets/logo/MSK.png" />
                  <img v-if="item.carrier == 'ONE'" class="partyLogo" src="../../../assets/logo/ONE.png" />
                  <img v-if="item.carrier == 'ZIM'" class="partyLogo" src="../../../assets/logo/ZIM.png" />
                  <img v-if="item.carrier == 'EGLV'" class="partyLogo" src="../../../assets/logo/EGLV.png" />
                  <img v-if="item.carrier == 'SJHH'" class="partyLogo" src="../../../assets/logo/SJHH.png" />
                  <img v-if="item.carrier == 'SMLU'" class="partyLogo" src="../../../assets/logo/SMLU.png" />
                  <span
                    v-if="![
                        'TSHG',
                        'MAEU',
                        'ZIMU',
                        'ZIM',
                        'HLCU',
                        'MSCU',
                        'OOLU',
                        'CMDU',
                        'ONEY',
                        'COSU',
                        'SMLU',
                        'EGLV',
                        'SJHH',
                        'ONE',
                      ].includes(item.carrier)
                    "
                  >{{ item.carrier }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div>
                    <span>
                      <br />
                    </span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-descriptions style="box-shadow: none; margin: 0px" :colon="false">
                    <el-descriptions-item label contentStyle="display: flex; flex-wrap: wrap; align-items: center;">
                      <el-tag
                        style="
                          margin-right: 5px;
                          margin-top: 5px;
                          font-size: 13px;
                        "
                        v-for="container in item.containerDOList.filter(
                          (item) => item.type == 0
                        )"
                        :key="container.id"
                      >
                        {{ container.containerType }} x
                        {{ container.numbers }}
                      </el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="21" style="padding-top: 10px; padding-bottom: 10px">
              <el-descriptions style="box-shadow: none; margin-bottom: -5px" :colon="false" :column="5">
                <el-descriptions-item label="Shipment Ref" content-class-name="car-css">
                  <!-- <el-link type="primary" style="margin-top: -1px" :href="'/shipment/detail?id=' + item.id">{{ item.bookingNumber }}</el-link> -->
                  <el-link type="primary" style="margin-top: -1px" @click.prevent="openInNewTab(item.id)">{{ item.bookingNumber }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="Booking Number">
                  {{
                  item.shipmentBookingNumber
                  }}
                </el-descriptions-item>
                <el-descriptions-item :label="$constants.MBL_NUMBER">
                  <div>
                    {{
                    item.blNumber
                    }}
                    <i v-hasPermi="['shipment:updateBlNumber']" @click="updateBlNumber(item)" style="cursor: pointer;" class="el-icon-edit"></i>
                  </div>
                </el-descriptions-item>

                <el-descriptions-item v-if="item.source != 'booking-order'" label></el-descriptions-item>
                <el-descriptions-item v-if="item.source == 'booking-order'" label="Task Status">
                  <span @click="showTask(item, item.orderTaskDOS, index)" style="text-decoration: underline; cursor: pointer">{{ item.taskStatus }}</span>
                </el-descriptions-item>

                <el-descriptions-item label label-class-name="shipment-status-class">
                  <el-tag
                    :type="
                      item.status == 1
                        ? 'danger'
                        : item.status == 3
                        ? 'danger'
                        : ''
                    "
                  >{{ showStatus(item) }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item label="POR" content-class-name="car-css">{{ item.pol }}</el-descriptions-item>
                <el-descriptions-item :label="$t('booking.pol')">
                  {{
                  item.originPort
                  }}
                </el-descriptions-item>

                <el-descriptions-item :label="$t('booking.pod')">
                  {{
                  item.destinationPort
                  }}
                </el-descriptions-item>

                <el-descriptions-item label="FND">{{ item.pod }}</el-descriptions-item>
                <el-descriptions-item v-if="!$auth.hasPermi('shipment:detail:agent')" label></el-descriptions-item>
                <el-descriptions-item v-if="$auth.hasPermi('shipment:detail:agent')" label="Pre alert">
                  <div>
                    <el-tooltip v-show="item.sendEmailTime != null" class="item-tabs" effect="light" placement="bottom-start" slot="label">
                      <span slot="content">{{ parseTime(item.sendEmailTime) }}</span>
                      <span :type="item.sendEmailTime == null ? 'danger' : ''">
                        {{
                        item.sendEmailTime == null ? "Pending" : "Done"
                        }}
                      </span>
                    </el-tooltip>
                    <span v-show="item.sendEmailTime == null">
                      {{
                      item.sendEmailTime == null ? "Pending" : "Done"
                      }}
                    </span>
                  </div>
                </el-descriptions-item>

                <el-descriptions-item label="CRA Number" content-class-name="car-css">{{ item.contractNumber }}</el-descriptions-item>
                <el-descriptions-item label="Booked ETD/ETA">
                  {{ item.bookedEtd ? parseUTCTime(item.bookedEtd) : "-" }}
                  /
                  {{ item.bookedEta ? parseUTCTime(item.bookedEta) : "-" }}
                  <i
                    v-hasPermi="['pepco:shipment:updatebookeddate']"
                    @click="updateBookedDate(item)"
                    style="cursor: pointer;"
                    class="el-icon-edit"
                  ></i>
                </el-descriptions-item>

                <el-descriptions-item label="ETD/ETA">
                  {{
                  item.etd
                  ? parseUTCTime(item.etd ? item.etd : item.bookedEtd)
                  : "-"
                  }}
                  /
                  {{
item.freightMethod==='sea_air'?(item.seaAirEta? parseUTCTime(item.seaAirEta): "-"):(item.eta? parseUTCTime(item.eta): "-")
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="ATD/ATA">
                  {{ item.atd ? parseUTCTime(item.atd) : "-" }}
                  /
{{ 
  item.freightMethod==='sea_air'?(item.seaAirAta? parseUTCTime(item.seaAirAta): "-"):(item.ata? parseUTCTime(item.ata):"-") 
}}
                </el-descriptions-item>

                <!-- si status -->
                <el-descriptions-item v-if="
                    item.shippingResVOS != null &&
                    item.shippingResVOS.length > 0
                  " label="SI Status">
                  {{
                  item.siSubmitStatus == 1 ? "Submited" : "Not All submited"
                  }}
                </el-descriptions-item>

                <el-descriptions-item
                  v-if="
                    !(
                      item.shippingResVOS != null &&
                      item.shippingResVOS.length > 0
                    )
                  "
                  label
                ></el-descriptions-item>

                <el-descriptions-item label="Carriage Contract">
                  {{
                  item.contractType
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Payment Term">{{ item.paymentTerm }}</el-descriptions-item>
                <el-descriptions-item label="SI/VGM Cutoff" content-class-name="car-css">
                  {{
                  item.siCutOffDate
                  ? parseTime(item.siCutOffDate, "{y}-{m}-{d} {h}:{i}")
                  : "-"
                  }}
                </el-descriptions-item>

                <el-descriptions-item label="Batteries">{{ item.batteries === 2 ? "YES" : "NO" }}</el-descriptions-item>
                <el-descriptions-item label="DG">{{ item.dg ? "YES" : "NO" }}</el-descriptions-item>

                <!--            <el-descriptions-item label="VGM Cutoff">-->
                <!--              {{ item.vgmCutOffDate?parseTime(item.vgmCutOffDate, '{y}-{m}-{d} {h}:{i}') : '-'}}-->
                <!--            </el-descriptions-item>-->

                <el-descriptions-item label></el-descriptions-item>
                <el-descriptions-item label></el-descriptions-item>

                <el-descriptions-item label>
                  <div style="float: right">
                    <el-dropdown
                      v-show="!onlyPreview"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 0px;
                      "
                      size="mini"
                    >
                      <el-button type="primary">
                        More
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="
                            item.status + '' != '1' && item.status + '' != '3'
                          " v-hasPermi="['shipment:update']">
                          <el-link @click="updateShipment(item)">Update</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="!item.isBooking" v-hasPermi="['shipment:copy']">
                          <el-link @click="copyShipment(item)">Copy</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.status == '1' || item.status == '3'" v-hasPermi="['shipment:activate']">
                          <el-link @click="activateShipment(item)">Activate</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.bookingNumber.startsWith('S')" v-hasPermi="['shipment:sendToCarrier']">
                          <el-link @click="sendEmail(item)">Send files to carrier</el-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                    <svg
                      v-if="!expanded[item.id]"
                      @click="toggleDetails(item.id)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 35px;
                      "
                      width="30"
                      height="30"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 36L12 24L24 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M36 36L24 24L36 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-if="expanded[item.id]"
                      @click="toggleDetails(item.id)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 35px;
                      "
                      width="30"
                      height="30"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <svg
                      v-show="!item.subscribe"
                      @click="subscribe(item)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 20px;
                        top: 70px;
                        width: 20px;
                        height: 20px;
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 40 40"
                    >
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" fill="#FFF" d="M12 6v16l28-8-28-8Z" />
                    </svg>
                    <svg
                      v-show="item.subscribe"
                      @click="subscribe(item)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 20px;
                        top: 70px;
                        width: 20px;
                        height: 20px;
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 40 40"
                    >
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" fill="#fe5000" d="M12 6v16l28-8-28-8Z" />
                    </svg>
                  </div>
                </el-descriptions-item>

                <el-descriptions-item label>
                  <div style="float: right">
                    <el-dropdown
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 0px;
                      "
                      size="mini"
                    >
                      <el-button type="primary">
                        More
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item v-if="
                            item.status + '' != '1' && item.status + '' != '3'
                          " v-hasPermi="['shipment:update']">
                          <el-link @click="updateShipment(item)">Update</el-link>
                        </el-dropdown-item>-->
                        <el-dropdown-item v-if="!item.isBooking" v-hasPermi="['shipment:copy']">
                          <el-link @click="copyShipment(item)">Copy</el-link>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item v-if="item.status == '1' || item.status == '3'" v-hasPermi="['shipment:activate']">
                          <el-link @click="activateShipment(item)">Activate</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.bookingNumber.startsWith('S')" v-hasPermi="['shipment:sendToCarrier']">
                          <el-link @click="sendEmail(item)">Send files to carrier</el-link>
                        </el-dropdown-item>-->
                      </el-dropdown-menu>
                    </el-dropdown>

                    <svg
                      v-if="!expanded[item.id]"
                      @click="toggleDetails(item.id)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 35px;
                      "
                      width="30"
                      height="30"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 36L12 24L24 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M36 36L24 24L36 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-if="expanded[item.id]"
                      @click="toggleDetails(item.id)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 10px;
                        top: 35px;
                      "
                      width="30"
                      height="30"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <svg
                      v-show="!item.subscribe"
                      @click="subscribe(item)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 20px;
                        top: 70px;
                        width: 20px;
                        height: 20px;
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 40 40"
                    >
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" fill="#FFF" d="M12 6v16l28-8-28-8Z" />
                    </svg>
                    <svg
                      v-show="item.subscribe"
                      @click="subscribe(item)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        right: 20px;
                        top: 70px;
                        width: 20px;
                        height: 20px;
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 40 40"
                    >
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8" />
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" fill="#fe5000" d="M12 6v16l28-8-28-8Z" />
                    </svg>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="24" style="padding: 0px">
              <el-collapse-transition>
                <div v-show="expanded[item.id]" style="width: 100%">
                  <el-tabs :ref="'tab' + item.id" v-model="item.key">
                    <el-tab-pane :name="'Orders' + item.id" label="Orders">
                      <SOMainTable
                        :tableData="item.soHeaderVOs"
                        ref="table"
                        :showOtherTabs="false"
                        v-if="
                              item.soHeaderVOs != null &&
                              item.soHeaderVOs.length > 0
                            "
                        :tableHeight="null"
                      ></SOMainTable>
                      <el-table v-loading="linesLoading" :data="linesDic[item.id]" show-summary sum-text="Total" size="mini">
                        <el-table-column prop="orderNumber" label="Order Number" min-width="120" align="center"></el-table-column>
                        <el-table-column prop="itemNumber" label="Item Number" min-width="100" align="center"></el-table-column>
                        <!-- <el-table-column prop="itemName" label="Item Name" show-overflow-tooltip></el-table-column> -->
                        <el-table-column prop="tcId" label="TCId" width="80" align="center"></el-table-column>
                        <el-table-column prop="bookedOuter" label="Booked Outer(Cartons)" min-width="130" align="center"></el-table-column>
                        <el-table-column prop="volume" label="Volume(cbm)" min-width="100" align="center"></el-table-column>
                        <el-table-column prop="grossWeight" label="Gross Weight(kg)" min-width="120" align="center"></el-table-column>
                        <el-table-column prop="targetETA" label="Target ETA" min-width="120" align="center"></el-table-column>
                        <el-table-column label="PO Tag" min-width="150" align="center">
                          <template #default="{ row }">
                            <template v-if="getPoTags(row).length">
                              <el-tag
                                v-for="tag in getPoTags(row)"
                                :key="tag.code"
                                :type="tag.type"
                                size="small"
                                :class="tag.className"
                              >
                                {{ tag.label }}
                              </el-tag>
                            </template>
                            <span v-else>-</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </el-col>
          </el-row>
        </div>

        <pagination v-show="lineTotal > 0" :total="lineTotal" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getPage" />
      </div>

      <div style="clear: both"></div>
    </el-card>

    <!-- booked date update -->
    <el-dialog title="Update Booked Date" width="600px" :visible.sync="updateBookedDateFormVisible">
      <el-form ref="bookedDateUpdateFormRef" :model="form" :rules="bookedForm" size="mini">
        <el-form-item label="Booked Etd" label-width="180px" prop="bookedEtd">
          <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="bookedForm.bookedEtd" type="date" placeholder="Booked Etd"></el-date-picker>
        </el-form-item>
        <el-form-item label="Booked Eta" label-width="180px" prop="bookedEta">
          <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="bookedForm.bookedEta" type="date" placeholder="Booked Eta"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateBookedDateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitShipmentBookedDate(bookedForm)">Submit</el-button>
      </div>
    </el-dialog>

    <!-- transportMode -->
     <el-dialog title="Transport Mode" :visible.sync="isShowTransportMode">
        <el-select v-model="freightMethod">
          <el-option v-for="(option,i) in transportOptions" :key="i" :label="option.label" :value="option.value"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowTransportMode = false">Cancel</el-button>
          <el-button type="primary" @click="submit">Submit</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<style scoped>
p {
  margin: 0px;
}
.expand-transition {
  transition: all 0.5s;
  height: 0;
  overflow: hidden;
}

.expand-transition-enter,
.expand-transition-leave-to {
  height: 0;
}

.expand-transition-enter-active,
.expand-transition-leave-active {
  height: auto;
}
.rotate-90 {
  transform: rotate(90deg);
}
.demo-table-expand {
  font-size: 0;
}
.border-top {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.el-descriptions {
  padding: 15px;
  margin-bottom: 15px;
}
.el-descriptions-row th {
  color: rgb(0, 79, 124);
  font-weight: 700 !important;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.shipment-logo .partyLogo {
  position: relative !important;
  top: 23px !important;
  margin-left: 20px !important;
}
span.el-descriptions-item__label.shipment-status-class {
  margin: 0 !important;
}

.not-check-css {
  border-color: red;
}

.title {
  font-weight: bold;
  padding-right: 10px;
}

.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}
.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}
.title {
  border: 5px;
}
.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: '';
  background: #004f7c;
  top: 20px;
  text-align: left;
}
.status2 {
  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}
.color1 {
  color: #13854e;
  background-color: #d6ede2;
}
.color2 {
  color: #2d86ba;
  background-color: #ceecfd;
}
.numberOftask {
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}
.color3 {
  color: #e6a23c;
  background: #fdf6ec;
}
.color4 {
  color: #f56c6c;
  background: #fef0f0;
}

/deep/.el-table__footer-wrapper tbody td.el-table__cell {
  color: #004f7c;
}
/deep/.el-table .el-table__footer-wrapper .cell {
  color: #004f7c;
}
.custom-sort-popover .custom-sort-form {
  padding: 10px;
}
.red-text {
  color: red;
}
.el-row {
  margin-bottom: 20px;
}
.pod-count-css {
  float: left;
  margin-right: 20px;
  margin-top: 10px;
  max-width: 50%;
  overflow: auto;
}
@media only screen and (min-width: 1000px) {
  .pod-count-css {
    max-width: 22%;
  }
}
@media only screen and (min-width: 1200px) {
  .pod-count-css {
    max-width: 35%;
  }
}
@media only screen and (min-width: 1500px) {
  .pod-count-css {
    max-width: 43%;
  }
}
@media only screen and (min-width: 1700px) {
  .pod-count-css {
    max-width: 50%;
  }
}
@media only screen and (min-width: 1900px) {
  .pod-count-css {
    max-width: 60%;
  }
}
</style>

<script>
import { getUserProfile } from '@/api/system/user'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import {
  shipperPage,
  getPage,
  groupByPort,
  updateBlNumber,
  sendToCarrier,
  findShippingSchedulePortList,
  activateShipment,
  shipmentReport,
  exportShipmentExcel,
  exportShippedExcel,
  getTenantPorts,
  exportShippingInstruction,
  updateShipmentBookedDate
} from '@/api/shipment/shipment'
import { getDeptList } from '@/api/system/dept'
import { exportPOAll, exportPO2, exportSO, getOrdreItemByShipmentId,groupByCountryAndSuppliercode, } from '@/api/order/header'
import SOMainTable from '@/views/salesOrder/components/table.vue'
import { createSubscribe, deleteSubscribe } from '@/api/order/subscribe'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import ChooseCarrier from '@/views/salesOrder/components/choose-carrier'
import { listDept } from '@/api/system/dept'
import moment from 'moment'
import { getTaskNames, updateTask, getTaskList, reminder } from '@/api/order/task'
import { getApprovalInfoNum } from '@/api/shipping/approvalInfo'
import { getCurrentUserVesselAndYoyageOptions } from '@/api/shipment/router'
import { getOrderHeaderListByShipmentId } from '@/api/pepco/shipping-order.js'
import { parseTime as parseDateTime } from '@/utils/ruoyi'
import {DICT_TYPE, getDictDatas} from "@/utils/dict";
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'

export default {
  name: 'Booking',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    },
    transportOptions(){
      return getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO).filter(item => item.value === 'sea' || item.value === 'sea_air')
    }
  },
  components: { IconPark, SOMainTable, ChooseCarrier },
  data() {
    return {
      onlyPreview: false,
      hasContent: false,
      advancedQueryFormPopover: false,
      porDataList: [],
      polDataList: [],
      vesselList: [],
      yoyageList: [],
      searchForm: {},
      apiErrorList: [],
      apiVisible: null,
      expanded: {},
      tableData: [],
      loading: true,
      expanded: {},
      size: 'small',
      lineTotal: 0,
      height: '',
      showBLUpdateButton: false,
      containerStatus: {
        BDAR: 'Arrived',
        DLPT: 'Departure',
        STCS: 'Gate Out',
        GTOT: 'Import to Consignee',
        RCVE: 'Return Empty',
        STSP: 'Empty Pick up',
        GITM: 'Gate In',
        DSCH: 'Discharge',
        LOBD: 'Load Board'
      },
      country: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        isSubscribed: false,
        statusList: [],
        bookingNumber: null,
        poNumbers: null,
        shipmentBookingNumber: null,
        containerNo: null,
        etaDateRange: [],
        etdDateRange: [],
        atdDateRange: [],
        vesselList: [],
        voyageList: [],
        originPortList: [],
        customer: null,
        soRef: null,
        carrierList: [],
        countryList: [],
        polList: [],
        poTags: [],
        shipmentType: null
      },
      poTagOptions: [
        {
          code: 'OTB',
          label: 'OTB',
          type: 'success'
        },
        {
          code: 'NOS',
          label: 'NOS',
          type: 'primary'
        },
        {
          code: 'SANITARY_RISK',
          label: 'Sanitary Risk',
          type: 'warning'
        },
        {
          code: 'CERAMIC',
          label: 'Ceramic Products',
          type: 'info',
          className: 'tag-purple',
        },
        {
          code: 'CHILDREN_TOY',
          label: 'Children Toy',
          type: 'danger'
        }
      ],
      searchContent: '',
      partyMap: {},
      productMap: {},
      activities: [],
      totalShipment: 0,
      otherMilestones: {
        '-1': 'Update',
        0: 'CancelShipment',
        1: 'Draft',
        2: 'Submit Booking',
        3: 'Booking Accept',
        4: 'Booking Confirmation',
        5: 'GATE OUT EMPTY',
        6: 'GateIn',
        7: 'Shipping Instructions',
        8: 'Shipped',
        9: 'BLIssued',
        10: 'Arrived',
        11: 'DeparturePOD',
        12: 'Delivered',
        13: 'ArrivalInlandTerminal',
        14: 'Completed',
        18: 'Departure POL',
        19: 'Arrival POD',
        20: 'Custom clearance',
        21: 'Delivery',
        22: 'Empty Return'
      },
      portData: [],
      shipmentInfo: {
        ports: [],
        atd: 0,
        ata: 0,
        subscribeds: 0
      },
      checkedPort: {},
      carrier: '',
      dialogVisibleCarrier: false,
      showSO: false,
      customerData: [],

      title: '',
      form: {},
      user: {},

      activeIndex: null,
      currentSort: null,
      // 需求更改，此对象使用不到
      // sortForm: {
      //   names: '',
      //   type: ''
      // },
      sortFormPopover: false,
      approvalInfoNum: 0,
      showCustomerRequest: false,
      vesselVoyageList: [],
      oldVoyageList: [],
      oldVesselList: [],
      OrderItems: [],
      dataList: [],
      lines: [],
      linesDic: {},
      linesLoading: true,
      voyageVesselList: [],
      bookedForm: {},
      updateBookedDateFormVisible: false,
      bookedRules: {
        bookedEtd: [{ required: true, message: 'bookedEtd Is Required', trigger: 'change' }],
        bookedEta: [{ required: true, message: 'bookedEta Is Required', trigger: 'change' }]
      },
      // 是否显示shipping instruction下载按钮
      showInstruction: false,
      sortOptions: [
        { value: 'ETD', label: 'ETD', children: [
          { value: 'DESC', label: 'Latest date first' }, // 降序
          { value: 'ASC', label: 'Earliest date first' },// 升序
        ] },
        { value: 'ETA', label: 'ETA', children: [
          { value: 'DESC', label: 'Latest date first' },
          { value: 'ASC', label: 'Earliest date first' },
        ] },
      ],
      // 排序方式
      sortValue: '',
      // 运输模式
      isShowTransportMode:false,
      transportModeOptions:[],
      freightMethod:''
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowHeight = document.documentElement.clientHeight
      this.height = this.windowHeight - 310
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 310
    getCurrentUserVesselAndYoyageOptions().then(res => {
      this.vesselList = res.data.vessels
      this.yoyageList = res.data.yoyages
      //保存原始数据
      this.oldVoyageList = this.yoyageList
      this.oldVesselList = this.vesselList
      this.vesselVoyageList = res.data.mapList
      this.voyageVesselList = res.data.voyageMapList
    })
    getUserProfile().then(response => {
      this.user = response.data
    })
    if (this.$route.query.bookingNumber) {
      this.queryParams.shipmentBookingNumber = this.$route.query.bookingNumber
    }
    if (this.$route.query.uuid) {
      this.queryParams.bookingNumber = this.$route.query.uuid
    }
    if (this.$route.query.orderNumber) {
      this.queryParams.poNumbers = this.$route.query.orderNumber
    }
    // this.groupByPort();
    this.getPage()
    this.findShippingSchedulePortList()
    //this.shipmentReport();

    // this.showSO = this.$auth.hasPermi("order:so-header:query")
    if (this.$auth.hasRole('super_admin')) {
      this.showSO = true
    } else {
      this.showSO = this.$auth.hasPermi('order:so-header:query')
    }

    this.showBLUpdateButton = this.$auth.hasPermi('shipment:updateBlNumber')

    if (this.$auth.hasPermi('shipment:customer')) {
      listDept({ partyRole: 'Customer' }).then(response => {
        this.customerData = response.data
      })
    }

    if (this.$auth.hasPermi('shipment:customerRequest')) {
      this.showCustomerRequest = true
      getApprovalInfoNum().then(response => {
        this.approvalInfoNum = response.data
      })
    }
    if (this.$auth.hasRole('super_admin')) {
      this.onlyPreview = false
    } else {
      this.onlyPreview = this.$auth.hasPermi('shipment-detail:onlyPreview')
    }
    console.log(this.onlyPreview)
    // 判断是否显示shipping instruction下载按钮
    // 如果是super_admin，则显示
    // 如果是pepco租户，则显示
    // 注：目前没找到更合适的区分是否是pepco租户的办法
    const tenantID = localStorage.getItem('TENANT_ID')
    console.log('get local tenantID', tenantID)
    console.log(tenantID)
    if (tenantID) {
      // 获取字典里pepco的id
      const pepcoIdsString = this.getDictDatas(this.DICT_TYPE.PEPCO).find(item => item.label === 'tenantId')?.value || ''
      const pepcoIdsArray = pepcoIdsString.split(',').map(id => id.trim())
      console.log('pepcoIdsString', pepcoIdsString)
      console.log('pepcoIdsArray', pepcoIdsArray)
      // 检查tenantID是否在pepcoIdsArray中
      const isMatched = pepcoIdsArray.includes(tenantID)
      console.log('isMatched', isMatched)
      if (isMatched) {
        this.showInstruction = true
      } else {
        this.showInstruction = false
      }
      console.log(this.showInstruction)
    }
    this.groupByCountryAndSuppliercode()
  },
  methods: {
    // 重置查询条件
    resetQueryParams(){
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        isSubscribed: false,
        statusList: [],
        bookingNumber: null,
        poNumbers: null,
        shipmentBookingNumber: null,
        containerNo: null,
        etaDateRange: [],
        etdDateRange: [],
        vesselList: [],
        voyageList: [],
        originPortList: [],
        customer: null,
        soRef: null,
        carrierList: [],
        polList: [],
        countryList: [],
        atdDateRange: [],
        shipmentType: null
      }
    },
    clearFilters(){
      // 重置查询条件
      this.resetQueryParams()
      // 重新获取数据
      this.getPage()
    },
    // 自定义filter
    triggerFilter() {
      this.queryParams.pageNo = 1
      this.getPage()
    },
    // 排序方式改变
    handleSortChange(value) {
      const [names, type] = value;
      this.queryParams.prop = names;
      this.queryParams.orderBy = type;
      // refresh
      this.getPage()
    },
    openInNewTab(id) {
      const routeData = this.$router.resolve({path: '/shipment/detail', query: {id}});
      window.open(routeData.href, '_blank');
    },
    getPoTags(row, context = {}) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
        row.nos = false
      }
      return PO_TAG_RULES
        .filter(rule => rule.match?.(row, context))
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
    },
    getDictDatas,
    updateBookedDate(row) {
      this.bookedForm = {}
      this.bookedForm = row
      console.log(this.bookedForm.bookedEtd)
      console.log(this.bookedForm.bookedEta)
      this.updateBookedDateFormVisible = true
    },
    submitShipmentBookedDate(bookedForm) {
      //  验证表单 edwin
      this.$refs.bookedDateUpdateFormRef.validate(valid => {
        if (!valid) return
        console.log('submitBookedDate 验证通过:', this.bookedForm.bookedEtd)
        console.log('submitBookedDate 验证通过:', this.bookedForm.bookedEta)
        updateShipmentBookedDate(bookedForm)
          .then(res => {
            this.$notify({ type: 'success', message: 'Success' })
            this.updateBookedDateFormVisible = false
            this.getPage()
          })
          .catch(err => {
            console.error('Error updating task:', error)
            this.$message.error('Failed to update task')
            this.updateBookedDateFormVisible = false
            this.getPage()
          })
      })
    },

    changeVessel(val) {
      if (val.length > 0) {
        const list = []
        for (let i = 0; i < val.length; i++) {
          list.push(...this.vesselVoyageList[val[i]])
        }
        if (list && list.length > 0) {
          this.queryParams.voyage = []
          this.yoyageList = list
        }
      } else {
        this.queryParams.voyage = []
        this.yoyageList = this.oldVoyageList
      }
    },
    changeVoyage(val) {
      if (this.queryParams.vessel.length < 1) {
        if (val.length > 0) {
          const list = []
          for (let i = 0; i < val.length; i++) {
            list.push(...this.voyageVesselList[val[i]])
          }
          if (list.length > 0) {
            this.vesselList = list
          }
        } else {
          this.yoyageList = this.oldVoyageList
        }
      } else {
        this.vesselList = this.oldVesselList
      }
    },
    customerRequest() {
      const url = this.$router.resolve({
        path: '/support/customerRequest'
      }).href
      window.open(url, '_blank')
    },

    formattedTimeAfterSubtracting12Hours(val) {
      // 使用 Moment.js 将时间戳转换为 Moment 对象
      const momentDate = moment(val)
      // 减12小时
      const adjustedDate = momentDate.subtract(12, 'hours')
      // 格式化日期并返回
      return adjustedDate.format('YYYY-MM-DD HH:mm')
    },
    submit(){
      if (this.carrier == null || this.carrier == '') {
        return
      }
      this.isShowTransportMode = false
      if (this.carrier == 'TSHG') {
        this.$router.push('/shipment/create?carrier=' + this.carrier)
      } else {
        this.$router.push(`/shipment/create-shipment?carrier=${this.carrier}&freightMethod=${this.freightMethod}`)
      }
    },
    isPepco4PL() {
      const tenantID = localStorage.getItem('TENANT_ID')
      console.log('get local tenantID', tenantID)
      console.log(tenantID)
      if (tenantID) {
        // 获取字典里pepco的id
        const pepcoIdsString = this.getDictDatas(this.DICT_TYPE.PEPCO).find(item => item.label === 'tenantId_4pl')?.value || ''
        const pepcoIdsArray = pepcoIdsString.split(',').map(id => id.trim())
        console.log('pepcoIdsString', pepcoIdsString)
        console.log('pepcoIdsArray', pepcoIdsArray)
        // 检查tenantID是否在pepcoIdsArray中
        const isMatched = pepcoIdsArray.includes(tenantID)
        console.log('isMatched', isMatched)
        return isMatched
      }
      return false
    },
    changeParentValue(value) {
      this.carrier = value
      // 选择模式
      console.log('>>>>>this.isPepco4PL',this.isPepco4PL());
      
      if(this.isPepco4PL()){
        this.isShowTransportMode = true
        return
      }
       if (this.carrier == 'TSHG') {
        this.$router.push('/shipment/create?carrier=' + this.carrier)
      } else {
        this.$router.push(`/shipment/create-shipment?carrier=${this.carrier}`)
      }

    },
    shipmentReport() {
      shipmentReport(this.queryParams).then(res => {
        this.shipmentInfo = res.data
      })
    },
    checkPermi,
    checkRole,
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index])
    },
    findShippingSchedulePortList() {
      findShippingSchedulePortList(this.searchData).then(response => {
        this.portData = response.data
        getTenantPorts().then(res => {
          this.polDataList = res.data.polList
          this.porDataList = res.data.porList
          this.polDataList = this.portData.filter(item => this.polDataList.includes(item.value))
          this.porDataList = this.portData.filter(item => this.porDataList.includes(item.value))
        })
      })
    },
    updateBlNumber(item) {
      this.$prompt(`${this.$constants.MBL_NUMBER}`, `${this.$constants.MBL_NUMBER}`, {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputType: 'text',
        showInput: true,
        inputValue: item.blNumber
      })
        .then(({ value }) => {
          updateBlNumber({ shipmentId: item.id, blNumber: value }).then(res => {
            item.blNumber = value
          })
        })
        .catch(() => {})
    },
    detail(path) {
      //this.$router.push(path);
      window.open(path)
    },
    atdAndAta(item) {
      if (item.shipmentDetailDOS == null) {
        return
      }

      var obj1 = item.shipmentDetailDOS.find(item => item.status + '' == '8')
      var obj2 = item.shipmentDetailDOS.find(item => item.status + '' == '10')
      if (obj1 == null && obj2 == null) {
        return '-/-'
      } else if (obj1 == null) {
        return '-/' + this.parseTime(obj2.endDate)
      } else if (obj2 == null) {
        return this.parseTime(obj1.endDate) + '/-'
      } else {
        return this.parseTime(obj1.endDate) + '/' + this.parseTime(obj1.endDate)
      }
    },
    etdAndEta(item) {
      if (item.routerDOList.length == 0 || item.routerDOList == null) {
        return '-/-'
      } else {
        return this.parseUTCTime(item.routerDOList[0].etd) + ' / ' + this.parseUTCTime(item.routerDOList[item.routerDOList.length - 1].eta)
      }
    },
    updateShipment(item) {
      if (item.carrier == 'TSHG') {
        this.$router.push('/shipment/update?id=' + item.id)
      } else {
        this.$router.push('/shipment/update-shipment?id=' + item.id)
      }
    },
    copyShipment(item) {
      if (item.carrier == 'TSHG') {
        this.$router.push('/shipment/copy?id=' + item.id)
      } else {
        this.$router.push('/shipment/copy-shipment?id=' + item.id)
      }
    },
    activateShipment(item) {
      this.$modal
        .confirm('Confirm to Activate?')
        .then(function () {
          return activateShipment(item.id)
        })
        .then(() => {
          this.getPage()
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    showStatus(data) {
      if (data.status == 1) {
        return 'Cancel'
      }
      if (data.status == 3) {
        return 'Deactivate'
      }
      if (data.status == 2) {
        return 'Draft'
      }
      if (data.status == 4) {
        return 'Draft Shipping Instruction'
      }
      if (data.status == 5) {
        return 'Shipper SI'
      }
      if (data.shipmentContainerStatusDOS.length == 0) {
        function compare() {
          return function (a, b) {
            var value1 = a['status']
            var value2 = b['status']
            return parseInt(value1) - parseInt(value2)
          }
        }
        var arr = JSON.parse(JSON.stringify(data.shipmentDetailDOS)).filter(item => item.endDate != null)
        arr.sort(compare())
        if (arr.length > 0) {
          return this.otherMilestones[arr[arr.length - 1].status]
        }
        return 'Created'
      }
      if (data.shipmentContainerStatusDOS.length > 0) {
        var move = data.shipmentContainerStatusDOS[data.shipmentContainerStatusDOS.length - 1]
        if (data.carrier == 'TSHG') {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.eventCode
        } else {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.descriptionEn
        }
      }
      return 'Created'
    },
    groupByPort() {
      groupByPort().then(response => {
        console.log(response.data)
        for (var i = 0; i < response.data.length; i++) {
          this.activities.push({
            content: response.data[i].originPort + '-' + response.data[i].destinationPort,
            timestamp: this.$t('booking.shipmentItems') + '(' + response.data[i].count + ')',
            type: ''
          })
          this.totalShipment += response.data[i].count
        }
        if (response.data.length > 0) {
          this.getPage()
        } else {
          this.loading = false
        }
      })
    },
    sortByQueryParams(property, asc = true) {
      //默认升序
      asc = asc == true ? -1 : 1
      return function (value1, value2) {
        let a = value1[property]
        let b = value2[property]
        return a < b ? asc : a > b ? asc * -1 : 0
      }
    },
    clickPort(item) {
      this.loading = true
      var flag = false
      for (var i = 0; i < this.activities.length; i++) {
        if (this.activities[i].content == item.content) {
          if (this.activities[i].type == 'primary') {
            flag = true
            this.activities[i].type = ''
          } else {
            this.activities[i].type = 'primary'
          }
        } else {
          this.activities[i].type = ''
        }
        this.$set(this.activities, i, this.activities[i])
      }
      if (flag) {
        this.queryParams.pol = ''
        this.queryParams.pod = ''
      } else {
        this.queryParams.pol = item.content.split('-')[0]
        this.queryParams.pod = item.content.split('-')[1]
      }
      this.queryParams.pageNo = 1
      this.getPage()
    },
    createShipment() {
      this.dialogVisibleCarrier = true
      //this.$router.push("/shipment/create");
    },
    getLoadingQty(bookingItem, clp) {
      var qty = 0
      if (clp && clp.clpDetailResList.length > 0) {
        for (var i = 0; i < clp.clpDetailResList.length; i++) {
          if (clp.clpDetailResList[i].orderItemId == bookingItem.id) {
            qty += clp.clpDetailResList[i].qty
          }
        }
      }
      return qty
    },
    getDeptList(ids) {
      var vm = this
      getDeptList({ ids: ids.join(',') }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(vm.partyMap, response.data[i].id, response.data[i].name)
        }
      })
    },
    // 方法未使用
    resetSortForm(name) {
      this.sortForm = {
        names: '',
        type: ''
      }
      this.activeIndex = null
      this.sortFormPopover = false
      this.queryParams.prop = null
      this.queryParams.orderBy = null
      this.getPage()
    },
    // 需求更改，此方法使用不到
    // sortPage() {
    //   if (this.sortForm.type == '') {
    //     this.currentSort = null
    //     this.activeIndex = null
    //   } else {
    //     this.activeIndex = this.sortForm.type === 'Earliest date first' ? 0 : 1 // 切换索引
    //     if (this.activeIndex === null) {
    //       // 如果之前没有激活的索引，则默认激活第一个
    //       this.activeIndex = 0
    //     }
    //   }
    //   this.sortFormPopover = false
    //   this.queryParams.prop = this.sortForm.names
    //   this.queryParams.orderBy = this.sortForm.type
    //   if (this.sortForm.type == 'Latest date first') {
    //     this.queryParams.orderBy = 'DESC'
    //   }
    //   if (this.sortForm.type == 'Earliest date first') {
    //     this.queryParams.orderBy = 'ASC'
    //   }
    //   this.getPage()
    // },
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getPage()
    },
    getPage() {
      this.loading = true
      if (this.queryParams.statusList.includes('all')) {
        this.queryParams.statusList = []
      }
      this.updateHasContent()
      this.shipmentReport()
      getPage(this.queryParams).then(response => {
        for (var i = 0; i < response.data.list.length; i++) {
          var tempItem = response.data.list[i]
          tempItem.key = 'Orders' + tempItem.id
        }
        this.tableData = response.data.list
        this.lineTotal = response.data.total
        this.expanded = {}
        this.loading = false
      })
    },
    updateHasContent() {
      this.advancedQueryFormPopover = false
      this.hasContent =
        (this.queryParams.etaDateRange && this.queryParams.etaDateRange.length > 0) ||
        (this.queryParams.etdDateRange && this.queryParams.etdDateRange.length > 0) ||
        this.queryParams.vesselList.length ||
        this.queryParams.voyageList.length ||
        this.queryParams.customer ||
        this.queryParams.originPortList.length ||
        this.queryParams.polList.length ||
        this.queryParams.statusList.length
    },
    toggleDetails(index) {
      console.log('toggleDetails122', index)
      this.$set(this.expanded, index, !this.expanded[index])
      // 处理订单行
      this.linesLoading = true
      getOrderHeaderListByShipmentId({ shipmentId: index }).then(res => {
        console.log('结果返回值', res.data)
        this.dataList = []
        this.lines = []
        res.data.forEach(row => {
          let items = []

          const header = {
            id: row.id,
            orderNumber: row.orderNumber,
            otb : row.otb,
          }
          // 生成行数据
          row.items.forEach(item => {
            console.log(item)
            const tmp = {
              id: item.id,
              orderId: item.orderId,
              orderNumber: row.orderNumber,
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
              length: item.length,
              width: item.width,
              height: item.height,
              // 计划的crd
              plannedCrd: row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000,
              // supplier 实际传的crd
              supplierCrd: row.cargoReadyDate,
              //deliveryDate: row.deliveryDate,
              targetETA: parseDateTime(row.deliveryDate - 42 * 24 * 60 * 60 * 1000) + ` to ` + parseDateTime(row.deliveryDate - 14 * 24 * 60 * 60 * 1000)
            }
            tmp.orderedOuter = item.outerQty
            tmp.orderedInner = item.tcQty
            tmp.bookedOuter = item.booked
            tmp.bookedInner = item.bookedInner
            tmp.bookedPieces = item.bookedPieces
            tmp.isChildrenToy=item.isChildrenToy
            tmp.isCeramicProducts=item.isCeramicProducts
            tmp.nos=item.nos
            tmp.supplyModel = row.supplyModel,
            tmp.otb=header.otb?header.otb:''
            tmp.sanitaryRisk=item.sanitaryRisk
            tmp.grossWeight = (tmp.bookedOuter * tmp.outerWeight).toFixed(3)
            tmp.volume = ((tmp.bookedOuter * tmp.length * tmp.width * tmp.height) / 1000000).toFixed(3) // 体积单位是立方米，长宽高为厘米单位，转换为立方米需要除以1000000

            items = [...items, tmp]
          })
          this.lines = [...this.lines, ...items]
          header.items = items
          this.dataList = [...this.dataList, header]
        })
        this.linesDic[index] = [...this.lines]
        console.log(index)
        console.log(this.linesDic)
        this.linesDic = JSON.parse(JSON.stringify(this.linesDic))
        // dataList 抽取orderNumber，使用逗号连接
        // const orderNumbers = this.dataList.map(item => item.orderNumber).join(',')
        const orderNumbers = this.dataList.map(item => item.orderNumber)
        const itemNames = this.lines.map(item => item.itemName)
        const result = {
          orderNumbers: Array.from(new Set(orderNumbers)),
          itemNames: Array.from(new Set(itemNames))
        }
        this.linesLoading = false
        console.log(result)
      })
    },
    /** 导出按钮操作 */
    handleExportSO() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = JSON.parse(JSON.stringify(this.queryParams))

          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          return exportSO(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_CarrierBooking' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    handleExportAll() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = JSON.parse(JSON.stringify(this.queryParams))
          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          // if(this.$auth.hasPermi("shipment:customer")) {
          //   return exportShipmentExcel(params);
          // } else {
          return exportPOAll(params)
          // }
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_CarrierBooking' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport2() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = JSON.parse(JSON.stringify(this.queryParams))
          console.log('params', params)
          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          // if(this.$auth.hasPermi("shipment:customer")) {
          //   return exportShipmentExcel(params);
          // } else {
          return exportPO2(params)
          // }
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_CarrierBooking' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    handleExportContainer() {
      var ids = this.shipmentInfo.shipmentIds
      console.log(ids.length)

      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          this.exportLoading = true
          return exportShippedExcel({ ids: ids })
        })
        .then(response => {
          this.$download.excel(response, 'Shipped_Containers_Data' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    // 处理shippingInstruction下载逻辑
    handleExportShippingInstruction() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          let params = JSON.parse(JSON.stringify(this.queryParams))

          params.pageNo = undefined
          params.pageSize = undefined
          this.exportLoading = true
          return exportShippingInstruction(params)
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_ShippingInstruction' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },

    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    },
    subscribe(item) {
      const values = item.bookingItemResVOS.map(value => value.orderId).join(',')
      console.log(values)

      item.bookingItemResVOS.steam
      var req = {
        shipmentId: item.id,
        type: 2,
        orderNumber: item.poNumbers
        // 'orderId': values,
      }
      if (item.subscribe) {
        deleteSubscribe(item.subscribeId).then(res => {
          item.subscribe = !item.subscribe
        })
      } else {
        createSubscribe(req).then(res => {
          item.subscribe = !item.subscribe
          console.log(res)
          item.subscribeId = res.data
        })
      }
      this.getPage()
    },
    clickPort(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item])
      var ports = []
      for (var key in this.checkedPort) {
        if (this.checkedPort[key]) {
          ports.push(key)
        }
      }
      this.queryParams.ports = ports
      this.getPage()
    },
    onDeparture() {
      if (this.queryParams.statusList.includes('vesselDeparture')) {
        this.queryParams.statusList.splice('vesselDeparture', 1)
      } else {
        this.queryParams.statusList.push('vesselDeparture')
      }
      this.getPage()
    },
    onArrived() {
      if (this.queryParams.statusList.includes('vesselArrived')) {
        this.queryParams.statusList.splice('vesselArrived', 1)
      } else {
        this.queryParams.statusList.push('vesselArrived')
      }
      this.getPage()
    },
    // 处理 ATD 日期范围变化
    handleAtdDateChange(val) {
      if (val && val.length === 2) {
        // 开始日期设置为 00:00:00
        const startDate = new Date(val[0]);
        startDate.setHours(0, 0, 0, 0);

        // 结束日期设置为 23:59:59
        const endDate = new Date(val[1]);
        endDate.setHours(23, 59, 59, 999);

        // 格式化为字符串（根据 value-format 格式）
        const formatDate = (date) => {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          const h = String(date.getHours()).padStart(2, '0');
          const min = String(date.getMinutes()).padStart(2, '0');
          const s = String(date.getSeconds()).padStart(2, '0');
          return `${y}-${m}-${d} ${h}:${min}:${s}`;
        };

        this.$set(this.queryParams, 'atdDateRange', [
          formatDate(startDate),
          formatDate(endDate)
        ]);
      }
    },
    groupByCountryAndSuppliercode() {
      groupByCountryAndSuppliercode().then((res) => {
        this.country = res.data.country;
      })
    },
  }
}
</script>
<style lang="scss">
.car-css {
  padding-bottom: 4px;
}
span.el-descriptions-item__label.shipment-status-class {
  margin-right: 0px !important;
}

.sort-page {
  margin-top: -3px;
  font-size: 13px;
  display: inline-flex;
}
.sort-page .active {
  color: red; /* 或者你想要的任何颜色 */
}
.customer-request sup.el-badge__content.is-fixed {
  font-size: 14px;
  right: 15px;
}

.flex-card {
  .el-card__body {
    display: flex;
    align-items: flex-start;
  }

  :deep(.el-card__body) {
    display: flex;
  }
}
</style>

<style lang="scss" scoped>
  .mr-4 {
  margin-right: 4px;
}

/* Ceramic Products 的紫色标签样式 */
::v-deep .tag-purple.el-tag--info {
  background-color: #9b59b6;
  border-color: #8e44ad;
  color: #fff;
}

/* 多选标签的折叠样式优化 */
::v-deep .el-select__tags {
  max-width: calc(100% - 32px);
}
</style>
