<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >
    <el-dialog
      title="Carrier"
      :visible.sync="dialogVisibleCarrier"
      width="640px">
      <ChooseCarrier @change-value="changeParentValue"></ChooseCarrier>
    </el-dialog>
    <el-dialog
      title="Import Sales Order"
      :visible.sync="importOpen"
      width="400px"
      append-to-body
    >

      <Upload :uploadUrl="uploadUrl" @importTemplate="importTemplate" @reloadTable="reloadTable"></Upload>

    </el-dialog>
    <el-dialog title="Spilt Order" :visible.sync="dialogTableVisible" custom-class="dialogwidth">
      <el-row>
        <el-col :span="10">
          <el-row>
            <el-col :span="12">
              <el-input v-model="spiltParams.productCode">
                <el-button  slot="append" @click=" spiltParams.pageNo = 1 ,getSplitList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                placeholder="input new number"
                v-model="spiltParams.inputOld"
                clearable>
              </el-input>
            </el-col>
          </el-row>


          <el-table
            ref="multipleTable1"
            :data="gridData1"
            tooltip-effect="dark"
            style="width: 100% ;"
            :row-style="{ height: '60px' }"
            @selection-change="handleSelectionChange1"
          >
            <el-table-column
              type="selection"
            >
            </el-table-column>
            <el-table-column property="productCode" label="Product Code" ></el-table-column>
            <el-table-column property="productName" label="Product Name"></el-table-column>
            <el-table-column property="warehouse" label="Warehouse"></el-table-column>
            <el-table-column property="qty" label="Quantity" ></el-table-column>
            <el-table-column property="unit" label="Unit" ></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <!--            <div class="button-container">
                        <el-input
                          placeholder="input new number"
                          v-model="inputNew"
                          clearable>
                        </el-input>
                      </div>-->

          <div class="button-container">
            <button @click="transferData1" style="margin-right: 2px">
              <img src="@/assets/images/arrow-left.png">
            </button>
            <button @click="transferData2" style="margin-left: 2px">
              <img src="@/assets/images/arrow-right.png">
            </button>
          </div>
          <!--            <div class="button-container img">
                      </div>-->
        </el-col>

        <el-col :span="10">
          <el-row>
            <!--              <el-col :span="12">
                            <el-input v-model="spiltParams.inputNew">
                              <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon&#45;&#45;right" ></i></el-button>
                            </el-input>
                          </el-col>-->
            <el-col :span="12">
              <el-input
                placeholder="input new number"
                v-model="spiltParams.inputNew"
                clearable>
              </el-input>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable2"
            :data="gridData2"
            tooltip-effect="dark"
            style="width: 100%"
            :row-style="{ height: '60px' }"
            @selection-change="handleSelectionChange2"
          >
            <el-table-column
              type="selection"
            >
            </el-table-column>
            <el-table-column property="productCode" label="Product Code" ></el-table-column>
            <el-table-column property="productName" label="Product Name" ></el-table-column>
            <el-table-column property="warehouse" label="Warehouse" ></el-table-column>
            <el-table-column property="qty" label="Quantity" ></el-table-column>
            <el-table-column property="unit" label="Unit" ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" >
<!--             <el-button @click="dialogTableVisible = false">取 消</el-button>-->
             <el-button type="primary" @click="handleSplit">Confirm</el-button>
            </span>

    </el-dialog>

    <el-card style="float: left; width: auto;margin:0px 20px 20px 0px" class="pd-20">
            <span v-hasPermi="['order:so-header:import']" @click="handleImport"  v-if="!showFactory" >
            <icon-park style="display: inline-block;border-right: 1px solid #ddd;" type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          </span>
      <span  v-hasPermi="['order:so-header:query']" @click="handleExport" v-loading="exportLoading">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
    </el-card>

    <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="!showFactory" >
      <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
      <div :class="{'avticePort':queryParams.booked==false}" @click="bookedChange(false)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
        <p style="font-size: 20px;">{{ reportMap.notBooked }}</p>
        <p>Not Booked</p>
      </div>
    </el-card>

    <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="!showFactory" >
      <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
      <div :class="{'avticePort':queryParams.booked==true}" @click="bookedChange(true)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
        <p style="font-size: 20px;">{{ reportMap.booked }}</p>
        <p>Booked</p>
      </div>

    </el-card>

    <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="showFactory" >
      <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
      <div :class="{'avticePort':queryParams.booked==false}"  style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
        <p style="font-size: 20px;">{{ lineTotal }}</p>
        <p>Total SO</p>
      </div>
    </el-card>

    <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="showFactory" >
      <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
      <div :class="{'avticePort':queryParams.booked==true}"   style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
        <p style="font-size: 20px;">{{ reportMap.outboundSOQty }}</p>
        <p>Outbound SO</p>
      </div>

    </el-card>

    <el-card class="pd-20" id="portsDiv"  v-if="!showFactory"   style="white-space: nowrap;overflow-x: auto;height:59.5px;float: left; width: auto;margin-right: 0px;
        width:calc(100% - 660px)">
      <icon-park style="float:left;border-right: 1px solid #ddd;" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
      <div :class="{'avticePort':checkedPort[item.pod]}"
           @click="clickPort1(item.pod)" v-for="item in reportMap.ports"
           style="position: relative;
    top: -3px;display:inline-block;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;    cursor: pointer;
          border-radius: 10px;
    margin-left: 10px;">
        <p style="font-size: 20px;">{{ item.count }}</p>
        <p>{{ item.pod?item.pod:'Unkown' }}</p>
      </div>
    </el-card>
    <div style="clear: both;"></div>
    <el-card class="pd-20">
      <div style="line-height: 48px;">
        <el-input style="width: 235px;" placeholder="salesOrderNumber" v-model="queryParams.salesOrderNumber" @keyup.enter.native = "queryParams.pageNo = 1 ,getList()">
          <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        </el-input>

        <el-select clearable filterable style="margin-left: 20px;width: 200px!important"  placeholder="SKU ID"
                   @change=" queryParams.pageNo = 1 ,getList()" v-model="queryParams.productId">
          <el-option
            v-for="product in productList"
            :key="product.id"
            :label="product.code + '[' + product.name + ']'"
            :value="product.id"
          />
        </el-select>

        <el-select clearable style="margin-left: 20px;width: 200px!important"  placeholder="Status"  v-if="!showFactory"
                   @change=" queryParams.pageNo = 1 ,getList()" v-model="queryParams.taskName">
          <el-option v-for="task in taskNames" :label="task" :value="task"></el-option>
        </el-select>

        <el-select clearable style="margin-left: 20px;width: 200px!important"  placeholder="Category"  v-if="!showFactory"
                   @change=" queryParams.pageNo = 1 ,getList()" v-model="queryParams.category">
          <el-option v-for="category in categorys" :label="category" :value="category"></el-option>
        </el-select>


        <el-button style="margin-top: 10px ;margin-left: 15px;float: right;" slot="append"  v-if="!showFactory"  @click="createShipment" type="primary"><i class=" el-icon-plus" ></i>Create Shipment</el-button>
        <el-button style="margin-top: 10px ;margin-left: 15px;float: right;" slot="append"  v-if="!showFactory"  @click="spiltOrder" type="primary"><i class=" el-icon-plus" ></i>Split Order</el-button>
        <span style="clear: both"></span>
      </div>
      <MainTable @chooseCarrier="chooseCarrier" @sortRulesParam="sortRulesParam" :containerMap="containerMap" v-loading="loading" :showCheckbox="true"  :tableData="tableData" ref="table" v-if="tableHeight>0" :tableHeight="tableHeight" :showFactory="showFactory"></MainTable>
      <pagination
        :total="lineTotal"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 20, 50]"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import {getCategoryList, getTaskNames} from "@/api/order/task";
import { getProductList } from "@/api/system/product";
import {IconPark} from '@icon-park/vue/es/all';
import MainTable from './components/table.vue';
import { getContainerList } from "@/api/system/container";
import {getSpiltProduct, SODownloadTemplate,changeSpiltProduct} from "@/api/order/sOHeader";
import Upload from './components/upload.vue';
import ChooseCarrier  from "./components/choose-carrier.vue";
import { getSOHeaderPage,soReport,exportSOHeaderExcel } from "@/api/order/sOHeader";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getTenantId} from "@/utils/auth"
export default {
  name: "SalesOrder",
  components: {
    IconPark,MainTable,Upload,ChooseCarrier
  },
  data() {
    return {
      tableHeight:0,
      uploadUrl:'/admin-api/order/so-header/import',
      loading:false,
      importOpen:false,
      containerMap:{},
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:''
      },
      spiltParams: {
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:'',
        inputOld:'',
        inputNew:'',
        productCode:'',
      },
      tableData:[],
      checkedPort:{},
      lineTotal:0,
      carrier:'',
      dialogVisibleCarrier:false,
      dialogTableVisible:false,
      taskNames:[],
      categorys:[],
      reportMap:{},
      exportLoading:false,
      productList:[],
      gridData1 : [],
      gridData2 : [],
      gridData3 : [],
      multipleSelectionSpilt1: [],
      multipleSelectionSpilt2: [],
      table1Data: [{ id: 1, text: '数据1' }, { id: 2, text: '数据2' }],
      table2Data: [],
      spiltParam: {
        ids:[],
        orderId:''
      },
      inputNew:undefined,
      showFactory: false,
    }
  },
  mounted(){
    window.onresize = () => {
      this.calcTableHeight()
    }

    var tenantId = getTenantId()
    var tenantDatas = this.getDictDatas(DICT_TYPE.PUSH_TO_NINGBO_WMS_TENANT)
    //指定租户查看列  多显示工厂信息 ,隐藏不必要的列
    if(tenantDatas && tenantId != null){
        for (var tenants of tenantDatas) {
            if (tenants.label == 'tenantIds' && tenants.value?.split(',').map(item => item.trim()).includes(tenantId)) {
                this.showFactory = true
            }
        }
    }
    this.getProductList()
    this.calcTableHeight()
    this.getContainerList()
    this.getTaskNames()
    this.getCategoryList()
  },
  methods:{
    getProductList() {
      // 执行查询
      getProductList({ ids: [] }).then((response) => {
        this.productList=response.data
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
    handleExport(){
      this.exportLoading = true;
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;
          if(this.showFactory){
            //申明是使用第二套导出模板
            params.outboundTable = true;
            // 添加选中的ID
            if(this.$refs.table && this.$refs.table.multipleSelection && this.$refs.table.multipleSelection.length > 0){
              params.ids = this.$refs.table.multipleSelection.map(item => item.id).join(",");
            }
          }
          exportSOHeaderExcel(params).then((response) => {
            this.$download.excel(response, "smartMOOV_SO"+this.parseTimeToZ2(new Date())+".xlsx");
            this.exportLoading = false;
          }).catch(() => {
            this.exportLoading = false;
          })
        })
        .catch(() => {
          this.exportLoading = false;
        });
    },
    clickPort1(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item]);
      var ports=[]
      for(var key in this.checkedPort){
        if(this.checkedPort[key]){
          ports.push(key)
        }
      }
      this.queryParams.pods=ports
      this.queryParams.pageNo=1
      this.getList()
    },
    bookedChange(value){
      if(this.queryParams.booked==value){
        this.queryParams.booked=null
      }else{
        this.queryParams.booked=value
      }
      this.getList()
    },
    soReport(){
      soReport(this.queryParams).then((res)=>{
        this.reportMap=res.data
      })
    },
    getTaskNames(){
      getTaskNames({type:'2'}).then((res)=>{
        this.taskNames=res.data
      })
    },
    getCategoryList(){
      getCategoryList({type:'2'}).then((res)=>{
        console.log("==================res=======================");
        console.log(res);
        this.categorys=res.data
      })
    },
    createShipment(){
      var soIds=[]
      for(var i=0;i<this.$refs.table.multipleSelection.length;i++){
        soIds.push(this.$refs.table.multipleSelection[i].id)
      }
      console.log(soIds)
      if(soIds.length==0){
        this.$notify({
          title: 'warning',
          message: 'Please select sales order',
          type: 'warning'
        });
        return
      }
      this.dialogVisibleCarrier=true
    },

    getSplitList(){
      this.gridData1 = this.gridData3
      console.log(this.gridData3,"this.gridData3")
      let result = this.gridData1 && this.spiltParams.productCode.length >0 && this.gridData1.filter(item=>item.productCode===this.spiltParams.productCode)
      if (this.spiltParams.productCode.length === 0){
        this.gridData1 = this.gridData3
      }
      else{
        this.gridData1 =result
      }
      console.log(result)
      console.log(!this.spiltParams.productCode ==='')
      console.log(result)
      console.log(this.spiltParams.productCode)
      console.log(this.gridData1)
    },

    spiltOrder(){
      var soIds=[]
      for(var i=0;i<this.$refs.table.multipleSelection.length;i++){
        soIds.push(this.$refs.table.multipleSelection[i].id)
        // this.ids.push(this.$refs.table.multipleSelection[i].id)
      }
      console.log(soIds)
      if(soIds.length==0){
        this.$notify({
          title: 'warning',
          message: 'Please select sales order',
          type: 'warning'
        });
        return
      }
      else if(soIds.length>1){
        this.$notify({
          title: 'warning',
          message: 'Please select only one order',
          type: 'warning'
        });
        return
      }
      this.spiltParam.ids = []
      this.spiltParam.ids = soIds
      this.gridData2 = []
      this.spiltParams.productCode=''
      this.spiltParams.inputNew = this.$refs.table.multipleSelection[0].salesOrderNumber+"-2"
      this.spiltParams.inputOld = this.$refs.table.multipleSelection[0].salesOrderNumber+"-1"
      console.log(this.$refs.table.multipleSelection[0],"55555555555555666")
      console.log(this.$refs.table.multipleSelection[0].productCode,"55555555555555")

      getSpiltProduct({ ids: soIds.join(",") }).then((res)=>{
        this.gridData1=res.data
        this.gridData3=res.data
      })

      this.dialogTableVisible=true
    },

    handleSelectionChange1(val) {
      console.log(val,"1111111111111111111111111")
      this.multipleSelectionSpilt1 = val;
    },
    handleSelectionChange2(val) {
      console.log(val,"22222222222222222222222222")
      this.multipleSelectionSpilt2 = val;
    },

    transferData2() {
      // 可以在这里添加具体的传输逻辑
      let result = this.gridData1.filter(item => !this.multipleSelectionSpilt1.includes(item));
      console.log(result,"result-before");
      this.gridData1 = result
      this.gridData3 = result
      // this.gridData2.concat(this.multipleSelectionSpilt1)
      this.multipleSelectionSpilt1 && this.multipleSelectionSpilt1.map((item, index) => {
        this.gridData2.push(item)
      })
      console.log(this.gridData1,"gridData1");
      console.log(this.gridData2,"gridData2");
    },

    transferData1() {
      let result = this.gridData2.filter(item => !this.multipleSelectionSpilt2.includes(item));
      console.log(result,"result-before11111");
      this.gridData2 = result

      // this.gridData2.concat(this.multipleSelectionSpilt1)
      this.multipleSelectionSpilt2 && this.multipleSelectionSpilt2.map((item, index) => {
        this.gridData1.push(item)
      })
      this.gridData3 = this.gridData1
    },

    handleSplit() {
      let ids =[];
      let idsNew =[];

      this.gridData1&& this.gridData1.map((item,index)=>{
        ids.push(item.id)
      })
      this.gridData2&& this.gridData2.map((item,index)=>{
        idsNew.push(item.id)
      })
      console.log(ids,"111111111111111")
      console.log(idsNew,"22222222222222")

      this.spiltParam.orderId = this.spiltParam.ids[0]
      console.log(this.spiltParam.orderId,"3333333333333333")
      changeSpiltProduct({ ids:ids.join(","),
        idsNew:idsNew.join(",") ,
        orderId:this.spiltParam.orderId,
        numberOld:this.spiltParams.inputOld,
        numberNew:this.spiltParams.inputNew,
      }).then((res)=>{
        console.log(res.data,"66666666666")
        this.dialogTableVisible=false
        this.getList()
      })
    },

    chooseCarrier(orderId){

      this.dialogVisibleCarrier=true
    },
    sortRulesParam(sortRules, sortField){
      console.log(sortRules)
      console.log(sortField)
      this.queryParams.prop = sortField
      this.queryParams.orderBy = sortRules
      this.getList();
    },

    getContainerList() {
      getContainerList().then((response) => {
        for(var i=0;i<response.data.length;i++){
          this.containerMap[response.data[i].type]=response.data[i].tue
        }
        this.init()
      });
    },
    importTemplate(){
      SODownloadTemplate().then((res)=>{
        this.$download.excel(res, "SO Upload TempLate.xlsx");
      })
    },
    changeParentValue(value){
      this.carrier=value
      var soIds=[]
      for(var i=0;i<this.$refs.table.multipleSelection.length;i++){
        soIds.push(this.$refs.table.multipleSelection[i].id)
      }
      if(soIds.length==0){
        return
      }
      if(this.carrier=='TSHG'){
        this.$router.push("/shipment/create?carrier="+this.carrier+'&soIds='+soIds.join(','))
      }else{
        this.$router.push("/shipment/create-shipment?carrier="+this.carrier+'&soIds='+soIds.join(','));
      }
    },
    handleImport(){
      this.importOpen=true;
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 383;
    },
    reloadTable(data){
      console.log(data)
      if(data.length>0){
        var text=''
        for(var i=0;i<data.length;i++){
          text+=data[i]+'\n'
        }
        this.$notify({
          title: 'warning',
          message: text,
          type: 'warning'
        });
      }
      this.importOpen=false
      this.init()
    },
    init(){
      this.queryParams={
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:''
      }
      this.$set(this.queryParams,'salesOrderNumber',this.$route.query.orderNumber)
      this.getList();
    },
    getList(){
      this.loading=true
      this.soReport()
      getSOHeaderPage(this.queryParams).then((res)=>{
        console.log(this.queryParams,"queryParams")
        this.loading=false
        if(res.data.list!=null){
          for(var i=0;i<res.data.list.length;i++){
            res.data.list[i].key='first'+res.data.list[i].id
          }
        }
        this.tableData=res.data.list
        this.lineTotal=res.data.total

      })
    }
  }
}
</script>
<style>
p{
  margin: 0px
}
.button-container {
  text-align: center;
  display: flex;
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 0px 5px;
}

.button-container img{
  width: 24px;
  height: 24px;
  display: block;
  //margin-left: 10px;
}
.dialogwidth{
  min-width: 80%;
  min-height: 70%;
}


</style>
