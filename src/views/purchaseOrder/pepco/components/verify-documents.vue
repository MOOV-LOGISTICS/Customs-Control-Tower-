<template>
  <el-dialog :visible.sync="localVisible" title="Verify Documents" width="70%">
    <div>
      <el-form label-width="150px" ref="uploadFormRef">
        <el-form-item label="Related PO">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(task,index) in taskList" :label="task.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- Table -->
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="documentNumber" label="Document Number" align="center" min-width="180">
          <template #default="scope">
            <div v-if="!scope.row.editing" style="display: flex; align-items: center; justify-content: center;">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">{{
                  scope.row.documentNumber
                }}</span>
              <el-button
                v-if="isEdit"
                icon="el-icon-edit"
                type="text"
                size="small"
                @click="startEdit(scope.row)"
                style="margin-left: 5px; flex-shrink: 0;"
              ></el-button>
            </div>
            <div v-else style="display: flex; align-items: center; justify-content: center;">
              <el-input
                v-model="scope.row.documentNumber"
                size="small"
                style="width: 120px; margin-right: 5px;"
              ></el-input>
              <el-button
                type="primary"
                size="small"
                @click="confirmEdit(scope.row)"
              >Confirm
              </el-button>
              <!-- 添加取消按钮 -->
              <el-button
                size="small"
                @click="cancelEdit(scope.row)"
                style="margin-left: 5px;"
              >Cancel
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="poNumber" label="PO Number" align="center" />
        <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
        <el-table-column prop="typeCode" label="Document Type" align="center">
          <template #default="scope">
            <span>{{ fileTypes.find(type => type.value === scope.row.typeCode).label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
        <el-table-column label="Action" align="center">
          <template #default="scope">
            <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
            <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
            <!--            <el-link type="primary" :href="scope.row.fileUrl">-->
            <!--              <el-button type="primary" icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"></el-button>-->
            <!--            </el-link>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="isEdit" slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Refuse</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {orderFileList, updateDocumentNumberById} from '@/api/pepco/order-file'
import { getPoRelatedOrderFile, getSameOrderTask, getShipmentOrderItemForOrderNumber } from '@/api/pepco/shipping-order'
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
      tableLoading: false,
      tableData: [], // 存储文件列表
      disabled: false, // 控制复选框的状态
      isEdit: false, // 是否编辑状态
      fileTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' }
      ],
      RefuseDialog: false, // 控制拒绝弹窗的状态
      refuseContent: '',
      task: {},
      taskCode: '',
      checked: false, // 控制复选框的状态
      taskList: [], // 存储任务列表
      checkedList: [],
      fileQuery: { shippingOrderId: undefined, orderHeaderId: undefined, taskCode: undefined },
      shipmentId: undefined // 存储shipmentId
    }
  },

  methods: {
    async openDialog(task, taskCode) {
      this.task = task
      this.taskCode = taskCode
      this.isEdit = task.status == 1
      this.getOrderFileList()
      console.log('进入判断界面', this.task)
      console.log('进入判断界面1', this.task.jsonData)
      this.getSameTaskList(task.shippingId)
      this.localVisible = true
      // 获取orderNumber对应的shipmentId
      this.getShipmentId(task.orderNumber)
    },
    getShipmentId(number) {
      getShipmentOrderItemForOrderNumber({ orderNumber: number }).then(res => {
        console.log('res', res)
        this.shipmentId = res.data[0].shipmentId
        console.log('shipmentId', this.shipmentId)
      })
    },
    getOrderFileList() {
      this.tableLoading = true
      const fileQuery = { shippingOrderId: this.task.shippingId, orderHeaderId: this.task.orderId, taskCode: this.taskCode || this.task.taskCode }
      if (this.taskCode == 'all') {
        fileQuery.taskCode = undefined
      }
      orderFileList(fileQuery).then(res => {
        this.tableData = res.data
        this.tableLoading = false
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
            approveResult: 'Pass',
            shipmentId: this.shipmentId
          }
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
          this.$emit('confirm', this.task)
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
          this.$prompt('', 'Comments', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          })
            .then(({ value }) => {
              var data = {
                approveResult: 'Failed',
                reason: value,
                createBy: this.$store.getters.nickname,
                createId: this.$store.getters.userId,
                createTime: new Date().getTime(),
                shipmentId: this.shipmentId
              }
              this.task.jsonData = JSON.stringify(data)
              this.taskList.forEach(item => {
                item.jsonData = JSON.stringify(data)
                updateTask(item).then(res => {
                  if (res.code == 0) {
                    this.$notify({
                      title: 'Success',
                      message: 'Success',
                      type: 'success'
                    })

                    this.localVisible = false
                    // this.$emit('update-list', 'refuse success')
                    this.$emit('refresh', this.task)
                  } else {
                    this.$notify.error({
                      title: 'Error',
                      message: res.msg
                    })
                  }
                })
              })
              this.$emit('refresh', this.task)
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    getSameTaskList() {
      getSameOrderTask({ shippingOrderId: this.task.shippingId, taskCode: this.task.taskCode }).then(res => {
        console.log('res', res)
        this.taskList = res.data
        this.taskList.forEach(item => {
          this.checkedList.push(item.orderNumber)
        })
        console.log('this.taskList', this.taskList)
      })
    },
    cancelEdit(row) {
      // 可以在这里恢复原始值，如果需要的话
      // 比如: row.documentNumber = row.originalDocumentNumber;
      this.$set(row, 'editing', false);
    },
    // handleEdit(row, shippingOrderNumber) {
    //   console.log('编辑文档:', row);
    //   console.log('SO Ref:', shippingOrderNumber);
    //   // 这里可以打开编辑对话框或者执行其他编辑逻辑
    //   this.$emit('edit-document', { row, shippingOrderNumber });
    // },
    startEdit(row) {
      console.log('开始编辑:', row);
      this.$set(row, 'editing', true);
    },
    confirmEdit(row) {
      console.log('确认编辑:', row);
      // this.$set(row, 'editing', false);
      // 调用接口更新文档编号
      updateDocumentNumberById({
        id: row.id,
        documentNumber: row.documentNumber
      }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: 'Success',
            message: 'updated successfully',
            type: 'success'
          });
          // 退出编辑模式
          this.$set(row, 'editing', false);
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg || 'Failed to update document number'
          });
        }
      }).catch(error => {
        this.$notify.error({
          title: 'Error',
          message: 'Failed to update document number: ' + error.message
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-checkbox-group {
  width: 600px !important;
}
</style>
