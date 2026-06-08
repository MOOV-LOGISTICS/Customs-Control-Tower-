import request from '@/utils/request'

/**
 * 获取ASN文件
 * @param params
 * @returns {*}
 */
function getAsnDocumentPage(params) {
  return request({
    url: '/asnDocument/getAsnDocumentPage',
    method: 'get',
    params: params
  })
}

function getAsnDocumentByUserId(params) {
  return request({
    url: '/asnDocument/getAsnDocumentByUserId',
    method: 'get',
    params: params
  })
}

function getAsnDocumentDetailById(params) {
  return request({
    url: '/asnDocument/getAsnDocumentDetailById',
    method: 'get',
    params: params
  })
}

function uploadAsnDocument(params) {
  return request({
    url: '/asnDocument/uploadAsnDocument',
    method: 'post',
    data: params
  })
}

function linkAsnDocument(params) {
  return request({
    url: '/asnDocument/linkAsnDocument',
    method: 'post',
    data: params
  })
}

function getAsnDocumentRolesByAsnId(params) {
  return request({
    url: '/asnDocument/getAsnDocumentRolesByAsnId',
    method: 'get',
    params: params
  })
}

function deleteAsnDocument(params) {
  return request({
    url: '/asnDocument/deleteAsnDocument',
    method: 'get',
    params: params
  })
}

export {
  getAsnDocumentPage,
  getAsnDocumentByUserId,
  getAsnDocumentDetailById,
  uploadAsnDocument,
  linkAsnDocument,
  getAsnDocumentRolesByAsnId,
  deleteAsnDocument
}
