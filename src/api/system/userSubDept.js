import request from '@/utils/request'

// 创建system_user_sub_dept
export function createUserSubDept(data) {
  return request({
    url: '/system/user-sub-dept/create',
    method: 'post',
    data: data
  })
}

// 更新system_user_sub_dept
export function updateUserSubDept(data) {
  return request({
    url: '/system/user-sub-dept/update',
    method: 'put',
    data: data
  })
}

// 删除system_user_sub_dept
export function deleteUserSubDept(id) {
  return request({
    url: '/system/user-sub-dept/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_user_sub_dept
export function getUserSubDept(id) {
  return request({
    url: '/system/user-sub-dept/get?id=' + id,
    method: 'get'
  })
}

// 获得system_user_sub_dept分页
export function getUserSubDeptPage(query) {
  return request({
    url: '/system/user-sub-dept/page',
    method: 'get',
    params: query
  })
}

// 导出system_user_sub_dept Excel
export function exportUserSubDeptExcel(query) {
  return request({
    url: '/system/user-sub-dept/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
