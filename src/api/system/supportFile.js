import request from '@/utils/request'

// 创建system_support_file
export function createSupportFile(data) {
  return request({
    url: '/system/support-file/create',
    method: 'post',
    data: data
  })
}

// 更新system_support_file
export function updateSupportFile(data) {
  return request({
    url: '/system/support-file/update',
    method: 'put',
    data: data
  })
}
// 更新system_support_file
export function updateSupportFileIgnoreTenant(data) {
  return request({
    url: '/system/support-file/update-ignore-tenant',
    method: 'put',
    data: data
  })
}

// 删除system_support_file
export function deleteSupportFile(id) {
  return request({
    url: '/system/support-file/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_support_file
export function getSupportFile(id) {
  return request({
    url: '/system/support-file/get?id=' + id,
    method: 'get'
  })
}

// 获得system_support_file分页
export function getSupportFilePage(query) {
  return request({
    url: '/system/support-file/page',
    method: 'get',
    params: query
  })
}
export function getSupportFilePageIgnoreTenant(query) {
  return request({
    url: '/system/support-file/page-ignore-tenant',
    method: 'get',
    params: query
  })
}


// 导出system_support_file Excel
export function exportSupportFileExcel(query) {
  return request({
    url: '/system/support-file/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function uploadFile(data) {
  return request({
    url: '/system/support-file/uploadFile',
    method: 'post',
    data: data
  })
}
