<template>
  <div class="manager-container main-bg">
    <TopHeader>
      <template v-slot:pageMenu>
        <b-nav-item to="/manager/workflow">流程管理</b-nav-item>
        <b-nav-item to="#">项目管理</b-nav-item>
        <b-nav-item to="#">用户管理</b-nav-item>
        <b-nav-item to="#">课程管理</b-nav-item>
      </template>
    </TopHeader>
    <div class="container pt-3" style="min-height: calc(100vh - 62px)">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import TopHeader from "@/components/header/TopHeader";
export default {
  components: {
    TopHeader
  },
  created() {}
};
</script>
