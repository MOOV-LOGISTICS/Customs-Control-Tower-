import request from '@/utils/request'

// 创建shipment_destination_router
export function createDestinationRouter(data) {
  return request({
    url: '/shipment/destination-router/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_destination_router
export function updateDestinationRouter(data) {
  return request({
    url: '/shipment/destination-router/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_destination_router
export function deleteDestinationRouter(id) {
  return request({
    url: '/shipment/destination-router/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_destination_router
export function getDestinationRouter(id) {
  return request({
    url: '/shipment/destination-router/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_destination_router分页
export function getDestinationRouterPage(query) {
  return request({
    url: '/shipment/destination-router/page',
    method: 'get',
    params: query
  })
}

export function getDestinationRouterList(data) {
  return request({
    url: '/shipment/destination-router/list1',
    method: 'post',
    data: data
  })
}


// 导出shipment_destination_router Excel
export function exportDestinationRouterExcel(query) {
  return request({
    url: '/shipment/destination-router/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
