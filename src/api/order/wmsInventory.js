import request from '@/utils/request'
 
 

// 获得order_inventory分页
export function getInventoryPage(query) {
  return request({
    url: '/order/wmsInventory/page',
    method: 'get',
    params: query
  })
}

 