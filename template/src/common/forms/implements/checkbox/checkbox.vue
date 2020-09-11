<template>
    <div>
        <span v-for="(item,i) in listRef" class="checkbox">
            <input :disabled="disabled" @click="change($event, item)" :id="uuid+i" type="checkbox"
                   :checked="isSelected(item.valueCode)" :ref="el => elementRef[i] = el"/>
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
        modelValue: Array,
        keyCode: String,
        list: Array,
        disabled: Boolean,
        validateRule: Object
    },
    setup(props, {emit}) {
        const listRef = ref([]);
        const elementRef = ref([]);
        const uuid = getUuid();
        const selectedListRef = ref([]);
        registerValidate({ref: elementRef, props})
        onMounted(async () => {
            if (props.keyCode) {
                listRef.value = (await getKeyCodes(props.keyCode)).data;
            } else {
                listRef.value = props.list;
            }
            if (Array.isArray(props.modelValue) && props.modelValue.length) {
                selectedListRef.value = props.modelValue.slice(0)
            }
        })

        watchEffect(() => {
            if (selectedListRef.value.toString() !== props.modelValue.toString()) {
                selectedListRef.value = props.modelValue.slice(0);
            }
        });

        function isSelected(code) {
            return selectedListRef.value.includes(code);
        }

        function change(e, item) {
            if (e.target.checked) {
                selectedListRef.value.push(item.valueCode);
            } else {
                let index = selectedListRef.value.indexOf(item.valueCode);
                selectedListRef.value.splice(index, 1);
            }
            emit('update:modelValue', selectedListRef.value.slice(0).sort());
        }

        return {listRef, change, isSelected, elementRef, uuid, selectedListRef}
    }
}
</script>
<style scoped>
.checkbox {
    margin-right: 10px;
}

.checkbox input {
    margin-right: 5px;
}
</style>
