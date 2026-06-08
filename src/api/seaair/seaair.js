import request from '@/utils/request'


export function createSeaAirPreAssign(data) {
  return request({
    url: '/pepco/shipping/order/sea-air/pre-assign/create',
    method: 'post',
    data: data
  })
}


export function seaAirPreAssignlistByShippingOrderId(query) {
  return request({
    url: '/shipping/sea-air-booking-transport-leg/list-by-shipping-order-id?shippingOrderId='+query,
    method: 'get'
  })
}

export function seaAirBookingRouterByBookingId(query) {
  return request({
    url: '/shipment/sea-air-booking-router/list-by-booking-id?bookingId='+query,
    method: 'get'
  })
}
// 直接参数放在create shipment的接口 上的字段airLegs
// export function createSeaAirBookingRouter(data) {
//   return request({
//     url: '/shipment/sea-air-booking-router/create',
//     method: 'post',
//     data: data
//   })
// }

export function updateShipmentSeaAirBookingNumber(data) {
  return request({
    url: '/shipment/sea-air-booking-router/updateShipmentSeaAirBookingNumber',
    method: 'post',
    data: data
  })
}

export function updateShipmentSeaAirEventTime(data) {
  return request({
    url: '/shipment/sea-air-booking-router/updateShipmentSeaAirEventTime',
    method: 'post',
    data: data
  })
}

export function seaAirTimeLogListByShipmentId(query) {
  return request({
    url: '/shipment/sea-air-time-log/listByShipmentId',
    method: 'get',
    params: query
  })
}










