import request from '@/utils/request'

export function getCurrentUserVesselAndYoyageOptions(vessel) {
  return request({
    url: '/shipment/router/getCurrentUserVesselAndYoyageOptions?vessel='+vessel,
    method: 'get'
  })
}
