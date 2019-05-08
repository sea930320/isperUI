<template>
    <div class="user-manage-index">
        <b-tabs v-if="userInfo.identity===1">
            <b-tab title="普通用户">
                <SuperUser1/>
            </b-tab>
            <b-tab title="管理员用户">
                <SuperUser2/>
            </b-tab>
            <b-tab title="指导者用户">
                <SuperUser3/>
            </b-tab>
            <b-tab title="学校学生">
                <SuperUser4/>
            </b-tab>
        </b-tabs>
        <b-tabs v-if="userInfo.identity===2">
            <b-tab title="用户管理">
                <b-tabs class="mt-2">
                    <b-tab title="用户管理">
                        <GroupUser1_1/>
                    </b-tab>
                    <b-tab title="非单位注册审核">
                        <GroupUser1_2/>
                    </b-tab>
                </b-tabs>
            </b-tab>
            <b-tab title="变更集群审核">
                <GroupUser2/>
            </b-tab>
        </b-tabs>
        <b-tabs v-if="userInfo.identity===3">
            <b-tab title="用户管理">
                <b-tabs class="mt-2">
                    <b-tab title="用户管理">
                        <CompanyUser1_1/>
                    </b-tab>
                    <b-tab title="用户注册审核">
                        <CompanyUser1_2/>
                    </b-tab>
                </b-tabs>
            </b-tab>
            <b-tab title="变更单位审核">
                <CompanyUser2/>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import SuperUser1 from './SuperUser1';
    import SuperUser2 from './SuperUser2';
    import SuperUser3 from './SuperUser3';
    import SuperUser4 from './SuperUser4';
    import GroupUser1_1 from './GroupUser1_1';
    import GroupUser1_2 from './GroupUser1_2';
    import GroupUser2 from './GroupUser2';
    import CompanyUser1_1 from './CompanyUser1_1';
    import CompanyUser1_2 from './CompanyUser1_2';
    import CompanyUser2 from './CompanyUser2';

    export default {
        name: "user-manage-index",
        components: {
            SuperUser1,
            SuperUser2,
            SuperUser3,
            SuperUser4,
            GroupUser1_1,
            GroupUser1_2,
            GroupUser2,
            CompanyUser1_1,
            CompanyUser1_2,
            CompanyUser2
        },
        computed: {
            ...mapState(["userInfo"])
        },
        created() {
        },
        methods: {
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .user-manage-index {
        .tabs {
            ul.nav-tabs {
                justify-content: center;

                .nav-link.active,
                .nav-item.show .nav-link {
                    color: #007bff !important;
                    background-color: transparent;
                }
            }
        }

        .nav-item {
            width: 10%;
        }

        .mt-2 .nav.nav-tabs{
            width: 20%;
            margin: auto;
        }
        .mt-2 .nav-item {
            width: 50%;
        }
    }
</style>