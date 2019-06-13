<template>
    <div class="speak-container">
        <div class="emoji-wrapper" v-show="showSelBox == 1">
            <ul>
                <li class="emoji-item" v-for="(item, index) in emoji.img" :key="index">
                    <img
                        width="32"
                        height="32"
                        :src="'static/emoji/'+item"
                        :alt="emoji.code[index]"
                        :data="emoji.code[index]"
                        @click.stop="selectEmoji(emoji.code[index])"
                    >
                </li>
            </ul>
        </div>
        <div class="speak-option row">
            <div class="col-xs-3" @click.stop="showSelBox=showSelBox==1?0:1">
                <i class="iconfont icon-xiaolian"></i>&nbsp;表情
            </div>
            <!-- <div class="col-xs-2" @click="showSelBox=showSelBox==1?0:2"><i class="iconfont icon-mic"></i>&nbsp;语音</div> -->
            <div class="col-xs-3" v-if="speakIsBanned" @click.stop="showSelBox = 3">申请发言</div>
        </div>
        <div class="speak-field">
            <textarea name="name" placeholder="请输入发言内容" maxlength="200" v-model.trim="content"></textarea>
        </div>
        <div class="speak-submit">
            <button
                type="button"
                class="btn-submit fr"
                v-if="userInfo.identity == 1"
                @click="sendMsg"
            >提交</button>
            <button
                type="button"
                class="btn-submit fr"
                @click="commitEnd = true"
                v-if="currentRole.can_terminate"
            >结束并走向</button>
            <p class="limit-num fr">
                <span v-if="content.length == 0">
                    最多输入
                    <i>200</i>个字
                </span>
                <span v-if="content.length > 0">
                    还可输入
                    <i>{{200 - content.length}}</i>个字
                </span>
            </p>
        </div>
        <endNodeHandle :isCommit="commitEnd" @on-cancel="endNodeCancel"></endNodeHandle>
        <!-- 申请发言 -->
        <modal
            :visible="showSelBox == 3"
            title="申请发言"
            @on-cancel="showSelBox = 0"
            @on-ok="speakApplyOk"
        >
            <div class="modal-msg">
                <p class="message">确定向主持人提交发言申请？</p>
            </div>
        </modal>
    </div>
</template>
<script type="text/ecmascript-6">
import modal from "components/modal/modal";
import endNodeHandle from "../_components/end-node-handle";
import emoji from "src/libs/emoji";
import * as actionCmd from "pages/experiment/meta/common/actionCmds";
import experimentService from "src/services/experimentService";
export default {
    name: "MetaCourtInput",
    components: { modal, endNodeHandle },
    data() {
        return {
            emoji: emoji,
            showSelBox: 0,
            commitEnd: false,
            content: ""
        };
    },
    computed: {
        metaInfo() {
            return this.$store.state.meta.info;
        },
        currentRole() {
            return this.$store.state.meta.currentRole;
        },
        userInfo() {
            return this.$store.state.userInfo;
        },
        // 是否禁止发言
        speakIsBanned() {
            if (this.currentRole) {
                return this.currentRole.can_terminate
                    ? false
                    : this.metaInfo.isBanned;
            } else {
                return true;
            }
        }
    },
    mounted() {
        // Ctr + Enter 快捷发消息
        document.addEventListener("keyup", e => {
            if (e.ctrlKey && e.keyCode === 13) {
                this.sendMsg();
            }
        });

        document.addEventListener("click", e => {
            this.showSelBox = 0;
        });
    },
    watch: {
        $route() {
            this.content = "";
            this.commitEnd = false;
        }
    },
    methods: {
        endNodeCancel() {
            this.commitEnd = false;
        },
        // 选择表情
        selectEmoji(data) {
            if (this.content.length >= 200) {
                return;
            }
            this.content += data;
            this.showSelBox = 0;
        },
        // 发送命令消息
        sendCMDMessage(msg, cmd) {
            experimentService.pushMessage({
                experiment_id: this.$route.params.eid,
                node_id: this.$route.params.nid,
                role_id: this.currentRole.id,
                msg: msg,
                type: "cmd",
                cmd: cmd
            });
        },
        // 确定申请发言
        speakApplyOk() {
            let msg = "申请发言";
            this.sendCMDMessage(msg, actionCmd.ACTION_ROLE_APPLY_SPEAK);
            this.showSelBox = 0;
        },
        // 发送消息
        sendMsg(e) {
            if (this.content === "") {
                return;
            }
            if (this.content.length > 200) {
                this.$toast.warn("消息长度不得超过200个字符");
                return;
            }

            // 发送消息
            experimentService
                .pushMessage({
                    experiment_id: this.$route.params.eid,
                    node_id: this.$route.params.nid,
                    role_id: this.currentRole.id,
                    type: "txt",
                    msg: this.content
                })
                .then(() => {
                    this.content = "";
                    this.showSelBox = 0;
                    e = true;
                });
        }
    }
};
</script>
<style>
.speak-container {
    position: relative;
    background-color: #f4f4f4;
}
.speak-container .speak-option {
    height: 30px;
    line-height: 30px;
    margin: 0;
    border-top: 1px solid #d6d6d6;
    cursor: pointer;
}
.speak-container .speak-option .icon-xiaolian {
    color: #ff9d2e;
}
.speak-container .speak-option .switch {
    color: #3a7de0;
}

.speak-container .speak-field textarea {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    background-color: #f4f4f4;
    width: 100%;
    height: 100%;
    padding: 12px;
    border: none;
    line-height: 20px;
}
.speak-container .speak-submit {
    height: 42px;
    padding: 6px;
}
.speak-container .speak-submit .btn-submit {
    width: 102px;
    height: 30px;
    margin-right: 10px;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
    background-color: #fff;
    color: #333;
}
.speak-container .speak-submit .btn-submit:active {
    background-color: #ddd;
    color: #fff;
}
.emoji-wrapper {
    z-index: 1;
    position: absolute;
    width: 314px;
    height: 121px;
    overflow-y: scroll;
    bottom: 185px;
    left: 0px;
    border-radius: 2px;
    background: #fff;
    box-sizing: border-box;
    padding: 4px;
    box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
}
.emoji-wrapper > ul > li {
    cursor: pointer;
    display: inline-block;
    margin: 2px 3px 0 3px;
}
.limit-num {
    text-align: right;
    padding: 10px;
}
</style>
