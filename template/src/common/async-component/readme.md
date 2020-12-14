### async-component 异步组件

该组件已安装到全局

统一按需异步初始化组件，获取组件实例将改为使用 `@load="instanceRef = $event"`，用来替换之前的 `ref="instanceRef"`

基础用法，`type` 为组件类型，具体可参考 `implements` 中组件类型
```vue
<template>
    <async-component type="user-show"
                     :user-name="name" :user-id="id"/>

    <async-component type="paging"
                     @load="pagingRef = $event"/>
</template>

<script>
import {ref} from 'vue';
export default {
  setup(){
    const pagingRef = ref();
    const name = '用户名';
    const id = '用户id';
    return {name , id , pagingRef};
  }
}
</script>
```
