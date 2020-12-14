import formInterface from './forms/form-interface.vue';
import formItem from './forms/form-item.vue';
import asyncComponent from './async-component/async-component.vue';
import permission from './permission/permission.directive';
import router from "../router.config.js";

export default function (Vue) {
    Vue.component('asyncComponent', asyncComponent);
    Vue.component('formInterface', formInterface);
    Vue.component('formItem', formItem);
    Vue.directive('permission', permission);
    Vue.use(router);
}
