<template>
    <div class="sea-air-transport-pre-assign">

        <el-empty v-if="localPreAssignList.length === 0"></el-empty>
        
        <el-table v-if="localPreAssignList.length > 0" border :data="localPreAssignList" style="width: 100%" @expand-change="handleExpandChange">

            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-empty v-if="expandedData[props.row.id] === undefined && !loading"></el-empty>
                    
                    <el-table v-if="expandedData[props.row.id] && expandedData[props.row.id].length > 0" border :data="expandedData[props.row.id]" style="width: 100%;" v-loading="loading">
                        <el-table-column prop="type" label="Type" width="80px">
                            <template slot-scope="scope">
                                {{ 'Sea Air' }}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="time" label="Create Time" width="170px">
                            <template slot-scope="scope">
                                {{ parseTimeToZ1(scope.row.createTime) }}
                            </template>
                        </el-table-column> -->
                    
                        <!-- <el-table-column prop="event" label="Event" width="100px">
                            <template slot-scope="scope">
                                {{ getEventText(scope.row) }}
                            </template>
                        </el-table-column>
                    
                        <el-table-column prop="status" label="Status" width="80px">
                            <template slot-scope="scope">
                                {{ getPreAssignStatus(scope.row.type, scope.row.status) }}
                            </template>
                        </el-table-column> -->
                    
                        <el-table-column prop="carrier" label="Carrier" width="55px"></el-table-column>
                        <!-- <el-table-column prop="por" label="POR" width="55px"></el-table-column> -->
                        <!-- <el-table-column prop="fnd" label="FND" width="55px"></el-table-column> -->
                        <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
                        <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
                        <!-- <el-table-column prop="vessel" label="Vessel"></el-table-column>
                                <el-table-column prop="voyage" label="Voyage"></el-table-column> -->
                        <el-table-column prop="flight" label="Flight" width="200px"></el-table-column>
                    
                        <el-table-column prop="etd" label="Booked ETD/ETA" width="250px">
                            <template slot-scope="scope">
                                {{ formatBookedDateTimeSea(scope.row) }}
                            </template>
                        </el-table-column>
                    
                        <el-table-column prop="eta" label="ETD/ETA" width="250px">
                            <template slot-scope="scope">
                                {{ formatDateTime(scope.row) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    
                </template>
            </el-table-column>




            <el-table-column prop="time" label="Create Time" width="200px">
                <template slot-scope="scope">
                    {{ parseTimeToZ1(scope.row.createTime) }}
                </template>
            </el-table-column>
        
            <el-table-column prop="event" label="Event" width="100px">
                <template slot-scope="scope">
                    {{ getEventTextSea(scope.row) }}
                </template>
            </el-table-column>
        
            <el-table-column prop="status" label="Status" width="80px">
                <template slot-scope="scope">
                    {{ getPreAssignStatusSea(scope.row.type, scope.row.status) }}
                </template>
            </el-table-column>
        
            <el-table-column prop="carrier" label="Carrier" width="55px"></el-table-column>
            <el-table-column prop="por" label="POR" width="55px"></el-table-column>
            <el-table-column prop="fnd" label="FND" width="55px"></el-table-column>
            <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
            <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
            <el-table-column prop="vessel" label="Vessel" width="200px"></el-table-column>
            <el-table-column prop="voyage" label="Voyage" width="200px"></el-table-column>
            <el-table-column prop="service" label="Service" width="200px"></el-table-column>
        
            <el-table-column prop="etd" label="Booked ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ formatBookedDateTime(scope.row) }}
                </template>
            </el-table-column>
        
            <el-table-column prop="eta" label="ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ formatDateTimeSea(scope.row) }}
                </template>
            </el-table-column>
        
            <el-table-column prop="shipmentRef" label="Shipment Ref" width="150px">
                <template slot-scope="scope">
                    {{ scope.row.shipmentNumber }}
                </template>
            </el-table-column>
        </el-table>



        
    </div>
</template>

<script>
import { seaAirPreAssignlistByShippingOrderId } from '@/api/seaair/seaair';
import { parseUTCTime, parseUTCTimeWithHM } from '@/utils/ruoyi';
import { getLatestPreAssign, getPreAssignByBookingId } from "@/api/booking/preAssign";

export default {
    name: 'SeaAirTransportPreAssign',

    props: {
        shippingOrderId: {
            type: [String, Number],
            required: true
        },
        preAssignList: {
            type: Array,
            default: () => []
        },
        source: {
            type: [String, Array],
        },
    },

    data() {
        return {
            allTableData: [],
            expandedData: {},
            loading: false,
            localPreAssignList: [],
            localSource: ''
        };
    },
    watch: {
        preAssignList: {
            handler(newVal) {
                this.localPreAssignList = newVal;
            },
            immediate: true
        },
        source: {
            handler(newVal) {
                this.localSource = newVal;
            },
            immediate: true
        }
    },
    mounted() {
        if(this.localSource === 'detail') {
            this.fetchData()
        }
    },
    methods: {
        /**
         * 展开/收起行的回调方法
         * @param {Object} row - 当前操作的行数据
         * @param {Array} expandedRows - 所有展开的行数据
         */
        handleExpandChange(row, expandedRows) {
            const rowId = row.id;
            if (expandedRows.includes(row)) {
                if (this.expandedData[rowId] === undefined) {
                    this.expandedData[rowId] = this.allTableData.filter(item => item.preAssignId === rowId);
                }
            } else {
                this.$delete(this.expandedData, rowId);
            }
        },
        // 获取数据
        async fetchData() {
            if (!this.shippingOrderId) return;

            if (this.localSource === 'detail') {
                this.loading = true;
                try {
                    const response = await getPreAssignByBookingId(this.shippingOrderId);
                    this.localPreAssignList = response.data || [];
                } catch (error) {
                    console.error('Failed to load air pre-assign data:', error);
                    this.$message.error('Failed to load air transport pre-assign data');
                    this.localPreAssignList = [];
                } finally {
                    this.loading = false;
                }
            }

            this.loading = true;
            try {
                const response = await seaAirPreAssignlistByShippingOrderId(this.shippingOrderId);
                this.allTableData = response.data || [];
            } catch (error) {
                console.error('Failed to load air pre-assign data:', error);
                this.$message.error('Failed to load air transport pre-assign data');
                this.allTableData = [];
            } finally {
                this.loading = false;
            }
        },

        // 刷新数据
        refresh() {
            this.fetchData();
        },
        //事件
        getEventText(row) {
            if (row.type == null || row.type === '') {
                return row.status === 1
                    ? 'Carrier Booking'
                    : 'Pre - assign';
            }
            return row.type;
        },
        getEventTextSea(row) {
            var type = row.type
            var status = row.status
            if (type == 'Carrier Booking') {
                if (status == 'history') {
                    return 'Revoked'
                } else if (status == 'transport assigned') {
                    return 'Booked'
                } else if (status == 'cancel') {
                    return 'Canceled'
                } else if (status == 'REMOVE') {
                    return 'REMOVE'
                }
            } else {
                if (status == 'history') {
                    return 'Pre-assigned'
                } else if (status == 'open') {
                    return 'Pre-assigned'
                } else if (status == 'transport assigned') {
                    return 'Booked'
                } else if (status == 'REMOVE') {
                    return 'REMOVE'
                }
            }

            // if (row.type == null || row.type === '') {
            //     return row.status === 'transportassigned'
            //         ? 'Carrier Booking'
            //         : 'Pre - assign';
            // }
            // return row.type;
        },
        // 格式化创建时间
        parseTimeToZ1(timestamp) {
            // console.log(timestamp,timestamp)
            if (!timestamp) return null
            const date = new Date(timestamp)
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const seconds = date.getSeconds().toString().padStart(2, '0')

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },




        // 获取预分配状态
        getPreAssignStatus(type, status) {
            // 状态映射：0: pre-assigned, 1: booked, 2: revoked
            const statusMap = {
                0: 'Pre-assigned',
                1: 'Booked',
                2: 'Revoked'
            };

            return statusMap[status] || status;
        },
        getPreAssignStatusSea(type, status) {
            return this.$parent.getPreAssignStatus
                ? this.$parent.getPreAssignStatus(type, status)
                : status;
        },

        // 格式化预订时间
        formatBookedDateTime(row) {
            const etd = row.bookedEtd ? parseUTCTime(row.bookedEtd) : '-';
            const eta = row.bookedEta ? parseUTCTime(row.bookedEta) : '-';
            return `${etd} / ${eta}`;
        },

                // 格式化预订时间
        formatBookedDateTimeSea(row) {
            const etd = row.bookedEtd ? parseUTCTimeWithHM(row.bookedEtd) : '-';
            const eta = row.bookedEta ? parseUTCTimeWithHM(row.bookedEta) : '-';
            return `${etd} / ${eta}`;
        },

        // 格式化时间
        formatDateTime(row) {
            const etd = row.etd ? parseUTCTimeWithHM(row.etd) : '-';
            const eta = row.eta ? parseUTCTimeWithHM(row.eta) : '-';
            return `${etd} / ${eta}`;
        },

        formatDateTimeSea(row) {
            const etd = row.etd ? this.parseUTCTime(row.etd) : '-';
            const eta = row.eta ? this.parseUTCTime(row.eta) : '-';
            return `${etd} / ${eta}`;
        },
    }
};
</script>

<style scoped lang="scss">
.sea-air-transport-pre-assign {
    width: 95%;
}
</style>