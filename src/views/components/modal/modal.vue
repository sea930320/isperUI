<template>
    <div :class="wrapClasses">
        <transition name="fade">
            <div class="modal-mask" v-show="visible" @click="mask"></div>
        </transition>
        <transition name="ease">
            <div :class="modalClass" v-show="visible">
                <div class="modal-content">
                    <a class="modal-close" v-if="closable" @click="close"><i class="iconfont icon-close"></i></a>
                    <div class="modal-side-person" v-if="showPerson"></div>
                    <div class="modal-header" v-if="showHead" ref="head">
                        <slot name="header">
                            <div class="modal-header-inner">{{ title }}</div>
                        </slot>
                    </div>
                    <div class="modal-body scroll-bar">
                        <slot></slot>
                    </div>
                    <div class="modal-footer" v-if="!footerHide">
                        <slot name="footer">
                            <button class="btn btn-blue" @click="ok" v-if="!okHide" ref="okBtn">{{ okText }}</button>
                            <button class="btn btn-green" @click="cancel" v-if="!cancelHide">{{ cancelText }}</button>
                        </slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'ElModal',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            closable: {
                type: Boolean,
                default: true
            },
            maskClosable: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            width: {
                type: [Number, String],
                default: 520
            },
            size: {
                type: String,
                default: 'small'
            },
            color: {
                type: String,
                default: 'blue'
            },
            okText: {
                type: String,
                default: '确定'
            },
            cancelText: {
                type: String,
                default: '取消'
            },
            className: {
                type: String
            },
            // for instance
            footerHide: {
                type: Boolean,
                default: false
            },
            showPerson: {
                type: Boolean,
                default: false
            },
            cancelHide: {
                type: Boolean,
                default: false
            },
            okHide: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                wrapShow: false,
                showHead: true
            }
        },
        computed: {
            wrapClasses() {
                return [
                    'modal-wrap',
                    {
                        'modal-hidden': !this.wrapShow,
                        [`${this.className}`]: !!this.className
                    }
                ]
            },
            modalClass() {
                return [
                    'modal',
                    {
                        [`modal-${this.size}`]: !!this.size,
                        [`modal-${this.color}`]: !!this.color
                    }
                ]
            }
        },
        methods: {
            close() {
                this.wrapShow = false;
                this.$emit('on-cancel', this.wrapShow)
            },
            mask() {
                if (this.maskClosable) {
                    this.close()
                }
            },
            cancel() {
                this.close()
            },
            ok() {
                this.$emit('on-ok', this.wrapShow)
            },
            EscClose(e) {
                if (this.visible && this.closable) {
                    if (e.keyCode === 27) {
                        this.close()
                    }
                }
            }
        },
        ready() {
            if (this.visible) {
                this.wrapShow = true
            }

            let showHead = true;

            if (this.$refs.head.innerHTML === '<div class="modal-header-inner"></div>' && !this.title) {
                showHead = false
            }

            this.showHead = showHead;
            // ESC close
            document.addEventListener('keydown', this.EscClose)
        },
        beforeDestroy() {
            document.removeEventListener('keydown', this.EscClose)
        },
        watch: {
            visible(val) {
                if (val === false) {
                    setTimeout(() => {
                        this.wrapShow = false
                    }, 300)
                } else {
                    this.wrapShow = true
                }
            }
        }
    }
</script>
<style>
    .modal-wrap {
        overflow: auto;
        z-index: 1000;
        -webkit-overflow-scrolling: touch;
        outline: 0;
        transition: all 0.4s ease;
        text-align: left;
    }

    .modal-hidden {
        display: none !important;
    }

    .modal-wrap * {
        box-sizing: border-box;
    }

    .modal-mask, .modal-wrap {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }

    .modal-mask {
        height: 100%;
        background: #1a1f2c;
        opacity: 0.75;
        filter: alpha(opacity=75);
    }

    .modal {
        width: auto;
        margin: 0 auto;
        position: relative;
        outline: 0;
        display: block;
        height: fit-content;
        top: 100px;
        box-shadow: 0px 10px 60px 10px rgba(8, 11, 19, 0.55);
    }

    .modal-panel {
        width: 85%;
    }

    .modal-large {
        width: 785px;
    }

    .modal-small {
        width: 460px;
    }

    .modal-page {
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
    }

    .modal-content {
        position: relative;
        background-color: #fff;
        border: 0;
        background-clip: padding-box;
    }

    .modal-page .modal-content {
        height: 100%;
    }

    .modal-close {
        font-size: 22px;
        position: absolute;
        right: 16px;
        top: 12px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
        transition: all .4s ease;
        -webkit-transition: all .4s ease;
        -moz-transition: all .4s ease;
    }

    .modal-close:hover {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
    }

    .modal-side-person {
        position: absolute;
        z-index: 9999;
        top: 5px;
        left: -110px;
        width: 160px;
        height: 248px;
        background: url(./img/icon_modal_person.png) no-repeat center;
    }

    .modal-header {
        border-bottom: 1px solid #e3e8ee;
        padding: 12px 16px;
        line-height: 1;
    }

    .modal-blue .modal-header {
        background-color: #3a7de0;
        color: #fff;
    }

    .modal-gray .modal-header {
        background-color: #f4f4f4;
        color: #333;
    }

    .modal-gray .modal-close {
        color: #333;
    }

    .modal-header p, .modal-header-inner {
        display: inline-block;
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .modal-body {
        padding: 16px;
        font-size: 12px;
        line-height: 1.5;
        min-height: 100px;
        max-height: 480px;
        overflow: auto;
        word-break: break-all;
    }

    .modal-msg {
        padding: 10px 0;
    }

    .modal-msg p {
        line-height: 2;
        text-align: center;
    }

    .modal-body .message {
        font-size: 16px;
    }

    .modal-body .tip {
        font-size: 14px;
        color: #999;
    }

    .modal-wrap img {
        width: 100%;
        height: 100%;
    }

    .modal-footer {
        padding: 24px 18px;
        text-align: center;
    }

    .modal-footer .btn:first-child {
        margin-right: 92px;
    }

    .modal-footer .btn:last-child {
        margin-right: 0;
    }

    .text_in {
        text-align: center;
        font-size: 14px;
    }

    .module-figure-content {
        padding: 10px;
    }

    .module-figure-content > li {
        float: left;
        margin-left: 9px;
        margin-right: 10px;
    }

    .module-figure-content .module-avater {
        width: 80px;
        height: 80px;
        border: 1px solid #cdcdcd;
        overflow-x: hidden;
        display: block;
    }

    .module-figure-content .module-text {
        display: block;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
    }

    .task-title {
        text-align: center;
        color: #3a7de0;
        font-weight: 400;
        font-size: 16px;
    }

    .instant-modal {
        width: 654px;
        height: 292px;
        background: url(./img/bg4.png) center;
        margin: 60px auto 0;
    }

    .instant-body {
        width: 540px;
        margin-left: 114px;
        padding-top: 42px;
    }

    .instant-body .message {
        font-size: 20px;
    }

    .inp-new {
        display: block;
        margin: 0 auto;
        width: 300px;
        height: 40px;
        line-height: 40px;
        text-indent: 5px;
        border: 1px solid #a9b6c6;
        border-radius: 2px;
        outline: none;
        background-color: #fff;
    }
</style>
