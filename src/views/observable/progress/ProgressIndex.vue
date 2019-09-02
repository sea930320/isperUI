<template>
  <div class="progress-index">
    <div class="container" style="min-height: calc(100vh - 210px); padding: 110px 0 0 0;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "progress-index",
  components: {},
  sockets: {
    connect() {},
    getMessage(msg) {
      msg = msg.result;
      if (msg.business !== this.$route.params.bid) {
        return;
      }
      // 需要刷新按钮状态的命令
      this.dispatchFlashAction(msg);
    }
  },
  filters: {},
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {},
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    ...mapActions([
      "getBusinessDetail",
      "getBusinessNodeDetail",
      "setCurrentRoleAllocation",
      "getBusinessNodeMessages",
      "getBusinessNodeFunction",
      "getBusinessNodeDocs",
      "dispatchFlashAction"
    ]),
    init() {}
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
