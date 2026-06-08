import request from "@/utils/request";
export function dbInfo() {
    return request({
      url: '/monitoring/db',
      method: 'get'
    })
}
export function serverInfo() {
    return request({
      url: '/monitoring/serverInfo',
      method: 'get'
    })
}
export function systemUserAndCustomerInfo() {
  return request({
    url: '/monitoring/systemUserAndCustomerInfo',
    method: 'get'
  })
}
