import request from '@/utils/request'

// 创建booking
export function create(data) {
  return request({
    url: '/booking/book/create',
    method: 'post',
    data: data
  })
}
// 更新booking
export function update(data) {
  return request({
    url: '/booking/book/update',
    method: 'put',
    data: data
  })
}


// 获得booking
export function get(id) {
  return request({
    url: '/booking/book/get?id=' + id,
    method: 'get'
  })
}

export function groupByPort() {
  return request({
    url: '/booking/book/booking-group-by-port',
    method: 'get'
  })
}
// 获得booking分页
export function listByConditionBooking(query) {
  return request({
    url: '/booking/book/listByCondition',
    method: 'get',
    params: query
  })
}


export function countBooking(query) {
  return request({
    url: '/booking/book/count',
    method: 'get',
    params: query
  })
}

export function getPage(query) {
  return request({
    url: '/booking/book/page',
    method: 'get',
    params: query
  })
}

// 导出booking Excel
export function exportExcel(query) {
  return request({
    url: '/booking/book/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}


// 获得booking
export function getBookingList(query) {
  return request({
    url: '/booking/book/list',
    method: 'get',
    params: query
  })
}

export function getListByShipmentId(query) {
  return request({
    url: '/booking/book/getListByShipmentId',
    method: 'get',
    params: query
  })
}
export function bookingReport(query) {
  return request({
    url: '/booking/book/bookingReport',
    method: 'get',
    params: query
  })
}
export function exportTxtUrl(query) {
  return request({
    url: '/shipment/api/export/edi?ids='+query,
    method: 'get',
    data: query,
    responseType: 'blob'
  })
}

