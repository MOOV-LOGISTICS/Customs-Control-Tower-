import request from '@/utils/request'

// 创建order_inventory_in
export function createInventoryIn(data) {
  return request({
    url: '/order/inventory-in/create',
    method: 'post',
    data: data
  })
}

// 更新order_inventory_in
export function updateInventoryIn(data) {
  return request({
    url: '/order/inventory-in/update',
    method: 'put',
    data: data
  })
}

// 删除order_inventory_in
export function deleteInventoryIn(id) {
  return request({
    url: '/order/inventory-in/delete?id=' + id,
    method: 'delete'
  })
}

// 获得order_inventory_in
export function getInventoryIn(id) {
  return request({
    url: '/order/inventory-in/get?id=' + id,
    method: 'get'
  })
}

// 获得order_inventory_in分页
export function getInventoryInPage(query) {
  return request({
    url: '/order/inventory-in/page',
    method: 'get',
    params: query
  })
}

// 导出order_inventory_in Excel
export function exportInventoryInExcel(query) {
  return request({
    url: '/order/inventory-in/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadInventoryInTemplate(query) {
  return request({
    url: '/order/inventory-in/downloadInventoryInTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}