import { login, logout, getInfo, socialLogin, smsLogin } from '@/api/login'
import { getUserCompanyTypeList, getAllUsersIncludeDeleted } from '@/api/system/user'
import { setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: 0, // 用户编号
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userCompanyTypes: [],
    allUsersIncludeDeleted: [],
    signal: false,
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USER_COMPANY_TYPES: (state, userCompanyTypes) => {
      state.userCompanyTypes = userCompanyTypes
    },
    // 设置包含已删除的用户列表
    SET_ALL_USERS_INCLUDE_DELETED: (state, list) => {
      state.allUsersIncludeDeleted = list
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const captchaVerification = userInfo.captchaVerification
      const socialCode = userInfo.socialCode
      const socialState = userInfo.socialState
      const socialType = userInfo.socialType
      const privacyPolicy = userInfo.privacyPolicy
      const email = userInfo.email
      const captchaToken = userInfo.captchaToken;
      const emailAuthCode = userInfo.emailAuthCode;
      return new Promise((resolve, reject) => {
        login(username, password,email, captchaVerification, socialType, socialCode, socialState, privacyPolicy, captchaToken, emailAuthCode).then(res => {
          res = res.data;
          // 设置 token
          setToken(res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 社交登录
    SocialLogin({ commit }, userInfo) {
      const code = userInfo.code
      const state = userInfo.state
      const type = userInfo.type
      return new Promise((resolve, reject) => {
        socialLogin(type, code, state).then(res => {
          res = res.data;
          // 设置 token
          setToken(res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 短信登录
    SmsLogin({ commit }, userInfo) {
      const mobile = userInfo.mobile.trim()
      const mobileCode = userInfo.mobileCode
      return new Promise((resolve, reject) => {
        smsLogin(mobile, mobileCode).then(res => {
          res = res.data;
          // 设置 token
          setToken(res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          // 没有 data 数据，赋予个默认值
          if (!res) {
            res = {
              data: {
                roles: [],
                user: {
                  id: '',
                  avatar: '',
                  userName: '',
                  nickname: ''
                }
              }
            }
          }

          res = res.data; // 读取 data 数据
          const user = res.user
          const avatar = (user.avatar === "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_ID', user.id)
          commit('SET_NAME', user.userName)
          commit('SET_NICKNAME', user.nickname)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户所属公司类型列表
    GetUserCompanyTypes({ commit }) {
      return new Promise((resolve, reject) => {
        getUserCompanyTypeList().then(res => {
          console.log("getUserCompanyTypes", res)
          const userCompanyTypes = res.data || []
          commit('SET_USER_COMPANY_TYPES', userCompanyTypes)
          resolve(userCompanyTypes)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取包含已删除的用户列表
    async fetchAllUsersIncludeDeleted({ commit, state }) {
      if (!state.signal) {
        state.signal = true;
        try {
          const response = await getAllUsersIncludeDeleted();
          commit('SET_ALL_USERS_INCLUDE_DELETED', response.data || []);
          setTimeout(() => {
            state.signal = false;
            console.log('-------user signal reset---------------');
          }, 4000);
        } catch (error) {
          console.error('Failed to fetch all users include deleted:', error);
          state.signal = false;
          throw error;
        }
      }
    }
  }
}

export default user






