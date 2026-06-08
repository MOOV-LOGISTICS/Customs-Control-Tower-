import request from '@/utils/request'

// 创建booking_pre_assgin
export function createPreAssign(data) {
  return request({
    url: '/booking/pre-assign/create',
    method: 'post',
    data: data
  })
}

// 更新booking_pre_assgin
export function updatePreAssign(data) {
  return request({
    url: '/booking/pre-assign/update',
    method: 'put',
    data: data
  })
}

// 删除booking_pre_assgin
export function deletePreAssign(id) {
  return request({
    url: '/booking/pre-assign/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_pre_assgin
export function getPreAssign(id) {
  return request({
    url: '/booking/pre-assign/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_pre_assgin
export function getLatestPreAssign(bookingId) {
  return request({
    url: '/booking/pre-assign/latest/get?bookingId=' + bookingId,
    method: 'get'
  })
}

export function getPreAssignByBookingId(bookingId) {
  return request({
    url: '/booking/pre-assign/by-booking-id?bookingId=' + bookingId,
    method: 'get'
  })
}

// 获得booking_pre_assgin分页
export function getPreAssignPage(query) {
  return request({
    url: '/booking/pre-assign/page',
    method: 'get',
    params: query
  })
}

// 导出booking_pre_assgin Excel
export function exportPreAssignExcel(query) {
  return request({
    url: '/booking/pre-assign/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
