import request from '@/utils/request'

// 创建booking_forecast
export function createBookingForecast(data) {
  return request({
    url: '/system/booking-forecast/create',
    method: 'post',
    data: data
  })
}

// 更新booking_forecast
export function updateBookingForecast(data) {
  return request({
    url: '/system/booking-forecast/update',
    method: 'put',
    data: data
  })
}

// 删除booking_forecast
export function deleteBookingForecast(id) {
  return request({
    url: '/system/booking-forecast/delete?id=' + id,
    method: 'delete'
  })
}

// 获得booking_forecast
export function getBookingForecast(id) {
  return request({
    url: '/system/booking-forecast/get?id=' + id,
    method: 'get'
  })
}

// 获得booking_forecast分页
export function getBookingForecastPage(query) {
  return request({
    url: '/system/booking-forecast/page',
    method: 'get',
    params: query
  })
}

// 导出booking_forecast Excel
export function exportBookingForecastExcel(query) {
  return request({
    url: '/system/booking-forecast/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadForecastTemplate(query) {
  return request({
    url: '/system/booking-forecast/downloadForecastTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function getBookingForecastReport(query) {
  return request({
    url: '/system/booking-forecast/getBookingForecastReport',
    method: 'get',
    params: query
  })
}

export function getVesselVoyageList() {
  return request({
    url: '/system/booking-forecast/getVesselVoyageList',
    method: 'get'
  })
}

export function downloadForecastData() {
  return request({
    url: '/system/booking-forecast/downloadForecastData',
    method: 'get',
    responseType: 'blob',
    timeout: '1200000'
  })
}
