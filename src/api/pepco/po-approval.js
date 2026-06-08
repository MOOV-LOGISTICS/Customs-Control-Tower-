import request from '@/utils/request'


export function searchPoApprovalByOrderNumber(orderNumber) {
    return request({
        url: '/pepco/po/approval/search-by-order-number?orderNumber=' + orderNumber,
        method: 'get'
    })
}
export function poApprovalDetail(approvalInfoId) {
    return request({
        url: '/pepco/po/approval/detail',
        method: 'get',
        params: { approvalInfoId }
    })
}

export function createPoApproval(data) {
    return request({
        url: '/pepco/po/approval/create',
        method: 'post',
        data: data
    })
}

export function processPoCrdApproval(data) {
    return request({
        url: '/pepco/po/approval/process/po-crd',
        method: 'post',
        data: data
    })
}