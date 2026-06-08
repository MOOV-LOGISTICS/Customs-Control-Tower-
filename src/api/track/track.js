import request from '@/utils/request'

export function getVessels(query) {
  return request({
    url: '/v1/track/ship',
    method: 'get',
    params: query
  })
}


export function pepcoTracking(data) {
  return request({
    url: '/shipment/tracking/track',
    method: 'post',
    data: data
  })
}
