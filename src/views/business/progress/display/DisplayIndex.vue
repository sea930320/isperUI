<template>
    <step2 v-if="current_step==11" />
    <step1 v-else-if="current_step==1 && currentRoleAllocation.can_terminate"></step1>
    <wait v-else-if="current_step==1 && !currentRoleAllocation.can_terminate"></wait>
    
</template>
<script type="text/ecmascript-6">

import step1 from "@/views/business/progress/display/DisplayIndex_step1"
import step2 from "@/views/business/progress/display/DisplayIndex_step2"
import wait from "@/views/business/progress/display/DisplayIndex_wait"
import businessService from "@/services/businessService";
export default {
    name: "display",
    components: { step1, step2, wait },
    data() {
        return {
            current_step: 0,
        };
    },
    sockets: {
        connect() {},
        getMessage(msg) {
            if (!msg.result) {
                return;
            }
            if (!msg.result.business) {
                return;
            }
            if (msg.result.business === this.$route.params.bid) {
                if (msg.result.msg == "展示-下一頁") {
                    this.getStep();
                }
            }
        }
    },
    computed: {
        currentRoleAllocation() {
            return this.$store.state.meta.currentRoleAllocation;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // get state from server
            this.getStep();
        },
        getStep() {
            businessService.getBusinessStepStatus({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
            })
            .then(val => {
                this.current_step = val.step
            });
        }
    }
};
</script>
