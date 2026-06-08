<template>
  <div>
    <el-button type="primary" @click="onAdd">Add</el-button>
    <!-- 时间线日志列表 -->
    <el-timeline v-if="logData.length > 0" class="timeline-wrapper">
      <el-timeline-item v-for="item in logData" :key="item.id" :timestamp="item.operatorAccount + '   ' + formatUserLocalTime(item.createTime, item.timeZone, item.timeZoneOffset)" placement="top">
        <div>
          <span style="color: #409eff;">{{ item.category }}</span>
          <p>{{ getReason(item.reason) }}</p>
          <p>{{ item.remark }}</p>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-else class="wrapper-empty">
      <el-empty class="empty"></el-empty>
    </div>
    <overdue-booked-e-t-d-dialog
      :visible="visible"
      :categoryOptions="categoryOptions"
      :rowInfo="rowInfo"
      @handleClose="handleClose"
      @successCallback="successCallback" />
  </div>
</template>
<script>
import OverdueBookedETDDialog from "@/views/pepcoShipping/orderList/components/OverdueBookedETDDialog.vue";
import {getOrderListByShippingId, getOverdueBookedETD} from "@/api/shipping/order";

export default {
  name: "OverdueBookedETDTab",
  components: {OverdueBookedETDDialog},
  props: ['rowInfo', 'tabName'],
  data() {
    return {
      visible: false,
      categoryOptions: [],
      logData: [],
    }
  },
  watch: {
    tabName(newVal, oldVal) {
      // tab为当前tab时再获取数据
      if (newVal === 'OverdueBookedETDLog') {
        this.getList()
      }
    }
  },
  methods: {
    onAdd() {
      // 生成category选择项
      const dictData = this.getDictDatas(this.DICT_TYPE.Overdue_Booked_ETD_Log)
      this.categoryOptions = dictData.reduce((acc, current) => {
        const existing = acc.find(item => item.remark === current.remark);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, []);
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    getList() {
      // 获取记录
      getOverdueBookedETD({ shippingId: this.rowInfo.id }).then(res => {
        if (res.data) {
          this.logData = res.data
        }
      })
    },
    getReason(code) {
      // 通过code获取详细的reason
      const dictData = this.getDictDatas(this.DICT_TYPE.Overdue_Booked_ETD_Log)
      const option = dictData.find(item => item.value === code)
      if (option) {
        return option.label
      }
    },
    // 成功添加回调
    successCallback() {
      this.$message.success('Success')
      this.visible = false
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.timeline-wrapper {
  max-height: 300px;
  overflow: auto;
  padding-top: 8px;
}
.wrapper-empty {
  width: 100%;
  margin: 0 auto;
  .empty {
    transform: scale(0.7);
  }
}
</style>
