import request from '@/utils/request'

// 创建order task
export function createTask(data) {
  return request({
    url: '/order/task/create',
    method: 'post',
    data: data
  })
}

export function reminder(data) {
  return request({
    url: '/order/task/reminder',
    method: 'post',
    data: data
  })
}


// 更新order task
export function updateTask(data) {
  return request({
    url: '/order/task/update',
    method: 'put',
    data: data
  })
}

/**
 * 原 /order/task/update 接口
 * @param data
 * @returns {*}
 */
export function submitCRD(data) {
  return request({
    url: '/order/header/cargoReadyDate/submit',
    method: 'post',
    data: data
  })
}

// 更新 dimensions order task
export function updateDimensionsData(data) {
  return request({
    url: '/order/task/update/dimensions',
    method: 'put',
    data: data
  })
}

// 更新order task
export function updateSoReleasedTask(data) {
  return request({
    url: '/order/task/update-so-released',
    method: 'put',
    data: data
  })
}

// 更新order task
export function updateCargoHandoverDateTask(data) {
  return request({
    url: '/order/task/update-cargo-handover-date',
    method: 'put',
    data: data
  })
}

// 更新order task
export function updateInspectionStatusTask(data) {
  return request({
    url: '/order/task/update-inspection-status',
    method: 'put',
    data: data
  })
}

// 删除order task
export function deleteTask(id) {
  return request({
    url: '/order/task/delete?id=' + id,
    method: 'delete'
  })
}

// 获得order task
export function getTask(id) {
  return request({
    url: '/order/task/get?id=' + id,
    method: 'get'
  })
}

// 获得order task分页
export function getTaskPage(query) {
  return request({
    url: '/order/task/page',
    method: 'get',
    params: query
  })
}

export function getTaskList(query) {
  return request({
    url: '/order/task/list',
    method: 'get',
    params: query
  })
}

export function getTaskNames(query) {
  return request({
    url: '/order/task/getTaskNames',
    method: 'get',
    params: query
  })
}

export function getCategoryList(query) {
  return request({
    url: '/order/task/getCategorys',
    method: 'get',
    params: query
  })
}


// 导出order task Excel
export function exportTaskExcel(query) {
  return request({
    url: '/order/task/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function groupByTaskName(query) {
  return request({
    url: '/order/task/groupByTaskName',
    method: 'get',
    params: query
  })
}
export function taskReport(query) {
  return request({
    url: '/order/task/taskReport',
    method: 'get',
    params: query
  })
}


// 更新order task
export function updatePreAlertTask(data) {
  return request({
    url: '/order/task/update-pre-alert',
    method: 'put',
    data: data
  })
}

export function updateSeaAirPreAlertTask(data) {
  return request({
    url: '/order/task/sea-air/update-pre-alert',
    method: 'put',
    data: data
  })
}

export function getAllTaskNamesMap() {
  return request({
    url: '/order/task/pepco/all-task-name',
    method: 'get',
  })
}

//po manage 获取每一个Order number的document的种类及明细信息
export async function getFileInfoForOrder(query) {
  return await request({
    url: '/order/task/pepco/get-file-info-for-order',
    method: 'get',
    params: query
  })
}

//popeco shipping order获取shippingOrderNumber的document的种类及明细信息
export async function getFileInfoForShippingOrder(query) {
  return await request({
    url: '/order/task/pepco/get-file-info-for-shipping-order',
    method: 'get',
    params: query
  })
}


//根据文件id下载文件
export async function downloadFileById(id) {
  return await request({
    url: '/order/task/pepco/download-file-by-id',
    method: 'get',
    params: { id }
  })
}


// 根据orderid获取文件
export function getPepcoOrderFileByOrder(query) {
  return request({
    url: '/order/task/pepco/order-file/files',
    method: 'get',
    params: query
  })
}
// 更新order file shippingId
export function updatePepcoFileShippingId(data) {
  return request({
    url: '/order/task/pepco/order-file/update-file-shippingid',
    method: 'post',
    data: data
  })
}
// 下载milestone数据
export function exportOrderMilestoneData(query) {
  return request({
    url: '/order/task/pepco/download/milestone-data',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 下载CargoInboundUploadTemplate
export function exportCargoInboundUploadTemplate(query) {
  return request({
    url: '/order/task/pepco/download/cargo-inbound-upload-template',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

//导出批量更新dimension模版
export function getDimensionsImportTemplate(query) {
  return request({
    url: '/order/task/pepco/download/dimensions-import-template',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}


// 根据orderid获取文件
export function reSaveFile(data) {
  return request({
    url: '/order/task/pepco/order-file/re-save',
    method: 'post',
    params: data
  })
}

// 重新上传文件 - 后端新接口
// 后端入参: @RequestParam("file") MultipartFile file, @RequestParam("reqVO") String reqVOJson
// JSON数据作为字符串传递，后端手动解析，避免URL参数特殊字符问题
export function reUploadFileByHbl(file, data) {
  const formData = new FormData()
  // 添加文件
  if (file) {
    formData.append('file', file)
  }
  // 添加JSON字符串（作为普通FormData字段）
  if (data) {
    formData.append('reqVO', JSON.stringify(data))
  }
  return request({
    url: '/order/task/pepco/order-file/hbl-re-save',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function updateOrderFile(data) {
  return request({
    url: '/order/task/pepco/order-file/update',
    method: 'post',
    params: data
  })
}

export function getCargoReadyDateLogByOrderId(params) {
  return request({
    url: '/cargoReadyDateLog/get',
    method: 'get',
    params: params
  })
}

export function getCargoReadyDateLogsByOrderId(params) {
  return request({
    url: '/cargoReadyDateLog/getLogs',
    method: 'get',
    params: params
  })
}

// 更新shipping order po approval
export function updateOrderBookingApproval(orderHeaderId) {
  return request({
    url: '/order/task/update-order-booking-approval?orderHeaderId=' + orderHeaderId,
    method: 'put',
  })
}

export function updateContainerGateIn(params) {
  return request({
    url: '/order/task/updateContainerGateIn',
    method: 'post',
    data: params
  })
}

export function getOrderInfoById(params) {
  return request({
    url: '/order/header/getOrderInfoById',
    method: 'get',
    params: params
  })
}

export function getContainerGateInReasonList(params) {
  return request({
    url: '/actualCargoHandoverDateLog/getContainerGateInReasonList',
    method: 'get',
    params: params
  })
}

export function downloadGateInTemplate(params) {
  return request({
    url: '/order/task/downloadGateInTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export function pepcoMilestoneHasPendingTasks() {
  return request({
    url: '/order/task/has-pending-tasks',
    method: 'get'
  })
}

export function pepcoSeaAirMilestoneHasPendingTasks() {
  return request({
    url: '/order/task/sea-air/has-pending-tasks',
    method: 'get'
  })
}

export function getSingleTask(orderNumber, taskCode) {
  return request({
    url: '/order/task/pepco/order-task/single',
    method: 'get',
    params: { orderNumber, taskCode }
  })
}
