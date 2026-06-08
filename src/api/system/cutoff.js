import request from '@/utils/request'

export function edit(query) {
  return request({
    url: '/cut/off/edit',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}


export function selectPage(query) {
    return request({
      url: '/cut/off/page',
      method: 'get',
      params: query
    })
}

export function poList(query) {
  return request({
    url: '/cut/off/poList',
    method: 'get',
    params: query
  })
}
export function poListTenantIgnore(query) {
  return request({
    url: '/cut/off/poListTenantIgnore',
    method: 'get',
    params: query
  })
}
export function importTemplate() {
  return request({
    url: '/cut/off/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}

