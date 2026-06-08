<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table v-loading="fileLoading" :data="fileList">
      <el-table-column label="Name" :show-overflow-tooltip="true" align="center" min-width="200px" prop="name">
        <template v-slot="scope">
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" target="_blank" :href="scope.row.url">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="File Size" align="center" prop="size" min-width="120px" :formatter="sizeFormat" />
      <el-table-column label="File Type" :show-overflow-tooltip="true" align="center" prop="type" width="180px" />
      <el-table-column label="Upload Date" align="center" prop="createTime" min-width="170px">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="fileTotal > 0" :total="fileTotal" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :page-sizes="[20, 50, 100]" @pagination="getList" />
  </div>
</template>

<script>
import { getWmsBomFilePage } from '@/api/infra/file'

export default {
  name: 'UploadLog',
  data() {
    return {
      fileLoading: false,
      fileList: [],
      fileTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        type: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    activeTab() {
      if (this.fileList.length <= 0) {
        this.getList()
      }
    },
    getList() {
      this.fileLoading = true
      // 执行查询
      getWmsBomFilePage(this.fileQueryParams).then(response => {
        this.fileList = response.data.list
        this.fileTotal = response.data.total
        this.fileLoading = false
      })
    },
    sizeFormat(row, column) {
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const srcSize = parseFloat(row.size)
      const index = Math.floor(Math.log(srcSize) / Math.log(1024))
      let size = srcSize / Math.pow(1024, index)
      size = size.toFixed(2) //保留的小数位数
      return size + ' ' + unitArr[index]
    }
  }
}
</script>