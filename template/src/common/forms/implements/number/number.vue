<template>
    <input type="number" ref="elementRef"
           @keydown.e.prevent
           @keydown.E.prevent
           :value="formatFn(modelValue)"
           @blur="change" @input="change"
           class="form-control" step="any">
</template>

<script>
import {registerValidate} from "../../form-validator";
import {ref} from 'vue';

export default {
    props: ['modelValue', 'validateRule', 'toFixed'],
    setup(props, {emit}) {
        const elementRef = ref({});

        registerValidate({ref: elementRef, props});

        function change({target}) {
            if (isNaN(target.valueAsNumber)) {
                target.value = '';
            }
            emit('update:modelValue', formatFn(target.value));
        }

        function formatFn(value) {
            if ((value == null || value === '')) {
                return value;
            }
            value = Number(value);
            if (props.toFixed) {
                return +value.toFixed(props.toFixed)
            }
            return value;
        }

        return {change, formatFn, elementRef}
    }
}
</script>

