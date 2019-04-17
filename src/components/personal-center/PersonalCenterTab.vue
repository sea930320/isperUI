<template>
  <div class="personal-center-tab">
    <b-tabs>
      <template slot="tabs">
        <b-nav-item :active="activeTab==0" :to="prefixRoute + 'personal-info'">个人信息</b-nav-item>
        <b-nav-item :active="activeTab==1" :to="prefixRoute + 'password-reset'">重置密码</b-nav-item>
        <b-nav-item :active="activeTab==2" :to="prefixRoute + 'assistant-set'">配置助理</b-nav-item>
      </template>
    </b-tabs>
  </div>
</template>
<script>
import prefixRoute from "@/mixins/prefix-route";

export default {
  mixins: [prefixRoute],
  props: ["activeTab"],
  components: {},
  created() {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.personal-center-tab {
  .tabs {
    ul.nav-tabs {
      justify-content: center;
      border-bottom: 0px;
    }
  }
}
</style>