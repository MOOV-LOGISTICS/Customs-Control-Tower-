import request from '@/utils/request'


export function reqCheck(data) {
  return request({
    url: '/power/bi-report/list',
    method: 'post',
    data
  })
}
export function getAllocationData(data) {
  return request({
    url: '/power/bi-report/allocationData',
    method: 'post',
    data: data
  })
}

export function getWeekList(year) {
  return request({
    url: '/power/bi-report/getWeekList?year='+year,
    method: 'get'
  })
}

export function getDetailLots(data) {
  return request({
    url: '/power/bi-report/getDetailLots',
    method: 'post',
    data: data
  })
}

export function getDisList() {
  return request({
    url: '/power/bi-report/getDisList',
    method: 'get'
  })
}

export function exportLot(query) {
  return request({
    url: '/power/bi-report/exportLot',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function getBIReportUrl(data) {
  return request({
    url: '/power/bi-report/getBIReportUrl',
    method: 'post',
    data: data
  })
}
export function getCustomerReports(data) {
  return request({
    url: '/power/bi-report/getCustomerReports',
    method: 'post',
    data: data
  })
}

export function getDeptReportData(data) {
  return request({
    url: '/power/bi-report/getDeptReportData',
    method: 'post',
    data: data
  })
}

export function getVMTReportData(data) {
  return request({
    url: '/power/bi-report/getVMTReportData',
    method: 'post',
    data: data
  })
}

export function arrivingWithin7Days(data) {
  return request({
    url: '/power/bi-report/arrivingWithin7Days',
    method: 'post',
    data: data
  })
}

export function departingWithin7Days(data) {
  return request({
    url: '/power/bi-report/departingWithin7Days',
    method: 'post',
    data: data
  })
}

export function getUserCustomerName() {
  return request({
    url: '/power/bi-report/getUserCustomerName',
    method: 'get'
  })
}


export function getVMTCustomerReports(data) {
  return request({
    url: '/power/bi-report/getVMTCustomerReports',
    method: 'post',
    data: data
  })
}

