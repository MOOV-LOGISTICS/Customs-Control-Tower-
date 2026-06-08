import request from '@/utils/request'

// 创建订单行
export function createItem(data) {
  return request({
    url: '/order/item/create',
    method: 'post',
    data: data
  })
}

// 更新订单行
export function updateItem(data) {
  return request({
    url: '/order/item/update',
    method: 'put',
    data: data
  })
}

// 更新订单行 for pepco
export function updateItem4Pepco(data) {
  return request({
    url: '/order/item/pepco/update',
    method: 'put',
    data: data
  })
}

// 删除订单行
export function deleteItem(id) {
  return request({
    url: '/order/item/delete?id=' + id,
    method: 'delete'
  })
}

// 获得订单行
export function getItem(id) {
  return request({
    url: '/order/item/get?id=' + id,
    method: 'get'
  })
}

// 获得订单行分页
export function getItemPage(query) {
  return request({
    url: '/order/item/page',
    method: 'get',
    params: query
  })
}

export function getListByCondition(query) {
  return request({
    url: '/order/item/listByCondition',
    method: 'get',
    params: query
  })
}

export async function getItemList(query) {
  try {
    const response = await request({
      url: '/order/item/list',
      method: 'get',
      params: query
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// 导出订单行 Excel
export function exportItemExcel(query) {
  return request({
    url: '/order/item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function downloadInboundTemplate(query) {
  return request({
    url: '/order/item/downloadInboundTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function uploadInboundFiles(data) {
  return request({
    url: '/order/item/uploadInboundFiles',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
  })
}
export function downloadBookTemplate(query) {
  return request({
    url: '/order/item/downloadBookTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function uploadBookFiles(data) {
  return request({
    url: '/order/item/uploadBookFiles',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
  })
}
