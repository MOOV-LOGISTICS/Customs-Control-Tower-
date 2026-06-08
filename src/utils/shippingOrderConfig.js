import { DICT_TYPE, getDictDatas } from '@/utils/dict'

/** shipping_order_config 下 Mix DC 开关项 label */
const MIX_DC_BOOKING_LABEL = 'Open'

/** 字典数据 status：0=开启（CommonStatusEnum.ENABLE） */
const DICT_DATA_STATUS_ENABLE = 0

/**
 * 字典数据是否处于启用状态（status 关闭时整条配置不生效）。
 */
export function isDictDataStatusEnabled(item) {
  if (!item) {
    return false
  }
  if (item.status === undefined || item.status === null) {
    return true
  }
  return Number(item.status) === DICT_DATA_STATUS_ENABLE
}

/**
 * 是否开启 Supplier Booking Mix DC。
 * 须 label=Open、status=开启，且 value 为 1 / true。
 */
export function isMixDcBookingEnabled(getDictDatasFn = getDictDatas) {
  const list = getDictDatasFn(DICT_TYPE.SHIPPING_ORDER_CONFIG) || []
  const item = list.find(d => d.label === MIX_DC_BOOKING_LABEL)
  if (!item || !isDictDataStatusEnabled(item)) {
    return false
  }
  const value = String(item.value ?? '').trim().toLowerCase()
  return value === 'true' || value === '1'
}

/**
 * 原逻辑：所选 PO 的 DC 是否允许合并（须全部相同）。
 */
export function isSameDcForSupplierBooking(dcList) {
  const codes = [...new Set((dcList || []).map(d => (d == null ? '' : String(d).trim())).filter(Boolean))]
  return codes.length <= 1
}

function collectPoDcCodes(orderDcList) {
  return [...new Set((orderDcList || []).map(d => (d == null ? '' : String(d).trim())).filter(Boolean))]
}

/**
 * Supplier Booking 提交时 DC 校验。
 * 开关关闭：PO 须同 DC，且 form.dc 与该 DC 一致。
 * 开关打开：form.dc 必填，且须落在当前 PO 的 DC 集合内（单选，不拼接）。
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateSupplierBookingDcOnSubmit(formDc, orderDcList, getDictDatasFn = getDictDatas) {
  const dc = formDc == null ? '' : String(formDc).trim()
  const poDcs = collectPoDcCodes(orderDcList)

  if (!dc) {
    return { valid: false, message: 'Please select the correct DC' }
  }

  if (isMixDcBookingEnabled(getDictDatasFn)) {
    if (poDcs.length > 0 && !poDcs.includes(dc)) {
      return {
        valid: false,
        message: `Please select the correct DC (PO DC: ${poDcs.join(', ')})`
      }
    }
    return { valid: true }
  }

  if (!isSameDcForSupplierBooking(orderDcList)) {
    return { valid: false, message: 'Please select orders with the same DC' }
  }
  if (poDcs.length > 0 && dc !== poDcs[0]) {
    return {
      valid: false,
      message: `Please select the correct DC (PO DC: ${poDcs[0]})`
    }
  }
  return { valid: true }
}
