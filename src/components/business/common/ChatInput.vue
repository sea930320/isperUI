<template>
    <div class="speak-container">
        <div class="speak-input">
            <div class="emoji-wrapper" v-show="showSelBox == 1">
                <ul class="p-0 m-1">
                    <li class="emoji-item" v-for="(item, index) in emoji.img" :key="index">
                        <img
                            width="32"
                            height="32"
                            :src="require('@/assets/imgIsper/emoji/'+item)"
                            :alt="emoji.code[index]"
                            :data="emoji.code[index]"
                            @click.stop="selectEmoji(emoji.code[index])"
                        >
                    </li>
                </ul>
            </div>
            <div class="speak-option">
                <span @click.stop="showSelBox=showSelBox==1?0:1">
                    <icon name="laugh"></icon>
                </span> &nbsp;
                <span @click.stop>
                    <icon name="image"></icon>
                </span> &nbsp;
                <span v-if="speakIsBanned" @click.stop="showSelBox = 3">申请发言</span>
            </div>
            <div class="speak-field">
                <textarea name="name" placeholder="请输入发言内容" maxlength="200" v-model.trim="content"></textarea>
            </div>
            <div class="speak-submit">
                <b-button-group class="fr">
                    <b-button
                        v-if="userInfo.identity == 5"
                        size="sm"
                        variant="outline-primary"
                        @click="sendMsg"
                    >提交</b-button>
                    <b-button
                        v-if="currentRoleAllocation.can_terminate"
                        size="sm"
                        variant="outline-primary"
                        @click="commitEnd = true"
                    >结束并走向</b-button>
                </b-button-group>
                <p class="limit-num fr p-0 m-0 mr-2">
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
        </div>
        <!-- <end-node-handle :isCommit="commitEnd" @on-cancel="endNodeCancel"></end-node-handle> -->
    </div>
</template>
<script>
// import * as actionCmd from "@/components/business/common/actionCmds";
// import businessService from "@/services/businessService";
import emoji from "@/components/business/common/emoji";
// import endNodeHandle from "@/components/business/modal/endNodeHandle";

export default {
    name: "AnimationChatInput",
    data() {
        return {
            emoji: emoji,
            showSelBox: 0,
            commitEnd: false,
            content: ""
        };
    },
    components: {},
    computed: {
        metaInfo() {
            return this.$store.state.meta.info;
        },
        currentRoleAllocation() {
            return this.$store.state.meta.currentRoleAllocation;
        },
        userInfo() {
            return this.$store.state.userInfo;
        },
        // 是否禁止发言
        speakIsBanned() {
            if (this.currentRoleAllocation) {
                return this.currentRoleAllocation.can_terminate
                    ? false
                    : this.metaInfo.isBanned;
            } else {
                return true;
            }
        }
    },
    mounted() {
        document.addEventListener("click", () => {
            this.showSelBox = 0;
        });
        document.addEventListener("keyup", e => {
            if (e.ctrlKey && e.keyCode === 13) {
                this.sendMsg();
            }
        });
    },
    watch: {},
    methods: {
        // 选择表情
        selectEmoji(data) {
            if (this.content.length >= 200) {
                return;
            }
            this.content += data;
            this.showSelBox = 0;
        },
        sendMsg() {
            if (this.content === "") {
                return;
            }
            if (this.content.length > 200) {
                this.$toasted.error("消息长度不得超过200个字符");
                return;
            }
            this.$socket.emit("message", {
                user_id: this.userInfo.id,
                login_type: this.userInfo.identity,
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                type: "txt",
                msg: this.content
            });
            this.content = "";
        },
        endNodeCancel() {
            this.commitEnd = false;
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.speak-container {
    height: 200px;
    background: rgba(243, 243, 243, 0.5);
    position: relative;
    padding: 6px;

    .speak-input {
        position: absolute;
        bottom: 10px;
        left: 0px;
        width: 100%;
        .speak-option {
            color: #909090;
            text-align: left;
            padding-left: 10px;
        }
        .speak-field {
            textarea {
                height: 100%;
                width: 100%;
                border: 6px solid rgb(221, 231, 249);
                padding: 10px;
                box-sizing: border-box;
                -moz-box-sizing: border-box;
                resize: none;
                font-size: 14px;
            }
        }
        .emoji-wrapper {
            z-index: 1;
            position: absolute;
            border-radius: 2px;
            background: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 4px;
            -webkit-box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
            box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
            top: -5px;
            margin-left: 7px;
            ul {
                li {
                    cursor: pointer;
                    display: inline-block;
                    margin: 2px 3px 0 3px;
                }
            }
        }

        .speak-submit {
            float: right;
            margin-top: 10px;
            margin-right: 5px;

            .limit-num {
                margin-top: 5px !important;
                font-size: 15px;
            }
        }
    }
}
</style>
