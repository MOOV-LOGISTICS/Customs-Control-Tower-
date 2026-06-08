import request from '@/utils/request'

// 创建商品
export function createProduct(data) {
  return request({
    url: '/system/product/create',
    method: 'post',
    data: data
  })
}

// 更新商品
export function updateProduct(data) {
  return request({
    url: '/system/product/update',
    method: 'put',
    data: data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: '/system/product/delete?id=' + id,
    method: 'delete'
  })
}

// 获得商品
export function getProduct(id) {
  return request({
    url: '/system/product/get?id=' + id,
    method: 'get'
  })
}

// 获得商品分页
export function getProductPage(query) {
  return request({
    url: '/system/product/page',
    method: 'get',
    params: query
  })
}

export function getProductList2(query) {
  return request({
    url: '/system/product/list2',
    method: 'get',
    params: query
  })
}

export async function getProductList(query) {
  const response=await request({
    url: '/system/product/list',
    method: 'post',
    data: query
  })
  return response
}



// 导出商品 Excel
export function exportProductExcel(query) {
  return request({
    url: '/system/product/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function importTemplate() {
  return request({
    url: '/system/product/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
