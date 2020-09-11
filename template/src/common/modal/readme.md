### modal 弹出层 文档

基础用法
```js
import {modal} from '/src/common/modal/modal';

// 1. 通过 modal.open 来打开一个自定义内容的弹窗
const openModal = async () => {
    const res = await modal.open(import('../content-modal.vue'), {
        title : '自定义标题，默认 `提示`',
        width : '500px', // 设置宽度（需带px或者em），默认500px
        data: { // 设置组件数据
            name: 'abc'
        }
    });
    console.log('res', res); // 关闭事件的回传值
}

openModal(); // 打开弹窗

// 2. 通过 modal.alert 打开提示弹窗，await 可以在 async 方法中阻塞后续代码执行
await modal.alert('打开一个带有关闭按钮的alert','自定义标题'); 

// 3. 通过 modal.confirm 打开确认提示弹窗
const res = await modal.alert('打开一个带有确认和关闭按钮的confirm', '确认框标题');
if(res){
   console.log('确认操作');
} 

// 4 通过 modal.showLoading / modal.hideLoading 打开/关闭 遮罩层
modal.showLoading(); // 打开
modal.hideLoading(); // 关闭
```

`content-modal.vue` 组件内实现
```vue
<template>
    <div> <!-- 最好使用单根节点 -->

        <!-- 这里可以输出 `abc` -->
        <div>{{data.name}}</div> 

        <!-- 内置样式 .dialog-footer -->
        <div class="dialog-footer"> 
            
            <!-- $emit('close') 触发关闭事件 -->
            <!-- $emit('close', data) 触发关闭事件，可携带返回数据 -->
            <!-- 按钮样式根据需要可自定义 -->
            <button @click="$emit('close')">关闭</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'] // 通过 data 来接收传入的 组件数据
}
</script>

<style lang="less" scoped>...</style>
```

其它 doc
```js
/**
 * 打开弹出层
 * @param component 弹出层组件
 * @param option
 * @param option.title? 设置弹窗标题
 * @param option.data? 设置弹窗数据
 * @param option.width? 设置宽度，默认500px
 * @returns {Promise<any>}
 */
modal.open = function(component , option) {
}

/**
 * 打开弹出层
 * @param msg 提示内容
 * @param title 标题默认“提示”
 * @param width
 * @returns {Promise<>}
 */
modal.alert = function(msg, title , width = '300px') {
}

/**
 * 打开弹出层
 * @param msg 提示内容
 * @param title 标题，默认“提示”
 * @param width
 * @returns {Promise<boolean>}
 */
modal.confirm = function(msg , title , width = '300px') {
}

// 打开遮罩层
modal.showLoading =function() {};

// 关闭遮罩层，focus = true时，将强制关闭遮罩层
modal.hideLoading = function(focus = false) {}
```
