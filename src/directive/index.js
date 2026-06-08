import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import dialogDrag from './dialog/drag'
import dialogDragWidth from './dialog/dragWidth'
import dialogDragHeight from './dialog/dragHeight'
import clipboard from './module/clipboard'
import noPermi from './permission/noPermi'

// Vue：自定义指令：https://v2.cn.vuejs.org/v2/guide/custom-directive.html
const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('clipboard', clipboard)
  Vue.directive('noPermi', noPermi)  
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('dialogDragWidth', dialogDragWidth)
  Vue.directive('dialogDragHeight', dialogDragHeight)
  // 注册全局指令
  Vue.directive('number-only', {
  bind(el, binding, vnode) {
    const component = vnode.componentInstance;
    
    // 1. 拦截用户输入（键盘+粘贴）
    // el.addEventListener('keydown', (e) => {
    //   const allowedKeys = [8, 37, 39, 46]; // 退格/左右箭头/删除
    //   if (!allowedKeys.includes(e.keyCode) && !/[0-9.]/.test(e.key)) {
    //     e.preventDefault();
    //   }
    //   // 禁止输入多个小数点
    //   if (e.key === '.' && el.value.includes('.')) {
    //     e.preventDefault();
    //   }
    // });

    // el.addEventListener('paste', (e) => {
    //   const paste = (e.clipboardData).getData('text');
    //   if (!/^[\d.]*$/.test(paste)) {
    //     e.preventDefault();
    //   }
    // });

    // 2. 实时过滤输入内容
    el.addEventListener('input', (e) => {
      const filteredValue = filterNumber(e.target.value);
      if (e.target.value !== filteredValue) {
        e.target.value = filteredValue;
        triggerInputEvent(el); // 触发v-model更新
      }
    });

    // 3. 拦截程序赋值（通过v-model修改时生效）
    if (component && component.$options.model) {
      const originalSet = component.$options.model.set;
      component.$options.model.set = function(value) {
        const filteredValue = filterNumber(value);
        if (value !== filteredValue) {
          // 差异更新，避免无限循环
          setTimeout(() => component.$emit('input', filteredValue));
        }
        return originalSet.call(this, filteredValue);
      };
    }
  },
  update(el, binding, vnode) {
    // 4. 确保更新时的值也是过滤后的
    const component = vnode.componentInstance;
    if (component && component.value !== undefined) {
      const filteredValue = filterNumber(component.value);
      if (component.value !== filteredValue) {
        component.$emit('input', filteredValue);
      }
    }
  }
  });
  
  // 工具函数：过滤非法字符（保留数字和第一个小数点）
  function filterNumber(value) {
    if (value === null || value === undefined) return '';
    const str = String(value)
      .replace(/[^\d.]/g, '')          // 移除非数字和小数点
      .replace(/^(\d*\.\d*)\./g, '$1') // 禁止多个小数点
      .replace(/^\./g, '');            // 禁止以小数点开头
    return str.match(/^\d*\.?\d*/)?.[0] || ''; // 最终校验
  }

  // 工具函数：触发input事件更新v-model
  function triggerInputEvent(el) {
    const event = new Event('input', { bubbles: true });
    el.dispatchEvent(event);
  }




}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['noPermi'] = noPermi
  Vue.use(install); // eslint-disable-line
}

export default install
