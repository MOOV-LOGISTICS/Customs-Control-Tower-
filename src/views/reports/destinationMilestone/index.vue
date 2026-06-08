<template>
  <div class="app-container" style="width: 100%; margin: 0 auto;">
    <el-card style="padding: 20px;" :style="{ height: height + 'px' }" class="report-card" v-loading="loading">
      <div style=" overflow-y: auto;">


        <!-- 报表表格  -->
        <div class="report-table-container" >
          <div>
          <el-row >
            <el-col :span="12">
              <span style="font-size: 18px; font-weight: bold;">Destination Milestone</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <!-- 显示当前日期 -->
              <span style="margin-right: 15px; font-size: 14px;">{{ currentDate }}</span>
              <!-- 新的PDF导出按钮 -->
              <el-button type="primary" @click="exportToPDF" :loading="exporting">
                <i class="el-icon-download"></i> Export PDF
              </el-button>
            </el-col>
          </el-row>
        </div>
          <table class="milestone-table">
            <!-- 表头部分 -->
            <thead>
            <tr>
              <th rowspan="4" class="location-control-header">
                <div>Location Control</div>
              </th>

              <!-- In Transit to POD 类别 -->
              <th colspan="1" class="category-header category-transit-pod">
                <div class="category-name">In Transit to POD</div>
              </th>

              <!-- In Port of Discharge 类别 -->
              <th colspan="6" class="category-header category-port-discharge">
                <div class="category-name">In Port of Discharge(or potentially inland port for intermodal)</div>
              </th>

              <!-- In Transit to DC 类别 -->
              <th colspan="2" class="category-header category-transit-dc">
                <div class="category-name">In Transit to DC</div>
              </th>

              <!-- Delivered 类别 -->
              <th colspan="1" class="category-header category-delivered">
                <div class="category-name">Delivered</div>
              </th>
            </tr>

            <!-- 类别总数行 -->
            <tr>
              <!-- In Transit to POD 总数 -->
              <th class="category-total-header">
                {{ getCategoryTotal(0, 0) }}
              </th>

              <!-- In Port of Discharge 总数 -->
              <th colspan="6" class="category-total-header">
                {{ getCategoryTotal(1, 6) }}
              </th>

              <!-- In Transit to DC 总数 -->
              <th colspan="2" class="category-total-header">
                {{ getCategoryTotal(7, 8) }}
              </th>

              <!-- Delivered 总数 -->
              <th class="category-total-header">
                {{ getCategoryTotal(9, 9) }}
              </th>
            </tr>

            <!-- 子类别表头 -->
            <tr>
              <!-- In Transit to POD 子类别 -->
              <th class="sub-category-header">
                Due to arrive at POD within the coming 7 days
              </th>

              <!-- In Port of Discharge 子类别 -->
              <th class="sub-category-header">Arrived at POD</th>
              <th class="sub-category-header">Customs Broker Assigned</th>
              <th class="sub-category-header">Freight Invoice to Customs Broker</th>
              <th class="sub-category-header">Customs Cleared MOT: not identified</th>
              <th class="sub-category-header">Customs Cleared MOT: Truck</th>
              <th class="sub-category-header">Customs Cleared MOT: Intermodal</th>

              <!-- In Transit to DC 子类别 -->
              <th class="sub-category-header">In Transit from POD to DC MOT: Truck</th>
              <th class="sub-category-header">In Transit from Inland Port to DC MOT: Intermodal</th>

              <!-- Delivered 子类别 -->
              <th class="sub-category-header">Delivered to DC within the last 7 days</th>
            </tr>

            <!-- 子类别总数行 -->
            <tr>
              <td class="sub-total-value">{{ totalRow[0] }}</td>
              <td class="sub-total-value">{{ totalRow[1] }}</td>
              <td class="sub-total-value">{{ totalRow[2] }}</td>
              <td class="sub-total-value">{{ totalRow[3] }}</td>
              <td class="sub-total-value">{{ totalRow[4] }}</td>
              <td class="sub-total-value">{{ totalRow[5] }}</td>
              <td class="sub-total-value">{{ totalRow[6] }}</td>
              <td class="sub-total-value">{{ totalRow[7] }}</td>
              <td class="sub-total-value">{{ totalRow[8] }}</td>
              <td class="sub-total-value">{{ totalRow[9] }}</td>
            </tr>
            </thead>

            <tbody>
            <!-- Original HBL -->
            <tr >
              <td class="highlight-cell-left">Original HBL</td>
              <td class="highlight-cell">{{ originalHBLRow[0] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[1] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[2] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[3] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[4] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[5] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[6] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[7] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[8] }}</td>
              <td class="highlight-cell">{{ originalHBLRow[9] }}</td>
            </tr>
            <!-- Original HBL, Pending Telex -->
            <tr  >
              <td class="highlight-cell-left">Original HBL, Pending Telex</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[0] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[1] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[2] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[3] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[4] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[5] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[6] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[7] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[8] }}</td>
              <td class="highlight-cell">{{ originalHBLPendingTelexRow[9] }}</td>
            </tr>

            <!-- 无预计划行 -->
            <tr class="without-pre-plan-row">
              <td class="highlight-cell-left">Without Pre-Plan</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[0] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[1] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[2] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[3] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[4] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[5] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[6] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[7] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[8] }}</td>
              <td class="highlight-cell">{{ withoutPrePlanRow[9] }}</td>
            </tr>

            <!-- 有预计划但无交付计划行 -->
            <tr class="with-pre-plan-no-delivery-row">
              <td class="highlight-cell-left">With Pre-plan but without Delivery Plan</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[0] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[1] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[2] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[3] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[4] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[5] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[6] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[7] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[8] }}</td>
              <td class="highlight-cell">{{ withPrePlanNoDeliveryRow[9] }}</td>
            </tr>

            <!-- 有预计划和交付计划行 -->
            <tr class="with-pre-plan-and-delivery-row">
              <td class="highlight-cell-left">With Pre-plan and Delivery Plan</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[0] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[1] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[2] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[3] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[4] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[5] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[6] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[7] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[8] }}</td>
              <td class="highlight-cell">{{ withPrePlanAndDeliveryRow[9] }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Operations Tasks 列表 -->
        <div class="operations-tasks-container" style="margin-top: 30px;">
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Operations Tasks</h3>
          <table class="operations-tasks-table">
            <thead>
            <tr>
              <th class="table-cell-header">Operations Tasks</th>
              <th class="table-cell-header">MOT</th>
              <th class="table-cell-header">Working / Calendar</th>
              <th class="table-cell-header">&lt;-3d</th>
              <th class="table-cell-header">-3d</th>
              <th class="table-cell-header">-2d</th>
              <th class="table-cell-header">-1d</th>
              <th class="table-cell-header">Today</th>
              <th class="table-cell-header">+1d</th>
              <th class="table-cell-header">+2d</th>
              <th class="table-cell-header">+3d</th>
              <th class="table-cell-header">+4d</th>
              <th class="table-cell-header">+5d</th>
              <th class="table-cell-header">+6d</th>
              <th class="table-cell-header">+7d</th>
              <th class="table-cell-header">&gt;+7d</th>
            </tr>
            <tr v-for="(task, index) in operationsTasks" v-if="task.id == 0">
              <th class="table-cell-header">Due date for milestone completion</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{{ task.minus3d }}</th>
              <th>{{ task.minus2d }}</th>
              <th>{{ task.minus1d }}</th>
              <th>{{ task.today }}</th>
              <th>{{ task.plus1d }}</th>
              <th>{{ task.plus2d }}</th>
              <th>{{ task.plus3d }}</th>
              <th>{{ task.plus4d }}</th>
              <th>{{ task.plus5d }}</th>
              <th>{{ task.plus6d }}</th>
              <th>{{ task.plus7d }}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(task, index) in operationsTasks" v-if="task.id != 0" :key="index">
              <td>{{ task.name }}</td>
              <td>{{ task.mot }}</td>
              <td>{{ task.workingCalendar }}</td>
              <td>{{ task.lessThanMinus3d }}</td>
              <td>{{ task.minus3d }}</td>
              <td>{{ task.minus2d }}</td>
              <td>{{ task.minus1d }}</td>
              <td>{{ task.today }}</td>
              <td>{{ task.plus1d }}</td>
              <td>{{ task.plus2d }}</td>
              <td>{{ task.plus3d }}</td>
              <td>{{ task.plus4d }}</td>
              <td>{{ task.plus5d }}</td>
              <td>{{ task.plus6d }}</td>
              <td>{{ task.plus7d }}</td>
              <td>{{ task.moreThanPlus7d }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- ETA Tracking for Ocean In Transit 表格 -->
        <div class="eta-tracking-container" style="margin-top: 30px;">
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">ETA Tracking for Ocean In Transit</h3>
          <table class="eta-tracking-table">
            <thead>
            <tr>
              <th class="table-cell-header" style="width: 365px;">ETA Tracking for Ocean In Transit</th>
              <th class="table-cell-header" style="width: 180px;">MOT</th>
              <th class="table-cell-header" style="width: 160px;">Working / Calendar</th>
              <th class="table-cell-header">1-7d</th>
              <th class="table-cell-header">8-14d</th>
              <th class="table-cell-header">15-21d</th>
              <th class="table-cell-header">&gt;22d</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in etaTrackingItems" :key="index">
              <td>{{ item.description }}</td>
              <td>{{ item.mot }}</td>
              <td>{{ item.workingCalendar }}</td>
              <td>{{ item.days1_7 }}</td>
              <td>{{ item.days8_14 }}</td>
              <td>{{ item.days15_21 }}</td>
              <td>{{ item.daysOver22 }}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
import { getDestinationMilestoneReport, getOperationsTasksReport, getEtaTrackingReport } from "@/api/bi/report";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'jspdf-autotable';

export default {
  name: "destinationMilestoneReport",
  components: {},
  data() {
    return {
      // Location Control 数据
      locationControlData: [],
      // Operations Tasks 数据
      operationsTasksData: [],
      // ETA Tracking 数据
      etaTrackingData: [],
      loading: false,
      // PDF导出加载状态
      exporting: false,
      pageForm: {
        pageNum: 1,
        pageSize: 100,
        returnTotalNum: true,
      },
      height: 0,
      // 固定的子类别映射表
      subCategoryMap: {
        "Due to arrive at POD within the coming 7 days": 0,
        "Arrived at POD": 1,
        "Customs Broker Assigned": 2,
        "Freight Invoice to Customs Broker": 3,
        "Customs Cleared MOT: not identified": 4,
        "Customs Cleared MOT: Truck": 5,
        "Customs Cleared MOT: Intermodal": 6,
        "In Transit from POD to DC MOT: Truck": 7,
        "In Transit from Inland Port to DC MOT: Intermodal": 8,
        "Delivered to DC within the last 7 days": 9
      },
      // Location Control 数据行
      totalRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      originalHBLRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      originalHBLPendingTelexRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      withoutPrePlanRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      withPrePlanNoDeliveryRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      withPrePlanAndDeliveryRow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // Operations Tasks 数据
      operationsTasks: [],
      // ETA Tracking for Ocean In Transit 数据
      etaTrackingItems: [],
      // Exceptions 数据
      exceptions: [
        {
          description: "Planned delivery date in the past, no In-DC arrival",
          count: ""
        }
      ]
    };
  },
  computed: {
    // 当前日期格式化
    currentDate() {
      const date = new Date();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  created() {
    const clientHeight = document.documentElement.clientHeight;
    this.height = clientHeight - 162;
    this.report();
  },
  methods: {
    // 查询所有报表数据
    report() {
      this.loading = true;

      // 并行调用三个接口
      Promise.all([
        this.getLocationControlData(),
        this.getOperationsTasksData(),
        this.getEtaTrackingData()
      ]).then(() => {
        // 检查是否所有数据都是空的
        if (
          this.locationControlData.length === 0 &&
          this.operationsTasksData.length === 0 &&
          this.etaTrackingData.length === 0
        ) {
          // 显示英文提示
          this.$message.info('Refreshing data, please wait 2-3 minutes');
        }
      }).finally(() => {
        this.loading = false;
      });
    },

    // 获取Location Control数据
    getLocationControlData() {
      return getDestinationMilestoneReport(this.pageForm).then((res) => {
        if (res.data === null) {
          this.locationControlData = [];
        } else if (res.data.output && res.data.output.length > 0) {
          this.locationControlData = res.data.output;
          this.processLocationControlData();
        } else {
          this.locationControlData = [];
        }
      }).catch(() => {
        this.locationControlData = [];
      });
    },

    // 获取Operations Tasks数据
    getOperationsTasksData() {
      return getOperationsTasksReport(this.pageForm).then((res) => {
        if (res.data === null) {
          this.operationsTasksData = [];
        } else if (res.data.output && res.data.output.length > 0) {
          this.operationsTasksData = res.data.output;
          this.processOperationsTasksData();
        } else {
          this.operationsTasksData = [];
        }
      }).catch(() => {
        this.operationsTasksData = [];
      });
    },

    // 获取ETA Tracking数据
    getEtaTrackingData() {
      return getEtaTrackingReport(this.pageForm).then((res) => {
        if (res.data === null) {
          this.etaTrackingData = [];
        } else if (res.data.output && res.data.output.length > 0) {
          this.etaTrackingData = res.data.output;
          this.processEtaTrackingData();
        } else {
          this.etaTrackingData = [];
        }
      }).catch(() => {
        this.etaTrackingData = [];
      });
    },

    // 处理Location Control数据
    processLocationControlData() {
      // 重置所有数据为0
      this.totalRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.originalHBLRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.originalHBLPendingTelexRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.withoutPrePlanRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.withPrePlanNoDeliveryRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.withPrePlanAndDeliveryRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // 填充数据
      this.locationControlData.forEach(item => {
        const index = this.subCategoryMap[item.sub_category];
        if (index !== undefined) {
          this.totalRow[index] = item.total_container;
          // 处理Original HBL数据（合并ORIGINAL和SEAWAY BILL）
          this.originalHBLRow[index] = (Number(item.ORIGINAL) || 0) + (Number(item.SEAWAY_BILL) || 0);
          // 处理Original HBL, Pending Telex数据
          this.originalHBLPendingTelexRow[index] = Number(item["Original, pending TELEX"]) || 0;
          this.withoutPrePlanRow[index] = Number(item["Without Pre-Plan"]) || 0;
          this.withPrePlanNoDeliveryRow[index] = Number(item["With Pre-plan but without Delivery Plan"]) || 0;
          this.withPrePlanAndDeliveryRow[index] = Number(item["With Pre-plan and Delivery Plan"]) || 0;
        }
      });
    },

    // 处理Operations Tasks数据
    processOperationsTasksData() {
      this.operationsTasks = this.operationsTasksData.map(item => {
        // 根据任务名称设置固定的daysVsEta和workingCalendar值
        let daysVsEta = "";
        let workingCalendar = "";

        switch (item["Operation Task"]) {
          case "Documents Verification":
            daysVsEta = -14;
            workingCalendar = "";
            break;
          case "Create Pre-Plan":
            daysVsEta = -2;
            workingCalendar = "";
            break;
          case "Create Final Delivery Plan":
            daysVsEta = 0;
            workingCalendar = "";
            break;
          case "Arrive at POD":
            daysVsEta = 0;
            workingCalendar = "Calendar";
            break;
          case "Assign Customs Broker":
            daysVsEta = -5;
            workingCalendar = "Working";
            break;
          case "Send invoice to Customs":
            daysVsEta = -1;
            workingCalendar = "Working";
            break;
          case "Customs Clearance at POD":
          case "Customs Cleared MOT: not identified":
          case "Customs Cleared MOT: Truck":
            daysVsEta = 2;
            workingCalendar = "Working";
            break;
          case "Customs Clearance at Inland Port":
          case "Customs Cleared at inland Port":
            daysVsEta = 12;
            workingCalendar = "Working";
            break;
          default:
            daysVsEta = "";
            workingCalendar = "";
        }
        //id == 0 是日期
        if (item["id"] == 0) {
          return {
            name: item["Operation Task"],
            mot: item.MOT,
            daysVsEta: daysVsEta,
            workingCalendar: workingCalendar,
            lessThanMinus3d: item["<-3d"],
            minus3d: item["-3d"],
            minus2d: item["-2d"],
            minus1d: item["-1d"],
            today: item.Today,
            plus1d: item["+1d"],
            plus2d: item["+2d"],
            plus3d: item["+3d"],
            plus4d: item["+4d"],
            plus5d: item["+5d"],
            plus6d: item["+6d"],
            plus7d: item["+7d"],
            moreThanPlus7d: item[">+7d"]
          };
        }
        return {
          name: item["Operation Task"],
          mot: item.MOT,
          daysVsEta: daysVsEta,
          workingCalendar: workingCalendar,
          lessThanMinus3d: Number(item["<-3d"]) || 0,
          minus3d: Number(item["-3d"]) || 0,
          minus2d: Number(item["-2d"]) || 0,
          minus1d: Number(item["-1d"]) || 0,
          today: Number(item.Today) || 0,
          plus1d: Number(item["+1d"]) || 0,
          plus2d: Number(item["+2d"]) || 0,
          plus3d: Number(item["+3d"]) || 0,
          plus4d: Number(item["+4d"]) || 0,
          plus5d: Number(item["+5d"]) || 0,
          plus6d: Number(item["+6d"]) || 0,
          plus7d: Number(item["+7d"]) || 0,
          moreThanPlus7d: Number(item[">+7d"]) || 0
        };
      });
    },

    // 处理ETA Tracking数据
    processEtaTrackingData() {
      this.etaTrackingItems = this.etaTrackingData.map(item => {
        // 根据描述设置固定的daysVsEta和workingCalendar值
        let daysVsEta = "";
        let workingCalendar = "Calendar"; // 所有项的Working/Calendar都为Calendar

        switch (item["ETA Tracking for Ocean In Transit"]) {
          case "Latest ETA for POD < today":
          case "Latest ETA for POD > booked ETA for POD":
            daysVsEta = 0;
            break;
          case "Latest ETA for POD + booked vs Requested In DC":
          case "Latest ETA for POD + transit vs Requested In DC":
            // 根据MOT设置不同的值
            if (item.MOT === "Truck") {
              daysVsEta = 5;
            } else if (item.MOT === "Intermodal") {
              daysVsEta = 22;
            } else {
              daysVsEta = 5;
            }
            break;
          case "idle at transit port":
          case "idle at port of discharge":
            daysVsEta = 0;
            break;
          default:
            daysVsEta = "";
        }

        return {
          description: item["ETA Tracking for Ocean In Transit"],
          mot: item.MOT,
          daysVsEta: daysVsEta,
          workingCalendar: workingCalendar,
          days1_7: Number(item["1-7d"]) || 0,
          days8_14: Number(item["8-14d"]) || 0,
          days15_21: Number(item["15-21d"]) || 0,
          daysOver22: Number(item[">22d"]) || 0
        };
      });
    },

    // 计算类别总数,转成数字
    getCategoryTotal(startIndex, endIndex) {
      let total = 0;
      for (let i = startIndex; i <= endIndex; i++) {
        // 转成数字
        total += Number(this.totalRow[i] || 0);
      }
      return total;
    },

    // PDF导出方法
    exportToPDF() {
      this.exporting = true;

      try {
        // 创建一个临时容器来存放所有要导出的内容
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.width = '100%';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.padding = '20px';
        tempContainer.style.boxSizing = 'border-box';
        tempContainer.style.zIndex = '-1'; // 隐藏在页面后面

        // 获取三个列表容器
        const locationControl = document.querySelector('.report-table-container');
        const operationsTasks = document.querySelector('.operations-tasks-container');
        const etaTracking = document.querySelector('.eta-tracking-container');

        if (!locationControl || !operationsTasks || !etaTracking) {
          //英文提示
          this.$message.error('Please contact the administrator, export failed');
          return;
        }

        // 克隆三个列表到临时容器
        const locationControlClone = locationControl.cloneNode(true);
        const operationsTasksClone = operationsTasks.cloneNode(true);
        const etaTrackingClone = etaTracking.cloneNode(true);

        // 从克隆的locationControl中移除导出按钮
        const exportButton = locationControlClone.querySelector('.el-button');
        if (exportButton) {
          exportButton.remove();
        }

        // 添加到临时容器
        tempContainer.appendChild(locationControlClone);
        tempContainer.appendChild(document.createElement('br'));
        tempContainer.appendChild(operationsTasksClone);
        tempContainer.appendChild(document.createElement('br'));
        tempContainer.appendChild(etaTrackingClone);

        // 增加所有文字字体大小的样式
        const fontSizeStyle = document.createElement('style');
        fontSizeStyle.innerHTML = `
          .report-table-container *,
          .operations-tasks-container *,
          .eta-tracking-container * {
            font-size: calc(inherit + 2px) !important;
          }
          .milestone-table th,
          .milestone-table td,
          .operations-tasks-table th,
          .operations-tasks-table td,
          .eta-tracking-table th,
          .eta-tracking-table td {
            font-size: calc(inherit + 2px) !important;
            padding: 8px 10px !important;
          }
        `;
        tempContainer.appendChild(fontSizeStyle);

        // 将临时容器添加到页面
        document.body.appendChild(tempContainer);

        // 获取临时容器的尺寸
        const rect = tempContainer.getBoundingClientRect();

        // 创建PDF实例，使用A4横向格式
        const doc = new jsPDF('landscape', 'mm', 'a4');

        // 获取A4页面尺寸（毫米）
        const a4Width = doc.internal.pageSize.getWidth();
        const a4Height = doc.internal.pageSize.getHeight();

        // 使用html2canvas捕获临时容器，使用更高分辨率
        html2canvas(tempContainer, {
          scale: 4, // 进一步提高分辨率
          useCORS: true,
          backgroundColor: '#ffffff',
          width: rect.width,
          height: rect.height,
          logging: false,
          windowWidth: rect.width,
          windowHeight: rect.height
        }).then(canvas => {
          try {
            console.log('Canvas生成成功:', canvas);

            // 获取canvas尺寸
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // 设置PDF边距
            const margin = 5; // 减小边距，增加内容区域
            const contentWidth = a4Width - (margin * 2);

            // 计算缩放比例，优先保证内容宽度适应页面
            const originalContentWidth = rect.width;
            const scale = contentWidth / originalContentWidth;

            // 计算最终图像尺寸
            const finalWidth = contentWidth;
            const finalHeight = (canvasHeight / 4) * scale; // 除以canvas的scale值

            // 计算需要多少页
            const pageHeight = a4Height - (margin * 2);
            const totalPages = Math.ceil(finalHeight / pageHeight);

            // 将图像添加到PDF，可能需要多页
            const imgData = canvas.toDataURL('image/png');

            for (let page = 0; page < totalPages; page++) {
              if (page > 0) {
                doc.addPage();
              }

              // 计算当前页的垂直偏移
              const yOffset = margin - (page * pageHeight);

              // 绘制图像，确保宽度充满页面内容区域
              doc.addImage(imgData, 'PNG', margin, yOffset, finalWidth, finalHeight);
            }

            // 保存PDF
            doc.save(`Destination_Milestone_${new Date().toISOString().slice(0, 10)}.pdf`);

            this.$message.success('PDF导出成功');
          } catch (pdfError) {
            this.$message.error('PDF创建失败: ' + pdfError.message);
            console.error('PDF错误:', pdfError);
          } finally {
            // 移除临时容器
            document.body.removeChild(tempContainer);
            this.exporting = false;
          }
        }).catch(htmlError => {
          // 移除临时容器
          document.body.removeChild(tempContainer);
          this.$message.error('内容捕获失败: ' + htmlError.message);
          console.error('HTML2Canvas错误:', htmlError);
          this.exporting = false;
        });
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
        console.error('导出错误:', error);
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.report-table-container {
  margin-top: 20px;
  overflow-x: hidden; /* 移除横向滚动条 */
}

.milestone-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #999;
  font-size: 12px;
  table-layout: auto; /* 自动布局，让表格适应容器 */
}

.milestone-table th,
.milestone-table td {
  border: 1px solid #999;
  padding: 6px 8px;
  text-align: center;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 允许单词换行 */
}

/* 位置控制表头 */
.location-control-header {
  background-color: #e6f3ff;
  text-align: left;
  vertical-align: top;
  padding: 10px;
  width: 250px;
}

.location-control-header div {
  margin-bottom: 5px;
  margin-top: 20px;
  font-size: 18px;
}

/* 类别表头 */
.category-header {
  vertical-align: middle;
  padding: 5px;
}

.category-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 类别总数表头 */
.category-total-header {
  font-size: 16px;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px 5px;
}

/* 类别颜色 */
.category-transit-pod,.category-port-discharge,.category-transit-dc,.category-delivered {
  background-color: #e6f3ff;
}


/* 子类别表头 */
.sub-category-header {
  background-color: #e6f3ff;
  font-size: 14px;
  font-weight: bold;
  padding: 4px;
  height: 60px;
  vertical-align: middle;
}

/* 子类别总数行 */
.sub-total-value {
  font-size: 16px;
  font-weight: bold;
}


/* 高亮单元格 */
.highlight-cell {
  font-size: 14px;
  font-weight: bold;
}
.highlight-cell-left {
  font-size: 14px;
}
.table-cell-header {
  font-size: 14px;
  font-weight: bold;
  padding: 10px !important;
}


/* Operations Tasks 表格样式 */
.operations-tasks-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #999;
  font-size: 14px;
  table-layout: auto; /* 自动布局，让表格适应容器 */
}

.operations-tasks-table th,
.operations-tasks-table td {
  border: 1px solid #999;
  padding: 4px 6px;
  text-align: center;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 允许单词换行 */
}

.operations-tasks-table th {
  background-color: #e6f3ff;
  font-weight: bold;
}

.operations-tasks-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* ETA Tracking 表格样式 */
.eta-tracking-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #999;
  font-size: 14px;
  table-layout: auto; /* 自动布局，让表格适应容器 */
}

.eta-tracking-table th,
.eta-tracking-table td {
  border: 1px solid #999;
  padding: 4px 6px;
  text-align: center;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 允许单词换行 */
}

.eta-tracking-table th {
  background-color: #e6f3ff;
  font-weight: bold;
}

.eta-tracking-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Exceptions 表格样式 */
.exceptions-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #999;
  font-size: 14px;
  table-layout: auto; /* 自动布局，让表格适应容器 */
}

.exceptions-table th,
.exceptions-table td {
  border: 1px solid #999;
  padding: 4px 6px;
  text-align: center;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 允许单词换行 */
}

.exceptions-table th {
  background-color: #e6f3ff;
  font-weight: bold;
}

.exceptions-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.report-card {
  overflow: auto;
}
/* 确保表格在小屏幕上自适应 */
@media (max-width: 1200px) {
  .milestone-table,
  .operations-tasks-table,
  .eta-tracking-table,
  .exceptions-table {
    font-size: 12px;
  }

  .location-control-header {
    width: 200px;
  }

  .sub-category-header {
    font-size: 12px;
    padding: 2px;
    height: auto;
  }

  .operations-tasks-table th,
  .operations-tasks-table td,
  .eta-tracking-table th,
  .eta-tracking-table td,
  .exceptions-table th,
  .exceptions-table td {
    padding: 2px 4px;
  }
}
</style>
