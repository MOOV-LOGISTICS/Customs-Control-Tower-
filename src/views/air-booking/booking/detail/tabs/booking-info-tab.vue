<template>
    <div>
    <el-card style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px">
      <div><b style="font-size: 15px">Shipment Events</b></div>
      <br />

      <!-- Origin Events Sect ion -->
      <div style="margin-right: 0px;position: relative;float: left;width:50px;height: 100px; font-size: 14px;">
        Origin
      </div>

      <div style="min-width: 640px;max-width: 1600px; margin: 0 auto;text-align: center;box-shadow: none;">
        <div
          v-for="(task, index) in originEvent"
          :key="task.taskSeq"
          class="self-step3"
          :class="[task.statusValue == 'process' ? 'self-step-process1' : '' , task.statusValue == 'finish' ? 'self-step-finished1' : '' , task.statusValue == 'cancel' ? 'self-step-error1' : '' , task.statusValue == 'wait' ? 'self-step-pedding1' : '']"
          style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 90px;"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            popper-class="status-popover-css"
            trigger="hover"
            :popper-options="{boundariesElement: 'body', gpuAcceleration: false }"
          >
            <el-table
              style="max-height: 300px; overflow: auto;"
              :data="task.events ? task.events : []"
            >
              <el-table-column prop="eventTime" :label="task.eventName">
                <template v-slot="scope">
                  {{ parseUTCDate(scope.row.eventTime) }}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="eventTime" label="Event Time">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.eventTime) }}
                </template>
              </el-table-column>  -->
              <el-table-column prop="creatorName" min-width="120" label="User">
                <template v-slot="scope">
                  {{ scope.row.operator ? scope.row.operator : null }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" max-width="120" label="Create Time">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.updateTime ? scope.row.updateTime : null) }}
                </template>
              </el-table-column>
            </el-table>
            <div slot="reference">
              <p>
                <span
                  class="self-step2"
                  :class="[task.statusValue == 'process' ? 'self-step-process' : '' , task.statusValue == 'finish' ? 'self-step-finished' : '' , task.statusValue == 'cancel' ? 'self-step-error' : '' , task.statusValue == 'wait' ? 'self-step-pedding' : '']"
                >
                  {{ index + 1 }}
                </span>
                <p style="display: inline-block; width: 130px; padding-top: 8px; margin: 0px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <p class="title">{{ task.eventName }}</p>
                </p>
                <p>

                  <p v-if="task.eventCode === 'DEPARTURE_POL'">{{ (task.statusValue == 'finish' || task.statusValue == 'cancel') ? parseUTCTime(task.events && task.events.length > 0 ? task.events[0].eventTime : null) : '' }}</p>
                 <P v-else>{{ (task.statusValue == 'finish' || task.statusValue == 'cancel') ? parseUTCDate(task.events && task.events.length > 0 ? task.events[0].eventTime : null) : '' }}</P>
                  <el-button @click="originEdit(task,shipment)" v-if="showOriginEditBtn(task,shipment)" type="text">
                    <i class="el-icon-edit"></i> Edit
                  </el-button>
                </p>
              </p>
            </div>
          </el-popover>
        </div>
        <div style="clear:both"></div>
      </div>

      <!-- Destination Events Section -->
      <div style="margin-right: 0px;position: relative;float: left;width:50px;height: 10px; font-size: 14px;">
        Destination
      </div>

      <div style="min-width: 640px;max-width: 1600px; margin: 0 auto;text-align: center;box-shadow: none;">
        <div
          v-for="(task, index) in destinationEvent"
          :key="task.taskSeq"
          class="self-step3"
          :class="[task.statusValue == 'process' ? 'self-step-process1' : '', task.statusValue == 'finish' ? 'self-step-finished1' : '', task.statusValue == 'cancel' ? 'self-step-error1' : '', task.statusValue == 'wait' ? 'self-step-pedding1' : '']"
          style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 90px;"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            popper-class="status-popover-css"
            trigger="hover"
            :popper-options="{boundariesElement: 'body', gpuAcceleration: false }"
          >
            <el-table
              style="max-height: 300px; overflow: auto;"
              :data="task.events ? task.events : []"
            >
              <el-table-column prop="eventTime" :label="task.eventName">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.eventTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="creatorName" min-width="120" label="User">
                <template v-slot="scope">
                  {{ scope.row.operator ? scope.row.operator : null }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" max-width="120" label="Create Time">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.updateTime ? scope.row.updateTime : null) }}
                </template>
              </el-table-column>
            </el-table>
            <div slot="reference">
              <p>
                <span
                  class="self-step2"
                  :class="[task.statusValue == 'process' ? 'self-step-process' : '' , task.statusValue == 'finish' ? 'self-step-finished' : '' , task.statusValue == 'cancel' ? 'self-step-error' : '' , task.statusValue == 'wait' ? 'self-step-pedding' : '']"
                >
                  {{ index + 1 }}
                </span>
                <p style="display: inline-block;width: 130px;padding-top: 8px;margin: 0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                  <span class="title">{{ task.eventName }}</span>
                </p>
                <p>
                  <p>{{ (task.statusValue == 'finish' || task.statusValue == 'cancel') ? parseUTCTime(task.events && task.events.length > 0 ? task.events[0].eventTime : null) : '' }}</p>
                  <el-button @click="destinationEdit(task,shipment)" v-if="task.statusValue == 'process'" type="text">
                    <i class="el-icon-edit"></i>Edit
                  </el-button>
                </p>
              </p>
            </div>
          </el-popover>
        </div>
        <div style="clear:both"></div>
      </div>
    </el-card>

    <!-- Booked Schedule Route -->
    <el-card style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px;">
      <div><b style="font-size: 15px">Booked Schedule Route</b></div>
      <br />
      <div style="margin: 0 auto;text-align: center;">
        <div>
          <div
            v-for="(task, index) in routerList"
            class="self-step4"
            :key="task.id"
            :class="stepClass(index)"
             style="margin-right: 0px;position: relative;float: left;width:260px;height: 100px;"
          >
            <p>
              <span v-if="task.transportMode" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                <img :src="getTransportIcon(task.transportMode)" alt="" class="transport-icon" />
              </span>
              <p style="display: inline-block; width: 260px; margin: 0px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <span class="title">
                  <el-popover
                    placement="bottom-start"
                    width="550"
                    popper-class="status-popover-css"
                    trigger="hover"
                  >
                    <el-table
                      style="max-height: 300px; overflow: auto;border-bottom: none !important;"
                      :data="task.eventTimeLogDTOS"
                    >
                      <el-table-column prop="fieldType" width="80"  label="Event Type">
                        <template v-slot="scope">{{ scope.row.fieldType.toUpperCase() }}</template>
                      </el-table-column>
                      <el-table-column prop="eventDate" width="120" label="Event Date">
                        <template v-slot="scope">{{ parseUTCTime(scope.row.eventTime) }}</template>
                      </el-table-column>
                      <el-table-column prop="creatorName" width="180" label="User">
                        <template v-slot="scope">{{ scope.row.operator }}</template>
                      </el-table-column>
                      <el-table-column prop="createTime" width="130" label="Create Time">
                        <template v-slot="scope">{{ parseUTCTimeWithHM(scope.row.createTime) }}</template>
                      </el-table-column>
                    </el-table>
                    <div slot="reference">
                      <p style="margin:0px">{{ task.carrier }}</p>
                    <div v-if="index % 2 === 0">
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.bookedEtd">
                          {{ 'Booked ETD:' + parseUTCTime(task.bookedEtd) }}
                        </p>
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.etd">
                          {{ 'ETD:' + parseUTCTime(task.etd) }}
                        </p>
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.atd">
                          {{ 'ATD:' + parseUTCTime(task.atd) }}
                        </p>
                      </div>
                       <div v-if="index % 2 !== 0">
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.bookedEta">
                          {{ 'Booked ETA:' + parseUTCTime(task.bookedEta) }}
                        </p>
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.eta">
                          {{ 'ETA:' + parseUTCTime(task.eta) }}
                        </p>
                        <p style="margin:0px; text-align: left; position: relative;left: 50px;" v-if="task.ata">
                          {{ 'ATA:' + parseUTCTime(task.ata) }}
                        </p>
                      </div>
                    </div>
                  </el-popover>
                  <span>{{ task.pol }}</span>
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    popper-class="status-popover-css"
                    trigger="hover"
                  >
                    <!-- <el-table :data="task.eventTimeLogDTOS">
                      <el-table-column prop="vesselName" max-width="150" label="Vessel Name">
                        <template v-slot="scope">{{ scope.row.vesselName }}</template>
                      </el-table-column>
                      <el-table-column prop="voyage" max-width="150" label="Voyage">
                        <template v-slot="scope">{{ scope.row.voyage }}</template>
                      </el-table-column>
                      <el-table-column prop="createTime" max-width="350" label="Date">
                        <template v-slot="scope">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</template>
                      </el-table-column>
                      <el-table-column prop="creator" width="180" label="User"></el-table-column>
                    </el-table> -->
                    <p
                      v-if="index % 2 == 0 && task.transportMode === 'SEA'"
                      slot="reference"
                      :class="{ 'highlight': false }"
                      style="margin: 0px; width: 150px; position: absolute; left: 180px; top: -10px; white-space: normal; cursor: pointer;"
                    >
                      {{ task.vessel }}<br>{{ task.voyage }}
                    </p>
                    <p
                      v-if="index % 2 == 0 && task.transportMode === 'AIR'"
                      slot="reference"
                      :class="{ 'highlight': false }"
                      style="margin: 0px; width: 150px; position: absolute; left: 180px; top: -20px; white-space: normal; cursor: pointer;"
                    >
                      {{ task.carrier }}<br>{{ task.flight }}
                    </p>
                  </el-popover>
                </span>
              </p>
            </p>
          </div>
        </div>

        <div  style="padding-left: 200px;">
        <el-button v-if="shipment.status !==9" @click="addEventTime" type="primary">Event Time</el-button>
      </div>
      </div>


    </el-card>
       <el-card
          style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px;border-radius: 10px;">
          <div><b style="font-size: 15px">Actual Schedule Route</b></div>
          <br />

          <div style="min-width: 640px;max-width: 2000px; margin: 0 auto;text-align: center;box-shadow: none; ">
            <div v-for="(task, index) in tempPlacesShow" class="self-step4"
              :class="[(task.transportMeanName!=null) ? 'self-step-solid4' : 'self-step-dotted4']"
              style="margin-right: 0px;position: relative;float: left;width:260px;height: 100px;">
              <p>
                <span v-show="task.transportMode=='TRK'" part="icon-wrapper" class="mc-icon  size-24 "
                  style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode==null" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg
                    part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24">
                    <path
                      d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode=='SEA'||task.transportMode=='BRG'" part="icon-wrapper" class="mc-icon size-24"
                  style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode=='RAI'" part="icon-wrapper" class="mc-icon size-24"
                  style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
                  <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="1024" height="1024">
                    <path
                      d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z"
                      fill="#141414" p-id="1365"></path>
                    <path
                      d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z"
                      fill="#141414" p-id="1366"></path>
                  </svg>
                </span>
              <p style="display: inline-block;  width: 220px;  margin: 0px;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis; ">
                <span class="title">
                  <p style="margin:0px" v-if="task.code">{{ originDeliveryMap[task.code]? originDeliveryMap[task.code]:
                    task.code
                    }} </p>
                  <p style="margin:0px" v-if="task.eta">{{ 'ETA:'+parseUTCTime(task.eta) }} </p>
                  <p style="margin:0px" v-if="task.ata">{{ 'ATA:'+parseUTCTime(task.ata) }} </p>
                  <p style="margin:0px" v-if="task.etd">{{ 'ETD:'+parseUTCTime(task.etd) }} </p>
                  <p style="margin:0px" v-if="task.atd">{{ 'ATD:'+parseUTCTime(task.atd) }} </p>


                  <p v-if="task.vessel!=null&&index!=tempPlacesShow.length-1"
                    style="margin: 0px;width:180px;position: absolute;left: 160px;top: -10px;white-space: pre-wrap;"><i
                      class="el-icon-ship">
                    </i>{{ task.vessel+'\n'+task.voyage }}
                  </p>
                </span>
              </p>
              </p>
            </div>
          </div>
        </el-card>

        <el-form  :model="shipment" ref="form" :show-message="false" label-width="200px">
          <el-descriptions style="box-shadow: none;padding:15px!important;background: #fff;border-radius: 10px;"
                           direction="vertical" :colon="false" :column="4">
            <template slot="title">
              <b style="font-size: 15px">Contact Info</b>
            </template>
            <el-descriptions-item :label="$t('booking.name')">
              {{ shipment.contactName }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.phone')">
              {{ shipment.contactPhone }}<br/>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.email')">
              {{ shipment.contactEmail }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions style="box-shadow: none;padding:15px!important;background: #fff;border-radius: 10px;"
                           direction="vertical" :colon="false" :column="4">
            <template slot="title">
              <b style="font-size: 15px">{{ $t("booking.involvedParties") }}</b>
            </template>
            <el-descriptions-item :label="$t('booking.shipper')" content-class-name="parties-item-css">
              <p> {{ partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].name : "" }}</p>
              <p> {{ partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].address : "" }}
              </p>
              <p> {{ partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].phone : "" }}
              </p>
              <p> {{ partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].fax : "" }}
              </p>
              <p>{{partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].email : ""}}
              </p>
              <p> {{ partiesMap[shipment.shipperPartyId] ? partiesMap[shipment.shipperPartyId].companyUsci : "" }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.consignee')" content-class-name="parties-item-css">
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].name : "" }}
              </p>
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].address : "" }}
              </p>
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].phone : "" }}
              </p>
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].fax : "" }}
              </p>
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].email : "" }}
              </p>
              <p> {{ partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].companyUsci : "" }}
              </p>
              <p>{{partiesMap[shipment.consigneePartyId] ? partiesMap[shipment.consigneePartyId].companyUsci : ""}}
              </p>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.notifyParty')" content-class-name="parties-item-css">
              <p> {{ partiesMap[shipment.notifyPartyId] ? partiesMap[shipment.notifyPartyId].name : "" }}
              </p>
              <p> {{ partiesMap[shipment.notifyPartyId] ? partiesMap[shipment.notifyPartyId].address : "" }}
              </p>
              <p> {{ partiesMap[shipment.notifyPartyId] ? partiesMap[shipment.notifyPartyId].phone : "" }}
              </p>
              <p> {{ partiesMap[shipment.notifynotifyPartyIdParty] ? partiesMap[shipment.notifyPartyId].fax : "" }}
              </p>
              <p>{{partiesMap[shipment.notifyPartyId]? partiesMap[shipment.notifyPartyId].email: ""}}
              </p>
              <p> {{ partiesMap[shipment.notifyPartyId] ? partiesMap[shipment.notifyPartyId].companyUsci : "" }}
              </p>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="Agreement Party" content-class-name="parties-item-css">
              <p> {{ partiesMap[shipment.agentPartyId] ? partiesMap[shipment.agentPartyId].name : "" }}
              </p>
              <p> {{ partiesMap[shipment.agentPartyId] ? partiesMap[shipment.agentPartyId].address : "" }}
              </p>
              <p>  {{  partiesMap[shipment.agentPartyId]  ? partiesMap[shipment.agentPartyId].phone  : ""  }}
              </p>
              <p> {{ partiesMap[shipment.agentPartyId] ? partiesMap[shipment.agentPartyId].fax : "" }}
              </p>
              <p> {{ partiesMap[shipment.agentPartyId] ? partiesMap[shipment.agentPartyId].email : "" }}
              </p>
              <p> {{ partiesMap[shipment.agentPartyId] ? partiesMap[shipment.agentPartyId].companyUsci : "" }}
              </p>
            </el-descriptions-item> -->
            <!-- <el-descriptions-item label="Customer" v-if="shipment.customer!=null">
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].name
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].address
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].phone
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].fax
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].email
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer] ? partiesMap[shipment.customer].companyUsci : ""
                }}
              </p>
            </el-descriptions-item> -->
          </el-descriptions>

        </el-form>

      <add-event-time-dialog ref="addEventTimeDialog"   :visible.sync="showAddEventDialog" :data="eventData" @submit="handleSubmit"></add-event-time-dialog>
      <update-event-dialog ref="updateEventDialog"  :visible.sync="showUpdateEventDialog" :eventCode="eventCode" :form="eventForm" @submit="handleSubmitEvent"></update-event-dialog>
    </div>
</template>

<script>

import{detail,updateEventTime,confirmation,departurePol,cancel,update,arrivalPod} from '@/api/air/booking'
import addEventTimeDialog from "../components/add-event-time-dialog.vue";
import { getDeptList, listDept } from "@/api/system/dept";
import UpdateEventDialog from '../components/update-event-dialog.vue';

export default {
  name: 'BookingInfoTab',
  components: {addEventTimeDialog, UpdateEventDialog },
  props: {
    originEvent: {
      type: Array,
      default: () => []
    },
    destinationEvent: {
      type: Array,
      default: () => []
    },
    routerList: {
      type: Array,
      default: () => []
    },
    shipment: {
      type: Object,
      default: () => ({})
    },
    eventData: {
      type: Array,
      default: () => []
    }

  },
  data() {
  return {
    showAddEventDialog: false,
    tempPlacesShow: [],
    partiesMap: {},
    agentData: [],
    agentMap: [],
    showUpdateEventDialog: false,
    eventCode: "",
    eventForm: {
      bookingRef: "",
      dateValue: "",
    },
    };
  },

    mounted() {
    },

  computed: {
      stepClass() {
    return (index) => {
      if (this.routerList.length <= 2) {
        return 'self-step-dotted4';
      } else {
        return (index + 1) % Math.floor(this.routerList.length / 2) === 0 ? 'self-step-dotted4' : 'self-step-solid4';
      }
    };
  }
    },
    created() {
      localStorage.removeItem('refreshPoPage')
      this.getParty()
    },

  methods: {
     getParty() {
     this.getParties({ partyRole: "Shipper"});
     this.getParties({ partyRole: "Consignee"});
     this.getParties({ partyRole: "Notify Party"});
     this.getParties({ partyRole: "Agreement Party"});
     this.getParties({ partyRole: "Customer"});
     listDept({ partyRole: "Destination Agent"}).then((response) => {
       for (var i = 0; i < response.data.length; i++) {
         this.$set(this.agentMap, response.data[i].id, response.data[i]);
       }
       this.agentData = response.data
     });
      },
      getParties(obj) {
        var vm = this;
        listDept(obj).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.$set(vm.partiesMap, response.data[i].id, response.data[i]);
          }
          vm.$set(vm.parties, obj.partyRole, response.data == null ? [] : response.data);
        });
      },
      parseUTCTime(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}`  // 日期 + 时分
    },

        parseUTCDate(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day}`  // 日期 + 时分
      },



      parseTimeToZ1(timestamp) {
        if (!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      },


   getTransportIcon(mode) {
      const iconMap = {
        AIR: require('@/assets/logo/air.svg'),
        SEA: require('@/assets/logo/sea.svg'),
        RAI: require('@/assets/logo/rail.svg')
      };
      return iconMap[mode] || ''; // 默认返回空字符串
    },

    addEventTime(){
      console.log('update time')
      this.showAddEventDialog = true
      this.eventData = this.routerList
    },
    handleSubmit(value) {
      updateEventTime(value).then(response => {
        this.$message.success('Update Successful');
        this.showAddEventDialog = false
         this.$emit('refreshPage')
      }).catch(error => {
        this.$message.error('Update failed');
      });
      console.log('updateEventTime',value)
      // 更新eventTime 数据，
      // 刷新页面
    },
    handleSubmitEvent(value) {
      this.showUpdateEventDialog = false
      console.log('handleSubmitEvent', value)

      // 根据value中的eventCode 判断调用哪个接口
      // "DEPARTURE_POL" 调用departurePol接口
      // BOOKING_CONFIRMATION 调用confirmation接口
      if (value.eventCode === 'ARRIVAL_POD') {
        arrivalPod(value).then(response => {
          this.$message.success('Update Successful');
          this.$emit('refreshPage')
        }).catch(error => {
         this.$message.error('Update failed', error.message);
        });
        return
      }

      if (value.eventCode === 'DEPARTURE_POL') {
        departurePol(value).then(response => {
          this.$message.success('Update Successful');
          this.$emit('refreshPage')
        }).catch(error => {
         this.$message.error('Update failed', error.message);
        });
        return
      } 
      if (value.eventCode === 'BOOKING_CONFIRMATION') {
          confirmation(value).then(response => {
          this.$message.success('Update Successful');
          this.$emit('refreshPage')
      }).catch(error => {
        this.$message.error('Update failed', error.message);
      });
        return
      }


    },
    destinationEdit(task,shipment){
      console.log('destinationEdit', task)
      this.showUpdateEventDialog = true
      this.eventCode = task.eventCode
      // 将task.events 取最新的一条数据，将
      const latestEvent = task.events?.[0]; // 使用可选链操作符避免错误
      this.eventForm = {
        dateValue: this.parseTimeToZ1(latestEvent?.eventTime || ''),
        eventCode: task.eventCode,
        id: this.shipment.id
      };
       console.log('eventForm', this.eventForm)
    },
    originEdit(task,shipment) {
      console.log('originEdit', task)
      console.log('shipment', shipment)
      if(task.eventCode === 'SUBMIT_BOOKING'){
        // 弹框 Submit?
        this.$confirm('Are you sure to submit booking?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          shipment.status = 1;
          update(shipment).then(response => {
            this.$message.success('Update Successful');
            this.$emit('refreshPage')
          }).catch(error => {
            this.$message.error('Update failed');
          })
        })
          this.showUpdateEventDialog = false
        return
      }

      this.showUpdateEventDialog = true
      this.eventCode = task.eventCode
      // 将task.events 取最新的一条数据，将
      const latestEvent = task.events?.[0]; // 使用可选链操作符避免错误
      console.log('latestEvent', latestEvent)
      this.eventForm = {
        bookingRef: this.shipment.bookingRef,
        dateValue: latestEvent != undefined && latestEvent.eventTime ? latestEvent.eventTime : '',
        eventCode: task.eventCode,
        id: this.shipment.id
      };
         console.log(' this.eventForm',  this.eventForm)
    },
    showOriginEditBtn(task,shipment) {
      console.log('showOriginEditBtn', task)
       console.log('(task.taskCode == BOOKING_CONFIRMATION' && task.statusValue == 'finish)', task.eventCode == 'BOOKING_CONFIRMATION' && task.statusValue == 'finish')
      if(shipment.status == 9){
        return false
      }
      if(task.eventCode == 'BOOKING_CONFIRMATION' && task.statusValue == 'finish'){
        return true
      }
      if(task.eventCode === 'DEPARTURE_POL' && task.statusValue == 'finish'){
        return true
      }
      if(task.statusValue === 'process'){
        return true
      }
    }

    },
}
</script>



<style lang="scss" scoped>
.transport-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}

.el-loading-spinner {
  background-size: 100px 100px;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: relative;
}
 td.el-descriptions-item.el-descriptions-item__cell {
    text-align: center !important;
    vertical-align: middle !important;
}
.Red {
  color: #EA0000 !important;
}
.highlight {
  background-color: red;
  color: white;
}

/* 在全局或组件样式中添加 */
.status-popover-css {
  .el-table {
    border: none;

    &::before {
      height: 0;
    }

    td, th {
      border: none;
    }

    .el-table__row {
      &:after {
        display: none;
      }
    }
  }
}

/* 关键：防止页面因为滚动条出现/消失而抖动 */
html {
  overflow-y: scroll;
}

.modern-card {
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #f0f2f5;
}

/* 记录容器 */
.change-record {
  position: relative;
  padding: 0px 0 15px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.change-record:last-child {
  border-bottom: none;
}

/* 时间戳样式 */
.change-timestamp {
  position: absolute;
  left: 0;
  top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-text {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  white-space: nowrap;
}

.record-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容区域布局 */
.change-content-wrapper {
  margin-left: 50px;
  display: flex;
  align-items: stretch;
  gap: 24px;
}

/* 船期信息卡片 */
.vessel-info {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.original-info {
  border-left: 4px solid #94a3b8;
}

.new-info {
  border-left: 4px solid #10b981;
}

.info-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.info-title::before {
  content: '';
  width: 4px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
}

.original-info .info-title::before {
  background-color: #94a3b8;
}

.new-info .info-title::before {
  background-color: #10b981;
}

/* 信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  font-size: 13px;
}

.info-label {
  display: block;
  color: #64748b;
  margin-bottom: 4px;
  font-size: 12px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

/* 中间换船类型与原因区域 */
.change-middle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px;
}

.change-type-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.vessel-type {
  background-color: #dbeafe;
  color: #2563eb;
}

.route-type {
  background-color: #fef3c7;
  color: #d97706;
}

.change-reason-card {
  max-width: 280px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reason-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.reason-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.change-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}


/* 多船期列表容器 */
.multi-vessel-list {
  gap: 12px; /* 船期间距 */
  margin-top: 8px;
}

/* 单船期项样式 */
.vessel-item {
  padding: 10px;
  border-radius: 6px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
}

/* 紧凑信息网格（5列布局） */
.compact-grid {
  grid-template-columns: repeat(5, 1fr); /* 5列更紧凑 */
  gap: 8px; /* 减小内间距 */
}

/* 紧凑中间区域 */
.compact-middle {
  gap: 10px; /* 减小元素间距 */
  padding: 8px;
}

/* 紧凑化原因卡片 */
.compact-reason {
  padding: 10px; /* 减小内边距 */
  width: 200px; /* 限制宽度 */
  word-wrap: break-word;
  word-break: break-all;
}

.reason-title {
  font-size: 12px; /* 缩小标题 */
  margin-bottom: 4px;
}

.reason-content {
  font-size: 12px; /* 缩小内容 */
  line-height: 1.4;
}

/* 减小信息项尺寸 */
.info-item {
  font-size: 12px;
}

.info-label {
  font-size: 11px; /* 缩小标签 */
  margin-bottom: 2px;
}

/* 减小整体内边距 */
.change-records {
  padding: 12px; /* 原20px */
}

.vessel-info {
  padding: 12px; /* 原16px */
}

.info-title {
  font-size: 13px; /* 缩小标题 */
  margin-bottom: 8px;
}

/* 多船期容器样式 */
.multi-vessel-list {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 减小船期间距 */
  max-height: 200px; /* 限制最大高度 */
  overflow-y: auto; /* 超出滚动 */
  padding-right: 5px;
}

/* 单船期项紧凑样式 */
.vessel-item {
  padding: 8px; /* 减小内边距 */
  border-radius: 4px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

/* 超紧凑信息网格 */
.compact-grid {
  grid-template-columns: repeat(5, 1fr);
  gap: 5px; /* 极小网格间距 */
}

/* 极小化信息项 */
.info-item {
  font-size: 11px;
}

.info-label {
  font-size: 10px; /* 缩小标签文字 */
  color: #888;
  margin-bottom: 1px;
}

.info-value {
  font-weight: 500;
  line-height: 1.3;
}


/* 减小内容区边距 */
.change-content-wrapper {
  gap: 15px; /* 减小中间区域间距 */
  margin-left: 45px; /* 缩短左侧时间戳距离 */
}

/* 船期卡片进一步压缩 */
.vessel-info {
  padding: 10px; /* 最小内边距 */
  flex: 1;
}

.info-title {
  font-size: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

/* 滚动条美化（紧凑模式） */
.multi-vessel-list::-webkit-scrollbar {
  width: 4px;
}

.multi-vessel-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}
.no-data {
    height: 100px;
}
.parties-item-css {
    white-space: pre-line !important;
    vertical-align: top !important;
}
.tab-title {
  margin: 0 16px 0 0;
  font-size: 12px;
  font-weight: bold;
}
</style>

<style scoped>
  @charset "utf-8";

  body,
  html {
    font-size: 100%;
    padding: 0;
    margin: 0;
  }
  .negative-value {
    color: red;
  }
  .el-badge__content.is-fixed {
    right: 70px !important;
  }

  /* Reset */
  *,
  *:after,
  *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Clearfix hack by Nicolas Gallagher: http://nicolasgallagher.com/micro-clearfix-hack/ */
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }

  .tmff-css .el-collapse-item-title {
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0px !important;
      margin: 0px !important;
  }
  .el-descriptions__body{
      color: #004F7C;
    }
  .custom-select .el-input__inner {
    width: 200px;
  }

  .clearfix:after {
    clear: both;
  }

  body {
    font-weight: 500;
    font-size: 1.05em;
    font-family: figtree, "Microsoft YaHei", "Segoe UI", "Lucida Grande", Helvetica, Arial,
      sans-serif;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #909399 !important;
  }

  .demo {
    padding: 25px 0;
  }

  .upload-shipment-file {
    padding-bottom: 10px;
  }
  .self-step2{
    width: 20px;
    display: inline-block;
    height: 20px;
    border-radius: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-weight: 700;
    position: relative;
    z-index: 999;
  }
  .self-step3:not(:first-child):before {
    width: 160px;
    height: 6px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 7px;
    text-align: left;
  }
  .self-step-process1:not(:first-child):before{
    background:#63acd5;
  }
  .self-step-finished1:not(:first-child):before{
    background:#004F7C;
  }
  .self-step-pedding1:not(:first-child):before{
    background:#ddd;
  }
  .self-step-error1:not(:first-child):before{
    background:#F56C6C;
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
  .self-step4:not(:last-child):before {
    width: 220px;
    height: 2px;
    position: absolute;
    left: 150px;
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

  .self-step1:not(:first-child):before {
    width: 150px;
    height: 2px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 20px;
    text-align: left;
  }
  p{
    margin: 0px;
  }
  .scrollable-content {

    height: 460px;
    overflow-y: auto;
  }


  .main-timeline {
    width: 800px;
    margin: 0 auto;
    font-family: figtree, "Roboto", sans-serif;
  }

  .main-timeline:after {
    content: "";
    display: block;
    clear: both;
  }

  .main-timeline:before {
    content: "";
    height: 100%;
    width: 2px;
    border: 2px dashed #000;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
    top: 30px;
  }

  .file-css {
    width: 150px;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .main-timeline .timeline {
    width: 50%;
    padding: 100px 70px 0 25px;
    margin: 0 50px 0 0;
    float: left;
    position: relative;
  }

  .htmldiv video {
    width: 400px !important;
    height: 303px !important;
  }

  .main-timeline .timeline-content {
    padding: 5px 15px 5px 40px;
    border: 2px solid #004F7C;
    border-radius: 15px 0 15px 15px;
    display: block;
    position: relative;
  }

  .main-timeline .timeline-content:hover {
    text-decoration: none;
  }

  .main-timeline .timeline-content:after {
    content: "";
    background-color: #004F7C;
    height: 18px;
    width: 15px;
    position: absolute;
    right: -15px;
    top: -2px;
    clip-path: polygon(100% 0, 0 0, 0 100%);
  }

  .main-timeline .timeline-year {
    color: #fff;
    background-color: #004F7C;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    right: -90px;
    top: -85px;
  }

  .main-timeline .timeline-year:after {
    content: "";
    height: 70px;
    width: 70px;
    border: 8px solid #004F7C;
    border-left-color: transparent;
    border-radius: 50%;
    transform: translateX(-50%) translateY(-50%) rotate(-20deg);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .main-timeline .timeline-icon {
    color: #fff;
    background-color: #00a79b;
    font-size: 35px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -25px;
    transition: all 0.3s;
  }

  .main-timeline .title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    margin: 0 0 7px 0;
  }

  .main-timeline .description {
    color: #222;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: justify;
    margin: 0 0 5px;
  }

  .main-timeline .timeline:nth-child(even) {
    padding: 100px 25px 0 70px;
    margin: 0 0 0 50px;
    float: right;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content {
    padding: 5px 40px 5px 15px;
    border-radius: 0 15px 15px 15px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content:after {
    transform: rotateY(180deg);
    right: auto;
    left: -15px;
  }

  .w-e-textarea-video-container {
    background-image: none !important;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year {
    right: auto;
    left: -100px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year:after {
    transform: translateX(-50%) translateY(-50%) rotate(200deg);
  }

  .main-timeline .timeline:nth-child(even) .timeline-icon {
    left: auto;
    right: -25px;
  }

  .button-row {
    display: inline-flex;
    align-items: center;
  }

  @media screen and (max-width: 767px) {
    .main-timeline:before {
      display: none;
    }

    .main-timeline .timeline {
      width: 100%;
      padding-top: 80px;
      padding-right: 12px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline:nth-child(even) {
      padding-left: 10px;
      padding-top: 80px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline-content,
    .main-timeline .main-timeline .timeline:nth-child(even) .timeline-content {
      background-color: #fff;
      padding-top: 25px;
    }

    .main-timeline .timeline-content:after {
      display: none;
    }

    .main-timeline .timeline-year {
      font-size: 24px;
      line-height: 70px;
      height: 70px;
      width: 70px;
      right: 0;
      top: -65px;
    }


    .main-timeline .timeline-year:after {
      display: none;
    }

    .main-timeline .timeline:nth-child(even) .timeline-year {
      left: 3px;
    }

  }

  iframe * {
    font-family: figtree, 微软雅黑;
  }

  @media screen and (max-width: 567px) {
    .main-timeline .title {
      font-size: 18px;
    }
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

  .text-upload .tools-but {
    background: #ffffff;
  }

  .text-upload .tools-but span {
    font-size: 14px;
    margin-right: 10px;
    cursor: pointer;
  }

  .text-upload .el-descriptions {
    margin: 0;
    padding: 0px 10px 10px 10px !important;
    border: 0 !important;
    box-shadow: none;
  }
  .el-des-margin-top img.imgLogo {
    margin: 0;
    padding: 0;
    image-rendering: -webkit-optimize-contrast;
    width: 140px;
    height: 40px;
    top: 10px;
  }

  /* .avatar-container:hover .delete-button {
    display: block;
  } */
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
