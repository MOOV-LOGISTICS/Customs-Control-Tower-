<!--Kaemingk-->
<template>
    <div class="app-container">
      <el-card class="inbound-list pd-20" style="padding-top: 20px;">
  
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"  >
        <el-form-item label="Po Number" >
            <el-input v-model="queryParams.poNumber"  clearable   @change="handleQuery" />
          </el-form-item>
          <el-form-item label="Article Number" >
            <el-input v-model="queryParams.skuId"  clearable   @change="handleQuery" />
          </el-form-item>
  
        <el-form-item style=" background-color: transparent;">
          <el-button @click="handleQuery" type="primary">Search<i class="el-icon-search el-icon--right"  ></i></el-button>
        </el-form-item>
  
      </el-form>
  
  
  
      <!-- 列表 -->
      <el-table  border :data="list" fit>
        <el-table-column label="Po Number" align="center" prop="poNumber" min-width="100"/>
        <el-table-column label="Article Number" align="center" prop="skuId" min-width="100"/>
        <el-table-column label="Outer carton" align="center" prop="qtyCartons" min-width="100"/>
        <el-table-column label="PCS(EA)" align="center" prop="qtyPcs" />
        <el-table-column label="Included Battery" align="center" prop="includedBattery" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.includedBattery ? 'yes' : 'no' }}
          </template>
        </el-table-column>
        <el-table-column label="Battery Cert No" align="center" prop="batteryCertNo" min-width="100"/>
        <el-table-column label="Product Name EN" align="center" prop="productNameEn" min-width="150"/>
        <el-table-column label="Product Name CN" align="center" prop="productNameCn" min-width="150"/>
        <el-table-column label="Is Set" align="center" prop="productSet" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.productSet ? 'yes' : 'no' }}
          </template>
        </el-table-column>
        <el-table-column label="Pcs Per Set" align="center" prop="pcsPerSet" min-width="100"/>
        <el-table-column label="Gross Weight" align="center" prop="grossWeight" min-width="100"/>
        <el-table-column label="Net Weight" align="center" prop="netWeight" min-width="100"/>
        <el-table-column label="Volume" align="center" prop="volume" min-width="100"/>
        <el-table-column label="Inbound Number" align="center" prop="inboundNumber" min-width="110"/>
        <el-table-column label="Factory Number" align="center" prop="factoryNumber" min-width="100"/>
        <el-table-column label="Factory Name" align="center" prop="factoryName" min-width="100"/>
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
  
  
  
  
    </el-card>
    </div>
  </template>
  
  <script>
  import { getWmsInboundPage} from "@/api/system/wms-inbound";
  import { getBaseHeader } from "@/utils/request";
  
  
  export default {
    name: "wmsPackingList",
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 显示搜索条件
        showSearch: true,
        tableHeight:0,
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
          poNumber: null,
          skuId: null,
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
        getWmsInboundPage(this.queryParams).then(response => {
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
    }
  };
  </script>
  