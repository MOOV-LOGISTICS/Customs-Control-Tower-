import request from '@/utils/request'

// 分页查询
export function getXmlCheckPage(query) {
  return request({
    url: '/xmlcheck/page',
    method: 'get',
    params: query
  })
}

// 查询字典信息
export function getSearchDic(query) {
  return request({
    url: '/xmlcheck/search/dic',
    method: 'get',
    params: query
  })
}

// 查询change详情
export function getCheckDetails(query) {
  return request({
    url: '/xmlcheck/change/detail/list',
    method: 'get',
    params: query
  })
}

// 查询change log列表
export function getXmlChangeLogList(query) {
  return request({
    url: '/xmlcheck/change/log/detail/list',
    method: 'get',
    params: query
  })
}

// 变更前的检查
export function acceptChangeCheck(query) {
  return request({
    url: '/xmlcheck/accept/change/check',
    method: 'get',
    params: query
  })
}

// 确认变更
export function acceptChange(data) {
  return request({
    url: '/xmlcheck/accept/change',
    method: 'post',
    data
  })
}

export function rejectChange(data) {
  return request({
    url: '/xmlcheck/reject/change',
    method: 'post',
    data
  })
}

// 发送邮件
export function sendEmail(data) {
  return request({
    url: '/xmlcheck/send/email',
    method: 'post',
    data,
    timeout: '1800000'
  })
}

export function exportXmlCheck(query) {
  return request({
    url: '/xmlcheck/export',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

// 查询 Pepco Order 分页列表
export function getPepcoOrderPage(query) {
  return request({
    url: '/xmlcheck/pepco/order/page',
    method: 'get',
    params: query
  })
}
