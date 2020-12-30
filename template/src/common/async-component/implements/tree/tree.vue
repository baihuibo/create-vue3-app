<template>
    <div class="tree-root">
        <template v-for="node in searchNodes || rootNodes" :key="node.id">
            <tree-node :node="node" :util="util" :level="0" :checkable="checkable">
                <template v-for="(_,name) in $slots" v-slot:[name]="slotBinds">
                    <slot :name="name" v-bind="slotBinds"/>
                </template>
            </tree-node>
        </template>
    </div>
</template>

<script>
import treeNode from './tree-node.vue';
import {onUpdated, ref, watchEffect} from "vue";
import {debounce} from "../../../../util";
import {getUuid} from "../../../forms/util";

export default {
    components: {treeNode},
    props: {
        selectedMulti: Boolean, // 是否支持选中多个节点
        nodes: Array, // 数据
        rootId: [Number, String], // 根节点id
        idKey: String, // id
        pidKey: String, // pid
        loadData: Function, // 异步加载数据
        searchText: String, // 搜索过滤
        beforeCheck: Function,
        beforeSelect: Function,
        checkable: Boolean, // 是否显示多选框，默认不显示
        expandedLevel: Number, // 初始化时展开几级节点，默认0，若设置-1则全部展开
        simpleData: Boolean // 是否为 id、pid 的简单数据
    },
    setup(props, {emit}) {
        const util = {
            toggleExpanded(node) {
                node.expanded = !node.expanded;
                emit('expand', node);
                if (!hasChildren(node)) {
                    util.loadData(node);
                }
            },
            async loadData(node) { // 在展开时，进行异步加载节点
                if (node.expanded && node.isParent && typeof props.loadData === 'function') {
                    node.children = await props.loadData(node);
                }
            },
            toggleChecked(node, checked) {
                if (!node.disabled) {
                    if (typeof props.beforeCheck === 'function') {
                        if (props.beforeCheck(node) === false) {
                            return;
                        }
                    }
                    setChildrenCheckedByDeep(node, checked);
                    setParentCheckedByDeep(node);
                    emit('check', node);
                }
            },
            toggleSelect(node) { // 选中状态切换
                if (typeof props.beforeSelect === 'function') {
                    if (props.beforeSelect(node) === false) {
                        return;
                    }
                }
                node.selected = !node.selected;

                if (!props.selectedMulti) {
                    if (selected.value) {
                        selected.value.selected = false;
                    }
                    selected.value = node.selected ? node : void 0;
                }

                emit('select', selected);
            }
        };

        const selected = ref();
        const rootNodes = ref([]);
        const searchNodes = ref();

        // 数据初始化
        let cacheNodes;
        watchEffect(() => {
            if (cacheNodes === props.nodes) {
                return;
            }
            if (!props.nodes) {
                return;
            }
            cacheNodes = props.nodes; // 缓存nodes
            if (Array.isArray(props.nodes) && props.nodes.length) {
                if (props.simpleData) {
                    rootNodes.value = simpleDataConvert(cacheNodes, {
                        parentId: props.rootId,
                        idKey: props.idKey || 'id',
                        pidKey: props.pidKey || 'pid',
                    });
                } else {
                    rootNodes.value = cacheNodes;
                }
            } else {
                rootNodes.value = [];
            }

            setParentNodeAndIds(rootNodes.value);

            if (props.expandedLevel) {
                // 自动展开节点
                expandedLevelByNodes(rootNodes.value, parseInt(props.expandedLevel), util);
            }

            autoOpenCheckedNode(rootNodes.value);
        });

        // 搜索器
        let preSearchText = '';
        onUpdated(debounce(() => {
            const {searchText} = props
            if (searchText) {
                if (searchText !== preSearchText) {
                    preSearchText = searchText;

                    // 搜索节点
                    searchNodes.value = getNodesBySearchText(rootNodes.value, 'name', searchText);
                }
            } else if (preSearchText) {// 清除搜索痕迹
                preSearchText = '';
                eachNodes(searchNodes.value, node => delete node.search)
                searchNodes.value = null;
            }
        }, 300));

        // 获取全部选中的节点
        const getAllSelectedNodes = function (all) {
            return getNodeByState(rootNodes.value, 'selected', true, all);
        };
        // 获取全部选中的节点
        const getAllCheckedNodes = function (all) {
            return getNodeByState(rootNodes.value, 'checked', true, all);
        }

        return {
            util, selected, rootNodes, searchNodes,
            getAllSelectedNodes, getAllCheckedNodes
        }
    }
}

// 根据属性值获取节点列表，如查询所有选中节点
function getNodeByState(nodes, key, value, hasEach) {
    let results = [];
    if (hasEach) {
        eachNodes(nodes, node => {
            if (node[key] === value) {
                results.push(node);
            }
        });
    } else {
        for (const node of nodes) {
            if (node[key] === value) {
                results.push(node);
            } else if (hasChildren(node)) {
                results = results.concat(getNodeByState(node.children, key, value));
            }
        }
    }
    return results;
}

// 模糊搜索节点
function getNodesBySearchText(nodes, key, searchText) {
    if (!nodes || !searchText) return [];

    const searchTextLower = searchText.toLowerCase();
    let result = [];

    for (const node of nodes) {
        const value = node[key];
        if (value) {
            const findIndex = value.toLowerCase().indexOf(searchTextLower);
            if (findIndex > -1) {
                node.search = {
                    beforeStr: value.slice(0, findIndex),
                    after: value.slice(findIndex + searchText.length),
                    searchText
                };
                result.push(node);
            }
        }
        if (hasChildren(node)) {
            result = result.concat(getNodesBySearchText(node.children, key, searchText));
        }
    }
    return result;
}

// 自动展开选中的节点
function autoOpenCheckedNode(nodes) {
    eachNodes(nodes, node => {
        node.checked && setParentExpandByDeep(node, true);
    })
}

// 设置级联关系
function setParentNodeAndIds(nodes) {
    eachNodes(nodes, (node, parentNode) => {
        if (parentNode) {
            node.parentNode = parentNode;
        }
        if (!node.id) {
            node.id = getUuid();
        }
    })
}

// 递归展开对应级数的节点，level为-1时，将展开所有节点
function expandedLevelByNodes(nodes, level, util) {
    if (level) {
        for (const node of nodes) {
            if (hasChildren(node)) {
                node.expanded = true;
                expandedLevelByNodes(node.children, level - 1);
            } else if (node.isParent) {
                node.expanded = true;
                util.loadData(node);
            }
        }
    }
}

function simpleDataConvert(list, option) {
    const {parentId, idKey, pidKey} = option;

    const nodes = list.filter(item => item[pidKey] === parentId);
    const id = 'id';

    if (nodes.length) {
        for (const child of nodes) {
            option.parentId = child[idKey];
            const children = simpleDataConvert(list, option);
            if (children) {
                child.children = children;
            }
            if (idKey !== id) {
                child[id] = child[idKey];
            }
        }
        return nodes;
    }
}

// 递归设置孩子的选中状态
function setChildrenCheckedByDeep(node, checked) {
    if (!node.disabled) {
        node.checked = checked;
    }

    if (hasChildren(node)) { // 影响所有孩子
        for (const child of node.children) {
            setChildrenCheckedByDeep(child, checked)
        }
    }
}

// 递归设置父元素展开状态
function setParentExpandByDeep(node, expand) {
    const {parentNode} = node;
    if (parentNode) {
        parentNode.expanded = expand;
        setParentExpandByDeep(parentNode);
    }
}

// 递归设置父元素选中状态
function setParentCheckedByDeep(node) {
    const {parentNode} = node;
    if (parentNode) {
        if (!parentNode.disabled) {
            parentNode.checked = hasChildrenChecked(parentNode.children || []);
        }
        setParentCheckedByDeep(parentNode);
    }
}

// 是否所有的孩子都被选中了（跳过禁用）
function hasChildrenChecked(nodes) {
    return nodes.every(node => {
        if (node.disabled) {
            if (hasChildren(node)) {
                return hasChildrenChecked(node.children);
            }
            return true;
        }
        if (node.checkable === false) {// 没有选择器时，视为已选中
            return true;
        }
        return node.checked;
    })
}

// 递归节点
function eachNodes(nodes, cb, parent) {
    for (const node of nodes) {
        cb(node, parent);
        if (hasChildren(node)) {
            eachNodes(node.children, cb, node);
        }
    }
}

function hasChildren(node) {
    return Array.isArray(node.children) && node.children.length;
}
</script>
<style scoped lang="less">
:deep(ul), ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        padding-left: 18px;
    }
}

.tree-root > li {
    padding-left: 5px;
}
</style>
