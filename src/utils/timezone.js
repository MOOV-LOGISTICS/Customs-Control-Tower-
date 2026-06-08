import { getTimeZones } from "@vvo/tzdb";
import {parseUTCTimeWithHM} from "@/utils/ruoyi";

/**
 * 将时间戳按指定 IANA 时区格式化为：
 * YYYY-MM-DD HH:mm TZ (UTC ±H[:mm])
 *
 * 例如：
 * 2026-04-10 08:23 CST (UTC +8)
 * 2026-04-10 03:23 EEST (UTC +3)
 * 2026-04-09 19:23 CDT (UTC -5)
 *
 * @param {number|string|Date} timestamp
 * @param {string} timeZone - IANA 时区，如 Asia/Shanghai、Europe/Athens、America/Chicago
 * @returns {string}
 */
export function formatLocalTimeByTimestamp(timestamp, timeZone) {
    console.log('formatLocalTimeByTimestamp called with:', { timestamp, timeZone })
    const date = normalizeToDate(timestamp)
    const timeZones = getTimeZones();
    if (!date || !isValidTimeZone(timeZone)) return ''

    try {
        const dateTimeParts = getDateTimeParts(date, timeZone)
        const utcOffsetText = getUtcOffsetText(date, timeZone)
        const offsetMinutes = getOffsetMinutesFromUtcText(utcOffsetText)
        const timeZoneAbbr =  timeZones.find(tz => tz.name === timeZone).abbreviation  || getTimeZoneAbbr(date, timeZone, offsetMinutes)

        return `${dateTimeParts.year}-${dateTimeParts.month}-${dateTimeParts.day} ${dateTimeParts.hour}:${dateTimeParts.minute} ${timeZoneAbbr} (${utcOffsetText})`
    } catch (error) {
        console.error('formatLocalTimeByTimestamp error:', error)
        return ''
    }
}

/**
 * 规范化输入为 Date
 */
function normalizeToDate(input) {
    if (input instanceof Date) {
        return Number.isNaN(input.getTime()) ? null : input
    }

    if (typeof input === 'number') {
        if (!Number.isFinite(input)) return null
        const date = new Date(input)
        return Number.isNaN(date.getTime()) ? null : date
    }

    if (typeof input === 'string') {
        const value = input.trim()
        if (!value) return null

        // 纯数字字符串按时间戳处理
        if (/^-?\d+$/.test(value)) {
            const date = new Date(Number(value))
            return Number.isNaN(date.getTime()) ? null : date
        }

        // 其他字符串尝试解析
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? null : date
    }

    return null
}

/**
 * 校验 IANA 时区是否合法
 */
function isValidTimeZone(timeZone) {
    if (typeof timeZone !== 'string' || !timeZone.trim()) return false

    try {
        new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date())
        return true
    } catch {
        return false
    }
}

/**
 * 获取年月日时分
 */
function getDateTimeParts(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    const parts = formatter.formatToParts(date)
    const map = {}

    for (const part of parts) {
        if (part.type !== 'literal') {
            map[part.type] = part.value
        }
    }

    return {
        year: map.year,
        month: map.month,
        day: map.day,
        hour: map.hour,
        minute: map.minute
    }
}

/**
 * 获取 UTC 偏移文本，标准化为：
 * UTC +8
 * UTC -5
 * UTC +5:30
 */
function getUtcOffsetText(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset'
    })

    const raw =
        formatter.formatToParts(date).find(part => part.type === 'timeZoneName')
            ?.value || 'GMT'

    return normalizeOffsetText(raw)
}

/**
 * 规范化 offset 文本
 * GMT+8 -> UTC +8
 * GMT+08:00 -> UTC +8
 * GMT-05:00 -> UTC -5
 * GMT+05:30 -> UTC +5:30
 * GMT -> UTC +0
 */
function normalizeOffsetText(rawOffset) {
    if (!rawOffset || rawOffset === 'GMT') {
        return 'UTC +0'
    }

    const text = rawOffset.replace(/^GMT/i, '').trim()
    if (!text) return 'UTC +0'

    const match = text.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/)
    if (!match) {
        return rawOffset.replace(/^GMT/i, 'UTC')
    }

    const [, sign, hourStr, minuteStr = '00'] = match
    const hour = String(Number(hourStr))
    const minute = Number(minuteStr)

    if (minute === 0) {
        return `UTC ${sign}${hour}`
    }

    return `UTC ${sign}${hour}:${minuteStr}`
}

/**
 * 把 UTC +8 / UTC -5 / UTC +5:30 转成分钟
 */
function getOffsetMinutesFromUtcText(utcText) {
    const match = utcText.match(/^UTC\s([+-])(\d{1,2})(?::(\d{2}))?$/)
    if (!match) return 0

    const [, sign, hourStr, minuteStr = '00'] = match
    const total = Number(hourStr) * 60 + Number(minuteStr)

    return sign === '+' ? total : -total
}

/**
 * 获取时区缩写
 * 策略：
 * 1. 优先用 Intl 原生 short
 * 2. 如果拿到的是 GMT+8 / UTC+8 这种通用值，则用兜底映射
 * 3. 兜底也没有时，返回 UTC+8 这种安全结果
 */
function getTimeZoneAbbr(date, timeZone, offsetMinutes) {
    const rawAbbr = getRawTimeZoneAbbr(date, timeZone)

    if (isUsefulAbbr(rawAbbr)) {
        return rawAbbr
    }

    const fallback = getFallbackTimeZoneAbbr(timeZone, offsetMinutes)
    if (fallback) {
        return fallback
    }

    return buildGenericAbbrFromOffset(offsetMinutes)
}

/**
 * 取 Intl 原生 short 缩写
 */
function getRawTimeZoneAbbr(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short'
    })

    return (
        formatter.formatToParts(date).find(part => part.type === 'timeZoneName')
            ?.value || ''
    )
}

/**
 * 判断原生缩写是否“有意义”
 * 例如 CST / CDT / EET / EEST / JST 是有意义的
 * GMT+8 / UTC+8 / GMT-5 这种不是我们想要的最终缩写
 */
function isUsefulAbbr(value) {
    if (!value) return false

    const upper = value.toUpperCase()

    if (/^(GMT|UTC)/.test(upper)) return false
    if (/^[+-]?\d/.test(upper)) return false

    return true
}

/**
 * 常见时区兜底映射
 * key: IANA 时区
 * value: { [offsetMinutes]: abbreviation }
 *
 * 说明：
 * - 同一个地区夏令时/冬令时 offset 不同，因此按 offset 区分
 * - 尽量覆盖常见国家/地区
 */
const TIME_ZONE_ABBR_MAP = {
    // China
    'Asia/Shanghai': { 480: 'CST' },
    'Asia/Chongqing': { 480: 'CST' },
    'Asia/Harbin': { 480: 'CST' },
    'Asia/Urumqi': { 480: 'CST' },

    // Japan / Korea
    'Asia/Tokyo': { 540: 'JST' },
    'Asia/Seoul': { 540: 'KST' },

    // Southeast Asia
    'Asia/Bangkok': { 420: 'ICT' },
    'Asia/Ho_Chi_Minh': { 420: 'ICT' },
    'Asia/Jakarta': { 420: 'WIB' },
    'Asia/Makassar': { 480: 'WITA' },
    'Asia/Jayapura': { 540: 'WIT' },
    'Asia/Singapore': { 480: 'SGT' },
    'Asia/Kuala_Lumpur': { 480: 'MYT' },
    'Asia/Manila': { 480: 'PHT' },

    // South Asia
    'Asia/Kolkata': { 330: 'IST' },
    'Asia/Colombo': { 330: 'IST' },
    'Asia/Kathmandu': { 345: 'NPT' },
    'Asia/Dhaka': { 360: 'BST' },
    'Asia/Karachi': { 300: 'PKT' },

    // Middle East
    'Asia/Dubai': { 240: 'GST' },
    'Asia/Tehran': { 210: 'IRST' },
    'Asia/Jerusalem': { 120: 'IST', 180: 'IDT' },
    'Asia/Riyadh': { 180: 'AST' },

    // Western/Central/Eastern Europe
    'Europe/London': { 0: 'GMT', 60: 'BST' },
    'Europe/Dublin': { 0: 'GMT', 60: 'IST' },
    'Europe/Lisbon': { 0: 'WET', 60: 'WEST' },
    'Europe/Madrid': { 60: 'CET', 120: 'CEST' },
    'Europe/Paris': { 60: 'CET', 120: 'CEST' },
    'Europe/Berlin': { 60: 'CET', 120: 'CEST' },
    'Europe/Rome': { 60: 'CET', 120: 'CEST' },
    'Europe/Amsterdam': { 60: 'CET', 120: 'CEST' },
    'Europe/Brussels': { 60: 'CET', 120: 'CEST' },
    'Europe/Zurich': { 60: 'CET', 120: 'CEST' },
    'Europe/Vienna': { 60: 'CET', 120: 'CEST' },
    'Europe/Prague': { 60: 'CET', 120: 'CEST' },
    'Europe/Warsaw': { 60: 'CET', 120: 'CEST' },
    'Europe/Athens': { 120: 'EET', 180: 'EEST' },
    'Europe/Bucharest': { 120: 'EET', 180: 'EEST' },
    'Europe/Helsinki': { 120: 'EET', 180: 'EEST' },
    'Europe/Kiev': { 120: 'EET', 180: 'EEST' },
    'Europe/Kyiv': { 120: 'EET', 180: 'EEST' },
    'Europe/Istanbul': { 180: 'TRT' },
    'Europe/Moscow': { 180: 'MSK' },

    // North America
    'America/New_York': { '-300': 'EST', '-240': 'EDT' },
'America/Detroit': { '-300': 'EST', '-240': 'EDT' },
'America/Toronto': { '-300': 'EST', '-240': 'EDT' },
'America/Montreal': { '-300': 'EST', '-240': 'EDT' },
'America/Chicago': { '-360': 'CST', '-300': 'CDT' },
'America/Winnipeg': { '-360': 'CST', '-300': 'CDT' },
'America/Denver': { '-420': 'MST', '-360': 'MDT' },
'America/Edmonton': { '-420': 'MST', '-360': 'MDT' },
'America/Los_Angeles': { '-480': 'PST', '-420': 'PDT' },
'America/Vancouver': { '-480': 'PST', '-420': 'PDT' },
'America/Anchorage': { '-540': 'AKST', '-480': 'AKDT' },
'Pacific/Honolulu': { '-600': 'HST' },
'America/Phoenix': { '-420': 'MST' },
'America/Halifax': { '-240': 'AST', '-180': 'ADT' },
'America/St_Johns': { '-210': 'NST', '-150': 'NDT' },

// Latin America
'America/Sao_Paulo': { '-180': 'BRT' },
'America/Buenos_Aires': { '-180': 'ART' },
'America/Santiago': { '-240': 'CLT', '-180': 'CLST' },
'America/Bogota': { '-300': 'COT' },
'America/Lima': { '-300': 'PET' },
'America/Mexico_City': { '-360': 'CST', '-300': 'CDT' },

// Africa
'Africa/Cairo': { 120: 'EET', 180: 'EEST' },
'Africa/Johannesburg': { 120: 'SAST' },
'Africa/Nairobi': { 180: 'EAT' },
'Africa/Lagos': { 60: 'WAT' },

// Australia / NZ / Pacific
'Australia/Perth': { 480: 'AWST' },
'Australia/Adelaide': { 570: 'ACST', 630: 'ACDT' },
'Australia/Darwin': { 570: 'ACST' },
'Australia/Brisbane': { 600: 'AEST' },
'Australia/Sydney': { 600: 'AEST', 660: 'AEDT' },
'Australia/Melbourne': { 600: 'AEST', 660: 'AEDT' },
'Australia/Hobart': { 600: 'AEST', 660: 'AEDT' },
'Pacific/Auckland': { 720: 'NZST', 780: 'NZDT' },
'Pacific/Chatham': { 765: 'CHAST', 825: 'CHADT' },
'Pacific/Fiji': { 720: 'FJT' }
}

/**
 * 先查精确时区，再尝试同地区常见别名
 */
function getFallbackTimeZoneAbbr(timeZone, offsetMinutes) {
    const exact = TIME_ZONE_ABBR_MAP[timeZone]
    if (exact && exact[offsetMinutes]) {
        return exact[offsetMinutes]
    }

    // 某些区域别名处理
    const alias = getAliasTimeZone(timeZone)
    if (alias) {
        const aliasMap = TIME_ZONE_ABBR_MAP[alias]
        if (aliasMap && aliasMap[offsetMinutes]) {
            return aliasMap[offsetMinutes]
        }
    }

    return ''
}

function getAliasTimeZone(timeZone) {
    const aliases = {
        'US/Eastern': 'America/New_York',
        'US/Central': 'America/Chicago',
        'US/Mountain': 'America/Denver',
        'US/Pacific': 'America/Los_Angeles',
        'Etc/UTC': 'UTC'
    }

    return aliases[timeZone] || ''
}

/**
 * 最后兜底：拼成 UTC+8 / UTC-5 / UTC+5:30
 */
function buildGenericAbbrFromOffset(offsetMinutes) {
    const sign = offsetMinutes >= 0 ? '+' : '-'
    const abs = Math.abs(offsetMinutes)
    const hours = Math.floor(abs / 60)
    const minutes = abs % 60

    if (minutes === 0) {
        return `UTC${sign}${hours}`
    }

    return `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`
}


/**
 * 将北京时间时间戳转换为用户当地时间的格式化字符串
 * @param {number} beijingTimestamp - 北京时间时间戳（毫秒）
 * @param {number} userTimezoneOffsetHours - 用户当地时区偏移量（小时），如 UTC+8 传 8，UTC-5 传 -5
 * @returns {string} 格式: 'YYYY-MM-DD HH:mm'
 */
export function formatUserLocalTime(beijingTimestamp, timeZone, userTimezoneOffsetHours) {
  //空时区数据
  if(!timeZone || !userTimezoneOffsetHours) {
    // 不存在时区或偏移量，返回 UTC 时间
    return parseUTCTimeWithHM(beijingTimestamp)
  }

  let result = ''
//   const beijingOffsetHours = 8 // 北京时区偏移（小时）
//   const diff = userTimezoneOffsetHours - beijingOffsetHours
  const userDate = new Date(beijingTimestamp + userTimezoneOffsetHours * 60 * 60 * 1000)

  const timeZones = getTimeZones();
  const timeZoneAbbr =  timeZones.find(tz => tz.name === timeZone)?.abbreviation || ''

  const year = userDate.getUTCFullYear()
  const month = String(userDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(userDate.getUTCDate()).padStart(2, '0')
  const hours = String(userDate.getUTCHours()).padStart(2, '0')
  const minutes = String(userDate.getUTCMinutes()).padStart(2, '0')
  if (userTimezoneOffsetHours === undefined || userTimezoneOffsetHours === null || userTimezoneOffsetHours === '') {
    // userTimezoneOffsetHours 不存在，不显示时区信息
    result = `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    if(userTimezoneOffsetHours >=0) {
        userTimezoneOffsetHours = `+${userTimezoneOffsetHours}`
    }else{
        userTimezoneOffsetHours = `${userTimezoneOffsetHours}`
    }
    if(timeZoneAbbr) {
        result = `${year}-${month}-${day} ${hours}:${minutes} ${timeZoneAbbr} (UTC${userTimezoneOffsetHours})`
    } else {
        result = `${year}-${month}-${day} ${hours}:${minutes} (UTC${userTimezoneOffsetHours})`
    }
  }
  return result
}

// 测试
window.formatUserLocalTime = formatUserLocalTime
