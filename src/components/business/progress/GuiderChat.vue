<template>
    <b-row class="guider-chat">
        <b-col class="py-4 pl-2 pr-1" cols="12">
            <b-card class="text-left" style="height: 70%; margin-bottom: 2%; overflow: overlay;">
                <section class="chatlist" ref="chat" v-scroll-bottom="messages">
                    <ul>
                        <template v-for="(item, index) in messages">
                            <li
                                    :key="index"
                                    class="chat-bubble chat-mine"
                                    v-if="item.sender !== userInfo.id"
                            >
                                <div class="chat-user">
                                    <img src="@/assets/imgIsper/business/avatar1.png"/>
                                </div>
                                <div class="time">
                                    <cite>
                                        <i>{{item.create_time}}</i>
                                        {{item.name}}
                                    </cite>
                                </div>
                                <div class="chat-text" v-html="replaceFace(item.msg)"></div>
                            </li>
                            <li :key="index" class="chat-bubble chat-others" v-else>
                                <div class="chat-user">
                                    <img src="@/assets/imgIsper/business/avatar2.png"/>
                                </div>
                                <div class="time">
                                    <cite>
                                        {{item.name}}
                                        <i>{{item.create_time}}</i>
                                    </cite>
                                </div>
                                <div class="chat-text" v-html="replaceFace(item.msg)"></div>
                            </li>
                        </template>
                    </ul>
                </section>
            </b-card>
            <div class="chat-input">
                <div class="emoji-wrapper" v-show="showSelBox === 1">
                    <ul class="p-0 m-1">
                        <li :key="index" class="emoji-item" v-for="(item, index) in emoji.img">
                            <img
                                    :alt="emoji.code[index]"
                                    :data="emoji.code[index]"
                                    :src="require('@/assets/imgIsper/emoji/'+item)"
                                    @click.stop="selectEmoji(emoji.code[index])"
                                    height="32"
                                    width="32"
                            />
                        </li>
                    </ul>
                </div>
                <div class="speak-option">
                    <span @click.stop="showSelBox=showSelBox === 1?0:1">
                        <icon name="laugh"></icon>
                    </span>
                </div>
                <div class="speak-field">
                    <textarea maxlength="200" name="name" placeholder="请输入发言内容" v-model.trim="content"></textarea>
                </div>
                <div class="speak-submit">
                    <b-button-group class="fr">
                        <b-button @click="sendMsg" size="sm" variant="outline-primary">发送</b-button>
                    </b-button-group>
                    <p class="limit-num fr p-0 m-0 mr-2">
                    <span v-if="content.length === 0">
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
        </b-col>
    </b-row>
</template>
<script>
    import emoji from "@/components/business/common/emoji";
    import businessService from "@/services/businessService";
    import {businessStatus, gender} from "@/filters/fun";

    export default {
        components: {},
        sockets: {
            connect() {
            },
            getGuiderMessage(msg) {
                let message = msg.result;
                if ( message.guide_id === this.guider.id.toString() ) {
                    this.messages.push(message);
                }
            }
        },
        props: {
            guider: {
                type: Object,
                default: () => {
                }
            },
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
        data() {
            return {
                emoji: emoji,
                showSelBox: 0,
                content: "",
                search: "",
                messages: [],
                cancelUser: null,
            };
        },
        filters: {businessStatus, gender},
        created() {
            this.$nextTick(() => {
                this.init();
            });
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            },
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
            init() {
                businessService
                    .getGuiderMessage({
                        guider_id: this.guider.id,
                    })
                    .then(data => {
                        this.messages = data.results;
                    });
            },
            selectEmoji(data) {
                if (this.content.length >= 200) {
                    return;
                }
                this.content += data;
                this.showSelBox = 0;
            },
            sendMsg() {
                businessService
                    .sendGuiderMessage({
                        guide_id: this.guider.id,
                        msg: this.content,
                    })
                    .then(() => {
                        this.content = "";
                    });
            },
            // 替换表情代码
            replaceFace(msg) {
                if (!msg) return "";
                let self = this;
                /* eslint-disable */
                let con = msg.replace(/\[[^\[\]]+\]/g, function (item) {
                    let index = self.emoji.code.indexOf(item);
                    let src = require("@/assets/imgIsper/emoji/" + self.emoji.img[index]);
                    return '<img src="' + src + '" alt="" />';
                });
                return con;
            },
        }
    };
</script>

<style lang="scss">
    .guider-chat {
        height: 500px;

        .chatlist {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: none;
            -ms-overflow-style: none;

            ul,
            ol {
                padding: 0px;
                list-style: none;

                .chat-status {
                    position: relative;
                    margin-bottom: 10px;
                    padding-left: 60px;
                    text-align: center;

                    .status-info {
                        display: inline-block;
                        font-size: 12px;
                        line-height: 20px;
                        padding: 0 20px;
                        border-radius: 10px;
                        background-color: #ccc;
                    }
                }

                .chat-bubble {
                    position: relative;
                    margin-bottom: 10px;
                    padding-left: 60px;
                    min-height: 68px;
                    text-align: left;

                    .chat-user {
                        position: absolute;
                        left: 3px;
                        top: 10px;

                        img {
                            width: 40px;
                            height: 40px;
                            border-radius: 100%;
                        }
                    }

                    .time {
                        width: 100%;

                        cite {
                            font-style: normal;
                            line-height: 24px;
                            font-size: 12px;
                            white-space: nowrap;
                            color: #999;
                            text-align: left;

                            i {
                                font-style: normal;
                                padding-left: 5px;
                                padding-right: 5px;
                                font-size: 12px;
                            }
                        }
                    }

                    .chat-text {
                        position: relative;
                        line-height: 22px;
                        padding: 5px 15px;
                        min-height: 32px;
                        border-radius: 3px;
                        color: #253568;
                        word-break: break-all;
                        max-width: 462px \9
                    ;
                        background: #e9ecef;

                        img {
                            height: 22px;
                            margin-top: -4px;
                            width: 22px;
                        }
                    }

                    .chat-text:after {
                        content: "";
                        position: absolute;
                        left: -10px;
                        top: 5px;
                        width: 0;
                        height: 0;
                        border-style: solid dashed dashed;
                        border-color: #e9ecef transparent transparent;
                        overflow: hidden;
                        border-width: 10px;
                    }

                    .chat-text,
                    .chat-user {
                        display: inline-block;
                        vertical-align: top;
                        font-size: 14px;
                    }
                }

                .chat-mine {
                    text-align: right;
                    padding-left: 0;
                    padding-right: 60px;

                    .chat-user {
                        left: auto;
                        right: 3px;
                    }

                    .chat-text {
                        margin-left: 0;
                        text-align: left;
                        background-color: #6787e7;
                        color: #fff;
                    }

                    .chat-text:after {
                        left: auto;
                        right: -10px;
                        border-top-color: #6787e7;
                    }
                }
            }
        }

        .chatlist::-webkit-scrollbar {
            width: 0em;
        }

        .chat-input {
            height: 28%;
            display: flex;
            flex-direction: column;
            left: 0px;
            width: 100%;
            position: relative;

            .speak-option {
                color: #909090;
                text-align: left;
                padding-left: 0px;
            }

            .speak-field {
                margin-top: 4px;

                textarea {
                    height: 100%;
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    resize: none;
                    font-size: 14px;
                    border-radius: 0.25rem !important;
                    border: 1px solid #dee2e6 !important;
                }
            }

            .emoji-wrapper {
                z-index: 1;
                position: absolute;
                border-radius: 2px;
                background: #fff;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                padding: 0px;
                -webkit-box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
                box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
                top: -5px;
                margin-left: 34px;

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

        .team-members {
            height: 100%;
            background: rgba(58, 125, 224, 0.5);
            overflow: auto;

            .team_user {
                display: flex;
                line-height: 29px;
                color: white;
                margin-left: 10px;
                font-size: 16px;

                .fa-icon {
                    margin: auto 0px;
                    color: white;
                }
            }
        }
    }
</style>
