import request from '@/utils/request'
 
 

// 获得order_inventory分页
export function getInventoryPage(query) {
  return request({
    url: '/warehouse/kk/inventory/page',
    method: 'get',
    params: query
  })
}

export function exportInventoryExcel(query) {
  return request({
    url: '/warehouse/kk/inventory/export_excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

  export function handReport(query) {
    return request({
      url: '/warehouse/kk/inventory/handReport',
      method: 'get',
      params: query
    })
  }


export function downloadInventoryTemplate(query) {
  return request({
    url: '/warehouse/kk/inventory/exportInventory',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
} 