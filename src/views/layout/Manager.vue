<template>
  <div class="manager-container main-bg">
    <TopHeader>
      <template v-slot:pageMenu>
        <b-nav-item to="/manager/workflow" :active="activatedRoute=='workflow'">流程管理</b-nav-item>
        <b-nav-item to="/manager/project" :active="activatedRoute=='project'">项目管理</b-nav-item>
        <b-nav-item to="/manager/group" :active="activatedRoute=='group'">集群管理</b-nav-item>
        <b-nav-item to="#">用户管理</b-nav-item>
        <b-nav-item to="#">课程管理</b-nav-item>
      </template>
    </TopHeader>`
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
  data() {
    return {
      activatedRoute: "workflow"
    };
  },
  created() {},
  watch: {
    $route: "checkActiveRoute"
  },
  methods: {
    checkActiveRoute(to) {
      if (to.path.indexOf("workflow") !== -1) {
        this.activatedRoute = "workflow";
      } else if (to.path.indexOf("project") !== -1) {
        this.activatedRoute = "project";
      } else if (to.path.indexOf("group") !== -1) {
        this.activatedRoute = "group";
      }
    }
  }
};
</script>
