#### number 数字文本框组件 文档

基本使用

- {Number} `to-fixed` 保留几位小数
- {Boolean} `integer` 是否启用整数模式，在失去焦点之前总是会格式化内容为整数

```vue

<template>
    <form-item type="number" v-model="value" :to-fixed="2"/>
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
