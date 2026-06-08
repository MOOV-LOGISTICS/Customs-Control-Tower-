import request from '@/utils/request'

// export function exportExcel(query) {
//   return request({
//     url: '/report/convalon/export-excel',
//     method: 'post',
//     data: query,
//     responseType: 'blob'
//   })
// }
// export function totalTueByOha(data) {
//     return request({
//       url: '/combineBookingReport/totalTueByOha',
//       method: 'post',
//       data: data,
//     })
// }
//
// export function totalTueByCarrier(data) {
//     return request({
//       url: '/combineBookingReport/totalTueByCarrier',
//       method: 'post',
//       data: data,
//     })
// }

export function selectPageIp(query) {
  return request({
    url: '/report/login/page/ip',
    method: 'get',
    params: query
  })
}

export function editIpAddress(data) {
  return request({
    url: '/report/login/edit/ip',
    method: 'post',
    data: data
  })
}

export function selectChatsIp(query) {
  return request({
    url: '/report/login/chats/ip',
    method: 'get',
    params: query
  })
}
export function IpPoList(query) {
  return request({
    url: '/report/login/list/ip',
    method: 'get',
    params: query
  })
}
export function selectPage(query) {
    return request({
      url: '/report/login/page',
      method: 'get',
      params: query
    })
}

export function poList(query) {
  return request({
    url: '/report/login/poList',
    method: 'get',
    params: query
  })
}
//
// export function sumData(query) {
//   return request({
//     url: '/report/convalon/sum',
//     method: 'get',
//     params: query
//   })
// }
//
// export function lotList(query) {
//   return request({
//     url: '/report/convalon/lotList',
//     method: 'get',
//     params: query
//   })
// }
//
// export function skuList(query) {
//   return request({
//     url: '/report/convalon/skuList',
//     method: 'get',
//     params: query
//   })
// }
