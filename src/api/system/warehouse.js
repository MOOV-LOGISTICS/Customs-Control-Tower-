import request from '@/utils/request'

// 创建system_warehouse
export function createWarehouse(data) {
  return request({
    url: '/system/warehouse/create',
    method: 'post',
    data: data
  })
}

// 更新system_warehouse
export function updateWarehouse(data) {
  return request({
    url: '/system/warehouse/update',
    method: 'put',
    data: data
  })
}

// 删除system_warehouse
export function deleteWarehouse(id) {
  return request({
    url: '/system/warehouse/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_warehouse
export function getWarehouse(id) {
  return request({
    url: '/system/warehouse/get?id=' + id,
    method: 'get'
  })
}

// 获得system_warehouse分页
export function getWarehousePage(query) {
  return request({
    url: '/system/warehouse/page',
    method: 'get',
    params: query
  })
}

export function getWarehouseList(query) {
  return request({
    url: '/system/warehouse/list',
    method: 'get',
    params: query
  })
}

// 导出system_warehouse Excel
export function exportWarehouseExcel(query) {
  return request({
    url: '/system/warehouse/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function getCountries(id) {
  return request({
    url: '/system/warehouse/world-city?id=' + id,
    method: 'get'
  })
}
