<template>
    <div class="business-container main-bg" style="height: 100%; overflow: auto">
        <TopHeader v-if="userInfo">
            <template v-slot:pageMenu>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/search">
                    <icon name="list" class="tabIcon"></icon>业务查找
                </b-nav-item>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/completed">
                    <icon name="box-open" class="tabIcon"></icon>办理中业务
                </b-nav-item>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/progress">
                    <icon name="box" class="tabIcon"></icon>已完成业务
                </b-nav-item>
            </template>
        </TopHeader>
        <div class="container" style="min-height: calc(100vh - 210px); padding: 130px 0 0 0;">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import prefixRoute from "@/mixins/prefix-route";
import TopHeader from "@/components/header/TopHeader";
export default {
    mixins: [prefixRoute],
    components: {
        TopHeader
    },
    data() {
        return {};
    },
    created() {},
    computed: {
    },
    watch: {},
    methods: {}
};
</script>
