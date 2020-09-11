#### date 日期组件 文档

基本使用

```vue
<template>
    <form-item type="date" v-mode="value"/>
</template>

<script>
    export default {
        setup(){
            const value = ref("2020-3-3") //初始化日期 -- 必须是日期格式 YYYY-mm-dd || YYYY-MM-DD
            return {value}
        }
    }
</script>
```


config配置，限制日期选择范围
config = {
    min // 可选择日期的最小范围
    max // 可选择日期的最大范围
}

```vue
<template>
    <form-item type="date" v-mode="value" config="{min:'2020-1-2',max:'2020-10-23'}"/>
</template>

<script>
    export default {
        setup(){
            const value = ref("2020-2-2") //初始化日期 -- 必须是日期格式 YYYY-mm-dd || YYYY-MM-DD

            return {value}
        }
    }
</script>
```

绑定change事件

```vue
<template>
    <form-item type="date-range" v-mode="value" @change="change"/>
</template>

<script>
    export default {
        setup(){
            const value = ref("2020-2-2") //初始化日期 -- 必须是日期格式 YYYY-mm-dd || YYYY-MM-DD  
            function change(date){
                console.log(date) //可以获取发生改变的值
            }                                                 
            return {value,change}
        }
    }
</script>
```