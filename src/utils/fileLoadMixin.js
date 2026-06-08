export const fileLoadMixin = {
  data() {
    return {
      // 文件上传列表
      fileList: [],
      // 允许上传的文件类型
      acceptFileTypes: ['csv', 'doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png'],
      // 提示信息
      uploadErrorTips: 'The file format does not meet the upload requirements.'
    }
  },
  methods: {
    /**
     * 文件上传检查
     * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
     * @param file el-upload组件on-change事件钩子形参1
     * @param fileList el-upload组件on-change事件钩子形参2
     */
    handleFileChange(file, fileList) {
      this.handleFileChangeThen(file, fileList, ()=>{
        this.fileList = fileList
      }, () => {
        this.fileList = []
      })
    },
    /**
     * 文件上传检查，自定义实现成功或失败后的回调
     * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
     * @param file el-upload组件on-change事件钩子形参1
     * @param fileList el-upload组件on-change事件钩子形参2
     * @param successCallBack 检查通过的回调
     * @param failCallBack 检查失败的回调
     */
    handleFileChangeThen(file, fileList, successCallBack, failCallBack) {
      // 检查文件格式
      const type = file.name.split('.').pop().toLowerCase()
      if (this.acceptFileTypes.includes(type)) {
        if(successCallBack){
          successCallBack()
        }
      } else {
        console.error(`The file format [${type}] does not meet the upload requirements [${this.acceptFileTypes}]`)
        this.$message.error(this.uploadErrorTips);
        if(failCallBack){
          failCallBack()
        }
      }
    },
    /**
     * 文件上传检查
     * @param file 检查的文件
     * @returns {boolean} 是否允许上传
     */
    handleBeforeUpload(file){
      const type = file.name.split('.').pop().toLowerCase()
      if (this.acceptFileTypes.includes(type)) {
        return true
      } else {
        console.error(`The file format [${type}] does not meet the upload requirements [${this.acceptFileTypes}]`)
        this.$message.error(this.uploadErrorTips);
        return false
      }
    }
  }
}
