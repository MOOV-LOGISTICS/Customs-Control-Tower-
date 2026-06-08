import request from '@/utils/request'

export function exportExcel(query) {
  return request({
    url: '/container/report/export-excel',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
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


export function selectEChats(query) {
  return request({
    url: '/container/report/echats',
    method: 'get',
    params: query
  })
}

// export function editIpAddress(data) {
//   return request({
//     url: '/report/login/edit/ip',
//     method: 'post',
//     data: data
//   })
// }
//
// export function getRToken(query) {
//     return request({
//       url: '/system/chat/token',
//       method: 'get',
//       params: query
//     })
// }
//
// export function sendChat(query) {
//   return request({
//     url: '/system/chat/sendChat',
//     method: 'get',
//     params: query
//   })
// }
