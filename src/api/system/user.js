import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

// 获取用户精简信息列表
export function listSimpleUsers() {
  return request({
    url: '/system/user/list-all-simple',
    method: 'get'
  })
}
// 获取所有用户精简信息列表
export function allUsers() {
  return request({
    url: '/system/user/all-user',
    method: 'get'
  })
}

export function getAllUsersIncludeDeleted() {
  return request({
    url: '/system/user/all-list',
    method: 'get'
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/get?id=' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 查询用户详细,区别于 getUser ，该方法纯粹，不掺杂任何修改，只拿用户信息
export function getUserInfo(userId) {
  return request({
    url: '/system/user/info/get?id=' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return getPublicKey().then(res => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(res.data);
    var _password = encrypt.encrypt(data.password);
    return request({
      url: '/system/user/create',
      method: 'post',
      data: { ...data, password: _password }
    });
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/delete?id=' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 用户密码重置
// export function resetUserPwd(id, _password) {
//    getPublicKey().then(res=>{
//     var encrypt = new JSEncrypt();
//     encrypt.setPublicKey(res.data);
//     var password = encrypt.encrypt(_password)
//       return request({
//         url: '/system/user/update-password',
//         method: 'put',
//         data: {id,password}
//       })
//   })
// }

/**Carrie 2025-11-06 接口增加password容错 */
export async function resetUserPwd(id, _password) {
  const password =  _password ? await getPublicKey().then(res => {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(res.data);
       return encrypt.encrypt(_password)
    }) :null
  return request({
      url: '/system/user/update-password',
      method: 'put',
      data: { id, password }
    })
  // if (_password) {
  //   getPublicKey().then(res => {
  //     var encrypt = new JSEncrypt();
  //     encrypt.setPublicKey(res.data);
  //     var password = encrypt.encrypt(_password)
  //     return request({
  //       url: '/system/user/update-password',
  //       method: 'put',
  //       data: { id, password }
  //     })
  //   })
  // }else{
  //   return request({
  //     url: '/system/user/update-password',
  //     method: 'put',
  //     data: { id, }
  //   })
  // }
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/user/update-status',
    method: 'put',
    data: data
  })
}

// 用户子管理员状态修改
export function changeUserSubAdminStatus(id, subAdmin) {
  const data = {
    id,
    subAdmin
  }
  return request({
    url: '/system/user/update-subAdmin',
    method: 'patch',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile/get',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile/update',
    method: 'put',
    data: data
  })
}

import JSEncrypt from 'jsencrypt';
import { getPublicKey } from "@/api/utils/utils";

// 用户密码重置
export function updateUserPwd(_oldPassword, _newPassword) {
  return getPublicKey().then(res => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(res.data);
    var oldPassword = encrypt.encrypt(_oldPassword)
    var newPassword = encrypt.encrypt(_newPassword)
    return request({
      url: '/system/user/profile/update-password',
      method: 'put',
      data: { oldPassword, newPassword }
    })
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/update-avatar',
    method: 'put',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}

export function getUserCustomerList() {
  return request({
    url: '/system/user/profile/getUserCustomerList',
    method: 'get'
  })
}

// 获取用户所在的公司类型列表
export function getUserCompanyTypeList() {
  return request({
    url: '/system/user/pepco/get-company-type-list',
    method: 'get'
  })
}
