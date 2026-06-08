import request from '@/utils/request'


export function commentCreate(data) {
  return request({
    url: '/system/comment/save',
    method: 'post',
    data: data
  })
}

export function getComment(query) {
  return request({
    url: '/system/comment/list',
    method: 'get',
    params: query
  })
}