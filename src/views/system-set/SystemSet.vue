<template>
    <div class="system-set" v-if="userInfo">
        <b-tabs v-if="userInfo.identity===1">
            <b-tab title="角色管理">
                <role-management/>
            </b-tab>
            <b-tab title="安全维护" class="pt-2">
                <b-tabs class="security-log">
                    <b-tab title="操作日志">
                        <work-log/>
                    </b-tab>
                    <b-tab title="登录记录">
                        <login-log/>
                    </b-tab>
                    <b-tab title="记录统计">
                        <log-statistic/>
                    </b-tab>
                </b-tabs>
            </b-tab>
            <b-tab title="字典管理">
                <Dictionary/>
            </b-tab>
            <b-tab title="公告管理">
                <Advertising/>
            </b-tab>
        </b-tabs>
        <b-tabs v-if="[2,6].includes(userInfo.identity)">
            <b-tab
                title="操作日志"
                v-if="isActionAllowed('code_system_set_management', 'code_work_log_system_set')"
            >
                <work-log/>
            </b-tab>
            <b-tab
                title="登录记录"
                v-if="isActionAllowed('code_system_set_management', 'code_login_log_system_set')"
            >
                <login-log/>
            </b-tab>
            <b-tab
                title="记录统计"
                v-if="isActionAllowed('code_system_set_management', 'code_log_statistics_system_set')"
            >
                <log-statistic/>
            </b-tab>
        </b-tabs>
        <b-tabs v-if="[3,7].includes(userInfo.identity)">
            <b-tab
                title="部门及职务管理"
                v-if="isActionAllowed('code_company_management', 'code_part_position_management_company')"
            >
                <PartPosition/>
            </b-tab>
            <b-tab
                title="内部权限管理"
                v-if="isActionAllowed('code_company_management', 'code_inner_permission_company')"
            >
                <InnerPermission/>
            </b-tab>
            <b-tab title="日志管理" class="pt-2" v-if="isLogManagementAllowed">
                <b-tabs class="security-log">
                    <b-tab
                        title="操作日志"
                        v-if="isActionAllowed('code_system_set_management', 'code_work_log_system_set')"
                    >
                        <work-log/>
                    </b-tab>
                    <b-tab
                        title="登录记录"
                        v-if="isActionAllowed('code_system_set_management', 'code_login_log_system_set')"
                    >
                        <login-log/>
                    </b-tab>
                    <b-tab
                        title="记录统计"
                        v-if="isActionAllowed('code_system_set_management', 'code_log_statistics_system_set')"
                    >
                        <log-statistic/>
                    </b-tab>
                </b-tabs>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import RoleManagement from "./RoleManagement";
import LoginLog from "./LoginLog";
import WorkLog from "./WorkLog";
import Dictionary from "./Dictionary";
import Advertising from "./advertising/Advertising";
import PartPosition from "./PartPosition";
import InnerPermission from "./InnerPermission";
import LogStatistic from "./LogStatistic";
import { mapState } from "vuex";

export default {
    name: "system-set",
    components: {
        RoleManagement,
        WorkLog,
        LoginLog,
        Dictionary,
        PartPosition,
        InnerPermission,
        Advertising,
        LogStatistic
    },
    computed: {
        ...mapState(["userInfo"]),
        isLogManagementAllowed() {
            if (this.userInfo.role === 7) {
                if (!this.isPermissionAllowed("code_system_set_management")) {
                    return false;
                }
            }
            return true;
        }
    },
    created() {},
    methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.system-set {
    .tabs {
        ul.nav-tabs {
            justify-content: center;

            .nav-link.active,
            .nav-item.show .nav-link {
                color: #007bff !important;
                background-color: transparent;
            }

            .nav-item .nav-link {
                color: #253568;
            }
        }
    }

    .tabs.security-log {
        ul.nav-tabs {
            border-bottom: 0px !important;

            .nav-link.active,
            .nav-item.show .nav-link {
                color: #007bff;
                background-color: transparent;
            }

            .nav-item {
                border-bottom: 1px solid #dee2e6;
            }

            .nav-link.active,
            .nav-item.show .nav-link {
                border: 0px solid;
            }
        }
    }

    .nav-item {
        width: 10%;
    }
}
</style>