<template>
    <div class="container" tabindex="1" @blur="blur" @focus="containerFocus">
        <input type="search" :disabled="disabled" :readonly="disabled" @input="inputChange" :value="valueRef"
               @keydown.enter.prevent
               @focus="focus" @blur="inutBlur" class="form-control" :placeholder="placeholder" ref="elementRef">
        <ul class="content-view no-result" v-if="showNoResultRef">
            <li>没有搜索到结果</li>
        </ul>
        <ul class="content-view" v-if="showContentRef && listRef.length" ref="viewRef" @scroll="handleScroll">
            <li v-for="item in listRef"
                :class="{active:valueRef === item.valueName}"
                @click="chooseItem(item)">{{ item.valueName }}
            </li>
        </ul>
    </div>
</template>

<script>
import {nextTick, ref, watchEffect} from 'vue';
import {clone, get, post} from "../../../../util";
import {debounce} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        id: [String, Number],
        name: String,
        url: String,
        modelValue: Object,
        searchContent: String,
        method: String,
        pageSize: Number,
        params: {},
        beforeSend: Function,
        emptySearch: Boolean,
        placeholder: String,
        responseHandler: Function,
        disabled: Boolean,
        readonly: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        const valueRef = ref(""); // 输入框内容
        const showContentRef = ref(false); // 是否显示容器的控制器
        const listRef = ref([]); // 数据列表
        const viewRef = ref(); // 容器
        const showNoResultRef = ref(false); // 没有搜索结果的的控制器
        const elementRef = ref({});
        let currentPage = 1;
        let selectValue = {};
        let _cacheParams = {};
        let canNext = true;
        let canBlur = true;

        registerValidate({ref: elementRef, props, valueKey: 'id'}, 'name', valueRef);

        watchEffect(initProps);

        function inputChange(e) {
            valueRef.value = e.target.value;
            selectValue = {};
            initQuery();
        }

        function initProps() {
            const {id, name, modalValue} = props;
            if (modalValue || (id && name) || id == null) {
                selectValue = modalValue || {
                    valueCode: props.id,
                    valueName: id == null ? '' : props.name || ''
                }
                valueRef.value = selectValue.valueName;
            }
        }

        const initQuery = debounce(function () {
            if (!valueRef.value.trim() && !props.emptySearch) { // 清空内容时，列表也会被清空
                listRef.value = [];
                setValue();
                return;
            }
            currentPage = 1;
            listRef.value = [];
            _cacheParams = {};
            selectScrollTop = liveScrollTop = 0;
            let param = props.params || {};
            if (props.searchContent) {
                param[props.searchContent] = valueRef.value;
            }

            query(param, currentPage);
        }, 200);

        let liveScrollTop, selectScrollTop;

        function handleScroll(e) {
            let target = e.target;
            if ((target.scrollHeight - (target.scrollTop + target.clientHeight) < 10) && canNext) {
                canNext = false;
                nextPage();
            }
            liveScrollTop = target.scrollTop;
        }

        function chooseItem(item) {
            showContentRef.value = false;
            selectScrollTop = liveScrollTop;
            setValue(item);
        }

        function nextPage() {
            return query(_cacheParams, currentPage + 1);
        }

        function setValue(value = {}) {
            selectValue = value;
            valueRef.value = value.valueName;
            emit('update:id', value.valueCode);
            emit('update:name', value.valueName);
            emit('update:modelValue', value);
            emit('change', value);
        }

        function blur() {
            showContentRef.value = false;
            showNoResultRef.value = false;
            if (typeof selectValue.valueCode === 'undefined' || selectValue.valueCode === '') {
                setValue({valueCode: "", valueName: ""})
            }
        }

        function inutBlur(e) {
            setTimeout(() => canBlur && blur(), 100)
        }

        function containerFocus() {
            canBlur = false;
        }

        function focus() {
            canBlur = true;
            showContentRef.value = true;
            nextTick(() => {
                if (viewRef.value && selectScrollTop) { // 根据记录的位置信息，将打开的ul滚动条位置还原
                    viewRef.value.scrollTop = selectScrollTop;
                }
            });
            if (!listRef.value || !listRef.value.length) {
                if (props.emptySearch) {
                    initQuery();
                }
            }
        }

        async function query(params, pageIndex = 1) {
            params = clone(params || {});
            params.pageSize = props.pageSize || 15;
            showNoResultRef.value = false;
            let getData;
            if (props.url) {
                const ajax = props.method === 'get' ? get : post;
                getData = (data) => ajax(props.url, data);
            } else if (typeof props.getData === 'function') {
                getData = props.getData;
            }
            pageIndex = Math.abs(pageIndex);
            params.currPage = pageIndex;
            if (typeof props.beforeSend === 'function') {
                params = props.beforeSend(params) || params;
            }

            let result = await Promise.resolve(getData(params));

            if (typeof props.responseHandler === 'function') {
                result = props.responseHandler(result) || result;
            }
            if (+result.code === 0) {
                _cacheParams = params; // 缓存参数
                const {rows, totalPage} = result.data || {};
                // 设置组件数据
                listRef.value = [...listRef.value, ...(rows || [])];
                showNoResultRef.value = !listRef.value.length;
                currentPage = pageIndex;
                canNext = pageIndex < totalPage; // 如果当前页还不是最后一页，则还可以允许继续请求
            } else {
                alert(result.msg);
            }

            return result;
        }

        return {
            valueRef, listRef, viewRef, showContentRef, showNoResultRef, elementRef,
            chooseItem, blur, focus, inutBlur, inputChange, handleScroll, containerFocus
        }
    }
}
</script>
<style scoped lang="less">
ul, li {
    padding: 0;
    margin: 0;
    list-style: none
}

.container {
    position: relative;
    border: none;
    outline: none;

    input {
        width: 100%;
        box-sizing: border-box;
    }
}

.content-view {
    width: 100%;
    max-height: 280px;
    overflow: auto;
    position: absolute;
    left: 0;
    top: 30px;
    background: #fff;
    z-index: 9999;
    border: 1px solid #ccc;
    box-sizing: border-box;

    &.no-result {
        pointer-events: none;
    }

    li {
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-indent: 10px;
        cursor: pointer;

        &.active {
            color: #fff;
            background: rgb(53, 95, 214);
        }

        &:hover {
            background: rgba(52, 73, 130, .8);
            color: #fff;
        }
    }
}
</style>
