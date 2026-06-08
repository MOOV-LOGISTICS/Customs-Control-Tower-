import request from '@/utils/request'

// 创建shipping_template
export function createTemplate(data) {
  return request({
    url: '/shipping/template/create',
    method: 'post',
    data: data
  })
}

// 删除shipping_template
export function deleteTemplate(id) {
  return request({
    url: '/shipping/template/delete?id=' + id,
    method: 'delete'
  })
}


// 获得shipping_template分页
export function getTemplateList(query) {
  return request({
    url: '/shipping/template/getTemplateList',
    method: 'get',
    params: query
  })
}
