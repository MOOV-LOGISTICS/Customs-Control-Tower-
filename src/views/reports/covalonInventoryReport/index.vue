
<template xmlns="">
  <div class="app-container" style="width:90%;margin:0 auto;background:#fff;padding:0px 20px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="Raw Data" name="first"></el-tab-pane>
    </el-tabs>
    <div>
      <div>
        <el-row :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="3">
            <el-select filterable @change="handleChange" clearable v-model="po" placeholder="PO">
              <el-option v-for="value in poSet" :label="value" :value="value"></el-option>
            </el-select>
          </el-col>

          <el-col :span="3">
            <el-select filterable @change="handleChange" clearable v-model="lot" placeholder="Lot NO" :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in lotSet" :label="value" :value="value"></el-option>
            </el-select>
            <!--        <el-input  v-model="lot" placeholder="Lot NO"  @blur="lotNumber = $event.target.value.trim()"-->
            <!--                   clearable @keyup.enter.native="handleChange" />-->
          </el-col>
          <el-col :span="3">
            <el-select filterable @change="handleChange" clearable v-model="sku" placeholder="SKU" :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in skuSet" :label="value" :value="value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select filterable @change="handleChange" clearable v-model="exp" placeholder="EXP" :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in EXPSet" :label="value.name" :value="value.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select filterable @change="handleChange" clearable v-model="unreleasedReleased" placeholder="Released" :loading="getDisLoading" loading-text="Loading...">
              <el-option v-for="value in ReleasedSet" :label="value.name" :value="value.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleChange">
              <i class="el-icon-search"></i> Search
            </el-button>
          </el-col>
          <el-col :span="3" :offset="2">
            <el-button @click="handleExport" v-loading="exportLoading">Export Data</el-button>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div style="clear: both"></div>
    </div>
    <transition name="el-zoom-in-center">
      <div style="height: 100%" v-show="activeName=='first'">
        <el-empty v-if="tableData3.length ===0" description="System under maintenance" />
        <el-table :height="height" v-if="tableData3.length" :data="tableData3" show-summary :summary-method="getSummaries">
          <el-table-column prop="po" label="PO" width="100">
            <template v-slot="scope">
              <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.po) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="SKU" width="100">
            <template v-slot="scope">
              <div style="            white-space: nowrap;width:100%;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ (scope.row.sku) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mfg" label="Production Date" width="100">
            <template v-slot="scope">{{ parseTime(scope.row.mfg) }}</template>
          </el-table-column>
          <el-table-column prop="exp" label="Expiry Date" width="100">
            <template v-slot="scope">{{ parseTime(scope.row.exp) }}</template>
          </el-table-column>
          <el-table-column prop="lot" label="Lot No." width="100"></el-table-column>
          <el-table-column prop="availableInventoryBox" label="Available inventory(Box)" width="180"></el-table-column>
          <el-table-column prop="allocatedInventoryBox" label="Allocated inventory(Box)" width="180"></el-table-column>
          <el-table-column prop="pickedInventoryBox" label="Picked inventory(Box)" width="180"></el-table-column>
          <el-table-column prop="lwh" label="L*W*H" width="100"></el-table-column>
          <el-table-column prop="gw2KG" label="G.W(KG)" width="100"></el-table-column>
          <el-table-column prop="InboundDate" label="Gate-in Date" width="100">
            <template v-slot="scope">{{ parseTime(scope.row.InboundDate) }}</template>
          </el-table-column>
          <el-table-column prop="innerBoxes" label="Boxes per shiper" width="180"></el-table-column>
          <el-table-column prop="availableInventoryCarton" label="Available Inventory(shipper)" width="180"></el-table-column>
          <el-table-column prop="allocatedInventoryCarton" label="Allocated Inventory(shipper)" width="180"></el-table-column>
          <el-table-column prop="pickedInventoryCarton" label="Picked Inventory(shipper)" width="180"></el-table-column>
          <el-table-column prop="unreleasedReleased" label="Unreleased/Released" width="180"></el-table-column>
        </el-table>
        <!--      <el-empty v-if="tableData3.length ===0" description="System under maintenance"/>-->
        <pagination :total="pageForm.lineTotal" :page.sync="pageForm.pageNo" :limit.sync="pageForm.pageSize" :page-sizes="[10, 20, 50]" @pagination="report5" />
      </div>
    </transition>
  </div>
</template>
<script>
import { poList, lotList, skuList, selectPage, exportExcel, sumData } from '@/api/bi/covalonReport'
import * as echarts from 'echarts'
import { getTenantPage } from '@/api/system/tenant'
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
export default {
  name: 'combineBookingReport',
  components: {},
  data() {
    return {
      poSet: [],
      lotSet: [],
      skuSet: [],
      sumAvailableInventoryBox: '',
      sumPickedInventoryBox: '',
      sumPickedInventoryCarton: '',
      sumAllocatedInventoryBox: '',
      sumAllocatedInventoryCarton: '',
      sumGw2KG: '',
      sumAvailableInventoryCarton: '',
      EXPSet: [
        { name: '<500 days', value: '1' },
        { name: '>700 days', value: '2' },
        { name: '500-600 days', value: '3' },
        { name: '600-700 days', value: '4' }
      ],
      ReleasedSet: [
        { name: 'Released', value: '1' },
        { name: 'Unreleased', value: '0' }
      ],
      sum: 0.0,
      getDisLoading: false,
      bookingStatusList: [],
      supplierList: [],
      unreleasedReleased: '',
      po: '',
      sku: '',
      exp: '',
      lot: '',
      lotNumber: '',
      supplier: '',
      bookingStatus: '',
      vmtAgentName: '',
      activeName: 'first',
      tableData1: [{}],
      tableData2: [{}],
      tableData3: [],
      pageForm: {
        pageSize: 20,
        pageNo: 1
      },
      height: null,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      tenantMap: {},
      tenantList: [],
      exportLoading: false
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      const clientHeight = document.documentElement.clientHeight
      this.height = clientHeight - 298
    })
    this.report5()
    this.sumDataList()
    this.getTenantPage()
    console.log(this.tableData3.length, 'this.tableData3.length')
    this.getDisLoading = true
    poList().then(response => {
      if (response && response.data) {
        console.log(response)
        console.log('response===========================')
        this.poSet = response.data.poSet
        this.lotSet = response.data.lotSet
        this.skuSet = response.data.skuSet
      }
      this.getDisLoading = false
    })
  },
  created() {
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 298
  },
  methods: {
    checkPermi,
    handleExport() {
      this.$modal
        .confirm('Export?')
        .then(() => {
          this.exportLoading = true

          return exportExcel({
            po: this.po,
            sku: this.sku,
            exp: this.exp,
            lot: this.lot,
            unreleasedReleased: this.unreleasedReleased
          })
        })
        .then(response => {
          this.$download.excel(response, 'Covalon Inventory Report.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    },
    getTenantPage() {
      if (this.checkPermi(['super:user'])) {
        getTenantPage({ pageNo: 1, pageSize: 100, status2: 0 }).then(response => {
          for (var i = 0; i < response.data.list.length; i++) {
            this.tenantMap[response.data.list[i].id] = response.data.list[i].name
          }
          this.tenantList = response.data.list
        })
      }
    },
    handleChange() {
      this.report5()
    },
    report5() {
      this.loading5 = true
      this.pageForm.po = this.po
      this.pageForm.lot = this.lot
      this.pageForm.sku = this.sku
      this.pageForm.exp = this.exp
      this.pageForm.unreleasedReleased = this.unreleasedReleased
      selectPage(this.pageForm).then(res => {
        this.tableData3 = res.data.list
        this.loading5 = false
        this.pageForm.lineTotal = res.data.total
      })
      this.sumDataList()
    },
    sumDataList() {
      this.loading5 = true
      this.pageForm.po = this.po
      this.pageForm.lot = this.lot
      this.pageForm.sku = this.sku
      this.pageForm.exp = this.exp
      this.pageForm.unreleasedReleased = this.unreleasedReleased
      sumData(this.pageForm).then(response => {
        this.sumAvailableInventoryBox = response.data.sumAvailableInventoryBox
        this.sumGw2KG = response.data.sumGw2KG
        this.sumAvailableInventoryCarton = response.data.sumAvailableInventoryCarton
        this.sumPickedInventoryBox = response.data.sumPickedInventoryBox
        this.sumPickedInventoryCarton = response.data.sumPickedInventoryCarton
        this.sumAllocatedInventoryBox = response.data.sumAllocatedInventoryBox
        this.sumAllocatedInventoryCarton = response.data.sumAllocatedInventoryCarton
      })
    },
    getSummaries(param) {
      console.log(param)
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        console.log(column.property)
        if (index == 0) {
          console.log('sum================')
          sums[index] = 'Sum' //可更改合计行的名称
          return
        }
        if (column.property == 'availableInventoryBox') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          console.log('!!!!!!!!!!!!!!!!!!!================')
          console.log(values)
          console.log(sum)
          console.log('!!!!!!!!!!!!!!!!!!!================')
          sums[index] = parseFloat(this.sumAvailableInventoryBox).toFixed(0) + ''
          return
        } else if (column.property == 'pickedInventoryBox') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          sums[index] = parseFloat(this.sumPickedInventoryBox).toFixed(2) + ''
          return
        } else if (column.property == 'pickedInventoryCarton') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          console.log('!!!!!!!!!!!!!!!!!!!================')
          console.log(values)
          console.log(sum)
          console.log('!!!!!!!!!!!!!!!!!!!================')
          sums[index] = parseFloat(this.sumPickedInventoryCarton).toFixed(2) + ''
          return
        } else if (column.property == 'availableInventoryCarton') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          sums[index] = parseFloat(this.sumAvailableInventoryCarton).toFixed(2) + ''
          return
        } else if (column.property == 'allocatedInventoryBox') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          sums[index] = parseFloat(this.sumAllocatedInventoryBox).toFixed(0) + ''
          return
        } else if (column.property == 'allocatedInventoryCarton') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          sums[index] = parseFloat(this.sumAllocatedInventoryCarton).toFixed(2) + ''
          return
        } else if (column.property == 'gw2KG') {
          const values = data.map(item => Number(item[column.property]))
          let sum = values.reduce((total, curr) => {
            return total + curr
          }, 0)
          sums[index] = parseFloat(this.sumGw2KG).toFixed(2) + ''
          return
        } else {
          sums[index] = ' '
          return
        }
      })
      return sums
    }
  }
}
</script>

<style>
</style>
