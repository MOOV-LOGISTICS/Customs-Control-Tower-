import request from '@/utils/request'

// 创建shipment_rate_surcharge
export function createRateSurcharge(data) {
  return request({
    url: '/booking/rate-surcharge/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_rate_surcharge
export function updateRateSurcharge(data) {
  return request({
    url: '/booking/rate-surcharge/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_rate_surcharge
export function deleteRateSurcharge(id) {
  return request({
    url: '/booking/rate-surcharge/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_rate_surcharge
export function getRateSurcharge(id) {
  return request({
    url: '/booking/rate-surcharge/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_rate_surcharge分页
export function getRateSurchargePage(query) {
  return request({
    url: '/booking/rate-surcharge/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_rate_surcharge Excel
export function exportRateSurchargeExcel(query) {
  return request({
    url: '/booking/rate-surcharge/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
