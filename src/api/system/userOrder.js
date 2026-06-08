import request from '@/utils/request'

// 创建user_order
export function createUserOrder(data) {
  return request({
    url: '/system/user-order/create',
    method: 'post',
    data: data
  })
}

// 更新user_order
export function updateUserOrder(data) {
  return request({
    url: '/system/user-order/update',
    method: 'put',
    data: data
  })
}

// 删除user_order
export function deleteUserOrder(id) {
  return request({
    url: '/system/user-order/delete?id=' + id,
    method: 'delete'
  })
}

// 获得user_order
export function getUserOrder(id) {
  return request({
    url: '/system/user-order/get?id=' + id,
    method: 'get'
  })
}

// 获得user_order分页
export function getUserOrderPage(query) {
  return request({
    url: '/system/user-order/page',
    method: 'get',
    params: query
  })
}

// 导出user_order Excel
export function exportUserOrderExcel(query) {
  return request({
    url: '/system/user-order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
