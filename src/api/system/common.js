import request from '@/utils/request'


export function getProgress(progressId) {
    return request({
        url: '/system/common/progress',
        method: 'get',
        params: { progressId }
    })
}

export function updateProgress(progressId) {
    return request({
        url: '/system/common/progress/update',
        method: 'get',
        params: { progressId }
    })
}