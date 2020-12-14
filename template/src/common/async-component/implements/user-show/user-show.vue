<template>
    <a href="javascript:" @click="openModal(userId)">{{ userName }}</a>
</template>

<script>
import {modal} from "../../../modal/modal";

export default {
    props: ['userName', 'userId'],
    setup() {
        function openModal(userId) {
            modal.open(import('./user-show-modal.vue'), {
                data: {userId},
                noTitle: true,
                frame: true,
                width: '1000px',
                height: '500px'
            });
        }

        return {openModal}
    }
}
</script>
