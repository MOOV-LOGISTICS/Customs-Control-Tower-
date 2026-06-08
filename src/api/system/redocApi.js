import request from '@/utils/request'

// 获取开放API信息
export function getOpenApi(data) {
  return request({
    url: '/system/openapi/get',
    method: 'get',
  })
}