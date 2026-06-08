<template>
    <div class="docs-ready-tab">
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column label="Docs Ready Action" align="center" min-width="140">
                <template v-slot="scope">
                    <span>{{ scope.row.docReadyStatus === 1 ? 'Yes' : scope.row.docReadyStatus === 2 ? 'No' : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Status" align="center" min-width="100">
                <template v-slot="scope">
                    <span :style="{ color: getStatusColor(scope.row.docReadyStatus) }">
                        {{ getStatusText(scope.row.docReadyStatus) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="Docs Ready Date" align="center" min-width="160">
                <template v-slot="scope">
                    {{ scope.row.docReadyDate }}
                </template>
            </el-table-column>

            <el-table-column label="Remark" align="center" min-width="200">
                <template v-slot="scope">
                    {{ scope.row.remark || '-' }}
                </template>
            </el-table-column>

            <el-table-column label="Update User" align="center" prop="updater" min-width="100px">
                <template slot-scope="scope">{{ getUserName(scope.row.updater) }}</template>
            </el-table-column>

            <el-table-column label="Update Time" align="center" min-width="160">
                <template v-slot="scope">
                    {{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getDocsReadyStatusDetail } from '@/api/destination/destination'

export default {
    name: 'DocsReadyTab',

    props: {
        containerRowData: {
            type: Object,
            required: true
        },
        userMap: {
            type: Map,
            required: true
        }
    },

    data() {
        return {
            loading: false,
            tableData: [],

        }
    },

    methods: {
        // 供父组件调用
        loadData() {
            this.loading = true
            getDocsReadyStatusDetail({containerId:this.containerRowData.id})
                .then(res => {
                    this.tableData = res.data || []
                })
                .catch(() => {
                    this.$message.error('Failed to load Docs Ready detail')
                })
                .finally(() => {
                    this.loading = false
                })
        },
        getUserName(userId) {
            const id = Number(userId)
            if (userId === "0") {
                return 'System'
            }
            if (this.userMap instanceof Map) {
                return this.userMap.get(id) || 'UnKnown User'
            } else {
                // 如果不是Map对象，尝试作为普通对象访问
                return this.userMap[id] || 'UnKnown User'
            }
        },
        getStatusText(status) {
            switch (status) {
                case 1:
                    return 'Complete'
                case 2:
                    return 'Incomplete'
                case 0:
                    return 'Not Done'
                default:
                    return 'Not Done'
            }
        },
        getStatusColor(status) {
            switch (status) {
                case 1:
                    return '#67C23A'
                case 2:
                    return '#E6A23C'
                case 0:
                    return '#909399'
                default:
                    return '#909399'
            }
        }
    }
}
</script>

<style scoped>
.docs-ready-tab {
    padding: 12px 0;
}
</style>