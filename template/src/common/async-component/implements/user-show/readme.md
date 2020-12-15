### user-show 展示用户信息组件

该组件不需要页面单独引入，已安装到全局

基础用法
```vue
<template>
    <div>
        <async-component type="user-show"
                         :user-name="name" :user-id="id"/>
    </div>
</template>

<script>
export default {
  setup(){
    const name = '用户名';
    const id = '用户id';
    return {name , id};
  }
}
</script>
```
