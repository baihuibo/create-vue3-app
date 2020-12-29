<template>
    <input type="text" :value="modelValue" ref="elementRef" @input="change" @blur="change" class="form-control">
</template>

<script>
import {registerValidate} from "../../form-validator";
import {ref} from 'vue';

export default {
    props: ['modelValue', 'validateRule'],
    setup: function (props, {emit}) {
        const elementRef = ref();

        registerValidate({ref: elementRef, props});

        function change(e) {
            emit('update:modelValue', e.target.value);
        }

        return {change, elementRef}
    }
}
</script>

