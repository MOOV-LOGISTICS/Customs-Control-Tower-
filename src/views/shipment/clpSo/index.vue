<template>
  <div class="app-container">
    <el-dialog title="Import" :visible.sync="importOpen" width="430px" append-to-body>
      <el-card class="pd-20">
        <Upload :uploadUrl="uploadUrl" @importTemplate="importTemplate" @reloadTable="handleQuery"></Upload>
      </el-card>
    </el-dialog>
    <el-card style="float: left; width: auto;margin:0px 20px 20px 0px" class="pd-20">
      <span v-hasPermi="['shipment:clp-so:create']" @click="handleImport">
        <icon-park style="display: inline-block;border-right: 1px solid #ddd;" type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
      </span>
      <span v-hasPermi="['shipment:clp-so:export']" @click="handleExport" :loading="exportLoading">
        <icon-park style="display: inline-block;border-right: 1px solid #ddd;" type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
      </span>
    </el-card>
    <div style="clear: both;"></div>
    <!-- 搜索工作栏 -->

    <el-card style="padding: 20px;">
      <el-form :model="queryParams" ref="queryForm" size="mini" :inline="true">
        <el-form-item label prop="shipmentBookingNumber">
          <el-input v-model="queryParams.shipmentBookingNumber" placeholder="Booking NO." clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label prop="containerNo">
          <el-input v-model="queryParams.containerNo" placeholder="Container NO." clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label prop="sealNo">
          <el-input v-model="queryParams.sealNo" placeholder="Seal NO." clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label prop="shipTo">
          <el-input v-model="queryParams.shipTo" placeholder="Ship To" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label prop="salesOrderNumber">
          <el-input v-model="queryParams.salesOrderNumber" placeholder="Sales Order Number" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">Search</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">Clear Filter</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="Details" :visible.sync="dialogVisible2" width="90%">
        <el-table :height="tableHeight" v-loading="loading2" :data="subTableData">
          <el-table-column label="Booking NO." align="center" prop="shipmentBookingNumber" />
          <el-table-column label="Container Type" align="center" prop="containerType" />
          <el-table-column label="Container NO." align="center" prop="containerNo" />
          <el-table-column label="Seal NO." align="center" prop="sealNo" />
          <el-table-column label="Ship To" align="center" prop="shipTo" />
          <el-table-column label="Pallet Number" align="center" prop="palletNumber" />
          <el-table-column label="Sales Order Number" width="130" align="center" prop="salesOrderNumber" />
          <el-table-column label="SKU" align="center" prop="sku" />
          <el-table-column label="Quantity" align="center" prop="qty" />
          <el-table-column label="Length" align="center" prop="length" />
          <el-table-column label="Width" align="center" prop="width" />
          <el-table-column label="Height" align="center" prop="height" />
          <el-table-column label="CBM" align="center" prop="cbm" />
          <el-table-column label="Gross Weight" align="center" prop="grossWeight" />
          <el-table-column label align="center" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index)" v-hasPermi="['shipment:clp-so:update']">Edit</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" v-hasPermi="['shipment:clp-so:delete']">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 列表 -->
      <el-table :height="tableHeight" v-loading="loading" :data="list">
        <el-table-column label="Booking NO." align="center" prop="shipmentBookingNumber">
          <template v-slot="scope">
            <el-link type="primary" @click="openDetails(scope.row)">{{ scope.row.shipmentBookingNumber }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Container NO." align="center" prop="containerNo" />
        <!-- <el-table-column label="Seal NO." align="center" prop="sealNo" />
      <el-table-column label="Ship To" align="center" prop="shipTo" />
        <el-table-column label="Pallet Number" align="center" prop="palletNumber" />-->
        <el-table-column label="Sales Order Number" align="center" prop="salesOrderNumber" />
        <!-- <el-table-column label="SKU" align="center" prop="sku" /> -->
        <el-table-column label="Quantity" align="center" prop="qty" />
        <!-- <el-table-column label="Length" align="center" prop="length" />
      <el-table-column label="Width" align="center" prop="width" />
        <el-table-column label="Height" align="center" prop="height" />-->
        <el-table-column label="CBM" align="center" prop="cbm" />
        <el-table-column label="Gross Weight" align="center" prop="grossWeight" />
        <!--
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['shipment:clp-so:update']">Edit</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['shipment:clp-so:delete']">Delete</el-button>
        </template>
        </el-table-column>-->
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="600px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="Booking NO." prop="shipmentBookingNumber">
          <el-input v-model="form.shipmentBookingNumber" placeholder="Shipment Bookingnumber" />
        </el-form-item>
        <el-form-item label="Container NO." prop="containerNo">
          <el-input v-model="form.containerNo" placeholder="Container No" />
        </el-form-item>
        <el-form-item label="Seal NO." prop="sealNo">
          <el-input v-model="form.sealNo" placeholder="Seal No" />
        </el-form-item>
        <el-form-item label="Ship To" prop="shipTo">
          <el-input v-model="form.shipTo" placeholder="Ship To" />
        </el-form-item>
        <el-form-item label="pallet Number" prop="palletNumber">
          <el-input v-model="form.palletNumber" placeholder="Pallet Number" />
        </el-form-item>
        <el-form-item label="Sales Order Number" prop="salesOrderNumber">
          <el-input v-model="form.salesOrderNumber" placeholder="Sales Ordernumber" />
        </el-form-item>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model="form.sku" placeholder="Sku" />
        </el-form-item>
        <el-form-item label="Quantity" prop="qty">
          <el-input v-model="form.qty" placeholder="Qty" />
        </el-form-item>
        <el-form-item label="Length" prop="length">
          <el-input v-model="form.length" placeholder="Lenght" />
        </el-form-item>
        <el-form-item label="Width" prop="width">
          <el-input v-model="form.width" placeholder="Width" />
        </el-form-item>
        <el-form-item label="Height" prop="height">
          <el-input v-model="form.height" placeholder="Height" />
        </el-form-item>
        <el-form-item label="CBM" prop="cbm">
          <el-input v-model="form.cbm" placeholder="Cbm" />
        </el-form-item>
        <el-form-item label="Gross Weight" prop="grossWeight">
          <el-input v-model="form.grossWeight" placeholder="Grossweight" />
        </el-form-item>
        <el-form-item label="PO" prop="po">
          <el-input v-model="form.po" placeholder="Po" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { IconPark } from '@icon-park/vue/es/all'
import { createClpSo, updateClpSo, deleteClpSo, getClpSo, getClpSoPage, exportClpSoExcel, getClpSoList } from '@/api/shipment/clpSo'
import Upload from '@/views/salesOrder/components/upload.vue'
export default {
  name: 'ClpSo',
  components: {
    IconPark,
    Upload
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      dialogVisible: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      uploadUrl: '/admin-api/shipment/clp-so/import',
      // shipment_clp_so列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        shipmentBookingNumber: null,
        containerNo: null,
        sealNo: null,
        shipTo: null,
        palletNumber: null,
        salesOrderNumber: null,
        sku: null,
        qty: null,
        lenght: null,
        width: null,
        height: null,
        cbm: null,
        grossWeight: null,
        po: null,
        shipmentId: null,
        createTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        shipmentId: [{ required: true, message: 'shipment_id can not be null', trigger: 'blur' }]
      },
      importOpen: false,
      tableHeight: '',
      subTableData: [],
      dialogVisible2: false,
      loading2: false,
      index: -1
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      var clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 392
    })
  },
  created() {
    this.getList()
    this.calcTableHeight()
  },
  methods: {
    openDetails(row) {
      this.dialogVisible2 = true
      this.loading2 = true
      getClpSoList({ shipmentBookingNumber: row.shipmentBookingNumber }).then(res => {
        this.subTableData = res.data
        this.loading2 = false
      })
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 392
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getClpSoPage(this.queryParams).then(response => {
        var clpList = []
        for (var clp of response.data.list) {
          console.log(clp)

          clp.qtp = parseFloat(clp.qtp).toFixed(3)
          clp.cbm = parseFloat(clp.cbm).toFixed(3)
          clp.grossWeight = parseFloat(clp.grossWeight).toFixed(3)

          var numbers = clp.salesOrderNumber.split(',')
          const numbers1 = Array.from(new Set(numbers))
          clp.salesOrderNumber = numbers1.join(',')

          var containers = clp.containerNo.split(',')
          const containers1 = Array.from(new Set(containers))
          clp.containerNo = containers1.join(',')

          clpList.push(clp)
        }
        this.list = clpList
        this.total = response.data.total
        this.loading = false
      })
    },
    handleImport() {
      this.importOpen = true
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        shipmentBookingNumber: undefined,
        containerNo: undefined,
        sealNo: undefined,
        shipTo: undefined,
        palletNumber: undefined,
        salesOrderNumber: undefined,
        sku: undefined,
        qty: undefined,
        lenght: undefined,
        width: undefined,
        height: undefined,
        cbm: undefined,
        grossWeight: undefined,
        po: undefined,
        shipmentId: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.importOpen = false
      this.getList()
    },
    importTemplate() {
      exportClpSoExcel({ hasData: false }).then(res => {
        this.$download.excel(res, 'CLP TempLate.xlsx')
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = ''
    },
    /** 修改按钮操作 */
    handleUpdate(row, index) {
      this.reset()
      const id = row.id
      this.index = index
      getClpSo(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Update'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 修改的提交
        if (this.form.id != null) {
          updateClpSo(this.form).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
            console.log(this.index)
            for (var key in JSON.parse(JSON.stringify(this.form))) {
              this.$set(this.subTableData[this.index], key, JSON.parse(JSON.stringify(this.form))[key])
            }
          })
          return
        }
        // 添加的提交
        createClpSo(this.form).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row, index) {
      const id = row.id
      this.$modal
        .confirm('Delete shipment_clp_so id "' + id + '"?')
        .then(function () {
          return deleteClpSo(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
          this.subTableData.splice(index, 1)
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      params.hasData = true
      this.$modal
        .confirm('Export?')
        .then(() => {
          this.exportLoading = true
          return exportClpSoExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'shipment_clp_so.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
