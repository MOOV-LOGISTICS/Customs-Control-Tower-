<template>
  <el-dialog :title="updateContainerInfoForm.containerNo" width="500px" :visible.sync="dialogVisible" append-to-body>
    <el-form ref="updateForm" :model="updateContainerInfoForm" :rules="dynamicRules" label-width="120px">
      <el-form-item label="Container No">
        <el-input v-model="updateContainerInfoForm.containerNo" readonly />
      </el-form-item>

      <el-form-item v-if="updateColumn === 'containerPodVessel'" label="Arrival Vessel" prop="containerPodVessel">
        <el-select v-model="updateContainerInfoForm.containerPodVessel" placeholder="Select arrival vessel"
          style="width: 100%" clearable filterable>
          <el-option v-for="vessel in podVesselList" :key="vessel" :label="vessel" :value="vessel" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="updateColumn === 'containerPodVoyage'" label="Arrival Voyage" prop="containerPodVoyage">
        <el-input v-model="updateContainerInfoForm.containerPodVoyage" placeholder="Enter arrival voyage"
          maxlength="64" show-word-limit @blur="trimAndLimitInput('containerPodVoyage')" style="width: 100%" />
      </el-form-item>

      <el-form-item v-if="updateColumn === 'containerPod'" label="POD" prop="containerPod">
        <el-select v-model="updateContainerInfoForm.containerPod" placeholder="Select POD" style="width: 100%" clearable
          filterable>
          <el-option v-for="pod in podList" :key="pod" :label="pod" :value="pod" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="updateColumn === 'containerEta'" label="ETA" prop="containerEta">
        <el-date-picker v-model="updateContainerInfoForm.containerEta" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" placeholder="Select ETA" style="width: 100%" />
      </el-form-item>

      <el-form-item v-if="updateColumn === 'containerAta'" label="ATA" prop="containerAta">
        <el-date-picker v-model="updateContainerInfoForm.containerAta" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" placeholder="Select ATA" style="width: 100%" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">Cancel</el-button>
      <el-button type="primary" @click="submit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateContainerInfo } from "@/api/destination/destination";

export default {
  name: "updateContainerInfoDialog",
  data() {
    return {
      dialogVisible: false,
      updateColumn: "",
      podList: [],
      podVesselList: [],
      updateContainerInfoForm: {
        containerNo: "",
        updateColumn: "",
        destContainerIds: [],
        containerPodVessel: "",
        containerPodVoyage: "",
        containerPod: "",
        containerEta: null,
        containerAta: null,
      },
    };
  },
  computed: {
    dynamicRules() {
      const labelMap = {
        containerPodVessel: "Arrival Vessel",
        containerPodVoyage: "Arrival Voyage",
        containerPod: "POD",
        containerEta: "ETA",
        // containerAta: "ATA",
      };

      const label = labelMap[this.updateColumn];
      if (!label) return {};

      return {
        [this.updateColumn]: [
          { required: true, message: `${label} is required`, trigger: "change" },
        ],
      };
    },
  },
  methods: {
    openDialog(containerRowData, updateColumn, containerUpdateSelectList) {
      this.updateColumn = updateColumn;
      this.updateContainerInfoForm = {
        containerNo: containerRowData.containerNo,
        destContainerIds: [containerRowData.id],
        updateColumn,
        containerPodVessel: containerRowData.containerPodVessel || "",
        containerPodVoyage: containerRowData.containerPodVoyage || "",
        containerPod: containerRowData.containerPod || "",
        containerEta: containerRowData.containerEta ? this.parseUTCTime(containerRowData.containerEta) : null,
        containerAta: containerRowData.containerAta ? this.parseUTCTime(containerRowData.containerAta) : null,
      };

      this.podList = containerUpdateSelectList.podList || [];
      this.podVesselList = containerUpdateSelectList.podVesselList || [];

      this.dialogVisible = true;

      this.$nextTick(() => {
        this.$refs.updateForm && this.$refs.updateForm.clearValidate();
      });
    },

    closeDialog() {
      this.$refs.updateForm && this.$refs.updateForm.resetFields();
      this.dialogVisible = false;
    },

    getUpdateLabel() {
      const map = {
        containerPodVessel: "Arrival Vessel",
        containerPodVoyage: "Arrival Voyage",
        containerPod: "POD",
        containerEta: "ETA",
        containerAta: "ATA",
      };
      return map[this.updateColumn] || "";
    },

    getUpdateValue() {
      const value = this.updateContainerInfoForm[this.updateColumn];
      // 日期字段友好展示
      if (value instanceof Date) {
        return this.$dayjs(value).format("YYYY-MM-DD");
      }
      return value;
    },
    trimAndLimitInput(fieldName) {
      let value = this.updateContainerInfoForm[fieldName];
      if (typeof value === 'string') {
        value = value.trim().substring(0, 64);
        this.updateContainerInfoForm[fieldName] = value;
      }
    },

    submit() {
      this.$refs.updateForm.validate((valid) => {
        if (!valid) return;

        const label = this.getUpdateLabel();
        let value = this.getUpdateValue();
        if(value === null || value === undefined){
          value = 'N/A';
        }

        this.$confirm(
          `Are you sure you want to update <b>${label}</b> to <b>${value}</b>?`,
          "Confirm Update",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            return updateContainerInfo(this.updateContainerInfoForm);
          })
          .then(() => {
            this.$message.success("success!");
            this.closeDialog();
            this.$emit('after-submit');
          })
          .catch((err) => {
            // 用户点取消，不提示失败
            if (err !== "cancel") {
              this.$message.error("Failed to update!");
            }
          });
      });
    },
  },
};
</script>

<style scoped></style>
