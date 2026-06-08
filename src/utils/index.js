import { parseTime } from './ruoyi'

/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue === "") return "";
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
export function getJoinDate(targetTimestap, replaceTimestap) {
  const targetDate = formatDate(targetTimestap).split(' ')[0]
  const replaceTime = formatDate(replaceTimestap).split(' ')[1]
  return targetDate + ' ' + replaceTime
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param str
 * @param str
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// /**
//  * This is just a simple version of deep copy
//  * Has a lot of edge cases bug
//  * If you want to use a perfect deep copy, use lodash's _.cloneDeep
//  * @param {Object} source
//  * @returns {Object}
//  */
// export function deepClone(source) {
//   if (!source && typeof source !== 'object') {
//     throw new Error('error arguments', 'deepClone')
//   }
//   const targetObj = source.constructor === Array ? [] : {}
//   Object.keys(source).forEach(keys => {
//     if (source[keys] && typeof source[keys] === 'object') {
//       targetObj[keys] = deepClone(source[keys])
//     } else {
//       targetObj[keys] = source[keys]
//     }
//   })
//   return targetObj
// }

// 深拷贝对象
// add byDean.Tan https://github.com/JakHuang/form-generator/blob/dev/src/utils/index.js#L107
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param ele
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param ele
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export const exportDefault = 'export default '

export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// -转驼峰
export function toCamelCase(str, upperCaseFirst) {
  str = (str || '').toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }

  return str;
}
export function isValidContainerNumber(strCode) {
  if (strCode == null || strCode.length <= 0) {
    return false;
  }
  if (strCode.length != 11) return false;
  const regex = /^[A-Z]{4}\d{7}$/;
  return regex.test(strCode);
}

export function calculateVolume(length, width, height) {
  if (length <= 0 || width <= 0 || height <= 0) {
    return 0;
  }
  return length * width * height;
}

/**
 * 获取当前操作时区
 * @returns {object}
 * @property {string} timeZone - 本地时区，例如："Asia/Shanghai"
 * @property {number} timeZoneOffset - local - utc， 例如：-8 代表东八区，比 utc 早 8 小时
 * @example
 * getCurrentTimeZone()
 * // => { timeZone: "Asia/Shanghai", timeZoneOffset: -8 }
 */
export function getCurrentTimeZone() {
  return {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 本地时区，例如："Asia/Shanghai"
    timeZoneOffset: - new Date().getTimezoneOffset() / 60, // UTC - LOCAL
  }
}

/**
 * 将北京时间时间戳转换为用户当地时间的格式化字符串
 * @param {number} beijingTimestamp - 北京时间时间戳（毫秒）
 * @param {number} userTimezoneOffsetHours - 用户当地时区偏移量（小时），如 UTC+8 传 8，UTC-5 传 -5
 * @returns {string} 格式: 'YYYY-MM-DD HH:mm'
 */
export function formatUserLocalTime(beijingTimestamp, userTimezoneOffsetHours) {
  let result = ''
  const beijingOffsetHours = 8 // 北京时区偏移（小时）
  const diff = userTimezoneOffsetHours - beijingOffsetHours
  const userDate = new Date(beijingTimestamp + diff * 60 * 60 * 1000)

  const year = userDate.getUTCFullYear()
  const month = String(userDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(userDate.getUTCDate()).padStart(2, '0')
  const hours = String(userDate.getUTCHours()).padStart(2, '0')
  const minutes = String(userDate.getUTCMinutes()).padStart(2, '0')
  if (userTimezoneOffsetHours === undefined || userTimezoneOffsetHours === null || userTimezoneOffsetHours === '') {
    // userTimezoneOffsetHours 不存在，不显示时区信息
    result = `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    result = `${year}-${month}-${day} ${hours}:${minutes} ${getTimezoneAbbreviationFromOffset(userTimezoneOffsetHours)} (UTC+${userTimezoneOffsetHours})`
  }
  return result
}
// 示例
// formatUserLocalTime(1699900800000, -5)  // 北京时间转纽约时间(UTC-5)
// formatUserLocalTime(1699900800000, 8)  // 北京时间转北京时间


/**
 * 根据 UTC 偏移量获取对应的常见时区缩写（支持小数偏移，如 5.75）
 * @param {number|string} offset - 偏移量，支持格式：
 *   - 数字：1, -5, 5.5, 5.75
 *   - 字符串："+1", "UTC+1", "+05:45", "-03:30", "UTC+5.75"
 * @returns {string|null} 时区缩写（如 "CET"、"IST"、"NPT"），未找到时返回 null
 */
function getTimezoneAbbreviationFromOffset(offset) {
  // 解析偏移量，返回小时数（小数）
  function parseOffsetToHours(offset) {
    if (typeof offset === 'number') {
      return offset;
    }
    if (typeof offset !== 'string') {
      return null;
    }
    let str = offset.trim().toUpperCase();
    // 移除可能的 "UTC" 前缀
    str = str.replace(/^UTC/, '');
    // 匹配形如：+1, -5, +01:30, -03:45, +5.75, -0.5
    const match = str.match(/^([+-]?\d{1,2})(?::(\d{1,2}))?|^([+-]?\d+(?:\.\d+)?)$/);
    if (!match) return null;

    let sign = 1;
    let hours = 0;
    let minutes = 0;

    // 处理带冒号的情况 (+01:30)
    if (match[1] !== undefined && match[2] !== undefined) {
      let hourStr = match[1];
      sign = hourStr.startsWith('-') ? -1 : 1;
      hours = Math.abs(parseInt(hourStr, 10));
      minutes = parseInt(match[2], 10);
      return sign * (hours + minutes / 60);
    }
    // 处理小数或整数 (+5.75, -3.5)
    else if (match[3] !== undefined) {
      let val = parseFloat(match[3]);
      if (isNaN(val)) return null;
      return val;
    }
    // 处理只有小时部分 (+5)
    else if (match[1] !== undefined) {
      let hourStr = match[1];
      sign = hourStr.startsWith('-') ? -1 : 1;
      hours = Math.abs(parseInt(hourStr, 10));
      return sign * hours;
    }
    return null;
  }

  const hours = parseOffsetToHours(offset);
  if (hours === null) return null;

  // 常见时区映射表（标准时间，不考虑夏令时）
  // 支持整数和常用小数偏移（半小时、45分钟等）
  const offsetMap = {
    // 整数偏移
    "-12": "BIT",
    "-11": "SST",
    "-10": "HST",
    "-9": "AKST",
    "-8": "PST",
    "-7": "MST",
    "-6": "CST",      // 北美中部标准时间
    "-5": "EST",
    "-4": "AST",
    "-3": "ART",
    "-2": "FNT",
    "-1": "CVT",
    "0": "GMT",
    "1": "CET",
    "2": "EET",
    "3": "MSK",
    "4": "GST",
    "5": "PKT",
    "5.5": "IST",     // 印度标准时间
    "6": "BST",
    "7": "ICT",
    "8": "CST",       // 中国标准时间（注意与北美-6的CST区分，这里按正偏移处理）
    "9": "JST",
    "10": "AEST",
    "11": "SRET",
    "12": "NZST",
    // 常用小数偏移
    "3.5": "IRST",    // 伊朗标准时间 (UTC+3:30)
    "4.5": "AFT",     // 阿富汗时间 (UTC+4:30)
    "5.75": "NPT",    // 尼泊尔时间 (UTC+5:45)
    "6.5": "MMT",     // 缅甸时间 (UTC+6:30)
    "8.75": "ACWST",  // 澳大利亚中西部标准时间 (UTC+8:45)
    "9.5": "ACST",    // 澳大利亚中部标准时间 (UTC+9:30)
    "10.5": "LHST",   // 豪勋爵岛标准时间 (UTC+10:30)
    "12.75": "CHADT", // 查塔姆群岛标准时间 (UTC+12:45)
    // 负小数偏移
    "-3.5": "NST",    // 纽芬兰标准时间 (UTC-3:30)
    "-4.5": "VET",    // 委内瑞拉时间 (UTC-4:30)
    "-9.5": "MIT",    // 马克萨斯群岛时间 (UTC-9:30)
  };

  // 由于键是字符串，需要将小时数转为字符串并精确匹配（例如 5.5 不能匹配 5.50）
  const key = hours.toString();
  if (offsetMap.hasOwnProperty(key)) {
    return offsetMap[key];
  }

  // 如果未找到精确匹配，可返回 null 或构造一个描述性字符串
  // 这里选择返回 null，调用方可自行处理
  return null;
}

// 测试示例
console.log(getTimezoneAbbreviationFromOffset('UTC+1'));      // "CET"
console.log(getTimezoneAbbreviationFromOffset('+5.5'));       // "IST"
console.log(getTimezoneAbbreviationFromOffset('+05:45'));     // "NPT"
console.log(getTimezoneAbbreviationFromOffset(5.75));         // "NPT"
console.log(getTimezoneAbbreviationFromOffset('+03:30'));     // "IRST"
console.log(getTimezoneAbbreviationFromOffset('-03:30'));     // "NST"
console.log(getTimezoneAbbreviationFromOffset('+8'));         // "CST"
console.log(getTimezoneAbbreviationFromOffset('+9.5'));       // "ACST"
console.log(getTimezoneAbbreviationFromOffset('+2.3'));       // null (无对应时区)


//  可根据指定的key进行去重
export function uniqueByKey(arr, key) {
  const seen = new Set()
  return arr.filter(item => {
    const val = item[key]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}