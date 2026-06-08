import request from '@/utils/request'

// 创建order_inventory
export function createInventory(data) {
  return request({
    url: '/order/inventory/create',
    method: 'post',
    data: data
  })
}

// 更新order_inventory
export function updateInventory(data) {
  return request({
    url: '/order/inventory/update',
    method: 'put',
    data: data
  })
}

// 删除order_inventory
export function deleteInventory(id) {
  return request({
    url: '/order/inventory/delete?id=' + id,
    method: 'delete'
  })
}

// 获得order_inventory
export function getInventory(id) {
  return request({
    url: '/order/inventory/get?id=' + id,
    method: 'get'
  })
}

// 获得order_inventory分页
export function getInventoryPage(query) {
  return request({
    url: '/order/inventory/page',
    method: 'get',
    params: query
  })
}

// 导出order_inventory Excel
export function exportInventoryExcel(query) {
  return request({
    url: '/order/inventory/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function downloadInventoryTemplate(query) {
  return request({
    url: '/order/inventory/downloadInventoryTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


  export function handReport(query) {
    return request({
      url: '/order/inventory/handReport',
      method: 'get',
      params: query
    })
  }
  

