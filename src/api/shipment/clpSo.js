import request from '@/utils/request'

// 创建shipment_clp_so
export function createClpSo(data) {
  return request({
    url: '/shipment/clp-so/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_clp_so
export function updateClpSo(data) {
  return request({
    url: '/shipment/clp-so/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_clp_so
export function deleteClpSo(id) {
  return request({
    url: '/shipment/clp-so/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_clp_so
export function getClpSo(id) {
  return request({
    url: '/shipment/clp-so/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_clp_so分页
export function getClpSoPage(query) {
  return request({
    url: '/shipment/clp-so/page',
    method: 'get',
    params: query
  })
}

export function getClpSoList(query) {
  return request({
    url: '/shipment/clp-so/list',
    method: 'get',
    params: query
  })
}

// 导出shipment_clp_so Excel
export function exportClpSoExcel(query) {
  return request({
    url: '/shipment/clp-so/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
