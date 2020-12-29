<template>
    <div class="box">
        <h3>表单查询样例</h3>
        <form @submit.prevent="doQuery(dataRef)" ref="form">
            <div class="form-box" layout="row" layout-wrap>
                <form-interface label="text：" flex="33">
                    <form-item type="text" v-model="dataRef.text" @change="change"
                               :validate-rule="{required:true , maxLength:13}"/>
                </form-interface>
                <form-interface label="number：" flex="33">
                    <form-item type="number" v-model="dataRef.number" @change="change"
                               :validate-rule="{required:true, max:9999.99}"/>
                </form-interface>
                <form-interface label="select：" flex="33">
                    <form-item type="select" v-model="dataRef.select" key-code="aaa" @change="change"
                               no-search :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="select lazeload：" flex="33">
                    <form-item type="select" v-model="dataRef.select2" key-code="aaa" lazeload @change="change"
                               :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="checkbox：" flex="33">
                    <form-item type="checkbox" v-model="dataRef.checkbox" key-code="323232" @change="change"
                               :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="radio：" flex="33">
                    <form-item type="radio" v-model="dataRef.radio" key-code="323232" @change="change"
                               :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="date：" flex="33">
                    <form-item type="date" v-model="dataRef.date" @change="change"
                               :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="date-range：" flex="33">
                    <form-item type="date-range" v-model:start="dataRef.start" v-model:end="dataRef.end"
                               @change="change" :validate-rule="{required:true}"/>
                </form-interface>
                <form-interface label="live-search：" flex="33">
                    <form-item type="live-search" @change="change" search-content="searchContent"
                               :response-handler="responseHandler" :before-send="beforeSend"
                               :page-size="dataRef.pageSize"
                               url="/bdc/search/buildNames.htm" :validate-rule="{required:true}"
                               v-model:id="dataRef.id"
                               v-model:name="dataRef.name"/>
                </form-interface>
            </div>
            <div layout="row" layout-align="center center" class="mt-20">
                <button class="btn btn-primary" type="submit"> 查询试试</button>
                <button class="btn ml-10" type="reset"> 重置</button>
                <button class="btn ml-10" @click="changeParam" type="button"> 变更参数</button>
            </div>
        </form>
        <pre>{{ dataRef }}</pre>
    </div>
    <div class="box mt-20">
        <h2 class="chapter-header">表格展示</h2>
        <table class="table mt-20">
            <thead>
            <tr>
                <th class="text-left">buildName</th>
                <th>buildingArea</th>
                <th>createBy</th>
                <th>createByName</th>
                <th>createTime</th>
                <th>isRelation</th>
                <th>layoutName</th>
                <th>layoutPhoto</th>
                <th>layoutPhotoMin</th>
                <th>layoutStr</th>
                <th>state</th>
                <th>stateStr</th>
                <th class="text-center">towards</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in pagingRef.list" :key="item.layoutId">
                <td>{{ item.buildName }}</td>
                <td>{{ item.buildingArea }}</td>
                <td>{{ item.createBy }}</td>
                <td>{{ item.createByName }}</td>
                <td>{{ item.createTime }}</td>
                <td>{{ item.isRelation }}</td>
                <td>{{ item.layoutName }}</td>
                <td>{{ item.layoutPhoto }}</td>
                <td>{{ item.layoutPhotoMin }}</td>
                <td>{{ item.layoutStr }}</td>
                <td>{{ item.state }}</td>
                <td>{{ item.stateStr }}</td>
                <td><span class="attention">{{ item.towards }}</span><span class="vertical-line"></span><span
                    class="attention">{{ item.towards }}</span></td>
            </tr>
            <tr v-if="pagingRef.list && !pagingRef.list.length">
                <td colspan="13">未查询到结果</td>
            </tr>
            </tbody>
        </table>
        <async-component type="paging"
                         url="/bdc/layout/queryList.htm"
                         @load="pagingRef = $event"/>
    </div>
</template>

<script>
import {reactive, ref} from "vue";
import {singleThreadWrapFn} from "../../util";

export default {
    setup() {
        const form = ref({});
        const pagingRef = ref({});
        const dataRef = reactive({
            text: "111",
            select: "3",
            select2: "",
            number: 123.12,
            "date": "",
            "start": "2020-07-18",
            "end": "",
            checkbox: ['1'],
            radio: "1",
            id: "3232",
            name: "小白",
            pageSize: 20
        });
        const list = [
            {"valueCode": 1, "valueName": "第一行"},
            {"valueCode": 2, "valueName": "第二行"},
            {"valueCode": 3, "valueName": "第三行"},
            {"valueCode": 4, "valueName": "第四行"},
        ]

        function change() {

        }

        // 触发查询
        const doQuery = singleThreadWrapFn(async (data) => {
            await pagingRef.value.query(data);
        });

        function changeParam() {
            dataRef.text = "已经发生改变";
            dataRef.number = 2;
            dataRef.checkbox = ["1", "4"];
            dataRef.select = "1";
            dataRef.radio = "1";
            dataRef.date = "2020-3-4";
            dataRef.start = "2020-5-6";
            dataRef.end = "2020-6-7";
            dataRef.id = "3232";
            dataRef.name = "白慧波";
        }

        function responseHandler() {

        }

        function beforeSend(param) {
            return param; //将改变后的请求参数return  --注意:格式不能发生变化
        }

        return {
            list, dataRef, pagingRef, form,
            change, doQuery,
            changeParam,
            responseHandler,
            beforeSend
        }
    }
}
</script>

<style scoped lang="less">
.form-item {
    padding: 10px 15px;

    label {
        display: block;
        width: 100px;
        text-align: right;
    }

    .split {
        padding: 0 5px;
    }
}
</style>
