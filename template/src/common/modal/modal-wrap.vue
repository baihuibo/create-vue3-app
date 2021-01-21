<template>
    <div class="modal fade" tabindex="-1" role="dialog"
         :class="{'in' : start,'disabled-select':canMove}"
         @mousemove="mousemove" @mouseup="mouseup">
        <div class="modal-dialog" :style="fullscreen ? null : {width,height}" :class="{fullscreen,frame,center}"
             ref="dragRef">
            <div class="modal-content" layout="column">
                <div class="modal-header" layout="row" layout-align="space-between center"
                     v-if="!noTitle"
                     @mousedown="mousedown">
                    {{ title }} &nbsp;
                    <a href="javascript:" @click="closeDialog()" @mousedown.stop class="modal-close">关闭</a>
                </div>
                <div class="dialog-body" flex>
                    <modal-body :data="data" @close="closeDialog($event)"></modal-body>
                </div>
                <a href="javascript:" @click="closeDialog()" class="no-title-close" v-if="noTitle">&times;</a>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {throttle} from "../../util";

export default {
    props: ['title', 'noTitle', 'width', 'height', 'fullscreen', 'data', 'frame', 'center'],
    setup({fullscreen, frame}, {emit}) {
        const start = ref(false);
        const dragRef = ref('');
        setTimeout(function () {
            start.value = true;
        }, 30);

        let isClose = false;
        const closeDialog = (data) => {
            if (isClose) {
                return;
            }
            start.value = false;
            isClose = true;
            setTimeout(function () {
                emit('close', data);
            }, 300);
        };


        let canMove = ref(false), current, matchX = 0, matchY = 0;
        const mousedown = (e) => {
            if (fullscreen || frame) {
                return;
            }
            canMove.value = true;
            current = e;
            const match = dragRef.value.style.transform.match(/-?\d+/g)
            if (match && match.length === 2) {
                matchX = parseFloat(match[0]);
                matchY = parseFloat(match[1]);
            }
        };
        const mouseup = (e) => {
            canMove.value = false;
        };
        const mousemove = throttle((e) => {
            if (current && canMove.value) {
                const x = e.pageX - current.pageX + matchX;
                const y = e.pageY - current.pageY + matchY;
                dragRef.value.style.transform = `translateX(${x}px) translateY(${y}px)`;
            }
        }, 50);

        return {start, canMove, dragRef, closeDialog, mousedown, mouseup, mousemove};
    }
}
</script>

<style scoped lang="less">
.disabled-select {
    user-select: none;

    .modal-dialog {
        will-change: transform, transition;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1992;
    background: rgba(0, 0, 0, .3);
    overflow-x: hidden;
    overflow-y: auto;

    .modal-dialog {
        margin: 50px auto 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, .5);

        // 全屏幕
        &.fullscreen {
            margin: 0;
            height: 100%;
        }

        &.frame .dialog-body {
            padding: 0 !important;
        }

        &.center {
            margin-top: calc(50vh - 75px);
        }

        .modal-content {
            height: 100%;

            .modal-header {
                background-color: #fff;
                padding: 15px 20px;
                border-bottom: 1px solid #DAE3EB;
                color: #3B4141;
                cursor: move;
                font-size: 16px;
                font-weight: bold;
                line-height: 16px;
                border-radius: 4px 4px 0 0;
            }

            .modal-close {
                text-decoration: none;
                color: #9DA0A0;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
                display: inline-block;
                position: relative;
                padding-left: 1em;

                &:hover {
                    color: #000;
                }

                &:before, &:after {
                    content: '';
                    position: absolute;
                    left: 2px;
                    top: 1px;
                    width: 2px;
                    height: 14px;
                    background: currentColor;
                }

                &:before {
                    transform: rotate(45deg);
                }

                &:after {
                    transform: rotate(-45deg);
                }
            }

            .no-title-close {
                position: absolute;
                right: -10px;
                top: -10px;
                text-decoration: none;
                font-size: 1.5em;
                color: #676767;
                background: #FFFFFF;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                line-height: 28px;
                text-align: center;

                &:hover {
                    color: #4074e1;
                }
            }

            .dialog-body {
                padding: 15px 20px;
                font-size: 12px;
                background-color: #fff;
                border-radius: 0 0 4px 4px;
            }

            ::v-deep(.dialog-footer) {
                padding: 12px 30px;
                margin: 15px -20px -15px;
                border-radius: 0 0 4px 4px;

                background: #F3F5F8;
                text-align: center;
            }
        }
    }

    // 默认隐藏弹出层
    &.fade {
        opacity: 0;
        transition: opacity .1s linear;

        .modal-dialog {
            transition: transform .15s ease;
            transform: translate(0, -25%);
        }
    }

    // 显示弹出层
    &.fade.in {
        opacity: 1;

        .modal-dialog {
            transform: translate(0, 0);
        }
    }
}
</style>
