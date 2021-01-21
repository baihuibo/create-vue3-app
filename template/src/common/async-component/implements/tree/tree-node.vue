<template>
    <div class="tree-leaf" layout="row" layout-align="start center"
         :class="{selected:node.selected}" @click="util.toggleSelect(node)">
        <span class="tree-indent" :style="{width:(level * 24) + 'px'}"></span>

        <span v-if="hasChildren" @click.stop="util.toggleExpanded(node)"
              class="tree-icon tree-icon-toggle" :class="{open:node.expanded}"></span>
        <span v-else class="tree-icon"></span>

        <slot name="icon" v-if="$slots.icon" v-bind="$props"/>

        <span v-if="checkable && node.checkable !== false"
              @click.stop="util.toggleChecked(node, !node.checked)"
              class="tree-icon tree-icon-checkbox"
              :class="{
                  checked:node.checked,
                  disabled:node.disabled,
                  indeterminate:node.indeterminate
              }"></span>

        <div flex class="tree-leaf-content">
            <slot v-if="$slots.default" v-bind="$props"/>
            <template v-else-if="node.search">
                {{ node.search.beforeStr }}<em>{{ node.search.searchText }}</em>{{ node.search.after }}
            </template>
            <template v-else>{{ node.name }}</template>
        </div>
    </div>

    <template v-if="hasChildren && node.expanded">
        <template v-for="child in node.children" :key="child.id">
            <self-tree-node :node="child" :util="util" :level="level + 1" :checkable="checkable">
                <template v-for="(_,name) in $slots" v-slot:[name]="slotBinds">
                    <slot :name="name" v-bind="slotBinds"/>
                </template>
            </self-tree-node>
        </template>
    </template>
</template>

<script>
import {computed} from 'vue';

export default {
    name: 'self-tree-node',
    props: {
        node: Object,
        util: Object,
        level: Number,
        checkable: Boolean
    },
    setup({node}) {
        const hasChildren = computed(() => {
            return node.isParent || (Array.isArray(node.children) && node.children.length)
        })
        return {hasChildren};
    }
}
</script>
<style scoped lang="less">
.tree-leaf {
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    line-height: 14px;
    margin: 2px 0;
    padding: 0 5px;

    &:hover {
        background: #ebf4ff;
    }

    em {
        font-style: normal;
        font-weight: 500;
        color: #f50;
    }

    &.selected {
        background: #cbe9ff;
    }

    .tree-leaf-content {
        padding: 5px 0;
    }

    > * {
        flex-shrink: 0;
    }
}

.tree-icon {
    display: block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 2px;
    flex-shrink: 0;
}

.tree-icon-checkbox {
    position: relative;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-collapse: separate;

    transition: all .3s;

    &::after {
        position: absolute;
        top: 50%;
        left: 20%;
        width: 4px;
        height: 8px;
        border: 2px solid #fff;
        border-collapse: separate;
        border-top: 0;
        border-left: 0;
        transform: rotate(45deg) scale(0) translate(-50%, -50%);
        opacity: 0;
        transition: all .05s cubic-bezier(.71, -.46, .88, .6), opacity .05s;
        content: " ";
    }

    &.indeterminate {
        background-color: #fff;
        border-color: #d9d9d9;

        &::after {
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background-color: #1890ff;
            border: 0;
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    &.checked {
        background-color: #1890ff;
        border-color: #1890ff;

        &::after {
            transform: rotate(45deg) scale(1) translate(-50%, -50%);
            opacity: 1;
            transition: all .15s cubic-bezier(.12, .4, .29, 1.46) .05s;
        }
    }

    &.disabled {
        background-color: #f5f5f5;
        border-color: #d9d9d9;

        &::after {
            border-color: rgba(0, 0, 0, .25);
        }
    }
}

.tree-icon-toggle {
    background-color: #7382a4;
    position: relative;

    @size: 2px;
    @position: 7px;
    @margin: 4px;

    &::after, &::before {
        position: absolute;
        content: '';
        background: #fff;
        transition: all ease .15s;
    }

    &::after {
        height: @size;
        left: @margin;
        right: @margin;
        top: @position;
    }

    &::before {
        width: @size;
        top: @margin;
        bottom: @margin;
        left: @position;
    }

    &.open {
        &::before {
            top: 50%;
            bottom: 50%;
        }
    }
}
</style>

