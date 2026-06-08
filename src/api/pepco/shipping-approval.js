import request from '@/utils/request'


export function shippingApprovalPage(query) {
    return request({
        url: '/pepco/shipping/approval/list/page',
        method: 'get',
        params: query
    })
}

export function shippingApprovalDetail(approvalInfoId) {
    return request({
        url: '/pepco/shipping/approval/detail',
        method: 'get',
        params: { approvalInfoId }
    })
}

export function createShippingApproval(data) {
    return request({
        url: '/pepco/shipping/approval/create',
        method: 'post',
        data: data
    })
}

export function createShippingQtyApproval(data) {
    return request({
        url: '/pepco/shipping/approval/qty/create',
        method: 'post',
        data: data
    })
}

export function processRemovePoApproval(data) {
    return request({
        url: '/pepco/shipping/approval/process/remove-po',
        method: 'post',
        data: data
    })
}

export function processAddPoApproval(data) {
    return request({
        url: '/pepco/shipping/approval/process/add-po',
        method: 'post',
        data: data
    })
}

export function processPoQtyApproval(data) {
    return request({
        url: '/pepco/shipping/approval/process/po-qty',
        method: 'post',
        data: data
    })
}

export function orderListByShipping(shippingOrderId) {
    return request({
        url: '/pepco/shipping/approval/po-list',
        method: 'get',
        params: { shippingOrderId }
    })
}
