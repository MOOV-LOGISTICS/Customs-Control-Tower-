import request from "@/utils/request";

function removePO(params) {
  return request({
    url: '/order/dataMaintenance/remove/po',
    method: 'post',
    data: params
  })
}

function removeShipperBooking(params) {
  return request({
    url: '/order/dataMaintenance/remove/shipperBooking',
    method: 'post',
    data: params
  })
}

function addPO(params) {
  return request({
    url: '/order/dataMaintenance/add/po',
    method: 'post',
    data: params
  })
}

function addShipperBooking(params) {
  return request({
    url: '/order/dataMaintenance/add/addShipperBooking',
    method: 'post',
    data: params
  })
}

function getShippingOrderPage(params) {
  return request({
    url: '/shipping/order/getShippingOrderPage',
    method: 'get',
    params: params
  })
}

function getPOsByShippingId(params) {
  return request({
    url: '/order/header/getPOsByShippingId',
    method: 'get',
    params: params
  })
}

function getOrderHeaderPage(params) {
  return request({
    url: '/order/header/getOrderHeaderPage',
    method: 'get',
    params: params
  })
}

function getShipmentPage(params) {
  return request({
    url: '/shipment/api/getShipmentPage',
    method: 'get',
    params: params
  })
}

function getShippingOrderListByShipmentId(params) {
  return request({
    url: '/shipping/order/getShippingOrderListByShipmentId',
    method: 'get',
    params: params
  })
}

export {
  removePO,
  removeShipperBooking,
  addPO,
  addShipperBooking,
  getShippingOrderPage,
  getPOsByShippingId,
  getOrderHeaderPage,
  getShipmentPage,
  getShippingOrderListByShipmentId
}
