<template>
    <div class="app-container" style="width:90%;margin:0 auto;">

        <!-- 查询表单 -->
        <el-form size="mini" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
            label-width="110px">

            <el-form-item label="App ID" prop="appId">
                <el-select v-model="queryParams.appId" clearable>
                    <el-option label="Air" value="air" />
                    <el-option label="Rail" value="rail" />
                    <el-option label="Sea" value="sea" />
                </el-select>
            </el-form-item>

            <el-form-item label="Level" prop="levelEnum">
                <el-select v-model="queryParams.levelEnum" clearable>
                    <el-option label="Order" value=ORDER />
                    <el-option label="Shipping" value="SHIPPING" />
                    <el-option label="Booking" value="BOOKING" />
                </el-select>
            </el-form-item>

            <el-form-item label="Task Name" prop="taskCode">
                <el-select v-model="queryParams.taskCode" clearable style="width:160px">
                    <el-option v-for="item in allSettings" :key="item.taskCode"
                        :label="item.taskName ? `${item.taskName}` : item.taskCode"
                        :value="item.taskCode" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleQuery">Search</el-button>
            </el-form-item>

        </el-form>

        <!-- 工具栏 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="3">
                <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd">
                    Add Milestone Setting
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
        </el-row>

        <!-- 表格 -->
        <el-table v-loading="loading" :data="settingList">
            <el-table-column label="Party Role" prop="partyRole" align="center" />
            <el-table-column label="View Party Role" prop="viewPartyRole" align="center" />
            <el-table-column label="Task Code" prop="taskCode" align="center" />
            <el-table-column label="Task Name" prop="taskName" align="center" />
            <el-table-column label="Level" prop="level" align="center">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.level === 1">Order</el-tag>
                    <el-tag v-else-if="scope.row.level === 2" type="success">Shipping</el-tag>
                    <el-tag v-else-if="scope.row.level === 3" type="warning">Booking</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Task Seq" prop="taskSeq" align="center" />
            <el-table-column label="Auto" prop="auto" align="center">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.auto" type="success">Auto</el-tag>
                    <el-tag v-else type="info">Manual</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Working Day" prop="workingDay" align="center">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.workingDay" type="success">Yes</el-tag>
                    <el-tag v-else type="info">No</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
                <template v-slot="scope">
                    <el-button size="mini" type="text" icon="el-icon-view"
                        @click="handleDetail(scope.row)">View</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleEdit(scope.row)">Edit</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete"
                        @click="handleDelete(scope.row)">Delete</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 弹窗 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>

            <el-form ref="formDetail" :model="formDetail" :rules="rules" size="mini" label-width="140px">

                <el-form-item label="Party Role" prop="partyRole">
                    <el-input v-model="formDetail.partyRole" :disabled="isView" />
                </el-form-item>

                <el-form-item label="View Party Role">
                    <el-input v-model="formDetail.viewPartyRole" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Task Code" prop="taskCode">
                    <el-input v-model="formDetail.taskCode" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Task Name" prop="taskName">
                    <el-input v-model="formDetail.taskName" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Level" prop="level">
                    <el-select v-model="formDetail.level" :disabled="isView" style="width:100%">
                        <el-option label="Order" :value="1" />
                        <el-option label="Shipping" :value="2" />
                        <el-option label="Booking" :value="3" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Task Seq">
                    <el-input-number v-model="formDetail.taskSeq" :disabled="isView" :min="0" style="width:100%" />
                </el-form-item>

                <el-form-item label="Next Node">
                    <el-select v-model="formDetail.nextNode" :disabled="isView" multiple style="width:100%">
                        <el-option v-for="item in allSettings" :key="item.taskCode"
                            :label="item.taskName ? `${item.taskName}` : item.taskCode"
                            :value="item.taskCode" />
                    </el-select>
                </el-form-item>

                <!-- Urgent -->
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="Urgent Key" label-width="100px">
                            <el-input v-model="formDetail.urgentKey" :disabled="isView" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Unit" label-width="50px">
                            <el-select v-model="formDetail.urgentUnit" :disabled="isView" style="width:100%">
                                <el-option label="Hour" value="HOUR" />
                                <el-option label="Day" value="DAY" />
                                <el-option label="Week" value="WEEK" />
                                <el-option label="Month" value="MONTH" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Count" label-width="55px">
                            <el-input-number v-model="formDetail.urgentCount" :disabled="isView" :min="0"
                                style="width:100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- Overdue -->
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="Overdue Key" label-width="100px">
                            <el-input v-model="formDetail.overdueKey" :disabled="isView" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Unit" label-width="50px">
                            <el-select v-model="formDetail.overdueUnit" :disabled="isView" style="width:100%">
                                <el-option label="Hour" value="HOUR" />
                                <el-option label="Day" value="DAY" />
                                <el-option label="Week" value="WEEK" />
                                <el-option label="Month" value="MONTH" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Count" label-width="55px">
                            <el-input-number v-model="formDetail.overdueCount" :disabled="isView" :min="0"
                                style="width:100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="Working Day">
                    <el-switch v-model="formDetail.workingDay" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Auto">
                    <el-switch v-model="formDetail.auto" :disabled="isView" />
                </el-form-item>

                <el-form-item label="To Email">
                    <el-input v-model="formDetail.toEmail" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Form Template">
                    <el-input v-model="formDetail.formTemplate" :disabled="isView" />
                </el-form-item>

                <el-form-item label="Note">
                    <el-input type="textarea" v-model="formDetail.note" :disabled="isView" />
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button v-if="!isView" size="mini" type="primary" @click="submitForm">Confirm</el-button>
                <el-button size="mini" @click="cancel">Close</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
import {
    airMilestoneSettingPage,
    airMilestoneSettingDetail,
    airMilestoneSettingAll,
    createAirMilestoneSetting,
    updateAirMilestoneSetting,
    removeAirMilestoneSetting
} from "@/api/air/bdMilestoneSetting";

export default {
    name: "MilestoneSetting",

    data() {
        return {
            loading: true,
            showSearch: true,
            total: 0,
            settingList: [],
            open: false,
            title: "",
            isEdit: false,
            isView: false,

            queryParams: {
                pageNo: 1,
                pageSize: 10,
                appId: undefined,
                levelEnum: undefined,
                taskCode: undefined
            },

            formDetail: {},

            rules: {
                partyRole: [{ required: true, message: "Party role is required", trigger: "blur" }],
                taskCode: [{ required: true, message: "Task code is required", trigger: "blur" }],
                taskName: [{ required: true, message: "Task name is required", trigger: "blur" }],
                level: [{ required: true, message: "Level is required", trigger: "change" }]
            }
        };
    },

    created() {
        this.getList();
        this.loadAllTaskCodes();
    },

    methods: {

        getList() {
            this.loading = true;
            airMilestoneSettingPage(this.queryParams).then(res => {
                this.settingList = res.data.list;
                this.total = res.data.total;
                this.loading = false;
            });
        },

        loadAllTaskCodes() {
            airMilestoneSettingAll({}).then(res => {
                this.allSettings = res.data || [];
            });
        },

        handleQuery() {
            this.queryParams.pageNo = 1;
            this.getList();
        },

        handleAdd() {
            this.isView = false;
            this.isEdit = false;
            this.formDetail = {
                id: undefined,
                partyRole: undefined,
                viewPartyRole: undefined,
                taskCode: undefined,
                taskName: undefined,
                level: undefined,
                taskSeq: undefined,
                nextNode: [],
                urgentKey: undefined,
                urgentUnit: undefined,
                urgentCount: undefined,
                overdueKey: undefined,
                overdueUnit: undefined,
                overdueCount: undefined,
                workingDay: false,
                auto: false,
                toEmail: undefined,
                formTemplate: undefined,
                note: undefined
            };
            this.title = "Add Milestone Setting";
            this.open = true;
        },

        handleDetail(row) {
            this.isView = true;
            this.isEdit = true;
            airMilestoneSettingDetail(row.id).then(res => {
                this.formDetail = res.data;
                this.title = "Milestone Setting Detail";
                this.open = true;
            });
        },

        handleEdit(row) {
            this.isView = false;
            this.isEdit = true;
            airMilestoneSettingDetail(row.id).then(res => {
                this.formDetail = res.data;
                this.title = "Edit Milestone Setting";
                this.open = true;
            });
        },

        submitForm() {
            this.$refs["formDetail"].validate(valid => {
                if (!valid) return;
                if (this.formDetail.id) {
                    updateAirMilestoneSetting(this.formDetail).then(() => {
                        this.$modal.msgSuccess("Success");
                        this.open = false;
                        this.getList();
                        this.loadAllTaskCodes(); // 刷新 options
                    });
                } else {
                    createAirMilestoneSetting(this.formDetail).then(() => {
                        this.$modal.msgSuccess("Success");
                        this.open = false;
                        this.getList();
                        this.loadAllTaskCodes(); // 刷新 options
                    });
                }
            });
        },

        handleDelete(row) {
            this.$modal.confirm("Are you sure to delete this milestone setting?")
                .then(() => removeAirMilestoneSetting(row.id))
                .then(() => {
                    this.$modal.msgSuccess("Success");
                    this.getList();
                });
        },

        cancel() {
            this.open = false;
        }

    }
};
</script>