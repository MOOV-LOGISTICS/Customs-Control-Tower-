// toast.js
import Vue from 'vue'
import ToastComponent from './index.vue'

const ToastConstructor = Vue.extend(ToastComponent)
let toastId = 0
const toastQueue = []
const defaultOptions = {
    position: 'top-center',
    duration: 3000,
    closable: true,
    showIcon: true
}
const createToast = (message, options = {}) => {
    const mergedOptions = { ...defaultOptions, ...options }

    const id = toastId++

    const instance = new ToastConstructor({
        el: document.createElement('div'),
        propsData: {
            message,
            ...mergedOptions,
            ...options,
            onClose: () => {
                removeToast(id)
                document.body.removeChild(instance.$el)
                instance.$destroy()
            }
        }
    })

    toastQueue.push({ id, instance })
    document.body.appendChild(instance.$el)

    // 限制同时显示的Toast数量
    if (toastQueue.length > 5) {
        const oldToast = toastQueue.shift()
        oldToast.instance.close()
    }

    return {
        close: () => instance.close(),
        update: (newOptions) => {
            Object.assign(instance, newOptions)
        }
    }
}
const removeToast = (id) => {
    const index = toastQueue.findIndex(toast => toast.id === id)
    if (index > -1) {
        toastQueue.splice(index, 1)
    }
}
const Toast = (message, options = {}) => {
    return createToast(message, options)
}

Toast.success = (message, options = {}) => {
    return createToast(message, { ...options, type: 'success' })
}


Toast.error = (message, options = {}) => {
    return createToast(message, { ...options, type: 'error' })
}

Toast.warning = (message, options = {}) => {
    return createToast(message, { ...options, type: 'warning' })
}

Toast.info = (message, options = {}) => {
    return createToast(message, { ...options, type: 'info' })
}

Toast.loading = (message = 'loading...', options = {}) => {
    return createToast(message, {
        ...options,
        type: 'loading',
        duration: 0,
        closable: false
    })
}

Toast.clearAll = () => {
    toastQueue.forEach(({ instance }) => {
        instance.close()
    })
    toastQueue.length = 0
}


export default Toast