<template>
    <div class="xml-modal-wrapper" v-show="visible">
        <div v-if="options.parttern == 1" class="overlay-close" @click="close">
            <i></i>
        </div>
        <div v-else class="overlay-box">
            <a
                href="javascript:;"
                v-if="userInfo.id === metaInfo.leader"
                class="edit-btn"
                @click="editMember"
            >编辑成员角色</a>
            <a href="javascript:;" class="quit-btn" @click="quit">退出业务</a>
        </div>
        <div class="xml-modal" id="js-drop-zone">
            <div class="csshub-btn">
                <p v-if="options.parttern == 1">查看流程图</p>
                <p v-if="options.parttern == 2">双击选择当前节点</p>
                <p class="xml-view-tip">（鼠标拖拽缩放试试）</p>
            </div>
            <div class="canvas" id="js-canvas" ref="canvas"></div>
        </div>
    </div>
</template>
<script>
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        xml: {
            type: String
        },
        options: {
            type: Object,
            default: () => {
                return {
                    parttern: 1,
                    currentTask: null
                };
            }
        },
        // 查看流程图模式  1：普通查看模式 2：结束并走向 选择
        parttern: {
            type: Number,
            default: 1
        },
        // parttern为2时，正确的任务Id
        taskId: {
            type: String
        },
        paths: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            wrapShow: false,
            viewer: null
        };
    },
    methods: {
        createXml(xml) {
            let self = this;
            self.$refs.canvas.innerHTML = "";
            self.viewer = new BpmnViewer({
                container: "#js-canvas"
            });
            self.viewer.importXML(xml, function(err) {
                if (err) {
                    self.$toasted.error("加载流程图失败");
                }
            });

            if (self.options.parttern === 2 && self.options.currentTask) {
                // 双击选中元素
                let eventBus = self.viewer.get("eventBus");
                eventBus.on("element.dblclick", function(e) {
                    if (self.userRoleAllocs.length == 0) {
                        self.$toasted.error("您不能参与该环节，请耐心等待！");
                        return;
                    }
                    if (e.element.id !== self.options.currentTask) {
                        self.$toasted.error("选择环节错误，请重新选择");
                    } else {
                        self.close();
                    }
                });
            }
        },
        // 关闭
        close() {
            this.wrapShow = false;
            this.$emit("on-close", this.wrapShow);
        },
        // 退出
        quit() {
            if (this.userInfo.identity === 4) {
                this.$router.push({ path: "/business/guide" });
            } else {
                this.$router.push({ path: "/business/list/progress" });
            }
        },
        // 编辑成员角色
        editMember() {
            this.$router.push({
                name: "editTask",
                params: { task_id: this.$route.params.eid }
            });
        }
    },
    mounted() {},
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        metaInfo() {
            return this.$store.state.meta.info;
        },
        currentRoleAllocation() {
            return this.$store.state.meta.currentRoleAllocation;
        },
        userRoleAllocs() {
            return this.$store.state.meta.info.user_role_allocs;
        }
    },
    watch: {
        visible(val) {
            if (val === false) {
                setTimeout(() => {
                    this.wrapShow = false;
                }, 300);
            } else {
                if (this.xml !== "") {
                    this.createXml(this.xml);
                    this.wrapShow = true;
                }
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.xml-modal-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
}
#js-canvas {
    width: 100%;
    height: 100%;
}
.xml-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    background: #e8f5fe;
    opacity: 1;
    backface-visibility: hidden;
    box-shadow: rgba(205, 189, 220, 0.28) 0 0 2px 2px;
    -webkit-transition: all 1200ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
    -moz-transition: all 1200ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
    -o-transition: all 1200ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
    transition: all 1200ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
}
.overlay-close {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: auto;
    left: auto;
    width: auto;
    height: auto;
    cursor: pointer;
    height: 3em;
    text-align: center;
    text-decoration: none;
    width: 3em;
    z-index: 10;
    color: #333;
}
.overlay-close i {
    background: url(./btn_close.png) 0 0 no-repeat;
    width: 36px;
    height: 36px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -18px 0 0 -18px;
}
.overlay-close i:hover {
    background: url(./btn_close.png) 0 -50px no-repeat;
}

.overlay-box {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: auto;
    left: auto;
    width: auto;
    height: auto;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    z-index: 10;
    color: #333;
}

.overlay-box .edit-btn {
    color: #3a7de0;
    display: inline-block;
    font-size: 16px;
    margin-right: 10px;
}

.overlay-box .quit-btn {
    color: #f3012c;
    font-size: 16px;
}
/*提示图钉*/
.csshub-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 190px;
    height: 124px;
    content: "";
    padding: 40px 0 0;
    border-top: 0 solid;
    border-right: 0 solid;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    -webkit-border-radius: 0 10px 200px / 0 200px 14px 250px;
    border-radius: 0 10px 200px / 0 200px 14px 250px;
    font: normal 18px/1.3 "Gochi Hand", Helvetica, sans-serif;
    color: rgba(255, 0, 106, 0.58);
    text-align: center;
    -o-text-overflow: clip;
    text-overflow: clip;
    background: -webkit-repeating-linear-gradient(
            -90deg,
            rgba(129, 203, 188, 0.5) 0,
            rgba(129, 203, 188, 0.5) 0.44%,
            rgba(0, 0, 0, 0) 0.44%,
            rgba(0, 0, 0, 0) 22%
        ),
        #fcf59b;
    background: -moz-repeating-linear-gradient(
            180deg,
            rgba(129, 203, 188, 0.5) 0,
            rgba(129, 203, 188, 0.5) 0.44%,
            rgba(0, 0, 0, 0) 0.44%,
            rgba(0, 0, 0, 0) 22%
        ),
        #fcf59b;
    background: repeating-linear-gradient(
            180deg,
            rgba(129, 203, 188, 0.5) 0,
            rgba(129, 203, 188, 0.5) 0.44%,
            rgba(0, 0, 0, 0) 0.44%,
            rgba(0, 0, 0, 0) 22%
        ),
        #fcf59b;
    background-position: 50% 50%;
    -webkit-background-origin: padding-box;
    background-origin: padding-box;
    -webkit-background-clip: border-box;
    background-clip: border-box;
    -webkit-background-size: auto auto;
    background-size: auto auto;
    -webkit-box-shadow: -3px 5px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: -3px 5px 12px 0 rgba(0, 0, 0, 0.1);
    -webkit-transform: rotateZ(-4deg);
    transform: rotateZ(-4deg);
}

.csshub-btn::after {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    width: 30px;
    height: 30px;
    position: absolute;
    content: "";
    top: 9px;
    right: 0;
    left: 122px;
    border: none;
    -webkit-border-radius: 30px;
    border-radius: 30px;
    font: normal medium/normal Arial, Helvetica, sans-serif;
    color: rgba(0, 0, 0, 0.9);
    -o-text-overflow: clip;
    text-overflow: clip;
    background: -webkit-radial-gradient(
            circle closest-side,
            rgba(25, 119, 196, 1) 0,
            rgba(25, 119, 196, 1) 4%,
            rgba(12, 113, 201, 1) 77%,
            rgba(255, 255, 255, 0) 89%,
            rgba(255, 255, 255, 0) 100%
        ),
        -webkit-radial-gradient(circle closest-side, rgba(0, 0, 0, 0.4) 0, rgba(
                        0,
                        0,
                        0,
                        0.2
                    )
                    81%, rgba(255, 255, 255, 0) 92%, rgba(255, 255, 255, 0) 100%),
        -webkit-radial-gradient(closest-side, rgba(64, 150, 238, 1) 0, rgba(
                        64,
                        150,
                        238,
                        1
                    )
                    100%),
        rgba(255, 255, 255, 0.9);
    background: -moz-radial-gradient(
            circle closest-side,
            rgba(25, 119, 196, 1) 0,
            rgba(25, 119, 196, 1) 4%,
            rgba(12, 113, 201, 1) 77%,
            rgba(255, 255, 255, 0) 89%,
            rgba(255, 255, 255, 0) 100%
        ),
        -moz-radial-gradient(circle closest-side, rgba(0, 0, 0, 0.4) 0, rgba(
                        0,
                        0,
                        0,
                        0.2
                    )
                    81%, rgba(255, 255, 255, 0) 92%, rgba(255, 255, 255, 0) 100%),
        -moz-radial-gradient(closest-side, rgba(64, 150, 238, 1) 0, rgba(
                        64,
                        150,
                        238,
                        1
                    )
                    100%),
        rgba(255, 255, 255, 0.9);
    background: radial-gradient(
            circle closest-side,
            rgba(25, 119, 196, 1) 0,
            rgba(25, 119, 196, 1) 4%,
            rgba(12, 113, 201, 1) 77%,
            rgba(255, 255, 255, 0) 89%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            circle closest-side,
            rgba(0, 0, 0, 0.4) 0,
            rgba(0, 0, 0, 0.2) 81%,
            rgba(255, 255, 255, 0) 92%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            closest-side,
            rgba(64, 150, 238, 1) 0,
            rgba(64, 150, 238, 1) 100%
        ),
        rgba(255, 255, 255, 0.9);
    background-repeat: no-repeat;
    background-position: 96% -4%, 71% 43%, 50% 50%;
    -webkit-background-origin: padding-box;
    background-origin: padding-box;
    -webkit-background-clip: border-box;
    background-clip: border-box;
    -webkit-background-size: 20px 20px, 20px 20px, auto auto;
    background-size: 20px 20px, 20px 20px, auto auto;
    -webkit-box-shadow: -4px 8px 5px 1px rgba(0, 0, 0, 0.2);
    box-shadow: -4px 8px 5px 1px rgba(0, 0, 0, 0.2);
    text-shadow: none;
}

/*动画*/
.hvr-curl-bottom-right {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px transparent;
    position: relative;
}
.hvr-curl-bottom-right:before {
    pointer-events: none;
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    bottom: 0;
    right: 0;
    background: white;
    /* IE9 */
    background: linear-gradient(
        315deg,
        white 45%,
        #aaa 50%,
        #ccc 56%,
        white 80%
    );
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.4);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: width, height;
    transition-property: width, height;
}
.hvr-curl-bottom-right:hover:before,
.hvr-curl-bottom-right:focus:before,
.hvr-curl-bottom-right:active:before {
    width: 25px;
    height: 25px;
}
</style>
