<template>
    <input type="number" ref="elementRef"
           class="form-control" :class="{step : step>0}"
           @keydown.e.prevent
           @keydown.E.prevent
           @blur="change"
           :step="step || 'any'">
</template>

<script>
import {registerValidate} from "../../form-validator";
import {onMounted, onUpdated, ref} from 'vue';

export default {
    props: {
        modelValue: [Number, String],
        validateRule: Object,
        toFixed: Number,
        step: Number,
        integer: Boolean
    },
    setup(props, {emit}) {
        const elementRef = ref({});

        registerValidate({ref: elementRef, props});

        onMounted(() => {
            const newValue = elementRef.value.value = formatFn(props.modelValue);
            update(newValue);
        })
        onUpdated(() => {
            const {value: target} = elementRef;

            target.value = '';
            target.value = formatFn(props.modelValue);
        })

        function change({target}) {
            if (isNaN(target.valueAsNumber)) {
                target.value = '';
            }
            const value = target.valueAsNumber;
            update(formatFn(value));
        }

        function update(newValue) {
            if (props.modelValue !== newValue) {
                emit('update:modelValue', newValue);
            }
        }

        function formatFn(value) {
            if (value == null || value === '' || isNaN(value)) {
                return null;
            }
            value = Number(value);
            if (props.integer) {
                value = Math.floor(value); // 将所有小数都舍去
            } else if (props.toFixed) {
                return +value.toFixed(props.toFixed)
            }
            return value;
        }

        return {change, elementRef}
    }
}
</script>

