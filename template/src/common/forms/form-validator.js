import {getCurrentInstance, isRef, onUnmounted, onUpdated, watchEffect} from "vue";
import validates from './validates';

/**
 * 注册校验器
 * @param elementRef
 * @param props
 * @param valueKey
 * @param otherProps
 */
export function registerValidate({ref: elementRef, props, valueKey = 'modelValue'}, ...otherProps) {

    let oldValue, oldRule, initialize = false,
        currentInstance = getCurrentInstance();

    watchEffect(trigger);
    onUpdated(trigger);

    async function trigger() {
        if (!init()) {
            return;
        }
        if (getNode(elementRef).disabled) { // 被禁用时，跳过验证
            return;
        }
        const newValue = props[valueKey];
        const rule = props['validateRule'];
        if (rule) {
            if (newValue !== oldValue || JSON.stringify(rule) !== oldRule) {
                await validator(elementRef, newValue, rule);
            }
        }

        oldValue = props[valueKey];
        oldRule = rule ? JSON.stringify(rule) : null;
    }

    function init() {
        if (initialize) {
            return initialize;
        }
        const node = getNode(elementRef);
        if (!node || !node.form) {
            return;
        }
        patchForm(node.form, currentInstance, elementRef, props, valueKey, otherProps);
        initialize = true;
        return initialize;
    }

    // 元素被销毁的时候，同时取消注册的监听器
    onUnmounted(() => {
        const node = getNode(elementRef);
        if (node && node.form) {
            unPatchForm(node.form, currentInstance);
        }
    })
}

function getNode(ref) {
    if (!ref.value || (Array.isArray(ref.value) && !ref.value.length)) {
        return null;
    }
    return ref.value.nodeType === 1 ? ref.value : ref.value[0]
}

function patchForm(form, instance, elementRef, props, valueKey, otherProps) {
    if (form._patched) {
        form._instances.push({instance, elementRef, props, valueKey, otherProps});
        return;
    }
    form._instances = [{instance, elementRef, props, valueKey, otherProps}];
    form._patched = true;
    form.addEventListener('submit', function () {
        form.classList.add('v-submitted');
    });
    form.addEventListener('reset', function (e) {
        form.classList.remove('v-submitted');
        form._instances.forEach(({instance, elementRef, props, valueKey, otherProps}) => {
            const node = getNode(elementRef)
            if (node.disabled) {
                return;
            }
            instance.emit('update:' + valueKey, Array.isArray(props[valueKey]) ? [] : null);
            otherProps.forEach(prop => {
                if (isRef(prop)) {
                    prop.value = null;
                } else {
                    instance.emit('update:' + prop, null);
                }
            });
        });
        e.stopPropagation();
        e.preventDefault();
    });
}

function unPatchForm(form, instance) {
    if (form._patched) {
        const index = form._instances.findIndex(item => item.instance === instance);
        form._instances.splice(index, 1);
    }
}

async function validator(ref, value, rule) {
    const rules = _getRules(rule);

    for (let i = 0; i < rules.length; i++) {
        const fn = validates[rules[i]];
        if (fn) {
            const breakMsg = await Promise.resolve(fn(value, rule[rules[i]]));
            if (rules[i] === 'required') {
                _setRequired(ref, !!breakMsg); // 设置required的状态
                if (breakMsg) {
                    return;
                }
            } else if (breakMsg) {
                _setValidateMsg(ref, breakMsg);
                return;
            }
        }
    }

    _setValidateMsg(ref, ''); // 清空校验
}

function _getRules(rule) {
    var list = Object.keys(rule);
    var idx = list.indexOf('required');
    if (idx > -1) {// 强行设置required优先校验
        list.splice(idx, 1);
        list.unshift('required');
    }
    return list;
}

function _setValidateMsg(ref, msg) {
    if (ref.value.nodeType === 1) {
        ref.value.setCustomValidity(msg);
    } else if (Array.isArray(ref.value) && ref.value.length) {
        ref.value[0].setCustomValidity(msg);
    }
}

function _setRequired(ref, required) {
    const node = getNode(ref);
    if (node.matches('[type=checkbox],[type=radio]')) {
        node.setCustomValidity(required ? '请在列表中选择一项。' : '')
    } else {
        ref.value.required = required;
    }
}
