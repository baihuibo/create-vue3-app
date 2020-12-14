<template>
    <component :is="'v-' + type" flex/>
</template>

<script>
import {defineAsyncComponent} from "vue";

export default {
    name: "form-item",
    props: ['type'],
    components: {
        'v-text': defineAsyncComponent(() => import("./implements/text/text.vue")),
        'v-select': defineAsyncComponent(() => import("./implements/select/select.vue")),
        'v-checkbox': defineAsyncComponent(() => import("./implements/checkbox/checkbox.vue")),
        'v-radio': defineAsyncComponent(() => import("./implements/radio/radio.vue")),
        'v-date': defineAsyncComponent(() => import("./implements/date/date.vue")),
        'v-date-range': defineAsyncComponent(() => import("./implements/date-range/date-range.vue")),
        'v-live-search': defineAsyncComponent(() => import("./implements/live-search/live-search.vue")),
        'v-number': defineAsyncComponent(() => import("./implements/number/number.vue")),
    }
};
</script>
