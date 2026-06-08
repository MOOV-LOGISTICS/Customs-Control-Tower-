import request from '@/utils/request'

// 创建shipment_contract_rate
export function saveRate(data) {
  return request({
    url: '/booking/rate/save',
    method: 'post',
    data: data
  })
}


// 创建shipment_contract_rate
export function createRate(data) {
  return request({
    url: '/booking/rate/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_contract_rate
export function updateRate(data) {
  return request({
    url: '/booking/rate/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_contract_rate
export function deleteRate(id) {
  return request({
    url: '/booking/rate/delete?id=' + id,
    method: 'delete'
  })
}

export function getRateById(id) {
  return request({
    url: '/booking/rate/getRateById?id=' + id,
    method: 'get'
  })
}

// 获得shipment_contract_rate
export function getRate(id) {
  return request({
    url: '/booking/rate/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_contract_rate分页
export function getRatePage(query) {
  return request({
    url: '/booking/rate/page',
    method: 'get',
    params: query
  })
}
// 获得shipment_contract_rate分页
export function getRatePages(query) {
  return request({
    url: '/booking/rate/pages',
    method: 'get',
    params: query
  })
}

// 导出shipment_contract_rate Excel
export function exportRateExcel(query) {
  return request({
    url: '/booking/rate/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
