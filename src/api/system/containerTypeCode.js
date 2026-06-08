import request from '@/utils/request'

// 创建container_type_code
export function createContainerTypeCode(data) {
  return request({
    url: '/system/container-type-code/create',
    method: 'post',
    data: data
  })
}

// 更新container_type_code
export function updateContainerTypeCode(data) {
  return request({
    url: '/system/container-type-code/update',
    method: 'put',
    data: data
  })
}

// 删除container_type_code
export function deleteContainerTypeCode(id) {
  return request({
    url: '/system/container-type-code/delete?id=' + id,
    method: 'delete'
  })
}

// 获得container_type_code
export function getContainerTypeCode(id) {
  return request({
    url: '/system/container-type-code/get?id=' + id,
    method: 'get'
  })
}

// 获得container_type_code分页
export function getContainerTypeCodePage(query) {
  return request({
    url: '/system/container-type-code/page',
    method: 'get',
    params: query
  })
}
export function getContainerTypeCodeList(query) {
  return request({
    url: '/system/container-type-code/list',
    method: 'get',
    params: query
  })
}

// 导出container_type_code Excel
export function exportContainerTypeCodeExcel(query) {
  return request({
    url: '/system/container-type-code/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


export function importTemplate() {
  return request({
    url: '/system/container-type-code/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
