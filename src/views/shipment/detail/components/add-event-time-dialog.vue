<template>
  <el-dialog
    title="Event Time"
    :visible.sync="innerVisible"
     width="560px"
     append-to-body
    @close="handleCancel"
  >
    <el-form  label-width="120px" style="padding: 0px;">

      <div v-for="(item, i) in formList" :key="i" style="margin-bottom:20px;">
        <div style="padding-bottom: 10px;">
             <h4 style=" display: inline; font-weight: bold;font-weight: 700;">
            {{ isPOL(i) ? 'POL' : 'POD' }}
          </h4>
          <span style="display: inline; margin-left: 10px;">
            {{ iataMap[item.row.carrier]?iataMap[item.row.carrier]:item.row.carrier }} - {{ isPOL(i) ? (airportIataMap[item.row.pol]?airportIataMap[item.row.pol]:item.row.pol) : (airportIataMap[item.row.pod]?airportIataMap[item.row.pod]:item.row.pod) }}
          </span>
        </div>

        <el-form-item
          v-for="row in getRows(i)"
          :key="row.key"
          :label="row.label"
        >
          <div class="time-row">

            <el-date-picker
              v-model="item[row.key + 'Date']"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="Date"
              class="date-box"
            />

            <el-time-picker
              v-model="item[row.key + 'Time']"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="Time"
              class="time-box"
            />

          </div>
        </el-form-item>

      </div>

    </el-form> 

    <div slot="footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </div>

  </el-dialog>
</template>

<script>

import { updateShipmentSeaAirEventTime } from '@/api/seaair/seaair';
import { getAirlineList } from '@/api/air/airline';
import { getAirportList } from '@/api/air/airport';


export default {
  name: 'EventTimeDialog',

  props: {
    visible: Boolean,
    data: Array,
    shipment: {
      type: Object,
      default: () => { }
    },
  },

  data() {
    return {
      innerVisible: false,
      formList: [],
      carrierData: {},
      airlineOptions: [],
      airPortOptions: [],
      iataMap:{},
      airportIataMap:{},

    }
  },

  watch: {
    visible(v) {
      this.innerVisible = v
      if (v) this.initForm()
    }
  },

  methods: {
        /**
 * 获取航空公司列表
 */
    getAirlineList() {
      return getAirlineList().then(response => {
        this.airlineOptions = response.data || []
        this.iataMap = {};
        this.airlineOptions.forEach(item => {
          // 过滤掉iata/airlineName为空的无效数据
          if (item.iata && item.airlineName) {
            this.iataMap[item.iata] = item.airlineName +'('+item.iata+')';
          }
        });
        return response
      })
    },

    /**
     * 获取机场列表
     */
    getAirportList() {
      return getAirportList().then(response => {
        this.airPortOptions = response.data || []
        this.airportIataMap = {};
        this.airPortOptions.forEach(item => {
          // 过滤iata/airportName为空的无效数据
          if (item.iata && item.airportName) {
            this.airportIataMap[item.iata] = item.airportName + '(' + item.iata + ')';
          }
        });
        return response
      })
    },

    isPOL(i) {
      return i % 2 === 0
    },

    getRows(i) {
      return this.isPOL(i)
        ? [
            { label: 'Booked ETD', key: 'bookedEtd' },
            { label: 'ETD', key: 'etd' },
            { label: 'ATD', key: 'atd' }
          ]
        : [
            { label: 'Booked ETA', key: 'bookedEta' },
            { label: 'ETA', key: 'eta' },
            { label: 'ATA', key: 'ata' }
          ]
    },

    initForm() {
      var fristNode = this.data[0]
      var lastNode = this.data[this.data.length - 1]
      fristNode.bookedEtd = this.shipment.seaAirBookedEtd
      fristNode.atd = this.shipment.seaAirAtd
      lastNode.bookedEta = this.shipment.seaAirBookedEta
      lastNode.ata = this.shipment.seaAirAta

      this.formList = this.data.map((row, i) => {
        console.log('1111',row)
        const obj = { row }

        this.getRows(i).forEach(r => {
          this.splitTs(obj, r.key, row[r.key])
        })

        return obj
      })
      console.log('2222',this.formList)
      this.carrierData = this.shipment

      console.log('2222', this.carrierData)
      this.getAirlineList()
      this.getAirportList()

    },

    splitTs(target, field, ts) {
      if (!ts) return

      var time = this.parseUTCTimeWithHM(ts)
      // 2. 按空格分割为日期和时间部分（空值防护）
      if (time) {
        const [datePart, timePart] = time.split(' '); // 分割：["yyyy/MM/dd", "HH:mm"]
        // 赋值给对应的字段
        target[field + 'Date'] = datePart || ''; // 日期部分（如 shipDate）
        target[field + 'Time'] = timePart || ''; // 时间部分（如 shipTime）
      } else {
        // 解析失败时赋值为空（避免undefined）
        target[field + 'Date'] = '';
        target[field + 'Time'] = '';
      }

      // 示例输出验证
      console.log(target.shipDate); // 输出：2026/03/10（示例时间戳对应的日期）
      console.log(target.shipTime); // 输出：12:37（示例时间戳对应的时分）
    },
    joinTs(dateStr, timeStr) {
      if (!dateStr || !timeStr) return null;
      console.log('dateStr', dateStr)
      console.log('timeStr', timeStr)
      return dateStr +' '+ timeStr+':00';
    },

    handleSubmit() {
      const result = this.formList.map((item, i) => {
        // 拷贝一份原始 row
        const row = { ...item.row }

        this.getRows(i).forEach(r => {
          row[r.key] = this.joinTs(
                  item[r.key + 'Date'],
                  item[r.key + 'Time']
          )
        })

        return row
      })

      console.log('result', result)
      console.log('updateEventTime', result)

      // 提交接口
      updateShipmentSeaAirEventTime({'seaAirEvents':result}).then(response => {
        this.$message.success('Success');
        this.showAddEventDialog = false
        this.$emit('submit', result)
        this.handleCancel()
      }).catch(error => {
        this.$message.error('Update failed');
      });
      
    },


    handleCancel() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.text-row {
  display: flex;
  align-items: left;
}
.time-row {
  display: flex;
  align-items: center;
}

.date-box {
  width: 180px;
}

.time-box {
  width: 220px;
  margin-left: 24px;
}

/* 核心修复 */
:deep(.el-form-item__label) {
  width: 140px !important;
  min-width: 140px !important;
  white-space: nowrap;     /* 不允许换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
