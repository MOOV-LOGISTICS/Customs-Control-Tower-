<template>
  <el-dialog 
    title="Pepco Rejected" 
    :visible.sync="visible" 
    width="70%" 
    append-to-body
  >
    <el-form  
      ref="closeShippingForm" 
      :model="formData" 
      :rules="rules"
      :show-message="false" 
      :inline="false"
    >
      <el-form-item 
        label="Reason description" 
        :label-width="'150px'" 
        required 
        prop="selectedReason"
      >
        <el-select 
          v-model="formData.selectedReason" 
          placeholder="Select Reason"
          @change="handleReasonChange"
        >
          <el-option 
            v-for="reason in sOApprovalRejectingReasons" 
            :label="reason.value + ' - ' + reason.label" 
            :value="reason.value" 
            :key="reason.value" 
          />
        </el-select>
      </el-form-item>
      
      <div style="margin: 20px 0;"></div>
      
      <el-form-item 
        label="Remark" 
        :label-width="'150px'"  
        prop="closeRemark"
      >
        <el-input 
          type="textarea" 
          :rows="5"   
          maxlength="400" 
          show-word-limit  
          placeholder="Remark..."
          v-model="formData.closeRemark"
        />
      </el-form-item>
      
      <el-button 
        size="mini" 
        type="primary" 
        style="float:right;" 
        :loading="loading"
        @click="handleSubmit"
      >
        {{ $t("purchaseOrder.confirm") }}
      </el-button>
      <el-button 
        size="mini" 
        style="float:right; margin-right: 10px;" 
        :loading="loading"
        @click="handleCancel"
      >
        {{ $t("purchaseOrder.cancel") }}
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { DICT_TYPE } from "@/utils/dict";
export default {
  name: 'PepcoRejectedDialog',
  props: {
  },
  computed: {
    sOApprovalRejectingReasons() {
      console.log('获取字典pepco_reject', DICT_TYPE.PEPCO_REJECTED_REASON_CODE);
      console.log('获取字典pepco_reject', this.$store.getters.dict_datas);
      return this.$store.getters.dict_datas[DICT_TYPE.PEPCO_REJECTED_REASON_CODE]
    }
  },
  data() {
    return {
      // 表单数据
      formData: {
        selectedReason: '',
        closeRemark: ''
      },
      // 加载状态
      loading: false,
      visible: false,
      rules: {
        selectedReason: [
          { required: true, message: 'Please select a reason', trigger: 'change' }
        ],
        closeRemark: [
          { max: 400, message: 'Remark cannot exceed 400 characters', trigger: 'blur' }
        ]
      },
      orderItem:{},
      shippingOrder:{},
    }
  },
  methods: {
    openOrderRejectDialog(row, shippingOrder) {
      this.orderItem = row;
      this.shippingOrder = shippingOrder;
      this.visible = true
    },
    // 处理 pepco 拒绝理由
    handleReasonChange(reason) {
      if (reason) {
        console.log('选择rejected_code',reason);
        const selectedReasonObj = this.sOApprovalRejectingReasons.find(x => x.value === reason);
        console.log('selectedReasonObj:',selectedReasonObj);
        if (selectedReasonObj) {
          this.formData.selectedReason = selectedReasonObj.label;
          this.formData.closeRemark = `${selectedReasonObj.value}- ${selectedReasonObj.label}`;
        }
        // this.formData.selectedReason = reason.label;
        // this.formData.closeRemark = `${reason.code}- ${reason.reason}- ${reason.description}`;
      } else {
        this.formData.closeRemark = '';
      }
    },
    // 提交
    handleSubmit() {
      this.$refs.closeShippingForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.formData.orderId = this.orderItem.orderId
          this.formData.orderNumber = this.orderItem.orderNumber
          console.log('this.formData:',this.formData);
          this.$emit('submit', this.formData)
        }
      })
    },
    // 取消
    handleCancel() {
      this.resetForm()
      this.visible = false
      this.loading = false
    },
    // 重置表单
    resetForm() {
      this.formData.selectedReason = ''
      this.formData.closeRemark = ''
      if (this.$refs.closeShippingForm) {
        this.$refs.closeShippingForm.clearValidate()
      }
    },
    closeDialog() {
      this.handleCancel()
    },
    closeLoading() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>