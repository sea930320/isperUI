<template>
    <div class="progress-menu main-bg" style="height: 100%; overflow: auto">
        <TopHeader>
            <template v-slot:pageMenu>
                <b-nav-item>
                    <dropdown>
                        <template slot="btn">ISPER助手</template>
                        <template slot="icon">
                            &nbsp;
                            <icon name="caret-down"></icon>
                        </template>
                        <template slot="body">
                            <ul>
                                <li>
                                    <span
                                        v-if="unReadMsgCount != 0"
                                        class="tipCount"
                                    >({{unReadMsgCount}})</span>
                                    <a href="javascript:;">环节提示</a>
                                </li>
                                <li>
                                    <dropdown :trigger="'click'" :role="'sublist'" :align="'right'">
                                        <template slot="btn">
                                            指导交流
                                            <span
                                                v-if="unReadMsgCount != 0"
                                                class="tipCount"
                                            >({{unReadMsgCount}})</span>
                                        </template>
                                        <template slot="body">
                                            <ul>
                                                <li>
                                                    <a href="javascript:;" @click="sendMsg">发送留言</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" @click="receiveMsgList">
                                                        留言面板
                                                        <span
                                                            v-if="unReadMsgCount != 0"
                                                            class="tipCount"
                                                        >({{unReadMsgCount}})</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </template>
                                    </dropdown>
                                </li>
                            </ul>
                        </template>
                    </dropdown>
                </b-nav-item>
                <b-nav-item>
                    <dropdown>
                        <template slot="btn">查看</template>
                        <template slot="icon">
                            &nbsp;
                            <icon name="caret-down"></icon>
                        </template>
                        <template slot="body">
                            <ul>
                                <li>
                                    <a href="javascript:;" @click="viewBusinessResult">实验成果</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="viewSubmittedFile">已提交文件</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="showModal = 3">成果参考</a>
                                </li>
                                <li>
                                    <a
                                        href="javascript:;"
                                        v-if="userInfo.identity == 5"
                                        @click="showModal = 4"
                                    >我的笔记</a>
                                </li>
                            </ul>
                        </template>
                    </dropdown>
                </b-nav-item>
                <b-nav-item>
                    <dropdown>
                        <template slot="btn">工具</template>
                        <template slot="icon">
                            &nbsp;
                            <icon name="caret-down"></icon>
                        </template>
                        <template slot="body">
                            <ul>
                                <li>
                                    <a
                                        href="javascript:;"
                                        :class="{'disabled': !metaInfo.can_switch}"
                                        @click="switchView"
                                    >切换视角</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="showFlowChart">查看流程图</a>
                                </li>
                            </ul>
                        </template>
                    </dropdown>
                </b-nav-item>
                <b-nav-item v-if="userInfo && userInfo.id && userInfo.id == metaInfo.leader">
                    <dropdown>
                        <template slot="btn">操作</template>
                        <template slot="icon">
                            &nbsp;
                            <icon name="caret-down"></icon>
                        </template>
                        <template slot="body">
                            <ul>
                                <li>
                                    <a href="javascript:;" @click="tipModal = 1">重新开始</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="tipModal = 2">提前结束</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="backLastHandler">返回上一步</a>
                                </li>
                            </ul>
                        </template>
                    </dropdown>
                </b-nav-item>
                <b-nav-item
                    v-if="metaInfo && metaInfo.process_type == 1"
                    @click="showModal = 5"
                >操作指南</b-nav-item>
                <b-nav-item
                    v-if="metaInfo && metaInfo.process_type == 1"
                    @click="showModal = 6"
                >项目素材</b-nav-item>
            </template>
        </TopHeader>
        <!-- 发送留言 -->
        <send-msg-modal @on-send="sendMsgConfirm"></send-msg-modal>
        <!-- 查看留言 -->
        <receive-msg-modal @on-cancel="receiveMsgClose"></receive-msg-modal>
        <!-- 实验成果Modal -->
        <results-modal></results-modal>
        <!-- 已提交文件Modal -->
        <submitted-file-modal></submitted-file-modal>
    </div>
</template>
<script>
import TopHeader from "@/components/header/TopHeader";
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";
import * as actionCmd from "@/components/business/common/actionCmds";
import Dropdown from "bp-vuejs-dropdown";
import sendMsgModal from "@/components/business/modal/sendMsgModal";
import receiveMsgModal from "@/components/business/modal/receiveMsgModal";
import resultsModal from "@/components/business/modal/resultsModal";
import submittedFileModal from "@/components/business/modal/submittedFileModal";
export default {
    components: {
        TopHeader,
        Dropdown,
        sendMsgModal,
        receiveMsgModal,
        resultsModal
    },
    data() {
        return {
            viewStatus: true,
            showModal: 0,
            tipModal: 0,
            canHandle: true,
            unReadMsgCount: 0,
            intervalFlag: "",
            showSecendMend: false
        };
    },
    created() {},
    computed: {
        ...mapState(["userInfo", "meta"]),
        metaInfo() {
            return this.meta.info;
        },
        currentRoleAllocation() {
            return this.meta.currentRoleAllocation;
        }
    },
    mounted() {
        this.queryUnreadMsg();
        this.intervalFlag = setInterval(() => {
            this.queryUnreadMsg();
        }, 20000);
    },
    beforeDestroy() {
        clearInterval(this.intervalFlag);
    },
    watch: {},
    methods: {
        ...mapActions(["dispatchFlashAction"]),
        queryUnreadMsg() {
            let param = {
                user_id: this.userInfo.id,
                business_id: this.$route.params.bid
            };
            businessService.unReadBusinessMessage(param).then(data => {
                this.unReadMsgCount = data;
            });
        },
        // 发送留言
        sendMsg() {
            this.$emit("openSendMsgModal");
        },
        // 确认发送留言
        sendMsgConfirm(msg) {
            msg.from_user_id = this.userInfo.id;
            businessService.sendMessage(msg).then(() => {
                this.$toasted.success("发送成功");
            });
        },
        // 留言面板
        receiveMsgList() {
            this.$emit("openReceiveMsgModal");
        },
        receiveMsgClose() {
            this.unReadMsgCount = 0;
        },
        viewBusinessResult() {
            if (this.userInfo.identity === 5) {
                if (
                    this.metaInfo.process_type === 1 &&
                    this.currentRoleAllocation.sitting_status === 1
                ) {
                    this.$toasted.error("角色未入席无法查看实验成果");
                    return;
                }
            }
            this.$emit("openResultsModal");
        },
        viewSubmittedFile() {
            this.$emit("openSubmittedFileModal");
        },
        // 切换视角
        switchView() {
            if (!this.metaInfo.can_switch) {
                return;
            }
            this.viewStatus = !this.viewStatus;
            this.dispatchFlashAction({
                ext: {
                    cmd: "action_trans",
                    param: `cmd=switch&viewname=${
                        this.viewStatus ? "正面" : "反面"
                    }`
                }
            });
        },
        // 退出实验
        quit() {
            if (this.userInfo.identity === 4) {
                // this.$router.push({ path: "/mentor/guide" });
            } else {
                // 退席
                let quitRoleAllocs = this.metaInfo.user_role_allocs
                    .filter(roleAlloc => roleAlloc.sitting_status === 2)
                    .map(roleAlloc => roleAlloc.name)
                    .join("、");
                if (quitRoleAllocs.length > 0) {
                    businessService.pushMessage({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id,
                        msg: quitRoleAllocs + "退席并退出实验",
                        type: "cmd",
                        cmd: actionCmd.ACTION_ROLES_EXIT
                    });
                }
                this.$router.push({ path: "/business/list/progress" });
            }
        },
        // 返回上一步确认
        backLastHandler() {
            if (!this.metaInfo.pre_node_id) {
                this.$toasted.error("没有上一步无法返回");
                return;
            }
            this.tipModal = 3;
            // this.$store.dispatch('showTransModal', {
            //   title: '返回上一步选项',
            //   type: 'back',
            //   param: {
            //     node_id: this.metaInfo.pre_node_id,
            //     flow_id: this.metaInfo.flow_id,
            //     direction: 'back'
            //   }
            // })
        },
        // 确定返回上一步
        goBackOk() {
            businessService.pushMessage({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                msg: "返回上一步",
                type: "cmd",
                cmd: actionCmd.ACTION_BUSINESS_BACK,
                data: JSON.stringify({ tran_id: this.metaInfo.pre_node_id })
            });
            this.tipModal = 0;
        },
        // 重新开始确认操作
        restartOk() {
            businessService.pushMessage({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                type: "cmd",
                msg: "重新开始实验",
                cmd: actionCmd.ACTION_BUSINESS_RESTART
            });
            this.tipModal = 0;
        },
        // 提前结束确认
        finishOk() {
            businessService.pushMessage({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                msg: "提前结束实验",
                type: "cmd",
                cmd: actionCmd.ACTION_BUSINESS_FINISH
            });
            this.tipModal = 0;
        },
        // 查看流程图
        showFlowChart() {
            this.$emit("emit-viewxml");
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-menu {
    .bp-dropdown__btn {
        border: 0px;
        padding: 0px;
    }
    .bp-dropdown__btn--active {
        background-color: #253568;
    }
    .bp-dropdown__body {
        color: #212529;
        padding: 0.5rem 0;
        margin: 0.125rem 0 0;
        min-width: 10rem;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.25rem;
        text-align: left !important;
        ul {
            list-style: none;
            padding: 0;
            li {
                line-height: 24px;
                padding: 0.25rem 1.5rem;
                font-weight: 400;
                white-space: nowrap;
                font-size: 16px;
                font-family: "Microsoft JhengHei";
                text-align: left;
                a {
                    color: #212529;
                    text-decoration: none;
                }
            }
            li.active,
            li:active {
                color: #fff;
                text-decoration: none;
                background-color: #007bff;
            }
            li:hover,
            li:focus {
                color: #16181b;
                text-decoration: none;
                background-color: #f8f9fa;
            }
        }
    }
}
</style>

