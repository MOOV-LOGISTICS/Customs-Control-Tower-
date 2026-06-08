import request from '@/utils/request'

// 创建system_cut_off_date
export function createCutOffDate(data) {
  return request({
    url: '/cut/off/create',
    method: 'post',
    data: data
  })
}

// 更新system_cut_off_date
export function updateCutOffDate(data) {
  return request({
    url: '/cut/off/update',
    method: 'put',
    data: data
  })
}

// 删除system_cut_off_date
export function deleteCutOffDate(id) {
  return request({
    url: '/cut/off/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_cut_off_date
export function getCutOffDate(id) {
  return request({
    url: '/cut/off/get?id=' + id,
    method: 'get'
  })
}

// 获得system_cut_off_date分页
export function getCutOffDatePage(query) {
  return request({
    url: '/cut/off/page',
    method: 'get',
    params: query
  })
}

// 导出system_cut_off_date Excel
export function exportCutOffDateExcel(query) {
  return request({
    url: '/cut/off/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
