<template>
    <div layout="row" layout-align="end center" v-if="totalPage" class="paging">
        <div>共 {{ total }} 条</div>
        <div>
            每页
            <select v-model="pageSize" @change="selectRefresh($event.target.value)">
                <option v-for="num in pageNums" :value="num">{{ num }}</option>
            </select>
            条
        </div>

        <a class="paging-item"
           :class="{disabled:currentPage === 1}"
           @click="goPage(currentPage - 1)"> &lt;
        </a>

        <template v-for="item in pageItemsRef">
            <a href="javascript:" class="paging-item"
               :class="{active : item.pageIndex === currentPage}"
               @click="goPage(item.pageIndex)"
               v-if="item.pageIndex">{{ item.pageIndex }}</a>
            <span v-else>{{ item.text }}</span>
        </template>

        <a class="paging-item"
           :class="{disabled:currentPage === totalPage}"
           @click="goPage(currentPage + 1)"> &gt;
        </a>

        <div>
            前往
            <input type="text" v-model="goPageRef" @input="formatPageFn(goPageRef)" @keyup.enter="goPage(goPageRef)">
            页
            <a href="javascript:" v-if="goPageRef" @click="goPage(goPageRef)">确定</a>
        </div>
    </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import {clone, get, post} from "../../../../util";
import {modal} from "../../../modal/modal";

export default {
    props: {
        url: String,
        method: String,
        pageSize: {type: Number, default: 15},
        getData: Function,
        beforeSend: Function,
        initParams: Object,
        initQueryDone: Function,
        pageNums: {type: Array, default: [15, 30, 50, 100]},
        responseHandler: Function
    },
    setup(props) {
        const list = ref();
        const total = ref(0);
        const totalPage = ref(0);
        const pageSize = ref(props.pageSize);
        const currentPage = ref(1);
        const orderNum = ref(0);
        const goPageRef = ref('');
        const pageItemsRef = ref([]);
        const cacheParamsRef = ref(); // 上一次查询参数缓存

        if (props.initParams && typeof props.initParams === 'object') {
            onMounted(async () => {
                await query(props.initParams);
                if (typeof props.initQueryDone === 'function') {
                    props.initQueryDone();
                }
            });
        }

        /**
         * 查询数据
         * @param params 参数
         * @param pageIndex 页数，默认1
         * @return {Promise<Object>}
         */
        async function query(params, pageIndex = 1) {
            params = clone(params || {});// clone
            params = cleanEmpty(params);
            let getData;
            if (props.url) {
                const ajax = props.method === 'get' ? get : post;
                getData = (data) => ajax(props.url, data);
            } else if (typeof props.getData === 'function') {
                getData = props.getData;
            }
            pageIndex = Math.abs(pageIndex);
            params.pageSize = Math.abs(pageSize.value);
            params.currPage = pageIndex;

            if (typeof props.beforeSend === 'function') {
                params = props.beforeSend(params) || params;
            }

            modal.showLoading();
            let result = await Promise.resolve(getData(params));
            modal.hideLoading();

            if (typeof props.responseHandler === 'function') {
                result = props.responseHandler(result) || result;
            }

            if (+result.code === 0) {
                cacheParamsRef.value = params; // 缓存参数
                goPageRef.value = '';
                const data = result.data;

                // 设置组件数据
                list.value = data.rows;
                totalPage.value = Math.abs(data.totalPage);
                total.value = Math.abs(data.total);
                currentPage.value = pageIndex;
                orderNum.value = params.pageSize * (pageIndex - 1);
                pageItemsRef.value = createItems(totalPage.value, pageIndex);
            } else {
                await modal.alert(result.msg);
            }

            queryListen.forEach((listen, index) => {
                if (typeof listen.fn === 'function') {
                    listen.fn();
                }
                if (listen.once) {
                    queryListen.splice(index, 1);
                }
            })

            return result;
        }

        function cleanEmpty(params) {
            const data = {};
            Object.keys(params).forEach(key => {
                if (params[key] !== '' && params[key] != null) {
                    data[key] = params[key];
                }
            })
            return data;
        }

        /**
         * 刷新当前页面
         * @param reload 是否从第1页开始
         * @return {Promise<Object>}
         */
        function refresh(reload) {
            return query(cacheParamsRef.value, reload ? 1 : currentPage.value);
        }

        // 还原状态
        function rollback() {
            list.value = null;
            total.value = 0;
            totalPage.value = 0;
            pageSize.value = props.pageSize;
            currentPage.value = 1;
            orderNum.value = 0;
        }

        /**
         * 前往第几页
         * @param pageIndex
         * @private
         */
        function goPage(pageIndex) {
            if (/^\d+$/.test(pageIndex)) {
                if (pageIndex < 1) {
                    pageIndex = 1;
                }
                if (pageIndex > totalPage.value) {
                    pageIndex = totalPage.value;
                }
                if (+pageIndex === currentPage.value) {
                    return;
                }

                goPageRef.value = null;
                query(cacheParamsRef.value, pageIndex);
            }
        }

        /**
         * 下拉框切换查询条数
         * @param size
         * @private
         */
        function selectRefresh(size) {
            pageSize.value = size;
            if (total.value > size || totalPage.value > 1) { // 优化，如果没有需要根据size分页的数据，则不进行查询
                query(cacheParamsRef.value);
            }
        }

        const queryListen = [];
        const addQueryListen = (fn, once = false) => {
            queryListen.push({fn, once});
        }

        const formatPageFn = (goPage) => {
            goPageRef.value = Math.floor(parseInt(goPage)) || null;
        }

        return {
            props, cacheParamsRef, formatPageFn,
            rollback, refresh, query, goPage, selectRefresh,
            list, total, totalPage, pageSize, currentPage, orderNum,
            goPageRef, pageItemsRef, addQueryListen
        }
    }
}

function createItems(totalLength, current, tap = 4) {
    if (!totalLength) {
        return [];
    }
    const items = [{pageIndex: 1}];
    if (totalLength === 1) {
        return items;
    }

    let start, end;
    if (totalLength <= (tap * 2 + 1)) {
        start = 1;
        end = totalLength - 1;
    } else {
        start = current - tap - 1;
        end = current + tap;

        if (start < 1) {
            end += 1 - start;
            start = 1;
        }
        if (end >= totalLength) {
            start -= end - totalLength + 1;
            end = totalLength - 1;
        }
        start = Math.max(1, start);
        end = Math.min(end, totalLength - 1);
    }

    if (start > 1) {
        items.push({text: '...'});
    }

    for (; start < end; start++) {
        items.push({pageIndex: start + 1});
    }

    if (totalLength - end > 1) {
        items.push({text: '...'});
    }

    items.push({pageIndex: totalLength})

    return items;
}
</script>

<style scoped lang="less">
.paging {
    color: rgb(100, 100, 100);
    margin-top: 20px;

    > div {
        padding: 0 10px;
    }

    input {
        width: 50px;
        text-align: center;
    }

    .paging-item {
        color: rgb(100, 100, 100);
        display: inline-block;
        padding: 0 10px;
        cursor: pointer;
        font-size: 14px;

        &.active {
            color: #0000ee;
        }
    }
}

input, select {
    outline: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 20px;
    line-height: 20px;
    padding: 0;
}
</style>
