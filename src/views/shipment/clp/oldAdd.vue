<template>
    <div class="app-container" style="width:100%; margin: 0 auto">
        <div style="position: relative">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M41.4004 11.551L36.3332 5H11.6666L6.58398 11.551" stroke="#444" stroke-width="4"
                    stroke-linecap="square" stroke-linejoin="bevel" />
                <path
                    d="M6 13C6 11.8954 6.89543 11 8 11H40C41.1046 11 42 11.8954 42 13V40C42 41.6569 40.6569 43 39 43H9C7.34315 43 6 41.6569 6 40V13Z"
                    fill="#2F88FF" stroke="#444" stroke-width="4" stroke-linejoin="bevel" />
                <path d="M32 27L24 35L16 27" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                    stroke-linejoin="bevel" />
                <path d="M23.9917 19V35" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                    stroke-linejoin="bevel" />
            </svg>
            <span style="position: absolute; top: 12px; font-size: 20px">
                Container Loading Plan</span>
        </div>
        <el-divider content-position="left"> </el-divider>
        <el-form :model="form">
            <el-row>
                <el-col :span="6">
                    <el-form-item required prop="shipmentId">
                        <el-select remote @change="changeBl()" :remote-method="remoteMethod" v-model="form.shipmentId"
                            filterable placeholder="Booking Number">
                            <el-option v-for="item in shipments" :key="item.value" :label="item.shipmentBookingNumber"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col style="border: 1px solid #ddd; padding: 20px 0px" v-show="JSON.stringify(shipment) != '{}'">
                    <el-descriptions :colon="false" style="border: none" :column="3">
                        <el-descriptions-item :label="$t('booking.carrier')">
                            {{ shipment.carrier }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.placeOfReceipt')">
                            {{
                            originDeliveryMap[shipment.pol]
                            ? originDeliveryMap[shipment.pol]
                            : shipment.pol
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.finalDestination')">
                            {{
                            originDeliveryMap[shipment.pod]
                            ? originDeliveryMap[shipment.pod]
                            : shipment.pod
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.portOfLoading')">
                            {{
                            polPodMap[shipment.originPort]
                            ? originDeliveryMap[shipment.originPort]
                            : shipment.originPort
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.portOfDischarge')">
                            {{
                            polPodMap[shipment.destinationPort]
                            ? originDeliveryMap[shipment.destinationPort]
                            : shipment.destinationPort
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item> </el-descriptions-item>

                        <el-descriptions-item label="Carrier Booking Ref">
                            {{ shipment.shipmentBookingNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item label="MOOV Booking Ref">
                            {{ shipment.bookingNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.contractNumber')">
                            {{ shipment.contractNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.carriageContract')">
                            {{ shipment.contractType }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.payment_term')">
                            {{ shipment.paymentTerm }}
                        </el-descriptions-item>
                        <el-descriptions-item> </el-descriptions-item>
                        <el-descriptions-item :label="$t('booking.remark')">
                            {{ shipment.remark }}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-col>
                <el-col v-show="bookings.length > 0" style="margin-top: 10px">
                    <el-card style="padding: 15px;">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item :title="'Shipper Booking Ref:' + item.data.bookingNumber"
                                :name="item.data.id" v-for="(item, index) in bookings" :key="index">
                                <el-descriptions style="box-shadow:none" :column="4" v-for="(data, index) in item.items"
                                    :key="index">
                                    <el-descriptions-item label="Order Number">{{
                                        data.orderNumber
                                        }}</el-descriptions-item>
                                    <el-descriptions-item label="Product Code">{{
                                        data.productCode
                                        }}</el-descriptions-item>
                                    <el-descriptions-item label="Product Name">{{
                                        data.productName
                                        }}</el-descriptions-item>
                                    <el-descriptions-item label="Booked Quantity">{{
                                        data.pb_qty
                                        }}</el-descriptions-item>
                                </el-descriptions>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                </el-col>
                <el-col style="margin-top: 10px">
                    <el-card style="padding: 15px;">

                        <!--            <el-upload :auto-upload="false" style="margin-bottom: 5px; display:inline-block;margin-right:20px;    position: relative;top: -10px;"-->
                        <!--              class="upload-demo"-->
                        <!--              :on-change="handleChange">-->
                        <!--              <el-button size="mini" type="primary">Upload</el-button>-->
                        <!--            </el-upload>-->
                        <!--            <el-button style="position: relative;top:-10px;margin-right: 10px;" @click="downloadImportTemplate">Download Template</el-button>-->
                        <span @click="addClpDetail" style="cursor: pointer;"><svg width="30" height="30"
                                viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 6H8C6.89543 6 6 6.89543 6 8V16" stroke="#444" stroke-width="4"
                                    stroke-linecap="square" stroke-linejoin="bevel" />
                                <path d="M16 42H8C6.89543 42 6 41.1046 6 40V32" stroke="#444" stroke-width="4"
                                    stroke-linecap="square" stroke-linejoin="bevel" />
                                <path d="M32 42H40C41.1046 42 42 41.1046 42 40V32" stroke="#444" stroke-width="4"
                                    stroke-linecap="square" stroke-linejoin="bevel" />
                                <path d="M32 6H40C41.1046 6 42 6.89543 42 8V16" stroke="#444" stroke-width="4"
                                    stroke-linecap="square" stroke-linejoin="bevel" />
                                <path d="M32 24L16 24" stroke="#444" stroke-width="4" stroke-linecap="square"
                                    stroke-linejoin="bevel" />
                                <path d="M24 32L24 16" stroke="#444" stroke-width="4" stroke-linecap="square"
                                    stroke-linejoin="bevel" />
                            </svg></span>
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="date" label="PO Item" width="140">
                                <template v-slot="scope">
                                    <el-select v-model="scope.row.itemId"
                                        @change="radioChange(scope.$index, scope.row.itemId)"
                                        @clear="clearSelect(scope.$index)" clearable filterable placeholder="">
                                        <el-option v-for="item in itemOptions" :key="scope.$index +'sel'+item.id"
                                            :label="item.orderNumber" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="productCode" label="Product Code" width="120">
                            </el-table-column>
                            <el-table-column prop="productName" label="Product Name" width="180">
                                <template v-slot="scope">
                                    <div
                                        style="white-space: nowrap;overflow: hidden;  text-overflow: ellipsis;width: 180px;">
                                        {{ scope.row.productName }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Container Type" width="120">
                                <template v-slot="scope">
                                    <el-select filterable v-model="scope.row.containerType">
                                        <el-option v-for="item in containerOptions" :label="item.type"
                                            :value="item.type" :key="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Container No" width="150">
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.containerNo" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Container Seal No" width="150">
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.containerSealNo" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Quantity" width="100">
                                <template v-slot="scope">
                                    <el-input-number v-model="scope.row.qty" :controls="false" :precision="0" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Weight" width="100">
                                <template v-slot="scope">
                                    <el-input-number v-model="scope.row.weight" :controls="false" :precision="3" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="CBM" width="100">
                                <template v-slot="scope">
                                    <el-input-number v-model="scope.row.cbm" :controls="false" :precision="3" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Remark">
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.remark" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="Operation" width="180">
                                <template v-slot="scope">
                                    <el-button size="mini" type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col style="margin-top: 10px; text-align: center">
                    <el-button type="primary" @click="submit">Submit</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import { findBookingNumberList } from "@/api/shipment/shipment";
    import { getOriginDeliveryList } from "@/api/system/originDelivery";
    import { getPolPodList } from "@/api/system/polPod";
    import { getListByShipmentId } from "@/api/booking/booking";
    import { getItemList } from "@/api/order/item";
    import { getContainerList } from "@/api/system/container";
    import { createClp, downloadShipmentCLPTemplate } from "@/api/shipment/clp";
    import XLSX from "xlsx";
    export default {
        name: "CLP",
        components: {},
        data() {
            return {
                form: {},
                shipment: {},
                polPodMap: {},
                originDeliveryMap: {},
                shipments: [],
                tableData: [],
                containerOptions: [],
                activeNames: [],
                bookings: [],
                itemOptions: [],
                currentRow: null,
            };
        },
        mounted() {
            this.getPortList();
            this.getContainerList();
            if (this.$route.query.shipmentId) {
                this.remoteMethod(this.$route.query.bookingNumber)
            }
        },
        methods: {
            downloadImportTemplate() {
                downloadShipmentCLPTemplate({}).then((res) => {
                    this.$download.excel(res, "import_template.xlsx");
                })
            },
            handleChange(file, fileList) {
                this.file2Xce(file).then(tabJson => {
                    var data = tabJson[0].sheet
                    for (var i = 0; i < data.length; i++) {
                        var arr = this.itemOptions.filter(item =>
                            item.orderNumber == data[i]['PO Number'].trim()
                        )
                        if (arr.length > 0) {
                            this.tableData.push({
                                orderNumber: data[i]['PO Number'],
                                productName: arr[0].productName,
                                productCode: arr[0].productCode,
                                itemId: arr[0].id,
                                orderId: arr[0].orderId,
                                containerType: data[i]['Container Type'],
                                containerNo: data[i]['Container No'],
                                containerSealNo: data[i]['Container Seal No'],
                                qty: data[i]['Quantity'],
                                weight: data[i]['Weight'],
                                cbm: data[i]['CBM'],
                                remark: data[i]['Remark'],
                            })
                        }
                    }
                })

            },
            file2Xce(file) {
                return new Promise(function (resolve, reject) {
                    const reader = new FileReader()
                    reader.onload = function (e) {
                        const data = e.target.result
                        this.wb = XLSX.read(data, {
                            type: 'binary'
                        })
                        const result = []
                        this.wb.SheetNames.forEach((sheetName) => {
                            result.push({
                                sheetName: sheetName,
                                sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
                            })
                        })
                        resolve(result)
                    }
                    reader.readAsBinaryString(file.raw)
                })
            },
            handleDelete(index, row) {
                this.tableData.splice(index, 1)
            },
            submit() {
                for (var i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].orderItemId = this.tableData[i].itemId;
                }
                var data = {
                    shipmentId: this.form.shipmentId,
                    details: JSON.stringify(this.tableData),
                };
                createClp(data).then((res) => {
                    this.$router.push("/shipment/clp");
                });
            },
            getContainerList() {
                getContainerList().then((response) => {
                    this.containerOptions = response.data;
                });
            },
            clearSelect(index) {
                this.$set(this.tableData[index], "orderNumber", null);
                this.$set(this.tableData[index], "productCode", null);
                this.$set(this.tableData[index], "productName", null);
                this.$set(this.tableData[index], "itemId", null);
                this.$set(this.tableData[index], "orderId", null);
            },
            radioChange(index, id) {
                var value = this.itemOptions.find(item => item.id === id);
                this.$set(this.tableData[index], "orderNumber", value ? value.orderNumber : null);
                this.$set(this.tableData[index], "productCode", value ? value.productCode : null);
                this.$set(this.tableData[index], "productName", value ? value.productName : null);
                this.$set(this.tableData[index], "itemId", value ? value.id : null);
                this.$set(this.tableData[index], "orderId", value ? value.orderId : null);
            },
            addClpDetail() {
                this.tableData.push({});
            },
            changeBl(value) {
                this.getBookings(this.form.shipmentId);
            },
            getBookings(shipmentId) {
                getListByShipmentId({ shipmentId: shipmentId }).then((response) =>
                    this.getItems(response)
                );
            },
            async getItems(response) {
                var bookings = [];
                for (var i = 0; i < response.data.length; i++) {
                    var itemIds = [];
                    var bookedMap = {};
                    for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
                        itemIds.push(response.data[i].bookingItemDOS[j].orderItemId);
                        bookedMap[response.data[i].bookingItemDOS[j].orderItemId] =
                            response.data[i].bookingItemDOS[j].qty;
                    }
                    var res = await getItemList({ ids: itemIds.join(",") });
                    for (var k = 0; k < res.data.length; k++) {
                        res.data[k].pb_qty = bookedMap[res.data[k].id];
                    }
                    var data = {
                        data: response.data[i],
                        items: res.data,
                    };
                    for (var l = 0; l < res.data.length; l++) {
                        res.data[l].bookingId = response.data[i].id;
                        this.itemOptions.push(res.data[l]);
                    }

                    this.activeNames.push(response.data[i].id);
                    bookings.push(data);
                }
                this.bookings = bookings;
            },
            remoteMethod(query) {
                if (query !== '' && query.length > 4) {
                    findBookingNumberList(query).then((res) => {
                        this.shipments = res.data;
                        if (this.$route.query.shipmentId) {
                            //this.form.shipmentId=this.$route.query.shipmentId
                            this.$set(this.form, 'shipmentId', Number(this.$route.query.shipmentId))
                            this.changeBl()
                        }
                    });
                }
            },
            getPortList() {
                getOriginDeliveryList().then((response) => {
                    for (var i = 0; i < response.data.length; i++) {
                        this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name);
                    }
                });
                getPolPodList().then((response) => {
                    for (var i = 0; i < response.data.length; i++) {
                        this.$set(this.polPodMap, response.data[i].code, response.data[i].name);
                    }
                });
            },
        },
    };
</script>

<style>
    .el-select-dropdown.el-popper.t-select-table {
        min-width: 680px !important;
    }

    .t-table-select__table {
        width: 100% !important;
    }
</style>