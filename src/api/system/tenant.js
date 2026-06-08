import request from '@/utils/request'

// 使用email和场景，获取tenantId
export function getTenantIdByName(name, scenario) {
  return request({
    url: '/system/tenant/get-id-by-name',
    method: 'get',
    params: {
      name,
      scenario
    }
  })
}

// 创建租户
export function createTenant(data) {
  return request({
    url: '/system/tenant/create',
    method: 'post',
    data: data
  })
}

// 更新租户
export function updateTenant(data) {
  return request({
    url: '/system/tenant/update',
    method: 'put',
    data: data
  })
}

// 删除租户
export function deleteTenant(id) {
  return request({
    url: '/system/tenant/delete?id=' + id,
    method: 'delete'
  })
}

// 获得租户
export function getTenant(id) {
  return request({
    url: '/system/tenant/get?id=' + id,
    method: 'get'
  })
}
export function getTenantIdListOfActive() {
  return request({
    url: '/system/tenant/getTenantIdListOfActive',
    method: 'get'
  })
}

export function getTenantIdListOfActive2() {
  return request({
    url: '/system/tenant/getTenantListOfActive',
    method: 'get'
  })
}


// 获得租户分页
export function getTenantPage(query) {
  return request({
    url: '/system/tenant/page',
    method: 'get',
    params: query
  })
}

export function getTenantAndCustomers(query) {
  return request({
    url: '/system/tenant/getTenantAndCustomers',
    method: 'get',
    params: query
  })
}

// 导出租户 Excel
export function exportTenantExcel(query) {
  return request({
    url: '/system/tenant/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
