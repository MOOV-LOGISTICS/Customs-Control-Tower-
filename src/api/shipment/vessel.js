import request from '@/utils/request'

// 创建shipment_vessel
export function createVessel(data) {
  return request({
    url: '/shipment/vessel/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_vessel
export function updateVessel(data) {
  return request({
    url: '/shipment/vessel/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_vessel
export function deleteVessel(id) {
  return request({
    url: '/shipment/vessel/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_vessel
export function getVessel(id) {
  return request({
    url: '/shipment/vessel/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_vessel分页
export function getVesselPage(query) {
  return request({
    url: '/shipment/vessel/page',
    method: 'get',
    params: query
  })
}

export function exportVesselListByCondition(query) {
  return request({
    url: '/shipment/vessel/listByCondition',
    method: 'get',
    params: query
  })
}
