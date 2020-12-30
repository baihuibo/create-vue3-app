#### time 时间组件 文档

基本使用

```vue

<template>
    <form-item type="time" v-model="value"/>
</template>

<script>
export default {
    setup() {
        const value = ref("12:15") //声明赋值变量
        return {value}
    }
}
</script>
```

- `v-model` 设置、获取时间， 时间格式与 format 一致
- `v-model:hh` 获取小时
- `v-model:mm` 获取分钟
- `v-model:ss` 获取秒
- `hour-step` 设置步长-小时 默认1
- `minute-step` 设置步长-分钟 默认1
- `second-step` 设置步长-秒 默认1
- `format` 格式化时间，默认 `HH:mm`，支持 时`HH`、分`mm`、秒`ss`

```vue

<template>
    <form-item type="time"
               v-model="valueRef"
               v-model:hh="hhRef"
               v-model:mm="mmRef"
               v-model:ss="ssRef"
               hour-step="10"
               minute-step="10"
               second-step="10"
               format="HH点mm分ss秒"
               placeholder="请选择时间"/>
</template>

<script>
export default {
    setup() {
        const valueRef = ref("12点20分12秒") // 设置默认显示时间
        const hhRef = ref("") // 小时
        const mmRef = ref("") // 分钟
        const ssRef = ref("") // 秒
        return {valueRef, hhRef, mmRef, ssRef}
    }
}
</script>
```

其它属性

- `v-model:hh`
- `v-model:mm`
- `v-model:ss`
- `placeholder`
- `hour-step`
- `minute-step`
- `second-step`
- `disabled`
- `readonly`
- `validateRule`
- `@change`
