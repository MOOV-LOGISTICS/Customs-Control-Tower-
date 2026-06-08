import request from '@/utils/request'

// 创建sales order header
export function createSOHeader(data) {
  return request({
    url: '/order/so-header/create',
    method: 'post',
    data: data
  })
}

// 更新sales order header
export function updateSOHeader(data) {
  return request({
    url: '/order/so-header/update',
    method: 'put',
    data: data
  })
}



// 删除sales order header
export function deleteSOHeader(id) {
  return request({
    url: '/order/so-header/delete?id=' + id,
    method: 'delete'
  })
}

// 获得sales order header
export function getSOHeader(id) {
  return request({
    url: '/order/so-header/get?id=' + id,
    method: 'get'
  })
}

// 获得sales order header分页
export function getSOHeaderPage(query) {
  console.log(query,"query111")
  return request({
    url: '/order/so-header/page',
    method: 'get',
    params: query
  })
}

export function soReport(query) {
  return request({
    url: '/order/so-header/soReport',
    method: 'get',
    params: query
  })
}


// 导出sales order header Excel
export function exportSOHeaderExcel(query) {
  return request({
    url: '/order/so-header/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function getOrderDocument(id) {
  return request({
    url: '/order/so-header/getOrderDocument?id='+id,
    method: 'get'
  })
}


export function uploadOrderDocument(data) {
  return request({
    url: '/order/so-header/uploadOrderDocument',
    method: 'post',
    data: data
  })
}

export function SODownloadTemplate() {
  return request({
    url: '/order/so-header/downloadTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function getSpiltProduct(query) {
  console.log(query,"queryquery")
  return request({
    url: '/order/so-header/spiltProductList',
    method: 'get',
    params: query
  })
}

export function changeSpiltProduct(query) {
  console.log(query,"queryquery111")
  return request({
    url: '/order/so-header/spilt',
    method: 'get',
    params: query
  })
}
