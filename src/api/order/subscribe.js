import request from '@/utils/request'

// 创建order_subscribe
export function createSubscribe(data) {
  return request({
    url: '/order/subscribe/create',
    method: 'post',
    data: data
  })
}

// 更新order_subscribe
export function updateSubscribe(data) {
  return request({
    url: '/order/subscribe/update',
    method: 'put',
    data: data
  })
}

// 删除order_subscribe
export function deleteSubscribe(id) {
  return request({
    url: '/order/subscribe/delete?id=' + id,
    method: 'delete'
  })
}

// 获得order_subscribe
export function getSubscribe(id) {
  return request({
    url: '/order/subscribe/get?id=' + id,
    method: 'get'
  })
}

// 获得order_subscribe分页
export function getSubscribePage(query) {
  return request({
    url: '/order/subscribe/page',
    method: 'get',
    params: query
  })
}

// 导出order_subscribe Excel
export function exportSubscribeExcel(query) {
  return request({
    url: '/order/subscribe/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
