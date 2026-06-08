import request from '@/utils/request'

// 创建system_traking_setting
export function createContainerTrackSetting(data) {
  return request({
    url: '/system/container-track-setting/create',
    method: 'post',
    data: data
  })
}

// 更新system_traking_setting
export function updateContainerTrackSetting(data) {
  return request({
    url: '/system/container-track-setting/update',
    method: 'put',
    data: data
  })
}

// 删除system_traking_setting
export function deleteContainerTrackSetting(id) {
  return request({
    url: '/system/container-track-setting/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_traking_setting
export function getContainerTrackSetting(id) {
  return request({
    url: '/system/container-track-setting/get?id=' + id,
    method: 'get'
  })
}

// 获得system_traking_setting分页
export function getContainerTrackSettingPage(query) {
  return request({
    url: '/system/container-track-setting/page',
    method: 'get',
    params: query
  })
}

// 导出system_traking_setting Excel
export function exportContainerTrackSettingExcel(query) {
  return request({
    url: '/system/container-track-setting/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
