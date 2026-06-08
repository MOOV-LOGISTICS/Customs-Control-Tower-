import request from '@/utils/request'

// 创建hs_code
export function createHsCode(data) {
  return request({
    url: '/system/hs-code/create',
    method: 'post',
    data: data
  })
}

// 更新hs_code
export function applyNewHsCode(data) {
  return request({
    url: '/system/hs-code/applyNewHsCode',
    method: 'post',
    data: data
  })
}

export function updateHsCode(data) {
  return request({
    url: '/system/hs-code/update',
    method: 'put',
    data: data
  })
}

// 删除hs_code
export function deleteHsCode(id) {
  return request({
    url: '/system/hs-code/delete?id=' + id,
    method: 'delete'
  })
}

// 获得hs_code
export function getHsCode(id) {
  return request({
    url: '/system/hs-code/get?id=' + id,
    method: 'get'
  })
}

// 获得hs_code分页
export function getHsCodePage(query) {
  return request({
    url: '/system/hs-code/page',
    method: 'get',
    params: query
  })
}

export function getHsCodeList() {
  return request({
    url: '/system/hs-code/list',
    method: 'get'
  })
}

export function approveHscode(query) {
  return request({
    url: '/system/hs-code/approveHscode',
    method: 'post',
    params: query
  })
}

// 导出hs_code Excel
export function exportHsCodeExcel(query) {
  return request({
    url: '/system/hs-code/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


export function importTemplate() {
  return request({
    url: '/system/hs-code/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}


export function getHsCodeListByCode(hsCode) {
  return request({
    url: '/system/hs-code/get-hsCode?hsCode=' + hsCode,
    method: 'get'
  })
}



export function getDataByHsCodes(data) {
  return request({
    url: '/system/hs-code/getDataByHsCodes',
    method: 'post',
    data: data
  })
}
