<template>
    <component :is="`v-` + type" ref="iRef">
        <template v-for="(_,name) of $slots" v-slot:[name]="binds">
            <slot :name="name" v-bind="binds"/>
        </template>
    </component>
</template>

<script>
import {defineAsyncComponent, getCurrentInstance, ref, warn, watch} from 'vue';

export default {
    components: {
        'v-tree': defineAsyncComponent(() => import('./implements/tree/tree.vue')),
        'v-user-show': defineAsyncComponent(() => import('./implements/user-show/user-show.vue')),
        'v-paging': defineAsyncComponent(() => import('./implements/paging/paging.vue'))
    },
    props: ['type'],
    setup(props, {emit}) {
        if (process.env.NODE_ENV === 'development') {
            const {type} = getCurrentInstance();
            if (!type.components['v-' + props.type]) {
                warn(`无法找到 <async-component type="${props.type}"> 请检查类型`);
            }
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

