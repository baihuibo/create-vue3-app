<template>
    <component :is="`v-` + type" ref="iRef"/>
</template>

<script>
import {defineAsyncComponent, ref, watch} from 'vue';

export default {
    components: {
        'v-user-show': defineAsyncComponent(() => import('./implements/user-show/user-show.vue')),
        'v-paging': defineAsyncComponent(() => import('./implements/paging/paging.vue'))
    },
    props: ['type'],
    emits: ['load'],
    setup(props, {emit}) {
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

