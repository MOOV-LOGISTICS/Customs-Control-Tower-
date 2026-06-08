import request from '@/utils/request'

// 创建shipment_clp
export function pepcoCreateClp(data) {
  return request({
    url: '/pepco/shipment/clp/create',
    method: 'post',
    data: data
  })
}


// 更新shipment_clp
export function pepcoUpdateClp(data) {
  return request({
    url: '/pepco/shipment/clp/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_clp
export function pepcoDeleteClp(id) {
  return request({
    url: '/pepco/shipment/clp/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_clp
export function getClp(id) {
  return request({
    url: '/pepco/shipment/clp/get?id=' + id,
    method: 'get'
  })
}

export function pepcoGetClpByShipmentId(id) {
  return request({
    url: '/pepco/shipment/clp/getClpByShipmentId?id=' + id,
    method: 'get'
  })
}

export function pepcoGetClpDetailBySoRef(id) {
  return request({
    url: '/pepco/shipment/clp/getClpDetailBySoRef?soRef=' + id,
    method: 'get'
  })
}

// 获得shipment_clp分页
export function pepcoGetClpPage(query) {
  return request({
    url: '/pepco/shipment/clp/page',
    method: 'get',
    params: query
  })
}

export function getClpFilterList(query) {
  return request({
    url: '/pepco/shipment/clp/filter/list',
    method: 'get',
    params: query
  })
}

// 导出shipment_clp Excel
export function exportClpExcel(query) {
  return request({
    url: '/pepco/shipment/clp/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function pepcoGetList(query) {
  return request({
    url: '/pepco/shipment/clp/list',
    method: 'get',
    params: query
  })
}

export function pepcoDownloadShipmentCLPTemplate(query) {
  return request({
    url: '/pepco/shipment/clp/downloadShipmentCLPTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function pepcoDownloadShipmentCLPTemplateByShipmentId(query) {
  return request({
    url: '/pepco/shipment/clp/downloadShipmentCLPTemplateByShipmentId',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

