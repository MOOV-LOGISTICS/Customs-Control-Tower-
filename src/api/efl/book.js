import request from '@/utils/request'



// 获得.分页
export function getDataPage(query) {
  return request({
    url: '/efl/book/page',
    method: 'get',
    params: query
  })
}
// 获得.分页
export function reviewDataPage(query) {
  return request({
    url: '/efl/book/review/page',
    method: 'get',
    params: query
  })
}
// 获得.分页
export function historicalDataPage(query) {
  return request({
    url: '/efl/book/his/page',
    method: 'get',
    params: query
  })
}

