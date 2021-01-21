<template>
    <div class="container">
        <input type="text" :placeHolder="placeholder" :disabled="disabled" :value="modelValue"
               @click="showDate" @keydown.stop.prevent
               class="form-control" ref="elementRef" :class="{focus:showDateContent}">
        <div class="boxshaw" ref="boxRef" tabindex="-1" :id="'date'+uuid" v-if="showDateContent"></div>
    </div>
</template>

<script>
import {nextTick, ref} from 'vue';
import {getElemDis, getUuid} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        modelValue: String,
        config: Object,
        placeholder: String,
        disabled: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        let schedule = null;
        const uuid = getUuid();
        const boxRef = ref(null)
        const showDateContent = ref(false)
        const elementRef = ref();
        registerValidate({ref: elementRef, props});

        function change(e) {
            schedule = null;
            showDateContent.value = false;
            emit('update:modelValue', e.target.value);
        }

        function showDate(e) {
            showDateContent.value = true;
            nextTick(async () => {
                // 异步加载日期功能
                await import('./date.less');
                const Schedule = (await import('./schedule')).default;
                let width = document.documentElement.offsetWidth;
                if (width < getElemDis(boxRef.value).right) {
                    boxRef.value.style.left = "initial";
                    boxRef.value.style.right = 0;
                }
                boxRef.value.focus();
                schedule = new Schedule({
                    el: '#date' + uuid,	//容器元素
                    date: props.modelValue,		//当前日期
                    disabledBefore: (props.config || {}).min,	//禁用此日期之前
                    disabledAfter: (props.config || {}).max,	//禁用此日期之后
                    showToday: true,	//回到今天
                    blur: function () {
                        if (schedule) {
                            schedule = null;
                            showDateContent.value = 0;
                        }
                    },
                    clickCb: function (date) {
                        schedule = null;
                        showDateContent.value = false;
                        emit('update:modelValue', date);
                        emit('change', date);
                    }
                });
            })
        }

        return {change, showDate, uuid, showDateContent, boxRef, elementRef}
    }
}
</script>

