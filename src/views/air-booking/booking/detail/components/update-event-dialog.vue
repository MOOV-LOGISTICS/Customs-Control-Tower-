<template>
     <el-dialog title="Booking Status"  :show-close="false"  :visible.sync="visible"  width="500px">
      <el-form :model="form" :show-message="false">
       <el-form-item v-if="eventCode === 'BOOKING_CONFIRMATION'" label="Booking Number" :label-width="formLabelWidth" prop="bookingRef" required>
          <el-input v-model="form.bookingRef" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Events Date" :label-width="formLabelWidth" prop="dateValue">
          <el-date-picker 
            v-model="form.dateValue" 
            :type="eventCode === 'DEPARTURE_POL' || eventCode === 'ARRIVAL_POD' ? 'datetime' : 'date'"
            :format="eventCode === 'DEPARTURE_POL' || eventCode === 'ARRIVAL_POD' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'"
            value-format="timestamp" 
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loadingEventsConfirm">Confirm</el-button>
      </div>
    </el-dialog>

</template>

<script>
export default {
  name: 'EventTimeDialog',

  props: {
    visible: Boolean,
    eventCode: String,
    form: Object
  },

  created() {
   console.log('EventTimeDialog created with eventCode:', this.form);
  },
  watch: {
    form: {
      handler(newVal) {
        console.log('Form data updated1:', newVal);
        this.form = newVal;
        console.log('Form data updated2:',  this.form);
      },
      deep: true
    }
  },
computed: {
  datePickerType() {
    return this.eventCode === 'DEPARTURE_POL' ? 'datetime' : 'date'
  },
  datePickerFormat() {
    return this.eventCode === 'DEPARTURE_POL' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
  }
},
  data() {
    return {
      dialogFormEvents: false,
      formLabelWidth: '140px',
      loadingEventsConfirm: false,
      pickerOptions: {
          disabledDate: (time) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 设置为今天的凌晨
            return time.getTime() > today.getTime();
          },
        },
    }
  },

  methods: {
    handleSubmit() {
    this.$emit('submit', this.form)
    this.$emit('update:visible', false); // 提交后关闭 Dialog
},


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
