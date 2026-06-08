import request from '@/utils/request'

// 创建system_star
export function createStar(data) {
  return request({
    url: '/system/star/create',
    method: 'post',
    data: data
  })
}

// 更新system_star
export function updateStar(data) {
  return request({
    url: '/system/star/update',
    method: 'put',
    data: data
  })
}

// 删除system_star
export function deleteStar(id) {
  return request({
    url: '/system/star/delete?id=' + id,
    method: 'delete'
  })
}

// 获得system_star
export function getStar(id) {
  return request({
    url: '/system/star/get?id=' + id,
    method: 'get'
  })
}

// 获得system_star分页
export function getStarPage(query) {
  return request({
    url: '/system/star/page',
    method: 'get',
    params: query
  })
}

// 导出system_star Excel
export function exportStarExcel(query) {
  return request({
    url: '/system/star/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function uploadFiles(data) {
  return request({
    url: '/system/star/uploadFiles',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
  })
}
