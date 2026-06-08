<template>
    <div>
        <el-row :gutter="20">
            <el-col style="width: 200px;">
                <el-input v-model="productCode" placeholder="Product Code" />
            </el-col>
        </el-row>
        <el-table
        border
        max-height="400"
        show-summary
        :summary-method="getSummaries"
        :data="productCode?itemTableData.filter(item=>item.productCode.indexOf(productCode)>-1):itemTableData"
        style="width: 100%">
            <el-table-column
                prop="productCode"
                label="Product Code"
                width="180">
            </el-table-column>
            <el-table-column
                prop="productName"
                label="Product Name"
                width="180">
            </el-table-column>
            <el-table-column
                prop="warehouse"
                label="Warehouse"
                v-if="!showFactory"
                width="180">
            </el-table-column>
            <el-table-column
                prop="qty"
                label="Quantity"
                width="180">
            </el-table-column>
            <el-table-column
                v-if="showFactory"
                prop="outboundQty"
                label="Outbound Quantity"
                width="180">
                <template v-slot="scope">
                    <!-- 同样比较两值，不等则显示红色 -->
                    <span :style="{
                        color: (
                            scope.row.qty != scope.row.outboundQty &&  // 两值不一致
                            scope.row.outboundQty > 0 ) ? 'red' : ''   // 实际值大于0
                        }">
                        {{scope.row.outboundQty }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="showFactory"
                prop="packedQty"
                label="Packed Quantity"
                width="180">
                <template v-slot="scope">
                    <!-- 比较实际打包数量与订单数量，不等则显示红色 -->
                    <span :style="{
                        color: (
                            scope.row.qty != scope.row.packedQty &&  // 两值不一致
                            scope.row.packedQty > 0 ) ? 'red' : ''   // 实际值大于0
                        }">
                        {{scope.row.packedQty || 0}}
                    </span>
                </template>
            </el-table-column>
          <el-table-column
            v-if="showFactory"
            prop="masterCartonLength"
            label="Length"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="showFactory"
            prop="masterCartonWidth"
            label="Width"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="showFactory"
            prop="masterCartonHeight"
            label="Height"
            width="100">
          </el-table-column>
<!--          计算cbm=长*宽*高*预定数量 保留2位小数 ，判断空值 -->

          <el-table-column
            label="Expected CBM"
            width="130">
            <template v-slot="scope">
              {{ calculateExpectedCbm(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Actual CBM"
            width="130">
            <template v-slot="scope">
                    <span :style="{
                        color: (
                            calculateExpectedCbm(scope.row) !== (scope.row.outboundCbm || 0) &&  // 两值不一致
                            scope.row.outboundCbm > 0 ) ? 'red' : ''   // 实际值大于0
                        }">
                        {{ scope.row.outboundCbm || 0 }}
                    </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Packed CBM"
            width="130">
            <template v-slot="scope">
                    <span :style="{
                        color: (
                            calculateExpectedCbm(scope.row) !== (scope.row.packedCbm || 0) &&  // 两值不一致
                            scope.row.packedCbm > 0 ) ? 'red' : ''   // 实际值大于0
                        }">
                        {{ scope.row.packedCbm || 0 }}
                    </span>
            </template>
          </el-table-column>

            <el-table-column
                prop="unit"
                label="Unit"
                width="100">
            </el-table-column>

            <el-table-column
                prop="pod"
                width="100"
                v-if="showCheckbox && !showFactory"
                label="">
                <template v-slot="scope">
                    <span @click="edit(scope.row,scope.$index)" style="text-decoration: underline;color:#004F7C;cursor: pointer;">Edit</span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
        title="Update Item"
        :visible.sync="editVisable"
        width="400px"
        center>
            <el-form :show-message="false" :model="form" label-width="140px">
                <el-form-item label="Warehouse" required prop="warehouse">
                    <el-select filterable v-model="form.warehouse" placeholder="">
                        <el-option
                            v-for="dict in warehouseList"
                            :key="dict.value"
                            :label="dict.warehouseName"
                            :value="dict.warehouseName"
                        />
                        </el-select>
                </el-form-item>
                <el-form-item label="Product Code" required prop="productId">
                    <el-select filterable @change="changeProduct" v-model="form.productId" placeholder="">
                        <el-option
                            v-for="dict in productData"
                            :key="dict.value"
                            :label="dict.code+'['+dict.name+']'"
                            :value="dict.id"
                        />
                        </el-select>
                </el-form-item>
                <el-form-item label="Quantity" required prop="qty">
                    <el-input v-model="form.qty" />
                </el-form-item>
                <el-form-item label="Unit" required prop="unit">
                    <el-select filterable v-model="form.unit" placeholder="">
                        <el-option
                            v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                        </el-select>
                </el-form-item>
                <!-- <el-form-item label="POL" required prop="pol">
                    <el-select  placeholder="POL" filterable v-model="form.pol">
                    <el-option
                        v-for="dict in this.portData"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                    </el-select>
                </el-form-item>
                <el-form-item label="POD" required prop="pod">
                    <el-select  placeholder="POD" filterable v-model="form.pod">
                    <el-option
                        v-for="dict in this.portData"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                    </el-select>
                </el-form-item> -->



            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisable = false">Cancel</el-button>
            <el-button type="primary" @click="submit">Confirm</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { findShippingSchedulePortList } from "@/api/shipment/shipment";
import { getProductList2 } from "@/api/system/product";
import { getWarehouseList } from "@/api/system/warehouse";
import { updateSOItem } from "@/api/order/soItem";
    export default {
        name: "Table",
        props:{
            itemTableData:{
                type: Array,
            },
            showCheckbox:{
                type:Boolean
            },
            showFactory:{
                type:Boolean
            }
        },
        components: {
        },
        data() {
            return {
                productCode:'',
                editVisable:false,
                form:{},
                portData:[],
                productData:[],
                warehouseList:[],
                index:-1
            }
        },
        mounted(){
            if(this.showCheckbox){
                this.findShippingSchedulePortList()
                this.getProductList()
                this.getWarehouseList()
            }

        },
        methods:{
            changeProduct(value){

                var arr=this.productData.filter(item=>item.id==value)
                this.form.productCode=arr[0].code
                this.form.productName=arr[0].name
                console.log(this.form)

            },
            submit(){
                updateSOItem(this.form).then((res)=>{
                    if(res.code==0){
                        this.$notify({
                            title: 'success',
                            message: 'success',
                            type: 'success'
                        });
                        this.editVisable=false
                        this.$emit('updateSOItem',{'index':this.index,'data':JSON.parse(JSON.stringify(this.form))})
                    }
                })
            },
            getProductList(){
                getProductList2().then((res)=>{
                    this.productData=res.data
                })
            },
            getWarehouseList(){
                getWarehouseList().then((res)=>{
                    this.warehouseList=res.data
                })
            },
            findShippingSchedulePortList() {
                findShippingSchedulePortList().then((response) => {
                    this.portData = response.data;
                });
            },
            edit(row,index){
                this.editVisable=true
                this.index=index
                this.form=JSON.parse(JSON.stringify(row))
            },
          calculateExpectedCbm(row) {
              if (row.masterCartonQty && row.masterCartonCbm && row.qty) {
                // 转换为立方米（m³）并乘以数量
                const volumeCbm = ((row.masterCartonCbm / row.masterCartonQty) * row.qty).toFixed(3);
                return volumeCbm;
              }
              return 0;
            },
            getSummaries(param) {
                    const {columns, data} = param;
                    const sums = [];
                    if (!columns) {
                        return sums = []
                    }
                    columns.forEach((column, index) => {
                    console.log(column.property)
                        if (index == 0) {
                            sums[index] = 'Total';//可更改合计行的名称
                            return;
                        }
                        if (column.label === 'CBM' || column.label === 'Actual CBM' || column.label === 'Packed CBM') {
                          const totalCBM = data.reduce((sum, row) => {
                            let value = 0;
                            if (column.label === 'CBM') {
                              value = parseFloat(this.calculateExpectedCbm(row)) || 0;
                            } else if (column.label === 'Actual CBM') {
                              value = parseFloat(row.outboundCbm) || 0;
                            } else if (column.label === 'Packed CBM') {
                              value = parseFloat(row.packedCbm) || 0;
                            }
                            return sum + value;
                          }, 0);
                          sums[index] = totalCBM.toFixed(3);
                          return;
                        }
                        if (column.property !='qty' && column.property !='outboundQty' && column.property !='packedQty') {
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
            },
        }
    }
</script>
<style></style>
