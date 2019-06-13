<template>
    <div class="court-container">
        <div class="meta-content-wrapper row">
            <!-- 场景显示 -->
            <div class="court-flash-container">
                <courtFlash></courtFlash>
                <div class="court-action-wrap" v-if="userInfo.identity === 1" v-loading="btnLoading">
<!--                    <functionActions></functionActions>-->
<!--                    <processActions></processActions>-->
                </div>
            </div>
            <div class="court-chat-container">
<!--                <courtChat></courtChat>-->
<!--                <chatInput v-if="userInfo.identity === 1"></chatInput>-->
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
// import chatInput from './chat-input'
// import functionActions from './function-actions'
// import processActions from './process-actions'
import courtFlash from './court-flash'
// import courtChat from './court-chat'
export default {
    name: "animation-index",
    components: {
        courtFlash,
        // courtChat,
        // chatInput,
        // functionActions,
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
        height: 800px;
    }
    .court-flash-container {
        float: left;
        background-color: #eee;
        width: 1000px;
    }
    .court-chat-container {
        margin-left: 1000px;
        background-color: #eee;
    }

    .court-action-wrap {
        padding: 10px;
        height: 192px;
        margin-right: -5px;
    }
    .btn-ex{
        display: inline-block;
        font-size: 12px;
        width: 82px;
        margin-right: 5px;
        height: 31px;
        line-height: 31px;
        text-align: center;
        color: #fff;
        padding: 0;
        -webkit-transition: all .3s ease;
        -moz-transition: all .3s ease;
        transition: all .3s ease;
    }
    .btn-ex-green{
        background-color: #2DCB70;
    }
    .btn-ex-green:hover{
        background-color: #00c175;
        color: #fff;
    }
    .btn-ex-blue{
        background-color: #68a3d5;
    }
    .btn-ex-blue:hover{
        background-color: #44a5f7;
        color: #fff;
    }
    .action-container .btn-ex {
        margin-bottom: 10px;
    }
    .speak-container .speak-field{
        height: 120px;
        border-bottom: 1px solid #cdcdcd;
    }
    @media screen and (max-width: 1380px){
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
    @media screen and (min-width: 1380px)  and (max-width: 1600px){
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