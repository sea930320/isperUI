<template>
  <div class="qa-step5">Step5</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"]),
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  methods: {
    init() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step5 {
}
</style>