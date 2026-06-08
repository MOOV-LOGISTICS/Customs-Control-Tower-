/**
 * 反向操作权限处理 - 没有权限时显示
 * 使用：v-noPermi="['system:xxx:yyy']"
 */
import store from '@/store'

export default {
  inserted(el, binding) {

    const { value } = binding
    const all_permission = "*:*:*"
    const permissions = store.getters && store.getters.permissions
    if (value && Array.isArray(value) && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      // 👇 如果有权限，移除这个元素（反向逻辑）
      if (hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置权限标签值，例如 v-noPermi="['system:user:add']"`)
    }
  }
}
