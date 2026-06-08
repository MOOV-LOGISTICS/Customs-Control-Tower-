import request from '@/utils/request'

// 创建Customer Plan
export function createTenantPackage(data) {
  return request({
    url: '/system/tenant-package/create',
    method: 'post',
    data: data
  })
}

// 更新Customer Plan
export function updateTenantPackage(data) {
  return request({
    url: '/system/tenant-package/update',
    method: 'put',
    data: data
  })
}

// 删除Customer Plan
export function deleteTenantPackage(id) {
  return request({
    url: '/system/tenant-package/delete?id=' + id,
    method: 'delete'
  })
}

// 获得Customer Plan
export function getTenantPackage(id) {
  return request({
    url: '/system/tenant-package/get?id=' + id,
    method: 'get'
  })
}

// 获得Customer Plan分页
export function getTenantPackagePage(query) {
  return request({
    url: '/system/tenant-package/page',
    method: 'get',
    params: query
  })
}

// 获取Customer Plan精简信息列表
export function getTenantPackageList() {
  return request({
    url: '/system/tenant-package/get-simple-list',
    method: 'get'
  })
}
