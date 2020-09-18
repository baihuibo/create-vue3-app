<template>
    <div class="multiple-select">
        <input ref="elementRef"
               type="text"
               class="form-control"
               :value="viewValue"
               :placeholder="noPlaceholder !== true ? placeholder : ''"
               :disabled="disabled"
               :class="dropdownShowRef ? 'open' : ''"
               @keydown.prevent.stop
               @pause.prevent
               @mousedown.prevent.stop
               @click="dropdownOpen">
        <i class="iconfont icon-xiala"></i>
        <div ref="dropdownRef" class="dropdown"
             :class="{focus:dropdownShowRef}"
             v-show="dropdownShowRef" tabindex="-1" @blur="dropdownBlur">
            <div class="search-wrap">
                <input type="text"
                       ref="searchInputRef"
                       class="form-control"
                       placeholder="请搜索..."
                       v-model="searchText"
                       @focus="searchFocus"
                       @blur="searchBlur">
                <i class="iconfont icon-sousuo"></i>
            </div>
            <ul class="ulList">
                <li v-if="noPlaceholder !== true && !multiple" @click="toggleSelected()">{{ placeholder }}</li>
                <li v-for="item in filter(searchText)"
                    @click="toggleSelected(item)"
                    :class="{active:isSelect(item.valueCode)}"
                    layout="row" layout-align="start center">
                    <div flex class="text">{{ item.valueName }}</div>
                    <i class="iconfont icon-gouxuan" v-if="isSelect(item.valueCode)"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup="props,{emit}">
import {nextTick, onMounted, ref, watchEffect} from "vue";
import {getKeyCodes} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        list: Array,
        disabled: Boolean,
        multiple: Boolean,  //多选
        modelValue: [String, Number],
        placeholder: {type: String, default: '请选择'},
        noPlaceholder: Boolean,
        keyCode: String,
        validateRule: Object,
        lazeload: Boolean,  //懒加载
    }
}

export const viewValue = ref('')
export const dropdownRef = ref()
export const dropdownShowRef = ref(false)
export const listRef = ref([])
export const elementRef = ref()
export const searchText = ref('');
export const selecteds = ref([]);

let canBlur = true;
let canLoad = false;

registerValidate({ref: elementRef, props})

onMounted(async () => {
    const modelValue = getModelValue();
    if (props.keyCode) {
        if (modelValue.length || !props.lazeload) {
            listRef.value = (await getKeyCodes(props.keyCode)).data || [];
        } else {
            canLoad = true
        }
    } else {
        listRef.value = props.list || [];
    }
    selecteds.value = modelValue;
    setViewValue()
})

watchEffect(() => {
    if (props.list && props.list.length) {
        listRef.value = props.list
    }
    if (selecteds.value.toString() !== getModelValue().toString()) {
        selecteds.value = getModelValue().slice(0);
    }
    setViewValue();
})

export function dropdownOpen() {
    loadData()
    dropdownShowRef.value = true;
    nextTick(() => {
        if (dropdownRef.value) {
            dropdownRef.value.focus()
        }
    })
}

export function dropdownBlur() {
    setTimeout(() => {
        if (canBlur) {
            rollBackData()
        }
    })
}

export function searchFocus() {
    canBlur = false;
}

export function searchBlur() {
    canBlur = true
    setTimeout(() => {
        // document.activeElement返回当前页面获取焦点的元素
        if (document.activeElement !== dropdownRef.value) {
            rollBackData()
        }
    })
}

export function toggleSelected(item) {
    let modelValue = selecteds.value || [];
    if (item) {
        const {valueCode} = item;
        if (!props.multiple) {
            close();
            if (modelValue[0] === valueCode) {
                return;
            }
            modelValue = [valueCode];
        } else {
            const index = modelValue.findIndex(item => item === valueCode)
            if (index > -1) {
                modelValue.splice(index, 1)
            } else {
                modelValue.push(valueCode)
            }
        }
    } else {
        close();
        modelValue = [];
    }
    selecteds.value = modelValue;
    emit('update:modelValue', props.multiple ? modelValue : modelValue[0]);
    emit('change');
    setViewValue()

    function close() {
        nextTick(rollBackData);
    }
}

export function isSelect(code) {
    return !!selecteds.value.find(a => a == code); // 忽略数字与字母
}

function getModelValue() {
    if (props.multiple) {
        return props.modelValue || [];
    } else if (props.modelValue != null && props.modelValue !== '') {
        return [props.modelValue];
    }
    return []
}

async function loadData() {
    if (!canLoad) {
        return
    }
    listRef.value = (await getKeyCodes(props.keyCode)).data || [];
    canLoad = false;
}

let oldSearchText, filterList;

// 过滤列表
export function filter(searchText = '') {
    searchText = searchText.trim();
    if (searchText) {
        if (oldSearchText !== searchText) {
            oldSearchText = searchText;
            filterList = listRef.value.filter(a => a.valueName.includes(searchText))
        }
        return filterList;
    }
    return listRef.value;
}

function setViewValue() {
    const modelValue = selecteds.value;
    if (modelValue.length) {
        if (modelValue.length > 3) {
            viewValue.value = `已选中${modelValue.length}个`
        } else {
            viewValue.value = listRef.value.filter(a => isSelect(a.valueCode)).map(a => a.valueName).join(',');
        }
    } else {
        viewValue.value = ''
    }
}

function rollBackData() {
    dropdownShowRef.value = false;
    searchText.value = '';
}
</script>

<style lang="less" scoped>
.multiple-select {
    user-select: none;
    position: relative;

    .form-control {
        cursor: default;

        &.open {
            border-radius: 2px 2px 0 0;
        }
    }

    .focus {
        &:focus {
            outline: 0;
        }
    }

    .icon-xiala {
        position: absolute;
        top: 0;
        right: 8px;
        font-size: 13px;
        color: #000000;
    }

    .dropdown {
        position: absolute;
        z-index: 99999;
        box-sizing: border-box;
        border: 1px solid rgb(219, 222, 239);
        width: 100%;
        background-color: #fff;
        top: 100%;
        margin-top: -2px;

        .ulList {
            max-height: 200px;
            overflow-y: auto;
            margin: 0 5px;
            padding: 4px 0;
        }

        .ulList::-webkit-scrollbar {
            width: 8px;
        }

        .ulList::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba(52, 51, 51, 0.2);
        }

        .ulList::-webkit-scrollbar-track {
            border-radius: 0;
            background: transparent;
        }

        li {
            position: relative;
            list-style: none;
            padding: 0 10px;
            height: 26px;
            line-height: 30px;
            cursor: default;

            .text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            &:hover, &.active {
                background-color: #e8e8e8;
            }

            .icon-gouxuan {
                position: absolute;
                top: 0px;
                right: 20px;
                font-size: 14px;
                color: rgb(53, 95, 214);
                vertical-align: baseline;
            }

            &.active {
                color: rgb(53, 95, 214);
            }
        }

        .search-wrap {
            height: 28px;
            position: relative;
            padding: 6px 8px;

            .icon-sousuo {
                position: absolute;
                top: 0px;
                right: 15px;
                font-size: 13px;
                color: #dcdcdc;
            }
        }

    }
}
</style>
