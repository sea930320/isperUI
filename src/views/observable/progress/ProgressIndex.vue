<template>
  <div class="progress-index">
    <div class="container" style="min-height: calc(100vh - 210px); padding: 110px 0 0 0;">
      <router-view></router-view>
      <h4 style="color:#007bff; cursor: pointer;" class="mt-3">
        <a class="btn btn-primary" style="color:white;" title="返回" @click="$router.go(-1)">
          <icon name="arrow-left"></icon>&nbsp;返回
        </a>
      </h4>
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
      if (msg.business != this.$route.params.bid) {
        return;
      }
      // 需要刷新按钮状态的命令
      this.dispatchFlashAction(msg);
      this.$store.dispatch("sendMessage", msg);
    }
  },
  filters: {},
  data() {
    return {
      metaInfo: {
        businessID: null,
        nodeID: null,
        processType: null
      }
    };
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
    init() {
      this.fetchBusinessDetail();
    },
    fetchBusinessDetail() {
      this.getBusinessDetail({
        business_id: this.$route.params.bid
      }).then(data => {
        this.metaInfo.businessID = data.id;
        this.metaInfo.nodeID = data.node.id;
        this.metaInfo.processType = data.node.process_type;
        this.fetchBusinessNodeDetail();
      });
    },
    // 获取功能按钮及其状态
    fetchBusinessNodeDetail() {
      this.getBusinessNodeDetail({
        business_id: this.metaInfo.businessID,
        node_id: this.metaInfo.nodeID,
        roleAllocID: "observable"
      })
        .then(() => {})
        .catch(() => {
          this.$router.go(-1);
        });

      this.initAnimationData();
    },
    // 初始化动画（法庭）环节数据
    initAnimationData() {
      // 动画模块数据
      if (this.metaInfo.processType === 1) {
        // 获取业务历史消息
        this.getBusinessNodeMessages({
          business_id: this.metaInfo.businessID,
          node_id: this.metaInfo.nodeID,
          is_paging: 0
        });
      }

      // 获取业务素材
      this.getBusinessNodeDocs({
        business_id: this.metaInfo.businessID,
        node_id: this.metaInfo.nodeID,
        role_alloc_id: "observable"
      });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
