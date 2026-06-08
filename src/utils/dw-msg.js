import {Message, MessageBox} from 'element-ui'

export function msgError (message) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
}
export function msgInfo (message) {
  Message({
    message: message,
    type: 'info',
    duration: 5 * 1000
  })
}
