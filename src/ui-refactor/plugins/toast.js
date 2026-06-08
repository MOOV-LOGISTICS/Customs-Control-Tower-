// plugins/toast.js
import Toast from '@/ui-refactor/components/MoovToast/index.js'
const ToastPlugin = {}
ToastPlugin.install = function(Vue) {
  // 挂载到Vue原型
  Vue.prototype.$toast = Toast
}

export default ToastPlugin