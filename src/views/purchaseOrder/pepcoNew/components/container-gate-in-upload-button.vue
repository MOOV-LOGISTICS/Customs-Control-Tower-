<template>
  <el-upload
    :disabled="loading"
    action="#"
    :show-file-list="false"
    :on-change="handleUploadChange"
    :auto-upload="false">
    <el-button :loading="loading" type="primary" icon="el-icon-upload">Batch Upload Update</el-button>
    <container-gate-in-batch-reason-dialog
      :visible="visible"
      :waitGateInList="waitGateInList"
      :waitUpdateData="waitUpdateData"
      @onClose="handleClose"
      @onSuccess="onSuccess" />
  </el-upload>
</template>
<script>
import ExcelJS from "exceljs";
import moment from "moment/moment";
import {batchUpdateGateIn, getOrdersTypeBySoRefs} from "@/api/order/header";
import ContainerGateInBatchReasonDialog
  from "@/views/purchaseOrder/pepcoNew/components/container-gate-in-batch-reason-dialog.vue";

export default {
  name: "containerGateInUploadButton",
  components: {ContainerGateInBatchReasonDialog},
  emits: ['onSuccessCallback'],
  data() {
    return {
      loading: false,
      visible: false,
      waitGateInList: [],
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
      // 待不需要填写reason的数据
      const waitUpdateData = []
      // 待需要填写reason的数据
      const waitSetReasonData = []
      // 错误数据
      const errorData = []
      // 无效数据
      const invalidData = []
      // 超期数据
      const overData = []
      // so-hod
      const soAHod = new Map()

      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.raw.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)
      const worksheet = workbook.getWorksheet(1)
      // ExcelJS计数从1开始，删除标题行，再开始遍历数据
      worksheet.spliceRows(1, 1)
      worksheet.eachRow((row, rowNumber) => {
        if (row.values[4] && row.values[1]) {
          let soNumber = row.values[1]
          let timeValue = row.values[4]
          // 判断是否是公式单元格，如果是公式单元格，需要获取处理后的结果
          if (row.getCell(1).type === ExcelJS.ValueType.Formula) {
            soNumber = row.getCell(1).value.result // 获取计算结果
          }
          if (row.getCell(4).type === ExcelJS.ValueType.Formula) {
            timeValue = row.getCell(4).value.result // 获取计算结果
          }
          // 判断是否是有效的时间
          if (!moment(timeValue).isValid()) {
            invalidData.push(soNumber)
          }
          // 判断是否超过当前时间
          if (moment(moment(timeValue).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'))) {
            overData.push(soNumber)
          }
          soAHod.set(soNumber, timeValue)
        }
      })
      // 根据soRefs查找orderNumber数据及shipment类型
      const orderNumberTypes = await getOrdersTypeBySoRefs({ soRefs: Array.from(soAHod.keys()) })
      // 查找非FCL类型的orderNumber
      const nonFclOrders = orderNumberTypes.data.filter(item => item.shipmentType !== 'FCL').map(item => item.orderNumber)
      // 非FCL类型orderNumber进行提示
      if (nonFclOrders.length > 0) {
        this.$message.warning(`${nonFclOrders.join(', ')} is not FCL type PO!`)
      }
      if (soAHod.size > 0) {
        // 获取hod数据
        // 获取FCL类型的order
        const fclOrders = orderNumberTypes.data.filter(item => item.shipmentType === 'FCL')
        if (fclOrders.length > 0) {
          fclOrders.forEach(item => {
            // hod存在才能判断
            if (item.cargoHandoverDate && item.soRef) {
              // 从soAHod查找填写的aHod
              const aHod = soAHod.get(item.soRef)
              // 相差超过7天需要填写reason、remark
              const isOver = moment(moment(aHod).format('YYYY-MM-DD')).isAfter(moment(item.cargoHandoverDate).add(7, 'day').format('YYYY-MM-DD'))
              if (isOver) {
                waitSetReasonData.push({
                  id: item.id,
                  orderNumber: item.orderNumber,
                  cargoHandoverDate: item.cargoHandoverDate,
                  actualCargoHandoverDate: aHod
                })
              } else {
                waitUpdateData.push({
                  id: item.id,
                  orderNumber: item.orderNumber,
                  cargoHandoverDate: item.cargoHandoverDate,
                  actualCargoHandoverDate: aHod
                })
              }
            } else {
              // 错误数据order_number
              errorData.push(item.orderNumber)
            }
          })
        }
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
        // 如果有要设置reason的先设置reason，没有则直接更新
        if (waitSetReasonData.length > 0) {
          const waitGateInList = []
          // 填充数据
          waitSetReasonData.forEach(item => {
            waitGateInList.push({
              id: item.id,
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: item.actualCargoHandoverDate,
              cargoHandoverDate: item.cargoHandoverDate,
              reason: null,
              remark: null,
              useDefault: true
            })
          })
          this.waitGateInList = waitGateInList
          this.loading = false
          // 打开reason设置弹窗
          this.visible = true
        } else {
          if (waitUpdateData.length < 1) {
            this.loading = false
            this.$notify({ type: 'error', message: 'The content of the uploaded file is empty!' })
            return
          }
          const params = []
          waitUpdateData.forEach(item => {
            params.push({
              id: item.id,
              orderNumber: item.orderNumber,
              actualCargoHandoverDate: moment(item.actualCargoHandoverDate).valueOf(),
              reason: item.reason,
              remark: item.remark
            })
          })
          // 更新数据
          batchUpdateGateIn({
            containerGateInList: params
          }).then(res => {
            if (res.data) {
              this.$emit('onSuccessCallback')
              this.loading = false
            }
          }).catch(error => {
            // 报错提示
            this.$notify.error(error.message)
            this.loading = false
          })
        }
      } else {
        this.loading = false
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
      this.waitGateInList = []
      this.waitUpdateData = []
    },
    onSuccess() {
      this.visible = false
      this.$emit('onSuccessCallback')
    }
  }
}
</script>
