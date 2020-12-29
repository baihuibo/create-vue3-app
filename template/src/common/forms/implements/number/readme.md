#### number 数字文本框组件 文档

基本使用
- `to-fixed` 保留几位小数
```vue
<template>
    <form-item type="number" v-mode="value" :to-fixed="2"/>
</template>

<script>
    export default {
        setup(){
            const value = ref("") //声明赋值变量
            return {value}
        }
    }
</script>
```
