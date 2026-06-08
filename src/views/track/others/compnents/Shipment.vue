<template>
  <div>
    <el-row style="text-align: center;">
      <el-col :span="3">
        <p>Carrier</p>
        <p>{{ row.carrier }}</p>
      </el-col>
      <el-col :span="3">
        <p>Booking Ref</p>
        <p>
          <el-link type="primary" target="_blank" :href="'/shipment/detail?id='+row.id">{{ row.bookingNumber }}</el-link>
        </p>
      </el-col>
      <el-col :span="3">
        <p>BL Number</p>
        <p>
          <el-link type="primary" @click="toTrack('blNumber',row.blNumber)">{{ row.blNumber }}</el-link>
        </p>
      </el-col>
      <el-col :span="3">
        <p>Booking Number</p>
        <p>
          <el-link type="primary" @click="toTrack('bookingNumber',row.shipmentBookingNumber)">{{ row.shipmentBookingNumber }}</el-link>
        </p>
      </el-col>
      <el-col :span="3">
        <p>Shipped From</p>
        <p>{{ row.pol }}</p>
      </el-col>
      <el-col :span="3">
        <p>Port of loading</p>
        <p>{{ row.originPort }}</p>
      </el-col>
      <el-col :span="3">
        <p>Port of discharge</p>
        <p>{{ row.destinationPort }}</p>
      </el-col>
      <el-col :span="3">
        <p>Shipped To</p>
        <p>{{ row.pod }}</p>
      </el-col>
    </el-row>
    <!-- <div v-if="row.containerDOList!=null&&row.containerDOList.length>0">
      <h2 style="color: #004F7C;">Containers</h2>
      <el-card style="padding: 0px;margin-bottom: 20px;position: relative;" v-for="container in row.containerDOList.filter((item) => item.type == 1)" v-show="!flag||(flag&&container.containerNo==containerNo)">
        <div style="    position: absolute;
    cursor: pointer;
    right: 0px;
    top: 20px;
    z-index: 999;">
          <svg
            v-if="!expanded[container.containerNo]"
            @click="toggleDetails(container.containerNo)"
            style="position: absolute;cursor: pointer;
    right: 20px;top:20px"
            width="30"
            height="30"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 36L12 24L24 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M36 36L24 24L36 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg
            v-if="expanded[container.containerNo]"
            @click="toggleDetails(container.containerNo)"
            style="position: absolute;cursor: pointer;right: 20px;top:20px"
            width="30"
            height="30"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M36 12L24 24L12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M36 24L24 36L12 24" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <el-row style="float: left;width: 50%;padding: 20px;margin: 0px;">
          <el-col :span="6">
            <p>Container</p>

            <p>
              <el-link type="primary" @click="toTrack('containerNo',container.containerNo)">{{ container.containerNo }}</el-link>
            </p>
          </el-col>
          <el-col :span="6">
            <p>Seal Number</p>
            <p>{{ container.containerSealNumber }}</p>
          </el-col>
          <el-col :span="6">
            <p>Type</p>
            <p>{{ container.containerType }}</p>
          </el-col>
          <el-col :span="6">
            <p>Lastest Move</p>
            <p>
              {{ row.shipmentContainerStatusDOS.length>0?
              originDeliveryMap[row.shipmentContainerStatusDOS[row.shipmentContainerStatusDOS.length-1].port]
              ?originDeliveryMap[row.shipmentContainerStatusDOS[row.shipmentContainerStatusDOS.length-1].port]
              :row.shipmentContainerStatusDOS[row.shipmentContainerStatusDOS.length-1].port
              :'-' }}
            </p>
          </el-col>
        </el-row>

        <el-row style="float: left;width: 50%;background: #0279ce;padding: 20px;margin: 0px;color: #fff;">
          <el-col :span="6">
            <p>Volume</p>
            <p>{{ row.containerMap?row.containerMap[container.containerNo]?row.containerMap[container.containerNo].volume.toFixed(3):'Not Load':'' }}</p>
          </el-col>
          <el-col :span="18">
            <p>Loaded Lots</p>
            <p>
              <el-link
                :href="'/order/POManagement?orderNumber='+row.orderMap[orderId]"
                style="color: #fff;margin-right: 15px;"
                v-for="(orderId,index) in row.containerMap?row.containerMap[container.containerNo]?row.containerMap[container.containerNo].orderIds:[]:[]"
              >{{ row.orderMap[orderId]+'(qty:'+ row.containerMap[container.containerNo].qtys[index] +',volume:'+row.containerMap[container.containerNo].cbms[index]+')' }}</el-link>

              <el-link
                :href="'/order/POManagement?orderNumber='+orderNumber"
                style="color: #fff;margin-right: 15px;"
                v-for="orderNumber in row.containerMap?row.containerMap[container.containerNo]?row.containerMap[container.containerNo].orderNumbers:[]:[]"
              >{{ orderNumber+'(qty:'+ row.qtyMap[orderNumber] +',volume:'+row.volumeMap[orderNumber]+')' }}</el-link>
            </p>
          </el-col>
        </el-row>
        <div style="clear: both;"></div>
        <el-collapse-transition>
          <div v-show="expanded[container.containerNo]">
            <el-row :gutter="30" style="font-size: 14px; color: #004F7C;padding: 20px;margin-left: 40px;">
              <el-col :span="6">Date</el-col>
              <el-col :span="6">Location</el-col>
              <el-col :span="6">Description</el-col>
              <el-col :span="6">Vessel/Voyage</el-col>
            </el-row>
            <el-timeline>
              <el-timeline-item v-for="move in row.shipmentContainerStatusDOS.filter(item=>item.containerNo==container.containerNo)" placement="top">
                <el-row :gutter="30" style="font-size: 13px; padding: 20px;">
                  <el-col :span="6">{{ parseTime(new Date(move.eventTime),'{y}-{m}-{d} {h}:{i}') }}</el-col>
                  <el-col :span="6">
                    <span style="display:inline-block;width:100px">{{ originDeliveryMap[move.port]?originDeliveryMap[move.port]:move.port }}</span>
                  </el-col>
                  <el-col :span="6">
                    <span v-if="row.carrier!='TSHG'">{{ containerStatus[move.eventCode]?containerStatus[move.eventCode]:move.descriptionEn }}</span>
                    <span v-if="row.carrier=='TSHG'">{{ containerStatus[move.eventCode]?containerStatus[move.eventCode]:move.eventCode }}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-link type="primary" :href="'/track/ship?vesselName='+ move.vessel " target="_blank">{{ move.vessel }}/{{ move.voyage }}</el-link>
                  </el-col>
                </el-row>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-collapse-transition>
      </el-card>
    </div>-->
  </div>
</template>

<style scoped>
p {
  margin: 12px;
}
</style>
<script>
export default {
  name: 'Shipment',
  components: {},
  props: {
    row: Object,
    originDeliveryMap: Object,
    containerNo: String
  },
  data() {
    return {
      expanded: {},
      flag: true,
      vesselMap: {},
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
      allMilestones: [
        {
          key: '0',
          label: 'Canceled',
          sync: true,
          hide: true
        },
        {
          key: '1',
          label: 'Draft',
          sync: true,
          hide: true
        },
        {
          key: '2',
          label: 'Submitted',
          sync: true,
          hide: true
        },
        {
          key: '3',
          label: 'Confirmed',
          sync: true,
          hide: true
        },
        {
          key: '5',
          label: 'Gate out Empty',
          sync: false,
          hide: true
        },
        {
          key: '6',
          label: 'Gate In Full',
          sync: false,
          hide: true
        },
        {
          key: '7',
          label: 'SI Submitted',
          sync: true,
          hide: true
        },
        {
          key: '8',
          label: 'Shipped',
          sync: false,
          hide: true
        },
        {
          key: '9',
          label: 'BL Issued(Rls)',
          sync: false,
          hide: true
        },
        {
          key: '10',
          label: 'Arrived LPOD',
          sync: false,
          hide: true
        },
        {
          key: '11',
          label: 'Departure LPOD',
          sync: false,
          hide: true
        },
        {
          key: '12',
          label: 'Arrived Inland Terminal',
          sync: false,
          hide: true
        },
        {
          key: '13',
          label: 'Departure Inland Terminal',
          sync: false,
          hide: true
        },
        {
          key: '14',
          label: 'Empty Returned',
          sync: false,
          hide: true
        }
      ]
    }
  },
  mounted() {
    if (!this.containerNo) {
      this.flag = false
    }
  },
  methods: {
    toTrack(type, searchKey) {
      this.$parent.toTrack(type, searchKey)
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index])
    }
  }
}
</script>
