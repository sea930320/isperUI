<template>
    <div class="message-view container">
        <PersonalCenterTab activeTab="3"/>
        <div @submit.prevent="updateInfo" class="cardDiv">
            <b-list-group>
                <b-list-group-item v-for="item in message"
                    :to="parseInt(item.moreTeammates) ? {name: item.link, params: { messageId: item }} : item.link" :key="item.id">
                    {{ parseInt(item.moreTeammates) ? item.businessInfo.title + ' : 需要补充参加业务的人' : item.content}}
                </b-list-group-item>
            </b-list-group>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
    import store from '@/store'

    export default {
        name: "message-view",
        components: {PersonalCenterTab},
        data() {
            return {};
        },
        computed: {
            ...mapState(["userInfo"]),
            message() {
                return store.getters.getMsg
            }
        },
        created() {
        },
        methods: {}
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .message-view {
        .list-group-item {
            text-align: left;
        }
    }
</style>