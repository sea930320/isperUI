<template>
  <div class="module-settings">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv px-0">
      <b-col>Module Settings</b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
export default {
  name: "module-settings",
  components: { Loading },
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
}
</style>