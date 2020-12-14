#### select 下拉框组件 文档

基本使用----keycode 使用
```vue
<template>
    <form-item type="select" v-mode="value" :keycode="keycode"/>
</template>

<script>
    export default {
        setup(){
            const value = ref("1");  //初始化选中数据
            const keyCode = 'key';// 声明keycode参数
            return {value,keycode}
        }
    }
</script>
```
基本使用----list 使用

```vue
<template>
    <form-item type="select" v-model="value" :list="listData"/>
</template>
<script>
    export default {
        setup(){
            const value = ref("1");  //初始化选中数据
            const listData = [
                {"valueCode":1,"valueName":"第一行"},
                {"valueCode":2,"valueName":"第二行"},
                {"valueCode":3,"valueName":"第三行"},
                {"valueCode":4,"valueName":"第四行"}]
            return {value,listData}
        }
    }
</script>
```
基本使用----绑定onchange事件

可通过 v-model:label='ref' 来获取选中项的label即 `valueName`
可通过 v-model:current='ref' 来获取选中项的原始数据 即 `{valueCode,valueName}`
```vue
<template>
    <form-item type="select"
            v-model="value"
            v-model:label="label"
            v-model:current="current"
            :list="listData" @change="change"/>
</template>
<script>
    export default {
        setup(){
            const value = ref("1");  //初始化选中数据
            const label = ref("");  //初始化选中数据
            const current = ref();
            const listData = [
                {"valueCode":1,"valueName":"第一行"},
                {"valueCode":2,"valueName":"第二行"},
                {"valueCode":3,"valueName":"第三行"},
                {"valueCode":4,"valueName":"第四行"}
            ]
            function change(e){
                console.log(e.target.value) //可通过event对象获取对应的值
                console.log(value.value) //这个时候，value值已经被改变
                console.log(label.value) //这个时候，value值已经被改变
                console.log(current.value) //这个时候，value值已经被改变
            }
            return {value,label,current,listData,change}
        }
    }
</script>
```
