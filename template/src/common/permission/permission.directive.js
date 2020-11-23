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
    const matchs = arg.match(PermissionExecReg) || []; // 找到所有的权限

    // 查询权限编码，然后设置样式
    findPermission(matchs, setStyle);

    function setStyle() {
        // 开发环境时，默认所有权限都为true
        // 非开发环境时，需要根据权限调整元素显示
        if (process.env.NODE_ENV === 'development') {
            return;
        }

        if (!hasPermission(matchs) && el.style) {
            el.tabIndex = -1;
            el.style.pointerEvents = 'none';
            el.style.color = '#c1c1c1';
            if (!show) {
                el.style.display = 'none';
                el.classList.add('hide');
            }
        }
    }

    /**
     * 将表达式构建成一个函数
     * @example
     *  arg = 'AAA:BBB'
     *  buildFn() => 'function fn(){ return true }'
     * @example
     *  arg = 'AAA:BBB || BBB:CC && AA:CC && !DD:FA'
     *  buildFn() => 'function fn(){ return true || true && false && !false }'
     *  @param matchs {String[]}
     * @return {Function}
     */
    function hasPermission(matchs) {
        let fn = calcFnCache[arg];
        if (!fn) {
            let fnBody = arg;
            matchs.forEach(e => {
                fnBody = fnBody.replace(new RegExp(e, 'g'), PermissionCacheMap[e]);
            });
            fn = calcFnCache[arg] = Function(`return !!(${fnBody})`);
        }
        return fn();
    }
}

// 查询权限
let codeQueues = new Set(), // 查询队列
    lazeCodeQueues = new Set(), // 懒查询队列(也就是不触发真正的查询)
    callbackQueues = [], // 回调函数队列
    PermissionExecReg = /(?:\w+:?)+/g,
    PermissionCacheMap = {}, // 权限数据缓存
    calcFnCache = {}, // 计算权限函数缓存
    requestCache = {}, // 权限查询对象缓存
    timer;

function findPermission(matchCodes, cb) {
    // 过滤缓存中已经存在的权限
    matchCodes = matchCodes.filter(e => PermissionCacheMap[e] == null)

    // 若全部权限都存在缓存，则可以直接触发回调即可
    if (!matchCodes.length) {
        return cb();
    }

    // 将剩余的权限放入查询队列
    matchCodes.forEach(key => {
        if (!requestCache[key]) {
            // 还未查询过的key，放到codes中,将在下一次查询时，处理它
            codeQueues.add(key);
        } else {
            // 若已经查询过的key，不会触发新的查询，而是复用已查询过的promise缓存
            lazeCodeQueues.add(key);
        }
    });
    callbackQueues.push(cb); // 但是无论是否查询，回调函数总是需要触发

    if (timer) return;

    timer = 1;
    nextTick(async () => {
        timer = 0;
        const searchCodes = Array.from(codeQueues);
        const lazeCodes = Array.from(lazeCodeQueues);
        const cbFns = callbackQueues.slice(0);

        codeQueues.clear();
        lazeCodeQueues.clear();
        callbackQueues.length = 0;

        // 复用已经查询过的promise
        const requests = lazeCodes.map(code => requestCache[code]);

        // 查询未查询过的权限
        if (searchCodes.length) {
            const queryBody = {code: searchCodes.join(',')};
            const promise = post('/bdc/search/checkPermission.htm', queryBody).then(result => {
                Object.assign(PermissionCacheMap, result.data || {}); // 缓存数据
            });
            searchCodes.forEach(code => requestCache[code] = promise); // 缓存 promise
            requests.push(promise);
        }

        await Promise.all(requests);

        cbFns.forEach(fn => fn());
        cbFns.length = 0;
    });
}
