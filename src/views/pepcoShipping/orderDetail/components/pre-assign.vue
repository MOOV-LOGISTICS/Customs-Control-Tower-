<!--预排船信息-->
<template>
    <div v-loading="loading">
        <el-table v-if="preAssignData.length > 0" border :data="preAssignData" style="width: 100%">
            <el-table-column prop="time" label="Create Time" min-width="120px">
                <template slot-scope="scope">
                    {{ parseTimeToZ1(scope.row.createTime) }}
                </template>
            </el-table-column>

            <el-table-column prop="event" label="Event" width="100px">
                <template slot-scope="scope">
                    {{ (scope.row.type == null || scope.row.type == '') ? (scope.row.status == 'transportassigned' ? 'Carrier Booking' : 'Pre - assign') : scope.row.type }}
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
                    {{ (scope.row.bookedEtd ? parseTime(scope.row.bookedEtd) : '-') + ' / '+ (scope.row.bookedEta ? parseTime(scope.row.bookedEta):' - ') }}
                </template>
            </el-table-column>

            <el-table-column prop="eta" label="ETD/ETA" width="150px">
                <template slot-scope="scope">
                    {{ (scope.row.etd ? parseTime(scope.row.etd) : '-') + ' / '+ (scope.row.eta ? parseTime(scope.row.eta):' - ') }}
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
import { getLatestPreAssign, getPreAssignByBookingId } from "@/api/booking/preAssign";

/**
 * soPreAssignTable
 * @author edwin
 */
export default {
    name: 'soPreAssignTable',
    props: {},
    data() {
        return {
            // 预排船数据
            preAssignData: [],
            loading: false,
        }
    },
    created() {
        console.log('soPreAssignTable created')
    },
    methods: {
        active(shippingOrderId) {
            this.loading = true
            getPreAssignByBookingId(shippingOrderId).then(result => {
                this.refresh(result.data)
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
            })
        },
        refresh(preAssignData) {
            console.log(preAssignData)
            this.preAssignData = preAssignData ? preAssignData : []
            this.$emit('complete', this.preAssignData)
        },
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
        getPreAssignStatus(type, status) {
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
        },
    }
}
</script>

<style scoped>
.data-header {
    margin-right: 10px;
    color: #004F7C;
    font-weight: bold;
}

.data-info {
    margin-right: 20px;
    font-weight: blod;
}
</style>
