<template>
  <div style="min-height: 200px;" height="250">
    <el-descriptions title direction="vertical" :label-width="150" :column="8" size="mini" border style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important;" v-model="shipmentRes">
      <el-descriptions-item label="Shipment Ref">{{ shipmentRes.bookingNumber }}</el-descriptions-item>
      <el-descriptions-item label="Booking Number">{{shipmentRes.shipmentBookingNumber }}</el-descriptions-item>
      <el-descriptions-item label="BL Number">{{ shipmentRes.blNumber }}</el-descriptions-item>
      <el-descriptions-item label="Carrier">{{ shipmentRes.carrier }}</el-descriptions-item>
      <el-descriptions-item label="Vessel/Voyage">{{ shipmentRes.routerDOList[0].transportMeanName }}/{{ shipmentRes.routerDOList[0].voyage }}</el-descriptions-item>

      <!-- <el-descriptions-item label="Contract Number">{{ shipmentRes.contractNumber }}</el-descriptions-item> -->
      <!-- <el-descriptions-item label="Shipped TEU">{{getshippedTue(row.containerDOList.filter((item) => item.type == 0))}}</el-descriptions-item> -->
      <el-descriptions-item label="Week">
        <el-link v-if="shipmentRes.carrier == 'MAEU'" type="primary" target="_blank" @click="toAllocation(order, 2)">{{ shipmentRes.etdAllocation }}</el-link>
        <p v-else>{{ shipmentRes.etdAllocation }}</p>
      </el-descriptions-item>

      <el-descriptions-item label="Booked ETD">{{ parseUTCTime(shipmentRes.bookedEtd) }}</el-descriptions-item>
      <el-descriptions-item label="Booked ETA">{{ parseUTCTime(shipmentRes.bookedEta) }}</el-descriptions-item>
      <el-descriptions-item label="ATD">{{ parseUTCTime(shipmentRes.atd) }}</el-descriptions-item>
      <el-descriptions-item width="120px" label="ATA">{{ parseUTCTime(shipmentRes.ata) }}</el-descriptions-item>
      <el-descriptions-item label="Containers">
        <span style="float: left;" v-for="container in shipmentRes.containerDOList.filter((item) => item.type == 0)">
          <span style="margin-right: 5px;">{{ container.containerType }} x {{ container.numbers }}</span>
        </span>
      </el-descriptions-item>

      <el-descriptions-item label="Shipped Containers">
        <span v-for="container in shipmentRes.containerDOList.filter((item) => item.type == 1)">
          <span style="margin-right: 5px;">{{ container.containerNo }}: {{ container.containerType }}</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="Contract Type">
        <el-tag type="primary" style="float: left;">{{ hblRowData.contractType}}</el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="Transport Status">
        <el-tag type="primary" style="float: left;">{{ showStatus(shipmentRes) }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title direction="vertical" :label-width="150" :column="8" size="mini" border style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important;" v-model="shipmentRes">
      <el-descriptions-item label="PO Numbers" width="200px" class="pocontent">
        <el-tooltip class="item" effect="dark" :content="shipmentRes.poNumbers" placement="top">
          <div style="max-width: 800px; white-space: normal; word-wrap: break-word;">
            <span v-for="(po, index) in shipmentRes.poNumbers?.split(',') || []" :key="index" style="display: inline-block; margin-right: 4px;">
              {{ po.trim() }}
              <span v-if="index < shipmentRes.poNumbers.split(',').length - 1">,</span>
            </span>
          </div>
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getContainerList } from '@/api/system/container'
import { getCustomFieldList } from '@/api/system/customField'
import officePreview from './office-preview.vue'
export default {
  name: 'CarrierBooking',
  components: { officePreview },
  props: {
    shipmentResData: {
      type: [Object, Array],
      default: () => []
    },
    hblRowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      shipmentRes: {},
      containerMap: {},
      customFieldHeader: [],
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
      }
    }
  },
  mounted() {
    // 组件挂载时直接初始化数据
    // this.shipmentRes = this.shipmentResData
    this.getContainerList()
  },
  methods: {
    setShipmentResData(data) {
      console.log('setShipmentResData:', data)
      this.shipmentRes = data
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    },
    getshippedTue(data) {
      var count = 0
      for (var i = 0; i < data.length; i++) {
        count += this.containerMap[data[i].containerType] * data[i].numbers
      }
      return count
    },
    getContainerList() {
      getContainerList().then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.containerMap[response.data[i].type] = response.data[i].tue
        }
        this.getCustomFieldList()
      })
    },
    getCustomFieldList() {
      getCustomFieldList({}).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].type == 'order_header') {
            this.customFieldHeader.push(response.data[i])
          } else {
            this.customFieldLine.push(response.data[i])
          }
        }
      })
    },
    showStatus(data) {
      console.log('点击显示状态按钮', data)
      if (data.status == 1) {
        return 'Cancel'
      }
      if (data.shipmentContainerStatusRes.length == 0) {
        function compare() {
          return function (a, b) {
            var value1 = a['status']
            var value2 = b['status']
            return parseInt(value1) - parseInt(value2)
          }
        }
        console.log('111', data)
        var arr = JSON.parse(JSON.stringify(data.shipmentStatusList))
        arr = arr.filter(item => item.endDate != null)
        console.log('111', arr)

        arr.sort(compare())
        return this.otherMilestones[arr[arr.length - 1].status]
      }
      if (data.shipmentContainerStatusRes.length > 0) {
        var move = data.shipmentContainerStatusRes[data.shipmentContainerStatusRes.length - 1]
        if (data.carrier == 'TSHG') {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.eventCode
        } else {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.descriptionEn
        }
      }
    },
    toAllocation(order, flag) {
      //localStorage.setItem('allocation', JSON.stringify(order));
      var week, carrier, lotNo
      if (order.shipmentResList.length > 0) {
        if (flag == 2) {
          week = order.shipmentResList[0].etdAllocation
        }
        carrier = order.shipmentResList[0].carrier
      }
      if (flag == 1) {
        lotNo = order.orderNumber
      }

      window.open('/bi/allocation?lotNo=' + lotNo + '&type=' + carrier + '&week=' + week)
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.ellipsis-text {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.po-numbers-text {
  max-width: 250px; /* 可根据页面实际调整 */
  display: inline-block;
  vertical-align: bottom;
}

/* 使用属性选择器精确匹配PO Numbers */
/* :deep(.el-descriptions-item__label[title='PO Numbers']) {
  width: 250px;
  width: 150px;
}
:deep(.el-descriptions-item__label[title='PO Numbers'] + .el-descriptions-item__content) {
  width: calc(100% - 150px);
} */
.pocontent span {
  word-break: break-word;
  white-space: normal;
}
</style>
