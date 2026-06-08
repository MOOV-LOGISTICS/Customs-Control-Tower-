import request from '@/utils/request'

// 创建shipment_hbl
export function createHbl(data) {
  return request({
    url: '/shipment/hbl/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_hbl
export function updateHbl(data) {
  return request({
    url: '/shipment/hbl/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_hbl
export function deleteHbl(id) {
  return request({
    url: '/shipment/hbl/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_hbl
export function getHbl(id) {
  return request({
    url: '/shipment/hbl/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_hbl分页
export function getHblPage(query) {
  return request({
    url: '/shipment/hbl/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_hbl Excel
export function exportHblExcel(query) {
  return request({
    url: '/shipment/hbl/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function uploadFile(data) {
  return request({
    url: '/shipment/hbl/uploadFile',
    method: 'post',
    data: data
  })
}

export function sendMail(data) {
  return request({
    url: '/shipment/hbl/sendMail',
    method: 'post',
    data: data
  })
}

export function shipments(data) {
  return request({
    url: '/shipment/hbl/shipments',
    method: 'post',
    data: data
  })
}

// 查询tmff 对应的blNo
export function findTmffBLNo(query) {
  return request({
    url: '/v1/tmff/hbl/findTmffBLNo',
    method: 'get',
    params: query
  })
}

// 查询tmff 对应的containerNo
export function findTmffContainerNo(query) {
  return request({
    url: '/v1/tmff/hbl/findTmffContainerNo',
    method: 'get',
    params: query
  })
}
