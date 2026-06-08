<template>
    <div class="app-container booking-order" style="width:100%; margin: 0 auto">
        <el-dialog title="Add comments" :visible.sync="commentsDialogVisible" width="800px">
          <div style="border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
              :mode="mode" />
            <Editor style="height: 260px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode"
              @onCreated="onCreated" />

          </div>
          <div style="text-align: right;margin-top: 10px;">
            <el-button type="primary" @click="shipLogCreate">Submit</el-button>
          </div>
        </el-dialog>

      <el-card style="padding: 20px; ">
        <div style="padding-bottom: 20px;margin-bottom: 20px;">

            <el-form :model="queryParams">
            <!--  -->

            <div style="float: left;">
              <el-input placeholder="Shipment Ref"  v-model="queryParams.bookingNumber" clearable
              @clear="queryParams.pageNo =1 ,getPage()"
              @keyup.enter.native = "queryParams.pageNo = 1 ,getPage()"/>
            </div>
            <div style="float: left;margin-left: 5px;">
              <el-input placeholder="Booking Number"  v-model="queryParams.shipmentBookingNumber" clearable
              @clear="queryParams.pageNo =1 ,getPage()"
              @keyup.enter.native = "queryParams.pageNo = 1 ,getPage()"/>
            </div>

            <div style="float: left;margin-left: 5px;">
              <el-select v-model="queryParams.status" clearable  placeholder="Shipment Status">
                  <el-option label="All" value=""></el-option>
                  <el-option label="Draft" value="draft"></el-option>
                  <el-option label="Booking submitted" value="submitBooking"></el-option>
                  <el-option label="Booking Confirmed" value="bookingConfirmation"></el-option>
                  <el-option label="Shipping instruction" value="shippingInstructions"></el-option>
                  <el-option label="Vessel Departure" value="vesselDeparture"></el-option>
                  <el-option label="Vessel Arrived" value="vesselArrived"></el-option>
                  <el-option label="Cancel" value="cancel"></el-option>
                  <el-option label="Deactivate" value="deactivate"></el-option>
                </el-select>
            </div>

            <div style="float: left;margin-left: 5px;">
              <el-select clearable @clear="queryParams.pageNo =1 ,getPage()" placeholder="POL" filterable v-model="queryParams.originPort">
              <el-option
                v-for="dict in this.portData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </div>

            <div style="float: left;margin-left: 5px;">
              <el-button @click="getPage()"><i class="el-icon-search"></i> Search</el-button>
            </div>
          </el-form>


        <div style="float: right;">
            <el-button v-if="!drawer2" @click="createShipment" type="primary"><i class="el-icon-plus"></i>Create Booking</el-button>
            <el-button v-if="!hiddenTask" type="primary"  @click="openOverview">
                {{!drawer2?'Overview':'Booking List'}}
              </el-button>
        </div>
    </div>

        <div v-if="!drawer2" :style="{height:clientHeight+'px'}" style="float: left; width: calc(100%); position: relative;"  v-loading="loading" >

          <div style="overflow-y:auto; overflow-x: hidden;"  :style="{ height: (clientHeight-55)+'px' }">
            <el-empty v-if="tableData.length == 0 && !loading" description="No Data"></el-empty>
            <el-row :gutter="0"
                    style=" background: #fff;box-shadow: none!important;border: 1px solid #ddd;"
                    v-for="(item,index) in tableData"
                    :key="item.id"
                    class="margin-top">
              <el-col :span="3">
                <el-row>

                  <el-col :span="24">
                    <img
                      v-if="item.carrier == 'HLCU'"
                      class="partyLogo"
                      src="../../../assets/HLCU.png"
                    />
                    <img
                      v-if="item.carrier == 'MAEU'"
                      class="partyLogo"
                      src="../../../assets/MAEU.png"
                    />
                    <img
                      v-if="item.carrier == 'ZIMU'"
                      class="partyLogo"
                      src="../../../assets/ZIMU.png"
                    />
                    <img
                      v-if="item.carrier == 'TSHG'"
                      class="partyLogo"
                      src="../../../assets/tailwind.png"
                    />
                    <img
                      v-if="item.carrier == 'MSCU'"
                      class="partyLogo"
                      src="../../../assets/MSCU-new.png"
                    />
                    <img
                      v-if="item.carrier == 'MSC'"
                      class="partyLogo"
                      src="../../../assets/MSCU-new.png"
                    />
                    <img
                      v-if="item.carrier == 'OOLU'"
                      class="partyLogo"
                      src="../../../assets/OOLU.svg"
                    />
                    <img
                      v-if="item.carrier == 'CMDU'"
                      class="partyLogo"
                      src="../../../assets/CMA.png"
                    />
                    <img
                      v-if="item.carrier == 'HMM'"
                      class="partyLogo"
                      src="../../../assets/HMM.jpg"
                    />
                    <img
                      v-if="item.carrier == 'ONEY'"
                      class="partyLogo"
                      src="../../../assets/ONE.png"
                    />
                    <img
                      v-if="item.carrier == 'COSU'"
                      class="partyLogo"
                      src="../../../assets/COSCO.png"
                    />
                    <img
                      v-if="item.carrier == 'CMA'"
                      class="partyLogo"
                      src="../../../assets/logo/CMA.png"
                    />
                    <img
                      v-if="item.carrier == 'COSCO'"
                      class="partyLogo"
                      src="../../../assets/logo/COSCO.png"
                    />
                    <img
                      v-if="item.carrier == 'HPL'"
                      class="partyLogo"
                      src="../../../assets/logo/HPL.png"
                    />

                    <img
                      v-if="item.carrier == 'MSK'"
                      class="partyLogo"
                      src="../../../assets/logo/MSK.png"
                    />
                    <img
                      v-if="item.carrier == 'ONE'"
                      class="partyLogo"
                      src="../../../assets/logo/ONE.png"
                    />
                    <img
                      v-if="item.carrier == 'ZIM'"
                      class="partyLogo"
                      src="../../../assets/logo/ZIM.png"
                    />
                    <img
                      v-if="item.carrier == 'EGLV'"
                      class="partyLogo"
                      src="../../../assets/logo/EGLV.png"
                    />
                    <img
                      v-if="item.carrier == 'SJHH'"
                      class="partyLogo"
                      src="../../../assets/logo/SJHH.png"
                    />
                    <img
                      v-if="item.carrier == 'SMLU'"
                      class="partyLogo"
                      src="../../../assets/logo/SMLU.png"
                    />
                    <span
                      v-if="item.carrier != 'TSHG' &&
                            item.carrier != 'MAEU' &&
                            item.carrier != 'ZIMU' &&
                            item.carrier != 'HLCU' &&
                            item.carrier != 'MSCU' &&
                            item.carrier != 'OOLU' &&
                            item.carrier != 'CMDU' &&
                            item.carrier != 'ONEY' &&
                            item.carrier != 'COSU'&&
                            item.carrier != 'SMLU'
                          " >{{ item.carrier }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <div>
                      <span> <br/></span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-descriptions style="box-shadow: none; margin:0px;"
                      :colon="false"
                    >
                    <el-descriptions-item label="">
                      <el-tag
                        style="margin-right: 5px;    font-size: 13px;"
                        v-for="container in item.containerDOList.filter((item) => item.type == 0)"
                        :key="container.id"
                      >{{ container.containerType }} x {{ container.numbers }}</el-tag
                      >
                    </el-descriptions-item>
                    </el-descriptions>
                  </el-col>
                </el-row>

              </el-col>
              <el-col :span="21" style="padding-top: 10px; padding-bottom: 10px;">
                  <el-descriptions style="box-shadow: none;"
                    :colon="false"
                    :column="5"
                  >
                    <el-descriptions-item label="Shipment Ref"> {{ item.bookingNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Booking Number">{{ item.shipmentBookingNumber }}</el-descriptions-item>
                    <el-descriptions-item label="BL Number">
                      {{ item.blNumber }}
                    </el-descriptions-item>

                    <el-descriptions-item label="Task Status">
                        <span @click="showTask(item,item.orderTaskDOS,index)" style="text-decoration: underline;cursor: pointer;">
                        {{ item.taskStatus }}
                        </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="" label-class-name="shipment-status-class">

                      <el-tag :type="
                    item.status==1?'danger':item.status==3?'danger':''
                    ">
                        {{showStatus(item)}}
                      </el-tag>
                    </el-descriptions-item>


                    <el-descriptions-item label="POR">
                      {{ item.pol }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('booking.pol')">{{
                      item.originPort
                      }}</el-descriptions-item>


                    <el-descriptions-item :label="$t('booking.pod')">{{
                      item.destinationPort
                      }}</el-descriptions-item>

                    <el-descriptions-item label="FND">
                      {{ item.pod }}
                    </el-descriptions-item>

                    <el-descriptions-item label="">
                    </el-descriptions-item>

                    <el-descriptions-item label="CRA Number">
                      {{ item.contractNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Payment Term">
                      {{ item.paymentTerm }}
                    </el-descriptions-item>

                    <el-descriptions-item label="ETD/ETA">
                      {{ item.etd?parseUTCTime(item.etd?item.etd:item.bookedEtd):'-'}}
                      /
                      {{ item.eta?parseUTCTime(item.eta?item.eta:item.bookedEta):'-'}}
                    </el-descriptions-item>
                    <el-descriptions-item label="ATD/ATA">
              {{ item.atd?parseUTCTime(item.atd):'-'}}
              /
              {{ item.ata?parseUTCTime(item.ata):'-'}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Carriage Contract">{{
                      item.contractType
                      }}</el-descriptions-item>

                    <el-descriptions-item label="BL Draft Cutoff">
                      {{ item.siCutOffDate?formattedTimeAfterSubtracting12Hours(item.siCutOffDate):'-'}}
                    </el-descriptions-item>

                    <el-descriptions-item label="VGM Cutoff">
                      {{ item.vgmCutOffDate?formattedTimeAfterSubtracting12Hours(item.vgmCutOffDate):'-'}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Booking Status">
                      <el-tag :type="(item.shipmentBookingNumber!=''&&item.shipmentBookingNumber!=null) ?'success':'warning'">
                        {{ item.status==2?"Requested":
                        (item.shipmentBookingNumber!=''&&item.shipmentBookingNumber!=null?'Confirmed':'Submited')
                        }}
                      </el-tag>

                    </el-descriptions-item>


                    <el-descriptions-item label="SI Status">
                      <el-tag :type="item.siDate!=null ?'success':'warning'">
                      {{ item.siDate!=null?'Confirmed':(item.containerDOList.filter(item=>item.type==4).length>0?"Submited":'Not submitted') }}
                      </el-tag>

                    </el-descriptions-item>

                    <el-descriptions-item label="VGM Status">
                      <el-tag :type="item.vgmDate!=null ?'success':'warning'">
                        {{ item.vgmDate!=null?'Confirmed':(item.shipmentVgmDOS.length>0?"Submited":'Not submitted') }}
                      </el-tag>

                    </el-descriptions-item>


                    <el-descriptions-item label="">
                      <div style="float: right">

                        <el-dropdown  style="position: absolute;cursor: pointer; right: 10px; top:0px"  size="mini" >
                          <el-button type="primary">
                            More<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="item.status + '' != '1'&&item.status + '' != '3'"
                            >
                              <el-link @click="updateShipment(item.id)"  :disabled="item.status!=2" >Update</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item >
                              <el-link @click="copyShipment(item.id)">Copy</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item  >
                              <el-link @click="openSI(item)" :disabled="item.shipmentBookingNumber==null||item.status==1||item.status==3">SI</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item >
                              <el-link @click="openVGM(item)" :disabled="item.shipmentBookingNumber==null||item.status==1||item.status==3">VGM</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item >
                              <el-link @click="openCancel(item.id)" :disabled="item.status != 2">Cancel</el-link>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>

                        <svg v-if="!expanded[item.id]" @click="toggleDetails(item.id)" style="position: absolute;cursor: pointer; right: 10px; top:35px" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36L12 24L24 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 36L24 24L36 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <svg v-if="expanded[item.id]" @click="toggleDetails(item.id)" style="position: absolute;cursor: pointer;right: 10px;top:35px " width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>

                      </div>
                    </el-descriptions-item>
                  </el-descriptions>

              </el-col>
              <div>
                <el-descriptions style="box-shadow: none;height: 100%; width: 100%;  margin-bottom: 20px;"
                                    :colon="false"
                                    :column="5">

                <el-descriptions-item label="">
                  <el-collapse-transition>
                    <div v-show="expanded[item.id]" style="width: 100%;">

                      <el-tabs @tab-click="handleClick(item,$tab, $event)"  :ref="'tab'+item.id" v-model="item.key">

                        <el-tab-pane label="Parties" :name="'Parties'+item.id">
                          <el-descriptions  title=""  direction="vertical"
                                           :colon="false"  :column="4"  style="box-shadow: none;"
                                            label-class-name="parties-label" content-class-name="parties-content">
                            <el-descriptions-item label="Shipper">{{ partiesMap[item.shipper]?partiesMap[item.shipper].name:'' }}</el-descriptions-item>
                            <el-descriptions-item label="Consignee">{{ partiesMap[item.consignee]?partiesMap[item.consignee].name:'' }}</el-descriptions-item>
                            <el-descriptions-item label="Notify Party">{{ partiesMap[item.notifyParty]?partiesMap[item.notifyParty].name:'' }}</el-descriptions-item>
                            <el-descriptions-item label="Agreement Party">{{ partiesMap[item.agreementParty]?partiesMap[item.agreementParty].name:'' }}</el-descriptions-item>
                          </el-descriptions>
                        </el-tab-pane>
                        <el-tab-pane label="Transport Leg" :name="'Transport Leg'+item.id">

<div>
  <div v-for="(task, index) in item.tempPlaces1"  class="self-step4"
    :class="[(task.transportMeanName!=null) ? 'self-step-solid4' : 'self-step-dotted4']"
    style="margin-right: 0px;position: relative;float: left;width:230px;height: 100px; ">
    <p>
      <span v-show="task.transportMode=='TRK'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
      <span v-show="task.transportMode==null" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
      <span v-show="task.transportMode=='SEA'||task.transportMode=='BRG'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
      <span v-show="task.transportMode=='RAI'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
      <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024"><path d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z" fill="#141414" p-id="1365"></path><path d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z" fill="#141414" p-id="1366"></path></svg>
      </span>
    <p style="display: inline-block;
      width: 220px;
      margin: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; ">
      <span class="title">
        <p style="margin:0px" v-if="task.code">{{ originDeliveryMap[task.code]? originDeliveryMap[task.code]: task.code }} </p>
        <p style="margin:0px" v-if="task.eta">{{ 'ETA:'+parseUTCTime(task.eta) }} </p>
        <p style="margin:0px" v-if="task.ata">{{ 'ATA:'+parseUTCTime(task.ata) }} </p>
        <p style="margin:0px" v-if="task.etd">{{ 'ETD:'+parseUTCTime(task.etd) }} </p>
        <p style="margin:0px" v-if="task.atd">{{ 'ATD:'+parseUTCTime(task.atd) }} </p>
        <p v-if="task.transportMeanName!=null" style="margin: 0px;width:150px;position: absolute;left: 160px;top: 0px; "><i class="el-icon-ship">
          </i>{{ task.transportMeanName+'/'+task.voyage }}
        </p>
      </span>
    </p>
    </p>
  </div>
</div>


                          <!-- <el-timeline >
                            <el-timeline-item
                              v-for="(router, index) in item.routerDOList"
                              :key="index"
                              :timestamp="parseTime(router.etd)+' / '+parseTime(router.eta)">
                              <p>{{router.pol}}</p>
                              <p>{{router.transportMeanName}}/{{router.voyage}}</p>
                              <p>{{router.pod}}</p>
                            </el-timeline-item>
                          </el-timeline> -->
                        </el-tab-pane>
                        <el-tab-pane label="Files" :name="'Files'+item.id">
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                  <span>Carrier Bill of Lading</span>
                                </div>
                                <el-empty v-show="item.cblFiles.length == 0" description="No Document"></el-empty>
                                <div v-for="file in item.cblFiles" class="text-upload" size="mini">
                                  <el-descriptions :colon="false" :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px">
                                    <el-descriptions-item :label="$t('document.name')">
                                      <el-link :href="file.url" :title="file.name"> <i
                                        class="el-icon-download" />{{ file.name }}</el-link>
                                    </el-descriptions-item>
                                    <el-descriptions-item
                                      :label="$t('document.uploadedOn')">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</el-descriptions-item>

                                  </el-descriptions>
                                </div>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                  <span>House Bill of Lading</span>
                                </div>
                                <el-empty v-show="item.houseBillFiles.length == 0" description="No Document"></el-empty>
                                <div v-for="file in item.houseBillFiles" class="text-upload" size="mini">
                                  <el-descriptions :column="1" label-class-name="file-item-label" style="box-shadow:none;">
                                    <el-descriptions-item :label="$t('document.name')">
                                      <el-link :href="file.url" :title="file.name"> <i
                                        class="el-icon-download" />{{ file.name }}</el-link>
                                    </el-descriptions-item>
                                    <el-descriptions-item
                                      :label="$t('document.uploadedOn')">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</el-descriptions-item>
                                  </el-descriptions>
                                </div>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                  <span>Others</span>
                                </div>
                                <el-empty v-show="item.othersFiles.length == 0" description="No Document"></el-empty>
                                <div v-for="file in item.othersFiles" class="text-upload" size="mini">
                                  <el-descriptions :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px;">
                                    <el-descriptions-item :label="$t('document.name')">
                                      <el-link :href="file.url" :title="file.name"> <i
                                        class="el-icon-download" />{{ file.name }}</el-link>
                                    </el-descriptions-item>
                                    <el-descriptions-item
                                      :label="$t('document.uploadedOn')">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</el-descriptions-item>
                                  </el-descriptions>
                                </div>
                              </el-card>
                            </el-col>
                          </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Comments" :name="'Comments'+item.id">
                          <div style="margin-bottom: 10px;text-indent: 20px;">
                            <el-button type="primary" @click="addComment(item, index)" >Add Comments</el-button>
                          </div>
                          <el-empty v-if="item.shipLogDOS.filter(item => item.type == '4').length == 0"></el-empty>
                          <el-timeline>
                            <el-timeline-item v-for="(item, i) in item.shipLogDOS.filter(item => item.type == '4')" :key="i"
                                              :timestamp="parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" placement="top">
                              <el-card style="padding: 15px;">
                                <div class="htmldiv" v-html="item.logInfo"></div>
                                <p>{{ item.email }}</p>
                              </el-card>
                            </el-timeline-item>
                          </el-timeline>
                        </el-tab-pane>

                      </el-tabs>

                    </div>
                  </el-collapse-transition>
                </el-descriptions-item>
              </el-descriptions>
              </div>


            </el-row>

          </div>
          <pagination
            :total="lineTotal"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[10, 20, 50]"
            @pagination="getPage"
          />

        </div>


        <transition name="el-zoom-in-center">
    <el-form :model="queryParams">
    <div v-loading="taskLoading" v-show="drawer2" class="transition-box" style="":style="{'height':(clientHeight)+'px'}">
      <el-row :gutter="20" style="padding-top:10px">
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
            <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ scope.row.possible }}</span>
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
            <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ scope.row.urgent }}</span>
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
            <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ scope.row.overdue }}</span>
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
            <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ scope.row.finished }}</span>
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
      <el-dialog style="margin-top: -30px!important;" destroy-on-close title="Shipping Instructions" v-if="siVisable" :visible.sync="siVisable" width="70%" append-to-body
      class="bg-g">
        <SI @after-submit="onAfterSubmit" :height="clientHeight" :shipment="shipment"></SI>
      </el-dialog>

      <el-dialog style="margin-top: -30px!important;" destroy-on-close title="Verified Gross Mass" v-if="vgmVisable" :visible.sync="vgmVisable" width="70%" append-to-body
      class="bg-g">
        <VGM @after-submit="onAfterSubmit" :height="clientHeight" :shipment="shipment"></VGM>
      </el-dialog>


      <!-- cancel booking 弹窗 begin-->
      <el-dialog :visible.sync="centerDialogVisible" width="50%" @close="closeCenterDialog">
        <div class="cancelBookingForm">

          <el-row>
            <el-col :span="12">
              <h5><b style="font-size: 15px">Cancel Reason</b></h5>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" placeholder="" @blur="cancelRemark = $event.target.value.trim()"
                        v-model="cancelRemark" size="mini" :rows="3" maxlength="1000" show-word-limit resize="none">
              </el-input>
            </el-col>
          </el-row>

          <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" style="margin-top: 20px; margin-bottom: 15px"
                     @click="cancelShipment()">Submit</el-button>
        </span>
        </div>
      </el-dialog>
      <!-- cancel booking 弹窗 end-->


      <el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
    <el-table
      :data="taskDetailData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Task Name"  width="150px">
        <template v-slot="scope">
          {{ scope.row.taskName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="MOOV Ref" width="150px">
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
    <div class="order" style="margin-bottom: 5px;">MOOV Ref:{{ h.orderNumber }}</div>
    <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>

    <div v-if="h.status==1&&h.taskName=='Inbound Order'&&h.jsonData!=null&&h.jsonData!=''&&JSON.parse(h.jsonData)!=null&&JSON.parse(h.jsonData).approveResult=='Failed'" >
      <div style="clear: both;"></div>
      <div class="date" style="margin-bottom: 5px;">Reject Reason：{{ JSON.parse(h.jsonData).reason }}</div>
    </div>

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

<el-dialog :title="title" width="600px" :visible.sync="departureConfirmFormVisible">
  <el-form :disabled=false :model="form" size="mini">
    <el-form-item label="Vessel departure confirm" label-width="180px">
      <el-date-picker
      v-model="form.eventTime"
      type="date"
      placeholder="Vessel departure confirm">
    </el-date-picker>
    </el-form-item>
  </el-form>
</el-dialog>
<el-dialog :title="title" width="600px" :visible.sync="arrivalConfirmFormVisible">
  <el-form :disabled=false :model="form" size="mini">
    <el-form-item label="Vessel arrival confirm" label-width="180px">
      <el-date-picker
      v-model="form.eventTime"
      type="date"
      placeholder="Vessel arrival confirm">
    </el-date-picker>
    </el-form-item>
  </el-form>
</el-dialog>


    </div>
  </template>
  <style src="@wangeditor/editor/dist/css/style.css"></style>
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


/deep/.el-table__footer-wrapper tbody td.el-table__cell{
  color: #004F7C;
}
/deep/.el-table .el-table__footer-wrapper .cell{
  color: #004F7C;
}


</style>
  <script>
import { shipperPage,
  cancelShipment,shipLogCreate,findShippingSchedulePortList} from "@/api/shipment/shipment";
import { getDeptList} from "@/api/system/dept";
import { i18nChangeLanguage } from '@wangeditor/editor'
import SI from "./commponents/si.vue";
import VGM from "./commponents/vgm.vue";
import { getUserProfile } from "@/api/system/user";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getTaskNames,updateTask,getTaskList,reminder } from "@/api/order/task";
import moment from "moment";
import { getOriginDeliveryList } from "@/api/system/originDelivery";

  export default {
    name: "Booking Order",
    components: {SI,VGM,Editor, Toolbar},
    data() {
      return {
        tableData:[],
        editorConfig: {
        placeholder: '...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
          uploadVideo: {
            customUpload(file, insertFn) {  // TS 语法
              file.arrayBuffer().then((buffer) => {
                // 处理 ArrayBuffer，可以根据需要转换为其他格式
                const uint8Array = new Uint8Array(buffer);

                // 将 Uint8Array 转换为字符串
                const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

                // 使用 btoa 将二进制字符串转换为 Base64
                const base64String = btoa(binaryString);
                insertFn('data:video/mp4;base64,' + base64String, '')
              }).catch((error) => {
                console.error("Error reading file:", error);
              });
              //
            }
          }
        }
      },
        editor:null,
        toolbarConfig: {
            excludeKeys: [
            'lineHeight',
            'fontFamily',
            'fontSize',
            'headerSelect',
            'codeBlock'
            ]
        },
        index:-1,
        clientHeight:null,
        queryParams:{
            pageNo: 1,
            pageSize: 10,
            shipmentBookingNumber:null,
            bookingNumber:null

        },
        lineTotal:0,
        loading:false,
        partiesMap:{},
        siVisable:false,
        vgmVisable:false,
        shipment:{},
        user:{},
        mode: 'default',
        html:'',
        commentsDialogVisible:false,
        portData:[],
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
        expanded: {},
        drawer2:false,
        hiddenTask:false,
        taskLoading: false,
        task3:[],
        task3Temp:[
          {'taskName':'Booking order submit','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'Booking order accept','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'Booking confirmation','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'SI draft by shipper','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'VGM draft by shipper','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'SI submit to carrie','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'VGM submit to carrie','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'Vessel departure confirm','possible':0,'urgent':0,'overdue':0,'finished':0},
          {'taskName':'Vessel arrival confirm','possible':0,'urgent':0,'overdue':0,'finished':0},
        ],
        centerDialogVisible: false,
        cancelRemark:null,
        shipmentId:null,
        taskDetailDataVisible:false,
        taskDetailData:[],
        title: "",
        departureConfirmFormVisible:false,
        arrivalConfirmFormVisible:false,
        taskList:[],
        drawer:false,
        form:{},
        originDeliveryMap: {},



      };
    },
    mounted() {
        if(this.$route.query.moovref != null){
            this.queryParams.bookingNumber = this.$route.query.moovref;
        }
        getUserProfile().then(response => {
            this.user = response.data;
        });
        var clientHeight = document.documentElement.clientHeight;
        this.clientHeight=clientHeight-250
        this.getPage()
        this.findShippingSchedulePortList();
        this.getPortList()
    },
    methods: {
      getPortList() {
        getOriginDeliveryList().then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name);
          }
        });
      },
        formattedTimeAfterSubtracting12Hours (val) {
          // 使用 Moment.js 将时间戳转换为 Moment 对象
          const momentDate = moment(val);
          // 减12小时
          const adjustedDate = momentDate.subtract(12, 'hours');
          // 格式化日期并返回
          return adjustedDate.format('YYYY-MM-DD HH:mm');
        },
        closeCenterDialog() {

        },
        openCancel(id){
          this.centerDialogVisible = true
          this.shipmentId = id
        },
        cancelShipment() {
          if (!this.cancelRemark || this.shipmentId == null) {
            this.$notify({
              type: "warning",
              message: "Please fill in Cancel Reason for cancellation!",
            });
            return;
          }

          var reqDto = {
            cancelRemark: this.cancelRemark,
            id: this.shipmentId,
            status: 1,
            shipper: true,
          };
          cancelShipment(reqDto).then((response) => {
            this.centerDialogVisible = false;
            this.$notify({
              title: "success",
              message: "Cancel success",
              type: "success",
            });
            this.getPage()
          });
        },
        taskDetails(row,status){
          this.taskDetailDataVisible=true
          this.taskDetailData=row[status+'data']
          this.title=row.taskName+" "+status
        },
        getTaskNames(){
          this.taskLoading = true
          getTaskNames({type:'1'}).then((res)=>{
            this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
            this.taskNames=res.data
            this.task3=this.task3.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
            this.overview()
          })
        },
    overview(){

      getTaskList({status:1,statuskey:'Possible',source:'booking-order',bookingNumber:this.queryParams.bookingNumber,shipmentStatus:this.queryParams.status,
      shipmentBookingNumber:this.queryParams.shipmentBookingNumber,originPort:this.queryParams.originPort,
      }).then((res)=>{
        this.possibleList=res.data
        this.setData(res,'possible')
      })
      getTaskList({status:1,statuskey:'Urgent',source:'booking-order',bookingNumber:this.queryParams.bookingNumber,shipmentStatus:this.queryParams.status,
      shipmentBookingNumber:this.queryParams.shipmentBookingNumber,originPort:this.queryParams.originPort,
      }).then((res)=>{
        this.urgentList=res.data
        this.setData(res,'urgent')
      })
      getTaskList({status:1,statuskey:'Overdue',source:'booking-order',bookingNumber:this.queryParams.bookingNumber,shipmentStatus:this.queryParams.status,
      shipmentBookingNumber:this.queryParams.shipmentBookingNumber,originPort:this.queryParams.originPort,
      }).then((res)=>{
        this.overdueList=res.data
        this.setData(res,'overdue')
      })
      getTaskList({status:2,source:'booking-order',source:'booking-order',bookingNumber:this.queryParams.bookingNumber,shipmentStatus:this.queryParams.status,
      shipmentBookingNumber:this.queryParams.shipmentBookingNumber,originPort:this.queryParams.originPort,
      }).then((res)=>{
        this.finishedList=res.data
        this.setData(res,'finished')
        this.taskLoading = false
      })
    },
    setData(res,key){
      for(var task of this.task3) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var i=0;i<res.data.length;i++){
          {
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
    showTask(item,list,index){
      if(item.status==1||item.status==3) {
        return
      }
        console.log(list)
        console.log(index)
      this.orderIndex=index
      this.drawer=true
      this.taskList=list
      if(list.length>0){
        this.title=list[0].orderNumber
      }
    },

        toggleDetails(index) {
          this.$set(this.expanded, index, !this.expanded[index]);
        },
        showTStatus(data) {
          if(data.status==1){
            return 'Cancel'
          }
          if(data.status==3){
            return 'Deactivate'
          }
          if(data.shipmentContainerStatusDOS.length>0){

            var move=data.shipmentContainerStatusDOS[data.shipmentContainerStatusDOS.length-1]
            if(data.carrier=='TSHG'){

              return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
            }else{
              return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
            }
          } else {
            return data.taskStatus
          }
        },
        showStatus(data) {
          if(data.status==1){
            return 'Cancel'
          }
          if(data.status==3){
            return 'Deactivate'
          }
          if(data.status==2){
            return 'Booking Requested'
          }
          if(data.status==4){
            return 'SI Requested'
          }
          if(data.shipmentContainerStatusDOS.length==0){
            function compare(){
              return function(a,b){
                  var value1 = a["status"];
                  var value2 = b["status"];
                  return parseInt(value1) - parseInt(value2);
              }
            }
            var arr=JSON.parse(JSON.stringify(data.shipmentDetailDOS)).filter(item=>item.endDate!=null)
            arr.sort(compare())
            if(arr.length>0){
              return this.otherMilestones[arr[arr.length-1].status]
            }
            return 'Created'

          }
          if(data.shipmentContainerStatusDOS.length>0){

            var move=data.shipmentContainerStatusDOS[data.shipmentContainerStatusDOS.length-1]
            if(data.carrier=='TSHG'){

              return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
            }else{
              return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
            }
          }
          return 'Created'
        },
        findShippingSchedulePortList() {
        findShippingSchedulePortList(this.searchData).then((response) => {
            this.portData = response.data;
        });
        },
        onCreated(editor) {
            i18nChangeLanguage('en')
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        addComment(row,index){
            this.shipment=row
            this.html=''
            this.index=index
            this.commentsDialogVisible = true
        },
        shipLogCreate() {
            if (this.html.trim() == '') {
                this.$notify({
                message: ' please fill content',
                type: 'warning'
                });
            } else {
                var data = {
                logInfo: this.html,
                email: this.user.email,
                type: 4,
                shipmentId: this.shipment.id
                }
                shipLogCreate(data).then((res) => {
                    this.html = ''
                    this.commentsDialogVisible = false
                    this.tableData[this.index].shipLogDOS.push(res.data)
                })
            }
        },
        handleClick(row,tab, event){
        },
        updateShipment(id){
            this.$router.push('/shipment/update?id='+id+'&source=booking-order');
        },
        copyShipment(id){
            this.$router.push('/shipment/copy?id='+id+'&source=booking-order');
        },
        createShipment(){
            this.$router.push('/shipment/create?carrier=TSHG'+'&source=booking-order');
        },
        onAfterSubmit(){
            this.siVisable=false
            this.vgmVisable=false

            this.getPage()
        },
        openSI(row){
            this.shipment=row
            this.siVisable=true
        },
        openVGM(row){
            this.shipment=row
            this.vgmVisable=true
        },
        getPage(){
            this.loading = true;
            this.getTaskNames()
            shipperPage(this.queryParams).then((response) => {
                this.expanded = {};
                var ids=[]
                for(var i=0;i<response.data.list.length;i++){
                    //默认的tab
                    response.data.list[i].key='Parties'+response.data.list[i].id
                    if(ids.indexOf(response.data.list[i].shipper)==-1){
                        ids.push(response.data.list[i].shipper)
                    }
                    if(ids.indexOf(response.data.list[i].consignee)==-1){
                        ids.push(response.data.list[i].consignee)
                    }
                    if(ids.indexOf(response.data.list[i].notifyParty)==-1){
                        ids.push(response.data.list[i].notifyParty)
                    }
                    if(ids.indexOf(response.data.list[i].agreementParty)==-1){
                        ids.push(response.data.list[i].agreementParty)
                    }
                    var shipment = response.data.list[i]
                    var tempPlaces1 = []
                    for (var index = 0; index < shipment.routerDOList.length; index++) {
                      var item = shipment.routerDOList[index]
                      var item1 = {};
                      item1.code = item.pol
                      item1.transportMeanName = item.transportMeanName
                      item1.voyage = item.voyage
                      item1.transportMode = item.transportMode
                      item1.etd = item.etd
                      tempPlaces1.push(item1);
                      if(index==0) {
                        item1.etd = shipment.etd
                        item1.atd = shipment.atd
                      }

                      var item2 = {};
                      item2.code = item.pod
                      item2.transportMode = item.transportMode
                      item2.eta = item.eta
                      tempPlaces1.push(item2);
                      if(index==shipment.routerDOList.length-1) {
                        item2.eta = shipment.eta
                        item2.ata = shipment.ata
                      }
                    }
                    shipment.tempPlaces1 = tempPlaces1
                }
                if(ids.length>0) {
                    this.getDeptList(ids)
                }
                this.tableData = response.data.list;
                this.lineTotal = response.data.total;
                this.loading = false;
            });
        },
        getDeptList(ids) {
            this.partiesMap={}
            getDeptList({ ids: ids.join(",") }).then((response) => {
                for (var i = 0; i < response.data.length; i++) {
                    this.$set(this.partiesMap, response.data[i].id, response.data[i]);
                }
            });
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
                message: 'success',
                type: 'success'
                });
            })
        },
        toOrder2(orderNumber){
      this.taskDetailDataVisible=false
      this.drawer2=false
      this.$set(this.queryParams, "bookingNumber", orderNumber)
      this.getPage()
    },
    handleTask(task){
      this.view=false
      this.task=task
      this.form={}
      //this.title=task.orderNumber+'['+task.taskName+']'
      if(task.taskName=='Update Cargo Handover Date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='QC Approve'){
        this.qcFormVisible=true
      }else if(task.taskName=='Booking Order'){
        this.bookingFormVisible=true
        getListByCondition({orderId:task.orderId}).then((res)=>{
          this.itemList=res.data
        })
      }else if(task.taskName=='Validate shipper booking'){
        this.$router.push("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId);
      }else if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/create?ids="+JSON.parse(task.jsonData).bookingId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        this.$router.push("/shipment/clp/add?shipmentId="+JSON.parse(task.jsonData).shipmentId+'&bookingNumber='+JSON.parse(task.jsonData).bookingNumber);
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Departure'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/Hbl?shipmentId="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Arrival'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Empty Return'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
        this.showInboundPopup = true;
      }else if(task.taskName=='Booking order accept'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Booking confirmation'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Vessel departure confirm'){
        this.departureConfirmFormVisible=true
      }else if(task.taskName=='Vessel arrival confirm'){
        this.arrivalConfirmFormVisible=true
      }else if(task.taskName=='SI draft by shipper'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openSI(first)
      }else if(task.taskName=='VGM draft by shipper'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openVGM(first)
      }else if(task.taskName=='SI submit to carrier'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openSI(first)
      }else if(task.taskName=='VGM submit to carrier'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openVGM(first)
      }
    },
    viewQcResult(task){

      this.qcFormVisible=true
      this.view=true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form=JSON.parse(task.jsonData)
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
    },
    viewTask(task){
      this.view=true
      this.task=task
      //this.title=task.orderNumber+'['+task.taskName+']'
      if(task.jsonData!=null&&task.jsonData!='') {
        this.form=JSON.parse(task.jsonData)
      }
      if(task.taskName=='Update Cargo Handover Date'){
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
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
        this.showInboundPopup = true;
      }else if(task.taskName=='Booking confirmation'){
        this.$router.push("/shipment/detail?id="+task.orderId);
      }else if(task.taskName=='Vessel departure confirm'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Vessel departure confirm', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Vessel arrival confirm'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Vessel arrival confirm', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Booking order accept'){
        this.taskDetailDataVisible = false
        this.drawer2 = false
        this.hiddenTask = false
        this.queryParams.bookingNumber = task.orderNumber;
        this.getPage()
      }else if(task.taskName=='SI draft by shipper'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openSI(first)
      }else if(task.taskName=='VGM draft by shipper'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openVGM(first)
      }else if(task.taskName=='SI submit to carrier'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openSI(first)
      }else if(task.taskName=='VGM submit to carrier'){
        this.drawer = false
        let matched = this.tableData.filter(item => item.id == task.orderId);
        const first = matched[0];
        this.openVGM(first)
      }




    },
    submitTask(){
      if(this.task.taskName=='Booking Order'){

      }else{
        if(this.task.taskName=='Vessel departure confirm'||this.task.taskName=='Vessel arrival confirm'){
          this.form.shipmentId = this.task.orderId
        }
        this.task.jsonData=JSON.stringify(this.form)
        updateTask(this.task).then((res)=>{
          this.crdFormVisible=false
          this.inspectionFormVisible=false
          this.qcFormVisible=false
          this.pickupFormVisible=false
          this.containerStuffingFormVisible=false
          this.customClearanceFormVisible=false
          this.departureConfirmFormVisible=false
          this.arrivalConfirmFormVisible=false
          this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId)
          this.getPage()
        })

      }

    },

    },
  };
  </script>
  <style>
  .booking-order .el-empty__description{
    margin-top: 0px!important;
    margin-bottom: 10px!important;
  }
  .booking-order .el-empty__image{
    width: 60px!important
  }
  .booking-order .el-empty{
    padding: 0px;
  }
  .text-upload {
  padding-top: 5px;
  margin: 10px;
  border: 1px solid #ddd;
  display: flex;
  /* 启用 Flexbox 布局 */
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row-reverse;
}
.htmldiv video {
  width: 400px !important;
  height: 303px !important;
}
  .app-container.booking-order .partyLogo {
    position: relative;
    top: 23px;
    margin-left: 20px;
  }
span.el-descriptions-item__label.shipment-status-class {
    margin: 0;
}
.el-tag.el-tag--warning {
    background-color: #faecd8;
    border-color: #fff1cc;
    color: #e67f00;
}
.el-tag.el-tag--success {
    background-color: #e7faf0;
    border-color: #d0f5e0;
    color: #0b951c;
}
    .parties-content{
      width:24%;
      padding: 0px !important;
      margin: 0px !important;
      margin-left: 5px !important;
    }
    .parties-label{
      width:24%;
      padding: 0px !important;
      margin: 0px !important;
    }

    .self-step5:not(:first-child):before {
  width: 90px;
  height: 2px;
  position: absolute;
  left: 0px;
  content: "";
  top: 15px;
  text-align: left;
  border-top: 4px dotted #dbdbdb;
}
.self-step5:not(:first-child):after {
  height: 100px;
  width: 2px;
  position: absolute;
  left: 0px;
  content: "";
  top: -90px;
  text-align: left;
  border-left: 4px dotted #dbdbdb;
}

.self-step5:first-child:before {
  width: 180px;
  height: 2px;
  position: absolute;
  left: -90px;
  content: "";
  top: 15px;
  text-align: left;
  border-top: 4px dotted #dbdbdb;
}
.self-step4 {
  text-align: center;
  margin-top: 40px;
}
.self-step4:not(:last-child):before {
  width: 180px;
  height: 2px;
  position: absolute;
  left: 140px;
  content: "";
  top: 15px;
  text-align: left;
  border-top: 4px solid #dbdbdb;
}

.self-step-solid4:not(:last-child):before {
  border-top: 4px solid #dbdbdb;
}
.self-step-dotted4:not(:last-child):before {
  border-top: 4px dotted #dbdbdb;
}

</style>
