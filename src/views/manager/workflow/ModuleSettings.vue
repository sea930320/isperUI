<template>
    <div class="module-settings">
        <b-tabs class="menu-select">
            <b-tab title="动画">
                <b-tabs class="animation-setting">
                    <b-tab title="动作设置">
                        <action-settings></action-settings>
                    </b-tab>
                    <b-tab title="动画设置">
                        <animation-settings></animation-settings>
                    </b-tab>
                    <b-tab title="角色设置">
                        <position-settings></position-settings>
                    </b-tab>
                </b-tabs>
            </b-tab>
            <b-tab title="判断与选择"></b-tab>
        </b-tabs>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ActionSettings from "@/views/manager/workflow/ActionSettings";
import AnimationSettings from "@/views/manager/workflow/AnimationSettings";
import PositionSettings from "@/views/manager/workflow/PositionSettings";
export default {
    name: "module-settings",
    components: { ActionSettings, AnimationSettings, PositionSettings },
    data() {
        return {};
    },
    computed: {
        ...mapState(["userInfo", "flowStep"]),
        flowId() {
            return this.$route.params.flow_id;
        }
    },
    created() {
        this.$nextTick(() => {});
    },
    watch: {},
    methods: {
        ...mapActions(["setFlowStep"])
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.module-settings {
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

    .menu-select {
        ul.nav-tabs {
            justify-content: left;
            border-bottom: 0px !important;
            padding-top: 10px;
            .nav-link.active,
            .nav-item.show .nav-link {
                color: #007bff;
                background: #a4b4e6;
            }
        }
        .animation-setting {
            ul.nav-tabs {
                justify-content: center;
                .nav-link.active,
                .nav-item.show .nav-link {
                    color: #007bff;
                    background-color: transparent;
                }
            }
        }
    }
}
</style>