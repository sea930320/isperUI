<template>
  <step2 v-if="current_step==11" />
  <wait v-else-if="current_step==1"></wait>
</template>
<script type="text/ecmascript-6">
import step2 from "@/views/observable/progress/distribute_sign/DistributeIndex_step2";
import wait from "@/views/observable/progress/distribute_sign/DistributeIndex_wait";
import businessService from "@/services/businessService";
export default {
  name: "distribute",
  components: { step2, wait },
  data() {
    return {
      current_step: 0
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
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // get state from server
      this.getStep();
    },
    getStep() {
      businessService
        .getBusinessStepStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid
        })
        .then(val => {
          this.current_step = val.step;
        });
    }
  }
};
</script>
