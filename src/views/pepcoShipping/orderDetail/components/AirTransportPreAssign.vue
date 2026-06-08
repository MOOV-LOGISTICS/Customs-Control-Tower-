<template>
    <div class="air-transport-pre-assign">
        <el-empty v-if="tableData.length === 0 && !loading"></el-empty>

        <el-table v-if="tableData.length > 0" border :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="time" label="Create Time" min-width="100px">
                <template slot-scope="scope">
                    {{ parseTimeToZ1(scope.row.createTime) }}
                </template>
            </el-table-column>

            <el-table-column prop="event" label="Event" width="100px">
                <template slot-scope="scope">
                    {{ getEventText(scope.row) }}
                </template>
            </el-table-column>

            <el-table-column prop="status" label="Status" width="80px">
                <template slot-scope="scope">
                    {{ getPreAssignStatus(scope.row.type, scope.row.status) }}
                </template>
            </el-table-column>

            <el-table-column prop="carrier" label="Carrier" width="55px"></el-table-column>
            <!-- <el-table-column prop="por" label="POR" width="55px"></el-table-column> -->
            <!-- <el-table-column prop="fnd" label="FND" width="55px"></el-table-column> -->
            <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
            <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
            <!-- <el-table-column prop="vessel" label="Vessel"></el-table-column>
            <el-table-column prop="voyage" label="Voyage"></el-table-column> -->
            <el-table-column prop="flight" label="Flight"></el-table-column>

            <el-table-column prop="etd" label="Booked ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ formatBookedDateTime(scope.row) }}
                </template>
            </el-table-column>

            <el-table-column prop="eta" label="ETD/ETA" width="250px">
                <template slot-scope="scope">
                    {{ formatDateTime(scope.row) }}
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import { getListAirPreAssign } from '@/api/air/airPreAssign';
import { parseUTCTime, parseUTCTimeWithHM } from '@/utils/ruoyi';

export default {
    name: 'AirTransportPreAssign',

    props: {
        shippingOrderId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
            tableData: [],
            loading: false
        };
    },
    mounted() {
        this.refresh();
    },

    methods: {
        // 获取数据
        async fetchData() {
            if (!this.shippingOrderId) return;


            this.loading = true;
            try {
                const response = await getListAirPreAssign({
                    shippingOrderId: this.shippingOrderId
                });
                this.tableData = response.data || [];
            } catch (error) {
                console.error('Failed to load air pre-assign data:', error);
                this.$message.error('Failed to load air transport pre-assign data');
                this.tableData = [];
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
            //transport-assign | carrier-booking
                return row.source === 'carrier-booking'
                    ? 'Carrier Booking'
                    : 'Pre - assign';
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

        // 格式化预订时间
        formatBookedDateTime(row) {
            const etd = row.bookedEtd ? parseUTCTime(row.bookedEtd) : '-';
            const eta = row.bookedEta ? parseUTCTime(row.bookedEta) : '-';
            return `${etd} / ${eta}`;
        },

        // 格式化时间
        formatDateTime(row) {
            const etd = row.etd ? parseUTCTimeWithHM(row.etd) : '-';
            const eta = row.eta ? parseUTCTimeWithHM(row.eta) : '-';
            return `${etd} / ${eta}`;
        }
    }
};
</script>

<style scoped lang="scss">
.air-transport-pre-assign {
    width: 95%;
}
</style>