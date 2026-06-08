import request from '@/utils/request'

export function getOutboundPage(data) {
  return request({
    url: '/openApi/outbound/getOutboundPage',
    method: 'get',
    params: data
  })
}

//下载模板
export function downloadTemplate(data) {
  return request({
    url: '/openApi/outbound/downloadOutboundTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//导入出库数据
export function importOutbound(data) {
  return request({
    url: '/openApi/outbound/importOutboundData',
    method: 'post',
    data: data
  })
}

//导出 出库数据
export function downloadData(data) {
  return request({
    url: '/openApi/outbound/export-outbound-excel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
