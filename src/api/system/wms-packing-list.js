import request from '@/utils/request'
 
 

// 获得分页
export function getWmsPackingListPage(query) {
  return request({
    url: 'warehouse/packing_lists/page',
    method: 'get',
    params: query
  })
}

// 导出kk packing list Excel
export function exportPackingListExcel(query) {
  return request({
    url: '/warehouse/packing_lists/export_excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 导出kk packing list detail Excel
export function exportPackingListDetailExcel(query) {
  return request({
    url: '/warehouse/packing_lists/detail/export_excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}