<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar v-if="showBar" style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor :style="{ height: height }" style="overflow-y: hidden;" v-model="content" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" @onChange="onChange" />
  </div>
</template>

<script>
/**
 * Ethan 2025-06-25
 * https://zhuanlan.zhihu.com/p/625002272
 * 文档：https://www.wangeditor.com/v4/
 * 'uploadImage', 'insertLink', 'insertTable', 'undo', 'redo'
 */
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'

export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '...' },
    height: { type: String, default: '400px' },
    zIndex: { type: Number, default: 100 },
    showBar: { type: Boolean, default: false }
  },
  data() {
    return {
      content: '',
      editor: null,
      toolbarConfig: {
        excludeKeys: ['lineHeight', 'fontFamily', 'fontSize', 'headerSelect', 'backCokor', 'emoticon', 'codeBlock', 'insertImage', 'uploadImage', 'uploadVideo', 'insertVideo']
      },
      editorConfig: {
        placeholder: this.placeholder,
        height: this.height,
        zIndex: this.zIndex,
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
          uploadVideo: {
            customUpload(file, insertFn) {
              // TS 语法
              console.log(file)
              file
                .arrayBuffer()
                .then(buffer => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer)

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '')

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString)
                  console.log('Base64 Content:', base64String)
                  insertFn('data:video/mp4;base64,' + base64String, '')
                })
                .catch(error => {
                  console.error('Error reading file:', error)
                })
              //
            }
          }
        }
      },
      mode: 'simple'
    }
  },
  watch: {
    content(newValue) {
      this.$emit('input', newValue)
    }
  },
  created() {
    this.content = this.value
  },
  methods: {
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange(editor) {
      console.log('editor.getHtml()', editor.getHtml())
      this.$emit('update:value', editor.getHtml())
    }
  }
}
</script>
