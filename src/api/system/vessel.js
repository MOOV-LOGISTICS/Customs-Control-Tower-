import request from '@/utils/request'

// 创建vessel_code_name
export function createVessel(data) {
  return request({
    url: '/system/vessel/create',
    method: 'post',
    data: data
  })
}

// 更新vessel_code_name
export function updateVessel(data) {
  return request({
    url: '/system/vessel/update',
    method: 'put',
    data: data
  })
}

// 删除vessel_code_name
export function deleteVessel(id) {
  return request({
    url: '/system/vessel/delete?id=' + id,
    method: 'delete'
  })
}

// 获得vessel_code_name
export function getVessel(id) {
  return request({
    url: '/system/vessel/get?id=' + id,
    method: 'get'
  })
}

// 获得vessel_code_name分页
export function getVesselPage(query) {
  return request({
    url: '/system/vessel/page',
    method: 'get',
    params: query
  })
}

export function getVesselList(query) {
  return request({
    url: '/system/vessel/list',
    method: 'get',
    params: query
  })
}

// 导出vessel_code_name Excel
export function exportVesselExcel(query) {
  return request({
    url: '/system/vessel/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function importTemplate() {
  return request({
    url: '/system/vessel/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
