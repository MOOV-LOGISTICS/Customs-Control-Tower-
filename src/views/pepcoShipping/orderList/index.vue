<template xmlns="">
  <div class="app-container">
    <el-dialog title="Carrier" :visible.sync="dialogVisibleCarrier" width="640px">
      <ChooseCarrier @change-value="changeParentValue"></ChooseCarrier>
    </el-dialog>
    <el-dialog title="Carrier" :visible.sync="airDialogVisibleCarrier" width="640px">
      <ChooseAir :air-line="airLine" @change-value="changeParentValue"></ChooseAir>
    </el-dialog>

    <div style="margin-bottom: 20px;">
      <el-card style="background: transparent;box-shadow: none!important;   ">
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;" @click="bookedChange(false)" :class="{ 'avticePort': queryParams.shippingBooking == false }">
            <p style="font-size: 20px;">{{ notShipmentNum }}</p>
            <p>Not Booked (Carrier)</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;" @click="bookedChange(true)" :class="{ 'avticePort': queryParams.shippingBooking == true }">
            <p style="font-size: 20px;">{{ shipmentNum }}</p>
            <p>Booked (Carrier)</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;"
            @click="newBookingChange(true)"
            :class="{ 'avticePort': queryParams.shippingNewBooking == true }"
          >
            <p style="font-size: 20px;">{{ newBookingNum }}</p>
            <p>OHA Check</p>
          </div>
        </el-card>

        <!--
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C"
            strokeLinejoin="miter" strokeLinecap="square" />
          <div
            style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;"
            @click="pendingBookingChange(true)" :class="{ 'avticePort': queryParams.pepcoPendingBooking == true }">
            <p style="font-size: 20px;">{{ pendingNum }}</p>
            <p>Pending</p>
          </div>
        </el-card>-->

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div
            style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;"
            @click="awaitBookingChange(true)"
            :class="{ 'avticePort': queryParams.awaitApprovalBooking == true  }"
          >
            <p style="font-size: 20px;">{{ awaitApprovalNum }}</p>
            <p>Awaiting Approval</p>
          </div>
        </el-card>
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <div style="text-align: center; height: 48px; width: 140px;" v-if="downloadLoading">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" text-color="white" class="ripple-progress"></el-progress>
            <div style="margin-top: 5px;">Exporting</div>
          </div>
          <span @click="onDownloadExcel" v-else>
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>
      </el-card>
    </div>

    <el-card style="padding: 20px; ">
      <div style="padding-bottom: 20px;margin-bottom: 20px;">
        <!-- 搜索工作栏 -->
        <div style="padding: 10px 0px;">
          <div style="float: left;">
            <el-input v-model="queryParams.soRef" placeholder="MOOV ref" clearable @blur="queryParams.soRef = $event.target.value.trim()" @keyup.enter.native="triggerFilter" @clear=" handleQuery()" />
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-input v-model="queryParams.customerRef" placeholder="Order Number" @blur="queryParams.customerRef = $event.target.value.trim()" @keyup.enter.native="triggerFilter" clearable @clear=" handleQuery()" />
          </div>

          <div style="float: left;margin-left: 5px;"></div>
          <!-- <div style="float: left;margin-left: 5px;">
            <el-select filterable clearable placeholder="Customer" v-model="queryParams.customerId"
              @clear="handleQuery">
              <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>-->

          <div style="float: left;margin-left: 5px;">
            <el-input
              v-model="queryParams.shipperRef"
              placeholder="Shipper Ref"
              @blur="queryParams.shipperRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1, handleQuery()"
              clearable
              @clear=" handleQuery()"
            />
          </div>

          <div style="float: left;margin-left: 5px;">
            <!-- <el-select clearable v-model="queryParams.freightMethod" :placeholder="$t('booking.transportMode')" filterable> -->
            <el-select clearable multiple v-model="queryParams.freightMethod" :placeholder="$t('booking.transportMode')" filterable>
              <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </div>

          <div v-hasPermi="['shipment:create']" style="float: right;">
            <el-button type="primary" @click="createShipment">Create Shipment</el-button>
          </div>
          <div v-hasPermi="['preassign:create']" style="float: right;margin-right: 10px;">
            <el-button @click="preAssgineOpen" size="mini" type="primary">Transport Pre-assign</el-button>
          </div>
          <div v-hasPermi="['pepco:shipping-order:batch-approval']" style="float: right;margin-right: 10px;">
            <el-button type="primary" @click="handleBatchApproval">Batch Approval</el-button>
          </div>

          <el-button style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
          <div style="float:left;margin-left: 5px;">
            <el-popover placement="bottom" title=" " popper-class="popover-filter" width="400" trigger="click">
              <el-form>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select multiple clearable v-model="queryParams.dcList" placeholder="DC Code" filterable>
                      <el-option v-for="item in dcDataList" :key="item.id" :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select clearable v-model="queryParams.carrier" placeholder="Carrier" filterable>
                      <el-option v-for="item in carrierList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select v-model="queryParams.transportMeanName" filterable remote reserve-keyword clearable :remote-method="remoteMethod" placeholder="Vessel">
                      <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="queryParams.voyage" placeholder="Voyage" clearable />
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                      <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select clearable v-model="queryParams.country" placeholder="Origin Country" filterable>
                      <el-option v-for="item in countryList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select filterable clearable placeholder="SO Type" v-model="queryParams.shipmentType">
                      <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select filterable clearable placeholder="Status" v-model="queryParams.status">
                      <el-option label="MOOV-OHA Pending" value="0" />
                      <el-option label="MOOV-OHA Accepted" value="1" />
                      <el-option label="MOOV-OHA Rejected" value="2" />
                      <el-option label="SAApproved" value="4" />
                      <el-option label="Awaiting Approval" value="5" />
                      <el-option label="Pepco Pending" value="6" />
                      <el-option label="Pepco Rejected" value="7" />
                    </el-select>
                  </el-col>
                </el-row>

                <!-- <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select clearable placeholder="Shipper Booked POL" filterable v-model="queryParams.originPort">
                      <el-option v-for="(item, index) in polOptions" :key="index + 'pol'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select clearable placeholder="Shipper Booked POD" filterable v-model="queryParams.destinationPort">
                      <el-option v-for="(item, index) in podOptions" :key="index + 'pod'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                    </el-select>
                  </el-col>
                </el-row>-->

                <!-- zane 级联 -->

                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-cascader v-model="queryParams.polArray" :options="polCascaderOptions" :props="{ expandTrigger: 'hover' }" @change="handlePolChange" clearable filterable placeholder="Shipper Booked POL" />
                  </el-col>
                  <el-col :span="12">
                    <el-cascader v-model="queryParams.podArray" :options="podCascaderOptions" :props="{ expandTrigger: 'hover' }" @change="handlePodChange" clearable filterable placeholder="Shipper Booked POD" />
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-cascader v-model="queryParams.tplArray" :options="tplCascaderOptions" :props="{ expandTrigger: 'hover' }" @change="handleTplChange" clearable filterable placeholder="Transport Plan POL" />
                  </el-col>
                  <el-col :span="12">
                    <el-cascader v-model="queryParams.tpdArray" :options="tpdCascaderOptions" :props="{ expandTrigger: 'hover' }" @change="handleTpdChange" clearable filterable placeholder="Transport Plan POD" />
                  </el-col>
                </el-row>
                <!-- <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select clearable placeholder="Transport Plan POL" filterable v-model="queryParams.tpl">
                      <el-option v-for="item in TPLOptions" :label="item.name + ' (' + item.code + ')'" :value="item.code" />
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select clearable placeholder="Transport Plan POD" filterable v-model="queryParams.tpd">
                      <el-option v-for="item in TPDOptions" :label="item.name + ' (' + item.code + ')'" :value="item.code" />
                    </el-select>
                  </el-col>
                </el-row>-->
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select clearable v-model="queryParams.atdFlag" placeholder="ATD">
                      <el-option label="Departed" value="1"></el-option>
                      <el-option label="Not Departed" value="0"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select clearable v-model="queryParams.ataFlag" placeholder="ATA">
                      <el-option label="Arrived" value="1"></el-option>
                      <el-option label="Not Arrived" value="0"></el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <!--                <el-row :gutter="10" style="margin-bottom: 15px;">-->

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
                </el-col>-->
                <!--                </el-row>-->

                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="queryParams.latestHod"
                      clearable
                      type="daterange"
                      range-separator="-"
                      start-placeholder="Latest HOD From"
                      end-placeholder="Latest HOD To"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="margin-bottom: 15px;"
                    ></el-date-picker>
                  </el-col>
                  <el-col :span="24">
                    <el-date-picker v-model="queryParams.latestCrd" clearable type="daterange" range-separator="-" start-placeholder="Latest CRD From" end-placeholder="Latest CRD To" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px;" v-if="checkPermi(['pepco:shipping-order:miss_in_dc_date_log'])">
                  <el-col :span="12">
                    <!-- 添加MissInDC 选择框 -->
                    <el-select v-model="queryParams.missInDC" placeholder="Miss In DC Date" clearable>
                      <el-option label="Yes" value="true" />
                    </el-select>
                  </el-col>
                  <el-col :span="12" v-if="checkPermi(['pepco:shipping_order:overdue_booked_etd_log'])">
                    <el-select v-model="queryParams.overdueBookedETD" placeholder="Overdue Booked ETD" clearable>
                      <el-option label="Yes" value="true" />
                    </el-select>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select v-model="queryParams.incoterm" placeholder="Incoterm" clearable>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SHIPPING_INCOTERM)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-col>
                </el-row>
                <!-- <el-row :gutter="20" style="margin-bottom: 15px;">
                  <el-col style="text-align: right">
                    <el-button @click="handleQuery()" icon="el-icon-search" style="background-color: #004F7C; color: white;" plain>Search</el-button>
                  </el-col>
                </el-row>-->
              </el-form>
              <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'#004F7C':''}">Filter</el-button>
              <el-button slot="reference" @click="clearFilters" plain>Clear Filters</el-button>
            </el-popover>
          </div>
        </div>
        <!-- 列表 -->
        <div :style="{ height: clientHeight + 'px' }" style="float: left; width: calc(100%); position: relative;" v-loading="loading">
          <div style="overflow-y:auto; overflow-x: hidden;" :style="{ height: (clientHeight - 55) + 'px' }">
            <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
            <el-row v-for="(item, index) in list" :key="item.id" :gutter="0" style=" background: #fff;box-shadow: none!important;border: 1px solid #ddd;" class="margin-top">
              <el-col :span="24" style="padding-top: 10px; padding-bottom: 10px;">
                <el-descriptions style="box-shadow: none; margin-bottom: -5px;" :colon="false" :column="5">
                  <!-- 第一行 -->
                  <el-descriptions-item label="MOOV ref">
                    <el-link type="primary" style="margin-top: -1px;" :href="getDetailUrl(item)" @click.prevent="goToDetail(item, index)" target="_blank">{{ item.soRef }}</el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipper ref">{{ item.shipperRef }}</el-descriptions-item>
                  <el-descriptions-item
                    :labelStyle="{ whiteSpace: 'nowrap' }"
                    :contentStyle="{ whiteSpace: 'nowrap' }"
                    label="Shipper Booked / Transport Plan POL"
                  >{{ item.originPort ? item.originPort : '-' }} / {{ item.transportPlanPOL ? item.transportPlanPOL : '-' }}</el-descriptions-item>
                  <el-descriptions-item
                    :labelStyle="{ whiteSpace: 'nowrap' }"
                    :contentStyle="{ whiteSpace: 'nowrap' }"
                    label="Shipper Booked / Transport Plan POD"
                  >{{ item.destinationPort ? item.destinationPort : '-' }} / {{ item.transportPlanPOD ? item.transportPlanPOD : '-' }}</el-descriptions-item>
                  <el-descriptions-item label=" " :labelStyle="{ display: 'none' }">
                    <span class="no-label" v-if="item.shipmentId">
                      <el-tag style=" font-size: 14px;">Booked</el-tag>
                    </span>
                    <span class="no-label" v-if="(item.shipmentId == null || item.shipmentId == 0 ) && item.preAssign">
                      <el-tag style=" font-size: 14px;">Pre Assigned</el-tag>
                    </span>
                  </el-descriptions-item>
                  <!-- <el-descriptions-item label="Task Status">
                    <span @click="showTask(item,item.orderTaskDOS,index)" style="text-decoration: underline;cursor: pointer;">
                      {{ item.taskStatus }}
                    </span>
                  </el-descriptions-item>-->

                  <!-- 第二行 -->
                  <template v-if="!isPepcoAndNull(item)">
                    <el-descriptions-item label="Customer">{{ item.customerName }}</el-descriptions-item>
                  </template>
                  <template v-if="isPepcoAndNull(item)">
                    <el-descriptions-item label="SO Type">{{ item.shipmentType }}</el-descriptions-item>
                  </template>
                  <el-descriptions-item label="Shipper">{{ decodeHtml(item.shipperCompany) }}</el-descriptions-item>
                  <el-descriptions-item label="Consignee">{{ decodeHtml(item.consigneeCompany) }}</el-descriptions-item>
                  <el-descriptions-item label="Notify Party">{{ decodeHtml(item.notifyCompany) }}</el-descriptions-item>

                  <!-- 显示当前shipping的状态 edwin-->
                  <el-descriptions-item label=" " :labelStyle="{ display: 'none' }">
                    <div>
                      <span class="no-label" v-if="item.status == 0">
                        <el-tag type="warning" style=" font-size: 14px;">MOOV-OHA Pending</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 1">
                        <el-tag type="success" style=" font-size: 14px;">MOOV-OHA Accepted</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 2">
                        <el-tag type="danger" @click="showDetail(item)" style="cursor: pointer; font-size: 14px; ">MOOV-OHA Rejected</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 4">
                        <el-tag type="success" style="font-size: 14px;">SAApproved</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 5">
                        <el-tag type="warning" style="font-size: 14px;">Awaiting Approval</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 6">
                        <el-tag type="warning" style="font-size: 14px;">Pepco Pending</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status == 7">
                        <el-tag type="danger" @click="showDetail(item)" style=" cursor: pointer;font-size: 14px;">Pepco Rejected</el-tag>
                      </span>
                    </div>
                  </el-descriptions-item>
                  <!-- 第三行 -->
                  <template v-if="!isPepcoAndNull(item)">
                    <el-descriptions-item label="SO Type">{{ item.shipmentType }}</el-descriptions-item>
                    <el-descriptions-item v-if="item.shipmentScore" label="Shipper Booking Score">{{ item.shipmentScore }}</el-descriptions-item>
                    <el-descriptions-item label=" " v-else>{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                  </template>
                  <!-- 第三行  展示shipmentScore-->
                  <template v-else-if="isPepcoAndNull(item)">
                    <el-descriptions-item v-if="item.shipmentScore" label="Shipper Booking Score">{{ item.shipmentScore }}</el-descriptions-item>
                    <el-descriptions-item label=" " v-else>{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <!-- 第四行 -->
                    <!-- 显示当前shipment的container类型 -->
                    <template>
                      <template v-if="item.shipmentType === 'FCL' && item.containerDOList && item.containerDOList.length > 0">
                        <el-descriptions-item label=" " :labelStyle="{ display: 'none' }" :span="item.containerDOList.length" contentStyle="display: flex; flex-wrap: wrap; align-items: center;">
                          <el-tag v-for="container in item.containerDOList" :key="container.id" style="font-size: 13px;">{{ container.type }} x {{ container.qty }}</el-tag>
                        </el-descriptions-item>
                      </template>
                      <el-descriptions-item label=" " v-else>{{ }}</el-descriptions-item>
                    </template>
                  </template>
                  <template v-if="isPepcoAndNull(item)">
                    <el-descriptions-item v-if="item.latestHod" label="Latest HOD in Booking">{{parseUTCTime(item.latestHod) }}</el-descriptions-item>
                    <el-descriptions-item label=" " v-else>{{ }}</el-descriptions-item>
                    <el-descriptions-item v-if="item.latestCrd" label="Latest CRD in Booking">
                      {{parseUTCTime(item.latestCrd) }}
                      <i v-hasPermi="['pepco:shipping-order:updatecrd']" @click="updateShippingOrderAllCrd(item)" style="cursor: pointer;" class="el-icon-edit"></i>
                    </el-descriptions-item>
                    <el-descriptions-item label=" " v-else>{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                    <el-descriptions-item label=" ">{{ }}</el-descriptions-item>
                  </template>

                  <el-descriptions-item label="Batteries">{{ item.batteries == 2 ? 'YES' : 'NO' }}</el-descriptions-item>
                  <el-descriptions-item label="DG">{{ item.dg ? 'YES' : 'NO' }}</el-descriptions-item>

                  <el-descriptions-item label="Transport Mode(Booked)">
                    <span :class="{ 'error-text': !item.freightMethod || item.freightMethod.toUpperCase() !== 'SEA' }">{{ item.freightMethod ? item.freightMethod.toUpperCase() : '-' }}</span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Incoterm(Booked)">
                    <span :class="{ 'error-text': !item.incoterm || item.incoterm.toUpperCase() !== 'FOB' }">{{ item.incoterm ? item.incoterm.toUpperCase() : '-' }}</span>
                  </el-descriptions-item>

                  <!-- Acceppt and Reject 操作按钮(对号和叉号) -->
                  <el-descriptions-item label>
                    <div style="float: right">
                      <!-- Ethan: 如果是刚提交或者pepco reject（回退到shipper booking validation）则可以重新shipper booking validation（accept或reject） -->
                      <span class="no-label" v-if="item.status == 0||item.status == 7">
                        <div v-if="(item.shipmentId == null || item.shipmentId == 0 ) && showCheckBtn">
                          <el-popconfirm :title="'Accepted ' + item.soRef + '?'" @confirm="handleUpdateStatusConfirm(item.id, 1, null)">
                            <el-button class="el-icon-check" slot="reference" type="success" style=" position: absolute;cursor: pointer;right: 85px; top: 0px;"></el-button>
                          </el-popconfirm>
                          <el-button class="el-icon-close" slot="reference" style="position: absolute;cursor: pointer;right: 30px; top: 0px;" type="warning" @click="closeShipping(item.id)"></el-button>
                        </div>
                      </span>

                      <span class="no-label" v-hasPermi="['shipment:create']" v-if="(item.status == 4  || item.status ==1 || item.status ==5 )  && !item.shipmentId">
                        <el-checkbox
                          size="medium"
                          border
                          v-model="shippingIds"
                          :label="item.id"
                          :key="item.id"
                          :value="item.id"
                          @change="checkType(item)"
                          style="border: 1px solid #409eff;position: absolute;cursor: pointer;right: 65px;top: 0px;"
                        ></el-checkbox>
                      </span>
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item label="Named Place(Booked)">
                    {{ namedPlaceLabel(item.namedPlace) }}
                  </el-descriptions-item>

                  <el-descriptions-item label>
                    <div style="float: right">
                      <svg
                        v-if="!expanded[item.id]"
                        @click="toggleDetails(item.id)"
                        style="position: absolute;cursor: pointer; right: 10px; top:35px"
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
                        style="position: absolute;cursor: pointer;right: 10px;top:35px "
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <div>
                <el-descriptions style="box-shadow: none;height: 100%; width: 100%;  margin: 0px;" :colon="false" :column="5">
                  <el-descriptions-item label>
                    <el-collapse-transition>
                      <div v-show="expanded[item.id]" style="width: 100%;">
                        <el-tabs :ref="'tab-ax' + item.id" v-model="item.show" @tab-click="handleClick($event, item, index)">
                          <el-tab-pane label="PO" :name="'first' + item.id" class="tab-bottom-css">
                            <order-list-po-detail :shipping-order-id="item.id" :booked-eta="item.bookedEta" @goto-dc-reason-log="switchToDcReasonLog(item, index)"></order-list-po-detail>
                          </el-tab-pane>
                          <el-tab-pane label="Transport Pre-assign" :name="'pre-assign' + item.id" style="width: 95%">
                            <!-- <el-empty v-if="item.bookingPreAssignDOS.length == 0"></el-empty>

                            <el-table v-if="item.bookingPreAssignDOS.length > 0" border :data="item.bookingPreAssignDOS" style="width: 100%">
                              <el-table-column prop="time" label="Create Time" min-width="140px">
                                <template slot-scope="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
                              </el-table-column>

                              <el-table-column prop="event" label="Event" width="100px">
                                <template slot-scope="scope">
                                  {{ (scope.row.type == null|| scope.row.type == '') ? (scope.row.status ==
                                  'transportassigned'?'Carrier Booking':'Pre - assign'):scope.row.type }}
                                </template>
                              </el-table-column>
                              <el-table-column prop="status" label="Status" width="80px">
                                <template slot-scope="scope">
                                  {{ getPreAssignStatus(scope.row.type, scope.row.status)
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column prop="carrier" label="Carrier" width="55px"></el-table-column>
                              <el-table-column prop="por" label="POR" width="55px"></el-table-column>
                              <el-table-column prop="fnd" label="FND" width="55px"></el-table-column>
                              <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
                              <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
                              <el-table-column prop="vessel" label="Vessel"></el-table-column>
                              <el-table-column prop="voyage" label="Voyage"></el-table-column>
                              <el-table-column prop="service" label="Service"></el-table-column>
                              <el-table-column prop="etd" label="Booked ETD/ETA" width="150px">
                                <template slot-scope="scope">
                                  {{
                                  (scope.row.bookedEtd ? parseUTCTime(scope.row.bookedEtd) : '-') + ' / '+(scope.row.bookedEta?parseUTCTime(scope.row.bookedEta):' - ') }}
                                </template>
                              </el-table-column>
                              <el-table-column prop="eta" label="ETD/ETA" width="150px">
                                <template slot-scope="scope">{{ (scope.row.etd ? parseUTCTime(scope.row.etd) : '-') + ' / '+(scope.row.eta?parseUTCTime(scope.row.eta):' - ') }}</template>
                            </el-table-column>-->
                            <!-- <el-table-column prop="reason" label="Revoke Reason" width="120px">
                                <template slot-scope="scope">
                                  <el-popover placement="bottom" width="400" trigger="hover">
                                    <el-descriptions :column="1" style="box-shadow: none; border: none;">
                                      <el-descriptions-item label="Cancel Category">
                                        {{
                                        selCancelCategory1.filter(item => item.enumId == scope.row.rejectReason).length
                                        > 0 ? selCancelCategory1.filter(item =>
                                        item.enumId == scope.row.rejectReason)[0].description : scope.row.rejectReason
                                        }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="Cancel Reason">
                                        {{
                                        selCancelReason1.filter(item => item.enumId == scope.row.rejectReason1).length >
                                        0 ? selCancelReason1.filter(item =>
                                        item.enumId ==
                                        scope.row.rejectReason1)[0].description : scope.row.rejectReason1
                                        }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="Cancel Remark">{{ scope.row.rejectComments
                                        }}</el-descriptions-item>
                                    </el-descriptions>
                                    <el-button v-show="scope.row.rejectReason1 != null" slot="reference"
                                      style="margin: 0;padding: 0;" type="text">
                                      <el-tag>View Reason</el-tag>
                                    </el-button>
                                  </el-popover>
                                  <span v-hasPermi="['booking:reason:edit']" v-show="scope.row.rejectReason1 != null"
                                    @click="editReason(scope.row)">
                                    <i class="el-icon-edit" />
                                  </span>
                                </template>
                            </el-table-column>-->
                            <!-- <el-table-column prop="shipmentRef" label="Shipment Ref" width="150px">
                                <template slot-scope="scope">
                                  <el-link type="primary" :href="'/shipment/detail?id=' + scope.row.shipmentId"
                                  target="_blank">{{ scope.row.shipmentNumber }}</el-link>
                                  {{ scope.row.shipmentNumber }}
                                </template>
                            </el-table-column>-->
                            <!-- <el-table-column prop="user" label="Update User" min-width="100px">
                                <template slot-scope="scope">{{ getUserName(scope.row.creator) }}</template>
                            </el-table-column>-->
                            <!-- </el-table> -->
                            <!-- 空运 -->
                            <AirTransportPreAssign v-if="item.freightMethod == 'air'" :ref="'airPreAssign' + item.id" :shippingOrderId="item.id" />


                            <!-- sea-air -->
                            <SeaAirTransportPreAssign v-if="item.freightMethod == 'sea_air'" :ref="'seaAirPreAssign' + item.id"
                              :shippingOrderId="item.id?item.id:0"
                              :pre-assign-list="item.bookingPreAssignDOS || []"
                              :source="list"
                              />



                            <!-- 海运 -->
                            <SeaTransportPreAssign
                              v-else
                              :pre-assign-list="item.bookingPreAssignDOS || []"
                            />

                          </el-tab-pane>
                          <el-tab-pane label="Comments" :name="'Comments' + item.id" :key="'Comments' + item.id">
                            <order-comment ref="orderComments" :order-id="item.id" order-type="2" :no-title="true" />
                          </el-tab-pane>
                          <el-tab-pane label="Documents" :name="'Documents' + item.id">
                            <view-po-management-documents ref="managementDocuments"></view-po-management-documents>
                          </el-tab-pane>
                          <el-tab-pane label="Operation Log" :name="'Logs' + item.id">
                            <el-timeline style="margin-top: 20px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
                              <el-timeline-item :timestamp="logs.userName + '   ' + formatUserLocalTime(logs.createTime, logs.timeZone, logs.timeZoneOffset)" placement="top" v-for="(logs, x) in item.statusLogDOS" :key="x">
                                <h4>{{ covStatus(logs.status) }}</h4>
                                <div v-if="logs.status == 6">
                                  <el-link type="primary" :href="'/shipment/amendShipping?id=' + item.id + '&apId=' + logs.apId" target="_blank">{{ item.soRef }}</el-link>
                                </div>
                                <div style="max-height: 200px;" v-html="logs.remark"></div>
                              </el-timeline-item>
                            </el-timeline>
                          </el-tab-pane>
                          <el-tab-pane label="Miss In DC Date Log" v-if="checkPermi(['pepco:shipping-order:miss_in_dc_date_log'])" :name="'DCReasonLogs' + item.id">
                            <div v-loading="dcLoading">
                              <!-- 添加按钮 -->
                              <div style="margin-bottom: 16px;  ">
                                <el-button type="primary" size="small" @click="showAddReasonDialog(item, index)">Add</el-button>
                              </div>

                              <!-- 时间线日志列表 -->
                              <el-timeline v-if="item.dcReasonLogs && item.dcReasonLogs.length > 0" style="max-height: 300px; overflow: auto;">
                                <el-timeline-item v-for="(log, index) in item.dcReasonLogs" :key="index" :timestamp="log.creator + '   ' +formatUserLocalTime(log.createTime, log.timeZone, log.timeZoneOffset)" placement="top">
                                  <div>
                                    <span style="color: #409eff;">{{ log.reasonType }}</span>
                                    <p>{{ log.reasonContent }}</p>
                                    <p>{{ log.reasonRemark }}</p>
                                  </div>
                                </el-timeline-item>
                              </el-timeline>
                              <div v-else class="empty-log"></div>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="Overdue Booked ETD Log" name="OverdueBookedETDLog" v-if="checkPermi(['pepco:shipping_order:overdue_booked_etd_log'])">
                            <overdue-booked-e-t-d-tab :row-info="item" :tab-name="item.show" />
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                    </el-collapse-transition>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-row>
          </div>
          <!-- 分页组件 -->
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getList" />
        </div>
      </div>
    </el-card>

    <!-- 添加原因弹框 -->
    <el-dialog :title="'Add'" :visible.sync="addReasonDialogVisible" width="700px">
      <el-form :model="reasonForm" ref="reasonForm" :rules="reasonFormRules" size="mini">
        <el-form-item label="Category" prop="reasonType" label-width="160px">
          <!-- 如果改变了reasonType，就清空reasonContent -->
          <el-select v-model="reasonForm.reasonType" placeholder=" " @change="reasonForm.reasonContent = ''">
            <!-- 筛选出missDCList重复label的数据相同的只保留一条 -->
            <el-option v-for="item in missDCList.filter((item, index, arr) => arr.findIndex(t => t.label === item.label) === index)" :key="item.id" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Reason Description" prop="reasonContent" label-width="160px">
          <el-select clearable v-model="reasonForm.reasonContent" placeholder=" ">
            <!-- 根据reasonType 动态展示 ,筛选出missDCList里面相同label的数据  -->
            <el-option v-for="item in missDCList.filter(item => item.label == reasonForm.reasonType)" :key="item.id" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" label-width="160px" prop="reasonRemark">
          <el-input type="textarea" v-model="reasonForm.reasonRemark" rows="1"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addReasonDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitReason()">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Rejected" :visible.sync="showCloseRemark" width="70%" append-to-body>
      <el-form label-width="0px" ref="closeShippingForm" :model="closeShippingForm" :show-message="false">
        <el-form-item label required prop="closeRemark">
          <el-input type="textarea" :rows="5" maxlength="400" show-word-limit placeholder="Remark..." v-model="closeShippingForm.closeRemark"></el-input>
        </el-form-item>
        <el-button size="mini" type="primary" style="float:right;" v-if="showCloseBut" :loading="closeShippingLoading" @click="submitCloseShipping">
          {{
          $t("purchaseOrder.confirm") }}
        </el-button>
        <el-button size="mini" style="float:right; margin-right: 10px;" :loading="closeShippingLoading" @click="showCloseRemark = false">
          {{
          $t("purchaseOrder.cancel") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
      <el-table :data="taskDetailData" style="width: 100%">
        <el-table-column prop="date" label="Task Name" width="150px">
          <template v-slot="scope">{{ scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="MOOV Ref" width="150px">
          <template v-slot="scope">
            <span style="text-decoration: underline;  cursor: pointer; color: #004F7C;  font-weight: bold;" @click="toOrder2(scope.row.orderNumber)">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="urgentDate" label="Urgent Date">
          <template v-slot="scope">{{ parseTime(scope.row.urgentDate) }}</template>
        </el-table-column>
        <el-table-column prop="dueDate" label="Due date">
          <template v-slot="scope">{{ parseTime(scope.row.dueDate) }}</template>
        </el-table-column>
        <el-table-column v-if="title.endsWith('finished')" prop="updateTime" label="Complete date">
          <template v-slot="scope">{{ parseTime(scope.row.updateTime) }}</template>
        </el-table-column>

        <el-table-column label="Actions">
          <template v-slot="scope">
            <el-popover placement="top-start" title width="200" trigger="hover" content="Send reminder">
              <i @click="sendEmail(scope.row)" slot="reference" v-if="(showTaskStatus(scope.row) == 'Overdue' || showTaskStatus(scope.row) == 'Urgent') && user.deptId != scope.row.partyId" class="el-icon-message"></i>
            </el-popover>
            <i v-show="scope.row.status == 1 && user.deptId == scope.row.partyId" @click="handleTask(scope.row)" style="cursor: pointer;" class="el-icon-edit"></i>
            <i v-if="scope.row.taskName == 'QC Approve' && scope.row.status == 2" @click="viewQcResult(scope.row)" class="el-icon-view"></i>
            <i v-if="scope.row.taskName != 'QC Approve' && scope.row.jsonData != null && scope.row.status == 2" @click="viewTask(scope.row)" class="el-icon-view"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Transport Pre-assign" :visible.sync="preAssgineVisable" width="1500px" append-to-body>
      <el-form v-loading="preAssignLoading" :show-message="true" label-width="140px" ref="preAssF" :model="preAssgineForm" style="padding: 0px;" :rules="preAssgineRules">
        <!-- Mode of Transport - zane -->
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="Mode of Transport" prop="freightMethod" required :show-message="false">
              <el-select size="mini" v-model="preAssgineForm.freightMethod" placeholder="Select Transport Mode" @change="handleTransportModeChange" class="custom-select">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- SEA 模式 -->
        <template v-if="preAssgineForm.freightMethod === 'sea'">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Carrier" prop="carrier" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.carrier" @change="onCarrierChange">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Service" prop="service" required :show-message="false">
                <el-input v-model="preAssgineForm.service"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align: right; padding-top: 5px;" v-hasPermi="['shipment:schedule-search']">
              <el-button @click="queryShippingSchedule" type="primary">Get Schedule</el-button>
            </el-col>
          </el-row>

          <!-- 港口 -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Place of receipt" prop="por" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.por">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'por'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Loading" prop="pol" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pol">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Discharge" prop="pod" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pod" @change="onDischargeChange">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Final Destination" prop="fnd" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.fnd">
                  <el-option v-for="(item, index) in finalPortOptions" :key="index + 'fnd'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- ETD + ETA + Vessel + Voyage -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="ETD" prop="etd" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.etd" @change="$refs['preAssF'].validateField('eta')" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA" prop="eta" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.eta" @change="$refs['preAssF'].validateField('etd')"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Vessel" prop="vessel" required :show-message="false">
                <el-select v-model="preAssgineForm.vessel" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
                  <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Voyage" prop="voyage" required :show-message="false">
                <el-input v-model="preAssgineForm.voyage"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- AIR 模式 -->
        <template v-if="preAssgineForm.freightMethod === 'air'">
          <!-- 第一行: Carrier + Flight + Port of Loading + Port of Discharge -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Carrier" prop="carrier" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.carrier">
                  <el-option v-for="item in airlineOptions" :key="item.iata" :label="item.airlineName + ' (' + item.iata + ')'" :value="item.iata" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Flight" prop="flight" required :show-message="false">
                <el-input v-model="preAssgineForm.flight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Loading" prop="pol" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pol">
                  <el-option v-for="(item, index) in airPortOptions" :key="index + 'pol'" :label="item.airportName + ' (' + item.iata + ')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Discharge" prop="pod" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pod">
                  <el-option v-for="(item, index) in airPortOptions" :key="index + 'pod'" :label="item.airportName + ' (' + item.iata + ')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行: ETD + ETD Time + ETA + ETA Time -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="ETD" prop="etd" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.etd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETD Time" prop="etdTime" required :show-message="false">
                <el-time-picker v-model="preAssgineForm.etdTime" value-format="HH:mm" format="HH:mm"></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA" prop="eta" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.eta"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA Time" prop="etatime" required :show-message="false">
                <el-time-picker v-model="preAssgineForm.etatime" value-format="HH:mm" format="HH:mm"></el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <!-- sea-air -->
         <template v-if="preAssgineForm.freightMethod === 'sea_air'">
          <!-- 分割线 -->
           <el-divider>sea</el-divider>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Carrier" prop="carrier" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.carrier" @change="onCarrierChange">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value"
                    :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Service" prop="service" required :show-message="false">
                <el-input v-model="preAssgineForm.service"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align: right; padding-top: 5px;" v-hasPermi="['shipment:schedule-search']">
              <el-button @click="queryShippingSchedule" type="primary">Get Schedule</el-button>
            </el-col>
          </el-row>

          <!-- 港口 -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Place of receipt" prop="por" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.por">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'por'"
                    :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Loading" prop="pol" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pol">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pol'"
                    :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Discharge" prop="pod" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.pod" @change="onDischargeChange">
                  <el-option v-for="(item, index) in portOptions" :key="index + 'pod'"
                    :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Final Destination" prop="fnd" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.fnd">
                  <el-option v-for="(item, index) in finalPortOptions" :key="index + 'fnd'"
                    :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- ETD + ETA + Vessel + Voyage -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="ETD" prop="etd" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.etd"
                  @change="$refs['preAssF'].validateField('eta')"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA" prop="eta" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.eta"
                  @change="$refs['preAssF'].validateField('etd')"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Vessel" prop="vessel" required :show-message="false">
                <el-select v-model="preAssgineForm.vessel" filterable remote reserve-keyword clearable
                  :remote-method="remoteMethod">
                  <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName"
                    :value="dict.vesselName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Voyage" prop="voyage" required :show-message="false">
                <el-input v-model="preAssgineForm.voyage"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="padding-top: 10px;">
          <el-col :span="18">
            <el-form-item label="Comments" prop="comment" :show-message="false">
              <el-input v-model="preAssgineForm.comment" type="textarea"
                placeholder="Give some additional information here..." rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


          <!-- 分割线 -->
           <el-divider>air</el-divider>
          <!-- 第一行: Carrier + Flight + Port of Loading + Port of Discharge -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="Carrier" prop="carrier" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.airCarrier">
                  <el-option v-for="item in airlineOptions" :key="item.iata"
                    :label="item.airlineName + ' (' + item.iata + ')'" :value="item.iata" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Flight" prop="flight" required :show-message="false">
                <el-input v-model="preAssgineForm.flight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Loading" prop="pol" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.airPol">
                  <el-option v-for="(item, index) in airPortOptions" :key="index + 'pol'"
                    :label="item.airportName + ' (' + item.iata + ')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Port of Discharge" prop="pod" required :show-message="false">
                <el-select filterable v-model="preAssgineForm.airPod">
                  <el-option v-for="(item, index) in airPortOptions" :key="index + 'pod'"
                    :label="item.airportName + ' (' + item.iata + ')'" :value="item.iata"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行: ETD + ETD Time + ETA + ETA Time -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="ETD" prop="etd" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.airETD"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETD Time" prop="etdTime" required :show-message="false">
                <el-time-picker v-model="preAssgineForm.etdTime" value-format="HH:mm" format="HH:mm"></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA" prop="eta" required :show-message="true">
                <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.airETA"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ETA Time" prop="etatime" required :show-message="false">
                <el-time-picker v-model="preAssgineForm.etatime" value-format="HH:mm" format="HH:mm"></el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row :gutter="24" style="padding-top: 10px;">
          <el-col :span="18">
            <el-form-item label="Comments" prop="airComment" :show-message="false">
              <el-input v-model="preAssgineForm.airComment" type="textarea"
                placeholder="Give some additional information here..." rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        </template>
        <!-- Comments -->
        <el-row v-if="preAssgineForm.freightMethod !== 'sea_air'" :gutter="24" style="padding-top: 10px;">
          <el-col :span="18">
            <el-form-item label="Comments" prop="comment" :show-message="false">
              <el-input v-model="preAssgineForm.comment" type="textarea" placeholder="Give some additional information here..." rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="text-align: right;">
          <el-button @click="preAssgineVisable = false">Cancel</el-button>
          <el-button type="primary" @click="submitPreAssign">Submit</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- <el-dialog title="Transport Pre-assign" :visible.sync="preAssgineVisable" width="1500px" append-to-body>
      <el-form v-loading="preAssignLoading" :show-message="true" label-width="140px" ref="preAssF" :model="preAssgineForm" style="padding: 0px;" :rules="preAssgineRules">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="Carrier" prop="carrier" required :show-message="false">
              <el-select filterable v-model="preAssgineForm.carrier" @change="onCarrierChange">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Service" prop="service" required :show-message="false">
              <el-input v-model="preAssgineForm.service"></el-input>
            </el-form-item>
          </el-col>
          <div style="text-align: right;padding-bottom: 10px;padding-right: 10px;" v-hasPermi="['shipment:schedule-search']">
            <el-button @click="queryShippingSchedule" type="primary">Get Schedule</el-button>
          </div>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="Place of receipt" prop="por" required :show-message="false">
              <el-select filterable v-model="preAssgineForm.por">
                <el-option v-for="(item, index) in portOptions" :key="index + 'por'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Port of Loading" prop="pol" required :show-message="false">
              <el-select filterable v-model="preAssgineForm.pol">
                <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Port of Discharge" prop="pod" required :show-message="false">
              <el-select filterable v-model="preAssgineForm.pod" @change="onDischargeChange">
                <el-option v-for="(item, index) in portOptions" :key="index + 'pod'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Final Destination" prop="fnd" required :show-message="false">
              <el-select filterable v-model="preAssgineForm.fnd">
                <el-option v-for="(item, index) in finalPortOptions" :key="index + 'fnd'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="ETD" prop="etd" required :show-message="true">
              <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.etd" @change="$refs['preAssF'].validateField('eta')" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ETA" prop="eta" required :show-message="true">
              <el-date-picker type="date" value-format="timestamp" v-model="preAssgineForm.eta" @change="$refs['preAssF'].validateField('etd')" ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Vessel" prop="vessel" required :show-message="false">
              <el-select v-model="preAssgineForm.vessel" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
                <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Voyage" prop="voyage" required :show-message="false">
              <el-input v-model="preAssgineForm.voyage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="padding-top: 10px;">
          <el-col :span="18">
            <el-form-item label="Comments" prop="comment" :show-message="false">
              <el-input v-model="preAssgineForm.comment" type="textarea" placeholder="Give some additional information here..." rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="text-align: right;">
          <el-button @click="preAssgineVisable = false">Cancel</el-button>
          <el-button type="primary" @click="submitPreAssign">Submit</el-button>
        </div>
      </el-form>
    </el-dialog>-->

    <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select placeholder="Por" filterable v-model="scheduleForm.origin">
            <el-option v-for="(item, index) in portOptions" :key="index + 'por'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select placeholder="Fnd" filterable v-model="scheduleForm.destination">
            <el-option v-for="(item, index) in portOptions" :key="index + 'fnd'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-date-picker placeholder="etd from" type="date" value-format="timestamp" v-model="scheduleForm.departureFrom" :picker-options="pickerOptions"></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-date-picker placeholder="etd to" type="date" value-format="timestamp" v-model="scheduleForm.departureFrom2" :picker-options="pickerOptions"></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-input placeholder="Service" v-model="scheduleForm.service"></el-input>
        </el-col>

        <el-col :span="4">
          <el-button @click="findShippingScheduleList" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="scheduleLoading" height="600px" :data="shippingScheduleData">
        <el-table-column sortable="custom" width="15px" type="expand">
          <template slot-scope="scope">
            <!-- none tshg -->
            <div v-if="scope.row.carrier != 'TSHG'" style="padding: 0px 40px;">
              <el-empty v-if="scope.row.tshgList.length == 0"></el-empty>
              <div style="padding-top: 10px;">
                <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                  <div>
                    <div class="vessel-title">Departure</div>
                    <div class="vessel-title">{{ scope.row.polTerminal }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Arrival</div>
                    <div class="vessel-title">{{ scope.row.podTerminal }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">SI Document</div>
                    <div class="vessel-title">{{ scope.row.siCutoff == null ? "-" : parseTimeToZ1(scope.row.siCutoff) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">VGM</div>
                    <div class="vessel-title">
                      {{ scope.row.vgmCutoff == null ? "-" : parseTimeToZ1(scope.row.vgmCutoff)
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="vessel-title">Inland Cutoff</div>
                    <div class="vessel-title">
                      {{ scope.row.inlandCutoff == null ? "-" :
                      parseTimeToZ1(scope.row.inlandCutoff)
                      }}
                    </div>
                  </div>
                </div>
                <el-row v-for="(item,index) in scope.row.tshgList">
                  <div>
                    <div style="float: left;">
                      <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">
                        {{
                        item.portCode }}
                      </div>
                      <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                      <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;">{{ item.barge }}</div>
                      <!-- Transport Mode: -->
                    </div>
                    <div style="float: left;">
                      <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                          />
                        </svg>
                      </span>
                      <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null)" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                      <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null)" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                    </div>
                    <div style="float: left;">
                      <div style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>
                      <div style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(item.eventTime) }}</div>
                      <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                        <div>
                          <div class="vessel-title">Vessel</div>
                          <div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Service</div>
                          <div class="vessel-title">{{ item.service==null?'-':item.service }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Voyage/Bound</div>
                          <div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>

                <el-row>
                  <div></div>
                </el-row>
              </div>
            </div>
            <!-- tshg -->
            <div v-if="scope.row.carrier == 'TSHG'" style="padding: 0px 40px;">
              <el-empty v-if="scope.row.tshgList.length == 0"></el-empty>
              <div style="padding-top: 10px;">
                <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                  <div>
                    <div class="vessel-title">Departure</div>
                    <div class="vessel-title">{{ scope.row.polName }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Arrival</div>
                    <div class="vessel-title">{{ scope.row.podName }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">Container Gate-In</div>
                    <div class="vessel-title">
                      {{
                      scope.row.containerGateIn == null ? "-" : parseTimeToZ1(scope.row.containerGateIn) }}
                    </div>
                  </div>
                  <div>
                    <div class="vessel-title">SI Document</div>
                    <div class="vessel-title">{{ scope.row.siDoc == null ? "-" : parseTimeToZ1(scope.row.siDoc) }}</div>
                  </div>
                  <div>
                    <div class="vessel-title">VGM</div>
                    <div class="vessel-title">{{ scope.row.vgm == null ? "-" : parseTimeToZ1(scope.row.vgm) }}</div>
                  </div>
                </div>
                <el-row v-for="(item, index) in scope.row.tshgList">
                  <div>
                    <div style="float: left;">
                      <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ item.portCode }}</div>
                      <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                      <div v-if="item.barge != 'Other'" style="font-size: 14px;line-height: 20px;text-align: right;">
                        {{
                        item.barge }}
                      </div>
                      <!-- Transport Mode: -->
                    </div>
                    <div style="float: left;">
                      <span v-show="item.barge == 'Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge == 'Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                          />
                        </svg>
                      </span>
                      <span v-show="item.barge == 'Ocean' || item.barge == 'Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                        <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                          />
                        </svg>
                      </span>
                      <div v-show="index != scope.row.tshgList.length - 1 && !(item.vessel != null && item.barge == 'Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                      <div v-show="index != scope.row.tshgList.length - 1 && (item.vessel != null && item.barge == 'Other')" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                    </div>
                    <div style="float: left;">
                      <div style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>
                      <div style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(item.eventTime) }}</div>
                      <div v-show="item.barge == 'Ocean' && item.event == 'Departure'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                        <div>
                          <div class="vessel-title">Vessel</div>
                          <div class="vessel-title">{{ item.barge == 'Barge' ? "Barge" : item.vessel }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Service</div>
                          <div class="vessel-title">{{ item.service == null ? '-' : item.service }}</div>
                        </div>
                        <div>
                          <div class="vessel-title">Voyage/Bound</div>
                          <div class="vessel-title">{{ item.voyage == null ? '-' : item.voyage }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>

                <el-row>
                  <div></div>
                </el-row>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('booking.carrier')" prop="carrier" width="250px" :align="'center'">
          <template v-slot="scope">
            <div>
              <svg v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" style="margin: 0px" viewBox="0 0 130 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Hapag-Lloyd Logo</title>
                <defs />
                <g id="Homepage-Initial" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="HAL0200_Homepage-Initial_Smartphone" transform="translate(-95.000000, -17.000000)">
                    <g id="Navigation">
                      <g id="Hapag-Lloyd-Logo" transform="translate(95.000000, 17.000000)">
                        <path
                          d="M7.86133803,0 L16.5576056,0 L11.1397183,9.04323944 L12.5623944,9.04323944 L17.9940141,0 L26.7433803,0 L21.3259507,9.04323944 L27.3924648,9.04323944 L24.9412324,13.0544718 L18.880669,13.0517254 L23.5982042,19.5448592 L14.8602817,19.5448592 L10.1496127,13.0544718 L8.65369718,13.0544718 L13.3671127,19.5448592 L4.73309859,19.5448592 L0,13.0544718 L7.86133803,0"
                          id="Fill-1"
                          fill="#111465"
                        />
                        <path
                          d="M37.8364085,16.4962676 L40.5206338,16.4962676 L40.5206338,11.2303521 L45.462007,11.2303521 L45.462007,16.4962676 L48.1462324,16.4962676 L48.1462324,4.28862676 L45.462007,4.28862676 L45.462007,8.97366197 L40.5206338,8.97366197 L40.5206338,4.28862676 L37.8364085,4.28862676 L37.8364085,16.4962676"
                          id="Fill-2"
                          fill="#000000"
                        />
                        <path
                          d="M54.6627113,13.0769014 C54.6627113,13.6069718 54.594507,15.1115845 52.6966901,15.1115845 C51.9102817,15.1115845 51.2094718,14.8891197 51.2094718,13.9827817 C51.2094718,13.093838 51.8933451,12.8375 52.6454225,12.6836972 C53.3975,12.546831 54.2525704,12.5294366 54.6627113,12.1705634 L54.6627113,13.0769014 L54.6627113,13.0769014 Z M51.4827465,10.3752817 C51.5683451,9.4181338 52.1666197,9.0418662 53.0898944,9.0418662 C53.9449648,9.0418662 54.6627113,9.19566901 54.6627113,10.2388732 C54.6627113,11.2303521 53.2780282,11.1790845 51.7908099,11.4010915 C50.2861972,11.6066197 48.7815845,12.0854225 48.7815845,14.0853169 C48.7815845,15.897993 50.115,16.735669 51.7908099,16.735669 C52.8678873,16.735669 53.9962324,16.445 54.7657042,15.6411972 C54.7826408,15.9318662 54.8508451,16.2225352 54.9364437,16.4962676 L57.398662,16.4962676 C57.1761972,16.1373944 57.0905986,15.3335915 57.0905986,14.5302465 L57.0905986,9.93080986 C57.0905986,7.81098592 54.9707746,7.41778169 53.2098239,7.41778169 C51.2264085,7.41778169 49.1917254,8.10165493 49.0548592,10.3752817 L51.4827465,10.3752817 L51.4827465,10.3752817 Z"
                          id="Fill-3"
                          fill="#000000"
                        />
                        <path
                          d="M57.8797535,19.6080282 L60.3071831,19.6080282 L60.3071831,15.4022535 L60.3415141,15.4022535 C60.9228521,16.2738028 61.9317254,16.735669 62.9914085,16.735669 C65.5730986,16.735669 66.8726408,14.5302465 66.8726408,12.1705634 C66.8726408,9.65753521 65.6248239,7.41778169 62.855,7.41778169 C61.7605282,7.41778169 60.8029225,7.84485915 60.2220423,8.78552817 L60.1877113,8.78552817 L60.1877113,7.6571831 L57.8797535,7.6571831 L57.8797535,19.6080282 L57.8797535,19.6080282 Z M62.3418662,14.9060563 C60.7690493,14.9060563 60.2220423,13.5383099 60.2220423,12.1023592 C60.2220423,10.6659507 60.7347183,9.24693662 62.3249296,9.24693662 C63.8808099,9.24693662 64.4447535,10.7002817 64.4447535,12.1023592 C64.4447535,13.5383099 63.9320775,14.9060563 62.3418662,14.9060563 L62.3418662,14.9060563 Z"
                          id="Fill-4"
                          fill="#000000"
                        />
                        <path
                          d="M73.0801408,13.0769014 C73.0801408,13.6069718 73.0119366,15.1115845 71.1141197,15.1115845 C70.3277113,15.1115845 69.6264437,14.8891197 69.6264437,13.9827817 C69.6264437,13.093838 70.3103169,12.8375 71.0628521,12.6836972 C71.8149296,12.546831 72.67,12.5294366 73.0801408,12.1705634 L73.0801408,13.0769014 L73.0801408,13.0769014 Z M69.9001761,10.3752817 C69.9857746,9.4181338 70.5840493,9.0418662 71.5073239,9.0418662 C72.3623944,9.0418662 73.0801408,9.19566901 73.0801408,10.2388732 C73.0801408,11.2303521 71.6954577,11.1790845 70.2077817,11.4010915 C68.703169,11.6066197 67.1990141,12.0854225 67.1990141,14.0853169 C67.1990141,15.897993 68.5324296,16.735669 70.2077817,16.735669 C71.2848592,16.735669 72.413662,16.445 73.1826761,15.6411972 C73.2000704,15.9318662 73.2682746,16.2225352 73.3538732,16.4962676 L75.8156338,16.4962676 C75.5936268,16.1373944 75.5080282,15.3335915 75.5080282,14.5302465 L75.5080282,9.93080986 C75.5080282,7.81098592 73.3877465,7.41778169 71.6267958,7.41778169 C69.643838,7.41778169 67.6091549,8.10165493 67.4722887,10.3752817 L69.9001761,10.3752817 L69.9001761,10.3752817 Z"
                          id="Fill-5"
                          fill="#000000"
                        />
                        <path
                          d="M85.1358099,7.6571831 L82.8278521,7.6571831 L82.8278521,8.83679577 L82.7935211,8.83679577 C82.2121831,7.81098592 81.3232394,7.41778169 80.1605634,7.41778169 C77.6814085,7.41778169 76.3649296,9.50327465 76.3649296,11.7947535 C76.3649296,14.2221831 77.4932746,16.2399296 80.1436268,16.2399296 C81.2037676,16.2399296 82.2634507,15.7954577 82.7935211,14.8721831 L82.8278521,14.8721831 L82.8278521,16.0344014 C82.8447887,17.2996127 82.2295775,18.2228873 80.8787676,18.2228873 C80.0236972,18.2228873 79.2885563,17.9152817 79.0665493,17.0094014 L76.6555986,17.0094014 C76.7755282,19.0266901 78.8102113,19.8474296 80.5537676,19.8474296 C84.6231338,19.8474296 85.1358099,17.3852113 85.1358099,15.9318662 L85.1358099,7.6571831 L85.1358099,7.6571831 Z M80.758838,14.4103169 C79.2716197,14.4103169 78.7928169,13.0256338 78.7928169,11.7604225 C78.7928169,10.4439437 79.3910915,9.24693662 80.758838,9.24693662 C82.3321127,9.24693662 82.8278521,10.5295423 82.8278521,11.965493 C82.8278521,13.2307042 82.1439789,14.4103169 80.758838,14.4103169 L80.758838,14.4103169 Z"
                          id="Fill-6"
                          fill="#000000"
                        />
                        <path d="M85.8041197,12.8713732 L90.9505634,12.8713732 L90.9505634,10.7854225 L85.8041197,10.7854225 L85.8041197,12.8713732 Z" id="Fill-7" fill="#000000" />
                        <path
                          d="M91.6014789,16.4962676 L100.235493,16.4962676 L100.235493,14.2395775 L94.2857042,14.2395775 L94.2857042,4.28862676 L91.6014789,4.28862676 L91.6014789,16.4962676"
                          id="Fill-8"
                          fill="#000000"
                        />
                        <path d="M100.799894,16.4962676 L103.227782,16.4962676 L103.227782,4.28908451 L100.799894,4.28908451 L100.799894,16.4962676 Z" id="Fill-9" fill="#000000" />
                        <path
                          d="M103.774331,12.0854225 C103.774331,14.8891197 105.569613,16.735669 108.339437,16.735669 C111.126197,16.735669 112.921479,14.8891197 112.921479,12.0854225 C112.921479,9.26433099 111.126197,7.41778169 108.339437,7.41778169 C105.569613,7.41778169 103.774331,9.26433099 103.774331,12.0854225 L103.774331,12.0854225 Z M106.202218,12.0854225 C106.202218,10.6659507 106.697958,9.24693662 108.339437,9.24693662 C109.997852,9.24693662 110.493592,10.6659507 110.493592,12.0854225 C110.493592,13.4870423 109.997852,14.9060563 108.339437,14.9060563 C106.697958,14.9060563 106.202218,13.4870423 106.202218,12.0854225 L106.202218,12.0854225 Z"
                          id="Fill-10"
                          fill="#000000"
                        />
                        <path
                          d="M121.454331,7.6571831 L118.941303,7.6571831 L117.009155,13.709507 L116.974824,13.709507 L114.974472,7.6571831 L112.375845,7.6571831 L115.487606,15.9492606 C115.76088,16.6500704 115.487606,17.5220775 114.64993,17.6076761 C114.171127,17.6246127 113.692324,17.5564085 113.230458,17.5220775 L113.230458,19.5224296 C113.726655,19.5736972 114.222394,19.6080282 114.718134,19.6080282 C116.393486,19.6080282 117.23162,19.0266901 117.761232,17.6076761 L121.454331,7.6571831"
                          id="Fill-11"
                          fill="#000000"
                        />
                        <path
                          d="M127.488803,16.4962676 L129.796761,16.4962676 L129.796761,4.28862676 L127.368873,4.28862676 L127.368873,8.73426056 L127.335,8.73426056 L127.351937,8.73426056 C126.787535,7.86225352 125.761725,7.41778169 124.718979,7.41778169 C122.120352,7.41778169 120.803415,9.62320423 120.803415,11.9998239 C120.803415,14.4446479 122.102958,16.735669 124.770246,16.735669 C125.898592,16.735669 126.890528,16.3255282 127.454472,15.3679225 L127.488803,15.3679225 L127.488803,16.4962676 L127.488803,16.4962676 Z M127.454472,12.0510915 C127.454472,13.5044366 126.975669,14.9060563 125.368521,14.9060563 C123.863908,14.9060563 123.231303,13.4527113 123.231303,12.0680282 C123.231303,10.6146831 123.778768,9.24693662 125.368521,9.24693662 C126.941796,9.24693662 127.454472,10.6146831 127.454472,12.0510915 L127.454472,12.0510915 Z"
                          id="Fill-12"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              <svg
                v-if="scope.row.carrier == 'MAEU'"
                class="ign-logo uni-carrier-logo-image"
                style="width: 140px;height: 40px;display: inline-block;margin: 0px;"
                viewBox="0 0 170 38"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g id="Large---1280px-(Max-Width)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="IGN---Transparent" transform="translate(-104.000000, -21.000000)">
                    <g id="IGN">
                      <g id="Logo" transform="translate(104.000000, 21.000000)">
                        <g id="Text" transform="translate(51.502463, 9.973333)" fill="#FFFFFF">
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-4"
                            points="0.225647399 17.0377015 0.225647399 0.584446483 4.63718082 0.584446483 10.2269671 12.8797823 15.7337777 0.584446483 19.9599991 0.584446483 19.9599991 17.0377015 16.3222127 17.0377015 16.3222127 7.46604648 12.1250328 17.0377015 8.24730872 17.0377015 3.99619469 7.51820061 3.99619469 17.0377015 0.225647399 17.0377015"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M34.599652,10.6673492 L31.5558322,3.69310703 L28.5818502,10.6673492 L34.599652,10.6673492 Z M25.8609436,17.0377015 L21.5828626,17.0377015 L28.9365707,0.584446483 L34.2034438,0.584446483 L41.6097031,17.0377015 L37.386939,17.0377015 L35.9293352,13.7602263 L27.2736024,13.7602263 L25.8609436,17.0377015 L25.8609436,17.0377015 Z"
                            id="Fill-5"
                          />
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-6"
                            points="43.3155421 17.0377015 43.3155421 0.584446483 59.1445112 0.584446483 59.1445112 3.87427401 47.1386406 3.87427401 47.1386406 7.1421419 57.432449 7.1421419 57.432449 10.353052 47.1386406 10.353052 47.1386406 13.7465015 59.1735527 13.7465015 59.1735527 17.0377015 43.3155421 17.0377015"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M66.1296696,8.13924648 L74.4465856,8.13924648 L74.4465856,3.87427401 L66.1296696,3.87427401 L66.1296696,8.13924648 Z M62.252637,17.0377015 L62.252637,0.584446483 L75.4983007,0.584446483 C77.2677543,0.584446483 78.2952682,1.60076575 78.2952682,3.34381162 L78.2952682,8.871463 C78.2952682,10.143063 77.1605776,11.2925125 74.961034,11.2925125 C74.8365707,11.2986887 74.7093415,11.2925125 74.578655,11.2925125 L78.4342523,17.0377015 L74.1789895,17.0377015 L70.523225,11.411918 L66.1296696,11.411918 L66.1296696,17.0377015 L62.252637,17.0377015 L62.252637,17.0377015 Z"
                            id="Fill-7"
                          />
                          <path
                            class="ign-logo__fill"
                            d="M85.2700547,17.0473089 L83.9576581,17.0473089 C82.244213,17.0473089 81.4192977,16.0646153 81.4192977,14.633808 L81.4192977,12.4845089 L85.2700547,12.4845089 L85.2700547,13.7574813 L93.4521354,13.7574813 L93.4521354,10.3894226 C93.4521354,10.3894226 85.5646179,10.3894226 84.0669092,10.3894226 C82.5685091,10.3894226 81.4891354,9.38957309 81.4891354,8.00199878 L81.4891354,3.11735291 C81.4891354,1.63919511 82.6639309,0.594740061 84.0931848,0.594740061 C85.5217472,0.594740061 94.8219234,0.594740061 94.8219234,0.594740061 C96.2719212,0.594740061 97.2752339,1.66870336 97.2752339,3.22166116 C97.2752339,4.77256024 97.2752339,5.1849896 97.2752339,5.1849896 L93.4521354,5.1849896 L93.4521354,3.88456758 L85.2700547,3.88456758 L85.2700547,7.12498593 L94.6283138,7.12498593 C96.0098567,7.12498593 97.2752339,8.03219327 97.2752339,9.77867034 L97.2752339,14.4746006 C97.2752339,16.0742226 96.3811723,17.0473089 94.709215,17.0473089 C93.0372576,17.0473089 85.2700547,17.0473089 85.2700547,17.0473089"
                            id="Fill-8"
                          />
                          <polyline
                            class="ign-logo__fill"
                            id="Fill-9"
                            points="100.970412 17.0473089 100.970412 0.592681346 104.900687 0.592681346 104.900687 7.17370887 112.387156 0.592681346 117.708655 0.592681346 108.77772 8.23600612 118.030185 17.0473089 112.520608 17.0473089 104.900687 9.56319144 104.900687 17.0473089 100.970412 17.0473089"
                          />
                        </g>
                        <g id="Star" fill-rule="nonzero">
                          <path
                            d="M4.28463565,0 L31.3468062,0 C33.7169495,0 35.6383302,1.91076181 35.6383302,4.26780595 L35.6383302,33.132194 C35.6383302,35.4892382 33.7169495,37.4 31.3468062,37.4 L4.28463565,37.4 C1.91830905,37.4 0,35.4923151 0,33.1390665 L0,4.27467843 C-0.00365105909,3.142229 0.446140088,2.05490945 1.25005944,1.25285417 C2.0539788,0.450798892 3.14588678,0 4.28463565,0 Z"
                            id="Shape"
                            fill="#42B0D5"
                          />
                          <polygon
                            id="Shape"
                            fill="#FFFFFF"
                            points="23.4962889 17.6509756 30.5313476 8.91442683 30.5106156 8.88706098 20.3450249 13.7308171 17.8364529 2.84604878 17.7949889 2.84604878 15.2864169 13.7308171 5.12082631 8.88706098 5.10009431 8.91442683 12.135153 17.6509756 1.96956232 22.4947317 1.98338365 22.528939 13.2615916 22.528939 10.7530196 33.4205488 10.7806623 33.4342317 17.8157209 24.6976829 24.8507796 33.4342317 24.8853329 33.4137073 22.3698503 22.528939 33.6549689 22.528939 33.6618796 22.4947317"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../assets/ZIMU.png" />
              <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../assets/TSHG.png" />
              <img v-if="scope.row.carrier == 'MSCU'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />
              <img v-if="scope.row.carrier == 'MSC'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />

              <img v-if="scope.row.carrier == 'OOLU'" class="uni-carrier-logo-image" src="../../../assets/OOLU.svg" />
              <img v-if="scope.row.carrier == 'CMDU'" class="uni-carrier-logo-image" src="../../../assets/CMA.png" />
              <img v-if="scope.row.carrier == 'ONEY'" class="uni-carrier-logo-image" src="../../../assets/ONE.png" />
              <img v-if="scope.row.carrier == 'COSU'" class="uni-carrier-logo-image" src="../../../assets/COSCO.png" />
              <img v-if="scope.row.carrier == 'CMA'" class="uni-carrier-logo-image" src="../../../assets/logo/CMA.png" />
              <img v-if="scope.row.carrier == 'COSCO'" class="uni-carrier-logo-image" src="../../../assets/logo/COSCO.png" />
              <img v-if="scope.row.carrier == 'HPL'" class="uni-carrier-logo-image" src="../../../assets/logo/HPL.png" />

              <img v-if="scope.row.carrier == 'MSK'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />
              <img v-if="scope.row.carrier == 'HMM'" class="uni-carrier-logo-image" src="../../../assets/HMM.jpg" />
              <img v-if="scope.row.carrier == 'ONE'" class="uni-carrier-logo-image" src="../../../assets/logo/ONE.png" />
              <img v-if="scope.row.carrier == 'ZIM'" class="uni-carrier-logo-image" src="../../../assets/logo/ZIM.png" />
              <img v-if="scope.row.carrier == 'EMC'" class="uni-carrier-logo-image" src="../../../assets/logo/EMC.svg" />
              <img v-if="scope.row.carrier == 'OOCL'" class="uni-carrier-logo-image" src="../../../assets/logo/OOCL.svg" />
              <img v-if="scope.row.carrier == 'YML'" class="uni-carrier-logo-image" src="../../../assets/logo/YML.png" />
              <img v-if="scope.row.carrier == 'MCC'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />

              <img v-if="scope.row.carrier == 'EGLV'" class="uni-carrier-logo-image" src="../../../assets/logo/EGLV.png" />
              <img v-if="scope.row.carrier == 'SJHH'" class="uni-carrier-logo-image" src="../../../assets/logo/SJHH.png" />
            </div>
          </template>
        </el-table-column>

        <el-table-column sortable="custom" label="Service" prop="service" width="180px"></el-table-column>

        <el-table-column label="Main Carriage" prop="mainCarriage" min-width="300px">
          <template v-slot="scope">
            <div style="width: 800px;">
              <div style="float: left; margin-right: 10px;margin-top: 20px">
                <div style="text-align: center; color:#c3c5c7; ">
                  {{
                  scope.row.carrier == 'TSHG' ? scope.row.polName : (scope.row.polTerminal + " (" + scope.row.pol + ")")
                  }}
                </div>
                <div style="text-align: center;">{{ parseTime(scope.row.departureDate) }}</div>
              </div>

              <div style="float: left; width: 100px;">
                <div style="position: relative">
                  <div style="text-align: center;color:#385f78;white-space: nowrap;">{{ scope.row.vesselName }}</div>
                  <div class="image-container" style="position: absolute; left: 35px">
                    <img style="width: 20px; height: 20px" src="../../../assets/icons/ship.png" />
                  </div>
                  <div style="text-align: center;color:#385f78;position: absolute; top: 50px;left: 30px">
                    {{
                    scope.row.voyage }}
                  </div>
                </div>
              </div>

              <div style="float: left;margin-left: 10px;margin-top: 20px">
                <div style="text-align: center;  color:#c3c5c7; ">
                  {{
                  scope.row.carrier == 'TSHG' ? scope.row.podName : (scope.row.podTerminal + " (" + scope.row.pod + ")")
                  }}
                </div>
                <div style="text-align: center;">{{ parseTime(scope.row.arrivalDate) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="TT" prop="transitTime" min-width="100px">
          <template v-slot="scope">{{ scope.row.transitTime + " days" }}</template>
        </el-table-column>

        <el-table-column prop="choseSchedule" width="100px">
          <template v-slot="scope">
            <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- all crd update -->
    <el-dialog title="Update Latest CRD" width="600px" :visible.sync="allCrdUpdateFormVisible">
      <el-form ref="latestCRDUpdateFormRef" :model="form" :rules="crdRules" size="mini">
        <el-form-item label="Latest CRD" label-width="180px" prop="latestCrd">
          <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="form.latestCrd" type="date" placeholder="Latest CRD"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allCrdUpdateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitShippingOrderCRD(form)">Submit</el-button>
      </div>
    </el-dialog>

    <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl">
      <div class="cardx" v-for="h in taskList" :key="h.id">
        <div class="status1Div">
          <span
            v-if="showTaskStatus(h) != ''"
            class="status2"
            :class="[showTaskStatus(h) == 'Possible' ? 'color2' : '', showTaskStatus(h) == 'Finished' ? 'color1' : '', showTaskStatus(h) == 'Urgent' ? 'color3' : '', showTaskStatus(h) == 'Overdue' ? 'color4' : '']"
          >
            {{
            showTaskStatus(h) }}
          </span>
        </div>
        <div class="order" style="margin-bottom: 5px;">MOOV Ref:{{ h.orderNumber }}</div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>

        <div
          v-if="h.status == 2 && h.taskName == 'Accept booking' && h.jsonData != null && h.jsonData != '' && JSON.parse(h.jsonData) != null
          && JSON.parse(h.jsonData).reason != null && JSON.parse(h.jsonData).reason != ''"
        >
          <div style="clear: both;"></div>
          <div class="date" style="margin-bottom: 5px;">Reject Reason：{{ JSON.parse(h.jsonData).reason }}</div>
        </div>

        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 2">
          Complete Date：{{
          parseTime(h.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Urgent Date：{{ parseTime(h.urgentDate) }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Due Date：{{ parseTime(h.dueDate) }}</div>
        <div style="margin-bottom: 5px; float: right;cursor: pointer;">
          <el-popover placement="top-start" title width="200" trigger="hover" content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" v-if="(showTaskStatus(h) == 'Overdue' || showTaskStatus(h) == 'Urgent') && user.deptId != h.partyId" class="el-icon-message"></i>
          </el-popover>

          <i v-show="h.status == 1 && user.deptId == h.partyId" @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i>
          <i v-if="h.jsonData != null && h.status == 2" @click="viewTask(h)" class="el-icon-view"></i>
        </div>
        <div style="clear: both;"></div>
      </div>
    </el-drawer>

    <BatchApproval ref="batchApproval" @refresh="getList"></BatchApproval>
  </div>
</template>

<script>
import { countShippingOrderShipment, getCustomerList } from '@/api/shipping/order'
import {
  getOrderListShipmentPage,
  updateShippingOrderStatus,
  createPreAssign,
  isNeedManualAdjust,
  createExportTask,
  getExportProgress,
  downloadExcel,
  updateShippingOrderAllCrd,
  getPreAssignData,
  createDcDataLog,
  getDcReasonLogs,
  getShippingOrderOptions, downloadShippingExcel, getShippingPage
} from '@/api/pepco/shipping-order'
import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'

import { checkPermi } from '@/utils/permission' // 权限判断函数
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import ChooseCarrier from '@/views/salesOrder/components/choose-carrier'
import ChooseAir from '@/views/air-booking/booking/components/choose-air.vue'
import viewPoManagementDocuments from '@/views/purchaseOrder/pepco/components/view-po-management-documents.vue'
import { getTaskNames, updateTask, getTaskList, reminder } from '@/api/order/task'
import { getUserProfile, listSimpleUsers, getUserCompanyTypeList } from '@/api/system/user'
import { findShippingScheduleList, findDropDownListFromCt, isAlreadyCreate } from '@/api/shipment/shipment'
import { getVesselList } from '@/api/system/vessel'
// import orderComment from "@/views/purchaseOrder/pepco/components/order-comment.vue";
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import OrderListPoDetail from '@/views/pepcoShipping/orderList/components/order-list-po-detail.vue'
import { groupByCarrierAndTransportMeanName, groupByCountryAndSuppliercode } from '@/api/order/header'
import { v4 as uuidv4 } from 'uuid'
import { getDestinationDcList } from '@/api/destination/destination'
import axios from 'axios'
import { getTenantName } from '@/utils/auth'
import { t } from '@wangeditor/editor'
import OrderComment from '@/views/components/order-comment/index.vue'
import { getAirportList } from '@/api/air/airport'
import { getAirlineList } from '@/api/air/airline'
import { createSeaAirPreAssign } from '@/api/seaair/seaair'
import { getAccessToken, getTenantId } from '@/utils/auth'
import { parseUTCTime } from '@/utils/ruoyi'
import BatchApproval from '@/views/pepcoShipping/orderList/components/batch-approval.vue'
import transportPAMap from '@/utils/transportPAMap'
import OverdueBookedETDTab from '@/views/pepcoShipping/orderList/components/OverdueBookedETDTab.vue'
import { createAirPreAssign } from '@/api/air/airPreAssign'
import AirTransportPreAssign from './components/AirTransportPreAssign.vue'
import SeaTransportPreAssign from './components/SeaTransportPreAssign.vue'
import SeaAirTransportPreAssign from '@/views/pepcoShipping/orderList/components/SeaAirTransportPreAssign.vue'
import { getListAirPreAssign } from '@/api/air/airPreAssign';
import { seaAirPreAssignlistByShippingOrderId } from '@/api/seaair/seaair';

export default {
  name: 'Order',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    },
    hasFilter() {
      return this.queryParams.dc || this.queryParams.dcList || this.queryParams.supplierCode || this.queryParams.carrier || this.queryParams.transportMeanName || this.queryParams.voyage || this.queryParams.freightMethod
    },
    polCascaderOptions() {
      return [
        {
          label: 'Sea',
          value: 'sea',
          children: (this.polOptions || []).map(item => ({
            label: item.name + ' (' + item.code + ')',
            value: item.code
          }))
        },
        {
          label: 'Air',
          value: 'air',
          children: (this.airPortOptions || []).map(item => ({
            label: item.airportName + ' (' + item.iata + ')',
            value: item.iata
          }))
        }
      ]
    },
    podCascaderOptions() {
      return [
        {
          label: 'Sea',
          value: 'sea',
          children: (this.podOptions || []).map(item => ({
            label: item.name + ' (' + item.code + ')',
            value: item.code
          }))
        },
        {
          label: 'Air',
          value: 'air',
          children: (this.airPortOptions || []).map(item => ({
            label: item.airportName + ' (' + item.iata + ')',
            value: item.code
          }))
        }
      ]
    },
    tplCascaderOptions() {
      return [
        {
          label: 'Sea',
          value: 'sea',
          children: (this.TPLOptions || []).map(item => ({
            label: item.name + ' (' + item.code + ')',
            value: item.code
          }))
        },
        {
          label: 'Air',
          value: 'air',
          children: (this.airPortOptions || []).map(item => ({
            label: item.airportName + ' (' + item.iata + ')',
            value: item.iata
          }))
        }
      ]
    },
    tpdCascaderOptions() {
      return [
        {
          label: 'Sea',
          value: 'sea',
          children: (this.TPDOptions || []).map(item => ({
            label: item.name + ' (' + item.code + ')',
            value: item.code
          }))
        },
        {
          label: 'Air',
          value: 'air',
          children: (this.airPortOptions || []).map(item => ({
            label: item.airportName + ' (' + item.iata + ')',
            value: item.iata
          }))
        }
      ]
    }
  },
  components: { OverdueBookedETDTab, OrderListPoDetail, viewPoManagementDocuments, IconPark, ChooseCarrier, OrderComment, BatchApproval, ChooseAir, SeaTransportPreAssign, AirTransportPreAssign  , SeaAirTransportPreAssign},
  data() {
    return {
      expanded: {},
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // shipping order列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        soRef: null,
        customerRef: null,
        originPort: null,
        polArray: [],
        podArray: [],
        tplArray: [],
        tpdArray: [],
        latestCrd: null,
        latestHod: null,
        destinationPort: null,
        tpl: null,
        tpd: null,
        overdueBookedETD: null,
        poTags: [],
        incoterm: null,
        freightMethod: []
      },
      pollInterval: null,
      progressId: '',
      percentage: 0,
      clientHeight: null,
      notShipmentNum: 0,
      shipmentNum: 0,
      newBookingNum: 0,
      awaitApprovalNum: 0,
      pendingNum: 0,
      shippingNewBooking: null,
      awaitApprovalBooking: null,
      pepcoPendingBooking: null,
      shippingIds: [],
      dialogVisibleCarrier: false,
      showCloseRemark: false,
      closeShippingLoading: false,
      closeShippingForm: {
        closeRemark: '',
        id: null
      },
      showCloseBut: true,
      customerList: [],
      checkedType: '',
      user: {},
      drawer2: false,
      hiddenTask: false,
      taskLoading: false,
      task3: [],
      task3Temp: [
        { taskName: 'Submit booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Accept booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Carrier booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Booking confirmation', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'SI/VGM by shipper', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'SI/VGM submit to carrier', possible: 0, urgent: 0, overdue: 0, finished: 0 }
      ],
      centerDialogVisible: false,
      cancelRemark: null,
      shipmentId: null,
      taskDetailDataVisible: false,
      taskDetailData: [],
      departureConfirmFormVisible: false,
      arrivalConfirmFormVisible: false,
      taskList: [],
      drawer: false,
      checkCustomerIds: [],
      isPepco: true,
      preAssgineVisable: false,
      preAssgineForm: {
        por: '',
        fnd: '',
        flight: '',
        etd: new Date().getTime(),
        comment: '',
        airComment:'',
      },
      showRePreAssignReason: false,
      scheduleLoading: {},
      shippingScheduleData: [],
      shippingScheduleVisable: false,
      vesselListLes: [],
      rePreAssignOptions: [
        {
          enumId: 'Cargo cannot handover on time',
          description: 'Cargo cannot handover on time'
        },
        {
          enumId: 'Customer request',
          description: 'Customer request'
        }
      ],
      portOptions: [],
      carrierMap: {
        CMDU: 'CMA',
        COSU: 'COSCO',
        EGLV: 'EMC',
        HLCU: 'HPL',
        MSCU: 'MSC',
        ONEY: 'ONE',
        ZIMU: 'ZIM',
        MAEU: 'MSK',
        TSHG: 'TSHG',
        'MAEU-ALWAYS': 'MSK',
        SHCO: 'SHIPCO',
        'NVOCC DSV': 'DSV',
        WECC: 'WEC'
      },
      carrierMap2: {
        CMA: 'CMDU',
        TSHG: 'TSHG',
        COSCO: 'COSU',
        EMC: 'EGLV',
        HPL: 'HLCU',
        MSC: 'MSCU',
        ONE: 'ONEY',
        ZIM: 'ZIMU',
        MSK: 'MAEU',
        SHIPCO: 'SHCO',
        DSV: 'NVOCC DSV',
        WEC: 'WECC'
      },
      rmPoReasonData: {
        rejectReason: '',
        rejectReason1: '',
        rejectComments: ''
      },
      selCancelReason: [],
      selCancelCategory: [],
      selCancelReason1: [],
      selCancelCategory1: [],
      userMap: [],
      activeName: 'first',
      shippingList: [],
      showCheckBtn: false,
      userCompanyTypeList: [],
      // 订单状态更新
      updateSoStatusLoading: false,
      tenantId: '',
      dc: ['0006', '0015', '0018', '0021', '0027'],
      dcDataList: [],
      supplierList: [],
      carrierList: [],
      downloadLoading: false,
      scheduleForm: {},
      countryList: [], //Filter的country
      polOptions: [],
      podOptions: [],
      form: {},
      allCrdUpdateFormVisible: false,
      crdRules: {
        latestCrd: [{ required: true, message: 'Cargo Ready Date Is Required', trigger: 'change' }]
      },
      preAssignLoading: false,
      preAssignInfo: {},
      TPLOptions: [],
      TPDOptions: [],
      // DC原因日志相关
      dcReasonLogs: [], // 存储不同订单的日志
      addReasonDialogVisible: false, // 控制不同订单的弹框显示
      reasonForm: {
        reasonType: '',
        reasonContent: '',
        reasonRemark: '',
        reasonCode: ''
      },
      reasonFormRules: {
        reasonType: [{ required: true, message: ' ', trigger: 'change' }],
        reasonContent: [{ required: true, message: ' ', trigger: 'change' }]
      },
      missDCList: [],
      shippingOrderId: null,
      dcLoading: false,
      listIndex: -1,
      finalPortOptions: [],
      airlineOptions: [],
      airPortOptions: [],
      hasSeaBookings: false,
      hasAirBookings: false,
      airDataLoaded: false,
      airDialogVisibleCarrier: false,
      airLine: '',

      // 表单校验
      preAssgineRules: {
        etd: [
          { required: true, message: 'ETD Is Required', trigger: 'change' },
          { validator: this.validateEtd, trigger: ['change', 'blur'] }
        ],
        eta: [
          { required: true, message: 'ETA Is Required', trigger: 'change' },
          { validator: this.validateEta, trigger: ['change', 'blur'] }
        ]
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
          className: 'tag-purple'
        },
        {
          code: 'CHILDREN_TOY',
          label: 'Children Toy',
          type: 'danger'
        }
      ],
      timer: null,
      pickerOptions: {
        disabledDate(time) {
          const maxDate = new Date('2026-07-31 23:59:59')
          return time.getTime() > maxDate.getTime()
        }
      }
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.clientHeight = clientHeight - 330
    })
    getUserProfile().then(response => {
      this.user = response.data
    })
    this.getList()

    this.getNum()
    this.getOriginDeliveryList()
    getCustomerList().then(res => {
      this.customerList = res.data
    }),
      this.loadAirBaseData()
  },
  created() {
    this.tenantId = localStorage.getItem('TENANT_ID')
    var clientHeight = document.documentElement.clientHeight
    this.clientHeight = clientHeight - 330
    this.getDropDownValues()
    this.getFilterQueryData()
    listSimpleUsers().then(response => {
      this.userMap = new Map(response.data.map((value, index) => [value.id + '', value.nickname]))
    })

    getUserCompanyTypeList().then(response => {
      console.log('获取用户所在的公司类型列表')
      console.log(response.data)
      this.userCompanyTypeList = response.data
      if (this.userCompanyTypeList.includes('OHA')) {
        console.log('OHA公司类型')
        this.showCheckBtn = true
      }
    })
    // 跳转路由增加判断参数 ewin
    if (this.$route.query.shipperRef) {
      this.queryParams.customerRef = this.$route.query.shipperRef
    } else if (this.$route.query.soRef) {
      this.queryParams.soRef = this.$route.query.soRef
    } else {
      // 有跳转路由不走这边 edwin 20250724
      const savedParams = localStorage.getItem('orderListQueryParams')
      if (savedParams) {
        this.queryParams = JSON.parse(savedParams)
        this.getList() // 根据恢复的参数重新获取列表数据
      }
    }
    //拿出查询条件
    // if (this.$store.state.tagsView.orderListQueryParams) {
    //   this.queryParams = {...this.$store.state.tagsView.orderListQueryParams}
    //   this.getList()
    // }
    // 增加更新po列表
    localStorage.removeItem('refreshPoPage')

    groupByCountryAndSuppliercode().then(res => {
      this.countryList = res.data.country
      //this.supplierCode = res.data.supplierCode;
      //this.dc = res.data.dc;
      //this.originPort = res.data.pol;
      this.supplierList = [...res.data.supplierList]
    })
    //获取Carrier和TransportMeanName下拉数据
    groupByCarrierAndTransportMeanName().then(res => {
      this.carrierList = res.data.carrierList
    })
    getDestinationDcList().then(response => {
      this.$set(this, 'dcDataList', response.data || [])
    })

    this.missDCList = this.getDictDatas(this.DICT_TYPE.MISS_IN_DC_DATE_LOG)
  },
  methods: {
    triggerFilter() {
      this.queryParams.pageNo = 1
      this.handleQuery()
    },
    parseUTCTime,
    getDictDatas,
    checkPermi,

    // 拆分 airData.etd 为 airETD 和 etdTime
    splitAirDate(etd) {
      if (!etd) {
        return { airYMD: '', time: '09:00' }
      }

      const date = new Date(etd)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      const airYMD = `${year}-${month}-${day}`
      const time = `${hours}:${minutes}`

      return { airYMD, time }
    },

    updateShippingOrderAllCrd(row) {
      this.form = {}
      this.form = row
      console.log(this.form.latestCrd)
      this.allCrdUpdateFormVisible = true
    },
    submitShippingOrderCRD(form) {
      //  验证表单 edwin
      this.$refs.latestCRDUpdateFormRef.validate(valid => {
        if (!valid) return
        console.log('submitCRD 验证通过:', this.form.latestCrd)
        updateShippingOrderAllCrd(form)
          .then(res => {
            this.$notify({ type: 'success', message: 'Success' })
            this.allCrdUpdateFormVisible = false
            this.getList()
          })
          .catch(err => {
            console.error('Error updating task:', error)
            this.$message.error('Failed to update task')
            this.allCrdUpdateFormVisible = false
            this.getList()
          })
      })
    },

    getFilterQueryData() {
      getShippingOrderOptions().then(response => {
        this.polOptions = response.data.polList.filter(item => item).sort()
        this.podOptions = response.data.podList.filter(item => item).sort()
        this.TPLOptions = response.data.tplList.filter(item => item).sort()
        this.TPDOptions = response.data.tpdList.filter(item => item).sort()
      })
    },
    isPepcoAndNull(item) {
      const tenantID = localStorage.getItem('TENANT_ID')
      // 获取字典里pepco的id
      const pepcoIdsString = this.getDictDatas(this.DICT_TYPE.PEPCO).find(item => item.label === 'tenantId')?.value || ''
      const pepcoIdsArray = pepcoIdsString.split(',').map(id => id.trim())
      // 检查tenantID是否在pepcoIdsArray中
      return pepcoIdsArray.includes(tenantID) && item.customerName == null
    },
    checkType(item) {
      console.log('select item', item)
      if (this.shippingIds.length == 0) {
        this.checkedType = ''
        this.checkCustomerIds = []
        return
      }
      //检查不能创建相同的shipmentType
      if (this.checkedType) {
        var removeFlag = false
        if (this.checkedType != item.shipmentType) {
          this.$notify({
            message: 'FCL SO is not allowed to make consol',
            type: 'warning'
          })
          // 如果shipmentType不同则移除
          removeFlag = true
        } else if (this.shippingIds.length > 1 && item.shipmentType == 'FCL') {
          this.$notify({
            message: 'FCL Shipper Booking is not allowed to make consol',
            type: 'warning'
          })
          removeFlag = true
        }
        if (this.checkCustomerIds.length > 0 && !this.checkCustomerIds.includes(item.customerId)) {
          this.$notify({
            message: 'Customer not the same',
            type: 'warning'
          })
          removeFlag = true
        }
        if (item.shipmentType == 'LCL') {
          this.checkCustomerIds.push(item.customerId)
        }
        if (removeFlag) {
          var index = this.shippingIds.indexOf(item.id)
          if (index != -1) {
            this.shippingIds.splice(index, 1)
          }
          index = this.checkCustomerIds.indexOf(item.customerId)
          if (index != -1 && item.shipmentType == 'LCL') {
            this.checkCustomerIds.splice(index, 1)
          }
          return
        }
      }
      this.checkedType = item.shipmentType
      console.log('this.checkedType', this.checkedType)
    },
    decodeHtml(html) {
      const txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },

    newBookingChange(flag) {
      if (this.queryParams.shippingNewBooking == flag) {
        this.queryParams.shippingNewBooking = null
      } else {
        this.queryParams.shippingNewBooking = flag
        this.queryParams.shippingBooking = null
        this.queryParams.awaitApprovalBooking = null
        this.queryParams.pepcoPendingBooking = null
      }
      this.getList()
    },
    bookedChange(flag) {
      this.queryParams.shippingNewBooking = null
      this.queryParams.awaitApprovalBooking = null
      this.queryParams.pepcoPendingBooking = null
      if (this.queryParams.shippingBooking == flag) {
        this.queryParams.shippingBooking = null
      } else {
        this.queryParams.shippingBooking = flag
      }
      this.getList()
    },
    showDetail(item) {
      this.showCloseRemark = true
      this.closeShippingForm.closeRemark = item.rejectedText
      this.showCloseBut = false
    },
    async closeShipping(id) {
      // hold
      const resOrder = await getOrderHeadersList({ shippingOrderIds: [id].join(',') })
      console.log('返回值', resOrder.data)
      for (var item of resOrder.data) {
        if (item.status == '2') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold')
          return
        }
        if (item.status == '1') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled')
          return
        }
      }
      this.showCloseRemark = true
      this.showCloseBut = true
      this.closeShippingForm.id = id
      this.closeShippingForm.closeRemark = null
    },
    submitCloseShipping() {
      this.$refs['closeShippingForm'].validate(valid => {
        if (valid) {
          this.closeShippingLoading = true
          this.updateStatus(this.closeShippingForm.id, 2, this.closeShippingForm.closeRemark)
        }
      })
    },
    // 包一层，用于在更新状态前判断是否满足更新状态条件
    async handleUpdateStatusConfirm(id, status, rejectedText) {
      // hold
      const resOrder = await getOrderHeadersList({ shippingOrderIds: [id].join(',') })
      console.log('返回值', resOrder.data)
      for (var item of resOrder.data) {
        if (item.status == '2') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold')
          return
        }
        if (item.status == '1') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled')
          return
        }
      }
      if (this.updateSoStatusLoading) return
      this.updateSoStatusLoading = true
      this.beforeConfirmUpdateStatus(id)
        .then(res => {
          this.updateSoStatusLoading = false
          if (res.data) {
            this.$message.error('Please select match or not for POL from PO and shipper`s booking!!')
            return
          } else {
            this.updateStatus(id, status, rejectedText)
          }
        })
        .catch(err => {
          this.updateSoStatusLoading = false
        })
    },
    updateStatus(id, status, rejectedText) {
      updateShippingOrderStatus({ id: id, status: status, rejectedText: rejectedText }).then(res => {
        this.closeShippingLoading = false
        this.$notify({
          title: 'Success',
          message: 'Success',
          type: 'success'
        })
        this.getList()
        this.closeShippingForm.id = null
        this.closeShippingForm.closeRemark = null
        this.showCloseRemark = false
      })
    },
    getNum() {
      countShippingOrderShipment().then(res => {
        this.notShipmentNum = res.data.notShipmentNum
        this.shipmentNum = res.data.shipmentNum
        this.newBookingNum = res.data.newBookingNum
        this.awaitApprovalNum = res.data.awaitApprovalNum
        this.pendingNum = res.data.pendingNum
      })
    },
    async createShipment() {
      console.log('this.shippingIds', this.shippingIds)
      // 没有选择，直接返回
      if (!this.shippingIds || this.shippingIds.length == 0) {
        this.$notify({
          message: 'Please select at least one!',
          type: 'error'
        })
        return
      }
      // hold
      const resOrder = await getOrderHeadersList({ shippingOrderIds: this.shippingIds.join(',') })
      console.log('返回值', resOrder.data)
      for (var item of resOrder.data) {
        if (item.status == '2') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold')
          return
        }
        if (item.status == '1') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled')
          return
        }
      }

      // 判断是否有pre-assignment
      // 根据shippingIds获取对应的shippingOrder
      console.log('this.shippingIds', this.shippingIds)
      console.log('当前页的订单', this.list)

      this.shippingList = this.list.filter(item => this.shippingIds.includes(item.id))
      console.log('当前的订单状态', this.shippingList[0])
      console.log('选择的订单id', this.shippingIds)
      // 判断当前选择的订单是否已经创建了shipment
      // 判断当前选择的订单是否已经创建了shipment
      const res = await isAlreadyCreate(this.shippingIds)
      console.log('返回值', res.data)
      if (!res.data) {
        console.log('报错', res.data)
        this.$notify({
          message: 'Already created carrier booking, pls refresh page',
          type: 'error'
        })
        this.dialogVisibleCarrier = false
        this.airDialogVisibleCarrier = false
        return // 这里return会跳出整个函数
      }
      console.log('通过验证')
      console.log(this.dialogVisibleCarrier)
      //循环判断shippingList中是否有pre-assignment
      for (var i = 0; i < this.shippingList.length; i++) {
        if (this.shippingList[i].preAssign == null || this.shippingList[i].preAssign == '') {
          this.$notify({
            message: 'No Pre-assign data:' + this.shippingList[i].soRef,
            type: 'error'
          })
          return
        }
        // add carrier_booking code judgment edwin 2026-02-10
        if (this.shippingList[i].taskCodeExecuting != 'Carrier_Booking' && this.shippingList[i].taskCodeExecuting != 'carrier_booking') {
          this.$notify({
            message: 'No Booking Score Data:' + this.shippingList[i].soRef,
            type: 'error'
          })
          return
        }
        if (this.shippingList[i].status != 4) {
          this.$notify({
            message: 'Must Be SAApproved: ' + this.shippingList[i].soRef,
            type: 'error'
          })
          return
        }
      }
      // dc code, 只有0030，0006和0015能组合，dc不存在会为空字符串随意组合
      if (this.shippingList.length > 1) {
        const shipping = this.shippingList.find(item => item.dc === '0006' || item.dc === '0015' || item.dc === '0030')
        if (shipping) {
          if (this.shippingList.find(item => item.dc && item.dc !== '0006' && item.dc !== '0015' && item.dc !== '0030')) {
            const dcNumber = this.shippingList.map(item => item.dc).join(',')
            this.$notify({
              message: `The DC included in this booking : ${dcNumber}, Only 0030 and 0006 and 0015 can be booked together!`,
              type: 'error'
            })
            return
          }
        } else {
          const shippingDc = this.shippingList.map(item => item.dc)
          const snDc = shippingDc.filter(item => item)
          const dcSet = new Set(snDc)
          if (dcSet.size > 1) {
            const dcNumber = shippingDc.join(',')
            this.$notify({
              message: `The DC included in this booking : ${dcNumber}, Only 0030 and 0006 and 0015 can be booked together!`,
              type: 'error'
            })
            return
          }
        }
      }

      // 2026-3-6
      // mark 根据shipping de transportMode 判断为SEA还是AIR，跳转到不同的预排船页面
      console.log('this.shippingList[0].freightMethod', this.shippingList[0].freightMethod)
      //
      if (this.shippingList[0].freightMethod == 'sea' || this.shippingList[0].freightMethod == 'sea_air') {
        this.airDialogVisibleCarrier = false
        this.dialogVisibleCarrier = true
      } else {
        // air 时获取pre assign数据，带到预排页面
        getListAirPreAssign({ shippingOrderId: this.shippingIds[0] }).then(res => {
          if (res.data && res.data.length > 0) {
            this.preAssignInfo = res.data[0]
            console.log('预排船信息', this.preAssignInfo)
            this.airLine = this.preAssignInfo.carrier
          } else {
            this.$notify({
              message: 'No Pre-assign data',
              type: 'error'
            })
            return
          }
        })
        this.dialogVisibleCarrier = false
        this.airDialogVisibleCarrier = true
      }
    },
    handlePolChange(data) {
      if (data && data.length) {
        this.queryParams.originPort = data[1] || null
      } else {
        this.queryParams.originPort = null
      }
    },

    handlePodChange(data) {
      if (data && data.length) {
        this.queryParams.destinationPort = data[1] || null
      } else {
        this.queryParams.destinationPort = null
      }
    },
    handleTplChange(data) {
      if (data && data.length) {
        this.queryParams.tpl = data[1] || null
      } else {
        this.queryParams.tpl = null
      }
    },
    handleTpdChange(data) {
      if (data && data.length) {
        this.queryParams.tpd = data[1] || null
      } else {
        this.queryParams.tpd = null
      }
    },
    getDetailUrl(item) {
      return this.$router.resolve({
        path: '/shipment/ppshippingOrderDetail',
        query: { id: item.id }
      }).href
    },

    goToDetail(item, index) {
      localStorage.setItem('orderListQueryParams', JSON.stringify(this.queryParams))
      window.open(this.getDetailUrl(item), '_blank')
    },
    changeParentValue(value) {
      console.log('选择的value', value)

      var ids = this.shippingIds
      if (!ids.length > 0) {
        this.$notify({
          message: 'Please select booking data first',
          type: 'warning'
        })
        return
      }
      console.log('要创建的参数', this.shippingIds)
      // 2025/08/28 增加先查询预排船信息，将船期带到创建shipment 页面
      if (value.transport != null && value.transport === 'air') {
        this.carrier = value.carrier
        if (this.carrier == null || this.carrier == '') {
          return
        }
        // 已经有预排船信息，直接传输
        console.log('有预排船信息', this.preAssignInfo)
        console.log('跳转到创建air booking页面，参数', '/shipment/create-air-booking?airline=' + this.carrier + '&spoIds=' + ids.join(',') + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
        this.$router.push('/shipment/create-air-booking?airline=' + this.carrier + '&spoIds=' + ids.join(',') + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
      } else {
      this.carrier = value
      if (this.carrier == null || this.carrier == '') {
        return
      }
      // sea的预排船信息和air不在一起获取
         getPreAssignData(this.shippingIds[0]).then(res => {
        this.preAssignInfo = res.data[0]
        console.log('预排船信息', this.preAssignInfo)

        if(this.shippingList[0].freightMethod == 'sea_air') {
          // 获取air的数据 根据preAssignData的id
          seaAirPreAssignlistByShippingOrderId(this.shippingIds[0]).then(airResponse => {
            console.log('airResponse', airResponse)
            var airData;
            if (airResponse.data &&
              airResponse.data.length > 0) {
              airData = airResponse.data ? airResponse.data.filter(item => item.preAssignId == this.preAssignInfo.id) : []
            }
            console.log('airData', airData)
            this.preAssignInfo.airData = airData
            console.log('this.preAssignInfo', this.preAssignInfo)

            if (this.carrier == 'TSHG') {
              // ?schdule=" + btoa(JSON.stringify(data))
              this.$router.push('/shipment/create?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking' + '&isPepco=true' + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
            } else {
              this.$router.push('/shipment/create-shipment?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&freightMethod=sea_air&source=spoBooking' + '&isPepco=true' + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
            }

          })

        } else{

        // 创建air
          if (this.carrier == 'TSHG') {
            // ?schdule=" + btoa(JSON.stringify(data))
            this.$router.push('/shipment/create?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking' + '&isPepco=true' + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
          } else {
            this.$router.push('/shipment/create-shipment?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking' + '&isPepco=true' + '&schdule=' + btoa(JSON.stringify(this.preAssignInfo)))
          }
        }
      })

      }

      // 2025-04-21  mark
      //isPepco 代表 isPepco进行创建carrier shipment
      // if (this.carrier == 'TSHG') {
      //   this.$router.push('/shipment/create?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking' + '&isPepco=true')
      // } else {
      //   this.$router.push('/shipment/create-shipment?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking' + '&isPepco=true')
      // }
    },
    seaChangeParentValue(value) {},
    toggleDetails(index) {
      console.log('index', index)
      this.$set(this.expanded, index, !this.expanded[index])
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.portOptions = res.data
        console.log('所有的港口', this.portOptions)
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
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      console.log('getList查询参数', this.queryParams)
      getOrderListShipmentPage(this.queryParams).then(response => {
        console.log('查询的bookinglist数据', response.data.records)
        for (let i = 0; i < response.data.records.length; i++) {
          response.data.records[i].show = 'first' + response.data.records[i].id
          response.data.records[i].key = 'Logs' + response.data.records[i].id
          response.data.records[i].containerDOList = response.data.records[i].containerDOList.filter(item => item.type || item.qty)
        }
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      })
      // this.getFilterQueryData()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      console.log('查询参数', this.queryParams)
      this.queryParams.pageNo = 1
      this.getList()
      localStorage.setItem('orderListQueryParams', JSON.stringify(this.queryParams))
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm('是否确认导出所有shipping order数据项?')
        .then(() => {
          this.exportLoading = true
          return exportOrderExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'shipping order.xls')
          this.exportLoading = false
        })
        .catch(() => {})
    },

    getTaskNames() {
      this.taskLoading = true
      getTaskNames({ type: '1' }).then(res => {
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.taskNames = res.data
        this.task3 = this.task3.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        this.overview()
      })
    },
    overview() {
      getTaskList({
        status: 1,
        statuskey: 'Possible',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.possibleList = res.data
        this.setData(res, 'possible')
      })
      getTaskList({
        status: 1,
        statuskey: 'Urgent',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.urgentList = res.data
        this.setData(res, 'urgent')
      })
      getTaskList({
        status: 1,
        statuskey: 'Overdue',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.overdueList = res.data
        this.setData(res, 'overdue')
      })
      getTaskList({
        status: 2,
        source: 'booking-order',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.finishedList = res.data
        this.setData(res, 'finished')
        this.taskLoading = false
      })
    },
    setData(res, key) {
      for (var task of this.task3) {
        if (key == 'finished') task.finished = 0
        if (key == 'overdue') task.overdue = 0
        if (key == 'possible') task.possible = 0
        if (key == 'urgent') task.urgent = 0
      }
      for (var i = 0; i < res.data.length; i++) {
        {
          var index = this.task3.findIndex(item => item.taskName === res.data[i].taskName)
          if (index < 0) {
            continue
          }
          if (!this.task3[index][key + 'data'] || i == 0) {
            this.task3[index][key + 'data'] = []
          }
          this.task3[index][key + 'data'].push(res.data[i])
          this.task3[index][key] = this.task3[index][key] + 1
        }
      }
    },
    openOverview() {
      this.drawer2 = !this.drawer2
    },
    showTaskStatus(h) {
      if (h.status == 0) {
        return ''
      } else if (h.status == 1) {
        if (Date.now() > h.dueDate) {
          return 'Overdue'
        } else if (Date.now() > h.urgentDate) {
          return 'Urgent'
        }
        return 'Possible'
      } else if (h.status == 2) {
        return 'Finished'
      }
    },
    showTask(item, list, index) {
      if (item.status == 100 || item.status == 300) {
        return
      }
      console.log(list)
      console.log(index)
      this.orderIndex = index
      this.drawer = true
      this.taskList = list
      if (list.length > 0) {
        this.title = list[0].orderNumber
      }
    },

    sendEmail(task) {
      reminder({
        status: this.showTaskStatus(task),
        orderNumber: task.orderNumber,
        taskName: task.taskName,
        partyId: task.partyId
      }).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Success',
          type: 'success'
        })
      })
    },
    toOrder2(orderNumber) {
      this.taskDetailDataVisible = false
      this.drawer2 = false
      this.$set(this.queryParams, 'bookingNumber', orderNumber)
      this.getList()
    },
    handleTask(task) {
      this.view = false
      this.task = task
      this.form = {}
      if (task.taskName == 'Accept booking') {
        const url = this.$router.resolve({
          path: '/shipment/ppshippingOrderDetail'
        }).href
        window.location.href = url + '?id=' + task.orderId
      } else if (task.taskName == 'Carrier booking') {
        this.drawer = false
        this.queryParams.shippingBooking = false
        this.queryParams.status = '1'
        this.getList()
      } else if (task.taskName == 'Booking confirmation') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM by shipper') {
        this.drawer = false
      } else if (task.taskName == 'SI/VGM submit to carrier') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      }
    },

    viewTask(task) {
      this.view = true
      this.task = task
      if (task.jsonData != null && task.jsonData != '') {
        this.form = JSON.parse(task.jsonData)
      }

      if (task.taskName == 'Accept booking') {
        const url = this.$router.resolve({
          path: '/shipment/ppshippingOrderDetail'
        }).href
        window.location.href = url + '?id=' + task.orderId
      } else if (task.taskName == 'Carrier booking') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'Booking confirmation') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM by shipper') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM submit to carrier') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      }
    },
    submitTask() {
      this.task.jsonData = JSON.stringify(this.form)
      updateTask(this.task).then(res => {
        this.crdFormVisible = false
        this.inspectionFormVisible = false
        this.pickupFormVisible = false
        this.containerStuffingFormVisible = false
        this.customClearanceFormVisible = false
        this.departureConfirmFormVisible = false
        this.arrivalConfirmFormVisible = false
        this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId)
        this.getList()
      })
    },
    /**
     * 预加载空运基础数据（机场和航空公司）
     */
    loadAirBaseData() {
      if (this.airDataLoaded) {
        return // 避免重复加载
      }

      Promise.all([this.getAirlineList(), this.getAirportList()])
        .then(() => {
          this.airDataLoaded = true
          console.log('Air base data loaded successfully')
        })
        .catch(err => {
          console.error('Failed to load air base data:', err)
        })
    },

    /**
     * 获取航空公司列表
     */
    getAirlineList() {
      return getAirlineList().then(response => {
        this.airlineOptions = response.data || []
        return response
      })
    },

    /**
     * 获取机场列表
     */
    getAirportList() {
      return getAirportList().then(response => {
        this.airPortOptions = response.data || []
        return response
      })
    },

    queryAirSchedule() {
      this.$message.info('Air schedule query will be implemented')
    },
    async preAssgineOpen() {
      // 1. 基础验证：是否选择了booking
      if (this.shippingIds.length == 0) {
        this.$notify({
          message: 'No selected booking',
          type: 'warning'
        })
        return
      }

      // hold
      const resOrder = await getOrderHeadersList({ shippingOrderIds: this.shippingIds.join(',') })
      console.log('返回值', resOrder.data)
      for (var item of resOrder.data) {
        if (item.status == '2') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Hold')
          return
        }
        if (item.status == '1') {
          this.$modal.msgWarning('Order Number:' + item.orderNumber + ' Status: Cancelled')
          return
        }
      }

      // 2. 获取选中的bookings
      const selectedBookings = this.list.filter(item => this.shippingIds.includes(item.id))

      if (selectedBookings.length === 0) {
        this.$notify({
          message: 'Selected bookings not found',
          type: 'warning'
        })
        return
      }

      // 3. 检查运输方式是否一致
      const freightMethods = new Set(
        selectedBookings
          .map(item => item.freightMethod)
          .filter(item => item) // 过滤掉空值
          .filter(item => item.trim) //过滤空格
      )

      if (freightMethods.size > 1) {
        this.$notify({
          message: 'Please select bookings with the same transport mode',
          type: 'warning'
        })
        return
      }

      // 4. 确定运输方式（默认sea）
      const transportMode = freightMethods.size === 1 ? Array.from(freightMethods)[0] : 'sea'
      console.log('transportMode: ', transportMode)

      // 5. 打开对话框
      this.preAssgineVisable = true

      // 6. 根据运输方式初始化表单
      if (transportMode === 'sea') {
        this.initSeaForm(selectedBookings)
      } else if (transportMode === 'air') {
        this.initAirForm(selectedBookings)
      } else if (transportMode === 'sea_air') {
        this.initSeaAirForm(selectedBookings)
      }
    },

    /**
     * 运输方式变更处理
     */
    handleTransportModeChange(value) {
      // 清空表单字段
      this.preAssgineForm.carrier = ''
      this.preAssgineForm.service = ''
      this.preAssgineForm.pol = ''
      this.preAssgineForm.pod = ''
      this.preAssgineForm.por = ''
      this.preAssgineForm.fnd = ''
      this.preAssgineForm.vessel = ''
      this.preAssgineForm.voyage = ''
      this.preAssgineForm.etdTime = ''
      this.preAssgineForm.etatime = ''

      if (value === 'air') {
        // 如果数据还没加载，则加载（作为保险措施）
        if (!this.airDataLoaded) {
          this.loadAirBaseData()
        }

        // 设置空运默认时间
        this.preAssgineForm.etdTime = '09:00'
        this.preAssgineForm.etatime = '09:00'
      }
    },

    // 初始化海运表单
    initSeaForm(selectedBookings) {
      const firstBooking = selectedBookings[0]

      // 检查是否需要显示重新分配原因
      this.showRePreAssignReason = false
      for (const booking of selectedBookings) {
        if (booking.bookingPreAssignDOS && booking.bookingPreAssignDOS.length > 0) {
          const hasOpenOrAssigned = booking.bookingPreAssignDOS.some(item => item.status === 'open' || item.status === 'transport assigned')
          if (hasOpenOrAssigned) {
            this.showRePreAssignReason = true
            break
          }
        } else {
          this.showRePreAssignReason = true
        }
      }

      // 如果第一个booking有预分配数据，则填充表单
      if (firstBooking.bookingPreAssignDOS && firstBooking.bookingPreAssignDOS.length > 0) {
        const preAssignData = firstBooking.bookingPreAssignDOS[0]

        this.preAssgineForm = {
          freightMethod: 'sea', // ✅ 修改这里：transportMode -> freightMethod
          carrier: preAssignData.carrier || '',
          service: preAssignData.service || '',
          por: preAssignData.por || '',
          pol: preAssignData.pol || '',
          pod: preAssignData.pod || '',
          fnd: preAssignData.fnd || '',
          etd: preAssignData.etd || new Date().getTime(),
          eta: preAssignData.eta || '',
          vessel: preAssignData.vessel || '',
          voyage: preAssignData.voyage || '',
          etdTime: '',
          etatime: '',
          comment: ''
        }
      } else {
        // 没有预分配数据，使用默认值
        this.preAssgineForm = {
          freightMethod: 'sea', // ✅ 修改这里
          carrier: '',
          service: '',
          por: '',
          pol: '',
          pod: '',
          fnd: '',
          etd: new Date().getTime(),
          eta: '',
          vessel: '',
          voyage: '',
          etdTime: '',
          etatime: '',
          comment: ''
        }
      }
    },

    // 初始化空运表单
    async initAirForm(selectedBookings) {
      const firstBooking = selectedBookings[0]
      console.log('firstBooking', firstBooking)
      this.showRePreAssignReason = false

      // 确保空运数据已加载
      if (!this.airDataLoaded) {
        this.loadAirBaseData()
      }

      // 先初始化默认值
      this.preAssgineForm = {
        freightMethod: 'air',
        carrier: '',
        flight: '',
        por: '',
        pol: '',
        pod: '',
        fnd: '',
        etd: new Date().getTime(),
        eta: '',
        vessel: '',
        voyage: '',
        etdTime: '09:00',
        etatime: '09:00',
        comment: ''
      }

      // 如果有 shippingOrderId，则从接口拉取数据填充
      if (this.shippingOrderId) {
        try {
          const response = await getListAirPreAssign({
            shippingOrderId: this.shippingOrderId
          })

          const data = response?.data[0]
          if (data) {
            this.preAssgineForm = {
              ...this.preAssgineForm, // 保留默认兜底值
              freightMethod: data.freightMethod || 'air',
              carrier: data.carrier || '',
              flight: data.flight || '',
              por: data.por || '',
              pol: data.pol || '',
              pod: data.pod || '',
              fnd: data.fnd || '',
              etd: data.etd || new Date().getTime(),
              eta: data.eta || '',
              vessel: data.vessel || '',
              voyage: data.voyage || '',
              etdTime: data.etdTime || '09:00',
              etatime: data.etatime || '09:00',
              comment: data.comment || ''
            }
          }
        } catch (error) {
          console.error('Failed to load air pre-assign data:', error)
        }
      }
    },


    // 初始化海运-空运表单
    async initSeaAirForm(selectedBookings) {
      const firstBooking = selectedBookings[0]
      // 检查是否需要显示重新分配原因
      this.showRePreAssignReason = false
      for (const booking of selectedBookings) {
        if (booking.bookingPreAssignDOS && booking.bookingPreAssignDOS.length > 0) {
          const hasOpenOrAssigned = booking.bookingPreAssignDOS.some(
            item => item.status === 'open' || item.status === 'transport assigned'
          )
          if (hasOpenOrAssigned) {
            this.showRePreAssignReason = true
            break
          }
        } else {
          this.showRePreAssignReason = true
        }
      }

      // 如果第一个booking有预分配数据，则填充表单
      if (firstBooking.bookingPreAssignDOS &&
        firstBooking.bookingPreAssignDOS.length > 0) {
        const preAssignData = firstBooking.bookingPreAssignDOS[0]

          console.log('firstBooking', firstBooking)


        // 获取air的数据 根据preAssignData的id
        const airResponse = await seaAirPreAssignlistByShippingOrderId(firstBooking.id);
        console.log('airResponse',airResponse)
        var airData;
        if (airResponse.data &&
          airResponse.data.length > 0) {
           airData = airResponse.data[0]
          }
        console.log('airData', airData)

        // 拆分 airData.etd 为 airETD 和 etdTime
        const { airYMD:airETD, time:etdTime } = this.splitAirDate(airData.etd)
        const { airYMD:airETA, time:etaTime } = this.splitAirDate(airData.eta)

        console.log('airData.eta', airData.eta)


        console.log('airETD', airETD)
                console.log('airETA', airETA)
        console.log('etdTime', etdTime)

        console.log('etaTime', etaTime)

        this.preAssgineForm = {
          freightMethod: 'sea_air', // ✅ 修改这里：transportMode -> freightMethod
          carrier: preAssignData.carrier || '',
          service: preAssignData.service || '',
          por: preAssignData.por || '',
          pol: preAssignData.pol || '',
          pod: preAssignData.pod || '',
          fnd: preAssignData.fnd || '',
          etd: preAssignData.etd || new Date().getTime(),
          eta: preAssignData.eta || '',
          vessel: preAssignData.vessel || '',
          voyage: preAssignData.voyage || '',
          comment: '',

          airCarrier: airData.carrier || '',
          flight: airData.flight || '',
          airPol: airData.pol || '',
          airPod: airData.pod || '',
          airETD: airData.etd,
          airETA: airData.eta,
          etdTime: etdTime || '09:00',
          etatime: etaTime || '09:00',
          airComment: ''
        }
      } else {
        // 没有预分配数据，使用默认值
        this.preAssgineForm = {
          freightMethod: 'sea_air', // ✅ 修改这里
          carrier: '',
          service: '',
          por: '',
          pol: '',
          pod: '',
          fnd: '',
          etd: new Date().getTime(),
          eta: '',
          vessel: '',
          voyage: '',
          etdTime: '',
          etatime: '',
          comment: '',

          airCarrier: '',
          flight: '',
          airPol: '',
          airPol: '',
          airETD: '',
          etdTime: '09:00',
          airETA: '',
          etatime: '09:00',
          airComment: ''
        }
      }

      // 确保空运数据已加载
      if (!this.airDataLoaded) {
        this.loadAirBaseData()
      }

      // 空运表单初始化

      // 如果有空运数据  需要初始化空运的数据
    },



    // preAssgineOpen() {
    //   if (this.shippingIds.length == 0) {
    //     this.$notify({
    //       message: 'No selected booking',
    //       type: 'warning'
    //     })
    //   } else {
    //     this.showRePreAssignReason = false
    //     console.log('this.list', this.list)
    //     var tempPreAssigns = this.list.filter(item => Array.isArray(this.shippingIds) && this.shippingIds.includes(item.id))
    //     console.log('111', tempPreAssigns)
    //     for (var item of tempPreAssigns) {
    //       console.log('222', item.bookingPreAssignDOS)
    //       if (item.bookingPreAssignDOS.length > 0) {
    //         var preAssignItems = item.bookingPreAssignDOS.filter(item => item.status == 'open' || item.status == 'transport assigned')
    //         if (preAssignItems.length > 0) {
    //           this.showRePreAssignReason = true
    //         }
    //       } else {
    //         this.showRePreAssignReason = true
    //         console.log('2345', this.showRePreAssignReason)
    //       }
    //     }

    //     this.preAssgineVisable = true
    //     if (this.list.filter(item => item.id == this.shippingIds[0]).length > 0) {
    //       var len = this.list.filter(item => item.id == this.shippingIds[0])[0].bookingPreAssignDOS.length
    //       if (len > 0) {
    //         var preObj = this.list.filter(item => item.id == this.shippingIds[0])[0].bookingPreAssignDOS[0]
    //         console.log(preObj)
    //         const tmp = JSON.parse(JSON.stringify(preObj))
    //         this.preAssgineForm = Object.assign({}, this.preAssgineForm, tmp, { comment: '' })
    //         return
    //       } else {
    //         this.preAssgineForm = { por: '', fnd: '', etd: new Date().getTime(), comment: '' }
    //       }
    //     } else {
    //       this.preAssgineForm = { por: '', fnd: '', etd: new Date().getTime(), comment: '' }
    //     }
    //     this.preAssgineForm.comment = ''
    //   }
    // },
    handleBatchApproval() {
      this.$refs.batchApproval.openDialog()
    },
    queryShippingSchedule() {
      console.log('this.ddd', this.preAssgineForm)

      if (this.preAssgineForm.carrier != null && this.preAssgineForm.carrier.trim() != '') {
        if (this.preAssgineForm.carrier == 'TSHG') {
          if (this.preAssgineForm.por != null && this.preAssgineForm.pod != null && this.preAssgineForm.por.trim() != '' && this.preAssgineForm.pod.trim() != '') {
            this.scheduleForm = {
              origin: this.preAssgineForm.por,
              destination: this.preAssgineForm.pod,
              departureFrom: this.preAssgineForm.etd,
              departureFrom2: this.preAssgineForm.eta,
              carrier: this.carrierMap[this.preAssgineForm.carrier]
            }
            console.log('search data', this.scheduleForm)
            this.findShippingScheduleList()
            this.shippingScheduleVisable = true
          } else {
            this.$notify({
              title: 'warning',
              message: 'origin or destination is empty',
              type: 'warning'
            })
            return false
          }
        } else {
          if (this.preAssgineForm.pol != null && this.preAssgineForm.pod != null && this.preAssgineForm.pol.trim() != '' && this.preAssgineForm.pod.trim() != '') {
            this.scheduleForm = {
              origin: this.preAssgineForm.pol,
              destination: this.preAssgineForm.pod,
              departureFrom: this.preAssgineForm.etd,
              departureFrom2: this.preAssgineForm.eta,
              carrier: this.carrierMap[this.preAssgineForm.carrier]
            }
            this.findShippingScheduleList()
            this.shippingScheduleVisable = true
          } else {
            this.$notify({
              title: 'warning',
              message: 'origin or destination is empty',
              type: 'warning'
            })
            return false
          }
        }
      } else {
        this.$notify({
          title: 'warning',
          message: 'carrier is empty',
          type: 'warning'
        })
        return false
      }
    },
    findShippingScheduleList() {
      console.log('start search schedule', this.scheduleForm)
      this.scheduleLoading = true
      var data = JSON.parse(JSON.stringify(this.scheduleForm))
      ;(data.departureFrom = this.parseTime(data.departureFrom)), (data.departureFrom2 = this.parseTime(data.departureFrom2)), (data.service = this.scheduleForm.service)
      findShippingScheduleList(data).then(response => {
        console.log('return data', response.data)
        this.shippingScheduleData = response.data
        this.scheduleLoading = false
      })
    },
    submitPreAssign() {
      this.$refs['preAssF'].validate(valid => {
        console.log(valid)
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.preAssgineForm))
          data.bookingIds = this.shippingIds

          console.log('data',data)
          console.log('this.shippingIds', this.shippingIds)

          // 根据运输方式调用不同接口
          if (data.freightMethod === 'air') {
            this.submitAirPreAssign(data)
          } else if (data.freightMethod === 'sea') {
            this.submitSeaPreAssign(data)
          }else if(data.freightMethod === 'sea_air'){
            this.submitSeaAirPreAssign(data)
          }
        } else {
          return false
        }
      })
    },

    // 海运提交
    submitSeaPreAssign(data) {
      // etd 限制
                const limitDate = new Date('2026-07-31 23:59:59')
                if (data.etd > limitDate.getTime()) {
                  this.$notify({
                    title: 'warning',
                    message: 'Pre-assign ETD can only select till end of July, Y2026 till further notice',
                    type: 'warning'
                  })
                  return
                }
                this.preAssignLoading = true
      createPreAssign(data)
        .then(res => {
          if (res.code != null && res.code == 0) {
            this.$notify({
              title: 'Success',
              message: 'Sea transport pre-assign submitted successfully',
              type: 'success'
            })
            localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
          }
          this.resetAfterSubmit()
        })
        .catch(err => {
          console.error('Sea pre-assign error:', err)
        })
        .finally(() => {
          this.preAssignLoading = false
        })
    },
    // 合并日期和时间
    combineDateAndTime(data){
      // 合并日期和时间
      if (data.etd && data.etdTime) {
        const etdDate = new Date(data.etd)
        const [hours, minutes] = data.etdTime.split(':')
        etdDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        data.etd = etdDate.getTime()
      }

      if (data.eta && data.etatime) {
        const etaDate = new Date(data.eta)
        const [hours, minutes] = data.etatime.split(':')
        etaDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        data.eta = etaDate.getTime()
      }

      // 删除时间字段
      delete data.etdTime
      delete data.etatime
    },
    // 空运提交
    submitAirPreAssign(data) {
      // 合并日期和时间
      if (data.etd && data.etdTime) {
        const etdDate = new Date(data.etd)
        const [hours, minutes] = data.etdTime.split(':')
        etdDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        data.etd = etdDate.getTime()
      }

      if (data.eta && data.etatime) {
        const etaDate = new Date(data.eta)
        const [hours, minutes] = data.etatime.split(':')
        etaDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        data.eta = etaDate.getTime()
      }

      // 删除时间字段
      delete data.etdTime
      delete data.etatime

      this.preAssignLoading = true
      createAirPreAssign(data)
        .then(res => {
          if (res.code != null && res.code == 0) {
            this.$notify({
              title: 'Success',
              message: 'Air transport pre-assign submitted successfully',
              type: 'success'
            })
            localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
          }
          this.resetAfterSubmit()
        })
        .catch(err => {
          console.error('Air pre-assign error:', err)
        })
        .finally(() => {
          this.preAssignLoading = false
        })
    },
    // sea_air
    submitSeaAirPreAssign(data) {
      // 先提交sea，在提交air
      const airData = {
        freightMethod: data.freightMethod,
        carrier: data.airCarrier,
        pol: data.airPol,
        pod: data.airPod,
        etd: data.airETD,
        eta: data.airETA,
        comment: data.airComment,
        etdTime: data.etdTime,
        etatime: data.etatime,
        flight: data.flight,
        bookingIds: data.bookingIds,
      }
      const seaData = {
        freightMethod: data.freightMethod,
        carrier: data.carrier,
        service: data.service,
        por: data.por,
        pol: data.pol,
        pod: data.pod,
        fnd: data.fnd,
        etd: data.etd,
        eta: data.eta,
        vessel: data.vessel,
        voyage: data.voyage,
        comment: data.comment,
        bookingIds: data.bookingIds,
        airLeg: airData,
      }

      this.combineDateAndTime(airData)
      this.preAssignLoading = true
      // 提交sea
      createSeaAirPreAssign(seaData)
        .then(res => {
          if (res.code != null && res.code == 0) {
            airData.preAssignId = res.data.id
            // 提交air
            this.$notify({
              title: 'Success',
              message: 'Sea-Air transport pre-assign submitted successfully',
              type: 'success'
            })
            localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
          }
          this.resetAfterSubmit()
        })
        .catch(err => {
          console.error('Sea-Air transport pre-assign error:', err)
        })
        .finally(() => {
          this.preAssignLoading = false
        })
    },


    // 提交后重置
    resetAfterSubmit() {
      this.preAssgineVisable = false
      this.shippingIds = []
      this.getList()
    },

    // submitPreAssign() {
    //   this.$refs['preAssF'].validate(valid => {
    //     console.log(valid)
    //     if (valid) {
    //       var data = JSON.parse(JSON.stringify(this.preAssgineForm))
    //       data.bookingIds = this.shippingIds
    //       this.preAssignLoading = true
    //       createPreAssign(data)
    //         .then(res => {
    //           if (res.code != null && res.code == 0) {
    //             this.$notify({
    //               title: 'Success',
    //               message: 'Success',
    //               type: 'success'
    //             })
    //             localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
    //           }
    //           this.preAssgineVisable = false
    //           this.shippingIds = []
    //           this.getList()
    //         })
    //         .finally(() => {
    //           this.preAssignLoading = false
    //         })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
      } else {
        this.vesselListLes = []
      }
    },
    choseSchedule(row) {
      console.log(row)
      this.preAssgineForm.backup = JSON.stringify(row)
      this.$set(this.preAssgineForm, 'carrier', this.carrierMap2[row.carrier])
      this.$set(this.preAssgineForm, 'etd', row.departureDate)
      this.$set(this.preAssgineForm, 'eta', row.arrivalDate)
      this.$set(this.preAssgineForm, 'vessel', row.vesselName)
      this.$set(this.preAssgineForm, 'voyage', row.voyage)
      this.$set(this.preAssgineForm, 'service', row.service)
      if (this.preAssgineForm.pol == null) {
        this.$set(this.preAssgineForm, 'pol', row.port)
      }
      if (this.preAssgineForm.pod == null) {
        this.$set(this.preAssgineForm, 'pod', row.pod)
      }
      this.shippingScheduleVisable = false
    },
    editReason(row) {
      ;(this.preAssignReason = row), (this.rmPoReasonDialogVisible = true)
      this.getCancelReason1(row.rejectReason)
      this.rmPoReasonData.rejectReason = row.rejectReason
      this.rmPoReasonData.rejectReason1 = row.rejectReason1
      this.rmPoReasonData.rejectComments = row.rejectComments
    },
    getCancelReason1(prov) {
      let tempCancelReason = []
      for (var val of this.selCancelReason) {
        if (prov == val.parentEnumId) {
          tempCancelReason.push({ description: val.description, enumId: val.enumId })
        }
      }
      this.selectCancelReason = tempCancelReason

      this.rmPoReasonData.rejectReason1 = null
    },
    parseTimeToZ1(timestamp) {
      // console.log(timestamp,timestamp)
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    getPreAssignStatus(type, status) {
      if (type == 'Carrier Booking') {
        if (status == 'history') {
          return 'Revoked'
        } else if (status == 'transport assigned') {
          return 'Booked'
        } else if (status == 'cancel') {
          return 'Canceled'
        } else if (status == 'REMOVE') {
          return 'REMOVE'
        }
      } else {
        if (status == 'history') {
          return 'Pre-assigned'
        } else if (status == 'open') {
          return 'Pre-assigned'
        } else if (status == 'transport assigned') {
          return 'Booked'
        } else if (status == 'REMOVE') {
          return 'REMOVE'
        }
      }
    },
    getDropDownValues() {
      findDropDownListFromCt().then(response => {
        if (response && response.data) {
          if (response.data.cancelReasonList) {
            this.selCancelReason = response.data.cancelReasonList

            this.selCancelReason1 = [...response.data.cancelReasonList]
            this.selCancelReason1.push(...this.rePreAssignOptions)
            this.selCancelReason1.push(...this.cargoCloseOptions)
            this.selCancelReason1.push(...this.lotRemoveOptions)
            this.selCancelReason1.push(...this.sinoLotRemoveOptions)
          }
          if (response.data.cancelCategoryList) {
            this.selCancelCategory = response.data.cancelCategoryList
            this.selCancelCategory1 = [...response.data.cancelCategoryList]
            this.selCancelCategory1.push(...this.rePreAssignOptions)
            this.selCancelCategory1.push(...this.cargoCloseOptions)
            this.selCancelCategory1.push(...this.lotRemoveOptions)
            this.selCancelCategory1.push(...this.sinoLotRemoveOptions)
          }
        }
      })
    },
    getUserName(creator) {
      return this.userMap.get(creator)
    },
    // 在update status 前增加限制操作 edwin
    beforeConfirmUpdateStatus(id) {
      return this.needManualAdjust(id)
    },
    // 是否需要人工调整
    needManualAdjust(id) {
      return isNeedManualAdjust({ orderHeaderId: id })
    },
    handleClick(el, item, index) {
      console.log('item.freightMethod', item.freightMethod)

      if (item.show.startsWith('Documents')) {
        console.log('item.shippingOrderId', item.id)
        this.$refs.managementDocuments[index].getFileByShippingOrderId(item.id)
      }
      // 添加 Transport Pre-assign 的处理 - zane
      if (item.show.startsWith('pre-assign') && item.freightMethod === 'air') {
        this.$nextTick(() => {
          const ref = this.$refs['airPreAssign' + item.id]
          if (ref && ref.length > 0) {
            // 重置 hasLoaded 并重新加载
            ref[0].refresh()
          } else if (ref && ref.refresh) {
            ref.refresh();
          }
        });
      }
      console.log('item.freightMethod1', item.freightMethod)
      console.log('item.show', item.show)

      if (item.show.startsWith('pre-assign') && item.freightMethod === 'sea_air') {
        console.log('item.show1', item.show)

        this.$nextTick(() => {
          const ref = this.$refs['seaAirPreAssign' + item.id];
          if (ref && ref.length > 0) {
            // 重置 hasLoaded 并重新加载
            ref[0].refresh();
          } else if (ref && ref.refresh) {
            ref.refresh();
          }
        })
      }
      if (item.show.startsWith('DCReasonLogs')) {
        this.loadDcReasonLogs(item, item.id)
      }
      this.shippingOrderId = item.id
      this.listIndex = index

      if (this.activeName.startsWith('Comments')) {
        console.log('tab click', this.activeName)
        this.$refs.orderComments[index].loadComments()
      }
    },
    awaitBookingChange(flag) {
      this.queryParams.shippingNewBooking = null
      this.queryParams.shippingBooking = null
      this.queryParams.awaitApprovalBooking = null
      if (this.queryParams.awaitApprovalBooking == flag) {
        this.queryParams.awaitApprovalBooking = null
      } else {
        this.queryParams.awaitApprovalBooking = flag
      }
      this.getList()
    },

    pendingBookingChange(flag) {
      this.queryParams.shippingNewBooking = null
      this.queryParams.shippingBooking = null
      this.queryParams.awaitApprovalBooking = null
      if (this.queryParams.pepcoPendingBooking == flag) {
        this.queryParams.pepcoPendingBooking = null
      } else {
        this.queryParams.pepcoPendingBooking = flag
      }
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      try {
        this.progressId = uuidv4()
        this.queryParams.progressId = this.progressId
        createExportTask(this.queryParams)
        this.startPolling()
      } catch (e) {
        this.$message.error('createExportTask error')

        this.downloadLoading = false
      }
    },

    startPolling() {
      // 先清除可能存在的旧定时器
      this.stopPolling()

      // 立即执行第一次查询
      // this.getExportProgress();

      // 设置定时器，每隔3秒执行一次
      this.pollInterval = setInterval(this.getExportProgress, 3000)
    },
    // 停止查询
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
        this.percentage = 0
      }
    },
    // 实际查询数据的函数
    async getExportProgress() {
      try {
        const response = await getExportProgress({ progressId: this.progressId })
        if (!response) return

        if (response.data.sum === 0) {
          this.percentage = 0
        } else {
          this.percentage = Math.round((response.data.current / response.data.sum) * 100)
        }

        if (response.data.done) {
          this.stopPolling()
          this.downloadLoading = false
          this.$message.success('export task done')
          this.downloadExcelFile(this.progressId)
          // clearExportProgress({ progressId: this.progressId })
        }

        if (response.data.failed) {
          this.stopPolling()
          this.downloadLoading = false
          this.$message.error('export task failed')
          // clearExportProgress({ progressId: this.progressId })
        }
      } catch (error) {
        console.error('requestExportProgress error:', error)
        this.stopPolling()
        this.downloadLoading = false
      }
    },
    async downloadExcelFile(progressId) {
      try {
        const response = await downloadExcel({ progressId }) // 这里返回的就是带签名的 fileUrl

        if (!response.data) {
          this.$message.error('Download file error: empty fileUrl')
          return
        }
        const tenantId = getTenantId()
        const token = getAccessToken()
        // 用 axios 去下载文件（二进制流），带上 token 和 tenantId
        const fileResponse = await axios.get(response.data, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            'tenant-id': tenantId
          }
        })

        // 生成本地下载链接
        const blob = new Blob([fileResponse.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'pepco_shipper_booking.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      } catch (err) {
        console.error('Download file error:', err)
        this.$message.error('Download file error')
      }
    },

    clearFilters() {
      // this.queryParams.freightMethod = null
      this.queryParams.freightMethod = []
      this.queryParams.voyage = null
      this.queryParams.transportMeanName = null
      this.queryParams.carrier = null
      this.queryParams.dcList = []
      this.queryParams.country = null

      this.queryParams.soRef = null
      this.queryParams.customerRef = null
      // this.queryParams.originPortList = [];
      this.queryParams.shipmentType = null
      this.queryParams.status = null
      this.queryParams.shipmentRef = null
      this.queryParams.shipperRef = null
      this.queryParams.originPort = null
      this.queryParams.destinationPort = null
      this.queryParams.supplierCode = null

      this.queryParams.tpl = null
      this.queryParams.tpd = null
      this.queryParams.missInDC = null

      this.queryParams.latestCrd = []
      this.queryParams.latestHod = []

      this.queryParams.ataFlag = null
      this.queryParams.atdFlag = null
      this.queryParams.poTags = []

      this.queryParams.overdueBookedETD = null

      this.queryParams.originPort = null
      this.queryParams.destinationPort = null

      this.queryParams.incoterm = null

      this.handleQuery()
    },
    switchToDcReasonLog(item, index) {
      if (this.checkPermi(['pepco:shipping-order:miss_in_dc_date_log'])) {
        var shippingId = item.id
        // 切换到DC Reason Log标签页
        item.show = `DCReasonLogs${shippingId}`
        this.shippingOrderId = shippingId
        this.listIndex = index
        this.loadDcReasonLogs(item, shippingId)
      }
    },
    // 显示添加原因弹框
    showAddReasonDialog(item, index) {
      if (this.checkPermi(['pepco:shipping-order:miss_in_dc_date_log'])) {
        var shippingId = item.id
        this.shippingOrderId = shippingId
        this.listIndex = index
        this.addReasonDialogVisible = true
        // 重置表单
        this.reasonForm = {
          reasonType: '',
          reasonContent: '',
          reasonRemark: '',
          reasonCode: ''
        }
        if (this.$refs.reasonForm) {
          this.$refs.reasonForm.resetFields()
        }
      }
    },
    // 加载DC原因日志
    loadDcReasonLogs(item, soId) {
      item.dcReasonLogs = []
      this.dcLoading = true

      getDcReasonLogs({ soId: soId }).then(res => {
        item.dcReasonLogs = res.data
        // 刷新当前列表
        if (this.listIndex !== -1) {
          this.list[this.listIndex].dcReasonLogs = res.data
          //重置索引
          this.listIndex = -1
        }
        this.dcLoading = false
      })
    },
    // 提交原因
    submitReason() {
      this.$refs['reasonForm'].validate(valid => {
        if (valid) {
          this.addReasonDialogVisible = false
          createDcDataLog({
            soId: this.shippingOrderId,
            reasonType: this.reasonForm.reasonType,
            reasonContent: this.reasonForm.reasonContent,
            reasonRemark: this.reasonForm.reasonRemark,
            //code 从missDCList根据value查询
            reasonCode: this.missDCList.find(item => item.value === this.reasonForm.reasonContent)?.remark
          }).then(res => {
            this.$message.success('Success')
            this.loadDcReasonLogs(this.list[this.listIndex], this.shippingOrderId)
          })
        }
      })
    },
    onCarrierChange(value) {
      // 设置Final Destination options
      let finalPortOptions = this.portOptions
      // Carrier、Port of Discharge存在时才限制Final Destination
      if (value && this.preAssgineForm.pod) {
        // 查找当前value是否需要限制
        const carrier = transportPAMap.find(item => item.carrier === value)
        if (carrier) {
          const finalCodes = carrier.children.find(item => item.discharge === this.preAssgineForm.pod)
          if (finalCodes) {
            finalPortOptions = this.portOptions.filter(item => finalCodes.options.includes(item.code))
            // 清除Final Destination旧数据
            this.preAssgineForm.fnd = null
          }
        }
      }
      this.finalPortOptions = finalPortOptions
    },
    onDischargeChange(value) {
      // 设置Final Destination options
      let finalPortOptions = this.portOptions
      // Carrier、Port of Discharge存在时才限制Final Destination
      if (value && this.preAssgineForm.carrier) {
        // 查找当前value是否需要限制
        const carrier = transportPAMap.find(item => item.carrier === this.preAssgineForm.carrier)
        if (carrier) {
          const finalCodes = carrier.children.find(item => item.discharge === value)
          if (finalCodes) {
            finalPortOptions = this.portOptions.filter(item => finalCodes.options.includes(item.code))
            // 清除Final Destination旧数据
            this.preAssgineForm.fnd = null
          }
        }
      }
      this.finalPortOptions = finalPortOptions
    },
    /** Validate ETA is not earlier than ETD when ETD changes */
    validateEtd(rule, value, callback) {
      if (!this.preAssgineForm.eta) {
        callback()
      }
      // Create date objects with only year, month, day
      const etdDate = new Date(value)
      const etaDate = new Date(this.preAssgineForm.eta)

      // Set time to 00:00:00 for both dates to compare only year, month, day
      const etdOnlyDate = new Date(etdDate.getFullYear(), etdDate.getMonth(), etdDate.getDate())
      const etaOnlyDate = new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate())

      if (etaOnlyDate < etdOnlyDate) {
        callback(new Error('ETD must be earlier than ETA'))
      } else {
        callback()
      }
    },
    /** Validate ETA is not earlier than ETD */
    validateEta(rule, value, callback) {
      if (!this.preAssgineForm.etd) {
        callback()
      }
      // Create date objects with only year, month, day
      const etaDate = new Date(value)
      const etdDate = new Date(this.preAssgineForm.etd)

      // Set time to 00:00:00 for both dates to compare only year, month, day
      const etdOnlyDate = new Date(etdDate.getFullYear(), etdDate.getMonth(), etdDate.getDate())
      const etaOnlyDate = new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate())

        if (etaOnlyDate < etdOnlyDate) {
          callback(new Error('ETA must be later than ETD'));
        } else {
          callback();
        }
    },
    // 2026-04-07，Excel导出接口调整
    onDownloadExcel() {
      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // 开始下载前先将进度条重置为0
        this.percentage = 0
        this.downloadLoading = true
        // 使用定时器模拟进度条
        this.timer = setInterval(() => {
          if (this.percentage < 90) {
            this.percentage = this.percentage + 10
          }
        }, 1000)
        // 开始导出Excel
        downloadShippingExcel(this.queryParams).then(res => {
          if (res) {
            // 创建一个URL对象，利用a标签进行下载
            const url = URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pepco_shipper_booking_${new Date().valueOf()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }).finally(() => {
          // 下载完成后将进度条进度条设置为100，并且清除定时器
          this.percentage = 100
          this.downloadLoading = false
          if (this.timer) {
            clearInterval(this.timer)
          }
        })
      }).catch(() => {

      })
    },
    // Named Place label edwin
    namedPlaceLabel(namedPlace) {
      const dict = this.getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE).find(
        item => item.value === namedPlace
      );
      return dict ? dict.label : '';
    },
  },
  // 组件销毁时清除定时器
  beforeDestroy() {
    this.stopPolling()
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style>
.shipment-logo .partyLogo {
  position: relative !important;
  top: 23px !important;
  margin-left: 20px !important;
}

.car-css {
  padding-bottom: 4px;
}

span.el-descriptions-item__label.shipment-status-class {
  margin-right: 0px !important;
}

.el-checkbox.is-bordered.el-checkbox--medium {
  padding: 7px 12px 7px 12px;
}

.margin-top.el-row {
  padding: 0px 0px 15px 15px;
}

.avticePort {
  background-color: #3a71a8;
  color: #fff;
}

.mr-4 {
  margin-right: 4px;
}
/* Ceramic Products 的紫色标签样式 */
::v-deep .tag-purple.el-tag--info {
  background-color: #9b59b6;
  border-color: #8e44ad;
  color: #fff;
}

p {
  margin: 0px;
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
</style>
<style scoped>
/deep/ .el-descriptions__body {
  /** 任务[TYIN-4776]解决列表右侧详情按钮展示不全的问题 **/
  margin-bottom: 10px;
}
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

.error-text {
  color: #f56c6c; /* 红色 */
}
</style>
<style lang="scss" scoped>
/* 波纹滚动效果 */
::v-deep .ripple-progress .el-progress-bar__inner {
  position: relative;
  overflow: hidden;
}

::v-deep .ripple-progress .el-progress-bar__inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
