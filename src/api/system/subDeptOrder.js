import request from '@/utils/request'

// 创建system_user_order
export function createSubDeptOrder(data) {
  return request({
    url: '/system/sub-dept-order/create',
    method: 'post',
    data: data
  })
}

// 更新system_user_order
export function updateSubDeptOrder(data) {
  return request({
    url: '/system/sub-dept-order/update',
    method: 'put',
    data: data
  })
}

// 删除system_user_order
export function deleteSubDeptOrder(id) {
  return request({
    url: '/system/sub-dept-order/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_user_order
export function getSubDeptOrder(id) {
  return request({
    url: '/system/sub-dept-order/get?id=' + id,
    method: 'get'
  })
}

// 获得system_user_order分页
export function getSubDeptOrderPage(query) {
  return request({
    url: '/system/sub-dept-order/page',
    method: 'get',
    params: query
  })
}

// 导出system_user_order Excel
export function exportSubDeptOrderExcel(query) {
  return request({
    url: '/system/sub-dept-order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
