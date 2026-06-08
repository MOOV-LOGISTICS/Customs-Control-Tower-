/**
 *
 * @param {Object.<string, Array>} params
 */
function queryStringify(params) {
  if (params) {
    const key = Object.keys(params)[0]
    if (!Array.isArray(params[key])) {
      return
    }
    let stringifyParams = ''
    params[key].forEach((value, index) => {
      if (index === params[key].length - 1) {
        stringifyParams += `${key}=${value}`
      } else {
        stringifyParams += `${key}=${value}&`
      }
    })
    return stringifyParams
  }
}

export {
  queryStringify
}
