import request from '@/utils/request'


export function getInboundPage(data) {
  return request({
    url: '/openApi/inbound/getInboundPage',
    method: 'get',
    params: data
  })
}

//下载模板
export function downloadTemplate(data) {
  return request({
    url: '/openApi/inbound/downloadInboundTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
//下载数据
export function downloadData(data) {
  return request({
    url: '/openApi/inbound/export-inbound-excel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//导入入库数据
export function importInbound(data) {
  return request({
    url: '/openApi/inbound/importInboundData',
    method: 'post',
    data: data
  })
}


export function getAsnPage(data) {
  return request({
    url: '/openApi/inbound/getAsnPage',
    method: 'get',
    params: data
  })
}
//下载asn模板
export function downloadAsnTemplate(data) {
  return request({
    url: '/openApi/inbound/downloadAsnTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//导入asn 数据
export function importAsn(data) {
  return request({
    url: '/openApi/inbound/importAsnData',
    method: 'post',
    data: data
  })
}


//下载asn data
export function downloadAsnData(data) {
  return request({
    url: '/openApi/inbound/export-asn-excel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//删除asn 数据
export function deleteAsn(inboundNo) {
  return request({
    url: '/openApi/inbound/deleteAsnData?inboundNo=' + inboundNo,
    method: 'delete',
  })
}

//校验asn 数据
export function validateAsnData(data) {
  return request({
    url: '/openApi/inbound/checkAsnData',
    method: 'post',
    data: data
  })
}