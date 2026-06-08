import request from '@/utils/request'

// 创建system_suppprt_ticket
export function createSupportTicket(data) {
  return request({
    url: '/system/support-ticket/create',
    method: 'post',
    headers: {
              'Content-Type': 'multipart/form-data'
            },
    data: data
  })
}

// 更新system_suppprt_ticket
export function updateSupportTicket(data) {
  return request({
    url: '/system/support-ticket/update',
    method: 'put',
    data: data
  })
}

// 删除system_suppprt_ticket
export function deleteSupportTicket(id) {
  return request({
    url: '/system/support-ticket/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_suppprt_ticket
export function getSupportTicket(id) {
  return request({
    url: '/system/support-ticket/get?id=' + id,
    method: 'get'
  })
}

//suppprt ticket List菜单 获取明细
export function getOneSupportTicketList(id) {
  return request({
    url: '/system/support-ticket/get-one?id=' + id,
    method: 'get'
  })
}

// 获得system_suppprt_ticket分页
export function getSupportTicketPage(query) {
  return request({
    url: '/system/support-ticket/page',
    method: 'get',
    params: query
  })
}

// 导出system_suppprt_ticket Excel
export function exportSupportTicketExcel(query) {
  return request({
    url: '/system/support-ticket/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function addRemarksById(data) {
  return request({
    url: '/system/support-ticket/addRemarksById',
    method: 'post',
    data: data
  })
}

export function getTicketFilesById(id) {
  return request({
    url: '/system/support-ticket/getTicketFilesById?id=' + id,
    method: 'get'
  })
}

export function getTicketReportData(year, month,category) {
  return request({
    url: '/system/support-ticket/getTicketReportData?year='+year+'&month=' + month+'&category='+category,
    method: 'get'
  })
}


// 导出system_suppprt_ticket Excel
export function downloadSupportTicketExcel(ids) {
  return request({
    url: '/system/support-ticket/download-excel',
    method: 'post',
    data: ids,
    responseType: 'blob'
  })
}


//获取表system_support_ticket所有的数据 忽略租户 权限由菜单配置决定
export function getAllSupportTicketPage(query) {
  return request({
    url: '/system/support-ticket/all-page',
    method: 'get',
    params: query
  })
}
//获取表system_support_ticket当前租户的所有的数据不同状态下的百分比
export function getAllSupportTicketStatusPercent(query) {
  return request({
    url: '/system/support-ticket/all-status-percent',
    method: 'get',
    params: query
  })
}

// 获取各模块平均解决时长
export function getModuleAvgResolutionTime() {
  return request({
    url: '/system/support-ticket/module-avg-resolution-time',
    method: 'get'
  })
}

//获取表system_support_ticket当前租户的inprocess的不同优先级priority百分比
export function getSupportTicketPriorityPercentInProcessStatus(query) {
  return request({
    url: '/system/support-ticket/inprocess-priority-status-percent',
    method: 'get',
    params: query
  })
}
//获取表system_support_ticket当前租户的inprocess的月份量
export function getMonthlyTicketCount(monthCount = 6) {
  return request({
    url: '/system/support-ticket/month-total-tickets',
    method: 'get',
    params: {
      monthCount
    }
  })
}

//获取根据优先级筛选下的当前租户的所有的数据不同状态下的百分比
export function getPriorityStatusBreakdown(query) {
  return request({
    url: '/system/support-ticket/priority-status-percent',
    method: 'get',
    params: query
  })
}

export function getRoleRegionStats(country) {
  return request({
    url: '/system/support-ticket/role-region-stats',
    method: 'get',
    params: { country }
  })
}

// 导出表system_support_ticket所有的Smart Ticket数据到excel中 权限由菜单配置决定
export function downloadAllSupportTicketExcel(ids) {
  return request({
    url: '/system/support-ticket/download-all-excel',
    method: 'post',
    data: ids,
    responseType: 'blob'
  })
}


//页面增加的同意或拒绝按钮，仅能benny账号能看见与操作
export function handelSolveOrReject(id, type) {
  return request({
    url: '/system/support-ticket/solve-or-reject',
    method: 'get',
    params:{
      id: id,
      status: type
    }
  })
}

// 下载system_suppprt_ticket文件
export function downloadAttachment(fileId, fileName, id ) {
  return request({
    url: '/system/support-ticket/proxy-download',
    method: 'get',
    params: {
      fileName: fileName,
      fileId: fileId,
      id: id
    },
    responseType: 'blob'
  })
}

// 用户状态修改
export function changeSupportTicketFlag(id, flag) {
  const data = {
    id,
    flag
  }
  return request({
    url: '/system/support-ticket/update-flag',
    method: 'put',
    data: data
  })
}
