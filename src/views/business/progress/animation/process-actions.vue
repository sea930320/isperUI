<template>
  <div class="process-action-container action-container text-left">
    <a v-for="action in processActions" href="javascript:" :key="action.id" class="btn-ex btn-ex-green" @click="dispatch(action)">{{action.name}}</a>
  </div>
</template>
<script >
import businessService from "@/services/businessService";
export default {
  name: 'MetaCourtProcessBtns',
  data() {
    return {
      // 是否是第一次点击按钮
      isClicked: false,
      // 当前点击时间
      currentTime: 0,
      // 两次点击时间间隔
      clickGap: 0
    }
  },
  computed: {
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    },
    processActions() {
      return this.$store.state.meta.process_actions
    }
  },
  methods: {
    dispatch(action) {
      if (!this.isClicked) {
        this.currentTime = (new Date()).getTime();
        this.isClicked = true;
        this.sendMessage(action);
        return
      }

      this.clickGap = (new Date()).getTime() - this.currentTime;

      if (this.isClicked && this.clickGap < 2000) {
        this.$toast.warn('两次点击间隔相差小于2秒，请销等');
        return
      }
      // 发送消息
      this.currentTime = (new Date()).getTime();
      this.sendMessage(action)
    },
    sendMessage(action) {
      businessService.pushMessage({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        role_alloc_id: this.currentRoleAllocation.alloc_id,
        type: 'cmd',
        msg: action.name,
        cmd: 'action_trans',
        param: action.cmd
      })
    }
  }
}
</script>
