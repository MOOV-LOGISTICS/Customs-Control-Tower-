import request from '@/utils/request'

export function allocationReport(data) {
    return request({
      url: '/combineBookingReport/allocationReport',
      method: 'post',
      data: data,
    })
}

export function selectDistinctValues() {
    return request({
      url: '/combineBookingReport/selectDistinctValues',
      method: 'get'
    })
}

export function vesselVoyageReport(data) {
    return request({
      url: '/combineBookingReport/vesselVoyageReport',
      method: 'post',
      data: data,
    })
}
export function exportExcel(query) {
  return request({
    url: '/report/convalon/export-excel',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
export function totalTueByOha(data) {
    return request({
      url: '/combineBookingReport/totalTueByOha',
      method: 'post',
      data: data,
    })
}

export function totalTueByCarrier(data) {
    return request({
      url: '/combineBookingReport/totalTueByCarrier',
      method: 'post',
      data: data,
    })
}

export function selectPage(query) {
    return request({
      url: '/report/convalon/page',
      method: 'get',
      params: query
    })
}

export function poList(query) {
  return request({
    url: '/report/convalon/poList',
    method: 'get',
    params: query
  })
}

export function sumData(query) {
  return request({
    url: '/report/convalon/sum',
    method: 'get',
    params: query
  })
}

export function lotList(query) {
  return request({
    url: '/report/convalon/lotList',
    method: 'get',
    params: query
  })
}

export function skuList(query) {
  return request({
    url: '/report/convalon/skuList',
    method: 'get',
    params: query
  })
}
