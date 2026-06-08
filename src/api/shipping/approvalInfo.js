import request from '@/utils/request'

// 创建审批流程发起
export function createApprovalInfo(data) {
  return request({
    url: '/shipping/approval-info/create',
    method: 'post',
    data: data
  })
}

// 更新审批流程发起
export function updateApprovalInfo(data) {
  return request({
    url: '/shipping/approval-info/update',
    method: 'put',
    data: data
  })
}

// 创建审批流程发起
export function getApprovalInfoPage(query) {
  return request({
    url: '/shipping/approval-info/getApprovalInfoPage',
    method: 'get',
    params: query
  })
}

// 创建审批流程发起
export function getApprovalInfoNum() {
  return request({
    url: '/shipping/approval-info/getApprovalInfoNum',
    method: 'get',
    XUserInteraction: true
  })
}


// 创建审批流程发起
export function updateStatus(data) {
  return request({
    url: '/shipping/approval-info/updateStatus',
    method: 'put',
    data: data,
  })
}

// 创建审批流程发起
export function getCurrentUserApprovalInfoPage(query) {
  return request({
    url: '/shipping/approval-info/getCurrentUserApprovalInfoPage',
    method: 'get',
    params: query
  })
}

// 创建审批流程发起
export function getApprovalInfoNumByUser() {
  return request({
    url: '/shipping/approval-info/getApprovalInfoNumByUser',
    method: 'get',
    XUserInteraction: true
  })
}

// 创建审批流程发起
export function readLog(data) {
  return request({
    url: '/shipping/approval-info/readLog',
    method: 'put',
    data: data,
  })
}
