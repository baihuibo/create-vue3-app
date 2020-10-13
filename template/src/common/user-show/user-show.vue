<template>
    <a href="javascript:" @click="openModal(userId)">{{ userName }}</a>
</template>

<script setup>
import {modal} from "../modal/modal";

export function openModal(userId) {
    modal.open(import('./user-show-modal.vue'), {
        data: {userId},
        noTitle: true,
        frame: true,
        width: '1000px',
        height: '500px'
    });
}

export default {
    props: ['userName', 'userId']
}
</script>
