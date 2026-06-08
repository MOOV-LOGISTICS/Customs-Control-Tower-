<template xmlns="">
  <div class="app-container">
    <el-dialog title="Carrier" :visible.sync="dialogVisibleCarrier" width="640px">
      <ChooseCarrier @change-value="changeParentValue"></ChooseCarrier>
    </el-dialog>

    <div style="margin-bottom: 20px;">
      <el-card style="background: transparent;box-shadow: none!important;   ">
        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;" @click="bookedChange(false)" :class="{'avticePort':queryParams.shippingBooking==false}">
            <p style="font-size: 20px;">{{ notShipmentNum }}</p>
            <p>Not Booked</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;" @click="bookedChange(true)" :class="{'avticePort':queryParams.shippingBooking==true}">
            <p style="font-size: 20px;">{{ shipmentNum }}</p>
            <p>Booked</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          <div style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;" @click="newBookingChange(true)" :class="{'avticePort':queryParams.shippingNewBooking==true}">
            <p style="font-size: 20px;">{{ newBookingNum }}</p>
            <p>New booking</p>
          </div>
        </el-card>
      </el-card>
    </div>

    <el-card style="padding: 20px; ">
      <div style="padding-bottom: 20px;margin-bottom: 20px;">
        <!-- 搜索工作栏 -->
        <div style="padding: 10px 0px;">
          <div style="float: left;">
            <el-input
              v-model="queryParams.soRef"
              placeholder="MOOV ref"
              clearable
              @blur="queryParams.soRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1 ,handleQuery()"
              @clear=" handleQuery()"
            />
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-input
              v-model="queryParams.customerRef"
              placeholder="Customer ref"
              @blur="queryParams.customerRef = $event.target.value.trim()"
              @keyup.enter.native="queryParams.pageNo = 1 ,handleQuery()"
              clearable
              @clear=" handleQuery()"
            />
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-select clearable placeholder="POL" filterable v-model="queryParams.originPort" @clear="handleQuery">
              <el-option v-for="(item, index) in porList" :key="index + 'pol'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
            </el-select>
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-select filterable clearable placeholder="SO Type" v-model="queryParams.shipmentType" @clear="handleQuery">
              <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-select filterable clearable placeholder="Customer" v-model="queryParams.customerId" @clear="handleQuery">
              <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-select filterable clearable placeholder="Status" v-model="queryParams.status" @clear="handleQuery">
              <el-option label="Pending" value="0" />
              <el-option label="Accepted" value="1" />
              <el-option label="Rejected" value="2" />
            </el-select>
          </div>
          <div style="float: right;">
            <el-button type="primary" v-hasPermi="['shipment:create']" @click="createShipment">Create Shipment</el-button>
          </div>
          <el-button style=" margin-left: 20px;" type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
        </div>
        <!-- 列表 -->
        <div :style="{height:clientHeight+'px'}" style="float: left; width: calc(100%); position: relative;" v-loading="loading">
          <div style="overflow-y:auto; overflow-x: hidden;" :style="{ height: (clientHeight-55)+'px' }">
            <el-empty v-if="list.length == 0 && !loading" description="No Data"></el-empty>
            <el-row :gutter="0" style=" background: #fff;box-shadow: none!important;border: 1px solid #ddd;" v-for="(item,index) in list" :key="item.id" class="margin-top">
              <el-col :span="24" style="padding-top: 10px; padding-bottom: 10px;">
                <el-descriptions style="box-shadow: none; margin-bottom: -5px;" :colon="false" :column="5">
                  <el-descriptions-item label="Customer">{{item.customerName }}</el-descriptions-item>
                  <el-descriptions-item label="MOOV ref" content-class-name="car-css">
                    <el-link type="primary" style="margin-top: -1px;" :href="'/shipment/shippingBookingDetail?id='+item.id">
                      {{
                      item.soRef }}
                    </el-link>
                  </el-descriptions-item>
                  <el-descriptions-item label="Shipper ref">{{ item.shipperRef }}</el-descriptions-item>

                  <el-descriptions-item :label="$t('booking.pol')">
                    {{
                    item.originPort
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('booking.pod')">
                    {{
                    item.destinationPort
                    }}
                  </el-descriptions-item>

                  <!-- <el-descriptions-item label="Task Status">
                    <span @click="showTask(item,item.orderTaskDOS,index)" style="text-decoration: underline;cursor: pointer;">
                      {{ item.taskStatus }}
                    </span>
                  </el-descriptions-item>-->

                  <el-descriptions-item label="SO Type">{{item.shipmentType}}</el-descriptions-item>

                  <el-descriptions-item label="Shipper">{{ item.shipperCompany }}</el-descriptions-item>
                  <el-descriptions-item label="Consignee">{{ item.consigneeCompany }}</el-descriptions-item>
                  <el-descriptions-item label="Notify Party">{{ item.notifyCompany }}</el-descriptions-item>

                  <el-descriptions-item label contentStyle="display: flex; flex-wrap: wrap; align-items: center;">
                    <el-tag
                      v-if="item.containerDOList && item.containerDOList.length > 0"
                      style="margin-right: 5px; margin-top: 5px; font-size: 13px; "
                      v-for="container in item.containerDOList"
                      :key="container.id"
                    >{{ container.type }} x {{ container.qty }}</el-tag>
                  </el-descriptions-item>

                  <el-descriptions-item label="Customer Ref">{{ item.customerRef }}</el-descriptions-item>

                  <el-descriptions-item label>
                    <div style="float: right">
                      <span class="no-label" v-if="item.status==0">
                        <div v-if="item.shipmentId==null">
                          <el-popconfirm :title="'Accepted '+item.soRef+'?'" @confirm="updateStatus(item.id, 1, null)">
                            <el-button class="el-icon-check" slot="reference" type="success" style=" position: absolute;cursor: pointer;right: 85px; top: 0px;"></el-button>
                          </el-popconfirm>

                          <el-button class="el-icon-close" slot="reference" style="position: absolute;cursor: pointer;right: 30px; top: 0px;" type="warning" @click="closeShipping(item.id)"></el-button>
                        </div>
                      </span>
                      <span class="no-label" v-if="item.shipmentId" style="color:#409eff;font-weight: bold;position: absolute;cursor: pointer;right: 65px;top:0px;font-size: 14px;">Booked</span>
                      <span class="no-label" v-if="item.status==2">
                        <el-tag type="warning" @click="showDetail(item)" style=" position: absolute;cursor: pointer;right: 65px; font-size: 14px; top: 0px;">Rejected</el-tag>
                      </span>
                      <span class="no-label" v-if="item.status==1 && !item.shipmentId">
                        <el-checkbox
                          size="medium"
                          border
                          v-model="shippingIds"
                          :label="item.id"
                          :key="item.id"
                          :value="item.id"
                          @change="checkType(item)"
                          style="border: 1px solid #409eff;position: absolute;cursor: pointer;right: 65px;    top: 0px;"
                        ></el-checkbox>
                      </span>
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item label>
                    <div style="float: right">
                      <svg
                        v-if="!expanded[item.id]"
                        @click="toggleDetails(item.id)"
                        style="position: absolute;cursor: pointer; right: 10px; top:35px"
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 36L12 24L24 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M36 36L24 24L36 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <svg
                        v-if="expanded[item.id]"
                        @click="toggleDetails(item.id)"
                        style="position: absolute;cursor: pointer;right: 10px;top:35px "
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M36 12L24 24L12 12" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M36 24L24 36L12 24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <div>
                <el-descriptions style="box-shadow: none;height: 100%; width: 100%;  margin: 0px;" :colon="false" :column="5">
                  <el-descriptions-item label>
                    <el-collapse-transition>
                      <div v-show="expanded[item.id]" style="width: 100%;">
                        <el-tabs :ref="'tab'+item.id" v-model="item.key">
                          <el-tab-pane label="Operation Log" :name="'Logs'+item.id">
                            <el-timeline style="margin-top: 20px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
                              <el-timeline-item :timestamp=" logs.userName + '   ' + parseTime(logs.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" placement="top" v-for="(logs, x) in item.statusLogDOS" :key="x">
                                <h4>{{covStatus(logs.status)}}</h4>
                                <div v-if="logs.status == 6">
                                  <el-link type="primary" :href="'/shipment/amendShipping?id='+item.id + '&apId='+logs.apId" target="_blank">{{item.soRef }}</el-link>
                                </div>
                                <div style="max-height: 200px;" v-html="logs.remark"></div>
                              </el-timeline-item>
                            </el-timeline>
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                    </el-collapse-transition>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-row>
          </div>
          <!-- 分页组件 -->
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getList" />
        </div>
      </div>
    </el-card>

    <el-dialog title="Rejected" :visible.sync="showCloseRemark" width="70%" append-to-body>
      <el-form label-width="0px" ref="closeShippingForm" :model="closeShippingForm" :show-message="false">
        <el-form-item label required prop="closeRemark">
          <el-input type="textarea" :rows="5" placeholder="Remark..." v-model="closeShippingForm.closeRemark"></el-input>
        </el-form-item>
        <el-button size="mini" type="primary" style="float:right;" v-if="showCloseBut" :loading="closeShippingLoading" @click="submitCloseShipping">
          {{
          $t("purchaseOrder.confirm") }}
        </el-button>
        <el-button size="mini" style="float:right; margin-right: 10px;" :loading="closeShippingLoading" @click="showCloseRemark = false">
          {{
          $t("purchaseOrder.cancel") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
      <el-table :data="taskDetailData" style="width: 100%">
        <el-table-column prop="date" label="Task Name" width="150px">
          <template v-slot="scope">{{ scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="MOOV Ref" width="150px">
          <template v-slot="scope">
            <span
              style="text-decoration: underline;
                                          cursor: pointer;
                                    color: #004F7C;
                                    font-weight: bold;"
              @click="toOrder2(scope.row.orderNumber)"
            >
              {{ scope.row.orderNumber
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="urgentDate" label="Urgent Date">
          <template v-slot="scope">{{ parseTime(scope.row.urgentDate) }}</template>
        </el-table-column>
        <el-table-column prop="dueDate" label="Due date">
          <template v-slot="scope">{{ parseTime(scope.row.dueDate) }}</template>
        </el-table-column>
        <el-table-column v-if="title.endsWith('finished')" prop="updateTime" label="Complete date">
          <template v-slot="scope">{{ parseTime(scope.row.updateTime) }}</template>
        </el-table-column>

        <el-table-column label="Actions">
          <template v-slot="scope">
            <el-popover placement="top-start" title width="200" trigger="hover" content="Send reminder">
              <i @click="sendEmail(scope.row)" slot="reference" v-if="(showTaskStatus(scope.row)=='Overdue'||showTaskStatus(scope.row)=='Urgent')&&user.deptId!=scope.row.partyId" class="el-icon-message"></i>
            </el-popover>
            <i v-show="scope.row.status==1&&user.deptId==scope.row.partyId" @click="handleTask(scope.row)" style="cursor: pointer;" class="el-icon-edit"></i>
            <i v-if="scope.row.taskName=='QC Approve'&&scope.row.status==2" @click="viewQcResult(scope.row)" class="el-icon-view"></i>
            <i v-if="scope.row.taskName!='QC Approve'&&scope.row.jsonData!=null&&scope.row.status==2" @click="viewTask(scope.row)" class="el-icon-view"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl">
      <div class="cardx" v-for="h in taskList">
        <div class="status1Div">
          <span
            v-if="showTaskStatus(h)!=''"
            class="status2"
            :class="[showTaskStatus(h)=='Possible' ? 'color2' : ''
                      , showTaskStatus(h)=='Finished' ? 'color1' : ''
                      , showTaskStatus(h)=='Urgent' ? 'color3' : ''
                      , showTaskStatus(h)=='Overdue' ? 'color4' : '']"
          >{{showTaskStatus(h)}}</span>
        </div>
        <div class="order" style="margin-bottom: 5px;">MOOV Ref:{{ h.orderNumber }}</div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>

        <div v-if="h.status==2&&h.taskName=='Accept booking'&&h.jsonData!=null&&h.jsonData!=''&&JSON.parse(h.jsonData)!=null
          &&JSON.parse(h.jsonData).reason!=null&&JSON.parse(h.jsonData).reason!=''">
          <div style="clear: both;"></div>
          <div class="date" style="margin-bottom: 5px;">Reject Reason：{{ JSON.parse(h.jsonData).reason }}</div>
        </div>

        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==2">
          Complete Date：{{
          parseTime(h.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}
        </div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Urgent Date：{{ parseTime(h.urgentDate) }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Due Date：{{ parseTime(h.dueDate) }}</div>
        <div style="margin-bottom: 5px; float: right;cursor: pointer;">
          <el-popover placement="top-start" title width="200" trigger="hover" content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" v-if="(showTaskStatus(h)=='Overdue'||showTaskStatus(h)=='Urgent')&&user.deptId!=h.partyId" class="el-icon-message"></i>
          </el-popover>

          <i v-show="h.status==1&&user.deptId==h.partyId" @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i>
          <i v-if="h.jsonData!=null&&h.status==2" @click="viewTask(h)" class="el-icon-view"></i>
        </div>
        <div style="clear: both;"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getOrder, getOrderPage, countShippingOrderShipment, updateShippingOrderStatus, getCustomerList } from '@/api/shipping/order'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
import '@icon-park/vue/styles/index.css'
import { IconPark } from '@icon-park/vue/es/all'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import ChooseCarrier from '@/views/salesOrder/components/choose-carrier'
import { getTaskNames, updateTask, getTaskList, reminder } from '@/api/order/task'
import { getUserProfile } from '@/api/system/user'

export default {
  name: 'Order',
  components: { IconPark, ChooseCarrier },
  data() {
    return {
      expanded: {},
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // shipping order列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        soRef: null,
        customerRef: null,
        originPort: null
      },
      clientHeight: null,
      notShipmentNum: 0,
      shipmentNum: 0,
      newBookingNum: 0,
      shippingNewBooking: null,
      shippingIds: [],
      porList: [],
      dialogVisibleCarrier: false,
      showCloseRemark: false,
      closeShippingLoading: false,
      closeShippingForm: {
        closeRemark: '',
        id: null
      },
      showCloseBut: true,
      customerList: [],
      checkedType: '',
      user: {},

      expanded: {},
      drawer2: false,
      hiddenTask: false,
      taskLoading: false,
      task3: [],
      task3Temp: [
        { taskName: 'Submit booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Accept booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Carrier booking', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'Booking confirmation', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'SI/VGM by shipper', possible: 0, urgent: 0, overdue: 0, finished: 0 },
        { taskName: 'SI/VGM submit to carrier', possible: 0, urgent: 0, overdue: 0, finished: 0 }
      ],
      centerDialogVisible: false,
      cancelRemark: null,
      shipmentId: null,
      taskDetailDataVisible: false,
      taskDetailData: [],
      title: '',
      departureConfirmFormVisible: false,
      arrivalConfirmFormVisible: false,
      taskList: [],
      drawer: false,
      checkCustomerIds: []
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.clientHeight = clientHeight - 330
    })
    getUserProfile().then(response => {
      this.user = response.data
    })
    this.getList()

    this.getNum()
    this.getOriginDeliveryList()
    getCustomerList().then(res => {
      this.customerList = res.data
    })
  },
  created() {
    var clientHeight = document.documentElement.clientHeight
    this.clientHeight = clientHeight - 330
  },
  methods: {
    checkPermi,
    checkType(item) {
      if (this.shippingIds.length == 0) {
        this.checkedType = ''
        this.checkCustomerIds = []
        return
      }
      //检查不能创建相同的shipmentType
      if (this.checkedType) {
        var removeFlag = false
        if (this.checkedType != item.shipmentType) {
          this.$notify({
            message: 'FCL SO is not allowed to make consol',
            type: 'warning'
          })
          // 如果shipmentType不同则移除
          removeFlag = true
        } else if (this.shippingIds.length > 1 && item.shipmentType == 'FCL') {
          this.$notify({
            message: 'FCL Shipper Booking is not allowed to make consol',
            type: 'warning'
          })
          removeFlag = true
        }
        if (this.checkCustomerIds.length > 0 && !this.checkCustomerIds.includes(item.customerId)) {
          this.$notify({
            message: 'Customer not the same',
            type: 'warning'
          })
          removeFlag = true
        }
        if (item.shipmentType == 'LCL') {
          this.checkCustomerIds.push(item.customerId)
        }
        if (removeFlag) {
          var index = this.shippingIds.indexOf(item.id)
          if (index != -1) {
            this.shippingIds.splice(index, 1)
          }
          index = this.checkCustomerIds.indexOf(item.customerId)
          if (index != -1 && item.shipmentType == 'LCL') {
            this.checkCustomerIds.splice(index, 1)
          }
          return
        }
      }
      this.checkedType = item.shipmentType
    },
    newBookingChange(flag) {
      if (this.queryParams.shippingNewBooking == flag) {
        this.queryParams.shippingNewBooking = null
      } else {
        this.queryParams.shippingNewBooking = flag
        this.queryParams.shippingBooking = null
      }
      this.getList()
    },
    bookedChange(flag) {
      this.queryParams.shippingNewBooking = null
      if (this.queryParams.shippingBooking == flag) {
        this.queryParams.shippingBooking = null
      } else {
        this.queryParams.shippingBooking = flag
      }
      this.getList()
    },
    showDetail(item) {
      this.showCloseRemark = true
      this.closeShippingForm.closeRemark = item.rejectedText
      this.showCloseBut = false
    },
    closeShipping(id) {
      this.showCloseRemark = true
      this.showCloseBut = true
      this.closeShippingForm.id = id
      this.closeShippingForm.closeRemark = null
    },
    submitCloseShipping() {
      this.$refs['closeShippingForm'].validate(valid => {
        if (valid) {
          this.closeShippingLoading = true
          this.updateStatus(this.closeShippingForm.id, 2, this.closeShippingForm.closeRemark)
        }
      })
    },
    updateStatus(id, status, rejectedText) {
      updateShippingOrderStatus({ id: id, status: status, rejectedText: rejectedText }).then(res => {
        this.closeShippingLoading = false
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
        this.getList()
        this.closeShippingForm.id = null
        this.closeShippingForm.closeRemark = null
        this.showCloseRemark = false
      })
    },
    getNum() {
      countShippingOrderShipment().then(res => {
        this.notShipmentNum = res.data.notShipmentNum
        this.shipmentNum = res.data.shipmentNum
        this.newBookingNum = res.data.newBookingNum
      })
    },
    createShipment() {
      this.dialogVisibleCarrier = true
    },
    changeParentValue(value) {
      this.carrier = value
      if (this.carrier == null || this.carrier == '') {
        return
      }
      var ids = this.shippingIds
      if (!ids.length > 0) {
        this.$notify({
          message: 'Please select booking data first',
          type: 'warning'
        })
        return
      }
      if (this.carrier == 'TSHG') {
        this.$router.push('/shipment/create?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking')
      } else {
        this.$router.push('/shipment/create-shipment?carrier=' + this.carrier + '&spoIds=' + ids.join(',') + '&source=spoBooking')
      }
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index])
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.porList = res.data
      })
    },
    covStatus(status) {
      if (status == 2) {
        return 'Rejected'
      } else if (status == 1) {
        return 'Accepted'
      } else if (status == 3) {
        return 'Cancel'
      } else if (status == 4) {
        return 'update'
      } else if (status == 5) {
        return 'SI/VGM Submit'
      } else if (status == 6) {
        return 'Amend'
      } else {
        return 'Requested'
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getOrderPage(this.queryParams).then(response => {
        this.list = response.data.list
        for (var i = 0; i < response.data.list.length; i++) {
          response.data.list[i].key = 'Logs' + response.data.list[i].id
        }
        this.total = response.data.total
        this.loading = false
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm('是否确认导出所有shipping order数据项?')
        .then(() => {
          this.exportLoading = true
          return exportOrderExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'shipping order.xls')
          this.exportLoading = false
        })
        .catch(() => {})
    },

    getTaskNames() {
      this.taskLoading = true
      getTaskNames({ type: '1' }).then(res => {
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.taskNames = res.data
        this.task3 = this.task3.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        this.overview()
      })
    },
    overview() {
      getTaskList({
        status: 1,
        statuskey: 'Possible',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.possibleList = res.data
        this.setData(res, 'possible')
      })
      getTaskList({
        status: 1,
        statuskey: 'Urgent',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.urgentList = res.data
        this.setData(res, 'urgent')
      })
      getTaskList({
        status: 1,
        statuskey: 'Overdue',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.overdueList = res.data
        this.setData(res, 'overdue')
      })
      getTaskList({
        status: 2,
        source: 'booking-order',
        source: 'booking-order',
        bookingNumber: this.queryParams.bookingNumber,
        shipmentStatus: this.queryParams.status,
        shipmentBookingNumber: this.queryParams.shipmentBookingNumber,
        originPort: this.queryParams.originPort
      }).then(res => {
        this.finishedList = res.data
        this.setData(res, 'finished')
        this.taskLoading = false
      })
    },
    setData(res, key) {
      for (var task of this.task3) {
        if (key == 'finished') task.finished = 0
        if (key == 'overdue') task.overdue = 0
        if (key == 'possible') task.possible = 0
        if (key == 'urgent') task.urgent = 0
      }
      for (var i = 0; i < res.data.length; i++) {
        {
          var index = this.task3.findIndex(item => item.taskName === res.data[i].taskName)
          if (index < 0) {
            continue
          }
          if (!this.task3[index][key + 'data'] || i == 0) {
            this.task3[index][key + 'data'] = []
          }
          this.task3[index][key + 'data'].push(res.data[i])
          this.task3[index][key] = this.task3[index][key] + 1
        }
      }
    },
    openOverview() {
      this.drawer2 = !this.drawer2
    },
    showTaskStatus(h) {
      if (h.status == 0) {
        return ''
      } else if (h.status == 1) {
        if (Date.now() > h.dueDate) {
          return 'Overdue'
        } else if (Date.now() > h.urgentDate) {
          return 'Urgent'
        }
        return 'Possible'
      } else if (h.status == 2) {
        return 'Finished'
      }
    },
    showTask(item, list, index) {
      if (item.status == 100 || item.status == 300) {
        return
      }
      console.log(list)
      console.log(index)
      this.orderIndex = index
      this.drawer = true
      this.taskList = list
      if (list.length > 0) {
        this.title = list[0].orderNumber
      }
    },

    sendEmail(task) {
      reminder({
        status: this.showTaskStatus(task),
        orderNumber: task.orderNumber,
        taskName: task.taskName,
        partyId: task.partyId
      }).then(res => {
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        })
      })
    },
    toOrder2(orderNumber) {
      this.taskDetailDataVisible = false
      this.drawer2 = false
      this.$set(this.queryParams, 'bookingNumber', orderNumber)
      this.getList()
    },
    handleTask(task) {
      this.view = false
      this.task = task
      this.form = {}
      if (task.taskName == 'Accept booking') {
        const url = this.$router.resolve({
          path: '/shipment/shippingBookingDetail'
        }).href
        window.location.href = url + '?id=' + task.orderId
      } else if (task.taskName == 'Carrier booking') {
        this.drawer = false
        this.queryParams.shippingBooking = false
        this.queryParams.status = '1'
        this.getList()
      } else if (task.taskName == 'Booking confirmation') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM by shipper') {
        this.drawer = false
      } else if (task.taskName == 'SI/VGM submit to carrier') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      }
    },

    viewTask(task) {
      this.view = true
      this.task = task
      if (task.jsonData != null && task.jsonData != '') {
        this.form = JSON.parse(task.jsonData)
      }

      if (task.taskName == 'Accept booking') {
        const url = this.$router.resolve({
          path: '/shipment/shippingBookingDetail'
        }).href
        window.location.href = url + '?id=' + task.orderId
      } else if (task.taskName == 'Carrier booking') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'Booking confirmation') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM by shipper') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      } else if (task.taskName == 'SI/VGM submit to carrier') {
        this.$router.push('/shipment/detail?id=' + JSON.parse(task.jsonData).shipmentId)
      }
    },
    submitTask() {
      this.task.jsonData = JSON.stringify(this.form)
      updateTask(this.task).then(res => {
        this.crdFormVisible = false
        this.inspectionFormVisible = false
        this.pickupFormVisible = false
        this.containerStuffingFormVisible = false
        this.customClearanceFormVisible = false
        this.departureConfirmFormVisible = false
        this.arrivalConfirmFormVisible = false
        this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId)
        this.getList()
      })
    }
  }
}
</script>
<style>
.shipment-logo .partyLogo {
  position: relative !important;
  top: 23px !important;
  margin-left: 20px !important;
}
.car-css {
  padding-bottom: 4px;
}
span.el-descriptions-item__label.shipment-status-class {
  margin-right: 0px !important;
}

.el-checkbox.is-bordered.el-checkbox--medium {
  padding: 7px 12px 7px 12px;
}
.margin-top.el-row {
  padding: 0px 0px 15px 15px;
}
.avticePort {
  background-color: #3a71a8;
  color: #fff;
}

p {
  margin: 0px;
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
