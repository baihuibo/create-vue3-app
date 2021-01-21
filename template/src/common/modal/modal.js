import {createApp, defineAsyncComponent} from "vue";
import modalWrap from "./modal-wrap.vue";
import common from "../common";

export const modal = {
    /**
     * 打开弹出层
     * @param component 加载组件
     * @param option
     * @param option.title 设置弹窗标题
     * @param option.noTitle 取消标题
     * @param option.frame 是否frame模式
     * @param option.center 是否居中显示
     * @param option.data 设置弹窗数据
     * @param option.width 设置宽度，默认500px
     * @param option.height 设置高度，默认 auto
     * @param option.fullscreen 设置高度，默认 auto
     * @returns {Promise<unknown>}
     */
    open(component, option = {}) {
        return new Promise(function (resolve) {
            const div = document.createElement('div');
            const Vue = createApp(modalWrap, {
                title: option.title || '提示',
                noTitle: option.noTitle,
                width: option.width || '500px',
                height: option.height || 'auto',
                frame: option.frame || false,
                center: option.center || false,
                fullscreen: option.fullscreen || false,
                data: Object.assign({}, option.data || {}),
                onClose: data => {
                    resolve(data);
                    Vue.unmount(div);
                    document.body.removeChild(div);
                    revertBodyOverflow();
                }
            });
            setBodyOverflow();
            Vue.use(common); // 使得弹出层内也可以支持公共组件
            Vue.component('modalBody', defineAsyncComponent(() => Promise.resolve(component)));
            Vue.mount(div);
            document.body.appendChild(div);
        });
    },

    alert(msg, title, width = '300px', center) {
        return modal.open(import ('./alert-model.vue'), {data: {msg}, title, width, center});
    },
    confirm(msg, title, width = '300px', center) {
        return modal.open(import ('./confirm-model.vue'), {data: {msg}, title, width, center});
    },

    showLoading() {
        if (!_loadingDom) {
            _loadingDom = _getLoadingDom();
        }
        _loadingDom.style.display = 'block';
        _loadingLength++;
    },
    hideLoading(focus = false) {
        if (_loadingLength) {
            _loadingLength--;
        }
        if (focus || !_loadingLength) {
            _loadingDom.style.display = 'none';
            _loadingLength = 0;
        }
    }
};
let _loadingDom, _loadingLength = 0;

function _getLoadingDom() {
    const div = document.createElement('div');
    div.innerHTML = `<div class="loading-box" layout="row" layout-align="center center"><div class="loading-content"></div></div>`;
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
}

// body 自动设置overflow 样式
let counter = 0, oldOverflowStyle = '', bodyStyle;

function setBodyOverflow() {
    if (!counter) {
        bodyStyle = document.body.style;
        oldOverflowStyle = bodyStyle.overflow;
        bodyStyle.overflow = 'hidden';
    }
    counter += 1;
}

function revertBodyOverflow() {
    counter -= 1;
    if (!counter && bodyStyle) {
        bodyStyle.overflow = oldOverflowStyle;
    }
}
