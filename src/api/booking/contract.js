import request from '@/utils/request'

// 创建booking_contract
export function createContract(data) {
  return request({
    url: '/shipment/contract/create',
    method: 'post',
    data: data
  })
}

// 更新booking_contract
export function updateContract(data) {
  return request({
    url: '/shipment/contract/update',
    method: 'put',
    data: data
  })
}

// 删除booking_contract
export function deleteContract(id) {
  return request({
    url: '/shipment/contract/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_contract
export function getContract(id) {
  return request({
    url: '/shipment/contract/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_contract分页
export function getContractPage(query) {
  return request({
    url: '/shipment/contract/page',
    method: 'get',
    params: query
  })
}

export function getContractListTenantIgnore(query) {
  return request({
    url: '/shipment/contract/listTenantIgnore',
    method: 'get',
    params: query
  })
}

// 导出booking_contract Excel
export function exportContractExcel(query) {
  return request({
    url: '/shipment/contract/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}



// 导出booking_contract Excel
export function downloadContractItemTemplate(query) {
  return request({
    url: '/shipment/contract-item/downloadContractItemTemplate?type='+query,
    method: 'get',
    responseType: 'blob'
  })
}

export function getValidCarrier(query, q2) {
  return request({
    url: '/shipment/contract/getValidCarrier?year='+query+'&customerId='+q2,
    method: 'get'
  })
}

export function getCarrierAllocation(query) {
  return request({
    url: '/shipment/contract/getCarrierAllocation',
    method: 'get',
    params: query
  })
}


export function getValueDisList(query) {
  return request({
    url: '/shipment/contract/getValueDisList',
    method: 'get',
    params: query
  })
}

export function getAllocationWeekData(carrier, contractNo) {
  return request({
    url: '/shipment/contract/getAllocationWeekData?carrier='+carrier+'&contractNo='+contractNo,
    method: 'get'
  })
}


export function getDetailLots(data) {
  return request({
    url: '/shipment/contract/getDetailLots',
    method: 'post',
    data: data
  })
}


export function exportLot(query) {
  return request({
    url: '/shipment/contract/exportLot',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得booking_contract_item分页
export function getContractItemPage(query) {
  return request({
    url: '/shipment/contract-item/page',
    method: 'get',
    params: query
  })
}

export function deleteContractItem(id) {
  return request({
    url: '/shipment/contract-item/delete?id=' + id,
    method: 'delete'
  })
}

// 更新booking_contract
export function updateContractItem(data) {
  return request({
    url: '/shipment/contract-item/update',
    method: 'put',
    data: data
  })
}


// 更新booking_contract
export function getWeeksByContractId(id) {
  return request({
    url: '/shipment/contract-item/getWeeksByContractId?id=' + id,
    method: 'get'
  })
}

export function getHemaAllocation(query) {
  return request({
    url: '/shipment/contract/getHemaAllocation',
    method: 'get',
    params: query
  })
}

export function getUserCustomerList() {
  return request({
    url: '/shipment/contract/getUserCustomerList',
    method: 'get'
  })
}
