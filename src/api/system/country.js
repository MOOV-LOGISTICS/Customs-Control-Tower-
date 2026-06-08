import request from '@/utils/request'

// 创建system_country
export function createCountry(data) {
  return request({
    url: '/system/country/create',
    method: 'post',
    data: data
  })
}

// 更新system_country
export function updateCountry(data) {
  return request({
    url: '/system/country/update',
    method: 'put',
    data: data
  })
}

// 删除system_country
export function deleteCountry(id) {
  return request({
    url: '/system/country/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_country
export function getCountry(id) {
  return request({
    url: '/system/country/get?id=' + id,
    method: 'get'
  })
}

export function getCountryList(id) {
  return request({
    url: '/system/country/list1',
    method: 'get'
  })
}

// 获得system_country分页
export function getCountryPage(query) {
  return request({
    url: '/system/country/page',
    method: 'get',
    params: query
  })
}

// 导出system_country Excel
export function exportCountryExcel(query) {
  return request({
    url: '/system/country/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
