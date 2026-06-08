<template>
  <div
    class="app-container"
    style="width: 100%; margin: 0 auto; padding-top: 20px"
  >
    <div style="margin-bottom: 20px">
      <el-card style="background: transparent; box-shadow: none !important">
        <el-card
          class="pd-20"
          style="float: left; width: auto; margin-right: 20px"
        >
          <span
            v-hasPermi="['shipment:container-track:export']"
            @click="handleExport"
          >
            <icon-park
              type="inbox-download-r"
              theme="filled"
              size="48"
              fill="#004F7C"
              strokeLinejoin="miter"
              strokeLinecap="square"
            />
          </span>
        </el-card>

        <el-card
          class="pd-20"
          style="float: left; width: auto; margin-right: 20px"
        >
          <img
            :src="notReturnrdIcon"
            alt="Example Image"
            class="icon-image"
            style="border-right: 1px solid #ddd"
          />
          <div
            @click="returnedChange(false)"
            style="
              cursor: pointer;
              padding: 0px 15px;
              border-radius: 10px;
              float: right;
              line-height: 24px;
              margin-left: 10px;
            "
          >
            <p style="font-size: 20px">{{ returnedDataInfo.notReturned }}</p>
            <p>Not Returned</p>
          </div>
        </el-card>

        <el-card
          class="pd-20"
          style="float: left; width: auto; margin-right: 20px"
        >
          <!-- <icon-park style="border-right: 1px solid #ddd;" type="noun-stopwatch" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/> -->
          <img
            :src="returnrdIcon"
            alt="Example Image"
            class="icon-image"
            style="border-right: 1px solid #ddd"
          />
          <div
            @click="returnedChange(true)"
            style="
              cursor: pointer;
              padding: 0px 15px;
              border-radius: 10px;
              float: right;
              line-height: 24px;
              margin-left: 10px;
            "
          >
            <p style="font-size: 20px">{{ returnedDataInfo.returned }}</p>
            <p>Returned</p>
          </div>
        </el-card>
      </el-card>
    </div>
    <el-card class="pd-20">
      <div class="container-track">
        <!-- Applied new free time -->

        <!-- 搜索工作栏 -->
        <transition name="el-zoom-in-center">
          <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
          >
            <div style="float: left; padding-top: 8px">
              <div style="float: left; padding: 10px 0px">
                <el-select
                  filterable
                  v-model="queryParams.carrier"
                  placeholder="Carrier"
                  clearable
                >
                  <el-option
                    v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
                    :key="dict.value"
                    :label="dict.label + ' (' + dict.value + ')'"
                    :value="dict.value"
                  />
                </el-select>
              </div>
              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-input
                  placeholder="Booking Number"
                  v-model="queryParams.bookingNumber"
                  clearable
                  @keyup.enter.native="handleQuery"
                >
                </el-input>
              </div>

              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-select
                  filterable
                  v-model="queryParams.pickUp"
                  placeholder="Pick up status"
                  clearable
                >
                  <el-option label="Pending" value="0" />
                  <el-option label="Possible" value="1" />
                  <el-option label="Urgent" value="2" />
                  <el-option label="Overdue" value="3" />
                  <el-option label="Ok" value="4" />
                </el-select>
              </div>
              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-select
                  v-model="queryParams.emptyReturn"
                  placeholder="Empty return status"
                  clearable
                >
                  <el-option label="Pending" value="0" />
                  <el-option label="Possible" value="1" />
                  <el-option label="Urgent" value="2" />
                  <el-option label="Overdue" value="3" />
                  <el-option label="Ok" value="4" />
                </el-select>
              </div>

              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-select
                  v-model="queryParams.currentCode"
                  placeholder="Current status"
                  clearable
                >
                  <el-option label="Vessel Arrived" value="BDAR" />
                  <el-option label="Vessel Departed" value="DLPT" />
                  <el-option label="Vessel Discharged" value="DSCH" />
                  <el-option label="Feeder Discharged" value="FDDC" />
                  <el-option label="Feeder Departed" value="FDDP" />
                  <el-option label="Feeder Loaded" value="FDLB" />
                  <el-option label="Received" value="GITM" />
                  <el-option label="Gated in" value="GTIN" />
                  <el-option label="Gated out" value="GTOT" />
                  <el-option label="Rail Departed" value="IRDP" />
                  <el-option label="Loaded" value="LOBD" />
                  <el-option label="Empty Returned" value="RCVE" />
                  <el-option label="Drop-off" value="STCS" />
                  <el-option label="Pick-up" value="STSP" />
                  <el-option label="T/S Vessel Arrived" value="TSBA" />
                  <el-option label="T/S Vessel Discharged" value="TSDC" />
                  <el-option label="T/S Vessel Departed" value="TSDP" />
                  <el-option label="T/S Vessel Loaded" value="TSLB" />
                </el-select>
              </div>
              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-select
                  v-model="queryParams.vessel"
                  placeholder="Vessel"
                  clearable
                >
                  <el-option
                    v-for="item in vesselList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-select
                  v-model="queryParams.voyage"
                  placeholder="Voyage"
                  clearable
                >
                  <el-option
                    v-for="item in yoyageList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div style="float: left; margin-left: 5px; padding: 10px 0px">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleQuery"
                  >Search</el-button
                >
              </div>
            </div>
          </el-form>
        </transition>

        <!-- 列表 -->
        <el-table v-loading="loading" :data="list" :height="height">
          <!-- <el-table-column label="id" align="center" prop="id" /> -->
          <el-table-column
            label="Carrier"
            width="180px"
            align="center"
            prop="carrierStr"
          />
          <el-table-column
            label="Booking Number"
            align="center"
            prop="bookingNumber"
            width="130px"
          />
          <el-table-column
            label="Container Number"
            align="center"
            prop="containerNumber"
            width="120px"
          />
          <el-table-column
            label="Container Type"
            align="center"
            prop="containerType"
            width="100px"
          />
          <el-table-column
            label="Port of discharge"
            align="center"
            prop="port"
            width="130px"
          />

          <el-table-column
            label="Free demurrage(Days)"
            align="center"
            prop="freeDemurrage"
            width="130px"
          >
            <template v-slot="scope">
              <span>{{ scope.row.freeDemurrage }} days</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Free detention(Days)"
            align="center"
            prop="freeDetention"
            width="130px"
          >
            <template v-slot="scope">
              <span>{{ scope.row.freeDetention }} days</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Free Storage(Days)"
            align="center"
            prop="freeStorage"
            width="130px"
          >
            <template v-slot="scope">
              <span>{{ scope.row.freeStorage }} days</span>
            </template>
          </el-table-column>

                    <el-table-column label="Combined free(Days)" align="center" prop="combinedFree" width="130px">
                      <template v-slot="scope">
                        <span>{{ scope.row.combinedFree?scope.row.combinedFree:'-' }} days</span>
                      </template>
                    </el-table-column>

          <el-table-column
            label="ETA (POD)"
            align="center"
            prop="eta"
            width="130px"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.eta == null
                  ? "Pending"
                  : parseTime(scope.row.eta)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="ATA (POD)"
            align="center"
            prop="ata"
            width="130px"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.ata == null
                  ? "Pending"
                  : parseTime(scope.row.ata)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Discharge POD date"
            align="center"
            prop="dischargePodTime"
            width="180"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.dischargePodTime == null
                  ? "Pending"
                  : parseTime(scope.row.dischargePodTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Pick up" align="center" prop="pickUpStr">
            <template v-slot="scope">
              <div :class="getPickUpStrClass(scope.row)">
                {{ scope.row.pickUpStr }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Pick up date"
            align="center"
            prop="pickUpTime"
            width="180"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.pickUpTime == null
                  ? "Pending"
                  : parseTime(scope.row.pickUpTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Empty return"
            align="center"
            prop="emptyReturnStr"
          >
            <template v-slot="scope">
              <div :class="getEmptyReturnStrClass(scope.row)">
                {{ scope.row.emptyReturnStr }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Empty return date"
            align="center"
            prop="emptyReturnTime"
            width="180"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.emptyReturnTime == null
                  ? "Pending"
                  : parseTime(scope.row.emptyReturnTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Current Status"
            align="center"
            prop="currentDescription"
            width="100"
          >
            <template v-slot="scope">
              <span>{{
                scope.row.currentDescription == null
                  ? scope.row.currentCode
                  : scope.row.currentDescription
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            align="center"
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['shipment:container-track:update']"
                >Edit</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 对话框(添加 / 修改) -->
        <el-dialog
          :title="title"
          :visible.sync="open"
          width="900px"
          v-dialogDrag
          append-to-body
        >
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <p style="font-weight: 700">
              Booking Number : {{ form.bookingNumber }}
            </p>

            <table>
              <tr style="height: 50px; font-weight: 700">
                <td>Container Number&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>
                  POD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
                <td>Free demurrage(Days)&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Free detention(Days)&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Free Storage(Days)&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Combined free(Days)&nbsp;&nbsp;&nbsp;&nbsp;</td>
              </tr>
              <tr>
                <td>{{ form.containerNumber }}</td>
                <td>{{ form.dischargePort }}</td>
                <td>
                  <el-input
                    type="number"
                    v-model="form.freeDemurrage"
                    placeholder="Free demurrage"
                  />
                </td>
                <td>
                  <el-input
                    type="number"
                    v-model="form.freeDetention"
                    placeholder="Free detention"
                  />
                </td>
                <td>
                  <el-input
                    type="number"
                    v-model="form.freeStorage"
                    placeholder="Free Storage"
                  />
                </td>
                                <td>
                                  <el-input type="number" v-model="form.combinedFree" placeholder="Combined free" />
                                </td>
              </tr>
            </table>

            <!-- <el-column disabled label="Container Number" prop="containerNumber">
              <span>{{ form.containerNumber }}</span>
          </el-column>

        <el-column disabled label="POD" prop="dischargePort">
          <span>{{ form.dischargePort }}</span>
        </el-column>
        <el-column label="Free demurrage(Days)" prop="freeDemurrage">
        </el-column>
        <el-column label="Free detention(Days)" prop="freeDetention">
          <el-input v-model="form.freeDetention" placeholder="Free detention" />
        </el-column>
        <el-column label="Free Storage(Days)" prop="freeStorage">
          <el-input v-model="form.freeStorage" placeholder="Free Storage" />
        </el-column> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">Submit</el-button>
            <el-button @click="cancel">Cancel</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.Pending {
  color: #3d3d3d;
}
.Possible {
  color: #2ac84f;
}
.Urgent {
  color: #e8822f;
}
.Overdue {
  color: #ea0000;
}
.Done {
  color: #2ac84f;
}
.Done1 {
  color: #e8822f;
}
.Done2 {
  color: #ea0000;
}
p {
  margin: 0px;
}
.not-check-css {
  border-color: red;
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
  content: "";
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
.icon-image {
  width: 50px; /* 设置图片宽度 */
  height: 50px; /* 设置图片高度 */
}
</style>

<script>
import {
  createContainerTrack,
  updateContainerTrack,
  deleteContainerTrack,
  getContainerTrack,
  getContainerTrackPage,
  exportContainerTrackExcel,
  trackReport,
} from "@/api/shipment/containerTrack";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getCurrentUserVesselAndYoyageOptions } from "@/api/shipment/router";
import "@icon-park/vue/styles/index.css";
import { IconPark } from "@icon-park/vue/es/all";
import returnrdIcon from "@/assets/blue-stopwatch.png";
import notReturnrdIcon from "@/assets/red-stopwatch.png";
export default {
  name: "ContainerTrack",
  components: {
    IconPark,
  },
  data() {
    return {
      vesselList: [],
      yoyageList: [],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // shipment_container_overtime列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        carrier: null,
        bookingNumber: null,
        containerNumber: null,
        containerType: null,
        dischargePort: null,
        freeDemurrage: null,
        freeDetention: null,
        freeStorage: null,
        dischargePodTime: [],
        pickUp: null,
        pickUpTime: [],
        emptyReturn: null,
        emptyReturnTime: [],
        currentStatus: null,
        currentCode: null,
        createTime: [],
        vessel: null,
        voyage: null,
        isNotReturned: null,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      carriers: [],
      polList: [],
      podList: [],
      pStatus: {
        0: "Pending",
        1: "Possible",
        2: "Urgent",
        3: "Overdue",
        4: "Done",
      },
      returnrdIcon,
      notReturnrdIcon,
      returnedDataInfo: {
        returned: 0,
        notReturned: 0,
      },
      height: '',
    };
  },
  created() {
    this.remoteMethodCarriers();
    getCurrentUserVesselAndYoyageOptions().then((res) => {
      this.vesselList = res.data.vessels;
      this.yoyageList = res.data.yoyages;
    });
    this.returnedInfo();

    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 360
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      console.log(this.queryParams);
      getContainerTrackPage(this.queryParams).then((response) => {
        for (var temp of response.data.list) {
          temp.pickUpStr = this.pStatus[temp.pickUp];
          temp.emptyReturnStr = this.pStatus[temp.emptyReturn];
          var carriers = this.carriers.filter((item) => {
            return item.value === temp.carrier;
          });
          if (carriers.length > 0) {
            temp.carrierStr = carriers[0].label;
          }
          var pods = this.podList.filter((item) => {
            return item.code === temp.dischargePort;
          });
          if (pods.length > 0) {
            temp.dischargePortStr = pods[0].name;
          }
        }
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        carrier: undefined,
        bookingNumber: undefined,
        containerNumber: undefined,
        containerType: undefined,
        dischargePort: undefined,
        freeDemurrage: undefined,
        freeDetention: undefined,
        freeStorage: undefined,
        combinedFree: undefined,
        dischargePodTime: undefined,
        pickUp: undefined,
        pickUpTime: undefined,
        emptyReturn: undefined,
        emptyReturnTime: undefined,
        currentStatus: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getContainerTrack(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "Applied new free time";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          this.open = false;
          this.loading = true;
          updateContainerTrack(this.form).then((response) => {
            this.loading = false;
            this.$modal.msgSuccess("Success");
            this.getList();
          });
          return;
        }
        // 添加的提交
        createContainerTrack(this.form).then((response) => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('Delete id"' + id + '"?')
        .then(function () {
          return deleteContainerTrack(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm("Confirm the export of all data items?")
        .then(() => {
          this.exportLoading = true;
          return exportContainerTrackExcel(params);
        })
        .then((response) => {
          this.$download.excel(response, "Destination.xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    remoteMethodCarriers() {
      this.carriers = [];
      this.carriers = getDictDatas(DICT_TYPE.CARRIER);
      this.getOriginDeliveryList();
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then((res) => {
        this.polList = res.data;
        this.podList = res.data;
        this.getList();
      });
    },
    getPickUpStrClass(row) {
      if (row.dischargePodTime != null && row.pickUpTime != null) {
        row.pickUpStr = "Done";
        if (row.pickUp == 2) {
          return "Done1";
        } else if (row.pickUp == 3) {
          return "Done2";
        } else {
          return "Done";
        }
      } else {
        return row.pickUpStr;
      }
    },
    getEmptyReturnStrClass(row) {
      if (row.pickUpTime != null && row.emptyReturnTime != null) {
        row.emptyReturnStr = "Done";
        if (row.emptyReturn == 2) {
          return "Done1";
        } else if (row.emptyReturn == 3) {
          return "Done2";
        } else {
          return "Done";
        }
      } else {
        return row.emptyReturnStr;
      }
    },
    returnedChange(flag) {
      if (flag) {
        this.queryParams.currentCode = "RCVE";
      } else {
        this.queryParams.isNotReturned = false;
      }

      this.getList();
      // 清除查询参数
      this.queryParams.currentCode = null;
      this.queryParams.isNotReturned = null;
    },
    returnedInfo() {
      trackReport().then((res) => {
        console.log(res.data);
        this.returnedDataInfo = res.data;
      });
    },
  },
};
</script>
