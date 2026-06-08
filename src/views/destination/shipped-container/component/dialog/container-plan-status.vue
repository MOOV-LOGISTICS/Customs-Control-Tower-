<template>
    <el-dialog :visible.sync="dialogVisible" title="Unplan Containers" width="30%" @close="handleClose" :modal="false">
        <el-table :data="containers" border style="width: 100%;" max-height="300" v-if="containers && containers.length > 0">
            <el-table-column prop="containerNo" label="Selected Containers" min-width="100" align="center">
                <template slot-scope="{ row }">
                    <span>{{ row.containerNo }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deliveryPrePlan" label="Pre-Plan" min-width="100" align="center">
                <template slot-scope="{ row }">
                    <i v-if="row.deliveryPrePlan" class="el-icon-check" style="color: green;"></i>
                    <i v-else class="el-icon-close" style="color: red;"></i>
                </template>
            </el-table-column>
            <el-table-column prop="deliveryPlan" label="Plan" min-width="100" align="center">
                <template slot-scope="{ row }">
                    <i v-if="row.deliveryPlan" class="el-icon-check" style="color: green;"></i>
                    <i v-else class="el-icon-close" style="color: red;"></i>
                </template>
            </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <el-form ref="form" :model="destinationContainerPlanStatus" label-width="150px">
            <!-- 第一个表单项：Plan Status -->
            <el-form-item label="Plan Status" v-show="false">
                <el-radio-group v-model="destinationContainerPlanStatus.planStatus" style="display: flex; gap: 20px;">
                    <el-radio label="1">Planned</el-radio>
                    <el-radio label="2">Unplanned</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 后期要加入plan选项的话，直接将名字改回type就好 -->
            <!-- <el-form-item label="Type"> -->
            <el-form-item label="Unplan">
                <el-radio-group v-model="destinationContainerPlanStatus.type" style="display: flex; gap: 20px;">
                    <el-radio v-if="this.$auth.hasPermi('pepco:destination:delivery-pre-plan:edit')" label="1">Delivery Pre-Plan</el-radio>
                    <el-radio v-if="this.$auth.hasPermi('pepco:destination:delivery-plan:edit')" label="2">Delivery Plan</el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 第二个表单项：Unplanned Reason（根据 planStatus 条件显示） -->
            <el-form-item label="Unplanned Reason" v-if="isUnplanned">
                <el-select v-model="destinationContainerPlanStatus.unplannedCode" placeholder="Select Reason">
                    <el-option v-for="(value, key) in unplannedReasonMap" :key="key" :label="`${key} - ${value}`"
                        :value="key" />
                </el-select>
            </el-form-item>

        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    updateDestinationContainerPlanStatus
} from "@/api/destination/destination";
export default {
    name: 'DestinationContainerPlanStatusDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        containers: {
            type: Array,
            default: () => []
        },
        unplannedReasonMap: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            dialogVisible: this.visible,
            containerIds: [],
            destinationContainerPlanStatus: {
                containerIds: [],
                type: null,
                // 默认为2
                planStatus: '2',
                unplannedCode: null
            },
        };
    },
    computed: {
        isUnplanned() {
            return this.destinationContainerPlanStatus.planStatus === '2';
        }
    },
    watch: {
        visible(val) {
            this.dialogVisible = val;
        },
        dialogVisible(val) {
            if (!val) {
                this.$emit('update:visible', false);
            }
        },

    },
    methods: {
        handleInput(row) {
            // 禁止输入空格
            row.value = row.value.replace(/\s+/g, '');
        },
        handleClose() {
            this.$emit('update:visible', false);
        },
        handleSubmit() {
            if(!this.containers || this.containers.length === 0){
                this.$message.warning("Please select at least one container.");
                return;
            }
            this.containerIds = this.containers.map(container => container.id);
            if(!this.containerIds || this.containerIds.length === 0){
                this.$message.warning("Please select at least one container.");
                return;
            }
            const { containerIds, planStatus, type, unplannedCode } = this.destinationContainerPlanStatus;
            // 校验是否填写了必要的字段
            if (!planStatus) {
              this.$message.warning("Please select a Plan Status.");
              return;
            }
            if (!type) {
                this.$message.warning("Please select unplan type.");
                return;
            }
            if (planStatus === '2' && !unplannedCode) {
                this.$message.warning("Please select an Unplanned Reason.");
                return;
            }
            let planTypeName = '';
            if (type === '1') {
                planTypeName = 'Delivery Pre-Plan';
            } else if (type === '2') {
                planTypeName = 'Delivery Plan';
            }
            // 调用接口更新状态
            this.$confirm(
                `<div style="word-wrap: break-word; word-break: break-word; white-space: normal;">
                <h3 style="font-size: 18px; font-weight: bold; color: #333;">Warning: Processed With Unplan Action?</h3>
                <p style="font-size: 16px; margin: 10px 0;">
                    Are you sure you want to mark the selected containers as unplanned for <strong>this ${planTypeName}</strong>?
                </p>
                <p style="font-size: 14px; margin: 10px 0;">
                    This action will reset the milestone status if it is currently marked as Finished. 
                    Please note that this change is irreversible and will be logged; 
                    however, you may create a <strong>new ${planTypeName}</strong> at any time.
                </p>
                </div>`
            , '', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                customClass: 'wide-confirm-dialog'
            }).then(() => {
                // 构造请求参数
                const params = {
                    containerIds: this.containerIds,
                    type: parseInt(type),
                    planStatus: parseInt(planStatus),
                    unplannedCode: planStatus === '2' ? unplannedCode : null
                };
                // 调用接口更新状态
                updateDestinationContainerPlanStatus(params)
                    .then(() => {
                        this.$message.success("Plan status updated successfully");
                        this.dialogVisible = false;
                        this.$emit('submit', true);
                    })
                    .catch(error => {
                        this.$message.error("Failed to update plan status");
                        console.error("更新失败:", error);
                    });
                    this.$emit('submit', true);
                    this.dialogVisible = false;
            }).catch(() => {
            });
            // updateDestinationContainerPlanStatus(params)
            //     .then(() => {
            //         this.$message.success("Success");
            //         this.dialogVisible = false;
            //     })
            //     .catch(error => {
            //         this.$message.error("Failed to unplan container");
            //         console.error("更新失败:", error);
            //     });
        }
    }
};
</script>
<style scoped>
.wide-confirm-dialog {
  width: 500px !important;
}
.wide-confirm-dialog .el-message-box__content {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
