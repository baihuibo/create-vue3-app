#### switch 开关组件 文档

基本使用

```vue

<template>
    <form-item type="switch" v-mode="value"/>
</template>

<script>
export default {
    setup() {
        const value = ref(true) //声明赋值变量
        return {value}
    }
}
</script>
```

插槽使用，可以定制组件文本、图标

```vue

<template>
    <form-item type="switch" v-mode="value">
        <template #default="{checked}">
            {{checked ? '是' : '否'}}
        </template>
    </form-item>
</template>

<script>
export default {
    setup() {
        const value = ref(true) //声明赋值变量
        return {value}
    }
}
</script>
```

其它选项

- `v-model`
- `disabled`
- `validateRule`
- `@change`