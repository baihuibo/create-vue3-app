<template>
    <div class="form-interface" layout="row">
        <slot name="label">
            <div class="form-label" :class="{required}">
                {{ label }}
            </div>
        </slot>
        <div class="form-container" flex layout="row" layout-align="start center">
            <slot flex/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        required: Boolean
    }
}
</script>
