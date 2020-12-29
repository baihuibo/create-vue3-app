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
    setup() {
        const formRef = ref({});
        const formData = reactive({
            name: '',
            age: '',
            prop: '',
        });

        function submitFn() {
            // 处理表单提交操作

        }

        function triggerValidate() {
            if (!formRef.value.checkValidity()) {
                formRef.value.reportValidity()
            }
        }

        return {
            submitFn,
            formRef, formData, triggerValidate
        };
    }
}
</script>
```

- `formRef.value.checkValidity()` 触发表单校验，校验通过返回`true`，否则返回`false`
- `formRef.value.reportValidity()` 弹出表单提示语

#### 表单元素示意

- `<form-interfalce>` 一个表单对象容器，
    - 可设置 `label` 来显示标签名称
    - 可设置 `required` 来给标签加一个红色的`*`
- `<form-item>` 一个表单元素容器，`type` 为组件类型，具体参数可参考 `implements` 中组件类型

```vue

<template>
    <form-interface label="name:" required flex="33">
        <form-item type="input"
                   v-model="data.name"
                   :validate-rule="{required:false}"/>
    </form-interface>
</template>
```
