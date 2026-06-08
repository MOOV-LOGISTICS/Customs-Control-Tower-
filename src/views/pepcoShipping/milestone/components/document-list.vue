<template>
  <!-- Document List Table -->
  <el-table :data="tableData" v-loading="tableLoading" border>
    <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
    <el-table-column prop="documentNumber" label="Document Number" width="150px" align="center" />
    <el-table-column prop="typeCode" label="Document Type" align="center">
      <template #default="scope">
        <span>{{ typeCodes.find(type => type.value === scope.row.typeCode)?.label }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
    <el-table-column label="BL Type" align="center">
      <template #default="scope">
        <span>{{ scope.row.blType ? scope.row.blType : '/' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Action" min-width="220px" align="center">
      <template #default="scope">
        <ActionButton v-if="scope.row.typeCode !== '15'" :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
        <ActionButton v-if="scope.row.typeCode !== '15'" :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
        <el-button v-if="scope.row.typeCode === '03'" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
        <el-button v-if="showEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { orderFileList, deleteOrderFile } from '@/api/pepco/order-file'

export default {
  name: 'DocumentList',
  props: {
    shipmentId: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
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
        { label: 'No Need Upload Document', value: '18' }
      ]
    }
  },
  methods: {
    fetchDocumentList() {
      this.tableLoading = true
      orderFileList({ shipmentId: this.shipmentId })
        .then(res => {
          this.tableData = res.data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    handleDelete(row) {
      this.$confirm(`Delete ${row.fileName}?`, 'Confirm', { type: 'warning' }).then(() => {
        deleteOrderFile(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({ message: 'Delete Success', type: 'success' })
            this.fetchDocumentList()
          } else {
            this.$notify({ message: res.msg, type: 'error' })
          }
        })
      })
    },
    handleEdit(row) {
      this.$emit('edit-document', row)
    }
  },
  mounted() {
    this.fetchDocumentList()
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>