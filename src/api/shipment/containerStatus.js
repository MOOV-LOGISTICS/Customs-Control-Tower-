import request from '@/utils/request'

// 创建shipment_contianer_status
export function createContainerStatus(data) {
  return request({
    url: '/shipment/container-status/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_contianer_status
export function updateContainerStatus(data) {
  return request({
    url: '/shipment/container-status/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_contianer_status
export function deleteContainerStatus(id) {
  return request({
    url: '/shipment/container-status/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_contianer_status
export function getContainerStatus(id) {
  return request({
    url: '/shipment/container-status/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_contianer_status分页
export function getContainerStatusPage(query) {
  return request({
    url: '/shipment/container-status/page',
    method: 'get',
    params: query
  })
}

export function containerStatusListByCondition(query) {
  return request({
    url: '/shipment/container-status/listByCondition',
    method: 'get',
    params: query
  })
}
