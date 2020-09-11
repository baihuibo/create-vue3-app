/**
 * @param url
 * @param body
 * @param method
 * @returns {Promise<{msg ,data,code}>}
 */

export async function ajax(url, body, method = 'get') {
    const config = {
        credentials: 'same-origin', // same-origin , include 自动发送 cookie
        method,
        body,
        headers: {'Content-Type': 'application/json'},
        cache: 'reload'
    };
    if (body && body instanceof FormData) {
        config.headers = {}; // 文件上传不需要手动设置 header
    } else if (body && /post/i.test(method)) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(url, config);
    if (response.status !== 200) {
        throw response;
    }
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        const div = document.createElement('div');
        div.innerHTML = text;
        const script = div.querySelector('script');
        if (script) {
            Function(script.innerText)(); // 执行页面脚本，如果session失效，则会跳转到登录页面或者session失效提示页面
        }
    }
}


export function post(url, body) {
    return ajax(url, body, 'post');
}

export function get(url, params) {
    if (params) {
        const search = Object.keys(params).map(name => name + '=' + params[name]).join('&');
        url += (url.includes('?') ? '&' : '?') + search;
    }
    return ajax(url);
}

export function debounce(fn, time) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(null, args), time);
    }
}

export function throttle(fn, time = 50) {
    let pre = Date.now();
    return function (...args) {
        const now = Date.now();
        if (now - pre >= time) {
            fn.apply(null, args);
            pre = now;
        }
    }
}

/**
 * 在异步函数执行完成期间，其它调用则不会触发新的调用
 * 用来避免类似保存、提交 按钮在网络稍有延迟时，被多次点击而导致重复触发请求的问题
 * @param asyncFn
 * @return {function(...[*]=)}
 */
export function singleThreadWrapFn(asyncFn) {
    let promise;
    return async function (...args) {
        if (promise) {
            return promise;
        }
        try {
            promise = asyncFn(...args);
            return await promise;
        } catch (e) {
        } finally {
            promise = null;
        }
    }
}
