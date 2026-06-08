<template>
  <div>
    <!-- MBL File -->
    <div style="text-align: left;margin-top: 20px;">
      <el-button v-if="isEdit" style="padding-bottom: 10px" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="documentNumber" label="Document Number" width="130px" align="center" />
      <el-table-column prop="poNumber" label="PO Number" align="center" />
      <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
      <el-table-column prop="typeCode" label="Document Type" align="center">
        <template #default="scope">
          <span>{{ fileTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="blType" label="BL Type" align="center">
        <template slot-scope="scope">
          <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
      <el-table-column label="Action" width="220px" align="center">
        <template #default="scope">
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import { reSaveFile } from '@/api/order/task'
import { orderFileList, deleteOrderFile } from '@/api/pepco/order-file'

export default {
  name: 'PreAlertHandlerUploadFile',
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      shipmentId: null,
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        { label: 'MBL', value: '04' }
      ],
      isEdit: false,
      tableLoading: false
    }
  },

  methods: {
    initComponent(shipmentId, isEdit) {
      console.log('shipmentId', shipmentId)
      this.shipmentId = shipmentId
      this.isEdit = isEdit
      this.getOrderFileList()
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shipmentId: this.shipmentId, typeCode: '04' })
        .then(res => {
          console.log('fileData', res.data)
          this.tableData = res.data
        })
        .catch(err => {
          console.error('getOrderFileList error:', err)
          this.$message.error('Failed to load file list')
        })
        .finally(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>
