import request from '@/utils/request'

// 创建party table
export function createSubDept(data) {
  return request({
    url: '/system/sub-dept/create',
    method: 'post',
    data: data
  })
}

// 更新party table
export function updateSubDept(data) {
  return request({
    url: '/system/sub-dept/update',
    method: 'put',
    data: data
  })
}

// 删除party table
export function deleteSubDept(id) {
  return request({
    url: '/system/sub-dept/delete?id=' + id,
    method: 'delete'
  })
}

// 获得party table
export function getSubDept(id) {
  return request({
    url: '/system/sub-dept/get?id=' + id,
    method: 'get'
  })
}

export function listSubDeptByUserId() {
  return request({
    url: '/system/sub-dept/listSubDeptByUserId',
    method: 'get'
  })
}


// 获得party table分页
export function getSubDeptPage(query) {
  return request({
    url: '/system/sub-dept/page',
    method: 'get',
    params: query
  })
}

// 导出party table Excel
export function exportSubDeptExcel(query) {
  return request({
    url: '/system/sub-dept/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
