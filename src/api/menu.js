import request from '@/utils/request'



var lang = window.localStorage.getItem('lang');
// 获取路由
export const getRouters = () => {
  return request({
    url: '/system/auth/list-menus'+'?lang='+lang,
    method: 'get'
  })
}
