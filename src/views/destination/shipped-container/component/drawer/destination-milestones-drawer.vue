<template>
  <div>
    <div class="cardx" v-loading="milestoneListLoading" v-for="milestone in milestoneList" :key="milestone.id" v-hasPermi="getMilestoneViewPermi(milestone)">
      <div class="status1Div">
        <span
          v-if="showTaskStatus(milestone) != ''"
          class="status2"
          :class="[showTaskStatus(milestone) == 'Possible' ? 'color2' : '', showTaskStatus(milestone) == 'Finished' ? 'color1' : '', showTaskStatus(milestone) == 'Urgent' ? 'color3' : '', showTaskStatus(milestone) == 'Overdue' ? 'color4' : '']"
        >{{ showTaskStatus(milestone) }}</span>
      </div>
      <div class="order" style="margin-bottom: 5px;">ContainerNo:{{ milestone.containerNo }}</div>
      <div class="taskName" style="margin-bottom: 5px;">Task Name： {{ milestone.taskName }}</div>
      <div style="clear: both;"></div>
      <div class="date" style="margin-bottom: 5px;">Party Role：{{ milestone.partyRole == 'OHA' ? 'DHA' : milestone.partyRole }}</div>
      <div style="clear: both;"></div>
      <div class="date" style="margin-bottom: 5px;" v-if="milestone.status == 20">Complete Date：{{ formatUserLocalTime(milestone.finishedTime, milestone.timeZone, milestone.timeZoneOffset) }}</div>
      <div class="date" style="margin-bottom: 5px;" v-if="milestone.status == 10">Urgent Date：{{ parseUTCTime(milestone.urgentDate) }}</div>
      <div class="date" style="margin-bottom: 5px;" v-if="milestone.status == 10">Due Date：{{ parseUTCTime(milestone.dueDate) }}</div>
      <div v-if="milestone.status == 20">
        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;" @click="sendEmailTo(milestone)">
          Complete User：{{ milestone.autoResolved ? 'Auto Resolved': milestone.operator ? getUserName(milestone.operator) : getUserName(milestone.updater) }}
        </div>
      </div>
      <div style="margin-bottom: 5px; float: right;cursor: pointer;">
        <i v-hasPermi="getMilestoneEditPermi(milestone)" @click="handleMilestoneTask(milestone,'edit')" style="cursor: pointer; margin-right: 10px;" class="el-icon-edit"></i>
        <i v-hasPermi="getMilestoneViewPermi(milestone)" v-show="!milestone.editable" @click="handleMilestoneTask(milestone,'view')" style="cursor: pointer; margin-right: 10px;" class="el-icon-view"></i>
      </div>
      <div style="clear: both;"></div>
    </div>
    <milestone-delivery-plan-table-dialog :destroy-on-close="true" v-if="deliveryPlanTableDialogVisible" :visible.sync="deliveryPlanTableDialogVisible" :deliveryPlanType="milestoneDeliveryPlanType" :mode="milestoneTableMode" :containerData="containerData" @submit="handleSaveDeliveryPlanData" />
    <milestone-form-dialog :destroy-on-close="true" v-if="formDialogVisible" :visible.sync="formDialogVisible" :mode="milestoneFormMode" :destinationMilestoneCommand="destinationMilestoneCommand" @submit="handleSaveFormData" />
    <milestone-arrival-at-dc-table-dialog :destroy-on-close="true" v-if="arrivalAtDcTableDialogVisible" :visible.sync="arrivalAtDcTableDialogVisible" :mode="milestoneTableMode" :containerData="containerData" :destinationMilestoneCommand="destinationMilestoneCommand" :dc-name-list="dcNameList" @submit="handleSaveFormData" />
  </div>
</template>
<script>
import { createDestinationDeliveryPlan, getDestinationMilestone, handleMilestone, updateDestinationDeliveryPlan } from '@/api/destination/destination'
import { allUsers } from '@/api/system/user'
import MilestoneFormDialog from '@/views/destination/shipped-container/component/form/milestone-form-dialog.vue'
import MilestoneDeliveryPlanTableDialog from '@/views/destination/shipped-container/component/table/milestone-delivery-plan-table-dialog.vue'
import MilestoneArrivalAtDcTableDialog from '@/views/destination/shipped-container/component/table/milestone-arrival-at-dc-table-dialog.vue'

const TABLE_TASK_DELIVERY_PLAN_CODES = ['Delivery_Pre_Plan_to_MOOV', 'Delivery_Plan']
const TABLE_TASK_ARRIVAL_AT_DC_CODES = ['Arrival_at_DC_in_DC_date']

export default {
  name: 'DestinationMilestonesDrawer',
  props: {
    containerData: {
      type: Object,
      required: true
    },
    dcNameList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MilestoneFormDialog,
    MilestoneDeliveryPlanTableDialog,
    MilestoneArrivalAtDcTableDialog
  },
  data() {
    return {
      milestoneList: [],
      milestoneListLoading: false,
      formDialogVisible: false,
      deliveryPlanTableDialogVisible: false,
      arrivalAtDcTableDialogVisible: false,
      currentFormData: [],
      destinationMilestoneCommand: {
        id: null,
        formData: '[]'
      },
      // edit view
      milestoneFormMode: 'edit',
      milestoneTableMode: 'edit',
      // 1 是 pre delivery plan
      // 2 是 delivery plan
      milestoneDeliveryPlanType: 1,
      userMap: {},
    }
  },
  created() {
    allUsers().then(response => {
      console.log('用户信息', response.data)
      this.userMap = response.data.reduce((map, user) => {
        map.set(user.id, user.nickname)
        return map
      }, new Map())
    })
  },
  methods: {
    getMilestoneEditPermi(milestone) {
      if (!milestone.taskCode) return false
      if (milestone.taskCode == 'Delivery_Pre_Plan_to_MOOV') {
        return ['pepco:destination:delivery-pre-plan:edit']
      } else if (milestone.taskCode == 'Delivery_Plan') {
        return ['pepco:destination:delivery-plan:edit']
      } else if (milestone.taskCode == 'Arrival_at_DC_in_DC_date') {
        return ['pepco:destination:arrival-at-dc-date:edit']
      } else {
        return ['null']
      }
    },
    getMilestoneViewPermi(milestone) {
      if (!milestone.taskCode) return false
      if (milestone.taskCode == 'Delivery_Pre_Plan_to_MOOV') {
        return ['pepco:destination:delivery-pre-plan:view']
      } else if (milestone.taskCode == 'Delivery_Plan') {
        return ['pepco:destination:delivery-plan:view']
      } else if (milestone.taskCode == 'Arrival_at_DC_in_DC_date') {
        return ['pepco:destination:arrival-at-dc-date:view']
      } else {
        return ['null']
      }
    },
    refresh() {
      this.getDestinationMileStoneList()
    },
    getDestinationMileStoneList() {
      this.milestoneListLoading = true
      getDestinationMilestone({ containerNo: this.containerData.containerNo, destinationContainerId: this.containerData.id })
        .then(res => {
          this.milestoneList = res.data || []
          this.milestoneListLoading = false
        })
        .catch(err => {
          console.error('请求失败:', err)
          this.$message.error('Error')
        })
        .finally(() => {
          this.milestoneListLoading = false
        })
    },
    showTaskStatus(milestone) {
      if (milestone.status == 0) {
        return ''
      } else if (milestone.status == 10) {
        if (milestone.dueDate && Date.now() > milestone.dueDate) {
          return 'Overdue'
        } else if (milestone.urgentDate && Date.now() > milestone.urgentDate) {
          return 'Urgent'
        }
        return 'Possible'
      } else if (milestone.status == 20) {
        return 'Finished'
      }
    },
    sendEmailTo(task) {
      window.location.href = `mailto:${task.updaterName}`
    },
    handleMilestoneTask(milestone, type) {
      console.log('handleMilestoneTask called with:', milestone, type)
      this.destinationMilestoneCommand.id = milestone.id
      if (milestone.formData && milestone.formData !== '[]') {
        this.destinationMilestoneCommand.formData = JSON.stringify(milestone.formData)
      } else if (TABLE_TASK_DELIVERY_PLAN_CODES.includes(milestone.taskCode)) {
        //...
      }
      const isDeliveryPlanTableType = TABLE_TASK_DELIVERY_PLAN_CODES.includes(milestone.taskCode)
      const isArrivalAtDcTableType = TABLE_TASK_ARRIVAL_AT_DC_CODES.includes(milestone.taskCode)

      // 设置模式 edit / view
      this.milestoneFormMode = type
      this.milestoneTableMode = type

      // this.milestoneFormMode = milestone.editable ? 'edit' : 'view'
      // this.milestoneTableMode = milestone.editable ? 'edit' : 'view'
      console.log('this.milestoneTableMode', this.milestoneTableMode)

      console.log('this.milestoneTableMode', this.milestoneTableMode)
      // 根据任务类型打开不同 Dialog
      if (isDeliveryPlanTableType) {
        this.milestoneDeliveryPlanType = milestone.taskCode == 'Delivery_Pre_Plan_to_MOOV' ? 1 : 2
        this.deliveryPlanTableDialogVisible = true
      } else if (isArrivalAtDcTableType) {
        this.arrivalAtDcTableDialogVisible = true
      } else {
        this.formDialogVisible = true
      }
    },
    handleSaveFormData(command) {
      console.log('接收到更新后的 command:', command)
      const milestone = this.milestoneList.find(m => m.id === command.id)
      if (milestone && milestone.formData) {
        milestone.formData = command.formData
      }
      handleMilestone(command)
        .then(res => {
          this.$message.success('Success')
          // 可刷新列表
          this.getDestinationMileStoneList()
          this.$emit('refresh', true)
        })
        .catch(err => {
          // this.$message.error(err)
          console.error('Error:', err)
        })
    },
    handleSaveDeliveryPlanData(data) {
      console.log('接收到更新后的 delivery plan:', data)
      // 确保data是数组格式
      const dataArray = Array.isArray(data) ? data : [data];

      // 分离需要创建和更新的项
      const createItems = dataArray.filter(item => !item.id);
      console.log('createItems:', createItems)
      const updateItems = dataArray.filter(item => item.id);
      console.log('updateItems:', updateItems)

      // 创建处理里程碑的通用函数
      const processMilestone = () => {
        handleMilestone({
          id: this.destinationMilestoneCommand.id,
          formData: JSON.stringify(data, null, 2)
        })
          .then(res => {
            this.$message.success('Success')
            this.getDestinationMileStoneList()
            this.$emit('refresh', true)
          })
          .catch(err => {
            this.$message.error('Error')
            console.error('Error:', err)
          })
      }

      // 创建和更新操作的Promise数组
      const promises = [];

      // 添加创建操作Promise
      if (createItems.length > 0) {
        promises.push(...createItems.map(item => createDestinationDeliveryPlan(item)));
      }

      // 添加更新操作Promise
      if (updateItems.length > 0) {
        promises.push(...updateItems.map(item => updateDestinationDeliveryPlan(item)));
      }

      // 执行所有操作
      if (promises.length > 0) {
        Promise.all(promises)
          .then(responses => {
            console.log('批量操作成功:', responses)
            processMilestone()
          })
          .catch(err => {
            console.error('批量操作失败:', err)
            this.getDestinationMileStoneList()
            this.$emit('refresh', false)
          })
      }
    },
    getUserName(userId) {
      console.log('Getting user name for ID:', userId)
      console.log('Getting user map:', this.userMap)
      const id = Number(userId)
      if (this.userMap instanceof Map) {
        console.log('Getting user name for Name:', this.userMap.get(id))
        return this.userMap.get(id) || 'UnKnown User'
      } else {
        // 如果不是Map对象，尝试作为普通对象访问
        return this.userMap[id] || 'UnKnown User'
      }
    }
  }
}
</script>
<style scoped>
.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}

.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}

.status2 {
  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}

.color1 {
  color: #13854e;
  background-color: #d6ede2;
}

.color2 {
  color: #2d86ba;
  background-color: #ceecfd;
}

.numberOftask {
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.color3 {
  color: #e6a23c;
  background: #fdf6ec;
}

.color4 {
  color: #f56c6c;
  background: #fef0f0;
}
</style>
