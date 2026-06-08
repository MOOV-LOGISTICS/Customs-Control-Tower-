<template>
  <el-popover placement="top" min-width="350" trigger="hover">
    <div style="max-width: 800px; max-height: 300px; overflow: auto;">
      <strong>smartMOOV</strong>
      <hr style="margin: 8px 0; border-top: 1px solid #eee;">
      <div>
        <div v-for="statusType in statusTypes" :key="statusType">
          <div>
            <strong :style="{ color: getColor(statusType) }">{{ statusType }}:</strong><br>
            <span v-html="formatTaskValue(statusType)"></span>
          </div>
        </div>
      </div>
    </div>
    <i slot="reference" class="el-icon-question" style="margin-left: 5px; color: #409EFF; cursor: pointer;"></i>
  </el-popover>
</template>

<script>
export default {
  name: 'OverviewTipPopover',
  props: {
    taskName: {
      type: String,
      required: true
    },
    taskTipInfoMap: {
      type: Map,
      default: () => new Map()
    }
  },
  data() {
    return {
      statusTypes: ['Possible', 'Urgent', 'Overdue', 'Finished']
    }
  },
  methods: {
    getColor(type) {
      const colorMap = {
        'Possible': '#2d86ba',
        'Urgent': '#e6a23c',
        'Overdue': '#f56c6c',
        'Finished': '#13854e'
      };
      return colorMap[type] || '#000';
    },
    getTaskValue(statusType) {
      // // 只有当 taskTipInfoMap 为空且 taskName 为 'Carrier Booking' 时才初始化测试数据
      // if (this.taskTipInfoMap.size === 0 && this.taskName === 'Carrier Booking') {
      //   const carrierBookingInfo = new Map();
      //   carrierBookingInfo.set('Possible', '\tWhen scoring result is provided and today() - ETD > 21.');
      //   carrierBookingInfo.set('Urgent', '\tIf today() - ETD <= 21, within 1 working day of Pepco origin Scoring.');
      //   carrierBookingInfo.set('Overdue', '\tFor FCL\n\t\tIf today() - ETD <= 14, within 3 working days of Pepco origin Scoring.\n\tFor LCL\n\t\tIf today() - ETD <= 10, within 3 working days of Pepco origin Scoring.');
      //   carrierBookingInfo.set('Finished', '\tOnce milestone is completed.');

      //   this.taskTipInfoMap.set('Carrier Booking', carrierBookingInfo);
      // }
      
      if (this.taskTipInfoMap && this.taskTipInfoMap.has(this.taskName)) {
        const taskDetails = this.taskTipInfoMap.get(this.taskName);
        if (taskDetails && taskDetails.has(statusType)) {
          return taskDetails.get(statusType);
        }
      }
      return null;
    },
    formatTaskValue(statusType) {
      const value = this.getTaskValue(statusType) || '-';
      if (!value) return '-';
      
      // 将换行符替换为 <br> 标签，制表符替换为4个非断行空格
      return value.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }
}
</script>