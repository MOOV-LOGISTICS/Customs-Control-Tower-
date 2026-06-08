// coookie 操作相关

// 获取cookie
export function getCookie(name) {
  let arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return arr[2];
  else return null;
}

// 设置cookie()
export function setCookie(name, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

// 删除cookie()
export function removeCookie(name) {
  setCookie(name, "", -1);
}



