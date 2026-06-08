<template>
  <div class="container-wrapper">
    <el-card class="table-wrapper">
      <el-button class="btn" type="primary" @click="onUpload">Upload Document</el-button>
      <el-table v-loading="loading" :data="dataSource" border stripe>
        <el-table-column label="File Name" prop="fileName" width="250px"></el-table-column>
        <el-table-column label="File Type" prop="type" width="120px"></el-table-column>
        <el-table-column label="Description" prop="description"></el-table-column>
        <el-table-column label="Actions" width="100px">
          <div class="icon-wrapper" slot-scope="scope">
            <i class="el-icon-edit icon-hover" @click="onEdit(scope.row)"></i>
            <i class="el-icon-setting icon-hover" @click="onLink(scope.row)"></i>
            <i class="el-icon-delete icon-hover" @click="onDelete(scope.row)"></i>
          </div>
        </el-table-column>
      </el-table>
    </el-card>

    <link-asn-document
      :visible="visible"
      :rowInfo="rowInfo"
      @handleClose="handleClose" />
    <upload-asn
      :visible="uploadVisible"
      :rowInfo="rowInfo"
      @onSuccessCallback="onSuccessCallback"
      @handleClose="handleUploadClose" />
  </div>
</template>
<script>
import {deleteAsnDocument, getAsnDocumentPage} from "@/api/asnDocument/asnDocument";
import LinkAsnDocument from "@/views/asnDocument/components/linkAsnDocument.vue";
import UploadAsn from "@/views/asnDocument/components/uploadAsn.vue";

export default {
  name: "index",
  components: {UploadAsn, LinkAsnDocument},
  data() {
    return {
      loading: false,
      dataSource: [],
      pageQuery: {},
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      visible: false,
      uploadVisible: false,
      rowInfo: null
    }
  },
  mounted() {
    this.getAsnDocumentPage()
  },
  methods: {
    getAsnDocumentPage() {
      // 获取ASN文件
      this.loading = true;
      getAsnDocumentPage({
        ...this.pageQuery,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      }).then(res => {
        if (res.data) {
          this.dataSource = res.data.list
          this.pagination.total = res.data.total
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.visible = false
    },
    onUpload() {
      this.uploadVisible = true
    },
    handleUploadClose() {
      this.uploadVisible = false
    },
    onEdit(row) {
      this.uploadVisible = true
      this.rowInfo = row
    },
    // 成功上传回调
    onSuccessCallback() {
      this.getAsnDocumentPage()
    },
    onLink(row) {
      this.rowInfo = row
      this.visible = true
    },
    onDelete(row) {
      this.$confirm('Are you sure you want to delete?', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'OK',
        type: 'warning'
      }).then(() => {
        // 删除ASN文件
        deleteAsnDocument({ id: row.id }).then(res => {
          if (res.data) {
            this.$message.success('Success')
            this.pagination.pageNo = 1
            this.getAsnDocumentPage()
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-wrapper {
  margin: 20px;
  .table-wrapper {
    padding: 20px;
    .btn {
      margin-bottom: 16px;
    }
  }
  .icon-wrapper {
    display: flex;
    justify-content: center;
    gap: 16px;
    .icon-hover {
      cursor: pointer;
    }
  }
}
</style>
