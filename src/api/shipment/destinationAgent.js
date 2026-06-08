import request from '@/utils/request'

// 创建shipment_destination_agent
export function createDestinationAgent(data) {
  return request({
    url: '/shipment/destination-agent/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_destination_agent
export function updateDestinationAgent(data) {
  return request({
    url: '/shipment/destination-agent/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_destination_agent
export function deleteDestinationAgent(id) {
  return request({
    url: '/shipment/destination-agent/delete?id=' + id,
    method: 'delete'
  })
}
// 获得shipment_destination_agent
export function getDestinationAgentByShipmentId(id) {
  return request({
    url: '/shipment/destination-agent/getByShipmentId?id=' + id,
    method: 'get'
  })
}
// 获得shipment_destination_agent
export function getDestinationAgent(id) {
  return request({
    url: '/shipment/destination-agent/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_destination_agent分页
export function getDestinationAgentPage(query) {
  return request({
    url: '/shipment/destination-agent/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_destination_agent Excel
export function exportDestinationAgentExcel(query) {
  return request({
    url: '/shipment/destination-agent/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function sendMail(data) {
  return request({
    url: '/shipment/destination-agent/sendMail',
    method: 'post',
    data: data
  })
}