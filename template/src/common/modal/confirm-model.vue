<template>
    <div>
        <p style="word-wrap: break-word;">{{ data.msg }}</p>

        <div class="dialog-footer">
            <button class="btn btn-primary mr-10" @click="$emit('close', true)">确认</button>
            <button class="btn" @click="$emit('close')">取消</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data']
}
</script>
