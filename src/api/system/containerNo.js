import request from '@/utils/request'

// 创建箱型箱号
export function createContainerNo(data) {
  return request({
    url: '/system/container-no/create',
    method: 'post',
    data: data
  })
}

// 更新箱型箱号
export function updateContainerNo(data) {
  return request({
    url: '/system/container-no/update',
    method: 'put',
    data: data
  })
}

// 删除箱型箱号
export function deleteContainerNo(id) {
  return request({
    url: '/system/container-no/delete?id=' + id,
    method: 'delete'
  })
}

// 获得箱型箱号
export function getContainerNo(id) {
  return request({
    url: '/system/container-no/get?id=' + id,
    method: 'get'
  })
}

// 获得箱型箱号分页
export function getContainerNoPage(query) {
  return request({
    url: '/system/container-no/page',
    method: 'get',
    params: query
  })
}

// 导出箱型箱号 Excel
export function exportContainerNoExcel(query) {
  return request({
    url: '/system/container-no/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 根据箱型 箱号，查询 箱号
export function getContainerNoByNoAndType(containerNo ,containerType ) {
  return request({
    url: '/system/container-no/getContainerNo?containerNo=' + containerNo +'&containerType='+containerType ,
    method: 'get'
  })
}

// 根据箱型 箱号 集合，查询 箱号
export function checkDataByNoAndType(data) {
  return request({
    url: '/system/container-no/checkDataByNoAndType',
    method: 'post',
    data: data
  })
}

export function downloadContainerNoTemplate(query) {
  return request({
    url: '/system/container-no/downloadContainerNoTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}