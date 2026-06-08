<!--Kaemingk-->
<template>
    <div class="app-container">
  
      <div style="margin-bottom: 20px">
        <el-card style="background: transparent; box-shadow: none !important">
          <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
            <span @click="handleExport">
              <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter"
                strokeLinecap="square" />
            </span>
          </el-card>
        </el-card>
      </div>
      <el-card class="pallet-info pd-20" style="padding-top: 20px;">
  
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
        <el-table border :data="list" fit>
          <el-table-column label="Internal reference number" align="center" prop="moovContainerNumber" min-width="100" />
          <el-table-column label="Order" align="center" prop="soNumber" min-width="100" />
          <el-table-column label="Ship To" align="center" prop="shipTo" min-width="100" />
          <el-table-column label="Ship To Name" align="center" prop="shipToName" min-width="100" />
          <el-table-column label="Pallet #" align="center" prop="palletNumber" min-width="100" />
          <el-table-column label="Length cm" align="center" prop="palletLength" min-width="100" />
          <el-table-column label="Width cm" align="center" prop="palletWidth" min-width="100" />
          <el-table-column label="Height cm" align="center" prop="palletHeight" min-width="100" />
          <el-table-column label="G.W kg" align="center" prop="grossWeight" min-width="100" />
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
  import { getWmsPalletInfoPage, exportPalletInfoExcel } from "@/api/system/wms-pallet-info";
  import { getBaseHeader } from "@/utils/request";
  
  
  export default {
    name: "wmsPalletInfo",
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
        getWmsPalletInfoPage(this.queryParams).then(response => {
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
      /** 导出按钮操作 */
      handleExport() {
        this.$modal
          .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
          .then(() => {
            // 处理查询参数
            let params = { ...this.queryParams };
            console.log(params);
            params.pageNo = undefined;
            params.pageSize = undefined;
            this.exportLoading = true;
            return exportPalletInfoExcel(params);
          })
          .then((response) => {
            this.$download.excel(response,"smartMOOV_palletInfo" + this.parseTimeToZ2(new Date()) + ".xlsx");
            this.exportLoading = false;
          })
          .catch((error) => { 
            console.error('Error in exportPalletInfoExcel:', error);
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