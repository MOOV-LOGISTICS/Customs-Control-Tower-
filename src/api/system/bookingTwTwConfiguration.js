import request from '@/utils/request'

// 更新booking_tw_configuration
export function updateBookingTwConfiguration(data) {
  return request({
    url: '/system/booking-forecast/tw-configuration/update',
    method: 'put',
    data: data
  })
}

// 删除booking_tw_configuration
export function deleteBookingTwConfiguration(id) {
  return request({
    url: '/system/booking-forecast/tw-configuration/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_tw_configuration
export function getBookingTwConfiguration(id) {
  return request({
    url: '/system/booking-forecast/tw-configuration/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_tw_configuration分页
export function getBookingTwConfigurationPage(query) {
  return request({
    url: '/system/booking-forecast/tw-configuration/page',
    method: 'get',
    params: query
  })
}

// // 导出booking_tw_configuration Excel
// export function exportBookingTwConfigurationExcel(query) {
//   return request({
//     url: '/system/booking-forecast/export-excel',
//     method: 'get',
//     params: query,
//     responseType: 'blob'
//   })
// }

export function downloadTwConfigurationTemplate(query) {
  return request({
    url: '/system/booking-forecast/downloadTwTtConfigurationTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function importTemplate() {
  return request({
    url: '/system/booking-forecast/import-tw-configuration',
    method: 'get',
    responseType: 'blob'
  })
}

