import request from '@/utils/request'


export function bookingScorePage(query) {
    return request({
        url: '/pepco/booking-score/list/page',
        method: 'get',
        params: query
    })
}

export function bookingScoreList(query) {
    return request({
        url: '/pepco/booking-score/list/all',
        method: 'get',
        params: query
    })
}

export function underScoringPage(query) {
    return request({
        url: '/pepco/booking-score/under-scoring/list/page',
        method: 'get',
        params: query
    })
}

export function underScoringDownload(query) {
    return request({
        url: '/pepco/booking-score/under-scoring/download',
        method: 'get',
        params: query,
        responseType: 'blob',
        timeout: '1200000'
    })
}

export function underScoringSubmit(data) {
    return request({
        url: '/pepco/booking-score/under-scoring/submit',
        method: 'post',
        data: data
    })
}