<template>
  <div class="settings-base">
    <div class="nav-wrapper">
      <b-nav tabs>
        <b-nav-item :to="{ name: 'setworkflow-node', params: { flow_id: flowId }}">环节设置</b-nav-item>
        <b-nav-item :to="{ name: 'setworkflow-doc', params: { flow_id: flowId }}">素材设置</b-nav-item>
        <b-nav-item :to="{ name: 'setworkflow-role', params: { flow_id: flowId }}">身份配置</b-nav-item>
        <b-nav-item :to="{ name: 'setworkflow-module', params: { flow_id: flowId }}">元模块配置</b-nav-item>
      </b-nav>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flowId: this.$route.params.flow_id
    };
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.settings-base {
  ul.nav-tabs {
    justify-content: center;

    .nav-link.active,
    .nav-item.show .nav-link {
      color: #007bff !important;
      background-color: transparent;
    }

    .nav-item .nav-link {
      color: #253568;
    }
  }
}
</style>