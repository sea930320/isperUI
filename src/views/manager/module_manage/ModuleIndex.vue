<template>
    <div class="super-module-manage">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col cols="2">
                <b-card no-body>
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block href="#" variant="primary" style="font-size: 20px"><strong>普通元模块</strong></b-button>
                    </b-card-header>
                    <div role="tablist">

                        <b-card no-body class="border-0">
                            <b-card-header header-tag="header" role="tab">
                                <b-button block href="#" v-b-toggle.accordion-1 class="bg-grey fontedBtn">文件类元模块</b-button>
                            </b-card-header>
                            <b-collapse id="accordion-1" visible role="tabpanel">
                                <b-list-group>
                                    <b-list-group-item @click="changeUrl('Edit')">编辑</b-list-group-item>
                                    <b-list-group-item @click="changeUrl('Publicity')">公示</b-list-group-item>
                                    <b-list-group-item>展示</b-list-group-item>
                                    <b-list-group-item>交付与签收</b-list-group-item>
                                    <b-list-group-item>法案制作</b-list-group-item>
                                </b-list-group>
                            </b-collapse>
                        </b-card>

                        <b-card no-body class="border-0">
                            <b-card-header header-tag="header" role="tab">
                                <b-button block href="#" v-b-toggle.accordion-2 class="bg-grey fontedBtn">数据收集元模块</b-button>
                            </b-card-header>
                            <b-collapse id="accordion-2" visible role="tabpanel">
                                <b-list-group>
                                    <b-list-group-item>投票</b-list-group-item>
                                    <b-list-group-item>判断与选择</b-list-group-item>
                                    <b-list-group-item>表决</b-list-group-item>
                                    <b-list-group-item>调查问卷</b-list-group-item>
                                </b-list-group>
                            </b-collapse>
                        </b-card>

                        <b-card no-body class="border-0">
                            <b-card-header header-tag="header" role="tab">
                                <b-button block href="#" v-b-toggle.accordion-3 class="bg-grey fontedBtn">流程走向元模块</b-button>
                            </b-card-header>
                            <b-collapse id="accordion-3" visible role="tabpanel">
                                <b-list-group>
                                    <b-list-group-item>跳转</b-list-group-item>
                                    <b-list-group-item>嵌套</b-list-group-item>
                                    <b-list-group-item>心得</b-list-group-item>
                                </b-list-group>
                            </b-collapse>
                        </b-card>

                    </div>
                </b-card>
                <b-card no-body>
                    <b-card-header header-tag="header" role="tab">
                        <b-button block href="#" variant="primary" style="font-size: 20px"><strong>动画场景元模块</strong></b-button>
                    </b-card-header>
                    <b-card no-body class="border-0">
                        <b-card-header header-tag="header" role="tab">
                            <b-button block href="#" v-b-toggle.accordion-4 class="bg-grey fontedBtn">动画场景元模块</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-4" visible role="tabpanel">
                            <b-list-group>
                                <b-list-group-item>动画1</b-list-group-item>
                                <b-list-group-item>动画2</b-list-group-item>
                                <b-list-group-item>动画3</b-list-group-item>
                                <b-list-group-item>动画4</b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-card>
                </b-card>
            </b-col>
            <b-col cols="10">
                <div class="cardDiv my-0">
                    <div>
                        <img v-bind:src="require('@/assets/module/' + currentUrl + '.jpg')" class="w-100"/>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import GroupService from "@/services/groupService";

    export default {
        name: "super-module-manage",
        components: {
            Loading,
        },
        data() {
            return {
                currentUrl: 'Edit'
            }
        },
        created() {
            this.$nextTick(() => {
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
        },
        methods: {
            changeUrl(url) {
                this.currentUrl = url;
            },
            getGroupList() {
                GroupService
                    .fetchAllGroupDetail()
                    .then(() => {
                    })
                    .catch(() => {});
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .super-module-manage {
        .card header {
            padding: 0 !important;
            border-radius: 0 !important;
            a {
                border-radius: 0;
            }
        }
        .bg-grey {
            background-color: darkgrey;
            color: black;
            border: none;
        }
        .btn-secondary:focus {
            box-shadow: none;
        }
        .btn-secondary:active:focus {
            box-shadow: none;
        }
        .list-group-item {
            padding: 0.4rem 1.25rem !important;
            border: none !important;
            height: 30px !important;
            font-size: 18px !important;
            line-height: 18px;
            border-radius: 0 !important;
        }
        .list-group-item:hover {
            background-color: #4169e14a;
            color: white !important;
            cursor: pointer;
            button {
                background-color: transparent;
                svg {
                    color: white !important;
                }
            }
        }

    }
</style>
