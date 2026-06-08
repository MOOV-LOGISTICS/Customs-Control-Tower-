import request from '@/utils/request'

// 创建shipping order
export function createOrder(data) {
  return request({
    url: '/shipping/order/create',
    method: 'post',
    data: data
  })
}

export function updateShippingRelationship(data) {
  return request({
    url: '/shipping/order/updateShippingRelationship',
    method: 'post',
    data: data
  })
}

export function updatePepcoShippingRelationship(data) {
  return request({
    url: '/shipping/order/pepco/updateShippingRelationship',
    method: 'post',
    data: data
  })
}

// 更新shipping order
export function updateOrder(data) {
  return request({
    url: '/shipping/order/update',
    method: 'put',
    data: data
  })
}

export function draftOrder(data) {
  return request({
    url: '/shipping/order/draftOrder',
    method: 'put',
    data: data
  })
}

// 删除shipping order
export function deleteOrder(id) {
  return request({
    url: '/shipping/order/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipping order
export function getOrder(id) {
  return request({
    url: '/shipping/order/get?id=' + id,
    method: 'get'
  })
}

// 导出Pepco Shipper Booking Detail
export function exportOrderDetail(data) {
  return request({
    url: '/shipping/order/export-detail',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: '1800000'
  })
}

// 获得shipping order分页
export function getShippingOrderListByIds(ids) {
  return request({
    url: '/shipping/order/list?ids=' + ids,
    method: 'get'
  })
}

// 根据shipmentId获得shipping order
export function getShippingOrderByShipment(id) {
  return request({
    url: '/shipping/order/getShippingOrderByShipment?id=' + id,
    method: 'get'
  })
}


export function getNotShipmentOrderPage(query) {
  return request({
    url: '/shipping/order/getNotShipmentOrderPage',
    method: 'get',
    params: query
  })
}


// 获得shipping order分页
export function getOrderPage(query) {
  return request({
    url: '/shipping/order/page',
    method: 'get',
    params: query
  })
}

// 获得shipping order分页
export function getOrderShipmentPage(query) {
  return request({
    url: '/shipping/order/getOrderShipmentPage',
    method: 'get',
    params: query
  })
}

export function countShippingOrderShipment() {
  return request({
    url: '/shipping/order/countShippingOrderShipment',
    method: 'get'
  })
}

// 导出shipping order Excel
export function exportOrderExcel(query) {
  return request({
    url: '/shipping/order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function updateShippingOrderStatus(data) {
  return request({
    url: '/shipping/order/updateShippingOrderStatus',
    method: 'post',
    data: data
  })
}

// 根据shipmentId获得shipping order
export function getCustomerList(id) {
  return request({
    url: '/shipping/order/getCustomerList',
    method: 'get'
  })
}

export function cancelShippingOrder(id) {
  return request({
    url: '/shipping/order/cancelShippingOrder?id=' + id,
    method: 'get'
  })
}

export function cancelPepcoShippingOrder(id) {
  return request({
    url: '/shipping/order/pepco/cancel-shipping-order?id=' + id,
    method: 'get'
  })
}

export function readStatus(id) {
  return request({
    url: '/shipping/order/readStatus?id=' + id,
    method: 'get'
  })
}

export function getPartiesList() {
  return request({
    url: '/shipping/order/getPartiesList',
    method: 'get'
  })
}

export function uploadShippingFile(data) {
  return request({
    url: '/shipping/order/uploadShippingFile',
    method: 'post',
    data: data
  })
}

export function downloadShippingOrderTemplate(query) {
  return request({
    url: '/shipping/order/downloadShippingOrderTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


export function getOrderReportData() {
  return request({
    url: '/shipping/order/getOrderReportData',
    method: 'get'
  })
}

export function shippingReport(data) {
  return request({
    url: '/shipping/order/shippingReport',
    method: 'get',
    params: data
  })
}

//根据so_id判断当前数据时候已经Cancel或者Amend避免重复操作
export function isCancelOrAmend(id) {
  return request({
    url: '/shipping/order/is-cancel-or-amend?id=' + id,
    method: 'get'
  })
}

//根据soId加载cancel或amend历史数据
export function getApprovalInfoBySoId(id) {
  return request({
    url: '/shipping/order/get-approval-info?id=' + id,
    method: 'get'
  })
}

export function getShippingDraftHblDate(params) {
  return request({
    url: '/shipping/order/getShippingDraftHblDate',
    method: 'get',
    params: params
  })
}

export function submitOverdueBookedETD(params) {
  return request({
    url: '/shipping/shipperBooking/submitOverdueBookedETD',
    method: 'post',
    data: params
  })
}

export function getOverdueBookedETD(params) {
  return request({
    url: '/shipping/shipperBooking/getOverdueBookedETD',
    method: 'get',
    params: params
  })
}

export function getOrderListByShippingId(params) {
  return request({
    url: '/shipping/shipperBooking/getOrderListByShippingId',
    method: 'get',
    params: params
  })
}
