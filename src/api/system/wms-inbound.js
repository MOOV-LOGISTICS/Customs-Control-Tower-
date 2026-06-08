import request from '@/utils/request'
 
 

// 获得分页
export function getWmsInboundPage(query) {
  return request({
    url: 'warehouse/inbounds/page',
    method: 'get',
    params: query
  })
}

// 检查PO、ASN、Inbound三方数量对比
export function checkPoAsnInbound(query) {
  return request({
    url: 'openApi/inbound/checkPoAsnInbound',
    method: 'get',
    params: query
  })
}