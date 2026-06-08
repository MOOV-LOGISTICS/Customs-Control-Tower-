<template>
  <div class="app-container shipment-create" style="width:100%; margin: 0 auto">

    <el-card class="pd-20">

    <el-form ref="form" :model="form" :show-message="false" >
      <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="4"><div style="font-size: 18px;">Contract Rate Maintain</div></el-col>
        </el-row>
        <el-divider></el-divider>
      <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="4"><div style="font-size: 16px;">General</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="3">
            Carrier
          </el-col>
          <el-col :span="3">
            Contract Number
          </el-col>
          <el-col :span="3">
            Effective Date
          </el-col>
          <el-col :span="3">
            Expiry Date
          </el-col>
          <el-col :span="3">
            Rate Type
          </el-col>
        </el-row>

        <el-row :gutter="20" class="contract-css">
          <el-col :span="3">
            <el-form-item required prop="carrier">
              <el-select filterable v-model="form.carrier" size="mini">
                <el-option
                  v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
                  :key="dict.value"
                  :label="dict.label+' ('+dict.value+')'"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="contractNumber">
              <el-input v-model="form.contractNumber" size="mini"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="validFrom">
              <el-date-picker value-format="timestamp" v-model="form.validFrom" size="mini"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="validTo">
              <el-date-picker value-format="timestamp" v-model="form.validTo" size="mini"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="rateType">
              <el-select filterable v-model="form.rateType">
                <el-option label="FAK-Freight All Kinds Rate" value="FAK"></el-option>
                <el-option label="NAC-NAME ACCOUNT" value="NAC"></el-option>
                <el-option label="SCFI" value="SCFI"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="oceanform" :model="selectRow" :show-message="false" >

        <el-divider></el-divider>
         <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="4"><div style="font-size: 16px;">Ocean Freight</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="3">
            Container Type
          </el-col>
          <el-col :span="3">
            Org. Intransit
          </el-col>
          <el-col :span="3">
            Orgin
          </el-col>
          <el-col :span="3">
            Delivery
          </el-col>
          <el-col :span="3">
            Load Port
          </el-col>
          <el-col :span="3">
            Discharge Port
          </el-col>
          <el-col :span="3">
            Del. Intransit
          </el-col>

        </el-row>

        <el-row :gutter="20" class="contract-css">
          <el-col :span="3">
            <el-form-item required prop="containerType">
              <el-select
                filterable
                v-model="selectRow.containerType"
              >
                <el-option
                  v-for="item in containerOptions"
                  :label="item.type"
                  :value="item.type"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="orgIntransit">
              <el-input v-model="selectRow.orgIntransit" size="mini"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required  prop="pol">
              <el-select  filterable v-model="selectRow.pol">
                <el-option
                  v-for="(item, index) in portOptions"
                  :key="index + 'pol'"
                   :label="item.name+' ('+item.code+')'" 
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="pod">
              <el-select  filterable v-model="selectRow.pod">
                <el-option
                  v-for="(item, index) in portOptions"
                  :key="index + 'pod'"
                   :label="item.name+' ('+item.code+')'" 
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item  required prop="originPort">
              <el-select  filterable v-model="selectRow.originPort">
                <el-option
                  v-for="(item, index) in portOptions"
                  :key="index + 'pol1'"
                   :label="item.name+' ('+item.code+')'" 
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item  required prop="destinationPort">
              <el-select  filterable v-model="selectRow.destinationPort">
                <el-option
                  v-for="(item, index) in portOptions"
                  :key="index + 'pod1'"
                   :label="item.name+' ('+item.code+')'" 
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item required prop="delIntransit">
              <el-input v-model="selectRow.delIntransit" size="mini"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="3">
            Amount
          </el-col>
          <el-col :span="3">
            Currency
          </el-col>
          <el-col :span="3">
            Carriage Term
          </el-col>
          <el-col :span="3">
            TOS
          </el-col>
          <el-col :span="3">
            Rule
          </el-col>
          <el-col :span="3">
            Commodity
          </el-col>
          <el-col :span="1">
            SOC
          </el-col>
          <el-col :span="1">
            DG
          </el-col>
          <el-col :span="1">
            OOG
          </el-col>
        </el-row>

        <el-row :gutter="20" class="contract-css">
          <el-col :span="3">
            <el-form-item required prop="amount">
              <el-input v-model="selectRow.amount" size="mini"/>
            </el-form-item>
          </el-col>
        <el-col :span="3">
          <el-form-item required prop="currency">
          <el-select filterable v-model="selectRow.currency">
                <el-option label="USD" value="USD"></el-option>
                <el-option label="EUR" value="EUR"></el-option>
                <el-option label="CNY" value="CNY"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item required prop="carriageTerm">
          <el-select filterable v-model="selectRow.carriageTerm">
                <el-option label="CY/CY" value="CY/CY"></el-option>
                <el-option label="CY/DOOR" value="CY/DOOR"></el-option>
                <el-option label="DOOR/CY" value="DOOR/CY"></el-option>
                <el-option label="DOOR/DOOR" value="DOOR/DOOR"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item required prop="tos">
          <el-select filterable v-model="selectRow.tos">
                <el-option label="EXW-Ex Works" value="EXW"></el-option>
                <el-option label="FCA-Free Carrier" value="FCA"></el-option>
                <el-option label="CPT-Carriage Paid to" value="CPT"></el-option>
                <el-option label="CIP-Carriage and Insurance Paid to" value="CIP"></el-option>
                <el-option label="DAP-Delivered at Place" value="DAP"></el-option>
                <el-option label="DPU-Delivered at Place Unloaded" value="DPU"></el-option>
                <el-option label="DDP-Delivered Duty Paid" value="DDP"></el-option>
                <el-option label="FAS-Free Alongside Ship" value="FAS"></el-option>
                <el-option label="FOB-Free On Board" value="FOB"></el-option>
                <el-option label="CFR-Cost and Freight" value="CFR"></el-option>
                <el-option label="CIF-Cost, Insurance and Freight" value="CIF"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item required prop="rule">
          <el-select filterable v-model="selectRow.rule">
                <el-option label="OF-Ocean Freight" value="OF"></el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
            <el-form-item required prop="commodity">
              <el-input v-model="selectRow.commodity" size="mini"/>
            </el-form-item>
          </el-col>

          <el-col :span="1">
              <el-checkbox v-model="selectRow.soc"></el-checkbox>
          </el-col>
          <el-col :span="1">
              <el-checkbox v-model="selectRow.dg"></el-checkbox>
          </el-col>
          <el-col :span="1">
              <el-checkbox v-model="selectRow.oog"></el-checkbox>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </el-form>


        <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="2"><div style="font-size: 16px;">Surcharge</div></el-col>
          <el-col :span="4">
            <el-button @click="handleAdd" type="primary">Add</el-button>
          </el-col>
        </el-row>
        <!--Surcharge table -->
        <!-- 列表 -->
          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="8">
              <el-table height="150px" :data="selectRow.surchargeItem" style="width: 600px;" border>
                <!-- <el-table-column label="Item No." align="center" prop="carrier"/> -->
                <el-table-column label="Charge Code" align="center" prop="chargeCode"/>
                <el-table-column label="Amount" align="center" prop="amount"/>
                <el-table-column label="Currency" align="center" prop="currency"/>
                <el-table-column label="VATOS" align="center" prop="vatos"/>
              </el-table>
            </el-col>
              <el-button @click="save" type="primary" style="position: absolute;bottom: 0;right: 30px;">Save</el-button>
          </el-row>



        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="4">Details</el-col>
        </el-row>
        <!--item table -->
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="form.ocean"  border @select="selectChange">
      <el-table-column type="selection" prop="itemNo" align="rignt" width="70" class-name="small-padding fixed-width">
      </el-table-column>
      <el-table-column label="Item No." align="center" prop="itemNo"/>
      <el-table-column label="Container Type" align="center" prop="containerType"/>
      <el-table-column label="Org. Intransit" align="center" prop="orgIntransit"/>
      <el-table-column label="Orgin" align="center" prop="pol"/>
      <el-table-column label="Delivery" align="center" prop="pod"/>
      <el-table-column label="Load Port" align="center" prop="originPort"/>
      <el-table-column label="Discharge Port" align="center" prop="destinationPort"/>
      <el-table-column label="Del. Intransit" align="center" prop="delIntransit"/>
      <el-table-column label="Amount" align="center" prop="amount"/>
      <el-table-column label="Currency" align="center" prop="currency"/>
      <el-table-column label="Carriage Term" align="center" prop="carriageTerm"/>
      <el-table-column label="TOS" align="center" prop="tos"/>
      <el-table-column label="Rule" align="center" prop="rule"/>
      <el-table-column label="Commodity" align="center" prop="commodity"/>
      <el-table-column label="SOC" align="center" prop="soc">
        <template slot-scope="scope">
          {{ scope.row.soc==true?'Y':'N' }}
        </template>
      </el-table-column>
      <el-table-column label="DG" align="center" prop="dg">
        <template slot-scope="scope">
          {{ scope.row.dg==true?'Y':'N' }}
        </template>
      </el-table-column>
      <el-table-column label="OOG" align="center" prop="oog">
        <template slot-scope="scope">
          {{ scope.row.oog==true?'Y':'N' }}
        </template>
      </el-table-column>
      <el-table-column label="Actions">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="deleteRowOcean(scope.$index,scope.row)"
              >{{ $t("search.delete") }}
              </el-button>
            </template>
          </el-table-column>




    </el-table>
    <el-row :gutter="20">
    <el-col :span="24" style="text-align: center;margin-top: 10px;">
        <el-button @click="handleSubmit" type="primary" style="">Submit</el-button>
    </el-col>
    </el-row>
    </el-card>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="60%"
    :before-close="handleClose"
    destroy-on-close>
      <el-form ref="subItemData"  size="mini" label-width="80px">
        <el-row :gutter="20" style="margin-bottom: 15px;">
          <el-col :span="4">
            <el-button @click="addItemRow" type="primary">Add</el-button>
          </el-col>
        </el-row>
        <el-table  v-loading="subItemLoading"
          :data="selectRow.subItemData"
          stripe
          max-height="400"
          style="width: 100%">
          <el-table-column
            prop="chargeCode"
            label="Charge Code">
            <template slot-scope="scope">
              <el-select v-model="scope.row.chargeCode" clearable filterable>
                <el-option
                  v-for="dict in surchargeCode"
                  :key="dict.code"
                  :label="dict.code+'-'+dict.name"
                  :value="dict.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="Amount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount"/>
            </template>
          </el-table-column>
           <el-table-column prop="currency" label="Currency">
            <template slot-scope="scope">
              <el-select filterable v-model="scope.row.currency">
                <el-option label="USD" value="USD"></el-option>
                <el-option label="EUR" value="EUR"></el-option>
                <el-option label="CNY" value="CNY"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="vatos" label="VAOTS">
            <template slot-scope="scope">
              <el-select filterable v-model="scope.row.vatos">
                <el-option label="YES" value="YES"></el-option>
                <el-option label="NO" value="NO"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="deleteRow(scope.$index,scope.row)"
              >{{ $t("search.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSurcharge">Submit</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}
.el-row {
    margin-bottom: 1px;
  }
  .grid-content {
    min-height: 36px;
  }
</style>

<script>
import { getContainerList } from "@/api/system/container";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getRateById, saveRate} from "@/api/booking/rate";

export default {
  name: "rate",
  components: {},
  data() {
    return {
      loading:false,
      subItemLoading:false,
      form:{
        ocean:[]
      },
      selectIndex:null,
      selectRow:{
        subItemData:[],
        surchargeItem:[],
        soc:false,
        dg:false,
        oog:false,
      },
      currentRow:null,
      containerOptions: [],
      portOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      surchargeCode:[
        {'code':'GRI','name':'General Rate Increase'},
        {'code':'PSS','name':'Peak Season Surcharge'},
        {'code':'EBS','name':'Emergency Bunker Surcharge'},
        {'code':'OTHC','name':'Origin Terminal Handling Charge'},
        {'code':'DTHC','name':'Destination Terminal Handling Charge'},
        {'code':'ORC','name':'Original Receiving Charge'},
        {'code':'PCS','name':'Port Congestion Surcharge'},
        {'code':'CIC','name':'Container Imbalance Charge'},
        {'code':'DDC','name':'Destination Delivery Charge'},
        {'code':'HLA','name':'Heavy-Lift Additional'},
        {'code':'CAF','name':'Currency Adjustment Factor'},
        {'code':'LLA','name':'Long Length Additional'},
        {'code':'ECRS','name':'Emergency Cost Recovery Surcharge'},
        {'code':'FAF','name':'Fuel Adjustment Factor'},
        {'code':'ENS','name':'Entry Summary Declaration'},
        {'code':'SCS','name':'Suez Canal Surcharge'},
        {'code':'PTF','name':'Panama Canal Transit Fee'},
        {'code':'DOC','name':'Document Fee'},
        {'code':'AMS','name':'Automatic Manifest System'},
        {'code':'TAR','name':'Temporary Additional Risks'},
        {'code':'ACI','name':'Advance Commercial Information'},
        {'code':'CC','name':'Cleaning Charge'},
        {'code':'B.A.F.','name':'BUNKER SURCHARGE'},
        // {'code':'','name':'TRANSHIPMENT SURCHARGE'},
        // {'code':'','name':'DIRECT ADDITIONAL'},
        // {'code':'','name':'PORT SUECHARGE'},
        // {'code':'','name':'OPTIONAL SURCHARGE'},
        // {'code':'','name':'DEVIATION SURCHARGE'},
        // {'code':'','name':'ALTERNATIONAL OF DESTINATION CHARGE'},
        {'code':'CSC','name':'Container Service Charge'},
      ]
    };
  },
  mounted() {
    console.log("mounted")
  },
  created() {
    console.log("created")
    this.getPortList();
    this.getContainerList();

    if(this.$route.query.id){
      this.getRateById(this.$route.query.id);
    }
  },
  methods: {
    getRateById(id){
        this.loading = true;
        // 执行查询
        getRateById(id).then(response => {
          this.loading = false;
          this.form = response.data;

        });
    },
    selectChange(selection) {
      if (selection.length > 1) {
          const del_row = selection.shift();
          this.$refs.table.toggleRowSelection(del_row, false);
        }
        console.log(selection);
        if (selection.length > 0) {
          let row = selection[0];
          console.log(row.itemNo-1);
          console.log(this.form.ocean);
          this.selectRow = {};
          this.selectRow = this.form.ocean[row.itemNo-1];
          console.log(this.selectRow);
        } else {
          this.resetSelectRow();
        }
    },
    getContainerList() {
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
    },
    getPortList() {
      getOriginDeliveryList().then((response) => {
        this.portOptions = response.data;
      });
    },

    handleClose(){
      this.open=false
    },
    addItemRow() {
      this.selectRow.subItemData.push({});
    },
    handleAdd() {
      this.open = true;
      this.title = "Add Surcharge";
      let newobj = JSON.parse(JSON.stringify(this.selectRow.surchargeItem))
      this.selectRow.subItemData = newobj;
      if(this.selectRow.surchargeItem==null||this.selectRow.surchargeItem.length<1) {
        this.addItemRow()
      }
    },
    deleteRow(index,row) {
        this.selectRow.subItemData.splice(index, 1);
    },
    deleteRowOcean(index,row) {
        this.form.ocean.splice(index, 1);
      var i = 1;
      for (var item of this.form.ocean) {
        item.itemNo = i;
        i++;
      }
    },
    resetSelectRow() {
      this.selectRow = {subItemData:[],surchargeItem:[],soc:false,dg:false,oog:false,};
    },
    save() {
      console.log(this.selectRow)
      this.$refs["oceanform"].validate(valid => {
        console.log(valid)
        if (!valid) {
          return;
        }
        let newobj = JSON.parse(JSON.stringify(this.selectRow))
        this.form.ocean.push(newobj);
        this.resetSelectRow();
        var i = 1;
        for (var item of this.form.ocean) {
          item.itemNo = i;
          i++;
        }
      });


    },
    submitSurcharge() {
        this.selectRow.surchargeItem = []
        for (var item of this.selectRow.subItemData) {
          console.log(item)
          if(item.chargeCode==null&&item.amount==null&&item.currency==null&&item.vatos==null) {
          } else {
            this.selectRow.surchargeItem.push(item)
          }
        }
        this.open = false;
        this.selectRow.subItemData = [];
    },
    handleSubmit() {
      console.log(this.form)
      // 删除之前的所有的；如果存在id的话；
      // 如果不存在id；直接新增；
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        // 执行查询
        saveRate(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.loading = false;
          this.$router.push("/contract/contractManage");
        });
      });
    },

  },
};
</script>
