<template>
  <el-dialog
    title="Update Air Booking Number"
    :visible.sync="innerVisible"
    width="560px"
    @close="handleCancel"
  >
    <el-form :model="formData" :show-message="false" ref="formRef" label-width="150px">
      <el-form-item label="Booking Number" prop="airBookingNumber" required>
        <el-input v-model="formData.airBookingNumber" placeholder="Booking Number" style="width: 100%;" />
      </el-form-item>

        <el-form-item label="Confirmation"  prop="airConfirmationDate" required>
          <el-date-picker v-model="formData.airConfirmationDate" type="date" value-format="yyyy-MM-dd"  format="yyyy-MM-dd" 
            ></el-date-picker>
        </el-form-item>


      <!-- <el-form-item label="Confirmation" prop="confirmationDate">
        <el-date-picker
          v-model="formData.confirmationDate"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="Date"
          style="width: 100%;"
        />
      </el-form-item> -->
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { updateShipmentSeaAirBookingNumber } from '@/api/seaair/seaair';

export default {
  name: 'UpdateSeaAirBookingNumberDialog',

  props: {
    visible: Boolean,
    data: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      innerVisible: false,
      formData: {
        bookingNumber: '',
        shipmentId: 0,
        confirmationDate: null
      },
    }
  },

  watch: {
    visible(v) {
      this.innerVisible = v
      if (v && this.data) {
        this.formData = {
          airBookingNumber: this.data.airBookingNumber || '',
          shipmentId: this.data.shipmentId || 0,
          airConfirmationDate: this.data.airConfirmationDate ? this.parseUTCTime(this.data.airConfirmationDate) : null
        }
        console.log('this.formData', this.formData)
      }
    }
  },

  methods: {
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        const params = {
          airBookingNumber: this.formData.airBookingNumber,
          shipmentId: this.formData.shipmentId,
          airConfirmationDate: this.formData.airConfirmationDate
        }
        
        updateShipmentSeaAirBookingNumber(params).then(response => {
          this.$message.success('Success')
          this.handleCancel()
          this.$emit('submit', response)
        }).catch(error => {
          this.$message.error('Update failed')
        })
      })
    },

    handleCancel() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
</style>
