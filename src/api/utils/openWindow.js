/**
 * 打开新窗口的通用方法
 * @param {string} ref - 要打开的URL地址
 * @param {object} router - Vue Router实例
 * @param {function} callback - 执行完跳转后的回调函数
 */
export function openNewWindow(ref, router, callback) {
  var newWindow = window.open(ref, '_blank');
  if (newWindow) {
    // 新窗口成功打开，可以立即执行回调
    if (callback) callback();
  } else {
    // 弹窗被阻止，使用路由跳转
    if (router) {
      router.push(ref).then(() => {
        // 路由跳转完成后执行回调
        if (callback) callback();
      }).catch(err => {
        console.error('Navigation failed:', err);
        if (callback) callback();
      });
    } else {
      console.error('Router is not provided for fallback navigation');
      if (callback) callback();
    }
  }
}