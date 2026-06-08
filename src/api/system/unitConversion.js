import request from '@/utils/request'

// 创建单位转换
export function createUnitConversion(data) {
  return request({
    url: '/system/unit-conversion/create',
    method: 'post',
    data: data
  })
}

// 更新单位转换
export function updateUnitConversion(data) {
  return request({
    url: '/system/unit-conversion/update',
    method: 'put',
    data: data
  })
}

// 删除单位转换
export function deleteUnitConversion(id) {
  return request({
    url: '/system/unit-conversion/delete?id=' + id,
    method: 'delete'
  })
}

// 获得单位转换
export function getUnitConversion(id) {
  return request({
    url: '/system/unit-conversion/get?id=' + id,
    method: 'get'
  })
}

// 获得单位转换分页
export function getUnitConversionPage(query) {
  return request({
    url: '/system/unit-conversion/page',
    method: 'get',
    params: query
  })
}

// 导出单位转换 Excel
export function exportUnitConversionExcel(query) {
  return request({
    url: '/system/unit-conversion/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function importTemplate() {
  return request({
    url: '/system/unit-conversion/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
export function listByProductIds(query) {
  return request({
    url: '/system/unit-conversion/listByProductIds',
    method: 'post',
    data: query
  })
}
