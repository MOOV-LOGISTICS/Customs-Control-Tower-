import request from '@/utils/request'

// 获得papco shipping order分页
export function orderFileList(query) {
    return request({
        url: '/order/order-file/list/all',
        method: 'get',
        params: query
    })
}

export function uploadOrderFile(data) {
    return request({
        url: '/order/order-file/upload',
        method: "post",
        //Content-Type请求类型必须设置为multipart/form-data
        headers: {
            "Content-Type": "multipart/form-data",
        },
        // 上传文件
        data,
    })
}

// 删除文件记录
export function deleteOrderFile(orderFileId) {
    return request({
        url: '/order/task/pepco/order-file/remove?orderFileId=' + orderFileId,
        method: 'delete'
    })
}

export function deleteReleaseHBLOrderFile(orderFileId) {
  return request({
    url: '/order/task/pepco/order-file/releaseHBL/remove?orderFileId=' + orderFileId,
    method: 'delete'
  })
}

export function deleteOrderFileByOrderFileId(orderFileId) {
  return request({
    url: '/order/task/pepco/order-file/removeByOrderFileId?orderFileId=' + orderFileId,
    method: 'delete'
  })
}

//钉钉需求：如果类型是Shipping Documents By Email, Document Number设置成Invoice offline，且不可编辑，也禁止上传文件
export function submitWithoutFile(data) {
  return request({
    url: '/order/task/pepco/order-file/submit-without-file',
    method: 'post',
    params: {...data }
  })
}

export function submitOnlyTask(data) {
    return request({
      url: '/order/task/pepco/order-file/submit-only-task',
      method: 'post',
      params: {...data }
    })
  }


export function resaveOrderFile(data) {
    return request({
        url: '/order/order-file/resave',
        method: 'post',
        data: data
    })
  }

  export function reSaveMblOrderFile(data) {
    return request({
        url: '/order/order-file/resave-mbl-file',
        method: 'post',
        data: data
    })
  }

export function updateDocumentNumberById(data) {
  return request({
    url: '/order/order-file/updateDocumentNumberById',
    method: 'put',
    data: data
  })
}
