import request from '@/utils/request'

// 查询schedule列表
export function listSchedule(query) {
  return request({
    url: '/system/schedule/list',
    method: 'get',
    params: query
  })
}

// 查询用户拥有查看权限的carrier
export function listUserSchedules(userId) {
  return request({
    url: '/system/schedule/list-user-schedule?userId=' + userId,
    method: 'get'
  })
}

export function listUserSchedulesDo() {
  return request({
    url: '/system/schedule/list-user-schedule-do',
    method: 'get'
  })
}

// 更新用户schedule的carrier查看权限
export function assignUserSchedule(data) {
  return request({
    url: '/system/schedule/assign-user-schedule',
    method: 'post',
    data: data
  })
}

