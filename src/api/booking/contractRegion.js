import request from '@/utils/request'

// 创建booking_contract_region
export function createContractRegion(data) {
  return request({
    url: '/booking/contract-region/create',
    method: 'post',
    data: data
  })
}

// 更新booking_contract_region
export function updateContractRegion(data) {
  return request({
    url: '/booking/contract-region/update',
    method: 'put',
    data: data
  })
}

// 删除booking_contract_region
export function deleteContractRegion(id) {
  return request({
    url: '/booking/contract-region/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_contract_region
export function getContractRegion(id) {
  return request({
    url: '/booking/contract-region/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_contract_region分页
export function getContractRegionPage(query) {
  return request({
    url: '/booking/contract-region/page',
    method: 'get',
    params: query
  })
}

// 导出booking_contract_region Excel
export function exportContractRegionExcel(query) {
  return request({
    url: '/booking/contract-region/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得booking_contract_region
export function getContractRegionList() {
  return request({
    url: '/booking/contract-region/list',
    method: 'get'
  })
}
