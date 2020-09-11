### user-show 展示用户信息组件

该组件不需要页面单独引入，已安装到全局

基础用法
```vue
<template>
    <div>
        <user-show :user-name="name" :user-id="id"/>
    </div>
</template>

<script setup>
export const name = '用户名';
export const id = '用户id';
</script>
```
