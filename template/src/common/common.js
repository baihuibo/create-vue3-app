import paging from './paging/paging.vue';
import formInterface from './forms/form-interface.vue';
import formItem from './forms/form-item.vue';
import userShow from './user-show/user-show.vue';
import permission from './permission/permission.directive';

export default function (Vue) {
    Vue.component('paging', paging);
    Vue.component('formInterface', formInterface);
    Vue.component('formItem', formItem);
    Vue.component('userShow', userShow);
    Vue.directive('permission', permission);
}
