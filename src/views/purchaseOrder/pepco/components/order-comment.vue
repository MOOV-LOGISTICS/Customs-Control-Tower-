<template>
  <div>
    <el-button style="margin-bottom: 20px;" type="primary" @click="commentsDialogVisible = true">Add comments
    </el-button>
    <el-empty v-if="orderCommentList.length === 0"></el-empty>
    <el-timeline>
      <el-timeline-item v-for="(item, i) in orderCommentList" :key="i" :timestamp="formatUserLocalTime(item.createTime, item.timeZone, item.timeZoneOffset)" placement="top">
        <el-card style="padding: 15px;">
          <div class="htmldiv" v-html="item.logInfo"></div>
          <p>{{ item.email }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog :visible.sync="commentsDialogVisible" title="Add comments" width="800px">
      <div style="border: 1px solid #ccc;">
        <Toolbar :defaultConfig="toolbarConfig" :editor="editor" :mode="mode"
                 style="border-bottom: 1px solid #ccc"/>
        <Editor v-model="html" :defaultConfig="editorConfig" :mode="mode" style="height: 260px; overflow-y: hidden;"
                @onCreated="onCreated"/>
      </div>
      <div style="text-align: right;margin-top: 10px;">
        <el-button type="primary" @click="shipLogCreate">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.htmldiv video {
  width: 400px !important;
  height: 303px !important;
}
</style>
<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {parseTime} from "@/utils/ruoyi";
import {i18nChangeLanguage} from "@wangeditor/editor";
import {getUserProfile} from "@/api/system/user";
import {getOrderComment, orderCommentCreate} from "@/api/pepco/shipping-order";

export default {
  components: {Editor, Toolbar},
  props: {
    orderId: {
      type: Number,
      required:true,
    },
    orderNumber: {
      type: String,
    }
  },
  data() {
    return {
      commentsDialogVisible: false,
      orderCommentList: [],
      toolbarConfig: {
        excludeKeys: [
          'lineHeight',
          'fontFamily',
          'fontSize',
          'headerSelect',
          'codeBlock'
        ]
      },
      editor: null,
      html: '',
      editorConfig: {
        placeholder: '...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
          uploadVideo: {
            customUpload(file, insertFn) {  // TS 语法
              file.arrayBuffer().then((buffer) => {
                // 处理 ArrayBuffer，可以根据需要转换为其他格式
                const uint8Array = new Uint8Array(buffer);

                // 将 Uint8Array 转换为字符串
                const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

                // 使用 btoa 将二进制字符串转换为 Base64
                const base64String = btoa(binaryString);
                insertFn('data:video/mp4;base64,' + base64String, '')
              }).catch((error) => {
                console.error("Error reading file:", error);
              });
              //
            }
          }
        }
      },
      mode: 'default',
    }
  },

  methods: {
    parseTime,
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getOrderCommentList() {
      this.orderCommentList = [];
      getOrderComment({ id: this.orderId }).then((res) => {
        // res.data.forEach((item) => {
        //     let email = item.email;
        //     item.timeAndEmail = that.parseTimeToZ1(item.time) + ` • ` + email;
        //     this.orderCommentList.push(item);
        //   })
        this.orderCommentList = res.data;
        this.orderCommentList.reverse()
      });
    },
    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`
    },
    shipLogCreate() {
      if (this.html.trim() === `<p><br></p>`) {
        this.$notify({
          message: ' please fill content',
          type: 'warning'
        });
      } else {
        let data = {
          logInfo: this.html,
          email: this.user.email,
          orderId: this.orderId,
          orderNumber: this.orderNumber
        }
        orderCommentCreate(data).then((res) => {
          this.getOrderCommentList()
          this.html = ''
          this.commentsDialogVisible = false
        })
      }
    },
  },
  created() {
    getUserProfile().then(response => {
      this.user = response.data;
    });
    this.getOrderCommentList()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
};
</script>


