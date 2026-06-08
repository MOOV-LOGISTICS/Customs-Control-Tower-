<template>
    <el-dialog width="90%" title="Add/Remove PO" :visible.sync="addRemovePOVisible" @close="close">
        <div>
          <el-row :gutter="8">
            <el-col :span="4">
              <el-input
                v-model="orderNumber"
                clearable
                placeholder="Order Number" />
            </el-col>
            <el-col :span="5">
              <el-date-picker
                v-model="hodDateRange"
                type="daterange"
                start-placeholder="HOD Start Date"
                end-placeholder="HOD End Date">
              </el-date-picker>
            </el-col>
            <el-col :span="7">
              <el-date-picker
                v-model="pCrd"
                type="daterange"
                start-placeholder="Planned CRD Start Date"
                end-placeholder="Planned CRD End Date">
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button @click="onClear">
                Clear Filters
              </el-button>
              <el-button @click="getOrders" type="primary">
                Search
                <i class="el-icon-search el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="30">
            <el-col :span="12">
                <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
                    <el-table-column width="100">
                        <template v-slot="scope">
                            <a style="float:left" v-if="!scope.row.checked && addPerm(scope.row)" @click="addPo(scope.row)">
                                <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444"
                                        stroke-width="4" stroke-linejoin="bevel" />
                                    <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                                        stroke-linejoin="bevel" />
                                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                                        stroke-linejoin="bevel" />
                                </svg>
                            </a>
                            <svg style="float:left" v-else-if="scope.row.checked && addPerm(scope.row)" width="20" height="20"
                                viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4"
                                    stroke-linecap="square" stroke-linejoin="bevel" />
                            </svg>
                            <svg style="float:left" v-else-if="!addPerm(scope.row)" width="20" height="20" viewBox="0 0 48 48"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36 36L12 12M36 12L12 36" stroke="#999" stroke-width="4"
                                    stroke-linecap="square" />
                            </svg>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
                    <el-table-column prop="cargoHandoverDate" label="HOD" width="80">
                      <template slot-scope="scope">
                        {{ parseUTCTime(scope.row.cargoHandoverDate) }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="cargoHandoverDate" label="Planned CRD" width="80">
                      <template slot-scope="scope">
                        {{ parseUTCTime(scope.row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000) }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Supplier Name" min-width="200" prop="supplierCode" show-overflow-tooltip>
                        <template v-slot="scope">
                            <bsc-supplier-text :supplierId="scope.row.supplierId" />
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="queryParams.total" :page.sync="queryParams.pageNo"
                    :limit.sync="queryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getOrders" />
            </el-col>

            <el-col :span="12">
                <el-table :data="selectedTable" style="width: 100%">
                    <el-table-column width="100">
                        <template v-slot="scope">
                            <a @click="subPo(scope.$index, scope.row)">
                                <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444"
                                        stroke-width="4" stroke-linejoin="bevel" />
                                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                                        stroke-linejoin="bevel" />
                                </svg>
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="Order Number"></el-table-column>
                    <el-table-column label="Supplier Name" min-width="200" prop="supplierCode" show-overflow-tooltip>
                        <template v-slot="scope">
                            <bsc-supplier-text :supplierId="scope.row.supplierId" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col style="margin-top:10px;text-align:center">
                <el-button @click="close">Cancel</el-button>
                <el-button type="primary" @click="submit">Submit</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import { getOrder4ShippingBook } from '@/api/order/header';
import { getTaskPage } from "@/api/order/task";
import { parseUTCTime} from "@/utils/ruoyi";
import moment from "moment";

export default {
    name: 'AddRemovePoDialog',
    props: {
        userInfo: {
            type: Object,
            required: false
        },
    },
    data() {
        return {
            addRemovePOVisible: false,
            tableLoading: false,
            tableData: [],
            // 旧的选中数据
            oldSelectedTable: [],
            // 新的选中数据
            selectedTable: [],
            selectIds: [],
            queryParams: {
              total: 0,
              pageNo: 1,
              pageSize: 10,
              taskName: '',
              status: 0,
              statuskey: '',
              orderNumber: '',
            },
          hodDateRange: null,
          pCrd: null
        }
    },
    computed: {
        // 监听orderNumber的变化，去除输入两端的空格 edwin
        orderNumber: {
            get() {
                return this.queryParams.orderNumber
            },
            set(value) {
                // 去除输入两端的空格
                this.queryParams.orderNumber = value.trim()
            }
        }
    },
    created() {
    },
    methods: {
      parseUTCTime,
        openDialog(queryParams, selectedTable) {
            console.log('handlebatchUpdateCrdPoClick')
            this.fillQueryParams(queryParams)
            this.addRemovePOVisible = true
            this.selectedTable = JSON.parse(JSON.stringify(selectedTable));
            this.oldSelectedTable = JSON.parse(JSON.stringify(selectedTable));
            console.log("userInfo",this.userInfo)
            this.getOrders()
        },
        fillQueryParams(queryParams) {
            this.queryParams.pageNo = queryParams.pageNo
            this.queryParams.pageSize = queryParams.pageSize
            this.queryParams.taskName = queryParams.taskName
            this.queryParams.status = queryParams.status
            this.queryParams.statuskey = queryParams.statuskey
            this.queryParams.orderNumber = queryParams.orderNumber
        },
        getOrders() {
          this.tableLoading = true
          const params = {
            ...this.queryParams,
          }

          // 查询条件hod、pCrd，pCrd = hod - 7天
          // 比较hod和pCrd时间范围
          if (this.hodDateRange) {
            if (this.pCrd) {
              const startTime = moment(this.pCrd[0]).add(7, 'd')
              const endTime = moment(this.pCrd[1]).add(7, 'd')
              if (startTime.isAfter(moment(this.hodDateRange[0]))) {
                params.hodDateRange = [startTime.format('YYYY-MM-DD HH:mm:ss')]
              } else {
                params.hodDateRange = [moment(this.hodDateRange[0]).format('YYYY-MM-DD HH:mm:ss')]
              }
              if (endTime.isBefore(moment(this.hodDateRange[1]))) {
                params.hodDateRange[1] = endTime.format('YYYY-MM-DD HH:mm:ss')
              } else {
                params.hodDateRange[1] = moment(this.hodDateRange[1]).format('YYYY-MM-DD HH:mm:ss')
              }
            } else {
              params.hodDateRange = [moment(this.hodDateRange[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.hodDateRange[1]).format('YYYY-MM-DD HH:mm:ss')]
            }
          } else {
            if (this.pCrd) {
              const startTime = moment(this.pCrd[0]).add(7, 'd')
              const endTime = moment(this.pCrd[1]).add(7, 'd')
              params.hodDateRange = [startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss')]
            }
          }

          getTaskPage(params).then(response => {
              // 先更新checked，再将列表赋值给tableData：否则预先checked的选项删除后不会发生变化
              response.data.list.forEach(item => {
                  this.selectedTable.forEach(selectedItem => {
                      if (item.orderNumber == selectedItem.orderNumber) {
                          item.checked = true
                      }
                  })
              })
              this.tableData = response.data.list
              this.queryParams.total = response.data.total
              this.tableLoading = false
          })
        },
        addPo(row) {
            this.$set(row, 'checked', true)
            if (this.selectedTable.filter(item => item.orderNumber == row.orderNumber).length > 0) {
                this.$message({
                    message: 'PO already selected',
                    type: 'warning'
                })
                return
            }
            this.selectedTable.push(row)
        },
        subPo(index, row) {
            this.selectedTable.splice(index, 1)
            this.tableData.forEach(item => {
                if (item.orderNumber == row.orderNumber) {
                    this.$set(item, 'checked', false)
                }
            })
        },
        submit() {
            if (this.selectedTable.length === 0) {
                this.$message({
                    message: 'Please select at least one PO',
                    type: 'warning'
                })
                return
            }
            console.log(this.selectedTable)
            this.$emit('submit', this.selectedTable)
            this.selectedTable = []
            this.oldSelectedTable = []
            this.addRemovePOVisible = false
        },
        // 关闭窗口，不做任何动作
        close() {
            this.selectedTable = JSON.parse(JSON.stringify(this.oldSelectedTable));
            this.addRemovePOVisible = false
        },
        // 是否有编辑该order的权限
        addPerm(row) {
            if(this.userInfo.deptId == row.partyId){
                return true
            }
            return false
        },
      onClear() {
        this.orderNumber = ''
        this.hodDateRange = null
        this.pCrd = null
        this.getOrders()
      }
    }
}
</script>
