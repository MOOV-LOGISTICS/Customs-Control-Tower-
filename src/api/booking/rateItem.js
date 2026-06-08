import request from '@/utils/request'

// 创建shipment_rate_item
export function createRateItem(data) {
  return request({
    url: '/booking/rate-item/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_rate_item
export function updateRateItem(data) {
  return request({
    url: '/booking/rate-item/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_rate_item
export function deleteRateItem(id) {
  return request({
    url: '/booking/rate-item/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_rate_item
export function getRateItem(id) {
  return request({
    url: '/booking/rate-item/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_rate_item分页
export function getRateItemPage(query) {
  return request({
    url: '/booking/rate-item/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_rate_item Excel
export function exportRateItemExcel(query) {
  return request({
    url: '/booking/rate-item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
