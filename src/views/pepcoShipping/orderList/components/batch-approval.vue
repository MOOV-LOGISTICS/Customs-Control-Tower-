<template>
  <el-dialog width="80%" title="Batch Approval" :visible.sync="dialogVisible">
      <div style="padding: 10px 0px;">
          <div style="float: left;">
            <el-input v-model="listQuery.soRef" placeholder="MOOV ref" clearable
              @blur="listQuery.soRef = $event.target.value.trim()"
              @keyup.enter.native="listQuery.pageNo = 1, handleQuery()" @clear=" handleQuery()" />
          </div>
          <div style="float: left;margin-left: 5px;">
            <el-input v-model="listQuery.customerRef" placeholder="Order Number"
              @blur="listQuery.customerRef = $event.target.value.trim()"
              @keyup.enter.native="listQuery.pageNo = 1, handleQuery()" clearable @clear=" handleQuery()" />
          </div>
          <!-- <div style="float: left;margin-left: 5px;">
            <el-input v-model="listQuery.shipmentRef" placeholder="Shipment Ref"
              @blur="listQuery.shipmentRef = $event.target.value.trim()"
              @keyup.enter.native="listQuery.pageNo = 1, handleQuery()" clearable @clear=" handleQuery()" />
          </div> -->

          <!-- <div v-hasPermi="['shipment:create']" style="float: right;">
            <el-button type="primary" @click="createShipment">Create Shipment</el-button>
          </div>
          <div v-hasPermi="['preassign:create']" style="float: right;margin-right: 10px;">
            <el-button @click="preAssgineOpen" size="mini" type="primary">Transport Pre-assign</el-button>
          </div>
          <div v-hasPermi="['pepco:shipping-order:batch-approval']" style="float: right;margin-right: 10px;">
            <el-button type="primary" @click="handleBatchApproval">Batch Approval</el-button>
          </div> -->

          <el-button style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
          <div style='float:left;margin-left: 5px;'>
            <el-popover placement="bottom" title="Filter" width="400" trigger="click">
              <el-form>
                <!-- <el-row :gutter="10" style="margin-bottom: 15px;"> -->
                  <!-- <el-col :span="12">
                    <el-select multiple clearable v-model="listQuery.dcList" placeholder="DC Code" filterable>
                      <el-option v-for="item in dcDataList" :key="item.id" :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                    </el-select>
                  </el-col> -->
                  <!-- <el-col :span="12">
                    <el-select clearable v-model="listQuery.carrier" placeholder="Carrier" filterable>
                      <el-option v-for="item in carrierList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-col> -->
                <!-- </el-row> -->
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <!-- <el-col :span="12">
                    <el-select v-model="listQuery.transportMeanName" filterable remote reserve-keyword clearable :remote-method="remoteMethod" placeholder="Vessel">
                      <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
                    </el-select>
                  </el-col> -->
                  <el-col :span="12">
                    <el-input v-model="listQuery.productCode" placeholder="Item Number" clearable />
                  </el-col>
                  <el-col :span="12">
                    <el-select multiple clearable placeholder="POL" filterable v-model="listQuery.originPortList" @clear="handleQuery">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                  </el-select>
                  </el-col>

                </el-row>
                <!-- <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select clearable v-model="listQuery.freightMethod" :placeholder="$t('booking.transportMode')" filterable>
                      <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-col> -->
                  <!-- <el-col :span="12"> -->
<!--                    <el-select filterable clearable v-model="listQuery.supplierCode" placeholder="Supplier Name">
                      <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode">
                      </el-option>
                    </el-select>-->
                    <!-- <el-select clearable v-model="listQuery.country" placeholder="Origin Country" filterable>
                      <el-option v-for="item in countryList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-col> -->
                <!-- </el-row> -->
                <!-- <el-row :gutter="10" style="margin-bottom: 15px;"> -->
                  <!-- <el-col :span="12">
                    <el-select filterable clearable placeholder="SO Type" v-model="listQuery.shipmentType" @clear="handleQuery">
                      <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-col> -->
                  <!-- <el-col :span="12">
                    <el-select multiple clearable placeholder="POL" filterable v-model="listQuery.originPortList" @clear="handleQuery">
                      <el-option v-for="(item, index) in portOptions" :key="index + 'pol'" :label="item.name + ' (' + item.code + ')'" :value="item.code"></el-option>
                    </el-select>
                  </el-col> -->
                <!-- </el-row> -->
                <el-row :gutter="10" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    <el-select filterable clearable placeholder="Status" v-model="listQuery.status" @clear="handleQuery">
                      <el-option label="Pepco Pending" :value="6"></el-option>
                      <el-option label="Awaiting Approval" :value="5"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">

                  </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-bottom: 15px;">
                  <el-col style="text-align: right">
                    <el-button @click="clearFilters" plain>Clear Filters</el-button>
                    <el-button @click="handleQuery()" icon="el-icon-search" plain> Search </el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'red':''}">Filter</el-button>
            </el-popover>
          </div>
        </div>


    <el-row :gutter="30">
      <el-col :span="12">
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
          <el-table-column width="80" header-align="center">
            <template v-slot="scope">
              <a style="float:left" v-if="!scope.row.checked" @click="addPo(scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                  <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
              <svg style="float:left" v-if="scope.row.checked" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
              </svg>
            </template>
          </el-table-column>
          <el-table-column prop="soRef" label="Moov Ref" width="130" align="center"></el-table-column>
          <!-- <el-table-column prop="shipmentType" label="SO Type"></el-table-column> -->
          <el-table-column prop="status" label="Status" width="130" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status == 6" type="primary">Pepco Pending</el-tag>
              <el-tag v-if="scope.row.status == 5" type="warning">Awaiting Approval</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="eta" label="ETD/ETA" width="180" align="center">
              <template v-slot="scope">{{ scope.row.etd ? parseTime(scope.row.etd) : '-' }} / {{ scope.row.eta ? parseTime(scope.row.eta) : '-' }}</template>
          </el-table-column>
          <el-table-column prop="pol" label="POL"></el-table-column>
          <!-- <el-table-column prop="childrenToy" label="Children Toy"></el-table-column> -->
          <el-table-column prop="childrenToy" label="Children Toy" align="center">
            <template v-slot="{row}">
              <el-tag v-if="row.childrenToy == 1" type="danger">Yes</el-tag>
              <el-tag v-else type="success">No</el-tag>
<!--              <el-tag v-if="!row.childrenToy" type="success">No</el-tag>-->
<!--              <el-tag v-else type="danger">Yes</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column prop="sanitaryRisk" label="Sanitary Risk" align="center">
            <template v-slot="{row}">
              <el-tag v-if="!row.sanitaryRisk" type="success">N</el-tag>
              <el-tag v-else type="danger">Y</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="listQuery.total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
      </el-col>

      <el-col :span="12">
        <el-table :data="selectedTable" style="width: 100%">
          <el-table-column width="55">
            <template v-slot="scope">
              <a @click="subPo(scope.$index,scope.row)">
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                  <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" />
                </svg>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="soRef" label="Moov Ref" width="130" align="center"></el-table-column>
          <el-table-column prop="status" label="Status" width="130" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status == 6" type="primary">Pepco Pending</el-tag>
              <el-tag v-if="scope.row.status == 5" type="warning">Awaiting Approval</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="eta" label="ETD/ETA" width="180" align="center">
              <template v-slot="scope">{{ scope.row.etd ? parseTime(scope.row.etd) : '-' }} / {{ scope.row.eta ? parseTime(scope.row.eta) : '-' }}</template>
          </el-table-column>
          <el-table-column prop="pol" label="POL" align="center"></el-table-column>
          <el-table-column prop="childrenToy" label="Children Toy" align="center">
            <template v-slot="{row}">
              <el-tag v-if="row.childrenToy == 1" type="danger">Yes</el-tag>
              <el-tag v-else type="success">No</el-tag>
<!--              <el-tag v-if="!row.childrenToy" type="success">No</el-tag>-->
<!--              <el-tag v-else type="danger">Yes</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column prop="sanitaryRisk" label="Sanitary Risk" align="center">
            <template v-slot="{row}">
              <el-tag v-if="!row.sanitaryRisk" type="success">N</el-tag>
              <el-tag v-else type="danger">Y</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col style="margin-top:10px;text-align:center">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitConfirm">Submit</el-button>
      </el-col>
    </el-row>

    <el-dialog v-loading="confirmLoading" ref="confirmDialog" width="40%" title="Confirm Batch Approve" :visible.sync="confrimDialogVisible" append-to-body>
      <el-form ref="submitForm" :model="submitForm" label-width="120px" size="small">
        <el-form-item required label="Status" prop="status" style="margin-bottom: 15px;">
          <el-select v-model="submitForm.status" clearable placeholder="Status">
            <el-option label="SA Approved" :value="4"></el-option>
            <el-option label="Pepco Pending" :value="6"></el-option>
            <el-option label="Pepco Rejected" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="submitForm.status == 7" label="Reason Option" prop="selectedReason" style="margin-bottom: 15px;">
          <el-select v-model="submitForm.selectedReason" placeholder="Select Reason" @change="handleReasonChange">
            <el-option v-for="reason in sOApprovalRejectingReasons" :key="reason.code" :label="reason.value + ' - ' + reason.label" :value="reason" />
          </el-select>
        </el-form-item>
        <el-form-item label="Reason" prop="note" style="margin-bottom: 15px;">
          <el-input type="textarea" :autosize="{minRows: 3, maxRows: 6}" v-model="submitForm.note" placeholder="Please enter the reason for approval" />
        </el-form-item>
        <el-form-item>
          <el-button @click="confrimDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submit">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { shippingOrderPage, updateShippingOrderStatusBatch } from '@/api/pepco/shipping-order'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getApprovalRejectingReasons } from '@/api/system/enums/pepco/enums'
import { DICT_TYPE, getDictDatas } from "@/utils/dict"

export default {
  name: 'AddRemovePoDialog',
  data() {
    return {
      dialogVisible: false,
      confrimDialogVisible: false,
      confirmLoading: false,
      tableLoading: false,
      tableData: [],
      selectedTable: [],
      selectIds: [],
      hasFilter: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        soRef: '',
        status: undefined,
        customerRef: undefined,
        originPort: undefined,
        // statusList: [5, 6] // 5: Pepco Pedding, 6: awaiting approval
      },
      submitForm: {
        shippingOrderIds: [],
        status: undefined, // 6: awaiting approval
        note: ''
      },
      // 添加拒绝原因列表
      // sOApprovalRejectingReasons: []
    }
  },
  computed: {
    // 添加计算属性来获取状态标签
    statusLabel() {
      const statusMap = {
        4: 'Approve',
        6: 'Pend',
        7: 'Reject'
      }
      return statusMap[this.submitForm.status] || ''
    },
    sOApprovalRejectingReasons() {
      console.log('获取字典pepco_reject', DICT_TYPE.PEPCO_REJECTED_REASON_CODE);
      console.log('获取字典pepco_reject', this.$store.getters.dict_datas);
      return this.$store.getters.dict_datas[DICT_TYPE.PEPCO_REJECTED_REASON_CODE]
    }
  },
  created() {},
  methods: {
    openDialog() {
      console.log('handlePoClick')
      this.selectedTable = []
      this.dialogVisible = true
      this.handleQuery()
    },
    handleQuery() {
      this.listQuery.pageNo = 1
      this.listQuery.soRef = this.listQuery.soRef.trim()
      this.getList()
    },
    getList() {
      this.tableLoading = true
      shippingOrderPage(this.listQuery).then(response => {
        // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
        console.log('batch approval', response.data.list)
        response.data.list.forEach(item => {
          // // 处理 childrenToy 值
          // if (item.artStructureList && Array.isArray(item.artStructureList)) {
          //   const artItem = item.artStructureList.find(art => art.soId == item.id);
          //   item.childrenToyValue = artItem ? artItem.value : 1;
          // } else {
          //   item.childrenToyValue = 1;
          // }
          this.selectedTable.forEach(selectedItem => {
            if (item.soRef == selectedItem.soRef) {
              item.checked = true
            }
          })
        })
        this.tableData = response.data.list
        this.listQuery.total = response.data.total
        this.tableLoading = false
      })
    },
    addPo(row) {
      this.$set(row, 'checked', true)
      if (this.selectedTable.filter(item => item.soRef == row.soRef).length > 0) {
        this.$message({
          message: 'SO already selected',
          type: 'warning'
        })
        return
      }
      this.selectedTable.push(row)
    },
    subPo(index, row) {
      this.selectedTable.splice(index, 1)
      this.tableData.forEach(item => {
        if (item.soRef == row.soRef) {
          this.$set(item, 'checked', false)
        }
      })
    },
    submitConfirm() {
      if (this.selectedTable.length === 0) {
        this.$message({
          message: 'Please select at least one SO',
          type: 'warning'
        })
        return
      }
      this.confrimDialogVisible = true
    },
    submit() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$confirm('Are you sure you want to '+this.statusLabel.toLowerCase()+' the selected bookings ?', 'Confirm', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning',
            customClass: 'wide-confirm-dialog'
          }).then(() => {
            this.confirmLoading = true
            this.submitForm.shippingOrderIds = this.selectedTable.map(item => item.id)
            updateShippingOrderStatusBatch(this.submitForm).then(response => {
              this.$message({
                message: 'Success',
                type: 'success'
              })
              this.confirmLoading = false
              this.selectedTable = []
              this.confrimDialogVisible = false
              this.dialogVisible = false
              this.submitForm = {
                shippingOrderIds: [],
                status: undefined, // 6: awaiting approval
                note: ''
              }
              this.$emit('refresh') // Notify parent component to refresh the list
            })
          })
        }
      })
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.portOptions = res.data
        console.log('所有的港口', this.portOptions)
      })
        },
    clearFilters() {
      // 清除所有过滤条件
      this.listQuery.status = undefined
      this.listQuery.voyage = undefined
      this.listQuery.originPortList = []
      this.listQuery.soRef = ''
      this.listQuery.customerRef = ''
      this.listQuery.productCode = null
      this.handleQuery()
    },
    getRowChildrenToyValue(row) {
      // 将 artStructureList 转换为 map，key=row.soId, value=row.value
      if (row.artStructureList && Array.isArray(row.artStructureList)) {
        for (let item of row.artStructureList) {
          // 假设我们要找的记录的 soId 与当前行的 id 匹配
          if (item.soId == row.id) {
            return item.value;
          }
        }
      }
      // 默认返回 1（表示 Yes/危险）
      return 1;
    },
    // 添加处理拒绝原因变化的方法
    handleReasonChange(reason) {
      // 注释原来代码，改为查询字典的方式来展示
      // if (reason) {
      //   this.submitForm.selectedReason = reason.label;
      //   this.submitForm.note = `${reason.code}- ${reason.reason}- ${reason.description}`;
      // } else {
      //   this.submitForm.note = '';
      // }
      if (reason) {
        console.log('选择rejected_code',reason);
        const selectedReasonObj = this.sOApprovalRejectingReasons.find(x => x.value === reason.value);
        console.log('selectedReasonObj:',selectedReasonObj);
        if (selectedReasonObj) {
          this.submitForm.selectedReason = selectedReasonObj.label;
          this.submitForm.note = `${selectedReasonObj.value}- ${selectedReasonObj.label}`;
        }
      } else {
        this.submitForm.note = '';
      }
    },
    // 在mounted中获取拒绝原因列表
    // getRejectingReasons() {
    //   getApprovalRejectingReasons().then((response) => {
    //     this.sOApprovalRejectingReasons = response.data
    //   })
    // }
  },
  mounted() {
    this.getOriginDeliveryList()
    // 获取拒绝原因列表
    this.getRejectingReasons()
  }
}
</script>

<style>
.wide-confirm-dialog {
  width: 600px !important;
}

.wide-confirm-dialog .el-message-box__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
