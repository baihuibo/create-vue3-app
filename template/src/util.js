/**
 * @param url
 * @param body
 * @param method
 * @returns {Promise<{msg ,data,code}>}
 */
export async function ajax(url, body, method = 'get') {
    const config = {
        credentials: 'same-origin', // same-origin , include 自动发送 cookie
        method, body,
        cache: 'reload'
    };
    if (body && body instanceof FormData) {
        config.headers = {}; // 文件上传不需要手动设置 header
    } else if (typeof body === 'object' && /post|put/i.test(method)) {
        config.body = JSON.stringify(body);
        config.headers = {'Content-Type': 'application/json'};
    } else if (typeof body === 'string') {
        config.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
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

export function get(url, params) {
    url = addParams(url, params);
    return ajax(url);
}

export function post(url, body) {
    return ajax(url, body, 'post');
}

export function put(url, body) {
    return ajax(url, body, 'put');
}

export function del(url, params) {
    url = addParams(url, params);
    return ajax(url, null, 'delete');
}

function addParams(url, params) {
    if (params) {
        const values = [];
        Object.keys(params).forEach(name => {
            if (params[name] != null) {
                values.push(name + '=' + params[name]);
            }
        });
        url += (url.includes('?') ? '&' : '?') + values.join('&');
    }
    return url;
}

export function formSubmit(action, data, method = 'get') {
    var form = document.createElement('form');
    form.action = action;
    form.method = method;
    form.target = '_blank';

    Object.keys(data).forEach(key => {
        const value = data[key];
        if (value == null || value === '') {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach(i => append(key, i));
        } else {
            append(key, value);
        }
    })

    function append(name, value) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;

        form.appendChild(input);
    }

    document.body.appendChild(form);

    form.submit();

    setTimeout(function () {
        document.body.removeChild(form);
    }, 1000);
}

export function debounce(fn, time) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(null, args), time);
    }
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * @param fn
 * @param time
 * @param last 新增参数，在最后一次调用之后，总会触发一次
 * @return {function(...[*]=): void}
 */
export function throttle(fn, time = 50, last = false) {
    let pre = Date.now(), timer;
    return function (...args) {
        const now = Date.now();
        if (now - pre >= time) {
            fn.apply(null, args);
            pre = now;
        } else if (last) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), time);
        }
    }
}

/**
 * 为了避免类似保存、提交 按钮在网络稍有延迟时，被多次点击而导致重复触发请求的问题
 * 在异步函数执行完成期间，所有对此函数的调用只会触发一次
 * @param asyncFn {Function}
 * @return {function(...[*]=)}
 */
export function singleThreadWrapFn(asyncFn) {
    let promise;
    return async function (...args) {
        if (promise) {
            return promise;
        }
        try {
            return promise = asyncFn(...args);
        } catch (e) {
        } finally {
            promise = null;
        }
    }
}
