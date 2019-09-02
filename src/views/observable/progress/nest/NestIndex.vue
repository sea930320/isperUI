<template>
  <div class="nest-index">
    <div>
      <end-node-handle :isCommit="commitEnd" :fromNest="true" @on-cancel="endNodeCancel"></end-node-handle>
    </div>
  </div>
</template>

<script>
// import businessService from "@/services/businessService";
import { mapState } from "vuex";
import endNodeHandle from "@/components/business/modal/endNodeHandle";

export default {
  components: { endNodeHandle },
  filters: {},
  data() {
    return {
      commitEnd: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.commitEnd = true;
    });
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      metaInfo: state => state.meta.info,
      experiences: state => state.meta.experiences,
      currentRoleAllocation: state => state.meta.currentRoleAllocation
    }),
    canTerminate() {
      if (
        this.currentRoleAllocation &&
        this.currentRoleAllocation.can_terminate
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {},
  methods: {
    endNodeCancel() {
      this.commitEnd = false;
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.nest-index {
}
</style>