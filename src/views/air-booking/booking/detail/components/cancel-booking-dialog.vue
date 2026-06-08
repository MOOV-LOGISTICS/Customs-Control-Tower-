<template>
  <el-dialog
    title="Cancel Booking"
    :visible.sync="centerDialogVisible"
    width="50%"
    @close="closeCenterDialog"
  >
    <div class="cancelBookingForm">
      <el-row>
        <el-col :span="24" style="margin-top: -35px; padding-bottom: 10px">
          <h4>Cancel Option</h4>
        </el-col>
      </el-row>

      <!-- Category -->
      <el-row>
        <el-col :span="24">
          <h5>
            <b style="font-size: 15px">{{ cancelTitle }} Category</b>
          </h5>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-select
            clearable
            v-model="form.cancelCode"
            size="mini"
            @change="getCancelReason"
            @clear="clearSelCancelCategory"
          >
            <el-option
              v-for="item in selCancelCategory"
              :key="item.enumId"
              :label="item.description"
              :value="item.enumId"
            />
          </el-select>
        </el-col>
      </el-row>

      <!-- Reason -->
      <el-row>
        <el-col :span="24">
          <h5>
            <b style="font-size: 15px">{{ cancelTitle }} Reason</b>
          </h5>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-select
            clearable
            v-model="form.cancelSubCode"
            size="mini"
            @change="changeSelCancelReason"
            no-data-text="Please select Cancel Category first"
          >
            <el-option
              v-for="item in selectCancelReason"
              :key="item.enumId"
              :label="item.description"
              :value="item.enumId"
            />
          </el-select>
        </el-col>
      </el-row>

      <!-- Remark -->
      <el-row>
        <el-col :span="24">
          <h5>
            <b style="font-size: 15px">{{ cancelTitle }} Remark</b>
          </h5>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-input
            type="textarea"
            v-model="form.cancelRemark"
            size="mini"
            :rows="3"
            maxlength="1000"
            show-word-limit
            resize="none"
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          style="margin-top: 20px; margin-bottom: 15px"
          @click="cancelShipment"
        >
          Submit
        </el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { cancel } from "@/api/air/booking";
import { findDropDownListFromCt } from "@/api/shipment/shipment";

export default {
  name: "CancelBookingDialog",

  props: {
    shipment: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      centerDialogVisible: false,

      // 本地表单
      form: {
        cancelCode: null,
        cancelSubCode: null,
        cancelRemark: "",
      },

      selCancelReason: [],
      selCancelCategory: [],
      selectCancelReason: [],
      cancelReasonFlag: false,
      cancelTitle: "",
    };
  },

  methods: {
    // 打开弹窗
    openDialog() {
      this.centerDialogVisible = true;

      // 同步 prop -> 本地 form
      this.form.cancelCode = this.shipment.cancelCode || null;
      this.form.cancelSubCode = this.shipment.cancelSubCode || null;
      this.form.cancelRemark = this.shipment.cancelRemark || "";

      this.getDropDownValues();
    },

    // 关闭弹窗
    closeCenterDialog() {
      this.centerDialogVisible = false;

      // 清空 form
      this.form = {
        cancelCode: null,
        cancelSubCode: null,
        cancelRemark: "",
      };

      this.selectCancelReason = [];
      this.cancelReasonFlag = false;
    },

    // 获取下拉数据
    getDropDownValues() {
      findDropDownListFromCt().then((res) => {
        if (res && res.data) {
          this.selCancelReason = res.data.cancelReasonList || [];
          this.selCancelCategory = res.data.cancelCategoryList || [];
        }
      });
    },

    // 选择 Category
    getCancelReason(code) {
      if (!code) {
        this.selectCancelReason = [];
        this.form.cancelSubCode = null;
        return;
      }

      this.selectCancelReason = this.selCancelReason.filter(
        (item) => item.parentEnumId === code,
      );

      this.form.cancelSubCode = null;
    },

    // 选择 Reason
    changeSelCancelReason(val) {
      const selected = this.selectCancelReason.find(
        (item) => item.enumId === val,
      );

      this.cancelReasonFlag = selected && selected.optionIndicator === "t";
    },

    // 清空 Category
    clearSelCancelCategory() {
      this.form.cancelCode = null;
      this.form.cancelSubCode = null;
      this.selectCancelReason = [];
    },

    // 提交
    cancelShipment() {
      if (this.cancelReasonFlag && !this.form.cancelRemark) {
        this.$notify({
          type: "warning",
          message: "Please fill in Cancel Remark for cancellation!",
        });
        return;
      }

      if (!this.form.cancelCode || !this.form.cancelSubCode) {
        this.$notify({
          type: "warning",
          message: "Cancel category and Cancel Reason are mandatory.",
        });
        return;
      }

      const reqDto = {
        cancelledCode: this.form.cancelCode,
        cancelledSubCode: this.form.cancelSubCode,
        canceledReason: this.form.cancelRemark,
        id: this.$route.query.bookingId,
        status: this.cancelType,
        uuid: this.$route.query.bookingNumber,
      };

      cancel(reqDto).then(() => {
        this.centerDialogVisible = false;

        this.$notify({
          title: "success",
          message: "submit success",
          type: "success",
        });

        this.$emit("refreshPage");
      });
    },
  },
};
</script>
