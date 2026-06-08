import request from '@/utils/request'

// 创建文件夹结构
export function createFolder(data) {
  return request({
    url: '/system/folder/create',
    method: 'post',
    headers: {
              'Content-Type': 'multipart/form-data'
            },
    data: data
  })
}

// 更新文件夹结构
export function updateFolder(data) {
  return request({
    url: '/system/folder/update',
    method: 'put',
    data: data
  })
}

// 删除文件夹结构
export function deleteFolder(id) {
  return request({
    url: '/system/folder/delete?id=' + id,
    method: 'delete'
  })
}

// 获得文件夹结构
export function getFolder(id) {
  return request({
    url: '/system/folder/get?id=' + id,
    method: 'get'
  })
}

// 获得文件夹结构分页
export function getFolderPage(query) {
  return request({
    url: '/system/folder/page',
    method: 'get',
    params: query
  })
}

// 文件夹结构
export function getTreeList(query) {
  return request({
    url: '/system/folder/getTreeList',
    method: 'post',
    data: query
  })
}
