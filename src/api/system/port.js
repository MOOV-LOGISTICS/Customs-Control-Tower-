import request from '@/utils/request'

// 创建港口
export function createPort(data) {
  return request({
    url: '/system/port/create',
    method: 'post',
    data: data
  })
}

// 更新港口
export function updatePort(data) {
  return request({
    url: '/system/port/update',
    method: 'put',
    data: data
  })
}

// 删除港口
export function deletePort(id) {
  return request({
    url: '/system/port/delete?id=' + id,
    method: 'delete'
  })
}

// 获得港口
export function getPort(id) {
  return request({
    url: '/system/port/get?id=' + id,
    method: 'get'
  })
}

// 获得港口分页
export function getPortPage(query) {
  return request({
    url: '/system/port/page',
    method: 'get',
    params: query
  })
}

// 导出港口 Excel
export function exportPortExcel(query) {
  return request({
    url: '/system/port/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
