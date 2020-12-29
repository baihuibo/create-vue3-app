#### date-range 日期范围组件 文档

基本使用

```vue

<template>
    <form-item type="date-range"
               v-mode:start="date.start"
               v-mode:end="date.end"/>
</template>

<script>
export default {
    setup() {
        const date = reactive({   //初始化日期 --日期格式 YYYY-mm-dd || YYYY-MM-DD
            start: '2012-2-2',    //start:起始日期字段
            end: '2020-1-1'       //end：结束日期字段
        })

        return {date}
    }
}
</script>
```


- `config` 配置，限制日期选择范围
```
config = {
    min // 可选择日期的最小范围
    max // 可选择日期的最大范围
}
```

- `change` 绑定事件

```vue

<template>
    <form-item type="date-range"
               :config={min:'2012-2-1',max:'2020-3-2'}
               v-mode:start="date.start"
               v-mode:end="date.end"
               @change="change"/>
</template>

<script>
export default {
    setup() {
        const date = reactive({   //初始化日期 --日期格式 YYYY-mm-dd || YYYY-MM-DD
            start: '2012-2-2',    //start:起始日期字段
            end: '2020-1-1'       //end：结束日期字段
        })

        function change(value) {
            console.log(value) //可以获取发生改变的值
        }

        return {date, change}
    }
}
</script>
```
