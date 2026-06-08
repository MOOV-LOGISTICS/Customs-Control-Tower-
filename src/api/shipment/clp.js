import request from '@/utils/request'

// 创建shipment_clp
export function createClp(data) {
  return request({
    url: '/shipment/clp/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_clp
export function updateClp(data) {
  return request({
    url: '/shipment/clp/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_clp
export function deleteClp(id) {
  return request({
    url: '/shipment/clp/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_clp
export function getClp(id) {
  return request({
    url: '/shipment/clp/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_clp分页
export function getClpPage(query) {
  return request({
    url: '/shipment/clp/page',
    method: 'get',
    params: query
  })
}


// 导出shipment_clp Excel
export function exportClpExcel(query) {
  return request({
    url: '/shipment/clp/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function getList(query) {
  return request({
    url: '/shipment/clp/list',
    method: 'get',
    params: query
  })
}

export function downloadShipmentCLPTemplate(query) {
  return request({
    url: '/shipment/clp/downloadShipmentCLPTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}