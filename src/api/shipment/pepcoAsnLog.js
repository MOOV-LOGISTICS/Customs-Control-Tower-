import request from '@/utils/request'

// 创建pepco_asn_log
export function createPepcoAsnLog(data) {
  return request({
    url: '/shipment/pepco-asn-log/create',
    method: 'post',
    data: data
  })
}

// 更新pepco_asn_log
export function updatePepcoAsnLog(data) {
  return request({
    url: '/shipment/pepco-asn-log/update',
    method: 'put',
    data: data
  })
}

// 删除pepco_asn_log
export function deletePepcoAsnLog(id) {
  return request({
    url: '/shipment/pepco-asn-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得pepco_asn_log
export function getPepcoAsnLog(id) {
  return request({
    url: '/shipment/pepco-asn-log/get?id=' + id,
    method: 'get'
  })
}

// 获得pepco_asn_log分页
export function getPepcoAsnLogPage(query) {
  return request({
    url: '/shipment/pepco-asn-log/page',
    method: 'get',
    params: query
  })
}

// 导出pepco_asn_log Excel
export function exportPepcoAsnLogExcel(query) {
  return request({
    url: '/shipment/pepco-asn-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
