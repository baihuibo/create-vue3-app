### 表单 组件 文档

基础用法
```vue
<template>
    <form @submit="submitFn" ref="formRef" layout="row" layout-wrap>
        <form-interface label="name:" flex="33">
            <form-item type="input"
                       v-model="formData.name"
                       :validate-rule="{required:false}"/>
        </form-interface>
        <form-interface label="age:" flex="33">
            <form-item type="select"
                       v-model="formData.age"
                       :validate-rule="{required:true}"/>
        </form-interface>

        <div flex="100" layout="row" layout-align="center center">
            <button type="submit">提交</button>
            <button type="reset">重置</button>
            <button type="button" @click="triggerValidate">手动触发校验</button>
        </div>
    </form>
</template>
<script>
export default {
    setup(){
        const formRef = ref({});
        const formData = reactive({
            name : '',
            age : '',
            prop : '',
        });

        function submitFn() {
           // 处理表单提交操作

        }

        function triggerValidate(){
            if (!formRef.value.checkValidity()) {
                formRef.value.reportValidity()
            }
        }

        return {
            submitFn,
            formRef , formData,triggerValidate
        };
    }
}
</script>
```

- `formRef.value.checkValidity()` 触发表单校验，校验通过返回`true`，否则返回`false`
- `formRef.value.reportValidity()` 弹出表单提示语
