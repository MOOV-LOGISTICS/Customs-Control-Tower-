<template>
  <div>
    <el-button style="margin-bottom: 20px;" type="primary" @click="commentsDialogVisible = true">Add comments
    </el-button>
    <el-empty v-if="commentList.length === 0"></el-empty>
    <el-timeline>
      <el-timeline-item v-for="(item, i) in commentList" :key="i" :timestamp="formatUserLocalTime(item.uploadTime, item.timeZone, item.timeZoneOffset)" placement="top">
        <el-card style="padding: 15px;">
          <div class="htmldiv" v-html="item.commentInfo"></div>
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
        <el-button type="primary" @click="create">Submit</el-button>
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
import { commentCreate, getComment } from "@/api/system/comment";
import { getUserProfile } from "@/api/system/user";
import { i18nChangeLanguage } from "@wangeditor/editor";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

export default {
  components: {Editor, Toolbar},
  props: {
    destinationContainerId: {
      type: Number,
      required:true,
    },
  },
  data() {
    return {
      commentsDialogVisible: false,
      commentList: [],
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
  created() {
    this.getCommentList()
  },
  methods: {
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getCommentList() {
      this.commentList = [];
      getComment({ refId: this.destinationContainerId, typeValue: 'destination_container' }).then((res) => {
        this.commentList = res.data;
        this.commentList.reverse()
      });
    },
    create() {
      if (this.html.trim() === `<p><br></p>`) {
        this.$notify({
          message: ' please fill content',
          type: 'warning'
        });
      } else {
        let data = {
          refId: this.destinationContainerId,
          typeValue: 'destination_container',
          commentInfo: this.html,
        }
        commentCreate(data).then((res) => {
          this.getCommentList()
          this.html = ''
          this.commentsDialogVisible = false
        }).catch((error) => {
          console.error("Error creating comment:", error);
        });
      }
    },
  },
  created() {
    getUserProfile().then(response => {
      this.user = response.data;
    });
    this.getCommentList()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
};
</script>


