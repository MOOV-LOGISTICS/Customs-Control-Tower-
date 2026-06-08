import request from '@/utils/request'

// 创建shipment_note
export function createNote(data) {
  return request({
    url: '/shipment/note/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_note
export function updateNote(data) {
  return request({
    url: '/shipment/note/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_note
export function deleteNote(id) {
  return request({
    url: '/shipment/note/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_note
export function getNote(id) {
  return request({
    url: '/shipment/note/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_note分页
export function getNotePage(query) {
  return request({
    url: '/shipment/note/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_note Excel
export function exportNoteExcel(query) {
  return request({
    url: '/shipment/note/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
