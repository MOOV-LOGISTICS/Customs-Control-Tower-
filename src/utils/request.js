  import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
// @ui-ui-refactor
import Toast from '@/ui-refactor/components/MoovToast/index.js'
import store from '@/store'
import {getAccessToken, getRefreshToken, getTenantId, setToken, removeToken} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {getPath, getTenantEnable} from "@/utils/ruoyi";
import {refreshToken} from "@/api/login";
import i18n from '../locales/index'
import { getCurrentTimeZone } from '@/utils/index'

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  "无效的刷新令牌", // 刷新令牌被删除时，不用提示
  "刷新令牌已过期" // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]

// 是否显示重新登录
export let isRelogin = { show: false };
// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
// 请求队列
let requestList = []
// 是否正在刷新中
let isRefreshToken = false

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API + '/admin-api/', // 此处的 /admin-api/ 地址，原因是后端的基础路径为 /admin-api/
  // 超时
  timeout: 80000,
  // 禁用 Cookie 等信息
  withCredentials: false,
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getAccessToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['X-User-Interaction'] = config.XUserInteraction? '0':'1'  //自定义Header，区分定时触发接口(X-User-Interaction=0)及用户主动触发接口(X-User-Interaction=1)，供后端刷新用户上次活跃时间使用
    //自定义Header，区分不同时区，例如:"Asia/Shanghai"
    config.headers['X-Time-Zone'] = getCurrentTimeZone().timeZone;
    // 自定义Header，区分不同时区偏移量，例如:-8 代表东八区，比 utc 早8 小时
    config.headers['X-Time-Zone-Offset'] = getCurrentTimeZone().timeZoneOffset;
  }
  // 2026-03-31 haikang 如果是FormData类型，移除默认的Content-Type，让浏览器自动设置
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  // 设置租户
  if (getTenantEnable()) {
    const tenantId = getTenantId();
    if (tenantId) {
      config.headers['tenant-id'] = tenantId;
    } else {
      if (getAccessToken() && !isToken) {
        removeToken();
      }
    }
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      const part = encodeURIComponent(propName) + '='
      if (value !== null && typeof(value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(async res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.msg || errorCode[code] || errorCode['default'] || res.msg
  if (ignoreMsgs.indexOf(msg) !== -1) { // 如果是忽略的错误码，直接返回 msg 异常
    return Promise.reject(msg)
  } else if (code === 401) {
    if(!getRefreshToken() && !getTenantId()) {
         location.href = getPath('/index');
         return;
      }
    // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
    if (!isRefreshToken) {
      isRefreshToken = true;
      // 1. 如果获取不到刷新令牌，则只能执行登出操作
      if (!getRefreshToken()) {
        return handleAuthorized();
      }
      // 2. 进行刷新访问令牌
      try {
        const refreshTokenRes = await refreshToken()
        // 2.1 刷新成功，则回放队列的请求 + 当前请求
        setToken(refreshTokenRes.data)
        requestList.forEach(cb => cb())
        return service(res.config)
      } catch (e) {// 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
        // 2.2 刷新失败，只回放队列的请求
        requestList.forEach(cb => cb())
        // 提示是否要登出。即不回放当前请求！不然会形成递归
        return handleAuthorized();
      } finally {
        requestList = []
        isRefreshToken = false
      }
    } else {
      // 添加到队列，等待刷新获取到新的令牌
      return new Promise(resolve => {
        requestList.push(() => {
          res.config.headers['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
          resolve(service(res.config))
        })
      })
    }
  } else if (code === 1004) {
    // Message({
    //   type: 'error',
    //   duration: 0,
       const message = 'You have entered characters with security risks, which do not meet the requirements.'
    // })
     Toast.error(message)
    return Promise.reject(new Error(msg))
  } else if (code === 500) {
    // Message({
    //   message: msg,
    //   type: 'error'
    // })
    return Promise.reject(new Error(msg))
  } else if (code === 501) {
    // Message({
    //   type: 'error',
    //   duration: 0,
    //   message: msg
    // })
    return Promise.reject(new Error(msg))
  } else if (code === 901) {
    // Message({
    //   type: 'error',
    //   duration: 0,
    //   dangerouslyUseHTMLString: true,
    //   message: '<div>演示模式，无法进行写操作</div>'
    //     + '<div> &nbsp; </div>'
    //     + '<div> &nbsp; </div>'
    //     + '<div>5 分钟搭建本地环境</div>',
    // })
    return Promise.reject(new Error(msg))
  } else if (code == 1002000017 || code == 1002000018 || code == 1002000027 || code == 1002000028 || code=='1002000029' ||code == '1002000023' || code=='1002000024' || code=='1002000019') {//没有同意隐私政策,需要重置密码, 首次需要MFA 验证
     return Promise.reject(code)
  }else if(code == 1002015000){ //租户id is null
    removeToken();
    location.href = getPath('/login');
  } else if (code === 421) {
    // 业务异常，使用 Toast 显示，并标记为已处理
    Toast.error(msg)
    return Promise.reject({ code: 421, msg: msg, handled: true })

  } else if (code !== 200) {
    if (msg === '无效的刷新令牌') { // hard coding：忽略这个提示，直接登出
      console.log(msg)
    } else {
      console.log(code,msg)
      Toast.error(msg)

    }
    return Promise.reject(code || 'error')
  } else {
    return res.data
  }
}, error => {
    console.log('err' + error)
    let {message} = error;
    if (message === "Network Error") {
      message = "ERROR_12: System error, please contact support.";
    } else if (message.includes("timeout")) {
      message = "ERROR_13: System timeout error, please try again.";
    } else if (message.includes("Request failed with status code")) {
      message = "ERROR_14: System error[" + message.substr(message.length - 3) + "], please contact support.";
    }
    Message({
      message: "Network Error, please try again later.",
      type: 'error',
      duration: 1 * 1000
    })
    // Message({
    //   message: message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export function getBaseHeader() {
  const headers = {
    'Authorization': "Bearer " + getAccessToken(),
    'tenant-id': getTenantId(),
  }
  // 与 axios 拦截器保持一致：补齐时区信息，覆盖 el-upload 等非 axios 请求
  try {
    const tz = getCurrentTimeZone()
    headers['X-Time-Zone'] = tz && tz.timeZone ? tz.timeZone : undefined
    headers['X-Time-Zone-Offset'] = tz && tz.timeZoneOffset ? tz.timeZoneOffset : undefined
  } catch (e) {
    // ignore
  }
  return headers
}

function handleAuthorized() {
  store.dispatch('LogOut').then(() => {
    location.href = getPath('/index');
  })
  return null
  if (!isRelogin.show) {
    isRelogin.show = true;
    MessageBox.confirm(i18n.t('systm.sessionExp'), i18n.t('systm.systemPrompt'), {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      isRelogin.show = false;
      store.dispatch('LogOut').then(() => {
        location.href = getPath('/index');
      })
    }).catch(() => {
      isRelogin.show = false;
    });
  }
  return Promise.reject(i18n.t('systm.sessionOut'))
}

export default service
