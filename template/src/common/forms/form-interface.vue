<template>
    <div class="form-interface" layout="row">
        <slot name="label">
            <div class="form-label" :class="{required}">
                {{ label }}
            </div>
        </slot>
        <div class="form-container" flex>
            <div layout="row" layout-align="start center">
                <slot flex/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "form-interface",
    props: ['label', 'required']
}
</script>
