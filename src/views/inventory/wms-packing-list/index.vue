<!--Kaemingk-->
<template>
  <div class="app-container">

    <div style="margin-bottom: 20px">
      <el-card style="background: transparent; box-shadow: none !important">
        <!-- <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <span @click="handleExport">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"
              strokeLinecap="square" />
          </span>
        </el-card>
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <span @click="handleExportDetail">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"
              strokeLinecap="square" />
          </span>
        </el-card> -->
        <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
          <el-dropdown @command="handleExportWithOption">
            <span class="el-dropdown-link">
              <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"
                strokeLinecap="square" />
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="current">Packing List</el-dropdown-item>
              <el-dropdown-item command="all">Shipping Information overview Packing List</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
      </el-card>
    </div>
    <el-card class="packing-list pd-20" style="padding-top: 20px;">

      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="SO Number">
          <el-input v-model="queryParams.soNumber" clearable @change="handleQuery" />
        </el-form-item>
        <el-form-item label="Ship To">
          <el-input v-model="queryParams.shipTo" clearable @change="handleQuery" />
        </el-form-item>
        <el-form-item label="Ship To Name">
          <el-input v-model="queryParams.shipToName" clearable @change="handleQuery" />
        </el-form-item>

        <el-form-item style=" background-color: transparent;">
          <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button>
        </el-form-item>

      </el-form>



      <!-- 列表 -->
      <el-table border :data="list" v-loading="loading" fit>
        <el-table-column label="Packing List Number" align="center" prop="packingListNumber" min-width="120" />
        <el-table-column label="SO Number" align="center" prop="soNumber" min-width="100" />
        <el-table-column label="PO Number" align="center" prop="poNumber" min-width="100" />
        <el-table-column label="Article Number" align="center" prop="skuId" min-width="100" />
        <el-table-column label="Ship To" align="center" prop="shipTo" min-width="100" />
        <el-table-column label="Ship To Name" align="center" prop="shipToName" min-width="100" />
        <el-table-column label="Order To" align="center" prop="orderTo" min-width="100" />
        <el-table-column label="City" align="center" prop="city" min-width="100" />
        <el-table-column label="Address" align="center" prop="address" min-width="100" />
        <el-table-column label="Zip Code" align="center" prop="zipCode" min-width="100" />
        <el-table-column label="Country" align="center" prop="country" min-width="100" />
        <el-table-column label="Pallet Number" align="center" prop="palletNumber" min-width="100" />
        <el-table-column label="Pallet Length" align="center" prop="palletLength" min-width="100" />
        <el-table-column label="Pallet Width" align="center" prop="palletWidth" min-width="100" />
        <el-table-column label="Pallet Height" align="center" prop="palletHeight" min-width="100" />
        <el-table-column label="Outer Carton" align="center" prop="qtyCartons" min-width="100" />
        <el-table-column label="PCS(EA)" align="center" prop="qtyPcs" min-width="100" />
        <el-table-column label="UOM" align="center" prop="uom" min-width="100" />
        <el-table-column label="QTY UOM" align="center" prop="qtyUom" />
        <el-table-column label="Included Battery" align="center" prop="includedBattery" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.includedBattery ? 'yes' : 'no' }}
          </template>
        </el-table-column>
        <el-table-column label="Battery Cert No" align="center" prop="batteryCertNo" min-width="100" />
        <el-table-column label="Product Name EN" align="center" prop="productNameEn" min-width="150" />
        <el-table-column label="Product Name CN" align="center" prop="productNameCn" min-width="150" />
        <el-table-column label="Gross Weight" align="center" prop="grossWeight" min-width="100" />
        <el-table-column label="Net Weight" align="center" prop="netWeight" min-width="100" />
        <el-table-column label="Volume" align="center" prop="volume" min-width="100" />
        <el-table-column label="Container Number" align="center" prop="containerNumber" min-width="120" />
        <el-table-column label="Moov Container Number" align="center" prop="moovContainerNumber" min-width="150" />
        <el-table-column label="Seal Number" align="center" prop="sealNumber" min-width="100" />
        <el-table-column label="BL Number" align="center" prop="blNumber" min-width="100" />
        <el-table-column label="Way Of Palletizing" align="center" prop="palletizingWay" min-width="110" />
        <el-table-column label="Transport Type" align="center" prop="transportType" min-width="100" />
        <el-table-column label="Container Type" align="center" prop="containerType" min-width="100" />
        <el-table-column label="ETD (m/d/y)" align="center" prop="etd" min-width="100" />
        <el-table-column label="ATD (m/d/y)" align="center" prop="atd" min-width="100" />
        <el-table-column label="ETA Dest. Harbour (m/d/y)" align="center" prop="etaDest" min-width="110" />
        <el-table-column label="Vessel Name And Voyage" align="center" prop="vesselVoyage" min-width="110" />
        <el-table-column label="HBL Number" align="center" prop="hblNumber" min-width="100" />
        <el-table-column label="Tare Weight of Container" align="center" prop="tareWeight" min-width="150" />
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
        @pagination="getList" />




    </el-card>
  </div>
</template>

<script>
import "@icon-park/vue/styles/index.css";
import { IconPark } from "@icon-park/vue/es/all";
import {
  getWmsPackingListPage,
  exportPackingListExcel,
  exportPackingListDetailExcel
} from "@/api/system/wms-packing-list";
import { getBaseHeader } from "@/utils/request";


export default {
  name: "wmsPackingList",
  components: {
    IconPark,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      tableHeight: 0,
      // 总条数
      total: 0,
      // order_inventory列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        soNumber: null,
        poNumber: null,
        shipTo: null,
        shipToName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },

    };
  },
  created() {
    this.getList();
  },
  methods: {
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 308;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getWmsPackingListPage(this.queryParams).then(response => {
        if (response.data && response.data.list) {
          this.list = response.data.list;
          this.total = response.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
        console.log(this.list);
        this.loading = false;
      }).catch(error => {
        console.error("Error fetching data:", error);
        this.list = [];
        this.total = 0;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 导出 */
    handleExportWithOption(command) {
      if (command === 'current') {
        this.handleExport();
      } else if (command === 'all') {
        this.handleExportDetail();
      }
    },
    /** 导出(按照模板格式标准导出) */
    handleExport() {
      if (!this.queryParams.soNumber) {
        this.$message.error(this.$t("So Number Is Required!"));
        return;
      }
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          console.log(params);
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPackingListExcel(params);
        })
        .then((response) => {
          this.$download.excel(response,"smartMOOV_PackingList" + this.parseTimeToZ2(new Date()) + ".xlsx");
          this.exportLoading = false;
        })
        .catch((error) => { 
          console.error('Error in exportPackingListExcel:', error);
          this.exportLoading = false;
        });
    },
    /** 按照列表导出全部信息 */
    handleExportDetail() {
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          console.log(params);
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPackingListDetailExcel(params);
        })
        .then((response) => {
          this.$download.excel(response,"smartMOOV_ShipInfo_Packing_List" + this.parseTimeToZ2(new Date()) + ".xlsx");
          this.exportLoading = false;
        })
        .catch((error) => { 
          console.error('Error in exportPackingListExcel:', error);
          this.exportLoading = false;
        });
    },
    parseTimeToZ2(timestamp) {
      if(!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}${month}${day}${hours}${minutes}`;
    },
  }
};
</script>
