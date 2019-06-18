<template>
    <div class="animation-index">
        <b-row class="meta-content-wrapper row">
            <!-- 场景显示 -->
            <!-- <div class="court-flash-container">
                <courtFlash></courtFlash>
                <div class="court-action-wrap" v-if="userInfo.identity === 5" v-loading="isRunning">
                    <functionActions></functionActions>
                    <processActions></processActions>
                </div>
            </div>-->
            <b-col cols="8"></b-col>
            <b-col cols="4">
                <animation-chat></animation-chat>
                <chat-input v-if="userInfo.identity === 5"></chat-input>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from "vuex";
import functionActions from "./function-actions";
// import processActions from './process-actions'
// import courtFlash from "./court-flash";
import AnimationChat from "@/components/business/common/AnimationChat";
import ChatInput from "@/components/business/common/ChatInput";
export default {
    name: "animation-index",
    components: {
        AnimationChat,
        ChatInput,
        // courtFlash,
        // courtChat,
        // chatInput,
        functionActions
        // processActions
    },
    filters: {},
    data() {
        return {};
    },
    created() {
        this.$nextTick(() => {});
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {},
    methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.animation-index {
    .flash-height {
        height: 670px;
    }
    .court-flash-container {
        float: left;
        background-color: #fff;
        width: 830px;
    }
    .court-chat-container {
        background-color: #eee;
    }

    .court-action-wrap {
        padding: 10px;
        height: 140px;
        margin-right: -5px;
    }
    .btn-ex {
        display: inline-block;
        font-size: 12px;
        width: 82px;
        margin-right: 5px;
        height: 31px;
        line-height: 31px;
        text-align: center;
        color: #fff;
        padding: 0;
        -webkit-transition: all 0.3s ease;
        -moz-transition: all 0.3s ease;
        transition: all 0.3s ease;
    }
    .btn-ex-green {
        background-color: #2dcb70;
    }
    .btn-ex-green:hover {
        background-color: #00c175;
        color: #fff;
    }
    .btn-ex-blue {
        background-color: #68a3d582;
    }
    .btn-ex-blue:hover {
        background-color: #58acf3;
        color: #fff;
    }
    .action-container .btn-ex {
        text-decoration: none;
        margin-bottom: 10px;
    }
    .speak-container .speak-field {
        height: 120px;
        border-bottom: 1px solid #cdcdcd;
    }
    @media screen and (max-width: 1380px) {
        .court-flash-container {
            width: 760px;
        }
        .court-chat-container {
            margin-left: 760px;
        }
        .flash-height {
            height: 560px;
        }
        .speak-container .speak-field {
            height: 86px;
        }
        .court-action-wrap {
            height: 158px;
        }
        .btn-ex {
            width: 66px;
            height: 26px;
            line-height: 26px;
        }
    }
    @media screen and (min-width: 1380px) and (max-width: 1600px) {
        .court-flash-container {
            width: 900px;
        }
        .court-chat-container {
            margin-left: 900px;
        }
        .flash-height {
            height: 680px;
        }
        .speak-container .speak-field {
            height: 88px;
        }
        .court-action-wrap {
            height: 160px;
        }
    }
}
</style>