import request from '@/utils/request'

// 创建booking_contract_no
export function createContractNo(data) {
  return request({
    url: '/shipment/contract-no/create',
    method: 'post',
    data: data
  })
}

// 更新booking_contract_no
export function updateContractNo(data) {
  return request({
    url: '/shipment/contract-no/update',
    method: 'put',
    data: data
  })
}

// 删除booking_contract_no
export function deleteContractNo(id) {
  return request({
    url: '/shipment/contract-no/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_contract_no
export function getContractNo(id) {
  return request({
    url: '/shipment/contract-no/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_contract_no分页
export function getContractNoPage(query) {
  return request({
    url: '/shipment/contract-no/page',
    method: 'get',
    params: query
  })
}

// 导出booking_contract_no Excel
export function exportContractNoExcel(query) {
  return request({
    url: '/shipment/contract-no/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/shipment/contract-no/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
