<template>
    <div layout="row" layout-align="end center" v-if="totalPage" class="paging">
        <div>共 {{ total }} 条</div>
        <div>
            每页
            <select v-model="pageSize" @change="_selectRefresh($event.target.value)">
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            条
        </div>

        <a class="paging-item"
           :class="{disabled:currentPage === 1}"
           @click="_goPage(currentPage - 1)"> &lt;
        </a>

        <template v-for="item in _pageItemsRef">
            <a href="javascript:" class="paging-item"
               :class="{active : item.pageIndex === currentPage}"
               @click="_goPage(item.pageIndex)"
               v-if="item.pageIndex">{{ item.pageIndex }}</a>
            <span v-else>{{ item.text }}</span>
        </template>

        <a class="paging-item"
           :class="{disabled:currentPage === totalPage}"
           @click="_goPage(currentPage + 1)"> &gt;
        </a>

        <div>
            前往
            <input type="text" v-model="_goPageRef" @keyup.enter="_goPage(_goPageRef)">
            页
            <a href="javascript:" v-if="_goPageRef" @click="_goPage(_goPageRef)">确定</a>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {get, post} from "../../util";
import {modal} from "../modal/modal";

export default {
    name: "paging",
    props: {
        url: String,
        method: String,
        pageSize: Number,
        getData: Function,
        beforeSend: Function,
        responseHandler: Function
    },
    setup(props) {
        const list = ref();
        const total = ref(0);
        const totalPage = ref(0);
        const pageSize = ref(props.pageSize || 15);
        const currentPage = ref(1);
        const orderNum = ref(0);
        const _goPageRef = ref('');
        const _pageItemsRef = ref([]);

        // 上一次查询参数缓存
        let _cacheParams;

        /**
         * 查询数据
         * @param params 参数
         * @param pageIndex 页数，默认1
         * @return {Promise<Object>}
         */
        async function query(params, pageIndex = 1) {
            params = JSON.parse(JSON.stringify(params || {}));// clone
            params = _cleanEmpty(params);
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
                _cacheParams = params; // 缓存参数
                _goPageRef.value = '';
                const data = result.data;

                // 设置组件数据
                list.value = data.rows;
                totalPage.value = Math.abs(data.totalPage);
                total.value = Math.abs(data.total);
                currentPage.value = pageIndex;
                orderNum.value = params.pageSize * (pageIndex - 1);
                _pageItemsRef.value = createItems(totalPage.value, pageIndex);
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

        function _cleanEmpty(params) {
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
            return query(_cacheParams, reload ? 1 : currentPage.value);
        }

        // 还原状态
        function rollback() {
            list.value = null;
            total.value = 0;
            totalPage.value = 0;
            pageSize.value = props.pageSize || 15;
            currentPage.value = 1;
            orderNum.value = 0;
        }

        /**
         * 前往第几页
         * @param pageIndex
         * @private
         */
        function _goPage(pageIndex) {
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

                _goPageRef.value = null;
                query(_cacheParams, pageIndex);
            }
        }

        /**
         * 下拉框切换查询条数
         * @param size
         * @private
         */
        function _selectRefresh(size) {
            pageSize.value = size;
            if (total.value > size || totalPage.value > 1) { // 优化，如果没有需要根据size分页的数据，则不进行查询
                query(_cacheParams);
            }
        }

        const queryListen = [];
        const addQueryListen = (fn, once = false) => {
            queryListen.push({fn, once});
        }

        return {
            props,
            rollback, refresh, query, _goPage, _selectRefresh,
            list, total, totalPage, pageSize, currentPage, orderNum,
            _goPageRef, _pageItemsRef, addQueryListen
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
