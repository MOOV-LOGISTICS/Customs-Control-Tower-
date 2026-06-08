/*/!*⚠️ ⚠️ ⚠️ ⚠️ ⚠️ -- 第三方集成区域 -- ⚠️ ⚠️ ⚠️ ⚠️ *!/
// ⚠️ 注意替换为自己的AppKey （以下是测试appkey）⚠️
const APPKEY = "sfci50a7sy3vi";

// ⚠️ 注意替换为当前用户的真实Token（以下是测试token）⚠️
const TOKEN = "QM+/dDldZLUSUijhljmBc37MsxNr6lAO@gnck.cn.rongnav.com;gnck.cn.rongcfg.com";
window.APPKEY = APPKEY;
window.TOKEN = TOKEN;*/

import Vue from 'vue'

// ── Mock mode: intercept all API calls with mock data ──────────────────────
if (process.env.VUE_APP_MOCK === 'true') {
  const { setupMock } = require('@/mock/index')
  const axiosInstance = require('@/utils/request').default
  setupMock(axiosInstance)
  console.log('[MOCK MODE] API calls are intercepted with mock data.')
}
// ────────────────────────────────────────────────────────────────────────────

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
//import 'default-passive-events'
//不添加，控制台会报这个，Added non-passive event listener to a scroll-blocking
import JsonViewer from 'vue-json-viewer';
Vue.use(JsonViewer);
// @ui-refactor
import '@/ui-refactor/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
// @ui-refactor
import router from '@/ui-refactor/router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import './assets/icons' // icon
// @ui-refactor
import '@/ui-refactor/permission' // permission control
import './tongji' // 百度统计
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/infra/config";
import { parseTime, parseUTCTime, parseUTCWithTime, parseUTCTime2, parseUTCTimeWithHM, resetForm, handleTree, addBeginAndEndTime, divide } from "@/utils/ruoyi";
import { isValidContainerNumber } from "@/utils";
import { getCurrentTimeZone } from '@/utils/index'
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"

import ActionButton from "@/components/ActionButton";

// 图标组件
import '@icon-park/vue/styles/index.css';
import { IconPark } from '@icon-park/vue/es/all';
import trim from './utils/trim';
Vue.mixin(trim);

/*
// 1、用户/群组接口 - 修改文件，获取业务信息，注意异步返回Promise
import custom_service from "./views/chat/custom_service";

// 2、自定义消息接口 - 暂不开放-无需修改
import custom_message from "./views/chat/custom_message";

// 3. 自定义会话接口
import custom_conversation from "./views/chat/custom_conversation";

// 4. 处理消息
import customDisplayMessage from "./views/chat/will_message";
*/

// 代码高亮插件
// import hljs from 'highlight.js'
// import 'highlight.js/styles/github-gist.css'
import { DICT_TYPE, getDictDataLabel, getDictDatas, getDictDatas2 } from "@/utils/dict";
import Tui from '@wocwin/t-ui'
Vue.use(Tui)
import { TTable } from '@wocwin/t-ui'
import moovTools from '@/utils/moovTools'
import {formatLocalTimeByTimestamp,formatUserLocalTime} from '@/utils/timezone'


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.parseUTCTime = parseUTCTime
Vue.prototype.parseUTCWithTime = parseUTCWithTime
Vue.prototype.parseUTCTime2 = parseUTCTime2
Vue.prototype.parseUTCTimeWithHM = parseUTCTimeWithHM
Vue.prototype.isValidContainerNumber = isValidContainerNumber
Vue.prototype.resetForm = resetForm
Vue.prototype.getDictDatas = getDictDatas
Vue.prototype.getDictDatas2 = getDictDatas2
Vue.prototype.getDictDataLabel = getDictDataLabel
Vue.prototype.DICT_TYPE = DICT_TYPE
Vue.prototype.handleTree = handleTree
Vue.prototype.addBeginAndEndTime = addBeginAndEndTime
Vue.prototype.divide = divide
Vue.prototype.getCurrentTimeZone = getCurrentTimeZone
Vue.prototype.$moovTools = moovTools
Vue.prototype.formatUserLocalTime = formatUserLocalTime

// 全局组件挂载
Vue.component('TTable', TTable)
Vue.component('DictTag', DictTag)
Vue.component('DocAlert', DocAlert)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('ActionButton', ActionButton)
Vue.component('icon-park', IconPark)
// @ui-refactor
import ToastPlugin from '@/ui-refactor/plugins/toast'

// 使用插件
Vue.use(ToastPlugin)
// 字典标签组件
import DictTag from '@/components/DictTag'
import DocAlert from '@/components/DocAlert'
// 头部标签插件
import VueMeta from 'vue-meta'

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
// Vue.use(hljs.vuePlugin);

// bpmnProcessDesigner 需要引入
import MyPD from "@/components/bpmnProcessDesigner/package/index.js";
Vue.use(MyPD);
import "@/components/bpmnProcessDesigner/package/theme/index.scss";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// Form Generator 组件需要使用到 tinymce
import Tinymce from '@/components/tinymce/index.vue'
Vue.component('tinymce', Tinymce)
import '@/assets/icons'
import request from "@/utils/request" // 实现 form generator 使用自己定义的 axios request 对象
Vue.prototype.$axios = request
// @ui-refactor
import '@/ui-refactor/styles/index.scss'
import '@/assets/styles/font.scss'
// 默认点击背景不关闭弹窗
import ElementUI from 'element-ui'
ElementUI.Dialog.props.closeOnClickModal.default = false
ElementUI.Dialog.props.appendToBody.default = true

import CONSTANTS from '@/constant'
// 常量挂载到 Vue 实例
Vue.prototype.$constants = CONSTANTS
function makeDialogDraggable(dialog) {
  const header = dialog.querySelector('.el-dialog__header')
  if (!header) return

  header.style.cursor = 'move'

  const dragDom = dialog
  let startX, startY, initialLeft, initialTop

  header.onmousedown = (e) => {
    startX = e.clientX
    startY = e.clientY
    initialLeft = parseFloat(dragDom.style.left || 0)
    initialTop = parseFloat(dragDom.style.top || 0)

    document.onmousemove = (e) => {
      dragDom.style.left = initialLeft + (e.clientX - startX) + 'px'
      dragDom.style.top = initialTop + (e.clientY - startY) + 'px'
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}

// 监听 body 的变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('el-dialog__wrapper')) {
        const dialog = node.querySelector('.el-dialog')
        if (dialog) makeDialogDraggable(dialog)
      }
    })
  })
})

observer.observe(document.body, { childList: true, subtree: true })


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: localStorage.getItem("size") || "mini", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value) // 在注册Element时设置i18n的处理方法,可以实现当点击切换按钮后，elementUI可以自动调用.js语言文件实现多语言切换
});

Vue.config.productionTip = false

import i18n from './locales';

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),

})
