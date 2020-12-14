<template>
    <iframe :src="`/base/system/staff/manager.htm?usersid=${data.userId}`"
            frameborder="0" scrolling="no"
            style="width: 100%;height: 100%;"></iframe>
</template>

<script>
export default {
    props: ['data']
}
</script>
