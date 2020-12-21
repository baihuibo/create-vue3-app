<template>
    <component :is="`v-` + type" ref="iRef"/>
</template>

<script>
import {defineAsyncComponent, getCurrentInstance, ref, warn, watch} from 'vue';

export default {
    components: {
        'v-user-show': defineAsyncComponent(() => import('./implements/user-show/user-show.vue')),
        'v-paging': defineAsyncComponent(() => import('./implements/paging/paging.vue'))
    },
    props: ['type'],
    emits: ['load'],
    setup(props, {emit}) {
        const {type} = getCurrentInstance();
        if (!type.components['v-' + props.type]) {
            warn(`无法初始化 <async-component type="${props.type}"> 请检查组件类型`);
        }
        const iRef = ref();
        const stopWatch = watch(iRef, () => { // 等待实例加载完成
            if (iRef.value) {
                stopWatch();
                emit('load', iRef.value);
            }
        })
        return {iRef};
    }
}
</script>

