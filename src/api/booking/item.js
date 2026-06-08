import request from '@/utils/request'


// 获得booking
export function getBookingItemList(query) {
  return request({
    url: '/booking/item/queryByItemIds',
    method: 'get',
    params: query
  })
}
