import request from '@/utils/request'

// 获得order_inventory分页
export function getInventoryBomPage(query) {
  return request({
    url: '/order/item-bom/page',
    method: 'get',
    params: query
  })
}


export function getInventoryBomList(query) {
  return request({
    url: '/order/item-bom/sub-list',
    method: 'get',
    params: query
  })
}
// 获得order_inventory分页
export function getBomInventoryListHasInvyQty(query) {
  return request({
    url: '/order/item-bom/getBomInventoryListHasInvyQty',
    method: 'post',
    data: JSON.stringify(query)
  })
}
export function exportSelectTemplate() {
  return request({
    url: '/order/item-bom/template/bom-select',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportTemplate() {
  return request({
    url: '/order/item-bom/template/bom',
    method: 'get',
    responseType: 'blob'
  })
}
