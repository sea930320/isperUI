<template>
    <div class="business-container main-bg" style="height: 100%; overflow: auto">
        <TopHeader v-if="userInfo && !hideMenu">
            <template v-slot:pageMenu>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/prepare">
                    <icon name="list" class="tabIcon"></icon>业务查找
                </b-nav-item>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/list/progress">
                    <icon name="box-open" class="tabIcon"></icon>办理中业务
                </b-nav-item>
                <b-nav-item v-if="[5].includes(userInfo.role)" to="/business/list/done">
                    <icon name="box" class="tabIcon"></icon>已完成业务
                </b-nav-item>
            </template>
        </TopHeader>
        <div v-bind:style="{minHeight: styleMinHeight, padding: stylePadding}">
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
        hideMenu() {
            if (this.$route.path.indexOf("business/progress") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        stylePadding() {
            if (this.hideMenu) {
                return "0px";
            } else {
                return "130px 0 0 0";
            }
        },
        styleMinHeight() {
            if (this.hideMenu) {
                return "100vh";
            } else {
                return "calc(100vh - 210px)";
            }
        }
    },
    watch: {},
    methods: {}
};
</script>
