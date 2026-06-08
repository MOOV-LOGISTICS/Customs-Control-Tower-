import request from '@/utils/request'

// 创建shipment_time_log
export function createTimeLog(data) {
  return request({
    url: '/shipment/time-log/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_time_log
export function updateTimeLog(data) {
  return request({
    url: '/shipment/time-log/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_time_log
export function deleteTimeLog(id) {
  return request({
    url: '/shipment/time-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_time_log
export function getTimeLog(id) {
  return request({
    url: '/shipment/time-log/get?id=' + id,
    method: 'get'
  })
}

export function timeLogListByShipmentId(query) {
  return request({
    url: '/shipment/time-log/listByShipmentId',
    method: 'get',
    params: query
  })
}

// 获得shipment_time_log分页
export function getTimeLogPage(query) {
  return request({
    url: '/shipment/time-log/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_time_log Excel
export function exportTimeLogExcel(query) {
  return request({
    url: '/shipment/time-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
