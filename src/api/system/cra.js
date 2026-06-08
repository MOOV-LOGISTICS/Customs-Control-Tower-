import request from '@/utils/request'

// 创建CRA
export function createCra(data) {
  return request({
    url: '/shipment/cra/create',
    method: 'post',
    data: data
  })
}

// 更新CRA
export function updateCra(data) {
  return request({
    url: '/shipment/cra/update',
    method: 'put',
    data: data
  })
}

// 删除CRA
export function deleteCra(id) {
  return request({
    url: '/shipment/cra/delete?id=' + id,
    method: 'delete'
  })
}

// 获得CRA
export function getCra(id) {
  return request({
    url: '/shipment/cra/get?id=' + id,
    method: 'get'
  })
}

// 获得CRA分页
export function getCraPage(query) {
  return request({
    url: '/shipment/cra/page',
    method: 'get',
    params: query
  })
}

// 导出CRA Excel
export function exportCraExcel(query) {
  return request({
    url: '/shipment/cra/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
