<template>
    <div class="report-index">
        <div>
            <b-card-group>
                <b-card header-tag="header">
                    <b-row slot="header">
                        <b-col lg="3" md="6" sm="12" class="align-self-center">
                            <span class="float-left">
                                任务完成
                            </span>
                        </b-col>
                        <b-col lg="9" md="6" sm="12" class="align-self-center">
                            <b-button-group class="float-right">
                                <b-button
                                        class="styledBtn"
                                        variant="outline-primary"
                                >
                                    导出
                                </b-button>
                            </b-button-group>
                        </b-col>
                    </b-row>
                    <!--<span >Header Slot</span>-->
                    <b-card-text>
                        <!--<VueFaqAccordion-->
                                <!--:items="myItems"-->
                        <!--/>-->

                    </b-card-text>
                </b-card>
            </b-card-group>
        </div>
    </div>
</template>

<script>
//    import VueFaqAccordion from 'vue-faq-accordion'
import BusinessService from '@/services/businessService';
import { mapState } from "vuex";

    export default {
        components: {
//            VueFaqAccordion
        },
        data () {
            return {
                report:{
                    data:{},
                    nodes:[]
                },
                myItems: [
                    {
                        title: 'How many time zones are there in all?',
                        value: 'Given a 24-hour day and 360 degrees of longitude around the Earth',
//                        category: 'Tab-1'
                    },
                    {
                        title: 'How long is a day and year on Venus?',
                        value: 'Venus takes 224.7 Earth days to complete one orbit around the Sun.',
//                        category: 'Tab-2'
                    },
                    {
                        title: 'What animal smells like popcorn?',
                        value: 'Binturongs smell like popcorn.',
//                        category: 'Tab-2'
                    }
                ]
            }
        },
        created() {
            this.$nextTick(() => {
                this.generateBusinessReport();
            });
        },
        computed:{
            ...mapState(["userInfo"]),
        },
        mounted(){},
        methods:{
            generateBusinessReport(){
                this.run();
                BusinessService.genarateBusinessReport({
                    business_id:this.$route.params.bid,
                    user_id:this.userInfo.id
                })
                    .then(data => {
                        alert(data.nodes.length);
//                        data.results.forEach(item => {
//                            if (item.checked === undefined) {
//                                item.checked = false;
//                            }
//                            if (item.locked === undefined) {
//                                item.locked = false;
//                            }
//                        });
//                        this.projects.list = data.results;
//                        this.projects.total = data.paging.count;
//                        this.$emit("data-ready");
                    })
                    .catch(() => {
//                        alert("failed");
//                        this.$emit("data-failed");
                    });
            }
        }
    }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
    .report-index {
        .flash-height {
            height: 800px;
        }
        .court-flash-container {
            float: left;
            background-color: #eee;
            width: 1000px;
        }
        .court-chat-container {
            background-color: #eee;
        }

        .court-action-wrap {
            padding: 10px;
            height: 192px;
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
            background-color: #68a3d5;
        }
        .btn-ex-blue:hover {
            background-color: #44a5f7;
            color: #fff;
        }
        .action-container .btn-ex {
            margin-bottom: 10px;
        }
        .speak-container .speak-field {
            height: 120px;
            border-bottom: 1px solid #cdcdcd;
        }
        @media screen and (max-width: 1380px) {
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
        @media screen and (min-width: 1380px) and (max-width: 1600px) {
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