#### text 文本框组件 文档

基本使用

```vue

<template>
    <form-item type="text" v-model="value"/>
</template>

<script>
export default {
    setup() {
        const value = ref("") //声明赋值变量
        return {value}
    }
}
</script>
```