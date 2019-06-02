<template>
    <div class="business-index" v-if="userInfo">
        <b-tabs v-if="userInfo.identity===2" v-model="selected">
            <b-tab title="业务管理">
                <BusinessShow/>
            </b-tab>
            <b-tab title="恢复业务">
                <BusinessRecovery  />
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import BusinessShow from "./BusinessShow";
    import BusinessRecovery from "./BusinessRecovery";
    import {mapState} from "vuex";
    export default {
        name: "business-index",
        components: {
            BusinessShow,
            BusinessRecovery,
        },
        computed: {
            ...mapState(["userInfo"]),
            activeTab1:() => {
                alert('activeTab1');
            },
            activeTab2:() => {
                alert('activeTab2');
            }
        },
        data() {
            return {
                activeTabContent: 'bManager',
                selected:0,
            };
        },
        watch:{
            selected(value) {
                if (value ==1){
                    this.$emit('refreshBRecovery');
                } else {
                    this.$emit('refreshBManager');
                }
            }
        },
        methods: {
//            activeTab1(){
//                if (this.activeTabContent === 'bManager'){
//                    return
//                } else {
//                    this.activeTabContent = 'bManager';
//                }
//                this.$emit('refreshBManager');
//            },
//            activeTab2(){
//                if (this.activeTabContent === 'bRecovery'){
//                    return
//                } else {
//                    this.activeTabContent = 'bRecovery';
//                }
//                this.$emit('refreshBRecovery');
//            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .business-index {
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