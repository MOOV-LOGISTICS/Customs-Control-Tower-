import request from '@/utils/request'

// 使用Full Name，获得Customer Id
export function getPublicKey() {
  return request({
    url: '/system/auth/getPublicKey',
    method: 'get'
  })
}
