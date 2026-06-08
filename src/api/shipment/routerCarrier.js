import request from '@/utils/request'

// 创建shipment_router_carrier
export function createRouterCarrier(data) {
  return request({
    url: '/shipment/router-carrier/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_router_carrier
export function updateRouterCarrier(data) {
  return request({
    url: '/shipment/router-carrier/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_router_carrier
export function deleteRouterCarrier(id) {
  return request({
    url: '/shipment/router-carrier/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_router_carrier
export function getRouterCarrier(id) {
  return request({
    url: '/shipment/router-carrier/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_router_carrier分页
export function getRouterCarrierPage(query) {
  return request({
    url: '/shipment/router-carrier/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_router_carrier Excel
export function exportRouterCarrierExcel(query) {
  return request({
    url: '/shipment/router-carrier/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
