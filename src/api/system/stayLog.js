import request from '@/utils/request'

// 创建system_staytime_log
export function createStayLog(data) {
  return request({
    url: '/system/stay-log/create',
    method: 'post',
    data: data
  })
}

// 更新system_staytime_log
export function updateStayLog(data) {
  return request({
    url: '/system/stay-log/update',
    method: 'put',
    data: data
  })
}

// 删除system_staytime_log
export function deleteStayLog(id) {
  return request({
    url: '/system/stay-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_staytime_log
export function getStayLog(id) {
  return request({
    url: '/system/stay-log/get?id=' + id,
    method: 'get'
  })
}

// 获得system_staytime_log分页
export function getStayLogPage(query) {
  return request({
    url: '/system/stay-log/page',
    method: 'get',
    params: query
  })
}

// 导出system_staytime_log Excel
export function exportStayLogExcel(query) {
  return request({
    url: '/system/stay-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得Email列表
export function groupByEmail(query) {
  return request({
    url: '/system/stay-log/groupByEmail',
    method: 'get',
    params: query
  })
}


