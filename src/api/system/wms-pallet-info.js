import request from '@/utils/request'
 
 

// 获得分页
export function getWmsPalletInfoPage(query) {
  return request({
    url: 'warehouse/pallet_info/page',
    method: 'get',
    params: query
  })
}

// 导出order_inventory Excel
export function exportPalletInfoExcel(query) {
  return request({
    url: '/warehouse/pallet_info/export_excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}