<template>
  <el-dialog
    title="Event Time"
    :visible.sync="innerVisible"
    width="560px"
    @close="handleCancel"
  >
    <el-form label-width="120px">

      <div v-for="(item, i) in formList" :key="i" style="margin-bottom:20px;">

        <div style="padding-bottom: 10px;">
             <h4 style=" display: inline; font-weight: bold;font-weight: 700;">
            {{ isPOL(i) ? 'POL' : 'POD' }}
          </h4>
          <span style="display: inline; margin-left: 10px;">
          {{ item.row.pol }}
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
export default {
  name: 'EventTimeDialog',

  props: {
    visible: Boolean,
    data: Array
  },

  data() {
    return {
      innerVisible: false,
      formList: []
    }
  },

  watch: {
    visible(v) {
      this.innerVisible = v
      if (v) this.initForm()
    }
  },

  methods: {

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
      this.formList = this.data.map((row, i) => {
        console.log('1111',row)
        const obj = { row }

        this.getRows(i).forEach(r => {
          this.splitTs(obj, r.key, row[r.key])
        })

        return obj
      })
      console.log('2222',this.formList)
    },

    splitTs(target, field, ts) {
      if (!ts) return

      const d = new Date(ts)

      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const hh = String(d.getHours()).padStart(2, '0')
      const mi = String(d.getMinutes()).padStart(2, '0')

      target[field + 'Date'] = `${yyyy}-${mm}-${dd}`
      target[field + 'Time'] = `${hh}:${mi}`
    },

    joinTs(dateStr, timeStr) {
      if (!dateStr || !timeStr) return null
      return new Date(dateStr + ' ' + timeStr + ':00').getTime()
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

  this.$emit('submit', result)
  this.handleCancel()
},


    handleCancel() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
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
