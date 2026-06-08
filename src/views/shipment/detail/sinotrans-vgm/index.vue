<template>
    <div class="app-container" style="background-color: #fff;">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="containerType"
                label="Container Type"
                width="100">
            </el-table-column>
            <el-table-column
                prop="containerNo"
                label="Container No."
                width="100">
            </el-table-column>
            <el-table-column
                prop="containerSealNumber"
                label="Container Seal No."
                width="120">
            </el-table-column>
            <el-table-column
                prop="vgm"
                label="VGM(KG)">
                <template v-slot="scope">
                    {{ scope.row.vgm }}
                </template>
            </el-table-column>
            <el-table-column
                prop="tareWeight"
                label="Tare Weight">
                <template v-slot="scope">
                    <el-input @input="sum(scope.row)" v-model="scope.row.tareWeight" />
                </template>
            </el-table-column>
            <el-table-column
                prop="grossWeight"
                label="Gross Weight">
            </el-table-column>
            <el-table-column
                prop="vgmMethod"
                label="Vgm Method">
                <template v-slot="scope">

                    <el-select v-model="scope.row.vgmMethod">
                        <el-option value="SM1"></el-option>
                        <el-option value="SM2"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="sign"
                label="Sign">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sign" />
                </template>
            </el-table-column>
            <el-table-column
                v-if="showWoColumn"
                prop="weighingCertificateNumber"
                label="Weighing Certificate Number"
                width="180">
                <template v-slot="scope">
                    <el-input v-model="scope.row.weighingCertificateNumber" />
                </template>
            </el-table-column>
            <el-table-column
                v-if="showWoColumn"
                prop="weighingTime"
                label="Weighing Time"
                width="140">
                <template v-slot="scope">
                    <el-date-picker type="date" value-format="timestamp" v-model="scope.row.weighingTime"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column
                prop="soc"
                label="SOC"
                width="140">
                <template v-slot="scope">
                  <el-switch disabled v-model="scope.row.soc" active-text="Yes" inactive-text="No"/>
                </template>
            </el-table-column>
            </el-table>
        <div style="text-align: right;margin-top: 15px">
            <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="noVgmEdi" >No EDI</el-checkbox></span>

            <el-button type="primary" @click="submitSinotransVGM">Submit</el-button>
        </div>
    </div>
</template>

  <style>

  </style>

  <script>
  export default {
    name: "sinotrans-vgm",
    props:{
        showWoColumn: {
          type: Boolean,
          default: true
        },
        shipmentVgmDOS: {
            type: Array,
            default: () => []
        },
        containerDOList: {
            type: Array,
            default: () => []
        },
        shippedContainer: {
            type: Object,
            default: () => ({})
        },
        shipmentId:{
            type: Number,
        },
        name:{
            type: String,
        },
        noVgmEdi: {
          type: Boolean,
          default: false
        },
    },
    components: {
    },
    data() {
      return {
        tableData:[]
      };
    },
    mounted() {
        if(this.shipmentVgmDOS.length>0){
            for(var i=0;i<this.shipmentVgmDOS.length;i++){

                var obj=JSON.parse(JSON.stringify(this.shipmentVgmDOS[i]))
                obj.containerType=this.shippedContainer[this.shipmentVgmDOS[i].containerId].containerType
                obj.containerNo=this.shippedContainer[this.shipmentVgmDOS[i].containerId].containerNo
                obj.containerSealNumber=this.shippedContainer[this.shipmentVgmDOS[i].containerId].containerSealNumber
                this.tableData.push(obj)
            }
        }else{
            for(var i=0;i<this.containerDOList.length;i++){
                if(this.containerDOList[i].type != 1){
                    continue
                }
                let sumVgm = 0;
                if (this.containerDOList[i] && (this.containerDOList[i].grossWeight !== undefined || this.containerDOList[i].tareWeight !== undefined)) {
                  const grossWeight = Number(this.containerDOList[i].grossWeight) || 0;
                  const tareWeight = Number(this.containerDOList[i].tareWeight) || 0;
                  sumVgm = grossWeight + tareWeight;
                }
                this.tableData.push({
                    grossWeight:this.containerDOList[i].grossWeight,
                    containerId:this.containerDOList[i].id,
                    vgmMethod:'SM2',
                    sign:this.name,
                    weighingTime:new Date(),
                    containerType:this.containerDOList[i].containerType,
                    containerNo:this.containerDOList[i].containerNo,
                    containerSealNumber:this.containerDOList[i].containerSealNumber,
                    tareWeight: this.containerDOList[i].tareWeight,
                    vgm: sumVgm.toFixed(3),
                    soc: this.containerDOList[i].soc,
                })
            }
        }
    },
    methods:{
        sum(item){
            item.vgm=Number(item.grossWeight)+Number(item.tareWeight)
        },
        submitSinotransVGM(){
            var data={
                vmg:JSON.stringify(this.tableData),
                shipmentId:this.shipmentId,
                noVgmEdi:this.noVgmEdi,
            }
            this.$emit('submitSinotransVGM',data)
        }
    }
  };
  </script>
