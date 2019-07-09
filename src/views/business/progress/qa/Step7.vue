<template>
  <div class="qa-step7">Step7</div>
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
.qa-step7 {
}
</style>