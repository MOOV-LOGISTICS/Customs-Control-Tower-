<template>
    <div style="background:#fff!important;padding: 15px;" >
        <div :style="{'height':height+'px'}" v-loading="loading">
            <el-form :disabled="shipment.vgmDate!=null" ref="form" label-width="0px" :model="vgmForm" label-position="right" :show-message="false">
                <el-scrollbar  :style="{'height':height-20+'px'}">

                <el-table :summary-method="getSummaries" :data="vgmForm.vgm" show-summary border>
            <el-table-column prop="containerType" label="Container Type">

            </el-table-column>
            <el-table-column prop="containerNo" label="Container No">
            </el-table-column>
            <el-table-column prop="containerSealNumber" label="Container Seal Number">
            </el-table-column>
            <el-table-column prop="tareWeight" label="Tare Weight">
                <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'vgm.' + scope.$index + '.tareWeight'">
                        <el-input-number v-model="scope.row.tareWeight"  @change="setVGM(item)"  :precision="3" :controls="false" />
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="vgm" label="VGM">
            </el-table-column>
            <el-table-column prop="vgmMethod" label="VGM Method">
                <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'vgm.' + scope.$index + '.vgmMethod'">
                        <el-select v-model="scope.row.vgmMethod">
                            <el-option value="SM1"></el-option>
                            <el-option value="SM2"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="sign" label="Sign">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sign" />
                </template>
            </el-table-column>
        </el-table>
                </el-scrollbar>
    </el-form>
        </div>
        <div v-if="shipment.vgmDate==null&&this.vgmForm.vgm.length!=0" style="text-align: center;">
            <el-button @click="submit" type="primary">Submit</el-button>
        </div>
    </div>
  </template>

  <script>
  import { draftVGM} from "@/api/shipment/shipment";
  export default {
    name: "SI",
    components: {},
    props:{
            height:{
                type:Number
            },
            shipment:{
                type:Object
            },
    },
    data() {
      return {
        vgmForm:{
            vgm:[]
        },
        loading:false,
        shippedContainer:{}
      };
    },
    mounted() {
        console.log(this.shipment.containerDOList)
        for (var j = 0; j < this.shipment.containerDOList.length; j++) {
            if (this.shipment.containerDOList[j].type == 0) {
              continue
            }
            this.shippedContainer[this.shipment.containerDOList[j].id] = {
              poNumber: this.shipment.containerDOList[j].poNumber,
              containerNo: this.shipment.containerDOList[j].containerNo,
              containerType: this.shipment.containerDOList[j].containerType,
              departurePod: this.shipment.containerDOList[j].departurePod,
              arrivalInlandTerminal: this.shipment.containerDOList[j].arrivalInlandTerminal,
              emptyContainerReturn: this.shipment.containerDOList[j].emptyContainerReturn,
              containerGateIn: this.shipment.containerDOList[j].containerGateIn,
              subContainerType: this.shipment.containerDOList[j].subContainerType,
              containerSealNumber: this.shipment.containerDOList[j].containerSealNumber,
              remark: this.shipment.containerDOList[j].remark,
              soc: this.shipment.containerDOList[j].soc,
              tareWeight: this.shipment.containerDOList[j].tareWeight,
              grossWeight: this.shipment.containerDOList[j].grossWeight,
            };
          }
          console.log(this.shippedContainer)


        this.vgmForm.id=this.shipment.id
        console.log(this.shipment.vgmDate)
        if(this.shipment.vgmDate==null){
            console.log(3333)
            this.setData(4)
            console.log(this.vgmForm.vgm)
            if(this.vgmForm.vgm.length==0){
                var bookedContainers = this.shipment.containerDOList.filter(
                    (item) => item.type != 0
                );
                console.log(bookedContainers)
                for(var i=0;i<bookedContainers.length;i++){
                        var grossWeight = bookedContainers[i].grossWeight ? Number(bookedContainers[i].grossWeight) : 0
                        var tareWeight = bookedContainers[i].tareWeight ? Number(bookedContainers[i].tareWeight) : 0

                        this.vgmForm.vgm.push({
                            containerType: bookedContainers[i].containerType,
                            containerNo: bookedContainers[i].containerNo,
                            containerSealNumber: bookedContainers[i].containerSealNumber,
                            vgmMethod: "SM2",
                            billNo: this.shipment.shipmentBookingNumber,
                            grossWeight: grossWeight,
                            tareWeight: tareWeight,
                            vgm: grossWeight+tareWeight,
                        })
                }
                console.log(this.vgmForm.vgm)
            }
        }else{
            console.log(1111)
            this.setData(1)
        }
    },
    methods: {
        submit(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.vgmForm.source = 'booking-order';
                    this.loading=true
                    draftVGM(this.vgmForm).then((res)=>{
                        this.loading=false
                        this.$emit('after-submit');
                    })
                } else {
                    return false;
                }
            });
        },
        setData(type){
            console.log(this.shipment.shipmentVgmDOS)

            var draftContainers = this.shipment.shipmentVgmDOS.filter(
                (item) => item.type == type
            );
            console.log(draftContainers)

            if(draftContainers.length>0){
                this.vgmForm.vgm=[]
                for(var i=0;i<draftContainers.length;i++){
                    this.vgmForm.vgm.push({
                        containerType:this.shippedContainer[draftContainers[i].containerId].containerType,
                        containerNo:this.shippedContainer[draftContainers[i].containerId].containerNo,
                        containerSealNumber:this.shippedContainer[draftContainers[i].containerId].containerSealNumber,
                        tareWeight:draftContainers[i].tareWeight,
                        grossWeight:draftContainers[i].grossWeight,
                        vgm:draftContainers[i].vgm,
                        vgmMethod:draftContainers[i].vgmMethod,
                        sign:draftContainers[i].sign,
                    })
                }
                console.log(this.vgmForm)
            } else {

            }
        },
        setVGM(item) {
        item.vgm = Number(item.grossWeight) + Number(item.tareWeight);
        },
        getSummaries(param) {
            const {columns, data} = param;
                    const sums = [];
                    if (!columns) {
                        return sums = []
                    }
                    columns.forEach((column, index) => {
                        if (index == 0) {
                            sums[index] = 'Total';//可更改合计行的名称
                            return;
                        }
                        if (column.property !='vgm') {
                            sums[index] = ' ';
                            return;
                        }
                        if (data == null) {
                            sums[index] = 0;
                        } else {
                            const values = data.map(item => Number(item[column.property]));
                            if (!values.every(value => isNaN(value))) {
                                sums[index] = values.reduce((prev, curr) => {
                                    const value = Number(curr);
                                    if (!isNaN(value)) {
                                        return prev + curr;
                                    } else {
                                        return prev;
                                    }
                                }, 0);
                            }
                        }

                    });
                    return sums;
        }
    },
  };
  </script>
