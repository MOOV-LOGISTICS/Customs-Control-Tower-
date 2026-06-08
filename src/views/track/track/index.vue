<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-card class="wait-task-user-box-card" style="padding: 20px;padding-top: 10px;" :style="{ height: height+'px' }">
      <div style="display: inline-flex;">
        <p style="font-size: 16px;    margin-top: 5px;">Tracking</p>
        <p style="color: rgb(190, 190, 190); padding-left: 18px; margin-top: 9px;">Select to track by Vessel or B/L or Container number.</p>
      </div>
      <!-- <el-tabs class="maps" tab-position="left" v-model="activeName"  :style="{ height: (height-50)+'px' }"> -->
      <el-tabs class="maps" v-model="activeName">
        <el-tab-pane label="Vessel" name="Vessel">
          <!-- <el-form :show-message="false" size='mini'  ref="queryForm1" :inline="true" label-width="100px">
            <el-form-item  label="" prop="name">
                <el-input v-model="vesselNumber" style="width:200px;"  placeholder="Vessel/Callsign/MMSI/IMO" clearable />
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="remote1">Track</el-button>
            </el-form-item>
          </el-form>-->
          <el-tooltip class="item-tabs" effect="light" placement="bottom-start" slot="label">
            <span slot="content">Enter Vessel name/Call sign/MMSI/IMO to track vessel</span>
            <span>Vessel</span>
          </el-tooltip>
          <div :style="{ height: (height-100)+'px' }" style="overflow-y: auto; overflow-x: hidden">
            <iframe style="width: 100%; height: calc(100% - 20px);" :src="srcUrl1" frameborder="0"></iframe>
          </div>
        </el-tab-pane>
        <el-tab-pane label="B/L or Container number" name="ShipmentContainer">
          <el-tooltip class="item-tabs" effect="light" placement="bottom-start" slot="label">
            <span slot="content">Enter BL number or container number for tracking</span>
            <span>B/L or Container number</span>
          </el-tooltip>
          <el-form :show-message="false" size="mini" ref="queryForm" :inline="true" label-width="100px">
            <el-form-item prop="carrierCode">
              <el-select filterable v-model="carrierCode" placeholder="Carrier">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="data">
              <el-select filterable v-model="selected" placeholder="Select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="name">
              <el-input v-model="number" placeholder="Number" clearable />
            </el-form-item>

            <el-form-item>
              <el-button @click="remote" type="primary">
                Track
                <i class="el-icon-search el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>

          <div :style="{ height: (height-140)+'px' }" style="overflow-y: auto; overflow-x: hidden">
            <iframe style="width: 100%; height: calc(100% - 20px);" :src="srcUrl" frameborder="0"></iframe>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { trackByBookingNumber } from '@/api/shipment/shipment'
import { getVessels } from '@/api/track/track'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'

export default {
  name: 'SystemTenant',
  components: {},
  data() {
    return {
      height: '',
      activeName: 'Vessel',
      // 遮罩层
      loading: false,
      // 查询参数
      number: '',
      carrierCode: '',
      vesselNumber: '',
      options: [
        {
          value: 'blNum',
          label: 'BL Number'
        },
        {
          value: 'containerNum',
          label: 'Container Number'
        }
      ],
      selected: 'blNum',
      srcUrl: 'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&lang=en&locale=en-US',
      srcUrl1: '',
      carriers: []
    }
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 165
    this.vesselNumber = this.$route.query.vesselName
    this.remote1()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },

    remoteMethodCarriers(query) {
      this.carriers = []
      var carriersAll = getDictDatas(DICT_TYPE.CARRIER)
      if (query !== '' && query.length >= 1) {
        this.carriers = carriersAll.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        })
      } else {
        this.carriers = []
      }
    },

    // getDictDatas(DICT_TYPE.CARRIER)

    remote() {
      if (this.number == '' || this.number == null) {
        this.$notify({
          message: 'Please provide booking number or container number.',
          type: 'warning'
        })
        return false
      }
      this.loading = true
      trackByBookingNumber({
        carrier: this.carrierCode,
        type: this.selected == 'blNum' ? '' : 'containerNo',
        bookingNumber: this.number
      }).then(res => {
        this.loading = false
        if ((res.data != null && res.data.statusCode == '20000') || (res.code == '0' && res.data != null)) {
          if (this.selected != 'blNum') {
            this.srcUrl =
              'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&containerNo=' +
              this.number +
              '&carrierCode=' +
              res.data.data.result.carrier.code +
              '&showInfo=1&lang=en' +
              '&font=figtree'
          } else {
            this.srcUrl =
              'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&billNo=' +
              this.number +
              '&carrierCode=' +
              res.data.data.result.carrier.code +
              '&showInfo=1&lang=en' +
              '&font=figtree'
          }
        } else {
          this.$notify({
            showClose: true,
            message: 'No data',
            type: 'warning'
          })
          this.srcUrl = 'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&lang=en&locale=en-US'
        }
      })
    },
    remote1() {
      this.srcUrl1 =
        'https://i.saas.freightower.com/#/ais/vessel?key=SUZSYU1FX-Tf7SJ9hyND7ZI0OMtk0aSsdgo-hzxmSZZZHZ9c7cKGyMLQz0txZMRiuMRm1hOiVxTCYiSxuoBPg26H9Pqk1qhLrNvzJOcgJn2jvVmLw0VqvdB2SOBXaYo9hIni28BpFx92HmpS7UKoYIaJMLF408AR9Nmc5RYi5T39Xvgq3WuB&clientId=q8acc6c57665bf971&lang=en&locale=en-US&mmsi=' +
        (this.vesselNumber ? this.vesselNumber : '') +
        '&font=figtree';
    }
  }
}
</script>

<style lang="scss" scoped>
.maps .el-tabs__nav-scroll .el-tabs__nav.is-top {
  margin-left: 380px;
}
.maps .el-tabs__item.is-left {
  width: 355px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  margin-right: 10px;
  word-wrap: break-word;
  white-space: normal;
  word-break: normal;
}
.maps .el-tabs__item {
  height: auto;
  line-height: 40px;
}
</style>
