<template>
    <div>
        <p style="word-wrap: break-word;">{{ data.msg }}</p>
        <div class="dialog-footer">
            <button class="btn btn-primary" @click="$emit('close')">关闭</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data']
}
</script>
