### tree 树组件 文档

该组件不需要页面单独引入，已安装到全局

基础用法

```vue

<template>
    <async-component type="tree"
                     :nodes="nodes"
                     @load="treeRef = $event"/>
</template>

<script>
export default {
    setup() {
        const treeRef = ref();
        const nodes = [];

        return {treeRef, nodes}
    }
}
</script>
```

插槽模板渲染，可定制节点展示模板或者定制按钮等

模板插槽变量

- `node` 当前节点
    - `node.parentNode` 父节点
    - `node.id` 节点id
    - `node.name` 节点
    - `node.children` 子节点
    - `node.search` 当搜索过滤节点时，search为搜索对象
        - `node.search.searchText`  搜索关键词
        - `node.search.beforeStr` 关键词之前的内容
        - `node.search.afterStr`  关键词之后的内容

      > `node.search` 可用来展示搜索关键词，如默认展示规则为： <br>
      `{{ beforeStr }}<em>{{ searchText }}</em>{{ after }}` <br>
      将搜索关键词变为红色加粗状

- `util` 工具类，可用来操作一些内部状态
    - `util.toggleExpanded(node)`  切换节点的展开收起状态
    - `util.toggleChecked(node,checked)` 切换节点的checkbox选中状态
    - `util.toggleSelect(node)`  切换节点的选中状态

- `level` 层级
- `checkable` 是否显示checkbox

```vue

<template>
    <async-component type="tree" :nodes="nodes">
        <template #icon="{node}">
            // 图标实现，16 * 16，margin-right:8px
            <span class="custom-icon"></span>
        </template>
        <template #default="{node , util}">
            {{node.name}}
            <button @click.stop="clickFn(node)">自定义按钮</button>
        </template>
    </async-component>
</template>

<script>
export default {
    setup(props) {
        const treeRef = ref();
        const nodes = [];
        const clickFn = function (node) {
            console.log('node', node)
        }
        return {treeRef, nodes, clickFn}
    }
}
</script>
```

搜索树节点

直接设置变量 `searchText` 即可触发搜索

```vue

<template>
    <input type="text" v-model="searchText">

    <async-component type="tree"
                     :nodes="nodes"
                     :search-text="searchText"/>
</template>

<script>
export default {
    setup(props) {
        const treeRef = ref();
        const nodes = [];
        const searchText = ref('')

        return {treeRef, nodes, searchText}
    }
}
</script>
```

插槽模板渲染，若要特殊展示搜索项，则可通过`node.search` 来动态处理

`node.search` 是搜索对象

- `node.search.beforeStr`  关键词之前的内容
- `node.search.searchText` 搜索关键词
- `node.search.afterStr`   关键词之后的内容

```vue

<template>
    <async-component type="tree" :nodes="nodes">
        <template #default="{node,parentNode}">
            <p>
                <template v-if="node.search">
                    {{node.search.beforeStr}}
                    <em>{{node.search.searchText}}</em>
                    {{node.search.afterStr}}
                </template>
                <template v-else>{{node.name}}</template>
            </p>
        </template>
    </async-component>
</template>

<script>
export default {
    setup(props) {
        const treeRef = ref();
        const nodes = [];

        return {treeRef, nodes}
    }
}
</script>
```

其它 ref api doc

```js
const treeRef = ref();
const tree = treeRef.value;
/**
 * 获取所有选中的节点
 * @param all 是否获取所有节点（如包含孩子呗选中时，将孩子也一块返回）
 * @return {Array}
 **/
tree.getAllSelectedNodes(all)

/**
 * 获取所有check选中的节点
 * @param all 是否获取所有节点（如包含孩子呗选中时，将孩子也一块返回）
 * @return {Array}
 **/
tree.getAllCheckedNodes(all)


tree.selected    // 获取当前选中的节点（仅单选的时候）
```

- 其它组件 prop api doc

```html

<async-component
        type="tree"
        selected-multi
        checkable
        simple-data
        id-key="id" pid-key="pid"
        :nodes="nodes"
        :root-id="null"
        :load-data="loadDataFn"
        :search-text="searchTextRef"
        :expanded-level="2"
        @load="treeRef = $event"
        @before-select="beforeSelectFn"
        @select="selectFn"
        @before-check="beforeCheckFn"
        @check="checkFn"/>
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
            <td>selected-multi</td>
            <td>Boolean</td>
            <td>false</td>
            <td>否</td>
            <td>是否允许多选节点</td>
        </tr>
        <tr>
            <td>checkable</td>
            <td>Boolean</td>
            <td>false</td>
            <td>否</td>
            <td>是否显示多选框，默认false</td>
        </tr>
        <tr>
            <td>simple-data</td>
            <td>Boolean</td>
            <td>false</td>
            <td>否</td>
            <td>简单数据</td>
        </tr>
        <tr>
            <td>id-key</td>
            <td>String</td>
            <td>id</td>
            <td>否</td>
            <td>简单数据模式时的id标记</td>
        </tr>
        <tr>
            <td>pid-key</td>
            <td>String</td>
            <td>pid</td>
            <td>否</td>
            <td>简单数据模式时的pid标记</td>
        </tr>
        <tr>
            <td>nodes</td>
            <td>Array</td>
            <td></td>
            <td>否</td>
            <td>树节点数据</td>
        </tr>
        <tr>
            <td>root-id</td>
            <td>Null</td>
            <td></td>
            <td>否</td>
            <td>根节点id</td>
        </tr>
        <tr>
            <td>load-data</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>当异步节点加载时触发，返回promise可动态加载子节点数据</td>
        </tr>
        <tr>
            <td>search-text</td>
            <td>String</td>
            <td></td>
            <td>否</td>
            <td>过滤节点</td>
        </tr>
        <tr>
            <td>expanded-level</td>
            <td>Number</td>
            <td>0</td>
            <td>否</td>
            <td>初始化时，展开几级节点，默认0</td>
        </tr>
        <tr>
            <td>load</td>
            <td>Event</td>
            <td></td>
            <td>否</td>
            <td>组件加载完成后触发，可获取组件实例</td>
        </tr>
        <tr>
            <td>before-select</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>选中节点前调用，若返回false，则停止选中</td>
        </tr>
        <tr>
            <td>select</td>
            <td>Event</td>
            <td></td>
            <td>否</td>
            <td>当选中节点时触发事件</td>
        </tr>
        <tr>
            <td>before-check</td>
            <td>Function</td>
            <td></td>
            <td>否</td>
            <td>多选框选中之前触发，若返回false，则停止选中</td>
        </tr>
        <tr>
            <td>check</td>
            <td>Event</td>
            <td></td>
            <td>否</td>
            <td>多选框选中后触发</td>
        </tr>
    </tbody>
</table>
