import request from '@/utils/request'

export function taskSettingAll() {
  return request({
    url: '/pepco/milestone/task-setting/all',
    method: 'get'
  })
}

export function milestonePage(query) {
  return request({
    url: '/pepco/milestone/list/page',
    method: 'get',
    params: query
  })
}

export function milestoneOverview(query) {
  return request({
    url: '/pepco/milestone/overview/po',
    method: 'get',
    params: query
  })
}

export function getOrderMilestoneOverview(query) {
  return request({
    url: '/pepco/milestone/overview/shipping',
    method: 'get',
    params: query
  })
}

export function shipmentOverview(query) {
  return request({
    url: '/pepco/milestone/overview/shipment',
    method: 'get',
    params: query
  })
}

export function shippingMilestoneAggregate(milestoneId) {
  return request({
    url: '/pepco/milestone/detail/shipping',
    method: 'get',
    params: { milestoneId }
  })
}

export function shipmentMilestoneAggregate(milestoneId) {
  return request({
    url: '/pepco/milestone/detail/shipment',
    method: 'get',
    params: { milestoneId }
  })
}

export function completeMilestone(data) {
  return request({
    url: '/pepco/milestone/complete',
    method: 'post',
    data: data
  })
}

export function completeMilestoneBatch(data) {
  return request({
    url: '/pepco/milestone/complete/batch',
    method: 'post',
    data: data
  })
}

export function restartMilestone(milestoneId, note) {
  return request({
    url: '/pepco/milestone/restart',
    method: 'post',
    params: { milestoneId, note }
  })
}

export function mailRemind(data) {
  return request({
    url: '/pepco/milestone/mail-remind',
    method: 'post',
    params: data
  })
}

export function generateMilestoneAll() {
  return request({
    url: '/pepco/milestone/generate/all',
    method: 'post'
  })
}

export function generateMilestone(shippingOrderRef) {
  return request({
    url: '/pepco/milestone/test/generate/one',
    method: 'post',
    params: { shippingOrderRef }
  })
}

export function refreshFlowStatus() {
  return request({
    url: '/pepco/milestone/test/refresh/flow-status',
    method: 'post'
  })
}

export function refreshMilestoneInfo(shippingOrderRef) {
  return request({
    url: '/pepco/milestone/test/refresh/info',
    method: 'post',
    params: { shippingOrderRef }
  })
}



export function preAlertDetail(orderNumber) {
  return request({
    url: '/pepco/shipping/milestone/pre-alert/detail',
    method: 'get',
    params: { orderNumber }
  })
}

export function seaAirPreAlertDetail(shipmentId) {
  return request({
    url: '/pepco/shipping/milestone/sea-air/pre-alert/detail',
    method: 'get',
    params: { shipmentId }
  })
}

// 下载milestone数据
export function exportOrderMilestoneData(query) {
  return request({
    url: '/pepco/milestone/list/download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

export function exportCargoInboundTemplate(query) {
  return request({
    url: '/pepco/milestone/handle/cargo-inbound/download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

export function milestoneQueryFilterData(query) {
  return request({
    url: '/pepco/milestone/overview/shipping/query-filter',
    method: 'get',
    params: query
  })
}

export function milestoneOrderCountData(query) {
  return request({
    url: '/pepco/milestone/overview/shipping/order-count',
    method: 'get',
    params: query
  })
}
export function milestoneMailRemind(query) {
  return request({
    url: '/pepco/milestone/mail-remind',
    method: 'post',
    params: query
  })
}


export function downloadShippingOrderData(query) {
  return request({
    url: '/pepco/shipping/milestone/download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

