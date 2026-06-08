import request from '@/utils/request'

// 创建shipment_clp_detail
export function createClpDetail(data) {
  return request({
    url: '/shipment/clp-detail/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_clp_detail
export function updateClpDetail(data) {
  return request({
    url: '/shipment/clp-detail/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_clp_detail
export function deleteClpDetail(id) {
  return request({
    url: '/shipment/clp-detail/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_clp_detail
export function getClpDetail(id) {
  return request({
    url: '/shipment/clp-detail/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_clp_detail分页
export function getClpDetailPage(query) {
  return request({
    url: '/shipment/clp-detail/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_clp_detail Excel
export function exportClpDetailExcel(query) {
  return request({
    url: '/shipment/clp-detail/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
