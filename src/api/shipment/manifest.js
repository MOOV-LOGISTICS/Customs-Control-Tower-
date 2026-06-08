import request from '@/utils/request'

// 创建shipment_manifest
export function createManifest(data) {
  return request({
    url: '/shipment/manifest/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_manifest
export function updateManifest(data) {
  return request({
    url: '/shipment/manifest/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_manifest
export function deleteManifest(id) {
  return request({
    url: '/shipment/manifest/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_manifest
export function getManifest(id) {
  return request({
    url: '/shipment/manifest/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_manifest分页
export function getManifestPage(query) {
  return request({
    url: '/shipment/manifest/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_manifest Excel
export function exportManifestExcel(query) {
  return request({
    url: '/shipment/manifest/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
