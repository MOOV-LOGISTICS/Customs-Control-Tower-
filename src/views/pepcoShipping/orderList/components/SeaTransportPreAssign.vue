<template>
    <div class="sea-transport-pre-assign">
        <el-empty v-if="preAssignList.length === 0"></el-empty>

        <el-table v-if="preAssignList.length > 0" border :data="preAssignList" style="width: 100%">
            <el-table-column prop="time" label="Create Time" min-width="120px">
                <template slot-scope="scope">
                    {{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
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
            <el-table-column prop="por" label="POR" width="55px"></el-table-column>
            <el-table-column prop="fnd" label="FND" width="55px"></el-table-column>
            <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
            <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
            <el-table-column prop="vessel" label="Vessel"></el-table-column>
            <el-table-column prop="voyage" label="Voyage"></el-table-column>
            <el-table-column prop="service" label="Service"></el-table-column>

            <el-table-column prop="etd" label="Booked ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ formatBookedDateTime(scope.row) }}
                </template>
            </el-table-column>

            <el-table-column prop="eta" label="ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ formatDateTime(scope.row) }}
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
export default {
    name: 'SeaTransportPreAssign',

    props: {
        preAssignList: {
            type: Array,
            default: () => []
        }
    },

    methods: {
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


        getEventText(row) {
            if (row.type == null || row.type === '') {
                return row.status === 'transportassigned'
                    ? 'Carrier Booking'
                    : 'Pre - assign';
            }
            return row.type;
        },

        getPreAssignStatus(type, status) {
            return this.$parent.getPreAssignStatus
                ? this.$parent.getPreAssignStatus(type, status)
                : status;
        },

        formatBookedDateTime(row) {
            const etd = row.bookedEtd ? this.parseUTCTime(row.bookedEtd) : '-';
            const eta = row.bookedEta ? this.parseUTCTime(row.bookedEta) : '-';
            return `${etd} / ${eta}`;
        },

        formatDateTime(row) {
            const etd = row.etd ? this.parseUTCTime(row.etd) : '-';
            const eta = row.eta ? this.parseUTCTime(row.eta) : '-';
            return `${etd} / ${eta}`;
        }
    }
};
</script>

<style scoped lang="scss">
.sea-transport-pre-assign {
    width: 95%;
}
</style>
