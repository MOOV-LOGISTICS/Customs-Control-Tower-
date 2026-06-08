import request from '@/utils/request'

// 删除文件
export async function deleteFile(id) {
  return request({
    url: '/infra/file/delete?id=' + id,
    method: 'delete'
  })
}

// 获得文件分页
export function getFilePage(query) {
  return request({
    url: '/infra/file/page',
    method: 'get',
    params: query
  })
}


export async function getFileList(query) {
  try {
    const response = await request({
      url: '/infra/file/list',
      method: 'get',
      params: query
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function getWmsBomFilePage(query) {
  return request({
    url: '/infra/file/getWmsBomFilePage',
    method: 'get',
    params: query
  })
}


// msgoLidl获得文件分页
export function getMsgoLidlFilePage(query) {
  return request({
    url: '/infra/file/getMsgoLidlFilePage',
    method: 'get',
    params: query
  })
}

export function updateFileExId(params) {
  return request({
    url: '/infra/file/updateFileExId',
    method: 'post',
    data: params
  })
}
