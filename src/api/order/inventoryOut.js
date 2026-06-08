import request from '@/utils/request'

// 创建order_inventory_out
export function createInventoryOut(data) {
  return request({
    url: '/order/inventory-out/create',
    method: 'post',
    data: data
  })
}

// 更新order_inventory_out
export function updateInventoryOut(data) {
  return request({
    url: '/order/inventory-out/update',
    method: 'put',
    data: data
  })
}

// 删除order_inventory_out
export function deleteInventoryOut(id) {
  return request({
    url: '/order/inventory-out/delete?id=' + id,
    method: 'delete'
  })
}

// 获得order_inventory_out
export function getInventoryOut(id) {
  return request({
    url: '/order/inventory-out/get?id=' + id,
    method: 'get'
  })
}

// 获得order_inventory_out分页
export function getInventoryOutPage(query) {
  return request({
    url: '/order/inventory-out/page',
    method: 'get',
    params: query
  })
}

// 导出order_inventory_out Excel
export function exportInventoryOutExcel(query) {
  return request({
    url: '/order/inventory-out/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadInventoryOutTemplate(query) {
  return request({
    url: '/order/inventory-out/downloadInventoryOutTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}