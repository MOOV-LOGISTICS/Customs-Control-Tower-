import request from '@/utils/request'

// 创建system task setting
export function createTaskSetting(data) {
  return request({
    url: '/system/task-setting/create',
    method: 'post',
    data: data
  })
}

// 更新system task setting
export function updateTaskSetting(data) {
  return request({
    url: '/system/task-setting/update',
    method: 'put',
    data: data
  })
}

// 删除system task setting
export function deleteTaskSetting(id) {
  return request({
    url: '/system/task-setting/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system task setting
export function getTaskSetting(id) {
  return request({
    url: '/system/task-setting/get?id=' + id,
    method: 'get'
  })
}

// 获得system task setting分页
export function getTaskSettingPage(query) {
  return request({
    url: '/system/task-setting/page',
    method: 'get',
    params: query
  })
}

// 导出system task setting Excel
export function exportTaskSettingExcel(query) {
  return request({
    url: '/system/task-setting/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
