<template>
  <div class="pd-20">
    <el-form :model="queryParams">
      <div>
        <div style="float: left; padding-top: 8px"></div>

        <div style="float: left; padding: 10px 0px">
          <el-input placeholder="Order Number" v-model="queryParams.orderNumber"
            @input.native="queryParams.orderNumber = $event.target.value.trim()"
            @keyup.enter.native="queryParams.pageNo = 1; getList();" clearable>
          </el-input>
        </div>

        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-button slot="append" @click="getList" type="primary"
            style="background-color: white; color: black; border-color: #dcdfe6">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>
        </div>
        <div style="float: left; margin-left: 5px; padding: 10px 0px">
          <el-popover v-model="filterPopover" placement="bottom" title="Filter" width="400" trigger="click">
            <el-form>
              <el-row :gutter="10" style="margin-bottom: 15px">
                <el-col :span="12">
                  <el-select multiple clearable v-model="queryParams.countryList" placeholder="Origin Country"
                    filterable>
                    <el-option v-for="item in country" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                    <el-option v-for="item in supplierList" :key="item.id" :label="item.name"
                      :value="item.supplierCode"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px">
                <el-col :span="12">
                  <el-select multiple clearable v-model="queryParams.dcList" placeholder="DC" filterable>
                    <el-option v-for="item in dcList" :key="item.code" :label="item.code + ' - ' + item.name"
                      :value="item.code"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form>
            <el-button slot="reference" icon="el-icon-plus" plain
              :style="{ color: hasFilter ? 'red' : '' }">Filter</el-button>
          </el-popover>
          <el-button style="margin-left: 5px" @click="clearFilters" plain>Clear Filters</el-button>
        </div>
        <div style="clear: both"></div>
      </div>
    </el-form>

    <div v-loading="taskLoading" class="transition-box" style="padding-top: 30px;"
      :style="{ 'height': (tableHeight) + 'px' }">
      <el-row :gutter="20" style="padding-top: 0px">
        <el-col :span="12" v-if="dataList.length > 0">
          <el-card style="margin-bottom: 20px; box-shadow: none !important;width: 800px;" class="box-card"
            v-if="dataList.length > 0">
            <div slot="header" class="clearfix">
              <span>Origin
              </span>
            </div>
            <div style="padding: 20px 0px 20px 0; margin-left: -20px">
              <el-table border :data="dataList" style="width: 100%">
                <el-table-column prop="taskName" label="Task Name" width="220">
                  <template slot-scope="scope">{{
                    scope.row.taskName
                    }}</template>
                </el-table-column>
                <el-table-column prop="partyRole" label="Party Role" min-width="80">
                  <template slot-scope="scope">{{
                    scope.row.partyRole
                    }}</template>
                </el-table-column>
                <el-table-column prop="possible" align="center" label="Possible" min-width="100">
                  <template slot="header" slot-scope="scope">
                    <span class="title" style="color: #2d86ba; background-color: #ceecfd">Possible</span>
                  </template>
                  <template slot-scope="scope">
                    <span style="color: #2d86ba" class="numberOftask" @click="taskDetails(scope.row, 1)">{{
                      scope.row.possibleCount || 0
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="urgent" align="center" label="Urgent" min-width="100">
                  <template slot="header" slot-scope="scope">
                    <span class="title" style="color: #e6a23c; background: #fdf6ec">Urgent</span>
                  </template>
                  <template slot-scope="scope">
                    <span style="color: #e6a23c" class="numberOftask" @click="taskDetails(scope.row, 2)">{{
                      scope.row.urgentCount || 0
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="overdue" align="center" label="Overdue" min-width="100">
                  <template slot="header" slot-scope="scope">
                    <span class="title" style="color: #f56c6c; background: #fef0f0">Overdue</span>
                  </template>
                  <template slot-scope="scope">
                    <span style="color: #f56c6c" class="numberOftask" @click="taskDetails(scope.row, 3)">{{
                      scope.row.overdueCount || 0
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="finished" align="center" label="Finished" min-width="100">
                  <template slot="header" slot-scope="scope">
                    <span class="title" style="color: #13854e; background-color: #d6ede2">Finished</span>
                  </template>
                  <template slot-scope="scope">
                    <span style="color: #13854e" class="numberOftask" @click="taskDetails(scope.row, 4)">{{
                      scope.row.finishedCount || 0
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <task-detail-data ref="taskDetailData" @refresh="getList()"></task-detail-data>
  </div>
</template>

<script>
import { checkPermi, checkRole } from '@/utils/permission'
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import TaskDetailData from './components/task-detail-data.vue'
import { getOrderMilestoneOverview, milestoneQueryFilterData} from '@/api/air/booking'

export default {
  name: 'Overview',
  mixins: [fileLoadMixin],
  components: { IconPark, TaskDetailData },
  props: {
    queryParams: Object
  },
  data() {
    return {
      tableHeight: 0,
      loading: true,
      dataList: [], //overview list
      // queryParams: {
      //   orderNumber: undefined,
      //   supplierCode: undefined,
      //   countryList: [],
      //   dcList: [],
      // },
      filterPopover: false,
      partyMap: {},
      data: {},
      dcList: [
        { code: '0006', name: 'Rawa' },
        { code: '0015', name: 'Sosnowiec' },
        { code: '0018', name: 'Gyal' },
        { code: '0021', name: 'Bucharest' },
        { code: '0027', name: 'Guadalajara' }
      ],
      country: [],
      supplierCode: [],
      supplierList: [],
      countryData: [],
      taskLoading: false,
    }
  },
  computed: {
    hasFilter() {
      this.queryParams.polList ||
        this.queryParams.country ||
        this.queryParams.countryList ||
        this.queryParams.supplierCode ||
        this.queryParams.dcList
    }
  },
  mounted() {
    this.tableHeight = document.body.clientHeight - 302
    // 窗口重置时候，重新获取高度
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 302
        console.log(this.tableHeight)
      })()
    }
  },
  created() {
    this.getList()
    this.getFilterData()
    if (this.$store.getters.userCompanyTypes.length == 0) {
      this.$store.dispatch('GetUserCompanyTypes')
    }
  },
  methods: {
    checkPermi,
    checkRole,
    closeDialog() {
      this.errorDialog.visible = false
    },
    getFilterData() {
      console.log('start search filter data')
      milestoneQueryFilterData().then(res => {
        console.log('filter data', res)
        this.country = res.data.countryList
        this.supplierList = res.data.supplierList
        this.polList = res.data.polList
        // this.dcList = res.data.dcList
      })
    },
    taskDetails(row, flowStatus) {
      console.log('taskDetails', row, flowStatus)
      this.$refs.taskDetailData.openDialog(row, flowStatus, this.queryParams)
    },
    getOverviewData() {
      this.taskLoading = true
      getOrderMilestoneOverview(this.queryParams).then(res => {
        const list = []
        res.data.forEach(overview => {
          // 处理可见菜单权限
          if (checkPermi([`pepco:air:view:${overview.taskCode}`])) {
            // if (overview.taskCode !== 'shipper_booking') {
              list.push(overview)
            // }
          }
        }) 
        this.dataList = list || []
        this.taskLoading = false
      })
    },
    getList() {
      console.log('查询getList')
      this.loading = true
      this.filterPopover = false
      this.getOverviewData()
    },

    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 302
    },
    //po页面的清除 筛选条件
    clearFilters() {
      //清除Filter
      this.queryParams.countryList = []
      this.queryParams.supplierCode = null
      this.queryParams.dcList = []
      //清除搜索条件
      this.queryParams.orderNumber = null
      this.queryParams.pageNo = 1
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.port-item {
  position: relative;
  top: 0px;
  display: inline-block;
  line-height: 24px;
  padding: 0px 15px;
  border-right: 1px solid #ddd;
  border-radius: 10px;
  margin-left: 10px;
}

.el-table__header-wrapper .el-checkbox {
  display: none !important;
}

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
}

.title {
  font-weight: bold;
  padding-right: 10px;
}

.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}

.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}

.title {
  border: 5px;
}

.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: '';
  background: #004f7c;
  top: 20px;
  text-align: left;
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

::v-deep .hiddenCheck>.cell .el-checkbox__inner {
  display: none;
}

.center-input ::v-deep input {
  text-align: center;
}

.self-step2 {
  width: 20px;
  display: inline-block;
  height: 20px;
  border-radius: 20px !important;
  color: #fff;
  line-height: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  z-index: 999;
}

/* .self-step3:not(:first-child):before {
  width: 160px;
  height: 6px;
  position: absolute;
  left: -100px;
  content: "";
  background: #004F7C !important;
  top: 7px;
  text-align: left;
} */
.self-step3:not(:first-child):before {
  width: 150px;
  height: 6px;
  position: absolute;
  left: -80px;
  content: '';
  background: #004f7c !important;
  top: 7px;
  text-align: left;
}

/* 关键修改：自动换行后的每行第一个不显示横线 */

.self-step3:nth-child(6n + 1):before {
  display: none !important;
}

.self-step3:first-child:after {
  display: none !important;
}

.self-step-process1:not(:first-child):before {
  background: #63acd5 !important;
}

.self-step-finished1:not(:first-child):before {
  background: #004f7c !important;
}

.self-step-pedding1:not(:first-child):before {
  background: #ddd !important;
}

.self-step-error1:not(:first-child):before {
  background: #f56c6c !important;
}
</style>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: #fff;
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266 !important;
  background-color: #fff;
}

// el-checkbox禁用样式修改
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}

::v-deep .el-checkbox__input+span.el-checkbox__label {
  color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}

::v-deep .el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #606266;
}

.centered-descriptions :deep(.el-descriptions-item__content) {
  justify-content: center;
  text-align: center;
}

.centered-item :deep(.el-descriptions-item__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.header-box {
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  .header-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #ffffff;
  }
}

.warning {
  font-weight: bold;
  color: red;
}
</style>
