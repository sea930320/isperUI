<template>
    <div class="progress-chat-container">
        <div class="progress-chat-hd">
            <b-dropdown
                size="sm"
                :text="currentRoleAllocation.role.name+' ( '+ currentRoleAllocation.no + ' ) '"
                class="m-2"
                variant="outline-primary"
            >
                <b-dropdown-item
                    @click.stop="selectRoleAllocHandle(roleAlloc)"
                    v-for="(roleAlloc, index) in userRoleAllocs"
                    :key="index"
                >{{roleAlloc.role.name}}({{currentRoleAllocation.no}}){{roleAlloc.sitting_status == 2 ? '' : '（未入席）'}}</b-dropdown-item>
            </b-dropdown>
        </div>
        <!-- <section ref="chat" class="chatlist" v-scroll-bottom="messages">
            <ul>
                <template v-for="(item, index) in messages">
                    <li
                        class="chat-status"
                        :key="index"
                        v-if="statusCmdArr.indexOf(item.ext.cmd) > -1"
                    >
                        <div
                            class="status-info"
                            v-if="item.ext.cmd == 'action_role_apply_speak_opt'"
                        >
                            {{item.ext.opt.role_name}}申请发言
                            <br>
                            {{item.ext.role_name}}{{item.ext.opt.result == 1 ? '同意' : '拒绝'}}{{item.ext.opt.role_name}}进行发言
                        </div>
                        <div
                            class="status-info"
                            v-else-if="item.ext.cmd == 'action_role_letin'"
                        >{{item.ext.role_name}}（{{item.ext.username}}）请入{{item.ext.opt.data.map(role => role.role_name).join('、')}}</div>
                        <div
                            class="status-info"
                            v-else-if="item.ext.cmd == 'action_role_letout'"
                        >{{item.ext.role_name}}（{{item.ext.username}}）{{item.data}}</div>
                        <div
                            class="status-info"
                            v-else-if="item.ext.cmd == 'action_roles_exit'"
                        >{{item.data}}</div>
                        <div
                            class="status-info"
                            v-else
                        >{{item.ext.role_name}}（{{item.ext.username}}）{{item.data}}</div>
                    </li>
                    <li
                        class="chat-bubble chat-mine"
                        :key="index"
                        v-else-if="item.from == userInfo.id"
                    >
                        <div class="chat-user">
                            <img :src="item.ext.avatar">
                        </div>
                        <div class="time">
                            <cite>
                                <i>{{item.ext.time}}</i>
                                {{item.ext.role_name}}（{{item.ext.username}}）
                            </cite>
                        </div>
                        <div v-if="item.url" class="chat-text">
                            <chat-audio :src="item.url"></chat-audio>
                        </div>
                        <div
                            v-else
                            class="chat-text"
                            v-html="replaceFace(item)"
                            @click="messageHandler(item)"
                        ></div>
                    </li>
                    <li class="chat-bubble chat-others" :key="index" v-else>
                        <div class="chat-user">
                            <img :src="item.ext.avatar">
                        </div>
                        <div class="time">
                            <cite>
                                {{item.ext.role_name}}（{{item.ext.username}}）
                                <i>{{item.ext.time}}</i>
                            </cite>
                        </div>
                        <div v-if="item.url" class="chat-text">
                            <chat-audio :src="item.url"></chat-audio>
                        </div>
                        <div
                            v-else
                            class="chat-text"
                            v-html="replaceFace(item)"
                            @click="messageHandler(item)"
                        ></div>
                    </li>
                </template>
            </ul>
        </section>-->
    </div>
</template>
<script>
// import ChatAudio from "@/components/business/common/ChatAudio";
import emoji from "@/components/business/common/emoji";
import businessService from "@/services/businessService";
import * as actionCmd from "@/components/business/common/actionCmds";
import { mapState } from "vuex";
const handleCmds = [
    actionCmd.ACTION_ROLE_MEET,
    actionCmd.ACTION_DOC_SHOW,
    actionCmd.ACTION_DOC_SUBMIT,
    actionCmd.ACTION_DOC_APPLY_SUBMIT,
    actionCmd.ACTION_DOC_APPLY_SHOW,
    actionCmd.ACTION_ROLE_APPLY_SPEAK,
    actionCmd.ACTION_ROLE_REQUEST_SIGN,
    actionCmd.ACTION_ROLE_SIGN
];
export default {
    name: "ProgressChat",
    components: {},
    data() {
        return {
            emoji: emoji,
            modalShow: 0,
            roleAllocsShow: false,
            // 申请操作消息体数据
            applyOptData: {
                opt_status: false,
                opt: {}
            },
            // 查看签字文件详情
            signedDocDetail: null
        };
    },
    computed: {
        ...mapState({
            userRoleAllocs: state => state.meta.info.user_role_allocs,
            currentRoleAllocation: state => state.meta.currentRoleAllocation,
            messages: state => state.meta.messages,
            userInfo: state => state.userInfo
        }),
        statusCmdArr() {
            return [
                "action_trans",
                "action_role_hide",
                "action_role_show",
                "action_role_stand",
                "action_role_sitdown",
                "action_role_letin",
                "action_role_letout",
                "action_role_banned",
                "action_exp_restart",
                "action_exp_back",
                "action_exp_finish",
                "action_exp_node_end",
                "action_role_apply_speak_opt",
                "action_role_toward_report",
                "action_role_end_report",
                "action_roles_exit"
            ];
        }
    },
    directives: {
        // 发送消息后滚动到底部
        "scroll-bottom"(el, binding, vnode) {
            vnode.context.$nextTick(() => {
                el.scrollTop = el.scrollHeight - el.clientHeight;
            });
        },
        // 换行符
        "line-break"(el, binding) {
            el.innerHTML = binding.value.replace(/\r?\n|\r/g, "<br/>");
        }
    },
    mounted() {
        // 点击其他地方，收起角色选择
        document.addEventListener("click", () => {
            this.roleAllocsShow = false;
        });
    },
    methods: {
        selectRoleAllocHandle(role_alloc) {
            this.$store.dispatch("setCurrentRoleAllocation", role_alloc);
            this.$store.dispatch("showLoading");
            // 切换角色文档
            this.$store.dispatch("getBusinessNodeDocs", {
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: role_alloc.alloc_id
            });
            // 重新获取动作按钮的状态
            this.$store.dispatch("getBusinessNodeFunction", {
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: role_alloc.alloc_id
            });
            this.roleAllocsShow = false;
        },
        // 替换表情代码
        replaceFace(msg) {
            var self = this;
            var con = "";
            // 展示文件
            if (msg.ext.cmd === actionCmd.ACTION_DOC_SHOW) {
                return `<a href="${
                    msg.ext.opt.url
                }" class="btn-underline" target="_blank">${msg.data}</a>`;
            }
            // 提交文件
            if (msg.ext.cmd === actionCmd.ACTION_DOC_SUBMIT) {
                con += "提交文件";
                msg.ext.opt.data.forEach(dt => {
                    con += `<a href="${
                        dt.url
                    }" class="btn-underline" target="_blank">${
                        dt.name
                    }</a><br>`;
                });
                return con;
            }

            // 签字
            if (msg.ext.opt_status) {
                if (msg.ext.cmd === actionCmd.ACTION_ROLE_REQUEST_SIGN) {
                    con = `<span>要求${
                        msg.ext.opt.role_name
                    }签字（已完成）</span>`;
                } else {
                    con = `<span>${msg.data}（已完成）</span>`;
                }
                return con;
            }

            // 签字之后生成链接
            if (msg.ext.cmd === actionCmd.ACTION_ROLE_SIGN) {
                return `${msg.ext.opt.name}${
                    msg.ext.opt.result === 1 ? "已经" : "拒绝"
                }在《<a href="javascript:;" class="btn-underline">${
                    msg.ext.opt.doc_name
                }</a>》上签字`;
            }

            // 安排报告
            if (msg.ext.cmd === actionCmd.ACTION_ROLE_SCHEDULE_REPORT) {
                if (
                    msg.ext.opt &&
                    parseInt(msg.ext.opt.role_id) === this.currentRole.id
                ) {
                    return `<a href="javascript:void(0)" class="btn-underline" title="点击左下侧走向发言席按钮">请走向发言席作报告</a>`;
                } else {
                    return `${msg.data}`;
                }
            }

            // 签字
            if (
                msg.ext.cmd === actionCmd.ACTION_ROLE_REQUEST_SIGN &&
                msg.ext.opt &&
                parseInt(msg.ext.opt.role_id) !== this.currentRole.id
            ) {
                return `<span>要求${msg.ext.opt.role_name}签字</span>`;
            }

            // 申请发言、申请提交、申请展示
            if (
                (msg.ext.cmd === actionCmd.ACTION_DOC_APPLY_SUBMIT ||
                    msg.ext.cmd === actionCmd.ACTION_DOC_APPLY_SHOW ||
                    msg.ext.cmd === actionCmd.ACTION_ROLE_APPLY_SPEAK) &&
                !this.currentRole.can_terminate
            ) {
                return `${msg.data}`;
            }

            if (handleCmds.indexOf(msg.ext.cmd) > 0) {
                return `<a href="javascript:;" class="btn-underline" target="_blank">${
                    msg.data
                }</a>`;
            }

            con = msg.data.replace(/\[[^\[\]]+\]/g, function(item) {
                let index = self.emoji.code.indexOf(item);
                return (
                    '<img src="static/emoji/' +
                    self.emoji.img[index] +
                    '" width="32" height="32"  alt="" />'
                );
            });
            return con;
        },
        // 发送命令消息
        sendCMDMessage(msg, cmd, data) {
            businessService
                .pushMessage({
                    experiment_id: this.$route.params.eid,
                    node_id: this.$route.params.nid,
                    role_id: this.currentRole.id,
                    msg: msg,
                    type: "cmd",
                    cmd: cmd,
                    data: data
                })
                .then(data => {
                    // console.log(data)
                    this.applyOptData.opt_status = true;
                });
        },
        // 消息体处理： 申请提交、 申请展示、申请发言
        messageHandler(msg) {
            if (handleCmds.indexOf(msg.ext.cmd) < 0) {
                return;
            }

            if (msg.ext.opt_status) {
                return;
            }

            switch (msg.ext.cmd) {
                case actionCmd.ACTION_DOC_APPLY_SUBMIT:
                    if (!this.currentRole.can_terminate) {
                        // this.$toast.info('您不是主持人无权处理')
                        return;
                    }
                    this.applyOptData = msg.ext;
                    this.modalShow = 3;
                    break;
                case actionCmd.ACTION_DOC_APPLY_SHOW:
                    if (!this.currentRole.can_terminate) {
                        // this.$toast.info('您不是主持人无权处理')
                        return;
                    }
                    this.applyOptData = msg.ext;
                    this.modalShow = 1;
                    break;
                case actionCmd.ACTION_ROLE_APPLY_SPEAK:
                    if (!this.currentRole.can_terminate) {
                        // this.$toast.info('您不是主持人无权处理')
                        return;
                    }
                    if (!this.currentRole.can_terminate) return;
                    this.applyOptData = msg.ext;
                    this.modalShow = 2;
                    break;
                case actionCmd.ACTION_ROLE_REQUEST_SIGN:
                    if (this.currentRole.id !== parseInt(msg.ext.opt.role_id)) {
                        // this.$toast.warn('您不是被要求签字的角色，不能签字')
                        return;
                    }
                    this.applyOptData = msg.ext;
                    this.modalShow = 4;
                    break;
                case actionCmd.ACTION_ROLE_SIGN:
                    this.getDocDetail(msg.ext.opt.doc_id);
                    this.modalShow = 6;
                    break;
            }
        },
        // 申请提交处理： type： 1，同意 2，拒绝
        submitApplyHandler(type) {
            let message = `${type === 1 ? "同意" : "拒绝"}${
                this.applyOptData.opt.role_name
            }的提交申请`;
            this.sendCMDMessage(
                message,
                actionCmd.ACTION_DOC_APPLY_SUBMIT_OPT,
                JSON.stringify({
                    msg_id: this.applyOptData.id,
                    role_id: this.applyOptData.opt.role_id,
                    result: type
                })
            );
            this.modalShow = 0;
        },
        // 处理展示申请
        showApplyHandler(type) {
            let message = `${type === 1 ? "同意" : "拒绝"}${
                this.applyOptData.opt.role_name
            }的展示申请`;
            this.sendCMDMessage(
                message,
                actionCmd.ACTION_DOC_APPLY_SHOW_OPT,
                JSON.stringify({
                    msg_id: this.applyOptData.id,
                    role_id: this.applyOptData.opt.role_id,
                    result: type
                })
            );
            this.modalShow = 0;
        },
        // 处理发言申请
        speakApplyHandler(type) {
            if (!this.applyOptData) return;
            let message = `${this.applyOptData.opt.role_name}申请发言\n${
                this.currentRole.name
            }${type === 1 ? "同意" : "拒绝"}${
                this.applyOptData.opt.role_name
            }进行发言`;
            this.sendCMDMessage(
                message,
                actionCmd.ACTION_ROLE_APPLY_SPEAK_OPT,
                JSON.stringify({
                    msg_id: this.applyOptData.id,
                    role_id: this.applyOptData.opt.role_id,
                    result: type
                })
            );
            this.modalShow = 0;
        },
        // 签名操作
        signHandler(type) {
            this.sendCMDMessage(
                `${this.applyOptData.opt.role_name}${
                    type === 1 ? "已经" : "拒绝"
                }在《${this.applyOptData.opt.doc_name}》上签字`,
                actionCmd.ACTION_ROLE_SIGN,
                JSON.stringify({
                    msg_id: this.applyOptData.id,
                    doc_id: this.applyOptData.opt.doc_id,
                    doc_name: this.applyOptData.opt.doc_name,
                    result: type
                })
            );
            this.modalShow = 0;
        },
        getDocDetail(docId) {
            businessService
                .getDocDetail({
                    experiment_id: this.$route.params.eid,
                    node_id: this.$route.params.nid,
                    doc_id: docId
                })
                .then(data => {
                    this.signedDocDetail = data;
                });
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-chat-container {
    background: #ffffff3d;
}
</style>
