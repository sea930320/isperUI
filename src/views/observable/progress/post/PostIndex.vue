<template>
  <div class="post-index">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col sm="12">
        <div class="cardDiv text-left">
          <div style="border-bottom: 1px solid #c1c1c1" class="mb-2">
            <b>{{post_name}}</b>
          </div>
          <div v-html="post_content"></div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import BusinessService from "@/services/businessService";
import { mapState } from "vuex";

export default {
  components: { Loading },
  data() {
    return {
      post_name: "",
      post_content: ""
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {},
  mounted() {},
  methods: {
    init() {
      this.run();
      BusinessService.getPost({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid
      })
        .then(data => {
          this.post_name = data.name || "";
          this.post_content = data.content || "";
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.post-index {
  .create-btns {
    display: flex;
    justify-content: center;
  }
}
</style>
