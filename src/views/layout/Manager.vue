<template>
    <div class="manager-container main-bg" style="height: 100%; overflow: auto">
        <TopHeader v-if="userInfo">
            <template v-slot:pageMenu>
                <b-nav-item v-if="[1,2,3,6,7].includes(userInfo.role)" to="/manager/workflow">
                    <icon name="sitemap" class="tabIcon"></icon>流程管理
                </b-nav-item>
                <b-nav-item v-if="[1,2,3,6,7].includes(userInfo.role)" to="/manager/project">
                    <icon name="tags" class="tabIcon"></icon>项目管理
                </b-nav-item>
                <b-nav-item v-if="userInfo.role===1" to="/manager/group">
                    <icon name="users-cog" class="tabIcon"></icon>集群管理
                </b-nav-item>
                <b-nav-item v-if="[2,6].includes(userInfo.role)" to="/manager/group_company">
                    <icon name="users" class="tabIcon"></icon>集群及单位管理
                </b-nav-item>
                <b-nav-item v-if="userInfo.role===1" to="/manager/module_manage">
                    <icon name="project-diagram" class="tabIcon"></icon>元模块管理
                </b-nav-item>
                <b-nav-item v-if="[1,2,3,6,7].includes(userInfo.role)" to="/manager/user/0">
                    <icon name="user-cog" class="tabIcon"></icon>用户管理
                </b-nav-item>
                <b-nav-item v-if="userInfo.role === 3 && userInfo.companyType_name === '学校'" to="/manager/course">
                    <icon name="university" class="tabIcon"></icon>课堂管理
                </b-nav-item>
                <b-nav-item
                    v-if="[1,2,3,6,7].includes(userInfo.role) && isSystemSetAllowed"
                    to="/manager/system-set"
                >
                    <icon name="cogs" class="tabIcon"></icon>系统设置
                </b-nav-item>
                <b-nav-item v-if="[2,6,3,7].includes(userInfo.role)" to="/manager/business">
                    <icon name="list" class="tabIcon"></icon>业务管理
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
        return {
            activatedRoute: "workflow"
        };
    },
    created() {},
    computed: {
        isSystemSetAllowed() {
            if ([2, 6].includes(this.userInfo.role)) {
                if (!this.isPermissionAllowed("code_system_set_management")) {
                    return false;
                }
            } else if ([3, 7].includes(this.userInfo.role)) {
                if (
                    !this.isPermissionAllowed("code_system_set_management") &&
                    !this.isPermissionAllowed("code_company_management")
                ) {
                    return false;
                }
            }
            return true;
        }
    },
    watch: {
        $route: "checkActiveRoute"
    },
    methods: {
        checkActiveRoute(to) {
            if (to.path.indexOf("workflow") !== -1) {
                this.activatedRoute = "workflow";
            } else if (to.path.indexOf("project") !== -1) {
                this.activatedRoute = "project";
            } else if (to.path.indexOf("group") !== -1) {
                this.activatedRoute = "group";
            }
        }
    }
};
</script>
