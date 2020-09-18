import {post} from "../../util";
import {nextTick} from 'vue';

export default {
    mounted(el, {arg, modifiers: {show}}) {
        doPermission(el, arg, show);
    },
    updated(el, {arg, modifiers: {show}}) {
        doPermission(el, arg, show);
    }
}

function doPermission(el, arg, show) {
    if (el._promission) {
        setStyle();
        return;
    }
    el._promission = true;
    findPermission(arg, setStyle);

    function setStyle(map = cache) {
        // 开发环境时，默认所有权限都为true
        // 非开发环境时，需要根据权限调整元素显示
        if (process.env.NODE_ENV === 'development') {
            return;
        }
        if (map[arg] === false && el.style) {
            el.tabIndex = -1;
            el.style.pointerEvents = 'none';
            el.style.color = '#c1c1c1';
            if (!show) {
                el.style.display = 'none';
                el.classList.add('hide');
            }
        }
    }
}

// 查询权限
let codes = new Set(), callbacks = [], cache = {}, timer;

function findPermission(code, cb) {
    if (typeof cache[code] !== 'undefined') { // 查询缓存
        return cb(cache);
    }

    codes.add(code);
    callbacks.push(cb);

    if (timer) return;

    timer = 1;
    nextTick(async function () {
        timer = 0;
        const searchCodes = Array.from(codes).join(',');
        const cbs = callbacks.slice(0);
        codes.clear();
        callbacks.length = 0;
        const result = await post('/bdc/search/checkPermission.htm', {code: searchCodes});
        const map = result.data || {};
        Object.assign(cache, map); // 缓存数据
        cbs.forEach(fn => fn(map));
    });
}

