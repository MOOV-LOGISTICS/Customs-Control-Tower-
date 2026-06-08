<template>
  <div class="app-container">

    <el-empty v-if="list.length==0">

    </el-empty>
    <el-descriptions  style="padding: 15px!important;background: #fff;" v-for="item in list" :column="5">

      <template slot="extra">
        <div style="text-align: right;">
          <el-button @click="handleUpdate(item)">Update</el-button>
        </div>
      </template>

      <el-descriptions-item label="Booking Number">
      <el-link type="primary" :href="'/booking/booking-detail?id='+item.bookingId" target="_blank">{{ item.bookingNumber }}</el-link>
    </el-descriptions-item>
    <el-descriptions-item label="Shipment Name">{{ item.shipmentName }}</el-descriptions-item>
    <el-descriptions-item label="POR">{{ item.por }}</el-descriptions-item>
    <el-descriptions-item label="FND">{{ item.fnd }}</el-descriptions-item>
    <el-descriptions-item label="POL">{{ item.pol }}</el-descriptions-item>
    <el-descriptions-item label="POD">{{ item.pod }}</el-descriptions-item>
    <el-descriptions-item label="vessel">{{ item.vessel }}</el-descriptions-item>
    <el-descriptions-item label="voyage">{{ item.voyage }}</el-descriptions-item>
    <el-descriptions-item label="etd">{{ parseTime(item.etd) }}</el-descriptions-item>
    <el-descriptions-item label="eta">{{ parseTime(item.eta) }}</el-descriptions-item>
    <el-descriptions-item label="Status">{{
          item.status
        }}</el-descriptions-item>
    </el-descriptions>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form label-width="140px" ref="form" :model="form" style="padding: 30px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Place of receipt">
            <el-select filterable v-model="form.por">
              <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'por'"
                 :label="item.name+' ('+item.code+')'" 
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Final Destination">
            <el-select  filterable v-model="form.fnd">
              <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'fnd'"
                 :label="item.name+' ('+item.code+')'" 
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Port of Loading">
            <el-select  filterable v-model="form.pol">
              <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pol'"
                 :label="item.name+' ('+item.code+')'" 
                :value="item.code"
              ></el-option>
            </el-select>
      </el-form-item>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="port of Discharge">
            <el-select  filterable v-model="form.pod">
              <el-option
                v-for="(item, index) in portOptions"
                :key="index + 'pod'"
                 :label="item.name+' ('+item.code+')'" 
                :value="item.code"
              ></el-option>
            </el-select>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="Vessel">
        <el-select
                    v-model="form.vessel"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    :remote-method="remoteMethod"
                  >
                    <el-option
                      v-for="dict in vesselListLes"
                      :key="dict.value"
                      :label="dict.vesselName"
                      :value="dict.vesselName"
                    />
                  </el-select>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="Voyage">
        <el-input v-model="form.voyage"></el-input>
      </el-form-item>
    </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Carrier">
            <el-select  filterable v-model="form.carrier">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
                :key="dict.value"
                :label="dict.label+' ('+dict.value+')'"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="ETD">
        <el-date-picker type="date" value-format="timestamp" v-model="form.etd"></el-date-picker>
      </el-form-item>
        </el-col>
        <el-col :span="8">
      <el-form-item label="ETA">
        <el-date-picker type="date" value-format="timestamp" v-model="form.eta"></el-date-picker>
      </el-form-item>
    </el-col>
    </el-row>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createPreAssign, updatePreAssign, deletePreAssign, getPreAssign, getPreAssignPage, exportPreAssignExcel } from "@/api/booking/preAssign";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getVesselList } from "@/api/system/vessel";
export default {
  name: "PreAssign",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // booking_pre_assgin列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        orderId: null,
        por: null,
        fnd: null,
        pol: null,
        pod: null,
        vessel: null,
        voyage: null,
        carrier: null,
        etd: null,
        eta: null,
        createTime: [],
        status: null,
      },
      portOptions:[],
      vesselListLes:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getOriginDeliveryList()
  },
  methods: {
    remoteMethod(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselName: query }).then((response) => {
          this.vesselListLes = response.data;
        });
      } else {
        this.vesselListLes = [];
      }
    },

    getOriginDeliveryList(){
      getOriginDeliveryList().then((res)=>{
        this.portOptions =res.data
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getPreAssignPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        orderId: undefined,
        por: undefined,
        fnd: undefined,
        pol: undefined,
        pod: undefined,
        vessel: undefined,
        voyage: undefined,
        carrier: undefined,
        etd: undefined,
        eta: undefined,
        status: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加booking_pre_assign";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getPreAssign(id).then(response => {
        this.form = response.data;
        this.changePor(this.form.por)
        this.changeFnd(this.form.fnd)
        this.open = true;
        this.title = "Update";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updatePreAssign(this.form).then(response => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createPreAssign(this.form).then(response => {
          this.$modal.msgSuccess("Success");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除booking_pre_assign编号为"' + id + '"的数据项?').then(function() {
          return deletePreAssign(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Success");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有booking_pre_assign数据项?').then(() => {
          this.exportLoading = true;
          return exportPreAssignExcel(params);
        }).then(response => {
          this.$download.excel(response, 'booking_pre_assgin.xlsx');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
