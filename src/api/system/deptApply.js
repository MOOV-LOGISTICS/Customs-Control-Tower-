import request from '@/utils/request'

// 创建申请新部门
export function createDeptApply(data) {
  return request({
    url: '/system/dept-apply/create',
    method: 'post',
    data: data
  })
}

// 更新申请新部门
export function updateDeptApply(data) {
  return request({
    url: '/system/dept-apply/update',
    method: 'put',
    data: data
  })
}

// 删除申请新部门
export function deleteDeptApply(id) {
  return request({
    url: '/system/dept-apply/delete?id=' + id,
    method: 'delete'
  })
}

// 获得申请新部门
export function getDeptApply(id) {
  return request({
    url: '/system/dept-apply/get?id=' + id,
    method: 'get'
  })
}

// 获得申请新部门分页
export function getDeptApplyPage(query) {
  return request({
    url: '/system/dept-apply/page',
    method: 'get',
    params: query
  })
}

// 导出申请新部门 Excel
export function exportDeptApplyExcel(query) {
  return request({
    url: '/system/dept-apply/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
