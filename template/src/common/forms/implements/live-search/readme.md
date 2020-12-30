#### live-search 搜索框框组件 文档


基本使用
- `url` 接口路径
- `searchContent` 模糊查询接口所需的查询参数

```vue
<template>
    <form-item type="live-search"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({  //如果有初始化数据，id和name为必填，如果缺少任意一个，将出现显示异常
                id:"123",
                name:"abc"
            });
            return {dataRef}
        }
    }
</script>
```

基本使用

- `method`请求方式，默认get，可选择 get|post

```vue
<template>
    <form-item type="live-search" method="get"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({
                id:"123",
                name:"abc"
            });
            return {dataRef}
        }
    }
</script>
```
基本使用
- `params` 接口所需的额外参数

```vue
<template>
    <form-item type="live-search"
               :params="{type:2,time:tiemRef}"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({  //如果有初始化数据，id和name为必填，如果缺少任意一个，将出现显示异常
                id:"123",
                name:"abc"
            });

            const tiemRef = ref("2020-2-2")
            return {dataRef,tiemRef}
        }
    }
</script>
```

基本使用
- `page-size` 每次返回的条数限制 ，默认15

```vue
<template>
    <form-item type="live-search"
               page-size="20" method="get"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({
                id:"123",
                name:"abc"
            });
            return {dataRef}
        }
    }
</script>
```

基本使用

- `empty-search` 在空值的时候也触发搜索（点击即触发搜索）

```vue
<template>
    <form-item type="live-search"
               empty-search
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id" v-model:name="dataRef.name"/>

</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({
                id:"123",
                name:"abc"
            });
            return {dataRef}
        }
    }
</script>
```



基本使用
- `before-send` 发送请求前的处理，返回请求的参数，以json格式返回
- `change` 绑定change事件

```vue
<template>
    <form-item type="live-search"
               :before-send="beforeSend"
               page-size="20" method="get"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"
               @change="change"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({
                id:"123",
                name:"abc"
            });


            function beforeSend(param){
                console.log(param)  //当前请求的参数 -- 可作出改变
                return param; //将改变后的请求参数return
            }
            function change(data){
                console.log(data)  //{valueCode:"123",valueName:"显示名字"}
            }
            return {dataRef,beforeSend,change}
        }
    }
</script>
```

基本使用
- `responseHandler` 处理请求回来的数据

如果后台接口返回的数据不是如下格式的数据,需要通过`responseHandler`函数进行转换
```
{
    code:0,
    data:{
        rows:[{valueCode:"123",valueName:"显示名字"}],
        total:15,
        totalPage:1
    },
    msg:""
}
```

```vue
<template>
    <form-item type="live-search"
               :response-handler="responseHandler"
               :before-send="beforeSend"
               page-size="20" method="get"
               search-content="searchContent"
               url="/bdc/search/buildNames"
               v-model:id="dataRef.id"
               v-model:name="dataRef.name"/>
</template>

<script>
    export default {
        setup(){
            const dataRef = reactive({
                id:"123",
                name:"abc"
            });

            function beforeSend(param){
                console.log(param)  //当前请求的参数 -- 可作出改变
                return param; //将改变后的请求参数return  --注意:格式不能发生变化
            }

            function responseHandler(responseData){
                console.log(param)  //接口返回的数据 -- 可作出改变
                return responseData //将改变后的数据return   --注意:格式不能发生变化
            }
            return {dataRef,beforeSend,responseHandler}
        }
    }
</script>
```
