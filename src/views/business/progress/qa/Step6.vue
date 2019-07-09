<template>
  <div class="qa-step6">Step6</div>
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
.qa-step6 {
}
</style>