import {get} from "../../util";

export {debounce} from '../../util';

const cacheKeyCode = {};

export async function getKeyCodes(keyCode) {
    let request = cacheKeyCode[keyCode];
    if (!request) {
        request = cacheKeyCode[keyCode] = get("/bdc/search/getKeyCodes.htm", {keyCode});
    }
    const result = await request;
    if (result.code === '0' && Array.isArray(result.data)) {
        result.data.forEach(function (item) {
            if (item.optionText && !item.valueName) {
                item.valueCode = item.optionValue;
                item.valueName = item.optionText;
            }
        });
    }
    return result;
}

export function getUuid(prefix) {
    return (prefix || 'uuid') + Math.random().toString(16).substr(2);
}

export function getElemDis(el) {
    let tp = document.documentElement.clientTop,
        lt = document.documentElement.clientLeft,
        rect = el.getBoundingClientRect();
    return {
        top: rect.top - tp,
        right: rect.right - lt,
        bottom: rect.bottom - tp,
        left: rect.left - lt,
        width: rect.width,
        height: rect.height
    }
}
