import request from '@/utils/request'

// 创建shipment_invoice
export function createInvoice(data) {
  return request({
    url: '/shipment/invoice/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_invoice
export function updateInvoice(data) {
  return request({
    url: '/shipment/invoice/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_invoice
export function deleteInvoice(id) {
  return request({
    url: '/shipment/invoice/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_invoice
export function getInvoice(id) {
  return request({
    url: '/shipment/invoice/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_invoice分页
export function getInvoicePage(query) {
  return request({
    url: '/shipment/invoice/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_invoice Excel
export function exportInvoiceExcel(query) {
  return request({
    url: '/shipment/invoice/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function uploadFile(data) {
  return request({
    url: '/shipment/invoice/uploadFile',
    method: 'post',
    data: data
  })
}
export function uploadFiles(data) {
  return request({
    url: '/shipment/invoice/uploadFiles',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
  })
}
