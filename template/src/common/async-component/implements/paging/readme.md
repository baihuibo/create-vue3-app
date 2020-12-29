### paging 分页组件 文档

该组件不需要页面单独引入，已安装到全局

基础用法
```vue
<template>
    <form>
        <input type="text" v-model="params.name">
        <button type="button" @click="pagingRef.query(params)">开始查询</button>
    </form>
    <table>
        <tbody>
            <!-- pagingRef.list         获取查询到的数据 -->
            <!-- pagingRef.total        获取总条数 -->
            <!-- pagingRef.totalPage    获取总页数 -->
            <!-- pagingRef.pageSize     获取每页数据条数 -->
            <!-- pagingRef.currentPage  获取当前页数 -->
            <!-- pagingRef.orderNum     获取当前页开始序号 -->
            <tr v-for="(item,index) in pagingRef.list" :key="item.id">
                <td>序号 {{ pagingRef.orderNum + index + 1 }}</td>
                <td>{{item.prop}}</td>
            </tr>
        </tbody>
    </table>
    <async-component type="paging"
        url="/bdc/queryList.htm"
        @load="pagingRef = $event"/>
</template>

<script>
export default {
    setup(props){
        // 声明 paging 组件的ref，默认值必须为 {},否则模板中提前使用的变量会报空指针
        const pagingRef = ref({});
        const params = reactive({ // 声明参数
            name : ''
        });

        return {pagingRef, params}
    }
}
</script>
```
- `init-params` 在组件加载就绪后，将自动触发首次查询
```vue
<template>
    <async-component type="paging"
            url="/bdc/queryList.htm"
            @load="pagingRef = $event"
            :init-params="params"/>
</template>

<script>
export default {
    setup(props){
        const pagingRef = ref({}); // 声明 paging 组件的ref
        const params = reactive({ // 声明参数
            name : ''
        });

        return {pagingRef, params}
    }
}
</script>
```

其它 api doc
```js
const pagingRef  = ref({});
const paging = pagingRef.value;
/**
 * 触发查询
 * 该查询触发时，将自动启用遮罩层
 * @param params 查询参数
 * @param index 查询页数，默认1
 * @return {Promise} 返回promise表示查询事件
 **/
await paging.query(params, index)

/**
 * 刷新当前页查询，查询参数会自动使用上一次的缓存，在执行修改状态等操作时使用
 * @return {Promise} 返回promise表示查询事件
 **/
await paging.refresh()

/**
 * 将所有状态还原到初始化时
 **/
paging.rollback();

paging.list        // 当前页数据
paging.total       // 总条数
paging.totalPage   // 总页数
paging.pageSize    // 每页条数
paging.currentPage // 当前页
paging.orderNum    // 当前页开始序号
paging.cacheParamsRef    // 当前页面数据查询参数
```


 - 静态分页案例
```vue
<template>
    <ul>
        <li v-for="item in pagingRef.list">{{item}}</li>
    </ul>
    <async-component type="paging" :get-data="getData"
                     @load="pagingRef = $event"
                     :init-params="{}"/>
    <!-- 等组件初始化完成后，立刻触发查询 -->
</template>

<script>
export default {
    setup(){
        const pagingRef = ref({});
        const list = [{id:1} , {id:2} , {id:3}]; // 模拟本地数据
        const getData = function( {pageSize , currPage} ) {
            const start = pageSize * (currPage - 1);
            const end = start + pageSize;
            return {
                code : 0,
                data : {
                    total : list.length, // 模拟返回总条数
                    totalPage : Math.ceil(list.length / pageSize), // 模拟返回总页数,向上取整
                    rows : list.slice( start , end ) // 模拟返回数据片段
                }
            }
        };
        return {pagingRef , getData}
    }
}
</script>
```

- 组件 ref api
```js
const pagingRef = ref({}); // 声明 paging 组件的ref
onMounted(async()=>{
    const paging = pagingRef.value;
    console.log('开始查询')
    await paging.query(params);
    console.log('查询结束')
})
```

<table>
    <thead>
        <tr>
            <th>方法/属性</th>
            <th>参数</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>query(params,pageIndex)</td>
            <td>
            params 查询参数 <br>
            pageIndex 查询第几页，默认1
            </td>
            <td>根据参数查询分页数据</td>
        </tr>
        <tr>
            <td>refresh(reload)</td>
            <td>reload 是否从第1页查询，默认false</td>
            <td>重新查询当前页数据/重新从第1页查询</td>
        </tr>
        <tr>
            <td>rollback()</td>
            <td></td>
            <td>重新初始化分页组件状态</td>
        </tr>
        <tr>
            <td>list</td>
            <td></td>
            <td>当前页数据</td>
        </tr>
        <tr>
            <td>total</td>
            <td></td>
            <td>总条数</td>
        </tr>
        <tr>
            <td>totalPage</td>
            <td></td>
            <td>总页数</td>
        </tr>
        <tr>
            <td>pageSize</td>
            <td></td>
            <td>每页条数</td>
        </tr>
        <tr>
            <td>currentPage</td>
            <td></td>
            <td>当前页</td>
        </tr>
        <tr>
            <td>orderNum</td>
            <td></td>
            <td>当前页开始序号</td>
        </tr>
    </tbody>
</table>

- 其它组件 api doc
```html
<async-component type="paging"
        @load="pagingRef = $event"
        url="/path/to/action"   :url="url"
        method="post"           :method="method"
        :page-size="15"
        :init-params="{}"
        :get-data="getDataFn"
        :before-send="beforeSendFn"
        :response-handler="responseHandlerFn"/>
```
<table>
    <thead>
        <tr>
            <th>属性</th>
            <th>值类型</th>
            <th>默认值</th>
            <th>是否必填</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td>string</td>
            <td></td>
            <td>否</td>
            <td>ajax访问地址</td>
        </tr>
        <tr>
            <td>method</td>
            <td>string</td>
            <td>post</td>
            <td>否</td>
            <td>ajax请求类型</td>
        </tr>
        <tr>
            <td>init-params</td>
            <td>Object</td>
            <td>null</td>
            <td>否</td>
            <td>组件加载完成后自动触发查询的参数</td>
        </tr>
        <tr>
            <td>page-size</td>
            <td>number</td>
            <td>15</td>
            <td>否</td>
            <td>每页数据大小</td>
        </tr>
        <tr>
            <td>getData</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>当使用其它方式获取数据时使用（本地分页）</td>
        </tr>
        <tr>
            <td>beforeSend</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>当请求发送之前，可用来处理参数</td>
        </tr>
        <tr>
            <td>responseHandler</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>请求完成后，可用来格式化数据</td>
        </tr>
    </tbody>
</table>
