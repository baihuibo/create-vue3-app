### v-permission 功能权限组件

该组件不需要页面单独引入，已安装到全局

基础用法
```vue
<template>
    <form>
        <button type="button"
                v-permission:PERF:RULE>功能按钮</button>

        <button type="button"
                v-permission:PERF:RULE.show>功能按钮</button>
    </form>
</template>

```

 - 可在任意html标签上使用
 - v-permission:`ruleCode` 这部分即是权限编码
 - v-permission:`ruleCode`.show  `.show` 表示，如果没权限的时候，元素不会隐藏，但是，但是会禁止所事件
 - 该组件将自动调用接口校验权限是否有效，如果无效，则会隐藏该html元素(display:none)
