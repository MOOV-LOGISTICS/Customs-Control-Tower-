<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <div style="position: relative">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.4004 11.551L36.3332 5H11.6666L6.58398 11.551" stroke="#444" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
        <path d="M6 13C6 11.8954 6.89543 11 8 11H40C41.1046 11 42 11.8954 42 13V40C42 41.6569 40.6569 43 39 43H9C7.34315 43 6 41.6569 6 40V13Z" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
        <path d="M32 27L24 35L16 27" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
        <path d="M23.9917 19V35" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
      </svg>
      <span style="position: absolute; top: 12px; font-size: 20px">
        Container Loading Result({{ soType}})
        <el-button v-hasPermi="['shipment:clp:update']" type="text" @click="update()">
          <i style="font-size: 18px" class="el-icon-edit"></i>
        </el-button>
      </span>
    </div>
    <el-divider content-position="left"></el-divider>
    <el-empty description="No Carrier Booking" v-if="showNotData"></el-empty>
    <el-form :model="clp" v-loading="showLoadingData" v-show="!showNotData">
      <el-row>
        <el-col v-show="JSON.stringify(shipment) != '{}'">
          <el-descriptions :colon="false" style="border: none;padding: 15px!important;background: #fff;" :column="4">
            <el-descriptions-item :label="$t('booking.carrier')">{{ shipment.carrier }}</el-descriptions-item>
            <el-descriptions-item label="Carrier Booking Ref">{{ shipment.shipmentBookingNumber }}</el-descriptions-item>
            <el-descriptions-item label="MOOV Booking Ref">{{ shipment.bookingNumber }}</el-descriptions-item>
            <el-descriptions-item :label="$t('booking.contractNumber')">{{ shipment.contractNumber }}</el-descriptions-item>
            <el-descriptions-item :label="$t('booking.placeOfReceipt')">
              {{
              originDeliveryMap[shipment.pol]
              ? originDeliveryMap[shipment.pol]
              : shipment.pol
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.portOfLoading')">
              {{
              polPodMap[shipment.originPort]
              ? originDeliveryMap[shipment.originPort]
              : shipment.originPort
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.portOfDischarge')">
              {{
              polPodMap[shipment.destinationPort]
              ? originDeliveryMap[shipment.destinationPort]
              : shipment.destinationPort
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.finalDestination')">
              {{
              originDeliveryMap[shipment.pod]
              ? originDeliveryMap[shipment.pod]
              : shipment.pod
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Shipper Booking Ref">{{ clp.soNumbers }}</el-descriptions-item>

            <el-descriptions-item :label="$t('booking.carriageContract')">{{ shipment.contractType }}</el-descriptions-item>
            <el-descriptions-item :label="$t('booking.payment_term')">{{ shipment.paymentTerm }}</el-descriptions-item>
            <el-descriptions-item :label="$t('booking.remark')">{{ shipment.remark }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col style="margin-top: 10px;border-radius: 10px;">

                    <el-card  v-if="soType=='FCL'"  shadow="always" class="clp-container">

                      <div v-for="(container, containerIndex) in form.containerList" :key="containerIndex" class="container-card">
                        <el-row class="card-header-clp" :gutter="20">
                          <el-col :span="3">
                            Container Type
                          </el-col>
                          <el-col :span="3">
                            Container Number
                          </el-col>
                          <el-col :span="3">
                            Seal Number
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="3" :gutter="20">
                            {{ container.containerType || '-' }}
                          </el-col>
                          <el-col :span="3">
                            {{ container.containerNo || '-' }}
                          </el-col>
                          <el-col :span="3">
                            {{ container.containerSealNumber || '-' }}
                          </el-col>
                        </el-row>
                        <div class="item-list">
                          <el-row class="card-header-clp" :gutter="20">
                            <el-col style="width:170px">Order Number</el-col>
                            <el-col style="width:110px">Item Number</el-col>
                            <el-col :span="4">Item Name</el-col>
                            <el-col style="width:120px">TC Id</el-col>
                            <el-col :span="2">Loaded Outer Cartons</el-col>
                            <el-col :span="2">Loaded Inner Cartons</el-col>
                            <el-col :span="2">Loaded Pieces</el-col>
                            <el-col :span="2">Gross Weight (KG)</el-col>
                            <el-col :span="2">Volume (CBM)</el-col>
                          </el-row>
                          <div v-for="(item, itemIndex) in container.itemData" :key="itemIndex" class="item-card">

                            <el-row :gutter="20">
                              <el-col style="width:170px">
                                <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                                  :prop="'containerList.' + containerIndex + '.itemData.'+itemIndex+'.orderNumber'">
                                  <el-input disabled placeholder="" v-model="item.orderNumber" clearable
                                    @blur="item.orderNumber = $event.target.value.trim()" />
                                </el-form-item>
                              </el-col>
                              <el-col style="width:110px">
                                <el-input disabled placeholder="" v-model="item.itemNumber" clearable autocomplete="off"
                                  @blur="item.itemNumber = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="4">
                                <el-input disabled placeholder="" v-model="item.itemName" clearable autocomplete="off"
                                  @blur="item.itemName = $event.target.value.trim()" />
                              </el-col>
                              <el-col style="width:120px">
                                <el-input disabled placeholder="" v-model="item.tcId" clearable autocomplete="off"
                                  @blur="item.tcId = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="2">
                                <el-input disabled placeholder="" v-number-only v-model="item.qty" clearable autocomplete="off"
                                  @change="totalRemaining" :controls="false" @blur="item.qty = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="2">
                                <el-input disabled placeholder="" v-number-only v-model="item.innerQty" clearable autocomplete="off"
                                  @blur="item.innerQty = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="2">
                                <el-input disabled placeholder="" v-number-only v-model="item.pieces" clearable autocomplete="off"
                                  @blur="item.pieces = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="2">
                                <el-input disabled placeholder="" v-number-only v-model="item.weight" clearable autocomplete="off"
                                  @change="totalRemaining" @blur="item.weight = $event.target.value.trim()" />
                              </el-col>
                              <el-col :span="2">
                                <el-input disabled placeholder="" v-number-only v-model="item.cbm" clearable autocomplete="off"
                                  @change="totalRemaining" @blur="item.cbm = $event.target.value.trim()" />
                              </el-col>
                            </el-row>
                          </div>
                          <!-- total row -->
                <el-row :gutter="20">
                  <el-col style="width:170px">
                    <span class="total-cell-value">Total</span>
                  </el-col>
                  <el-col style="width:110px">&nbsp;</el-col>
                  <el-col :span="4">&nbsp;</el-col>
                  <el-col style="width:120px">&nbsp;</el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.qty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.innerQty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.pieces),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.weight),0)?.toFixed(2) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ container.itemData.reduce((prev,item)=>Number(prev)+Number(item.cbm),0)?.toFixed(3) }}</span>
                  </el-col>
                </el-row>
                          <el-divider></el-divider>
                        </div>
                      </div>


                    </el-card>


                    <el-card v-if="soType=='LCL'" shadow="always" class="clp-container clp-lcl">

                      <div class="container-card">
                        <div class="item-list">
                          <el-row class="card-header-clp" :gutter="20">

                            <el-col class="col-container-no" style="width:140px">Container Number</el-col>

                            <el-col class="col-order-no" style="width:170px">Order Number</el-col>
                            <el-col class="col-item-no" style="width:110px">Item Number</el-col>
                            <el-col class="col-item-name" :span="3">Item Name</el-col>
                            <el-col class="col-tc-id" style="width:120px">TC Id</el-col>
                            <el-col :span="2">Loaded Outer Cartons</el-col>
                            <el-col :span="2">Loaded Inner Cartons</el-col>
                            <el-col :span="2">Loaded Pieces</el-col>
                            <el-col :span="2">Gross Weight (KG)</el-col>
                            <el-col :span="2">Volume (CBM)</el-col>
                          </el-row>
                          <div v-for="(item, itemIndex) in form.poList" :key="itemIndex" class="item-card">

                            <el-row :gutter="20">

                              <el-col class="col-container-no" style="width:140px">
                                <el-form-item required :rules="[ { required: true, message: '  '}  ]"
                                  :prop="'poList.' + itemIndex+'.containerNo'">
                                  <el-input disabled placeholder="" v-model="item.containerNo" clearable
                                    @input.native="item.containerNo = $event.target.value.trim()" />
                                </el-form-item>
                              </el-col>

                    <el-col class="col-order-no" style="width:170px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.orderNumber'">
                        <el-input disabled placeholder v-model="item.orderNumber" clearable @input.native="item.orderNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col class="col-item-no" style="width:110px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.itemNumber'">
                        <el-input disabled placeholder v-model="item.itemNumber" clearable autocomplete="off" @input.native="item.itemNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col class="col-item-name" :span="3">
                      <el-input disabled placeholder v-model="item.itemName" clearable autocomplete="off" @input.native="item.itemName = $event.target.value.trim()" />
                    </el-col>
                    <el-col class="col-tc-id" style="width:120px">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.tcId'">
                        <el-input disabled placeholder v-model="item.tcId" clearable autocomplete="off" @input.native="item.tcId = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.qty'">
                        <el-input disabled placeholder v-number-only v-model="item.qty" clearable autocomplete="off" @change="totalRemaining" :controls="false" @input.native="item.qty = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.innerQty'">
                        <el-input disabled placeholder v-number-only v-model="item.innerQty" clearable autocomplete="off" @input.native="item.innerQty = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.pieces'">
                        <el-input disabled placeholder v-number-only v-model="item.pieces" clearable autocomplete="off" @input.native="item.pieces = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.weight'">
                        <el-input disabled placeholder v-number-only v-model="item.weight" clearable autocomplete="off" @change="totalRemaining" @input.native="item.weight = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item required :rules="[ { required: true, message: '  '}  ]" :prop="'poList.' + itemIndex+'.cbm'">
                        <el-input disabled placeholder v-number-only v-model="item.cbm" clearable autocomplete="off" @change="totalRemaining" @input.native="item.cbm = $event.target.value.trim()" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <!-- total row -->
                <el-row :gutter="20">
                  <el-col class="col-container-no">
                    <span class="total-cell-value">Total</span>
                  </el-col>
                  <el-col class="col-order-no">&nbsp;</el-col>
                  <el-col class="col-item-no">&nbsp;</el-col>
                  <el-col class="col-item-name" :span="3">&nbsp;</el-col>
                  <el-col class="col-tc-id">&nbsp;</el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.qty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.innerQty),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.pieces),0) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.weight),0)?.toFixed(2) }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="total-cell-value">{{ form.poList.reduce((prev,item)=>Number(prev)+Number(item.cbm),0)?.toFixed(3) }}</span>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-card shadow="always" class="clp-container" style=" margin-top: 10px;">
            <div style="font-size: 20px; padding-top: 15px; padding-left: 15px; font-weight: 600;">DECLARATION OF FUMIGATION</div>
            <el-divider></el-divider>

            <el-card class="box-card" style="margin-bottom: 10px;" v-show="clp.files.length > 0">
              <div v-for="file in clp.files" class="text-upload inline-item" size="mini" style="width: 400px;padding-right: 10px;">
                <div class="tools-but">
                  <el-button type="text" @click="handlePreview(file)" icon="el-icon-download" style="margin-right: 6px"></el-button>
                </div>
                <el-descriptions :colon="false" :column="1" label-class-name="file-item-label" style="box-shadow:none;margin-bottom:10px">
                  <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                  <el-descriptions-item :label="$t('document.uploadedOn')">{{ parseTime(file.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { get } from '@/api/shipment/shipment'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getPolPodList } from '@/api/system/polPod'
import { getListByShipmentId } from '@/api/booking/booking'
import { getItemList } from '@/api/order/item'
import { getContainerList } from '@/api/system/container'
import { createClp, getList } from '@/api/shipment/clp'
import { pepcoCreateClp, pepcoDownloadShipmentCLPTemplateByShipmentId, pepcoGetList } from '@/api/shipment/pepcoclp'
import { findBookingNumberList, findShipmentOrderById } from '@/api/shipment/shipment'

export default {
  name: 'CLP',
  components: {},
  data() {
    return {
      cartonsProducedOuter: 0,
      cartonsProducedInner: 0,
      cartonsProducedPieces: 0,
      totalGrossWeight: 0,
      totalMeasurement: 0,
      clp: { files: [] },
      shipment: {},
      polPodMap: {},
      originDeliveryMap: {},
      shipments: [],
      tableData: [],
      containerOptions: [],
      activeNames: [],
      bookings: [],
      itemOptions: [],
      currentRow: null,
      height: '',
      form: {
        poList: [
          {
            containerNo: '',
            orderNumber: '',
            itemNumber: '',
            itemName: '',
            tcId: ''
          }
        ],
        containerList: [
          {
            containerType: '-',
            containerNo: '-',
            containerSealNumber: '-',
            itemData: [
              {
                orderNumber: '',
                itemNumber: '',
                itemName: '',
                tcId: '',
                qty: 0,
                weight: 0,
                cbm: 0
              }
            ]
          }
        ]
      },
      soType: '',
      showNotData: false,
      showLoadingData: false,
      orderId: ''
    }
  },
  mounted() {
    //this.getShipment();

    //根据orderId反查询SO
    if (this.$route.query.orderId || this.$route.query.shipmentId) {
      this.orderId = this.$route.query.orderId || ''
      this.form.shipmentId = this.$route.query.shipmentId || ''
    }
    this.getClp()
    this.getPortList()
    this.calcHeight()
  },
  methods: {
    calcHeight() {
      var clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 350 + 'px'
    },
    update() {
      this.$router.push('/shipment/clp/add?id=' + this.$route.query.id)
    },
    getClp() {
      this.showLoadingData = true
      pepcoGetList({ ids: [this.$route.query.id].join(',') }).then(res => {
        var clp = res.data[0]
        if (res.data.length == 0) {
          this.showNotData = true
          this.showLoadingData = false
          return
        }

        get(clp.shipmentId).then(res => {
          this.shipment = res.data
        })
        this.changeBl(clp.shipmentId, this.orderId)
        this.clp = clp
        this.form.poList = JSON.parse(JSON.stringify(this.clp.shipmentClpDetailDOS))
        this.getItems()
        this.showLoadingData = false
      })
    },
    changeBl(shipmentId, orderId) {
      //this.getBookings(this.form.shipmentId);
      findShipmentOrderById(shipmentId, orderId).then(res => {
        this.itemList = res.data.itemList
        this.soType = res.data.soType

        this.carrierData = res.data.shipments

        if (this.soType == 'FCL') {
          this.form.containerList = res.data.containerList
          this.groupedOrders = this.itemList
            .reduce((acc, item) => {
              const groupKey = item.orderNumber
              if (!acc[groupKey]) {
                acc[groupKey] = {
                  orderNumber: groupKey,
                  items: []
                }
              }
              acc[groupKey].items.push(item)
              return acc
            }, {})
            .valueOf()
          console.log(this.groupedOrders)
          for (var i = 0; i < this.form.containerList.length; i++) {
            if (!this.form.containerList[i].itemData) {
              this.form.containerList[i]['itemData'] = []
              this.addItem(this.form.containerList[i])
            }
          }
          if (this.clp != null) {
            for (var container of this.form.containerList) {
              container.itemData = []
              for (var newItem of this.clp.shipmentClpDetailDOS) {
                if (newItem.containerNo == container.containerNo) {
                  container.itemData.push(newItem)
                  continue
                }
              }
              if (container.itemData.length == 0) {
                container.itemData.push({
                  orderNumber: '',
                  itemNumber: '',
                  itemName: '',
                  tcId: '',
                  qty: 0,
                  weight: 0,
                  cbm: 0
                })
              }
            }
          }
        } else {
          //LCL
          this.showDetail = true
        }
      })
    },
    addItem(container) {
      const newItem = {
        orderNumber: '',
        itemNumber: '',
        itemName: '',
        tcId: '',
        qty: 0,
        weight: 0,
        cbm: 0
      }
      const newContainer = { ...container, itemData: [...container.itemData, newItem] }
      const newContainerList = [...this.form.containerList]
      const containerIndex = newContainerList.indexOf(container)
      newContainerList[containerIndex] = newContainer
      this.form.containerList = newContainerList
    },
    getContainerList() {
      getContainerList().then(response => {
        this.containerOptions = response.data
      })
    },
    clickSelect(index) {
      this.currentRow = index
    },
    radioChange(value) {
      this.$set(this.tableData[this.currentRow], 'productCode', value.productCode)
      this.$set(this.tableData[this.currentRow], 'productName', value.productName)
      this.$set(this.tableData[this.currentRow], 'itemId', value.id)
      console.log(this.tableData[this.currentRow])
    },
    addClpDetail() {
      this.tableData.push({})
    },

    async getItems() {
      const orderItemIds = this.clp.shipmentClpDetailDOS.map(item => item.orderItemId)
      const res = await getItemList({ ids: orderItemIds.join(',') })

      const itemMap = new Map()
      res.data.forEach(item => {
        itemMap.set(item.id, item)
      })

      // 构造新数组
      const newDetails = this.clp.shipmentClpDetailDOS.map(detail => {
        const item = itemMap.get(detail.orderItemId)
        if (item) {
          return {
            ...detail,
            productName: item.productName,
            productCode: item.productCode,
            orderNumber: item.orderNumber
          }
        }
        return detail
      })

      // 一次性赋值，减少视图更新
      this.clp.shipmentClpDetailDOS = newDetails
    },

    getShipment() {
      listByConditionShipment({ bookingNumberIsNotNull: true }).then(res => {
        this.shipments = res.data
      })
    },
    getPortList() {
      getOriginDeliveryList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name)
        }
      })
      getPolPodList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.polPodMap, response.data[i].code, response.data[i].name)
        }
      })
    },
    handlePreview(file) {
      if (file.id) {
        window.location.href = file.url
      }
    },
    totalRemaining() {}
  }
}
</script>
<style lang="scss" scoped>
  /* and 运算符 */
@media screen and (max-width: 1440px) {
  /* 屏幕设备且宽度<=1440px */
  ::v-deep(.el-input.is-disabled .el-input__inner) {
    padding: 0 8px!important;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

}
@media screen and (min-width: 1440px) {
  /* 屏幕设备且宽度≥1440px */
  ::v-deep(.el-input.is-disabled .el-input__inner) {
    padding: 0 10px !important;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

}

  ::v-deep(.clp-container .item-card .el-form-item) {
    margin-bottom: 0;
  }

  ::v-deep(.clp-container .item-card .el-form-item__content) {
    line-height: normal;
  }

  .total-cell-value {
    display: inline-block;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
  }

  ::v-deep(.clp-lcl .col-container-no) {
    width: 140px !important;
    flex: 0 0 140px !important;
    max-width: 140px !important;
  }

  ::v-deep(.clp-lcl .col-order-no) {
    width: 170px !important;
    flex: 0 0 170px !important;
    max-width: 170px !important;
  }

  ::v-deep(.clp-lcl .col-item-no) {
    width: 110px !important;
    flex: 0 0 110px !important;
    max-width: 110px !important;
  }

  ::v-deep(.clp-lcl .col-tc-id) {
    width: 120px !important;
    flex: 0 0 120px !important;
    max-width: 120px !important;
  }
  </style>
