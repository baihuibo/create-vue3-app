<template>
    <select ref="selectRef" :disabled="disabled" :value="modelValue"
            @click.once="loadData"
            @change="change" class="form-control">
        <option value="" v-if="noPlaceholder !== true" selected>{{ placeholder || '请选择' }}</option>
        <option :value="item.valueCode" v-for="item in listRef">{{ item.valueName }}</option>
    </select>
</template>

<script>
import {nextTick, onMounted, ref, watchEffect} from 'vue';
import {getKeyCodes} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        modelValue: [String, Number],
        label: String,
        keyCode: String,
        lazeload: Boolean, // 懒加载
        list: Array,
        disabled: Boolean,
        placeholder: String,
        noPlaceholder: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        const listRef = ref([]);
        const selectRef = ref(null);
        let canLoad = false;
        registerValidate({ref: selectRef, props}, 'label');
        onMounted(async () => {
            const hasValue = props.modelValue != null && props.modelValue !== '';

            listRef.value = props.list || [];

            if (props.keyCode) {
                if (hasValue || !props.lazeload) {
                    await _load();
                } else {
                    canLoad = true;
                }
            }
            setValue(hasValue);
        });

        async function loadData() {
            if (!canLoad) {
                return;
            }
            canLoad = false;
            await _load();
        }

        async function _load() {
            const result = await getKeyCodes(props.keyCode);
            listRef.value = result.data;
        }

        function setValue(hasValue) {
            if (hasValue || (props.modelValue != null && props.modelValue !== '')) {
                nextTick(() => selectRef.value.value = props.modelValue)
            }
        }

        function change(e) {
            const current = listRef.value.find(item => {
                return String(item.valueCode) === String(e.target.value)
            }) || {};

            emit('update:modelValue', current.valueCode);
            emit('update:label', current.valueName);
        }

        watchEffect(() => {
            if (!props.keyCode) {
                listRef.value = props.list;
                setValue();
            }
        })
        return {listRef, change, selectRef, loadData}
    }
}
</script>

