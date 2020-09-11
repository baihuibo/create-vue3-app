### css flex-layout 文档

基础用法
```html
<div>
<!--    row = 横向布局-->
<!--    column = 纵向布局（需提供固定高度）-->
    <div layout="row">
    
        <!-- flex = 固定百分比，值范围在5~100之间，表示 5% ~ 100%，如（5，10，15，20，25...）-->
        <div flex="5"></div>
        
        <!-- flex = 33% 或者 66% 用来表示 三分之一，三分之二-->
        <div flex="33"></div>
        
        <!-- flex = 空，则表示 分配剩余所有空间，多个flex时，自动平分-->
        <div flex></div>
        <div flex></div>
       
        <!--可填写固定宽度-->
        <div style="width: 100px;"></div>
        
        <!--不设置宽度，则宽度根据内容自动计算-->
        <div>12</div>
    </div>
</div>
```

对齐元素
```html
<div>
    layout-align="x-align y-align"  对齐方式
    x-align = 横向对齐方式(start(开始，默认), center(居中对齐) , end(尾部对齐,右对齐), space-around(两端居中对齐), space-between(两端对齐))
    y-align = 纵向对齐方式(start(开始，默认), center(居中对齐,垂直居中), end(尾部对齐))
    <div layout="row" layout-align="space-between start">
        <div flex></div>
        <div flex></div>
    </div>
</div>
```

其它
```html
<div>
    layout-wrap = 允许折行，当元素排列超过100%宽度时，超过的元素将在下一行显示
    <div layout="row" layout-wrap>
        <div flex="50">1</div>
        <div flex="50">2</div>
        <div flex="50">3</div>
        <div flex="50">4</div>
        <div flex="50">5</div>
    </div>

    layout-padding = 元素之间各添加8px的间距
    layout-margin = 元素之间各添加8px的间距
    <div layout="row" layout-padding layout-margin>
        <div flex="10">1</div>
        <div flex="10">2</div>
        <div flex="10">3</div>
        <div flex="10">4</div>
        <div flex="10">5</div>
        <div flex="10">6</div>
        <div flex="10">7</div>
    </div>
</div>
```
