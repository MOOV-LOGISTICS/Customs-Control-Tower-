<template>
  <el-upload
    :disabled="loading"
    action="#"
    :show-file-list="false"
    :on-change="handleUploadChange"
    :auto-upload="false"
    :headers="headers"
  >
    <el-button :loading="loading" type="primary" icon="el-icon-upload">Batch Upload Update</el-button>
    <cargo-inbound-batch-reason-dialog
      :visible="visible"
      :waitCargoInboundList="waitCargoInboundList"
      :waitUpdateData="waitUpdateData"
      @onClose="handleClose"
      @onSuccess="onSuccess" />
  </el-upload>
</template>
<script>
import {getBaseHeader} from "@/utils/request";
import ExcelJS from "exceljs";
import moment from "moment/moment";
import CargoInboundBatchReasonDialog
  from "@/views/purchaseOrder/pepco/components/cargo-inbound-batch-reason-dialog.vue";
import {batchUpdateCargoInbound} from "@/api/order/header";

export default {
  name: "cargoInboundUploadButton",
  components: {CargoInboundBatchReasonDialog},
  props: ['onSuccessCallback'],
  data() {
    return {
      loading: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin-api/infra/file/upload',
      headers: getBaseHeader(),
      visible: false,
      waitCargoInboundList: [],
      waitUpdateData: []
    }
  },
  methods: {
    handleUploadChange(file) {
      if (!this.isExcelFile(file)) {
        this.$notify({ type: 'error', message: 'The file type is incorrect! Please upload the correct Excel file!' })
        return
      }
      if (file.size === 0) {
        this.$notify({ type: 'error', message: 'The content of the uploaded file is empty!' })
        return
      }
      this.handleExcelFile(file)
    },
    async handleExcelFile(file) {
      this.loading = true
      const waitUpdateData = []
      const waitSetReasonData = []
      const errorData = []
      const invalidData = []
      const overData = []
      // 创建工作簿，将file转为arrayBuffer读取数据
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.raw.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)
      const worksheet = workbook.getWorksheet(1)
      // ExcelJS计数从1开始，删除标题行，再开始遍历数据
      worksheet.spliceRows(1, 1)
      worksheet.eachRow((row, rowNumber) => {
        if (row.values[4]) {
          // 判断是否是有效的时间
          if (!moment(row.values[4]).isValid()) {
            invalidData.push(row.values[2])
          }
          // 判断是否超过当前时间
          if (moment(moment(row.values[4]).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'))) {
            overData.push(row.values[2])
          }
          // hod存在才能判断
          if (row.values[3]) {
            // 相差超过7天需要填写reason、remark
            const isOver = moment(row.values[4]).valueOf() - moment(row.values[3]).valueOf() > 7 * 24 * 60 * 60 * 1000
            if (isOver) {
              waitSetReasonData.push({
                orderNumber: row.values[2],
                cargoHandoverDate: row.values[3],
                actualCargoHandoverDate: row.values[4]
              })
            } else {
              waitUpdateData.push({
                orderNumber: row.values[2],
                cargoHandoverDate: row.values[3],
                actualCargoHandoverDate: row.values[4]
              })
            }
          } else {
            // 错误数据order_number
            errorData.push(row.values[2])
          }
        }
      })
      if (errorData.length > 0) {
        this.loading = false
        this.$notify({ type: 'error', message: `The hod times of these order numbers do not exist: ${errorData.join('、')}` })
        return
      }
      if (invalidData.length > 0) {
        this.loading = false
        this.$notify({ type: 'error', message: `The Cargo Receive Date of ${invalidData.join("、")} is an invalid time!` })
        return
      }
      if (overData.length > 0) {
        this.loading = false
        this.$notify({ type: 'error', message: `The Cargo Receive Date of ${overData.join('、')} exceeds the current time. Please go back and make the necessary modifications!` })
        return
      }
      this.waitUpdateData = waitUpdateData
      if (waitSetReasonData.length > 0) {
        const waitCargoInboundList = []
        waitSetReasonData.forEach(item => {
          waitCargoInboundList.push({
            orderNumber: item.orderNumber,
            actualCargoHandoverDate: item.actualCargoHandoverDate,
            cargoHandoverDate: item.cargoHandoverDate,
            reason: null,
            remark: null,
            useDefault: true
          })
        })
        this.waitCargoInboundList = waitCargoInboundList
        this.loading = false
        this.visible = true
      } else {
        if (waitUpdateData.length < 1) {
          this.$notify({ type: 'error', message: 'The content of the uploaded file is empty!' })
          return
        }
        const params = []
        waitUpdateData.forEach(item => {
          params.push({
            orderNumber: item.orderNumber,
            actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
            reason: item.reason,
            remark: item.remark
          })
        })
        batchUpdateCargoInbound({
          cargoInboundList: params
        }).then(res => {
          if (res.data) {
            this.$emit('onSuccessCallback')
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
        })
      }
    },
    isExcelFile(file) {
      const fileName = file.name.toLowerCase()
      const validExtensions = ['.xlsx', '.xls']
      const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      // 检查扩展名
      const hasValidExtension = validExtensions.some(ext =>
        fileName.endsWith(ext)
      );
      // 检查MIME类型（有些浏览器可能返回空字符串）
      const hasValidMimeType = !file.type || validMimeTypes.includes(file.type)
      return hasValidExtension && hasValidMimeType
    },
    handleClose() {
      this.visible = false
      this.waitCargoInboundList = []
      this.waitUpdateData = []
    },
    onSuccess() {
      this.visible = false
      this.$emit('onSuccessCallback')
    }
  }
}
</script>
