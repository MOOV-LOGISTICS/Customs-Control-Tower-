import request from '@/utils/request'

// shipping order page
export function shippingOrderPage(query) {
  return request({
    url: '/pepco/shipping/order/list/page/new',
    method: 'get',
    params: query
  })
}

// 创建shipping order
export function createShippingOrder(data) {
  return request({
    url: '/pepco/shipping/order/create',
    method: 'post',
    data: data
  })
}

// 创建shipping order
export function updateShippingOrder(data) {
  return request({
    url: '/pepco/shipping/order/update',
    method: 'post',
    data: data
  })
}


// update shipping order status batch
export function updateShippingOrderStatusBatch(data) {
  return request({
    url: '/pepco/shipping/order/update/status/batch',
    method: 'post',
    data: data
  })
}

// 获得papco shipping order分页
export function getOrderShipmentPage(query) {
  return request({
    url: '/pepco/shipping/order/page',
    method: 'get',
    params: query
  })
}

// 获得pepco shipping order list分页
export function getOrderListShipmentPage(query) {
  return request({
    url: '/pepco/shipping/order/list/page',
    method: 'get',
    params: query
  })
}

export function getDetails(query) {
  return request({
    url: '/pepco/shipping/order/details',
    method: 'get',
    params: query
  })
}



// 查询导出进度
export function getExportProgress(query) {
  return request({
    url: '/pepco/shipping/order/progress',
    method: 'get',
    params: query,
  })
}
export function clearExportProgress(query) {
  return request({
    url: '/pepco/shipping/order/remove/progress',
    method: 'get',
    params: query,
  })
}
//创建导出
export function createExportTask(query) {
  return request({
    url: '/pepco/shipping/order/export-excel-task',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1800000'
  })
}

export function downloadExcel(query) {
  return request({
    url: '/pepco/shipping/order/download-excel',
    method: 'post',
    params: query
  })
}

// Pepco: 获取order关联的shipper booking下的所有order
export function getSoRelatedPo(query) {
  return request({
    url: '/pepco/shipping/order/po-related-so',
    method: 'get',
    params: query
  })
}


export function updateShippingOrderStatus(data) {
  return request({
    url: '/pepco/shipping/order/updateShippingOrderStatus',
    method: 'post',
    data: data
  })
}

// 更新shipping order 的状态 为 SAApproval
export function updateShippingOrderStatusToSaApproved(data) {
  return request({
    url: '/pepco/shipping/order/criteria/approval',
    method: 'post',
    data: data
  })
}

// 创建booking_pre_assgin
export function createPreAssign(data) {
  return request({
    url: '/pepco/shipping/order/pre-assign/create',
    method: 'post',
    data: data
  })
}

export function getPoRelatedOrderFile(query) {
  return request({
    url: '/pepco/shipping/order/shipping-documents',
    method: 'get',
    params: query
  })
}

export function getPoRelatedOrderFileById(query) {
  return request({
    url: '/pepco/shipping/order/shipping-documents-by-id',
    method: 'get',
    params: query
  })
}


export function getBookingScoreData(data) {
  return request({
    url: '/pepco/shipping/order/booking-score',
    method: 'post',
    data: data
  })
}


export function saveBookingScore(data) {
  return request({
    url: '/pepco/shipping/order/booking-score/save',
    method: 'post',
    data: data
  })
}


export function getShipmentOrderItemList(query) {
  return request({
    url: '/pepco/shipping/order/order-item',
    method: 'get',
    params: query
  })
}




/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getPoRelatedSoByOrderId(query) {
  return request({
    url: '/pepco/shipping/order/po-related-so',
    method: 'get',
    params: query
  })
}

// 获取shipping order approval criteria
export function getShippingCriteria(query) {
  return request({
    url: '/pepco/shipping/order/criteria',
    method: 'get',
    params: query
  })
}

// 判断是否需要手动调整approval
export function isNeedManualAdjust(query) {
  return request({
    url: '/pepco/shipping/order/criteria/manual_adjust',
    method: 'get',
    params: query
  })
}

// 更新shipping order criteria pol
export function updateSoCriteriaPol(data) {
  return request({
    url: '/pepco/shipping/order/criteria/pol',
    method: 'post',
    data: data
  })
}

/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getOrderHeaderList(query) {
  return request({
    url: '/pepco/shipping/order/order-list',
    method: 'get',
    params: query
  })
}

/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getOrderHeadersList(query) {
  return request({
    url: '/pepco/shipping/order/order-lists',
    method: 'get',
    params: query
  })
}


/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getShippingOrderDetail(query) {
  return request({
    url: '/pepco/shipping/order/detail',
    method: 'get',
    params: query
  })
}

// 获得booking score分页
export function getBookingScorePage(query) {
  return request({
    url: '/pepco/shipping/order/booking-score/page',
    method: 'get',
    params: query
  })
}

// 获得shipment page分页
export function getShipmentPage(query) {
  return request({
    url: '/pepco/shipping/order/shipment/page',
    method: 'get',
    params: query
  })
}

// 获得shipping page分页
export function getShippingOrderPage(query) {
  return request({
    url: '/pepco/shipping/order/shipping-page',
    method: 'get',
    params: query
  })
}


export function getShippingOrderItemList(query) {
  return request({
    url: '/pepco/shipping/order/shipping-item',
    method: 'get',
    params: query
  })
}

//根据order_number在表shipment_order_item中获取shipment_id,同时表shipment_order_item存储了order_id和so_id
export function getCustomsBrokerAssignedData(data) {
  return request({
    url: '/pepco/shipping/order/customs-broker-assigned-data',
    method: 'post',
    data: data
  })
}

//根据order_number获取broker
export function getCustomsBrokerData(orderNumberList) {
  return request({
    url: '/pepco/shipping/order/customs-broker-data',
    method: 'post',
    data: orderNumberList
  })
}

//Customs Broker Assigned submit 按钮 写入记录表数据
export function saveCustomsBrokerAssigned(data, broker) {
  return request({
    url: '/pepco/shipping/order/save-customs-broker-assigned',
    method: 'post',
    data: data,
    params: { 'broker': broker }
  })
}

//Customs Broker Assigned 查看按钮
export function getBrokerLogByOrderNumber(orderNumber) {
  return request({
    url: '/pepco/shipping/order/get-broker-log-by-order-number',
    method: 'get',
    params: { 'orderNumber': orderNumber }
  })
}


export function getSameOrderTask(query) {
  return request({
    url: '/pepco/shipping/order/same-order-task',
    method: 'get',
    params: query
  })
}

/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getOrderHeaderListByShipmentId(query) {
  return request({
    url: '/pepco/shipping/order/orders',
    method: 'get',
    params: query
  })
}

//根据shippingOrderId 获取file
export function getFileByShipmentId(query) {
  return request({
    url: '/pepco/shipping/order/get-file-by-shipping-order-id',
    method: 'get',
    params: query
  })
}

export function getBrokerShippingOrderPage(query) {
  return request({
    url: '/pepco/shipping/order/broker-shipping-page',
    method: 'get',
    params: query
  })
}

export function importBookingScore() {
  return request({
    url: '/pepco/shipping/order/import-booking-score',
    method: 'get',
    responseType: 'blob'
  })
}
// 导出po
export function exportBookingScoreTemplate(query) {
  return request({
    url: '/pepco/shipping/order/download-booking-score-template',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function groupByPOLAndPOD(query) {
  return request({
    url: '/pepco/shipping/order/groupByPOLAndPOD',
    method: 'get',
    params: query
  })
}

export function importBookingScoreData() {
  return request({
    url: '/pepco/shipping/order/import-booking-score-data',
    method: 'get',
    responseType: 'blob'
  })
}
// 导出po
export function exportBookingScoreData(query) {
  return request({
    url: '/pepco/shipping/order/download-booking-score',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getShippingOrderListByShipmentId(query) {
  return request({
    url: '/pepco/shipping/order/get-shipping-orders-by-shipmentId',
    method: 'get',
    params: query
  })
}

export function getShippingOrderListByBookingNumber(query) {
  return request({
    url: '/pepco/shipping/order/get-shipping-orders-by-bookingNumber',
    method: 'post',
    data: query
  })
}

export function updateShippingRelationshipToNewShipment(data) {
  return request({
    url: '/pepco/shipping/order/updateShippingRelationshipToNewShipment',
    method: 'post',
    data: data
  })
}


export function getShipmentOrderItemForOrderNumber(query) {
  return request({
    url: '/pepco/shipping/order/shipment-item',
    method: 'get',
    params: query
  })
}


export function getOrderComment(query) {
  return request({
    url: '/pepco/shipping/order/get-order-comment',
    method: 'get',
    params: query
  })
}

export function orderCommentCreate(data) {
  return request({
    url: '/pepco/shipping/order/create-order-comment',
    method: 'post',
    data: data
  })
}

export function getPoStatusByShippingId(query) {
  return request({
    url: '/pepco/shipping/order/getPoStatusByShippingId?shippingId=' + query,
    method: 'get'
  })
}


export function getShippingQueryFilter() {
  return request({
    url: '/pepco/shipping/order/filter-data',
    method: 'get'
  })
}


export function updateShippingOrderAllCrd(data) {
  return request({
    url: '/pepco/shipping/order/updateAllCRD',
    method: 'post',
    data: data
  })
}


/**
 * 获取po关联的shipping order(含有shipping order的所有po)
 *
 * @param {*} query
 * @returns
 */
export function getOrderHeaderListByQuery(query) {
  return request({
    url: '/pepco/shipping/order/order-list-by-query',
    method: 'get',
    params: query
  })
}


// 获得shipping order transport-plan
export function getPreAssignData(id) {
  return request({
    url: '/pepco/shipping/order/pre-assign/list?id=' + id,
    method: 'get'
  })
}

//新增 短期dc数据原因的日志
export function createDcDataLog(data) {
  return request({
    url: '/pepco/shipping/order/create-dc-data-log',
    method: 'post',
    data: data
  })
}

//获取短期dc数据的原因日志
export function getDcReasonLogs(query) {
  return request({
    url: '/pepco/shipping/order/get-dc-data-log-list',
    method: 'get',
    params: query
  })
}

export function getShippingOrderOptions() {
  return request({
    url: '/pepco/shipping/getShippingOrderOptions',
    method: 'get'
  })
}

export function getRelatedShippingItemsByOrderId(query) {
  return request({
    url: '/pepco/shipping/order/getRelatedShippingItemsByOrderId',
    method: 'get',
    params: query
  })
}

// 更新shipping order po approval 之后判断是否
export function updateBookingApprovalAfterPerPo(shippingOrderId) {
  return request({
    url: '/pepco/shipping/order/criteria/approval-auto-after-per-po?shippingOrderId=' + shippingOrderId,
    method: 'put',
  })
}

// shipping order po approval milestone状态
export function shippingApprovalStatus(query) {
  return request({
    url: '/pepco/shipping/order/shipping-approval-status',
    method: 'get',
    params: query
  })
}

// 更新shipping order po approval 之后判断是否
export function pepcoRejectPoFromShipping(params) {
  return request({
    url: '/pepco/shipping/order/criteria/reject-po',
    method: 'post',
    params: params
  })
}

export function downloadShippingExcel(params) {
  return request({
    url: '/pepco/shipping/downloadShippingExcel',
    method: 'get',
    params: params,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getShippingPage(params) {
  return request({
    url: '/pepco/shipping/v2/list/page',
    method: 'get',
    params: params
  })
}

export function getShippingOrderInfoById(params) {
  return request({
    url: '/pepco/shipping/getShippingOrderInfoById',
    method: 'get',
    params: params
  })
}

export function getOrderHeadersByShippingId(params) {
  return request({
    url: '/order/header/getOrderHeadersByShippingId',
    method: 'get',
    params: params
  })
}
