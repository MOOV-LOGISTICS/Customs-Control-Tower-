import request from '@/utils/request'

// 创建sales order item
export function createSOItem(data) {
  return request({
    url: '/order/SO-item/create',
    method: 'post',
    data: data
  })
}

// 更新sales order item
export function updateSOItem(data) {
  return request({
    url: '/order/SO-item/update',
    method: 'put',
    data: data
  })
}

// 删除sales order item
export function deleteSOItem(id) {
  return request({
    url: '/order/SO-item/delete?id=' + id,
    method: 'delete'
  })
}

// 获得sales order item
export function getSOItem(id) {
  return request({
    url: '/order/SO-item/get?id=' + id,
    method: 'get'
  })
}

// 获得sales order item分页
export function getSOItemPage(query) {
  return request({
    url: '/order/SO-item/page',
    method: 'get',
    params: query
  })
}

// 导出sales order item Excel
export function exportSOItemExcel(query) {
  return request({
    url: '/order/SO-item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
