<template>
    <div>
        <loading v-if="isRunning"></loading>
        <b-modal v-model="visible" title="留言面板" size="xl" class :hide-footer="true">
            <div class="msgContainer">
                <div class="msgItem" v-for="(item, index) in msgList.list" :key="item.id">
                    <div :class="{'unReadBg': item.read_status == 0, 'msgInfo': true}">
                        <span class="replyFrom">{{item.from_user_name}}</span>
                        <span class="replySay">对</span>
                        <span class="replyTo">{{item.to_user_name}}</span>
                        <span style="color: #a3a3a3;">说:</span>
                        <span class="msgDetail">&nbsp; {{item.content}}</span>
                        <a
                            v-if="index === replyIndex"
                            href="javascript:void(0);"
                            class="replyCancelBtn"
                            @click="cancelReply"
                        >取消</a>
                        <a href="javascript:void(0);" class="replyBtn">
                            <span
                                v-if="item.from_user_id != userInfo.id"
                                @click="replyClick(item, index)"
                            >回复</span>
                        </a>
                        <span class="msgDate">{{item.create_time}}</span>
                    </div>
                    <div class="replyBox">
                        <div
                            v-for="reply in item.reply"
                            :key="reply.id"
                            :class="{'unReadBg': reply.read_status == 0, 'replyItem': true}"
                        >
                            <div style="width: calc(100% - 140px);">
                                <span class="replyFrom">{{reply.from_user_name}}</span>
                                <span class="replySay">回复</span>
                                <span class="replyTo">{{reply.to_user_name}} :</span>
                                <span class="replyMsg">{{reply.content}}</span>
                                <a class="replyBtn">
                                    <span
                                        v-if="reply.from_user_id != userInfo.id"
                                        @click="replySpecilPerson(reply, index)"
                                    >回复</span>
                                </a>
                            </div>
                            <div>
                                <span class="replyDate">{{reply.create_time}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="reply" v-if="index === replyIndex">
                        <b-input-group :prepend="replyPerson" class="my-0" size="sm">
                            <b-form-input v-model="replyMsg"></b-form-input>
                            <b-input-group-append>
                                <b-button variant="info" @click="commitReply(item.id)">提交</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </div>
            </div>

            <b-row class="justify-content-center row-margin-tweak mt-3">
                <b-pagination
                    :size="template_size"
                    :total-rows="msgList.total"
                    :per-page="pageParam.size"
                    limit="5"
                    v-model="pageParam.page"
                ></b-pagination>
            </b-row>
        </b-modal>
    </div>
</template>
<script type="text/ecmascript-6">
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";
import { mapState } from "vuex";
export default {
    name: "receiveMsgModal",
    components: { Loading },
    data() {
        return {
            visible: false,
            pageParam: {
                page: 1,
                size: 10
            },
            msgList: {
                list: [],
                total: 0
            },
            replyPerson: "",
            replyToUserId: "",
            replyMsg: "",
            replyIndex: -1
        };
    },
    created() {
        this.$parent.$on("openReceiveMsgModal", () => {
            this.visible = true;
            this.getMsgList();
        });
    },
    computed: {
        ...mapState(["userInfo"]),
        userInfo() {
            return this.$store.state.userInfo;
        },
        businessId() {
            return this.$route.params.bid;
        }
    },
    watch: {
        visible: function(val) {
            if (!val) {
                this.msgList.list = [];
                this.msgList.total = 0;
                this.replyMsg = "";
                this.replyIndex = -1;
            }
        },
        pageParam: {
            handler() {
                this.getMsgList();
            },
            deep: true
        }
    },
    methods: {
        getMsgList() {
            let param = {
                user_id: this.userInfo.id,
                business_id: this.businessId,
                page: this.pageParam.page,
                size: this.pageParam.size
            };
            businessService.getMessageList(param).then(data => {
                this.msgList.list = data.results;
                this.msgList.total = data.paging ? data.paging.count : 0;
            });
        },
        cancel() {
            this.$emit("on-cancel");
        },
        cancelReply() {
            this.replyMsg = "";
            this.replyIndex = -1;
            this.replyToUserId = "";
        },
        replyClick(item, index) {
            this.replyIndex = index;
            this.replyPerson = "";
            this.replyMsg = "";
            this.replyToUserId = item.from_user_id;
        },
        replySpecilPerson(reply, index) {
            this.replyIndex = index;
            this.replyPerson = "回复 " + reply.from_user_name;
            this.replyMsg = "";
            this.replyToUserId = reply.from_user_id;
        },
        commitReply(id) {
            let param = {
                from_user_id: this.userInfo.id,
                content: this.replyMsg,
                business_id: this.businessId,
                to_user_ids: this.replyToUserId,
                host_id: id
            };
            businessService.replyMessage(param).then(() => {
                this.replyMsg = "";
                this.replyIndex = -1;
                this.replyToUserId = "";
                this.$toasted.success("回复成功");
                this.getMsgList();
            });
        }
    }
};
</script>
<style>
.msgContainer {
    min-height: 380px;
}
.msgItem {
    line-height: 24px;
    color: #757575;
    font-size: 14px;
    text-align: left;
    padding: 5px;
    border-bottom: 1px solid #ccc;
}
.msgInfo {
    padding: 5px;
    background-color: #fff;
}
.msgInfo:after {
    display: block;
    content: "";
    clear: both;
}
.msgInfo span {
    float: left;
}
.msgInfo .msgName {
    min-width: 5%;
    text-align: right;
    font-weight: 700;
}
.msgInfo .msgDetail {
    width: 55%;
    color: #4b4b4b;
}
.msgInfo .msgDate {
    float: right;
    width: 145px;
    color: #999;
}
.msgInfo .replyBtn {
    float: right;
    width: 50px;
    height: 22px;
    text-align: center;
    color: #adadad;
}

.msgInfo .replyCancelBtn {
    float: right;
    width: 40px;
    text-align: center;
    color: #adadad;
}
.reply {
    margin-top: 8px;
    /* padding: 5px 10px; */
    /* border-top: 1px solid #eee; */
}

.replyBox {
    background-color: #eee;
}
.replyItem {
    padding-left: 2%;
    padding-bottom: 3px;
    padding-top: 3px;
    display: flex;
    /* border-top: 1px solid #ccc; */
}
.replyFrom,
.replyTo {
    display: inline-block;
    padding: 0 3px;
    font-size: 14px;
    line-height: 24px;
    color: #4b4b4b;
    font-weight: 600;
}
.replySay {
    display: inline-block;
    color: #a3a3a3;
    padding: 0 3px;
    font-size: 14px;
    line-height: 24px;
    font-weight: 500;
}
.replyItem .replyMsg {
    display: inline-block;
    min-width: 300px;
    font-size: 14px;
    color: #4b4b4b;
    line-height: 24px;
    max-width: 80%;
    word-break: break-all;
    vertical-align: top;
    padding-left: 10px;
}
.replyItem .replyDate {
    display: inline-block;
    float: right;
    padding-right: 20px;
    color: #adadad;
    font-size: 12px;
    line-height: 24px;
}
.replyItem:hover .replyBtn {
    visibility: visible;
}
.replyItem .replyBtn {
    visibility: hidden;
    display: inline-block;
    cursor: pointer;
    padding-left: 15px;
    color: #3a7de0 !important;
    font-size: 12px;
    line-height: 24px;
    float: right;
    margin-right: 20px;
}
.replyBtn:hover,
.replyCancelBtn:hover {
    color: #379be9;
}
.replyBtn span {
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: 24px;
}

.unReadBg {
    background-color: rgba(0, 188, 212, 0.2);
}
</style>
