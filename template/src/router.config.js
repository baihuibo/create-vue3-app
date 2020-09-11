import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory('/[basename]'),
    routes: [
        {
            path: '/',
            component: () => import ('./views/welcome.vue')
        }, {
            path: '/example',
            component: () => import ('./views/example/example.vue')
        }
    ]
});

export default router;
