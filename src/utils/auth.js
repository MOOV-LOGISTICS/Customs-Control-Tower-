import {decrypt, encrypt} from "@/utils/jsencrypt";

const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'
const TENANTID = 'TENANT_ID'
const TaskKey="TASKSTATUS"
const isUserConfirmRemind = 'isUserConfirmRemind'

// ========== Token 相关 ==========

export function getAccessToken() {
  return localStorage.getItem(AccessTokenKey)
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshTokenKey)
}
export function getTaskStatus() {
  return localStorage.getItem(TaskKey)
}
export function setToken(token) {
  localStorage.setItem(AccessTokenKey, token.accessToken)
  localStorage.setItem(RefreshTokenKey, token.refreshToken)
  localStorage.setItem(TENANTID, token.tenantId)
  localStorage.setItem(TaskKey, token.taskStatus)
}

export function removeToken() {
  localStorage.removeItem(AccessTokenKey)
  localStorage.removeItem(RefreshTokenKey)
  localStorage.removeItem(TENANTID)
  localStorage.removeItem(TaskKey)
  localStorage.removeItem(isUserConfirmRemind)
  
}

// ========== 账号相关 ==========

const UsernameKey = 'USERNAME'
const PasswordKey = 'PASSWORD'
const EmailKey="EMAIL"

const StarKey="star"

const RememberMeKey = 'REMEMBER_ME'

export function getStar() {
  return localStorage.getItem(StarKey)
}

export function setStar(star) {
  localStorage.setItem(StarKey, star)
}

export function removeStar() {
  localStorage.removeItem(StarKey)
}

export function getUsername() {
  return localStorage.getItem(UsernameKey)
}

export function setUsername(username) {
  localStorage.setItem(UsernameKey, username)
}

export function removeUsername() {
  localStorage.removeItem(UsernameKey)
}



export function getEmail() {
  return localStorage.getItem(EmailKey)
}

export function setEmail(email) {
  localStorage.setItem(EmailKey, email)
}

export function removeEmail() {
  localStorage.removeItem(EmailKey)
}



export function getPassword() {
  const password = localStorage.getItem(PasswordKey)
  return password ? decrypt(password) : undefined
}

export function setPassword(password) {
  localStorage.setItem(PasswordKey, encrypt(password))
}

export function removePassword() {
  localStorage.removeItem(PasswordKey)
}

export function getRememberMe() {
  return localStorage.getItem(RememberMeKey) === 'true'
}

export function setRememberMe(rememberMe) {
  localStorage.setItem(RememberMeKey, rememberMe)
}

export function removeRememberMe() {
  localStorage.removeItem(RememberMeKey)
}

// ========== 租户相关 ==========

const TenantIdKey = 'TENANT_ID'
const TenantNameKey = 'TENANT_NAME'

export function getTenantName() {
  return localStorage.getItem(TenantNameKey)
}

export function setTenantName(username) {
  localStorage.setItem(TenantNameKey, username)
}

export function removeTenantName() {
  localStorage.removeItem(TenantNameKey)
}

export function getTenantId() {
  return localStorage.getItem(TenantIdKey)
}

export function setTenantId(username) {
  localStorage.setItem(TenantIdKey, username)
}

export function removeTenantId() {
  localStorage.removeItem(TenantIdKey)
}

export class getToken {
}
