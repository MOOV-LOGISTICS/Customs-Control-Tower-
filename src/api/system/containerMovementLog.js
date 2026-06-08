import request from '@/utils/request'

// 获得container_type_code分页
export function getContainerMovementLogPage(query) {
  return request({
    url: '/system/containerMovementLog/findPage',
    method: 'get',
    params: query
  })
}
