<template xmlns="">
  <div class="app-container">
    <div style="display: flex; padding-bottom: 10px;">
      <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;margin-top: 10px">
        <icon-park style="border-right: 1px solid #ddd;" type="cruise" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
        <div
          @click="queryParams.isAtd = queryParams.isAtd == true ? false : true, handleQuery()"
          :class="{ 'avticePort': queryParams.isAtd == true }"
          style="float: right;line-height: 24px;margin-left: 10px;    border-radius: 10px;padding: 0px 15px;cursor: pointer;"
        >
          <p style="font-size: 20px;">{{ shipmentInfo.atd ? shipmentInfo.atd : 0 }}</p>
          <p> Departure</p>
        </div>
      </el-card>

      <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;margin-top: 10px">
        <icon-park style="border-right: 1px solid #ddd;" type="cruise" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        <div
          @click="queryParams.isAta = queryParams.isAta == true ? false : true, handleQuery()"
          :class="{ 'avticePort': queryParams.isAta == true }"
          style="float: right;line-height: 24px;margin-left: 10px; border-radius: 10px;padding: 0px 15px;cursor: pointer;"
        >
          <p style="font-size: 20px;">{{ shipmentInfo.ata ? shipmentInfo.ata : 0 }}</p>
          <p>Arrived</p>
        </div>
      </el-card>

      <el-card class="pd-20" style="float: left; margin-right: 20px;margin-top: 10px; max-width: 50%; overflow: auto;" :body-style="{ display: 'flex' }">
        <icon-park style="border-right: 1px solid #ddd;" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        <div
          :class="{ 'avticePort': checkedPort[item.destination_port] }"
          @click="clickPort(item.destination_port)"
          v-for="item in shipmentInfo.ports"
          style="float: right;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;    cursor: pointer;
          border-radius: 10px;
            margin-left: 10px;"
        >
          <p style="font-size: 20px;">{{ item.count }}</p>
          <p>{{ item.destination_port }}</p>
        </div>
      </el-card>
    </div>
    <el-card style="padding: 20px; padding-top: 10px; ">
      <div style="padding-bottom: 20px;margin-bottom: 20px;">
        <!-- zane  更改搜索栏 -->
       <div style="padding: 10px 0px;">
          <!-- 搜索工作栏 -->
          <div style="float: left;">
            <el-input v-model="queryParams.soRef" placeholder="MOOV ref"
              @blur="queryParams.soRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1, handleQuery()" clearable @clear="handleQuery()" />
          </div>
          <div style="float: left; margin-left: 5px;">
            <el-input v-model="queryParams.customerRef" placeholder="PO"
              @blur="queryParams.customerRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1, handleQuery()" clearable @clear="handleQuery()" />
          </div>
          <div style="float: left; margin-left: 5px;">
            <el-input v-model="queryParams.shipperRef" placeholder="Shipper Ref"
              @blur="queryParams.shipperRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1, handleQuery()" clearable @clear="handleQuery()" />
          </div>
          <!-- Filter 按钮-->
          <div style="float: left; margin-left: 5px;">
            <el-popover placement="bottom" title="Filter" width="780" trigger="click">
              <el-form>
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="6">
                    <el-input v-model="queryParams.shipmentBookingNumber" placeholder="Booking Number"
                      @blur="queryParams.shipmentBookingNumber = $event.target.value.trim()" clearable />
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="queryParams.blNumber" placeholder="$constants.MBL_NUMBER"
                      @blur="queryParams.blNumber = $event.target.value.trim()" clearable />
                  </el-col>
                  <el-col :span="6">
                    <el-cascader v-model="queryParams.polArray" :options="polCascaderOptions"
                      :props="{ expandTrigger: 'hover' }" @change="handlePolChange" clearable filterable
                      placeholder="POL" style="width: 100%;" />
                  </el-col>
                  <el-col :span="6">
                    <el-select filterable clearable v-model="queryParams.shipmentType" placeholder="SO Type"
                      style="width: 100%;">
                      <el-option v-for="item in getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </el-col>
                </el-row>

                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="6">
                    <el-select filterable clearable v-model="queryParams.siCutoffStatus" placeholder="SI/VGM Cutoff"
                      style="width: 100%;">
                      <el-option label="Urgent" value="1" />
                      <el-option label="OverDue" value="2" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select filterable clearable v-model="queryParams.status" placeholder="Booking Status"
                      style="width: 100%;">
                      <el-option label="MOOV-OHA Pending" value="0" />
                      <el-option label="MOOV-OHA Accepted" value="1" />
                      <el-option label="MOOV-OHA Rejected" value="2" />
                      <el-option label="SAApproved" value="4" />
                      <el-option label="Awaiting Approval" value="5" />
                      <el-option label="Pepco Pending" value="6" />
                      <el-option label="Pepco Rejected" value="7" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="queryParams.freightMethod" placeholder="Transport Mode" clearable filterable
                               style="width: 100%;">
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value"
                                 :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-col>
                  <el-col :span="6"></el-col>
                </el-row>

                <el-row :gutter="20" style="margin-bottom: 15px;">
                  <el-col style="text-align: right">
                    <el-button @click="clearFilters" plain>Clear Filters</el-button>
                    <el-button @click="handleQuery()" icon="el-icon-search" plain>Search</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-button slot="reference" icon="el-icon-plus" plain >Filter</el-button>
            </el-popover>
          </div>

          <!-- Search 按钮：与输入框、Filter 同级，保持对齐 -->
          <div style="float: left; margin-left: 5px;">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
          </div>

          <div style="float: right; padding-top: 5px;">
            <el-button type="primary" v-if="!shipmentInfo.isCustomerFlag" v-hasPermi="['pepcoShipping:order:create']"
              @click="createShipping">Create Shipping Order</el-button>
          </div>
        </div>
        <!-- 列表 -->
        <div :style="{ height: clientHeight + 'px' }" style="float: left; width: calc(100%); position: relative;" v-loading="loading">
          <div style="overflow-y:auto; overflow-x: hidden;" :style="{ height: (clientHeight - 55) + 'px' }">
            <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
            <el-row :gutter="0" v-if="list.length > 0" style=" background: #fff;box-shadow: none!important;border: 1px solid #ddd;" v-for="(item, index) in list" :key="item.id">
              <el-col :span="3">
                <el-row>
                  <el-col :span="24" class="shipment-logo">
                    <el-image v-if="!item.carrier" class="partyLogo">
                      <div slot="error" class="image-slot">Carrier</div>
                    </el-image>
                    <img v-if="item.carrier == 'HLCU'" class="partyLogo" src="../../assets/HLCU.png" />
                    <img v-if="item.carrier == 'MAEU'" class="partyLogo" src="../../assets/MAEU.png" />
                    <img v-if="item.carrier == 'ZIMU'" class="partyLogo" src="../../assets/ZIMU.png" />
                    <img v-if="item.carrier == 'TSHG'" class="partyLogo" src="../../assets/tailwind.png" />
                    <img v-if="item.carrier == 'MSCU'" class="partyLogo" src="../../assets/MSCU-new.png" />
                    <img v-if="item.carrier == 'MSC'" class="partyLogo" src="../../assets/MSCU-new.png" />
                    <img v-if="item.carrier == 'OOLU'" class="partyLogo" src="../../assets/OOLU.svg" />
                    <img v-if="item.carrier == 'CMDU'" class="partyLogo" src="../../assets/CMA.png" />
                    <img v-if="item.carrier == 'HMM'" class="partyLogo" src="../../assets/HMM.jpg" />
                    <img v-if="item.carrier == 'ONEY'" class="partyLogo" src="../../assets/ONE.png" />
                    <img v-if="item.carrier == 'COSU'" class="partyLogo" src="../../assets/COSCO.png" />
                    <img v-if="item.carrier == 'CMA'" class="partyLogo" src="../../assets/logo/CMA.png" />
                    <img v-if="item.carrier == 'COSCO'" class="partyLogo" src="../../assets/logo/COSCO.png" />
                    <img v-if="item.carrier == 'HPL'" class="partyLogo" src="../../assets/logo/HPL.png" />

                    <img v-if="item.carrier == 'MSK'" class="partyLogo" src="../../assets/logo/MSK.png" />
                    <img v-if="item.carrier == 'ONE'" class="partyLogo" src="../../assets/logo/ONE.png" />
                    <img v-if="item.carrier == 'ZIM'" class="partyLogo" src="../../assets/logo/ZIM.png" />
                    <img v-if="item.carrier == 'EGLV'" class="partyLogo" src="../../assets/logo/EGLV.png" />
                    <img v-if="item.carrier == 'SJHH'" class="partyLogo" src="../../assets/logo/SJHH.png" />
                    <img v-if="item.carrier == 'SMLU'" class="partyLogo" src="../../assets/logo/SMLU.png" />
                    <span v-if="!['TSHG', 'MAEU', 'ZIMU', 'ZIM', 'HLCU', 'MSCU', 'OOLU',
                      'CMDU', 'ONEY', 'COSU', 'SMLU', 'EGLV', 'SJHH', 'ONE'].includes(item.carrier)">
                      {{ item.carrier
                      }}
                    </span>
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
                    <el-descriptions style="box-shadow: none; margin:0px;  top: -10px;" :colon="false">
                      <el-descriptions-item label contentStyle="display: flex; flex-wrap: wrap; align-items: center;">
                        <el-tag
                          v-if="item.shipmentType=='FCL'&&item.containerDOList && item.containerDOList.length > 0"
                          style="margin-right: 5px; margin-top: 5px; font-size: 13px; "
                          v-for="container in item.containerDOList"
                          :key="container.id"
                        >
                          {{ container.type }} x {{
                          container.qty }}
                        </el-tag>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 10px; padding-bottom: 10px;">
                <el-descriptions style="box-shadow: none; margin-bottom: -5px;" :colon="false" :column="5">
                  <el-descriptions-item label="MOOV ref" content-class-name="car-css">
                    <el-link type="primary" style="margin-top: -1px;" :href="'/shipment/ppshippingOrderDetail?id=' + item.id + '&source=shipping-order'">
                      {{
                      item.soRef }}
                    </el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipper ref">{{ item.shipperRef }}</el-descriptions-item>
                 <el-descriptions-item label="Booking Number">
                    {{ item.freightMethod === 'air'
                      ? '-'
                      : (item.shipmentBookingNumber || '-') }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$constants.MBL_NUMBER">{{ item.blNumber }}</el-descriptions-item>

                <el-descriptions-item :label="item.freightMethod === 'air'
                    ? $t('booking.originAirport')
                    : $t('booking.pol')">
                    {{ showPortLabel(item.originPort, item.freightMethod) }}
                  </el-descriptions-item>

                  <el-descriptions-item :label="item.freightMethod === 'air'
                    ? $t('booking.destinationAirport')
                    : $t('booking.pod')">
                    {{ showPortLabel(item.destinationPort, item.freightMethod) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ETD/ETA">
                    {{ item.etd ? parseUTCTime(item.etd ? item.etd : item.bookedEtd) : '-' }}
                    /
                    {{ item.eta ? parseUTCTime(item.eta ? item.eta : item.bookedEta) : '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="ATD/ATA">
                    {{ item.atd ? parseUTCTime(item.atd) : '-' }}
                    /
                    {{ item.ata ? parseUTCTime(item.ata) : '-' }}
                  </el-descriptions-item>

                  <el-descriptions-item label="SO Type">{{ item.shipmentType }}</el-descriptions-item>
                 <el-descriptions-item label="SI/VGM Cutoff" content-class-name="car-css">
                    <template v-if="item.freightMethod === 'air'">
                      <div>-</div>
                    </template>
                    <template v-else>
                      <div :class="getSICutoffColor(item)">
                        {{ item.blDraftCutoff ? formattedTimeAfterSubtracting(item.blDraftCutoff) : '-' }}
                      </div>
                    </template>
                  </el-descriptions-item>

                  <el-descriptions-item label="Booking Status">
                    <el-tag
                      @click="showDetail(item)"
                      :style="{ cursor: ((item.status == 2 || item.status == 7) ? 'pointer' : '') }"
                      :type="(item.status == -1 || item.status == 2 || item.status == 3 || item.status == 7) ? 'danger' : (item.status == 1 || item.status == 4) ? 'success' : 'warning'"
                    >{{ covStatus(item.status) }}</el-tag>
                  </el-descriptions-item>

                <el-descriptions-item label="SI/VGM Status">
                    <el-tag v-if="item.freightMethod !== 'air'"
                      :type="(item.siStatus == 1 || item.siDate != null) ? 'success' : 'warning'">
                      {{
                        item.siDate != null
                          ? "Accepted"
                          : (item.siStatus == 1
                            ? "Submited"
                            : (item.status == 1 && item.confirmed == true
                      ? "Not submitted"
                      : "Pending"))
                      }}
                    </el-tag>
                    <span v-else>-</span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Amend Status">
                    <el-tag v-if="item.approvalInfoList.length > 0" :type="covAmendType(item.approvalInfoList)">{{ covAmendStatus(item.approvalInfoList) }}</el-tag>
                  </el-descriptions-item>

                  <el-descriptions-item label="SO Party" v-if="shipmentInfo.isCustomerFlag">
                    <span>{{ item.partyName }}</span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Transport Mode(Booked)">
                    <span :class="{ 'error-text': !item.freightMethod || item.freightMethod.toUpperCase() !== 'SEA' }">
                      {{ item.freightMethod ? item.freightMethod.toUpperCase() : '-' }}
                    </span>
                  </el-descriptions-item>

                  <el-descriptions-item label="Incoterm(Booked)">
                    <span :class="{ 'error-text': !item.incoterm || item.incoterm.toUpperCase() !== 'FOB' }">
                      {{ item.incoterm ? item.incoterm.toUpperCase() : '-' }}
                    </span>
                  </el-descriptions-item>
                  <!-- Named Place(Booked) -->
                  <el-descriptions-item label="Named Place(Booked)">
                    {{ namedPlaceLabel(item.namedPlace) }}
                  </el-descriptions-item>

                  <el-descriptions-item label>
                    <div style="float: right" v-if="!shipmentInfo.isCustomerFlag">
                      <el-dropdown style="position: absolute;cursor: pointer; right: 10px; top:0px" size="mini">
                        <el-button type="primary">
                          More
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <el-link @click="copyShipping(item)">Copy</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <!-- Ethan: Agent Accepted 之前，可以修改 ，hk: oha拒绝后可以修改再提交 -->
                            <el-link @click="updateShipping(item)" :disabled="item.status !=0&&item.status!=-1 &&item.status!=2 ">Update</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link @click="toSiUpdate(item)" :disabled="siVGMDisabled(item)">SI/VGM</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-popconfirm :disabled="item.status == 3" :title="'Cancel ' + item.soRef + '?'" placement="left" @confirm="cancelShipping(item)">
                              <el-link slot="reference" :disabled="item.status == 3">Cancel</el-link>
                            </el-popconfirm>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link @click="amendShipping(item)" :disabled="item.status==-1||item.status==0 || item.status == 2">Amend</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link @click="amendPOQty(item)" :disabled="item.status==-1||item.status==0 || item.status==2 || (!item.allPoClrOpen && item.freightMethod?.toLowerCase() !== 'air') ">Amend Qty</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link @click="amendAddPO(item)" :disabled="item.status==-1||item.status==0 || item.status==2 || item.siStatus==1">Add PO</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link @click="amendRemovePO(item)" :disabled="item.status==-1||item.status==0 || item.status == 2 || item.siStatus==1" style="margin-bottom: 10px;">Remove PO</el-link>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>

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
                        <el-tabs :ref="'tab' + item.id" v-model="item.key" @tab-click="handleClick($event, item, index)">
                          <el-tab-pane label="PO" :name="'PO' + item.id" class="tab-bottom-css">
                            <span style="white-space: pre-line;">{{ item.customerRef?.replace(/,/g, '\n') }}</span>
                          </el-tab-pane>
                          <el-tab-pane label="Parties" :name="'Parties' + item.id" class="tab-bottom-css">
                            <el-descriptions title direction="vertical" :colon="false" :column="4" style="box-shadow: none;" label-class-name="parties-label" content-class-name="parties-content">
                              <el-descriptions-item label="Shipper">{{ item.shipperCompany }}</el-descriptions-item>
                              <el-descriptions-item label="Consignee">{{ item.consigneeCompany }}</el-descriptions-item>
                              <el-descriptions-item label="Notify Party">{{ item.notifyCompany }}</el-descriptions-item>
                            </el-descriptions>
                          </el-tab-pane>
                          <el-tab-pane :label="item.freightMethod=='air'? 'Air Leg': 'Transport Leg'" :name="'Transport Leg' + item.id" class="tab-bottom-css">
                            <div>
                              <div
                                v-for="(task, index) in item.tempPlaces1"
                                class="self-step4"
                                :class="[(task.transportMeanName != null) ? 'self-step-solid4' : 'self-step-dotted4']"
                                style="margin-right: 75px;margin-left: 0px;position: relative;float: left;width:230px;height: 100px; "
                              >
                                <p>
                                  <span v-show="task.transportMode == 'TRK'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                                    <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <path
                                        d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                                      />
                                    </svg>
                                  </span>
                                  <span v-show="task.transportMode == null" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                                    <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <path
                                        d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                                      />
                                    </svg>
                                  </span>
                                  <span v-show="task.transportMode == 'SEA' || task.transportMode == 'BRG'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                                    <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <path
                                        d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                                      />
                                    </svg>
                                  </span>
                                  <!-- <span v-show="task.transportMode == 'RAI'" part="icon-wrapper" class="mc-icon size-24"
                                    style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
                                    <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon"
                                      viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                      p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024">
                                      <path
                                        d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z"
                                        fill="#141414" p-id="1365"></path>
                                      <path
                                        d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z"
                                        fill="#141414" p-id="1366"></path>
                                    </svg>
                                  </span>-->
                                </p>
                                <p style="display: inline-block;
      width: 220px;
      margin: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; ">
                                  <span class="title">
                                    <p style="margin:0px" v-if="task.code">
                                      {{ originDeliveryMap[task.code] ?
                                      originDeliveryMap[task.code] : task.code }}
                                    </p>
                                    <p style="margin:0px" v-if="task.eta">{{ 'ETA:' + parseUTCTime(task.eta) }}</p>
                                    <p style="margin:0px" v-if="task.ata">{{ 'ATA:' + parseUTCTime(task.ata) }}</p>
                                    <p style="margin:0px" v-if="task.etd">{{ 'ETD:' + parseUTCTime(task.etd) }}</p>
                                    <p style="margin:0px" v-if="task.atd">{{ 'ATD:' + parseUTCTime(task.atd) }}</p>
                                    <p v-if="task.transportMeanName != null" style="margin: 0px;width:150px;position: absolute;left: 180px;top: 0px; ">
                                      <i class="el-icon-ship"></i>
                                      {{ task.transportMeanName + '/' + task.voyage }}
                                    </p>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="Documents" :name="'Files' + item.id">
                            <view-po-management-documents ref="viewPoManagementDocuments"></view-po-management-documents>
                          </el-tab-pane>
                          <el-tab-pane label="Operation Log" :name="'Logs' + item.id">
                            <el-timeline style="margin-top: 20px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
                              <el-timeline-item v-for="(logs, x) in item.statusLogDOS" :key="x" :timestamp="logs.userName + '   ' + formatUserLocalTime(logs.createTime, logs.timeZone, logs.timeZoneOffset)" placement="top">
                                <h4>{{ covStatus2(logs.status) }}</h4>
                                <div v-if="logs.status == 6">
                                  <el-link type="primary" :href="'/shipment/amendShipping?id=' + item.id + '&apId=' + logs.apId" target="_blank">{{ item.soRef }}</el-link>
                                </div>
                                <div style="max-height: 200px;" v-html="logs.remark"></div>
                              </el-timeline-item>
                            </el-timeline>
                          </el-tab-pane>
                          <el-tab-pane label="Request Log" :name="'Approval' + item.id">
                            <AmendRequestTab ref="amendRequestTab" />
                            <!-- <el-table :data="approvalList" style="width: 100%" height="200px" border v-loading="recordTableLoading">
                              <el-table-column prop="isCancel" label="Type" width="150px">
                              </el-table-column>
                              <el-table-column prop="status" label="Result" width="150px">
                              </el-table-column>
                              <el-table-column prop="remark" label="Remark" width="350px">
                                <template v-slot="scope">
                                  <Editor style="height: 45px; overflow-y: hidden;" v-model="scope.row.remark"
                                          :defaultConfig="viewEditorConfig" :mode="mode" @onCreated="onCreated" />
                                </template>
                              </el-table-column>
                              <el-table-column prop="creator" label="Creator" width="250px" show-overflow-tooltip>
                              </el-table-column>
                              <el-table-column prop="createTime" label="CreateTime" width="150px">
                              </el-table-column>
                            </el-table>-->
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

    <el-dialog title="Rejected" :visible.sync="showCloseRemark" width="70%" append-to-body>
      <el-input type="textarea" disabled :rows="7" placeholder="Remark..." v-model="closeRemark"></el-input>
    </el-dialog>

    <!-- 对话框(addAmend) -->
    <el-dialog title="Cancel" :visible.sync="amendShippingShow" width="70%" append-to-body>
      <div style="max-height:280px;overflow: auto;">
        <el-card class="box-card" v-for="logs in asLogs" :key="logs.id" style=" max-height: 100px; padding: 15px; overflow-y: auto; margin: 10px 10px 20px 10px;">
          <el-link type="primary" style="margin-top: -1px;" @click="goRequest(logs.id)">
            <div v-html="filteredHtml(logs.approvalRecordDOList[logs.approvalRecordDOList.length - 1].remark)"></div>
          </el-link>
        </el-card>
      </div>
      <el-divider class="divider-css"></el-divider>

      <el-form label-width="0px" ref="amendShippingForm" :model="amendShippingForm" :show-message="false">
        <el-form-item label required prop="remark">
          <div style="border: 1px solid #ccc;">
            <!--            <Toolbar-->
            <!--              style="border-bottom: 1px solid #ccc"-->
            <!--              :editor="editor"-->
            <!--              :defaultConfig="toolbarConfig"-->
            <!--              :mode="mode"-->
            <!--            />-->
            <Editor style="height: 400px; overflow-y: hidden;" v-model="amendShippingForm.remark" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
          </div>
        </el-form-item>

        <el-button size="mini" type="primary" style="float:right;" :loading="amendShippingLoading" @click="submitAmendShipping">
          {{
          $t("purchaseOrder.confirm") }}
        </el-button>
        <el-button size="mini" style="float:right; margin-right: 10px;" :loading="amendShippingLoading" @click="amendShippingShow = false">
          {{
          $t("purchaseOrder.cancel") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog style="margin-top: -30px!important;" destroy-on-close title="Shipping Instructions" v-if="siVisable" :visible.sync="siVisable" width="70%" append-to-body class="bg-g">
      <SI @after-submit="onAfterSubmit" :height="clientHeight" :shipmentId="shipmentId"></SI>
    </el-dialog>

    <el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
      <el-table :data="taskDetailData" style="width: 100%">
        <el-table-column prop="date" label="Task Name" width="150px">
          <template v-slot="scope">{{ scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="MOOV Ref" width="150px">
          <template v-slot="scope">
            <span
              style="text-decoration: underline;
                                      cursor: pointer;
                                color: #004F7C;
                                font-weight: bold;"
              @click="toOrder2(scope.row.orderNumber)"
            >
              {{ scope.row.orderNumber
              }}
            </span>
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

    <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl">
      <div class="cardx" v-for="h in taskList">
        <div class="status1Div">
          <span
            v-if="showTaskStatus(h) != ''"
            class="status2"
            :class="[showTaskStatus(h) == 'Possible' ? 'color2' : ''
            , showTaskStatus(h) == 'Finished' ? 'color1' : ''
            , showTaskStatus(h) == 'Urgent' ? 'color3' : ''
            , showTaskStatus(h) == 'Overdue' ? 'color4' : '']"
          >{{ showTaskStatus(h) }}</span>
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

    <ReomovePoDialog ref="removePoDialog" />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<script>
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { cancelPepcoShippingOrder, getApprovalInfoBySoId, isCancelOrAmend, shippingReport } from '@/api/shipping/order'
import { getOrderShipmentPage } from '@/api/pepco/shipping-order'
import { createApprovalInfo, updateApprovalInfo, getApprovalInfoNumByUser } from '@/api/shipping/approvalInfo'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import SI from './commponents/si.vue'
import { getTaskNames, updateTask, getTaskList, reminder, downloadFileById, getFileInfoForShippingOrder } from '@/api/order/task'
import { getUserProfile } from '@/api/system/user'
import moment from 'moment'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import viewPoManagementDocuments from '@/views/purchaseOrder/pepco/components/view-po-management-documents.vue'
import { parseTime as parseDateTime } from '@/utils/ruoyi'
import ReomovePoDialog from '@/views/pepcoShipping/amend-request/remove-po-dialog.vue'
import WEditor from '@/components/wang-editor'
import { shippingApprovalPage, createShippingApproval } from '@/api/pepco/shipping-approval'
import AmendRequestTab from '@/views/pepcoShipping/amend-request/amend-request-tab.vue'
import { getAirportList } from '@/api/air/airport'

export default {
  name: 'Order',
  components: {
    Editor,
    Toolbar,
    SI,
    IconPark,
    ReomovePoDialog,
    viewPoManagementDocuments,
    WEditor,
    AmendRequestTab
  },
  data() {
    return {
      approvalInfoNum: 0,
      editor: null,
      toolbarConfig: {
        excludeKeys: ['lineHeight', 'fontFamily', 'fontSize', 'headerSelect', 'codeBlock']
      },
      recordTableLoading: false,
      viewEditorConfig: {
        readOnly: true
      },
      editorConfig: {
        placeholder: 'Request...',
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
        shipperRef: null,
        originPort: null,
        polArray: [],
        ports: [],
        destinationPort: null,
        shipmentBookingNumber: null,
        blNumber: null,
        customerRef: null,
        shipperRef: null,
        blDraftStatus: null,
        amendStatus: null,
        freightMethod: null,
      },
      clientHeight: null,
      porList: [],
      airportList: [] , // 机场列表
      originDeliveryMap: {},
      amendShippingShow: false,
      amendShippingForm: {
        soId: null,
        remark: ''
      },
      amendShippingLoading: false,
      asLogs: [],
      showCloseRemark: false,
      closeRemark: '',
      portList: [],
      siVisable: false,
      shipmentId: null,
      user: {},

      expanded: {},
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
      title: '',
      departureConfirmFormVisible: false,
      arrivalConfirmFormVisible: false,
      taskList: [],
      drawer: false,
      shipmentInfo: {
        ports: [],
        atd: 0,
        ata: 0,
        subscribeds: 0,
        isCustomerFlag: false
      },
      checkedPort: {},
      typeNumber: 0, //document种类
      documentData: {}, //当前 Order Number 查询到的document
      approvalList: [] //cancel或amend历史记录
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.clientHeight = clientHeight - 310
    })
    getUserProfile().then(response => {
      this.user = response.data
    })
    if (this.$route.query.ref) {
      this.queryParams.soRef = this.$route.query.ref
    }
    if (this.$route.query.customerRef) {
      this.queryParams.customerRef = this.$route.query.customerRef
    }
    if (this.$route.query.shipperRef) {
      this.queryParams.shipperRef = this.$route.query.shipperRef
    }
    if (this.$route.query.status) {
      this.queryParams.status = this.$route.query.status
    }
    if (this.$route.query.blStatus != '') {
      this.queryParams.blDraftStatus = this.$route.query.blStatus
    }
    if (this.$route.query.amendStatus != '') {
      this.queryParams.amendStatus = this.$route.query.amendStatus
    }
    this.getOriginDeliveryList()
    this.getAirportListData()
    this.shippingReport()
    this.getList()
  },
  created() {
    var clientHeight = document.documentElement.clientHeight
    this.clientHeight = clientHeight - 310

    if (this.$route.query.shipperRef) {
      this.queryParams.shipperRef = this.$route.query.shipperRef
    }
  },
  computed: {
    polCascaderOptions() {
      return [
        {
          label: 'Sea',
          value: 'sea',
          children: this.porList.map(item => ({
            label: item.name + ' (' + item.code + ')',
            value: item.code
          }))
        },
        {
          label: 'Air',
          value: 'air',
          children: (this.airportList || []).map(item => ({
            label: item.airportName + ' (' + item.iata + ')',
            value: item.iata
          }))
        }
      ]
    }
  },
  methods: {
    checkPermi,
    shippingReport() {
      shippingReport(this.queryParams).then(res => {
        this.shipmentInfo = res.data
      })
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
      this.getList()
    },
    formattedTimeAfterSubtracting(val) {
      if (!val) {
        return ''
      }
      // 使用 Moment.js 将时间戳转换为 Moment 对象
      const momentDate = moment(val)
      // 格式化日期并返回
      return momentDate.format('YYYY-MM-DD HH:mm')
    },
    // showPortLabel(val) {
    //   for (var c = 0; c < this.porList.length; c++) {
    //     if (this.porList[c].code == val) {
    //       return this.porList[c].name
    //     }
    //   }
    // },

    // 增加机场列表
    showPortLabel(val, freightMethod) {
      const list = freightMethod === 'air'
        ? this.airportList
        : this.porList

      const target = list.find(item => item.code === val)
      return target ? target.name : val
    },
    showDetail(item) {
      if (item.status == 2 || item.status == 7) {
        this.showCloseRemark = true
        this.closeRemark = item.rejectedText
      }
    },
    toSiUpdate(item) {
      if (item.status == -1) {
        return
      }
      if (!(item.status == 1 || item.status == 4)) {
        return
      }
      if (item.shipmentBookingNumber == null || item.shipmentId == null || item.confirmed != true || item.siDate != null) {
        return
      }
      var id = item.id
      this.$router.push('/shipment/updatePpShippingOrderSi?id=' + id + '&source=shipping-order')
    },
    onAfterSubmit() {
      this.siVisable = false

      this.getList()
    },
    covStatus2(status) {
      console.log('状态', status)
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
    covStatus(status) {
      if (status == -1) {
        return 'Draft'
      } else if (status == 0) {
        return 'Requested'
      } else if (status == 1) {
        return 'MOOV-OHA Accepted'
      } else if (status == 2) {
        return 'MOOV-OHA Rejected'
      } else if (status == 3) {
        return 'Cancel'
      } else if (status == 4) {
        return 'SAApproved'
      } else if (status == 5) {
        return 'Awaiting Approval'
      } else if (status == 6) {
        return 'Pepco Pending'
      } else if (status == 7) {
        return 'Pepco Rejected'
      }
    },
    filteredHtml(val) {
      console.log('test1', val)
      var text = val.replace(/<\/?img[^>]*>/gi, '').replace(/<\/?video[^>]*>/gi, '')
      return text
    },
    customerRequest() {
      getApprovalInfoNumByUser().then(response => {
        this.approvalInfoNum = response.data
      })
    },
    goRequest(id) {
      const url = this.$router.resolve({
        path: '/support/userRequest'
      }).href
      window.open(url + (id != null ? '?id=' + id : ''), '_blank')
    },
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(response => {
        this.porList = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name)
        }
      })
    },
    getAirportListData() {
      getAirportList().then(response => {
        this.airportList = response.data
      })
    },
    createShipping() {
      this.$router.push('/shipment/ppCreateShippingOrder')
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index])
    },
    cancelShipping(item) {
      //此处判断是否已经cancel或已经amend
      isCancelOrAmend(item.id).then(res => {
        //有历史发起的数据记录
        if (res.data) {
          this.$notify({
            title: 'warning',
            message: 'MOOV ref:' + item.soRef + ' already under amend or cancel request process. Pls check in request log.',
            type: 'warning'
          })
          return
        }
        if (item.status == 1 || item.status >= 4) {
          //moov ACCEPTED
          this.amendShippingShow = true
          this.amendShippingForm.soId = item.id
          this.amendShippingForm.type = 'Cancel'
          this.amendShippingForm.isCancel = true
          return
        }
        cancelPepcoShippingOrder(item.id).then(res => {
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          })
          this.getList()
        })
      })
    },
    updateShipping(item) {
      console.log('updateShipping', item)
      this.$router.push('/shipment/updatePpShippingOrder?id=' + item.id)
    },
    copyShipping(item) {
      console.log('copyShipping', item)
      this.$router.push('/shipment/ppCreateShippingOrder?shippingOrderId=' + item.id + '&source=copy')
    },
    submitAmendShipping() {
      if ('<p><br></p>' == this.amendShippingForm.remark) {
        this.amendShippingForm.remark = null
      }
      this.$refs['amendShippingForm'].validate(valid => {
        if (valid) {
          this.amendShippingLoading = true
          createShippingApproval(this.amendShippingForm).then(res => {
            this.amendShippingLoading = false
            this.amendShippingShow = false
            this.customerRequest()
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.getList()
          })

          // createApprovalInfo(this.amendShippingForm).then(res => {
          //   this.amendShippingLoading = false
          //   this.amendShippingShow = false
          //   this.customerRequest()
          //   this.$notify({
          //     title: 'success',
          //     message: 'success',
          //     type: 'success'
          //   });
          //   this.getList()
          // })
        } else {
          return false
        }
      })
    },
    amendShipping(item) {
      if (item.status == -1) {
        return
      }
      //此处判断是否已经cancel或否已经amend
      isCancelOrAmend(item.id).then(res => {
        //有历史发起的数据记录
        if (res.data) {
          this.$notify({
            title: 'warning',
            message: 'MOOV ref:' + item.soRef + ' already under amend or cancel request process. Pls check in request log.',
            type: 'warning'
          })
          return
        }
        this.$router.push('/shipment/updatePpShippingOrderSi?id=' + item.id + '&source=amend')
      })
    },
    amendPOQty(item) {
      this.loading = true
      const params = {
        soId: item.id,
        status: 0
      }
      shippingApprovalPage(params)
        .then(res => {
          if (res.data && res.data.list.length > 0) {
            this.$message.warning('There is already a pending approval for this shipping order.')
            this.loading = false
            return
          }
          this.$router.push('/shipment/updatePpShippingOrder?id=' + item.id + '&source=amendPOQty')
        })
        .catch(() => {
          this.loading = false
        })
    },
    amendRemovePO(item) {
      this.$refs.removePoDialog.openDialog(item)
    },
    amendAddPO(item) {
      this.loading = true
      const params = {
        soId: item.id,
        status: 0
      }
      shippingApprovalPage(params)
        .then(res => {
          if (res.data && res.data.list.length > 0) {
            this.$message.warning('There is already a pending approval for this shipping order.')
            this.loading = false
            return
          }
          this.$router.push('/shipment/updatePpShippingOrder?id=' + item.id + '&source=addPO')
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      console.log('查询参数 列表', this.queryParams)
      getOrderShipmentPage(this.queryParams).then(response => {
        this.list = response.data.list
        console.log('shipping order 列表', this.list)

        for (var i = 0; i < response.data.list.length; i++) {
          response.data.list[i].key = 'PO' + response.data.list[i].id
          var shipment = response.data.list[i]
          var tempPlaces1 = []
          for (var index = 0; index < shipment.routerDOList.length; index++) {
            var item = shipment.routerDOList[index]
            var item1 = {}
            item1.code = item.pol
            item1.transportMeanName = item.transportMeanName
            item1.voyage = item.voyage
            item1.transportMode = item.transportMode
            item1.etd = item.etd
            tempPlaces1.push(item1)
            if (index == 0) {
              item1.etd = shipment.etd
              item1.atd = shipment.atd
            }

            var item2 = {}
            item2.code = item.pod
            item2.transportMode = item.transportMode
            item2.eta = item.eta
            tempPlaces1.push(item2)
            if (index == shipment.routerDOList.length - 1) {
              item2.eta = shipment.eta
              item2.ata = shipment.ata
            }
          }
          shipment.tempPlaces1 = tempPlaces1
          if (shipment.blDraftCutoff) {
            if (new Date(shipment.blDraftCutoff).getTime() < Date.now()) {
              shipment.siCutOffDateTimeout = '2'
            } else if (new Date(shipment.blDraftCutoff).getTime() > Date.now() && new Date(shipment.blDraftCutoff - 84 * 60 * 60 * 1000).getTime() < Date.now()) {
              shipment.siCutOffDateTimeout = '1'
            }
          }

          // shipment.siCutOffDateTimeout = shipment.blDraftCutoff?new Date(shipment.blDraftCutoff - 12 * 60 * 60 * 1000).getTime()<Date.now():false
        }
        this.total = response.data.total
        this.loading = false
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
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

    handlePolChange(data) {
      if (data && data.length) {
        this.queryParams.originPort = data[1] || null
      } else {
        this.queryParams.originPort = null
      }
      this.queryParams.pageNo = 1
      this.getList()
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
          title: 'success',
          message: 'success',
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
        this.drawer = false
      } else if (task.taskName == 'Carrier booking') {
        this.drawer = false
      } else if (task.taskName == 'Booking confirmation') {
        this.drawer = false
      } else if (task.taskName == 'BL Draft by shipper') {
        // si
        this.drawer = false
        let matched = this.list.filter(item => item.id == task.orderId)
        const first = matched[0]
        this.toSiUpdate(first)
      } else if (task.taskName == 'BL Draft submit to carrier') {
        this.drawer = false
      }
    },

    viewTask(task) {
      this.view = true
      this.task = task
      if (task.jsonData != null && task.jsonData != '') {
        this.form = JSON.parse(task.jsonData)
      }

      if (task.taskName == 'Accept booking') {
        this.drawer = false
      } else if (task.taskName == 'Carrier booking') {
        this.drawer = false
      } else if (task.taskName == 'Booking confirmation') {
        this.drawer = false
      } else if (task.taskName == 'BL Draft by shipper') {
        // si
        this.drawer = false
      } else if (task.taskName == 'BL Draft submit to carrier') {
        this.drawer = false
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
        this.getPage()
      })
    },
    getSICutoffColor(item) {
      if (item.siCutOffDateTimeout == '1') {
        return 'color3'
      } else if (item.siCutOffDateTimeout == '2') {
        return 'color4'
      }
    },
    covAmendType(apList) {
      var data = apList[apList.length - 1].approvalRecordDOList
      var apStatus = data[0].status
      if (apStatus == 3) {
        return 'danger'
      } else if (apStatus == 2) {
        return 'success'
      }
      return 'warning'
    },
    covAmendStatus(apList) {
      var data = apList[apList.length - 1].approvalRecordDOList
      var apStatus = data[0].status
      if (apStatus == 3) {
        return 'Rejected'
      } else if (apStatus == 2) {
        return 'Accepted'
      }
      return 'Requested'
    },
    downloadDocument(file) {
      let a = document.createElement('a')
      downloadFileById(file.id).then(res => {
        let url = window.URL.createObjectURL(new Blob([res]))
        a.download = file.fileName
        a.href = url
        a.click()
      })
    },
    handleClick(el, item, index) {
      if (item.key.startsWith('Files')) {
        this.$refs.viewPoManagementDocuments[index].getFileByShippingOrderId(item.id)
      }
      if (item.key.startsWith('Approval')) {
        this.$refs.amendRequestTab[index].activeTab(item.id)
      }
    },
    clearFilters() {
      this.queryParams.soRef = null
      this.queryParams.shipperRef = null
      this.queryParams.customerRef = null
      this.queryParams.originPort = null
      this.queryParams.polArray = []
      this.queryParams.ports=[]
      this.queryParams.destinationPort = null
      this.queryParams.shipmentBookingNumber = null
      this.queryParams.blNumber = null
      this.queryParams.blDraftStatus = null
      this.queryParams.amendStatus = null
      this.queryParams.freightMethod = null

      this.handleQuery()
    },
    orderByCreateTime(property) {
      return function (a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value2 - value1
      }
    },
    siVGMDisabled(item) {
      return !(item.status == 1 || item.status == 4) || item.shipmentBookingNumber == null || item.confirmed != true || !item.allPoSiCanEdit
    },
    // Named Place label edwin
    namedPlaceLabel(namedPlace) {
      const dict = this.getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE).find(
        item => item.value === namedPlace
      );
      return dict ? dict.label : '';
    },
  }
}
</script>
<style scoped>
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

.tab-bottom-css {
  margin-bottom: 10px;
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

.divider-css.el-divider.el-divider--horizontal {
  width: 100% !important;
}
.self-step4:not(:last-child):before {
  width: 240px;
  height: 2px;
  position: absolute;
  left: 170px;
  content: '';
  top: 15px;
  text-align: left;
}

.error-text {
  color: #f56c6c;  /* 红色 */
}
</style>
