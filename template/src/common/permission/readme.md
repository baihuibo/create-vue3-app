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

进阶用法，支持与或非，多权限
```vue
<template>
    <form>
        (PERF:RULE1) || ( PERF:RULE2 && PERF:RULE3 )  下面俩种写法是一样的（括号可选）
        <button type="button"
                v-permission:(PERF:RULE1)||(PERF:RULE2&&PERF:RULE3)>功能按钮</button>
        <button type="button"
                v-permission:PERF:RULE1||(PERF:RULE2&&PERF:RULE3)>功能按钮</button>


        (PERF:RULE2) && (PERF:RULE1)  下面俩种写法效果一样（括号可选）
        <button type="button"
                v-permission:(PERF:RULE2)&&(PERF:RULE1).show>功能按钮</button>
        <button type="button"
                v-permission:PERF:RULE2&&PERF:RULE1.show>功能按钮</button>

        因为语法限制，上面的 && || ! 与或非符号中间，不允许添加空格，还可以这样写改为使用模板变量
        <button type="button"
                v-permission:[mutlPermission]>功能按钮</button>
        <button type="button"
                v-permission:[mutlPermission].show>功能按钮</button>
    </form>
</template>
<script >
export const mutlPermission = 'RULE1 || rule2 || (rule3 && rule4)';
</script>
```

 - 可在任意html标签上使用
 - v-permission:`ruleCode` 这部分即是权限编码
 - v-permission:`ruleCode`.show  `.show` 表示，如果没权限的时候，元素不会隐藏，但是，但是会禁止所事件
 - 该组件将自动调用接口校验权限是否有效，如果无效，则会隐藏该html元素(display:none)
