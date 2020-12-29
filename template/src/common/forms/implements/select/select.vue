<template>
    <div class="multiple-select">
        <input ref="elementRef" class="form-control" :class="dropdownShowRef ? 'open' : ''"
               type="text" :value="viewValue"
               :placeholder="noPlaceholder !== true ? placeholder : ''" :disabled="disabled"
               @keydown.prevent.stop @paste.prevent.stop @cut.prevent.stop @mousedown.prevent.stop
               @click="dropdownOpen">
        <div ref="dropdownRef" class="dropdown" tabindex="-1" v-if="dropdownShowRef" @blur="dropdownBlur">
            <div class="search-wrap">
                <input type="text" ref="searchInputRef" class="form-control"
                       placeholder="请搜索..." v-model="searchText"
                       @focus="searchFocus" @blur="searchBlur">
            </div>
            <ul class="ul-list">
                <li v-if="noPlaceholder !== true && !multiple" @click="toggleSelected()">{{ placeholder }}</li>
                <li v-for="item in filter(searchText)"
                    :class="{
                        active:!multiple && isSelect(item.valueCode),
                        'active-multiple' : multiple && isSelect(item.valueCode)
                    }"
                    @click="toggleSelected(item)"
                    layout="row" layout-align="start center">
                    <input type="checkbox" tabindex="-1"
                           v-if="multiple" :checked="isSelect(item.valueCode)">
                    <div flex class="text">{{ item.valueName }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {nextTick, onMounted, ref, watchEffect} from "vue";
import {getKeyCodes} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        list: Array,
        disabled: Boolean,
        multiple: Boolean,  //多选
        modelValue: [String, Number, Array],
        label: [String, Array],
        current: Object, // 当前选中项
        placeholder: {type: String, default: '请选择'},
        noPlaceholder: Boolean,
        keyCode: String,
        validateRule: Object,
        lazeload: Boolean,  //懒加载
    },
    setup(props, {emit}) {
        const viewValue = ref('')
        const dropdownRef = ref()
        const dropdownShowRef = ref(false)
        const listRef = ref([])
        const elementRef = ref()
        const searchText = ref('');
        const selecteds = ref([]);

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

        watchEffect(async () => {
            let setVal = 0;
            if (Array.isArray(props.list) && props.list.length && listRef.value !== props.list) {
                listRef.value = props.list;
                setVal = 1;
            }
            if (selecteds.value.toString() !== getModelValue().toString()) {
                selecteds.value = getModelValue().slice(0);
                await loadData();
                setVal = 1;
            }
            setVal && setViewValue();
        })

        function dropdownOpen() {
            if (!dropdownShowRef.value) {
                loadData()
                dropdownShowRef.value = true;
                nextTick(() => {
                    if (dropdownRef.value) {
                        dropdownRef.value.focus()
                    }
                })
            } else {
                rollBackData();
            }
        }

        function dropdownBlur() {
            setTimeout(() => {
                if (canBlur) {
                    rollBackData()
                }
            })
        }

        function searchFocus() {
            canBlur = false;
        }

        function searchBlur() {
            canBlur = true
            setTimeout(() => {
                // document.activeElement返回当前页面获取焦点的元素
                if (document.activeElement !== dropdownRef.value) {
                    rollBackData()
                }
            })
        }

        function toggleSelected(item) {
            let modelValue = selecteds.value || [];
            const multiple = props.multiple;
            if (item) {
                const {valueCode} = item;
                if (!multiple) {
                    close();
                    if (modelValue.length === 1 && _eq(modelValue[0], valueCode)) {
                        return;
                    }
                    modelValue = [valueCode];
                } else {
                    const index = modelValue.findIndex(item => _eq(item, valueCode));
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

            const value = multiple ? modelValue : modelValue[0];
            const currents = listRef.value.filter(a => isSelect(a.valueCode));
            const labels = currents.map(a => a.valueName);

            emit('update:modelValue', value);
            emit('update:current', multiple ? currents : currents[0]);
            emit('update:label', multiple ? labels : labels[0]);
            emit('change', value);

            setViewValue()

            function close() {
                nextTick(rollBackData);
            }
        }

        async function loadData() {
            if (!canLoad) {
                return
            }
            canLoad = false;
            listRef.value = (await getKeyCodes(props.keyCode)).data || [];
        }

        let oldSearchText, filterList;

        // 过滤列表
        function filter(searchText = '') {
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
                if (modelValue.length > 4) {
                    viewValue.value = `已选中${modelValue.length}个`
                } else {
                    viewValue.value = listRef.value.filter(a => isSelect(a.valueCode)).map(a => a.valueName).join('、');
                }
            } else {
                viewValue.value = ''
            }
        }

        function rollBackData() {
            dropdownShowRef.value = false;
            searchText.value = '';
            filterList = []
        }

        function getModelValue() {
            const {modelValue} = props;
            if (props.multiple) {
                return modelValue || [];
            } else if (modelValue != null && modelValue !== '' && !isNaN(modelValue)) {
                return [modelValue];
            }
            return []
        }

        function isSelect(code) {
            return selecteds.value.findIndex(a => _eq(a, code)) > -1;
        }

        function _eq(a, b) {
            return a == b;
        }

        return {
            viewValue, dropdownRef, dropdownShowRef,
            listRef, elementRef, searchText, selecteds,
            filter, dropdownOpen, dropdownBlur, isSelect,
            searchFocus, searchBlur, toggleSelected,
        }
    }
}
</script>

<style lang="less" scoped>
.multiple-select {
    user-select: none;
    position: relative;

    .form-control {
        cursor: default;

        &, &::placeholder {
            color: #999;
        }

        &.open {
            border-radius: 2px 2px 0 0;
        }
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

        &:focus {
            outline: 0;
        }

        .ul-list {
            max-height: 200px;
            overflow-y: auto;
            margin: 0 5px;
            padding: 4px;

            &::-webkit-scrollbar {
                width: 8px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: rgba(52, 51, 51, 0.2);
            }

            &::-webkit-scrollbar-track {
                border-radius: 0;
                background: transparent;
            }

            li {
                position: relative;
                list-style: none;
                height: 26px;
                line-height: 30px;
                cursor: default;
                padding: 0 4px;

                input[type=checkbox] {
                    pointer-events: none;
                    margin-right: 5px;
                }

                &:not(:last-child) {
                    border-bottom: 1px solid #f1f1f1;
                }

                .text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .selected-icon {
                    display: none;
                    font-size: 6px;
                }

                &.active-multiple {
                    .text {
                        color: rgb(53, 95, 214);
                    }

                    .selected-icon {
                        display: block;
                    }
                }

                &:hover, &.active {
                    background-color: #e8e8e8;
                    border-color: #e8e8e8;
                }
            }
        }

        .search-wrap {
            height: 28px;
            position: relative;
            padding: 6px 8px;
        }
    }
}
</style>
