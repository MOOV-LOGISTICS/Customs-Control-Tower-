<template>
  <el-dialog :title="title" width="80%" :visible="visible" @close="onClose">
    <el-form v-loading="loading" ref="containerGateInRef" :model="containerGateInForm" size="mini" :rules="rules">
      <el-form-item label="Related PO in same shipment" prop="orderList" label-width="210px">
        <el-checkbox-group v-model="containerGateInForm.orderList" size="small">
          <!-- 2024-04-23 edwin：默认全部勾选，并禁止操作  -->
          <el-checkbox
            disabled
            v-for="item in relatedPoList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
            border>
            {{ item.orderNumber }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Container Gate In" label-width="210px" prop="cargoHandoverDate">
        <el-date-picker
          v-model="containerGateInForm.cargoHandoverDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="Container Gate In"
          @change="onChange"
          :picker-options="pickerDisableFutureOptions">
        </el-date-picker>
      </el-form-item>

      <template v-if="showReasonTable">
        <el-form-item prop="defaultReason" label="Default Reason" label-width="210px">
          <el-select
            v-model="containerGateInForm.defaultReason"
            placeholder="Default Reason"
            @change="onDefaultReasonChange"
            clearable>
            <el-option v-for="item in reasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="defaultRemark" label="Default Remark" label-width="210px">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1 }"
            v-model="containerGateInForm.defaultRemark"
            placeholder="Default Remark"
            @blur="onDefaultRemarkBlur"
            clearable>
          </el-input>
        </el-form-item>
      </template>

      <template v-if="showReasonTable">
        <el-divider></el-divider>
        <el-table :data="containerGateInForm.reasonList" row-key="id">
          <el-table-column prop="orderNumber" label="Order Number" width="110"></el-table-column>
          <el-table-column prop="cargoHandoverDate" label="HOD" width="90">
            <template slot-scope="scope">
              {{ parseUTCTime(scope.row.cargoHandoverDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="actualCargoHandoverDate" label="Container Gate In" width="130">
            <template slot-scope="scope">
              {{ parseUTCTime(scope.row.actualCargoHandoverDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="Reason" min-width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'reasonList.' + scope.$index + '.reason'" :rules="[{ required: true, message: 'Reason is required' }]">
                <el-select
                  v-model="scope.row.reason"
                  placeholder="Reason"
                  @change="onReasonChange(scope.row)"
                  clearable>
                  <el-option v-for="item in reasonCodes" :label="item.value + ' - ' + item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="Remark" min-width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'reasonList.' + scope.$index + '.remark'">
                <el-input
                  clearable
                  v-model="scope.row.remark"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  @blur="onRemarkChange(scope.row)"
                  placeholder="Remark">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
import {DICT_TYPE} from "@/utils/dict";
import {getOrderHeadersByShippingId} from "@/api/pepco/shipping-order";
import {getContainerGateInReasonList, getOrderInfoById, updateContainerGateIn} from "@/api/order/task";

export default {
  name: "containerGateIn",
  props: ['visible', 'title', 'containerGateInInfo'],
  emits: ['onContainerGateInClose', 'onContainerGateInSuccess'],
  data() {
    return {
      loading: false,
      containerGateInForm: {
        orderList: [],
        cargoHandoverDate: null,
        reasonList: [],
        defaultReason: null,
        defaultRemark: null
      },
      // 禁用今天之后的日期
      pickerDisableFutureOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      relatedPoList: [],
      rules: {
        orderList: [{ type: 'array', required: true, message: 'Please Select PO' }],
        cargoHandoverDate: [{ required: true, message: 'Please Select Container Gate In Date' }],
      },
      showReasonTable: false,
    }
  },
  watch: {
    async visible (value) {
      if (value) {
        this.loading = true
        // 先获取同so下关联的po数据
        await this.getOrderHeaderList()
        await this.getDetailInfo()
        this.loading = false
      }
    }
  },
  computed: {
    // reason code
    reasonCodes() {
      return this.$store.getters.dict_datas[DICT_TYPE.CONTAINER_GATE_IN_REASON]
    }
  },
  methods: {
    async getOrderHeaderList() {
      // 获取po关联的po数据
      const res = await getOrderHeadersByShippingId({ shippingId: this.containerGateInInfo.shippingId })
      if (res.data) {
        // 如果存在关联的po，则展示所有的po，否则用当前po信息填充
        if (res.data.length === 0) {
          this.relatedPoList = [{
            id: this.containerGateInInfo.orderId,
            orderNumber: this.containerGateInInfo.orderNumber,
            useDefault: true
          }]
          this.containerGateInForm.orderList = [this.containerGateInInfo.orderId]
        } else {
          this.relatedPoList = res.data.map(item => ({
            ...item,
            useDefault: true
          }))
          this.containerGateInForm.orderList = res.data.map(item => item.id)
        }
      }
    },
    async getDetailInfo() {
      // 获取po的actualCargoHandoverDate
      const orderInfo = await getOrderInfoById({ id: this.containerGateInInfo.orderId })
      if (orderInfo.data) {
        this.containerGateInForm.cargoHandoverDate = this.parseUTCTime(orderInfo.data.actualCargoHandoverDate)
      }
      // 当actualCargoHandoverDate存在时，说明已经做了Container Gate In，此时需要查找相应的reason code数据
      if (orderInfo.data.actualCargoHandoverDate) {
        const aHodLogInfo = await getContainerGateInReasonList({ shippingId: this.containerGateInInfo.shippingId })
        if (aHodLogInfo.data) {
          const reasonList = []
          // 遍历比较actualCargoHandoverDate - cargoHandoverDate是否大于7天
          for (let i = 0; i < this.relatedPoList.length; i++) {
            // 大于7天，则填充reason、remark
            if (moment(orderInfo.data.actualCargoHandoverDate).isAfter(this.relatedPoList[i].cargoHandoverDate + 1000 * 60 * 60 * 24 * 7)) {
              const obj = aHodLogInfo.data.find(elem => elem.id === this.relatedPoList[i].id)
              if (obj) {
                reasonList.push({
                  ...this.relatedPoList[i],
                  reason: obj.reason,
                  remark: obj.remark
                })
              } else {
                reasonList.push(this.relatedPoList[i])
              }
            }
          }
          this.containerGateInForm.reasonList = reasonList
          this.showReasonTable = reasonList.length > 0
        }
      } else {
        // 如果未完成Container Gate In，再判断json data是否包含cargoHandoverDate信息，如果包含则填充
        if (this.containerGateInInfo.jsonData) {
          const jsonData = JSON.parse(this.containerGateInInfo.jsonData)
          if (jsonData && jsonData.cargoHandoverDate) {
            this.containerGateInForm.cargoHandoverDate = jsonData.cargoHandoverDate
            const reasonList = []
            // 遍历比较actualCargoHandoverDate - cargoHandoverDate是否大于7天
            for (let i = 0; i < this.relatedPoList.length; i++) {
              // 大于7天，则填充reason、remark
              if (moment(jsonData.cargoHandoverDate).isAfter(this.relatedPoList[i].cargoHandoverDate + 1000 * 60 * 60 * 24 * 7)) {
                reasonList.push(this.relatedPoList[i])
              }
            }
            this.containerGateInForm.reasonList = reasonList
            this.showReasonTable = reasonList.length > 0
          }
        }
      }
    },
    onClose() {
      this.$emit('onContainerGateInClose')
      this.$refs.containerGateInRef.resetFields()
      this.showReasonTable = false
    },
    onSubmit() {
      this.$refs.containerGateInRef.validate(valid => {
        if (valid) {
          this.loading = true
          updateContainerGateIn({
            orderList: this.containerGateInForm.orderList,
            cargoHandoverDate: moment(this.containerGateInForm.cargoHandoverDate).valueOf(),
            shipmentId: this.containerGateInInfo.shipmentId,
            reasonList: this.containerGateInForm.reasonList
          }).then(res => {
            if (res.data) {
              this.$message.success('Success')
              this.$emit('onContainerGateInSuccess')
              this.onClose()
              this.loading = false
            }
          }).catch(err => {
            this.$message.error('Failed to update task')
            this.loading = false
          })
        }
      })
    },
    onChange(value) {
      if (value) {
        // 需要填写reason、remark的po
        const reasonList = []
        this.relatedPoList.forEach(item => {
          // 晚于7天需要填写reason、remark
          if (moment(value).isAfter(item.cargoHandoverDate + 1000 * 60 * 60 * 24 * 7)) {
            // 如果已填写reason、remark，保留原reason、remark数据
            const obj = this.containerGateInForm.reasonList.find(elem => elem.id === item.id)
            reasonList.push({
              ...item,
              reason: obj?.reason,
              remark: obj?.remark,
              actualCargoHandoverDate: this.containerGateInForm.cargoHandoverDate
            })
          }
        })
        this.containerGateInForm.reasonList = reasonList
        this.showReasonTable = reasonList.length > 0
      }
    },
    onDefaultReasonChange(value) {
      // 遍历填充默认的reason
      for (let i = 0; i < this.containerGateInForm.reasonList.length; i++) {
        if (this.containerGateInForm.reasonList[i].useDefault) {
          this.containerGateInForm.reasonList[i].reason = value
        }
      }
    },
    onDefaultRemarkBlur(event) {
      // 遍历填充默认的remark
      for (let i = 0; i < this.containerGateInForm.reasonList.length; i++) {
        if (this.containerGateInForm.reasonList[i].useDefault) {
          this.containerGateInForm.reasonList[i].remark = event.target.value
        }
      }
    },
    onReasonChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    },
    onRemarkChange(row) {
      // 自行修改后不在默认填充
      row.useDefault = false
    }
  }
}
</script>

