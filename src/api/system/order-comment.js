import request from '@/utils/request'

// 创建订单行
export function createOrderComment(data) {
    return request({
        url: '/system/order/comment/create',
        method: 'post',
        data: data
    })
}

// 更新订单行
export function updateOrderComment(data) {
    return request({
        url: '/system/order/comment/update',
        method: 'put',
        data: data
    })
}

// 删除订单行
export function deleteOrderComment(id) {
    return request({
        url: '/system/order/comment/delete?id=' + id,
        method: 'delete'
    })
}

// 获得订单行
export function orderCommentDetail(id) {
    return request({
        url: '/system/order/comment/get?id=' + id,
        method: 'get'
    })
}

// 获得订单行分页
export function orderCommentPage(query) {
    return request({
        url: '/system/order/comment/list/page',
        method: 'get',
        params: query
    })
}

// 获得订单评论行
export function orderCommentAll(query) {
    return request({
        url: '/system/order/comment/list/all',
        method: 'get',
        params: query
    })
}