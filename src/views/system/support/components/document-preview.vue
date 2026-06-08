<template>
  <div>
<!--    <el-empty v-show="ticketFiles.length === 0" :image-size="100" description="No Attachment"></el-empty>-->
    <el-table v-show="ticketFiles.length > 0" v-loading="tableLoading" :data="ticketFiles">
      <el-table-column align="center" label="File Name" prop="name" show-overflow-tooltip/>
      <!--<el-table-column prop="creator" label="Creator" align="center"/>-->
      <el-table-column align="center" label="File Size" prop="size">
        <template v-slot="{row}">
          {{ calculateSize(row.size) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="createTime" prop="createTime">
        <template v-slot="{row}">
          {{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template v-slot="{row}">
<!--          <el-link :href="row.url" type="primary">-->
<!--            <el-button icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"-->
<!--                       type="primary"></el-button>-->
<!--          </el-link>-->
          <!--不支持预览name中没有拓展名的,拓展名不在allFileType的还有文件大于10M的-->
<!--          <el-button :disabled="!row.name.includes('.') || !allFileType.includes(row.name.split('.').pop().toLowerCase()) || row.size > 1024*1024*10 " icon="el-icon-view"-->
<!--                     style="margin-right: 6px"-->
<!--                     type="primary" @click="previewDocument(row)"></el-button>-->
          <ActionButton :url='row.url' iconType="el-icon-download" type='download' :fileName='row.name' />
          <ActionButton :url='row.url' iconType="el-icon-view" type='preview'  :fileName='row.name'  />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`Preview Document: ` + documentName"
      :visible.sync="visible"
      append-to-body
      width="90%"
      @close="handleClose"
    >
      <!--    office文档预览弹窗-->
      <vue-office-docx v-if="fileType === 'docx'"
                       :src="officeUrl.docx" style="height: 100%"
                       @error="handleError" @rendered="rendered">
      </vue-office-docx>
      <vue-office-pdf v-if="fileType === 'pdf'"
                      :src="officeUrl.pdf" style="height: 100%"
                      @error="handleError" @rendered="rendered">
      </vue-office-pdf>
      <vue-office-excel v-if="fileType === 'xlsx'"
                        :src="officeUrl.xlsx" style="height: 78vh"
                        @error="handleError" @rendered="rendered">
      </vue-office-excel>
      <!--文本文档的预览 -->
      <div v-if="fileType === 'txt'" class="txt" style="white-space: pre-wrap;">
        {{ textContent }}
      </div>
      <!--图片的预览 -->
      <div v-if=" imgFile.includes(fileType)" class="block">
        <el-image
          :src="imgUrl"
          fit="fill"
          style="width: 100%; height: 100%">
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import VueOfficePdf from "@vue-office/pdf";
//引入相关样式
import "@vue-office/docx/lib/index.css";
import '@vue-office/excel/lib/index.css'
import axios from "axios";

//该组件用于support-ticket的附件预览,包括docx,pdf,xlsx,部分图片，文本文档。其余暂不支持。
export default {
  components: {VueOfficeDocx, VueOfficeExcel, VueOfficePdf},
  props: {
    //传过来的文件列表数据
    ticketFiles: {
      type: Array,
      default: () => [],
      required: true
    },
  },
  data() {
    return {
      tableLoading: false,
      fileType: '',
      officeUrl: {
        docx: '',
        pdf: '',
        xlsx: '',
      },
      txtUrl: '',
      imgUrl: '',
      documentName: '',
      loading: false,
      visible: false,
      textContent: '',
      officeFile: ['xlsx', 'pdf', 'docx'],
      txtFile: ['txt'],
      imgFile: ['jpg', 'jpeg', 'png'],
    }
  },
  computed: {
    //支持预览的文件类型
    allFileType() {
      return [...this.officeFile, ...this.txtFile, ...this.imgFile]
    }
  },

  methods: {
    async previewDocument(file) {
      console.log('file')
      console.log(file)
      this.fileType = file.name.split('.').pop().toLowerCase();
      //显示文本文档
      if (this.txtFile.includes(this.fileType)) {
        const res = await axios.get(file.url)
        this.textContent = res.data
      } else if (this.imgFile.includes(this.fileType)) {
        this.imgUrl = file.url;
      } else if (this.officeFile.includes(this.fileType)) {
        if (this.fileType === 'pdf') {
          this.officeUrl.pdf = file.url
        } else if (this.fileType === 'xlsx') {
          this.officeUrl.xlsx = file.url
        } else if (this.fileType === 'docx') {
          this.officeUrl.docx = file.url
        }
      } else {
        this.$notify.error(`Preview of this file is not supported`);
        return;
      }
      this.documentName = file.name;
      this.visible = true;
    },

    calculateSize(size) {
      if (size >= 1024 && size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + `KB`
      } else if (size >= 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + `MB`
      }
      return size + `B`
    },
    handleClose() {
      this.officeUrl.xlsx = '';
      this.officeUrl.pdf = '';
      this.officeUrl.docx = '';
      this.imgUrl = '';
      this.txtUrl = '';
    },
    rendered() {

    },
    handleError(errorInfo) {
      //this.$notify.error(errorInfo?.message);
    }
  },
};


</script>
