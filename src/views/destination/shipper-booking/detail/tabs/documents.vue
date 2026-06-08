<template>
  <div style="margin-top: -25px;">
    <!-- <h3>Document 表单</h3> -->
    <el-table :data="documentList" style="width: 60%" min-height="200px" v-loading="loading">
      <el-table-column prop="documentNumber" label="Document Number" align="center" width="120"></el-table-column>
      <el-table-column prop="shippingOrderNumber" label="Shipper Booking Ref" align="center" width="120"></el-table-column>
      <el-table-column prop="typeCode" label="Document Type" align="center" width="150">
        <template #default="scope">{{ getDocumentTypeLabel(scope.row.typeCode) }}</template>
      </el-table-column>
      <el-table-column prop="blType" label="BL Type" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="Action" width="200" align="center">
        <template #default="scope">
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
        </template>
      </el-table-column>
    </el-table>
    <office-preview ref="officePreview"></office-preview>
  </div>
</template>
  
  <script>
import officePreview from './office-preview.vue'
export default {
  name: 'Document',
  components: { officePreview },
  props: {
    documentData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      documentList: [],
      uploadTypes: [
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
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' }
      ],
      loading: true // 是否正在加载数据
    }
  },
  methods: {
    setDocumentData(data) {
      console.log('赋值子组件数据6', data)
      this.documentList = data
      this.loading = false
    },
    getDocumentTypeLabel(typeCode) {
      if (typeCode === 'DG') {
        return typeCode
      }
      const type = this.uploadTypes.find(item => item.value === typeCode)
      return type ? type.label : 'Unknown Type'
    },
    handleView(row) {
      console.log('Viewing:', row)
      // 这里可以添加查看文档的逻辑
    },
    handleDownload(row) {
      console.log('Downloading:', row)
      // 这里可以添加下载文档的逻辑
    }
  }
}
</script>
  
  <style scoped>
.el-table {
  margin-top: 20px;
}
</style>