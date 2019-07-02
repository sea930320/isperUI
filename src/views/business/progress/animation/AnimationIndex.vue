<template>
    <div class="court-container animation-index">
        <div class="meta-content-wrapper container">
            <!-- 场景显示 -->
            <div class="court-flash-container">
                <courtFlash></courtFlash>
                <div class="court-action-wrap" v-if="userInfo.identity === 5" v-loading="isRunning">
                    <functionActions></functionActions>
                    <processActions></processActions>
                </div>
            </div>
            <div class="court-chat-container">
                <animation-chat></animation-chat>
                <chatInput v-if="userInfo.identity === 5"></chatInput>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import chatInput from "@/components/business/common/ChatInput";
import functionActions from "./function-actions";
import processActions from "./process-actions";
import courtFlash from "./court-flash";
import AnimationChat from "@/components/business/common/AnimationChat";
export default {
    name: "animation-index",
    components: {
        courtFlash,
        AnimationChat,
        chatInput,
        functionActions,
        processActions
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
        height: 810px;
        margin-left: 900px;
        width: 680px;
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
        background-color: darkgrey;
    }
    .btn-ex-blue:hover {
        background-color: lightgrey;
        color: #fff;
    }
    .action-container .btn-ex {
        text-decoration: none;
        margin-bottom: 10px;
    }
    .speak-container .speak-field {
        border-bottom: 1px solid #cdcdcd;
    }
    @media screen and (max-width: 1600px) {
        .court-flash-container {
            width: 900px;
        }
        .court-chat-container {
            margin-left: 900px !important;
            height: 840px !important;
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