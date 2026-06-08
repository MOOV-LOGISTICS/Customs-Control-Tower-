import request from "@/utils/request";

export function detail(query) {
  return request({
    url: "/air/air-booking/detail",
    method: "get",
    params: query,
  });
}

export function getOrderMilestoneOverview(query) {
  return request({
    url: "/air/milestone/overview/po",
    method: "get",
    params: query,
  });
}

export function bookingMilestonePage(query) {
  return request({
    url: '/air/milestone/booking/list/page',
    method: 'get',
    params: query
  })
}

export function milestoneQueryFilterData(query) {
  return request({
    url: '/air/milestone/overview/po/query-filter',
    method: 'get',
    params: query
  })
}

export function airMilestoneMailRemind(query) {
  return request({
    url: '/air/milestone/mail-remind',
    method: 'post',
    params: query
  })
}



export function airBookingPage(query) {
  return request({
    url: '/air/air-booking/list/page',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/air/air-booking/create',
    method: 'post',
    data: data
  })
}

export function airTaskSettingAll(query) {
  return request({
    url: '/air/milestone/task-setting/list',
    method: 'get',
    params: query
  })
}

export function airMilestoneHasPendingTasks() {
  return request({
    url: '/air/milestone/has-pending-tasks',
    method: 'get',
  })
}

export function update(data) {
  return request({
    url: '/air/air-booking/update',
    method: 'put',
    data: data
  })
}


export function completeMilestone(data) {
  return request({
    url: '/air/milestone/complete',
    method: 'post',
    data: data
  })
}

export function updateEventTime(data) {
  return request({
    url: '/air/air-booking/update-event-time',
    method: 'post',
    data: data
  })
}

export function confirmation(data) {
  return request({
    url: '/air/air-booking/confirmation',
    method: 'post',
    data: data
  })
}

export function departurePol(data) {
  return request({
    url: '/air/air-booking/departure-pol',
    method: 'post',
    data: data
  })
}

export function cancel(data) {
  return request({
    url: '/air/air-booking/cancel',
    method: 'post',
    data: data
  })
}


export function addRemoveShipping(data) {
  return request({
    url: '/air/air-booking/add-remove-shipping',
    method: 'post',
    data: data
  })
}



export function milestoneDetail(milestoneId) {
  return request({
    url: '/air/milestone/detail?milestoneId=' + milestoneId,
    method: 'get'
  })
}

export function shippingMilestoneAggregate(milestoneId) {
  return request({
    url: '/air/milestone/detail/shipping?milestoneId=' + milestoneId,
    method: 'get'
  })
}


export function commentCreate(data) {
  return request({
    url: '/air/air-booking/comments/create',
    method: 'post',
    data: data
  })
}

export function findCommentsList(query) {
  return request({
    url: '/air/air-booking/comments/list',
    method: 'get',
    params: query
  })
}

export function milestoneListByPo(orderId) {
  return request({
    url: '/air/milestone/list-by-po?orderId=' + orderId,
    method: 'get'
  })
}

export function getAirTaskNamesMap() {
  return request({
    url: '/air/milestone/all-task-name',
    method: 'get',
  })
}


export function filterData(query) {
  return request({
    url: "/air/air-booking/filter-data",
    method: "get",
    params: query,
  });
}

export function reportData(query) {
  return request({
    url: "/air/air-booking/summary-data",
    method: "get",
    params: query,
  });
}

export function bookingOrderData(query) {
  return request({
    url: "/air/air-booking/booking-order-data",
    method: "get",
    params: query,
  });
}

export function noBookingShippingPage(query) {
  return request({
    url: '/air/air-booking/no-booking-shipping-order-page',
    method: 'get',
    params: query
  })
}


export function shippingPoStatus(shippingOrderId) {
  return request({
    url: '/air/air-booking/shipping-po-status?shippingOrderId=' + shippingOrderId,
    method: 'get'
  })
}

// 根据orderid获取文件
export function reSaveFile(data) {
  return request({
    url: '/air/base-data/order-file/re-save',
    method: 'post',
    params: data
  })
}

export function arrivalPod(data) {
  return request({
    url: '/air/air-booking/destination-event',
    method: 'post',
    data: data
  })
}