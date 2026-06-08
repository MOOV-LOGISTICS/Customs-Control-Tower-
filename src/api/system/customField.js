import request from '@/utils/request'

// 创建自定义字段
export function createCustomField(data) {
  return request({
    url: '/system/custom-field/create',
    method: 'post',
    data: data
  })
}

// 更新自定义字段
export function updateCustomField(data) {
  return request({
    url: '/system/custom-field/update',
    method: 'put',
    data: data
  })
}

// 删除自定义字段
export function deleteCustomField(id) {
  return request({
    url: '/system/custom-field/delete?id=' + id,
    method: 'delete'
  })
}

// 获得自定义字段
export function getCustomField(id) {
  return request({
    url: '/system/custom-field/get?id=' + id,
    method: 'get'
  })
}

// 获得自定义字段分页
export function getCustomFieldPage(query) {
  return request({
    url: '/system/custom-field/page',
    method: 'get',
    params: query
  })
}

export function getCustomFieldList(query) {
  return request({
    url: '/system/custom-field/list',
    method: 'get',
    params: query
  })
}

// 导出自定义字段 Excel
export function exportCustomFieldExcel(query) {
  return request({
    url: '/system/custom-field/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
