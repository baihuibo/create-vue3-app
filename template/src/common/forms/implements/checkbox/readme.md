#### checkbox 复选框组件 文档


基本使用keycode

```vue
<template>
    <form-item type="checkbox" v-mode="value" :keycode="keycode"/>
</template>

<script>
    export default {
        setup(){
            const value = ref(["1","2"]) //初始化选中数据  --必须是字符数组类型
            const keyCode = 'key';// 声明keycode参数
            return {value,keycode}
        }
    }
</script>
```
基本使用list

```vue
<template>
    <form-item type="checkbox" v-model="value" :list="listData"/>
</template>
<script>
    export default {
        setup(){
           const value = ref(["1","2"]) //初始化选中数据   --必须是字符数组类型
            const listData = [
                {"valueCode":1,"valueName":"第一行"},
                {"valueCode":2,"valueName":"第二行"},
                {"valueCode":3,"valueName":"第三行"},
                {"valueCode":4,"valueName":"第四行"}]  // 自定义list数据
            return {value,listData}
        }
    }
</script>
```
基本使用-绑定change事件

```vue
<template>
    <form-item type="checkbox" v-mode="value" :keycode="keycode" @change="change"/>
</template>

<script>
    export default {
        setup(){
            const value = ref(["1","2"]) //初始化选中数据  --必须是字符数组类型
            const keyCode = 'key';// 声明keycode参数


            function change(e){
                console.log(value.value)  //这个时候value值已经变更
            }
            return {value,keycode,change}
        }
    }
</script>
```
