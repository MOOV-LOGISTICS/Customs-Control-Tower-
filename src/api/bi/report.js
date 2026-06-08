import request from '@/utils/request'

// 创建bi report
export function createReport(data) {
  return request({
    url: '/power/bi-report/create',
    method: 'post',
    data: data
  })
}

// 更新bi report
export function updateReport(data) {
  return request({
    url: '/power/bi-report/update',
    method: 'put',
    data: data
  })
}

// 删除bi report
export function deleteReport(id) {
  return request({
    url: '/power/bi-report/delete?id=' + id,
    method: 'delete'
  })
}

// 获得bi report
export function getReport(id) {
  return request({
    url: '/power/bi-report/get?id=' + id,
    method: 'get'
  })
}

// 获得bi report分页
export function getReportPage(query) {
  return request({
    url: '/power/bi-report/page',
    method: 'get',
    params: query
  })
}

// 导出bi report Excel
export function exportReportExcel(query) {
  return request({
    url: '/power/bi-report/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function findCategoryNameList() {
  return request({
    url: '/power/bi-report/findCategoryNameList',
    method: 'get'
  })
}


export function getUserReportsByPost() {
  return request({
    url: '/power/bi-report/getUserReportsByPost',
    method: 'get'
  })
}

export function getUserReports() {
  return request({
    url: '/power/bi-report/getUserReports',
    method: 'get'
  })
}

export function getUserReportsById(id) {
  return request({
    url: '/power/bi-report/getUserReportsById?id='+id,
    method: 'get'
  })
}

export function updateUserReports(data) {
  return request({
    url: '/power/bi-report/updateUserReports',
    method: 'put',
    data: data
  })
}

export function getMsgoLidlPage(query) {
  return request({
    url: '/system/msgolild-allocation/page',
    method: 'get',
    params: query
  })
}

export function getDestinationMilestoneReport(query) {
  return request({
    url: '/report/destination-milestone/location-control',
    method: 'get',
    params: query
  })
}

export function getOperationsTasksReport(query) {
  return request({
    url: '/report/destination-milestone/operations-tasks',
    method: 'get',
    params: query
  })
}

export function getEtaTrackingReport(query) {
  return request({
    url: '/report/destination-milestone/eta-tracking',
    method: 'get',
    params: query
  })
}
