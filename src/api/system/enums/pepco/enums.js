import request from '@/utils/request'

// 获得ApprovalRejectingReasons
export function getApprovalRejectingReasons() {
  return request({
    url: '/system/enums/pepco/reject/reason',
    method: 'get'
  })
}