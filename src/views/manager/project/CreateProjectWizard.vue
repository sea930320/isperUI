<template>
    <div class="project-edit-main">
        <!-- Tabs with card integration -->
        <b-tabs v-if="userInfo.role !== 1" v-model="tabIndex" class="m-4">
            <b-tab title="基 本 信 息">
                <CreateProjectWizard1 v-model="tabIndex"/>
            </b-tab>
            <b-tab title="环节及身份配置">
                <CreateProjectWizard2 v-model="tabIndex"/>
            </b-tab>
            <b-tab title="素 材 设 置">
                <CreateProjectWizard3 v-model="tabIndex"/>
            </b-tab>
            <b-tab title="跳 转 设 置">
                <CreateProjectWizard4 v-model="tabIndex"/>
            </b-tab>
        </b-tabs>
        <CreateProjectWizard1 v-if="userInfo.role === 1" />
    </div>
</template>

<script>
    import CreateProjectWizard1 from "./CreateProjectWizard1";
    import CreateProjectWizard2 from "./CreateProjectWizard2";
    import CreateProjectWizard3 from "./CreateProjectWizard3";
    import CreateProjectWizard4 from "./CreateProjectWizard4";
    import {mapState} from "vuex";
    export default {
        name: "project-edit-main",
        components: {
            CreateProjectWizard1,
            CreateProjectWizard2,
            CreateProjectWizard3,
            CreateProjectWizard4
        },
        computed: {
            ...mapState(["userInfo"])
        },
        data() {
            return {
                tabIndex: 0
            }
        }
    }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .project-edit-main {
        .nav.nav-tabs {
            justify-content: center!important;
        }
    }
</style>