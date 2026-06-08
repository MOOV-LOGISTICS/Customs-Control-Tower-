<template>
  <div class="app-container" style="width:90%;margin:0 auto;">

    <!-- 查询表单 -->
    <el-form :show-message="false" size="mini" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
      label-width="120px">
      <el-form-item label="Country Code" prop="countryCode">
        <el-input v-model="queryParams.countryCode" placeholder="Enter country code" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="Airport Name" prop="airportName">
        <el-input v-model="queryParams.airportName" placeholder="Enter airport name" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="IATA" prop="iata">
        <el-input v-model="queryParams.iata" placeholder="Enter IATA" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="ICAO" prop="icao">
        <el-input v-model="queryParams.icao" placeholder="Enter ICAO" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-select v-model="queryParams.status" placeholder="Status" clearable>
          <el-option label="Active" :value="1" />
          <el-option label="Inactive" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          Search<i class="el-icon-search el-icon--right"></i>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="handleAdd">
          Add Airport
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px;"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="airportList">
      <el-table-column label="Country" prop="countryCode" align="center" />
      <el-table-column label="Airport Name" prop="airportName" align="center" />
      <el-table-column label="Chinese Name" prop="airportNameCn" align="center" />
      <el-table-column label="IATA" prop="iata" align="center" />
      <el-table-column label="ICAO" prop="icao" align="center" />
      <el-table-column label="Region" prop="region" align="center" />
      <el-table-column label="Status" prop="status" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 1" type="success">Active</el-tag>
          <el-tag v-else type="info">Inactive</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form :show-message="false" size="mini" ref="airportForm" :model="airportForm" :rules="rules" label-width="120px">
        <el-form-item label="Country Code" prop="countryCode">
          <el-input v-model="airportForm.countryCode" />
        </el-form-item>

        <el-form-item label="Region" prop="region">
          <el-input v-model="airportForm.region" />
        </el-form-item>

        <el-form-item label="Airport Name" prop="airportName">
          <el-input v-model="airportForm.airportName" />
        </el-form-item>

        <el-form-item label="Chinese Name" prop="airportNameCn">
          <el-input v-model="airportForm.airportNameCn" />
        </el-form-item>

        <el-form-item label="IATA" prop="iata">
          <el-input v-model="airportForm.iata" />
        </el-form-item>

        <el-form-item label="ICAO" prop="icao">
          <el-input v-model="airportForm.icao" />
        </el-form-item>

        <el-form-item label="Note" prop="note">
          <el-input v-model="airportForm.note" type="textarea" />
        </el-form-item>

        <el-form-item label="Status" prop="status" v-if="isEdit">
          <el-radio-group v-model="airportForm.status">
            <el-radio :label="1">Active</el-radio>
            <el-radio :label="2">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">Confirm</el-button>
        <el-button size="mini" @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { airportPage, createAirport, updateAirport, removeAirport } from "@/api/air/airport";

export default {
  name: "Airport",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      airportList: [],
      title: "",
      open: false,
      isEdit: false,

      queryParams: {
        pageNo: 1,
        pageSize: 10,
        countryCode: undefined,
        airportName: undefined,
        iata: undefined,
        icao: undefined,
        status: undefined
      },

      airportForm: {},

      rules: {
        airportName: [{ required: true, message: "Airport name is required", trigger: "blur" }],
        iata: [{ required: true, message: "IATA is required", trigger: "blur" }]
      }
    };
  },

  created() {
    this.getList();
  },

  methods: {

    getList() {
      this.loading = true;
      airportPage(this.queryParams).then(res => {
        this.airportList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    reset() {
      this.airportForm = {
        id: undefined,
        countryCode: undefined,
        region: undefined,
        airportName: undefined,
        airportNameCn: undefined,
        iata: undefined,
        icao: undefined,
        note: undefined,
        status: 1
      };
      this.resetForm("airportForm");
    },

    handleAdd() {
      this.reset();
      this.open = true;
      this.isEdit = false;
      this.title = "Add Airport";
    },

    handleUpdate(row) {
      this.airportForm = Object.assign({}, row);
      this.open = true;
      this.isEdit = true;
      this.title = "Edit Airport";
    },

    submitForm() {
      this.$refs["airportForm"].validate(valid => {
        if (!valid) return;

        if (this.airportForm.id) {
          updateAirport(this.airportForm).then(() => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
        } else {
          createAirport(this.airportForm).then(() => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
        }
      });
    },

    handleDelete(row) {
      this.$modal.confirm("Are you sure to delete this airport?")
        .then(() => removeAirport(row.id))
        .then(() => {
          this.$modal.msgSuccess("Success");
          this.getList();
        });
    },

    cancel() {
      this.open = false;
      this.reset();
    }
  }
};
</script>
