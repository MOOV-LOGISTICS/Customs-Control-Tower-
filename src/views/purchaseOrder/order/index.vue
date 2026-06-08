<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >

    <div style="margin-bottom: 20px;">
        <el-card  style="background: transparent;box-shadow: none!important;">

          <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <span  v-hasPermi="['order:header:import']" @click="handleImport">
            <icon-park style="border-right: 1px solid #ddd;" type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          </span>
          <span  v-hasPermi="['order:header:export']" @click="handleExport">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
          <span v-hasPermi="['order:header:export1']" @click="handleExport1">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==false}" @click="bookedChange(false)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ orderInfo.notBooked }}</p>
            <p>Not Booked</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==true}" @click="bookedChange(true)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ orderInfo.booked }}</p>
            <p>Booked</p>
          </div>

        </el-card>

        <el-card class="pd-20" id="portsDiv"  style="white-space: nowrap;overflow-x: auto;height:59.5px;float: left; width: auto;margin-right: 0px;
        width:calc(100% - 660px)">
          <icon-park style="float:left;border-right: 1px solid #ddd;" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':checkedPort[item.destinationPort]}"
               @click="clickPort1(item.destinationPort)" v-for="item in orderInfo.ports"
               style="position: relative;
    top: -3px;display:inline-block;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;    cursor: pointer;
          border-radius: 10px;
    margin-left: 10px;">
            <p style="font-size: 20px;">{{ item.count }}</p>
            <p>{{ item.destinationPort?item.destinationPort:'Unkown' }}</p>
          </div>
        </el-card>


        </el-card>

      </div>


    <el-card class="pd-20">

      <div style="float: right;line-height: 48px;">
            <div style="float: right;position: relative;z-index: 999;">
              <el-button v-if="JSON.stringify(preBookMap)!='{}'&&!drawer2"
                v-hasPermi="['booking:create']"
                @click="clearAll"
                size="mini"
                type="primary"
                >{{ $t("purchaseOrder.clearAll") }}</el-button
              >
              <el-button v-if="!drawer2"
                v-hasPermi="['booking:create']"
                @click="reviewBook"
                size="mini"
                type="primary"
                >{{ $t("purchaseOrder.reviewAndBook") }}</el-button
              >
              <el-button v-if="!hiddenTask" type="primary"  @click="openOverview">
                {{!drawer2?'Overview':'Order List'}}
              </el-button>
              <!-- v-hasPermi="['booking:preAssgine:create']" -->
            </div>
            <div style="float: right;" v-if="!drawer2">
              <el-tag
                style="margin-right: 10px;margin-top: 5px;"
                :disable-transitions="false"
                closable
                @close="handleClose(key)"
                v-show="value.length > 0"
                v-for="(value, key) in preBookMap"
                :key="key"
                >{{ orderNumberMap[key] }} ({{ value.length }})</el-tag
              >
            </div>
        </div>
  <transition name="el-zoom-in-center">
    <div v-show="!drawer2" class="transition-box">
      <el-form :model="queryParams">
        <div v-if="!drawer2" style="float: left;padding-top: 8px;">


                <!-- <svg v-hasPermi="['order:header:export1']" @click="handleExport1" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.0654 30.119L23.9999 37.0764L31.1318 30" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 20V33.5382" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>  -->
              </div>
        <div v-if="!drawer2" style='float:left;padding: 10px 0px;'>
          <el-input  placeholder="Order Number" v-model="queryParams.orderNumber" @keyup.enter.native = " queryParams.pageNo = 1 ,getList()">
            <!-- <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button> -->
            </el-input>
        </div>
        <div v-if="!drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.booked" placeholder="Booked/Not Booked">
            <el-option label="All" :value="null"></el-option>
            <el-option label="Not booked" :value="false"></el-option>
            <el-option label="Booked" :value="true"></el-option>
          </el-select>
        </div>
        <div v-if="!drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.originPort" clearable placeholder="POL" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div>
        <div v-if="!drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.destinationPort" clearable placeholder="POD" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div>
        <div v-if="!drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.oha" clearable placeholder="OHA" filterable>
            <el-option
                v-for="item in ohaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
        </div>
        <div v-if="!drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.shipper" clearable placeholder="Shipper" filterable>
            <el-option
                v-for="item in shipperList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
        </div>
      <div  style='float:left;margin-left:15px;padding-top: 10px'>
        <el-button @click="queryParams.pageNo = 1 ,getList()"><i class="el-icon-search"></i> Search</el-button>
      </div>
        <div  style="clear: both;"></div>
      </el-form>
      <div   style="overflow: auto;width:calc(100%);float: left;" >
        <el-table :row-class-name="tableRowClassName" border @sort-change="handleSortChange"
        v-loading="loading" :height="tableHeight-70"
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div style="padding:15px 58px 15px 58px;">
                <el-tabs type="border-card" :ref="'tab'+props.row.id" v-model="props.row.key" @tab-click="handleClick($event,order)">
                    <el-tab-pane label="Order Items" :name="'first'+props.row.id">
                <el-button type="primary" style="margin-bottom:10px"
                    size="mini"
                    @click="addAllToBooked(props.row.id, props.row.items)"
                    >Add All</el-button
                  >
                  <el-table
                  border
                    style="width:90%"
                    :data="props.row.items">
                    <el-table-column
                      prop="date"
                      label="Product Code"
                      min-width="150">
                      <template v-slot="scope">
                        {{ productMap[scope.row.productId]?productMap[scope.row.productId].code:'' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="Product Name"
                      min-width="140">
                      <template v-slot="scope">
                        {{ productMap[scope.row.productId]?productMap[scope.row.productId].name:'' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="category"
                      label="Product Category"
                      min-width="90">
                      <template v-slot="scope">
                        {{ productMap[scope.row.productId]?productMap[scope.row.productId].category:'' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="90"
                      prop="totalVolume"
                      :label="$t('booking.totalVolume')">
                      <template v-slot="scope">
                        {{calculateVolume(scope.row)}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    min-width="90"
                      prop="totalWeight"
                      :label="$t('booking.totalWeight')" >
                      <template v-slot="scope">
                        {{calculateWeight(scope.row)}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="90"
                      prop="requested"
                      :label="props.row.items.length > 0 && props.row.items[0].requestUnit  ? 'Requested (' + props.row.items[0].requestUnit +')' : 'Requested'"
                    >
                    </el-table-column>
                    <el-table-column
                      min-width="90"
                      prop="booked"
                      :label="props.row.items.length > 0 && props.row.items[0].requestUnit  ? 'Already Booked (' + props.row.items[0].requestUnit +')' : 'Already Booked'" >
                    </el-table-column>
                    <el-table-column
                      min-width="90"
                      prop="shipped"
                      :label="props.row.items.length > 0 && props.row.items[0].requestUnit  ? 'Shipped (' + props.row.items[0].requestUnit +')' : 'Shipped'" >
                      <template v-slot="scope">
                        {{getLoadingQty(scope.row,props.row.shipmentResList)}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="90"
                      prop="booked"
                      v-if="hiddenTask||props.row.orderTaskDOS.filter((item)=>item.taskName=='Booking Order'&&item.status==1).length>0"
                      label="Book Now">
                      <template slot="header" slot-scope="scope">
                        <span style="color:#004F7C">Book Now</span>
                      </template>
                      <template v-slot="scope">
                        <el-input
                        oninput="value=value.replace(/[^0-9]/g,'')"
                          class="bookNow"
                            style="width: 80px;"
                            size="mini"
                            v-model="scope.row.bookedQty"
                          ></el-input>
                          <el-checkbox :class="scope.row.checkCss ? 'not-check-css' : ''"  border v-model="scope.row.selected" style="width:35px;height:35px padding-top:3px;padding-right:0px"></el-checkbox>
                      </template>
                    </el-table-column>
                  </el-table>
                <!-- <el-card style="margin: 10px;padding: 15px;"
                  v-for="row in props.row.items"
                  :key="'item' + row.id"
                  size="mini"
                >

                  <el-row :gutter="20" v-for="country in row.orderItemCountries">
                    <el-col style="width:200px">
                      <span class="title">Country:</span>{{ country.country }}
                    </el-col>
                    <el-col style="width:200px">
                      <span class="title">Requested:</span>{{ country.requested }}
                    </el-col>
                  </el-row>

                </el-card> -->
                <br/>
                </el-tab-pane>
                <el-tab-pane label="Location" :name="'first3'+props.row.id">
                  <el-descriptions direction="vertical" class="margin-top" title="" style="box-shadow: none;width:800px" :column="5" size="mini" border>
                    <el-descriptions-item label="Origin Port">{{ props.row.originPort }}</el-descriptions-item>
                    <el-descriptions-item label="Origin Location">{{ props.row.originLocation }}</el-descriptions-item>
                    <el-descriptions-item label="Transport Mode">{{ props.row.mode }}</el-descriptions-item>
                    <el-descriptions-item label="Destination Port">{{ props.row.destinationPort }}</el-descriptions-item>
                    <el-descriptions-item label="Destination Location">{{ props.row.destinationLocation }}</el-descriptions-item>
                  </el-descriptions>
                  <br/>
                </el-tab-pane>
                    <el-tab-pane label="Parties" :name="'first2'+props.row.id">
                      <el-table
                        :data="[{}]"
                        border
                        style="width:600px">
                        <el-table-column
                          prop="oha"
                          label="OHA"
                          >
                          <template v-slot="scope">
                            {{partyMap[props.row.oha] }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="buyer"
                          label="Buyer">
                          <template v-slot="scope">
                            {{partyMap[props.row.buyer] }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="seller"
                          label="Seller">
                          <template v-slot="scope">
                            {{partyMap[props.row.seller] }}
                          </template>
                        </el-table-column>
                      </el-table>
                      <br/>
                    </el-tab-pane>
                    <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Shipment" :name="'second'+props.row.id">
                      <el-empty v-if="props.row.shipmentResList.length==0"></el-empty>
                      <el-descriptions title="" direction="vertical" :column="8" border style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                      v-for="row in props.row.shipmentResList.length>0?[props.row.shipmentResList[props.row.shipmentResList.length-1]]:[]"
                        :key="'item' + row.id">
                        <el-descriptions-item label="Shipment Ref">
                          <el-link type="primary" :href="'/shipment/detail?id='+row.id" target="_blank">
                              {{ row.bookingNumber }}
                            </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="Booking Number">
                          <el-link type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=bookingNumber&searchKey='+row.shipmentBookingNumber">{{ row.shipmentBookingNumber }}</el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="BL Number">
                          {{ row.blNumber}}
                        </el-descriptions-item>

                        <el-descriptions-item label="Shipped together with">
                          <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;" v-for="lot in row.orderNumbers.filter((item)=>props.row.orderNumber!=item)">
                            <span > {{ lot }}</span>
                          </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="Carrier">
                          {{ row.carrier}}
                        </el-descriptions-item>
                        <el-descriptions-item label="Vessel/Voyage">
                          <el-link type="primary" @click="toTack(row.routerDOList[0].imo)">
                            {{ row.routerDOList[0].transportMeanName }}/{{ row.routerDOList[0].voyage }}
                          </el-link>
                        </el-descriptions-item>

                        <el-descriptions-item label="Contract Number">
                          {{row.contractNumber}}
                        </el-descriptions-item>
                        <el-descriptions-item label="Shipped Tue">
                          {{ getshippedTue(row.containerDOList.filter((item) => item.type == 0)) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Week">
                          <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                                    @click="toAllocation(order,2)" >
                            {{ row.etdAllocation }}
                            </el-link>
                            <p v-else> {{ row.etdAllocation }} </p>
                        </el-descriptions-item>

                        <el-descriptions-item label="Booked ETD">
                          {{ parseTime(row.bookedEtd) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Booked ETA">
                          {{ parseTime(row.bookedEta) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="ATD">
                          {{ parseTime(row.atd) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="ATA">
                          {{ parseTime(row.ata) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Containers">
                          <span  style="float: left;" v-for="container in row.containerDOList.filter((item) => item.type == 0)">
                            <span style="margin-right: 5px;">{{ container.containerType }} *{{ container.numbers }}</span>
                          </span>
                        </el-descriptions-item>

                        <el-descriptions-item label="Shipped Containers">
                          <span   v-for="container in row.containerDOList.filter((item) => item.type == 1)">
                            <el-link style="margin-right: 10px;" type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=containerNo&searchKey='+container.containerNo">
                              <span style="margin-right: 5px;"> {{ container.containerNo }}: {{ container.containerType }} </span>
                            </el-link>
                          </span>
                        </el-descriptions-item>

                        <el-descriptions-item label="Tranport Status">
                          <el-tag type="primary" style="float: left;">
                            {{showStatus(row)}}
                            </el-tag>
                        </el-descriptions-item>

                      </el-descriptions>

                    </el-tab-pane>
                    <el-tab-pane v-if="!hiddenTask" label="Milestones" :name="'third'+props.row.id" >
                      <div style="padding-bottom: 20px;padding:10px 0px 20px 0px;overflow-x: hidden;">
                        <div v-for=" task in props.row.orderTaskDOS" :Key="'task'+task.id" class="self-step1"

                            style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 100px;">
                                <p>
                                  <span class="self-step"  :class="[task.status==1 ? 'self-step-process' : ''
                      , task.status==2 ? 'self-step-finished' : ''
                      , task.status==0 ? 'self-step-pedding' : '']">{{ task.seq }}</span>
                                  <p style="display: inline-block;
                                    width: 150px;
                                    padding-top: 8px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;">
                                    <span class="title">{{ task.taskName }} </span>
                                  </p>
                                  <p>
                                    {{ task.status==2?parseTime(task.updateTime):'' }}
                                  </p>
                                </p>
                        </div>
                        <div style="clear:both"></div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Documents" :name="'fourth'+props.row.id">
                      <div v-for="shipment in  props.row.shipmentResList.length>0?[props.row.shipmentResList[props.row.shipmentResList.length-1]]:[]">
                        <p style="margin-bottom:15px;" class='title'>{{
                            shipment.bookingNumber
                          }}</p>
                          <p style="padding-left: 30px;" v-if="shipment.files==null||shipment.files.length==0">No Files</p>
                        <div v-for="file in shipment.files">
                          <el-badge :value="fileType[file.dataType]" class="item" style="margin-right:50px;float:left;">
                            <div style="width:150px;text-align:center;" >
                              <svg style="display: inline-block;" width="45" height="45" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.2 30H37.8L41 34.1176L33 44L25 34.1176L28.2 30Z" fill="none" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4V14H40" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                              <p><el-link :href="file.url">{{ file.name }}</el-link>
                              </p>
                            </div>
                          </el-badge>

                        </div>
                        <div style="clear: both;"></div>
                      </div>
                      <el-empty description="No Files" v-if="props.row.shipmentResList==null||props.row.shipmentResList.length==0">

                      </el-empty>
                    <br/>

                    </el-tab-pane>
                    <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Shipment History" :name="'second2'+props.row.id">

                      <el-empty v-if="props.row.shipmentResList.slice(0,props.row.shipmentResList.length-1).length==0"></el-empty>
                      <br v-if="props.row.shipmentResList.slice(0,props.row.shipmentResList.length-1).length==0"/>
                      <el-descriptions title="" direction="vertical" :column="8" border style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                      v-for="row in props.row.shipmentResList.slice(0,props.row.shipmentResList.length-1)"
                        :key="'item' + row.id">
                        <el-descriptions-item label="Shipment Ref">
                          <el-link type="primary" :href="'/shipment/detail?id='+row.id" target="_blank">
                              {{ row.bookingNumber }}
                            </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="Booking Number">
                          <el-link type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=bookingNumber&searchKey='+row.shipmentBookingNumber">{{ row.shipmentBookingNumber }}</el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="BL Number">
                          {{ row.blNumber}}
                        </el-descriptions-item>

                        <el-descriptions-item label="Shipped together with">
                          <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;" v-for="lot in row.orderNumbers.filter((item)=>props.row.orderNumber!=item)">
                            <span > {{ lot }}</span>
                          </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="Carrier">
                          {{ row.carrier}}
                        </el-descriptions-item>
                        <el-descriptions-item label="Vessel/Voyage">
                          <el-link type="primary" @click="toTack(row.routerDOList[0].imo)">
                            {{ row.routerDOList[0].transportMeanName }}/{{ row.routerDOList[0].voyage }}
                          </el-link>
                        </el-descriptions-item>

                        <el-descriptions-item label="Contract Number">
                          {{row.contractNumber}}
                        </el-descriptions-item>
                        <el-descriptions-item label="Shipped Tue">
                          {{ getshippedTue(row.containerDOList.filter((item) => item.type == 0)) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Week">
                          <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                                    @click="toAllocation(order,2)" >
                            {{ row.etdAllocation }}
                            </el-link>
                            <p v-else> {{ row.etdAllocation }} </p>
                        </el-descriptions-item>

                        <el-descriptions-item label="Booked ETD">
                          {{ parseTime(row.bookedEtd) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Booked ETA">
                          {{ parseTime(row.bookedEta) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="ATD">
                          {{ parseTime(row.atd) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="ATA">
                          {{ parseTime(row.ata) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Containers">
                          <span  style="float: left;" v-for="container in row.containerDOList.filter((item) => item.type == 0)">
                            <span style="margin-right: 5px;">{{ container.containerType }} *{{ container.numbers }}</span>
                          </span>
                        </el-descriptions-item>

                        <el-descriptions-item label="Shipped Containers">
                          <span   v-for="container in row.containerDOList.filter((item) => item.type == 1)">
                            <el-link style="margin-right: 10px;" type="primary" target="_blank" :href="'/shipment/ShipmentTracking?type=containerNo&searchKey='+container.containerNo">
                              <span style="margin-right: 5px;"> {{ container.containerNo }}: {{ container.containerType }} </span>
                            </el-link>
                          </span>
                        </el-descriptions-item>

                        <el-descriptions-item label="Tranport Status">
                          <el-tag type="primary" style="float: left;">
                            {{showStatus(row)}}
                            </el-tag>
                        </el-descriptions-item>

                      </el-descriptions>
                    </el-tab-pane>
                    <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Transport Plan Pre-assign history" :name="'second3'+props.row.id">
                      <el-empty v-if="props.row.bookingPreAssignResList.length==0"></el-empty>
                      <el-descriptions style="margin: 10px;padding: 15px!important;" v-for="item in props.row.bookingPreAssignResList" :column="5">
                        <el-descriptions-item label="POR">{{ item.por }}</el-descriptions-item>
                        <el-descriptions-item label="FND">{{ item.fnd }}</el-descriptions-item>
                        <el-descriptions-item label="POL">{{ item.pol }}</el-descriptions-item>
                        <el-descriptions-item label="POD">{{ item.pod }}</el-descriptions-item>
                        <el-descriptions-item label="vessel">{{ item.vessel }}</el-descriptions-item>
                        <el-descriptions-item label="voyage">{{ item.voyage }}</el-descriptions-item>
                        <el-descriptions-item label="etd">{{ parseTime(item.etd) }}</el-descriptions-item>
                        <el-descriptions-item label="eta">{{ parseTime(item.eta) }}</el-descriptions-item>
                        </el-descriptions>
                        <br/>
                    </el-tab-pane>
                    <el-tab-pane label="Change Log" :name="'second4'+props.row.id">
                      <el-empty v-if="props.row.logStatusResList.length==0"></el-empty>
                      <el-timeline >
                      <el-timeline-item v-for="(o, index) in props.row.logStatusResList" :key="index" :timestamp=parseTimeToZ1(o.createTime)>
                        {{ o.logInfo }}
                      </el-timeline-item>
                      </el-timeline>
                      <br/>
                    </el-tab-pane>
                </el-tabs>
              </div>
            </template>
          </el-table-column>
          <el-table-column
          sortable="custom"
            label="Order Number"
            min-width="130"
            prop="orderNumber">
            <template v-slot="scope">
              <span style="color:#000;font-weight: 900;">{{ scope.row.orderNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
          v-if="!hiddenTask"
            label="Status"
            width="160"
            prop="status">
            <template v-slot="scope">
              <span @click="showTask(scope.row.orderTaskDOS,scope.$index)" style="text-decoration: underline;cursor: pointer;">
              {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
          v-if="!hiddenTask"
            label="Process"
            width="150"
            prop="bookedLines">
            <template v-slot="scope">
              <el-progress :stroke-width="13" :percentage="
                parseInt(scope.row.orderTaskDOS.filter(item=>item.status==2).length/scope.row.orderTaskDOS.length*100)
                ">
              </el-progress>
              <span style="position: absolute;
                  top: 3px;
                  left: 35px;
                  color: white;">
              {{ scope.row.orderTaskDOS.filter(item=>item.status==2).length}}/{{
                    scope.row.orderTaskDOS.length}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Booked Items"
            width="150"
            prop="bookedLines">
            <template v-slot="scope">
              <el-progress :stroke-width="13" :percentage="
                parseInt(scope.row.bookedLines/scope.row.orderedLines*100)
                ">
              </el-progress>
              <span style="position: absolute;
                  top: 3px;
                  left: 40px;
                  color: white;">
              {{ scope.row.bookedLines ? scope.row.bookedLines : 0 }}/{{
                    scope.row.orderedLines ? scope.row.orderedLines : 0 }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="Inspection Date"
            width="120"
            prop="inspectionDate">
            <template v-slot="scope">
              {{ scope.row.inspectionDate==null?'':scope.row.inspectionDate.substring(0, scope.row.inspectionDate.indexOf("T")) }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="QC Approve Result"
            width="140"
            prop="qcApproveResult">
            <template v-slot="scope">
              <div style="width:140px;
              white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;" :title="scope.row.qcApproveResult">{{ scope.row.qcApproveResult}}</div>
            </template>
          </el-table-column>
          <el-table-column
          sortable="custom"
            label="Cargo Ready Date"
            width="130"
            prop="cargoReadyDate">
            <template v-slot="scope">
              {{ parseTime(scope.row.cargoReadyDate) }}
            </template>
          </el-table-column>
          <el-table-column
          sortable="custom"
            label="Must Arrive By"
            width="110"
            prop="mustArriveBy">
            <template v-slot="scope">
              {{ parseTime(scope.row.mustArriveBy) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Contractual Week"
            width="110"

            prop="etd">
            <template v-slot="scope">
              {{ scope.row.fobWeekOwim }}
            </template>
          </el-table-column>
          <el-table-column
            label="Incoterms"
            width="110"
            prop="etd">
            <template v-slot="scope">
              {{ scope.row.incoterms }}
            </template>
          </el-table-column>
          <el-table-column
            label="ETD"
            width="90"
            prop="etd">
            <template v-slot="scope">
              {{ scope.row.shipmentResList.length>0?parseTime(scope.row.shipmentResList[scope.row.shipmentResList.length-1].etd):'Not Booked' }}
            </template>
          </el-table-column>
          <el-table-column
            label="ETA"
            width="90"
            prop="etd">
            <template v-slot="scope">
              {{ scope.row.shipmentResList.length>0?parseTime(scope.row.shipmentResList[scope.row.shipmentResList.length-1].eta):'Not Booked' }}
            </template>
          </el-table-column>
          <el-table-column
            label="ATD"
            width="115"
            prop="etd">
            <template v-slot="scope">
              {{ scope.row.shipmentResList.length>0?
              scope.row.shipmentResList[scope.row.shipmentResList.length-1].atd==null?'Pending Shipped':
                  parseTime(
                    scope.row.shipmentResList[scope.row.shipmentResList.length-1].atd
                  )
                  :'Pending Shipped' }}
            </template>
          </el-table-column>
          <el-table-column
            label="ATA"
            width="110"
            prop="etd">
            <template v-slot="scope">
              {{ scope.row.shipmentResList.length>0?
              scope.row.shipmentResList[scope.row.shipmentResList.length-1].ata==null?'Pending Arrived':
                  parseTime(
                    scope.row.shipmentResList[scope.row.shipmentResList.length-1].ata
                  )
                  :'Pending Arrived' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Flag"
            width="53"
            prop="subscribe"
            >
            <template v-slot="scope">
              <svg v-show="!scope.row.subscribe" @click="subscribe(scope.row)" style="width: 20px;height:20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333" fill="#FFF" d="M12 6v16l28-8-28-8Z"/></svg>
              <svg v-show="scope.row.subscribe" @click="subscribe(scope.row)" style="width: 20px;height:20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" d="M12 44h4M12 6V4v2Zm0 16v22-22Zm0 22H8h4ZM8 44h8"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#fe5000" fill="#fe5000" d="M12 6v16l28-8-28-8Z"/></svg>
            </template>
          </el-table-column>

        </el-table>
        <!-- <el-descriptions  :column="4" style="background: #fff;padding: 15px!important;" :colon="false"  v-for="(order,index) in tableData" :key="order.id">



                  <el-descriptions-item label="Origin Port">
                      {{ order.originPort }}
                  </el-descriptions-item>

                  <el-descriptions-item label="Destination Port">
                      {{ order.destinationPort }}
                  </el-descriptions-item>

                  <el-descriptions-item label="Origin Location">
                      {{ order.originLocation }}
                  </el-descriptions-item>

                  <el-descriptions-item label="Destination Location">
                      {{ order.destinationLocation }}
                  </el-descriptions-item>

    <el-descriptions-item>
                  <el-collapse-transition>
              <div v-show="expanded[order.id]" style="width: 100%;">

              </div>
            </el-collapse-transition>
          </el-descriptions-item>

        </el-descriptions> -->
      </div>
      <div style="clear:both"></div>

        <pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[20, 30, 50]"
          @pagination="changePage"
        />
    </div>
  </transition>

  <transition name="el-zoom-in-center">
    <el-form :model="queryParams">
      <div v-if="drawer2" style="float: left;padding-top: 8px;">
      </div>
      <div v-if="drawer2" style='float:left;padding: 10px 0px;'>
      <el-input  placeholder="Order Number" v-model="queryParams.orderNumber" @keyup.enter.native = " queryParams.pageNo = 1 ,getList()">
      <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
      </el-input>
      </div>
      <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
      <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.booked" placeholder="Booked/Not Booked">
      <el-option label="All" :value="null"></el-option>
      <el-option label="Not booked" :value="false"></el-option>
      <el-option label="Booked" :value="true"></el-option>
      </el-select>
      </div>
      <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.originPort" clearable placeholder="POL" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div>
        <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.destinationPort" clearable placeholder="POD" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div>
        <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.oha" clearable placeholder="OHA" filterable>
            <el-option
                v-for="item in ohaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
        </div>
        <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.shipper" clearable placeholder="Shipper" filterable>
            <el-option
                v-for="item in shipperList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
        </div>
      <!-- <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.originPort" clearable placeholder="POL" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div>
        <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.destinationPort" clearable placeholder="POD" filterable>
            <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'"
                :value="item.code"
              ></el-option>
          </el-select>
        </div> -->
<!--        <div  style='float:left;margin-left:15px;padding-top: 10px'>-->
<!--        <el-button @click="queryParams.pageNo = 1 ,getList()"><i class="el-icon-search"></i> Search</el-button>-->
<!--      </div>-->
      <div  style="clear: both;"></div>
    <div v-loading="taskLoading" v-show="drawer2" class="transition-box" style="padding-top: 50px;":style="{'height':(tableHeight)+'px'}">
      <el-row :gutter="20" style="padding-top:10px">
        <el-col :span="12" >
          <el-card style="margin-bottom:20px;box-shadow:none !important;" class="box-card" v-if="task1.length>0">
          <div slot="header" class="clearfix">
            <span>Purchase Order</span>
          </div>
          <div style="padding: 20px;">
            <el-table border
        :data="task1"
        style="width: 100%">
        <el-table-column
          prop="taskName"
          label="Task Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="possible"
          align="center"
          label="Possible">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ taskInfo[scope.row.taskName]?.['Possible']|| 0  }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="urgent"
          align="center"
          label="Urgent">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ taskInfo[scope.row.taskName]?.['Urgent']|| 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="overdue"
          align="center"
          label="Overdue">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ taskInfo[scope.row.taskName]?.['Overdue']|| 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="finished"
          align="center"
          label="Finished">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ taskInfo[scope.row.taskName]?.['Finished']|| 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
          </div>
        </el-card>
        <el-card class="box-card" style="box-shadow:none !important;" v-if="task2.length>0">
          <div slot="header" class="clearfix">
            <span>Shipper Booking</span>
          </div>
          <div style="padding: 20px;">
          <el-table border
        :data="task2"
        style="width: 100%">
        <el-table-column
          prop="taskName"
          label="Task Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="possible"
          align="center"
          label="Possible">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ taskInfo[scope.row.taskName]?.['Possible']|| 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="urgent"
          align="center"
          label="Urgent">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ taskInfo[scope.row.taskName]?.['Urgent']|| 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="overdue"
          align="center"
          label="Overdue">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ taskInfo[scope.row.taskName]?.['Overdue'] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="finished"
          align="center"
          label="Finished">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ taskInfo[scope.row.taskName]?.['Finished']|| 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
        </el-card>
        </el-col>
        <el-col :span="12" v-if="task3.length>0">
          <el-card style="box-shadow:none !important;" class="box-card" >
          <div slot="header" class="clearfix">
            <span>Carrier Booking</span>
          </div>
          <div style="padding: 20px;">
          <el-table border
        :data="task3"
        style="width: 100%">
        <el-table-column
          prop="taskName"
          label="Task Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="possible"
          align="center"
          label="Possible">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ taskInfo[scope.row.taskName]?.['Possible'] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="urgent"
          align="center"
          label="Urgent">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ taskInfo[scope.row.taskName]?.['Urgent'] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="overdue"
          align="center"
          label="Overdue">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ taskInfo[scope.row.taskName]?.['Overdue']|| 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="finished"
          align="center"
          label="Finished">
          <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
          </template>
          <template slot-scope="scope">
            <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ taskInfo[scope.row.taskName]?.['Finished']|| 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
        </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>
  </transition>
</el-card>

    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr")
          }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
          </div> -->
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
        <el-button size="mini" @click="upload.open = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Review & Book" :visible.sync="bookVisible" width="75%">
      <div v-for="item in reviewBookData" :key="item.orderNumber">
        <p>{{ item.poNumber }}</p>
        <el-table :data="item.tableData">
          <el-table-column prop="productId" label="Product Name" min-width="100">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].split("[")[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="Product Code" min-width="100">
            <template v-slot="scope">
              <span>{{
                productMapForBook[scope.row.productId]
                  .split("[")[1]
                  .replace("]", "")
                  .replace("null", "")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cargoReadyBy" label="Cargo handover date" min-width="120">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.cargoReadyBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="Must Arrive By" min-width="110">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.mustArriveBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requested"  min-width="120"
                           :label="item.tableData.length > 0 && item.tableData[0].requestUnit ? 'Requested (' + item.tableData[0].requestUnit +')' : 'Requested'" >
          </el-table-column>
          <el-table-column prop="bookedQty"
                           :label="item.tableData.length > 0 && item.tableData[0].requestUnit ? 'Booked (' + item.tableData[0].requestUnit +')' : 'Booked'" >
            <template v-slot="scope">
              <el-input size="mini" v-model="scope.row.bookedQty"  @input="changeBookedQty(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="totalWeight" :label="$t('booking.totalWeight')" min-width="120">
            <template v-slot="scope">
              <el-input-number :precision="3" :controls="false" size="mini" v-model="scope.row.totalWeight" />
            </template>
          </el-table-column>
          <el-table-column prop="totalVolume" :label="$t('booking.totalVolume')" min-width="120">
            <template v-slot="scope">
              <el-input-number :precision="3" :controls="false" size="mini" v-model="scope.row.totalVolume" />
            </template>
          </el-table-column>
          <el-table-column
            label="Operation"
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

      <span slot="footer" class="dialog-footer">
        <el-button @click="bookVisible = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitBook">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
      </span>
    </el-dialog>
<!--    <el-uploadError-->
<!--      :title="uploadError.title"-->
<!--      :visible.sync="uploadError.dialogVisible"-->
<!--      width="50%" >-->
<!--      <el-table :data="uploadError.data"-->
<!--                style="width: 100%"-->
<!--                max-height="500px">-->
<!--        <el-table-column property="data" label="Data Error" >-->
<!--          <template slot-scope="scope">-->
<!--            <span >{{scope.row}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--    <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>-->
<!--  </span>-->
<!--    </el-uploadError>-->


    <el-drawer
    :modal="false"
  :title="title"
  :visible.sync="drawer"
  direction="rtl">

  <div class="cardx" v-for="h in taskList">

    <div class="status1Div">
      <span v-if="showTaskStatus(h)!=''"
      class="status2" :class="[showTaskStatus(h)=='Possible' ? 'color2' : ''
      , showTaskStatus(h)=='Finished' ? 'color1' : ''
      , showTaskStatus(h)=='Urgent' ? 'color3' : ''
      , showTaskStatus(h)=='Overdue' ? 'color4' : '']">
        {{showTaskStatus(h)}}
      </span>
    </div>
    <div class="order" style="margin-bottom: 5px;">Order:{{ h.orderNumber }}</div>
    <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>
    <div style="clear: both;"></div>
    <div class="date" style="margin-bottom: 5px;" v-if="h.status==2">Complete Date：{{ parseTime(h.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</div>
    <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Urgent Date：{{ parseTime(h.urgentDate) }}</div>
    <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Due Date：{{ parseTime(h.dueDate) }}</div>
    <div style="margin-bottom: 5px; float: right;cursor: pointer;">

      <el-popover
        placement="top-start"
        title=""
        width="200"
        trigger="hover"
        content="Send reminder">
        <i @click="sendEmail(h)" slot="reference" v-if="(showTaskStatus(h)=='Overdue'||showTaskStatus(h)=='Urgent')&&user.deptId!=h.partyId" class="el-icon-message"></i>
      </el-popover>

      <i v-show="h.status==1&&user.deptId==h.partyId" @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i>
      <i v-if="h.taskName=='QC Approve'&&h.status==2" @click="viewQcResult(h)" class="el-icon-view"></i>
      <i v-if="h.taskName!='QC Approve'&&h.jsonData!=null&&h.status==2" @click="viewTask(h)" class="el-icon-view"></i>



    </div>
    <div style="clear: both;"></div>
    </div>

</el-drawer>


<el-dialog :title="title" width="600px" :visible.sync="crdFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Cargo handover date" label-width="180px">
      <el-date-picker format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      v-model="form.crd"
      type="date"
      placeholder="Cargo handover date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="crdFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="inspectionFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Inspection Date" label-width="180px">
      <el-date-picker
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      v-model="form.inspectionDate"
      type="date"
      placeholder="Inspection Date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="inspectionFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="600px" :visible.sync="qcFormVisible">
  <el-form :disabled="view" :model="form" size="mini">

    <el-form-item label="Quality Approval Results" label-width="180px">
      <el-select v-model="form.approveResult">
        <el-option label="Pass" value="Pass"></el-option>
        <el-option label="Failed" value="Failed"></el-option>
        <el-option label="Exemption from inspection" value="Exemption from inspection"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Approve method" label-width="180px">
      <el-select v-model="form.approveMethod">
        <el-option label="Inspection Report" value="Inspection Report"></el-option>
        <el-option label="Email" value="Email"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if='view' label="Approve File" label-width="180px">
      <a :href="downloadLink" style="text-decoration: underline; padding-left: 15px;">file</a>
    </el-form-item>

    <el-form-item v-if='!view' label="Approve File" label-width="180px">

      <el-upload
        action=""
        :auto-upload="false"
        :on-change="beforeUpload"
      >
        <el-button size="small" type="primary">File</el-button>
      </el-upload>
  </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="qcFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="800px" :visible.sync="bookingFormVisible">
  <el-table
      :data="itemList"
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="Product Name"
        >
      </el-table-column>
      <el-table-column
        prop="productCode"
        label="Product Code"
        >
      </el-table-column>
      <el-table-column
        prop="totalVolume"
        label="Total Volume(CBM)"
        >
        <template v-slot="scope">
          <el-input v-model="scope.row.totalVolume" />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalWeight"
        label="Total Weight(KG)"
        width="120">
        <template v-slot="scope">
          <el-input v-model="scope.row.totalWeight" />
        </template>
      </el-table-column>
      <el-table-column
        prop="requested"
        :label="itemList.length > 0  && itemList[0].requestUnit ?'Requested (' + itemList[0].requestUnit +')' : 'Requested'"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bookedQty"
        :label="itemList.length > 0 && itemList[0].requestUnit  ? 'Booked Qty (' + itemList[0].requestUnit +')' : 'Booked Qty'"
        width="150">
        <template v-slot="scope">
          <el-input v-model="scope.row.bookedQty" />
        </template>
      </el-table-column>
    </el-table>

  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="bookingFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="600px" :visible.sync="pickupFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Empty Pick up" label-width="180px">
      <el-date-picker
      v-model="form.emptyPickupDate"
      type="date"
      placeholder="Empty Pick up">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="pickupFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="containerStuffingFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Container stuffing date" label-width="180px">
      <el-date-picker
      v-model="form.containerStuffingDate"
      type="date"
      placeholder="Container stuffing date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="containerStuffingFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>

<el-dialog :title="title" width="600px" :visible.sync="customClearanceFormVisible">
  <el-form :disabled="view" :model="form" size="mini">
    <el-form-item label="Origin Customs Clearance date" label-width="220px">
      <el-date-picker
      v-model="form.customClearanceDate"
      type="date"
      placeholder="Origin Customs Clearance date">
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" v-if="!view" class="dialog-footer">
    <el-button @click="customClearanceFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitTask">Submit</el-button>
  </div>
</el-dialog>


<el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
    <el-table
      :data="taskDetailData"
      v-loading="taskDetailData2Loading"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Task Name">
        <template v-slot="scope">
          {{ scope.row.taskName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="Order Number">
        <template v-slot="scope">
          <span style="text-decoration: underline;
          cursor: pointer;
    color: #004F7C;
    font-weight: bold;" @click="toOrder2(scope.row.orderNumber)">{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="urgentDate"
        label="Urgent Date">
        <template v-slot="scope">
          {{ parseTime(scope.row.urgentDate) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="dueDate"
        label="Due date">
        <template v-slot="scope">
          {{ parseTime(scope.row.dueDate) }}
        </template>
      </el-table-column>
      <el-table-column v-if="title.endsWith('finished')"
        prop="updateTime"
        label="Complete date">
        <template v-slot="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>

    <el-table-column label="Actions">
      <template v-slot="scope">
        <el-popover
        placement="top-start"
        title=""
        width="200"
        trigger="hover"
        content="Send reminder">
        <i @click="sendEmail(scope.row)" slot="reference" v-if="(showTaskStatus(scope.row)=='Overdue'||showTaskStatus(scope.row)=='Urgent')&&user.deptId!=scope.row.partyId" class="el-icon-message"></i>
        </el-popover>
      <i v-show="scope.row.status==1&&user.deptId==scope.row.partyId" @click="handleTask(scope.row)" style="cursor: pointer;" class="el-icon-edit"></i>
      <i v-if="scope.row.taskName=='QC Approve'&&scope.row.status==2" @click="viewQcResult(scope.row)" class="el-icon-view"></i>
      <i v-if="scope.row.taskName!='QC Approve'&&scope.row.jsonData!=null&&scope.row.status==2" @click="viewTask(scope.row)" class="el-icon-view"></i>
      </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>
<style scoped>
p{
  margin: 0px;
}
.not-check-css{
  border-color: red;
}


.title{
  font-weight: bold;
  padding-right: 10px;
}


.cardx{
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border:1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}
.status1Div,.order,.taskName,.date{
  float: left;
  margin-left: 15px;
}
.title{
  border: 5px;
}
.self-step1:not(:first-child):before{
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
}
.status2{

    border-radius: 100px;
    padding: 2px 13px;
    font-size: 12px;
}
.color1{
  color: #13854e;
  background-color:#d6ede2;
}
.color2{
  color: #2d86ba;
  background-color:#ceecfd;
}
.numberOftask{
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}
.color3{
  color: #e6a23c;
  background: #fdf6ec;
}
.color4{
  color: #f56c6c;
  background: #fef0f0;
}

</style>
<script>
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import '@icon-park/vue/styles/index.css';
import {IconPark} from '@icon-park/vue/es/all';
import {auth} from "@/plugins/auth";
import {getTaskStatus} from "@/utils/auth";
import { getUserProfile } from "@/api/system/user";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getContainerList } from "@/api/system/container";
import { getBaseHeader } from "@/utils/request";
import {trackByBookingNumber,findShippingSchedulePortList} from "@/api/shipment/shipment";
import { getHeaderPage, exportPO, importTemplate,groupByOha, exportPO1,orderReport,downloadKaemingkTemplate,downloadHenkelmanTemplate  } from "@/api/order/header";
import { getItemPage, getItemList ,getListByCondition} from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getDeptList,listDept } from "@/api/system/dept";
import { getCustomFieldList } from "@/api/system/customField";
import { getVesselList } from "@/api/system/vessel";
import { getTaskNames,updateTask,getTaskList,reminder, taskReport, getTaskPage } from "@/api/order/task";
import { createSubscribe,deleteSubscribe } from "@/api/order/subscribe";


export default {
  name: "Container",
  components: {
    IconPark
  },
  data() {
    return {
      taskLoading: false,
      taskDetailDataVisible:false,
      taskDetailData:[],
      taskDetailData2Loading:false,
      uploadError:{
        title: "Errors",
        dialogVisible: false,
        data: ""
      },
      task1:[],
      task2:[],
      task3:[],
      task1Temp:[
        {'taskName':'Update Cargo handover date','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Inspection Date','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'QC Approve','possible':0,'urgent':0,'overdue':0,'finished':0},
      ],
      task2Temp:[
        {'taskName':'Booking Order','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Validate shipper booking','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Inbound Received','possible':0,'urgent':0,'overdue':0,'finished':0},
      ],
      task3Temp:[
        {'taskName':'Carrier Booking','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Booking Confirmation','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Empty Pick up','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Container Loading Plan','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Container stuffing','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'SI Submit','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Origin Customs Clearance','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Gate in','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Vessel Departure','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'HBL Release','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Vessel Arrival','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Empty Return','possible':0,'urgent':0,'overdue':0,'finished':0}
      ],
      drawer2:false,
      direction: "rtl",
      drawer: false,
      tableDataLine: [],
      tableData: [],
      downloadLink:'',
      user:{},
      // 用户导入参数
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
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/order/import",
      },
      activities:[],
      exportLoading: false,
      tableHeight: 0,
      loading: true,
      total: 0,
      bookingNameMap:{},
      lineTotal: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:'',
        originPort: null,
        destinationPort: null,
        oha: null,
        shipper: null,
      },
      itemQueryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      productMap: {},
      preBookMap: {},
      currentOrderId: null,
      orderNumberMap: {},
      bookVisible: false,
      reviewBookData: [],
      productMapForBook: {},
      partyMap: {},
      dialogFormVisible:false,
      pickupFormVisible:false,
      bookingFormVisible:false,
      crdFormVisible:false,
      inspectionFormVisible:false,
      customClearanceFormVisible:false,
      qcFormVisible:false,
      containerStuffingFormVisible:false,
      form:{},
      view:true,
      task:{},
      itemList:[],
      itemVisable: false,
      title: "",
      preAssgineVisable:false,
      shipments: [],
      shipmentItemMap: {},
      data: {},
      customFieldHeader: [],
      customFieldLine: [],
      itemMap: {},
      expanded:{},
      loadingMap:{},
      containerMap:{},
      preAssgine:[],
      preAssgineForm:{},
      drawer:false,
      shipmentStatusMap:{},
      vesselMap:{},
      portMap:{},
      taskList:[],
      hiddenTask:false,
      fileType:{
        'shipment_carrier_bill':'MBL',
        'shipment_house_bill':'HBL',
        'shipment_others':'Others',
      },
      allMilestone:{
        "5": "Gate out Empty",
        "6": "Gate In Full",
        "8": "Shipped",
        "9": "BL Issued(Rls)",
        "10": "Arrived",
        "11": "Departure POD",
        "12": "Delivered",
        "14": "Completed"
      },
      vesselListLes:[],
      otherMilestones: {
        "-1":"Update",
        "0":"CancelShipment",
        "1":"Draft",
        "2":"Submit Booking",
        "3":"Booking Accept",
        "4":"Booking Confirmation",
        "5":"GATE OUT EMPTY",
        "6":"GateIn",
        "7":"Shipping Instructions",
        "8":"Shipped",
        "9":"BLIssued",
        "10":"Arrived",
        "11":"DeparturePOD",
        "12":"Delivered",
        "13":"ArrivalInlandTerminal",
        "14":"Completed",
        "18":"Departure POL",
        "19":"Arrival POD",
        "20":"Custom clearance",
        "21":"Delivery",
        "22":"Empty Return",
      },
      containerStatus:{
        "BDAR": "Arrived",
        "DLPT": "Departure",
        "STCS": "Gate Out",
        "GTOT": "Import to Consignee",
        "RCVE": "Return Empty",
        "STSP": "Empty Pick up",
        "GITM": "Gate In",
        "DSCH": "Discharge",
        "LOBD": "Load Board"
      },
      title:'',
      orderIndex:0,
      taskNames:[],
      possibleList:[],
      urgentList:[],
      overdueList:[],
      finishedList:[],
      orderInfo:{
        ports:[],
        booked:0,
        notBooked:0,
      },
      checkedPort:{},
      taskInfo:{},
      portOptions: [],
      shipperList: [],
      ohaList: [],
      deptList: [],
    };
  },
  created() {
    this.hiddenTask = getTaskStatus()==1;

    if(this.$route.query.orderNumber){
      this.$set(this.queryParams, "orderNumber", this.$route.query.orderNumber)
    }
    getUserProfile().then(response => {
        this.user = response.data;
    });
    this.calcTableHeight();
    this.groupByOha()
    this.getPortList()
    this.getOriginDeliveryList()
    this.orderReport()
    this.getDeptListForFilter()
  },
  methods: {
    checkPermi,
    checkRole,
    bookedChange(flag){
      if(this.queryParams.booked==flag){
        this.queryParams.booked=null
      }else{
        this.queryParams.booked=flag
      }
      this.getList()
    },
    clickPort1(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item]);
      var ports=[]
      for(var key in this.checkedPort){
        if(this.checkedPort[key]){
          ports.push(key)
        }
      }
      this.queryParams.ports=ports
      this.getList()
    },
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
    getTenantPage(){
      if(this.checkPermi(['super:user'])){
        getTenantPage({pageNo:1,pageSize:100,status:0}).then(response => {
          for(var i=0;i<response.data.list.length;i++){
            this.tenantMap[response.data.list[i].id]=response.data.list[i].name
          }
        });
      }
    },
     taskReport() {
      taskReport({
        tenantId: this.queryParams.tenantId, booked: this.queryParams.booked, ports: this.queryParams.ports,
        orderStatus: this.queryParams.status
    }).then((res) => {
        this.taskInfo = res.data.statusCount
        console.log(res.data)
      })
    },
    orderReport(){
      orderReport().then((res)=>{
        this.orderInfo=res.data
      })
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex%2==0) {
          return 'shuang-row';
        } else {
          return 'dan-row';
        }
        return '';
      },
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.form.file = reader.result;
          resolve(); // 上传之前的处理完成后调用 resolve()
        };

        reader.readAsDataURL(file.raw);
      });
    },
    handleSortChange({ column, prop, order }){
    // 根据当前排序条件发送请求到后台获取排序结果
    if(order!=null){
      order = order === 'ascending' ? 'ASC' : 'DESC';
      this.queryParams.prop=column.property.replace(/([A-Z])/g, "_$1").toLowerCase()
      this.queryParams.orderBy=order
    }else{
      this.queryParams.prop=''
      this.queryParams.orderBy=''
    }
    this.getList()
  },
    toOrder2(orderNumber){
      this.taskDetailDataVisible=false
      this.drawer2=false
      this.$set(this.queryParams, "orderNumber", orderNumber)
      this.getList()
    },
    sendEmail(task){
      reminder({
        status:this.showTaskStatus(task),
        orderNumber:task.orderNumber,
        taskName:task.taskName,
        partyId:task.partyId
      }).then((res)=>{
        this.$notify({
          title: 'success',
          message: 'Reminder mail sent',
          type: 'success'
        });
      })
    },
    taskDetails(row,status){
      var statusT = status.charAt(0).toUpperCase() + status.slice(1)
      this.taskDetailDataVisible=true
      this.title = row.taskName + " " + statusT
      this.queryParams2.taskName = row.taskName
      this.queryParams2.status = 1
      if(statusT =='Finished') {
        this.queryParams2.status = 2
      }
      this.queryParams2.statuskey = statusT

       this.taskDataTableQuery()
       this.queryParams2.pageNo=1
    },
    taskDataTableQuery(){
      this.taskDetailData2Loading = true
      getTaskPage({
        pageNo: this.queryParams2.pageNo, pageSize: this.queryParams2.pageSize,
        tenantId: this.queryParams.tenantId, booked: this.queryParams.booked, ports: this.queryParams.ports,
        status: this.queryParams2.status, taskName: this.queryParams2.taskName, statuskey: this.queryParams2.statuskey
      }).then((res) => {
        console.log(res.data)
        this.taskDetailData2Loading = false
        this.taskDetailData = res.data.list
        this.queryParams2.total = res.data.total

      })

      // const startIndex = (this.queryParams2.pageNo - 1) * this.queryParams2.pageSize;
      // this.taskDetailData2=this.taskDetailData.slice(startIndex, startIndex + this.queryParams2.pageSize);
    },
    getTaskNames(){
      this.taskLoading = true
      getTaskNames({type:'1'}).then((res)=>{
        this.task1 = JSON.parse(JSON.stringify(this.task1Temp))
        this.task2 = JSON.parse(JSON.stringify(this.task2Temp))
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.taskNames=res.data
        this.task1=this.task1.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.task2=this.task2.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.task3=this.task3.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.taskReport()
        // this.overview()
      })
    },
    overview(){
      getTaskList({status:1,statuskey:'Possible',tenantId:this.queryParams.tenantId,booked:this.queryParams.booked,ports:this.queryParams.ports,
      orderStatus:this.queryParams.status
      }).then((res)=>{
        this.possibleList=res.data
        this.setData(res,'possible')
      })
      getTaskList({status:1,statuskey:'Urgent',tenantId:this.queryParams.tenantId,booked:this.queryParams.booked,ports:this.queryParams.ports,
      orderStatus:this.queryParams.status}).then((res)=>{
        this.urgentList=res.data
        this.setData(res,'urgent')
      })
      getTaskList({status:1,statuskey:'Overdue',tenantId:this.queryParams.tenantId,booked:this.queryParams.booked,ports:this.queryParams.ports,
      orderStatus:this.queryParams.status}).then((res)=>{
        this.overdueList=res.data
        this.setData(res,'overdue')
      })
      getTaskList({status:2,tenantId:this.queryParams.tenantId,booked:this.queryParams.booked,ports:this.queryParams.ports,
      orderStatus:this.queryParams.status}).then((res)=>{
        this.finishedList=res.data
        this.setData(res,'finished')
        this.taskLoading = false
      })
    },
    setData(res,key){
      for(var task of this.task1) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var task of this.task2) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var task of this.task3) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var i=0;i<res.data.length;i++){
          if(res.data[i].taskName=='Update Cargo handover date'
          ||res.data[i].taskName=='Inspection Date'
          ||res.data[i].taskName=='QC Approve'){
            var index = this.task1.findIndex(item => item.taskName === res.data[i].taskName);
            if(index<0) {
              continue
            }
            if(!this.task1[index][key+'data']||i==0){
              this.task1[index][key+'data']=[]
            }
            this.task1[index][key+'data'].push(res.data[i])
            this.task1[index][key]=this.task1[index][key]+1
          }else if(res.data[i].taskName=='Booking Order'
          ||res.data[i].taskName=='Validate shipper booking'){
            var index = this.task2.findIndex(item => item.taskName === res.data[i].taskName);
            if(index<0) {
              continue
            }
            if(!this.task2[index][key+'data']||i==0){
              this.task2[index][key+'data']=[]
            }
            this.task2[index][key+'data'].push(res.data[i])
            this.task2[index][key]=this.task2[index][key]+1
          }else{
            if(res.data[i].taskName=='Upload PO'){
              continue
            }
            var index = this.task3.findIndex(item => item.taskName === res.data[i].taskName);
            if(index<0) {
              continue
            }
            if(!this.task3[index][key+'data']||i==0){
              this.task3[index][key+'data']=[]
            }
            this.task3[index][key+'data'].push(res.data[i])
            this.task3[index][key]=this.task3[index][key]+1
          }
        }
    },
    openOverview(){

      this.drawer2=!this.drawer2
    },
    showTaskStatus(h){
      if(h.status==0){
        return ''
      }else if(h.status==1){
        if(Date.now()>h.dueDate){
          return 'Overdue'
        }else if(Date.now()>h.urgentDate){
          return 'Urgent'
        }
        return 'Possible'
      }else if(h.status==2){
        return 'Finished'
      }
    },
    showTask(list,index){
      this.orderIndex=index
      this.drawer=true
      this.taskList=list
      if(list.length>0){
        this.title=list[0].orderNumber
      }
    },
    showStatus(data) {
      if(data.status==1){
        return 'Cancel'
      }
      if(data.shipmentContainerStatusRes.length==0){
        function compare(){
          return function(a,b){
              var value1 = a["status"];
              var value2 = b["status"];
              return parseInt(value1) - parseInt(value2);
          }
        }
        console.log(data)
        var arr=JSON.parse(JSON.stringify(data.shipmentStatusList))
        arr.sort(compare())
        return this.otherMilestones[arr[arr.length-1].status]
      }
      if(data.shipmentContainerStatusRes.length>0){
        var move=data.shipmentContainerStatusRes[data.shipmentContainerStatusRes.length-1]
        if(data.carrier=='TSHG'){
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
        }else{
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
        }
      }
    },

    searchPortPor(query){
      if(query.length>=3){

      }
    },
        clickPort(item) {
      this.loading = true;
      var flag=false;
      for (var i = 0; i < this.activities.length; i++) {
        if (this.activities[i].oha == item.oha) {
          if(this.activities[i].type=="primary"){
            this.activities[i].type = "";
            flag=true
          }else{
            this.activities[i].type = "primary";
          }
        } else {
          this.activities[i].type = "";
        }
        this.$set(this.activities, i, this.activities[i]);
      }
      if(flag){

        this.$set(this.queryParams,'oha',null)
      }else{
        this.$set(this.queryParams,'oha',item.oha)
      }

      this.getList();
    },
    preAssgineOpen(){
      if(this.preAssgine.length==0){
        this.$notify({
          message: 'No selected po',
          type: 'warning'
        });
      }else{
        this.preAssgineVisable=true
      }
    },
    remoteMethod(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselName: query }).then((response) => {
          this.vesselListLes = response.data;
        });
      } else {
        this.vesselListLes = [];
      }
    },
    groupByOha(){
      groupByOha().then((res)=>{
        var ids=[]
        for(var i=0;i<res.data.length;i++){
          this.activities.push({
            oha:res.data[i].oha,
            count:res.data[i].count
          })
          if(res.data[i].oha!=null){
            ids.push(res.data[i].oha)
          }
        }
        console.log(ids)
        if(ids.length>0){
          this.getDeptList(ids)
        }

      })
    },
    getLoadingQty(bookingItem,shipmentList){
      var qty=0
      if(shipmentList&&shipmentList.length>0){
        for(var j=0;j<shipmentList.length;j++){
          if(shipmentList[j].clpRes&&shipmentList[j].clpRes.clpDetailResList){
            for(var k=0;k<shipmentList[j].clpRes.clpDetailResList.length;k++){
              if(shipmentList[j].clpRes.clpDetailResList[k].orderItemId==bookingItem.id){
                qty+=shipmentList[j].clpRes.clpDetailResList[k].qty
              }
            }
          }

        }

      }
      return qty;
    },
    toAllocation(order,flag){
      //localStorage.setItem('allocation', JSON.stringify(order));
      var week,carrier,lotNo
      if(order.shipmentResList.length > 0){
        if(flag==2){
          week = order.shipmentResList[0].etdAllocation
        }
        carrier =  order.shipmentResList[0].carrier
      }
       if(flag==1){ lotNo = order.orderNumber}

      window.open('/bi/allocation?lotNo='+lotNo +'&type='+carrier+'&week='+week)
    },
    //获取有BookingNumber的Carrier
    getBookingNumberCarrier(order){
      if( order.shipmentResList.length > 0){
          return order.shipmentResList[0].carrier
      }
      return ''
    },
    getContainerList() {
      getContainerList().then((response) => {
        for(var i=0;i<response.data.length;i++){
          this.containerMap[response.data[i].type]=response.data[i].tue
        }
        this.getCustomFieldList();
      });
    },
    showContainers(list,filedName){
      var data=list.filter((item)=>item.type=1&&item[filedName]!=null)
      var text=''
      for(var i=0;i<data.length;i++){
        text+=data[i].containerNo+": "+ this.parseTime(data[i][filedName])+"<br/>"
      }
      this.$alert(text, '', {
          dangerouslyUseHTMLString: true
        });
    },
    handleClick(el,order){
      if(el.index!='0'&&!order.shipments){
        order.shipments=true
      }
      //select shipments
      this.toggleLoading(order.id)
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index]);
    },
    togglePreAssgine(index){
      this.$set(this.preAssgine, index, !this.preAssgine[index]);
    },
  async toggleLoading(index) {
      this.$set(this.loadingMap, index, !this.loadingMap[index]);
    },
    showItems(order){
      var value=Math.abs(order.show-1)
      this.$set(order,'show',value)
    },

    getCustomFieldList() {
      getCustomFieldList({}).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].type == "order_header") {
            this.customFieldHeader.push(response.data[i]);
          } else {
            this.customFieldLine.push(response.data[i]);
          }
        }
        this.getList();
      });
    },
    getPortList() {
      findShippingSchedulePortList().then((res)=>{
        for(var i=0;i<res.data.length;i++){
          this.$set(this.portMap,res.data[i].value,res.data[i].label)
        }
        this.getContainerList()
      })
    },
    getOriginDeliveryList(){
      getOriginDeliveryList().then((res)=>{
        console.log('1111',res.data)
        this.portOptions=res.data
      })
    },
    getDeptList(ids) {
      var vm = this;
      getDeptList({ ids: ids.join(",") }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(vm.partyMap, response.data[i].id, response.data[i].name);
        }

      });
    },
    getshippedTue(data){
      var count=0
      for(var i=0;i<data.length;i++){
        count+=this.containerMap[data[i].containerType]*data[i].numbers
      }
      return count
    },
    toTack(vesselName){
      window.open('/track/ship?vesselName='+vesselName)
    },
    toOrder(po){
      window.open('/order/POManagement?orderNumber='+po)
    },
    submitBook() {
      var count = 0;
      var newData = [];
      for (var i = 0; i < this.reviewBookData.length; i++) {
        for (var j = 0; j < this.reviewBookData[i].tableData.length; j++) {
          count++;
        }
        if (this.reviewBookData[i].tableData.length > 0) {
          newData.push(this.reviewBookData[i]);
        }
      }
      if (count == 0) {
        this.$notify({
          message: "Please select a piece of data",
          type: "warning",
        });
      } else {
        sessionStorage.setItem("bookData", JSON.stringify(newData));
        this.$router.push("/shipment/booking-create");
      }
    },
    handleDelete(data, index) {
      data.splice(index, 1);
    },
    async getData() {
      var vm = this;
      vm.reviewBookData = [];
      if (JSON.stringify(this.preBookMap) === "{}") {
        this.$notify({
          message: "Please select order.",
          type: "warning",
        });
      } else {
        this.bookVisible = true;
        var productIds = [];
        var data = [];
        for (var key in this.preBookMap) {
            var bn =null
            for (var i = 0; i < this.tableData.length; i++) {
              if(this.tableData[i].id != key || this.tableData[i].bookings.length == 0){
                continue
              }
               for (var j = 0; j < this.tableData[i].bookings.length; j++) {
                  if(this.tableData[i].bookings[j].status == 1){
                    continue
                  }
                  if(bn){
                    bn += ', <a target="_blank" class="el-link el-link--primary is-underline" href="/booking/booking?bookingNumber='
                        + this.tableData[i].bookings[j].bookingNumber + '">' + this.tableData[i].bookings[j].bookingNumber + '</a>'
                  }else{
                    bn = ' <a target="_blank" class="el-link el-link--primary is-underline" href="/booking/booking?bookingNumber='
                        + this.tableData[i].bookings[j].bookingNumber + '">' + this.tableData[i].bookings[j].bookingNumber + '</a>'
                  }
              }
             }
             if(bn){
              this.$confirm( 'Producer booking already created '+bn+',would you like to create another one?',
               '',
                {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "Confirm",
                  showCancelButton: false,
                  type: 'warning'
                }).then(() => {
                }).catch(() => {
                });
             }

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
      }
    },
    reviewBook() {
      this.getData();
    },
    clearAll() {
      this.preBookMap = {};
    },
    handleClose(key) {
      delete this.preBookMap[key];
      this.preBookMap = JSON.parse(JSON.stringify(this.preBookMap));
    },
    addAllToBooked(currentOrderId, tableDataLine) {
      if (tableDataLine.length == 0) {
        return;
      }
      var allFlag = true
      var itemIds = [];
      for (var i = 0; i < tableDataLine.length; i++) {
        if (tableDataLine[i].selected) {
          if (tableDataLine[i].bookedQty <= 0) {
            this.$notify({
              message: "Booked Qty must gt 0",
              type: "warning",
            });
            return;
          } else if(tableDataLine[i].bookedQty > tableDataLine[i].requested){
            this.$notify({
              message: "Book qty exceed requested qty",
              type: "warning",
            });
          }else{
            this.$notify({
              message: "success",
              type: "success",
            });
          }
          allFlag = false
          itemIds.push({
            itemId: tableDataLine[i].id,
            qty: tableDataLine[i].bookedQty,
          });
        }
      }
      //是否有选择Book
      if(allFlag){
        for (var i = 0; i < tableDataLine.length; i++) {
          this.$set(tableDataLine[i], 'checkCss', true)
        }
        this.$notify({
          message: "Mandatory field, please submit.",
          type: "warning",
        });
        return
      }else{
        for (var i = 0; i < tableDataLine.length; i++) {
          this.$set(tableDataLine[i], 'checkCss', false)
        }
      }
      var arr = this.preBookMap[currentOrderId] ? this.preBookMap[currentOrderId] : [];
      for (var i = 0; i < itemIds.length; i++) {
        var foundItem = arr.find(function (item) {
          return item.itemId === itemIds[i].itemId;
        });
        if (foundItem == null) {
          arr.push(itemIds[i]);
        }
      }
      this.$set(this.preBookMap, currentOrderId, arr);
    },
    getHeaderPage() {
        getHeaderPage(this.queryParams).then((response) => {
        this.tableData = response.data.list;
        this.vesselMap={}
        if (this.tableData.length > 0) {
          var productIds = [];
          this.shipmentStatusMap={}
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].show=0
            this.tableData[i].key='first'+this.tableData[i].id
            this.orderNumberMap[this.tableData[i].id]=this.tableData[i].orderNumber
            for (var j = 0; j < this.tableData[i].items.length; j++) {
              productIds.push(this.tableData[i].items[j].productId);
            }
            for(var k=0;k<this.tableData[i].shipmentResList.length;k++){
              var tempCarrier = this.tableData[i].shipmentResList[k].carrier
              if((tempCarrier && tempCarrier!='TSHG') && this.tableData[i].shipmentResList[k].shipmentBookingNumber){
                if(this.$auth.hasPermi("shipment:query")){

                  trackByBookingNumber({
                    carrier: tempCarrier,
                    type:"bill",
                    bookingNumber:this.tableData[i].shipmentResList[k].shipmentBookingNumber
                  }).then((res)=>{

                    if(res.data!=null&&res.data.statusCode==20000){
                      var vessles=res.data.data.result.vessel

                      var vesselMap={}
                      for(var j=0;j<vessles.length;j++){
                        vesselMap[vessles[j].vessel]=vessles[j].imo
                      }
                      var statusList=res.data.data.result.places

                      var portStatusMap={}
                      for(var k=0;k<statusList.length;k++){
                        if(!portStatusMap[statusList[k].code]){
                          portStatusMap[statusList[k].code]={}
                        }

                        portStatusMap[statusList[k].code]['etd']=new Date(statusList[k].etd?statusList[k].etd:statusList[k].atd)
                        portStatusMap[statusList[k].code]['eta']=new Date(statusList[k].eta?statusList[k].eta:statusList[k].ata)
                        if(statusList[k].atd){
                          portStatusMap[statusList[k].code]['atd']=new Date(statusList[k].atd)
                        }
                        if(statusList[k].ata){
                          portStatusMap[statusList[k].code]['ata']=new Date(statusList[k].ata)
                        }
                      }
                      if(res.data.data.result.containers.length>0){
                        var c_status=res.data.data.result.containers[0].status[res.data.data.result.containers[0].status.length-1]
                        console.log(portStatusMap)
                        this.$set(this.shipmentStatusMap,res.data.data.result.billNo,{
                            status:c_status.descriptionEn+":"+c_status.portCode,
                            movement:res.data.data.result.containers,
                            vesselMap:vesselMap,
                            portStatusMap:portStatusMap
                          })
                      }

                    }
                  })
                }
              }else{
                var containers=this.tableData[i].shipmentResList[k].containerDOList.filter((item)=>item.type==1)
                var pol=this.tableData[i].shipmentResList[k].originPort
                var pod=this.tableData[i].shipmentResList[k].destinationPort
                if(containers.length>0){
                  if(containers[0].actions!=null){
                    var statusList=JSON.parse(containers[0].actions)

                    var atdEvent=statusList.filter((item)=>item.location.trim()==this.portMap[pol]&&item.event=='LOAD FULL')
                    if(atdEvent.length>0){
                      this.tableData[i].shipmentResList[k].atd=new Date(atdEvent[0].date_track)
                    }

                    var ataEvent=statusList.filter((item)=>item.location.trim()==this.portMap[pod]&&item.event=='DISCHARGE FULL')
                    if(ataEvent.length>0){
                      this.tableData[i].shipmentResList[k].ata=new Date(ataEvent[0].date_track)
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
              this.bookingNameMap[this.tableData[i].id] =  bookingNumbers;
          }
          this.getDeptList(partyIds);
        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    changePage() {
      this.loading = true;
      this.getHeaderPage()
    },
    getList() {
      this.loading = true;
      this.getHeaderPage()
      this.orderReport()
      this.getTaskNames()
    },
    async showProduct(shipment) {
      var res = await getItemList({ ids: shipment.itemIds.join(",") });
      var productIds = [];
      for (var i = 0; i < res.data.length; i++) {
        productIds.push(res.data[i].productId);
      }
      var res1 = await getProductList({ ids: productIds });
      var data = [];
      for (var i = 0; i < res1.data.length; i++) {
        data.push({ code: res1.data[i].code, name: res1.data[i].name });
      }
      this.$set(this.shipmentItemMap, shipment.id, data);
    },
    getItems(productIds) {
      getProductList({ ids: productIds }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          this.productMap[response.data[i].id] = {
            name: response.data[i].name,
            code: response.data[i].code,
            category: response.data[i].category,
          };
        }
      });
    },
    clickTr(row) {
      //this.itemVisable = true;
      this.$nextTick(() => {
        this.itemQueryParams.orderId = row.id;
        this.orderNumberMap[row.id] = row.orderNumber;
        //this.getItems();
        this.title = row.orderNumber + ":PO Items";
      });
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 302;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPO(params);
        })
        .then((response) => {
          this.$download.excel(response, "smartMOOV_PO"+this.parseTimeToZ2(new Date())+".xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
        /** 导出按钮操作 */
    handleExport1() {
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPO1(params);
        })
        .then((response) => {
          this.$download.excel(response, "smartMOOV_PO1"+this.parseTimeToZ2(new Date())+".xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    parseTimeToZ1(timestamp) {
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
    parseTimeToZ2(timestamp) {
      if(!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}${month}${day}${hours}${minutes}`;
    },
    /** 导入按钮操作 */
    handleImport() {
      console.log(111)
      this.upload.title = "Import";
      this.upload.open = true;
      if (this.checkPermi(['order:header:importKaemingk'])) {
        this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/importKaemingk";
      } else if (this.checkPermi(['order:header:importHenkelman'])) {
        this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/importHenkelman";
      } else {
        this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/import";
      }
    },
    /** 下载模板操作 */
    importTemplate() {
      if (this.checkPermi(['order:header:importKaemingk'])) {
        downloadKaemingkTemplate().then((response) => {
          this.$download.excel(response, "PO Upload TempLate.xlsx");
        });
      } else if (this.checkPermi(['order:header:importHenkelman'])) {
        downloadHenkelmanTemplate().then((response) => {
          this.$download.excel(response, "PO Upload TempLate.xlsx");
        });
      } else {
        importTemplate().then((response) => {
          this.$download.excel(response, "PO Upload TempLate.xlsx");
        });
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        this.$refs.upload.clearFiles();
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 拼接提示语
      let data = response.data.failureOrderNumber;
      if (data.length > 0) {
        this.uploadError.data = data
        this.uploadError.dialogVisible = true

      }
      this.getList();
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList){
      console.log(err)
      this.$refs.upload.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleTask(task){
      this.view=false
      this.task=task
      this.form={}
      //this.title=task.orderNumber+'['+task.taskName+']'
      if(task.taskName=='Update Cargo handover date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='QC Approve'){
        this.qcFormVisible=true
      }else if(task.taskName=='Booking Order'){
        if(this.$auth.hasPermi("booking:create")){
          this.bookingFormVisible=true
          getListByCondition({orderId:task.orderId}).then((res)=>{
            this.itemList=res.data
          })
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Validate shipper booking'){
        if(this.$auth.hasPermi("booking:query")){
          this.$router.push("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
        console.log("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId)
      }else if(task.taskName=='Carrier Booking'){
        if(this.$auth.hasPermi("shipment:create")){
          this.$router.push("/shipment/create?ids="+JSON.parse(task.jsonData).bookingId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Booking Confirmation'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        if(this.$auth.hasPermi("shipment:clp:create")){
          this.$router.push("/shipment/clp/add?shipmentId="+JSON.parse(task.jsonData).shipmentId+'&bookingNumber='+JSON.parse(task.jsonData).bookingNumber);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Vessel Departure'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='HBL Release'){
        if(this.$auth.hasPermi("shipment:hbl:create")){
          this.$router.push("/shipment/Hbl?shipmentId="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Vessel Arrival'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }else if(task.taskName=='Empty Return'){
        if(this.$auth.hasPermi("shipment:query")){
          this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }
    },
    viewQcResult(task){
      this.qcFormVisible=true
      this.view=true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form=JSON.parse(task.jsonData)
      console.log(this.form.file)
      const base64String = this.form.file.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Create Blob using the provided MIME type from the base64 prefix
      const mimeType = this.form.file.split(',')[0].split(':')[1].split(';')[0];
      const blob = new Blob([byteArray], { type: mimeType });

      // Create download link
      this.downloadLink = URL.createObjectURL(blob);
      console.log(this.downloadLink);
    },
    viewTask(task){
      this.view=true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form=JSON.parse(task.jsonData)
      if(task.taskName=='Update Cargo handover date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='Booking Order'){
        this.$router.push("/shipment/booking-detail?id="+this.form.bookingId);
      }else if(task.taskName=='Validate shipper booking'){
        this.$alert('Pass', 'Result', {
          confirmButtonText: 'Ok',
          callback: action => {

          }
        });
      }else if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$alert('Date:'+JSON.parse(task.jsonData).date+'<br/>'+'Booking Number:'+JSON.parse(task.jsonData).bookingNumber, 'Booking Confirmation', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        console.log(JSON.parse(task.jsonData))
        this.$router.push("/shipment/clp/detail?id="+JSON.parse(task.jsonData).clpId);
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime+'<br/>'+'Vessel:'+JSON.parse(task.jsonData).vessel
        +'<br/>'+'Voyage:'+JSON.parse(task.jsonData).voyage, 'Gate in', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Vessel Departure'){
        this.$alert('ATD:'+JSON.parse(task.jsonData).atd, 'Vessel Departure', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/Hbl?hblNumber="+JSON.parse(task.jsonData).hblNumber);
      }else if(task.taskName=='Vessel Arrival'){
        this.$alert('ATA:'+JSON.parse(task.jsonData).atd, 'Vessel Arrival', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Return'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Empty Return', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }

    },
    submitTask(){
      if(this.task.taskName=='Booking Order'){
        for (var i = 0; i < this.itemList.length; i++) {
            if(this.itemList[i].bookedQty > this.itemList[i].requested){
              this.$notify({
                message: "Book qty exceed requested qty",
                type: "warning",
              });
            }
        }
        var bookData=[{
          orderId:this.task.orderId,
          poNumber:this.task.orderNumber,
          tableData:this.itemList
        }]
        sessionStorage.setItem("bookData", JSON.stringify(bookData));
        this.$router.push("/shipment/booking-create");
      }else{
        this.task.jsonData=JSON.stringify(this.form)
        updateTask(this.task).then((res)=>{
          this.crdFormVisible=false
          this.inspectionFormVisible=false
          this.qcFormVisible=false
          this.pickupFormVisible=false
          this.containerStuffingFormVisible=false
          this.customClearanceFormVisible=false

          // this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId)
          this.getList()
        })

      }

    },
    subscribe(item){
      // 订阅和取消订阅；
      var req = {
        'orderId': item.id,
        'orderNumber': item.orderNumber,
        'type': 1
      }
      if(item.subscribe) {
        deleteSubscribe(item.subscribeId).then((res)=>{
        item.subscribe = !item.subscribe;
       })
      } else {
        createSubscribe(req).then((res)=>{
        item.subscribe = !item.subscribe;
        item.subscribeId = res.data;
       })
      }
    },
    getDeptListForFilter(){
      listDept().then((res)=>{
        this.deptList=res.data
        // 筛选deptList 中 对象属性值包含OHA
        this.ohaList = this.deptList.filter(item => item.partyRole.includes('OHA')) || []
        this.shipperList = this.deptList.filter(item => item.partyRole.includes('Shipper')) || []
        console.log('所有的dept', this.deptList)
        console.log('所有的Oha', this.ohaList)
        console.log('所有的shipper', this.shipperList)
      })
    }
  },
};
</script>
