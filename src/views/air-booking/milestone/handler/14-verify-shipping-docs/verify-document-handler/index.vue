<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" append-to-body>
    <div style="padding: 10px 20px;">
      <!-- Table -->
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="documentNumber" label="Document Number" min-width="200px" align="center">
          <template #default="scope">
            <div v-if="!scope.row.editable">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">{{ scope.row.documentNumber }}</span>
              <el-button v-if="showEdit" icon="el-icon-edit" type="text" size="mini" @click="scope.row.editable=true" style="margin-left: 5px; flex-shrink: 0;"></el-button>
            </div>
            <div v-else style="display: flex; align-items: center; justify-content: center;">
              <el-input v-model="scope.row.documentNumber" size="mini" style="width: 120px; margin-right: 5px;"></el-input>
              <el-button type="primary" size="mini" @click="handleEditSubmit(scope.row)">Confirm</el-button>
              <!-- 添加取消按钮 -->
              <el-button size="mini" @click="scope.row.editable=false" style="margin-left: 5px;">Cancel</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
        <el-table-column prop="typeCode" label="Document Type" align="center">
          <template #default="scope">
            <span>{{ typeCodes.find(type => type.value === scope.row.typeCode)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
        <el-table-column label="Action" width="150px" align="center">
          <template #default="scope">
            <template v-if="scope.row.typeCode !== '15'">
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <milestone-detail ref="milestoneDetail" max-height="400px"></milestone-detail>

    <div v-if="milestone.status==1" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      <el-button type="primary" @click="confirmDialogVisible=true">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>

    <el-dialog v-loading="dialogLoading" title="Verify Confrim" :visible.sync="confirmDialogVisible" width="40%" append-to-body>
      <el-form ref="confirmForm" :model="confirmForm" label-width="120px">
        <el-form-item label="Approval Result">
          <el-radio-group v-model="confirmForm.result">
            <el-radio label="Pass">Pass</el-radio>
            <el-radio label="Reject">Reject</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input v-model="confirmForm.comment" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
        <el-button type="primary" @click="handleTaskConfirm">Submit</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
    
  <script>
import { checkPermi } from '@/utils/permission'
import { orderFileList, updateDocumentNumberById } from '@/api/pepco/order-file'
import { completeMilestone } from "@/api/air/booking";

import MilestoneDetail from '@/views/air-booking/milestone/components/so-milestone-detail.vue'

export default {
  name: 'VerifyDocumentHandler',
  components: { MilestoneDetail },
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      tableLoading: false,
      title: 'Task Document',
      milestone: {},
      tableData: [],
      typeCodes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Inspection Status', value: '07' },
        { label: 'CLP', value: '08' },
        { label: 'ICS2', value: '11' },
        { label: 'Manifest', value: '12' },
        { label: 'Shipper Booking Others', value: '13' },
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'Shipping Documents By Email', value: '15' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'No Need Upload Document', value: '18' },
        { label: 'HAWB', value: '19' },
        { label: 'MAWB', value: '20' }
      ],
      confirmDialogVisible: false,
      confirmForm: {
        result: 'Pass',
        comment: ''
      }
    }
  },
  computed: {
    showEdit() {
      return this.milestone.editable && checkPermi([`pepco:edit:${this.milestone.taskCode}`])
    }
  },
  created() {
    console.log('verify document handler created')
  },
  methods: {
    openDialog(milestone) {
      console.log('verify document', milestone)
      this.milestone = milestone
      this.title = milestone.taskName
      this.dialogVisible = true
      this.confirmForm = {
        result: 'Pass',
        comment: ''
      }

      this.getOrderFileList()
      this.$nextTick(() => {
        this.$refs.milestoneDetail.refresh(this.milestone.id)
      })
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shippingOrderId: this.milestone.shippingOrderId, taskCode: 'upload_shipping_documents' }).then(res => {
        res.data.forEach(file => {
          file.editable = false
        })
        this.tableData = res.data
        this.tableLoading = false
      })
    },
    handleEditSubmit(row) {
      updateDocumentNumberById({ id: row.id, documentNumber: row.documentNumber }).then(res => {
        if (res.code === 0) {
          this.$message.success('Edit successfully')
          this.$set(row, 'editable', false)
        } else {
          this.$message.error('Edit failed')
        }
      })
    },
    handleTaskConfirm() {
    if (this.confirmForm.result == 'Reject' && this.confirmForm.reason == '') {
        this.$message.error('Please input comment')
        return
      }
      const command = {
        milestoneId: this.milestone.id,
        taskCode: this.milestone.taskCode,
        params: this.confirmForm
      }
      this.dialogLoading = true
      completeMilestone(command).then(res => {
        this.$emit('success')
        this.$message.success('Submit successfully')
        this.dialogLoading = false
        this.confirmDialogVisible = false
        this.dialogVisible = false
      }).catch(err => {
        this.$message.error('Submit error')
        this.dialogLoading = false
        this.confirmDialogVisible = false
        this.dialogVisible = false
      })
    }
  }
}
</script>
    
<style scoped>
.upload-demo {
  width: 100%;
}
.reason-class {
  padding-left: 20px;
}
.refuse-container {
  padding-top: 10px;
}
.info-text {
  padding-left: 20px;
  color: #666;
  font-size: small;
}
.refuse-comment {
  padding-top: 10px;
}
.comment-label {
  padding-left: 20px;
  font-weight: bold;
}
.comment-text {
  padding-left: 20px;
  color: red;
}
</style>