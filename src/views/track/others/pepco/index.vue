<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-bottom: 40px;">
    <div style="width: 100%;padding-top: 20px;">
      <h1 style="border-bottom: 3px solid #004F7C;padding-bottom: 10px;width: 150px;margin: 0 auto;text-align: center;font-weight: 900;font-size: 30px;">Tracking</h1>
    </div>
    <el-form v-model="trackingForm">
      <div style="text-align: center;font-size: 18px!important;margin-top: 30px;">
        <el-radio-group v-model="trackingForm.type" @change="changeType">
          <el-radio label="order">Purchase Order</el-radio>
          <el-radio label="shippingOrder">Shipper Booking Ref</el-radio>
          <el-radio label="shipmentBookingNumber">MOOV Ref</el-radio>
          <el-radio label="bookingNumber">Booking Number</el-radio>
          <el-radio label="blNumber">BL Number</el-radio>
          <el-radio label="containerNo">Container No</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-bottom: 25px;margin-top: 30px;text-align: center;">
        <el-input v-model="trackingForm.searchKey" style="width: 50%;" placeholder="Search...">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button @click="track()" style="margin-left: 10px;" type="primary" :loading="loading">Track</el-button>
      </div>
    </el-form>
    <div v-if="type=='order'" style="padding: 0px 100px;">
      <el-empty v-if="!loading&&shipmentRes.id==null"></el-empty>
      <div v-if="shipmentRes.id!=null">
        <Shipment :originDeliveryMap="originDeliveryMap" :row="shipmentRes"></Shipment>
        <el-skeleton style="width: 100%" v-if="!shipmentRes.showIframe" :loading="trackMapLoading" animated>
          <template slot="template">
            <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          </template>
        </el-skeleton>
        <iframe v-if="shipmentRes.showIframe" style="width: 100%; height: 750px;" :src="shipmentRes.iframeUrl" frameborder="0" loading="lazy"></iframe>
      </div>
    </div>
    <div v-if="type=='shippingOrder'" style="padding: 0px 100px;">
      <el-empty v-if="!loading&&shipmentRes.id==null"></el-empty>
      <div v-if="shipmentRes.id!=null">
        <Shipment :originDeliveryMap="originDeliveryMap" :row="shipmentRes"></Shipment>
        <el-skeleton style="width: 100%" v-if="!shipmentRes.showIframe" :loading="trackMapLoading" animated>
          <template slot="template">
            <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          </template>
        </el-skeleton>
        <iframe v-if="shipmentRes.showIframe" style="width: 100%; height: 750px;" :src="shipmentRes.iframeUrl" frameborder="0" loading="lazy"></iframe>
      </div>
    </div>

    <div v-if="type=='containerNo'" style="padding: 0px 100px;">
      <el-empty v-if="!loading&&shipmentRes.id==null"></el-empty>
      <div v-if="shipmentRes.id!=null">
        <Shipment :originDeliveryMap="originDeliveryMap" :row="shipmentRes"></Shipment>
        <el-skeleton style="width: 100%" v-if="!shipmentRes.showIframe" :loading="trackMapLoading" animated>
          <template slot="template">
            <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          </template>
        </el-skeleton>
        <iframe v-if="shipmentRes.showIframe" style="width: 100%; height: 750px;" :src="shipmentRes.iframeUrl" frameborder="0" loading="lazy"></iframe>
      </div>
    </div>

    <div v-if="type=='bookingNumber'||type=='blNumber'||type=='shipmentBookingNumber'" style="padding: 0px 100px;">
      <el-empty v-if="!loading&&shipmentRes.id==null"></el-empty>
      <div v-if="shipmentRes.id!=null">
        <Shipment :originDeliveryMap="originDeliveryMap" :row="shipmentRes"></Shipment>
        <el-skeleton style="width: 100%" v-if="!shipmentRes.showIframe" :loading="trackMapLoading" animated>
          <template slot="template">
            <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          </template>
        </el-skeleton>
        <iframe v-if="shipmentRes.showIframe" style="width: 100%; height: 750px;" :src="shipmentRes.iframeUrl" frameborder="0" loading="lazy"></iframe>
      </div>
    </div>
  </div>
</template>
    <style scoped>
p {
  margin: 12px;
}
</style>
   <script>
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getPage, getList, trackByBookingNumber } from '@/api/shipment/shipment'
import { shipmentContainerList } from '@/api/shipment/shipment-container'
import { getHeaderPageForPepco } from '@/api/order/header'
import { getOrderShipmentPage, getOrderListShipmentPage } from '@/api/pepco/shipping-order'
import Shipment from '../compnents/Shipment.vue'
import { pepcoTracking } from '@/api/track/track'

export default {
  name: 'Others',
  components: {
    Shipment
  },
  data() {
    return {
      trackMapLoading: true,
      loading: false,
      type: '',
      trackingForm: {
        type: '',
        searchKey: ''
      },
      shipmentRes: {},
      originDeliveryMap: {}
    }
  },
  mounted() {
    this.trackingForm.type = 'order'
    if (this.$route.query.type) {
      this.trackingForm.type = this.$route.query.type
    }
    if (this.$route.query.searchKey) {
      this.trackingForm.searchKey = this.$route.query.searchKey
    }
    this.getPortList()
    console.log(this.loading)

    if (this.trackingForm.searchKey == '' || this.trackingForm.searchKey == undefined || this.trackingForm.searchKey == null) {
      return
    }
    this.trackData()
  },
  methods: {
    changeType() {
      this.type = ''
    },
    getPortList() {
      getOriginDeliveryList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name)
        }
      })
    },
    toOrder(po) {
      window.open('/order/POManagement?orderNumber=' + po)
    },
    toTrack(type, searchKey) {
      console.log(type)
      console.log(searchKey)
      this.trackingForm.type = type
      this.trackingForm.searchKey = searchKey
      this.track()
    },
    track() {
      console.log(this.loading)
      if (this.trackingForm.type == '' || this.trackingForm.type == undefined || this.trackingForm.type == null) {
        this.$message.warning('Please select tracking type')
        return
      }
      if (this.trackingForm.searchKey == '' || this.trackingForm.searchKey == undefined || this.trackingForm.searchKey == null) {
        this.$message.warning('Please enter tracking number')
        return
      }
      this.trackData()
    },
    trackOtherCarrier(shipment) {
      // if (shipment.carrier == 'TSHG') {
      //   return
      // }
      if (shipment.shipmentBookingNumber == null || shipment.shipmentBookingNumber == '' || shipment.shipmentBookingNumber == undefined) {
        this.$message.warning('No booking number')
        return
      }

      this.trackMapLoading = true
      var type = ''
      var dataReq = ''
      if (this.type == 'containerNo') {
        type = 'containerNo'
        dataReq = this.trackingForm.searchKey
      } else {
        type = 'bill'
        dataReq = shipment.shipmentBookingNumber
      }

      trackByBookingNumber({
        carrier: shipment.carrier,
        type: type,
        bookingNumber: dataReq
      }).then(res => {
        this.trackMapLoading = false
        if (res.data.statusCode == 20000) {
          if (type == 'containerNo') {
            shipment.iframeUrl =
              'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&containerNo=' +
              this.trackingForm.searchKey +
              '&carrierCode=' +
              res.data.data.result.carrier.code +
              '&showInfo=1&lang=en'
          } else {
            shipment.iframeUrl =
              'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&billNo=' +
              shipment.shipmentBookingNumber +
              '&carrierCode=' +
              res.data.data.result.carrier.code +
              '&showInfo=1&lang=en'
          }
          this.$set(shipment, 'showIframe', true)
          this.$set(shipment, 'iframeUrl', shipment.iframeUrl)

          console.log(shipment)
          var containers = res.data.data.result.containers
          for (var i = 0; i < containers.length; i++) {
            var container = shipment.containerDOList.filter(item => item.containerNo == containers[i].containerNo)
            if (container[0]) {
              var statusList = containers[i].status.filter(item => item.isEsti == 'N')
              if (statusList.length > 0) {
                container[0].lastestMove = statusList[statusList.length - 1].eventPlaceOrigin
              }
            }
          }
        }
      })
    },
    trackData() {
      this.shipmentRes = {}

      this.type = this.trackingForm.type
      this.loading = true

      if (this.trackingForm.type == 'order') {
        getHeaderPageForPepco({ orderNumber: this.trackingForm.searchKey }).then(response => {
          var data = response.data.list
          if (data.length > 0) {
            if (data[0].shipmentResList.length == 0) {
              this.$message.warning('No Data')
              this.loading = false
              return
            }
            for (var i = 0; i < data[0].shipmentResList.length; i++) {
              this.shipmentRes = data[0].shipmentResList[i]
              var row = data[0].shipmentResList[i]
              this.trackOtherCarrier(row)
              this.loading = false
            }
          } else {
            this.$message.warning('No Data')
            this.loading = false
          }
        })
      } else if (this.trackingForm.type == 'shippingOrder') {
        var queryParams = {
          type: 'shippingOrder',
          searchKey: this.trackingForm.searchKey
        }
        // 查找shipping order
        pepcoTracking(queryParams).then(response => {
          console.log('shipment', response.data)
          var data = response.data
          if (data != null) {
            this.shipmentRes = data
            this.trackOtherCarrier(data)
            this.loading = false
          } else {
            this.$message.warning('No Data')
            this.loading = false
          }
        })
      } else if (this.trackingForm.type == 'bookingNumber' || this.trackingForm.type == 'blNumber' || this.trackingForm.type == 'shipmentBookingNumber') {
        var data = {}
        if (this.type == 'bookingNumber') {
          data.shipmentBookingNumber = this.trackingForm.searchKey
        } else if (this.type == 'shipmentBookingNumber') {
          data.bookingNumber = this.trackingForm.searchKey
        } else {
          data.blNumber = this.trackingForm.searchKey
        }
        getPage(data).then(res => {
          if (res.data.list.length > 0) {
            this.shipmentRes = res.data.list[0]
            var row = res.data.list[0]
            this.trackOtherCarrier(row)
            this.loading = false
          } else {
            this.$message.warning('No Data')
            this.loading = false
          }
        })
      } else if (this.trackingForm.type == 'containerNo') {
        shipmentContainerList({ containerNo: this.trackingForm.searchKey }).then(res => {
          var shipmentIds = []
          for (var i = 0; i < res.data.length; i++) {
            shipmentIds.push(res.data[i].shipmentId)
          }
          if (shipmentIds.length > 0) {
            getList({ ids: shipmentIds.join(',') }).then(res => {
              for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i]
                this.shipmentRes = res.data[i]
                this.trackOtherCarrier(row)
              }
              this.loading = false
            })
          } else {
            this.$message.warning('No Data')

            this.loading = false
          }
        })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
