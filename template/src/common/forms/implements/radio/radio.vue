<template>
    <div>
        <span v-for="(item,i) in listRef" class="radio">
            <input :disabled="disabled" @click="change($event, item)" :id="uuid+i" :name="uuid" type="radio"
                   :ref="el => elementRef[i] = el" :checked="selectedRef === item.valueCode"/>
            <label :for="uuid+i">{{ item.valueName }}</label>
        </span>
    </div>
</template>

<script>
import {onMounted, ref, watchEffect} from 'vue';
import {getKeyCodes, getUuid} from "../../util";
import {registerValidate} from "../../form-validator";

export default {
    props: {
        modelValue: [String, Number],
        label: String,
        keyCode: String,
        list: Array,
        disabled: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        const listRef = ref([]);
        const selectRef = ref(null);
        const uuid = getUuid();
        const elementRef = ref([]);
        registerValidate({ref: elementRef, props}, 'label')
        let selectedRef = ref('');
        onMounted(async () => {
            if (props.keyCode) {
                listRef.value = (await getKeyCodes(props.keyCode)).data;
            } else {
                listRef.value = props.list;
            }
            if (props.modelValue != null && props.modelValue !== '') {
                selectedRef.value = props.modelValue;
            }
        })

        watchEffect(() => {
            if (props.modelValue !== selectedRef.value) {
                selectedRef.value = props.modelValue;
            }
        })

        function change(e, item) {
            selectedRef.value = item.valueCode;
            emit('update:modelValue', item.valueCode);
            emit('update:label', item.valueName);
        }

        return {listRef, change, selectRef, uuid, elementRef, selectedRef}
    }
}
</script>
<style scoped>
.radio {
    margin-right: 10px;
}

.radio input {
    margin-right: 5px;
}
</style>
