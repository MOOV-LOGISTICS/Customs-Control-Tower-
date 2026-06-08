import request from '@/utils/request'

// 创建shipment_places
export function createPlaces(data) {
  return request({
    url: '/shipment/places/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_places
export function updatePlaces(data) {
  return request({
    url: '/shipment/places/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_places
export function deletePlaces(id) {
  return request({
    url: '/shipment/places/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_places
export function getPlaces(id) {
  return request({
    url: '/shipment/places/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_places分页
export function getPlacesPage(query) {
  return request({
    url: '/shipment/places/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_places Excel
export function placesListByCondition(query) {
  return request({
    url: '/shipment/places/listByCondition',
    method: 'get',
    params: query,
  })
}
