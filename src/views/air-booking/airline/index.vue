<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 查询表单 -->
    <el-form size="mini" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="110px">

      <el-form-item label="Country" prop="countryCode">
        <el-input v-model="queryParams.countryCode" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="Airline Name" prop="airlineName">
        <el-input v-model="queryParams.airlineName" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="IATA" prop="iata">
        <el-input v-model="queryParams.iata" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" clearable>
          <el-option label="Active" :value="1" />
          <el-option label="Inactive" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          Search
        </el-button>
      </el-form-item>

    </el-form>

    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="2">
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd">
          Add Airline
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="airlineList">

      <el-table-column label="Country" prop="countryCode" align="center" />
      <el-table-column label="Airline Name" prop="airlineName" align="center" />
      <el-table-column label="Chinese Name" prop="airlineNameCn" align="center" />
      <el-table-column label="IATA" prop="iata" align="center" />
      <el-table-column label="Bill Prefix" prop="billPrefix" align="center" />

      <el-table-column label="Status" prop="status" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 1" type="success">
            Active
          </el-tag>
          <el-tag v-else type="info">
            Inactive
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">

        <template v-slot="scope">

          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">
            View
          </el-button>

          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">
            Edit
          </el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">
            Delete
          </el-button>

        </template>

      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>

      <el-form ref="formDetail" :model="formDetail" :rules="rules" size="mini" label-width="120px">

        <el-form-item label="Country Code" prop="countryCode">
          <el-input v-model="formDetail.countryCode" :disabled="isView" />
        </el-form-item>

        <el-form-item label="Airline Name" prop="airlineName">
          <el-input v-model="formDetail.airlineName" :disabled="isView" />
        </el-form-item>

        <el-form-item label="Chinese Name">
          <el-input v-model="formDetail.airlineNameCn" :disabled="isView" />
        </el-form-item>

        <el-form-item label="IATA" prop="iata">
          <el-input v-model="formDetail.iata" :disabled="isView" />
        </el-form-item>

        <el-form-item label="Bill Prefix">
          <el-input v-model="formDetail.billPrefix" :disabled="isView" />
        </el-form-item>

        <el-form-item label="Note">
          <el-input type="textarea" v-model="formDetail.note" :disabled="isView" />
        </el-form-item>

        <el-form-item label="Status" prop="status" v-if="isEdit">
          <el-radio-group v-model="formDetail.status" :disabled="isView">
            <el-radio :label="1">Active</el-radio>
            <el-radio :label="2">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">

        <el-button v-if="!isView" size="mini" type="primary" @click="submitForm">
          Confirm
        </el-button>

        <el-button size="mini" @click="cancel">
          Close
        </el-button>

      </div>

    </el-dialog>

  </div>
</template>

<script>
import {
  airlinePage,
  airlineDetail,
  createAirline,
  updateAirline,
  removeAirline
} from "@/api/air/airline";

export default {
  name: "Airline",

  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      airlineList: [],
      open: false,
      title: "",
      isEdit: false,
      isView: false,

      queryParams: {
        pageNo: 1,
        pageSize: 10,
        countryCode: undefined,
        airlineName: undefined,
        iata: undefined,
        status: undefined
      },

      formDetail: {},

      rules: {
        airlineName: [
          { required: true, message: "Airline name is required", trigger: "blur" }
        ],
        iata: [
          { required: true, message: "IATA is required", trigger: "blur" }
        ]
      }
    };
  },

  created() {
    this.getList();
  },

  methods: {

    getList() {
      this.loading = true;
      airlinePage(this.queryParams).then(res => {
        this.airlineList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    handleAdd() {
      this.isView = false;
      this.formDetail = {
        id: undefined,
        countryCode: undefined,
        airlineName: undefined,
        airlineNameCn: undefined,
        billPrefix: undefined,
        iata: undefined,
        note: undefined,
        status: 1
      };
      this.isEdit = false;
      this.title = "Add Airline";
      this.open = true;
    },

    handleDetail(row) {
      this.isView = true;
      this.isEdit = true;
      airlineDetail(row.id).then(res => {
        this.formDetail = res.data;
        this.title = "Airline Detail";
        this.open = true;
      });
    },

    handleEdit(row) {
      this.isView = false;
      this.isEdit = true;
      airlineDetail(row.id).then(res => {
        this.formDetail = res.data;
        this.title = "Edit Airline";
        this.open = true;
      });
    },

    submitForm() {
      this.$refs["formDetail"].validate(valid => {
        if (!valid) return;

        if (this.formDetail.id) {
          updateAirline(this.formDetail).then(() => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
        } else {
          createAirline(this.formDetail).then(() => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
        }
      });
    },

    handleDelete(row) {
      this.$modal.confirm("Are you sure to delete this airline?")
        .then(() => removeAirline(row.id))
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
