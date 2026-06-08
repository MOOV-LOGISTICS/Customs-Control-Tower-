<template>
  <div style="float: right;position: relative; margin-right: 10px;">
    <el-dialog :visible.sync="localVisible" title="Verify Documents" width="50%">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="padding-bottom: 20px;">
          <span style=" font-weight: bold">Shipper Booking Document</span>
        </div>
        <el-empty v-show="documentList.length == 0" description="No Document"></el-empty>
        <div v-for="file in orderNumbers" class="text-upload" size="mini">
          <el-card class="box-card">
            <el-descriptions :column="2" label-class-name="file-item-label">
              <el-descriptions-item :label="$t('document.poNumber')">
                <div class="custom-layout">
                  <el-checkbox v-model="file.checked" :disabled="file.disabled" class="checkbox-left"></el-checkbox>
                  <span class="po-number-left">{{ file.poNumber }}</span>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>

        <el-row :gutter="20">
          <el-col v-for="(file, index) in documentList" :key="index" :span="12">
            <div class="card-item">
              <el-descriptions :column="1" label-class-name="file-item-label" style="height: 100px;">
                <el-descriptions-item :label="$t('document.type')">{{ covTypeCode(file.typeCode) }}</el-descriptions-item>
                <el-descriptions-item :label="$t('document.documentNumber')">{{ file.documentNumber }}</el-descriptions-item>
                <el-descriptions-item :label="$t('document.name')">{{ file.fileName }}</el-descriptions-item>
              </el-descriptions>
              <div class="tools-but">
                <span>
                  <el-link :href="file.fileUrl" :title="file.fileName">
                    <i class="el-icon-download icon-large" />
                  </el-link>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="handleCancel">Refuse</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
// @Discard Ethan 2025-05-07

import { getPoRelatedOrderFile, getSameOrderTask } from '@/api/pepco/shipping-order'
import { updateTask } from '@/api/order/task'
export default {
  name: 'VerifyDocuments',
  props: {
    receivedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localVisible: false, // 控制弹窗显示的状态
      documentList: [], // 存储文件列表
      disabled: false, // 控制复选框的状态
      uploadTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' }
      ],
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      taskId: '',
      task: {},
      checked: false, // 控制复选框的状态
      taskList: [], // 存储任务列表
      orderNumbers: [] // 存储订单号列表
    }
  },

  methods: {
    async openDialog(rows) {
      console.log('Received rows:', rows)
      console.log('Received rows:', rows.orderId)
      this.getOrderFile(rows.orderId)
      this.task = rows
      this.getSameTaskList(rows.shippingId)
      this.localVisible = true
      this.$emit('update:isVisible', true)
    },
    getOrderFile(orderId) {
      const arr = ['01', '05', '06']
      getPoRelatedOrderFile({ orderHeaderId: orderId, typeCodes: arr.join(',') }).then(response => {
        this.documentList = response.data
        console.log('this.doucumentList1', this.documentList)

        // 将response.data 中间的orderNumber 提取出来组成数组，并去重
        this.orderNumbers = Array.from(new Set(response.data.map(doc => doc.orderHeaderId))).map(orderHeaderId => {
          return this.documentList.find(doc => doc.orderHeaderId === orderHeaderId)
        })

        console.log('this.orderNumbers', this.orderNumbers)
        this.orderNumbers = this.orderNumbers.map(file => {
          return {
            ...file,
            disabled: file.orderHeaderId === orderId ? false : true,
            checked: file.orderHeaderId === orderId ? true : false
          }
        })
        // 将文件按照fileId去重
        this.documentList = Array.from(new Set(response.data.map(doc => doc.fileId))).map(fileId => {
          return this.documentList.find(doc => doc.fileId === fileId)
        })
        console.log('this.doucumentList', this.documentList)
      })
    },
    handleConfirm() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          var data = {
            approveResult: 'Pass'
          }
          console.log('this.task', this.task)
          this.task.jsonData = JSON.stringify(data)
          this.taskList.forEach(item => {
            item.jsonData = JSON.stringify(data)
            console.log('item', item)
            updateTask(item).then(res => {
              console.log('res', res)
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
            })
          })

          this.localVisible = false
        })
        .catch(() => {})
      this.$emit('update-list', 'success')
    },
    covTypeCode(code) {
      const item = this.uploadTypes.find(type => type.value === code)
      return item ? item.label : ''
    },
    handleClose() {
      this.RefuseDialog = false
      this.refuseContent = ''
    },
    handleCancel() {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('Please provide a reason.', 'Tips', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          })
            .then(({ value }) => {
              var data = {
                approveResult: 'Failed',
                reason: value
              }
              console.log(this.task)
              this.task.jsonData = JSON.stringify(data)
              console.log(this.task)
              this.taskList.forEach(item => {
                item.jsonData = JSON.stringify(data)
                updateTask(item).then(res => {
                  this.$notify({
                    title: 'Success',
                    message: 'Success',
                    type: 'success'
                  })
                  this.localVisible = false
                  this.$emit('update-list', 'refuse success')
                })
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    getSameTaskList() {
      getSameOrderTask({ shippingOrderId: this.task.shippingId, taskCode: this.task.taskCode }).then(res => {
        console.log('res', res)
        this.taskList = res.data
        console.log('this.taskList', this.taskList)
      })
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
.icon-large {
  font-size: 30px; /* 方案1: 直接设置字体大小 */
  /* transform: scale(1.5);  方案2: 使用缩放 */
  cursor: pointer;
}
.tools-but {
  text-align: right;
}
.card-item {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.custom-layout {
  display: flex;
  align-items: center;
}

.checkbox-left {
  margin-right: 10px;
}

.po-number-left {
  padding-left: 5px;
  white-space: nowrap;
}

/* 覆盖 el-descriptions 默认样式 */
::v-deep(.el-descriptions-item__content) {
  display: flex;
  align-items: center;
}
</style>