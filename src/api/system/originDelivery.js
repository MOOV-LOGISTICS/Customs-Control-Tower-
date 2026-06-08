import request from '@/utils/request'

// 创建出发地、目的地
export function createOriginDelivery(data) {
  return request({
    url: '/system/origin-delivery/create',
    method: 'post',
    data: data
  })
}

// 更新出发地、目的地
export function updateOriginDelivery(data) {
  return request({
    url: '/system/origin-delivery/update',
    method: 'put',
    data: data
  })
}

// 删除出发地、目的地
export function deleteOriginDelivery(id) {
  return request({
    url: '/system/origin-delivery/delete?id=' + id,
    method: 'delete'
  })
}

// 获得出发地、目的地
export function getOriginDelivery(id) {
  return request({
    url: '/system/origin-delivery/get?id=' + id,
    method: 'get'
  })
}

// 获得出发地、目的地分页
export function getOriginDeliveryPage(query) {
  return request({
    url: '/system/origin-delivery/page',
    method: 'get',
    params: query
  })
}

export function getOriginDeliveryList(query) {
  return request({
    url: '/system/origin-delivery/list',
    method: 'get',
    params: query
  })
}

// 导出出发地、目的地 Excel
export function exportOriginDeliveryExcel(query) {
  return request({
    url: '/system/origin-delivery/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function downloadOriginDeliveryTemplate(query) {
  return request({
    url: '/system/origin-delivery/downloadOriginDeliveryTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}