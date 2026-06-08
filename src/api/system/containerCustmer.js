import request from '@/utils/request'

// 创建port custom
export function createContainerCustomer(data) {
  return request({
    url: '/system/container-customer/create',
    method: 'post',
    params: data
  })
}

export function getContainerCustomerList(query) {
    return request({
      url: '/system/container-customer/list',
      method: 'get',
      params: query
    })
  }