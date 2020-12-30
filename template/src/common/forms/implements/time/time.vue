<template>
    <div class="container" tabindex="1" @blur="blur" @focus="containerFocus">
        <input type="text" class="form-control" ref="elementRef" data-type="time"
               :disabled="disabled" :readonly="disabled" :value="valueRef" :placeholder="placeholder"
               @keydown.prevent.stop @paste.prevent.stop @cut.prevent.stop
               @click="focus" @blur="inputBlur">

        <div class="arrows" layout="column" layout-align="center center">
            <span class="arrow-up" @click="calcTime(1)"></span>
            <span class="arrow-down" @click="calcTime(0)"></span>
        </div>

        <transition name="slide-down">
            <div v-if="showContentRef" class="content-view" layout="row">
                <div flex class="list" v-if="listState.HH">
                    <div class="item" :class="{active:item === dateState.hh}"
                         :ref="el => scrollIntoView(el,item === dateState.hh)"
                         @click="change(item)" v-for="item in HH">{{ item }}
                    </div>
                </div>
                <div flex class="list" v-if="listState.mm">
                    <div class="item" :class="{active:item === dateState.mm}"
                         :ref="el => scrollIntoView(el,item === dateState.mm)"
                         @click="change(null,item)" v-for="item in MM">{{ item }}
                    </div>
                </div>
                <div flex class="list" v-if="listState.ss">
                    <div class="item" :class="{active:item === dateState.ss}"
                         :ref="el => scrollIntoView(el,item === dateState.ss)"
                         @click="change(null,null,item)" v-for="item in SS">{{ item }}
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {registerValidate} from "../../form-validator";
import {computed, ref, nextTick, onUpdated, onMounted, warn, reactive} from 'vue';

export default {
    props: {
        modelValue: String, // hh:mm
        hh: String,
        mm: String,
        ss: String,
        format: String,
        hourStep: [Number, String],
        minuteStep: [Number, String],
        secondStep: [Number, String],
        placeholder: String,
        disabled: Boolean,
        readonly: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        const elementRef = ref({});
        registerValidate({ref: elementRef, props});
        const HH = generateList(0, 24, getStep('hourStep')),
            MM = generateList(0, 60, getStep('minuteStep')),
            SS = generateList(0, 60, getStep('secondStep')),
            showContentRef = ref(false),
            dateState = reactive({hh: '', mm: '', ss: ''}),
            listState = reactive({HH: false, mm: false, ss: false}),
            valueRef = computed(() => {
                const {hh, mm, ss} = dateState;
                if (hh || mm || ss) {
                    return format.replace(/HH/g, hh).replace(/mm/g, mm).replace(/ss/g, ss)
                }
            });

        const defaultFormat = 'HH:mm';
        const dateReg = /(HH|mm|ss)/g;
        const sortMap = {HH: 3, mm: 2, ss: 1}; // 排序
        const stepMap = {HH: 'hourStep', mm: 'minuteStep', ss: 'secondStep'}; // step 映射

        let formats = [], format = '', formatReg;

        onUpdated(update);
        onMounted(update);

        function update() {
            nextTick(() => {
                if ((props.format || defaultFormat) !== format) { // 如果格式发生变化
                    format = props.format || defaultFormat;
                    formatReg = RegExp(format.replace(dateReg, '(?<$1>\\d{1,2})'));
                    formats = Array.from(new Set(format.match(dateReg) || []));
                    formats.sort((a, b) => sortMap[a] - sortMap[b]); // 小到大，ss-mm-hh
                    formats.forEach(prop => listState[prop] = true);
                }

                if (props.modelValue && props.modelValue !== valueRef.value) {
                    const exec = formatReg.exec(props.modelValue);
                    if (exec && exec.groups) {
                        dateState.hh = timePad(Math.min(+exec.groups.HH, 23));
                        dateState.mm = timePad(Math.min(+exec.groups.mm, 59));
                        dateState.ss = timePad(Math.min(+exec.groups.ss, 59));
                    } else {
                        warn('time 组件，输入时间不合法，以将它设置为空', props.modelValue)
                        dateState.hh = dateState.mm = dateState.ss = '';
                    }
                    change();
                } else if (props.modelValue === null) {
                    dateState.hh = dateState.mm = dateState.ss = '';
                    change();
                }
            })
        }

        let canBlur = true;

        function containerFocus() {
            canBlur = false;
        }

        function inputBlur(e) {
            setTimeout(() => canBlur && blur(), 100)
        }

        function focus() {
            canBlur = true;
            showContentRef.value = true;
        }

        function blur() {
            showContentRef.value = false;
        }

        function change(hh, mm, ss) {
            if (hh != null || mm != null || ss != null) {
                dateState.hh = getDateValue(dateState.hh, hh);
                dateState.mm = getDateValue(dateState.mm, mm);
                dateState.ss = getDateValue(dateState.ss, ss);
            }

            emit('update:modelValue', valueRef.value);
            emit('update:hh', dateState.hh);
            emit('update:mm', dateState.mm);
            emit('update:ss', dateState.ss);
            emit('change', valueRef.value);
        }

        /**
         * 计算时间
         * @param plus 1 加，0 减
         */
        function calcTime(plus) {
            let updateMinutes, updateHours,
                hh = +dateState.hh || 0,
                mm = +dateState.mm || 0,
                ss = +dateState.ss || 0;

            const date = new Date();
            date.setHours(hh, mm, ss);

            formats.forEach((prop, index) => {
                let currentStep = getStep(stepMap[prop]);
                currentStep = plus === 1 ? currentStep : -currentStep;

                if (prop === 'ss' && (index === 0)) { // 尝试递增秒
                    date.setSeconds(ss + currentStep);
                    if (date.getMinutes() !== mm) { // 分钟发生变化了
                        updateMinutes = true;
                    }
                } else if (prop === 'mm' && (index === 0 || updateMinutes)) {
                    date.setMinutes(mm + currentStep);
                    if (date.getHours() !== hh) { // 小时发生变化了
                        updateHours = true;
                    }
                } else if (prop === 'HH' && (index === 0 || updateHours)) {
                    date.setHours(hh + currentStep);
                }
            })

            change(date.getHours(), date.getMinutes(), date.getSeconds());
            showContentRef.value = false;
        }

        function getStep(prop) { // 获取步长
            const max = prop === 'hourStep' ? 24 : 60;
            const step = parseInt(+props[prop]) || 1;
            if (step > max) {
                return max;
            }
            if (step < 1) {
                return 1;
            }
            return step;
        }

        function scrollIntoView(el, active) { // 将元素放到滚动视窗内
            if (active) {
                nextTick(() => {
                    el && el.scrollIntoViewIfNeeded && el.scrollIntoViewIfNeeded();
                });
            }
        }

        return {
            change, calcTime, scrollIntoView,
            containerFocus, inputBlur, focus, blur,
            elementRef, valueRef, showContentRef,
            HH, MM, SS, dateState, listState
        }
    }
}

function generateList(form, to, step = 1) {
    const list = [];
    for (; form < to; form += step) {
        list.push(timePad(form));
    }
    return list;
}

function timePad(time) {
    if (time != null) {
        return String(time).padStart(2, '0')
    }
    return '';
}

function getDateValue(oldValue, value) {
    if (value != null) {
        return timePad(value);
    } else if (!oldValue) {
        return '00';
    }
    return oldValue;
}
</script>

<style scoped lang="less">
.container {
    position: relative;
    border: none;
    outline: none;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);

    input {
        width: 100%;
        box-sizing: border-box;
    }

    .arrows {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 24px;
        @size: 5px;
        @color: #9d9d9d;
        @hover-color: #000000;

        .arrow-up, .arrow-down {
            display: block;
            width: 0;
            height: 0;
            cursor: pointer;
            border-left: @size solid transparent;
            border-right: @size solid transparent;
        }

        .arrow-up {
            border-bottom: @size solid @color;

            &:hover {
                border-bottom-color: @hover-color;
            }
        }

        .arrow-down {
            margin-top: 3px;
            border-top: @size solid @color;

            &:hover {
                border-top-color: @hover-color;
            }
        }
    }
}

.content-view {
    width: 100%;
    position: absolute;
    left: 0;
    top: 30px;
    background: #fff;
    z-index: 9999;
    border: 1px solid #ccc;
    border-top: 0;
    box-sizing: border-box;
    box-shadow: 0 5px 10px rgba(0, 0, 0, .25);
    border-radius: 0 0 5px 5px;

    .list {
        max-height: 200px;
        overflow: auto;
        text-align: center;

        &:not(:first-child) {
            border-left: 1px solid #f0f0f0;
        }

        .item {
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            cursor: pointer;

            &:hover {
                background-color: #e7e7e7;
            }

            &.active {
                background-color: #3c6bff;
                color: #fff;
            }
        }
    }
}
</style>
