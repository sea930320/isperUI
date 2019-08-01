<template>
    <b-row class="business-ask">
        <loading v-if="isRunning"></loading>
        <b-col cols="2" class="panel">
            <b-row class="h-75 pt-2">
                <b-dropdown id="dropdown-1" text="事务类型" class="m-md-2 w-100" variant="primary" style="height: min-content;">
                    <b-dropdown-item v-for="item in chatRooms" :key="item.room_id" @click="selectChatRoom(item.room_id)">{{item.officeItem}}</b-dropdown-item>
                </b-dropdown>
            </b-row>
            <b-row class="h-25">
                <div class="bg-secondary mx-auto status-pane py-3">参与人数<br>{{onlineChatRoomUsers.length}}</div>
                <div class="bg-secondary mx-auto status-pane py-3">指导者<br>{{onlineChatRoomUsers.filter(i=>i.user_role === 4).length}}</div>
                <div class="bg-secondary mx-auto status-pane py-3">指导者助理<br>{{onlineChatRoomUsers.filter(i=>i.user_role === 8).length}}</div>
                <div class="bg-secondary mx-auto status-pane py-3">其余人数<br>{{onlineChatRoomUsers.filter(i=>i.user_role === 5).length}}</div>
            </b-row>
        </b-col>
        <b-col class="py-4 px-4 pan" cols="8">
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
                                        {{item.name}}&ensp;{{(item.role === 4) ? '(指导者)' : (item.role === 8) ? '(指导者助理)' : '(普通用户)'}}
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
                                        {{item.name}}&ensp;{{(item.role === 4) ? '(指导者)' : (item.role === 8) ? '(指导者助理)' : '(普通用户)'}}
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
                        <b-button @click="sendMsg" size="sm" variant="outline-primary" :disabled="selectedChatRoomId === null">&ensp;发&ensp;&ensp;送&ensp;</b-button>
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
        <b-col cols="2" class="panel">
            <div class="py-3 text-left team-members p-3" style="color: white">
                在线聊天用户
                <hr style="border-top: 1px solid rgba(255, 255, 255, 0.3);" class="mt-2"/>
                <template v-for="(user, index) in onlineChatRoomUsers">
                    <div class="team_user mb-2" :key="index">
                        <icon name="user"></icon>
                        <span class="ml-3 mr-4">{{user.user_username}}&ensp;{{(user.user_role === 4) ? '(指导者)' : (user.user_role === 8) ? '(指导者助理)' : '(普通用户)'}}</span>
                    </div>
                </template>
            </div>
        </b-col>
    </b-row>
</template>
<script>
    import emoji from "@/components/business/common/emoji";
    import businessService from "@/services/businessService";
    import {businessStatus, gender} from "@/filters/fun";
    import Loading from "@/components/loading/Loading";

    export default {
        components: {
            Loading
        },
        sockets: {
            connect() {
            },
            getAskMessage(msg) {
                let message = msg.result;
                if ( message.room_id === this.selectedChatRoomId.toString() ) {
                    this.messages.push(message);
                }
            },
            onlineAskUsers(data) {
                this.onlineChatRoomUsers = data.chatUsers.filter(item => item.room_id === this.selectedChatRoomId);
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
                chatRooms: [],
                messages: [],
                onlineChatRoomUsers: [],
                selectedChatRoomId: null
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
                    .getChatRooms({})
                    .then(data => {
                        this.chatRooms = data;
                    });
            },
            selectChatRoom(room_id) {
                this.run();
                this.selectedChatRoomId = room_id;
                businessService
                    .getChatRoomMessages({room_id: room_id})
                    .then(data => {
                        this.messages = data.results;
                        this.$emit("data-ready");
                    });
                this.$socket.emit("askUserIsOnline", {
                    room_id: room_id,
                    user_id: this.userInfo.id,
                    user_username: this.userInfo.username,
                    user_role: this.userInfo.identity,
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
                    .sendAskMessage({
                        room_id: this.selectedChatRoomId,
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
    .business-ask {
        height: calc(100vh - 200px);

        .dropdown-menu {
            width: 100%;
        }

        .status-pane {
            height: 43%;
            width: 45%;
            color: white;
        }

        .panel {
            background: darkgrey;
        }

        .pan {
            background: whitesmoke;
        }

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
                height: 100%;

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
