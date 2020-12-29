<template>
    <div class="switch-btn" layout="row" layout-align="start center">
        <input type="checkbox" ref="elementRef" :id="forId"
               @change="change" :checked="modelValue" :disabled="disabled">
        <label :for="forId" :class="{checked:modelValue}">
            <slot :checked="modelValue" v-if="$slots.default"/>
            <template v-else>&nbsp;</template>
        </label>
    </div>
</template>

<script>
import {registerValidate} from "../../form-validator";
import {ref} from 'vue';
import {getUuid} from "../../util";

export default {
    props: {
        modelValue: Boolean,
        disabled: Boolean,
        validateRule: Object
    },
    setup: function (props, {emit}) {
        const elementRef = ref();
        const forId = getUuid('switch_');

        registerValidate({ref: elementRef, props});

        function change(e) {
            emit('update:modelValue', e.target.checked);
            emit('change', e.target.checked);
        }

        return {change, elementRef, forId}
    }
}
</script>
<style scoped lang="less">
.switch-btn {
    @size: 24px;
    @selectSize: @size + 2px;
    position: relative;
    background: none;
    border: none;
    padding: 0;
    display: inline-block;
    vertical-align: middle;

    label {
        user-select: none;
        display: inline-block;
        position: relative;
        min-width: 40px;
        height: @size;
        line-height: @size;
        border-radius: 100px;
        padding: 0 5px 0 @selectSize;
        font-size: 12px;
        background: #e2e7f0;
        transition: padding ease .3s;

        &:before {
            content: '';
            position: absolute;
            height: @size - 4px;
            width: @size - 4px;
            top: 2px;
            left: 2px;
            border-radius: 50%;
            background-color: #fff;
            transition: left ease .2s;
        }

        &.checked {
            text-align: right;
            padding-left: 5px;
            padding-right: @selectSize;
            background: #355fd6;
            color: #fff;

            &:before {
                left: calc(100% - @size + 2px);
            }
        }

        cursor: pointer;
    }

    input[type=checkbox] {
        position: absolute;
        opacity: 0;
        pointer-events: none;

        &[disabled] + label {
            opacity: .8;
            cursor: not-allowed;
        }
    }
}
</style>

