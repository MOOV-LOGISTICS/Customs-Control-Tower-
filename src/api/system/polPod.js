import request from '@/utils/request'

// 创建港口
export function createPolPod(data) {
  return request({
    url: '/system/pol-pod/create',
    method: 'post',
    data: data
  })
}

// 更新港口
export function updatePolPod(data) {
  return request({
    url: '/system/pol-pod/update',
    method: 'put',
    data: data
  })
}

// 删除港口
export function deletePolPod(id) {
  return request({
    url: '/system/pol-pod/delete?id=' + id,
    method: 'delete'
  })
}

// 获得港口
export function getPolPod(id) {
  return request({
    url: '/system/pol-pod/get?id=' + id,
    method: 'get'
  })
}

// 获得港口分页
export function getPolPodPage(query) {
  return request({
    url: '/system/pol-pod/page',
    method: 'get',
    params: query
  })
}

export function getPolPodList(query) {
  return request({
    url: '/system/pol-pod/list',
    method: 'get',
    params: query
  })
}

// 导出港口 Excel
export function exportPolPodExcel(query) {
  return request({
    url: '/system/pol-pod/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
